import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore } from '@/store/editorStore'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import type { ElementInstance } from '@/types'
import { applyLayerAction, handleLayerKeydown, resolveLayerShortcut } from '../layerAction'

function withStack(n: number): string[] {
  const els = Array.from({ length: n }, () => shapeRegistry.createElement('rectangle', 0, 0)!)
  els.forEach((el, i) => {
    el.props.zindex = i
  })
  useEditorStore.getState().setDocument({
    page: useEditorStore.getState().document.page,
    elements: Object.fromEntries(els.map((el) => [el.id, el])),
  })
  return els.map((el) => el.id)
}

function z(id: string): number {
  return (useEditorStore.getState().document.elements[id] as ElementInstance).props.zindex
}

function keyEvent(init: Partial<KeyboardEvent> & { code: string }): KeyboardEvent {
  return {
    key: '',
    shiftKey: false,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    getModifierState: () => false,
    preventDefault: () => {},
    ...init,
  } as KeyboardEvent
}

describe('resolveLayerShortcut', () => {
  it('⌥] → forward', () => {
    expect(
      resolveLayerShortcut(keyEvent({ code: 'BracketRight', key: ']', altKey: true })),
    ).toBe('forward')
  })

  it('⌥[ → backward', () => {
    expect(
      resolveLayerShortcut(keyEvent({ code: 'BracketLeft', key: '[', altKey: true })),
    ).toBe('backward')
  })

  it('⌘] → front', () => {
    expect(
      resolveLayerShortcut(keyEvent({ code: 'BracketRight', key: ']', metaKey: true })),
    ).toBe('front')
  })
})

describe('applyLayerAction', () => {
  beforeEach(() => {
    useEditorStore.getState().newDocument()
  })

  it('中间层 forward 仅上移一层（与右键一致）', () => {
    const ids = withStack(5)
    useEditorStore.getState().selectIds([ids[2]!], 'replace')
    applyLayerAction('forward')
    expect(z(ids[2]!)).toBeGreaterThan(z(ids[3]!))
    expect(z(ids[2]!)).toBeLessThan(z(ids[4]!))
  })

  it('中间层 front 直接置顶', () => {
    const ids = withStack(5)
    useEditorStore.getState().selectIds([ids[2]!], 'replace')
    applyLayerAction('front')
    expect(z(ids[2]!)).toBeGreaterThan(z(ids[4]!))
  })

  it('最顶层 forward 无变化', () => {
    const ids = withStack(3)
    useEditorStore.getState().selectIds([ids[2]!], 'replace')
    const before = z(ids[2]!)
    applyLayerAction('forward')
    expect(z(ids[2]!)).toBe(before)
  })
})

describe('handleLayerKeydown', () => {
  beforeEach(() => {
    useEditorStore.getState().newDocument()
  })

  it('⌥] 触发 forward 而非 front', () => {
    const ids = withStack(5)
    useEditorStore.getState().selectIds([ids[2]!], 'replace')
    handleLayerKeydown(keyEvent({ code: 'BracketRight', key: ']', altKey: true }))
    expect(z(ids[2]!)).toBeGreaterThan(z(ids[3]!))
    expect(z(ids[2]!)).toBeLessThan(z(ids[4]!))
  })

  it('⌥] 后紧跟的 ⌘] 幽灵事件被吞掉', () => {
    const ids = withStack(5)
    useEditorStore.getState().selectIds([ids[2]!], 'replace')
    handleLayerKeydown(keyEvent({ code: 'BracketRight', key: ']', altKey: true }))
    const afterStep = z(ids[2]!)
    handleLayerKeydown(keyEvent({ code: 'BracketRight', key: ']', metaKey: true }))
    expect(z(ids[2]!)).toBe(afterStep)
    expect(z(ids[2]!)).toBeLessThan(z(ids[4]!))
  })
})
