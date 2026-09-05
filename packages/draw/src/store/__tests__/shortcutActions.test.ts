// 快捷键相关 store action 测试：
// selectIds / toggleFontStyle / moveElementsNoHistory / moveElements 历史快照修复
import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore, historyManager } from '../editorStore'
import { createLinkerInstance } from '@/core/editor/linker'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import { createEmptyDocument, isLinker, type ElementInstance } from '@/types'

/** 测试辅助：注册图形实例（固定位置/尺寸） */
function shape(x: number, y: number, id: string): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', x, y)
  if (!el) throw new Error('rectangle schema missing')
  return { ...el, id, props: { ...el.props, w: 120, h: 60 } }
}

/** 测试辅助：两个图形 + 一条附着连线（a 右锚点 → b 左锚点） */
function setupShapesWithLinker(): { aId: string; bId: string; linkerId: string } {
  const st = useEditorStore.getState()
  const a = shape(100, 100, 'shape-a')
  const b = shape(400, 100, 'shape-b')
  const linker = createLinkerInstance(
    { id: a.id, x: 220, y: 130, angle: Math.PI },
    { id: b.id, x: 400, y: 130, angle: 0 },
    1,
  )
  st.addElement(a)
  st.addElement(b)
  st.addLinker(linker)
  // 夹具创建历史不入栈，保证用例只观测目标操作的历史
  historyManager.clear()
  return { aId: a.id, bId: b.id, linkerId: linker.id }
}

beforeEach(() => {
  historyManager.clear()
  useEditorStore.setState({
    document: createEmptyDocument(),
    selectedIds: new Set(),
    isDirty: false,
    clipboard: null,
  })
})

describe('selectIds', () => {
  it('replace 模式整体替换选区', () => {
    const st = useEditorStore.getState()
    st.addElement(shape(0, 0, 'el-1'))
    st.addElement(shape(0, 0, 'el-2'))
    st.addElement(shape(0, 0, 'el-3'))
    st.selectElement('el-1')
    st.selectIds(['el-2', 'el-3'], 'replace')
    const ids = useEditorStore.getState().selectedIds
    expect(ids.has('el-1')).toBe(false)
    expect(ids.has('el-2')).toBe(true)
    expect(ids.has('el-3')).toBe(true)
  })

  it('add 模式合并现有选区', () => {
    const st = useEditorStore.getState()
    st.addElement(shape(0, 0, 'el-1'))
    st.addElement(shape(0, 0, 'el-2'))
    st.selectElement('el-1')
    st.selectIds(['el-2'], 'add')
    const ids = useEditorStore.getState().selectedIds
    expect(ids.size).toBe(2)
    expect(ids.has('el-1')).toBe(true)
  })

  it('replace 空数组清空选区', () => {
    const st = useEditorStore.getState()
    st.addElement(shape(0, 0, 'el-1'))
    st.selectElement('el-1')
    st.selectIds([], 'replace')
    expect(useEditorStore.getState().selectedIds.size).toBe(0)
  })
})

describe('toggleFontStyle', () => {
  it('同时切换选中的图形与连线，且为单条历史', () => {
    const { aId, linkerId } = setupShapesWithLinker()
    const st = useEditorStore.getState()
    st.selectIds([aId, linkerId], 'replace')
    st.toggleFontStyle('bold')

    const doc = useEditorStore.getState().document
    expect((doc.elements[aId] as ElementInstance).fontStyle.bold).toBe(true)
    expect(doc.elements[linkerId]!.fontStyle?.bold).toBe(true)

    // 单条历史：一次撤销全部还原
    st.undo()
    const after = useEditorStore.getState().document
    expect((after.elements[aId] as ElementInstance).fontStyle.bold ?? false).toBe(false)
    expect(after.elements[linkerId]!.fontStyle?.bold ?? false).toBe(false)
    expect(historyManager.canUndo()).toBe(false)
  })

  it('连线无 fontStyle 时以默认值为基准翻转', () => {
    const { linkerId } = setupShapesWithLinker()
    const st = useEditorStore.getState()
    st.selectIds([linkerId], 'replace')
    st.toggleFontStyle('italic')
    expect(useEditorStore.getState().document.elements[linkerId]!.fontStyle?.italic).toBe(true)
  })

  it('空选区为无操作', () => {
    useEditorStore.getState().toggleFontStyle('bold')
    expect(historyManager.canUndo()).toBe(false)
  })
})

describe('方向键批处理（moveElementsNoHistory + beginBatch/commitBatch）', () => {
  it('moveElementsNoHistory 移动但不记历史', () => {
    const { aId } = setupShapesWithLinker()
    const st = useEditorStore.getState()
    st.moveElementsNoHistory([aId], 10, 0)
    expect((useEditorStore.getState().document.elements[aId] as ElementInstance).props.x).toBe(110)
    expect(historyManager.canUndo()).toBe(false)
  })

  it('连按后一次撤销整体回位（含附着连线）', () => {
    const { aId, linkerId } = setupShapesWithLinker()
    const st = useEditorStore.getState()
    const linkerBefore = JSON.parse(JSON.stringify(st.document.elements[linkerId]))

    // 模拟方向键流程：首次按下开 batch（含附着连线），连按移动，松开提交
    st.beginBatch([aId, linkerId])
    st.moveElementsNoHistory([aId], 10, 0)
    st.moveElementsNoHistory([aId], 10, 0)
    st.moveElementsNoHistory([aId], 0, 10)
    st.commitBatch()

    const moved = useEditorStore.getState().document
    expect((moved.elements[aId] as ElementInstance).props.x).toBe(120)
    expect((moved.elements[aId] as ElementInstance).props.y).toBe(110)
    // 连线端点跟随移动
    const ml = moved.elements[linkerId]!
    expect(isLinker(ml) ? ml.from.x : 0).toBe(240)

    // 一条撤销记录整体回位（含连线）
    st.undo()
    const after = useEditorStore.getState().document
    expect((after.elements[aId] as ElementInstance).props.x).toBe(100)
    expect(after.elements[linkerId]).toEqual(linkerBefore)
    expect(historyManager.canUndo()).toBe(false)
  })
})

describe('moveElements 历史快照修复', () => {
  it('移动带附着连线的图形后撤销，连线端点恢复旧值', () => {
    const { aId, linkerId } = setupShapesWithLinker()
    const st = useEditorStore.getState()
    const linkerBefore = JSON.parse(JSON.stringify(st.document.elements[linkerId]))

    st.moveElements([aId], 50, 80)
    // 移动后连线 from 端已跟随
    const movedLinker = useEditorStore.getState().document.elements[linkerId]
    expect(isLinker(movedLinker!) && movedLinker.from.x).toBe(270)

    // 撤销：图形与连线一并还原
    st.undo()
    const after = useEditorStore.getState().document
    expect((after.elements[aId] as ElementInstance).props.x).toBe(100)
    expect(after.elements[linkerId]).toEqual(linkerBefore)
  })
})
