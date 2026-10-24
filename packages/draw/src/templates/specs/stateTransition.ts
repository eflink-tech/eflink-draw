import type { TemplateSpec } from '../types'

/** 状态转换图：订单状态机（开始/结束 + 状态 + 迁移标注） */
export const stateTransitionTemplate: TemplateSpec = {
  id: 'state-transition',
  title: '状态转换图',
  category: 'uml',
  description: '描述对象在生命周期内的状态迁移与触发条件，以订单状态为例',
  keywords: ['状态图', '状态机', '状态转换', 'UML', '订单'],
  page: { width: 1100, height: 850 },
  nodes: [
    { id: 'start', shape: 'umlStart', x: 370, y: 90 },
    { id: 'pending', shape: 'umlState', x: 330, y: 170, texts: ['待付款', 'entry / 生成订单'] },
    { id: 'paid', shape: 'umlState', x: 330, y: 310, texts: ['已付款', 'entry / 记录支付'] },
    { id: 'shipped', shape: 'umlState', x: 330, y: 450, texts: ['已发货', 'entry / 出库发货'] },
    { id: 'done', shape: 'umlState', x: 330, y: 590, texts: ['已完成', 'entry / 完成交易'] },
    { id: 'closed', shape: 'umlState', x: 650, y: 310, texts: ['交易关闭', 'entry / 释放库存'] },
    { id: 'end', shape: 'umlEnd', x: 370, y: 730 },
  ],
  links: [
    { from: 'start', to: 'pending', fromSide: 'bottom', toSide: 'top' },
    { from: 'pending', to: 'paid', fromSide: 'bottom', toSide: 'top', text: '支付成功', textOffset: { t: 0.5, normal: 16 } },
    { from: 'paid', to: 'shipped', fromSide: 'bottom', toSide: 'top', text: '商家发货', textOffset: { t: 0.5, normal: 16 } },
    { from: 'shipped', to: 'done', fromSide: 'bottom', toSide: 'top', text: '确认收货', textOffset: { t: 0.5, normal: 16 } },
    { from: 'done', to: 'end', fromSide: 'bottom', toSide: 'top' },
    { from: 'pending', to: 'closed', fromSide: 'right', toSide: 'top', text: '超时未支付', textOffset: { t: 0.5, normal: 14 } },
    { from: 'paid', to: 'closed', fromSide: 'right', toSide: 'left', text: '申请退款', textOffset: { t: 0.5, normal: 14 } },
    { from: 'closed', to: 'end', fromSide: 'bottom', toSide: 'right' },
  ],
}