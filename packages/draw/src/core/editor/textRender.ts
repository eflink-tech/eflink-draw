/** 将文字坐标对齐到视口像素网格，减轻 Canvas 文字亚像素发糊 */
export function snapTextCoord(local: number, viewportScale: number): number {
  if (viewportScale <= 0) return local
  return Math.round(local * viewportScale) / viewportScale
}

/** Konva Text 通用属性：关闭 perfect draw，避免透明/描边叠加导致文字偏粗 */
export const KONVA_TEXT_PROPS = {
  perfectDrawEnabled: false,
  listening: false,
} as const
