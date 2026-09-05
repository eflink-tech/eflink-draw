// 左侧面板拖拽创建：坐标换算纯函数测试
import { describe, it, expect } from 'vitest'
import { resolveDragPosition } from '../panelDrag'

const RECT = { left: 200, top: 100, width: 800, height: 600 }
const VIEWPORT = { x: -50, y: -30, scale: 2 }

describe('resolveDragPosition', () => {
  it('鼠标在画布内：返回世界坐标（容器像素 → 平移/缩放逆变换）', () => {
    // 容器局部 (400, 300) → 世界 ((400-(-50))/2, (300-(-30))/2) = (225, 165)
    const r = resolveDragPosition(600, 400, RECT, VIEWPORT)
    expect(r.inside).toBe(true)
    expect(r.world).toEqual({ x: 225, y: 165 })
  })

  it('鼠标在画布外（右侧超出）：inside = false', () => {
    const r = resolveDragPosition(1100, 400, RECT, VIEWPORT)
    expect(r.inside).toBe(false)
  })

  it('鼠标在画布外（上方超出）：inside = false', () => {
    const r = resolveDragPosition(600, 50, RECT, VIEWPORT)
    expect(r.inside).toBe(false)
  })

  it('边界坐标算作画布内（含等号）', () => {
    expect(resolveDragPosition(200, 100, RECT, VIEWPORT).inside).toBe(true)
    expect(resolveDragPosition(1000, 700, RECT, VIEWPORT).inside).toBe(true)
  })
})
