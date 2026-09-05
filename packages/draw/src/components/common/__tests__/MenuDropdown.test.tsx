// @vitest-environment jsdom
// MenuDropdown 测试：开合 / 顶级项点击关闭 / 子菜单 hover 展开 / 外点关闭 / Esc 关闭
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { MenuDropdown } from '../MenuDropdown'

const getItem = (doc: ParentNode, label: string): HTMLElement => {
  const btns = Array.from(doc.querySelectorAll('button'))
  const btn = btns.find((b) => b.textContent?.trim().replace(/▸$/, '').trim() === label)
  if (!btn) throw new Error(`未渲染出菜单项 ${label}`)
  return btn
}

describe('MenuDropdown', () => {
  it('点击顶级项触发 onClick 并关闭', () => {
    const onClick = vi.fn()
    const { container } = render(
      <MenuDropdown label="文件" items={[{ label: '保存', onClick }]} />,
    )
    fireEvent.click(getItem(container, '文件'))
    expect(getItem(container, '保存')).toBeTruthy()
    fireEvent.click(getItem(container, '保存'))
    expect(onClick).toHaveBeenCalledOnce()
    expect(container.textContent).not.toContain('保存')
  })

  it('子菜单 hover 展开，子项点击触发闭合并关闭', () => {
    const onClick = vi.fn()
    const { container } = render(
      <MenuDropdown
        label="插入"
        items={[
          {
            label: '文本',
            children: [{ label: '自由文本', onClick }],
          },
        ]}
      />,
    )
    fireEvent.click(getItem(container, '插入'))
    fireEvent.mouseEnter(getItem(container, '文本'))
    expect(container.textContent).toContain('自由文本')
    fireEvent.click(getItem(container, '自由文本'))
    expect(onClick).toHaveBeenCalledOnce()
    expect(container.textContent).not.toContain('自由文本')
  })

  it('禁用项不可点', () => {
    const onClick = vi.fn()
    const { container } = render(
      <MenuDropdown label="插入" items={[{ label: '图片', disabled: true, onClick }]} />,
    )
    fireEvent.click(getItem(container, '插入'))
    fireEvent.click(getItem(container, '图片'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('外部 mousedown 关闭菜单', () => {
    const { container } = render(<MenuDropdown label="文件" items={[{ label: '保存' }]} />)
    fireEvent.click(getItem(container, '文件'))
    expect(container.textContent).toContain('保存')
    fireEvent.mouseDown(document.body)
    expect(container.textContent).not.toContain('保存')
  })

  it('关闭后重开不残留上次展开的子菜单', () => {
    const { container } = render(
      <MenuDropdown label="排列" items={[{ label: '对齐', children: [{ label: '左对齐' }] }]} />,
    )
    fireEvent.click(getItem(container, '排列'))
    fireEvent.mouseEnter(getItem(container, '对齐'))
    expect(container.textContent).toContain('左对齐')
    fireEvent.mouseDown(document.body)
    expect(container.textContent).not.toContain('左对齐')
    fireEvent.click(getItem(container, '排列'))
    expect(container.textContent).not.toContain('左对齐')
  })
})