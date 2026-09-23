// 泳道图（复合形状 swimlaneV / swimlaneH）布局构建
//   参考样式：外框 + 标题带（垂直=顶部横带 / 水平=左侧竖列）+ N 个泳道头格 + N 条泳道分隔线
//   分隔线坐标用 w/h 表达式表达，resize 时按比例缩放，无需重建 path；
//   仅泳道数/阶段数/方向变化时由 buildSwimlaneUpdate 重建实例 path 与 textBlock。
import type { ElementInstance, PathDefinition, TextBlock } from '@/types'

/** 垂直泳道：顶部标题带高（与 verticalPool 头带同口径） */
export const SWIMLANE_TITLE_V = 40
/** 垂直泳道：泳道头行高（与 verticalLane 头带同口径） */
export const SWIMLANE_HEADER_V = 30
/** 水平泳道：左侧标题列宽 */
export const SWIMLANE_TITLE_H = 40
/** 水平泳道：泳道头列宽 */
export const SWIMLANE_HEADER_H = 60

export const MIN_LANES = 1
export const MAX_LANES = 12
export const MIN_STAGES = 0
export const MAX_STAGES = 8

export type SwimlaneOrientation = 'v' | 'h'

export interface SwimlaneLayout {
  orientation: SwimlaneOrientation
  laneCount: number
  stageCount: number
}

export function isSwimlane(el: ElementInstance): boolean {
  return el.name === 'swimlaneV' || el.name === 'swimlaneH'
}

export function swimlaneLayoutOf(el: ElementInstance): SwimlaneLayout {
  return {
    orientation: el.name === 'swimlaneH' ? 'h' : 'v',
    laneCount: el.laneCount ?? 4,
    stageCount: el.stageCount ?? 0,
  }
}

const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, Math.round(v)))

/** 泳道分隔线位置表达式（第 i 条，共 n 道）：垂直泳道用 x 轴，水平泳道用 y 轴 */
function laneDividerExpr(axis: 'w' | 'h', i: number, n: number): string {
  return `${axis}*${i}/${n}`
}

/**
 * 构建泳道图 path：
 *   v = 外框 + y=40 标题带线 + y=70 泳道头线 + (n-1) 条纵向泳道线 + s 条横向阶段线
 *   h = 外框 + x=40 标题列线 + x=100 泳道头线 + (n-1) 条横向泳道线 + s 条纵向阶段线
 */
export function buildSwimlanePath(
  orientation: SwimlaneOrientation,
  laneCount: number,
  stageCount: number,
): PathDefinition[] {
  const n = clamp(laneCount, MIN_LANES, MAX_LANES)
  const s = clamp(stageCount, MIN_STAGES, MAX_STAGES)
  const frame: PathDefinition = [
    { action: 'move', x: 0, y: 0 },
    { action: 'line', x: 'w', y: 0 },
    { action: 'line', x: 'w', y: 'h' },
    { action: 'line', x: 0, y: 'h' },
    { action: 'close' },
  ]
  const paths: PathDefinition[] = [frame]

  if (orientation === 'v') {
    const head = SWIMLANE_TITLE_V + SWIMLANE_HEADER_V
    paths.push([
      { action: 'move', x: 0, y: SWIMLANE_TITLE_V },
      { action: 'line', x: 'w', y: SWIMLANE_TITLE_V },
    ])
    paths.push([
      { action: 'move', x: 0, y: head },
      { action: 'line', x: 'w', y: head },
    ])
    for (let i = 1; i < n; i++) {
      const x = laneDividerExpr('w', i, n)
      paths.push([
        { action: 'move', x, y: SWIMLANE_TITLE_V },
        { action: 'line', x, y: 'h' },
      ])
    }
    for (let j = 1; j <= s; j++) {
      const y = `${head}+(h-${head})*${j}/${s + 1}`
      paths.push([
        { action: 'move', x: 0, y },
        { action: 'line', x: 'w', y },
      ])
    }
  } else {
    const head = SWIMLANE_TITLE_H + SWIMLANE_HEADER_H
    paths.push([
      { action: 'move', x: SWIMLANE_TITLE_H, y: 0 },
      { action: 'line', x: SWIMLANE_TITLE_H, y: 'h' },
    ])
    paths.push([
      { action: 'move', x: head, y: 0 },
      { action: 'line', x: head, y: 'h' },
    ])
    for (let i = 1; i < n; i++) {
      const y = laneDividerExpr('h', i, n)
      paths.push([
        { action: 'move', x: SWIMLANE_TITLE_H, y },
        { action: 'line', x: 'w', y },
      ])
    }
    for (let j = 1; j <= s; j++) {
      const x = `${head}+(w-${head})*${j}/${s + 1}`
      paths.push([
        { action: 'move', x, y: 0 },
        { action: 'line', x, y: 'h' },
      ])
    }
  }
  return paths
}

/**
 * 构建泳道图 textBlock：块 0 = 标题（16 号），块 1..n = 各泳道头。
 * prev 传入旧块以在泳道数变化时保留已输入文字。
 */
export function buildSwimlaneTextBlocks(
  orientation: SwimlaneOrientation,
  laneCount: number,
  prev?: TextBlock[],
): TextBlock[] {
  const n = clamp(laneCount, MIN_LANES, MAX_LANES)
  const titleText = prev?.[0]?.text ?? ''
  const blocks: TextBlock[] = orientation === 'v'
    ? [{
        position: { x: 10, y: 0, w: 'w-20', h: SWIMLANE_TITLE_V },
        text: titleText,
        fontStyle: { size: 16 },
      }]
    : [{
        position: { x: 0, y: 10, w: SWIMLANE_TITLE_H, h: 'h-20' },
        text: titleText,
        fontStyle: { size: 16, orientation: 'vertical' },
      }]
  for (let i = 0; i < n; i++) {
    const text = prev?.[i + 1]?.text ?? ''
    blocks.push(orientation === 'v'
      ? {
          position: {
            x: i === 0 ? 8 : `w*${i}/${n}+8`,
            y: SWIMLANE_TITLE_V,
            w: `w/${n}-16`,
            h: SWIMLANE_HEADER_V,
          },
          text,
        }
      : {
          position: {
            x: SWIMLANE_TITLE_H + 4,
            y: i === 0 ? 4 : `h*${i}/${n}+4`,
            w: SWIMLANE_HEADER_H - 8,
            h: `h/${n}-8`,
          },
          text,
        })
  }
  return blocks
}

/**
 * 计算泳道布局变更对应的实例更新（path/textBlock 重建；换向时同步 name/尺寸）。
 * 由工具栏（泳道数/阶段数/方向）调用，经 updateElement 提交。
 */
export function buildSwimlaneUpdate(
  el: ElementInstance,
  changes: Partial<SwimlaneLayout>,
): Partial<ElementInstance> {
  const cur = swimlaneLayoutOf(el)
  const next: SwimlaneLayout = {
    orientation: changes.orientation ?? cur.orientation,
    laneCount: clamp(changes.laneCount ?? cur.laneCount, MIN_LANES, MAX_LANES),
    stageCount: clamp(changes.stageCount ?? cur.stageCount, MIN_STAGES, MAX_STAGES),
  }
  // 布局无变化时短路返回空更新，调用方据此跳过提交，
  // 避免在撤销栈留下无可感知变化的记录（如重复点击当前方向按钮）
  if (
    next.orientation === cur.orientation &&
    next.laneCount === cur.laneCount &&
    next.stageCount === cur.stageCount
  ) {
    return {}
  }
  const updates: Partial<ElementInstance> = {
    laneCount: next.laneCount,
    stageCount: next.stageCount,
    path: buildSwimlanePath(next.orientation, next.laneCount, next.stageCount),
    textBlock: buildSwimlaneTextBlocks(next.orientation, next.laneCount, el.textBlock),
  }
  if (next.orientation !== cur.orientation) {
    updates.name = next.orientation === 'v' ? 'swimlaneV' : 'swimlaneH'
    updates.title = next.orientation === 'v' ? '泳道图(垂直)' : '泳道图(水平)'
    updates.props = { ...el.props, w: el.props.h, h: el.props.w }
  }
  return updates
}
