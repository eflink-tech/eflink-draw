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
import { MOBILE_GLYPHS } from './lib/mobile-glyphs.mjs'
import { IOS_ICON_GLYPHS } from './lib/mobile-icon-glyphs.mjs'
import { ANDROID_ICON_GLYPHS } from './lib/android-icon-glyphs.mjs'
import { MOBILE_STYLES, MOBILE_SCALE } from './lib/mobile-styles.mjs'

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

/** 旧素材里标题本就是英文的（维恩图一族、Android 控件），补中文 */
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
  andriodButton1: '按钮',
  andriodCheck: '复选框',
  andriodRadio: '单选按钮',
  andriodSwitchOff: '开关：关',
  andriodSwitchOnf: '开关：开',
  // iOS 图标：旧素材同一字形按配色/底形出了好几个图形，标题一律只写「添加」在面板里没法挑
  ios7AddBlack: '添加（黑底）',
  ios7AddBlackLight: '添加（描边）',
  ios7AddGreen: '添加（绿底）',
  ios7AddNormal: '添加（蓝描边）',
  ios7RemoveBlack: '删除（黑底）',
  ios7RemoveBlackLight: '删除（描边）',
  ios7RemoveRed: '删除（红底）',
  ios7AddSmall: '加号',
  ios7Close1: '关闭',
  ios7Close2: '关闭（蓝标签）',
  ios7Close3: '关闭（黑标签）',
  ios7Close4: '关闭（标签描边）',
  ios7Refresh: '刷新',
  ios7SearchIcon: '搜索',
  ios7SearchBig: '搜索（大）',
  ios7MenuIcon: '菜单',
  ios7Info1: '信息（蓝描边）',
  ios7Info2: '信息（描边）',
  ios7Info3: '信息（黑底）',
  ios7Check1: '选中（描边）',
  ios7Check2: '选中（蓝底）',
  ios7Check3: '选中（黑底）',
  ios7Check4: '对勾（蓝）',
  ios7Check5: '对勾',
  ios7Play1: '播放（黑底）',
  ios7Play2: '播放（描边）',
  ios7Pause1: '暂停（黑底）',
  ios7Pause2: '暂停（描边）',
  ios7Stop1: '暂停（蓝描边）',
  ios7Stop2: '停止（描边）',
  ios7Stop3: '停止（黑底）',
  ios7Favourite: '收藏（蓝）',
  ios7Favourite1: '收藏（描边）',
  ios7Heart: '喜欢',
  ios7Bookmark: '书签',
  ios7Profile: '个人信息',
  ios7Copy: '复制',
  ios7Upload: '上传',
  ios7Download: '下载',
  ios7Wifi: '无线网络',
  ios7Bluetooth: '蓝牙',
  ios7Battery: '电池',
  ios7Lock: '锁定',
  ios7Camera: '相机',
  ios7Sound: '声音',
  ios7Video: '视频',
  ios7ListIcon: '列表',
  ios7Locate: '定位',
  ios7Trash: '垃圾箱',
  ios7Help: '帮助',
  ios7AlertIcon: '提醒',
  ios7Clock: '时钟',
  ios7Phone: '电话',
  ios7Message: '消息',
  ios7Mail: '邮件',
  // Android 图标：旧素材整分类标题都是空的，面板里全靠这里补
  andriod_icons_alert1: '警告（黑底）',
  andriod_icons_alert2: '警告（红底）',
  andriod_icons_alert3: '警告（黄三角）',
  andriod_icons_alert4: '警告（黑三角）',
  andriod_icons_0: '柱状图',
  andriod_icons_1: '加号',
  andriod_icons_2: '心形',
  andriod_icons_3: '安卓机器人',
  andriod_icons_4: '铃铛',
  andriod_icons_5: '回形针',
  andriod_icons_6: '二维码',
  andriod_icons_7: '信号强度',
  andriod_icons_8: '蓝牙',
  andriod_icons_9: '书本',
  andriod_icons_10: '书签',
  andriod_icons_11: '相机',
  andriod_icons_12: '公文包',
  andriod_icons_13: '日历',
  andriod_icons_14: '叉号',
  andriod_icons_15: '购物车',
  andriod_icons_16: '时钟',
  andriod_icons_17: '文档',
  andriod_icons_18: '云',
  andriod_icons_19: '下载',
  andriod_icons_20: '退出登录',
  andriod_icons_21: '脸书',
  andriod_icons_22: 'RSS 订阅',
  andriod_icons_23: '旗帜',
  andriod_icons_24: '文件夹',
  andriod_icons_25: '打开文件夹',
  andriod_icons_26: '字号（Aa）',
  andriod_icons_27: '设置（齿轮）',
  andriod_icons_28: '批量完成',
  andriod_icons_29: '下划线',
  andriod_icons_30: '斜体',
  andriod_icons_31: '粗体',
  andriod_icons_32: '撤销',
  andriod_icons_33: '重做',
  andriod_icons_34: '禁止',
  andriod_icons_35: '帮助',
  andriod_icons_36: '首页',
  andriod_icons_37: '电源',
  andriod_icons_38: '好评',
  andriod_icons_39: '趋势',
  andriod_icons_40: '链接',
  andriod_icons_41: '左对齐',
  andriod_icons_42: '地图标记',
  andriod_icons_43: '靶心',
  andriod_icons_44: '锁定',
  andriod_icons_45: '解锁',
  andriod_icons_46: '邮件',
  andriod_icons_47: '麦克风',
  andriod_icons_48: '评论',
  andriod_icons_49: '胶片',
  andriod_icons_50: '音乐',
  andriod_icons_51: '电话',
  andriod_icons_52: '快进',
  andriod_icons_53: '下一曲',
  andriod_icons_54: '暂停',
  andriod_icons_55: '播放',
  andriod_icons_56: '快退',
  andriod_icons_57: '循环播放',
  andriod_icons_58: '上一曲',
  andriod_icons_59: '停止',
  andriod_icons_60: '保存',
  andriod_icons_61: '搜索',
  andriod_icons_62: '分享',
  andriod_icons_63: '字母排序',
  andriod_icons_64: '收藏（描边）',
  andriod_icons_65: '收藏',
  andriod_icons_66: '编辑',
  andriod_icons_67: '对勾',
  andriod_icons_68: '九宫格',
  andriod_icons_69: '四宫格',
  andriod_icons_70: 'T 恤',
  andriod_icons_71: '刷新',
  andriod_icons_72: '撤回',
  andriod_icons_73: '用户',
  andriod_icons_74: '用户组',
  andriod_icons_75: '摄像机',
  andriod_icons_76: '音量',
  andriod_icons_77: '无线网络',
  andriod_icons_78: '复选框（选中）',
  andriod_icons_79: '方框',
  andriod_icons_80: '圆框',
  andriod_icons_81: '单选（选中）',
  andriodSearch: '搜索栏',
  andriodDialog: '对话框与确认',
  andriodConfirm: '确认对话框',
}

/**
 * 移动端原型（iOS / Android 线框素材）。
 * from = 旧 Schema 分类名；category 统一为 mobile，平台/形态作面板二级分组。
 * proportionalDefault：旧素材把键盘按键、状态栏图标等写成绝对像素，统一比例化后
 * 缩放图形细节跟随，缩略图自适应也不会把墨迹挤出画布。
 */
const MOBILE_TARGETS = [
  'ios_controls:mobile_ios_control:iOS 控件',
  'ios_elements:mobile_ios_element:iOS 元素',
  'ios_devices:mobile_ios_device:iOS 设备背景',
  'andriod_controls:mobile_and_control:Android 控件',
  'andriod_elements:mobile_and_element:Android 元素',
  'andriod_devices:mobile_and_device:Android 设备背景',
  // 状态/操作图标：整分类都是「rectangle + PNG 图片填充」，靠 mobile-*-glyphs.mjs 重画为矢量
  'ios_icons:mobile_ios_icon:iOS 图标:icon',
  'andriod_icons:mobile_and_icon:Android 图标:icon:29',
].map((spec) => {
  const [from, group, groupName, icon, iconDefault] = spec.split(':')
  return {
    file: `${from}.js`,
    out: from.replace(/_(\w)/g, (_, c) => c.toUpperCase()),
    category: 'mobile',
    from,
    group: [group, groupName],
    proportionalDefault: true,
    // 图标本就是 16~30px 的小图形，不再参与整族的尺寸收敛
    iconScale: !!icon,
    // Android 图标旧素材是 40×40 透明框里摆 29×29 的字形：默认尺寸按字形本体给，
    // 免得拖到画布上比 iOS 图标大一圈
    iconDefault: iconDefault ? Number(iconDefault) : null,
  }
})

const TARGETS = [
  { file: 'bpmn.js', out: 'bpmn', category: 'bpmn', groups: BPMN_GROUPS, fallbackGroup: ['bpmn_misc', '其他'] },
  { file: 'er.js', out: 'er', category: 'er' },
  { file: 'epc.js', out: 'epc', category: 'epc' },
  { file: 'evc.js', out: 'evc', category: 'evc' },
  { file: 'venn.js', out: 'venn', category: 'venn' },
  { file: 'org.js', out: 'org', category: 'org' },
  { file: 'weizhu_bm.js', out: 'weizhuBm', category: 'weizhu_bm' },
  // 移动端原型：旧素材按平台散在 6 个分类里，这里并入单一面板分类，平台/形态作二级分组
  ...MOBILE_TARGETS,
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
/**
 * 旧素材为了 1px 对齐把分隔线写成 'Math.round(h-40) + 0.5'：取整与半像素在图形被
 * 缩放（含面板缩略图自适应）后会算出越界坐标，这里剥掉，只留纯表达式。
 */
const CRISP = /^\s*Math\.round\(\s*([^()]*?)\s*\)\s*(?:[+-]\s*0\.5\s*)?$/
/** Dimension：纯数字归一为 number，表达式字符串原样保留 */
function dim(v) {
  if (typeof v !== 'string') return v
  const crisp = CRISP.exec(v)
  if (crisp) v = crisp[1]
  return NUMERIC.test(v.trim()) ? Number(v.trim()) : v
}

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
          // 拷贝：原语被多个图形共享，后续比例化/改写不能污染其它图形
          subPaths.push((Array.isArray(sp) ? sp : sp.actions).map((a) => ({ ...a })))
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

function convertPath(legacyPath, refs, commands, dropImage = false) {
  const out = []
  for (const seg of legacyPath ?? []) {
    // 位图子路径（旧素材的图标细节）：整体丢弃，由手绘矢量补丁补回
    if (dropImage && !Array.isArray(seg) && seg.fillStyle?.type === 'image') continue
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

/** 子路径样式补丁：裸数组要包成 {actions} 才能挂样式（移动端「白底隐形」问题见 mobile-styles.mjs） */
function styleSeg(shape, idx, patch) {
  const raw = shape.path[idx]
  if (!raw) return
  const seg = Array.isArray(raw) ? { actions: raw } : { ...raw }
  if (patch.line) Object.assign((seg.lineStyle ??= {}), patch.line)
  if (patch.fill) {
    const prev = seg.fillStyle
    seg.fillStyle = prev?.type === 'none' ? { type: 'none' } : { type: 'solid', color: patch.fill }
  }
  shape.path[idx] = seg
}

function applyMobileStyle(shape, st) {
  if (st.fill != null) shape.fillStyle = st.fill === 'none' ? { type: 'none' } : { type: 'solid', color: st.fill }
  if (st.line) shape.lineStyle = { ...(shape.lineStyle ?? {}), ...st.line }
  // 旧素材给整图形挂的透明度（如 stepper 为贴截图设的 alpha:0.1）在白画布上等于隐形
  if (st.alpha != null) shape.shapeStyle = { ...(shape.shapeStyle ?? {}), alpha: st.alpha }
  if (st.body) {
    if (st.body === 'inherit') {
      const raw = shape.path[0]
      if (raw && !Array.isArray(raw) && raw.lineStyle) delete raw.lineStyle.lineWidth
    } else styleSeg(shape, 0, { line: st.body })
  }
  for (const [i, p] of Object.entries(st.subs ?? {})) styleSeg(shape, Number(i), p)
  if (st.font) shape.fontStyle = { ...(shape.fontStyle ?? {}), ...st.font }
  if (st.text) for (const b of shape.textBlock ?? []) if (st.text[b.text]) b.text = st.text[b.text]
  // 旧素材无文字的图形（如深灰气泡）补占位文案；已有的不动
  if (st.label != null && !shape.textBlock?.length) {
    shape.textBlock = [{ position: { x: 10, y: 0, w: 'w-20', h: 'h' }, text: st.label }]
  }
}

/**
 * 主体圆角重画：按钮这类 path[0] 是 9 命令圆角矩形的图形，旧素材圆角量按真机截图
 * 量出来普遍过小（150×32 的按钮只有 3px，视觉上就是矩形），按像素半径重建。
 * 半径用像素不随缩放比例变化，用户拉伸按钮时圆角形态稳定。
 */
function applyRadius(shape, r) {
  const w = Number(shape.props?.w)
  const h = Number(shape.props?.h)
  const seg = shape.path?.[0]
  if (!Number.isFinite(w) || !Number.isFinite(h) || !seg) return
  const rad = Math.min(r, w / 2, h / 2)
  const actions = [
    { action: 'move', x: rad, y: 0 },
    { action: 'line', x: `w-${rad}`, y: 0 },
    { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: rad },
    { action: 'line', x: 'w', y: `h-${rad}` },
    { action: 'quadraticCurve', x1: 'w', y1: 'h', x: `w-${rad}`, y: 'h' },
    { action: 'line', x: rad, y: 'h' },
    { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: `h-${rad}` },
    { action: 'line', x: 0, y: rad },
    { action: 'quadraticCurve', x1: 0, y1: 0, x: rad, y: 0 },
    { action: 'close' },
  ]
  // path[0] 可能是裸数组（继承图形级样式）也可能挂着子路径样式，保持原形态
  if (Array.isArray(seg)) shape.path[0] = actions
  else seg.actions = actions
}

/**
 * 移动端默认尺寸收敛。旧素材按真机截图的像素量给定（按钮 240×40，通栏元素 280/360 宽），
 * 拖到画布上比常规矩形还大；整族等比缩到 k，独立控件另有 size 档（见 mobile-styles.mjs）。
 * 几何已是 w/h 比例式，只需改 props；文字不会自适应缩小，同比例压字号，下限 10px。
 */
const LEGACY_DEFAULT_FONT = 13 // 与 types/index.ts 的 DEFAULT_FONT_SIZE 一致
function applyMobileSize(shape, explicit) {
  const w = Number(shape.props?.w)
  const h = Number(shape.props?.h)
  if (!Number.isFinite(w) || !Number.isFinite(h)) return
  const [nw, nh] = explicit ?? [Math.round(w * MOBILE_SCALE), Math.round(h * MOBILE_SCALE)]
  // 以高度方向为准：框子矮了文字就挤，宽度一般还留有富余
  const scale = Math.min(1, Math.max(0.6, nh / h))
  const shrink = (size) => Math.max(10, Math.round(size * scale))
  shape.props.w = nw
  shape.props.h = nh
  if (shape.fontStyle?.size || (shape.textBlock ?? []).some((b) => b.text)) {
    shape.fontStyle = { ...(shape.fontStyle ?? {}), size: shrink(shape.fontStyle?.size ?? LEGACY_DEFAULT_FONT) }
  }
  for (const b of shape.textBlock ?? []) {
    if (b.fontStyle?.size) b.fontStyle = { ...b.fontStyle, size: shrink(b.fontStyle.size) }
  }
}

function convertShape(s, cfg, refs, commands) {
  const glyph = MOBILE_GLYPHS[s.name] ?? IOS_ICON_GLYPHS[s.name] ?? ANDROID_ICON_GLYPHS[s.name]
  const shape = {
    name: s.name,
    title: TITLE_CN[s.name] || s.title || s.name,
    category: cfg.category,
  }
  if (cfg.groups) {
    const g = cfg.groups[s.groupName] ?? cfg.fallbackGroup
    if (g) Object.assign(shape, { group: g[0], groupName: g[1] })
  } else if (cfg.group) {
    Object.assign(shape, { group: cfg.group[0], groupName: cfg.group[1] })
  }
  const props = { w: dim(s.props?.w), h: dim(s.props?.h) }
  if (props.w != null || props.h != null) {
    shape.props = {}
    if (props.w != null) shape.props.w = props.w
    if (props.h != null) shape.props.h = props.h
  }
  if (JSON.stringify(s.path).includes('"image"') && !glyph) return { skip: '依赖位图填充' }
  const path = convertPath(s.path, refs, commands, !!glyph)
  // 旧路径本身就是坏矢量（如菜单图标依赖 lineWidth 表达式，本项目求值为 0）时整条替换
  if (glyph?.replace) path.length = 0
  // 位图细节整块替换的图形（iOS 开关等）：原路径可能一条矢量都不剩，几何全部来自补丁
  if (glyph) path.push(...glyph.subPaths(props.w ?? 100, props.h ?? 100))
  if (!path.length) return { skip: '无可用路径' }
  shape.path = path
  if (s.anchors && JSON.stringify(s.anchors.map(dim2)) !== JSON.stringify(DEFAULT_ANCHORS)) {
    shape.anchors = s.anchors ?? []
  }
  const blocks = (glyph?.textBlocks ? glyph.textBlocks() : s.textBlock ?? []).map((b) => ({
    position: dimPos(b.position),
    text: b.text ?? '',
    ...(glyph?.textColor && { fontStyle: { ...(b.fontStyle ?? {}), color: glyph.textColor } }),
  }))
  const legacyDefaultBlock = { x: 10, y: 0, w: 'w-20', h: 'h' }
  if (
    glyph?.textBlocks ||
    (s.textBlock &&
      (blocks.length !== 1 ||
        JSON.stringify(blocks[0].position) !== JSON.stringify(legacyDefaultBlock) ||
        blocks[0].text !== ''))
  ) {
    shape.textBlock = blocks
  }
  const lineStyle = normalizeStyle(s.lineStyle)
  const { fill: normFill, alpha: normAlpha } = normalizeFill(s.fillStyle) ?? {}
  const fillStyle = glyph?.fill ?? normFill
  const alpha = glyph?.fill ? (glyph.alpha ?? null) : normAlpha
  const fontStyle = normalizeFont(s.fontStyle)
  if (lineStyle || glyph?.line) shape.lineStyle = { ...(lineStyle ?? {}), ...(glyph?.line ?? {}) }
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
  const style = cfg.category === 'mobile' ? MOBILE_STYLES[s.name] : null
  if (style) applyMobileStyle(shape, style)
  const patchDims =
    PROPORTIONAL_PATCH[s.name] ??
    (cfg.proportionalDefault && Number.isFinite(props.w) && Number.isFinite(props.h) ? props : null)
  if (patchDims) applyProportional(shape, patchDims)
  // 几何按旧框子（40）比例化完毕，默认尺寸改按字形本体（29）给
  if (cfg.iconDefault && shape.props) {
    shape.props.w = cfg.iconDefault
    shape.props.h = cfg.iconDefault
  }
  if (cfg.category === 'mobile' && !cfg.iconScale) applyMobileSize(shape, style?.size)
  // 圆角重画放在尺寸收敛之后：半径是按新默认尺寸定的像素值
  if (style?.radius != null) applyRadius(shape, style.radius)
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
  for (const s of legacy.filter((x) => x.category === (cfg.from ?? cfg.category))) {
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
    // 一个都没转出来（整分类依赖位图）就别留空文件污染 index
    if (!items.length) {
      fs.rmSync(path.join(OUT_DIR, `${cfg.out}.ts`), { force: true })
      continue
    }
    const body = items.map((s) => `/** ${s.title}（${s.props?.w ?? '?'}×${s.props?.h ?? '?'}） */\n${ts(s)}`).join(',\n')
    const file = `// ═══════════════════════════════════════════
// 旧系统 ${cfg.file} 中尚未移植的 ${items.length} 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category ${cfg.out}（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
${cfg.iconScale ? `// 旧素材整分类都是「rectangle + PNG 图片填充」，字形由 scripts/lib/${cfg.from === 'andriod_icons' ? 'android' : 'mobile'}-icon-glyphs.mjs 重画为原生矢量\n` : cfg.from ? '// 位图细节（勾选/开关滑块/放大镜/电池/键盘按键）改由 scripts/lib/mobile-glyphs.mjs 重画为矢量，坐标已比例化\n// 旧素材「白底 + lineWidth:0」在白画布上等于隐形，表面描边/配色由 scripts/lib/mobile-styles.mjs 补齐\n' : ''}// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const ${cfg.out}LegacyShapes: ShapeDefinition[] = [
${body.split('\n').map((l) => (l ? `  ${l}` : l)).join('\n')}
]
`
    fs.writeFileSync(path.join(OUT_DIR, `${cfg.out}.ts`), file)
  }
  const nonEmpty = generated.filter((g) => g.items.length)
  const imports = nonEmpty.map((g) => `import { ${g.cfg.out}LegacyShapes } from './${g.cfg.out}'`).join('\n')
  fs.writeFileSync(
    path.join(OUT_DIR, 'index.ts'),
    `// 自动生成: node scripts/gen-legacy-shapes.mjs（勿手改）
import type { ShapeDefinition } from '@/types'
${imports}

/** 旧 Schema 分类移植过来的图形，由 shapes/index.ts 统一注册 */
export const legacyShapes: ShapeDefinition[] = [
${nonEmpty.map((g) => `  ...${g.cfg.out}LegacyShapes,`).join('\n')}
]
`,
  )
}

const total = generated.reduce((n, g) => n + g.items.length, 0)
console.log(`${dryRun ? '[dry-run] ' : ''}生成 ${total} 个图形：`)
for (const r of report) {
  console.log(
    `  ${r.out.padEnd(12)} ${String(r.count).padStart(3)} 个${
      r.skipped.length ? `  跳过 ${r.skipped.length}: ${r.skipped.slice(0, 6).join('; ')}${r.skipped.length > 6 ? ' …' : ''}` : ''
    }`,
  )
}
if (!dryRun) console.log(`\n输出目录: ${path.relative(ROOT, OUT_DIR)}/`)
