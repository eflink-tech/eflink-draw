// Konva 节点注册表
// 交互期间（拖拽/resize）通过它直接拿到 Konva 节点操作，
import type Konva from 'konva'
import type { ElementInstance } from '@/types'
import type { ShapeRect } from './linker'

/** id → 元素 Group 节点 */
const elementNodes = new Map<string, Konva.Group>()
/** id → 连线 Shape 节点 */
const linkerNodes = new Map<string, Konva.Shape>()
/** id → 连线文字标签 Group 节点 */
const linkerLabelNodes = new Map<string, Konva.Group>()

export function registerElementNode(id: string, node: Konva.Group | null): void {
  if (node) elementNodes.set(id, node)
  else elementNodes.delete(id)
}

export function registerLinkerNode(id: string, node: Konva.Shape | null): void {
  if (node) linkerNodes.set(id, node)
  else linkerNodes.delete(id)
}

export function registerLinkerLabelNode(id: string, node: Konva.Group | null): void {
  if (node) linkerLabelNodes.set(id, node)
  else linkerLabelNodes.delete(id)
}

export function getElementNode(id: string): Konva.Group | undefined {
  return elementNodes.get(id)
}

export function getLinkerNode(id: string): Konva.Shape | undefined {
  return linkerNodes.get(id)
}

export function getLinkerLabelNode(id: string): Konva.Group | undefined {
  return linkerLabelNodes.get(id)
}

/**
 * 读取图形实时矩形（交互期间的直操位置，而非 store 里的旧值）
 * Group 的 position 即世界坐标（Layer 无变换）
 */
export function getLiveRect(id: string, fallback: ElementInstance): ShapeRect {
  const node = elementNodes.get(id)
  if (!node) {
    return { x: fallback.props.x, y: fallback.props.y, w: fallback.props.w, h: fallback.props.h }
  }
  return { x: node.x(), y: node.y(), w: fallback.props.w, h: fallback.props.h }
}
