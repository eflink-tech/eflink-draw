// 线型（折线/曲线/直线）图形化下拉组件，属性面板连线模式使用
import { useEffect, useRef, useState } from 'react'

export type LineTypeValue = 'broken' | 'curve' | 'line'

/** 线型下拉菜单项 */
export interface LineTypeItem {
  value: LineTypeValue
  onClick: () => void
}

const ENDPOINT_SQUARE_SIZE = 3

/** 端点小方块 SVG */
function EndpointSquares({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const s = ENDPOINT_SQUARE_SIZE
  const hs = s / 2
  return (
    <>
      <rect x={x1 - hs} y={y1 - hs} width={s} height={s} fill="#333" />
      <rect x={x2 - hs} y={y2 - hs} width={s} height={s} fill="#333" />
    </>
  )
}

function LineTypeGlyph({ type, width }: { type: LineTypeValue; width: number }) {
  const h = 14
  const pad = 2
  const x1 = pad
  const x2 = width - pad
  const y1 = h - 3
  const y2 = 3

  if (type === 'broken') {
    const p1x = pad + (x2 - pad) * 0.25
    const p2x = pad + (x2 - pad) * 0.55
    return (
      <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
        <polyline
          points={`${x1},${y1} ${p1x},${y2} ${p2x},${y1} ${x2},${y2}`}
          fill="none"
          stroke="#333"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <EndpointSquares x1={x1} y1={y1} x2={x2} y2={y2} />
      </svg>
    )
  }

  if (type === 'curve') {
    const c1x = pad + (x2 - pad) * 0.3
    const c2x = pad + (x2 - pad) * 0.7
    return (
      <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
        <path
          d={`M${x1},${y1} C${c1x},${y2} ${c2x},${y2} ${x2},${y1}`}
          fill="none"
          stroke="#333"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <EndpointSquares x1={x1} y1={y1} x2={x2} y2={y1} />
      </svg>
    )
  }

  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#333"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <EndpointSquares x1={x1} y1={y1} x2={x2} y2={y2} />
    </svg>
  )
}

/** 线型下拉组件（分体式按钮 + 线型预览菜单） */
export function LineTypeDropdown({ currentType, items, disabled = false }: {
  currentType: LineTypeValue
  items: LineTypeItem[]
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
          <LineTypeGlyph type={currentType} width={22} />
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
                item.value === currentType ? 'bg-blue-50' : ''
              }`}
              onClick={() => { item.onClick(); setOpen(false) }}
            >
              <div className="w-[26px] flex items-center justify-center flex-shrink-0">
                <LineTypeGlyph type={item.value} width={26} />
              </div>
              <div className="w-4 flex items-center justify-center flex-shrink-0">
                {item.value === currentType && (
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
