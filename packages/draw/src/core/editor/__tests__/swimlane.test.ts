// 泳道图布局构建测试：path/textBlock 表达式与布局变更更新
import { describe, it, expect } from 'vitest'
import {
  buildSwimlanePath,
  buildSwimlaneTextBlocks,
  buildSwimlaneUpdate,
  isSwimlane,
  swimlaneLayoutOf,
  MAX_LANES,
} from '../swimlane'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'

describe('buildSwimlanePath', () => {
  it('垂直：外框 + 标题带线 + 泳道头线 + (n-1) 泳道线', () => {
    const paths = buildSwimlanePath('v', 4, 0)
    expect(paths).toHaveLength(6)
    // 泳道分隔线为 w 表达式（resize 按比例缩放）
    expect(paths[3]).toEqual([
      { action: 'move', x: 'w*1/4', y: 40 },
      { action: 'line', x: 'w*1/4', y: 'h' },
    ])
  })

  it('垂直：阶段线横向贯穿且为 h 表达式', () => {
    const paths = buildSwimlanePath('v', 2, 1)
    // 3 + 1 泳道线 + 1 阶段线
    expect(paths).toHaveLength(5)
    expect(paths[4]).toEqual([
      { action: 'move', x: 0, y: '70+(h-70)*1/2' },
      { action: 'line', x: 'w', y: '70+(h-70)*1/2' },
    ])
  })

  it('水平：泳道线为 h 表达式、阶段线纵向', () => {
    const paths = buildSwimlanePath('h', 3, 1)
    expect(paths[3]).toEqual([
      { action: 'move', x: 40, y: 'h*1/3' },
      { action: 'line', x: 'w', y: 'h*1/3' },
    ])
    expect(paths[5]).toEqual([
      { action: 'move', x: '100+(w-100)*1/2', y: 0 },
      { action: 'line', x: '100+(w-100)*1/2', y: 'h' },
    ])
  })

  it('泳道数/阶段数越界收敛', () => {
    expect(buildSwimlanePath('v', 99, 0)).toHaveLength(3 + MAX_LANES - 1)
    expect(buildSwimlanePath('v', 0, 0)).toHaveLength(3)
    expect(buildSwimlanePath('v', 4, -3)).toHaveLength(6)
  })
})

describe('buildSwimlaneTextBlocks', () => {
  it('垂直：标题块 16 号 + N 个泳道头块', () => {
    const blocks = buildSwimlaneTextBlocks('v', 3)
    expect(blocks).toHaveLength(4)
    expect(blocks[0]!.fontStyle).toEqual({ size: 16 })
    expect(blocks[1]!.position).toMatchObject({ x: 8, y: 40, h: 30 })
    expect(blocks[2]!.position).toMatchObject({ x: 'w*1/3+8', w: 'w/3-16' })
  })

  it('水平：标题块竖排', () => {
    const blocks = buildSwimlaneTextBlocks('h', 2)
    expect(blocks[0]!.fontStyle).toEqual({ size: 16, orientation: 'vertical' })
    expect(blocks[1]!.position).toMatchObject({ x: 44, y: 4, w: 52 })
  })

  it('泳道数变化保留已输入文字', () => {
    const prev = buildSwimlaneTextBlocks('v', 2)
    prev[0]!.text = '订单流程'
    prev[2]!.text = '审批'
    const next = buildSwimlaneTextBlocks('v', 3, prev)
    expect(next[0]!.text).toBe('订单流程')
    expect(next[2]!.text).toBe('审批')
    expect(next[3]!.text).toBe('')
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
    expect(buildSwimlaneUpdate(el, { laneCount: 4, stageCount: 0 })).toEqual({})
  })

  it('swimlaneLayoutOf / isSwimlane', () => {
    const el = make()
    expect(isSwimlane(el)).toBe(true)
    expect(swimlaneLayoutOf(el)).toEqual({ orientation: 'v', laneCount: 4, stageCount: 0 })
    expect(isSwimlane(shapeRegistry.createElement('rectangle', 0, 0)!)).toBe(false)
  })
})
