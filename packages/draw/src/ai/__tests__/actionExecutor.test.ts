// src/ai/__tests__/actionExecutor.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ActionExecutor } from '../actionExecutor'
import { findCrossedRects, segIntersectsRect } from '../autoLayout'
import type { AIAction } from '../types'
import type { ElementInstance, LinkerInstance } from '@/types'

// 构造最小可用的 ElementInstance 桩
function makeElement(overrides: Partial<ElementInstance> = {}): ElementInstance {
  return {
    id: 'el-stub',
    name: 'flowStart',
    title: '',
    category: 'flow',
    group: '',
    groupName: null,
    locked: false,
    link: '',
    children: [],
    parent: '',
    resizeDir: ['tl', 'tr', 'br', 'bl'],
    attribute: { visible: true },
    dataAttributes: [],
    props: { x: 0, y: 0, w: 100, h: 60, zindex: 0, angle: 0 },
    shapeStyle: { alpha: 1 },
    lineStyle: {
      lineWidth: 1,
      lineColor: '50,50,50',
      lineStyle: 'solid',
    },
    fillStyle: { type: 'solid', color: '255,255,255' },
    fontStyle: {
      fontFamily: 'Arial',
      size: 14,
      color: '50,50,50',
      textAlign: 'center',
      vAlign: 'middle',
      bold: false,
      italic: false,
      underline: false,
      orientation: 'horizontal',
    },
    textBlock: [{ position: { x: 10, y: 0, w: 'w-20', h: 'h' }, text: '' }],
    anchors: [],
    path: [[]],
    ...overrides,
  } as ElementInstance
}

// 真实矩形锚点（与 registry.ts 缺省一致：上/下/左/右四边中点）
const RECT_ANCHORS = [
  { x: 'w/2', y: 0 },
  { x: 'w/2', y: 'h' },
  { x: 0, y: 'h/2' },
  { x: 'w', y: 'h/2' },
]

// Mock editorStore：匹配真实 API 签名
function createMockStore() {
  const elements: Record<string, ElementInstance | LinkerInstance> = {}
  return {
    // 写入
    addElement: vi.fn((el: ElementInstance) => {
      elements[el.id] = el
    }),
    addLinker: vi.fn((ln: LinkerInstance) => {
      elements[ln.id] = ln
    }),
    updateElement: vi.fn((id: string, updates: Partial<ElementInstance>) => {
      const el = elements[id]
      if (el && el.name !== 'linker') {
        elements[id] = { ...el, ...updates } as ElementInstance
      }
    }),
    updateLinker: vi.fn((id: string, updates: Partial<LinkerInstance>) => {
      const el = elements[id]
      if (el && el.name === 'linker') {
        elements[id] = { ...el, ...updates } as LinkerInstance
      }
    }),
    deleteElements: vi.fn((ids: string[]) => {
      for (const id of ids) delete elements[id]
    }),
    // 批量
    beginBatch: vi.fn(),
    commitBatch: vi.fn(),
    // 文档读取（供 actionExecutor 查询附着连线）
    get document() {
      return { elements }
    },
  }
}

// Mock shapeRegistry：匹配真实 API（createElement 返回 ElementInstance | null）
function createMockRegistry() {
  // 布局/主题测试用的类别映射（缺省 flow）
  const schemaCategory: Record<string, string> = {
    freetext: 'free',
    lanePool: 'lane',
  }
  const knownSchemas = new Set([
    'flowStart', 'flowProcess', 'flowEnd', 'terminator', 'annotation',
    'freetext', 'lanePool', 'childEl',
  ])
  let counter = 0
  return {
    has: (name: string) => knownSchemas.has(name),
    createElement: vi.fn((name: string, x: number, y: number): ElementInstance | null => {
      if (!knownSchemas.has(name)) return null
      counter++
      return makeElement({
        id: `el-new-${counter}`,
        name,
        category: schemaCategory[name] ?? 'flow',
        // childEl：容器内元素桩（parent 非空 → 布局整批跳过的验证）
        parent: name === 'childEl' ? 'el-existing-container' : '',
        // 真实矩形锚点（与 registry.ts 缺省一致）：布局重锚的侧锚绕行依赖四边锚点
        anchors: [
          { x: 'w/2', y: 0 },
          { x: 'w/2', y: 'h' },
          { x: 0, y: 'h/2' },
          { x: 'w', y: 'h/2' },
        ],
        props: { x, y, w: 100, h: 60, zindex: 0, angle: 0 },
      })
    }),
    // 语义主题读取 schema 原始定义：返回不带 fillStyle 的桩 → 允许主题
    // （annotation 特例：带 fillStyle:none，验证豁免逻辑）
    getShape: vi.fn((name: string) => {
      if (!knownSchemas.has(name)) return undefined
      return name === 'annotation'
        ? { name, title: '', category: 'flow', path: [[]], fillStyle: { type: 'none' } }
        : { name, title: '', category: 'flow', path: [[]] }
    }),
  }
}

describe('ActionExecutor', () => {
  let executor: ActionExecutor
  let store: ReturnType<typeof createMockStore>
  let registry: ReturnType<typeof createMockRegistry>

  beforeEach(() => {
    store = createMockStore()
    registry = createMockRegistry()
    executor = new ActionExecutor(store as any, registry as any)
  })

  it('执行 add_element 动作', async () => {
    const actions: AIAction[] = [
      { type: 'add_element', refId: 'n1', schema: 'flowStart', x: 100, y: 200, text: '开始' },
    ]

    const result = await executor.execute(actions)

    expect(registry.createElement).toHaveBeenCalledWith('flowStart', 100, 200)
    expect(store.addElement).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'el-new-1',
        name: 'flowStart',
        props: expect.objectContaining({ x: 100, y: 200 }),
      }),
    )
    expect(result.added).toEqual(['el-new-1'])
  })

  it('add_element 自动应用语义配色（terminator=绿）', async () => {
    const actions: AIAction[] = [
      { type: 'add_element', refId: 'n1', schema: 'terminator', x: 100, y: 200 },
    ]

    await executor.execute(actions)

    expect(store.addElement).toHaveBeenCalledWith(
      expect.objectContaining({
        // #D5E8D4 / #82B366
        fillStyle: { type: 'solid', color: '213,232,212' },
        lineStyle: expect.objectContaining({ lineColor: '130,179,102' }),
      }),
    )
  })

  it('schema 自带 fillStyle 的图形（annotation=none）不被主题上色', async () => {
    const actions: AIAction[] = [
      { type: 'add_element', refId: 'n1', schema: 'annotation', x: 100, y: 200 },
    ]

    await executor.execute(actions)

    expect(store.addElement).toHaveBeenCalledWith(
      expect.objectContaining({
        fillStyle: { type: 'solid', color: '255,255,255' }, // 保持 createElement 原样
        lineStyle: expect.objectContaining({ lineColor: '50,50,50' }),
      }),
    )
  })

  it('AI 显式 style 覆盖主题色', async () => {
    const actions: AIAction[] = [
      { type: 'add_element', refId: 'n1', schema: 'terminator', x: 100, y: 200, style: { fill: '#ff0000', lineColor: '#00ff00' } },
    ]

    await executor.execute(actions)

    expect(store.addElement).toHaveBeenCalledWith(
      expect.objectContaining({
        fillStyle: { type: 'solid', color: '255,0,0' },
        lineStyle: expect.objectContaining({ lineColor: '0,255,0' }),
      }),
    )
  })

  it('AI 输出非法 style 值被清洗，落回主题色', async () => {
    const actions: AIAction[] = [
      { type: 'add_element', refId: 'n1', schema: 'terminator', x: 100, y: 200, style: { fill: 'not-a-color' } },
    ]

    await executor.execute(actions)

    expect(store.addElement).toHaveBeenCalledWith(
      expect.objectContaining({
        fillStyle: { type: 'solid', color: '213,232,212' }, // 主题绿仍然生效
      }),
    )
  })

  it('执行 add_linker 动作（from/to 使用 refId 映射到真实 id）', async () => {
    const actions: AIAction[] = [
      { type: 'add_element', refId: 'n1', schema: 'flowStart', x: 100, y: 200 },
      { type: 'add_element', refId: 'n2', schema: 'flowProcess', x: 300, y: 200 },
      { type: 'add_linker', refId: 'l1', from: 'n1', to: 'n2', linkerType: 'curve' },
    ]

    const result = await executor.execute(actions)

    expect(store.addLinker).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.objectContaining({ id: 'el-new-1' }),
        to: expect.objectContaining({ id: 'el-new-2' }),
        linkerType: 'curve',
      }),
    )
    expect(result.added).toHaveLength(3)
  })

  it('schema 不存在时跳过', async () => {
    const actions: AIAction[] = [
      { type: 'add_element', refId: 'n1', schema: 'invalidSchema', x: 100, y: 200 },
    ]

    const result = await executor.execute(actions)

    expect(store.addElement).not.toHaveBeenCalled()
    expect(result.skipped).toHaveLength(1)
    expect(result.skipped[0].reason).toContain('schema')
  })

  it('执行 delete_element 动作（级联删除附着连线）', async () => {
    // 预先向 store 文档中写入目标元素与附着连线
    const target = makeElement({ id: 'el-target' })
    const other = makeElement({ id: 'el-other' })
    const ln1: LinkerInstance = {
      id: 'ln-1',
      name: 'linker',
      from: { id: 'el-target', x: 0, y: 0, angle: 0 },
      to: { id: 'el-other', x: 100, y: 0, angle: 0 },
      text: '',
      linkerType: 'curve',
      lineStyle: { lineWidth: 1, lineColor: '0,0,0', lineStyle: 'solid' },
      points: [],
      locked: false,
      dataAttributes: [],
      group: '',
      props: { zindex: 0 },
    }
    const ln2: LinkerInstance = {
      ...ln1,
      id: 'ln-2',
      from: { id: 'el-other', x: 100, y: 0, angle: 0 },
      to: { id: 'el-target', x: 0, y: 0, angle: 0 },
    }
    ;(store.document.elements as Record<string, any>)['el-target'] = target
    ;(store.document.elements as Record<string, any>)['el-other'] = other
    ;(store.document.elements as Record<string, any>)['ln-1'] = ln1
    ;(store.document.elements as Record<string, any>)['ln-2'] = ln2

    const actions: AIAction[] = [{ type: 'delete_element', id: 'el-target' }]

    const result = await executor.execute(actions)

    // 级联删除目标元素及其附着连线（两条）
    expect(store.deleteElements).toHaveBeenCalledWith(
      expect.arrayContaining(['el-target', 'ln-1', 'ln-2']),
    )
    expect(result.deleted.elements).toBe(1)
    expect(result.deleted.cascadeLinkers).toBe(2)
  })

  it('执行 update_element 动作（位置变化时触发附着连线重路由）', async () => {
    // 预先写入元素与附着连线
    const el: ElementInstance = makeElement({ id: 'el-1' })
    const other: ElementInstance = makeElement({ id: 'el-2' })
    const ln: LinkerInstance = {
      id: 'ln-1',
      name: 'linker',
      from: { id: 'el-1', x: 50, y: 0, angle: 0 },
      to: { id: 'el-2', x: 300, y: 0, angle: 0 },
      text: '',
      linkerType: 'curve',
      lineStyle: { lineWidth: 1, lineColor: '0,0,0', lineStyle: 'solid' },
      points: [],
      locked: false,
      dataAttributes: [],
      group: '',
      props: { zindex: 0 },
    }
    ;(store.document.elements as Record<string, any>)['el-1'] = el
    ;(store.document.elements as Record<string, any>)['el-2'] = other
    ;(store.document.elements as Record<string, any>)['ln-1'] = ln

    const actions: AIAction[] = [{ type: 'update_element', id: 'el-1', x: 200, y: 300 }]

    const result = await executor.execute(actions)

    expect(store.updateElement).toHaveBeenCalledWith(
      'el-1',
      expect.objectContaining({ props: expect.objectContaining({ x: 200, y: 300 }) }),
    )
    // 附着连线被重路由并回写
    expect(store.updateLinker).toHaveBeenCalledWith('ln-1', expect.any(Object))
    expect(result.updated).toEqual(['el-1'])
  })

  it('批量执行多个动作：beginBatch + commitBatch 包裹为一个撤销单元', async () => {
    const actions: AIAction[] = [
      { type: 'add_element', refId: 'n1', schema: 'flowStart', x: 100, y: 200 },
      { type: 'add_element', refId: 'n2', schema: 'flowProcess', x: 300, y: 200 },
      { type: 'add_linker', from: 'n1', to: 'n2', linkerType: 'curve' },
    ]

    const result = await executor.execute(actions)

    expect(store.beginBatch).toHaveBeenCalledTimes(1)
    expect(store.commitBatch).toHaveBeenCalledTimes(1)
    expect(result.added).toHaveLength(3)
  })

  it('执行 update_element 动作并更新文本', async () => {
    const el: ElementInstance = makeElement({
      id: 'el-txt',
      textBlock: [{ position: { x: 10, y: 0, w: 'w-20', h: 'h' }, text: '旧文本' }],
    })
    ;(store.document.elements as Record<string, any>)['el-txt'] = el

    const actions: AIAction[] = [{ type: 'update_element', id: 'el-txt', text: '新文本' }]
    const result = await executor.execute(actions)

    expect(store.updateElement).toHaveBeenCalledWith(
      'el-txt',
      expect.objectContaining({
        textBlock: expect.arrayContaining([
          expect.objectContaining({ text: '新文本' }),
        ]),
      }),
    )
    expect(result.updated).toEqual(['el-txt'])
  })

  it('update_element 位置变化：reroute 在 updateElement 之前执行，连线端点按旧包围盒比例映射', async () => {
    // 旧位置 (0,0) 100x60 → 新位置 (200,300)
    const el: ElementInstance = makeElement({ id: 'el-1' })
    const other: ElementInstance = makeElement({ id: 'el-2' })
    // 端点附着在 el-1 右侧中点 (x=100, y=30)
    const ln: LinkerInstance = {
      id: 'ln-1',
      name: 'linker',
      from: { id: 'el-1', x: 100, y: 30, angle: 0 },
      to: { id: 'el-2', x: 300, y: 0, angle: 0 },
      text: '',
      linkerType: 'curve',
      lineStyle: { lineWidth: 1, lineColor: '0,0,0', lineStyle: 'solid' },
      points: [],
      locked: false,
      dataAttributes: [],
      group: '',
      props: { zindex: 0 },
    }
    ;(store.document.elements as Record<string, any>)['el-1'] = el
    ;(store.document.elements as Record<string, any>)['el-2'] = other
    ;(store.document.elements as Record<string, any>)['ln-1'] = ln

    const actions: AIAction[] = [{ type: 'update_element', id: 'el-1', x: 200, y: 300 }]
    await executor.execute(actions)

    // 验证 updateLinker 被调用且 from 端点按旧包围盒相对比例映射到新位置
    // 旧包围盒 (0,0,100,60)，端点相对比例 rx=(100-0)/100=1, ry=(30-0)/60=0.5
    // 新位置 (200,300,100,60)，映射后 from.x = 200 + 100*1 = 300, from.y = 300 + 60*0.5 = 330
    expect(store.updateLinker).toHaveBeenCalledWith(
      'ln-1',
      expect.objectContaining({
        from: expect.objectContaining({ id: 'el-1', x: 300, y: 330 }),
      }),
    )

    // 确保 reroute 在 updateElement 之前调用：
    // 调用顺序应该是 updateLinker(重路由) → updateElement(位置更新)
    const updateLinkerCallOrder = store.updateLinker.mock.invocationCallOrder[0]
    const updateElementCallOrder = store.updateElement.mock.invocationCallOrder[0]
    expect(updateLinkerCallOrder).toBeLessThan(updateElementCallOrder)
  })

  it('delete_element 不存在时跳过', async () => {
    const actions: AIAction[] = [{ type: 'delete_element', id: 'el-nonexistent' }]
    const result = await executor.execute(actions)

    expect(store.deleteElements).not.toHaveBeenCalled()
    expect(result.skipped).toHaveLength(1)
    expect(result.skipped[0].reason).toContain('not')
    expect(result.deleted.elements).toBe(0)
  })

  it('update_element 通过 refId 引用本批新增的元素', async () => {
    const actions: AIAction[] = [
      { type: 'add_element', refId: 'n1', schema: 'flowStart', x: 100, y: 200 },
      { type: 'update_element', id: 'n1', x: 500, y: 600, text: '移动并改名' },
    ]
    const result = await executor.execute(actions)

    expect(result.updated).toEqual(['el-new-1'])
    expect(store.updateElement).toHaveBeenCalledWith(
      'el-new-1',
      expect.objectContaining({
        props: expect.objectContaining({ x: 500, y: 600 }),
        textBlock: expect.arrayContaining([
          expect.objectContaining({ text: '移动并改名' }),
        ]),
      }),
    )
  })
})

describe('ActionExecutor 自动分层布局', () => {
  let executor: ActionExecutor
  let store: ReturnType<typeof createMockStore>
  let registry: ReturnType<typeof createMockRegistry>

  beforeEach(() => {
    store = createMockStore()
    registry = createMockRegistry()
    executor = new ActionExecutor(store as any, registry as any)
  })

  /** 读 store 中元素的最终 props */
  function propsOf(id: string) {
    return (store.document.elements[id] as ElementInstance).props
  }

  // A→B、A→C、B→D、C→D 判定分叉结构，AI 原始坐标全挤在一列（复现"一根竖线"病根）
  const forkActions: AIAction[] = [
    { type: 'add_element', refId: 'a', schema: 'flowStart', x: 100, y: 0 },
    { type: 'add_element', refId: 'b', schema: 'flowProcess', x: 100, y: 150 },
    { type: 'add_element', refId: 'c', schema: 'flowProcess', x: 100, y: 150 },
    { type: 'add_element', refId: 'd', schema: 'flowEnd', x: 100, y: 300 },
    { type: 'add_linker', from: 'a', to: 'b' },
    { type: 'add_linker', from: 'a', to: 'c' },
    { type: 'add_linker', from: 'b', to: 'd' },
    { type: 'add_linker', from: 'c', to: 'd' },
  ]

  it('分叉结构触发布局：同层分支横向展开，result.layout 计数正确', async () => {
    const result = await executor.execute(forkActions)

    expect(result.layout).toEqual({ moved: 4, backEdges: 0 })
    const b = propsOf('el-new-2')
    const c = propsOf('el-new-3')
    // B/C 同 y、x 展开（间隙 = hGap=60，即 x 差 = w + hGap = 160）
    expect(b.y).toBeCloseTo(c.y)
    expect(Math.abs(b.x - c.x)).toBeCloseTo(160)
    // 主干锚定原始原点：A 不跳走
    expect(propsOf('el-new-1').x).toBeCloseTo(100)
  })

  it('布局落库锁序：全部 updateLinker 先于任何 updateElement', async () => {
    await executor.execute(forkActions)

    expect(store.updateLinker).toHaveBeenCalledTimes(4) // 4 条批内连线重锚
    expect(store.updateElement).toHaveBeenCalledTimes(4) // 4 个图形移动
    const linkerOrders = store.updateLinker.mock.invocationCallOrder
    const elementOrders = store.updateElement.mock.invocationCallOrder
    expect(Math.max(...linkerOrders)).toBeLessThan(Math.min(...elementOrders))
  })

  it('触发布局时撤销单元不变：beginBatch/commitBatch 各恰一次', async () => {
    await executor.execute(forkActions)
    expect(store.beginBatch).toHaveBeenCalledTimes(1)
    expect(store.commitBatch).toHaveBeenCalledTimes(1)
  })

  it('2 元素 + 1 边：数量不足不触发', async () => {
    const result = await executor.execute([
      { type: 'add_element', refId: 'a', schema: 'flowStart', x: 100, y: 0 },
      { type: 'add_element', refId: 'b', schema: 'flowProcess', x: 100, y: 150 },
      { type: 'add_linker', from: 'a', to: 'b' },
    ])
    expect(result.layout).toBeUndefined()
    expect(store.updateElement).not.toHaveBeenCalled()
    expect(propsOf('el-new-2').y).toBe(150) // 坐标保持 AI 原值
  })

  it('3 元素零连线：无内部边不触发', async () => {
    const result = await executor.execute([
      { type: 'add_element', refId: 'a', schema: 'flowStart', x: 100, y: 0 },
      { type: 'add_element', refId: 'b', schema: 'flowProcess', x: 100, y: 150 },
      { type: 'add_element', refId: 'c', schema: 'flowEnd', x: 100, y: 300 },
    ])
    expect(result.layout).toBeUndefined()
    expect(store.updateElement).not.toHaveBeenCalled()
  })

  it('3 元素但仅 2 个可移动（含 free 文本）：不触发', async () => {
    const result = await executor.execute([
      { type: 'add_element', refId: 'a', schema: 'flowStart', x: 100, y: 0 },
      { type: 'add_element', refId: 'b', schema: 'flowProcess', x: 100, y: 150 },
      { type: 'add_element', refId: 't1', schema: 'freetext', x: 100, y: 300 },
      { type: 'add_element', refId: 't2', schema: 'freetext', x: 100, y: 400 },
      { type: 'add_linker', from: 'a', to: 'b' },
    ])
    expect(result.layout).toBeUndefined()
    expect(store.updateElement).not.toHaveBeenCalled()
  })

  it('批次含泳道元素：整批跳过', async () => {
    const result = await executor.execute([
      { type: 'add_element', refId: 'p', schema: 'lanePool', x: 0, y: 0 },
      { type: 'add_element', refId: 'a', schema: 'flowStart', x: 100, y: 0 },
      { type: 'add_element', refId: 'b', schema: 'flowProcess', x: 100, y: 150 },
      { type: 'add_element', refId: 'c', schema: 'flowEnd', x: 100, y: 300 },
      { type: 'add_linker', from: 'a', to: 'b' },
      { type: 'add_linker', from: 'b', to: 'c' },
    ])
    expect(result.layout).toBeUndefined()
    expect(store.updateElement).not.toHaveBeenCalled()
  })

  it('新元素挂在容器内（parent 非空）：整批跳过', async () => {
    const result = await executor.execute([
      { type: 'add_element', refId: 'a', schema: 'childEl', x: 100, y: 0 },
      { type: 'add_element', refId: 'b', schema: 'flowProcess', x: 100, y: 150 },
      { type: 'add_element', refId: 'c', schema: 'flowEnd', x: 100, y: 300 },
      { type: 'add_linker', from: 'a', to: 'b' },
      { type: 'add_linker', from: 'b', to: 'c' },
    ])
    expect(result.layout).toBeUndefined()
    expect(store.updateElement).not.toHaveBeenCalled()
  })

  it('连线端点为画布既有元素：既有元素不被移动，连线仍被重锚', async () => {
    const old = makeElement({ id: 'el-old', props: { x: 900, y: 900, w: 100, h: 60, zindex: 0, angle: 0 } })
    ;(store.document.elements as Record<string, any>)['el-old'] = old

    const result = await executor.execute([
      { type: 'add_element', refId: 'a', schema: 'flowStart', x: 100, y: 0 },
      { type: 'add_element', refId: 'b', schema: 'flowProcess', x: 100, y: 150 },
      { type: 'add_element', refId: 'c', schema: 'flowEnd', x: 100, y: 300 },
      { type: 'add_linker', from: 'a', to: 'b' },
      { type: 'add_linker', from: 'b', to: 'c' },
      { type: 'add_linker', from: 'c', to: 'el-old' },
    ])

    expect(result.layout).toEqual({ moved: 3, backEdges: 0 })
    expect(store.updateElement).not.toHaveBeenCalledWith('el-old', expect.anything())
    expect(propsOf('el-old')).toMatchObject({ x: 900, y: 900 })
    expect(store.updateLinker).toHaveBeenCalledTimes(3)
  })

  it('批内 delete 掉一个节点：被删者不被移动，剩余仍布局', async () => {
    const result = await executor.execute([
      ...forkActions,
      { type: 'delete_element', id: 'd' },
    ])
    // D 及其两条附着连线被级联删除，剩余 A/B/C 布局
    expect(result.layout).toEqual({ moved: 3, backEdges: 0 })
    expect(store.updateElement).not.toHaveBeenCalledWith('el-new-4', expect.anything())
    expect(store.document.elements['el-new-4']).toBeUndefined()
  })

  it('回环节点：回边剔出分层但连线保留，布局仍生效', async () => {
    const result = await executor.execute([
      { type: 'add_element', refId: 'a', schema: 'flowStart', x: 100, y: 0 },
      { type: 'add_element', refId: 'b', schema: 'flowProcess', x: 100, y: 150 },
      { type: 'add_element', refId: 'c', schema: 'flowEnd', x: 100, y: 300 },
      { type: 'add_linker', from: 'a', to: 'b' },
      { type: 'add_linker', from: 'b', to: 'c' },
      { type: 'add_linker', from: 'c', to: 'a' }, // 回环
    ])
    expect(result.layout).toEqual({ moved: 3, backEdges: 1 })
    // 链 y 仍严格递增
    expect(propsOf('el-new-1').y).toBeLessThan(propsOf('el-new-2').y)
    expect(propsOf('el-new-2').y).toBeLessThan(propsOf('el-new-3').y)
  })

  // ── 重锚升级：双向边侧锚分离 + 跳连穿越规避 ──────────────────
  // 布局后三节点同列：a y 0..60、b y 140..200、c y 280..340（vGap=80, h=60）
  const pairActions: AIAction[] = [
    { type: 'add_element', refId: 'a', schema: 'flowStart', x: 100, y: 0 },
    { type: 'add_element', refId: 'b', schema: 'flowProcess', x: 100, y: 150 },
    { type: 'add_element', refId: 'c', schema: 'flowProcess', x: 100, y: 300 },
    { type: 'add_linker', from: 'a', to: 'b' },
    { type: 'add_linker', from: 'b', to: 'c' },
    { type: 'add_linker', from: 'c', to: 'b' }, // 互逆边：后出现者应绕行
  ]

  /** 预置画布既有元素（带真实矩形锚点；不参与布局，但参与穿越检测） */
  function seedEl(id: string, x: number, y: number, w = 100, h = 60): void {
    seedElIn(store, id, x, y, w, h)
  }

  function seedElIn(
    target: ReturnType<typeof createMockStore>,
    id: string,
    x: number,
    y: number,
    w = 100,
    h = 60,
  ): void {
    const el = makeElement({ id, anchors: RECT_ANCHORS, props: { x, y, w, h, zindex: 0, angle: 0 } })
    ;(target.document.elements as Record<string, unknown>)[id] = el
  }

  function findLinkerIn(
    doc: Record<string, ElementInstance | LinkerInstance>,
    fromId: string,
    toId: string,
  ): LinkerInstance {
    const ln = Object.values(doc).find(
      (e): e is LinkerInstance =>
        e.name === 'linker' &&
        (e as LinkerInstance).from.id === fromId &&
        (e as LinkerInstance).to.id === toId,
    )
    if (!ln) throw new Error(`linker ${fromId}->${toId} not found`)
    return ln
  }

  function findLinker(fromId: string, toId: string): LinkerInstance {
    return findLinkerIn(store.document.elements, fromId, toId)
  }

  /** 连线完整路径的无向线段键集合（方向无关，用于几何重合比对） */
  function segKeys(ln: LinkerInstance): string[] {
    const full = [ln.from, ...ln.points, ln.to]
    const keys: string[] = []
    for (let i = 0; i < full.length - 1; i++) {
      const p1 = full[i]
      const p2 = full[i + 1]
      const [a, b] = p1.x < p2.x || (p1.x === p2.x && p1.y <= p2.y) ? [p1, p2] : [p2, p1]
      keys.push(`${a.x.toFixed(1)},${a.y.toFixed(1)}|${b.x.toFixed(1)},${b.y.toFixed(1)}`)
    }
    return keys
  }

  /** 全文档元素最终矩形表（供穿越断言） */
  function allRects(): Map<string, { x: number; y: number; w: number; h: number }> {
    const out = new Map<string, { x: number; y: number; w: number; h: number }>()
    for (const [id, el] of Object.entries(store.document.elements)) {
      if (el.name === 'linker') continue
      const e = el as ElementInstance
      out.set(id, { x: e.props.x, y: e.props.y, w: e.props.w, h: e.props.h })
    }
    return out
  }

  function rectOfEl(id: string): { x: number; y: number; w: number; h: number } {
    return rectOfElIn(store, id)
  }

  function rectOfElIn(
    target: ReturnType<typeof createMockStore>,
    id: string,
  ): { x: number; y: number; w: number; h: number } {
    const e = target.document.elements[id] as ElementInstance
    return { x: e.props.x, y: e.props.y, w: e.props.w, h: e.props.h }
  }

  it('双向边分离：互逆边对中后出现者走侧锚绕行，线段集合不相交', async () => {
    await executor.execute(pairActions)

    const lnBC = findLinker('el-new-2', 'el-new-3')
    const lnCB = findLinker('el-new-3', 'el-new-2')
    // 先出现者保留默认锚点：同列垂直堆叠 → 直线（空折点）
    expect(lnBC.points).toEqual([])
    // 绕行边走侧锚：from 为 c 的左锚点（x = c.x，内向角 0）
    expect(lnCB.from.x).toBeCloseTo(100)
    expect(lnCB.from.angle).toBeCloseTo(0, 5)
    // 两条边线段集合不相交（不再完全重叠）
    const keysBC = segKeys(lnBC)
    const keysCB = segKeys(lnCB)
    for (const k of keysBC) expect(keysCB).not.toContain(k)
  })

  it('侧锚绕行外侧优先：from 在 to 右走 right↔right，镜像场景走 left↔left', async () => {
    // 布置：a→b→c 链 + 固定元素 old 与 b 互逆相连（old→b 为绕行边）。
    // 注意 fixed old 会作为 b 的 fixedParent 参与横向对齐（b 被拉向 old 半程），
    // 断言按"锚点身份"（x 相对图形矩形）而非绝对坐标。
    const chainActions = (oldId: string): AIAction[] => [
      { type: 'add_element', refId: 'a', schema: 'flowStart', x: 100, y: 0 },
      { type: 'add_element', refId: 'b', schema: 'flowProcess', x: 100, y: 150 },
      { type: 'add_element', refId: 'c', schema: 'flowProcess', x: 100, y: 300 },
      { type: 'add_linker', from: 'a', to: 'b' },
      { type: 'add_linker', from: 'b', to: 'c' },
      { type: 'add_linker', from: 'c', to: oldId },
      { type: 'add_linker', from: oldId, to: 'b' }, // 互逆 → 绕行边
    ]

    // 场景 A：old 在右侧（中心 450 > 布局后 b 中心）→ 外侧是右锚
    seedEl('el-old-a', 400, 900)
    await executor.execute(chainActions('el-old-a'))
    const rerouteA = findLinker('el-old-a', 'el-new-2')
    const oldARect = rectOfEl('el-old-a')
    // from 为 el-old-a 的右锚点（x = rect 右缘，内向角 π）
    expect(rerouteA.from.x).toBeCloseTo(oldARect.x + oldARect.w)
    expect(rerouteA.from.y).toBeCloseTo(oldARect.y + oldARect.h / 2)
    expect(rerouteA.from.angle).toBeCloseTo(Math.PI, 5)
    expect(rerouteA.to.angle).toBeCloseTo(Math.PI, 5) // b 的右锚点
    expect(rerouteA.to.x).toBeCloseTo(rectOfEl('el-new-2').x + rectOfEl('el-new-2').w)

    // 场景 B：old 在左侧（oldCx=110 < 布局后 b 中心 130）→ 镜像走左锚
    const store2 = createMockStore()
    const registry2 = createMockRegistry()
    const executor2 = new ActionExecutor(store2 as any, registry2 as any)
    seedElIn(store2, 'el-old-b', 60, 900)
    await executor2.execute(chainActions('el-old-b'))
    const rerouteB = findLinkerIn(store2.document.elements, 'el-old-b', 'el-new-2')
    const oldBRect = rectOfElIn(store2, 'el-old-b')
    // from 为 el-old-b 的左锚点（x = rect 左缘，内向角 0）
    expect(rerouteB.from.x).toBeCloseTo(oldBRect.x)
    expect(rerouteB.from.y).toBeCloseTo(oldBRect.y + oldBRect.h / 2)
    expect(rerouteB.from.angle).toBeCloseTo(0, 5)
    expect(rerouteB.to.angle).toBeCloseTo(0, 5) // b 的左锚点
    expect(rerouteB.to.x).toBeCloseTo(rectOfElIn(store2, 'el-new-2').x)
  })

  it('跳连边穿越规避：默认锚点穿越中间节点时改走侧锚通道', async () => {
    await executor.execute([
      { type: 'add_element', refId: 'a', schema: 'flowStart', x: 100, y: 0 },
      { type: 'add_element', refId: 'b', schema: 'flowProcess', x: 100, y: 150 },
      { type: 'add_element', refId: 'c', schema: 'flowProcess', x: 100, y: 300 },
      { type: 'add_linker', from: 'a', to: 'b' },
      { type: 'add_linker', from: 'b', to: 'c' },
      { type: 'add_linker', from: 'a', to: 'c' }, // 跳连边
    ])
    // 夹具自证：默认锚点直连（x=150）必然穿过中间节点 b
    expect(segIntersectsRect({ x: 150, y: 60 }, { x: 150, y: 280 }, rectOfEl('el-new-2'))).toBe(true)

    const jump = findLinker('el-new-1', 'el-new-3')
    // 实际路径不再穿越任何图形
    const full = [jump.from, ...jump.points, jump.to]
    expect(findCrossedRects(full, allRects(), new Set(['el-new-1', 'el-new-3']))).toEqual([])
    // 走了侧锚通道：折点绕到 b 左侧
    expect(jump.points.length).toBeGreaterThan(0)
    expect(jump.points[0].x).toBeLessThan(100)
  })

  it('绕行侧被遮挡时回退另一侧：左通道被既有元素挡住改走右通道', async () => {
    seedEl('el-blocker-l', 40, 200) // 挡住左侧通道（x=70）
    await executor.execute(pairActions)

    const reroute = findLinker('el-new-3', 'el-new-2')
    // 全部折点绕到右侧（x > 200）
    expect(reroute.points.length).toBeGreaterThan(0)
    for (const p of reroute.points) expect(p.x).toBeGreaterThan(200)
  })

  it('全部候选都有碰撞时保留默认锚点（不产生怪异绕行）', async () => {
    seedEl('el-blocker-l', 40, 200) // 挡左通道（x=70）
    seedEl('el-blocker-r', 200, 200) // 挡右通道（x=230）
    seedEl('el-blocker-m', 115, 210, 70, 50) // 挡中央直线（x=150）
    await executor.execute(pairActions)

    const reroute = findLinker('el-new-3', 'el-new-2')
    // 保留默认锚点：c 上锚 → b 下锚，同列 dx=0 直线（空折点）
    expect(reroute.from.x).toBeCloseTo(150)
    expect(reroute.from.y).toBeCloseTo(280)
    expect(reroute.to.x).toBeCloseTo(150)
    expect(reroute.to.y).toBeCloseTo(200)
    expect(reroute.points).toEqual([])
  })

  it('skipLayout: 图片复刻模式跳过自动布局，AI 原坐标原样落库', async () => {
    // forkActions 为 3 元素互连结构，不带选项时必触发布局（既有用例已验证）
    const result = await executor.execute(forkActions, { skipLayout: true })

    expect(result.layout).toBeUndefined()
    expect(store.updateElement).not.toHaveBeenCalled()
    // 坐标保持 AI 原值：同列 x=100 不被横向展开
    expect(propsOf('el-new-2').x).toBe(100)
    expect(propsOf('el-new-3').x).toBe(100)
  })
})

describe('ActionExecutor 原型链防护（安全 M1）', () => {
  let executor: ActionExecutor
  let store: ReturnType<typeof createMockStore>
  let registry: ReturnType<typeof createMockRegistry>

  beforeEach(() => {
    store = createMockStore()
    registry = createMockRegistry()
    executor = new ActionExecutor(store as any, registry as any)
  })

  it('id 为 "__proto__"/"toString" 等原型链键时不命中真实元素', async () => {
    // 预置一个真实元素
    store.addElement(makeElement({ id: 'el-real' }))
    const actions: AIAction[] = [
      { type: 'delete_element', id: '__proto__' },
      { type: 'update_linker', id: 'toString' },
      { type: 'update_element', id: 'valueOf' },
    ]
    const result = await executor.execute(actions)

    // 全部被跳过，不因原型链查找而"成功"
    expect(result.skipped).toHaveLength(actions.length)
    expect(result.deleted.elements).toBe(0)
    expect(result.updated).toHaveLength(0)

    // 真实元素不受影响
    expect(store.deleteElements).not.toHaveBeenCalled()
    expect(store.updateElement).not.toHaveBeenCalled()
    expect(store.updateLinker).not.toHaveBeenCalled()
  })

  it('自有键的真实元素仍可正常操作（防护不影响正路径）', async () => {
    store.addElement(makeElement({ id: 'el-real' }))
    const result = await executor.execute([{ type: 'delete_element', id: 'el-real' }])
    expect(result.skipped).toHaveLength(0)
    expect(result.deleted.elements).toBe(1)
    expect(store.deleteElements).toHaveBeenCalledWith(['el-real'])
  })

  it('resolveRefId 对 "constructor" 键返回 undefined 而非误判存在', async () => {
    const result = await executor.execute([
      { type: 'add_linker', from: 'constructor', to: 'n9', linkerType: 'curve' },
    ])
    // from 无法解析 → 动作跳过，不会创建连线
    expect(result.skipped).toHaveLength(1)
    expect(result.added).toHaveLength(0)
    expect(store.addLinker).not.toHaveBeenCalled()
  })
})
