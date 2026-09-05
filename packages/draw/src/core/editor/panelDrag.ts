//
//   1. mousedown：显示跟鼠标的形状缩略 ghost（#creating_shape_container）
//   2. mousemove 进入画布：立即创建真实图形（Model.create，中心=鼠标），
//      拖动中实时改位置 + snapLine 吸附 —— 面板里看到的就是画布上将得到的图形
//   3. mouseup：画布内保留并提交；画布外销毁
//
// 本实现：ghost 与画布内形状位置全程直操（DOM/Konva 节点），
// store 只在进入/离开画布时切换 creatingShape（低频），mouseup 一次性提交。
import type Konva from 'konva'
import type { ElementInstance } from '@/types'
import { shapeRegistry } from '@/core/schema/registry'
import { useEditorStore } from '@/store/editorStore'
import { drawShapeThumb } from '@/core/utils/shapeThumb'
import { snapLine } from './alignment'
import { allShapes } from './interaction'
import { clearSnapLines, showSnapLines } from './uiOverlay'

/** ghost 缩略图边长（CSS 像素） */
const GHOST_SIZE = 36
/** ghost 相对鼠标的偏移（避免遮挡指针） */
const GHOST_OFFSET = 12

let canvasContainer: HTMLElement | null = null
let creatingNode: Konva.Group | null = null

/** 画布容器注册（坐标换算用） */
export function registerCanvasContainer(el: HTMLElement | null): void {
  canvasContainer = el
}

/** 创建预览 Group 节点注册（高频直操位置用） */
export function registerCreatingNode(node: Konva.Group | null): void {
  creatingNode = node
}

/** 容器矩形（世界坐标换算基准） */
export interface ContainerRect {
  left: number
  top: number
  width: number
  height: number
}

export interface ViewportState {
  x: number
  y: number
  scale: number
}

export interface DragPosition {
  inside: boolean
  /** 鼠标的世界坐标（outside 时无意义） */
  world: { x: number; y: number }
}

/**
 * 鼠标屏幕坐标 → 画布内判定 + 世界坐标（纯函数，便于测试）
 */
export function resolveDragPosition(
  clientX: number,
  clientY: number,
  rect: ContainerRect,
  viewport: ViewportState,
): DragPosition {
  const sx = clientX - rect.left
  const sy = clientY - rect.top
  const inside = sx >= 0 && sx <= rect.width && sy >= 0 && sy <= rect.height
  return {
    inside,
    world: { x: (sx - viewport.x) / viewport.scale, y: (sy - viewport.y) / viewport.scale },
  }
}

interface DragState {
  ghost: HTMLDivElement
  /** 进入画布后创建的实例（离开画布时置回 null = 销毁） */
  instance: ElementInstance | null
  /** 最近一次吸附后的图形左上角（世界坐标；提交用） */
  lastWorld: { x: number; y: number }
  onMove: (e: MouseEvent) => void
  onUp: (e: MouseEvent) => void
}

let drag: DragState | null = null

/**
 * 从左侧面板开始拖拽创建
 * @param e 面板项 mousedown 事件（仅左键）
 */
export function startPanelDrag(
  shapeName: string,
  e: { button: number; clientX: number; clientY: number },
): void {
  if (drag) return
  if (e.button !== 0) return

  const ghost = document.createElement('div')
  ghost.style.cssText = `position:fixed;left:0;top:0;z-index:1000;pointer-events:none;`
  const thumb = document.createElement('canvas')
  thumb.style.width = `${GHOST_SIZE}px`
  thumb.style.height = `${GHOST_SIZE}px`
  ghost.appendChild(thumb)
  document.body.appendChild(ghost)
  drawShapeThumb(thumb, shapeName, GHOST_SIZE)

  const onMove = (ev: MouseEvent): void => {
    const d = drag
    if (!d) return
    const st = useEditorStore.getState()
    const rect = canvasContainer?.getBoundingClientRect()
    if (!rect) return
    const pos = resolveDragPosition(ev.clientX, ev.clientY, rect, st.viewport)

    if (!pos.inside) {
      // 画布外：ghost 跟随；销毁画布内预览
      ghost.style.display = 'block'
      ghost.style.transform = `translate(${ev.clientX + GHOST_OFFSET}px, ${ev.clientY + GHOST_OFFSET}px)`
      clearSnapLines()
      if (d.instance) {
        d.instance = null
        st.setCreatingShape(null)
      }
      return
    }

    // 画布内：隐藏 ghost，创建/直操真实形状（中心跟随鼠标）
    ghost.style.display = 'none'
    if (!d.instance) {
      const inst = shapeRegistry.createElementAtCenter(shapeName, pos.world.x, pos.world.y)
      if (!inst) return
      d.instance = inst
      d.lastWorld = { x: inst.props.x, y: inst.props.y }
      st.setCreatingShape(inst)
      // 首帧 Konva 节点尚未挂载（React 下一次 flush），从下一帧起直操
      return
    }

    const { w, h } = d.instance.props
    // 包围盒 → 吸附检测（snapLine 原地修正 t）
    const t = { x: pos.world.x - w / 2, y: pos.world.y - h / 2, w, h }
    const snap = snapLine(t, [d.instance.id], allShapes())
    d.lastWorld = { x: t.x, y: t.y }
    showSnapLines(snap, st.viewport.scale)
    if (creatingNode) {
      creatingNode.position({ x: t.x + w / 2, y: t.y + h / 2 })
      creatingNode.getLayer()?.batchDraw()
    }
  }

  const onUp = (): void => {
    const d = drag
    if (!d) return
    // 清理监听与 ghost
    document.removeEventListener('mousemove', d.onMove)
    document.removeEventListener('mouseup', d.onUp)
    d.ghost.remove()
    drag = null
    clearSnapLines()

    const st = useEditorStore.getState()
    if (d.instance) {
      // 画布内落点：转正（保持原 ID，CreatingShapeView 与 ElementRenderer 无缝交替）
      st.addElement({
        ...d.instance,
        props: { ...d.instance.props, x: d.lastWorld.x, y: d.lastWorld.y },
      })
      st.selectElement(d.instance.id)
    }
    st.setCreatingShape(null)
  }

  drag = { ghost, instance: null, lastWorld: { x: 0, y: 0 }, onMove, onUp }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
  onMove(e as unknown as MouseEvent)
}

/**
 * 取消面板拖拽创建（Esc 快捷键）：
 * 清理监听/ghost/吸附线/画布内预览，不提交任何图形
 */
export function cancelPanelDrag(): void {
  const d = drag
  if (!d) return
  document.removeEventListener('mousemove', d.onMove)
  document.removeEventListener('mouseup', d.onUp)
  d.ghost.remove()
  drag = null
  clearSnapLines()
  useEditorStore.getState().setCreatingShape(null)
}
