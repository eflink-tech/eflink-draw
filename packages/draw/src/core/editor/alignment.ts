// 对齐吸附检测
// 机制：2px 阈值（世界坐标），被拖动包围盒的 6 条线与其他图形的 6 条线比较，
// 反向遍历（后绘制的优先），找到 h 和 v 后提前退出
import type { ElementInstance } from '@/types'

/** 矩形（世界坐标） */
export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface SnapResult {
  /** 垂直吸附线（x 位置） */
  v: { type: 'left' | 'center' | 'right'; x: number } | null
  /** 水平吸附线（y 位置） */
  h: { type: 'top' | 'middle' | 'bottom'; y: number } | null
}

const SNAP_THRESHOLD = 2

/**
 * 对齐吸附检测
 *
 * @param t          被拖动图形（选中集）的包围盒，**会被原地修正**为吸附后位置
 * @param excludedIds 排除的元素 ID（选中集自身 + 其关联元素）
 * @param elements    画布上的图形（按 zindex 升序，内部反向遍历）
 */
export function snapLine(
  t: Rect,
  excludedIds: string[],
  elements: ElementInstance[],
): SnapResult {
  const s = t.y
  const I = t.y + t.h / 2
  const k = t.y + t.h
  const g = t.x
  const D = t.x + t.w / 2
  const B = t.x + t.w
  const f = SNAP_THRESHOLD
  const m: SnapResult = { v: null, h: null }

  for (let x = elements.length - 1; x >= 0; x--) {
    const d = elements[x]
    if (excludedIds.indexOf(d.id) >= 0 || d.parent) continue

    const v = d.props
    if (m.h == null) {
      // 对方图形的三条水平线
      const c = v.y
      const b = v.y + v.h / 2
      const l = v.y + v.h
      if (b >= I - f && b <= I + f) {
        // 中线对中线
        m.h = { type: 'middle', y: b }
        t.y = b - t.h / 2
      } else if (c >= s - f && c <= s + f) {
        // 顶边对顶边
        m.h = { type: 'top', y: c }
        t.y = c
      } else if (l >= k - f && l <= k + f) {
        // 底边对底边
        m.h = { type: 'bottom', y: l }
        t.y = l - t.h
      } else if (l >= s - f && l <= s + f) {
        // 对方底边对我的顶边（交叉）
        m.h = { type: 'top', y: l }
        t.y = l
      } else if (c >= k - f && c <= k + f) {
        // 对方顶边对我的底边（交叉）
        m.h = { type: 'bottom', y: c }
        t.y = c - t.h
      }
    }
    if (m.v == null) {
      // 对方图形的三条垂直线
      const H = v.x
      const G = v.x + v.w / 2
      const w = v.x + v.w
      if (G >= D - f && G <= D + f) {
        // 中线对中线
        m.v = { type: 'center', x: G }
        t.x = G - t.w / 2
      } else if (H >= g - f && H <= g + f) {
        // 左边对左边
        m.v = { type: 'left', x: H }
        t.x = H
      } else if (w >= B - f && w <= B + f) {
        // 右边对右边
        m.v = { type: 'right', x: w }
        t.x = w - t.w
      } else if (w >= g - f && w <= g + f) {
        // 对方右边对我的左边（交叉）
        m.v = { type: 'left', x: w }
        t.x = w
      } else if (H >= B - f && H <= B + f) {
        // 对方左边对我的右边（交叉）
        m.v = { type: 'right', x: H }
        t.x = H - t.w
      }
    }
    if (m.h != null && m.v != null) break
  }
  return m
}

/**
 * 连线自由端点吸附（移植自 snapLinkerLine）
 * 自由端靠近其他图形的边（2px）时吸附
 */
export function snapLinkerLine(
  o: number,
  p: number,
  elements: ElementInstance[],
): { v: number | null; h: number | null } {
  const q = { v: null as number | null, h: null as number | null }
  const k = 2
  for (let h = elements.length - 1; h >= 0; h--) {
    const l = elements[h]
    if (l.parent) continue
    // linkable === false 的图形不参与连线吸附（braces/parentheses 等装饰性图形）
    if (l.attribute?.linkable === false) continue
    const f = l.props
    if (q.h == null) {
      const d = f.y
      const j = f.y + f.h
      if (d >= p - k && d <= p + k) q.h = d
      else if (j >= p - k && j <= p + k) q.h = j
    }
    if (q.v == null) {
      const e = f.x
      const n = f.x + f.w
      if (e >= o - k && e <= o + k) q.v = e
      else if (n >= o - k && n <= o + k) q.v = n
    }
    if (q.h != null && q.v != null) break
  }
  return q
}
