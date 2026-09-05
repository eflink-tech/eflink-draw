export type ResizeHandleDir = 'tl' | 'tr' | 'br' | 'bl' | 'tm' | 'bm' | 'ml' | 'mr'

export interface ResizeRect {
  x: number
  y: number
  w: number
  h: number
}

const MIN_SIZE = 20

/** 与 resize 起点对应的锚点（对角/对边，缩放时保持不动） */
function resizeAnchor(dir: ResizeHandleDir, initial: ResizeRect): { x: number; y: number } {
  const { x, y, w, h } = initial
  switch (dir) {
    case 'br':
      return { x, y }
    case 'tl':
      return { x: x + w, y: y + h }
    case 'tr':
      return { x, y: y + h }
    case 'bl':
      return { x: x + w, y }
    case 'mr':
      return { x, y: y + h / 2 }
    case 'ml':
      return { x: x + w, y: y + h / 2 }
    case 'bm':
      return { x: x + w / 2, y }
    case 'tm':
      return { x: x + w / 2, y: y + h }
  }
}

function rectFromAnchor(
  anchor: { x: number; y: number },
  dir: ResizeHandleDir,
  w: number,
  h: number,
): ResizeRect {
  switch (dir) {
    case 'br':
      return { x: anchor.x, y: anchor.y, w, h }
    case 'tl':
      return { x: anchor.x - w, y: anchor.y - h, w, h }
    case 'tr':
      return { x: anchor.x, y: anchor.y - h, w, h }
    case 'bl':
      return { x: anchor.x - w, y: anchor.y, w, h }
    case 'mr':
      return { x: anchor.x, y: anchor.y - h / 2, w, h }
    case 'ml':
      return { x: anchor.x - w, y: anchor.y - h / 2, w, h }
    case 'bm':
      return { x: anchor.x - w / 2, y: anchor.y, w, h }
    case 'tm':
      return { x: anchor.x - w / 2, y: anchor.y - h, w, h }
  }
}

function clampMinSize(w: number, h: number, minSize: number): { w: number; h: number } {
  return { w: Math.max(minSize, w), h: Math.max(minSize, h) }
}

function applyAspectRatio(
  free: ResizeRect,
  initial: ResizeRect,
  dir: ResizeHandleDir,
  minSize: number,
): ResizeRect {
  const ratio = initial.w / initial.h || 1
  let w = free.w
  let h = free.h

  const dw = Math.abs(w - initial.w) / initial.w
  const dh = Math.abs(h - initial.h) / initial.h
  if (dw >= dh) {
    h = w / ratio
  } else {
    w = h * ratio
  }

  if (w < minSize) {
    w = minSize
    h = w / ratio
  }
  if (h < minSize) {
    h = minSize
    w = h * ratio
  }

  return rectFromAnchor(resizeAnchor(dir, initial), dir, w, h)
}

/** 根据拖拽位移计算自由缩放后的矩形（不含等比例约束） */
export function computeFreeResizeRect(
  initial: ResizeRect,
  dx: number,
  dy: number,
  dir: ResizeHandleDir,
  minSize = MIN_SIZE,
): ResizeRect {
  let { x, y, w, h } = initial

  switch (dir) {
    case 'tl':
      x += dx
      y += dy
      w -= dx
      h -= dy
      break
    case 'tr':
      y += dy
      w += dx
      h -= dy
      break
    case 'bl':
      x += dx
      w -= dx
      h += dy
      break
    case 'br':
      w += dx
      h += dy
      break
    case 'tm':
      y += dy
      h -= dy
      break
    case 'bm':
      h += dy
      break
    case 'ml':
      x += dx
      w -= dx
      break
    case 'mr':
      w += dx
      break
  }

  const clamped = clampMinSize(w, h, minSize)
  return { x, y, w: clamped.w, h: clamped.h }
}

/**
 * 计算 resize 结果矩形。
 * keepRatio=true（Shift）时按初始宽高比缩放，锚点为对角/对边。
 */
export function computeResizeRect(
  initial: ResizeRect,
  dx: number,
  dy: number,
  dir: ResizeHandleDir,
  keepRatio: boolean,
  minSize = MIN_SIZE,
): ResizeRect {
  const free = computeFreeResizeRect(initial, dx, dy, dir, minSize)
  if (!keepRatio) return free
  return applyAspectRatio(free, initial, dir, minSize)
}
