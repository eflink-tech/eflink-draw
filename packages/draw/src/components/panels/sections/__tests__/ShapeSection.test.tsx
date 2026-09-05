// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LineSection, ShadowSection } from '../ShapeSection'
import { useEditorStore } from '@/store/editorStore'
import { shapeRegistry } from '@/core/schema/registry'
import { createLinkerInstance } from '@/core/editor/linker'
import '@/core/schema/shapes'
import type { ElementInstance, LinkerInstance } from '@/types'

function makeSelected(overrides: Partial<ElementInstance> = {}): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', 0, 0)!
  const full: ElementInstance = { ...el, ...overrides }
  useEditorStore.getState().setDocument({
    page: useEditorStore.getState().document.page,
    elements: { [full.id]: full },
  })
  useEditorStore.getState().selectIds([full.id], 'replace')
  return full
}

describe('ShadowSection', () => {
  it('勾选开关 → applyShapePatch 写入 shadowEnabled=true', () => {
    const el = makeSelected({ shapeStyle: { alpha: 1, shadowEnabled: false } })
    const updateSpy = vi.spyOn(useEditorStore.getState(), 'updateElement')
    const { container } = render(<ShadowSection first={el} />)
    const checkbox = container.querySelector('input[type="checkbox"]')!
    fireEvent.click(checkbox)
    expect(updateSpy).toHaveBeenCalledWith(el.id, expect.objectContaining({
      shapeStyle: expect.objectContaining({ shadowEnabled: true }),
    }))
    updateSpy.mockRestore()
  })
})

/** 通过 Row 标签文本找到对应的第一个按钮（限定在 container 内搜索） */
function findButtonByRowLabel(container: HTMLElement, label: string): HTMLButtonElement {
  const spans = container.querySelectorAll('span')
  const labelEl = Array.from(spans).find((s) => s.textContent === label)!
  const row = labelEl.closest('.flex.items-center.gap-2')!
  return row.querySelector('button')!
}

describe('LineSection 连线箭头', () => {
  it('切换起始箭头 → applyLinkerPatch 写入 beginArrowStyle', () => {
    const linker = createLinkerInstance(
      { id: null, x: 0, y: 0, angle: 0 },
      { id: null, x: 100, y: 0, angle: 0 },
      0,
    )
    useEditorStore.getState().setDocument({
      page: useEditorStore.getState().document.page,
      elements: { [linker.id]: linker },
    })
    useEditorStore.getState().selectIds([linker.id], 'replace')
    const updateSpy = vi.spyOn(useEditorStore.getState(), 'updateLinker')
    const { container } = render(<LineSection first={linker as LinkerInstance} />)

    // 打开起箭头下拉菜单
    const beginBtn = findButtonByRowLabel(container, '起箭头')
    fireEvent.click(beginBtn)
    // 点击菜单项中的 solidArrow 预览
    const menuItems = screen.getAllByRole('button').filter(
      (btn) => btn.closest('.absolute') != null,
    )
    fireEvent.click(menuItems[1]!) // 第二项 = solidArrow
    expect(updateSpy).toHaveBeenCalledWith(linker.id, expect.objectContaining({
      lineStyle: expect.objectContaining({ beginArrowStyle: 'solidArrow' }),
    }))
    updateSpy.mockRestore()
  })

  it('切换终止箭头 → applyLinkerPatch 写入 endArrowStyle', () => {
    const linker = createLinkerInstance(
      { id: null, x: 0, y: 0, angle: 0 },
      { id: null, x: 100, y: 0, angle: 0 },
      0,
    )
    useEditorStore.getState().setDocument({
      page: useEditorStore.getState().document.page,
      elements: { [linker.id]: linker },
    })
    useEditorStore.getState().selectIds([linker.id], 'replace')
    const updateSpy = vi.spyOn(useEditorStore.getState(), 'updateLinker')
    const { container } = render(<LineSection first={linker as LinkerInstance} />)

    // 打开止箭头下拉菜单
    const endBtn = findButtonByRowLabel(container, '止箭头')
    fireEvent.click(endBtn)
    // 点击菜单项中的 solidArrow 预览
    const menuItems = screen.getAllByRole('button').filter(
      (btn) => btn.closest('.absolute') != null,
    )
    fireEvent.click(menuItems[1]!) // 第二项 = solidArrow
    expect(updateSpy).toHaveBeenCalledWith(linker.id, expect.objectContaining({
      lineStyle: expect.objectContaining({ endArrowStyle: 'solidArrow' }),
    }))
    updateSpy.mockRestore()
  })

  it('切换起箭头为 cross → applyLinkerPatch 写入 beginArrowStyle=cross', () => {
    const linker = createLinkerInstance(
      { id: null, x: 0, y: 0, angle: 0 },
      { id: null, x: 100, y: 0, angle: 0 },
      0,
    )
    useEditorStore.getState().setDocument({
      page: useEditorStore.getState().document.page,
      elements: { [linker.id]: linker },
    })
    useEditorStore.getState().selectIds([linker.id], 'replace')
    const updateSpy = vi.spyOn(useEditorStore.getState(), 'updateLinker')
    const { container } = render(<LineSection first={linker as LinkerInstance} />)

    const beginBtn = findButtonByRowLabel(container, '起箭头')
    fireEvent.click(beginBtn)
    const menuItems = screen.getAllByRole('button').filter(
      (btn) => btn.closest('.absolute') != null,
    )
    // 9 项菜单：none, solidArrow, dashedArrow, normal, solidDiamond, dashedDiamond, solidCircle, dashedCircle, cross
    fireEvent.click(menuItems[8]!) // 第九项 = cross
    expect(updateSpy).toHaveBeenCalledWith(linker.id, expect.objectContaining({
      lineStyle: expect.objectContaining({ beginArrowStyle: 'cross' }),
    }))
    updateSpy.mockRestore()
  })

  it('切换止箭头为 solidDiamond → applyLinkerPatch 写入 endArrowStyle=solidDiamond', () => {
    const linker = createLinkerInstance(
      { id: null, x: 0, y: 0, angle: 0 },
      { id: null, x: 100, y: 0, angle: 0 },
      0,
    )
    useEditorStore.getState().setDocument({
      page: useEditorStore.getState().document.page,
      elements: { [linker.id]: linker },
    })
    useEditorStore.getState().selectIds([linker.id], 'replace')
    const updateSpy = vi.spyOn(useEditorStore.getState(), 'updateLinker')
    const { container } = render(<LineSection first={linker as LinkerInstance} />)

    const endBtn = findButtonByRowLabel(container, '止箭头')
    fireEvent.click(endBtn)
    const menuItems = screen.getAllByRole('button').filter(
      (btn) => btn.closest('.absolute') != null,
    )
    // 9 项菜单：none, solidArrow, dashedArrow, normal, solidDiamond, ...
    fireEvent.click(menuItems[4]!) // 第五项 = solidDiamond
    expect(updateSpy).toHaveBeenCalledWith(linker.id, expect.objectContaining({
      lineStyle: expect.objectContaining({ endArrowStyle: 'solidDiamond' }),
    }))
    updateSpy.mockRestore()
  })
})
