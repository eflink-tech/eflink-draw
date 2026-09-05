// src/components/menus/ContextMenu.tsx
// 通用右键菜单容器：绝对定位（x/y 屏幕坐标）、视口翻转、Esc/外部点击关闭
// 复用 MenuDropdown 的 MenuNode 数据结构与项渲染样式
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import type { MenuNode } from '@/components/common/MenuDropdown'

interface ContextMenuProps {
  open: boolean
  /** 屏幕坐标（鼠标位置） */
  x: number
  y: number
  items: MenuNode[]
  onClose: () => void
}

export function ContextMenu({ open, x, y, items, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x, y })

  // 视口翻转：超出右/下边界时左/上展开
  useLayoutEffect(() => {
    if (!open) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    let nx = x
    let ny = y
    if (x + rect.width > window.innerWidth) nx = window.innerWidth - rect.width - 4
    if (y + rect.height > window.innerHeight) ny = window.innerHeight - rect.height - 4
    setPos({ x: Math.max(4, nx), y: Math.max(4, ny) })
  }, [open, x, y])

  // Esc / 外部点击关闭
  useEffect(() => {
    if (!open) return
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const renderItem = (node: MenuNode, i: number): ReactNode => {
    if (node.divider) return <div key={i} className="my-1 border-t border-[#eee]" />
    return (
      <button
        key={i}
        type="button"
        disabled={node.disabled}
        className="flex w-full items-center justify-between gap-4 px-4 py-1.5 text-left text-xs whitespace-nowrap text-[#333] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => {
          node.onClick?.()
          onClose()
        }}
      >
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 shrink-0">
            {node.checked === true && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6.5L4.5 9L10 3.5" stroke="#4a7fde" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          {node.icon}
          <span>{node.label}</span>
        </span>
        {node.shortcut && <span className="text-[10px] text-gray-400">{node.shortcut}</span>}
      </button>
    )
  }

  return (
    <div
      ref={ref}
      className="fixed z-[100] py-1 bg-white border border-gray-200 rounded-lg shadow-lg"
      style={{ left: pos.x, top: pos.y, minWidth: 168 }}
    >
      {items.map(renderItem)}
    </div>
  )
}
