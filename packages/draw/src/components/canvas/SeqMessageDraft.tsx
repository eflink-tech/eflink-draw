// UML 时序消息拖拽草稿预览：水平虚线/自消息回环 + 目标高亮 + 箭头
import { Group, Line, Circle } from 'react-konva'
import { useEditorStore } from '@/store/editorStore'
import { isLinker, type ElementInstance } from '@/types'
import { barEdgeX, resolveSeqDrop, selfLoopPoints, SEQ_LOOP_H, SEQ_LOOP_W } from '@/core/editor/seqMessage'

const DRAFT_COLOR = '#1890ff'

/** 实心三角箭头（tip 指向 tx 方向） */
function ArrowHead({ x, y, dirX }: { x: number; y: number; dirX: number }) {
  const s = 10
  const pts =
    dirX >= 0
      ? [x - s, y - s * 0.45, x, y, x - s, y + s * 0.45]
      : [x + s, y - s * 0.45, x, y, x + s, y + s * 0.45]
  return <Line points={pts} closed fill="#505050" strokeWidth={0} />
}

export function SeqMessageDraft() {
  const draft = useEditorStore((s) => s.seqDraft)
  const elements = useEditorStore((s) => s.document.elements)
  if (!draft) return null
  const src = elements[draft.fromId]
  if (!src || isLinker(src)) return null

  const fromEdge = barEdgeX(src.props, draft.dir)
  const drop = resolveSeqDrop(elements as Record<string, ElementInstance>, draft.fromId, draft.y, draft.cur)
  const dash = [6, 4]

  // 自消息：回环预览（出缘 → 外 → 下 → 折回）
  if (drop?.kind === 'self') {
    const loop = selfLoopPoints((src as ElementInstance).props, draft.dir, draft.y, SEQ_LOOP_W, SEQ_LOOP_H)
    const pts = [fromEdge, draft.y, ...loop.flatMap((p) => [p.x, p.y]), fromEdge, draft.y + SEQ_LOOP_H]
    const tipDir = draft.dir === 1 ? -1 : 1
    return (
      <Group>
        <Line points={pts} stroke={DRAFT_COLOR} strokeWidth={1.5} dash={dash} />
        <ArrowHead x={fromEdge} y={draft.y + SEQ_LOOP_H} dirX={tipDir} />
      </Group>
    )
  }

  // 水平消息：虚线 + 终点箭头；命中目标时高亮落点
  const endX = draft.cur.x
  const dirX = endX >= fromEdge ? 1 : -1
  return (
    <Group>
      <Line points={[fromEdge, draft.y, endX, draft.y]} stroke={DRAFT_COLOR} strokeWidth={1.5} dash={dash} />
      <ArrowHead x={endX} y={draft.y} dirX={dirX} />
      {drop?.kind === 'msg' && (
        <Circle
          x={barEdgeX((elements[drop.toId] as ElementInstance).props, drop.toDir)}
          y={draft.y}
          radius={7}
          stroke={DRAFT_COLOR}
          strokeWidth={1.5}
        />
      )}
    </Group>
  )
}
