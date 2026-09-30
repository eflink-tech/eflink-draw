// ═══════════════════════════════════════════
// 旧系统 bpmn.js 中尚未移植的 90 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category bpmn（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const bpmnLegacyShapes: ShapeDefinition[] = [
  /** 消息开始事件(可中断)（40×40） */
  {
    name: 'messageStartEvent',
    title: '消息开始事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'close' },
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 定时开始事件(可中断)（40×40） */
  {
    name: 'timerStartEvent',
    title: '定时开始事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5-w*0.3', y: 'h*0.5' },
        {
          action: 'curve',
          x1: 'w*0.5-w*0.3',
          y1: 'h*0.5-h*0.6*2/3',
          x2: 'w*0.5+w*0.3',
          y2: 'h*0.5-h*0.6*2/3',
          x: 'w*0.5+w*0.3',
          y: 'h*0.5'
        },
        {
          action: 'curve',
          x1: 'w*0.5+w*0.3',
          y1: 'h*0.5+h*0.6*2/3',
          x2: 'w*0.5-w*0.3',
          y2: 'h*0.5+h*0.6*2/3',
          x: 'w*0.5-w*0.3',
          y: 'h*0.5'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5+w*0.15', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/12*5)', y: 'h*0.5-h*0.25*Math.sin(Math.PI/12*5)' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(0)', y: 'h*0.5+h*0.3*Math.sin(0)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(0)', y: 'h*0.5+h*0.25*Math.sin(0)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*2)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*2)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*2)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*2)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*3)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*3)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*3)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*3)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*4)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*4)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*4)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*4)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*5)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*5)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*5)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*5)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*6)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*6)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*6)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*6)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*7)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*7)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*7)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*7)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*8)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*8)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*8)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*8)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*9)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*9)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*9)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*9)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*10)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*10)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*10)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*10)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*11)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*11)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*11)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*11)' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 条件开始事件(可中断)（40×40） */
  {
    name: 'conditionalStartEvent',
    title: '条件开始事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5-w*0.25', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5-h*0.25' },
        { action: 'close' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5-h*0.05' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5-h*0.05' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5-h*0.16' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5-h*0.16' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.05' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.05' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.16' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.16' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 信号开始事件(可中断)（40×40） */
  {
    name: 'signalStartEvent',
    title: '信号开始事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.32' },
        { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5+h*0.15' },
        { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5+h*0.15' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.32' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 上升开始事件(可中断)（40×40） */
  {
    name: 'escalationStartEvent',
    title: '上升开始事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 补偿开始事件(可中断)（40×40） */
  {
    name: 'compensationStartEvent',
    title: '补偿开始事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' },
        { action: 'close' },
        { action: 'move', x: 'w*0.5-w*0.25', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 错误开始事件(可中断)（40×40） */
  {
    name: 'errorStartEvent',
    title: '错误开始事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5+w*0.1', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.1', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.1', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.1', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.1', y: 'h*0.5' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 多例开始事件(可中断)（40×40） */
  {
    name: 'multipleStartEvent',
    title: '多例开始事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.28' },
        { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5-h*0.08' },
        { action: 'line', x: 'w*0.5+w*0.17', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.17', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5-h*0.08' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.28' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 并行开始事件(可中断)（40×40） */
  {
    name: 'parallelStartEvent',
    title: '并行开始事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5+w*0.07', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.27', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.27', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5+h*0.27' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5+h*0.27' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.27', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.27', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5-h*0.27' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5-h*0.27' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5-h*0.07' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 消息开始事件(非中断)（40×40） */
  {
    name: 'messageNonInturruptingEvent',
    title: '消息开始事件(非中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 2, lineStyle: 'dashed' }
      },
      [
        { action: 'move', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'close' },
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 定时开始事件(非中断)（40×40） */
  {
    name: 'timerNonInturruptingEvent',
    title: '定时开始事件(非中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 2, lineStyle: 'dashed' }
      },
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5-w*0.3', y: 'h*0.5' },
        {
          action: 'curve',
          x1: 'w*0.5-w*0.3',
          y1: 'h*0.5-h*0.6*2/3',
          x2: 'w*0.5+w*0.3',
          y2: 'h*0.5-h*0.6*2/3',
          x: 'w*0.5+w*0.3',
          y: 'h*0.5'
        },
        {
          action: 'curve',
          x1: 'w*0.5+w*0.3',
          y1: 'h*0.5+h*0.6*2/3',
          x2: 'w*0.5-w*0.3',
          y2: 'h*0.5+h*0.6*2/3',
          x: 'w*0.5-w*0.3',
          y: 'h*0.5'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5+w*0.15', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/12*5)', y: 'h*0.5-h*0.25*Math.sin(Math.PI/12*5)' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(0)', y: 'h*0.5+h*0.3*Math.sin(0)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(0)', y: 'h*0.5+h*0.25*Math.sin(0)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*2)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*2)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*2)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*2)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*3)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*3)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*3)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*3)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*4)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*4)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*4)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*4)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*5)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*5)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*5)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*5)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*6)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*6)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*6)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*6)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*7)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*7)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*7)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*7)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*8)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*8)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*8)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*8)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*9)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*9)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*9)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*9)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*10)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*10)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*10)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*10)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*11)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*11)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*11)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*11)' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 上升开始事件(非中断)（40×40） */
  {
    name: 'escalationNonInturruptingEvent',
    title: '上升开始事件(非中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 2, lineStyle: 'dashed' }
      },
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 条件开始事件(非中断)（40×40） */
  {
    name: 'conditionalNonInturruptingEvent',
    title: '条件开始事件(非中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 2, lineStyle: 'dashed' }
      },
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5-w*0.25', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5-h*0.25' },
        { action: 'close' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5-h*0.05' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5-h*0.05' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5-h*0.16' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5-h*0.16' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.05' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.05' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.16' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.16' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 信号开始事件(非中断)（40×40） */
  {
    name: 'signalNonInturruptingEvent',
    title: '信号开始事件(非中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 2, lineStyle: 'dashed' }
      },
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.32' },
        { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5+h*0.15' },
        { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5+h*0.15' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.32' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 多例开始事件(非中断)（40×40） */
  {
    name: 'multipleNonInturruptingEvent',
    title: '多例开始事件(非中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 2, lineStyle: 'dashed' }
      },
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.28' },
        { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5-h*0.08' },
        { action: 'line', x: 'w*0.5+w*0.17', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.17', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5-h*0.08' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.28' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 并行开始事件(非中断)（40×40） */
  {
    name: 'parallelNonInturruptingEvent',
    title: '并行开始事件(非中断)',
    category: 'bpmn',
    group: 'bpmn_start',
    groupName: '开始事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 2, lineStyle: 'dashed' }
      },
      [
        { action: 'move', x: 'w*0.5+w*0.07', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.27', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.27', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5+h*0.27' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5+h*0.27' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.27', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.27', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5-h*0.27' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5-h*0.27' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5-h*0.07' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 消息中间捕获事件（40×40） */
  {
    name: 'messageIntermediateCatchEvent',
    title: '消息中间捕获事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'close' },
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 定时捕获事件（40×40） */
  {
    name: 'timerIntermediateCatchEvent',
    title: '定时捕获事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5-w*0.3', y: 'h*0.5' },
        {
          action: 'curve',
          x1: 'w*0.5-w*0.3',
          y1: 'h*0.5-h*0.6*2/3',
          x2: 'w*0.5+w*0.3',
          y2: 'h*0.5-h*0.6*2/3',
          x: 'w*0.5+w*0.3',
          y: 'h*0.5'
        },
        {
          action: 'curve',
          x1: 'w*0.5+w*0.3',
          y1: 'h*0.5+h*0.6*2/3',
          x2: 'w*0.5-w*0.3',
          y2: 'h*0.5+h*0.6*2/3',
          x: 'w*0.5-w*0.3',
          y: 'h*0.5'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5+w*0.15', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/12*5)', y: 'h*0.5-h*0.25*Math.sin(Math.PI/12*5)' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(0)', y: 'h*0.5+h*0.3*Math.sin(0)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(0)', y: 'h*0.5+h*0.25*Math.sin(0)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*2)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*2)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*2)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*2)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*3)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*3)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*3)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*3)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*4)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*4)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*4)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*4)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*5)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*5)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*5)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*5)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*6)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*6)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*6)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*6)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*7)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*7)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*7)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*7)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*8)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*8)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*8)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*8)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*9)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*9)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*9)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*9)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*10)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*10)' },
          {
            action: 'line',
            x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*10)',
            y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*10)'
          },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*11)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*11)' },
          {
            action: 'line',
            x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*11)',
            y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*11)'
          }
        ],
        lineStyle: { lineWidth: 2 }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 上升中间捕获事件（40×40） */
  {
    name: 'escalationIntermediateCatchEvent',
    title: '上升中间捕获事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 条件中间捕获事件（40×40） */
  {
    name: 'conditionalIntermediateCatchEvent',
    title: '条件中间捕获事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5-w*0.25', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5-h*0.25' },
        { action: 'close' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5-h*0.05' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5-h*0.05' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5-h*0.16' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5-h*0.16' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.05' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.05' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.16' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.16' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 连接中间捕获事件（40×40） */
  {
    name: 'linkIntermediateCatchEvent',
    title: '连接中间捕获事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5-w*0.26', y: 'h*0.5-h*0.08' },
        { action: 'line', x: 'w*0.5+w*0.16', y: 'h*0.5-h*0.08' },
        { action: 'line', x: 'w*0.5+w*0.16', y: 'h*0.5-h*0.18' },
        { action: 'line', x: 'w*0.5+w*0.26', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.16', y: 'h*0.5+h*0.18' },
        { action: 'line', x: 'w*0.5+w*0.16', y: 'h*0.5+h*0.08' },
        { action: 'line', x: 'w*0.5-w*0.26', y: 'h*0.5+h*0.08' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 信号中间捕获事件（40×40） */
  {
    name: 'signalIntermediateCatchEvent',
    title: '信号中间捕获事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.32' },
        { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5+h*0.15' },
        { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5+h*0.15' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.32' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 多例中间捕获事件（40×40） */
  {
    name: 'multipleIntermediateCatchEvent',
    title: '多例中间捕获事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.28' },
        { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5-h*0.08' },
        { action: 'line', x: 'w*0.5+w*0.17', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.17', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5-h*0.08' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.28' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 并行中间捕获事件（40×40） */
  {
    name: 'parallelIntermediateCatchEvent',
    title: '并行中间捕获事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5+w*0.07', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.27', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.27', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5+h*0.27' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5+h*0.27' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.27', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.27', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5-h*0.27' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5-h*0.27' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5-h*0.07' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 补偿中间捕获事件（40×40） */
  {
    name: 'compensationIntermediateCatchEvent',
    title: '补偿中间捕获事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' },
        { action: 'close' },
        { action: 'move', x: 'w*0.5-w*0.25', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 错误中间捕获事件（40×40） */
  {
    name: 'errorIntermediateCatchEvent',
    title: '错误中间捕获事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5+w*0.1', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.1', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.1', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.1', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.1', y: 'h*0.5' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 取消中间捕获事件（40×40） */
  {
    name: 'cancelIntermediateCatchEvent',
    title: '取消中间捕获事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.1' },
        { action: 'line', x: 'w*0.5+w*0.16', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5-h*0.16' },
        { action: 'line', x: 'w*0.5+w*0.1', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5+h*0.16' },
        { action: 'line', x: 'w*0.5+w*0.16', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5+h*0.1' },
        { action: 'line', x: 'w*0.5-w*0.16', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5+h*0.16' },
        { action: 'line', x: 'w*0.5-w*0.1', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5-h*0.16' },
        { action: 'line', x: 'w*0.5-w*0.16', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.1' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 消息中间抛出事件（40×40） */
  {
    name: 'messageIntermediateThrowingEvent',
    title: '消息中间抛出事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.5' },
          { action: 'move', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
          { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5-h*0.2' },
          { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5+h*0.2' },
          { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5+h*0.2' },
          { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
          { action: 'close' }
        ],
        lineStyle: { lineColor: '255,255,255' },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5-h*0.2' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5' },
          { action: 'close' }
        ],
        lineStyle: { lineColor: '255,255,255' },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 上升中间抛出事件（40×40） */
  {
    name: 'escalationIntermediateThrowingEvent',
    title: '上升中间抛出事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.25' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.25' },
          { action: 'line', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.25' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 连接中间抛出事件（40×40） */
  {
    name: 'linkIntermediateThrowingEvent',
    title: '连接中间抛出事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.5' },
          { action: 'move', x: 'w*0.5-w*0.26', y: 'h*0.5-h*0.08' },
          { action: 'line', x: 'w*0.5+w*0.16', y: 'h*0.5-h*0.08' },
          { action: 'line', x: 'w*0.5+w*0.16', y: 'h*0.5-h*0.18' },
          { action: 'line', x: 'w*0.5+w*0.26', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5+w*0.16', y: 'h*0.5+h*0.18' },
          { action: 'line', x: 'w*0.5+w*0.16', y: 'h*0.5+h*0.08' },
          { action: 'line', x: 'w*0.5-w*0.26', y: 'h*0.5+h*0.08' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 补偿中间抛出事件（40×40） */
  {
    name: 'compensationIntermediateThrowingEvent',
    title: '补偿中间抛出事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5-h*0.2' },
          { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5+h*0.2' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.5-w*0.25', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.2' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5+h*0.2' },
          { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 信号中间抛出事件（40×40） */
  {
    name: 'signalIntermediateThrowingEvent',
    title: '信号中间抛出事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.32' },
          { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5+h*0.15' },
          { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5+h*0.15' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.32' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 多例中间抛出事件（40×40） */
  {
    name: 'multipleIntermediateThrowingEvent',
    title: '多例中间抛出事件',
    category: 'bpmn',
    group: 'bpmn_intermediate',
    groupName: '中间事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.28' },
          { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5-h*0.08' },
          { action: 'line', x: 'w*0.5+w*0.17', y: 'h*0.5+h*0.25' },
          { action: 'line', x: 'w*0.5-w*0.17', y: 'h*0.5+h*0.25' },
          { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5-h*0.08' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.28' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 消息边界事件(可中断)（40×40） */
  {
    name: 'messageBoundaryInturrputingEvent',
    title: '消息边界事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'close' },
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 定时边界事件(可中断)（40×40） */
  {
    name: 'timerBoundaryInturrputingEvent',
    title: '定时边界事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5-w*0.3', y: 'h*0.5' },
        {
          action: 'curve',
          x1: 'w*0.5-w*0.3',
          y1: 'h*0.5-h*0.6*2/3',
          x2: 'w*0.5+w*0.3',
          y2: 'h*0.5-h*0.6*2/3',
          x: 'w*0.5+w*0.3',
          y: 'h*0.5'
        },
        {
          action: 'curve',
          x1: 'w*0.5+w*0.3',
          y1: 'h*0.5+h*0.6*2/3',
          x2: 'w*0.5-w*0.3',
          y2: 'h*0.5+h*0.6*2/3',
          x: 'w*0.5-w*0.3',
          y: 'h*0.5'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5+w*0.15', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/12*5)', y: 'h*0.5-h*0.25*Math.sin(Math.PI/12*5)' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(0)', y: 'h*0.5+h*0.3*Math.sin(0)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(0)', y: 'h*0.5+h*0.25*Math.sin(0)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*2)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*2)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*2)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*2)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*3)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*3)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*3)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*3)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*4)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*4)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*4)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*4)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*5)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*5)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*5)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*5)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*6)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*6)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*6)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*6)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*7)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*7)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*7)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*7)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*8)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*8)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*8)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*8)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*9)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*9)' },
          { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*9)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*9)' },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*10)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*10)' },
          {
            action: 'line',
            x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*10)',
            y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*10)'
          },
          { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*11)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*11)' },
          {
            action: 'line',
            x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*11)',
            y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*11)'
          }
        ],
        lineStyle: { lineWidth: 2 }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 上升边界事件(可中断)（40×40） */
  {
    name: 'escalationBoundaryInturrputingEvent',
    title: '上升边界事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 条件边界事件(可中断)（40×40） */
  {
    name: 'conditionalBoundaryInturrputingEvent',
    title: '条件边界事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5-w*0.25', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5-h*0.25' },
        { action: 'close' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5-h*0.05' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5-h*0.05' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5-h*0.16' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5-h*0.16' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.05' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.05' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.16' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.16' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 信号边界事件(可中断)（40×40） */
  {
    name: 'signalBoundaryInturrputingEvent',
    title: '信号边界事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.32' },
        { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5+h*0.15' },
        { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5+h*0.15' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.32' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 多例边界事件(可中断)（40×40） */
  {
    name: 'multipleBoundaryInturrputingEvent',
    title: '多例边界事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.28' },
        { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5-h*0.08' },
        { action: 'line', x: 'w*0.5+w*0.17', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.17', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5-h*0.08' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.28' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 并行边界事件(可中断)（40×40） */
  {
    name: 'parallelBoundaryInturrputingEvent',
    title: '并行边界事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5+w*0.07', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.27', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.27', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5+h*0.27' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5+h*0.27' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.27', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.27', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5-h*0.27' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5-h*0.27' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5-h*0.07' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 补偿边界事件(可中断)（40×40） */
  {
    name: 'compensationBoundaryInturrputingEvent',
    title: '补偿边界事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' },
        { action: 'close' },
        { action: 'move', x: 'w*0.5-w*0.25', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 错误边界事件(可中断)（40×40） */
  {
    name: 'errorBoundaryInturrputingEvent',
    title: '错误边界事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5+w*0.1', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.1', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.1', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.1', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.1', y: 'h*0.5' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 取消边界事件(可中断)（40×40） */
  {
    name: 'cancelBoundaryInturrputingEvent',
    title: '取消边界事件(可中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 3, y: 'h*0.5' },
        { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
        { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.1' },
        { action: 'line', x: 'w*0.5+w*0.16', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5-h*0.16' },
        { action: 'line', x: 'w*0.5+w*0.1', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5+h*0.16' },
        { action: 'line', x: 'w*0.5+w*0.16', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5+h*0.1' },
        { action: 'line', x: 'w*0.5-w*0.16', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5+h*0.16' },
        { action: 'line', x: 'w*0.5-w*0.1', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5-h*0.16' },
        { action: 'line', x: 'w*0.5-w*0.16', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.1' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 绑定边界事件(非中断)（40×40） */
  {
    name: 'boundaryNonInturrputingEvent',
    title: '绑定边界事件(非中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      },
      {
        actions: [
          { action: 'move', x: 3, y: 'h*0.5' },
          { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
          { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 消息边界事件(非中断)（40×40） */
  {
    name: 'messageBoundaryNonInturruptingEvent',
    title: '消息边界事件(非中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      },
      {
        actions: [
          { action: 'move', x: 3, y: 'h*0.5' },
          { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
          { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      },
      [
        { action: 'move', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5+h*0.2' },
        { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'close' },
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5-h*0.2' },
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 定时边界事件(非中断)（40×40） */
  {
    name: 'timerBoundaryNonInturruptingEvent',
    title: '定时边界事件(非中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      },
      {
        actions: [
          { action: 'move', x: 3, y: 'h*0.5' },
          { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
          { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      },
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5-w*0.3', y: 'h*0.5' },
        {
          action: 'curve',
          x1: 'w*0.5-w*0.3',
          y1: 'h*0.5-h*0.6*2/3',
          x2: 'w*0.5+w*0.3',
          y2: 'h*0.5-h*0.6*2/3',
          x: 'w*0.5+w*0.3',
          y: 'h*0.5'
        },
        {
          action: 'curve',
          x1: 'w*0.5+w*0.3',
          y1: 'h*0.5+h*0.6*2/3',
          x2: 'w*0.5-w*0.3',
          y2: 'h*0.5+h*0.6*2/3',
          x: 'w*0.5-w*0.3',
          y: 'h*0.5'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5+w*0.15', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/12*5)', y: 'h*0.5-h*0.25*Math.sin(Math.PI/12*5)' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' }
      ],
      [
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(0)', y: 'h*0.5+h*0.3*Math.sin(0)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(0)', y: 'h*0.5+h*0.25*Math.sin(0)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*2)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*2)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*2)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*2)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*3)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*3)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*3)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*3)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*4)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*4)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*4)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*4)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*5)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*5)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*5)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*5)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*6)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*6)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*6)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*6)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*7)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*7)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*7)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*7)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*8)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*8)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*8)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*8)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*9)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*9)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*9)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*9)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*10)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*10)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*10)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*10)' },
        { action: 'move', x: 'w*0.5+w*0.3*Math.cos(Math.PI/6*11)', y: 'h*0.5+h*0.3*Math.sin(Math.PI/6*11)' },
        { action: 'line', x: 'w*0.5+w*0.25*Math.cos(Math.PI/6*11)', y: 'h*0.5+h*0.25*Math.sin(Math.PI/6*11)' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 上升边界事件(非中断)（40×40） */
  {
    name: 'escalationBoundaryNonInturruptingEvent',
    title: '上升边界事件(非中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      },
      {
        actions: [
          { action: 'move', x: 3, y: 'h*0.5' },
          { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
          { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      },
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 条件边界事件(非中断)（40×40） */
  {
    name: 'conditionalBoundaryNonInturruptingEvent',
    title: '条件边界事件(非中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      },
      {
        actions: [
          { action: 'move', x: 3, y: 'h*0.5' },
          { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
          { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      },
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5' },
        { action: 'move', x: 'w*0.5-w*0.25', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5-h*0.25' },
        { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5-h*0.25' },
        { action: 'close' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5-h*0.05' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5-h*0.05' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5-h*0.16' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5-h*0.16' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.05' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.05' },
        { action: 'move', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.16' },
        { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.16' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 信号边界事件(非中断)（40×40） */
  {
    name: 'signalBoundaryNonInturruptingEvent',
    title: '信号边界事件(非中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      },
      {
        actions: [
          { action: 'move', x: 3, y: 'h*0.5' },
          { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
          { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      },
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.32' },
        { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5+h*0.15' },
        { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5+h*0.15' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.32' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 多例边界事件(非中断)（40×40） */
  {
    name: 'multipleBoundaryNonInturruptingEvent',
    title: '多例边界事件(非中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      },
      {
        actions: [
          { action: 'move', x: 3, y: 'h*0.5' },
          { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
          { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      },
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.28' },
        { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5-h*0.08' },
        { action: 'line', x: 'w*0.5+w*0.17', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.17', y: 'h*0.5+h*0.25' },
        { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5-h*0.08' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.28' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 并行边界事件(非中断)（40×40） */
  {
    name: 'parallelBoundaryNonInturruptingEvent',
    title: '并行边界事件(非中断)',
    category: 'bpmn',
    group: 'bpmn_boundary',
    groupName: '边界事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      },
      {
        actions: [
          { action: 'move', x: 3, y: 'h*0.5' },
          { action: 'curve', x1: 3, y1: '-h/6+4', x2: 'w-3', y2: '-h/6+4', x: 'w-3', y: 'h*0.5' },
          { action: 'curve', x1: 'w-3', y1: 'h+h/6-4', x2: 3, y2: 'h+h/6-4', x: 3, y: 'h*0.5' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      },
      [
        { action: 'move', x: 'w*0.5+w*0.07', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.27', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.27', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5+h*0.27' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5+h*0.27' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.27', y: 'h*0.5+h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.27', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5-h*0.07' },
        { action: 'line', x: 'w*0.5-w*0.07', y: 'h*0.5-h*0.27' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5-h*0.27' },
        { action: 'line', x: 'w*0.5+w*0.07', y: 'h*0.5-h*0.07' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 消息结束事件（40×40） */
  {
    name: 'messageEndEvent',
    title: '消息结束事件',
    category: 'bpmn',
    group: 'bpmn_end',
    groupName: '结束事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.5' },
          { action: 'move', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
          { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5-h*0.2' },
          { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5+h*0.2' },
          { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5+h*0.2' },
          { action: 'line', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
          { action: 'close' }
        ],
        lineStyle: { lineColor: '255,255,255' },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.5-w*0.3', y: 'h*0.5-h*0.2' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5+w*0.3', y: 'h*0.5-h*0.2' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5' },
          { action: 'close' }
        ],
        lineStyle: { lineColor: '255,255,255' },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 上升结束事件（40×40） */
  {
    name: 'escalatEndEvent',
    title: '上升结束事件',
    category: 'bpmn',
    group: 'bpmn_end',
    groupName: '结束事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5+w*0.2', y: 'h*0.5+h*0.25' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.25' },
          { action: 'line', x: 'w*0.5-w*0.2', y: 'h*0.5+h*0.25' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 取消结束事件（40×40） */
  {
    name: 'cancelEndEvent',
    title: '取消结束事件',
    category: 'bpmn',
    group: 'bpmn_end',
    groupName: '结束事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.5' },
          { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.1' },
          { action: 'line', x: 'w*0.5+w*0.16', y: 'h*0.5-h*0.25' },
          { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5-h*0.16' },
          { action: 'line', x: 'w*0.5+w*0.1', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5+h*0.16' },
          { action: 'line', x: 'w*0.5+w*0.16', y: 'h*0.5+h*0.25' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5+h*0.1' },
          { action: 'line', x: 'w*0.5-w*0.16', y: 'h*0.5+h*0.25' },
          { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5+h*0.16' },
          { action: 'line', x: 'w*0.5-w*0.1', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5-h*0.16' },
          { action: 'line', x: 'w*0.5-w*0.16', y: 'h*0.5-h*0.25' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.1' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 错误结束事件（40×40） */
  {
    name: 'errorEndEvent',
    title: '错误结束事件',
    category: 'bpmn',
    group: 'bpmn_end',
    groupName: '结束事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.5' },
          { action: 'move', x: 'w*0.5+w*0.1', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5-h*0.2' },
          { action: 'line', x: 'w*0.5+w*0.1', y: 'h*0.5+h*0.2' },
          { action: 'line', x: 'w*0.5-w*0.1', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5+h*0.2' },
          { action: 'line', x: 'w*0.5-w*0.1', y: 'h*0.5-h*0.2' },
          { action: 'line', x: 'w*0.5+w*0.1', y: 'h*0.5' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 补偿结束事件（40×40） */
  {
    name: 'compensationEndEvent',
    title: '补偿结束事件',
    category: 'bpmn',
    group: 'bpmn_end',
    groupName: '结束事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5-h*0.2' },
          { action: 'line', x: 'w*0.5+w*0.25', y: 'h*0.5+h*0.2' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.5-w*0.25', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.2' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5+h*0.2' },
          { action: 'line', x: 'w*0.5-w*0.25', y: 'h*0.5' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 信号结束事件（40×40） */
  {
    name: 'signalEndEvent',
    title: '信号结束事件',
    category: 'bpmn',
    group: 'bpmn_end',
    groupName: '结束事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.32' },
          { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5+h*0.15' },
          { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5+h*0.15' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.32' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 多例结束事件（40×40） */
  {
    name: 'multipleEndEvent',
    title: '多例结束事件',
    category: 'bpmn',
    group: 'bpmn_end',
    groupName: '结束事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.5-h*0.28' },
          { action: 'line', x: 'w*0.5+w*0.28', y: 'h*0.5-h*0.08' },
          { action: 'line', x: 'w*0.5+w*0.17', y: 'h*0.5+h*0.25' },
          { action: 'line', x: 'w*0.5-w*0.17', y: 'h*0.5+h*0.25' },
          { action: 'line', x: 'w*0.5-w*0.28', y: 'h*0.5-h*0.08' },
          { action: 'line', x: 'w*0.5', y: 'h*0.5-h*0.28' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 终止事件（40×40） */
  {
    name: 'terminate',
    title: '终止事件',
    category: 'bpmn',
    group: 'bpmn_end',
    groupName: '结束事件',
    props: { w: 40, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.5 - w*0.25', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.5 - w*0.25',
            y1: 'h*0.5 - h*2/3*0.5',
            x2: 'w*0.5 + w*0.25',
            y2: 'h*0.5 - h*2/3*0.5',
            x: 'w*0.5 + w*0.25',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.5 + w*0.25',
            y1: 'h*0.5 + h*2/3*0.5',
            x2: 'w*0.5 - w*0.25',
            y2: 'h*0.5 + h*2/3*0.5',
            x: 'w*0.5 - w*0.25',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 人工任务（100×70） */
  {
    name: 'manualTask',
    title: '人工任务',
    category: 'bpmn',
    group: 'bpmn_task',
    groupName: '任务',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 4 },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
        { action: 'line', x: 'w-4', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
        { action: 'line', x: 'w', y: 'h-4' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
        { action: 'line', x: 4, y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: '100*0.15- 100*0.08', y: '60*0.2' },
          { action: 'line', x: '100*0.15- 100*0.04', y: '60*0.2' },
          { action: 'line', x: '100*0.15+ 100*0.01', y: '60*0.13' },
          { action: 'line', x: '100*0.15+ 100*0.04', y: '60*0.13' },
          { action: 'line', x: '100*0.15 + 100*0.04', y: '60*0.17' },
          { action: 'line', x: '100*0.15+ 100*0.01', y: '60*0.17' },
          { action: 'line', x: '100*0.15+ 100*0.1', y: '60*0.17' },
          { action: 'line', x: '100*0.15+ 100*0.1', y: '60*0.21' },
          { action: 'line', x: '100*0.15+ 100*0.01', y: '60*0.21' },
          { action: 'line', x: '100*0.15+ 100*0.06', y: '60*0.21' },
          { action: 'line', x: '100*0.15+ 100*0.06', y: '60*0.25' },
          { action: 'line', x: '100*0.15+ 100*0.01', y: '60*0.25' },
          { action: 'line', x: '100*0.15+ 100*0.06', y: '60*0.25' },
          { action: 'line', x: '100*0.15+ 100*0.06', y: '60*0.29' },
          { action: 'line', x: '100*0.15+ 100*0.06', y: '60*0.29' },
          { action: 'line', x: '100*0.15+ 100*0.04', y: '60*0.29' },
          { action: 'line', x: '100*0.15+ 100*0.04', y: '60*0.33' },
          { action: 'line', x: '100*0.15- 100*0.04', y: '60*0.33' },
          { action: 'line', x: '100*0.15- 100*0.08', y: '60*0.28' },
          { action: 'line', x: '100*0.15- 100*0.08', y: '60*0.2' },
          { action: 'close' }
        ],
        lineStyle: { lineColor: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ]
  },
  /** 接收任务（100×70） */
  {
    name: 'receiveTask',
    title: '接收任务',
    category: 'bpmn',
    group: 'bpmn_task',
    groupName: '任务',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 4 },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
        { action: 'line', x: 'w-4', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
        { action: 'line', x: 'w', y: 'h-4' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
        { action: 'line', x: 4, y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: '100*0.15+ 100*0.08', y: '60*0.24- 60*0.1' },
          { action: 'line', x: '100*0.15- 100*0.08', y: '60*0.24- 60*0.1' },
          { action: 'line', x: '100*0.15 - 100*0.08', y: '60*0.24 + 60*0.08' },
          { action: 'line', x: '100*0.15+ 100*0.08', y: '60*0.24 + 60*0.08' },
          { action: 'line', x: '100*0.15+ 100*0.08', y: '60*0.24- 60*0.1' },
          { action: 'close' },
          { action: 'line', x: '100*0.15 - 0', y: '60*0.24- 60*0.01' },
          { action: 'line', x: '100*0.15 - 100*0.08', y: '60*0.24- 60*0.1' },
          { action: 'line', x: '100*0.15 - 0', y: '60*0.24- 60*0.01' },
          { action: 'close' }
        ],
        lineStyle: { lineColor: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ]
  },
  /** 发送任务（100×70） */
  {
    name: 'sendTask',
    title: '发送任务',
    category: 'bpmn',
    group: 'bpmn_task',
    groupName: '任务',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 4 },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
        { action: 'line', x: 'w-4', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
        { action: 'line', x: 'w', y: 'h-4' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
        { action: 'line', x: 4, y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: '100*0.15+ 100*0.08', y: '60*0.24- 60*0.1' },
          { action: 'line', x: '100*0.15- 100*0.08', y: '60*0.24- 60*0.1' },
          { action: 'line', x: '100*0.15 - 100*0.08', y: '60*0.24 + 60*0.08' },
          { action: 'line', x: '100*0.15+ 100*0.08', y: '60*0.24 + 60*0.08' },
          { action: 'line', x: '100*0.15+ 100*0.08', y: '60*0.24- 60*0.1' },
          { action: 'close' },
          { action: 'line', x: '100*0.15 - 0', y: '60*0.24- 60*0.01' },
          { action: 'line', x: '100*0.15 - 100*0.08', y: '60*0.24- 60*0.1' },
          { action: 'line', x: '100*0.15 - 0', y: '60*0.24- 60*0.01' },
          { action: 'close' }
        ],
        lineStyle: { lineColor: '255,255,255' },
        fillStyle: { type: 'solid', color: '0,0,0' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ]
  },
  /** 服务任务（100×70） */
  {
    name: 'serviceTask',
    title: '服务任务',
    category: 'bpmn',
    group: 'bpmn_task',
    groupName: '任务',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 4 },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
        { action: 'line', x: 'w-4', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
        { action: 'line', x: 'w', y: 'h-4' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
        { action: 'line', x: 4, y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: '100*0.09 -100*0.26 *0.16', y: '60*0.14 + 60/5*8 *0.16 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.28 *0.16', y: '60*0.14 + 60/5*8 *0.11 *0.16' },
          { action: 'line', x: '100*0.09 - 100*0.26 *0.16', y: '60*0.14 + 60/5*8 *0.05 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.17 *0.16', y: '60*0.14 + 60/5*8 *0.05 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.12 *0.16', y: '60*0.14 -60/5*8 *0.02 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.21 *0.16', y: '60*0.14 -60/5*8 *0.13 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.18 *0.16', y: '60*0.14 -60/5*8 *0.17 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.13 *0.16', y: '60*0.14 -60/5*8 *0.19 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.05 *0.16', y: '60*0.14 -60/5*8 *0.11 *0.16' },
          { action: 'line', x: '100*0.09 +100*0.03 *0.16', y: '60*0.14 -60/5*8 *0.15 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.04 *0.16', y: '60*0.14 -60/5*8 *0.25 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.10 *0.16', y: '60*0.14 -60/5*8 *0.27 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.15 *0.16', y: '60*0.14 -60/5*8 *0.25 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.15 *0.16', y: '60*0.14 -60/5*8 *0.15 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.23 *0.16', y: '60*0.14 -60/5*8 *0.12 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.30 *0.16', y: '60*0.14 -60/5*8 *0.19 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.35 *0.16', y: '60*0.14 -60/5*8 *0.16 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.38 *0.16', y: '60*0.14 -60/5*8 *0.12 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.32 *0.16', y: '60*0.14 -60/5*8 *0.05 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.37 *0.16', y: '60*0.14 + 60/5*8 *0.05 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.46 *0.16', y: '60*0.14 + 60/5*8 *0.05 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.48 *0.16', y: '60*0.14 + 60/5*8 *0.10 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.46 *0.16', y: '60*0.14 + 60/5*8 *0.16 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.37 *0.16', y: '60*0.14 + 60/5*8 *0.16 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.33 *0.16', y: '60*0.14 + 60/5*8 *0.25 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.38 *0.16', y: '60*0.14 + 60/5*8 *0.31 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.36 *0.16', y: '60*0.14 + 60/5*8 *0.37 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.29 *0.16', y: '60*0.14 + 60/5*8 *0.39 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.25 *0.16', y: '60*0.14 + 60/5*8 *0.35 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.16 *0.16', y: '60*0.14 + 60/5*8 *0.37 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.16 *0.16', y: '60*0.14 + 60/5*8 *0.46 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.10 *0.16', y: '60*0.14 + 60/5*8 *0.48 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.04 *0.16', y: '60*0.14 + 60/5*8 *0.46 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.04 *0.16', y: '60*0.14 + 60/5*8 *0.37 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.04 *0.16', y: '60*0.14 + 60/5*8 *0.33 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.12 *0.16', y: '60*0.14 + 60/5*8 *0.38 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.18 *0.16', y: '60*0.14 + 60/5*8 *0.37 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.21 *0.16', y: '60*0.14 + 60/5*8 *0.33 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.14 *0.16', y: '60*0.14 + 60/5*8 *0.25 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.16 *0.16', y: '60*0.14 + 60/5*8 *0.16 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.26 *0.16', y: '60*0.14 + 60/5*8 *0.16 *0.16' },
          { action: 'close' },
          { action: 'move', x: '100*0.09 -100*0.01 *0.16', y: '60*0.14 +  60/5*8 *0.01 *0.16' },
          { action: 'line', x: '100*0.09 +100*0.01 *0.16', y: '60*0.14 - 60*0.01 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 +100*0.04 *0.16', y: '60*0.14 + 60*0.01 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.08 *0.16', y: '60*0.14 + 60*0.01 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.08 *0.16', y: '60*0.14 - 60*0.03 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.12 *0.16', y: '60*0.14 - 60*0.03 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.12 *0.16', y: '60*0.14 - 60*0.0 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.15 *0.16', y: '60*0.14 + 60*0.02 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.18 *0.16', y: '60*0.14 -60*0.01 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.22 *0.16', y: '60*0.14 + 60*0.01 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.18 *0.16', y: '60*0.14 + 60*0.04 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.20 *0.16', y: '60*0.14 + 60*0.08 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.25 *0.16', y: '60*0.14 + 60*0.08 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.25 *0.16', y: '60*0.14 + 60*0.12 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.20 *0.16', y: '60*0.14 + 60*0.12 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.18 *0.16', y: '60*0.14 + 60*0.16 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.21 *0.16', y: '60*0.14 + 60*0.19 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.18 *0.16', y: '60*0.14 + 60*0.22 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.15 *0.16', y: '60*0.14 + 60*0.19 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.12 *0.16', y: '60*0.14 + 60*0.21 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.12 *0.16', y: '60*0.14 + 60*0.25 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.08 *0.16', y: '60*0.14 + 60*0.26 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.08 *0.16', y: '60*0.14 + 60*0.21 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.05 *0.16', y: '60*0.14 + 60*0.18 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.01 *0.16', y: '60*0.14 + 60*0.22 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 - 100*0.02 *0.16', y: '60*0.14 + 60*0.19 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.0 *0.16', y: '60*0.14 + 60*0.16 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.0 *0.16', y: '60*0.14 + 60*0.12 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.04 *0.16', y: '60*0.14 + 60*0.12 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.04 *0.16', y: '60*0.14 + 60*0.08 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0. *0.16', y: '60*0.14 + 60*0.08 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 + 100*0.01 *0.16', y: '60*0.14 + 60*0.05 /5*8 *0.16' },
          { action: 'line', x: '100*0.09 -100*0.01 *0.16', y: '60*0.14 + 60*0.01 /5*8 *0.16' },
          { action: 'close' },
          { action: 'move', x: '100*0.15 -100*0.26 *0.16', y: '60*0.24 + 60/5*8 *0.16 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.28 *0.16', y: '60*0.24 + 60/5*8 *0.11 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.26 *0.16', y: '60*0.24 + 60/5*8 *0.05 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.17 *0.16', y: '60*0.24 + 60/5*8 *0.05 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.12 *0.16', y: '60*0.24 -60/5*8 *0.02 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.21 *0.16', y: '60*0.24 -60/5*8 *0.13 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.18 *0.16', y: '60*0.24 -60/5*8 *0.17 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.13 *0.16', y: '60*0.24 -60/5*8 *0.19 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.05 *0.16', y: '60*0.24 -60/5*8 *0.11 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.03 *0.16', y: '60*0.24 -60/5*8 *0.15 *0.16' },
          { action: 'line', x: '100*0.15 +  100*0.04 *0.16', y: '60*0.24 -60/5*8 *0.25 *0.16' },
          { action: 'line', x: '100*0.15 +  100*0.10 *0.16', y: '60*0.24 -60/5*8 *0.27 *0.16' },
          { action: 'line', x: '100*0.15 +  100*0.15 *0.16', y: '60*0.24 -60/5*8 *0.25 *0.16' },
          { action: 'line', x: '100*0.15 +  100*0.15 *0.16', y: '60*0.24 -60/5*8 *0.15 *0.16' },
          { action: 'line', x: '100*0.15 +  100*0.23 *0.16', y: '60*0.24 -60/5*8 *0.12 *0.16' },
          { action: 'line', x: '100*0.15 +  100*0.30 *0.16', y: '60*0.24 -60/5*8 *0.19 *0.16' },
          { action: 'line', x: '100*0.15 +  100*0.35 *0.16', y: '60*0.24 -60/5*8 *0.16 *0.16' },
          { action: 'line', x: '100*0.15 +  100*0.38 *0.16', y: '60*0.24 -60/5*8 *0.12 *0.16' },
          { action: 'line', x: '100*0.15 +  100*0.32 *0.16', y: '60*0.24 -60/5*8 *0.05 *0.16' },
          { action: 'line', x: '100*0.15 +  100*0.37 *0.16', y: '60*0.24 +60/5*8 *0.05 *0.16' },
          { action: 'line', x: '100*0.15 +  100*0.46 *0.16', y: '60*0.24 +60/5*8 *0.05 *0.16' },
          { action: 'line', x: '100*0.15 +  100*0.48 *0.16', y: '60*0.24 +60/5*8 *0.10 *0.16' },
          { action: 'line', x: '100*0.15 +  100*0.46 *0.16', y: '60*0.24 +60/5*8 *0.16 *0.16' },
          { action: 'line', x: '100*0.15 +  100*0.37 *0.16', y: '60*0.24 +60/5*8 *0.16 *0.16' },
          { action: 'line', x: '100*0.15 +  100*0.33 *0.16', y: '60*0.24 +60/5*8 *0.25 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.38 *0.16', y: '60*0.24 +60/5*8 *0.31 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.36 *0.16', y: '60*0.24 +60/5*8 *0.37 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.29 *0.16', y: '60*0.24 +60/5*8 *0.39 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.25 *0.16', y: '60*0.24 +60/5*8 *0.35 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.16 *0.16', y: '60*0.24 +60/5*8 *0.37 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.16 *0.16', y: '60*0.24 +60/5*8 *0.46 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.10 *0.16', y: '60*0.24 +60/5*8 *0.48 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.04 *0.16', y: '60*0.24 +60/5*8 *0.46 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.04 *0.16', y: '60*0.24 +60/5*8 *0.37 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.04 *0.16', y: '60*0.24 +60/5*8 *0.33 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.12 *0.16', y: '60*0.24 +60/5*8 *0.38 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.18 *0.16', y: '60*0.24 +60/5*8 *0.37 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.21 *0.16', y: '60*0.24 +60/5*8 *0.33 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.14 *0.16', y: '60*0.24 +60/5*8 *0.25 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.16 *0.16', y: '60*0.24 +60/5*8 *0.16 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.26 *0.16', y: '60*0.24 +60/5*8 *0.16 *0.16' },
          { action: 'close' },
          { action: 'move', x: '100*0.15 -100*0.01 *0.16', y: '60*0.24 +60/5*8 *0.01 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.01 *0.16', y: '60*0.24 - 60*0.01 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.04 *0.16', y: '60*0.24 + 60*0.01 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.08 *0.16', y: '60*0.24 + 60*0.01 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.08 *0.16', y: '60*0.24 - 60*0.03 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.12 *0.16', y: '60*0.24 - 60*0.03 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.12 *0.16', y: '60*0.24 - 60*0.0 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.15 *0.16', y: '60*0.24 + 60*0.02 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.18 *0.16', y: '60*0.24 -60*0.01 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.22 *0.16', y: '60*0.24 + 60*0.01 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.18 *0.16', y: '60*0.24 + 60*0.04 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.20 *0.16', y: '60*0.24 + 60*0.08 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.25 *0.16', y: '60*0.24 + 60*0.08 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.25 *0.16', y: '60*0.24 + 60*0.12 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.20 *0.16', y: '60*0.24 + 60*0.12 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.18 *0.16', y: '60*0.24 + 60*0.16 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.21 *0.16', y: '60*0.24 + 60*0.19 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.18 *0.16', y: '60*0.24 + 60*0.22 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.15 *0.16', y: '60*0.24 + 60*0.19 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.12 *0.16', y: '60*0.24 + 60*0.21 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.12 *0.16', y: '60*0.24 + 60*0.25 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.08 *0.16', y: '60*0.24 + 60*0.26 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.08 *0.16', y: '60*0.24 + 60*0.21 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.05 *0.16', y: '60*0.24 + 60*0.18 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.01 *0.16', y: '60*0.24 + 60*0.22 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 - 100*0.02 *0.16', y: '60*0.24 + 60*0.19 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.0 *0.16', y: '60*0.24 + 60*0.16 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.0 *0.16', y: '60*0.24 + 60*0.12 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.04 *0.16', y: '60*0.24 + 60*0.12 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.04 *0.16', y: '60*0.24 + 60*0.08 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0 *0.16', y: '60*0.24 + 60*0.08 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 + 100*0.01 *0.16', y: '60*0.24 + 60*0.05 /5*8 *0.16' },
          { action: 'line', x: '100*0.15 -100*0.01 *0.16', y: '60*0.24 + 60*0.01 /5*8 *0.16' },
          { action: 'close' }
        ],
        lineStyle: { lineColor: '50,50,50' },
        fillStyle: { type: 'none' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ]
  },
  /** 脚本任务（100×70） */
  {
    name: 'scriptTask',
    title: '脚本任务',
    category: 'bpmn',
    group: 'bpmn_task',
    groupName: '任务',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 4 },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
        { action: 'line', x: 'w-4', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
        { action: 'line', x: 'w', y: 'h-4' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
        { action: 'line', x: 4, y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: '100*0.15- 100*0.05', y: '60*0.24- 60*0.1' },
          { action: 'line', x: '100*0.15 + 100*0.05', y: '60*0.24 - 60*0.1' },
          {
            action: 'curve',
            x1: '100*0.15 + 100*0.02',
            y1: '60*0.24 - 60*0.1',
            x2: '100*0.15 + 100*0.02',
            y2: '60*0.24',
            x: '100*0.15 + 100*0.04',
            y: '60*0.24'
          },
          {
            action: 'curve',
            x1: '100*0.15 + 100*0.06',
            y1: '60*0.24',
            x2: '100*0.15 + 100*0.06',
            y2: '60*0.24 + 60*0.1',
            x: '100*0.15 + 100*0.03',
            y: '60*0.24 + 60*0.1'
          },
          { action: 'line', x: '100*0.15 - 100*0.08', y: '60*0.24 + 60*0.1' },
          {
            action: 'curve',
            x1: '100*0.15 - 100*0.05',
            y1: '60*0.24 + 60*0.1',
            x2: '100*0.15 - 100*0.05',
            y2: '60*0.24',
            x: '100*0.15 - 100*0.07',
            y: '60*0.24'
          },
          {
            action: 'curve',
            x1: '100*0.15 - 100*0.09',
            y1: '60*0.24',
            x2: '100*0.15 - 100*0.09',
            y2: '60*0.24 - 60*0.1',
            x: '100*0.15 - 100*0.05',
            y: '60*0.24 - 60*0.1'
          },
          { action: 'close' },
          { action: 'move', x: '100*0.15 - 100*0.08', y: '60*0.24 - 60*0.05' },
          { action: 'line', x: '100*0.15 + 100*0.025', y: '60*0.24 - 60*0.05' },
          { action: 'move', x: '100*0.15 - 100*0.07', y: '60*0.24 - 0' },
          { action: 'line', x: '100*0.15 + 100*0.04', y: '60*0.24 - 0' },
          { action: 'move', x: '100*0.15 - 100*0.055', y: '60*0.24 + 60*0.06' },
          { action: 'line', x: '100*0.15 + 100*0.05', y: '60*0.24 + 60*0.06' }
        ],
        lineStyle: { lineColor: '50,50,50' },
        fillStyle: { type: 'none' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ]
  },
  /** 业务规则任务（100×70） */
  {
    name: 'businessRuleTask',
    title: '业务规则任务',
    category: 'bpmn',
    group: 'bpmn_task',
    groupName: '任务',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 4 },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
        { action: 'line', x: 'w-4', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
        { action: 'line', x: 'w', y: 'h-4' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
        { action: 'line', x: 4, y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: '100*0.15- 100*0.08', y: '60*0.24- 60*0.1' },
          { action: 'line', x: '100*0.15 + 100*0.08', y: '60*0.24- 60*0.1' },
          { action: 'line', x: '100*0.15 + 100*0.08', y: '60*0.24 + 60*0.1' },
          { action: 'line', x: '100*0.15 - 100*0.08', y: '60*0.24 + 60*0.1' },
          { action: 'close' },
          { action: 'move', x: '100*0.15 - 100*0.08', y: '60*0.24 - 60*0.05' },
          { action: 'line', x: '100*0.15 + 100*0.08', y: '60*0.24 - 60*0.05' },
          { action: 'move', x: '100*0.15 - 100*0.08', y: '60*0.24 + 60*0.0' },
          { action: 'line', x: '100*0.15 + 100*0.08', y: '60*0.24 + 60*0.0' },
          { action: 'move', x: '100*0.15 - 100*0.08', y: '60*0.24 + 60*0.05' },
          { action: 'line', x: '100*0.15 + 100*0.08', y: '60*0.24 + 60*0.05' },
          { action: 'move', x: '100*0.15 - 100*0.04', y: '60*0.24 - 60*0.1' },
          { action: 'line', x: '100*0.15 - 100*0.04', y: '60*0.24 + 60*0.1' }
        ],
        lineStyle: { lineColor: '50,50,50' },
        fillStyle: { type: 'none' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ]
  },
  /** 用户任务（100×70） */
  {
    name: 'userTask',
    title: '用户任务',
    category: 'bpmn',
    group: 'bpmn_task',
    groupName: '任务',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 4 },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
        { action: 'line', x: 'w-4', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
        { action: 'line', x: 'w', y: 'h-4' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
        { action: 'line', x: 4, y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: '100*0.05+ 100/11*2*0.5-100/11*2*0.2', y: '60*0.1+ 60/55*16*0.3' },
          {
            action: 'curve',
            x1: '100*0.05+ 100/11*2*0.30',
            y1: '60*0.1+ 60/55*16*0.3 - 60/55*16*0.4*2/3',
            x2: '100*0.05+ 100/11*2*0.5+100/11*2*0.2',
            y2: '60*0.1+ 60/55*16*0.3 - 60/55*16*0.4*2/3',
            x: '100*0.05+ 100/11*2*0.5+100/11*2*0.2',
            y: '60*0.1+ 60/55*16*0.3'
          },
          { action: 'line', x: '100*0.05+ 100/11*2*0.5-100/11*2*0.2', y: '60*0.1+ 60/55*16*0.3' },
          { action: 'close' },
          {
            action: 'move',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.1',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.96'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.1',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.68'
          },
          {
            action: 'quadraticCurve',
            x1: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.1',
            y1: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.45',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.35',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.45'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.35',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.58'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.60',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.58'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.60',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.45'
          },
          {
            action: 'quadraticCurve',
            x1: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.95',
            y1: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.45',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.95',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.68'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.95',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.96'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.77',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.96'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.77',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.77'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.77',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.96'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.23',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.96'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.23',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.77'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.23',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.96'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.05',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.96'
          },
          { action: 'close' },
          {
            action: 'move',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.35',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.45'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.38',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.42'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.35',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.40'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.32',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.35'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.32',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.27'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.43',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.27'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.46',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.24'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.68',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.24'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.68',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.35'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.60',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.40'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.62',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.42'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.60',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.45'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.60',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.58'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.35',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.58'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.35',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.45'
          },
          { action: 'close' }
        ],
        lineStyle: { lineColor: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ]
  },
  /** 人工活动（100×70） */
  {
    name: 'manualCallActivity',
    title: '人工活动',
    category: 'bpmn',
    group: 'bpmn_sub',
    groupName: '子流程与调用活动',
    props: { w: 100, h: 70 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: '100*0.15- 100*0.08', y: '60*0.2' },
          { action: 'line', x: '100*0.15- 100*0.04', y: '60*0.2' },
          { action: 'line', x: '100*0.15+ 100*0.01', y: '60*0.13' },
          { action: 'line', x: '100*0.15+ 100*0.04', y: '60*0.13' },
          { action: 'line', x: '100*0.15 + 100*0.04', y: '60*0.17' },
          { action: 'line', x: '100*0.15+ 100*0.01', y: '60*0.17' },
          { action: 'line', x: '100*0.15+ 100*0.1', y: '60*0.17' },
          { action: 'line', x: '100*0.15+ 100*0.1', y: '60*0.21' },
          { action: 'line', x: '100*0.15+ 100*0.01', y: '60*0.21' },
          { action: 'line', x: '100*0.15+ 100*0.06', y: '60*0.21' },
          { action: 'line', x: '100*0.15+ 100*0.06', y: '60*0.25' },
          { action: 'line', x: '100*0.15+ 100*0.01', y: '60*0.25' },
          { action: 'line', x: '100*0.15+ 100*0.06', y: '60*0.25' },
          { action: 'line', x: '100*0.15+ 100*0.06', y: '60*0.29' },
          { action: 'line', x: '100*0.15+ 100*0.06', y: '60*0.29' },
          { action: 'line', x: '100*0.15+ 100*0.04', y: '60*0.29' },
          { action: 'line', x: '100*0.15+ 100*0.04', y: '60*0.33' },
          { action: 'line', x: '100*0.15- 100*0.04', y: '60*0.33' },
          { action: 'line', x: '100*0.15- 100*0.08', y: '60*0.28' },
          { action: 'line', x: '100*0.15- 100*0.08', y: '60*0.2' },
          { action: 'close' }
        ],
        lineStyle: { lineColor: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ]
  },
  /** 脚本活动（100×70） */
  {
    name: 'scriptCallActivity',
    title: '脚本活动',
    category: 'bpmn',
    group: 'bpmn_sub',
    groupName: '子流程与调用活动',
    props: { w: 100, h: 70 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: '100*0.15- 100*0.05', y: '60*0.24- 60*0.1' },
          { action: 'line', x: '100*0.15 + 100*0.05', y: '60*0.24 - 60*0.1' },
          {
            action: 'curve',
            x1: '100*0.15 + 100*0.02',
            y1: '60*0.24 - 60*0.1',
            x2: '100*0.15 + 100*0.02',
            y2: '60*0.24',
            x: '100*0.15 + 100*0.04',
            y: '60*0.24'
          },
          {
            action: 'curve',
            x1: '100*0.15 + 100*0.06',
            y1: '60*0.24',
            x2: '100*0.15 + 100*0.06',
            y2: '60*0.24 + 60*0.1',
            x: '100*0.15 + 100*0.03',
            y: '60*0.24 + 60*0.1'
          },
          { action: 'line', x: '100*0.15 - 100*0.08', y: '60*0.24 + 60*0.1' },
          {
            action: 'curve',
            x1: '100*0.15 - 100*0.05',
            y1: '60*0.24 + 60*0.1',
            x2: '100*0.15 - 100*0.05',
            y2: '60*0.24',
            x: '100*0.15 - 100*0.07',
            y: '60*0.24'
          },
          {
            action: 'curve',
            x1: '100*0.15 - 100*0.09',
            y1: '60*0.24',
            x2: '100*0.15 - 100*0.09',
            y2: '60*0.24 - 60*0.1',
            x: '100*0.15 - 100*0.05',
            y: '60*0.24 - 60*0.1'
          },
          { action: 'close' },
          { action: 'move', x: '100*0.15 - 100*0.08', y: '60*0.24 - 60*0.05' },
          { action: 'line', x: '100*0.15 + 100*0.025', y: '60*0.24 - 60*0.05' },
          { action: 'move', x: '100*0.15 - 100*0.07', y: '60*0.24 - 0' },
          { action: 'line', x: '100*0.15 + 100*0.04', y: '60*0.24 - 0' },
          { action: 'move', x: '100*0.15 - 100*0.055', y: '60*0.24 + 60*0.06' },
          { action: 'line', x: '100*0.15 + 100*0.05', y: '60*0.24 + 60*0.06' }
        ],
        lineStyle: { lineColor: '50,50,50' },
        fillStyle: { type: 'none' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ]
  },
  /** 业务规则活动（100×70） */
  {
    name: 'businessRuleCallActivity',
    title: '业务规则活动',
    category: 'bpmn',
    group: 'bpmn_sub',
    groupName: '子流程与调用活动',
    props: { w: 100, h: 70 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: '100*0.15- 100*0.08', y: '60*0.24- 60*0.1' },
          { action: 'line', x: '100*0.15 + 100*0.08', y: '60*0.24- 60*0.1' },
          { action: 'line', x: '100*0.15 + 100*0.08', y: '60*0.24 + 60*0.1' },
          { action: 'line', x: '100*0.15 - 100*0.08', y: '60*0.24 + 60*0.1' },
          { action: 'close' },
          { action: 'move', x: '100*0.15 - 100*0.08', y: '60*0.24 - 60*0.05' },
          { action: 'line', x: '100*0.15 + 100*0.08', y: '60*0.24 - 60*0.05' },
          { action: 'move', x: '100*0.15 - 100*0.08', y: '60*0.24 + 60*0.0' },
          { action: 'line', x: '100*0.15 + 100*0.08', y: '60*0.24 + 60*0.0' },
          { action: 'move', x: '100*0.15 - 100*0.08', y: '60*0.24 + 60*0.05' },
          { action: 'line', x: '100*0.15 + 100*0.08', y: '60*0.24 + 60*0.05' },
          { action: 'move', x: '100*0.15 - 100*0.04', y: '60*0.24 - 60*0.1' },
          { action: 'line', x: '100*0.15 - 100*0.04', y: '60*0.24 + 60*0.1' }
        ],
        lineStyle: { lineColor: '50,50,50' },
        fillStyle: { type: 'none' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ]
  },
  /** 用户活动（100×70） */
  {
    name: 'userCallActivity',
    title: '用户活动',
    category: 'bpmn',
    group: 'bpmn_sub',
    groupName: '子流程与调用活动',
    props: { w: 100, h: 70 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: '100*0.05+ 100/11*2*0.5-100/11*2*0.2', y: '60*0.1+ 60/55*16*0.3' },
          {
            action: 'curve',
            x1: '100*0.05+ 100/11*2*0.30',
            y1: '60*0.1+ 60/55*16*0.3 - 60/55*16*0.4*2/3',
            x2: '100*0.05+ 100/11*2*0.5+100/11*2*0.2',
            y2: '60*0.1+ 60/55*16*0.3 - 60/55*16*0.4*2/3',
            x: '100*0.05+ 100/11*2*0.5+100/11*2*0.2',
            y: '60*0.1+ 60/55*16*0.3'
          },
          { action: 'line', x: '100*0.05+ 100/11*2*0.5-100/11*2*0.2', y: '60*0.1+ 60/55*16*0.3' },
          { action: 'close' },
          {
            action: 'move',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.1',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.96'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.1',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.68'
          },
          {
            action: 'quadraticCurve',
            x1: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.1',
            y1: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.45',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.35',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.45'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.35',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.58'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.60',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.58'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.60',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.45'
          },
          {
            action: 'quadraticCurve',
            x1: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.95',
            y1: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.45',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.95',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.68'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.95',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.96'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.77',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.96'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.77',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.77'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.77',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.96'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.23',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.96'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.23',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.77'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.23',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.96'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.05',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.96'
          },
          { action: 'close' },
          {
            action: 'move',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.35',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.45'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.38',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.42'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.35',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.40'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.32',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.35'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.32',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.27'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.43',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.27'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.46',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.24'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.68',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.24'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.68',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.35'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.60',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.40'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.62',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.42'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.60',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.45'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.60',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.58'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.35',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.58'
          },
          {
            action: 'line',
            x: '100*0.05+ 100/11*2*0.0 + 100/11*2*0.35',
            y: '60*0.1+ 60/55*16*0.0 + 60/55*16*0.45'
          },
          { action: 'close' }
        ],
        lineStyle: { lineColor: '50,50,50' },
        fillStyle: { type: 'none' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ]
  },
  /** 回调全局流程（100×70） */
  {
    name: 'callActivityCallProcess',
    title: '回调全局流程',
    category: 'bpmn',
    group: 'bpmn_sub',
    groupName: '子流程与调用活动',
    props: { w: 100, h: 70 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    attribute: { container: true }
  },
  /** 回调全局流程(展开)（200×140） */
  {
    name: 'callActivityCallProcessExpanded',
    title: '回调全局流程(展开)',
    category: 'bpmn',
    group: 'bpmn_sub',
    groupName: '子流程与调用活动',
    props: { w: 200, h: 140 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ]
  },
  /** 即席子流程（400×280） */
  {
    name: 'adHocSubProcess',
    title: '即席子流程',
    category: 'bpmn',
    group: 'bpmn_sub',
    groupName: '子流程与调用活动',
    props: { w: 400, h: 280 },
    path: [
      [
        { action: 'move', x: 0, y: 4 },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
        { action: 'line', x: 'w-4', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
        { action: 'line', x: 'w', y: 'h-4' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
        { action: 'line', x: 4, y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
        { action: 'close' }
      ]
    ],
    attribute: { container: true, rotatable: false, collapsable: true, collapsed: false }
  },
  /** 事物子流程（400×280） */
  {
    name: 'transactionSubProcess',
    title: '事物子流程',
    category: 'bpmn',
    group: 'bpmn_sub',
    groupName: '子流程与调用活动',
    props: { w: 400, h: 280 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' }
      },
      {
        actions: [
          { action: 'move', x: 'w * 0 +3', y: 'h * 0 + h/30 +3' },
          {
            action: 'quadraticCurve',
            x1: 'w * 0 +3 +1',
            y1: 'h * 0 +3 +1',
            x: 'w * 0 + h/30 +3',
            y: 'h * 0  +3'
          },
          { action: 'line', x: 'w * 1 - h/30 -3', y: 'h * 0 +3' },
          { action: 'quadraticCurve', x1: 'w * 1 -3', y1: 'h * 0+3', x: 'w * 1  -3', y: 'h * 0 + h/30 +3' },
          { action: 'line', x: 'w * 1 -3', y: 'h * 1 - h/30-3' },
          { action: 'quadraticCurve', x1: 'w * 1 -3', y1: 'h * 1 -3', x: 'w * 1 - h/30-3', y: 'h * 1 -3' },
          { action: 'line', x: 'w * 0 + h/30 +3', y: 'h * 1 -3' },
          { action: 'quadraticCurve', x1: 'w * 0+3', y1: 'h * 1-3', x: 'w * 0 +3', y: 'h * 1 - h/30 -3' },
          { action: 'line', x: 'w * 0 + 3', y: 'h * 0 + h/30+3' },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' }
      }
    ],
    attribute: { container: true, rotatable: false, collapsable: true, collapsed: false }
  },
  /** 事件子流程（400×280） */
  {
    name: 'ebSubProcess',
    title: '事件子流程',
    category: 'bpmn',
    group: 'bpmn_sub',
    groupName: '子流程与调用活动',
    props: { w: 400, h: 280 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 4 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
          { action: 'line', x: 'w-4', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
          { action: 'line', x: 'w', y: 'h-4' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
          { action: 'line', x: 4, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
          { action: 'close' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      }
    ],
    attribute: { container: true, rotatable: false, collapsable: true, collapsed: false }
  },
  /** 互斥网关（50×50） */
  {
    name: 'exclusiveGateway',
    title: '互斥网关',
    category: 'bpmn',
    group: 'bpmn_gateway',
    groupName: '网关',
    props: { w: 50, h: 50 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 0 },
        { action: 'line', x: 'w', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h' },
        { action: 'line', x: 0, y: 'h*0.5' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.5 + w*0.5*0.4 - w*0.02', y: 'h*0.5 - h*0.5*0.4 - h*0.02' },
          { action: 'line', x: 'w*0.5 - w*0.5*0.4 - w*0.02', y: 'h*0.5 + h*0.5*0.4 - h*0.02' },
          { action: 'line', x: 'w*0.5 - w*0.5*0.4 + w*0.02', y: 'h*0.5 + h*0.5*0.4 + h*0.02' },
          { action: 'line', x: 'w*0.5 + w*0.5*0.4 + w*0.02', y: 'h*0.5 - h*0.5*0.4 + h*0.02' },
          { action: 'line', x: 'w*0.5 + w*0.5*0.4 - w*0.02', y: 'h*0.5 - h*0.5*0.4 - h*0.02' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.5' },
          { action: 'move', x: 'w*0.5 - w*0.5*0.4 + w*0.02', y: 'h*0.5 - h*0.5*0.4 - h*0.02' },
          { action: 'line', x: 'w*0.5 + w*0.5*0.4 + w*0.02', y: 'h*0.5 + h*0.5*0.4 - h*0.02' },
          { action: 'line', x: 'w*0.5 + w*0.5*0.4 - w*0.02', y: 'h*0.5 + h*0.5*0.4 + h*0.02' },
          { action: 'line', x: 'w*0.5 - w*0.5*0.4 - w*0.02', y: 'h*0.5 - h*0.5*0.4 + h*0.02' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 0 },
          { action: 'line', x: 'w', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 'h' },
          { action: 'line', x: 0, y: 'h*0.5' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 相容网关（50×50） */
  {
    name: 'inclusiveGateway',
    title: '相容网关',
    category: 'bpmn',
    group: 'bpmn_gateway',
    groupName: '网关',
    props: { w: 50, h: 50 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 0 },
        { action: 'line', x: 'w', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h' },
        { action: 'line', x: 0, y: 'h*0.5' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5 - w*0.25', y: 'h*0.5' },
        {
          action: 'curve',
          x1: 'w*0.5 - w*0.25',
          y1: 'h*0.5 - h*2/3*0.5',
          x2: 'w*0.5 + w*0.25',
          y2: 'h*0.5 - h*2/3*0.5',
          x: 'w*0.5 + w*0.25',
          y: 'h*0.5'
        },
        {
          action: 'curve',
          x1: 'w*0.5 + w*0.25',
          y1: 'h*0.5 + h*2/3*0.5',
          x2: 'w*0.5 - w*0.25',
          y2: 'h*0.5 + h*2/3*0.5',
          x: 'w*0.5 - w*0.25',
          y: 'h*0.5'
        },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 0 },
          { action: 'line', x: 'w', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 'h' },
          { action: 'line', x: 0, y: 'h*0.5' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 复杂网关（50×50） */
  {
    name: 'complexGateway',
    title: '复杂网关',
    category: 'bpmn',
    group: 'bpmn_gateway',
    groupName: '网关',
    props: { w: 50, h: 50 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 0 },
        { action: 'line', x: 'w', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h' },
        { action: 'line', x: 0, y: 'h*0.5' },
        { action: 'close' }
      ],
      {
        actions: [
          {
            action: 'move',
            x: 'w*0.5 - Math.min(w,h)*0.5*0.3 + Math.min(w,h)*0.02',
            y: 'h*0.5 - Math.min(w,h)*0.5*0.3 - Math.min(w,h)*0.02'
          },
          {
            action: 'line',
            x: 'w*0.5 + Math.min(w,h)*0.5*0.3 + Math.min(w,h)*0.02',
            y: 'h*0.5 + Math.min(w,h)*0.5*0.3 - Math.min(w,h)*0.03'
          },
          {
            action: 'line',
            x: 'w*0.5 + Math.min(w,h)*0.5*0.3 - Math.min(w,h)*0.02',
            y: 'h*0.5 + Math.min(w,h)*0.5*0.3 + Math.min(w,h)*0.02'
          },
          {
            action: 'line',
            x: 'w*0.5 - Math.min(w,h)*0.5*0.3 - Math.min(w,h)*0.02',
            y: 'h*0.5 - Math.min(w,h)*0.5*0.3 + Math.min(w,h)*0.02'
          },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          {
            action: 'move',
            x: 'w*0.5 + Math.min(w,h)*0.5*0.3 - Math.min(w,h)*0.02',
            y: 'h*0.5 - Math.min(w,h)*0.5*0.3 - Math.min(w,h)*0.02'
          },
          {
            action: 'line',
            x: 'w*0.5 - Math.min(w,h)*0.5*0.3 - Math.min(w,h)*0.02',
            y: 'h*0.5 + Math.min(w,h)*0.5*0.3 - Math.min(w,h)*0.02'
          },
          {
            action: 'line',
            x: 'w*0.5 - Math.min(w,h)*0.5*0.3 + Math.min(w,h)*0.02',
            y: 'h*0.5 + Math.min(w,h)*0.5*0.3 + Math.min(w,h)*0.02'
          },
          {
            action: 'line',
            x: 'w*0.5 + Math.min(w,h)*0.5*0.3 + Math.min(w,h)*0.02',
            y: 'h*0.5 - Math.min(w,h)*0.5*0.3 + Math.min(w,h)*0.02'
          },
          {
            action: 'line',
            x: 'w*0.5 + Math.min(w,h)*0.5*0.3 - Math.min(w,h)*0.02',
            y: 'h*0.5 - Math.min(w,h)*0.5*0.3 - Math.min(w,h)*0.02'
          },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.5 - Math.min(w,h)*0.027', y: 'h*0.5 - Math.min(w,h)*0.5*0.4' },
          { action: 'line', x: 'w*0.5 - Math.min(w,h)*0.027', y: 'h*0.5 + Math.min(w,h)*0.5*0.4' },
          { action: 'line', x: 'w*0.5 + Math.min(w,h)*0.027', y: 'h*0.5 + Math.min(w,h)*0.5*0.4' },
          { action: 'line', x: 'w*0.5 + Math.min(w,h)*0.027', y: 'h*0.5 - Math.min(w,h)*0.5*0.4' },
          { action: 'line', x: 'w*0.5 - Math.min(w,h)*0.027', y: 'h*0.5 - Math.min(w,h)*0.5*0.4' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.5 - Math.min(w,h)*0.5*0.4', y: 'h*0.5 - Math.min(w,h)*0.027' },
          { action: 'line', x: 'w*0.5 - Math.min(w,h)*0.5*0.4', y: 'h*0.5 + Math.min(w,h)*0.027' },
          { action: 'line', x: 'w*0.5 + Math.min(w,h)*0.5*0.4', y: 'h*0.5 + Math.min(w,h)*0.027' },
          { action: 'line', x: 'w*0.5 + Math.min(w,h)*0.5*0.4', y: 'h*0.5 - Math.min(w,h)*0.027' },
          { action: 'line', x: 'w*0.5 - Math.min(w,h)*0.5*0.4', y: 'h*0.5 - Math.min(w,h)*0.027' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 0 },
          { action: 'line', x: 'w', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 'h' },
          { action: 'line', x: 0, y: 'h*0.5' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 事件网关（50×50） */
  {
    name: 'eventBasedGateway',
    title: '事件网关',
    category: 'bpmn',
    group: 'bpmn_gateway',
    groupName: '网关',
    props: { w: 50, h: 50 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 0 },
        { action: 'line', x: 'w', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h' },
        { action: 'line', x: 0, y: 'h*0.5' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5 - w*0.5/55*32', y: 'h*0.5' },
        {
          action: 'curve',
          x1: 'w*0.5 - w*0.5/55*32',
          y1: 'h*0.5 - h/55*32*2/3',
          x2: 'w*0.5 + w*0.5/55*32',
          y2: 'h*0.5 - h/55*32*2/3',
          x: 'w*0.5 + w*0.5/55*32',
          y: 'h*0.5'
        },
        {
          action: 'curve',
          x1: 'w*0.5 + w*0.5/55*32',
          y1: 'h*0.5 + h/55*32*2/3',
          x2: 'w*0.5 - w*0.5/55*32',
          y2: 'h*0.5 + h/55*32*2/3',
          x: 'w*0.5 - w*0.5/55*32',
          y: 'h*0.5'
        },
        { action: 'close' },
        { action: 'move', x: 'w*0.5 - w*0.4/55*32', y: 'h*0.5' },
        {
          action: 'curve',
          x1: 'w*0.5 - w*0.4/55*32',
          y1: 'h*0.5 - h/55*32*2/3*0.8',
          x2: 'w*0.5+w*0.4/55*32',
          y2: 'h*0.5 - h/55*32*2/3*0.8',
          x: 'w*0.5 + w*0.4/55*32',
          y: 'h*0.5'
        },
        {
          action: 'curve',
          x1: 'w*0.5 + w*0.4/55*32',
          y1: 'h*0.5 + h/55*32*2/3*0.8',
          x2: 'w*0.5 - w*0.4/55*32',
          y2: 'h*0.5 + h/55*32*2/3*0.8',
          x: 'w*0.5 - w*0.4/55*32',
          y: 'h*0.5'
        },
        { action: 'close' },
        { action: 'move', x: 'w*0.5', y: 'h*0.5 - h/55*32*0.28' },
        { action: 'line', x: 'w*0.5+ w/55*32*0.28', y: 'h*0.5- h/55*32*0.08' },
        { action: 'line', x: 'w*0.5+ w/55*32*0.17', y: 'h*0.5+h/55*32*0.25' },
        { action: 'line', x: 'w*0.5- w/55*32*0.17', y: 'h*0.5+ h/55*32*0.25' },
        { action: 'line', x: 'w*0.5- w/55*32*0.28', y: 'h*0.5-h/55*32*0.08' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h/55*32*0.28' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 0 },
          { action: 'line', x: 'w', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 'h' },
          { action: 'line', x: 0, y: 'h*0.5' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 实例化事件网关（50×50） */
  {
    name: 'eventBasedStartGateway',
    title: '实例化事件网关',
    category: 'bpmn',
    group: 'bpmn_gateway',
    groupName: '网关',
    props: { w: 50, h: 50 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 0 },
        { action: 'line', x: 'w', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h' },
        { action: 'line', x: 0, y: 'h*0.5' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5 - w*0.5/55*32', y: 'h*0.5' },
        {
          action: 'curve',
          x1: 'w*0.5 - w*0.5/55*32',
          y1: 'h*0.5 - h/55*32*2/3',
          x2: 'w*0.5 + w*0.5/55*32',
          y2: 'h*0.5 - h/55*32*2/3',
          x: 'w*0.5 + w*0.5/55*32',
          y: 'h*0.5'
        },
        {
          action: 'curve',
          x1: 'w*0.5 + w*0.5/55*32',
          y1: 'h*0.5 + h/55*32*2/3',
          x2: 'w*0.5 - w*0.5/55*32',
          y2: 'h*0.5 + h/55*32*2/3',
          x: 'w*0.5 - w*0.5/55*32',
          y: 'h*0.5'
        },
        { action: 'close' },
        { action: 'move', x: 'w*0.5', y: 'h*0.5 - h/55*32*0.28' },
        { action: 'line', x: 'w*0.5+ w/55*32*0.28', y: 'h*0.5- h/55*32*0.08' },
        { action: 'line', x: 'w*0.5+ w/55*32*0.17', y: 'h*0.5+h/55*32*0.25' },
        { action: 'line', x: 'w*0.5- w/55*32*0.17', y: 'h*0.5+ h/55*32*0.25' },
        { action: 'line', x: 'w*0.5- w/55*32*0.28', y: 'h*0.5-h/55*32*0.08' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5-h/55*32*0.28' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 0 },
          { action: 'line', x: 'w', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 'h' },
          { action: 'line', x: 0, y: 'h*0.5' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 并行网关（50×50） */
  {
    name: 'parallelGateway',
    title: '并行网关',
    category: 'bpmn',
    group: 'bpmn_gateway',
    groupName: '网关',
    props: { w: 50, h: 50 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 0 },
        { action: 'line', x: 'w', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h' },
        { action: 'line', x: 0, y: 'h*0.5' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.5 - Math.min(w,h)*0.04', y: 'h*0.5 - h*0.5*0.5' },
          { action: 'line', x: 'w*0.5 - Math.min(w,h)*0.04', y: 'h*0.5 + h*0.5*0.5' },
          { action: 'line', x: 'w*0.5 + Math.min(w,h)*0.04', y: 'h*0.5 + h*0.5*0.5' },
          { action: 'line', x: 'w*0.5 + Math.min(w,h)*0.04', y: 'h*0.5 - h*0.5*0.5' },
          { action: 'line', x: 'w*0.5 - Math.min(w,h)*0.04', y: 'h*0.5 - h*0.5*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.5 - w*0.5*0.5', y: 'h*0.5 - Math.min(w,h)*0.04' },
          { action: 'line', x: 'w*0.5 - w*0.5*0.5', y: 'h*0.5 + Math.min(w,h)*0.04' },
          { action: 'line', x: 'w*0.5 + w*0.5*0.5', y: 'h*0.5 + Math.min(w,h)*0.04' },
          { action: 'line', x: 'w*0.5 + w*0.5*0.5', y: 'h*0.5 - Math.min(w,h)*0.04' },
          { action: 'line', x: 'w*0.5 - w*0.5*0.5', y: 'h*0.5 - Math.min(w,h)*0.04' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 0 },
          { action: 'line', x: 'w', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 'h' },
          { action: 'line', x: 0, y: 'h*0.5' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 实例化并行网关（50×50） */
  {
    name: 'parallelEBGateway',
    title: '实例化并行网关',
    category: 'bpmn',
    group: 'bpmn_gateway',
    groupName: '网关',
    props: { w: 50, h: 50 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 0 },
        { action: 'line', x: 'w', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h' },
        { action: 'line', x: 0, y: 'h*0.5' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5 - w*0.25', y: 'h*0.5' },
        {
          action: 'curve',
          x1: 'w*0.5 - w*0.25',
          y1: 'h*0.5 - h*2/3*0.5',
          x2: 'w*0.5 + w*0.25',
          y2: 'h*0.5 - h*2/3*0.5',
          x: 'w*0.5 + w*0.25',
          y: 'h*0.5'
        },
        {
          action: 'curve',
          x1: 'w*0.5 + w*0.25',
          y1: 'h*0.5 + h*2/3*0.5',
          x2: 'w*0.5 - w*0.25',
          y2: 'h*0.5 + h*2/3*0.5',
          x: 'w*0.5 - w*0.25',
          y: 'h*0.5'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5 - Math.min(w,h)*0.027', y: 'h*0.5 - Math.min(w,h)*0.5*0.4' },
        { action: 'line', x: 'w*0.5 - Math.min(w,h)*0.027', y: 'h*0.5 - Math.min(w,h)*0.02' },
        { action: 'line', x: 'w*0.5 - Math.min(w,h)*0.5*0.4', y: 'h*0.5 - Math.min(w,h)*0.027' },
        { action: 'line', x: 'w*0.5 - Math.min(w,h)*0.5*0.4', y: 'h*0.5 + Math.min(w,h)*0.027' },
        { action: 'line', x: 'w*0.5 - Math.min(w,h)*0.027', y: 'h*0.5 + Math.min(w,h)*0.027' },
        { action: 'line', x: 'w*0.5 - Math.min(w,h)*0.027', y: 'h*0.5 + Math.min(w,h)*0.5*0.4' },
        { action: 'line', x: 'w*0.5 + Math.min(w,h)*0.027', y: 'h*0.5 + Math.min(w,h)*0.5*0.4' },
        { action: 'line', x: 'w*0.5 + Math.min(w,h)*0.027', y: 'h*0.5 + Math.min(w,h)*0.027' },
        { action: 'line', x: 'w*0.5 + Math.min(w,h)*0.5*0.4', y: 'h*0.5 + Math.min(w,h)*0.027' },
        { action: 'line', x: 'w*0.5 + Math.min(w,h)*0.5*0.4', y: 'h*0.5 - Math.min(w,h)*0.027' },
        { action: 'line', x: 'w*0.5 + Math.min(w,h)*0.027', y: 'h*0.5 - Math.min(w,h)*0.027' },
        { action: 'line', x: 'w*0.5 + Math.min(w,h)*0.027', y: 'h*0.5 - Math.min(w,h)*0.5*0.4' },
        { action: 'line', x: 'w*0.5 - Math.min(w,h)*0.027', y: 'h*0.5 - Math.min(w,h)*0.5*0.4' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 0 },
          { action: 'line', x: 'w', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 'h' },
          { action: 'line', x: 0, y: 'h*0.5' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 输入数据对象（90×120） */
  {
    name: 'dataInObject',
    title: '输入数据对象',
    category: 'bpmn',
    group: 'bpmn_data',
    groupName: '数据对象',
    props: { w: 90, h: 120 },
    path: [
      [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: 0, y: 'h' },
        { action: 'line', x: 'w', y: 'h' },
        { action: 'line', x: 'w', y: 'h*0.25' },
        { action: 'line', x: 'w*2/3', y: 0 },
        { action: 'line', x: 0, y: 0 },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*2/3', y: 0 },
        { action: 'line', x: 'w*2/3', y: 'h*0.25' },
        { action: 'line', x: 'w', y: 'h*0.25' }
      ],
      [
        { action: 'move', x: 'w/3/4', y: 'h/4/3+3' },
        { action: 'line', x: 'w/3/4*3.5', y: 'h/4/3+3' },
        { action: 'line', x: 'w/3/4*3.5', y: 'h/4/3-h/4/5+3' },
        { action: 'line', x: 'w/3/4*5', y: 'h/4/2+3' },
        { action: 'line', x: 'w/3/4*3.5', y: 'h/4/2+h/4/2-h/4/3+h/4/5+3' },
        { action: 'line', x: 'w/3/4*3.5', y: 'h/4/2+h/4/2-h/4/3+3' },
        { action: 'line', x: 'w/3/4', y: 'h/4/2+h/4/2-h/4/3+3' },
        { action: 'line', x: 'w/3/4', y: 'h/4/3+3' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ]
  },
  /** 输出数据对象（90×120） */
  {
    name: 'dataOutObject',
    title: '输出数据对象',
    category: 'bpmn',
    group: 'bpmn_data',
    groupName: '数据对象',
    props: { w: 90, h: 120 },
    path: [
      [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: 0, y: 'h' },
        { action: 'line', x: 'w', y: 'h' },
        { action: 'line', x: 'w', y: 'h*0.25' },
        { action: 'line', x: 'w*2/3', y: 0 },
        { action: 'line', x: 0, y: 0 },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*2/3', y: 0 },
        { action: 'line', x: 'w*2/3', y: 'h*0.25' },
        { action: 'line', x: 'w', y: 'h*0.25' }
      ],
      {
        actions: [
          { action: 'move', x: 'w/3/4', y: 'h/4/3+3' },
          { action: 'line', x: 'w/3/4*3.5', y: 'h/4/3+3' },
          { action: 'line', x: 'w/3/4*3.5', y: 'h/4/3-h/4/5+3' },
          { action: 'line', x: 'w/3/4*5', y: 'h/4/2+3' },
          { action: 'line', x: 'w/3/4*3.5', y: 'h/4/2+h/4/2-h/4/3+h/4/5+3' },
          { action: 'line', x: 'w/3/4*3.5', y: 'h/4/2+h/4/2-h/4/3+3' },
          { action: 'line', x: 'w/3/4', y: 'h/4/2+h/4/2-h/4/3+3' },
          { action: 'line', x: 'w/3/4', y: 'h/4/3+3' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '50,50,50' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ]
  },
  /** 子对话（45×40） */
  {
    name: 'subConversation',
    title: '子对话',
    category: 'bpmn',
    group: 'bpmn_collab',
    groupName: '对话与编排',
    props: { w: 45, h: 40 },
    path: [
      [
        { action: 'move', x: 'Math.min(w,h)*0.21', y: 0 },
        { action: 'line', x: 'w-Math.min(w,h)*0.21', y: 0 },
        { action: 'line', x: 'w', y: 'h*0.5' },
        { action: 'line', x: 'w-Math.min(w,h)*0.21', y: 'h' },
        { action: 'line', x: 'Math.min(w,h)*0.21', y: 'h' },
        { action: 'line', x: 0, y: 'h*0.5' },
        { action: 'line', x: 'Math.min(w,h)*0.21', y: 0 },
        { action: 'close' }
      ]
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }],
    attribute: { container: true }
  },
  /** 回调对话(全局)（45×40） */
  {
    name: 'callConversation',
    title: '回调对话(全局)',
    category: 'bpmn',
    group: 'bpmn_collab',
    groupName: '对话与编排',
    props: { w: 45, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 'Math.min(w,h)*0.21', y: 0 },
          { action: 'line', x: 'w-Math.min(w,h)*0.21', y: 0 },
          { action: 'line', x: 'w', y: 'h*0.5' },
          { action: 'line', x: 'w-Math.min(w,h)*0.21', y: 'h' },
          { action: 'line', x: 'Math.min(w,h)*0.21', y: 'h' },
          { action: 'line', x: 0, y: 'h*0.5' },
          { action: 'line', x: 'Math.min(w,h)*0.21', y: 0 },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }]
  },
  /** 回调对话(协作)（45×40） */
  {
    name: 'callCollabConversation',
    title: '回调对话(协作)',
    category: 'bpmn',
    group: 'bpmn_collab',
    groupName: '对话与编排',
    props: { w: 45, h: 40 },
    path: [
      {
        actions: [
          { action: 'move', x: 'Math.min(w,h)*0.21', y: 0 },
          { action: 'line', x: 'w-Math.min(w,h)*0.21', y: 0 },
          { action: 'line', x: 'w', y: 'h*0.5' },
          { action: 'line', x: 'w-Math.min(w,h)*0.21', y: 'h' },
          { action: 'line', x: 'Math.min(w,h)*0.21', y: 'h' },
          { action: 'line', x: 0, y: 'h*0.5' },
          { action: 'line', x: 'Math.min(w,h)*0.21', y: 0 },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 }
      }
    ],
    textBlock: [{ position: { x: 'w/2-60', y: 'h', w: 120, h: 30 }, text: '' }],
    attribute: { container: true }
  },
  /** 子编排任务（120×120） */
  {
    name: 'subChoreography',
    title: '子编排任务',
    category: 'bpmn',
    group: 'bpmn_collab',
    groupName: '对话与编排',
    props: { w: 120, h: 120 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 6 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 6, y: 0 },
          { action: 'line', x: 'w-6', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 6 },
          { action: 'line', x: 'w', y: 'h-6' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-6', y: 'h' },
          { action: 'line', x: 6, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-6' },
          { action: 'line', x: 0, y: 6 },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h-25' },
          { action: 'line', x: 'w', y: 'h-25' },
          { action: 'line', x: 'w', y: 'h-6' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-6', y: 'h' },
          { action: 'line', x: 6, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-6' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '205,205,205' }
      },
      [{ action: 'move', x: 0, y: 25 }, { action: 'line', x: 'w', y: 25 }],
      [{ action: 'move', x: 0, y: 'h-25' }, { action: 'line', x: 'w', y: 'h-25' }],
      {
        actions: [
          { action: 'move', x: 0, y: 6 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 6, y: 0 },
          { action: 'line', x: 'w-6', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 6 },
          { action: 'line', x: 'w', y: 'h-6' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-6', y: 'h' },
          { action: 'line', x: 6, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-6' },
          { action: 'line', x: 0, y: 6 },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [
      { position: { x: 5, y: 30, w: 'w-10', h: 'h-60' }, text: '子编排任务' },
      { position: { x: 5, y: 0, w: 'w-10', h: 25 }, text: '参与者 A' },
      { position: { x: 5, y: 'h-25', w: 'w-10', h: 25 }, text: '参与者 B' }
    ],
    attribute: { markerOffset: 30 }
  },
  /** 回调编排任务(全局)（120×120） */
  {
    name: 'callChoreographyGlobal',
    title: '回调编排任务(全局)',
    category: 'bpmn',
    group: 'bpmn_collab',
    groupName: '对话与编排',
    props: { w: 120, h: 120 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 6 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 6, y: 0 },
          { action: 'line', x: 'w-6', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 6 },
          { action: 'line', x: 'w', y: 'h-6' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-6', y: 'h' },
          { action: 'line', x: 6, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-6' },
          { action: 'line', x: 0, y: 6 },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h-25' },
          { action: 'line', x: 'w', y: 'h-25' },
          { action: 'line', x: 'w', y: 'h-6' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-6', y: 'h' },
          { action: 'line', x: 6, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-6' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '205,205,205' }
      },
      {
        actions: [{ action: 'move', x: 0, y: 25 }, { action: 'line', x: 'w', y: 25 }],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [{ action: 'move', x: 0, y: 'h-25' }, { action: 'line', x: 'w', y: 'h-25' }],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 6 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 6, y: 0 },
          { action: 'line', x: 'w-6', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 6 },
          { action: 'line', x: 'w', y: 'h-6' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-6', y: 'h' },
          { action: 'line', x: 6, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-6' },
          { action: 'line', x: 0, y: 6 },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [
      { position: { x: 5, y: 30, w: 'w-10', h: 'h-60' }, text: '' },
      { position: { x: 5, y: 0, w: 'w-10', h: 25 }, text: '参与者 A' },
      { position: { x: 5, y: 'h-25', w: 'w-10', h: 25 }, text: '参与者 B' }
    ],
    attribute: { markerOffset: 30 }
  },
  /** 回调编排任务(编排)（120×120） */
  {
    name: 'callChoreography',
    title: '回调编排任务(编排)',
    category: 'bpmn',
    group: 'bpmn_collab',
    groupName: '对话与编排',
    props: { w: 120, h: 120 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 6 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 6, y: 0 },
          { action: 'line', x: 'w-6', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 6 },
          { action: 'line', x: 'w', y: 'h-6' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-6', y: 'h' },
          { action: 'line', x: 6, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-6' },
          { action: 'line', x: 0, y: 6 },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h-25' },
          { action: 'line', x: 'w', y: 'h-25' },
          { action: 'line', x: 'w', y: 'h-6' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-6', y: 'h' },
          { action: 'line', x: 6, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-6' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '205,205,205' }
      },
      {
        actions: [{ action: 'move', x: 0, y: 25 }, { action: 'line', x: 'w', y: 25 }],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [{ action: 'move', x: 0, y: 'h-25' }, { action: 'line', x: 'w', y: 'h-25' }],
        lineStyle: { lineWidth: 3.5 }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 6 },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 6, y: 0 },
          { action: 'line', x: 'w-6', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 6 },
          { action: 'line', x: 'w', y: 'h-6' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-6', y: 'h' },
          { action: 'line', x: 6, y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-6' },
          { action: 'line', x: 0, y: 6 },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 3.5 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [
      { position: { x: 5, y: 30, w: 'w-10', h: 'h-60' }, text: '' },
      { position: { x: 5, y: 0, w: 'w-10', h: 25 }, text: '参与者 A' },
      { position: { x: 5, y: 'h-25', w: 'w-10', h: 25 }, text: '参与者 B' }
    ],
    attribute: { markerOffset: 30 }
  }
]
