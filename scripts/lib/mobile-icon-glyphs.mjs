/**
 * iOS 状态/操作图标的手绘矢量库（旧 ios_icons 分类）。
 *
 * 旧素材这 54 个图标是「rectangle + PNG 图片填充」（/images/designer/ios_icons/*.png），
 * 既不能改色也不能缩放保真，与本项目「全部可编辑矢量」的口径冲突，所以逐个重画。
 *
 * 单色墨迹模型：一枚图标只有一种墨色，墨色写在图形级 fillStyle 上，字形子路径一律
 * 不带自己的颜色 —— 面板改「填充色」即整体换色（若子路径各自写死颜色，改色就失效，
 * 这是上一版 GUI 探针实测出的问题）。为此：
 *   · 笔画不用描边，折线加粗成填充多边形（ribbon），渲染器也没有线端样式；
 *   · 圆环/空心体用同一子路径的 evenodd 内轮廓挖空（hollow）；
 *   · 徽标里的反白符号同样做成镂空，整枚图标仍是单色。
 * 墨色差异（黑/蓝/绿/红）只体现在图形级 fillStyle，字形本身与颜色无关。
 *
 * 坐标一律写在图形的默认尺寸（w×h）里，生成器会统一比例化，缩放时细节跟随。
 */
import {
  CLOSE,
  ellipsePath,
  line,
  move,
  quad,
  rectPath,
  roundRectPath,
  sub,
} from './mobile-glyphs.mjs'

export const BLACK = '51,51,51'
export const BLUE = '10,132,255'
export const GREEN = '90,200,125'
export const RED = '235,61,54'
export const WHITE = '255,255,255'
const INK = { black: BLACK, blue: BLUE, green: GREEN, red: RED, white: WHITE }

const r2 = (v) => Math.round(v * 100) / 100
/** 笔画厚度随图标尺寸走，下限 1.5px 免得缩略图上糊成一团 */
const ST = (w, k = 0.13) => Math.max(1.5, w * k)

/** 多边形（闭合） */
const poly = (pts) =>
  pts.map(([x, y], i) => (i ? line(r2(x), r2(y)) : move(r2(x), r2(y)))).concat(CLOSE)

/** 折线加粗成填充多边形：逐点取相邻两段的平均法向，得到斜接轮廓 */
const ribbon = (pts, t) => {
  const left = [], right = []
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)]
    const b = pts[Math.min(pts.length - 1, i + 1)]
    const dx = b[0] - a[0], dy = b[1] - a[1]
    const len = Math.hypot(dx, dy) || 1
    const nx = (-dy / len) * (t / 2), ny = (dx / len) * (t / 2)
    left.push([pts[i][0] + nx, pts[i][1] + ny])
    right.push([pts[i][0] - nx, pts[i][1] - ny])
  }
  return poly([...left, ...right.reverse()])
}

/** 十字（rot=45° 即叉）：单轮廓，避免两根条在 evenodd 镂空里互相补实 */
const plusPoly = (cx, cy, L, t, rot = 0) => {
  const h = L / 2, q = t / 2
  const pts = [
    [-q, -h], [q, -h], [q, -q], [h, -q], [h, q], [q, q],
    [q, h], [-q, h], [-q, q], [-h, q], [-h, -q], [-q, -q],
  ]
  const c = Math.cos(rot), s = Math.sin(rot)
  return poly(pts.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]))
}

/** 以 (cx,cy) 为中心把轮廓缩 kx/ky 倍（curve/quadraticCurve 的控制点一起缩） */
const scaleAbout = (actions, cx, cy, kx, ky = kx) =>
  actions.map((a) => {
    const X = (v) => r2(cx + (v - cx) * kx)
    const Y = (v) => r2(cy + (v - cy) * ky)
    switch (a.action) {
      case 'move':
      case 'line':
        return { ...a, x: X(a.x), y: Y(a.y) }
      case 'curve':
        return { ...a, x1: X(a.x1), y1: Y(a.y1), x2: X(a.x2), y2: Y(a.y2), x: X(a.x), y: Y(a.y) }
      case 'quadraticCurve':
        return { ...a, x1: X(a.x1), y1: Y(a.y1), x: X(a.x), y: Y(a.y) }
      default:
        return a
    }
  })

/**
 * 空心轮廓：外轮廓 + 内轮廓写进同一子路径，evenodd 挖空 → 单色的「描边」观感。
 * rx/ry 为外轮廓半宽半高，t 为壁厚（两轴各自等比，非正方形轮廓也均匀）。
 */
const hollow = (actions, cx, cy, rx, ry, t) => ({
  actions: [
    ...actions,
    ...scaleAbout(actions, cx, cy, Math.max(0.15, (rx - t) / rx), Math.max(0.15, (ry - t) / ry)),
  ],
  fillRule: 'evenodd',
})
const ring = (x, y, d, t) => hollow(ellipsePath(x, y, d, d), x + d / 2, y + d / 2, d / 2, d / 2, t)

/** 圆弧带：a0→a1 的环段（canvas y 轴向下，角度递增即顺时针） */
const arcBand = (cx, cy, rx, ry, t, a0, a1, n = 16) => {
  const outer = [], inner = []
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n
    const c = Math.cos(a), s = Math.sin(a)
    outer.push([cx + c * rx, cy + s * ry])
    inner.push([cx + c * (rx - t), cy + s * (ry - t)])
  }
  return poly([...outer, ...inner.reverse()])
}
/** 弧端箭头：dir 为行进方向（单位切向），nrm 为法向（单位半径向），s 为箭头大小 */
const tipPoly = (px, py, dirx, diry, nrmx, nrmy, s) =>
  poly([
    [px + dirx * s * 1.5, py + diry * s * 1.5],
    [px - dirx * s * 0.2 + nrmx * s, py - diry * s * 0.2 + nrmy * s],
    [px - dirx * s * 0.2 - nrmx * s, py - diry * s * 0.2 - nrmy * s],
  ])

/** 五角星轮廓 */
export const starPath = (cx, cy, R, rot = -Math.PI / 2) => {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const a = rot + (Math.PI * i) / 5
    const rr = i % 2 ? R * 0.42 : R
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
  }
  return poly(pts)
}
/** 折线近似圆弧（本项目渲染器没有 arc 动作，24 段在图标尺度足够光滑） */
export const arcPoly = (cx, cy, rx, ry, a0, a1, n = 24) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n
    return (i ? line : move)(r2(cx + Math.cos(a) * rx), r2(cy + Math.sin(a) * ry))
  })

// ── 圆底徽标内的符号：一律返回「轮廓数组」，filled 变体把它们做成镂空 ──
const mPlus = (w, h) => [plusPoly(w / 2, h / 2, w * 0.56, w * 0.16)]
const mMinus = (w, h) => {
  const L = w * 0.56, t = w * 0.16
  return [rectPath(w / 2 - L / 2, h / 2 - t / 2, L, t)]
}
const mCross = (w, h) => [plusPoly(w / 2, h / 2, w * 0.56, w * 0.15, Math.PI / 4)]
const mCheck = (w, h) => [
  ribbon([[w * 0.26, h * 0.52], [w * 0.42, h * 0.7], [w * 0.76, h * 0.3]], w * 0.15),
]
const mInfo = (w, h) => {
  const d = w * 0.14
  return [
    ellipsePath(w / 2 - d / 2, h * 0.2, d, d),
    rectPath(w / 2 - w * 0.06, h * 0.39, w * 0.12, h * 0.34),
  ]
}
const mPlay = (w, h) => [poly([[w * 0.37, h * 0.27], [w * 0.37, h * 0.73], [w * 0.72, h * 0.5]])]
const mPause = (w, h) => {
  const t = w * 0.13
  return [
    rectPath(w / 2 - t * 1.7, h * 0.3, t, h * 0.4),
    rectPath(w / 2 + 0.7 * t, h * 0.3, t, h * 0.4),
  ]
}
const mStop = (w, h) => [rectPath(w * 0.34, h * 0.34, w * 0.32, h * 0.32)]

/**
 * 圆底徽标。
 *   filled  实心圆底 + 符号镂空（单色，改色后镂空仍透出画布底色）
 *   outline 圆环 + 同色符号
 *   bare    无底，只有符号
 */
const badge = (mark, variant, color) =>
  icon(color, (w, h) => {
    const contours = mark(w, h)
    if (variant === 'filled') {
      return [sub([...ellipsePath(0, 0, w, h), ...contours.flat()], { fillRule: 'evenodd' })]
    }
    const out = []
    if (variant === 'outline') out.push(ring(0, 0, Math.min(w, h), ST(w, 0.1)))
    return [...out, ...contours]
  })

/** 带左尖角的标签底（旧 close2/3/4 的容器形状），叉居中在圆头部分 */
const tagPath = (w, h) => [
  move(0, h / 2),
  line(w * 0.22, h * 0.15),
  quad(w * 0.62, -h * 0.12, w * 0.9, h * 0.14),
  quad(w * 1.12, h * 0.5, w * 0.9, h * 0.86),
  quad(w * 0.62, h * 1.12, w * 0.22, h * 0.85),
  CLOSE,
]
const tagCross = (w, h) => [plusPoly(w * 0.62, h / 2, h * 0.5, h * 0.15, Math.PI / 4)]
const tag = (variant, color) =>
  icon(color, (w, h) => {
    const body = tagPath(w, h)
    if (variant === 'filled') {
      return [sub([...body, ...tagCross(w, h).flat()], { fillRule: 'evenodd' })]
    }
    return [hollow(body, w / 2, h / 2, w / 2 - 1, h / 2 - 1, ST(w, 0.07)), ...tagCross(w, h)]
  })

/**
 * 图标条目工厂：墨色只出现在图形级 fillStyle / lineStyle 上，
 * 字形子路径保持无色（继承），面板改「填充色」即整体换色。
 */
const icon = (color, subPaths) => ({
  fill: { type: 'solid', color: INK[color] },
  line: { lineWidth: 0, lineColor: INK[color] },
  subPaths,
})

/** 环形箭头（刷新）：留 1 弧度的缺口，箭头在尾端沿切向 */
const refresh = (w, h, t) => {
  const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.4
  const a0 = -Math.PI * 0.3, a1 = a0 + Math.PI * 1.85
  const dx = -Math.sin(a1), dy = Math.cos(a1)
  return [
    arcBand(cx, cy, R, R, t, a0, a1, 20),
    tipPoly(cx + Math.cos(a1) * R, cy + Math.sin(a1) * R, dx, dy, Math.cos(a1), Math.sin(a1), R * 0.26),
  ]
}

/** 声波/信号的同心弧带 */
const waves = (cx, cy, r0, gap, n, t, span = 0.85, ry = 1.1) =>
  Array.from({ length: n }, (_, i) =>
    arcBand(cx, cy, r0 + i * gap, (r0 + i * gap) * ry, t, -Math.PI / 2 - span, -Math.PI / 2 + span, 10),
  )

/** 人形轮廓：头 + 肩（作为镂空或实心都用同一组轮廓） */
const personContours = (w, h) => {
  const cx = w / 2
  return [
    ellipsePath(cx - w * 0.13, h * 0.17, w * 0.26, w * 0.26),
    poly([
      [cx - w * 0.27, h * 0.85],
      [cx - w * 0.24, h * 0.55],
      [cx, h * 0.52],
      [cx + w * 0.24, h * 0.55],
      [cx + w * 0.27, h * 0.85],
    ]),
  ]
}

const heartPath = (w, h) => {
  const cx = w / 2
  return [
    move(cx, h * 0.9),
    quad(-w * 0.06, h * 0.5, w * 0.12, h * 0.2),
    quad(w * 0.3, h * 0.0, cx, h * 0.28),
    quad(w - w * 0.3, h * 0.0, w * 0.88, h * 0.2),
    quad(w * 1.06, h * 0.5, cx, h * 0.9),
    CLOSE,
  ]
}

export const IOS_ICON_GLYPHS = {
  // ── 添加 / 删除 / 关闭 ─────────────────────────
  ios7AddBlack: badge(mPlus, 'filled', 'black'),
  ios7AddBlackLight: badge(mPlus, 'outline', 'black'),
  ios7AddGreen: badge(mPlus, 'filled', 'green'),
  ios7AddNormal: badge(mPlus, 'outline', 'blue'),
  ios7RemoveBlack: badge(mMinus, 'filled', 'black'),
  ios7RemoveBlackLight: badge(mMinus, 'outline', 'black'),
  ios7RemoveRed: badge(mMinus, 'filled', 'red'),
  ios7AddSmall: badge(mPlus, 'bare', 'blue'),
  ios7Close1: badge(mCross, 'bare', 'black'),
  ios7Close2: tag('filled', 'blue'),
  ios7Close3: tag('filled', 'black'),
  ios7Close4: tag('outline', 'black'),

  // ── 刷新 / 搜索 ───────────────────────────────
  ios7Refresh: icon('black', (w, h) => refresh(w, h, ST(w, 0.16))),
  ios7SearchIcon: icon('black', (w, h) => {
    const d = Math.min(w, h) * 0.62, t = ST(w, 0.1)
    return [ring(w * 0.05, h * 0.05, d, t), ribbon([[w * 0.05 + d * 0.8, h * 0.05 + d * 0.8], [w * 0.95, h * 0.95]], t * 1.5)]
  }),
  ios7SearchBig: icon('black', (w, h) => {
    const d = Math.min(w, h) * 0.6, t = ST(w, 0.08)
    return [ring(w * 0.06, h * 0.06, d, t), ribbon([[w * 0.06 + d * 0.8, h * 0.06 + d * 0.8], [w * 0.94, h * 0.94]], t * 1.6)]
  }),

  // 旧素材的菜单图标靠 lineWidth 表达式排布三条横线，本项目求值为 0 → 三线重叠成一条
  ios7MenuIcon: {
    ...icon('black', (w, h) => {
      const t = Math.max(1.5, h * 0.13)
      return [0.14, 0.5, 0.86].map((y) => rectPath(0, h * y - t / 2, w, t))
    }),
    replace: true,
  },

  // ── 信息 / 选中 ───────────────────────────────
  ios7Info1: badge(mInfo, 'outline', 'blue'),
  ios7Info2: badge(mInfo, 'outline', 'black'),
  ios7Info3: badge(mInfo, 'filled', 'black'),
  ios7Check1: badge(mCheck, 'outline', 'black'),
  ios7Check2: badge(mCheck, 'filled', 'blue'),
  ios7Check3: badge(mCheck, 'filled', 'black'),
  ios7Check4: icon('blue', (w, h) => [
    ribbon([[w * 0.1, h * 0.55], [w * 0.38, h * 0.84], [w * 0.92, h * 0.16]], w * 0.19),
  ]),
  ios7Check5: icon('black', (w, h) => [
    ribbon([[w * 0.1, h * 0.55], [w * 0.38, h * 0.84], [w * 0.92, h * 0.16]], w * 0.19),
  ]),

  // ── 播放控制 ──────────────────────────────────
  ios7Play1: badge(mPlay, 'filled', 'black'),
  ios7Play2: badge(mPlay, 'outline', 'black'),
  ios7Pause1: badge(mPause, 'filled', 'black'),
  ios7Pause2: badge(mPause, 'outline', 'black'),
  ios7Stop1: badge(mPause, 'outline', 'blue'),
  ios7Stop2: badge(mStop, 'outline', 'black'),
  ios7Stop3: badge(mStop, 'filled', 'black'),

  // ── 收藏 / 喜欢 / 书签 ─────────────────────────
  ios7Favourite: icon('blue', (w, h) => [starPath(w / 2, h * 0.54, Math.min(w, h) * 0.5)]),
  ios7Favourite1: icon('black', (w, h) => {
    const R = Math.min(w, h) * 0.48
    return [hollow(starPath(w / 2, h * 0.54, R), w / 2, h * 0.54, R, R, ST(w, 0.09))]
  }),
  ios7Heart: icon('black', (w, h) => [
    hollow(heartPath(w * 0.94, h * 0.94), w * 0.47, h * 0.47, w * 0.47, h * 0.47, ST(w, 0.09)),
  ]),
  // 旧素材这颗「书签」是展开的两页书：实心书面 + 书脊镂空
  ios7Bookmark: icon('blue', (w, h) => {
    const body = [
      move(w * 0.04, h * 0.13),
      quad(w * 0.3, h * 0.02, w * 0.5, h * 0.09),
      quad(w * 0.7, h * 0.02, w * 0.96, h * 0.13),
      line(w * 0.96, h * 0.88),
      quad(w * 0.7, h * 0.98, w * 0.5, h * 0.91),
      quad(w * 0.3, h * 0.98, w * 0.04, h * 0.88),
      CLOSE,
    ]
    const spine = rectPath(w * 0.47, h * 0.12, w * 0.06, h * 0.76)
    return [sub([...body, ...spine], { fillRule: 'evenodd' })]
  }),

  // ── 系统图标 ──────────────────────────────────
  ios7Profile: icon('blue', (w, h) => [
    sub([...ellipsePath(0, 0, w, h), ...personContours(w, h).flat()], { fillRule: 'evenodd' }),
  ]),
  // 复制：后页只露出上/右两边，前页空心，避免两页描边互相穿插
  ios7Copy: icon('blue', (w, h) => {
    const t = ST(w, 0.08)
    return [
      ribbon([[w * 0.36, h * 0.1], [w * 0.94, h * 0.1], [w * 0.94, h * 0.6]], t),
      hollow(roundRectPath(w * 0.06, h * 0.3, w * 0.6, h * 0.64, w * 0.06), w * 0.36, h * 0.62, w * 0.3, h * 0.32, t),
    ]
  }),
  ios7Upload: icon('blue', (w, h) => {
    const t = ST(w, 0.1)
    return [
      ribbon([[w * 0.06, h * 0.42], [w * 0.06, h * 0.94], [w * 0.94, h * 0.94], [w * 0.94, h * 0.42]], t),
      ribbon([[w * 0.5, h * 0.76], [w * 0.5, h * 0.14]], t),
      poly([[w * 0.24, h * 0.3], [w * 0.5, h * 0.02], [w * 0.76, h * 0.3]]),
    ]
  }),
  ios7Download: icon('black', (w, h) => {
    const t = ST(w, 0.1)
    return [
      ribbon([[w * 0.06, h * 0.52], [w * 0.06, h * 0.96], [w * 0.94, h * 0.96], [w * 0.94, h * 0.52]], t),
      ribbon([[w * 0.5, h * 0.1], [w * 0.5, h * 0.7]], t),
      poly([[w * 0.24, h * 0.5], [w * 0.5, h * 0.8], [w * 0.76, h * 0.5]]),
    ]
  }),
  ios7Wifi: icon('black', (w, h) => [
    ...waves(w / 2, h * 0.86, w * 0.24, w * 0.19, 3, ST(w, 0.09), 0.8, 1),
    ellipsePath(w / 2 - w * 0.06, h * 0.78, w * 0.12, w * 0.12),
  ]),
  ios7Bluetooth: icon('black', (w, h) => {
    const t = ST(w, 0.1)
    return [
      ribbon([[w * 0.5, h * 0.04], [w * 0.5, h * 0.96]], t),
      ribbon([[w * 0.24, h * 0.3], [w * 0.76, h * 0.7]], t),
      ribbon([[w * 0.24, h * 0.7], [w * 0.76, h * 0.3]], t),
    ]
  }),
  ios7Battery: icon('black', (w, h) => [
    roundRectPath(0, h * 0.16, w * 0.88, h * 0.68, h * 0.12),
    rectPath(w * 0.9, h * 0.34, w * 0.1, h * 0.32),
  ]),
  // 旧素材是「挂锁 + 环形箭头」＝自动锁定：锁体实心 + 钥匙孔镂空
  ios7Lock: icon('black', (w, h) => {
    const t = ST(w, 0.11)
    const body = roundRectPath(w * 0.22, h * 0.46, w * 0.56, h * 0.46, w * 0.08)
    const key = [
      ...ellipsePath(w * 0.45, h * 0.56, w * 0.1, w * 0.1),
      ...rectPath(w * 0.475, h * 0.62, w * 0.05, h * 0.16),
    ]
    return [
      arcBand(w / 2, h * 0.44, w * 0.2, w * 0.2, t, Math.PI, Math.PI * 2, 12),
      ribbon([[w * 0.3, h * 0.44], [w * 0.3, h * 0.5]], t),
      ribbon([[w * 0.7, h * 0.44], [w * 0.7, h * 0.5]], t),
      sub([...body, ...key], { fillRule: 'evenodd' }),
    ]
  }),
  ios7Camera: icon('black', (w, h) => {
    const t = ST(w, 0.08)
    const cx = w / 2
    return [
      roundRectPath(w * 0.32, h * 0.12, w * 0.34, h * 0.12, h * 0.04),
      hollow(roundRectPath(w * 0.04, h * 0.22, w * 0.92, h * 0.64, w * 0.08), cx, h * 0.54, w * 0.46, h * 0.32, t),
      ring(cx - w * 0.18, h * 0.36, w * 0.36, t),
      ellipsePath(cx - w * 0.07, h * 0.47, w * 0.14, w * 0.14),
    ]
  }),
  ios7Sound: icon('black', (w, h) => [
    poly([
      [w * 0.04, h * 0.4], [w * 0.24, h * 0.4], [w * 0.42, h * 0.18],
      [w * 0.42, h * 0.82], [w * 0.24, h * 0.6], [w * 0.04, h * 0.6],
    ]),
    ...waves(w * 0.44, h * 0.5, w * 0.2, w * 0.15, 2, ST(w, 0.07), 0.7, 1),
  ]),
  ios7Video: icon('black', (w, h) => {
    const t = ST(w, 0.08)
    return [
      hollow(roundRectPath(w * 0.04, h * 0.16, w * 0.62, h * 0.68, w * 0.08), w * 0.35, h * 0.5, w * 0.31, h * 0.34, t),
      poly([[w * 0.7, h * 0.34], [w * 0.96, h * 0.16], [w * 0.96, h * 0.84], [w * 0.7, h * 0.66]]),
    ]
  }),
  ios7ListIcon: icon('black', (w, h) => {
    const t = Math.max(1.6, h * 0.09)
    const out = []
    for (const y of [0.14, 0.5, 0.86]) {
      out.push(rectPath(w * 0.28, h * y - t / 2, w * 0.72, t))
      out.push(ellipsePath(w * 0.02, h * y - w * 0.08, w * 0.16, w * 0.16))
    }
    return out
  }),
  // 定位＝导航箭头（纸飞机）
  ios7Locate: icon('black', (w, h) => {
    const dart = poly([
      [w * 0.98, h * 0.02], [w * 0.06, h * 0.46], [w * 0.44, h * 0.56], [w * 0.54, h * 0.98],
    ])
    return [hollow(dart, w * 0.5, h * 0.5, w * 0.46, h * 0.46, ST(w, 0.08))]
  }),
  ios7Trash: icon('black', (w, h) => {
    const t = ST(w, 0.08)
    const can = poly([
      [w * 0.16, h * 0.22], [w * 0.24, h * 0.96], [w * 0.76, h * 0.96], [w * 0.84, h * 0.22],
    ])
    return [
      ribbon([[w * 0.1, h * 0.18], [w * 0.9, h * 0.18]], t),
      ribbon([[w * 0.38, h * 0.18], [w * 0.38, h * 0.06], [w * 0.62, h * 0.06], [w * 0.62, h * 0.18]], t),
      hollow(can, w * 0.5, h * 0.59, w * 0.34, h * 0.37, t),
      ribbon([[w * 0.38, h * 0.36], [w * 0.4, h * 0.82]], t * 0.8),
      ribbon([[w * 0.62, h * 0.36], [w * 0.6, h * 0.82]], t * 0.8),
    ]
  }),
  ios7Help: icon('black', (w, h) => {
    const t = ST(w, 0.08), cx = w / 2
    return [
      ring(0, 0, Math.min(w, h), t),
      arcBand(cx, h * 0.38, w * 0.15, w * 0.15, t, -Math.PI * 0.95, Math.PI * 0.3, 12),
      ribbon([[cx + w * 0.15, h * 0.44], [cx, h * 0.56], [cx, h * 0.64]], t),
      ellipsePath(cx - w * 0.055, h * 0.73, w * 0.11, w * 0.11),
    ]
  }),
  // 提醒＝通知横幅：实心圆角条 + 应用图标与两行文字镂空
  ios7AlertIcon: icon('black', (w, h) => {
    const body = roundRectPath(0, h * 0.28, w, h * 0.44, h * 0.08)
    const holes = [
      roundRectPath(w * 0.08, h * 0.38, h * 0.24, h * 0.24, h * 0.05),
      rectPath(w * 0.42, h * 0.4, w * 0.34, h * 0.07),
      rectPath(w * 0.42, h * 0.55, w * 0.22, h * 0.07),
    ]
    return [sub([...body, ...holes.flat()], { fillRule: 'evenodd' })]
  }),
  ios7Clock: icon('black', (w, h) => {
    const t = ST(w, 0.09), cx = w / 2, cy = h / 2
    return [
      ring(0, 0, Math.min(w, h), t),
      ribbon([[cx, cy], [cx, h * 0.26]], t),
      ribbon([[cx, cy], [w * 0.72, cy]], t),
    ]
  }),
  ios7Phone: icon('black', (w, h) => {
    const body = [
      move(w * 0.14, h * 0.1),
      quad(w * 0.3, h * 0.06, w * 0.34, h * 0.26),
      quad(w * 0.38, h * 0.46, w * 0.56, h * 0.62),
      quad(w * 0.74, h * 0.78, w * 0.9, h * 0.82),
      quad(w * 0.86, h * 0.96, w * 0.62, h * 0.9),
      quad(w * 0.3, h * 0.8, w * 0.12, h * 0.42),
      quad(w * 0.04, h * 0.22, w * 0.14, h * 0.1),
      CLOSE,
    ]
    return [hollow(body, w / 2, h / 2, w * 0.45, h * 0.45, ST(w, 0.1))]
  }),
  ios7Message: icon('black', (w, h) => {
    const body = [
      move(w * 0.3, h * 0.94),
      quad(w * 0.02, h * 0.86, w * 0.02, h * 0.5),
      quad(w * 0.02, h * 0.06, w * 0.5, h * 0.06),
      quad(w * 0.98, h * 0.06, w * 0.98, h * 0.5),
      quad(w * 0.98, h * 0.86, w * 0.52, h * 0.86),
      CLOSE,
    ]
    return [hollow(body, w / 2, h * 0.48, w * 0.48, h * 0.44, ST(w, 0.08))]
  }),
  ios7Mail: icon('black', (w, h) => {
    const t = ST(w, 0.08)
    return [
      hollow(roundRectPath(w * 0.02, h * 0.16, w * 0.96, h * 0.68, w * 0.06), w / 2, h * 0.5, w * 0.48, h * 0.34, t),
      ribbon([[w * 0.06, h * 0.22], [w * 0.5, h * 0.58], [w * 0.94, h * 0.22]], t),
    ]
  }),
}
