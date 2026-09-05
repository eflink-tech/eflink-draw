import { describe, it, expect, vi } from 'vitest'
import { traceActions } from '../pathActions'

describe('traceActions', () => {
  it('不自动 closePath（大括号左右子路径保持独立）', () => {
    const closePath = vi.fn()
    const ctx = {
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath,
    }
    traceActions(ctx, [
      [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: 10, y: 0 },
      ],
      [
        { action: 'move', x: 20, y: 0 },
        { action: 'line', x: 30, y: 0 },
      ],
    ], { w: 100, h: 60 })
    expect(closePath).not.toHaveBeenCalled()
  })

  it('action:close 时闭合子路径', () => {
    const closePath = vi.fn()
    const ctx = {
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath,
    }
    traceActions(ctx, [[
      { action: 'move', x: 0, y: 0 },
      { action: 'line', x: 10, y: 0 },
      { action: 'close' },
    ]], { w: 100, h: 60 })
    expect(closePath).toHaveBeenCalledTimes(1)
  })
})
