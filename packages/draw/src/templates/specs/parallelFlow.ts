import type { TemplateSpec } from '../types'

/** 并行流程图：同步条分叉 + 汇合，两分支并行推进 */
export const parallelFlowTemplate: TemplateSpec = {
  id: 'parallel-flow',
  title: '并行流程图',
  category: 'basic',
  description: '用同步条分叉并行执行多个分支，全部完成后汇合继续',
  keywords: ['并行', '同步', '分叉', '汇合', '并发'],
  page: { width: 1150, height: 850 },
  nodes: [
    { id: 'start', shape: 'terminator', text: '开始', x: 500, y: 60, w: 150, h: 56, fill: '213,232,212' },
    { id: 'fork', shape: 'Synchronization', x: 515, y: 160, w: 120, h: 20 },
    { id: 'branchA', shape: 'process', text: '发送短信通知', x: 215, y: 300, w: 170, h: 58, fill: '218,232,252' },
    { id: 'branchB', shape: 'process', text: '生成电子发票', x: 740, y: 300, w: 170, h: 58, fill: '218,232,252' },
    { id: 'join', shape: 'Synchronization', x: 515, y: 480, w: 120, h: 20 },
    { id: 'archive', shape: 'process', text: '归档订单', x: 490, y: 560, w: 170, h: 58, fill: '218,232,252' },
    { id: 'end', shape: 'terminator', text: '结束', x: 500, y: 720, w: 150, h: 56, fill: '213,232,212' },
  ],
  links: [
    { from: 'start', to: 'fork', fromSide: 'bottom', toSide: 'top' },
    { from: 'fork', to: 'branchA', fromSide: 'left', toSide: 'right' },
    { from: 'fork', to: 'branchB', fromSide: 'right', toSide: 'left' },
    { from: 'branchA', to: 'join', fromSide: 'bottom', toSide: 'left' },
    { from: 'branchB', to: 'join', fromSide: 'bottom', toSide: 'right' },
    { from: 'join', to: 'archive', fromSide: 'bottom', toSide: 'top' },
    { from: 'archive', to: 'end', fromSide: 'bottom', toSide: 'top' },
  ],
}