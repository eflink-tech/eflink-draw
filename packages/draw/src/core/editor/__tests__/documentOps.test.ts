// 文档操作测试（移动/删除 + 连线跟随）
import { describe, it, expect } from 'vitest'
import {
  attachedLinkerIds,
  moveElementsInDoc,
  deleteElementsInDoc,
  resizeElementInDoc,
  routeAttachedLinkers,
} from '../documentOps'
import { createLinkerInstance } from '../linker'
import { cursorPointAt } from '../linkerCursor'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import {
  createEmptyDocument,
  isLinker,
  type DocumentData,
  type ElementInstance,
  type LinkerInstance,
} from '@/types'

// 固定 120×60：测试连线跟随移动的数学，与 schema 默认尺寸解耦
function shape(
  x: number,
  y: number,
  id: string,
  name = 'rectangle',
  w = 120,
  h = 60,
): ElementInstance {
  const el = shapeRegistry.createElement(name, x, y)
  if (!el) throw new Error(`${name} schema missing`)
  return { ...el, id, props: { ...el.props, w, h } }
}

function makeDoc(): { doc: DocumentData; a: ElementInstance; b: ElementInstance } {
  const a = shape(100, 100, 'shape-a') // rectangle 默认 120×60
  const b = shape(400, 100, 'shape-b')
  // a 右锚点 (220,130) → b 左锚点 (400,130)
  const linker = createLinkerInstance(
    { id: a.id, x: 220, y: 130, angle: Math.PI },
    { id: b.id, x: 400, y: 130, angle: 0 },
    1,
  )
  const doc: DocumentData = {
    ...createEmptyDocument(),
    elements: {
      [a.id]: a,
      [b.id]: b,
      [linker.id]: linker,
    },
  }
  return { doc, a, b }
}

describe('moveElementsInDoc', () => {
  it('移动图形并联动连线端点重吸附', () => {
    const { doc, a, b } = makeDoc()
    const next = moveElementsInDoc(doc, [a.id], 50, 80)

    const na = next.elements[a.id] as ElementInstance
    expect(na.props.x).toBe(150)
    expect(na.props.y).toBe(180)

    const linker = Object.values(next.elements).find(isLinker)!
    // from 按相对比例 (1, 0.5) 映射到新包围盒 (150,180,120,60) → (270,210) = 新右锚点
    expect(linker.from).toMatchObject({ id: a.id, x: 270, y: 210, angle: Math.PI })
    // to 端不动
    expect(linker.to).toMatchObject({ id: b.id, x: 400, y: 130 })
    // points 已重算（非空路径）
    expect(linker.points.length).toBeGreaterThan(0)

    // 原文档不被修改（不可变性）
    expect((doc.elements[a.id] as ElementInstance).props.x).toBe(100)
  })

  it('移动两端连接的图形时两端都跟随', () => {
    const { doc, a, b } = makeDoc()
    const next = moveElementsInDoc(doc, [a.id, b.id], 10, 10)
    const linker = Object.values(next.elements).find(isLinker)!
    expect(linker.from).toMatchObject({ x: 230, y: 140 })
    expect(linker.to).toMatchObject({ x: 410, y: 140 })
  })

  it('锁定图形不移动', () => {
    const { doc, a } = makeDoc()
    a.locked = true
    const next = moveElementsInDoc(doc, [a.id], 50, 50)
    expect((next.elements[a.id] as ElementInstance).props.x).toBe(100)
  })
})

describe('resizeElementInDoc', () => {
  it('调整尺寸后端点按初始相对比例映射（保持锚点身份，不跳锚点）', () => {
    const { doc, a } = makeDoc()
    const next = resizeElementInDoc(doc, a.id, 100, 100, 200, 120)
    const na = next.elements[a.id] as ElementInstance
    expect(na.props.w).toBe(200)
    expect(na.props.h).toBe(120)

    const linker = Object.values(next.elements).find(isLinker)!
    // 原 from (220,130) 在旧包围盒 (100,100,120,60) 的相对比例 (1, 0.5) = 右锚点
    // 映射到新包围盒 (100,100,200,120) → (300,160) = 新右锚点（锚点身份保持）
    expect(linker.from).toMatchObject({ id: a.id, x: 300, y: 160, angle: Math.PI })
  })

  it('圆从下锚点拉大后端点仍在下锚点（用户场景：不跳到左侧）', () => {
    // 圆 100×100 @ (200,200)：下锚点 (250,300)
    const c = shape(200, 200, 'shape-c', 'round', 100, 100)
    const b = shape(400, 200, 'shape-b')
    const linker = createLinkerInstance(
      { id: c.id, x: 250, y: 300, angle: Math.PI * 1.5 },
      { id: b.id, x: 400, y: 230, angle: 0 },
      1,
    )
    const doc: DocumentData = {
      ...createEmptyDocument(),
      elements: { [c.id]: c, [b.id]: b, [linker.id]: linker },
    }
    // br 手柄拉大成 200×200（左上不动）
    const next = resizeElementInDoc(doc, c.id, 200, 200, 200, 200)
    const nl = Object.values(next.elements).find(isLinker)!
    // 相对比例 (0.5, 1) 映射 → (200+100, 200+200) = (300,400) = 新下锚点
    // （旧的重吸附逻辑会错误吸到左锚点 (200,300)）
    expect(nl.from).toMatchObject({ id: c.id, x: 300, y: 400, angle: Math.PI * 1.5 })
  })

  it('缩小图形后端点仍跟随锚点（旧逻辑会悬空在图形外）', () => {
    // 圆 200×200 @ (200,200)：下锚点 (300,400)
    const c = shape(200, 200, 'shape-c', 'round', 200, 200)
    const b = shape(400, 350, 'shape-b')
    const linker = createLinkerInstance(
      { id: c.id, x: 300, y: 400, angle: Math.PI * 1.5 },
      { id: b.id, x: 400, y: 385, angle: 0 },
      1,
    )
    const doc: DocumentData = {
      ...createEmptyDocument(),
      elements: { [c.id]: c, [b.id]: b, [linker.id]: linker },
    }
    // 缩小为 100×100（左上不动）
    const next = resizeElementInDoc(doc, c.id, 200, 200, 100, 100)
    const nl = Object.values(next.elements).find(isLinker)!
    // 相对比例 (0.5, 1) → (250,300) = 新下锚点
    // （旧端点 (300,400) 在新包围盒+10px 之外，旧重吸附逻辑会退化为悬空原坐标）
    expect(nl.from).toMatchObject({ id: c.id, x: 250, y: 300 })
  })

  it('最小尺寸 20', () => {
    const { doc, a } = makeDoc()
    const next = resizeElementInDoc(doc, a.id, 0, 0, 5, 5)
    expect((next.elements[a.id] as ElementInstance).props.w).toBe(20)
  })
})

describe('routeAttachedLinkers（live 直操）', () => {
  it('livePos 携带 w/h 时按初始相对比例映射端点（resize 直操期间，保持锚点身份）', () => {
    const { doc, a } = makeDoc()
    // resize 拖宽：a 120×60 → 200×60（live，store 仍是 120×60）
    const updated = routeAttachedLinkers(
      doc.elements,
      new Map([[a.id, { x: 100, y: 100, w: 200, h: 60 }]]),
    )
    const linker = [...updated.values()][0]!
    // 原 from (220,130) 相对比例 (1, 0.5) = 右锚点 → 新右锚点 (300,130)
    expect(linker.from).toMatchObject({ id: a.id, x: 300, y: 130, angle: Math.PI })
  })

  it('livePos 不带 w/h 时保持纯平移语义（移动直操）', () => {
    const { doc, a } = makeDoc()
    const updated = routeAttachedLinkers(
      doc.elements,
      new Map([[a.id, { x: 150, y: 100 }]]),
    )
    const linker = [...updated.values()][0]!
    // 移动 50：右锚点 (220,130) → (270,130)
    expect(linker.from).toMatchObject({ x: 270, y: 130 })
  })
})

describe('deleteElementsInDoc', () => {
  it('删除图形同时删除附着连线', () => {
    const { doc, a, b } = makeDoc()
    const { document: next, removedIds } = deleteElementsInDoc(doc, [a.id])
    expect(next.elements[a.id]).toBeUndefined()
    expect(next.elements[b.id]).toBeDefined()
    const linkerGone = Object.values(next.elements).every((el) => !isLinker(el))
    expect(linkerGone).toBe(true)
    expect(removedIds.size).toBe(2)
  })
})

describe('junction 联动（端点附着到连线的跟随）', () => {
  /** 两端自由、手工 points 的折线宿主：from(0,0)→(0,40)→(100,40)→to(100,100) */
  function hostLinker(id: string, fromShapeId: string | null = null): LinkerInstance {
    const l = createLinkerInstance(
      { id: fromShapeId, x: 0, y: 0, angle: 0 },
      { id: null, x: 100, y: 100, angle: 0 },
      1,
    )
    return {
      ...l,
      id,
      linkerType: 'broken',
      points: [
        { x: 0, y: 40 },
        { x: 100, y: 40 },
      ],
    }
  }

  /** to 端 junction 附着到宿主 t=0.25 的自由连线 */
  function depLinker(id: string, hostId: string): LinkerInstance {
    const l = createLinkerInstance(
      { id: null, x: 500, y: 500, angle: 0 },
      { id: null, x: 10, y: 40, angle: 0 },
      2,
    )
    return {
      ...l,
      id,
      linkerType: 'broken',
      to: { ...l.to, junction: { linkerId: hostId, t: 0.25 } },
    }
  }

  it('移动宿主附着图形：junction 附着点二阶跟随新路径', () => {
    const a = shape(0, 0, 'shape-a', 'rectangle', 1, 1)
    // 宿主 from 附着 a（自由尺寸 1×1 时比例映射为平移），points 手工给定
    const host = hostLinker('host', a.id)
    const dep = depLinker('dep', host.id)
    const doc: DocumentData = {
      ...createEmptyDocument(),
      elements: { [a.id]: a, [host.id]: host, [dep.id]: dep },
    }
    const before = { x: dep.to.x, y: dep.to.y }

    const next = moveElementsInDoc(doc, [a.id], 30, 0)
    const movedHost = next.elements[host.id] as LinkerInstance
    const movedDep = next.elements[dep.id] as LinkerInstance
    // 宿主几何确实变了（宿主端点跟随图形平移）
    expect(movedHost.from.x).toBe(30)
    // 附着点跟随新路径：坐标 = cursorPointAt(新宿主, t)
    const p = cursorPointAt(movedHost, 0.25)
    expect(movedDep.to.x).toBeCloseTo(p.x, 6)
    expect(movedDep.to.y).toBeCloseTo(p.y, 6)
    // 且确实发生了变化（不是原值）
    expect(movedDep.to.x !== before.x || movedDep.to.y !== before.y).toBe(true)
    // junction 字段保留
    expect(movedDep.to.junction).toEqual({ linkerId: host.id, t: 0.25 })
  })

  it('resize 宿主附着图形：junction 附着点同样跟随', () => {
    const a = shape(0, 0, 'shape-a', 'rectangle', 1, 1)
    const host = hostLinker('host', a.id)
    const dep = depLinker('dep', host.id)
    const doc: DocumentData = {
      ...createEmptyDocument(),
      elements: { [a.id]: a, [host.id]: host, [dep.id]: dep },
    }
    const next = resizeElementInDoc(doc, a.id, 0, 0, 2, 2)
    const movedHost = next.elements[host.id] as LinkerInstance
    const movedDep = next.elements[dep.id] as LinkerInstance
    const p = cursorPointAt(movedHost, 0.25)
    expect(movedDep.to.x).toBeCloseTo(p.x, 6)
    expect(movedDep.to.y).toBeCloseTo(p.y, 6)
  })

  it('宿主未变动时 junction 连线不出现在更新中', () => {
    const host = hostLinker('host')
    const dep = depLinker('dep', host.id)
    const doc: DocumentData = {
      ...createEmptyDocument(),
      elements: { [host.id]: host, [dep.id]: dep },
    }
    // 移动一个与宿主无关的图形
    const c = shape(1000, 1000, 'shape-c')
    const next = moveElementsInDoc({ ...doc, elements: { ...doc.elements, [c.id]: c } }, [c.id], 10, 10)
    expect(next.elements[dep.id]).toBe(dep) // 引用未变
  })

  it('attachedLinkerIds：junction 附着的连线纳入传递闭包', () => {
    const a = shape(100, 100, 'shape-a')
    const host = createLinkerInstance(
      { id: a.id, x: 220, y: 130, angle: Math.PI },
      { id: null, x: 300, y: 130, angle: 0 },
      1,
    )
    const dep = depLinker('dep', host.id)
    const unrelated = createLinkerInstance(
      { id: null, x: 900, y: 900, angle: 0 },
      { id: null, x: 950, y: 950, angle: 0 },
      3,
    )
    const elements = { [a.id]: a, [host.id]: host, [dep.id]: dep, [unrelated.id]: unrelated }
    const ids = attachedLinkerIds(elements, [a.id])
    expect(ids).toContain(host.id)
    expect(ids).toContain(dep.id)
    expect(ids).not.toContain(unrelated.id)
  })
})

describe('deleteElementsInDoc junction 脱附', () => {
  /** 两端自由、手工 points 的折线宿主 */
  function hostLinker(id: string): LinkerInstance {
    const l = createLinkerInstance(
      { id: null, x: 0, y: 0, angle: 0 },
      { id: null, x: 100, y: 100, angle: 0 },
      1,
    )
    return {
      ...l,
      id,
      linkerType: 'broken',
      points: [
        { x: 0, y: 40 },
        { x: 100, y: 40 },
      ],
    }
  }

  function depLinker(id: string, hostId: string): LinkerInstance {
    const l = createLinkerInstance(
      { id: null, x: 500, y: 500, angle: 0 },
      { id: null, x: 10, y: 40, angle: 0 },
      2,
    )
    return {
      ...l,
      id,
      linkerType: 'broken',
      to: { ...l.to, junction: { linkerId: hostId, t: 0.25 } },
    }
  }

  it('删除宿主连线：附着连线脱附为自由端点（保坐标，不级联删除）', () => {
    const host = hostLinker('host')
    const dep = depLinker('dep', host.id)
    const doc: DocumentData = {
      ...createEmptyDocument(),
      elements: { [host.id]: host, [dep.id]: dep },
    }
    const { document: next, removedIds, detached } = deleteElementsInDoc(doc, [host.id])
    expect(removedIds.has('host')).toBe(true)
    expect(detached).toEqual(['dep'])
    expect(next.elements['host']).toBeUndefined()
    const nd = next.elements['dep'] as LinkerInstance
    expect(nd.to.junction).toBeUndefined()
    expect(nd.to.x).toBe(dep.to.x)
    expect(nd.to.y).toBe(dep.to.y)
    // 原文档不被修改
    expect((doc.elements['dep'] as LinkerInstance).to.junction).toEqual({ linkerId: 'host', t: 0.25 })
  })

  it('删除宿主附着的图形（级联删宿主连线）：junction 同样脱附', () => {
    const a = shape(0, 0, 'shape-a', 'rectangle', 1, 1)
    const host = hostLinker('host')
    // host.from 附着 a：删除 a 时 host 被级联删除
    const hostAttached = { ...host, from: { ...host.from, id: a.id } }
    const dep = depLinker('dep', host.id)
    const doc: DocumentData = {
      ...createEmptyDocument(),
      elements: { [a.id]: a, [host.id]: hostAttached, [dep.id]: dep },
    }
    const { document: next, removedIds, detached } = deleteElementsInDoc(doc, [a.id])
    expect(removedIds.has('host')).toBe(true)
    expect(detached).toEqual(['dep'])
    expect(next.elements['dep']).toBeDefined()
    expect((next.elements['dep'] as LinkerInstance).to.junction).toBeUndefined()
  })

  it('宿主未被删除时无脱附', () => {
    const unrelated = shape(900, 900, 'shape-x')
    const host = hostLinker('host')
    const dep = depLinker('dep', host.id)
    const doc: DocumentData = {
      ...createEmptyDocument(),
      elements: { [unrelated.id]: unrelated, [host.id]: host, [dep.id]: dep },
    }
    const { detached } = deleteElementsInDoc(doc, [unrelated.id])
    expect(detached).toEqual([])
  })
})
