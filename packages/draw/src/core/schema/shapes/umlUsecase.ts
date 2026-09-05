import type { ShapeDefinition } from '@/types'

// 尺寸、锚点、textBlock、路径均取自旧版编辑器实现。
// 样式（边线 2px / 50,50,50、填充白、微软雅黑 13 号）由 registry 默认值兜底。

// ═══════════════════════════════════════════
// UML 用例图（4 个）
// ═══════════════════════════════════════════

/** 角色 / 参与者（旧：70×100，火柴人） */
const actor: ShapeDefinition = {
  name: 'actor',
  title: '角色',
  category: 'uml_usecase',
  props: { w: 70, h: 100 },
  attribute: { container: true },
  textBlock: [{ position: { x: -20, y: 'h', w: 'w+40', h: 30 }, text: '' }],
  path: [[
    // 头部（圆）
    { action: 'move', x: 'w*(4/12)', y: 'h*(1/8)' },
    { action: 'curve', x1: 'w*(4/12)', y1: '-h*(2/8)*(1/6)', x2: 'w*(8/12)', y2: '-h*(2/8)*(1/6)', x: 'w*(8/12)', y: 'h*(1/8)' },
    { action: 'curve', x1: 'w*(8/12)', y1: 'h*(2/8)*1/6+h*(2/8)', x2: 'w*(4/12)', y2: 'h*(2/8)*1/6+h*(2/8)', x: 'w*(4/12)', y: 'h*(1/8)' },
    // 身体（垂直线）
    { action: 'move', x: 'w*(6/12)', y: 'h*(2/8)' },
    { action: 'line', x: 'w*(6/12)', y: 'h*(6/8)' },
    // 左腿
    { action: 'move', x: 'w*(6/12)', y: 'h*(6/8)' },
    { action: 'line', x: 'w*(1/12)', y: 'h' },
    // 右腿
    { action: 'move', x: 'w*(6/12)', y: 'h*(6/8)' },
    { action: 'line', x: 'w*(11/12)', y: 'h' },
    // 手臂（水平线）
    { action: 'move', x: 0, y: 'h*(4/8)' },
    { action: 'line', x: 'w', y: 'h*(4/8)' },
  ]],
}

/** 用例（旧：100×70，椭圆） */
const useCase: ShapeDefinition = {
  name: 'useCase',
  title: '用例',
  category: 'uml_usecase',
  props: { w: 100, h: 70 },
  // 内联 round（椭圆）路径
  path: [[
    { action: 'move', x: 0, y: 'h/2' },
    { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
    { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
    { action: 'close' },
  ]],
}

/** 容器 — 大椭圆（旧：150×220） */
const ovalContainer: ShapeDefinition = {
  name: 'ovalContainer',
  title: '容器',
  category: 'uml_usecase',
  props: { w: 150, h: 220 },
  path: [[
    { action: 'move', x: 0, y: 'h/2' },
    { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
    { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
    { action: 'close' },
  ]],
}

/** 容器 — 大圆角矩形（旧：300×240） */
const rectangleContainer: ShapeDefinition = {
  name: 'rectangleContainer',
  title: '容器',
  category: 'uml_usecase',
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

// ═══════════════════════════════════════════
// 导出列表
// ═══════════════════════════════════════════

export const umlUsecaseShapes: ShapeDefinition[] = [
  actor,
  useCase,
  ovalContainer,
  rectangleContainer,
]
