// src/ai/__tests__/autoLayout.test.ts
// 分层布局纯函数测试：直链、分叉、回环、多根、fixed 对齐、分量、病态输入、确定性。
import { describe, it, expect } from 'vitest'
import {
  computeLayeredLayout,
  LAYOUT_DEFAULTS,
  segIntersectsRect,
  findCrossedRects,
  type LayoutNode,
  type LayoutEdge,
} from '../autoLayout'

/** 快捷构造：默认 100x60，坐标可指定 */
function node(id: string, x: number, y: number, order: number, w = 100, h = 60): LayoutNode {
  return { id, x, y, w, h, order }
}
function edge(from: string, to: string): LayoutEdge {
  return { from, to }
}

const center = (p: { x: number; y: number }, n: LayoutNode) => p.x + n.w / 2

describe('直链（AI 挤成一列的典型场景）', () => {
  // A、B、C 原始 x 微抖动堆在一列（复现截图病根）
  const nodes = [node('A', 100, 0, 0), node('B', 105, 150, 1), node('C', 100, 300, 2)]
  const edges = [edge('A', 'B'), edge('B', 'C')]

  it('输出中心对齐同一列', () => {
    const { positions } = computeLayeredLayout({ movable: nodes, edges, fixed: [] })
    const a = positions.get('A')!
    const b = positions.get('B')!
    const c = positions.get('C')!
    expect(center(a, nodes[0])).toBeCloseTo(center(b, nodes[1]))
    expect(center(b, nodes[1])).toBeCloseTo(center(c, nodes[2]))
  })

  it('y 严格递增且层间空隙 = vGap', () => {
    const { positions } = computeLayeredLayout({ movable: nodes, edges, fixed: [] })
    const a = positions.get('A')!
    const b = positions.get('B')!
    const c = positions.get('C')!
    expect(b.y).toBeGreaterThan(a.y)
    expect(c.y).toBeGreaterThan(b.y)
    // 空隙（边到边）= vGap：B.y - (A.y + A.h) = 80
    expect(b.y - (a.y + 60)).toBeCloseTo(LAYOUT_DEFAULTS.vGap)
    expect(c.y - (b.y + 60)).toBeCloseTo(LAYOUT_DEFAULTS.vGap)
  })

  it('布局不跳走：首元素保持原始 x（origin 锚定）', () => {
    const { positions } = computeLayeredLayout({ movable: nodes, edges, fixed: [] })
    expect(positions.get('A')!.x).toBeCloseTo(100)
    expect(positions.get('A')!.y).toBeCloseTo(0)
  })
})

describe('判定分叉（回归核心：必须横向展开）', () => {
  // AI 把分支 B、C 也堆在 A 正下方 —— 布局后必须同层左右展开
  const A = node('A', 200, 0, 0)
  const B = node('B', 200, 150, 1)
  const C = node('C', 200, 150, 2)
  const D = node('D', 200, 300, 3)
  const nodes = [A, B, C, D]
  const edges = [edge('A', 'B'), edge('A', 'C'), edge('B', 'D'), edge('C', 'D')]

  it('B/C 同层、水平展开、间隙 = hGap', () => {
    const { positions } = computeLayeredLayout({ movable: nodes, edges, fixed: [] })
    const b = positions.get('B')!
    const c = positions.get('C')!
    expect(b.y).toBeCloseTo(c.y)
    const [left, right] = b.x < c.x ? [b, c] : [c, b]
    const leftN = left === b ? B : C
    expect(right.x - (left.x + leftN.w)).toBeCloseTo(LAYOUT_DEFAULTS.hGap)
  })

  it('分支层中心 ≈ A 中心（分叉挂在判定正下方展开）', () => {
    const { positions } = computeLayeredLayout({ movable: nodes, edges, fixed: [] })
    const a = positions.get('A')!
    const b = positions.get('B')!
    const c = positions.get('C')!
    const layerCenter = (center(b, B) + center(c, C)) / 2
    expect(layerCenter).toBeCloseTo(center(a, A))
  })

  it('汇合节点 D 回到 A 的中轴', () => {
    const { positions } = computeLayeredLayout({ movable: nodes, edges, fixed: [] })
    const a = positions.get('A')!
    const d = positions.get('D')!
    expect(center(d, D)).toBeCloseTo(center(a, A))
  })
})

describe('回环边', () => {
  it('C→A 回边被剔除且不抛错，链仍 3 层', () => {
    const nodes = [node('A', 0, 0, 0), node('B', 0, 150, 1), node('C', 0, 300, 2)]
    const edges = [edge('A', 'B'), edge('B', 'C'), edge('C', 'A')]
    const { positions, meta } = computeLayeredLayout({ movable: nodes, edges, fixed: [] })
    expect(meta.backEdges).toEqual([['C', 'A']])
    expect(positions.size).toBe(3)
    // 分层仍是 A<B<C（回边不参与）
    expect(positions.get('A')!.y).toBeLessThan(positions.get('B')!.y)
    expect(positions.get('B')!.y).toBeLessThan(positions.get('C')!.y)
    expect(meta.layers).toBe(3)
  })
})

describe('多根并列', () => {
  it('两个起点汇入同一节点：同层并列且左右次序 = 原始 x 次序', () => {
    const r1 = node('R1', 50, 0, 0)
    const r2 = node('R2', 200, 0, 1)
    const m = node('M', 100, 150, 2)
    const nodes = [r1, r2, m]
    const edges = [edge('R1', 'M'), edge('R2', 'M')]
    const { positions } = computeLayeredLayout({ movable: nodes, edges, fixed: [] })
    const p1 = positions.get('R1')!
    const p2 = positions.get('R2')!
    const pm = positions.get('M')!
    expect(p1.y).toBeCloseTo(p2.y) // 同层
    expect(p1.x).toBeLessThan(p2.x) // 保序
    expect(p2.x).toBeGreaterThanOrEqual(p1.x + 100 + LAYOUT_DEFAULTS.hGap - 0.001) // 不重叠
    // M 居中于两父之间
    expect(center(pm, m)).toBeCloseTo((center(p1, r1) + center(p2, r2)) / 2)
  })
})

describe('fixed（画布既有元素）', () => {
  it('fixed→新链：新链首节点对齐到 fixed 正下方', () => {
    const fx = node('fx', 500, 500, -1) // 既有元素在远处
    const n1 = node('n1', 0, 0, 0)
    const n2 = node('n2', 0, 150, 1)
    const { positions } = computeLayeredLayout({
      movable: [n1, n2],
      edges: [edge('fx', 'n1'), edge('n1', 'n2')],
      fixed: [fx],
    })
    expect(center(positions.get('n1')!, n1)).toBeCloseTo(550) // fx 中心
    expect(center(positions.get('n2')!, n2)).toBeCloseTo(550)
  })

  it('positions 绝不含 fixed；输入不可变', () => {
    const fx = node('fx', 500, 500, -1)
    const n1 = node('n1', 0, 0, 0)
    const fxSnapshot = JSON.stringify(fx)
    const { positions } = computeLayeredLayout({
      movable: [n1],
      edges: [edge('fx', 'n1')],
      fixed: [fx],
    })
    expect(positions.has('fx')).toBe(false)
    expect(JSON.stringify(fx)).toBe(fxSnapshot)
  })
})

describe('不连通分量', () => {
  it('两个独立子图横排、互不重叠、各锚自己的 origin', () => {
    const left = [node('L1', 0, 0, 0), node('L2', 0, 150, 1)]
    const right = [node('R1', 400, 0, 2), node('R2', 400, 150, 3)]
    const nodes = [...left, ...right]
    const edges = [edge('L1', 'L2'), edge('R1', 'R2')]
    const { positions, meta } = computeLayeredLayout({ movable: nodes, edges, fixed: [] })
    expect(meta.components).toBe(2)
    // 各分量首节点 x 保持自己的 origin（无挤压）
    expect(positions.get('L1')!.x).toBeCloseTo(0)
    expect(positions.get('R1')!.x).toBeCloseTo(400)
    // 不重叠：左列右缘 ≤ 右列左缘
    expect(positions.get('L1')!.x + 100).toBeLessThanOrEqual(positions.get('R1')!.x + 0.001)
  })

  it('重叠的分量被"只推不拉"挤开（间距 ≥ componentGap）', () => {
    // 两个分量原始位置完全重叠
    const a = [node('A1', 100, 0, 0), node('A2', 100, 150, 1)]
    const b = [node('B1', 100, 400, 2), node('B2', 100, 550, 3)]
    const { positions } = computeLayeredLayout({
      movable: [...a, ...b],
      edges: [edge('A1', 'A2'), edge('B1', 'B2')],
      fixed: [],
    })
    const gap = positions.get('B1')!.x - (positions.get('A1')!.x + 100)
    expect(gap).toBeGreaterThanOrEqual(LAYOUT_DEFAULTS.componentGap - 0.001)
  })
})

describe('病态输入', () => {
  it('自环 / 重复边 / w=0 / 单节点 / 悬空引用 均合法', () => {
    const nodes = [node('A', 0, 0, 0, 0, 0), node('B', 50, 50, 1)]
    const edges = [
      edge('A', 'A'), // 自环
      edge('A', 'B'),
      edge('A', 'B'), // 重复边
      edge('A', 'ghost'), // 悬空
    ]
    const { positions, meta } = computeLayeredLayout({ movable: nodes, edges, fixed: [] })
    expect(positions.size).toBe(2)
    for (const p of positions.values()) {
      expect(Number.isFinite(p.x)).toBe(true)
      expect(Number.isFinite(p.y)).toBe(true)
    }
    expect(meta.backEdges).toEqual([]) // 自环被丢弃而非回边
  })

  it('空输入返回空结果', () => {
    const { positions, meta } = computeLayeredLayout({ movable: [], edges: [], fixed: [] })
    expect(positions.size).toBe(0)
    expect(meta.components).toBe(0)
  })

  it('全环输入（无入度0节点）也能布局', () => {
    const nodes = [node('A', 0, 0, 0), node('B', 0, 150, 1), node('C', 0, 300, 2)]
    const edges = [edge('A', 'B'), edge('B', 'C'), edge('C', 'A'), edge('C', 'B')]
    const { positions } = computeLayeredLayout({ movable: nodes, edges, fixed: [] })
    expect(positions.size).toBe(3)
    // 剔一条回边后仍为合法链：y 互不相等
    const ys = [positions.get('A')!.y, positions.get('B')!.y, positions.get('C')!.y]
    expect(new Set(ys).size).toBe(3)
  })
})

describe('确定性与孤立节点', () => {
  it('同输入两次调用输出逐位相等', () => {
    const nodes = [
      node('A', 200, 0, 0),
      node('B', 200, 150, 1),
      node('C', 200, 150, 2),
      node('D', 200, 300, 3),
    ]
    const edges = [edge('A', 'B'), edge('A', 'C'), edge('B', 'D'), edge('C', 'D')]
    const r1 = computeLayeredLayout({ movable: nodes, edges, fixed: [] })
    const r2 = computeLayeredLayout({ movable: nodes, edges, fixed: [] })
    expect([...r1.positions.entries()]).toEqual([...r2.positions.entries()])
    expect(r1.meta).toEqual(r2.meta)
  })

  it('孤立 movable 节点（无批内边）留在自己原位附近', () => {
    const lone = node('X', 800, 800, 0)
    const { positions } = computeLayeredLayout({ movable: [lone], edges: [], fixed: [] })
    expect(positions.get('X')).toEqual({ x: 800, y: 800 })
  })
})

// ═══════════════════════════════════════════
// 穿越检测（Liang-Barsky 线段裁剪 + 折线扫描）
// ═══════════════════════════════════════════
describe('segIntersectsRect / findCrossedRects', () => {
  const R = { x: 100, y: 100, w: 100, h: 60 } // x:100..200, y:100..160

  it('段在矩形外不相交', () => {
    expect(segIntersectsRect({ x: 0, y: 0 }, { x: 50, y: 50 }, R)).toBe(false)
    expect(segIntersectsRect({ x: 300, y: 0 }, { x: 300, y: 300 }, R)).toBe(false)
  })

  it('段横穿矩形中部', () => {
    expect(segIntersectsRect({ x: 0, y: 130 }, { x: 300, y: 130 }, R)).toBe(true)
  })

  it('段斜穿矩形一角', () => {
    expect(segIntersectsRect({ x: 80, y: 80 }, { x: 220, y: 180 }, R)).toBe(true)
  })

  it('端点落在矩形内必相交', () => {
    expect(segIntersectsRect({ x: 150, y: 130 }, { x: 300, y: 300 }, R)).toBe(true)
  })

  it('段贴边不误报（inset=2 内收），inset=0 时判相交', () => {
    const edge = [{ x: 0, y: 100 }, { x: 300, y: 100 }] // 沿顶边 y=100
    expect(segIntersectsRect(edge[0], edge[1], R, 2)).toBe(false)
    expect(segIntersectsRect(edge[0], edge[1], R, 0)).toBe(true)
  })

  it('findCrossedRects 排除端点图形、命中多个按插入序', () => {
    const rects = new Map<string, { x: number; y: number; w: number; h: number }>([
      ['self', R],
      ['mid', { x: 100, y: 200, w: 100, h: 60 }],
      ['mid2', { x: 100, y: 300, w: 100, h: 60 }],
      ['away', { x: 400, y: 0, w: 50, h: 50 }],
    ])
    const path = [
      { x: 150, y: 130 }, // self 中心
      { x: 150, y: 250 },
      { x: 150, y: 360 },
    ]
    const hit = findCrossedRects(path, rects, new Set(['self']))
    expect(hit).toEqual(['mid', 'mid2'])
  })

  it('findCrossedRects 空路径返回空', () => {
    expect(findCrossedRects([], new Map([['a', R]]), new Set())).toEqual([])
  })
})
