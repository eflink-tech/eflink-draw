// src/core/editor/alignmentOps.ts
// 图形排列纯函数：对齐 / 分布 / 匹配大小
// 输入/输出均为 ElementInstance 数组（不可变），几何计算可直接单测。
// store 侧的落库（联动连线 + 历史）见 editorStore 的 alignShapes/distributeShapes/matchSize。
import type { ElementInstance, LinkerInstance } from '@/types'
import { isLinker } from '@/types'
import { routeAttachedLinkers, type LiveShapeState } from './documentOps'

export type AlignDir = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
export type DistDir = 'horizontal' | 'vertical'
export interface MatchOpts { w?: boolean; h?: boolean }

function centerOn(dir: DistDir, e: ElementInstance): number {
  return dir === 'horizontal' ? e.props.x + e.props.w / 2 : e.props.y + e.props.h / 2
}

export function alignShapes(els: ElementInstance[], dir: AlignDir): ElementInstance[] {
  if (els.length < 2) return els
  const minX = Math.min(...els.map((e) => e.props.x))
  const maxX = Math.max(...els.map((e) => e.props.x + e.props.w))
  const minY = Math.min(...els.map((e) => e.props.y))
  const maxY = Math.max(...els.map((e) => e.props.y + e.props.h))
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2

  return els.map((e) => {
    const { x, y, w, h } = e.props
    let nx = x
    let ny = y
    switch (dir) {
      case 'left': nx = minX; break
      case 'center': nx = cx - w / 2; break
      case 'right': nx = maxX - w; break
      case 'top': ny = minY; break
      case 'middle': ny = cy - h / 2; break
      case 'bottom': ny = maxY - h; break
    }
    return { ...e, props: { ...e.props, x: nx, y: ny } }
  })
}

export function distributeShapes(els: ElementInstance[], dir: DistDir): ElementInstance[] {
  if (els.length < 3) return els
  const sorted = [...els].sort((a, b) =>
    dir === 'horizontal' ? a.props.x - b.props.x : a.props.y - b.props.y,
  )
  const n = sorted.length
  const first = centerOn(dir, sorted[0]!)
  const last = centerOn(dir, sorted[n - 1]!)
  const targetCenter = (idx: number): number => first + ((last - first) * idx) / (n - 1)

  return els.map((e) => {
    const idx = sorted.findIndex((s) => s.id === e.id)
    const target = targetCenter(idx)
    return dir === 'horizontal'
      ? { ...e, props: { ...e.props, x: target - e.props.w / 2 } }
      : { ...e, props: { ...e.props, y: target - e.props.h / 2 } }
  })
}

export function matchSize(els: ElementInstance[], opts: MatchOpts): ElementInstance[] {
  if (els.length < 2) return els
  const ref = els[0]!
  return els.map((e, i) => {
    if (i === 0) return e
    const patch: { w?: number; h?: number } = {}
    if (opts.w) patch.w = ref.props.w
    if (opts.h) patch.h = ref.props.h
    return { ...e, props: { ...e.props, ...patch } }
  })
}

export interface TransformResult {
  elements: Record<string, ElementInstance | LinkerInstance>
  changedIds: string[]
}

export function applyShapeTransform(
  elements: Record<string, ElementInstance | LinkerInstance>,
  ids: string[],
  transform: (els: ElementInstance[]) => ElementInstance[],
): TransformResult {
  const targets = ids
    .map((id) => elements[id])
    .filter((el): el is ElementInstance => el != null && !isLinker(el) && !el.locked)
  if (targets.length === 0) return { elements, changedIds: [] }

  const next = transform(targets)
  const updates = { ...elements }
  const livePos = new Map<string, LiveShapeState>()
  const changed = new Set<string>()

  for (const el of next) {
    const old = elements[el.id] as ElementInstance | undefined
    if (!old) continue
    const p = el.props
    const op = old.props
    if (p.x === op.x && p.y === op.y && p.w === op.w && p.h === op.h) continue
    updates[el.id] = el
    changed.add(el.id)
    livePos.set(el.id, { x: p.x, y: p.y, w: p.w, h: p.h })
  }
  if (livePos.size === 0) return { elements, changedIds: [] }

  for (const [lid, linker] of routeAttachedLinkers(elements, livePos)) {
    updates[lid] = linker
    changed.add(lid)
  }
  return { elements: updates, changedIds: [...changed] }
}
