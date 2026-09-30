// ═══════════════════════════════════════════
// 旧系统 andriod_icons.js 中尚未移植的 86 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category andriodIcons（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// 旧素材整分类都是「rectangle + PNG 图片填充」，字形由 scripts/lib/android-icon-glyphs.mjs 重画为原生矢量
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const andriodIconsLegacyShapes: ShapeDefinition[] = [
  /** 警告（黑底）（29×29） */
  {
    name: 'andriod_icons_alert1',
    title: '警告（黑底）',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.435', y: 'h*0.285' },
          { action: 'quadraticCurve', x1: 'w*0.435', y1: 'h*0.22', x: 'w*0.5', y: 'h*0.22' },
          { action: 'line', x: 'w*0.5', y: 'h*0.22' },
          { action: 'quadraticCurve', x1: 'w*0.565', y1: 'h*0.22', x: 'w*0.565', y: 'h*0.285' },
          { action: 'line', x: 'w*0.565', y: 'h*0.495' },
          { action: 'quadraticCurve', x1: 'w*0.565', y1: 'h*0.56', x: 'w*0.5', y: 'h*0.56' },
          { action: 'line', x: 'w*0.5', y: 'h*0.56' },
          { action: 'quadraticCurve', x1: 'w*0.435', y1: 'h*0.56', x: 'w*0.435', y: 'h*0.495' },
          { action: 'close' },
          { action: 'move', x: 'w*0.435', y: 'h*0.725' },
          {
            action: 'curve',
            x1: 'w*0.435',
            y1: 'h*0.638333',
            x2: 'w*0.565',
            y2: 'h*0.638333',
            x: 'w*0.565',
            y: 'h*0.725'
          },
          {
            action: 'curve',
            x1: 'w*0.565',
            y1: 'h*0.811667',
            x2: 'w*0.435',
            y2: 'h*0.811667',
            x: 'w*0.435',
            y: 'h*0.725'
          },
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
  /** 警告（红底）（29×29） */
  {
    name: 'andriod_icons_alert2',
    title: '警告（红底）',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.435', y: 'h*0.285' },
          { action: 'quadraticCurve', x1: 'w*0.435', y1: 'h*0.22', x: 'w*0.5', y: 'h*0.22' },
          { action: 'line', x: 'w*0.5', y: 'h*0.22' },
          { action: 'quadraticCurve', x1: 'w*0.565', y1: 'h*0.22', x: 'w*0.565', y: 'h*0.285' },
          { action: 'line', x: 'w*0.565', y: 'h*0.495' },
          { action: 'quadraticCurve', x1: 'w*0.565', y1: 'h*0.56', x: 'w*0.5', y: 'h*0.56' },
          { action: 'line', x: 'w*0.5', y: 'h*0.56' },
          { action: 'quadraticCurve', x1: 'w*0.435', y1: 'h*0.56', x: 'w*0.435', y: 'h*0.495' },
          { action: 'close' },
          { action: 'move', x: 'w*0.435', y: 'h*0.725' },
          {
            action: 'curve',
            x1: 'w*0.435',
            y1: 'h*0.638333',
            x2: 'w*0.565',
            y2: 'h*0.638333',
            x: 'w*0.565',
            y: 'h*0.725'
          },
          {
            action: 'curve',
            x1: 'w*0.565',
            y1: 'h*0.811667',
            x2: 'w*0.435',
            y2: 'h*0.811667',
            x: 'w*0.435',
            y: 'h*0.725'
          },
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
  /** 警告（黄三角）（29×29） */
  {
    name: 'andriod_icons_alert3',
    title: '警告（黄三角）',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.05' },
          { action: 'line', x: 'w*0.99', y: 'h*0.95' },
          { action: 'line', x: 'w*0.01', y: 'h*0.95' },
          { action: 'close' },
          { action: 'move', x: 'w*0.435', y: 'h*0.425' },
          { action: 'quadraticCurve', x1: 'w*0.435', y1: 'h*0.36', x: 'w*0.5', y: 'h*0.36' },
          { action: 'line', x: 'w*0.5', y: 'h*0.36' },
          { action: 'quadraticCurve', x1: 'w*0.565', y1: 'h*0.36', x: 'w*0.565', y: 'h*0.425' },
          { action: 'line', x: 'w*0.565', y: 'h*0.555' },
          { action: 'quadraticCurve', x1: 'w*0.565', y1: 'h*0.62', x: 'w*0.5', y: 'h*0.62' },
          { action: 'line', x: 'w*0.5', y: 'h*0.62' },
          { action: 'quadraticCurve', x1: 'w*0.435', y1: 'h*0.62', x: 'w*0.435', y: 'h*0.555' },
          { action: 'close' },
          { action: 'move', x: 'w*0.435', y: 'h*0.785' },
          {
            action: 'curve',
            x1: 'w*0.435',
            y1: 'h*0.698333',
            x2: 'w*0.565',
            y2: 'h*0.698333',
            x: 'w*0.565',
            y: 'h*0.785'
          },
          {
            action: 'curve',
            x1: 'w*0.565',
            y1: 'h*0.871667',
            x2: 'w*0.435',
            y2: 'h*0.871667',
            x: 'w*0.435',
            y: 'h*0.785'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      }
    ],
    anchors: [],
    textBlock: [],
    lineStyle: { lineWidth: 0, lineColor: '245,176,32' },
    fillStyle: { type: 'solid', color: '245,176,32' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 警告（黑三角）（29×29） */
  {
    name: 'andriod_icons_alert4',
    title: '警告（黑三角）',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.05' },
          { action: 'line', x: 'w*0.99', y: 'h*0.95' },
          { action: 'line', x: 'w*0.01', y: 'h*0.95' },
          { action: 'close' },
          { action: 'move', x: 'w*0.435', y: 'h*0.425' },
          { action: 'quadraticCurve', x1: 'w*0.435', y1: 'h*0.36', x: 'w*0.5', y: 'h*0.36' },
          { action: 'line', x: 'w*0.5', y: 'h*0.36' },
          { action: 'quadraticCurve', x1: 'w*0.565', y1: 'h*0.36', x: 'w*0.565', y: 'h*0.425' },
          { action: 'line', x: 'w*0.565', y: 'h*0.555' },
          { action: 'quadraticCurve', x1: 'w*0.565', y1: 'h*0.62', x: 'w*0.5', y: 'h*0.62' },
          { action: 'line', x: 'w*0.5', y: 'h*0.62' },
          { action: 'quadraticCurve', x1: 'w*0.435', y1: 'h*0.62', x: 'w*0.435', y: 'h*0.555' },
          { action: 'close' },
          { action: 'move', x: 'w*0.435', y: 'h*0.785' },
          {
            action: 'curve',
            x1: 'w*0.435',
            y1: 'h*0.698333',
            x2: 'w*0.565',
            y2: 'h*0.698333',
            x: 'w*0.565',
            y: 'h*0.785'
          },
          {
            action: 'curve',
            x1: 'w*0.565',
            y1: 'h*0.871667',
            x2: 'w*0.435',
            y2: 'h*0.871667',
            x: 'w*0.435',
            y: 'h*0.785'
          },
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
  /** 柱状图（29×29） */
  {
    name: 'andriod_icons_0',
    title: '柱状图',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.14', y: 'h*0.478' },
        { action: 'line', x: 'w*0.35', y: 'h*0.478' },
        { action: 'line', x: 'w*0.35', y: 'h*0.94' },
        { action: 'line', x: 'w*0.14', y: 'h*0.94' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.42', y: 'h*0.1' },
        { action: 'line', x: 'w*0.63', y: 'h*0.1' },
        { action: 'line', x: 'w*0.63', y: 'h*0.94' },
        { action: 'line', x: 'w*0.42', y: 'h*0.94' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.7', y: 'h*0.3352' },
        { action: 'line', x: 'w*0.91', y: 'h*0.3352' },
        { action: 'line', x: 'w*0.91', y: 'h*0.94' },
        { action: 'line', x: 'w*0.7', y: 'h*0.94' },
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
  /** 加号（29×29） */
  {
    name: 'andriod_icons_1',
    title: '加号',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.4', y: 'h*0.06' },
        { action: 'line', x: 'w*0.6', y: 'h*0.06' },
        { action: 'line', x: 'w*0.6', y: 'h*0.4' },
        { action: 'line', x: 'w*0.94', y: 'h*0.4' },
        { action: 'line', x: 'w*0.94', y: 'h*0.6' },
        { action: 'line', x: 'w*0.6', y: 'h*0.6' },
        { action: 'line', x: 'w*0.6', y: 'h*0.94' },
        { action: 'line', x: 'w*0.4', y: 'h*0.94' },
        { action: 'line', x: 'w*0.4', y: 'h*0.6' },
        { action: 'line', x: 'w*0.06', y: 'h*0.6' },
        { action: 'line', x: 'w*0.06', y: 'h*0.4' },
        { action: 'line', x: 'w*0.4', y: 'h*0.4' },
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
  /** 心形（29×29） */
  {
    name: 'andriod_icons_2',
    title: '心形',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.49', y: 'h*0.882' },
        { action: 'quadraticCurve', x1: 'w*-0.0588', y1: 'h*0.49', x: 'w*0.1176', y: 'h*0.196' },
        { action: 'quadraticCurve', x1: 'w*0.294', y1: 0, x: 'w*0.49', y: 'h*0.2744' },
        { action: 'quadraticCurve', x1: 'w*0.686', y1: 0, x: 'w*0.8624', y: 'h*0.196' },
        { action: 'quadraticCurve', x1: 'w*1.0388', y1: 'h*0.49', x: 'w*0.49', y: 'h*0.882' },
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
  /** 安卓机器人（29×29） */
  {
    name: 'andriod_icons_3',
    title: '安卓机器人',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.27775', y: 'h*0.133' },
        { action: 'line', x: 'w*0.37375', y: 'h*0.313' },
        { action: 'line', x: 'w*0.42225', y: 'h*0.287' },
        { action: 'line', x: 'w*0.32625', y: 'h*0.107' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.67375', y: 'h*0.107' },
        { action: 'line', x: 'w*0.57775', y: 'h*0.287' },
        { action: 'line', x: 'w*0.62625', y: 'h*0.313' },
        { action: 'line', x: 'w*0.72225', y: 'h*0.133' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.2', y: 'h*0.5' },
          { action: 'line', x: 'w*0.20575', y: 'h*0.4415' },
          { action: 'line', x: 'w*0.22275', y: 'h*0.38525' },
          { action: 'line', x: 'w*0.2505', y: 'h*0.33325' },
          { action: 'line', x: 'w*0.28775', y: 'h*0.28775' },
          { action: 'line', x: 'w*0.33325', y: 'h*0.2505' },
          { action: 'line', x: 'w*0.38525', y: 'h*0.22275' },
          { action: 'line', x: 'w*0.4415', y: 'h*0.20575' },
          { action: 'line', x: 'w*0.5', y: 'h*0.2' },
          { action: 'line', x: 'w*0.5585', y: 'h*0.20575' },
          { action: 'line', x: 'w*0.61475', y: 'h*0.22275' },
          { action: 'line', x: 'w*0.66675', y: 'h*0.2505' },
          { action: 'line', x: 'w*0.71225', y: 'h*0.28775' },
          { action: 'line', x: 'w*0.7495', y: 'h*0.33325' },
          { action: 'line', x: 'w*0.77725', y: 'h*0.38525' },
          { action: 'line', x: 'w*0.79425', y: 'h*0.4415' },
          { action: 'line', x: 'w*0.8', y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.356', y: 'h*0.35' },
          {
            action: 'curve',
            x1: 'w*0.356',
            y1: 'h*0.31',
            x2: 'w*0.416',
            y2: 'h*0.31',
            x: 'w*0.416',
            y: 'h*0.35'
          },
          {
            action: 'curve',
            x1: 'w*0.416',
            y1: 'h*0.39',
            x2: 'w*0.356',
            y2: 'h*0.39',
            x: 'w*0.356',
            y: 'h*0.35'
          },
          { action: 'close' },
          { action: 'move', x: 'w*0.584', y: 'h*0.35' },
          {
            action: 'curve',
            x1: 'w*0.584',
            y1: 'h*0.31',
            x2: 'w*0.644',
            y2: 'h*0.31',
            x: 'w*0.644',
            y: 'h*0.35'
          },
          {
            action: 'curve',
            x1: 'w*0.644',
            y1: 'h*0.39',
            x2: 'w*0.584',
            y2: 'h*0.39',
            x: 'w*0.584',
            y: 'h*0.35'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.2', y: 'h*0.6' },
        { action: 'quadraticCurve', x1: 'w*0.2', y1: 'h*0.56', x: 'w*0.24', y: 'h*0.56' },
        { action: 'line', x: 'w*0.76', y: 'h*0.56' },
        { action: 'quadraticCurve', x1: 'w*0.8', y1: 'h*0.56', x: 'w*0.8', y: 'h*0.6' },
        { action: 'line', x: 'w*0.8', y: 'h*0.78' },
        { action: 'quadraticCurve', x1: 'w*0.8', y1: 'h*0.82', x: 'w*0.76', y: 'h*0.82' },
        { action: 'line', x: 'w*0.24', y: 'h*0.82' },
        { action: 'quadraticCurve', x1: 'w*0.2', y1: 'h*0.82', x: 'w*0.2', y: 'h*0.78' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.044', y: 'h*0.614' },
        { action: 'quadraticCurve', x1: 'w*0.044', y1: 'h*0.56', x: 'w*0.098', y: 'h*0.56' },
        { action: 'line', x: 'w*0.098', y: 'h*0.56' },
        { action: 'quadraticCurve', x1: 'w*0.152', y1: 'h*0.56', x: 'w*0.152', y: 'h*0.614' },
        { action: 'line', x: 'w*0.152', y: 'h*0.746' },
        { action: 'quadraticCurve', x1: 'w*0.152', y1: 'h*0.8', x: 'w*0.098', y: 'h*0.8' },
        { action: 'line', x: 'w*0.098', y: 'h*0.8' },
        { action: 'quadraticCurve', x1: 'w*0.044', y1: 'h*0.8', x: 'w*0.044', y: 'h*0.746' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.848', y: 'h*0.614' },
        { action: 'quadraticCurve', x1: 'w*0.848', y1: 'h*0.56', x: 'w*0.902', y: 'h*0.56' },
        { action: 'line', x: 'w*0.902', y: 'h*0.56' },
        { action: 'quadraticCurve', x1: 'w*0.956', y1: 'h*0.56', x: 'w*0.956', y: 'h*0.614' },
        { action: 'line', x: 'w*0.956', y: 'h*0.746' },
        { action: 'quadraticCurve', x1: 'w*0.956', y1: 'h*0.8', x: 'w*0.902', y: 'h*0.8' },
        { action: 'line', x: 'w*0.902', y: 'h*0.8' },
        { action: 'quadraticCurve', x1: 'w*0.848', y1: 'h*0.8', x: 'w*0.848', y: 'h*0.746' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.302', y: 'h*0.83' },
        { action: 'quadraticCurve', x1: 'w*0.302', y1: 'h*0.8', x: 'w*0.332', y: 'h*0.8' },
        { action: 'line', x: 'w*0.38', y: 'h*0.8' },
        { action: 'quadraticCurve', x1: 'w*0.41', y1: 'h*0.8', x: 'w*0.41', y: 'h*0.83' },
        { action: 'line', x: 'w*0.41', y: 'h*0.95' },
        { action: 'quadraticCurve', x1: 'w*0.41', y1: 'h*0.98', x: 'w*0.38', y: 'h*0.98' },
        { action: 'line', x: 'w*0.332', y: 'h*0.98' },
        { action: 'quadraticCurve', x1: 'w*0.302', y1: 'h*0.98', x: 'w*0.302', y: 'h*0.95' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.59', y: 'h*0.83' },
        { action: 'quadraticCurve', x1: 'w*0.59', y1: 'h*0.8', x: 'w*0.62', y: 'h*0.8' },
        { action: 'line', x: 'w*0.668', y: 'h*0.8' },
        { action: 'quadraticCurve', x1: 'w*0.698', y1: 'h*0.8', x: 'w*0.698', y: 'h*0.83' },
        { action: 'line', x: 'w*0.698', y: 'h*0.95' },
        { action: 'quadraticCurve', x1: 'w*0.698', y1: 'h*0.98', x: 'w*0.668', y: 'h*0.98' },
        { action: 'line', x: 'w*0.62', y: 'h*0.98' },
        { action: 'quadraticCurve', x1: 'w*0.59', y1: 'h*0.98', x: 'w*0.59', y: 'h*0.95' },
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
  /** 铃铛（29×29） */
  {
    name: 'andriod_icons_4',
    title: '铃铛',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.44', y: 'h*0.08' },
        { action: 'curve', x1: 'w*0.44', y1: 'h*0', x2: 'w*0.56', y2: 'h*0', x: 'w*0.56', y: 'h*0.08' },
        { action: 'curve', x1: 'w*0.56', y1: 'h*0.16', x2: 'w*0.44', y2: 'h*0.16', x: 'w*0.44', y: 'h*0.08' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.16', y: 'h*0.82' },
        { action: 'quadraticCurve', x1: 'w*0.2', y1: 'h*0.34', x: 'w*0.5', y: 'h*0.12' },
        { action: 'quadraticCurve', x1: 'w*0.8', y1: 'h*0.34', x: 'w*0.84', y: 'h*0.82' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.08', y: 'h*0.8' },
        { action: 'line', x: 'w*0.92', y: 'h*0.8' },
        { action: 'line', x: 'w*0.92', y: 'h*0.9' },
        { action: 'line', x: 'w*0.08', y: 'h*0.9' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.4', y: 'h*1' },
        { action: 'curve', x1: 'w*0.4', y1: 'h*0.866667', x2: 'w*0.6', y2: 'h*0.866667', x: 'w*0.6', y: 'h*1' },
        { action: 'curve', x1: 'w*0.6', y1: 'h*1.133333', x2: 'w*0.4', y2: 'h*1.133333', x: 'w*0.4', y: 'h*1' },
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
  /** 回形针（29×29） */
  {
    name: 'andriod_icons_5',
    title: '回形针',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.50475', y: 'h*0.1575' },
        { action: 'line', x: 'w*0.211', y: 'h*0.562' },
        { action: 'line', x: 'w*0.208', y: 'h*0.56675' },
        { action: 'line', x: 'w*0.183', y: 'h*0.617' },
        { action: 'line', x: 'w*0.17325', y: 'h*0.678' },
        { action: 'line', x: 'w*0.183', y: 'h*0.739' },
        { action: 'line', x: 'w*0.211', y: 'h*0.794' },
        { action: 'line', x: 'w*0.2545', y: 'h*0.83775' },
        { action: 'line', x: 'w*0.30975', y: 'h*0.86575' },
        { action: 'line', x: 'w*0.37075', y: 'h*0.8755' },
        { action: 'line', x: 'w*0.43175', y: 'h*0.86575' },
        { action: 'line', x: 'w*0.48675', y: 'h*0.83775' },
        { action: 'line', x: 'w*0.53025', y: 'h*0.7945' },
        { action: 'line', x: 'w*0.82425', y: 'h*0.3895' },
        { action: 'line', x: 'w*0.76375', y: 'h*0.3455' },
        { action: 'line', x: 'w*0.47', y: 'h*0.7495' },
        { action: 'line', x: 'w*0.44275', y: 'h*0.777' },
        { action: 'line', x: 'w*0.4085', y: 'h*0.7945' },
        { action: 'line', x: 'w*0.37075', y: 'h*0.8005' },
        { action: 'line', x: 'w*0.33275', y: 'h*0.7945' },
        { action: 'line', x: 'w*0.29875', y: 'h*0.777' },
        { action: 'line', x: 'w*0.27175', y: 'h*0.75' },
        { action: 'line', x: 'w*0.25425', y: 'h*0.71575' },
        { action: 'line', x: 'w*0.24825', y: 'h*0.678' },
        { action: 'line', x: 'w*0.25425', y: 'h*0.64' },
        { action: 'line', x: 'w*0.2745', y: 'h*0.601' },
        { action: 'line', x: 'w*0.2715', y: 'h*0.606' },
        { action: 'line', x: 'w*0.5655', y: 'h*0.2015' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.348', y: 'h*0.63675' },
        { action: 'line', x: 'w*0.548', y: 'h*0.36175' },
        { action: 'line', x: 'w*0.54375', y: 'h*0.36675' },
        { action: 'line', x: 'w*0.5635', y: 'h*0.3465' },
        { action: 'line', x: 'w*0.582', y: 'h*0.33875' },
        { action: 'line', x: 'w*0.59925', y: 'h*0.33825' },
        { action: 'line', x: 'w*0.61325', y: 'h*0.34425' },
        { action: 'line', x: 'w*0.62325', y: 'h*0.3555' },
        { action: 'line', x: 'w*0.628', y: 'h*0.37225' },
        { action: 'line', x: 'w*0.62625', y: 'h*0.392' },
        { action: 'line', x: 'w*0.6165', y: 'h*0.412' },
        { action: 'line', x: 'w*0.41675', y: 'h*0.68675' },
        { action: 'line', x: 'w*0.4775', y: 'h*0.73075' },
        { action: 'line', x: 'w*0.67775', y: 'h*0.4555' },
        { action: 'line', x: 'w*0.6985', y: 'h*0.4125' },
        { action: 'line', x: 'w*0.70275', y: 'h*0.36475' },
        { action: 'line', x: 'w*0.68875', y: 'h*0.31925' },
        { action: 'line', x: 'w*0.65725', y: 'h*0.2835' },
        { action: 'line', x: 'w*0.6135', y: 'h*0.2645' },
        { action: 'line', x: 'w*0.566', y: 'h*0.2655' },
        { action: 'line', x: 'w*0.522', y: 'h*0.28425' },
        { action: 'line', x: 'w*0.4915', y: 'h*0.31275' },
        { action: 'line', x: 'w*0.48725', y: 'h*0.31775' },
        { action: 'line', x: 'w*0.2875', y: 'h*0.59275' },
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
  /** 二维码（29×29） */
  {
    name: 'andriod_icons_6',
    title: '二维码',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.061538', y: 'h*0.123077' },
          { action: 'quadraticCurve', x1: 'w*0.061538', y1: 'h*0.061538', x: 'w*0.123077', y: 'h*0.061538' },
          { action: 'line', x: 'w*0.384615', y: 'h*0.061538' },
          { action: 'quadraticCurve', x1: 'w*0.446154', y1: 'h*0.061538', x: 'w*0.446154', y: 'h*0.123077' },
          { action: 'line', x: 'w*0.446154', y: 'h*0.384615' },
          { action: 'quadraticCurve', x1: 'w*0.446154', y1: 'h*0.446154', x: 'w*0.384615', y: 'h*0.446154' },
          { action: 'line', x: 'w*0.123077', y: 'h*0.446154' },
          { action: 'quadraticCurve', x1: 'w*0.061538', y1: 'h*0.446154', x: 'w*0.061538', y: 'h*0.384615' },
          { action: 'close' },
          { action: 'move', x: 'w*0.14625', y: 'h*0.1805' },
          { action: 'quadraticCurve', x1: 'w*0.14625', y1: 'h*0.14625', x: 'w*0.1805', y: 'h*0.14625' },
          { action: 'line', x: 'w*0.327', y: 'h*0.14625' },
          { action: 'quadraticCurve', x1: 'w*0.3615', y1: 'h*0.14625', x: 'w*0.3615', y: 'h*0.1805' },
          { action: 'line', x: 'w*0.3615', y: 'h*0.327' },
          { action: 'quadraticCurve', x1: 'w*0.3615', y1: 'h*0.3615', x: 'w*0.327', y: 'h*0.3615' },
          { action: 'line', x: 'w*0.1805', y: 'h*0.3615' },
          { action: 'quadraticCurve', x1: 'w*0.14625', y1: 'h*0.3615', x: 'w*0.14625', y: 'h*0.327' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.184615', y: 'h*0.184615' },
        { action: 'line', x: 'w*0.323077', y: 'h*0.184615' },
        { action: 'line', x: 'w*0.323077', y: 'h*0.323077' },
        { action: 'line', x: 'w*0.184615', y: 'h*0.323077' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.553846', y: 'h*0.123077' },
          { action: 'quadraticCurve', x1: 'w*0.553846', y1: 'h*0.061538', x: 'w*0.615385', y: 'h*0.061538' },
          { action: 'line', x: 'w*0.876923', y: 'h*0.061538' },
          { action: 'quadraticCurve', x1: 'w*0.938462', y1: 'h*0.061538', x: 'w*0.938462', y: 'h*0.123077' },
          { action: 'line', x: 'w*0.938462', y: 'h*0.384615' },
          { action: 'quadraticCurve', x1: 'w*0.938462', y1: 'h*0.446154', x: 'w*0.876923', y: 'h*0.446154' },
          { action: 'line', x: 'w*0.615385', y: 'h*0.446154' },
          { action: 'quadraticCurve', x1: 'w*0.553846', y1: 'h*0.446154', x: 'w*0.553846', y: 'h*0.384615' },
          { action: 'close' },
          { action: 'move', x: 'w*0.6385', y: 'h*0.1805' },
          { action: 'quadraticCurve', x1: 'w*0.6385', y1: 'h*0.14625', x: 'w*0.673', y: 'h*0.14625' },
          { action: 'line', x: 'w*0.8195', y: 'h*0.14625' },
          { action: 'quadraticCurve', x1: 'w*0.85375', y1: 'h*0.14625', x: 'w*0.85375', y: 'h*0.1805' },
          { action: 'line', x: 'w*0.85375', y: 'h*0.327' },
          { action: 'quadraticCurve', x1: 'w*0.85375', y1: 'h*0.3615', x: 'w*0.8195', y: 'h*0.3615' },
          { action: 'line', x: 'w*0.673', y: 'h*0.3615' },
          { action: 'quadraticCurve', x1: 'w*0.6385', y1: 'h*0.3615', x: 'w*0.6385', y: 'h*0.327' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.676923', y: 'h*0.184615' },
        { action: 'line', x: 'w*0.815385', y: 'h*0.184615' },
        { action: 'line', x: 'w*0.815385', y: 'h*0.323077' },
        { action: 'line', x: 'w*0.676923', y: 'h*0.323077' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.061538', y: 'h*0.615385' },
          { action: 'quadraticCurve', x1: 'w*0.061538', y1: 'h*0.553846', x: 'w*0.123077', y: 'h*0.553846' },
          { action: 'line', x: 'w*0.384615', y: 'h*0.553846' },
          { action: 'quadraticCurve', x1: 'w*0.446154', y1: 'h*0.553846', x: 'w*0.446154', y: 'h*0.615385' },
          { action: 'line', x: 'w*0.446154', y: 'h*0.876923' },
          { action: 'quadraticCurve', x1: 'w*0.446154', y1: 'h*0.938462', x: 'w*0.384615', y: 'h*0.938462' },
          { action: 'line', x: 'w*0.123077', y: 'h*0.938462' },
          { action: 'quadraticCurve', x1: 'w*0.061538', y1: 'h*0.938462', x: 'w*0.061538', y: 'h*0.876923' },
          { action: 'close' },
          { action: 'move', x: 'w*0.14625', y: 'h*0.673' },
          { action: 'quadraticCurve', x1: 'w*0.14625', y1: 'h*0.6385', x: 'w*0.1805', y: 'h*0.6385' },
          { action: 'line', x: 'w*0.327', y: 'h*0.6385' },
          { action: 'quadraticCurve', x1: 'w*0.3615', y1: 'h*0.6385', x: 'w*0.3615', y: 'h*0.673' },
          { action: 'line', x: 'w*0.3615', y: 'h*0.8195' },
          { action: 'quadraticCurve', x1: 'w*0.3615', y1: 'h*0.85375', x: 'w*0.327', y: 'h*0.85375' },
          { action: 'line', x: 'w*0.1805', y: 'h*0.85375' },
          { action: 'quadraticCurve', x1: 'w*0.14625', y1: 'h*0.85375', x: 'w*0.14625', y: 'h*0.8195' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.184615', y: 'h*0.676923' },
        { action: 'line', x: 'w*0.323077', y: 'h*0.676923' },
        { action: 'line', x: 'w*0.323077', y: 'h*0.815385' },
        { action: 'line', x: 'w*0.184615', y: 'h*0.815385' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.553846', y: 'h*0.553846' },
        { action: 'line', x: 'w*0.630769', y: 'h*0.553846' },
        { action: 'line', x: 'w*0.630769', y: 'h*0.630769' },
        { action: 'line', x: 'w*0.553846', y: 'h*0.630769' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.707692', y: 'h*0.553846' },
        { action: 'line', x: 'w*0.784615', y: 'h*0.553846' },
        { action: 'line', x: 'w*0.784615', y: 'h*0.630769' },
        { action: 'line', x: 'w*0.707692', y: 'h*0.630769' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.784615', y: 'h*0.553846' },
        { action: 'line', x: 'w*0.861538', y: 'h*0.553846' },
        { action: 'line', x: 'w*0.861538', y: 'h*0.630769' },
        { action: 'line', x: 'w*0.784615', y: 'h*0.630769' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.938462', y: 'h*0.553846' },
        { action: 'line', x: 'w*1.015385', y: 'h*0.553846' },
        { action: 'line', x: 'w*1.015385', y: 'h*0.630769' },
        { action: 'line', x: 'w*0.938462', y: 'h*0.630769' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.630769', y: 'h*0.630769' },
        { action: 'line', x: 'w*0.707692', y: 'h*0.630769' },
        { action: 'line', x: 'w*0.707692', y: 'h*0.707692' },
        { action: 'line', x: 'w*0.630769', y: 'h*0.707692' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.707692', y: 'h*0.630769' },
        { action: 'line', x: 'w*0.784615', y: 'h*0.630769' },
        { action: 'line', x: 'w*0.784615', y: 'h*0.707692' },
        { action: 'line', x: 'w*0.707692', y: 'h*0.707692' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.861538', y: 'h*0.630769' },
        { action: 'line', x: 'w*0.938462', y: 'h*0.630769' },
        { action: 'line', x: 'w*0.938462', y: 'h*0.707692' },
        { action: 'line', x: 'w*0.861538', y: 'h*0.707692' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.553846', y: 'h*0.707692' },
        { action: 'line', x: 'w*0.630769', y: 'h*0.707692' },
        { action: 'line', x: 'w*0.630769', y: 'h*0.784615' },
        { action: 'line', x: 'w*0.553846', y: 'h*0.784615' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.630769', y: 'h*0.707692' },
        { action: 'line', x: 'w*0.707692', y: 'h*0.707692' },
        { action: 'line', x: 'w*0.707692', y: 'h*0.784615' },
        { action: 'line', x: 'w*0.630769', y: 'h*0.784615' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.784615', y: 'h*0.707692' },
        { action: 'line', x: 'w*0.861538', y: 'h*0.707692' },
        { action: 'line', x: 'w*0.861538', y: 'h*0.784615' },
        { action: 'line', x: 'w*0.784615', y: 'h*0.784615' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.938462', y: 'h*0.707692' },
        { action: 'line', x: 'w*1.015385', y: 'h*0.707692' },
        { action: 'line', x: 'w*1.015385', y: 'h*0.784615' },
        { action: 'line', x: 'w*0.938462', y: 'h*0.784615' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.707692', y: 'h*0.784615' },
        { action: 'line', x: 'w*0.784615', y: 'h*0.784615' },
        { action: 'line', x: 'w*0.784615', y: 'h*0.861538' },
        { action: 'line', x: 'w*0.707692', y: 'h*0.861538' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.861538', y: 'h*0.784615' },
        { action: 'line', x: 'w*0.938462', y: 'h*0.784615' },
        { action: 'line', x: 'w*0.938462', y: 'h*0.861538' },
        { action: 'line', x: 'w*0.861538', y: 'h*0.861538' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.938462', y: 'h*0.784615' },
        { action: 'line', x: 'w*1.015385', y: 'h*0.784615' },
        { action: 'line', x: 'w*1.015385', y: 'h*0.861538' },
        { action: 'line', x: 'w*0.938462', y: 'h*0.861538' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.553846', y: 'h*0.861538' },
        { action: 'line', x: 'w*0.630769', y: 'h*0.861538' },
        { action: 'line', x: 'w*0.630769', y: 'h*0.938462' },
        { action: 'line', x: 'w*0.553846', y: 'h*0.938462' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.707692', y: 'h*0.861538' },
        { action: 'line', x: 'w*0.784615', y: 'h*0.861538' },
        { action: 'line', x: 'w*0.784615', y: 'h*0.938462' },
        { action: 'line', x: 'w*0.707692', y: 'h*0.938462' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.784615', y: 'h*0.861538' },
        { action: 'line', x: 'w*0.861538', y: 'h*0.861538' },
        { action: 'line', x: 'w*0.861538', y: 'h*0.938462' },
        { action: 'line', x: 'w*0.784615', y: 'h*0.938462' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.861538', y: 'h*0.861538' },
        { action: 'line', x: 'w*0.938462', y: 'h*0.861538' },
        { action: 'line', x: 'w*0.938462', y: 'h*0.938462' },
        { action: 'line', x: 'w*0.861538', y: 'h*0.938462' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.630769', y: 'h*0.938462' },
        { action: 'line', x: 'w*0.707692', y: 'h*0.938462' },
        { action: 'line', x: 'w*0.707692', y: 'h*1.015385' },
        { action: 'line', x: 'w*0.630769', y: 'h*1.015385' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.861538', y: 'h*0.938462' },
        { action: 'line', x: 'w*0.938462', y: 'h*0.938462' },
        { action: 'line', x: 'w*0.938462', y: 'h*1.015385' },
        { action: 'line', x: 'w*0.861538', y: 'h*1.015385' },
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
  /** 信号强度（29×29） */
  {
    name: 'andriod_icons_7',
    title: '信号强度',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.1', y: 'h*0.7048' },
        { action: 'line', x: 'w*0.25', y: 'h*0.7048' },
        { action: 'line', x: 'w*0.25', y: 'h*0.94' },
        { action: 'line', x: 'w*0.1', y: 'h*0.94' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.32', y: 'h*0.5032' },
        { action: 'line', x: 'w*0.47', y: 'h*0.5032' },
        { action: 'line', x: 'w*0.47', y: 'h*0.94' },
        { action: 'line', x: 'w*0.32', y: 'h*0.94' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.54', y: 'h*0.3016' },
        { action: 'line', x: 'w*0.69', y: 'h*0.3016' },
        { action: 'line', x: 'w*0.69', y: 'h*0.94' },
        { action: 'line', x: 'w*0.54', y: 'h*0.94' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.76', y: 'h*0.1' },
        { action: 'line', x: 'w*0.91', y: 'h*0.1' },
        { action: 'line', x: 'w*0.91', y: 'h*0.94' },
        { action: 'line', x: 'w*0.76', y: 'h*0.94' },
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
  /** 蓝牙（29×29） */
  {
    name: 'andriod_icons_8',
    title: '蓝牙',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.2', y: 'h*0.32' },
          { action: 'quadraticCurve', x1: 'w*0.2', y1: 'h*0.02', x: 'w*0.5', y: 'h*0.02' },
          { action: 'line', x: 'w*0.5', y: 'h*0.02' },
          { action: 'quadraticCurve', x1: 'w*0.8', y1: 'h*0.02', x: 'w*0.8', y: 'h*0.32' },
          { action: 'line', x: 'w*0.8', y: 'h*0.68' },
          { action: 'quadraticCurve', x1: 'w*0.8', y1: 'h*0.98', x: 'w*0.5', y: 'h*0.98' },
          { action: 'line', x: 'w*0.5', y: 'h*0.98' },
          { action: 'quadraticCurve', x1: 'w*0.2', y1: 'h*0.98', x: 'w*0.2', y: 'h*0.68' },
          { action: 'close' },
          { action: 'move', x: 'w*0.27', y: 'h*0.34625' },
          { action: 'quadraticCurve', x1: 'w*0.27', y1: 'h*0.09', x: 'w*0.5', y: 'h*0.09' },
          { action: 'line', x: 'w*0.5', y: 'h*0.09' },
          { action: 'quadraticCurve', x1: 'w*0.73', y1: 'h*0.09', x: 'w*0.73', y: 'h*0.34625' },
          { action: 'line', x: 'w*0.73', y: 'h*0.65375' },
          { action: 'quadraticCurve', x1: 'w*0.73', y1: 'h*0.91', x: 'w*0.5', y: 'h*0.91' },
          { action: 'line', x: 'w*0.5', y: 'h*0.91' },
          { action: 'quadraticCurve', x1: 'w*0.27', y1: 'h*0.91', x: 'w*0.27', y: 'h*0.65375' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.4615', y: 'h*0.12' },
        { action: 'line', x: 'w*0.4615', y: 'h*0.88' },
        { action: 'line', x: 'w*0.5385', y: 'h*0.88' },
        { action: 'line', x: 'w*0.5385', y: 'h*0.12' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.474', y: 'h*0.1485' },
        { action: 'line', x: 'w*0.68425', y: 'h*0.3055' },
        { action: 'line', x: 'w*0.2565', y: 'h*0.6295' },
        { action: 'line', x: 'w*0.3035', y: 'h*0.6905' },
        { action: 'line', x: 'w*0.75575', y: 'h*0.3345' },
        { action: 'line', x: 'w*0.526', y: 'h*0.0915' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.526', y: 'h*0.9085' },
        { action: 'line', x: 'w*0.75575', y: 'h*0.6655' },
        { action: 'line', x: 'w*0.3035', y: 'h*0.3095' },
        { action: 'line', x: 'w*0.2565', y: 'h*0.3705' },
        { action: 'line', x: 'w*0.68425', y: 'h*0.6945' },
        { action: 'line', x: 'w*0.474', y: 'h*0.8515' },
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
  /** 书本（29×29） */
  {
    name: 'andriod_icons_9',
    title: '书本',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.16' },
          { action: 'line', x: 'w*0.1', y: 'h*0.1' },
          { action: 'line', x: 'w*0.06', y: 'h*0.82' },
          { action: 'line', x: 'w*0.5', y: 'h*0.88' },
          { action: 'close' },
          { action: 'move', x: 'w*0.44', y: 'h*0.21375' },
          { action: 'line', x: 'w*0.149', y: 'h*0.16325' },
          { action: 'line', x: 'w*0.12', y: 'h*0.7695' },
          { action: 'line', x: 'w*0.44', y: 'h*0.82' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.16' },
          { action: 'line', x: 'w*0.9', y: 'h*0.1' },
          { action: 'line', x: 'w*0.94', y: 'h*0.82' },
          { action: 'line', x: 'w*0.5', y: 'h*0.88' },
          { action: 'close' },
          { action: 'move', x: 'w*0.56', y: 'h*0.21375' },
          { action: 'line', x: 'w*0.851', y: 'h*0.16325' },
          { action: 'line', x: 'w*0.88', y: 'h*0.7695' },
          { action: 'line', x: 'w*0.56', y: 'h*0.82' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.461', y: 'h*0.16' },
        { action: 'line', x: 'w*0.461', y: 'h*0.88' },
        { action: 'line', x: 'w*0.539', y: 'h*0.88' },
        { action: 'line', x: 'w*0.539', y: 'h*0.16' },
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
  /** 书签（29×29） */
  {
    name: 'andriod_icons_10',
    title: '书签',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.26', y: 'h*0.04' },
        { action: 'line', x: 'w*0.74', y: 'h*0.04' },
        { action: 'line', x: 'w*0.74', y: 'h*0.96' },
        { action: 'line', x: 'w*0.5', y: 'h*0.72' },
        { action: 'line', x: 'w*0.26', y: 'h*0.96' },
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
  /** 相机（29×29） */
  {
    name: 'andriod_icons_11',
    title: '相机',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.02', y: 'h*0.3' },
          { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.22', x: 'w*0.1', y: 'h*0.22' },
          { action: 'line', x: 'w*0.9', y: 'h*0.22' },
          { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.22', x: 'w*0.98', y: 'h*0.3' },
          { action: 'line', x: 'w*0.98', y: 'h*0.76' },
          { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.84', x: 'w*0.9', y: 'h*0.84' },
          { action: 'line', x: 'w*0.1', y: 'h*0.84' },
          { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.84', x: 'w*0.02', y: 'h*0.76' },
          { action: 'close' },
          { action: 'move', x: 'w*0.3', y: 'h*0.15' },
          { action: 'quadraticCurve', x1: 'w*0.3', y1: 'h*0.1', x: 'w*0.35', y: 'h*0.1' },
          { action: 'line', x: 'w*0.55', y: 'h*0.1' },
          { action: 'quadraticCurve', x1: 'w*0.6', y1: 'h*0.1', x: 'w*0.6', y: 'h*0.15' },
          { action: 'line', x: 'w*0.6', y: 'h*0.21' },
          { action: 'quadraticCurve', x1: 'w*0.6', y1: 'h*0.26', x: 'w*0.55', y: 'h*0.26' },
          { action: 'line', x: 'w*0.35', y: 'h*0.26' },
          { action: 'quadraticCurve', x1: 'w*0.3', y1: 'h*0.26', x: 'w*0.3', y: 'h*0.21' },
          { action: 'close' },
          { action: 'move', x: 'w*0.31', y: 'h*0.54' },
          {
            action: 'curve',
            x1: 'w*0.31',
            y1: 'h*0.286667',
            x2: 'w*0.69',
            y2: 'h*0.286667',
            x: 'w*0.69',
            y: 'h*0.54'
          },
          {
            action: 'curve',
            x1: 'w*0.69',
            y1: 'h*0.793333',
            x2: 'w*0.31',
            y2: 'h*0.793333',
            x: 'w*0.31',
            y: 'h*0.54'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.4', y: 'h*0.54' },
        {
          action: 'curve',
          x1: 'w*0.4',
          y1: 'h*0.406667',
          x2: 'w*0.6',
          y2: 'h*0.406667',
          x: 'w*0.6',
          y: 'h*0.54'
        },
        {
          action: 'curve',
          x1: 'w*0.6',
          y1: 'h*0.673333',
          x2: 'w*0.4',
          y2: 'h*0.673333',
          x: 'w*0.4',
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
  /** 公文包（29×29） */
  {
    name: 'andriod_icons_12',
    title: '公文包',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.395', y: 'h*0.26' },
        { action: 'line', x: 'w*0.37375', y: 'h*0.17225' },
        { action: 'line', x: 'w*0.62625', y: 'h*0.17225' },
        { action: 'line', x: 'w*0.605', y: 'h*0.26' },
        { action: 'line', x: 'w*0.675', y: 'h*0.26' },
        { action: 'line', x: 'w*0.65375', y: 'h*0.10775' },
        { action: 'line', x: 'w*0.34625', y: 'h*0.10775' },
        { action: 'line', x: 'w*0.325', y: 'h*0.26' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.04', y: 'h*0.42' },
        { action: 'line', x: 'w*0.96', y: 'h*0.42' },
        { action: 'line', x: 'w*0.96', y: 'h*0.48' },
        { action: 'line', x: 'w*0.04', y: 'h*0.48' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.04', y: 'h*0.3' },
          { action: 'quadraticCurve', x1: 'w*0.04', y1: 'h*0.24', x: 'w*0.1', y: 'h*0.24' },
          { action: 'line', x: 'w*0.9', y: 'h*0.24' },
          { action: 'quadraticCurve', x1: 'w*0.96', y1: 'h*0.24', x: 'w*0.96', y: 'h*0.3' },
          { action: 'line', x: 'w*0.96', y: 'h*0.8' },
          { action: 'quadraticCurve', x1: 'w*0.96', y1: 'h*0.86', x: 'w*0.9', y: 'h*0.86' },
          { action: 'line', x: 'w*0.1', y: 'h*0.86' },
          { action: 'quadraticCurve', x1: 'w*0.04', y1: 'h*0.86', x: 'w*0.04', y: 'h*0.8' },
          { action: 'close' },
          { action: 'move', x: 'w*0.44', y: 'h*0.48' },
          { action: 'line', x: 'w*0.56', y: 'h*0.48' },
          { action: 'line', x: 'w*0.56', y: 'h*0.64' },
          { action: 'line', x: 'w*0.44', y: 'h*0.64' },
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
  /** 日历（29×29） */
  {
    name: 'andriod_icons_13',
    title: '日历',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.06', y: 'h*0.2' },
          { action: 'quadraticCurve', x1: 'w*0.06', y1: 'h*0.14', x: 'w*0.12', y: 'h*0.14' },
          { action: 'line', x: 'w*0.88', y: 'h*0.14' },
          { action: 'quadraticCurve', x1: 'w*0.94', y1: 'h*0.14', x: 'w*0.94', y: 'h*0.2' },
          { action: 'line', x: 'w*0.94', y: 'h*0.86' },
          { action: 'quadraticCurve', x1: 'w*0.94', y1: 'h*0.92', x: 'w*0.88', y: 'h*0.92' },
          { action: 'line', x: 'w*0.12', y: 'h*0.92' },
          { action: 'quadraticCurve', x1: 'w*0.06', y1: 'h*0.92', x: 'w*0.06', y: 'h*0.86' },
          { action: 'close' },
          { action: 'move', x: 'w*0.13', y: 'h*0.25925' },
          { action: 'quadraticCurve', x1: 'w*0.13', y1: 'h*0.21', x: 'w*0.1805', y: 'h*0.21' },
          { action: 'line', x: 'w*0.8195', y: 'h*0.21' },
          { action: 'quadraticCurve', x1: 'w*0.87', y1: 'h*0.21', x: 'w*0.87', y: 'h*0.25925' },
          { action: 'line', x: 'w*0.87', y: 'h*0.80075' },
          { action: 'quadraticCurve', x1: 'w*0.87', y1: 'h*0.85', x: 'w*0.8195', y: 'h*0.85' },
          { action: 'line', x: 'w*0.1805', y: 'h*0.85' },
          { action: 'quadraticCurve', x1: 'w*0.13', y1: 'h*0.85', x: 'w*0.13', y: 'h*0.80075' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.06', y: 'h*0.14' },
        { action: 'line', x: 'w*0.94', y: 'h*0.14' },
        { action: 'line', x: 'w*0.94', y: 'h*0.32' },
        { action: 'line', x: 'w*0.06', y: 'h*0.32' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.2415', y: 'h*0.06' },
        { action: 'line', x: 'w*0.2415', y: 'h*0.2' },
        { action: 'line', x: 'w*0.3185', y: 'h*0.2' },
        { action: 'line', x: 'w*0.3185', y: 'h*0.06' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.6815', y: 'h*0.06' },
        { action: 'line', x: 'w*0.6815', y: 'h*0.2' },
        { action: 'line', x: 'w*0.7585', y: 'h*0.2' },
        { action: 'line', x: 'w*0.7585', y: 'h*0.06' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.18', y: 'h*0.42' },
        { action: 'line', x: 'w*0.29', y: 'h*0.42' },
        { action: 'line', x: 'w*0.29', y: 'h*0.51' },
        { action: 'line', x: 'w*0.18', y: 'h*0.51' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.39', y: 'h*0.42' },
        { action: 'line', x: 'w*0.5', y: 'h*0.42' },
        { action: 'line', x: 'w*0.5', y: 'h*0.51' },
        { action: 'line', x: 'w*0.39', y: 'h*0.51' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.6', y: 'h*0.42' },
        { action: 'line', x: 'w*0.71', y: 'h*0.42' },
        { action: 'line', x: 'w*0.71', y: 'h*0.51' },
        { action: 'line', x: 'w*0.6', y: 'h*0.51' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.81', y: 'h*0.42' },
        { action: 'line', x: 'w*0.92', y: 'h*0.42' },
        { action: 'line', x: 'w*0.92', y: 'h*0.51' },
        { action: 'line', x: 'w*0.81', y: 'h*0.51' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.18', y: 'h*0.59' },
        { action: 'line', x: 'w*0.29', y: 'h*0.59' },
        { action: 'line', x: 'w*0.29', y: 'h*0.68' },
        { action: 'line', x: 'w*0.18', y: 'h*0.68' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.39', y: 'h*0.59' },
        { action: 'line', x: 'w*0.5', y: 'h*0.59' },
        { action: 'line', x: 'w*0.5', y: 'h*0.68' },
        { action: 'line', x: 'w*0.39', y: 'h*0.68' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.6', y: 'h*0.59' },
        { action: 'line', x: 'w*0.71', y: 'h*0.59' },
        { action: 'line', x: 'w*0.71', y: 'h*0.68' },
        { action: 'line', x: 'w*0.6', y: 'h*0.68' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.81', y: 'h*0.59' },
        { action: 'line', x: 'w*0.92', y: 'h*0.59' },
        { action: 'line', x: 'w*0.92', y: 'h*0.68' },
        { action: 'line', x: 'w*0.81', y: 'h*0.68' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.18', y: 'h*0.76' },
        { action: 'line', x: 'w*0.29', y: 'h*0.76' },
        { action: 'line', x: 'w*0.29', y: 'h*0.85' },
        { action: 'line', x: 'w*0.18', y: 'h*0.85' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.39', y: 'h*0.76' },
        { action: 'line', x: 'w*0.5', y: 'h*0.76' },
        { action: 'line', x: 'w*0.5', y: 'h*0.85' },
        { action: 'line', x: 'w*0.39', y: 'h*0.85' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.6', y: 'h*0.76' },
        { action: 'line', x: 'w*0.71', y: 'h*0.76' },
        { action: 'line', x: 'w*0.71', y: 'h*0.85' },
        { action: 'line', x: 'w*0.6', y: 'h*0.85' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.81', y: 'h*0.76' },
        { action: 'line', x: 'w*0.92', y: 'h*0.76' },
        { action: 'line', x: 'w*0.92', y: 'h*0.85' },
        { action: 'line', x: 'w*0.81', y: 'h*0.85' },
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
  /** 叉号（29×29） */
  {
    name: 'andriod_icons_14',
    title: '叉号',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.737', y: 'h*0.12875' },
        { action: 'line', x: 'w*0.87125', y: 'h*0.263' },
        { action: 'line', x: 'w*0.63425', y: 'h*0.5' },
        { action: 'line', x: 'w*0.87125', y: 'h*0.737' },
        { action: 'line', x: 'w*0.737', y: 'h*0.87125' },
        { action: 'line', x: 'w*0.5', y: 'h*0.63425' },
        { action: 'line', x: 'w*0.263', y: 'h*0.87125' },
        { action: 'line', x: 'w*0.12875', y: 'h*0.737' },
        { action: 'line', x: 'w*0.36575', y: 'h*0.5' },
        { action: 'line', x: 'w*0.12875', y: 'h*0.263' },
        { action: 'line', x: 'w*0.263', y: 'h*0.12875' },
        { action: 'line', x: 'w*0.5', y: 'h*0.36575' },
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
  /** 购物车（29×29） */
  {
    name: 'andriod_icons_15',
    title: '购物车',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.02025', y: 'h*0.15475' },
        { action: 'line', x: 'w*0.148', y: 'h*0.224' },
        { action: 'line', x: 'w*0.243', y: 'h*0.4555' },
        { action: 'line', x: 'w*0.317', y: 'h*0.4245' },
        { action: 'line', x: 'w*0.212', y: 'h*0.176' },
        { action: 'line', x: 'w*0.05975', y: 'h*0.08525' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.24', y: 'h*0.36' },
        { action: 'line', x: 'w*0.96', y: 'h*0.36' },
        { action: 'line', x: 'w*0.84', y: 'h*0.68' },
        { action: 'line', x: 'w*0.32', y: 'h*0.68' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.34', y: 'h*0.84' },
        {
          action: 'curve',
          x1: 'w*0.34',
          y1: 'h*0.733333',
          x2: 'w*0.5',
          y2: 'h*0.733333',
          x: 'w*0.5',
          y: 'h*0.84'
        },
        {
          action: 'curve',
          x1: 'w*0.5',
          y1: 'h*0.946667',
          x2: 'w*0.34',
          y2: 'h*0.946667',
          x: 'w*0.34',
          y: 'h*0.84'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.7', y: 'h*0.84' },
        {
          action: 'curve',
          x1: 'w*0.7',
          y1: 'h*0.733333',
          x2: 'w*0.86',
          y2: 'h*0.733333',
          x: 'w*0.86',
          y: 'h*0.84'
        },
        {
          action: 'curve',
          x1: 'w*0.86',
          y1: 'h*0.946667',
          x2: 'w*0.7',
          y2: 'h*0.946667',
          x: 'w*0.7',
          y: 'h*0.84'
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
  /** 时钟（29×29） */
  {
    name: 'andriod_icons_16',
    title: '时钟',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
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
            y1: 'h*-0.04675',
            x2: 'w*0.91',
            y2: 'h*-0.04675',
            x: 'w*0.91',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.91',
            y1: 'h*1.04675',
            x2: 'w*0.09',
            y2: 'h*1.04675',
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
  /** 文档（29×29） */
  {
    name: 'andriod_icons_17',
    title: '文档',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.42', y: 'h*0.095' },
        { action: 'line', x: 'w*0.8325', y: 'h*0.0815' },
        { action: 'line', x: 'w*0.825', y: 'h*0.62' },
        { action: 'line', x: 'w*0.895', y: 'h*0.62' },
        { action: 'line', x: 'w*0.8875', y: 'h*0.0385' },
        { action: 'line', x: 'w*0.42', y: 'h*0.025' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.12', y: 'h*0.26' },
          { action: 'quadraticCurve', x1: 'w*0.12', y1: 'h*0.22', x: 'w*0.16', y: 'h*0.22' },
          { action: 'line', x: 'w*0.7', y: 'h*0.22' },
          { action: 'quadraticCurve', x1: 'w*0.74', y1: 'h*0.22', x: 'w*0.74', y: 'h*0.26' },
          { action: 'line', x: 'w*0.74', y: 'h*0.9' },
          { action: 'quadraticCurve', x1: 'w*0.74', y1: 'h*0.94', x: 'w*0.7', y: 'h*0.94' },
          { action: 'line', x: 'w*0.16', y: 'h*0.94' },
          { action: 'quadraticCurve', x1: 'w*0.12', y1: 'h*0.94', x: 'w*0.12', y: 'h*0.9' },
          { action: 'close' },
          { action: 'move', x: 'w*0.19', y: 'h*0.32225' },
          { action: 'quadraticCurve', x1: 'w*0.19', y1: 'h*0.29', x: 'w*0.221', y: 'h*0.29' },
          { action: 'line', x: 'w*0.639', y: 'h*0.29' },
          { action: 'quadraticCurve', x1: 'w*0.67', y1: 'h*0.29', x: 'w*0.67', y: 'h*0.32225' },
          { action: 'line', x: 'w*0.67', y: 'h*0.83775' },
          { action: 'quadraticCurve', x1: 'w*0.67', y1: 'h*0.87', x: 'w*0.639', y: 'h*0.87' },
          { action: 'line', x: 'w*0.221', y: 'h*0.87' },
          { action: 'quadraticCurve', x1: 'w*0.19', y1: 'h*0.87', x: 'w*0.19', y: 'h*0.83775' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.24', y: 'h*0.38' },
        { action: 'line', x: 'w*0.62', y: 'h*0.38' },
        { action: 'line', x: 'w*0.62', y: 'h*0.436' },
        { action: 'line', x: 'w*0.24', y: 'h*0.436' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.24', y: 'h*0.54' },
        { action: 'line', x: 'w*0.62', y: 'h*0.54' },
        { action: 'line', x: 'w*0.62', y: 'h*0.596' },
        { action: 'line', x: 'w*0.24', y: 'h*0.596' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.24', y: 'h*0.7' },
        { action: 'line', x: 'w*0.46', y: 'h*0.7' },
        { action: 'line', x: 'w*0.46', y: 'h*0.756' },
        { action: 'line', x: 'w*0.24', y: 'h*0.756' },
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
  /** 云（29×29） */
  {
    name: 'andriod_icons_18',
    title: '云',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.05', y: 'h*0.595' },
        {
          action: 'curve',
          x1: 'w*0.05',
          y1: 'h*0.335',
          x2: 'w*0.47',
          y2: 'h*0.335',
          x: 'w*0.47',
          y: 'h*0.595'
        },
        {
          action: 'curve',
          x1: 'w*0.47',
          y1: 'h*0.855',
          x2: 'w*0.05',
          y2: 'h*0.855',
          x: 'w*0.05',
          y: 'h*0.595'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.24', y: 'h*0.35' },
        {
          action: 'curve',
          x1: 'w*0.24',
          y1: 'h*0.016667',
          x2: 'w*0.72',
          y2: 'h*0.016667',
          x: 'w*0.72',
          y: 'h*0.35'
        },
        {
          action: 'curve',
          x1: 'w*0.72',
          y1: 'h*0.683333',
          x2: 'w*0.24',
          y2: 'h*0.683333',
          x: 'w*0.24',
          y: 'h*0.35'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.46', y: 'h*0.555' },
        {
          action: 'curve',
          x1: 'w*0.46',
          y1: 'h*0.241667',
          x2: 'w*0.95',
          y2: 'h*0.241667',
          x: 'w*0.95',
          y: 'h*0.555'
        },
        {
          action: 'curve',
          x1: 'w*0.95',
          y1: 'h*0.868333',
          x2: 'w*0.46',
          y2: 'h*0.868333',
          x: 'w*0.46',
          y: 'h*0.555'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.05', y: 'h*0.58' },
        { action: 'line', x: 'w*0.95', y: 'h*0.58' },
        { action: 'line', x: 'w*0.95', y: 'h*0.78' },
        { action: 'line', x: 'w*0.05', y: 'h*0.78' },
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
  /** 下载（29×29） */
  {
    name: 'andriod_icons_19',
    title: '下载',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.45', y: 'h*0.08' },
        { action: 'line', x: 'w*0.45', y: 'h*0.64' },
        { action: 'line', x: 'w*0.55', y: 'h*0.64' },
        { action: 'line', x: 'w*0.55', y: 'h*0.08' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.24', y: 'h*0.44' },
        { action: 'line', x: 'w*0.5', y: 'h*0.76' },
        { action: 'line', x: 'w*0.76', y: 'h*0.44' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.08', y: 'h*0.86' },
        { action: 'line', x: 'w*0.92', y: 'h*0.86' },
        { action: 'line', x: 'w*0.92', y: 'h*0.96' },
        { action: 'line', x: 'w*0.08', y: 'h*0.96' },
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
  /** 退出登录（29×29） */
  {
    name: 'andriod_icons_20',
    title: '退出登录',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.44', y: 'h*0.03' },
        { action: 'line', x: 'w*0.034', y: 'h*0.06025' },
        { action: 'line', x: 'w*0.034', y: 'h*0.93975' },
        { action: 'line', x: 'w*0.44', y: 'h*0.97' },
        { action: 'line', x: 'w*0.44', y: 'h*0.87' },
        { action: 'line', x: 'w*0.126', y: 'h*0.90025' },
        { action: 'line', x: 'w*0.126', y: 'h*0.09975' },
        { action: 'line', x: 'w*0.44', y: 'h*0.13' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.34', y: 'h*0.55' },
        { action: 'line', x: 'w*0.84', y: 'h*0.55' },
        { action: 'line', x: 'w*0.84', y: 'h*0.45' },
        { action: 'line', x: 'w*0.34', y: 'h*0.45' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.66', y: 'h*0.28' },
        { action: 'line', x: 'w*0.96', y: 'h*0.5' },
        { action: 'line', x: 'w*0.66', y: 'h*0.72' },
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
  /** 脸书（29×29） */
  {
    name: 'andriod_icons_21',
    title: '脸书',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.04', y: 'h*0.12' },
          { action: 'quadraticCurve', x1: 'w*0.04', y1: 'h*0.04', x: 'w*0.12', y: 'h*0.04' },
          { action: 'line', x: 'w*0.88', y: 'h*0.04' },
          { action: 'quadraticCurve', x1: 'w*0.96', y1: 'h*0.04', x: 'w*0.96', y: 'h*0.12' },
          { action: 'line', x: 'w*0.96', y: 'h*0.88' },
          { action: 'quadraticCurve', x1: 'w*0.96', y1: 'h*0.96', x: 'w*0.88', y: 'h*0.96' },
          { action: 'line', x: 'w*0.12', y: 'h*0.96' },
          { action: 'quadraticCurve', x1: 'w*0.04', y1: 'h*0.96', x: 'w*0.04', y: 'h*0.88' },
          { action: 'close' },
          { action: 'move', x: 'w*0.12', y: 'h*0.186' },
          { action: 'quadraticCurve', x1: 'w*0.12', y1: 'h*0.12', x: 'w*0.186', y: 'h*0.12' },
          { action: 'line', x: 'w*0.814', y: 'h*0.12' },
          { action: 'quadraticCurve', x1: 'w*0.88', y1: 'h*0.12', x: 'w*0.88', y: 'h*0.186' },
          { action: 'line', x: 'w*0.88', y: 'h*0.814' },
          { action: 'quadraticCurve', x1: 'w*0.88', y1: 'h*0.88', x: 'w*0.814', y: 'h*0.88' },
          { action: 'line', x: 'w*0.186', y: 'h*0.88' },
          { action: 'quadraticCurve', x1: 'w*0.12', y1: 'h*0.88', x: 'w*0.12', y: 'h*0.814' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.68', y: 'h*0.152' },
        { action: 'line', x: 'w*0.4145', y: 'h*0.18475' },
        { action: 'line', x: 'w*0.412', y: 'h*0.86' },
        { action: 'line', x: 'w*0.508', y: 'h*0.86' },
        { action: 'line', x: 'w*0.5055', y: 'h*0.21525' },
        { action: 'line', x: 'w*0.68', y: 'h*0.248' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.3', y: 'h*0.48' },
        { action: 'line', x: 'w*0.64', y: 'h*0.48' },
        { action: 'line', x: 'w*0.64', y: 'h*0.4' },
        { action: 'line', x: 'w*0.3', y: 'h*0.4' },
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
  /** RSS 订阅（29×29） */
  {
    name: 'andriod_icons_22',
    title: 'RSS 订阅',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.04', y: 'h*0.1' },
          { action: 'quadraticCurve', x1: 'w*0.04', y1: 'h*0.04', x: 'w*0.1', y: 'h*0.04' },
          { action: 'line', x: 'w*0.9', y: 'h*0.04' },
          { action: 'quadraticCurve', x1: 'w*0.96', y1: 'h*0.04', x: 'w*0.96', y: 'h*0.1' },
          { action: 'line', x: 'w*0.96', y: 'h*0.9' },
          { action: 'quadraticCurve', x1: 'w*0.96', y1: 'h*0.96', x: 'w*0.9', y: 'h*0.96' },
          { action: 'line', x: 'w*0.1', y: 'h*0.96' },
          { action: 'quadraticCurve', x1: 'w*0.04', y1: 'h*0.96', x: 'w*0.04', y: 'h*0.9' },
          { action: 'close' },
          { action: 'move', x: 'w*0.13', y: 'h*0.17825' },
          { action: 'quadraticCurve', x1: 'w*0.13', y1: 'h*0.13', x: 'w*0.17825', y: 'h*0.13' },
          { action: 'line', x: 'w*0.82175', y: 'h*0.13' },
          { action: 'quadraticCurve', x1: 'w*0.87', y1: 'h*0.13', x: 'w*0.87', y: 'h*0.17825' },
          { action: 'line', x: 'w*0.87', y: 'h*0.82175' },
          { action: 'quadraticCurve', x1: 'w*0.87', y1: 'h*0.87', x: 'w*0.82175', y: 'h*0.87' },
          { action: 'line', x: 'w*0.17825', y: 'h*0.87' },
          { action: 'quadraticCurve', x1: 'w*0.13', y1: 'h*0.87', x: 'w*0.13', y: 'h*0.82175' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.16', y: 'h*0.77' },
        {
          action: 'curve',
          x1: 'w*0.16',
          y1: 'h*0.676667',
          x2: 'w*0.3',
          y2: 'h*0.676667',
          x: 'w*0.3',
          y: 'h*0.77'
        },
        {
          action: 'curve',
          x1: 'w*0.3',
          y1: 'h*0.863333',
          x2: 'w*0.16',
          y2: 'h*0.863333',
          x: 'w*0.16',
          y: 'h*0.77'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.2', y: 'h*0.52' },
        { action: 'line', x: 'w*0.25325', y: 'h*0.52425' },
        { action: 'line', x: 'w*0.305', y: 'h*0.53675' },
        { action: 'line', x: 'w*0.35425', y: 'h*0.557' },
        { action: 'line', x: 'w*0.39975', y: 'h*0.585' },
        { action: 'line', x: 'w*0.4405', y: 'h*0.6195' },
        { action: 'line', x: 'w*0.475', y: 'h*0.66025' },
        { action: 'line', x: 'w*0.503', y: 'h*0.70575' },
        { action: 'line', x: 'w*0.52325', y: 'h*0.755' },
        { action: 'line', x: 'w*0.53575', y: 'h*0.80675' },
        { action: 'line', x: 'w*0.54', y: 'h*0.86' },
        { action: 'line', x: 'w*0.45', y: 'h*0.86' },
        { action: 'line', x: 'w*0.447', y: 'h*0.821' },
        { action: 'line', x: 'w*0.43775', y: 'h*0.78275' },
        { action: 'line', x: 'w*0.42275', y: 'h*0.7465' },
        { action: 'line', x: 'w*0.40225', y: 'h*0.713' },
        { action: 'line', x: 'w*0.37675', y: 'h*0.68325' },
        { action: 'line', x: 'w*0.347', y: 'h*0.65775' },
        { action: 'line', x: 'w*0.3135', y: 'h*0.63725' },
        { action: 'line', x: 'w*0.27725', y: 'h*0.62225' },
        { action: 'line', x: 'w*0.239', y: 'h*0.613' },
        { action: 'line', x: 'w*0.2', y: 'h*0.61' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.2', y: 'h*0.26' },
        { action: 'line', x: 'w*0.26725', y: 'h*0.26375' },
        { action: 'line', x: 'w*0.3335', y: 'h*0.275' },
        { action: 'line', x: 'w*0.39825', y: 'h*0.29375' },
        { action: 'line', x: 'w*0.46025', y: 'h*0.3195' },
        { action: 'line', x: 'w*0.51925', y: 'h*0.352' },
        { action: 'line', x: 'w*0.574', y: 'h*0.391' },
        { action: 'line', x: 'w*0.62425', y: 'h*0.43575' },
        { action: 'line', x: 'w*0.669', y: 'h*0.486' },
        { action: 'line', x: 'w*0.708', y: 'h*0.54075' },
        { action: 'line', x: 'w*0.7405', y: 'h*0.59975' },
        { action: 'line', x: 'w*0.76625', y: 'h*0.66175' },
        { action: 'line', x: 'w*0.785', y: 'h*0.7265' },
        { action: 'line', x: 'w*0.79625', y: 'h*0.79275' },
        { action: 'line', x: 'w*0.8', y: 'h*0.86' },
        { action: 'line', x: 'w*0.71', y: 'h*0.86' },
        { action: 'line', x: 'w*0.70675', y: 'h*0.803' },
        { action: 'line', x: 'w*0.69725', y: 'h*0.7465' },
        { action: 'line', x: 'w*0.6815', y: 'h*0.6915' },
        { action: 'line', x: 'w*0.6595', y: 'h*0.63875' },
        { action: 'line', x: 'w*0.63175', y: 'h*0.58875' },
        { action: 'line', x: 'w*0.59875', y: 'h*0.542' },
        { action: 'line', x: 'w*0.5605', y: 'h*0.4995' },
        { action: 'line', x: 'w*0.518', y: 'h*0.46125' },
        { action: 'line', x: 'w*0.47125', y: 'h*0.42825' },
        { action: 'line', x: 'w*0.42125', y: 'h*0.4005' },
        { action: 'line', x: 'w*0.3685', y: 'h*0.3785' },
        { action: 'line', x: 'w*0.3135', y: 'h*0.36275' },
        { action: 'line', x: 'w*0.257', y: 'h*0.35325' },
        { action: 'line', x: 'w*0.2', y: 'h*0.35' },
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
  /** 旗帜（29×29） */
  {
    name: 'andriod_icons_23',
    title: '旗帜',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.115', y: 'h*0.04' },
        { action: 'line', x: 'w*0.115', y: 'h*0.96' },
        { action: 'line', x: 'w*0.205', y: 'h*0.96' },
        { action: 'line', x: 'w*0.205', y: 'h*0.04' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.22', y: 'h*0.1' },
        { action: 'line', x: 'w*0.9', y: 'h*0.16' },
        { action: 'line', x: 'w*0.72', y: 'h*0.34' },
        { action: 'line', x: 'w*0.9', y: 'h*0.52' },
        { action: 'line', x: 'w*0.22', y: 'h*0.46' },
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
  /** 文件夹（29×29） */
  {
    name: 'andriod_icons_24',
    title: '文件夹',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.04', y: 'h*0.22' },
        { action: 'line', x: 'w*0.36', y: 'h*0.22' },
        { action: 'line', x: 'w*0.46', y: 'h*0.34' },
        { action: 'line', x: 'w*0.96', y: 'h*0.34' },
        { action: 'line', x: 'w*0.96', y: 'h*0.84' },
        { action: 'line', x: 'w*0.04', y: 'h*0.84' },
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
  /** 打开文件夹（29×29） */
  {
    name: 'andriod_icons_25',
    title: '打开文件夹',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.04', y: 'h*0.2' },
        { action: 'line', x: 'w*0.36', y: 'h*0.2' },
        { action: 'line', x: 'w*0.46', y: 'h*0.32' },
        { action: 'line', x: 'w*0.96', y: 'h*0.32' },
        { action: 'line', x: 'w*0.96', y: 'h*0.48' },
        { action: 'line', x: 'w*0.04', y: 'h*0.48' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.04', y: 'h*0.42' },
          { action: 'line', x: 'w*0.3', y: 'h*0.42' },
          { action: 'line', x: 'w*0.42', y: 'h*0.56' },
          { action: 'line', x: 'w*0.98', y: 'h*0.56' },
          { action: 'line', x: 'w*0.84', y: 'h*0.9' },
          { action: 'line', x: 'w*0.02', y: 'h*0.9' },
          { action: 'close' },
          { action: 'move', x: 'w*0.107', y: 'h*0.49' },
          { action: 'line', x: 'w*0.32925', y: 'h*0.49' },
          { action: 'line', x: 'w*0.43175', y: 'h*0.58925' },
          { action: 'line', x: 'w*0.91', y: 'h*0.58925' },
          { action: 'line', x: 'w*0.7905', y: 'h*0.83' },
          { action: 'line', x: 'w*0.09', y: 'h*0.83' },
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
  /** 字号（Aa）（29×29） */
  {
    name: 'andriod_icons_26',
    title: '字号（Aa）',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.273', y: 'h*0.06325' },
        { action: 'line', x: 'w*-0.027', y: 'h*0.90325' },
        { action: 'line', x: 'w*0.067', y: 'h*0.93675' },
        { action: 'line', x: 'w*0.367', y: 'h*0.09675' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.273', y: 'h*0.09675' },
        { action: 'line', x: 'w*0.573', y: 'h*0.93675' },
        { action: 'line', x: 'w*0.667', y: 'h*0.90325' },
        { action: 'line', x: 'w*0.367', y: 'h*0.06325' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.14', y: 'h*0.5504' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5504' },
        { action: 'line', x: 'w*0.5', y: 'h*0.6304' },
        { action: 'line', x: 'w*0.14', y: 'h*0.6304' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.762', y: 'h*0.34775' },
        { action: 'line', x: 'w*0.582', y: 'h*0.90775' },
        { action: 'line', x: 'w*0.658', y: 'h*0.93225' },
        { action: 'line', x: 'w*0.838', y: 'h*0.37225' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.762', y: 'h*0.37225' },
        { action: 'line', x: 'w*0.942', y: 'h*0.93225' },
        { action: 'line', x: 'w*1.018', y: 'h*0.90775' },
        { action: 'line', x: 'w*0.838', y: 'h*0.34775' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.692', y: 'h*0.6736' },
        { action: 'line', x: 'w*0.908', y: 'h*0.6736' },
        { action: 'line', x: 'w*0.908', y: 'h*0.7376' },
        { action: 'line', x: 'w*0.692', y: 'h*0.7376' },
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
  /** 设置（齿轮）（29×29） */
  {
    name: 'andriod_icons_27',
    title: '设置（齿轮）',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.94725', y: 'h*0.3925' },
          { action: 'line', x: 'w*0.94725', y: 'h*0.6075' },
          { action: 'line', x: 'w*0.8215', y: 'h*0.5745' },
          { action: 'line', x: 'w*0.78', y: 'h*0.67475' },
          { action: 'line', x: 'w*0.89225', y: 'h*0.74025' },
          { action: 'line', x: 'w*0.74025', y: 'h*0.89225' },
          { action: 'line', x: 'w*0.67475', y: 'h*0.78' },
          { action: 'line', x: 'w*0.5745', y: 'h*0.8215' },
          { action: 'line', x: 'w*0.6075', y: 'h*0.94725' },
          { action: 'line', x: 'w*0.3925', y: 'h*0.94725' },
          { action: 'line', x: 'w*0.4255', y: 'h*0.8215' },
          { action: 'line', x: 'w*0.32525', y: 'h*0.78' },
          { action: 'line', x: 'w*0.25975', y: 'h*0.89225' },
          { action: 'line', x: 'w*0.10775', y: 'h*0.74025' },
          { action: 'line', x: 'w*0.22', y: 'h*0.67475' },
          { action: 'line', x: 'w*0.1785', y: 'h*0.5745' },
          { action: 'line', x: 'w*0.05275', y: 'h*0.6075' },
          { action: 'line', x: 'w*0.05275', y: 'h*0.3925' },
          { action: 'line', x: 'w*0.1785', y: 'h*0.4255' },
          { action: 'line', x: 'w*0.22', y: 'h*0.32525' },
          { action: 'line', x: 'w*0.10775', y: 'h*0.25975' },
          { action: 'line', x: 'w*0.25975', y: 'h*0.10775' },
          { action: 'line', x: 'w*0.32525', y: 'h*0.22' },
          { action: 'line', x: 'w*0.4255', y: 'h*0.1785' },
          { action: 'line', x: 'w*0.3925', y: 'h*0.05275' },
          { action: 'line', x: 'w*0.6075', y: 'h*0.05275' },
          { action: 'line', x: 'w*0.5745', y: 'h*0.1785' },
          { action: 'line', x: 'w*0.67475', y: 'h*0.22' },
          { action: 'line', x: 'w*0.74025', y: 'h*0.10775' },
          { action: 'line', x: 'w*0.89225', y: 'h*0.25975' },
          { action: 'line', x: 'w*0.78', y: 'h*0.32525' },
          { action: 'line', x: 'w*0.8215', y: 'h*0.4255' },
          { action: 'close' },
          { action: 'move', x: 'w*0.35', y: 'h*0.5' },
          { action: 'curve', x1: 'w*0.35', y1: 'h*0.3', x2: 'w*0.65', y2: 'h*0.3', x: 'w*0.65', y: 'h*0.5' },
          { action: 'curve', x1: 'w*0.65', y1: 'h*0.7', x2: 'w*0.35', y2: 'h*0.7', x: 'w*0.35', y: 'h*0.5' },
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
  /** 批量完成（29×29） */
  {
    name: 'andriod_icons_28',
    title: '批量完成',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.05225', y: 'h*0.544' },
        { action: 'line', x: 'w*0.36375', y: 'h*0.8205' },
        { action: 'line', x: 'w*0.90775', y: 'h*0.24425' },
        { action: 'line', x: 'w*0.81225', y: 'h*0.15575' },
        { action: 'line', x: 'w*0.31625', y: 'h*0.6995' },
        { action: 'line', x: 'w*0.14775', y: 'h*0.456' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.252', y: 'h*0.70375' },
        { action: 'line', x: 'w*0.527', y: 'h*0.93925' },
        { action: 'line', x: 'w*1.00875', y: 'h*0.403' },
        { action: 'line', x: 'w*0.91125', y: 'h*0.317' },
        { action: 'line', x: 'w*0.473', y: 'h*0.82075' },
        { action: 'line', x: 'w*0.348', y: 'h*0.61625' },
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
  /** 下划线（29×29） */
  {
    name: 'andriod_icons_29',
    title: '下划线',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.2', y: 'h*0.06' },
        { action: 'line', x: 'w*0.2', y: 'h*0.56' },
        { action: 'line', x: 'w*0.20075', y: 'h*0.5695' },
        { action: 'line', x: 'w*0.21475', y: 'h*0.65275' },
        { action: 'line', x: 'w*0.25725', y: 'h*0.73625' },
        { action: 'line', x: 'w*0.32375', y: 'h*0.80275' },
        { action: 'line', x: 'w*0.40725', y: 'h*0.84525' },
        { action: 'line', x: 'w*0.5', y: 'h*0.86' },
        { action: 'line', x: 'w*0.59275', y: 'h*0.84525' },
        { action: 'line', x: 'w*0.67625', y: 'h*0.80275' },
        { action: 'line', x: 'w*0.74275', y: 'h*0.73625' },
        { action: 'line', x: 'w*0.78525', y: 'h*0.65275' },
        { action: 'line', x: 'w*0.8', y: 'h*0.56125' },
        { action: 'line', x: 'w*0.8', y: 'h*0.06' },
        { action: 'line', x: 'w*0.68', y: 'h*0.06' },
        { action: 'line', x: 'w*0.68', y: 'h*0.55875' },
        { action: 'line', x: 'w*0.67125', y: 'h*0.6155' },
        { action: 'line', x: 'w*0.6455', y: 'h*0.66575' },
        { action: 'line', x: 'w*0.60575', y: 'h*0.7055' },
        { action: 'line', x: 'w*0.5555', y: 'h*0.73125' },
        { action: 'line', x: 'w*0.5', y: 'h*0.74' },
        { action: 'line', x: 'w*0.4445', y: 'h*0.73125' },
        { action: 'line', x: 'w*0.39425', y: 'h*0.7055' },
        { action: 'line', x: 'w*0.3545', y: 'h*0.66575' },
        { action: 'line', x: 'w*0.32875', y: 'h*0.6155' },
        { action: 'line', x: 'w*0.31925', y: 'h*0.5505' },
        { action: 'line', x: 'w*0.32', y: 'h*0.56' },
        { action: 'line', x: 'w*0.32', y: 'h*0.06' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.16', y: 'h*0.9' },
        { action: 'line', x: 'w*0.84', y: 'h*0.9' },
        { action: 'line', x: 'w*0.84', y: 'h*0.98' },
        { action: 'line', x: 'w*0.16', y: 'h*0.98' },
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
  /** 斜体（29×29） */
  {
    name: 'andriod_icons_30',
    title: '斜体',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.4', y: 'h*0.14' },
        { action: 'line', x: 'w*0.8', y: 'h*0.14' },
        { action: 'line', x: 'w*0.8', y: 'h*0.06' },
        { action: 'line', x: 'w*0.4', y: 'h*0.06' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.5275', y: 'h*0.101' },
        { action: 'line', x: 'w*0.3275', y: 'h*0.861' },
        { action: 'line', x: 'w*0.4725', y: 'h*0.899' },
        { action: 'line', x: 'w*0.6725', y: 'h*0.139' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.2', y: 'h*0.94' },
        { action: 'line', x: 'w*0.6', y: 'h*0.94' },
        { action: 'line', x: 'w*0.6', y: 'h*0.86' },
        { action: 'line', x: 'w*0.2', y: 'h*0.86' },
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
  /** 粗体（29×29） */
  {
    name: 'andriod_icons_31',
    title: '粗体',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.22', y: 'h*0.04' },
          { action: 'line', x: 'w*0.58', y: 'h*0.04' },
          { action: 'line', x: 'w*0.58', y: 'h*0.04' },
          { action: 'line', x: 'w*0.648', y: 'h*0.05125' },
          { action: 'line', x: 'w*0.70925', y: 'h*0.084' },
          { action: 'line', x: 'w*0.758', y: 'h*0.13475' },
          { action: 'line', x: 'w*0.78925', y: 'h*0.199' },
          { action: 'line', x: 'w*0.8', y: 'h*0.27' },
          { action: 'line', x: 'w*0.78925', y: 'h*0.341' },
          { action: 'line', x: 'w*0.758', y: 'h*0.40525' },
          { action: 'line', x: 'w*0.70925', y: 'h*0.456' },
          { action: 'line', x: 'w*0.648', y: 'h*0.48875' },
          { action: 'line', x: 'w*0.58', y: 'h*0.5' },
          { action: 'line', x: 'w*0.62', y: 'h*0.5' },
          { action: 'line', x: 'w*0.62', y: 'h*0.5' },
          { action: 'line', x: 'w*0.69425', y: 'h*0.51125' },
          { action: 'line', x: 'w*0.761', y: 'h*0.544' },
          { action: 'line', x: 'w*0.81425', y: 'h*0.59475' },
          { action: 'line', x: 'w*0.84825', y: 'h*0.659' },
          { action: 'line', x: 'w*0.86', y: 'h*0.73' },
          { action: 'line', x: 'w*0.84825', y: 'h*0.801' },
          { action: 'line', x: 'w*0.81425', y: 'h*0.86525' },
          { action: 'line', x: 'w*0.761', y: 'h*0.916' },
          { action: 'line', x: 'w*0.69425', y: 'h*0.94875' },
          { action: 'line', x: 'w*0.62', y: 'h*0.96' },
          { action: 'line', x: 'w*0.22', y: 'h*0.96' },
          { action: 'close' },
          { action: 'move', x: 'w*0.36', y: 'h*0.1545' },
          { action: 'line', x: 'w*0.56', y: 'h*0.1545' },
          { action: 'line', x: 'w*0.56', y: 'h*0.16' },
          { action: 'line', x: 'w*0.6', y: 'h*0.16825' },
          { action: 'line', x: 'w*0.634', y: 'h*0.19225' },
          { action: 'line', x: 'w*0.6565', y: 'h*0.228' },
          { action: 'line', x: 'w*0.6645', y: 'h*0.27' },
          { action: 'line', x: 'w*0.6565', y: 'h*0.312' },
          { action: 'line', x: 'w*0.634', y: 'h*0.34775' },
          { action: 'line', x: 'w*0.6', y: 'h*0.37175' },
          { action: 'line', x: 'w*0.56', y: 'h*0.38' },
          { action: 'line', x: 'w*0.36', y: 'h*0.3855' },
          { action: 'close' },
          { action: 'move', x: 'w*0.36', y: 'h*0.6145' },
          { action: 'line', x: 'w*0.56', y: 'h*0.6145' },
          { action: 'line', x: 'w*0.56', y: 'h*0.62' },
          { action: 'line', x: 'w*0.6', y: 'h*0.62825' },
          { action: 'line', x: 'w*0.634', y: 'h*0.65225' },
          { action: 'line', x: 'w*0.6565', y: 'h*0.688' },
          { action: 'line', x: 'w*0.6645', y: 'h*0.73' },
          { action: 'line', x: 'w*0.6565', y: 'h*0.772' },
          { action: 'line', x: 'w*0.634', y: 'h*0.80775' },
          { action: 'line', x: 'w*0.6', y: 'h*0.83175' },
          { action: 'line', x: 'w*0.56', y: 'h*0.84' },
          { action: 'line', x: 'w*0.36', y: 'h*0.8455' },
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
  /** 撤销（29×29） */
  {
    name: 'andriod_icons_32',
    title: '撤销',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.9345', y: 'h*0.851' },
        { action: 'line', x: 'w*0.7865', y: 'h*0.4755' },
        { action: 'line', x: 'w*0.5245', y: 'h*0.26375' },
        { action: 'line', x: 'w*0.16', y: 'h*0.26' },
        { action: 'line', x: 'w*0.16', y: 'h*0.42' },
        { action: 'line', x: 'w*0.4755', y: 'h*0.41625' },
        { action: 'line', x: 'w*0.6535', y: 'h*0.5645' },
        { action: 'line', x: 'w*0.7855', y: 'h*0.909' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.32', y: 'h*0.1' },
        { action: 'line', x: 'w*0.04', y: 'h*0.34' },
        { action: 'line', x: 'w*0.32', y: 'h*0.58' },
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
  /** 重做（29×29） */
  {
    name: 'andriod_icons_33',
    title: '重做',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.2145', y: 'h*0.909' },
        { action: 'line', x: 'w*0.3465', y: 'h*0.5645' },
        { action: 'line', x: 'w*0.5245', y: 'h*0.41625' },
        { action: 'line', x: 'w*0.84', y: 'h*0.42' },
        { action: 'line', x: 'w*0.84', y: 'h*0.26' },
        { action: 'line', x: 'w*0.4755', y: 'h*0.26375' },
        { action: 'line', x: 'w*0.2135', y: 'h*0.4755' },
        { action: 'line', x: 'w*0.0655', y: 'h*0.851' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.68', y: 'h*0.1' },
        { action: 'line', x: 'w*0.96', y: 'h*0.34' },
        { action: 'line', x: 'w*0.68', y: 'h*0.58' },
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
  /** 禁止（29×29） */
  {
    name: 'andriod_icons_34',
    title: '禁止',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
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
            y1: 'h*-0.03325',
            x2: 'w*0.9',
            y2: 'h*-0.03325',
            x: 'w*0.9',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.9',
            y1: 'h*1.03325',
            x2: 'w*0.1',
            y2: 'h*1.03325',
            x: 'w*0.1',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.23475', y: 'h*0.31275' },
        { action: 'line', x: 'w*0.68725', y: 'h*0.76525' },
        { action: 'line', x: 'w*0.76525', y: 'h*0.68725' },
        { action: 'line', x: 'w*0.31275', y: 'h*0.23475' },
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
  /** 帮助（29×29） */
  {
    name: 'andriod_icons_35',
    title: '帮助',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
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
        { action: 'move', x: 'w*0.35175', y: 'h*0.3565' },
        { action: 'line', x: 'w*0.36725', y: 'h*0.31025' },
        { action: 'line', x: 'w*0.39675', y: 'h*0.27125' },
        { action: 'line', x: 'w*0.43725', y: 'h*0.24375' },
        { action: 'line', x: 'w*0.48425', y: 'h*0.23075' },
        { action: 'line', x: 'w*0.533', y: 'h*0.23375' },
        { action: 'line', x: 'w*0.57825', y: 'h*0.252' },
        { action: 'line', x: 'w*0.61525', y: 'h*0.284' },
        { action: 'line', x: 'w*0.64', y: 'h*0.32625' },
        { action: 'line', x: 'w*0.65', y: 'h*0.374' },
        { action: 'line', x: 'w*0.64375', y: 'h*0.4225' },
        { action: 'line', x: 'w*0.6225', y: 'h*0.4665' },
        { action: 'line', x: 'w*0.58825', y: 'h*0.50125' },
        { action: 'line', x: 'w*0.54125', y: 'h*0.43675' },
        { action: 'line', x: 'w*0.55725', y: 'h*0.4205' },
        { action: 'line', x: 'w*0.567', y: 'h*0.4' },
        { action: 'line', x: 'w*0.57', y: 'h*0.37725' },
        { action: 'line', x: 'w*0.56525', y: 'h*0.355' },
        { action: 'line', x: 'w*0.55375', y: 'h*0.33525' },
        { action: 'line', x: 'w*0.5365', y: 'h*0.32025' },
        { action: 'line', x: 'w*0.5155', y: 'h*0.31175' },
        { action: 'line', x: 'w*0.49275', y: 'h*0.3105' },
        { action: 'line', x: 'w*0.47075', y: 'h*0.3165' },
        { action: 'line', x: 'w*0.45175', y: 'h*0.32925' },
        { action: 'line', x: 'w*0.438', y: 'h*0.3475' },
        { action: 'line', x: 'w*0.43075', y: 'h*0.369' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.625', y: 'h*0.40875' },
        { action: 'line', x: 'w*0.468', y: 'h*0.536' },
        { action: 'line', x: 'w*0.46', y: 'h*0.64' },
        { action: 'line', x: 'w*0.54', y: 'h*0.64' },
        { action: 'line', x: 'w*0.532', y: 'h*0.584' },
        { action: 'line', x: 'w*0.675', y: 'h*0.47125' },
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
  /** 首页（29×29） */
  {
    name: 'andriod_icons_36',
    title: '首页',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.04' },
          { action: 'line', x: 'w*0.98', y: 'h*0.46' },
          { action: 'line', x: 'w*0.82', y: 'h*0.46' },
          { action: 'line', x: 'w*0.82', y: 'h*0.94' },
          { action: 'line', x: 'w*0.18', y: 'h*0.94' },
          { action: 'line', x: 'w*0.18', y: 'h*0.46' },
          { action: 'line', x: 'w*0.02', y: 'h*0.46' },
          { action: 'close' },
          { action: 'move', x: 'w*0.4', y: 'h*0.58' },
          { action: 'line', x: 'w*0.6', y: 'h*0.58' },
          { action: 'line', x: 'w*0.6', y: 'h*0.88' },
          { action: 'line', x: 'w*0.4', y: 'h*0.88' },
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
  /** 电源（29×29） */
  {
    name: 'andriod_icons_37',
    title: '电源',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.755', y: 'h*0.19175' },
        { action: 'line', x: 'w*0.822', y: 'h*0.26275' },
        { action: 'line', x: 'w*0.87', y: 'h*0.348' },
        { action: 'line', x: 'w*0.89575', y: 'h*0.4425' },
        { action: 'line', x: 'w*0.898', y: 'h*0.54025' },
        { action: 'line', x: 'w*0.87625', y: 'h*0.6355' },
        { action: 'line', x: 'w*0.83225', y: 'h*0.72275' },
        { action: 'line', x: 'w*0.76825', y: 'h*0.79675' },
        { action: 'line', x: 'w*0.68825', y: 'h*0.853' },
        { action: 'line', x: 'w*0.597', y: 'h*0.888' },
        { action: 'line', x: 'w*0.5', y: 'h*0.9' },
        { action: 'line', x: 'w*0.403', y: 'h*0.888' },
        { action: 'line', x: 'w*0.31175', y: 'h*0.853' },
        { action: 'line', x: 'w*0.23175', y: 'h*0.79675' },
        { action: 'line', x: 'w*0.16775', y: 'h*0.72275' },
        { action: 'line', x: 'w*0.12375', y: 'h*0.6355' },
        { action: 'line', x: 'w*0.102', y: 'h*0.54025' },
        { action: 'line', x: 'w*0.10425', y: 'h*0.4425' },
        { action: 'line', x: 'w*0.13', y: 'h*0.348' },
        { action: 'line', x: 'w*0.178', y: 'h*0.26275' },
        { action: 'line', x: 'w*0.245', y: 'h*0.19175' },
        { action: 'line', x: 'w*0.30875', y: 'h*0.26875' },
        { action: 'line', x: 'w*0.2585', y: 'h*0.32225' },
        { action: 'line', x: 'w*0.2225', y: 'h*0.386' },
        { action: 'line', x: 'w*0.20325', y: 'h*0.45675' },
        { action: 'line', x: 'w*0.2015', y: 'h*0.53' },
        { action: 'line', x: 'w*0.21775', y: 'h*0.6015' },
        { action: 'line', x: 'w*0.25075', y: 'h*0.667' },
        { action: 'line', x: 'w*0.29875', y: 'h*0.7225' },
        { action: 'line', x: 'w*0.35875', y: 'h*0.76475' },
        { action: 'line', x: 'w*0.42725', y: 'h*0.791' },
        { action: 'line', x: 'w*0.5', y: 'h*0.8' },
        { action: 'line', x: 'w*0.57275', y: 'h*0.791' },
        { action: 'line', x: 'w*0.64125', y: 'h*0.76475' },
        { action: 'line', x: 'w*0.70125', y: 'h*0.7225' },
        { action: 'line', x: 'w*0.74925', y: 'h*0.667' },
        { action: 'line', x: 'w*0.78225', y: 'h*0.6015' },
        { action: 'line', x: 'w*0.7985', y: 'h*0.53' },
        { action: 'line', x: 'w*0.79675', y: 'h*0.45675' },
        { action: 'line', x: 'w*0.7775', y: 'h*0.386' },
        { action: 'line', x: 'w*0.7415', y: 'h*0.32225' },
        { action: 'line', x: 'w*0.69125', y: 'h*0.26875' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.45', y: 'h*0.06' },
        { action: 'line', x: 'w*0.45', y: 'h*0.5' },
        { action: 'line', x: 'w*0.55', y: 'h*0.5' },
        { action: 'line', x: 'w*0.55', y: 'h*0.06' },
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
  /** 好评（29×29） */
  {
    name: 'andriod_icons_38',
    title: '好评',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.06', y: 'h*0.47' },
          { action: 'quadraticCurve', x1: 'w*0.06', y1: 'h*0.44', x: 'w*0.09', y: 'h*0.44' },
          { action: 'line', x: 'w*0.23', y: 'h*0.44' },
          { action: 'quadraticCurve', x1: 'w*0.26', y1: 'h*0.44', x: 'w*0.26', y: 'h*0.47' },
          { action: 'line', x: 'w*0.26', y: 'h*0.87' },
          { action: 'quadraticCurve', x1: 'w*0.26', y1: 'h*0.9', x: 'w*0.23', y: 'h*0.9' },
          { action: 'line', x: 'w*0.09', y: 'h*0.9' },
          { action: 'quadraticCurve', x1: 'w*0.06', y1: 'h*0.9', x: 'w*0.06', y: 'h*0.87' },
          { action: 'close' },
          { action: 'move', x: 'w*0.13', y: 'h*0.53075' },
          { action: 'quadraticCurve', x1: 'w*0.13', y1: 'h*0.51', x: 'w*0.139', y: 'h*0.51' },
          { action: 'line', x: 'w*0.181', y: 'h*0.51' },
          { action: 'quadraticCurve', x1: 'w*0.19', y1: 'h*0.51', x: 'w*0.19', y: 'h*0.53075' },
          { action: 'line', x: 'w*0.19', y: 'h*0.80925' },
          { action: 'quadraticCurve', x1: 'w*0.19', y1: 'h*0.83', x: 'w*0.181', y: 'h*0.83' },
          { action: 'line', x: 'w*0.139', y: 'h*0.83' },
          { action: 'quadraticCurve', x1: 'w*0.13', y1: 'h*0.83', x: 'w*0.13', y: 'h*0.80925' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.32', y: 'h*0.9' },
        { action: 'line', x: 'w*0.32', y: 'h*0.42' },
        { action: 'line', x: 'w*0.46', y: 'h*0.36' },
        { action: 'line', x: 'w*0.54', y: 'h*0.06' },
        { action: 'line', x: 'w*0.68', y: 'h*0.1' },
        { action: 'line', x: 'w*0.62', y: 'h*0.38' },
        { action: 'line', x: 'w*0.9', y: 'h*0.4' },
        { action: 'line', x: 'w*0.96', y: 'h*0.52' },
        { action: 'line', x: 'w*0.88', y: 'h*0.6' },
        { action: 'line', x: 'w*0.96', y: 'h*0.68' },
        { action: 'line', x: 'w*0.88', y: 'h*0.76' },
        { action: 'line', x: 'w*0.94', y: 'h*0.84' },
        { action: 'line', x: 'w*0.84', y: 'h*0.9' },
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
  /** 趋势（29×29） */
  {
    name: 'andriod_icons_39',
    title: '趋势',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.06', y: 'h*0.08' },
        { action: 'line', x: 'w*0.072', y: 'h*0.9285' },
        { action: 'line', x: 'w*0.94', y: 'h*0.94' },
        { action: 'line', x: 'w*0.94', y: 'h*0.86' },
        { action: 'line', x: 'w*0.128', y: 'h*0.8715' },
        { action: 'line', x: 'w*0.14', y: 'h*0.08' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.23175', y: 'h*0.6845' },
        { action: 'line', x: 'w*0.407', y: 'h*0.4395' },
        { action: 'line', x: 'w*0.55525', y: 'h*0.637' },
        { action: 'line', x: 'w*0.8715', y: 'h*0.24475' },
        { action: 'line', x: 'w*0.8085', y: 'h*0.19525' },
        { action: 'line', x: 'w*0.52475', y: 'h*0.563' },
        { action: 'line', x: 'w*0.393', y: 'h*0.3605' },
        { action: 'line', x: 'w*0.16825', y: 'h*0.6355' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.7', y: 'h*0.14' },
        { action: 'line', x: 'w*0.92', y: 'h*0.12' },
        { action: 'line', x: 'w*0.86', y: 'h*0.34' },
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
  /** 链接（29×29） */
  {
    name: 'andriod_icons_40',
    title: '链接',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.13', y: 'h*0.38' },
          {
            action: 'curve',
            x1: 'w*0.13',
            y1: 'h*0.046667',
            x2: 'w*0.63',
            y2: 'h*0.046667',
            x: 'w*0.63',
            y: 'h*0.38'
          },
          {
            action: 'curve',
            x1: 'w*0.63',
            y1: 'h*0.713333',
            x2: 'w*0.13',
            y2: 'h*0.713333',
            x: 'w*0.13',
            y: 'h*0.38'
          },
          { action: 'close' },
          { action: 'move', x: 'w*0.23', y: 'h*0.38' },
          { action: 'curve', x1: 'w*0.23', y1: 'h*0.18', x2: 'w*0.53', y2: 'h*0.18', x: 'w*0.53', y: 'h*0.38' },
          { action: 'curve', x1: 'w*0.53', y1: 'h*0.58', x2: 'w*0.23', y2: 'h*0.58', x: 'w*0.23', y: 'h*0.38' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      {
        actions: [
          { action: 'move', x: 'w*0.37', y: 'h*0.62' },
          {
            action: 'curve',
            x1: 'w*0.37',
            y1: 'h*0.286667',
            x2: 'w*0.87',
            y2: 'h*0.286667',
            x: 'w*0.87',
            y: 'h*0.62'
          },
          {
            action: 'curve',
            x1: 'w*0.87',
            y1: 'h*0.953333',
            x2: 'w*0.37',
            y2: 'h*0.953333',
            x: 'w*0.37',
            y: 'h*0.62'
          },
          { action: 'close' },
          { action: 'move', x: 'w*0.47', y: 'h*0.62' },
          { action: 'curve', x1: 'w*0.47', y1: 'h*0.42', x2: 'w*0.77', y2: 'h*0.42', x: 'w*0.77', y: 'h*0.62' },
          { action: 'curve', x1: 'w*0.77', y1: 'h*0.82', x2: 'w*0.47', y2: 'h*0.82', x: 'w*0.47', y: 'h*0.62' },
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
  /** 左对齐（29×29） */
  {
    name: 'andriod_icons_41',
    title: '左对齐',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.08', y: 'h*0.115' },
        { action: 'line', x: 'w*0.92', y: 'h*0.115' },
        { action: 'line', x: 'w*0.92', y: 'h*0.205' },
        { action: 'line', x: 'w*0.08', y: 'h*0.205' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.08', y: 'h*0.335' },
        { action: 'line', x: 'w*0.68', y: 'h*0.335' },
        { action: 'line', x: 'w*0.68', y: 'h*0.425' },
        { action: 'line', x: 'w*0.08', y: 'h*0.425' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.08', y: 'h*0.555' },
        { action: 'line', x: 'w*0.92', y: 'h*0.555' },
        { action: 'line', x: 'w*0.92', y: 'h*0.645' },
        { action: 'line', x: 'w*0.08', y: 'h*0.645' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.08', y: 'h*0.775' },
        { action: 'line', x: 'w*0.68', y: 'h*0.775' },
        { action: 'line', x: 'w*0.68', y: 'h*0.865' },
        { action: 'line', x: 'w*0.08', y: 'h*0.865' },
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
  /** 地图标记（29×29） */
  {
    name: 'andriod_icons_42',
    title: '地图标记',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.3215', y: 'h*0.57575' },
          { action: 'line', x: 'w*0.26475', y: 'h*0.512' },
          { action: 'line', x: 'w*0.23', y: 'h*0.434' },
          { action: 'line', x: 'w*0.22025', y: 'h*0.349' },
          { action: 'line', x: 'w*0.2365', y: 'h*0.26525' },
          { action: 'line', x: 'w*0.2775', y: 'h*0.19025' },
          { action: 'line', x: 'w*0.339', y: 'h*0.131' },
          { action: 'line', x: 'w*0.4155', y: 'h*0.093' },
          { action: 'line', x: 'w*0.5', y: 'h*0.08' },
          { action: 'line', x: 'w*0.5845', y: 'h*0.093' },
          { action: 'line', x: 'w*0.661', y: 'h*0.131' },
          { action: 'line', x: 'w*0.7225', y: 'h*0.19025' },
          { action: 'line', x: 'w*0.7635', y: 'h*0.26525' },
          { action: 'line', x: 'w*0.77975', y: 'h*0.349' },
          { action: 'line', x: 'w*0.77', y: 'h*0.434' },
          { action: 'line', x: 'w*0.73525', y: 'h*0.512' },
          { action: 'line', x: 'w*0.6785', y: 'h*0.57575' },
          { action: 'line', x: 'w*0.5', y: 'h*0.98' },
          { action: 'close' },
          { action: 'move', x: 'w*0.3712', y: 'h*0.36' },
          {
            action: 'curve',
            x1: 'w*0.3712',
            y1: 'h*0.188267',
            x2: 'w*0.6288',
            y2: 'h*0.188267',
            x: 'w*0.6288',
            y: 'h*0.36'
          },
          {
            action: 'curve',
            x1: 'w*0.6288',
            y1: 'h*0.531733',
            x2: 'w*0.3712',
            y2: 'h*0.531733',
            x: 'w*0.3712',
            y: 'h*0.36'
          },
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
  /** 靶心（29×29） */
  {
    name: 'andriod_icons_43',
    title: '靶心',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.07', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.07',
            y1: 'h*-0.07325',
            x2: 'w*0.93',
            y2: 'h*-0.07325',
            x: 'w*0.93',
            y: 'h*0.5'
          },
          {
            action: 'curve',
            x1: 'w*0.93',
            y1: 'h*1.07325',
            x2: 'w*0.07',
            y2: 'h*1.07325',
            x: 'w*0.07',
            y: 'h*0.5'
          },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.37', y: 'h*0.5' },
        {
          action: 'curve',
          x1: 'w*0.37',
          y1: 'h*0.326667',
          x2: 'w*0.63',
          y2: 'h*0.326667',
          x: 'w*0.63',
          y: 'h*0.5'
        },
        {
          action: 'curve',
          x1: 'w*0.63',
          y1: 'h*0.673333',
          x2: 'w*0.37',
          y2: 'h*0.673333',
          x: 'w*0.37',
          y: 'h*0.5'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.84', y: 'h*0.535' },
        { action: 'line', x: 'w*1', y: 'h*0.535' },
        { action: 'line', x: 'w*1', y: 'h*0.465' },
        { action: 'line', x: 'w*0.84', y: 'h*0.465' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.465', y: 'h*0.84' },
        { action: 'line', x: 'w*0.465', y: 'h*1' },
        { action: 'line', x: 'w*0.535', y: 'h*1' },
        { action: 'line', x: 'w*0.535', y: 'h*0.84' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.16', y: 'h*0.465' },
        { action: 'line', x: 0, y: 'h*0.465' },
        { action: 'line', x: 0, y: 'h*0.535' },
        { action: 'line', x: 'w*0.16', y: 'h*0.535' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.535', y: 'h*0.16' },
        { action: 'line', x: 'w*0.535', y: 0 },
        { action: 'line', x: 'w*0.465', y: 0 },
        { action: 'line', x: 'w*0.465', y: 'h*0.16' },
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
  /** 锁定（29×29） */
  {
    name: 'andriod_icons_44',
    title: '锁定',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.3', y: 'h*0.44' },
        { action: 'line', x: 'w*0.30675', y: 'h*0.378' },
        { action: 'line', x: 'w*0.32675', y: 'h*0.32' },
        { action: 'line', x: 'w*0.3585', y: 'h*0.27025' },
        { action: 'line', x: 'w*0.4', y: 'h*0.23225' },
        { action: 'line', x: 'w*0.44825', y: 'h*0.20825' },
        { action: 'line', x: 'w*0.5', y: 'h*0.2' },
        { action: 'line', x: 'w*0.55175', y: 'h*0.20825' },
        { action: 'line', x: 'w*0.6', y: 'h*0.23225' },
        { action: 'line', x: 'w*0.6415', y: 'h*0.27025' },
        { action: 'line', x: 'w*0.67325', y: 'h*0.32' },
        { action: 'line', x: 'w*0.69325', y: 'h*0.378' },
        { action: 'line', x: 'w*0.7', y: 'h*0.44' },
        { action: 'line', x: 'w*0.6', y: 'h*0.44' },
        { action: 'line', x: 'w*0.5965', y: 'h*0.40375' },
        { action: 'line', x: 'w*0.5865', y: 'h*0.37' },
        { action: 'line', x: 'w*0.57075', y: 'h*0.341' },
        { action: 'line', x: 'w*0.55', y: 'h*0.31875' },
        { action: 'line', x: 'w*0.526', y: 'h*0.30475' },
        { action: 'line', x: 'w*0.5', y: 'h*0.3' },
        { action: 'line', x: 'w*0.474', y: 'h*0.30475' },
        { action: 'line', x: 'w*0.45', y: 'h*0.31875' },
        { action: 'line', x: 'w*0.42925', y: 'h*0.341' },
        { action: 'line', x: 'w*0.4135', y: 'h*0.37' },
        { action: 'line', x: 'w*0.4035', y: 'h*0.40375' },
        { action: 'line', x: 'w*0.4', y: 'h*0.44' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.25', y: 'h*0.44' },
        { action: 'line', x: 'w*0.25', y: 'h*0.52' },
        { action: 'line', x: 'w*0.35', y: 'h*0.52' },
        { action: 'line', x: 'w*0.35', y: 'h*0.44' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.65', y: 'h*0.44' },
        { action: 'line', x: 'w*0.65', y: 'h*0.52' },
        { action: 'line', x: 'w*0.75', y: 'h*0.52' },
        { action: 'line', x: 'w*0.75', y: 'h*0.44' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.2', y: 'h*0.54' },
        { action: 'quadraticCurve', x1: 'w*0.2', y1: 'h*0.48', x: 'w*0.26', y: 'h*0.48' },
        { action: 'line', x: 'w*0.74', y: 'h*0.48' },
        { action: 'quadraticCurve', x1: 'w*0.8', y1: 'h*0.48', x: 'w*0.8', y: 'h*0.54' },
        { action: 'line', x: 'w*0.8', y: 'h*0.88' },
        { action: 'quadraticCurve', x1: 'w*0.8', y1: 'h*0.94', x: 'w*0.74', y: 'h*0.94' },
        { action: 'line', x: 'w*0.26', y: 'h*0.94' },
        { action: 'quadraticCurve', x1: 'w*0.2', y1: 'h*0.94', x: 'w*0.2', y: 'h*0.88' },
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
  /** 解锁（29×29） */
  {
    name: 'andriod_icons_45',
    title: '解锁',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.42975', y: 'h*0.32575' },
        { action: 'line', x: 'w*0.45525', y: 'h*0.264' },
        { action: 'line', x: 'w*0.49425', y: 'h*0.2135' },
        { action: 'line', x: 'w*0.5435', y: 'h*0.17825' },
        { action: 'line', x: 'w*0.599', y: 'h*0.16125' },
        { action: 'line', x: 'w*0.6565', y: 'h*0.164' },
        { action: 'line', x: 'w*0.71075', y: 'h*0.18625' },
        { action: 'line', x: 'w*0.75775', y: 'h*0.226' },
        { action: 'line', x: 'w*0.79325', y: 'h*0.28' },
        { action: 'line', x: 'w*0.8145', y: 'h*0.344' },
        { action: 'line', x: 'w*0.81975', y: 'h*0.4125' },
        { action: 'line', x: 'w*0.8085', y: 'h*0.48' },
        { action: 'line', x: 'w*0.78175', y: 'h*0.541' },
        { action: 'line', x: 'w*0.701', y: 'h*0.48225' },
        { action: 'line', x: 'w*0.71425', y: 'h*0.44675' },
        { action: 'line', x: 'w*0.71975', y: 'h*0.40725' },
        { action: 'line', x: 'w*0.71725', y: 'h*0.36725' },
        { action: 'line', x: 'w*0.7065', y: 'h*0.33' },
        { action: 'line', x: 'w*0.68875', y: 'h*0.2985' },
        { action: 'line', x: 'w*0.6655', y: 'h*0.27525' },
        { action: 'line', x: 'w*0.63825', y: 'h*0.26225' },
        { action: 'line', x: 'w*0.6095', y: 'h*0.26075' },
        { action: 'line', x: 'w*0.58175', y: 'h*0.27075' },
        { action: 'line', x: 'w*0.557', y: 'h*0.29125' },
        { action: 'line', x: 'w*0.5375', y: 'h*0.32075' },
        { action: 'line', x: 'w*0.525', y: 'h*0.35675' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.37', y: 'h*0.4' },
        { action: 'line', x: 'w*0.37', y: 'h*0.52' },
        { action: 'line', x: 'w*0.47', y: 'h*0.52' },
        { action: 'line', x: 'w*0.47', y: 'h*0.4' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.2', y: 'h*0.54' },
        { action: 'quadraticCurve', x1: 'w*0.2', y1: 'h*0.48', x: 'w*0.26', y: 'h*0.48' },
        { action: 'line', x: 'w*0.74', y: 'h*0.48' },
        { action: 'quadraticCurve', x1: 'w*0.8', y1: 'h*0.48', x: 'w*0.8', y: 'h*0.54' },
        { action: 'line', x: 'w*0.8', y: 'h*0.88' },
        { action: 'quadraticCurve', x1: 'w*0.8', y1: 'h*0.94', x: 'w*0.74', y: 'h*0.94' },
        { action: 'line', x: 'w*0.26', y: 'h*0.94' },
        { action: 'quadraticCurve', x1: 'w*0.2', y1: 'h*0.94', x: 'w*0.2', y: 'h*0.88' },
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
  /** 邮件（29×29） */
  {
    name: 'andriod_icons_46',
    title: '邮件',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.02', y: 'h*0.26' },
          { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.2', x: 'w*0.08', y: 'h*0.2' },
          { action: 'line', x: 'w*0.92', y: 'h*0.2' },
          { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.2', x: 'w*0.98', y: 'h*0.26' },
          { action: 'line', x: 'w*0.98', y: 'h*0.74' },
          { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.8', x: 'w*0.92', y: 'h*0.8' },
          { action: 'line', x: 'w*0.08', y: 'h*0.8' },
          { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.8', x: 'w*0.02', y: 'h*0.74' },
          { action: 'close' },
          { action: 'move', x: 'w*0.1', y: 'h*0.26' },
          { action: 'line', x: 'w*0.5', y: 'h*0.6' },
          { action: 'line', x: 'w*0.9', y: 'h*0.26' },
          { action: 'line', x: 'w*0.9', y: 'h*0.37' },
          { action: 'line', x: 'w*0.5', y: 'h*0.71' },
          { action: 'line', x: 'w*0.1', y: 'h*0.37' },
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
  /** 麦克风（29×29） */
  {
    name: 'andriod_icons_47',
    title: '麦克风',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.34', y: 'h*0.2' },
        { action: 'quadraticCurve', x1: 'w*0.34', y1: 'h*0.04', x: 'w*0.5', y: 'h*0.04' },
        { action: 'line', x: 'w*0.5', y: 'h*0.04' },
        { action: 'quadraticCurve', x1: 'w*0.66', y1: 'h*0.04', x: 'w*0.66', y: 'h*0.2' },
        { action: 'line', x: 'w*0.66', y: 'h*0.38' },
        { action: 'quadraticCurve', x1: 'w*0.66', y1: 'h*0.54', x: 'w*0.5', y: 'h*0.54' },
        { action: 'line', x: 'w*0.5', y: 'h*0.54' },
        { action: 'quadraticCurve', x1: 'w*0.34', y1: 'h*0.54', x: 'w*0.34', y: 'h*0.38' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.78', y: 'h*0.44' },
        { action: 'line', x: 'w*0.773', y: 'h*0.50225' },
        { action: 'line', x: 'w*0.75225', y: 'h*0.5615' },
        { action: 'line', x: 'w*0.719', y: 'h*0.6145' },
        { action: 'line', x: 'w*0.6745', y: 'h*0.659' },
        { action: 'line', x: 'w*0.6215', y: 'h*0.69225' },
        { action: 'line', x: 'w*0.56225', y: 'h*0.713' },
        { action: 'line', x: 'w*0.5', y: 'h*0.72' },
        { action: 'line', x: 'w*0.43775', y: 'h*0.713' },
        { action: 'line', x: 'w*0.3785', y: 'h*0.69225' },
        { action: 'line', x: 'w*0.3255', y: 'h*0.659' },
        { action: 'line', x: 'w*0.281', y: 'h*0.6145' },
        { action: 'line', x: 'w*0.24775', y: 'h*0.5615' },
        { action: 'line', x: 'w*0.227', y: 'h*0.50225' },
        { action: 'line', x: 'w*0.22', y: 'h*0.44' },
        { action: 'line', x: 'w*0.31', y: 'h*0.44' },
        { action: 'line', x: 'w*0.31475', y: 'h*0.48225' },
        { action: 'line', x: 'w*0.32875', y: 'h*0.5225' },
        { action: 'line', x: 'w*0.3515', y: 'h*0.5585' },
        { action: 'line', x: 'w*0.3815', y: 'h*0.5885' },
        { action: 'line', x: 'w*0.4175', y: 'h*0.61125' },
        { action: 'line', x: 'w*0.45775', y: 'h*0.62525' },
        { action: 'line', x: 'w*0.5', y: 'h*0.63' },
        { action: 'line', x: 'w*0.54225', y: 'h*0.62525' },
        { action: 'line', x: 'w*0.5825', y: 'h*0.61125' },
        { action: 'line', x: 'w*0.6185', y: 'h*0.5885' },
        { action: 'line', x: 'w*0.6485', y: 'h*0.5585' },
        { action: 'line', x: 'w*0.67125', y: 'h*0.5225' },
        { action: 'line', x: 'w*0.68525', y: 'h*0.48225' },
        { action: 'line', x: 'w*0.69', y: 'h*0.44' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.455', y: 'h*0.72' },
        { action: 'line', x: 'w*0.455', y: 'h*0.9' },
        { action: 'line', x: 'w*0.545', y: 'h*0.9' },
        { action: 'line', x: 'w*0.545', y: 'h*0.72' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.34', y: 'h*0.965' },
        { action: 'line', x: 'w*0.66', y: 'h*0.965' },
        { action: 'line', x: 'w*0.66', y: 'h*0.875' },
        { action: 'line', x: 'w*0.34', y: 'h*0.875' },
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
  /** 评论（29×29） */
  {
    name: 'andriod_icons_48',
    title: '评论',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 0, y: 'h*0.1' },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 'w*0.1', y: 0 },
        { action: 'line', x: 'w*0.84', y: 0 },
        { action: 'quadraticCurve', x1: 'w*0.94', y1: 0, x: 'w*0.94', y: 'h*0.1' },
        { action: 'line', x: 'w*0.94', y: 'h*0.58' },
        { action: 'quadraticCurve', x1: 'w*0.94', y1: 'h*0.68', x: 'w*0.84', y: 'h*0.68' },
        { action: 'line', x: 'w*0.1', y: 'h*0.68' },
        { action: 'quadraticCurve', x1: 0, y1: 'h*0.68', x: 0, y: 'h*0.58' },
        { action: 'close' },
        { action: 'move', x: 'w*0.2', y: 'h*0.64' },
        { action: 'line', x: 'w*0.38', y: 'h*0.64' },
        { action: 'line', x: 'w*0.22', y: 'h*0.94' },
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
  /** 胶片（29×29） */
  {
    name: 'andriod_icons_49',
    title: '胶片',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.04', y: 'h*0.14' },
          { action: 'line', x: 'w*0.96', y: 'h*0.14' },
          { action: 'line', x: 'w*0.96', y: 'h*0.86' },
          { action: 'line', x: 'w*0.04', y: 'h*0.86' },
          { action: 'close' },
          { action: 'move', x: 'w*0.08', y: 'h*0.2' },
          { action: 'line', x: 'w*0.16', y: 'h*0.2' },
          { action: 'line', x: 'w*0.16', y: 'h*0.3' },
          { action: 'line', x: 'w*0.08', y: 'h*0.3' },
          { action: 'close' },
          { action: 'move', x: 'w*0.84', y: 'h*0.2' },
          { action: 'line', x: 'w*0.92', y: 'h*0.2' },
          { action: 'line', x: 'w*0.92', y: 'h*0.3' },
          { action: 'line', x: 'w*0.84', y: 'h*0.3' },
          { action: 'close' },
          { action: 'move', x: 'w*0.08', y: 'h*0.37' },
          { action: 'line', x: 'w*0.16', y: 'h*0.37' },
          { action: 'line', x: 'w*0.16', y: 'h*0.47' },
          { action: 'line', x: 'w*0.08', y: 'h*0.47' },
          { action: 'close' },
          { action: 'move', x: 'w*0.84', y: 'h*0.37' },
          { action: 'line', x: 'w*0.92', y: 'h*0.37' },
          { action: 'line', x: 'w*0.92', y: 'h*0.47' },
          { action: 'line', x: 'w*0.84', y: 'h*0.47' },
          { action: 'close' },
          { action: 'move', x: 'w*0.08', y: 'h*0.54' },
          { action: 'line', x: 'w*0.16', y: 'h*0.54' },
          { action: 'line', x: 'w*0.16', y: 'h*0.64' },
          { action: 'line', x: 'w*0.08', y: 'h*0.64' },
          { action: 'close' },
          { action: 'move', x: 'w*0.84', y: 'h*0.54' },
          { action: 'line', x: 'w*0.92', y: 'h*0.54' },
          { action: 'line', x: 'w*0.92', y: 'h*0.64' },
          { action: 'line', x: 'w*0.84', y: 'h*0.64' },
          { action: 'close' },
          { action: 'move', x: 'w*0.08', y: 'h*0.71' },
          { action: 'line', x: 'w*0.16', y: 'h*0.71' },
          { action: 'line', x: 'w*0.16', y: 'h*0.81' },
          { action: 'line', x: 'w*0.08', y: 'h*0.81' },
          { action: 'close' },
          { action: 'move', x: 'w*0.84', y: 'h*0.71' },
          { action: 'line', x: 'w*0.92', y: 'h*0.71' },
          { action: 'line', x: 'w*0.92', y: 'h*0.81' },
          { action: 'line', x: 'w*0.84', y: 'h*0.81' },
          { action: 'close' },
          { action: 'move', x: 'w*0.26', y: 'h*0.24' },
          { action: 'line', x: 'w*0.39', y: 'h*0.24' },
          { action: 'line', x: 'w*0.39', y: 'h*0.76' },
          { action: 'line', x: 'w*0.26', y: 'h*0.76' },
          { action: 'close' },
          { action: 'move', x: 'w*0.45', y: 'h*0.24' },
          { action: 'line', x: 'w*0.58', y: 'h*0.24' },
          { action: 'line', x: 'w*0.58', y: 'h*0.76' },
          { action: 'line', x: 'w*0.45', y: 'h*0.76' },
          { action: 'close' },
          { action: 'move', x: 'w*0.64', y: 'h*0.24' },
          { action: 'line', x: 'w*0.77', y: 'h*0.24' },
          { action: 'line', x: 'w*0.77', y: 'h*0.76' },
          { action: 'line', x: 'w*0.64', y: 'h*0.76' },
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
  /** 音乐（29×29） */
  {
    name: 'andriod_icons_50',
    title: '音乐',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.32', y: 'h*0.12' },
        { action: 'line', x: 'w*0.4', y: 'h*0.12' },
        { action: 'line', x: 'w*0.4', y: 'h*0.7' },
        { action: 'line', x: 'w*0.32', y: 'h*0.7' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.76', y: 'h*0.06' },
        { action: 'line', x: 'w*0.84', y: 'h*0.06' },
        { action: 'line', x: 'w*0.84', y: 'h*0.64' },
        { action: 'line', x: 'w*0.76', y: 'h*0.64' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.32', y: 'h*0.12' },
        { action: 'line', x: 'w*0.84', y: 'h*0.06' },
        { action: 'line', x: 'w*0.84', y: 'h*0.2' },
        { action: 'line', x: 'w*0.32', y: 'h*0.26' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.16', y: 'h*0.72' },
        {
          action: 'curve',
          x1: 'w*0.16',
          y1: 'h*0.586667',
          x2: 'w*0.4',
          y2: 'h*0.586667',
          x: 'w*0.4',
          y: 'h*0.72'
        },
        {
          action: 'curve',
          x1: 'w*0.4',
          y1: 'h*0.853333',
          x2: 'w*0.16',
          y2: 'h*0.853333',
          x: 'w*0.16',
          y: 'h*0.72'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.6', y: 'h*0.66' },
        {
          action: 'curve',
          x1: 'w*0.6',
          y1: 'h*0.526667',
          x2: 'w*0.84',
          y2: 'h*0.526667',
          x: 'w*0.84',
          y: 'h*0.66'
        },
        {
          action: 'curve',
          x1: 'w*0.84',
          y1: 'h*0.793333',
          x2: 'w*0.6',
          y2: 'h*0.793333',
          x: 'w*0.6',
          y: 'h*0.66'
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
  /** 电话（29×29） */
  {
    name: 'andriod_icons_51',
    title: '电话',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.26', y: 'h*0.13' },
          { action: 'quadraticCurve', x1: 'w*0.26', y1: 'h*0.04', x: 'w*0.35', y: 'h*0.04' },
          { action: 'line', x: 'w*0.65', y: 'h*0.04' },
          { action: 'quadraticCurve', x1: 'w*0.74', y1: 'h*0.04', x: 'w*0.74', y: 'h*0.13' },
          { action: 'line', x: 'w*0.74', y: 'h*0.87' },
          { action: 'quadraticCurve', x1: 'w*0.74', y1: 'h*0.96', x: 'w*0.65', y: 'h*0.96' },
          { action: 'line', x: 'w*0.35', y: 'h*0.96' },
          { action: 'quadraticCurve', x1: 'w*0.26', y1: 'h*0.96', x: 'w*0.26', y: 'h*0.87' },
          { action: 'close' },
          { action: 'move', x: 'w*0.345', y: 'h*0.19825' },
          { action: 'quadraticCurve', x1: 'w*0.345', y1: 'h*0.125', x: 'w*0.40325', y: 'h*0.125' },
          { action: 'line', x: 'w*0.597', y: 'h*0.125' },
          { action: 'quadraticCurve', x1: 'w*0.655', y1: 'h*0.125', x: 'w*0.655', y: 'h*0.19825' },
          { action: 'line', x: 'w*0.655', y: 'h*0.80175' },
          { action: 'quadraticCurve', x1: 'w*0.655', y1: 'h*0.875', x: 'w*0.597', y: 'h*0.875' },
          { action: 'line', x: 'w*0.40325', y: 'h*0.875' },
          { action: 'quadraticCurve', x1: 'w*0.345', y1: 'h*0.875', x: 'w*0.345', y: 'h*0.80175' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.42', y: 'h*0.224' },
        { action: 'line', x: 'w*0.58', y: 'h*0.224' },
        { action: 'line', x: 'w*0.58', y: 'h*0.156' },
        { action: 'line', x: 'w*0.42', y: 'h*0.156' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.44', y: 'h*0.78' },
          { action: 'curve', x1: 'w*0.44', y1: 'h*0.7', x2: 'w*0.56', y2: 'h*0.7', x: 'w*0.56', y: 'h*0.78' },
          { action: 'curve', x1: 'w*0.56', y1: 'h*0.86', x2: 'w*0.44', y2: 'h*0.86', x: 'w*0.44', y: 'h*0.78' },
          { action: 'close' },
          { action: 'move', x: 'w*0.491', y: 'h*0.78' },
          {
            action: 'curve',
            x1: 'w*0.491',
            y1: 'h*0.768',
            x2: 'w*0.509',
            y2: 'h*0.768',
            x: 'w*0.509',
            y: 'h*0.78'
          },
          {
            action: 'curve',
            x1: 'w*0.509',
            y1: 'h*0.792',
            x2: 'w*0.491',
            y2: 'h*0.792',
            x: 'w*0.491',
            y: 'h*0.78'
          },
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
  /** 快进（29×29） */
  {
    name: 'andriod_icons_52',
    title: '快进',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.12', y: 'h*0.18' },
        { action: 'line', x: 'w*0.12', y: 'h*0.82' },
        { action: 'line', x: 'w*0.64475', y: 'h*0.5' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.52', y: 'h*0.18' },
        { action: 'line', x: 'w*0.52', y: 'h*0.82' },
        { action: 'line', x: 'w*1.04475', y: 'h*0.5' },
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
  /** 下一曲（29×29） */
  {
    name: 'andriod_icons_53',
    title: '下一曲',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.14', y: 'h*0.18' },
        { action: 'line', x: 'w*0.14', y: 'h*0.82' },
        { action: 'line', x: 'w*0.66475', y: 'h*0.5' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.46', y: 'h*0.18' },
        { action: 'line', x: 'w*0.46', y: 'h*0.82' },
        { action: 'line', x: 'w*0.98475', y: 'h*0.5' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.78', y: 'h*0.18' },
        { action: 'line', x: 'w*0.88', y: 'h*0.18' },
        { action: 'line', x: 'w*0.88', y: 'h*0.82' },
        { action: 'line', x: 'w*0.78', y: 'h*0.82' },
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
  /** 暂停（29×29） */
  {
    name: 'andriod_icons_54',
    title: '暂停',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.26', y: 'h*0.14' },
        { action: 'line', x: 'w*0.46', y: 'h*0.14' },
        { action: 'line', x: 'w*0.46', y: 'h*0.86' },
        { action: 'line', x: 'w*0.26', y: 'h*0.86' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.54', y: 'h*0.14' },
        { action: 'line', x: 'w*0.74', y: 'h*0.14' },
        { action: 'line', x: 'w*0.74', y: 'h*0.86' },
        { action: 'line', x: 'w*0.54', y: 'h*0.86' },
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
  /** 播放（29×29） */
  {
    name: 'andriod_icons_55',
    title: '播放',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.24', y: 'h*0.14' },
        { action: 'line', x: 'w*0.24', y: 'h*0.86' },
        { action: 'line', x: 'w*0.8305', y: 'h*0.5' },
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
  /** 快退（29×29） */
  {
    name: 'andriod_icons_56',
    title: '快退',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.88', y: 'h*0.18' },
        { action: 'line', x: 'w*0.88', y: 'h*0.82' },
        { action: 'line', x: 'w*0.35525', y: 'h*0.5' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.48', y: 'h*0.18' },
        { action: 'line', x: 'w*0.48', y: 'h*0.82' },
        { action: 'line', x: 'w*-0.04475', y: 'h*0.5' },
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
  /** 循环播放（29×29） */
  {
    name: 'andriod_icons_57',
    title: '循环播放',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.14', y: 'h*0.41' },
        { action: 'line', x: 'w*0.7', y: 'h*0.41' },
        { action: 'line', x: 'w*0.7', y: 'h*0.31' },
        { action: 'line', x: 'w*0.14', y: 'h*0.31' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.62', y: 'h*0.16' },
        { action: 'line', x: 'w*0.92', y: 'h*0.36' },
        { action: 'line', x: 'w*0.62', y: 'h*0.56' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.86', y: 'h*0.59' },
        { action: 'line', x: 'w*0.3', y: 'h*0.59' },
        { action: 'line', x: 'w*0.3', y: 'h*0.69' },
        { action: 'line', x: 'w*0.86', y: 'h*0.69' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.38', y: 'h*0.44' },
        { action: 'line', x: 'w*0.08', y: 'h*0.64' },
        { action: 'line', x: 'w*0.38', y: 'h*0.84' },
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
  /** 上一曲（29×29） */
  {
    name: 'andriod_icons_58',
    title: '上一曲',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.14', y: 'h*0.18' },
        { action: 'line', x: 'w*0.24', y: 'h*0.18' },
        { action: 'line', x: 'w*0.24', y: 'h*0.82' },
        { action: 'line', x: 'w*0.14', y: 'h*0.82' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.86', y: 'h*0.18' },
        { action: 'line', x: 'w*0.86', y: 'h*0.82' },
        { action: 'line', x: 'w*0.33525', y: 'h*0.5' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.54', y: 'h*0.18' },
        { action: 'line', x: 'w*0.54', y: 'h*0.82' },
        { action: 'line', x: 'w*0.01525', y: 'h*0.5' },
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
  /** 停止（29×29） */
  {
    name: 'andriod_icons_59',
    title: '停止',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.22', y: 'h*0.22' },
        { action: 'line', x: 'w*0.78', y: 'h*0.22' },
        { action: 'line', x: 'w*0.78', y: 'h*0.78' },
        { action: 'line', x: 'w*0.22', y: 'h*0.78' },
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
  /** 保存（29×29） */
  {
    name: 'andriod_icons_60',
    title: '保存',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.08', y: 'h*0.06' },
          { action: 'line', x: 'w*0.78', y: 'h*0.06' },
          { action: 'line', x: 'w*0.94', y: 'h*0.22' },
          { action: 'line', x: 'w*0.94', y: 'h*0.94' },
          { action: 'line', x: 'w*0.08', y: 'h*0.94' },
          { action: 'close' },
          { action: 'move', x: 'w*0.26', y: 'h*0.1' },
          { action: 'line', x: 'w*0.66', y: 'h*0.1' },
          { action: 'line', x: 'w*0.66', y: 'h*0.32' },
          { action: 'line', x: 'w*0.26', y: 'h*0.32' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.44', y: 'h*0.12' },
        { action: 'line', x: 'w*0.54', y: 'h*0.12' },
        { action: 'line', x: 'w*0.54', y: 'h*0.3' },
        { action: 'line', x: 'w*0.44', y: 'h*0.3' },
        { action: 'close' }
      ],
      {
        actions: [
          { action: 'move', x: 'w*0.22', y: 'h*0.54' },
          { action: 'quadraticCurve', x1: 'w*0.22', y1: 'h*0.52', x: 'w*0.24', y: 'h*0.52' },
          { action: 'line', x: 'w*0.76', y: 'h*0.52' },
          { action: 'quadraticCurve', x1: 'w*0.78', y1: 'h*0.52', x: 'w*0.78', y: 'h*0.54' },
          { action: 'line', x: 'w*0.78', y: 'h*0.84' },
          { action: 'quadraticCurve', x1: 'w*0.78', y1: 'h*0.86', x: 'w*0.76', y: 'h*0.86' },
          { action: 'line', x: 'w*0.24', y: 'h*0.86' },
          { action: 'quadraticCurve', x1: 'w*0.22', y1: 'h*0.86', x: 'w*0.22', y: 'h*0.84' },
          { action: 'close' },
          { action: 'move', x: 'w*0.29', y: 'h*0.60175' },
          { action: 'quadraticCurve', x1: 'w*0.29', y1: 'h*0.59', x: 'w*0.305', y: 'h*0.59' },
          { action: 'line', x: 'w*0.695', y: 'h*0.59' },
          { action: 'quadraticCurve', x1: 'w*0.71', y1: 'h*0.59', x: 'w*0.71', y: 'h*0.60175' },
          { action: 'line', x: 'w*0.71', y: 'h*0.77825' },
          { action: 'quadraticCurve', x1: 'w*0.71', y1: 'h*0.79', x: 'w*0.695', y: 'h*0.79' },
          { action: 'line', x: 'w*0.305', y: 'h*0.79' },
          { action: 'quadraticCurve', x1: 'w*0.29', y1: 'h*0.79', x: 'w*0.29', y: 'h*0.77825' },
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
  /** 搜索（29×29） */
  {
    name: 'andriod_icons_61',
    title: '搜索',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
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
        { action: 'move', x: 'w*0.493', y: 'h*0.599' },
        { action: 'line', x: 'w*0.897', y: 'h*1.003' },
        { action: 'line', x: 'w*1.003', y: 'h*0.897' },
        { action: 'line', x: 'w*0.599', y: 'h*0.493' },
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
  /** 分享（29×29） */
  {
    name: 'andriod_icons_62',
    title: '分享',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.239', y: 'h*0.53525' },
        { action: 'line', x: 'w*0.761', y: 'h*0.23525' },
        { action: 'line', x: 'w*0.761', y: 'h*0.76475' },
        { action: 'line', x: 'w*0.239', y: 'h*0.46475' },
        { action: 'line', x: 'w*0.201', y: 'h*0.53525' },
        { action: 'line', x: 'w*0.799', y: 'h*0.83525' },
        { action: 'line', x: 'w*0.799', y: 'h*0.16475' },
        { action: 'line', x: 'w*0.201', y: 'h*0.46475' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.11', y: 'h*0.5' },
        {
          action: 'curve',
          x1: 'w*0.11',
          y1: 'h*0.353333',
          x2: 'w*0.33',
          y2: 'h*0.353333',
          x: 'w*0.33',
          y: 'h*0.5'
        },
        {
          action: 'curve',
          x1: 'w*0.33',
          y1: 'h*0.646667',
          x2: 'w*0.11',
          y2: 'h*0.646667',
          x: 'w*0.11',
          y: 'h*0.5'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.67', y: 'h*0.2' },
        {
          action: 'curve',
          x1: 'w*0.67',
          y1: 'h*0.053333',
          x2: 'w*0.89',
          y2: 'h*0.053333',
          x: 'w*0.89',
          y: 'h*0.2'
        },
        {
          action: 'curve',
          x1: 'w*0.89',
          y1: 'h*0.346667',
          x2: 'w*0.67',
          y2: 'h*0.346667',
          x: 'w*0.67',
          y: 'h*0.2'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.67', y: 'h*0.8' },
        {
          action: 'curve',
          x1: 'w*0.67',
          y1: 'h*0.653333',
          x2: 'w*0.89',
          y2: 'h*0.653333',
          x: 'w*0.89',
          y: 'h*0.8'
        },
        {
          action: 'curve',
          x1: 'w*0.89',
          y1: 'h*0.946667',
          x2: 'w*0.67',
          y2: 'h*0.946667',
          x: 'w*0.67',
          y: 'h*0.8'
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
  /** 字母排序（29×29） */
  {
    name: 'andriod_icons_63',
    title: '字母排序',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.1365', y: 'h*0.2495' },
        { action: 'line', x: 'w*-0.0135', y: 'h*0.7295' },
        { action: 'line', x: 'w*0.0535', y: 'h*0.7505' },
        { action: 'line', x: 'w*0.2035', y: 'h*0.2705' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.1365', y: 'h*0.2705' },
        { action: 'line', x: 'w*0.2865', y: 'h*0.7505' },
        { action: 'line', x: 'w*0.3535', y: 'h*0.7295' },
        { action: 'line', x: 'w*0.2035', y: 'h*0.2495' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.08', y: 'h*0.5288' },
        { action: 'line', x: 'w*0.26', y: 'h*0.5288' },
        { action: 'line', x: 'w*0.26', y: 'h*0.5848' },
        { action: 'line', x: 'w*0.08', y: 'h*0.5848' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.38', y: 'h*0.535' },
        { action: 'line', x: 'w*0.54', y: 'h*0.535' },
        { action: 'line', x: 'w*0.54', y: 'h*0.465' },
        { action: 'line', x: 'w*0.38', y: 'h*0.465' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.52', y: 'h*0.36' },
        { action: 'line', x: 'w*0.64', y: 'h*0.5' },
        { action: 'line', x: 'w*0.52', y: 'h*0.64' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.7', y: 'h*0.26' },
        { action: 'line', x: 'w*0.98', y: 'h*0.26' },
        { action: 'line', x: 'w*0.98', y: 'h*0.33' },
        { action: 'line', x: 'w*0.7', y: 'h*0.33' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.92925', y: 'h*0.26325' },
        { action: 'line', x: 'w*0.68925', y: 'h*0.70325' },
        { action: 'line', x: 'w*0.75075', y: 'h*0.73675' },
        { action: 'line', x: 'w*0.99075', y: 'h*0.29675' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.7', y: 'h*0.74' },
        { action: 'line', x: 'w*0.98', y: 'h*0.74' },
        { action: 'line', x: 'w*0.98', y: 'h*0.81' },
        { action: 'line', x: 'w*0.7', y: 'h*0.81' },
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
  /** 收藏（描边）（29×29） */
  {
    name: 'andriod_icons_64',
    title: '收藏（描边）',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.5', y: 'h*0.06' },
          { action: 'line', x: 'w*0.6185', y: 'h*0.377' },
          { action: 'line', x: 'w*0.9565', y: 'h*0.39175' },
          { action: 'line', x: 'w*0.69175', y: 'h*0.60225' },
          { action: 'line', x: 'w*0.78225', y: 'h*0.92825' },
          { action: 'line', x: 'w*0.5', y: 'h*0.7415' },
          { action: 'line', x: 'w*0.21775', y: 'h*0.92825' },
          { action: 'line', x: 'w*0.30825', y: 'h*0.60225' },
          { action: 'line', x: 'w*0.0435', y: 'h*0.39175' },
          { action: 'line', x: 'w*0.3815', y: 'h*0.377' },
          { action: 'close' },
          { action: 'move', x: 'w*0.5', y: 'h*0.15' },
          { action: 'line', x: 'w*0.59625', y: 'h*0.4075' },
          { action: 'line', x: 'w*0.871', y: 'h*0.4195' },
          { action: 'line', x: 'w*0.65575', y: 'h*0.5905' },
          { action: 'line', x: 'w*0.72925', y: 'h*0.8555' },
          { action: 'line', x: 'w*0.5', y: 'h*0.70375' },
          { action: 'line', x: 'w*0.27075', y: 'h*0.8555' },
          { action: 'line', x: 'w*0.34425', y: 'h*0.5905' },
          { action: 'line', x: 'w*0.129', y: 'h*0.4195' },
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
  /** 收藏（29×29） */
  {
    name: 'andriod_icons_65',
    title: '收藏',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.5', y: 'h*0.04' },
        { action: 'line', x: 'w*0.6235', y: 'h*0.37' },
        { action: 'line', x: 'w*0.9755', y: 'h*0.3855' },
        { action: 'line', x: 'w*0.69975', y: 'h*0.605' },
        { action: 'line', x: 'w*0.794', y: 'h*0.9445' },
        { action: 'line', x: 'w*0.5', y: 'h*0.75' },
        { action: 'line', x: 'w*0.206', y: 'h*0.9445' },
        { action: 'line', x: 'w*0.30025', y: 'h*0.605' },
        { action: 'line', x: 'w*0.0245', y: 'h*0.3855' },
        { action: 'line', x: 'w*0.3765', y: 'h*0.37' },
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
  /** 编辑（29×29） */
  {
    name: 'andriod_icons_66',
    title: '编辑',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.3', y: 'h*0.64' },
        { action: 'line', x: 'w*0.64', y: 'h*0.3' },
        { action: 'line', x: 'w*0.8', y: 'h*0.46' },
        { action: 'line', x: 'w*0.46', y: 'h*0.8' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.3', y: 'h*0.64' },
        { action: 'line', x: 'w*0.2', y: 'h*0.88' },
        { action: 'line', x: 'w*0.46', y: 'h*0.8' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.64', y: 'h*0.3' },
        { action: 'line', x: 'w*0.72', y: 'h*0.12' },
        { action: 'line', x: 'w*0.92', y: 'h*0.32' },
        { action: 'line', x: 'w*0.8', y: 'h*0.46' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.06', y: 'h*0.98' },
        { action: 'line', x: 'w*0.44', y: 'h*0.98' },
        { action: 'line', x: 'w*0.44', y: 'h*0.9' },
        { action: 'line', x: 'w*0.06', y: 'h*0.9' },
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
  /** 对勾（29×29） */
  {
    name: 'andriod_icons_67',
    title: '对勾',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.0215', y: 'h*0.6145' },
        { action: 'line', x: 'w*0.395', y: 'h*0.932' },
        { action: 'line', x: 'w*1.00225', y: 'h*0.19025' },
        { action: 'line', x: 'w*0.87775', y: 'h*0.08975' },
        { action: 'line', x: 'w*0.325', y: 'h*0.788' },
        { action: 'line', x: 'w*0.1385', y: 'h*0.5055' },
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
  /** 九宫格（29×29） */
  {
    name: 'andriod_icons_68',
    title: '九宫格',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.02', y: 'h*0.04' },
        { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.02', x: 'w*0.04', y: 'h*0.02' },
        { action: 'line', x: 'w*0.27', y: 'h*0.02' },
        { action: 'quadraticCurve', x1: 'w*0.29', y1: 'h*0.02', x: 'w*0.29', y: 'h*0.04' },
        { action: 'line', x: 'w*0.29', y: 'h*0.27' },
        { action: 'quadraticCurve', x1: 'w*0.29', y1: 'h*0.29', x: 'w*0.27', y: 'h*0.29' },
        { action: 'line', x: 'w*0.04', y: 'h*0.29' },
        { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.29', x: 'w*0.02', y: 'h*0.27' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.365', y: 'h*0.04' },
        { action: 'quadraticCurve', x1: 'w*0.365', y1: 'h*0.02', x: 'w*0.385', y: 'h*0.02' },
        { action: 'line', x: 'w*0.615', y: 'h*0.02' },
        { action: 'quadraticCurve', x1: 'w*0.635', y1: 'h*0.02', x: 'w*0.635', y: 'h*0.04' },
        { action: 'line', x: 'w*0.635', y: 'h*0.27' },
        { action: 'quadraticCurve', x1: 'w*0.635', y1: 'h*0.29', x: 'w*0.615', y: 'h*0.29' },
        { action: 'line', x: 'w*0.385', y: 'h*0.29' },
        { action: 'quadraticCurve', x1: 'w*0.365', y1: 'h*0.29', x: 'w*0.365', y: 'h*0.27' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.71', y: 'h*0.04' },
        { action: 'quadraticCurve', x1: 'w*0.71', y1: 'h*0.02', x: 'w*0.73', y: 'h*0.02' },
        { action: 'line', x: 'w*0.96', y: 'h*0.02' },
        { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.02', x: 'w*0.98', y: 'h*0.04' },
        { action: 'line', x: 'w*0.98', y: 'h*0.27' },
        { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.29', x: 'w*0.96', y: 'h*0.29' },
        { action: 'line', x: 'w*0.73', y: 'h*0.29' },
        { action: 'quadraticCurve', x1: 'w*0.71', y1: 'h*0.29', x: 'w*0.71', y: 'h*0.27' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.02', y: 'h*0.385' },
        { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.365', x: 'w*0.04', y: 'h*0.365' },
        { action: 'line', x: 'w*0.27', y: 'h*0.365' },
        { action: 'quadraticCurve', x1: 'w*0.29', y1: 'h*0.365', x: 'w*0.29', y: 'h*0.385' },
        { action: 'line', x: 'w*0.29', y: 'h*0.615' },
        { action: 'quadraticCurve', x1: 'w*0.29', y1: 'h*0.635', x: 'w*0.27', y: 'h*0.635' },
        { action: 'line', x: 'w*0.04', y: 'h*0.635' },
        { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.635', x: 'w*0.02', y: 'h*0.615' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.365', y: 'h*0.385' },
        { action: 'quadraticCurve', x1: 'w*0.365', y1: 'h*0.365', x: 'w*0.385', y: 'h*0.365' },
        { action: 'line', x: 'w*0.615', y: 'h*0.365' },
        { action: 'quadraticCurve', x1: 'w*0.635', y1: 'h*0.365', x: 'w*0.635', y: 'h*0.385' },
        { action: 'line', x: 'w*0.635', y: 'h*0.615' },
        { action: 'quadraticCurve', x1: 'w*0.635', y1: 'h*0.635', x: 'w*0.615', y: 'h*0.635' },
        { action: 'line', x: 'w*0.385', y: 'h*0.635' },
        { action: 'quadraticCurve', x1: 'w*0.365', y1: 'h*0.635', x: 'w*0.365', y: 'h*0.615' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.71', y: 'h*0.385' },
        { action: 'quadraticCurve', x1: 'w*0.71', y1: 'h*0.365', x: 'w*0.73', y: 'h*0.365' },
        { action: 'line', x: 'w*0.96', y: 'h*0.365' },
        { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.365', x: 'w*0.98', y: 'h*0.385' },
        { action: 'line', x: 'w*0.98', y: 'h*0.615' },
        { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.635', x: 'w*0.96', y: 'h*0.635' },
        { action: 'line', x: 'w*0.73', y: 'h*0.635' },
        { action: 'quadraticCurve', x1: 'w*0.71', y1: 'h*0.635', x: 'w*0.71', y: 'h*0.615' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.02', y: 'h*0.73' },
        { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.71', x: 'w*0.04', y: 'h*0.71' },
        { action: 'line', x: 'w*0.27', y: 'h*0.71' },
        { action: 'quadraticCurve', x1: 'w*0.29', y1: 'h*0.71', x: 'w*0.29', y: 'h*0.73' },
        { action: 'line', x: 'w*0.29', y: 'h*0.96' },
        { action: 'quadraticCurve', x1: 'w*0.29', y1: 'h*0.98', x: 'w*0.27', y: 'h*0.98' },
        { action: 'line', x: 'w*0.04', y: 'h*0.98' },
        { action: 'quadraticCurve', x1: 'w*0.02', y1: 'h*0.98', x: 'w*0.02', y: 'h*0.96' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.365', y: 'h*0.73' },
        { action: 'quadraticCurve', x1: 'w*0.365', y1: 'h*0.71', x: 'w*0.385', y: 'h*0.71' },
        { action: 'line', x: 'w*0.615', y: 'h*0.71' },
        { action: 'quadraticCurve', x1: 'w*0.635', y1: 'h*0.71', x: 'w*0.635', y: 'h*0.73' },
        { action: 'line', x: 'w*0.635', y: 'h*0.96' },
        { action: 'quadraticCurve', x1: 'w*0.635', y1: 'h*0.98', x: 'w*0.615', y: 'h*0.98' },
        { action: 'line', x: 'w*0.385', y: 'h*0.98' },
        { action: 'quadraticCurve', x1: 'w*0.365', y1: 'h*0.98', x: 'w*0.365', y: 'h*0.96' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.71', y: 'h*0.73' },
        { action: 'quadraticCurve', x1: 'w*0.71', y1: 'h*0.71', x: 'w*0.73', y: 'h*0.71' },
        { action: 'line', x: 'w*0.96', y: 'h*0.71' },
        { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.71', x: 'w*0.98', y: 'h*0.73' },
        { action: 'line', x: 'w*0.98', y: 'h*0.96' },
        { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.98', x: 'w*0.96', y: 'h*0.98' },
        { action: 'line', x: 'w*0.73', y: 'h*0.98' },
        { action: 'quadraticCurve', x1: 'w*0.71', y1: 'h*0.98', x: 'w*0.71', y: 'h*0.96' },
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
  /** 四宫格（29×29） */
  {
    name: 'andriod_icons_69',
    title: '四宫格',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.06', y: 'h*0.09' },
        { action: 'quadraticCurve', x1: 'w*0.06', y1: 'h*0.06', x: 'w*0.09', y: 'h*0.06' },
        { action: 'line', x: 'w*0.43', y: 'h*0.06' },
        { action: 'quadraticCurve', x1: 'w*0.46', y1: 'h*0.06', x: 'w*0.46', y: 'h*0.09' },
        { action: 'line', x: 'w*0.46', y: 'h*0.43' },
        { action: 'quadraticCurve', x1: 'w*0.46', y1: 'h*0.46', x: 'w*0.43', y: 'h*0.46' },
        { action: 'line', x: 'w*0.09', y: 'h*0.46' },
        { action: 'quadraticCurve', x1: 'w*0.06', y1: 'h*0.46', x: 'w*0.06', y: 'h*0.43' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.54', y: 'h*0.09' },
        { action: 'quadraticCurve', x1: 'w*0.54', y1: 'h*0.06', x: 'w*0.57', y: 'h*0.06' },
        { action: 'line', x: 'w*0.91', y: 'h*0.06' },
        { action: 'quadraticCurve', x1: 'w*0.94', y1: 'h*0.06', x: 'w*0.94', y: 'h*0.09' },
        { action: 'line', x: 'w*0.94', y: 'h*0.43' },
        { action: 'quadraticCurve', x1: 'w*0.94', y1: 'h*0.46', x: 'w*0.91', y: 'h*0.46' },
        { action: 'line', x: 'w*0.57', y: 'h*0.46' },
        { action: 'quadraticCurve', x1: 'w*0.54', y1: 'h*0.46', x: 'w*0.54', y: 'h*0.43' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.06', y: 'h*0.57' },
        { action: 'quadraticCurve', x1: 'w*0.06', y1: 'h*0.54', x: 'w*0.09', y: 'h*0.54' },
        { action: 'line', x: 'w*0.43', y: 'h*0.54' },
        { action: 'quadraticCurve', x1: 'w*0.46', y1: 'h*0.54', x: 'w*0.46', y: 'h*0.57' },
        { action: 'line', x: 'w*0.46', y: 'h*0.91' },
        { action: 'quadraticCurve', x1: 'w*0.46', y1: 'h*0.94', x: 'w*0.43', y: 'h*0.94' },
        { action: 'line', x: 'w*0.09', y: 'h*0.94' },
        { action: 'quadraticCurve', x1: 'w*0.06', y1: 'h*0.94', x: 'w*0.06', y: 'h*0.91' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.54', y: 'h*0.57' },
        { action: 'quadraticCurve', x1: 'w*0.54', y1: 'h*0.54', x: 'w*0.57', y: 'h*0.54' },
        { action: 'line', x: 'w*0.91', y: 'h*0.54' },
        { action: 'quadraticCurve', x1: 'w*0.94', y1: 'h*0.54', x: 'w*0.94', y: 'h*0.57' },
        { action: 'line', x: 'w*0.94', y: 'h*0.91' },
        { action: 'quadraticCurve', x1: 'w*0.94', y1: 'h*0.94', x: 'w*0.91', y: 'h*0.94' },
        { action: 'line', x: 'w*0.57', y: 'h*0.94' },
        { action: 'quadraticCurve', x1: 'w*0.54', y1: 'h*0.94', x: 'w*0.54', y: 'h*0.91' },
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
  /** T 恤（29×29） */
  {
    name: 'andriod_icons_70',
    title: 'T 恤',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.3', y: 'h*0.1' },
        { action: 'line', x: 'w*0.44', y: 'h*0.04' },
        { action: 'line', x: 'w*0.56', y: 'h*0.14' },
        { action: 'line', x: 'w*0.72', y: 'h*0.12' },
        { action: 'line', x: 'w*0.96', y: 'h*0.3' },
        { action: 'line', x: 'w*0.8', y: 'h*0.46' },
        { action: 'line', x: 'w*0.72', y: 'h*0.4' },
        { action: 'line', x: 'w*0.72', y: 'h*0.94' },
        { action: 'line', x: 'w*0.28', y: 'h*0.94' },
        { action: 'line', x: 'w*0.28', y: 'h*0.4' },
        { action: 'line', x: 'w*0.2', y: 'h*0.46' },
        { action: 'line', x: 'w*0.04', y: 'h*0.3' },
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
  /** 刷新（29×29） */
  {
    name: 'andriod_icons_71',
    title: '刷新',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.36', y: 'h*0.85325' },
        { action: 'line', x: 'w*0.27925', y: 'h*0.80925' },
        { action: 'line', x: 'w*0.2115', y: 'h*0.74725' },
        { action: 'line', x: 'w*0.1605', y: 'h*0.6705' },
        { action: 'line', x: 'w*0.1295', y: 'h*0.584' },
        { action: 'line', x: 'w*0.12', y: 'h*0.4925' },
        { action: 'line', x: 'w*0.133', y: 'h*0.40125' },
        { action: 'line', x: 'w*0.1675', y: 'h*0.316' },
        { action: 'line', x: 'w*0.2215', y: 'h*0.2415' },
        { action: 'line', x: 'w*0.29175', y: 'h*0.182' },
        { action: 'line', x: 'w*0.37425', y: 'h*0.1415' },
        { action: 'line', x: 'w*0.46425', y: 'h*0.12175' },
        { action: 'line', x: 'w*0.55625', y: 'h*0.12425' },
        { action: 'line', x: 'w*0.645', y: 'h*0.14875' },
        { action: 'line', x: 'w*0.725', y: 'h*0.19375' },
        { action: 'line', x: 'w*0.792', y: 'h*0.257' },
        { action: 'line', x: 'w*0.842', y: 'h*0.33425' },
        { action: 'line', x: 'w*0.87175', y: 'h*0.42125' },
        { action: 'line', x: 'w*0.87975', y: 'h*0.513' },
        { action: 'line', x: 'w*0.8655', y: 'h*0.604' },
        { action: 'line', x: 'w*0.82975', y: 'h*0.68875' },
        { action: 'line', x: 'w*0.77475', y: 'h*0.7625' },
        { action: 'line', x: 'w*0.7035', y: 'h*0.82075' },
        { action: 'line', x: 'w*0.65', y: 'h*0.7365' },
        { action: 'line', x: 'w*0.7025', y: 'h*0.6935' },
        { action: 'line', x: 'w*0.743', y: 'h*0.639' },
        { action: 'line', x: 'w*0.76925', y: 'h*0.5765' },
        { action: 'line', x: 'w*0.77975', y: 'h*0.5095' },
        { action: 'line', x: 'w*0.774', y: 'h*0.442' },
        { action: 'line', x: 'w*0.752', y: 'h*0.378' },
        { action: 'line', x: 'w*0.71525', y: 'h*0.321' },
        { action: 'line', x: 'w*0.66575', y: 'h*0.2745' },
        { action: 'line', x: 'w*0.60675', y: 'h*0.24125' },
        { action: 'line', x: 'w*0.5415', y: 'h*0.223' },
        { action: 'line', x: 'w*0.47375', y: 'h*0.22125' },
        { action: 'line', x: 'w*0.4075', y: 'h*0.23575' },
        { action: 'line', x: 'w*0.3465', y: 'h*0.26575' },
        { action: 'line', x: 'w*0.29475', y: 'h*0.3095' },
        { action: 'line', x: 'w*0.255', y: 'h*0.3645' },
        { action: 'line', x: 'w*0.2295', y: 'h*0.42725' },
        { action: 'line', x: 'w*0.22', y: 'h*0.4945' },
        { action: 'line', x: 'w*0.227', y: 'h*0.56175' },
        { action: 'line', x: 'w*0.24975', y: 'h*0.62575' },
        { action: 'line', x: 'w*0.28725', y: 'h*0.68225' },
        { action: 'line', x: 'w*0.33725', y: 'h*0.728' },
        { action: 'line', x: 'w*0.397', y: 'h*0.76025' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.519', y: 'h*0.91625' },
        { action: 'line', x: 'w*0.381', y: 'h*0.739' },
        { action: 'line', x: 'w*0.297', y: 'h*0.951' },
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
  /** 撤回（29×29） */
  {
    name: 'andriod_icons_72',
    title: '撤回',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.16', y: 'h*0.35' },
        { action: 'line', x: 'w*0.62', y: 'h*0.35' },
        { action: 'line', x: 'w*0.62', y: 'h*0.25' },
        { action: 'line', x: 'w*0.16', y: 'h*0.25' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.3', y: 'h*0.08' },
        { action: 'line', x: 'w*0.06', y: 'h*0.3' },
        { action: 'line', x: 'w*0.3', y: 'h*0.52' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.59375', y: 'h*0.3425' },
        { action: 'line', x: 'w*0.83', y: 'h*0.46325' },
        { action: 'line', x: 'w*0.61525', y: 'h*0.87775' },
        { action: 'line', x: 'w*0.70475', y: 'h*0.92225' },
        { action: 'line', x: 'w*0.93', y: 'h*0.45675' },
        { action: 'line', x: 'w*0.64625', y: 'h*0.2575' },
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
  /** 用户（29×29） */
  {
    name: 'andriod_icons_73',
    title: '用户',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
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
    lineStyle: { lineWidth: 0, lineColor: '51,51,51' },
    fillStyle: { type: 'solid', color: '51,51,51' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 用户组（29×29） */
  {
    name: 'andriod_icons_74',
    title: '用户组',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.04', y: 'h*0.35' },
        { action: 'curve', x1: 'w*0.04', y1: 'h*0.23', x2: 'w*0.22', y2: 'h*0.23', x: 'w*0.22', y: 'h*0.35' },
        { action: 'curve', x1: 'w*0.22', y1: 'h*0.47', x2: 'w*0.04', y2: 'h*0.47', x: 'w*0.04', y: 'h*0.35' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.02', y: 'h*0.74' },
        { action: 'line', x: 'w*0.04', y: 'h*0.5' },
        { action: 'line', x: 'w*0.22', y: 'h*0.48' },
        { action: 'line', x: 'w*0.26', y: 'h*0.74' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.74', y: 'h*0.35' },
        { action: 'curve', x1: 'w*0.74', y1: 'h*0.23', x2: 'w*0.92', y2: 'h*0.23', x: 'w*0.92', y: 'h*0.35' },
        { action: 'curve', x1: 'w*0.92', y1: 'h*0.47', x2: 'w*0.74', y2: 'h*0.47', x: 'w*0.74', y: 'h*0.35' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.72', y: 'h*0.74' },
        { action: 'line', x: 'w*0.7', y: 'h*0.5' },
        { action: 'line', x: 'w*0.92', y: 'h*0.48' },
        { action: 'line', x: 'w*0.96', y: 'h*0.74' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.34', y: 'h*0.28' },
        {
          action: 'curve',
          x1: 'w*0.34',
          y1: 'h*0.066667',
          x2: 'w*0.66',
          y2: 'h*0.066667',
          x: 'w*0.66',
          y: 'h*0.28'
        },
        {
          action: 'curve',
          x1: 'w*0.66',
          y1: 'h*0.493333',
          x2: 'w*0.34',
          y2: 'h*0.493333',
          x: 'w*0.34',
          y: 'h*0.28'
        },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.2', y: 'h*0.9' },
        { action: 'line', x: 'w*0.24', y: 'h*0.54' },
        { action: 'line', x: 'w*0.5', y: 'h*0.5' },
        { action: 'line', x: 'w*0.76', y: 'h*0.54' },
        { action: 'line', x: 'w*0.8', y: 'h*0.9' },
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
  /** 摄像机（29×29） */
  {
    name: 'andriod_icons_75',
    title: '摄像机',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.04', y: 'h*0.32' },
        { action: 'quadraticCurve', x1: 'w*0.04', y1: 'h*0.24', x: 'w*0.12', y: 'h*0.24' },
        { action: 'line', x: 'w*0.56', y: 'h*0.24' },
        { action: 'quadraticCurve', x1: 'w*0.64', y1: 'h*0.24', x: 'w*0.64', y: 'h*0.32' },
        { action: 'line', x: 'w*0.64', y: 'h*0.68' },
        { action: 'quadraticCurve', x1: 'w*0.64', y1: 'h*0.76', x: 'w*0.56', y: 'h*0.76' },
        { action: 'line', x: 'w*0.12', y: 'h*0.76' },
        { action: 'quadraticCurve', x1: 'w*0.04', y1: 'h*0.76', x: 'w*0.04', y: 'h*0.68' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.68', y: 'h*0.4' },
        { action: 'line', x: 'w*0.96', y: 'h*0.22' },
        { action: 'line', x: 'w*0.96', y: 'h*0.78' },
        { action: 'line', x: 'w*0.68', y: 'h*0.6' },
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
  /** 音量（29×29） */
  {
    name: 'andriod_icons_76',
    title: '音量',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.04', y: 'h*0.38' },
        { action: 'line', x: 'w*0.24', y: 'h*0.38' },
        { action: 'line', x: 'w*0.44', y: 'h*0.14' },
        { action: 'line', x: 'w*0.44', y: 'h*0.86' },
        { action: 'line', x: 'w*0.24', y: 'h*0.62' },
        { action: 'line', x: 'w*0.04', y: 'h*0.62' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.65125', y: 'h*0.26875' },
        { action: 'line', x: 'w*0.68875', y: 'h*0.306' },
        { action: 'line', x: 'w*0.71925', y: 'h*0.349' },
        { action: 'line', x: 'w*0.7415', y: 'h*0.3965' },
        { action: 'line', x: 'w*0.75525', y: 'h*0.4475' },
        { action: 'line', x: 'w*0.76', y: 'h*0.5' },
        { action: 'line', x: 'w*0.75525', y: 'h*0.5525' },
        { action: 'line', x: 'w*0.7415', y: 'h*0.6035' },
        { action: 'line', x: 'w*0.71925', y: 'h*0.651' },
        { action: 'line', x: 'w*0.68875', y: 'h*0.694' },
        { action: 'line', x: 'w*0.65125', y: 'h*0.73125' },
        { action: 'line', x: 'w*0.60025', y: 'h*0.6695' },
        { action: 'line', x: 'w*0.62775', y: 'h*0.64225' },
        { action: 'line', x: 'w*0.65', y: 'h*0.61075' },
        { action: 'line', x: 'w*0.6665', y: 'h*0.57575' },
        { action: 'line', x: 'w*0.6765', y: 'h*0.5385' },
        { action: 'line', x: 'w*0.68', y: 'h*0.5' },
        { action: 'line', x: 'w*0.6765', y: 'h*0.4615' },
        { action: 'line', x: 'w*0.6665', y: 'h*0.42425' },
        { action: 'line', x: 'w*0.65', y: 'h*0.38925' },
        { action: 'line', x: 'w*0.62775', y: 'h*0.35775' },
        { action: 'line', x: 'w*0.60025', y: 'h*0.3305' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.75325', y: 'h*0.1455' },
        { action: 'line', x: 'w*0.80175', y: 'h*0.19225' },
        { action: 'line', x: 'w*0.84325', y: 'h*0.2455' },
        { action: 'line', x: 'w*0.87625', y: 'h*0.30425' },
        { action: 'line', x: 'w*0.90025', y: 'h*0.367' },
        { action: 'line', x: 'w*0.915', y: 'h*0.43275' },
        { action: 'line', x: 'w*0.92', y: 'h*0.5' },
        { action: 'line', x: 'w*0.915', y: 'h*0.56725' },
        { action: 'line', x: 'w*0.90025', y: 'h*0.633' },
        { action: 'line', x: 'w*0.87625', y: 'h*0.69575' },
        { action: 'line', x: 'w*0.84325', y: 'h*0.7545' },
        { action: 'line', x: 'w*0.80175', y: 'h*0.80775' },
        { action: 'line', x: 'w*0.75325', y: 'h*0.8545' },
        { action: 'line', x: 'w*0.70225', y: 'h*0.79275' },
        { action: 'line', x: 'w*0.7425', y: 'h*0.75425' },
        { action: 'line', x: 'w*0.7765', y: 'h*0.71025' },
        { action: 'line', x: 'w*0.80375', y: 'h*0.66175' },
        { action: 'line', x: 'w*0.82375', y: 'h*0.60975' },
        { action: 'line', x: 'w*0.836', y: 'h*0.5555' },
        { action: 'line', x: 'w*0.84', y: 'h*0.5' },
        { action: 'line', x: 'w*0.836', y: 'h*0.4445' },
        { action: 'line', x: 'w*0.82375', y: 'h*0.39025' },
        { action: 'line', x: 'w*0.80375', y: 'h*0.33825' },
        { action: 'line', x: 'w*0.7765', y: 'h*0.28975' },
        { action: 'line', x: 'w*0.7425', y: 'h*0.24575' },
        { action: 'line', x: 'w*0.70225', y: 'h*0.20725' },
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
  /** 无线网络（29×29） */
  {
    name: 'andriod_icons_77',
    title: '无线网络',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      [
        { action: 'move', x: 'w*0.144', y: 'h*0.64125' },
        { action: 'line', x: 'w*0.182', y: 'h*0.596' },
        { action: 'line', x: 'w*0.22575', y: 'h*0.556' },
        { action: 'line', x: 'w*0.27425', y: 'h*0.52225' },
        { action: 'line', x: 'w*0.327', y: 'h*0.4955' },
        { action: 'line', x: 'w*0.383', y: 'h*0.47575' },
        { action: 'line', x: 'w*0.441', y: 'h*0.464' },
        { action: 'line', x: 'w*0.5', y: 'h*0.46' },
        { action: 'line', x: 'w*0.559', y: 'h*0.464' },
        { action: 'line', x: 'w*0.617', y: 'h*0.47575' },
        { action: 'line', x: 'w*0.673', y: 'h*0.4955' },
        { action: 'line', x: 'w*0.72575', y: 'h*0.52225' },
        { action: 'line', x: 'w*0.77425', y: 'h*0.556' },
        { action: 'line', x: 'w*0.818', y: 'h*0.596' },
        { action: 'line', x: 'w*0.856', y: 'h*0.64125' },
        { action: 'line', x: 'w*0.775', y: 'h*0.70025' },
        { action: 'line', x: 'w*0.74575', y: 'h*0.665' },
        { action: 'line', x: 'w*0.712', y: 'h*0.63425' },
        { action: 'line', x: 'w*0.6745', y: 'h*0.60825' },
        { action: 'line', x: 'w*0.63375', y: 'h*0.58725' },
        { action: 'line', x: 'w*0.5905', y: 'h*0.57225' },
        { action: 'line', x: 'w*0.54575', y: 'h*0.563' },
        { action: 'line', x: 'w*0.5', y: 'h*0.56' },
        { action: 'line', x: 'w*0.45425', y: 'h*0.563' },
        { action: 'line', x: 'w*0.4095', y: 'h*0.57225' },
        { action: 'line', x: 'w*0.36625', y: 'h*0.58725' },
        { action: 'line', x: 'w*0.3255', y: 'h*0.60825' },
        { action: 'line', x: 'w*0.288', y: 'h*0.63425' },
        { action: 'line', x: 'w*0.25425', y: 'h*0.665' },
        { action: 'line', x: 'w*0.225', y: 'h*0.70025' },
        { action: 'close' }
      ],
      [
        { action: 'move', x: 'w*0.2505', y: 'h*0.773' },
        { action: 'line', x: 'w*0.27775', y: 'h*0.7295' },
        { action: 'line', x: 'w*0.31275', y: 'h*0.692' },
        { action: 'line', x: 'w*0.35375', y: 'h*0.66125' },
        { action: 'line', x: 'w*0.39975', y: 'h*0.6385' },
        { action: 'line', x: 'w*0.449', y: 'h*0.62475' },
        { action: 'line', x: 'w*0.5', y: 'h*0.62' },
        { action: 'line', x: 'w*0.551', y: 'h*0.62475' },
        { action: 'line', x: 'w*0.60025', y: 'h*0.6385' },
        { action: 'line', x: 'w*0.64625', y: 'h*0.66125' },
        { action: 'line', x: 'w*0.68725', y: 'h*0.692' },
        { action: 'line', x: 'w*0.72225', y: 'h*0.7295' },
        { action: 'line', x: 'w*0.7495', y: 'h*0.773' },
        { action: 'line', x: 'w*0.6605', y: 'h*0.81825' },
        { action: 'line', x: 'w*0.64275', y: 'h*0.7905' },
        { action: 'line', x: 'w*0.6205', y: 'h*0.76625' },
        { action: 'line', x: 'w*0.594', y: 'h*0.7465' },
        { action: 'line', x: 'w*0.5645', y: 'h*0.732' },
        { action: 'line', x: 'w*0.53275', y: 'h*0.723' },
        { action: 'line', x: 'w*0.5', y: 'h*0.72' },
        { action: 'line', x: 'w*0.46725', y: 'h*0.723' },
        { action: 'line', x: 'w*0.4355', y: 'h*0.732' },
        { action: 'line', x: 'w*0.406', y: 'h*0.7465' },
        { action: 'line', x: 'w*0.3795', y: 'h*0.76625' },
        { action: 'line', x: 'w*0.35725', y: 'h*0.7905' },
        { action: 'line', x: 'w*0.3395', y: 'h*0.81825' },
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
  /** 复选框（选中）（29×29） */
  {
    name: 'andriod_icons_78',
    title: '复选框（选中）',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.04', y: 'h*0.14' },
          { action: 'quadraticCurve', x1: 'w*0.04', y1: 'h*0.04', x: 'w*0.14', y: 'h*0.04' },
          { action: 'line', x: 'w*0.86', y: 'h*0.04' },
          { action: 'quadraticCurve', x1: 'w*0.96', y1: 'h*0.04', x: 'w*0.96', y: 'h*0.14' },
          { action: 'line', x: 'w*0.96', y: 'h*0.86' },
          { action: 'quadraticCurve', x1: 'w*0.96', y1: 'h*0.96', x: 'w*0.86', y: 'h*0.96' },
          { action: 'line', x: 'w*0.14', y: 'h*0.96' },
          { action: 'quadraticCurve', x1: 'w*0.04', y1: 'h*0.96', x: 'w*0.04', y: 'h*0.86' },
          { action: 'close' },
          { action: 'move', x: 'w*0.24', y: 'h*0.5' },
          { action: 'line', x: 'w*0.44', y: 'h*0.7' },
          { action: 'line', x: 'w*0.78', y: 'h*0.28' },
          { action: 'line', x: 'w*0.78', y: 'h*0.42' },
          { action: 'line', x: 'w*0.44', y: 'h*0.84' },
          { action: 'line', x: 'w*0.24', y: 'h*0.64' },
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
  /** 方框（29×29） */
  {
    name: 'andriod_icons_79',
    title: '方框',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.08', y: 'h*0.1' },
          { action: 'quadraticCurve', x1: 'w*0.08', y1: 'h*0.08', x: 'w*0.1', y: 'h*0.08' },
          { action: 'line', x: 'w*0.9', y: 'h*0.08' },
          { action: 'quadraticCurve', x1: 'w*0.92', y1: 'h*0.08', x: 'w*0.92', y: 'h*0.1' },
          { action: 'line', x: 'w*0.92', y: 'h*0.9' },
          { action: 'quadraticCurve', x1: 'w*0.92', y1: 'h*0.92', x: 'w*0.9', y: 'h*0.92' },
          { action: 'line', x: 'w*0.1', y: 'h*0.92' },
          { action: 'quadraticCurve', x1: 'w*0.08', y1: 'h*0.92', x: 'w*0.08', y: 'h*0.9' },
          { action: 'close' },
          { action: 'move', x: 'w*0.22', y: 'h*0.23325' },
          { action: 'quadraticCurve', x1: 'w*0.22', y1: 'h*0.22', x: 'w*0.23325', y: 'h*0.22' },
          { action: 'line', x: 'w*0.76675', y: 'h*0.22' },
          { action: 'quadraticCurve', x1: 'w*0.78', y1: 'h*0.22', x: 'w*0.78', y: 'h*0.23325' },
          { action: 'line', x: 'w*0.78', y: 'h*0.76675' },
          { action: 'quadraticCurve', x1: 'w*0.78', y1: 'h*0.78', x: 'w*0.76675', y: 'h*0.78' },
          { action: 'line', x: 'w*0.23325', y: 'h*0.78' },
          { action: 'quadraticCurve', x1: 'w*0.22', y1: 'h*0.78', x: 'w*0.22', y: 'h*0.76675' },
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
  /** 圆框（29×29） */
  {
    name: 'andriod_icons_80',
    title: '圆框',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.14', y: 'h*0.5' },
          { action: 'curve', x1: 'w*0.14', y1: 'h*0.02', x2: 'w*0.86', y2: 'h*0.02', x: 'w*0.86', y: 'h*0.5' },
          { action: 'curve', x1: 'w*0.86', y1: 'h*0.98', x2: 'w*0.14', y2: 'h*0.98', x: 'w*0.14', y: 'h*0.5' },
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
  /** 单选（选中）（29×29） */
  {
    name: 'andriod_icons_81',
    title: '单选（选中）',
    category: 'mobile',
    group: 'mobile_and_icon',
    groupName: 'Android 图标',
    props: { w: 29, h: 29 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 'h*0.5' },
          { action: 'curve', x1: 0, y1: 'h*-0.166667', x2: 'w*1', y2: 'h*-0.166667', x: 'w*1', y: 'h*0.5' },
          { action: 'curve', x1: 'w*1', y1: 'h*1.166667', x2: 0, y2: 'h*1.166667', x: 0, y: 'h*0.5' },
          { action: 'close' },
          { action: 'move', x: 'w*0.11', y: 'h*0.5' },
          {
            action: 'curve',
            x1: 'w*0.11',
            y1: 'h*-0.02',
            x2: 'w*0.89',
            y2: 'h*-0.02',
            x: 'w*0.89',
            y: 'h*0.5'
          },
          { action: 'curve', x1: 'w*0.89', y1: 'h*1.02', x2: 'w*0.11', y2: 'h*1.02', x: 'w*0.11', y: 'h*0.5' },
          { action: 'close' }
        ],
        fillRule: 'evenodd'
      },
      [
        { action: 'move', x: 'w*0.3', y: 'h*0.5' },
        {
          action: 'curve',
          x1: 'w*0.3',
          y1: 'h*0.233333',
          x2: 'w*0.7',
          y2: 'h*0.233333',
          x: 'w*0.7',
          y: 'h*0.5'
        },
        {
          action: 'curve',
          x1: 'w*0.7',
          y1: 'h*0.766667',
          x2: 'w*0.3',
          y2: 'h*0.766667',
          x: 'w*0.3',
          y: 'h*0.5'
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
  }
]
