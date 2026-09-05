import type { Template } from './types'

export const BUILTIN_TEMPLATES: Template[] = [
  {
    id: 'tpl-order',
    name: '订单处理流程',
    description: '下单、支付、发货、收货、退款',
    icon: '🛒',
    prompt: '生成订单处理流程：下单 → 支付 → 发货 → 收货，包含退款分支。用 flowStart/flowProcess/flowDecision/flowEnd 图形。',
    builtin: 1,
  },
  {
    id: 'tpl-microservice',
    name: '微服务架构',
    description: 'API 网关、服务注册、负载均衡',
    icon: '🏗️',
    prompt: '生成微服务架构图：客户端 → API 网关 → 多个微服务（用户服务、订单服务、支付服务）→ 服务注册中心。',
    builtin: 1,
  },
  {
    id: 'tpl-approval',
    name: '审批流程',
    description: '提交、审批、驳回、通过',
    icon: '📋',
    prompt: '生成审批流程：提交申请 → 主管审批（决策点）→ 通过/驳回。',
    builtin: 1,
  },
  {
    id: 'tpl-cicd',
    name: 'CI/CD 流水线',
    description: '代码提交、构建、测试、部署',
    icon: '🔄',
    prompt: '生成 CI/CD 流水线：代码提交 → 构建 → 单元测试 → 集成测试 → 部署到测试环境 → 部署到生产环境。',
    builtin: 1,
  },
  {
    id: 'tpl-register',
    name: '用户注册流程',
    description: '填写信息、验证邮箱、激活账号',
    icon: '👥',
    prompt: '生成用户注册流程：填写表单 → 验证邮箱（决策点）→ 激活成功/发送验证邮件。',
    builtin: 1,
  },
]
