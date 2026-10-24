import type { TemplateSpec } from '../types'

/** 泳道流程图：垂直泳道（列）按角色分工的采购付款流程 */
export const swimlaneTemplate: TemplateSpec = {
  id: 'swimlane',
  title: '泳道流程图',
  category: 'crossFunctional',
  description: '按角色/部门分泳道的跨职能流程，清晰展示每一步由谁负责',
  keywords: ['泳道图', '跨职能', '角色', '部门', '采购付款'],
  page: { width: 1300, height: 900 },
  nodes: [
    {
      id: 'lane',
      shape: 'swimlaneV',
      x: 40,
      y: 40,
      w: 1220,
      h: 800,
      laneCount: 4,
      // 泳道体不上色：连线渲染层在图形层下方，泳道体填充矩形会整片遮住泳道内连线；
      // 标题带与头格在连线活动区之上，着色不影响连线可见性
      laneHeadColors: ['208,226,248', '226,235,246', '208,226,248', '226,235,246'],
      titleColor: '223,235,250',
      texts: ['采购付款流程', '申请人', '主管', '财务', '系统'],
    },
    { id: 'apply', shape: 'process', text: '提交采购申请', x: 107, y: 160, w: 170, h: 56, fill: '218,232,252' },
    { id: 'approve', shape: 'process', text: '审批采购申请', x: 412, y: 270, w: 170, h: 56, fill: '218,232,252' },
    { id: 'verify', shape: 'process', text: '核对发票与合同', x: 717, y: 380, w: 170, h: 56, fill: '218,232,252' },
    { id: 'pay', shape: 'process', text: '执行付款', x: 717, y: 490, w: 170, h: 56, fill: '218,232,252' },
    { id: 'voucher', shape: 'process', text: '生成付款凭证', x: 1022, y: 600, w: 170, h: 56, fill: '218,232,252' },
    { id: 'notify', shape: 'process', text: '接收付款完成', x: 107, y: 710, w: 170, h: 56, fill: '218,232,252' },
  ],
  links: [
    { from: 'apply', to: 'approve', fromSide: 'bottom', toSide: 'top' },
    { from: 'approve', to: 'verify', fromSide: 'bottom', toSide: 'top' },
    { from: 'verify', to: 'pay', fromSide: 'bottom', toSide: 'top' },
    { from: 'pay', to: 'voucher', fromSide: 'bottom', toSide: 'top' },
    { from: 'voucher', to: 'notify', fromSide: 'bottom', toSide: 'top' },
  ],
}