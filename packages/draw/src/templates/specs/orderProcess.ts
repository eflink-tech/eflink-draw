import type { TemplateSpec } from '../types'

/** 订单处理流程图：下单支付主链路 + 支付失败取消退款分支 */
export const orderProcessTemplate: TemplateSpec = {
  id: 'order-process',
  title: '订单处理流程图',
  category: 'business',
  description: '电商订单主流程：下单支付发货，支付失败走取消退款闭环',
  keywords: ['订单', '电商', '支付', '发货', '退款'],
  page: { width: 1250, height: 900 },
  nodes: [
    { id: 'start', shape: 'terminator', text: '顾客下单', x: 485, y: 60, w: 150, h: 56, fill: '213,232,212' },
    { id: 'create', shape: 'process', text: '生成订单', x: 475, y: 170, w: 170, h: 58, fill: '218,232,252' },
    { id: 'pay', shape: 'process', text: '支付订单', x: 475, y: 280, w: 170, h: 58, fill: '255,242,204' },
    { id: 'paid', shape: 'decision', text: '支付成功？', x: 470, y: 400, w: 180, h: 100, fill: '255,230,204' },
    { id: 'ship', shape: 'process', text: '仓库发货', x: 475, y: 540, w: 170, h: 58, fill: '218,232,252' },
    { id: 'receive', shape: 'process', text: '确认收货', x: 475, y: 650, w: 170, h: 58, fill: '218,232,252' },
    { id: 'done', shape: 'terminator', text: '交易完成', x: 485, y: 770, w: 150, h: 56, fill: '213,232,212' },
    { id: 'cancel', shape: 'process', text: '取消订单', x: 900, y: 421, w: 170, h: 58, fill: '248,206,204' },
    { id: 'refund', shape: 'process', text: '退款处理', x: 900, y: 540, w: 170, h: 58, fill: '248,206,204' },
    { id: 'closed', shape: 'terminator', text: '订单关闭', x: 910, y: 660, w: 150, h: 56, fill: '225,232,240' },
  ],
  links: [
    { from: 'start', to: 'create', fromSide: 'bottom', toSide: 'top' },
    { from: 'create', to: 'pay', fromSide: 'bottom', toSide: 'top' },
    { from: 'pay', to: 'paid', fromSide: 'bottom', toSide: 'top' },
    { from: 'paid', to: 'cancel', fromSide: 'right', toSide: 'left', text: '失败', textOffset: { t: 0.5, normal: 14 } },
    { from: 'paid', to: 'ship', fromSide: 'bottom', toSide: 'top', text: '成功', textOffset: { t: 0.5, normal: 16 } },
    { from: 'cancel', to: 'refund', fromSide: 'bottom', toSide: 'top' },
    { from: 'refund', to: 'closed', fromSide: 'bottom', toSide: 'top' },
    { from: 'ship', to: 'receive', fromSide: 'bottom', toSide: 'top' },
    { from: 'receive', to: 'done', fromSide: 'bottom', toSide: 'top' },
  ],
}