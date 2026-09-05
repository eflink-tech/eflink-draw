// 连线流动光标（选中图形时附着连线上的移动圆点）
//   - 每条附着连线沿路径每 120px 布一个圆点，速度 100px/s（每 30ms 前进 3px）
//   - 相位 t ∈ [0,1) 时可见；到 1（路径终点）隐藏；到 maxT 回绕到 0 重新出现
//   - 圆点直径 = max(5, lineWidth + 2)（屏幕像素，渲染时再除以视口缩放）
import { isLinker, type DocumentData, type LinkerInstance } from '@/types'
import type { Point } from './linker'

/** 圆点间距（世界坐标 px） */
export const CURSOR_SPACING = 120
/** 流动速度（世界坐标 px/s） */
export const CURSOR_SPEED = 100
/** 圆点最小直径（屏幕 px） */
export const CURSOR_MIN_SIZE = 5

export type CursorLinker = Pick<LinkerInstance, 'from' | 'to' | 'points' | 'linkerType'>

function segLen(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

function lerp(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

/** 路径总长（世界坐标；curve 按端点 + 控制点折线估算，仅用于速度归一化） */
export function cursorLength(l: CursorLinker): number {
  if (l.linkerType === 'curve') {
    const c1 = l.points[0] ?? l.from
    const c2 = l.points[1] ?? l.to
    return segLen(l.from, c1) + segLen(c1, c2) + segLen(c2, l.to)
  }
  const pts = [l.from as Point, ...l.points, l.to as Point]
  let len = 0
  for (let i = 1; i < pts.length; i++) len += segLen(pts[i - 1], pts[i])
  return len
}

/**
 * t ∈ [0,1] 处的世界坐标
 * - line：线性插值
 */
export function cursorPointAt(l: CursorLinker, t: number): Point {
  if (l.linkerType === 'curve' && l.points.length >= 2) {
    const [c1, c2] = l.points
    const u = 1 - t
    return {
      x:
        u * u * u * l.from.x +
        3 * u * u * t * c1.x +
        3 * u * t * t * c2.x +
        t * t * t * l.to.x,
      y:
        u * u * u * l.from.y +
        3 * u * u * t * c1.y +
        3 * u * t * t * c2.y +
        t * t * t * l.to.y,
    }
  }
  if (l.linkerType === 'broken' && l.points.length > 0) {
    const pts = [l.from as Point, ...l.points, l.to as Point]
    const total = cursorLength(l)
    if (total <= 0) return { ...l.from }
    let acc = 0
    for (let i = 1; i < pts.length; i++) {
      const seg = segLen(pts[i - 1], pts[i])
      const t1 = (acc + seg) / total
      if (t <= t1) {
        const t0 = acc / total
        const local = t0 === t1 ? 0 : (t - t0) / (t1 - t0)
        return lerp(pts[i - 1], pts[i], local)
      }
      acc += seg
    }
    return { ...l.to }
  }
  return lerp(l.from, l.to, t)
}

export function cursorDotPhases(length: number, spacing = CURSOR_SPACING): number[] {
  const phases: number[] = []
  if (length <= 0) return phases
  for (let r = 0; r < length; r += spacing) phases.push(r / length)
  return phases
}

export function cursorMaxT(length: number, spacing = CURSOR_SPACING): number {
  if (length <= 0) return 1
  return (Math.ceil(length / spacing) * spacing) / length
}

/** 推进相位并按周期回绕（dt 为归一化增量） */
export function advancePhase(t: number, dt: number, maxT: number): number {
  let next = t + dt
  while (next >= maxT) next -= maxT
  return next
}

export function cursorDotSize(lineWidth: number): number {
  return Math.max(CURSOR_MIN_SIZE, lineWidth + 2)
}

/**
 * 选中图形的出向连线（流动方向 = 从选中图形向下游走）
 */
export function outgoingLinkers(
  elements: DocumentData['elements'],
  shapeId: string,
): LinkerInstance[] {
  return Object.values(elements).filter(
    (el): el is LinkerInstance => isLinker(el) && el.from.id === shapeId && el.to.id != null,
  )
}
