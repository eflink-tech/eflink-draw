import type { PathDefinition, ShapeDefinition } from '@/types'

// 尺寸、锚点、textBlock、路径均取自旧版编辑器实现。
// 样式（边线 2px / 50,50,50、填充白、微软雅黑 13 号）由 registry 默认值兜底。

// 注：旧系统 3D 盒子侧面使用动态颜色 'r-25,g-25,b-25'（相对当前填充色），
// 新系统渲染器不支持颜色表达式，改为静态浅灰 '220,220,220'。

// ═══════════════════════════════════════════
// UML 部署图（6 个）
// ═══════════════════════════════════════════

// 组件图形通用路径（组件图标 + 接口槽）
function componentIconPath(): PathDefinition[] {
  return [
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
  ]
}

/** 组件（旧：100×70，加粗字体） */
const devComponentNonInstance: ShapeDefinition = {
  name: 'devComponentNonInstance',
  title: '组件',
  category: 'uml_deployment',
  attribute: { container: true },
  props: { w: 100, h: 70 },
  fontStyle: { bold: true },
  textBlock: [{ position: { x: 'w*(1/8)+5', y: 0, w: 'w-w*(1/8)-10', h: 'h' }, text: '组件' }],
  anchors: [
    { x: 'w*0.5', y: 0 },
    { x: 'w', y: 'h*0.5' },
    { x: 'w*0.5', y: 'h' },
    { x: 0, y: 'h*(3/10)' },
    { x: 0, y: 'h*(7/10)' },
  ],
  path: componentIconPath(),
}

/** 实例化组件（旧：100×70，下划线字体） */
const devComponent: ShapeDefinition = {
  name: 'devComponent',
  title: '实例化组件',
  category: 'uml_deployment',
  attribute: { container: true },
  props: { w: 100, h: 70 },
  fontStyle: { underline: true },
  textBlock: [{ position: { x: 'w*(1/8)+5', y: 0, w: 'w-w*(1/8)-10', h: 'h' }, text: '实例化组件' }],
  anchors: [
    { x: 'w*0.5', y: 0 },
    { x: 'w', y: 'h*0.5' },
    { x: 'w*0.5', y: 'h' },
    { x: 0, y: 'h*(3/10)' },
    { x: 0, y: 'h*(7/10)' },
  ],
  path: componentIconPath(),
}

// 3D 盒子通用路径（节点）
function nodeBoxPath(): PathDefinition[] {
  return [
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
  ]
}

/** 节点（旧：270×270，3D 盒子，加粗字体） */
const devNodeNonInstance: ShapeDefinition = {
  name: 'devNodeNonInstance',
  title: '节点',
  category: 'uml_deployment',
  attribute: { container: true },
  props: { w: 270, h: 270 },
  fontStyle: { bold: true },
  textBlock: [{ position: { x: 10, y: 'h*(1/9)', w: 'w*(8/9)-20', h: 'h*(8/9)' }, text: '节点' }],
  fillStyle: { type: 'solid', color: '220,220,220' },
  path: nodeBoxPath(),
}

/** 实例化节点（旧：270×270，3D 盒子，下划线字体） */
const devNodeInstance: ShapeDefinition = {
  name: 'devNodeInstance',
  title: '实例化节点',
  category: 'uml_deployment',
  attribute: { container: true },
  props: { w: 270, h: 270 },
  fontStyle: { underline: true },
  textBlock: [{ position: { x: 10, y: 'h*(1/9)', w: 'w*(8/9)-20', h: 'h*(8/9)' }, text: '实例化节点' }],
  fillStyle: { type: 'solid', color: '220,220,220' },
  path: nodeBoxPath(),
}

/** 对象（旧：100×70，矩形） */
const umlDeploymentObject: ShapeDefinition = {
  name: 'uml_deploymentObject',
  title: '对象',
  category: 'uml_deployment',
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

/** 约束（旧：110×70，花括号，linkable:false） */
const umlDeploymentConstraint: ShapeDefinition = {
  name: 'uml_deploymentConstraint',
  title: '约束',
  category: 'uml_deployment',
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

// ═══════════════════════════════════════════
// 导出列表
// ═══════════════════════════════════════════

export const umlDeploymentShapes: ShapeDefinition[] = [
  devComponentNonInstance,
  devComponent,
  devNodeNonInstance,
  devNodeInstance,
  umlDeploymentObject,
  umlDeploymentConstraint,
]
