// 二级分组折叠：所有子分组（含非懒加载的 UML / BPMN / 移动端）都要能展开与收起
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { LeftPanel } from '../LeftPanel'
import { useUIStore } from '@/store/uiStore'

const tilesOf = (container: HTMLElement, panelId: string) =>
  container.querySelectorAll(`[data-panel="${panelId}"] [data-shape]`).length

const openCategory = (container: HTMLElement, name: string) => {
  const header = [...container.querySelectorAll('button')].find((b) => b.textContent?.includes(name))
  fireEvent.click(header!)
}

describe('左侧面板二级分组折叠', () => {
  beforeEach(() => {
    useUIStore.setState({ activeCategory: 'basic' })
  })
  afterEach(cleanup)

  it('非懒加载子分组默认展开，点标题收起、再点恢复', () => {
    const { container } = render(<LeftPanel />)
    openCategory(container, 'UML')
    const all = tilesOf(container, 'uml')
    expect(all).toBeGreaterThan(0)

    const group = container.querySelector('[data-group="uml_class"]') as HTMLElement
    expect(group.textContent).toContain('类图')
    fireEvent.click(group)
    const collapsed = tilesOf(container, 'uml')
    expect(collapsed).toBeLessThan(all)

    fireEvent.click(container.querySelector('[data-group="uml_class"]') as HTMLElement)
    expect(tilesOf(container, 'uml')).toBe(all)
  })

  it('每个二级分组都带折叠箭头，懒加载品类默认收起', () => {
    const { container } = render(<LeftPanel />)
    openCategory(container, 'UML')
    // 箭头 svg 与标题同处一个按钮内
    expect(container.querySelector('[data-group="uml_class"] svg')).toBeTruthy()

    openCategory(container, '网络拓扑')
    const lazy = container.querySelector('[data-group="topo_devices"]') as HTMLElement
    expect(lazy).toBeTruthy()
    expect(container.querySelector('[data-shape="topo_router"]')).toBeNull()
  })
})
