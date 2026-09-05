import { describe, it, expect } from 'vitest'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import type { ElementInstance } from '@/types'
import { evalTextBlockRect, hitTextBlock } from '../textEdit'

/** rectangle：100×70，默认文本块 {x:10, y:0, w:'w-20', h:'h'} → 局部 (10,0)-(90,70) */
function makeElement(): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', 100, 100)
  if (!el) throw new Error('rectangle 未注册')
  return el
}

describe('evalTextBlockRect', () => {
  it('求值表达式 position', () => {
    const el = makeElement()
    const r = evalTextBlockRect(el.textBlock[0]!, el.props.w, el.props.h)
    expect(r).toEqual({ x: 10, y: 0, w: 80, h: 70 })
  })

  it('evalTextBlockRect 对多块 textBlock 各自求值', () => {
    const tb1 = { position: { x: 0, y: 0, w: 'w', h: 'h/3' }, text: '上' }
    const tb2 = { position: { x: 0, y: 'h/3', w: 'w', h: 'h/3' }, text: '中' }
    const tb3 = { position: { x: 0, y: '2*h/3', w: 'w', h: 'h/3' }, text: '下' }
    expect(evalTextBlockRect(tb1, 100, 90)).toEqual({ x: 0, y: 0, w: 100, h: 30 })
    expect(evalTextBlockRect(tb2, 100, 90)).toEqual({ x: 0, y: 30, w: 100, h: 30 })
    expect(evalTextBlockRect(tb3, 100, 90)).toEqual({ x: 0, y: 60, w: 100, h: 30 })
  })
})

describe('hitTextBlock', () => {
  it('命中块内点返回 0', () => {
    const el = makeElement()
    // 图形中心 (150,135)
    expect(hitTextBlock(el, 150, 135)).toBe(0)
  })

  it('图形内但块外（左边距 5 < 块 x=10）兜底返回 0', () => {
    const el = makeElement()
    expect(hitTextBlock(el, 105, 135)).toBe(0)
  })

  it('含旋转反算：旋转 90° 后世界正下方 20px 命中', () => {
    const el = makeElement()
    const rotated = { ...el, props: { ...el.props, angle: Math.PI / 2 } }
    // 旋转 90°：世界 (150,155) → 局部 (70,35)，仍在块 (10..90, 0..70) 内
    expect(hitTextBlock(rotated, 150, 155)).toBe(0)
  })

  it('无 textBlock 返回 -1（不进入编辑）', () => {
    const el = { ...makeElement(), textBlock: [] }
    expect(hitTextBlock(el, 150, 135)).toBe(-1)
  })

  it('多 textBlock 区分下标：右半区命中第 1 块', () => {
    const el = {
      ...makeElement(),
      textBlock: [
        { position: { x: 0, y: 0, w: 50, h: 70 }, text: '' },
        { position: { x: 50, y: 0, w: 50, h: 70 }, text: '' },
      ],
    }
    // 左半区 (120,135) → 局部 (20,35) 命中块 0
    expect(hitTextBlock(el, 120, 135)).toBe(0)
    // 右半区 (180,135) → 局部 (80,35) 命中块 1（若实现硬编码 0 或忽略遍历，此断言失败）
    expect(hitTextBlock(el, 180, 135)).toBe(1)
  })

  it('choreographyTask 三块分区命中（旧系统顺序：0=中段）', () => {
    const el = shapeRegistry.createElement('choreographyTask', 100, 100)!
    // 图形 120×120，中心 (160,160)
    expect(hitTextBlock(el, 160, 110)).toBe(1) // 上参与者 y≈0..25
    expect(hitTextBlock(el, 160, 160)).toBe(0) // 中段 y≈30..90
    expect(hitTextBlock(el, 160, 205)).toBe(2) // 下参与者 y≈95..120
  })

  it('choreographyTask 分隔线间隙命中最近块（非硬编码块 0）', () => {
    const el = shapeRegistry.createElement('choreographyTask', 100, 100)!
    // y=27 落在顶块(0..25)与中段(30..90)间隙，应偏向顶块
    expect(hitTextBlock(el, 160, 127)).toBe(1)
    // y=92 落在中段与底块(95..120)间隙，应偏向底块
    expect(hitTextBlock(el, 160, 192)).toBe(2)
  })

  it('旋转反算锁定：旋转 180° 后左右块互换命中', () => {
    const base = makeElement()
    const el = {
      ...base,
      props: { ...base.props, angle: Math.PI },
      textBlock: [
        { position: { x: 0, y: 0, w: 50, h: 70 }, text: '' },
        { position: { x: 50, y: 0, w: 50, h: 70 }, text: '' },
      ],
    }
    // 旋转 180°：世界 (120,135) → 局部 (80,35) 命中块 1（若忽略旋转直接平移，会得局部 (20,35) 命中块 0，断言失败）
    expect(hitTextBlock(el, 120, 135)).toBe(1)
    // 世界 (180,135) → 局部 (20,35) 命中块 0
    expect(hitTextBlock(el, 180, 135)).toBe(0)
  })
})
