// 只读绘图渲染：把 DocumentData 以「内容外接框」裁切后铺在容器里，供 Markdown 预览等场景嵌入。
// - 复用编辑器同一套 Konva 渲染器，保证 160+ 图形 / 泳道 / 时序消息与编辑态完全一致
// - 不接 store 的选区/工具/文字编辑态，Stage 各层 listening=false，纯展示
// - 容器宽度自适应（ResizeObserver），高度由内容比例决定并受 maxHeight 约束
// - zoomable：滚轮/双指缩放、拖拽平移、双击复位，供查看大图弹层使用
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import type Konva from 'konva'
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import { Layer, Rect, Stage } from 'react-konva'
import { isLinker, rgbToCSS, type DocumentData, type ElementInstance, type LinkerInstance } from '@/types'
import { computeContentBounds } from '@/core/editor/contentBounds'
import { ElementRenderer } from '@/components/canvas/ElementRenderer'
import { LinkerRenderer } from '@/components/canvas/LinkerRenderer'
import {
  centerTransform,
  clampTransform,
  zoomTransformAt,
  type ViewerBounds,
  type ViewerFrame,
  type ViewerTransform,
} from './viewport'

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
  /** 开启交互视口：滚轮/双指缩放、拖拽平移、双击复位，并显示缩放控件 */
  zoomable?: boolean
  className?: string
  style?: CSSProperties
}

interface FitView {
  frame: ViewerFrame
  transform: ViewerTransform
}

const clampNum = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const DrawViewer = forwardRef<DrawViewerHandle, DrawViewerProps>(function DrawViewer(
  { document, padding = 8, maxHeight = 480, maxScale = 2, zoomable = false, className, style },
  ref,
) {
  const stageRef = useRef<Konva.Stage>(null)
  const nodeRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  // 用户缩放后的视口；fit 变化（容器尺寸/文档变化）即作废，回到适配状态
  const [viewport, setViewport] = useState<{ fit: FitView; view: ViewerTransform } | null>(null)
  const [dragging, setDragging] = useState(false)
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const pinchRef = useRef<{ view: ViewerTransform; dist: number } | null>(null)
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null)
  const viewRef = useRef<ViewerTransform | null>(null)
  const fitRef = useRef<FitView | null>(null)
  const boundsRef = useRef<ViewerBounds | null>(null)

  const roRef = useRef<ResizeObserver | null>(null)
  const containerCallbackRef = useCallback((node: HTMLDivElement | null) => {
    roRef.current?.disconnect()
    roRef.current = null
    nodeRef.current = node
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

  const fit = useMemo<FitView | null>(() => {
    if (!bounds || containerWidth <= 0) return null
    const cw = Math.max(bounds.maxX - bounds.minX, 1)
    const ch = Math.max(bounds.maxY - bounds.minY, 1)
    const availW = Math.max(containerWidth - padding * 2, 1)
    const availH = Math.max(maxHeight - padding * 2, 1)
    const scale = Math.max(0.02, Math.min(availW / cw, availH / ch, maxScale))
    const frame: ViewerFrame = {
      width: containerWidth,
      // 交互查看固定为 maxHeight 视口，宽扁图形不会把弹层压成一条窄带；内嵌预览仍按内容高度
      height: zoomable ? Math.ceil(Math.max(maxHeight, 1)) : Math.ceil(ch * scale + padding * 2),
      padding,
    }
    return { frame, transform: centerTransform(bounds, frame, scale) }
  }, [bounds, containerWidth, padding, maxHeight, maxScale])

  const view = zoomable && viewport && viewport.fit === fit ? viewport.view : (fit?.transform ?? null)

  viewRef.current = view
  fitRef.current = fit
  boundsRef.current = bounds

  const zoomBy = useCallback((factor: number) => {
    const currentFit = fitRef.current
    const currentView = viewRef.current
    const currentBounds = boundsRef.current
    if (!currentFit || !currentView || !currentBounds) return
    const min = currentFit.transform.scale
    setViewport({
      fit: currentFit,
      view: zoomTransformAt(
        currentView,
        currentBounds,
        currentFit.frame,
        { x: currentFit.frame.width / 2, y: currentFit.frame.height / 2 },
        currentView.scale * factor,
        min,
        Math.max(min * 8, 3),
      ),
    })
  }, [])

  const resetView = useCallback(() => setViewport(null), [])

  // React 的 wheel 监听是被动的，无法 preventDefault；这里挂原生监听避免页面跟着滚动
  useEffect(() => {
    const node = nodeRef.current
    if (!zoomable || !node || !fit || !bounds) return
    const onWheel = (e: WheelEvent) => {
      if (!e.deltaY) return
      const currentView = viewRef.current
      if (!currentView) return
      e.preventDefault()
      const rect = node.getBoundingClientRect()
      const factor = clampNum(Math.exp(-e.deltaY * 0.0015), 0.5, 2)
      const min = fit.transform.scale
      setViewport({
        fit,
        view: zoomTransformAt(
          currentView,
          bounds,
          fit.frame,
          { x: e.clientX - rect.left, y: e.clientY - rect.top },
          currentView.scale * factor,
          min,
          Math.max(min * 8, 3),
        ),
      })
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [zoomable, fit, bounds])

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!zoomable || !fit) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // 指针已释放时忽略
    }
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointersRef.current.size === 1) {
      lastPointerRef.current = { x: e.clientX, y: e.clientY }
      setDragging(true)
    } else if (pointersRef.current.size === 2 && view) {
      lastPointerRef.current = null
      const [a, b] = [...pointersRef.current.values()]
      pinchRef.current = { view, dist: Math.hypot(a.x - b.x, a.y - b.y) || 1 }
    }
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!zoomable) return
    const pointers = pointersRef.current
    if (!pointers.has(e.pointerId)) return
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const currentFit = fitRef.current
    const currentBounds = boundsRef.current
    if (!currentFit || !currentBounds) return
    const min = currentFit.transform.scale
    const max = Math.max(min * 8, 3)

    if (pointers.size >= 2 && pinchRef.current) {
      const rect = nodeRef.current?.getBoundingClientRect()
      if (!rect) return
      const [a, b] = [...pointers.values()]
      const base = pinchRef.current
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1
      setViewport({
        fit: currentFit,
        view: zoomTransformAt(
          base.view,
          currentBounds,
          currentFit.frame,
          { x: (a.x + b.x) / 2 - rect.left, y: (a.y + b.y) / 2 - rect.top },
          base.view.scale * (dist / base.dist),
          min,
          max,
        ),
      })
      return
    }

    const last = lastPointerRef.current
    const currentView = viewRef.current
    if (!last || !currentView) return
    lastPointerRef.current = { x: e.clientX, y: e.clientY }
    const dx = e.clientX - last.x
    const dy = e.clientY - last.y
    if (!dx && !dy) return
    setViewport({
      fit: currentFit,
      view: clampTransform(
        { scale: currentView.scale, x: currentView.x + dx, y: currentView.y + dy },
        currentBounds,
        currentFit.frame,
        min,
        max,
      ),
    })
  }

  const endPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!zoomable) return
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
    } catch {
      // 捕获已释放时忽略
    }
    const pointers = pointersRef.current
    pointers.delete(e.pointerId)
    if (pointers.size < 2) pinchRef.current = null
    if (pointers.size === 0) {
      lastPointerRef.current = null
      setDragging(false)
    } else {
      const [point] = [...pointers.values()]
      lastPointerRef.current = { x: point.x, y: point.y }
    }
  }

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
  const percent = fit && view ? Math.max(1, Math.round((view.scale / fit.transform.scale) * 100)) : 100
  const atMinZoom = !!fit && !!view && view.scale <= fit.transform.scale + 1e-6
  const atMaxZoom = !!fit && !!view && view.scale >= Math.max(fit.transform.scale * 8, 3) - 1e-6

  return (
    <div
      ref={containerCallbackRef}
      className={[zoomable ? 'relative select-none overflow-hidden' : '', className]
        .filter(Boolean)
        .join(' ')}
      style={{
        width: '100%',
        lineHeight: 0,
        touchAction: zoomable ? 'none' : undefined,
        cursor: zoomable ? (dragging ? 'grabbing' : 'grab') : undefined,
        ...style,
      }}
      onPointerDown={zoomable ? onPointerDown : undefined}
      onPointerMove={zoomable ? onPointerMove : undefined}
      onPointerUp={zoomable ? endPointer : undefined}
      onPointerCancel={zoomable ? endPointer : undefined}
      onDoubleClick={zoomable ? resetView : undefined}
    >
      {fit && view && (
        <Stage
          ref={stageRef}
          width={fit.frame.width}
          height={fit.frame.height}
          scaleX={view.scale}
          scaleY={view.scale}
          x={view.x}
          y={view.y}
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
              <LinkerRenderer key={l.id} linker={l} readOnly viewScale={view.scale} />
            ))}
          </Layer>
          <Layer listening={false}>
            {shapes.map((el) => (
              <ElementRenderer key={el.id} element={el} readOnly viewScale={view.scale} />
            ))}
          </Layer>
        </Stage>
      )}
      {zoomable && fit && view && (
        <div
          className="absolute right-2 bottom-2 flex items-center gap-0.5 rounded-lg border border-outline-variant bg-card/95 px-1 py-0.5 leading-none shadow-sm"
          onPointerDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="缩小"
            title="缩小"
            disabled={atMinZoom}
            onClick={() => zoomBy(1 / 1.25)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-foreground hover:bg-muted disabled:cursor-default disabled:opacity-40"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="重置缩放"
            title="重置为适应大小（也可双击画布）"
            onClick={resetView}
            className="h-7 min-w-[3rem] cursor-pointer rounded-md px-1 text-xs tabular-nums text-foreground hover:bg-muted"
          >
            {percent}%
          </button>
          <button
            type="button"
            aria-label="放大"
            title="放大"
            disabled={atMaxZoom}
            onClick={() => zoomBy(1.25)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-foreground hover:bg-muted disabled:cursor-default disabled:opacity-40"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="适应窗口"
            title="适应窗口"
            onClick={resetView}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-foreground hover:bg-muted"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
})
