// 时序消息测试：水平保持 / 自消息平移 / 落点判定
import { describe, it, expect } from 'vitest'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import { createLinkerInstance } from '../linker'
import { routeAttachedLinkers } from '../documentOps'
import { barEdgeX, resolveSeqDrop, selfLoopPoints, SEQ_LOOP_H, SEQ_LOOP_W } from '../seqMessage'
import { matchStylePreset, UML_RELATION_PRESETS } from '../linker'
import type { ElementInstance, LinkerInstance } from '@/types'

function makeBars() {
  const a = shapeRegistry.createElement('sequenceActivation', 100, 200)! // 30×100 → 100..130, 200..300
  const b = shapeRegistry.createElement('sequenceActivation', 400, 220)! // 400..430, 220..320
  return { a, b }
}

function makeMsg(a: ElementInstance, b: ElementInstance, y = 260): LinkerInstance {
  const l = createLinkerInstance(
    { id: a.id, x: barEdgeX(a.props, 1), y, angle: 0 },
    { id: b.id, x: barEdgeX(b.props, -1), y, angle: Math.PI },
    1,
  )
  l.linkerType = 'line'
  l.seq = { y, fromDir: 1, toDir: -1 }
  return l
}

describe('时序消息水平路由', () => {
  it('垂直移动目标条：消息 y 跟随被移动条，两端保持水平并落在条缘', () => {
    const { a, b } = makeBars()
    const l = makeMsg(a, b, 260)
    const elements = { [a.id]: a, [b.id]: b, [l.id]: l }
    // b 下移 30（220 → 250）
    const routed = routeAttachedLinkers(elements, new Map([[b.id, { x: 400, y: 250 }]]))
    const nl = routed.get(l.id)!
    expect(nl.seq!.y).toBe(290)
    expect(nl.from.x).toBe(130) // a 右缘
    expect(nl.from.y).toBe(290) // 滑动到 a 范围内（200..300）
    expect(nl.to.x).toBe(400) // b 左缘
    expect(nl.to.y).toBe(290)
  })

  it('两段 y 范围无交集：保持 y 不再 clamp', () => {
    const { a, b } = makeBars()
    const l = makeMsg(a, b, 260)
    const elements = { [a.id]: a, [b.id]: b, [l.id]: l }
    // b 下移 300（220 → 520），与 a(200..300) 无交集
    const routed = routeAttachedLinkers(elements, new Map([[b.id, { x: 400, y: 520 }]]))
    const nl = routed.get(l.id)!
    expect(nl.seq!.y).toBe(560) // 260 + 300
  })

  it('clamp：消息 y 不越过两端条范围交集', () => {
    const { a, b } = makeBars()
    const l = makeMsg(a, b, 230)
    const elements = { [a.id]: a, [b.id]: b, [l.id]: l }
    // a 上移 60（200 → 140，范围 140..240）；消息 y 230-60=170 < max(140,220)=220 → clamp 220
    const routed = routeAttachedLinkers(elements, new Map([[a.id, { x: 100, y: 140 }]]))
    const nl = routed.get(l.id)!
    expect(nl.seq!.y).toBe(220)
    expect(nl.from.y).toBe(220)
    expect(nl.to.y).toBe(220)
  })
})

describe('自消息', () => {
  it('回环 points 与条移动时整体平移', () => {
    const a = shapeRegistry.createElement('sequenceActivation', 100, 200)!
    const from = { id: a.id, x: barEdgeX(a.props, 1), y: 240, angle: 0 }
    const to = { id: a.id, x: barEdgeX(a.props, 1), y: 240 + SEQ_LOOP_H, angle: Math.PI }
    const l = createLinkerInstance(from, to, 1)
    l.linkerType = 'broken'
    l.seq = { y: 240, fromDir: 1, toDir: 1, loopW: SEQ_LOOP_W, loopH: SEQ_LOOP_H }
    l.points = selfLoopPoints(a.props, 1, 240)
    l.manualRoute = true

    const elements = { [a.id]: a, [l.id]: l }
    // 条下移 60（200 → 260）：端点按比例映射 dy=60，回环整体平移
    const routed = routeAttachedLinkers(elements, new Map([[a.id, { x: 140, y: 260 }]]))
    const nl = routed.get(l.id)!
    expect(nl.seq!.y).toBe(300)
    expect(nl.from.x).toBe(170) // 130 + 40
    expect(nl.points).toEqual([
      { x: 206, y: 300 }, // 166 + 40, 240 + 60
      { x: 206, y: 324 }, // 244 + 60
    ])
  })
})

describe('resolveSeqDrop 落点判定', () => {
  const { a, b } = makeBars()
  const elements: Record<string, ElementInstance> = { [a.id]: a, [b.id]: b }

  it('命中其他激活条缘（≤14px）→ msg', () => {
    const drop = resolveSeqDrop(elements, a.id, 260, { x: 400 - 6, y: 260 })
    expect(drop).toEqual({ kind: 'msg', toId: b.id, toDir: -1 })
  })

  it('命中源条自身 → self', () => {
    const drop = resolveSeqDrop(elements, a.id, 260, { x: 128, y: 260 })
    expect(drop).toEqual({ kind: 'self' })
  })

  it('光标在源条扩展范围（±28）内但无缘命中 → self 兜底', () => {
    const drop = resolveSeqDrop(elements, a.id, 260, { x: 150, y: 260 })
    expect(drop).toEqual({ kind: 'self' })
  })

  it('远离任何条 → null（取消）', () => {
    const drop = resolveSeqDrop(elements, a.id, 260, { x: 250, y: 260 })
    expect(drop).toBeNull()
  })

  it('y 不在条范围内 → null', () => {
    const drop = resolveSeqDrop(elements, a.id, 500, { x: 394, y: 500 })
    expect(drop).toBeNull()
  })

  it('生命线：中轴吸附（y 需在头部以下区段）→ msg + toDir 0', () => {
    const life = shapeRegistry.createElement('sequenceLifeLine', 400, 100)! // 70×140 → 中轴 x=435, 虚线区 130..240
    const els2: Record<string, ElementInstance> = { [a.id]: a, [life.id]: life }
    const drop = resolveSeqDrop(els2, a.id, 180, { x: 435 - 5, y: 180 })
    expect(drop).toEqual({ kind: 'msg', toId: life.id, toDir: 0 })
    // y 在头部区（100..130）→ 不命中
    const drop2 = resolveSeqDrop(els2, a.id, 110, { x: 435, y: 110 })
    expect(drop2).toBeNull()
  })

  it('销毁符：中轴 + 中心高度双吸附 → msg + y 吸附到 × 中心', () => {
    const x = shapeRegistry.createElement('sequenceDeletion', 380, 260)! // 40×40 → 中轴 400, 中心高 280
    const els2: Record<string, ElementInstance> = { [a.id]: a, [x.id]: x }
    const drop = resolveSeqDrop(els2, a.id, 274, { x: 400, y: 274 })
    expect(drop).toEqual({ kind: 'msg', toId: x.id, toDir: 0, y: 280 })
  })
})

describe('时序消息路由（生命线 / 销毁符端点）', () => {
  it('生命线端点：x = 中轴，y = seq.y；clamp 仅由激活条参与', () => {
    const a = shapeRegistry.createElement('sequenceActivation', 100, 200)!
    const life = shapeRegistry.createElement('sequenceLifeLine', 400, 100)!
    const l = createLinkerInstance(
      { id: a.id, x: barEdgeX(a.props, 1), y: 260, angle: 0 },
      { id: life.id, x: barEdgeX(life.props, 0), y: 260, angle: 0 },
      1,
    )
    l.linkerType = 'line'
    l.seq = { y: 260, fromDir: 1, toDir: 0 }
    const elements = { [a.id]: a, [life.id]: life, [l.id]: l }
    // a 上移 80（200 → 120）：seq.y 260−80=180，a 范围 120..220 → 180 在内
    const routed = routeAttachedLinkers(elements, new Map([[a.id, { x: 100, y: 120 }]]))
    const nl = routed.get(l.id)!
    expect(nl.seq!.y).toBe(180)
    expect(nl.from.y).toBe(180)
    expect(nl.to.x).toBe(435) // 生命线中轴
    expect(nl.to.y).toBe(180)
  })

  it('销毁符端点：x = 中轴；激活条移动时端点 y 跟随 seq.y', () => {
    const a = shapeRegistry.createElement('sequenceActivation', 100, 200)!
    const x = shapeRegistry.createElement('sequenceDeletion', 380, 260)!
    const l = createLinkerInstance(
      { id: a.id, x: barEdgeX(a.props, 1), y: 280, angle: 0 },
      { id: x.id, x: barEdgeX(x.props, 0), y: 280, angle: 0 },
      1,
    )
    l.linkerType = 'line'
    l.seq = { y: 280, fromDir: 1, toDir: 0 }
    const elements = { [a.id]: a, [x.id]: x, [l.id]: l }
    const routed = routeAttachedLinkers(elements, new Map([[a.id, { x: 100, y: 230 }]]))
    const nl = routed.get(l.id)!
    expect(nl.seq!.y).toBe(310)
    expect(nl.to.x).toBe(400)
    expect(nl.to.y).toBe(310)
  })
})

describe('UML 预设', () => {
  it('matchStylePreset：聚合 → 起始空心菱形 + 实线 + 无止箭头', () => {
    const a = shapeRegistry.createElement('sequenceActivation', 0, 0)!
    const l = createLinkerInstance(
      { id: a.id, x: 0, y: 0, angle: 0 },
      { id: a.id, x: 10, y: 0, angle: 0 },
      1,
    )
    l.lineStyle.beginArrowStyle = 'dashedDiamond'
    l.lineStyle.endArrowStyle = 'none'
    expect(matchStylePreset(UML_RELATION_PRESETS, l)).toBe('aggregation')
    l.lineStyle.lineStyle = 'dashed'
    expect(matchStylePreset(UML_RELATION_PRESETS, l)).toBe('')
  })
})
