#!/usr/bin/env node
/**
 * 旧系统 Schema 分类 → 本项目原生 ShapeDefinition。
 *
 * 与 gen-network-shapes.mjs（SVG 素材 → 矢量图标）互补：这里处理的是旧 designer 用
 * `Schema.addShape({ path:[{actions:[...]}] })` 直接描述几何的图种（BPMN / ER / EPC /
 * EVC / 维恩图 / 组织架构 / 魏朱商业模式）。几何原样搬运，样式归一到本项目默认值
 * （旧 lineWidth:1 / 黑边 / 白底 交给 registry 兜底，dashed、彩色、渐变等保留）。
 *
 *   node scripts/gen-legacy-shapes.mjs                 # 全部目标分类
 *   node scripts/gen-legacy-shapes.mjs --category bpmn # 只跑一个
 *   node scripts/gen-legacy-shapes.mjs --dry-run       # 只报告，不写文件
 */
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

const ROOT = path.resolve(import.meta.dirname, '..')
const ASSETS = path.join(ROOT, 'processon_files')
const OUT_DIR = path.join(ROOT, 'packages/draw/src/core/schema/shapes/legacy')
const BASIC_TS = path.join(ROOT, 'packages/draw/src/core/schema/shapes/basic.ts')

// ═══════════════════════════════════════════
// 目标分类
// ═══════════════════════════════════════════

/** 旧 groupName → 面板二级分组 */
const BPMN_GROUPS = {
  startEvent: ['bpmn_start', '开始事件'],
  intermediateEvent: ['bpmn_intermediate', '中间事件'],
  boundaryEvent: ['bpmn_boundary', '边界事件'],
  endEvent: ['bpmn_end', '结束事件'],
  task: ['bpmn_task', '任务'],
  callActivity: ['bpmn_sub', '子流程与调用活动'],
  subProcess: ['bpmn_sub', '子流程与调用活动'],
  bpmnGateway: ['bpmn_gateway', '网关'],
  dataObject: ['bpmn_data', '数据对象'],
  conversation: ['bpmn_collab', '对话与编排'],
  choreographyTask: ['bpmn_collab', '对话与编排'],
}

/** 旧素材里标题本就是英文的（维恩图一族），补中文 */
const TITLE_CN = {
  greenGradientVennCircle: '绿色渐变维恩圆',
  redGradientVennCircle: '红色渐变维恩圆',
  blueGradientVennCircle: '蓝色渐变维恩圆',
  greenVenn: '绿色维恩',
  redVenn: '红色维恩',
  blueVenn: '蓝色维恩',
  greenVennCircle: '绿色维恩圆',
  redVennCircle: '红色维恩圆',
  blueVennCircle: '蓝色维恩圆',
  blackVennCircle: '黑色维恩圆',
}

const TARGETS = [
  { file: 'bpmn.js', out: 'bpmn', category: 'bpmn', groups: BPMN_GROUPS, fallbackGroup: ['bpmn_misc', '其他'] },
  { file: 'er.js', out: 'er', category: 'er' },
  { file: 'epc.js', out: 'epc', category: 'epc' },
  { file: 'evc.js', out: 'evc', category: 'evc' },
  { file: 'venn.js', out: 'venn', category: 'venn' },
  { file: 'org.js', out: 'org', category: 'org' },
  { file: 'weizhu_bm.js', out: 'weizhuBm', category: 'weizhu_bm' },
]

// ═══════════════════════════════════════════
// 读取旧 Schema
// ═══════════════════════════════════════════

function loadLegacy(files) {
  const shapes = []
  const commands = new Map()
  const Schema = {
    addCategory: () => {},
    addShape: (s) => shapes.push(s),
    addConnector: (s) => shapes.push({ ...s, __connector: true }),
    addGlobalCommand: (name, actions) => commands.set(name, actions),
    addGroup: () => {},
  }
  const sandbox = {
    Schema,
    Model: { getShapeById: () => null, orderList: [] },
    Utils: {},
    $: () => {},
    console,
    window: {},
    document: { addEventListener() {} },
    navigator: { userAgent: '' },
    Math,
    JSON,
  }
  sandbox.globalThis = sandbox
  const ctx = vm.createContext(sandbox)
  for (const f of files) {
    vm.runInContext(fs.readFileSync(path.join(ASSETS, f), 'utf8'), ctx, { filename: f })
  }
  return { shapes: shapes.filter((s) => !s.__connector), commands }
}

/** 从 basic.ts 取 rectangle / round / roundRectangle 的矢量路径，作为旧 actions:{ref} 的原语 */
function loadPrimitives() {
  const src = fs.readFileSync(BASIC_TS, 'utf8')
  const sb = vm.createContext({ Math, JSON })
  const out = {}
  for (const name of ['rectangle', 'round', 'roundRectangle']) {
    const start = src.indexOf(`export const ${name}: ShapeDefinition = {`)
    if (start < 0) throw new Error(`basic.ts 缺少 ${name}`)
    const open = src.indexOf('{', start)
    let depth = 0
    let i = open
    for (; i < src.length; i++) {
      if (src[i] === '{') depth++
      else if (src[i] === '}') {
        depth--
        if (depth === 0) break
      }
    }
    const literal = src.slice(open, i + 1)
    const obj = vm.runInContext(`(${literal})`, sb, { filename: 'basic.ts' })
    out[name] = obj.path
  }
  return out
}

/** 已移植图形名（手写文件 + 网络图标），生成时跳过 */
function portedNames() {
  const dir = path.join(ROOT, 'packages/draw/src/core/schema/shapes')
  const names = new Set()
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.ts') || f === 'index.ts' || /netIcon|iconShape|networkLoader/.test(f)) continue
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory()) continue
    for (const m of fs.readFileSync(p, 'utf8').matchAll(/name: '([^']+)'/g)) names.add(m[1])
  }
  const net = JSON.parse(/= (\{[\s\S]*?\})\n/.exec(fs.readFileSync(path.join(dir, 'netIconNames.ts'), 'utf8'))[1])
  for (const list of Object.values(net)) for (const n of list) names.add(n)
  return names
}

// ═══════════════════════════════════════════
// 转换
// ═══════════════════════════════════════════

const NUMERIC = /^-?\d+(?:\.\d+)?$/
/** Dimension：纯数字归一为 number，表达式字符串原样保留 */
const dim = (v) => (typeof v === 'string' && NUMERIC.test(v.trim()) ? Number(v.trim()) : v)

/**
 * 旧素材的颜色支持 'r-35,g-35,b-35' 这类相对写法：r/g/b 在旧引擎里绑定元素当前填充色，
 * 而旧主题默认填充就是白（themes.js），所以按白底求值成绝对色。
 */
const BASE = 255
function resolveColor(color) {
  if (typeof color !== 'string') return color
  const parts = color.split(',')
  if (parts.length !== 3) return color
  const out = parts.map((p, i) => {
    const ch = 'rgb'[i]
    const rel = new RegExp(`^\\s*${ch}\\s*(?:([+-])\\s*(\\d+))?\\s*$`).exec(p)
    if (!rel) return Number(p)
    if (!rel[1]) return BASE
    return Math.max(0, Math.min(255, BASE - (rel[1] === '+' ? -1 : 1) * Number(rel[2])))
  })
  return out.every(Number.isFinite) ? out.join(',') : color
}

const DEFAULT_LINE_WIDTH = 1.5
/** 旧素材用 'lineWidth+2' 表达相对粗细，落到本项目默认 1.5 的绝对值上 */
function lineWidthOf(v) {
  if (typeof v !== 'string') return v
  const rel = /^\s*lineWidth\s*(?:([+-])\s*(\d+(?:\.\d+)?))?\s*$/.exec(v)
  if (!rel) return Number(v)
  if (!rel[1]) return DEFAULT_LINE_WIDTH
  return DEFAULT_LINE_WIDTH + (rel[1] === '+' ? 1 : -1) * Number(rel[2])
}

/** 旧样式 → 本项目默认值之上的真实差异（旧 'none' 用 lineWidth:0 表达） */
function normalizeStyle(style) {
  if (!style) return null
  const out = {}
  const width = style.lineStyle === 'none' ? 0 : lineWidthOf(style.lineWidth)
  if (width != null && width !== 1) out.lineWidth = width
  if (style.lineColor && style.lineColor !== '0,0,0') out.lineColor = resolveColor(style.lineColor)
  if (style.lineStyle && style.lineStyle !== 'solid' && style.lineStyle !== 'none') out.lineStyle = style.lineStyle
  return Object.keys(out).length ? out : null
}

/**
 * 旧填充 → 本项目 FillStyle。
 * 旧素材的渐变填充（epc/org/venn 共 13 个）降级为外圈实色 + 透明度：本项目渲染器只有纯色填充，
 * 且右侧样式面板也不提供渐变，保留渐变字段只会渲染成黑色。
 */
function normalizeFill(fill) {
  if (!fill) return null
  const { alpha, ...out } = fill
  if (out.type == null) out.type = 'solid'
  if (out.type === 'gradient') {
    const color = out.endColor ?? out.beginColor
    if (!color) return { fill: null, alpha }
    out.type = 'solid'
    out.color = color
    delete out.endColor
    delete out.beginColor
    delete out.gradientType
    delete out.radius
    delete out.angle
  }
  if (out.type === 'solid' && (out.color == null || out.color === '255,255,255')) return { fill: null, alpha }
  if (out.color != null) out.color = resolveColor(out.color)
  return { fill: out, alpha }
}

function normalizeFont(font) {
  if (!font) return null
  const out = { ...font }
  if (out.color === '0,0,0') delete out.color
  else if (out.color) out.color = resolveColor(out.color)
  return Object.keys(out).length ? out : null
}

/**
 * 旧素材把偏移写成绝对像素的图形（如 company_nbly 的 30px 头尾栏）：
 * 换算成 w/h 比例，否则缩放图形时结构跑偏，缩略图自适应也会把墨迹挤出画布。
 * 默认尺寸下数值完全等价。
 */
const PROPORTIONAL_PATCH = { company_nbly: { w: 150, h: 210 } }
const NUM = /^\s*(\d+(?:\.\d+)?)\s*$/
const OFFSET = /^\s*([wh])\s*([+-])\s*(\d+(?:\.\d+)?)\s*$/
const round6 = (v) => String(Math.round(v * 1e6) / 1e6)
/** 绝对像素偏移 → 按所在轴的比例：数字按轴换算，'h-30' 这类式子按对应边长换算 */
function proportional(value, axis, dims) {
  const total = axis === 'w' ? dims.w : dims.h
  if (typeof value === 'number') return value === 0 ? 0 : `${axis}*${round6(value / total)}`
  if (typeof value !== 'string') return value
  const num = NUM.exec(value)
  if (num) return `${axis}*${round6(Number(num[1]) / total)}`
  const off = OFFSET.exec(value)
  if (!off || off[1] !== axis) return value
  const delta = Number(off[3])
  return `${axis}*${round6(off[2] === '+' ? 1 + delta / total : 1 - delta / total)}`
}

/** actions:{ref} / actions:[..., {ref}, ...] 展开为纯动作数组（可能多条子路径） */
function expandActions(actions, refs, commands, seen = new Set()) {
  const items = Array.isArray(actions) ? actions : [actions]
  const subPaths = []
  let current = []
  const flush = () => {
    if (current.length) subPaths.push(current)
    current = []
  }
  for (const item of items) {
    if (item && typeof item.ref === 'string' && item.action == null) {
      const { ref } = item
      if (seen.has(ref)) continue
      if (commands.has(ref)) {
        flush()
        subPaths.push(...expandActions(commands.get(ref), refs, commands, new Set(seen).add(ref)))
        continue
      }
      if (refs[ref]) {
        flush()
        for (const sp of refs[ref]) {
          subPaths.push(Array.isArray(sp) ? sp : sp.actions)
        }
        continue
      }
      console.warn(`   ! 未解析的 ref: ${ref}`)
      continue
    }
    if (item && item.action) current.push(dimAction(item))
  }
  flush()
  return subPaths
}

function dimAction(a) {
  const out = {}
  for (const [k, v] of Object.entries(a)) out[k] = k === 'action' ? v : dim(v)
  return out
}

function convertPath(legacyPath, refs, commands) {
  const out = []
  for (const seg of legacyPath ?? []) {
    const actions = Array.isArray(seg) ? seg : seg.actions
    const style = !Array.isArray(seg) ? normalizeStyle(seg.lineStyle) : null
    const fill = !Array.isArray(seg) ? normalizeFill(seg.fillStyle)?.fill : null
    for (const sub of expandActions(actions, refs, commands)) {
      out.push(style || fill ? { actions: sub, ...(style && { lineStyle: style }), ...(fill && { fillStyle: fill }) } : sub)
    }
  }
  return out
}

const DEFAULT_ANCHORS = [
  { x: 'w/2', y: 0 },
  { x: 'w/2', y: 'h' },
  { x: 0, y: 'h/2' },
  { x: 'w', y: 'h/2' },
]

function convertShape(s, cfg, refs, commands) {
  const shape = {
    name: s.name,
    title: TITLE_CN[s.name] || s.title || s.name,
    category: cfg.category,
  }
  if (cfg.groups) {
    const g = cfg.groups[s.groupName] ?? cfg.fallbackGroup
    if (g) Object.assign(shape, { group: g[0], groupName: g[1] })
  }
  const props = { w: dim(s.props?.w), h: dim(s.props?.h) }
  if (props.w != null || props.h != null) {
    shape.props = {}
    if (props.w != null) shape.props.w = props.w
    if (props.h != null) shape.props.h = props.h
  }
  const path = convertPath(s.path, refs, commands)
  if (!path.length) return { skip: '无可用路径' }
  if (JSON.stringify(s.path).includes('"image"')) return { skip: '依赖位图填充' }
  shape.path = path
  if (s.anchors && JSON.stringify(s.anchors.map(dim2)) !== JSON.stringify(DEFAULT_ANCHORS)) {
    shape.anchors = s.anchors ?? []
  }
  const blocks = (s.textBlock ?? []).map((b) => ({ position: dimPos(b.position), text: b.text ?? '' }))
  const legacyDefaultBlock = { x: 10, y: 0, w: 'w-20', h: 'h' }
  if (
    s.textBlock &&
    (blocks.length !== 1 ||
      JSON.stringify(blocks[0].position) !== JSON.stringify(legacyDefaultBlock) ||
      blocks[0].text !== '')
  ) {
    shape.textBlock = blocks
  }
  const lineStyle = normalizeStyle(s.lineStyle)
  const { fill: fillStyle, alpha } = normalizeFill(s.fillStyle) ?? {}
  const fontStyle = normalizeFont(s.fontStyle)
  if (lineStyle) shape.lineStyle = lineStyle
  if (fillStyle) shape.fillStyle = fillStyle
  if (fontStyle) shape.fontStyle = fontStyle
  if (alpha != null) shape.shapeStyle = { alpha }
  if (s.attribute) {
    const attr = {}
    for (const k of ['container', 'visible', 'rotatable', 'linkable', 'collapsable', 'collapsed', 'markerOffset']) {
      if (s.attribute[k] != null) attr[k] = s.attribute[k]
    }
    if (Object.keys(attr).length) shape.attribute = attr
  }
  if (s.resizeDir) shape.resizeDir = s.resizeDir
  if (PROPORTIONAL_PATCH[s.name]) applyProportional(shape, PROPORTIONAL_PATCH[s.name])
  return { shape }
}

/** 把图形内所有绝对像素坐标改写成 w/h 比例式 */
const COORD_AXIS = { x: 'w', x1: 'w', x2: 'w', y: 'h', y1: 'h', y2: 'h', w: 'w', h: 'h' }
function applyProportional(shape, dims) {
  const fix = (obj) => {
    for (const k of Object.keys(obj)) if (COORD_AXIS[k]) obj[k] = proportional(obj[k], COORD_AXIS[k], dims)
  }
  for (const seg of shape.path ?? []) for (const a of Array.isArray(seg) ? seg : seg.actions) fix(a)
  for (const b of shape.textBlock ?? []) fix(b.position)
  for (const a of shape.anchors ?? []) fix(a)
}
const dim2 = (a) => ({ x: dim(a.x), y: dim(a.y) })
const dimPos = (p) => ({ x: dim(p.x), y: dim(p.y), w: dim(p.w), h: dim(p.h) })

// ═══════════════════════════════════════════
// TS 输出
// ═══════════════════════════════════════════

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/
function ts(v, ind = '') {
  const next = ind + '  '
  if (v === null || v === undefined) return 'null'
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`
  if (Array.isArray(v)) {
    if (!v.length) return '[]'
    const items = v.map((x) => ts(x, next))
    const oneLine = `[${items.join(', ')}]`
    if (oneLine.length + ind.length < 110 && !oneLine.includes('\n')) return oneLine
    return `[\n${items.map((x) => `${next}${x}`).join(',\n')}\n${ind}]`
  }
  const entries = Object.entries(v)
    .filter(([, x]) => x !== undefined)
    .map(([k, x]) => `${IDENT.test(k) ? k : `'${k}'`}: ${ts(x, next)}`)
  const oneLine = `{ ${entries.join(', ')} }`
  if (oneLine.length + ind.length < 110 && !oneLine.includes('\n')) return oneLine
  return `{\n${entries.map((e) => `${next}${e}`).join(',\n')}\n${ind}}`
}

// ═══════════════════════════════════════════
// 主流程
// ═══════════════════════════════════════════

const argv = process.argv.slice(2)
const only = argv.includes('--category') ? argv[argv.indexOf('--category') + 1].split(',') : null
const dryRun = argv.includes('--dry-run')

const files = [...new Set(TARGETS.map((t) => t.file)), 'basic.js']
const { shapes: legacy, commands } = loadLegacy(files)
const refs = loadPrimitives()
const done = portedNames()

const generated = []
const report = []
for (const cfg of TARGETS) {
  if (only && !only.includes(cfg.out) && !only.includes(cfg.category)) continue
  const items = []
  const skipped = []
  for (const s of legacy.filter((x) => x.category === cfg.category)) {
    if (done.has(s.name)) continue
    const r = convertShape(s, cfg, refs, commands)
    if (r.skip) skipped.push(`${s.name}(${s.title}) ${r.skip}`)
    else items.push(r.shape)
  }
  report.push({ out: cfg.out, category: cfg.category, count: items.length, skipped })
  generated.push({ cfg, items })
}

if (!dryRun) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  for (const { cfg, items } of generated) {
    const body = items.map((s) => `/** ${s.title}（${s.props?.w ?? '?'}×${s.props?.h ?? '?'}） */\n${ts(s)}`).join(',\n')
    const file = `// ═══════════════════════════════════════════
// 旧系统 ${cfg.file} 中尚未移植的 ${items.length} 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category ${cfg.out}（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const ${cfg.out}LegacyShapes: ShapeDefinition[] = [
${body.split('\n').map((l) => (l ? `  ${l}` : l)).join('\n')}
]
`
    fs.writeFileSync(path.join(OUT_DIR, `${cfg.out}.ts`), file)
  }
  const imports = generated.map((g) => `import { ${g.cfg.out}LegacyShapes } from './${g.cfg.out}'`).join('\n')
  fs.writeFileSync(
    path.join(OUT_DIR, 'index.ts'),
    `// 自动生成: node scripts/gen-legacy-shapes.mjs（勿手改）
import type { ShapeDefinition } from '@/types'
${imports}

/** 旧 Schema 分类移植过来的图形，由 shapes/index.ts 统一注册 */
export const legacyShapes: ShapeDefinition[] = [
${generated.map((g) => `  ...${g.cfg.out}LegacyShapes,`).join('\n')}
]
`,
  )
}

const total = generated.reduce((n, g) => n + g.items.length, 0)
console.log(`${dryRun ? '[dry-run] ' : ''}生成 ${total} 个图形：`)
for (const r of report) {
  console.log(`  ${r.out.padEnd(10)} ${String(r.count).padStart(3)} 个${r.skipped.length ? `  跳过 ${r.skipped.length}: ${r.skipped.join('; ')}` : ''}`)
}
if (!dryRun) console.log(`\n输出目录: ${path.relative(ROOT, OUT_DIR)}/`)
