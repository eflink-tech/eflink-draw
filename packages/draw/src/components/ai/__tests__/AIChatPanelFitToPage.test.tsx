// src/components/ai/__tests__/AIChatPanelFitToPage.test.tsx
// 集成验证：AI 动作执行成功后新增内容自动居中（超出页面时扩页）
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AIChatPanel } from '../AIChatPanel'
import { settingsStore } from '../../../ai/db'
import { compressImage } from '../../../ai/imageCompressor'
import { AIService } from '../../../ai/aiService'
import { useEditorStore } from '@/store/editorStore'
import { createEmptyDocument, type ElementInstance } from '@/types'
// 副作用导入：向 shapeRegistry 注册全部图形（生产环境由画布组件触发，测试需显式引入）
import '@/core/schema/shapes'

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

describe('AIChatPanel 落图归位（居中 + 扩页）', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('Image', MockImage)
    // 重置全局 store 文档，隔离其他用例的残留状态
    useEditorStore.setState({ document: createEmptyDocument() })
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
    // 模拟复刻场景：带图消息（skipLayout），AI 返回位于画布左上角 (100,100) 的元素
    vi.mocked(AIService).mockImplementation(
      () =>
        ({
          sendMessage: vi.fn().mockResolvedValue({
            message: '已完成',
            actions: [
              { type: 'add_element', schema: 'terminator', x: 100, y: 100, text: '开始' },
            ],
          }),
        }) as unknown as AIService,
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  async function sendImageMessage() {
    render(<AIChatPanel />)
    const file = new File(['fake'], 'clip.png', { type: 'image/png' })
    fireEvent.paste(screen.getByLabelText('消息输入'), {
      clipboardData: {
        items: [{ kind: 'file', type: 'image/png', getAsFile: () => file }],
      },
    })
    await waitFor(() => {
      expect(screen.getByTestId('pending-images')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: '发送' }))
    await waitFor(() => {
      // 最终回复 = "已完成" + 执行摘要拼接，用部分匹配
      expect(screen.getAllByText(/已完成/).length).toBeGreaterThan(0)
    })
  }

  it('元素落图后整体居中到页面中心', async () => {
    await sendImageMessage()
    // (100,100,默认w,h) 元素中心应移到页中心 (800,600)
    const elements = Object.values(useEditorStore.getState().document.elements).filter(
      (el): el is ElementInstance => el.name !== 'linker',
    )
    expect(elements).toHaveLength(1)
    const [x, y, w, h] = [
      elements[0].props.x,
      elements[0].props.y,
      elements[0].props.w,
      elements[0].props.h,
    ]
    expect(x + w / 2).toBeCloseTo(800, 0)
    expect(y + h / 2).toBeCloseTo(600, 0)
  })

  it('内容超出页面时自动扩页', async () => {
    // 三个横向铺开的元素（terminator 默认宽 100）：总包围盒 x 0..2000（宽 2000 > 1600）
    // → page.width 扩到 ceil(2000 + 2*60) = 2120，内容按新中心 x=1060 居中
    vi.mocked(AIService).mockImplementation(
      () =>
        ({
          sendMessage: vi.fn().mockResolvedValue({
            message: '已完成',
            actions: [
              { type: 'add_element', schema: 'terminator', x: 0, y: 100, text: 'A' },
              { type: 'add_element', schema: 'terminator', x: 950, y: 100, text: 'B' },
              { type: 'add_element', schema: 'terminator', x: 1900, y: 100, text: 'C' },
            ],
          }),
        }) as unknown as AIService,
    )
    await sendImageMessage()
    const doc = useEditorStore.getState().document
    expect(doc.page.width).toBe(2120)
    const els = Object.values(doc.elements).filter(
      (e): e is ElementInstance => e.name !== 'linker',
    )
    const minX = Math.min(...els.map((e) => e.props.x))
    const maxX = Math.max(...els.map((e) => e.props.x + e.props.w))
    // 平移 60 后内容中心 = (60 + 2060) / 2 = 1060（扩页后页面中心）
    expect((minX + maxX) / 2).toBeCloseTo(1060, 0)
  })
})
