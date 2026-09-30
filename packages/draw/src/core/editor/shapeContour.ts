// 图形轮廓几何：PathDefinition → 世界坐标线段序列 → 最近轮廓点求解
// 供「任意边点吸附」（snapLinkerEndpoint）与「边线拖出连线」（ElementRenderer）共用。
//
// 口径与 getAnchorPoints 一致：局部坐标（相对图形左上角，表达式按 w/h 求值）
// → 绕中心旋转（props.angle）→ 平移到 props.x/y。
// line 段做精确点到线段投影；curve/quadraticCurve 细分为 ~3px 折线段后同样投影。
// 缓存挂 WeakMap<ElementInstance>：store 不可变更新产生新对象引用即自动失效。
import type { ElementInstance, PathDefinition } from '@/types'
import { traceActions } from '@/core/utils/pathActions'
import { normAngle, type Point } from './linker'

/** 轮廓最近点（世界坐标） */
export interface ContourHit {
  x: number
  y: number
  /** 内向法线角：段法线取指向图形中心一侧；退化段回落"指向中心" */
  angle: number
  /** 查询点到该点的距离（世界坐标） */
  dist: number
}

/** 采样线段（世界坐标） */
interface Seg {
  x1: number
  y1: number
  x2: number
  y2: number
}

/** 曲线细分目标间隔（世界 px）：line 段精确投影，仅曲线需要离散化 */
const CURVE_STEP_PX = 3
/** 单条曲线细分区间数上限（防畸形控制点组合爆炸） */
const CURVE_MAX_SPLIT = 200

const segCache = new WeakMap<ElementInstance, { key: string; segs: Seg[] }>()

const dist = (ax: number, ay: number, bx: number, by: number): number =>
  Math.hypot(bx - ax, by - ay)

/** 三次贝塞尔细分为折线段（De Casteljau 求值） */
function splitCubic(
  p0: Point, p1: Point, p2: Point, p3: Point,
  push: (x1: number, y1: number, x2: number, y2: number) => void,
): void {
  const chord =
    dist(p0.x, p0.y, p1.x, p1.y) + dist(p1.x, p1.y, p2.x, p2.y) + dist(p2.x, p2.y, p3.x, p3.y)
  const n = Math.min(CURVE_MAX_SPLIT, Math.max(8, Math.ceil(chord / CURVE_STEP_PX)))
  let px = p0.x
  let py = p0.y
  for (let i = 1; i <= n; i++) {
    const t = i / n
    const mt = 1 - t
    const x =
      mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x
    const y =
      mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y
    push(px, py, x, y)
    px = x
    py = y
  }
}

/** 二次贝塞尔细分为折线段 */
function splitQuad(
  p0: Point, p1: Point, p2: Point,
  push: (x1: number, y1: number, x2: number, y2: number) => void,
): void {
  const chord = dist(p0.x, p0.y, p1.x, p1.y) + dist(p1.x, p1.y, p2.x, p2.y)
  const n = Math.min(CURVE_MAX_SPLIT, Math.max(8, Math.ceil(chord / CURVE_STEP_PX)))
  let px = p0.x
  let py = p0.y
  for (let i = 1; i <= n; i++) {
    const t = i / n
    const mt = 1 - t
    const x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x
    const y = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
    push(px, py, x, y)
    px = x
    py = y
  }
}

/** 采样局部线段（相对左上角，未旋转）；closePath 补 subpath 闭合段 */
function buildLocalSegments(path: PathDefinition[], w: number, h: number): Seg[] {
  const segs: Seg[] = []
  let cur: Point | null = null
  let subStart: Point | null = null
  traceActions(
    {
      moveTo: (x, y) => {
        cur = { x, y }
        subStart = { x, y }
      },
      lineTo: (x, y) => {
        if (cur) segs.push({ x1: cur.x, y1: cur.y, x2: x, y2: y })
        cur = { x, y }
      },
      bezierCurveTo: (cp1x, cp1y, cp2x, cp2y, x, y) => {
        if (cur) {
          splitCubic(
            { x: cur.x, y: cur.y }, { x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }, { x, y },
            (a, b, c, d) => segs.push({ x1: a, y1: b, x2: c, y2: d }),
          )
        }
        cur = { x, y }
      },
      quadraticCurveTo: (cpx, cpy, x, y) => {
        if (cur) {
          splitQuad(
            { x: cur.x, y: cur.y }, { x: cpx, y: cpy }, { x, y },
            (a, b, c, d) => segs.push({ x1: a, y1: b, x2: c, y2: d }),
          )
        }
        cur = { x, y }
      },
      closePath: () => {
        if (cur && subStart) {
          segs.push({ x1: cur.x, y1: cur.y, x2: subStart.x, y2: subStart.y })
        }
        cur = subStart
      },
    },
    path,
    { w, h },
  )
  return segs
}

/** 局部点 → 世界点（绕中心旋转 + 平移，与 getAnchorPoints 同口径） */
function toWorld(el: ElementInstance, p: Point): Point {
  const { x, y, w, h, angle } = el.props
  if (!angle) return { x: x + p.x, y: y + p.y }
  const cx = x + w / 2
  const cy = y + h / 2
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const dx = p.x - w / 2
  const dy = p.y - h / 2
  return { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos }
}

/** 图形的世界坐标线段序列（WeakMap 缓存，几何 key 复核） */
function getSegments(el: ElementInstance): Seg[] {
  const { x, y, w, h, angle } = el.props
  const key = `${x},${y},${w},${h},${angle}`
  const cached = segCache.get(el)
  if (cached && cached.key === key) return cached.segs
  const segs = buildLocalSegments(el.path, w, h).map((s) => {
    const a = toWorld(el, { x: s.x1, y: s.y1 })
    const b = toWorld(el, { x: s.x2, y: s.y2 })
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y }
  })
  segCache.set(el, { key, segs })
  return segs
}

/** 段内向法线角：两候选法线取指向中心一侧 */
function inwardNormalAngle(
  px: number, py: number, dx: number, dy: number, cx: number, cy: number,
): number {
  const l = Math.hypot(dx, dy)
  const n1x = -dy / l
  const n1y = dx / l
  const towardCenter = (cx - px) * n1x + (cy - py) * n1y
  return towardCenter >= 0
    ? normAngle(Math.atan2(n1y, n1x))
    : normAngle(Math.atan2(-n1y, -n1x))
}

/**
 * 求图形轮廓上距查询点最近的点（含距离与内向法线角）
 * @returns 空路径返回 null
 */
export function nearestContourPoint(
  el: ElementInstance,
  worldX: number,
  worldY: number,
): ContourHit | null {
  const segs = getSegments(el)
  if (segs.length === 0) return null
  const cx = el.props.x + el.props.w / 2
  const cy = el.props.y + el.props.h / 2
  let best: ContourHit | null = null
  for (const s of segs) {
    const dx = s.x2 - s.x1
    const dy = s.y2 - s.y1
    const len2 = dx * dx + dy * dy
    const t =
      len2 > 0
        ? Math.min(1, Math.max(0, ((worldX - s.x1) * dx + (worldY - s.y1) * dy) / len2))
        : 0
    const px = s.x1 + t * dx
    const py = s.y1 + t * dy
    const d = dist(worldX, worldY, px, py)
    if (best && d >= best.dist) continue
    best = {
      x: px,
      y: py,
      angle:
        len2 > 0
          ? inwardNormalAngle(px, py, dx, dy, cx, cy)
          : normAngle(Math.atan2(cy - py, cx - px)),
      dist: d,
    }
  }
  return best
}

/** 光标是否落在图形（含旋转）包围盒 ±pad 内（轮廓检索粗筛用） */
export function pointInRotatedBBox(
  el: ElementInstance,
  x: number,
  y: number,
  pad = 0,
): boolean {
  const { x: ex, y: ey, w, h, angle } = el.props
  let bx = ex
  let by = ey
  let bw = w
  let bh = h
  if (angle) {
    // 旋转外接矩形（与 snapLinkerEndpoint 邻近锚点循环同口径）
    const cos = Math.abs(Math.cos(angle))
    const sin = Math.abs(Math.sin(angle))
    bw = w * cos + h * sin
    bh = w * sin + h * cos
    bx = ex + (w - bw) / 2
    by = ey + (h - bh) / 2
  }
  return x >= bx - pad && x <= bx + bw + pad && y >= by - pad && y <= by + bh + pad
}
