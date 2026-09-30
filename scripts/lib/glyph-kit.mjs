/**
 * 图标字形工具箱（iOS / Android 位图图标重画共用）。
 *
 * 单色墨迹模型：一枚图标只有一种墨色，墨色写在图形级 fillStyle 上，字形子路径一律
 * 不带自己的颜色 —— 面板改「填充色」即整体换色（子路径各自写死颜色的话改色就失效，
 * 这是 iOS 图标第一版 GUI 探针实测出的问题）。为此：
 *   · 笔画不用描边，折线加粗成填充多边形（ribbon），渲染器也没有线端样式；
 *   · 圆环/空心体用同一子路径的 evenodd 内轮廓挖空（hollow）；
 *   · 徽标里的反白符号同样做成镂空，整枚图标仍是单色。
 *
 * 坐标一律写在图形的默认尺寸（w×h）里，生成器统一比例化，缩放时细节跟随。
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
export const AMBER = '245,176,32'
export const WHITE = '255,255,255'
export const INK = { black: BLACK, blue: BLUE, green: GREEN, red: RED, amber: AMBER, white: WHITE }

export const r2 = (v) => Math.round(v * 100) / 100
/** 笔画厚度随图标尺寸走，下限 1.5px 免得缩略图上糊成一团 */
export const ST = (w, k = 0.13) => Math.max(1.5, w * k)

/** 多边形（闭合） */
export const poly = (pts) =>
  pts.map(([x, y], i) => (i ? line(r2(x), r2(y)) : move(r2(x), r2(y)))).concat(CLOSE)

/** 折线加粗成填充多边形：逐点取相邻两段的平均法向，得到斜接轮廓 */
export const ribbon = (pts, t) => {
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
export const plusPoly = (cx, cy, L, t, rot = 0) => {
  const h = L / 2, q = t / 2
  const pts = [
    [-q, -h], [q, -h], [q, -q], [h, -q], [h, q], [q, q],
    [q, h], [-q, h], [-q, q], [-h, q], [-h, -q], [-q, -q],
  ]
  const c = Math.cos(rot), s = Math.sin(rot)
  return poly(pts.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]))
}

/** 以 (cx,cy) 为中心把轮廓缩 kx/ky 倍（curve/quadraticCurve 的控制点一起缩） */
export const scaleAbout = (actions, cx, cy, kx, ky = kx) =>
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
export const hollow = (actions, cx, cy, rx, ry, t) => ({
  actions: [
    ...actions,
    ...scaleAbout(actions, cx, cy, Math.max(0.15, (rx - t) / rx), Math.max(0.15, (ry - t) / ry)),
  ],
  fillRule: 'evenodd',
})
export const ring = (x, y, d, t) => hollow(ellipsePath(x, y, d, d), x + d / 2, y + d / 2, d / 2, d / 2, t)
export const hollowRect = (x, y, w, h, r, t) =>
  hollow(roundRectPath(x, y, w, h, r), x + w / 2, y + h / 2, w / 2, h / 2, t)

/** 圆弧带：a0→a1 的环段（canvas y 轴向下，角度递增即顺时针） */
export const arcBand = (cx, cy, rx, ry, t, a0, a1, n = 16) => {
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
export const tipPoly = (px, py, dirx, diry, nrmx, nrmy, s) =>
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

/** 声波/信号的同心弧带（默认朝上张开） */
export const waves = (cx, cy, r0, gap, n, t, span = 0.85, ry = 1.1) =>
  Array.from({ length: n }, (_, i) =>
    arcBand(cx, cy, r0 + i * gap, (r0 + i * gap) * ry, t, -Math.PI / 2 - span, -Math.PI / 2 + span, 10),
  )

/** 镂空组合：外轮廓 + 若干内轮廓同子路径 evenodd */
export const cut = (outer, ...holes) => sub([...outer, ...holes.flat()], { fillRule: 'evenodd' })

/** 矩形条（横/竖笔画） */
export const bar = (x, y, w, h) => rectPath(x, y, w, h)

/** 折线近似圆弧的「点列」版本（ribbon 需要点而非动作） */
export const arcPts = (cx, cy, rx, ry, a0, a1, n = 12) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]
  })

/** 绕 (cx,cy) 旋转 ang（canvas y 轴向下，正值即顺时针）；curve/quad 的控制点必须跟着转 */
export const rotAbout = (actions, cx, cy, ang) => {
  const c = Math.cos(ang), s = Math.sin(ang)
  const P = (x, y) => [r2(cx + (x - cx) * c - (y - cy) * s), r2(cy + (x - cx) * s + (y - cy) * c)]
  return actions.map((a) => {
    if (a.action === 'close') return a
    const out = { ...a }
    for (const suffix of ['', '1', '2']) {
      const kx = 'x' + suffix
      const ky = 'y' + suffix
      if (a[kx] == null || a[ky] == null) continue
      const [nx, ny] = P(a[kx], a[ky])
      out[kx] = nx
      out[ky] = ny
    }
    return out
  })
}

/** 心形轮廓（iOS「喜欢」与 Android「收藏」共用） */
export const heartPath = (w, h) => {
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

/** 人形轮廓：头 + 肩（作为镂空或实心都用同一组轮廓） */
export const personContours = (w, h) => {
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


/**
 * 图标条目工厂：墨色只出现在图形级 fillStyle / lineStyle 上，
 * 字形子路径保持无色（继承），面板改「填充色」即整体换色。
 */
export const icon = (color, subPaths, extra) => ({
  fill: { type: 'solid', color: INK[color] },
  line: { lineWidth: 0, lineColor: INK[color] },
  subPaths,
  ...extra,
})
