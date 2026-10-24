import type { TemplateSpec } from '../types'

/** 异常处理流程图：主流程校验失败转入捕获异常与事务回滚，再重试 */
export const exceptionFlowTemplate: TemplateSpec = {
  id: 'exception-flow',
  title: '异常处理流程图',
  category: 'business',
  description: '带异常分支与回滚重试的数据处理流程，故障可恢复',
  keywords: ['异常', '容错', '回滚', '重试', '日志'],
  page: { width: 1200, height: 820 },
  nodes: [
    { id: 'start', shape: 'terminator', text: '开始', x: 465, y: 60, w: 150, h: 56, fill: '213,232,212' },
    { id: 'read', shape: 'process', text: '读取数据', x: 455, y: 180, w: 170, h: 58, fill: '218,232,252' },
    { id: 'process', shape: 'process', text: '处理数据', x: 455, y: 300, w: 170, h: 58, fill: '218,232,252' },
    { id: 'check', shape: 'decision', text: '处理成功？', x: 450, y: 420, w: 180, h: 100, fill: '255,230,204' },
    { id: 'ok', shape: 'process', text: '保存结果', x: 455, y: 560, w: 170, h: 58, fill: '218,232,252' },
    { id: 'end', shape: 'terminator', text: '结束', x: 465, y: 680, w: 150, h: 56, fill: '213,232,212' },
    { id: 'rollback', shape: 'process', text: '事务回滚', x: 890, y: 300, w: 170, h: 58, fill: '248,206,204' },
    { id: 'catch', shape: 'process', text: '捕获异常', x: 890, y: 441, w: 170, h: 58, fill: '248,206,204' },
  ],
  links: [
    { from: 'start', to: 'read', fromSide: 'bottom', toSide: 'top' },
    { from: 'read', to: 'process', fromSide: 'bottom', toSide: 'top' },
    { from: 'process', to: 'check', fromSide: 'bottom', toSide: 'top' },
    { from: 'check', to: 'catch', fromSide: 'right', toSide: 'left', text: '否', textOffset: { t: 0.5, normal: 14 } },
    { from: 'catch', to: 'rollback', fromSide: 'top', toSide: 'bottom' },
    { from: 'rollback', to: 'process', fromSide: 'left', toSide: 'right', text: '回滚后重试', textOffset: { t: 0.5, normal: -14 } },
    { from: 'check', to: 'ok', fromSide: 'bottom', toSide: 'top', text: '是', textOffset: { t: 0.5, normal: 16 } },
    { from: 'ok', to: 'end', fromSide: 'bottom', toSide: 'top' },
  ],
}