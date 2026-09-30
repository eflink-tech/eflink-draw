// ═══════════════════════════════════════════
// 旧系统 epc.js 中尚未移植的 10 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category epc（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const epcLegacyShapes: ShapeDefinition[] = [
  /** 事件（100×70） */
  {
    name: 'event',
    title: '事件',
    category: 'epc',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.5' },
        { action: 'line', x: 'Math.min(h/2,w/6)', y: 0 },
        { action: 'line', x: 'w-Math.min(h/2,w/6)', y: 0 },
        { action: 'line', x: 'w', y: 'h*0.5' },
        { action: 'line', x: 'w-Math.min(h/2,w/6)', y: 'h' },
        { action: 'line', x: 'Math.min(h/2,w/6)', y: 'h' },
        { action: 'line', x: 0, y: 'h*0.5' },
        { action: 'close' }
      ]
    ],
    lineStyle: { lineWidth: 2, lineColor: '165,8,179' },
    fillStyle: { type: 'solid', color: '209,43,224' }
  },
  /** 功能（100×70） */
  {
    name: 'method',
    title: '功能',
    category: 'epc',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 'w*0', y: 5 },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 5, y: 0 },
        { action: 'line', x: 'w-5', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 5 },
        { action: 'line', x: 'w', y: 'h-5' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-5', y: 'h' },
        { action: 'line', x: 5, y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-5' },
        { action: 'line', x: 0, y: 5 },
        { action: 'close' }
      ]
    ],
    lineStyle: { lineWidth: 2, lineColor: '0,100,0' },
    fillStyle: { type: 'solid', color: '0,180,0' }
  },
  /** 流程路径（100×70） */
  {
    name: 'procedure',
    title: '流程路径',
    category: 'epc',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: '4*0.8' },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: '4*0.8', y: 0 },
        { action: 'line', x: '(w-4)*0.8', y: 0 },
        { action: 'quadraticCurve', x1: 'w*0.8', y1: 0, x: 'w*0.8', y: '4*0.8' },
        { action: 'line', x: 'w*0.8', y: '(h-4)*0.8' },
        { action: 'quadraticCurve', x1: 'w*0.8', y1: 'h*0.8', x: '(w-4)*0.8', y: 'h*0.8' },
        { action: 'line', x: '4*0.8', y: 'h*0.8' },
        { action: 'quadraticCurve', x1: 0, y1: 'h*0.8', x: 0, y: '(h-4)*0.8' },
        { action: 'line', x: 0, y: '4*0.8' },
        { action: 'move', x: 'w*0.8', y: 6 },
        { action: 'line', x: 'w', y: 'h*0.5' },
        { action: 'line', x: '(w-4)*0.8', y: 'h' },
        { action: 'line', x: 'w*3/8', y: 'h' },
        { action: 'line', x: 'w/4', y: 'h*0.8' },
        { action: 'line', x: '(w-4)*0.8', y: 'h*0.8' },
        { action: 'quadraticCurve', x1: 'w*0.8', y1: 'h*0.8', x: 'w*0.8', y: '(h-4)*0.8' }
      ]
    ],
    textBlock: [{ position: { x: 0, y: 0, w: 'w*0.8', h: 'h*0.8' }, text: '' }],
    lineStyle: { lineWidth: 2, lineColor: '68,170,170' },
    fillStyle: { type: 'solid', color: '160,255,255' }
  },
  /** 数据（100×70） */
  {
    name: 'epcData',
    title: '数据',
    category: 'epc',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: 'w', y: 0 },
        { action: 'line', x: 'w', y: 'h' },
        { action: 'line', x: 0, y: 'h' },
        { action: 'line', x: 0, y: 0 },
        { action: 'close' }
      ]
    ],
    lineStyle: { lineWidth: 2, lineColor: '11,108,195' },
    fillStyle: { type: 'solid', color: '137,157,192' }
  },
  /** 表单（100×70） */
  {
    name: 'form',
    title: '表单',
    category: 'epc',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 'h-Math.min(Math.min(w,h)/8,w/12)' },
        { action: 'line', x: 0, y: 0 },
        { action: 'line', x: 'w', y: 0 },
        { action: 'line', x: 'w', y: 'h-Math.min(Math.min(w,h)/8,w/12)' },
        {
          action: 'quadraticCurve',
          x1: 'w*0.75',
          y1: 'h-3*Math.min(Math.min(w,h)/8,w/12)',
          x: 'w*0.5',
          y: 'h-Math.min(Math.min(w,h)/8,w/12)'
        },
        {
          action: 'quadraticCurve',
          x1: 'w*0.25',
          y1: 'h+Math.min(Math.min(w,h)/8,w/12)',
          x: 0,
          y: 'h-Math.min(Math.min(w,h)/8,w/12)'
        },
        { action: 'close' }
      ]
    ],
    anchors: [
      { x: 'w*0.5', y: '0' },
      { x: 'w', y: 'h*0.5' },
      { x: 'w*0.5', y: 'h-Math.min(Math.min(w,h)/8,w/12)' },
      { x: '0', y: 'h*0.5' }
    ],
    textBlock: [{ position: { x: 0, y: 0, w: 'w', h: 'h*0.9' }, text: '' }],
    lineStyle: { lineWidth: 2, lineColor: '11,108,195' },
    fillStyle: { type: 'solid', color: '137,157,192' }
  },
  /** 多个表单（100×70） */
  {
    name: 'forms',
    title: '多个表单',
    category: 'epc',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.2' },
        { action: 'line', x: 'w*0.1', y: 'h*0.2' },
        { action: 'line', x: 'w*0.1', y: 'h*0.1' },
        { action: 'line', x: 'w*0.2', y: 'h*0.1' },
        { action: 'line', x: 'w*0.2', y: 0 },
        { action: 'line', x: 'w', y: 0 },
        { action: 'line', x: 'w', y: 'h*0.7' },
        { action: 'line', x: 'w*0.9', y: 'h*0.7' },
        { action: 'line', x: 'w*0.9', y: 'h*0.8' },
        { action: 'line', x: 'w*0.8', y: 'h*0.8' },
        { action: 'line', x: 'w*0.8', y: 'h*0.9' },
        { action: 'quadraticCurve', x1: 'w*0.75*0.8', y1: 'h*0.8', x: 'w*0.8*0.5', y: 'h*0.9' },
        { action: 'quadraticCurve', x1: 'w*0.25*0.8', y1: 'h', x: 0, y: 'h*0.9' },
        { action: 'line', x: 0, y: 'h*0.2' },
        { action: 'move', x: 0, y: 'h*0.2' },
        { action: 'line', x: 'w*0.8', y: 'h*0.2' },
        { action: 'line', x: 'w*0.8', y: 'h*0.9' },
        { action: 'quadraticCurve', x1: 'w*0.75*0.8', y1: 'h*0.8', x: 'w*0.8*0.5', y: 'h*0.9' },
        { action: 'quadraticCurve', x1: 'w*0.25*0.8', y1: 'h', x: 0, y: 'h*0.9' },
        { action: 'line', x: 0, y: 'h*0.2' },
        { action: 'move', x: 'w*0.1', y: 'h*0.2' },
        { action: 'line', x: 'w*0.1', y: 'h*0.1' },
        { action: 'line', x: 'w*0.9', y: 'h*0.1' },
        { action: 'line', x: 'w*0.9', y: 'h*0.8' },
        { action: 'line', x: 'w*0.8', y: 'h*0.8' },
        { action: 'line', x: 'w*0.8', y: 'h*0.2' }
      ]
    ],
    anchors: [{ x: 'w*0.5', y: 'h-h/8' }, { x: '0', y: 'h*0.5' }, { x: 'w*0.5', y: '0' }, { x: 'w', y: 'h*0.5' }],
    textBlock: [{ position: { x: 0, y: 'h*0.2', w: 'w*0.8', h: 'h*0.8' }, text: '' }],
    lineStyle: { lineWidth: 2, lineColor: '11,108,195' },
    fillStyle: { type: 'solid', color: '137,157,192' }
  },
  /** 数据库/系统（100×70） */
  {
    name: 'database',
    title: '数据库/系统',
    category: 'epc',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.14' },
        { action: 'curve', x1: 0, y1: '-h*0.04', x2: 'w', y2: '-h*0.04', x: 'w', y: 'h*0.14' },
        { action: 'line', x: 'w', y: 'h*0.86' },
        { action: 'curve', x1: 'w', y1: 'h*1.04', x2: 0, y2: 'h*1.04', x: 0, y: 'h*0.86' },
        { action: 'line', x: 0, y: 'h*0.14' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w', y: 'h*0.14' },
        { action: 'curve', x1: 'w', y1: 'h*0.3', x2: 0, y2: 'h*0.3', x: 0, y: 'h*0.14' },
        { action: 'curve', x1: 0, y1: '-h*0.04', x2: 'w', y2: '-h*0.04', x: 'w', y: 'h*0.14' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.1' },
          { action: 'quadraticCurve', x1: 'w*0.5', y1: '-h*0.1', x: 'w', y: 'h*0.1' },
          { action: 'line', x: 'w', y: 'h*0.9' },
          { action: 'quadraticCurve', x1: 'w*0.5', y1: 'h*1.1', x: 0, y: 'h*0.9' },
          { action: 'line', x: 0, y: 'h*0.1' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [{ position: { x: 0, y: 'h*0.14', w: 'w', h: 'h-h*0.14' }, text: '' }],
    lineStyle: { lineColor: '11,108,195' },
    fillStyle: { type: 'solid', color: '137,157,192' }
  },
  /** 与（40×40） */
  {
    name: 'and',
    title: '与',
    category: 'epc',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w/2-w*0.15', y: 'h/2+h*0.13' },
        { action: 'line', x: 'w*0.5', y: 'h/2-h*0.15' },
        { action: 'line', x: 'w/2+w*0.15', y: 'h/2+h*0.13' },
        { action: 'line', x: 'w*0.5', y: 'h/2-h*0.15' }
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
    textBlock: [],
    fillStyle: { color: '238,238,238', type: 'solid' }
  },
  /** 或（40×40） */
  {
    name: 'or',
    title: '或',
    category: 'epc',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w/2-w*0.15', y: 'h/2-h*0.13' },
        { action: 'line', x: 'w*0.5', y: 'h/2+h*0.15' },
        { action: 'line', x: 'w/2+w*0.15', y: 'h/2-h*0.13' },
        { action: 'line', x: 'w*0.5', y: 'h/2+h*0.15' }
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
    textBlock: [],
    fillStyle: { color: '238,238,238', type: 'solid' }
  },
  /** 异或（40×40） */
  {
    name: 'xor',
    title: '异或',
    category: 'epc',
    props: { w: 40, h: 40 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w/2-w*0.15', y: 'h/2-h*0.15' },
        { action: 'line', x: 'w/2+w*0.15', y: 'h/2+h*0.15' },
        { action: 'move', x: 'w/2+w*0.15', y: 'h/2-h*0.15' },
        { action: 'line', x: 'w/2-w*0.15', y: 'h/2+h*0.15' }
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
    textBlock: [],
    fillStyle: { color: '238,238,238', type: 'solid' }
  }
]
