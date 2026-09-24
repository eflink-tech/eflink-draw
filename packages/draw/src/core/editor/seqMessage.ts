// UML 时序消息：激活条之间的水平消息与自消息回环
// - 消息两端附着激活条（sequenceActivation）左右缘，seq.y 为消息高度（恒水平）
// - 自消息（from.id === to.id）：侧边拉出 → 外 → 下 → 折回同一条侧边的矩形回环，
//   points 固定 + manualRoute，激活条移动时整体平移
// - 垂直移动任一激活条：seq.y 跟随被移动的条，clamp 到两端条的 y 范围交集（另一端沿条缘滑动）
import { isLinker, type ElementInstance, type LinkerInstance, type SeqMessageData } from '@/types'

/** 激活条缘拖出消息的草稿状态（Canvas 渲染预览、mouseup 提交/取消） */
export interface SeqMessageDraft {
  fromId: string
  dir: 1 | -1 | 0
  /** 消息高度（世界坐标，随源条 clamp） */
  y: number
  cur: { x: number; y: number }
}

export const SEQ_LOOP_W = 36
export const SEQ_LOOP_H = 24
/** 激活条边缘吸附半径（世界 px） */
export const SEQ_EDGE_SNAP = 14

export interface BarRect {
  x: number
  y: number
  w: number
  h: number
}

export function isSeqMessage(l: LinkerInstance): boolean {
  return l.seq != null
}

/** 自消息（回环）：两端挂同一条激活条 */
export function isSeqSelfMessage(l: LinkerInstance): boolean {
  return l.seq != null && l.from.id != null && l.from.id === l.to.id
}

/** 端点 x：1 = 条右缘 / -1 = 左缘 / 0 = 生命线等中轴 */
export function barEdgeX(rect: BarRect, dir: 1 | -1 | 0): number {
  if (dir === 0) return rect.x + rect.w / 2
  return dir === 1 ? rect.x + rect.w : rect.x
}

/** 图形在时序消息中的端点类型 */
export type SeqEndpointKind = 'activation' | 'lifeline' | 'destroy' | 'other'

export function seqEndpointKind(el: ElementInstance | undefined): SeqEndpointKind {
  if (!el) return 'other'
  if (el.name === 'sequenceActivation') return 'activation'
  if (el.name === 'sequenceLifeLine') return 'lifeline'
  if (el.name === 'sequenceDeletion') return 'destroy'
  return 'other'
}

/** 源端 y 范围：激活条取整个条；生命线取虚线区段（头部以下） */
export function seqSourceYRange(el: ElementInstance): [number, number] {
  if (el.name === 'sequenceLifeLine') return [el.props.y + 30, el.props.y + el.props.h]
  return [el.props.y, el.props.y + el.props.h]
}

/**
 * 水平消息两端点：x = 各自条缘，y = seq.y（恒水平）
 * 任一条缺失返回 null
 */
export function seqMessageEndpoints(
  l: LinkerInstance,
  rectOf: (id: string) => BarRect | null,
): { from: LinkerInstance['from']; to: LinkerInstance['to'] } | null {
  if (!l.seq || l.from.id == null || l.to.id == null) return null
  const ra = rectOf(l.from.id)
  const rb = rectOf(l.to.id)
  if (!ra || !rb) return null
  return {
    from: { ...l.from, x: barEdgeX(ra, l.seq.fromDir), y: l.seq.y },
    to: { ...l.to, x: barEdgeX(rb, l.seq.toDir), y: l.seq.y },
  }
}

/**
 * 重路由时序消息（图形移动/缩放后调用）：
 * - seq.y 跟随被移动的条（dy 取移动端的位移），clamp 到两端条 y 范围交集
 * - 端点重落到各自条缘；自消息整体平移回环
 * 返回更新后的连线；非时序消息或矩形缺失返回 null（调用方走通用逻辑）
 */
export function routeSeqMessage(
  l: LinkerInstance,
  oldRectOf: (id: string) => BarRect | null,
  liveOf: (id: string) => BarRect | null,
  kindOf: (id: string) => SeqEndpointKind = () => 'activation',
): LinkerInstance | null {
  if (!l.seq) return null
  const fromId = l.from.id
  const toId = l.to.id
  if (fromId == null || toId == null) return null

  // 自消息：按条位移整体平移（端点用比例映射结果推导位移，回环同步平移）
  if (fromId === toId) {
    // 自回环必有条缘方向（生命线不支持自回环，resolveSeqDrop 已拦截）
    const oldRect = oldRectOf(fromId)
    const live = liveOf(fromId)
    if (!oldRect || !live) return null
    const dx = live.x - oldRect.x
    const dy = live.y - oldRect.y
    const seq: SeqMessageData = { ...l.seq, y: l.seq.y + dy }
    return {
      ...l,
      seq,
      from: { ...l.from, x: l.from.x + dx, y: l.from.y + dy },
      to: { ...l.to, x: l.to.x + dx, y: l.to.y + dy },
      points: l.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
    }
  }

  // 水平消息：seq.y 跟随被移动的条（优先源端位移），clamp 到两端条范围交集
  let dy = 0
  const liveFrom = liveOf(fromId)
  if (liveFrom) {
    const old = oldRectOf(fromId)
    if (old) dy = liveFrom.y - old.y
  } else {
    const liveTo = liveOf(toId)
    const old = oldRectOf(toId)
    if (liveTo && old) dy = liveTo.y - old.y
  }
  const seq: SeqMessageData = { ...l.seq, y: l.seq.y + dy }

  const eps = seqMessageEndpoints({ ...l, seq }, (id) => liveOf(id) ?? oldRectOf(id))
  if (!eps) return null

  // clamp：仅激活条端参与（生命线/销毁符端跟随 seq.y）；交集为空（条已错开）则保持 y
  const ranges: Array<{ top: number; bottom: number }> = []
  for (const [id, dir] of [
    [fromId, seq.fromDir],
    [toId, seq.toDir],
  ] as const) {
    if (dir !== 0 && kindOf(id) === 'activation') {
      const r = liveOf(id) ?? oldRectOf(id)
      if (r) ranges.push({ top: r.y, bottom: r.y + r.h })
    }
  }
  if (ranges.length > 0) {
    const lo = Math.max(...ranges.map((r) => r.top))
    const hi = Math.min(...ranges.map((r) => r.bottom))
    if (lo <= hi) seq.y = Math.min(hi, Math.max(lo, seq.y))
    const eps2 = seqMessageEndpoints({ ...l, seq }, (id) => liveOf(id) ?? oldRectOf(id))
    if (eps2) return { ...l, seq, ...eps2, points: [] }
  }
  return { ...l, seq, ...eps, points: [] }
}

export type SeqDropResult =
  | { kind: 'msg'; toId: string; toDir: 1 | -1 | 0; y?: number }
  | { kind: 'self' }
  | null

/**
 * 消息草稿落点判定：
 * - 覆盖当前 y 且条缘距光标 ≤ SEQ_EDGE_SNAP 的激活条中取最近者
 * - 命中源条自身 → 自消息；无命中但光标在源条扩展范围（±28px）内 → 自消息兜底
 * - 其余 → null（取消）
 */
export function resolveSeqDrop(
  elements: Record<string, ElementInstance>,
  fromId: string,
  y: number,
  cur: { x: number; y: number },
): SeqDropResult {
  const src = elements[fromId]
  if (!src) return null
  const srcKind = seqEndpointKind(src)
  let best: { id: string; dir: 1 | -1 | 0; dist: number; snapY?: number } | null = null
  for (const el of Object.values(elements)) {
    if (el.locked) continue
    const kind = seqEndpointKind(el)
    const { x, y: top, w, h } = el.props
    // 激活条：条缘吸附，y 需在条范围内
    if (kind === 'activation') {
      if (y < top - 4 || y > top + h + 4) continue
      const dir: 1 | -1 = cur.x >= x + w / 2 ? 1 : -1
      const ex = dir === 1 ? x + w : x
      const dist = Math.abs(cur.x - ex)
      if (dist > SEQ_EDGE_SNAP) continue
      if (!best || dist < best.dist) best = { id: el.id, dir, dist }
      continue
    }
    // 生命线：中轴吸附，y 需在虚线区段（头部以下）
    if (kind === 'lifeline') {
      if (y < top + 30 - 4 || y > top + h + 4) continue
      const ex = x + w / 2
      const dist = Math.abs(cur.x - ex)
      if (dist > SEQ_EDGE_SNAP) continue
      if (!best || dist < best.dist) best = { id: el.id, dir: 0, dist }
      continue
    }
    // 销毁符：中轴 + 中心高度双吸附（消息 y 自动对齐 × 中心）
    if (kind === 'destroy') {
      const cx = x + w / 2
      const cy = top + h / 2
      if (Math.abs(cur.x - cx) > 16 || Math.abs(y - cy) > 14) continue
      const dist = Math.abs(cur.x - cx)
      if (!best || dist < best.dist) best = { id: el.id, dir: 0, dist, snapY: cy }
      continue
    }
  }
  if (best) {
    if (best.id === fromId) {
      // 生命线不支持自回环（两端同 x 退化为点）
      if (srcKind === 'lifeline') return null
      return { kind: 'self' }
    }
    return { kind: 'msg', toId: best.id, toDir: best.dir, ...(best.snapY != null ? { y: best.snapY } : {}) }
  }
  // 自消息兜底：仅激活条源；光标仍在源条扩展范围内
  if (srcKind === 'activation') {
    const { x, y: top, w, h } = src.props
    if (cur.x > x - 28 && cur.x < x + w + 28 && y > top - 8 && y < top + h + 28) {
      return { kind: 'self' }
    }
  }
  return null
}

/** 拖拽移动：更新 cur/y（y clamp 到源端范围；销毁符目标时吸附其中心高度） */
export function moveSeqDraft(
  elements: Record<string, ElementInstance>,
  draft: SeqMessageDraft,
  cur: { x: number; y: number },
): SeqMessageDraft {
  const src = elements[draft.fromId]
  if (!src || isLinker(src)) return { ...draft, cur }
  const [lo, hi] = seqSourceYRange(src)
  let y = Math.min(Math.max(cur.y, lo), hi)
  const drop = resolveSeqDrop(elements as Record<string, ElementInstance>, draft.fromId, y, cur)
  if (drop?.kind === 'msg' && drop.y != null) y = drop.y
  return { ...draft, y, cur }
}

/** 自消息回环中间折点（from/to 端点在条缘上，由调用方生成） */
export function selfLoopPoints(
  rect: BarRect,
  dir: 1 | -1 | 0,
  y: number,
  loopW = SEQ_LOOP_W,
  loopH = SEQ_LOOP_H,
): Array<{ x: number; y: number }> {
  const ex = barEdgeX(rect, dir)
  return [
    { x: ex + dir * loopW, y },
    { x: ex + dir * loopW, y: y + loopH },
  ]
}
