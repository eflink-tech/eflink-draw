import type { TemplateSpec } from '../types'

/** 决策流程图：金额分级审批决策树（两连判断 + 三路汇合打款） */
export const decisionTreeTemplate: TemplateSpec = {
  id: 'decision-tree',
  title: '决策流程图',
  category: 'basic',
  description: '多分支决策树，按条件逐级判断并分流到不同处理路径',
  keywords: ['决策', '判断', '分支', '条件', '报销审批'],
  page: { width: 1150, height: 1000 },
  nodes: [
    { id: 'start', shape: 'terminator', text: '开始', x: 450, y: 60, w: 150, h: 56, fill: '213,232,212' },
    { id: 'submit', shape: 'process', text: '提交报销单', x: 440, y: 180, w: 170, h: 58, fill: '218,232,252' },
    { id: 'd1', shape: 'decision', text: '金额>5000？', x: 435, y: 300, w: 180, h: 100, fill: '255,230,204' },
    { id: 'finance', shape: 'process', text: '财务复核', x: 835, y: 321, w: 170, h: 58, fill: '218,232,252' },
    { id: 'd2', shape: 'decision', text: '金额>1000？', x: 435, y: 480, w: 180, h: 100, fill: '255,230,204' },
    { id: 'dept', shape: 'process', text: '主管审批', x: 140, y: 501, w: 170, h: 58, fill: '218,232,252' },
    { id: 'auto', shape: 'process', text: '自动批准', x: 440, y: 660, w: 170, h: 58, fill: '218,232,252' },
    { id: 'pay', shape: 'process', text: '财务打款', x: 440, y: 790, w: 170, h: 58, fill: '255,242,204' },
    { id: 'end', shape: 'terminator', text: '结束', x: 450, y: 930, w: 150, h: 56, fill: '213,232,212' },
  ],
  links: [
    { from: 'start', to: 'submit', fromSide: 'bottom', toSide: 'top' },
    { from: 'submit', to: 'd1', fromSide: 'bottom', toSide: 'top' },
    { from: 'd1', to: 'finance', fromSide: 'right', toSide: 'left', text: '是', textOffset: { t: 0.5, normal: 14 } },
    { from: 'd1', to: 'd2', fromSide: 'bottom', toSide: 'top', text: '否', textOffset: { t: 0.5, normal: 16 } },
    { from: 'd2', to: 'dept', fromSide: 'left', toSide: 'right', text: '是', textOffset: { t: 0.5, normal: -14 } },
    { from: 'd2', to: 'auto', fromSide: 'bottom', toSide: 'top', text: '否', textOffset: { t: 0.5, normal: 16 } },
    { from: 'finance', to: 'pay', fromSide: 'bottom', toSide: 'right' },
    { from: 'dept', to: 'pay', fromSide: 'bottom', toSide: 'left' },
    { from: 'auto', to: 'pay', fromSide: 'bottom', toSide: 'top' },
    { from: 'pay', to: 'end', fromSide: 'bottom', toSide: 'top' },
  ],
}