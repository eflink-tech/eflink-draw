import type { TemplateSpec } from '../types'

/** 系统流程图：客户端请求经网关鉴权后到达业务服务与数据层 */
export const systemFlowTemplate: TemplateSpec = {
  id: 'system-flow',
  title: '系统流程图',
  category: 'system',
  description: '典型服务端链路：客户端、网关、鉴权、业务服务与缓存数据库',
  keywords: ['系统', '架构', '网关', '鉴权', '缓存', '数据库'],
  page: { width: 1250, height: 780 },
  nodes: [
    { id: 'client', shape: 'process', text: '客户端请求', x: 480, y: 60, w: 170, h: 58, fill: '225,232,240' },
    { id: 'gateway', shape: 'process', text: 'API 网关', x: 480, y: 180, w: 170, h: 58, fill: '218,232,252' },
    { id: 'auth', shape: 'process', text: '认证鉴权', x: 480, y: 300, w: 170, h: 58, fill: '218,232,252' },
    { id: 'biz', shape: 'process', text: '业务服务', x: 480, y: 420, w: 170, h: 58, fill: '218,232,252' },
    { id: 'cache', shape: 'directData', text: '缓存', x: 850, y: 289, w: 170, h: 80, fill: '255,242,204' },
    { id: 'db', shape: 'directData', text: '数据库', x: 850, y: 540, w: 170, h: 80, fill: '255,242,204' },
  ],
  links: [
    { from: 'client', to: 'gateway', fromSide: 'bottom', toSide: 'top' },
    { from: 'gateway', to: 'auth', fromSide: 'bottom', toSide: 'top' },
    { from: 'auth', to: 'biz', fromSide: 'bottom', toSide: 'top' },
    { from: 'auth', to: 'cache', fromSide: 'right', toSide: 'left', text: '查询缓存', textOffset: { t: 0.5, normal: 14 } },
    { from: 'cache', to: 'db', fromSide: 'bottom', toSide: 'top', text: '未命中查库', textOffset: { t: 0.5, normal: 16 } },
    { from: 'biz', to: 'db', fromSide: 'right', toSide: 'left', text: '读写数据', textOffset: { t: 0.5, normal: 16 } },
  ],
}