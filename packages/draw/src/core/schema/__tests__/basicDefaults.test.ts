import { describe, it, expect } from 'vitest'
import { shapeRegistry } from '../registry'
import { basicShapes } from '../shapes/basic'
import '@/core/schema/shapes'

describe('基础图形默认样式', () => {
  it('registry 已注册全部基础图形', () => {
    for (const s of basicShapes) {
      expect(shapeRegistry.getShape(s.name)).toBeDefined()
    }
  })

  it('默认边线：lineWidth 1.5、颜色 50,50,50', () => {
    const el = shapeRegistry.createElement('rectangle', 0, 0)!
    expect(el.lineStyle.lineWidth).toBe(1.5)
    expect(el.lineStyle.lineColor).toBe('50,50,50')
    expect(el.lineStyle.lineStyle).toBe('solid')
  })

  it('默认字体：微软雅黑 13 号、颜色 50,50,50', () => {
    const el = shapeRegistry.createElement('rectangle', 0, 0)!
    expect(el.fontStyle.fontFamily).toBe('yahei')
    expect(el.fontStyle.size).toBe(13)
    expect(el.fontStyle.color).toBe('50,50,50')
  })

  it('默认锚点顺序：上、下、左、右', () => {
    const el = shapeRegistry.createElement('rectangle', 0, 0)!
    expect(el.anchors).toEqual([
      { x: 'w/2', y: 0 },
      { x: 'w/2', y: 'h' },
      { x: 0, y: 'h/2' },
      { x: 'w', y: 'h/2' },
    ])
  })

  it('图形默认尺寸', () => {
    const expected: Record<string, [number, number]> = {
      rectangle: [96, 54],
      roundRectangle: [96, 54],
      round: [54, 54],
      diamond: [96, 54],
      triangle: [62, 54],
      polygon: [57, 54],
      hexagon: [65, 54],
      octagon: [54, 54],
      pentagon: [54, 54], // 五角星
      sector: [54, 54],
      sector90TR: [54, 54],
      sector90TL: [54, 54],
      sector90BL: [54, 54],
      sector90BR: [54, 54],
      sector270: [54, 54],
      sector2: [96, 54],
      arcBandTR: [54, 54],
      arcBandTL: [54, 54],
      arcBandBL: [54, 54],
      arcBandBR: [54, 54],
      cloud: [69, 54],
      comment: [69, 54],
      teardrop: [54, 54],
      cross: [54, 54],
      apqc: [72, 54],
      singleLeftArrow: [81, 54],
      singleRightArrow: [81, 54],
      doubleHorizontalArrow: [81, 54],
      singleUpArrow: [36, 54],
      singleDownArrow: [36, 54],
      doubleVerticalArrow: [36, 54],
      backArrow: [54, 54],
      rightBackArrow: [54, 54],
      corner: [54, 54],
      braces: [200, 140],
      parentheses: [200, 140],
      rightBrace: [100, 140],
      leftBrace: [100, 140],
    }
    for (const [name, [w, h]] of Object.entries(expected)) {
      const el = shapeRegistry.createElement(name, 0, 0)!
      expect(el.props.w, `${name}.w`).toBe(w)
      expect(el.props.h, `${name}.h`).toBe(h)
    }
  })

  it('registry 注册了全部 43 个基础图形', () => {
    expect(basicShapes).toHaveLength(43)
    const names = basicShapes.map((s) => s.name)
    // 基础几何
    expect(names).toContain('rectangle')
    expect(names).toContain('roundRectangle')
    expect(names).toContain('round')
    expect(names).toContain('triangle')
    expect(names).toContain('diamond')
    expect(names).toContain('polygon') // 五边形
    expect(names).toContain('hexagon')
    expect(names).toContain('octagon')
    expect(names).toContain('pentagon') // 五角星
    // 曲线图形
    expect(names).toContain('sector')
    for (const dir of ['TR', 'TL', 'BL', 'BR']) {
      expect(names).toContain(`sector90${dir}`)
    }
    expect(names).toContain('sector270')
    expect(names).toContain('sector2')
    for (const dir of ['TR', 'TL', 'BL', 'BR']) {
      expect(names).toContain(`arcBand${dir}`)
    }
    expect(names).toContain('cloud')
    expect(names).toContain('comment')
    expect(names).toContain('teardrop')
    // 十字形与 APQC
    expect(names).toContain('cross')
    expect(names).toContain('apqc')
    // 箭头类
    expect(names).toContain('singleLeftArrow')
    expect(names).toContain('singleRightArrow')
    expect(names).toContain('doubleHorizontalArrow')
    expect(names).toContain('singleUpArrow')
    expect(names).toContain('singleDownArrow')
    expect(names).toContain('doubleVerticalArrow')
    expect(names).toContain('backArrow')
    expect(names).toContain('rightBackArrow')
    expect(names).toContain('corner')
    // 括号类
    expect(names).toContain('braces')
    expect(names).toContain('parentheses')
    expect(names).toContain('rightBrace')
    expect(names).toContain('leftBrace')
  })

  it('三角形锚点为四边中点', () => {
    const el = shapeRegistry.createElement('triangle', 0, 0)!
    expect(el.anchors).toEqual([
      { x: 'w/2', y: 0 },
      { x: 'w/2', y: 'h' },
      { x: 'w*0.25', y: 'h/2' },
      { x: 'w*0.75', y: 'h/2' },
    ])
  })
})

describe('createElementAtCenter（以拖拽中心点创建）', () => {
  it('props.x/y 为中心点减去半宽半高', () => {
    const el = shapeRegistry.createElementAtCenter('rectangle', 500, 400)!
    expect(el.props.x).toBe(500 - el.props.w / 2)
    expect(el.props.y).toBe(400 - el.props.h / 2)
  })

  it('未注册图形返回 null', () => {
    expect(shapeRegistry.createElementAtCenter('nope', 0, 0)).toBeNull()
  })

  it('实例与 schema 不共享可变引用（原地写入不污染注册表）', () => {
    const schema = shapeRegistry.getShape('diamond')!
    const a = shapeRegistry.createElement('diamond', 0, 0)!
    const b = shapeRegistry.createElement('diamond', 0, 0)!
    // 模拟未来双击编辑文本等原地写入
    ;(a.textBlock[0] as { text: string }).text = '已修改'
    ;(a.anchors[0] as { x: string }).x = 'w/3'
    a.props.w = 999
    expect((b.textBlock[0] as { text: string }).text).toBe('')
    expect(b.anchors[0].x).not.toBe('w/3')
    expect(schema.anchors![0].x).not.toBe('w/3')
    expect(b.props.w).toBe(schema.props!.w)
  })
})

describe('扇形家族几何（贝塞尔弧精度）', () => {
  const W = 54
  const H = 54
  const ev = (expr: string | number) =>
    typeof expr === 'number' ? expr : new Function('w', 'h', `return (${expr})`)(W, H)

  /** 取图形第一条子路径的动作 */
  const actions = (name: string) => {
    const seg = shapeRegistry.getShape(name)!.path[0]
    return Array.isArray(seg) ? seg : seg.actions
  }

  /** 三次贝塞尔在参数 t 处的取值 */
  const at = (t: number, p0: number, p1: number, p2: number, p3: number) => {
    const u = 1 - t
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
  }

  it('所有坐标表达式求值有限且落在框内（bbox 贴框不越界）', () => {
    for (const name of ['sector90TR', 'sector90TL', 'sector90BL', 'sector90BR', 'sector270', 'arcBandTR', 'arcBandTL', 'arcBandBL', 'arcBandBR']) {
      for (const a of actions(name)) {
        for (const key of ['x', 'y', 'x1', 'y1', 'x2', 'y2'] as const) {
          const v = (a as Record<string, string | number>)[key]
          if (v === undefined) continue
          const n = ev(v as string | number)
          expect(Number.isFinite(n), `${name}.${key}=${String(v)}`).toBe(true)
          expect(n, `${name}.${key}=${String(v)} → ${n}`).toBeGreaterThanOrEqual(0)
          expect(n, `${name}.${key}=${String(v)} → ${n}`).toBeLessThanOrEqual(key.startsWith('x') ? W : H)
        }
      }
    }
  })

  it('90° 扇形与弧形（右上方向）的外弧：t=0.5 处过椭圆 45° 点（κ 近似误差 < 0.2%）', () => {
    // 其余方向的外弧中点由「拼环自洽」测试按圆心断言覆盖
    for (const name of ['sector90TR', 'arcBandTR']) {
      const c = actions(name).find((a) => a.action === 'curve')!
      expect(at(0.5, 0, ev(c.x1), ev(c.x2), ev(c.x))).toBeCloseTo(W * Math.SQRT1_2, 2)
      expect(at(0.5, 0, ev(c.y1), ev(c.y2), ev(c.y))).toBeCloseTo(H * (1 - Math.SQRT1_2), 2)
    }
  })

  it('270° 扇形：三段弧的 t=0.5 分别过 -45°、135°、135°（对称）理论点', () => {
    const curves = actions('sector270').filter((a) => a.action === 'curve')
    expect(curves).toHaveLength(3)
    // 段1 右中→底中：过 (0.854, 0.854)；起点 (w, h/2) 终点 (w/2, h)
    const c1 = curves[0]
    expect(at(0.5, W, ev(c1.x1), ev(c1.x2), ev(c1.x))).toBeCloseTo(W * 0.8536, 2)
    expect(at(0.5, H / 2, ev(c1.y1), ev(c1.y2), ev(c1.y))).toBeCloseTo(H * 0.8536, 2)
    // 段2 底中→左中：过 (0.146, 0.854)
    const c2 = curves[1]
    expect(at(0.5, W / 2, ev(c2.x1), ev(c2.x2), ev(c2.x))).toBeCloseTo(W * 0.1464, 2)
    expect(at(0.5, H, ev(c2.y1), ev(c2.y2), ev(c2.y))).toBeCloseTo(H * 0.8536, 2)
    // 段3 左中→顶中：过 (0.146, 0.146)
    const c3 = curves[2]
    expect(at(0.5, 0, ev(c3.x1), ev(c3.x2), ev(c3.x))).toBeCloseTo(W * 0.1464, 2)
    expect(at(0.5, H / 2, ev(c3.y1), ev(c3.y2), ev(c3.y))).toBeCloseTo(H * 0.1464, 2)
  })

  it('弧形内弧：0° 处带宽为 0.45w（外弧 1w − 内弧 0.55w）', () => {
    const a = actions('arcBandTR')
    const lineToInner = a.find((x) => x.action === 'line')!
    expect(ev(lineToInner.x)).toBeCloseTo(W * 0.55, 5)
    expect(ev(lineToInner.y)).toBe(H)
  })

  it('四方向弧形拼环自洽：外弧中点距圆心 = 54、内弧中点距圆心 = 0.55×54', () => {
    // 圆心 (cx,cy)、内外弧中点理论值 = 圆心 + 半径·(±√2/2, ±√2/2)
    const k = 54 * Math.SQRT1_2
    const ki = 54 * 0.55 * Math.SQRT1_2
    const CASES = [
      ['arcBandTR', 0, 54],
      ['arcBandTL', 54, 54],
      ['arcBandBL', 54, 0],
      ['arcBandBR', 0, 0],
    ] as const
    for (const [name, cx, cy] of CASES) {
      const a = actions(name)
      const curves = a.filter((x) => x.action === 'curve')
      const line = a.find((x) => x.action === 'line')!
      // 外弧：起点是 move 点；内弧：起点是 line 目标点
      const outer = curves[0]
      const inner = curves[1]
      const move = a[0] as { x: string | number; y: string | number }
      const ox = at(0.5, ev(move.x), ev(outer.x1), ev(outer.x2), ev(outer.x))
      const oy = at(0.5, ev(move.y), ev(outer.y1), ev(outer.y2), ev(outer.y))
      const ix = at(0.5, ev(line.x), ev(inner.x1), ev(inner.x2), ev(inner.x))
      const iy = at(0.5, ev(line.y), ev(inner.y1), ev(inner.y2), ev(inner.y))
      expect(Math.hypot(ox - cx, oy - cy), `${name} 外弧中点距圆心`).toBeCloseTo(54, 1)
      expect(Math.hypot(ix - cx, iy - cy), `${name} 内弧中点距圆心`).toBeCloseTo(54 * 0.55, 1)
      // 中点应在圆心与框对角的连线上（四个象限各占一角）
      const cornerX = cx === 0 ? k : 54 - k
      const cornerY = cy === 0 ? k : 54 - k
      expect(ox, `${name} 外弧中点 x`).toBeCloseTo(cornerX, 1)
      expect(oy, `${name} 外弧中点 y`).toBeCloseTo(cornerY, 1)
      const innerX = cx === 0 ? ki : 54 - ki
      const innerY = cy === 0 ? ki : 54 - ki
      expect(ix, `${name} 内弧中点 x`).toBeCloseTo(innerX, 1)
      expect(iy, `${name} 内弧中点 y`).toBeCloseTo(innerY, 1)
    }
  })

  it('四方向 90° 与 270°：端点与曲线都在框内、四边全被触及（框即包围盒）', () => {
    const TIERS: Record<string, [number, number]> = {
      sector90TR: [54, 54],
      sector90TL: [54, 54],
      sector90BL: [54, 54],
      sector90BR: [54, 54],
      sector270: [54, 54],
      arcBandTR: [54, 54],
      arcBandTL: [54, 54],
      arcBandBL: [54, 54],
      arcBandBR: [54, 54],
    }
    for (const [name, [w, h]] of Object.entries(TIERS)) {
      const evW = (expr: string | number) =>
        typeof expr === 'number' ? expr : new Function('w', 'h', `return (${expr})`)(w, h)
      const xs: number[] = []
      const ys: number[] = []
      let prev: { x: number; y: number } | null = null
      const push = (x: number, y: number) => {
        // 端点与曲线严格在框内（0.6px 容差吸收 props 取整到整数的误差）
        expect(x, `${name} x=${x}`).toBeGreaterThanOrEqual(-0.6)
        expect(x, `${name} x=${x}`).toBeLessThanOrEqual(w + 0.6)
        expect(y, `${name} y=${y}`).toBeGreaterThanOrEqual(-0.6)
        expect(y, `${name} y=${y}`).toBeLessThanOrEqual(h + 0.6)
        xs.push(x)
        ys.push(y)
      }
      for (const a of actions(name)) {
        const rec = a as Record<string, string | number | undefined>
        if (rec.x !== undefined && rec.y !== undefined) {
          prev = { x: evW(rec.x), y: evW(rec.y) }
          push(prev.x, prev.y)
        }
        if (a.action !== 'curve') continue
        // 曲线中段采样：贝塞尔曲线本身不许出框
        for (const t of [0.25, 0.5, 0.75]) {
          push(
            at(t, prev!.x, evW(rec.x1!), evW(rec.x2!), evW(rec.x!)),
            at(t, prev!.y, evW(rec.y1!), evW(rec.y2!), evW(rec.y!)),
          )
        }
      }
      // 四方向的圆心 / 弧端点在框角、270° 的弧过四边中点：四边都精确触及
      expect(Math.min(...xs), `${name} 不贴左边`).toBeCloseTo(0, 0)
      expect(Math.max(...xs), `${name} 不贴右边`).toBeCloseTo(w, 0)
      expect(Math.min(...ys), `${name} 不贴顶边`).toBeCloseTo(0, 0)
      expect(Math.max(...ys), `${name} 不贴底边`).toBeCloseTo(h, 0)
    }
  })

  it('四方向 90° 拼圆自洽：弧中点各在象限对角线上、到圆心距离 = 半径', () => {
    // 圆心 (cx,cy)、弧中点理论值 = 圆心 + 54·(±√2/2, ±√2/2)
    const CASES = [
      ['sector90TR', 0, 54, 38.1838, 15.8162],
      ['sector90TL', 54, 54, 15.8162, 15.8162],
      ['sector90BL', 54, 0, 15.8162, 38.1838],
      ['sector90BR', 0, 0, 38.1838, 38.1838],
    ] as const
    for (const [name, cx, cy, mx, my] of CASES) {
      const a = actions(name)
      const line = a.find((x) => x.action === 'line')!
      const c = a.find((x) => x.action === 'curve')!
      // 弧中点 t=0.5：cubic 在 90° 弧段中点恰过理论点（κ 近似性质）
      const px = at(0.5, ev(line.x), ev(c.x1), ev(c.x2), ev(c.x))
      const py = at(0.5, ev(line.y), ev(c.y1), ev(c.y2), ev(c.y))
      expect(px, `${name} 弧中点 x`).toBeCloseTo(mx, 1)
      expect(py, `${name} 弧中点 y`).toBeCloseTo(my, 1)
      expect(Math.hypot(px - cx, py - cy), `${name} 弧中点距圆心`).toBeCloseTo(54, 1)
    }
  })

  it('控制点允许越界 ≤10%（圆弧贝塞尔近似的控制臂天然在圆外，曲线本身不出框）', () => {
    const TIERS: Record<string, [number, number]> = {
      sector90TR: [54, 54],
      sector90TL: [54, 54],
      sector90BL: [54, 54],
      sector90BR: [54, 54],
      sector270: [54, 54],
      arcBandTR: [54, 54],
      arcBandTL: [54, 54],
      arcBandBL: [54, 54],
      arcBandBR: [54, 54],
    }
    for (const [name, [w, h]] of Object.entries(TIERS)) {
      const evW = (expr: string | number) =>
        typeof expr === 'number' ? expr : new Function('w', 'h', `return (${expr})`)(w, h)
      for (const a of actions(name)) {
        const rec = a as Record<string, string | number | undefined>
        for (const key of ['x1', 'y1', 'x2', 'y2'] as const) {
          const v = rec[key]
          if (v === undefined) continue
          const n = evW(v)
          const [lo, hi] = key.startsWith('x') ? [-w * 0.1, w * 1.1] : [-h * 0.1, h * 1.1]
          expect(n, `${name}.${key}=${String(v)} → ${n}`).toBeGreaterThanOrEqual(lo)
          expect(n, `${name}.${key}=${String(v)} → ${n}`).toBeLessThanOrEqual(hi)
        }
      }
    }
  })

  it('弧分段数 = ceil(θ/90°)，子路径结构：move 圆心 → line 弧起点 → 曲线段们 → close', () => {
    const CASES: Array<[string, number]> = [
      ['sector90TR', 1],
      ['sector90TL', 1],
      ['sector90BL', 1],
      ['sector90BR', 1],
      ['sector270', 3],
    ]
    for (const [name, segCount] of CASES) {
      const a = actions(name)
      expect(a.filter((x) => x.action === 'curve'), `${name} 弧段数`).toHaveLength(segCount)
      expect(a[0].action).toBe('move')
      expect(a[1].action).toBe('line')
      expect(a[a.length - 1].action).toBe('close')
    }
  })
})
