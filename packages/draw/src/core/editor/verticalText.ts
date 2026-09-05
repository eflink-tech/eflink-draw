import { TEXT_LINE_HEIGHT } from '@/types'

interface VerticalLayoutOptions {
  w: number
  h: number
  fontSize: number
  align?: 'left' | 'center' | 'right'
  vAlign?: 'top' | 'middle' | 'bottom'
}

interface GlyphPos {
  x: number
  y: number
  text: string
}

/**
 * 竖排逐字布局（最小实现）：
 * - 全角字符从上到下、从右到左排列（首字在右上）
 * - 英文/数字不旋转，按原方向横排占位（简化：仍逐字竖排，不处理旋转）
 * - 行间距 = fontSize * TEXT_LINE_HEIGHT
 * - 不处理标点禁排、混合对齐（后续迭代）
 */
export function layoutVerticalText(text: string, opts: VerticalLayoutOptions): GlyphPos[] {
  const { w, h, fontSize, align = 'center', vAlign = 'middle' } = opts
  const lineHeight = fontSize * TEXT_LINE_HEIGHT
  const colWidth = fontSize * 1.1
  const maxRowsPerCol = Math.max(1, Math.floor(h / lineHeight))

  const cols: string[][] = []
  let col: string[] = []

  for (const ch of text) {
    if (ch === '\n') {
      cols.push(col)
      col = []
      continue
    }
    col.push(ch)
    if (col.length >= maxRowsPerCol) {
      cols.push(col)
      col = []
    }
  }
  if (col.length) cols.push(col)

  const totalCols = cols.length
  const totalWidth = totalCols * colWidth

  // 竖排从右到左：startX 表示首列（c=0）的右边缘
  const startX = align === 'left' ? totalWidth
                 : align === 'right' ? w
                 : (w + totalWidth) / 2

  const result: GlyphPos[] = []
  for (let c = 0; c < cols.length; c++) {
    const colChars = cols[c]!
    const colHeight = colChars.length * lineHeight
    const colTop = vAlign === 'bottom' ? h - colHeight : vAlign === 'top' ? 0 : (h - colHeight) / 2
    const colX = startX - (c + 1) * colWidth // c=0 在最右，c=1 在其左

    for (let r = 0; r < colChars.length; r++) {
      result.push({ x: colX, y: colTop + r * lineHeight, text: colChars[r]! })
    }
  }

  return result
}
