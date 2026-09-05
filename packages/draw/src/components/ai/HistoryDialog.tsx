// src/components/ai/HistoryDialog.tsx
// 历史对话列表面板：展示 IndexedDB 中的对话记录，支持选择加载与删除。
import { useCallback, useEffect, useState } from 'react'
import { conversationStore } from '../../ai/db'
import type { Conversation } from '../../ai/types'

interface HistoryDialogProps {
  /** 当前正在浏览的对话 id（高亮显示） */
  currentId: string | null
  /** 用户点击某条对话时回调（由父组件加载消息） */
  onSelect: (conversationId: string) => void
  onClose: () => void
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return '读取历史对话失败'
}

export function HistoryDialog({ currentId, onSelect, onClose }: HistoryDialogProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 拉取列表；setState 仅出现在 Promise 回调（effect 触发但不同步执行）
  const loadConversations = useCallback(
    () =>
      conversationStore
        .listConversations()
        .then((list) => {
          setConversations(list)
          setError(null)
        })
        .catch((err: unknown) => {
          setError(getErrorMessage(err))
        })
        .finally(() => {
          setLoading(false)
        }),
    [],
  )

  useEffect(() => {
    void loadConversations()
  }, [loadConversations])

  const handleDelete = (conversationId: string) => {
    setLoading(true)
    conversationStore
      .deleteConversation(conversationId)
      .then(loadConversations)
      .catch((err: unknown) => {
        setError(getErrorMessage(err))
        setLoading(false)
      })
  }

  const listItemStyle = (active: boolean): React.CSSProperties => ({
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '8px 10px',
    border: 'none',
    borderBottom: '1px solid #eee',
    backgroundColor: active ? '#e7f1ff' : 'transparent',
    cursor: 'pointer',
    fontSize: '13px',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          borderBottom: '1px solid #eee',
        }}
      >
        <strong style={{ fontSize: '13px' }}>历史对话</strong>
        <button type="button" aria-label="关闭历史" onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
          ✕
        </button>
      </div>

      <div role="list" style={{ flex: 1, overflowY: 'auto' }}>
        {loading && <div style={{ padding: '12px', color: '#999', fontSize: '13px' }}>加载中...</div>}
        {error && (
          <div role="alert" style={{ padding: '12px', color: '#b00', fontSize: '12px' }}>
            {error}
          </div>
        )}
        {!loading && !error && conversations.length === 0 && (
          <div style={{ padding: '16px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
            暂无历史对话
          </div>
        )}
        {conversations.map((conv) => (
          <div key={conv.id} role="listitem" style={{ position: 'relative' }}>
            <button type="button" style={listItemStyle(conv.id === currentId)} onClick={() => onSelect(conv.id)}>
              <span style={{ fontWeight: 500 }}>{conv.title || '未命名对话'}</span>
              <br />
              <span style={{ color: '#888', fontSize: '11px' }}>
                {new Date(conv.updatedAt).toLocaleString()} · {conv.messages.length} 条消息
              </span>
            </button>
            <button
              type="button"
              aria-label={`删除对话 ${conv.title || conv.id}`}
              onClick={() => handleDelete(conv.id)}
              style={{
                position: 'absolute',
                top: '6px',
                right: '4px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#c66',
                fontSize: '13px',
              }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
