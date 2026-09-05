// 文字编辑定位与命中
// textBlock position 表达式求值 + 双击点反旋命中（pointInRect）。
import type { ElementInstance, TextBlock } from '@/types'
import { evaluateExpression } from '@/core/utils/expression'
import { worldToLocalPoint } from './interaction'

/** textBlock 块矩形（相对图形左上角；w/h 为图形实际尺寸时的求值结果） */
export interface BlockRect {
  x: number
  y: number
  w: number
  h: number
}

/** 求值 textBlock 的 position 表达式 */
export function evalTextBlockRect(tb: TextBlock, w: number, h: number): BlockRect {
  return {
    x: evaluateExpression(tb.position.x, { w, h }),
    y: evaluateExpression(tb.position.y, { w, h }),
    w: evaluateExpression(tb.position.w, { w, h }),
    h: evaluateExpression(tb.position.h, { w, h }),
  }
}

function pointInBlockRect(local: { x: number; y: number }, r: BlockRect): boolean {
  return local.x >= r.x && local.x <= r.x + r.w && local.y >= r.y && local.y <= r.y + r.h
}

/** 多块图形：分隔线间隙等未精确命中时，选距块中心最近的块 */
function nearestTextBlockIndex(el: ElementInstance, local: { x: number; y: number }): number {
  let best = 0
  let bestDist = Infinity
  for (let i = 0; i < el.textBlock!.length; i++) {
    const r = evalTextBlockRect(el.textBlock![i]!, el.props.w, el.props.h)
    const cx = r.x + r.w / 2
    const cy = r.y + r.h / 2
    const dist = (local.x - cx) ** 2 + (local.y - cy) ** 2
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  }
  return best
}

/**
 * 命中双击点的 textBlock 下标（worldToLocalPoint 含绕中心旋转反算）
 * - 单块图形未命中块矩形时返回 0（块几乎铺满全域，双击边缘也应进入编辑）
 * - 多块图形未精确命中时返回最近块（避免编排任务等总是落到块 0）
 * - 无 textBlock 返回 -1（不进入编辑）
 */
export function hitTextBlock(el: ElementInstance, wx: number, wy: number): number {
  if (!el.textBlock || el.textBlock.length === 0) return -1
  const local = worldToLocalPoint(el, wx, wy)
  if (!local) return -1
  for (let i = 0; i < el.textBlock.length; i++) {
    const r = evalTextBlockRect(el.textBlock[i]!, el.props.w, el.props.h)
    if (pointInBlockRect(local, r)) return i
  }
  if (el.textBlock.length > 1) return nearestTextBlockIndex(el, local)
  return 0
}
