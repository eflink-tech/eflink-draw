// src/components/layout/TopBar.tsx
import { useState, useRef, useEffect } from 'react'
import {
  Undo2, Redo2, Bold, Italic, Underline,
  Paintbrush as FormatBrush, Lock, Unlock, Link2, ArrowLeft, Share2,
} from 'lucide-react'
import { IconButton } from '@/components/common/IconButton'
import { Tooltip } from '@/components/common/Tooltip'
import { ColorPicker } from '@/components/common/ColorPicker'
import { LineStyleDropdown } from '@/components/common/LineStyleDropdown'
import { LineTypeDropdown } from '@/components/common/LineTypeDropdown'
import { ArrowStyleDropdown } from '@/components/common/ArrowStyleDropdown'
import { MenuDropdown } from '@/components/common/MenuDropdown'
import { useUIStore } from '@/store/uiStore'
import { useEditorStore } from '@/store/editorStore'
import { isLinker, type ArrowStyle, type ElementInstance, type LinkerInstance } from '@/types'
import { PromptDialog } from '@/components/common/PromptDialog'
import { ExportImage, EXPORT_EVENT } from '@/components/export/ExportImage'
import { HotkeyDialog } from '@/components/common/HotkeyDialog'
import { parseDocumentFile, buildExportFileNameEfd, serializeDocumentFile, triggerDownload } from '@/core/editor/fileOps'
import { applyLayerAction } from '@/core/editor/layerAction'
import { getLinkerPoints } from '@/core/editor/linker'
import { makeStoreRectGetter } from '@/core/editor/interaction'
import logoUrl from '@/assets/draw-eflink-logo.png'
import { getEditorBackHref } from '@/core/editor/chrome'
import { ShareDialog } from './ShareDialog'
import { getDrawShareHandler } from '@/core/share/shareBridge'
import type { DocumentData } from '@/types'

/** Mac 平台判定（快捷键显示用；行为层兼容见 Canvas.tsx 的 metaKey） */
const IS_MAC =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

/** 修饰键快捷键显示：Mac → ⌘Z / ⇧⌘]，其余 → Ctrl+Z / Ctrl+Shift+] */
function shortcutText(key: string, shift = false): string {
  return IS_MAC ? `${shift ? '⇧' : ''}⌘${key}` : `${shift ? 'Shift+' : ''}Ctrl+${key}`
}

/** 层级快捷键：⌘]/⌘[ 置顶置底；⌥]/⌥[ 上移下移（Mac 兼容） */
function layerShortcutText(key: string, step = false): string {
  if (step) {
    return IS_MAC ? `⌥${key}` : `Alt+${key}`
  }
  return IS_MAC ? `⌘${key}` : `Ctrl+${key}`
}

/** 下拉菜单项 */
interface MenuItem {
  label: string
  shortcut?: string
  onClick: () => void
  disabled?: boolean
  icon?: React.ReactNode
}

/** 填充颜色按钮（油漆桶图标，截图效果） */
function FillColorButton({
  value,
  onSelect,
  disabled = false,
}: {
  value: string | null
  onSelect: (rgb: string | null) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  return (
    <Tooltip text="填充颜色" disabled={disabled}>
      <div className="relative inline-block">
      <button
        ref={btnRef}
        disabled={disabled}
        /* open 时红框+浅红底，标明是哪个按钮拉下的面板 */
        className={`inline-flex items-center border rounded transition-colors cursor-pointer disabled:opacity-50 ${
          open ? 'border-[#833] bg-[#fde8e8]' : 'border-[#ccc] bg-white hover:border-[#833]'
        }`}
        style={{ width: 42, height: 24 }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
      >
        {/* 左侧油漆桶图标 */}
        <div className="flex-1 h-full flex items-center justify-center px-[2px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            {/* 桶身 */}
            <path
              d="M4 7L5.5 13H11.5L13 7H4Z"
              fill={value ? `rgb(${value})` : 'transparent'}
              stroke="#555"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* 桶口 */}
            <line x1="3.5" y1="7" x2="13.5" y2="7" stroke="#555" strokeWidth="1.2" />
            {/* 提手 */}
            <path
              d="M6 7V4.5C6 3.5 7 2.5 8 2.5C9 2.5 10 3.5 10 4.5V7"
              stroke="#555"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            {/* 滴落的颜料 */}
            <circle cx="8" cy="14.5" r="1" fill={value ? `rgb(${value})` : '#555'} />
          </svg>
        </div>
        {/* 右侧下拉箭头 */}
        <div className="flex items-center justify-center w-[16px] h-full border-l border-[#ddd] bg-[#f0f0f0]">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M2 3L4 5.5L6 3" stroke="#666" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
      {open && (
        <ColorPicker
          value={value}
          onSelect={(rgb) => {
            onSelect(rgb)
            setOpen(false)
          }}
          onLiveSelect={onSelect}
          transparent={true}
          anchorRef={btnRef}
          onClose={() => setOpen(false)}
        />
      )}
      </div>
    </Tooltip>
  )
}

/** 文本颜色按钮（带下划线A） */
function TextColorButton({
  value,
  onSelect,
  disabled = false,
}: {
  value: string | null
  onSelect: (rgb: string | null) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  return (
    <Tooltip text="文本颜色" disabled={disabled}>
      <div className="relative inline-block">
      <button
        ref={btnRef}
        disabled={disabled}
        /* open 时红框+浅红底，标明是哪个按钮拉下的面板 */
        className={`inline-flex items-center border rounded transition-colors cursor-pointer disabled:opacity-50 ${
          open ? 'border-[#833] bg-[#fde8e8]' : 'border-[#ccc] bg-white hover:border-[#833]'
        }`}
        style={{ width: 42, height: 24 }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
      >
        {/* 左侧带下划线A图标 */}
        <div className="flex-1 h-full flex items-center justify-center px-[2px]">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <text
              x="8"
              y="11"
              textAnchor="middle"
              fontSize="12"
              fontFamily="Arial"
              fill="#333"
              fontWeight="bold"
            >
              A
            </text>
            <line
              x1="2"
              y1="14"
              x2="14"
              y2="14"
              stroke={value ? `rgb(${value})` : '#333'}
              strokeWidth="2"
            />
          </svg>
        </div>
        {/* 右侧下拉箭头 */}
        <div className="flex items-center justify-center w-[16px] h-full border-l border-[#ddd] bg-[#f0f0f0]">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M2 3L4 5.5L6 3" stroke="#666" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
      {open && (
        <ColorPicker
          value={value}
          onSelect={(rgb) => {
            onSelect(rgb)
            setOpen(false)
          }}
          onLiveSelect={onSelect}
          transparent={false}
          anchorRef={btnRef}
          onClose={() => setOpen(false)}
        />
      )}
      </div>
    </Tooltip>
  )
}

/** 线条颜色按钮（边框线条图标） */
function LineColorButton({
  value,
  onSelect,
  disabled = false,
}: {
  value: string | null
  onSelect: (rgb: string | null) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  return (
    <Tooltip text="线条颜色" disabled={disabled}>
      <div className="relative inline-block">
      <button
        ref={btnRef}
        disabled={disabled}
        /* open 时红框+浅红底，标明是哪个按钮拉下的面板 */
        className={`inline-flex items-center border rounded transition-colors cursor-pointer disabled:opacity-50 ${
          open ? 'border-[#833] bg-[#fde8e8]' : 'border-[#ccc] bg-white hover:border-[#833]'
        }`}
        style={{ width: 42, height: 24 }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
      >
        {/* 左侧线条图标（矩形边框） */}
        <div className="flex-1 h-full flex items-center justify-center px-[2px]">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect
              x="3"
              y="3"
              width="10"
              height="10"
              fill="transparent"
              stroke={value ? `rgb(${value})` : '#666'}
              strokeWidth="1.5"
            />
          </svg>
        </div>
        {/* 右侧下拉箭头 */}
        <div className="flex items-center justify-center w-[16px] h-full border-l border-[#ddd] bg-[#f0f0f0]">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M2 3L4 5.5L6 3" stroke="#666" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
      {open && (
        <ColorPicker
          value={value}
          onSelect={(rgb) => {
            onSelect(rgb)
            setOpen(false)
          }}
          onLiveSelect={onSelect}
          transparent={false}
          anchorRef={btnRef}
          onClose={() => setOpen(false)}
        />
      )}
      </div>
    </Tooltip>
  )
}

/** 层级下拉组件（分体式按钮，参考颜色填充按钮效果） */
function LayerDropdown({ items, disabled = false }: {
  items: MenuItem[]
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  // ref 挂在包裹 div 上（同 LineStyleDropdown）：菜单项点击不被外部关闭吞掉
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <Tooltip text="层级排列" disabled={disabled}>
    <div className="relative inline-block" ref={rootRef}>
      <button
        disabled={disabled}
        /* open 时红框+浅红底，标明是哪个按钮拉下的面板 */
        className={`inline-flex items-center border rounded transition-colors cursor-pointer disabled:opacity-50 ${
          open ? 'border-[#833] bg-[#fde8e8]' : 'border-[#ccc] bg-white hover:border-[#833]'
        }`}
        style={{ width: 42, height: 24 }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
      >
        {/* 左侧层叠方块图标 */}
        <div className="flex-1 h-full flex items-center justify-center px-[2px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3L3 6L8 9L13 6L8 3Z" fill="#333" />
            <path d="M3 8L8 11L13 8" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 10L8 13L13 10" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* 右侧下拉箭头 */}
        <div className="flex items-center justify-center w-[16px] h-full border-l border-[#ddd] bg-[#f0f0f0]">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M2 3L4 5.5L6 3" stroke="#666" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
      {/* w-max：宽度随内容撑开，配合 whitespace-nowrap 防止标签竖排 */}
      {open && (
        <div className="absolute top-full left-0 mt-1 py-1.5 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-max min-w-[160px]">
          {items.map((item, i) => (
            <button
              key={i}
              className="w-full px-4 py-2 text-left text-sm text-[#333] hover:bg-gray-50 flex items-center justify-between gap-4 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={item.disabled}
              onClick={() => { item.onClick(); setOpen(false) }}
            >
              <span className="flex items-center gap-2.5">
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                {item.label}
              </span>
              {item.shortcut && (
                <span className="text-xs text-[#999] flex-shrink-0">{item.shortcut}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
    </Tooltip>
  )
}

export function TopBar() {
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const elements = useEditorStore((s) => s.document.elements)
  const brushData = useEditorStore((s) => s.brushData)
  const currentTool = useEditorStore((s) => s.currentTool)
  const page = useEditorStore((s) => s.document.page)

  // 分享弹窗（doc 为点击"分享"时刻的画板快照，弹窗期间编辑不影响本次分享内容）
  const [shareOpen, setShareOpen] = useState(false)
  const [shareDoc, setShareDoc] = useState<DocumentData | null>(null)
  const closeShare = useRef(() => setShareOpen(false)).current
  const openShare = () => {
    const doc = useEditorStore.getState().document
    if (!doc) return
    setShareDoc(doc)
    setShareOpen(true)
  }

  // 获取第一个选中图形（不含连线，用于填充/字体等图形专属属性）
  const firstSelected: ElementInstance | null = (() => {
    if (selectedIds.size === 0) return null
    const firstId = [...selectedIds][0]!
    const el = elements[firstId]
    if (!el || isLinker(el)) return null
    return el
  })()

  // 获取第一个选中元素（含连线，用于线条颜色/样式等共用属性）
  const firstSelectedAny: ElementInstance | LinkerInstance | null = (() => {
    if (selectedIds.size === 0) return null
    const firstId = [...selectedIds][0]!
    return elements[firstId] ?? null
  })()

  // 获取第一个选中连线（线型/箭头工具栏专用）
  const firstSelectedLinker: LinkerInstance | null = (() => {
    if (selectedIds.size === 0) return null
    const firstId = [...selectedIds][0]!
    const el = elements[firstId]
    if (!el || !isLinker(el)) return null
    return el
  })()

  const linkerToolbarDisabled = firstSelectedLinker == null

  // 撤销/重做
  const canUndo = useEditorStore((s) => s.canUndo)
  const canRedo = useEditorStore((s) => s.canRedo)

  const handleUndo = () => useEditorStore.getState().undo()
  const handleRedo = () => useEditorStore.getState().redo()

  // 格式刷
  const handleBrush = () => {
    const st = useEditorStore.getState()
    if (st.brushData) {
      st.cancelBrush()
    } else {
      st.startBrush()
    }
  }

  // B/I/U 切换字体样式（与 ⌘B/⌘I/⌘U 快捷键同一 store action，作用于全部选中）
  const handleFontToggle = (key: 'bold' | 'italic' | 'underline') => {
    useEditorStore.getState().toggleFontStyle(key)
  }

  // 填充颜色（格式为 "r,g,b"）
  const handleFillChange = (rgb: string | null) => {
    if (!rgb) return
    const st = useEditorStore.getState()
    for (const id of st.selectedIds) {
      const el = st.document.elements[id]
      if (!el || isLinker(el)) continue
      st.updateElement(id, {
        fillStyle: { ...el.fillStyle, color: rgb },
      })
    }
  }

  // 文本颜色（格式为 "r,g,b"）
  const handleTextColor = (rgb: string | null) => {
    if (!rgb) return
    const st = useEditorStore.getState()
    for (const id of st.selectedIds) {
      const el = st.document.elements[id]
      if (!el) continue
      if (isLinker(el)) {
        st.updateLinker(id, {
          fontStyle: { ...el.fontStyle, color: rgb },
        })
      } else {
        st.updateElement(id, {
          fontStyle: { ...el.fontStyle, color: rgb },
        })
      }
    }
  }

  // 线条颜色
  const handleLineColor = (rgb: string | null) => {
    if (!rgb) return
    const st = useEditorStore.getState()
    for (const id of st.selectedIds) {
      const el = st.document.elements[id]
      if (!el) continue
      if (isLinker(el)) {
        st.updateLinker(id, {
          lineStyle: { ...el.lineStyle, lineColor: rgb },
        })
      } else {
        st.updateElement(id, {
          lineStyle: { ...el.lineStyle, lineColor: rgb },
        })
      }
    }
  }

  // 线型（实线/虚线等）
  const handleLineType = (lineStyle: 'solid' | 'dashed' | 'dot' | 'dotdash') => {
    const st = useEditorStore.getState()
    for (const id of st.selectedIds) {
      const el = st.document.elements[id]
      if (!el) continue
      if (isLinker(el)) {
        st.updateLinker(id, {
          lineStyle: { ...el.lineStyle, lineStyle },
        })
      } else {
        st.updateElement(id, {
          lineStyle: { ...el.lineStyle, lineStyle },
        })
      }
    }
  }

  // 连线类型（折线/曲线/直线）
  const handleLinkerType = (linkerType: LinkerInstance['linkerType']) => {
    const st = useEditorStore.getState()
    const getRect = makeStoreRectGetter()
    for (const id of st.selectedIds) {
      const el = st.document.elements[id]
      if (!el || !isLinker(el)) continue
      const next = { ...el, linkerType }
      st.updateLinker(id, {
        linkerType,
        points: getLinkerPoints(next, getRect),
      })
    }
  }

  // 起/止箭头
  const handleBeginArrow = (style: ArrowStyle) => {
    const st = useEditorStore.getState()
    for (const id of st.selectedIds) {
      const el = st.document.elements[id]
      if (!el || !isLinker(el)) continue
      st.updateLinker(id, {
        lineStyle: { ...el.lineStyle, beginArrowStyle: style },
      })
    }
  }
  const handleEndArrow = (style: ArrowStyle) => {
    const st = useEditorStore.getState()
    for (const id of st.selectedIds) {
      const el = st.document.elements[id]
      if (!el || !isLinker(el)) continue
      st.updateLinker(id, {
        lineStyle: { ...el.lineStyle, endArrowStyle: style },
      })
    }
  }

  const ARROW_STYLE_ITEMS = [
    { value: 'none' as const, onClick: () => handleBeginArrow('none') },
    { value: 'solidArrow' as const, onClick: () => handleBeginArrow('solidArrow') },
    { value: 'dashedArrow' as const, onClick: () => handleBeginArrow('dashedArrow') },
    { value: 'normal' as const, onClick: () => handleBeginArrow('normal') },
    { value: 'solidDiamond' as const, onClick: () => handleBeginArrow('solidDiamond') },
    { value: 'dashedDiamond' as const, onClick: () => handleBeginArrow('dashedDiamond') },
    { value: 'solidCircle' as const, onClick: () => handleBeginArrow('solidCircle') },
    { value: 'dashedCircle' as const, onClick: () => handleBeginArrow('dashedCircle') },
    { value: 'cross' as const, onClick: () => handleBeginArrow('cross') },
  ]
  const END_ARROW_STYLE_ITEMS = ARROW_STYLE_ITEMS.map((item) => ({
    ...item,
    onClick: () => handleEndArrow(item.value),
  }))

  // 层级调整（与右键菜单共用 applyLayerAction）
  const handleLayer = (action: 'front' | 'back' | 'forward' | 'backward') => {
    applyLayerAction(action)
  }

  // 锁定
  const handleLock = () => {
    useEditorStore.getState().lockShapes([...selectedIds])
  }

  // 解锁
  const handleUnlock = () => {
    useEditorStore.getState().unlockShapes([...selectedIds])
  }

  // 判断当前是否全部锁定
  const allLocked = selectedIds.size > 0 && [...selectedIds].every((id) => elements[id]?.locked)
  // 判断当前是否全部未锁定
  const allUnlocked = selectedIds.size > 0 && [...selectedIds].every((id) => !elements[id]?.locked)

  // 当前填充颜色
  const currentFillColor = firstSelected?.fillStyle?.color ?? null
  // 当前文本颜色
  const currentTextColor = firstSelected?.fontStyle?.color ?? null
  // 当前线条颜色（图形与连线共用，需取含连线的首个选中）
  const currentLineColor = firstSelectedAny?.lineStyle?.lineColor ?? null
  // 当前线型（图形与连线共用，需取含连线的首个选中）
  const currentLineStyle = firstSelectedAny?.lineStyle?.lineStyle ?? 'solid'
  const currentLinkerType = firstSelectedLinker?.linkerType ?? 'broken'
  const currentBeginArrow = firstSelectedLinker?.lineStyle.beginArrowStyle ?? 'none'
  const currentEndArrow = firstSelectedLinker?.lineStyle.endArrowStyle ?? 'solidArrow'

  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [renameOpen, setRenameOpen] = useState(false)
  const [hotkeyOpen, setHotkeyOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const doc = parseDocumentFile(String(reader.result ?? ''))
      if (doc) useEditorStore.getState().loadDocument(doc)
    }
    reader.readAsText(file)
  }

  const handleExport = () => {
    const st = useEditorStore.getState()
    const keep = [...st.selectedIds]
    st.clearSelection()
    st.setHoveredId(null)
    window.dispatchEvent(new CustomEvent(EXPORT_EVENT, { detail: { keepSelection: keep } }))
  }
  const uiVisible = useUIStore((s) => s.leftPanelVisible)
  const uiVisibleRight = useUIStore((s) => s.rightPanelVisible)
  // 视图菜单「显示 AI 助手」勾选态仍在使用（开关入口已移至右侧竖排工具栏）
  const aiPanelVisible = useUIStore((s) => s.aiPanelVisible)
  const scale = useEditorStore((s) => s.viewport.scale)
  const zoom = (v: number) => useEditorStore.getState().updateViewport({ scale: v })
  const zoomStep = (d: 'in' | 'out') => {
    const st = useEditorStore.getState()
    const next = Math.round((Math.max(0.25, Math.min(4, st.viewport.scale + (d === 'in' ? 0.05 : -0.05))) * 20)) / 20
    st.updateViewport({ scale: next })
  }

  /** 参与排列的对齐/分布/匹配的图形数（非连线、非锁定） */
  const arrangeEligible = [...selectedIds].filter((id) => {
    const el = elements[id]
    return el != null && !isLinker(el) && !el.locked
  }).length
  const canArrange = selectedIds.size > 0

  const menus = [
    {
      key: 'file',
      label: '文件',
      items: [
        { label: '重命名', onClick: () => setRenameOpen(true) },
        { divider: true },
        {
          label: '新建',
          onClick: () => {
            if (window.confirm('新建将清空当前画布，确定？')) useEditorStore.getState().newDocument()
          },
        },
        { label: '导入文件', onClick: () => {
          if (fileInputRef.current) fileInputRef.current.accept = '.efd.json,.json'
          fileInputRef.current?.click()
        } },
        { label: '下载文件', onClick: () => {
          const st = useEditorStore.getState()
          const json = serializeDocumentFile(st.document)
          const blob = new Blob([json], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const filename = buildExportFileNameEfd(st.document.page.title ?? '')
          triggerDownload(url, filename)
          // 延迟释放，避免极慢设备下载尚未启动时 URL 失效
          setTimeout(() => URL.revokeObjectURL(url), 1000)
        } },
        { divider: true },
        { label: '下载为 PNG', onClick: handleExport },
      ],
    },
    // ── 编辑 ──
    {
      key: 'edit',
      label: '编辑',
      items: [
        { label: '撤销', shortcut: shortcutText('Z'), disabled: !canUndo(), onClick: handleUndo },
        { label: '恢复', shortcut: shortcutText('Z', true), disabled: !canRedo(), onClick: handleRedo },
        { divider: true },
        { label: '剪切', shortcut: shortcutText('X'), disabled: selectedIds.size === 0, onClick: () => { const st = useEditorStore.getState(); st.copySelectedElements(); st.deleteElements([...st.selectedIds]) } },
        { label: '复制', shortcut: shortcutText('C'), disabled: selectedIds.size === 0, onClick: () => useEditorStore.getState().copySelectedElements() },
        { label: '粘贴', shortcut: shortcutText('V'), disabled: !useEditorStore.getState().clipboard, onClick: () => useEditorStore.getState().pasteElements() },
        { label: '复用', shortcut: shortcutText('D'), disabled: selectedIds.size === 0, onClick: () => { useEditorStore.getState().copySelectedElements(); useEditorStore.getState().pasteElements() } },
        { label: '格式刷', shortcut: shortcutText('B', true), disabled: selectedIds.size === 0, onClick: handleBrush },
        { divider: true },
        { label: '全选', shortcut: shortcutText('A'), onClick: () => useEditorStore.getState().selectIds(Object.keys(useEditorStore.getState().document.elements), 'replace') },
        { label: '删除', shortcut: '⌦', disabled: selectedIds.size === 0, onClick: () => useEditorStore.getState().deleteElements([...useEditorStore.getState().selectedIds]) },
      ],
    },
    // ── 视图 ──
    {
      key: 'view',
      label: '视图',
      items: [
        { label: '放大', shortcut: shortcutText('+'), onClick: () => zoomStep('in') },
        { label: '缩小', shortcut: shortcutText('-'), onClick: () => zoomStep('out') },
        { divider: true },
        ...[0.5, 0.75, 1, 1.5, 2].map((v) => ({
          label: `${Math.round(v * 100)}%`, checked: scale === v, onClick: () => zoom(v),
        })),
        { divider: true },
        { label: '重置缩放', shortcut: shortcutText('0'), onClick: () => zoom(1) },
        { divider: true },
        { label: '显示图形库', checked: uiVisible, onClick: () => useUIStore.getState().toggleLeftPanel() },
        { label: '显示属性面板', checked: uiVisibleRight, onClick: () => useUIStore.getState().toggleRightPanel() },
        { label: '显示 AI 助手', checked: aiPanelVisible, onClick: () => useUIStore.getState().toggleAiPanel() },
      ],
    },
    // ── 插入 ──
    {
      key: 'insert',
      label: '插入',
      items: [
        { label: '文本', shortcut: 'T', onClick: () => { const s = useEditorStore.getState(); s.setTool(s.currentTool === 'text' ? 'select' : 'text') } },
        { label: '连线', shortcut: 'L', onClick: () => { const s = useEditorStore.getState(); s.setTool(s.currentTool === 'linker' ? 'select' : 'linker') } },
        { label: '图片', shortcut: 'I', disabled: true },
      ],
    },
    // ── 排列 ──（对齐/分布/匹配大小在后续任务接入；层级/锁定/组合现在接）
    {
      key: 'arrange',
      label: '排列',
      items: [
        {
          label: '置于顶层', shortcut: layerShortcutText(']'), disabled: !canArrange,
          icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3L3 6L8 9L13 6L8 3Z" fill="#333"/><path d="M3 9L8 12.5L13 9" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>,
          onClick: () => handleLayer('front'),
        },
        {
          label: '置于底层', shortcut: layerShortcutText('['), disabled: !canArrange,
          icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3L3 6L8 9L13 6L8 3Z" fill="#ccc"/><path d="M3 9L8 12.5L13 9" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>,
          onClick: () => handleLayer('back'),
        },
        { label: '上移一层', shortcut: layerShortcutText(']', true), disabled: !canArrange, onClick: () => handleLayer('forward') },
        { label: '下移一层', shortcut: layerShortcutText('[', true), disabled: !canArrange, onClick: () => handleLayer('backward') },
        { divider: true },
        {
          label: '对齐',
          children: [
            { label: '左对齐', icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="4" cy="5" r="2.5" fill="#333"/><rect x="8" y="3.5" width="6" height="3" fill="#999"/><circle cx="4" cy="11" r="2.5" fill="#333"/><rect x="8" y="9.5" width="6" height="3" fill="#999"/><line x1="9" y1="2" x2="9" y2="14" stroke="#4a7fde" strokeWidth="1.5"/></svg>, disabled: arrangeEligible < 2, onClick: () => useEditorStore.getState().alignShapes([...selectedIds], 'left') },
            { label: '水平居中', disabled: arrangeEligible < 2, onClick: () => useEditorStore.getState().alignShapes([...selectedIds], 'center') },
            { label: '右对齐', disabled: arrangeEligible < 2, onClick: () => useEditorStore.getState().alignShapes([...selectedIds], 'right') },
            { divider: true },
            { label: '顶端对齐', disabled: arrangeEligible < 2, onClick: () => useEditorStore.getState().alignShapes([...selectedIds], 'top') },
            { label: '垂直居中', disabled: arrangeEligible < 2, onClick: () => useEditorStore.getState().alignShapes([...selectedIds], 'middle') },
            { label: '底端对齐', disabled: arrangeEligible < 2, onClick: () => useEditorStore.getState().alignShapes([...selectedIds], 'bottom') },
          ],
        },
        {
          label: '分布',
          children: [
            { label: '水平平均分布', disabled: arrangeEligible < 3, onClick: () => useEditorStore.getState().distributeShapes([...selectedIds], 'horizontal') },
            { label: '垂直平均分布', disabled: arrangeEligible < 3, onClick: () => useEditorStore.getState().distributeShapes([...selectedIds], 'vertical') },
          ],
        },
        {
          label: '匹配大小',
          children: [
            { label: '宽度', disabled: arrangeEligible < 2, onClick: () => useEditorStore.getState().matchSize([...selectedIds], { w: true }) },
            { label: '高度', disabled: arrangeEligible < 2, onClick: () => useEditorStore.getState().matchSize([...selectedIds], { h: true }) },
            { label: '宽度和高度', disabled: arrangeEligible < 2, onClick: () => useEditorStore.getState().matchSize([...selectedIds], { w: true, h: true }) },
          ],
        },
        { divider: true },
        { label: '锁定', shortcut: shortcutText('L'), disabled: !canArrange, onClick: handleLock },
        { label: '解锁', shortcut: shortcutText('L', true), disabled: !canArrange, onClick: handleUnlock },
        { divider: true },
        { label: '组合', shortcut: shortcutText('G'), disabled: arrangeEligible < 2, onClick: () => useEditorStore.getState().groupSelected() },
        { label: '取消组合', shortcut: shortcutText('G', true), disabled: !canArrange, onClick: () => useEditorStore.getState().ungroupSelected() },
      ],
    },
    // ── 帮助 ──（快捷键列表在后续任务接入）
    {
      key: 'help',
      label: '帮助',
      items: [{ label: '快捷键列表', onClick: () => setHotkeyOpen(true) }],
    },
  ]

  return (
    <div className="flex flex-col border-b border-[#e0e0e0] bg-[#f8f8f8] select-none">
      {/* 菜单栏 */}
      <div className="flex items-center h-8 px-4">
        {getEditorBackHref() && (
          <a
            href={getEditorBackHref()!}
            title="返回"
            className="mr-3 flex size-6 shrink-0 items-center justify-center rounded-md text-[#666] transition-colors hover:bg-[#ececec] hover:text-[#333]"
          >
            <ArrowLeft size={16} />
          </a>
        )}
        <span className="flex items-center font-semibold text-sm text-[#333] mr-4">
          <img src={logoUrl} alt="易飞绘图 Logo" className="w-[18px] h-[18px] mr-1.5" draggable={false} />
          易飞绘图
        </span>
        {menus.map((menu) => (
          <MenuDropdown
            key={menu.key}
            label={menu.label}
            items={menu.items}
            open={openMenu === menu.key}
            onOpenChange={(o) => setOpenMenu(o ? menu.key : null)}
            openOnHover
          />
        ))}

        {/* 行尾分享入口（菜单栏右侧留白处；仅宿主注入分享实现后出现） */}
        {getDrawShareHandler() !== null && (
          <button
            type="button"
            onClick={openShare}
            title="生成分享链接"
            className="ml-auto flex h-6 items-center gap-1 rounded-md px-2 text-xs text-[#666] transition-colors hover:bg-[#ececec] hover:text-[#333]"
          >
            <Share2 size={13} />
            分享
          </button>
        )}
      </div>

      {/* 工具栏 */}
      <div className="flex items-center h-9 px-4 gap-0.5">
        {/* 历史组 */}
        <div className="flex items-center gap-0.5">
          <IconButton
            icon={<Undo2 size={16} />}
            title={`撤销 (${shortcutText('Z')})`}
            onClick={handleUndo}
            disabled={!canUndo()}
          />
          <IconButton
            icon={<Redo2 size={16} />}
            title={`重做 (${shortcutText('Z', true)} / ${shortcutText('Y')})`}
            onClick={handleRedo}
            disabled={!canRedo()}
          />
        </div>

        <div className="w-px h-5 bg-[#ddd] mx-1" />

        {/* 格式刷 */}
        <IconButton
          icon={<FormatBrush size={16} />}
          title="格式刷"
          active={!!brushData}
          onClick={handleBrush}
          disabled={selectedIds.size === 0 || firstSelected == null}
        />

        <div className="w-px h-5 bg-[#ddd] mx-1" />

        {/* 文字样式 */}
        <div className="flex items-center gap-0.5">
          <IconButton
            icon={<Bold size={16} />}
            title={`加粗 (${shortcutText('B')})`}
            active={!!firstSelected?.fontStyle?.bold}
            onClick={() => handleFontToggle('bold')}
            disabled={selectedIds.size === 0}
          />
          <IconButton
            icon={<Italic size={16} />}
            title={`斜体 (${shortcutText('I')})`}
            active={!!firstSelected?.fontStyle?.italic}
            onClick={() => handleFontToggle('italic')}
            disabled={selectedIds.size === 0}
          />
          <IconButton
            icon={<Underline size={16} />}
            title={`下划线 (${shortcutText('U')})`}
            active={!!firstSelected?.fontStyle?.underline}
            onClick={() => handleFontToggle('underline')}
            disabled={selectedIds.size === 0}
          />
        </div>

        <div className="w-px h-5 bg-[#ddd] mx-1" />

        {/* 线条样式 */}
        <LineStyleDropdown
          currentStyle={currentLineStyle}
          items={[
            { value: 'solid', onClick: () => handleLineType('solid') },
            { value: 'dashed', onClick: () => handleLineType('dashed') },
            { value: 'dot', onClick: () => handleLineType('dot') },
            { value: 'dotdash', onClick: () => handleLineType('dotdash') },
          ]}
        />

        <div className="flex items-center gap-0.5">
          <Tooltip text="连线类型" disabled={linkerToolbarDisabled}>
            <LineTypeDropdown
              currentType={currentLinkerType}
              disabled={linkerToolbarDisabled}
              items={[
                { value: 'broken', onClick: () => handleLinkerType('broken') },
                { value: 'curve', onClick: () => handleLinkerType('curve') },
                { value: 'line', onClick: () => handleLinkerType('line') },
              ]}
            />
          </Tooltip>
          <Tooltip text="起点" disabled={linkerToolbarDisabled}>
            <ArrowStyleDropdown
              currentStyle={currentBeginArrow}
              direction="backward"
              disabled={linkerToolbarDisabled}
              items={ARROW_STYLE_ITEMS}
            />
          </Tooltip>
          <Tooltip text="终点" disabled={linkerToolbarDisabled}>
            <ArrowStyleDropdown
              currentStyle={currentEndArrow}
              disabled={linkerToolbarDisabled}
              items={END_ARROW_STYLE_ITEMS}
            />
          </Tooltip>
        </div>

        <div className="w-px h-5 bg-[#ddd] mx-1" />

        {/* 填充颜色 */}
        <FillColorButton
          value={currentFillColor}
          onSelect={handleFillChange}
          disabled={selectedIds.size === 0 || firstSelected == null}
        />

        <div className="w-px h-5 bg-[#ddd] mx-1" />

        {/* 文本/线条颜色 */}
        <div className="flex items-center gap-1">
          <TextColorButton
            value={currentTextColor}
            onSelect={handleTextColor}
            disabled={selectedIds.size === 0}
          />
          <LineColorButton
            value={currentLineColor}
            onSelect={handleLineColor}
            disabled={selectedIds.size === 0}
          />
        </div>

        <div className="w-px h-5 bg-[#ddd] mx-1" />

        {/* 层级下拉（分体式按钮） */}
        <LayerDropdown
          disabled={selectedIds.size === 0}
          items={[
            {
              label: '置于顶层',
              shortcut: layerShortcutText(']'),
              onClick: () => handleLayer('front'),
              disabled: selectedIds.size === 0,
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4L4 7.5L10 11L16 7.5L10 4Z" fill="#333" />
                  <path d="M4 10L10 13.5L16 10" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 13L10 16.5L16 13" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              label: '置于底层',
              shortcut: layerShortcutText('['),
              onClick: () => handleLayer('back'),
              disabled: selectedIds.size === 0,
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4L4 7.5L10 11L16 7.5L10 4Z" fill="#ccc" />
                  <path d="M4 10L10 13.5L16 10" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 13L10 16.5L16 13" fill="#333" />
                </svg>
              ),
            },
            {
              label: '上移一层',
              shortcut: layerShortcutText(']', true),
              onClick: () => handleLayer('forward'),
              disabled: selectedIds.size === 0,
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 5L5 8L10 11L15 8L10 5Z" fill="#333" />
                  <path d="M5 13L10 16L15 13" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="13" y="18" fontSize="7" fill="#999" fontWeight="bold">1</text>
                </svg>
              ),
            },
            {
              label: '下移一层',
              shortcut: layerShortcutText('[', true),
              onClick: () => handleLayer('backward'),
              disabled: selectedIds.size === 0,
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 14L5 11L10 8L15 11L10 14Z" fill="#333" />
                  <path d="M5 6L10 3L15 6" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="13" y="7" fontSize="7" fill="#999" fontWeight="bold">1</text>
                </svg>
              ),
            },
          ]}
        />

        <div className="w-px h-5 bg-[#ddd] mx-1" />

        {/* 锁定 */}
        <IconButton
          icon={<Lock size={16} />}
          title={`锁定`}
          onClick={handleLock}
          disabled={selectedIds.size === 0 || allLocked}
        />
        {/* 解锁 */}
        <IconButton
          icon={<Unlock size={16} />}
          title={`解锁`}
          onClick={handleUnlock}
          disabled={selectedIds.size === 0 || allUnlocked}
        />

        <div className="w-px h-5 bg-[#ddd] mx-1" />

        {/* 连线工具（切换式：再点一次回选择工具，等价快捷键 L） */}
        <IconButton
          icon={<Link2 size={16} />}
          title="连线工具"
          active={currentTool === 'linker'}
          onClick={() =>
            useEditorStore
              .getState()
              .setTool(currentTool === 'linker' ? 'select' : 'linker')
          }
        />
      </div>

      {/* 文件导入隐藏输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".efd.json,.json,application/json"
        className="hidden"
        onChange={(e) => { handleImportFile(e.target.files?.[0]); e.target.value = '' }}
      />
      {/* 重命名浮层 */}
      {renameOpen && (
        <PromptDialog
          title="重命名文件"
          defaultValue={page.title ?? '未命名图表'}
          onSubmit={(v) => {
            useEditorStore.getState().updatePage({ title: v })
            setRenameOpen(false)
          }}
          onCancel={() => setRenameOpen(false)}
        />
      )}
      {/* 离屏导出（监听 efdraw:export） */}
      <ExportImage />
      {hotkeyOpen && <HotkeyDialog onClose={() => setHotkeyOpen(false)} />}
      <ShareDialog open={shareOpen} doc={shareDoc} onClose={closeShare} />
    </div>
  )
}
