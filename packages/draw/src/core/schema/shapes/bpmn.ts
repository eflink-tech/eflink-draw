import type { ShapeDefinition } from '@/types'
import { round, roundRectangle } from './basic'

// 尺寸、锚点、textBlock、路径均取自旧版编辑器实现。
// 样式（边线 1.5 / 50,50,50、填充白、微软雅黑 13 号）由 registry 默认值兜底。

// ═══════════════════════════════════════════
// 引用 basic 图形（spread 复用）
// ═══════════════════════════════════════════

/** 开始事件（40×40，复用 round） */
const startEvent: ShapeDefinition = {
  ...round,
  name: 'startEvent',
  title: '开始事件',
  category: 'bpmn',
  props: { w: 40, h: 40 },
  textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }],
}

/** 中间事件（40×40，round + 内圈） */
const intermediateEvent: ShapeDefinition = {
  ...round,
  name: 'intermediateEvent',
  title: '中间事件',
  category: 'bpmn',
  props: { w: 40, h: 40 },
  textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }],
  path: [
    ...round.path,
    // 内圈（inneround 展开）
    [
      { action: 'move', x: 3, y: 'h*0.5' },
      { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
      { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' },
    ],
  ],
}

/** 边界事件（40×40，几何同 intermediateEvent） */
const boundaryEvent: ShapeDefinition = {
  ...intermediateEvent,
  name: 'boundaryEvent',
  title: '边界事件',
  category: 'bpmn',
}

/** 结束事件（40×40，round + 粗边框） */
const endEvent: ShapeDefinition = {
  ...round,
  name: 'endEvent',
  title: '结束事件',
  category: 'bpmn',
  props: { w: 40, h: 40 },
  lineStyle: { lineWidth: 3.5 }, // 粗边框：默认 1.5 + 2
  textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }],
}

/** 任务（100×70，复用 roundRectangle） */
const task: ShapeDefinition = {
  ...roundRectangle,
  name: 'task',
  title: '任务',
  category: 'bpmn',
}

/** 活动/调用活动（100×70，roundRectangle + 粗边框） */
const callActivity: ShapeDefinition = {
  ...roundRectangle,
  name: 'callActivity',
  title: '活动',
  category: 'bpmn',
  lineStyle: { lineWidth: 3.5 }, // 粗边框：默认 1.5 + 2
}

/** 子流程（400×280，roundRectangle + container + 不可旋转） */
const subProcess: ShapeDefinition = {
  ...roundRectangle,
  name: 'subProcess',
  title: '子流程',
  category: 'bpmn',
  props: { w: 400, h: 280 },
  attribute: { container: true, rotatable: false },
}

// ═══════════════════════════════════════════
// 独立定义（路径从 bpmn.js 内联迁移）
// ═══════════════════════════════════════════

/** 网关（菱形，50×50） */
const bpmnGateway: ShapeDefinition = {
  name: 'bpmnGateway',
  title: '网关',
  category: 'bpmn',
  props: { w: 50, h: 50 },
  textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }],
  path: [[
    { action: 'move', x: 0, y: 'h*0.5' },
    { action: 'line', x: 'w*0.5', y: 0 },
    { action: 'line', x: 'w', y: 'h*0.5' },
    { action: 'line', x: 'w*0.5', y: 'h' },
    { action: 'line', x: 0, y: 'h*0.5' },
    { action: 'close' },
  ]],
}

/** 数据对象（折叠页，70×90，container 替代隐形矩形） */
const dataObject: ShapeDefinition = {
  name: 'dataObject',
  title: '数据对象',
  category: 'bpmn',
  props: { w: 70, h: 90 },
  attribute: { container: true },
  path: [
    // 折叠页外轮廓
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 0, y: 'h' },
      { action: 'line', x: 'w', y: 'h' },
      { action: 'line', x: 'w', y: 'h*0.25' },
      { action: 'line', x: 'w*2/3', y: 0 },
      { action: 'line', x: 0, y: 0 },
      { action: 'close' },
    ],
    // 折角线
    [
      { action: 'move', x: 'w*2/3', y: 0 },
      { action: 'line', x: 'w*2/3', y: 'h*0.25' },
      { action: 'line', x: 'w', y: 'h*0.25' },
    ],
  ],
}

/** 数据存储（圆柱，70×70，container 替代隐形矩形） */
const dataStore: ShapeDefinition = {
  name: 'dataStore',
  title: '数据存储',
  category: 'bpmn',
  props: { w: 70, h: 70 },
  attribute: { container: true },
  path: [
    // 圆柱体
    [
      { action: 'move', x: 0, y: 'h*0.14' },
      { action: 'curve', x1: 0, y1: '-h*0.04', x2: 'w', y2: '-h*0.04', x: 'w', y: 'h*0.14' },
      { action: 'line', x: 'w', y: 'h*0.86' },
      { action: 'curve', x1: 'w', y1: 'h*1.04', x2: 0, y2: 'h*1.04', x: 0, y: 'h*0.86' },
      { action: 'line', x: 0, y: 'h*0.14' },
      { action: 'close' },
    ],
    // 内盖椭圆
    [
      { action: 'move', x: 'w', y: 'h*0.14' },
      { action: 'curve', x1: 'w', y1: 'h*0.3', x2: 0, y2: 'h*0.3', x: 0, y: 'h*0.14' },
      { action: 'line', x: 0, y: 'h*0.20' },
      { action: 'curve', x1: 0, y1: 'h*0.36', x2: 'w', y2: 'h*0.36', x: 'w', y: 'h*0.20' },
      { action: 'line', x: 'w', y: 'h*0.26' },
      { action: 'curve', x1: 'w', y1: 'h*0.42', x2: 0, y2: 'h*0.42', x: 0, y: 'h*0.26' },
      { action: 'curve', x1: 0, y1: 'h*0.42', x2: 'w', y2: 'h*0.42', x: 'w', y: 'h*0.26' },
      { action: 'close' },
    ],
  ],
}

/** 消息（矩形 + 对角线，60×40，container 替代隐形矩形） */
const message: ShapeDefinition = {
  name: 'message',
  title: '消息',
  category: 'bpmn',
  props: { w: 60, h: 40 },
  attribute: { container: true },
  path: [
    // 外框矩形
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 'w', y: 0 },
      { action: 'line', x: 'w', y: 'h' },
      { action: 'line', x: 0, y: 'h' },
      { action: 'close' },
    ],
    // 对角线 1
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 'w*0.5', y: 'h*0.5' },
    ],
    // 对角线 2
    [
      { action: 'move', x: 'w', y: 0 },
      { action: 'line', x: 'w*0.5', y: 'h*0.5' },
    ],
  ],
}

/** 组（200×140，roundRectangle + 虚线 + 无填充） */
const group: ShapeDefinition = {
  ...roundRectangle,
  name: 'group',
  title: '组',
  category: 'bpmn',
  props: { w: 200, h: 140 },
  attribute: { container: true },
  lineStyle: { lineStyle: 'dashed', lineWidth: 2 },
  fillStyle: { type: 'none' },
}

/** 注释（左侧括号，100×70，无填充 + container） */
const textAnnotation: ShapeDefinition = {
  name: 'textAnnotation',
  title: '注释',
  category: 'bpmn',
  props: { w: 100, h: 70 },
  attribute: { container: true },
  fillStyle: { type: 'none' },
  anchors: [{ x: 0, y: 'h*0.5' }],
  path: [[
    { action: 'move', x: 'Math.min(w/6,20)', y: 0 },
    { action: 'line', x: 0, y: 0 },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 'Math.min(w/6,20)', y: 'h' },
  ]],
}

/** 对话（六边形，45×40） */
const conversation: ShapeDefinition = {
  name: 'conversation',
  title: '对话',
  category: 'bpmn',
  props: { w: 45, h: 40 },
  path: [[
    { action: 'move', x: 'Math.min(w,h)*0.21', y: 0 },
    { action: 'line', x: 'w-Math.min(w,h)*0.21', y: 0 },
    { action: 'line', x: 'w', y: 'h*0.5' },
    { action: 'line', x: 'w-Math.min(w,h)*0.21', y: 'h' },
    { action: 'line', x: 'Math.min(w,h)*0.21', y: 'h' },
    { action: 'line', x: 0, y: 'h*0.5' },
    { action: 'line', x: 'Math.min(w,h)*0.21', y: 0 },
    { action: 'close' },
  ]],
}

/** 编排任务（120×120，圆角外框 + 2 分隔线，无填充 + container；分隔线距顶/底 25、圆角半径 6） */
const choreographyTask: ShapeDefinition = {
  name: 'choreographyTask',
  title: '编排任务',
  category: 'bpmn',
  props: { w: 120, h: 120 },
  attribute: { container: true },
  fillStyle: { type: 'none' },
  // textBlock 顺序与旧系统 bpmn.js 一致：块 0=中段主体（Space/F2 默认编辑），1=上参与者，2=下参与者
  textBlock: [
    { position: { x: 5, y: 30, w: 'w-10', h: 'h-60' }, text: '编排任务' },
    { position: { x: 5, y: 0, w: 'w-10', h: 25 }, text: '参与者 A' },
    { position: { x: 5, y: 'h-25', w: 'w-10', h: 25 }, text: '参与者 B' },
  ],
  path: [
    // 圆角外框（choreography_task 展开）
    [
      { action: 'move', x: 0, y: 6 },
      { action: 'quadraticCurve', x1: 0, y1: 0, x: 6, y: 0 },
      { action: 'line', x: 'w-6', y: 0 },
      { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 6 },
      { action: 'line', x: 'w', y: 'h-6' },
      { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-6', y: 'h' },
      { action: 'line', x: 6, y: 'h' },
      { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-6' },
      { action: 'line', x: 0, y: 6 },
      { action: 'close' },
    ],
    // 上分隔线
    [
      { action: 'move', x: 0, y: 25 },
      { action: 'line', x: 'w', y: 25 },
    ],
    // 下分隔线
    [
      { action: 'move', x: 0, y: 'h-25' },
      { action: 'line', x: 'w', y: 'h-25' },
    ],
  ],
}

// ═══════════════════════════════════════════
// 导出列表
// ═══════════════════════════════════════════

export const bpmnShapes: ShapeDefinition[] = [
  startEvent,
  intermediateEvent,
  boundaryEvent,
  endEvent,
  task,
  callActivity,
  subProcess,
  bpmnGateway,
  dataObject,
  dataStore,
  message,
  group,
  textAnnotation,
  conversation,
  choreographyTask,
]
