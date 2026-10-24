import type { ArrowStyle, RGBColor } from '@/types'

/** 模板分类 */
export type TemplateCategoryId =
  | 'basic'
  | 'crossFunctional'
  | 'uml'
  | 'business'
  | 'system'
  | 'lean'

export interface TemplateCategory {
  id: TemplateCategoryId
  label: string
}

/** 连线锚点方位（解析为该方位最近的图形锚点） */
export type AnchorSide = 'top' | 'right' | 'bottom' | 'left'

/**
 * 模板节点：以形状注册名为准创建原生实例，位置尺寸/文本/样式按需覆盖。
 * id 为模板内局部引用名（连线 from/to 使用），生成文档时替换为真实元素 ID。
 */
export interface TemplateNodeSpec {
  id: string
  shape: string
  /** 主文本（textBlock[0]） */
  text?: string
  /** 按索引覆盖各文本块（textBlock[i]），如泳道标题 + 泳道头、UML 状态名 + entry/exit */
  texts?: string[]
  x: number
  y: number
  w?: number
  h?: number
  fill?: RGBColor
  textColor?: RGBColor
  fontSize?: number
  bold?: boolean
  /** 模板内层级（缺省按声明顺序；容器类节点应声明在内容节点之前） */
  z?: number
  /** 泳道族：泳道数（触发 path/textBlock 重建） */
  laneCount?: number
  laneColors?: (RGBColor | undefined)[]
  laneHeadColors?: (RGBColor | undefined)[]
  titleColor?: RGBColor
}

/** UML 时序消息参数（附着激活条/生命线；y 为消息世界高度） */
export interface TemplateSeqSpec {
  y: number
  fromDir: 1 | -1 | 0
  toDir: 1 | -1 | 0
}

export interface TemplateLinkSpec {
  from: string
  to: string
  fromSide?: AnchorSide
  toSide?: AnchorSide
  text?: string
  dashed?: boolean
  beginArrow?: ArrowStyle
  endArrow?: ArrowStyle
  /** 缺省 broken（正交折线） */
  type?: 'broken' | 'line' | 'curve'
  /** 时序消息（from === to 时为自消息回环） */
  seq?: TemplateSeqSpec
  /** 文字沿线定位（t = 弧长参数，normal = 法向偏移，正值沿切向 (dy,-dx) 方向） */
  textOffset?: { t: number; normal: number }
}

export interface TemplateSpec {
  id: string
  title: string
  category: TemplateCategoryId
  /** 卡片副标题/预览说明 */
  description: string
  /** 检索关键词 */
  keywords: string[]
  page: { width: number; height: number }
  nodes: TemplateNodeSpec[]
  links: TemplateLinkSpec[]
}