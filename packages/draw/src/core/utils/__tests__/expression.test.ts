import { describe, it, expect } from 'vitest'
import { evaluateExpression } from '../expression'

describe('evaluateExpression', () => {
  const ctx = { w: 100, h: 60 }

  it('数字直接返回', () => {
    expect(evaluateExpression(42, ctx)).toBe(42)
    expect(evaluateExpression(0, ctx)).toBe(0)
  })

  it('简单变量', () => {
    expect(evaluateExpression('w', ctx)).toBe(100)
    expect(evaluateExpression('h', ctx)).toBe(60)
  })

  it('算术运算', () => {
    expect(evaluateExpression('w/2', ctx)).toBe(50)
    expect(evaluateExpression('h*0.5', ctx)).toBe(30)
    expect(evaluateExpression('w-20', ctx)).toBe(80)
    expect(evaluateExpression('w+10', ctx)).toBe(110)
  })

  it('复杂表达式', () => {
    expect(evaluateExpression('w/2-10', ctx)).toBe(40)
    expect(evaluateExpression('h*2+w', ctx)).toBe(220)
  })

  it('同一表达式用不同上下文重复求值结果不同（编译缓存不串值）', () => {
    expect(evaluateExpression('w/2', { w: 100, h: 60 })).toBe(50)
    expect(evaluateExpression('w/2', { w: 40, h: 20 })).toBe(20)
    expect(evaluateExpression('Math.min(w,h)', { w: 100, h: 60 })).toBe(60)
    expect(evaluateExpression('Math.min(w,h)', { w: 30, h: 60 })).toBe(30)
  })

  it('非法表达式返回 0 且不影响后续求值', () => {
    expect(evaluateExpression('w+', ctx)).toBe(0)
    expect(evaluateExpression('w/2', ctx)).toBe(50)
  })

  it('空串返回 0', () => {
    expect(evaluateExpression('', ctx)).toBe(0)
    expect(evaluateExpression('  ', ctx)).toBe(0)
  })

  it('探针点 (1,1) 处发散的表达式不被误判非法（尺寸相关合法表达式）', () => {
    // w/(w-h) 在 (1,1) 除零 → NaN，但在 w≠h 的真实尺寸下合法
    expect(evaluateExpression('w/(w-h)', { w: 100, h: 60 })).toBeCloseTo(2.5)
    // Math.sqrt(w-1) 在 w=1 处为 0，但负数尺寸探针（如 w=1 的 sqrt(h-2)）也不应封死
    expect(evaluateExpression('Math.sqrt(w-1)', { w: 101, h: 60 })).toBeCloseTo(10)
    // 真正的语法错误仍然返回 0
    expect(evaluateExpression('w/(w-', { w: 100, h: 60 })).toBe(0)
  })
})
