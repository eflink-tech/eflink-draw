import { describe, it, expect } from 'vitest'
import type { DocumentData, ElementInstance, LinkerInstance } from '@/types'
import { computeContentBounds, CONTENT_MARGIN, rotatedRectBounds } from '../contentBounds'

function shape(overrides: Partial<ElementInstance['props']> = {}): ElementInstance {
  return {
    id: 's1',
    name: 'rectangle',
    props: { x: 100, y: 50, w: 200, h: 100, zindex: 1, angle: 0, ...overrides },
  } as ElementInstance
}

function linker(points: Array<{ x: number; y: number }>): LinkerInstance {
  const first = points[0]!
  const last = points[points.length - 1]!
  return {
    id: 'l1',
    name: 'linker',
    from: { id: null, x: first.x, y: first.y, angle: 0 },
    to: { id: null, x: last.x, y: last.y, angle: 0 },
    points,
    props: { zindex: 2 },
  } as LinkerInstance
}

function doc(...els: Array<ElementInstance | LinkerInstance>): DocumentData {
  return {
    page: {
      showGrid: false,
      gridSize: 10,
      orientation: 'landscape',
      width: 1600,
      height: 1200,
      backgroundColor: '255,255,255',
      padding: 0,
    },
    elements: Object.fromEntries(els.map((el) => [el.id, el])),
  }
}

describe('computeContentBounds', () => {
  it('空文档返回 null', () => {
    expect(computeContentBounds(doc())).toBeNull()
  })

  it('普通图形 = 外接矩形 + 内容留白', () => {
    const b = computeContentBounds(doc(shape()))!
    expect(b).toEqual({
      minX: 100 - CONTENT_MARGIN,
      minY: 50 - CONTENT_MARGIN,
      maxX: 300 + CONTENT_MARGIN,
      maxY: 150 + CONTENT_MARGIN,
    })
  })

  it('旋转图形按旋转后的四角扩张', () => {
    const b = computeContentBounds(doc(shape({ angle: Math.PI / 2 })))!
    // 中心 (200,100)，旋转 90° 后竖向包围盒高 200
    expect(b.minY).toBeCloseTo(100 - 100 - CONTENT_MARGIN)
    expect(b.maxY).toBeCloseTo(100 + 100 + CONTENT_MARGIN)
  })

  it('计入连线折点（可能伸出图形范围外）', () => {
    const b = computeContentBounds(
      doc(shape(), linker([{ x: 0, y: 0 }, { x: 450, y: 300 }])),
    )!
    expect(b.minX).toBe(-CONTENT_MARGIN)
    expect(b.minY).toBe(-CONTENT_MARGIN)
    expect(b.maxX).toBe(450 + CONTENT_MARGIN)
    expect(b.maxY).toBe(300 + CONTENT_MARGIN)
  })

  it('只有连线也返回外接框', () => {
    const b = computeContentBounds(doc(linker([{ x: 10, y: 20 }, { x: 90, y: 120 }])))!
    expect(b).toEqual({
      minX: 10 - CONTENT_MARGIN,
      minY: 20 - CONTENT_MARGIN,
      maxX: 90 + CONTENT_MARGIN,
      maxY: 120 + CONTENT_MARGIN,
    })
  })
})

describe('rotatedRectBounds', () => {
  it('未旋转时等于 props 矩形', () => {
    expect(rotatedRectBounds(shape())).toEqual({ minX: 100, minY: 50, maxX: 300, maxY: 150 })
  })
})
