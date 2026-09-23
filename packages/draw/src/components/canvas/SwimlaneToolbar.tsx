// 泳道族浮动工具栏：单选泳道图/泳池/泳道/双向泳池时显示在图形左上方，
// 可调泳道数、方向（垂直/水平）、阶段数、颜色（标题背景/泳道背景/边框颜色）；
// 布局重建见 buildSwimlaneUpdate。
import { ChevronDown, ChevronUp, Columns, Rows } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { isLinker } from '@/types'
import { worldToScreen } from '@/core/editor/interaction'
import { ColorButton } from '@/components/common/ColorPicker'
import {
  buildSwimlaneUpdate,
  isSwimlane,
  MAX_LANES,
  MAX_STAGES,
  MIN_LANES,
  MIN_STAGES,
  swimlaneLayoutOf,
  resolveTarget,
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
  const activeTarget = useEditorStore((s) => s.activeTarget)
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

  // 边框颜色变更（lineStyle.lineColor）
  const setBorderColor = (rgb: string | null) => {
    useEditorStore.getState().updateElement(el.id, {
      lineStyle: { ...el.lineStyle, lineColor: rgb ?? '50,50,50' },
    })
  }

  // 背景色：直接作用于画布点选的那块区域（一级标题带 / 二级标题格 / 泳道体）
  const target = resolveTarget(el, activeTarget)
  const targetLabel =
    target.kind === 'title'
      ? '标题'
      : target.kind === 'head'
        ? `二级标题 ${target.index + 1}`
        : `泳道 ${target.index + 1}`
  const targetColor =
    target.kind === 'title'
      ? el.titleColor ?? null
      : target.kind === 'head'
        ? el.laneHeadColors?.[target.index] ?? null
        : el.laneColors?.[target.index] ?? null
  const setTargetColor = (rgb: string | null) => {
    if (target.kind === 'title') {
      apply({ titleColor: rgb ?? undefined })
      return
    }
    const key = target.kind === 'head' ? 'laneHeadColors' : 'laneColors'
    const src = (target.kind === 'head' ? el.laneHeadColors : el.laneColors) ?? []
    const next = [...src]
    if (rgb) next[target.index] = rgb
    else delete next[target.index]
    apply(key === 'laneHeadColors' ? { laneHeadColors: next } : { laneColors: next })
  }

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
      <span
        className="flex items-center gap-1"
        title="在画布上点击标题带 / 二级标题格 / 泳道即可切换目标"
      >
        <span className="text-xs text-[#555]">{targetLabel}</span>
        <ColorButton value={targetColor} onSelect={setTargetColor} transparent />
      </span>
      <span className="flex items-center gap-1">
        <span className="text-xs text-[#555]">边框</span>
        <ColorButton
          value={el.lineStyle.lineColor ?? '50,50,50'}
          onSelect={setBorderColor}
        />
      </span>
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
