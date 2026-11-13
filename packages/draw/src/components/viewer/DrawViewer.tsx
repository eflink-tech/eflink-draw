// 只读绘图渲染：把 DocumentData 以「内容外接框」裁切后铺在容器里，供 Markdown 预览等场景嵌入。
// - 复用编辑器同一套 Konva 渲染器，保证 160+ 图形 / 泳道 / 时序消息与编辑态完全一致
// - 不接 store 的选区/工具/文字编辑态，Stage 各层 listening=false，纯展示
// - 容器宽度自适应（ResizeObserver），高度由内容比例决定并受 maxHeight 约束
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type Konva from 'konva'
import { Layer, Rect, Stage } from 'react-konva'
import { isLinker, rgbToCSS, type DocumentData, type ElementInstance, type LinkerInstance } from '@/types'
import { computeContentBounds } from '@/core/editor/contentBounds'
import { ElementRenderer } from '@/components/canvas/ElementRenderer'
import { LinkerRenderer } from '@/components/canvas/LinkerRenderer'

export interface DrawViewerHandle {
  /** 导出当前视口内的画布（含留白），导出前确保内容已渲染 */
  toDataURL: (mimeType?: string, quality?: number) => string | null
}

export interface DrawViewerProps {
  document: DocumentData
  /** 内容四周留白（屏幕像素），默认 8 */
  padding?: number
  /** 最高高度（屏幕像素），默认 480；超出的内容整体缩小而不是滚动 */
  maxHeight?: number
  /** 最大放大倍数，默认 2（小图不至于铺满整行时过度放大） */
  maxScale?: number
  className?: string
  style?: CSSProperties
}

export const DrawViewer = forwardRef<DrawViewerHandle, DrawViewerProps>(function DrawViewer(
  { document, padding = 8, maxHeight = 480, maxScale = 2, className, style },
  ref,
) {
  const stageRef = useRef<Konva.Stage>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  const roRef = useRef<ResizeObserver | null>(null)
  const containerCallbackRef = useCallback((node: HTMLDivElement | null) => {
    roRef.current?.disconnect()
    roRef.current = null
    if (!node) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(Math.floor(entry.contentRect.width))
      }
    })
    ro.observe(node)
    roRef.current = ro
  }, [])

  // 卸载时断开观察
  useLayoutEffect(() => () => roRef.current?.disconnect(), [])

  const bounds = useMemo(() => computeContentBounds(document), [document])

  const layout = useMemo(() => {
    if (!bounds || containerWidth <= 0) return null
    const cw = Math.max(bounds.maxX - bounds.minX, 1)
    const ch = Math.max(bounds.maxY - bounds.minY, 1)
    const availW = Math.max(containerWidth - padding * 2, 1)
    const availH = Math.max(maxHeight - padding * 2, 1)
    const scale = Math.max(0.02, Math.min(availW / cw, availH / ch, maxScale))
    const width = containerWidth
    const height = Math.ceil(ch * scale + padding * 2)
    return {
      width,
      height,
      scale,
      x: (width - cw * scale) / 2 - bounds.minX * scale,
      y: padding - bounds.minY * scale,
    }
  }, [bounds, containerWidth, padding, maxHeight, maxScale])

  const shapes = useMemo(
    () =>
      Object.values(document.elements)
        .filter((el): el is ElementInstance => !isLinker(el))
        .sort((a, b) => a.props.zindex - b.props.zindex),
    [document],
  )
  const linkers = useMemo(
    () => Object.values(document.elements).filter((el): el is LinkerInstance => isLinker(el)),
    [document],
  )

  const pixelRatio = useMemo(
    () =>
      typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio || 1, 2),
    [],
  )

  useImperativeHandle(
    ref,
    () => ({
      toDataURL: (mimeType = 'image/png', quality = 1) =>
        stageRef.current?.toDataURL({ pixelRatio: 2, mimeType, quality }) ?? null,
    }),
    [],
  )

  const page = document.page
  const showPageBg = page.backgroundColor !== 'transparent'

  return (
    <div
      ref={containerCallbackRef}
      className={className}
      style={{ width: '100%', lineHeight: 0, ...style }}
    >
      {layout && (
        <Stage
          ref={stageRef}
          width={layout.width}
          height={layout.height}
          scaleX={layout.scale}
          scaleY={layout.scale}
          x={layout.x}
          y={layout.y}
          pixelRatio={pixelRatio}
          listening={false}
        >
          {showPageBg && (
            <Layer listening={false}>
              <Rect
                x={bounds!.minX}
                y={bounds!.minY}
                width={bounds!.maxX - bounds!.minX}
                height={bounds!.maxY - bounds!.minY}
                fill={rgbToCSS(page.backgroundColor)}
              />
            </Layer>
          )}
          <Layer listening={false}>
            {linkers.map((l) => (
              <LinkerRenderer key={l.id} linker={l} readOnly viewScale={layout.scale} />
            ))}
          </Layer>
          <Layer listening={false}>
            {shapes.map((el) => (
              <ElementRenderer key={el.id} element={el} readOnly viewScale={layout.scale} />
            ))}
          </Layer>
        </Stage>
      )}
    </div>
  )
})
