//
//   getShapeByPosition 命中端点 10px 方形区（type linker_point）
//   → linkerDraggable（cursor move，mousedown 进入 dragging_linker）
//   → mousemove moveLinker（悬停图形 showAnchors、吸附锚点 showLinkPoint 大圆预览、
//     同图形脱附、自由点边吸附 + ±6 对齐，renderLinker 实时重算）
//   → mouseup Model.update 提交
//
// 本实现：端点平时不可见（仅 hover 光标变化；全面可视化增强——单选该连线时
// 显示可见圆点手柄），置于最上层 Layer；拖动走 liveLinker 直操通道，
// mouseup 一次性 updateLinker 提交。
import { useCallback, useMemo, useRef } from 'react'
import { Circle, Group, Rect } from 'react-konva'
import type Konva from 'konva'
import type { LinkerInstance } from '@/types'
import { isLinker } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { getLinkerPoints, snapLinkerEndpoint } from '@/core/editor/linker'
import { applyLiveLinker } from '@/core/editor/liveLinker'
import {
  hideEndpointPreview,
  registerEndpointPreview,
  showEndpointPreview,
} from '@/core/editor/uiOverlay'
import { allShapes, hitElementId, makeStoreRectGetter, pointerWorld } from '@/core/editor/interaction'

const ENDPOINT_HIT_PX = 10

/** 选中时端点圆点半径（屏幕像素，新设计值：白底 #833 边，与锚点同款规格） */
const ENDPOINT_DOT_PX = 3.5

export function LinkerEndpoints() {
  const elements = useEditorStore((s) => s.document.elements)
  const linkers = useMemo(
    () =>
      Object.values(elements)
        .filter(isLinker)
        .sort((a, b) => a.props.zindex - b.props.zindex) as LinkerInstance[],
    [elements],
  )

  const previewRef = useCallback((node: Konva.Circle | null) => {
    registerEndpointPreview(node)
  }, [])

  return (
    <>
      {linkers.map((l) => (
        <EndpointHandle key={`${l.id}-from`} linker={l} which="from" />
      ))}
      {linkers.map((l) => (
        <EndpointHandle key={`${l.id}-to`} linker={l} which="to" />
      ))}
      <Circle
        ref={previewRef}
        visible={false}
        listening={false}
        fill="#833"
        opacity={0.3}
        stroke="#833"
      />
    </>
  )
}

function EndpointHandle({ linker, which }: { linker: LinkerInstance; which: 'from' | 'to' }) {
  const scale = useEditorStore((s) => s.viewport.scale)
  const ep = linker[which]
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const hoveredId = useEditorStore((s) => s.hoveredId)
  const linkerSelected = selectedIds.size === 1 && selectedIds.has(linker.id)
  // 附着图形选中/悬停时，端点命中让位给锚点拖出新连线（除非当前单选的是该连线）
  const attachedShapeActive =
    ep.id != null && (selectedIds.has(ep.id) || hoveredId === ep.id)
  const deferToAnchor = attachedShapeActive && !linkerSelected
  // 拖动期间最新的连线数据（mouseup 提交用）
  const live = useRef<LinkerInstance | null>(null)

  const handleDragStart = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true
      live.current = null
      useEditorStore
        .getState()
        .selectElement(linker.id, e.evt.ctrlKey || e.evt.metaKey || e.evt.shiftKey)
    },
    [linker.id],
  )

  const handleDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true
      const stage = e.target.getStage()
      const pw = pointerWorld(stage)
      if (!pw) return
      const st = useEditorStore.getState()
      const other = which === 'from' ? linker.to : linker.from

      // 旧 moveLinker：精确命中悬停图形 + 距另一端最近的锚点吸附
      const hitId = hitElementId(stage)
      const r = snapLinkerEndpoint({
        shapes: allShapes(),
        hitShapeId: hitId,
        worldX: pw.x,
        worldY: pw.y,
        scale: st.viewport.scale,
        otherEnd: { id: other.id, x: other.x, y: other.y },
      })

      // 悬停图形显示锚点（旧 showAnchors）/ 吸附锚点大圆预览（旧 showLinkPoint）
      st.setHoveredId(hitId)
      if (r.snapAnchor) {
        showEndpointPreview(r.snapAnchor.x, r.snapAnchor.y, st.viewport.scale)
      } else {
        hideEndpointPreview()
      }

      // 直操：liveLinker 实时重算路径（等价旧 renderLinker(i, true)）
      const next: LinkerInstance = {
        ...linker,
        [which]: { ...r.endpoint, angle: r.endpoint.angle ?? 0 },
      }
      next.points = getLinkerPoints(next, makeStoreRectGetter())
      live.current = next
      // 直操统一通道：写 liveLinker + 同步文字标签位置 + 层重绘
      applyLiveLinker(linker.id, next)
    },
    [linker, which],
  )

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true
      const st = useEditorStore.getState()
      hideEndpointPreview()
      st.setHoveredId(null)
      // 手柄回位（store 提交后重渲染也对齐）
      e.target.position({ x: ep.x, y: ep.y })
      const next = live.current
      live.current = null
      // 清除 live 数据（标签位置不回写，store 提交后 React 重渲染按 props 定位）
      applyLiveLinker(linker.id, null)
      if (!next) return
      // 端点重连重算路由（属连接关系调整），回到自动路由，清除段拖拽留下的手动路由标记
      st.updateLinker(linker.id, { from: next.from, to: next.to, points: next.points, manualRoute: false })
    },
    [linker.id, ep.x, ep.y],
  )

  const half = ENDPOINT_HIT_PX / scale
  return (
    <Group
      x={ep.x}
      y={ep.y}
      listening={!deferToAnchor}
      draggable={!deferToAnchor}
      onMouseOver={(e) => {
        e.cancelBubble = true
        const container = e.target.getStage()?.container()
        if (container) container.style.cursor = 'move'
      }}
      onMouseOut={(e) => {
        e.cancelBubble = true
        const container = e.target.getStage()?.container()
        if (container) container.style.cursor = 'default'
      }}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <Rect x={-half} y={-half} width={half * 2} height={half * 2} fill="#000" opacity={0} />
      {linkerSelected && (
        <Circle
          radius={ENDPOINT_DOT_PX / scale}
          fill="#fff"
          stroke="#833"
          strokeWidth={1 / scale}
          listening={false}
        />
      )}
    </Group>
  )
}
