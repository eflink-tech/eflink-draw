// L 连线工具：起点解析测试（resolveLinkerStart 纯函数）+ junction 吸附创建集成
import { describe, it, expect, beforeEach } from 'vitest'
import { resolveLinkerStart, beginFreeLinker, moveFreeLinker, endFreeLinker } from '../linkerTool'
import { useEditorStore } from '@/store/editorStore'
import { createEmptyDocument, isLinker } from '@/types'
import type { ElementInstance, LinkerInstance } from '@/types'
import { createLinkerInstance } from '../linker'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'

function shape(x: number, y: number, w = 100, h = 60): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', x, y)
  if (!el) throw new Error('rectangle schema missing')
  el.props.w = w
  el.props.h = h
  return el
}

describe('resolveLinkerStart（L 连线工具起点）', () => {
  it('命中图形 → 吸附最近锚点', () => {
    const el = shape(100, 200, 100, 60)
    // 点击上锚点附近 (150, 200)：上锚点 (150,200)，内向角 π/2
    const r = resolveLinkerStart([el], 150, 200)
    expect(r.id).toBe(el.id)
    expect(r.x).toBe(150)
    expect(r.y).toBe(200)
    expect(r.angle).toBeCloseTo(Math.PI / 2)
  })

  it('空白区域 → 自由端点', () => {
    const el = shape(100, 200, 100, 60)
    // 远离图形包围盒（+10px 粗筛外）
    const r = resolveLinkerStart([el], 400, 400)
    expect(r.id).toBeNull()
    expect(r.x).toBe(400)
    expect(r.y).toBe(400)
    expect(r.angle).toBe(0)
  })

  it('锁定图形 → 回退为自由端点（不可连线/吸附）', () => {
    const el = shape(100, 200, 100, 60)
    el.locked = true
    // 命中锁定图形位置，也应回退自由端点
    const r = resolveLinkerStart([el], 150, 200)
    expect(r.id).toBeNull()
    expect(r.x).toBe(150)
    expect(r.y).toBe(200)
  })

  it('命中图形内部非锚点 → 吸附距按下点最近的锚点（默认从节点起线）', () => {
    const el = shape(100, 200, 100, 60)
    // 点击 (130, 205)：最近锚点为顶边中点 (150,200)（非轮廓投影点 (130,200)）
    const r = resolveLinkerStart([el], 130, 205, 1)
    expect(r.id).toBe(el.id)
    expect(r.x).toBe(150)
    expect(r.y).toBe(200)
    expect(r.angle).toBeCloseTo(Math.PI / 2, 6)
  })

  it('锚点 7px 内仍优先锚点', () => {
    const el = shape(100, 200, 100, 60)
    // 距顶锚 (150,200) 3px
    const r = resolveLinkerStart([el], 150, 203, 1)
    expect(r.x).toBe(150)
    expect(r.y).toBe(200)
    expect(r.angle).toBeCloseTo(Math.PI / 2, 6)
  })

  it('锚点容差随 scale 缩小：超出直中容差仍吸附最近锚点', () => {
    const el = shape(100, 200, 100, 60)
    // tol = 7/4 = 1.75 < 3 → 不直中 (150,360)，但最近锚点仍是 (150,200)
    const r = resolveLinkerStart([el], 150, 203, 4)
    expect(r.id).toBe(el.id)
    expect(r.x).toBe(150)
    expect(r.y).toBe(200)
  })

  it('点击偏离锚点法线方向 → 不落成轮廓点，吸附最近锚点（不同缩放一致）', () => {
    const el = shape(100, 200, 100, 60)
    // (190,232)：最近锚点为右边中点 (200,230)（轮廓投影为 (200,232)）
    expect(resolveLinkerStart([el], 190, 232, 1)).toMatchObject({ x: 200, y: 230 })
    expect(resolveLinkerStart([el], 190, 232, 4)).toMatchObject({ x: 200, y: 230 })
  })

  it('无锚点图形 → 回退轮廓最近点', () => {
    const el = shape(100, 200, 100, 60)
    el.anchors = []
    // 无锚点：点击 (130,205) 投影到顶边 (130,200)
    const r = resolveLinkerStart([el], 130, 205, 1)
    expect(r.id).toBe(el.id)
    expect(r.x).toBe(130)
    expect(r.y).toBe(200)
  })
})

describe('自由连线工具（junction 吸附集成）', () => {
  beforeEach(() => {
    useEditorStore.setState({
      document: createEmptyDocument(),
      selectedIds: new Set(),
      viewport: { x: 0, y: 0, scale: 1 },
      isDirty: false,
    })
  })

  /** from(0,0)→(0,40)→(100,40)→to(100,100) 的折线宿主（入库） */
  function addHost(): LinkerInstance {
    const l = createLinkerInstance(
      { id: null, x: 0, y: 0, angle: 0 },
      { id: null, x: 100, y: 100, angle: 0 },
      1,
    )
    const host: LinkerInstance = {
      ...l,
      linkerType: 'broken',
      points: [
        { x: 0, y: 40 },
        { x: 100, y: 40 },
      ],
    }
    useEditorStore.getState().addLinker(host)
    return host
  }

  it('moveFreeLinker 吸附宿主连线 → endFreeLinker 创建的实例带 junction', () => {
    const host = addHost()
    beginFreeLinker(400, 400) // 空白起点 → 自由端点
    moveFreeLinker(10, 50, null) // 光标落在宿主水平段 10px 内 → junction 吸附
    endFreeLinker()

    const els = useEditorStore.getState().document.elements
    const created = Object.values(els).find(
      (el): el is LinkerInstance => isLinker(el) && el.id !== host.id,
    )
    expect(created).toBeDefined()
    expect(created!.to.id).toBeNull()
    expect(created!.to.junction).toEqual({ linkerId: host.id, t: 0.25 })
    expect(created!.to).toMatchObject({ x: 10, y: 40 })
  })

  it('图形内部起线 → 起点挂节点，拖拽中换到面向指针的锚点', () => {
    const el = shape(100, 200, 100, 60)
    useEditorStore.getState().addElement(el)
    beginFreeLinker(130, 205) // 内部非锚点 → 最近锚点 (150,200)
    moveFreeLinker(400, 500, null) // 拖向右下 → 起点换成右下方向的锚点
    endFreeLinker()

    const created = Object.values(useEditorStore.getState().document.elements).find(
      (e): e is LinkerInstance => isLinker(e),
    )
    expect(created).toBeDefined()
    expect(created!.from.id).toBe(el.id)
    expect(created!.from.x).toBe(200) // 右边中点（面向指针）
    expect(created!.from.y).toBe(230)
  })

  it('按在锚点上起线 → 起点锁定该锚点，拖拽中不换边', () => {
    const el = shape(100, 200, 100, 60)
    useEditorStore.getState().addElement(el)
    beginFreeLinker(150, 200) // 顶边中点直中
    moveFreeLinker(400, 500, null)
    endFreeLinker()

    const created = Object.values(useEditorStore.getState().document.elements).find(
      (e): e is LinkerInstance => isLinker(e),
    )
    expect(created).toBeDefined()
    expect(created!.from).toMatchObject({ id: el.id, x: 150, y: 200 })
  })

  it('空白处结束拖拽 → 普通自由连线（无 junction）', () => {
    addHost()
    beginFreeLinker(400, 400)
    moveFreeLinker(500, 500, null) // 远离宿主路径
    endFreeLinker()

    const created = Object.values(useEditorStore.getState().document.elements).find(
      (el): el is LinkerInstance => isLinker(el),
    )
    expect(created).toBeDefined()
    expect(created!.to.junction).toBeUndefined()
  })
})
