// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import type { ElementInstance } from '@/types'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import { makeShapeSceneFunc } from '../shapePaint'

function shape(overrides: Partial<ElementInstance> = {}): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', 0, 0)
  if (!el) throw new Error('rectangle schema missing')
  return { ...el, ...overrides }
}

/** 构造 ctx mock：覆盖 path 方法 + 填充/描边方法 + shadow 属性 */
function makeCtx() {
  const fn = () => vi.fn()
  return {
    beginPath: fn(), closePath: fn(),
    moveTo: fn(), lineTo: fn(),
    bezierCurveTo: fn(), quadraticCurveTo: fn(),
    fill: fn(), stroke: fn(), setLineDash: fn(),
    fillStyle: '', strokeStyle: '', lineWidth: 0,
    shadowColor: '', shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0,
  }
}

/** Konva.Shape 最小替身 */
const fakeShape = { width: () => 100, height: () => 60 } as unknown as Parameters<ReturnType<typeof makeShapeSceneFunc>>[1]

describe('makeShapeSceneFunc 子路径样式', () => {
  it('sequenceLifeLine 顶部矩形用实线、垂直线为虚线', () => {
    const el = shapeRegistry.createElement('sequenceLifeLine', 0, 0)
    if (!el) throw new Error('sequenceLifeLine schema missing')
    const ctx = makeCtx()
    makeShapeSceneFunc(el)(ctx, fakeShape)
    // 2 个子路径：虚线 + 实线矩形
    expect(ctx.stroke).toHaveBeenCalledTimes(2)
    expect(ctx.setLineDash).toHaveBeenCalledWith([2, 3])
    expect(ctx.setLineDash).toHaveBeenCalledWith([])
  })
})

describe('makeShapeSceneFunc 阴影', () => {
  it('shadowEnabled=false 时不设置 shadowColor（保持透明）', () => {
    const el = shape({ shapeStyle: { alpha: 1, shadowEnabled: false } })
    const ctx = makeCtx()
    makeShapeSceneFunc(el)(ctx, fakeShape)
    expect(ctx.shadowColor).toBe('transparent')
    expect(ctx.shadowBlur).toBe(0)
  })

  it('shadowEnabled=true 时设置 shadowColor/Blur/Offset', () => {
    const el = shape({
      shapeStyle: {
        alpha: 1, shadowEnabled: true, shadowColor: '0,0,0',
        shadowBlur: 4, shadowOffsetX: 2, shadowOffsetY: 2,
      },
    })
    const ctx = makeCtx()
    makeShapeSceneFunc(el)(ctx, fakeShape)
    expect(ctx.shadowColor).toBe('rgb(0,0,0)')
    expect(ctx.shadowBlur).toBe(4)
    expect(ctx.shadowOffsetX).toBe(2)
    expect(ctx.shadowOffsetY).toBe(2)
  })
})
