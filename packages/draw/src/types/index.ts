// ═══════════════════════════════════════════
// 基础类型
// ═══════════════════════════════════════════

/** RGB 颜色字符串，如 "255,255,255" */
export type RGBColor = string

/** 坐标/尺寸值：数字或表达式字符串（如 "w/2", "h*0.5"） */
export type Dimension = number | string

/** 路径动作 */
export type PathAction =
  | { action: 'move'; x: Dimension; y: Dimension }
  | { action: 'line'; x: Dimension; y: Dimension }
  | {
      action: 'curve'
      x1: Dimension; y1: Dimension
      x2: Dimension; y2: Dimension
      x: Dimension; y: Dimension
    }
  | {
      action: 'quadraticCurve'
      x1: Dimension; y1: Dimension
      x: Dimension; y: Dimension
    }
  | { action: 'close' }

/** 带独立样式的子路径（对齐旧系统 path[i].lineStyle / fillStyle） */
export interface StyledPathSegment {
  actions: PathAction[]
  lineStyle?: Partial<LineStyle>
  fillStyle?: Partial<FillStyle>
}

/** 一条路径 = 纯动作数组，或带样式的对象 */
export type PathDefinition = PathAction[] | StyledPathSegment

// ═══════════════════════════════════════════
// 样式类型
// ═══════════════════════════════════════════

export interface FillStyle {
  type: 'solid' | 'gradient' | 'none'
  color?: RGBColor
  gradientType?: 'linear' | 'radial'
  beginColor?: RGBColor
  endColor?: RGBColor
  angle?: number
}

export interface LineStyle {
  lineWidth?: number
  lineColor?: RGBColor
  lineStyle?: 'solid' | 'dashed' | 'dot' | 'dotdash'
}

export type ArrowStyle =
  | 'none'
  | 'solidArrow'
  | 'dashedArrow'
  | 'normal'
  | 'solidDiamond'
  | 'dashedDiamond'
  | 'solidCircle'
  | 'dashedCircle'
  | 'cross'

export interface FontStyle {
  fontFamily?: string
  size?: number
  color?: RGBColor
  bold?: boolean
  italic?: boolean
  underline?: boolean
  textAlign?: 'left' | 'center' | 'right'
  vAlign?: 'top' | 'middle' | 'bottom'
  orientation?: 'horizontal' | 'vertical'
}

/** 默认字号（图形/连线共用；实例化时恒填充，兜底用于外部注入的缺字段文档） */
export const DEFAULT_FONT_SIZE = 13
export const DEFAULT_LINE_WIDTH = 1.5
export const TEXT_LINE_HEIGHT = 1.25

// ═══════════════════════════════════════════
// 图形结构类型
// ═══════════════════════════════════════════

export interface TextBlock {
  position: { x: Dimension; y: Dimension; w: Dimension; h: Dimension }
  text: string
  fontStyle?: Partial<FontStyle>
}

export interface Anchor {
  x: Dimension
  y: Dimension
}

export interface DataAttribute {
  name: string
  type: 'number' | 'string' | 'link' | 'boolean'
  value: string | number | boolean
  category: string
  id?: string
}

export interface ShapeAttribute {
  container?: boolean
  visible?: boolean
  rotatable?: boolean
  linkable?: boolean
  collapsable?: boolean
  collapsed?: boolean
  markerOffset?: number
}

// ═══════════════════════════════════════════
// Schema 图形定义
// ═══════════════════════════════════════════

// 四角为缩放手柄方向；'t'/'r'/'b'/'l' 为四边中点（个别图形如泳道声明使用，
// 当前渲染器仅渲染四角手柄，边中点数据保留供后续扩展）
export type ResizeDirection = 'tl' | 'tr' | 'br' | 'bl' | 't' | 'r' | 'b' | 'l'

export interface ShapeDefinition {
  name: string
  title: string
  category: string
  group?: string
  groupName?: string | null
  attribute?: ShapeAttribute
  resizeDir?: ResizeDirection[]
  props?: { w?: number; h?: number }
  anchors?: Anchor[]
  textBlock?: TextBlock[]
  path: PathDefinition[]
  drawIcon?: (w: number, h: number) => PathDefinition[]
  lineStyle?: LineStyle
  fillStyle?: FillStyle
  fontStyle?: FontStyle
  shapeStyle?: {
    alpha?: number
    /** 阴影开关（false 时即使有 shadow* 字段也不渲染） */
    shadowEnabled?: boolean
    shadowColor?: RGBColor
    shadowBlur?: number
    shadowOffsetX?: number
    shadowOffsetY?: number
  }
  dataAttributes?: DataAttribute[]
}

// ═══════════════════════════════════════════
// 运行时元素实例
// ═══════════════════════════════════════════

export interface ElementInstance {
  id: string
  name: string
  title: string
  category: string
  group: string
  groupName: string | null
  locked: boolean
  link: string
  children: string[]
  parent: string
  /**
   * 组合标识（⌘G/⇧⌘G）。同 groupId 的图形在"选择"时展开为整组。
   */
  groupId?: string
  resizeDir: ResizeDirection[]
  attribute: ShapeAttribute
  dataAttributes: DataAttribute[]
  props: {
    x: number
    y: number
    w: number
    h: number
    zindex: number
    angle: number  // 弧度
  }
  shapeStyle: {
    alpha: number
    /** 阴影开关（false 时即使有 shadow* 字段也不渲染） */
    shadowEnabled?: boolean
    shadowColor?: RGBColor
    shadowBlur?: number
    shadowOffsetX?: number
    shadowOffsetY?: number
  }
  lineStyle: LineStyle
  fillStyle: FillStyle
  path: PathDefinition[]
  fontStyle: FontStyle
  textBlock: TextBlock[]
  anchors: Anchor[]
}

export interface LinkerInstance {
  id: string
  name: 'linker'
  /** id 为 null 表示自由端点（未吸附到图形锚点） */
  from: { id: string | null; x: number; y: number; angle: number }
  to: { id: string | null; x: number; y: number; angle: number }
  text: string
  fontStyle?: FontStyle
  linkerType: 'curve' | 'broken' | 'line'
  lineStyle: LineStyle & {
    beginArrowStyle?: ArrowStyle
    endArrowStyle?: ArrowStyle
  }
  points: Array<{ x: number; y: number }>
  /** 手动路由：线身被段拖拽调整过；图形移动时仅拉伸端段，不全量重算 */
  manualRoute?: boolean
  locked: boolean
  dataAttributes: DataAttribute[]
  group: string
  props: { zindex: number }
}

/** 连线草稿（锚点拖拽创建连线期间的临时数据） */
export type LinkerDraft = Pick<
  LinkerInstance,
  'from' | 'to' | 'linkerType' | 'lineStyle' | 'points'
>

// ═══════════════════════════════════════════
// 文档结构
// ═══════════════════════════════════════════

export interface PageConfig {
  showGrid: boolean
  gridSize: number
  orientation: 'portrait' | 'landscape'
  height: number
  width: number
  backgroundColor: RGBColor | 'transparent'
  padding: number
  title?: string
}

export interface DocumentData {
  page: PageConfig
  elements: Record<string, ElementInstance | LinkerInstance>
}

// ═══════════════════════════════════════════
// 工具类型
// ═══════════════════════════════════════════

/** 判断元素是否为连线 */
export function isLinker(el: ElementInstance | LinkerInstance): el is LinkerInstance {
  return el.name === 'linker'
}

/** 纯文本图形（无填充/描边，属性面板仅文本与度量） */
export function isTextOnlyShape(el: ElementInstance): boolean {
  return el.name === 'text' || el.name === 'freetext'
}

/** RGB 字符串转 CSS rgb() */
export function rgbToCSS(rgb: RGBColor): string {
  return `rgb(${rgb})`
}

/** 创建默认的 PageConfig */
export function createDefaultPageConfig(overrides?: Partial<PageConfig>): PageConfig {
  return {
    showGrid: true,
    gridSize: 10,
    orientation: 'landscape',
    height: 1200,
    width: 1600,
    backgroundColor: '255,255,255',
    padding: 0,
    title: '未命名图表',
    ...overrides,
  }
}

/** 创建空的 DocumentData */
export function createEmptyDocument(name?: string): DocumentData {
  return {
    page: createDefaultPageConfig({ title: name }),
    elements: {},
  }
}
