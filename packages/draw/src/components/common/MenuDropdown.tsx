// src/components/common/MenuDropdown.tsx
// 通用下拉菜单（菜单栏/工具栏共用）：
// - 顶级菜单项（label 触开合）+ 分隔线 + 禁用态 + 快捷键 + 勾选态
// - 二级子菜单（hover 展开，右侧 ▸ 指示）与自定义内容面板（如色板）
// - 支持受控 open/onOpenChange（菜单栏多菜单互斥）；不传时内部自管
import { useEffect, useRef, useState, type ReactNode } from 'react'

export interface MenuNode {
  /** 显示文本；divider 项可省略 */
  label?: string
  shortcut?: string
  icon?: ReactNode
  disabled?: boolean
  /** true/false 均渲染占位对勾列（对齐宽度）；语义=是否打对勾 */
  checked?: boolean
  /** 分隔线（渲染为横线，忽略其余字段） */
  divider?: boolean
  onClick?: () => void
  /** 二级子菜单 */
  children?: MenuNode[]
  /** 自定义次级面板（优先级高于 children），如 ColorGrid */
  content?: ReactNode
}

interface MenuDropdownProps {
  label: ReactNode
  items: MenuNode[]
  /** 受控打开态；不传则内部自管 */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** 鼠标悬停标签时打开（菜单栏 hover 切换用） */
  openOnHover?: boolean
  /** 下拉面板最小宽度 */
  minWidth?: number
  /** 面板展开方向：bottom=向下（默认），top=向上（底部栏等贴近视口下边缘时用） */
  placement?: 'bottom' | 'top'
}

/** 子菜单关闭延迟（ms）：鼠标从父项移动到次级面板的过渡时间 */
const SUBMENU_DELAY = 140

export function MenuDropdown({
  label,
  items,
  open: openProp,
  onOpenChange,
  openOnHover = false,
  minWidth = 168,
  placement = 'bottom',
}: MenuDropdownProps) {
  const [openInternal, setOpenInternal] = useState(false)
  const open = openProp ?? openInternal
  const setOpen = (v: boolean) => {
    if (openProp === undefined) setOpenInternal(v)
    onOpenChange?.(v)
  }

  const rootRef = useRef<HTMLDivElement>(null)
  const [activeSub, setActiveSub] = useState<number | null>(null)
  const subTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const close = () => {
    setOpen(false)
    setActiveSub(null)
  }

  const handleItemClick = (node: MenuNode) => {
    node.onClick?.()
    close()
  }

  const openSub = (i: number) => {
    if (subTimer.current) clearTimeout(subTimer.current)
    setActiveSub(i)
  }
  const closeSubSoon = () => {
    if (subTimer.current) clearTimeout(subTimer.current)
    subTimer.current = setTimeout(() => setActiveSub(null), SUBMENU_DELAY)
  }
  const cancelSubClose = () => {
    if (subTimer.current) clearTimeout(subTimer.current)
  }

  // 打开期间：外部 mousedown / Esc 关闭（Esc 拦截避免与全局快捷键链冲突）
  useEffect(() => {
    if (!open) return
    const onMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKey)
    }
    // open 变化重绑即可；close/setOpen 随渲染最新
  }, [open])

  // 任何关闭路径（外部点击/标签切换/受控关闭）都清空子菜单展开态
  useEffect(() => {
    if (!open) setActiveSub(null)
  }, [open])

  return (
    <div className="relative inline-flex" ref={rootRef}>
      <button
        type="button"
        className={`px-2.5 py-1 text-xs rounded cursor-pointer ${
          open ? 'bg-[#e0e0e0] text-[#333]' : 'text-[#555] hover:bg-[#e0e0e0]'
        }`}
        onMouseEnter={() => openOnHover && !open && setOpen(true)}
        onClick={() => setOpen(!open)}
      >
        {label}
      </button>

      {open && (
        <div
          className={`absolute left-0 z-50 py-1 bg-white border border-gray-200 rounded-lg shadow-lg ${
            placement === 'top' ? 'bottom-full mb-0.5' : 'top-full mt-0.5'
          }`}
          style={{ minWidth, maxHeight: '80vh', overflowY: 'auto' }}
          onMouseLeave={closeSubSoon}
        >
          {items.map((item, i) => {
            if (item.divider) {
              return <div key={i} className="my-1 border-t border-[#eee]" />
            }
            const sub = item.children || item.content
            return (
              <div key={i} className="relative">
                <div onMouseEnter={() => sub && openSub(i)} onMouseLeave={closeSubSoon}>
                  <button
                    type="button"
                    disabled={item.disabled}
                    className="flex w-full items-center justify-between gap-4 px-4 py-1.5 text-left text-xs whitespace-nowrap text-[#333] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => !sub && handleItemClick(item)}
                  >
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-3 shrink-0">
                        {item.checked === true && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2 6.5L4.5 9L10 3.5"
                              stroke="#4a7fde"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      {item.shortcut && (
                        <span className="text-[10px] text-gray-400">{item.shortcut}</span>
                      )}
                      {sub && <span className="text-gray-400">▸</span>}
                    </span>
                  </button>
                </div>

                {/* 二级子菜单：右侧展开 */}
                {sub && activeSub === i && (
                  <div
                    className="absolute left-full top-[-5px] ml-0.5 z-50 py-1 bg-white border border-gray-200 rounded-lg shadow-lg"
                    style={{ minWidth }}
                    onMouseEnter={cancelSubClose}
                    onMouseLeave={closeSubSoon}
                  >
                    {item.content ? (
                      item.content
                    ) : (
                      (item.children ?? []).map((child, j) => {
                        if (child.divider) {
                          return <div key={j} className="my-1 border-t border-[#eee]" />
                        }
                        return (
                          <button
                            key={j}
                            type="button"
                            disabled={child.disabled}
                            className="flex w-full items-center justify-between gap-4 px-4 py-1.5 text-left text-xs whitespace-nowrap text-[#333] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            onClick={() => handleItemClick(child)}
                          >
                            <span className="flex items-center gap-2">
                              <span className="inline-block w-3 shrink-0">
                                {child.checked === true && (
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path
                                      d="M2 6.5L4.5 9L10 3.5"
                                      stroke="#4a7fde"
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </span>
                              {child.icon}
                              <span>{child.label}</span>
                            </span>
                            {child.shortcut && (
                              <span className="text-[10px] text-gray-400">{child.shortcut}</span>
                            )}
                          </button>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}