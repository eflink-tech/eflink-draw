#!/usr/bin/env node
/**
 * draw.io stencil XML → eflink-draw IconRaw 代码生成器
 *
 * 用法（在 eflink-draw 目录下）:
 *   node scripts/gen-drawio-stencils.mjs
 *
 * 输入: scripts/drawio-stencils/*.xml.gz（jgraph/drawio dev 分支解码，Apache 2.0，见目录 README）
 *       scripts/net-icon-groups.json（新库的厂商/品类配置，file 字段指向 XML 源）
 * 输出（与 gen-network-shapes.mjs 同一套聚合产物，重跑即覆盖）:
 *   packages/draw/src/core/schema/shapes/groups/<groupId>.ts
 *   netIconManifest.ts / netIconChunks.ts / netIconNames.ts / netIconTitles.ts
 *
 * 转换语义（对齐 mxStencil.js drawNode）:
 * - 几何: move/line/curve/quad/arc/close/rect/roundrect/ellipse → M/L/C/Z 轮廓（arc 展开为三次贝塞尔）
 * - 状态机: fillcolor/strokecolor/alpha/strokewidth/save/restore；fill/stroke/fillstroke 时机快照整条路径
 * - 颜色: '#hex' 直填；'none' 透明；变量色取节点 default 属性（drawio palette 同源），兜底白/黑
 * - 模式: 全段同色填充 → m='fill'（面板可改色）；全段同色描边 → m='stroke'；否则 multi 锁色
 * - <text>: 仅"唯一文本"的形状映射为 IconRaw.tx 预填文案，多条文本剥离（mockup 表格类丢失文字属预期）
 * - <image>/<include-shape>/dashed: 跳过并告警
 * - 坐标: 以 stencil 自报 w/h 为视口归一到千分比整数，bbox 超界 3% 时等比缩回 96%（与 SVG 管线一致）
 */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import process from 'node:process'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC_DIR = path.join(ROOT, 'scripts/drawio-stencils')
const OUT_DIR = path.join(ROOT, 'packages/draw/src/core/schema/shapes')
const GROUPS_DIR = path.join(OUT_DIR, 'groups')

const GROUP_CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/net-icon-groups.json'), 'utf8'))
/** groupId → { name, vendor, file }（仅 drawio 新库） */
const DRAWIO_GROUPS = GROUP_CONFIG.groups.filter((g) => g.file)

// 各集合的初始画布状态（对齐 drawio palette 默认样式）:
// - signs: fillColor=#000000;strokeColor=none → 纯色剪影，面板可整体改色
// - electrical 二极管: fillColor=strokeColor → 黑填充；其余默认白底黑框
// - rack/mockup/aws4/阿里云: drawio 默认白底黑框（rack 变量色走节点 default 属性）
const SIGNS_STYLE = { fill: '#000000', stroke: 'none' }
const DIODE_STYLE = { fill: '#000000', stroke: '#000000' }
const PLAIN_STYLE = { fill: '#ffffff', stroke: '#000000' }
// drawio palette 官方默认色（Sidebar-AWS4/Sidebar-AlibabaCloud 同源）：
// AWS 2023 资源图标 = Squid Ink 深藏青剪影；阿里云 = 品牌橙剪影（strokeColor=none）
const AWS4_STYLE = { fill: '#232F3E', stroke: 'none' }
const ALI_STYLE = { fill: '#FF6A00', stroke: 'none' }
const defaultStyleFor = (file) => {
  if (file.startsWith('signs__')) return SIGNS_STYLE
  if (file === 'electrical__diodes.xml') return DIODE_STYLE
  if (file === 'aws4.xml') return AWS4_STYLE
  if (file === 'alibaba_cloud.xml') return ALI_STYLE
  return PLAIN_STYLE
}

// ────────────────────────────── XML 解析（复用 SVG 管线的标签解析思路） ──────────────────────────────

function parseAttrs(str) {
  const attrs = {}
  const re = /([\w:-]+)\s*=\s*"([^"]*)"|([\w:-]+)\s*=\s*'([^']*)'/g
  let m
  while ((m = re.exec(str))) attrs[m[1] || m[3]] = m[2] ?? m[4]
  return attrs
}

function parseXmlTree(src) {
  const tagRe = /<!--[\s\S]*?-->|<(\/?)([A-Za-z][\w:-]*)((?:"[^"]*"|'[^']*'|[^"'>])*)>/g
  const root = { tag: '#root', attrs: {}, children: [] }
  const stack = [root]
  let m
  while ((m = tagRe.exec(src))) {
    if (m[0].startsWith('<!')) continue
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

const num = (attrs, key, dflt = 0) => {
  const v = attrs[key]
  return v == null || v === '' ? dflt : Number(v)
}

// ────────────────────────────── 颜色 ──────────────────────────────

const NAMED = { black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000', blue: '#0000ff' }

/** mxStencil.parseColor 语义的烘焙版：变量色取 default 属性，兜底白/黑 */
function resolveColor(raw, defaultAttr, kind, state) {
  if (raw == null) return null
  const s = String(raw).trim()
  if (s === 'none' || s === 'transparent') return null
  if (s === 'stroke') return state.stroke
  if (s === 'fill') return state.fill
  const lower = s.toLowerCase()
  if (NAMED[lower]) return hexToRgb(NAMED[lower])
  if (s.startsWith('#')) return hexToRgb(s)
  if (defaultAttr) return hexToRgb(defaultAttr)
  return kind === 'fill' ? hexToRgb('#ffffff') : hexToRgb('#000000')
}

function hexToRgb(hex) {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  if (h.length === 8) h = h.slice(0, 6)
  if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) return null
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
}

/** alpha 与白底合成（Konva fillStyle 无每段 alpha，与 SVG 管线一致） */
function composite(c, alpha) {
  if (!c) return null
  const a = Math.min(1, Math.max(0, (alpha ?? 1)))
  const mix = (v) => Math.round(v * a + 255 * (1 - a))
  return { r: mix(c.r), g: mix(c.g), b: mix(c.b) }
}
const rgbStr = (c) => `${c.r},${c.g},${c.b}`

// ────────────────────────────── 弧 → 三次贝塞尔（SVG 管线同款） ──────────────────────────────

function arcToCubics(p0, p1, rx, ry, phiDeg, largeArc, sweep) {
  const out = []
  if (rx === 0 || ry === 0 || (p0[0] === p1[0] && p0[1] === p1[1])) return out
  rx = Math.abs(rx); ry = Math.abs(ry)
  const phi = (phiDeg * Math.PI) / 180
  const cosP = Math.cos(phi), sinP = Math.sin(phi)
  const dx = (p0[0] - p1[0]) / 2, dy = (p0[1] - p1[1]) / 2
  const x1 = cosP * dx + sinP * dy, y1 = -sinP * dx + cosP * dy
  let lam = (x1 * x1) / (rx * rx) + (y1 * y1) / (ry * ry)
  if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam) }
  const sign = largeArc === sweep ? -1 : 1
  const nmr = rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1
  const den = rx * rx * y1 * y1 + ry * ry * x1 * x1
  const co = sign * Math.sqrt(Math.max(0, nmr / den))
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
  for (let i = 0; i < segN; i++) {
    const c1 = Math.cos(th), s1 = Math.sin(th)
    th += delta
    const c2 = Math.cos(th), s2 = Math.sin(th)
    const ep = (c, s) => [cx + rx * c * cosP - ry * s * sinP, cy + rx * c * sinP + ry * s * cosP]
    const der = (c, s) => [-rx * s * cosP - ry * c * sinP, -rx * s * sinP + ry * c * cosP]
    const start = i === 0 ? ep(Math.cos(th1), Math.sin(th1)) : ep(c1, s1)
    const e2 = ep(c2, s2)
    const d1 = der(c1, s1), d2 = der(c2, s2)
    out.push({ t: 'C', p1: [start[0] + k * d1[0], start[1] + k * d1[1]], p2: [e2[0] - k * d2[0], e2[1] - k * d2[1]], p: e2 })
  }
  if (out.length) out[out.length - 1].p = [p1[0], p1[1]]
  return out
}

const K = 0.5522847498307936

// ────────────────────────────── 单个 shape → segments ──────────────────────────────

/** stencil 几何缓冲：轮廓列表 + 当前点；fill/stroke 时机整段快照 */
function makeCanvas() {
  return {
    contours: [],
    last: null, // 当前轮廓（close 后继续画线仍回到该轮廓）
    closed: false,
    begin() { this.contours = []; this.last = null },
    start(p) { this.last = { from: p, segs: [] }; this.contours.push(this.last); this.closed = false },
    cur() { return this.last },
    line(p) {
      if (!this.last) { this.start(p); return }
      this.last.segs.push({ t: 'L', p })
    },
    curve(c1, c2, p) {
      if (!this.last) this.start([...c1])
      this.last.segs.push({ t: 'C', p1: c1, p2: c2, p })
    },
    close() {
      if (this.last && !this.closed) { this.last.segs.push({ t: 'Z' }); this.closed = true }
    },
  }
}

/** shape 节点 → { segments, texts, warnings }（mxGraph 坐标，未归一） */
function convertShape(shapeNode, defStyle) {
  const segments = []
  const texts = []
  const warnings = []
  let state = { fill: hexToRgb(defStyle.fill), stroke: defStyle.stroke === 'none' ? null : hexToRgb(defStyle.stroke), sw: 1, alpha: 1 }
  const stack = []
  const canvas = makeCanvas()

  const emit = (op) => {
    if (!canvas.contours.length) return
    const fill = op.fill ? composite(state.fill, state.alpha) : null
    const stroke = op.stroke ? composite(state.stroke, state.alpha) : null
    if (!fill && !stroke) return
    segments.push({
      contours: canvas.contours.map((c) => ({ from: [...c.from], segs: c.segs.map((s) => ({ ...s, ...(s.p1 ? { p1: [...s.p1] } : {}), ...(s.p2 ? { p2: [...s.p2] } : {}), ...(s.p ? { p: [...s.p] } : {}) })) })),
      fill: op.fill ? fill : null,
      stroke: op.stroke ? stroke : null,
      sw: op.stroke ? state.sw : 0,
    })
  }

  const geo = (node) => {
    const a = node.attrs
    switch (node.tag) {
      case 'move': canvas.start([num(a, 'x'), num(a, 'y')]); break
      case 'line': canvas.line([num(a, 'x'), num(a, 'y')]); break
      case 'curve': canvas.curve([num(a, 'x1'), num(a, 'y1')], [num(a, 'x2'), num(a, 'y2')], [num(a, 'x3'), num(a, 'y3')]); break
      case 'quad': {
        const cur = canvas.last ? endPointOf(canvas.last) : [num(a, 'x1'), num(a, 'y1')]
        const ctrl = [num(a, 'x1'), num(a, 'y1')], p = [num(a, 'x2'), num(a, 'y2')]
        canvas.curve(
          [cur[0] + (2 / 3) * (ctrl[0] - cur[0]), cur[1] + (2 / 3) * (ctrl[1] - cur[1])],
          [p[0] + (2 / 3) * (ctrl[0] - p[0]), p[1] + (2 / 3) * (ctrl[1] - p[1])],
          p,
        )
        break
      }
      case 'arc': {
        const cur = canvas.last ? endPointOf(canvas.last) : [num(a, 'x'), num(a, 'y')]
        const p = [num(a, 'x'), num(a, 'y')]
        const rx = num(a, 'rx'), ry = num(a, 'ry')
        if (rx === 0 || ry === 0) { canvas.line(p); break }
        for (const seg of arcToCubics(cur, p, rx, ry, num(a, 'x-axis-rotation'), !!num(a, 'large-arc-flag'), !!num(a, 'sweep-flag'))) {
          canvas.curve(seg.p1, seg.p2, seg.p)
        }
        break
      }
      case 'rect': {
        const x = num(a, 'x'), y = num(a, 'y'), w = num(a, 'w'), h = num(a, 'h')
        if (!(w > 0 && h > 0)) break
        canvas.start([x, y])
        canvas.line([x + w, y]); canvas.line([x + w, y + h]); canvas.line([x, y + h]); canvas.close()
        break
      }
      case 'roundrect': {
        const x = num(a, 'x'), y = num(a, 'y'), w = num(a, 'w'), h = num(a, 'h')
        if (!(w > 0 && h > 0)) break
        let factor = num(a, 'arcsize') / 100
        if (!factor) factor = 0.15 // mxConstants.RECTANGLE_ROUNDING_FACTOR
        const r = Math.min(w * factor, h * factor)
        canvas.start([x + r, y])
        canvas.line([x + w - r, y])
        canvas.curve([x + w - r + r * K, y], [x + w, y + r - r * K], [x + w, y + r])
        canvas.line([x + w, y + h - r])
        canvas.curve([x + w, y + h - r + r * K], [x + w - r + r * K, y + h], [x + w - r, y + h])
        canvas.line([x + r, y + h])
        canvas.curve([x + r - r * K, y + h], [x, y + h - r + r * K], [x, y + h - r])
        canvas.line([x, y + r])
        canvas.curve([x, y + r - r * K], [x + r - r * K, y], [x + r, y])
        canvas.close()
        break
      }
      case 'ellipse': {
        const x = num(a, 'x'), y = num(a, 'y'), w = num(a, 'w'), h = num(a, 'h')
        if (!(w > 0 && h > 0)) break
        const cx = x + w / 2, cy = y + h / 2, rx = w / 2, ry = h / 2
        canvas.start([cx + rx, cy])
        canvas.curve([cx + rx, cy + ry * K], [cx + rx * K, cy + ry], [cx, cy + ry])
        canvas.curve([cx - rx * K, cy + ry], [cx - rx, cy + ry * K], [cx - rx, cy])
        canvas.curve([cx - rx, cy - ry * K], [cx - rx * K, cy - ry], [cx, cy - ry])
        canvas.curve([cx + rx * K, cy - ry], [cx + rx, cy - ry * K], [cx + rx, cy])
        canvas.close()
        break
      }
      default: break
    }
  }

  const walk = (nodes) => {
    for (const node of nodes) {
      switch (node.tag) {
        case 'save': stack.push({ ...state }); break
        case 'restore': state = stack.pop() ?? state; break
        case 'path': canvas.begin(); walk(node.children); break
        case 'fillcolor': {
          const c = resolveColor(node.attrs.color, node.attrs.default, 'fill', state)
          state = { ...state, fill: c }
          break
        }
        case 'strokecolor': {
          const c = resolveColor(node.attrs.color, node.attrs.default, 'stroke', state)
          state = { ...state, stroke: c }
          break
        }
        case 'alpha': case 'fillalpha': case 'strokealpha':
          state = { ...state, alpha: num(node.attrs, 'alpha', 1) }
          break
        case 'strokewidth': case 'strokedwidth': {
          const w = num(node.attrs, 'width', 1)
          state = { ...state, sw: w > 0 ? w : state.sw }
          break
        }
        case 'fill': emit({ fill: true, stroke: false }); break
        case 'stroke': emit({ fill: false, stroke: true }); break
        case 'fillstroke': emit({ fill: true, stroke: true }); break
        case 'dashed': case 'dashpattern': case 'linejoin': case 'linecap': case 'miterlimit':
          warnings.push(`<${node.tag}> 忽略`)
          break
        case 'text': {
          const str = (node.attrs.str ?? '').trim()
          if (str && !str.includes('${')) texts.push(str)
          break
        }
        case 'image': warnings.push('<image> 剥离'); break
        case 'include-shape': warnings.push('<include-shape> 剥离'); break
        default:
          if (['move', 'line', 'curve', 'quad', 'arc', 'rect', 'roundrect', 'ellipse'].includes(node.tag)) geo(node)
          break
      }
    }
  }

  const bg = shapeNode.children.find((c) => c.tag === 'background')
  const fg = shapeNode.children.find((c) => c.tag === 'foreground')
  if (bg) walk(bg.children)
  if (fg) walk(fg.children)
  return { segments, texts, warnings }
}

function endPointOf(contour) {
  const segs = contour.segs
  for (let i = segs.length - 1; i >= 0; i--) {
    if (segs[i].p) return [...segs[i].p]
  }
  return [...contour.from]
}

// ────────────────────────────── segments → IconRaw ──────────────────────────────

const round2 = (v) => Math.round(v * 100) / 100

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

function buildRaw(name, title, groupId, w, h, segments, tx) {
  // bbox 超界归一（与 SVG 管线同策略）
  let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity
  for (const s of segments) {
    for (const c of s.contours) {
      for (const pt of [c.from, ...c.segs.flatMap((g) => [g.p1, g.p2, g.p].filter(Boolean))]) {
        if (pt[0] < bx0) bx0 = pt[0]
        if (pt[0] > bx1) bx1 = pt[0]
        if (pt[1] < by0) by0 = pt[1]
        if (pt[1] > by1) by1 = pt[1]
      }
    }
  }
  const tolX = w * 0.03, tolY = h * 0.03
  if (bx0 < -tolX || bx1 > w + tolX || by0 < -tolY || by1 > h + tolY) {
    const bw = bx1 - bx0 || 1, bh = by1 - by0 || 1
    const k = Math.min((w * 0.96) / bw, (h * 0.96) / bh)
    const cx = (bx0 + bx1) / 2, cy = (by0 + by1) / 2
    const tx2 = w / 2 - cx * k, ty2 = h / 2 - cy * k
    for (const s of segments) {
      for (const c of s.contours) {
        c.from = [c.from[0] * k + tx2, c.from[1] * k + ty2]
        for (const g of c.segs) {
          if (g.p1) g.p1 = [g.p1[0] * k + tx2, g.p1[1] * k + ty2]
          if (g.p2) g.p2 = [g.p2[0] * k + tx2, g.p2[1] * k + ty2]
          if (g.p) g.p = [g.p[0] * k + tx2, g.p[1] * k + ty2]
        }
      }
      s.sw = round2(s.sw * k)
    }
  }

  const filled = segments.filter((s) => s.fill)
  const stroked = segments.filter((s) => s.stroke && s.sw > 0)
  const fillColors = new Set(filled.map((s) => rgbStr(s.fill)))
  const strokeColors = new Set(stroked.map((s) => `${rgbStr(s.stroke)}@${round2(s.sw)}`))
  const monoFill = filled.length === segments.length && fillColors.size === 1 && !stroked.length
  const monoStroke = stroked.length === segments.length && strokeColors.size === 1 && !filled.length

  const raw = {
    n: name,
    t: title,
    c: groupId,
    g: groupId,
    w: round2(w),
    h: round2(h),
    segs: segments.map((s) => ({
      cmds: contoursToCmds(s.contours, w, h),
      ...(monoFill || monoStroke ? {} : {
        fill: s.fill ? rgbStr(s.fill) : 'none',
        stroke: s.stroke && s.sw > 0 ? rgbStr(s.stroke) : 'none',
        sw: s.stroke && s.sw > 0 ? round2(s.sw) : 0,
      }),
    })),
    ...(tx && { tx }),
  }
  if (monoFill) {
    raw.m = 'fill'
    // 纯白 mono-fill 在白底画布/面板上不可见（多为 <image> logo 被剥离的残骸），降级为浅灰可见
    raw.fc = filled[0].fill.r === 255 && filled[0].fill.g === 255 && filled[0].fill.b === 255
      ? '230,230,230'
      : rgbStr(filled[0].fill)
  }
  else if (monoStroke) {
    raw.m = 'stroke'
    const [rgb, lw] = [...strokeColors][0].split('@')
    raw.lc = rgb; raw.lw = Number(lw)
  } else { raw.m = 'multi' }
  return raw
}

// ────────────────────────────── 主流程：按配置文件分组转换 ──────────────────────────────

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'shape'
const titleOf = (s) => {
  const t = String(s).replace(/[_/]+/g, ' ').replace(/\s+/g, ' ').trim()
  return t ? t[0].toUpperCase() + t.slice(1) : 'Shape'
}

/** file → 解析出的 shapes（同名文件多个品类共用，只解析一次） */
const fileCache = new Map()
function loadFile(file) {
  if (fileCache.has(file)) return fileCache.get(file)
  const gz = fs.readFileSync(path.join(SRC_DIR, `${file}.gz`))
  const src = zlib.gunzipSync(gz).toString('utf8')
  const root = parseXmlTree(src)
  const shapesNode = root.children.find((c) => c.tag === 'shapes') ?? root
  const shapes = []
  for (const shapeNode of shapesNode.children) {
    if (shapeNode.tag !== 'shape') continue
    shapes.push({
      name: shapeNode.attrs.name ?? '',
      w: num(shapeNode.attrs, 'w', 64) || 64,
      h: num(shapeNode.attrs, 'h', 64) || 64,
      node: shapeNode,
    })
  }
  const converted = shapes.map((s) => ({ ...s, result: convertShape(s.node, defaultStyleFor(file)) }))
  fileCache.set(file, converted)
  return converted
}

/** 字母分段品类（ali2_/aws4_）：同一文件的兄弟品类按首字母区间落桶 */
const bucketIndex = (siblings, shapeName) => {
  const first = (shapeName[0] || '').toLowerCase()
  if (!/[a-z]/.test(first)) return 0
  const idx = siblings.findIndex((sg) => {
    const parts = sg.id.split('_').slice(1)
    const lo = parts[0][0]
    const hi = parts.length > 1 ? parts[1][0] : parts[0][parts[0].length - 1]
    return first >= lo && first <= hi
  })
  return idx < 0 ? 0 : idx
}

let total = 0
let failed = 0
const rawsByGroup = new Map()
const usedNames = new Map()

for (const g of DRAWIO_GROUPS) {
  const shapes = loadFile(g.file)
  let list = rawsByGroup.get(g.id)
  if (!list) { list = []; rawsByGroup.set(g.id, list) }
  const bucketed = g.id.startsWith('ali2_') || g.id.startsWith('aws4_')
  const siblings = bucketed ? DRAWIO_GROUPS.filter((x) => x.file === g.file) : null
  const myBucket = bucketed ? siblings.indexOf(g) : -1
  for (const s of shapes) {
    if (bucketed && bucketIndex(siblings, s.name) !== myBucket) continue
    const { segments, texts, warnings } = s.result
    if (!segments.length) { console.warn(`✗ ${s.name || '(noname)'}: 无可转换路径${warnings.length ? ` [${warnings.join('; ')}]` : ''}`); failed++; continue }
    const base = `${g.id}_${slug(s.name)}`
    const used = usedNames.get(g.id) ?? new Set()
    usedNames.set(g.id, used)
    let name = base
    for (let i = 2; used.has(name); i++) name = `${base}_${i}`
    used.add(name)
    const tx = texts.length === 1 ? texts[0] : undefined
    list.push(buildRaw(name, titleOf(s.name), g.id, s.w, s.h, segments, tx))
    total++
    if (warnings.length) console.warn(`△ ${name} [跳过: ${[...new Set(warnings)].join('; ')}]`)
  }
}

// 字母分段品类的显示名按实际内容回填（阿里云/AWS 2023）
for (const g of DRAWIO_GROUPS) {
  if (!(g.id.startsWith('ali2_') || g.id.startsWith('aws4_'))) continue
  const list = rawsByGroup.get(g.id) ?? []
  const letters = list.map((r) => r.t[0].toUpperCase()).sort()
  if (!letters.length) continue
  const span = letters.length > 1 && letters[0] !== letters[letters.length - 1]
    ? `${letters[0]}–${letters[letters.length - 1]}`
    : letters[0]
  const prefix = g.id.startsWith('ali2_') ? '阿里云 ' : 'AWS 2023 '
  g.name = `${prefix}${span}`
}

// ── 输出品类 chunk ──
const GEN_CMD = 'node scripts/gen-drawio-stencils.mjs'
const banner = (desc, notes) => `// ═══════════════════════════════════════════
// ${desc}（自动生成，勿手改）
// 生成: ${GEN_CMD}
${notes.map((l) => `// ${l}`).join('\n')}
// ═══════════════════════════════════════════`

fs.mkdirSync(GROUPS_DIR, { recursive: true })
for (const [groupId, list] of rawsByGroup) {
  if (!list.length) { console.warn(`△ 品类 ${groupId} 为空，跳过`); continue }
  const content = `${banner(`${groupId} 矢量数据`, [
    '来源: scripts/drawio-stencils/（jgraph/drawio stencil XML → IconRaw，Apache 2.0）',
    '运行时由 iconShape.buildIconShape 展开为 ShapeDefinition',
    '体积大，只允许 networkLoader 经 netIconChunks 动态 import（勿在主入口静态引用）',
  ])}
import type { ShapeDefinition } from '@/types'
import { buildIconShape, type IconRaw } from '../iconShape'

const raw: IconRaw[] = ${JSON.stringify(list)}

export const shapes: ShapeDefinition[] = raw.map(buildIconShape)
`
  fs.writeFileSync(path.join(GROUPS_DIR, `${groupId}.ts`), content)
  console.log(`→ groups/${groupId}.ts  (${list.length} 个形状, ${(content.length / 1024).toFixed(0)}KB)`)
}

// ── 聚合产物（与 gen-network-shapes.mjs 同构：覆盖全部 groups/*.ts） ──

function readGroupFile(groupId) {
  const src = fs.readFileSync(path.join(GROUPS_DIR, `${groupId}.ts`), 'utf8')
  const json = /const raw: IconRaw\[\] = (\[[\s\S]*\])\n/.exec(src)
  if (!json) throw new Error(`品类数据文件无法解析: groups/${groupId}.ts`)
  const raws = JSON.parse(json[1])
  return raws.map((r) => ({ name: r.n, title: r.t }))
}

const generatedGroupIds = fs
  .readdirSync(GROUPS_DIR)
  .filter((f) => f.endsWith('.ts'))
  .map((f) => f.slice(0, -3))

const orderedGroupIds = [
  ...GROUP_CONFIG.groups.map((g) => g.id).filter((id) => generatedGroupIds.includes(id)),
  ...generatedGroupIds.filter((id) => !GROUP_CONFIG.groups.some((g) => g.id === id)),
]

const groupRows = []
const namesRows = []
const titleRows = []
for (const groupId of orderedGroupIds) {
  const meta = GROUP_CONFIG.groups.find((g) => g.id === groupId)
  const shapes = readGroupFile(groupId)
  groupRows.push({ id: groupId, vendor: meta?.vendor ?? 'generic', name: meta?.name ?? groupId, count: shapes.length })
  namesRows.push([groupId, shapes.map((s) => s.name)])
  titleRows.push([groupId, shapes.map((s) => s.title).join('\u001e')])
}

const vendorRows = GROUP_CONFIG.vendors
  .map((v) => ({ id: v.id, name: v.name, panel: v.panel, groupIds: groupRows.filter((g) => g.vendor === v.id).map((g) => g.id) }))
  .filter((v) => v.groupIds.length > 0)

const bannerAgg = (desc, notes) => `// ═══════════════════════════════════════════
// ${desc}（自动生成，勿手改）
// 生成: ${GEN_CMD}（聚合全部 groups/*.ts，含 ProcessOn 与 drawio 两批来源）
${notes.map((l) => `// ${l}`).join('\n')}
// ═══════════════════════════════════════════`

fs.writeFileSync(path.join(OUT_DIR, 'netIconManifest.ts'), `${bannerAgg('网络拓扑/素材图标面板元数据', [
  '只含厂商/品类名与数量，供左侧面板画骨架与 tab 数字',
  '矢量数据在 groups/ 下按品类动态 import；标题索引在 netIconTitles.ts 按需加载',
])}
export interface NetVendor {
  id: string
  name: string
  /** 所属一级面板分类：net_topo | cloud_icons | signs_icons | electrical | rack | mockup */
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

fs.writeFileSync(path.join(OUT_DIR, 'netIconChunks.ts'), `${bannerAgg('图标品类 → 动态 import 映射', [
  '必须保持静态可分析（每个 value 一条字面量 import），vite 据此切独立 chunk',
])}
import type { ShapeDefinition } from '@/types'

export const NET_ICON_LOADERS: Record<string, () => Promise<ShapeDefinition[]>> = {
${orderedGroupIds.map((id) => `  ${JSON.stringify(id)}: () => import('./groups/${id}').then((m) => m.shapes),`).join('\n')}
}
`)

fs.writeFileSync(path.join(OUT_DIR, 'netIconNames.ts'), `${bannerAgg('「品类 → 图形名」清单', [
  '体积小（ASCII 图形名），常驻主包：文档保存反查 iconGroups、搜索命中定位品类都依赖它',
  '标题见 netIconTitles.ts（按需加载）',
])}
export const NET_GROUP_SHAPE_NAMES: Record<string, string[]> = ${JSON.stringify(Object.fromEntries(namesRows))}
`)

fs.writeFileSync(path.join(OUT_DIR, 'netIconTitles.ts'), `${bannerAgg('图标标题索引（按需 import，勿静态引用）', [
  '与 NET_GROUP_SHAPE_NAMES 同序对齐，\\u001e 分隔；仅面板搜索使用',
])}
export const NET_GROUP_SHAPE_TITLES: Record<string, string> = ${JSON.stringify(Object.fromEntries(titleRows))}
`)

const totalIcons = groupRows.reduce((n, g) => n + g.count, 0)
console.log(`\n完成: drawio ${total} 成功, ${failed} 失败/跳过 | ${vendorRows.length} 厂商 / ${groupRows.length} 品类 / ${totalIcons} 图标（含既有 ProcessOn 批次）`)
