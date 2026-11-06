//
// 模块级状态模式（同 panelDrag），与 Canvas 的 stage mousedown/mousemove/mouseup 联动：
//   1. mousedown：resolveLinkerStart 解析起点（命中图形→锚点 7px 优先，否则轮廓最近点；
//      空白/锁定→自由端点），置 linkerDraft（to 暂等于 from）
//   2. mousemove：snapLinkerEndpoint 计算 to 端（吸附锚点/图形边/与另一端对齐），实时重算 points
//   3. mouseup：双轴位移 ≤20px 视为误触不创建；否则 createLinkerInstance + getLinkerPoints
//      + addLinker + 选中
//
// 工具保持激活（setTool('linker') 不自动回 select），支持连续画多条连线。
import type { ElementInstance, LinkerDraft, LinkerInstance } from '@/types'
import { isLinker } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import {
  ANCHOR_HIT_PX,
  applyMemorizedLinkerStyle,
  createLinkerInstance,
  getAnchorPoints,
  getLinkerPoints,
  memorizedLinkerStyle,
  snapLinkerEndpoint,
  type LinkerEndpoint,
} from './linker'
import { nearestContourPoint, pointInRotatedBBox, type ContourHit } from './shapeContour'
import { allShapes, makeStoreRectGetter } from './interaction'
import { hideEndpointPreview, showEndpointPreview } from './uiOverlay'

/** 误触阈值：双轴位移均 ≤20px 时视为点击，不创建连线（与锚点拖拽一致） */
const MIS_TOUCH_PX = 20

interface FreeLinkerDrag {
  /** 起点端点（含吸附结果） */
  from: LinkerEndpoint
  /** mousedown 世界坐标（误触判定基准） */
  start: { x: number; y: number }
  /** 按下时精确点中锚点（7px）→ 起点锁定该锚点，不随拖拽方向换边 */
  anchorLocked: boolean
}

let drag: FreeLinkerDrag | null = null

/** 是否正在拖拽自由连线 */
export function isFreeLinkerDragging(): boolean {
  return drag !== null
}

/**
 * 起点解析（纯函数，便于测试）：
 * 1. 包围盒（±10px，屏幕像素）覆盖光标的可连线图形为候选
 * 2. 候选中距轮廓最近的图形承载起点；其锚点 7px（屏幕像素）内锚点优先
 * 3. 否则吸附该图形最近的锚点（默认从节点起线，拖拽中随方向换边）
 * 4. 无锚点的图形回退轮廓最近点；空白/锁定 → 自由端点
 */
export function resolveLinkerStart(
  shapes: ElementInstance[],
  worldX: number,
  worldY: number,
  scale: number = 1,
): LinkerEndpoint {
  // 粗筛与锚点容差同为屏幕像素口径（scale<1 时粗筛随 tol 同步放大，消除锚点漏检窗口）
  const cands = shapes.filter(
    (s) =>
      !s.locked &&
      s.attribute?.linkable !== false &&
      pointInRotatedBBox(s, worldX, worldY, 10 / scale),
  )
  if (cands.length === 0) return { id: null, x: worldX, y: worldY, angle: 0 }

  let host: ElementInstance | null = null
  let hostHit: ContourHit | null = null
  let hostDist = Infinity
  for (const s of cands) {
    const c = nearestContourPoint(s, worldX, worldY)
    if (c && c.dist < hostDist) {
      hostDist = c.dist
      host = s
      hostHit = c
    }
  }
  if (!host || !hostHit) return { id: null, x: worldX, y: worldY, angle: 0 }

  const anchors = getAnchorPoints(host)
  if (anchors.length > 0) {
    // 锚点优先：先按 7px 命中，否则取距按下点最近的锚点（节点）
    const tol = ANCHOR_HIT_PX / scale
    const direct = anchors.find(
      (a) => Math.abs(a.x - worldX) <= tol && Math.abs(a.y - worldY) <= tol,
    )
    const pick = direct ?? nearestAnchorOf(anchors, worldX, worldY)
    return { id: host.id, x: pick.x, y: pick.y, angle: pick.angle }
  }

  return { id: host.id, x: hostHit.x, y: hostHit.y, angle: hostHit.angle }
}

/** 距 (x,y) 最近的锚点 */
function nearestAnchorOf(
  anchors: Array<{ x: number; y: number; angle: number }>,
  x: number,
  y: number,
): { x: number; y: number; angle: number } {
  let best = anchors[0]!
  let bestDist = Infinity
  for (const a of anchors) {
    const dist = (a.x - x) ** 2 + (a.y - y) ** 2
    if (dist < bestDist) {
      bestDist = dist
      best = a
    }
  }
  return best
}

/** 由 from/to 构造连线草稿（线型/样式取连线样式记忆；angle 归 0） */
function buildDraft(from: LinkerEndpoint, to: LinkerEndpoint): LinkerDraft {
  const norm = (ep: LinkerEndpoint): LinkerInstance['from'] => ({
    ...ep,
    angle: ep.angle ?? 0,
  })
  const nFrom = norm(from)
  const nTo = norm(to)
  const style = memorizedLinkerStyle()
  return {
    from: nFrom,
    to: nTo,
    linkerType: style.linkerType,
    lineStyle: { ...style.lineStyle },
    points: getLinkerPoints({ linkerType: style.linkerType, from: nFrom, to: nTo }, makeStoreRectGetter()),
  }
}

/** mousedown：开始拖拽，置初始草稿 */
export function beginFreeLinker(worldX: number, worldY: number): void {
  const st = useEditorStore.getState()
  const shapes = allShapes()
  const from = resolveLinkerStart(shapes, worldX, worldY, st.viewport.scale)
  // 按下点已在锚点容差内 → 用户明确指定了该节点，拖拽途中不再换边
  const host = from.id != null ? shapes.find((s) => s.id === from.id) : undefined
  const tol = ANCHOR_HIT_PX / st.viewport.scale
  const anchorLocked =
    host != null &&
    getAnchorPoints(host).some(
      (a) => Math.abs(a.x - worldX) <= tol && Math.abs(a.y - worldY) <= tol,
    )
  drag = { from, start: { x: worldX, y: worldY }, anchorLocked }
  st.setLinkerDraft(buildDraft(from, from))
}

/**
 * mousemove：更新 to 端并实时重算草稿
 * @param hitShapeId 鼠标下图形 ID（精确路径命中，由 Canvas 用 hitElementId 提供；null = 空白）
 */
export function moveFreeLinker(
  worldX: number,
  worldY: number,
  hitShapeId: string | null,
): void {
  const d = drag
  if (!d) return
  const st = useEditorStore.getState()
  const shapes = allShapes()
  // 起点默认挂在节点上：拖拽方向确定后，换到起始图形上面向指针的锚点
  //（按下时精确点中锚点则保持用户选择）
  let from = d.from
  if (from.id != null && !d.anchorLocked) {
    const host = shapes.find((s) => s.id === from.id)
    const anchors = host ? getAnchorPoints(host) : []
    if (anchors.length > 0) {
      const pick = nearestAnchorOf(anchors, worldX, worldY)
      from = { id: from.id, x: pick.x, y: pick.y, angle: pick.angle }
    }
  }
  // 候选宿主：全部连线（草稿尚未入库，无自身可排除；selfLinkerId 传 null）
  const linkers = Object.values(st.document.elements).filter(isLinker)
  const r = snapLinkerEndpoint({
    shapes,
    hitShapeId,
    worldX,
    worldY,
    scale: st.viewport.scale,
    otherEnd: from,
    // 创建口径：落点默认吸附图形锚点（节点），而非任意轮廓点
    preferAnchors: true,
    linkers,
    elements: st.document.elements,
    selfLinkerId: null,
  })
  // 悬停图形显示锚点 / 吸附锚点大圆预览（与锚点拖拽一致；junction 吸附变醒目蓝）
  st.setHoveredId(hitShapeId)
  if (r.snapAnchor) {
    showEndpointPreview(
      r.snapAnchor.x,
      r.snapAnchor.y,
      st.viewport.scale,
      r.endpoint.junction != null,
    )
  } else {
    hideEndpointPreview()
  }
  const to = { ...r.endpoint, angle: r.endpoint.angle ?? 0 }
  st.setLinkerDraft(buildDraft(from, to))
}

/** mouseup：误触判定 + 创建连线（保持连线工具激活） */
export function endFreeLinker(): void {
  const d = drag
  drag = null
  hideEndpointPreview()
  const st = useEditorStore.getState()
  st.setHoveredId(null)
  const draft = st.linkerDraft
  st.setLinkerDraft(null)
  if (!d || !draft) return
  // 误触：双轴位移均 ≤20px → 不创建
  if (
    Math.abs(draft.to.x - d.start.x) <= MIS_TOUCH_PX &&
    Math.abs(draft.to.y - d.start.y) <= MIS_TOUCH_PX
  ) {
    return
  }
  const zmax = Math.max(
    0,
    ...Object.values(st.document.elements).map((el) => el.props.zindex),
  )
  const inst = createLinkerInstance(draft.from, draft.to, zmax + 1)
  // 先应用记忆样式再算路由（路由依赖 linkerType）
  applyMemorizedLinkerStyle(inst)
  inst.points = getLinkerPoints(inst, makeStoreRectGetter())
  st.addLinker(inst)
  st.selectElement(inst.id)
}

/** 取消拖拽（Esc / 窗口失焦）：清理草稿与悬停预览，不创建连线 */
export function cancelFreeLinker(): void {
  drag = null
  hideEndpointPreview()
  const st = useEditorStore.getState()
  st.setHoveredId(null)
  st.setLinkerDraft(null)
}
