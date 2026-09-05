import type { ShapeDefinition } from '@/types'

// 尺寸、锚点、textBlock、路径均取自旧版编辑器实现。
// 样式（边线 2px / 50,50,50、填充白、微软雅黑 13 号）由 registry 默认值兜底。

// ═══════════════════════════════════════════
// UML 类图（8 个）
// ═══════════════════════════════════════════

/** 简单类（旧：100×70，圆角矩形） */
const simpleClass: ShapeDefinition = {
  name: 'simpleClass',
  title: '简单类',
  category: 'uml_class',
  props: { w: 100, h: 70 },
  // 内联 roundRectangle 路径
  path: [[
    { action: 'move', x: 0, y: 4 },
    { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
    { action: 'line', x: 'w-4', y: 0 },
    { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
    { action: 'line', x: 'w', y: 'h-4' },
    { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
    { action: 'line', x: 4, y: 'h' },
    { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
    { action: 'close' },
  ]],
}

/** 类（旧：230×150，三段式：类名 / 属性 / 方法） */
const cls: ShapeDefinition = {
  name: 'cls',
  title: '类',
  category: 'uml_class',
  attribute: { container: true },
  props: { w: 230, h: 150 },
  fontStyle: { bold: true },
  textBlock: [
    { position: { x: 10, y: 0, w: 'w-20', h: 30 }, text: '类' },
    {
      position: { x: 10, y: 30, w: 'w-20', h: '(h-30)/2' },
      text: '+ attribute1:type = defaultValue\n+ attribute2:type\n- attribute3:type',
      fontStyle: { textAlign: 'left', bold: false },
    },
    {
      position: { x: 10, y: '(h-30)/2 + 30', w: 'w-20', h: '(h-30)/2' },
      text: '+ operation1(params):returnType\n- operation2(params)\n- operation3()',
      fontStyle: { textAlign: 'left', bold: false },
    },
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
    // 两条分隔线
    [
      { action: 'move', x: 0, y: b * 0.22 },
      { action: 'line', x: a, y: b * 0.22 },
      { action: 'move', x: 0, y: b * 0.55 },
      { action: 'line', x: a, y: b * 0.55 },
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
    // 分隔线（y=30 和 y=h/2+15）
    [
      { action: 'move', x: 0, y: 30 },
      { action: 'line', x: 'w', y: 30 },
      { action: 'move', x: 0, y: 'h/2+15' },
      { action: 'line', x: 'w', y: 'h/2+15' },
    ],
  ],
}

/** 接口（旧：230×150，圆角矩形 + 分隔线） */
const interfaceShape: ShapeDefinition = {
  name: 'interface',
  title: '接口',
  category: 'uml_class',
  attribute: { container: true },
  props: { w: 230, h: 150 },
  fontStyle: { bold: true },
  textBlock: [
    { position: { x: 10, y: 0, w: 'w-20', h: 30 }, text: '接口' },
    {
      position: { x: 10, y: 30, w: 'w-20', h: 'h-30' },
      text: '+ operation1(params):returnType\n- operation2(params)\n- operation3()',
      fontStyle: { textAlign: 'left', bold: false },
    },
  ],
  drawIcon: (a, b) => [
    // 圆角矩形
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
    // 分隔线
    [
      { action: 'move', x: 0, y: b * 0.22 },
      { action: 'line', x: a, y: b * 0.22 },
    ],
  ],
  path: [
    // 圆角矩形
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
    // 分隔线 y=30
    [
      { action: 'move', x: 0, y: 30 },
      { action: 'line', x: 'w', y: 30 },
    ],
  ],
}

/** 活动类（旧：100×70，圆角矩形 + 两侧竖线） */
const activeClass: ShapeDefinition = {
  name: 'activeClass',
  title: '活动类',
  category: 'uml_class',
  props: { w: 100, h: 70 },
  textBlock: [{ position: { x: 'Math.min(w/6,20)', y: 0, w: 'w-Math.min(w/6,20)*2', h: 'h' }, text: '' }],
  drawIcon: (a, b) => [[
    // 圆角矩形
    { action: 'move', x: 0, y: 4 },
    { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
    { action: 'line', x: a - 4, y: 0 },
    { action: 'quadraticCurve', x1: a, y1: 0, x: a, y: 4 },
    { action: 'line', x: a, y: b - 4 },
    { action: 'quadraticCurve', x1: a, y1: b, x: a - 4, y: b },
    { action: 'line', x: 4, y: b },
    { action: 'quadraticCurve', x1: 0, y1: b, x: 0, y: b - 4 },
    { action: 'line', x: 0, y: 4 },
    { action: 'close' },
    // 左侧竖线
    { action: 'move', x: a / 7 + 3, y: 0 },
    { action: 'line', x: a / 7 + 3, y: b },
    // 右侧竖线
    { action: 'move', x: a - a / 7 - 3, y: 0 },
    { action: 'line', x: a - a / 7 - 3, y: b },
  ]],
  path: [[
    // 圆角矩形
    { action: 'move', x: 0, y: 4 },
    { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
    { action: 'line', x: 'w-4', y: 0 },
    { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
    { action: 'line', x: 'w', y: 'h-4' },
    { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
    { action: 'line', x: 4, y: 'h' },
    { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
    { action: 'line', x: 0, y: 4 },
    { action: 'close' },
    // 左侧竖线
    { action: 'move', x: 'Math.min(w/6,20)', y: 0 },
    { action: 'line', x: 'Math.min(w/6,20)', y: 'h' },
    // 右侧竖线
    { action: 'move', x: 'w - Math.min(w/6,20)', y: 0 },
    { action: 'line', x: 'w - Math.min(w/6,20)', y: 'h' },
  ]],
}

/** 多例类（旧：100×70，折叠角矩形） */
const multiplictyClass: ShapeDefinition = {
  name: 'multiplictyClass',
  title: '多例类',
  category: 'uml_class',
  props: { w: 100, h: 70 },
  attribute: { container: true },
  textBlock: [{ position: { x: 'Math.min(w/6,20)-4', y: 8, w: 'w-Math.min(w/6,20)*2', h: 'h-8' }, text: '' }],
  // 4 个特殊锚点（适配折叠角）
  anchors: [
    { x: 0, y: '(w-16)*0.5' },
    { x: 'w*0.5', y: 0 },
    { x: 'w', y: 'h*0.5' },
    { x: 'w*0.5', y: 'h' },
  ],
  drawIcon: (a, b) => [
    // 上层折叠路径
    [
      { action: 'move', x: 4, y: 4 },
      { action: 'quadraticCurve', x1: 4, y1: 0, x: 8, y: 0 },
      { action: 'line', x: a - 4, y: 0 },
      { action: 'quadraticCurve', x1: a, y1: 0, x: a, y: 4 },
      { action: 'line', x: a, y: b - 8 },
      { action: 'quadraticCurve', x1: a, y1: b - 4, x: a - 2, y: b - 4 },
      { action: 'line', x: a - 4, y: b - 4 },
    ],
    // 下层折叠路径
    [
      { action: 'move', x: 0, y: 8 },
      { action: 'quadraticCurve', x1: 0, y1: 4, x: 4, y: 4 },
      { action: 'line', x: a - 8, y: 4 },
      { action: 'quadraticCurve', x1: a - 4, y1: 4, x: a - 4, y: 8 },
      { action: 'line', x: a - 4, y: b - 4 },
      { action: 'quadraticCurve', x1: a - 4, y1: b, x: a - 8, y: b },
      { action: 'line', x: 4, y: b },
      { action: 'quadraticCurve', x1: 0, y1: b, x: 0, y: b - 4 },
      { action: 'line', x: 0, y: 8 },
      { action: 'close' },
    ],
  ],
  path: [
    // 上层折叠路径
    [
      { action: 'move', x: 8, y: 8 },
      { action: 'quadraticCurve', x1: 8, y1: 0, x: 16, y: 0 },
      { action: 'line', x: 'w-8', y: 0 },
      { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 8 },
      { action: 'line', x: 'w', y: 'h-16' },
      { action: 'quadraticCurve', x1: 'w', y1: 'h-8', x: 'w-8', y: 'h-8' },
      { action: 'line', x: 'w-8', y: 'h-8' },
    ],
    // 下层折叠路径
    [
      { action: 'move', x: 0, y: 16 },
      { action: 'quadraticCurve', x1: 0, y1: 8, x: 8, y: 8 },
      { action: 'line', x: 'w-16', y: 8 },
      { action: 'quadraticCurve', x1: 'w-8', y1: 8, x: 'w-8', y: 16 },
      { action: 'line', x: 'w-8', y: 'h-8' },
      { action: 'quadraticCurve', x1: 'w-8', y1: 'h', x: 'w-16', y: 'h' },
      { action: 'line', x: 8, y: 'h' },
      { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-8' },
      { action: 'line', x: 0, y: 16 },
      { action: 'close' },
    ],
  ],
}

/** 简单接口（旧：110×140，圆角矩形） */
const simpleInterface: ShapeDefinition = {
  name: 'simpleInterface',
  title: '接口',
  category: 'uml_class',
  props: { w: 110, h: 140 },
  // 内联 roundRectangle 路径
  path: [[
    { action: 'move', x: 0, y: 4 },
    { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
    { action: 'line', x: 'w-4', y: 0 },
    { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
    { action: 'line', x: 'w', y: 'h-4' },
    { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
    { action: 'line', x: 4, y: 'h' },
    { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
    { action: 'close' },
  ]],
}

/** 约束（旧：110×70，花括号，linkable:false） */
const constraint: ShapeDefinition = {
  name: 'constraint',
  title: '约束',
  category: 'uml_class',
  attribute: { linkable: false, container: true },
  props: { w: 110, h: 70 },
  fillStyle: { type: 'none' },
  anchors: [{ x: 'w', y: 'h*0.5' }, { x: 0, y: 'h*0.5' }],
  path: [
    // 左花括号
    [
      { action: 'move', x: 'Math.min(w*0.2,18)', y: 0 },
      { action: 'quadraticCurve', x1: 'Math.min(w*0.1,9)', y1: 0, x: 'Math.min(w*0.1,9)', y: 'Math.min(h*0.1,9)' },
      { action: 'line', x: 'Math.min(w*0.1,9)', y: 'h*0.5-Math.min(h*0.1,9)' },
      { action: 'quadraticCurve', x1: 'Math.min(w*0.1,9)', y1: 'h*0.5', x: 0, y: 'h*0.5' },
      { action: 'quadraticCurve', x1: 'Math.min(w*0.1,9)', y1: 'h*0.5', x: 'Math.min(w*0.1,9)', y: 'h*0.5+Math.min(h*0.1,9)' },
      { action: 'line', x: 'Math.min(w*0.1,9)', y: 'h-Math.min(h*0.1,9)' },
      { action: 'quadraticCurve', x1: 'Math.min(w*0.1,9)', y1: 'h', x: 'Math.min(w*0.2,18)', y: 'h' },
    ],
    // 右花括号
    [
      { action: 'move', x: 'w-Math.min(w*0.2,18)', y: 'h' },
      { action: 'quadraticCurve', x1: 'w-Math.min(w*0.1,9)', y1: 'h', x: 'w-Math.min(w*0.1,9)', y: 'h-Math.min(h*0.1,9)' },
      { action: 'line', x: 'w-Math.min(w*0.1,9)', y: 'h*0.5+Math.min(h*0.1,9)' },
      { action: 'quadraticCurve', x1: 'w-Math.min(w*0.1,9)', y1: 'h*0.5', x: 'w', y: 'h*0.5' },
      { action: 'quadraticCurve', x1: 'w-Math.min(w*0.1,9)', y1: 'h*0.5', x: 'w-Math.min(w*0.1,9)', y: 'h*0.5-Math.min(h*0.1,9)' },
      { action: 'line', x: 'w-Math.min(w*0.1,9)', y: 'Math.min(h*0.1,9)' },
      { action: 'quadraticCurve', x1: 'w-Math.min(w*0.1,9)', y1: 0, x: 'w-Math.min(w*0.2,18)', y: 0 },
    ],
  ],
}

/** 端口（旧：20×20，小方块，不可缩放，linkable:false） */
const port: ShapeDefinition = {
  name: 'port',
  title: '端口',
  category: 'uml_class',
  props: { w: 20, h: 20 },
  resizeDir: [],
  attribute: { linkable: false },
  textBlock: [],
  // 内联 rectangle 路径
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'close' },
  ]],
}

// ═══════════════════════════════════════════
// 导出列表
// ═══════════════════════════════════════════

export const umlClassShapes: ShapeDefinition[] = [
  simpleClass,
  cls,
  interfaceShape,
  activeClass,
  multiplictyClass,
  simpleInterface,
  constraint,
  port,
]
