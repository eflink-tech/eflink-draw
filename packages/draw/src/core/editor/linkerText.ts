//
// 连线文字定位：相对参数 ↔ 世界坐标互解。
// 相对参数（LinkerTextOffset = 沿线弧长 t + 法向偏移 normal）使文字在图形移动、
// 路由重算后自动跟随线身，无需任何联动更新；拖拽结束时反解落库即可。
//
import type { LinkerInstance, LinkerTextOffset } from '@/types'
import type { Point } from '@/core/utils/geometry'
import { getLinkerMidpoint, linkerSegmentMidpoint } from './linkerDraw'

/** 曲线采样密度（bezier → 折线的每段直线数） */
const CURVE_SAMPLES = 24

type LinkerLike = Pick<LinkerInstance, 'linkerType' | 'from' | 'to' | 'points'>

const dist = (a: Point, b: Point): number => Math.hypot(b.x - a.x, b.y - a.y)
const clamp01 = (v: number): number => Math.min(1, Math.max(0, v))

/** 线身折线点列：curve 采样 bezier；line/broken 直连 [from, ...points, to] */
export function linkerPathPoints(l: LinkerLike): Point[] {
  if (l.linkerType === 'curve' && l.points.length >= 2) {
    const p0 = l.from
    const p1 = l.points[0]
    const p2 = l.points[1]
    const p3 = l.to
    const out: Point[] = []
    for (let i = 0; i <= CURVE_SAMPLES; i++) {
      const t = i / CURVE_SAMPLES
      const mt = 1 - t
      out.push({
        x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
        y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
      })
    }
    return out
  }
  // from/to 带 id/angle 等额外字段，剥离为纯 {x,y}（几何计算与深比较口径统一）
  return [{ x: l.from.x, y: l.from.y }, ...l.points, { x: l.to.x, y: l.to.y }]
}

export interface PathPoint {
  x: number
  y: number
  /** 切向单位向量 */
  dx: number
  dy: number
}

/** 弧长参数定位：t ∈ [0,1]（0 起点 → 1 终点），返回坐标与切向 */
export function pointOnPathAt(pts: Point[], t: number): PathPoint {
  let total = 0
  for (let i = 1; i < pts.length; i++) total += dist(pts[i - 1], pts[i])
  if (total <= 0) return { x: pts[0]?.x ?? 0, y: pts[0]?.y ?? 0, dx: 1, dy: 0 }
  const target = clamp01(t) * total
  let walked = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const segLen = dist(a, b)
    if (walked + segLen >= target || i === pts.length - 1) {
      const k = segLen > 0 ? (target - walked) / segLen : 0
      return {
        x: a.x + (b.x - a.x) * k,
        y: a.y + (b.y - a.y) * k,
        dx: segLen > 0 ? (b.x - a.x) / segLen : 1,
        dy: segLen > 0 ? (b.y - a.y) / segLen : 0,
      }
    }
    walked += segLen
  }
  // 不可达（total>0 时循环内必返回）；防御性返回终点
  const last = pts[pts.length - 1]
  return { x: last.x, y: last.y, dx: 1, dy: 0 }
}

/** 世界坐标 → 相对参数：最近点弧长参数 t + 带符号法向距离（切向 (dx,dy) 的 (dy,-dx) 方向为正） */
export function locateOnPath(pts: Point[], x: number, y: number): LinkerTextOffset {
  let total = 0
  for (let i = 1; i < pts.length; i++) total += dist(pts[i - 1], pts[i])
  if (total <= 0 || pts.length < 2) return { t: 0, normal: 0 }

  let bestT = 0
  let bestD = Infinity
  let bestPx = pts[0].x
  let bestPy = pts[0].y
  let bestDx = 1
  let bestDy = 0
  let walked = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const segLen = dist(a, b)
    if (segLen > 0) {
      const ux = b.x - a.x
      const uy = b.y - a.y
      const k = clamp01(((x - a.x) * ux + (y - a.y) * uy) / (segLen * segLen))
      const px = a.x + ux * k
      const py = a.y + uy * k
      const d = Math.hypot(x - px, y - py)
      if (d < bestD) {
        bestD = d
        bestT = (walked + segLen * k) / total
        bestPx = px
        bestPy = py
        bestDx = ux / segLen
        bestDy = uy / segLen
      }
    }
    walked += segLen
  }
  // 法向 (dy, -dx)：dot(p - on, (dy, -dx)) = (x-px)*dy - (y-py)*dx
  const normal = (x - bestPx) * bestDy - (y - bestPy) * bestDx
  return { t: bestT, normal }
}

/** 按相对参数还原世界坐标（pointOnPathAt + 法向平移） */
function applyOffset(pts: Point[], off: LinkerTextOffset): Point {
  const p = pointOnPathAt(pts, off.t)
  return { x: p.x + p.dy * off.normal, y: p.y - p.dx * off.normal }
}

/**
 * 文字锚点解析（渲染 / 编辑框 / live 拖线共用）：
 * - 分段文字（seg != null）：该段 offset → 段中点
 * - 整线文字：textOffset（拖拽后）→ textPos（旧字段兼容）→ 线中点
 */
export function linkerTextAnchor(l: LinkerInstance, seg?: number): Point {
  if (seg != null) {
    const off = (l.segTexts ?? []).find((s) => s.seg === seg)?.offset
    if (off) return applyOffset(linkerPathPoints(l), off)
    return linkerSegmentMidpoint(l, seg)
  }
  if (l.textOffset) return applyOffset(linkerPathPoints(l), l.textOffset)
  return l.textPos ?? getLinkerMidpoint(l)
}
