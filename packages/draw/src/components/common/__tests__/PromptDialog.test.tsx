// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { PromptDialog } from '../PromptDialog'

describe('PromptDialog', () => {
  it('提交修改后的值', () => {
    const onSubmit = vi.fn()
    const { container } = render(
      <PromptDialog title="重命名" defaultValue="旧名" onSubmit={onSubmit} onCancel={() => {}} />,
    )
    const input = container.querySelector('input')
    if (!input) throw new Error('未渲染出输入框')
    fireEvent.change(input, { target: { value: '新名' } })
    const ok = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === '确定')
    if (!ok) throw new Error('未渲染出确定按钮')
    fireEvent.click(ok)
    expect(onSubmit).toHaveBeenCalledWith('新名')
  })

  it('取消回调', () => {
    const onCancel = vi.fn()
    const { container } = render(
      <PromptDialog title="重命名" defaultValue="旧名" onSubmit={() => {}} onCancel={onCancel} />,
    )
    const cancel = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === '取消')
    if (!cancel) throw new Error('未渲染出取消按钮')
    fireEvent.click(cancel)
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
