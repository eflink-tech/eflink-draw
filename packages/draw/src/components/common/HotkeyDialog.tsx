// src/components/common/HotkeyDialog.tsx
// 快捷键分类弹窗（帮助→快捷键列表）。数据与 useEditorShortcuts 行为一致；
// Mac 显示 ⌘ 修饰，其余显示 Ctrl。
import { useEffect } from 'react'
import { useI18n } from '@eflink-tech/office-kit'

export interface HotkeyGroup {
  /** i18n 消息键，渲染时经 t() 解析 */
  group: string
  items: { desc: string; keys: string }[]
}

const IS_MAC =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
const MOD = IS_MAC ? '⌘' : 'Ctrl+'
const SHIFT = IS_MAC ? '⇧' : 'Shift+'

export const HOTKEY_GROUPS: HotkeyGroup[] = [
  {
    group: 'draw.menu.edit',
    items: [
      { desc: 'action.undo', keys: `${MOD}Z` },
      { desc: 'action.redo', keys: `${MOD}${SHIFT}Z / ${MOD}Y` },
      { desc: 'draw.hotkey.cutCopyPaste', keys: `${MOD}X / ${MOD}C / ${MOD}V` },
      { desc: 'draw.hotkey.duplicate', keys: `${MOD}D` },
      { desc: 'action.selectAll', keys: `${MOD}A` },
      { desc: 'action.delete', keys: 'Delete / Backspace' },
    ],
  },
  {
    group: 'draw.hotkey.text',
    items: [
      { desc: 'draw.hotkey.boldItalicUnderline', keys: `${MOD}B / ${MOD}I / ${MOD}U` },
      { desc: 'draw.edit.formatBrush', keys: `${MOD}${SHIFT}B` },
    ],
  },
  {
    group: 'draw.hotkey.layers',
    items: [
      { desc: 'draw.hotkey.frontBack', keys: `${MOD}] / ${MOD}[` },
      { desc: 'draw.hotkey.stepLayers', keys: IS_MAC ? `⌥] / ⌥[` : `Alt+] / Alt+[` },
    ],
  },
  {
    group: 'draw.menu.arrange',
    items: [
      { desc: 'draw.hotkey.lockUnlock', keys: `${MOD}L / ${MOD}${SHIFT}L` },
      { desc: 'draw.hotkey.groupUngroup', keys: `${MOD}G / ${MOD}${SHIFT}G` },
    ],
  },
  {
    group: 'draw.hotkey.tools',
    items: [
      { desc: 'draw.hotkey.textTool', keys: 'T' },
      { desc: 'draw.toolbar.linkerTool', keys: 'L' },
      { desc: 'draw.hotkey.panSpace', keys: 'Space' },
    ],
  },
  {
    group: 'draw.menu.view',
    items: [
      { desc: 'draw.hotkey.zoomInOut', keys: `${MOD}+ / ${MOD}-` },
      { desc: 'action.zoomReset', keys: `${MOD}0` },
      { desc: 'action.save', keys: `${MOD}S` },
    ],
  },
]

interface HotkeyDialogProps {
  onClose: () => void
}

export function HotkeyDialog({ onClose }: HotkeyDialogProps) {
  const { t } = useI18n()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[80vh] w-[380px] overflow-y-auto rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-[#333]">{t('draw.hotkey.title')}</span>
          <button
            type="button"
            className="rounded px-2 py-0.5 text-xs border border-[#ddd] hover:bg-gray-50"
            onClick={onClose}
          >
            {t('action.close')}
          </button>
        </div>
        {HOTKEY_GROUPS.map((g) => (
          <div key={g.group} className="mb-3">
            <div className="mb-1 text-[11px] font-medium text-[#999]">{t(g.group)}</div>
            {g.items.map((it) => (
              <div key={it.desc} className="flex items-center justify-between py-1 text-xs">
                <span className="text-[#333]">{t(it.desc)}</span>
                <span className="text-[11px] text-gray-400">{it.keys}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
