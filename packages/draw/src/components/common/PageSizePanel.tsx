// src/components/common/PageSizePanel.tsx
// 页面大小面板：A3/A4/A5 预设 + 自定义宽/高输入，嵌入 页面>页面大小 子菜单。
// 预设为纵向像素坐标（与 design 一致：A4=1050×1500），原样写入 width/height。
import { useState } from 'react'

const PRESETS = [
  { label: 'A3', w: 1500, h: 2100 },
  { label: 'A4', w: 1050, h: 1500 },
  { label: 'A5', w: 750, h: 1050 },
]

const clamp = (n: number, fallback: number): number =>
  Math.max(100, Math.min(5000, Number.isFinite(n) && n > 0 ? n : fallback))

interface PageSizePanelProps {
  width: number
  height: number
  onApply: (w: number, h: number) => void
}

export function PageSizePanel({ width, height, onApply }: PageSizePanelProps) {
  const [w, setW] = useState(String(width))
  const [h, setH] = useState(String(height))

  const apply = (nw = Number(w), nh = Number(h)) => {
    onApply(clamp(nw, width), clamp(nh, height))
  }

  return (
    <div className="p-2 text-xs">
      <div className="flex gap-1 mb-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            className="rounded border border-[#ddd] px-2 py-0.5 hover:bg-gray-100"
            onClick={() => { setW(String(p.w)); setH(String(p.h)); apply(p.w, p.h) }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1 text-[11px] text-[#555]">
          宽
          <input
            value={w}
            onChange={(e) => setW(e.target.value.replace(/[^\d]/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            className="w-14 border border-[#ddd] rounded px-1 py-0.5"
          />
        </label>
        <label className="flex items-center gap-1 text-[11px] text-[#555]">
          高
          <input
            value={h}
            onChange={(e) => setH(e.target.value.replace(/[^\d]/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            className="w-14 border border-[#ddd] rounded px-1 py-0.5"
          />
        </label>
        <button
          type="button"
          className="rounded border border-[#ddd] px-2 py-0.5 hover:bg-gray-100"
          onClick={() => apply()}
        >
          应用
        </button>
      </div>
    </div>
  )
}
