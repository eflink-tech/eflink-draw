// 手动路由连线（manualRoute）的端段拉伸与重置
// 图形移动/缩放时经 routeAttachedLinkers 进入本模块：
//   - 沿端段轴的位移由段长变化吸收（"仅修改最近连线的长度"）
//   - 垂直于端段轴的位移由端段整体平移吸收（相邻正交段长度变化，全程正交）
import type { DocumentData, LinkerInstance } from '@/types'
import { isLinker } from '@/types'
import { getLinkerPoints, STUB_R, type LinkerEndpoint, type Point, type ShapeRect } from './linker'

/** 轴对齐判定阈值（与 linkerSegment 一致） */
const AXIS_TOLERANCE = 0.5

function moved(a: LinkerEndpoint, b: LinkerEndpoint): boolean {
  return Math.abs(a.x - b.x) >= AXIS_TOLERANCE || Math.abs(a.y - b.y) >= AXIS_TOLERANCE
}

/** stub 点：沿锚点接近方向、距端点 STUB_R 处（与路由/拖拽共用公式；|cos/sin|<1e-9 吸附浮点噪声） */
function stubOf(ep: LinkerEndpoint): Point {
  const c = Math.cos(ep.angle ?? 0)
  const s = Math.sin(ep.angle ?? 0)
  return {
    x: ep.x - STUB_R * (Math.abs(c) < 1e-9 ? 0 : c),
    y: ep.y - STUB_R * (Math.abs(s) < 1e-9 ? 0 : s),
  }
}

/**
 * 手动路由连线在图形移动后的端段拉伸。
 * oldL 提供旧端点与旧折点；nextFrom/nextTo 为 followEndpoint 后的新端点。
 */
export function stretchManualPoints(
  oldL: Pick<LinkerInstance, 'from' | 'to' | 'points'>,
  nextFrom: LinkerEndpoint,
  nextTo: LinkerEndpoint,
): Point[] {
  const fromMoved = moved(nextFrom, oldL.from)
  const toMoved = moved(nextTo, oldL.to)
  if (!fromMoved && !toMoved) return oldL.points
  if (oldL.points.length === 0) return stretchStraight(nextFrom, nextTo)
  // 唯一折点且两端都移动：基于原始折点分别归轴（L 形 → Z 形），避免同一下标互相覆盖
  if (oldL.points.length === 1 && fromMoved && toMoved) {
    const s = oldL.points[0]!
    return simplifyOrthogonalPoints(
      nextFrom,
      [bendOf(s, oldL.from, nextFrom), bendOf(s, oldL.to, nextTo)],
      nextTo,
    )
  }
  const n = oldL.points.length
  let pts = oldL.points
  if (fromMoved) {
    // 对侧未移动时保护其端段连接：n>1 固定其紧邻折点，n=1 固定其端点（拐角直接接端段）
    pts = stretchBend(pts, oldL.from, nextFrom, true, toMoved ? null : n > 1 ? pts[n - 1]! : oldL.to)
  }
  if (toMoved) {
    pts = stretchBend(pts, oldL.to, nextTo, false, fromMoved ? null : n > 1 ? pts[0]! : oldL.from)
  }
  // 相邻共点 + 轴对齐共线折点合并（U 形折叠/stub 残留会产生同线多段双拖拽点）
  return simplifyOrthogonalPoints(nextFrom, pts, nextTo)
}

/** 单点归轴：按端段主轴（相对旧端点）平移到新端点轴线上 */
function bendOf(s: Point, oldEp: LinkerEndpoint, newEp: LinkerEndpoint): Point {
  const horizontal = Math.abs(s.y - oldEp.y) <= Math.abs(s.x - oldEp.x)
  return horizontal ? { x: s.x, y: newEp.y } : { x: newEp.x, y: s.y }
}

/** 端段折点回轴：紧邻端点的共线游程（与端点同轴的连续折点）整体平移到新端点轴线上，保持全程正交 */
// fixed 非空时保护对侧连接：游程不吞并保护锚；紧邻游程时插正交拐角重接
function stretchBend(
  pts: Point[],
  oldEp: LinkerEndpoint,
  newEp: LinkerEndpoint,
  isFrom: boolean,
  fixed: Point | null,
): Point[] {
  const i = isFrom ? 0 : pts.length - 1
  const s = pts[i]!
  const horizontal = Math.abs(s.y - oldEp.y) <= Math.abs(s.x - oldEp.x)
  // 游程范围：从紧邻端点的折点向内，连续与旧端点同轴的折点一并平移
  const coord = (p: Point): number => (horizontal ? p.y : p.x)
  const anchor = coord(oldEp)
  let lo = i
  let hi = i
  if (isFrom) {
    // 保护锚是末折点时游程不吞并它（n=1 时锚为对侧端点、不在 pts 中）
    const limit = fixed && pts.length > 1 ? pts.length - 2 : pts.length - 1
    while (hi + 1 <= limit && Math.abs(coord(pts[hi + 1]!) - anchor) < AXIS_TOLERANCE) hi++
  } else {
    const limit = fixed && pts.length > 1 ? 1 : 0
    while (lo - 1 >= limit && Math.abs(coord(pts[lo - 1]!) - anchor) < AXIS_TOLERANCE) lo--
  }
  const shifted = pts.map((p, k) =>
    k < lo || k > hi ? p : horizontal ? { x: p.x, y: newEp.y } : { x: newEp.x, y: p.y },
  )
  if (!fixed) return shifted
  // 保护锚紧邻游程（或 n=1 游程紧邻对侧端点）时插正交拐角；隔有其他折点时原正交性由平移保持
  const adjacent = isFrom ? hi >= pts.length - 2 : lo <= 1
  if (!adjacent) return shifted
  const corner = horizontal ? { x: fixed.x, y: newEp.y } : { x: newEp.x, y: fixed.y }
  return isFrom
    ? [...shifted.slice(0, hi + 1), corner, ...shifted.slice(hi + 1)]
    : [...shifted.slice(0, lo), corner, ...shifted.slice(lo)]
}

/** 直线直连（points 为空）：仍共线则保持直线（长度吸收）；否则插 Z 形（两端 stub + 拐角） */
function stretchStraight(nextFrom: LinkerEndpoint, nextTo: LinkerEndpoint): Point[] {
  const collinearH = Math.abs(nextFrom.y - nextTo.y) < AXIS_TOLERANCE
  const collinearV = Math.abs(nextFrom.x - nextTo.x) < AXIS_TOLERANCE
  if (collinearH || collinearV) return []
  const sf = stubOf(nextFrom)
  const st = stubOf(nextTo)
  return simplifyOrthogonalPoints(nextFrom, [sf, { x: sf.x, y: st.y }, st], nextTo)
}

function dedupeAdjacent(pts: Point[]): Point[] {
  const out: Point[] = []
  for (const p of pts) {
    const last = out[out.length - 1]
    if (last && Math.abs(last.x - p.x) < AXIS_TOLERANCE && Math.abs(last.y - p.y) < AXIS_TOLERANCE) continue
    out.push(p)
  }
  return out
}

/** 三点是否轴对齐共线（同 x 或同 y；斜段不简化） */
function isAxisCollinear(a: Point, b: Point, c: Point): boolean {
  const sameY =
    Math.abs(a.y - b.y) < AXIS_TOLERANCE && Math.abs(b.y - c.y) < AXIS_TOLERANCE
  const sameX =
    Math.abs(a.x - b.x) < AXIS_TOLERANCE && Math.abs(b.x - c.x) < AXIS_TOLERANCE
  return sameY || sameX
}

/**
 * 正交折线共线简化：去掉落在相邻两端点轴对齐连线上的中间折点
 *（含同向共线与回折重叠），并合并相邻共点。返回不含 from/to 的折点数组。
 */
export function simplifyOrthogonalPoints(from: Point, points: Point[], to: Point): Point[] {
  const pts = dedupeAdjacent([from, ...points, to])
  if (pts.length <= 2) return []
  // 单遍按“已保留末点”判定即可连锁去掉整段共线中间点
  const kept: Point[] = [pts[0]!]
  for (let i = 1; i < pts.length - 1; i++) {
    const b = pts[i]!
    const c = pts[i + 1]!
    if (isAxisCollinear(kept[kept.length - 1]!, b, c)) continue
    kept.push(b)
  }
  kept.push(pts[pts.length - 1]!)
  return dedupeAdjacent(kept).slice(1, -1)
}

/** 重置手动路由：清除标记并按当前文档图形位置重新自动路由（非手动连线原样返回） */
export function resetManualRoute(doc: DocumentData, id: string): DocumentData {
  const el = doc.elements[id]
  if (!el || !isLinker(el) || el.manualRoute !== true) return doc
  const getRect = (sid: string): ShapeRect | null => {
    const s = doc.elements[sid]
    if (!s || isLinker(s)) return null
    return { x: s.props.x, y: s.props.y, w: s.props.w, h: s.props.h }
  }
  const points = getLinkerPoints(el, getRect)
  return { ...doc, elements: { ...doc.elements, [id]: { ...el, manualRoute: false, points } } }
}
