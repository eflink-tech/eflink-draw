// 形状缩略图绘制（面板项 / 拖拽 ghost 共用）
// size×size 画布（宽度或高度超出时按比例缩到 size - lineWidth*2，居中放置）。
import { shapeRegistry } from '@/core/schema/registry'
import { executePathAction, getPathActions, parsePathSegment, traceActions } from '@/core/utils/pathActions'
import { evaluateExpression } from '@/core/utils/expression'
import { DEFAULT_LINE_WIDTH, type PathDefinition, type ShapeDefinition } from '@/types'

/**
 * 把图形 Schema 绘制到 canvas（等比缩放居中，白底 + 描边）
 * @param canvas 目标画布（尺寸将被设为 size×size，含 dpr 放大）
 * @returns 是否绘制成功（Schema 不存在时 false）
 */
/** 面板缩略图布局：图形绘制尺寸 + 画布内偏移（墨迹居中） */
export interface ThumbLayout {
  w: number
  h: number
  offsetX: number
  offsetY: number
}

const SQUARE_PANEL_ICONS = new Set([
  'text',
  'rightBrace',
  'leftBrace',
  // 生命线类：真实高宽比极端（70×300），方形格内用专属 drawIcon 绘制才能看清
  'sequenceLifeLine',
  'sequenceActorLifeLine',
])

/**
 * 计算面板缩略图布局：按墨迹（实际绘制范围）等比缩放并居中。
 * 名义包围盒与实际绘制内容常不一致（曲线控制点/固定像素装饰/留白），
 * 按名义 w/h 缩放会导致图标大小不一、内容偏在一边甚至被裁。
 * 墨迹量测用「实际绘制源」（drawIcon 优先）并两轮迭代收敛。
 */
export function computeThumbLayout(
  schema: ShapeDefinition,
  size: number,
): ThumbLayout {
  const lineWidth = schema.lineStyle?.lineWidth ?? DEFAULT_LINE_WIDTH
  const avail = size - lineWidth * 2 - 1
  const w0 = schema.props?.w ?? 120
  const h0 = schema.props?.h ?? 80
  const isSquarePanelIcon = SQUARE_PANEL_ICONS.has(schema.name)

  // 方形格子：配专属 drawIcon 直接按格子绘制，按墨迹居中
  if (isSquarePanelIcon) {
    const box = size - Math.max(lineWidth * 2, 3)
    const ink = pathInkBounds(
      schema.drawIcon ? schema.drawIcon(box, box) : schema.path ?? [],
      box,
      box,
    )
    const cx = (ink.minX + ink.maxX) / 2 - box / 2
    const cy = (ink.minY + ink.maxY) / 2 - box / 2
    return { w: box, h: box, offsetX: (size - box) / 2 - cx, offsetY: (size - box) / 2 - cy }
  }

  // 通用图形：两轮迭代求缩放系数，使「该尺寸下的实际墨迹」恰好撑满可用区
  const src = (scale: number): PathDefinition[] =>
    schema.drawIcon ? schema.drawIcon(w0 * scale, h0 * scale) : schema.path ?? []
  let s = avail / Math.max(w0, h0)
  for (let i = 0; i < 2; i++) {
    const ink = pathInkBounds(src(s), w0 * s, h0 * s)
    const inkW = Math.max(ink.maxX - ink.minX, 0.5)
    const inkH = Math.max(ink.maxY - ink.minY, 0.5)
    s *= Math.min(avail / inkW, avail / inkH)
  }

  const w = w0 * s
  const h = h0 * s
  // 平移：绘制内容（该尺寸下量测）中心对齐格子中心
  const fin = pathInkBounds(src(s), w, h)
  const offsetX = (size - w) / 2 + (w / 2 - (fin.minX + fin.maxX) / 2)
  const offsetY = (size - h) / 2 + (h / 2 - (fin.minY + fin.maxY) / 2)
  return { w, h, offsetX, offsetY }
}

export function drawShapeThumb(canvas: HTMLCanvasElement, name: string, size: number): boolean {
  const schema = shapeRegistry.getShape(name)
  const ctx = canvas.getContext('2d')
  if (!schema || !ctx) return false

  // 高分屏按 dpr 放大绘制，避免预览发虚
  const dpr = window.devicePixelRatio || 1
  canvas.width = size * dpr
  canvas.height = size * dpr

  const lineWidth = schema.lineStyle?.lineWidth ?? DEFAULT_LINE_WIDTH
  const layout = computeThumbLayout(schema, size)
  const { w, h } = layout

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, size, size)
  ctx.translate(layout.offsetX, layout.offsetY)
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
    // 2. schema 有明确的 solid 填充（开始/同步等深色图形）→ 用 schema 的填充色；
    //    子路径显式指定 solid 色（如代码块顶栏）时优先用子路径色
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
      ctx.fillStyle = `rgb(${subFillStyle?.type === 'solid' && subFillStyle.color ? subFillStyle.color : schemaFill.color})`
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

/** 录制型 ctx：追踪一条路径的墨迹包围盒（表达式按 {w,h} 求值） */
export function pathInkBounds(
  path: PathDefinition[],
  w: number,
  h: number,
): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let lastX = 0
  let lastY = 0
  const push = (x: number, y: number): void => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
  }
  // 控制点在曲线外侧，计入会高估墨迹（图标被缩小）；改为采样曲线上的点（1/4、1/2、3/4）
  const pt = (x: unknown, y: unknown): void => {
    const px = typeof x === 'number' ? x : evaluateExpression(String(x), { w, h })
    const py = typeof y === 'number' ? y : evaluateExpression(String(y), { w, h })
    lastX = px
    lastY = py
    push(px, py)
  }
  const cubicSample = (
    x0: number, y0: number,
    cx1: number, cy1: number, cx2: number, cy2: number,
    x: number, y: number,
  ): void => {
    // 稠密采样：稀疏采样会低估曲线极值 → 缩放系数偏大 → 图标边缘被裁
    const N = 15
    for (let i = 1; i < N; i++) {
      const t = i / N
      const m = 1 - t
      push(
        m * m * m * x0 + 3 * m * m * t * cx1 + 3 * m * t * t * cx2 + t * t * t * x,
        m * m * m * y0 + 3 * m * m * t * cy1 + 3 * m * t * t * cy2 + t * t * t * y,
      )
    }
  }
  const ctx = {
    moveTo: pt,
    lineTo: pt,
    bezierCurveTo: (x1: unknown, y1: unknown, x2: unknown, y2: unknown, x: unknown, y: unknown): void => {
      cubicSample(lastX, lastY, Number(x1), Number(y1), Number(x2), Number(y2), Number(x), Number(y))
      pt(x, y)
    },
    quadraticCurveTo: (x1: unknown, y1: unknown, x: unknown, y: unknown): void => {
      const x0 = lastX
      const y0 = lastY
      const cx = typeof x1 === 'number' ? x1 : evaluateExpression(String(x1), { w, h })
      const cy = typeof y1 === 'number' ? y1 : evaluateExpression(String(y1), { w, h })
      const px = typeof x === 'number' ? x : evaluateExpression(String(x), { w, h })
      const py = typeof y === 'number' ? y : evaluateExpression(String(y), { w, h })
      // 稠密采样（顶点极值不漏）
      const N = 7
      for (let i = 1; i < N; i++) {
        const t = i / N
        const m = 1 - t
        push(m * m * x0 + 2 * m * t * cx + t * t * px, m * m * y0 + 2 * m * t * cy + t * t * py)
      }
      pt(px, py)
    },
    closePath: (): void => {},
  }
  traceActions(ctx as never, path, { w, h })
  return {
    minX: Number.isFinite(minX) ? minX : 0,
    minY: Number.isFinite(minY) ? minY : 0,
    maxX: Number.isFinite(maxX) ? maxX : w,
    maxY: Number.isFinite(maxY) ? maxY : h,
  }
}
