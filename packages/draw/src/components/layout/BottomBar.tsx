// src/components/layout/BottomBar.tsx
import { useState } from 'react'
import { Minus, Plus, LocateFixed, Expand, ChevronDown, Pencil } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { useUIStore } from '@/store/uiStore'
import { effectivePageSize } from '@/core/editor/grid'
import { MenuDropdown } from '@/components/common/MenuDropdown'
import { PromptDialog } from '@/components/common/PromptDialog'

/** Mac 平台判定（快捷键显示用）：优先 userAgentData.platform，回退 userAgent */
const IS_MAC =
  typeof navigator !== 'undefined' &&
  (/(Mac|iOS)/.test((navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? '') || /Mac|iPhone|iPad/.test(navigator.userAgent))

/** 修饰键快捷键显示：Mac → ⌘<key>，其余 → Ctrl+<key>（shift 时加 ⇧ / Shift+） */
function shortcutText(key: string, shift = false): string {
  return IS_MAC ? `${shift ? '⇧' : ''}⌘${key}` : `${shift ? 'Shift+' : ''}Ctrl+${key}`
}

/** 缩放档位（与 TopBar「视图」菜单一致） */
const ZOOM_LEVELS = [0.5, 0.75, 1, 1.5, 2]

export function BottomBar() {
  const viewport = useEditorStore((s) => s.viewport)
  const updateViewport = useEditorStore((s) => s.updateViewport)
  const document = useEditorStore((s) => s.document)
  const isDirty = useEditorStore((s) => s.isDirty)
  const elementCount = Object.keys(document.elements).length

  const focusMode = useUIStore((s) => s.focusMode)
  const setFocusMode = useUIStore((s) => s.setFocusMode)
  const [zoomOpen, setZoomOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const fileTitle = document.page.title ?? '未命名图表'

  const zoomPercent = Math.round(viewport.scale * 100)

  const handleZoom = (newScale: number) => {
    // 四舍五入到最近的 5%
    const rounded = Math.round(newScale * 20) / 20
    const clamped = Math.max(0.25, Math.min(4, rounded))
    updateViewport({ scale: clamped })
  }

  const zoomMenuItems = [
    ...ZOOM_LEVELS.map((v) => ({
      label: `${Math.round(v * 100)}%`,
      checked: Math.abs(viewport.scale - v) < 1e-6,
      onClick: () => updateViewport({ scale: v }),
    })),
    { divider: true },
    { label: '重置缩放', shortcut: shortcutText('0'), onClick: () => updateViewport({ scale: 1 }) },
  ]

  return (
    <div className="relative z-10 h-7 bg-[#f8f8f8] border-t border-[#e0e0e0] shadow-[0_-3px_10px_rgba(0,0,0,0.08)] flex items-center justify-between px-3 text-[11px] text-[#888] select-none">
      {/* 左侧信息 */}
      <div className="flex items-center gap-4">
        <button
          className="flex items-center gap-1 px-1.5 py-0.5 -mx-1.5 rounded hover:bg-[#e8e8e8] transition-colors text-[#333] max-w-[200px]"
          onClick={() => setRenameOpen(true)}
          title="点击重命名文件"
        >
          <Pencil size={11} className="flex-shrink-0 text-[#999]" />
          <span className="truncate">{fileTitle}</span>
        </button>
        <span>图形: {elementCount}</span>
        <span>页面: {effectivePageSize(document.page).width}×{effectivePageSize(document.page).height}</span>
        <span className={isDirty ? 'text-orange-500' : ''}>
          {isDirty ? '● 未保存' : '✓ 已保存'}
        </span>
      </div>

      {/* 右侧缩放控件 */}
      <div className="flex items-center gap-2">
        <button
          className="p-0.5 hover:bg-[#e0e0e0] rounded transition-colors"
          onClick={() => handleZoom(viewport.scale - 0.05)}
          title="缩小"
        >
          <Minus size={14} />
        </button>
        <input
          type="range"
          min={25}
          max={400}
          value={zoomPercent}
          onChange={(e) => handleZoom(Number(e.target.value) / 100)}
          className="w-28 h-1 accent-blue-500 cursor-pointer"
          title="缩放滑块"
        />
        <button
          className="p-0.5 hover:bg-[#e0e0e0] rounded transition-colors"
          onClick={() => handleZoom(viewport.scale + 0.05)}
          title="放大"
        >
          <Plus size={14} />
        </button>
        <MenuDropdown
          label={
            <span className="flex items-center gap-0.5 tabular-nums">
              <span className="w-10 text-center">{zoomPercent}%</span>
              <ChevronDown size={10} className="text-[#aaa]" />
            </span>
          }
          items={zoomMenuItems}
          open={zoomOpen}
          onOpenChange={setZoomOpen}
          minWidth={120}
          placement="top"
        />
        <button
          className="p-0.5 hover:bg-[#e0e0e0] rounded transition-colors"
          onClick={() => updateViewport({ scale: 1 })}
          title="重置缩放"
        >
          <LocateFixed size={14} />
        </button>
        <div className="w-px h-4 bg-[#e0e0e0] mx-1" />
        <button
          className="p-0.5 hover:bg-[#e0e0e0] rounded transition-colors"
          onClick={() => setFocusMode(!focusMode)}
          title={focusMode ? '退出专注模式 (Esc)' : '进入专注模式'}
        >
          <Expand size={14} />
        </button>
      </div>
      {/* 重命名浮层 */}
      {renameOpen && (
        <PromptDialog
          title="重命名文件"
          defaultValue={fileTitle}
          onSubmit={(v) => {
            const trimmed = v.trim()
            if (trimmed) useEditorStore.getState().updatePage({ title: trimmed })
            setRenameOpen(false)
          }}
          onCancel={() => setRenameOpen(false)}
        />
      )}
    </div>
  )
}
