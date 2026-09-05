import { describe, it, expect } from 'vitest'
import { alignShapes, distributeShapes, matchSize, applyShapeTransform } from '../alignmentOps'
import type { ElementInstance, LinkerInstance } from '@/types'
import { createLinkerInstance } from '@/core/editor/linker'

function el(id: string, x: number, y: number, w = 120, h = 60): ElementInstance {
  return {
    id, name: 'rectangle', title: '', category: 'basic', group: 'g', groupName: null,
    locked: false, link: '', children: [], parent: '',
    resizeDir: ['br'], attribute: {}, dataAttributes: [],
    props: { x, y, w, h, zindex: 0, angle: 0 }, shapeStyle: { alpha: 1 },
    lineStyle: {}, fillStyle: { type: 'solid', color: '255,255,255' },
    path: [], fontStyle: {}, textBlock: [], anchors: [],
  }
}

const rect = (e: ElementInstance) => ({ x: e.props.x, y: e.props.y, w: e.props.w, h: e.props.h })

describe('alignShapes', () => {
  it('left：统一到最小 x，y 不变', () => {
    const out = alignShapes([el('A', 100, 100), el('B', 300, 200)], 'left')
    expect(rect(out[0]!)).toEqual({ x: 100, y: 100, w: 120, h: 60 })
    expect(rect(out[1]!)).toEqual({ x: 100, y: 200, w: 120, h: 60 })
  })

  it('center：整体包围盒水平居中', () => {
    const out = alignShapes([el('A', 100, 100), el('B', 300, 200)], 'center')
    expect(out[0]!.props.x).toBe(200)
    expect(out[1]!.props.x).toBe(200)
  })

  it('底部对齐到底边', () => {
    const out = alignShapes([el('A', 100, 100), el('B', 300, 240)], 'bottom')
    expect(out[0]!.props.y).toBe(240)
    expect(out[1]!.props.y).toBe(240)
  })

  it('少于 2 个元素时原样返回', () => {
    const one = [el('A', 100, 100)]
    expect(alignShapes(one, 'left')).toBe(one)
  })
})

describe('distributeShapes', () => {
  it('horizontal：首尾保持，中间按中心等距', () => {
    const out = distributeShapes([el('A', 100, 0, 200, 50), el('B', 350, 0, 100, 50), el('C', 600, 0, 50, 50)], 'horizontal')
    expect(out[0]!.props.x).toBe(100)
    expect(out[1]!.props.x).toBe(362.5)
    expect(out[2]!.props.x).toBe(600)
  })

  it('少于 3 个元素时原样返回', () => {
    const two = [el('A', 100, 0), el('B', 300, 0)]
    expect(distributeShapes(two, 'horizontal')).toBe(two)
  })
})

describe('matchSize', () => {
  it('以首个为基准同步宽高', () => {
    const out = matchSize([el('A', 0, 0, 200, 100), el('B', 0, 0, 120, 60)], { w: true, h: true })
    expect(out[0]!.props.w).toBe(200)
    expect(out[0]!.props.h).toBe(100)
    expect(out[1]!.props.w).toBe(200)
    expect(out[1]!.props.h).toBe(100)
  })

  it('只同步宽度时高度不变', () => {
    const out = matchSize([el('A', 0, 0, 200, 100), el('B', 0, 0, 120, 60)], { w: true })
    expect(out[1]!.props.w).toBe(200)
    expect(out[1]!.props.h).toBe(60)
  })
})

describe('applyShapeTransform', () => {
  const mkRect = (id: string, x: number, y: number, w = 120, h = 60): ElementInstance =>
    ({ ...el(id, x, y, w, h) })

  const elementsMap = (els: (ElementInstance | LinkerInstance)[]): Record<string, ElementInstance | LinkerInstance> => {
    const r: Record<string, ElementInstance | LinkerInstance> = {}
    for (const e of els) r[e.id] = e
    return r
  }

  it('锁定元素不参与变换', () => {
    const elements = elementsMap([mkRect('A', 100, 100), { ...mkRect('B', 300, 200), locked: true }])
    const result = applyShapeTransform(elements, ['A', 'B'], (els) => els.map((e) => ({ ...e, props: { ...e.props, x: 0 } })))
    expect((result.elements['A'] as ElementInstance).props.x).toBe(0)
    expect((result.elements['B'] as ElementInstance).props.x).toBe(300) // 锁定，未动
    expect(result.changedIds).toEqual(['A'])
  })

  it('变换联动附着连线', () => {
    const a = mkRect('A', 100, 100)
    const b = mkRect('B', 400, 150)
    const linker = createLinkerInstance(
      { id: 'A', x: 220, y: 130, angle: Math.PI },
      { id: 'B', x: 400, y: 180, angle: 0 },
      1,
    )
    const elements = elementsMap([a, b, linker])
    const result = applyShapeTransform(
      elements,
      ['A', 'B'],
      (els) => els.map((e) => ({ ...e, props: { ...e.props, x: 0 } })),
    )
    // 两个图形都参与了变换，且连线应被路由
    expect(result.changedIds).toContain('A')
    expect(result.changedIds).toContain('B')
    expect(result.changedIds).toContain(linker.id)
    // 连线 to.x 应跟随 B 的左移（B.x=400 → 0；原 endpoint x=400，相对 rx=0；新 x=0）
    expect((result.elements[linker.id] as LinkerInstance).to.x).toBe(0)
  })

  it('无变化时返回原始表且 changedIds 为空', () => {
    const elements = elementsMap([mkRect('A', 100, 100)])
    const result = applyShapeTransform(elements, ['A'], (els) => els) // 恒等变换
    expect(result.elements).toBe(elements)
    expect(result.changedIds).toEqual([])
  })
})
