/** @eflink-tech/draw 对外导出面：编辑器组件 + store + 持久化辅助 */
// 图形定义注册（形状 schema 侧-effects）必须先于组件执行
import './core/schema/shapes'
import './styles.css'

// 组件
export { DrawEditor } from './DrawEditor'
export { setDrawRemoteStore } from './core/editor/persistence'
export { setEditorBackHref } from './core/editor/chrome'
export type { DrawRemoteStore } from './core/editor/persistence'

// 分享桥接：宿主注入分享实现（编辑器分享按钮调用）
export { setDrawShareHandler } from './core/share/shareBridge'
export type { DrawShareHandler, DrawShareResult } from './core/share/shareBridge'

// 状态
export { useEditorStore } from './store/editorStore'
export { useUIStore } from './store/uiStore'

// 持久化（localStorage 快照，IndexedDB 见 ai/db）
export { STORAGE_KEY, saveDocumentToStorage, loadDocumentFromStorage, isDocumentData } from './core/editor/persistence'

// 数据模型
export { createEmptyDocument } from './types'
export type { DocumentData } from './types'
