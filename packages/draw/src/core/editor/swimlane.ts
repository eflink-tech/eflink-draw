// 泳道族（复合形状）布局构建：泳道图 swimlaneV/H + 泳池/泳道/双向泳池 6 形状
//   泳道图 = 外框 + 标题带 + 二级标题行 + N 泳道（grid 变体，hasHeadRow=true）
//   泳池/泳道/双向泳池 = 外框 + 标题带 + N 泳道（简化变体，无二级标题行）
//   分隔线坐标用 w/h 表达式表达，resize 时按比例缩放，无需重建 path；
//   仅泳道数/阶段数/方向/颜色变化时由 buildSwimlaneUpdate 重建实例 path 与 textBlock。
//   变体差异（标题带厚 / 是否带二级标题行 / 换向名称映射）由图形名静态决定，不落实例存储，
//   旧文档中的泳池/泳道实例（无 laneCount）据此获得兼容布局。
import type { ElementInstance, PathDefinition, RGBColor, StyledPathSegment, TextBlock } from '@/types'

/** 泳道图二级标题行厚（两方向同厚） */
export const SWIMLANE_HEADER = 40

export const MIN_LANES = 1
export const MAX_LANES = 12
export const MIN_STAGES = 0
export const MAX_STAGES = 8

/** 拖拽调整泳道宽度时的最小 lane 尺寸（屏幕像素） */
export const MIN_LANE_PX = 30

export type SwimlaneOrientation = 'v' | 'h'

export interface SwimlaneLayout {
  orientation: SwimlaneOrientation
  laneCount: number
  stageCount: number
  /** 标题带厚（垂直=顶部横带高 / 水平=左侧标题列宽），缺省 40 */
  titleSize?: number
  /** 是否带二级标题行（泳道图 true；泳池/泳道/双向泳池 false），缺省 true */
  hasHeadRow?: boolean
  laneColors?: (RGBColor | undefined)[]
  /** 二级标题（泳道头格）逐格背景色，索引与 laneColors 对齐 */
  laneHeadColors?: (RGBColor | undefined)[]
  titleColor?: RGBColor
  laneRatios?: number[]
}

/** 泳道族单个形状的静态元数据（由图形名决定，不落实例存储） */
interface SwimlaneShapeMeta {
  orientation: SwimlaneOrientation
  /** 同族换向时的图形名/标题映射 */
  names: { v: string; h: string }
  titles: { v: string; h: string }
  /** 旧数据实例无 laneCount 时的兜底泳道数 */
  defaultLanes: number
  titleSize: number
  hasHeadRow: boolean
}

const FAMILY_META = {
  swimlane: {
    names: { v: 'swimlaneV', h: 'swimlaneH' },
    titles: { v: '泳道图(垂直)', h: '泳道图(水平)' },
    defaultLanes: 2,
    titleSize: 40,
    hasHeadRow: true,
  },
  pool: {
    names: { v: 'verticalPool', h: 'horizontalPool' },
    titles: { v: '泳池(垂直)', h: '泳池(水平)' },
    defaultLanes: 1,
    titleSize: 40,
    hasHeadRow: false,
  },
  lane: {
    names: { v: 'verticalLane', h: 'horizontalLane' },
    titles: { v: '泳道(垂直)', h: '泳道(水平)' },
    defaultLanes: 1,
    titleSize: 30,
    hasHeadRow: false,
  },
  bidirectional: {
    names: { v: 'bidirectionalPoolV', h: 'bidirectionalPoolH' },
    titles: { v: '双向泳池(垂直)', h: '双向泳池(水平)' },
    defaultLanes: 2,
    titleSize: 40,
    hasHeadRow: false,
  },
} as const satisfies Record<string, Omit<SwimlaneShapeMeta, 'orientation'>>

const SWIMLANE_SHAPE_META: Record<string, SwimlaneShapeMeta> = {
  swimlaneV: { orientation: 'v', ...FAMILY_META.swimlane },
  swimlaneH: { orientation: 'h', ...FAMILY_META.swimlane },
  verticalPool: { orientation: 'v', ...FAMILY_META.pool },
  horizontalPool: { orientation: 'h', ...FAMILY_META.pool },
  verticalLane: { orientation: 'v', ...FAMILY_META.lane },
  horizontalLane: { orientation: 'h', ...FAMILY_META.lane },
  bidirectionalPoolV: { orientation: 'v', ...FAMILY_META.bidirectional },
  bidirectionalPoolH: { orientation: 'h', ...FAMILY_META.bidirectional },
}

export function isSwimlane(el: ElementInstance): boolean {
  return SWIMLANE_SHAPE_META[el.name] !== undefined
}

export function swimlaneLayoutOf(el: ElementInstance): SwimlaneLayout {
  const meta = SWIMLANE_SHAPE_META[el.name] ?? SWIMLANE_SHAPE_META.swimlaneV
  return {
    orientation: meta.orientation,
    laneCount: el.laneCount ?? meta.defaultLanes,
    stageCount: el.stageCount ?? 0,
    titleSize: meta.titleSize,
    hasHeadRow: meta.hasHeadRow,
    laneColors: el.laneColors,
    laneHeadColors: el.laneHeadColors,
    titleColor: el.titleColor,
    laneRatios: el.laneRatios,
  }
}

const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, Math.round(v)))

/** 同步数组长度：扩则追加 undefined 槽，缩则截断尾部；undefined 输入返回 undefined */
function syncArrayLength<T>(arr: T[] | undefined, newLen: number): T[] | undefined {
  if (!arr) return undefined
  if (arr.length === newLen) return arr
  if (arr.length > newLen) return arr.slice(0, newLen)
  const result = [...arr]
  while (result.length < newLen) result.push(undefined as T)
  return result
}

/**
 * 计算分隔线位置表达式。
 * 有 laneRatios 时按比率生成 `w*r` / `h*r` 表达式；否则退化为等分 `w*i/n`。
 */
export function computeDividerExprs(
  orientation: SwimlaneOrientation,
  laneCount: number,
  laneRatios?: number[],
): string[] {
  const n = clamp(laneCount, MIN_LANES, MAX_LANES)
  const axis = orientation === 'v' ? 'w' : 'h'
  if (laneRatios && laneRatios.length === n - 1) {
    return laneRatios.map((r) => `${axis}*${r}`)
  }
  return Array.from({ length: n - 1 }, (_, i) => `${axis}*${i + 1}/${n}`)
}

/**
 * 钳位单个 divider 的比率值，确保不越过相邻 divider 且最小 lane 宽度 ≥ minRatio。
 * 返回新的 ratios 数组（不可变更新）。
 */
export function clampRatio(
  ratios: number[],
  index: number,
  minRatio: number,
): number[] {
  const result = [...ratios]
  const lo = index > 0 ? result[index - 1] + minRatio : minRatio
  const hi = index < result.length - 1 ? result[index + 1] - minRatio : 1 - minRatio
  result[index] = Math.max(lo, Math.min(hi, result[index]))
  return result
}

/**
 * 构建泳道族填充矩形（StyledPathSegment），用于 per-lane 背景色与标题背景色。
 * 填充矩形必须在描边路径之前绘制，避免填充色盖住描边。
 */
function fillRectSegment(
  x0: string | number,
  y0: string | number,
  x1: string | number,
  y1: string | number,
  color: RGBColor,
): StyledPathSegment {
  return {
    actions: [
      { action: 'move', x: x0, y: y0 },
      { action: 'line', x: x1, y: y0 },
      { action: 'line', x: x1, y: y1 },
      { action: 'line', x: x0, y: y1 },
      { action: 'close' },
    ],
    fillStyle: { type: 'solid', color },
  }
}

/** 获取 lane i 的起止表达式（基于 laneRatios 或等分） */
function laneBounds(
  orientation: SwimlaneOrientation,
  i: number,
  n: number,
  laneRatios?: number[],
): { start: string | number; end: string | number } {
  const axis = orientation === 'v' ? 'w' : 'h'
  if (laneRatios && laneRatios.length === n - 1) {
    const s = i === 0 ? 0 : `${axis}*${laneRatios[i - 1]}`
    const e = `${axis}*${laneRatios[i] ?? 1}`
    return { start: s, end: e }
  }
  return {
    start: i === 0 ? 0 : `${axis}*${i}/${n}`,
    end: `${axis}*${i + 1}/${n}`,
  }
}

const makeFrame = (): PathDefinition => [
  { action: 'move', x: 0, y: 0 },
  { action: 'line', x: 'w', y: 0 },
  { action: 'line', x: 'w', y: 'h' },
  { action: 'line', x: 0, y: 'h' },
  { action: 'close' },
]

/**
 * 构建泳道族 path：
 *   填充矩形（标题 + 各 lane，仅当颜色存在时）→ 外框 → 标题分隔线
 *   → 二级标题分隔线（仅泳道图）→ 泳道分隔线 → 阶段线
 *   v = 垂直方向（列 = lane）；h = 水平方向（行 = lane）
 */
export function buildSwimlanePath(layout: SwimlaneLayout): PathDefinition[] {
  const { orientation, laneColors, laneHeadColors, titleColor, laneRatios } = layout
  const titleSize = layout.titleSize ?? 40
  const hasHeadRow = layout.hasHeadRow ?? true
  const n = clamp(layout.laneCount, MIN_LANES, MAX_LANES)
  const s = clamp(layout.stageCount, MIN_STAGES, MAX_STAGES)
  const bodyStart = titleSize + (hasHeadRow ? SWIMLANE_HEADER : 0)
  const paths: PathDefinition[] = []

  if (orientation === 'v') {
    // 填充矩形（先于描边路径）
    if (titleColor) {
      paths.push(fillRectSegment(0, 0, 'w', titleSize, titleColor))
    }
    for (let i = 0; i < n; i++) {
      const { start, end } = laneBounds(orientation, i, n, laneRatios)
      const hc = hasHeadRow ? laneHeadColors?.[i] : undefined
      if (hc) paths.push(fillRectSegment(start, titleSize, end, bodyStart, hc))
      const c = laneColors?.[i]
      if (c) paths.push(fillRectSegment(start, bodyStart, end, 'h', c))
    }

    paths.push(makeFrame())

    // 标题分隔线
    paths.push([
      { action: 'move', x: 0, y: titleSize },
      { action: 'line', x: 'w', y: titleSize },
    ])
    // 二级标题分隔线
    if (hasHeadRow) {
      paths.push([
        { action: 'move', x: 0, y: bodyStart },
        { action: 'line', x: 'w', y: bodyStart },
      ])
    }
    // 泳道分隔线（从标题带下缘到图底）
    for (const x of computeDividerExprs(orientation, n, laneRatios)) {
      paths.push([
        { action: 'move', x, y: titleSize },
        { action: 'line', x, y: 'h' },
      ])
    }
    // 阶段线
    for (let j = 1; j <= s; j++) {
      const y = `${bodyStart}+(h-${bodyStart})*${j}/${s + 1}`
      paths.push([
        { action: 'move', x: 0, y },
        { action: 'line', x: 'w', y },
      ])
    }
  } else {
    // 填充矩形
    if (titleColor) {
      paths.push(fillRectSegment(0, 0, titleSize, 'h', titleColor))
    }
    for (let i = 0; i < n; i++) {
      const { start, end } = laneBounds(orientation, i, n, laneRatios)
      const hc = hasHeadRow ? laneHeadColors?.[i] : undefined
      if (hc) paths.push(fillRectSegment(titleSize, start, bodyStart, end, hc))
      const c = laneColors?.[i]
      if (c) paths.push(fillRectSegment(bodyStart, start, 'w', end, c))
    }

    paths.push(makeFrame())

    // 标题分隔线
    paths.push([
      { action: 'move', x: titleSize, y: 0 },
      { action: 'line', x: titleSize, y: 'h' },
    ])
    // 二级标题分隔线
    if (hasHeadRow) {
      paths.push([
        { action: 'move', x: bodyStart, y: 0 },
        { action: 'line', x: bodyStart, y: 'h' },
      ])
    }
    // 泳道分隔线（从标题带右缘到图右）
    for (const y of computeDividerExprs(orientation, n, laneRatios)) {
      paths.push([
        { action: 'move', x: titleSize, y },
        { action: 'line', x: 'w', y },
      ])
    }
    // 阶段线
    for (let j = 1; j <= s; j++) {
      const x = `${bodyStart}+(w-${bodyStart})*${j}/${s + 1}`
      paths.push([
        { action: 'move', x, y: 0 },
        { action: 'line', x, y: 'h' },
      ])
    }
  }
  return paths
}

/** 泳道在局部坐标下的矩形 = 该泳道可被填色的区域 */
export interface LaneRect {
  x: number
  y: number
  w: number
  h: number
}

/** 画布上可点选填色的区域：标题带（整条）/ 二级标题格（仅泳道图）/ 泳道体 */
export type SwimlaneTargetKind = 'title' | 'head' | 'lane'

/** 填色目标；kind='title' 时 index 恒为 -1 */
export interface SwimlaneTarget {
  kind: SwimlaneTargetKind
  index: number
}

/** 带图形 id 的目标，供 editorStore 记录画布点选结果 */
export interface ActiveSwimlaneTarget extends SwimlaneTarget {
  id: string
}

const TITLE_TARGET: SwimlaneTarget = { kind: 'title', index: -1 }
const FIRST_LANE_TARGET: SwimlaneTarget = { kind: 'lane', index: 0 }

/** 泳道 i 在泳道轴（垂直图=x，水平图=y）上的起止像素 */
function laneAxisBounds(
  i: number,
  n: number,
  size: number,
  laneRatios?: number[],
): { start: number; end: number } {
  const custom = laneRatios && laneRatios.length === n - 1
  const start = i === 0 ? 0 : custom ? laneRatios![i - 1]! * size : (size * i) / n
  const end = i === n - 1 ? size : custom ? laneRatios![i]! * size : (size * (i + 1)) / n
  return { start, end }
}

/** 泳道 i 泳道体的局部坐标矩形（二级标题格以下）；下标越界或非泳道族返回 null */
export function laneRectOf(el: ElementInstance, index: number): LaneRect | null {
  if (!isSwimlane(el)) return null
  const layout = swimlaneLayoutOf(el)
  const { laneCount, laneRatios, orientation } = layout
  if (index < 0 || index >= laneCount) return null
  const { w, h } = el.props
  const bodyStart = (layout.titleSize ?? 40) + (layout.hasHeadRow ? SWIMLANE_HEADER : 0)
  if (orientation === 'h') {
    const { start, end } = laneAxisBounds(index, laneCount, h, laneRatios)
    return { x: bodyStart, y: start, w: w - bodyStart, h: end - start }
  }
  const { start, end } = laneAxisBounds(index, laneCount, w, laneRatios)
  return { x: start, y: bodyStart, w: end - start, h: h - bodyStart }
}

/** 第 index 条泳道的二级标题格（泳道头格）局部坐标矩形；简化变体无二级标题行返回 null */
export function headRectOf(el: ElementInstance, index: number): LaneRect | null {
  if (!isSwimlane(el)) return null
  const layout = swimlaneLayoutOf(el)
  if (!layout.hasHeadRow) return null
  const { laneCount, laneRatios, orientation, titleSize } = layout
  if (index < 0 || index >= laneCount) return null
  const { w, h } = el.props
  if (orientation === 'h') {
    const { start, end } = laneAxisBounds(index, laneCount, h, laneRatios)
    return { x: titleSize ?? 40, y: start, w: SWIMLANE_HEADER, h: end - start }
  }
  const { start, end } = laneAxisBounds(index, laneCount, w, laneRatios)
  return { x: start, y: titleSize ?? 40, w: end - start, h: SWIMLANE_HEADER }
}

/** 标题带的局部坐标矩形（垂直=顶部横带 / 水平=左侧竖列） */
export function titleRectOf(el: ElementInstance): LaneRect | null {
  if (!isSwimlane(el)) return null
  const { w, h } = el.props
  const layout = swimlaneLayoutOf(el)
  return layout.orientation === 'h'
    ? { x: 0, y: 0, w: layout.titleSize ?? 40, h }
    : { x: 0, y: 0, w, h: layout.titleSize ?? 40 }
}

/** 填色目标对应的局部坐标矩形 = 该目标实际会被填色的区域 */
export function targetRectOf(el: ElementInstance, target: SwimlaneTarget): LaneRect | null {
  if (target.kind === 'title') return titleRectOf(el)
  return target.kind === 'head' ? headRectOf(el, target.index) : laneRectOf(el, target.index)
}

/**
 * 当前填色目标：画布点击选中的区域优先，未选或已失效（泳道数变少/该变体无二级标题行）
 * 时回落到第 1 条泳道。画布高亮与工具栏共用此口径，保证「看到的高亮」就是「被改色的区域」。
 */
export function resolveTarget(
  el: ElementInstance,
  active: ActiveSwimlaneTarget | null,
): SwimlaneTarget {
  if (!active || active.id !== el.id) return FIRST_LANE_TARGET
  if (active.kind === 'title') return TITLE_TARGET
  const layout = swimlaneLayoutOf(el)
  if (active.kind === 'head' && !layout.hasHeadRow) return FIRST_LANE_TARGET
  return active.index < layout.laneCount
    ? { kind: active.kind, index: active.index }
    : FIRST_LANE_TARGET
}

/**
 * 局部坐标点命中的填色目标：一级标题带 / 第 i 格的二级标题（仅泳道图）/ 第 i 条泳道本体。
 * 与 targetRectOf 同口径，保证「点中的高亮」就是「被着色的区域」。
 */
export function targetAtLocal(el: ElementInstance, lx: number, ly: number): SwimlaneTarget | null {
  if (!isSwimlane(el)) return null
  const layout = swimlaneLayoutOf(el)
  const { laneCount, laneRatios, orientation } = layout
  const titleSize = layout.titleSize ?? 40
  const { w, h } = el.props
  const isH = orientation === 'h'
  if (lx < 0 || lx > w || ly < 0 || ly > h) return null
  const depth = isH ? lx : ly
  const kind: SwimlaneTargetKind =
    depth < titleSize
      ? 'title'
      : layout.hasHeadRow && depth < titleSize + SWIMLANE_HEADER
        ? 'head'
        : 'lane'
  if (kind === 'title') return TITLE_TARGET
  const pos = isH ? ly : lx
  const size = isH ? h : w
  for (let i = 0; i < laneCount; i++) {
    const { start, end } = laneAxisBounds(i, laneCount, size, laneRatios)
    if (pos >= start && (pos < end || i === laneCount - 1)) return { kind, index: i }
  }
  return null
}

/**
 * 构建泳道族 textBlock：块 0 = 标题（16 号），泳道图另有块 1..n = 各泳道头。
 * prev 传入旧块以在泳道数变化时保留已输入文字。
 */
export function buildSwimlaneTextBlocks(
  layout: SwimlaneLayout,
  prev?: TextBlock[],
): TextBlock[] {
  const { orientation, laneRatios } = layout
  const titleSize = layout.titleSize ?? 40
  const hasHeadRow = layout.hasHeadRow ?? true
  const n = clamp(layout.laneCount, MIN_LANES, MAX_LANES)
  const titleText = prev?.[0]?.text ?? ''
  const blocks: TextBlock[] = orientation === 'v'
    ? [{
        position: { x: 10, y: 0, w: 'w-20', h: titleSize },
        text: titleText,
        fontStyle: { size: 16 },
      }]
    : [{
        position: { x: 0, y: 10, w: titleSize, h: 'h-20' },
        text: titleText,
        fontStyle: { size: 16, orientation: 'vertical' },
      }]
  if (!hasHeadRow) return blocks
  for (let i = 0; i < n; i++) {
    const text = prev?.[i + 1]?.text ?? ''

    if (orientation === 'v') {
      // 等分情况保持简洁表达式（与旧行为一致）
      if (!laneRatios || laneRatios.length !== n - 1) {
        blocks.push({
          position: {
            x: i === 0 ? 8 : `w*${i}/${n}+8`,
            y: titleSize,
            w: `w/${n}-16`,
            h: SWIMLANE_HEADER,
          },
          text,
        })
      } else {
        const start = i === 0 ? 0 : `w*${laneRatios[i - 1]}`
        const end = `w*${laneRatios[i] ?? 1}`
        const xExpr = i === 0 ? 8 : `${start}+8`
        const wExpr = `${end}-${start}-16`
        blocks.push({
          position: { x: xExpr, y: titleSize, w: wExpr, h: SWIMLANE_HEADER },
          text,
        })
      }
    } else {
      if (!laneRatios || laneRatios.length !== n - 1) {
        blocks.push({
          position: {
            x: titleSize + 4,
            y: i === 0 ? 4 : `h*${i}/${n}+4`,
            w: SWIMLANE_HEADER - 8,
            h: `h/${n}-8`,
          },
          text,
        })
      } else {
        const start = i === 0 ? 0 : `h*${laneRatios[i - 1]}`
        const end = `h*${laneRatios[i] ?? 1}`
        const yExpr = i === 0 ? 4 : `${start}+4`
        const hExpr = `${end}-${start}-8`
        blocks.push({
          position: { x: titleSize + 4, y: yExpr, w: SWIMLANE_HEADER - 8, h: hExpr },
          text,
        })
      }
    }
  }
  return blocks
}

/**
 * 计算泳道族布局变更对应的实例更新（path/textBlock 重建；换向时同步同族 name/尺寸）。
 * 由工具栏（泳道数/阶段数/方向/颜色）调用，经 updateElement 提交。
 */
export function buildSwimlaneUpdate(
  el: ElementInstance,
  changes: Partial<SwimlaneLayout>,
): Partial<ElementInstance> {
  const cur = swimlaneLayoutOf(el)
  const nextOrientation = changes.orientation ?? cur.orientation
  const nextLaneCount = clamp(changes.laneCount ?? cur.laneCount, MIN_LANES, MAX_LANES)
  const nextStageCount = clamp(changes.stageCount ?? cur.stageCount, MIN_STAGES, MAX_STAGES)

  // laneCount 变化时：同步各色数组长度、重置 laneRatios 为等分
  let nextLaneColors = changes.laneColors ?? cur.laneColors
  let nextLaneHeadColors = changes.laneHeadColors ?? cur.laneHeadColors
  let nextLaneRatios = changes.laneRatios ?? cur.laneRatios
  if (changes.laneCount != null && changes.laneCount !== cur.laneCount) {
    nextLaneColors = syncArrayLength(nextLaneColors, nextLaneCount)
    nextLaneHeadColors = syncArrayLength(nextLaneHeadColors, nextLaneCount)
    nextLaneRatios = undefined
  } else if (changes.laneColors != null) {
    nextLaneColors = changes.laneColors
  }
  if ('laneHeadColors' in changes && changes.laneHeadColors != null) {
    nextLaneHeadColors = changes.laneHeadColors
  }

  const nextTitleColor = 'titleColor' in changes ? changes.titleColor : cur.titleColor

  // 布局无变化时短路返回空更新（避免无效撤销记录）
  const layoutChanged =
    nextOrientation !== cur.orientation ||
    nextLaneCount !== cur.laneCount ||
    nextStageCount !== cur.stageCount
  // 用 in 判断：显式传 undefined 表示清除该色，不能被 ?? 当成「未改动」吞掉
  const colorChanged =
    'laneColors' in changes ||
    'laneHeadColors' in changes ||
    ('titleColor' in changes && nextTitleColor !== cur.titleColor) ||
    'laneRatios' in changes

  if (!layoutChanged && !colorChanged) return {}

  const nextLayout: SwimlaneLayout = {
    orientation: nextOrientation,
    laneCount: nextLaneCount,
    stageCount: nextStageCount,
    titleSize: cur.titleSize,
    hasHeadRow: cur.hasHeadRow,
    laneColors: nextLaneColors,
    laneHeadColors: nextLaneHeadColors,
    titleColor: nextTitleColor,
    laneRatios: nextLaneRatios,
  }

  const updates: Partial<ElementInstance> = {
    laneCount: nextLaneCount,
    stageCount: nextStageCount,
    laneColors: nextLaneColors,
    laneHeadColors: nextLaneHeadColors,
    titleColor: nextTitleColor,
    laneRatios: nextLaneRatios,
    path: buildSwimlanePath(nextLayout),
    textBlock: buildSwimlaneTextBlocks(nextLayout, el.textBlock),
  }

  if (nextOrientation !== cur.orientation) {
    const meta = SWIMLANE_SHAPE_META[el.name]
    updates.name = meta ? meta.names[nextOrientation] : el.name
    updates.title = meta ? meta.titles[nextOrientation] : el.title
    updates.props = { ...el.props, w: el.props.h, h: el.props.w }
  }

  return updates
}
