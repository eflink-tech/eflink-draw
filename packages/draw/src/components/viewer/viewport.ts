// 查看器视口计算：适配比例、居中对齐、缩放锚点与平移边界（纯函数，便于单测）
export interface ViewerBounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export interface ViewerFrame {
  width: number
  height: number
  padding: number
}

export interface ViewerTransform {
  scale: number
  x: number
  y: number
}

const clampNum = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export function computeFitScale(bounds: ViewerBounds, frame: ViewerFrame, maxScale: number): number {
  const cw = Math.max(bounds.maxX - bounds.minX, 1)
  const ch = Math.max(bounds.maxY - bounds.minY, 1)
  const availW = Math.max(frame.width - frame.padding * 2, 1)
  const availH = Math.max(frame.height - frame.padding * 2, 1)
  return Math.max(0.02, Math.min(availW / cw, availH / ch, maxScale))
}

export function centerTransform(bounds: ViewerBounds, frame: ViewerFrame, scale: number): ViewerTransform {
  const cw = Math.max(bounds.maxX - bounds.minX, 1)
  const ch = Math.max(bounds.maxY - bounds.minY, 1)
  return {
    scale,
    x: (frame.width - cw * scale) / 2 - bounds.minX * scale,
    y: (frame.height - ch * scale) / 2 - bounds.minY * scale,
  }
}

export function fitTransform(bounds: ViewerBounds, frame: ViewerFrame, maxScale: number): ViewerTransform {
  return centerTransform(bounds, frame, computeFitScale(bounds, frame, maxScale))
}

/** 收敛缩放比例，并把内容限制在视口内：小于视口时居中，大于视口时边缘最多留 padding */
export function clampTransform(
  transform: ViewerTransform,
  bounds: ViewerBounds,
  frame: ViewerFrame,
  minScale: number,
  maxScale: number,
): ViewerTransform {
  const scale = clampNum(transform.scale, minScale, maxScale)
  const cw = Math.max(bounds.maxX - bounds.minX, 1)
  const ch = Math.max(bounds.maxY - bounds.minY, 1)
  const axis = (offset: number, viewport: number, content: number, min: number, max: number) => {
    if (content + frame.padding * 2 <= viewport) return (viewport - content) / 2 - min * scale
    return clampNum(offset, viewport - frame.padding - max * scale, frame.padding - min * scale)
  }
  return {
    scale,
    x: axis(transform.x, frame.width, cw * scale, bounds.minX, bounds.maxX),
    y: axis(transform.y, frame.height, ch * scale, bounds.minY, bounds.maxY),
  }
}

/** 以视口坐标 (pointer) 为锚点缩放：锚点下的画布内容保持不动 */
export function zoomTransformAt(
  transform: ViewerTransform,
  bounds: ViewerBounds,
  frame: ViewerFrame,
  pointer: { x: number; y: number },
  nextScale: number,
  minScale: number,
  maxScale: number,
): ViewerTransform {
  const scale = clampNum(nextScale, minScale, maxScale)
  const worldX = (pointer.x - transform.x) / transform.scale
  const worldY = (pointer.y - transform.y) / transform.scale
  return clampTransform(
    { scale, x: pointer.x - worldX * scale, y: pointer.y - worldY * scale },
    bounds,
    frame,
    minScale,
    maxScale,
  )
}
