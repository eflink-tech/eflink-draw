// 形状缩略图绘制（面板项 / 拖拽 ghost 共用）
// size×size 画布（宽度或高度超出时按比例缩到 size - lineWidth*2，居中放置）。
import { shapeRegistry } from '@/core/schema/registry'
import { executePathAction, getPathActions, parsePathSegment } from '@/core/utils/pathActions'
import { DEFAULT_LINE_WIDTH } from '@/types'

/**
 * 把图形 Schema 绘制到 canvas（等比缩放居中，白底 + 描边）
 * @param canvas 目标画布（尺寸将被设为 size×size，含 dpr 放大）
 * @returns 是否绘制成功（Schema 不存在时 false）
 */
export function drawShapeThumb(canvas: HTMLCanvasElement, name: string, size: number): boolean {
  const schema = shapeRegistry.getShape(name)
  const ctx = canvas.getContext('2d')
  if (!schema || !ctx) return false

  // 高分屏按 dpr 放大绘制，避免预览发虚
  const dpr = window.devicePixelRatio || 1
  canvas.width = size * dpr
  canvas.height = size * dpr

  const lineWidth = schema.lineStyle?.lineWidth ?? DEFAULT_LINE_WIDTH
  let w = schema.props?.w ?? 120
  let h = schema.props?.h ?? 80
  // 文本 / 左右备注：面板图标用方形格子，避免窄长比例下细节变形
  const isSquarePanelIcon =
    schema.name === 'text' || schema.name === 'rightBrace' || schema.name === 'leftBrace'
  if (isSquarePanelIcon) {
    const box = size - Math.max(lineWidth * 2, 3)
    w = box
    h = box
  } else if (w >= size || h >= size) {
    if (w >= h) {
      const nw = size - lineWidth * 2
      h = Math.round((h / w) * nw)
      w = nw
    } else {
      const nh = size - lineWidth * 2
      w = Math.round((w / h) * nh)
      h = nh
    }
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, size, size)
  ctx.translate((size - w) / 2, (size - h) / 2)
  ctx.lineJoin = 'round'
  const strokeStyle = `rgb(${schema.lineStyle?.lineColor ?? '50,50,50'})`

  // 文本图形：衬线体「T」（对齐常见流程图工具面板样式）
  if (schema.name === 'text') {
    const fontSize = Math.max(10, Math.round(h * 0.78))
    ctx.fillStyle = strokeStyle
    ctx.font = `700 ${fontSize}px "Times New Roman", Georgia, Times, serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('T', w / 2, h / 2)
    return true
  }

  const dims = { w, h }
  const paths = schema.drawIcon?.(w, h) ?? schema.path ?? []
  const iconFill = schema.drawIcon != null && schema.fillStyle?.type === 'none'
  for (const subPath of paths) {
    const segment = parsePathSegment(subPath)
    const subLineWidth = segment.lineStyle?.lineWidth ?? lineWidth
    const subFillStyle = segment.fillStyle?.type != null
      ? { type: segment.fillStyle.type, color: segment.fillStyle.color }
      : schema.fillStyle
    // 面板图标填充策略：
    // 1. drawIcon + fillStyle='none'（泳道等）→ 用深色填充头部
    // 2. schema 有明确的 solid 填充（开始/同步等深色图形）→ 用 schema 的填充色
    // 3. 其余（有描边的普通图形）→ 填充白色，让描边可见
    const schemaFill = schema.fillStyle
    const hasSchemaSolidFill = schemaFill?.type === 'solid'

    ctx.beginPath()
    for (const action of getPathActions(subPath)) {
      executePathAction(ctx, action, dims)
    }
    // 开放路径（如大括号）不做 fill，否则起终点直连会糊成实心条
    if (iconFill && getPathActions(subPath).some((a) => a.action === 'close')) {
      ctx.fillStyle = strokeStyle
      ctx.fill()
    } else if (hasSchemaSolidFill && subFillStyle?.type !== 'none') {
      ctx.fillStyle = `rgb(${schemaFill.color})`
      ctx.fill()
    } else if (!iconFill && !hasSchemaSolidFill && subFillStyle?.type !== 'none') {
      ctx.fillStyle = 'rgb(255,255,255)'
      ctx.fill()
    }
    if (subLineWidth > 0) {
      ctx.strokeStyle = strokeStyle
      ctx.lineWidth = subLineWidth
      const dash = segment.lineStyle?.lineStyle
      if (dash === 'dashed') ctx.setLineDash([6, 4])
      else if (dash === 'dot') ctx.setLineDash([2, 3])
      else ctx.setLineDash([])
      ctx.stroke()
      ctx.setLineDash([])
    }
  }
  return true
}
