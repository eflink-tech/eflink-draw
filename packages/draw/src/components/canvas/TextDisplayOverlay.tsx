// 主画布文字 HTML 覆盖层：与 TextEditorOverlay 同源 DOM 渲染，避免 Konva Canvas 文字发粗/发糊
// 平移用外层 CSS translate 跟手，避免每次 wheel 重算全部标签的 left/top。
import { memo, type ReactNode } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { isLinker, type ElementInstance } from '@/types'
import { worldToScaled } from '@/core/editor/interaction'
import {
  buildFontStyleCSS,
  layoutShapeTextBlock,
  textFlexAlign,
} from '@/core/editor/textOverlayStyle'
import { useTextDisplayDragIds } from '@/core/editor/textDisplayDrag'

function ViewportPan({ children }: { children: ReactNode }) {
  const x = useEditorStore((s) => s.viewport.x)
  const y = useEditorStore((s) => s.viewport.y)
  return (
    <div className="absolute inset-0" style={{ transform: `translate(${x}px, ${y}px)` }}>
      {children}
    </div>
  )
}

export const TextDisplayOverlay = memo(function TextDisplayOverlay() {
  const elements = useEditorStore((s) => s.document.elements)
  const textEdit = useEditorStore((s) => s.textEdit)
  const scale = useEditorStore((s) => s.viewport.scale)
  const draggingIds = useTextDisplayDragIds()

  const shapes = Object.values(elements)
    .filter((el): el is ElementInstance => !isLinker(el))
    .sort((a, b) => a.props.zindex - b.props.zindex)

  return (
    <div className="pointer-events-none absolute inset-0 z-[15] overflow-hidden" aria-hidden>
      <ViewportPan>
        {shapes.map((el) => {
          if (draggingIds.has(el.id)) return null
          if (!el.textBlock?.length) return null
          const alpha = el.shapeStyle?.alpha ?? 1
          return el.textBlock.map((tb, blockIndex) => {
            if (!tb.text) return null
            if (textEdit?.id === el.id && textEdit.block === blockIndex) return null
            const blockFont = { ...el.fontStyle, ...tb.fontStyle }
            if (blockFont.orientation === 'vertical') return null

            const layout = layoutShapeTextBlock(el, blockIndex, (wx, wy) =>
              worldToScaled(wx, wy, scale),
            )
            if (!layout) return null
            const fontCSS = buildFontStyleCSS(layout.font)
            const flex = textFlexAlign(layout.font)

            return (
              <div
                key={`${el.id}:${blockIndex}`}
                style={{
                  position: 'absolute',
                  left: `${layout.screenX}px`,
                  top: `${layout.screenY}px`,
                  width: `${layout.worldW}px`,
                  height: `${layout.worldH}px`,
                  transform: `translate(-50%, -50%) rotate(${layout.rotDeg}deg) scale(${scale})`,
                  transformOrigin: 'center',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  opacity: alpha,
                  display: 'flex',
                  ...flex,
                  ...fontCSS,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {layout.text}
              </div>
            )
          })
        })}
      </ViewportPan>
    </div>
  )
})
