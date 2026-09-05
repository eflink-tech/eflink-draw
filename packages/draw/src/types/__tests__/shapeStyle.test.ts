import { describe, it, expect } from 'vitest'
import type { ElementInstance, ShapeDefinition } from '@/types'

describe('shapeStyle.shadow 字段', () => {
  it('ElementInstance.shapeStyle 可携带 shadow 全部字段', () => {
    // 编译期断言：赋值时 TypeScript 会检查类型兼容性
    const shapeStyle: ElementInstance['shapeStyle'] = {
      alpha: 1,
      shadowEnabled: true,
      shadowColor: '0,0,0',
      shadowBlur: 4,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
    }
    expect(shapeStyle.alpha).toBe(1)
    expect(shapeStyle.shadowEnabled).toBe(true)
    expect(shapeStyle.shadowColor).toBe('0,0,0')
    expect(shapeStyle.shadowBlur).toBe(4)
    expect(shapeStyle.shadowOffsetX).toBe(2)
    expect(shapeStyle.shadowOffsetY).toBe(2)
  })

  it('ElementInstance.shapeStyle shadow 字段全部可选', () => {
    // 只有 alpha 也能通过编译
    const shapeStyle: ElementInstance['shapeStyle'] = {
      alpha: 0.5,
    }
    expect(shapeStyle.alpha).toBe(0.5)
    expect(shapeStyle.shadowEnabled).toBeUndefined()
  })

  it('ShapeDefinition.shapeStyle 同样支持 shadow 字段', () => {
    const shapeStyle: NonNullable<ShapeDefinition['shapeStyle']> = {
      alpha: 1,
      shadowEnabled: false,
      shadowColor: '128,128,128',
      shadowBlur: 8,
      shadowOffsetX: 4,
      shadowOffsetY: 4,
    }
    expect(shapeStyle.shadowEnabled).toBe(false)
    expect(shapeStyle.shadowBlur).toBe(8)
  })
})
