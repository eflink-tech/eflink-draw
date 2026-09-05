// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { ContextMenu } from '../ContextMenu'
import type { MenuNode } from '@/components/common/MenuDropdown'

afterEach(cleanup)

const items: MenuNode[] = [
  { label: '复制', onClick: vi.fn() },
  { divider: true },
  { label: '删除', onClick: vi.fn() },
]

describe('ContextMenu', () => {
  it('open=true 时按 x/y 渲染菜单项', () => {
    const { getByText } = render(
      <ContextMenu open x={100} y={200} items={items} onClose={vi.fn()} />,
    )
    expect(getByText('复制')).toBeTruthy()
    expect(getByText('删除')).toBeTruthy()
  })

  it('open=false 时不渲染', () => {
    const { queryByText } = render(
      <ContextMenu open={false} x={0} y={0} items={items} onClose={vi.fn()} />,
    )
    expect(queryByText('复制')).toBeNull()
  })

  it('点击菜单项触发 onClick 并 onClose', () => {
    const onClose = vi.fn()
    const onClick = vi.fn()
    const { getByText } = render(
      <ContextMenu open x={0} y={0} items={[{ label: '复制', onClick }]} onClose={onClose} />,
    )
    fireEvent.click(getByText('复制'))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('按 Esc 触发 onClose', () => {
    const onClose = vi.fn()
    render(<ContextMenu open x={0} y={0} items={items} onClose={onClose} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
