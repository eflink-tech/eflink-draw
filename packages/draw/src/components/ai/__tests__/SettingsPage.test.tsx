// src/components/ai/__tests__/SettingsPage.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SettingsPage } from '../SettingsPage'
import { settingsStore } from '../../../ai/db'

// Mock settingsStore
vi.mock('../../../ai/db', () => ({
  settingsStore: {
    getSettings: vi.fn(),
    saveSettings: vi.fn(),
    isConfigured: vi.fn(),
    maskApiKey: (key?: string) => (!key || key.length <= 8 ? '***' : `${key.slice(0, 4)}***${key.slice(-4)}`),
  },
}))

// Mock AIService 的静态 ping 自检（组件不再构造实例、不再走 sendMessage）。
// mockPing 需通过 vi.hoisted 提升，供被提升的 vi.mock 工厂引用。
const { mockPing } = vi.hoisted(() => ({ mockPing: vi.fn() }))
vi.mock('../../../ai/aiService', () => ({
  AIService: { ping: mockPing },
}))

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPing.mockResolvedValue({ ok: true })
    vi.mocked(settingsStore.getSettings).mockResolvedValue({
      baseUrl: '',
      apiKey: '',
      model: '',
    })
  })

  const fillAll = async () => {
    await waitFor(() => {
      expect(screen.getByLabelText('API Base URL')).toBeInTheDocument()
    })
    fireEvent.change(screen.getByLabelText('API Base URL'), {
      target: { value: 'https://api.openai.com/v1' },
    })
    fireEvent.change(screen.getByLabelText('API Key'), {
      target: { value: 'sk-test-key' },
    })
    fireEvent.change(screen.getByLabelText('Model'), {
      target: { value: 'gpt-4o' },
    })
  }

  /** 点击保存按钮（掩码提示文案含"保存"，需按 role 区分） */
  const clickSave = () => {
    fireEvent.click(screen.getByRole('button', { name: '保存' }))
  }

  it('渲染 3 个输入框（按 label 定位）', async () => {
    render(<SettingsPage />)
    await waitFor(() => {
      expect(screen.getByLabelText('API Base URL')).toBeInTheDocument()
      expect(screen.getByLabelText('API Key')).toBeInTheDocument()
      expect(screen.getByLabelText('Model')).toBeInTheDocument()
    })
  })

  it('显示多模态模型提示（黄底卡片）', async () => {
    render(<SettingsPage />)
    await waitFor(() => {
      expect(screen.getByText(/多模态模型/i)).toBeInTheDocument()
    })
  })

  it('加载已保存的设置', async () => {
    vi.mocked(settingsStore.getSettings).mockResolvedValue({
      baseUrl: 'https://api.openai.com/v1',
      apiKey: 'sk-test',
      model: 'gpt-4o',
    })

    render(<SettingsPage />)

    await waitFor(() => {
      expect(screen.getByLabelText('API Base URL')).toHaveValue('https://api.openai.com/v1')
      expect(screen.getByLabelText('API Key')).toHaveValue('sk-test')
      expect(screen.getByLabelText('Model')).toHaveValue('gpt-4o')
    })
  })

  it('配置读取失败时显示错误横幅且页面仍可编辑', async () => {
    vi.mocked(settingsStore.getSettings).mockRejectedValueOnce(new Error('IDB 打不开'))
    render(<SettingsPage />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('IDB 打不开')
    })
    expect(screen.getByLabelText('API Base URL')).toBeEnabled()
  })

  it('点击保存时调用 settingsStore.saveSettings 并执行 ping 自检', async () => {
    render(<SettingsPage />)
    await fillAll()

    clickSave()

    await waitFor(() => {
      expect(settingsStore.saveSettings).toHaveBeenCalledWith({
        baseUrl: 'https://api.openai.com/v1',
        apiKey: 'sk-test-key',
        model: 'gpt-4o',
      })
      // 自检用静态 ping，不构造实例发完整对话请求
      expect(mockPing).toHaveBeenCalledWith({
        baseUrl: 'https://api.openai.com/v1',
        apiKey: 'sk-test-key',
        model: 'gpt-4o',
      })
    })
    expect(screen.getByRole('alert')).toHaveTextContent('连接正常')
  })

  it('连通性自检失败时显示红色错误信息，但设置仍然保存', async () => {
    mockPing.mockResolvedValueOnce({ ok: false, error: '网络超时' })
    render(<SettingsPage />)
    await fillAll()

    clickSave()

    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent('连通性检测失败')
      expect(alert).toHaveTextContent('网络超时')
      expect(alert.style.backgroundColor).toBe('rgb(248, 215, 218)')
    })
    expect(settingsStore.saveSettings).toHaveBeenCalled()
  })

  it('saveSettings 本身失败时显示保存失败且不再做自检', async () => {
    vi.mocked(settingsStore.saveSettings).mockRejectedValueOnce(new Error('磁盘已满'))
    render(<SettingsPage />)
    await fillAll()

    clickSave()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('保存失败：磁盘已满')
    })
    expect(mockPing).not.toHaveBeenCalled()
  })

  it('API Key 输入后以掩码展示当前值，不泄露完整密钥', async () => {
    render(<SettingsPage />)
    await waitFor(() => {
      expect(screen.getByLabelText('API Key')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('API Key'), {
      target: { value: 'sk-abcd1234567890efgh' },
    })

    const hint = screen.getByText(/当前已保存/)
    expect(hint).toHaveTextContent('sk-a***efgh')
    expect(document.body.textContent).not.toContain('sk-abcd1234567890efgh')
  })
})
