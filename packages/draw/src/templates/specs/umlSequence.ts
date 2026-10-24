import type { TemplateSpec } from '../types'

/** UML 时序图：账号登录（角色生命线 + 生命线 + 激活条 + 同步/返回消息） */
export const umlSequenceTemplate: TemplateSpec = {
  id: 'uml-sequence',
  title: 'UML 时序图',
  category: 'uml',
  description: '角色与系统间的交互时序，含同步消息与返回消息，以登录流程为例',
  keywords: ['UML', '时序图', '顺序图', '生命线', '消息', '登录'],
  page: { width: 1200, height: 850 },
  nodes: [
    { id: 'user', shape: 'sequenceActorLifeLine', text: '用户', x: 225, y: 60, w: 90, h: 690 },
    { id: 'fe', shape: 'sequenceLifeLine', text: '前端', x: 445, y: 60, w: 90, h: 690 },
    { id: 'auth', shape: 'sequenceLifeLine', text: '认证服务', x: 665, y: 60, w: 90, h: 690 },
    { id: 'db', shape: 'sequenceLifeLine', text: '数据库', x: 885, y: 60, w: 90, h: 690 },
    { id: 'actFe', shape: 'sequenceActivation', x: 475, y: 160, h: 350 },
    { id: 'actAuth', shape: 'sequenceActivation', x: 695, y: 230, h: 220 },
  ],
  links: [
    {
      from: 'user', to: 'actFe', text: '输入账号密码',
      seq: { y: 180, fromDir: 0, toDir: -1 },
    },
    {
      from: 'actFe', to: 'actAuth', text: '提交登录请求',
      seq: { y: 240, fromDir: 1, toDir: -1 },
    },
    {
      from: 'actAuth', to: 'db', text: '查询用户信息',
      seq: { y: 300, fromDir: 1, toDir: 0 },
    },
    {
      from: 'db', to: 'actAuth', text: '返回用户信息', dashed: true, endArrow: 'normal',
      seq: { y: 360, fromDir: 0, toDir: 1 },
    },
    {
      from: 'actAuth', to: 'actFe', text: '返回登录 Token', dashed: true, endArrow: 'normal',
      seq: { y: 420, fromDir: -1, toDir: 1 },
    },
    {
      from: 'actFe', to: 'user', text: '登录成功', dashed: true, endArrow: 'normal',
      seq: { y: 480, fromDir: -1, toDir: 0 },
    },
  ],
}