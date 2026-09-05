// src/ai/promptContext.ts
// 组装 system prompt 所需上下文：
//   画布压缩序列化 + 可用图形 schema 列表 → buildSystemPrompt
// 使 LLM 知晓合法 schema 名与画布上已有元素 id（增量修改的前提）。
import type { ElementInstance, LinkerInstance } from '@/types'
import { isLinker } from '@/types'
import { shapeRegistry } from '@/core/schema/registry'
import { serializeCanvas } from './canvasSerializer'
import { buildSystemPrompt } from './systemPrompt'

/** 编辑器文档的最小结构切片 */
interface EditorDocumentLike {
  elements: Record<string, ElementInstance | LinkerInstance>
}

/**
 * 收集注册表中所有可用图形名，按分类字母序输出。
 * 例：["flow: flowStart, flowProcess, ...", "bpmn: bpmnTask, ..."]
 */
export function collectSchemaList(): string[] {
  const lines: string[] = []
  for (const category of [...shapeRegistry.getCategories()].sort()) {
    const names = shapeRegistry.getShapesByCategory(category).map((s) => s.name)
    if (names.length > 0) {
      lines.push(`${category}: ${names.join(', ')}`)
    }
  }
  return lines
}

/**
 * 从当前文档构造完整 system prompt。
 * canvasContext 注入压缩 JSON（id/name/text/位置），schemaList 注入可用图形。
 */
export function buildCurrentSystemPrompt(document: EditorDocumentLike): string {
  const shapes: ElementInstance[] = []
  const linkers: LinkerInstance[] = []
  for (const el of Object.values(document.elements)) {
    if (isLinker(el)) {
      linkers.push(el)
    } else {
      shapes.push(el)
    }
  }

  const canvas = serializeCanvas(shapes, linkers)
  return buildSystemPrompt({
    canvasContext: JSON.stringify(canvas),
    schemaList: collectSchemaList(),
  })
}
