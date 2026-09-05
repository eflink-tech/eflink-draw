// 文档纯变换操作
// 供 store action 调用：移动 / 缩放 / 删除，均会联动更新关联连线的端点与路径。
//   - moveShape（designer.core 2876）：附着端点随图形纯平移；
//   - shapeResizable（designer.core 1850）：resize 时端点按初始相对位置比例
//     映射到新包围盒（from.x = x + w * 初始相对x），锚点身份保持不跳变。
import type { DocumentData, ElementInstance, LinkerInstance } from '@/types'
import { isLinker } from '@/types'
import { getLinkerPoints, type ShapeRect } from './linker'
import { stretchManualPoints } from './manualRoute'

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
    id: ep.id,
    x: live.x + (live.w ?? w) * rx,
    y: live.y + (live.h ?? h) * ry,
    angle: ep.angle,
  }
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
  return { ...doc, elements }
}

/** 收集附着在指定图形上的所有连线 ID */
export function attachedLinkerIds(
  elements: DocumentData['elements'],
  shapeIds: Iterable<string>,
): string[] {
  const ids = new Set(shapeIds)
  const out: string[] = []
  for (const el of Object.values(elements)) {
    if (
      isLinker(el) &&
      ((el.from.id != null && ids.has(el.from.id)) ||
        (el.to.id != null && ids.has(el.to.id)))
    ) {
      out.push(el.id)
    }
  }
  return out
}

/** 批量删除元素（图形 + 连线），同时删除附着其上的连线 */
export function deleteElementsInDoc(
  doc: DocumentData,
  ids: string[],
): { document: DocumentData; removedIds: Set<string> } {
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
  return { document: { ...doc, elements }, removedIds: removed }
}
