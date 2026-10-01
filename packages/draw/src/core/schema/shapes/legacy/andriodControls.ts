// ═══════════════════════════════════════════
// 旧系统 andriod_controls.js 中尚未移植的 7 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category andriodControls（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// 位图细节（勾选/开关滑块/放大镜/电池/键盘按键）改由 scripts/lib/mobile-glyphs.mjs 重画为矢量，坐标已比例化
// 旧素材「白底 + lineWidth:0」在白画布上等于隐形，表面描边/配色由 scripts/lib/mobile-styles.mjs 补齐
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const andriodControlsLegacyShapes: ShapeDefinition[] = [
  /** 按钮（84×50） */
  {
    name: 'andriodButton1',
    title: '按钮',
    category: 'mobile',
    group: 'mobile_and_control',
    groupName: 'Android 控件',
    props: { w: 84, h: 50 },
    path: [
      [
        { action: 'move', x: 10, y: 0 },
        { action: 'line', x: 'w-10', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 10 },
        { action: 'line', x: 'w', y: 'h-10' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-10', y: 'h' },
        { action: 'line', x: 10, y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-10' },
        { action: 'line', x: 0, y: 10 },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 10, y: 0 },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [{ position: { x: 'w*0.125', y: 0, w: 'w*0.75', h: 'h' }, text: '按钮' }],
    lineStyle: { lineWidth: 0 },
    fillStyle: { type: 'solid', color: '0,150,136' },
    fontStyle: { size: 13, color: '255,255,255', bold: false },
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
  /** 复选框（66×20） */
  {
    name: 'andriodCheck',
    title: '复选框',
    category: 'mobile',
    group: 'mobile_and_control',
    groupName: 'Android 控件',
    props: { w: 66, h: 20 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0', y: 'h*0.04' },
          { action: 'line', x: 'h*0.92', y: 'h*0.04' },
          { action: 'line', x: 'h*0.92', y: 'h*0.96' },
          { action: 'line', x: 'w*0', y: 'h*0.96' },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '120,120,120' }
      },
      {
        actions: [
          { action: 'line', x: 'h*0.25', y: 'h*0.54' },
          { action: 'line', x: 'h*0.46', y: 'h*0.75' },
          { action: 'line', x: 'h*0.79', y: 'h*0.29' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 2, lineColor: '0,150,136' }
      }
    ],
    anchors: [],
    textBlock: [{ position: { x: 'h+5', y: 0, w: 'w-h-5', h: 'h' }, text: '复选框' }],
    lineStyle: { lineWidth: 0 },
    fontStyle: { size: 10, color: '80,80,80', bold: false, textAlign: 'left' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 单选按钮（234×24） */
  {
    name: 'andriodRadio',
    title: '单选按钮',
    category: 'mobile',
    group: 'mobile_and_control',
    groupName: 'Android 控件',
    props: { w: 234, h: 24 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0', y: '(h*0.08)+(h*0.84)/2' },
          {
            action: 'curve',
            x1: 'w*0',
            y1: '(h*0.08)-(h*0.84)/6',
            x2: '(0)+(h*0.84)',
            y2: '(h*0.08)-(h*0.84)/6',
            x: '(0)+(h*0.84)',
            y: '(h*0.08)+(h*0.84)/2'
          },
          {
            action: 'curve',
            x1: '(0)+(h*0.84)',
            y1: '(h*0.08)+(h*0.84)*7/6',
            x2: 'w*0',
            y2: '(h*0.08)+(h*0.84)*7/6',
            x: 'w*0',
            y: '(h*0.08)+(h*0.84)/2'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '120,120,120' }
      },
      {
        actions: [
          { action: 'move', x: 'h*0.21', y: '(h*0.29)+(h*0.42)/2' },
          {
            action: 'curve',
            x1: 'h*0.21',
            y1: '(h*0.29)-(h*0.42)/6',
            x2: '(h*0.21)+(h*0.42)',
            y2: '(h*0.29)-(h*0.42)/6',
            x: '(h*0.21)+(h*0.42)',
            y: '(h*0.29)+(h*0.42)/2'
          },
          {
            action: 'curve',
            x1: '(h*0.21)+(h*0.42)',
            y1: '(h*0.29)+(h*0.42)*7/6',
            x2: 'h*0.21',
            y2: '(h*0.29)+(h*0.42)*7/6',
            x: 'h*0.21',
            y: '(h*0.29)+(h*0.42)/2'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '0,150,136' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w/3', y: '(h*0.08)+(h*0.84)/2' },
          {
            action: 'curve',
            x1: 'w/3',
            y1: '(h*0.08)-(h*0.84)/6',
            x2: '(w/3)+(h*0.84)',
            y2: '(h*0.08)-(h*0.84)/6',
            x: '(w/3)+(h*0.84)',
            y: '(h*0.08)+(h*0.84)/2'
          },
          {
            action: 'curve',
            x1: '(w/3)+(h*0.84)',
            y1: '(h*0.08)+(h*0.84)*7/6',
            x2: 'w/3',
            y2: '(h*0.08)+(h*0.84)*7/6',
            x: 'w/3',
            y: '(h*0.08)+(h*0.84)/2'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '120,120,120' }
      },
      {
        actions: [
          { action: 'move', x: 'w*2/3', y: '(h*0.08)+(h*0.84)/2' },
          {
            action: 'curve',
            x1: 'w*2/3',
            y1: '(h*0.08)-(h*0.84)/6',
            x2: '(w*2/3)+(h*0.84)',
            y2: '(h*0.08)-(h*0.84)/6',
            x: '(w*2/3)+(h*0.84)',
            y: '(h*0.08)+(h*0.84)/2'
          },
          {
            action: 'curve',
            x1: '(w*2/3)+(h*0.84)',
            y1: '(h*0.08)+(h*0.84)*7/6',
            x2: 'w*2/3',
            y2: '(h*0.08)+(h*0.84)*7/6',
            x: 'w*2/3',
            y: '(h*0.08)+(h*0.84)/2'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '120,120,120' }
      }
    ],
    anchors: [],
    textBlock: [
      { position: { x: 'w*0.111', y: 0, w: 'w*0.22', h: 'h' }, text: '单选按钮' },
      { position: { x: 'w*0.444', y: 0, w: 'w*0.22', h: 'h' }, text: '单选按钮' },
      { position: { x: 'w*0.778', y: 0, w: 'w*0.22', h: 'h' }, text: '单选按钮' }
    ],
    lineStyle: { lineWidth: 0 },
    fontStyle: { size: 12, color: '80,80,80', bold: false, textAlign: 'left' },
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
          { action: 'quadraticCurve', x1: 'w*0.028571', y1: 'h*0.3', x: 'w*0.142857', y: 'h*0.3' },
          { action: 'line', x: 'w*0.885714', y: 'h*0.3' },
          { action: 'quadraticCurve', x1: 'w*1', y1: 'h*0.3', x: 'w*1', y: 'h*0.5' },
          { action: 'line', x: 'w*1', y: 'h*0.5' },
          { action: 'quadraticCurve', x1: 'w*1', y1: 'h*0.7', x: 'w*0.885714', y: 'h*0.7' },
          { action: 'line', x: 'w*0.142857', y: 'h*0.7' },
          { action: 'quadraticCurve', x1: 'w*0.028571', y1: 'h*0.7', x: 'w*0.028571', y: 'h*0.5' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '176,178,182' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.071429', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.071429',
            y1: 'h*0.133333',
            x2: 'w*0.385714',
            y2: 'h*0.133333',
            x: 'w*0.385714',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.385714',
            y1: 'h*0.866667',
            x2: 'w*0.071429',
            y2: 'h*0.866667',
            x: 'w*0.071429',
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
          { action: 'quadraticCurve', x1: 'w*0.028571', y1: 'h*0.3', x: 'w*0.142857', y: 'h*0.3' },
          { action: 'line', x: 'w*0.885714', y: 'h*0.3' },
          { action: 'quadraticCurve', x1: 'w*1', y1: 'h*0.3', x: 'w*1', y: 'h*0.5' },
          { action: 'line', x: 'w*1', y: 'h*0.5' },
          { action: 'quadraticCurve', x1: 'w*1', y1: 'h*0.7', x: 'w*0.885714', y: 'h*0.7' },
          { action: 'line', x: 'w*0.142857', y: 'h*0.7' },
          { action: 'quadraticCurve', x1: 'w*0.028571', y1: 'h*0.7', x: 'w*0.028571', y: 'h*0.5' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '0,150,136' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.642857', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.642857',
            y1: 'h*0.133333',
            x2: 'w*0.957143',
            y2: 'h*0.133333',
            x: 'w*0.957143',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.957143',
            y1: 'h*0.866667',
            x2: 'w*0.642857',
            y2: 'h*0.866667',
            x: 'w*0.642857',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 1, lineColor: '0,150,136' }
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
