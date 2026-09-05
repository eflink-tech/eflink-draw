import { describe, it, expect } from 'vitest'
import { getContentWorldBounds, getScrollBounds, thumbPosFromVp, vpFromThumbPos } from '@/core/editor/viewportBounds'
import type { ElementInstance, LinkerInstance } from '@/types'

function shape(x: number, y: number, w: number, h: number): ElementInstance {
  return {
    id: 's',
    name: 'rectangle',
    locked: false,
    textBlock: [],
    props: { x, y, w, h, zindex: 0 },
  } as unknown as ElementInstance
}

function linker(from: { x: number; y: number }, to: { x: number; y: number }, points: Array<{ x: number; y: number }> = []): LinkerInstance {
  return {
    id: 'l',
    name: 'linker',
    from: { ...from, id: null },
    to: { ...to, id: null },
    points,
    props: { zindex: 0 },
  } as unknown as LinkerInstance
}

describe('getContentWorldBounds', () => {
  it('无元素时返回空盒(0,0,0,0)', () => {
    expect(getContentWorldBounds({})).toEqual({ minX: 0, minY: 0, maxX: 0, maxY: 0 })
  })

  it('图形按 x/y/w/h 计算包围盒', () => {
    const bounds = getContentWorldBounds({ a: shape(10, 20, 30, 40), b: shape(-5, 100, 10, 5) })
    expect(bounds).toEqual({ minX: -5, minY: 20, maxX: 40, maxY: 105 })
  })

  it('连线端点与折点计入包围盒', () => {
    const l = linker({ x: 5, y: 5 }, { x: 50, y: 60 }, [{ x: 30, y: 2 }, { x: 100, y: 80 }])
    const bounds = getContentWorldBounds({ l })
    expect(bounds).toEqual({ minX: 5, minY: 2, maxX: 100, maxY: 80 })
  })

  it('图形与连线混合取并集', () => {
    const bounds = getContentWorldBounds({ s: shape(0, 0, 100, 10), l: linker({ x: -20, y: 0 }, { x: 0, y: 0 }) })
    expect(bounds).toEqual({ minX: -20, minY: 0, maxX: 100, maxY: 10 })
  })
})

describe('getScrollBounds', () => {
  // 默认页面 1600×1200,视口 800×703(去掉左右面板后)
  const PAGE = { minX: 0, minY: 0, maxX: 1600, maxY: 1200 }

  it('scale=1 页面:页面中心对准视口中心,行程=超出量+两端衬板(pad=1000)', () => {
    const b = getScrollBounds(800, 703, PAGE, 1)
    expect(b.hRange).toBe(2800) // 1600 - 800 + 2000
    expect(b.hMinVx).toBe(-1800)
    expect(b.hMaxVx).toBe(1000)
    expect(b.vRange).toBe(2497) // 1200 - 703 + 2000
    expect(b.vMinVy).toBeCloseTo(-1497)
    expect(b.vMaxVy).toBeCloseTo(1000)
  })

  it('放大 200%:滚到头能到达页面真实右/下边缘', () => {
    const b = getScrollBounds(800, 703, PAGE, 2)
    expect(b.hRange).toBe(4400) // 3200 - 800 + 2000
    // 看到页面最右(世界 1600)至少需要 vp <= 800 - 3200 = -2400
    expect(b.hMinVx).toBeLessThanOrEqual(-2400)
    // 看到页面最下(世界 1200)至少需要 vp <= 703 - 2400 = -1697
    expect(b.vMinVy).toBeLessThanOrEqual(-1697)
  })

  it('内容画到页面外右下:边界向内容外延扩展,可滚到内容边缘', () => {
    // 内容扩展到世界 (1800,1400),(内容在页面右下外侧)
    const world = { ...PAGE, maxX: 1800, maxY: 1400 }
    const b = getScrollBounds(800, 703, world, 1)
    expect(b.hMinVx).toBeLessThanOrEqual(800 - 1800 - 1000) // 还能多滚 1000 衬板
    expect(b.vMinVy).toBeLessThanOrEqual(703 - 1400 - 1000)
  })

  it('内容在页面左上外侧(负坐标):边界覆盖负方向,可滚到负坐标内容', () => {
    const world = { minX: -400, minY: -300, maxX: 1000, maxY: 800 }
    const b = getScrollBounds(800, 703, world, 1)
    // 看到世界 -400 至少需要 vp >= 400(-vp/scale <= -400 → vp >= 400)
    expect(b.hMaxVx).toBeGreaterThanOrEqual(400)
    // 看到世界 -300 至少需要 vp >= 300
    expect(b.vMaxVy).toBeGreaterThanOrEqual(300)
  })

  it('内容小于视口:行程固定为两端衬板边距', () => {
    // scale=0.5 时页面 800×600,视口 800×703
    const b = getScrollBounds(800, 703, PAGE, 0.5)
    expect(b.hRange).toBe(2000) // 800 - 800 + 2000
    expect(b.vRange).toBe(1897) // 600 < 703,超出量为 0 → 0 + 2000 - 103 = 1897
    expect(b.hMinVx).toBe(-1000)
    expect(b.hMaxVx).toBe(1000)
  })
})

describe('thumbPosFromVp / vpFromThumbPos 方向(核心回归:thumb 与 viewport 映射不得反向)', () => {
  // 页面 0..1600,scale=2 的实测边界:vp 越大看的越靠左,hMaxVx 是最左,hMinVx 是最右
  const H_MIN = -2500
  const H_MAX = 100
  const LEN = 600

  it('vp 最大(看内容最左)→ thumb 在轨道最左', () => {
    expect(thumbPosFromVp(H_MIN, H_MAX, H_MAX, LEN)).toBe(0)
  })

  it('vp 最小(看内容最右)→ thumb 在轨道最右', () => {
    expect(thumbPosFromVp(H_MIN, H_MAX, H_MIN, LEN)).toBe(LEN)
  })

  it('thumb 位置与可见内容的右缘世界坐标成正比(向右拖能看到更右的内容)', () => {
    const visibleRight = (vp: number) => (800 - vp) / 2 // viewW=800, scale=2
    const posL = thumbPosFromVp(H_MIN, H_MAX, 0, LEN) // vp=0 时的 thumb 位置
    const posR = thumbPosFromVp(H_MIN, H_MAX, -1200, LEN) // vp=-1200:能看到世界右缘 (800+1200)/2=1000
    expect(posR).toBeGreaterThan(posL)
    expect(visibleRight(-1200)).toBeGreaterThan(visibleRight(0))
  })

  it('200% 下要看到页面最右(世界 1600)必须把 thumb 几乎拖到最右端', () => {
    // 看到 world 1600 至少需要 vp <= 800 - 1600*2 = -2400
    const bandTop = thumbPosFromVp(H_MIN, H_MAX, -2400, LEN)
    expect(bandTop).toBeGreaterThan(LEN * 0.9)
  })

  it('逆映射:pos=0→maxVp,pos=len→minVp,中点→中点', () => {
    expect(vpFromThumbPos(H_MIN, H_MAX, 0, LEN)).toBe(H_MAX)
    expect(vpFromThumbPos(H_MIN, H_MAX, LEN, LEN)).toBe(H_MIN)
    expect(vpFromThumbPos(H_MIN, H_MAX, LEN / 2, LEN)).toBe((H_MIN + H_MAX) / 2)
  })

  it('往返一致:vp→thumb→vp 还原', () => {
    for (const vp of [-2500, -2000, -1200, 0, 50, 100]) {
      const round = vpFromThumbPos(H_MIN, H_MAX, thumbPosFromVp(H_MIN, H_MAX, vp, LEN), LEN)
      expect(round).toBeCloseTo(vp, 6)
    }
  })

  it('trackLen=0(不可滚动)时逆映射返回边界中点,不除零', () => {
    expect(vpFromThumbPos(H_MIN, H_MAX, 0, 0)).toBe((H_MIN + H_MAX) / 2)
  })
})