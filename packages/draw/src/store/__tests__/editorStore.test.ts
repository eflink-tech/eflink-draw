import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore } from '../editorStore'
import { createEmptyDocument, isLinker } from '@/types'
import type { ElementInstance, LinkerInstance, ResizeDirection } from '@/types'
import { createLinkerInstance } from '@/core/editor/linker'
import { cursorPointAt } from '@/core/editor/linkerCursor'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'

describe('editorStore', () => {
  beforeEach(() => {
    // 重置 store 状态
    useEditorStore.setState({
      document: createEmptyDocument(),
      selectedIds: new Set(),
      viewport: { x: 0, y: 0, scale: 1 },
      isDirty: false,
    })
  })

  it('初始状态正确', () => {
    const state = useEditorStore.getState()
    expect(state.selectedIds.size).toBe(0)
    expect(state.viewport.scale).toBe(1)
    expect(state.isDirty).toBe(false)
  })

  it('setDocument 设置文档', () => {
    const doc = createEmptyDocument('测试')
    useEditorStore.getState().setDocument(doc)
    expect(useEditorStore.getState().document.page.title).toBe('测试')
  })

  it('selectElement 单选', () => {
    const store = useEditorStore.getState()
    store.addElement(createTestElement('el-1'))
    store.selectElement('el-1')
    expect(useEditorStore.getState().selectedIds.has('el-1')).toBe(true)
    expect(useEditorStore.getState().selectedIds.size).toBe(1)
  })

  it('selectElement 多选（Ctrl 模式）', () => {
    const store = useEditorStore.getState()
    store.addElement(createTestElement('el-1'))
    store.addElement(createTestElement('el-2'))
    store.selectElement('el-1')
    store.selectElement('el-2', true)
    const ids = useEditorStore.getState().selectedIds
    expect(ids.has('el-1')).toBe(true)
    expect(ids.has('el-2')).toBe(true)
    expect(ids.size).toBe(2)
  })

  it('clearSelection 清空选择', () => {
    const store = useEditorStore.getState()
    store.selectElement('el-1')
    store.clearSelection()
    expect(useEditorStore.getState().selectedIds.size).toBe(0)
  })

  it('updateViewport 更新视口', () => {
    useEditorStore.getState().updateViewport({ scale: 1.5, x: 100 })
    const vp = useEditorStore.getState().viewport
    expect(vp.scale).toBe(1.5)
    expect(vp.x).toBe(100)
    expect(vp.y).toBe(0) // 未更新的保持原值
  })

  it('addElement 添加元素', () => {
    const el = createTestElement('el-1')
    useEditorStore.getState().addElement(el)
    expect(useEditorStore.getState().document.elements['el-1']).toBeDefined()
    expect(useEditorStore.getState().isDirty).toBe(true)
  })

  it('deleteElement 删除元素', () => {
    const el = createTestElement('el-1')
    const store = useEditorStore.getState()
    store.addElement(el)
    store.deleteElement('el-1')
    expect(useEditorStore.getState().document.elements['el-1']).toBeUndefined()
  })

  it('修改阴影后撤销恢复原值（历史透传 shadow 字段）', () => {
    const el = shapeRegistry.createElement('rectangle', 0, 0)!
    useEditorStore.getState().setDocument({
      page: useEditorStore.getState().document.page,
      elements: { [el.id]: { ...el, shapeStyle: { alpha: 1, shadowEnabled: false } } },
    })
    useEditorStore.getState().selectIds([el.id], 'replace')
    useEditorStore.getState().updateElement(el.id, {
      shapeStyle: { alpha: 1, shadowEnabled: true, shadowColor: '0,0,0', shadowBlur: 4 },
    })
    useEditorStore.getState().undo()
    const after = useEditorStore.getState().document.elements[el.id] as ElementInstance
    expect(after.shapeStyle.shadowEnabled).toBe(false)
  })

  it('复制含阴影图形后粘贴保留阴影（剪贴板透传 shadow 字段）', () => {
    const el = shapeRegistry.createElement('rectangle', 0, 0)!
    useEditorStore.getState().setDocument({
      page: useEditorStore.getState().document.page,
      elements: { [el.id]: { ...el, shapeStyle: { alpha: 1, shadowEnabled: true, shadowBlur: 4 } } },
    })
    useEditorStore.getState().selectIds([el.id], 'replace')
    useEditorStore.getState().copySelectedElements()
    useEditorStore.getState().pasteElements()
    const pastedEl = Object.values(useEditorStore.getState().document.elements)
      .filter((e) => !isLinker(e) && e.id !== el.id)[0] as ElementInstance
    expect(pastedEl).toBeDefined()
    expect(pastedEl.shapeStyle.shadowEnabled).toBe(true)
    expect(pastedEl.shapeStyle.shadowBlur).toBe(4)
  })

  it('resetLinkerRoute 清除标记并重算自动路由', () => {
    const l = createLinkerInstance(
      { id: null, x: 0, y: 0, angle: 0 },
      { id: null, x: 100, y: 0, angle: 0 },
      0,
    )
    const manual: LinkerInstance = { ...l, manualRoute: true, points: [{ x: 7, y: 7 }] }
    useEditorStore.getState().setDocument({
      ...createEmptyDocument(),
      elements: { [manual.id]: manual },
    })
    useEditorStore.getState().resetLinkerRoute(manual.id)
    const after = useEditorStore.getState().document.elements[manual.id] as LinkerInstance
    expect(after.manualRoute).toBe(false)
    expect(after.points).toEqual([
      { x: 50, y: 0 },
      { x: 50, y: 0 },
    ])
  })

  it('resetLinkerRoute 撤销后恢复手动路由状态', () => {
    const l = createLinkerInstance(
      { id: null, x: 0, y: 0, angle: 0 },
      { id: null, x: 100, y: 0, angle: 0 },
      0,
    )
    const manual: LinkerInstance = { ...l, manualRoute: true, points: [{ x: 7, y: 7 }] }
    useEditorStore.getState().setDocument({
      ...createEmptyDocument(),
      elements: { [manual.id]: manual },
    })
    useEditorStore.getState().resetLinkerRoute(manual.id)
    // 撤销本次重置，恢复重置前的手动路由快照
    useEditorStore.getState().undo()
    const restored = useEditorStore.getState().document.elements[manual.id] as LinkerInstance
    expect(restored.manualRoute).toBe(true)
    expect(restored.points).toEqual([{ x: 7, y: 7 }])
  })

  it('resetLinkerRoute 对非手动连线无操作', () => {
    const l = createLinkerInstance(
      { id: null, x: 0, y: 0, angle: 0 },
      { id: null, x: 100, y: 0, angle: 0 },
      0,
    )
    const auto: LinkerInstance = { ...l, points: [{ x: 7, y: 7 }] }
    useEditorStore.getState().setDocument({
      ...createEmptyDocument(),
      elements: { [auto.id]: auto },
    })
    useEditorStore.getState().resetLinkerRoute(auto.id)
    expect((useEditorStore.getState().document.elements[auto.id] as LinkerInstance).points).toEqual([{ x: 7, y: 7 }])
    // 无操作时不写历史、不置脏
    expect(useEditorStore.getState().isDirty).toBe(false)
  })
})

/** 测试辅助：创建 ElementInstance */
function createTestElement(id: string): ElementInstance {
  return {
    id,
    name: 'rectangle',
    title: '矩形',
    category: 'basic',
    group: '',
    groupName: null,
    locked: false,
    link: '',
    children: [],
    parent: '',
    resizeDir: ['tl', 'tr', 'br', 'bl'] as ResizeDirection[],
    attribute: { visible: true },
    dataAttributes: [],
    props: { x: 100, y: 100, w: 120, h: 60, zindex: 0, angle: 0 },
    shapeStyle: { alpha: 1 },
    lineStyle: { lineWidth: 1, lineColor: '0,0,0', lineStyle: 'solid' },
    fillStyle: { type: 'solid', color: '255,255,255' },
    path: [[{ action: 'move', x: 0, y: 0 }]],
    fontStyle: { size: 14, color: '0,0,0', textAlign: 'center', vAlign: 'middle' },
    textBlock: [],
    anchors: [],
  }
}

describe('textEdit 和 updatePage', () => {
  beforeEach(() => {
    useEditorStore.setState({
      document: createEmptyDocument(),
      selectedIds: new Set(),
      textEdit: null,
      isDirty: false,
    })
  })

  it('setTextEdit 设置/清除文字编辑状态', () => {
    useEditorStore.getState().setTextEdit({ id: 'el-1', block: 0 })
    expect(useEditorStore.getState().textEdit).toEqual({ id: 'el-1', block: 0 })
    useEditorStore.getState().setTextEdit(null)
    expect(useEditorStore.getState().textEdit).toBeNull()
  })

  it('deleteElements 删除正在编辑的元素时关闭文字编辑器', () => {
    const store = useEditorStore.getState()
    store.addElement(createTestElement('el-1'))
    store.setTextEdit({ id: 'el-1', block: 0 })
    store.deleteElements(['el-1'])
    expect(useEditorStore.getState().textEdit).toBeNull()
  })

  it('choreographyTask 可独立更新各 textBlock', () => {
    const store = useEditorStore.getState()
    const el = shapeRegistry.createElement('choreographyTask', 0, 0)!
    store.addElement(el)
    const updated = el.textBlock.map((tb, i) =>
      i === 1 ? { ...tb, text: '客户 A' } : i === 2 ? { ...tb, text: '供应商 B' } : tb,
    )
    store.updateElement(el.id, { textBlock: updated })
    const saved = useEditorStore.getState().document.elements[el.id] as ElementInstance
    expect(saved.textBlock[1]?.text).toBe('客户 A')
    expect(saved.textBlock[2]?.text).toBe('供应商 B')
    expect(saved.textBlock[0]?.text).toBe('编排任务')
  })

  it('deleteElements 删除其他元素时保持文字编辑状态', () => {
    const store = useEditorStore.getState()
    store.addElement(createTestElement('el-1'))
    store.addElement(createTestElement('el-2'))
    store.setTextEdit({ id: 'el-1', block: 0 })
    store.deleteElements(['el-2'])
    expect(useEditorStore.getState().textEdit).toEqual({ id: 'el-1', block: 0 })
  })

  it('setDocument 换文档时关闭文字编辑器', () => {
    const store = useEditorStore.getState()
    store.setTextEdit({ id: 'el-1', block: 0 })
    store.setDocument(createEmptyDocument('新文档'))
    expect(useEditorStore.getState().textEdit).toBeNull()
  })

  it('updatePage 增量更新页面配置并置脏', () => {
    useEditorStore.getState().updatePage({ showGrid: false, gridSize: 20 })
    const page = useEditorStore.getState().document.page
    expect(page.showGrid).toBe(false)
    expect(page.gridSize).toBe(20)
    // 未指定字段保持默认
    expect(page.width).toBe(1600)
    expect(useEditorStore.getState().isDirty).toBe(true)
  })
})

describe('junction 联动（store 集成）', () => {
  beforeEach(() => {
    useEditorStore.setState({
      document: createEmptyDocument(),
      selectedIds: new Set(),
      viewport: { x: 0, y: 0, scale: 1 },
      isDirty: false,
    })
  })

  /** shape-a(120×60 @100,100) ← 宿主 broken 连线（from 附着右锚点）← dep 连线（to junction 附着 host t=0.25） */
  function setupJunction(): { host: LinkerInstance; dep: LinkerInstance } {
    const store = useEditorStore.getState()
    store.addElement(createTestElement('shape-a'))
    const base = createLinkerInstance(
      { id: 'shape-a', x: 220, y: 130, angle: Math.PI },
      { id: null, x: 300, y: 220, angle: 0 },
      1,
    )
    const host: LinkerInstance = {
      ...base,
      id: 'host',
      linkerType: 'broken',
      manualRoute: true,
      // 路径 from(220,130)→(220,200)→(300,200)→(300,220)，总长 170，t=0.25 → (222.5,200)
      points: [
        { x: 220, y: 200 },
        { x: 300, y: 200 },
      ],
    }
    store.addLinker(host)
    const depBase = createLinkerInstance(
      { id: null, x: 500, y: 500, angle: 0 },
      { id: null, x: 222.5, y: 200, angle: 0 },
      2,
    )
    const dep: LinkerInstance = {
      ...depBase,
      id: 'dep',
      to: { ...depBase.to, junction: { linkerId: 'host', t: 0.25 } },
    }
    store.addLinker(dep)
    return { host, dep }
  }

  it('updateLinker 改宿主 points：下游 junction 端点跟随且并入单条历史', () => {
    setupJunction()
    useEditorStore.getState().updateLinker('host', {
      points: [
        { x: 220, y: 240 },
        { x: 300, y: 240 },
      ],
    })
    const dep = useEditorStore.getState().document.elements['dep'] as LinkerInstance
    // 新路径总长 210，t=0.25 → 第一段 52.5 → (220,182.5)
    expect(dep.to.x).toBeCloseTo(220, 6)
    expect(dep.to.y).toBeCloseTo(182.5, 6)
    expect(dep.to.junction).toEqual({ linkerId: 'host', t: 0.25 })

    // undo 一次：宿主与下游同时回位
    useEditorStore.getState().undo()
    const st = useEditorStore.getState().document.elements
    const hostBack = st['host'] as LinkerInstance
    const depBack = st['dep'] as LinkerInstance
    expect(hostBack.points).toEqual([
      { x: 220, y: 200 },
      { x: 300, y: 200 },
    ])
    expect(depBack.to.x).toBeCloseTo(222.5, 6)
    expect(depBack.to.y).toBeCloseTo(200, 6)
    expect(depBack.to.junction).toEqual({ linkerId: 'host', t: 0.25 })
  })

  it('moveElements 移动宿主附着图形：junction 线跟随且 undo 一次回位', () => {
    setupJunction()
    useEditorStore.getState().moveElements(['shape-a'], 30, 0)
    const st = useEditorStore.getState().document.elements
    const host = st['host'] as LinkerInstance
    const dep = st['dep'] as LinkerInstance
    // 宿主 from 跟随图形右锚点平移
    expect(host.from.x).toBe(250)
    // 下游附着点 = cursorPointAt(新宿主, 0.25)（用 store 现值自洽断言）
    expect(dep.to.junction).toEqual({ linkerId: 'host', t: 0.25 })

    useEditorStore.getState().undo()
    const back = useEditorStore.getState().document.elements
    expect((back['host'] as LinkerInstance).from.x).toBe(220)
    expect(((back['dep'] as LinkerInstance).to)).toMatchObject({ x: 222.5, y: 200 })
    expect((back['host'] as LinkerInstance).points).toEqual([
      { x: 220, y: 200 },
      { x: 300, y: 200 },
    ])
  })
})

describe('junction 删除脱附 + 复制粘贴（store 集成）', () => {
  beforeEach(() => {
    useEditorStore.setState({
      document: createEmptyDocument(),
      selectedIds: new Set(),
      viewport: { x: 0, y: 0, scale: 1 },
      isDirty: false,
      clipboard: null,
    })
  })

  /** shape-a ← 宿主连线 host（from 附着 shape-a，broken 手工 points）← dep（to junction 附着 host） */
  function setupJunction() {
    const store = useEditorStore.getState()
    store.addElement(createTestElement('shape-a'))
    const base = createLinkerInstance(
      { id: 'shape-a', x: 220, y: 130, angle: Math.PI },
      { id: null, x: 300, y: 220, angle: 0 },
      1,
    )
    const host: LinkerInstance = {
      ...base,
      id: 'host',
      linkerType: 'broken',
      manualRoute: true,
      points: [
        { x: 220, y: 200 },
        { x: 300, y: 200 },
      ],
    }
    store.addLinker(host)
    const depBase = createLinkerInstance(
      { id: null, x: 500, y: 500, angle: 0 },
      { id: null, x: 222.5, y: 200, angle: 0 },
      2,
    )
    const dep: LinkerInstance = {
      ...depBase,
      id: 'dep',
      to: { ...depBase.to, junction: { linkerId: 'host', t: 0.25 } },
    }
    store.addLinker(dep)
    return { host, dep }
  }

  it('删除宿主连线：附着线脱附幸存，undo 一次整体恢复 junction', () => {
    setupJunction()
    useEditorStore.getState().deleteElements(['host'])
    const dep = useEditorStore.getState().document.elements['dep'] as LinkerInstance
    expect(dep).toBeDefined()
    expect(dep.to.junction).toBeUndefined()
    expect(dep.to.x).toBeCloseTo(222.5, 6)

    useEditorStore.getState().undo()
    const st = useEditorStore.getState().document.elements
    expect(st['host']).toBeDefined()
    expect((st['dep'] as LinkerInstance).to.junction).toEqual({ linkerId: 'host', t: 0.25 })
  })

  it('copy：宿主在选区 → junction remap 新宿主 ID；宿主不在 → 脱附', () => {
    setupJunction()
    const store = useEditorStore.getState()
    // 宿主 + 附着线一起复制：junction 指向复制出的新宿主
    store.selectElement('shape-a')
    store.selectElement('host', true)
    store.selectElement('dep', true)
    store.copySelectedElements()
    const clip = useEditorStore.getState().clipboard!
    expect(clip.linkers).toHaveLength(2)
    const newHost = clip.linkers.find((l) => l.from.id != null)!
    const newDep = clip.linkers.find((l) => l.id !== newHost.id)!
    expect(newDep.to.junction).toEqual({ linkerId: newHost.id, t: 0.25 })

    // 只复制附着线：宿主不在选区 → 脱附保坐标
    store.selectElement('dep')
    store.copySelectedElements()
    const clip2 = useEditorStore.getState().clipboard!
    expect(clip2.linkers).toHaveLength(1)
    expect(clip2.linkers[0]!.to.junction).toBeUndefined()
    expect(clip2.linkers[0]!.to.x).toBeCloseTo(222.5, 6)
  })

  it('paste：junction 指向粘贴出的新宿主且附着点归位', () => {
    setupJunction()
    const store = useEditorStore.getState()
    store.selectElement('shape-a')
    store.selectElement('host', true)
    store.selectElement('dep', true)
    store.copySelectedElements()
    store.pasteElements()
    const els = useEditorStore.getState().document.elements
    const pastedLinkers = Object.values(els).filter(
      (el): el is LinkerInstance => isLinker(el) && el.id !== 'host' && el.id !== 'dep',
    )
    expect(pastedLinkers).toHaveLength(2)
    const pHost = pastedLinkers.find((l) => l.from.id != null)!
    const pDep = pastedLinkers.find((l) => l.id !== pHost.id)!
    expect(pDep.to.junction).toEqual({ linkerId: pHost.id, t: 0.25 })
    // 附着点坐标 = cursorPointAt(新宿主路径, 0.25)（自洽断言）
    const p = cursorPointAt(pHost, 0.25)
    expect(pDep.to.x).toBeCloseTo(p.x, 6)
    expect(pDep.to.y).toBeCloseTo(p.y, 6)
  })
})
