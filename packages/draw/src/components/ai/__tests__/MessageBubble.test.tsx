import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessageBubble } from '../MessageBubble'
import type { ConversationMessage } from '../../../ai/types'

function makeMessage(overrides: Partial<ConversationMessage> = {}): ConversationMessage {
  return {
    id: 'msg-1',
    role: 'user',
    content: '请复刻这张图',
    images: [{ dataUrl: 'data:image/jpeg;base64,mockdata' }],
    timestamp: 0,
    ...overrides,
  }
}

function makeAssistantMessage(overrides: Partial<ConversationMessage> = {}): ConversationMessage {
  return {
    id: 'msg-ai',
    role: 'assistant',
    content: '',
    timestamp: 0,
    ...overrides,
  }
}

describe('MessageBubble 图片渲染', () => {
  it('用户消息带图片时渲染缩略图（新标签页可看原尺寸）', () => {
    render(<MessageBubble message={makeMessage()} />)
    const img = screen.getByAltText('消息图片 1')
    expect(img).toHaveAttribute('src', 'data:image/jpeg;base64,mockdata')
    expect(img.closest('a')).toHaveAttribute('target', '_blank')
  })

  it('纯图片消息（content 为空）也显示图片', () => {
    render(<MessageBubble message={makeMessage({ content: '' })} />)
    expect(screen.getByAltText('消息图片 1')).toBeInTheDocument()
  })

  it('无图片消息不渲染图片区', () => {
    render(<MessageBubble message={makeMessage({ images: undefined })} />)
    expect(screen.queryByAltText('消息图片 1')).not.toBeInTheDocument()
  })
})

describe('MessageBubble 流式生成中指示', () => {
  it('streaming 且思考过程已出、正文为空时，显示生成中 loading', () => {
    // 场景：reasoning 输出完毕后模型长时间生成 JSON 图形数据，
    // stripJsonBlocks 把正文剥成空串，UI 需给出 loading 而不是看起来卡死
    render(
      <MessageBubble
        message={makeAssistantMessage({ reasoning: '已确认所有 add_element 都有 refId。' })}
        streaming
      />,
    )
    expect(screen.getByTestId('generating-indicator')).toBeInTheDocument()
  })

  it('streaming 且正文已在输出时，不显示生成中 loading（打字机进行中）', () => {
    render(
      <MessageBubble
        message={makeAssistantMessage({ reasoning: '分析', content: '正在为您生成流程图' })}
        streaming
      />,
    )
    expect(screen.queryByTestId('generating-indicator')).not.toBeInTheDocument()
  })

  it('非 streaming（历史消息）不显示生成中 loading', () => {
    render(
      <MessageBubble message={makeAssistantMessage({ reasoning: '历史分析', content: '' })} />,
    )
    expect(screen.queryByTestId('generating-indicator')).not.toBeInTheDocument()
  })

  it('生成中指示使用高亮呼吸效果（主题色边框 + 脉动动画）', () => {
    render(
      <MessageBubble
        message={makeAssistantMessage({ reasoning: '分析中' })}
        streaming
      />,
    )
    const el = screen.getByTestId('generating-indicator')
    // 整框呼吸动画（不只是三个点），且高亮为主题色而非浅灰
    expect(el.style.animation).toContain('generatingPulse')
    // jsdom 将颜色序列化为 rgb() 格式（#007bff → rgb(0, 123, 255)）
    expect(el.style.borderColor).toBe('rgb(0, 123, 255)')
  })
})
