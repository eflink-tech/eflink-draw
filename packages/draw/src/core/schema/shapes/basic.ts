import type { PathDefinition, ShapeDefinition } from '@/types'

// 尺寸、锚点、textBlock、路径均取自旧 Schema；样式（边线 2px / 50,50,50、

// ═══════════════════════════════════════════
// 基础几何图形
// ═══════════════════════════════════════════

/** 矩形（旧：100×70） */
export const rectangle: ShapeDefinition = {
  name: 'rectangle',
  title: '矩形',
  category: 'basic',
  props: { w: 100, h: 70 },
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'close' },
  ]],
}

/** 圆角矩形（旧：100×70，圆角半径 4） */
export const roundRectangle: ShapeDefinition = {
  name: 'roundRectangle',
  title: '圆角矩形',
  category: 'basic',
  props: { w: 100, h: 70 },
  path: [
    [
      { action: 'move', x: 0, y: 4 },
      { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
      { action: 'line', x: 'w-4', y: 0 },
      { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
      { action: 'line', x: 'w', y: 'h-4' },
      { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
      { action: 'line', x: 4, y: 'h' },
      { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
      { action: 'close' },
    ],
  ],
}

/** 圆形（旧 round：70×70，贝塞尔控制点 ±h/6） */
export const round: ShapeDefinition = {
  name: 'round',
  title: '圆形',
  category: 'basic',
  props: { w: 70, h: 70 },
  path: [
    [
      { action: 'move', x: 0, y: 'h/2' },
      {
        action: 'curve',
        x1: 0, y1: '-h/6',
        x2: 'w', y2: '-h/6',
        x: 'w', y: 'h/2',
      },
      {
        action: 'curve',
        x1: 'w', y1: 'h+h/6',
        x2: 0, y2: 'h+h/6',
        x: 0, y: 'h/2',
      },
      { action: 'close' },
    ],
  ],
}

/** 三角形（旧 triangle：80×70，锚点为四边中点） */
const triangle: ShapeDefinition = {
  name: 'triangle',
  title: '三角形',
  category: 'basic',
  props: { w: 80, h: 70 },
  textBlock: [{ position: { x: 10, y: 'h*0.25', w: 'w-20', h: 'h*0.75' }, text: '' }],
  anchors: [
    { x: 'w/2', y: 0 },
    { x: 'w/2', y: 'h' },
    { x: 'w*0.25', y: 'h/2' },
    { x: 'w*0.75', y: 'h/2' },
  ],
  path: [[
    { action: 'move', x: 'w/2', y: 0 },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'close' },
  ]],
}

/** 菱形（旧 diamond：120×80） */
const diamond: ShapeDefinition = {
  name: 'diamond',
  title: '菱形',
  category: 'basic',
  props: { w: 120, h: 80 },
  textBlock: [{ position: { x: 10, y: 'h*0.13', w: 'w-20', h: 'h*0.75' }, text: '' }],
  anchors: [
    { x: 0, y: 'h/2' },
    { x: 'w/2', y: 0 },
    { x: 'w', y: 'h/2' },
    { x: 'w/2', y: 'h' },
  ],
  path: [[
    { action: 'move', x: 0, y: 'h/2' },
    { action: 'line', x: 'w/2', y: 0 },
    { action: 'line', x: 'w', y: 'h/2' },
    { action: 'line', x: 'w/2', y: 'h' },
    { action: 'close' },
  ]],
}

/** 五边形（旧 polygon：74×70） */
const polygon: ShapeDefinition = {
  name: 'polygon',
  title: '五边形',
  category: 'basic',
  props: { w: 74, h: 70 },
  textBlock: [{ position: { x: 10, y: 'h*0.15', w: 'w-20', h: 'h*0.85' }, text: '' }],
  anchors: [
    { x: 'w/2', y: 0 },
    { x: 'w/2', y: 'h' },
    { x: 0, y: 'h*0.39' },
    { x: 'w', y: 'h*0.39' },
  ],
  path: [[
    { action: 'move', x: 'w/2', y: 0 },
    { action: 'line', x: 0, y: 'h*0.39' },
    { action: 'line', x: 'w*0.18', y: 'h' },
    { action: 'line', x: 'w*0.82', y: 'h' },
    { action: 'line', x: 'w', y: 'h*0.39' },
    { action: 'close' },
  ]],
}

/** 六边形（旧 hexagon：84×70，斜边 Math.min(w,h)*0.21） */
const hexagon: ShapeDefinition = {
  name: 'hexagon',
  title: '六边形',
  category: 'basic',
  props: { w: 84, h: 70 },
  path: [[
    { action: 'move', x: 'Math.min(w,h)*0.21', y: 0 },
    { action: 'line', x: 'w-Math.min(w,h)*0.21', y: 0 },
    { action: 'line', x: 'w', y: 'h/2' },
    { action: 'line', x: 'w-Math.min(w,h)*0.21', y: 'h' },
    { action: 'line', x: 'Math.min(w,h)*0.21', y: 'h' },
    { action: 'line', x: 0, y: 'h/2' },
    { action: 'close' },
  ]],
}

/** 八边形（旧 octagon：70×70） */
const octagon: ShapeDefinition = {
  name: 'octagon',
  title: '八边形',
  category: 'basic',
  props: { w: 70, h: 70 },
  textBlock: [{ position: { x: 10, y: 10, w: 'w-20', h: 'h-20' }, text: '' }],
  path: [[
    { action: 'move', x: 'Math.min(w,h)*0.29', y: 0 },
    { action: 'line', x: 'w-Math.min(w,h)*0.29', y: 0 },
    { action: 'line', x: 'w', y: 'h*0.29' },
    { action: 'line', x: 'w', y: 'h*0.71' },
    { action: 'line', x: 'w-Math.min(w,h)*0.29', y: 'h' },
    { action: 'line', x: 'Math.min(w,h)*0.29', y: 'h' },
    { action: 'line', x: 0, y: 'h*0.71' },
    { action: 'line', x: 0, y: 'h*0.29' },
    { action: 'close' },
  ]],
}

/** 五角星（旧 pentagon：70×70） */
const pentagon: ShapeDefinition = {
  name: 'pentagon',
  title: '五角星',
  category: 'basic',
  props: { w: 70, h: 70 },
  textBlock: [{ position: { x: 'w*0.15', y: 'h*0.20', w: 'w*0.70', h: 'h*0.65' }, text: '' }],
  anchors: [
    { x: 'w*0.5', y: 0 },
    { x: 0, y: 'h*0.38' },
    { x: 'w*0.5', y: 'h*0.76' },
    { x: 'w', y: 'h*0.38' },
  ],
  path: [[
    { action: 'move', x: 'w*0.62', y: 'h*0.38' },
    { action: 'line', x: 'w*0.5', y: 0 },
    { action: 'line', x: 'w*0.38', y: 'h*0.38' },
    { action: 'line', x: 0, y: 'h*0.38' },
    { action: 'line', x: 'w*0.3', y: 'h*0.62' },
    { action: 'line', x: 'w*0.18', y: 'h' },
    { action: 'line', x: 'w*0.5', y: 'h*0.76' },
    { action: 'line', x: 'w*0.82', y: 'h' },
    { action: 'line', x: 'w*0.7', y: 'h*0.62' },
    { action: 'line', x: 'w', y: 'h*0.38' },
    { action: 'close' },
  ]],
}

// ═══════════════════════════════════════════
// 曲线图形
// ═══════════════════════════════════════════

/** 扇形（旧 sector：80×80） */
const sector: ShapeDefinition = {
  name: 'sector',
  title: '扇形',
  category: 'basic',
  props: { w: 80, h: 80 },
  anchors: [
    { x: 0, y: '0.134*h' },
    { x: 'w/2', y: 0 },
    { x: 'w', y: '0.134*h' },
    { x: 'w/2', y: 'h' },
  ],
  path: [[
    { action: 'move', x: 'w/2', y: 'h' },
    { action: 'line', x: 0, y: '0.134*h' },
    { action: 'quadraticCurve', x1: 'w/2', y1: '-0.134*h', x: 'w', y: 'h*0.134' },
    { action: 'close' },
  ]],
}

/** 扇形2（旧 sector2：80×45） */
const sector2: ShapeDefinition = {
  name: 'sector2',
  title: '扇形2',
  category: 'basic',
  props: { w: 80, h: 45 },
  anchors: [
    { x: 0, y: '0.238*h' },
    { x: 'w/2', y: 0 },
    { x: 'w', y: '0.238*h' },
    { x: 'w/2', y: 'h' },
  ],
  path: [[
    { action: 'move', x: 'w*0.25', y: 'h' },
    { action: 'line', x: 0, y: '0.238*h' },
    { action: 'quadraticCurve', x1: 'w/2', y1: '-0.238*h', x: 'w', y: 'h*0.238' },
    { action: 'line', x: 'w*0.75', y: 'h' },
    { action: 'quadraticCurve', x1: 'w/2', y1: '0.8*h', x: 'w*0.25', y: 'h' },
    { action: 'close' },
  ]],
}

/** 云（旧 cloud：90×70） */
const cloud: ShapeDefinition = {
  name: 'cloud',
  title: '云',
  category: 'basic',
  props: { w: 90, h: 70 },
  textBlock: [{ position: { x: 10, y: 10, w: 'w-20', h: 'h-20' }, text: '' }],
  anchors: [
    { x: 0, y: 'h*0.5' },
    { x: 'w*0.19', y: 'h*0.9' },
    { x: 'w*0.57', y: 'h' },
    { x: 'w*0.962', y: 'h*0.8' },
    { x: 'w*0.9543', y: 'h*0.23' },
    { x: 'w*0.6', y: 'h*0.01' },
    { x: 'w*0.17', y: 'h*0.09' },
  ],
  path: [[
    { action: 'move', x: '0.12*w', y: '0.7*h' },
    { action: 'curve', x1: '-0.1*w', y1: '0.5*h', x2: '0.04*w', y2: '0.35*h', x: '0.09*w', y: '0.3*h' },
    { action: 'curve', x1: '0.07*w', y1: '0.05*h', x2: '0.32*w', y2: '0.0*h', x: '0.42*w', y: '0.1*h' },
    { action: 'curve', x1: '0.50*w', y1: '-0.05*h', x2: '0.75*w', y2: '0.0*h', x: '0.75*w', y: '0.15*h' },
    { action: 'curve', x1: '0.95*w', y1: '0.1*h', x2: '1.03*w', y2: '0.3*h', x: '0.95*w', y: '0.55*h' },
    { action: 'curve', x1: '1.02*w', y1: '0.75*h', x2: '0.95*w', y2: '1.0*h', x: '0.72*w', y: '0.9*h' },
    { action: 'curve', x1: '0.67*w', y1: '1.03*h', x2: '0.47*w', y2: '1.03*h', x: '0.42*w', y: '0.9*h' },
    { action: 'curve', x1: '0.32*w', y1: '1.0*h', x2: '0.12*w', y2: '0.95*h', x: '0.12*w', y: '0.7*h' },
    { action: 'close' },
  ]],
}

/** 对话气泡（旧 comment：90×70） */
const comment: ShapeDefinition = {
  name: 'comment',
  title: '对话气泡',
  category: 'basic',
  props: { w: 90, h: 70 },
  anchors: [
    { x: 'w', y: 'h*0.5' },
    { x: 0, y: 'h*0.5' },
  ],
  path: [[
    { action: 'move', x: 0, y: 'h/2' },
    { action: 'curve', x1: 0, y1: '-h/6', x2: 'w', y2: '-h/6', x: 'w', y: 'h/2' },
    { action: 'quadraticCurve', x1: 'w*0.98', y1: 'h*0.98', x: 'w/2', y: 'h' },
    { action: 'quadraticCurve', x1: 'w/3', y1: 'h', x: 'w/6', y: 'h*0.9' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 'w*0.117', y: 'h*0.857' },
    { action: 'quadraticCurve', x1: 0, y1: '0.7*h', x: 0, y: 'h/2' },
  ]],
}

/** 水滴（旧 teardrop：70×70） */
const teardrop: ShapeDefinition = {
  name: 'teardrop',
  title: '水滴',
  category: 'basic',
  props: { w: 70, h: 70 },
  path: [[
    { action: 'move', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h/2' },
    { action: 'curve', x1: 'w', y1: 'h+h/6', x2: 0, y2: 'h+h/6', x: 0, y: 'h*0.5' },
    { action: 'quadraticCurve', x1: 0, y1: 0, x: 'w/2', y: 0 },
    { action: 'line', x: 'w/2', y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'close' },
  ]],
}

// ═══════════════════════════════════════════
// 十字形与 APQC
// ═══════════════════════════════════════════

/** 十字形（旧 cross：70×70） */
const cross: ShapeDefinition = {
  name: 'cross',
  title: '十字形',
  category: 'basic',
  props: { w: 70, h: 70 },
  textBlock: [{ position: { x: 0, y: 'h*0.5-Math.min(w,h)/8', w: 'w', h: 'Math.min(w,h)*2/8' }, text: '' }],
  path: [[
    { action: 'move', x: 'w*0.5-Math.min(w,h)/8', y: 0 },
    { action: 'line', x: 'w*0.5+Math.min(w,h)/8', y: 0 },
    { action: 'line', x: 'w*0.5+Math.min(w,h)/8', y: 'h*0.5-Math.min(w,h)/8' },
    { action: 'line', x: 'w', y: 'h*0.5-Math.min(w,h)/8' },
    { action: 'line', x: 'w', y: 'h*0.5+Math.min(w,h)/8' },
    { action: 'line', x: 'w*0.5+Math.min(w,h)/8', y: 'h*0.5+Math.min(w,h)/8' },
    { action: 'line', x: 'w*0.5+Math.min(w,h)/8', y: 'h' },
    { action: 'line', x: 'w*0.5-Math.min(w,h)/8', y: 'h' },
    { action: 'line', x: 'w*0.5-Math.min(w,h)/8', y: 'h*0.5+Math.min(w,h)/8' },
    { action: 'line', x: 0, y: 'h*0.5+Math.min(w,h)/8' },
    { action: 'line', x: 0, y: 'h*0.5-Math.min(w,h)/8' },
    { action: 'line', x: 'w*0.5-Math.min(w,h)/8', y: 'h*0.5-Math.min(w,h)/8' },
    { action: 'close' },
  ]],
}

/** APQC（旧 apqc：200×150） */
const apqc: ShapeDefinition = {
  name: 'apqc',
  title: 'APQC',
  category: 'basic',
  props: { w: 200, h: 150 },
  path: [[
    { action: 'move', x: 0, y: 'h/8' },
    { action: 'quadraticCurve', x1: 'w*0.5', y1: '-h/8', x: 'w', y: 'h/8' },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 0, y: 'h/8' },
    { action: 'close' },
  ]],
}

// ═══════════════════════════════════════════
// 箭头类图形
// ═══════════════════════════════════════════

/** 左箭头（旧 singleLeftArrow：90×60） */
const singleLeftArrow: ShapeDefinition = {
  name: 'singleLeftArrow',
  title: '左箭头',
  category: 'basic',
  props: { w: 90, h: 60 },
  anchors: [
    { x: 'w', y: 'h*0.5' },
    { x: 0, y: 'h*0.5' },
  ],
  textBlock: [{ position: { x: 0, y: 'h*0.33', w: 'w', h: 'h*0.34' }, text: '' }],
  path: [[
    { action: 'move', x: 0, y: 'h/2' },
    { action: 'line', x: 'Math.min(0.5*h,0.45*w)', y: 0 },
    { action: 'line', x: 'Math.min(0.5*h,0.45*w)', y: 'h*0.33' },
    { action: 'line', x: 'w', y: 'h*0.33' },
    { action: 'line', x: 'w', y: 'h*0.67' },
    { action: 'line', x: 'Math.min(0.5*h,0.45*w)', y: 'h*0.67' },
    { action: 'line', x: 'Math.min(0.5*h,0.45*w)', y: 'h' },
    { action: 'line', x: 0, y: 'h/2' },
    { action: 'close' },
  ]],
}

/** 右箭头（旧 singleRightArrow：90×60） */
const singleRightArrow: ShapeDefinition = {
  name: 'singleRightArrow',
  title: '右箭头',
  category: 'basic',
  props: { w: 90, h: 60 },
  anchors: [
    { x: 'w', y: 'h*0.5' },
    { x: 0, y: 'h*0.5' },
  ],
  textBlock: [{ position: { x: 0, y: 'h*0.33', w: 'w', h: 'h*0.34' }, text: '' }],
  path: [[
    { action: 'move', x: 0, y: 'h*0.33' },
    { action: 'line', x: 'w-Math.min(h*0.5,w*0.45)', y: 'h*0.33' },
    { action: 'line', x: 'w-Math.min(h*0.5,w*0.45)', y: 0 },
    { action: 'line', x: 'w', y: 'h*0.5' },
    { action: 'line', x: 'w-Math.min(h*0.5,w*0.45)', y: 'h' },
    { action: 'line', x: 'w-Math.min(h*0.5,w*0.45)', y: 'h*0.67' },
    { action: 'line', x: 0, y: 'h*0.67' },
    { action: 'line', x: 0, y: 'h*0.33' },
    { action: 'close' },
  ]],
}

/** 左右箭头（旧 doubleHorizontalArrow：90×60） */
const doubleHorizontalArrow: ShapeDefinition = {
  name: 'doubleHorizontalArrow',
  title: '左右箭头',
  category: 'basic',
  props: { w: 90, h: 60 },
  anchors: [
    { x: 'w', y: 'h*0.5' },
    { x: 0, y: 'h*0.5' },
  ],
  textBlock: [{ position: { x: 0, y: 'h*0.33', w: 'w', h: 'h*0.34' }, text: '' }],
  path: [[
    { action: 'move', x: 0, y: 'h*0.5' },
    { action: 'line', x: 'Math.min(h*0.5,w*0.45)', y: 0 },
    { action: 'line', x: 'Math.min(h*0.5,w*0.45)', y: 'h*0.33' },
    { action: 'line', x: 'w-Math.min(h*0.5,w*0.45)', y: 'h*0.33' },
    { action: 'line', x: 'w-Math.min(h*0.5,w*0.45)', y: 0 },
    { action: 'line', x: 'w', y: 'h*0.5' },
    { action: 'line', x: 'w-Math.min(h*0.5,w*0.45)', y: 'h' },
    { action: 'line', x: 'w-Math.min(h*0.5,w*0.45)', y: 'h*0.67' },
    { action: 'line', x: 'Math.min(h*0.5,w*0.45)', y: 'h*0.67' },
    { action: 'line', x: 'Math.min(h*0.5,w*0.45)', y: 'h' },
    { action: 'line', x: 0, y: 'h*0.5' },
    { action: 'close' },
  ]],
}

/** 上箭头（旧 singleUpArrow：60×90） */
const singleUpArrow: ShapeDefinition = {
  name: 'singleUpArrow',
  title: '上箭头',
  category: 'basic',
  props: { w: 60, h: 90 },
  anchors: [
    { x: 'w*0.5', y: 0 },
    { x: 'w*0.5', y: 'h' },
  ],
  textBlock: [{ position: { x: '-w*0.2', y: 'h*0.43', w: 'w*1.4', h: 'h*0.24' }, text: '' }],
  path: [[
    { action: 'move', x: 'w*0.5', y: 0 },
    { action: 'line', x: 'w', y: 'Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 'w*0.67', y: 'Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 'w*0.67', y: 'h' },
    { action: 'line', x: 'w*0.33', y: 'h' },
    { action: 'line', x: 'w*0.33', y: 'Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 0, y: 'Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 'w*0.5', y: 0 },
    { action: 'close' },
  ]],
}

/** 下箭头（旧 singleDownArrow：60×90） */
const singleDownArrow: ShapeDefinition = {
  name: 'singleDownArrow',
  title: '下箭头',
  category: 'basic',
  props: { w: 60, h: 90 },
  anchors: [
    { x: 'w*0.5', y: 0 },
    { x: 'w*0.5', y: 'h' },
  ],
  textBlock: [{ position: { x: '-w*0.2', y: 'h*0.33', w: 'w*1.4', h: 'h*0.24' }, text: '' }],
  path: [[
    { action: 'move', x: 'w*0.33', y: 0 },
    { action: 'line', x: 'w*0.67', y: 0 },
    { action: 'line', x: 'w*0.67', y: 'h-Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 'w', y: 'h-Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 'w*0.5', y: 'h' },
    { action: 'line', x: 0, y: 'h-Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 'w*0.33', y: 'h-Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 'w*0.33', y: 0 },
    { action: 'close' },
  ]],
}

/** 上下箭头（旧 doubleVerticalArrow：60×90） */
const doubleVerticalArrow: ShapeDefinition = {
  name: 'doubleVerticalArrow',
  title: '上下箭头',
  category: 'basic',
  props: { w: 60, h: 90 },
  anchors: [
    { x: 'w*0.5', y: 0 },
    { x: 'w*0.5', y: 'h' },
  ],
  textBlock: [{ position: { x: '-w*0.2', y: 'h*0.38', w: 'w*1.4', h: 'h*0.24' }, text: '' }],
  path: [[
    { action: 'move', x: 'w*0.5', y: 0 },
    { action: 'line', x: 'w', y: 'Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 'w*0.67', y: 'Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 'w*0.67', y: 'h-Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 'w', y: 'h-Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 'w*0.5', y: 'h' },
    { action: 'line', x: 0, y: 'h-Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 'w*0.33', y: 'h-Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 'w*0.33', y: 'Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 0, y: 'Math.min(w*0.5,h*0.45)' },
    { action: 'line', x: 'w*0.5', y: 0 },
    { action: 'close' },
  ]],
}

/** 左返回箭头（旧 backArrow：70×70，container 标记，已去透明矩形） */
const backArrow: ShapeDefinition = {
  name: 'backArrow',
  title: '左返回箭头',
  category: 'basic',
  attribute: { container: true },
  props: { w: 70, h: 70 },
  anchors: [
    { x: 'w-Math.min(w*0.12,20)', y: 'h*0.5' },
    { x: 0, y: 'h*0.5' },
  ],
  textBlock: [{ position: { x: 0, y: 0, w: 'w-10', h: 'h' }, text: '' }],
  path: [[
    { action: 'move', x: 0, y: 'Math.min(Math.min(w,h)*0.4,80)' },
    { action: 'quadraticCurve', x1: 0, y1: 0, x: 'Math.min(Math.min(w,h)*0.4,80)', y: 0 },
    { action: 'line', x: 'w-Math.min(w*0.12,20)-Math.min(Math.min(w,h)*0.4,80)', y: 0 },
    { action: 'quadraticCurve', x1: 'w-Math.min(w*0.12,20)', y1: 0, x: 'w-Math.min(w*0.12,20)', y: 'Math.min(Math.min(w,h)*0.4,80)' },
    { action: 'line', x: 'w-Math.min(w*0.12,20)', y: 'h-h*0.1-Math.min(h*0.1,50)' },
    { action: 'line', x: 'w', y: 'h-h*0.1-Math.min(h*0.1,50)' },
    { action: 'line', x: 'w-Math.min(w*0.12,20)-Math.min(Math.min(h,w)*0.25,50)/2', y: 'h' },
    { action: 'line', x: 'w-Math.min(w*0.12,20)*2-Math.min(Math.min(h,w)*0.25,50)', y: 'h-h*0.1-Math.min(h*0.1,50)' },
    { action: 'line', x: 'w-Math.min(w*0.12,20)-Math.min(Math.min(h,w)*0.25,50)', y: 'h-h*0.1-Math.min(h*0.1,50)' },
    { action: 'line', x: 'w-Math.min(w*0.12,20)-Math.min(Math.min(h,w)*0.25,50)', y: 'Math.min(Math.min(h,w)*0.4,80)' },
    { action: 'quadraticCurve', x1: 'w-Math.min(w*0.12,20)-Math.min(Math.min(h,w)*0.25,50)', y1: 'Math.min(Math.min(h,w)*0.25,50)', x: 'w-Math.min(w*0.12,20)-Math.min(Math.min(h,w)*0.25,50)-Math.min(w*0.15,30)', y: 'Math.min(Math.min(h,w)*0.25,50)' },
    { action: 'line', x: 'Math.min(Math.min(h,w)*0.25,50)+Math.min(w*0.15,30)', y: 'Math.min(Math.min(h,w)*0.25,50)' },
    { action: 'quadraticCurve', x1: 'Math.min(Math.min(h,w)*0.25,50)', y1: 'Math.min(Math.min(h,w)*0.25,50)', x: 'Math.min(Math.min(h,w)*0.25,50)', y: 'Math.min(Math.min(h,w)*0.4,80)' },
    { action: 'line', x: 'Math.min(Math.min(h,w)*0.25,50)', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 0, y: 'Math.min(Math.min(h,w)*0.4,80)' },
    { action: 'close' },
  ]],
}

/** 右返回箭头（旧 rightBackArrow：70×70，container 标记） */
const rightBackArrow: ShapeDefinition = {
  name: 'rightBackArrow',
  title: '右返回箭头',
  category: 'basic',
  attribute: { container: true },
  props: { w: 70, h: 70 },
  anchors: [
    { x: 'Math.min(w*0.12,20)', y: 'h*0.5' },
    { x: 'w', y: 'h*0.5' },
  ],
  textBlock: [{ position: { x: 10, y: 0, w: 'w-10', h: 'h' }, text: '' }],
  path: [[
    { action: 'move', x: 'w', y: 'Math.min(Math.min(w,h)*0.4,80)' },
    { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w-Math.min(Math.min(w,h)*0.4,80)', y: 0 },
    { action: 'line', x: 'Math.min(w*0.12,20)+Math.min(Math.min(w,h)*0.4,80)', y: 0 },
    { action: 'quadraticCurve', x1: 'Math.min(w*0.12,20)', y1: 0, x: 'Math.min(w*0.12,20)', y: 'Math.min(Math.min(w,h)*0.4,80)' },
    { action: 'line', x: 'Math.min(w*0.12,20)', y: 'h-h*0.1-Math.min(h*0.1,50)' },
    { action: 'line', x: 0, y: 'h-h*0.1-Math.min(h*0.1,50)' },
    { action: 'line', x: 'Math.min(w*0.12,20)+Math.min(Math.min(h,w)*0.25,50)/2', y: 'h' },
    { action: 'line', x: 'Math.min(Math.min(h,w)*0.25,50)+Math.min(w*0.12,20)*2', y: 'h-h*0.1-Math.min(h*0.1,50)' },
    { action: 'line', x: 'Math.min(Math.min(h,w)*0.25,50)+Math.min(w*0.12,20)', y: 'h-h*0.1-Math.min(h*0.1,50)' },
    { action: 'line', x: 'Math.min(Math.min(h,w)*0.25,50)+Math.min(w*0.12,20)', y: 'Math.min(Math.min(h,w)*0.4,80)' },
    { action: 'quadraticCurve', x1: 'Math.min(Math.min(h,w)*0.25,50)+Math.min(w*0.12,20)', y1: 'Math.min(Math.min(h,w)*0.25,50)', x: 'Math.min(Math.min(h,w)*0.25,50)+Math.min(w*0.12,20)+Math.min(w*0.15,30)', y: 'Math.min(Math.min(h,w)*0.25,50)' },
    { action: 'line', x: 'w-Math.min(Math.min(h,w)*0.25,50)-Math.min(w*0.15,30)', y: 'Math.min(Math.min(h,w)*0.25,50)' },
    { action: 'quadraticCurve', x1: 'w-Math.min(Math.min(h,w)*0.25,50)', y1: 'Math.min(Math.min(h,w)*0.25,50)', x: 'w-Math.min(Math.min(h,w)*0.25,50)', y: 'Math.min(Math.min(h,w)*0.4,80)' },
    { action: 'line', x: 'w-Math.min(Math.min(h,w)*0.25,50)', y: 'h' },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 'w', y: 'Math.min(Math.min(h,w)*0.4,80)' },
    { action: 'close' },
  ]],
}

/** 拐角（旧 corner：70×70，container 标记） */
const corner: ShapeDefinition = {
  name: 'corner',
  title: '拐角',
  category: 'basic',
  attribute: { container: true },
  props: { w: 70, h: 70 },
  anchors: [
    { x: 'w*0.5', y: 0 },
    { x: 0, y: 'h*0.5' },
  ],
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w-Math.min(w/6,30)', y: 'Math.min(h/6,30)' },
    { action: 'line', x: 'Math.min(w/6,30)', y: 'Math.min(h/6,30)' },
    { action: 'line', x: 'Math.min(w/6,30)', y: 'h-Math.min(h/6,30)' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 0, y: 0 },
    { action: 'close' },
  ]],
}

// ═══════════════════════════════════════════
// 括号类图形（container + linkable:false + fillStyle:none）
// ═══════════════════════════════════════════

/** 大括号（旧 braces：200×140） */
const braces: ShapeDefinition = {
  name: 'braces',
  title: '大括号',
  category: 'basic',
  attribute: { linkable: false, container: true },
  props: { w: 200, h: 140 },
  fillStyle: { type: 'none' },
  anchors: [
    { x: 'w', y: 'h*0.5' },
    { x: 0, y: 'h*0.5' },
  ],
  path: [
    // 左大括号
    [
      { action: 'move', x: 'Math.min(w*0.2,18)', y: 0 },
      { action: 'quadraticCurve', x1: 'Math.min(w*0.1,9)', y1: 0, x: 'Math.min(w*0.1,9)', y: 'Math.min(h*0.1,9)' },
      { action: 'line', x: 'Math.min(w*0.1,9)', y: 'h*0.5-Math.min(h*0.1,9)' },
      { action: 'quadraticCurve', x1: 'Math.min(w*0.1,9)', y1: 'h*0.5', x: 0, y: 'h*0.5' },
      { action: 'quadraticCurve', x1: 'Math.min(w*0.1,9)', y1: 'h*0.5', x: 'Math.min(w*0.1,9)', y: 'h*0.5+Math.min(h*0.1,9)' },
      { action: 'line', x: 'Math.min(w*0.1,9)', y: 'h-Math.min(h*0.1,9)' },
      { action: 'quadraticCurve', x1: 'Math.min(w*0.1,9)', y1: 'h', x: 'Math.min(w*0.2,18)', y: 'h' },
    ],
    // 右大括号
    [
      { action: 'move', x: 'w-Math.min(w*0.2,18)', y: 'h' },
      { action: 'quadraticCurve', x1: 'w-Math.min(w*0.1,9)', y1: 'h', x: 'w-Math.min(w*0.1,9)', y: 'h-Math.min(h*0.1,9)' },
      { action: 'line', x: 'w-Math.min(w*0.1,9)', y: 'h*0.5+Math.min(h*0.1,9)' },
      { action: 'quadraticCurve', x1: 'w-Math.min(w*0.1,9)', y1: 'h*0.5', x: 'w', y: 'h*0.5' },
      { action: 'quadraticCurve', x1: 'w-Math.min(w*0.1,9)', y1: 'h*0.5', x: 'w-Math.min(w*0.1,9)', y: 'h*0.5-Math.min(h*0.1,9)' },
      { action: 'line', x: 'w-Math.min(w*0.1,9)', y: 'Math.min(h*0.1,9)' },
      { action: 'quadraticCurve', x1: 'w-Math.min(w*0.1,9)', y1: 0, x: 'w-Math.min(w*0.2,18)', y: 0 },
    ],
  ],
}

/** 中括号（旧 parentheses：200×140） */
const parentheses: ShapeDefinition = {
  name: 'parentheses',
  title: '中括号',
  category: 'basic',
  attribute: { linkable: false, container: true },
  props: { w: 200, h: 140 },
  fillStyle: { type: 'none' },
  anchors: [
    { x: 'w', y: 'h*0.5' },
    { x: 0, y: 'h*0.5' },
  ],
  path: [[
    { action: 'move', x: 'Math.min(w*0.1,18)', y: 0 },
    { action: 'line', x: 0, y: 'Math.min(h*0.1,15)' },
    { action: 'line', x: 0, y: 'h-Math.min(h*0.1,15)' },
    { action: 'line', x: 'Math.min(w*0.1,18)', y: 'h' },
    { action: 'move', x: 'w-Math.min(w*0.1,18)', y: 'h' },
    { action: 'line', x: 'w', y: 'h-Math.min(h*0.1,15)' },
    { action: 'line', x: 'w', y: 'Math.min(h*0.1,15)' },
    { action: 'line', x: 'w-Math.min(w*0.1,18)', y: 0 },
  ]],
}

/** 备注面板图标：三行文本线（左对齐，上长下短） */
function remarkLinesRightAligned(w: number, h: number, x0: number): PathDefinition[] {
  const gap = h * 0.16
  const midY = h * 0.5
  const maxLen = w - x0 - w * 0.06
  const lengths = [maxLen, maxLen * 0.78, maxLen * 0.48]
  return lengths.map((len, i) => [
    { action: 'move' as const, x: x0, y: midY - gap + i * gap },
    { action: 'line' as const, x: x0 + len, y: midY - gap + i * gap },
  ])
}

/** 备注面板图标：三行文本线（右对齐，上长下短） */
function remarkLinesLeftAligned(w: number, h: number, x1: number): PathDefinition[] {
  const gap = h * 0.16
  const midY = h * 0.5
  const maxLen = x1 - w * 0.06
  const lengths = [maxLen, maxLen * 0.78, maxLen * 0.48]
  return lengths.map((len, i) => [
    { action: 'move' as const, x: x1 - len, y: midY - gap + i * gap },
    { action: 'line' as const, x: x1, y: midY - gap + i * gap },
  ])
}

/** 闭合大括号 `}` 路径（开口朝右，中间尖角指向文本） */
function closingBracePath(w: number, h: number): PathDefinition {
  const pad = w * 0.1
  const tipX = pad
  const stemX = w * 0.24
  const cuspX = w * 0.38
  const r = Math.min(w * 0.07, h * 0.07, 3)
  return [
    { action: 'move', x: tipX, y: h - pad },
    { action: 'quadraticCurve', x1: stemX, y1: h - pad, x: stemX, y: h - pad - r },
    { action: 'line', x: stemX, y: h * 0.56 },
    { action: 'quadraticCurve', x1: stemX, y1: h * 0.5, x: cuspX, y: h * 0.5 },
    { action: 'quadraticCurve', x1: stemX, y1: h * 0.5, x: stemX, y: h * 0.44 },
    { action: 'line', x: stemX, y: pad + r },
    { action: 'quadraticCurve', x1: stemX, y1: pad, x: tipX, y: pad },
  ]
}

/** 开放大括号 `{` 路径（开口朝左，中间尖角指向文本） */
function openingBracePath(w: number, h: number): PathDefinition {
  const pad = w * 0.1
  const tipX = w - pad
  const stemX = w * 0.76
  const cuspX = w * 0.62
  const r = Math.min(w * 0.07, h * 0.07, 3)
  return [
    { action: 'move', x: tipX, y: pad },
    { action: 'quadraticCurve', x1: stemX, y1: pad, x: stemX, y: pad + r },
    { action: 'line', x: stemX, y: h * 0.44 },
    { action: 'quadraticCurve', x1: stemX, y1: h * 0.5, x: cuspX, y: h * 0.5 },
    { action: 'quadraticCurve', x1: stemX, y1: h * 0.5, x: stemX, y: h * 0.56 },
    { action: 'line', x: stemX, y: h - pad - r },
    { action: 'quadraticCurve', x1: stemX, y1: h - pad, x: tipX, y: h - pad },
  ]
}

/** 右大括号备注面板图标：`}` + 文本行 */
function rightBraceDrawIcon(w: number, h: number): PathDefinition[] {
  const lineX = w * 0.44
  return [closingBracePath(w, h), ...remarkLinesRightAligned(w, h, lineX)]
}

/** 左大括号备注面板图标：文本行 + `{` */
function leftBraceDrawIcon(w: number, h: number): PathDefinition[] {
  const lineX = w * 0.56
  return [...remarkLinesLeftAligned(w, h, lineX), openingBracePath(w, h)]
}

/** 右大括号备注（旧 rightBrace：100×140） */
const rightBrace: ShapeDefinition = {
  name: 'rightBrace',
  title: '备注',
  category: 'basic',
  attribute: { linkable: false, container: true },
  props: { w: 100, h: 140 },
  fontStyle: { textAlign: 'left' },
  fillStyle: { type: 'none' },
  textBlock: [{ position: { x: 27, y: 0, w: 'w-27', h: 'h' }, text: '' }],
  drawIcon: rightBraceDrawIcon,
  path: [[
    { action: 'move', x: 0, y: 'h' },
    { action: 'quadraticCurve', x1: 'Math.min(w*0.1,9)', y1: 'h', x: 'Math.min(w*0.1,9)', y: 'h-Math.min(h*0.1,9)' },
    { action: 'line', x: 'Math.min(w*0.1,9)', y: 'h*0.5+Math.min(h*0.1,9)' },
    { action: 'quadraticCurve', x1: 'Math.min(w*0.1,9)', y1: 'h*0.5', x: 22, y: 'h*0.5' },
    { action: 'quadraticCurve', x1: 'Math.min(w*0.1,9)', y1: 'h*0.5', x: 'Math.min(w*0.1,9)', y: 'h*0.5-Math.min(h*0.1,9)' },
    { action: 'line', x: 'Math.min(w*0.1,9)', y: 'Math.min(h*0.1,9)' },
    { action: 'quadraticCurve', x1: 'Math.min(w*0.1,9)', y1: 0, x: 0, y: 0 },
  ]],
}

/** 左大括号备注（旧 leftBrace：100×140） */
const leftBrace: ShapeDefinition = {
  name: 'leftBrace',
  title: '备注',
  category: 'basic',
  attribute: { linkable: false, container: true },
  props: { w: 100, h: 140 },
  fontStyle: { textAlign: 'right' },
  fillStyle: { type: 'none' },
  textBlock: [{ position: { x: 0, y: 0, w: 'w-27', h: 'h' }, text: '' }],
  drawIcon: leftBraceDrawIcon,
  path: [[
    { action: 'move', x: 'w', y: 0 },
    { action: 'quadraticCurve', x1: 'w-Math.min(w*0.1,9)', y1: 0, x: 'w-Math.min(w*0.1,9)', y: 'Math.min(h*0.1,9)' },
    { action: 'line', x: 'w-Math.min(w*0.1,9)', y: 'h*0.5-Math.min(h*0.1,9)' },
    { action: 'quadraticCurve', x1: 'w-Math.min(w*0.1,9)', y1: 'h*0.5', x: 'w-22', y: 'h*0.5' },
    { action: 'quadraticCurve', x1: 'w-Math.min(w*0.1,9)', y1: 'h*0.5', x: 'w-Math.min(w*0.1,9)', y: 'h*0.5+Math.min(h*0.1,9)' },
    { action: 'line', x: 'w-Math.min(w*0.1,9)', y: 'h-Math.min(h*0.1,9)' },
    { action: 'quadraticCurve', x1: 'w-Math.min(w*0.1,9)', y1: 'h', x: 'w', y: 'h' },
  ]],
}

// ═══════════════════════════════════════════
// 导出列表
// ═══════════════════════════════════════════

export const basicShapes: ShapeDefinition[] = [
  // 基础几何
  rectangle,
  roundRectangle,
  round,
  triangle,
  diamond,
  polygon,
  hexagon,
  octagon,
  pentagon,
  // 曲线图形
  sector,
  sector2,
  cloud,
  comment,
  teardrop,
  // 十字形与 APQC
  cross,
  apqc,
  // 箭头类
  singleLeftArrow,
  singleRightArrow,
  doubleHorizontalArrow,
  singleUpArrow,
  singleDownArrow,
  doubleVerticalArrow,
  backArrow,
  rightBackArrow,
  corner,
  // 括号类
  braces,
  parentheses,
  rightBrace,
  leftBrace,
]
