import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { TemplatePickerDialog } from '../TemplatePickerDialog'
import { historyManager, useEditorStore } from '@/store/editorStore'
import { createEmptyDocument } from '@/types'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'

function resetStore() {
  useEditorStore.setState({
    document: createEmptyDocument(),
    selectedIds: new Set(),
    viewport: { x: 0, y: 0, scale: 1 },
    isDirty: false,
  })
  historyManager.clear()
}

function cards() {
  return Array.from(document.querySelectorAll('[data-template-id]'))
}

describe('TemplatePickerDialog', () => {
  beforeEach(resetStore)

  it('展示全部 18 个模板与首个模板预览', () => {
    render(<TemplatePickerDialog onClose={() => {}} />)
    expect(cards()).toHaveLength(18)
    const preview = screen.getByTestId('template-preview')
    expect(within(preview).getByText('基础流程图')).toBeInTheDocument()
    expect(preview.querySelector('svg')).not.toBeNull()
  })

  it('分类筛选与搜索', () => {
    render(<TemplatePickerDialog onClose={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /系统技术/ }))
    expect(cards()).toHaveLength(3)

    fireEvent.change(screen.getByLabelText('搜索模板'), { target: { value: 'BPMN' } })
    expect(cards()).toHaveLength(1)
    expect(screen.getByText('BPMN 业务流程')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('搜索模板'), { target: { value: '不存在的模板' } })
    expect(cards()).toHaveLength(0)
    expect(screen.getByText('没有匹配的模板')).toBeInTheDocument()
  })

  it('点击卡片切换预览', () => {
    render(<TemplatePickerDialog onClose={() => {}} />)
    fireEvent.click(document.querySelector('[data-template-id="vsm-flow"]')!)
    const preview = screen.getByTestId('template-preview')
    expect(within(preview).getByText('价值流图(VSM)')).toBeInTheDocument()
  })

  it('新建画布使用：载入模板文档并关闭弹窗', () => {
    const onClose = vi.fn()
    render(<TemplatePickerDialog onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: '新建画布使用' }))

    const st = useEditorStore.getState()
    expect(st.document.page.title).toBe('基础流程图')
    expect(Object.keys(st.document.elements).length).toBeGreaterThan(0)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('当前画布有内容时新建需确认，取消则保持原文档', () => {
    const onClose = vi.fn()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const host = shapeRegistry.createElement('process', 10, 10)!
    useEditorStore.getState().addElement(host)
    const titleBefore = useEditorStore.getState().document.page.title
    render(<TemplatePickerDialog onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: '新建画布使用' }))

    expect(confirmSpy).toHaveBeenCalled()
    expect(useEditorStore.getState().document.page.title).toBe(titleBefore)
    expect(useEditorStore.getState().document.elements[host.id]).toBeDefined()
    expect(onClose).not.toHaveBeenCalled()
    confirmSpy.mockRestore()
  })

  it('插入当前画布：并入元素并关闭弹窗', () => {
    const onClose = vi.fn()
    render(<TemplatePickerDialog onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: '插入当前画布' }))

    const st = useEditorStore.getState()
    expect(Object.keys(st.document.elements).length).toBeGreaterThan(0)
    expect(st.isDirty).toBe(true)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
