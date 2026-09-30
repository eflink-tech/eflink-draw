// ═══════════════════════════════════════════
// 旧系统 andriod_elements.js 中尚未移植的 20 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category andriodElements（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// 位图细节（勾选/开关滑块/放大镜/电池/键盘按键）改由 scripts/lib/mobile-glyphs.mjs 重画为矢量，坐标已比例化
// 旧素材「白底 + lineWidth:0」在白画布上等于隐形，表面描边/配色由 scripts/lib/mobile-styles.mjs 补齐
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const andriodElementsLegacyShapes: ShapeDefinition[] = [
  /** 状态栏（深色）（270×18） */
  {
    name: 'andriodStatusDark',
    title: '状态栏（深色）',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 270, h: 18 },
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
          { action: 'move', x: 'w*0.827778', y: 'h*0.583333' },
          { action: 'line', x: 'w*0.838889', y: 'h*0.583333' },
          { action: 'line', x: 'w*0.838889', y: 'h*0.75' },
          { action: 'line', x: 'w*0.827778', y: 'h*0.75' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.844444', y: 'h*0.458333' },
          { action: 'line', x: 'w*0.855556', y: 'h*0.458333' },
          { action: 'line', x: 'w*0.855556', y: 'h*0.75' },
          { action: 'line', x: 'w*0.844444', y: 'h*0.75' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.861111', y: 'h*0.333333' },
          { action: 'line', x: 'w*0.872222', y: 'h*0.333333' },
          { action: 'line', x: 'w*0.872222', y: 'h*0.75' },
          { action: 'line', x: 'w*0.861111', y: 'h*0.75' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.905556', y: 'h*0.416667' },
          { action: 'quadraticCurve', x1: 'w*0.905556', y1: 'h*0.333333', x: 'w*0.911111', y: 'h*0.333333' },
          { action: 'line', x: 'w*0.955556', y: 'h*0.333333' },
          { action: 'quadraticCurve', x1: 'w*0.961111', y1: 'h*0.333333', x: 'w*0.961111', y: 'h*0.416667' },
          { action: 'line', x: 'w*0.961111', y: 'h*0.583333' },
          { action: 'quadraticCurve', x1: 'w*0.961111', y1: 'h*0.666667', x: 'w*0.955556', y: 'h*0.666667' },
          { action: 'line', x: 'w*0.911111', y: 'h*0.666667' },
          { action: 'quadraticCurve', x1: 'w*0.905556', y1: 'h*0.666667', x: 'w*0.905556', y: 'h*0.583333' },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1, lineColor: '255,255,255' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.912963', y: 'h*0.444444' },
          { action: 'line', x: 'w*0.946296', y: 'h*0.444444' },
          { action: 'line', x: 'w*0.946296', y: 'h*0.555556' },
          { action: 'line', x: 'w*0.912963', y: 'h*0.555556' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.963889', y: 'h*0.444444' },
          { action: 'line', x: 'w*0.969444', y: 'h*0.444444' },
          { action: 'line', x: 'w*0.969444', y: 'h*0.555556' },
          { action: 'line', x: 'w*0.963889', y: 'h*0.555556' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0 }
      }
    ],
    anchors: [],
    textBlock: [{ position: { x: 0, y: 0, w: 'w*0.222222', h: 'h*1' }, text: '' }],
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 标题（90×24） */
  {
    name: 'andriodHeading1',
    title: '标题',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 90, h: 24 },
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
      }
    ],
    anchors: [],
    textBlock: [{ position: { x: 0, y: 0, w: 'w', h: 'h' }, text: '标题' }],
    fillStyle: { type: 'none' },
    fontStyle: { bold: true, size: 12, color: '50,50,50' },
    attribute: { linkable: false }
  },
  /** 标题（90×24） */
  {
    name: 'andriodHeading2',
    title: '标题',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 90, h: 24 },
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
      }
    ],
    anchors: [],
    textBlock: [{ position: { x: 0, y: 0, w: 'w', h: 'h' }, text: '标题' }],
    fillStyle: { type: 'none' },
    fontStyle: { bold: true, size: 12, color: '0,150,136' },
    attribute: { linkable: false }
  },
  /** 文本（150×30） */
  {
    name: 'andriodTextLabel',
    title: '文本',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 150, h: 30 },
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
      }
    ],
    anchors: [],
    textBlock: [{ position: { x: 0, y: 0, w: 'w', h: 'h' }, text: '文本内容...' }],
    fillStyle: { type: 'none' },
    fontStyle: { size: 10, color: '132,132,132', textAlign: 'left', vAlign: 'top' },
    attribute: { linkable: false }
  },
  /** 标题栏(居中)（270×36） */
  {
    name: 'andriodTitle1',
    title: '标题栏(居中)',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 270, h: 36 },
    path: [
      [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: 'w', y: 0 },
        { action: 'line', x: 'w', y: 'h' },
        { action: 'line', x: 0, y: 'h' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [{ position: { x: 'w*0.013889', y: 'h/4', w: 'w*0.972222', h: 'h/2' }, text: '标题' }],
    lineStyle: { lineWidth: 1, lineColor: '212,214,217' },
    fillStyle: { type: 'solid', color: '250,250,250' },
    attribute: { linkable: false },
    fontStyle: { size: 10 }
  },
  /** 标题栏(居左)（270×36） */
  {
    name: 'andriodTitle2',
    title: '标题栏(居左)',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 270, h: 36 },
    path: [
      [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: 'w', y: 0 },
        { action: 'line', x: 'w', y: 'h' },
        { action: 'line', x: 0, y: 'h' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [{ position: { x: 'w*0.033333', y: 'h/4', w: 'w*0.972222', h: 'h/2' }, text: '标题' }],
    lineStyle: { lineWidth: 1, lineColor: '212,214,217' },
    fillStyle: { type: 'solid', color: '250,250,250' },
    attribute: { linkable: false },
    fontStyle: { size: 10 }
  },
  /** 标题栏(菜单)（270×34） */
  {
    name: 'andriodSearch1',
    title: '标题栏(菜单)',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 270, h: 34 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '212,214,217' }
      },
      {
        actions: [{ action: 'line', x: 'w*0.05', y: 'h*0.377778' }, { action: 'line', x: 'w*0.1', y: 'h*0.377778' }],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 2, lineColor: '100,100,100' }
      },
      {
        actions: [{ action: 'line', x: 'w*0.05', y: 'h*0.488889' }, { action: 'line', x: 'w*0.1', y: 'h*0.488889' }],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 2, lineColor: '100,100,100' }
      },
      {
        actions: [{ action: 'line', x: 'w*0.05', y: 'h*0.6' }, { action: 'line', x: 'w*0.1', y: 'h*0.6' }],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 2, lineColor: '100,100,100' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.9', y: 'h*0.488889' },
          {
            action: 'curve',
            x1: 'w*0.9',
            y1: 'h*0.251852',
            x2: 'w*0.944444',
            y2: 'h*0.251852',
            x: 'w*0.944444',
            y: 'h*0.488889'
          },
          {
            action: 'curve',
            x1: 'w*0.944444',
            y1: 'h*0.725926',
            x2: 'w*0.9',
            y2: 'h*0.725926',
            x: 'w*0.9',
            y: 'h*0.488889'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '120,120,120' }
      },
      {
        actions: [
          { action: 'line', x: 'w*0.934667', y: 'h*0.588444' },
          { action: 'line', x: 'w*0.944444', y: 'h*0.666667' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 2, lineColor: '120,120,120' }
      }
    ],
    anchors: [],
    textBlock: [{ position: { x: 'w*0.125', y: 'h*0.288889', w: 'w*0.713889', h: 'h*0.466667' }, text: '标题' }],
    fillStyle: { type: 'solid', color: '243,243,243' },
    fontStyle: { size: 12, textAlign: 'left', color: '100,100,100' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 标题栏(返回)（270×34） */
  {
    name: 'andriodBack',
    title: '标题栏(返回)',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 270, h: 34 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '212,214,217' }
      },
      {
        actions: [{ action: 'line', x: 'w*0.05', y: 'h*0.488889' }, { action: 'line', x: 'w*0.1', y: 'h*0.488889' }],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 2, lineColor: '100,100,100' }
      },
      {
        actions: [
          { action: 'line', x: 'w*0.069444', y: 'h*0.333333' },
          { action: 'line', x: 'w*0.05', y: 'h*0.488889' },
          { action: 'line', x: 'w*0.069444', y: 'h*0.644444' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 2, lineColor: '100,100,100' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.9', y: 'h*0.488889' },
          {
            action: 'curve',
            x1: 'w*0.9',
            y1: 'h*0.251852',
            x2: 'w*0.944444',
            y2: 'h*0.251852',
            x: 'w*0.944444',
            y: 'h*0.488889'
          },
          {
            action: 'curve',
            x1: 'w*0.944444',
            y1: 'h*0.725926',
            x2: 'w*0.9',
            y2: 'h*0.725926',
            x: 'w*0.9',
            y: 'h*0.488889'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '120,120,120' }
      },
      {
        actions: [
          { action: 'line', x: 'w*0.934667', y: 'h*0.588444' },
          { action: 'line', x: 'w*0.944444', y: 'h*0.666667' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 2, lineColor: '120,120,120' }
      }
    ],
    anchors: [],
    textBlock: [{ position: { x: 'w*0.125', y: 'h*0.288889', w: 'w*0.713889', h: 'h*0.466667' }, text: '标题' }],
    fillStyle: { type: 'solid', color: '243,243,243' },
    fontStyle: { size: 12, textAlign: 'left', color: '100,100,100' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 菜单（270×36） */
  {
    name: 'andriodTitle3',
    title: '菜单',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 270, h: 36 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '212,214,217' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.069444', y: 'h*0.979167' },
          { action: 'line', x: 'w*0.305556', y: 'h*0.979167' }
        ],
        lineStyle: { lineColor: '0,150,136', lineWidth: 2 }
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
    textBlock: [
      { position: { x: 'w*0.055556', y: 0, w: 'w*0.277778', h: 'h*1' }, text: '菜单 A' },
      { position: { x: 'w*0.333333', y: 0, w: 'w*0.277778', h: 'h*1' }, text: '菜单 B' },
      { position: { x: 'w*0.611111', y: 0, w: 'w*0.277778', h: 'h*1' }, text: '菜单 C' }
    ],
    lineStyle: { lineWidth: 0 },
    fillStyle: { type: 'solid', color: '243,243,243' },
    attribute: { linkable: false },
    resizeDir: [],
    fontStyle: { size: 10 }
  },
  /** 搜索栏（270×34） */
  {
    name: 'andriodSearch',
    title: '搜索栏',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 270, h: 34 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '212,214,217' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.019444', y: 'h*0.266667' },
          { action: 'quadraticCurve', x1: 'w*0.019444', y1: 'h*0.155556', x: 'w*0.033333', y: 'h*0.155556' },
          { action: 'line', x: 'w*0.966667', y: 'h*0.155556' },
          { action: 'quadraticCurve', x1: 'w*0.977778', y1: 'h*0.155556', x: 'w*0.977778', y: 'h*0.266667' },
          { action: 'line', x: 'w*0.977778', y: 'h*0.733333' },
          { action: 'quadraticCurve', x1: 'w*0.977778', y1: 'h*0.844444', x: 'w*0.966667', y: 'h*0.844444' },
          { action: 'line', x: 'w*0.033333', y: 'h*0.844444' },
          { action: 'quadraticCurve', x1: 'w*0.019444', y1: 'h*0.844444', x: 'w*0.019444', y: 'h*0.733333' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '228,229,233' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.05', y: 'h*0.488889' },
          {
            action: 'curve',
            x1: 'w*0.05',
            y1: 'h*0.251852',
            x2: 'w*0.094444',
            y2: 'h*0.251852',
            x: 'w*0.094444',
            y: 'h*0.488889'
          },
          {
            action: 'curve',
            x1: 'w*0.094444',
            y1: 'h*0.725926',
            x2: 'w*0.05',
            y2: 'h*0.725926',
            x: 'w*0.05',
            y: 'h*0.488889'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '120,120,120' }
      },
      {
        actions: [
          { action: 'line', x: 'w*0.084667', y: 'h*0.588444' },
          { action: 'line', x: 'w*0.094444', y: 'h*0.666667' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 2, lineColor: '120,120,120' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.916667', y: 'h*0.355556' },
          { action: 'quadraticCurve', x1: 'w*0.916667', y1: 'h*0.266667', x: 'w*0.927778', y: 'h*0.266667' },
          { action: 'line', x: 'w*0.927778', y: 'h*0.266667' },
          { action: 'quadraticCurve', x1: 'w*0.938889', y1: 'h*0.266667', x: 'w*0.938889', y: 'h*0.355556' },
          { action: 'line', x: 'w*0.938889', y: 'h*0.466667' },
          { action: 'quadraticCurve', x1: 'w*0.938889', y1: 'h*0.555556', x: 'w*0.927778', y: 'h*0.555556' },
          { action: 'line', x: 'w*0.927778', y: 'h*0.555556' },
          { action: 'quadraticCurve', x1: 'w*0.916667', y1: 'h*0.555556', x: 'w*0.916667', y: 'h*0.466667' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '100,100,100' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'line', x: 'w*0.927778', y: 'h*0.577778' },
          { action: 'line', x: 'w*0.927778', y: 'h*0.666667' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '100,100,100' }
      },
      {
        actions: [
          { action: 'line', x: 'w*0.916667', y: 'h*0.666667' },
          { action: 'line', x: 'w*0.938889', y: 'h*0.666667' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '100,100,100' }
      }
    ],
    anchors: [],
    textBlock: [{ position: { x: 'w*0.125', y: 'h*0.266667', w: 'w*0.713889', h: 'h*0.466667' }, text: '搜索' }],
    fillStyle: { type: 'solid', color: '243,243,243' },
    fontStyle: { size: 12, textAlign: 'left', color: '100,100,100' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 列表视图（270×120） */
  {
    name: 'andriodListView1',
    title: '列表视图',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 270, h: 120 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '212,214,217' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.041667', y: 'h/4' },
          { action: 'line', x: 'w', y: 'h/4' },
          { action: 'move', x: 'w*0.041667', y: 'h/2' },
          { action: 'line', x: 'w', y: 'h/2' },
          { action: 'move', x: 'w*0.041667', y: 'h*0.75' },
          { action: 'line', x: 'w', y: 'h*0.75' },
          { action: 'move', x: 'w*0.041667', y: 'h*0.996875' },
          { action: 'line', x: 'w', y: 'h*0.996875' }
        ],
        lineStyle: { lineColor: '220,220,220' },
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
    textBlock: [
      { position: { x: 'w*0.041667', y: 'h*0.03125', w: 'w*0.736111', h: 'h/4-10' }, text: '单行条目' },
      { position: { x: 'w*0.041667', y: 'h/4+5', w: 'w*0.736111', h: 'h/4-10' }, text: '单行条目' },
      { position: { x: 'w*0.041667', y: 'h/2+5', w: 'w*0.736111', h: 'h/4-10' }, text: '单行条目' },
      { position: { x: 'w*0.041667', y: 'h*0.75+5', w: 'w*0.736111', h: 'h/4-10' }, text: '单行条目' }
    ],
    fillStyle: { type: 'solid', color: '255,255,255' },
    fontStyle: { size: 11, textAlign: 'left' },
    attribute: { linkable: false }
  },
  /** 列表视图(两行)（270×195） */
  {
    name: 'andriodListView2',
    title: '列表视图(两行)',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 270, h: 195 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '212,214,217' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.041667', y: 'h/4' },
          { action: 'line', x: 'w', y: 'h/4' },
          { action: 'move', x: 'w*0.041667', y: 'h/2' },
          { action: 'line', x: 'w', y: 'h/2' },
          { action: 'move', x: 'w*0.041667', y: 'h*0.75' },
          { action: 'line', x: 'w', y: 'h*0.75' },
          { action: 'move', x: 'w*0.041667', y: 'h*0.998077' },
          { action: 'line', x: 'w', y: 'h*0.998077' }
        ],
        lineStyle: { lineColor: '220,220,220' },
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
    textBlock: [
      { position: { x: 'w*0.041667', y: 'h/10 -16', w: 'w*0.736111', h: 'h*0.096154' }, text: '单行条目' },
      { position: { x: 'w*0.041667', y: 'h/10 + 9', w: 'w*0.736111', h: 'h*0.076923' }, text: '单行条目' },
      { position: { x: 'w*0.041667', y: 'h/4+10', w: 'w*0.736111', h: 'h*0.096154' }, text: '单行条目' },
      { position: { x: 'w*0.041667', y: 'h/3 + 13', w: 'w*0.736111', h: 'h*0.076923' }, text: '单行条目' },
      { position: { x: 'w*0.041667', y: 'h/2+8', w: 'w*0.736111', h: 'h*0.096154' }, text: '单行条目' },
      { position: { x: 'w*0.041667', y: 'h/1.67 + 7', w: 'w*0.736111', h: 'h*0.076923' }, text: '单行条目' },
      { position: { x: 'w*0.041667', y: 'h*0.75+9', w: 'w*0.736111', h: 'h*0.096154' }, text: '单行条目' },
      { position: { x: 'w*0.041667', y: 'h/1.18 + 8', w: 'w*0.736111', h: 'h*0.076923' }, text: '单行条目' }
    ],
    fillStyle: { type: 'solid', color: '255,255,255' },
    fontStyle: { size: 11, textAlign: 'left' },
    attribute: { linkable: false }
  },
  /** 单行列表（270×30） */
  {
    name: 'andriodListRow',
    title: '单行列表',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 270, h: 30 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '212,214,217' }
      },
      {
        actions: [{ action: 'move', x: 'w*0.041667', y: 'h*0.9875' }, { action: 'line', x: 'w', y: 'h*0.9875' }],
        lineStyle: { lineColor: '200,200,200' },
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
    textBlock: [{ position: { x: 'w*0.041667', y: 'h*0.125', w: 'w*0.736111', h: 'h*0.75' }, text: '单行条目' }],
    fillStyle: { type: 'solid', color: '255,255,255' },
    fontStyle: { size: 11, textAlign: 'left' },
    attribute: { linkable: false }
  },
  /** 列表菜单（188×135） */
  {
    name: 'andriodListView3',
    title: '列表菜单',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 188, h: 135 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.022222' },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 'w*0.016', y: 0 },
          { action: 'line', x: 'w*0.984', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 'h*0.022222' },
          { action: 'line', x: 'w', y: 'h*0.977778' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w*0.984', y: 'h' },
          { action: 'line', x: 'w*0.016', y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h*0.977778' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '212,214,217' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.06', y: 'h/4' },
          { action: 'line', x: 'w*0.94', y: 'h/4' },
          { action: 'move', x: 'w*0.06', y: 'h/2' },
          { action: 'line', x: 'w*0.94', y: 'h/2' },
          { action: 'move', x: 'w*0.06', y: 'h*0.75' },
          { action: 'line', x: 'w*0.94', y: 'h*0.75' },
          { action: 'move', x: 'w*0.06', y: 'h*0.997222' },
          { action: 'line', x: 'w*0.94', y: 'h*0.997222' }
        ],
        lineStyle: { lineColor: '220,220,220' },
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
    textBlock: [
      { position: { x: 'w*0.06', y: 'h*0.027778', w: 'w*0.9', h: 'h/4-10' }, text: '列表项' },
      { position: { x: 'w*0.06', y: 'h/4+5', w: 'w*0.9', h: 'h/4-10' }, text: '列表项' },
      { position: { x: 'w*0.06', y: 'h/2+5', w: 'w*0.9', h: 'h/4-10' }, text: '列表项' },
      { position: { x: 'w*0.06', y: 'h*0.75+5', w: 'w*0.9', h: 'h/4-10' }, text: '列表项' }
    ],
    fillStyle: { type: 'solid', color: '255,255,255' },
    fontStyle: { size: 11, textAlign: 'left' },
    attribute: { linkable: false }
  },
  /** 标签（52×20） */
  {
    name: 'andriodTag',
    title: '标签',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 52, h: 20 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.16' },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 'w*0.061538', y: 0 },
          { action: 'line', x: 'w*0.938462', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 'h*0.16' },
          { action: 'line', x: 'w', y: 'h*0.84' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w*0.938462', y: 'h' },
          { action: 'line', x: 'w*0.061538', y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h*0.84' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 }
      }
    ],
    anchors: [],
    textBlock: [{ position: { x: 'w*0.076923', y: 'h*0.2', w: 'w*0.846154', h: 'h*0.6' }, text: '标签' }],
    fillStyle: { type: 'solid', color: '117,117,117' },
    fontStyle: { size: 10, textAlign: 'center', color: '255,255,255' },
    attribute: { linkable: false }
  },
  /** 提示（100×46） */
  {
    name: 'andriodTooltip',
    title: '提示',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 100, h: 46 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.133333' },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 'w*0.061538', y: 0 },
        { action: 'line', x: 'w*0.4-14', y: 0 },
        { action: 'line', x: 'w*0.4-7', y: 'h*-0.133333' },
        { action: 'line', x: 'w*0.4', y: 0 },
        { action: 'line', x: 'w*0.938462', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 'h*0.133333' },
        { action: 'line', x: 'w', y: 'h*0.866667' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w*0.938462', y: 'h' },
        { action: 'line', x: 'w*0.061538', y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h*0.866667' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    lineStyle: { lineWidth: 0 },
    fillStyle: { type: 'solid', color: '97,97,101' },
    attribute: { linkable: false }
  },
  /** 对话框与确认（210×120） */
  {
    name: 'andriodDialog',
    title: '对话框与确认',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 210, h: 120 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.022222' },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 'w*0.013333', y: 0 },
          { action: 'line', x: 'w*0.986667', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 'h*0.022222' },
          { action: 'line', x: 'w', y: 'h*0.977778' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w*0.986667', y: 'h' },
          { action: 'line', x: 'w*0.013333', y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h*0.977778' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '200,202,206' }
      }
    ],
    anchors: [],
    textBlock: [
      { position: { x: 'w*0.05', y: 'h*0.077778', w: 'w*0.92', h: 'h*0.166667' }, text: '这是一个对话框' },
      { position: { x: 'w*0.05', y: 'h*0.25', w: 'w*0.9', h: 'h/2' }, text: '可以当作普通对话框，也可以当作确认窗口使用。' },
      { position: { x: 'w*0.7', y: 'h*0.805556', w: 'w*0.266667', h: 'h*0.138889' }, text: '保存' },
      { position: { x: 'w*0.5', y: 'h*0.805556', w: 'w*0.266667', h: 'h*0.138889' }, text: '取消' }
    ],
    fillStyle: { type: 'solid', color: '255,255,255' },
    attribute: { linkable: false },
    fontStyle: { size: 10 }
  },
  /** 确认对话框（210×76） */
  {
    name: 'andriodConfirm',
    title: '确认对话框',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 210, h: 76 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.04' },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 'w*0.013333', y: 0 },
          { action: 'line', x: 'w*0.986667', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 'h*0.04' },
          { action: 'line', x: 'w', y: 'h*0.96' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w*0.986667', y: 'h' },
          { action: 'line', x: 'w*0.013333', y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h*0.96' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '200,202,206' }
      }
    ],
    anchors: [],
    textBlock: [
      { position: { x: 'w*0.05', y: 'h*0.05', w: 'w*0.9', h: 'h/2' }, text: '确定要删除这条消息吗？' },
      { position: { x: 'w*0.7', y: 'h*0.65', w: 'w*0.266667', h: 'h*0.25' }, text: '完成' },
      { position: { x: 'w*0.5', y: 'h*0.65', w: 'w*0.266667', h: 'h*0.25' }, text: '取消' }
    ],
    fillStyle: { type: 'solid', color: '255,255,255' },
    attribute: { linkable: false },
    fontStyle: { size: 10 }
  },
  /** 输入法（270×167） */
  {
    name: 'andriodInput',
    title: '输入法',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 270, h: 167 },
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
          { action: 'move', x: 'w*0.011111', y: 'h*0.067265' },
          { action: 'quadraticCurve', x1: 'w*0.011111', y1: 'h*0.053812', x: 'w*0.019444', y: 'h*0.053812' },
          { action: 'line', x: 'w*0.090556', y: 'h*0.053812' },
          { action: 'quadraticCurve', x1: 'w*0.098889', y1: 'h*0.053812', x: 'w*0.098889', y: 'h*0.067265' },
          { action: 'line', x: 'w*0.098889', y: 'h*0.219731' },
          { action: 'quadraticCurve', x1: 'w*0.098889', y1: 'h*0.233184', x: 'w*0.090556', y: 'h*0.233184' },
          { action: 'line', x: 'w*0.019444', y: 'h*0.233184' },
          { action: 'quadraticCurve', x1: 'w*0.011111', y1: 'h*0.233184', x: 'w*0.011111', y: 'h*0.219731' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.11', y: 'h*0.067265' },
          { action: 'quadraticCurve', x1: 'w*0.11', y1: 'h*0.053812', x: 'w*0.118333', y: 'h*0.053812' },
          { action: 'line', x: 'w*0.189444', y: 'h*0.053812' },
          { action: 'quadraticCurve', x1: 'w*0.197778', y1: 'h*0.053812', x: 'w*0.197778', y: 'h*0.067265' },
          { action: 'line', x: 'w*0.197778', y: 'h*0.219731' },
          { action: 'quadraticCurve', x1: 'w*0.197778', y1: 'h*0.233184', x: 'w*0.189444', y: 'h*0.233184' },
          { action: 'line', x: 'w*0.118333', y: 'h*0.233184' },
          { action: 'quadraticCurve', x1: 'w*0.11', y1: 'h*0.233184', x: 'w*0.11', y: 'h*0.219731' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.208889', y: 'h*0.067265' },
          { action: 'quadraticCurve', x1: 'w*0.208889', y1: 'h*0.053812', x: 'w*0.217222', y: 'h*0.053812' },
          { action: 'line', x: 'w*0.288333', y: 'h*0.053812' },
          { action: 'quadraticCurve', x1: 'w*0.296667', y1: 'h*0.053812', x: 'w*0.296667', y: 'h*0.067265' },
          { action: 'line', x: 'w*0.296667', y: 'h*0.219731' },
          { action: 'quadraticCurve', x1: 'w*0.296667', y1: 'h*0.233184', x: 'w*0.288333', y: 'h*0.233184' },
          { action: 'line', x: 'w*0.217222', y: 'h*0.233184' },
          { action: 'quadraticCurve', x1: 'w*0.208889', y1: 'h*0.233184', x: 'w*0.208889', y: 'h*0.219731' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.307778', y: 'h*0.067265' },
          { action: 'quadraticCurve', x1: 'w*0.307778', y1: 'h*0.053812', x: 'w*0.316111', y: 'h*0.053812' },
          { action: 'line', x: 'w*0.387222', y: 'h*0.053812' },
          { action: 'quadraticCurve', x1: 'w*0.395556', y1: 'h*0.053812', x: 'w*0.395556', y: 'h*0.067265' },
          { action: 'line', x: 'w*0.395556', y: 'h*0.219731' },
          { action: 'quadraticCurve', x1: 'w*0.395556', y1: 'h*0.233184', x: 'w*0.387222', y: 'h*0.233184' },
          { action: 'line', x: 'w*0.316111', y: 'h*0.233184' },
          { action: 'quadraticCurve', x1: 'w*0.307778', y1: 'h*0.233184', x: 'w*0.307778', y: 'h*0.219731' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.406667', y: 'h*0.067265' },
          { action: 'quadraticCurve', x1: 'w*0.406667', y1: 'h*0.053812', x: 'w*0.415', y: 'h*0.053812' },
          { action: 'line', x: 'w*0.486111', y: 'h*0.053812' },
          { action: 'quadraticCurve', x1: 'w*0.494444', y1: 'h*0.053812', x: 'w*0.494444', y: 'h*0.067265' },
          { action: 'line', x: 'w*0.494444', y: 'h*0.219731' },
          { action: 'quadraticCurve', x1: 'w*0.494444', y1: 'h*0.233184', x: 'w*0.486111', y: 'h*0.233184' },
          { action: 'line', x: 'w*0.415', y: 'h*0.233184' },
          { action: 'quadraticCurve', x1: 'w*0.406667', y1: 'h*0.233184', x: 'w*0.406667', y: 'h*0.219731' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.505556', y: 'h*0.067265' },
          { action: 'quadraticCurve', x1: 'w*0.505556', y1: 'h*0.053812', x: 'w*0.513889', y: 'h*0.053812' },
          { action: 'line', x: 'w*0.585', y: 'h*0.053812' },
          { action: 'quadraticCurve', x1: 'w*0.593333', y1: 'h*0.053812', x: 'w*0.593333', y: 'h*0.067265' },
          { action: 'line', x: 'w*0.593333', y: 'h*0.219731' },
          { action: 'quadraticCurve', x1: 'w*0.593333', y1: 'h*0.233184', x: 'w*0.585', y: 'h*0.233184' },
          { action: 'line', x: 'w*0.513889', y: 'h*0.233184' },
          { action: 'quadraticCurve', x1: 'w*0.505556', y1: 'h*0.233184', x: 'w*0.505556', y: 'h*0.219731' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.604444', y: 'h*0.067265' },
          { action: 'quadraticCurve', x1: 'w*0.604444', y1: 'h*0.053812', x: 'w*0.612778', y: 'h*0.053812' },
          { action: 'line', x: 'w*0.683889', y: 'h*0.053812' },
          { action: 'quadraticCurve', x1: 'w*0.692222', y1: 'h*0.053812', x: 'w*0.692222', y: 'h*0.067265' },
          { action: 'line', x: 'w*0.692222', y: 'h*0.219731' },
          { action: 'quadraticCurve', x1: 'w*0.692222', y1: 'h*0.233184', x: 'w*0.683889', y: 'h*0.233184' },
          { action: 'line', x: 'w*0.612778', y: 'h*0.233184' },
          { action: 'quadraticCurve', x1: 'w*0.604444', y1: 'h*0.233184', x: 'w*0.604444', y: 'h*0.219731' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.703333', y: 'h*0.067265' },
          { action: 'quadraticCurve', x1: 'w*0.703333', y1: 'h*0.053812', x: 'w*0.711667', y: 'h*0.053812' },
          { action: 'line', x: 'w*0.782778', y: 'h*0.053812' },
          { action: 'quadraticCurve', x1: 'w*0.791111', y1: 'h*0.053812', x: 'w*0.791111', y: 'h*0.067265' },
          { action: 'line', x: 'w*0.791111', y: 'h*0.219731' },
          { action: 'quadraticCurve', x1: 'w*0.791111', y1: 'h*0.233184', x: 'w*0.782778', y: 'h*0.233184' },
          { action: 'line', x: 'w*0.711667', y: 'h*0.233184' },
          { action: 'quadraticCurve', x1: 'w*0.703333', y1: 'h*0.233184', x: 'w*0.703333', y: 'h*0.219731' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.802222', y: 'h*0.067265' },
          { action: 'quadraticCurve', x1: 'w*0.802222', y1: 'h*0.053812', x: 'w*0.810556', y: 'h*0.053812' },
          { action: 'line', x: 'w*0.881667', y: 'h*0.053812' },
          { action: 'quadraticCurve', x1: 'w*0.89', y1: 'h*0.053812', x: 'w*0.89', y: 'h*0.067265' },
          { action: 'line', x: 'w*0.89', y: 'h*0.219731' },
          { action: 'quadraticCurve', x1: 'w*0.89', y1: 'h*0.233184', x: 'w*0.881667', y: 'h*0.233184' },
          { action: 'line', x: 'w*0.810556', y: 'h*0.233184' },
          { action: 'quadraticCurve', x1: 'w*0.802222', y1: 'h*0.233184', x: 'w*0.802222', y: 'h*0.219731' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.901111', y: 'h*0.067265' },
          { action: 'quadraticCurve', x1: 'w*0.901111', y1: 'h*0.053812', x: 'w*0.909444', y: 'h*0.053812' },
          { action: 'line', x: 'w*0.980556', y: 'h*0.053812' },
          { action: 'quadraticCurve', x1: 'w*0.988889', y1: 'h*0.053812', x: 'w*0.988889', y: 'h*0.067265' },
          { action: 'line', x: 'w*0.988889', y: 'h*0.219731' },
          { action: 'quadraticCurve', x1: 'w*0.988889', y1: 'h*0.233184', x: 'w*0.980556', y: 'h*0.233184' },
          { action: 'line', x: 'w*0.909444', y: 'h*0.233184' },
          { action: 'quadraticCurve', x1: 'w*0.901111', y1: 'h*0.233184', x: 'w*0.901111', y: 'h*0.219731' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.061111', y: 'h*0.273543' },
          { action: 'quadraticCurve', x1: 'w*0.061111', y1: 'h*0.26009', x: 'w*0.069444', y: 'h*0.26009' },
          { action: 'line', x: 'w*0.140432', y: 'h*0.26009' },
          { action: 'quadraticCurve', x1: 'w*0.148765', y1: 'h*0.26009', x: 'w*0.148765', y: 'h*0.273543' },
          { action: 'line', x: 'w*0.148765', y: 'h*0.426009' },
          { action: 'quadraticCurve', x1: 'w*0.148765', y1: 'h*0.439462', x: 'w*0.140432', y: 'h*0.439462' },
          { action: 'line', x: 'w*0.069444', y: 'h*0.439462' },
          { action: 'quadraticCurve', x1: 'w*0.061111', y1: 'h*0.439462', x: 'w*0.061111', y: 'h*0.426009' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.159877', y: 'h*0.273543' },
          { action: 'quadraticCurve', x1: 'w*0.159877', y1: 'h*0.26009', x: 'w*0.16821', y: 'h*0.26009' },
          { action: 'line', x: 'w*0.239198', y: 'h*0.26009' },
          { action: 'quadraticCurve', x1: 'w*0.247531', y1: 'h*0.26009', x: 'w*0.247531', y: 'h*0.273543' },
          { action: 'line', x: 'w*0.247531', y: 'h*0.426009' },
          { action: 'quadraticCurve', x1: 'w*0.247531', y1: 'h*0.439462', x: 'w*0.239198', y: 'h*0.439462' },
          { action: 'line', x: 'w*0.16821', y: 'h*0.439462' },
          { action: 'quadraticCurve', x1: 'w*0.159877', y1: 'h*0.439462', x: 'w*0.159877', y: 'h*0.426009' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.258642', y: 'h*0.273543' },
          { action: 'quadraticCurve', x1: 'w*0.258642', y1: 'h*0.26009', x: 'w*0.266975', y: 'h*0.26009' },
          { action: 'line', x: 'w*0.337963', y: 'h*0.26009' },
          { action: 'quadraticCurve', x1: 'w*0.346296', y1: 'h*0.26009', x: 'w*0.346296', y: 'h*0.273543' },
          { action: 'line', x: 'w*0.346296', y: 'h*0.426009' },
          { action: 'quadraticCurve', x1: 'w*0.346296', y1: 'h*0.439462', x: 'w*0.337963', y: 'h*0.439462' },
          { action: 'line', x: 'w*0.266975', y: 'h*0.439462' },
          { action: 'quadraticCurve', x1: 'w*0.258642', y1: 'h*0.439462', x: 'w*0.258642', y: 'h*0.426009' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.357407', y: 'h*0.273543' },
          { action: 'quadraticCurve', x1: 'w*0.357407', y1: 'h*0.26009', x: 'w*0.365741', y: 'h*0.26009' },
          { action: 'line', x: 'w*0.436728', y: 'h*0.26009' },
          { action: 'quadraticCurve', x1: 'w*0.445062', y1: 'h*0.26009', x: 'w*0.445062', y: 'h*0.273543' },
          { action: 'line', x: 'w*0.445062', y: 'h*0.426009' },
          { action: 'quadraticCurve', x1: 'w*0.445062', y1: 'h*0.439462', x: 'w*0.436728', y: 'h*0.439462' },
          { action: 'line', x: 'w*0.365741', y: 'h*0.439462' },
          { action: 'quadraticCurve', x1: 'w*0.357407', y1: 'h*0.439462', x: 'w*0.357407', y: 'h*0.426009' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.456173', y: 'h*0.273543' },
          { action: 'quadraticCurve', x1: 'w*0.456173', y1: 'h*0.26009', x: 'w*0.464506', y: 'h*0.26009' },
          { action: 'line', x: 'w*0.535494', y: 'h*0.26009' },
          { action: 'quadraticCurve', x1: 'w*0.543827', y1: 'h*0.26009', x: 'w*0.543827', y: 'h*0.273543' },
          { action: 'line', x: 'w*0.543827', y: 'h*0.426009' },
          { action: 'quadraticCurve', x1: 'w*0.543827', y1: 'h*0.439462', x: 'w*0.535494', y: 'h*0.439462' },
          { action: 'line', x: 'w*0.464506', y: 'h*0.439462' },
          { action: 'quadraticCurve', x1: 'w*0.456173', y1: 'h*0.439462', x: 'w*0.456173', y: 'h*0.426009' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.554938', y: 'h*0.273543' },
          { action: 'quadraticCurve', x1: 'w*0.554938', y1: 'h*0.26009', x: 'w*0.563272', y: 'h*0.26009' },
          { action: 'line', x: 'w*0.634259', y: 'h*0.26009' },
          { action: 'quadraticCurve', x1: 'w*0.642593', y1: 'h*0.26009', x: 'w*0.642593', y: 'h*0.273543' },
          { action: 'line', x: 'w*0.642593', y: 'h*0.426009' },
          { action: 'quadraticCurve', x1: 'w*0.642593', y1: 'h*0.439462', x: 'w*0.634259', y: 'h*0.439462' },
          { action: 'line', x: 'w*0.563272', y: 'h*0.439462' },
          { action: 'quadraticCurve', x1: 'w*0.554938', y1: 'h*0.439462', x: 'w*0.554938', y: 'h*0.426009' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.653704', y: 'h*0.273543' },
          { action: 'quadraticCurve', x1: 'w*0.653704', y1: 'h*0.26009', x: 'w*0.662037', y: 'h*0.26009' },
          { action: 'line', x: 'w*0.733025', y: 'h*0.26009' },
          { action: 'quadraticCurve', x1: 'w*0.741358', y1: 'h*0.26009', x: 'w*0.741358', y: 'h*0.273543' },
          { action: 'line', x: 'w*0.741358', y: 'h*0.426009' },
          { action: 'quadraticCurve', x1: 'w*0.741358', y1: 'h*0.439462', x: 'w*0.733025', y: 'h*0.439462' },
          { action: 'line', x: 'w*0.662037', y: 'h*0.439462' },
          { action: 'quadraticCurve', x1: 'w*0.653704', y1: 'h*0.439462', x: 'w*0.653704', y: 'h*0.426009' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.752469', y: 'h*0.273543' },
          { action: 'quadraticCurve', x1: 'w*0.752469', y1: 'h*0.26009', x: 'w*0.760802', y: 'h*0.26009' },
          { action: 'line', x: 'w*0.83179', y: 'h*0.26009' },
          { action: 'quadraticCurve', x1: 'w*0.840123', y1: 'h*0.26009', x: 'w*0.840123', y: 'h*0.273543' },
          { action: 'line', x: 'w*0.840123', y: 'h*0.426009' },
          { action: 'quadraticCurve', x1: 'w*0.840123', y1: 'h*0.439462', x: 'w*0.83179', y: 'h*0.439462' },
          { action: 'line', x: 'w*0.760802', y: 'h*0.439462' },
          { action: 'quadraticCurve', x1: 'w*0.752469', y1: 'h*0.439462', x: 'w*0.752469', y: 'h*0.426009' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.851235', y: 'h*0.273543' },
          { action: 'quadraticCurve', x1: 'w*0.851235', y1: 'h*0.26009', x: 'w*0.859568', y: 'h*0.26009' },
          { action: 'line', x: 'w*0.930556', y: 'h*0.26009' },
          { action: 'quadraticCurve', x1: 'w*0.938889', y1: 'h*0.26009', x: 'w*0.938889', y: 'h*0.273543' },
          { action: 'line', x: 'w*0.938889', y: 'h*0.426009' },
          { action: 'quadraticCurve', x1: 'w*0.938889', y1: 'h*0.439462', x: 'w*0.930556', y: 'h*0.439462' },
          { action: 'line', x: 'w*0.859568', y: 'h*0.439462' },
          { action: 'quadraticCurve', x1: 'w*0.851235', y1: 'h*0.439462', x: 'w*0.851235', y: 'h*0.426009' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.094444', y: 'h*0.479821' },
          { action: 'quadraticCurve', x1: 'w*0.094444', y1: 'h*0.466368', x: 'w*0.102778', y: 'h*0.466368' },
          { action: 'line', x: 'w*0.177778', y: 'h*0.466368' },
          { action: 'quadraticCurve', x1: 'w*0.186111', y1: 'h*0.466368', x: 'w*0.186111', y: 'h*0.479821' },
          { action: 'line', x: 'w*0.186111', y: 'h*0.632287' },
          { action: 'quadraticCurve', x1: 'w*0.186111', y1: 'h*0.64574', x: 'w*0.177778', y: 'h*0.64574' },
          { action: 'line', x: 'w*0.102778', y: 'h*0.64574' },
          { action: 'quadraticCurve', x1: 'w*0.094444', y1: 'h*0.64574', x: 'w*0.094444', y: 'h*0.632287' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.197222', y: 'h*0.479821' },
          { action: 'quadraticCurve', x1: 'w*0.197222', y1: 'h*0.466368', x: 'w*0.205556', y: 'h*0.466368' },
          { action: 'line', x: 'w*0.280556', y: 'h*0.466368' },
          { action: 'quadraticCurve', x1: 'w*0.288889', y1: 'h*0.466368', x: 'w*0.288889', y: 'h*0.479821' },
          { action: 'line', x: 'w*0.288889', y: 'h*0.632287' },
          { action: 'quadraticCurve', x1: 'w*0.288889', y1: 'h*0.64574', x: 'w*0.280556', y: 'h*0.64574' },
          { action: 'line', x: 'w*0.205556', y: 'h*0.64574' },
          { action: 'quadraticCurve', x1: 'w*0.197222', y1: 'h*0.64574', x: 'w*0.197222', y: 'h*0.632287' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.3', y: 'h*0.479821' },
          { action: 'quadraticCurve', x1: 'w*0.3', y1: 'h*0.466368', x: 'w*0.308333', y: 'h*0.466368' },
          { action: 'line', x: 'w*0.383333', y: 'h*0.466368' },
          { action: 'quadraticCurve', x1: 'w*0.391667', y1: 'h*0.466368', x: 'w*0.391667', y: 'h*0.479821' },
          { action: 'line', x: 'w*0.391667', y: 'h*0.632287' },
          { action: 'quadraticCurve', x1: 'w*0.391667', y1: 'h*0.64574', x: 'w*0.383333', y: 'h*0.64574' },
          { action: 'line', x: 'w*0.308333', y: 'h*0.64574' },
          { action: 'quadraticCurve', x1: 'w*0.3', y1: 'h*0.64574', x: 'w*0.3', y: 'h*0.632287' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.402778', y: 'h*0.479821' },
          { action: 'quadraticCurve', x1: 'w*0.402778', y1: 'h*0.466368', x: 'w*0.411111', y: 'h*0.466368' },
          { action: 'line', x: 'w*0.486111', y: 'h*0.466368' },
          { action: 'quadraticCurve', x1: 'w*0.494444', y1: 'h*0.466368', x: 'w*0.494444', y: 'h*0.479821' },
          { action: 'line', x: 'w*0.494444', y: 'h*0.632287' },
          { action: 'quadraticCurve', x1: 'w*0.494444', y1: 'h*0.64574', x: 'w*0.486111', y: 'h*0.64574' },
          { action: 'line', x: 'w*0.411111', y: 'h*0.64574' },
          { action: 'quadraticCurve', x1: 'w*0.402778', y1: 'h*0.64574', x: 'w*0.402778', y: 'h*0.632287' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.505556', y: 'h*0.479821' },
          { action: 'quadraticCurve', x1: 'w*0.505556', y1: 'h*0.466368', x: 'w*0.513889', y: 'h*0.466368' },
          { action: 'line', x: 'w*0.588889', y: 'h*0.466368' },
          { action: 'quadraticCurve', x1: 'w*0.597222', y1: 'h*0.466368', x: 'w*0.597222', y: 'h*0.479821' },
          { action: 'line', x: 'w*0.597222', y: 'h*0.632287' },
          { action: 'quadraticCurve', x1: 'w*0.597222', y1: 'h*0.64574', x: 'w*0.588889', y: 'h*0.64574' },
          { action: 'line', x: 'w*0.513889', y: 'h*0.64574' },
          { action: 'quadraticCurve', x1: 'w*0.505556', y1: 'h*0.64574', x: 'w*0.505556', y: 'h*0.632287' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.608333', y: 'h*0.479821' },
          { action: 'quadraticCurve', x1: 'w*0.608333', y1: 'h*0.466368', x: 'w*0.616667', y: 'h*0.466368' },
          { action: 'line', x: 'w*0.691667', y: 'h*0.466368' },
          { action: 'quadraticCurve', x1: 'w*0.7', y1: 'h*0.466368', x: 'w*0.7', y: 'h*0.479821' },
          { action: 'line', x: 'w*0.7', y: 'h*0.632287' },
          { action: 'quadraticCurve', x1: 'w*0.7', y1: 'h*0.64574', x: 'w*0.691667', y: 'h*0.64574' },
          { action: 'line', x: 'w*0.616667', y: 'h*0.64574' },
          { action: 'quadraticCurve', x1: 'w*0.608333', y1: 'h*0.64574', x: 'w*0.608333', y: 'h*0.632287' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.711111', y: 'h*0.479821' },
          { action: 'quadraticCurve', x1: 'w*0.711111', y1: 'h*0.466368', x: 'w*0.719444', y: 'h*0.466368' },
          { action: 'line', x: 'w*0.794444', y: 'h*0.466368' },
          { action: 'quadraticCurve', x1: 'w*0.802778', y1: 'h*0.466368', x: 'w*0.802778', y: 'h*0.479821' },
          { action: 'line', x: 'w*0.802778', y: 'h*0.632287' },
          { action: 'quadraticCurve', x1: 'w*0.802778', y1: 'h*0.64574', x: 'w*0.794444', y: 'h*0.64574' },
          { action: 'line', x: 'w*0.719444', y: 'h*0.64574' },
          { action: 'quadraticCurve', x1: 'w*0.711111', y1: 'h*0.64574', x: 'w*0.711111', y: 'h*0.632287' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.813889', y: 'h*0.479821' },
          { action: 'quadraticCurve', x1: 'w*0.813889', y1: 'h*0.466368', x: 'w*0.822222', y: 'h*0.466368' },
          { action: 'line', x: 'w*0.897222', y: 'h*0.466368' },
          { action: 'quadraticCurve', x1: 'w*0.905556', y1: 'h*0.466368', x: 'w*0.905556', y: 'h*0.479821' },
          { action: 'line', x: 'w*0.905556', y: 'h*0.632287' },
          { action: 'quadraticCurve', x1: 'w*0.905556', y1: 'h*0.64574', x: 'w*0.897222', y: 'h*0.64574' },
          { action: 'line', x: 'w*0.822222', y: 'h*0.64574' },
          { action: 'quadraticCurve', x1: 'w*0.813889', y1: 'h*0.64574', x: 'w*0.813889', y: 'h*0.632287' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.011111', y: 'h*0.686099' },
          { action: 'quadraticCurve', x1: 'w*0.011111', y1: 'h*0.672646', x: 'w*0.019444', y: 'h*0.672646' },
          { action: 'line', x: 'w*0.238889', y: 'h*0.672646' },
          { action: 'quadraticCurve', x1: 'w*0.247222', y1: 'h*0.672646', x: 'w*0.247222', y: 'h*0.686099' },
          { action: 'line', x: 'w*0.247222', y: 'h*0.838565' },
          { action: 'quadraticCurve', x1: 'w*0.247222', y1: 'h*0.852018', x: 'w*0.238889', y: 'h*0.852018' },
          { action: 'line', x: 'w*0.019444', y: 'h*0.852018' },
          { action: 'quadraticCurve', x1: 'w*0.011111', y1: 'h*0.852018', x: 'w*0.011111', y: 'h*0.838565' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.258333', y: 'h*0.686099' },
          { action: 'quadraticCurve', x1: 'w*0.258333', y1: 'h*0.672646', x: 'w*0.266667', y: 'h*0.672646' },
          { action: 'line', x: 'w*0.486111', y: 'h*0.672646' },
          { action: 'quadraticCurve', x1: 'w*0.494444', y1: 'h*0.672646', x: 'w*0.494444', y: 'h*0.686099' },
          { action: 'line', x: 'w*0.494444', y: 'h*0.838565' },
          { action: 'quadraticCurve', x1: 'w*0.494444', y1: 'h*0.852018', x: 'w*0.486111', y: 'h*0.852018' },
          { action: 'line', x: 'w*0.266667', y: 'h*0.852018' },
          { action: 'quadraticCurve', x1: 'w*0.258333', y1: 'h*0.852018', x: 'w*0.258333', y: 'h*0.838565' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.505556', y: 'h*0.686099' },
          { action: 'quadraticCurve', x1: 'w*0.505556', y1: 'h*0.672646', x: 'w*0.513889', y: 'h*0.672646' },
          { action: 'line', x: 'w*0.733333', y: 'h*0.672646' },
          { action: 'quadraticCurve', x1: 'w*0.741667', y1: 'h*0.672646', x: 'w*0.741667', y: 'h*0.686099' },
          { action: 'line', x: 'w*0.741667', y: 'h*0.838565' },
          { action: 'quadraticCurve', x1: 'w*0.741667', y1: 'h*0.852018', x: 'w*0.733333', y: 'h*0.852018' },
          { action: 'line', x: 'w*0.513889', y: 'h*0.852018' },
          { action: 'quadraticCurve', x1: 'w*0.505556', y1: 'h*0.852018', x: 'w*0.505556', y: 'h*0.838565' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.752778', y: 'h*0.686099' },
          { action: 'quadraticCurve', x1: 'w*0.752778', y1: 'h*0.672646', x: 'w*0.761111', y: 'h*0.672646' },
          { action: 'line', x: 'w*0.980556', y: 'h*0.672646' },
          { action: 'quadraticCurve', x1: 'w*0.988889', y1: 'h*0.672646', x: 'w*0.988889', y: 'h*0.686099' },
          { action: 'line', x: 'w*0.988889', y: 'h*0.838565' },
          { action: 'quadraticCurve', x1: 'w*0.988889', y1: 'h*0.852018', x: 'w*0.980556', y: 'h*0.852018' },
          { action: 'line', x: 'w*0.761111', y: 'h*0.852018' },
          { action: 'quadraticCurve', x1: 'w*0.752778', y1: 'h*0.852018', x: 'w*0.752778', y: 'h*0.838565' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '205,205,205' }
      }
    ],
    anchors: [],
    textBlock: [{ position: { x: 'w*0.277778', y: 'h*0.44843', w: 'w*0.222222', h: 'h*0.107623' }, text: '' }],
    fillStyle: { type: 'solid', color: '233,233,233' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 容器（270×75） */
  {
    name: 'andriodCon',
    title: '容器',
    category: 'mobile',
    group: 'mobile_and_element',
    groupName: 'Android 元素',
    props: { w: 270, h: 75 },
    path: [
      [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: 'w', y: 0 },
        { action: 'line', x: 'w', y: 'h' },
        { action: 'line', x: 0, y: 'h' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 1, lineColor: '170,172,178', lineStyle: 'dashed' },
    attribute: { linkable: false },
    fillStyle: { type: 'solid', color: '252,252,253' }
  }
]
