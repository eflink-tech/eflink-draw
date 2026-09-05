// 连线几何计算
// 参考副本：docs/old-reference/getLinkerPoints.full.js
//
// - from/to.angle 是锚点的"内向角"（指向图形内部），由锚点指向图形中心
// - getAngleDir: 1=上锚点 2=右锚点 3=下锚点 4=左锚点
// - broken 折线：按两端锚点方向组合路由，stub 长度 r=30
// - curve 曲线：控制点距离 k = 两端距离 * 0.4，沿内向角反向（即向外）延伸
import type { ElementInstance, FontStyle, LinkerInstance } from '@/types'
import { DEFAULT_FONT_SIZE, DEFAULT_LINE_WIDTH } from '@/types'
import { evaluateExpression } from '@/core/utils/expression'
import { snapLinkerLine } from './alignment'
import { DEFAULT_FONT_VALUE } from './fontMap'

/** 世界坐标点 */
export interface Point {
  x: number
  y: number
}

/** 图形矩形（世界坐标） */
export interface ShapeRect {
  x: number
  y: number
  w: number
  h: number
}

/** 连线端点（与 LinkerInstance.from/to 同构） */
export interface LinkerEndpoint {
  id: string | null
  x: number
  y: number
  angle: number | null
}

/** 折线路由 stub 长度（端段锚点方向短段，路由与手动拖拽共用） */
export const STUB_R = 30

/**
 * 角度 → 锚点方向
 * 注意 angle 是内向角（指向图形内部）
 * 1=上锚点(内向朝下 π/2) 2=右锚点(内向朝左 π) 3=下锚点(内向朝上 3π/2) 4=左锚点(内向朝右 0)
 */
export function getAngleDir(angle: number): 1 | 2 | 3 | 4 {
  const a = Math.PI
  if (angle >= a / 4 && angle < (a / 4) * 3) return 1
  if (angle >= (a / 4) * 3 && angle < (a / 4) * 5) return 2
  if (angle >= (a / 4) * 5 && angle < (a / 4) * 7) return 3
  return 4
}

/**
 * 计算图形的锚点局部坐标（相对图形左上角，未旋转）+ 局部内向角
 * @param w h 实时尺寸（resize 直操期间传入 live 值；缺省用 store 尺寸）
 */
export function getLocalAnchors(
  el: ElementInstance,
  w: number = el.props.w,
  h: number = el.props.h,
): Array<Point & { angle: number }> {
  return el.anchors.map((a) => {
    const x = evaluateExpression(a.x, { w, h })
    const y = evaluateExpression(a.y, { w, h })
    return { x, y, angle: normAngle(Math.atan2(h / 2 - y, w / 2 - x)) }
  })
}

/** 计算图形的锚点绝对世界坐标（含旋转，围绕中心）+ 世界内向角 */
export function getAnchorPoints(el: ElementInstance): Array<Point & { angle: number }> {
  const { w, h, x, y, angle: rot } = el.props
  const cx = x + w / 2
  const cy = y + h / 2
  const cos = Math.cos(rot)
  const sin = Math.sin(rot)
  return getLocalAnchors(el).map((a) => {
    const dx = a.x - w / 2
    const dy = a.y - h / 2
    const rx = cx + dx * cos - dy * sin
    const ry = cy + dx * sin + dy * cos
    // 世界内向角：旋转后的锚点指向中心（归一化到 [0, 2π)）
    return { x: rx, y: ry, angle: normAngle(Math.atan2(cy - ry, cx - rx)) }
  })
}

export function normAngle(a: number): number {
  return (a + Math.PI * 2) % (Math.PI * 2)
}

/** 两点距离 */
export function measureDistance(a: Point, b: Point): number {
  return Math.sqrt((b.y - a.y) ** 2 + (b.x - a.x) ** 2)
}

/** 连线路由可选项 */
export interface LinkerRouteOptions {
  /**
   * 垂直堆叠快速路径（面对面上下锚点对）的水平过渡段位置：
   *   - 'middle'（默认）：两端中点，无遮挡时视觉对称
   *   - 'nearBot'：贴近下方图形顶边（bot.y - r），供自动布局重锚在
   *     中间行带被占用时把过渡段让出（仅 bot 为上锚时生效，否则回退中点）
   */
  midY?: 'middle' | 'nearBot'
}

/**
 * 计算连线路径点（移植 getLinkerPoints）
 *
 * @param linker  连线数据（linkerType + from/to）
 * @param getRect  由图形 ID 获取实时矩形的函数（拖拽期间传入直操节点的实时位置）
 * @param opts  可选路由参数（默认行为不变）
 * @returns 路径中间点数组（不含 from/to 端点本身）
 */
export function getLinkerPoints(
  linker: Pick<LinkerInstance, 'linkerType' | 'from' | 'to'>,
  getRect: (id: string) => ShapeRect | null,
  opts?: LinkerRouteOptions,
): Point[] {
  const A: Point[] = []
  const w = linker.from
  const d = linker.to
  const m = Math.abs(d.x - w.x)
  const D = Math.abs(d.y - w.y)
  const r = STUB_R

  if (linker.linkerType === 'broken') {
    if (w.id != null && d.id != null) {
      // ═══════════ 两端都连接图形：按锚点方向组合路由 ═══════════
      brokenBothAttached(w, d, A, getRect, m, D, r, opts)
    } else if (w.id != null || d.id != null) {
      // ═══════════ 一端自由：g=固定端，i=自由端 ═══════════
      brokenOneFree(w, d, A, getRect, m, D, r)
    } else {
      // ═══════════ 两端都自由：主轴中点肘形 ═══════════
      if (m >= D) {
        const z = (d.x - w.x) / 2
        A.push({ x: w.x + z, y: w.y }, { x: w.x + z, y: d.y })
      } else {
        const z = (d.y - w.y) / 2
        A.push({ x: w.x, y: w.y + z }, { x: d.x, y: w.y + z })
      }
    }
  } else if (linker.linkerType === 'curve') {
    // ═══════════ 曲线控制点 ═══════════
    const f = measureDistance(w, d)
    const k = f * 0.4
    A.push(curveControl(w, d, k), curveControl(d, w, k))
  }
  return A
}

/** curve 控制点：固定端沿内向角反向（向外）延伸 k；自由端沿连线方向延伸 k */
function curveControl(E: LinkerEndpoint, F: LinkerEndpoint, k: number): Point {
  if (E.id != null) {
    return {
      x: E.x - k * Math.cos(E.angle ?? 0),
      y: E.y - k * Math.sin(E.angle ?? 0),
    }
  }
  const G = Math.abs(E.y - F.y)
  const y = Math.abs(E.x - F.x)
  const H = Math.atan(G / y)
  return {
    x: E.x <= F.x ? E.x + k * Math.cos(H) : E.x - k * Math.cos(H),
    y: E.y <= F.y ? E.y + k * Math.sin(H) : E.y - k * Math.sin(H),
  }
}

// ═══════════════════════════════════════════
// broken - 两端都固定：方向组合路由
// 变量命名保持与旧代码一致便于对照：
//   g/i = 排序后的两端（l 标记是否交换，交换则结尾 reverse）
//   h/v = g/i 两个图形的矩形
//   o/n = 中间拐点坐标
// ═══════════════════════════════════════════
function brokenBothAttached(
  w: LinkerEndpoint,
  d: LinkerEndpoint,
  A: Point[],
  getRect: (id: string) => ShapeRect | null,
  m: number,
  D: number,
  r: number,
  opts?: LinkerRouteOptions,
): void {
  const c = getAngleDir(w.angle ?? 0)
  const b = getAngleDir(d.angle ?? 0)
  let g: LinkerEndpoint
  let i: LinkerEndpoint
  let l: boolean

  // ── 垂直堆叠快速路径 ──────────────────────────────────────
  // 仅服务"面对面上下锚点对"（dir1↔dir3）：当一个图形完全在另一个上方
  //（上图形底边 ≤ 下图形顶边）且水平有重叠时，直接画 Z 形连线，
  // 避免 (1,3)/(3,1) 分支在大间距下的 U 形绕行。
  // 同侧锚（1,1/3,3）、侧锚（2,2/4,4）、混合锚交回下方方向组合分支：
  // 那些分支自带 l+reverse 方向机制；快速路径对同侧锚会画穿体直线、
  // 对侧锚会劫持侧向绕行（双向边分离依赖该绕行）。
  if ((c === 1 && b === 3) || (c === 3 && b === 1)) {
    {
      let top: LinkerEndpoint
      let bot: LinkerEndpoint
      if (w.y <= d.y) {
        top = w; bot = d
      } else {
        top = d; bot = w
      }
      const topRect = rect(top, getRect)
      if (topRect.y + topRect.h <= bot.y && bot.x >= topRect.x - r && bot.x <= topRect.x + topRect.w + r) {
        const dx = Math.abs(top.x - bot.x)
        if (dx < 2) {
          // x 几乎相同：不推中间点，traceLinkerPath 直接画 from→to 直线
        } else if (dx <= 15) {
          // x 接近：单拐点，减少折线段
          A.push({ x: (top.x + bot.x) / 2, y: (top.y + bot.y) / 2 })
        } else {
          // x 差异大：两拐点水平过渡。
          // nearBot：过渡段贴近下方图形顶边（仅 bot 锚在顶边时安全——
          // bot 锚在底边则贴顶的垂直段会穿过下图形本体，回退中点）
          const botIsTopAnchor = getAngleDir(bot.angle ?? 0) === 1
          const midY =
            opts?.midY === 'nearBot' && botIsTopAnchor
              ? bot.y - r
              : (top.y + bot.y) / 2
          A.push({ x: top.x, y: midY }, { x: bot.x, y: midY })
        }
        // 折点按 top→bot 序生成；from(w) 为下方端时反转为 w→d 序（否则渲染自交叉锯齿）
        if (top !== w) A.reverse()
        return
      }
    }
  }

  if (c === 1 && b === 1) {
    // 两上锚点：g=上方的图形，从上方绕行
    if (w.y < d.y) {
      g = w; i = d; l = false
    } else {
      g = d; i = w; l = true
    }
    const h = rect(g, getRect)
    if (i.x >= h.x - r && i.x <= h.x + h.w + r) {
      const o = i.x < h.x + h.w / 2 ? h.x - r : h.x + h.w + r
      let n = g.y - r
      A.push({ x: g.x, y: n }, { x: o, y: n })
      n = i.y - r
      A.push({ x: o, y: n }, { x: i.x, y: n })
    } else {
      const n = g.y - r
      A.push({ x: g.x, y: n }, { x: i.x, y: n })
    }
  } else if (c === 3 && b === 3) {
    // 两下锚点：g=下方的图形，从下方绕行
    if (w.y > d.y) {
      g = w; i = d; l = false
    } else {
      g = d; i = w; l = true
    }
    const h = rect(g, getRect)
    if (i.x >= h.x - r && i.x <= h.x + h.w + r) {
      const o = i.x < h.x + h.w / 2 ? h.x - r : h.x + h.w + r
      let n = g.y + r
      A.push({ x: g.x, y: n }, { x: o, y: n })
      n = i.y + r
      A.push({ x: o, y: n }, { x: i.x, y: n })
    } else {
      const n = g.y + r
      A.push({ x: g.x, y: n }, { x: i.x, y: n })
    }
  } else if (c === 2 && b === 2) {
    // 两右锚点：g=右方的图形，从右侧绕行
    if (w.x > d.x) {
      g = w; i = d; l = false
    } else {
      g = d; i = w; l = true
    }
    const h = rect(g, getRect)
    if (i.y >= h.y - r && i.y <= h.y + h.h + r) {
      let o = g.x + r
      const n = i.y < h.y + h.h / 2 ? h.y - r : h.y + h.h + r
      A.push({ x: o, y: g.y }, { x: o, y: n })
      o = i.x + r
      A.push({ x: o, y: n }, { x: o, y: i.y })
    } else {
      const o = g.x + r
      A.push({ x: o, y: g.y }, { x: o, y: i.y })
    }
  } else if (c === 4 && b === 4) {
    // 两左锚点：g=左方的图形，从左侧绕行
    if (w.x < d.x) {
      g = w; i = d; l = false
    } else {
      g = d; i = w; l = true
    }
    const h = rect(g, getRect)
    if (i.y >= h.y - r && i.y <= h.y + h.h + r) {
      let o = g.x - r
      const n = i.y < h.y + h.h / 2 ? h.y - r : h.y + h.h + r
      A.push({ x: o, y: g.y }, { x: o, y: n })
      o = i.x - r
      A.push({ x: o, y: n }, { x: o, y: i.y })
    } else {
      const o = g.x - r
      A.push({ x: o, y: g.y }, { x: o, y: i.y })
    }
  } else if ((c === 1 && b === 3) || (c === 3 && b === 1)) {
    // 上下相对（g=上锚点端）
    if (c === 1) {
      g = w; i = d; l = false
    } else {
      g = d; i = w; l = true
    }
    const h = rect(g, getRect)
    const v = rect(i, getRect)
    if (i.y <= g.y) {
      const n = g.y - D / 2
      A.push({ x: g.x, y: n }, { x: i.x, y: n })
    } else {
      const a = h.x + h.w
      const j = v.x + v.w
      let n = g.y - r
      let o: number
      if (j >= h.x && v.x <= a) {
        // 两图形水平方向重叠
        const z = h.x + h.w / 2
        if (i.x < z) o = h.x < v.x ? h.x - r : v.x - r
        else o = a > j ? a + r : j + r
        if (v.y < g.y) n = v.y - r
      } else {
        if (i.x < g.x) o = j + (h.x - j) / 2
        else o = a + (v.x - a) / 2
      }
      A.push({ x: g.x, y: n }, { x: o, y: n })
      n = i.y + r
      A.push({ x: o, y: n }, { x: i.x, y: n })
    }
  } else if ((c === 2 && b === 4) || (c === 4 && b === 2)) {
    // 左右相对（g=右锚点端）
    if (c === 2) {
      g = w; i = d; l = false
    } else {
      g = d; i = w; l = true
    }
    const h = rect(g, getRect)
    const v = rect(i, getRect)
    if (i.x > g.x) {
      const o = g.x + m / 2
      A.push({ x: o, y: g.y }, { x: o, y: i.y })
    } else {
      const u = h.y + h.h
      const p = v.y + v.h
      let o = g.x + r
      let n: number
      if (p >= h.y && v.y <= u) {
        // 两图形垂直方向重叠
        const z = h.y + h.h / 2
        if (i.y < z) n = h.y < v.y ? h.y - r : v.y - r
        else n = u > p ? u + r : p + r
        if (v.x + v.w > g.x) o = v.x + v.w + r
      } else {
        if (i.y < g.y) n = p + (h.y - p) / 2
        else n = u + (v.y - u) / 2
      }
      A.push({ x: o, y: g.y }, { x: o, y: n })
      o = i.x - r
      A.push({ x: o, y: n }, { x: o, y: i.y })
    }
  } else if ((c === 1 && b === 2) || (c === 2 && b === 1)) {
    // 上-右相邻（g=右锚点端，i=上锚点端）
    if (c === 2) {
      g = w; i = d; l = false
    } else {
      g = d; i = w; l = true
    }
    const h = rect(g, getRect)
    const v = rect(i, getRect)
    if (i.x > g.x && i.y > g.y) {
      A.push({ x: i.x, y: g.y })
    } else if (i.x > g.x && v.x > g.x) {
      const o = v.x - g.x < r * 2 ? g.x + (v.x - g.x) / 2 : g.x + r
      const n = i.y - r
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n })
    } else if (i.x <= g.x && i.y > h.y + h.h) {
      const u = h.y + h.h
      const o = g.x + r
      const n = i.y - u < r * 2 ? u + (i.y - u) / 2 : i.y - r
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n })
    } else {
      const j = v.x + v.w
      const o = j > g.x ? j + r : g.x + r
      const n = i.y < h.y ? i.y - r : h.y - r
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n })
    }
  } else if ((c === 1 && b === 4) || (c === 4 && b === 1)) {
    // 上-左相邻（g=左锚点端，i=上锚点端）
    if (c === 4) {
      g = w; i = d; l = false
    } else {
      g = d; i = w; l = true
    }
    const h = rect(g, getRect)
    const v = rect(i, getRect)
    const j = v.x + v.w
    if (i.x < g.x && i.y > g.y) {
      A.push({ x: i.x, y: g.y })
    } else if (i.x < g.x && j < g.x) {
      const o = g.x - j < r * 2 ? j + (g.x - j) / 2 : g.x - r
      const n = i.y - r
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n })
    } else if (i.x >= g.x && i.y > h.y + h.h) {
      const u = h.y + h.h
      const o = g.x - r
      const n = i.y - u < r * 2 ? u + (i.y - u) / 2 : i.y - r
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n })
    } else {
      const o = v.x < g.x ? v.x - r : g.x - r
      const n = i.y < h.y ? i.y - r : h.y - r
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n })
    }
  } else if ((c === 2 && b === 3) || (c === 3 && b === 2)) {
    // 右-下相邻（g=右锚点端，i=下锚点端）
    if (c === 2) {
      g = w; i = d; l = false
    } else {
      g = d; i = w; l = true
    }
    const h = rect(g, getRect)
    const v = rect(i, getRect)
    if (i.x > g.x && i.y < g.y) {
      A.push({ x: i.x, y: g.y })
    } else if (i.x > g.x && v.x > g.x) {
      const o = v.x - g.x < r * 2 ? g.x + (v.x - g.x) / 2 : g.x + r
      const n = i.y + r
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n })
    } else if (i.x <= g.x && i.y < h.y) {
      const o = g.x + r
      const n = h.y - i.y < r * 2 ? i.y + (h.y - i.y) / 2 : i.y + r
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n })
    } else {
      const j = v.x + v.w
      const o = j > g.x ? j + r : g.x + r
      const n = i.y > h.y + h.h ? i.y + r : h.y + h.h + r
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n })
    }
  } else {
    // 下-左相邻（c,b 为 3&4 或 4&3）（g=左锚点端，i=下锚点端）
    if (c === 4) {
      g = w; i = d; l = false
    } else {
      g = d; i = w; l = true
    }
    const h = rect(g, getRect)
    const v = rect(i, getRect)
    const j = v.x + v.w
    if (i.x < g.x && i.y < g.y) {
      A.push({ x: i.x, y: g.y })
    } else if (i.x < g.x && j < g.x) {
      const o = g.x - j < r * 2 ? j + (g.x - j) / 2 : g.x - r
      const n = i.y + r
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n })
    } else if (i.x >= g.x && i.y < h.y) {
      const o = g.x - r
      const n = h.y - i.y < r * 2 ? i.y + (h.y - i.y) / 2 : i.y + r
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n })
    } else {
      const o = v.x < g.x ? v.x - r : g.x - r
      const n = i.y > h.y + h.h ? i.y + r : h.y + h.h + r
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n })
    }
  }

  if (l) A.reverse()
}

function rect(ep: LinkerEndpoint, getRect: (id: string) => ShapeRect | null): ShapeRect {
  return getRect(ep.id ?? '') ?? { x: ep.x, y: ep.y, w: 0, h: 0 }
}

// ═══════════════════════════════════════════
// broken - 一端自由
// g=固定端（连接图形），i=自由端，B=g.angle，e=g 图形矩形
// ═══════════════════════════════════════════
function brokenOneFree(
  w: LinkerEndpoint,
  d: LinkerEndpoint,
  A: Point[],
  getRect: (id: string) => ShapeRect | null,
  m: number,
  D: number,
  r: number,
): void {
  let g: LinkerEndpoint
  let i: LinkerEndpoint
  let l: boolean
  let B: number
  if (w.id != null) {
    g = w; i = d; l = false; B = w.angle ?? 0
  } else {
    g = d; i = w; l = true; B = d.angle ?? 0
  }
  const e = rect(g, getRect)
  const C = Math.PI

  if (B >= C / 4 && B < (C / 4) * 3) {
    // dir 1：上锚点（锚点在图形顶边）
    if (i.y < g.y) {
      if (m >= D) {
        A.push({ x: g.x, y: i.y })
      } else {
        const z = D / 2
        A.push({ x: g.x, y: g.y - z }, { x: i.x, y: g.y - z })
      }
    } else {
      A.push({ x: g.x, y: g.y - r })
      if (m >= D) {
        if (i.x >= e.x - r && i.x <= e.x + e.w + r) {
          const q = e.x + e.w / 2
          if (i.x < q) {
            A.push({ x: e.x - r, y: g.y - r }, { x: e.x - r, y: i.y })
          } else {
            A.push({ x: e.x + e.w + r, y: g.y - r }, { x: e.x + e.w + r, y: i.y })
          }
        } else {
          if (i.x < e.x) {
            A.push({ x: i.x + r, y: g.y - r }, { x: i.x + r, y: i.y })
          } else {
            A.push({ x: i.x - r, y: g.y - r }, { x: i.x - r, y: i.y })
          }
        }
      } else {
        if (i.x >= e.x - r && i.x <= e.x + e.w + r) {
          const q = e.x + e.w / 2
          if (i.x < q) {
            A.push(
              { x: e.x - r, y: g.y - r },
              { x: e.x - r, y: i.y - r },
              { x: i.x, y: i.y - r },
            )
          } else {
            A.push(
              { x: e.x + e.w + r, y: g.y - r },
              { x: e.x + e.w + r, y: i.y - r },
              { x: i.x, y: i.y - r },
            )
          }
        } else {
          A.push({ x: i.x, y: g.y - r })
        }
      }
    }
  } else if (B >= (C / 4) * 3 && B < (C / 4) * 5) {
    // dir 2：右锚点（锚点在图形右边）
    if (i.x > g.x) {
      if (m >= D) {
        const z = m / 2
        A.push({ x: g.x + z, y: g.y }, { x: g.x + z, y: i.y })
      } else {
        A.push({ x: i.x, y: g.y })
      }
    } else {
      A.push({ x: g.x + r, y: g.y })
      if (m >= D) {
        if (i.y >= e.y - r && i.y <= e.y + e.h + r) {
          const q = e.y + e.h / 2
          if (i.y < q) {
            A.push(
              { x: g.x + r, y: e.y - r },
              { x: i.x + r, y: e.y - r },
              { x: i.x + r, y: i.y },
            )
          } else {
            A.push(
              { x: g.x + r, y: e.y + e.h + r },
              { x: i.x + r, y: e.y + e.h + r },
              { x: i.x + r, y: i.y },
            )
          }
        } else {
          A.push({ x: g.x + r, y: i.y })
        }
      } else {
        if (i.y >= e.y - r && i.y <= e.y + e.h + r) {
          const q = e.y + e.h / 2
          if (i.y < q) {
            A.push({ x: g.x + r, y: e.y - r }, { x: i.x, y: e.y - r })
          } else {
            A.push({ x: g.x + r, y: e.y + e.h + r }, { x: i.x, y: e.y + e.h + r })
          }
        } else {
          if (i.y < g.y) {
            A.push({ x: g.x + r, y: i.y + r }, { x: i.x, y: i.y + r })
          } else {
            A.push({ x: g.x + r, y: i.y - r }, { x: i.x, y: i.y - r })
          }
        }
      }
    }
  } else if (B >= (C / 4) * 5 && B < (C / 4) * 7) {
    // dir 3：下锚点（锚点在图形底边）
    if (i.y > g.y) {
      if (m >= D) {
        A.push({ x: g.x, y: i.y })
      } else {
        const z = D / 2
        A.push({ x: g.x, y: g.y + z }, { x: i.x, y: g.y + z })
      }
    } else {
      A.push({ x: g.x, y: g.y + r })
      if (m >= D) {
        if (i.x >= e.x - r && i.x <= e.x + e.w + r) {
          const q = e.x + e.w / 2
          if (i.x < q) {
            A.push({ x: e.x - r, y: g.y + r }, { x: e.x - r, y: i.y })
          } else {
            A.push({ x: e.x + e.w + r, y: g.y + r }, { x: e.x + e.w + r, y: i.y })
          }
        } else {
          if (i.x < e.x) {
            A.push({ x: i.x + r, y: g.y + r }, { x: i.x + r, y: i.y })
          } else {
            A.push({ x: i.x - r, y: g.y + r }, { x: i.x - r, y: i.y })
          }
        }
      } else {
        if (i.x >= e.x - r && i.x <= e.x + e.w + r) {
          const q = e.x + e.w / 2
          if (i.x < q) {
            A.push(
              { x: e.x - r, y: g.y + r },
              { x: e.x - r, y: i.y + r },
              { x: i.x, y: i.y + r },
            )
          } else {
            A.push(
              { x: e.x + e.w + r, y: g.y + r },
              { x: e.x + e.w + r, y: i.y + r },
              { x: i.x, y: i.y + r },
            )
          }
        } else {
          A.push({ x: i.x, y: g.y + r })
        }
      }
    }
  } else {
    // dir 4：左锚点（锚点在图形左边）
    if (i.x < g.x) {
      if (m >= D) {
        const z = m / 2
        A.push({ x: g.x - z, y: g.y }, { x: g.x - z, y: i.y })
      } else {
        A.push({ x: i.x, y: g.y })
      }
    } else {
      A.push({ x: g.x - r, y: g.y })
      if (m >= D) {
        if (i.y >= e.y - r && i.y <= e.y + e.h + r) {
          const q = e.y + e.h / 2
          if (i.y < q) {
            A.push(
              { x: g.x - r, y: e.y - r },
              { x: i.x - r, y: e.y - r },
              { x: i.x - r, y: i.y },
            )
          } else {
            A.push(
              { x: g.x - r, y: e.y + e.h + r },
              { x: i.x - r, y: e.y + e.h + r },
              { x: i.x - r, y: i.y },
            )
          }
        } else {
          A.push({ x: g.x - r, y: i.y })
        }
      } else {
        if (i.y >= e.y - r && i.y <= e.y + e.h + r) {
          const q = e.y + e.h / 2
          if (i.y < q) {
            A.push({ x: g.x - r, y: e.y - r }, { x: i.x, y: e.y - r })
          } else {
            A.push({ x: g.x - r, y: e.y + e.h + r }, { x: i.x, y: e.y + e.h + r })
          }
        } else {
          if (i.y < g.y) {
            A.push({ x: g.x - r, y: i.y + r }, { x: i.x, y: i.y + r })
          } else {
            A.push({ x: g.x - r, y: i.y - r }, { x: i.x, y: i.y - r })
          }
        }
      }
    }
  }

  if (l) A.reverse()
}

// ═══════════════════════════════════════════
// 连线创建辅助
// ═══════════════════════════════════════════

/** 连线默认样式（移植 Schema.linkerDefaults；lineWidth 与图形默认边框对齐 = 1.5） */
export const LINKER_DEFAULTS = {
  lineWidth: DEFAULT_LINE_WIDTH,
  lineColor: '50,50,50',
  lineStyle: 'solid' as const,
  beginArrowStyle: 'none' as const,
  endArrowStyle: 'solidArrow' as const,
}

export const LINKER_FONT_DEFAULTS: FontStyle = {
  fontFamily: DEFAULT_FONT_VALUE,
  size: DEFAULT_FONT_SIZE,
  color: '50,50,50',
}

let idCounter = 0
/** 生成连线 ID（与元素 ID 同构） */
export function newLinkerId(): string {
  idCounter += 1
  return `lk-${Date.now()}-${idCounter}-${Math.random().toString(36).slice(2, 6)}`
}

/**
 * 创建连线实例（默认样式移植自 Schema.linkerDefaults）
 * points 由调用方基于文档内图形位置计算
 */
export function createLinkerInstance(
  from: LinkerEndpoint & { id: string | null },
  to: LinkerEndpoint & { id: string | null },
  zindex: number,
): LinkerInstance {
  return {
    id: newLinkerId(),
    name: 'linker',
    from: { id: from.id, x: from.x, y: from.y, angle: from.angle ?? 0 },
    to: { id: to.id, x: to.x, y: to.y, angle: to.angle ?? 0 },
    text: '',
    linkerType: 'broken',
    lineStyle: {
      lineWidth: LINKER_DEFAULTS.lineWidth,
      lineColor: LINKER_DEFAULTS.lineColor,
      lineStyle: LINKER_DEFAULTS.lineStyle,
      beginArrowStyle: LINKER_DEFAULTS.beginArrowStyle,
      endArrowStyle: LINKER_DEFAULTS.endArrowStyle,
    },
    points: [],
    locked: false,
    dataAttributes: [],
    group: '',
    props: { zindex },
  }
}

/**
 * 落点吸附：查找鼠标下图形的最近锚点
 * 移植自 moveLinker 的锚点检测逻辑
 *
 * @returns 命中时返回 {id, x, y, angle}；未命中返回 null
 */
export function findSnapAnchor(
  elements: ElementInstance[],
  worldX: number,
  worldY: number,
  excludeId: string | null,
): LinkerEndpoint | null {
  let best: LinkerEndpoint | null = null
  let bestDist = -1
  for (const el of elements) {
    if (el.locked || el.id === excludeId) continue
    // linkable === false 的图形不参与连线吸附（braces/parentheses 等装饰性图形）
    if (el.attribute?.linkable === false) continue
    // 粗筛：点在图形包围盒 + 10px 内才检测锚点
    const { x, y, w, h } = el.props
    if (worldX < x - 10 || worldX > x + w + 10 || worldY < y - 10 || worldY > y + h + 10) {
      continue
    }
    for (const a of getAnchorPoints(el)) {
      const dist = measureDistance({ x: worldX, y: worldY }, a)
      if (bestDist === -1 || dist < bestDist) {
        bestDist = dist
        best = { id: el.id, x: a.x, y: a.y, angle: a.angle }
      }
    }
  }
  return best
}

// ═══════════════════════════════════════════
// 与 findSnapAnchor 的关键差异：吸附目标是
// "距离连线另一端最近的锚点"（决定箭头驶入方向），
// 而非距离鼠标最近的锚点。
// ═══════════════════════════════════════════

const ANCHOR_HIT_PX = 7
const ENDPOINT_ALIGN_PX = 6

export interface EndpointSnapInput {
  /** 画布上的图形 */
  shapes: ElementInstance[]
  /** 鼠标下图形 ID（精确路径命中，由交互层用 Konva 命中图提供；null = 空白） */
  hitShapeId: string | null
  worldX: number
  worldY: number
  scale: number
  /** 连线另一端（决定锚点选择） */
  otherEnd: { id: string | null; x: number; y: number }
}

export interface EndpointSnapResult {
  endpoint: LinkerEndpoint
  snapAnchor: { x: number; y: number } | null
}

/**
 * 计算连线端点拖动/创建时的目标端点
 *
 * 1. 鼠标 7px 内命中悬停图形的具体锚点 → 直接选中该锚点
 * 2. 悬停图形 == 另一端所属图形 → 脱附为自由点（不允许两端连同一图形）
 * 3. 悬停图形内部 → 吸附到距另一端最近的锚点
 * 4. 空白 → 自由点：图形边吸附（2px）后，±6px 与另一端对齐拉直
 */
export function snapLinkerEndpoint(input: EndpointSnapInput): EndpointSnapResult {
  const { shapes, hitShapeId, worldX, worldY, scale, otherEnd } = input
  // 锁定或 linkable === false 的图形不可连线/吸附（与 findSnapAnchor 语义一致）
  const hit =
    hitShapeId != null
      ? shapes.find(
          (s) => s.id === hitShapeId && !s.locked && s.attribute?.linkable !== false,
        )
      : undefined

  if (hit) {
    const anchors = getAnchorPoints(hit)

    const tol = ANCHOR_HIT_PX / scale
    const direct = anchors.find(
      (a) => Math.abs(a.x - worldX) <= tol && Math.abs(a.y - worldY) <= tol,
    )
    if (direct) {
      return {
        endpoint: { id: hit.id, x: direct.x, y: direct.y, angle: direct.angle },
        snapAnchor: { x: direct.x, y: direct.y },
      }
    }

    if (hit.id === otherEnd.id) {
      return { endpoint: { id: null, x: worldX, y: worldY, angle: null }, snapAnchor: null }
    }

    let best = anchors[0]
    let bestDist = Infinity
    for (const a of anchors) {
      const dist = measureDistance(a, otherEnd)
      if (dist < bestDist) {
        bestDist = dist
        best = a
      }
    }
    return {
      endpoint: { id: hit.id, x: best.x, y: best.y, angle: best.angle },
      snapAnchor: { x: best.x, y: best.y },
    }
  }

  let x = worldX
  let y = worldY
  const edge = snapLinkerLine(worldX, worldY, shapes)
  if (edge.v != null) x = edge.v
  if (edge.h != null) y = edge.h
  if (Math.abs(x - otherEnd.x) <= ENDPOINT_ALIGN_PX) x = otherEnd.x
  if (Math.abs(y - otherEnd.y) <= ENDPOINT_ALIGN_PX) y = otherEnd.y
  return { endpoint: { id: null, x, y, angle: null }, snapAnchor: null }
}
