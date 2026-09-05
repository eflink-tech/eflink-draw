// @vitest-environment jsdom
// 持久化测试：save/load 往返、坏 JSON、缺字段、版本不匹配 + store saveDocument/loadDocument
import { describe, it, expect, beforeEach } from 'vitest'
import { saveDocumentToStorage, loadDocumentFromStorage, STORAGE_KEY } from '../persistence'
import { useEditorStore, historyManager } from '@/store/editorStore'
import { createEmptyDocument } from '@/types'

beforeEach(() => {
  localStorage.clear()
})

describe('saveDocumentToStorage / loadDocumentFromStorage', () => {
  it('往返：保存后读回同一文档', () => {
    const doc = createEmptyDocument('测试文档')
    const ok = saveDocumentToStorage(doc)
    expect(ok).toBe(true)
    const loaded = loadDocumentFromStorage()
    expect(loaded).not.toBeNull()
    expect(loaded!.page.title).toBe('测试文档')
    expect(Object.keys(loaded!.elements)).toEqual(Object.keys(doc.elements))
  })

  it('键缺失返回 null', () => {
    expect(loadDocumentFromStorage()).toBeNull()
  })

  it('坏 JSON 返回 null', () => {
    localStorage.setItem(STORAGE_KEY, '{not-valid-json')
    expect(loadDocumentFromStorage()).toBeNull()
  })

  it('版本不匹配返回 null', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, doc: createEmptyDocument() }))
    expect(loadDocumentFromStorage()).toBeNull()
  })

  it('doc 缺 elements 字段返回 null', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, doc: { page: {} } }))
    expect(loadDocumentFromStorage()).toBeNull()
  })

  it('doc 缺 page 字段返回 null', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, doc: { elements: {} } }))
    expect(loadDocumentFromStorage()).toBeNull()
  })

  it('存储内容非对象返回 null', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify('a-string'))
    expect(loadDocumentFromStorage()).toBeNull()
  })
})

describe('store saveDocument / loadDocument', () => {
  beforeEach(() => {
    historyManager.clear()
    useEditorStore.setState({
      document: createEmptyDocument(),
      selectedIds: new Set(),
      hoveredId: null,
      linkerDraft: null,
      textEdit: null,
      creatingShape: null,
      clipboard: null,
      currentTool: 'select',
      brushData: null,
      isDirty: false,
    })
  })

  it('saveDocument 成功后 isDirty=false 且可读回', () => {
    const doc = createEmptyDocument('待保存')
    useEditorStore.getState().setDocument(doc)
    useEditorStore.setState({ isDirty: true })
    const ok = useEditorStore.getState().saveDocument()
    expect(ok).toBe(true)
    expect(useEditorStore.getState().isDirty).toBe(false)
    expect(loadDocumentFromStorage()!.page.title).toBe('待保存')
  })

  it('loadDocument 清空历史栈并复位全部编辑态', () => {
    const st = useEditorStore.getState()
    // 制造脏状态：历史 + 选区 + 工具 + 剪贴板
    st.updatePage({ title: 'dirty' })
    st.setTool('text')
    useEditorStore.setState({ clipboard: { shapes: [], linkers: [], idMap: {} } })
    expect(historyManager.canUndo()).toBe(true)

    const fresh = createEmptyDocument('恢复')
    st.loadDocument(fresh)

    const s = useEditorStore.getState()
    expect(s.document.page.title).toBe('恢复')
    expect(historyManager.canUndo()).toBe(false)
    expect(s.selectedIds.size).toBe(0)
    expect(s.currentTool).toBe('select')
    expect(s.clipboard).toBeNull()
    expect(s.isDirty).toBe(false)
  })
})
