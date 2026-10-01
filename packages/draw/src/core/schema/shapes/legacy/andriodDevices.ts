// ═══════════════════════════════════════════
// 旧系统 andriod_devices.js 中尚未移植的 1 个图形 → 原生矢量 ShapeDefinition
// 自动生成: node scripts/gen-legacy-shapes.mjs --category andriodDevices（勿手改）
// 几何与尺寸取自旧 Schema；actions:{ref} 原语已展开；样式仅保留与本项目默认值的差异
// 位图细节（勾选/开关滑块/放大镜/电池/键盘按键）改由 scripts/lib/mobile-glyphs.mjs 重画为矢量，坐标已比例化
// 旧素材「白底 + lineWidth:0」在白画布上等于隐形，表面描边/配色由 scripts/lib/mobile-styles.mjs 补齐
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'

export const andriodDevicesLegacyShapes: ShapeDefinition[] = [
  /** Android 灰色背景（270×452） */
  {
    name: 'andriodGreyBg',
    title: 'Android 灰色背景',
    category: 'mobile',
    group: 'mobile_and_device',
    groupName: 'Android 设备背景',
    props: { w: 270, h: 452 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.005556', y: 'h*0.052957' },
          { action: 'quadraticCurve', x1: 'w*0.005556', y1: 'h*0.003322', x: 'w*0.088556', y: 'h*0.003322' },
          { action: 'line', x: 'w*0.911444', y: 'h*0.003322' },
          { action: 'quadraticCurve', x1: 'w*0.994444', y1: 'h*0.003322', x: 'w*0.994444', y: 'h*0.052957' },
          { action: 'line', x: 'w*0.994444', y: 'h*0.947043' },
          { action: 'quadraticCurve', x1: 'w*0.994444', y1: 'h*0.996678', x: 'w*0.911444', y: 'h*0.996678' },
          { action: 'line', x: 'w*0.088556', y: 'h*0.996678' },
          { action: 'quadraticCurve', x1: 'w*0.005556', y1: 'h*0.996678', x: 'w*0.005556', y: 'h*0.947043' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '230,230,230' },
        lineStyle: { lineWidth: 1, lineColor: '189,190,195' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.039', y: 'h*0.066' },
          { action: 'line', x: 'w*0.961', y: 'h*0.066' },
          { action: 'line', x: 'w*0.961', y: 'h*0.942' },
          { action: 'line', x: 'w*0.039', y: 'h*0.942' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '250,250,251' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.444', y: 'h*0.032' },
          { action: 'quadraticCurve', x1: 'w*0.444', y1: 'h*0.026', x: 'w*0.454033', y: 'h*0.026' },
          { action: 'line', x: 'w*0.545967', y: 'h*0.026' },
          { action: 'quadraticCurve', x1: 'w*0.556', y1: 'h*0.026', x: 'w*0.556', y: 'h*0.032' },
          { action: 'line', x: 'w*0.556', y: 'h*0.032' },
          { action: 'quadraticCurve', x1: 'w*0.556', y1: 'h*0.038', x: 'w*0.545967', y: 'h*0.038' },
          { action: 'line', x: 'w*0.454033', y: 'h*0.038' },
          { action: 'quadraticCurve', x1: 'w*0.444', y1: 'h*0.038', x: 'w*0.444', y: 'h*0.032' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '172,174,179' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.414', y: 'h*0.958' },
          { action: 'line', x: 'w*0.443', y: 'h*0.978' },
          { action: 'line', x: 'w*0.414', y: 'h*0.978' },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '150,152,157' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.478', y: 'h*0.968445' },
          {
            action: 'curve',
            x1: 'w*0.478',
            y1: 'h*0.946518',
            x2: 'w*0.533',
            y2: 'h*0.946518',
            x: 'w*0.533',
            y: 'h*0.968445'
          },
          {
            action: 'curve',
            x1: 'w*0.533',
            y1: 'h*0.990372',
            x2: 'w*0.478',
            y2: 'h*0.990372',
            x: 'w*0.478',
            y: 'h*0.968445'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '150,152,157' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.536', y: 'h*0.9585' },
          { action: 'line', x: 'w*0.583', y: 'h*0.9585' },
          { action: 'move', x: 'w*0.536', y: 'h*0.9677' },
          { action: 'line', x: 'w*0.583', y: 'h*0.9677' },
          { action: 'move', x: 'w*0.536', y: 'h*0.977' },
          { action: 'line', x: 'w*0.583', y: 'h*0.977' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.2, lineColor: '150,152,157' }
      }
    ],
    anchors: [],
    textBlock: [],
    fillStyle: { type: 'solid', color: '230,230,230' },
    attribute: { linkable: false },
    resizeDir: []
  }
]
