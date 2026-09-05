//
// 模块级状态模式（同 panelDrag），与 Canvas 的 stage mousedown/mousemove/mouseup 联动：
//   1. mousedown：resolveLinkerStart 解析起点（命中图形→最近锚点；空白/锁定→自由端点），
//      置 linkerDraft（to 暂等于 from）
//   2. mousemove：snapLinkerEndpoint 计算 to 端（吸附锚点/图形边/与另一端对齐），实时重算 points
//   3. mouseup：双轴位移 ≤20px 视为误触不创建；否则 createLinkerInstance + getLinkerPoints
//      + addLinker + 选中
//
// 工具保持激活（setTool('linker') 不自动回 select），支持连续画多条连线。
import type { ElementInstance, LinkerDraft } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import {
  LINKER_DEFAULTS,
  createLinkerInstance,
  findSnapAnchor,
  getLinkerPoints,
  snapLinkerEndpoint,
  type LinkerEndpoint,
} from './linker'
import { allShapes, makeStoreRectGetter } from './interaction'
import { hideEndpointPreview, showEndpointPreview } from './uiOverlay'

/** 误触阈值：双轴位移均 ≤20px 时视为点击，不创建连线（与锚点拖拽一致） */
const MIS_TOUCH_PX = 20

interface FreeLinkerDrag {
  /** 起点端点（含吸附结果） */
  from: LinkerEndpoint
  /** mousedown 世界坐标（误触判定基准） */
  start: { x: number; y: number }
}

let drag: FreeLinkerDrag | null = null

/** 是否正在拖拽自由连线 */
export function isFreeLinkerDragging(): boolean {
  return drag !== null
}

/**
 * 起点解析（纯函数，便于测试）：
 * 命中图形（含锁定排除）→ 最近锚点；空白/锁定图形 → 自由端点。
 */
export function resolveLinkerStart(
  shapes: ElementInstance[],
  worldX: number,
  worldY: number,
): LinkerEndpoint {
  const snapped = findSnapAnchor(shapes, worldX, worldY, null)
  if (snapped) {
    return { id: snapped.id, x: snapped.x, y: snapped.y, angle: snapped.angle ?? 0 }
  }
  return { id: null, x: worldX, y: worldY, angle: 0 }
}

/** 由 from/to 构造连线草稿（lineStyle 取 LINKER_DEFAULTS，linkerType 固定 broken；angle 归 0） */
function buildDraft(from: LinkerEndpoint, to: LinkerEndpoint): LinkerDraft {
  const norm = (ep: LinkerEndpoint): { id: string | null; x: number; y: number; angle: number } => ({
    ...ep,
    angle: ep.angle ?? 0,
  })
  const nFrom = norm(from)
  const nTo = norm(to)
  return {
    from: nFrom,
    to: nTo,
    linkerType: 'broken',
    lineStyle: {
      lineWidth: LINKER_DEFAULTS.lineWidth,
      lineColor: LINKER_DEFAULTS.lineColor,
      lineStyle: LINKER_DEFAULTS.lineStyle,
      beginArrowStyle: LINKER_DEFAULTS.beginArrowStyle,
      endArrowStyle: LINKER_DEFAULTS.endArrowStyle,
    },
    points: getLinkerPoints({ linkerType: 'broken', from: nFrom, to: nTo }, makeStoreRectGetter()),
  }
}

/** mousedown：开始拖拽，置初始草稿 */
export function beginFreeLinker(worldX: number, worldY: number): void {
  const st = useEditorStore.getState()
  const from = resolveLinkerStart(allShapes(), worldX, worldY)
  drag = { from, start: { x: worldX, y: worldY } }
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
  const r = snapLinkerEndpoint({
    shapes: allShapes(),
    hitShapeId,
    worldX,
    worldY,
    scale: st.viewport.scale,
    otherEnd: { id: d.from.id, x: d.from.x, y: d.from.y },
  })
  // 悬停图形显示锚点 / 吸附锚点大圆预览（与锚点拖拽一致）
  st.setHoveredId(hitShapeId)
  if (r.snapAnchor) {
    showEndpointPreview(r.snapAnchor.x, r.snapAnchor.y, st.viewport.scale)
  } else {
    hideEndpointPreview()
  }
  const to = { ...r.endpoint, angle: r.endpoint.angle ?? 0 }
  st.setLinkerDraft(buildDraft(d.from, to))
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
