// @vitest-environment jsdom
// ColorGrid 测试：点击色块回调 / 透明按钮回调 / HEX 实时应用
import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { ColorGrid } from '../ColorGrid'
import { GRAY_PALETTE } from '@/core/utils/color'

describe('ColorGrid', () => {
  it('点击灰阶首块触发 onSelect(rgb)', () => {
    const onSelect = vi.fn()
    const { container } = render(<ColorGrid value={null} onSelect={onSelect} transparent />)
    const first = container.querySelector('button')
    if (!first) throw new Error('未渲染出色块')
    first.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(onSelect).toHaveBeenCalledWith(GRAY_PALETTE[0])
  })

  it('透明按钮 onSelect(null)', () => {
    const onSelect = vi.fn()
    const { container } = render(<ColorGrid value={null} onSelect={onSelect} transparent />)
    const btn = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === '透明')
    if (!btn) throw new Error('未渲染出透明按钮')
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(onSelect).toHaveBeenCalledWith(null)
  })

  it('HEX 输入合法值实时触发 onLiveSelect（不触发 onSelect）', () => {
    const onSelect = vi.fn()
    const onLiveSelect = vi.fn()
    const { container } = render(
      <ColorGrid value={null} onSelect={onSelect} onLiveSelect={onLiveSelect} />,
    )
    const input = container.querySelector('input')
    if (!input) throw new Error('未渲染出 HEX 输入框')
    fireEvent.change(input, { target: { value: 'ff0000' } })
    expect(onLiveSelect).toHaveBeenCalledWith('255,0,0')
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('HEX 输入非法中间值不触发实时应用', () => {
    const onLiveSelect = vi.fn()
    const { container } = render(
      <ColorGrid value={null} onSelect={vi.fn()} onLiveSelect={onLiveSelect} />,
    )
    const input = container.querySelector('input')
    if (!input) throw new Error('未渲染出 HEX 输入框')
    fireEvent.change(input, { target: { value: 'ff00' } })
    expect(onLiveSelect).not.toHaveBeenCalled()
  })

  it('未传 onLiveSelect 时输入不触发 onSelect（保持回车/失焦提交）', () => {
    const onSelect = vi.fn()
    const { container } = render(<ColorGrid value={null} onSelect={onSelect} />)
    const input = container.querySelector('input')
    if (!input) throw new Error('未渲染出 HEX 输入框')
    fireEvent.change(input, { target: { value: 'ff0000' } })
    expect(onSelect).not.toHaveBeenCalled()
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith('255,0,0')
  })
})
