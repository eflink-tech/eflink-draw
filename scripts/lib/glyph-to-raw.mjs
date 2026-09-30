/**
 * 手绘字形 → IconRaw 紧凑矢量数据。
 *
 * 复用 glyph-kit 的单色墨迹原语（ribbon/hollow/cut…）写形状，再编码成网络图标管线
 * 的 IconRaw：坐标按图形默认尺寸归一成千分比整数，交由 iconShape.decodeCmds 还原为
 * 'w*因子' 表达式 —— 于是手绘符号与 ProcessOn 转换图标走同一套懒加载 chunk、缩略图、
 * 搜索索引和面板分组，无需第二套注册路径。
 *
 * quadraticCurve 先升为三次贝塞尔（IconRaw 指令流只有 M/L/C/Z，升阶是精确的）。
 */
import { roundRectPath } from './mobile-glyphs.mjs'

const P = (v) => Math.round(v)

/** 二次 → 三次：C1 = P0 + 2/3(Q1-P0)，C2 = P2 + 2/3(Q1-P2) */
const elevate = (p0, q, p1) => [
  p0[0] + (2 / 3) * (q[0] - p0[0]),
  p0[1] + (2 / 3) * (q[1] - p0[1]),
  p1[0] + (2 / 3) * (q[0] - p1[0]),
  p1[1] + (2 / 3) * (q[1] - p1[1]),
]

/** 动作列表（像素坐标）→ 千分比指令流字符串 */
export function encodeActions(actions, w, h) {
  const X = (v) => P((v / w) * 1000)
  const Y = (v) => P((v / h) * 1000)
  let cur = [0, 0]
  const out = []
  for (const a of actions) {
    switch (a.action) {
      case 'move':
        cur = [a.x, a.y]
        out.push(`M${X(a.x)} ${Y(a.y)}`)
        break
      case 'line':
        cur = [a.x, a.y]
        out.push(`L${X(a.x)} ${Y(a.y)}`)
        break
      case 'quadraticCurve': {
        const [x1, y1, x2, y2] = elevate(cur, [a.x1, a.y1], [a.x, a.y])
        cur = [a.x, a.y]
        out.push(`C${X(x1)} ${Y(y1)} ${X(x2)} ${Y(y2)} ${X(a.x)} ${Y(a.y)}`)
        break
      }
      case 'curve':
        cur = [a.x, a.y]
        out.push(`C${X(a.x1)} ${Y(a.y1)} ${X(a.x2)} ${Y(a.y2)} ${X(a.x)} ${Y(a.y)}`)
        break
      case 'close':
        out.push('Z')
        break
      default:
        throw new Error(`不支持的动作: ${a.action}`)
    }
  }
  return out.join(' ')
}

/**
 * glyph(w,h)（glyph-kit 的 icon() 返回值）→ IconRaw 单色填充条目。
 * 子路径若自带颜色会破坏「面板改填充色即整体换色」，这里直接报错而不是静默忽略。
 */
export function glyphRaw(entry, w, h, glyph) {
  const segs = glyph.subPaths.map((s) => {
    const actions = Array.isArray(s) ? s : s.actions
    if (!Array.isArray(s)) {
      for (const k of ['fillStyle', 'lineStyle']) {
        if (s[k]) throw new Error(`${entry.n}: 墨迹子路径不应带 ${k}`)
      }
    }
    return { cmds: encodeActions(actions, w, h), ...(Array.isArray(s) ? {} : s.fillRule === 'evenodd' && { fr: 'evenodd' }) }
  })
  return {
    n: entry.n,
    t: entry.t,
    c: entry.c,
    ...(entry.g && { g: entry.g }),
    w,
    h,
    m: 'fill',
    fc: glyph.fill.color,
    segs,
    ...entry.extra,
  }
}

/** 区域/分组框：单色描边矩形（圆角按 px 给），配 ds/ct/tb 标记 */
export function frameRaw(entry, w, h, { radius = 8, dash = true, container = true } = {}) {
  const rr = Math.min(radius, w / 2 - 1, h / 2 - 1)
  // 描边居中：轮廓内缩半个线宽，线条才落在图形边界内
  const lw = entry.lw ?? 2
  const i = lw / 2
  const cmds = encodeActions(roundRectPath(i, i, w - 2 * i, h - 2 * i, rr), w, h)
  return {
    n: entry.n,
    t: entry.t,
    c: entry.c,
    ...(entry.g && { g: entry.g }),
    w,
    h,
    m: 'stroke',
    lc: entry.lc ?? '80,96,122',
    lw,
    segs: [{ cmds }],
    ...(dash && { ds: 1 }),
    ...(container && { ct: 1 }),
    tb: 'top',
    ...entry.extra,
  }
}
