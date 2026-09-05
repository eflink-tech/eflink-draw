// 连线几何计算测试
import { describe, it, expect } from 'vitest'
import {
  getAngleDir,
  getAnchorPoints,
  getLocalAnchors,
  getLinkerPoints,
  findSnapAnchor,
  measureDistance,
  snapLinkerEndpoint,
  type ShapeRect,
} from '../linker'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import type { ElementInstance } from '@/types'

function shape(x: number, y: number, w = 100, h = 60): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', x, y)
  if (!el) throw new Error('rectangle schema missing')
  el.props.w = w
  el.props.h = h
  return el
}

function rectGetter(map: Record<string, ShapeRect>): (id: string) => ShapeRect | null {
  return (id) => map[id] ?? null
}

describe('getAngleDir（内向角语义）', () => {
  it('1=上锚点（内向朝下 π/2）', () => {
    expect(getAngleDir(Math.PI / 2)).toBe(1)
  })
  it('2=右锚点（内向朝左 π）', () => {
    expect(getAngleDir(Math.PI)).toBe(2)
  })
  it('3=下锚点（内向朝上 3π/2）', () => {
    expect(getAngleDir((Math.PI / 2) * 3)).toBe(3)
  })
  it('4=左锚点（内向朝右 0）', () => {
    expect(getAngleDir(0)).toBe(4)
  })
})

describe('getLocalAnchors', () => {
  it('默认用图形自身尺寸计算锚点局部坐标', () => {
    const el = shape(0, 0, 100, 60)
    const pts = getLocalAnchors(el)
    expect(pts).toHaveLength(4)
    expect(pts).toContainEqual({ x: 50, y: 0, angle: Math.PI / 2 })
    expect(pts).toContainEqual({ x: 100, y: 30, angle: Math.PI })
  })

  it('传入 live w/h 时按实时尺寸计算（resize 直操期间）', () => {
    const el = shape(0, 0, 100, 60)
    // resize 拖到 200×100：右锚点应为 (200, 50)
    const pts = getLocalAnchors(el, 200, 100)
    expect(pts).toContainEqual({ x: 200, y: 50, angle: Math.PI })
    expect(pts).toContainEqual({ x: 100, y: 0, angle: Math.PI / 2 })
  })
})

describe('getAnchorPoints', () => {
  it('未旋转时返回四边中点与内向角', () => {
    const el = shape(100, 200, 100, 60)
    const pts = getAnchorPoints(el)
    // 上锚点：(150, 200)，内向角 π/2
    expect(pts).toHaveLength(4)
    const top = pts.find((p) => p.y === 200)
    expect(top).toMatchObject({ x: 150, angle: Math.PI / 2 })
    const left = pts.find((p) => p.x === 100)
    expect(left).toMatchObject({ y: 230, angle: 0 })
  })

  it('旋转 90° 时锚点位置绕中心旋转', () => {
    const el = shape(100, 200, 100, 60)
    el.props.angle = Math.PI / 2
    const pts = getAnchorPoints(el)
    const cx = 150
    const cy = 230
    // 上锚点 (150,200) 绕中心 90°: (180, 230)
    const top = pts.find((p) => Math.abs(p.x - 180) < 1e-9 && Math.abs(p.y - 230) < 1e-9)
    expect(top).toBeDefined()
    // 旋转后内向角也旋转：π/2 + π/2 = π
    expect(top!.angle).toBeCloseTo(Math.PI, 10)
    void cx
    void cy
  })
})

describe('getLinkerPoints - 两端自由', () => {
  const getter = rectGetter({})

  it('水平为主时走垂直中点肘形', () => {
    const from = { id: null, x: 0, y: 0, angle: 0 }
    const to = { id: null, x: 200, y: 100, angle: 0 }
    const pts = getLinkerPoints({ linkerType: 'broken', from, to }, getter)
    // m=200 >= D=100 → z=100: (100,0) (100,100)
    expect(pts).toEqual([
      { x: 100, y: 0 },
      { x: 100, y: 100 },
    ])
  })

  it('垂直为主时走水平中点肘形', () => {
    const from = { id: null, x: 0, y: 0, angle: 0 }
    const to = { id: null, x: 100, y: 200, angle: 0 }
    const pts = getLinkerPoints({ linkerType: 'broken', from, to }, getter)
    expect(pts).toEqual([
      { x: 0, y: 100 },
      { x: 100, y: 100 },
    ])
  })
})

describe('getLinkerPoints - 垂直堆叠快速路径（方向与作用域）', () => {
  // 快速路径契约：仅服务"面对面上下锚点对"（dir1↔dir3）；折点必须按 from→to 行进方向排序，
  // 否则 from 为下方端时渲染出自交叉锯齿（回归：e741104 引入的方向缺失）。
  const A = { x: 100, y: 100, w: 100, h: 60 } // 上图形 x:100..200, y:100..160
  const B = { x: 180, y: 300, w: 100, h: 60 } // 下图形 x:180..280, y:300..360（水平部分重叠）

  it('from 为下方端、dx>15：折点为 w→d 序，路径正交不自交叉', () => {
    const a = shape(100, 100)
    const b = shape(180, 300)
    const from = { id: b.id, x: 230, y: 360, angle: (Math.PI / 2) * 3 } // B 下锚点
    const to = { id: a.id, x: 150, y: 100, angle: Math.PI / 2 } // A 上锚点
    const pts = getLinkerPoints(
      { linkerType: 'broken', from, to },
      rectGetter({ [a.id]: A, [b.id]: B }),
    )
    // midY = (100+360)/2 = 230；top→bot 生成后需反转为 w→d 序
    expect(pts).toEqual([
      { x: 230, y: 230 },
      { x: 150, y: 230 },
    ])
  })

  it('from 为上方端：折点保持 top→bot 序（回归守护）', () => {
    const a = shape(100, 100)
    const b = shape(180, 300)
    const from = { id: a.id, x: 150, y: 160, angle: (Math.PI / 2) * 3 } // A 下锚点
    const to = { id: b.id, x: 230, y: 300, angle: Math.PI / 2 } // B 上锚点
    const pts = getLinkerPoints(
      { linkerType: 'broken', from, to },
      rectGetter({ [a.id]: A, [b.id]: B }),
    )
    expect(pts).toEqual([
      { x: 150, y: 230 },
      { x: 230, y: 230 },
    ])
  })

  it('dx<2（x 对齐）：空折点直线直连，from 在下方也成立', () => {
    const a = shape(100, 100)
    const b = shape(100, 300)
    const from = { id: b.id, x: 150, y: 360, angle: (Math.PI / 2) * 3 }
    const to = { id: a.id, x: 150, y: 100, angle: Math.PI / 2 }
    const pts = getLinkerPoints(
      { linkerType: 'broken', from, to },
      rectGetter({
        [a.id]: { x: 100, y: 100, w: 100, h: 60 },
        [b.id]: { x: 100, y: 300, w: 100, h: 60 },
      }),
    )
    expect(pts).toEqual([])
  })

  it('dx≤15：单拐点，from 为下方端时同样取中点', () => {
    const a = shape(100, 100)
    const b = shape(110, 300)
    const from = { id: b.id, x: 160, y: 360, angle: (Math.PI / 2) * 3 }
    const to = { id: a.id, x: 150, y: 100, angle: Math.PI / 2 }
    const pts = getLinkerPoints(
      { linkerType: 'broken', from, to },
      rectGetter({
        [a.id]: { x: 100, y: 100, w: 100, h: 60 },
        [b.id]: { x: 110, y: 300, w: 100, h: 60 },
      }),
    )
    expect(pts).toEqual([{ x: 155, y: 230 }])
  })

  it('dx≤15：from 为上方端时单拐点位置一致', () => {
    const a = shape(100, 100)
    const b = shape(110, 300)
    const from = { id: a.id, x: 150, y: 160, angle: (Math.PI / 2) * 3 }
    const to = { id: b.id, x: 160, y: 300, angle: Math.PI / 2 }
    const pts = getLinkerPoints(
      { linkerType: 'broken', from, to },
      rectGetter({
        [a.id]: { x: 100, y: 100, w: 100, h: 60 },
        [b.id]: { x: 110, y: 300, w: 100, h: 60 },
      }),
    )
    expect(pts).toEqual([{ x: 155, y: 230 }])
  })

  it('同侧左锚点堆叠对：走 (4,4) 分支左侧绕行（不被快速路径劫持）', () => {
    const a = shape(100, 100)
    const b = shape(100, 400)
    const from = { id: a.id, x: 100, y: 130, angle: 0 } // A 左锚点 dir4
    const to = { id: b.id, x: 100, y: 430, angle: 0 } // B 左锚点 dir4
    const pts = getLinkerPoints(
      { linkerType: 'broken', from, to },
      rectGetter({
        [a.id]: { x: 100, y: 100, w: 100, h: 60 },
        [b.id]: { x: 100, y: 400, w: 100, h: 60 },
      }),
    )
    // g=B（按 w.x < d.x 判定失败取 d），o = B.x - 30 = 70，l=true 反转为 w→d 序
    expect(pts).toEqual([
      { x: 70, y: 130 },
      { x: 70, y: 430 },
    ])
  })

  it('midY=nearBot：dx>15 时过渡段贴近下方图形顶边（bot 上锚）', () => {
    const a = shape(100, 100)
    const b = shape(180, 300)
    const from = { id: a.id, x: 150, y: 160, angle: (Math.PI / 2) * 3 } // A 下锚点
    const to = { id: b.id, x: 230, y: 300, angle: Math.PI / 2 } // B 上锚点
    const pts = getLinkerPoints(
      { linkerType: 'broken', from, to },
      rectGetter({ [a.id]: A, [b.id]: B }),
      { midY: 'nearBot' },
    )
    // 默认中点 midY=(160+300)/2=230；nearBot = bot.y - r = 300-30 = 270
    expect(pts).toEqual([
      { x: 150, y: 270 },
      { x: 230, y: 270 },
    ])
  })

  it('midY=nearBot：bot 为下锚时回退中点（避免过渡段落在图形本体）', () => {
    const a = shape(100, 100)
    const b = shape(180, 300)
    const from = { id: a.id, x: 150, y: 100, angle: Math.PI / 2 } // A 上锚点
    const to = { id: b.id, x: 230, y: 360, angle: (Math.PI / 2) * 3 } // B 下锚点
    const pts = getLinkerPoints(
      { linkerType: 'broken', from, to },
      rectGetter({ [a.id]: A, [b.id]: B }),
      { midY: 'nearBot' },
    )
    // bot 锚在底边（dir3）：贴顶会使垂直段穿过 b 本体 → 回退中点 midY=230
    expect(pts).toEqual([
      { x: 150, y: 230 },
      { x: 230, y: 230 },
    ])
  })
})

describe('getLinkerPoints - 两端附着', () => {
  it('上锚点 → 下锚点（垂直相对，水平错开）从两侧绕行', () => {
    const a = shape(100, 100)
    const b = shape(300, 400)
    const from = { id: a.id, x: 150, y: 100, angle: Math.PI / 2 } // 上锚点
    const to = { id: b.id, x: 350, y: 460, angle: (Math.PI / 2) * 3 } // 下锚点
    const pts = getLinkerPoints(
      { linkerType: 'broken', from, to },
      rectGetter({
        [a.id]: { x: 100, y: 100, w: 100, h: 60 },
        [b.id]: { x: 300, y: 400, w: 100, h: 60 },
      }),
    )
    // 两矩形水平不重叠；i.x > g.x → o = a + (v.x - a)/2 = 250
    // 上通道 y = g.y - 30 = 70，下通道 y = i.y + 30 = 490
    expect(pts).toEqual([
      { x: 150, y: 70 },
      { x: 250, y: 70 },
      { x: 250, y: 490 },
      { x: 350, y: 490 },
    ])
  })

  it('右锚点 → 左锚点（水平相对，from 在左）走 m/2 中间竖线', () => {
    const a = shape(100, 100)
    const b = shape(400, 100)
    const from = { id: a.id, x: 200, y: 130, angle: Math.PI } // 右锚点 dir2
    const to = { id: b.id, x: 400, y: 130, angle: 0 } // 左锚点 dir4
    const pts = getLinkerPoints(
      { linkerType: 'broken', from, to },
      rectGetter({
        [a.id]: { x: 100, y: 100, w: 100, h: 60 },
        [b.id]: { x: 400, y: 100, w: 100, h: 60 },
      }),
    )
    // g=from(dir2) i=to；i.x > g.x → o = g.x + m/2 = 200+100=300
    expect(pts).toEqual([
      { x: 300, y: 130 },
      { x: 300, y: 130 },
    ])
  })

  it('同向上锚点（两图形上下排列，from 在上）从上方绕行', () => {
    const a = shape(100, 100)
    const b = shape(100, 400)
    const from = { id: a.id, x: 150, y: 100, angle: Math.PI / 2 }
    const to = { id: b.id, x: 150, y: 400, angle: Math.PI / 2 }
    const pts = getLinkerPoints(
      { linkerType: 'broken', from, to },
      rectGetter({
        [a.id]: { x: 100, y: 100, w: 100, h: 60 },
        [b.id]: { x: 100, y: 400, w: 100, h: 60 },
      }),
    )
    // g=from(上) n = g.y - 30 = 70；i.x 在 h.x±r 内 → o 按半宽选择（150 < 中线? 相等 → else 分支 230）
    // i.x=150 = h.x+w/2=150 → 不小于 → o = h.x+w+r = 230；n2 = i.y - 30 = 370
    expect(pts).toEqual([
      { x: 150, y: 70 },
      { x: 230, y: 70 },
      { x: 230, y: 370 },
      { x: 150, y: 370 },
    ])
  })
})

describe('getLinkerPoints - 一端自由', () => {
  it('附着端为上锚点且自由端在上方，水平为主：直接拐到自由端 y', () => {
    const a = shape(100, 100)
    const from = { id: a.id, x: 150, y: 100, angle: Math.PI / 2 }
    const to = { id: null, x: 400, y: 50, angle: 0 }
    const pts = getLinkerPoints(
      { linkerType: 'broken', from, to },
      rectGetter({ [a.id]: { x: 100, y: 100, w: 100, h: 60 } }),
    )
    // i.y < g.y 且 m=250 >= D=50 → (g.x, i.y)
    expect(pts).toEqual([{ x: 150, y: 50 }])
  })
})

describe('getLinkerPoints - curve', () => {
  it('附着端控制点沿内向角反向延伸 0.4×距离', () => {
    const a = shape(100, 100)
    const b = shape(400, 100)
    const from = { id: a.id, x: 200, y: 130, angle: Math.PI }
    const to = { id: b.id, x: 400, y: 130, angle: 0 }
    const pts = getLinkerPoints(
      { linkerType: 'curve', from, to },
      rectGetter({
        [a.id]: { x: 100, y: 100, w: 100, h: 60 },
        [b.id]: { x: 400, y: 100, w: 100, h: 60 },
      }),
    )
    expect(pts).toHaveLength(2)
    // 距离 200，k = 80；from 控制点 = (200 + 80, 130)
    expect(pts[0]).toEqual({ x: 280, y: 130 })
    // to 控制点 = (400 - 80, 130)
    expect(pts[1]).toEqual({ x: 320, y: 130 })
  })
})

describe('findSnapAnchor', () => {
  it('命中包围盒内最近锚点', () => {
    const el = shape(100, 200, 100, 60)
    const hit = findSnapAnchor([el], 155, 205, null)
    expect(hit).not.toBeNull()
    expect(hit!.id).toBe(el.id)
    expect(hit!.x).toBe(150) // 上锚点最近
    expect(hit!.y).toBe(200)
    expect(hit!.angle).toBeCloseTo(Math.PI / 2, 10)
  })

  it('超出包围盒 +10px 不命中', () => {
    const el = shape(100, 200, 100, 60)
    expect(findSnapAnchor([el], 100, 185, null)).toBeNull()
  })

  it('linkable === false 的图形不参与锚点吸附', () => {
    const el = shape(100, 200, 100, 60)
    el.attribute.linkable = false
    expect(findSnapAnchor([el], 155, 205, null)).toBeNull()
  })
})

describe('measureDistance', () => {
  it('欧氏距离', () => {
    expect(measureDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
  })
})

// ═══════════════════════════════════════════
// 关键语义：吸附目标图形上"距连线另一端最近"的锚点，
// 而非距鼠标最近 —— 决定箭头驶入方向。
// ═══════════════════════════════════════════
describe('snapLinkerEndpoint', () => {
  it('鼠标在目标图形内：吸附距另一端（上方）最近的锚点 = 顶部锚点（箭头向下驶入）', () => {
    const target = shape(100, 300, 100, 60) // 目标图形 y: 300..360
    const other = shape(100, 100, 100, 60) // 源图形在上方
    const r = snapLinkerEndpoint({
      shapes: [other, target],
      hitShapeId: target.id,
      worldX: 150,
      worldY: 340, // 鼠标在目标下半部（距底部锚点更近）
      scale: 1,
      otherEnd: { id: other.id, x: 150, y: 160 }, // 源的下锚点
    })
    // 必须选顶部锚点（而非距鼠标最近的底部锚点）
    expect(r.endpoint).toMatchObject({ id: target.id, x: 150, y: 300 })
    expect(r.endpoint.angle).toBeCloseTo(Math.PI / 2, 10) // 内向朝下 → 箭头向下
    expect(r.snapAnchor).toEqual({ x: 150, y: 300 })
  })

  it('鼠标 7px 内命中具体锚点时直接选中该锚点（精确指定连接点）', () => {
    const target = shape(100, 300, 100, 60)
    const other = shape(100, 100, 100, 60)
    const r = snapLinkerEndpoint({
      shapes: [other, target],
      hitShapeId: target.id,
      worldX: 150,
      worldY: 357, // 距底部锚点 (150,360) 仅 3px
      scale: 1,
      otherEnd: { id: other.id, x: 150, y: 160 },
    })
    expect(r.endpoint).toMatchObject({ id: target.id, x: 150, y: 360 })
    expect(r.endpoint.angle).toBeCloseTo((Math.PI / 2) * 3, 10) // 底部锚点内向朝上
  })

  it('悬停图形 == 另一端所属图形：脱附为自由点', () => {
    const el = shape(100, 100, 100, 60)
    const r = snapLinkerEndpoint({
      shapes: [el],
      hitShapeId: el.id,
      worldX: 130,
      worldY: 120,
      scale: 1,
      otherEnd: { id: el.id, x: 150, y: 100 },
    })
    expect(r.endpoint).toEqual({ id: null, x: 130, y: 120, angle: null })
    expect(r.snapAnchor).toBeNull()
  })

  it('锁定图形不参与吸附（与 findSnapAnchor 语义一致）', () => {
    const target = shape(100, 300, 100, 60)
    target.locked = true
    const other = shape(100, 100, 100, 60)
    const r = snapLinkerEndpoint({
      shapes: [other, target],
      hitShapeId: target.id, // 鼠标悬停在锁定图形上
      worldX: 150,
      worldY: 330,
      scale: 1,
      otherEnd: { id: other.id, x: 150, y: 160 },
    })
    // 按自由点处理，不吸附锁定图形
    expect(r.endpoint.id).toBeNull()
    expect(r.snapAnchor).toBeNull()
  })

  it('linkable === false 的图形不参与端点吸附', () => {
    const target = shape(100, 300, 100, 60)
    target.attribute.linkable = false
    const other = shape(100, 100, 100, 60)
    const r = snapLinkerEndpoint({
      shapes: [other, target],
      hitShapeId: target.id, // 鼠标悬停在 linkable:false 图形上
      worldX: 150,
      worldY: 330,
      scale: 1,
      otherEnd: { id: other.id, x: 150, y: 160 },
    })
    // 按自由点处理，不吸附 linkable:false 图形
    expect(r.endpoint.id).toBeNull()
    expect(r.snapAnchor).toBeNull()
  })

  it('空白处：自由点 ±6px 与另一端对齐（拉直）', () => {
    const r = snapLinkerEndpoint({
      shapes: [],
      hitShapeId: null,
      worldX: 100,
      worldY: 104, // |104-100| < 6 → y 对齐另一端
      scale: 1,
      otherEnd: { id: null, x: 200, y: 100 },
    })
    expect(r.endpoint).toEqual({ id: null, x: 100, y: 100, angle: null })
  })

  it('空白处自由端靠近图形边时吸附边（2px）', () => {
    const el = shape(100, 200, 100, 60)
    const r = snapLinkerEndpoint({
      shapes: [el],
      hitShapeId: null,
      worldX: 150,
      worldY: 201, // 距顶边 1px
      scale: 1,
      otherEnd: { id: null, x: 400, y: 500 },
    })
    expect(r.endpoint).toEqual({ id: null, x: 150, y: 200, angle: null })
  })
})
