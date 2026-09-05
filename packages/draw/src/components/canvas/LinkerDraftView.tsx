// 连线创建草稿视图（UI 层）
// 仅本组件订阅 linkerDraft —— 锚点拖拽期间只有这一小块 React 树重渲染。
import { useCallback } from 'react'
import { Shape } from 'react-konva'
import type Konva from 'konva'
import { useEditorStore } from '@/store/editorStore'
import { strokeLinkerScene } from '@/core/editor/linkerDraw'
import { shapeBorderWidth } from '@/core/editor/interaction'

/** 绘制草稿用连线 */
export function LinkerDraftView() {
  const draft = useEditorStore((s) => s.linkerDraft)

  const sceneFunc = useCallback(
    (context: unknown, _shape: Konva.Shape) => {
      if (!draft) return
      const ctx = context as unknown as CanvasRenderingContext2D
      strokeLinkerScene(ctx, draft, {
        color: 'rgb(50,50,50)',
        lineWidth: draft.lineStyle.lineWidth ?? 2,
        dash: draft.lineStyle.lineStyle ?? 'solid',
        getShapeBorder: shapeBorderWidth,
      })
    },
    [draft],
  )

  if (!draft) return null
  return <Shape listening={false} sceneFunc={sceneFunc} />
}
