import type { Anchor, FillStyle, PathAction, PathDefinition, ShapeDefinition } from '@/types'
import { DEFAULT_LINE_WIDTH } from '@/types'

// 尺寸、锚点、textBlock、路径均取自旧 Schema；样式（边线 2px / 50,50,50、

// ═══════════════════════════════════════════
// 基础几何图形
// ═══════════════════════════════════════════

/** 矩形（旧：100×70） */
export const rectangle: ShapeDefinition = {
  name: 'rectangle',
  title: '矩形',
  category: 'basic',
  props: { w: 96, h: 54 },
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
  props: { w: 96, h: 54 },
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
  props: { w: 54, h: 54 },
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
  props: { w: 62, h: 54 },
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
  props: { w: 96, h: 54 },
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
  props: { w: 57, h: 54 },
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
  props: { w: 65, h: 54 },
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
  props: { w: 54, h: 54 },
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
  props: { w: 54, h: 54 },
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
  props: { w: 54, h: 54 },
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

/**
 * 扇形生成器：90° 四方向档（拼圆四象限）与 270° 缺口档。
 *
 * 90° 档：圆心在外接框一角（origin 指定，默认左下），弧凸向对角，框即扇形
 * 包围盒；右上 / 左上 / 左下 / 右下四块拖到一起可拼成正圆。
 * 270° 档：圆心居中、缺口朝右上（缺口平分线 45°），外接框为整圆框。
 *
 * 弧按每段 ≤ 90° 切成三次贝塞尔（控制臂长 (4/3)·tan(Δ/4)·半径）；坐标按默认框
 * 归一成 w/h 比例式，非等比拉伸时泛化为椭圆扇形（与圆形 round 同款口径）。
 */
function sectorPie(
  name: string,
  title: string,
  theta: number,
  opts: { origin?: 'lb' | 'rb' | 'rt' | 'lt' } = {},
  size = 54,
): ShapeDefinition {
  const rad = (d: number) => (d * Math.PI) / 180
  const r = theta > 180 ? size / 2 : size
  // 90° 档的圆心角与起始数学角（顺时针扫 θ）：lb=圆心左下（弧凸右上）等
  const ORIGIN: Record<string, [number, number, number]> = {
    lb: [0, size, 90],
    rb: [size, size, 180],
    rt: [size, 0, 270],
    lt: [0, 0, 360],
  }
  let cx: number, cy: number, W: number, H: number, from: number, to: number
  if (theta > 180) {
    W = H = size
    cx = cy = size / 2
    const gap = (360 - theta) / 2
    from = 45 - gap
    to = from - theta
  } else {
    ;[cx, cy, from] = ORIGIN[opts.origin ?? 'lb']
    to = from - theta
    H = size
    W = size * Math.sin(rad(theta))
  }
  // 屏幕坐标（y 向下）：数学角 φ 的圆上点，及沿行进方向的切线单位向量
  const at = (phi: number): [number, number] => [cx + r * Math.cos(rad(phi)), cy - r * Math.sin(rad(phi))]
  const sign = Math.sign(to - from)
  const tangent = (phi: number): [number, number] => [-Math.sin(rad(phi)) * sign, -Math.cos(rad(phi)) * sign]
  const ex = (v: number) => `w*${(v / W).toFixed(4)}`
  const ey = (v: number) => `h*${(v / H).toFixed(4)}`

  const n = Math.ceil(Math.abs(to - from) / 90)
  const curves: PathAction[] = []
  for (let i = 0; i < n; i++) {
    const a = from + ((to - from) * i) / n
    const b = from + ((to - from) * (i + 1)) / n
    const k = (4 / 3) * Math.tan(rad(Math.abs(b - a) / 4)) * r
    const [ax, ay] = at(a)
    const [bx, by] = at(b)
    const [tax, tay] = tangent(a)
    const [tbx, tby] = tangent(b)
    curves.push({
      action: 'curve',
      x1: ex(ax + k * tax),
      y1: ey(ay + k * tay),
      x2: ex(bx - k * tbx),
      y2: ey(by - k * tby),
      x: ex(bx),
      y: ey(by),
    })
  }
  const [sx, sy] = at(from)
  const path: PathDefinition[] = [[
    { action: 'move', x: ex(cx), y: ey(cy) },
    { action: 'line', x: ex(sx), y: ey(sy) },
    ...curves,
    { action: 'close' },
  ]]

  // 锚点：小角度取弧起点 / 弧中 / 弧终点 / 圆心；大角度（缺口扇形）取弧上均匀四点
  let anchors: Anchor[]
  if (theta > 180) {
    anchors = [0, 1 / 3, 2 / 3, 1].map((t) => {
      const [x, y] = at(from + (to - from) * t)
      return { x: ex(x), y: ey(y) }
    })
  } else {
    const [ax, ay] = at(from)
    const [mx, my] = at((from + to) / 2)
    const [bx, by] = at(to)
    anchors = [
      { x: ex(ax), y: ey(ay) },
      { x: ex(mx), y: ey(my) },
      { x: ex(bx), y: ey(by) },
      { x: ex(cx), y: ey(cy) },
    ]
  }

  let textBlock: ShapeDefinition['textBlock']
  if (theta > 180) {
    textBlock = [{ position: { x: 'w*0.12', y: 'h*0.28', w: 'w*0.6', h: 'h*0.6' }, text: '' }]
  } else {
    // 正圆扇形重心距圆心 (2/3)r·sin(θ/2)/(θ/2)，文字区以重心为中心
    const half = rad(theta) / 2
    const d = ((2 / 3) * r * Math.sin(half)) / half
    const gx = cx + d * Math.cos(rad((from + to) / 2))
    const gy = cy - d * Math.sin(rad((from + to) / 2))
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
    textBlock = [{
      position: {
        x: ex(clamp(gx - W * 0.275, W * 0.02, W * 0.45)),
        y: ey(clamp(gy - H * 0.23, H * 0.02, H * 0.52)),
        w: 'w*0.55',
        h: 'h*0.46',
      },
      text: '',
    }]
  }

  return {
    name,
    title,
    category: 'basic',
    props: { w: Math.round(W), h: Math.round(H) },
    anchors,
    textBlock,
    path,
  }
}

/** 扇形 90° 四方向（生成器见 sectorPie）：四块拼成正圆；sector 是旧素材的 180° 档 */
const sector90TR = sectorPie('sector90TR', '扇形（90° 右上）', 90)
const sector90TL = sectorPie('sector90TL', '扇形（90° 左上）', 90, { origin: 'rb' })
const sector90BL = sectorPie('sector90BL', '扇形（90° 左下）', 90, { origin: 'rt' })
const sector90BR = sectorPie('sector90BR', '扇形（90° 右下）', 90, { origin: 'lt' })
const sector270 = sectorPie('sector270', '扇形（270°）', 270)

/**
 * 弧形（90° 环段）四方向生成器：与扇形 90° 同参数化（origin 指定圆心所在角，
 * 外弧贴框、内弧按 0.55 系数收缩），四方向拼在一起是圆环。
 */
function arcBandPie(name: string, title: string, origin: 'lb' | 'rb' | 'rt' | 'lt', size = 54): ShapeDefinition {
  const rad = (d: number) => (d * Math.PI) / 180
  const R = size
  const r = size * 0.55
  const ORIGIN: Record<string, [number, number, number]> = {
    lb: [0, size, 90],
    rb: [size, size, 180],
    rt: [size, 0, 270],
    lt: [0, 0, 360],
  }
  const [cx, cy, from] = ORIGIN[origin]
  const to = from - 90
  const at = (phi: number, radius: number): [number, number] => [cx + radius * Math.cos(rad(phi)), cy - radius * Math.sin(rad(phi))]
  const sign = Math.sign(to - from)
  const tangent = (phi: number): [number, number] => [-Math.sin(rad(phi)) * sign, -Math.cos(rad(phi)) * sign]
  const ex = (v: number) => `w*${(v / size).toFixed(4)}`
  const ey = (v: number) => `h*${(v / size).toFixed(4)}`
  const kOut = (4 / 3) * Math.tan(rad(90 / 4)) * R
  const kIn = (4 / 3) * Math.tan(rad(90 / 4)) * r

  const [ox, oy] = at(from, R)
  const [tx, ty] = at(to, R)
  const [tox, toy] = tangent(from)
  const [ttx, tty] = tangent(to)
  const [ix0, iy0] = at(to, r)
  const [ix1, iy1] = at(from, r)
  const path: PathDefinition[] = [[
    { action: 'move', x: ex(ox), y: ey(oy) },
    { action: 'curve', x1: ex(ox + kOut * tox), y1: ey(oy + kOut * toy), x2: ex(tx - kOut * ttx), y2: ey(ty - kOut * tty), x: ex(tx), y: ey(ty) },
    { action: 'line', x: ex(ix0), y: ey(iy0) },
    // 内弧反向行进（to → from）：控制臂方向与外弧相反
    { action: 'curve', x1: ex(ix0 - kIn * ttx), y1: ey(iy0 - kIn * tty), x2: ex(ix1 + kIn * tox), y2: ey(iy1 + kIn * toy), x: ex(ix1), y: ey(iy1) },
    { action: 'close' },
  ]]

  const mid = (from + to) / 2
  const [amx, amy] = at(mid, R)
  const [imx, imy] = at(mid, r)
  const [ax, ay] = at(from, R)
  const [bx, by] = at(to, R)
  const anchors: Anchor[] = [
    { x: ex(ax), y: ey(ay) },
    { x: ex(amx), y: ey(amy) },
    { x: ex(bx), y: ey(by) },
    { x: ex(imx), y: ey(imy) },
  ]

  // 90° 环段质心：角平分线上 (2/3)·(R³−r³)/(R²−r²)·sin45°/(π/4)，文字区以质心为中心
  const dBar = ((2 / 3) * ((R ** 3 - r ** 3) / (R ** 2 - r ** 2)) * Math.sin(rad(45))) / rad(45)
  const gx = cx + dBar * Math.cos(rad(mid))
  const gy = cy - dBar * Math.sin(rad(mid))
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
  const textBlock: ShapeDefinition['textBlock'] = [{
    position: {
      x: ex(clamp(gx - size * 0.24, size * 0.02, size * 0.5)),
      y: ey(clamp(gy - size * 0.21, size * 0.02, size * 0.56)),
      w: 'w*0.48',
      h: 'h*0.42',
    },
    text: '',
  }]

  return {
    name,
    title,
    category: 'basic',
    props: { w: Math.round(size), h: Math.round(size) },
    anchors,
    textBlock,
    path,
  }
}

/** 弧形四方向（生成器见 arcBandPie）：四块拼成圆环 */
const arcBandTR = arcBandPie('arcBandTR', '弧形（右上）', 'lb')
const arcBandTL = arcBandPie('arcBandTL', '弧形（左上）', 'rb')
const arcBandBL = arcBandPie('arcBandBL', '弧形（左下）', 'rt')
const arcBandBR = arcBandPie('arcBandBR', '弧形（右下）', 'lt')

/** 扇形2（旧 sector2：80×45） */
const sector2: ShapeDefinition = {
  name: 'sector2',
  title: '扇形2',
  category: 'basic',
  props: { w: 96, h: 54 },
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
  props: { w: 69, h: 54 },
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
  props: { w: 69, h: 54 },
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
  props: { w: 54, h: 54 },
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
  props: { w: 54, h: 54 },
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
  props: { w: 72, h: 54 },
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
  props: { w: 81, h: 54 },
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
  props: { w: 81, h: 54 },
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
  props: { w: 81, h: 54 },
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
  props: { w: 36, h: 54 },
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
  props: { w: 36, h: 54 },
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
  props: { w: 36, h: 54 },
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
  props: { w: 54, h: 54 },
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
  props: { w: 54, h: 54 },
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
  props: { w: 54, h: 54 },
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

/** 备注便签（黄色便笺，右上折角） */
const note: ShapeDefinition = {
  name: 'note',
  title: '备注',
  category: 'basic',
  props: { w: 120, h: 120 },
  fillStyle: { type: 'solid', color: '255,242,164' },
  fontStyle: { textAlign: 'left', vAlign: 'top' },
  textBlock: [{ position: { x: 8, y: 8, w: 'w-16', h: 'h-16' }, text: '' }],
  anchors: [],
  path: [
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 'w*0.62', y: 0 },
      { action: 'line', x: 'w', y: 'h*0.2' },
      { action: 'line', x: 'w', y: 'h' },
      { action: 'line', x: 0, y: 'h' },
      { action: 'close' },
    ],
    [
      { action: 'move', x: 'w*0.62', y: 0 },
      { action: 'line', x: 'w*0.62', y: 'h*0.2' },
      { action: 'line', x: 'w', y: 'h*0.2' },
    ],
  ],
}

/** 直线（斜线段，左下 → 右上） */
const line: ShapeDefinition = {
  name: 'line',
  title: '直线',
  category: 'basic',
  props: { w: 100, h: 60 },
  attribute: { container: false, rotatable: true, linkable: false },
  fillStyle: { type: 'none' },
  textBlock: [],
  anchors: [],
  path: [[
    { action: 'move', x: 0, y: 'h' },
    { action: 'line', x: 'w', y: 0 },
  ]],
}

/** 箭头线（斜线段 + 末端箭头，左下 → 右上） */
const arrowLine: ShapeDefinition = {
  name: 'arrowLine',
  title: '箭头线',
  category: 'basic',
  props: { w: 100, h: 60 },
  attribute: { container: false, rotatable: true, linkable: false },
  fillStyle: { type: 'none' },
  textBlock: [],
  anchors: [],
  path: [
    [
      { action: 'move', x: 0, y: 'h' },
      { action: 'line', x: 'w', y: 0 },
    ],
    [
      { action: 'move', x: 'w-Math.min(w*0.2,14)', y: 0 },
      { action: 'line', x: 'w', y: 0 },
      { action: 'line', x: 'w', y: 'Math.min(h*0.35,14)' },
    ],
  ],
}

/** 直角三角形（直角在左下） */
const rightTriangle: ShapeDefinition = {
  name: 'rightTriangle',
  title: '直角三角形',
  category: 'basic',
  props: { w: 80, h: 70 },
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 0, y: 'h' },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'close' },
  ]],
}

/**
 * 代码块面板图标：外框 + 深色顶栏 + `</>` 字形。
 * schema 的 lineStyle.lineWidth=0（画布无边框）会被缩略图继承为 0 描边，
 * 故每个子路径显式指定填充与描边宽度。
 */
function codeBlockDrawIcon(w: number, h: number): PathDefinition[] {
  const band = Math.round(h * 0.26)
  const none: Partial<FillStyle> = { type: 'none' }
  const dark: Partial<FillStyle> = { type: 'solid', color: '50,50,50' }
  const stroke = { lineWidth: DEFAULT_LINE_WIDTH }
  return [
    // 外框（开放闭合，仅描边）
    {
      actions: [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: w, y: 0 },
        { action: 'line', x: w, y: h },
        { action: 'line', x: 0, y: h },
        { action: 'line', x: 0, y: 0 },
      ],
      fillStyle: none,
      lineStyle: stroke,
    },
    // 顶栏（深色实心）
    {
      actions: [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: w, y: 0 },
        { action: 'line', x: w, y: band },
        { action: 'line', x: 0, y: band },
        { action: 'close' },
      ],
      fillStyle: dark,
      lineStyle: stroke,
    },
    // '<'
    {
      actions: [
        { action: 'move', x: w * 0.36, y: band + (h - band) * 0.22 },
        { action: 'line', x: w * 0.2, y: band + (h - band) * 0.5 },
        { action: 'line', x: w * 0.36, y: band + (h - band) * 0.78 },
      ],
      fillStyle: none,
      lineStyle: stroke,
    },
    // '/'
    {
      actions: [
        { action: 'move', x: w * 0.46, y: band + (h - band) * 0.78 },
        { action: 'line', x: w * 0.54, y: band + (h - band) * 0.22 },
      ],
      fillStyle: none,
      lineStyle: stroke,
    },
    // '>'
    {
      actions: [
        { action: 'move', x: w * 0.64, y: band + (h - band) * 0.22 },
        { action: 'line', x: w * 0.8, y: band + (h - band) * 0.5 },
        { action: 'line', x: w * 0.64, y: band + (h - band) * 0.78 },
      ],
      fillStyle: none,
      lineStyle: stroke,
    },
  ]
}

/** 代码块：灰底无边框、等宽字体左上对齐、文本区给行号槽留白 */
const codeBlock: ShapeDefinition = {
  name: 'codeBlock',
  title: '代码块',
  category: 'basic',
  attribute: { container: false, rotatable: false, linkable: false },
  props: { w: 400, h: 320 },
  fillStyle: { type: 'solid', color: '246,247,250' },
  lineStyle: { lineWidth: 0 },
  fontStyle: {
    size: 13,
    fontFamily: 'courier',
    color: '51,51,51',
    textAlign: 'left',
    vAlign: 'top',
  },
  textBlock: [{ position: { x: 44, y: 14, w: 'w-56', h: 'h-28' }, text: '' }],
  anchors: [],
  drawIcon: codeBlockDrawIcon,
  path: [[
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'close' },
  ]],
}

export const basicShapes: ShapeDefinition[] = [
  // 文本与便签
  note,
  // 基础几何
  rectangle,
  roundRectangle,
  round,
  triangle,
  rightTriangle,
  diamond,
  polygon,
  hexagon,
  octagon,
  pentagon,
  // 线段
  line,
  arrowLine,
  // 曲线图形
  sector,
  sector90TR,
  sector90TL,
  sector90BL,
  sector90BR,
  sector270,
  sector2,
  arcBandTR,
  arcBandTL,
  arcBandBL,
  arcBandBR,
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
  // 代码块
  codeBlock,
]
