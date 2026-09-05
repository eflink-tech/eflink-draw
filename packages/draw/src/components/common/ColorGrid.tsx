// src/components/common/ColorGrid.tsx
// 纯预设色板（灰阶 + 9×12 彩色矩阵，共 120 色）+ HEX 输入 + 透明按钮；
// 从 ColorPicker 抽出，供 ColorPicker 弹层与菜单"背景颜色"子菜单共用。
import { useState } from 'react'
import { COLOR_ROWS, GRAY_PALETTE, hexToRgb, rgbToHex } from '@/core/utils/color'

interface ColorGridProps {
  /** 当前色（"r,g,b"）；null = 透明 */
  value: string | null
  onSelect: (rgb: string | null) => void
  /** 显示「透明」按钮 */
  transparent?: boolean
  /** HEX 输入合法时实时应用（不关闭弹层）；缺省时仅在 Enter/blur 应用 */
  onLiveSelect?: (rgb: string) => void
}

export function ColorGrid({ value, onSelect, transparent = false, onLiveSelect }: ColorGridProps) {
  const [hex, setHex] = useState(value ? rgbToHex(value).slice(1) : '')

  const applyHex = (): void => {
    const rgb = hexToRgb(hex)
    if (rgb) onSelect(rgb)
  }

  const swatch = (rgb: string, key: string) => (
    <button
      type="button"
      key={key}
      title={rgbToHex(rgb)}
      className="h-[13px] w-[13px] border border-[#c0c0c0] hover:scale-125 transition-transform"
      style={{
        backgroundColor: `rgb(${rgb})`,
        outline: value === rgb ? '2px solid #833' : 'none',
        outlineOffset: '1px',
      }}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onSelect(rgb)}
    />
  )

  return (
    <div className="p-2 text-xs">
      <div className="flex gap-[3px] mb-1">
        {GRAY_PALETTE.map((c, i) => swatch(c, `g${i}`))}
      </div>
      <div className="flex flex-col gap-[3px]">
        {COLOR_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-[3px]">
            {row.map((c, ci) => swatch(c, `${ri}-${ci}`))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-[#e0e0e0]">
        <span className="text-gray-500">#</span>
        <input
          value={hex}
          onChange={(e) => {
            const next = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6)
            setHex(next)
            // 实时应用：输入合法 hex（3/6 位）即刻生效，无需回车
            if (onLiveSelect) {
              const rgb = hexToRgb(next)
              if (rgb) onLiveSelect(rgb)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') applyHex()
          }}
          onBlur={applyHex}
          className="w-16 px-1 py-0.5 border border-[#ddd] rounded"
          placeholder="HEX"
        />
        {transparent && (
          <button
            type="button"
            className="px-2 py-0.5 border border-[#ddd] rounded hover:bg-gray-100"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(null)}
          >
            透明
          </button>
        )}
      </div>
    </div>
  )
}
