// 连线绘制例程（LinkerRenderer 与 LinkerDraftView 共用）
//   normal: S=12, ac=π/5, 仅描边 V 形
//   solidArrow/dashedArrow: S=12, ac=π/10, 实心/空心三角
//   solidDiamond/dashedDiamond: S=8, ac=π/7, 实心/空心菱形（四顶点）
//   solidCircle/dashedCircle: r=4, 实心/空心圆
//   cross: H=6, P=14, 垂直线段
//   附着端点沿"驶入角"反向外移（边框一半 + 按箭头样式的附加量），
//   使线条/箭头不扎进图形边框。
import type { ArrowStyle, LinkerInstance, LinkerDraft } from '@/types'
import { measureDistance, type Point } from './linker'

/** 箭头尺寸（世界坐标） */
const ARROW_SIZE = 12
/** 菱形箭头尺寸 */
const DIAMOND_SIZE = 8
/** 圆点箭头半径 */
const CIRCLE_RADIUS = 4
/** 十字箭头半宽 */
const CROSS_HALF = 6
/** 十字箭头纵深 */
const CROSS_DEPTH = 14

export interface StrokeOptions {
  color: string
  lineWidth: number
  dash: 'solid' | 'dashed' | 'dot' | 'dotdash'
  /** 查询端点所属图形的边框宽度（端点补偿用）；不传则不补偿 */
  getShapeBorder?: (id: string) => number
  /**
   * 选中光晕：沿同路径、共用同一 dash 数组的加宽半透明描边，
   * 画在原线之下 —— 原线保持自身颜色与宽度，仅两侧露出蓝色边带
   */
  halo?: { color: string; extraWidth: number } | null
}

type LinkerLike = LinkerInstance | LinkerDraft
type Ctx = CanvasRenderingContext2D

/**
 * 端点外移量（负值 = 沿驶入角反向，即向形外）
 */
export function endpointInset(
  arrowStyle: ArrowStyle | undefined,
  shapeBorderWidth: number,
  linkerLineWidth: number,
): number {
  if (arrowStyle === 'none' || arrowStyle === 'cross') {
    return -shapeBorderWidth / 2
  }
  if (
    arrowStyle === 'solidArrow' || arrowStyle === 'dashedArrow'
    || arrowStyle === 'normal'
  ) {
    return -shapeBorderWidth / 2 - linkerLineWidth * 1.3
  }
  if (arrowStyle === 'solidDiamond' || arrowStyle === 'dashedDiamond') {
    return -shapeBorderWidth / 2 - linkerLineWidth
  }
  if (arrowStyle === 'solidCircle' || arrowStyle === 'dashedCircle') {
    return -shapeBorderWidth / 2 - linkerLineWidth * 0.5
  }
  return -shapeBorderWidth / 2 - linkerLineWidth / 2
}

export function applyEndpointInset(p: Point, travelAngle: number, inset: number): Point {
  return {
    x: p.x + inset * Math.cos(travelAngle),
    y: p.y + inset * Math.sin(travelAngle),
  }
}

/** 描出连线路径（不 stroke） */
export function traceLinkerPath(ctx: Ctx, l: LinkerLike): void {
  ctx.beginPath()
  ctx.moveTo(l.from.x, l.from.y)
  if (l.linkerType === 'curve' && l.points.length >= 2) {
    ctx.bezierCurveTo(
      l.points[0].x,
      l.points[0].y,
      l.points[1].x,
      l.points[1].y,
      l.to.x,
      l.to.y,
    )
  } else {
    for (const p of l.points) {
      ctx.lineTo(p.x, p.y)
    }
    ctx.lineTo(l.to.x, l.to.y)
  }
}

function pathDirections(l: LinkerLike): { begin: number; end: number } {
  const pts: Point[] = [l.from, ...l.points, l.to]
  const next = pts[1] ?? l.to
  const prev = pts[pts.length - 2] ?? l.from
  return {
    begin: Math.atan2(next.y - l.from.y, next.x - l.from.x),
    end: Math.atan2(l.to.y - prev.y, l.to.x - prev.x),
  }
}

// ─── 9 种箭头绘制函数 ───

/** 三角箭头（solidArrow 填充线色，dashedArrow 填充白色） */
function drawArrowTriangle(
  ctx: Ctx, p: Point, rot: number, color: string, fillColor: string,
): void {
  const ac = Math.PI / 10
  const V = ARROW_SIZE / Math.cos(ac)
  const c = Math.cos(rot)
  const s = Math.sin(rot)
  const bx = -V * Math.cos(ac)
  const by = V * Math.sin(ac)
  ctx.beginPath()
  ctx.moveTo(p.x, p.y)
  ctx.lineTo(p.x + bx * c - by * s, p.y + bx * s + by * c)
  ctx.lineTo(p.x + bx * c + by * s, p.y + bx * s - by * c)
  ctx.closePath()
  ctx.fillStyle = fillColor
  ctx.fill()
  ctx.strokeStyle = color
  ctx.stroke()
}

/** 开口 V 形箭头（normal，仅描边两条边，ac=π/5） */
function drawOpenArrow(ctx: Ctx, p: Point, rot: number, color: string): void {
  const ac = Math.PI / 5
  const V = ARROW_SIZE / Math.cos(ac)
  const c = Math.cos(rot)
  const s = Math.sin(rot)
  const bx = -V * Math.cos(ac)
  const by = V * Math.sin(ac)
  ctx.beginPath()
  ctx.moveTo(p.x + bx * c - by * s, p.y + bx * s + by * c)
  ctx.lineTo(p.x, p.y)
  ctx.lineTo(p.x + bx * c + by * s, p.y + bx * s - by * c)
  ctx.strokeStyle = color
  ctx.stroke()
}

/** 菱形箭头（solidDiamond 填充线色，dashedDiamond 填充白色） */
function drawArrowDiamond(
  ctx: Ctx, p: Point, rot: number, color: string, fillColor: string,
): void {
  const ac = Math.PI / 7
  const V = DIAMOND_SIZE / Math.cos(ac)
  const c = Math.cos(rot)
  const s = Math.sin(rot)
  // 两侧底角
  const bx = -V * Math.cos(ac)
  const by = V * Math.sin(ac)
  // 菱形远端顶点（沿 -rot 方向延伸 2*S）
  const tx = -DIAMOND_SIZE * 2 * c
  const ty = -DIAMOND_SIZE * 2 * s
  ctx.beginPath()
  ctx.moveTo(p.x, p.y)
  ctx.lineTo(p.x + bx * c - by * s, p.y + bx * s + by * c)
  ctx.lineTo(p.x + tx, p.y + ty)
  ctx.lineTo(p.x + bx * c + by * s, p.y + bx * s - by * c)
  ctx.closePath()
  ctx.fillStyle = fillColor
  ctx.fill()
  ctx.strokeStyle = color
  ctx.stroke()
}

/** 圆点箭头（solidCircle 填充线色，dashedCircle 填充白色） */
function drawArrowCircle(
  ctx: Ctx, p: Point, rot: number, color: string, fillColor: string,
): void {
  const cx = p.x - CIRCLE_RADIUS * Math.cos(rot)
  const cy = p.y - CIRCLE_RADIUS * Math.sin(rot)
  ctx.beginPath()
  ctx.arc(cx, cy, CIRCLE_RADIUS, 0, Math.PI * 2, false)
  ctx.closePath()
  ctx.fillStyle = fillColor
  ctx.fill()
  ctx.strokeStyle = color
  ctx.stroke()
}

/** 十字箭头（cross，垂直于路径方向的线段） */
function drawCross(ctx: Ctx, p: Point, rot: number, color: string): void {
  // 垂直方向 = rot + π/2
  const perp = rot + Math.PI / 2
  const dx = CROSS_HALF * Math.cos(perp)
  const dy = CROSS_HALF * Math.sin(perp)
  // 十字中心沿 -rot 方向偏移 CROSS_DEPTH
  const cx = p.x - CROSS_DEPTH * Math.cos(rot)
  const cy = p.y - CROSS_DEPTH * Math.sin(rot)
  ctx.beginPath()
  ctx.moveTo(cx + dx, cy + dy)
  ctx.lineTo(cx - dx, cy - dy)
  ctx.strokeStyle = color
  ctx.stroke()
}

/** 根据箭头样式分发绘制 */
function drawArrowShape(
  ctx: Ctx,
  p: Point,
  rot: number,
  color: string,
  style: ArrowStyle,
): void {
  const hollow = style === 'dashedArrow' || style === 'dashedDiamond' || style === 'dashedCircle'
  const fillColor = hollow ? '#ffffff' : color

  switch (style) {
    case 'solidArrow':
    case 'dashedArrow':
      drawArrowTriangle(ctx, p, rot, color, fillColor)
      break
    case 'normal':
      drawOpenArrow(ctx, p, rot, color)
      break
    case 'solidDiamond':
    case 'dashedDiamond':
      drawArrowDiamond(ctx, p, rot, color, fillColor)
      break
    case 'solidCircle':
    case 'dashedCircle':
      drawArrowCircle(ctx, p, rot, color, fillColor)
      break
    case 'cross':
      drawCross(ctx, p, rot, color)
      break
    default:
      break
  }
}

/** 完整绘制一条连线：路径 + 虚线样式 + 两端箭头（附着端点含外移补偿） */
export function strokeLinkerScene(ctx: Ctx, l: LinkerLike, opts: StrokeOptions): void {
  const dirs = pathDirections(l)
  // begin 是驶离方向，驶入 from 的角度 = begin + π
  const insetOf = (ep: Point & { id: string | null }, travel: number, arrow: ArrowStyle | undefined) => {
    if (ep.id == null || !opts.getShapeBorder) return null
    const inset = endpointInset(arrow, opts.getShapeBorder(ep.id), opts.lineWidth)
    return applyEndpointInset(ep, travel, inset)
  }
  const fromAdj =
    insetOf(l.from, dirs.begin + Math.PI, l.lineStyle.beginArrowStyle) ?? l.from
  const toAdj = insetOf(l.to, dirs.end, l.lineStyle.endArrowStyle) ?? l.to
  const adj = { ...l, from: fromAdj, to: toAdj } as LinkerLike

  traceLinkerPath(ctx, adj)
  const dashArray =
    opts.dash === 'dashed'
      ? [opts.lineWidth * 5, opts.lineWidth * 2]
      : opts.dash === 'dot'
        ? [opts.lineWidth, opts.lineWidth * 1.5]
        : opts.dash === 'dotdash'
          ? [opts.lineWidth, opts.lineWidth * 1.5, opts.lineWidth * 5, opts.lineWidth * 2]
          : []
  if (opts.halo) {
    ctx.save()
    ctx.strokeStyle = opts.halo.color
    ctx.lineWidth = opts.lineWidth + opts.halo.extraWidth
    // 圆角连接：折线拐角处光晕平滑不断裂
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.setLineDash(dashArray)
    ctx.stroke()
    ctx.restore()
  }
  ctx.strokeStyle = opts.color
  ctx.lineWidth = opts.lineWidth
  ctx.setLineDash(dashArray)
  ctx.stroke()
  ctx.setLineDash([])

  const { begin, end } = pathDirections(adj)
  const beginStyle = l.lineStyle.beginArrowStyle
  const endStyle = l.lineStyle.endArrowStyle
  if (endStyle != null && endStyle !== 'none') {
    drawArrowShape(ctx, adj.to, end, opts.color, endStyle)
  }
  if (beginStyle != null && beginStyle !== 'none') {
    // 起点箭头背向路径行进方向
    drawArrowShape(ctx, adj.from, begin + Math.PI, opts.color, beginStyle)
  }
}

/**
 * - curve：贝塞尔 t=0.5（权重 0.125/0.375/0.375/0.125）
 * - 其余（line/broken）：沿 [from, ...points, to] 累计长度取半程点
 */
export function getLinkerMidpoint(l: LinkerLike): Point {
  if (l.linkerType === 'curve' && l.points.length >= 2) {
    const p0 = l.from
    const p1 = l.points[0]
    const p2 = l.points[1]
    const p3 = l.to
    return {
      x: 0.125 * p0.x + 0.375 * p1.x + 0.375 * p2.x + 0.125 * p3.x,
      y: 0.125 * p0.y + 0.375 * p1.y + 0.375 * p2.y + 0.125 * p3.y,
    }
  }
  const pts: Point[] = [l.from, ...l.points, l.to]
  let total = 0
  for (let i = 1; i < pts.length; i++) total += measureDistance(pts[i - 1], pts[i])
  let remain = total / 2
  for (let i = 1; i < pts.length; i++) {
    const seg = measureDistance(pts[i - 1], pts[i])
    if (remain <= seg || i === pts.length - 1) {
      const t = seg > 0 ? remain / seg : 0
      return {
        x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t,
        y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t,
      }
    }
    remain -= seg
  }
  // TS 控制流所需兜底：末段条件必返回，此处不可达
  return { x: l.to.x, y: l.to.y }
}
