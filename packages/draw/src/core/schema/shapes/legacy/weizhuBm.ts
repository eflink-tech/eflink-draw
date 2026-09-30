// ═══════════════════════════════════════════
// 旧系统 weizhu_bm.js 中尚未移植的 9 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category weizhuBm（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const weizhuBmLegacyShapes: ShapeDefinition[] = [
  /** 所研究企业（120×40） */
  {
    name: 'company',
    title: '所研究企业',
    category: 'weizhu_bm',
    props: { w: 120, h: 40 },
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
  /** 外部利益相关者（70×70） */
  {
    name: 'external_refer',
    title: '外部利益相关者',
    category: 'weizhu_bm',
    props: { w: 70, h: 70 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '220,220,220' }
      }
    ]
  },
  /** 外部利益相关者（参股）（70×70） */
  {
    name: 'external_refer_cg',
    title: '外部利益相关者（参股）',
    category: 'weizhu_bm',
    props: { w: 70, h: 70 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w/2', y: 0 },
          { action: 'line', x: 'w/2', y: 'h/2' },
          { action: 'line', x: 'w', y: 'h/2.1' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h*0.5' },
          { action: 'quadraticCurve', x1: 1, y1: 1, x: 'w/2', y: 0 },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '220,220,220' }
      },
      {
        actions: [
          { action: 'move', x: 'w/2', y: 0 },
          { action: 'line', x: 'w/2', y: 'h/2' },
          { action: 'line', x: 'w', y: 'h/2.1' },
          { action: 'quadraticCurve', x1: 'w-2', y1: 1, x: 'w/2', y: 0 },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' }
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
    textBlock: [
      { position: { x: 0, y: 'h/2', w: 'w', h: 'h/2' }, text: '' },
      { position: { x: 'w/2', y: 0, w: 'w/2', h: 'h/2' }, text: '' }
    ]
  },
  /** 外部利益相关者（控股）（70×70） */
  {
    name: 'external_refer_kg',
    title: '外部利益相关者（控股）',
    category: 'weizhu_bm',
    props: { w: 70, h: 70 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w/2', y: 0 },
          { action: 'line', x: 'w/2', y: 'h/2' },
          { action: 'line', x: 'w', y: 'h/2.1' },
          { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h*0.5' },
          { action: 'quadraticCurve', x1: 1, y1: 1, x: 'w/2', y: 0 },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' }
      },
      {
        actions: [
          { action: 'move', x: 'w/2', y: 0 },
          { action: 'line', x: 'w/2', y: 'h/2' },
          { action: 'line', x: 'w', y: 'h/2.1' },
          { action: 'quadraticCurve', x1: 'w-2', y1: 1, x: 'w/2', y: 0 },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '220,220,220' }
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
    textBlock: [
      { position: { x: 0, y: 'h/2', w: 'w', h: 'h/2' }, text: '' },
      { position: { x: 'w/2', y: 0, w: 'w/2', h: 'h/2' }, text: '' }
    ]
  },
  /** 外部利益相关者（直营）（70×70） */
  {
    name: 'external_refer_zy',
    title: '外部利益相关者（直营）',
    category: 'weizhu_bm',
    props: { w: 70, h: 70 },
    path: [
      [
        { action: 'move', x: 0, y: 'h/2' },
        { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
        { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h/2' },
        { action: 'close' }
      ]
    ]
  },
  /** 企业间交易活动（70×70） */
  {
    name: 'company_jy',
    title: '企业间交易活动',
    category: 'weizhu_bm',
    props: { w: 70, h: 70 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w/2', y: 0 },
          { action: 'line', x: 'w', y: 'h/2' },
          { action: 'line', x: 'w/2', y: 'h' },
          { action: 'line', x: 0, y: 'h/2' },
          { action: 'line', x: 'w/2', y: 0 },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '220,220,220' }
      }
    ]
  },
  /** 企业内部利益相关者（150×210） */
  {
    name: 'company_nbly',
    title: '企业内部利益相关者',
    category: 'weizhu_bm',
    props: { w: 150, h: 210 },
    path: [
      [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: 'w', y: 0 },
        { action: 'line', x: 'w', y: 'h' },
        { action: 'line', x: 0, y: 'h' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.142857' },
          { action: 'line', x: 'w', y: 'h*0.142857' },
          { action: 'move', x: 0, y: 'h*0.857143' },
          { action: 'line', x: 'w/2', y: 'h*0.857143' },
          { action: 'line', x: 'w/2', y: 'h' },
          { action: 'move', x: 'w', y: 'h*0.857143' },
          { action: 'line', x: 'w/1.8', y: 'h*0.857143' },
          { action: 'line', x: 'w/1.8', y: 'h' },
          { action: 'move', x: 'w/1.8', y: 'h' },
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
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: [
      { position: { x: 0, y: 0, w: 'w', h: 'h*0.142857' }, text: '' },
      { position: { x: 0, y: 'h*0.142857', w: 'w', h: 'h*0.714286' }, text: '' },
      { position: { x: 0, y: 'h*0.857143', w: 'w/2', h: 'h*0.142857' }, text: '' },
      { position: { x: 'w-w/2', y: 'h*0.857143', w: 'w/1.8', h: 'h*0.142857' }, text: '' }
    ]
  },
  /** 同类利益相关者集合（20×100） */
  {
    name: 'company_jihe',
    title: '同类利益相关者集合',
    category: 'weizhu_bm',
    props: { w: 20, h: 100 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w', y: 0 },
          { action: 'line', x: 0, y: 0 },
          { action: 'line', x: 0, y: 'h/2' },
          { action: 'line', x: 'w', y: 'h/2' },
          { action: 'move', x: 0, y: 'h/2' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'move', x: 'w', y: 'h' },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' }
      }
    ],
    textBlock: []
  },
  /** 同类型多个实体（30×18） */
  {
    name: 'company_tlx',
    title: '同类型多个实体',
    category: 'weizhu_bm',
    props: { w: 30, h: 18 },
    path: [
      {
        actions: [
          { action: 'move', x: 3, y: 6 },
          { action: 'curve', x1: 4.5, y1: 6, x2: 6, y2: 7.5, x: 6, y: 9 },
          { action: 'curve', x1: 6, y1: 10.5, x2: 4.5, y2: 12, x: 3, y: 12 },
          { action: 'curve', x1: 1.5, y1: 12, x2: 0, y2: 10.5, x: 0, y: 9 },
          { action: 'curve', x1: 0, y1: 7.5, x2: 1.5, y2: 6, x: 3, y: 6 },
          { action: 'move', x: 10, y: 6 },
          { action: 'curve', x1: 14.5, y1: 6, x2: 16, y2: 7.5, x: 16, y: 9 },
          { action: 'curve', x1: 16, y1: 10.5, x2: 14.5, y2: 12, x: 13, y: 12 },
          { action: 'curve', x1: 11.5, y1: 12, x2: 10, y2: 10.5, x: 10, y: 9 },
          { action: 'curve', x1: 10, y1: 7.5, x2: 11.5, y2: 6, x: 13, y: 6 },
          { action: 'move', x: 20, y: 6 },
          { action: 'curve', x1: 24.5, y1: 6, x2: 26, y2: 7.5, x: 26, y: 9 },
          { action: 'curve', x1: 26, y1: 10.5, x2: 24.5, y2: 12, x: 23, y: 12 },
          { action: 'curve', x1: 21.5, y1: 12, x2: 20, y2: 10.5, x: 20, y: 9 },
          { action: 'curve', x1: 20, y1: 7.5, x2: 21.5, y2: 6, x: 23, y: 6 },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '155,155,155' }
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
    ],
    anchors: [],
    textBlock: [],
    resizeDir: []
  }
]
