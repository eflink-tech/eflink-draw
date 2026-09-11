import { describe, it, expect, vi } from 'vitest'
import {
  visibleWorldRect,
  clippedSnapLinePoints,
  createFrameScheduler,
  createPointerPanSession,
} from '../dragPerf'

describe('visibleWorldRect', () => {
  it('按 stage 平移与缩放换算出可见世界矩形', () => {
    expect(visibleWorldRect({ x: 100, y: 50, width: 800, height: 600, scaleX: 1 })).toEqual({
      x: -100,
      y: -50,
      w: 800,
      h: 600,
    })
  })

  it('scale=2 时世界宽高等于屏幕尺寸除以缩放', () => {
    expect(visibleWorldRect({ x: 0, y: 0, width: 800, height: 600, scaleX: 2 })).toEqual({
      x: 0,
      y: 0,
      w: 400,
      h: 300,
    })
  })

  it('pad 向外扩一圈，避免贴边裁切', () => {
    const world = visibleWorldRect({ x: 0, y: 0, width: 100, height: 80, scaleX: 1 }, 10)
    expect(world).toEqual({ x: -10, y: -10, w: 120, h: 100 })
  })
})

describe('clippedSnapLinePoints', () => {
  const world = { x: 0, y: 0, w: 800, h: 600 }

  it('垂直吸附线只覆盖可见世界高度，而不是 ±1e5', () => {
    const pts = clippedSnapLinePoints('v', 120, world)
    expect(pts).toEqual([120, 0, 120, 600])
    expect(Math.abs(pts[3]! - pts[1]!)).toBe(600)
  })

  it('水平吸附线只覆盖可见世界宽度', () => {
    const pts = clippedSnapLinePoints('h', 80, world)
    expect(pts).toEqual([0, 80, 800, 80])
    expect(Math.abs(pts[2]! - pts[0]!)).toBe(800)
  })
})

describe('createFrameScheduler', () => {
  it('同一帧多次 schedule 只执行最后一次回调', () => {
    const queued: FrameRequestCallback[] = []
    const scheduler = createFrameScheduler({
      schedule: (cb) => {
        queued.push(cb)
        return queued.length
      },
      cancel: () => undefined,
    })
    const a = vi.fn()
    const b = vi.fn()
    scheduler.schedule(a)
    scheduler.schedule(b)
    expect(queued).toHaveLength(1)
    queued[0]!(0)
    expect(a).not.toHaveBeenCalled()
    expect(b).toHaveBeenCalledTimes(1)
  })

  it('flush 取消已排队的 rAF 并立即执行最后一次回调', () => {
    let id = 0
    const cancel = vi.fn()
    const scheduler = createFrameScheduler({
      schedule: () => ++id,
      cancel,
    })
    const fn = vi.fn()
    scheduler.schedule(fn)
    scheduler.flush()
    expect(cancel).toHaveBeenCalledWith(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('createPointerPanSession', () => {
  it('同一帧多次 move 只 apply 最后一次坐标', () => {
    const queued: FrameRequestCallback[] = []
    const scheduler = createFrameScheduler({
      schedule: (cb) => {
        queued.push(cb)
        return queued.length
      },
      cancel: () => undefined,
    })
    const apply = vi.fn()
    const session = createPointerPanSession({ apply, scheduler })
    session.move(10, 20)
    session.move(30, 40)
    expect(apply).not.toHaveBeenCalled()
    queued[0]!(0)
    expect(apply).toHaveBeenCalledTimes(1)
    expect(apply).toHaveBeenCalledWith({ x: 30, y: 40 })
  })

  it('clamp 在合帧前生效，apply 收到裁剪后的坐标', () => {
    const queued: FrameRequestCallback[] = []
    const scheduler = createFrameScheduler({
      schedule: (cb) => {
        queued.push(cb)
        return queued.length
      },
      cancel: () => undefined,
    })
    const apply = vi.fn()
    const session = createPointerPanSession({
      apply,
      scheduler,
      clamp: (x, y) => ({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }),
    })
    session.move(-20, 250)
    queued[0]!(0)
    expect(apply).toHaveBeenCalledWith({ x: 0, y: 100 })
  })

  it('end 在 rAF 尚未触发时 flush 最后一次 apply', () => {
    let id = 0
    const cancel = vi.fn()
    const scheduler = createFrameScheduler({
      schedule: () => ++id,
      cancel,
    })
    const apply = vi.fn()
    const session = createPointerPanSession({ apply, scheduler })
    session.move(5, 6)
    session.end()
    expect(cancel).toHaveBeenCalledWith(1)
    expect(apply).toHaveBeenCalledTimes(1)
    expect(apply).toHaveBeenCalledWith({ x: 5, y: 6 })
  })

  it('cancel 丢弃未执行的 apply', () => {
    const scheduler = createFrameScheduler({
      schedule: () => 1,
      cancel: () => undefined,
    })
    const apply = vi.fn()
    const session = createPointerPanSession({ apply, scheduler })
    session.move(1, 2)
    session.cancel()
    session.end()
    expect(apply).not.toHaveBeenCalled()
  })
})
