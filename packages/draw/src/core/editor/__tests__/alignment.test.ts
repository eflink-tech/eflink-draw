// 对齐吸附检测测试
import { describe, it, expect } from 'vitest'
import { snapLine, snapLinkerLine, type Rect } from '../alignment'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import type { ElementInstance } from '@/types'

// 固定 120×60：测试吸附数学本身，与 schema 默认尺寸解耦
function rect(x: number, y: number): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', x, y)
  if (!el) throw new Error('rectangle schema missing')
  return { ...el, props: { ...el.props, w: 120, h: 60 } }
}

describe('snapLine', () => {
  it('中线对中线吸附并修正 y', () => {
    const other = rect(300, 100) // h=60，中线 130
    const t: Rect = { x: 50, y: 129, w: 100, h: 60 } // 中线 159 → 距 130 差 29？不对
    // 重新计算：中线 = 129+30 = 159。构造真正接近的情况：
    const t2: Rect = { x: 50, y: 100.5, w: 100, h: 60 } // 中线 130.5，距 130 为 0.5
    const res = snapLine(t2, ['t'], [other])
    expect(res.h).toEqual({ type: 'middle', y: 130 })
    expect(t2.y).toBe(100)
    expect(res.v).toBeNull()
    // 未使用的 t 仅避免 lint
    void t
  })

  it('顶边对顶边吸附', () => {
    const other = rect(300, 200)
    // 高度取 20 使中线（211）远离对方中线（230），只触发顶边对顶边
    const t: Rect = { x: 50, y: 201, w: 100, h: 20 }
    const res = snapLine(t, ['t'], [other])
    expect(res.h).toEqual({ type: 'top', y: 200 })
    expect(t.y).toBe(200)
  })

  it('对方底边对我的顶边（交叉吸附）', () => {
    const other = rect(300, 140) // 底边 200
    const t: Rect = { x: 50, y: 199, w: 100, h: 60 } // 顶边 199，距 200 为 1
    const res = snapLine(t, ['t'], [other])
    expect(res.h).toEqual({ type: 'top', y: 200 })
    expect(t.y).toBe(200)
  })

  it('垂直方向左边对左边吸附', () => {
    const other = rect(400, 100)
    const t: Rect = { x: 401, y: 50, w: 100, h: 60 }
    const res = snapLine(t, ['t'], [other])
    expect(res.v).toEqual({ type: 'left', x: 400 })
    expect(t.x).toBe(400)
  })

  it('超出 2px 阈值不吸附', () => {
    const other = rect(300, 100)
    const t: Rect = { x: 50, y: 103.5, w: 100, h: 60 } // 中线 133.5，距 130 为 3.5
    const res = snapLine(t, ['t'], [other])
    expect(res.h).toBeNull()
    expect(t.y).toBe(103.5)
  })

  it('排除的元素不参与吸附', () => {
    const other = rect(300, 100)
    const t: Rect = { x: 50, y: 100.5, w: 100, h: 60 }
    const res = snapLine(t, [other.id], [other])
    expect(res.h).toBeNull()
  })
})

describe('snapLinkerLine', () => {
  it('自由端靠近图形边时吸附', () => {
    const other = rect(300, 100) // 左边 300，顶边 100
    expect(snapLinkerLine(301, 300, [other])).toEqual({ v: 300, h: null })
    expect(snapLinkerLine(500, 99, [other])).toEqual({ v: null, h: 100 })
  })

  it('距离过远不吸附', () => {
    const other = rect(300, 100)
    expect(snapLinkerLine(310, 300, [other])).toEqual({ v: null, h: null })
  })

  it('linkable === false 的图形不参与边吸附', () => {
    const other = rect(300, 100)
    other.attribute.linkable = false
    // 301 距左边 300 仅 1px，本应吸附；但 linkable:false 应跳过
    expect(snapLinkerLine(301, 300, [other])).toEqual({ v: null, h: null })
    expect(snapLinkerLine(500, 99, [other])).toEqual({ v: null, h: null })
  })
})
