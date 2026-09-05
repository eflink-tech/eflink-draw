import type { PathDefinition, ShapeDefinition } from '@/types'

// 文字 orientation（与旧 lane.js 对齐）：
//   顶部标题带（verticalPool 等）→ horizontal（横排，从左到右）
//   左侧标题列（horizontalPool 等）→ vertical（竖排，从上到下）
// 样式（边线 1.5 / 50,50,50、填充白、微软雅黑 13 号）由 registry 默认值兜底。

// ═══════════════════════════════════════════
// 池/道（4 个）：透明容器 + 外框 + 头部分隔线
// ═══════════════════════════════════════════

// 面板图标（drawIcon）：真实 Schema 里池/道只有「头部分隔线厚度（40/30）」之别，
// 缩略图下几乎无法区分，故面板用 drawIcon 单独表达语义差异：
//   泳池 = 闭合外框 + 深色标题带（带标签的完整容器）
//   泳道 = 闭合外框 + 细分隔线（池内子分区）
// 注：ShapePreview 对「drawIcon + fillStyle:'none'」的子路径，含 close 者会填深色（iconFill），
//     故标题带子路径用 close 触发填色；外框子路径显式闭合（不写 close）以保持仅描边。

/** 泳池(垂直) 图标：闭合外框 + 顶部深色标题带 */
function verticalPoolDrawIcon(w: number, h: number): PathDefinition[] {
  const band = Math.round(h * 0.2)
  return [
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: w, y: 0 },
      { action: 'line', x: w, y: h },
      { action: 'line', x: 0, y: h },
      { action: 'line', x: 0, y: 0 },
    ],
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: w, y: 0 },
      { action: 'line', x: w, y: band },
      { action: 'line', x: 0, y: band },
      { action: 'close' },
    ],
  ]
}

/** 泳道(垂直) 图标：闭合外框 + 头部分隔线 */
function verticalLaneDrawIcon(w: number, h: number): PathDefinition[] {
  const band = Math.round(h * 0.14)
  return [
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: w, y: 0 },
      { action: 'line', x: w, y: h },
      { action: 'line', x: 0, y: h },
      { action: 'line', x: 0, y: 0 },
    ],
    [
      { action: 'move', x: 0, y: band },
      { action: 'line', x: w, y: band },
    ],
  ]
}

/** 泳池(水平) 图标：闭合外框 + 左侧深色标题带 */
function horizontalPoolDrawIcon(w: number, h: number): PathDefinition[] {
  const band = Math.round(w * 0.2)
  return [
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: w, y: 0 },
      { action: 'line', x: w, y: h },
      { action: 'line', x: 0, y: h },
      { action: 'line', x: 0, y: 0 },
    ],
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: band, y: 0 },
      { action: 'line', x: band, y: h },
      { action: 'line', x: 0, y: h },
      { action: 'close' },
    ],
  ]
}

/** 泳道(水平) 图标：闭合外框 + 头部分隔线 */
function horizontalLaneDrawIcon(w: number, h: number): PathDefinition[] {
  const band = Math.round(w * 0.14)
  return [
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: w, y: 0 },
      { action: 'line', x: w, y: h },
      { action: 'line', x: 0, y: h },
      { action: 'line', x: 0, y: 0 },
    ],
    [
      { action: 'move', x: band, y: 0 },
      { action: 'line', x: band, y: h },
    ],
  ]
}

/** 泳池(垂直) 250×540 */
const verticalPool: ShapeDefinition = {
  name: 'verticalPool',
  title: '泳池(垂直)',
  category: 'lane',
  props: { w: 250, h: 540 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { size: 16, orientation: 'horizontal' },
  textBlock: [{ position: { x: 10, y: 0, w: 'w-20', h: 40 }, text: '' }],
  anchors: [],
  drawIcon: verticalPoolDrawIcon,
  path: [
    // 外框矩形
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 'w', y: 0 },
      { action: 'line', x: 'w', y: 'h' },
      { action: 'line', x: 0, y: 'h' },
      { action: 'close' },
    ],
    // 头部分隔线 y=40
    [
      { action: 'move', x: 0, y: 40 },
      { action: 'line', x: 'w', y: 40 },
    ],
  ],
}

/** 泳道(垂直) 250×500 */
const verticalLane: ShapeDefinition = {
  name: 'verticalLane',
  title: '泳道(垂直)',
  category: 'lane',
  props: { w: 250, h: 500 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { orientation: 'horizontal' },
  textBlock: [{ position: { x: 10, y: 0, w: 'w-20', h: 30 }, text: '' }],
  anchors: [],
  drawIcon: verticalLaneDrawIcon,
  path: [
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 'w', y: 0 },
      { action: 'line', x: 'w', y: 'h' },
      { action: 'line', x: 0, y: 'h' },
      { action: 'close' },
    ],
    // 头部分隔线 y=30
    [
      { action: 'move', x: 0, y: 30 },
      { action: 'line', x: 'w', y: 30 },
    ],
  ],
}

/** 泳池(水平) 640×200 */
const horizontalPool: ShapeDefinition = {
  name: 'horizontalPool',
  title: '泳池(水平)',
  category: 'lane',
  props: { w: 640, h: 200 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { size: 16, orientation: 'vertical' },
  textBlock: [{ position: { x: 0, y: 10, w: 40, h: 'h-20' }, text: '' }],
  anchors: [],
  drawIcon: horizontalPoolDrawIcon,
  path: [
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 'w', y: 0 },
      { action: 'line', x: 'w', y: 'h' },
      { action: 'line', x: 0, y: 'h' },
      { action: 'close' },
    ],
    // 头部分隔线 x=40
    [
      { action: 'move', x: 40, y: 0 },
      { action: 'line', x: 40, y: 'h' },
    ],
  ],
}

/** 泳道(水平) 600×200 */
const horizontalLane: ShapeDefinition = {
  name: 'horizontalLane',
  title: '泳道(水平)',
  category: 'lane',
  props: { w: 600, h: 200 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { orientation: 'vertical' },
  textBlock: [{ position: { x: 0, y: 10, w: 30, h: 'h-20' }, text: '' }],
  anchors: [],
  drawIcon: horizontalLaneDrawIcon,
  path: [
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 'w', y: 0 },
      { action: 'line', x: 'w', y: 'h' },
      { action: 'line', x: 0, y: 'h' },
      { action: 'close' },
    ],
    // 头部分隔线 x=30
    [
      { action: 'move', x: 30, y: 0 },
      { action: 'line', x: 30, y: 'h' },
    ],
  ],
}

// ═══════════════════════════════════════════
// 双向泳池（2 个）：在单向泳池基础上「翻倍」
//   水平 = 两个 horizontalPool 上下叠放（左侧标题列 + 水平中线 y=h/2）
//   垂直 = 两个 verticalPool 左右并排（顶部标题行 + 垂直中线 x=w/2）

/** 双向泳池(水平) 图标：外框 + 左侧竖带 + 水平中线（上下两个水平泳池） */
function bidirectionalPoolHDrawIcon(w: number, h: number): PathDefinition[] {
  const leftBand = Math.round(w * 0.12)
  return [
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: w, y: 0 },
      { action: 'line', x: w, y: h },
      { action: 'line', x: 0, y: h },
      { action: 'line', x: 0, y: 0 },
    ],
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: leftBand, y: 0 },
      { action: 'line', x: leftBand, y: h },
      { action: 'line', x: 0, y: h },
      { action: 'close' },
    ],
    [
      { action: 'move', x: leftBand, y: Math.round(h / 2) },
      { action: 'line', x: w, y: Math.round(h / 2) },
    ],
  ]
}

/** 双向泳池(垂直) 图标：外框 + 顶部横带 + 垂直中线（左右两个垂直泳池） */
function bidirectionalPoolVDrawIcon(w: number, h: number): PathDefinition[] {
  const topBand = Math.round(h * 0.12)
  return [
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: w, y: 0 },
      { action: 'line', x: w, y: h },
      { action: 'line', x: 0, y: h },
      { action: 'line', x: 0, y: 0 },
    ],
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: w, y: 0 },
      { action: 'line', x: w, y: topBand },
      { action: 'line', x: 0, y: topBand },
      { action: 'close' },
    ],
    [
      { action: 'move', x: Math.round(w / 2), y: topBand },
      { action: 'line', x: Math.round(w / 2), y: h },
    ],
  ]
}

/** 双向泳池(水平) 640×400 — 两个 horizontalPool(640×200) 上下叠放 */
const bidirectionalPoolH: ShapeDefinition = {
  name: 'bidirectionalPoolH',
  title: '双向泳池(水平)',
  category: 'lane',
  props: { w: 640, h: 400 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { size: 16, orientation: 'vertical' },
  textBlock: [{ position: { x: 0, y: 10, w: 40, h: 'h-20' }, text: '' }],
  anchors: [],
  drawIcon: bidirectionalPoolHDrawIcon,
  path: [
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 'w', y: 0 },
      { action: 'line', x: 'w', y: 'h' },
      { action: 'line', x: 0, y: 'h' },
      { action: 'close' },
    ],
    [
      { action: 'move', x: 40, y: 0 },
      { action: 'line', x: 40, y: 'h' },
    ],
    [
      { action: 'move', x: 40, y: 'h/2' },
      { action: 'line', x: 'w', y: 'h/2' },
    ],
  ],
}

/** 双向泳池(垂直) 500×540 — 两个 verticalPool(250×540) 左右并排 */
const bidirectionalPoolV: ShapeDefinition = {
  name: 'bidirectionalPoolV',
  title: '双向泳池(垂直)',
  category: 'lane',
  props: { w: 500, h: 540 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { size: 16, orientation: 'horizontal' },
  textBlock: [{ position: { x: 10, y: 0, w: 'w-20', h: 40 }, text: '' }],
  anchors: [],
  drawIcon: bidirectionalPoolVDrawIcon,
  path: [
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 'w', y: 0 },
      { action: 'line', x: 'w', y: 'h' },
      { action: 'line', x: 0, y: 'h' },
      { action: 'close' },
    ],
    [
      { action: 'move', x: 0, y: 40 },
      { action: 'line', x: 'w', y: 40 },
    ],
    [
      { action: 'move', x: 'w/2', y: 40 },
      { action: 'line', x: 'w/2', y: 'h' },
    ],
  ],
}

// 分隔条（2 个）：窄带 20px + 中线 + 「阶段」标签
// ═══════════════════════════════════════════

/** 分隔符(水平) 300×20 */
const horizontalSeparator: ShapeDefinition = {
  name: 'horizontalSeparator',
  title: '分隔符(水平)',
  category: 'lane',
  props: { w: 300, h: 20 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { textAlign: 'left', orientation: 'vertical' },
  textBlock: [{ position: { x: 0, y: 0, w: 30, h: 'h' }, text: '阶段' }],
  anchors: [],
  path: [[
    { action: 'move', x: 0, y: 'h/2' },
    { action: 'line', x: 'w', y: 'h/2' },
  ]],
}

/** 分隔符(垂直) 20×300 */
const verticalSeparator: ShapeDefinition = {
  name: 'verticalSeparator',
  title: '分隔符(垂直)',
  category: 'lane',
  props: { w: 20, h: 300 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { textAlign: 'right', orientation: 'horizontal' },
  textBlock: [{ position: { x: 0, y: 0, w: 'w', h: 20 }, text: '阶段' }],
  anchors: [],
  path: [[
    { action: 'move', x: 'w/2', y: 0 },
    { action: 'line', x: 'w/2', y: 'h' },
  ]],
}

// ═══════════════════════════════════════════
// 导出列表
// ═══════════════════════════════════════════

export const laneShapes: ShapeDefinition[] = [
  verticalPool,
  verticalLane,
  horizontalPool,
  horizontalLane,
  bidirectionalPoolH,
  bidirectionalPoolV,
  horizontalSeparator,
  verticalSeparator,
]
