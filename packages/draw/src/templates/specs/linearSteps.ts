import type { TemplateSpec } from '../types'

/** 线性步骤流程图：V 形箭头块首尾相接串联，强调单线推进的步骤序列 */
export const linearStepsTemplate: TemplateSpec = {
  id: 'linear-steps',
  title: '线性步骤流程图',
  category: 'basic',
  description: '按固定顺序逐级推进的步骤流，用首尾相接的箭头块表达流程阶段',
  keywords: ['步骤', '线性', '顺序', '阶段', '流程'],
  page: { width: 1280, height: 430 },
  nodes: [
    { id: 's1', shape: 'singleRightArrow', text: '1. 需求调研', x: 40, y: 170, w: 200, h: 76, fill: '224,236,252' },
    { id: 's2', shape: 'singleRightArrow', text: '2. 方案设计', x: 240, y: 170, w: 200, h: 76, fill: '214,230,252' },
    { id: 's3', shape: 'singleRightArrow', text: '3. 开发实现', x: 440, y: 170, w: 200, h: 76, fill: '204,224,251' },
    { id: 's4', shape: 'singleRightArrow', text: '4. 测试验证', x: 640, y: 170, w: 200, h: 76, fill: '194,218,250' },
    { id: 's5', shape: 'singleRightArrow', text: '5. 试点上线', x: 840, y: 170, w: 200, h: 76, fill: '185,212,247' },
    { id: 's6', shape: 'singleRightArrow', text: '6. 上线交付', x: 1040, y: 170, w: 200, h: 76, fill: '176,206,243' },
  ],
  links: [],
}