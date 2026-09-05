// 箭头样式（9 种）图形化下拉组件，属性面板连线模式使用
import { useEffect, useRef, useState } from 'react'
import type { ArrowStyle } from '@/types'

export type ArrowStyleValue = ArrowStyle

/** 箭头下拉菜单项 */
export interface ArrowStyleItem {
  value: ArrowStyleValue
  onClick: () => void
}

/** 预览方向：forward = 箭头朝右（止箭头默认），backward = 箭头朝左（起箭头） */
export type ArrowPreviewDirection = 'forward' | 'backward'

const ARROW_ICON_WIDTH = 26
const ARROW_BUTTON_ICON_WIDTH = 22
const ARROW_ICON_HEIGHT = 10

/**
 * 通用箭头图形（用于按钮和菜单预览）。
 * direction='backward' 时沿 viewBox 右边缘做水平镜像，使箭头朝左（模拟画布起箭头朝向）。
 */
function ArrowGlyph({ style, direction = 'forward', viewBoxWidth, width = ARROW_ICON_WIDTH }: {
  style: ArrowStyleValue
  direction?: ArrowPreviewDirection
  viewBoxWidth: number
  width?: number
}) {
  const lineLen = 14
  const tipX = 18
  const cy = 5
  const solid = style === 'solidArrow' || style === 'solidDiamond' || style === 'solidCircle'
  const hollow = style === 'dashedArrow' || style === 'dashedDiamond' || style === 'dashedCircle'
  const mirror = direction === 'backward'
    ? `translate(${viewBoxWidth},0) scale(-1,1)`
    : undefined

  const content = (() => {
    if (style === 'none') {
      return (
        <>
          <line x1="1" y1={cy} x2="16" y2={cy} stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="18" cy={cy} r="1.5" fill="none" stroke="#333" strokeWidth="1" />
        </>
      )
    }

    if (style === 'solidArrow' || style === 'dashedArrow') {
      return (
        <>
          <line x1="1" y1={cy} x2={lineLen} y2={cy} stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          <polygon points={`${lineLen},2 ${tipX + 2},${cy} ${lineLen},8`} fill={hollow ? '#fff' : '#333'} stroke="#333" strokeWidth="1" strokeLinejoin="round" />
        </>
      )
    }

    if (style === 'normal') {
      return (
        <>
          <line x1="1" y1={cy} x2={lineLen} y2={cy} stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          <polyline points={`${lineLen},2 ${tipX + 2},${cy} ${lineLen},8`} fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )
    }

    if (style === 'solidDiamond' || style === 'dashedDiamond') {
      const dx = 3
      return (
        <>
          <line x1="1" y1={cy} x2={lineLen - dx} y2={cy} stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          <polygon points={`${tipX - dx},${cy - 3} ${tipX + 2},${cy} ${tipX - dx},${cy + 3} ${tipX - dx - 4},${cy}`} fill={hollow ? '#fff' : '#333'} stroke="#333" strokeWidth="1" strokeLinejoin="round" />
        </>
      )
    }

    if (style === 'solidCircle' || style === 'dashedCircle') {
      return (
        <>
          <line x1="1" y1={cy} x2={lineLen} y2={cy} stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx={tipX} cy={cy} r="3" fill={solid ? '#333' : '#fff'} stroke="#333" strokeWidth="1" />
        </>
      )
    }

    // cross
    return (
      <>
        <line x1="1" y1={cy} x2={lineLen} y2={cy} stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        <line x1={tipX} y1={cy - 3.5} x2={tipX} y2={cy + 3.5} stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      </>
    )
  })()

  return (
    <svg width={width} height={ARROW_ICON_HEIGHT} viewBox={`0 0 ${viewBoxWidth} ${ARROW_ICON_HEIGHT}`}>
      <g transform={mirror}>{content}</g>
    </svg>
  )
}

/** 箭头样式下拉组件（分体式按钮 + 箭头预览菜单） */
export function ArrowStyleDropdown({ currentStyle, items, direction = 'forward', disabled = false }: {
  currentStyle: ArrowStyleValue
  items: ArrowStyleItem[]
  direction?: ArrowPreviewDirection
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
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

  useEffect(() => {
    if (disabled) setOpen(false)
  }, [disabled])

  return (
    <div className="relative inline-block" ref={rootRef}>
      <button
        disabled={disabled}
        className={`inline-flex items-center border rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          open ? 'border-[#833] bg-[#fde8e8]' : 'border-[#ddd] bg-white hover:border-[#833]'
        }`}
        style={{ width: 42, height: 24 }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => !disabled && setOpen((v) => !v)}
      >
        <div className="flex-1 h-full flex items-center justify-center px-1 min-w-0">
          <ArrowGlyph style={currentStyle} direction={direction} viewBoxWidth={ARROW_ICON_WIDTH} width={ARROW_BUTTON_ICON_WIDTH} />
        </div>
        <div className="flex items-center justify-center w-[16px] h-full border-l border-[#ddd] bg-[#f0f0f0] flex-shrink-0">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M2 3L4 5.5L6 3" stroke="#666" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 py-1 bg-white border border-gray-200 rounded shadow-lg z-50 min-w-[80px]">
          {items.map((item, i) => (
            <button
              key={i}
              className={`w-full px-2 py-1 hover:bg-gray-100 flex items-center justify-between gap-2 ${
                item.value === currentStyle ? 'bg-blue-50' : ''
              }`}
              onClick={() => { item.onClick(); setOpen(false) }}
            >
              <div className="w-[26px] flex items-center justify-center flex-shrink-0">
                <ArrowGlyph style={item.value} direction={direction} viewBoxWidth={ARROW_ICON_WIDTH} width={ARROW_ICON_WIDTH} />
              </div>
              <div className="w-4 flex items-center justify-center flex-shrink-0">
                {item.value === currentStyle && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-blue-600">
                    <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
