// ═══════════════════════════════════════════
// 旧系统 ios_controls.js 中尚未移植的 8 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category iosControls（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// 位图细节（勾选/开关滑块/放大镜/电池/键盘按键）改由 scripts/lib/mobile-glyphs.mjs 重画为矢量，坐标已比例化
// 旧素材「白底 + lineWidth:0」在白画布上等于隐形，表面描边/配色由 scripts/lib/mobile-styles.mjs 补齐
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const iosControlsLegacyShapes: ShapeDefinition[] = [
  /** 按钮（84×50） */
  {
    name: 'ios7Button1',
    title: '按钮',
    category: 'mobile',
    group: 'mobile_ios_control',
    groupName: 'iOS 控件',
    props: { w: 84, h: 50 },
    path: [
      [
        { action: 'move', x: 8, y: 0 },
        { action: 'line', x: 'w-8', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 8 },
        { action: 'line', x: 'w', y: 'h-8' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-8', y: 'h' },
        { action: 'line', x: 8, y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-8' },
        { action: 'line', x: 0, y: 8 },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 8, y: 0 },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [{ position: { x: 'w*0.041667', y: 0, w: 'w*0.916667', h: 'h' }, text: '操作' }],
    lineStyle: { lineWidth: 1, lineColor: '199,201,205' },
    fontStyle: { size: 16, color: '34,124,231', bold: false },
    attribute: { linkable: false },
    fillStyle: { type: 'solid', color: '248,248,250' }
  },
  /** 按钮（84×50） */
  {
    name: 'ios7Button2',
    title: '按钮',
    category: 'mobile',
    group: 'mobile_ios_control',
    groupName: 'iOS 控件',
    props: { w: 84, h: 50 },
    path: [
      [
        { action: 'move', x: 8, y: 0 },
        { action: 'line', x: 'w-8', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 8 },
        { action: 'line', x: 'w', y: 'h-8' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-8', y: 'h' },
        { action: 'line', x: 8, y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-8' },
        { action: 'line', x: 0, y: 8 },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 8, y: 0 },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [{ position: { x: 'w*0.041667', y: 0, w: 'w*0.916667', h: 'h' }, text: '取消' }],
    lineStyle: { lineWidth: 1, lineColor: '199,201,205' },
    fontStyle: { size: 16, color: '34,124,231' },
    attribute: { linkable: false },
    fillStyle: { type: 'solid', color: '248,248,250' }
  },
  /** 输入框（160×28） */
  {
    name: 'ios7Text',
    title: '输入框',
    category: 'mobile',
    group: 'mobile_ios_control',
    groupName: 'iOS 控件',
    props: { w: 160, h: 28 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.133333' },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 'w*0.016667', y: 0 },
        { action: 'line', x: 'w*0.983333', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 'h*0.133333' },
        { action: 'line', x: 'w', y: 'h*0.866667' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w*0.983333', y: 'h' },
        { action: 'line', x: 'w*0.016667', y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h*0.866667' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [{ position: { x: 'w*0.041667', y: 0, w: 'w*0.916667', h: 'h' }, text: '文本' }],
    lineStyle: { lineWidth: 1, lineColor: '199,201,205' },
    fillStyle: { type: 'solid', color: '255,255,255' },
    fontStyle: { size: 13, color: '80,80,80', textAlign: 'left' },
    attribute: { linkable: false }
  },
  /** Stepper 数字调整（72×24） */
  {
    name: 'ios7Stepper',
    title: 'Stepper 数字调整',
    category: 'mobile',
    group: 'mobile_ios_control',
    groupName: 'iOS 控件',
    props: { w: 72, h: 24 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.142857' },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 'w*0.044444', y: 0 },
        { action: 'line', x: 'w*0.955556', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 'h*0.142857' },
        { action: 'line', x: 'w', y: 'h*0.857143' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w*0.955556', y: 'h' },
        { action: 'line', x: 'w*0.044444', y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h*0.857143' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 'w/2', y: 0 },
          { action: 'line', x: 'w/2', y: 'h' },
          { action: 'move', x: 'w/4-6', y: 'h/2' },
          { action: 'line', x: 'w/4+6', y: 'h/2' },
          { action: 'move', x: 'w*0.75-6', y: 'h/2' },
          { action: 'line', x: 'w*0.75+6', y: 'h/2' },
          { action: 'move', x: 'w*0.75', y: 'h/2-6' },
          { action: 'line', x: 'w*0.75', y: 'h/2+6' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '153,154,158' }
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
    lineStyle: { lineWidth: 1, lineColor: '199,201,205' },
    fillStyle: { type: 'solid', color: '248,248,250' },
    shapeStyle: { alpha: 1 },
    attribute: { linkable: false }
  },
  /** Slider 范围选择（150×22） */
  {
    name: 'ios7Slider',
    title: 'Slider 范围选择',
    category: 'mobile',
    group: 'mobile_ios_control',
    groupName: 'iOS 控件',
    props: { w: 150, h: 22 },
    path: [
      {
        actions: [{ action: 'move', x: 0, y: 'h/2' }, { action: 'line', x: 'w*0.6', y: 'h/2' }],
        lineStyle: { lineWidth: 4, lineColor: '73,126,191' },
        fillStyle: { type: 'none' }
      },
      {
        actions: [{ action: 'move', x: 'w*0.6', y: 'h/2' }, { action: 'line', x: 'w', y: 'h/2' }],
        lineStyle: { lineWidth: 4, lineColor: '203,203,203' },
        fillStyle: { type: 'none' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.535', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.535',
            y1: 'h*-0.077778',
            x2: 'w*0.665',
            y2: 'h*-0.077778',
            x: 'w*0.665',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.665',
            y1: 'h*1.077778',
            x2: 'w*0.535',
            y2: 'h*1.077778',
            x: 'w*0.535',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 1.5, lineColor: '73,126,191' }
      }
    ],
    anchors: [],
    textBlock: [],
    attribute: { linkable: false },
    resizeDir: ['l', 'r']
  },
  /** 进度条（150×8） */
  {
    name: 'ios7ControlProgress',
    title: '进度条',
    category: 'mobile',
    group: 'mobile_ios_control',
    groupName: 'iOS 控件',
    props: { w: 150, h: 8 },
    path: [
      {
        actions: [{ action: 'move', x: 0, y: 'h/2' }, { action: 'line', x: 'w*0.6', y: 'h/2' }],
        lineStyle: { lineWidth: 4, lineColor: '73,126,191' },
        fillStyle: { type: 'none' }
      },
      {
        actions: [{ action: 'move', x: 'w*0.6', y: 'h/2' }, { action: 'line', x: 'w', y: 'h/2' }],
        lineStyle: { lineWidth: 4, lineColor: '203,203,203' },
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
    ],
    anchors: [],
    textBlock: [],
    attribute: { linkable: false },
    resizeDir: ['l', 'r']
  },
  /** 开关：开（44×24） */
  {
    name: 'ios7SwitchOn',
    title: '开关：开',
    category: 'mobile',
    group: 'mobile_ios_control',
    groupName: 'iOS 控件',
    props: { w: 44, h: 24 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 'w*0.28', y: 0 },
          { action: 'line', x: 'w*0.72', y: 0 },
          { action: 'quadraticCurve', x1: 'w*1', y1: 0, x: 'w*1', y: 'h*0.5' },
          { action: 'line', x: 'w*1', y: 'h*0.5' },
          { action: 'quadraticCurve', x1: 'w*1', y1: 'h*1', x: 'w*0.72', y: 'h*1' },
          { action: 'line', x: 'w*0.28', y: 'h*1' },
          { action: 'quadraticCurve', x1: 0, y1: 'h*1', x: 0, y: 'h*0.5' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '90,200,125' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.46', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.46',
            y1: 'h*-0.071429',
            x2: 'w*0.94',
            y2: 'h*-0.071429',
            x: 'w*0.94',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.94',
            y1: 'h*1.071429',
            x2: 'w*0.46',
            y2: 'h*1.071429',
            x: 'w*0.46',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0 }
      }
    ],
    anchors: [],
    textBlock: [],
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 开关：关（44×24） */
  {
    name: 'ios7SwitchOff',
    title: '开关：关',
    category: 'mobile',
    group: 'mobile_ios_control',
    groupName: 'iOS 控件',
    props: { w: 44, h: 24 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.02', y: 'h*0.5' },
          { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.035714', x: 'w*0.28', y: 'h*0.035714' },
          { action: 'line', x: 'w*0.72', y: 'h*0.035714' },
          { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.035714', x: 'w*0.98', y: 'h*0.5' },
          { action: 'line', x: 'w*0.98', y: 'h*0.5' },
          { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.964286', x: 'w*0.72', y: 'h*0.964286' },
          { action: 'line', x: 'w*0.28', y: 'h*0.964286' },
          { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.964286', x: 'w*0.02', y: 'h*0.5' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '233,234,238' },
        lineStyle: { lineWidth: 1, lineColor: '186,188,194' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.04', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.04',
            y1: 'h*-0.071429',
            x2: 'w*0.52',
            y2: 'h*-0.071429',
            x: 'w*0.52',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.52',
            y1: 'h*1.071429',
            x2: 'w*0.04',
            y2: 'h*1.071429',
            x: 'w*0.04',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 1, lineColor: '215,215,215' }
      }
    ],
    anchors: [],
    textBlock: [],
    attribute: { linkable: false },
    resizeDir: []
  }
]
