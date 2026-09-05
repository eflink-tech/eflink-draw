// src/components/common/HotkeyDialog.tsx
// 快捷键分类弹窗（帮助→快捷键列表）。数据与 useEditorShortcuts 行为一致；
// Mac 显示 ⌘ 修饰，其余显示 Ctrl。
import { useEffect } from 'react'

export interface HotkeyGroup {
  group: string
  items: { desc: string; keys: string }[]
}

const IS_MAC =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
const MOD = IS_MAC ? '⌘' : 'Ctrl+'
const SHIFT = IS_MAC ? '⇧' : 'Shift+'

export const HOTKEY_GROUPS: HotkeyGroup[] = [
  {
    group: '编辑',
    items: [
      { desc: '撤销', keys: `${MOD}Z` },
      { desc: '重做', keys: `${MOD}${SHIFT}Z / ${MOD}Y` },
      { desc: '剪切 / 复制 / 粘贴', keys: `${MOD}X / ${MOD}C / ${MOD}V` },
      { desc: '复制副本', keys: `${MOD}D` },
      { desc: '全选', keys: `${MOD}A` },
      { desc: '删除', keys: 'Delete / Backspace' },
    ],
  },
  {
    group: '文字',
    items: [
      { desc: '加粗 / 斜体 / 下划线', keys: `${MOD}B / ${MOD}I / ${MOD}U` },
      { desc: '格式刷', keys: `${MOD}${SHIFT}B` },
    ],
  },
  {
    group: '层级',
    items: [
      {
        desc: '置于顶层 / 底层',
        keys: `${MOD}] / ${MOD}[`,
      },
      {
        desc: '上移 / 下移一层',
        keys: IS_MAC ? `⌥] / ⌥[` : `Alt+] / Alt+[`,
      },
    ],
  },
  {
    group: '排列',
    items: [
      { desc: '锁定 / 解锁', keys: `${MOD}L / ${MOD}${SHIFT}L` },
      { desc: '组合 / 取消组合', keys: `${MOD}G / ${MOD}${SHIFT}G` },
    ],
  },
  {
    group: '工具',
    items: [
      { desc: '文本工具', keys: 'T' },
      { desc: '连线工具', keys: 'L' },
      { desc: '空格平移（松开进文字编辑）', keys: 'Space' },
    ],
  },
  {
    group: '视图',
    items: [
      { desc: '放大 / 缩小', keys: `${MOD}+ / ${MOD}-` },
      { desc: '重置缩放', keys: `${MOD}0` },
      { desc: '保存', keys: `${MOD}S` },
    ],
  },
]

interface HotkeyDialogProps {
  onClose: () => void
}

export function HotkeyDialog({ onClose }: HotkeyDialogProps) {
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
          <span className="text-sm font-medium text-[#333]">快捷键列表</span>
          <button
            type="button"
            className="rounded px-2 py-0.5 text-xs border border-[#ddd] hover:bg-gray-50"
            onClick={onClose}
          >
            关闭
          </button>
        </div>
        {HOTKEY_GROUPS.map((g) => (
          <div key={g.group} className="mb-3">
            <div className="mb-1 text-[11px] font-medium text-[#999]">{g.group}</div>
            {g.items.map((it) => (
              <div key={it.desc} className="flex items-center justify-between py-1 text-xs">
                <span className="text-[#333]">{it.desc}</span>
                <span className="text-[11px] text-gray-400">{it.keys}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
