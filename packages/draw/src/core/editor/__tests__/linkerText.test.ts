// 连线文字定位：相对参数（t 沿弧长 + normal 法向偏移）↔ 世界坐标互解。
// 相对参数使文字在图形移动 / 路由重算后自动跟随，无需任何联动更新。
import { describe, it, expect } from 'vitest'
import { createLinkerInstance } from '../linker'
import { getLinkerMidpoint, linkerSegmentMidpoint } from '../linkerDraw'
import {
  linkerPathPoints,
  linkerTextAnchor,
  locateOnPath,
  pointOnPathAt,
} from '../linkerText'
import type { LinkerInstance } from '@/types'

const endpoint = (x: number, y: number) => ({ id: null, x, y, angle: 0 })

/** L 形折线：(0,0) → (100,0) → (100,100)，总长 200 */
function lShape(): LinkerInstance {
  const l = createLinkerInstance(endpoint(0, 0), endpoint(100, 100), 1)
  l.linkerType = 'broken'
  l.points = [{ x: 100, y: 0 }]
  return l
}

/** 水平直线：(0,0) → (100,0) */
function hLine(): LinkerInstance {
  const l = createLinkerInstance(endpoint(0, 0), endpoint(100, 0), 1)
  l.linkerType = 'line'
  l.points = []
  return l
}

describe('linkerPathPoints（线身折线点列）', () => {
  it('line：起点直连终点', () => {
    expect(linkerPathPoints(hLine())).toEqual([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    ])
  })

  it('broken：from → points → to 顶点序列', () => {
    expect(linkerPathPoints(lShape())).toEqual([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
    ])
  })

  it('curve：bezier 采样为多段折线（首尾精确）', () => {
    const l = createLinkerInstance(endpoint(0, 0), endpoint(100, 0), 1)
    l.linkerType = 'curve'
    l.points = [
      { x: 33, y: -20 },
      { x: 66, y: 20 },
    ]
    const pts = linkerPathPoints(l)
    expect(pts.length).toBeGreaterThan(10)
    expect(pts[0]).toEqual({ x: 0, y: 0 })
    expect(pts[pts.length - 1]).toEqual({ x: 100, y: 0 })
  })
})

describe('pointOnPathAt（弧长参数定位）', () => {
  it('t=0/1 端点；t=0.5 落在等臂 L 形拐点', () => {
    const pts = linkerPathPoints(lShape())
    expect(pointOnPathAt(pts, 0)).toMatchObject({ x: 0, y: 0 })
    expect(pointOnPathAt(pts, 1)).toMatchObject({ x: 100, y: 100 })
    const mid = pointOnPathAt(pts, 0.5)
    expect(mid).toMatchObject({ x: 100, y: 0 })
  })

  it('切向：水平段 (1,0)，垂直段 (0,1)', () => {
    const pts = linkerPathPoints(lShape())
    expect(pointOnPathAt(pts, 0.25)).toMatchObject({ dx: 1, dy: 0 })
    expect(pointOnPathAt(pts, 0.75)).toMatchObject({ dx: 0, dy: 1 })
  })
})

describe('locateOnPath（世界坐标 → 相对参数）', () => {
  it('线上点：normal≈0，t 按弧长', () => {
    const pts = linkerPathPoints(lShape())
    const off = locateOnPath(pts, 50, 0)
    expect(off.t).toBeCloseTo(0.25)
    expect(off.normal).toBeCloseTo(0)
  })

  it('法向偏移点：normal 带符号（切向 (1,0) → 法向 (0,-1)，线上方为正）', () => {
    const pts = linkerPathPoints(hLine())
    // (50, -10)：线上方 10px → normal = +10（(0,-1) 方向）
    expect(locateOnPath(pts, 50, -10).normal).toBeCloseTo(10)
    expect(locateOnPath(pts, 50, 10).normal).toBeCloseTo(-10)
  })

  it('round-trip：任意点 locate → 按参数还原 = 最近点', () => {
    const pts = linkerPathPoints(lShape())
    const p = { x: 100, y: 40 } // 垂直段上一点
    const off = locateOnPath(pts, p.x, p.y)
    const back = pointOnPathAt(pts, off.t)
    expect(back.x).toBeCloseTo(p.x)
    expect(back.y).toBeCloseTo(p.y)
  })
})

describe('linkerTextAnchor（文字锚点解析）', () => {
  it('无任何位置 → 整线中点（等价 getLinkerMidpoint）', () => {
    const l = lShape()
    expect(linkerTextAnchor(l)).toEqual(getLinkerMidpoint(l))
  })

  it('兼容旧字段 textPos（绝对坐标优先于中点）', () => {
    const l = hLine()
    l.textPos = { x: 42, y: -8 }
    expect(linkerTextAnchor(l)).toEqual({ x: 42, y: -8 })
  })

  it('textOffset 优先于 textPos；沿线 + 法向还原', () => {
    const l = hLine()
    l.textPos = { x: 42, y: -8 }
    l.textOffset = { t: 0.5, normal: 12 }
    // t=0.5 → (50,0)；法向 (0,-1)*12 → (50,-12)
    expect(linkerTextAnchor(l)).toEqual({ x: 50, y: -12 })
  })

  it('分段文字：无 offset → 段中点；有 offset → 沿全线参数还原', () => {
    const l = lShape()
    l.segTexts = [
      { seg: 1, text: '是' },
      { seg: 2, text: '否', offset: { t: 0.75, normal: 0 } },
    ]
    expect(linkerTextAnchor(l, 1)).toEqual(linkerSegmentMidpoint(l, 1))
    expect(linkerTextAnchor(l, 2)).toEqual({ x: 100, y: 50 })
  })

  it('定位往返：locateOnPath 的结果可直接作为 textOffset 还原', () => {
    const l = lShape()
    const target = { x: 40, y: -6 } // 水平段上方
    l.textOffset = locateOnPath(linkerPathPoints(l), target.x, target.y)
    const anchor = linkerTextAnchor(l)
    expect(anchor.x).toBeCloseTo(40)
    expect(anchor.y).toBeCloseTo(-6)
  })
})
