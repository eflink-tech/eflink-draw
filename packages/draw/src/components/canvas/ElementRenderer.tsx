// 元素渲染器（直操模式）
//   mouseup 时一次性提交 store（等价 Model.updateMulti）。
// 吸附线 / 坐标 tip / 关联连线跟随 同样走直操通道，避免 React 逐帧重渲染。
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Shape, Text, Rect, Circle, Group } from 'react-konva'
import type Konva from 'konva'
import type { ElementInstance } from '@/types'
import { isLinker, rgbToCSS, DEFAULT_FONT_SIZE, TEXT_LINE_HEIGHT } from '@/types'
import { traceActions } from '@/core/utils/pathActions'
import { useEditorStore } from '@/store/editorStore'
import { snapLine, type SnapResult } from '@/core/editor/alignment'
import { makeShapeSceneFunc } from '@/core/editor/shapePaint'
import {
  createLinkerInstance,
  getAnchorPoints,
  getLinkerPoints,
  getLocalAnchors,
  snapLinkerEndpoint,
} from '@/core/editor/linker'
import {
  attachedLinkerIds,
  routeAttachedLinkers,
  type LiveShapeState,
} from '@/core/editor/documentOps'
import { getElementNode, getLinkerNode, registerElementNode } from '@/core/editor/nodeRegistry'
import { applyLiveLinker } from '@/core/editor/liveLinker'
import { createFrameScheduler } from '@/core/editor/dragPerf'
import { freezeStaticScene, unfreezeStaticScene } from '@/core/editor/sceneFreeze'
import {
  clearSnapLines,
  hideEndpointPreview,
  hideTip,
  showEndpointPreview,
  showSnapLines,
  showTip,
} from '@/core/editor/uiOverlay'
import {
  allShapes,
  hitElementId,
  makeStoreRectGetter,
  pointerWorld,
  worldToScreen,
} from '@/core/editor/interaction'
import { LINKER_DEFAULTS } from '@/core/editor/linker'
import { hitTextBlock, evalTextBlockRect } from '@/core/editor/textEdit'
import { fontFamilyCSS } from '@/core/editor/fontMap'
import { layoutVerticalText } from '@/core/editor/verticalText'
import { rotateCursor } from '@/core/editor/rotateCursor'
import { computeResizeRect } from '@/core/editor/resizeOps'
import { setTextDisplayDrag, useIsTextDisplayDrag } from '@/core/editor/textDisplayDrag'
import { KONVA_TEXT_PROPS, snapTextCoord } from '@/core/editor/textRender'

interface ElementRendererProps {
  element: ElementInstance
  /** 主画布用 html 覆盖层绘字；导出等离屏场景保持 konva */
  textEngine?: 'konva' | 'html'
}

type HandleDir = 'tl' | 'tr' | 'br' | 'bl' | 'tm' | 'bm' | 'ml' | 'mr'

/** 直操合帧：同一手势多次 pointermove 只在下一帧落地一次 */
const directManipFrame = createFrameScheduler()

function freezeMovingShapes(shapeIds: Iterable<string>): void {
  const ids = [...shapeIds]
  freezeStaticScene({
    movingShapeIds: ids,
    liveLinkerIds: attachedLinkerIds(useEditorStore.getState().document.elements, ids),
  })
}

function batchDrawLinkerLayer(linkerId: string | undefined): void {
  if (!linkerId) return
  getLinkerNode(linkerId)?.getLayer()?.batchDraw()
}

/** 清除连线的 live 直操数据并重绘（统一通道，含标签回位由 React 重渲染接管） */
function clearLiveLinkers(shapeIds: Iterable<string>): void {
  const st = useEditorStore.getState()
  let lastId: string | undefined
  for (const lid of attachedLinkerIds(st.document.elements, shapeIds)) {
    applyLiveLinker(lid, null, { draw: false })
    lastId = lid
  }
  batchDrawLinkerLayer(lastId)
}

/** 直操更新附着连线（livePos 为世界坐标目标状态，可携带 live w/h；标签位置同步跟随） */
function updateLiveLinkers(livePos: Map<string, LiveShapeState>): void {
  const st = useEditorStore.getState()
  const updated = routeAttachedLinkers(st.document.elements, livePos)
  let lastId: string | undefined
  for (const [lid, nl] of updated) {
    applyLiveLinker(lid, nl, { draw: false })
    lastId = lid
  }
  batchDrawLinkerLayer(lastId)
}

// resizeDir 默认仅四角（四边中点是连线锚点，非 resize 手柄）
const HANDLE_DIRS: HandleDir[] = ['tl', 'tr', 'br', 'bl']

const HANDLE_CURSOR: Record<HandleDir, string> = {
  tl: 'nw-resize',
  tr: 'ne-resize',
  br: 'se-resize',
  bl: 'sw-resize',
  tm: 'n-resize',
  bm: 's-resize',
  ml: 'w-resize',
  mr: 'e-resize',
}

const SELECT_COLOR = '#833'
const ROT_ICON_SCREEN = 18
const ROT_HIGHLIGHT = '#1a6fd4'

/** 旋转手柄中心：沿右上角 45° 对角线外展，与 tr 缩放手柄对称 */
function rotateHandleHome(w: number, hs: number, rotSize: number, scale: number): { x: number; y: number } {
  const along = (hs / 2 + 3 / scale + rotSize / 2) / Math.SQRT2
  return { x: w + along, y: -along }
}

/** 绘制弧形双箭头旋转图标（右上角外侧，弧绕角点外展） */
function paintRotateIcon(
  ctx: CanvasRenderingContext2D,
  size: number,
  color: string,
  lineWidth: number,
): void {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.36
  ctx.save()
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = color
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  // 从左侧（沿顶边）经上方绕到下方（沿右边），贴合右上角外角
  const start = Math.PI
  const end = Math.PI / 2
  ctx.beginPath()
  ctx.arc(cx, cy, r, start, end, false)
  ctx.stroke()
  const arrow = (angle: number, clockwise: boolean): void => {
    const ax = cx + r * Math.cos(angle)
    const ay = cy + r * Math.sin(angle)
    const tangent = clockwise ? angle + Math.PI / 2 : angle - Math.PI / 2
    const len = size * 0.17
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(ax + len * Math.cos(tangent - 0.45), ay + len * Math.sin(tangent - 0.45))
    ctx.moveTo(ax, ay)
    ctx.lineTo(ax + len * Math.cos(tangent + 0.45), ay + len * Math.sin(tangent + 0.45))
    ctx.stroke()
  }
  arrow(start, true)
  arrow(end, false)
  ctx.restore()
}

export const ElementRenderer = memo(function ElementRenderer({ element, textEngine = 'konva' }: ElementRendererProps) {
  const { props, path, fontStyle, textBlock, shapeStyle } = element
  const selected = useEditorStore((s) => s.selectedIds.has(element.id))
  const hovered = useEditorStore((s) => s.hoveredId === element.id)
  const scale = useEditorStore((s) => s.viewport.scale)
  const currentTool = useEditorStore((s) => s.currentTool)
  const textEditState = useEditorStore((s) => s.textEdit)
  const editingBlock =
    textEditState?.id === element.id ? textEditState.block : null
  const [rotHover, setRotHover] = useState(false)

  const groupRef = useRef<Konva.Group>(null)
  const shapeRef = useRef<Konva.Shape>(null)
  const textRef = useRef<Konva.Text>(null)
  // 选择框/手柄节点表（resize 直操时手动重排）
  const selNodes = useRef<Record<string, Konva.Node | null>>({})
  // 锚点圆点/命中区节点表（resize 直操时按 live 尺寸重排）
  const anchorNodes = useRef<Record<string, Konva.Node | null>>({})

  useEffect(() => {
    registerElementNode(element.id, groupRef.current)
    return () => registerElementNode(element.id, null)
  }, [element.id])

  // ===== 路径绘制（sceneFunc + hitFunc 共用） =====
  const tracePath = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.beginPath()
      traceActions(ctx, path, { w, h })
    },
    [path],
  )

  // w/h 从 shape 实时读取 —— resize 直操期间无需重建（与创建预览共用绘制）
  const sceneFunc = useMemo(() => makeShapeSceneFunc(element), [element])

  // 命中区 = 图形本身（fillStrokeShape 走 Konva colorKey 命中机制）
  // container 图形（braces/parentheses/备注 等装饰性路径）补充包围盒矩形，
  const isContainerShape = element.attribute?.container === true
  const hitFunc = useCallback(
    (context: unknown, shape: Konva.Shape) => {
      const ctx = context as unknown as CanvasRenderingContext2D & {
        fillStrokeShape: (shape: Konva.Shape) => void
      }
      tracePath(ctx, shape.width(), shape.height())
      if (isContainerShape) {
        // 补充包围盒矩形：fillStrokeShape 用 Konva Shape 的 fill/stroke 属性
        // 做 colorKey 命中，不影响 sceneFunc 的视觉渲染
        ctx.rect(0, 0, shape.width(), shape.height())
      }
      ctx.fillStrokeShape(shape)
    },
    [tracePath, isContainerShape],
  )

  // ===== 拖拽移动（直操 + 吸附 + 多选 + 连线跟随） =====
  // Konva Group 采用中心定位模型（x/y = 图形中心，offset = w/2,h/2），
  // store 的 props.x/y 仍是左上角，直操读写按下面两个 helper 换算。
  const groupLeft = (n: Konva.Group): number => n.x() - n.offsetX()
  const groupTop = (n: Konva.Group): number => n.y() - n.offsetY()
  const setGroupTopLeft = (n: Konva.Group, x: number, y: number): void => {
    n.position({ x: x + n.offsetX(), y: y + n.offsetY() })
  }

  const handleDragStart = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true
      const st = useEditorStore.getState()
      if (!st.selectedIds.has(element.id)) {
        st.selectElement(element.id, e.evt.ctrlKey || e.evt.metaKey || e.evt.shiftKey)
      }
      if (textEngine === 'html') {
        const st2 = useEditorStore.getState()
        const ids = [...st2.selectedIds].filter((id) => {
          const el = st2.document.elements[id]
          return el != null && !isLinker(el)
        })
        if (!ids.includes(element.id)) ids.push(element.id)
        setTextDisplayDrag(ids, true)
      }
    },
    [element.id, textEngine],
  )

  const handleDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true
      const node = groupRef.current
      if (!node) return
      const st = useEditorStore.getState()
      const movingIds = [...st.selectedIds].filter((id) => {
        const el = st.document.elements[id]
        return el != null && !isLinker(el)
      })
      freezeMovingShapes(movingIds.length > 0 ? movingIds : [element.id])

      const dx = groupLeft(node) - element.props.x
      const dy = groupTop(node) - element.props.y

      const live = new Map<
        string,
        { node: Konva.Group | undefined; el: ElementInstance; x: number; y: number }
      >()
      for (const sid of st.selectedIds) {
        const el = st.document.elements[sid]
        if (!el || isLinker(el)) continue
        live.set(sid, {
          node: getElementNode(sid),
          el,
          x: el.props.x + dx,
          y: el.props.y + dy,
        })
      }
      if (live.size === 0) {
        live.set(element.id, { node, el: element, x: element.props.x + dx, y: element.props.y + dy })
      }

      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity
      for (const L of live.values()) {
        minX = Math.min(minX, L.x)
        minY = Math.min(minY, L.y)
        maxX = Math.max(maxX, L.x + L.el.props.w)
        maxY = Math.max(maxY, L.y + L.el.props.h)
      }
      const t = { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
      const shapes = Object.values(st.document.elements).filter(
        (el) => !isLinker(el),
      ) as ElementInstance[]
      const snap: SnapResult = snapLine(t, [...st.selectedIds], shapes)
      const shiftX = t.x - minX
      const shiftY = t.y - minY

      for (const L of live.values()) {
        if (L.node) setGroupTopLeft(L.node, L.x + shiftX, L.y + shiftY)
      }

      showSnapLines(snap, st.viewport.scale)
      const stage = node.getStage()
      const pp = stage?.getPointerPosition()
      if (pp) {
        showTip(pp.x, pp.y, `${Math.round(t.x)}, ${Math.round(t.y)}`)
      }

      const livePos = new Map<string, LiveShapeState>()
      for (const [sid, L] of live) {
        livePos.set(sid, { x: L.x + shiftX, y: L.y + shiftY })
      }
      // 连线重路由较贵：合到下一帧；吸附/位移必须同步，否则会先画出未吸附位置
      directManipFrame.schedule(() => {
        updateLiveLinkers(livePos)
      })
    },
    [element],
  )

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true
      try {
        directManipFrame.flush()
        unfreezeStaticScene()
        const node = groupRef.current
        if (!node) return
        const st = useEditorStore.getState()
        clearSnapLines()
        hideTip()
        const dx = groupLeft(node) - element.props.x
        const dy = groupTop(node) - element.props.y
        if (dx !== 0 || dy !== 0) {
          const ids = [...st.selectedIds].filter((id) => {
            const el = st.document.elements[id]
            return el != null && !isLinker(el)
          })
          st.moveElements(ids.length > 0 ? ids : [element.id], dx, dy)
        }
        clearLiveLinkers([...st.selectedIds, element.id])
        if (textEngine === 'html') {
          const ids = [...st.selectedIds].filter((id) => {
            const el = st.document.elements[id]
            return el != null && !isLinker(el)
          })
          if (!ids.includes(element.id)) ids.push(element.id)
          setTextDisplayDrag(ids, false)
        }
      } finally {
        unfreezeStaticScene()
      }
    },
    [element, textEngine],
  )

  // ===== 调整手柄（resize 直操） =====
  const resizeState = useRef({ px: 0, py: 0, ex: 0, ey: 0, ew: 0, eh: 0 })

  /** 重新排列选择框与手柄（跟随 live 尺寸） */
  const syncSelectionLayout = useCallback((w: number, h: number, hs: number) => {
    const n = selNodes.current
    const pos: Record<string, { x: number; y: number }> = {
      tl: { x: -hs / 2, y: -hs / 2 },
      tr: { x: w - hs / 2, y: -hs / 2 },
      br: { x: w - hs / 2, y: h - hs / 2 },
      bl: { x: -hs / 2, y: h - hs / 2 },
      tm: { x: w / 2, y: -hs / 2 },
      bm: { x: w / 2, y: h - hs / 2 },
      ml: { x: -hs / 2, y: h / 2 },
      mr: { x: w - hs / 2, y: h / 2 },
    }
    for (const d of HANDLE_DIRS) {
      n[`h-${d}`]?.position(pos[d])
    }
    const box = n['sel-box'] as Konva.Rect | null
    // 贴边（与 JSX 初始渲染一致，避免 resize 瞬间外扩跳变）
    box?.position({ x: 0, y: 0 })
    box?.size({ width: w, height: h })
    const st = useEditorStore.getState()
    const rotSize = ROT_ICON_SCREEN / st.viewport.scale
    const hsLocal = 8 / st.viewport.scale
    const rotHome = rotateHandleHome(w, hsLocal, rotSize, st.viewport.scale)
    const rot = n['rot-handle'] as Konva.Shape | null
    rot?.position({ x: rotHome.x - rotSize / 2, y: rotHome.y - rotSize / 2 })
    rot?.size({ width: rotSize, height: rotSize })
  }, [])

  /** 重新排列锚点圆点/命中区（按 live 尺寸重算局部坐标） */
  const syncAnchorLayout = useCallback(
    (w: number, h: number) => {
      const n = anchorNodes.current
      getLocalAnchors(element, w, h).forEach((a, idx) => {
        const dot = n[`dot-${idx}`]
        dot?.position({ x: a.x, y: a.y })
        const hit = n[`hit-${idx}`] as Konva.Rect | null
        if (hit) hit.position({ x: a.x - hit.width() / 2, y: a.y - hit.height() / 2 })
      })
    },
    [element],
  )

  // mousedown 即记录起点（dragstart 要等 >3px 位移，会损失精度）
  const handleResizeMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      e.cancelBubble = true
      const stage = e.target.getStage()
      const pp = stage?.getPointerPosition()
      if (!pp) return
      resizeState.current = {
        px: pp.x,
        py: pp.y,
        ex: props.x,
        ey: props.y,
        ew: props.w,
        eh: props.h,
      }
    },
    [props.x, props.y, props.w, props.h],
  )

  const handleResizeStart = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true
      if (textEngine === 'html') setTextDisplayDrag([element.id], true)
    },
    [element.id, textEngine],
  )

  const handleResizeMove = useCallback(
    (dir: HandleDir, e: Konva.KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true
      const stage = e.target.getStage()
      const pp = stage?.getPointerPosition()
      if (!pp) return
      freezeMovingShapes([element.id])
      const st = useEditorStore.getState()
      const s0 = resizeState.current
      const dx = (pp.x - s0.px) / st.viewport.scale
      const dy = (pp.y - s0.py) / st.viewport.scale
      const { x: ex, y: ey, w: ew, h: eh } = computeResizeRect(
        { x: s0.ex, y: s0.ey, w: s0.ew, h: s0.eh },
        dx,
        dy,
        dir,
        e.evt.shiftKey,
      )

      const node = groupRef.current
      node?.offset({ x: ew / 2, y: eh / 2 })
      if (node) setGroupTopLeft(node, ex, ey)
      shapeRef.current?.size({ width: ew, height: eh })
      textRef.current?.size({ width: ew, height: eh })
      syncSelectionLayout(ew, eh, 8 / st.viewport.scale)
      syncAnchorLayout(ew, eh)

      const screen = worldToScreen(ex, ey)
      showTip(screen.x, screen.y, `${Math.round(ex)}, ${Math.round(ey)}; ${Math.round(ew)} × ${Math.round(eh)}`)

      directManipFrame.schedule(() => {
        updateLiveLinkers(new Map([[element.id, { x: ex, y: ey, w: ew, h: eh }]]))
      })
    },
    [element.id, props.x, props.y, syncSelectionLayout, syncAnchorLayout],
  )

  const handleResizeEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true
      try {
        directManipFrame.flush()
        unfreezeStaticScene()
        hideTip()
        const st = useEditorStore.getState()
        const node = groupRef.current
        const shape = shapeRef.current
        const x = node ? groupLeft(node) : props.x
        const y = node ? groupTop(node) : props.y
        const w = shape?.width() ?? props.w
        const h = shape?.height() ?? props.h
        st.resizeElement(element.id, x, y, w, h)
        clearLiveLinkers([element.id])
        if (textEngine === 'html') setTextDisplayDrag([element.id], false)
      } finally {
        unfreezeStaticScene()
      }
    },
    [element.id, props.x, props.y, props.w, props.h, textEngine],
  )

  // ===== 旋转手柄（直操，增量角度 —— 按下不跳变） =====
  const rotateState = useRef({ startAngle: 0, startPointer: 0 })

  const handleRotateStart = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true
      if (textEngine === 'html') setTextDisplayDrag([element.id], true)
      const stage = e.target.getStage()
      const pw = pointerWorld(stage)
      const node = groupRef.current
      if (!pw || !node) return
      rotateState.current = {
        startAngle: (node.rotation() * Math.PI) / 180,
        startPointer: Math.atan2(pw.y - node.y(), pw.x - node.x()),
      }
    },
    [element.id, textEngine],
  )

  const handleRotateMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true
      freezeMovingShapes([element.id])
      const stage = e.target.getStage()
      const pw = pointerWorld(stage)
      if (!pw) return
      const node = groupRef.current
      if (!node) return
      const shape = shapeRef.current
      const ew = shape?.width() ?? props.w
      const st = useEditorStore.getState()
      const rotSize = ROT_ICON_SCREEN / st.viewport.scale
      const hsLocal = 8 / st.viewport.scale
      const rotHome = rotateHandleHome(ew, hsLocal, rotSize, st.viewport.scale)
      e.target.position({ x: rotHome.x - rotSize / 2, y: rotHome.y - rotSize / 2 })
      const cx = node.x()
      const cy = node.y()
      const pointer = Math.atan2(pw.y - cy, pw.x - cx)
      let delta = pointer - rotateState.current.startPointer
      while (delta > Math.PI) delta -= Math.PI * 2
      while (delta < -Math.PI) delta += Math.PI * 2
      let angle = rotateState.current.startAngle + delta
      if (!e.evt.shiftKey) {
        const step = Math.PI / 180
        angle = Math.round(angle / step) * step
      }
      node.rotation((angle * 180) / Math.PI)
      const deg = Math.round(((((angle * 180) / Math.PI) % 360) + 360) % 360)
      const screen = worldToScreen(groupLeft(node), groupTop(node))
      showTip(screen.x, screen.y, `${deg}°`)
    },
    [element.id, props.w, props.h],
  )

  const handleRotateEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true
      try {
        hideTip()
        unfreezeStaticScene()
        const node = groupRef.current
        if (!node) return
        const rad = (node.rotation() * Math.PI) / 180
        if (Math.abs(rad - props.angle) > 0.001) {
          useEditorStore.getState().updateElement(element.id, {
            props: { ...props, angle: rad },
          })
        }
        if (textEngine === 'html') setTextDisplayDrag([element.id], false)
      } finally {
        unfreezeStaticScene()
      }
    },
    [element.id, props, textEngine],
  )

  // ===== 锚点 → 连线创建 =====
  const anchorStart = useRef<{ x: number; y: number } | null>(null)

  const handleAnchorDragStart = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>, idx: number) => {
      e.cancelBubble = true
      const anchors = getAnchorPoints(element)
      const ap = anchors[idx]
      if (!ap) return
      anchorStart.current = { x: ap.x, y: ap.y }
      useEditorStore.getState().setHoveredId(null)
    },
    [element],
  )

  const handleAnchorDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>, idx: number) => {
      e.cancelBubble = true
      const stage = e.target.getStage()
      const pw = pointerWorld(stage)
      if (!pw || !stage) return
      // 锚点吸附指针
      e.target.setAbsolutePosition(stage.getPointerPosition()!)

      const st = useEditorStore.getState()
      const from = (() => {
        const ap = getAnchorPoints(element)[idx]!
        return { id: element.id, x: ap.x, y: ap.y, angle: ap.angle ?? 0 }
      })()

      // 吸附到"距另一端最近"的锚点（决定箭头驶入方向）
      const hitId = hitElementId(stage)
      const r = snapLinkerEndpoint({
        shapes: allShapes(),
        hitShapeId: hitId,
        worldX: pw.x,
        worldY: pw.y,
        scale: st.viewport.scale,
        otherEnd: { id: from.id, x: from.x, y: from.y },
      })
      // 悬停图形显示锚点 / 吸附锚点大圆预览（旧 showAnchors + showLinkPoint）
      st.setHoveredId(hitId)
      if (r.snapAnchor) {
        showEndpointPreview(r.snapAnchor.x, r.snapAnchor.y, st.viewport.scale)
      } else {
        hideEndpointPreview()
      }

      // 自由端 angle 归 0（路由只用附着端角度，与 createLinkerInstance 一致）
      const to = { ...r.endpoint, angle: r.endpoint.angle ?? 0 }
      const draft = {
        from,
        to,
        linkerType: 'broken' as const,
        lineStyle: {
          lineWidth: LINKER_DEFAULTS.lineWidth,
          lineColor: LINKER_DEFAULTS.lineColor,
          lineStyle: LINKER_DEFAULTS.lineStyle,
          beginArrowStyle: LINKER_DEFAULTS.beginArrowStyle,
          endArrowStyle: LINKER_DEFAULTS.endArrowStyle,
        },
        points: getLinkerPoints({ linkerType: 'broken', from, to }, makeStoreRectGetter()),
      }
      st.setLinkerDraft(draft)
    },
    [element, element.id],
  )

  const handleAnchorDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>, home: { x: number; y: number }) => {
      e.cancelBubble = true
      const st = useEditorStore.getState()
      const draft = st.linkerDraft
      st.setLinkerDraft(null)
      e.target.position(home)
      hideEndpointPreview()
      st.setHoveredId(null)
      const start = anchorStart.current
      anchorStart.current = null
      if (!draft || !start) return
      if (Math.abs(draft.to.x - start.x) <= 20 && Math.abs(draft.to.y - start.y) <= 20) return
      const zmax = Math.max(
        0,
        ...Object.values(st.document.elements).map((el) => el.props.zindex),
      )
      const inst = createLinkerInstance(draft.from, draft.to, zmax + 1)
      inst.points = getLinkerPoints(inst, makeStoreRectGetter())
      st.addLinker(inst)
      st.selectElement(inst.id)
    },
    [],
  )

  // ===== 文本 =====
  // 兜底 14 → 13 与 registry/linker 统一（registry 实例化恒填 DEFAULT_FONT_SIZE，兜底路径仅防御外部注入的缺字段文档）
  const fontSize = fontStyle.size ?? DEFAULT_FONT_SIZE
  // 兜底色与 TextEditorOverlay/LinkerLabel 的 '50,50,50' 口径一致（仅防御外部注入的缺字段文档）
  const fontColor = fontStyle.color ? rgbToCSS(fontStyle.color) : rgbToCSS('50,50,50')

  const combinedFontStyle = useMemo(
    () => [fontStyle.bold ? 'bold' : '', fontStyle.italic ? 'italic' : ''].filter(Boolean).join(' ') || 'normal',
    [fontStyle.bold, fontStyle.italic],
  )

  const useHtmlText = textEngine === 'html'
  const isDirectManip = useIsTextDisplayDrag(element.id)
  const showKonvaText = !useHtmlText || isDirectManip
  const konvaBlock = (orientation: string | undefined): boolean =>
    !useHtmlText || orientation === 'vertical' || showKonvaText
  const snap = (v: number): number => snapTextCoord(v, scale)

  const rotation = (props.angle * 180) / Math.PI
  const w = props.w
  const h = props.h
  // 手柄/锚点保持屏幕恒定大小
  const hs = 8 / scale
  const rotSize = ROT_ICON_SCREEN / scale
  const rotHome = rotateHandleHome(w, hs, rotSize, scale)
  const rotatable = element.attribute?.rotatable !== false
  const hitHalf = 7 / scale
  const showAnchors = selected || hovered

  const setSelNodeRef = useCallback(
    (key: string) => (node: Konva.Node | null) => {
      selNodes.current[key] = node
    },
    [],
  )

  const setAnchorNodeRef = useCallback(
    (key: string) => (node: Konva.Node | null) => {
      anchorNodes.current[key] = node
    },
    [],
  )

  return (
    <Group
      ref={groupRef}
      x={props.x + w / 2}
      y={props.y + h / 2}
      offset={{ x: w / 2, y: h / 2 }}
      rotation={rotation}
      opacity={shapeStyle.alpha}
      draggable={!element.locked && currentTool !== 'linker'}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onMouseEnter={(e) => {
        e.cancelBubble = true
        useEditorStore.getState().setHoveredId(element.id)
        const container = e.target.getStage()?.container()
        if (container && !element.locked) container.style.cursor = 'move'
      }}
      onMouseLeave={(e) => {
        e.cancelBubble = true
        if (useEditorStore.getState().hoveredId === element.id) {
          useEditorStore.getState().setHoveredId(null)
        }
        const container = e.target.getStage()?.container()
        if (container) container.style.cursor = 'default'
      }}
      onDblClick={(e) => {
        e.cancelBubble = true
        const stage = e.target.getStage()
        const pw = pointerWorld(stage)
        if (!pw) return
        const block = hitTextBlock(element, pw.x, pw.y)
        if (block >= 0) useEditorStore.getState().setTextEdit({ id: element.id, block })
      }}
    >
      {/* 图形主体（命中区 = 图形本身） */}
      <Shape
        ref={shapeRef}
        width={w}
        height={h}
        sceneFunc={sceneFunc}
        hitFunc={hitFunc}
        fill="#000"
        perfectDrawEnabled={false}
        id={element.id}
        name="element"
      />

      {/* 多块文本命中区：置于 Shape 之上，双击精确进入对应 textBlock（避免整图命中误开块 0） */}
      {textBlock && textBlock.length > 1 && (
        <Group>
          {textBlock.map((tb, i) => {
            if (editingBlock === i) return null
            const r = evalTextBlockRect(tb, w, h)
            return (
              <Rect
                key={`tb-hit-${i}`}
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                fill="rgba(0,0,0,0.001)"
                /* 与主体同样标记为 element：否则单击文本块区域无法选中图形
                   （舞台 mousedown 仅认 name==='element'）；元素 id 走自定义 attr，
                   Konva id 需全舞台唯一，不能与主体 Shape 重复 */
                name="element"
                elementId={element.id}
                onDblClick={(e) => {
                  e.cancelBubble = true
                  useEditorStore.getState().setTextEdit({ id: element.id, block: i })
                }}
              />
            )
          })}
        </Group>
      )}

      {/* 文本层（多块时仅隐藏正在编辑的块，其余块保持显示） */}
      {textBlock && textBlock.length > 0 && (
        textBlock.length === 1 ? (
          editingBlock === 0 ? null : (
          // 单块：使用 evalTextBlockRect 定位（与多块逻辑一致）
          (() => {
            const r = evalTextBlockRect(textBlock[0]!, w, h)
            const blockText = textBlock[0]!.text || ''
            if (fontStyle.orientation === 'vertical') {
              return (
                <Group>
                  {layoutVerticalText(blockText, {
                    w: r.w, h: r.h, fontSize, align: fontStyle.textAlign, vAlign: fontStyle.vAlign,
                  }).map((g, i) => (
                    <Text
                      key={i}
                      x={snap(r.x + g.x)}
                      y={snap(r.y + g.y)}
                      text={g.text}
                      fontSize={fontSize}
                      fontFamily={fontFamilyCSS(fontStyle.fontFamily)}
                      fill={fontColor}
                      fontStyle={combinedFontStyle}
                      textDecoration={fontStyle.underline ? 'underline' : ''}
                      lineHeight={TEXT_LINE_HEIGHT}
                      {...KONVA_TEXT_PROPS}
                    />
                  ))}
                </Group>
              )
            }
            if (!konvaBlock(fontStyle.orientation)) return null
            return (
              <Text
                ref={textRef}
                x={snap(r.x)}
                y={snap(r.y)}
                width={r.w}
                height={r.h}
                text={blockText}
                fontSize={fontSize}
                fontFamily={fontFamilyCSS(fontStyle.fontFamily)}
                fill={fontColor}
                fontStyle={combinedFontStyle}
                textDecoration={fontStyle.underline ? 'underline' : ''}
                align={fontStyle.textAlign || 'center'}
                verticalAlign={fontStyle.vAlign || 'middle'}
                lineHeight={TEXT_LINE_HEIGHT}
                {...KONVA_TEXT_PROPS}
              />
            )
          })()
          )
        ) : (
          // 多块：evalTextBlockRect 定位
          <Group>
            {textBlock.map((tb, i) => {
              if (editingBlock === i) return null
              const r = evalTextBlockRect(tb, w, h)
              const blockFont = { ...fontStyle, ...tb.fontStyle }
              const blockText = tb.text || ''
              if (!blockText) return null
              const blockFontSize = blockFont.size ?? fontSize
              const blockFontColor = blockFont.color ? rgbToCSS(blockFont.color) : fontColor
              const blockCombinedStyle = [blockFont.bold ? 'bold' : '', blockFont.italic ? 'italic' : ''].filter(Boolean).join(' ') || 'normal'
              if (blockFont.orientation === 'vertical') {
                return (
                  <Group key={i}>
                    {layoutVerticalText(blockText, { w: r.w, h: r.h, fontSize: blockFontSize, align: blockFont.textAlign, vAlign: blockFont.vAlign }).map((g, j) => (
                      <Text
                        key={j}
                        x={snap(r.x + g.x)}
                        y={snap(r.y + g.y)}
                        text={g.text}
                        fontSize={blockFontSize}
                        fontFamily={fontFamilyCSS(blockFont.fontFamily)}
                        fill={blockFontColor}
                        fontStyle={blockCombinedStyle}
                        textDecoration={blockFont.underline ? 'underline' : ''}
                        lineHeight={TEXT_LINE_HEIGHT}
                        {...KONVA_TEXT_PROPS}
                      />
                    ))}
                  </Group>
                )
              }
              if (!konvaBlock(blockFont.orientation)) return null
              return (
                <Text
                  key={i}
                  ref={i === 0 ? textRef : undefined}
                  x={snap(r.x)}
                  y={snap(r.y)}
                  width={r.w}
                  height={r.h}
                  text={blockText}
                  fontSize={blockFontSize}
                  fontFamily={fontFamilyCSS(blockFont.fontFamily)}
                  fill={blockFontColor}
                  fontStyle={blockCombinedStyle}
                  textDecoration={blockFont.underline ? 'underline' : ''}
                  align={blockFont.textAlign || 'center'}
                  verticalAlign={blockFont.vAlign || 'middle'}
                  lineHeight={TEXT_LINE_HEIGHT}
                  {...KONVA_TEXT_PROPS}
                />
              )
            })}
          </Group>
        )
      )}

      {/* 选中控件：包围盒 + 四角缩放手柄 + 右上角弧形旋转图标 */}
      {selected && (
        <>
          <Rect
            ref={setSelNodeRef('sel-box')}
            x={0}
            y={0}
            width={w}
            height={h}
            stroke={SELECT_COLOR}
            strokeWidth={1 / scale}
            opacity={0.5}
            listening={false}
          />
          {HANDLE_DIRS.map((dir) => (
            <Rect
              key={dir}
              ref={setSelNodeRef(`h-${dir}`)}
              x={handleHome(dir, w, h, hs).x}
              y={handleHome(dir, w, h, hs).y}
              width={hs}
              height={hs}
              fill="#fff"
              stroke={SELECT_COLOR}
              strokeWidth={1 / scale}
              draggable={currentTool !== 'linker'}
              name="resize-handle"
              onMouseEnter={(e) => {
                e.cancelBubble = true
                const container = e.target.getStage()?.container()
                if (container) container.style.cursor = HANDLE_CURSOR[dir]
              }}
              onMouseLeave={(e) => {
                e.cancelBubble = true
                const container = e.target.getStage()?.container()
                if (container) container.style.cursor = 'default'
              }}
              onMouseDown={handleResizeMouseDown}
              onDragStart={handleResizeStart}
              onDragMove={(e) => handleResizeMove(dir, e)}
              onDragEnd={handleResizeEnd}
            />
          ))}
          {rotatable && (
            <Shape
              ref={setSelNodeRef('rot-handle')}
              x={rotHome.x - rotSize / 2}
              y={rotHome.y - rotSize / 2}
              width={rotSize}
              height={rotSize}
              sceneFunc={(ctx) => {
                paintRotateIcon(
                  ctx as unknown as CanvasRenderingContext2D,
                  rotSize,
                  rotHover ? ROT_HIGHLIGHT : SELECT_COLOR,
                  (rotHover ? 2.2 : 1.5) / scale,
                )
              }}
              hitFunc={(ctx, shape) => {
                ctx.beginPath()
                ctx.arc(rotSize / 2, rotSize / 2, rotSize / 2, 0, Math.PI * 2)
                ctx.fillStrokeShape(shape)
              }}
              draggable={currentTool !== 'linker'}
              name="rotation-handle"
              dragBoundFunc={() => ({
                x: rotHome.x - rotSize / 2,
                y: rotHome.y - rotSize / 2,
              })}
              onMouseEnter={(e) => {
                e.cancelBubble = true
                setRotHover(true)
                const container = e.target.getStage()?.container()
                if (container) container.style.cursor = rotateCursor()
              }}
              onMouseLeave={(e) => {
                e.cancelBubble = true
                setRotHover(false)
                const container = e.target.getStage()?.container()
                if (container) container.style.cursor = 'default'
              }}
              onDragStart={handleRotateStart}
              onDragMove={handleRotateMove}
              onDragEnd={handleRotateEnd}
            />
          )}
        </>
      )}

      {/* 锚点命中区：始终渲染 7px 数学检测——不管是否选中/悬停都能从锚点拖出连线 */}
      {!element.locked &&
        getLocalAnchors(element).map((a, idx) => (
          <Rect
            key={`hit-${idx}`}
            ref={setAnchorNodeRef(`hit-${idx}`)}
            x={a.x - hitHalf}
            y={a.y - hitHalf}
            width={hitHalf * 2}
            height={hitHalf * 2}
            fill="#000"
            opacity={0}
            draggable={currentTool !== 'linker'}
            name="anchor-hit"
            onMouseEnter={(e) => {
              e.cancelBubble = true
              const container = e.target.getStage()?.container()
              if (container) container.style.cursor = 'crosshair'
            }}
            onMouseLeave={(e) => {
              e.cancelBubble = true
              // 指针可能移入图形本体（由 Group enter 设回 move），先恢复默认
              const container = e.target.getStage()?.container()
              if (container) container.style.cursor = 'default'
            }}
            onDragStart={(e) => handleAnchorDragStart(e, idx)}
            onDragMove={(e) => handleAnchorDragMove(e, idx)}
            onDragEnd={(e) => handleAnchorDragEnd(e, { x: a.x - hitHalf, y: a.y - hitHalf })}
          />
        ))}

      {showAnchors &&
        getLocalAnchors(element).map((a, idx) => (
          <Circle
            key={`dot-${idx}`}
            ref={setAnchorNodeRef(`dot-${idx}`)}
            x={a.x}
            y={a.y}
            radius={3.5 / scale}
            fill="#fff"
            stroke={SELECT_COLOR}
            strokeWidth={1 / scale}
            listening={false}
          />
        ))}
    </Group>
  )
})

/** 手柄初始位置（局部坐标） */
function handleHome(dir: HandleDir, w: number, h: number, hs: number): { x: number; y: number } {
  const x = dir.includes('l') ? -hs / 2 : dir.includes('r') ? w - hs / 2 : w / 2
  const y = dir.includes('t') ? -hs / 2 : dir.includes('b') ? h - hs / 2 : h / 2
  if (dir === 'ml' || dir === 'mr') return { x, y: h / 2 }
  if (dir === 'tm' || dir === 'bm') return { x: w / 2, y }
  return { x, y }
}
