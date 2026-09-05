// 图形主体 Canvas 2D 绘制（ElementRenderer 与创建预览共用）
import type Konva from 'konva'
import type { ElementInstance, LineStyle } from '@/types'
import { rgbToCSS } from '@/types'
import { executePathAction, getPathActions, parsePathSegment } from '@/core/utils/pathActions'

function applyLineDash(
  ctx: CanvasRenderingContext2D,
  style: LineStyle['lineStyle'] | undefined,
): void {
  if (style === 'dashed') ctx.setLineDash([8, 4])
  else if (style === 'dot') ctx.setLineDash([2, 3])
  else if (style === 'dotdash') ctx.setLineDash([2, 3, 8, 4])
  else ctx.setLineDash([])
}

/**
 * 绘制图形主体：路径 + 填充 + 描边（虚线样式）
 * 尺寸从 Konva Shape 实时读取 —— resize 直操期间无需重建
 */
export function makeShapeSceneFunc(element: ElementInstance) {
  const { path } = element
  const fillStyle = element.fillStyle ?? { type: 'solid', color: '255,255,255' }
  const lineStyle = element.lineStyle ?? { lineWidth: 2, lineColor: '50,50,50', lineStyle: 'solid' }

  return (context: unknown, shape: Konva.Shape): void => {
    const ctx = context as unknown as CanvasRenderingContext2D

    // 阴影：shadowEnabled 开启时设置 shadow 属性，否则重置为透明
    const ss = element.shapeStyle
    if (ss.shadowEnabled) {
      ctx.shadowColor = ss.shadowColor ? rgbToCSS(ss.shadowColor) : 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = ss.shadowBlur ?? 0
      ctx.shadowOffsetX = ss.shadowOffsetX ?? 0
      ctx.shadowOffsetY = ss.shadowOffsetY ?? 0
    } else {
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    }

    const dims = { w: shape.width(), h: shape.height() }
    for (const subPath of path) {
      const segment = parsePathSegment(subPath)
      const subFillStyle = segment.fillStyle
        ? { ...fillStyle, ...segment.fillStyle }
        : fillStyle
      const subLineStyle = { ...lineStyle, ...segment.lineStyle }

      ctx.beginPath()
      for (const action of getPathActions(subPath)) {
        executePathAction(ctx, action, dims)
      }
      if (subFillStyle.type === 'solid' && subFillStyle.color) {
        ctx.fillStyle = rgbToCSS(subFillStyle.color)
        ctx.fill()
      }
      if (subLineStyle.lineWidth && subLineStyle.lineWidth > 0) {
        ctx.strokeStyle = subLineStyle.lineColor ? rgbToCSS(subLineStyle.lineColor) : '#000'
        ctx.lineWidth = subLineStyle.lineWidth
        applyLineDash(ctx, subLineStyle.lineStyle)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }
  }
}
