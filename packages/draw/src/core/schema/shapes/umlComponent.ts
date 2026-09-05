import type { ShapeDefinition } from '@/types'

// 尺寸、锚点、textBlock、路径均取自旧版编辑器实现。
// 样式（边线 2px / 50,50,50、填充白、微软雅黑 13 号）由 registry 默认值兜底。

// 注：旧系统 3D 盒子侧面使用动态颜色 'r-25,g-25,b-25'（相对当前填充色），
// 新系统渲染器不支持颜色表达式，改为静态浅灰 '220,220,220'。

// ═══════════════════════════════════════════
// UML 组件图（3 个）
// ═══════════════════════════════════════════

/** 组件（旧：100×70，组件图标 + 接口槽） */
const component: ShapeDefinition = {
  name: 'component',
  title: '组件',
  category: 'uml_component',
  attribute: { container: true },
  props: { w: 100, h: 70 },
  textBlock: [{ position: { x: 'w*(1/8)+5', y: 0, w: 'w-w*(1/8)-10', h: 'h' }, text: '' }],
  anchors: [
    { x: 'w*0.5', y: 0 },
    { x: 'w', y: 'h*0.5' },
    { x: 'w*0.5', y: 'h' },
    { x: 0, y: 'h*(3/10)' },
    { x: 0, y: 'h*(7/10)' },
  ],
  path: [
    // 外轮廓（含接口槽缺口）
    [
      { action: 'move', x: 'w*(1/10)', y: 0 },
      { action: 'line', x: 'w', y: 0 },
      { action: 'line', x: 'w', y: 'h' },
      { action: 'line', x: 'w*(1/10)', y: 'h' },
      { action: 'line', x: 'w*(2/10)*0.5', y: 'h*(8/10)' },
      { action: 'line', x: 0, y: 'h*(8/10)' },
      { action: 'line', x: 0, y: 'h*(6/10)' },
      { action: 'line', x: 'w*(2/10)*0.5', y: 'h*(6/10)' },
      { action: 'line', x: 'w*(2/10)*0.5', y: 'h*(4/10)' },
      { action: 'line', x: 0, y: 'h*(4/10)' },
      { action: 'line', x: 0, y: 'h*(2/10)' },
      { action: 'line', x: 'w*(2/10)*0.5', y: 'h*(2/10)' },
      { action: 'line', x: 'w*(1/10)', y: 0 },
      { action: 'close' },
    ],
    // 接口槽内部线
    [
      { action: 'move', x: 'w*(2/10)*0.5', y: 'h*(8/10)' },
      { action: 'line', x: 'w*(2/10)', y: 'h*(8/10)' },
      { action: 'line', x: 'w*(2/10)', y: 'h*(6/10)' },
      { action: 'line', x: 'w*(2/10)*0.5', y: 'h*(6/10)' },
      { action: 'move', x: 'w*(2/10)*0.5', y: 'h*(4/10)' },
      { action: 'line', x: 'w*(2/10)', y: 'h*(4/10)' },
      { action: 'line', x: 'w*(2/10)', y: 'h*(2/10)' },
      { action: 'line', x: 'w*(2/10)*0.5', y: 'h*(2/10)' },
    ],
  ],
}

/** 节点（旧：270×270，3D 盒子） */
const componentNodeNonInstance: ShapeDefinition = {
  name: 'componentNodeNonInstance',
  title: '节点',
  category: 'uml_component',
  attribute: { container: true },
  props: { w: 270, h: 270 },
  textBlock: [{ position: { x: 10, y: 'h*(1/9)', w: 'w*(8/9)-20', h: 'h*(8/9)' }, text: '' }],
  fillStyle: { type: 'solid', color: '220,220,220' },
  path: [
    // 正面
    [
      { action: 'move', x: 0, y: 'h*(1/9)' },
      { action: 'line', x: 'w*(8/9)', y: 'h*(1/9)' },
      { action: 'line', x: 'w*(8/9)', y: 'h' },
      { action: 'line', x: 0, y: 'h' },
      { action: 'line', x: 0, y: 'h*(1/9)' },
      { action: 'close' },
    ],
    // 3D 侧面（含对角线）
    [
      { action: 'move', x: 0, y: 'h*(1/9)' },
      { action: 'line', x: 'w*(1/9)', y: 0 },
      { action: 'line', x: 'w', y: 0 },
      { action: 'line', x: 'w', y: 'h*(8/9)' },
      { action: 'line', x: 'w*(8/9)', y: 'h' },
      { action: 'line', x: 'w*(8/9)', y: 'h*(1/9)' },
      { action: 'line', x: 0, y: 'h*(1/9)' },
      { action: 'close' },
      { action: 'move', x: 'w*(8/9)', y: 'h*(1/9)' },
      { action: 'line', x: 'w', y: 0 },
    ],
  ],
}

/** 接口（旧：40×40，圆形） */
const componentStart: ShapeDefinition = {
  name: 'componentStart',
  title: '接口',
  category: 'uml_component',
  props: { w: 40, h: 40 },
  textBlock: [{ position: { x: -20, y: 'h', w: 'w+40', h: 30 }, text: '' }],
  // 内联 round（圆）路径
  path: [[
    { action: 'move', x: 0, y: 'h/2' },
    { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
    { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
    { action: 'close' },
  ]],
}

// ═══════════════════════════════════════════
// 导出列表
// ═══════════════════════════════════════════

export const umlComponentShapes: ShapeDefinition[] = [
  component,
  componentNodeNonInstance,
  componentStart,
]
