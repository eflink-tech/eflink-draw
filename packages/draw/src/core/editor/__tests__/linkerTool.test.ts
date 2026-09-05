// L 连线工具：起点解析测试（resolveLinkerStart 纯函数）
import { describe, it, expect } from 'vitest'
import { resolveLinkerStart } from '../linkerTool'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import type { ElementInstance } from '@/types'

function shape(x: number, y: number, w = 100, h = 60): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', x, y)
  if (!el) throw new Error('rectangle schema missing')
  el.props.w = w
  el.props.h = h
  return el
}

describe('resolveLinkerStart（L 连线工具起点）', () => {
  it('命中图形 → 吸附最近锚点', () => {
    const el = shape(100, 200, 100, 60)
    // 点击上锚点附近 (150, 200)：上锚点 (150,200)，内向角 π/2
    const r = resolveLinkerStart([el], 150, 200)
    expect(r.id).toBe(el.id)
    expect(r.x).toBe(150)
    expect(r.y).toBe(200)
    expect(r.angle).toBeCloseTo(Math.PI / 2)
  })

  it('空白区域 → 自由端点', () => {
    const el = shape(100, 200, 100, 60)
    // 远离图形包围盒（+10px 粗筛外）
    const r = resolveLinkerStart([el], 400, 400)
    expect(r.id).toBeNull()
    expect(r.x).toBe(400)
    expect(r.y).toBe(400)
    expect(r.angle).toBe(0)
  })

  it('锁定图形 → 回退为自由端点（不可连线/吸附）', () => {
    const el = shape(100, 200, 100, 60)
    el.locked = true
    // 命中锁定图形位置，也应回退自由端点
    const r = resolveLinkerStart([el], 150, 200)
    expect(r.id).toBeNull()
    expect(r.x).toBe(150)
    expect(r.y).toBe(200)
  })
})
