import type { ShapeDefinition } from '@/types'

// 尺寸、锚点、textBlock、路径均取自旧版编辑器实现。
// 样式（边线 2px / 50,50,50、填充白、微软雅黑 13 号）由 registry 默认值兜底。

// ═══════════════════════════════════════════
// UML 通用（4 个）
// ═══════════════════════════════════════════

// 面板图标说明：drawIcon 取自旧版编辑器实现，
// 使用缩略图宽高 a,b 的比例坐标，避免 path 中 w-16、w*0.7+3 等绝对像素
// 表达式在 30×30 缩略图里比例失调。

/** 包（旧：210×150） */
const pkg: ShapeDefinition = {
  name: 'package',
  title: '包',
  category: 'uml_common',
  attribute: { container: true },
  props: { w: 210, h: 150 },
  fontStyle: { bold: true, textAlign: 'left' },
  textBlock: [
    { position: { x: 10, y: 0, w: 'w*0.7-10', h: 25 }, text: '包' },
    { position: { x: 10, y: 30, w: 'w-20', h: 'h-35' }, text: '属性', fontStyle: { bold: false } },
  ],
  drawIcon: (a, b) => [
    // 主体外轮廓（带顶部标签的折叠形状）
    [
      { action: 'move', x: 0, y: 2 },
      { action: 'quadraticCurve', x1: 0, y1: 0, x: 2, y: 0 },
      { action: 'line', x: a * 0.7 - 1.5, y: 0 },
      { action: 'quadraticCurve', x1: a * 0.7, y1: 0, x: a * 0.7 + 1, y: 1.5 },
      { action: 'line', x: a * 0.76, y: b * 0.22 },
      { action: 'line', x: a - 2, y: b * 0.22 },
      { action: 'quadraticCurve', x1: a, y1: b * 0.22, x: a, y: b * 0.22 + 2 },
      { action: 'line', x: a, y: b - 2 },
      { action: 'quadraticCurve', x1: a, y1: b, x: a - 2, y: b },
      { action: 'line', x: 2, y: b },
      { action: 'quadraticCurve', x1: 0, y1: b, x: 0, y: b - 2 },
      { action: 'close' },
    ],
    // 标签底部分隔线
    [
      { action: 'move', x: 0, y: b * 0.22 },
      { action: 'line', x: a - 2, y: b * 0.22 },
    ],
  ],
  path: [
    // 主体：带圆角矩形
    [
      { action: 'move', x: 0, y: 25 },
      { action: 'line', x: 'w-4', y: 25 },
      { action: 'quadraticCurve', x1: 'w', y1: 25, x: 'w', y: 29 },
      { action: 'line', x: 'w', y: 'h-4' },
      { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
      { action: 'line', x: 4, y: 'h' },
      { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
      { action: 'close' },
    ],
    // 顶部标签
    [
      { action: 'move', x: 0, y: 4 },
      { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
      { action: 'line', x: 'w*0.7-4', y: 0 },
      { action: 'quadraticCurve', x1: 'w*0.7', y1: 0, x: 'w*0.7+3', y: 3 },
      { action: 'line', x: 'w*0.76', y: 25 },
      { action: 'line', x: 0, y: 25 },
      { action: 'close' },
    ],
  ],
}

/** 组合片段（旧：400×280） */
const combinedFragment: ShapeDefinition = {
  name: 'combinedFragment',
  title: '组合片断',
  category: 'uml_common',
  attribute: { container: true },
  props: { w: 400, h: 280 },
  fontStyle: { textAlign: 'left', vAlign: 'top' },
  textBlock: [
    { position: { x: 10, y: 30, w: 'w-20', h: 'h-35' }, text: '[Condition]' },
    { position: { x: 10, y: 0, w: 'w*0.3-10', h: 25 }, text: 'Opt | Alt | Loop ', fontStyle: { vAlign: 'middle' } },
  ],
  drawIcon: (a, b) => [
    // 圆角矩形外框
    [
      { action: 'move', x: 0, y: 2 },
      { action: 'quadraticCurve', x1: 0, y1: 0, x: 2, y: 0 },
      { action: 'line', x: a - 2, y: 0 },
      { action: 'quadraticCurve', x1: a, y1: 0, x: a, y: 2 },
      { action: 'line', x: a, y: b - 2 },
      { action: 'quadraticCurve', x1: a, y1: b, x: a - 2, y: b },
      { action: 'line', x: 2, y: b },
      { action: 'quadraticCurve', x1: 0, y1: b, x: 0, y: b - 2 },
      { action: 'line', x: 0, y: 2 },
      { action: 'close' },
    ],
    // 左上角操作符标签五边形
    [
      { action: 'move', x: 0, y: b * 0.22 },
      { action: 'line', x: a * 0.4, y: b * 0.22 },
      { action: 'line', x: a * 0.45, y: b * 0.16 },
      { action: 'line', x: a * 0.45, y: 0 },
    ],
  ],
  path: [
    // 圆角矩形外框
    [
      { action: 'move', x: 0, y: 4 },
      { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
      { action: 'line', x: 'w-4', y: 0 },
      { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
      { action: 'line', x: 'w', y: 'h-4' },
      { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
      { action: 'line', x: 4, y: 'h' },
      { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
      { action: 'close' },
    ],
    // 左上角操作符标签
    [
      { action: 'move', x: 0, y: 25 },
      { action: 'line', x: 'w*0.3', y: 25 },
      { action: 'line', x: 'w*0.3+8', y: 17 },
      { action: 'line', x: 'w*0.3+8', y: 0 },
    ],
  ],
}

/** 注释（旧：100×70，linkable:false） */
const umlNote: ShapeDefinition = {
  name: 'umlNote',
  title: '注释',
  category: 'uml_common',
  attribute: { linkable: false },
  props: { w: 100, h: 70 },
  anchors: [],
  textBlock: [{ position: { x: 10, y: 10, w: 'w-20', h: 'h-20' }, text: '' }],
  drawIcon: (a, b) => [
    // 折角矩形主体
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: a * 0.7, y: 0 },
      { action: 'line', x: a, y: b * 0.2 },
      { action: 'line', x: a, y: b },
      { action: 'line', x: 0, y: b },
      { action: 'line', x: 0, y: 0 },
      { action: 'close' },
    ],
    // 折角线
    [
      { action: 'move', x: a * 0.7, y: 0 },
      { action: 'line', x: a * 0.7, y: b * 0.2 },
      { action: 'line', x: a, y: b * 0.2 },
    ],
  ],
  path: [
    // 折角矩形
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 'w-16', y: 0 },
      { action: 'line', x: 'w', y: 16 },
      { action: 'line', x: 'w', y: 'h' },
      { action: 'line', x: 0, y: 'h' },
      { action: 'line', x: 0, y: 0 },
      { action: 'close' },
    ],
    // 折角线
    [
      { action: 'move', x: 'w-16', y: 0 },
      { action: 'line', x: 'w-16', y: 16 },
      { action: 'line', x: 'w', y: 16 },
    ],
  ],
}

/** 文本（旧：160×40，linkable:false） */
const umlText: ShapeDefinition = {
  name: 'umlText',
  title: '文本',
  category: 'uml_common',
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
  drawIcon: (w, h) => {
    // 衬线体 T 形（与 basic/text 一致）
    const a = 0
    const d = -6
    const c = h + 12
    return [[
      { action: 'move', x: a, y: d },
      { action: 'line', x: w, y: d },
      { action: 'line', x: w, y: d + c * 0.2 },
      { action: 'line', x: w * 0.9, y: d + c * 0.12 },
      { action: 'line', x: w * 0.55, y: d + c * 0.12 },
      { action: 'line', x: w * 0.55, y: d + c * 0.85 },
      { action: 'line', x: w * 0.63, y: d + c },
      { action: 'line', x: w * 0.37, y: d + c },
      { action: 'line', x: w * 0.45, y: d + c * 0.85 },
      { action: 'line', x: w * 0.45, y: d + c * 0.12 },
      { action: 'line', x: w * 0.1, y: d + c * 0.12 },
      { action: 'line', x: 0, y: d + c * 0.2 },
      { action: 'close' },
    ]]
  },
}

// ═══════════════════════════════════════════
// 导出列表
// ═══════════════════════════════════════════

export const umlCommonShapes: ShapeDefinition[] = [
  pkg,
  combinedFragment,
  umlNote,
  umlText,
]
