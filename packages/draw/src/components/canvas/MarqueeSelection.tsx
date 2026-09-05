// 由 Canvas 组件传入起点/终点世界坐标，自动计算 left/top/width/height
import { Rect } from 'react-konva'

interface MarqueeSelectionProps {
  start: { x: number; y: number } | null
  current: { x: number; y: number } | null
}

export function MarqueeSelection({ start, current }: MarqueeSelectionProps) {
  if (!start || !current) return null

  const x = Math.min(start.x, current.x)
  const y = Math.min(start.y, current.y)
  const w = Math.abs(current.x - start.x)
  const h = Math.abs(current.y - start.y)

  return (
    <Rect
      x={x}
      y={y}
      width={w}
      height={h}
      stroke="#6EB1EB"
      strokeWidth={1}
      dash={[4, 3]}
      fill="rgba(110, 177, 235, 0.08)"
      listening={false}
    />
  )
}
