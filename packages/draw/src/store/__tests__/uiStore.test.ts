import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '../uiStore'

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      activeCategory: 'basic',
      leftPanelVisible: true,
      rightPanelVisible: true,
    })
  })

  it('初始分类为 basic', () => {
    expect(useUIStore.getState().activeCategory).toBe('basic')
  })

  it('setActiveCategory 切换分类', () => {
    useUIStore.getState().setActiveCategory('flow')
    expect(useUIStore.getState().activeCategory).toBe('flow')
  })

  it('toggleLeftPanel 切换左侧面板', () => {
    useUIStore.getState().toggleLeftPanel()
    expect(useUIStore.getState().leftPanelVisible).toBe(false)
    useUIStore.getState().toggleLeftPanel()
    expect(useUIStore.getState().leftPanelVisible).toBe(true)
  })
})
