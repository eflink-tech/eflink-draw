// ═══════════════════════════════════════════
// 旧系统 venn.js 中尚未移植的 10 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category venn（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const vennLegacyShapes: ShapeDefinition[] = [
  /** 绿色渐变维恩圆（200×200） */
  {
    name: 'greenGradientVennCircle',
    title: '绿色渐变维恩圆',
    category: 'venn',
    props: { w: 200, h: 200 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ]
    ],
    lineStyle: { lineWidth: 0, lineColor: '0,255,0' },
    fillStyle: { type: 'solid', color: '0,255,0' },
    shapeStyle: { alpha: 0.35 }
  },
  /** 红色渐变维恩圆（200×200） */
  {
    name: 'redGradientVennCircle',
    title: '红色渐变维恩圆',
    category: 'venn',
    props: { w: 200, h: 200 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ]
    ],
    lineStyle: { lineWidth: 0, lineColor: '255,0,0' },
    fillStyle: { type: 'solid', color: '255,0,0' },
    shapeStyle: { alpha: 0.35 }
  },
  /** 蓝色渐变维恩圆（200×200） */
  {
    name: 'blueGradientVennCircle',
    title: '蓝色渐变维恩圆',
    category: 'venn',
    props: { w: 200, h: 200 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ]
    ],
    lineStyle: { lineWidth: 0, lineColor: '0,0,255' },
    fillStyle: { type: 'solid', color: '0,0,255' },
    shapeStyle: { alpha: 0.35 }
  },
  /** 绿色维恩（200×200） */
  {
    name: 'greenVenn',
    title: '绿色维恩',
    category: 'venn',
    props: { w: 200, h: 200 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ]
    ],
    lineStyle: { lineWidth: 0, lineColor: '160,191,124' },
    fillStyle: { color: '160,191,124', type: 'solid' },
    shapeStyle: { alpha: 0.5 }
  },
  /** 红色维恩（200×200） */
  {
    name: 'redVenn',
    title: '红色维恩',
    category: 'venn',
    props: { w: 200, h: 200 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ]
    ],
    lineStyle: { lineWidth: 0, lineColor: '247,68,97' },
    fillStyle: { color: '247,68,97', type: 'solid' },
    shapeStyle: { alpha: 0.5 }
  },
  /** 蓝色维恩（200×200） */
  {
    name: 'blueVenn',
    title: '蓝色维恩',
    category: 'venn',
    props: { w: 200, h: 200 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ]
    ],
    lineStyle: { lineWidth: 0, lineColor: '36,118,192' },
    fillStyle: { color: '36,118,192', type: 'solid' },
    shapeStyle: { alpha: 0.5 }
  },
  /** 绿色维恩圆（200×200） */
  {
    name: 'greenVennCircle',
    title: '绿色维恩圆',
    category: 'venn',
    props: { w: 200, h: 200 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ]
    ],
    lineStyle: { lineWidth: 2, lineColor: '121,148,90' },
    fillStyle: { color: '160,191,124', type: 'solid' },
    shapeStyle: { alpha: 0.5 }
  },
  /** 红色维恩圆（200×200） */
  {
    name: 'redVennCircle',
    title: '红色维恩圆',
    category: 'venn',
    props: { w: 200, h: 200 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ]
    ],
    lineStyle: { lineWidth: 2, lineColor: '166,70,86' },
    fillStyle: { color: '247,68,97', type: 'solid' },
    shapeStyle: { alpha: 0.5 }
  },
  /** 蓝色维恩圆（200×200） */
  {
    name: 'blueVennCircle',
    title: '蓝色维恩圆',
    category: 'venn',
    props: { w: 200, h: 200 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ]
    ],
    lineStyle: { lineWidth: 2, lineColor: '41,102,157' },
    fillStyle: { color: '36,118,192', type: 'solid' },
    shapeStyle: { alpha: 0.5 }
  },
  /** 黑色维恩圆（200×200） */
  {
    name: 'blackVennCircle',
    title: '黑色维恩圆',
    category: 'venn',
    props: { w: 200, h: 200 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ]
    ],
    lineStyle: { lineWidth: 2, lineColor: '48,50,51' },
    fillStyle: { type: 'none' }
  }
]
