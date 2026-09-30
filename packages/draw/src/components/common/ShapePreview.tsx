// 图形预览（左侧面板）
// 绘制逻辑在 core/utils/shapeThumb.ts（与面板拖拽 ghost 共用）：
// 把真实 Schema 等比缩放绘入 size×size 画布，面板里看到的就是拖到画布上的图形本身。
import { useEffect, useRef } from 'react'
import { drawShapeThumb } from '@/core/utils/shapeThumb'

interface ShapePreviewProps {
  /** 图形 Schema 名 */
  name: string
  size?: number
  /** 进视口才绘制（网络拓扑图标一个品类上百个 tile，省掉看不见的绘制开销） */
  defer?: boolean
}

export function ShapePreview({ name, size = 30, defer = false }: ShapePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!defer || typeof IntersectionObserver === 'undefined') {
      drawShapeThumb(canvas, name, size)
      return
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect()
        drawShapeThumb(canvas, name, size)
      }
    })
    io.observe(canvas)
    return () => io.disconnect()
  }, [name, size, defer])

  return <canvas ref={canvasRef} style={{ width: size, height: size }} />
}

