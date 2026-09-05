// @vitest-environment jsdom
// NumField 组件测试：clamp 提交 / 非法回滚 / 值未变不提交 / props 外部变化重置显示
import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { NumField } from '../fields'

/** 取渲染容器内唯一的 input */
const getInput = (container: HTMLElement): HTMLInputElement => {
  const input = container.querySelector('input')
  if (!input) throw new Error('未渲染出 input 元素')
  return input
}

describe('NumField', () => {
  it('blur 时提交 clamp 后的值', () => {
    const onCommit = vi.fn()
    const { container } = render(<NumField value={0} min={0} max={360} onCommit={onCommit} />)
    const input = getInput(container)
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '400' } })
    fireEvent.blur(input)
    expect(onCommit).toHaveBeenCalledTimes(1)
    expect(onCommit).toHaveBeenCalledWith(360)
  })

  it('非法输入 blur 回滚显示且不提交', () => {
    const onCommit = vi.fn()
    const { container } = render(<NumField value={33} onCommit={onCommit} />)
    const input = getInput(container)
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.blur(input)
    expect(onCommit).not.toHaveBeenCalled()
    expect(input.value).toBe('33')
  })

  it('值未变化时 blur 不提交（回归保护：聚焦即 blur 不得触发 onCommit）', () => {
    const onCommit = vi.fn()
    // 常规值：不做任何编辑，仅聚焦后直接 blur
    const { container } = render(<NumField value={45} min={0} max={360} onCommit={onCommit} />)
    const input = getInput(container)
    fireEvent.focus(input)
    fireEvent.blur(input)
    expect(onCommit).not.toHaveBeenCalled()

    // 修复前失败场景的原始形态：props 值本身在 min/max 范围外（负角度），
    // 聚焦即 blur 也不得被 clamp 成边界值提交
    const onCommit2 = vi.fn()
    const { container: container2 } = render(
      <NumField value={-45} min={0} max={360} onCommit={onCommit2} />,
    )
    const input2 = getInput(container2)
    fireEvent.focus(input2)
    fireEvent.blur(input2)
    expect(onCommit2).not.toHaveBeenCalled()
  })

  it('props value 外部变化时本地显示重置', () => {
    const onCommit = vi.fn()
    const { container, rerender } = render(<NumField value={10} onCommit={onCommit} />)
    expect(getInput(container).value).toBe('10')
    rerender(<NumField value={99} onCommit={onCommit} />)
    expect(getInput(container).value).toBe('99')
  })
})
