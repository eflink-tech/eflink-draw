// 线条样式下拉组件（分体式按钮 + 样式预览菜单），顶部工具栏与属性面板共用
import { useEffect, useRef, useState } from 'react'
import { Tooltip } from '@/components/common/Tooltip'

export type LineStyleValue = 'solid' | 'dashed' | 'dot' | 'dotdash'

/** 线条样式下拉菜单项 */
export interface LineStyleItem {
  value: LineStyleValue
  onClick: () => void
}

const DASH_MAP: Record<LineStyleValue, string | undefined> = {
  solid: undefined,
  dashed: '6 4',
  dot: '2 3',
  dotdash: '2 3 7 3',
}

/** 线条样式 SVG（按钮与菜单共用） */
function LineStyleGlyph({ style, width }: { style: LineStyleValue; width: number }) {
  const h = 14
  const pad = 2
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
      <line
        x1={pad}
        y1={h / 2}
        x2={width - pad}
        y2={h / 2}
        stroke="#333"
        strokeWidth="1.5"
        strokeDasharray={DASH_MAP[style]}
        strokeLinecap="round"
      />
    </svg>
  )
}

/** 线条样式下拉组件（分体式按钮，与线型下拉视觉一致） */
export function LineStyleDropdown({ currentStyle, items }: {
  currentStyle: string
  items: LineStyleItem[]
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

  const style = currentStyle as LineStyleValue

  return (
    <Tooltip text="线条样式">
      <div className="relative inline-block" ref={rootRef}>
        <button
          className={`inline-flex items-center border rounded transition-colors cursor-pointer disabled:opacity-50 ${
            open ? 'border-[#833] bg-[#fde8e8]' : 'border-[#ddd] bg-white hover:border-[#833]'
          }`}
          style={{ width: 42, height: 24 }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex-1 h-full flex items-center justify-center px-1 min-w-0">
            <LineStyleGlyph style={style} width={22} />
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
                  <LineStyleGlyph style={item.value} width={26} />
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
    </Tooltip>
  )
}
