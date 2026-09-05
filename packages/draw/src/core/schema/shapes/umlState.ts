import type { ShapeDefinition } from '@/types'

// 尺寸、锚点、textBlock、路径均取自旧版编辑器实现。
// 样式（边线 2px / 50,50,50、填充白、微软雅黑 13 号）由 registry 默认值兜底。

// ═══════════════════════════════════════════
// UML 状态/活动图（14 个）
// ═══════════════════════════════════════════

/** 对象（旧：100×70，矩形） */
const umlObject: ShapeDefinition = {
  name: 'umlObject',
  title: '对象',
  category: 'uml_stateactivity',
  props: { w: 100, h: 70 },
  // 内联 rectangle 路径
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'close' },
  ]],
}

/** 状态（旧：100×70，圆角矩形，圆角半径 18） */
const umlState: ShapeDefinition = {
  name: 'umlState',
  title: '状态',
  category: 'uml_stateactivity',
  props: { w: 100, h: 70 },
  drawIcon: (a, b) => [[
    { action: 'move', x: 0, y: 6 },
    { action: 'quadraticCurve', x1: 0, y1: 0, x: 6, y: 0 },
    { action: 'line', x: a - 6, y: 0 },
    { action: 'quadraticCurve', x1: a, y1: 0, x: a, y: 6 },
    { action: 'line', x: a, y: b - 6 },
    { action: 'quadraticCurve', x1: a, y1: b, x: a - 6, y: b },
    { action: 'line', x: 6, y: b },
    { action: 'quadraticCurve', x1: 0, y1: b, x: 0, y: b - 6 },
    { action: 'line', x: 0, y: 6 },
    { action: 'close' },
  ]],
  path: [[
    { action: 'move', x: 0, y: 18 },
    { action: 'quadraticCurve', x1: 0, y1: 0, x: 18, y: 0 },
    { action: 'line', x: 'w-18', y: 0 },
    { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 18 },
    { action: 'line', x: 'w', y: 'h-18' },
    { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-18', y: 'h' },
    { action: 'line', x: 18, y: 'h' },
    { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-18' },
    { action: 'line', x: 0, y: 18 },
    { action: 'close' },
  ]],
}

/** 开始（旧：40×40，实心圆，无描边） */
const umlStart: ShapeDefinition = {
  name: 'umlStart',
  title: '开始',
  category: 'uml_stateactivity',
  props: { w: 40, h: 40 },
  fillStyle: { type: 'solid', color: '50,50,50' },
  lineStyle: { lineWidth: 0 },
  textBlock: [{ position: { x: -20, y: 'h', w: 'w+40', h: 30 }, text: '' }],
  // 内联 round（圆）路径
  path: [[
    { action: 'move', x: 0, y: 'h/2' },
    { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
    { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
    { action: 'close' },
  ]],
}

/** 结束（旧：40×40，双圆圈：外圈 + 内实心圆） */
const umlEnd: ShapeDefinition = {
  name: 'umlEnd',
  title: '结束',
  category: 'uml_stateactivity',
  attribute: { container: true },
  props: { w: 40, h: 40 },
  textBlock: [{ position: { x: -20, y: 'h', w: 'w+40', h: 30 }, text: '' }],
  path: [
    {
      lineStyle: { lineWidth: 3.5 },
      actions: [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' },
      ],
    },
    {
      lineStyle: { lineWidth: 0 },
      fillStyle: { type: 'solid', color: '50,50,50' },
      actions: [
        { action: 'move', x: 'w*0.5 - w*0.25', y: 'h*0.5' },
        { action: 'curve', x1: 'w*0.5 - w*0.25', y1: 'h*0.5 - h*2/3*0.5', x2: 'w*0.5 + w*0.25', y2: 'h*0.5 - h*2/3*0.5', x: 'w*0.5 + w*0.25', y: 'h*0.5' },
        { action: 'curve', x1: 'w*0.5 + w*0.25', y1: 'h*0.5 + h*2/3*0.5', x2: 'w*0.5 - w*0.25', y2: 'h*0.5 + h*2/3*0.5', x: 'w*0.5 - w*0.25', y: 'h*0.5' },
        { action: 'close' },
      ],
    },
  ],
}

/** 流终止（旧：40×40，圆圈内带 X） */
const flowFinal: ShapeDefinition = {
  name: 'flowFinal',
  title: '流终止',
  category: 'uml_stateactivity',
  attribute: { container: true },
  props: { w: 40, h: 40 },
  textBlock: [],
  path: [
    // 外圆
    [
      { action: 'move', x: 0, y: 'h/2' },
      { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
      { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
      { action: 'close' },
    ],
    // 内部 X
    [
      { action: 'move', x: 'w*(1/6)', y: 'h*(1/6)' },
      { action: 'line', x: 'w*(5/6)', y: 'h*(5/6)' },
      { action: 'move', x: 'w*(5/6)', y: 'h*(1/6)' },
      { action: 'line', x: 'w*(1/6)', y: 'h*(5/6)' },
    ],
  ],
}

/** 历史（旧：40×40，圆圈内带 H） */
const simpleHistory: ShapeDefinition = {
  name: 'simpleHistory',
  title: '历史',
  category: 'uml_stateactivity',
  attribute: { container: true },
  props: { w: 40, h: 40 },
  textBlock: [],
  path: [
    // 外圆
    [
      { action: 'move', x: 0, y: 'h/2' },
      { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
      { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
      { action: 'close' },
    ],
    // 内部 H
    [
      { action: 'move', x: 'w*(1/3)', y: 'h*(1/3)' },
      { action: 'line', x: 'w*(1/3)', y: 'h*(2/3)' },
      { action: 'move', x: 'w*(1/3)', y: 'h*(1/2)' },
      { action: 'line', x: 'w*(2/3)', y: 'h*(1/2)' },
      { action: 'move', x: 'w*(2/3)', y: 'h*(1/3)' },
      { action: 'line', x: 'w*(2/3)', y: 'h*(2/3)' },
    ],
  ],
}

/** 详细历史（旧：40×40，圆圈内带 H*） */
const detialHistory: ShapeDefinition = {
  name: 'detialHistory',
  title: '详细历史',
  category: 'uml_stateactivity',
  attribute: { container: true },
  props: { w: 40, h: 40 },
  textBlock: [],
  path: [
    // 外圆
    [
      { action: 'move', x: 0, y: 'h/2' },
      { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
      { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
      { action: 'close' },
    ],
    // H 部分
    [
      { action: 'move', x: 'w*(1/5)+w*(1/80)', y: 'h*(1/3)-h*(1/10)' },
      { action: 'line', x: 'w*(1/5)+w*(1/80)', y: 'h*(2/3)+h*(1/10)' },
      { action: 'move', x: 'w*(1/5)+w*(1/80)', y: 'h*(1/2)' },
      { action: 'line', x: 'w*(1/5)+w*(1/80)+w*(1/5)*(8/9)', y: 'h*(1/2)' },
      { action: 'move', x: 'w*(1/5)+w*(1/80)+w*(1/5)*(8/9)', y: 'h*(1/3)-h*(1/10)' },
      { action: 'line', x: 'w*(1/5)+w*(1/80)+w*(1/5)*(8/9) ', y: 'h*(2/3)+h*(1/10)' },
    ],
    // * 部分（星号）
    [
      { action: 'move', x: 'w*(1/5)+w*(1/4)', y: 'h*(1/3)+h*(1/3)*(1/4)' },
      { action: 'line', x: 'w*(4/5)', y: 'h*(1/3)+h*(1/3)*(3/4)' },
      { action: 'move', x: 'w*(6/10)+w*(1/40)', y: 'h*(1/3)' },
      { action: 'line', x: 'w*(6/10)+w*(1/40)', y: 'h*(2/3)' },
      { action: 'move', x: 'w*(4/5)', y: 'h*(1/3)+h*(1/3)*(1/4)' },
      { action: 'line', x: 'w*(1/5)+w*(1/4)', y: 'h*(1/3)+h*(1/3)*(3/4)' },
    ],
  ],
}

/** 发送信号（旧：150×70，凸五边形） */
const sendSignal: ShapeDefinition = {
  name: 'sendSignal',
  title: '发送信号',
  category: 'uml_stateactivity',
  props: { w: 150, h: 70 },
  textBlock: [{ position: { x: 'w*0.1', y: 2, w: '(w-Math.min(h/2,w/6))*0.8', h: 'h-2' }, text: '' }],
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w-Math.min(h/2,w/6)', y: 0 },
    { action: 'line', x: 'w', y: 'h*0.5' },
    { action: 'line', x: 'w-Math.min(h/2,w/6)', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 0, y: 0 },
    { action: 'close' },
  ]],
}

/** 接收信号（旧：150×70，凹五边形） */
const receiveSignal: ShapeDefinition = {
  name: 'receiveSignal',
  title: '接收信号',
  category: 'uml_stateactivity',
  props: { w: 150, h: 70 },
  textBlock: [{ position: { x: 'w*0.1', y: 2, w: '(w-Math.min(h/2,w/6))*0.8', h: 'h-2' }, text: '' }],
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w-Math.min(h/2,w/6)', y: 'h*0.5' },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 0, y: 0 },
    { action: 'close' },
  ]],
}

/** 分支 / 合并（旧：40×40，菱形） */
const branchMerge: ShapeDefinition = {
  name: 'branchMerge',
  title: '分支',
  category: 'uml_stateactivity',
  props: { w: 40, h: 40 },
  textBlock: [],
  path: [[
    { action: 'move', x: 0, y: 'h*0.5' },
    { action: 'line', x: 'w*0.5', y: 0 },
    { action: 'line', x: 'w', y: 'h*0.5' },
    { action: 'line', x: 'w*0.5', y: 'h' },
    { action: 'line', x: 0, y: 'h*0.5' },
    { action: 'close' },
  ]],
}

/** 同步条（旧：120×20，实心填充粗横条，无描边，只能左右缩放） */
const synchronization: ShapeDefinition = {
  name: 'Synchronization',
  title: '同步',
  category: 'uml_stateactivity',
  props: { w: 120, h: 20 },
  resizeDir: ['l', 'r'],
  fillStyle: { type: 'solid', color: '50,50,50' },
  lineStyle: { lineWidth: 0 },
  textBlock: [],
  anchors: [],
  drawIcon: (a, b) => {
    const bh = b + 2
    return [[
      { action: 'move', x: 0, y: 1 },
      { action: 'quadraticCurve', x1: 0, y1: -2, x: 3, y: -2 },
      { action: 'line', x: a - 3, y: -2 },
      { action: 'quadraticCurve', x1: a, y1: -2, x: a, y: 1 },
      { action: 'line', x: a, y: bh - 3 },
      { action: 'quadraticCurve', x1: a, y1: bh, x: a - 3, y: bh },
      { action: 'line', x: 3, y: bh },
      { action: 'quadraticCurve', x1: 0, y1: bh, x: 0, y: bh - 3 },
      { action: 'line', x: 0, y: 1 },
      { action: 'close' },
    ]]
  },
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
    { action: 'line', x: 0, y: 4 },
    { action: 'close' },
  ]],
}

/** 容器 — 大圆角矩形（旧：300×240） */
const stateRectangleContainer: ShapeDefinition = {
  name: 'stateRectangleContainer',
  title: '容器',
  category: 'uml_stateactivity',
  props: { w: 300, h: 240 },
  textBlock: [{ position: { x: 5, y: 2, w: 'w-10', h: 'h*(1/7)-2' }, text: '' }],
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

/** 泳道(垂直) — UML 活动图分区容器（旧：250×540） */
const swimlane: ShapeDefinition = {
  name: 'swimlane',
  title: '泳道(垂直)',
  category: 'uml_stateactivity',
  attribute: { rotatable: false, linkable: false, container: true },
  fillStyle: { type: 'none' },
  props: { w: 250, h: 540 },
  fontStyle: { size: 16 },
  textBlock: [{ position: { x: 10, y: 0, w: 'w-20', h: 40 }, text: '' }],
  anchors: [],
  resizeDir: ['l', 'b', 'r'],
  drawIcon: (b, c) => {
    const a = -4
    return [
      // 头部（闭合，iconFill 填深色）
      [
        { action: 'move', x: a, y: 0 },
        { action: 'line', x: b, y: 0 },
        { action: 'line', x: b, y: 4 },
        { action: 'line', x: a, y: 4 },
        { action: 'close' },
      ],
      // 外框（开放，仅描边）
      [
        { action: 'move', x: a, y: 0 },
        { action: 'line', x: b, y: 0 },
        { action: 'line', x: b, y: c },
        { action: 'line', x: a, y: c },
      ],
    ]
  },
  path: [
    // 外框（fillStyle:none → 不填充，仅描边）
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 'w', y: 0 },
      { action: 'line', x: 'w', y: 'h' },
      { action: 'line', x: 0, y: 'h' },
      { action: 'close' },
    ],
    // 头部分隔区域 y=0..40
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 'w', y: 0 },
      { action: 'line', x: 'w', y: 40 },
      { action: 'line', x: 0, y: 40 },
      { action: 'close' },
    ],
  ],
}

/** 泳道(水平) — UML 活动图分区容器（旧：640×200） */
const horizontalSwimlane: ShapeDefinition = {
  name: 'horizontalSwimlane',
  title: '泳道(水平)',
  category: 'uml_stateactivity',
  attribute: { rotatable: false, linkable: false, container: true },
  fillStyle: { type: 'none' },
  props: { w: 640, h: 200 },
  fontStyle: { size: 16, orientation: 'horizontal' },
  textBlock: [{ position: { x: 0, y: 10, w: 40, h: 'h-20' }, text: '' }],
  anchors: [],
  resizeDir: ['t', 'r', 'b'],
  drawIcon: (a, b) => {
    const c = -4
    return [
      // 头部（闭合，iconFill 填深色）
      [
        { action: 'move', x: 0, y: c },
        { action: 'line', x: 4, y: c },
        { action: 'line', x: 4, y: b },
        { action: 'line', x: 0, y: b },
        { action: 'close' },
      ],
      // 外框（开放，仅描边）
      [
        { action: 'move', x: 0, y: c },
        { action: 'line', x: a, y: c },
        { action: 'line', x: a, y: b },
        { action: 'line', x: 0, y: b },
      ],
    ]
  },
  path: [
    // 外框
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 'w', y: 0 },
      { action: 'line', x: 'w', y: 'h' },
      { action: 'line', x: 0, y: 'h' },
      { action: 'close' },
    ],
    // 头部区域 x=0..40
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 40, y: 0 },
      { action: 'line', x: 40, y: 'h' },
      { action: 'line', x: 0, y: 'h' },
      { action: 'close' },
    ],
  ],
}

// ═══════════════════════════════════════════
// 导出列表
// ═══════════════════════════════════════════

export const umlStateShapes: ShapeDefinition[] = [
  umlObject,
  umlState,
  umlStart,
  umlEnd,
  flowFinal,
  simpleHistory,
  detialHistory,
  sendSignal,
  receiveSignal,
  branchMerge,
  synchronization,
  stateRectangleContainer,
  swimlane,
  horizontalSwimlane,
]
