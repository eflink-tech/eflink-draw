// - 单选一个非连线图形时激活，仅其出向连线（from = 选中图形，向下游）显示流动圆点
// - 拖拽/resize 期间通过节点上的 liveLinker 属性读取实时路径，圆点即时跟随
import { useEffect, useMemo, useRef } from 'react'
import { Circle } from 'react-konva'
import Konva from 'konva'
import { isLinker, type LinkerInstance } from '@/types'
import { useEditorStore } from '@/store/editorStore'
import { getLinkerNode } from '@/core/editor/nodeRegistry'
import {
  CURSOR_SPEED,
  advancePhase,
  cursorDotPhases,
  cursorDotSize,
  cursorLength,
  cursorMaxT,
  cursorPointAt,
  outgoingLinkers,
} from '@/core/editor/linkerCursor'

/** 流动圆点颜色（与连线选中光晕同色系） */
const CURSOR_COLOR = '#1890ff'

interface DotSpec {
  /** 连线 ID */
  id: string
  /** 初始相位列表（动画期间在闭包内推进） */
  phases: number[]
  /** 回绕周期（≥1） */
  maxT: number
  /** 路径长度（速度归一化用） */
  length: number
}

export function LinkerCursorView() {
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const doc = useEditorStore((s) => s.document)
  const scale = useEditorStore((s) => s.viewport.scale)

  // 单选非连线图形 → 仅出向连线（入向连线不显示，向下游流动）
  const attached = useMemo(() => {
    if (selectedIds.size !== 1) return [] as LinkerInstance[]
    const [sid] = selectedIds
    const el = doc.elements[sid]
    if (!el || isLinker(el)) return []
    return outgoingLinkers(doc.elements, sid)
  }, [selectedIds, doc])

  // 每条连线的圆点分布（数量与周期按路径长度）
  const dotSpecs = useMemo<DotSpec[]>(
    () =>
      attached.map((l) => {
        const length = cursorLength(l)
        return { id: l.id, length, phases: cursorDotPhases(length), maxT: cursorMaxT(length) }
      }),
    [attached],
  )

  const circleRefs = useRef<(Konva.Circle | null)[]>([])

  // 流动动画：单个 Konva.Animation 驱动全部圆点（共享一个 rAF）
  useEffect(() => {
    if (dotSpecs.length === 0) return
    const layer = circleRefs.current.find(Boolean)?.getLayer()
    if (!layer) return
    // 相位副本：避免直接改动 props 里的数组
    const phases = dotSpecs.map((d) => [...d.phases])
    const anim = new Konva.Animation((frame) => {
      const dt = (frame?.timeDiff ?? 0) / 1000
      let i = 0
      for (let k = 0; k < dotSpecs.length; k++) {
        const spec = dotSpecs[k]
        if (spec.length <= 0 || phases[k].length === 0) continue
        // 直操期间优先读节点上的实时连线数据
        const live = getLinkerNode(spec.id)?.getAttr('liveLinker') as
          | LinkerInstance
          | undefined
        const l = live ?? (doc.elements[spec.id] as LinkerInstance | undefined)
        if (!l) continue
        const dtT = (CURSOR_SPEED * dt) / spec.length
        for (let j = 0; j < phases[k].length; j++) {
          const c = circleRefs.current[i++]
          if (!c) continue
          const t = advancePhase(phases[k][j], dtT, spec.maxT)
          phases[k][j] = t
          if (t >= 1) {
            c.visible(false)
          } else {
            c.position(cursorPointAt(l, t))
            c.visible(true)
          }
        }
      }
    }, layer)
    anim.start()
    // Konva 的 stop() 返回 Animation 实例，包一层避免成为 effect 返回值
    return () => {
      anim.stop()
    }
  }, [dotSpecs, doc])

  // 展开渲染所有圆点（初始位置即相位位置，首帧不闪跳）
  let idx = 0
  const dots = dotSpecs.flatMap((spec) => {
    const linker = doc.elements[spec.id] as LinkerInstance | undefined
    if (!linker) return []
    const radius = cursorDotSize(linker.lineStyle.lineWidth ?? 2) / 2 / scale
    return spec.phases.map((phase, j) => {
      const i = idx++
      const p = cursorPointAt(linker, phase)
      return (
        <Circle
          key={`${spec.id}-${j}`}
          ref={(n) => {
            circleRefs.current[i] = n
          }}
          x={p.x}
          y={p.y}
          radius={radius}
          fill={CURSOR_COLOR}
          listening={false}
        />
      )
    })
  })

  return <>{dots}</>
}
