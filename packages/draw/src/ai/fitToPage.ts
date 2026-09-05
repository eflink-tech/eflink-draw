// src/ai/fitToPage.ts
import type { DocumentData, PageConfig } from '@/types'
import { isLinker } from '@/types'

/** 归位结果：整体平移量 + 需要扩页时的 page 尺寸补丁 */
export interface FitToPageResult {
  dx: number
  dy: number
  pagePatch: Partial<Pick<PageConfig, 'width' | 'height'>>
}

/** 内容与页面边缘的最小留白（扩页时按此留白放大页面） */
export const FIT_PAGE_MARGIN = 60

/** 平移量小于该阈值视为无需移动，避免浮点噪声产生无谓的历史记录 */
const MOVE_EPSILON = 1

/**
 * 计算 AI 新增内容（元素 + 连线）的画布归位方案：
 * 1. 包围盒 = 新增元素矩形 ∪ 新增连线的端点/折点
 * 2. 内容尺寸 + 2×margin 超出页面时扩页（页面只增不减）
 * 3. 以（扩页后的）页面中心为目标整体平移，保持 1:1 仿摆位的相对位置
 *
 * 纯函数不落库，由调用方用 moveElements / updatePage 应用。
 */
export function computeFitToPage(
  document: DocumentData,
  addedIds: string[],
  margin: number = FIT_PAGE_MARGIN,
): FitToPageResult {
  const added = addedIds
    .map((id) => document.elements[id])
    .filter((el): el is NonNullable<typeof el> => el != null)
  if (added.length === 0) return { dx: 0, dy: 0, pagePatch: {} }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const el of added) {
    if (isLinker(el)) {
      for (const p of [el.from, el.to, ...el.points]) {
        minX = Math.min(minX, p.x)
        minY = Math.min(minY, p.y)
        maxX = Math.max(maxX, p.x)
        maxY = Math.max(maxY, p.y)
      }
    } else {
      minX = Math.min(minX, el.props.x)
      minY = Math.min(minY, el.props.y)
      maxX = Math.max(maxX, el.props.x + el.props.w)
      maxY = Math.max(maxY, el.props.y + el.props.h)
    }
  }

  const bboxW = maxX - minX
  const bboxH = maxY - minY
  const page = document.page

  // 页面只增不减：内容 + 留白超出时扩大到能容纳
  const targetW = Math.max(page.width, Math.ceil(bboxW + margin * 2))
  const targetH = Math.max(page.height, Math.ceil(bboxH + margin * 2))

  // 按目标页中心整体平移（取整避免亚像素坐标）
  const rawDx = targetW / 2 - (minX + bboxW / 2)
  const rawDy = targetH / 2 - (minY + bboxH / 2)
  const dx = Math.abs(rawDx) < MOVE_EPSILON ? 0 : Math.round(rawDx)
  const dy = Math.abs(rawDy) < MOVE_EPSILON ? 0 : Math.round(rawDy)

  const pagePatch: Partial<Pick<PageConfig, 'width' | 'height'>> = {}
  if (targetW > page.width) pagePatch.width = targetW
  if (targetH > page.height) pagePatch.height = targetH

  return { dx, dy, pagePatch }
}
