import type { TemplateSpec } from '../types'

/** 审批流程图：垂直泳道按角色分工的费用报销审批 */
export const approvalFlowTemplate: TemplateSpec = {
  id: 'approval-flow',
  title: '审批流程图',
  category: 'crossFunctional',
  description: '带预算判断分支的审批流，泳道展示申请、审批、财务三方职责',
  keywords: ['审批', '报销', '预算', '泳道', '职责'],
  page: { width: 1220, height: 860 },
  nodes: [
    {
      id: 'lane',
      shape: 'swimlaneV',
      x: 40,
      y: 40,
      w: 1140,
      h: 780,
      laneCount: 3,
      // 泳道体不上色：连线渲染层在图形层下方，泳道体填充矩形会整片遮住泳道内连线
      laneHeadColors: ['208,226,248', '226,235,246', '208,226,248'],
      titleColor: '223,235,250',
      texts: ['费用报销审批', '申请人', '部门主管', '财务'],
    },
    { id: 'apply', shape: 'process', text: '提交报销单', x: 145, y: 150, w: 170, h: 56, fill: '218,232,252' },
    { id: 'approve', shape: 'decision', text: '是否超预算？', x: 520, y: 300, w: 180, h: 100, fill: '255,230,204' },
    { id: 'reject', shape: 'process', text: '驳回申请', x: 145, y: 322, w: 170, h: 56, fill: '248,206,204' },
    { id: 'finance', shape: 'process', text: '财务复核', x: 905, y: 322, w: 170, h: 56, fill: '218,232,252' },
    { id: 'pay', shape: 'process', text: '财务打款', x: 905, y: 450, w: 170, h: 56, fill: '255,242,204' },
    { id: 'notify', shape: 'process', text: '通知申请人', x: 145, y: 610, w: 170, h: 56, fill: '218,232,252' },
  ],
  links: [
    { from: 'apply', to: 'approve', fromSide: 'bottom', toSide: 'top' },
    { from: 'approve', to: 'reject', fromSide: 'left', toSide: 'right', text: '超预算', textOffset: { t: 0.5, normal: -14 } },
    { from: 'approve', to: 'finance', fromSide: 'right', toSide: 'left', text: '未超预算', textOffset: { t: 0.5, normal: 14 } },
    { from: 'reject', to: 'notify', fromSide: 'bottom', toSide: 'top' },
    { from: 'finance', to: 'pay', fromSide: 'bottom', toSide: 'top' },
    { from: 'pay', to: 'notify', fromSide: 'bottom', toSide: 'right' },
  ],
}