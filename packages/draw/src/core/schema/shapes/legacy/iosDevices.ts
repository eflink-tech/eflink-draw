// ═══════════════════════════════════════════
// 旧系统 ios_devices.js 中尚未移植的 3 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category iosDevices（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// 位图细节（勾选/开关滑块/放大镜/电池/键盘按键）改由 scripts/lib/mobile-glyphs.mjs 重画为矢量，坐标已比例化
// 旧素材「白底 + lineWidth:0」在白画布上等于隐形，表面描边/配色由 scripts/lib/mobile-styles.mjs 补齐
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const iosDevicesLegacyShapes: ShapeDefinition[] = [
  /** 灰色背景（210×371） */
  {
    name: 'ios7GreyBg',
    title: '灰色背景',
    category: 'mobile',
    group: 'mobile_ios_device',
    groupName: 'iOS 设备',
    props: { w: 210, h: 371 },
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
    textBlock: [],
    fillStyle: { type: 'solid', color: '230,230,230' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 黑色背景（210×371） */
  {
    name: 'ios7BlackBg',
    title: '黑色背景',
    category: 'mobile',
    group: 'mobile_ios_device',
    groupName: 'iOS 设备',
    props: { w: 210, h: 371 },
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
    textBlock: [],
    fillStyle: { type: 'solid', color: '0,0,0' },
    attribute: { linkable: false },
    resizeDir: []
  },
  /** 白色背景（210×371） */
  {
    name: 'ios7WhiteBg',
    title: '白色背景',
    category: 'mobile',
    group: 'mobile_ios_device',
    groupName: 'iOS 设备',
    props: { w: 210, h: 371 },
    path: [
      {
        actions: [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' }
        ],
        lineStyle: { lineWidth: 1, lineColor: '214,216,220' }
      }
    ],
    anchors: [],
    textBlock: [],
    attribute: { linkable: false },
    resizeDir: []
  }
]
