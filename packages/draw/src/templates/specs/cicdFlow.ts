import type { TemplateSpec } from '../types'

/** 软件开发与部署流程图：构建测试流水线，失败回修复，验收后生产部署 */
export const cicdFlowTemplate: TemplateSpec = {
  id: 'cicd-flow',
  title: '软件开发与部署流程图',
  category: 'system',
  description: 'CI/CD 流水线：构建、测试、部署测试环境、验收与生产上线',
  keywords: ['研发', 'CI/CD', '构建', '测试', '部署'],
  page: { width: 1300, height: 1020 },
  nodes: [
    { id: 'start', shape: 'terminator', text: '提交代码', x: 485, y: 60, w: 150, h: 56, fill: '213,232,212' },
    { id: 'build', shape: 'process', text: '自动构建', x: 475, y: 180, w: 170, h: 58, fill: '218,232,252' },
    { id: 'test', shape: 'process', text: '单元测试', x: 475, y: 290, w: 170, h: 58, fill: '218,232,252' },
    { id: 'tpass', shape: 'decision', text: '测试通过？', x: 470, y: 400, w: 180, h: 100, fill: '255,230,204' },
    { id: 'deployTest', shape: 'process', text: '部署测试环境', x: 475, y: 540, w: 170, h: 58, fill: '218,232,252' },
    { id: 'acceptance', shape: 'decision', text: '验收通过？', x: 470, y: 650, w: 180, h: 100, fill: '255,230,204' },
    { id: 'deployProd', shape: 'process', text: '生产部署', x: 475, y: 790, w: 170, h: 58, fill: '255,242,204' },
    { id: 'end', shape: 'terminator', text: '上线完成', x: 485, y: 910, w: 150, h: 56, fill: '213,232,212' },
    { id: 'fix', shape: 'process', text: '修复缺陷', x: 900, y: 421, w: 170, h: 58, fill: '248,206,204' },
  ],
  links: [
    { from: 'start', to: 'build', fromSide: 'bottom', toSide: 'top' },
    { from: 'build', to: 'test', fromSide: 'bottom', toSide: 'top' },
    { from: 'test', to: 'tpass', fromSide: 'bottom', toSide: 'top' },
    { from: 'test', to: 'fix', fromSide: 'right', toSide: 'left', text: '失败', textOffset: { t: 0.5, normal: 16 } },
    { from: 'fix', to: 'build', fromSide: 'top', toSide: 'right', text: '重提', textOffset: { t: 0.5, normal: -14 } },
    { from: 'tpass', to: 'deployTest', fromSide: 'bottom', toSide: 'top', text: '通过', textOffset: { t: 0.5, normal: 16 } },
    { from: 'deployTest', to: 'acceptance', fromSide: 'bottom', toSide: 'top' },
    { from: 'acceptance', to: 'fix', fromSide: 'right', toSide: 'bottom', text: '未通过', textOffset: { t: 0.5, normal: 14 } },
    { from: 'acceptance', to: 'deployProd', fromSide: 'bottom', toSide: 'top', text: '通过', textOffset: { t: 0.5, normal: 16 } },
    { from: 'deployProd', to: 'end', fromSide: 'bottom', toSide: 'top' },
  ],
}