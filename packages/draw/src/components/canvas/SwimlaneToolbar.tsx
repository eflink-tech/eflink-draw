// 泳道图浮动工具栏：单选 swimlaneV/swimlaneH 时显示在图形左上方，
// 可调泳道数、方向（垂直/水平）、阶段数；布局重建见 buildSwimlaneUpdate。
import { ChevronDown, ChevronUp, Columns, Rows } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { isLinker } from '@/types'
import { worldToScreen } from '@/core/editor/interaction'
import {
  buildSwimlaneUpdate,
  isSwimlane,
  MAX_LANES,
  MAX_STAGES,
  MIN_LANES,
  MIN_STAGES,
  swimlaneLayoutOf,
  type SwimlaneLayout,
} from '@/core/editor/swimlane'

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <span className="flex items-center gap-1">
      <span className="text-xs text-[#555]">{label}</span>
      <span className="min-w-[14px] text-center text-xs text-[#333]">{value}</span>
      <span className="flex flex-col leading-none">
        <button
          className="text-[#888] hover:text-[#333] disabled:opacity-30"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          <ChevronUp size={10} />
        </button>
        <button
          className="text-[#888] hover:text-[#333] disabled:opacity-30"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          <ChevronDown size={10} />
        </button>
      </span>
    </span>
  )
}

export function SwimlaneToolbar() {
  // 订阅 viewport：平移/缩放时工具栏跟随图形
  useEditorStore((s) => s.viewport)
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const elements = useEditorStore((s) => s.document.elements)
  const currentTool = useEditorStore((s) => s.currentTool)
  const id = selectedIds.size === 1 ? [...selectedIds][0]! : null
  const el = id ? elements[id] : undefined
  // 仅选择工具下显示：连线/文本/抓手工具激活时避免与连线预览、编辑浮层视觉冲突
  if (currentTool !== 'select' || !el || isLinker(el) || !isSwimlane(el) || el.locked) return null

  const layout = swimlaneLayoutOf(el)
  const apply = (changes: Partial<SwimlaneLayout>) => {
    const updates = buildSwimlaneUpdate(el, changes)
    // 布局无变化时 buildSwimlaneUpdate 返回空对象，跳过提交避免无效撤销记录
    if (Object.keys(updates).length === 0) return
    useEditorStore.getState().updateElement(el.id, updates)
  }
  const screen = worldToScreen(el.props.x, el.props.y)
  const btn = (active: boolean) =>
    `rounded p-1 ${active ? 'bg-[#e8e8e8] text-[#333]' : 'text-[#666] hover:bg-[#f0f0f0]'}`

  return (
    <div
      className="absolute z-30 flex items-center gap-2 rounded-md border border-[#ddd] bg-white px-2.5 py-1 shadow-md"
      style={{ left: Math.max(4, screen.x), top: Math.max(4, screen.y - 38) }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Stepper
        label="泳道"
        value={layout.laneCount}
        min={MIN_LANES}
        max={MAX_LANES}
        onChange={(n) => apply({ laneCount: n })}
      />
      <div className="h-4 w-px bg-[#e5e5e5]" />
      <button
        title="垂直泳道"
        className={btn(layout.orientation === 'v')}
        onClick={() => apply({ orientation: 'v' })}
      >
        <Columns size={14} />
      </button>
      <button
        title="水平泳道"
        className={btn(layout.orientation === 'h')}
        onClick={() => apply({ orientation: 'h' })}
      >
        <Rows size={14} />
      </button>
      <div className="h-4 w-px bg-[#e5e5e5]" />
      <Stepper
        label="阶段"
        value={layout.stageCount}
        min={MIN_STAGES}
        max={MAX_STAGES}
        onChange={(n) => apply({ stageCount: n })}
      />
    </div>
  )
}
