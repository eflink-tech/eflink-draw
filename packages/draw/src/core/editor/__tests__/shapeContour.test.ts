// 轮廓几何测试：最近轮廓点、内向法线角、旋转、包围盒判定
import { describe, it, expect } from 'vitest'
import { nearestContourPoint, pointInRotatedBBox } from '../shapeContour'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import type { ElementInstance } from '@/types'

function shape(name: string, x: number, y: number, w = 100, h = 60): ElementInstance {
  const el = shapeRegistry.createElement(name, x, y)
  if (!el) throw new Error(`${name} schema missing`)
  el.props.w = w
  el.props.h = h
  return el
}

describe('nearestContourPoint - 矩形', () => {
  it('顶边任意点：投影到顶边，内向角朝下', () => {
    const el = shape('rectangle', 100, 100, 100, 60)
    const c = nearestContourPoint(el, 130, 95)! // 顶边上方 5px（非锚点 x=130）
    expect(c).not.toBeNull()
    expect(c.x).toBe(130)
    expect(c.y).toBe(100)
    expect(c.dist).toBeCloseTo(5, 6)
    expect(c.angle).toBeCloseTo(Math.PI / 2, 6) // 顶边内向朝下
  })

  it('角点：投影钳制到线段端点', () => {
    const el = shape('rectangle', 100, 100, 100, 60)
    const c = nearestContourPoint(el, 95, 95)! // 左上角外 5,5
    expect(c.x).toBe(100)
    expect(c.y).toBe(100)
    expect(c.dist).toBeCloseTo(Math.SQRT2 * 5, 6)
  })

  it('底边下方：内向角朝上（3π/2）', () => {
    const el = shape('rectangle', 100, 100, 100, 60)
    const c = nearestContourPoint(el, 140, 170)! // 底边 (y=160) 下方 10px
    expect(c.x).toBe(140)
    expect(c.y).toBe(160)
    expect(c.angle).toBeCloseTo((Math.PI / 2) * 3, 6)
  })
})

describe('nearestContourPoint - 曲线与斜边', () => {
  it('椭圆：顶点落在圆周上（bezier 细分精度）', () => {
    const el = shape('round', 100, 100, 100, 60) // 椭圆 100..200 × 100..160
    const c = nearestContourPoint(el, 150, 80)! // 顶点正上方 20px
    expect(c.x).toBeCloseTo(150, 1)
    expect(c.y).toBeCloseTo(100, 1)
    expect(c.dist).toBeCloseTo(20, 1)
  })

  it('菱形斜边：投影落在斜线上且法线指向中心', () => {
    const el = shape('diamond', 0, 0, 100, 100)
    // 边 (50,0)→(100,50)；查询点 (85,45) 的投影 = (90,40)，法线角 3π/4
    const c = nearestContourPoint(el, 85, 45)!
    expect(c.x).toBeCloseTo(90, 6)
    expect(c.y).toBeCloseTo(40, 6)
    expect(c.angle).toBeCloseTo((Math.PI / 4) * 3, 6)
  })
})

describe('nearestContourPoint - 旋转', () => {
  it('旋转 30° 后最近点随轮廓旋转', () => {
    const el = shape('rectangle', 100, 100, 100, 60)
    el.props.angle = Math.PI / 6
    const cx = 150, cy = 130
    const dx = 50 - 50, dy = 0 - 30 // 局部顶边中点 (50,0) 相对中心 (50,30) 的偏移 = (0,-30)
    const cos = Math.cos(Math.PI / 6), sin = Math.sin(Math.PI / 6)
    const topMid = { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos }
    // 查询点沿"旋转后的顶边外法线"外移 10px（局部 (0,-1) 旋转 angle = (sin,-cos)）。
    // 偏移方向垂直于边 → 最近点应恰为 topMid、距离恰为 10。
    // 注意不能用世界竖直方向偏移：其与法线夹角为 angle，投影点会沿边滑动 10·sin(angle)。
    const q = { x: topMid.x + 10 * sin, y: topMid.y - 10 * cos }
    const c = nearestContourPoint(el, q.x, q.y)!
    expect(c.x).toBeCloseTo(topMid.x, 1)
    expect(c.y).toBeCloseTo(topMid.y, 1)
    expect(c.dist).toBeCloseTo(10, 1)
  })
})

describe('nearestContourPoint - 边界', () => {
  it('空 path 图形返回 null', () => {
    const el = shape('rectangle', 0, 0)
    el.path = []
    expect(nearestContourPoint(el, 50, 30)).toBeNull()
  })
})

describe('nearestContourPoint - 二次曲线与闭合段', () => {
  it('圆角矩形：二次曲线圆角上最近点（quadraticCurve 细分精度）', () => {
    const el = shape('roundRectangle', 100, 100, 100, 60) // 圆角半径 4
    // 左上圆角：quadraticCurve (0,4)→控制(0,0)→(4,0)，曲线中点在局部 (1,1)
    const c = nearestContourPoint(el, 95, 95)! // 左上角 (100,100) 外 5,5
    expect(c.x).toBeCloseTo(101, 1)
    expect(c.y).toBeCloseTo(101, 1)
    expect(c.dist).toBeCloseTo(Math.SQRT2 * 6, 1)
  })

  it('closePath 闭合段：矩形左边由 close 段补出，投影落在 x=100', () => {
    const el = shape('rectangle', 100, 100, 100, 60)
    // path 仅 move/line 到 (0,h)，左边 (0,60)→(0,0) 完全依赖 close 补段
    const c = nearestContourPoint(el, 85, 130)! // 左侧外 15px
    expect(c.x).toBe(100)
    expect(c.y).toBe(130)
    expect(c.dist).toBeCloseTo(15, 6)
  })
})

describe('nearestContourPoint - 缓存失效', () => {
  it('同一对象原地改 props.x 后按新位置重算（几何 key 双保险）', () => {
    const el = shape('rectangle', 100, 100, 100, 60)
    const first = nearestContourPoint(el, 130, 95)! // 先建立旧缓存
    expect(first.x).toBe(130) // 旧顶边 100..200 上的投影
    el.props.x += 50 // 原地改位置：store 正常流程外的异常调用方
    const second = nearestContourPoint(el, 130, 95)!
    // 新顶边 150..250：查询点已越出左侧，钳制到左上角 (150,100)
    expect(second.x).toBe(150)
    expect(second.y).toBe(100)
    expect(second.dist).toBeCloseTo(Math.hypot(20, 5), 6)
  })
})

describe('pointInRotatedBBox', () => {
  it('未旋转：含 pad 判定', () => {
    const el = shape('rectangle', 100, 100, 100, 60)
    expect(pointInRotatedBBox(el, 105, 120, 0)).toBe(true)
    expect(pointInRotatedBBox(el, 95, 120, 0)).toBe(false)
    expect(pointInRotatedBBox(el, 95, 120, 10)).toBe(true) // pad 扩展
  })

  it('旋转后用外接矩形', () => {
    const el = shape('rectangle', 100, 100, 100, 60)
    el.props.angle = Math.PI / 4
    // 旋转 45° 后外接框宽高 = (100+60)/√2 ≈ 113.14，中心不变 (150,130)
    expect(pointInRotatedBBox(el, 150, 130 - 55, 2)).toBe(true)
    expect(pointInRotatedBBox(el, 150, 130 - 60, 2)).toBe(false)
  })
})
