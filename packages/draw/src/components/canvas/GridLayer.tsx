// src/components/canvas/GridLayer.tsx
// 网格渲染薄壳组件 —— 几何与调色逻辑在 @/core/editor/grid（可测试）
// - 页面为固定大小矩形（默认 1600×1200，portrait 互换），白区 padding 内缩
// - 网格线只画在白区内，线 1px、屏幕空间 0.5 偏移，每 4 条世界线一条主线
// - showGrid 只控制网格线，白色页面始终绘制
import { memo } from 'react'
import { Rect, Line } from 'react-konva'
import {
  computePageRect,
  computePageGridLines,
  getDarkerColor,
  getDarkestColor,
  type PageGeometry,
} from '@/core/editor/grid'
import { rgbToCSS } from '@/types'

interface GridLayerProps {
  page: PageGeometry & { gridSize: number; showGrid: boolean; backgroundColor: string }
  scale: number
}

export const GridLayer = memo(function GridLayer({ page, scale }: GridLayerProps) {
  const bg = page.backgroundColor === 'transparent' ? '255,255,255' : page.backgroundColor
  const lightColor = rgbToCSS(getDarkerColor(bg))
  const darkColor = rgbToCSS(getDarkestColor(bg))
  const { inner } = computePageRect(page)
  const { vertical, horizontal } = computePageGridLines(page, { scale })
  const strokeWidth = 1 / scale

  return (
    <>
      <Rect
        x={inner.x}
        y={inner.y}
        width={inner.width}
        height={inner.height}
        fill={rgbToCSS(bg)}
        // 淡阴影：柔和扩散、低透明度（对齐参考截图）
        shadowColor="black"
        shadowBlur={12 / scale}
        shadowOffsetX={0}
        shadowOffsetY={2 / scale}
        shadowOpacity={0.1}
      />
      {page.showGrid && (
        <>
          {horizontal.map((l, i) => (
            <Line
              key={`h-${i}`}
              points={[l.x1, l.y1, l.x2, l.y2]}
              stroke={l.major ? darkColor : lightColor}
              strokeWidth={strokeWidth}
            />
          ))}
          {vertical.map((l, i) => (
            <Line
              key={`v-${i}`}
              points={[l.x1, l.y1, l.x2, l.y2]}
              stroke={l.major ? darkColor : lightColor}
              strokeWidth={strokeWidth}
            />
          ))}
        </>
      )}
    </>
  )
})
