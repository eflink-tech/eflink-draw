import type { TemplateSpec } from '../types'

/** 基础流程图：开始/处理/判定/结束的最简单线结构 */
export const basicFlowTemplate: TemplateSpec = {
  id: 'basic-flow',
  title: '基础流程图',
  category: 'basic',
  description: '用开始/结束、处理、判断描述一条完整流程，适合日常流程梳理',
  keywords: ['流程图', '基础', '开始结束', '判定', '单线流程'],
  page: { width: 1100, height: 900 },
  nodes: [
    { id: 'start', shape: 'terminator', text: '开始', x: 475, y: 60, w: 150, h: 56, fill: '213,232,212' },
    { id: 'req', shape: 'process', text: '需求提出', x: 465, y: 176, w: 170, h: 58, fill: '218,232,252' },
    { id: 'review', shape: 'decision', text: '需求评估', x: 480, y: 294, w: 140, h: 90, fill: '255,230,204' },
    { id: 'adjust', shape: 'process', text: '修改需求', x: 790, y: 310, w: 170, h: 58, fill: '255,242,204' },
    { id: 'dev', shape: 'process', text: '开发实现', x: 465, y: 444, w: 170, h: 58, fill: '218,232,252' },
    { id: 'test', shape: 'process', text: '测试验证', x: 465, y: 562, w: 170, h: 58, fill: '218,232,252' },
    { id: 'release', shape: 'process', text: '上线发布', x: 465, y: 680, w: 170, h: 58, fill: '218,232,252' },
    { id: 'end', shape: 'terminator', text: '结束', x: 475, y: 796, w: 150, h: 56, fill: '213,232,212' },
  ],
  links: [
    { from: 'start', to: 'req', fromSide: 'bottom', toSide: 'top' },
    { from: 'req', to: 'review', fromSide: 'bottom', toSide: 'top' },
    { from: 'review', to: 'dev', fromSide: 'bottom', toSide: 'top', text: '是', textOffset: { t: 0.5, normal: 16 } },
    { from: 'review', to: 'adjust', fromSide: 'right', toSide: 'left', text: '否', textOffset: { t: 0.5, normal: 14 } },
    { from: 'adjust', to: 'req', fromSide: 'top', toSide: 'right' },
    { from: 'dev', to: 'test', fromSide: 'bottom', toSide: 'top' },
    { from: 'test', to: 'release', fromSide: 'bottom', toSide: 'top' },
    { from: 'release', to: 'end', fromSide: 'bottom', toSide: 'top' },
  ],
}