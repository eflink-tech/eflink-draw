import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore } from '../editorStore'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes' // 触发图形注册副作用
import type { ElementInstance } from '@/types'

/** 构造一个带指定 zindex 的矩形元素 */
function makeEl(id: string, zindex: number): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', 0, 0)!
  el.id = id
  el.props.zindex = zindex
  return el
}

/** 读取选中元素的 zindex */
function z(id: string): number {
  const el = useEditorStore.getState().document.elements[id]
  return (el as ElementInstance).props.zindex
}

function setDoc(els: ElementInstance[], selected: string[]): void {
  const elements: Record<string, ElementInstance> = {}
  for (const e of els) elements[e.id] = e
  useEditorStore.setState({
    document: {
      page: useEditorStore.getState().document.page,
      elements,
    },
    selectedIds: new Set(selected),
    isDirty: false,
  })
}

describe('layerShapes 单步移动', () => {
  beforeEach(() => {
    // 无需重置历史；setDoc 直接覆盖文档状态
  })

  it('forward：中间元素仅上移一层（不跳到顶）', () => {
    // z 序：A(0) < B(1) < C(2) < D(3) < E(4)
    setDoc(
      [makeEl('A', 0), makeEl('B', 1), makeEl('C', 2), makeEl('D', 3), makeEl('E', 4)],
      ['C'],
    )
    useEditorStore.getState().layerShapes(['C'], 'forward')
    // C 应越过 D，但仍在 E 之下
    expect(z('C')).toBeGreaterThan(z('D'))
    expect(z('C')).toBeLessThan(z('E'))
    // 其余相对顺序不变
    expect(z('A')).toBeLessThan(z('B'))
    expect(z('B')).toBeLessThan(z('D'))
    expect(z('D')).toBeLessThan(z('C'))
  })

  it('backward：中间元素仅下移一层（不跳到底）', () => {
    setDoc(
      [makeEl('A', 0), makeEl('B', 1), makeEl('C', 2), makeEl('D', 3), makeEl('E', 4)],
      ['C'],
    )
    useEditorStore.getState().layerShapes(['C'], 'backward')
    expect(z('C')).toBeLessThan(z('B'))
    expect(z('C')).toBeGreaterThan(z('A'))
  })

  it('forward：已在顶层时不变', () => {
    setDoc(
      [makeEl('A', 0), makeEl('B', 1), makeEl('C', 2)],
      ['C'],
    )
    const before = z('C')
    useEditorStore.getState().layerShapes(['C'], 'forward')
    expect(z('C')).toBe(before)
  })

  it('forward：多选块整体上移一层，组内顺序保持', () => {
    // A < B < C(sel) < D(sel) < E
    setDoc(
      [makeEl('A', 0), makeEl('B', 1), makeEl('C', 2), makeEl('D', 3), makeEl('E', 4)],
      ['C', 'D'],
    )
    useEditorStore.getState().layerShapes(['C', 'D'], 'forward')
    // C、D 整体越过 E
    expect(z('D')).toBeGreaterThan(z('E'))
    expect(z('C')).toBeLessThan(z('D'))
    expect(z('C')).toBeGreaterThan(z('B'))
  })

  it('forward：新建图形 zindex 全同（0）仍按叠放序上移一层', () => {
    setDoc([makeEl('A', 0), makeEl('B', 0), makeEl('C', 0)], ['A'])
    useEditorStore.getState().layerShapes(['A'], 'forward')
    // A 越过 B，仍在 C 之下
    expect(z('A')).toBeGreaterThan(z('B'))
    expect(z('A')).toBeLessThan(z('C'))
  })

  it('backward：新建图形 zindex 全同（0）仍按叠放序下移一层', () => {
    setDoc([makeEl('A', 0), makeEl('B', 0), makeEl('C', 0)], ['C'])
    useEditorStore.getState().layerShapes(['C'], 'backward')
    expect(z('C')).toBeLessThan(z('B'))
    expect(z('C')).toBeGreaterThan(z('A'))
  })

  it('front：置顶（maxZ+1）', () => {
    setDoc(
      [makeEl('A', 0), makeEl('B', 1), makeEl('C', 2)],
      ['A'],
    )
    useEditorStore.getState().layerShapes(['A'], 'front')
    expect(z('A')).toBeGreaterThan(z('C'))
  })

  it('back：置底（minZ-1）', () => {
    setDoc(
      [makeEl('A', 0), makeEl('B', 1), makeEl('C', 2)],
      ['C'],
    )
    useEditorStore.getState().layerShapes(['C'], 'back')
    expect(z('C')).toBeLessThan(z('A'))
  })

  it('forward：相邻 zindex 重复时仍能上移', () => {
    setDoc(
      [makeEl('A', 0), makeEl('B', 1), makeEl('C', 1), makeEl('D', 2)],
      ['B'],
    )
    useEditorStore.getState().layerShapes(['B'], 'forward')
    expect(z('B')).toBeGreaterThan(z('C'))
    expect(z('B')).toBeLessThan(z('D'))
  })

  it('forward：zindex 大间隔时仍能上移一层', () => {
    setDoc(
      [makeEl('A', 0), makeEl('B', 100), makeEl('C', 200)],
      ['B'],
    )
    useEditorStore.getState().layerShapes(['B'], 'forward')
    expect(z('B')).toBeGreaterThan(z('C'))
    expect(z('C')).toBeLessThan(z('B'))
  })

  it('forward：全部 zindex 为 0 连续上移均生效', () => {
    setDoc([makeEl('A', 0), makeEl('B', 0), makeEl('C', 0)], ['A'])
    useEditorStore.getState().layerShapes(['A'], 'forward')
    expect(z('A')).toBeGreaterThan(z('B'))
    useEditorStore.getState().layerShapes(['A'], 'forward')
    expect(z('A')).toBeGreaterThan(z('C'))
  })
})
