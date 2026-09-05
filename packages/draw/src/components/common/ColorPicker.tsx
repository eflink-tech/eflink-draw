// 纯预设色板（灰阶 12 + 9×12 彩色矩阵，共 120 色）+ HEX 输入 + 透明按钮；
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { rgbToHex } from '@/core/utils/color'
import { ColorGrid } from '@/components/common/ColorGrid'

interface ColorPickerProps {
  /** 当前色（"r,g,b"）；null = 透明 */
  value: string | null
  /** 选择回调；null = 透明 */
  onSelect: (rgb: string | null) => void
  transparent?: boolean
  /** HEX 输入实时应用回调（不关闭弹层）；缺省时实时输入不生效 */
  onLiveSelect?: (rgb: string) => void
  /** 锚元素：弹层左对齐显示在其下方（向右展开，视口右侧不足时自动左移防溢出） */
  anchorRef: RefObject<HTMLElement | null>
  onClose: () => void
}

export function ColorPicker({
  value,
  onSelect,
  transparent = false,
  onLiveSelect,
  anchorRef,
  onClose,
}: ColorPickerProps) {
  const popRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ left: 0, top: 0 })

  // 定位到锚元素下方：左对齐向右展开，让用户能直观关联触发按钮；
  // useLayoutEffect 在首帧绘制前完成测量，避免 0,0 位置闪烁
  useLayoutEffect(() => {
    const anchor = anchorRef.current
    const pop = popRef.current
    if (!anchor || !pop) return
    const r = anchor.getBoundingClientRect()
    const maxLeft = window.innerWidth - pop.offsetWidth - 8
    setPos({ left: Math.min(r.left, Math.max(8, maxLeft)), top: r.bottom + 4 })
  }, [anchorRef])

  // 点击外部 / Esc 关闭（锚元素除外——交由 ColorButton 的 click toggle 收起，
  // 否则 mousedown 先关、click 再开，点按钮永远关不掉弹层）
  useEffect(() => {
    const onDocMouseDown = (ev: MouseEvent): void => {
      if (anchorRef.current?.contains(ev.target as Node)) return
      if (popRef.current && !popRef.current.contains(ev.target as Node)) onClose()
    }
    const onKey = (ev: KeyboardEvent): void => {
      if (ev.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, anchorRef])

  return (
    <div
      ref={popRef}
      className="fixed z-50 bg-white border border-[#a0a0a0] rounded shadow-lg"
      style={{ left: pos.left, top: pos.top }}
    >
      <ColorGrid value={value} onSelect={onSelect} transparent={transparent} onLiveSelect={onLiveSelect} />
    </div>
  )
}

interface ColorButtonProps {
  value: string | null
  onSelect: (rgb: string | null) => void
  transparent?: boolean
  disabled?: boolean
}

/** 色块 + 下拉按钮组合（左侧色块，右侧灰色下拉箭头区域） */
export function ColorButton({ value, onSelect, transparent = false, disabled = false }: ColorButtonProps) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="relative inline-block">
      <button
        ref={btnRef}
        disabled={disabled}
        className="inline-flex items-center border border-[#ccc] rounded bg-white hover:border-[#833] disabled:opacity-50 transition-colors cursor-pointer"
        style={{ width: 42, height: 24 }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
        title={value ? rgbToHex(value) : '透明'}
      >
        {/* 左侧色块 */}
        <div className="flex-1 h-full flex items-center justify-center px-[3px]">
          {value ? (
            <div className="w-full h-[14px] rounded-[1px]" style={{ backgroundColor: `rgb(${value})` }} />
          ) : (
            <div
              className="w-full h-[14px] rounded-[1px]"
              style={{
                background:
                  'linear-gradient(135deg, transparent 40%, #d00 40%, #d00 60%, transparent 60%)',
              }}
            />
          )}
        </div>
        {/* 右侧灰色下拉箭头区域 */}
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
          transparent={transparent}
          anchorRef={btnRef}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}
