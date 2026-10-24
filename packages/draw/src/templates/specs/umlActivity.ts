import type { TemplateSpec } from '../types'

/** UML活动图：起点/终点 + 圆角动作 + 同步条分叉汇合 */
export const umlActivityTemplate: TemplateSpec = {
  id: 'uml-activity',
  title: 'UML活动图',
  category: 'uml',
  description: 'UML 活动图：动作节点、判断分支与并发分叉汇合的完整表达',
  keywords: ['UML', '活动图', '动作', '并发', '分叉'],
  page: { width: 1200, height: 950 },
  nodes: [
    { id: 'start', shape: 'umlStart', x: 520, y: 60, w: 40, h: 40 },
    { id: 'act1', shape: 'roundRectangle', text: '接收订单', x: 455, y: 150, w: 170, h: 58, fill: '218,232,252' },
    { id: 'check', shape: 'decision', text: '库存充足？', x: 450, y: 270, w: 180, h: 100, fill: '255,230,204' },
    { id: 'reject', shape: 'roundRectangle', text: '缺货登记', x: 855, y: 291, w: 170, h: 58, fill: '248,206,204' },
    { id: 'fork', shape: 'Synchronization', x: 480, y: 430, w: 120, h: 20 },
    { id: 'actA', shape: 'roundRectangle', text: '扣减库存', x: 235, y: 520, w: 170, h: 58, fill: '218,232,252' },
    { id: 'actB', shape: 'roundRectangle', text: '生成发货单', x: 715, y: 520, w: 170, h: 58, fill: '218,232,252' },
    { id: 'join', shape: 'Synchronization', x: 480, y: 650, w: 120, h: 20 },
    { id: 'notify', shape: 'roundRectangle', text: '通知客户', x: 455, y: 730, w: 170, h: 58, fill: '218,232,252' },
    { id: 'end', shape: 'umlEnd', x: 520, y: 850, w: 40, h: 40 },
  ],
  links: [
    { from: 'start', to: 'act1', fromSide: 'bottom', toSide: 'top' },
    { from: 'act1', to: 'check', fromSide: 'bottom', toSide: 'top' },
    { from: 'check', to: 'reject', fromSide: 'right', toSide: 'left', text: '否', textOffset: { t: 0.5, normal: 14 } },
    { from: 'check', to: 'fork', fromSide: 'bottom', toSide: 'top', text: '是', textOffset: { t: 0.5, normal: 16 } },
    { from: 'fork', to: 'actA', fromSide: 'left', toSide: 'top' },
    { from: 'fork', to: 'actB', fromSide: 'right', toSide: 'top' },
    { from: 'actA', to: 'join', fromSide: 'bottom', toSide: 'left' },
    { from: 'actB', to: 'join', fromSide: 'bottom', toSide: 'right' },
    { from: 'join', to: 'notify', fromSide: 'bottom', toSide: 'top' },
    { from: 'reject', to: 'notify', fromSide: 'bottom', toSide: 'right' },
    { from: 'notify', to: 'end', fromSide: 'bottom', toSide: 'top' },
  ],
}