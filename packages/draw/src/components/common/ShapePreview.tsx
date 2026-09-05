// 图形预览（左侧面板）
// 绘制逻辑在 core/utils/shapeThumb.ts（与面板拖拽 ghost 共用）：
// 把真实 Schema 等比缩放绘入 size×size 画布，面板里看到的就是拖到画布上的图形本身。
import { useEffect, useRef } from 'react'
import { drawShapeThumb } from '@/core/utils/shapeThumb'

interface ShapePreviewProps {
  /** 图形 Schema 名 */
  name: string
  size?: number
}

export function ShapePreview({ name, size = 30 }: ShapePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      drawShapeThumb(canvasRef.current, name, size)
    }
  }, [name, size])

  return <canvas ref={canvasRef} style={{ width: size, height: size }} />
}
