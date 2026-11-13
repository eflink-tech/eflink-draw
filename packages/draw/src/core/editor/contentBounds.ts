// 文档内容外接框：只读预览/图片导出裁剪用（纯函数）
import { isLinker, type DocumentData, type ElementInstance } from '@/types'
import { getContentWorldBounds } from '@/core/editor/viewportBounds'

/** 外接框四周留白（世界坐标）：容纳连线文字标签等贴边内容 */
export const CONTENT_MARGIN = 12

export interface ContentBounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

/** 图形旋转后的世界包围盒（只看左上角+宽高会裁掉旋转伸出的角） */
export function rotatedRectBounds(el: ElementInstance): ContentBounds {
  const { x, y, w, h, angle } = el.props
  if (!angle) return { minX: x, minY: y, maxX: x + w, maxY: y + h }
  const cx = x + w / 2
  const cy = y + h / 2
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const [dx, dy] of [
    [-w / 2, -h / 2],
    [w / 2, -h / 2],
    [w / 2, h / 2],
    [-w / 2, h / 2],
  ] as const) {
    const px = cx + dx * cos - dy * sin
    const py = cy + dx * sin + dy * cos
    minX = Math.min(minX, px)
    minY = Math.min(minY, py)
    maxX = Math.max(maxX, px)
    maxY = Math.max(maxY, py)
  }
  return { minX, minY, maxX, maxY }
}

/** 整份文档的内容外接框（含旋转图形与连线折点）；无元素返回 null */
export function computeContentBounds(document: DocumentData): ContentBounds | null {
  const shapes = Object.values(document.elements).filter(
    (el): el is ElementInstance => !isLinker(el),
  )
  const hasLinker = Object.values(document.elements).some(isLinker)
  if (shapes.length === 0 && !hasLinker) return null
  const base = getContentWorldBounds(document.elements)
  let { minX, minY, maxX, maxY } = base
  for (const el of shapes) {
    const b = rotatedRectBounds(el)
    minX = Math.min(minX, b.minX)
    minY = Math.min(minY, b.minY)
    maxX = Math.max(maxX, b.maxX)
    maxY = Math.max(maxY, b.maxY)
  }
  return {
    minX: minX - CONTENT_MARGIN,
    minY: minY - CONTENT_MARGIN,
    maxX: maxX + CONTENT_MARGIN,
    maxY: maxY + CONTENT_MARGIN,
  }
}
