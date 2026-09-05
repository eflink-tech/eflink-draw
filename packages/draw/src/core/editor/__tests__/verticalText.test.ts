import { describe, it, expect } from 'vitest'
import { layoutVerticalText } from '../verticalText'

describe('layoutVerticalText', () => {
  it('空字符串返回空数组', () => {
    expect(layoutVerticalText('', { w: 100, h: 100, fontSize: 14 })).toEqual([])
  })

  it('单字符居中排列', () => {
    const result = layoutVerticalText('你', { w: 100, h: 100, fontSize: 14 })
    expect(result).toHaveLength(1)
    expect(result[0]!.text).toBe('你')
    // 单列，x 应居中附近
    expect(result[0]!.x).toBeGreaterThan(0)
    expect(result[0]!.x).toBeLessThan(100)
  })

  it('多列从右到左排列（中文竖排规范）', () => {
    // 4 个字，h 只够放 2 个 → 断为 2 列
    const result = layoutVerticalText('你好世界', { w: 200, h: 40, fontSize: 14 })
    // 应该有两列
    const xs = [...new Set(result.map(g => g.x))].sort((a, b) => b - a) // 降序
    expect(xs.length).toBe(2)
    // 第一列（c=0，字符"你""好"）x 应更大（更靠右）
    const firstCol = result.filter(g => g.text === '你' || g.text === '好')
    const secondCol = result.filter(g => g.text === '世' || g.text === '界')
    expect(firstCol[0]!.x).toBeGreaterThan(secondCol[0]!.x)
  })

  it('换行符触发列断裂', () => {
    const result = layoutVerticalText('你\n好', { w: 200, h: 200, fontSize: 14 })
    const xs = [...new Set(result.map(g => g.x))]
    expect(xs.length).toBe(2) // 两列
  })

  it('align=right 时首列紧贴右边缘', () => {
    const result = layoutVerticalText('你', { w: 200, h: 100, fontSize: 14, align: 'right' })
    const colWidth = 14 * 1.1
    // 单列，右对齐：x ≈ w - colWidth
    expect(result[0]!.x).toBeCloseTo(200 - colWidth, 0)
  })

  it('vAlign=top 时首字在顶部', () => {
    const result = layoutVerticalText('你', { w: 100, h: 100, fontSize: 14, vAlign: 'top' })
    expect(result[0]!.y).toBe(0)
  })
})
