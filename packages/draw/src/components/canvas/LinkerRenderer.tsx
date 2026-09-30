// 连线渲染器
// - 单个 Konva Shape（nodeRegistry 注册 Shape 本体与标签 Group，供 liveLinker 直操通道使用）
// - Group 化后追加文字标签（中点居中、白底 Rect + 居中 Text，可命中/选中/双击编辑）
// - sceneFunc 从节点属性 liveLinker 读取拖拽期间的实时数据（直操模式），否则用 props
// - hitFunc 用 12px 粗描边做命中区域
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Group, Rect, Shape, Text } from 'react-konva'
import type Konva from 'konva'
import type { LinkerInstance } from '@/types'
import { rgbToCSS, TEXT_LINE_HEIGHT } from '@/types'
import { fontFamilyCSS } from '@/core/editor/fontMap'
import { KONVA_TEXT_PROPS } from '@/core/editor/textRender'
import { useEditorStore } from '@/store/editorStore'
import { registerLinkerLabelNode, registerLinkerNode } from '@/core/editor/nodeRegistry'
import { strokeLinkerScene, traceLinkerPath } from '@/core/editor/linkerDraw'
import { linkerPathPoints, linkerTextAnchor, locateOnPath, pointOnPathAt } from '@/core/editor/linkerText'
import { LINKER_FONT_DEFAULTS } from '@/core/editor/linker'
import { pointerWorld, shapeBorderWidth } from '@/core/editor/interaction'
import { hitLinkerSegment, isSegmentDraggable, startSegmentDrag } from '@/core/editor/linkerSegment'

interface LinkerRendererProps {
  linker: LinkerInstance
}

const HIT_WIDTH = 12
/** 文字标签内边距（世界坐标） */
const LABEL_PAD = 2

export const LinkerRenderer = memo(function LinkerRenderer({ linker }: LinkerRendererProps) {
  const selected = useEditorStore((s) => s.selectedIds.has(linker.id))
  const scale = useEditorStore((s) => s.viewport.scale)
  const shapeRef = useRef<Konva.Shape>(null)

  useEffect(() => {
    registerLinkerNode(linker.id, shapeRef.current)
    return () => registerLinkerNode(linker.id, null)
  }, [linker.id])

  const sceneFunc = useCallback(
    (context: unknown, shape: Konva.Shape) => {
      const ctx = context as unknown as CanvasRenderingContext2D
      const live = shape.getAttr('liveLinker') as LinkerInstance | undefined
      // junction 吸附目标高亮（端点拖拽期间由 LinkerEndpoints 直操 setAttr）
      const snapHost = shape.getAttr('snapHost') === true
      const l = live ?? linker
      strokeLinkerScene(ctx, l, {
        // 选中不改色：原线保持自身颜色，以蓝色光晕表示选中态
        color: rgbToCSS(l.lineStyle.lineColor ?? '50,50,50'),
        lineWidth: l.lineStyle.lineWidth ?? 2,
        dash: l.lineStyle.lineStyle ?? 'solid',
        getShapeBorder: shapeBorderWidth,
        halo: snapHost
          ? { color: 'rgba(24, 144, 255, 0.45)', extraWidth: 8 / scale }
          : selected
            ? { color: 'rgba(24, 144, 255, 0.35)', extraWidth: 6 / scale }
            : null,
      })
    },
    [linker, selected, scale],
  )

  const hitFunc = useCallback(
    (context: unknown, shape: Konva.Shape) => {
      const ctx = context as unknown as CanvasRenderingContext2D & {
        fillStrokeShape: (shape: Konva.Shape) => void
      }
      const live = shape.getAttr('liveLinker') as LinkerInstance | undefined
      traceLinkerPath(ctx, live ?? linker)
      // fillStrokeShape 走 Konva colorKey 命中；hitStrokeWidth 已放大命中宽度
      ctx.fillStrokeShape(shape)
    },
    [linker],
  )

  return (
    <Group>
      <Shape
        ref={shapeRef}
        sceneFunc={sceneFunc}
        hitFunc={hitFunc}
        stroke="#000"
        strokeWidth={linker.lineStyle.lineWidth ?? 2}
        hitStrokeWidth={HIT_WIDTH}
        perfectDrawEnabled={false}
        id={linker.id}
        name="linker"
        onMouseDown={(e) => {
          e.cancelBubble = true
          const st = useEditorStore.getState()
          st.selectElement(linker.id, e.evt.ctrlKey || e.evt.metaKey || e.evt.shiftKey)
          // 未移动则 up 不提交，纯点击仍只是选中）
          if (linker.linkerType === 'broken') {
            const stage = e.target.getStage()
            const pw = pointerWorld(stage)
            if (stage && pw) {
              const hit = hitLinkerSegment(linker, pw.x, pw.y, st.viewport.scale)
              if (hit && hit.axisAligned && isSegmentDraggable(linker, hit.segIndex)) {
                startSegmentDrag(linker, hit.segIndex, stage)
              }
            }
          }
        }}
        onMouseMove={(e) => {
          // 段拖动期间（liveLinker 非空）光标由 startSegmentDrag 接管，此处按旧
          // props 计算只会误置回 default，跳过
          if (linker.linkerType !== 'broken') return
          if ((e.target as Konva.Shape).getAttr('liveLinker')) return
          const stage = e.target.getStage()
          const container = stage?.container()
          const pw = pointerWorld(stage)
          if (!stage || !container || !pw) return
          const hit = hitLinkerSegment(linker, pw.x, pw.y, scale)
          const middle = hit ? isSegmentDraggable(linker, hit.segIndex) : false
          const cursor =
            middle && hit!.axisAligned === 'v'
              ? 'e-resize'
              : middle && hit!.axisAligned === 'h'
                ? 'n-resize'
                : 'default'
          if (container.style.cursor !== cursor) container.style.cursor = cursor
        }}
        onMouseLeave={(e) => {
          // 段拖动期间不重置（同上，由 startSegmentDrag 的 up 恢复）
          if ((e.target as Konva.Shape).getAttr('liveLinker')) return
          const container = e.target.getStage()?.container()
          if (container) container.style.cursor = 'default'
        }}
        onDblClick={(e) => {
          e.cancelBubble = true
          // 每段直线独立文字：双击落在哪段就编辑哪段的文字（段下标随折线走）
          const stage = e.target.getStage()
          const pw = stage ? pointerWorld(stage) : null
          const scale = useEditorStore.getState().viewport.scale
          let seg = 0
          if (pw) {
            const hit = hitLinkerSegment(linker, pw.x, pw.y, scale)
            if (hit) seg = hit.segIndex
          }
          useEditorStore.getState().setTextEdit({ id: linker.id, block: -1, seg })
        }}
      />
      {linker.text && (
        <LinkerLabel key="legacy" linker={linker} labelKey="legacy" text={linker.text}
          pos={linkerTextAnchor(linker)} />
      )}
      {(linker.segTexts ?? [])
        .filter((st) => st.text)
        .map((st) => (
          <LinkerLabel
            key={`seg-${st.seg}`}
            linker={linker}
            labelKey={`seg-${st.seg}`}
            seg={st.seg}
            text={st.text}
            pos={linkerTextAnchor(linker, st.seg)}
          />
        ))}
    </Group>
  )
})

/**
 * 连线文字垂直居中：Konva10 按 alphabetic 基线对齐行盒，中文字形墨迹在行盒内偏下，
 * 无法用固定常量校准（随字体而变）。这里用 canvas measureText 实测墨迹中心
 * （actualBoundingBox），算出文字节点顶部应放的 y，使墨迹中心精确落在标签锚点（线上）。
 */
const inkOffsetCache = new Map<string, number>()
function labelInkTopOffset(text: string, fontCSS: string, fontSize: number): number {
  const sample = text.split('\n').reduce((a, b) => (b.length > a.length ? b : a), '') || '否'
  const key = `${fontCSS}@${fontSize}:${sample}`
  const cached = inkOffsetCache.get(key)
  if (cached !== undefined) return cached
  let v = -(fontSize * TEXT_LINE_HEIGHT) / 2 // 量测失败时退回「行盒居中」
  try {
    const ctx = document.createElement('canvas').getContext('2d')
    if (ctx) {
      ctx.font = `${fontSize}px ${fontCSS}`
      const m = ctx.measureText(sample)
      // Konva10：基线在行盒内的位置 = (ascent-descent)/2 + lineHeight/2
      const baselineInBox =
        ((m.fontBoundingBoxAscent ?? m.actualBoundingBoxAscent ?? 0) -
          (m.fontBoundingBoxDescent ?? m.actualBoundingBoxDescent ?? 0)) / 2 +
        (fontSize * TEXT_LINE_HEIGHT) / 2
      const inkCenterFromBaseline = ((m.actualBoundingBoxAscent ?? fontSize * 0.8) -
        (m.actualBoundingBoxDescent ?? 0)) / 2
      v = inkCenterFromBaseline - baselineInBox // 文字节点顶部 y（相对标签锚点）
    }
  } catch {
    // 非 DOM 环境：退回行盒居中
  }
  inkOffsetCache.set(key, v)
  return v
}

/** 连线文字标签（整线文字 / 分段文字通用；白底居中） */
function LinkerLabel({
  linker,
  labelKey,
  text,
  pos,
  seg,
}: {
  linker: LinkerInstance
  labelKey: string
  text: string
  pos: { x: number; y: number }
  seg?: number
}) {
  const font = { ...LINKER_FONT_DEFAULTS, ...linker.fontStyle }
  // 背景尺寸：Text 挂载后测量回填（首次渲染 0×0，layout effect 后立即修正，无闪烁）
  const [box, setBox] = useState({ w: 0, h: 0 })
  // 拖拽中高亮（浅蓝底 + 蓝描边）
  const [dragging, setDragging] = useState(false)
  const textRef = useRef<Konva.Text>(null)
  // 注册标签 Group：拖拽期间 applyLiveLinker 直操同步位置（不经 React 重渲染）
  const groupRef = useRef<Konva.Group>(null)
  // 贴线拖拽约束缓存：dragstart 时算一次（拖拽期间连线几何不变）
  const dragCtxRef = useRef<{ pts: { x: number; y: number }[] } | null>(null)

  useEffect(() => {
    registerLinkerLabelNode(linker.id, groupRef.current, labelKey)
    return () => registerLinkerLabelNode(linker.id, null, labelKey)
  }, [linker.id, labelKey])

  // 直操通道（applyLiveLinker）在拖线期间直接改节点位置，而 react-konva 仅在
  // props 值变化时才写节点：若锚点值恰好不变（如移动图形但文字所在段未动），
  // 节点会停留在直操期间的近似位置。linker 引用每次 store 更新都变化，借它强制回位。
  useEffect(() => {
    groupRef.current?.position({ x: pos.x, y: pos.y })
  }, [linker, pos.x, pos.y])

  useLayoutEffect(() => {
    const t = textRef.current
    if (!t) return
    const w = t.textWidth
    const h = t.textHeight
    setBox((prev) => (prev.w === w && prev.h === h ? prev : { w, h }))
  }, [text, font.size, font.bold, font.italic, font.fontFamily])

  // 本标签编辑中 → 隐藏（由 TextEditorOverlay 呈现编辑框）
  const editingThis = useEditorStore(
    (s) => s.textEdit?.id === linker.id && (s.textEdit.seg ?? undefined) === seg,
  )
  if (editingThis) return null

  return (
    <Group
      ref={groupRef}
      x={pos.x}
      y={pos.y}
      name={seg != null ? `seg-${seg}` : undefined}
      draggable={!linker.locked}
      onDragStart={(e) => {
        e.cancelBubble = true
        // 缓存折线点列：拖拽期间连线几何不变，避免每帧重复采样
        dragCtxRef.current = { pts: linkerPathPoints(linker) }
        setDragging(true)
      }}
      // 贴线约束：拖到的位置（父坐标 = 世界坐标，与 dragEnd 同口径）投影回线身
      // 最近点，标签只能沿线来回滑动（不可拖离线条）
      onDragMove={(e) => {
        e.cancelBubble = true
        const ctx = dragCtxRef.current
        if (!ctx) return
        const g = e.target
        const p = pointOnPathAt(ctx.pts, locateOnPath(ctx.pts, g.x(), g.y()).t)
        g.position(p)
      }}
      onDragEnd={(e) => {
        e.cancelBubble = true
        setDragging(false)
        dragCtxRef.current = null
        // Group 位置（父链无 transform = 世界坐标）反解为沿线弧长参数落库；
        // 图形移动 / 路由重算后文字按参数自动跟随。updateLinker 自带撤销历史。
        // 拖拽已被约束贴线，法向不再变化（保持原 normal，首次拖动 = 0）——只改 t
        const off = locateOnPath(linkerPathPoints(linker), e.target.x(), e.target.y())
        const prev =
          seg != null
            ? linker.segTexts?.find((s) => s.seg === seg)?.offset
            : linker.textOffset
        const next = { t: off.t, normal: prev?.normal ?? 0 }
        const st = useEditorStore.getState()
        if (seg != null) {
          st.updateLinker(linker.id, {
            segTexts: (linker.segTexts ?? []).map((s) =>
              s.seg === seg ? { ...s, offset: next } : s,
            ),
          })
        } else {
          // 同时清掉旧绝对坐标字段，锚点统一走 textOffset
          st.updateLinker(linker.id, { textOffset: next, textPos: undefined })
        }
      }}
      onMouseEnter={(e) => {
        if (linker.locked) return
        e.cancelBubble = true
        const container = e.target.getStage()?.container()
        if (container) container.style.cursor = 'move'
      }}
      onMouseLeave={(e) => {
        e.cancelBubble = true
        const container = e.target.getStage()?.container()
        if (container) container.style.cursor = 'default'
      }}
      onMouseDown={(e) => {
        e.cancelBubble = true
        useEditorStore
          .getState()
          .selectElement(linker.id, e.evt.ctrlKey || e.evt.metaKey || e.evt.shiftKey)
      }}
      onDblClick={(e) => {
        e.cancelBubble = true
        useEditorStore.getState().setTextEdit({ id: linker.id, block: -1, seg })
      }}
    >
      <Rect
        x={-box.w / 2 - LABEL_PAD}
        y={-box.h / 2 - LABEL_PAD}
        width={box.w + LABEL_PAD * 2}
        height={box.h + LABEL_PAD * 2}
        fill={dragging ? '#e6f7ff' : '#ffffff'}
        stroke={dragging ? '#1890ff' : undefined}
        strokeWidth={dragging ? 1 : 0}
      />
      <Text
        ref={textRef}
        x={-box.w / 2}
        y={labelInkTopOffset(linker.text, fontFamilyCSS(font.fontFamily), font.size ?? 13)}
        text={text}
        fontSize={font.size}
        fontFamily={fontFamilyCSS(font.fontFamily)}
        fontStyle={
          [font.bold ? 'bold' : '', font.italic ? 'italic' : ''].filter(Boolean).join(' ') ||
          'normal'
        }
        textDecoration={font.underline ? 'underline' : ''}
        fill={rgbToCSS(font.color ?? '50,50,50')}
        lineHeight={TEXT_LINE_HEIGHT}
        {...KONVA_TEXT_PROPS}
      />
    </Group>
  )
}
