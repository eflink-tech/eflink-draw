// 面板样式写回操作
// 与 Dock「取第一个选中回显、修改应用到所有选中」的应用方式。
import { useEditorStore } from '@/store/editorStore'
import type { ElementInstance, FillStyle, FontStyle, LinkerInstance } from '@/types'
import { isLinker } from '@/types'
import { LINKER_FONT_DEFAULTS } from './linker'
import { isSwimlane, resolveTarget } from './swimlane'

/**
 */
export function convertFillStyle(cur: FillStyle, type: 'none' | 'solid'): FillStyle {
  if (type === 'none') return { type: 'none' }
  if (cur.type === 'solid' && cur.color) return { type: 'solid', color: cur.color }
  return { type: 'solid', color: '255,255,255' }
}

/** 选中元素中的图形列表 */
export function selectedShapes(): ElementInstance[] {
  const st = useEditorStore.getState()
  return [...st.selectedIds]
    .map((id) => st.document.elements[id])
    .filter((el): el is ElementInstance => el != null && !isLinker(el))
}

/** 选中元素中的连线列表 */
export function selectedLinkers(): LinkerInstance[] {
  const st = useEditorStore.getState()
  return [...st.selectedIds]
    .map((id) => st.document.elements[id])
    .filter((el): el is LinkerInstance => el != null && isLinker(el))
}

/** 图形补丁应用到所有选中图形 */
export function applyShapePatch(
  patch: (el: ElementInstance) => Partial<ElementInstance>,
): void {
  const st = useEditorStore.getState()
  for (const el of selectedShapes()) {
    st.updateElement(el.id, patch(el))
  }
}

/** 连线补丁应用到所有选中连线 */
export function applyLinkerPatch(
  patch: (l: LinkerInstance) => Partial<LinkerInstance>,
): void {
  const st = useEditorStore.getState()
  for (const l of selectedLinkers()) {
    st.updateLinker(l.id, patch(l))
  }
}

/** 连线字体（无值时用默认兜底，保证面板可编辑） */
export function linkerFont(l: LinkerInstance): FontStyle {
  return { ...LINKER_FONT_DEFAULTS, ...l.fontStyle }
}

/**
 * 泳道族当前文字目标的块下标：标题带 → 0，二级标题格 i → i+1；
 * 泳道体（无文字）或非泳道族返回 null。
 */
export function targetFontBlockIndex(el: ElementInstance): number | null {
  if (!isSwimlane(el)) return null
  const target = resolveTarget(el, useEditorStore.getState().activeTarget)
  if (target.kind === 'title') return 0
  return target.kind === 'head' ? target.index + 1 : null
}

/**
 * 字体补丁路由：泳道族文字目标 → 写对应块的块级 fontStyle（独立控制）；
 * 其余 → 图形级 fontStyle。返回 updateElement 用的补丁。
 */
export function applyFontPatch(
  el: ElementInstance,
  patch: Partial<FontStyle>,
): Partial<ElementInstance> {
  const idx = targetFontBlockIndex(el)
  if (idx == null) return { fontStyle: { ...el.fontStyle, ...patch } }
  return {
    textBlock: el.textBlock.map((tb, i) =>
      i === idx ? { ...tb, fontStyle: { ...tb.fontStyle, ...patch } } : tb,
    ),
  }
}

/** 生效字体 = 图形级 + 当前文字目标块的块级覆盖合并（面板回显用） */
export function effectiveFont(el: ElementInstance): FontStyle {
  const idx = targetFontBlockIndex(el)
  return idx == null ? el.fontStyle : { ...el.fontStyle, ...el.textBlock[idx]?.fontStyle }
}
