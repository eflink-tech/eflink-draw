import type { ShapeDefinition } from '@/types'

// - text：category basic，默认文案「文本」，linkable:false，无锚点
// - freetext：category free，T 工具点击创建，不进面板
// 面板图标在 shapeThumb 中用衬线体 fillText 绘制（见 drawShapeThumb）

/** 基础面板文本（旧 text：160×40，无描边无填充，仅文字） */
const text: ShapeDefinition = {
  name: 'text',
  title: '文本',
  category: 'basic',
  attribute: { linkable: false },
  props: { w: 160, h: 40 },
  anchors: [],
  fillStyle: { type: 'none' },
  lineStyle: { lineWidth: 0 },
  textBlock: [{ position: { x: 0, y: 0, w: 'w', h: 'h' }, text: '文本' }],
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'close' },
  ]],
}

/** 自由文本（T 工具点击画布创建）：
// - 无填充（fillStyle.type='none'）、无描边（lineWidth 0），仅渲染文字
// - 左对齐、垂直居中；textBlock 占满整个矩形
// - 矩形 path 供命中检测；默认四边锚点保留（支持连线吸附）
// - 独立分类 'free'，不进左侧图形面板（SHAPE_CATEGORIES 不含 free）

/** 自由文本（初始尺寸 100×40，文本随输入可溢出，后续可做自适应） */
const freetext: ShapeDefinition = {
  name: 'freetext',
  title: '文本',
  category: 'free',
  props: { w: 100, h: 40 },
  fillStyle: { type: 'none' },
  lineStyle: { lineWidth: 0 },
  fontStyle: { textAlign: 'left', vAlign: 'middle' },
  textBlock: [{ position: { x: 0, y: 0, w: 'w', h: 'h' }, text: '' }],
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'close' },
  ]],
}

/** 文本类图形列表 */
export const textShapes: ShapeDefinition[] = [text, freetext]
