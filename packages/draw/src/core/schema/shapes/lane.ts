import type { PathDefinition, ShapeDefinition } from '@/types'
import {
  buildSwimlanePath,
  buildSwimlaneTextBlocks,
  type SwimlaneLayout,
} from '@/core/editor/swimlane'

/** 泳池族（无二级标题行）布局；具体尺寸/方向/标题带厚见各形状定义 */
const poolLayout = (orientation: 'v' | 'h', laneCount: number, titleSize: number): SwimlaneLayout => ({
  orientation,
  laneCount,
  stageCount: 0,
  titleSize,
  hasHeadRow: false,
})

// 文字 orientation（与旧 lane.js 对齐）：
//   顶部标题带（verticalPool 等）→ horizontal（横排，从左到右）
//   左侧标题列（horizontalPool 等）→ vertical（竖排，从上到下）
// 样式（边线 1.5 / 50,50,50、填充白、微软雅黑 13 号）由 registry 默认值兜底。

// ═══════════════════════════════════════════
// 池/道（4 个）：透明容器 + 外框 + 头部分隔线
// ═══════════════════════════════════════════

// 面板图标（drawIcon）：参考样式为纯描边——外框 + 标题带/头部分隔用「单线」表达，
// 不用 close 闭合子路径（shapeThumb 对 drawIcon + fillStyle:'none' 的含 close 子路径
// 会填深色 iconFill），保证面板图标与拖到画布上的线性观感一致。
//   泳池 = 外框 + 标题带分隔线（带标签的完整容器）
//   泳道 = 外框 + 细分隔线（池内子分区）
//   双向泳池 = 外框 + 标题带分隔线 + 泳道中线

/** 泳池(垂直) 图标：外框 + 顶部标题带分隔线 */
function verticalPoolDrawIcon(w: number, h: number): PathDefinition[] {
  const band = Math.round(h * 0.18)
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

/** 泳道(垂直) 图标：外框 + 头部分隔线 */
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

/** 泳池(水平) 图标：外框 + 左侧标题列分隔线 */
function horizontalPoolDrawIcon(w: number, h: number): PathDefinition[] {
  const band = Math.round(w * 0.15)
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

/** 泳道(水平) 图标：外框 + 头部分隔线 */
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

/** 泳池(垂直) 250×540 — 标题带 40 + 1 泳道 */
const verticalPool: ShapeDefinition = {
  name: 'verticalPool',
  title: '泳池(垂直)',
  category: 'lane',
  props: { w: 250, h: 540 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { size: 16, orientation: 'horizontal' },
  laneCount: 1,
  stageCount: 0,
  anchors: [],
  drawIcon: verticalPoolDrawIcon,
  path: buildSwimlanePath(poolLayout('v', 1, 40)),
  textBlock: buildSwimlaneTextBlocks(poolLayout('v', 1, 40)),
}

/** 泳道(垂直) 250×500 — 标题带 30 + 1 泳道 */
const verticalLane: ShapeDefinition = {
  name: 'verticalLane',
  title: '泳道(垂直)',
  category: 'lane',
  props: { w: 250, h: 500 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { orientation: 'horizontal' },
  laneCount: 1,
  stageCount: 0,
  anchors: [],
  drawIcon: verticalLaneDrawIcon,
  path: buildSwimlanePath(poolLayout('v', 1, 30)),
  textBlock: buildSwimlaneTextBlocks(poolLayout('v', 1, 30)),
}

/** 泳池(水平) 640×200 — 标题列 40 + 1 泳道 */
const horizontalPool: ShapeDefinition = {
  name: 'horizontalPool',
  title: '泳池(水平)',
  category: 'lane',
  props: { w: 640, h: 200 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { size: 16, orientation: 'vertical' },
  laneCount: 1,
  stageCount: 0,
  anchors: [],
  drawIcon: horizontalPoolDrawIcon,
  path: buildSwimlanePath(poolLayout('h', 1, 40)),
  textBlock: buildSwimlaneTextBlocks(poolLayout('h', 1, 40)),
}

/** 泳道(水平) 600×200 — 标题列 30 + 1 泳道 */
const horizontalLane: ShapeDefinition = {
  name: 'horizontalLane',
  title: '泳道(水平)',
  category: 'lane',
  props: { w: 600, h: 200 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { orientation: 'vertical' },
  laneCount: 1,
  stageCount: 0,
  anchors: [],
  drawIcon: horizontalLaneDrawIcon,
  path: buildSwimlanePath(poolLayout('h', 1, 30)),
  textBlock: buildSwimlaneTextBlocks(poolLayout('h', 1, 30)),
}

// ═══════════════════════════════════════════
// 双向泳池（2 个）：在单向泳池基础上「翻倍」
//   水平 = 两个 horizontalPool 上下叠放（左侧标题列 + 水平中线 y=h/2）
//   垂直 = 两个 verticalPool 左右并排（顶部标题行 + 垂直中线 x=w/2）

/** 双向泳池(水平) 图标：外框 + 左侧标题列分隔线 + 水平中线（上下两个水平泳池） */
function bidirectionalPoolHDrawIcon(w: number, h: number): PathDefinition[] {
  const leftBand = Math.round(w * 0.15)
  return [
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: w, y: 0 },
      { action: 'line', x: w, y: h },
      { action: 'line', x: 0, y: h },
      { action: 'line', x: 0, y: 0 },
    ],
    [
      { action: 'move', x: leftBand, y: 0 },
      { action: 'line', x: leftBand, y: h },
    ],
    [
      { action: 'move', x: leftBand, y: Math.round(h / 2) },
      { action: 'line', x: w, y: Math.round(h / 2) },
    ],
  ]
}

/** 双向泳池(垂直) 图标：外框 + 顶部标题带分隔线 + 垂直中线（左右两个垂直泳池） */
function bidirectionalPoolVDrawIcon(w: number, h: number): PathDefinition[] {
  const topBand = Math.round(h * 0.18)
  return [
    [
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: w, y: 0 },
      { action: 'line', x: w, y: h },
      { action: 'line', x: 0, y: h },
      { action: 'line', x: 0, y: 0 },
    ],
    [
      { action: 'move', x: 0, y: topBand },
      { action: 'line', x: w, y: topBand },
    ],
    [
      { action: 'move', x: Math.round(w / 2), y: topBand },
      { action: 'line', x: Math.round(w / 2), y: h },
    ],
  ]
}

/** 双向泳池(水平) 640×400 — 标题列 40 + 2 泳道 */
const bidirectionalPoolH: ShapeDefinition = {
  name: 'bidirectionalPoolH',
  title: '双向泳池(水平)',
  category: 'lane',
  props: { w: 640, h: 400 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { size: 16, orientation: 'vertical' },
  laneCount: 2,
  stageCount: 0,
  anchors: [],
  drawIcon: bidirectionalPoolHDrawIcon,
  path: buildSwimlanePath(poolLayout('h', 2, 40)),
  textBlock: buildSwimlaneTextBlocks(poolLayout('h', 2, 40)),
}

/** 双向泳池(垂直) 500×540 — 标题带 40 + 2 泳道 */
const bidirectionalPoolV: ShapeDefinition = {
  name: 'bidirectionalPoolV',
  title: '双向泳池(垂直)',
  category: 'lane',
  props: { w: 500, h: 540 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { size: 16, orientation: 'horizontal' },
  laneCount: 2,
  stageCount: 0,
  anchors: [],
  drawIcon: bidirectionalPoolVDrawIcon,
  path: buildSwimlanePath(poolLayout('v', 2, 40)),
  textBlock: buildSwimlaneTextBlocks(poolLayout('v', 2, 40)),
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
// 泳道图（2 个）：外框 + 标题带 + N 泳道头格 + N 泳道分隔线 的复合形状。
// 泳道数/阶段数存于实例 laneCount/stageCount，path 与 textBlock 由
// core/editor/swimlane 构建（分隔线为 w/h 表达式，resize 按比例缩放）。
// ═══════════════════════════════════════════

/** 泳道图(垂直) 图标：外框 + 顶部深色标题带 + 泳道头行 + 3 列 */
function swimlaneVDrawIcon(w: number, h: number): PathDefinition[] {
  const band = Math.round(h * 0.16)
  const head = Math.round(h * 0.28)
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
    [
      { action: 'move', x: 0, y: head },
      { action: 'line', x: w, y: head },
    ],
    [
      { action: 'move', x: Math.round(w / 3), y: band },
      { action: 'line', x: Math.round(w / 3), y: h },
    ],
    [
      { action: 'move', x: Math.round((w * 2) / 3), y: band },
      { action: 'line', x: Math.round((w * 2) / 3), y: h },
    ],
  ]
}

/** 泳道图(水平) 图标：外框 + 左侧深色标题列 + 泳道头列 + 3 行 */
function swimlaneHDrawIcon(w: number, h: number): PathDefinition[] {
  const band = Math.round(w * 0.16)
  const head = Math.round(w * 0.28)
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
    [
      { action: 'move', x: head, y: 0 },
      { action: 'line', x: head, y: h },
    ],
    [
      { action: 'move', x: band, y: Math.round(h / 3) },
      { action: 'line', x: w, y: Math.round(h / 3) },
    ],
    [
      { action: 'move', x: band, y: Math.round((h * 2) / 3) },
      { action: 'line', x: w, y: Math.round((h * 2) / 3) },
    ],
  ]
}

/** 泳道图(垂直) 720×480，默认 2 泳道 */
const swimlaneV: ShapeDefinition = {
  name: 'swimlaneV',
  title: '泳道图(垂直)',
  category: 'lane',
  props: { w: 720, h: 480 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { orientation: 'horizontal' },
  laneCount: 2,
  stageCount: 0,
  anchors: [],
  drawIcon: swimlaneVDrawIcon,
  path: buildSwimlanePath({ orientation: 'v', laneCount: 2, stageCount: 0, titleSize: 40, hasHeadRow: true }),
  textBlock: buildSwimlaneTextBlocks({ orientation: 'v', laneCount: 2, stageCount: 0, titleSize: 40, hasHeadRow: true }),
}

/** 泳道图(水平) 720×480，默认 2 泳道 */
const swimlaneH: ShapeDefinition = {
  name: 'swimlaneH',
  title: '泳道图(水平)',
  category: 'lane',
  props: { w: 720, h: 480 },
  attribute: { container: true, rotatable: false, linkable: false },
  fillStyle: { type: 'none' },
  fontStyle: { orientation: 'horizontal' },
  laneCount: 2,
  stageCount: 0,
  anchors: [],
  drawIcon: swimlaneHDrawIcon,
  path: buildSwimlanePath({ orientation: 'h', laneCount: 2, stageCount: 0, titleSize: 40, hasHeadRow: true }),
  textBlock: buildSwimlaneTextBlocks({ orientation: 'h', laneCount: 2, stageCount: 0, titleSize: 40, hasHeadRow: true }),
}

// ═══════════════════════════════════════════
// 导出列表
// ═══════════════════════════════════════════

export const laneShapes: ShapeDefinition[] = [
  swimlaneV,
  swimlaneH,
  verticalPool,
  verticalLane,
  horizontalPool,
  horizontalLane,
  bidirectionalPoolH,
  bidirectionalPoolV,
  horizontalSeparator,
  verticalSeparator,
]
