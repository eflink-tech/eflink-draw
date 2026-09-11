// 交互层共享工具（连线创建 / 端点拖动 / 图形拖拽均使用）
import type Konva from 'konva'
import type { ElementInstance, LinkerInstance } from '@/types'
import { DEFAULT_LINE_WIDTH, isLinker } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { traceActions } from '@/core/utils/pathActions'
import type { ShapeRect } from './linker'

/** stage 绝对坐标 → 世界坐标 */
export function absToWorld(stage: Konva.Stage, abs: { x: number; y: number }): { x: number; y: number } {
  return { x: (abs.x - stage.x()) / stage.scaleX(), y: (abs.y - stage.y()) / stage.scaleY() }
}

/** 指针的世界坐标 */
export function pointerWorld(stage: Konva.Stage | null): { x: number; y: number } | null {
  if (!stage) return null
  const p = stage.getPointerPosition()
  if (!p) return null
  return absToWorld(stage, p)
}

/** 世界坐标 → 缩放后的屏幕像素（不含视口平移，供 HTML 层用 CSS translate 跟手） */
export function worldToScaled(x: number, y: number, scale: number): { x: number; y: number } {
  return { x: x * scale, y: y * scale }
}

/** 世界坐标 → 画布容器像素坐标 */
export function worldToScreen(x: number, y: number): { x: number; y: number } {
  const vp = useEditorStore.getState().viewport
  const s = worldToScaled(x, y, vp.scale)
  return { x: s.x + vp.x, y: s.y + vp.y }
}

/** 从 store 读取图形矩形（连线 points 计算用） */
export function makeStoreRectGetter(): (id: string) => ShapeRect | null {
  const els = useEditorStore.getState().document.elements
  return (id) => {
    const el = els[id]
    if (!el || isLinker(el)) return null
    return { x: el.props.x, y: el.props.y, w: el.props.w, h: el.props.h }
  }
}

/** 从 store 读取图形边框宽度（连线端点补偿用；默认 DEFAULT_LINE_WIDTH） */
export function shapeBorderWidth(id: string): number {
  const el = useEditorStore.getState().document.elements[id]
  if (!el || isLinker(el)) return DEFAULT_LINE_WIDTH
  return el.lineStyle.lineWidth ?? DEFAULT_LINE_WIDTH
}

/**
 * 世界坐标 → 图形局部坐标（含逆旋转）
 */
export function worldToLocalPoint(
  el: ElementInstance,
  wx: number,
  wy: number,
): { x: number; y: number } | null {
  const { x, y, w, h, angle } = el.props
  const cx = x + w / 2
  const cy = y + h / 2
  const cos = Math.cos(-angle)
  const sin = Math.sin(-angle)
  const dx = wx - cx
  const dy = wy - cy
  const lx = dx * cos - dy * sin + w / 2
  const ly = dx * sin + dy * cos + h / 2
  if (lx < 0 || lx > w || ly < 0 || ly > h) return null
  return { x: lx, y: ly }
}

let hitCtx: CanvasRenderingContext2D | null = null
function getHitCtx(): CanvasRenderingContext2D | null {
  if (hitCtx) return hitCtx
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 8
  canvas.height = 8
  hitCtx = canvas.getContext('2d')
  return hitCtx
}

/**
 * 数学命中检测：zindex 降序（顶层优先），包围盒粗筛 + isPointInPath 精筛
 * 相比 Konva stage.getAllIntersections（对每个 listening 节点做命中画布像素回读），
 * 只遍历图形本体且无 GPU→CPU 回读，拖线期间每帧调用也保持轻量。
 *
 * container 兜底：attribute.container === true 的图形（braces/parentheses/backArrow 等
 * 装饰性路径，可能由不连续的路径段组成）跳过 isPointInPath，直接用 AABB 命中。
 */
export function hitElementAtPoint(
  elements: ElementInstance[],
  wx: number,
  wy: number,
): string | null {
  const sorted = [...elements].sort((a, b) => b.props.zindex - a.props.zindex)
  // 惰性获取 ctx：container 图形无需 isPointInPath，在无 canvas 环境（SSR/测试）也能命中
  let ctx: CanvasRenderingContext2D | null | undefined
  for (const el of sorted) {
    if (el.attribute?.visible === false || el.locked) continue
    const local = worldToLocalPoint(el, wx, wy)
    if (!local) continue
    // container 图形用 AABB 兜底（装饰性路径可能不闭合，isPointInPath 无法命中）
    if (el.attribute?.container) return el.id
    if (ctx === undefined) ctx = getHitCtx()
    if (!ctx) continue
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.beginPath()
    traceActions(ctx, el.path, { w: el.props.w, h: el.props.h })
    if (ctx.isPointInPath(local.x, local.y)) return el.id
  }
  return null
}

/**
 * 鼠标下的图形 ID（数学路径命中，见 hitElementAtPoint）
 * 端点手柄/锚点/缩放手柄等辅助节点不参与，只认图形本体。
 */
export function hitElementId(stage: Konva.Stage | null): string | null {
  if (!stage) return null
  const pp = stage.getPointerPosition()
  if (!pp) return null
  const world = absToWorld(stage, pp)
  return hitElementAtPoint(allShapes(), world.x, world.y)
}

/** 画布上的全部图形（连线端点吸附检测用） */
export function allShapes(): ElementInstance[] {
  return Object.values(useEditorStore.getState().document.elements).filter(
    (el) => !isLinker(el),
  ) as ElementInstance[]
}

export function getShapesByRange(
  elements: Record<string, ElementInstance | LinkerInstance>,
  rect: { x: number; y: number; w: number; h: number },
): string[] {
  const ids: string[] = []
  for (const el of Object.values(elements)) {
    if (isLinker(el)) continue
    const ex = el.props.x
    const ey = el.props.y
    const ew = el.props.w
    const eh = el.props.h
    // AABB 交集检测
    if (ex < rect.x + rect.w && ex + ew > rect.x && ey < rect.y + rect.h && ey + eh > rect.y) {
      ids.push(el.id)
    }
  }
  return ids
}
