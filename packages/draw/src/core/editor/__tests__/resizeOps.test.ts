import { describe, it, expect } from 'vitest'
import { computeResizeRect } from '../resizeOps'

describe('computeResizeRect', () => {
  const initial = { x: 100, y: 50, w: 120, h: 60 }

  it('br 自由缩放：宽高独立变化', () => {
    const r = computeResizeRect(initial, 30, 10, 'br', false)
    expect(r).toEqual({ x: 100, y: 50, w: 150, h: 70 })
  })

  it('br + Shift：保持初始宽高比，左上角锚定', () => {
    const r = computeResizeRect(initial, 60, 10, 'br', true)
    expect(r.x).toBe(100)
    expect(r.y).toBe(50)
    expect(r.w / r.h).toBeCloseTo(initial.w / initial.h, 5)
    expect(r.w).toBeGreaterThan(initial.w)
  })

  it('tl + Shift：保持宽高比，右下角锚定', () => {
    const r = computeResizeRect(initial, -30, -15, 'tl', true)
    const anchorX = initial.x + initial.w
    const anchorY = initial.y + initial.h
    expect(r.x + r.w).toBeCloseTo(anchorX, 5)
    expect(r.y + r.h).toBeCloseTo(anchorY, 5)
    expect(r.w / r.h).toBeCloseTo(initial.w / initial.h, 5)
  })

  it('tr + Shift：保持宽高比，左下角锚定', () => {
    const r = computeResizeRect(initial, 40, -20, 'tr', true)
    expect(r.x).toBe(initial.x)
    expect(r.y + r.h).toBeCloseTo(initial.y + initial.h, 5)
    expect(r.w / r.h).toBeCloseTo(initial.w / initial.h, 5)
  })

  it('bl + Shift：保持宽高比，右上角锚定', () => {
    const r = computeResizeRect(initial, -20, 30, 'bl', true)
    expect(r.x + r.w).toBeCloseTo(initial.x + initial.w, 5)
    expect(r.y).toBe(initial.y)
    expect(r.w / r.h).toBeCloseTo(initial.w / initial.h, 5)
  })

  it('最小尺寸：Shift 模式下仍保持宽高比', () => {
    const r = computeResizeRect(initial, -200, -200, 'br', true)
    expect(r.w).toBeGreaterThanOrEqual(20)
    expect(r.h).toBeGreaterThanOrEqual(20)
    expect(r.w / r.h).toBeCloseTo(initial.w / initial.h, 5)
  })
})
