// 拖拽/缩放直操期间：HTML 文字层暂停，改由 Konva Text 跟随节点（避免覆盖层与 store 不同步）
import { useSyncExternalStore } from 'react'

let draggingShapeIds = new Set<string>()
const listeners = new Set<() => void>()

function emit(): void {
  for (const l of listeners) l()
}

export function setTextDisplayDrag(ids: string[], active: boolean): void {
  const next = new Set(draggingShapeIds)
  if (active) {
    for (const id of ids) next.add(id)
  } else {
    for (const id of ids) next.delete(id)
  }
  draggingShapeIds = next
  emit()
}

export function clearTextDisplayDrag(): void {
  if (draggingShapeIds.size === 0) return
  draggingShapeIds = new Set()
  emit()
}

export function isTextDisplayDrag(id: string): boolean {
  return draggingShapeIds.has(id)
}

export function useTextDisplayDragIds(): ReadonlySet<string> {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => draggingShapeIds,
    () => draggingShapeIds,
  )
}

/** 单元素订阅：拖拽/缩放/旋转直操期间为 true（供 ElementRenderer 切换 Konva 文字） */
export function useIsTextDisplayDrag(id: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => draggingShapeIds.has(id),
    () => draggingShapeIds.has(id),
  )
}
