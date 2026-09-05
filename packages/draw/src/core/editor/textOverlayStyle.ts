// 图形/连线文字 HTML 覆盖层与 Konva Text 共用的样式与布局工具
import type { CSSProperties } from 'react'
import type { ElementInstance, FontStyle } from '@/types'
import { rgbToCSS, DEFAULT_FONT_SIZE, TEXT_LINE_HEIGHT } from '@/types'
import { fontFamilyCSS } from '@/core/editor/fontMap'
import { evalTextBlockRect } from '@/core/editor/textEdit'

/** fontStyle → 与 TextEditorOverlay / Konva Text 对齐的 CSS */
export function buildFontStyleCSS(font: FontStyle, fontSize?: number): CSSProperties {
  const size = fontSize ?? font.size ?? DEFAULT_FONT_SIZE
  const lineHeight = size * TEXT_LINE_HEIGHT
  return {
    fontFamily: fontFamilyCSS(font.fontFamily),
    fontSize: `${size}px`,
    lineHeight: `${lineHeight}px`,
    fontWeight: font.bold ? 'bold' : 'normal',
    fontStyle: font.italic ? 'italic' : 'normal',
    textDecoration: font.underline ? 'underline' : 'none',
    textAlign: font.textAlign ?? 'center',
    color: rgbToCSS(font.color ?? '50,50,50'),
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    ...(font.orientation === 'vertical' ? { writingMode: 'vertical-rl' as CSSProperties['writingMode'] } : {}),
  }
}

export interface TextBlockScreenLayout {
  screenX: number
  screenY: number
  worldW: number
  worldH: number
  rotDeg: number
  font: FontStyle
  text: string
}

/** 图形 textBlock 在屏幕上的锚点与尺寸（与 TextEditorOverlay 一致） */
export function layoutShapeTextBlock(
  el: ElementInstance,
  blockIndex: number,
  toScreen: (x: number, y: number) => { x: number; y: number },
): TextBlockScreenLayout | null {
  const tb = el.textBlock[blockIndex]
  if (!tb) return null
  const { x, y, w, h, angle } = el.props
  const blockRect = evalTextBlockRect(tb, w, h)
  const anchorX = x + blockRect.x + blockRect.w / 2
  const anchorY = y + blockRect.y + blockRect.h / 2
  const screen = toScreen(anchorX, anchorY)
  const blockFont = { ...el.fontStyle, ...tb.fontStyle }
  return {
    screenX: screen.x,
    screenY: screen.y,
    worldW: blockRect.w,
    worldH: blockRect.h,
    rotDeg: (angle * 180) / Math.PI,
    font: blockFont,
    text: tb.text || '',
  }
}

/** flex 对齐：模拟 Konva verticalAlign + align */
export function textFlexAlign(font: FontStyle): Pick<CSSProperties, 'alignItems' | 'justifyContent'> {
  const vAlign = font.vAlign ?? 'middle'
  const textAlign = font.textAlign ?? 'center'
  return {
    alignItems: vAlign === 'top' ? 'flex-start' : vAlign === 'bottom' ? 'flex-end' : 'center',
    justifyContent:
      textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center',
  }
}
