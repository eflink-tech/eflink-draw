import { describe, it, expect } from 'vitest'
import type { ElementInstance } from '@/types'
import { worldToLocalPoint, hitElementAtPoint, worldToScaled } from '../interaction'

/** 构造测试用图形实例（仅填命中检测需要的字段） */
function makeEl(
  over: Partial<Omit<ElementInstance, 'props'>> & { props?: Partial<ElementInstance['props']> },
): ElementInstance {
  const { props, ...rest } = over
  return {
    id: 'el-1',
    name: 'rectangle',
    title: '',
    category: 'basic',
    group: '',
    groupName: null,
    locked: false,
    link: '',
    children: [],
    parent: '',
    resizeDir: ['tl', 'tr', 'br', 'bl'],
    attribute: { visible: true },
    dataAttributes: [],
    props: { x: 0, y: 0, w: 100, h: 60, zindex: 0, angle: 0, ...props },
    shapeStyle: { alpha: 1 },
    lineStyle: { lineWidth: 2, lineColor: '50,50,50', lineStyle: 'solid' },
    fillStyle: { type: 'solid', color: '255,255,255' },
    path: [[]],
    fontStyle: { fontFamily: '', size: 13, color: '50,50,50', textAlign: 'center', vAlign: 'middle', bold: false, italic: false, underline: false },
    textBlock: [],
    anchors: [],
    ...rest,
  } as ElementInstance
}

describe('worldToLocalPoint（世界坐标 → 图形局部坐标，含逆旋转）', () => {
  it('未旋转：直接平移', () => {
    const el = makeEl({ props: { x: 100, y: 50, w: 100, h: 60 } })
    expect(worldToLocalPoint(el, 150, 80)).toEqual({ x: 50, y: 30 })
  })

  it('包围盒外返回 null', () => {
    const el = makeEl({ props: { x: 100, y: 50, w: 100, h: 60 } })
    expect(worldToLocalPoint(el, 50, 80)).toBeNull()
    expect(worldToLocalPoint(el, 250, 80)).toBeNull()
    expect(worldToLocalPoint(el, 150, 20)).toBeNull()
  })

  it('旋转 90°：逆旋转后落入包围盒', () => {
    // 中心 (150,80)，旋转 90° 后局部 +x 指向世界 -y
    const el = makeEl({ props: { x: 100, y: 50, w: 100, h: 60, angle: Math.PI / 2 } })
    // 世界点 (150,50)：相对中心 (0,-30)，逆旋转 -90° → 局部偏移 (-30,0) → 局部 (20, 30)
    const local = worldToLocalPoint(el, 150, 50)!
    expect(local.x).toBeCloseTo(20)
    expect(local.y).toBeCloseTo(30)
  })

  it('旋转 90° 后原包围盒角落不在新包围盒内', () => {
    const el = makeEl({ props: { x: 100, y: 50, w: 100, h: 60, angle: Math.PI / 2 } })
    // 旋转后占位为 60×100 的竖直矩形，原右上角 (200,50) 已出界
    expect(worldToLocalPoint(el, 200, 50)).toBeNull()
  })
})

describe('hitElementAtPoint（container 命中兜底）', () => {
  it('非 container 图形走 isPointInPath 精筛（不闭合路径不命中）', () => {
    // 仅一个 move 动作，路径不闭合 → isPointInPath 返回 false
    const el = makeEl({
      id: 'plain',
      attribute: { visible: true },
      props: { x: 0, y: 0, w: 100, h: 60 },
      path: [[{ action: 'move', x: 0, y: 0 }]],
    })
    expect(hitElementAtPoint([el], 50, 30)).toBeNull()
  })

  it('container 图形跳过 isPointInPath，用 AABB 兜底命中', () => {
    // 不闭合路径 + container 标记 → 不依赖 isPointInPath，仅凭包围盒命中
    const el = makeEl({
      id: 'container-1',
      attribute: { visible: true, container: true },
      props: { x: 0, y: 0, w: 100, h: 60 },
      path: [[{ action: 'move', x: 0, y: 0 }]],
    })
    expect(hitElementAtPoint([el], 50, 30)).toBe('container-1')
  })

  it('container 图形包围盒外不命中', () => {
    const el = makeEl({
      id: 'container-2',
      attribute: { visible: true, container: true },
      props: { x: 0, y: 0, w: 100, h: 60 },
      path: [[{ action: 'move', x: 0, y: 0 }]],
    })
    expect(hitElementAtPoint([el], 150, 30)).toBeNull()
  })
})

describe('worldToScaled', () => {
  it('只乘缩放、不含视口平移，供 HTML 文字层用 CSS translate 跟手', () => {
    expect(worldToScaled(100, 50, 2)).toEqual({ x: 200, y: 100 })
  })

  it('加上视口平移后等于屏幕坐标', () => {
    const s = worldToScaled(100, 50, 2)
    expect({ x: s.x + 30, y: s.y + 40 }).toEqual({ x: 230, y: 140 })
  })
})
