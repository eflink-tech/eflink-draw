import type { TemplateSpec } from '../types'

/** 数据流图(DFD)：外部实体、加工过程与数据存储之间的数据流向 */
export const dfdFlowTemplate: TemplateSpec = {
  id: 'dfd-flow',
  title: '数据流图(DFD)',
  category: 'system',
  description: '以外部实体、加工、数据存储三要素刻画数据在系统中的流动',
  keywords: ['数据流', 'DFD', '实体', '数据存储', '加工'],
  page: { width: 1250, height: 680 },
  nodes: [
    { id: 'customer', shape: 'rectangle', text: '客户', x: 80, y: 371, w: 170, h: 58, fill: '225,232,240' },
    { id: 'verify', shape: 'round', text: '订单校验', x: 330, y: 330, w: 140, h: 140, fill: '218,232,252' },
    { id: 'catalog', shape: 'storedData', text: '商品目录', x: 620, y: 271, w: 180, h: 58, fill: '255,242,204' },
    { id: 'orders', shape: 'storedData', text: '订单表', x: 620, y: 471, w: 180, h: 58, fill: '255,242,204' },
    { id: 'warehouse', shape: 'rectangle', text: '仓库系统', x: 990, y: 371, w: 170, h: 58, fill: '225,232,240' },
  ],
  links: [
    { from: 'customer', to: 'verify', fromSide: 'right', toSide: 'left', text: '订单', textOffset: { t: 0.5, normal: 14 } },
    { from: 'verify', to: 'catalog', fromSide: 'top', toSide: 'left', text: '查询商品', textOffset: { t: 0.5, normal: 14 } },
    { from: 'verify', to: 'orders', fromSide: 'bottom', toSide: 'left', text: '写入订单', textOffset: { t: 0.5, normal: 14 } },
    { from: 'orders', to: 'warehouse', fromSide: 'right', toSide: 'left', text: '读取订单', textOffset: { t: 0.5, normal: 16 } },
  ],
}