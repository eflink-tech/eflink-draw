// src/components/layout/RightToolbar.tsx
import { Settings, SlidersHorizontal, Sparkles } from 'lucide-react'
import { IconButton } from '@/components/common/IconButton'
import { useUIStore } from '@/store/uiStore'
import { AI_OPEN_SETTINGS } from '@/ai/events'

/**
 * 右侧竖排工具栏：贴窗口最右缘，收纳属性面板/AI 助手开关与 AI 设置入口。
 * - 始终渲染（专注模式下随 AppLayout 整体不渲染）
 * - 模板入口暂时隐藏：TemplateLibrary 与 AI_OPEN_TEMPLATES 事件链路保留，恢复时加回按钮即可
 */
export function RightToolbar() {
  const rightVisible = useUIStore((s) => s.rightPanelVisible)
  const aiVisible = useUIStore((s) => s.aiPanelVisible)

  return (
    <aside className="relative z-10 flex w-10 flex-shrink-0 flex-col items-center gap-1 border-l border-[#e0e0e0] bg-white py-2">
      <IconButton
        icon={<SlidersHorizontal size={16} />}
        title="属性面板"
        aria-label="属性面板"
        active={rightVisible}
        onClick={() => useUIStore.getState().toggleRightPanel()}
      />
      <IconButton
        icon={<Sparkles size={16} />}
        title="AI 助手"
        aria-label="AI 助手"
        active={aiVisible}
        onClick={() => useUIStore.getState().toggleAiPanel()}
      />
      <IconButton
        icon={<Settings size={16} />}
        title="AI 设置"
        aria-label="AI 设置"
        onClick={() => window.dispatchEvent(new CustomEvent(AI_OPEN_SETTINGS))}
      />
    </aside>
  )
}
