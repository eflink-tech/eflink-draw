// 网格计算测试
// - 减法调色 getDarkerColor(c, 13) / getDarkestColor(c, 26)
// - 线画在屏幕空间 0.5 偏移处（1px 锐利）
// - 每屏 4 条线一条主线（g % 4 == 0，从原点起算）
import { describe, it, expect } from 'vitest'
import {
  getDarkerColor,
  getDarkestColor,
  computeGridLines,
  computePageRect,
  computePageGridLines,
} from '../grid'

describe('getDarkerColor（减法调色）', () => {
  it('白色 → 242（255 - 255/255*13）', () => {
    expect(getDarkerColor('255,255,255')).toBe('242,242,242')
  })

  it('彩色按各通道独立减法（102,255,179 → 97,242,170）', () => {
    expect(getDarkerColor('102,255,179')).toBe('97,242,170')
  })

  it('自定义强度 26', () => {
    expect(getDarkerColor('255,255,255', 26)).toBe('229,229,229')
  })
})

describe('getDarkestColor', () => {
  it('白色 → 229（强度 26）', () => {
    expect(getDarkestColor('255,255,255')).toBe('229,229,229')
  })
})

describe('computeGridLines（屏幕空间 0.5 偏移对齐）', () => {
  it('100% 缩放无平移：线在 0.5/10.5/20.5，k%4 为主线', () => {
    const { vertical, horizontal } = computeGridLines({
      width: 35,
      height: 25,
      gridSize: 10,
      scale: 1,
      panX: 0,
      panY: 0,
    })
    expect(vertical.map((l) => l.world)).toEqual([0.5, 10.5, 20.5, 30.5])
    expect(vertical.map((l) => l.major)).toEqual([true, false, false, false])
    expect(horizontal.map((l) => l.world)).toEqual([0.5, 10.5, 20.5])
    expect(horizontal.map((l) => l.major)).toEqual([true, false, false])
  })

  it('平移后：主线仍锚定世界原点（i 为世界网格线索引）', () => {
    const { vertical } = computeGridLines({
      width: 35,
      height: 25,
      gridSize: 10,
      scale: 1,
      panX: -25,
      panY: 0,
    })
    // 屏幕 = world + pan：可见 i=3..5 → world 30.5/40.5/50.5（屏幕 5.5/15.5/25.5）
    expect(vertical.map((l) => l.world)).toEqual([30.5, 40.5, 50.5])
    // 世界线 i=4 是主线（不随平移改变）
    expect(vertical.map((l) => l.major)).toEqual([false, true, false])
  })

  it('200% 缩放：屏幕间距 gridSize*scale，world 反推回屏幕仍是 0.5 偏移', () => {
    const { vertical } = computeGridLines({
      width: 80,
      height: 40,
      gridSize: 10,
      scale: 2,
      panX: 0,
      panY: 0,
    })
    // d = 20，屏幕 0.5/20.5/40.5/60.5 → world = 0.25/10.25/20.25/30.25
    expect(vertical.map((l) => l.world)).toEqual([0.25, 10.25, 20.25, 30.25])
  })

  it('gridSize*scale < 10 时屏幕间距最小 10', () => {
    const { vertical } = computeGridLines({
      width: 35,
      height: 25,
      gridSize: 4,
      scale: 1,
      panX: 0,
      panY: 0,
    })
    expect(vertical.map((l) => l.world)).toEqual([0.5, 10.5, 20.5, 30.5])
  })
})

describe('computePageRect（固定页面矩形）', () => {
  it('landscape 直接用 width×height，白区为整页', () => {
    const rect = computePageRect({ width: 1600, height: 1200, orientation: 'landscape', padding: 0 })
    expect(rect.width).toBe(1600)
    expect(rect.height).toBe(1200)
    expect(rect.inner).toEqual({ x: 0, y: 0, width: 1600, height: 1200 })
  })

  it('portrait 互换宽高（1200×1600）', () => {
    const rect = computePageRect({ width: 1600, height: 1200, orientation: 'portrait', padding: 0 })
    expect(rect.width).toBe(1200)
    expect(rect.height).toBe(1600)
    expect(rect.inner).toEqual({ x: 0, y: 0, width: 1200, height: 1600 })
  })

  it('padding 内缩白区（页面总尺寸不变）', () => {
    const rect = computePageRect({ width: 1600, height: 1200, orientation: 'landscape', padding: 20 })
    expect(rect.width).toBe(1600)
    expect(rect.height).toBe(1200)
    expect(rect.inner).toEqual({ x: 20, y: 20, width: 1560, height: 1160 })
  })
})

describe('computePageGridLines（网格线只画在页面白区内）', () => {
  const page = { width: 40, height: 30, orientation: 'landscape' as const, padding: 0, gridSize: 10 }

  it('线段端点钳制在页面边界，页面外的线被过滤', () => {
    // 竖线只到 x=30.5（40.5 在页面外被滤掉）
    const { vertical, horizontal } = computePageGridLines(page, { scale: 1 })
    expect(vertical.map((l) => l.x1)).toEqual([0.5, 10.5, 20.5, 30.5])
    // 竖线贯穿页面高度：y 从 0 到 30
    expect(vertical[0]).toMatchObject({ x1: 0.5, y1: 0, x2: 0.5, y2: 30 })
    expect(horizontal.map((l) => l.y1)).toEqual([0.5, 10.5, 20.5])
    expect(horizontal[0]).toMatchObject({ x1: 0, y1: 0.5, x2: 40, y2: 0.5 })
  })

  it('padding 白区：线段钳制到内缩矩形', () => {
    const { vertical } = computePageGridLines({ ...page, padding: 5 }, { scale: 1 })
    // x ∈ [5, 35] → 10.5/20.5/30.5（0.5 与 40.5 在白区外）
    expect(vertical.map((l) => l.x1)).toEqual([10.5, 20.5, 30.5])
    expect(vertical[0]).toMatchObject({ y1: 5, y2: 25 })
  })

  it('与平移无关：全页线集合固定（拖拽中不重渲染也不缺线）', () => {
    // 页面比视口大时，向左/上拖露出的页面部分必须已有线——
    // 线集合按页面矩形生成，不按视口裁剪
    const { vertical } = computePageGridLines(page, { scale: 1 })
    expect(vertical.map((l) => l.x1)).toEqual([0.5, 10.5, 20.5, 30.5])
  })

  it('50% 缩放：屏幕间距最小 10 → 世界间距 20', () => {
    const { vertical } = computePageGridLines(page, { scale: 0.5 })
    // d = max(round(10*0.5), 10) = 10，world = (i*10+0.5)/0.5 = 20i+1 → 1, 21
    expect(vertical.map((l) => l.x1)).toEqual([1, 21])
  })
})
