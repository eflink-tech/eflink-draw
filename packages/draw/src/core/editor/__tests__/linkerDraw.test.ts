// 连线绘制辅助函数测试
// 附着端点沿"驶入角"反向外移，避免线条/箭头扎进图形边框
import { describe, it, expect } from 'vitest'
import { endpointInset, applyEndpointInset, strokeLinkerScene, getLinkerMidpoint } from '../linkerDraw'
import type { LinkerDraft } from '@/types'

/** 记录描边调用的 mock 2D 上下文 */
function makeCtx() {
  const strokes: Array<{ color: unknown; width: number; dash: number[] }> = []
  const ctx = {
    strokeStyle: '#000',
    fillStyle: '#000',
    lineWidth: 1,
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    bezierCurveTo: () => {},
    closePath: () => {},
    fill: () => {},
    save() {
      ctx.saved = { strokeStyle: ctx.strokeStyle, lineWidth: ctx.lineWidth }
    },
    restore() {
      if (ctx.saved) {
        ctx.strokeStyle = ctx.saved.strokeStyle
        ctx.lineWidth = ctx.saved.lineWidth
      }
    },
    lineJoin: 'miter',
    lineCap: 'butt',
    saved: null as null | { strokeStyle: string; lineWidth: number },
    setLineDash(d: number[]) {
      ctx.currentDash = d
    },
    stroke() {
      strokes.push({ color: this.strokeStyle, width: this.lineWidth, dash: [...ctx.currentDash] })
    },
    currentDash: [] as number[],
  }
  return { ctx, strokes }
}

/** 两端均为自由端（无外移补偿）的测试连线 */
function freeLinker(overrides: Partial<LinkerDraft> = {}): LinkerDraft {
  return {
    from: { id: null, x: 0, y: 0, angle: 0 },
    to: { id: null, x: 100, y: 0, angle: 0 },
    linkerType: 'line',
    lineStyle: {
      lineWidth: 2,
      lineColor: '50,50,50',
      lineStyle: 'solid',
      beginArrowStyle: 'none',
      endArrowStyle: 'none',
    },
    points: [],
    ...overrides,
  }
}

describe('endpointInset（外移量按箭头样式）', () => {
  it('none/cross：边框一半', () => {
    expect(endpointInset('none', 2, 2)).toBe(-1)
    expect(endpointInset('cross', 2, 2)).toBe(-1)
  })

  it('solidArrow/dashedArrow/normal：边框一半 + 线宽 × 1.3', () => {
    expect(endpointInset('solidArrow', 2, 2)).toBeCloseTo(-(1 + 2 * 1.3), 10)
    expect(endpointInset('dashedArrow', 4, 3)).toBeCloseTo(-(2 + 3 * 1.3), 10)
    expect(endpointInset('normal', 2, 2)).toBeCloseTo(-(1 + 2 * 1.3), 10)
  })

  it('solidDiamond/dashedDiamond：边框一半 + 线宽', () => {
    expect(endpointInset('solidDiamond', 2, 2)).toBeCloseTo(-(1 + 2), 10)
    expect(endpointInset('dashedDiamond', 4, 3)).toBeCloseTo(-(2 + 3), 10)
  })

  it('solidCircle/dashedCircle：边框一半 + 线宽 × 0.5', () => {
    expect(endpointInset('solidCircle', 2, 2)).toBeCloseTo(-(1 + 2 * 0.5), 10)
    expect(endpointInset('dashedCircle', 4, 3)).toBeCloseTo(-(2 + 3 * 0.5), 10)
  })

  it('未指定样式（else 分支）：边框一半 + 线宽一半', () => {
    expect(endpointInset(undefined, 2, 2)).toBeCloseTo(-(1 + 1), 10)
  })
})

describe('applyEndpointInset（沿驶入角反向外移）', () => {
  it('驶入角 π/2（向下）→ 端点向上外移', () => {
    const p = applyEndpointInset({ x: 150, y: 300 }, Math.PI / 2, -3.6)
    expect(p.x).toBeCloseTo(150, 10)
    expect(p.y).toBeCloseTo(296.4, 10)
  })

  it('驶入角 0（向右）→ 端点向左外移', () => {
    const p = applyEndpointInset({ x: 200, y: 130 }, 0, -1)
    expect(p.x).toBeCloseTo(199, 10)
    expect(p.y).toBeCloseTo(130, 10)
  })
})

describe('strokeLinkerScene（选中光晕 halo）', () => {
  it('无 halo：仅一次原色描边', () => {
    const { ctx, strokes } = makeCtx()
    strokeLinkerScene(ctx as unknown as CanvasRenderingContext2D, freeLinker(), {
      color: '#323232',
      lineWidth: 2,
      dash: 'solid',
    })
    expect(strokes).toEqual([{ color: '#323232', width: 2, dash: [] }])
  })

  it('有 halo：先画更宽的光晕再画原线，颜色不变', () => {
    const { ctx, strokes } = makeCtx()
    strokeLinkerScene(ctx as unknown as CanvasRenderingContext2D, freeLinker(), {
      color: '#323232',
      lineWidth: 2,
      dash: 'solid',
      halo: { color: 'rgba(24,144,255,0.35)', extraWidth: 6 },
    })
    expect(strokes).toHaveLength(2)
    // 第一笔：光晕（更宽、蓝色）
    expect(strokes[0]).toEqual({ color: 'rgba(24,144,255,0.35)', width: 8, dash: [] })
    // 第二笔：原线（原色原宽）
    expect(strokes[1]).toEqual({ color: '#323232', width: 2, dash: [] })
  })

  it('虚线 halo 与主线共用同一 dash 数组（线段对齐）', () => {
    const { ctx, strokes } = makeCtx()
    strokeLinkerScene(ctx as unknown as CanvasRenderingContext2D, freeLinker(), {
      color: '#323232',
      lineWidth: 2,
      dash: 'dashed',
      halo: { color: 'rgba(24,144,255,0.35)', extraWidth: 6 },
    })
    const expectDash = [2 * 5, 2 * 2]
    expect(strokes[0]!.dash).toEqual(expectDash)
    expect(strokes[1]!.dash).toEqual(expectDash)
  })
})

describe('getLinkerMidpoint', () => {
  it('line 直线取几何中点', () => {
    const m = getLinkerMidpoint(freeLinker())
    expect(m.x).toBeCloseTo(50)
    expect(m.y).toBeCloseTo(0)
  })

  it('curve 取贝塞尔 t=0.5 加权点', () => {
    const l = freeLinker({
      linkerType: 'curve',
      points: [
        { x: 0, y: 100 },
        { x: 100, y: 100 },
      ],
    })
    // x: 0.125*0 + 0.375*0 + 0.375*100 + 0.125*100 = 50
    // y: 0.125*0 + 0.375*100 + 0.375*100 + 0.125*0 = 75
    const m = getLinkerMidpoint(l)
    expect(m.x).toBeCloseTo(50)
    expect(m.y).toBeCloseTo(75)
  })

  it('broken 沿累计长度取半程点', () => {
    // from(0,0)→p(0,40)→p(100,40)→to(100,100)：总长 40+100+60=200，半程 100 落在第二段 60% 处
    const l = freeLinker({
      linkerType: 'broken',
      points: [
        { x: 0, y: 40 },
        { x: 100, y: 40 },
      ],
      to: { id: null, x: 100, y: 100, angle: 0 },
    })
    const m = getLinkerMidpoint(l)
    expect(m.x).toBeCloseTo(60)
    expect(m.y).toBeCloseTo(40)
  })

  it('curve 但 points<2 时回退折线取中点', () => {
    const l = freeLinker({ linkerType: 'curve', points: [] })
    const m = getLinkerMidpoint(l)
    expect(m.x).toBeCloseTo(50)
    expect(m.y).toBeCloseTo(0)
  })

  it('零长度段不产生 NaN（重复点）', () => {
    const l = freeLinker({
      points: [
        { x: 50, y: 0 },
        { x: 50, y: 0 },
      ],
    })
    const m = getLinkerMidpoint(l)
    expect(Number.isFinite(m.x)).toBe(true)
    expect(Number.isFinite(m.y)).toBe(true)
  })

  it('from==to 全退化返回该点', () => {
    const l = freeLinker({
      to: { id: null, x: 0, y: 0, angle: 0 },
      points: [],
    })
    const m = getLinkerMidpoint(l)
    expect(m).toEqual({ x: 0, y: 0 })
  })
})
