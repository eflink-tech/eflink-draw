// src/components/canvas/Canvas.tsx
import { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import type Konva from 'konva'
import { useEditorStore } from '@/store/editorStore'
import { isLinker, type ElementInstance, type LinkerInstance } from '@/types'
import { registerSnapLines, registerTip } from '@/core/editor/uiOverlay'
import { registerCanvasContainer } from '@/core/editor/panelDrag'
import { getContentWorldBounds, getScrollBounds, thumbPosFromVp, vpFromThumbPos } from '@/core/editor/viewportBounds'
import { getDarkerColor } from '@/core/editor/grid'
import { absToWorld, getShapesByRange, hitElementId } from '@/core/editor/interaction'
import {
  beginFreeLinker,
  moveFreeLinker,
  endFreeLinker,
  isFreeLinkerDragging,
} from '@/core/editor/linkerTool'
import { rgbToCSS } from '@/types'
import { shapeRegistry } from '@/core/schema/registry'
import { GridLayer } from './GridLayer'
import { ElementRenderer } from './ElementRenderer'
import { LinkerRenderer } from './LinkerRenderer'
import { LinkerCursorView } from './LinkerCursorView'
import { LinkerDraftView } from './LinkerDraftView'
import { LinkerEndpoints } from './LinkerEndpoints'
import { LinkerControls } from './LinkerControls'
import { CreatingShapeView } from './CreatingShapeView'
import { TextEditorOverlay } from './TextEditorOverlay'
import { TextDisplayOverlay } from './TextDisplayOverlay'
import { MarqueeSelection } from './MarqueeSelection'
import { useEditorShortcuts } from './useEditorShortcuts'

export function Canvas() {
  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })

  const roRef = useRef<ResizeObserver | null>(null)

  // 画布平移状态
  const isPanning = useRef(false)
  const panStart = useRef({ x: 0, y: 0 })
  // 空格键按下状态（用于空格+拖拽平移）
  const spacePressed = useRef(false)
  const [spaceHeld, setSpaceHeld] = useState(false)
  const clickCollapse = useRef<{ id: string; x: number; y: number } | null>(null)
  // 空格平移标记：空格按下后是否发生过拖拽（释放空格时据此判断是否进入文字编辑）
  const spacePanned = useRef(false)
  // 框选状态：起点/当前指针世界坐标；moved 标记是否已超过阈值进入框选
  const marqueeStart = useRef<{ x: number; y: number } | null>(null)
  const marqueeCurrent = useRef<{ x: number; y: number } | null>(null)
  const [marqueeBox, setMarqueeBox] = useState<{
    start: { x: number; y: number }
    current: { x: number; y: number }
  } | null>(null)

  const viewport = useEditorStore((s) => s.viewport)
  const updateViewport = useEditorStore((s) => s.updateViewport)
  const doc = useEditorStore((s) => s.document)
  const page = doc.page
  const currentTool = useEditorStore((s) => s.currentTool)
  const brushData = useEditorStore((s) => s.brushData)

  // 初始化时测量容器尺寸（ResizeObserver 通过 ref 清理）
  // 初始居中标志：首次测量容器尺寸时，将页面居中
  const hasCenteredRef = useRef(false)

  const containerCallbackRef = useCallback((node: HTMLDivElement | null) => {
    roRef.current?.disconnect()
    roRef.current = null
    containerRef.current = node
    // 面板拖拽创建的坐标换算基准（panelDrag）
    registerCanvasContainer(node)
    if (!node) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setStageSize({ width: Math.floor(width), height: Math.floor(height) })
        // 首次测量容器尺寸时，将页面居中
        if (!hasCenteredRef.current) {
          hasCenteredRef.current = true
          const page = useEditorStore.getState().document.page
          const vp = useEditorStore.getState().viewport
          if (vp.x === 0 && vp.y === 0 && vp.scale === 1) {
            const scaledPageW = page.width * vp.scale
            const scaledPageH = page.height * vp.scale
            useEditorStore.getState().updateViewport({
              x: Math.round((width - scaledPageW) / 2),
              y: Math.round((height - scaledPageH) / 2),
            })
          }
        }
      }
    })
    ro.observe(node)
    roRef.current = ro
  }, [])

  // 拖拽平移相关处理（Stage 不使用 draggable，改用原生鼠标事件）
  const handleStageMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // 连线工具：自由连线拖拽（最前置分支，命中图形/空白均从 mousedown 起画线）
      if (currentTool === 'linker') {
        const stage = stageRef.current
        if (stage) {
          const pp = stage.getPointerPosition()
          if (pp) {
            const world = absToWorld(stage, pp)
            beginFreeLinker(world.x, world.y)
          }
        }
        return
      }
      const target = e.target
      const name = target.name()
      // 点击空白区域
      if (target === e.target.getStage()) {
        // 文本工具：点空白创建自由文本（单次放置后回选择工具，随即进入编辑）
        if (currentTool === 'text') {
          const stage = stageRef.current
          if (stage) {
            const pp = stage.getPointerPosition()
            if (pp) {
              const world = absToWorld(stage, pp)
              const el = shapeRegistry.createElementAtCenter('freetext', world.x, world.y)
              if (el) {
                const st = useEditorStore.getState()
                st.addElement(el)
                st.setTool('select')
                // 延迟进入编辑：在 mousedown 事件链内同步 focus 会被浏览器在事件结束后移回 body，
                // 导致 textarea 立即 blur → 空 freetext 被误回收。推迟到下一轮事件循环再 focus。
                setTimeout(() => {
                  useEditorStore.getState().setTextEdit({ id: el.id, block: 0, fresh: true })
                }, 0)
              }
            }
          }
          return
        }
        const stage = stageRef.current
        if (stage) {
          const pp = stage.getPointerPosition()
          if (pp) {
            const world = absToWorld(stage, pp)
            marqueeStart.current = world
            marqueeCurrent.current = world
          }
          setMarqueeBox(null)
        }
        // 手型工具、中键、或空格键按下：平移
        if (currentTool === 'hand' || e.evt.button === 1 || spacePressed.current) {
          isPanning.current = true
          panStart.current = { x: e.evt.clientX - viewport.x, y: e.evt.clientY - viewport.y }
          // 空格+拖拽时取消框选，并标记已发生平移
          if (spacePressed.current) {
            spacePanned.current = true
            marqueeStart.current = null
            marqueeCurrent.current = null
          }
        }
      } else if (name === 'element' || name === 'linker') {
        // 文本块命中区等辅助节点不带 Konva id，元素 id 从自定义 attr 兜底读取
        const id = target.id() || target.getAttr('elementId')
        const st = useEditorStore.getState()
        // 格式刷模式：点击图形应用样式（从 getState 实时读取，避免 useCallback 闭包过期）
        if (st.brushData) {
          st.applyBrush([id])
          return
        }
        // 空格+拖拽图形：也进入平移模式（整体平移选区）
        if (spacePressed.current) {
          isPanning.current = true
          spacePanned.current = true
          panStart.current = { x: e.evt.clientX - viewport.x, y: e.evt.clientY - viewport.y }
          return
        }
        const multi = e.evt.ctrlKey || e.evt.metaKey || e.evt.shiftKey
        // 右键（button 2）：让菜单作用于"右键点中的对象"。
        // 命中图形不在当前选区 → 切换为单选该图形（否则点了一次下移后原选区保留，
        // 同位置再右键实际仍作用于旧选中图形，视觉与操作对象不一致）；
        // 已在选区中 → 保持不变（多选时右键作用于整个选区）。
        const isRightClick = e.evt.button === 2
        if (isRightClick) {
          if (!st.selectedIds.has(id)) {
            st.selectElement(id, false)
          }
          return
        }
        if (multi || !st.selectedIds.has(id)) {
          st.selectElement(id, multi)
        } else if (st.selectedIds.size > 1) {
          clickCollapse.current = { id, x: e.evt.clientX, y: e.evt.clientY }
        }
      }
    },
    [viewport.x, viewport.y, currentTool],
  )

  const MARQUEE_THRESHOLD = 5 // 像素阈值：超过此距离才进入框选/平移

  const handleStageMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = stageRef.current
      // 连线工具：实时更新自由连线 to 端
      if (currentTool === 'linker' && isFreeLinkerDragging() && stage) {
        const pp = stage.getPointerPosition()
        if (pp) {
          const world = absToWorld(stage, pp)
          moveFreeLinker(world.x, world.y, hitElementId(stage))
        }
        return
      }
      // 平移模式
      if (isPanning.current) {
        if (!stage) return
        const newX = e.evt.clientX - panStart.current.x
        const newY = e.evt.clientY - panStart.current.y
        stage.position({ x: newX, y: newY })
        stage.batchDraw()
        return
      }
      // 框选模式：起点已记录且当前在空白区域
      if (marqueeStart.current && stage) {
        const pp = stage.getPointerPosition()
        if (pp) {
          const world = absToWorld(stage, pp)
          const dx = world.x - marqueeStart.current.x
          const dy = world.y - marqueeStart.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > MARQUEE_THRESHOLD / (viewport.scale || 1)) {
            marqueeCurrent.current = world
            setMarqueeBox({
              start: marqueeStart.current,
              current: world,
            })
          }
        }
      }
    },
    [viewport.scale, currentTool],
  )

  const handleStageMouseUp = useCallback(
    (e?: Konva.KonvaEventObject<MouseEvent>) => {
      // 连线工具：结束自由连线拖拽（mouseup / mouseleave 均提交）
      if (currentTool === 'linker' && isFreeLinkerDragging()) {
        endFreeLinker()
        return
      }
      const stage = stageRef.current
      // 平移结束
      if (isPanning.current) {
        isPanning.current = false
        if (stage) updateViewport({ x: stage.x(), y: stage.y() })
      }
      // 框选结束
      if (marqueeStart.current && marqueeCurrent.current && stage) {
        const sx = marqueeStart.current.x
        const sy = marqueeStart.current.y
        const cx = marqueeCurrent.current.x
        const cy = marqueeCurrent.current.y
        const dx = cx - sx
        const dy = cy - sy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > MARQUEE_THRESHOLD / (viewport.scale || 1)) {
          // 计算框选矩形
          const rect = {
            x: Math.min(sx, cx),
            y: Math.min(sy, cy),
            w: Math.abs(dx),
            h: Math.abs(dy),
          }
          const hitIds = getShapesByRange(doc.elements, rect)
          const st = useEditorStore.getState()
          const multi = e?.evt.ctrlKey || e?.evt.metaKey
          // 经 selectIds：命中任一组成员即整组展开（加选/替换）
          st.selectIds(hitIds, multi ? 'add' : 'replace')
        } else if (!isPanning.current && currentTool !== 'hand') {
          // 位移太小 → 视为点击空白区域，清空选区
          useEditorStore.getState().clearSelection()
        }
        marqueeStart.current = null
        marqueeCurrent.current = null
        setMarqueeBox(null)
      } else {
        marqueeStart.current = null
        marqueeCurrent.current = null
        setMarqueeBox(null)
        // 纯点击（无位移）时收缩多选为单选
        if (clickCollapse.current && e) {
          const c = clickCollapse.current
          clickCollapse.current = null
          if (Math.abs(e.evt.clientX - c.x) < 3 && Math.abs(e.evt.clientY - c.y) < 3) {
            useEditorStore.getState().selectElement(c.id, false)
          }
        } else {
          clickCollapse.current = null
        }
      }
    },
    [updateViewport, viewport.scale, doc.elements, currentTool],
  )

  // 全局键盘快捷键（缩放/剪贴板/层级/删除/空格平移 + ⌘A/⌘D/⌘B/I/U/方向键等，见 hook）
  useEditorShortcuts({ spacePressed, spacePanned, setSpaceHeld })

  // 网格参数
  const bgColor = page.backgroundColor === 'transparent' ? '255,255,255' : page.backgroundColor
  const workspaceColor = rgbToCSS(getDarkerColor(bgColor))

  // 可见元素列表（按 zindex 升序）
  const visibleElements = useMemo(
    () =>
      Object.values(doc.elements)
        .filter((el) => !isLinker(el))
        .sort((a, b) => (a as ElementInstance).props.zindex - (b as ElementInstance).props.zindex),
    [doc.elements],
  )

  const visibleLinkers = useMemo(
    () =>
      Object.values(doc.elements)
        .filter(isLinker)
        .sort((a, b) => a.props.zindex - b.props.zindex) as LinkerInstance[],
    [doc.elements],
  )

  // 吸附线节点注册（UI 直操）
  const snapVNode = useRef<Konva.Line | null>(null)
  const snapHNode = useRef<Konva.Line | null>(null)
  const snapVRef = useCallback((node: Konva.Line | null) => {
    snapVNode.current = node
    registerSnapLines(node, snapHNode.current)
  }, [])
  const snapHRef = useCallback((node: Konva.Line | null) => {
    snapHNode.current = node
    registerSnapLines(snapVNode.current, node)
  }, [])

  // ── 自定义滚动条（细线风格，对齐截图2）──
  const SCROLLBAR = 3 // 滚动条宽度/高度
  /** 页面四周可滚动衬板边距（屏幕像素），对齐旧 ProcessOn pageMargin=1000 */
  const SCROLL_PAD = 1000

  // 可见世界区域（屏幕像素 → 世界坐标）
  const visibleW = stageSize.width / (viewport.scale || 1)
  const visibleH = stageSize.height / (viewport.scale || 1)

  // 可视内容世界范围（页面矩形 ∪ 页面外元素/连线端点；无内容时退化为页面本身）
  const contentBounds = useMemo(() => getContentWorldBounds(doc.elements), [doc.elements])
  const world = {
    minX: Math.min(0, contentBounds.minX),
    minY: Math.min(0, contentBounds.minY),
    maxX: Math.max(page.width, contentBounds.maxX),
    maxY: Math.max(page.height, contentBounds.maxY),
  }

  // 视口偏移边界与滚动条行程（计算见 viewportBounds；内容画到页面外时行程随之扩展）
  const { hRange, vRange, hMinVx, hMaxVx, vMinVy, vMaxVy } = getScrollBounds(
    stageSize.width,
    stageSize.height,
    world,
    viewport.scale,
    SCROLL_PAD,
  )

  // 滚动条轨道长度（容器尺寸 - 滚动条宽度）
  const scrollTrackW = stageSize.width - SCROLLBAR
  const scrollTrackH = stageSize.height - SCROLLBAR

  // 滑块尺寸 = 轨道 × (视口尺寸 / 滚动范围)，最大不超过轨道
  // （视口尺寸与滚动范围均为屏幕像素，避免 scale≠1 时滑块比例失真）
  const hThumbSize = Math.max(30, Math.min(scrollTrackW - 4, (stageSize.width / hRange) * scrollTrackW))
  const vThumbSize = Math.max(30, Math.min(scrollTrackH - 4, (stageSize.height / vRange) * scrollTrackH))

  // 滑块可动长度
  const hTrackLen = Math.max(0, scrollTrackW - hThumbSize)
  const vTrackLen = Math.max(0, scrollTrackH - vThumbSize)

  // 滑块位置：viewport 线性映射到 [0, hTrackLen]。
  // 方向约定见 viewportBounds.thumbPosFromVp：vp 越小显示的内容越靠右，thumb 越是靠右端。
  const hThumbPos = hRange > 0 && hTrackLen > 0 ? thumbPosFromVp(hMinVx, hMaxVx, viewport.x, hTrackLen) : 0
  const vThumbPos = vRange > 0 && vTrackLen > 0 ? thumbPosFromVp(vMinVy, vMaxVy, viewport.y, vTrackLen) : 0

  // 限制 viewport 不超出范围
  const clampViewport = (x: number, y: number) => ({
    x: Math.max(hMinVx, Math.min(hMaxVx, x)),
    y: Math.max(vMinVy, Math.min(vMaxVy, y)),
  })

  // 缩放或容器尺寸变化后，把越界的 viewport 拉回合法范围
  // （缩放只改 scale、不改 x/y，缩小后旧位置可能越过新边界而「丢页面」）
  useEffect(() => {
    const vp = useEditorStore.getState().viewport
    const clamped = clampViewport(vp.x, vp.y)
    if (clamped.x !== vp.x || clamped.y !== vp.y) {
      useEditorStore.getState().updateViewport(clamped)
    }
    // clampViewport 随每次渲染重建，不放入依赖；其内部常量由 scale/stageSize 驱动，
    // 边界变化必然伴随此依赖变化
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport.scale, stageSize.width, stageSize.height])

  // 滚动条拖拽状态
  const [scrollDrag, setScrollDrag] = useState<{
    axis: 'h' | 'v'; startX: number; startY: number
    thumbStart: number
  } | null>(null)

  const handleScrollbarMouseDown = useCallback((axis: 'h' | 'v') => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // 先将 viewport clamp 到有效范围，确保 thumb 位置合法
    const vp = useEditorStore.getState().viewport
    const clamped = clampViewport(vp.x, vp.y)
    useEditorStore.getState().updateViewport(clamped)
    // 重新计算 clamp 后的 thumb 位置
    const clampedThumbPos = axis === 'h'
      ? (hRange > 0 && hTrackLen > 0 ? thumbPosFromVp(hMinVx, hMaxVx, clamped.x, hTrackLen) : 0)
      : (vRange > 0 && vTrackLen > 0 ? thumbPosFromVp(vMinVy, vMaxVy, clamped.y, vTrackLen) : 0)
    setScrollDrag({
      axis,
      startX: e.clientX, startY: e.clientY,
      thumbStart: clampedThumbPos,
    })
  }, [hRange, vRange, hTrackLen, vTrackLen, hMinVx, hMaxVx, vMinVy, vMaxVy])

  // 全局滚动条拖拽
  useEffect(() => {
    if (!scrollDrag) return
    const onMove = (e: MouseEvent) => {
      const { axis, startX, startY, thumbStart } = scrollDrag
      const vp = useEditorStore.getState().viewport
      if (axis === 'h') {
        if (hTrackLen <= 0) return
        const dx = e.clientX - startX
        const newThumbPos = Math.max(0, Math.min(hTrackLen, thumbStart + dx))
        // thumb 向右(位置增大) → vp 减小 → 显示内容右侧（见 viewportBounds.vpFromThumbPos）
        const newX = vpFromThumbPos(hMinVx, hMaxVx, newThumbPos, hTrackLen)
        useEditorStore.getState().updateViewport(clampViewport(newX, vp.y))
      } else {
        if (vTrackLen <= 0) return
        const dy = e.clientY - startY
        const newThumbPos = Math.max(0, Math.min(vTrackLen, thumbStart + dy))
        const newY = vpFromThumbPos(vMinVy, vMaxVy, newThumbPos, vTrackLen)
        useEditorStore.getState().updateViewport(clampViewport(vp.x, newY))
      }
    }
    const onUp = () => setScrollDrag(null)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [scrollDrag, hRange, vRange, hTrackLen, vTrackLen, hMinVx, hMaxVx, vMinVy, vMaxVy])

  // 滚动条轨道点击
  const handleTrackClick = useCallback((axis: 'h' | 'v', thumbSize: number) => (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const vp = useEditorStore.getState().viewport
    if (axis === 'h') {
      const trackLen = rect.width - thumbSize
      if (trackLen <= 0) return
      const clickPos = Math.max(0, Math.min(trackLen, e.clientX - rect.left - thumbSize / 2))
      const newX = vpFromThumbPos(hMinVx, hMaxVx, clickPos, trackLen)
      useEditorStore.getState().updateViewport(clampViewport(newX, vp.y))
    } else {
      const trackLen = rect.height - thumbSize
      if (trackLen <= 0) return
      const clickPos = Math.max(0, Math.min(trackLen, e.clientY - rect.top - thumbSize / 2))
      const newY = vpFromThumbPos(vMinVy, vMaxVy, clickPos, trackLen)
      useEditorStore.getState().updateViewport(clampViewport(vp.x, newY))
    }
  }, [hRange, vRange, hMinVx, hMaxVx, vMinVy, vMaxVy])

  // 使用 ref 存储可见区域尺寸，避免滚轮 effect 频繁重建监听器
  const visibleRef = useRef({ w: visibleW, h: visibleH })
  visibleRef.current = { w: visibleW, h: visibleH }

  // clampViewport 每次渲染都按最新边界（scale/stageSize/内容包围盒）重建。
  // 滚轮 effect 只在 mount 注册一次，若直接闭包 clampViewport 会冻结在初始边界，
  // 导致放大后滚轮仍按 scale=1 的边界 clamp、滚不到页面边缘。故用 ref 持有最新引用。
  const clampViewportRef = useRef(clampViewport)
  clampViewportRef.current = clampViewport

  // 鼠标滚轮平移（步长根据 deltaMode 调整，降低滚动速度）
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const vp = useEditorStore.getState().viewport
      const { w, h } = visibleRef.current

      // 根据 deltaMode 调整滚动步长
      // deltaMode: 0 = DOM_DELTA_PIXEL, 1 = DOM_DELTA_LINE, 2 = DOM_DELTA_PAGE
      let stepX = 0
      let stepY = 0

      if (e.deltaMode === 1) {
        // 行模式（鼠标滚轮）：每行滚动 15 像素
        stepX = e.deltaX * 15
        stepY = e.deltaY * 15
      } else if (e.deltaMode === 2) {
        // 页面模式：滚动可见区域的 80%
        stepX = e.deltaX * w * 0.8
        stepY = e.deltaY * h * 0.8
      } else {
        // 像素模式（触控板）：直接使用浏览器提供的精确像素 delta
        stepX = e.deltaX
        stepY = e.deltaY
      }

      useEditorStore.getState().updateViewport(
        clampViewportRef.current(vp.x - stepX, vp.y - stepY),
      )
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  // 容器光标：空格按下时显示 grab，拖拽中显示 grabbing
  const containerCursor = scrollDrag
    ? 'grabbing'
    : spaceHeld
      ? 'grab'
      : brushData
        ? 'crosshair'
        : currentTool === 'text'
          ? 'text'
          : currentTool === 'linker'
            ? 'crosshair'
            : currentTool === 'hand'
              ? 'grab'
              : undefined

  return (
    <div
      ref={containerCallbackRef}
      className="relative w-full h-full overflow-hidden select-none"
      style={{
        backgroundColor: workspaceColor,
        cursor: containerCursor,
      }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={viewport.scale}
        scaleY={viewport.scale}
        x={viewport.x}
        y={viewport.y}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onMouseLeave={handleStageMouseUp}
      >
        {/* Layer 1: 固定页面矩形 + 网格（页面始终绘制，showGrid 只控线） */}
        <Layer listening={false}>
          <GridLayer
            page={{
              width: page.width,
              height: page.height,
              orientation: page.orientation,
              padding: page.padding,
              gridSize: page.gridSize,
              showGrid: page.showGrid,
              backgroundColor: bgColor,
            }}
            scale={viewport.scale}
          />
        </Layer>

        {/* Layer 2: 连线（图形下方）+ 选中图形的流动光标 */}
        <Layer>
          {visibleLinkers.map((l) => (
            <LinkerRenderer key={l.id} linker={l} />
          ))}
          <LinkerCursorView />
        </Layer>

        {/* Layer 3: 图形元素 */}
        <Layer>
          {visibleElements.map((el) => (
            <ElementRenderer key={el.id} element={el as ElementInstance} textEngine="html" />
          ))}
        </Layer>

        {/* Layer 4: UI 层 — 吸附线 + 连线草稿 + 面板拖拽创建预览 + 框选矩形 */}
        <Layer listening={false}>
          <Line
            ref={snapVRef}
            stroke="#6EB1EB"
            strokeWidth={1}
            dash={[4, 3]}
            visible={false}
          />
          <Line
            ref={snapHRef}
            stroke="#6EB1EB"
            strokeWidth={1}
            dash={[4, 3]}
            visible={false}
          />
          <LinkerDraftView />
          <CreatingShapeView />
          <MarqueeSelection
            start={marqueeBox?.start ?? null}
            current={marqueeBox?.current ?? null}
          />
        </Layer>

        <Layer>
          <LinkerEndpoints />
          <LinkerControls />
        </Layer>
      </Stage>

      {/* 坐标 tip（拖拽期间直操更新，不经过 React） */}
      <div
        ref={registerTip}
        className="absolute pointer-events-none z-10 rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs text-gray-700 shadow-sm"
        style={{ display: 'none' }}
      />

      <TextDisplayOverlay />
      <TextEditorOverlay />

      {/* ── 自定义滚动条 ── */}
      {/* 水平滚动条（底部） */}
      <div
        className="absolute left-0 pointer-events-none"
        style={{ bottom: 0, width: stageSize.width, height: SCROLLBAR, zIndex: 20 }}
      >
        <div
          className="relative pointer-events-auto"
          style={{ width: scrollTrackW, height: SCROLLBAR, backgroundColor: 'transparent' }}
          onClick={handleTrackClick('h', hThumbSize)}
        >
          <div
            className="absolute top-0 rounded-full"
            style={{
              left: Math.max(0, Math.min(hTrackLen, hThumbPos)),
              width: hThumbSize,
              height: SCROLLBAR,
              backgroundColor: scrollDrag?.axis === 'h' ? '#777' : '#999',
              cursor: 'pointer',
            }}
            onMouseDown={handleScrollbarMouseDown('h')}
          />
        </div>
      </div>
      {/* 垂直滚动条（右侧） */}
      <div
        className="absolute top-0 pointer-events-none"
        style={{ left: scrollTrackW, width: SCROLLBAR, height: stageSize.height, zIndex: 20 }}
      >
        <div
          className="relative pointer-events-auto"
          style={{ width: SCROLLBAR, height: scrollTrackH, backgroundColor: 'transparent' }}
          onClick={handleTrackClick('v', vThumbSize)}
        >
          <div
            className="absolute left-0 rounded-full"
            style={{
              top: Math.max(0, Math.min(vTrackLen, vThumbPos)),
              height: vThumbSize,
              width: SCROLLBAR,
              backgroundColor: scrollDrag?.axis === 'v' ? '#777' : '#999',
              cursor: 'pointer',
            }}
            onMouseDown={handleScrollbarMouseDown('v')}
          />
        </div>
      </div>
      {/* 右下角交汇块 */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: scrollTrackW,
          top: scrollTrackH,
          width: SCROLLBAR,
          height: SCROLLBAR,
          backgroundColor: 'transparent',
          zIndex: 21,
        }}
      />
    </div>
  )
}
