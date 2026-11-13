// 离屏把 DocumentData 渲染成图片：Markdown 导出 Word、分享缩略图等场景不依赖页面上是否有可视画布。
// 复用编辑器渲染器（readOnly），内容裁剪口径与 DrawViewer 一致。
import { createRoot } from 'react-dom/client'
import { useEffect, useRef } from 'react'
import type Konva from 'konva'
import { Layer, Rect, Stage } from 'react-konva'
import { isLinker, rgbToCSS, type DocumentData, type ElementInstance, type LinkerInstance } from '@/types'
import { computeContentBounds } from '@/core/editor/contentBounds'
import { computePageRect } from '@/core/editor/grid'
import { ElementRenderer } from '@/components/canvas/ElementRenderer'
import { LinkerRenderer } from '@/components/canvas/LinkerRenderer'

export interface RenderDocumentImageOptions {
  /** 输出倍率，默认 2 */
  pixelRatio?: number
  /** 内容四周额外留白（世界坐标），默认 0 */
  padding?: number
  mimeType?: string
  /** 0-1，默认 1 */
  quality?: number
  /** true = 按页面矩形整页渲染；默认裁到内容外接框 */
  fullPage?: boolean
}

interface Area {
  width: number
  height: number
  x: number
  y: number
  /** 背景矩形（世界坐标） */
  bg: { x: number; y: number; width: number; height: number }
}

function resolveArea(doc: DocumentData, fullPage: boolean, padding: number): Area {
  if (fullPage) {
    const rect = computePageRect(doc.page)
    return {
      width: Math.max(1, Math.ceil(rect.width)),
      height: Math.max(1, Math.ceil(rect.height)),
      x: 0,
      y: 0,
      bg: { x: 0, y: 0, width: rect.width, height: rect.height },
    }
  }
  const bounds = computeContentBounds(doc)
  if (!bounds) throw new Error('renderDocumentToDataUrl: 文档没有可渲染内容')
  const width = Math.max(1, Math.ceil(bounds.maxX - bounds.minX + padding * 2))
  const height = Math.max(1, Math.ceil(bounds.maxY - bounds.minY + padding * 2))
  return {
    width,
    height,
    x: padding - bounds.minX,
    y: padding - bounds.minY,
    bg: {
      x: bounds.minX,
      y: bounds.minY,
      width: bounds.maxX - bounds.minX,
      height: bounds.maxY - bounds.minY,
    },
  }
}

function OffscreenDocument({
  doc,
  area,
  onReady,
}: {
  doc: DocumentData
  area: Area
  onReady: (stage: Konva.Stage) => void
}) {
  const stageRef = useRef<Konva.Stage>(null)
  useEffect(() => {
    if (stageRef.current) onReady(stageRef.current)
  }, [onReady])

  const shapes = Object.values(doc.elements)
    .filter((el): el is ElementInstance => !isLinker(el))
    .sort((a, b) => a.props.zindex - b.props.zindex)
  const linkers = Object.values(doc.elements).filter(
    (el): el is LinkerInstance => isLinker(el),
  )

  return (
    <Stage
      ref={stageRef}
      width={area.width}
      height={area.height}
      x={area.x}
      y={area.y}
      listening={false}
    >
      <Layer listening={false}>
        {doc.page.backgroundColor !== 'transparent' && (
          <Rect
            x={area.bg.x}
            y={area.bg.y}
            width={area.bg.width}
            height={area.bg.height}
            fill={rgbToCSS(doc.page.backgroundColor)}
          />
        )}
      </Layer>
      <Layer listening={false}>
        {linkers.map((l) => (
          <LinkerRenderer key={l.id} linker={l} readOnly />
        ))}
      </Layer>
      <Layer listening={false}>
        {shapes.map((el) => (
          <ElementRenderer key={el.id} element={el} readOnly />
        ))}
      </Layer>
    </Stage>
  )
}

/** 把文档渲染为 dataURL（默认 PNG）；文档为空时抛错 */
export async function renderDocumentToDataUrl(
  doc: DocumentData,
  options: RenderDocumentImageOptions = {},
): Promise<string> {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    throw new Error('renderDocumentToDataUrl 只能在浏览器环境调用')
  }
  const padding = options.padding ?? 0
  const area = resolveArea(doc, options.fullPage === true, padding)
  const host = document.createElement('div')
  host.style.cssText = 'position:fixed;left:-100000px;top:0;pointer-events:none;'
  document.body.appendChild(host)
  const root = createRoot(host)
  try {
    const stage = await new Promise<Konva.Stage>((resolve) => {
      root.render(<OffscreenDocument doc={doc} area={area} onReady={resolve} />)
    })
    // 等字体就绪 + 一次布局帧，避免文字量测采用回退字体
    try {
      await document.fonts?.ready
    } catch {
      /* 字体 API 不可用时忽略 */
    }
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    return stage.toDataURL({
      mimeType: options.mimeType ?? 'image/png',
      quality: options.quality ?? 1,
      pixelRatio: options.pixelRatio ?? 2,
    })
  } finally {
    root.unmount()
    host.remove()
  }
}
