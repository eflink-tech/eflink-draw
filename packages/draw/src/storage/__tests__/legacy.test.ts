import { describe, it, expect, beforeEach } from 'vitest'
import { migrateLegacyLocalStorage, LEGACY_STORAGE_KEY } from '../legacy'
import { STORAGE_KEY, loadDocumentFromStorage } from '@/core/editor/persistence'

describe('migrateLegacyLocalStorage（efdraw → doculuma:draw 一次性迁移）', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('把 efdraw:document:v1 搬到 doculuma:draw:document:v1 并删除旧键', () => {
    const payload = JSON.stringify({ version: 1, doc: { elements: {}, page: { w: 100, h: 100 } } })
    localStorage.setItem(LEGACY_STORAGE_KEY, payload)

    migrateLegacyLocalStorage()

    expect(localStorage.getItem(STORAGE_KEY)).toBe(payload)
    expect(localStorage.getItem(LEGACY_STORAGE_KEY)).toBeNull()
    // 迁移后的数据可被持久化层正常读取（真实读路径校验）
    expect(loadDocumentFromStorage()).not.toBeNull()
  })

  it('新键已有值时不覆盖（保留本次会话数据），只清除旧键', () => {
    localStorage.setItem(LEGACY_STORAGE_KEY, 'old')
    localStorage.setItem(STORAGE_KEY, 'new')

    migrateLegacyLocalStorage()

    expect(localStorage.getItem(STORAGE_KEY)).toBe('new')
    expect(localStorage.getItem(LEGACY_STORAGE_KEY)).toBeNull()
  })

  it('旧键不存在时 no-op，不产生任何新键', () => {
    migrateLegacyLocalStorage()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('重复调用幂等', () => {
    localStorage.setItem(LEGACY_STORAGE_KEY, 'v')
    migrateLegacyLocalStorage()
    migrateLegacyLocalStorage()
    expect(localStorage.getItem(STORAGE_KEY)).toBe('v')
    expect(localStorage.getItem(LEGACY_STORAGE_KEY)).toBeNull()
  })
})
