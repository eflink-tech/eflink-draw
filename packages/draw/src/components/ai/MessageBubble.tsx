// src/components/ai/MessageBubble.tsx
import { useEffect, useRef, useState } from 'react'
import type { ConversationMessage } from '../../ai/types'
import { ACCENT_COLOR } from './theme'

interface MessageBubbleProps {
  message: ConversationMessage
  /** 该消息是否正在流式接收中（用于显示生成中指示，历史消息不传） */
  streaming?: boolean
}

/**
 * 消息气泡：用户消息 + AI 回复
 * AI 回复的思考过程（reasoning）显示在正文上方，
 * 默认折叠为固定高度可滚动区域（自动滚动到最新内容），点击切换展开/折叠。
 */
export const MessageBubble = ({ message, streaming = false }: MessageBubbleProps) => {
  const isUser = message.role === 'user'
  const hasReasoning = !isUser && message.reasoning && message.reasoning.length > 0
  const hasContent = message.content && message.content.length > 0

  // 思考过程默认展开，流式期间自动滚动到底部显示最新内容
  const [reasoningExpanded, setReasoningExpanded] = useState(true)
  const reasoningScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!reasoningExpanded) return
    const el = reasoningScrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [message.reasoning, reasoningExpanded])

  // AI 流式期间：思考过程与正文都还没有时，显示一个"思考中"占位符
  const isThinkingEmpty = !isUser && !hasReasoning && !hasContent

  // 流式期间思考过程已出、可见正文仍为空：模型多半在生成被 stripJsonBlocks
  // 剥离的 JSON 图形数据（可能持续较久），显示 loading 避免看起来像卡死
  const isGeneratingQuietly = streaming && !isUser && hasReasoning && !hasContent

  // 展开状态下内容区最大高度
  const expandedMaxHeight = 240

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '12px',
      }}
    >
      {/* 思考过程区域：默认折叠，点击切换展开/折叠 */}
      {hasReasoning && (
        <div
          style={{
            marginBottom: '6px',
            backgroundColor: '#f7f9fc',
            border: '1px solid #e3e8ef',
            borderLeft: '3px solid #b8c2cc',
            borderRadius: '8px',
            maxWidth: '80%',
          }}
        >
          {/* 折叠/展开控制栏（始终单行显示） */}
          <button
            onClick={() => setReasoningExpanded((v) => !v)}
            style={{
              width: '100%',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#8a94a6',
              fontWeight: 500,
              letterSpacing: '0.3px',
              fontFamily: 'inherit',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#eef1f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <span style={{ fontSize: '14px' }}>{reasoningExpanded ? '▼' : '▶'}</span>
            <span> 思考过程</span>
          </button>

          {/* 内容区域：默认展开，固定高度滚动显示，流式期间自动跟随最新内容 */}
          <div
            ref={reasoningScrollRef}
            style={{
              display: reasoningExpanded ? 'block' : 'none',
              padding: '8px 12px 10px',
              fontSize: '12px',
              color: '#55606d',
              lineHeight: '1.7',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowY: 'auto',
              maxHeight: `${expandedMaxHeight}px`,
              borderTop: '1px solid #e3e8ef',
            }}
          >
            {message.reasoning}
          </div>
        </div>
      )}

      {/* 流式思考中占位：AI 回复尚未产生任何正文或 reasoning 时显示 */}
      {isThinkingEmpty && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#f7f9fc',
            border: '1px solid #e3e8ef',
            borderLeft: '3px solid #b8c2cc',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#8a94a6',
          }}
        >
          💭 思考中
          <span style={{ display: 'inline-flex', marginLeft: '4px' }}>
            <span style={{ animation: 'dotPulse 1.4s infinite', animationDelay: '0s' }}>.</span>
            <span style={{ animation: 'dotPulse 1.4s infinite', animationDelay: '0.2s' }}>.</span>
            <span style={{ animation: 'dotPulse 1.4s infinite', animationDelay: '0.4s' }}>.</span>
          </span>
        </div>
      )}

      {/* 流式正文迟迟未呈现时的生成中指示（位于思考过程框下方，高亮呼吸） */}
      {isGeneratingQuietly && (
        <div
          data-testid="generating-indicator"
          role="status"
          aria-live="polite"
          style={{
            padding: '8px 14px',
            backgroundColor: '#f0f7ff',
            border: `1px solid ${ACCENT_COLOR}`,
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 500,
            color: ACCENT_COLOR,
            display: 'flex',
            alignItems: 'center',
            marginBottom: '6px',
            width: 'fit-content',
            animation: 'generatingPulse 2.4s ease-in-out infinite',
          }}
        >
          正在生成
          <span style={{ display: 'inline-flex', marginLeft: '4px' }}>
            <span style={{ animation: 'dotPulse 1.4s infinite', animationDelay: '0s' }}>.</span>
            <span style={{ animation: 'dotPulse 1.4s infinite', animationDelay: '0.2s' }}>.</span>
            <span style={{ animation: 'dotPulse 1.4s infinite', animationDelay: '0.4s' }}>.</span>
          </span>
        </div>
      )}

      {/* 用户消息携带的图片（截图/上传），点击新标签页看原尺寸 */}
      {message.images && message.images.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            maxWidth: '80%',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: '6px',
          }}
        >
          {message.images.map((img, i) => (
            <a key={i} href={img.dataUrl} target="_blank" rel="noreferrer">
              <img
                src={img.dataUrl}
                alt={`消息图片 ${i + 1}`}
                style={{
                  maxHeight: '120px',
                  maxWidth: '200px',
                  borderRadius: '8px',
                  display: 'block',
                  border: '1px solid #e0e0e0',
                }}
              />
            </a>
          ))}
        </div>
      )}

      {/* 消息正文气泡 */}
      {hasContent && (
        <div
          style={{
            maxWidth: '80%',
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: isUser ? '#f0f0f0' : '#007bff',
            color: isUser ? '#333' : '#fff',
            wordBreak: 'break-word',
            fontSize: '14px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
          }}
        >
          {message.content}
        </div>
      )}
    </div>
  )
}
