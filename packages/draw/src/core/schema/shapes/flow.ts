import type { ShapeDefinition } from '@/types'
import { rectangle, round } from './basic'

// 尺寸、锚点、textBlock、路径均取自旧版编辑器实现。
// 样式（边线 1.5 / 50,50,50、填充白、微软雅黑 13 号）由 registry 默认值兜底。

// ═══════════════════════════════════════════
// 引用 basic 图形（spread 复用，仅覆盖 name/title/category）
// ═══════════════════════════════════════════

/** 流程（复用 rectangle 路径，100×70） */
const process: ShapeDefinition = {
  ...rectangle,
  name: 'process',
  title: '流程',
  category: 'flow',
}

/** 页面内引用（复用 round 路径，70×70） */
const onPageReference: ShapeDefinition = {
  ...round,
  name: 'onPageReference',
  title: '页面内引用',
  category: 'flow',
}

// ═══════════════════════════════════════════
// 独立定义（路径从 flow.js 迁移）
// ═══════════════════════════════════════════

/** 判定（菱形，90×70） */
const decision: ShapeDefinition = {
  name: 'decision',
  title: '判定',
  category: 'flow',
  props: { w: 90, h: 70 },
  path: [[
    { action: 'move', x: 0, y: 'h/2' },
    { action: 'line', x: 'w/2', y: 0 },
    { action: 'line', x: 'w', y: 'h/2' },
    { action: 'line', x: 'w/2', y: 'h' },
    { action: 'line', x: 0, y: 'h/2' },
    { action: 'close' },
  ]],
}

/** 开始/结束（胶囊形，100×50） */
const terminator: ShapeDefinition = {
  name: 'terminator',
  title: '开始/结束',
  category: 'flow',
  props: { w: 100, h: 50 },
  path: [[
    { action: 'move', x: 'Math.min(w,h)/3', y: 0 },
    { action: 'line', x: 'w-Math.min(w,h)/3', y: 0 },
    { action: 'curve', x1: 'w+Math.min(w,h)/3/3', y1: 0, x2: 'w+Math.min(w,h)/3/3', y2: 'h', x: 'w-Math.min(w,h)/3', y: 'h' },
    { action: 'line', x: 'Math.min(w,h)/3', y: 'h' },
    { action: 'curve', x1: '-Math.min(w,h)/3/3', y1: 'h', x2: '-Math.min(w,h)/3/3', y2: 0, x: 'Math.min(w,h)/3', y: 0 },
    { action: 'close' },
  ]],
}

/** 文档（底部波浪线，100×70） */
const document: ShapeDefinition = {
  name: 'document',
  title: '文档',
  category: 'flow',
  props: { w: 100, h: 70 },
  anchors: [
    { x: 'w*0.5', y: 0 },
    { x: 'w', y: 'h*0.5' },
    { x: 'w*0.5', y: 'h-Math.min(h/8,w/12)' },
    { x: 0, y: 'h*0.5' },
  ],
  textBlock: [{ position: { x: 0, y: 0, w: 'w', h: 'h*0.9' }, text: '' }],
  path: [[
    { action: 'move', x: 0, y: 'h-Math.min(h/8,w/12)' },
    { action: 'line', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h-Math.min(h/8,w/12)' },
    { action: 'quadraticCurve', x1: 'w*0.75', y1: 'h-3*Math.min(h/8,w/12)', x: 'w*0.5', y: 'h-Math.min(h/8,w/12)' },
    { action: 'quadraticCurve', x1: 'w*0.25', y1: 'h+Math.min(h/8,w/12)', x: 0, y: 'h-Math.min(h/8,w/12)' },
    { action: 'close' },
  ]],
}

/** 数据（平行四边形，100×70） */
const data: ShapeDefinition = {
  name: 'data',
  title: '数据',
  category: 'flow',
  props: { w: 100, h: 70 },
  anchors: [
    { x: 'w*0.5', y: 0 },
    { x: 'w-Math.min(h/3,w/3)/2', y: 'h*0.5' },
    { x: 'w*0.5', y: 'h' },
    { x: 'Math.min(h/3,w/3)/2', y: 'h*0.5' },
  ],
  textBlock: [{ position: { x: 'w*0.15', y: 0, w: 'w*0.7', h: 'h' }, text: '' }],
  path: [[
    { action: 'move', x: 'Math.min(h/3,w/3)', y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w-Math.min(h/3,w/3)', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 'Math.min(h/3,w/3)', y: 0 },
    { action: 'close' },
  ]],
}

/** 子流程（矩形 + 两侧竖线，100×70） */
const predefinedProcess: ShapeDefinition = {
  name: 'predefinedProcess',
  title: '子流程',
  category: 'flow',
  props: { w: 100, h: 70 },
  textBlock: [{ position: { x: 'Math.min(w/6,20)', y: 0, w: 'w-Math.min(w/6,20)*2', h: 'h' }, text: '' }],
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 0, y: 0 },
    { action: 'close' },
    { action: 'move', x: 'Math.min(w/6,20)', y: 0 },
    { action: 'line', x: 'Math.min(w/6,20)', y: 'h' },
    { action: 'move', x: 'w-Math.min(w/6,20)', y: 0 },
    { action: 'line', x: 'w-Math.min(w/6,20)', y: 'h' },
  ]],
}

/** 外部数据（圆柱曲面，100×70） */
const storedData: ShapeDefinition = {
  name: 'storedData',
  title: '外部数据',
  category: 'flow',
  props: { w: 100, h: 70 },
  anchors: [
    { x: 'w*0.5', y: 0 },
    { x: 'w-Math.min(w/8,h/8)', y: 'h*0.5' },
    { x: 'w*0.5', y: 'h' },
    { x: 0, y: 'h*0.5' },
  ],
  textBlock: [{ position: { x: 'w*0.1', y: 0, w: 'w*0.75', h: 'h' }, text: '' }],
  path: [[
    { action: 'move', x: 'w/6', y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'curve', x1: 'w-w/6', y1: 0, x2: 'w-w/6', y2: 'h', x: 'w', y: 'h' },
    { action: 'line', x: 'w/6', y: 'h' },
    { action: 'curve', x1: '-w/17', y1: 'h', x2: '-w/17', y2: 0, x: 'w/7', y: 0 },
    { action: 'close' },
  ]],
}

/** 内部存储（矩形 + 十字线，100×70） */
const internalStorage: ShapeDefinition = {
  name: 'internalStorage',
  title: '内部存储',
  category: 'flow',
  props: { w: 100, h: 70 },
  textBlock: [{ position: { x: 'Math.min(w/6,20)', y: 'Math.min(h/5,20)', w: 'w-Math.min(w/6,20)', h: 'h-Math.min(h/5,20)' }, text: '' }],
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 0, y: 0 },
    { action: 'close' },
    { action: 'move', x: 'Math.min(w/6,20)', y: 0 },
    { action: 'line', x: 'Math.min(w/6,20)', y: 'h' },
    { action: 'move', x: 0, y: 'Math.min(h/5,20)' },
    { action: 'line', x: 'w', y: 'Math.min(h/5,20)' },
  ]],
}

/** 队列数据（圆形 + 右侧尾巴，70×70） */
const sequentialData: ShapeDefinition = {
  name: 'sequentialData',
  title: '队列数据',
  category: 'flow',
  props: { w: 70, h: 70 },
  path: [[
    { action: 'move', x: 'w/2', y: 'h' },
    { action: 'curve', x1: 'w/2-w*2/3', y1: 'h', x2: 'w/2-w*2/3', y2: 0, x: 'w/2', y: 0 },
    { action: 'curve', x1: 'w/2+w*2/3', y1: 0, x2: 'w/2+w*2/3', y2: 'h', x: 'w/2', y: 'h' },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'close' },
  ]],
}

/** 数据库（圆柱 + 内部椭圆，100×70） */
const directData: ShapeDefinition = {
  name: 'directData',
  title: '数据库',
  category: 'flow',
  props: { w: 100, h: 70 },
  textBlock: [{ position: { x: 0, y: 0, w: 'w*0.8', h: 'h' }, text: '' }],
  path: [[
    { action: 'move', x: 'w*0.15', y: 0 },
    { action: 'line', x: 'w-h/6', y: 0 },
    { action: 'curve', x1: 'w+h/22', y1: 0, x2: 'w+h/22', y2: 'h', x: 'w-h/6', y: 'h' },
    { action: 'line', x: 'w*0.15', y: 'h' },
    { action: 'curve', x1: '-w*0.05', y1: 'h', x2: '-w*0.05', y2: 0, x: 'w*0.15', y: 0 },
    { action: 'close' },
    { action: 'move', x: 'w-h/6', y: 0 },
    { action: 'curve', x1: 'w-h/8*3', y1: 0, x2: 'w-h/8*3', y2: 'h', x: 'w-h/6', y: 'h' },
    { action: 'curve', x1: 'w-h/8*3', y1: 'h', x2: 'w-h/8*3', y2: 0, x: 'w-h/6', y: 0 },
  ]],
}

/** 人工输入（斜切梯形，100×70） */
const manualInput: ShapeDefinition = {
  name: 'manualInput',
  title: '人工输入',
  category: 'flow',
  props: { w: 100, h: 70 },
  anchors: [
    { x: 0, y: 'h*0.5' },
    { x: 'w*0.5', y: 'Math.min(h/2,w/6)/2' },
    { x: 'w', y: 'h*0.5' },
    { x: 'w*0.5', y: 'h' },
  ],
  textBlock: [{ position: { x: 0, y: 'h*0.1', w: 'w', h: 'h*0.9' }, text: '' }],
  path: [[
    { action: 'move', x: 0, y: 'Math.min(h/2,w/6)' },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 0, y: 'Math.min(h/2,w/6)' },
    { action: 'close' },
  ]],
}

/** 卡片（切角矩形，100×70） */
const card: ShapeDefinition = {
  name: 'card',
  title: '卡片',
  category: 'flow',
  props: { w: 100, h: 70 },
  path: [[
    { action: 'move', x: 0, y: 'Math.min(h/2,w/4)' },
    { action: 'line', x: 'Math.min(h/2,w/4)', y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 0, y: 'Math.min(h/2,w/4)' },
    { action: 'close' },
  ]],
}

/** 条带（上下波浪，100×70） */
const paperTape: ShapeDefinition = {
  name: 'paperTape',
  title: '条带',
  category: 'flow',
  props: { w: 100, h: 70 },
  textBlock: [{ position: { x: 0, y: 'h*0.1', w: 'w', h: 'h*0.8' }, text: '' }],
  anchors: [
    { x: 'w*0.5', y: 'Math.min(Math.min(w,h)/8,w/12)' },
    { x: 'w', y: 'h*0.5' },
    { x: 'w*0.5', y: 'h-Math.min(Math.min(w,h)/8,w/12)' },
    { x: 0, y: 'h*0.5' },
  ],
  path: [[
    { action: 'move', x: 0, y: 'Math.min(Math.min(w,h)/8,w/12)' },
    { action: 'quadraticCurve', x1: 'w*0.25', y1: '3*Math.min(Math.min(w,h)/8,w/12)', x: 'w*0.5', y: 'Math.min(Math.min(w,h)/8,w/12)' },
    { action: 'quadraticCurve', x1: 'w*0.75', y1: '-Math.min(Math.min(w,h)/8,w/12)', x: 'w', y: 'Math.min(Math.min(w,h)/8,w/12)' },
    { action: 'line', x: 'w', y: 'h-Math.min(Math.min(w,h)/8,w/12)' },
    { action: 'quadraticCurve', x1: 'w*0.75', y1: 'h-3*Math.min(Math.min(w,h)/8,w/12)', x: 'w*0.5', y: 'h-Math.min(Math.min(w,h)/8,w/12)' },
    { action: 'quadraticCurve', x1: 'w*0.25', y1: 'h+Math.min(Math.min(w,h)/8,w/12)', x: 0, y: 'h-Math.min(Math.min(w,h)/8,w/12)' },
    { action: 'line', x: 0, y: 'Math.min(Math.min(w,h)/8,w/12)' },
    { action: 'close' },
  ]],
}

/** 展示（右侧半圆曲线，100×70） */
const display: ShapeDefinition = {
  name: 'display',
  title: '展示',
  category: 'flow',
  props: { w: 100, h: 70 },
  path: [[
    { action: 'move', x: 'w-w/6', y: 0 },
    { action: 'line', x: 'w/6', y: 0 },
    { action: 'line', x: 0, y: 'h/2' },
    { action: 'line', x: 'w/6', y: 'h' },
    { action: 'line', x: 'w-w/6', y: 'h' },
    { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w', y: 'h*0.5' },
    { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w-w/6', y: 0 },
    { action: 'close' },
  ]],
}

/** 人工操作（梯形，100×70） */
const manualOperation: ShapeDefinition = {
  name: 'manualOperation',
  title: '人工操作',
  category: 'flow',
  props: { w: 100, h: 70 },
  textBlock: [{ position: { x: 'w*0.1', y: 0, w: 'w*0.8', h: 'h' }, text: '' }],
  anchors: [
    { x: 'w*0.5', y: 0 },
    { x: 'w-Math.min(h/2,w/6)/2', y: 'h*0.5' },
    { x: 'w*0.5', y: 'h' },
    { x: 'Math.min(h/2,w/6)/2', y: 'h*0.5' },
  ],
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w-Math.min(h/2,w/6)', y: 'h' },
    { action: 'line', x: 'Math.min(h/2,w/6)', y: 'h' },
    { action: 'line', x: 0, y: 0 },
    { action: 'close' },
  ]],
}

/** 预备（六边形，100×70） */
const preparation: ShapeDefinition = {
  name: 'preparation',
  title: '预备',
  category: 'flow',
  props: { w: 100, h: 70 },
  path: [[
    { action: 'move', x: 0, y: 'h*0.5' },
    { action: 'line', x: 'Math.min(h/2,w/6)', y: 0 },
    { action: 'line', x: 'w-Math.min(h/2,w/6)', y: 0 },
    { action: 'line', x: 'w', y: 'h/2' },
    { action: 'line', x: 'w-Math.min(h/2,w/6)', y: 'h' },
    { action: 'line', x: 'Math.min(h/2,w/6)', y: 'h' },
    { action: 'line', x: 0, y: 'h/2' },
    { action: 'close' },
  ]],
}

/** 并行模式（两条横线，无填充，container 补命中区） */
const parallelMode: ShapeDefinition = {
  name: 'parallelMode',
  title: '并行模式',
  category: 'flow',
  attribute: { container: true },
  props: { w: 100, h: 70 },
  fillStyle: { type: 'none' },
  anchors: [
    { x: 'w*0.5', y: 0 },
    { x: 'w*0.5', y: 'h' },
  ],
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'move', x: 0, y: 'h' },
    { action: 'line', x: 'w', y: 'h' },
  ]],
}

/** 循环限值（切角矩形，100×70） */
const loopLimit: ShapeDefinition = {
  name: 'loopLimit',
  title: '循环限值',
  category: 'flow',
  props: { w: 100, h: 70 },
  path: [[
    { action: 'move', x: 0, y: 'Math.min(h/2,w/6)' },
    { action: 'line', x: 'Math.min(h/2,w/6)', y: 0 },
    { action: 'line', x: 'w-Math.min(h/2,w/6)', y: 0 },
    { action: 'line', x: 'w', y: 'Math.min(h/2,w/6)' },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 0, y: 'Math.min(h/2,w/6)' },
    { action: 'close' },
  ]],
}

/** 跨页引用（五边形/房子形，70×60） */
const offPageReference: ShapeDefinition = {
  name: 'offPageReference',
  title: '跨页引用',
  category: 'flow',
  props: { w: 70, h: 60 },
  textBlock: [{ position: { x: 0, y: 0, w: 'w', h: 'h-Math.min(h,w)/3' }, text: '' }],
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h-Math.min(h,w)/3' },
    { action: 'line', x: 'w*0.5', y: 'h' },
    { action: 'line', x: 0, y: 'h-Math.min(h,w)/3' },
    { action: 'line', x: 0, y: 0 },
    { action: 'close' },
  ]],
}

/** 注释（左侧括号，无填充，container 补命中区） */
const annotation: ShapeDefinition = {
  name: 'annotation',
  title: '注释',
  category: 'flow',
  attribute: { container: true },
  props: { w: 100, h: 70 },
  fillStyle: { type: 'none' },
  anchors: [{ x: 0, y: 'h*0.5' }],
  path: [[
    { action: 'move', x: 'Math.min(w/6,20)', y: 0 },
    { action: 'line', x: 0, y: 0 },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 'Math.min(w/6,20)', y: 'h' },
  ]],
}

// ═══════════════════════════════════════════
// 导出列表（顺序与 flow.js 一致）
// ═══════════════════════════════════════════

export const flowShapes: ShapeDefinition[] = [
  process,
  decision,
  terminator,
  document,
  data,
  predefinedProcess,
  storedData,
  internalStorage,
  sequentialData,
  directData,
  manualInput,
  card,
  paperTape,
  display,
  manualOperation,
  preparation,
  parallelMode,
  loopLimit,
  onPageReference,
  offPageReference,
  annotation,
]
