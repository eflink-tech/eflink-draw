// 属性面板共享控件（Section / Row / NumField / ToggleButton）
import { useEffect, useRef, useState } from 'react'
import { historyManager } from '@/store/editorStore'

/** 区块（沿用旧 RightPanel 视觉） */
export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#eee] rounded">
      <div className="flex items-center px-2 py-1.5 bg-[#efefef] border-b border-[#e0e0e0] font-medium text-[#333]">
        <span>{title}</span>
      </div>
      <div className="p-2 space-y-1.5">{children}</div>
    </div>
  )
}

/** 属性行 */
export function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 text-gray-500 flex-shrink-0">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  )
}

interface NumFieldProps {
  value: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  /** Enter/blur 提交（外部值变化时重置显示） */
  onCommit: (v: number) => void
  /** 覆盖 input 的 className（默认 w-20 紧凑宽度，与面板分体按钮视觉对齐） */
  className?: string
  /** 实时模式：onChange 时也触发 onCommit（画布即时预览；聚焦期间整个输入会话合并为一条 undo） */
  live?: boolean
  /** 聚焦事件 */
  onFocus?: () => void
  /** 失焦事件 */
  onBlur?: () => void
}

/** 数字输入（Enter/blur 提交；选中切换时随 props 重置；live 模式每次输入实时提交） */
export function NumField({
  value,
  min,
  max,
  step,
  disabled = false,
  onCommit,
  className,
  live = false,
  onFocus,
  onBlur: onBlurProp,
}: NumFieldProps) {
  const [text, setText] = useState(String(value))
  const focusedRef = useRef(false)
  // 聚焦期间不回写：live 模式每次按键都改 store，回写会打断输入
  // （如宽 min=20 时输入 "1" 被 clamp 成 20 写回，后续按键变成 "20x"）
  useEffect(() => {
    if (!focusedRef.current) setText(String(value))
  }, [value])

  const commit = (): void => {
    const n = Number.parseFloat(text)
    if (!Number.isFinite(n)) {
      setText(String(value))
      return
    }
    const clamped = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n))
    // 解析值或 clamp 后与当前 props 值相同（如聚焦即 blur、X=33.4 显示 33 的舍入差）则跳过提交，
    // 避免误触发联动操作与 isDirty
    if (n === value || clamped === value) {
      setText(String(value))
      return
    }
    onCommit(clamped)
  }

  return (
    <input
      type="number"
      value={text}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      onChange={(e) => {
        setText(e.target.value)
        // 实时模式：每次输入都尝试提交（用于字号等需要即时预览的场景）
        if (live) {
          const n = Number.parseFloat(e.target.value)
          if (Number.isFinite(n)) {
            const clamped = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n))
            if (clamped !== value) onCommit(clamped)
          }
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
      }}
      onFocus={() => {
        focusedRef.current = true
        // live 模式：整个聚焦期间的连续提交合并为一条 undo 记录
        if (live) historyManager.beginBatch()
        onFocus?.()
      }}
      onBlur={() => {
        focusedRef.current = false
        commit()
        if (live) historyManager.commit()
        onBlurProp?.()
      }}
      className={`h-6 px-1.5 border border-[#ddd] rounded text-xs bg-white disabled:opacity-50 ${
        className ?? 'w-20'
      }`}
    />
  )
}

/** B/I/U、对齐等开关按钮 */
export function ToggleButton({
  active,
  disabled,
  label,
  onClick,
}: {
  active: boolean
  disabled?: boolean
  label: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`px-2 py-0.5 border rounded text-xs cursor-pointer disabled:opacity-50 ${
        active ? 'bg-[#e8e8e8] border-[#833] text-[#833]' : 'border-[#ddd] hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  )
}

interface SliderFieldProps {
  value: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  suffix?: string
  onChange: (v: number) => void
}

/** 滑动条控件（细轨道进度填充 + 小圆 thumb，带右侧数值显示；轨道/拇指样式见 index.css） */
export function SliderField({
  value,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  suffix = '',
  onChange,
}: SliderFieldProps) {
  // 进度百分比 → 轨道左段主题色填充
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0
  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        className="panel-slider flex-1 cursor-pointer disabled:opacity-50"
        style={{
          background: `linear-gradient(to right, #833 0%, #833 ${percent}%, #e4e4e4 ${percent}%, #e4e4e4 100%)`,
        }}
      />
      <span className="text-xs text-gray-600 w-10 text-right flex-shrink-0 tabular-nums">
        {value}{suffix}
      </span>
    </div>
  )
}
