// junction（连线端点附着到另一条连线）纯函数层
//   - nearestPointOnLinker：光标点到宿主连线渲染路径的最近点（t 与 cursorPointAt 口径一致）
//   - findJunctionSnap：候选宿主中选吸附目标（容差/排除自身/排除锁定/防环）
//   - wouldCreateJunctionCycle：沿宿主 junction 链 DFS 判环
//   - resolveJunctionLinkers：宿主几何变更后拓扑序重求附着端点坐标并重路由
// t 口径裁决：junction.t 一律采用 cursorPointAt 的参数语义（line=lerp /
// broken=全路径累计长度比例 / curve=贝塞尔参数），解析时零换算。
import type { DocumentData, LinkerInstance } from '@/types'
import { isLinker } from '@/types'
import { getLinkerPoints, type LinkerEndpoint, type Point, type ShapeRect } from './linker'
import { stretchManualPoints } from './manualRoute'
import { cursorPointAt, type CursorLinker } from './linkerCursor'

/** junction 吸附容差（屏幕像素，按视口缩放换算为世界坐标） */
export const JUNCTION_SNAP_PX = 10

/** 点到线段投影结果 */
export interface SegmentProjection {
  /** 最近点坐标（段内参数钳制到 [0,1] 后的插值点） */
  x: number
  y: number
  /** 段内投影参数 ∈ [0,1] */
  t: number
  dist: number
}

/** 点到线段最近点（供 distToSegment / junction 求解共用） */
export function projectToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): SegmentProjection {
  const dx = bx - ax
  const dy = by - ay
  const len2 = dx * dx + dy * dy
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2))
  const x = ax + t * dx
  const y = ay + t * dy
  return { x, y, t, dist: Math.hypot(px - x, py - y) }
}

/** 点到连线渲染路径的最近点（t 为 cursorPointAt 参数语义） */
export interface LinkerNearPoint {
  x: number
  y: number
  t: number
  dist: number
}

/** broken 折线段遍历（与 hitLinkerSegment 同口径）：[from, ...points, to] */
function pathPoints(l: CursorLinker): Point[] {
  return [l.from as Point, ...l.points, l.to as Point]
}

function segLen(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

export function nearestPointOnLinker(l: LinkerInstance, wx: number, wy: number): LinkerNearPoint {
  if (l.linkerType === 'curve' && l.points.length >= 2) {
    return nearestOnCurve(l, wx, wy)
  }
  if (l.linkerType === 'broken' && l.points.length > 0) {
    const pts = pathPoints(l)
    const total = cursorLength(l)
    if (total <= 0) return { x: l.from.x, y: l.from.y, t: 0, dist: Math.hypot(wx - l.from.x, wy - l.from.y) }
    let acc = 0
    let best: LinkerNearPoint | null = null
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1]!
      const b = pts[i]!
      const p = projectToSegment(wx, wy, a.x, a.y, b.x, b.y)
      if (!best || p.dist < best.dist) {
        const t = (acc + p.t * segLen(a, b)) / total
        best = { x: p.x, y: p.y, t, dist: p.dist }
      }
      acc += segLen(a, b)
    }
    return best!
  }
  // line：from→to 单段，t 即 lerp 参数（与 cursorPointAt 的 line 分支同口径）
  const p = projectToSegment(wx, wy, l.from.x, l.from.y, l.to.x, l.to.y)
  return { x: p.x, y: p.y, t: p.t, dist: p.dist }
}

function cursorLength(l: CursorLinker): number {
  const pts = pathPoints(l)
  let len = 0
  for (let i = 1; i < pts.length; i++) len += segLen(pts[i - 1]!, pts[i]!)
  return len
}

/**
 * curve 最近点：对 cursorPointAt 均匀采样取最近样本，再在相邻样本区间内
 * 三分细化（贝塞尔参数 t 非单调映射弧长，三分足够收敛到渲染路径）
 */
function nearestOnCurve(l: LinkerInstance, wx: number, wy: number): LinkerNearPoint {
  const SAMPLES = 96
  let bestT = 0
  let bestDist = Infinity
  for (let i = 0; i <= SAMPLES; i++) {
    const p = cursorPointAt(l, i / SAMPLES)
    const d = Math.hypot(wx - p.x, wy - p.y)
    if (d < bestDist) {
      bestDist = d
      bestT = i / SAMPLES
    }
  }
  let lo = Math.max(0, bestT - 1 / SAMPLES)
  let hi = Math.min(1, bestT + 1 / SAMPLES)
  for (let i = 0; i < 24; i++) {
    const m1 = lo + (hi - lo) / 3
    const m2 = hi - (hi - lo) / 3
    const p1 = cursorPointAt(l, m1)
    const p2 = cursorPointAt(l, m2)
    const d1 = Math.hypot(wx - p1.x, wy - p1.y)
    const d2 = Math.hypot(wx - p2.x, wy - p2.y)
    if (d1 <= d2) hi = m2
    else lo = m1
  }
  const t = (lo + hi) / 2
  const p = cursorPointAt(l, t)
  return { x: p.x, y: p.y, t, dist: Math.hypot(wx - p.x, wy - p.y) }
}

/** junction 吸附命中 */
export interface JunctionSnap {
  linkerId: string
  t: number
  /** 投影点世界坐标（预览/端点落点） */
  x: number
  y: number
  dist: number
}

export interface JunctionSnapOptions {
  /** 被拖连线自身 id（排除自吸；自由连线草稿传 null） */
  selfId?: string | null
  /** 文档元素表（防环判定用；不传则不做防环过滤） */
  elements?: DocumentData['elements']
  /** 另一端已附着的宿主 id（同宿主双端不允许，镜像"两端不连同一图形"） */
  otherJunctionHostId?: string | null
}

/** 在候选连线中找 10px/scale 内最近的吸附目标 */
export function findJunctionSnap(
  linkers: LinkerInstance[],
  wx: number,
  wy: number,
  scale: number,
  opts?: JunctionSnapOptions,
): JunctionSnap | null {
  const tol = JUNCTION_SNAP_PX / scale
  const selfId = opts?.selfId ?? null
  const otherHost = opts?.otherJunctionHostId ?? null
  const elements = opts?.elements
  let best: JunctionSnap | null = null
  for (const l of linkers) {
    if (l.locked || l.id === selfId || l.id === otherHost) continue
    if (elements && selfId != null && wouldCreateJunctionCycle(elements, selfId, l.id)) continue
    const p = nearestPointOnLinker(l, wx, wy)
    if (p.dist <= tol && (!best || p.dist < best.dist)) {
      best = { linkerId: l.id, t: p.t, x: p.x, y: p.y, dist: p.dist }
    }
  }
  return best
}

/**
 * 判定 selfId 附着到 hostId 是否构成循环附着：
 * 沿 host 两端 junction 链向上游走，经过 selfId 即成环（host 自身 === selfId 也算）
 */
export function wouldCreateJunctionCycle(
  elements: DocumentData['elements'],
  selfId: string,
  hostId: string,
): boolean {
  if (selfId === hostId) return true
  const visited = new Set<string>([hostId])
  const stack = [hostId]
  while (stack.length > 0) {
    const cur = elements[stack.pop()!]
    if (!cur || !isLinker(cur)) continue
    for (const ep of [cur.from, cur.to]) {
      const next = ep.junction?.linkerId
      if (next == null) continue
      if (next === selfId) return true
      if (!visited.has(next)) {
        visited.add(next)
        stack.push(next)
      }
    }
  }
  return false
}

/**
 * 单端点解析：带 junction 且宿主存在 → cursorPointAt 坐标；否则 null（调用方脱附）
 */
export function resolveJunctionPoint(
  elements: DocumentData['elements'],
  ep: LinkerEndpoint,
): Point | null {
  if (!ep.junction) return null
  const host = elements[ep.junction.linkerId]
  if (!host || !isLinker(host)) return null
  return cursorPointAt(host, ep.junction.t)
}

/** 判定端点是否带 junction（含防御：附着图形锚点的端点不视为 junction） */
function hasJunction(ep: LinkerEndpoint): boolean {
  return ep.id == null && ep.junction != null
}

/**
 * 宿主几何变更后，对所有带 junction 端点的连线重求坐标并重路由。
 *
 * @param elements 合并最新变动后的元素表（宿主取最新几何）
 * @param getRect  图形包围盒取值器（重路由用）
 * @returns 发生变化的连线 id → 新实例；无变化/无 junction 连线不出现在结果中。
 *          宿主缺失 → 脱附（清 junction 保坐标）；意外环（脏数据）→ 脱附防御。
 */
export function resolveJunctionLinkers(
  elements: DocumentData['elements'],
  getRect: (id: string) => ShapeRect | null,
): Map<string, LinkerInstance> {
  const out = new Map<string, LinkerInstance>()
  const work: DocumentData['elements'] = { ...elements }

  // junction 依赖子图：L 依赖宿主 H（L 的端点附着在 H 上）→ L 必须在 H 之后解析
  const nodes: LinkerInstance[] = Object.values(work).filter(
    (el): el is LinkerInstance => isLinker(el) && (hasJunction(el.from) || hasJunction(el.to)),
  )
  const nodeIds = new Set(nodes.map((n) => n.id))
  const depsOf = new Map<string, string[]>()
  const dependentsOf = new Map<string, string[]>()
  const inDegree = new Map<string, number>()
  for (const n of nodes) {
    const deps = [n.from.junction?.linkerId, n.to.junction?.linkerId].filter(
      (h): h is string => h != null && nodeIds.has(h),
    )
    depsOf.set(n.id, deps)
    inDegree.set(n.id, deps.length)
    for (const d of deps) {
      dependentsOf.set(d, [...(dependentsOf.get(d) ?? []), n.id])
    }
  }

  // Kahn 拓扑序；剩余节点成环（脏数据）→ 最后统一脱附
  const queue = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0).map((n) => n.id)
  const processed = new Set<string>()
  while (queue.length > 0) {
    const id = queue.shift()!
    processed.add(id)
    const resolved = resolveOne(work, id, getRect)
    if (resolved) {
      work[id] = resolved
      out.set(id, resolved)
    }
    for (const dep of dependentsOf.get(id) ?? []) {
      const next = (inDegree.get(dep) ?? 0) - 1
      inDegree.set(dep, next)
      if (next === 0) queue.push(dep)
    }
  }

  // 成环残留（A↔B 等脏数据）：脱附，不死循环
  for (const n of nodes) {
    if (processed.has(n.id)) continue
    const detached = detachAll(n)
    work[n.id] = detached
    out.set(n.id, detached)
  }
  return out
}

/** 解析单条连线的 junction 端点；无变化返回 null */
function resolveOne(
  elements: DocumentData['elements'],
  id: string,
  getRect: (id: string) => ShapeRect | null,
): LinkerInstance | null {
  const l = elements[id] as LinkerInstance
  if (!l) return null
  let changed = false
  const resolveEp = (ep: LinkerInstance['from']): LinkerInstance['from'] => {
    if (!hasJunction(ep)) return ep
    const p = resolveJunctionPoint(elements, ep)
    if (!p) {
      // 宿主缺失 → 脱附为自由点（坐标保留）
      changed = true
      return { id: null, x: ep.x, y: ep.y, angle: ep.angle ?? 0 }
    }
    if (p.x === ep.x && p.y === ep.y) return ep
    changed = true
    return { ...ep, x: p.x, y: p.y }
  }
  const from = resolveEp(l.from)
  const to = resolveEp(l.to)
  if (!changed) return null
  const next: LinkerInstance = { ...l, from, to }
  // 与 routeAttachedLinkers 同策略：手动路由仅拉伸端段，否则全量重算
  return {
    ...next,
    points: l.manualRoute ? stretchManualPoints(l, from, to) : getLinkerPoints(next, getRect),
  }
}

/** 清除两端 junction（意外环防御） */
function detachAll(l: LinkerInstance): LinkerInstance {
  const strip = (ep: LinkerInstance['from']): LinkerInstance['from'] =>
    hasJunction(ep) ? { id: null, x: ep.x, y: ep.y, angle: ep.angle ?? 0 } : ep
  return { ...l, from: strip(l.from), to: strip(l.to) }
}
