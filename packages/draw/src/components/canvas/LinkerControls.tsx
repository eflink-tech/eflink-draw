// mouseup 一次性 updateLinker 提交。
import { useMemo, useRef } from 'react'
import { Circle, Line, Rect } from 'react-konva'
import type Konva from 'konva'
import type { LinkerInstance } from '@/types'
import { isLinker } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { pointerWorld } from '@/core/editor/interaction'
import { applyLiveLinker } from '@/core/editor/liveLinker'
import { isSegmentDraggable, startSegmentDrag } from '@/core/editor/linkerSegment'

const CONTROL_COLOR = '#833'
const CONTROL_ACTIVE = '#db5e5e'
/** 段中点拖拽句柄（参考 ProcessOn：蓝色方块 8×8） */
const HANDLE_COLOR = '#1677ff'

/** 事件目标染色（Konva 事件 target 为 Stage | Shape 联合，挂在本组件 Shape 上必为 Shape） */
function paintStroke(e: Konva.KonvaEventObject<DragEvent | MouseEvent>, color: string): void {
  ;(e.target as Konva.Shape).stroke(color)
}

export function LinkerControls() {
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const elements = useEditorStore((s) => s.document.elements)
  const linker = useMemo(() => {
    if (selectedIds.size !== 1) return null
    const el = elements[[...selectedIds][0]!]
    // 锁定连线不显示调节点（对齐计划守卫；当前无设置入口，locked 恒 false）
    return el && isLinker(el) && !el.locked ? el : null
  }, [selectedIds, elements])

  if (!linker) return null
  if (linker.linkerType === 'curve') return <CurveControls linker={linker} />
  if (linker.linkerType === 'broken') return <SegmentHandles linker={linker} />
  // line：仅端点圆点（LinkerEndpoints 已渲染）
  return null
}

function CurveControls({ linker }: { linker: LinkerInstance }) {
  const scale = useEditorStore((s) => s.viewport.scale)
  // 拖动期间最新的连线数据（mouseup 提交用）
  const live = useRef<LinkerInstance | null>(null)
  const rod0 = useRef<Konva.Line>(null)
  const rod1 = useRef<Konva.Line>(null)

  if (linker.points.length < 2) return null
  const p0 = linker.points[0]!
  const p1 = linker.points[1]!

  const dragMove = (idx: 0 | 1, e: Konva.KonvaEventObject<DragEvent>): void => {
    e.cancelBubble = true
    const stage = e.target.getStage()
    const pw = pointerWorld(stage)
    if (!pw) return
    e.target.position(pw)
    // 细杆跟随（端点 ↔ 控制点）
    const anchor = idx === 0 ? linker.from : linker.to
    ;(idx === 0 ? rod0 : rod1).current?.points([anchor.x, anchor.y, pw.x, pw.y])
    const points = linker.points.map((p, i) => (i === idx ? { x: pw.x, y: pw.y } : p))
    const next: LinkerInstance = { ...linker, points }
    live.current = next
    // 直操统一通道：liveLinker 重绘 + 文字标签跟随（不重算路由）
    applyLiveLinker(linker.id, next)
    e.target.getLayer()?.batchDraw()
  }

  const dragEnd = (idx: 0 | 1, e: Konva.KonvaEventObject<DragEvent>): void => {
    e.cancelBubble = true
    paintStroke(e, CONTROL_COLOR)
    // 控制点回位（store 提交后 React 重渲染对齐）
    e.target.position(linker.points[idx]!)
    const next = live.current
    live.current = null
    applyLiveLinker(linker.id, null)
    e.target.getLayer()?.batchDraw()
    if (next) useEditorStore.getState().updateLinker(linker.id, { points: next.points })
  }

  return (
    <>
      {/* 端点↔控制点细杆（旧 .linker_control_line：1px #833 opacity .5） */}
      <Line
        ref={rod0}
        points={[linker.from.x, linker.from.y, p0.x, p0.y]}
        stroke={CONTROL_COLOR}
        strokeWidth={1 / scale}
        opacity={0.5}
        listening={false}
      />
      <Line
        ref={rod1}
        points={[linker.to.x, linker.to.y, p1.x, p1.y]}
        stroke={CONTROL_COLOR}
        strokeWidth={1 / scale}
        opacity={0.5}
        listening={false}
      />
      {/* 控制点（旧 .linker_control_point：6×6 白底 #833 边，hover/拖动变红；radius 3→5 增大视觉） */}
      {([0, 1] as const).map((idx) => (
        <Circle
          key={idx}
          x={idx === 0 ? p0.x : p1.x}
          y={idx === 0 ? p0.y : p1.y}
          radius={5 / scale}
          fill="#fff"
          stroke={CONTROL_COLOR}
          strokeWidth={1 / scale}
          hitStrokeWidth={20 / scale}
          draggable
          onMouseEnter={(e) => {
            e.cancelBubble = true
            paintStroke(e, CONTROL_ACTIVE)
          }}
          onMouseLeave={(e) => {
            e.cancelBubble = true
            paintStroke(e, CONTROL_COLOR)
          }}
          onDragStart={(e) => {
            e.cancelBubble = true
            live.current = null
            paintStroke(e, CONTROL_ACTIVE)
          }}
          onDragMove={(e) => dragMove(idx, e)}
          onDragEnd={(e) => dragEnd(idx, e)}
        />
      ))}
    </>
  )
}

/**
 * 段中点拖拽句柄（参考 ProcessOn 效果：可拖轴对齐段的中点显示蓝色方块，
 * 上下/左右移动整段；mousedown 复用 linkerSegment 的整段拖动通道）
 */
function SegmentHandles({ linker }: { linker: LinkerInstance }) {
  const scale = useEditorStore((s) => s.viewport.scale)
  const pts = [linker.from, ...linker.points, linker.to]
  const size = 8 / scale
  const handles: Array<{ segIndex: number; x: number; y: number; vertical: boolean }> = []
  for (let d = 1; d < pts.length; d++) {
    if (!isSegmentDraggable(linker, d)) continue
    // 斜段不可拖（isSegmentDraggable 未查方向，这里补轴对齐判定）
    const vertical = Math.abs(pts[d - 1]!.x - pts[d]!.x) < 0.5
    if (!vertical && Math.abs(pts[d - 1]!.y - pts[d]!.y) >= 0.5) continue
    // 零长段不显示句柄（共线折叠残留）
    if (Math.hypot(pts[d]!.x - pts[d - 1]!.x, pts[d]!.y - pts[d - 1]!.y) < 0.5) continue
    handles.push({
      segIndex: d,
      x: (pts[d - 1]!.x + pts[d]!.x) / 2,
      y: (pts[d - 1]!.y + pts[d]!.y) / 2,
      vertical,
    })
  }
  return (
    <>
      {handles.map(({ segIndex, x, y, vertical }) => (
        <Rect
          key={segIndex}
          id={`seg-handle-${linker.id}-${segIndex}`}
          x={x}
          y={y}
          offsetX={size / 2}
          offsetY={size / 2}
          width={size}
          height={size}
          fill={HANDLE_COLOR}
          stroke="#fff"
          strokeWidth={1 / scale}
          hitStrokeWidth={12 / scale}
          onMouseDown={(e) => {
            e.cancelBubble = true
            const stage = e.target.getStage()
            if (!stage) return
            useEditorStore.getState().selectElement(linker.id)
            startSegmentDrag(linker, segIndex, stage)
            e.target.getLayer()?.batchDraw()
          }}
          onMouseEnter={(e) => {
            e.cancelBubble = true
            ;(e.target as Konva.Shape).fill('#4096ff')
            // 拖拽光标与段方向一致：垂直段左右拖（e-resize）、水平段上下拖（n-resize）
            const container = e.target.getStage()?.container()
            if (container) container.style.cursor = vertical ? 'e-resize' : 'n-resize'
            e.target.getLayer()?.batchDraw()
          }}
          onMouseLeave={(e) => {
            e.cancelBubble = true
            ;(e.target as Konva.Shape).fill(HANDLE_COLOR)
            const container = e.target.getStage()?.container()
            if (container) container.style.cursor = 'default'
            e.target.getLayer()?.batchDraw()
          }}
        />
      ))}
    </>
  )
}
