// 文档纯变换操作
// 供 store action 调用：移动 / 缩放 / 删除，均会联动更新关联连线的端点与路径。
//   - moveShape（designer.core 2876）：附着端点随图形纯平移；
//   - shapeResizable（designer.core 1850）：resize 时端点按初始相对位置比例
//     映射到新包围盒（from.x = x + w * 初始相对x），锚点身份保持不跳变。
import type { DocumentData, ElementInstance, LinkerInstance } from '@/types'
import { isLinker } from '@/types'
import { getLinkerPoints, type ShapeRect } from './linker'
import { stretchManualPoints } from './manualRoute'
import { resolveJunctionLinkers } from './linkerJunction'

/** 图形实时状态（resize 直操期间携带 live w/h；移动直操只有位置） */
export interface LiveShapeState {
  x: number
  y: number
  w?: number
  h?: number
}

/**
 * 端点跟随：按初始相对位置比例映射到图形新包围盒
 * el 为拖拽/提交前的旧状态（提供旧包围盒），live 为目标状态；
 * 附着在锚点上的端点（相对比例为 0.5/1/0 等锚点位置）映射后仍落在同身份锚点上。
 */
function followEndpoint(
  ep: LinkerInstance['from'],
  el: ElementInstance,
  live: LiveShapeState,
): LinkerInstance['from'] {
  const { x, y, w, h } = el.props
  const rx = w > 0 ? (ep.x - x) / w : 0
  const ry = h > 0 ? (ep.y - y) / h : 0
  return {
    ...ep, // 防御性透传附加字段（如 junction；附着端点 id != null 时不携带）
    id: ep.id,
    x: live.x + (live.w ?? w) * rx,
    y: live.y + (live.h ?? h) * ry,
    angle: ep.angle,
  }
}

/** 由元素表构造图形包围盒取值器（junction 解析重路由用） */
export function rectGetterOf(
  elements: DocumentData['elements'],
): (id: string) => ShapeRect | null {
  return (id) => {
    const el = elements[id]
    if (!el || isLinker(el)) return null
    return { x: el.props.x, y: el.props.y, w: el.props.w, h: el.props.h }
  }
}

/** junction 二阶联动：宿主几何变动后重求附着端点并合并进 elements，返回更新的连线 id */
export function applyJunctionResolution(
  elements: DocumentData['elements'],
): string[] {
  const updated = resolveJunctionLinkers(elements, rectGetterOf(elements))
  for (const [lid, nl] of updated) {
    elements[lid] = nl
  }
  return [...updated.keys()]
}

/**
 * 重路由所有附着在目标图形上的连线
 *
 * @param elements   文档元素表（图形为拖拽/提交前的旧状态；提供旧包围盒给比例映射）
 * @param livePos    各图形目标状态（resize 直操可携带 live w/h）
 * @returns 连线 id → 更新后的连线实例
 */
export function routeAttachedLinkers(
  elements: DocumentData['elements'],
  livePos: Map<string, LiveShapeState>,
): Map<string, LinkerInstance> {
  const out = new Map<string, LinkerInstance>()

  const getRect = (id: string): ShapeRect | null => {
    const base = elements[id]
    if (!base || isLinker(base)) return null
    const lp = livePos.get(id)
    if (lp) return { x: lp.x, y: lp.y, w: lp.w ?? base.props.w, h: lp.h ?? base.props.h }
    return { x: base.props.x, y: base.props.y, w: base.props.w, h: base.props.h }
  }

  for (const el of Object.values(elements)) {
    if (!isLinker(el)) continue
    const l = el
    const fromMoved = l.from.id != null && livePos.has(l.from.id)
    const toMoved = l.to.id != null && livePos.has(l.to.id)
    if (!fromMoved && !toMoved) continue

    let from = l.from
    let to = l.to
    if (fromMoved && l.from.id != null) {
      const shape = elements[l.from.id] as ElementInstance
      from = followEndpoint(l.from, shape, livePos.get(l.from.id)!)
    }
    if (toMoved && l.to.id != null) {
      const shape = elements[l.to.id] as ElementInstance
      to = followEndpoint(l.to, shape, livePos.get(l.to.id)!)
    }

    const next = { ...l, from, to }
    out.set(l.id, {
      ...next,
      // 手动路由：仅拉伸端段接住新锚点（不全量重算，保留用户调整的折点）
      points: l.manualRoute ? stretchManualPoints(l, from, to) : getLinkerPoints(next, getRect),
    })
  }
  return out
}

/** 批量移动图形（dx/dy 为世界坐标位移），联动连线 */
export function moveElementsInDoc(
  doc: DocumentData,
  ids: string[],
  dx: number,
  dy: number,
): DocumentData {
  const elements = { ...doc.elements }
  const livePos = new Map<string, { x: number; y: number }>()

  for (const id of ids) {
    const el = elements[id]
    if (!el || isLinker(el) || el.locked) continue
    livePos.set(id, { x: el.props.x + dx, y: el.props.y + dy })
    elements[id] = { ...el, props: { ...el.props, x: el.props.x + dx, y: el.props.y + dy } }
  }
  if (livePos.size === 0) return doc

  for (const [lid, nl] of routeAttachedLinkers(doc.elements, livePos)) {
    elements[lid] = nl
  }
  // 二阶联动：附着在连线上的 junction 端点跟随（宿主连线刚被重路由）
  applyJunctionResolution(elements)
  return { ...doc, elements }
}

/** 调整图形尺寸/位置，联动连线（端点按初始相对比例映射，保持锚点身份） */
export function resizeElementInDoc(
  doc: DocumentData,
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
): DocumentData {
  const el = doc.elements[id]
  if (!el || isLinker(el)) return doc
  const ew = Math.max(20, w)
  const eh = Math.max(20, h)
  const elements = {
    ...doc.elements,
    [id]: { ...el, props: { ...el.props, x, y, w: ew, h: eh } },
  }
  const livePos = new Map<string, LiveShapeState>([[id, { x, y, w: ew, h: eh }]])
  for (const [lid, nl] of routeAttachedLinkers(doc.elements, livePos)) {
    elements[lid] = nl
  }
  // 二阶联动：附着在连线上的 junction 端点跟随
  applyJunctionResolution(elements)
  return { ...doc, elements }
}

/** 收集附着在指定图形上的所有连线 ID（含 junction 传递闭包：宿主在集合内的连线也纳入） */
export function attachedLinkerIds(
  elements: DocumentData['elements'],
  shapeIds: Iterable<string>,
): string[] {
  const ids = new Set(shapeIds)
  const out: string[] = []
  // 迭代至不动点：图形 → 附着连线 → 附着在该连线上的 junction 连线 → …
  let grew = true
  while (grew) {
    grew = false
    for (const el of Object.values(elements)) {
      if (!isLinker(el) || ids.has(el.id)) continue
      const attached =
        (el.from.id != null && ids.has(el.from.id)) ||
        (el.to.id != null && ids.has(el.to.id)) ||
        (el.from.junction != null && ids.has(el.from.junction.linkerId)) ||
        (el.to.junction != null && ids.has(el.to.junction.linkerId))
      if (attached) {
        ids.add(el.id)
        out.push(el.id)
        grew = true
      }
    }
  }
  return out
}

/** 批量删除元素（图形 + 连线），同时删除附着其上的连线；junction 宿主被删的连线脱附为自由端点 */
export function deleteElementsInDoc(
  doc: DocumentData,
  ids: string[],
): { document: DocumentData; removedIds: Set<string>; detached: string[] } {
  const idSet = new Set(ids)
  const removed = new Set(ids)
  const elements: DocumentData['elements'] = {}

  for (const [id, el] of Object.entries(doc.elements)) {
    if (idSet.has(id)) continue
    if (
      isLinker(el) &&
      ((el.from.id != null && idSet.has(el.from.id)) ||
        (el.to.id != null && idSet.has(el.to.id)))
    ) {
      removed.add(id)
      continue
    }
    elements[id] = el
  }
  // junction 脱附：宿主（含被级联删除的连线）不在了 → 端点清 junction 保坐标（不级联删除附着线）
  const detached: string[] = []
  for (const [id, el] of Object.entries(elements)) {
    if (!isLinker(el)) continue
    const fromDetach = el.from.junction != null && removed.has(el.from.junction.linkerId)
    const toDetach = el.to.junction != null && removed.has(el.to.junction.linkerId)
    if (!fromDetach && !toDetach) continue
    detached.push(id)
    elements[id] = {
      ...el,
      from: fromDetach ? stripJunction(el.from) : el.from,
      to: toDetach ? stripJunction(el.to) : el.to,
    }
  }
  return { document: { ...doc, elements }, removedIds: removed, detached }
}

/** 脱附：去除端点 junction 字段（其余字段原样保留） */
function stripJunction(ep: LinkerInstance['from']): LinkerInstance['from'] {
  const { junction: _junction, ...rest } = ep
  return rest
}
