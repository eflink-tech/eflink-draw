// 悬停文字提示（顶部工具栏用；比原生 title 出现更快且样式统一）
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/** 悬停后延迟显示，避免鼠标快速掠过时闪烁 */
const SHOW_DELAY = 400

interface TooltipProps {
  /** 提示文本 */
  text: string
  /** 禁用时不显示提示（与禁用按钮保持一致） */
  disabled?: boolean
  className?: string
  children: ReactNode
}

/** 气泡与视口边缘的最小间距 */
const VIEWPORT_MARGIN = 4

export function Tooltip({ text, disabled = false, className = '', children }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timer = useRef<number | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  // 水平平移量：气泡默认居中于锚元素，靠近视口边缘时平移防裁切
  const [shift, setShift] = useState(0)

  // 以包裹元素中心计算理想居中位置（与当前 shift 无关，避免旧值累积），
  // useLayoutEffect 在绘制前修正，无闪烁
  useLayoutEffect(() => {
    if (!visible) {
      setShift(0)
      return
    }
    const wrap = wrapRef.current
    const tip = tipRef.current
    if (!wrap || !tip) return
    const wr = wrap.getBoundingClientRect()
    const idealLeft = wr.left + wr.width / 2 - tip.offsetWidth / 2
    const idealRight = idealLeft + tip.offsetWidth
    if (idealLeft < VIEWPORT_MARGIN) setShift(VIEWPORT_MARGIN - idealLeft)
    else if (idealRight > window.innerWidth - VIEWPORT_MARGIN) {
      setShift(window.innerWidth - VIEWPORT_MARGIN - idealRight)
    } else setShift(0)
  }, [visible, text])

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }

  // 卸载时清理定时器，防止状态更新泄漏
  useEffect(() => clearTimer, [])

  const handleEnter = () => {
    if (disabled) return
    clearTimer()
    timer.current = window.setTimeout(() => setVisible(true), SHOW_DELAY)
  }

  const handleLeave = () => {
    clearTimer()
    setVisible(false)
  }

  return (
    <div
      ref={wrapRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseDown={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          ref={tipRef}
          data-tooltip
          className="absolute top-full left-1/2 mt-1.5 px-2 py-1 bg-[#333] text-white text-xs rounded whitespace-nowrap z-[60] pointer-events-none"
          style={{ transform: `translateX(calc(-50% + ${shift}px))` }}
        >
          {text}
        </div>
      )}
    </div>
  )
}
