// ═══════════════════════════════════════════
// 旧系统 ios_icons.js 中尚未移植的 59 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category iosIcons（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// 旧素材整分类都是「rectangle + PNG 图片填充」，字形由 scripts/lib/mobile-icon-glyphs.mjs 重画为原生矢量
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const iosIconsLegacyShapes: ShapeDefinition[] = [
  /** 添加（黑底）（26×26） */
  {
    name: 'ios7AddBlack',
    title: '添加（黑底）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.42', y: 'h*0.22' },
          { action: 'line', x: 'w*0.58', y: 'h*0.22' },
          { action: 'line', x: 'w*0.58', y: 'h*0.42' },
          { action: 'line', x: 'w*0.78', y: 'h*0.42' },
          { action: 'line', x: 'w*0.78', y: 'h*0.58' },
          { action: 'line', x: 'w*0.58', y: 'h*0.58' },
          { action: 'line', x: 'w*0.58', y: 'h*0.78' },
          { action: 'line', x: 'w*0.42', y: 'h*0.78' },
          { action: 'line', x: 'w*0.42', y: 'h*0.58' },
          { action: 'line', x: 'w*0.22', y: 'h*0.58' },
          { action: 'line', x: 'w*0.22', y: 'h*0.42' },
          { action: 'line', x: 'w*0.42', y: 'h*0.42' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 添加（描边）（26×26） */
  {
    name: 'ios7AddBlackLight',
    title: '添加（描边）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.1', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.1',
            y1: 'h*-0.033462',
            x2: 'w*0.9',
            y2: 'h*-0.033462',
            x: 'w*0.9',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.9',
            y1: 'h*1.033462',
            x2: 'w*0.1',
            y2: 'h*1.033462',
            x: 'w*0.1',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.42', y: 'h*0.22' },
        { action: 'line', x: 'w*0.58', y: 'h*0.22' },
        { action: 'line', x: 'w*0.58', y: 'h*0.42' },
        { action: 'line', x: 'w*0.78', y: 'h*0.42' },
        { action: 'line', x: 'w*0.78', y: 'h*0.58' },
        { action: 'line', x: 'w*0.58', y: 'h*0.58' },
        { action: 'line', x: 'w*0.58', y: 'h*0.78' },
        { action: 'line', x: 'w*0.42', y: 'h*0.78' },
        { action: 'line', x: 'w*0.42', y: 'h*0.58' },
        { action: 'line', x: 'w*0.22', y: 'h*0.58' },
        { action: 'line', x: 'w*0.22', y: 'h*0.42' },
        { action: 'line', x: 'w*0.42', y: 'h*0.42' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 添加（绿底）（26×26） */
  {
    name: 'ios7AddGreen',
    title: '添加（绿底）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.42', y: 'h*0.22' },
          { action: 'line', x: 'w*0.58', y: 'h*0.22' },
          { action: 'line', x: 'w*0.58', y: 'h*0.42' },
          { action: 'line', x: 'w*0.78', y: 'h*0.42' },
          { action: 'line', x: 'w*0.78', y: 'h*0.58' },
          { action: 'line', x: 'w*0.58', y: 'h*0.58' },
          { action: 'line', x: 'w*0.58', y: 'h*0.78' },
          { action: 'line', x: 'w*0.42', y: 'h*0.78' },
          { action: 'line', x: 'w*0.42', y: 'h*0.58' },
          { action: 'line', x: 'w*0.22', y: 'h*0.58' },
          { action: 'line', x: 'w*0.22', y: 'h*0.42' },
          { action: 'line', x: 'w*0.42', y: 'h*0.42' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '90,200,125' },
    fillStyle: { type: 'solid', color: '90,200,125' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 添加（蓝描边）（26×26） */
  {
    name: 'ios7AddNormal',
    title: '添加（蓝描边）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.1', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.1',
            y1: 'h*-0.033462',
            x2: 'w*0.9',
            y2: 'h*-0.033462',
            x: 'w*0.9',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.9',
            y1: 'h*1.033462',
            x2: 'w*0.1',
            y2: 'h*1.033462',
            x: 'w*0.1',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.42', y: 'h*0.22' },
        { action: 'line', x: 'w*0.58', y: 'h*0.22' },
        { action: 'line', x: 'w*0.58', y: 'h*0.42' },
        { action: 'line', x: 'w*0.78', y: 'h*0.42' },
        { action: 'line', x: 'w*0.78', y: 'h*0.58' },
        { action: 'line', x: 'w*0.58', y: 'h*0.58' },
        { action: 'line', x: 'w*0.58', y: 'h*0.78' },
        { action: 'line', x: 'w*0.42', y: 'h*0.78' },
        { action: 'line', x: 'w*0.42', y: 'h*0.58' },
        { action: 'line', x: 'w*0.22', y: 'h*0.58' },
        { action: 'line', x: 'w*0.22', y: 'h*0.42' },
        { action: 'line', x: 'w*0.42', y: 'h*0.42' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '10,132,255' },
    fillStyle: { type: 'solid', color: '10,132,255' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 删除（黑底）（26×26） */
  {
    name: 'ios7RemoveBlack',
    title: '删除（黑底）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.22', y: 'h*0.42' },
          { action: 'line', x: 'w*0.78', y: 'h*0.42' },
          { action: 'line', x: 'w*0.78', y: 'h*0.58' },
          { action: 'line', x: 'w*0.22', y: 'h*0.58' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 删除（描边）（26×26） */
  {
    name: 'ios7RemoveBlackLight',
    title: '删除（描边）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.1', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.1',
            y1: 'h*-0.033462',
            x2: 'w*0.9',
            y2: 'h*-0.033462',
            x: 'w*0.9',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.9',
            y1: 'h*1.033462',
            x2: 'w*0.1',
            y2: 'h*1.033462',
            x: 'w*0.1',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.22', y: 'h*0.42' },
        { action: 'line', x: 'w*0.78', y: 'h*0.42' },
        { action: 'line', x: 'w*0.78', y: 'h*0.58' },
        { action: 'line', x: 'w*0.22', y: 'h*0.58' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 删除（红底）（26×26） */
  {
    name: 'ios7RemoveRed',
    title: '删除（红底）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.22', y: 'h*0.42' },
          { action: 'line', x: 'w*0.78', y: 'h*0.42' },
          { action: 'line', x: 'w*0.78', y: 'h*0.58' },
          { action: 'line', x: 'w*0.22', y: 'h*0.58' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '235,61,54' },
    fillStyle: { type: 'solid', color: '235,61,54' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 加号（19×19） */
  {
    name: 'ios7AddSmall',
    title: '加号',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 19, h: 19 },
    path: [
      [
        { action: 'move', x: 'w*0.42', y: 'h*0.22' },
        { action: 'line', x: 'w*0.58', y: 'h*0.22' },
        { action: 'line', x: 'w*0.58', y: 'h*0.42' },
        { action: 'line', x: 'w*0.78', y: 'h*0.42' },
        { action: 'line', x: 'w*0.78', y: 'h*0.58' },
        { action: 'line', x: 'w*0.58', y: 'h*0.58' },
        { action: 'line', x: 'w*0.58', y: 'h*0.78' },
        { action: 'line', x: 'w*0.42', y: 'h*0.78' },
        { action: 'line', x: 'w*0.42', y: 'h*0.58' },
        { action: 'line', x: 'w*0.22', y: 'h*0.58' },
        { action: 'line', x: 'w*0.22', y: 'h*0.42' },
        { action: 'line', x: 'w*0.42', y: 'h*0.42' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '10,132,255' },
    fillStyle: { type: 'solid', color: '10,132,255' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 关闭（20×20） */
  {
    name: 'ios7Close1',
    title: '关闭',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 20, h: 20 },
    path: [
      [
        { action: 'move', x: 'w*0.645', y: 'h*0.249' },
        { action: 'line', x: 'w*0.751', y: 'h*0.355' },
        { action: 'line', x: 'w*0.606', y: 'h*0.5' },
        { action: 'line', x: 'w*0.751', y: 'h*0.645' },
        { action: 'line', x: 'w*0.645', y: 'h*0.751' },
        { action: 'line', x: 'w*0.5', y: 'h*0.606' },
        { action: 'line', x: 'w*0.355', y: 'h*0.751' },
        { action: 'line', x: 'w*0.249', y: 'h*0.645' },
        { action: 'line', x: 'w*0.394', y: 'h*0.5' },
        { action: 'line', x: 'w*0.249', y: 'h*0.355' },
        { action: 'line', x: 'w*0.355', y: 'h*0.249' },
        { action: 'line', x: 'w*0.5', y: 'h*0.394' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 关闭（蓝标签）（26×22） */
  {
    name: 'ios7Close2',
    title: '关闭（蓝标签）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 22 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'line', x: 'w*0.22', y: 'h*0.15' },
          { action: 'quadraticCurve', x1: 'w*0.62', y1: 'h*-0.12', x: 'w*0.9', y: 'h*0.14' },
          { action: 'quadraticCurve', x1: 'w*1.12', y1: 'h*0.5', x: 'w*0.9', y: 'h*0.86' },
          { action: 'quadraticCurve', x1: 'w*0.62', y1: 'h*1.12', x: 'w*0.22', y: 'h*0.85' },
          { action: 'close' },
          { action: 'move', x: 'w*0.724615', y: 'h*0.27' },
          { action: 'line', x: 'w*0.814615', y: 'h*0.376364' },
          { action: 'line', x: 'w*0.709615', y: 'h*0.5' },
          { action: 'line', x: 'w*0.814615', y: 'h*0.623636' },
          { action: 'line', x: 'w*0.724615', y: 'h*0.73' },
          { action: 'line', x: 'w*0.62', y: 'h*0.605909' },
          { action: 'line', x: 'w*0.515385', y: 'h*0.73' },
          { action: 'line', x: 'w*0.425385', y: 'h*0.623636' },
          { action: 'line', x: 'w*0.530385', y: 'h*0.5' },
          { action: 'line', x: 'w*0.425385', y: 'h*0.376364' },
          { action: 'line', x: 'w*0.515385', y: 'h*0.27' },
          { action: 'line', x: 'w*0.62', y: 'h*0.394091' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '10,132,255' },
    fillStyle: { type: 'solid', color: '10,132,255' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 关闭（黑标签）（26×23） */
  {
    name: 'ios7Close3',
    title: '关闭（黑标签）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 23 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'line', x: 'w*0.22', y: 'h*0.15' },
          { action: 'quadraticCurve', x1: 'w*0.62', y1: 'h*-0.12', x: 'w*0.9', y: 'h*0.14' },
          { action: 'quadraticCurve', x1: 'w*1.12', y1: 'h*0.5', x: 'w*0.9', y: 'h*0.86' },
          { action: 'quadraticCurve', x1: 'w*0.62', y1: 'h*1.12', x: 'w*0.22', y: 'h*0.85' },
          { action: 'close' },
          { action: 'move', x: 'w*0.729615', y: 'h*0.27' },
          { action: 'line', x: 'w*0.823462', y: 'h*0.376087' },
          { action: 'line', x: 'w*0.713846', y: 'h*0.5' },
          { action: 'line', x: 'w*0.823462', y: 'h*0.623913' },
          { action: 'line', x: 'w*0.729615', y: 'h*0.73' },
          { action: 'line', x: 'w*0.62', y: 'h*0.606087' },
          { action: 'line', x: 'w*0.510385', y: 'h*0.73' },
          { action: 'line', x: 'w*0.416538', y: 'h*0.623913' },
          { action: 'line', x: 'w*0.526154', y: 'h*0.5' },
          { action: 'line', x: 'w*0.416538', y: 'h*0.376087' },
          { action: 'line', x: 'w*0.510385', y: 'h*0.27' },
          { action: 'line', x: 'w*0.62', y: 'h*0.393913' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 关闭（标签描边）（26×23） */
  {
    name: 'ios7Close4',
    title: '关闭（标签描边）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 23 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'line', x: 'w*0.22', y: 'h*0.15' },
          { action: 'quadraticCurve', x1: 'w*0.62', y1: 'h*-0.12', x: 'w*0.9', y: 'h*0.14' },
          { action: 'quadraticCurve', x1: 'w*1.12', y1: 'h*0.5', x: 'w*0.9', y: 'h*0.86' },
          { action: 'quadraticCurve', x1: 'w*0.62', y1: 'h*1.12', x: 'w*0.22', y: 'h*0.85' },
          { action: 'close' },
          { action: 'move', x: 'w*0.075769', y: 'h*0.5' },
          { action: 'line', x: 'w*0.262308', y: 'h*0.21087' },
          { action: 'quadraticCurve', x1: 'w*0.601923', y1: 'h*-0.012609', x: 'w*0.839231', y: 'h*0.202609' },
          { action: 'quadraticCurve', x1: 'w*1.026154', y1: 'h*0.5', x: 'w*0.839231', y: 'h*0.797391' },
          { action: 'quadraticCurve', x1: 'w*0.601923', y1: 'h*1.012609', x: 'w*0.262308', y: 'h*0.78913' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.729615', y: 'h*0.27' },
        { action: 'line', x: 'w*0.823462', y: 'h*0.376087' },
        { action: 'line', x: 'w*0.713846', y: 'h*0.5' },
        { action: 'line', x: 'w*0.823462', y: 'h*0.623913' },
        { action: 'line', x: 'w*0.729615', y: 'h*0.73' },
        { action: 'line', x: 'w*0.62', y: 'h*0.606087' },
        { action: 'line', x: 'w*0.510385', y: 'h*0.73' },
        { action: 'line', x: 'w*0.416538', y: 'h*0.623913' },
        { action: 'line', x: 'w*0.526154', y: 'h*0.5' },
        { action: 'line', x: 'w*0.416538', y: 'h*0.376087' },
        { action: 'line', x: 'w*0.510385', y: 'h*0.27' },
        { action: 'line', x: 'w*0.62', y: 'h*0.393913' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 刷新（15×17） */
  {
    name: 'ios7Refresh',
    title: '刷新',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 15, h: 17 },
    path: [
      [
        { action: 'move', x: 'w*0.735333', y: 'h*0.214706' },
        { action: 'line', x: 'w*0.818', y: 'h*0.285882' },
        { action: 'line', x: 'w*0.874', y: 'h*0.375294' },
        { action: 'line', x: 'w*0.899333', y: 'h*0.475294' },
        { action: 'line', x: 'w*0.890667', y: 'h*0.577059' },
        { action: 'line', x: 'w*0.848667', y: 'h*0.672353' },
        { action: 'line', x: 'w*0.778667', y: 'h*0.753529' },
        { action: 'line', x: 'w*0.684667', y: 'h*0.812941' },
        { action: 'line', x: 'w*0.574667', y: 'h*0.846471' },
        { action: 'line', x: 'w*0.459333', y: 'h*0.851176' },
        { action: 'line', x: 'w*0.346667', y: 'h*0.825882' },
        { action: 'line', x: 'w*0.247333', y: 'h*0.773529' },
        { action: 'line', x: 'w*0.169333', y: 'h*0.698235' },
        { action: 'line', x: 'w*0.118667', y: 'h*0.606471' },
        { action: 'line', x: 'w*0.1', y: 'h*0.505294' },
        { action: 'line', x: 'w*0.115333', y: 'h*0.404118' },
        { action: 'line', x: 'w*0.162', y: 'h*0.311176' },
        { action: 'line', x: 'w*0.238', y: 'h*0.233529' },
        { action: 'line', x: 'w*0.335333', y: 'h*0.178235' },
        { action: 'line', x: 'w*0.446667', y: 'h*0.15' },
        { action: 'line', x: 'w*0.562667', y: 'h*0.151176' },
        { action: 'line', x: 'w*0.537333', y: 'h*0.290588' },
        { action: 'line', x: 'w*0.468', y: 'h*0.29' },
        { action: 'line', x: 'w*0.401333', y: 'h*0.307059' },
        { action: 'line', x: 'w*0.342667', y: 'h*0.34' },
        { action: 'line', x: 'w*0.297333', y: 'h*0.386471' },
        { action: 'line', x: 'w*0.269333', y: 'h*0.442353' },
        { action: 'line', x: 'w*0.26', y: 'h*0.503529' },
        { action: 'line', x: 'w*0.271333', y: 'h*0.564118' },
        { action: 'line', x: 'w*0.301333', y: 'h*0.618824' },
        { action: 'line', x: 'w*0.348667', y: 'h*0.664118' },
        { action: 'line', x: 'w*0.408', y: 'h*0.695882' },
        { action: 'line', x: 'w*0.475333', y: 'h*0.710588' },
        { action: 'line', x: 'w*0.544667', y: 'h*0.708235' },
        { action: 'line', x: 'w*0.610667', y: 'h*0.687647' },
        { action: 'line', x: 'w*0.667333', y: 'h*0.652353' },
        { action: 'line', x: 'w*0.709333', y: 'h*0.603529' },
        { action: 'line', x: 'w*0.734', y: 'h*0.546471' },
        { action: 'line', x: 'w*0.739333', y: 'h*0.485294' },
        { action: 'line', x: 'w*0.724667', y: 'h*0.425294' },
        { action: 'line', x: 'w*0.690667', y: 'h*0.371765' },
        { action: 'line', x: 'w*0.641333', y: 'h*0.328824' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.716667', y: 'h*0.172941' },
        { action: 'line', x: 'w*0.558', y: 'h*0.057647' },
        { action: 'line', x: 'w*0.526', y: 'h*0.239412' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 搜索（16×16） */
  {
    name: 'ios7SearchIcon',
    title: '搜索',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 16, h: 16 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.05', y: 'h*0.36' },
          {
            action: 'curve',
            x1: 'w*0.05',
            y1: 'h*-0.053333',
            x2: 'w*0.67',
            y2: 'h*-0.053333',
            x: 'w*0.67',
            y: 'h*0.36'
          },
          {
            action: 'curve',
            x1: 'w*0.67',
            y1: 'h*0.773333',
            x2: 'w*0.05',
            y2: 'h*0.773333',
            x: 'w*0.05',
            y: 'h*0.36'
          },
          { action: 'close' },
          { action: 'move', x: 'w*0.15', y: 'h*0.36' },
          { action: 'curve', x1: 'w*0.15', y1: 'h*0.08', x2: 'w*0.57', y2: 'h*0.08', x: 'w*0.57', y: 'h*0.36' },
          { action: 'curve', x1: 'w*0.57', y1: 'h*0.64', x2: 'w*0.15', y2: 'h*0.64', x: 'w*0.15', y: 'h*0.36' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.493125', y: 'h*0.59875' },
        { action: 'line', x: 'w*0.846875', y: 'h*0.953125' },
        { action: 'line', x: 'w*0.953125', y: 'h*0.846875' },
        { action: 'line', x: 'w*0.59875', y: 'h*0.493125' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 搜索（大）（24×24） */
  {
    name: 'ios7SearchBig',
    title: '搜索（大）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 24, h: 24 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.06', y: 'h*0.36' },
          {
            action: 'curve',
            x1: 'w*0.06',
            y1: 'h*-0.04',
            x2: 'w*0.66',
            y2: 'h*-0.04',
            x: 'w*0.66',
            y: 'h*0.36'
          },
          { action: 'curve', x1: 'w*0.66', y1: 'h*0.76', x2: 'w*0.06', y2: 'h*0.76', x: 'w*0.06', y: 'h*0.36' },
          { action: 'close' },
          { action: 'move', x: 'w*0.14', y: 'h*0.36' },
          {
            action: 'curve',
            x1: 'w*0.14',
            y1: 'h*0.066667',
            x2: 'w*0.58',
            y2: 'h*0.066667',
            x: 'w*0.58',
            y: 'h*0.36'
          },
          {
            action: 'curve',
            x1: 'w*0.58',
            y1: 'h*0.653333',
            x2: 'w*0.14',
            y2: 'h*0.653333',
            x: 'w*0.14',
            y: 'h*0.36'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.494583', y: 'h*0.585417' },
        { action: 'line', x: 'w*0.894583', y: 'h*0.985417' },
        { action: 'line', x: 'w*0.985417', y: 'h*0.894583' },
        { action: 'line', x: 'w*0.585417', y: 'h*0.494583' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 菜单（18×16） */
  {
    name: 'ios7MenuIcon',
    title: '菜单',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 18, h: 16 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.075' },
        { action: 'line', x: 'w*1', y: 'h*0.075' },
        { action: 'line', x: 'w*1', y: 'h*0.205' },
        { action: 'line', x: 0, y: 'h*0.205' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 0, y: 'h*0.435' },
        { action: 'line', x: 'w*1', y: 'h*0.435' },
        { action: 'line', x: 'w*1', y: 'h*0.565' },
        { action: 'line', x: 0, y: 'h*0.565' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 0, y: 'h*0.795' },
        { action: 'line', x: 'w*1', y: 'h*0.795' },
        { action: 'line', x: 'w*1', y: 'h*0.925' },
        { action: 'line', x: 0, y: 'h*0.925' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 向上（23×10） */
  {
    name: 'ios7ArrowUp',
    title: '向上',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 23, h: 10 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h' },
          { action: 'line', x: 'w/2', y: 0 },
          { action: 'line', x: 'w', y: 'h' }
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
    textBlock: [],
    lineStyle: { lineColor: '27,124,250' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 向下（23×10） */
  {
    name: 'ios7ArrowDown',
    title: '向下',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 23, h: 10 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w/2', y: 'h' },
          { action: 'line', x: 'w', y: 0 }
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
    textBlock: [],
    lineStyle: { lineColor: '27,124,250' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 向左（10×23） */
  {
    name: 'ios7ArrowLeft',
    title: '向左',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 10, h: 23 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w', y: 0 },
          { action: 'line', x: 0, y: 'h/2' },
          { action: 'line', x: 'w', y: 'h' }
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
    textBlock: [],
    lineStyle: { lineColor: '27,124,250' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 向右（10×23） */
  {
    name: 'ios7ArrowRight',
    title: '向右',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 10, h: 23 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 'h/2' },
          { action: 'line', x: 0, y: 'h' }
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
    textBlock: [],
    lineStyle: { lineColor: '27,124,250' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 信息（蓝描边）（26×26） */
  {
    name: 'ios7Info1',
    title: '信息（蓝描边）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.1', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.1',
            y1: 'h*-0.033462',
            x2: 'w*0.9',
            y2: 'h*-0.033462',
            x: 'w*0.9',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.9',
            y1: 'h*1.033462',
            x2: 'w*0.1',
            y2: 'h*1.033462',
            x: 'w*0.1',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.43', y: 'h*0.27' },
        {
          action: 'curve',
          x1: 'w*0.43',
          y1: 'h*0.176667',
          x2: 'w*0.57',
          y2: 'h*0.176667',
          x: 'w*0.57',
          y: 'h*0.27'
        },
        {
          action: 'curve',
          x1: 'w*0.57',
          y1: 'h*0.363333',
          x2: 'w*0.43',
          y2: 'h*0.363333',
          x: 'w*0.43',
          y: 'h*0.27'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.44', y: 'h*0.39' },
        { action: 'line', x: 'w*0.56', y: 'h*0.39' },
        { action: 'line', x: 'w*0.56', y: 'h*0.73' },
        { action: 'line', x: 'w*0.44', y: 'h*0.73' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '10,132,255' },
    fillStyle: { type: 'solid', color: '10,132,255' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 信息（描边）（26×26） */
  {
    name: 'ios7Info2',
    title: '信息（描边）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.1', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.1',
            y1: 'h*-0.033462',
            x2: 'w*0.9',
            y2: 'h*-0.033462',
            x: 'w*0.9',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.9',
            y1: 'h*1.033462',
            x2: 'w*0.1',
            y2: 'h*1.033462',
            x: 'w*0.1',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.43', y: 'h*0.27' },
        {
          action: 'curve',
          x1: 'w*0.43',
          y1: 'h*0.176667',
          x2: 'w*0.57',
          y2: 'h*0.176667',
          x: 'w*0.57',
          y: 'h*0.27'
        },
        {
          action: 'curve',
          x1: 'w*0.57',
          y1: 'h*0.363333',
          x2: 'w*0.43',
          y2: 'h*0.363333',
          x: 'w*0.43',
          y: 'h*0.27'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.44', y: 'h*0.39' },
        { action: 'line', x: 'w*0.56', y: 'h*0.39' },
        { action: 'line', x: 'w*0.56', y: 'h*0.73' },
        { action: 'line', x: 'w*0.44', y: 'h*0.73' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 信息（黑底）（26×26） */
  {
    name: 'ios7Info3',
    title: '信息（黑底）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.43', y: 'h*0.27' },
          {
            action: 'curve',
            x1: 'w*0.43',
            y1: 'h*0.176667',
            x2: 'w*0.57',
            y2: 'h*0.176667',
            x: 'w*0.57',
            y: 'h*0.27'
          },
          {
            action: 'curve',
            x1: 'w*0.57',
            y1: 'h*0.363333',
            x2: 'w*0.43',
            y2: 'h*0.363333',
            x: 'w*0.43',
            y: 'h*0.27'
          },
          { action: 'close' },
          { action: 'move', x: 'w*0.44', y: 'h*0.39' },
          { action: 'line', x: 'w*0.56', y: 'h*0.39' },
          { action: 'line', x: 'w*0.56', y: 'h*0.73' },
          { action: 'line', x: 'w*0.44', y: 'h*0.73' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 选中（描边）（26×26） */
  {
    name: 'ios7Check1',
    title: '选中（描边）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.1', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.1',
            y1: 'h*-0.033462',
            x2: 'w*0.9',
            y2: 'h*-0.033462',
            x: 'w*0.9',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.9',
            y1: 'h*1.033462',
            x2: 'w*0.1',
            y2: 'h*1.033462',
            x: 'w*0.1',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.203846', y: 'h*0.57' },
        { action: 'line', x: 'w*0.450385', y: 'h*0.768462' },
        { action: 'line', x: 'w*0.817308', y: 'h*0.348462' },
        { action: 'line', x: 'w*0.702692', y: 'h*0.251538' },
        { action: 'line', x: 'w*0.389615', y: 'h*0.631538' },
        { action: 'line', x: 'w*0.316154', y: 'h*0.47' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 选中（蓝底）（26×26） */
  {
    name: 'ios7Check2',
    title: '选中（蓝底）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.203846', y: 'h*0.57' },
          { action: 'line', x: 'w*0.450385', y: 'h*0.768462' },
          { action: 'line', x: 'w*0.817308', y: 'h*0.348462' },
          { action: 'line', x: 'w*0.702692', y: 'h*0.251538' },
          { action: 'line', x: 'w*0.389615', y: 'h*0.631538' },
          { action: 'line', x: 'w*0.316154', y: 'h*0.47' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '10,132,255' },
    fillStyle: { type: 'solid', color: '10,132,255' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 选中（黑底）（26×26） */
  {
    name: 'ios7Check3',
    title: '选中（黑底）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.203846', y: 'h*0.57' },
          { action: 'line', x: 'w*0.450385', y: 'h*0.768462' },
          { action: 'line', x: 'w*0.817308', y: 'h*0.348462' },
          { action: 'line', x: 'w*0.702692', y: 'h*0.251538' },
          { action: 'line', x: 'w*0.389615', y: 'h*0.631538' },
          { action: 'line', x: 'w*0.316154', y: 'h*0.47' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 对勾（蓝）（14×16） */
  {
    name: 'ios7Check4',
    title: '对勾（蓝）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 14, h: 16 },
    path: [
      [
        { action: 'move', x: 'w*0.027143', y: 'h*0.60375' },
        { action: 'line', x: 'w*0.425714', y: 'h*0.913125' },
        { action: 'line', x: 'w*0.997857', y: 'h*0.2075' },
        { action: 'line', x: 'w*0.842143', y: 'h*0.1125' },
        { action: 'line', x: 'w*0.334286', y: 'h*0.766875' },
        { action: 'line', x: 'w*0.172857', y: 'h*0.49625' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '10,132,255' },
    fillStyle: { type: 'solid', color: '10,132,255' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 对勾（14×16） */
  {
    name: 'ios7Check5',
    title: '对勾',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 14, h: 16 },
    path: [
      [
        { action: 'move', x: 'w*0.027143', y: 'h*0.60375' },
        { action: 'line', x: 'w*0.425714', y: 'h*0.913125' },
        { action: 'line', x: 'w*0.997857', y: 'h*0.2075' },
        { action: 'line', x: 'w*0.842143', y: 'h*0.1125' },
        { action: 'line', x: 'w*0.334286', y: 'h*0.766875' },
        { action: 'line', x: 'w*0.172857', y: 'h*0.49625' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 播放（黑底）（26×26） */
  {
    name: 'ios7Play1',
    title: '播放（黑底）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.37', y: 'h*0.27' },
          { action: 'line', x: 'w*0.37', y: 'h*0.73' },
          { action: 'line', x: 'w*0.72', y: 'h*0.5' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 播放（描边）（26×26） */
  {
    name: 'ios7Play2',
    title: '播放（描边）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.1', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.1',
            y1: 'h*-0.033462',
            x2: 'w*0.9',
            y2: 'h*-0.033462',
            x: 'w*0.9',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.9',
            y1: 'h*1.033462',
            x2: 'w*0.1',
            y2: 'h*1.033462',
            x: 'w*0.1',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.37', y: 'h*0.27' },
        { action: 'line', x: 'w*0.37', y: 'h*0.73' },
        { action: 'line', x: 'w*0.72', y: 'h*0.5' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 暂停（黑底）（26×26） */
  {
    name: 'ios7Pause1',
    title: '暂停（黑底）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.279', y: 'h*0.3' },
          { action: 'line', x: 'w*0.409', y: 'h*0.3' },
          { action: 'line', x: 'w*0.409', y: 'h*0.7' },
          { action: 'line', x: 'w*0.279', y: 'h*0.7' },
          { action: 'close' },
          { action: 'move', x: 'w*0.591', y: 'h*0.3' },
          { action: 'line', x: 'w*0.721', y: 'h*0.3' },
          { action: 'line', x: 'w*0.721', y: 'h*0.7' },
          { action: 'line', x: 'w*0.591', y: 'h*0.7' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 暂停（描边）（26×26） */
  {
    name: 'ios7Pause2',
    title: '暂停（描边）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.1', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.1',
            y1: 'h*-0.033462',
            x2: 'w*0.9',
            y2: 'h*-0.033462',
            x: 'w*0.9',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.9',
            y1: 'h*1.033462',
            x2: 'w*0.1',
            y2: 'h*1.033462',
            x: 'w*0.1',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.279', y: 'h*0.3' },
        { action: 'line', x: 'w*0.409', y: 'h*0.3' },
        { action: 'line', x: 'w*0.409', y: 'h*0.7' },
        { action: 'line', x: 'w*0.279', y: 'h*0.7' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.591', y: 'h*0.3' },
        { action: 'line', x: 'w*0.721', y: 'h*0.3' },
        { action: 'line', x: 'w*0.721', y: 'h*0.7' },
        { action: 'line', x: 'w*0.591', y: 'h*0.7' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 停止（描边）（26×26） */
  {
    name: 'ios7Stop2',
    title: '停止（描边）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.1', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.1',
            y1: 'h*-0.033462',
            x2: 'w*0.9',
            y2: 'h*-0.033462',
            x: 'w*0.9',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.9',
            y1: 'h*1.033462',
            x2: 'w*0.1',
            y2: 'h*1.033462',
            x: 'w*0.1',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.34', y: 'h*0.34' },
        { action: 'line', x: 'w*0.66', y: 'h*0.34' },
        { action: 'line', x: 'w*0.66', y: 'h*0.66' },
        { action: 'line', x: 'w*0.34', y: 'h*0.66' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 停止（黑底）（26×26） */
  {
    name: 'ios7Stop3',
    title: '停止（黑底）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.34', y: 'h*0.34' },
          { action: 'line', x: 'w*0.66', y: 'h*0.34' },
          { action: 'line', x: 'w*0.66', y: 'h*0.66' },
          { action: 'line', x: 'w*0.34', y: 'h*0.66' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 暂停（蓝描边）（26×26） */
  {
    name: 'ios7Stop1',
    title: '暂停（蓝描边）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.1', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.1',
            y1: 'h*-0.033462',
            x2: 'w*0.9',
            y2: 'h*-0.033462',
            x: 'w*0.9',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.9',
            y1: 'h*1.033462',
            x2: 'w*0.1',
            y2: 'h*1.033462',
            x: 'w*0.1',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.279', y: 'h*0.3' },
        { action: 'line', x: 'w*0.409', y: 'h*0.3' },
        { action: 'line', x: 'w*0.409', y: 'h*0.7' },
        { action: 'line', x: 'w*0.279', y: 'h*0.7' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.591', y: 'h*0.3' },
        { action: 'line', x: 'w*0.721', y: 'h*0.3' },
        { action: 'line', x: 'w*0.721', y: 'h*0.7' },
        { action: 'line', x: 'w*0.591', y: 'h*0.7' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '10,132,255' },
    fillStyle: { type: 'solid', color: '10,132,255' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 收藏（蓝）（18×18） */
  {
    name: 'ios7Favourite',
    title: '收藏（蓝）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 18, h: 18 },
    path: [
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.04' },
        { action: 'line', x: 'w*0.623333', y: 'h*0.37' },
        { action: 'line', x: 'w*0.975556', y: 'h*0.385556' },
        { action: 'line', x: 'w*0.699444', y: 'h*0.605' },
        { action: 'line', x: 'w*0.793889', y: 'h*0.944444' },
        { action: 'line', x: 'w*0.5', y: 'h*0.75' },
        { action: 'line', x: 'w*0.206111', y: 'h*0.944444' },
        { action: 'line', x: 'w*0.300556', y: 'h*0.605' },
        { action: 'line', x: 'w*0.024444', y: 'h*0.385556' },
        { action: 'line', x: 'w*0.376667', y: 'h*0.37' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '10,132,255' },
    fillStyle: { type: 'solid', color: '10,132,255' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 收藏（描边）（24×24） */
  {
    name: 'ios7Favourite1',
    title: '收藏（描边）',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 24, h: 24 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.06' },
          { action: 'line', x: 'w*0.618333', y: 'h*0.377083' },
          { action: 'line', x: 'w*0.956667', y: 'h*0.391667' },
          { action: 'line', x: 'w*0.691667', y: 'h*0.6025' },
          { action: 'line', x: 'w*0.782083', y: 'h*0.928333' },
          { action: 'line', x: 'w*0.5', y: 'h*0.741667' },
          { action: 'line', x: 'w*0.217917', y: 'h*0.928333' },
          { action: 'line', x: 'w*0.308333', y: 'h*0.6025' },
          { action: 'line', x: 'w*0.043333', y: 'h*0.391667' },
          { action: 'line', x: 'w*0.381667', y: 'h*0.377083' },
          { action: 'close' },
          { action: 'move', x: 'w*0.5', y: 'h*0.15' },
          { action: 'line', x: 'w*0.59625', y: 'h*0.4075' },
          { action: 'line', x: 'w*0.87125', y: 'h*0.419583' },
          { action: 'line', x: 'w*0.655833', y: 'h*0.590833' },
          { action: 'line', x: 'w*0.729167', y: 'h*0.855417' },
          { action: 'line', x: 'w*0.5', y: 'h*0.70375' },
          { action: 'line', x: 'w*0.270833', y: 'h*0.855417' },
          { action: 'line', x: 'w*0.344167', y: 'h*0.590833' },
          { action: 'line', x: 'w*0.12875', y: 'h*0.419583' },
          { action: 'line', x: 'w*0.40375', y: 'h*0.4075' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 喜欢（24×24） */
  {
    name: 'ios7Heart',
    title: '喜欢',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 24, h: 24 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.47', y: 'h*0.846' },
          { action: 'quadraticCurve', x1: 'w*-0.0564', y1: 'h*0.47', x: 'w*0.1128', y: 'h*0.188' },
          { action: 'quadraticCurve', x1: 'w*0.282', y1: 0, x: 'w*0.47', y: 'h*0.2632' },
          { action: 'quadraticCurve', x1: 'w*0.658', y1: 0, x: 'w*0.8272', y: 'h*0.188' },
          { action: 'quadraticCurve', x1: 'w*0.9964', y1: 'h*0.47', x: 'w*0.47', y: 'h*0.846' },
          { action: 'close' },
          { action: 'move', x: 'w*0.47', y: 'h*0.774167' },
          { action: 'quadraticCurve', x1: 'w*0.044583', y1: 'h*0.47', x: 'w*0.18125', y: 'h*0.242083' },
          { action: 'quadraticCurve', x1: 'w*0.317917', y1: 'h*0.09', x: 'w*0.47', y: 'h*0.302917' },
          { action: 'quadraticCurve', x1: 'w*0.622083', y1: 'h*0.09', x: 'w*0.75875', y: 'h*0.242083' },
          { action: 'quadraticCurve', x1: 'w*0.895417', y1: 'h*0.47', x: 'w*0.47', y: 'h*0.774167' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 书签（30×26） */
  {
    name: 'ios7Bookmark',
    title: '书签',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 30, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.04', y: 'h*0.13' },
          { action: 'quadraticCurve', x1: 'w*0.3', y1: 'h*0.02', x: 'w*0.5', y: 'h*0.09' },
          { action: 'quadraticCurve', x1: 'w*0.7', y1: 'h*0.02', x: 'w*0.96', y: 'h*0.13' },
          { action: 'line', x: 'w*0.96', y: 'h*0.88' },
          { action: 'quadraticCurve', x1: 'w*0.7', y1: 'h*0.98', x: 'w*0.5', y: 'h*0.91' },
          { action: 'quadraticCurve', x1: 'w*0.3', y1: 'h*0.98', x: 'w*0.04', y: 'h*0.88' },
          { action: 'close' },
          { action: 'move', x: 'w*0.47', y: 'h*0.12' },
          { action: 'line', x: 'w*0.53', y: 'h*0.12' },
          { action: 'line', x: 'w*0.53', y: 'h*0.88' },
          { action: 'line', x: 'w*0.47', y: 'h*0.88' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '10,132,255' },
    fillStyle: { type: 'solid', color: '10,132,255' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 个人信息（28×28） */
  {
    name: 'ios7Profile',
    title: '个人信息',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 28, h: 28 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.37', y: 'h*0.3' },
          {
            action: 'curve',
            x1: 'w*0.37',
            y1: 'h*0.126667',
            x2: 'w*0.63',
            y2: 'h*0.126667',
            x: 'w*0.63',
            y: 'h*0.3'
          },
          {
            action: 'curve',
            x1: 'w*0.63',
            y1: 'h*0.473333',
            x2: 'w*0.37',
            y2: 'h*0.473333',
            x: 'w*0.37',
            y: 'h*0.3'
          },
          { action: 'close' },
          { action: 'move', x: 'w*0.23', y: 'h*0.85' },
          { action: 'line', x: 'w*0.26', y: 'h*0.55' },
          { action: 'line', x: 'w*0.5', y: 'h*0.52' },
          { action: 'line', x: 'w*0.74', y: 'h*0.55' },
          { action: 'line', x: 'w*0.77', y: 'h*0.85' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '10,132,255' },
    fillStyle: { type: 'solid', color: '10,132,255' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 复制（28×28） */
  {
    name: 'ios7Copy',
    title: '复制',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 28, h: 28 },
    path: [
      [
        { action: 'move', x: 'w*0.36', y: 'h*0.14' },
        { action: 'line', x: 'w*0.913929', y: 'h*0.130357' },
        { action: 'line', x: 'w*0.9', y: 'h*0.6' },
        { action: 'line', x: 'w*0.98', y: 'h*0.6' },
        { action: 'line', x: 'w*0.966071', y: 'h*0.069643' },
        { action: 'line', x: 'w*0.36', y: 'h*0.06' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.06', y: 'h*0.36' },
          { action: 'quadraticCurve', x1: 'w*0.06', y1: 'h*0.3', x: 'w*0.12', y: 'h*0.3' },
          { action: 'line', x: 'w*0.6', y: 'h*0.3' },
          { action: 'quadraticCurve', x1: 'w*0.66', y1: 'h*0.3', x: 'w*0.66', y: 'h*0.36' },
          { action: 'line', x: 'w*0.66', y: 'h*0.88' },
          { action: 'quadraticCurve', x1: 'w*0.66', y1: 'h*0.94', x: 'w*0.6', y: 'h*0.94' },
          { action: 'line', x: 'w*0.12', y: 'h*0.94' },
          { action: 'quadraticCurve', x1: 'w*0.06', y1: 'h*0.94', x: 'w*0.06', y: 'h*0.88' },
          { action: 'close' },
          { action: 'move', x: 'w*0.14', y: 'h*0.425' },
          { action: 'quadraticCurve', x1: 'w*0.14', y1: 'h*0.38', x: 'w*0.183929', y: 'h*0.38' },
          { action: 'line', x: 'w*0.536071', y: 'h*0.38' },
          { action: 'quadraticCurve', x1: 'w*0.58', y1: 'h*0.38', x: 'w*0.58', y: 'h*0.425' },
          { action: 'line', x: 'w*0.58', y: 'h*0.815' },
          { action: 'quadraticCurve', x1: 'w*0.58', y1: 'h*0.86', x: 'w*0.536071', y: 'h*0.86' },
          { action: 'line', x: 'w*0.183929', y: 'h*0.86' },
          { action: 'quadraticCurve', x1: 'w*0.14', y1: 'h*0.86', x: 'w*0.14', y: 'h*0.815' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '10,132,255' },
    fillStyle: { type: 'solid', color: '10,132,255' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 上传（20×28） */
  {
    name: 'ios7Upload',
    title: '上传',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 20, h: 28 },
    path: [
      [
        { action: 'move', x: 'w*0.01', y: 'h*0.42' },
        { action: 'line', x: 'w*0.028', y: 'h*0.9675' },
        { action: 'line', x: 'w*0.972', y: 'h*0.9675' },
        { action: 'line', x: 'w*0.99', y: 'h*0.42' },
        { action: 'line', x: 'w*0.89', y: 'h*0.42' },
        { action: 'line', x: 'w*0.908', y: 'h*0.9125' },
        { action: 'line', x: 'w*0.092', y: 'h*0.9125' },
        { action: 'line', x: 'w*0.11', y: 'h*0.42' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.55', y: 'h*0.76' },
        { action: 'line', x: 'w*0.55', y: 'h*0.14' },
        { action: 'line', x: 'w*0.45', y: 'h*0.14' },
        { action: 'line', x: 'w*0.45', y: 'h*0.76' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.24', y: 'h*0.3' },
        { action: 'line', x: 'w*0.5', y: 'h*0.02' },
        { action: 'line', x: 'w*0.76', y: 'h*0.3' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '10,132,255' },
    fillStyle: { type: 'solid', color: '10,132,255' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 无线网络（24×24） */
  {
    name: 'ios7Wifi',
    title: '无线网络',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 24, h: 24 },
    path: [
      [
        { action: 'move', x: 'w*0.327917', y: 'h*0.692917' },
        { action: 'line', x: 'w*0.356667', y: 'h*0.6675' },
        { action: 'line', x: 'w*0.389167', y: 'h*0.647083' },
        { action: 'line', x: 'w*0.424583', y: 'h*0.632083' },
        { action: 'line', x: 'w*0.461667', y: 'h*0.622917' },
        { action: 'line', x: 'w*0.5', y: 'h*0.62' },
        { action: 'line', x: 'w*0.538333', y: 'h*0.622917' },
        { action: 'line', x: 'w*0.575417', y: 'h*0.632083' },
        { action: 'line', x: 'w*0.610833', y: 'h*0.647083' },
        { action: 'line', x: 'w*0.643333', y: 'h*0.6675' },
        { action: 'line', x: 'w*0.672083', y: 'h*0.692917' },
        { action: 'line', x: 'w*0.6075', y: 'h*0.755417' },
        { action: 'line', x: 'w*0.589583', y: 'h*0.739583' },
        { action: 'line', x: 'w*0.569167', y: 'h*0.727083' },
        { action: 'line', x: 'w*0.547083', y: 'h*0.7175' },
        { action: 'line', x: 'w*0.52375', y: 'h*0.712083' },
        { action: 'line', x: 'w*0.5', y: 'h*0.71' },
        { action: 'line', x: 'w*0.47625', y: 'h*0.712083' },
        { action: 'line', x: 'w*0.452917', y: 'h*0.7175' },
        { action: 'line', x: 'w*0.430833', y: 'h*0.727083' },
        { action: 'line', x: 'w*0.410417', y: 'h*0.739583' },
        { action: 'line', x: 'w*0.3925', y: 'h*0.755417' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.191667', y: 'h*0.560417' },
        { action: 'line', x: 'w*0.243333', y: 'h*0.515' },
        { action: 'line', x: 'w*0.30125', y: 'h*0.47875' },
        { action: 'line', x: 'w*0.364583', y: 'h*0.451667' },
        { action: 'line', x: 'w*0.431667', y: 'h*0.435417' },
        { action: 'line', x: 'w*0.5', y: 'h*0.43' },
        { action: 'line', x: 'w*0.568333', y: 'h*0.435417' },
        { action: 'line', x: 'w*0.635417', y: 'h*0.451667' },
        { action: 'line', x: 'w*0.69875', y: 'h*0.47875' },
        { action: 'line', x: 'w*0.756667', y: 'h*0.515' },
        { action: 'line', x: 'w*0.808333', y: 'h*0.560417' },
        { action: 'line', x: 'w*0.74375', y: 'h*0.622917' },
        { action: 'line', x: 'w*0.702917', y: 'h*0.587083' },
        { action: 'line', x: 'w*0.657083', y: 'h*0.558333' },
        { action: 'line', x: 'w*0.607083', y: 'h*0.537083' },
        { action: 'line', x: 'w*0.554167', y: 'h*0.524167' },
        { action: 'line', x: 'w*0.5', y: 'h*0.52' },
        { action: 'line', x: 'w*0.445833', y: 'h*0.524167' },
        { action: 'line', x: 'w*0.392917', y: 'h*0.537083' },
        { action: 'line', x: 'w*0.342917', y: 'h*0.558333' },
        { action: 'line', x: 'w*0.297083', y: 'h*0.587083' },
        { action: 'line', x: 'w*0.25625', y: 'h*0.622917' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.055417', y: 'h*0.427917' },
        { action: 'line', x: 'w*0.129583', y: 'h*0.3625' },
        { action: 'line', x: 'w*0.21375', y: 'h*0.31' },
        { action: 'line', x: 'w*0.305', y: 'h*0.271667' },
        { action: 'line', x: 'w*0.40125', y: 'h*0.247917' },
        { action: 'line', x: 'w*0.5', y: 'h*0.24' },
        { action: 'line', x: 'w*0.59875', y: 'h*0.247917' },
        { action: 'line', x: 'w*0.695', y: 'h*0.271667' },
        { action: 'line', x: 'w*0.78625', y: 'h*0.31' },
        { action: 'line', x: 'w*0.870417', y: 'h*0.3625' },
        { action: 'line', x: 'w*0.944583', y: 'h*0.427917' },
        { action: 'line', x: 'w*0.88', y: 'h*0.490833' },
        { action: 'line', x: 'w*0.816667', y: 'h*0.435' },
        { action: 'line', x: 'w*0.744583', y: 'h*0.39' },
        { action: 'line', x: 'w*0.666667', y: 'h*0.357083' },
        { action: 'line', x: 'w*0.584583', y: 'h*0.336667' },
        { action: 'line', x: 'w*0.5', y: 'h*0.33' },
        { action: 'line', x: 'w*0.415417', y: 'h*0.336667' },
        { action: 'line', x: 'w*0.333333', y: 'h*0.357083' },
        { action: 'line', x: 'w*0.255417', y: 'h*0.39' },
        { action: 'line', x: 'w*0.183333', y: 'h*0.435' },
        { action: 'line', x: 'w*0.12', y: 'h*0.490833' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.44', y: 'h*0.84' },
        { action: 'curve', x1: 'w*0.44', y1: 'h*0.76', x2: 'w*0.56', y2: 'h*0.76', x: 'w*0.56', y: 'h*0.84' },
        { action: 'curve', x1: 'w*0.56', y1: 'h*0.92', x2: 'w*0.44', y2: 'h*0.92', x: 'w*0.44', y: 'h*0.84' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 蓝牙（24×24） */
  {
    name: 'ios7Bluetooth',
    title: '蓝牙',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 24, h: 24 },
    path: [
      [
        { action: 'move', x: 'w*0.45', y: 'h*0.04' },
        { action: 'line', x: 'w*0.45', y: 'h*0.96' },
        { action: 'line', x: 'w*0.55', y: 'h*0.96' },
        { action: 'line', x: 'w*0.55', y: 'h*0.04' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.209583', y: 'h*0.339583' },
        { action: 'line', x: 'w*0.729583', y: 'h*0.739583' },
        { action: 'line', x: 'w*0.790417', y: 'h*0.660417' },
        { action: 'line', x: 'w*0.270417', y: 'h*0.260417' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.270417', y: 'h*0.739583' },
        { action: 'line', x: 'w*0.790417', y: 'h*0.339583' },
        { action: 'line', x: 'w*0.729583', y: 'h*0.260417' },
        { action: 'line', x: 'w*0.209583', y: 'h*0.660417' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 电池（28×14） */
  {
    name: 'ios7Battery',
    title: '电池',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 28, h: 14 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.28' },
        { action: 'quadraticCurve', x1: 0, y1: 'h*0.16', x: 'w*0.06', y: 'h*0.16' },
        { action: 'line', x: 'w*0.82', y: 'h*0.16' },
        { action: 'quadraticCurve', x1: 'w*0.88', y1: 'h*0.16', x: 'w*0.88', y: 'h*0.28' },
        { action: 'line', x: 'w*0.88', y: 'h*0.72' },
        { action: 'quadraticCurve', x1: 'w*0.88', y1: 'h*0.84', x: 'w*0.82', y: 'h*0.84' },
        { action: 'line', x: 'w*0.06', y: 'h*0.84' },
        { action: 'quadraticCurve', x1: 0, y1: 'h*0.84', x: 0, y: 'h*0.72' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.9', y: 'h*0.34' },
        { action: 'line', x: 'w*1', y: 'h*0.34' },
        { action: 'line', x: 'w*1', y: 'h*0.66' },
        { action: 'line', x: 'w*0.9', y: 'h*0.66' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 锁定（26×24） */
  {
    name: 'ios7Lock',
    title: '锁定',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 24 },
    path: [
      [
        { action: 'move', x: 'w*0.3', y: 'h*0.44' },
        { action: 'line', x: 'w*0.306923', y: 'h*0.38375' },
        { action: 'line', x: 'w*0.326923', y: 'h*0.331667' },
        { action: 'line', x: 'w*0.358462', y: 'h*0.286667' },
        { action: 'line', x: 'w*0.4', y: 'h*0.2525' },
        { action: 'line', x: 'w*0.448077', y: 'h*0.230833' },
        { action: 'line', x: 'w*0.5', y: 'h*0.223333' },
        { action: 'line', x: 'w*0.551923', y: 'h*0.230833' },
        { action: 'line', x: 'w*0.6', y: 'h*0.2525' },
        { action: 'line', x: 'w*0.641538', y: 'h*0.286667' },
        { action: 'line', x: 'w*0.673077', y: 'h*0.331667' },
        { action: 'line', x: 'w*0.693077', y: 'h*0.38375' },
        { action: 'line', x: 'w*0.7', y: 'h*0.44' },
        { action: 'line', x: 'w*0.59', y: 'h*0.44' },
        { action: 'line', x: 'w*0.586923', y: 'h*0.414583' },
        { action: 'line', x: 'w*0.578077', y: 'h*0.39125' },
        { action: 'line', x: 'w*0.563462', y: 'h*0.37125' },
        { action: 'line', x: 'w*0.545', y: 'h*0.355417' },
        { action: 'line', x: 'w*0.523462', y: 'h*0.345833' },
        { action: 'line', x: 'w*0.5', y: 'h*0.3425' },
        { action: 'line', x: 'w*0.476538', y: 'h*0.345833' },
        { action: 'line', x: 'w*0.455', y: 'h*0.355417' },
        { action: 'line', x: 'w*0.436538', y: 'h*0.37125' },
        { action: 'line', x: 'w*0.421923', y: 'h*0.39125' },
        { action: 'line', x: 'w*0.413077', y: 'h*0.414583' },
        { action: 'line', x: 'w*0.41', y: 'h*0.44' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.245', y: 'h*0.44' },
        { action: 'line', x: 'w*0.245', y: 'h*0.5' },
        { action: 'line', x: 'w*0.355', y: 'h*0.5' },
        { action: 'line', x: 'w*0.355', y: 'h*0.44' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.645', y: 'h*0.44' },
        { action: 'line', x: 'w*0.645', y: 'h*0.5' },
        { action: 'line', x: 'w*0.755', y: 'h*0.5' },
        { action: 'line', x: 'w*0.755', y: 'h*0.44' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.22', y: 'h*0.546667' },
          { action: 'quadraticCurve', x1: 'w*0.22', y1: 'h*0.46', x: 'w*0.3', y: 'h*0.46' },
          { action: 'line', x: 'w*0.7', y: 'h*0.46' },
          { action: 'quadraticCurve', x1: 'w*0.78', y1: 'h*0.46', x: 'w*0.78', y: 'h*0.546667' },
          { action: 'line', x: 'w*0.78', y: 'h*0.833333' },
          { action: 'quadraticCurve', x1: 'w*0.78', y1: 'h*0.92', x: 'w*0.7', y: 'h*0.92' },
          { action: 'line', x: 'w*0.3', y: 'h*0.92' },
          { action: 'quadraticCurve', x1: 'w*0.22', y1: 'h*0.92', x: 'w*0.22', y: 'h*0.833333' },
          { action: 'close' },
          { action: 'move', x: 'w*0.45', y: 'h*0.614167' },
          {
            action: 'curve',
            x1: 'w*0.45',
            y1: 'h*0.541944',
            x2: 'w*0.55',
            y2: 'h*0.541944',
            x: 'w*0.55',
            y: 'h*0.614167'
          },
          {
            action: 'curve',
            x1: 'w*0.55',
            y1: 'h*0.686389',
            x2: 'w*0.45',
            y2: 'h*0.686389',
            x: 'w*0.45',
            y: 'h*0.614167'
          },
          { action: 'close' },
          { action: 'move', x: 'w*0.475', y: 'h*0.62' },
          { action: 'line', x: 'w*0.525', y: 'h*0.62' },
          { action: 'line', x: 'w*0.525', y: 'h*0.78' },
          { action: 'line', x: 'w*0.475', y: 'h*0.78' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 相机（25×25） */
  {
    name: 'ios7Camera',
    title: '相机',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 25, h: 25 },
    path: [
      [
        { action: 'move', x: 'w*0.32', y: 'h*0.16' },
        { action: 'quadraticCurve', x1: 'w*0.32', y1: 'h*0.12', x: 'w*0.36', y: 'h*0.12' },
        { action: 'line', x: 'w*0.62', y: 'h*0.12' },
        { action: 'quadraticCurve', x1: 'w*0.66', y1: 'h*0.12', x: 'w*0.66', y: 'h*0.16' },
        { action: 'line', x: 'w*0.66', y: 'h*0.2' },
        { action: 'quadraticCurve', x1: 'w*0.66', y1: 'h*0.24', x: 'w*0.62', y: 'h*0.24' },
        { action: 'line', x: 'w*0.36', y: 'h*0.24' },
        { action: 'quadraticCurve', x1: 'w*0.32', y1: 'h*0.24', x: 'w*0.32', y: 'h*0.2' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.04', y: 'h*0.3' },
          { action: 'quadraticCurve', x1: 'w*0.04', y1: 'h*0.22', x: 'w*0.12', y: 'h*0.22' },
          { action: 'line', x: 'w*0.88', y: 'h*0.22' },
          { action: 'quadraticCurve', x1: 'w*0.96', y1: 'h*0.22', x: 'w*0.96', y: 'h*0.3' },
          { action: 'line', x: 'w*0.96', y: 'h*0.78' },
          { action: 'quadraticCurve', x1: 'w*0.96', y1: 'h*0.86', x: 'w*0.88', y: 'h*0.86' },
          { action: 'line', x: 'w*0.12', y: 'h*0.86' },
          { action: 'quadraticCurve', x1: 'w*0.04', y1: 'h*0.86', x: 'w*0.04', y: 'h*0.78' },
          { action: 'close' },
          { action: 'move', x: 'w*0.12', y: 'h*0.36' },
          { action: 'quadraticCurve', x1: 'w*0.12', y1: 'h*0.3', x: 'w*0.186', y: 'h*0.3' },
          { action: 'line', x: 'w*0.814', y: 'h*0.3' },
          { action: 'quadraticCurve', x1: 'w*0.88', y1: 'h*0.3', x: 'w*0.88', y: 'h*0.36' },
          { action: 'line', x: 'w*0.88', y: 'h*0.72' },
          { action: 'quadraticCurve', x1: 'w*0.88', y1: 'h*0.78', x: 'w*0.814', y: 'h*0.78' },
          { action: 'line', x: 'w*0.186', y: 'h*0.78' },
          { action: 'quadraticCurve', x1: 'w*0.12', y1: 'h*0.78', x: 'w*0.12', y: 'h*0.72' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      {
        actions: [
          { action: 'move', x: 'w*0.32', y: 'h*0.54' },
          { action: 'curve', x1: 'w*0.32', y1: 'h*0.3', x2: 'w*0.68', y2: 'h*0.3', x: 'w*0.68', y: 'h*0.54' },
          { action: 'curve', x1: 'w*0.68', y1: 'h*0.78', x2: 'w*0.32', y2: 'h*0.78', x: 'w*0.32', y: 'h*0.54' },
          { action: 'close' },
          { action: 'move', x: 'w*0.4', y: 'h*0.54' },
          {
            action: 'curve',
            x1: 'w*0.4',
            y1: 'h*0.4068',
            x2: 'w*0.6',
            y2: 'h*0.4068',
            x: 'w*0.6',
            y: 'h*0.54'
          },
          {
            action: 'curve',
            x1: 'w*0.6',
            y1: 'h*0.6732',
            x2: 'w*0.4',
            y2: 'h*0.6732',
            x: 'w*0.4',
            y: 'h*0.54'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.43', y: 'h*0.54' },
        {
          action: 'curve',
          x1: 'w*0.43',
          y1: 'h*0.446667',
          x2: 'w*0.57',
          y2: 'h*0.446667',
          x: 'w*0.57',
          y: 'h*0.54'
        },
        {
          action: 'curve',
          x1: 'w*0.57',
          y1: 'h*0.633333',
          x2: 'w*0.43',
          y2: 'h*0.633333',
          x: 'w*0.43',
          y: 'h*0.54'
        },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 声音（24×24） */
  {
    name: 'ios7Sound',
    title: '声音',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 24, h: 24 },
    path: [
      [
        { action: 'move', x: 'w*0.04', y: 'h*0.4' },
        { action: 'line', x: 'w*0.24', y: 'h*0.4' },
        { action: 'line', x: 'w*0.42', y: 'h*0.18' },
        { action: 'line', x: 'w*0.42', y: 'h*0.82' },
        { action: 'line', x: 'w*0.24', y: 'h*0.6' },
        { action: 'line', x: 'w*0.04', y: 'h*0.6' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.31125', y: 'h*0.347083' },
        { action: 'line', x: 'w*0.33375', y: 'h*0.330417' },
        { action: 'line', x: 'w*0.358333', y: 'h*0.3175' },
        { action: 'line', x: 'w*0.384583', y: 'h*0.307917' },
        { action: 'line', x: 'w*0.412083', y: 'h*0.302083' },
        { action: 'line', x: 'w*0.44', y: 'h*0.3' },
        { action: 'line', x: 'w*0.467917', y: 'h*0.302083' },
        { action: 'line', x: 'w*0.495417', y: 'h*0.307917' },
        { action: 'line', x: 'w*0.521667', y: 'h*0.3175' },
        { action: 'line', x: 'w*0.54625', y: 'h*0.330417' },
        { action: 'line', x: 'w*0.56875', y: 'h*0.347083' },
        { action: 'line', x: 'w*0.52375', y: 'h*0.400417' },
        { action: 'line', x: 'w*0.509167', y: 'h*0.39' },
        { action: 'line', x: 'w*0.492917', y: 'h*0.38125' },
        { action: 'line', x: 'w*0.475833', y: 'h*0.375' },
        { action: 'line', x: 'w*0.458333', y: 'h*0.37125' },
        { action: 'line', x: 'w*0.44', y: 'h*0.37' },
        { action: 'line', x: 'w*0.421667', y: 'h*0.37125' },
        { action: 'line', x: 'w*0.404167', y: 'h*0.375' },
        { action: 'line', x: 'w*0.387083', y: 'h*0.38125' },
        { action: 'line', x: 'w*0.370833', y: 'h*0.39' },
        { action: 'line', x: 'w*0.35625', y: 'h*0.400417' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.214583', y: 'h*0.2325' },
        { action: 'line', x: 'w*0.254167', y: 'h*0.203333' },
        { action: 'line', x: 'w*0.297083', y: 'h*0.180417' },
        { action: 'line', x: 'w*0.343333', y: 'h*0.16375' },
        { action: 'line', x: 'w*0.39125', y: 'h*0.153333' },
        { action: 'line', x: 'w*0.44', y: 'h*0.15' },
        { action: 'line', x: 'w*0.48875', y: 'h*0.153333' },
        { action: 'line', x: 'w*0.536667', y: 'h*0.16375' },
        { action: 'line', x: 'w*0.582917', y: 'h*0.180417' },
        { action: 'line', x: 'w*0.625833', y: 'h*0.203333' },
        { action: 'line', x: 'w*0.665417', y: 'h*0.2325' },
        { action: 'line', x: 'w*0.620417', y: 'h*0.285833' },
        { action: 'line', x: 'w*0.58875', y: 'h*0.262917' },
        { action: 'line', x: 'w*0.554167', y: 'h*0.244167' },
        { action: 'line', x: 'w*0.5175', y: 'h*0.230833' },
        { action: 'line', x: 'w*0.479167', y: 'h*0.222917' },
        { action: 'line', x: 'w*0.44', y: 'h*0.22' },
        { action: 'line', x: 'w*0.400833', y: 'h*0.222917' },
        { action: 'line', x: 'w*0.3625', y: 'h*0.230833' },
        { action: 'line', x: 'w*0.325833', y: 'h*0.244167' },
        { action: 'line', x: 'w*0.29125', y: 'h*0.262917' },
        { action: 'line', x: 'w*0.259583', y: 'h*0.285833' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 下载（24×28） */
  {
    name: 'ios7Download',
    title: '下载',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 24, h: 28 },
    path: [
      [
        { action: 'move', x: 'w*0.01', y: 'h*0.52' },
        { action: 'line', x: 'w*0.035', y: 'h*0.997143' },
        { action: 'line', x: 'w*0.965', y: 'h*0.997143' },
        { action: 'line', x: 'w*0.99', y: 'h*0.52' },
        { action: 'line', x: 'w*0.89', y: 'h*0.52' },
        { action: 'line', x: 'w*0.915', y: 'h*0.922857' },
        { action: 'line', x: 'w*0.085', y: 'h*0.922857' },
        { action: 'line', x: 'w*0.11', y: 'h*0.52' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.45', y: 'h*0.1' },
        { action: 'line', x: 'w*0.45', y: 'h*0.7' },
        { action: 'line', x: 'w*0.55', y: 'h*0.7' },
        { action: 'line', x: 'w*0.55', y: 'h*0.1' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.24', y: 'h*0.5' },
        { action: 'line', x: 'w*0.5', y: 'h*0.8' },
        { action: 'line', x: 'w*0.76', y: 'h*0.5' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 视频（29×18） */
  {
    name: 'ios7Video',
    title: '视频',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 29, h: 18 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.04', y: 'h*0.288889' },
          { action: 'quadraticCurve', x1: 'w*0.04', y1: 'h*0.16', x: 'w*0.12', y: 'h*0.16' },
          { action: 'line', x: 'w*0.58', y: 'h*0.16' },
          { action: 'quadraticCurve', x1: 'w*0.66', y1: 'h*0.16', x: 'w*0.66', y: 'h*0.288889' },
          { action: 'line', x: 'w*0.66', y: 'h*0.711111' },
          { action: 'quadraticCurve', x1: 'w*0.66', y1: 'h*0.84', x: 'w*0.58', y: 'h*0.84' },
          { action: 'line', x: 'w*0.12', y: 'h*0.84' },
          { action: 'quadraticCurve', x1: 'w*0.04', y1: 'h*0.84', x: 'w*0.04', y: 'h*0.711111' },
          { action: 'close' },
          { action: 'move', x: 'w*0.12', y: 'h*0.368889' },
          { action: 'quadraticCurve', x1: 'w*0.12', y1: 'h*0.288889', x: 'w*0.17931', y: 'h*0.288889' },
          { action: 'line', x: 'w*0.52069', y: 'h*0.288889' },
          { action: 'quadraticCurve', x1: 'w*0.58', y1: 'h*0.288889', x: 'w*0.58', y: 'h*0.368889' },
          { action: 'line', x: 'w*0.58', y: 'h*0.631111' },
          { action: 'quadraticCurve', x1: 'w*0.58', y1: 'h*0.711111', x: 'w*0.52069', y: 'h*0.711111' },
          { action: 'line', x: 'w*0.17931', y: 'h*0.711111' },
          { action: 'quadraticCurve', x1: 'w*0.12', y1: 'h*0.711111', x: 'w*0.12', y: 'h*0.631111' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.7', y: 'h*0.34' },
        { action: 'line', x: 'w*0.96', y: 'h*0.16' },
        { action: 'line', x: 'w*0.96', y: 'h*0.84' },
        { action: 'line', x: 'w*0.7', y: 'h*0.66' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 列表（24×15） */
  {
    name: 'ios7ListIcon',
    title: '列表',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 24, h: 15 },
    path: [
      [
        { action: 'move', x: 'w*0.28', y: 'h*0.086667' },
        { action: 'line', x: 'w*1', y: 'h*0.086667' },
        { action: 'line', x: 'w*1', y: 'h*0.193333' },
        { action: 'line', x: 'w*0.28', y: 'h*0.193333' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.02', y: 'h*0.14' },
        {
          action: 'curve',
          x1: 'w*0.02',
          y1: 'h*-0.030667',
          x2: 'w*0.18',
          y2: 'h*-0.030667',
          x: 'w*0.18',
          y: 'h*0.14'
        },
        {
          action: 'curve',
          x1: 'w*0.18',
          y1: 'h*0.310667',
          x2: 'w*0.02',
          y2: 'h*0.310667',
          x: 'w*0.02',
          y: 'h*0.14'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.28', y: 'h*0.446667' },
        { action: 'line', x: 'w*1', y: 'h*0.446667' },
        { action: 'line', x: 'w*1', y: 'h*0.553333' },
        { action: 'line', x: 'w*0.28', y: 'h*0.553333' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.02', y: 'h*0.5' },
        {
          action: 'curve',
          x1: 'w*0.02',
          y1: 'h*0.329333',
          x2: 'w*0.18',
          y2: 'h*0.329333',
          x: 'w*0.18',
          y: 'h*0.5'
        },
        {
          action: 'curve',
          x1: 'w*0.18',
          y1: 'h*0.670667',
          x2: 'w*0.02',
          y2: 'h*0.670667',
          x: 'w*0.02',
          y: 'h*0.5'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.28', y: 'h*0.806667' },
        { action: 'line', x: 'w*1', y: 'h*0.806667' },
        { action: 'line', x: 'w*1', y: 'h*0.913333' },
        { action: 'line', x: 'w*0.28', y: 'h*0.913333' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.02', y: 'h*0.86' },
        {
          action: 'curve',
          x1: 'w*0.02',
          y1: 'h*0.689333',
          x2: 'w*0.18',
          y2: 'h*0.689333',
          x: 'w*0.18',
          y: 'h*0.86'
        },
        {
          action: 'curve',
          x1: 'w*0.18',
          y1: 'h*1.030667',
          x2: 'w*0.02',
          y2: 'h*1.030667',
          x: 'w*0.02',
          y: 'h*0.86'
        },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 定位（18×18） */
  {
    name: 'ios7Locate',
    title: '定位',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 18, h: 18 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.98', y: 'h*0.02' },
          { action: 'line', x: 'w*0.06', y: 'h*0.46' },
          { action: 'line', x: 'w*0.44', y: 'h*0.56' },
          { action: 'line', x: 'w*0.54', y: 'h*0.98' },
          { action: 'close' },
          { action: 'move', x: 'w*0.892778', y: 'h*0.107222' },
          { action: 'line', x: 'w*0.139444', y: 'h*0.467222' },
          { action: 'line', x: 'w*0.451111', y: 'h*0.548889' },
          { action: 'line', x: 'w*0.532778', y: 'h*0.892778' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 垃圾箱（24×24） */
  {
    name: 'ios7Trash',
    title: '垃圾箱',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 24, h: 24 },
    path: [
      [
        { action: 'move', x: 'w*0.1', y: 'h*0.22' },
        { action: 'line', x: 'w*0.9', y: 'h*0.22' },
        { action: 'line', x: 'w*0.9', y: 'h*0.14' },
        { action: 'line', x: 'w*0.1', y: 'h*0.14' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.42', y: 'h*0.18' },
        { action: 'line', x: 'w*0.397917', y: 'h*0.095833' },
        { action: 'line', x: 'w*0.602083', y: 'h*0.095833' },
        { action: 'line', x: 'w*0.58', y: 'h*0.18' },
        { action: 'line', x: 'w*0.66', y: 'h*0.18' },
        { action: 'line', x: 'w*0.637917', y: 'h*0.024167' },
        { action: 'line', x: 'w*0.362083', y: 'h*0.024167' },
        { action: 'line', x: 'w*0.34', y: 'h*0.18' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.16', y: 'h*0.22' },
          { action: 'line', x: 'w*0.24', y: 'h*0.96' },
          { action: 'line', x: 'w*0.76', y: 'h*0.96' },
          { action: 'line', x: 'w*0.84', y: 'h*0.22' },
          { action: 'close' },
          { action: 'move', x: 'w*0.24', y: 'h*0.3' },
          { action: 'line', x: 'w*0.30125', y: 'h*0.88' },
          { action: 'line', x: 'w*0.69875', y: 'h*0.88' },
          { action: 'line', x: 'w*0.76', y: 'h*0.3' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.347917', y: 'h*0.36125' },
        { action: 'line', x: 'w*0.367917', y: 'h*0.82125' },
        { action: 'line', x: 'w*0.432083', y: 'h*0.81875' },
        { action: 'line', x: 'w*0.412083', y: 'h*0.35875' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.587917', y: 'h*0.35875' },
        { action: 'line', x: 'w*0.567917', y: 'h*0.81875' },
        { action: 'line', x: 'w*0.632083', y: 'h*0.82125' },
        { action: 'line', x: 'w*0.652083', y: 'h*0.36125' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 帮助（26×26） */
  {
    name: 'ios7Help',
    title: '帮助',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.08', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.08',
            y1: 'h*-0.06',
            x2: 'w*0.92',
            y2: 'h*-0.06',
            x: 'w*0.92',
            y: 'h*0.5'
          },
          { action: 'curve', x1: 'w*0.92', y1: 'h*1.06', x2: 'w*0.08', y2: 'h*1.06', x: 'w*0.08', y: 'h*0.5' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.351923', y: 'h*0.356538' },
        { action: 'line', x: 'w*0.367308', y: 'h*0.31' },
        { action: 'line', x: 'w*0.396923', y: 'h*0.271154' },
        { action: 'line', x: 'w*0.437308', y: 'h*0.243846' },
        { action: 'line', x: 'w*0.484231', y: 'h*0.230769' },
        { action: 'line', x: 'w*0.533077', y: 'h*0.233846' },
        { action: 'line', x: 'w*0.578462', y: 'h*0.251923' },
        { action: 'line', x: 'w*0.615385', y: 'h*0.284231' },
        { action: 'line', x: 'w*0.64', y: 'h*0.326154' },
        { action: 'line', x: 'w*0.65', y: 'h*0.374231' },
        { action: 'line', x: 'w*0.643846', y: 'h*0.422692' },
        { action: 'line', x: 'w*0.622308', y: 'h*0.466538' },
        { action: 'line', x: 'w*0.588077', y: 'h*0.501538' },
        { action: 'line', x: 'w*0.541154', y: 'h*0.436538' },
        { action: 'line', x: 'w*0.557308', y: 'h*0.420385' },
        { action: 'line', x: 'w*0.567308', y: 'h*0.4' },
        { action: 'line', x: 'w*0.57', y: 'h*0.377308' },
        { action: 'line', x: 'w*0.565385', y: 'h*0.355' },
        { action: 'line', x: 'w*0.553846', y: 'h*0.335385' },
        { action: 'line', x: 'w*0.536538', y: 'h*0.320385' },
        { action: 'line', x: 'w*0.515385', y: 'h*0.311538' },
        { action: 'line', x: 'w*0.492692', y: 'h*0.310385' },
        { action: 'line', x: 'w*0.470769', y: 'h*0.316538' },
        { action: 'line', x: 'w*0.451923', y: 'h*0.329231' },
        { action: 'line', x: 'w*0.438077', y: 'h*0.347308' },
        { action: 'line', x: 'w*0.430769', y: 'h*0.369231' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.625', y: 'h*0.408846' },
        { action: 'line', x: 'w*0.468077', y: 'h*0.536154' },
        { action: 'line', x: 'w*0.46', y: 'h*0.64' },
        { action: 'line', x: 'w*0.54', y: 'h*0.64' },
        { action: 'line', x: 'w*0.531923', y: 'h*0.583846' },
        { action: 'line', x: 'w*0.675', y: 'h*0.471154' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.445', y: 'h*0.785' },
        {
          action: 'curve',
          x1: 'w*0.445',
          y1: 'h*0.711667',
          x2: 'w*0.555',
          y2: 'h*0.711667',
          x: 'w*0.555',
          y: 'h*0.785'
        },
        {
          action: 'curve',
          x1: 'w*0.555',
          y1: 'h*0.858333',
          x2: 'w*0.445',
          y2: 'h*0.858333',
          x: 'w*0.445',
          y: 'h*0.785'
        },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 提醒（26×26） */
  {
    name: 'ios7AlertIcon',
    title: '提醒',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 26, h: 26 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.36' },
          { action: 'quadraticCurve', x1: 0, y1: 'h*0.28', x: 'w*0.08', y: 'h*0.28' },
          { action: 'line', x: 'w*0.92', y: 'h*0.28' },
          { action: 'quadraticCurve', x1: 'w*1', y1: 'h*0.28', x: 'w*1', y: 'h*0.36' },
          { action: 'line', x: 'w*1', y: 'h*0.64' },
          { action: 'quadraticCurve', x1: 'w*1', y1: 'h*0.72', x: 'w*0.92', y: 'h*0.72' },
          { action: 'line', x: 'w*0.08', y: 'h*0.72' },
          { action: 'quadraticCurve', x1: 0, y1: 'h*0.72', x: 0, y: 'h*0.64' },
          { action: 'close' },
          { action: 'move', x: 'w*0.08', y: 'h*0.43' },
          { action: 'quadraticCurve', x1: 'w*0.08', y1: 'h*0.38', x: 'w*0.13', y: 'h*0.38' },
          { action: 'line', x: 'w*0.27', y: 'h*0.38' },
          { action: 'quadraticCurve', x1: 'w*0.32', y1: 'h*0.38', x: 'w*0.32', y: 'h*0.43' },
          { action: 'line', x: 'w*0.32', y: 'h*0.57' },
          { action: 'quadraticCurve', x1: 'w*0.32', y1: 'h*0.62', x: 'w*0.27', y: 'h*0.62' },
          { action: 'line', x: 'w*0.13', y: 'h*0.62' },
          { action: 'quadraticCurve', x1: 'w*0.08', y1: 'h*0.62', x: 'w*0.08', y: 'h*0.57' },
          { action: 'close' },
          { action: 'move', x: 'w*0.42', y: 'h*0.4' },
          { action: 'line', x: 'w*0.76', y: 'h*0.4' },
          { action: 'line', x: 'w*0.76', y: 'h*0.47' },
          { action: 'line', x: 'w*0.42', y: 'h*0.47' },
          { action: 'close' },
          { action: 'move', x: 'w*0.42', y: 'h*0.55' },
          { action: 'line', x: 'w*0.64', y: 'h*0.55' },
          { action: 'line', x: 'w*0.64', y: 'h*0.62' },
          { action: 'line', x: 'w*0.42', y: 'h*0.62' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 时钟（24×24） */
  {
    name: 'ios7Clock',
    title: '时钟',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 24, h: 24 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.09', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.09',
            y1: 'h*-0.046667',
            x2: 'w*0.91',
            y2: 'h*-0.046667',
            x: 'w*0.91',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.91',
            y1: 'h*1.046667',
            x2: 'w*0.09',
            y2: 'h*1.046667',
            x: 'w*0.09',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.545', y: 'h*0.5' },
        { action: 'line', x: 'w*0.545', y: 'h*0.26' },
        { action: 'line', x: 'w*0.455', y: 'h*0.26' },
        { action: 'line', x: 'w*0.455', y: 'h*0.5' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.545' },
        { action: 'line', x: 'w*0.72', y: 'h*0.545' },
        { action: 'line', x: 'w*0.72', y: 'h*0.455' },
        { action: 'line', x: 'w*0.5', y: 'h*0.455' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 电话（24×24） */
  {
    name: 'ios7Phone',
    title: '电话',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 24, h: 24 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.14', y: 'h*0.1' },
          { action: 'quadraticCurve', x1: 'w*0.3', y1: 'h*0.06', x: 'w*0.34', y: 'h*0.26' },
          { action: 'quadraticCurve', x1: 'w*0.38', y1: 'h*0.46', x: 'w*0.56', y: 'h*0.62' },
          { action: 'quadraticCurve', x1: 'w*0.74', y1: 'h*0.78', x: 'w*0.9', y: 'h*0.82' },
          { action: 'quadraticCurve', x1: 'w*0.86', y1: 'h*0.96', x: 'w*0.62', y: 'h*0.9' },
          { action: 'quadraticCurve', x1: 'w*0.3', y1: 'h*0.8', x: 'w*0.12', y: 'h*0.42' },
          { action: 'quadraticCurve', x1: 'w*0.04', y1: 'h*0.22', x: 'w*0.14', y: 'h*0.1' },
          { action: 'close' },
          { action: 'move', x: 'w*0.22', y: 'h*0.18875' },
          { action: 'quadraticCurve', x1: 'w*0.344583', y1: 'h*0.157917', x: 'w*0.375417', y: 'h*0.313333' },
          { action: 'quadraticCurve', x1: 'w*0.406667', y1: 'h*0.46875', x: 'w*0.546667', y: 'h*0.593333' },
          { action: 'quadraticCurve', x1: 'w*0.686667', y1: 'h*0.717917', x: 'w*0.81125', y: 'h*0.74875' },
          { action: 'quadraticCurve', x1: 'w*0.78', y1: 'h*0.857917', x: 'w*0.593333', y: 'h*0.81125' },
          { action: 'quadraticCurve', x1: 'w*0.344583', y1: 'h*0.733333', x: 'w*0.204583', y: 'h*0.437917' },
          { action: 'quadraticCurve', x1: 'w*0.142083', y1: 'h*0.282083', x: 'w*0.22', y: 'h*0.18875' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 消息（24×24） */
  {
    name: 'ios7Message',
    title: '消息',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 24, h: 24 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.3', y: 'h*0.94' },
          { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.86', x: 'w*0.02', y: 'h*0.5' },
          { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.06', x: 'w*0.5', y: 'h*0.06' },
          { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.06', x: 'w*0.98', y: 'h*0.5' },
          { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.86', x: 'w*0.52', y: 'h*0.86' },
          { action: 'close' },
          { action: 'move', x: 'w*0.333333', y: 'h*0.85625' },
          { action: 'quadraticCurve', x1: 'w*0.1', y1: 'h*0.790833', x: 'w*0.1', y: 'h*0.49625' },
          { action: 'quadraticCurve', x1: 'w*0.1', y1: 'h*0.13625', x: 'w*0.5', y: 'h*0.13625' },
          { action: 'quadraticCurve', x1: 'w*0.9', y1: 'h*0.13625', x: 'w*0.9', y: 'h*0.49625' },
          { action: 'quadraticCurve', x1: 'w*0.9', y1: 'h*0.790833', x: 'w*0.516667', y: 'h*0.790833' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 邮件（24×24） */
  {
    name: 'ios7Mail',
    title: '邮件',
    category: 'mobile',
    group: 'mobile_ios_icon',
    groupName: 'iOS 图标',
    props: { w: 24, h: 24 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.02', y: 'h*0.22' },
          { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.16', x: 'w*0.08', y: 'h*0.16' },
          { action: 'line', x: 'w*0.92', y: 'h*0.16' },
          { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.16', x: 'w*0.98', y: 'h*0.22' },
          { action: 'line', x: 'w*0.98', y: 'h*0.78' },
          { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.84', x: 'w*0.92', y: 'h*0.84' },
          { action: 'line', x: 'w*0.08', y: 'h*0.84' },
          { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.84', x: 'w*0.02', y: 'h*0.78' },
          { action: 'close' },
          { action: 'move', x: 'w*0.1', y: 'h*0.285833' },
          { action: 'quadraticCurve', x1: 'w*0.1', y1: 'h*0.24', x: 'w*0.15', y: 'h*0.24' },
          { action: 'line', x: 'w*0.85', y: 'h*0.24' },
          { action: 'quadraticCurve', x1: 'w*0.9', y1: 'h*0.24', x: 'w*0.9', y: 'h*0.285833' },
          { action: 'line', x: 'w*0.9', y: 'h*0.714167' },
          { action: 'quadraticCurve', x1: 'w*0.9', y1: 'h*0.76', x: 'w*0.85', y: 'h*0.76' },
          { action: 'line', x: 'w*0.15', y: 'h*0.76' },
          { action: 'quadraticCurve', x1: 'w*0.1', y1: 'h*0.76', x: 'w*0.1', y: 'h*0.714167' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.034583', y: 'h*0.250833' },
        { action: 'line', x: 'w*0.5', y: 'h*0.62' },
        { action: 'line', x: 'w*0.965417', y: 'h*0.250833' },
        { action: 'line', x: 'w*0.914583', y: 'h*0.189167' },
        { action: 'line', x: 'w*0.5', y: 'h*0.54' },
        { action: 'line', x: 'w*0.085417', y: 'h*0.189167' },
        { action: 'close' }
      ]
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  }
]
