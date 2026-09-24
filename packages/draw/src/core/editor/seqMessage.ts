// UML 时序消息：激活条之间的水平消息与自消息回环
// - 消息两端附着激活条（sequenceActivation）左右缘，seq.y 为消息高度（恒水平）
// - 自消息（from.id === to.id）：侧边拉出 → 外 → 下 → 折回同一条侧边的矩形回环，
//   points 固定 + manualRoute，激活条移动时整体平移
// - 垂直移动任一激活条：seq.y 跟随被移动的条，clamp 到两端条的 y 范围交集（另一端沿条缘滑动）
import type { ElementInstance, LinkerInstance, SeqMessageData } from '@/types'

/** 激活条缘拖出消息的草稿状态（Canvas 渲染预览、mouseup 提交/取消） */
export interface SeqMessageDraft {
  fromId: string
  dir: 1 | -1
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

/** 激活条 dir 侧缘的世界 x（1 = 右缘 / -1 = 左缘） */
export function barEdgeX(rect: BarRect, dir: 1 | -1): number {
  return dir === 1 ? rect.x + rect.w : rect.x
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
): LinkerInstance | null {
  if (!l.seq) return null
  const fromId = l.from.id
  const toId = l.to.id
  if (fromId == null || toId == null) return null

  // 自消息：按条位移整体平移（端点用比例映射结果推导位移，回环同步平移）
  if (fromId === toId) {
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

  // clamp 到两端条（新位置）y 范围交集；交集为空（条已错开）则保持 y
  const ra = liveOf(fromId) ?? oldRectOf(fromId)
  const rb = liveOf(toId) ?? oldRectOf(toId)
  if (ra && rb) {
    const lo = Math.max(ra.y, rb.y)
    const hi = Math.min(ra.y + ra.h, rb.y + rb.h)
    if (lo <= hi) seq.y = Math.min(hi, Math.max(lo, seq.y))
    const eps2 = seqMessageEndpoints({ ...l, seq }, (id) => liveOf(id) ?? oldRectOf(id))
    if (eps2) return { ...l, seq, ...eps2, points: [] }
  }
  return { ...l, seq, ...eps, points: [] }
}

export type SeqDropResult =
  | { kind: 'msg'; toId: string; toDir: 1 | -1 }
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
  let best: { id: string; dir: 1 | -1; dist: number } | null = null
  for (const el of Object.values(elements)) {
    if (el.name !== 'sequenceActivation' || el.locked) continue
    const { x, y: top, w, h } = el.props
    if (y < top - 4 || y > top + h + 4) continue
    const dir: 1 | -1 = cur.x >= x + w / 2 ? 1 : -1
    const ex = dir === 1 ? x + w : x
    const dist = Math.abs(cur.x - ex)
    if (dist > SEQ_EDGE_SNAP) continue
    if (!best || dist < best.dist) best = { id: el.id, dir, dist }
  }
  if (best) {
    return best.id === fromId ? { kind: 'self' } : { kind: 'msg', toId: best.id, toDir: best.dir }
  }
  // 自消息兜底：光标仍在源条扩展范围内
  const { x, y: top, w, h } = src.props
  if (cur.x > x - 28 && cur.x < x + w + 28 && y > top - 8 && y < top + h + 28) {
    return { kind: 'self' }
  }
  return null
}

/** 自消息回环中间折点（from/to 端点在条缘上，由调用方生成） */
export function selfLoopPoints(
  rect: BarRect,
  dir: 1 | -1,
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
