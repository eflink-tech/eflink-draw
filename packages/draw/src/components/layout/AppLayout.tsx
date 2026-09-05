// src/components/layout/AppLayout.tsx
import type { ReactNode } from 'react'
import { Shrink } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { RightToolbar } from './RightToolbar'
import { ContextMenu } from '@/components/menus/ContextMenu'
import { useContextMenu } from '@/components/menus/useContextMenu'

interface AppLayoutProps {
  topBar: ReactNode
  leftPanel: ReactNode
  canvas: ReactNode
  rightPanel: ReactNode
  bottomBar: ReactNode
  aiPanel?: ReactNode
}

/**
 * 主布局容器：TopBar + 中间三栏 + BottomBar
 * 中间区域从左到右：左面板 → 画布 → 属性面板(260px) → AI 面板(380px) → 竖排工具栏(40px)
 */
export function AppLayout({ topBar, leftPanel, canvas, rightPanel, bottomBar, aiPanel }: AppLayoutProps) {
  const leftVisible = useUIStore((s) => s.leftPanelVisible)
  const rightVisible = useUIStore((s) => s.rightPanelVisible)
  const aiVisible = useUIStore((s) => s.aiPanelVisible)
  const focusMode = useUIStore((s) => s.focusMode)
  const setFocusMode = useUIStore((s) => s.setFocusMode)
  const ctxMenu = useContextMenu()

  // 专注模式：仅画布占满窗口，隐藏顶/底栏与左右面板；右上角浮动退出按钮
  if (focusMode) {
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f5f5f5]">
        <main className="relative flex-1 overflow-hidden bg-[#e8e8e8]">
          {canvas}
          <button
            className="absolute right-3 top-3 z-50 flex items-center gap-1.5 rounded-md border border-[#d5d5d5] bg-white px-2.5 py-1.5 text-xs text-[#555] shadow-md hover:bg-[#f0f0f0]"
            onClick={() => setFocusMode(false)}
            title="退出专注模式 (Esc)"
          >
            <Shrink size={14} />
            <span>退出专注</span>
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f5f5f5]">
      {/* 顶部栏 */}
      {topBar}

      {/* 中间区域 */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* 左侧面板（阴影投向画布；relative z-10 防止被 main 背景覆盖） */}
        {leftVisible && (
          <aside className="relative z-10 w-[220px] flex-shrink-0 border-r border-[#e0e0e0] bg-[#fafafa] overflow-y-auto shadow-[4px_0_10px_rgba(0,0,0,0.08)]">
            {leftPanel}
          </aside>
        )}

        {/* 画布区域 */}
        <main className="flex-1 overflow-hidden bg-[#e8e8e8]">
          {canvas}
        </main>

        {/* 右侧面板 */}
        {rightVisible && (
          <aside className="relative z-10 w-[260px] flex-shrink-0 border-l border-[#e0e0e0] bg-[#fafafa] overflow-y-auto shadow-[-4px_0_10px_rgba(0,0,0,0.08)]">
            {rightPanel}
          </aside>
        )}

        {/* AI 助手面板（始终挂载以保留状态，通过 display 控制显示/隐藏） */}
        <aside
          className="relative z-10 flex-shrink-0 border-l border-[#e0e0e0] bg-[#fafafa] overflow-y-auto shadow-[-4px_0_10px_rgba(0,0,0,0.08)]"
          style={{
            width: aiVisible ? '380px' : '0px',
            display: aiVisible ? 'block' : 'none',
          }}
        >
          {aiPanel}
        </aside>

        {/* 右侧竖排工具栏（始终贴窗口最右缘） */}
        <RightToolbar />
      </div>

      {/* 底部状态栏 */}
      {bottomBar}

      {/* 右键菜单 */}
      <ContextMenu open={ctxMenu.open} x={ctxMenu.x} y={ctxMenu.y} items={ctxMenu.items} onClose={ctxMenu.onClose} />
    </div>
  )
}
