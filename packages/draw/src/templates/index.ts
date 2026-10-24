import type { TemplateCategory, TemplateSpec } from './types'
import { basicFlowTemplate } from './specs/basicFlow'
import { swimlaneTemplate } from './specs/swimlane'
import { bpmnProcessTemplate } from './specs/bpmnProcess'
import { decisionTreeTemplate } from './specs/decisionTree'
import { systemFlowTemplate } from './specs/systemFlow'
import { dfdFlowTemplate } from './specs/dfdFlow'
import { umlActivityTemplate } from './specs/umlActivity'
import { umlSequenceTemplate } from './specs/umlSequence'
import { linearStepsTemplate } from './specs/linearSteps'
import { loopFlowTemplate } from './specs/loopFlow'
import { parallelFlowTemplate } from './specs/parallelFlow'
import { approvalFlowTemplate } from './specs/approvalFlow'
import { serviceTicketTemplate } from './specs/serviceTicket'
import { orderProcessTemplate } from './specs/orderProcess'
import { cicdFlowTemplate } from './specs/cicdFlow'
import { exceptionFlowTemplate } from './specs/exceptionFlow'
import { vsmFlowTemplate } from './specs/vsmFlow'
import { stateTransitionTemplate } from './specs/stateTransition'

export type { TemplateCategory, TemplateCategoryId, TemplateSpec, TemplateNodeSpec, TemplateLinkSpec, TemplateSeqSpec, AnchorSide } from './types'
export { buildTemplateDocument } from './builder'
export { buildTemplateThumbnail } from './thumbnail'

/** 模板分类（画廊分组顺序） */
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: 'basic', label: '基础流程' },
  { id: 'crossFunctional', label: '跨职能流程' },
  { id: 'uml', label: 'UML 建模' },
  { id: 'business', label: '业务审批' },
  { id: 'system', label: '系统技术' },
  { id: 'lean', label: '精益分析' },
]

/** 内置模板注册表（顺序沿用产品需求文档的 18 类编号） */
export const DRAW_TEMPLATES: TemplateSpec[] = [
  basicFlowTemplate,
  swimlaneTemplate,
  bpmnProcessTemplate,
  decisionTreeTemplate,
  systemFlowTemplate,
  dfdFlowTemplate,
  umlActivityTemplate,
  umlSequenceTemplate,
  linearStepsTemplate,
  loopFlowTemplate,
  parallelFlowTemplate,
  approvalFlowTemplate,
  serviceTicketTemplate,
  orderProcessTemplate,
  cicdFlowTemplate,
  exceptionFlowTemplate,
  vsmFlowTemplate,
  stateTransitionTemplate,
]

export function getTemplateById(id: string): TemplateSpec | undefined {
  return DRAW_TEMPLATES.find((t) => t.id === id)
}

export function getTemplatesByCategory(category: TemplateCategory['id']): TemplateSpec[] {
  return DRAW_TEMPLATES.filter((t) => t.category === category)
}