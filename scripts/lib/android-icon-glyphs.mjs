/**
 * Android 状态/操作图标的手绘矢量库（旧 andriod_icons 分类，86 个位图图标）。
 *
 * 旧素材整分类都是「40×40 矩形 + 29×29 PNG 图片填充」，与本项目「全部可编辑矢量」的
 * 口径冲突，所以逐个重画。墨迹模型与原语见 glyph-kit.mjs（iOS 图标共用）。
 *
 * 一条纪律贯穿全表：**镂空（evenodd 内轮廓）只放互不重叠、也不与外轮廓共边的简单闭合
 * 轮廓**，需要交叉/贴边的笔画一律作为「墨」画出来 —— 两个镂空重叠时 evenodd 会把它们
 * 补回实心，共边则会在边上留下毛刺；而墨迹子路径各自填充，重叠只是叠色，观感不变。
 */
import { CLOSE, ellipsePath, move, quad, rectPath, roundRectPath, sub } from './mobile-glyphs.mjs'
import {
  ST,
  arcBand,
  arcPts,
  cut,
  heartPath,
  hollow,
  hollowRect,
  icon,
  personContours,
  plusPoly,
  poly,
  ribbon,
  ring,
  rotAbout,
  starPath,
  tipPoly,
} from './glyph-kit.mjs'

/** 笔画粗细：整族都是方图，按短边取，下限见 ST */
const T = (w, h, k = 0.11) => Math.max(1.6, Math.min(w, h) * k)

export const ANDROID_ICON_GLYPHS = {}
const G = ANDROID_ICON_GLYPHS

// ── 警示徽标：圆底 / 三角底 + 感叹号镂空 ─────────────────
const exclaim = (s, y0, y1, dy) => {
  const t = s * 0.13
  return [
    roundRectPath(s / 2 - t / 2, s * y0, t, s * (y1 - y0), t / 2),
    ellipsePath(s / 2 - t / 2, s * dy, t, t),
  ]
}
const alert = (color, outer, [y0, y1, dy]) =>
  icon(color, (w, h) => {
    const s = Math.min(w, h)
    return [cut(outer(s), ...exclaim(s, y0, y1, dy))]
  })
const disc = (s) => ellipsePath(0, 0, s, s)
const tri = (s) => poly([[s / 2, s * 0.05], [s * 0.99, s * 0.95], [s * 0.01, s * 0.95]])

G.andriod_icons_alert1 = alert('black', disc, [0.22, 0.56, 0.66])
G.andriod_icons_alert2 = alert('red', disc, [0.22, 0.56, 0.66])
G.andriod_icons_alert3 = alert('amber', tri, [0.36, 0.62, 0.72])
G.andriod_icons_alert4 = alert('black', tri, [0.36, 0.62, 0.72])

// ── 数据 / 统计 ─────────────────────────────────────────
/** 底部对齐的柱条：ks 为各柱高度占比 */
const barsUp = (w, h, ks, x0, bw, gap) =>
  ks.map((k, i) => rectPath(w * x0 + i * w * gap, h * 0.94 - h * 0.84 * k, w * bw, h * 0.84 * k))

G.andriod_icons_0 = icon('black', (w, h) => barsUp(w, h, [0.55, 1, 0.72], 0.14, 0.21, 0.28))
G.andriod_icons_7 = icon('black', (w, h) => barsUp(w, h, [0.28, 0.52, 0.76, 1], 0.1, 0.15, 0.22))
G.andriod_icons_39 = icon('black', (w, h) => {
  const t = T(w, h, 0.08)
  return [
    ribbon([[w * 0.1, h * 0.08], [w * 0.1, h * 0.9], [w * 0.94, h * 0.9]], t),
    ribbon([[w * 0.2, h * 0.66], [w * 0.4, h * 0.4], [w * 0.54, h * 0.6], [w * 0.84, h * 0.22]], t),
    poly([[w * 0.7, h * 0.14], [w * 0.92, h * 0.12], [w * 0.86, h * 0.34]]),
  ]
})

// ── 符号 / 标记 ─────────────────────────────────────────
G.andriod_icons_1 = icon('black', (w, h) => [plusPoly(w / 2, h / 2, w * 0.88, w * 0.2)])
G.andriod_icons_14 = icon('black', (w, h) => [plusPoly(w / 2, h / 2, w * 0.86, w * 0.19, Math.PI / 4)])
G.andriod_icons_2 = icon('black', (w, h) => [heartPath(w * 0.98, h * 0.98)])
G.andriod_icons_67 = icon('black', (w, h) => [
  ribbon([[w * 0.08, h * 0.56], [w * 0.36, h * 0.86], [w * 0.94, h * 0.14]], w * 0.16),
])
G.andriod_icons_64 = icon('black', (w, h) => {
  const R = Math.min(w, h) * 0.48
  return [hollow(starPath(w / 2, h * 0.54, R), w / 2, h * 0.54, R, R, ST(w, 0.09))]
})
G.andriod_icons_65 = icon('black', (w, h) => [starPath(w / 2, h * 0.54, Math.min(w, h) * 0.5)])
G.andriod_icons_10 = icon('black', (w, h) => [
  poly([
    [w * 0.26, h * 0.04], [w * 0.74, h * 0.04], [w * 0.74, h * 0.96],
    [w * 0.5, h * 0.72], [w * 0.26, h * 0.96],
  ]),
])
G.andriod_icons_23 = icon('black', (w, h) => {
  const t = T(w, h, 0.09)
  return [
    ribbon([[w * 0.16, h * 0.04], [w * 0.16, h * 0.96]], t),
    poly([
      [w * 0.22, h * 0.1], [w * 0.9, h * 0.16], [w * 0.72, h * 0.34],
      [w * 0.9, h * 0.52], [w * 0.22, h * 0.46],
    ]),
  ]
})
G.andriod_icons_34 = icon('black', (w, h) => {
  const s = Math.min(w, h), t = ST(w, 0.1), d = s * 0.32
  return [
    ring(0, 0, s, t),
    // 斜杠就是一条直笔画：arcPts 取 2 段会折成直角，这里直接给两端点
    ribbon([[s / 2 - d * 0.707, s / 2 - d * 0.707], [s / 2 + d * 0.707, s / 2 + d * 0.707]], t * 1.1),
  ]
})
G.andriod_icons_43 = icon('black', (w, h) => {
  const s = Math.min(w, h), c = s / 2, t = ST(w, 0.07)
  return [
    ring(0, 0, s, t),
    ellipsePath(c - s * 0.13, c - s * 0.13, s * 0.26, s * 0.26),
    ...[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a) =>
      ribbon(
        [
          [c + Math.cos(a) * s * 0.34, c + Math.sin(a) * s * 0.34],
          [c + Math.cos(a) * s * 0.5, c + Math.sin(a) * s * 0.5],
        ],
        t,
      ),
    ),
  ]
})
G.andriod_icons_42 = icon('black', (w, h) => {
  const s = Math.min(w, h), cx = s / 2, cy = s * 0.36, r = s * 0.28
  const body = poly([...arcPts(cx, cy, r, r, Math.PI * 0.72, Math.PI * 2.28, 16), [cx, s * 0.98]])
  return [cut(body, ellipsePath(cx - r * 0.46, cy - r * 0.46, r * 0.92, r * 0.92))]
})

// ── 安卓机器人 / 人物 ───────────────────────────────────
G.andriod_icons_3 = icon('black', (w, h) => {
  const cx = w / 2, R = w * 0.3, t = w * 0.055
  return [
    ribbon([[cx - R * 0.66, h * 0.12], [cx - R * 0.34, h * 0.3]], t),
    ribbon([[cx + R * 0.66, h * 0.12], [cx + R * 0.34, h * 0.3]], t),
    cut(
      poly(arcPts(cx, h * 0.5, R, R, Math.PI, Math.PI * 2, 16)),
      ellipsePath(cx - R * 0.48, h * 0.32, R * 0.2, R * 0.2),
      ellipsePath(cx + R * 0.28, h * 0.32, R * 0.2, R * 0.2),
    ),
    roundRectPath(cx - R, h * 0.56, R * 2, h * 0.26, w * 0.04),
    roundRectPath(cx - R * 1.52, h * 0.56, R * 0.36, h * 0.24, R * 0.18),
    roundRectPath(cx + R * 1.16, h * 0.56, R * 0.36, h * 0.24, R * 0.18),
    roundRectPath(cx - R * 0.66, h * 0.8, R * 0.36, h * 0.18, R * 0.1),
    roundRectPath(cx + R * 0.3, h * 0.8, R * 0.36, h * 0.18, R * 0.1),
  ]
})
G.andriod_icons_73 = icon('black', (w, h) => {
  const s = Math.min(w, h)
  return [cut(disc(s), ...personContours(s, s))]
})
G.andriod_icons_74 = icon('black', (w, h) => {
  const s = Math.min(w, h)
  const side = (x, dir) => [
    ellipsePath(x + s * 0.02, h * 0.26, s * 0.18, s * 0.18),
    poly([
      [x, h * 0.74],
      [x + dir * s * 0.02, h * 0.5],
      [x + s * 0.2, h * 0.48],
      [x + s * 0.24, h * 0.74],
    ]),
  ]
  return [
    ...side(s * 0.02, 1),
    ...side(s * 0.72, -1),
    ellipsePath(s * 0.34, h * 0.12, s * 0.32, s * 0.32),
    poly([
      [s * 0.2, h * 0.9],
      [s * 0.24, h * 0.54],
      [s * 0.5, h * 0.5],
      [s * 0.76, h * 0.54],
      [s * 0.8, h * 0.9],
    ]),
  ]
})

// ── 通知 / 通讯 ─────────────────────────────────────────
G.andriod_icons_4 = icon('black', (w, h) => {
  const s = Math.min(w, h)
  return [
    ellipsePath(s * 0.44, s * 0.02, s * 0.12, s * 0.12),
    [
      move(s * 0.16, s * 0.82),
      quad(s * 0.2, s * 0.34, s * 0.5, s * 0.12),
      quad(s * 0.8, s * 0.34, s * 0.84, s * 0.82),
      CLOSE,
    ],
    rectPath(s * 0.08, s * 0.8, s * 0.84, s * 0.1),
    ellipsePath(s * 0.4, s * 0.9, s * 0.2, s * 0.2),
  ]
})
G.andriod_icons_48 = icon('black', (w, h) => [
  sub([
    ...roundRectPath(0, 0, w * 0.94, h * 0.68, w * 0.1),
    ...poly([[w * 0.2, h * 0.64], [w * 0.38, h * 0.64], [w * 0.22, h * 0.94]]),
  ]),
])
G.andriod_icons_46 = icon('black', (w, h) => [
  cut(
    roundRectPath(w * 0.02, h * 0.2, w * 0.96, h * 0.6, w * 0.06),
    poly([
      [w * 0.1, h * 0.26], [w * 0.5, h * 0.6], [w * 0.9, h * 0.26],
      [w * 0.9, h * 0.37], [w * 0.5, h * 0.71], [w * 0.1, h * 0.37],
    ]),
  ),
])
G.andriod_icons_51 = icon('black', (w, h) => {
  // 电话：直板机轮廓 + 听筒槽 + 圆形 home 键（听筒骨形在小尺寸下会读成哑铃）
  const t = T(w, h, 0.085)
  return [
    hollowRect(w * 0.26, h * 0.04, w * 0.48, h * 0.92, w * 0.09, t),
    ribbon([[w * 0.42, h * 0.19], [w * 0.58, h * 0.19]], t * 0.8),
    ring(w * 0.44, h * 0.72, w * 0.12, t * 0.7),
  ]
})
G.andriod_icons_8 = icon('black', (w, h) => {
  const t = T(w, h, 0.07)
  return [
    hollow(roundRectPath(w * 0.2, h * 0.02, w * 0.6, h * 0.96, w * 0.3), w / 2, h / 2, w * 0.3, h * 0.48, t),
    ribbon([[w * 0.5, h * 0.12], [w * 0.5, h * 0.88]], t * 1.1),
    ribbon([[w * 0.5, h * 0.12], [w * 0.72, h * 0.32], [w * 0.28, h * 0.66]], t * 1.1),
    ribbon([[w * 0.5, h * 0.88], [w * 0.72, h * 0.68], [w * 0.28, h * 0.34]], t * 1.1),
  ]
})
G.andriod_icons_77 = icon('black', (w, h) => {
  const t = ST(w, 0.1)
  return [
    arcBand(w / 2, h * 0.9, w * 0.44, w * 0.44, t, Math.PI * 1.2, Math.PI * 1.8, 14),
    arcBand(w / 2, h * 0.9, w * 0.28, w * 0.28, t, Math.PI * 1.15, Math.PI * 1.85, 12),
    ellipsePath(w / 2 - w * 0.06, h * 0.78, w * 0.12, w * 0.12),
  ]
})
G.andriod_icons_47 = icon('black', (w, h) => {
  const t = T(w, h, 0.09)
  return [
    roundRectPath(w * 0.34, h * 0.04, w * 0.32, h * 0.5, w * 0.16),
    arcBand(w / 2, h * 0.44, w * 0.28, w * 0.28, t, 0, Math.PI, 14),
    ribbon([[w / 2, h * 0.72], [w / 2, h * 0.9]], t),
    ribbon([[w * 0.34, h * 0.92], [w * 0.66, h * 0.92]], t),
  ]
})
G.andriod_icons_76 = icon('black', (w, h) => {
  const t = T(w, h, 0.08)
  return [
    poly([
      [w * 0.04, h * 0.38], [w * 0.24, h * 0.38], [w * 0.44, h * 0.14],
      [w * 0.44, h * 0.86], [w * 0.24, h * 0.62], [w * 0.04, h * 0.62],
    ]),
    arcBand(w * 0.46, h * 0.5, w * 0.3, w * 0.3, t, -Math.PI * 0.28, Math.PI * 0.28, 10),
    arcBand(w * 0.46, h * 0.5, w * 0.46, w * 0.46, t, -Math.PI * 0.28, Math.PI * 0.28, 12),
  ]
})

// ── 办公 / 文件 ─────────────────────────────────────────
G.andriod_icons_5 = icon('black', (w, h) => {
  // 回形针 = 一大一小两个「U」套在一起；用墨迹笔画而不是镂空，29px 下才分得开
  const t = T(w, h, 0.075)
  const outer = [
    [w * 0.34, h * 0.22], [w * 0.34, h * 0.72],
    ...arcPts(w * 0.5, h * 0.72, w * 0.16, h * 0.16, Math.PI, 0, 10),
    [w * 0.66, h * 0.22],
  ]
  const inner = [
    [w * 0.42, h * 0.7], [w * 0.42, h * 0.36],
    ...arcPts(w * 0.5, h * 0.36, w * 0.08, h * 0.09, Math.PI, Math.PI * 2, 8),
    [w * 0.58, h * 0.7],
  ]
  return [
    rotAbout(ribbon(outer, t), w / 2, h / 2, Math.PI / 5),
    rotAbout(ribbon(inner, t), w / 2, h / 2, Math.PI / 5),
  ]
})
G.andriod_icons_6 = icon('black', (w, h) => {
  const s = Math.min(w, h), g = s / 13
  const out = []
  const finder = (x, y) => [
    hollowRect(x * g, y * g, g * 5, g * 5, g * 0.8, g * 1.1),
    rectPath((x + 1.6) * g, (y + 1.6) * g, g * 1.8, g * 1.8),
  ]
  out.push(...finder(0.8, 0.8), ...finder(7.2, 0.8), ...finder(0.8, 7.2))
  const pat = ['101101', '011010', '110101', '001011', '101110', '010010']
  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 6; c++) if (pat[r][c] === '1') out.push(rectPath((7.2 + c) * g, (7.2 + r) * g, g, g))
  return out
})
G.andriod_icons_9 = icon('black', (w, h) => {
  const t = T(w, h, 0.06)
  const page = (dir) =>
    poly([
      [w * 0.5, h * 0.16],
      [w * (0.5 + dir * 0.4), h * 0.1],
      [w * (0.5 + dir * 0.44), h * 0.82],
      [w * 0.5, h * 0.88],
    ])
  return [
    hollow(page(-1), w * 0.28, h * 0.5, w * 0.22, h * 0.38, t),
    hollow(page(1), w * 0.72, h * 0.5, w * 0.22, h * 0.38, t),
    ribbon([[w * 0.5, h * 0.16], [w * 0.5, h * 0.88]], t * 1.3),
  ]
})
G.andriod_icons_12 = icon('black', (w, h) => {
  const t = T(w, h, 0.07)
  return [
    ribbon([[w * 0.36, h * 0.26], [w * 0.36, h * 0.14], [w * 0.64, h * 0.14], [w * 0.64, h * 0.26]], t),
    rectPath(w * 0.04, h * 0.42, w * 0.92, h * 0.06),
    cut(
      roundRectPath(w * 0.04, h * 0.24, w * 0.92, h * 0.62, w * 0.06),
      rectPath(w * 0.44, h * 0.48, w * 0.12, h * 0.16),
    ),
  ]
})
G.andriod_icons_13 = icon('black', (w, h) => {
  const t = T(w, h, 0.07)
  const out = [
    hollowRect(w * 0.06, h * 0.14, w * 0.88, h * 0.78, w * 0.06, t),
    rectPath(w * 0.06, h * 0.14, w * 0.88, h * 0.18),
    ribbon([[w * 0.28, h * 0.06], [w * 0.28, h * 0.2]], t * 1.1),
    ribbon([[w * 0.72, h * 0.06], [w * 0.72, h * 0.2]], t * 1.1),
  ]
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 4; c++) out.push(rectPath(w * (0.18 + c * 0.21), h * (0.42 + r * 0.17), w * 0.11, h * 0.09))
  return out
})
G.andriod_icons_17 = icon('black', (w, h) => {
  const t = T(w, h, 0.07)
  return [
    ribbon([[w * 0.42, h * 0.06], [w * 0.86, h * 0.06], [w * 0.86, h * 0.62]], t),
    hollowRect(w * 0.12, h * 0.22, w * 0.62, h * 0.72, w * 0.04, t),
    rectPath(w * 0.24, h * 0.38, w * 0.38, t * 0.8),
    rectPath(w * 0.24, h * 0.54, w * 0.38, t * 0.8),
    rectPath(w * 0.24, h * 0.7, w * 0.22, t * 0.8),
  ]
})
G.andriod_icons_24 = icon('black', (w, h) => [
  poly([
    [w * 0.04, h * 0.22], [w * 0.36, h * 0.22], [w * 0.46, h * 0.34],
    [w * 0.96, h * 0.34], [w * 0.96, h * 0.84], [w * 0.04, h * 0.84],
  ]),
])
G.andriod_icons_25 = icon('black', (w, h) => {
  const t = T(w, h, 0.07)
  return [
    poly([
      [w * 0.04, h * 0.2], [w * 0.36, h * 0.2], [w * 0.46, h * 0.32],
      [w * 0.96, h * 0.32], [w * 0.96, h * 0.48], [w * 0.04, h * 0.48],
    ]),
    hollow(
      poly([
        [w * 0.04, h * 0.42], [w * 0.3, h * 0.42], [w * 0.42, h * 0.56],
        [w * 0.98, h * 0.56], [w * 0.84, h * 0.9], [w * 0.02, h * 0.9],
      ]),
      w * 0.5, h * 0.66, w * 0.48, h * 0.24, t,
    ),
  ]
})
G.andriod_icons_60 = icon('black', (w, h) => {
  const t = T(w, h, 0.07)
  return [
    cut(
      poly([[w * 0.08, h * 0.06], [w * 0.78, h * 0.06], [w * 0.94, h * 0.22], [w * 0.94, h * 0.94], [w * 0.08, h * 0.94]]),
      rectPath(w * 0.26, h * 0.1, w * 0.4, h * 0.22),
    ),
    rectPath(w * 0.44, h * 0.12, w * 0.1, h * 0.18),
    hollowRect(w * 0.22, h * 0.52, w * 0.56, h * 0.34, w * 0.02, t),
  ]
})

// ── 设备 / 多媒体 ───────────────────────────────────────
G.andriod_icons_11 = icon('black', (w, h) => {
  const s = Math.min(w, h), cx = s / 2
  return [
    cut(
      sub([
        ...roundRectPath(s * 0.02, s * 0.22, s * 0.96, s * 0.62, s * 0.08),
        ...roundRectPath(s * 0.3, s * 0.1, s * 0.3, s * 0.16, s * 0.05),
      ]),
      ellipsePath(cx - s * 0.19, s * 0.35, s * 0.38, s * 0.38),
    ),
    ellipsePath(cx - s * 0.1, s * 0.44, s * 0.2, s * 0.2),
  ]
})
G.andriod_icons_75 = icon('black', (w, h) => [
  roundRectPath(w * 0.04, h * 0.24, w * 0.6, h * 0.52, w * 0.08),
  poly([[w * 0.68, h * 0.4], [w * 0.96, h * 0.22], [w * 0.96, h * 0.78], [w * 0.68, h * 0.6]]),
])
G.andriod_icons_49 = icon('black', (w, h) => [
  // 齿孔与画格都是镂空，彼此绝不能重叠（evenodd 一叠就补回实心）
  cut(
    rectPath(w * 0.04, h * 0.14, w * 0.92, h * 0.72),
    ...[0, 1, 2, 3].flatMap((i) => [
      rectPath(w * 0.08, h * (0.2 + i * 0.17), w * 0.08, h * 0.1),
      rectPath(w * 0.84, h * (0.2 + i * 0.17), w * 0.08, h * 0.1),
    ]),
    ...[0, 1, 2].map((i) => rectPath(w * (0.26 + i * 0.19), h * 0.24, w * 0.13, h * 0.52)),
  ),
])
G.andriod_icons_50 = icon('black', (w, h) => {
  const t = T(w, h, 0.08)
  return [
    rectPath(w * 0.32, h * 0.12, t, h * 0.58),
    rectPath(w * 0.76, h * 0.06, t, h * 0.58),
    poly([[w * 0.32, h * 0.12], [w * 0.84, h * 0.06], [w * 0.84, h * 0.2], [w * 0.32, h * 0.26]]),
    ellipsePath(w * 0.16, h * 0.62, w * 0.24, h * 0.2),
    ellipsePath(w * 0.6, h * 0.56, w * 0.24, h * 0.2),
  ]
})
G.andriod_icons_15 = icon('black', (w, h) => {
  const t = T(w, h, 0.08)
  return [
    ribbon([[w * 0.04, h * 0.12], [w * 0.18, h * 0.2], [w * 0.28, h * 0.44]], t),
    poly([[w * 0.24, h * 0.36], [w * 0.96, h * 0.36], [w * 0.84, h * 0.68], [w * 0.32, h * 0.68]]),
    ellipsePath(w * 0.34, h * 0.76, w * 0.16, w * 0.16),
    ellipsePath(w * 0.7, h * 0.76, w * 0.16, w * 0.16),
  ]
})
G.andriod_icons_36 = icon('black', (w, h) => [
  cut(
    poly([
      [w * 0.5, h * 0.04], [w * 0.98, h * 0.46], [w * 0.82, h * 0.46],
      [w * 0.82, h * 0.94], [w * 0.18, h * 0.94], [w * 0.18, h * 0.46], [w * 0.02, h * 0.46],
    ]),
    rectPath(w * 0.4, h * 0.58, w * 0.2, h * 0.3),
  ),
])
G.andriod_icons_70 = icon('black', (w, h) => [
  poly([
    [w * 0.3, h * 0.1], [w * 0.44, h * 0.04], [w * 0.56, h * 0.14], [w * 0.72, h * 0.12],
    [w * 0.96, h * 0.3], [w * 0.8, h * 0.46], [w * 0.72, h * 0.4], [w * 0.72, h * 0.94],
    [w * 0.28, h * 0.94], [w * 0.28, h * 0.4], [w * 0.2, h * 0.46], [w * 0.04, h * 0.3],
  ]),
])
G.andriod_icons_18 = icon('black', (w, h) => [
  // 云：三团墨 + 平底，重叠无妨（各自独立子路径），比单条多边形轮廓稳得多
  ellipsePath(w * 0.05, h * 0.4, w * 0.42, h * 0.39),
  ellipsePath(w * 0.24, h * 0.1, w * 0.48, h * 0.5),
  ellipsePath(w * 0.46, h * 0.32, w * 0.49, h * 0.47),
  rectPath(w * 0.05, h * 0.58, w * 0.9, h * 0.2),
])

// ── 播放控制 ────────────────────────────────────────────
const triR = (x, y, s) => poly([[x, y], [x, y + s], [x + s * 0.82, y + s / 2]])
const triL = (x, y, s) => poly([[x, y], [x, y + s], [x - s * 0.82, y + s / 2]])

G.andriod_icons_55 = icon('black', (w, h) => [triR(w * 0.24, h * 0.14, h * 0.72)])
G.andriod_icons_54 = icon('black', (w, h) => {
  const bw = w * 0.2
  return [rectPath(w * 0.26, h * 0.14, bw, h * 0.72), rectPath(w * 0.54, h * 0.14, bw, h * 0.72)]
})
G.andriod_icons_59 = icon('black', (w, h) => [rectPath(w * 0.22, h * 0.22, w * 0.56, h * 0.56)])
G.andriod_icons_52 = icon('black', (w, h) => [triR(w * 0.12, h * 0.18, h * 0.64), triR(w * 0.52, h * 0.18, h * 0.64)])
G.andriod_icons_56 = icon('black', (w, h) => [triL(w * 0.88, h * 0.18, h * 0.64), triL(w * 0.48, h * 0.18, h * 0.64)])
G.andriod_icons_53 = icon('black', (w, h) => [
  triR(w * 0.14, h * 0.18, h * 0.64),
  triR(w * 0.46, h * 0.18, h * 0.64),
  rectPath(w * 0.78, h * 0.18, w * 0.1, h * 0.64),
])
G.andriod_icons_58 = icon('black', (w, h) => [
  rectPath(w * 0.14, h * 0.18, w * 0.1, h * 0.64),
  triL(w * 0.86, h * 0.18, h * 0.64),
  triL(w * 0.54, h * 0.18, h * 0.64),
])
G.andriod_icons_16 = icon('black', (w, h) => {
  const t = ST(w, 0.09), cx = w / 2, cy = h / 2
  return [
    ring(0, 0, Math.min(w, h), t),
    ribbon([[cx, cy], [cx, h * 0.26]], t),
    ribbon([[cx, cy], [w * 0.72, cy]], t),
  ]
})
G.andriod_icons_57 = icon('black', (w, h) => {
  // 循环播放：两条对向直箭头，比断开的椭圆环在小尺寸下清楚得多
  const t = T(w, h, 0.1)
  return [
    ribbon([[w * 0.14, h * 0.36], [w * 0.7, h * 0.36]], t),
    poly([[w * 0.62, h * 0.16], [w * 0.92, h * 0.36], [w * 0.62, h * 0.56]]),
    ribbon([[w * 0.86, h * 0.64], [w * 0.3, h * 0.64]], t),
    poly([[w * 0.38, h * 0.44], [w * 0.08, h * 0.64], [w * 0.38, h * 0.84]]),
  ]
})

// ── 编辑 / 排版 ─────────────────────────────────────────
G.andriod_icons_66 = icon('black', (w, h) => {
  const t = T(w, h, 0.08)
  return [
    poly([[w * 0.3, h * 0.64], [w * 0.64, h * 0.3], [w * 0.8, h * 0.46], [w * 0.46, h * 0.8]]),
    poly([[w * 0.3, h * 0.64], [w * 0.2, h * 0.88], [w * 0.46, h * 0.8]]),
    poly([[w * 0.64, h * 0.3], [w * 0.72, h * 0.12], [w * 0.92, h * 0.32], [w * 0.8, h * 0.46]]),
    ribbon([[w * 0.06, h * 0.94], [w * 0.44, h * 0.94]], t),
  ]
})
G.andriod_icons_28 = icon('black', (w, h) => {
  const t = w * 0.13
  return [
    ribbon([[w * 0.1, h * 0.5], [w * 0.34, h * 0.76], [w * 0.86, h * 0.2]], t),
    ribbon([[w * 0.3, h * 0.66], [w * 0.5, h * 0.88], [w * 0.96, h * 0.36]], t),
  ]
})
G.andriod_icons_41 = icon('black', (w, h) => {
  const t = Math.max(1.6, h * 0.09)
  return [0.16, 0.38, 0.6, 0.82].map((y, i) => rectPath(w * 0.08, h * y - t / 2, w * (i % 2 ? 0.6 : 0.84), t))
})
/** 字母 A：两笔斜划 + 横担（字腔镂空会与横担自交，一律走墨迹） */
const glyphA = (x, y, gw, gh, t) => [
  ribbon([[x + gw / 2, y], [x, y + gh]], t),
  ribbon([[x + gw / 2, y], [x + gw, y + gh]], t),
  rectPath(x + gw * 0.2, y + gh * 0.56, gw * 0.6, t * 0.8),
]
G.andriod_icons_26 = icon('black', (w, h) => [
  ...glyphA(w * 0.02, h * 0.08, w * 0.6, h * 0.84, w * 0.1),
  ...glyphA(w * 0.62, h * 0.36, w * 0.36, h * 0.56, w * 0.08),
])
G.andriod_icons_63 = icon('black', (w, h) => {
  const t = w * 0.07
  return [
    ...glyphA(w * 0.02, h * 0.26, w * 0.3, h * 0.48, t),
    ribbon([[w * 0.38, h * 0.5], [w * 0.54, h * 0.5]], t),
    poly([[w * 0.52, h * 0.36], [w * 0.64, h * 0.5], [w * 0.52, h * 0.64]]),
    rectPath(w * 0.7, h * 0.26, w * 0.28, t),
    ribbon([[w * 0.96, h * 0.28], [w * 0.72, h * 0.72]], t),
    rectPath(w * 0.7, h * 0.74, w * 0.28, t),
  ]
})
G.andriod_icons_29 = icon('black', (w, h) => {
  const t = w * 0.12
  return [
    ribbon(
      [
        [w * 0.26, h * 0.06], [w * 0.26, h * 0.56],
        ...arcPts(w * 0.5, h * 0.56, w * 0.24, h * 0.24, Math.PI, 0, 10),
        [w * 0.74, h * 0.06],
      ],
      t,
    ),
    rectPath(w * 0.16, h * 0.9, w * 0.68, w * 0.08),
  ]
})
G.andriod_icons_30 = icon('black', (w, h) => {
  // 斜体：上下横担要「套在」斜笔两端的中点上，横担端点连着笔尖就会读成 Z
  const t = w * 0.15
  return [
    ribbon([[w * 0.4, h * 0.1], [w * 0.8, h * 0.1]], w * 0.08),
    ribbon([[w * 0.6, h * 0.12], [w * 0.4, h * 0.88]], t),
    ribbon([[w * 0.2, h * 0.9], [w * 0.6, h * 0.9]], w * 0.08),
  ]
})
G.andriod_icons_31 = icon('black', (w, h) => {
  const outer = [
    [w * 0.22, h * 0.04], [w * 0.58, h * 0.04],
    ...arcPts(w * 0.58, h * 0.27, w * 0.22, h * 0.23, -Math.PI / 2, Math.PI / 2, 10),
    [w * 0.62, h * 0.5],
    ...arcPts(w * 0.62, h * 0.73, w * 0.24, h * 0.23, -Math.PI / 2, Math.PI / 2, 10),
    [w * 0.22, h * 0.96],
  ]
  const bowl = (cy, rin) => [
    [w * 0.36, cy - rin * 1.05], [w * 0.56, cy - rin * 1.05],
    ...arcPts(w * 0.56, cy, rin * 0.95, rin, -Math.PI / 2, Math.PI / 2, 8),
    [w * 0.36, cy + rin * 1.05],
  ]
  return [cut(poly(outer), poly(bowl(h * 0.27, h * 0.11)), poly(bowl(h * 0.73, h * 0.11)))]
})
G.andriod_icons_32 = icon('black', (w, h) => {
  // 撤销：折线笔画 + 独立三角头，两者叠加不会自交成实心块
  const t = w * 0.16
  return [
    ribbon([[w * 0.86, h * 0.88], [w * 0.72, h * 0.52], [w * 0.5, h * 0.34], [w * 0.16, h * 0.34]], t),
    poly([[w * 0.32, h * 0.1], [w * 0.04, h * 0.34], [w * 0.32, h * 0.58]]),
  ]
})
G.andriod_icons_33 = icon('black', (w, h) => {
  const t = w * 0.16
  return [
    ribbon([[w * 0.14, h * 0.88], [w * 0.28, h * 0.52], [w * 0.5, h * 0.34], [w * 0.84, h * 0.34]], t),
    poly([[w * 0.68, h * 0.1], [w * 0.96, h * 0.34], [w * 0.68, h * 0.58]]),
  ]
})
G.andriod_icons_71 = icon('black', (w, h) => {
  const t = T(w, h, 0.1), s = Math.min(w, h), c = s / 2, R = s * 0.38
  const a0 = Math.PI * 0.62
  return [
    arcBand(c, c, R, R, t, a0, a0 + Math.PI * 1.7, 22),
    tipPoly(c + Math.cos(a0) * R, c + Math.sin(a0) * R, Math.sin(a0), -Math.cos(a0), -Math.cos(a0), -Math.sin(a0), R * 0.3),
  ]
})
G.andriod_icons_72 = icon('black', (w, h) => {
  const t = T(w, h, 0.1)
  return [
    ribbon([[w * 0.16, h * 0.3], [w * 0.62, h * 0.3]], t),
    poly([[w * 0.3, h * 0.08], [w * 0.06, h * 0.3], [w * 0.3, h * 0.52]]),
    ribbon([[w * 0.62, h * 0.3], [w * 0.88, h * 0.46], [w * 0.66, h * 0.9]], t),
  ]
})

// ── 系统 / 操作 ─────────────────────────────────────────
G.andriod_icons_19 = icon('black', (w, h) => {
  const t = T(w, h, 0.1)
  return [
    ribbon([[w * 0.5, h * 0.08], [w * 0.5, h * 0.64]], t),
    poly([[w * 0.24, h * 0.44], [w * 0.5, h * 0.76], [w * 0.76, h * 0.44]]),
    rectPath(w * 0.08, h * 0.86, w * 0.84, t),
  ]
})
G.andriod_icons_20 = icon('black', (w, h) => {
  const t = T(w, h, 0.1)
  return [
    ribbon([[w * 0.44, h * 0.08], [w * 0.08, h * 0.08], [w * 0.08, h * 0.92], [w * 0.44, h * 0.92]], t),
    ribbon([[w * 0.34, h * 0.5], [w * 0.84, h * 0.5]], t),
    poly([[w * 0.66, h * 0.28], [w * 0.96, h * 0.5], [w * 0.66, h * 0.72]]),
  ]
})
G.andriod_icons_21 = icon('black', (w, h) => {
  const t = T(w, h, 0.08)
  return [
    hollowRect(w * 0.04, h * 0.04, w * 0.92, h * 0.92, w * 0.08, t),
    ribbon([[w * 0.68, h * 0.2], [w * 0.46, h * 0.2], [w * 0.46, h * 0.86]], t * 1.2),
    ribbon([[w * 0.3, h * 0.44], [w * 0.64, h * 0.44]], t),
  ]
})
G.andriod_icons_22 = icon('black', (w, h) => {
  const t = T(w, h, 0.09)
  return [
    hollowRect(w * 0.04, h * 0.04, w * 0.92, h * 0.92, w * 0.06, t),
    ellipsePath(w * 0.16, h * 0.7, w * 0.14, w * 0.14),
    arcBand(w * 0.2, h * 0.86, w * 0.34, w * 0.34, t, Math.PI * 1.5, Math.PI * 2, 10),
    arcBand(w * 0.2, h * 0.86, w * 0.6, w * 0.6, t, Math.PI * 1.5, Math.PI * 2, 14),
  ]
})
G.andriod_icons_27 = icon('black', (w, h) => {
  const s = Math.min(w, h), c = s / 2, R = s * 0.46, r = s * 0.33, n = 8
  const pts = [], step = (Math.PI * 2) / n, k = 0.3
  for (let i = 0; i < n; i++) {
    const a = i * step
    pts.push(
      [c + Math.cos(a - step * k) * R, c + Math.sin(a - step * k) * R],
      [c + Math.cos(a + step * k) * R, c + Math.sin(a + step * k) * R],
      [c + Math.cos(a + step * (0.5 - k * 0.7)) * r, c + Math.sin(a + step * (0.5 - k * 0.7)) * r],
      [c + Math.cos(a + step * (0.5 + k * 0.7)) * r, c + Math.sin(a + step * (0.5 + k * 0.7)) * r],
    )
  }
  return [cut(poly(pts), ellipsePath(c - s * 0.15, c - s * 0.15, s * 0.3, s * 0.3))]
})
G.andriod_icons_35 = icon('black', (w, h) => {
  const s = Math.min(w, h), t = ST(w, 0.08), cx = s / 2
  return [
    ring(0, 0, s, t),
    arcBand(cx, s * 0.38, s * 0.15, s * 0.15, t, -Math.PI * 0.95, Math.PI * 0.3, 12),
    ribbon([[cx + s * 0.15, s * 0.44], [cx, s * 0.56], [cx, s * 0.64]], t),
    ellipsePath(cx - s * 0.055, s * 0.73, s * 0.11, s * 0.11),
  ]
})
G.andriod_icons_37 = icon('black', (w, h) => {
  const t = T(w, h, 0.1), s = Math.min(w, h)
  return [
    arcBand(s / 2, s / 2, s * 0.4, s * 0.4, t, -Math.PI * 0.28, Math.PI * 1.28, 20),
    ribbon([[s / 2, s * 0.06], [s / 2, s * 0.5]], t),
  ]
})
G.andriod_icons_38 = icon('black', (w, h) => {
  const t = T(w, h, 0.07)
  return [
    hollowRect(w * 0.06, h * 0.44, w * 0.2, h * 0.46, w * 0.03, t),
    poly([
      [w * 0.32, h * 0.9], [w * 0.32, h * 0.42], [w * 0.46, h * 0.36],
      [w * 0.54, h * 0.06], [w * 0.68, h * 0.1], [w * 0.62, h * 0.38],
      [w * 0.9, h * 0.4], [w * 0.96, h * 0.52], [w * 0.88, h * 0.6],
      [w * 0.96, h * 0.68], [w * 0.88, h * 0.76], [w * 0.94, h * 0.84], [w * 0.84, h * 0.9],
    ]),
  ]
})
G.andriod_icons_40 = icon('black', (w, h) => {
  // 链接：两枚圆环沿对角线相扣，后面的环壁正好穿过前面环的字腔
  const s = Math.min(w, h), t = ST(w, 0.1), d = s * 0.5
  return [
    ring(w * 0.38 - d / 2, h * 0.38 - d / 2, d, t),
    ring(w * 0.62 - d / 2, h * 0.62 - d / 2, d, t),
  ]
})
const shackle = (w, h, t) => arcBand(w / 2, h * 0.44, w * 0.2, w * 0.24, t, Math.PI, Math.PI * 2, 12)
G.andriod_icons_44 = icon('black', (w, h) => {
  const t = T(w, h, 0.1)
  return [
    shackle(w, h, t),
    ribbon([[w * 0.3, h * 0.44], [w * 0.3, h * 0.52]], t),
    ribbon([[w * 0.7, h * 0.44], [w * 0.7, h * 0.52]], t),
    roundRectPath(w * 0.2, h * 0.48, w * 0.6, h * 0.46, w * 0.06),
  ]
})
G.andriod_icons_45 = icon('black', (w, h) => {
  const t = T(w, h, 0.1)
  return [
    arcBand(w * 0.62, h * 0.4, w * 0.2, w * 0.24, t, Math.PI * 1.1, Math.PI * 2.2, 12),
    ribbon([[w * 0.42, h * 0.4], [w * 0.42, h * 0.52]], t),
    roundRectPath(w * 0.2, h * 0.48, w * 0.6, h * 0.46, w * 0.06),
  ]
})
G.andriod_icons_61 = icon('black', (w, h) => {
  const d = Math.min(w, h) * 0.62, t = ST(w, 0.1)
  return [
    ring(w * 0.05, h * 0.05, d, t),
    ribbon([[w * 0.05 + d * 0.8, h * 0.05 + d * 0.8], [w * 0.95, h * 0.95]], t * 1.5),
  ]
})
G.andriod_icons_62 = icon('black', (w, h) => {
  const t = T(w, h, 0.08), r = w * 0.11
  const node = (x, y) => ellipsePath(x - r, y - r, r * 2, r * 2)
  return [
    ribbon([[w * 0.22, h * 0.5], [w * 0.78, h * 0.2], [w * 0.78, h * 0.8], [w * 0.22, h * 0.5]], t),
    node(w * 0.22, h * 0.5),
    node(w * 0.78, h * 0.2),
    node(w * 0.78, h * 0.8),
  ]
})
G.andriod_icons_68 = icon('black', (w, h) => {
  const g = w * 0.27, gap = w * 0.075, out = []
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) out.push(roundRectPath(w * 0.02 + c * (g + gap), h * 0.02 + r * (g + gap), g, g, w * 0.02))
  return out
})
G.andriod_icons_69 = icon('black', (w, h) => {
  const g = w * 0.4
  return [
    roundRectPath(w * 0.06, h * 0.06, g, g, w * 0.03),
    roundRectPath(w * 0.54, h * 0.06, g, g, w * 0.03),
    roundRectPath(w * 0.06, h * 0.54, g, g, w * 0.03),
    roundRectPath(w * 0.54, h * 0.54, g, g, w * 0.03),
  ]
})
G.andriod_icons_78 = icon('black', (w, h) => [
  cut(
    roundRectPath(w * 0.04, h * 0.04, w * 0.92, h * 0.92, w * 0.1),
    poly([
      [w * 0.24, h * 0.5], [w * 0.44, h * 0.7], [w * 0.78, h * 0.28],
      [w * 0.78, h * 0.42], [w * 0.44, h * 0.84], [w * 0.24, h * 0.64],
    ]),
  ),
])
G.andriod_icons_79 = icon('black', (w, h) => [
  hollowRect(w * 0.08, h * 0.08, w * 0.84, h * 0.84, w * 0.02, w * 0.14),
])
G.andriod_icons_80 = icon('black', (w, h) => [ring(0, 0, Math.min(w, h), w * 0.14)])
G.andriod_icons_81 = icon('black', (w, h) => {
  const s = Math.min(w, h), r = s * 0.2
  return [ring(0, 0, s, s * 0.11), ellipsePath(s / 2 - r, s / 2 - r, r * 2, r * 2)]
})
