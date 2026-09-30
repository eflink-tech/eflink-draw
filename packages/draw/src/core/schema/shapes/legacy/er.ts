// ═══════════════════════════════════════════
// 旧系统 er.js 中尚未移植的 7 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category er（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const erLegacyShapes: ShapeDefinition[] = [
  /** 实体（100×70） */
  {
    name: 'entity',
    title: '实体',
    category: 'er',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: 'w', y: 0 },
        { action: 'line', x: 'w', y: 'h' },
        { action: 'line', x: 0, y: 'h' },
        { action: 'close' }
      ]
    ]
  },
  /** 派生属性（100×70） */
  {
    name: 'derivedAttribute',
    title: '派生属性',
    category: 'er',
    props: { w: 100, h: 70 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        lineStyle: { lineStyle: 'dashed' }
      }
    ]
  },
  /** 键值属性（100×70） */
  {
    name: 'keyAttribute',
    title: '键值属性',
    category: 'er',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ]
    ],
    fontStyle: { underline: true }
  },
  /** 多值属性（100×70） */
  {
    name: 'multivaluedAttribute',
    title: '多值属性',
    category: 'er',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: ' -h/6', x: 'w', y: ' h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'move', x: 'Math.min(w*(1/25),h*(1/14))', y: 'h*0.5' },
        {
          action: 'curve',
          x1: 'Math.min(w*(1/25),h*(1/14))',
          y1: '-h/6+Math.min(w*(1/25),h*(1/14))',
          x2: 'w-Math.min(w*(1/25),h*(1/14)) ',
          y2: '-h/6+Math.min(w*(1/25),h*(1/14))',
          x: 'w-Math.min(w*(1/25),h*(1/14))',
          y: 'h*0.5'
        },
        {
          action: 'curve',
          x1: 'w-Math.min(w*(1/25),h*(1/14))',
          y1: 'h+h/6-Math.min(w*(1/25),h*(1/14))',
          x2: 'Math.min(w*(1/25),h*(1/14)) ',
          y2: 'h+h/6-Math.min(w*(1/25),h*(1/14))',
          x: 'Math.min(w*(1/25),h*(1/14))',
          y: 'h*0.5'
        },
        { action: 'close' }
      ]
    ]
  },
  /** 弱实体（100×70） */
  {
    name: 'weakEntity',
    title: '弱实体',
    category: 'er',
    props: { w: 100, h: 70 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineColor: '120,120,120' }
      },
      {
        actions: [
          { action: 'move', x: 'Math.min(w*(1/20),h*(1/15))', y: 'Math.min(w*(1/20),h*(1/15))' },
          {
            action: 'line',
            x: 'Math.max(w*(19/20),w-Math.min(w*(1/20),h*(1/15)))',
            y: 'Math.min(h*(1/15),w-w*(19/20))'
          },
          {
            action: 'line',
            x: 'Math.max(w*(19/20),w-Math.min(w*(1/20),h*(1/15)))',
            y: 'Math.max(h*(14/15),h-Math.min(h*(1/15),w*(1/20)))'
          },
          {
            action: 'line',
            x: 'Math.min(w*(1/20),h-h*(14/15))',
            y: 'Math.max(h*(14/15),h-Math.min(h*(1/15),w*(1/20)))'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' }
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
  /** 关系（100×70） */
  {
    name: 'relationship',
    title: '关系',
    category: 'er',
    props: { w: 100, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 0 },
        { action: 'line', x: 'w', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h' },
        { action: 'line', x: 0, y: 'h*0.5' },
        { action: 'close' }
      ]
    ]
  },
  /** 弱关系（100×80） */
  {
    name: 'weakRelationship',
    title: '弱关系',
    category: 'er',
    props: { w: 100, h: 80 },
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
          { action: 'move', x: 'w*(1/25)', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 'h*(1/20)' },
          { action: 'line', x: 'w-w*(1/25)', y: 'h*0.5' },
          { action: 'line', x: 'w*0.5', y: 'h-h*(1/20)' },
          { action: 'line', x: 'w*(1/25)', y: 'h*0.5' },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' }
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
    ]
  }
]
