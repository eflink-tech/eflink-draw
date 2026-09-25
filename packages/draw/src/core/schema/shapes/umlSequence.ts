import type { ShapeDefinition } from '@/types'

// 尺寸、锚点、textBlock、路径均取自旧版编辑器实现。
// 样式（边线 2px / 50,50,50、填充白、微软雅黑 13 号）由 registry 默认值兜底。

// ═══════════════════════════════════════════
// UML 时序图（9 个）
// ═══════════════════════════════════════════

/** 对象（旧：100×70，矩形） */
const sequenceObject: ShapeDefinition = {
  name: 'sequenceObject',
  title: '对象',
  category: 'uml_sequence',
  props: { w: 96, h: 54 },
  // 内联 rectangle 路径
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'close' },
  ]],
}

/** 实体（旧：40×40，圆形 + 底部横线） */
const sequenceEntity: ShapeDefinition = {
  name: 'sequenceEntity',
  title: '实体',
  category: 'uml_sequence',
  props: { w: 40, h: 40 },
  textBlock: [{ position: { x: -20, y: 'h', w: 'w+40', h: 30 }, text: '' }],
  path: [[
    // 圆形
    { action: 'move', x: 0, y: 'h*(1/2)' },
    { action: 'curve', x1: 0, y1: '-h*(1/6)', x2: 'w', y2: '-h*(1/6)', x: 'w', y: 'h*(1/2)' },
    { action: 'curve', x1: 'w', y1: 'h*(7/6)', x2: 0, y2: 'h*(7/6)', x: 0, y: 'h*(1/2)' },
    { action: 'close' },
    // 底部横线
    { action: 'move', x: 0, y: 'h' },
    { action: 'line', x: 'w', y: 'h' },
  ]],
}

/** 控制（旧：40×40，圆形 + 顶部箭头） */
const sequenceControl: ShapeDefinition = {
  name: 'sequenceControl',
  title: '控制',
  category: 'uml_sequence',
  props: { w: 40, h: 40 },
  textBlock: [{ position: { x: -20, y: 'h', w: 'w+40', h: 30 }, text: '' }],
  drawIcon: (a, b) => [
    // 圆形（闭合，iconFill 填深色）
    [
      { action: 'move', x: 0, y: b * (1 / 2) },
      { action: 'curve', x1: 0, y1: -b * (1 / 6), x2: a, y2: -b * (1 / 6), x: a, y: b * (1 / 2) },
      { action: 'curve', x1: a, y1: b * (7 / 6), x2: 0, y2: b * (7 / 6), x: 0, y: b * (1 / 2) },
      { action: 'close' },
    ],
    // 箭头两笔
    [
      { action: 'move', x: a * (1 / 2), y: 0 },
      { action: 'line', x: a * (4 / 6), y: b * (1 / 12) },
    ],
    [
      { action: 'move', x: a * (1 / 2), y: 0 },
      { action: 'line', x: a * (4 / 6), y: -b * (1 / 12) },
    ],
  ],
  path: [[
    { action: 'move', x: 0, y: 'h*(1/2)' },
    { action: 'curve', x1: 0, y1: '-h*(1/6)', x2: 'w', y2: '-h*(1/6)', x: 'w', y: 'h*(1/2)' },
    { action: 'curve', x1: 'w', y1: 'h*(7/6)', x2: 0, y2: 'h*(7/6)', x: 0, y: 'h*(1/2)' },
    { action: 'close' },
    // 箭头
    { action: 'move', x: 'w*(1/2)', y: 0 },
    { action: 'line', x: 'w*(1/2)+6', y: 5 },
    { action: 'move', x: 'w*(1/2)', y: 0 },
    { action: 'line', x: 'w*(1/2)+6', y: -5 },
  ]],
}

/** 绑定 / 边界（旧：50×40，半圆 + 左侧竖线） */
const sequenceBoundary: ShapeDefinition = {
  name: 'sequenceBoundary',
  title: '绑定',
  category: 'uml_sequence',
  props: { w: 50, h: 40 },
  textBlock: [{ position: { x: -20, y: 'h', w: 'w+40', h: 30 }, text: '' }],
  path: [[
    // 半圆（右半部分）
    { action: 'move', x: 'w*(1/5)', y: 'h*(1/2)' },
    { action: 'curve', x1: 'w*(1/5)', y1: '-h*(1/6)', x2: 'w', y2: '-h*(1/6)', x: 'w', y: 'h*(1/2)' },
    { action: 'curve', x1: 'w', y1: 'h*(7/6)', x2: 'w*(1/5)', y2: 'h*(7/6)', x: 'w*(1/5)', y: 'h*(1/2)' },
    { action: 'close' },
    // 左侧竖线
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 0, y: 'h' },
    // 水平连接线
    { action: 'move', x: 0, y: 'h*(1/2)' },
    { action: 'line', x: 'w*(1/5)', y: 'h*(1/2)' },
  ]],
}

/** 时间信号（旧：30×30，沙漏形） */
const sequenceTimerSignal: ShapeDefinition = {
  name: 'sequenceTimerSignal',
  title: '时间信号',
  category: 'uml_sequence',
  props: { w: 30, h: 30 },
  attribute: { linkable: false, container: true },
  textBlock: [],
  drawIcon: (a, b) => [[
    { action: 'move', x: 0, y: 5 },
    { action: 'line', x: a, y: 5 },
    { action: 'line', x: 0, y: b - 5 },
    { action: 'line', x: a, y: b - 5 },
    { action: 'line', x: 0, y: 5 },
    { action: 'close' },
  ]],
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 0 },
    { action: 'close' },
  ]],
}

/** 约束（旧：110×70，花括号，linkable:false） */
const sequenceConstraint: ShapeDefinition = {
  name: 'sequenceConstraint',
  title: '约束',
  category: 'uml_sequence',
  attribute: { linkable: false, container: true },
  props: { w: 85, h: 54 },
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

/** 激活（旧：30×100，细长圆角矩形，只能上下缩放） */
const sequenceActivation: ShapeDefinition = {
  name: 'sequenceActivation',
  title: '激活',
  category: 'uml_sequence',
  props: { w: 30, h: 100 },
  resizeDir: ['t', 'b'],
  attribute: { linkable: true, container: false, rotatable: false },
  anchors: [],
  textBlock: [],
  drawIcon: (b, c) => {
    const bw = b + 6
    const a = -3
    return [[
      { action: 'move', x: a, y: 4 },
      { action: 'quadraticCurve', x1: a, y1: 0, x: 0, y: 0 },
      { action: 'line', x: bw - 4 - 3, y: 0 },
      { action: 'quadraticCurve', x1: bw - 3, y1: 0, x: bw - 3, y: 4 },
      { action: 'line', x: bw - 3, y: c - 4 },
      { action: 'quadraticCurve', x1: bw - 3, y1: c, x: bw - 4 - 3, y: c },
      { action: 'line', x: 0, y: c },
      { action: 'quadraticCurve', x1: a, y1: c, x: a, y: c - 4 },
      { action: 'line', x: a, y: 4 },
      { action: 'close' },
    ]]
  },
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

/** 生命线（旧：70×140，虚线 + 顶部矩形，linkable:false） */
const sequenceLifeLine: ShapeDefinition = {
  name: 'sequenceLifeLine',
  title: '生命线',
  category: 'uml_sequence',
  props: { w: 70, h: 300 },
  attribute: { linkable: false },
  textBlock: [{ position: { x: 10, y: 0, w: 'w-20', h: 30 }, text: '' }],
  anchors: [],
  // 面板图标：方形格子内绘制（头部矩形 + 虚线到底）
  drawIcon: (w, h) => [
    [
      { action: 'move', x: w * 0.12, y: h * 0.02 },
      { action: 'line', x: w * 0.88, y: h * 0.02 },
      { action: 'line', x: w * 0.88, y: h * 0.16 },
      { action: 'line', x: w * 0.12, y: h * 0.16 },
      { action: 'close' },
    ],
    {
      lineStyle: { lineStyle: 'dot' },
      actions: [
        { action: 'move', x: w / 2, y: h * 0.16 },
        { action: 'line', x: w / 2, y: h * 0.97 },
      ],
    },
  ],
  path: [
    {
      lineStyle: { lineWidth: 2, lineStyle: 'dot' },
      fillStyle: { type: 'none' },
      actions: [
        { action: 'move', x: 'w*(1/2)', y: 30 },
        { action: 'line', x: 'w*(1/2)', y: 'h' },
      ],
    },
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 'w', y: 0 },
      { action: 'line', x: 'w', y: 30 },
      { action: 'line', x: 0, y: 30 },
      { action: 'close' },
    ],
  ],
}

/** 删除（旧：40×40，大叉号，linkable:false） */
const sequenceDeletion: ShapeDefinition = {
  name: 'sequenceDeletion',
  title: '删除',
  category: 'uml_sequence',
  props: { w: 40, h: 40 },
  attribute: { linkable: false, container: true },
  fillStyle: { type: 'none' },
  textBlock: [],
  drawIcon: (a, b) => [{
    lineStyle: { lineWidth: 2.5 },
    actions: [
      { action: 'move', x: a * 0.18, y: b * 0.18 },
      { action: 'line', x: a * 0.82, y: b * 0.82 },
      { action: 'move', x: a * 0.82, y: b * 0.18 },
      { action: 'line', x: a * 0.18, y: b * 0.82 },
    ],
  }],
  path: [{
    lineStyle: { lineWidth: 4 },
    fillStyle: { type: 'none' },
    actions: [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 'w', y: 'h' },
      { action: 'move', x: 'w', y: 0 },
      { action: 'line', x: 0, y: 'h' },
    ],
  }],
}

// ═══════════════════════════════════════════
// 导出列表
// ═══════════════════════════════════════════


/** 角色生命线（小人头部 + 虚线延伸） */
const sequenceActorLifeLine: ShapeDefinition = {
  name: 'sequenceActorLifeLine',
  title: '角色生命线',
  category: 'uml_sequence',
  attribute: { linkable: false },
  props: { w: 70, h: 300 },
  textBlock: [{ position: { x: -20, y: 34, w: 'w+40', h: 26 }, text: '' }],
  anchors: [],
  // 面板图标：方形格子内绘制——参考样式：紧凑小人 + 间隔明显的虚线生命线
  drawIcon: (w, h) => {
    const cx = w / 2
    const headR = h * 0.05
    const headY = h * 0.07
    const shoulder = h * 0.16
    const hip = h * 0.28
    const armEndX = h * 0.07
    const armEndY = h * 0.24
    const legEndX = h * 0.05
    const legEndY = h * 0.38
    return [
      // 小人（头 + 身体 + 下垂手臂 + 腿）
      [
        { action: 'move', x: cx, y: headY },
        { action: 'curve', x1: cx - headR, y1: headY - headR * 1.15, x2: cx + headR, y2: headY - headR * 1.15, x: cx, y: headY + headR },
        { action: 'curve', x1: cx + headR, y1: headY + headR * 1.15, x2: cx - headR, y2: headY + headR * 1.15, x: cx, y: headY },
        { action: 'move', x: cx, y: headY + headR },
        { action: 'line', x: cx, y: hip },
        { action: 'move', x: cx, y: shoulder },
        { action: 'line', x: cx - armEndX, y: armEndY },
        { action: 'move', x: cx, y: shoulder },
        { action: 'line', x: cx + armEndX, y: armEndY },
        { action: 'move', x: cx, y: hip },
        { action: 'line', x: cx - legEndX, y: legEndY },
        { action: 'move', x: cx, y: hip },
        { action: 'line', x: cx + legEndX, y: legEndY },
      ],
      // 虚线生命线（与小人留出间隔，dash 段更易读）
      {
        lineStyle: { lineStyle: 'dashed' },
        actions: [
          { action: 'move', x: cx, y: h * 0.5 },
          { action: 'line', x: cx, y: h * 0.96 },
        ],
      },
    ]
  },
  path: [
    // 小人（头 + 身体 + 手臂 + 腿）
    [
      { action: 'move', x: 'w/2-5', y: 10 },
      { action: 'curve', x1: 'w/2-5', y1: 4, x2: 'w/2+5', y2: 4, x: 'w/2+5', y: 10 },
      { action: 'curve', x1: 'w/2+5', y1: 16, x2: 'w/2-5', y2: 16, x: 'w/2-5', y: 10 },
      { action: 'move', x: 'w/2', y: 16 },
      { action: 'line', x: 'w/2', y: 30 },
      { action: 'move', x: 'w/2-8', y: 20 },
      { action: 'line', x: 'w/2+8', y: 20 },
      { action: 'move', x: 'w/2', y: 30 },
      { action: 'line', x: 'w/2-6', y: 38 },
      { action: 'move', x: 'w/2', y: 30 },
      { action: 'line', x: 'w/2+6', y: 38 },
    ],
    // 虚线延伸
    {
      lineStyle: { lineStyle: 'dot' },
      actions: [
        { action: 'move', x: 'w/2', y: 38 },
        { action: 'line', x: 'w/2', y: 'h' },
      ],
    },
  ],
}

/** 状态不变式（圆 + 内部下划线，标注文本在圆内上方） */
const sequenceStateInvariant: ShapeDefinition = {
  name: 'sequenceStateInvariant',
  title: '状态不变式',
  category: 'uml_sequence',
  attribute: { linkable: false },
  props: { w: 50, h: 50 },
  textBlock: [{ position: { x: 6, y: 10, w: 'w-12', h: 12 }, text: '' }],
  anchors: [],
  path: [
    [
      { action: 'move', x: 0, y: 'h/2' },
      { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
      { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
      { action: 'close' },
    ],
    [{ action: 'move', x: 'w*0.2', y: 'h*0.62' }, { action: 'line', x: 'w*0.8', y: 'h*0.62' }],
  ],
}

/** 丢失消息目标（实心矩形） */
const sequenceLostMessageTarget: ShapeDefinition = {
  name: 'sequenceLostMessageTarget',
  title: '丢失消息目标',
  category: 'uml_sequence',
  attribute: { linkable: false },
  props: { w: 30, h: 20 },
  fillStyle: { type: 'solid', color: '50,50,50' },
  textBlock: [],
  anchors: [],
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'close' },
  ]],
}

export const umlSequenceShapes: ShapeDefinition[] = [
  sequenceObject,
  sequenceEntity,
  sequenceControl,
  sequenceBoundary,
  sequenceTimerSignal,
  sequenceConstraint,
  sequenceActivation,
  sequenceLifeLine,
  sequenceDeletion,
  sequenceActorLifeLine,
  sequenceStateInvariant,
  sequenceLostMessageTarget,
]
