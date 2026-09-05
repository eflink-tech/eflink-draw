// @vitest-environment jsdom
import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TextSection } from '../TextSection'
import { useEditorStore } from '@/store/editorStore'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import type { ElementInstance } from '@/types'

function makeSelected(): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', 0, 0)!
  useEditorStore.getState().setDocument({
    page: useEditorStore.getState().document.page,
    elements: { [el.id]: el },
  })
  useEditorStore.getState().selectIds([el.id], 'replace')
  return el
}

describe('TextSection 字体家族', () => {
  it('切换字体 → patchFont 写入 fontFamily', () => {
    const el = makeSelected()
    const updateSpy = vi.spyOn(useEditorStore.getState(), 'updateElement')
    const { container } = render(<TextSection first={el} />)
    const fontSelect = container.querySelector('select')!
    fireEvent.change(fontSelect, { target: { value: 'kai' } })
    expect(updateSpy).toHaveBeenCalledWith(el.id, expect.objectContaining({
      fontStyle: expect.objectContaining({ fontFamily: 'kai' }),
    }))
    updateSpy.mockRestore()
  })
})

describe('TextSection 文本方向', () => {
  it('点击竖排 → patchFont 写入 orientation=vertical', () => {
    const el = makeSelected()
    const updateSpy = vi.spyOn(useEditorStore.getState(), 'updateElement')
    const { getAllByRole } = render(<TextSection first={el} />)
    const shuBtn = getAllByRole('button', { name: '竖' })[0]!
    fireEvent.click(shuBtn)
    expect(updateSpy).toHaveBeenCalledWith(el.id, expect.objectContaining({
      fontStyle: expect.objectContaining({ orientation: 'vertical' }),
    }))
    updateSpy.mockRestore()
  })
})
