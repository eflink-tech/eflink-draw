// broken 折线段命中与整段拖动
// 与 brokenLinkerChangable（L3085-3130）：
//   hover 线身 → e/n-resize 光标；
//   中段（1 < d <= points.length）拖动：紧邻锚点（首侧 d=2 / 末侧 d=points.length，broken +
//   锚点 id）时锚点侧折点固定、另一侧折点平移并插正交拐角（points +1；d=2 且 n=2 两端均
//   相邻时两侧折点均固定、插两个拐角，points +2）；其余中段两端折点单轴增量平移（垂直段
//   移 x、水平段移 y）、折点数不变；均不重算路由；
//   首/末段（d = 1 / d = points.length+1）拖动：附着端（broken + 锚点 id）插锚点方向
//   定长 stub（STUB_R，接近方向不变，箭头指向稳定）；自由端切出+插入（points +1，保持正交）；
//   segmentDragPoints 返回 { points, dragged }（dragged 为拖后段两端，供段中点句柄定位）；
//   mouseup 一次性提交。
import type Konva from 'konva'
import type { LinkerInstance } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { applyLiveLinker } from './liveLinker'
import { STUB_R, type Point } from './linker'
import { simplifyOrthogonalPoints } from './manualRoute'

/** 轴对齐判定阈值（世界像素，浮点容差） */
const AXIS_TOLERANCE = 0.5

/** 点到线段的最小距离 */
function distToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const dx = bx - ax
  const dy = by - ay
  const len2 = dx * dx + dy * dy
  const t =
    len2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

export interface SegmentHit {
  /** 命中段下标 d：连接 [from,...points,to][d-1] 与 [d] */
  segIndex: number
  /** 轴对齐方向（垂直段可水平拖 → v；水平段可垂直拖 → h；斜段 null） */
  axisAligned: 'v' | 'h' | null
}

export function hitLinkerSegment(
  l: LinkerInstance,
  wx: number,
  wy: number,
  scale: number,
): SegmentHit | null {
  const pts = [l.from, ...l.points, l.to]
  const tol = 6 / scale
  let best: SegmentHit | null = null
  let bestDist = Infinity
  for (let d = 1; d < pts.length; d++) {
    const dist = distToSegment(wx, wy, pts[d - 1]!.x, pts[d - 1]!.y, pts[d]!.x, pts[d]!.y)
    if (dist <= tol && dist < bestDist) {
      bestDist = dist
      const vertical = Math.abs(pts[d - 1]!.x - pts[d]!.x) < AXIS_TOLERANCE
      best = {
        segIndex: d,
        axisAligned: vertical
          ? 'v'
          : Math.abs(pts[d - 1]!.y - pts[d]!.y) < AXIS_TOLERANCE
            ? 'h'
            : null,
      }
    }
  }
  return best
}

export function isMiddleSegment(l: LinkerInstance, segIndex: number): boolean {
  return segIndex > 1 && segIndex <= l.points.length
}

/**
 * 段 d 是否可整段拖动：所有段均可。
 * 中段 = 紧邻锚点保 stub 插拐角，否则两端折点单轴平移；首/末段 = 附着端插锚点方向 stub（接近方向不变）；自由端切出+插入。
 */
export function isSegmentDraggable(l: LinkerInstance, segIndex: number): boolean {
  return segIndex >= 1 && segIndex <= l.points.length + 1
}

export interface SegmentDragResult {
  /** 拖动后的折点数组 */
  points: Point[]
  /** 被拖段拖动后的两端（段中点句柄定位用）；与 points 元素共享引用，消费方只读 */
  dragged: [Point, Point]
}

/**
 * 段拖动几何（纯函数）：段 d 平移 (dx, dy) 后的折点与被拖段位置。
 * 中段 = 紧邻锚点保 stub 插拐角，否则两端折点单轴平移；端段 = 附着端插锚点方向 stub（接近方向不变）；自由端切出+插入。
 */
export function segmentDragPoints(
  l: LinkerInstance,
  segIndex: number,
  dx: number,
  dy: number,
): SegmentDragResult {
  const pts = [l.from, ...l.points, l.to]
  const vertical = Math.abs(pts[segIndex - 1]!.x - pts[segIndex]!.x) < AXIS_TOLERANCE
  if (isMiddleSegment(l, segIndex)) return dragMiddle(l, segIndex, dx, dy, vertical)
  return dragEnd(l, segIndex, dx, dy, vertical)
}

/** 中段拖拽：紧邻锚点时锚点侧折点固定、插入正交拐角；其余两端折点单轴平移 */
function dragMiddle(
  l: LinkerInstance,
  segIndex: number,
  dx: number,
  dy: number,
  vertical: boolean,
): SegmentDragResult {
  const n = l.points.length
  // A = points[ai]（被拖段 from 侧折点）、B = points[bi]（to 侧折点）；下标基于 l.points（不含端点）
  const ai = segIndex - 2
  const bi = segIndex - 1
  const a0 = l.points[ai]!
  const b0 = l.points[bi]!
  const broken = l.linkerType === 'broken'
  const nearFrom = segIndex === 2 && broken && l.from.id != null
  const nearTo = segIndex === n && broken && l.to.id != null

  if (!nearFrom && !nearTo) {
    const points = l.points.map((p, i) => {
      if (i === ai) return vertical ? { ...p, x: a0.x + dx } : { ...p, y: a0.y + dy }
      if (i === bi) return vertical ? { ...p, x: b0.x + dx } : { ...p, y: b0.y + dy }
      return p
    })
    return { points, dragged: [points[ai]!, points[bi]!] }
  }

  const dragCoord = vertical ? dx : dy
  if (nearFrom && nearTo) {
    // n=2 两端都相邻：A、B 均固定（slice(0,bi) 保 a0、slice(bi) 保 b0），各插一个拐角
    const cornerFrom = vertical ? { x: a0.x + dragCoord, y: a0.y } : { x: a0.x, y: a0.y + dragCoord }
    const cornerTo = vertical ? { x: cornerFrom.x, y: b0.y } : { x: b0.x, y: cornerFrom.y }
    const points = [...l.points.slice(0, bi), cornerFrom, cornerTo, ...l.points.slice(bi)]
    return { points, dragged: [cornerFrom, cornerTo] }
  }
  if (nearTo) {
    // 锚点侧折点 B 固定（slice(bi) 保留 b0），A 平移（slice(0,ai)+a1 替换 a0）并在 B 前插入拐角
    const a1 = vertical ? { x: a0.x + dragCoord, y: a0.y } : { x: a0.x, y: a0.y + dragCoord }
    const corner = { x: b0.x, y: a1.y }
    const points = [...l.points.slice(0, ai), a1, corner, ...l.points.slice(bi)]
    return { points, dragged: [a1, corner] }
  }
  // nearFrom：锚点侧折点 A 固定（slice(0,bi) 保留 a0），B 平移并在 B 前插入拐角（b0 被 b1 替换）
  const b1 = vertical ? { x: b0.x + dragCoord, y: b0.y } : { x: b0.x, y: b0.y + dragCoord }
  const corner = { x: a0.x, y: b1.y }
  const points = [...l.points.slice(0, bi), corner, b1, ...l.points.slice(bi + 1)]
  return { points, dragged: [corner, b1] }
}

/** 端段拖拽（首段/末段）：附着端插锚点方向 stub（接近方向不变）；自由端切出+插入。
 *   游程不吞并对侧紧邻折点（对侧附着且 n≥2 时），保护截停处插正交拐角重接；
 *   corner 与 stub 同轴、与游程平移线同轴。 */
function dragEnd(
  l: LinkerInstance,
  segIndex: number,
  dx: number,
  dy: number,
  vertical: boolean,
): SegmentDragResult {
  const n = l.points.length
  const isFirst = segIndex === 1
  const ep = isFirst ? l.from : l.to
  const stubbing = ep.id != null && l.linkerType === 'broken'
  const tr = (p: Point): Point => (vertical ? { x: p.x + dx, y: p.y } : { x: p.x, y: p.y + dy })

  if (!stubbing) {
    if (n === 0) {
      const points = [tr(l.from), tr(l.to)]
      return { points, dragged: [points[0]!, points[1]!] }
    }
    if (isFirst) {
      const points = [tr(l.from), tr(l.points[0]!), ...l.points.slice(1)]
      return { points, dragged: [points[0]!, points[1]!] }
    }
    const points = [...l.points.slice(0, -1), tr(l.points[n - 1]!), tr(l.to)]
    return { points, dragged: [points[points.length - 2]!, points[points.length - 1]!] }
  }

  // ── 附着端：锚点方向 stub（最后一段保持原接近方向，箭头指向不变）──
  const stubOf = (endpoint: { x: number; y: number; angle: number }): Point => {
    // 轴向角（0/π/π/2 等）的 cos/sin 有 ~1e-16 浮点噪声（如 sin(π)），吸附为 0 保证 stub 精确正交
    const c0 = Math.cos(endpoint.angle)
    const s0 = Math.sin(endpoint.angle)
    const c = Math.abs(c0) < 1e-9 ? 0 : c0
    const s = Math.abs(s0) < 1e-9 ? 0 : s0
    return { x: endpoint.x - STUB_R * c, y: endpoint.y - STUB_R * s }
  }
  const points: Point[] = []
  // 相邻共点合并，返回已存点引用
  const push = (p: Point): Point => {
    const last = points[points.length - 1]
    if (last && Math.abs(last.x - p.x) < AXIS_TOLERANCE && Math.abs(last.y - p.y) < AXIS_TOLERANCE) {
      return last
    }
    points.push(p)
    return p
  }
  // 被拖段端点经共点合并后可能指向同一点，此时向前取相邻点定位句柄
  const resolveDragged = (a: Point, b: Point): [Point, Point] => {
    if (a === b || (Math.abs(a.x - b.x) < AXIS_TOLERANCE && Math.abs(a.y - b.y) < AXIS_TOLERANCE)) {
      const i = points.indexOf(a)
      return [points[Math.max(0, i - 1)]!, a]
    }
    return [a, b]
  }

  if (n === 0) {
    // 直线（唯一段兼为首末段）：两端按各自附着/自由构造（stubbing 已保证被拖端附着）
    const fromStub = l.from.id != null
    const toStub = l.to.id != null
    const dragCoord = vertical ? ep.x + dx : ep.y + dy
    let dragA = tr(l.from)
    if (fromStub) {
      const stubFrom = push(stubOf(l.from))
      dragA = push(vertical ? { x: dragCoord, y: stubFrom.y } : { x: stubFrom.x, y: dragCoord })
    } else {
      push(dragA)
    }
    let dragB = tr(l.to)
    if (toStub) {
      const stubTo = stubOf(l.to)
      dragB = push(vertical ? { x: dragCoord, y: stubTo.y } : { x: stubTo.x, y: dragCoord })
      push(stubTo)
    } else {
      push(dragB)
    }
    return { points, dragged: resolveDragged(dragA, dragB) }
  }

  // 共线游程：从端点向内连续与端段同轴的折点随拖拽一并平移。
  // 对侧端附着且 n≥2 时游程不吞并对侧紧邻折点（保护锚），避免对侧锚点斜连；
  // 保护截停（被保留点仍在游程轴上）时插正交拐角重接被平移游程与保留点
  const coord = (p: Point): number => (vertical ? p.x : p.y)
  const anchor = coord(ep)
  const oppositeAttached = (isFirst ? l.to.id : l.from.id) != null
  const reserveOpposite = oppositeAttached && n >= 2 ? 1 : 0
  const lo = isFirst ? 0 : reserveOpposite
  const hi = isFirst ? n - reserveOpposite : n
  let k = isFirst ? 0 : n - 1
  while (k >= lo && k < hi && Math.abs(coord(l.points[k]!) - anchor) < AXIS_TOLERANCE) {
    k += isFirst ? 1 : -1
  }
  const runStart = isFirst ? 0 : k + 1
  const runEnd = isFirst ? k : n
  if (runStart >= runEnd) {
    // 斜段历史数据（UI 不可拖，防御兜底）：退回切出+插入
    const points = [...l.points.slice(0, -1), tr(l.points[n - 1]!), tr(l.to)]
    return { points, dragged: [points[points.length - 2]!, points[points.length - 1]!] }
  }
  const head = l.points.slice(0, runStart)
  const run = l.points.slice(runStart, runEnd).map(tr)
  const tail = l.points.slice(runEnd)
  // 保护截停：被保留的对侧紧邻折点仍在游程轴上，其与被平移游程的连接边被拖斜，插正交拐角重接
  const headJoin = !isFirst && head.length > 0 && reserveOpposite === 1
    && Math.abs(coord(head[head.length - 1]!) - anchor) < AXIS_TOLERANCE
  const tailJoin = isFirst && tail.length > 0 && reserveOpposite === 1
    && Math.abs(coord(tail[0]!) - anchor) < AXIS_TOLERANCE
  const stub = stubOf(ep)
  const dragCoord = vertical ? ep.x + dx : ep.y + dy
  if (isFirst) {
    const stubFrom = push(stub)
    const cornerFrom = push(vertical ? { x: dragCoord, y: stubFrom.y } : { x: stubFrom.x, y: dragCoord })
    for (const p of run) push(p)
    if (tailJoin) {
      const runLast = run[run.length - 1]!
      const t0 = tail[0]!
      push(vertical ? { x: runLast.x, y: t0.y } : { x: t0.x, y: runLast.y })
    }
    for (const p of tail) push(p)
    return { points, dragged: resolveDragged(cornerFrom, run[0]!) }
  }
  for (const p of head) push(p)
  if (headJoin) {
    const hLast = head[head.length - 1]!
    const r0 = run[0]!
    push(vertical ? { x: r0.x, y: hLast.y } : { x: hLast.x, y: r0.y })
  }
  for (const p of run) push(p)
  const runLast = run[run.length - 1]!
  push(vertical ? { x: runLast.x, y: stub.y } : { x: stub.x, y: runLast.y })
  push(stub)
  // dragged 为被拖游程平移后的两端（段句柄跟随用户拖动的那条线）
  return { points, dragged: resolveDragged(run[0]!, runLast) }
}

/**
 * 未移动则不提交 —— 纯点击仍只是选中（mousedown 的 selectElement 已处理）
 */
export function startSegmentDrag(
  l: LinkerInstance,
  segIndex: number,
  stage: Konva.Stage,
): void {
  const pts = [l.from, ...l.points, l.to]
  const vertical = Math.abs(pts[segIndex - 1]!.x - pts[segIndex]!.x) < AXIS_TOLERANCE

  const startAbs = stage.getPointerPosition()
  if (!startAbs) return
  let live: LinkerInstance | null = null

  const dragCursor = vertical ? 'e-resize' : 'n-resize'
  stage.container().style.cursor = dragCursor

  const apply = (clientX: number, clientY: number): void => {
    // client → stage 绝对坐标 → 世界增量
    // scale/container 每帧读取（拖动中缩放/视口变化不致错位）；
    // startAbs 即按下位置，保持开始时快照（语义正确）
    const scale = useEditorStore.getState().viewport.scale
    const rect = stage.container().getBoundingClientRect()
    const dx = (clientX - rect.left - startAbs.x) / scale
    const dy = (clientY - rect.top - startAbs.y) / scale
    const result = segmentDragPoints(l, segIndex, dx, dy)
    // 实时共线简化：去掉 n=2 中段拖拽产生的回折 stub，避免拖拽中残留短线
    const points = simplifyOrthogonalPoints(l.from, result.points, l.to)
    live = { ...l, points }
    // 直操统一通道：liveLinker 重绘 + 文字标签跟随（不重算路由）
    applyLiveLinker(l.id, live)
    stage.container().style.cursor = dragCursor
    // 全部段句柄跟随简化后路径（不仅被拖段；否则其它句柄留在旧折点造成错位）
    const livePts = [l.from, ...points, l.to]
    let controlsLayer: Konva.Layer | null = null
    for (let d = 1; d < livePts.length; d++) {
      const handle = stage.findOne(`#seg-handle-${l.id}-${d}`)
      if (!handle) continue
      controlsLayer = handle.getLayer()
      const a = livePts[d - 1]!
      const b = livePts[d]!
      if (Math.hypot(b.x - a.x, b.y - a.y) < AXIS_TOLERANCE) {
        handle.visible(false)
        continue
      }
      handle.visible(true)
      handle.position({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
    }
    // 被拖段因插拐角后 segIndex 可能与简化路径段不对齐，用 dragged 校正句柄
    const dragHandle = stage.findOne(`#seg-handle-${l.id}-${segIndex}`)
    if (dragHandle) {
      controlsLayer = dragHandle.getLayer()
      const [mA, mB] = result.dragged
      if (Math.hypot(mB.x - mA.x, mB.y - mA.y) >= AXIS_TOLERANCE) {
        dragHandle.visible(true)
        dragHandle.position({ x: (mA.x + mB.x) / 2, y: (mA.y + mB.y) / 2 })
      }
    }
    controlsLayer?.batchDraw()
  }

  const move = (ev: MouseEvent): void => apply(ev.clientX, ev.clientY)
  const up = (): void => {
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
    stage.container().style.cursor = 'default'
    applyLiveLinker(l.id, null)
    if (live) useEditorStore.getState().updateLinker(l.id, { points: live.points, manualRoute: true })
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}
