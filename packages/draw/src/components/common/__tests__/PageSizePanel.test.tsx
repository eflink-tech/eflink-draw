// @vitest-environment jsdom
// PageSizePanel 测试：回显宽/高 / 点预设应用 / 点应用按钮回传数值
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { PageSizePanel } from '../PageSizePanel'

describe('PageSizePanel', () => {
  it('回显当前宽高', () => {
    const { container } = render(<PageSizePanel width={1600} height={1200} onApply={() => {}} />)
    const inputs = container.querySelectorAll('input')
    expect(inputs[0]?.value).toBe('1600')
    expect(inputs[1]?.value).toBe('1200')
  })

  it('点预设 A3 应用 1500×2100', () => {
    const onApply = vi.fn()
    const { container } = render(<PageSizePanel width={1600} height={1200} onApply={onApply} />)
    fireEvent.click(Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'A3')!)
    expect(onApply).toHaveBeenCalledWith(1500, 2100)
  })

  it('修改自定义宽高并应用', () => {
    const onApply = vi.fn()
    const { container } = render(<PageSizePanel width={1600} height={1200} onApply={onApply} />)
    const inputs = container.querySelectorAll('input')
    fireEvent.change(inputs[0]!, { target: { value: '800' } })
    fireEvent.change(inputs[1]!, { target: { value: '600' } })
    fireEvent.click(Array.from(container.querySelectorAll('button')).find((b) => b.textContent === '应用')!)
    expect(onApply).toHaveBeenCalledWith(800, 600)
  })
})
