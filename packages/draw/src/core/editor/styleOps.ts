// 面板样式写回操作
// 与 Dock「取第一个选中回显、修改应用到所有选中」的应用方式。
import { useEditorStore } from '@/store/editorStore'
import type { ElementInstance, FillStyle, FontStyle, LinkerInstance } from '@/types'
import { isLinker } from '@/types'
import { LINKER_FONT_DEFAULTS } from './linker'

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
