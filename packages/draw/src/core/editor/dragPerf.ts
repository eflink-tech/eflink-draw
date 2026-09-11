// 拖动热路径的纯计算：视口世界矩形、吸附线裁剪、rAF 合帧
// 供 uiOverlay / ElementRenderer 使用，避免拖动期间画 ±1e5 虚线或每 pointermove 重算。

export interface WorldRect {
  x: number
  y: number
  w: number
  h: number
}

/** Stage 上计算可见世界矩形所需的最小字段（避免测试依赖真实 Konva.Stage） */
export interface StageView {
  x: number
  y: number
  width: number
  height: number
  scaleX: number
  scaleY?: number
}

/** 屏幕视口 → 世界坐标矩形；pad 为世界单位外扩（吸附线避免贴边被裁） */
export function visibleWorldRect(stage: StageView, pad = 0): WorldRect {
  const sx = stage.scaleX || 1
  const sy = stage.scaleY ?? sx
  // `|| 0` 把 -0 收成 +0，避免 Object.is 在测试里把 -0/+0 判成不相等
  return {
    x: -stage.x / sx - pad || 0,
    y: -stage.y / sy - pad || 0,
    w: stage.width / sx + pad * 2,
    h: stage.height / sy + pad * 2,
  }
}

/** 吸附线四点：只覆盖可见世界范围，避免 Canvas 虚线沿 2e5 长度步进 */
export function clippedSnapLinePoints(
  axis: 'v' | 'h',
  value: number,
  world: WorldRect,
): number[] {
  if (axis === 'v') return [value, world.y, value, world.y + world.h]
  return [world.x, value, world.x + world.w, value]
}

export interface FrameSchedulerHooks {
  schedule?: (cb: FrameRequestCallback) => number
  cancel?: (id: number) => void
}

/**
 * 把多次 schedule 合并到下一帧只跑最后一次回调。
 * flush：拖动结束时立刻执行未跑的最后一次，保证落库位置与画面一致。
 */
export function createFrameScheduler(hooks?: FrameSchedulerHooks): {
  schedule: (fn: () => void) => void
  flush: () => void
  cancel: () => void
} {
  const scheduleFrame = hooks?.schedule ?? ((cb) => requestAnimationFrame(cb))
  const cancelFrame = hooks?.cancel ?? ((id) => cancelAnimationFrame(id))
  let id = 0
  let pending: (() => void) | null = null

  const runPending = (): void => {
    const fn = pending
    pending = null
    fn?.()
  }

  return {
    schedule(fn: () => void) {
      pending = fn
      if (id) return
      id = scheduleFrame(() => {
        id = 0
        runPending()
      })
    },
    flush() {
      if (id) {
        cancelFrame(id)
        id = 0
      }
      runPending()
    },
    cancel() {
      if (id) {
        cancelFrame(id)
        id = 0
      }
      pending = null
    },
  }
}

export interface PointerPanApply {
  (pos: { x: number; y: number }): void
}

export interface PointerPanSession {
  move: (x: number, y: number) => void
  end: () => void
  cancel: () => void
}

/** 指针平移：同帧多次 move 合并为一次 apply；end flush，cancel 丢弃 */
export function createPointerPanSession(opts: {
  apply: PointerPanApply
  clamp?: (x: number, y: number) => { x: number; y: number }
  scheduler?: ReturnType<typeof createFrameScheduler>
}): PointerPanSession {
  const scheduler = opts.scheduler ?? createFrameScheduler()
  let latest = { x: 0, y: 0 }
  return {
    move(x, y) {
      latest = opts.clamp ? opts.clamp(x, y) : { x, y }
      scheduler.schedule(() => opts.apply(latest))
    },
    end() {
      scheduler.flush()
    },
    cancel() {
      scheduler.cancel()
    },
  }
}
