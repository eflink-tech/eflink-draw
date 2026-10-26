// 一次性本地数据迁移：把 efLink 品牌时代的 localStorage 键搬到 DocuLuma 命名空间。
// 各编辑器包（draw/mindmap/...）共用同一模式：在包入口模块级调用 migrateLegacyLocalStorage()。
import { migrateLocalStorageKey } from '@eflink-tech/office-kit'
import { STORAGE_KEY } from '@/core/editor/persistence'

/** 旧文档缓存键（efdraw 命名空间；仅迁移使用，勿在新代码中引用） */
export const LEGACY_STORAGE_KEY = 'efdraw:document:v1'

/**
 * 把旧键 efdraw:document:v1 改名为新键 doculuma:draw:document:v1。
 * 真改名语义（新键已存在则只清旧键，不覆盖本次会话数据）；
 * localStorage 不可用（SSR/隐私模式）时静默跳过。
 */
export function migrateLegacyLocalStorage(): void {
  migrateLocalStorageKey(LEGACY_STORAGE_KEY, STORAGE_KEY)
}
