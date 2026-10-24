import type { TemplateSpec } from '../types'

/** 服务工单流程图：工单提交、分派、处理、回访闭环，未解决时升级专家 */
export const serviceTicketTemplate: TemplateSpec = {
  id: 'service-ticket',
  title: '服务工单流程图',
  category: 'business',
  description: '客服工单全流程：受理分派、处理升级、回访关闭',
  keywords: ['工单', '客服', '分派', '升级', '回访'],
  page: { width: 1150, height: 950 },
  nodes: [
    { id: 'submit', shape: 'document', text: '提交服务工单', x: 415, y: 60, w: 170, h: 58, fill: '218,232,252' },
    { id: 'classify', shape: 'process', text: '分类并分派', x: 415, y: 180, w: 170, h: 58, fill: '218,232,252' },
    { id: 'handle', shape: 'process', text: '工程师处理', x: 415, y: 300, w: 170, h: 58, fill: '218,232,252' },
    { id: 'solved', shape: 'decision', text: '是否解决？', x: 410, y: 420, w: 180, h: 100, fill: '255,230,204' },
    { id: 'escalate', shape: 'process', text: '升级专家支持', x: 800, y: 441, w: 170, h: 58, fill: '255,242,204' },
    { id: 'revisit', shape: 'process', text: '客户回访', x: 415, y: 620, w: 170, h: 58, fill: '218,232,252' },
    { id: 'close', shape: 'process', text: '关闭工单', x: 415, y: 740, w: 170, h: 58, fill: '218,232,252' },
    { id: 'end', shape: 'terminator', text: '结束', x: 425, y: 860, w: 150, h: 56, fill: '213,232,212' },
  ],
  links: [
    { from: 'submit', to: 'classify', fromSide: 'bottom', toSide: 'top' },
    { from: 'classify', to: 'handle', fromSide: 'bottom', toSide: 'top' },
    { from: 'handle', to: 'solved', fromSide: 'bottom', toSide: 'top' },
    { from: 'solved', to: 'escalate', fromSide: 'right', toSide: 'left', text: '否', textOffset: { t: 0.5, normal: 14 } },
    { from: 'escalate', to: 'handle', fromSide: 'top', toSide: 'right', text: '升级处理', textOffset: { t: 0.5, normal: -14 } },
    { from: 'solved', to: 'revisit', fromSide: 'bottom', toSide: 'top', text: '是', textOffset: { t: 0.5, normal: 16 } },
    { from: 'revisit', to: 'close', fromSide: 'bottom', toSide: 'top' },
    { from: 'close', to: 'end', fromSide: 'bottom', toSide: 'top' },
  ],
}