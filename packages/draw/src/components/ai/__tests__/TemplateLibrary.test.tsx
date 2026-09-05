// src/components/ai/__tests__/TemplateLibrary.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TemplateLibrary } from '../TemplateLibrary'
import { templateStore } from '../../../ai/db'

// Mock templateStore
vi.mock('../../../ai/db', () => ({
  templateStore: {
    getBuiltinTemplates: vi.fn(),
    seedBuiltin: vi.fn(),
  },
}))

describe('TemplateLibrary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(templateStore.seedBuiltin).mockResolvedValue()
    vi.mocked(templateStore.getBuiltinTemplates).mockResolvedValue([
      { id: 'tpl-order', name: '订单处理流程', description: '下单、支付、发货', icon: '🛒', prompt: '...', builtin: 1 },
      { id: 'tpl-microservice', name: '微服务架构', description: 'API 网关', icon: '🏗️', prompt: '...', builtin: 1 },
    ])
  })

  it('渲染模板卡片', async () => {
    render(<TemplateLibrary />)
    await waitFor(() => {
      expect(screen.getByText('订单处理流程')).toBeInTheDocument()
      expect(screen.getByText('微服务架构')).toBeInTheDocument()
    })
  })

  it('显示模板图标', async () => {
    render(<TemplateLibrary />)
    await waitFor(() => {
      expect(screen.getByText('🛒')).toBeInTheDocument()
      expect(screen.getByText('🏗️')).toBeInTheDocument()
    })
  })

  it('点击卡片触发 onSelect 回调', async () => {
    const onSelect = vi.fn()
    render(<TemplateLibrary onSelect={onSelect} />)
    await waitFor(() => {
      expect(screen.getByText('订单处理流程')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('订单处理流程'))
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'tpl-order' }))
  })

  it('组件挂载时调用 seedBuiltin', async () => {
    render(<TemplateLibrary />)
    await waitFor(() => {
      expect(templateStore.seedBuiltin).toHaveBeenCalled()
    })
  })

  it('加载失败时显示错误信息', async () => {
    vi.mocked(templateStore.getBuiltinTemplates).mockRejectedValue(new Error('网络错误'))
    render(<TemplateLibrary />)
    await waitFor(() => {
      expect(screen.getByText(/加载失败/)).toBeInTheDocument()
      expect(screen.getByText(/网络错误/)).toBeInTheDocument()
    })
  })

  it('空模板列表显示"暂无模板"', async () => {
    vi.mocked(templateStore.getBuiltinTemplates).mockResolvedValue([])
    render(<TemplateLibrary />)
    await waitFor(() => {
      expect(screen.getByText('暂无模板')).toBeInTheDocument()
    })
  })
})
