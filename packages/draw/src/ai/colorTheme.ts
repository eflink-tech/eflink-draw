// src/ai/colorTheme.ts
// AI 语义配色主题：浅色填充 + 深色描边（draw.io 经典色板）。
// 规则：仅当 schema 未自带 fillStyle（createElement 走了兜底白色）时才应用主题，
// 因此 annotation/泳道/文本类（fillStyle:none）与 umlStart/devNode（自带实色）自动豁免；
// AI 显式输出的 style 经白名单清洗后优先级最高。
import { hexToRgb } from '@/core/utils/color'
import type { ElementInstance, ShapeDefinition } from '@/types'

export interface ThemeColors {
  /** 填充色 "r,g,b" */
  fill: string
  /** 描边色 "r,g,b" */
  line: string
}

/** AI add_element 的可选样式覆盖（types.ts 的 AddElementAction.style 经清洗后的形态） */
export interface ElementStyleOverride {
  fill?: string
  lineColor?: string
}

/** hex → 内部 "r,g,b"（模块加载时一次性转换，非法值属编码错误，开发期即暴露） */
function hx(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) throw new Error(`colorTheme: 非法 hex ${hex}`)
  return rgb
}

// 六组 draw.io 经典色对（浅填充 / 深描边）
const GREEN: ThemeColors = { fill: hx('#D5E8D4'), line: hx('#82B366') } // 起止/开始
const RED: ThemeColors = { fill: hx('#F8CECC'), line: hx('#B85450') } // 结束
const YELLOW: ThemeColors = { fill: hx('#FFF2CC'), line: hx('#D6B656') } // 判定/网关
const BLUE: ThemeColors = { fill: hx('#DAE8FC'), line: hx('#6C8EBF') } // 流程/任务/类别兜底
const PURPLE: ThemeColors = { fill: hx('#E1D5E7'), line: hx('#9673A6') } // 数据存储类
const ORANGE: ThemeColors = { fill: hx('#FFE6CC'), line: hx('#D79B00') } // 文档/IO/中间事件

/** name 精确映射（最高优先级；schema name 全局唯一，见 registry） */
const NAME_THEME: Record<string, ThemeColors> = {
  // flow —— 起止
  terminator: GREEN,
  // flow —— 判定
  decision: YELLOW,
  // flow —— 流程/引用/控制
  process: BLUE,
  predefinedProcess: BLUE,
  onPageReference: BLUE,
  offPageReference: BLUE,
  internalStorage: BLUE,
  preparation: BLUE,
  loopLimit: BLUE,
  manualOperation: BLUE,
  // flow —— 数据类
  data: PURPLE,
  storedData: PURPLE,
  directData: PURPLE,
  sequentialData: PURPLE,
  // flow —— 文档/IO 介质类
  document: ORANGE,
  paperTape: ORANGE,
  display: ORANGE,
  manualInput: ORANGE,
  card: ORANGE,
  // bpmn
  startEvent: GREEN,
  endEvent: RED,
  bpmnGateway: YELLOW,
  task: BLUE,
  callActivity: BLUE,
  subProcess: BLUE,
  message: BLUE,
  conversation: BLUE,
  intermediateEvent: ORANGE,
  boundaryEvent: ORANGE,
  dataObject: PURPLE,
  dataStore: PURPLE,
}

/**
 * 类别级兜底（name 未命中时）。
 * lane、free（文本）刻意缺席 → 返回 null 不上色；
 * 其余类别统一浅蓝，保守处理。
 */
const CATEGORY_THEME: Record<string, ThemeColors> = {
  flow: BLUE,
  bpmn: BLUE,
  basic: BLUE,
  uml_class: BLUE,
  uml_common: BLUE,
  uml_component: BLUE,
  uml_deployment: BLUE,
  uml_sequence: BLUE,
  uml_stateactivity: BLUE,
  uml_usecase: BLUE,
}

/** 纯函数：按 name 精确、category 兜底查语义色；无匹配返回 null */
export function themeForSchema(name: string, category: string): ThemeColors | null {
  return NAME_THEME[name] ?? CATEGORY_THEME[category] ?? null
}

/** "r,g,b" 三数校验（各分量 0-255 整数），通过则返回规范化（去空白）后的字符串 */
function parseRgbString(raw: string): string | null {
  const parts = raw.split(',').map((s) => s.trim())
  if (parts.length !== 3) return null
  const nums = parts.map((p) => Number(p))
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null
  return nums.join(',')
}

/** 清洗 AI 覆盖颜色：接受 "#rrggbb"/"rrggbb"（hexToRgb）或合法 "r,g,b"；否则 null */
export function sanitizeColor(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const s = raw.trim()
  if (!s) return null
  return hexToRgb(s) ?? parseRgbString(s)
}

/** 清洗整个 style 对象：仅取 fill/lineColor 两键，值非法则丢弃该键；全非法返回 undefined */
export function sanitizeStyleOverride(raw: unknown): ElementStyleOverride | undefined {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return undefined
  const obj = raw as Record<string, unknown>
  const out: ElementStyleOverride = {}
  const fill = sanitizeColor(obj.fill)
  if (fill) out.fill = fill
  const lineColor = sanitizeColor(obj.lineColor)
  if (lineColor) out.lineColor = lineColor
  return Object.keys(out).length > 0 ? out : undefined
}

/**
 * 就地应用语义主题与 AI 覆盖。
 * 优先级：AI 显式 style > schema 自带样式 > 语义主题 > registry 兜底白。
 * @param schemaDef registry.getShape(name) 结果；undefined（schema 无记录）按"无自带样式"处理，允许主题
 */
export function applyThemeToElement(
  element: ElementInstance,
  schemaDef: ShapeDefinition | undefined,
  override?: ElementStyleOverride,
): void {
  // schema 定义了 fillStyle（含 none 与自带实色）→ 语义上已定，主题整体跳过
  const schemaOwnsFill = schemaDef?.fillStyle != null
  const theme = schemaOwnsFill ? null : themeForSchema(element.name, element.category)

  const fill = override?.fill ?? theme?.fill
  const line = override?.lineColor ?? theme?.line

  if (fill) element.fillStyle = { type: 'solid', color: fill }
  // schema 自带 lineColor（如刻意深色描边）时主题不越权改描边；AI 显式覆盖则无条件生效
  if (line && (override?.lineColor || schemaDef?.lineStyle?.lineColor == null)) {
    element.lineStyle = { ...element.lineStyle, lineColor: line }
  }
  // fontStyle 不动：浅色系填充下默认深灰文字（50,50,50）即可读，渲染层文字色独立于填充
}
