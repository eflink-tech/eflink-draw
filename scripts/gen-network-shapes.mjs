#!/usr/bin/env node
/**
 * ProcessOn 网络拓扑 SVG → eflink-draw ShapeDefinition 代码生成器
 *
 * 用法（在 eflink-draw 目录下）:
 *   node scripts/gen-network-shapes.mjs --category network
 *   node scripts/gen-network-shapes.mjs --category network_cisco,network_aws,network_azure,network_aliyun
 *
 * 输入: processon_files/<category>.js（Schema.addShape 元数据）+ 同名目录下的 SVG 图标
 *       scripts/net-icon-groups.json（厂商与品类的中文名/所属面板配置）
 * 输出（packages/draw/src/core/schema/shapes/ 下，自动生成勿手改；重跑即覆盖）:
 *   groups/<groupId>.ts   每个品类一份矢量数据（46 个，vite 各自切成独立 chunk）
 *   netIconManifest.ts    厂商 + 品类元数据（名称/数量），体积小，主包常驻
 *   netIconNames.ts       groupId → 图形名清单，主包常驻（文档 iconGroups 反查用）
 *   netIconChunks.ts      groupId → 动态 import 映射表（主包常驻）
 *   netIconTitles.ts      中文标题索引，仅在面板搜索时按需 import
 *
 * 转换策略:
 * - 坐标 → ProcessOn 线性表达式（'w*0.2355'），resize 拉伸语义与旧版 image stretch 一致
 * - 全图标单色填充 → 子路径不带样式、元素级 fillStyle 承载颜色（面板改色生效）
 * - 多色图标 → 每个子路径独立 fillStyle/lineStyle，元素级 fill=none/lineWidth=0 兜底
 * - 圆弧 A → 三次贝塞尔展开；基元(rect/circle/…) → 路径；transform 拍平进坐标
 * - 不支持的 SVG 特性（渐变/use/clip-path/mask/style 规则）：跳过该子路径并告警；<text> 剥离为可编辑文本
 * - fill-rule="evenodd"：保留子路径，标记 IconRaw.fr，由 shapePaint/shapeThumb 按偶奇绕序填充
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = path.resolve(import.meta.dirname, '..')
const ASSETS = path.join(ROOT, 'processon_files')
const OUT_DIR = path.join(ROOT, 'packages/draw/src/core/schema/shapes')

// ────────────────────────────── CLI ──────────────────────────────

const argv = process.argv.slice(2)
function opt(name, dflt) {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt
}
const categories = String(opt('category', 'network'))
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

// 中文标题词典（按 schema shape name 小写匹配；未命中沿用英文 title）
const TITLE_ZH = JSON.parse(
  fs.existsSync(path.join(ROOT, 'scripts/network-titles.json'))
    ? fs.readFileSync(path.join(ROOT, 'scripts/network-titles.json'), 'utf8')
    : '{}',
)

// 厂商/品类展示配置（决定面板三段导航的中文名与归属，缺失会在生成时告警）
const GROUP_CONFIG = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'scripts/net-icon-groups.json'), 'utf8'),
)
/** schema category → vendor id */
const VENDOR_OF_CATEGORY = new Map(GROUP_CONFIG.vendors.map((v) => [v.schemaCategory, v.id]))
/** groupId → { name, vendor } */
const GROUP_META = new Map(GROUP_CONFIG.groups.map((g) => [g.id, g]))

// ────────────────────────────── 矩阵 ──────────────────────────────

/** 仿射矩阵 [a b c d e f]: x' = a·x + c·y + e, y' = b·x + d·y + f */
const ID = [1, 0, 0, 1, 0, 0]
const mul = (m, n) => [
  m[0] * n[0] + m[2] * n[1],
  m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4],
  m[1] * n[4] + m[3] * n[5] + m[5],
]
const applyM = (m, p) => [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]]
function parseTransform(str) {
  let m = ID
  const re = /(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g
  let t
  while ((t = re.exec(str))) {
    const args = t[2].split(/[\s,]+/).filter((s) => s !== '').map(Number)
    let n
    switch (t[1]) {
      case 'matrix': n = args; break
      case 'translate': n = [1, 0, 0, 1, args[0] || 0, args[1] || 0]; break
      case 'scale': n = [args[0] || 1, 0, 0, args[1] ?? args[0] ?? 1, 0, 0]; break
      case 'rotate': {
        const a = ((args[0] || 0) * Math.PI) / 180
        const c = Math.cos(a), s = Math.sin(a)
        n = [c, s, -s, c, 0, 0]
        if (args.length >= 3) n = mul([1, 0, 0, 1, args[1], args[2]], mul(n, [1, 0, 0, 1, -args[1], -args[2]]))
        break
      }
      case 'skewX': n = [1, 0, Math.tan(((args[0] || 0) * Math.PI) / 180), 1, 0, 0]; break
      case 'skewY': n = [1, Math.tan(((args[0] || 0) * Math.PI) / 180), 0, 1, 0, 0]; break
      default: n = ID
    }
    m = mul(m, n)
  }
  return m
}

// ────────────────────────────── 颜色 ──────────────────────────────

const NAMED = {
  black: [0, 0, 0], white: [255, 255, 255], red: [255, 0, 0], green: [0, 128, 0],
  blue: [0, 0, 255], yellow: [255, 255, 0], cyan: [0, 255, 255], magenta: [255, 0, 255],
  gray: [128, 128, 128], grey: [128, 128, 128], silver: [192, 192, 192], maroon: [128, 0, 0],
  olive: [128, 128, 0], lime: [0, 128, 0], aqua: [0, 255, 255], teal: [0, 128, 128],
  navy: [0, 0, 128], fuchsia: [255, 0, 255], orange: [255, 165, 0], none: null,
  transparent: null, currentcolor: [0, 0, 0],
}
/** → {r,g,b,a} | null（none） */
function parseColor(raw) {
  if (raw == null) return { r: 0, g: 0, b: 0, a: 1 } // SVG fill 默认 black
  const s = String(raw).trim().toLowerCase()
  if (s === 'none' || s === 'transparent') return null
  if (NAMED[s]) { const [r, g, b] = NAMED[s]; return { r, g, b, a: 1 } }
  if (s === 'currentcolor') return { r: 0, g: 0, b: 0, a: 1 }
  let m
  if ((m = /^#([0-9a-f]{3})$/.exec(s))) {
    const [, h] = m
    return { r: parseInt(h[0] + h[0], 16), g: parseInt(h[1] + h[1], 16), b: parseInt(h[2] + h[2], 16), a: 1 }
  }
  if ((m = /^#([0-9a-f]{6})$/.exec(s))) {
    const [, h] = m
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 }
  }
  if ((m = /^#([0-9a-f]{8})$/.exec(s))) {
    const h = m[1]
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: parseInt(h.slice(6, 8), 16) / 255 }
  }
  if ((m = /^rgba?\(([^)]*)\)$/.exec(s))) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean)
    return { r: +p[0] || 0, g: +p[1] || 0, b: +p[2] || 0, a: p[3] != null ? parseFloat(p[3]) : 1 }
  }
  if (s.startsWith('url(')) return 'GRADIENT'
  return { r: 0, g: 0, b: 0, a: 1 }
}
/** alpha 与白底合成（Konva fillStyle 无每子路径 alpha） */
function composite(c, extraAlpha) {
  if (!c) return null
  const a = Math.min(1, Math.max(0, c.a * (extraAlpha ?? 1)))
  const mix = (v) => Math.round(v * a + 255 * (1 - a))
  return { r: mix(c.r), g: mix(c.g), b: mix(c.b), a: 1 }
}
const rgbStr = (c) => `${c.r},${c.g},${c.b}`

// ────────────────────────────── SVG 树解析 ──────────────────────────────

function parseAttrs(str) {
  const attrs = {}
  const re = /([\w:-]+)\s*=\s*"([^"]*)"|([\w:-]+)\s*=\s*'([^']*)'/g
  let m
  while ((m = re.exec(str))) attrs[m[1] || m[3]] = m[2] ?? m[4]
  return attrs
}

function parseSvgTree(src) {
  const tagRe = /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<![\s\S]*?>|<(\/?)([A-Za-z][\w:-]*)((?:"[^"]*"|'[^']*'|[^"'>])*)>/g
  const root = { tag: '#root', attrs: {}, children: [] }
  const stack = [root]
  let m
  while ((m = tagRe.exec(src))) {
    const raw = m[0]
    if (raw.startsWith('<!') || raw.startsWith('<?')) continue
    const closing = m[1] === '/'
    const tag = m[2]
    const rest = m[3] || ''
    const selfClosed = /\/\s*$/.test(rest)
    const attrs = parseAttrs(rest)
    if (closing) {
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tag) { stack.length = i; break }
      }
      continue
    }
    const node = { tag, attrs, children: [] }
    stack[stack.length - 1].children.push(node)
    if (!selfClosed) stack.push(node)
  }
  return root
}

function styleFromDecl(str) {
  const out = {}
  for (const decl of str.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    out[decl.slice(0, i).trim().toLowerCase()] = decl.slice(i + 1).trim()
  }
  return out
}

// ────────────────────────────── path d 解析 ──────────────────────────────

/** 段: {t:'L'|'C', p1?,p2?,p}（单位坐标，p1/p2 为贝塞尔控制点） */
function parsePathD(d) {
  const toks = []
  const re = /([MmLlHhVvCcSsQqTtAaZz])|(-?\d*\.?\d+(?:e[-+]?\d+)?)/gi
  let m
  while ((m = re.exec(d))) {
    if (m[1]) toks.push(m[1])
    else toks.push(parseFloat(m[2]))
  }
  const contours = [] // 每子路径 = 起点 + 段列表
  let cur = null
  let x = 0, y = 0
  let sx = 0, sy = 0
  let lastC = null, lastQ = null, cmd = ''
  const num = () => { const v = toks.shift(); if (typeof v !== 'number') throw new Error(`d 数字缺失: ${v}`); return v }
  const start = (px, py) => { cur = { from: [px, py], segs: [] }; contours.push(cur) }
  const line = (px, py) => { cur.segs.push({ t: 'L', p: [px, py] }); x = px; y = py }
  const cubic = (c1, c2, p) => { cur.segs.push({ t: 'C', p1: c1, p2: c2, p }); x = p[0]; y = p[1] }
  const quadToCubic = (c, p) => {
    cubic([x + (2 / 3) * (c[0] - x), y + (2 / 3) * (c[1] - y)], [p[0] + (2 / 3) * (c[0] - p[0]), p[1] + (2 / 3) * (c[1] - p[1])], p)
  }
  for (;;) {
    if (toks.length === 0) break
    if (typeof toks[0] === 'string') cmd = toks.shift()
    else {
      // 隐式重复: M 后跟数字按 L，m 按 l
      const c = cmd
      cmd = c === 'M' ? 'L' : c === 'm' ? 'l' : c
    }
    switch (cmd) {
      case 'M': { const px = num(), py = num(); start(px, py); x = px; y = py; sx = px; sy = py; lastC = lastQ = null; break }
      case 'm': { const px = x + num(), py = y + num(); start(px, py); x = px; y = py; sx = px; sy = py; lastC = lastQ = null; break }
      case 'L': line(num(), num()); lastC = lastQ = null; break
      case 'l': line(x + num(), y + num()); lastC = lastQ = null; break
      case 'H': line(num(), y); lastC = lastQ = null; break
      case 'h': line(x + num(), y); lastC = lastQ = null; break
      case 'V': line(x, num()); lastC = lastQ = null; break
      case 'v': line(x, y + num()); lastC = lastQ = null; break
      case 'C': { const c1 = [num(), num()], c2 = [num(), num()], p = [num(), num()]; cubic(c1, c2, p); lastC = c2; lastQ = null; break }
      case 'c': { const c1 = [x + num(), y + num()], c2 = [x + num(), y + num()], p = [x + num(), y + num()]; cubic(c1, c2, p); lastC = c2; lastQ = null; break }
      case 'S': { const ref = lastC ? [2 * x - lastC[0], 2 * y - lastC[1]] : [x, y]; const c2 = [num(), num()], p = [num(), num()]; cubic(ref, c2, p); lastC = c2; lastQ = null; break }
      case 's': { const ref = lastC ? [2 * x - lastC[0], 2 * y - lastC[1]] : [x, y]; const c2 = [x + num(), y + num()], p = [x + num(), y + num()]; cubic(ref, c2, p); lastC = c2; lastQ = null; break }
      case 'Q': { const c = [num(), num()], p = [num(), num()]; quadToCubic(c, p); lastQ = c; lastC = null; break }
      case 'q': { const c = [x + num(), y + num()], p = [x + num(), y + num()]; quadToCubic(c, p); lastQ = c; lastC = null; break }
      case 'T': { const c = lastQ ? [2 * x - lastQ[0], 2 * y - lastQ[1]] : [x, y]; const p = [num(), num()]; quadToCubic(c, p); lastQ = c; lastC = null; break }
      case 't': { const c = lastQ ? [2 * x - lastQ[0], 2 * y - lastQ[1]] : [x, y]; const p = [x + num(), y + num()]; quadToCubic(c, p); lastQ = c; lastC = null; break }
      case 'A': case 'a': {
        const rx0 = num(), ry0 = num(), rot = num()
        const laf = num(), swf = num()
        let px, py
        if (cmd === 'A') { px = num(); py = num() } else { px = x + num(); py = y + num() }
        for (const seg of arcToCubics([x, y], [px, py], rx0, ry0, rot, !!laf, !!swf, cmd === 'a')) cubic(seg.p1, seg.p2, seg.p)
        lastC = lastQ = null
        break
      }
      case 'Z': case 'z': {
        cur.segs.push({ t: 'Z' })
        x = sx; y = sy
        lastC = lastQ = null
        break
      }
      default: {
        // 未知指令：丢弃其参数直至下一指令
        while (toks.length && typeof toks[0] === 'number') toks.shift()
        break
      }
    }
  }
  return contours.filter((c) => c.segs.length || c.from)
}

/** SVG 弧 → 三次贝塞尔分段（endpoint→center 参数化，90° 切分） */
function arcToCubics(p0, p1, rx, ry, phiDeg, largeArc, sweep, relativeUnused) {
  const out = []
  if (rx === 0 || ry === 0 || (p0[0] === p1[0] && p0[1] === p1[1])) {
    return out // 退化：无弧可展
  }
  rx = Math.abs(rx); ry = Math.abs(ry)
  const phi = (phiDeg * Math.PI) / 180
  const cosP = Math.cos(phi), sinP = Math.sin(phi)
  const dx = (p0[0] - p1[0]) / 2, dy = (p0[1] - p1[1]) / 2
  const x1 = cosP * dx + sinP * dy, y1 = -sinP * dx + cosP * dy
  let lam = (x1 * x1) / (rx * rx) + (y1 * y1) / (ry * ry)
  if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam) }
  const sign = largeArc === sweep ? -1 : 1
  const num = rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1
  const den = rx * rx * y1 * y1 + ry * ry * x1 * x1
  const co = sign * Math.sqrt(Math.max(0, num / den))
  const cxp = (co * rx * y1) / ry, cyp = (-co * ry * x1) / rx
  const cx = cosP * cxp - sinP * cyp + (p0[0] + p1[0]) / 2
  const cy = sinP * cxp + cosP * cyp + (p0[1] + p1[1]) / 2
  const ang = (ux, uy, vx, vy) => {
    const d = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy)
    let a = Math.acos(Math.max(-1, Math.min(1, (ux * vx + uy * vy) / d)))
    if (ux * vy - uy * vx < 0) a = -a
    return a
  }
  const th1 = ang(1, 0, (x1 - cxp) / rx, (y1 - cyp) / ry)
  let dth = ang((x1 - cxp) / rx, (y1 - cyp) / ry, (-x1 - cxp) / rx, (-y1 - cyp) / ry)
  if (!sweep && dth > 0) dth -= 2 * Math.PI
  else if (sweep && dth < 0) dth += 2 * Math.PI
  const segN = Math.ceil(Math.abs(dth) / (Math.PI / 2))
  const delta = dth / segN
  const k = (4 / 3) * Math.tan(delta / 4)
  let th = th1
  let px0, py0
  for (let i = 0; i < segN; i++) {
    const c1 = Math.cos(th), s1 = Math.sin(th)
    th += delta
    const c2 = Math.cos(th), s2 = Math.sin(th)
    const ep = (c, s) => [cx + (rx * c * cosP - ry * s * sinP), cy + (rx * c * sinP + ry * s * cosP)]
    const der = (c, s) => [-rx * s * cosP - ry * c * sinP, -rx * s * sinP + ry * c * cosP]
    const e2 = ep(c2, s2)
    if (i === 0) { px0 = ep(c1, s1)[0]; py0 = ep(c1, s1)[1] }
    const start = i === 0 ? [px0, py0] : ep(c1, s1)
    const d1 = der(c1, s1), d2 = der(c2, s2)
    out.push({
      t: 'C',
      p1: [start[0] + (k * d1[0]) / 1, start[1] + (k * d1[1]) / 1],
      p2: [e2[0] - (k * d2[0]) / 1, e2[1] - (k * d2[1]) / 1],
      p: e2,
    })
  }
  // 末点吸附，避免浮点漂移
  if (out.length) out[out.length - 1].p = [p1[0], p1[1]]
  return out
}

// ────────────────────────────── 基元 → 轮廓 ──────────────────────────────

const K = 0.5522847498307936
function contoursFromEl(tag, attrs) {
  const n = (name, dflt = 0) => (attrs[name] != null ? parseFloat(attrs[name]) : dflt)
  switch (tag) {
    case 'rect': {
      const x = n('x'), y = n('y'), w = n('width'), h = n('height')
      if (!(w > 0 && h > 0)) return []
      let rx = attrs.rx != null ? n('rx') : n('ry', 0)
      let ry = attrs.ry != null ? n('ry') : n('rx', 0)
      if (attrs.rx == null && attrs.ry == null) { rx = 0; ry = 0 }
      rx = Math.min(rx, w / 2); ry = Math.min(ry, h / 2)
      if (rx <= 0 && ry <= 0) {
        return [{ from: [x, y], segs: [
          { t: 'L', p: [x + w, y] }, { t: 'L', p: [x + w, y + h] }, { t: 'L', p: [x, y + h] }, { t: 'Z' },
        ], closed: true }]
      }
      const r = rx > 0 && ry > 0 ? { rx, ry } : { rx: rx || ry, ry: rx || ry }
      const { rx: ax, ry: by } = r
      const P = (px, py) => ({ t: 'L', p: [px, py] })
      const C = (a, b, c) => ({ t: 'C', p1: a, p2: b, p: c })
      return [{ from: [x + ax, y], segs: [
        P(x + w - ax, y),
        C([x + w - ax + ax * K, y], [x + w, y + by - by * K], [x + w, y + by]),
        P(x + w, y + h - by),
        C([x + w, y + h - by + by * K], [x + w - ax + ax * K, y + h], [x + w - ax, y + h]),
        P(x + ax, y + h),
        C([x + ax - ax * K, y + h], [x, y + h - by + by * K], [x, y + h - by]),
        P(x, y + by),
        C([x, y + by - by * K], [x + ax - ax * K, y], [x + ax, y]),
        { t: 'Z' },
      ], closed: true }]
    }
    case 'circle': {
      const cx = n('cx'), cy = n('cy'), r = n('r')
      if (!(r > 0)) return []
      return [ellipseContours(cx, cy, r, r)[0]]
    }
    case 'ellipse': {
      const cx = n('cx'), cy = n('cy'), rx = n('rx'), ry = n('ry')
      if (!(rx > 0 && ry > 0)) return []
      return [ellipseContours(cx, cy, rx, ry)[0]]
    }
    case 'line':
      return [{ from: [n('x1'), n('y1')], segs: [{ t: 'L', p: [n('x2'), n('y2')] }], closed: false }]
    case 'polyline': case 'polygon': {
      const pts = parsePoints(attrs.points)
      if (pts.length < 2) return []
      const segs = pts.slice(1).map((p) => ({ t: 'L', p }))
      if (tag === 'polygon') segs.push({ t: 'Z' })
      return [{ from: pts[0], segs, closed: tag === 'polygon' }]
    }
    case 'path':
      return parsePathD(attrs.d || '').map((c) => ({
        from: c.from,
        segs: c.segs,
        closed: c.segs.some((s) => s.t === 'Z'),
      }))
    default:
      return []
  }
}
function ellipseContours(cx, cy, rx, ry) {
  const pts = [[cx + rx, cy], [cx, cy + ry], [cx - rx, cy], [cx, cy - ry]]
  const c = (x, y) => [x, y]
  const segs = [
    { t: 'C', p1: c(pts[0][0], pts[0][1] + ry * K), p2: c(pts[1][0] + rx * K, pts[1][1]), p: pts[1] },
    { t: 'C', p1: c(pts[1][0] - rx * K, pts[1][1]), p2: c(pts[2][0], pts[2][1] + ry * K), p: pts[2] },
    { t: 'C', p1: c(pts[2][0], pts[2][1] - ry * K), p2: c(pts[3][0] - rx * K, pts[3][1]), p: pts[3] },
    { t: 'C', p1: c(pts[3][0] + rx * K, pts[3][1]), p2: c(pts[0][0], pts[0][1] - ry * K), p: pts[0] },
    { t: 'Z' },
  ]
  return [{ from: pts[0], segs, closed: true }]
}
function parsePoints(str) {
  const nums = (str || '').trim().split(/[\s,]+/).map(Number).filter((v) => Number.isFinite(v))
  const pts = []
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]])
  return pts
}

// ────────────────────────────── 遍历绘制树 ──────────────────────────────

const SHAPE_TAGS = new Set(['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon'])

/** → {segments:[{contours, fill, stroke, strokeWidth}], warnings[]} */
function extractSegments(svgRoot) {
  const segments = []
  const warnings = []
  const walk = (node, parentTm, style, groupOpacity) => {
    for (const child of node.children) {
      const tm = child.attrs.transform ? mul(parentTm, parseTransform(child.attrs.transform)) : parentTm
      const attrs = child.attrs
      const decl = { ...(attrs.style ? styleFromDecl(attrs.style) : {}) }
      const st = {
        fill: decl.fill ?? attrs.fill ?? style.fill,
        stroke: decl.stroke ?? attrs.stroke ?? style.stroke,
        strokeWidth: decl['stroke-width'] ?? attrs['stroke-width'] ?? style.strokeWidth,
        fillOpacity: decl['fill-opacity'] ?? attrs['fill-opacity'] ?? style.fillOpacity,
        strokeOpacity: decl['stroke-opacity'] ?? attrs['stroke-opacity'] ?? style.strokeOpacity,
        fillRule: decl['fill-rule'] ?? attrs['fill-rule'] ?? style.fillRule,
      }
      const opac = Math.min(1, groupOpacity * (attrs.opacity != null || decl.opacity != null ? parseFloat(attrs.opacity ?? decl.opacity) : 1))
      if (child.tag === 'g') { walk(child, tm, st, opac); continue }
      if (child.tag === 'text' || child.tag === 'tspan' || child.tag === 'image') {
        warnings.push(`<${child.tag}> 元素被剥离`)
        continue
      }
      if (child.tag === 'use' || attrs['clip-path'] || attrs.mask) {
        warnings.push(`不支持的特性 <${child.tag}${attrs['clip-path'] ? ' clip-path' : ''}${attrs.mask ? ' mask' : ''}>`)
        continue
      }
      // fill-rule="evenodd" 由绘制端支持（StyledPathSegment.fillRule）
      const evenOdd = st.fillRule === 'evenodd'
      if (!SHAPE_TAGS.has(child.tag)) continue

      const fillColor = parseColor(st.fill)
      const strokeColor = parseColor(st.stroke)
      if (fillColor === 'GRADIENT' || strokeColor === 'GRADIENT') {
        warnings.push('渐变填充不支持')
        continue
      }
      const contours = contoursFromEl(child.tag, attrs)
      if (!contours.length) continue
      for (const c of contours) {
        // 拍平变换
        c.from = applyM(tm, c.from)
        for (const s of c.segs) {
          if (s.p1) s.p1 = applyM(tm, s.p1)
          if (s.p2) s.p2 = applyM(tm, s.p2)
          if (s.p) s.p = applyM(tm, s.p)
        }
      }
      let sw = parseFloat(st.strokeWidth ?? 1) || 0
      const scale = Math.sqrt(Math.abs(tm[0] * tm[3] - tm[1] * tm[2])) || 1
      segments.push({
        contours,
        fill: fillColor ? composite(fillColor, st.fillOpacity != null ? parseFloat(st.fillOpacity) : opac) : null,
        stroke: strokeColor ? composite(strokeColor, (st.strokeOpacity != null ? parseFloat(st.strokeOpacity) : 1) * (strokeColor ? opac : 1)) : null,
        strokeWidth: strokeColor && sw > 0 ? sw * scale : 0,
        ...(evenOdd && { fillRule: 'evenodd' }),
      })
    }
  }
  walk(svgRoot, ID, { fill: undefined, stroke: undefined, strokeWidth: undefined, fillOpacity: undefined, strokeOpacity: undefined, fillRule: undefined }, 1)
  return { segments, warnings }
}

// ────────────────────────────── 紧凑数据发射 ──────────────────────────────

/** 视口归一坐标 → 千分比整数："M225 137 C227 132 ..." */
function contoursToCmds(contours, vw, vh) {
  const q = (v, total) => String(Math.round((v / total) * 1000))
  const out = []
  for (const c of contours) {
    out.push(`M${q(c.from[0], vw)} ${q(c.from[1], vh)}`)
    for (const s of c.segs) {
      if (s.t === 'L') out.push(`L${q(s.p[0], vw)} ${q(s.p[1], vh)}`)
      else if (s.t === 'C') out.push(`C${q(s.p1[0], vw)} ${q(s.p1[1], vh)} ${q(s.p2[0], vw)} ${q(s.p2[1], vh)} ${q(s.p[0], vw)} ${q(s.p[1], vh)}`)
      else if (s.t === 'Z') out.push('Z')
    }
  }
  return out.join(' ')
}

// ────────────────────────────── 形状组装 ──────────────────────────────

const round2 = (v) => Math.round(v * 100) / 100

/** → IconRaw 紧凑数据（由 src/core/schema/shapes/iconShape.ts 运行时展开） */
function buildShape(def, svgSrc) {
  const root = parseSvgTree(svgSrc)
  const svgEl = root.children.find((c) => c.tag === 'svg')
  if (!svgEl) throw new Error('缺少 <svg> 根节点')
  let vw, vh
  const vb = (svgEl.attrs.viewBox || '').trim().split(/[\s,]+/).map(Number)
  if (vb.length === 4 && vb.every(Number.isFinite) && vb[2] > 0 && vb[3] > 0) {
    vw = vb[2]; vh = vb[3]
    if (vb[0] !== 0 || vb[1] !== 0) shiftTree(svgEl, -vb[0], -vb[1])
  } else {
    vw = parseFloat(svgEl.attrs.width) || def.w
    vh = parseFloat(svgEl.attrs.height) || def.h
  }

  const { segments, warnings } = extractSegments(svgEl)
  if (!segments.length) throw new Error(`无可转换路径 (${warnings.join('; ')})`)

  const filled = segments.filter((s) => s.fill)
  const stroked = segments.filter((s) => s.stroke && s.strokeWidth > 0)
  const fillColors = new Set(filled.map((s) => rgbStr(s.fill)))
  const strokeColors = new Set(stroked.map((s) => `${rgbStr(s.stroke)}@${round2(s.strokeWidth)}`))
  const monoFill = filled.length === segments.length && fillColors.size === 1 && !stroked.length
  const monoStroke = stroked.length === segments.length && strokeColors.size === 1 && !filled.length

  const raw = {
    n: def.name,
    t: TITLE_ZH[String(def.name).toLowerCase()] || def.title,
    c: def.category,
    g: def.category,
    w: def.w,
    h: def.h,
    segs: segments.map((s) => ({
      cmds: contoursToCmds(s.contours, vw, vh),
      ...(s.fillRule === 'evenodd' && { fr: 'evenodd' }),
      ...(monoFill || monoStroke ? {} : {
        fill: s.fill ? rgbStr(s.fill) : 'none',
        stroke: s.stroke && s.strokeWidth > 0 ? rgbStr(s.stroke) : 'none',
        sw: s.stroke && s.strokeWidth > 0 ? round2(s.strokeWidth) : 0,
      }),
    })),
  }
  let mode
  if (monoFill) { raw.m = 'fill'; raw.fc = rgbStr(filled[0].fill); mode = 'mono-fill' }
  else if (monoStroke) {
    raw.m = 'stroke'; mode = 'mono-stroke'
    const [rgb, w] = [...strokeColors][0].split('@')
    raw.lc = rgb; raw.lw = Number(w)
  } else { raw.m = 'multi'; mode = 'multi' }
  const skipped = warnings.length ? ` [跳过: ${warnings.join('; ')}]` : ''
  return { raw, skipped, mode }
}

/** viewBox 原点偏移：直接给根 <g>/绘制元素补一层 translate */
function shiftTree(svgEl, dx, dy) {
  for (const child of svgEl.children) {
    if (child.tag === 'g' || SHAPE_TAGS.has(child.tag)) {
      child.attrs.transform = `translate(${dx} ${dy}) ${child.attrs.transform || ''}`.trim()
    } else if (child.tag === 'svg') {
      shiftTree(child, dx, dy)
    }
  }
}

// ────────────────────────────── schema JS 解析 ──────────────────────────────

function parseSchema(category) {
  const src = fs.readFileSync(path.join(ASSETS, `${category}.js`), 'utf8')
  const chunks = src.split('Schema.addShape(').slice(1)
  const defs = []
  for (const chunk of chunks) {
    const meta = /name:"([^"]+)",title:"([^"]*)",category:"([^"]+)",props:\{w:([\d.]+),h:([\d.]+)\}/.exec(chunk)
    const file = /fileId:"\/assets\/images\/designer\/[^"]*\/([^"]+\.svg)"/.exec(chunk)
    if (!meta || !file) {
      console.warn(`⚠ 无法解析的 addShape 定义（跳过）: ${chunk.slice(0, 80)}…`)
      continue
    }
    defs.push({ name: meta[1], title: meta[2], category: meta[3], w: Number(meta[4]), h: Number(meta[5]), svg: file[1] })
  }
  return defs
}

// ────────────────────────────── TS 输出 ──────────────────────────────

const GROUPS_DIR = path.join(OUT_DIR, 'groups')
const GEN_CMD = `node scripts/gen-network-shapes.mjs --category ${categories.join(',')}`
const banner = (desc, note) => `// ═══════════════════════════════════════════
// ${desc}（自动生成，勿手改）
// 生成: ${GEN_CMD}
${note.map((l) => `// ${l}`).join('\n')}
// ═══════════════════════════════════════════`

/** 读取已生成的品类数据文件，用于聚合 manifest / 索引（支持只跑部分分类） */
function readGroupFile(groupId) {
  const src = fs.readFileSync(path.join(GROUPS_DIR, `${groupId}.ts`), 'utf8')
  const json = /const raw: IconRaw\[\] = (\[[\s\S]*\])\n/.exec(src)
  if (!json) throw new Error(`品类数据文件无法解析: groups/${groupId}.ts`)
  const raws = JSON.parse(json[1])
  return raws.map((r) => ({ name: r.n, title: r.t }))
}

let total = 0, failed = 0
fs.mkdirSync(GROUPS_DIR, { recursive: true })
for (const category of categories) {
  const defs = parseSchema(category)
  const raws = []
  console.log(`\n══ ${category}: ${defs.length} 个定义 ══`)
  for (const def of defs) {
    const svgPath = path.join(ASSETS, def.svg)
    if (!fs.existsSync(svgPath)) { console.warn(`✗ ${def.name}: 缺少 ${def.svg}`); failed++; continue }
    try {
      const { raw, skipped, mode } = buildShape(def, fs.readFileSync(svgPath, 'utf8'))
      raws.push(raw)
      if (skipped) console.warn(`△ ${def.name}${skipped} (mode=${mode})`)
      total++
    } catch (e) {
      console.warn(`✗ ${def.name} (${def.svg}): ${e.message}`)
      failed++
    }
  }
  // 每个 schema 子分类 → 一个独立数据文件（vite 各自切成 chunk）
  const groups = new Map()
  for (const r of raws) {
    const key = r.g || category
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(r)
  }
  for (const [groupId, list] of groups) {
    if (!GROUP_META.has(groupId)) console.warn(`△ 品类 ${groupId} 缺少 scripts/net-icon-groups.json 展示配置`)
    const file = path.join(GROUPS_DIR, `${groupId}.ts`)
    const content = `${banner(`${groupId} 矢量数据`, [
      '来源: processon_files/（ProcessOn SVG 图标 → IconRaw 紧凑矢量数据）',
      '运行时由 iconShape.buildIconShape 展开为 ShapeDefinition',
      '体积大，只允许 networkLoader 经 netIconChunks 动态 import（勿在主入口静态引用）',
    ])}
import type { ShapeDefinition } from '@/types'
import { buildIconShape, type IconRaw } from '../iconShape'

const raw: IconRaw[] = ${JSON.stringify(list)}

export const shapes: ShapeDefinition[] = raw.map(buildIconShape)
`
    fs.writeFileSync(file, content)
    console.log(`→ groups/${groupId}.ts  (${list.length} 个形状, ${(content.length / 1024).toFixed(0)}KB)`)
  }
}

// ── 聚合产物：常驻 manifest + 动态 import 映射 + 按需搜索索引 ──

const generatedGroupIds = fs
  .readdirSync(GROUPS_DIR)
  .filter((f) => f.endsWith('.ts'))
  .map((f) => f.slice(0, -3))

// 顺序：先按配置里的厂商/品类顺序，配置外的兜底追加（并已告警）
const orderedGroupIds = [
  ...GROUP_CONFIG.groups.map((g) => g.id).filter((id) => generatedGroupIds.includes(id)),
  ...generatedGroupIds.filter((id) => !GROUP_META.has(id)),
]

const groupRows = []
const namesRows = []
const titleRows = []
for (const groupId of orderedGroupIds) {
  const meta = GROUP_META.get(groupId)
  const shapes = readGroupFile(groupId)
  groupRows.push({ id: groupId, vendor: meta?.vendor ?? 'generic', name: meta?.name ?? groupId, count: shapes.length })
  // 图形名常驻主包（ASCII，约 10KB）：文档保存时反查 iconGroups、搜索定位品类都靠它
  namesRows.push([groupId, shapes.map((s) => s.name)])
  // 中文标题按需加载（CJK 体积大，仅面板搜索用）
  titleRows.push([groupId, shapes.map((s) => s.title).join('\u001e')])
}

const vendorRows = GROUP_CONFIG.vendors
  .map((v) => ({ id: v.id, name: v.name, panel: v.panel, groupIds: groupRows.filter((g) => g.vendor === v.id).map((g) => g.id) }))
  .filter((v) => v.groupIds.length > 0)

const manifestFile = path.join(OUT_DIR, 'netIconManifest.ts')
fs.writeFileSync(manifestFile, `${banner('网络拓扑图标面板元数据', [
  '只含厂商/品类名与数量（约 2KB），供左侧面板画骨架与 tab 数字',
  '矢量数据在 groups/ 下按品类动态 import；标题搜索索引在 netIconIndex.ts 按需加载',
])}
export interface NetVendor {
  id: string
  name: string
  /** 所属一级面板分类：net_topo | cloud_icons */
  panel: string
  groupIds: string[]
}

export interface NetGroup {
  id: string
  vendor: string
  name: string
  count: number
}

export const NET_VENDORS: NetVendor[] = ${JSON.stringify(vendorRows)}

export const NET_GROUPS: NetGroup[] = ${JSON.stringify(groupRows)}
`)

const chunksFile = path.join(OUT_DIR, 'netIconChunks.ts')
fs.writeFileSync(chunksFile, `${banner('网络拓扑图标品类 → 动态 import 映射', [
  '必须保持静态可分析（每个 value 一条字面量 import），vite 据此切成 46 个独立 chunk',
])}
import type { ShapeDefinition } from '@/types'

export const NET_ICON_LOADERS: Record<string, () => Promise<ShapeDefinition[]>> = {
${orderedGroupIds.map((id) => `  ${JSON.stringify(id)}: () => import('./groups/${id}').then((m) => m.shapes),`).join('\n')}
}
`)

const namesFile = path.join(OUT_DIR, 'netIconNames.ts')
fs.writeFileSync(namesFile, `${banner('网络拓扑图标「品类 → 图形名」清单', [
  '体积小（ASCII 图形名），常驻主包：文档保存反查 iconGroups、搜索命中定位品类都依赖它',
  '中文标题见 netIconTitles.ts（按需加载）',
])}
export const NET_GROUP_SHAPE_NAMES: Record<string, string[]> = ${JSON.stringify(Object.fromEntries(namesRows))}
`)

const titlesFile = path.join(OUT_DIR, 'netIconTitles.ts')
fs.writeFileSync(titlesFile, `${banner('网络拓扑图标中文标题（按需 import，勿静态引用）', [
  '与 NET_GROUP_SHAPE_NAMES 同序对齐，\\u001e 分隔；仅面板搜索使用',
])}
export const NET_GROUP_SHAPE_TITLES: Record<string, string> = ${JSON.stringify(Object.fromEntries(titleRows))}
`)


// 旧版按厂商整包的产物已由 groups/ 品类级拆分取代
for (const stale of [
  'network.ts', 'networkPanel.ts',
  'networkCisco.ts', 'networkCiscoPanel.ts',
  'networkAws.ts', 'networkAwsPanel.ts',
  'networkAzure.ts', 'networkAzurePanel.ts',
  'networkAliyun.ts', 'networkAliyunPanel.ts',
  'netIconIndex.ts',
]) {
  const p = path.join(OUT_DIR, stale)
  if (fs.existsSync(p)) fs.rmSync(p)
}

const totalIcons = groupRows.reduce((n, g) => n + g.count, 0)
const kb = (p) => (fs.statSync(p).size / 1024).toFixed(1)
console.log(
  `\n完成: ${total} 成功, ${failed} 失败/跳过 | ${vendorRows.length} 厂商 / ${groupRows.length} 品类 chunk / ${totalIcons} 图标`,
)
console.log(`→ ${path.relative(ROOT, manifestFile)}  (${kb(manifestFile)}KB 常驻主包)`)
console.log(`→ ${path.relative(ROOT, chunksFile)}  (${kb(chunksFile)}KB 常驻主包)`)
console.log(`→ ${path.relative(ROOT, namesFile)}  (${kb(namesFile)}KB 常驻主包)`)
console.log(`→ ${path.relative(ROOT, titlesFile)}  (${kb(titlesFile)}KB 按需加载)`)


