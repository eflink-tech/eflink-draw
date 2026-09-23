// 代码块浮动工具栏：单选 codeBlock 时显示在图形左上方，
// 可切换语言标注（仅标注，不做语法高亮）、字号、明暗主题，并一键复制代码文本。
import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { isLinker } from '@/types'
import { worldToScreen } from '@/core/editor/interaction'

const CODE_LANGUAGES = [
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'markdown', label: 'Markdown' },
]

const CODE_SIZES = [12, 13, 14, 16, 18, 20]

/** 主题对应的背景/文字色（与 basic.ts codeBlock 默认值保持一致） */
const THEME_COLORS = {
  light: { bg: '246,247,250', fg: '51,51,51' },
  dark: { bg: '30,32,38', fg: '212,215,220' },
} as const

const selCls = 'max-w-[110px] cursor-pointer appearance-none bg-transparent text-xs text-[#333] outline-none'

export function CodeBlockToolbar() {
  // 订阅 viewport：平移/缩放时工具栏跟随图形
  useEditorStore((s) => s.viewport)
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const elements = useEditorStore((s) => s.document.elements)
  const currentTool = useEditorStore((s) => s.currentTool)
  const id = selectedIds.size === 1 ? [...selectedIds][0]! : null
  const el = id ? elements[id] : undefined
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (copiedTimer.current) clearTimeout(copiedTimer.current)
  }, [])

  // 仅选择工具下显示；锁定/多选/非代码块不显示
  if (currentTool !== 'select' || !el || isLinker(el) || el.name !== 'codeBlock' || el.locked) return null

  const screen = worldToScreen(el.props.x, el.props.y)
  const dark = el.codeTheme === 'dark'
  const code = el.textBlock[0]?.text ?? ''

  const setTheme = (theme: 'light' | 'dark'): void => {
    const { bg, fg } = THEME_COLORS[theme]
    useEditorStore.getState().updateElement(el.id, {
      codeTheme: theme,
      fillStyle: { type: 'solid', color: bg },
      fontStyle: { ...el.fontStyle, color: fg },
    })
  }

  const copyCode = (): void => {
    if (!code) return
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true)
      if (copiedTimer.current) clearTimeout(copiedTimer.current)
      copiedTimer.current = setTimeout(() => setCopied(false), 1500)
    }).catch(() => {})
  }

  return (
    <div
      className="absolute z-30 flex items-center gap-2 rounded-md border border-[#ddd] bg-white px-2.5 py-1 shadow-md"
      style={{ left: Math.max(4, screen.x), top: Math.max(4, screen.y - 38) }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <select
        className={selCls}
        title="代码语言"
        value={el.codeLanguage ?? 'plaintext'}
        onChange={(e) => useEditorStore.getState().updateElement(el.id, { codeLanguage: e.target.value })}
      >
        {CODE_LANGUAGES.map((l) => (
          <option key={l.value} value={l.value}>{l.label}</option>
        ))}
      </select>
      <div className="h-4 w-px bg-[#e5e5e5]" />
      <select
        className={selCls}
        title="字号"
        value={el.fontStyle.size ?? 13}
        onChange={(e) =>
          useEditorStore.getState().updateElement(el.id, {
            fontStyle: { ...el.fontStyle, size: Number(e.target.value) },
          })
        }
      >
        {CODE_SIZES.map((s) => (
          <option key={s} value={s}>{s}px</option>
        ))}
      </select>
      <div className="h-4 w-px bg-[#e5e5e5]" />
      <select
        className={selCls}
        title="主题"
        value={dark ? 'dark' : 'light'}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <div className="h-4 w-px bg-[#e5e5e5]" />
      <button
        title={copied ? '已复制' : '复制代码'}
        className="rounded p-1 text-[#666] hover:bg-[#f0f0f0]"
        onClick={copyCode}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
    </div>
  )
}
