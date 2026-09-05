// src/components/export/ExportImage.tsx
// 离屏导出 PNG：监听 CustomEvent('efdraw:export')，按页面尺寸渲染整页（背景+连线+图形）并下载。
// 复用 ElementRenderer / LinkerRenderer，挂在固定的屏幕外容器（position:fixed; left:-10000px）。
// 导出触发方须在 detail 里携带 { keepSelection: string[] }，截图完成前由本组件清空/恢复选区，避免选中高亮入图。
import { useEffect, useRef, useState } from 'react'
import type Konva from 'konva'
import { Layer, Rect, Stage } from 'react-konva'
import { useEditorStore } from '@/store/editorStore'
import { computePageRect } from '@/core/editor/grid'
import { ElementRenderer } from '@/components/canvas/ElementRenderer'
import { LinkerRenderer } from '@/components/canvas/LinkerRenderer'
import { buildExportFileName, triggerDownload } from '@/core/editor/fileOps'
import { isLinker, rgbToCSS, type ElementInstance, type LinkerInstance } from '@/types'

export const EXPORT_EVENT = 'efdraw:export'

export function ExportImage() {
  const elements = useEditorStore((s) => s.document.elements)
  const page = useEditorStore((s) => s.document.page)
  const [active, setActive] = useState(false)
  const stageRef = useRef<Konva.Stage>(null)
  const keepSelectionRef = useRef<string[]>([])

  useEffect(() => {
    const onExport = (e: Event) => {
      const detail = (e as CustomEvent<{ keepSelection?: string[] }>).detail
      keepSelectionRef.current = detail?.keepSelection ?? []
      setActive(true)
    }
    window.addEventListener(EXPORT_EVENT, onExport)
    return () => window.removeEventListener(EXPORT_EVENT, onExport)
  }, [])

  useEffect(() => {
    if (!active) return
    const raf = requestAnimationFrame(() => {
      const stage = stageRef.current
      const title = useEditorStore.getState().document.page.title
      if (stage) {
        const url = stage.toDataURL({ pixelRatio: 2, mimeType: 'image/png' })
        triggerDownload(url, buildExportFileName(title ?? ''))
      }
      useEditorStore.getState().selectIds(keepSelectionRef.current, 'replace')
      setActive(false)
    })
    return () => cancelAnimationFrame(raf)
  }, [active])

  if (!active) return null

  const shapes = (Object.values(elements)
    .filter((e): e is ElementInstance => !isLinker(e))
    .sort((a, b) => a.props.zindex - b.props.zindex))
  const linkers = Object.values(elements).filter((e): e is LinkerInstance => isLinker(e))
  const { width, height } = computePageRect(page)

  return (
    <div
      aria-hidden
      style={{ position: 'fixed', left: -10000, top: 0, width, height, pointerEvents: 'none' }}
    >
      <Stage ref={stageRef} width={width} height={height}>
        <Layer listening={false}>
          {page.backgroundColor !== 'transparent' && (
            <Rect width={width} height={height} fill={rgbToCSS(page.backgroundColor)} />
          )}
        </Layer>
        <Layer>
          {linkers.map((l) => (
            <LinkerRenderer key={l.id} linker={l} />
          ))}
        </Layer>
        <Layer>
          {shapes.map((el) => (
            <ElementRenderer key={el.id} element={el} />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}
