// 泳道族布局构建测试：path/textBlock 表达式与布局变更更新（泳道图 grid 变体 + 泳池族简化变体）
import { describe, it, expect } from 'vitest'
import {
  buildSwimlanePath,
  buildSwimlaneTextBlocks,
  buildSwimlaneUpdate,
  computeDividerExprs,
  clampRatio,
  isSwimlane,
  swimlaneLayoutOf,
  resolveTarget,
  headRectOf,
  laneRectOf,
  targetAtLocal,
  targetRectOf,
  titleRectOf,
  MAX_LANES,
  MIN_LANE_PX,
  type SwimlaneLayout,
} from '../swimlane'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'

/** 泳道图（grid）布局 */
const grid = (orientation: 'v' | 'h', laneCount: number, stageCount = 0): SwimlaneLayout => ({
  orientation,
  laneCount,
  stageCount,
  titleSize: 40,
  hasHeadRow: true,
})

/** 泳池族（无二级标题行）布局 */
const pool = (orientation: 'v' | 'h', laneCount = 1, titleSize = 40): SwimlaneLayout => ({
  orientation,
  laneCount,
  stageCount: 0,
  titleSize,
  hasHeadRow: false,
})

describe('buildSwimlanePath', () => {
  it('垂直：外框 + 标题带线 + 泳道头线 + (n-1) 泳道线', () => {
    const paths = buildSwimlanePath(grid('v', 4))
    expect(paths).toHaveLength(6)
    // 泳道分隔线为 w 表达式（resize 按比例缩放）
    expect(paths[3]).toEqual([
      { action: 'move', x: 'w*1/4', y: 40 },
      { action: 'line', x: 'w*1/4', y: 'h' },
    ])
  })

  it('垂直：阶段线横向贯穿且为 h 表达式', () => {
    const paths = buildSwimlanePath(grid('v', 2, 1))
    // 3 + 1 泳道线 + 1 阶段线
    expect(paths).toHaveLength(5)
    expect(paths[4]).toEqual([
      { action: 'move', x: 0, y: '80+(h-80)*1/2' },
      { action: 'line', x: 'w', y: '80+(h-80)*1/2' },
    ])
  })

  it('水平：泳道线为 h 表达式、阶段线纵向', () => {
    const paths = buildSwimlanePath(grid('h', 3, 1))
    expect(paths[3]).toEqual([
      { action: 'move', x: 40, y: 'h*1/3' },
      { action: 'line', x: 'w', y: 'h*1/3' },
    ])
    expect(paths[5]).toEqual([
      { action: 'move', x: '80+(w-80)*1/2', y: 0 },
      { action: 'line', x: '80+(w-80)*1/2', y: 'h' },
    ])
  })

  it('泳道数/阶段数越界收敛', () => {
    expect(buildSwimlanePath(grid('v', 99))).toHaveLength(3 + MAX_LANES - 1)
    expect(buildSwimlanePath(grid('v', 0))).toHaveLength(3)
    expect(buildSwimlanePath(grid('v', 4, -3))).toHaveLength(6)
  })

  it('带 laneRatios：分隔线使用自定义比率表达式', () => {
    const ratios = [0.3, 0.5, 0.75]
    const paths = buildSwimlanePath({ ...grid('v', 4), laneRatios: ratios })
    // 无填充矩形 (titleColor/laneColors 均为 undefined) + 外框 (0) + 标题分隔线 (1) + 泳道头分隔线 (2) + 3 条泳道分隔线 (3-5)
    expect(paths).toHaveLength(6)
    expect(paths[3]).toEqual([
      { action: 'move', x: 'w*0.3', y: 40 },
      { action: 'line', x: 'w*0.3', y: 'h' },
    ])
    expect(paths[4]).toEqual([
      { action: 'move', x: 'w*0.5', y: 40 },
      { action: 'line', x: 'w*0.5', y: 'h' },
    ])
  })

  it('带 titleColor：生成标题填充矩形', () => {
    const paths = buildSwimlanePath({ ...grid('v', 2), titleColor: '255,0,0' })
    // 标题填充 (0) + 外框 (1) + 标题分隔线 (2) + 泳道头分隔线 (3) + 1 条泳道分隔线 (4)
    expect(paths).toHaveLength(5)
    expect('fillStyle' in paths[0]).toBe(true)
    if ('fillStyle' in paths[0]) {
      expect(paths[0].fillStyle?.color).toBe('255,0,0')
    }
  })

  it('带 laneHeadColors：只为有色的那几格生成二级标题填充矩形（标题带与泳道头分隔线之间）', () => {
    const paths = buildSwimlanePath({ ...grid('v', 3), laneHeadColors: ['255,0,0', undefined, '0,0,255'], titleColor: '9,9,9' })
    const fills = paths.filter((p) => 'fillStyle' in p)
    expect(fills).toHaveLength(3) // 标题带 + 2 个二级标题格
    if ('fillStyle' in fills[1] && 'fillStyle' in fills[2]) {
      expect(fills[1].fillStyle?.color).toBe('255,0,0')
      expect(fills[2].fillStyle?.color).toBe('0,0,255')
      // 二级标题格纵向范围 = 40..80
      expect(fills[1].actions[0]).toEqual({ action: 'move', x: 0, y: 40 })
      expect(fills[1].actions[2]).toEqual({ action: 'line', x: 'w*1/3', y: 80 })
    }
  })

  it('带 laneColors：生成泳道填充矩形', () => {
    const laneColors = ['255,0,0', undefined, '0,255,0']
    const paths = buildSwimlanePath({ ...grid('v', 3), laneColors })
    // 标题填充 (无，因为 titleColor 未指定) + 泳道 1 填充 (0) + 泳道 3 填充 (1) + 外框 (2) + ...
    const fillSegments = paths.filter(p => 'fillStyle' in p)
    expect(fillSegments).toHaveLength(2)
  })
})

describe('buildSwimlanePath 泳池族（无二级标题行）', () => {
  it('单泳道：仅外框 + 标题带线，无头线无泳道线', () => {
    const paths = buildSwimlanePath(pool('v', 1, 40))
    expect(paths).toHaveLength(2)
    expect(paths[1]).toEqual([
      { action: 'move', x: 0, y: 40 },
      { action: 'line', x: 'w', y: 40 },
    ])
  })

  it('双向（2 泳道）：标题带线 + 1 条泳道分隔线', () => {
    const paths = buildSwimlanePath(pool('v', 2, 40))
    expect(paths).toHaveLength(3)
    expect(paths[2]).toEqual([
      { action: 'move', x: 'w*1/2', y: 40 },
      { action: 'line', x: 'w*1/2', y: 'h' },
    ])
  })

  it('泳道(垂直) 标题带厚 30：分隔线从 y=30 起', () => {
    const paths = buildSwimlanePath(pool('v', 2, 30))
    expect(paths).toHaveLength(3)
    expect(paths[1]).toEqual([
      { action: 'move', x: 0, y: 30 },
      { action: 'line', x: 'w', y: 30 },
    ])
    expect(paths[2]).toEqual([
      { action: 'move', x: 'w*1/2', y: 30 },
      { action: 'line', x: 'w*1/2', y: 'h' },
    ])
  })

  it('水平双向：泳道分隔线为 h 表达式，从标题列右缘起', () => {
    const paths = buildSwimlanePath(pool('h', 2, 40))
    expect(paths).toHaveLength(3)
    expect(paths[2]).toEqual([
      { action: 'move', x: 40, y: 'h*1/2' },
      { action: 'line', x: 'w', y: 'h*1/2' },
    ])
  })

  it('带 titleColor + laneColors：填充自标题带下缘覆盖整个泳道体', () => {
    const paths = buildSwimlanePath({ ...pool('v', 1, 40), titleColor: '1,2,3', laneColors: ['9,9,9'] })
    const fills = paths.filter((p) => 'fillStyle' in p)
    expect(fills).toHaveLength(2)
    if ('fillStyle' in fills[0] && 'fillStyle' in fills[1]) {
      expect(fills[0].fillStyle?.color).toBe('1,2,3')
      expect(fills[0].actions[0]).toEqual({ action: 'move', x: 0, y: 0 })
      expect(fills[0].actions[2]).toEqual({ action: 'line', x: 'w', y: 40 })
      expect(fills[1].fillStyle?.color).toBe('9,9,9')
      expect(fills[1].actions[0]).toEqual({ action: 'move', x: 0, y: 40 })
      expect(fills[1].actions[2]).toEqual({ action: 'line', x: 'w*1/1', y: 'h' })
    }
  })

  it('阶段线从标题带下缘起算', () => {
    const paths = buildSwimlanePath({ ...pool('v', 1, 40), stageCount: 1 })
    expect(paths).toHaveLength(3)
    expect(paths[2]).toEqual([
      { action: 'move', x: 0, y: '40+(h-40)*1/2' },
      { action: 'line', x: 'w', y: '40+(h-40)*1/2' },
    ])
  })
})

describe('computeDividerExprs', () => {
  it('等分：返回 w*i/n 表达式', () => {
    const exprs = computeDividerExprs('v', 4)
    expect(exprs).toEqual(['w*1/4', 'w*2/4', 'w*3/4'])
  })

  it('自定义比率：返回 w*r 表达式', () => {
    const exprs = computeDividerExprs('v', 3, [0.3, 0.7])
    expect(exprs).toEqual(['w*0.3', 'w*0.7'])
  })

  it('水平方向：使用 h 轴', () => {
    const exprs = computeDividerExprs('h', 2, [0.4])
    expect(exprs).toEqual(['h*0.4'])
  })
})

describe('clampRatio', () => {
  const totalSize = 720
  const minRatio = MIN_LANE_PX / totalSize

  it('第一个 divider：下限为 minRatio', () => {
    const ratios = [0.25, 0.5, 0.75]
    const clamped = clampRatio(ratios, 0, minRatio)
    expect(clamped[0]).toBeGreaterThanOrEqual(minRatio)
  })

  it('拖拽到极小值：钳位到 minRatio', () => {
    const ratios = [0.25, 0.5, 0.75]
    ratios[0] = 0.01
    const clamped = clampRatio(ratios, 0, minRatio)
    expect(clamped[0] * totalSize).toBeGreaterThanOrEqual(MIN_LANE_PX - 0.01)
  })

  it('中间 divider：不得越过相邻 divider', () => {
    const ratios = [0.25, 0.5, 0.75]
    ratios[1] = 0.26 // 尝试越过前一个
    const clamped = clampRatio(ratios, 1, minRatio)
    expect(clamped[1]).toBeGreaterThan(clamped[0])
  })
})

describe('buildSwimlaneTextBlocks', () => {
  it('垂直：标题块 16 号 + N 个泳道头块', () => {
    const blocks = buildSwimlaneTextBlocks(grid('v', 3))
    expect(blocks).toHaveLength(4)
    expect(blocks[0]!.fontStyle).toEqual({ size: 16 })
    expect(blocks[1]!.position).toMatchObject({ x: 8, y: 40, h: 40 })
    expect(blocks[2]!.position).toMatchObject({ x: 'w*1/3+8', w: 'w/3-16' })
  })

  it('水平：标题块竖排', () => {
    const blocks = buildSwimlaneTextBlocks(grid('h', 2))
    expect(blocks[0]!.fontStyle).toEqual({ size: 16, orientation: 'vertical' })
    expect(blocks[1]!.position).toMatchObject({ x: 44, y: 4, w: 32 })
  })

  it('泳道数变化保留已输入文字', () => {
    const prev = buildSwimlaneTextBlocks(grid('v', 2))
    prev[0]!.text = '订单流程'
    prev[2]!.text = '审批'
    const next = buildSwimlaneTextBlocks(grid('v', 3), prev)
    expect(next[0]!.text).toBe('订单流程')
    expect(next[2]!.text).toBe('审批')
    expect(next[3]!.text).toBe('')
  })

  it('带 laneRatios：泳道头位置按比率计算', () => {
    const ratios = [0.3, 0.5, 0.75]
    const blocks = buildSwimlaneTextBlocks({ ...grid('v', 4), laneRatios: ratios })
    expect(blocks).toHaveLength(5)
    // 泳道头 1: x = w*0 + 8, w = w*0.3 - 0 - 16
    expect(blocks[1]!.position.x).toBe(8)
    expect(blocks[1]!.position.w).toBe('w*0.3-0-16')
    // 泳道头 2: x = w*0.3 + 8, w = w*0.5 - w*0.3 - 16
    expect(blocks[2]!.position.x).toBe('w*0.3+8')
  })

  it('泳池族：仅标题块，厚度随 titleSize', () => {
    expect(buildSwimlaneTextBlocks(pool('v', 1, 40))).toEqual([
      { position: { x: 10, y: 0, w: 'w-20', h: 40 }, text: '', fontStyle: { size: 16 } },
    ])
    expect(buildSwimlaneTextBlocks(pool('v', 1, 30))[0]!.position.h).toBe(30)
    expect(buildSwimlaneTextBlocks(pool('h', 1, 40))).toEqual([
      { position: { x: 0, y: 10, w: 40, h: 'h-20' }, text: '', fontStyle: { size: 16, orientation: 'vertical' } },
    ])
  })
})

describe('buildSwimlaneUpdate', () => {
  const make = () => shapeRegistry.createElement('swimlaneV', 100, 100)!

  it('改泳道数：重建 path/textBlock 并写回 laneCount', () => {
    const el = make()
    const u = buildSwimlaneUpdate(el, { laneCount: 6 })
    expect(u.laneCount).toBe(6)
    expect(u.path).toHaveLength(3 + 5)
    expect(u.textBlock).toHaveLength(7)
    expect(u.name).toBeUndefined()
  })

  it('换向：name/标题互换、宽高对调', () => {
    const el = make()
    const u = buildSwimlaneUpdate(el, { orientation: 'h' })
    expect(u.name).toBe('swimlaneH')
    expect(u.title).toBe('泳道图(水平)')
    expect(u.props).toMatchObject({ w: el.props.h, h: el.props.w })
  })

  it('入参越界收敛（laneCount 99 → MAX_LANES）', () => {
    const el = make()
    const u = buildSwimlaneUpdate(el, { laneCount: 99 })
    expect(u.laneCount).toBe(MAX_LANES)
    expect(u.textBlock).toHaveLength(MAX_LANES + 1)
  })

  it('布局无变化返回空更新（避免无效撤销记录）', () => {
    const el = make()
    expect(buildSwimlaneUpdate(el, {})).toEqual({})
    expect(buildSwimlaneUpdate(el, { orientation: 'v' })).toEqual({})
    expect(buildSwimlaneUpdate(el, { laneCount: 2, stageCount: 0 })).toEqual({})
  })

  it('swimlaneLayoutOf / isSwimlane', () => {
    const el = make()
    expect(isSwimlane(el)).toBe(true)
    expect(swimlaneLayoutOf(el)).toEqual({
      orientation: 'v', laneCount: 2, stageCount: 0, titleSize: 40, hasHeadRow: true,
    })
    expect(isSwimlane(shapeRegistry.createElement('rectangle', 0, 0)!)).toBe(false)
  })

  it('改 titleColor：path 含填充矩形', () => {
    const el = make()
    const u = buildSwimlaneUpdate(el, { titleColor: '255,0,0' })
    expect(u.titleColor).toBe('255,0,0')
    const fillSegments = u.path?.filter(p => 'fillStyle' in p) ?? []
    expect(fillSegments.length).toBeGreaterThan(0)
  })

  it('改 laneColors：path 含泳道填充矩形', () => {
    const el = make()
    const laneColors = ['255,0,0', undefined]
    const u = buildSwimlaneUpdate(el, { laneColors })
    expect(u.laneColors).toEqual(laneColors)
    const fillSegments = u.path?.filter(p => 'fillStyle' in p) ?? []
    expect(fillSegments.length).toBe(1) // 泳道 1
  })

  it('laneCount 变化：laneColors 同步扩缩、laneRatios 重置', () => {
    const el = make()
    el.laneCount = 4
    el.laneColors = ['255,0,0', '0,255,0', '0,0,255', '128,128,128']
    el.laneRatios = [0.2, 0.4, 0.6]

    // 减少泳道数
    const u1 = buildSwimlaneUpdate(el, { laneCount: 2 })
    expect(u1.laneColors).toEqual(['255,0,0', '0,255,0'])
    expect(u1.laneRatios).toBeUndefined()

    // 增加泳道数
    const u2 = buildSwimlaneUpdate(el, { laneCount: 6 })
    expect(u2.laneColors).toEqual(['255,0,0', '0,255,0', '0,0,255', '128,128,128', undefined, undefined])
    expect(u2.laneRatios).toBeUndefined()
  })

  it('仅改颜色：laneRatios 保留', () => {
    const el = make()
    el.laneRatios = [0.3, 0.5, 0.75]
    const u = buildSwimlaneUpdate(el, { titleColor: '255,0,0' })
    expect(u.laneRatios).toEqual([0.3, 0.5, 0.75])
  })
})

describe('buildSwimlaneUpdate 泳池族', () => {
  it('泳池换向：映射同族名称与标题（verticalPool ↔ horizontalPool）', () => {
    const el = shapeRegistry.createElement('verticalPool', 100, 100)!
    const u = buildSwimlaneUpdate(el, { orientation: 'h' })
    expect(u.name).toBe('horizontalPool')
    expect(u.title).toBe('泳池(水平)')
    expect(u.props).toMatchObject({ w: el.props.h, h: el.props.w })
  })

  it('双向泳池换向：bidirectionalPoolV ↔ bidirectionalPoolH', () => {
    const el = shapeRegistry.createElement('bidirectionalPoolV', 100, 100)!
    const u = buildSwimlaneUpdate(el, { orientation: 'h' })
    expect(u.name).toBe('bidirectionalPoolH')
    expect(u.title).toBe('双向泳池(水平)')
  })

  it('泳池加泳道：path 仍无二级标题行，textBlock 仅标题块', () => {
    const el = shapeRegistry.createElement('verticalPool', 100, 100)!
    const u = buildSwimlaneUpdate(el, { laneCount: 3 })
    expect(u.laneCount).toBe(3)
    // 外框 + 标题带线 + 2 泳道分隔线
    expect(u.path).toHaveLength(4)
    expect(u.textBlock).toHaveLength(1)
  })

  it('泳道族 titleSize/hasHeadRow 由图形名决定', () => {
    expect(swimlaneLayoutOf(shapeRegistry.createElement('verticalLane', 0, 0)!).titleSize).toBe(30)
    expect(swimlaneLayoutOf(shapeRegistry.createElement('horizontalLane', 0, 0)!).hasHeadRow).toBe(false)
    expect(swimlaneLayoutOf(shapeRegistry.createElement('bidirectionalPoolH', 0, 0)!)).toMatchObject({
      orientation: 'h', laneCount: 2, titleSize: 40, hasHeadRow: false,
    })
  })

  it('旧数据实例无 laneCount：按图形名兜底（泳池 1 / 双向 2 / 泳道图 2）', () => {
    const legacy = shapeRegistry.createElement('bidirectionalPoolV', 0, 0)!
    delete (legacy as Partial<ElementLike>).laneCount
    expect(swimlaneLayoutOf(legacy).laneCount).toBe(2)

    const legacyPool = shapeRegistry.createElement('verticalPool', 0, 0)!
    delete (legacyPool as Partial<ElementLike>).laneCount
    expect(swimlaneLayoutOf(legacyPool).laneCount).toBe(1)

    const legacySwimlane = shapeRegistry.createElement('swimlaneV', 0, 0)!
    delete (legacySwimlane as Partial<ElementLike>).laneCount
    expect(swimlaneLayoutOf(legacySwimlane).laneCount).toBe(2)
  })

  it('泳池填色：titleColor/laneColors 正常生效', () => {
    const el = shapeRegistry.createElement('verticalPool', 100, 100)!
    const u = buildSwimlaneUpdate(el, { titleColor: '1,2,3', laneColors: ['9,9,9'] })
    const fills = u.path?.filter(p => 'fillStyle' in p) ?? []
    expect(fills).toHaveLength(2)
  })
})

/** 测试辅助：仅需 id / laneCount 字段 */
interface ElementLike {
  id?: string
  laneCount?: number
}

describe('laneRectOf / headRectOf / titleRectOf / targetAtLocal / resolveTarget（泳道图）', () => {
  const makeV = () => shapeRegistry.createElement('swimlaneV', 100, 100)!
  const makeH = () => shapeRegistry.createElement('swimlaneH', 100, 100)!

  it('垂直：三段矩形互不重叠，覆盖标题带 + 二级标题行 + 泳道体', () => {
    const el = makeV()
    expect(titleRectOf(el)).toEqual({ x: 0, y: 0, w: 720, h: 40 })
    expect(headRectOf(el, 0)).toEqual({ x: 0, y: 40, w: 360, h: 40 })
    expect(headRectOf(el, 1)).toEqual({ x: 360, y: 40, w: 360, h: 40 })
    expect(headRectOf(el, 2)).toBeNull()
    expect(laneRectOf(el, 0)).toEqual({ x: 0, y: 80, w: 360, h: 400 })
    expect(laneRectOf(el, 1)).toEqual({ x: 360, y: 80, w: 360, h: 400 })
    expect(laneRectOf(el, 2)).toBeNull()
  })

  it('垂直：点按深度分别命中一级标题 / 二级标题格 / 泳道体', () => {
    const el = makeV()
    expect(targetAtLocal(el, 200, 20)).toEqual({ kind: 'title', index: -1 })
    expect(targetAtLocal(el, 10, 45)).toEqual({ kind: 'head', index: 0 })
    expect(targetAtLocal(el, 500, 55)).toEqual({ kind: 'head', index: 1 })
    expect(targetAtLocal(el, 10, 90)).toEqual({ kind: 'lane', index: 0 })
    expect(targetAtLocal(el, 500, 300)).toEqual({ kind: 'lane', index: 1 })
    expect(targetAtLocal(el, 719, 479)).toEqual({ kind: 'lane', index: 1 })
    expect(targetAtLocal(el, 800, 200)).toBeNull()
  })

  it('水平：标题列 / 二级标题列 / 泳道体沿 x 轴分层，泳道沿 y 轴分布', () => {
    const el = makeH()
    expect(titleRectOf(el)).toEqual({ x: 0, y: 0, w: 40, h: 480 })
    expect(headRectOf(el, 0)).toEqual({ x: 40, y: 0, w: 40, h: 240 })
    expect(laneRectOf(el, 0)).toEqual({ x: 80, y: 0, w: 640, h: 240 })
    expect(targetAtLocal(el, 20, 200)).toEqual({ kind: 'title', index: -1 })
    expect(targetAtLocal(el, 60, 300)).toEqual({ kind: 'head', index: 1 })
    expect(targetAtLocal(el, 200, 200)).toEqual({ kind: 'lane', index: 0 })
  })

  it('自定义 laneRatios：三段矩形与命中同口径', () => {
    const el = makeV()
    el.laneCount = 4
    el.laneRatios = [0.3, 0.5, 0.75]
    expect(headRectOf(el, 1)).toEqual({ x: 216, y: 40, w: 144, h: 40 })
    expect(laneRectOf(el, 1)).toEqual({ x: 216, y: 80, w: 144, h: 400 })
    expect(targetAtLocal(el, 210, 55)).toEqual({ kind: 'head', index: 0 })
    expect(targetAtLocal(el, 220, 55)).toEqual({ kind: 'head', index: 1 })
    expect(targetAtLocal(el, 220, 200)).toEqual({ kind: 'lane', index: 1 })
  })

  it('resolveTarget：仅本图形的有效目标生效，否则回落第 1 条泳道', () => {
    const el = makeV()
    expect(resolveTarget(el, null)).toEqual({ kind: 'lane', index: 0 })
    expect(resolveTarget(el, { id: el.id, kind: 'lane', index: 1 })).toEqual({ kind: 'lane', index: 1 })
    expect(resolveTarget(el, { id: el.id, kind: 'head', index: 1 })).toEqual({ kind: 'head', index: 1 })
    expect(resolveTarget(el, { id: 'other', kind: 'head', index: 1 })).toEqual({ kind: 'lane', index: 0 })
    expect(resolveTarget(el, { id: el.id, kind: 'head', index: 9 })).toEqual({ kind: 'lane', index: 0 })
    expect(resolveTarget(el, { id: el.id, kind: 'title', index: -1 })).toEqual({ kind: 'title', index: -1 })
  })

  it('targetRectOf：三种目标各自给出对应矩形', () => {
    const el = makeV()
    expect(targetRectOf(el, { kind: 'title', index: -1 })).toEqual(titleRectOf(el))
    expect(targetRectOf(el, { kind: 'head', index: 1 })).toEqual(headRectOf(el, 1))
    expect(targetRectOf(el, { kind: 'lane', index: 1 })).toEqual(laneRectOf(el, 1))
  })
})

describe('laneRectOf / targetAtLocal / resolveTarget（泳池族）', () => {
  it('泳池(垂直)：无二级标题行，标题带以下整块为泳道体', () => {
    const el = shapeRegistry.createElement('verticalPool', 100, 100)!
    expect(titleRectOf(el)).toEqual({ x: 0, y: 0, w: 250, h: 40 })
    expect(headRectOf(el, 0)).toBeNull()
    expect(laneRectOf(el, 0)).toEqual({ x: 0, y: 40, w: 250, h: 500 })
    expect(targetAtLocal(el, 100, 20)).toEqual({ kind: 'title', index: -1 })
    // 标题带以下直接命中泳道体（无 head 过渡带）
    expect(targetAtLocal(el, 100, 50)).toEqual({ kind: 'lane', index: 0 })
    expect(targetAtLocal(el, 249, 539)).toEqual({ kind: 'lane', index: 0 })
  })

  it('泳道(垂直)：标题带厚 30', () => {
    const el = shapeRegistry.createElement('verticalLane', 100, 100)!
    expect(titleRectOf(el)).toEqual({ x: 0, y: 0, w: 250, h: 30 })
    expect(laneRectOf(el, 0)).toEqual({ x: 0, y: 30, w: 250, h: 470 })
    expect(targetAtLocal(el, 100, 35)).toEqual({ kind: 'lane', index: 0 })
  })

  it('双向泳池(垂直)：2 泳道沿 x 轴等分，点选命中各自泳道', () => {
    const el = shapeRegistry.createElement('bidirectionalPoolV', 100, 100)!
    expect(laneRectOf(el, 0)).toEqual({ x: 0, y: 40, w: 250, h: 500 })
    expect(laneRectOf(el, 1)).toEqual({ x: 250, y: 40, w: 250, h: 500 })
    expect(laneRectOf(el, 2)).toBeNull()
    expect(targetAtLocal(el, 100, 400)).toEqual({ kind: 'lane', index: 0 })
    expect(targetAtLocal(el, 400, 400)).toEqual({ kind: 'lane', index: 1 })
    expect(targetAtLocal(el, 250, 20)).toEqual({ kind: 'title', index: -1 })
  })

  it('泳池族 resolveTarget：head 目标无效，回落第 1 条泳道', () => {
    const el = shapeRegistry.createElement('verticalPool', 100, 100)!
    expect(resolveTarget(el, { id: el.id, kind: 'head', index: 0 })).toEqual({ kind: 'lane', index: 0 })
    expect(resolveTarget(el, { id: el.id, kind: 'lane', index: 0 })).toEqual({ kind: 'lane', index: 0 })
    expect(resolveTarget(el, { id: el.id, kind: 'title', index: -1 })).toEqual({ kind: 'title', index: -1 })
  })
})

describe('buildSwimlaneUpdate 颜色清除', () => {
  it('显式传 titleColor: undefined 可清除标题色', () => {
    const el = shapeRegistry.createElement('swimlaneV', 100, 100)!
    el.titleColor = '255,0,0'
    const u = buildSwimlaneUpdate(el, { titleColor: undefined })
    expect(u.titleColor).toBeUndefined()
    expect(u.path).toBeDefined()
  })

  it('未提及 titleColor 时保持原值', () => {
    const el = shapeRegistry.createElement('swimlaneV', 100, 100)!
    el.titleColor = '255,0,0'
    expect(buildSwimlaneUpdate(el, { laneColors: ['1,2,3'] }).titleColor).toBe('255,0,0')
  })

  it('laneHeadColors 与 laneColors 互不影响，且随 laneCount 同步扩缩', () => {
    const el = shapeRegistry.createElement('swimlaneV', 100, 100)!
    const u = buildSwimlaneUpdate(el, { laneHeadColors: ['255,0,0'] })
    expect(u.laneHeadColors?.[0]).toBe('255,0,0')
    expect(u.laneColors).toBeUndefined()
    el.laneCount = 4
    el.laneHeadColors = ['255,0,0', '0,255,0', '0,0,255', '9,9,9']
    expect(buildSwimlaneUpdate(el, { laneCount: 2 }).laneHeadColors).toEqual(['255,0,0', '0,255,0'])
    expect(buildSwimlaneUpdate(el, { laneCount: 6 }).laneHeadColors).toHaveLength(6)
  })
})
