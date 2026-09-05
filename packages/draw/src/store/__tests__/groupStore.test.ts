// 组合/取消组合 store 测试：groupSelected / ungroupSelected / 复制粘贴组独立 / 选择组展开
import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore, historyManager } from '../editorStore'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import { createEmptyDocument, type ElementInstance } from '@/types'

/** 测试辅助：注册图形实例（固定位置/尺寸） */
function shape(id: string, x = 0, y = 0): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', x, y)
  if (!el) throw new Error('rectangle schema missing')
  return { ...el, id, props: { ...el.props, w: 120, h: 60 } }
}

/** 测试辅助：直接注入已组好的文档（绕过 addElement 历史，只观测目标操作） */
function addShapes(...els: ElementInstance[]): void {
  const st = useEditorStore.getState()
  for (const el of els) st.addElement(el)
  historyManager.clear()
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

describe('groupSelected', () => {
  it('≥2 个未锁定图形组合后共享同一 groupId，且为单条历史', () => {
    addShapes(shape('a'), shape('b'), shape('c'))
    const st = useEditorStore.getState()
    st.selectIds(['a', 'b'], 'replace')
    st.groupSelected()

    const doc = useEditorStore.getState().document
    const ga = (doc.elements['a'] as ElementInstance).groupId
    const gb = (doc.elements['b'] as ElementInstance).groupId
    expect(ga).toBeDefined()
    expect(ga).toBe(gb)
    // 未选中的 c 不入组
    expect((doc.elements['c'] as ElementInstance).groupId).toBeUndefined()

    // 单条历史：一次撤销还原
    st.undo()
    const after = useEditorStore.getState().document
    expect((after.elements['a'] as ElementInstance).groupId).toBeUndefined()
    expect((after.elements['b'] as ElementInstance).groupId).toBeUndefined()
    expect(historyManager.canUndo()).toBe(false)
  })

  it('少于 2 个图形为无操作', () => {
    addShapes(shape('a'), shape('b'))
    const st = useEditorStore.getState()
    st.selectIds(['a'], 'replace')
    st.groupSelected()
    expect((useEditorStore.getState().document.elements['a'] as ElementInstance).groupId).toBeUndefined()
    expect(historyManager.canUndo()).toBe(false)
  })

  it('锁定图形不参与组合', () => {
    addShapes({ ...shape('a'), locked: true }, shape('b'), shape('c'))
    const st = useEditorStore.getState()
    st.selectIds(['a', 'b'], 'replace')
    st.groupSelected()
    const doc = useEditorStore.getState().document
    expect((doc.elements['a'] as ElementInstance).groupId).toBeUndefined()
    expect((doc.elements['b'] as ElementInstance).groupId).toBeUndefined()
  })
})

describe('ungroupSelected', () => {
  it('选中一个成员即整组解散，且为单条历史', () => {
    addShapes({ ...shape('a'), groupId: 'grp-1' }, { ...shape('b'), groupId: 'grp-1' }, shape('c'))
    const st = useEditorStore.getState()
    st.selectIds(['a'], 'replace')
    st.ungroupSelected()

    const doc = useEditorStore.getState().document
    expect((doc.elements['a'] as ElementInstance).groupId).toBeUndefined()
    expect((doc.elements['b'] as ElementInstance).groupId).toBeUndefined()
    expect((doc.elements['c'] as ElementInstance).groupId).toBeUndefined()

    st.undo()
    const after = useEditorStore.getState().document
    expect((after.elements['a'] as ElementInstance).groupId).toBe('grp-1')
    expect((after.elements['b'] as ElementInstance).groupId).toBe('grp-1')
    expect(historyManager.canUndo()).toBe(false)
  })

  it('无组选中为无操作', () => {
    addShapes(shape('a'))
    const st = useEditorStore.getState()
    st.selectIds(['a'], 'replace')
    st.ungroupSelected()
    expect(historyManager.canUndo()).toBe(false)
  })
})

describe('跨组重编与自动解散', () => {
  it('整组重编：选中两组全部成员组合后共享新组，旧组自然清空', () => {
    // 组 A = {a, b}，组 B = {c, d}；通过正常选择入口选中两者（展开成 4 人）再组合
    addShapes(
      { ...shape('a'), groupId: 'grp-A' },
      { ...shape('b'), groupId: 'grp-A' },
      { ...shape('c'), groupId: 'grp-B' },
      { ...shape('d'), groupId: 'grp-B' },
    )
    const st = useEditorStore.getState()
    st.selectIds(['a', 'c'], 'replace')
    // 选择恒展开整组：实际选区为 a,b,c,d
    expect(useEditorStore.getState().selectedIds.size).toBe(4)
    st.groupSelected()

    const doc = useEditorStore.getState().document
    const gids = new Set(
      ['a', 'b', 'c', 'd'].map((id) => (doc.elements[id] as ElementInstance).groupId),
    )
    expect(gids.size).toBe(1)
    expect(gids.has(undefined)).toBe(false)
    expect(gids.has('grp-A')).toBe(false)
    expect(gids.has('grp-B')).toBe(false)
  })

  it('防御分支：部分选中重编后旧组剩余 ≤1 成员自动解散', () => {
    // 直接 setState 绕过展开，模拟组内单成员被抽走（正常 UI 不产生）
    addShapes(
      { ...shape('a'), groupId: 'grp-A' },
      { ...shape('b'), groupId: 'grp-A' },
      { ...shape('c'), groupId: 'grp-B' },
      { ...shape('d'), groupId: 'grp-B' },
    )
    useEditorStore.setState({ selectedIds: new Set(['b', 'c']) })
    useEditorStore.getState().groupSelected()

    const doc = useEditorStore.getState().document
    const gb = (doc.elements['b'] as ElementInstance).groupId
    const gc = (doc.elements['c'] as ElementInstance).groupId
    expect(gb).toBeDefined()
    expect(gb).toBe(gc)
    expect(gb).not.toBe('grp-A')
    expect(gb).not.toBe('grp-B')
    // 旧组各剩 1 人 → 解散
    expect((doc.elements['a'] as ElementInstance).groupId).toBeUndefined()
    expect((doc.elements['d'] as ElementInstance).groupId).toBeUndefined()
  })

  it('防御分支：旧组剩余 ≥2 成员则保留原组', () => {
    // 组 A = {a, b, c}；抽走 a 与 d 重编，组 A 剩 {b, c} 保留
    addShapes(
      { ...shape('a'), groupId: 'grp-A' },
      { ...shape('b'), groupId: 'grp-A' },
      { ...shape('c'), groupId: 'grp-A' },
      shape('d'),
    )
    useEditorStore.setState({ selectedIds: new Set(['a', 'd']) })
    useEditorStore.getState().groupSelected()

    const doc = useEditorStore.getState().document
    const ga = (doc.elements['a'] as ElementInstance).groupId
    expect(ga).not.toBe('grp-A')
    expect((doc.elements['b'] as ElementInstance).groupId).toBe('grp-A')
    expect((doc.elements['c'] as ElementInstance).groupId).toBe('grp-A')
  })
})

describe('复制粘贴组独立', () => {
  it('整组复制后副本共享新 groupId，与原组彻底独立', () => {
    addShapes({ ...shape('a'), groupId: 'grp-1' }, { ...shape('b'), groupId: 'grp-1' })
    const st = useEditorStore.getState()
    st.selectIds(['a', 'b'], 'replace')
    st.copySelectedElements()
    st.pasteElements()

    const doc = useEditorStore.getState().document
    // 原组不变
    expect((doc.elements['a'] as ElementInstance).groupId).toBe('grp-1')
    expect((doc.elements['b'] as ElementInstance).groupId).toBe('grp-1')

    // 副本为新增的两个元素，共享新组且不同于原组
    const copiedIds = Object.keys(doc.elements).filter((id) => id !== 'a' && id !== 'b')
    expect(copiedIds).toHaveLength(2)
    const copiedGroups = new Set(
      copiedIds.map((id) => (doc.elements[id] as ElementInstance).groupId),
    )
    expect(copiedGroups.size).toBe(1)
    expect(copiedGroups.has('grp-1')).toBe(false)
    expect(copiedGroups.has(undefined)).toBe(false)
  })

  it('部分复制（选中组内单个成员）副本清除 groupId', () => {
    addShapes({ ...shape('a'), groupId: 'grp-1' }, { ...shape('b'), groupId: 'grp-1' })
    const st = useEditorStore.getState()
    // 直接构造部分复制：手动设选区为单个成员（选择模型下点击会整组展开，故这里用 setState 模拟异常路径）
    useEditorStore.setState({ selectedIds: new Set(['a']) })
    st.copySelectedElements()
    const clip = useEditorStore.getState().clipboard
    expect(clip).not.toBeNull()
    expect(clip!.shapes).toHaveLength(1)
    expect(clip!.shapes[0]!.groupId).toBeUndefined()
  })
})

describe('选择组展开', () => {
  it('selectElement 命中组成员展开为整组', () => {
    addShapes({ ...shape('a'), groupId: 'grp-1' }, { ...shape('b'), groupId: 'grp-1' }, shape('c'))
    const st = useEditorStore.getState()
    st.selectElement('a')
    const ids = useEditorStore.getState().selectedIds
    expect(ids.has('a')).toBe(true)
    expect(ids.has('b')).toBe(true)
    expect(ids.has('c')).toBe(false)
  })

  it('selectIds 框选命中组成员展开整组', () => {
    addShapes({ ...shape('a'), groupId: 'grp-1' }, { ...shape('b'), groupId: 'grp-1' }, shape('c'))
    const st = useEditorStore.getState()
    st.selectIds(['a', 'c'], 'replace')
    const ids = useEditorStore.getState().selectedIds
    expect(ids.has('a')).toBe(true)
    expect(ids.has('b')).toBe(true)
    expect(ids.has('c')).toBe(true)
  })
})
