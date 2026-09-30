// ═══════════════════════════════════════════
// 旧系统 andriod_controls.js 中尚未移植的 7 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category andriodControls（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// 位图细节（勾选/开关滑块/放大镜/电池/键盘按键）改由 scripts/lib/mobile-glyphs.mjs 重画为矢量，坐标已比例化
// 旧素材「白底 + lineWidth:0」在白画布上等于隐形，表面描边/配色由 scripts/lib/mobile-styles.mjs 补齐
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const andriodControlsLegacyShapes: ShapeDefinition[] = [
  /** 按钮（88×32） */
  {
    name: 'andriodButton1',
    title: '按钮',
    category: 'mobile',
    group: 'mobile_and_control',
    groupName: 'Android 控件',
    props: { w: 88, h: 32 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.114286' },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 'w*0.05', y: 0 },
        { action: 'line', x: 'w*0.95', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 'h*0.114286' },
        { action: 'line', x: 'w', y: 'h*0.885714' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w*0.95', y: 'h' },
        { action: 'line', x: 'w*0.05', y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h*0.885714' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [{ position: { x: 'w*0.125', y: 0, w: 'w*0.75', h: 'h' }, text: '按钮' }],
    lineStyle: { lineWidth: 0 },
    fillStyle: { type: 'solid', color: '0,150,136' },
    fontStyle: { size: 12, color: '255,255,255', bold: false },
    attribute: { linkable: false }
  },
  /** 输入框（150×30） */
  {
    name: 'andriodInput1',
    title: '输入框',
    category: 'mobile',
    group: 'mobile_and_control',
    groupName: 'Android 控件',
    props: { w: 150, h: 30 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.114286' },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 'w*0.022222', y: 0 },
        { action: 'line', x: 'w*0.977778', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 'h*0.114286' },
        { action: 'line', x: 'w', y: 'h*0.885714' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w*0.977778', y: 'h' },
        { action: 'line', x: 'w*0.022222', y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h*0.885714' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [{ position: { x: 'w*0.055556', y: 0, w: 'w*0.888889', h: 'h' }, text: '输入框' }],
    lineStyle: { lineWidth: 1, lineColor: '186,188,194' },
    fillStyle: { type: 'solid', color: '250,250,250' },
    fontStyle: { size: 11, color: '60,60,60', bold: false, textAlign: 'left' },
    attribute: { linkable: false }
  },
  /** 复选框（20×20） */
  {
    name: 'andriodCheck',
    title: '复选框',
    category: 'mobile',
    group: 'mobile_and_control',
    groupName: 'Android 控件',
    props: { w: 20, h: 20 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.04', y: 'h*0.04' },
          { action: 'line', x: 'w*0.96', y: 'h*0.04' },
          { action: 'line', x: 'w*0.96', y: 'h*0.96' },
          { action: 'line', x: 'w*0.04', y: 'h*0.96' },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '120,120,120' }
      },
      {
        actions: [
          { action: 'line', x: 'w*0.24', y: 'h*0.52' },
          { action: 'line', x: 'w*0.44', y: 'h*0.72' },
          { action: 'line', x: 'w*0.76', y: 'h*0.28' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 2, lineColor: '0,150,136' }
      }
    ],
    anchors: [],
    textBlock: [{ position: { x: 'w*1.16', y: 0, w: 'w*3', h: 'h' }, text: '' }],
    lineStyle: { lineWidth: 0 },
    fontStyle: { size: 10, color: '80,80,80', bold: false, textAlign: 'left' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 单选按钮（20×20） */
  {
    name: 'andriodRadio',
    title: '单选按钮',
    category: 'mobile',
    group: 'mobile_and_control',
    groupName: 'Android 控件',
    props: { w: 20, h: 20 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.04', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.04',
            y1: 'h*-0.113333',
            x2: 'w*0.96',
            y2: 'h*-0.113333',
            x: 'w*0.96',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.96',
            y1: 'h*1.113333',
            x2: 'w*0.04',
            y2: 'h*1.113333',
            x: 'w*0.04',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '120,120,120' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.32', y: 'h*0.5' },
          { action: 'curve', x1: 'w*0.32', y1: 'h*0.26', x2: 'w*0.68', y2: 'h*0.26', x: 'w*0.68', y: 'h*0.5' },
          { action: 'curve', x1: 'w*0.68', y1: 'h*0.74', x2: 'w*0.32', y2: 'h*0.74', x: 'w*0.32', y: 'h*0.5' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '0,150,136' },
        lineStyle: { lineWidth: 0 }
      }
    ],
    anchors: [],
    textBlock: [{ position: { x: 'w*1.16', y: 0, w: 'w*3', h: 'h' }, text: '' }],
    lineStyle: { lineWidth: 0 },
    fontStyle: { size: 10, color: '80,80,80', bold: false, textAlign: 'left' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 开关：关（52×28） */
  {
    name: 'andriodSwitchOff',
    title: '开关：关',
    category: 'mobile',
    group: 'mobile_and_control',
    groupName: 'Android 控件',
    props: { w: 52, h: 28 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.028571', y: 'h*0.5' },
          { action: 'quadraticCurve', x1: 'w*0.028571', y1: 'h*0.425', x: 'w*0.071429', y: 'h*0.425' },
          { action: 'line', x: 'w*0.928571', y: 'h*0.425' },
          { action: 'quadraticCurve', x1: 'w*0.971429', y1: 'h*0.425', x: 'w*0.971429', y: 'h*0.5' },
          { action: 'line', x: 'w*0.971429', y: 'h*0.5' },
          { action: 'quadraticCurve', x1: 'w*0.971429', y1: 'h*0.575', x: 'w*0.928571', y: 'h*0.575' },
          { action: 'line', x: 'w*0.071429', y: 'h*0.575' },
          { action: 'quadraticCurve', x1: 'w*0.028571', y1: 'h*0.575', x: 'w*0.028571', y: 'h*0.5' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '190,190,190' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.085714', y: 'h*0.5' },
          { action: 'curve', x1: 'w*0.085714', y1: 0, x2: 'w*0.514286', y2: 0, x: 'w*0.514286', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.514286',
            y1: 'h*1',
            x2: 'w*0.085714',
            y2: 'h*1',
            x: 'w*0.085714',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 1, lineColor: '170,170,170' }
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0 },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 开关：开（52×28） */
  {
    name: 'andriodSwitchOnf',
    title: '开关：开',
    category: 'mobile',
    group: 'mobile_and_control',
    groupName: 'Android 控件',
    props: { w: 52, h: 28 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.028571', y: 'h*0.5' },
          { action: 'quadraticCurve', x1: 'w*0.028571', y1: 'h*0.425', x: 'w*0.071429', y: 'h*0.425' },
          { action: 'line', x: 'w*0.928571', y: 'h*0.425' },
          { action: 'quadraticCurve', x1: 'w*0.971429', y1: 'h*0.425', x: 'w*0.971429', y: 'h*0.5' },
          { action: 'line', x: 'w*0.971429', y: 'h*0.5' },
          { action: 'quadraticCurve', x1: 'w*0.971429', y1: 'h*0.575', x: 'w*0.928571', y: 'h*0.575' },
          { action: 'line', x: 'w*0.071429', y: 'h*0.575' },
          { action: 'quadraticCurve', x1: 'w*0.028571', y1: 'h*0.575', x: 'w*0.028571', y: 'h*0.5' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '105,214,194' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.485714', y: 'h*0.5' },
          { action: 'curve', x1: 'w*0.485714', y1: 0, x2: 'w*0.914286', y2: 0, x: 'w*0.914286', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.914286',
            y1: 'h*1',
            x2: 'w*0.485714',
            y2: 'h*1',
            x: 'w*0.485714',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '0,150,136' },
        lineStyle: { lineWidth: 0 }
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0 },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 滑块（150×22） */
  {
    name: 'andriodSlider',
    title: '滑块',
    category: 'mobile',
    group: 'mobile_and_control',
    groupName: 'Android 控件',
    props: { w: 150, h: 22 },
    path: [
      {
        actions: [{ action: 'move', x: 0, y: 'h/2' }, { action: 'line', x: 'w*0.6', y: 'h/2' }],
        lineStyle: { lineWidth: 4, lineColor: '0,150,136' },
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
        lineStyle: { lineWidth: 1.5, lineColor: '0,150,136' }
      }
    ],
    anchors: [],
    textBlock: [],
    attribute: { linkable: false },
    resizeDir: ['l', 'r']
  }
]
