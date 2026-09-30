// ═══════════════════════════════════════════
// 旧系统 org.js 中尚未移植的 3 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category org（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const orgLegacyShapes: ShapeDefinition[] = [
  /** 组织（120×70） */
  {
    name: 'organization',
    title: '组织',
    category: 'org',
    props: { w: 120, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.5' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h*0.5' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h*0.5' },
        { action: 'move', x: 'w*0.15', y: 'h*0.13' },
        { action: 'line', x: 'w*0.15', y: 'h*0.87' }
      ]
    ],
    textBlock: [{ position: { x: 'w*0.15', y: 10, w: 'w*0.85-10', h: 'h-20' }, text: '' }],
    lineStyle: { lineWidth: 2, lineColor: '220,87,18' },
    fillStyle: { type: 'solid', color: '244,208,0' }
  },
  /** 角色（120×70） */
  {
    name: 'role',
    title: '角色',
    category: 'org',
    props: { w: 120, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: 'w', y: 0 },
        { action: 'line', x: 'w', y: 'h' },
        { action: 'line', x: 0, y: 'h' },
        { action: 'close' }
      ],
      [{ action: 'move', x: 'w/6', y: 0 }, { action: 'line', x: 'w/6', y: 'h' }],
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
    ],
    textBlock: [{ position: { x: 'w/6', y: 0, w: 'w/6*5-10', h: 'h' }, text: '' }],
    lineStyle: { lineWidth: 2, lineColor: '220,87,18' },
    fillStyle: { type: 'solid', color: '244,208,0' }
  },
  /** 员工（120×70） */
  {
    name: 'employee',
    title: '员工',
    category: 'org',
    props: { w: 120, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: 'w', y: 0 },
        { action: 'line', x: 'w', y: 'h' },
        { action: 'line', x: 0, y: 'h' },
        { action: 'close' }
      ]
    ],
    lineStyle: { lineWidth: 2, lineColor: '220,87,18' },
    fillStyle: { type: 'solid', color: '244,208,0' }
  }
]
