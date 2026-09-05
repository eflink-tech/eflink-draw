// 文档操作测试（移动/删除 + 连线跟随）
import { describe, it, expect } from 'vitest'
import {
  moveElementsInDoc,
  deleteElementsInDoc,
  resizeElementInDoc,
  routeAttachedLinkers,
} from '../documentOps'
import { createLinkerInstance } from '../linker'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import { createEmptyDocument, isLinker, type DocumentData, type ElementInstance } from '@/types'

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
