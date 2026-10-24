import { describe, it, expect, beforeEach } from 'vitest'
import { historyManager, useEditorStore } from '../editorStore'
import { createEmptyDocument, isLinker, type ElementInstance } from '@/types'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import { buildTemplateDocument, getTemplateById } from '@/templates'

function resetStore() {
  useEditorStore.setState({
    document: createEmptyDocument(),
    selectedIds: new Set(),
    viewport: { x: 0, y: 0, scale: 1 },
    isDirty: false,
  })
  historyManager.clear()
}

describe('newDocumentFromTemplate', () => {
  beforeEach(resetStore)

  it('载入模板文档并清空历史与脏标记', () => {
    const spec = getTemplateById('basic-flow')!
    const doc = buildTemplateDocument(spec)
    useEditorStore.getState().newDocumentFromTemplate(doc)

    const st = useEditorStore.getState()
    expect(Object.keys(st.document.elements)).toHaveLength(Object.keys(doc.elements).length)
    expect(st.document.page.width).toBe(spec.page.width)
    expect(st.document.page.title).toBe(spec.title)
    expect(st.isDirty).toBe(false)
    expect(st.canUndo()).toBe(false)
  })
})

describe('insertDocument', () => {
  beforeEach(resetStore)

  it('空画布插入沿用模板原始坐标并选中全部新元素', () => {
    const spec = getTemplateById('basic-flow')!
    const doc = buildTemplateDocument(spec)
    const aShape = Object.values(doc.elements).find(
      (el): el is ElementInstance => !isLinker(el),
    )!

    useEditorStore.getState().insertDocument(doc)

    const st = useEditorStore.getState()
    expect(Object.keys(st.document.elements)).toHaveLength(Object.keys(doc.elements).length)
    const inserted = st.document.elements[aShape.id]
    expect(inserted && !isLinker(inserted) ? inserted.props.x : null).toBe(aShape.props.x)
    expect(inserted && !isLinker(inserted) ? inserted.props.y : null).toBe(aShape.props.y)
    expect(st.selectedIds.size).toBe(Object.keys(doc.elements).length)
    expect(st.isDirty).toBe(true)
  })

  it('已有内容时插到右侧并扩张页面，undo 一次整体回退', () => {
    const host = shapeRegistry.createElement('process', 600, 150)!
    host.props.w = 100
    host.props.h = 100
    useEditorStore.getState().addElement(host)
    historyManager.clear()

    const pageBefore = { ...useEditorStore.getState().document.page }
    const spec = getTemplateById('vsm-flow')!
    const doc = buildTemplateDocument(spec)

    // 模板内容包围盒（含连线端点/折点）
    let minX = Infinity
    let maxX = -Infinity
    for (const el of Object.values(doc.elements)) {
      if (isLinker(el)) {
        for (const p of [el.from, el.to, ...el.points]) {
          minX = Math.min(minX, p.x)
          maxX = Math.max(maxX, p.x)
        }
      } else {
        minX = Math.min(minX, el.props.x)
        maxX = Math.max(maxX, el.props.x + el.props.w)
      }
    }

    useEditorStore.getState().insertDocument(doc)

    let st = useEditorStore.getState()
    // 现有内容右边缘 700 + 间距 80 = 780
    const insertedXs = Object.values(st.document.elements)
      .filter((el): el is ElementInstance => !isLinker(el) && el.id !== host.id)
      .map((el) => el.props.x)
    expect(Math.min(...insertedXs)).toBe(780)

    // 页面只增不减，且正好容纳插入内容 + 留白
    expect(st.document.page.width).toBe(Math.ceil(maxX + (780 - minX) + 40))
    expect(st.document.page.width).toBeGreaterThan(pageBefore.width)
    expect(st.canUndo()).toBe(true)

    st.undo()
    st = useEditorStore.getState()
    expect(Object.keys(st.document.elements)).toHaveLength(1)
    expect(st.document.elements[host.id]).toBeDefined()
    expect(st.document.page.width).toBe(pageBefore.width)
    expect(st.document.page.height).toBe(pageBefore.height)
    expect(st.canUndo()).toBe(false)
  })

  it('连线端点与折点随插入位移', () => {
    const host = shapeRegistry.createElement('process', 0, 0)!
    useEditorStore.getState().addElement(host)
    historyManager.clear()

    const spec = getTemplateById('system-flow')!
    const doc = buildTemplateDocument(spec)
    const srcLinker = Object.values(doc.elements).find(
      (el) => isLinker(el) && el.points.length > 0,
    )!
    if (!isLinker(srcLinker)) throw new Error('测试数据缺少带折点的连线')

    let minX = Infinity
    for (const el of Object.values(doc.elements)) {
      if (!isLinker(el)) minX = Math.min(minX, el.props.x)
    }
    const dx = Math.round(host.props.x + host.props.w + 80 - minX)

    useEditorStore.getState().insertDocument(doc)

    const st = useEditorStore.getState()
    const inserted = st.document.elements[srcLinker.id]
    expect(inserted).toBeDefined()
    if (!inserted || !isLinker(inserted)) return
    expect(inserted.from.x).toBe(srcLinker.from.x + dx)
    expect(inserted.points[0]?.x).toBe((srcLinker.points[0]?.x ?? 0) + dx)
  })
})
