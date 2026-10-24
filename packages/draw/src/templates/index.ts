import type { TemplateCategory, TemplateSpec } from './types'
import { basicFlowTemplate } from './specs/basicFlow'
import { swimlaneTemplate } from './specs/swimlane'
import { bpmnProcessTemplate } from './specs/bpmnProcess'
import { umlSequenceTemplate } from './specs/umlSequence'
import { stateTransitionTemplate } from './specs/stateTransition'

export type { TemplateCategory, TemplateCategoryId, TemplateSpec, TemplateNodeSpec, TemplateLinkSpec, TemplateSeqSpec, AnchorSide } from './types'
export { buildTemplateDocument } from './builder'

/** 模板分类（M1 先落地 4 类，其余分类指向后续批次） */
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: 'basic', label: '基础流程' },
  { id: 'crossFunctional', label: '跨职能流程' },
  { id: 'uml', label: 'UML 建模' },
  { id: 'business', label: '业务审批' },
  { id: 'system', label: '系统技术' },
  { id: 'lean', label: '精益分析' },
]

/** 内置模板注册表 */
export const DRAW_TEMPLATES: TemplateSpec[] = [
  basicFlowTemplate,
  swimlaneTemplate,
  bpmnProcessTemplate,
  umlSequenceTemplate,
  stateTransitionTemplate,
]

export function getTemplateById(id: string): TemplateSpec | undefined {
  return DRAW_TEMPLATES.find((t) => t.id === id)
}

export function getTemplatesByCategory(category: TemplateCategory['id']): TemplateSpec[] {
  return DRAW_TEMPLATES.filter((t) => t.category === category)
}