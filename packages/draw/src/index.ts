/** @eflink-tech/draw 对外导出面：编辑器组件 + store + 持久化辅助 */
// 图形定义注册（形状 schema 侧-effects）必须先于组件执行
import './core/schema/shapes'
// 顶栏/菜单栏样式来自 office-kit：宿主只引入 dist/styles.css，必须在此显式引入才会打进产物
import '@eflink-tech/office-kit/styles.css'
import './styles.css'
// 一次性迁移：efdraw:* 本地缓存 → doculuma:draw:*（必须早于任何读写新键的代码）
import { migrateLegacyLocalStorage } from './storage/legacy'

migrateLegacyLocalStorage()

// 组件
export { DrawEditor } from './DrawEditor'
export type { DrawEditorProps, DrawEditorBrand } from './DrawEditor'

// 品牌切换：'doculuma' | 'eflink' 内置品牌，或传对象自定义
export { builtinEditorBrand, resolveEditorBrandId, EDITOR_BRAND_IDS } from './brand'
export type { EditorBrandId } from './brand'
export { setDrawRemoteStore } from './core/editor/persistence'
export { setEditorBackHref } from './core/editor/chrome'
export type { DrawRemoteStore } from './core/editor/persistence'

// 多语言：界面文案字典 + 素材标题（图形库/分类/模板）查表翻译
export { DRAW_MESSAGES, setDrawLocale, getDrawLocale, drawT, translateTitle } from './i18n'
export type { OfficeLocale } from '@eflink-tech/office-kit'

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
