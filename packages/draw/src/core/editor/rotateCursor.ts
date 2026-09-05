let cached: string | null = null

function paintRotateArc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  lineWidth: number,
): void {
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const start = Math.PI
  const end = Math.PI / 2
  ctx.beginPath()
  ctx.arc(cx, cy, r, start, end, false)
  ctx.stroke()
  const arrow = (angle: number, clockwise: boolean): void => {
    const ax = cx + r * Math.cos(angle)
    const ay = cy + r * Math.sin(angle)
    const tangent = clockwise ? angle + Math.PI / 2 : angle - Math.PI / 2
    const len = r * 0.42
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(ax + len * Math.cos(tangent - 0.45), ay + len * Math.sin(tangent - 0.45))
    ctx.moveTo(ax, ay)
    ctx.lineTo(ax + len * Math.cos(tangent + 0.45), ay + len * Math.sin(tangent + 0.45))
    ctx.stroke()
  }
  arrow(start, true)
  arrow(end, false)
}

export function rotateCursor(): string {
  if (cached) return cached
  if (typeof document === 'undefined') return 'alias'

  const size = 32
  const hot = 16
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return 'alias'

  ctx.strokeStyle = '#000'
  paintRotateArc(ctx, hot, hot, 10, 2)
  cached = `url("${canvas.toDataURL()}") ${hot} ${hot}, alias`
  return cached
}
