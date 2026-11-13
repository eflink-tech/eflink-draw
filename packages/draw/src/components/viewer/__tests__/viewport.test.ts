import { describe, expect, it } from 'vitest'
import {
  centerTransform,
  clampTransform,
  computeFitScale,
  fitTransform,
  zoomTransformAt,
  type ViewerBounds,
  type ViewerFrame,
} from '../viewport'

const bounds: ViewerBounds = { minX: 100, minY: 50, maxX: 500, maxY: 450 } // 400 × 400

const frame = (width: number, height: number, padding = 8): ViewerFrame => ({ width, height, padding })

describe('computeFitScale', () => {
  it('按宽度适配', () => {
    expect(computeFitScale(bounds, frame(816, 1000), 8)).toBeCloseTo(2)
  })

  it('按高度适配', () => {
    expect(computeFitScale(bounds, frame(1000, 416), 8)).toBeCloseTo(1)
  })

  it('受 maxScale 限制', () => {
    expect(computeFitScale(bounds, frame(2000, 2000), 1.5)).toBeCloseTo(1.5)
  })
})

describe('centerTransform', () => {
  it('内容在视口内水平垂直居中', () => {
    const transform = centerTransform(bounds, frame(816, 816), 1)
    // 内容 400×400，视口 816×816 → 左右各留 208，映射到画布坐标
    expect(transform.x + bounds.minX).toBeCloseTo(208)
    expect(transform.y + bounds.minY).toBeCloseTo(208)
    expect(transform.x + bounds.maxX).toBeCloseTo(608)
    expect(transform.y + bounds.maxY).toBeCloseTo(608)
  })

  it('fitTransform 与 centerTransform(computeFitScale) 一致', () => {
    const f = frame(1000, 700)
    expect(fitTransform(bounds, f, 2)).toEqual(centerTransform(bounds, f, computeFitScale(bounds, f, 2)))
  })
})

describe('clampTransform', () => {
  const smallFrame = frame(816, 816)

  it('内容小于视口时强制居中，忽略平移', () => {
    const transform = clampTransform({ scale: 1, x: 500, y: 500 }, bounds, smallFrame, 0.1, 8)
    expect(transform.x + bounds.minX).toBeCloseTo(208)
    expect(transform.y + bounds.minY).toBeCloseTo(208)
  })

  it('内容大于视口时限制边缘留白', () => {
    const tightFrame = frame(700, 700)
    const large = clampTransform({ scale: 2, x: -10000, y: -10000 }, bounds, tightFrame, 0.1, 8)
    // 右边缘刚好贴住 padding，左边缘被裁掉
    expect(large.x + bounds.maxX * 2).toBeCloseTo(700 - 8)
    expect(large.y + bounds.maxY * 2).toBeCloseTo(700 - 8)

    const other = clampTransform({ scale: 2, x: 10000, y: 10000 }, bounds, tightFrame, 0.1, 8)
    expect(other.x + bounds.minX * 2).toBeCloseTo(8)
    expect(other.y + bounds.minY * 2).toBeCloseTo(8)
  })

  it('收敛缩放比例', () => {
    expect(clampTransform({ scale: 99, x: 0, y: 0 }, bounds, smallFrame, 0.5, 4).scale).toBe(4)
    expect(clampTransform({ scale: 0.01, x: 0, y: 0 }, bounds, smallFrame, 0.5, 4).scale).toBe(0.5)
  })
})

describe('zoomTransformAt', () => {
  it('锚点下的内容在缩放前后保持不动', () => {
    const start = fitTransform(bounds, frame(816, 816), 2)
    const pointer = { x: 300, y: 250 }
    const worldBefore = {
      x: (pointer.x - start.x) / start.scale,
      y: (pointer.y - start.y) / start.scale,
    }
    const next = zoomTransformAt(start, bounds, frame(816, 816), pointer, start.scale * 2, start.scale, 8)
    const worldAfter = {
      x: (pointer.x - next.x) / next.scale,
      y: (pointer.y - next.y) / next.scale,
    }
    expect(next.scale).toBeCloseTo(start.scale * 2)
    expect(worldAfter.x).toBeCloseTo(worldBefore.x)
    expect(worldAfter.y).toBeCloseTo(worldBefore.y)
  })

  it('缩放比例被上下限收敛', () => {
    const start = fitTransform(bounds, frame(816, 816), 2)
    const pointer = { x: 400, y: 400 }
    expect(zoomTransformAt(start, bounds, frame(816, 816), pointer, 100, 0.5, 3).scale).toBe(3)
    expect(zoomTransformAt(start, bounds, frame(816, 816), pointer, 0.01, 0.5, 3).scale).toBe(0.5)
  })
})
