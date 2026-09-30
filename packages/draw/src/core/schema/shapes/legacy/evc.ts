// ═══════════════════════════════════════════
// 旧系统 evc.js 中尚未移植的 6 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category evc（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const evcLegacyShapes: ShapeDefinition[] = [
  /** 价值链1（150×70） */
  {
    name: 'valueChain1',
    title: '价值链1',
    category: 'evc',
    props: { w: 150, h: 70 },
    path: [
      [
        { action: 'move', x: 'Math.min(h/2,w/6)', y: 'h*0.5' },
        { action: 'line', x: 0, y: 0 },
        { action: 'line', x: 'w-Math.min(h/2,w/6)', y: 0 },
        { action: 'line', x: 'w', y: 'h*0.5' },
        { action: 'line', x: 'w-Math.min(h/2,w/6)', y: 'h' },
        { action: 'line', x: 0, y: 'h' },
        { action: 'line', x: 'Math.min(h/2,w/6)', y: 'h*0.5' },
        { action: 'close' }
      ]
    ],
    anchors: [
      { x: 'w*0.5', y: '0' },
      { x: 'w', y: 'h*0.5' },
      { x: 'w*0.5', y: 'h' },
      { x: 'Math.min(h/2,w/6)', y: 'h*0.5' }
    ],
    textBlock: [{ position: { x: 'Math.min(h/2,w/6)', y: 0, w: 'w-Math.min(h/2,w/6)*2', h: 'h' }, text: '' }]
  },
  /** 价值链2（150×70） */
  {
    name: 'valueChain2',
    title: '价值链2',
    category: 'evc',
    props: { w: 150, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.5' },
        { action: 'line', x: 'Math.min(h/2,w/6)', y: 0 },
        { action: 'line', x: 'w', y: 0 },
        { action: 'line', x: 'w-Math.min(h/2,w/6)', y: 'h*0.5' },
        { action: 'line', x: 'w', y: 'h' },
        { action: 'line', x: 'Math.min(h/2,w/6)', y: 'h' },
        { action: 'line', x: 0, y: 'h*0.5' },
        { action: 'close' }
      ]
    ],
    anchors: [
      { x: 'w*0.5', y: '0' },
      { x: 'w-Math.min(h/2,w/6)', y: 'h*0.5' },
      { x: 'w*0.5', y: 'h' },
      { x: '0', y: 'h*0.5' }
    ],
    textBlock: [{ position: { x: 'Math.min(h/2,w/6)', y: 0, w: 'w-Math.min(h/2,w/6)*2', h: 'h' }, text: '' }]
  },
  /** 价值链3（150×70） */
  {
    name: 'valueChain3',
    title: '价值链3',
    category: 'evc',
    props: { w: 150, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: 'w-Math.min(h/2,w/6)', y: 0 },
        { action: 'line', x: 'w', y: 'h*0.5' },
        { action: 'line', x: 'w-Math.min(h/2,w/6)', y: 'h' },
        { action: 'line', x: 0, y: 'h' },
        { action: 'line', x: 0, y: 0 },
        { action: 'close' }
      ]
    ]
  },
  /** 价值链4（150×70） */
  {
    name: 'valueChain4',
    title: '价值链4',
    category: 'evc',
    props: { w: 150, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.5' },
        { action: 'line', x: 'Math.min(h/2,w/6)', y: 0 },
        { action: 'line', x: 'w', y: 0 },
        { action: 'line', x: 'w', y: 'h' },
        { action: 'line', x: 'Math.min(h/2,w/6)', y: 'h' },
        { action: 'line', x: 0, y: 'h*0.5' },
        { action: 'close' }
      ]
    ]
  },
  /** 价值链5（150×70） */
  {
    name: 'valueChain5',
    title: '价值链5',
    category: 'evc',
    props: { w: 150, h: 70 },
    path: [
      [
        { action: 'move', x: 'w*0.5', y: 0 },
        { action: 'line', x: 'w', y: 'Math.min(h/2,w/6)' },
        { action: 'line', x: 'w', y: 'h' },
        { action: 'line', x: 0, y: 'h' },
        { action: 'line', x: 0, y: 'Math.min(h/2,w/6)' },
        { action: 'line', x: 'w*0.5', y: 0 },
        { action: 'close' }
      ]
    ],
    textBlock: [{ position: { x: 0, y: 'Math.min(h/2,w/6)', w: 'w', h: 'h-Math.min(h/2,w/6)' }, text: '' }]
  },
  /** 价值链6（150×70） */
  {
    name: 'valueChain6',
    title: '价值链6',
    category: 'evc',
    props: { w: 150, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: 'w', y: 0 },
        { action: 'line', x: 'w', y: 'h-Math.min(h/2,w/6)' },
        { action: 'line', x: 'w*0.5', y: 'h' },
        { action: 'line', x: 0, y: 'h-Math.min(h/2,w/6)' },
        { action: 'line', x: 0, y: 0 },
        { action: 'close' }
      ]
    ],
    textBlock: [{ position: { x: 0, y: 0, w: 'w', h: 'h-Math.min(h/2,w/6)' }, text: '' }]
  }
]
