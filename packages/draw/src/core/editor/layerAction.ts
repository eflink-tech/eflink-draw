// 层级调整统一入口：右键菜单 / 排列菜单 / 快捷键共用，避免行为分叉
import { useEditorStore } from '@/store/editorStore'
import { isLinker } from '@/types'

export type LayerAction = 'front' | 'back' | 'forward' | 'backward'

/** 当前选区中可参与层级的图形 id（排除连线、锁定） */
export function getLayerEligibleShapeIds(): string[] {
  const st = useEditorStore.getState()
  return [...st.selectedIds].filter((id) => {
    const el = st.document.elements[id]
    return el != null && !isLinker(el) && !el.locked
  })
}

/**
 * 与右键「上移一层 / 下移一层 / 置顶 / 置底」同一调用链：
 * 过滤连线与锁定 → 单选边界判断 → layerShapes
 */
export function applyLayerAction(action: LayerAction): void {
  const shapeIds = getLayerEligibleShapeIds()
  if (shapeIds.length === 0) return
  useEditorStore.getState().layerShapes(shapeIds, action)
}

/** 根据物理键位解析层级快捷键（优先 e.code，兼容全角括号） */
export function resolveLayerShortcut(e: KeyboardEvent): LayerAction | null {
  const isRight =
    e.code === 'BracketRight' || e.key === ']' || e.key === '}' || e.key === '】'
  const isLeft =
    e.code === 'BracketLeft' || e.key === '[' || e.key === '{' || e.key === '【'
  if (!isRight && !isLeft) return null

  const mod = e.ctrlKey || e.metaKey
  const alt = e.altKey && !mod
  const shift = e.shiftKey || e.getModifierState('Shift')

  // ⌥]/⌥[（Alt+] / Alt+[）：上移/下移一层（Mac 兼容，避免 ⇧]/⌘⇧ 被浏览器截获）
  if (alt) {
    return isRight ? 'forward' : 'backward'
  }
  // ⌘/Ctrl：置顶/置底；⌘⇧ 若浏览器未截获则仍单步移动
  if (mod) {
    return isRight ? (shift ? 'forward' : 'front') : shift ? 'backward' : 'back'
  }
  return null
}

/** Mac 上 ⌥] 后可能紧跟一次无 Alt 的 ⌘]（被当成置顶）；吞掉该幽灵事件 */
let lastAltStepLayerAt = 0
const ALT_STEP_LAYER_DEBOUNCE_MS = 120

/** 处理层级快捷键；已消费返回 true */
export function handleLayerKeydown(e: KeyboardEvent): boolean {
  const action = resolveLayerShortcut(e)
  if (!action) return false

  const mod = e.ctrlKey || e.metaKey
  const shift = e.shiftKey || e.getModifierState('Shift')
  const isStep = action === 'forward' || action === 'backward'
  const now = Date.now()

  if (
    mod &&
    !shift &&
    (action === 'front' || action === 'back') &&
    now - lastAltStepLayerAt < ALT_STEP_LAYER_DEBOUNCE_MS
  ) {
    e.preventDefault()
    return true
  }

  if (isStep && e.altKey && !mod) {
    lastAltStepLayerAt = now
  }

  e.preventDefault()
  applyLayerAction(action)
  return true
}
