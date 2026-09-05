// src/ai/canvasSerializer.ts
import type { ElementInstance, LinkerInstance } from '@/types'
import type {
  CompressedElement,
  CompressedLinker,
  CompressedCanvas,
} from './types'

/**
 * 将 ElementInstance 压缩为 LLM 可理解的精简 JSON。
 * 只保留画图需要的字段：id, name, category, text, x, y, w, h。
 * 丢弃 path、anchors、样式、dataAttributes 等。
 */
export function serializeElement(el: ElementInstance): CompressedElement {
  return {
    id: el.id,
    name: el.name,
    category: el.category,
    text: el.title,
    x: el.props.x,
    y: el.props.y,
    w: el.props.w,
    h: el.props.h,
  }
}

/**
 * 从压缩 JSON 还原为 ElementInstance 的部分字段。
 * 还原结果不包含 path、anchors 等渲染所需字段，
 * 仅用于测试或 LLM 输出校验。
 */
export function deserializeElement(compressed: CompressedElement): Partial<ElementInstance> {
  return {
    id: compressed.id,
    name: compressed.name,
    category: compressed.category,
    title: compressed.text,
    props: {
      x: compressed.x,
      y: compressed.y,
      w: compressed.w,
      h: compressed.h,
      zindex: 0,
      angle: 0,
    },
  }
}

/**
 * 序列化整个画布（elements + linkers）为压缩格式。
 */
export function serializeCanvas(
  elements: ElementInstance[],
  linkers: LinkerInstance[],
): CompressedCanvas {
  return {
    elements: elements.map(serializeElement),
    linkers: linkers.map(serializeLinker),
  }
}

/**
 * 将 LinkerInstance 压缩为精简格式。
 * from/to 只保留元素 id（null 表示自由端点）。
 */
function serializeLinker(ln: LinkerInstance): CompressedLinker {
  return {
    id: ln.id,
    from: ln.from.id,
    to: ln.to.id,
    text: ln.text,
    type: ln.linkerType,
  }
}
