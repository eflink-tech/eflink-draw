import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AIChatPanel } from '../AIChatPanel'
import { settingsStore } from '../../../ai/db'
import { compressImage } from '../../../ai/imageCompressor'
import { AIService } from '../../../ai/aiService'
import { useUIStore } from '../../../store/uiStore'

// Mock settingsStore
vi.mock('../../../ai/db', () => ({
  settingsStore: {
    getSettings: vi.fn(),
    isConfigured: vi.fn(),
  },
}))

vi.mock('../../../ai/imageCompressor', () => ({
  compressImage: vi.fn(),
}))

vi.mock('../../../ai/aiService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../ai/aiService')>()
  return {
    ...actual,
    AIService: vi.fn(),
  }
})

// jsdom 不解码图片：stub 全局 Image，src 赋值后异步触发 onload
class MockImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  _src = ''
  set src(v: string) {
    this._src = v
    setTimeout(() => this.onload?.(), 0)
  }
  get src() {
    return this._src
  }
}

describe('AIChatPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(settingsStore.getSettings).mockResolvedValue({
      baseUrl: 'https://api.openai.com/v1',
      apiKey: 'sk-test',
      model: 'gpt-4o',
    })
    vi.mocked(settingsStore.isConfigured).mockResolvedValue(true)
  })

  it('渲染停靠面板：标题栏含 AI 设置与收起按钮', () => {
    render(<AIChatPanel />)
    expect(screen.getByText(/AI 智能助手/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'AI 设置' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '收起' })).toBeInTheDocument()
  })

  it('收起按钮切换 uiStore 的 aiPanelVisible（显隐由 AppLayout 控制）', () => {
    render(<AIChatPanel />)
    const before = useUIStore.getState().aiPanelVisible
    fireEvent.click(screen.getByRole('button', { name: '收起' }))
    expect(useUIStore.getState().aiPanelVisible).toBe(!before)
  })

  it('面板显示消息输入与发送按钮', async () => {
    render(<AIChatPanel />)
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /消息输入/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '发送' })).toBeInTheDocument()
    })
  })

  it('API 未配置时显示首用引导卡片', async () => {
    vi.mocked(settingsStore.isConfigured).mockResolvedValue(false)
    render(<AIChatPanel />)
    await waitFor(() => {
      expect(screen.getByText(/尚未配置 AI 服务/i)).toBeInTheDocument()
    })
  })
})

describe('AIChatPanel 图片粘贴与预览', () => {
  function makeImageFile(): File {
    return new File(['fake'], 'clip.png', { type: 'image/png' })
  }
  function pasteEventWithFile(file: File | null) {
    return {
      clipboardData: {
        items: [
          file
            ? { kind: 'file', type: file.type, getAsFile: () => file }
            : { kind: 'string', type: 'text/plain', getAsFile: () => null },
        ],
      },
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('Image', MockImage)
    vi.mocked(settingsStore.getSettings).mockResolvedValue({
      baseUrl: 'https://api.openai.com/v1',
      apiKey: 'sk-test',
      model: 'gpt-4o',
    })
    vi.mocked(settingsStore.isConfigured).mockResolvedValue(true)
    vi.mocked(compressImage).mockResolvedValue({
      base64: 'data:image/jpeg;base64,mockdata',
      width: 100,
      height: 80,
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('粘贴图片进入待发送列表并显示缩略图', async () => {
    render(<AIChatPanel />)
    fireEvent.paste(
      screen.getByLabelText('消息输入'),
      pasteEventWithFile(makeImageFile()),
    )
    await waitFor(() => {
      expect(screen.getByTestId('pending-images')).toBeInTheDocument()
    })
    expect(screen.getByAltText('待发送图片 1')).toBeInTheDocument()
  })

  it('点击移除按钮清空待发送图片', async () => {
    render(<AIChatPanel />)
    fireEvent.paste(
      screen.getByLabelText('消息输入'),
      pasteEventWithFile(makeImageFile()),
    )
    await waitFor(() => {
      expect(screen.getByTestId('pending-images')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: '移除图片 1' }))
    expect(screen.queryByTestId('pending-images')).not.toBeInTheDocument()
  })

  it('纯文本粘贴不出现缩略图', () => {
    render(<AIChatPanel />)
    fireEvent.paste(
      screen.getByLabelText('消息输入'),
      pasteEventWithFile(null),
    )
    expect(screen.queryByTestId('pending-images')).not.toBeInTheDocument()
  })
})

describe('AIChatPanel 图片消息错误降级', () => {
  function makeImageFile(): File {
    return new File(['fake'], 'clip.png', { type: 'image/png' })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('Image', MockImage)
    vi.mocked(settingsStore.getSettings).mockResolvedValue({
      baseUrl: 'https://api.openai.com/v1',
      apiKey: 'sk-test',
      model: 'gpt-4o',
    })
    vi.mocked(settingsStore.isConfigured).mockResolvedValue(true)
    vi.mocked(compressImage).mockResolvedValue({
      base64: 'data:image/jpeg;base64,mockdata',
      width: 100,
      height: 80,
    })
    // AIService 构造返回 sendMessage 必败的桩（模拟模型不支持 vision）
    vi.mocked(AIService).mockImplementation(
      () =>
        ({
          sendMessage: vi.fn().mockRejectedValue(new Error('400 model does not support image')),
        }) as unknown as AIService,
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('带图消息发送失败时提示更换视觉模型', async () => {
    render(<AIChatPanel />)
    fireEvent.paste(screen.getByLabelText('消息输入'), {
      clipboardData: {
        items: [
          { kind: 'file', type: 'image/png', getAsFile: () => makeImageFile() },
        ],
      },
    })
    await waitFor(() => {
      expect(screen.getByTestId('pending-images')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: '发送' }))
    await waitFor(() => {
      expect(screen.getByText(/更换视觉模型/)).toBeInTheDocument()
    })
  })
})

describe('AIChatPanel 发送中生成指示', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(settingsStore.getSettings).mockResolvedValue({
      baseUrl: 'https://api.openai.com/v1',
      apiKey: 'sk-test',
      model: 'gpt-4o',
    })
    vi.mocked(settingsStore.isConfigured).mockResolvedValue(true)
  })

  it('思考过程已出、正文迟迟未到时显示生成中指示，流结束后消失', async () => {
    // 模拟复刻场景：reasoning 输出完毕后，模型长时间生成 JSON（正文被剥成空串）
    let resolveSend!: (v: { message: string; actions: unknown[] }) => void
    vi.mocked(AIService).mockImplementation(
      () =>
        ({
          sendMessage: vi.fn().mockImplementation(
            (opts: { onReasoningChunk?: (chunk: string, full: string) => void }) => {
              opts.onReasoningChunk?.('分析图片结构', '分析图片结构')
              return new Promise((resolve) => {
                resolveSend = () => resolve({ message: '已完成', actions: [] })
              })
            },
          ),
        }) as unknown as AIService,
    )

    render(<AIChatPanel />)
    fireEvent.change(screen.getByLabelText('消息输入'), {
      target: { value: '复刻一张流程图' },
    })
    fireEvent.click(screen.getByRole('button', { name: '发送' }))

    // 发送中：生成中指示出现
    await waitFor(() => {
      expect(screen.getByTestId('generating-indicator')).toBeInTheDocument()
    })

    // 流结束：指示消失
    resolveSend({ message: '已完成', actions: [] })
    await waitFor(() => {
      expect(screen.queryByTestId('generating-indicator')).not.toBeInTheDocument()
    })
  })
})
