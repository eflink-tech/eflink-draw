// 连线流动光标纯函数测试
//   - 圆点沿路径每 120px 一个，速度 100px/s（每 30ms 前进 3px）
//   - 相位 t ∈ [0,1) 可见，到 1 隐藏，到 maxT 回绕到 0 重新出现
//   - 圆点直径 = max(5, lineWidth + 2)（屏幕像素）
import { describe, it, expect } from 'vitest'
import {
  advancePhase,
  cursorDotPhases,
  cursorDotSize,
  cursorLength,
  cursorMaxT,
  cursorPointAt,
  outgoingLinkers,
  type CursorLinker,
} from '../linkerCursor'

/** 构造测试用连线（from/to 为世界坐标端点） */
function mk(
  from: [number, number],
  to: [number, number],
  points: Array<[number, number]> = [],
  linkerType: CursorLinker['linkerType'] = 'line',
): CursorLinker {
  return {
    from: { id: 'a', x: from[0], y: from[1], angle: 0 },
    to: { id: 'b', x: to[0], y: to[1], angle: 0 },
    points: points.map(([x, y]) => ({ x, y })),
    linkerType,
  }
}

describe('cursorLength（路径总长）', () => {
  it('直线：欧氏距离', () => {
    expect(cursorLength(mk([0, 0], [100, 0]))).toBe(100)
    expect(cursorLength(mk([0, 0], [30, 40]))).toBe(50)
  })

  it('折线：各段长度之和', () => {
    expect(cursorLength(mk([0, 0], [100, 100], [[100, 0]], 'broken'))).toBe(200)
  })

  it('曲线：按端点 + 控制点折线估算', () => {
    const c = mk([0, 0], [100, 0], [[30, 0], [60, 0]], 'curve')
    expect(cursorLength(c)).toBe(100)
  })
})

describe('cursorPointAt（t 处世界坐标）', () => {
  it('直线：线性插值', () => {
    expect(cursorPointAt(mk([0, 0], [100, 40]), 0.5)).toEqual({ x: 50, y: 20 })
    expect(cursorPointAt(mk([0, 0], [100, 0]), 0)).toEqual({ x: 0, y: 0 })
    expect(cursorPointAt(mk([0, 0], [100, 0]), 1)).toEqual({ x: 100, y: 0 })
  })

  it('折线：弧长参数化（t 按累计距离折算）', () => {
    // L 形路径 (0,0)→(100,0)→(100,100)，总长 200
    const c = mk([0, 0], [100, 100], [[100, 0]], 'broken')
    expect(cursorPointAt(c, 0.25)).toEqual({ x: 50, y: 0 })
    expect(cursorPointAt(c, 0.5)).toEqual({ x: 100, y: 0 })
    expect(cursorPointAt(c, 0.75)).toEqual({ x: 100, y: 50 })
  })

  it('曲线：三次贝塞尔参数 t', () => {
    const c = mk([0, 0], [100, 0], [[0, 100], [100, 100]], 'curve')
    expect(cursorPointAt(c, 0)).toEqual({ x: 0, y: 0 })
    expect(cursorPointAt(c, 1)).toEqual({ x: 100, y: 0 })
    // t=0.5：x = 0*0.125 + 0*0.375 + 100*0.375 + 100*0.125 = 50
    //        y = 0*0.125 + 100*0.375 + 100*0.375 + 0*0.125 = 75
    expect(cursorPointAt(c, 0.5)).toEqual({ x: 50, y: 75 })
  })
})

describe('cursorDotPhases / cursorMaxT（圆点分布与周期）', () => {
  it('每 120px 一个圆点，t = 起点/总长', () => {
    expect(cursorDotPhases(100)).toEqual([0])
    expect(cursorDotPhases(250)).toEqual([0, 120 / 250, 240 / 250])
  })

  it('长度不足 120px 时仅起点一个', () => {
    expect(cursorDotPhases(60)).toEqual([0])
  })

  it('maxT 略大于 1（终点后延时回绕）：ceil(250/120)*120/250 = 1.44', () => {
    expect(cursorMaxT(250)).toBeCloseTo(1.44, 10)
  })

  it('整除时 maxT = 1', () => {
    expect(cursorMaxT(120)).toBe(1)
  })
})

describe('advancePhase（相位推进与回绕）', () => {
  it('正常推进', () => {
    expect(advancePhase(0.1, 0.05, 1.44)).toBeCloseTo(0.15, 10)
  })

  it('越过 maxT 时回绕', () => {
    expect(advancePhase(1.4, 0.1, 1.44)).toBeCloseTo(0.06, 10)
  })
})

describe('cursorDotSize（圆点直径，屏幕像素）', () => {
  it('最小 5px，否则 lineWidth + 2', () => {
    expect(cursorDotSize(2)).toBe(5)
    expect(cursorDotSize(6)).toBe(8)
  })
})

describe('outgoingLinkers（选中图形的出向连线）', () => {
  /** 构造元素表：两个图形 + 若干连线 */
  function mkElements() {
    return {
      shapeA: { id: 'shapeA', name: 'rect' },
      shapeB: { id: 'shapeB', name: 'rect' },
      // 出向：A → B（应选中 A 时显示）
      out1: {
        id: 'out1',
        name: 'linker',
        from: { id: 'shapeA', x: 0, y: 0, angle: 0 },
        to: { id: 'shapeB', x: 100, y: 0, angle: 0 },
        points: [],
      },
      // 入向：B → A（选中 A 时不应显示）
      in1: {
        id: 'in1',
        name: 'linker',
        from: { id: 'shapeB', x: 0, y: 0, angle: 0 },
        to: { id: 'shapeA', x: 100, y: 0, angle: 0 },
        points: [],
      },
      free1: {
        id: 'free1',
        name: 'linker',
        from: { id: 'shapeA', x: 0, y: 0, angle: 0 },
        to: { id: null, x: 100, y: 0, angle: 0 },
        points: [],
      },
    }
  }

  it('仅返回 from = 选中图形且 to 已附着图形的连线（向下游流动）', () => {
    const els = mkElements()
    const out = outgoingLinkers(els as never, 'shapeA')
    expect(out.map((l) => l.id)).toEqual(['out1'])
  })

  it('选中 B 时返回 B 的出向连线（不含 A 的入向）', () => {
    const els = mkElements()
    const out = outgoingLinkers(els as never, 'shapeB')
    expect(out.map((l) => l.id)).toEqual(['in1'])
  })
})
