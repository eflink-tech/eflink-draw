// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore, historyManager } from '../editorStore'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import { STORAGE_KEY } from '@/core/editor/persistence'

beforeEach(() => {
  localStorage.clear()
})

describe('newDocument', () => {
  it('清空文档、复位选区、清空历史、落盘', () => {
    const rect = shapeRegistry.createElement('rectangle', 0, 0)!
    rect.id = 'r1'
    useEditorStore.setState({
      document: { page: useEditorStore.getState().document.page, elements: { r1: rect } },
      selectedIds: new Set(['r1']),
      isDirty: true,
    })
    useEditorStore.getState().moveElements(['r1'], 5, 5)
    expect(historyManager.canUndo()).toBe(true)

    useEditorStore.getState().newDocument()

    expect(Object.keys(useEditorStore.getState().document.elements)).toHaveLength(0)
    expect(useEditorStore.getState().selectedIds.size).toBe(0)
    expect(useEditorStore.getState().isDirty).toBe(false)
    expect(historyManager.canUndo()).toBe(false)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect((stored as { doc: unknown }).doc).toEqual(useEditorStore.getState().document)
  })
})
