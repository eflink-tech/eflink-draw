// ═══════════════════════════════════════════
// 旧系统 ios_elements.js 中尚未移植的 18 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category iosElements（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// 位图细节（勾选/开关滑块/放大镜/电池/键盘按键）改由 scripts/lib/mobile-glyphs.mjs 重画为矢量，坐标已比例化
// 旧素材「白底 + lineWidth:0」在白画布上等于隐形，表面描边/配色由 scripts/lib/mobile-styles.mjs 补齐
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const iosElementsLegacyShapes: ShapeDefinition[] = [
  /** 标题（90×24） */
  {
    name: 'ios7Heading1',
    title: '标题',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
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
    fontStyle: { bold: true, size: 12 },
    attribute: { linkable: false }
  },
  /** 标题（90×24） */
  {
    name: 'ios7Heading2',
    title: '标题',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
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
    fontStyle: { bold: true, size: 12, color: '34,124,231' },
    attribute: { linkable: false }
  },
  /** 文本（150×30） */
  {
    name: 'ios7TextLabel',
    title: '文本',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
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
  /** 标签（72×18） */
  {
    name: 'ios7Label',
    title: '标签',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
    props: { w: 72, h: 18 },
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
    textBlock: [{ position: { x: 0, y: 0, w: 'w', h: 'h' }, text: '标签' }],
    fillStyle: { type: 'none' },
    fontStyle: { color: '100,100,100', textAlign: 'left', size: 12 },
    attribute: { linkable: false }
  },
  /** 标题栏背景（210×34） */
  {
    name: 'ios7TransparentBg',
    title: '标题栏背景',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
    props: { w: 210, h: 34 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '208,210,214' }
      }
    ],
    anchors: [],
    textBlock: [],
    fillStyle: { type: 'solid', color: '247,247,247' },
    shapeStyle: { alpha: 0.6 },
    attribute: { linkable: false }
  },
  /** 状态栏（深色）（210×15） */
  {
    name: 'ios7StatusDark',
    title: '状态栏（深色）',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
    props: { w: 210, h: 15 },
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
          { action: 'move', x: 'w*0.764286', y: 'h*0.475' },
          {
            action: 'curve',
            x1: 'w*0.764286',
            y1: 'h*0.308333',
            x2: 'w*0.782143',
            y2: 'h*0.308333',
            x: 'w*0.782143',
            y: 'h*0.475'
          },
          {
            action: 'curve',
            x1: 'w*0.782143',
            y1: 'h*0.641667',
            x2: 'w*0.764286',
            y2: 'h*0.641667',
            x: 'w*0.764286',
            y: 'h*0.475'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.789286', y: 'h*0.475' },
          {
            action: 'curve',
            x1: 'w*0.789286',
            y1: 'h*0.308333',
            x2: 'w*0.807143',
            y2: 'h*0.308333',
            x: 'w*0.807143',
            y: 'h*0.475'
          },
          {
            action: 'curve',
            x1: 'w*0.807143',
            y1: 'h*0.641667',
            x2: 'w*0.789286',
            y2: 'h*0.641667',
            x: 'w*0.789286',
            y: 'h*0.475'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.814286', y: 'h*0.475' },
          {
            action: 'curve',
            x1: 'w*0.814286',
            y1: 'h*0.308333',
            x2: 'w*0.832143',
            y2: 'h*0.308333',
            x: 'w*0.832143',
            y: 'h*0.475'
          },
          {
            action: 'curve',
            x1: 'w*0.832143',
            y1: 'h*0.641667',
            x2: 'w*0.814286',
            y2: 'h*0.641667',
            x: 'w*0.814286',
            y: 'h*0.475'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.839286', y: 'h*0.475' },
          {
            action: 'curve',
            x1: 'w*0.839286',
            y1: 'h*0.308333',
            x2: 'w*0.857143',
            y2: 'h*0.308333',
            x: 'w*0.857143',
            y: 'h*0.475'
          },
          {
            action: 'curve',
            x1: 'w*0.857143',
            y1: 'h*0.641667',
            x2: 'w*0.839286',
            y2: 'h*0.641667',
            x: 'w*0.839286',
            y: 'h*0.475'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.864286', y: 'h*0.475' },
          {
            action: 'curve',
            x1: 'w*0.864286',
            y1: 'h*0.308333',
            x2: 'w*0.882143',
            y2: 'h*0.308333',
            x: 'w*0.882143',
            y: 'h*0.475'
          },
          {
            action: 'curve',
            x1: 'w*0.882143',
            y1: 'h*0.641667',
            x2: 'w*0.864286',
            y2: 'h*0.641667',
            x: 'w*0.864286',
            y: 'h*0.475'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.892857', y: 'h*0.4' },
          { action: 'quadraticCurve', x1: 'w*0.892857', y1: 'h*0.3', x: 'w*0.9', y: 'h*0.3' },
          { action: 'line', x: 'w*0.957143', y: 'h*0.3' },
          { action: 'quadraticCurve', x1: 'w*0.964286', y1: 'h*0.3', x: 'w*0.964286', y: 'h*0.4' },
          { action: 'line', x: 'w*0.964286', y: 'h*0.6' },
          { action: 'quadraticCurve', x1: 'w*0.964286', y1: 'h*0.7', x: 'w*0.957143', y: 'h*0.7' },
          { action: 'line', x: 'w*0.9', y: 'h*0.7' },
          { action: 'quadraticCurve', x1: 'w*0.892857', y1: 'h*0.7', x: 'w*0.892857', y: 'h*0.6' },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1, lineColor: '255,255,255' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.902381', y: 'h*0.433333' },
          { action: 'line', x: 'w*0.945238', y: 'h*0.433333' },
          { action: 'line', x: 'w*0.945238', y: 'h*0.566667' },
          { action: 'line', x: 'w*0.902381', y: 'h*0.566667' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.967857', y: 'h*0.433333' },
          { action: 'line', x: 'w*0.975', y: 'h*0.433333' },
          { action: 'line', x: 'w*0.975', y: 'h*0.566667' },
          { action: 'line', x: 'w*0.967857', y: 'h*0.566667' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0 }
      }
    ],
    anchors: [],
    textBlock: [
      {
        position: { x: 'w*0.357143', y: 0, w: 'w*0.285714', h: 'h*1' },
        text: '10:34 A.M',
        fontStyle: { bold: true, size: 10, color: '255,255,255' }
      }
    ],
    fillStyle: { type: 'solid', color: '0,0,0' },
    attribute: { linkable: false },
    resizeDir: [],
    fontStyle: { size: 10 }
  },
  /** 状态栏（浅色）（210×15） */
  {
    name: 'ios7StatusLight',
    title: '状态栏（浅色）',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
    props: { w: 210, h: 15 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '222,223,227' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.764286', y: 'h*0.475' },
          {
            action: 'curve',
            x1: 'w*0.764286',
            y1: 'h*0.308333',
            x2: 'w*0.782143',
            y2: 'h*0.308333',
            x: 'w*0.782143',
            y: 'h*0.475'
          },
          {
            action: 'curve',
            x1: 'w*0.782143',
            y1: 'h*0.641667',
            x2: 'w*0.764286',
            y2: 'h*0.641667',
            x: 'w*0.764286',
            y: 'h*0.475'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '120,120,120' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.789286', y: 'h*0.475' },
          {
            action: 'curve',
            x1: 'w*0.789286',
            y1: 'h*0.308333',
            x2: 'w*0.807143',
            y2: 'h*0.308333',
            x: 'w*0.807143',
            y: 'h*0.475'
          },
          {
            action: 'curve',
            x1: 'w*0.807143',
            y1: 'h*0.641667',
            x2: 'w*0.789286',
            y2: 'h*0.641667',
            x: 'w*0.789286',
            y: 'h*0.475'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '120,120,120' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.814286', y: 'h*0.475' },
          {
            action: 'curve',
            x1: 'w*0.814286',
            y1: 'h*0.308333',
            x2: 'w*0.832143',
            y2: 'h*0.308333',
            x: 'w*0.832143',
            y: 'h*0.475'
          },
          {
            action: 'curve',
            x1: 'w*0.832143',
            y1: 'h*0.641667',
            x2: 'w*0.814286',
            y2: 'h*0.641667',
            x: 'w*0.814286',
            y: 'h*0.475'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '120,120,120' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.839286', y: 'h*0.475' },
          {
            action: 'curve',
            x1: 'w*0.839286',
            y1: 'h*0.308333',
            x2: 'w*0.857143',
            y2: 'h*0.308333',
            x: 'w*0.857143',
            y: 'h*0.475'
          },
          {
            action: 'curve',
            x1: 'w*0.857143',
            y1: 'h*0.641667',
            x2: 'w*0.839286',
            y2: 'h*0.641667',
            x: 'w*0.839286',
            y: 'h*0.475'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '120,120,120' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.864286', y: 'h*0.475' },
          {
            action: 'curve',
            x1: 'w*0.864286',
            y1: 'h*0.308333',
            x2: 'w*0.882143',
            y2: 'h*0.308333',
            x: 'w*0.882143',
            y: 'h*0.475'
          },
          {
            action: 'curve',
            x1: 'w*0.882143',
            y1: 'h*0.641667',
            x2: 'w*0.864286',
            y2: 'h*0.641667',
            x: 'w*0.864286',
            y: 'h*0.475'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '120,120,120' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.892857', y: 'h*0.4' },
          { action: 'quadraticCurve', x1: 'w*0.892857', y1: 'h*0.3', x: 'w*0.9', y: 'h*0.3' },
          { action: 'line', x: 'w*0.957143', y: 'h*0.3' },
          { action: 'quadraticCurve', x1: 'w*0.964286', y1: 'h*0.3', x: 'w*0.964286', y: 'h*0.4' },
          { action: 'line', x: 'w*0.964286', y: 'h*0.6' },
          { action: 'quadraticCurve', x1: 'w*0.964286', y1: 'h*0.7', x: 'w*0.957143', y: 'h*0.7' },
          { action: 'line', x: 'w*0.9', y: 'h*0.7' },
          { action: 'quadraticCurve', x1: 'w*0.892857', y1: 'h*0.7', x: 'w*0.892857', y: 'h*0.6' },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1, lineColor: '120,120,120' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.902381', y: 'h*0.433333' },
          { action: 'line', x: 'w*0.945238', y: 'h*0.433333' },
          { action: 'line', x: 'w*0.945238', y: 'h*0.566667' },
          { action: 'line', x: 'w*0.902381', y: 'h*0.566667' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '120,120,120' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.967857', y: 'h*0.433333' },
          { action: 'line', x: 'w*0.975', y: 'h*0.433333' },
          { action: 'line', x: 'w*0.975', y: 'h*0.566667' },
          { action: 'line', x: 'w*0.967857', y: 'h*0.566667' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '120,120,120' },
        lineStyle: { lineWidth: 0 }
      }
    ],
    anchors: [],
    textBlock: [
      {
        position: { x: 'w*0.357143', y: 0, w: 'w*0.285714', h: 'h*1' },
        text: '10:34 A.M',
        fontStyle: { bold: true, size: 10, color: '80,80,80' }
      }
    ],
    fillStyle: { type: 'solid', color: '245,245,245' },
    attribute: { linkable: false },
    resizeDir: [],
    fontStyle: { size: 10 }
  },
  /** 导航栏（210×34） */
  {
    name: 'ios7Nav',
    title: '导航栏',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
    props: { w: 210, h: 34 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '208,210,214' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.064286', y: 'h*0.25' },
          { action: 'line', x: 'w*0.028571', y: 'h/2' },
          { action: 'line', x: 'w*0.064286', y: 'h*0.75' }
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
    ],
    anchors: [],
    textBlock: [
      { position: { x: 'w*0.089286', y: 'h*0.111111', w: 'w*0.285714', h: 'h*0.777778' }, text: '返回' },
      { position: { x: 'w*0.678571', y: 'h*0.111111', w: 'w*0.285714', h: 'h*0.777778' }, text: '操作' }
    ],
    lineStyle: { lineColor: '27,124,250' },
    fillStyle: { type: 'solid', color: '247,247,247' },
    fontStyle: { bold: true, size: 12, color: '34,124,231' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 进度条（210×38） */
  {
    name: 'ios7Progress',
    title: '进度条',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
    props: { w: 210, h: 38 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '208,210,214' }
      },
      {
        actions: [{ action: 'move', x: 0, y: 'h*0.03' }, { action: 'line', x: 'w', y: 'h*0.03' }],
        lineStyle: { lineWidth: 3, lineColor: '203,203,203' },
        fillStyle: { type: 'none' }
      },
      {
        actions: [{ action: 'move', x: 0, y: 'h*0.03' }, { action: 'line', x: 'w*0.6', y: 'h*0.03' }],
        lineStyle: { lineWidth: 3, lineColor: '0,122,255' },
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
    textBlock: [{ position: { x: 'w*0.142857', y: 'h*0.16', w: 'w*0.714286', h: 'h*0.74' }, text: '下载中...' }],
    fillStyle: { type: 'solid', color: '247,247,247' },
    fontStyle: { bold: true, size: 10 },
    shapeStyle: { alpha: 0.6 },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 范围（210×60） */
  {
    name: 'ios7TitleScope',
    title: '范围',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
    props: { w: 210, h: 60 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '208,210,214' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.053571', y: 'h/2+2' },
          { action: 'quadraticCurve', x1: 'w*0.053571', y1: 'h/2-3', x: 'w*0.071429', y: 'h/2-3' },
          { action: 'line', x: 'w*0.928571', y: 'h/2-3' },
          { action: 'quadraticCurve', x1: 'w*0.946429', y1: 'h/2-3', x: 'w*0.946429', y: 'h/2+2' },
          { action: 'line', x: 'w*0.946429', y: 'h*0.75' },
          { action: 'quadraticCurve', x1: 'w*0.946429', y1: 'h*0.8125', x: 'w*0.928571', y: 'h*0.8125' },
          { action: 'line', x: 'w*0.071429', y: 'h*0.8125' },
          { action: 'quadraticCurve', x1: 'w*0.053571', y1: 'h*0.8125', x: 'w*0.053571', y: 'h*0.75' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 2, lineColor: '0,122,255' },
        fillStyle: { type: 'none' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.35', y: 'h/2-3' },
          { action: 'line', x: 'w*0.65', y: 'h/2-3' },
          { action: 'line', x: 'w*0.65', y: 'h*0.8125' },
          { action: 'line', x: 'w*0.35', y: 'h*0.8125' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '0,122,255' }
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
      { position: { x: 'w*0.321429', y: 'h*0.0625', w: 'w*0.357143', h: 'h*0.3125' }, text: '标题' },
      { position: { x: 'w*0.660714', y: 'h*0.0625', w: 'w*0.285714', h: 'h*0.3125' }, text: '取消' },
      { position: { x: 'w*0.053571', y: 'h*0.4625', w: 'w*0.296429', h: 'h*0.35' }, text: '文本' },
      { position: { x: 'w*0.35', y: 'h*0.4625', w: 'w*0.296429', h: 'h*0.35' }, text: '文本' },
      { position: { x: 'w*0.646429', y: 'h*0.4625', w: 'w*0.296429', h: 'h*0.35' }, text: '文本' }
    ],
    fillStyle: { type: 'solid', color: '247,247,247' },
    fontStyle: { size: 11, color: '0,122,255' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 范围（188×21） */
  {
    name: 'ios7Scope',
    title: '范围',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
    props: { w: 188, h: 21 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.33', y: 0 },
          { action: 'line', x: 'w*0.66', y: 0 },
          { action: 'line', x: 'w*0.66', y: 'h' },
          { action: 'line', x: 'w*0.33', y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '0,122,255' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.178571' },
          { action: 'quadraticCurve', x1: 0, y1: 0, x: 'w*0.02', y: 0 },
          { action: 'line', x: 'w*0.98', y: 0 },
          { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 'h*0.178571' },
          { action: 'line', x: 'w', y: 'h*0.821429' },
          { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w*0.98', y: 'h' },
          { action: 'line', x: 'w*0.02', y: 'h' },
          { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h*0.821429' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 2, lineColor: '0,122,255' },
        fillStyle: { type: 'none' }
      }
    ],
    anchors: [],
    textBlock: [
      { position: { x: 0, y: 0, w: 'w*0.332', h: 'h*1' }, text: '文本' },
      { position: { x: 'w*0.332', y: 0, w: 'w*0.332', h: 'h*1' }, text: '文本' },
      { position: { x: 'w*0.664', y: 0, w: 'w*0.332', h: 'h*1' }, text: '文本' }
    ],
    fontStyle: { size: 11, color: '0,122,255' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 搜索栏（210×34） */
  {
    name: 'ios7Search',
    title: '搜索栏',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
    props: { w: 210, h: 34 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '208,210,214' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.025', y: 'h*0.266667' },
          { action: 'quadraticCurve', x1: 'w*0.025', y1: 'h*0.155556', x: 'w*0.042857', y: 'h*0.155556' },
          { action: 'line', x: 'w*0.678571', y: 'h*0.155556' },
          { action: 'quadraticCurve', x1: 'w*0.696429', y1: 'h*0.155556', x: 'w*0.696429', y: 'h*0.266667' },
          { action: 'line', x: 'w*0.696429', y: 'h*0.733333' },
          { action: 'quadraticCurve', x1: 'w*0.696429', y1: 'h*0.844444', x: 'w*0.678571', y: 'h*0.844444' },
          { action: 'line', x: 'w*0.042857', y: 'h*0.844444' },
          { action: 'quadraticCurve', x1: 'w*0.025', y1: 'h*0.844444', x: 'w*0.025', y: 'h*0.733333' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 0 },
        fillStyle: { type: 'solid', color: '226,227,232' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.05', y: 'h*0.488889' },
          {
            action: 'curve',
            x1: 'w*0.05',
            y1: 'h*0.251852',
            x2: 'w*0.107143',
            y2: 'h*0.251852',
            x: 'w*0.107143',
            y: 'h*0.488889'
          },
          {
            action: 'curve',
            x1: 'w*0.107143',
            y1: 'h*0.725926',
            x2: 'w*0.05',
            y2: 'h*0.725926',
            x: 'w*0.05',
            y: 'h*0.488889'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '160,160,160' }
      },
      {
        actions: [
          { action: 'line', x: 'w*0.094571', y: 'h*0.588444' },
          { action: 'line', x: 'w*0.107143', y: 'h*0.666667' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 2, lineColor: '160,160,160' }
      }
    ],
    anchors: [],
    textBlock: [
      { position: { x: 'w*0.117857', y: 'h*0.266667', w: 'w*0.560714', h: 'h*0.466667' }, text: '搜索' },
      { position: { x: 'w*0.721429', y: 'h*0.111111', w: 'w*0.242857', h: 'h*0.777778' }, text: '取消' }
    ],
    fillStyle: { type: 'solid', color: '247,247,247' },
    fontStyle: { size: 11, textAlign: 'left', color: '100,100,100' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 列表视图（210×120） */
  {
    name: 'ios7ListView',
    title: '列表视图',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
    props: { w: 210, h: 120 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '208,210,214' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.053571', y: 'h/4' },
          { action: 'line', x: 'w', y: 'h/4' },
          { action: 'move', x: 'w*0.053571', y: 'h/2' },
          { action: 'line', x: 'w', y: 'h/2' },
          { action: 'move', x: 'w*0.053571', y: 'h*0.75' },
          { action: 'line', x: 'w', y: 'h*0.75' },
          { action: 'move', x: 'w*0.053571', y: 'h*0.996875' },
          { action: 'line', x: 'w', y: 'h*0.996875' }
        ],
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
    textBlock: [
      { position: { x: 'w*0.053571', y: 'h*0.03125', w: 'w*0.946429', h: 'h/4-10' }, text: '标题' },
      { position: { x: 'w*0.053571', y: 'h/4+5', w: 'w*0.946429', h: 'h/4-10' }, text: '标题' },
      { position: { x: 'w*0.053571', y: 'h/2+5', w: 'w*0.946429', h: 'h/4-10' }, text: '标题' },
      { position: { x: 'w*0.053571', y: 'h*0.75+5', w: 'w*0.946429', h: 'h/4-10' }, text: '标题' }
    ],
    fontStyle: { size: 11, textAlign: 'left' },
    attribute: { linkable: false }
  },
  /** 列表行（210×30） */
  {
    name: 'ios7ListRow',
    title: '列表行',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
    props: { w: 210, h: 30 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '208,210,214' }
      },
      {
        actions: [{ action: 'move', x: 'w*0.053571', y: 'h*0.9875' }, { action: 'line', x: 'w', y: 'h*0.9875' }],
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
    textBlock: [{ position: { x: 'w*0.053571', y: 'h*0.125', w: 'w*0.946429', h: 'h*0.75' }, text: '标题' }],
    fontStyle: { size: 11, textAlign: 'left' },
    attribute: { linkable: false }
  },
  /** 提示（100×46） */
  {
    name: 'ios7Tooltip',
    title: '提示',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
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
    lineStyle: { lineWidth: 1, lineColor: '208,210,214' },
    attribute: { linkable: false },
    fillStyle: { type: 'solid', color: '255,255,255' }
  },
  /** 键盘（210×142） */
  {
    name: 'ios7Keyboard',
    title: '键盘',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
    props: { w: 210, h: 142 },
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
          { action: 'move', x: 'w*0.014286', y: 'h*0.068783' },
          { action: 'quadraticCurve', x1: 'w*0.014286', y1: 'h*0.05291', x: 'w*0.025', y: 'h*0.05291' },
          { action: 'line', x: 'w*0.087857', y: 'h*0.05291' },
          { action: 'quadraticCurve', x1: 'w*0.098571', y1: 'h*0.05291', x: 'w*0.098571', y: 'h*0.068783' },
          { action: 'line', x: 'w*0.098571', y: 'h*0.206349' },
          { action: 'quadraticCurve', x1: 'w*0.098571', y1: 'h*0.222222', x: 'w*0.087857', y: 'h*0.222222' },
          { action: 'line', x: 'w*0.025', y: 'h*0.222222' },
          { action: 'quadraticCurve', x1: 'w*0.014286', y1: 'h*0.222222', x: 'w*0.014286', y: 'h*0.206349' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.112857', y: 'h*0.068783' },
          { action: 'quadraticCurve', x1: 'w*0.112857', y1: 'h*0.05291', x: 'w*0.123571', y: 'h*0.05291' },
          { action: 'line', x: 'w*0.186429', y: 'h*0.05291' },
          { action: 'quadraticCurve', x1: 'w*0.197143', y1: 'h*0.05291', x: 'w*0.197143', y: 'h*0.068783' },
          { action: 'line', x: 'w*0.197143', y: 'h*0.206349' },
          { action: 'quadraticCurve', x1: 'w*0.197143', y1: 'h*0.222222', x: 'w*0.186429', y: 'h*0.222222' },
          { action: 'line', x: 'w*0.123571', y: 'h*0.222222' },
          { action: 'quadraticCurve', x1: 'w*0.112857', y1: 'h*0.222222', x: 'w*0.112857', y: 'h*0.206349' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.211429', y: 'h*0.068783' },
          { action: 'quadraticCurve', x1: 'w*0.211429', y1: 'h*0.05291', x: 'w*0.222143', y: 'h*0.05291' },
          { action: 'line', x: 'w*0.285', y: 'h*0.05291' },
          { action: 'quadraticCurve', x1: 'w*0.295714', y1: 'h*0.05291', x: 'w*0.295714', y: 'h*0.068783' },
          { action: 'line', x: 'w*0.295714', y: 'h*0.206349' },
          { action: 'quadraticCurve', x1: 'w*0.295714', y1: 'h*0.222222', x: 'w*0.285', y: 'h*0.222222' },
          { action: 'line', x: 'w*0.222143', y: 'h*0.222222' },
          { action: 'quadraticCurve', x1: 'w*0.211429', y1: 'h*0.222222', x: 'w*0.211429', y: 'h*0.206349' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.31', y: 'h*0.068783' },
          { action: 'quadraticCurve', x1: 'w*0.31', y1: 'h*0.05291', x: 'w*0.320714', y: 'h*0.05291' },
          { action: 'line', x: 'w*0.383571', y: 'h*0.05291' },
          { action: 'quadraticCurve', x1: 'w*0.394286', y1: 'h*0.05291', x: 'w*0.394286', y: 'h*0.068783' },
          { action: 'line', x: 'w*0.394286', y: 'h*0.206349' },
          { action: 'quadraticCurve', x1: 'w*0.394286', y1: 'h*0.222222', x: 'w*0.383571', y: 'h*0.222222' },
          { action: 'line', x: 'w*0.320714', y: 'h*0.222222' },
          { action: 'quadraticCurve', x1: 'w*0.31', y1: 'h*0.222222', x: 'w*0.31', y: 'h*0.206349' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.408571', y: 'h*0.068783' },
          { action: 'quadraticCurve', x1: 'w*0.408571', y1: 'h*0.05291', x: 'w*0.419286', y: 'h*0.05291' },
          { action: 'line', x: 'w*0.482143', y: 'h*0.05291' },
          { action: 'quadraticCurve', x1: 'w*0.492857', y1: 'h*0.05291', x: 'w*0.492857', y: 'h*0.068783' },
          { action: 'line', x: 'w*0.492857', y: 'h*0.206349' },
          { action: 'quadraticCurve', x1: 'w*0.492857', y1: 'h*0.222222', x: 'w*0.482143', y: 'h*0.222222' },
          { action: 'line', x: 'w*0.419286', y: 'h*0.222222' },
          { action: 'quadraticCurve', x1: 'w*0.408571', y1: 'h*0.222222', x: 'w*0.408571', y: 'h*0.206349' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.507143', y: 'h*0.068783' },
          { action: 'quadraticCurve', x1: 'w*0.507143', y1: 'h*0.05291', x: 'w*0.517857', y: 'h*0.05291' },
          { action: 'line', x: 'w*0.580714', y: 'h*0.05291' },
          { action: 'quadraticCurve', x1: 'w*0.591429', y1: 'h*0.05291', x: 'w*0.591429', y: 'h*0.068783' },
          { action: 'line', x: 'w*0.591429', y: 'h*0.206349' },
          { action: 'quadraticCurve', x1: 'w*0.591429', y1: 'h*0.222222', x: 'w*0.580714', y: 'h*0.222222' },
          { action: 'line', x: 'w*0.517857', y: 'h*0.222222' },
          { action: 'quadraticCurve', x1: 'w*0.507143', y1: 'h*0.222222', x: 'w*0.507143', y: 'h*0.206349' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.605714', y: 'h*0.068783' },
          { action: 'quadraticCurve', x1: 'w*0.605714', y1: 'h*0.05291', x: 'w*0.616429', y: 'h*0.05291' },
          { action: 'line', x: 'w*0.679286', y: 'h*0.05291' },
          { action: 'quadraticCurve', x1: 'w*0.69', y1: 'h*0.05291', x: 'w*0.69', y: 'h*0.068783' },
          { action: 'line', x: 'w*0.69', y: 'h*0.206349' },
          { action: 'quadraticCurve', x1: 'w*0.69', y1: 'h*0.222222', x: 'w*0.679286', y: 'h*0.222222' },
          { action: 'line', x: 'w*0.616429', y: 'h*0.222222' },
          { action: 'quadraticCurve', x1: 'w*0.605714', y1: 'h*0.222222', x: 'w*0.605714', y: 'h*0.206349' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.704286', y: 'h*0.068783' },
          { action: 'quadraticCurve', x1: 'w*0.704286', y1: 'h*0.05291', x: 'w*0.715', y: 'h*0.05291' },
          { action: 'line', x: 'w*0.777857', y: 'h*0.05291' },
          { action: 'quadraticCurve', x1: 'w*0.788571', y1: 'h*0.05291', x: 'w*0.788571', y: 'h*0.068783' },
          { action: 'line', x: 'w*0.788571', y: 'h*0.206349' },
          { action: 'quadraticCurve', x1: 'w*0.788571', y1: 'h*0.222222', x: 'w*0.777857', y: 'h*0.222222' },
          { action: 'line', x: 'w*0.715', y: 'h*0.222222' },
          { action: 'quadraticCurve', x1: 'w*0.704286', y1: 'h*0.222222', x: 'w*0.704286', y: 'h*0.206349' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.802857', y: 'h*0.068783' },
          { action: 'quadraticCurve', x1: 'w*0.802857', y1: 'h*0.05291', x: 'w*0.813571', y: 'h*0.05291' },
          { action: 'line', x: 'w*0.876429', y: 'h*0.05291' },
          { action: 'quadraticCurve', x1: 'w*0.887143', y1: 'h*0.05291', x: 'w*0.887143', y: 'h*0.068783' },
          { action: 'line', x: 'w*0.887143', y: 'h*0.206349' },
          { action: 'quadraticCurve', x1: 'w*0.887143', y1: 'h*0.222222', x: 'w*0.876429', y: 'h*0.222222' },
          { action: 'line', x: 'w*0.813571', y: 'h*0.222222' },
          { action: 'quadraticCurve', x1: 'w*0.802857', y1: 'h*0.222222', x: 'w*0.802857', y: 'h*0.206349' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.901429', y: 'h*0.068783' },
          { action: 'quadraticCurve', x1: 'w*0.901429', y1: 'h*0.05291', x: 'w*0.912143', y: 'h*0.05291' },
          { action: 'line', x: 'w*0.975', y: 'h*0.05291' },
          { action: 'quadraticCurve', x1: 'w*0.985714', y1: 'h*0.05291', x: 'w*0.985714', y: 'h*0.068783' },
          { action: 'line', x: 'w*0.985714', y: 'h*0.206349' },
          { action: 'quadraticCurve', x1: 'w*0.985714', y1: 'h*0.222222', x: 'w*0.975', y: 'h*0.222222' },
          { action: 'line', x: 'w*0.912143', y: 'h*0.222222' },
          { action: 'quadraticCurve', x1: 'w*0.901429', y1: 'h*0.222222', x: 'w*0.901429', y: 'h*0.206349' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.057143', y: 'h*0.269841' },
          { action: 'quadraticCurve', x1: 'w*0.057143', y1: 'h*0.253968', x: 'w*0.067857', y: 'h*0.253968' },
          { action: 'line', x: 'w*0.132143', y: 'h*0.253968' },
          { action: 'quadraticCurve', x1: 'w*0.142857', y1: 'h*0.253968', x: 'w*0.142857', y: 'h*0.269841' },
          { action: 'line', x: 'w*0.142857', y: 'h*0.407407' },
          { action: 'quadraticCurve', x1: 'w*0.142857', y1: 'h*0.42328', x: 'w*0.132143', y: 'h*0.42328' },
          { action: 'line', x: 'w*0.067857', y: 'h*0.42328' },
          { action: 'quadraticCurve', x1: 'w*0.057143', y1: 'h*0.42328', x: 'w*0.057143', y: 'h*0.407407' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.157143', y: 'h*0.269841' },
          { action: 'quadraticCurve', x1: 'w*0.157143', y1: 'h*0.253968', x: 'w*0.167857', y: 'h*0.253968' },
          { action: 'line', x: 'w*0.232143', y: 'h*0.253968' },
          { action: 'quadraticCurve', x1: 'w*0.242857', y1: 'h*0.253968', x: 'w*0.242857', y: 'h*0.269841' },
          { action: 'line', x: 'w*0.242857', y: 'h*0.407407' },
          { action: 'quadraticCurve', x1: 'w*0.242857', y1: 'h*0.42328', x: 'w*0.232143', y: 'h*0.42328' },
          { action: 'line', x: 'w*0.167857', y: 'h*0.42328' },
          { action: 'quadraticCurve', x1: 'w*0.157143', y1: 'h*0.42328', x: 'w*0.157143', y: 'h*0.407407' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.257143', y: 'h*0.269841' },
          { action: 'quadraticCurve', x1: 'w*0.257143', y1: 'h*0.253968', x: 'w*0.267857', y: 'h*0.253968' },
          { action: 'line', x: 'w*0.332143', y: 'h*0.253968' },
          { action: 'quadraticCurve', x1: 'w*0.342857', y1: 'h*0.253968', x: 'w*0.342857', y: 'h*0.269841' },
          { action: 'line', x: 'w*0.342857', y: 'h*0.407407' },
          { action: 'quadraticCurve', x1: 'w*0.342857', y1: 'h*0.42328', x: 'w*0.332143', y: 'h*0.42328' },
          { action: 'line', x: 'w*0.267857', y: 'h*0.42328' },
          { action: 'quadraticCurve', x1: 'w*0.257143', y1: 'h*0.42328', x: 'w*0.257143', y: 'h*0.407407' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.357143', y: 'h*0.269841' },
          { action: 'quadraticCurve', x1: 'w*0.357143', y1: 'h*0.253968', x: 'w*0.367857', y: 'h*0.253968' },
          { action: 'line', x: 'w*0.432143', y: 'h*0.253968' },
          { action: 'quadraticCurve', x1: 'w*0.442857', y1: 'h*0.253968', x: 'w*0.442857', y: 'h*0.269841' },
          { action: 'line', x: 'w*0.442857', y: 'h*0.407407' },
          { action: 'quadraticCurve', x1: 'w*0.442857', y1: 'h*0.42328', x: 'w*0.432143', y: 'h*0.42328' },
          { action: 'line', x: 'w*0.367857', y: 'h*0.42328' },
          { action: 'quadraticCurve', x1: 'w*0.357143', y1: 'h*0.42328', x: 'w*0.357143', y: 'h*0.407407' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.457143', y: 'h*0.269841' },
          { action: 'quadraticCurve', x1: 'w*0.457143', y1: 'h*0.253968', x: 'w*0.467857', y: 'h*0.253968' },
          { action: 'line', x: 'w*0.532143', y: 'h*0.253968' },
          { action: 'quadraticCurve', x1: 'w*0.542857', y1: 'h*0.253968', x: 'w*0.542857', y: 'h*0.269841' },
          { action: 'line', x: 'w*0.542857', y: 'h*0.407407' },
          { action: 'quadraticCurve', x1: 'w*0.542857', y1: 'h*0.42328', x: 'w*0.532143', y: 'h*0.42328' },
          { action: 'line', x: 'w*0.467857', y: 'h*0.42328' },
          { action: 'quadraticCurve', x1: 'w*0.457143', y1: 'h*0.42328', x: 'w*0.457143', y: 'h*0.407407' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.557143', y: 'h*0.269841' },
          { action: 'quadraticCurve', x1: 'w*0.557143', y1: 'h*0.253968', x: 'w*0.567857', y: 'h*0.253968' },
          { action: 'line', x: 'w*0.632143', y: 'h*0.253968' },
          { action: 'quadraticCurve', x1: 'w*0.642857', y1: 'h*0.253968', x: 'w*0.642857', y: 'h*0.269841' },
          { action: 'line', x: 'w*0.642857', y: 'h*0.407407' },
          { action: 'quadraticCurve', x1: 'w*0.642857', y1: 'h*0.42328', x: 'w*0.632143', y: 'h*0.42328' },
          { action: 'line', x: 'w*0.567857', y: 'h*0.42328' },
          { action: 'quadraticCurve', x1: 'w*0.557143', y1: 'h*0.42328', x: 'w*0.557143', y: 'h*0.407407' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.657143', y: 'h*0.269841' },
          { action: 'quadraticCurve', x1: 'w*0.657143', y1: 'h*0.253968', x: 'w*0.667857', y: 'h*0.253968' },
          { action: 'line', x: 'w*0.732143', y: 'h*0.253968' },
          { action: 'quadraticCurve', x1: 'w*0.742857', y1: 'h*0.253968', x: 'w*0.742857', y: 'h*0.269841' },
          { action: 'line', x: 'w*0.742857', y: 'h*0.407407' },
          { action: 'quadraticCurve', x1: 'w*0.742857', y1: 'h*0.42328', x: 'w*0.732143', y: 'h*0.42328' },
          { action: 'line', x: 'w*0.667857', y: 'h*0.42328' },
          { action: 'quadraticCurve', x1: 'w*0.657143', y1: 'h*0.42328', x: 'w*0.657143', y: 'h*0.407407' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.757143', y: 'h*0.269841' },
          { action: 'quadraticCurve', x1: 'w*0.757143', y1: 'h*0.253968', x: 'w*0.767857', y: 'h*0.253968' },
          { action: 'line', x: 'w*0.832143', y: 'h*0.253968' },
          { action: 'quadraticCurve', x1: 'w*0.842857', y1: 'h*0.253968', x: 'w*0.842857', y: 'h*0.269841' },
          { action: 'line', x: 'w*0.842857', y: 'h*0.407407' },
          { action: 'quadraticCurve', x1: 'w*0.842857', y1: 'h*0.42328', x: 'w*0.832143', y: 'h*0.42328' },
          { action: 'line', x: 'w*0.767857', y: 'h*0.42328' },
          { action: 'quadraticCurve', x1: 'w*0.757143', y1: 'h*0.42328', x: 'w*0.757143', y: 'h*0.407407' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.857143', y: 'h*0.269841' },
          { action: 'quadraticCurve', x1: 'w*0.857143', y1: 'h*0.253968', x: 'w*0.867857', y: 'h*0.253968' },
          { action: 'line', x: 'w*0.932143', y: 'h*0.253968' },
          { action: 'quadraticCurve', x1: 'w*0.942857', y1: 'h*0.253968', x: 'w*0.942857', y: 'h*0.269841' },
          { action: 'line', x: 'w*0.942857', y: 'h*0.407407' },
          { action: 'quadraticCurve', x1: 'w*0.942857', y1: 'h*0.42328', x: 'w*0.932143', y: 'h*0.42328' },
          { action: 'line', x: 'w*0.867857', y: 'h*0.42328' },
          { action: 'quadraticCurve', x1: 'w*0.857143', y1: 'h*0.42328', x: 'w*0.857143', y: 'h*0.407407' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.107143', y: 'h*0.470899' },
          { action: 'quadraticCurve', x1: 'w*0.107143', y1: 'h*0.455026', x: 'w*0.117857', y: 'h*0.455026' },
          { action: 'line', x: 'w*0.196429', y: 'h*0.455026' },
          { action: 'quadraticCurve', x1: 'w*0.207143', y1: 'h*0.455026', x: 'w*0.207143', y: 'h*0.470899' },
          { action: 'line', x: 'w*0.207143', y: 'h*0.608466' },
          { action: 'quadraticCurve', x1: 'w*0.207143', y1: 'h*0.624339', x: 'w*0.196429', y: 'h*0.624339' },
          { action: 'line', x: 'w*0.117857', y: 'h*0.624339' },
          { action: 'quadraticCurve', x1: 'w*0.107143', y1: 'h*0.624339', x: 'w*0.107143', y: 'h*0.608466' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.221429', y: 'h*0.470899' },
          { action: 'quadraticCurve', x1: 'w*0.221429', y1: 'h*0.455026', x: 'w*0.232143', y: 'h*0.455026' },
          { action: 'line', x: 'w*0.310714', y: 'h*0.455026' },
          { action: 'quadraticCurve', x1: 'w*0.321429', y1: 'h*0.455026', x: 'w*0.321429', y: 'h*0.470899' },
          { action: 'line', x: 'w*0.321429', y: 'h*0.608466' },
          { action: 'quadraticCurve', x1: 'w*0.321429', y1: 'h*0.624339', x: 'w*0.310714', y: 'h*0.624339' },
          { action: 'line', x: 'w*0.232143', y: 'h*0.624339' },
          { action: 'quadraticCurve', x1: 'w*0.221429', y1: 'h*0.624339', x: 'w*0.221429', y: 'h*0.608466' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.335714', y: 'h*0.470899' },
          { action: 'quadraticCurve', x1: 'w*0.335714', y1: 'h*0.455026', x: 'w*0.346429', y: 'h*0.455026' },
          { action: 'line', x: 'w*0.425', y: 'h*0.455026' },
          { action: 'quadraticCurve', x1: 'w*0.435714', y1: 'h*0.455026', x: 'w*0.435714', y: 'h*0.470899' },
          { action: 'line', x: 'w*0.435714', y: 'h*0.608466' },
          { action: 'quadraticCurve', x1: 'w*0.435714', y1: 'h*0.624339', x: 'w*0.425', y: 'h*0.624339' },
          { action: 'line', x: 'w*0.346429', y: 'h*0.624339' },
          { action: 'quadraticCurve', x1: 'w*0.335714', y1: 'h*0.624339', x: 'w*0.335714', y: 'h*0.608466' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.45', y: 'h*0.470899' },
          { action: 'quadraticCurve', x1: 'w*0.45', y1: 'h*0.455026', x: 'w*0.460714', y: 'h*0.455026' },
          { action: 'line', x: 'w*0.539286', y: 'h*0.455026' },
          { action: 'quadraticCurve', x1: 'w*0.55', y1: 'h*0.455026', x: 'w*0.55', y: 'h*0.470899' },
          { action: 'line', x: 'w*0.55', y: 'h*0.608466' },
          { action: 'quadraticCurve', x1: 'w*0.55', y1: 'h*0.624339', x: 'w*0.539286', y: 'h*0.624339' },
          { action: 'line', x: 'w*0.460714', y: 'h*0.624339' },
          { action: 'quadraticCurve', x1: 'w*0.45', y1: 'h*0.624339', x: 'w*0.45', y: 'h*0.608466' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.564286', y: 'h*0.470899' },
          { action: 'quadraticCurve', x1: 'w*0.564286', y1: 'h*0.455026', x: 'w*0.575', y: 'h*0.455026' },
          { action: 'line', x: 'w*0.653571', y: 'h*0.455026' },
          { action: 'quadraticCurve', x1: 'w*0.664286', y1: 'h*0.455026', x: 'w*0.664286', y: 'h*0.470899' },
          { action: 'line', x: 'w*0.664286', y: 'h*0.608466' },
          { action: 'quadraticCurve', x1: 'w*0.664286', y1: 'h*0.624339', x: 'w*0.653571', y: 'h*0.624339' },
          { action: 'line', x: 'w*0.575', y: 'h*0.624339' },
          { action: 'quadraticCurve', x1: 'w*0.564286', y1: 'h*0.624339', x: 'w*0.564286', y: 'h*0.608466' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.678571', y: 'h*0.470899' },
          { action: 'quadraticCurve', x1: 'w*0.678571', y1: 'h*0.455026', x: 'w*0.689286', y: 'h*0.455026' },
          { action: 'line', x: 'w*0.767857', y: 'h*0.455026' },
          { action: 'quadraticCurve', x1: 'w*0.778571', y1: 'h*0.455026', x: 'w*0.778571', y: 'h*0.470899' },
          { action: 'line', x: 'w*0.778571', y: 'h*0.608466' },
          { action: 'quadraticCurve', x1: 'w*0.778571', y1: 'h*0.624339', x: 'w*0.767857', y: 'h*0.624339' },
          { action: 'line', x: 'w*0.689286', y: 'h*0.624339' },
          { action: 'quadraticCurve', x1: 'w*0.678571', y1: 'h*0.624339', x: 'w*0.678571', y: 'h*0.608466' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.792857', y: 'h*0.470899' },
          { action: 'quadraticCurve', x1: 'w*0.792857', y1: 'h*0.455026', x: 'w*0.803571', y: 'h*0.455026' },
          { action: 'line', x: 'w*0.882143', y: 'h*0.455026' },
          { action: 'quadraticCurve', x1: 'w*0.892857', y1: 'h*0.455026', x: 'w*0.892857', y: 'h*0.470899' },
          { action: 'line', x: 'w*0.892857', y: 'h*0.608466' },
          { action: 'quadraticCurve', x1: 'w*0.892857', y1: 'h*0.624339', x: 'w*0.882143', y: 'h*0.624339' },
          { action: 'line', x: 'w*0.803571', y: 'h*0.624339' },
          { action: 'quadraticCurve', x1: 'w*0.792857', y1: 'h*0.624339', x: 'w*0.792857', y: 'h*0.608466' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.014286', y: 'h*0.671958' },
          { action: 'quadraticCurve', x1: 'w*0.014286', y1: 'h*0.656085', x: 'w*0.025', y: 'h*0.656085' },
          { action: 'line', x: 'w*0.235714', y: 'h*0.656085' },
          { action: 'quadraticCurve', x1: 'w*0.246429', y1: 'h*0.656085', x: 'w*0.246429', y: 'h*0.671958' },
          { action: 'line', x: 'w*0.246429', y: 'h*0.809524' },
          { action: 'quadraticCurve', x1: 'w*0.246429', y1: 'h*0.825397', x: 'w*0.235714', y: 'h*0.825397' },
          { action: 'line', x: 'w*0.025', y: 'h*0.825397' },
          { action: 'quadraticCurve', x1: 'w*0.014286', y1: 'h*0.825397', x: 'w*0.014286', y: 'h*0.809524' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.260714', y: 'h*0.671958' },
          { action: 'quadraticCurve', x1: 'w*0.260714', y1: 'h*0.656085', x: 'w*0.271429', y: 'h*0.656085' },
          { action: 'line', x: 'w*0.482143', y: 'h*0.656085' },
          { action: 'quadraticCurve', x1: 'w*0.492857', y1: 'h*0.656085', x: 'w*0.492857', y: 'h*0.671958' },
          { action: 'line', x: 'w*0.492857', y: 'h*0.809524' },
          { action: 'quadraticCurve', x1: 'w*0.492857', y1: 'h*0.825397', x: 'w*0.482143', y: 'h*0.825397' },
          { action: 'line', x: 'w*0.271429', y: 'h*0.825397' },
          { action: 'quadraticCurve', x1: 'w*0.260714', y1: 'h*0.825397', x: 'w*0.260714', y: 'h*0.809524' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.507143', y: 'h*0.671958' },
          { action: 'quadraticCurve', x1: 'w*0.507143', y1: 'h*0.656085', x: 'w*0.517857', y: 'h*0.656085' },
          { action: 'line', x: 'w*0.728571', y: 'h*0.656085' },
          { action: 'quadraticCurve', x1: 'w*0.739286', y1: 'h*0.656085', x: 'w*0.739286', y: 'h*0.671958' },
          { action: 'line', x: 'w*0.739286', y: 'h*0.809524' },
          { action: 'quadraticCurve', x1: 'w*0.739286', y1: 'h*0.825397', x: 'w*0.728571', y: 'h*0.825397' },
          { action: 'line', x: 'w*0.517857', y: 'h*0.825397' },
          { action: 'quadraticCurve', x1: 'w*0.507143', y1: 'h*0.825397', x: 'w*0.507143', y: 'h*0.809524' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.753571', y: 'h*0.671958' },
          { action: 'quadraticCurve', x1: 'w*0.753571', y1: 'h*0.656085', x: 'w*0.764286', y: 'h*0.656085' },
          { action: 'line', x: 'w*0.975', y: 'h*0.656085' },
          { action: 'quadraticCurve', x1: 'w*0.985714', y1: 'h*0.656085', x: 'w*0.985714', y: 'h*0.671958' },
          { action: 'line', x: 'w*0.985714', y: 'h*0.809524' },
          { action: 'quadraticCurve', x1: 'w*0.985714', y1: 'h*0.825397', x: 'w*0.975', y: 'h*0.825397' },
          { action: 'line', x: 'w*0.764286', y: 'h*0.825397' },
          { action: 'quadraticCurve', x1: 'w*0.753571', y1: 'h*0.825397', x: 'w*0.753571', y: 'h*0.809524' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 0.8, lineColor: '190,190,196' }
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0 },
    fillStyle: { type: 'solid', color: '214,212,220' },
    attribute: { linkable: false }
  },
  /** 提示（180×90） */
  {
    name: 'ios7Alert',
    title: '提示',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
    props: { w: 180, h: 90 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.069565' },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 'w*0.033333', y: 0 },
        { action: 'line', x: 'w*0.4', y: 0 },
        { action: 'line', x: 'w*0.966667', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 'h*0.069565' },
        { action: 'line', x: 'w', y: 'h*0.930435' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w*0.966667', y: 'h' },
        { action: 'line', x: 'w*0.033333', y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h*0.930435' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.652174' },
          { action: 'line', x: 'w', y: 'h*0.652174' },
          { action: 'move', x: 'w/2', y: 'h*0.652174' },
          { action: 'line', x: 'w/2', y: 'h' }
        ],
        lineStyle: { lineColor: '169,169,169' },
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
      { position: { x: 'w*0.041667', y: 'h*0.043478', w: 'w*0.916667', h: 'h*0.26087' }, text: '提示' },
      { position: { x: 'w*0.041667', y: 'h*0.304348', w: 'w*0.916667', h: 'h*0.347826' }, text: '提示信息' },
      { position: { x: 'w*0.020833', y: 'h*0.652174', w: 'w/2-10', h: 'h*0.347826' }, text: '确定' },
      { position: { x: 'w/2+5', y: 'h*0.652174', w: 'w/2-10', h: 'h*0.347826' }, text: '取消' }
    ],
    lineStyle: { lineWidth: 1, lineColor: '214,216,220' },
    fillStyle: { type: 'solid', color: '255,255,255' },
    attribute: { linkable: false },
    fontStyle: { size: 10 }
  },
  /** 下拉列表（210×105） */
  {
    name: 'ios7Dropdown',
    title: '下拉列表',
    category: 'mobile',
    group: 'mobile_ios_element',
    groupName: 'iOS 元素',
    props: { w: 210, h: 105 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '208,210,214' }
      },
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.4' },
          { action: 'line', x: 'w', y: 'h*0.4' },
          { action: 'move', x: 0, y: 'h*0.6' },
          { action: 'line', x: 'w', y: 'h*0.6' }
        ],
        lineStyle: { lineColor: '120,120,120' },
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
      { position: { x: 0, y: 'h*0.4', w: 'w', h: 'h/5' }, text: '选项 3' },
      { position: { x: 0, y: 0, w: 'w', h: 'h/5' }, text: '选项 1' },
      { position: { x: 0, y: 'h*0.2', w: 'w', h: 'h/5' }, text: '选项 2' },
      { position: { x: 0, y: 'h*0.6', w: 'w', h: 'h/5' }, text: '选项 4' },
      { position: { x: 0, y: 'h*0.8', w: 'w', h: 'h/5' }, text: '选项 5' }
    ],
    fillStyle: { type: 'solid', color: '255,255,255' },
    fontStyle: { size: 12, color: '80,80,80' },
    shapeStyle: { alpha: 0.7 },
    attribute: { linkable: false }
  }
]
