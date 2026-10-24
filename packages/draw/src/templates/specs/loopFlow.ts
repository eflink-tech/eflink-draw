import type { TemplateSpec } from '../types'

/** 循环流程图：主流程下探 + 右侧回补，形成"校验-修正-重试"闭环 */
export const loopFlowTemplate: TemplateSpec = {
  id: 'loop-flow',
  title: '循环流程图',
  category: 'basic',
  description: '含重试回路的循环流程，条件不满足时回到上游步骤重新执行',
  keywords: ['循环', '重试', '回路', '迭代', '校验'],
  page: { width: 1150, height: 900 },
  nodes: [
    { id: 'start', shape: 'terminator', text: '开始', x: 425, y: 60, w: 150, h: 56, fill: '213,232,212' },
    { id: 'init', shape: 'process', text: '初始化数据源', x: 415, y: 180, w: 170, h: 58, fill: '218,232,252' },
    { id: 'read', shape: 'process', text: '读取数据', x: 415, y: 300, w: 170, h: 58, fill: '218,232,252' },
    { id: 'check', shape: 'decision', text: '数据校验通过？', x: 410, y: 420, w: 180, h: 100, fill: '255,230,204' },
    { id: 'fix', shape: 'process', text: '修正数据错误', x: 800, y: 441, w: 170, h: 58, fill: '248,206,204' },
    { id: 'output', shape: 'process', text: '输出结果', x: 415, y: 620, w: 170, h: 58, fill: '218,232,252' },
    { id: 'end', shape: 'terminator', text: '结束', x: 425, y: 780, w: 150, h: 56, fill: '213,232,212' },
  ],
  links: [
    { from: 'start', to: 'init', fromSide: 'bottom', toSide: 'top' },
    { from: 'init', to: 'read', fromSide: 'bottom', toSide: 'top' },
    { from: 'read', to: 'check', fromSide: 'bottom', toSide: 'top' },
    { from: 'check', to: 'fix', fromSide: 'right', toSide: 'left', text: '否', textOffset: { t: 0.5, normal: 14 } },
    { from: 'fix', to: 'read', fromSide: 'top', toSide: 'right', text: '重试', textOffset: { t: 0.5, normal: -14 } },
    { from: 'check', to: 'output', fromSide: 'bottom', toSide: 'top', text: '是', textOffset: { t: 0.5, normal: 16 } },
    { from: 'output', to: 'end', fromSide: 'bottom', toSide: 'top' },
  ],
}