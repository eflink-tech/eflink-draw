// src/components/ai/AIAssistantRoot.tsx
import { useEffect, useRef, useState } from 'react'
import { SettingsPage } from './SettingsPage'
import { TemplateLibrary } from './TemplateLibrary'
import type { Template } from '@/ai/types'
import { AI_OPEN_SETTINGS, AI_OPEN_TEMPLATES, AI_TEMPLATE_SELECTED } from '@/ai/events'

/**
 * 模态覆盖层封装
 * - 统一 z-index / 背景 / ESC 关闭 / 点击背景关闭 行为
 * - role="dialog" + aria-modal 标注，打开时将焦点移入卡片便于键盘操作
 * - 内部 card 自带右上角 × 关闭按钮
 */
function Modal({
  open,
  onClose,
  children,
  cardClassName = '',
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  cardClassName?: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) cardRef.current?.focus()
  }, [open])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={`relative bg-white rounded-lg shadow-xl max-h-[80vh] overflow-auto p-4 outline-none ${cardClassName}`}
      >
        <button
          type="button"
          aria-label="关闭"
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 text-lg leading-none"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

/**
 * AI 助手根容器
 * - SettingsPage / TemplateLibrary 以模态覆盖层形式按需显示
 * - 通过 window CustomEvent 接收 TopBar 按钮触发
 * - ESC 键关闭任一已打开的模态
 * - AIChatPanel 由 AppLayout 作为 aiPanel 渲染
 */
export function AIAssistantRoot() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [templateOpen, setTemplateOpen] = useState(false)

  // 监听 TopBar 派发的打开事件
  useEffect(() => {
    const onOpenSettings = () => setSettingsOpen(true)
    const onOpenTemplates = () => setTemplateOpen(true)
    window.addEventListener(AI_OPEN_SETTINGS, onOpenSettings)
    window.addEventListener(AI_OPEN_TEMPLATES, onOpenTemplates)
    return () => {
      window.removeEventListener(AI_OPEN_SETTINGS, onOpenSettings)
      window.removeEventListener(AI_OPEN_TEMPLATES, onOpenTemplates)
    }
  }, [])

  // ESC 关闭模态（与 HotkeyDialog / PromptDialog 约定一致）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSettingsOpen(false)
        setTemplateOpen(false)
      }
    }
    if (settingsOpen || templateOpen) {
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }
  }, [settingsOpen, templateOpen])

  const handleTemplateSelect = (template: Template) => {
    setTemplateOpen(false)
    // 将模板 prompt 派发给 AIChatPanel，由其自动发送给 AI
    window.dispatchEvent(new CustomEvent(AI_TEMPLATE_SELECTED, { detail: template }))
  }

  return (
    <>
      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        cardClassName="max-w-lg w-full"
      >
        <SettingsPage />
      </Modal>
      <Modal
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        cardClassName="max-w-2xl w-full"
      >
        <TemplateLibrary onSelect={handleTemplateSelect} />
      </Modal>
    </>
  )
}
