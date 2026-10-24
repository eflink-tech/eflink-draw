import type { TemplateSpec } from '../types'

/** BPMN 业务流程：请假审批（开始/结束事件 + 任务 + 排他网关） */
export const bpmnProcessTemplate: TemplateSpec = {
  id: 'bpmn-process',
  title: 'BPMN 业务流程',
  category: 'business',
  description: '标准 BPMN 元素（事件/任务/网关）表达的审批流程，以请假审批为例',
  keywords: ['BPMN', '业务流程', '审批', '网关', '请假'],
  page: { width: 1300, height: 900 },
  nodes: [
    { id: 'start', shape: 'startEvent', x: 600, y: 80 },
    { id: 'apply', shape: 'task', text: '提交请假申请', x: 545, y: 170, w: 150, h: 70, fill: '218,232,252' },
    { id: 'approve', shape: 'task', text: '直属主管审批', x: 545, y: 300, w: 150, h: 70, fill: '218,232,252' },
    { id: 'gw', shape: 'bpmnGateway', text: '同意？', x: 595, y: 430, fill: '255,230,204' },
    { id: 'hr', shape: 'task', text: '人事备案', x: 545, y: 570, w: 150, h: 70, fill: '218,232,252' },
    { id: 'reject', shape: 'task', text: '驳回并说明原因', x: 950, y: 420, w: 150, h: 70, fill: '248,206,204' },
    { id: 'end', shape: 'endEvent', x: 600, y: 700 },
  ],
  links: [
    { from: 'start', to: 'apply', fromSide: 'bottom', toSide: 'top' },
    { from: 'apply', to: 'approve', fromSide: 'bottom', toSide: 'top' },
    { from: 'approve', to: 'gw', fromSide: 'bottom', toSide: 'top' },
    { from: 'gw', to: 'hr', fromSide: 'bottom', toSide: 'top', text: '是', textOffset: { t: 0.5, normal: 16 } },
    { from: 'gw', to: 'reject', fromSide: 'right', toSide: 'left', text: '否', textOffset: { t: 0.5, normal: 14 } },
    { from: 'reject', to: 'end', fromSide: 'bottom', toSide: 'right' },
    { from: 'hr', to: 'end', fromSide: 'bottom', toSide: 'top' },
  ],
}