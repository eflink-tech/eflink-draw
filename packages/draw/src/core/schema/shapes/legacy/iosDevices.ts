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
    groupName: 'iOS 设备背景',
    props: { w: 210, h: 371 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.007143', y: 'h*0.077576' },
          { action: 'quadraticCurve', x1: 'w*0.007143', y1: 'h*0.00404', x: 'w*0.137143', y: 'h*0.00404' },
          { action: 'line', x: 'w*0.862857', y: 'h*0.00404' },
          { action: 'quadraticCurve', x1: 'w*0.992857', y1: 'h*0.00404', x: 'w*0.992857', y: 'h*0.077576' },
          { action: 'line', x: 'w*0.992857', y: 'h*0.922424' },
          { action: 'quadraticCurve', x1: 'w*0.992857', y1: 'h*0.99596', x: 'w*0.862857', y: 'h*0.99596' },
          { action: 'line', x: 'w*0.137143', y: 'h*0.99596' },
          { action: 'quadraticCurve', x1: 'w*0.007143', y1: 'h*0.99596', x: 'w*0.007143', y: 'h*0.922424' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '230,230,230' },
        lineStyle: { lineWidth: 1, lineColor: '189,190,195' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.057', y: 'h*0.121' },
          { action: 'line', x: 'w*0.943', y: 'h*0.121' },
          { action: 'line', x: 'w*0.943', y: 'h*0.879' },
          { action: 'line', x: 'w*0.057', y: 'h*0.879' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '250,250,251' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.435', y: 'h*0.0705' },
          { action: 'quadraticCurve', x1: 'w*0.435', y1: 'h*0.063', x: 'w*0.448259', y: 'h*0.063' },
          { action: 'line', x: 'w*0.551741', y: 'h*0.063' },
          { action: 'quadraticCurve', x1: 'w*0.565', y1: 'h*0.063', x: 'w*0.565', y: 'h*0.0705' },
          { action: 'line', x: 'w*0.565', y: 'h*0.0705' },
          { action: 'quadraticCurve', x1: 'w*0.565', y1: 'h*0.078', x: 'w*0.551741', y: 'h*0.078' },
          { action: 'line', x: 'w*0.448259', y: 'h*0.078' },
          { action: 'quadraticCurve', x1: 'w*0.435', y1: 'h*0.078', x: 'w*0.435', y: 'h*0.0705' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '140,142,147' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.375', y: 'h*0.066747' },
          {
            action: 'curve',
            x1: 'w*0.375',
            y1: 'h*0.052418',
            x2: 'w*0.413',
            y2: 'h*0.052418',
            x: 'w*0.413',
            y: 'h*0.066747'
          },
          {
            action: 'curve',
            x1: 'w*0.413',
            y1: 'h*0.081077',
            x2: 'w*0.375',
            y2: 'h*0.081077',
            x: 'w*0.375',
            y: 'h*0.066747'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '140,142,147' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.464', y: 'h*0.937364' },
          {
            action: 'curve',
            x1: 'w*0.464',
            y1: 'h*0.910212',
            x2: 'w*0.536',
            y2: 'h*0.910212',
            x: 'w*0.536',
            y: 'h*0.937364'
          },
          {
            action: 'curve',
            x1: 'w*0.536',
            y1: 'h*0.964515',
            x2: 'w*0.464',
            y2: 'h*0.964515',
            x: 'w*0.464',
            y: 'h*0.937364'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '140,142,147' }
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
    groupName: 'iOS 设备背景',
    props: { w: 210, h: 371 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.007143', y: 'h*0.077576' },
          { action: 'quadraticCurve', x1: 'w*0.007143', y1: 'h*0.00404', x: 'w*0.137143', y: 'h*0.00404' },
          { action: 'line', x: 'w*0.862857', y: 'h*0.00404' },
          { action: 'quadraticCurve', x1: 'w*0.992857', y1: 'h*0.00404', x: 'w*0.992857', y: 'h*0.077576' },
          { action: 'line', x: 'w*0.992857', y: 'h*0.922424' },
          { action: 'quadraticCurve', x1: 'w*0.992857', y1: 'h*0.99596', x: 'w*0.862857', y: 'h*0.99596' },
          { action: 'line', x: 'w*0.137143', y: 'h*0.99596' },
          { action: 'quadraticCurve', x1: 'w*0.007143', y1: 'h*0.99596', x: 'w*0.007143', y: 'h*0.922424' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '45,45,48' },
        lineStyle: { lineWidth: 1, lineColor: '95,96,101' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.057', y: 'h*0.121' },
          { action: 'line', x: 'w*0.943', y: 'h*0.121' },
          { action: 'line', x: 'w*0.943', y: 'h*0.879' },
          { action: 'line', x: 'w*0.057', y: 'h*0.879' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '250,250,251' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.435', y: 'h*0.0705' },
          { action: 'quadraticCurve', x1: 'w*0.435', y1: 'h*0.063', x: 'w*0.448259', y: 'h*0.063' },
          { action: 'line', x: 'w*0.551741', y: 'h*0.063' },
          { action: 'quadraticCurve', x1: 'w*0.565', y1: 'h*0.063', x: 'w*0.565', y: 'h*0.0705' },
          { action: 'line', x: 'w*0.565', y: 'h*0.0705' },
          { action: 'quadraticCurve', x1: 'w*0.565', y1: 'h*0.078', x: 'w*0.551741', y: 'h*0.078' },
          { action: 'line', x: 'w*0.448259', y: 'h*0.078' },
          { action: 'quadraticCurve', x1: 'w*0.435', y1: 'h*0.078', x: 'w*0.435', y: 'h*0.0705' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '150,152,157' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.375', y: 'h*0.066747' },
          {
            action: 'curve',
            x1: 'w*0.375',
            y1: 'h*0.052418',
            x2: 'w*0.413',
            y2: 'h*0.052418',
            x: 'w*0.413',
            y: 'h*0.066747'
          },
          {
            action: 'curve',
            x1: 'w*0.413',
            y1: 'h*0.081077',
            x2: 'w*0.375',
            y2: 'h*0.081077',
            x: 'w*0.375',
            y: 'h*0.066747'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '150,152,157' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.464', y: 'h*0.937364' },
          {
            action: 'curve',
            x1: 'w*0.464',
            y1: 'h*0.910212',
            x2: 'w*0.536',
            y2: 'h*0.910212',
            x: 'w*0.536',
            y: 'h*0.937364'
          },
          {
            action: 'curve',
            x1: 'w*0.536',
            y1: 'h*0.964515',
            x2: 'w*0.464',
            y2: 'h*0.964515',
            x: 'w*0.464',
            y: 'h*0.937364'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '150,152,157' }
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
    groupName: 'iOS 设备背景',
    props: { w: 210, h: 371 },
    path: [
      {
        actions: [
          { action: 'move', x: 'w*0.007143', y: 'h*0.077576' },
          { action: 'quadraticCurve', x1: 'w*0.007143', y1: 'h*0.00404', x: 'w*0.137143', y: 'h*0.00404' },
          { action: 'line', x: 'w*0.862857', y: 'h*0.00404' },
          { action: 'quadraticCurve', x1: 'w*0.992857', y1: 'h*0.00404', x: 'w*0.992857', y: 'h*0.077576' },
          { action: 'line', x: 'w*0.992857', y: 'h*0.922424' },
          { action: 'quadraticCurve', x1: 'w*0.992857', y1: 'h*0.99596', x: 'w*0.862857', y: 'h*0.99596' },
          { action: 'line', x: 'w*0.137143', y: 'h*0.99596' },
          { action: 'quadraticCurve', x1: 'w*0.007143', y1: 'h*0.99596', x: 'w*0.007143', y: 'h*0.922424' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '255,255,255' },
        lineStyle: { lineWidth: 1, lineColor: '203,204,209' }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.057', y: 'h*0.121' },
          { action: 'line', x: 'w*0.943', y: 'h*0.121' },
          { action: 'line', x: 'w*0.943', y: 'h*0.879' },
          { action: 'line', x: 'w*0.057', y: 'h*0.879' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '250,250,251' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.435', y: 'h*0.0705' },
          { action: 'quadraticCurve', x1: 'w*0.435', y1: 'h*0.063', x: 'w*0.448259', y: 'h*0.063' },
          { action: 'line', x: 'w*0.551741', y: 'h*0.063' },
          { action: 'quadraticCurve', x1: 'w*0.565', y1: 'h*0.063', x: 'w*0.565', y: 'h*0.0705' },
          { action: 'line', x: 'w*0.565', y: 'h*0.0705' },
          { action: 'quadraticCurve', x1: 'w*0.565', y1: 'h*0.078', x: 'w*0.551741', y: 'h*0.078' },
          { action: 'line', x: 'w*0.448259', y: 'h*0.078' },
          { action: 'quadraticCurve', x1: 'w*0.435', y1: 'h*0.078', x: 'w*0.435', y: 'h*0.0705' },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '172,174,179' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.375', y: 'h*0.066747' },
          {
            action: 'curve',
            x1: 'w*0.375',
            y1: 'h*0.052418',
            x2: 'w*0.413',
            y2: 'h*0.052418',
            x: 'w*0.413',
            y: 'h*0.066747'
          },
          {
            action: 'curve',
            x1: 'w*0.413',
            y1: 'h*0.081077',
            x2: 'w*0.375',
            y2: 'h*0.081077',
            x: 'w*0.375',
            y: 'h*0.066747'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'solid', color: '172,174,179' },
        lineStyle: { lineWidth: 0 }
      },
      {
        actions: [
          { action: 'move', x: 'w*0.464', y: 'h*0.937364' },
          {
            action: 'curve',
            x1: 'w*0.464',
            y1: 'h*0.910212',
            x2: 'w*0.536',
            y2: 'h*0.910212',
            x: 'w*0.536',
            y: 'h*0.937364'
          },
          {
            action: 'curve',
            x1: 'w*0.536',
            y1: 'h*0.964515',
            x2: 'w*0.464',
            y2: 'h*0.964515',
            x: 'w*0.464',
            y: 'h*0.937364'
          },
          { action: 'close' }
        ],
        fillStyle: { type: 'none' },
        lineStyle: { lineWidth: 1.5, lineColor: '172,174,179' }
      }
    ],
    anchors: [],
    textBlock: [],
    attribute: { linkable: false },
    resizeDir: []
  }
]
