// UI 覆盖层直操（吸附线 / 坐标 tip）
// 拖拽期间每帧更新这些节点，绕过 React 重渲染。
import type Konva from 'konva'
import type { SnapResult } from './alignment'
import { clippedSnapLinePoints, visibleWorldRect } from './dragPerf'

/** 吸附线相对视口外扩（世界单位），避免贴边被裁切 */
const SNAP_PAD = 64

let snapV: Konva.Line | null = null
let snapH: Konva.Line | null = null
let tipEl: HTMLDivElement | null = null
/** 上次吸附线几何签名；相同则跳过 batchDraw */
let snapDrawKey = ''

export function registerSnapLines(v: Konva.Line | null, h: Konva.Line | null): void {
  snapV = v
  snapH = h
}

export function registerTip(el: HTMLDivElement | null): void {
  tipEl = el
}

/** 显示吸附线（只画可见视口，线宽/虚线间距按视口缩放折算为恒定屏幕像素） */
export function showSnapLines(snap: SnapResult, scale: number): void {
  const stage = snapV?.getStage() ?? snapH?.getStage()
  if (!stage) return
  const world = visibleWorldRect(
    {
      x: stage.x(),
      y: stage.y(),
      width: stage.width(),
      height: stage.height(),
      scaleX: stage.scaleX() || 1,
      scaleY: stage.scaleY() || 1,
    },
    SNAP_PAD,
  )
  const key = `${snap.v?.x ?? ''}:${snap.h?.y ?? ''}:${world.x}:${world.y}:${world.w}:${world.h}:${scale}`
  if (key === snapDrawKey) return
  snapDrawKey = key

  const dash = [4 / scale, 3 / scale]
  if (snapV) {
    if (snap.v) {
      snapV.points(clippedSnapLinePoints('v', snap.v.x, world))
      snapV.strokeWidth(1 / scale)
      snapV.dash(dash)
      snapV.visible(true)
    } else {
      snapV.visible(false)
    }
  }
  if (snapH) {
    if (snap.h) {
      snapH.points(clippedSnapLinePoints('h', snap.h.y, world))
      snapH.strokeWidth(1 / scale)
      snapH.dash(dash)
      snapH.visible(true)
    } else {
      snapH.visible(false)
    }
  }
  snapV?.getLayer()?.batchDraw()
}

export function clearSnapLines(): void {
  snapDrawKey = ''
  snapV?.visible(false)
  snapH?.visible(false)
  snapV?.getLayer()?.batchDraw()
}

/** 显示坐标 tip（screenX/Y 为相对画布容器的像素坐标） */
export function showTip(screenX: number, screenY: number, text: string): void {
  if (!tipEl) return
  tipEl.textContent = text
  tipEl.style.display = 'block'
  tipEl.style.left = `${Math.round(screenX) + 14}px`
  tipEl.style.top = `${Math.round(screenY) + 14}px`
}

export function hideTip(): void {
  if (tipEl) tipEl.style.display = 'none'
}

// ═══════════════════════════════════════════
// 32×32 半透明圆（半径 15，#833，alpha 0.3）
// ═══════════════════════════════════════════
let previewNode: Konva.Circle | null = null

export function registerEndpointPreview(node: Konva.Circle | null): void {
  previewNode = node
}

/** 在吸附锚点处显示大圆预览（世界坐标） */
export function showEndpointPreview(x: number, y: number, scale: number): void {
  if (!previewNode) return
  previewNode.position({ x, y })
  previewNode.radius(15 / scale)
  previewNode.strokeWidth(1 / scale)
  previewNode.visible(true)
  previewNode.getLayer()?.batchDraw()
}

export function hideEndpointPreview(): void {
  if (!previewNode) return
  previewNode.visible(false)
  previewNode.getLayer()?.batchDraw()
}
