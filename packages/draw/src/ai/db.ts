import Dexie, { type Table } from 'dexie'
import { readLegacyIndexedDb } from '@eflink-tech/office-kit'
import type { Conversation, ConversationMessage, AISettings, Template } from './types'
import { BUILTIN_TEMPLATES } from './builtinTemplates'

export class Aidb extends Dexie {
  conversations!: Table<Conversation, string>
  settings!: Table<AISettings & { key: string }, string>
  templates!: Table<Template, string>

  constructor() {
    super('doculuma-draw-ai')
    this.version(1).stores({
      conversations: 'id, updatedAt',
      settings: 'key',
      templates: 'id, builtin',
    })
  }
}

export const db = new Aidb()

/** 旧品牌时代的 IndexedDB 库名（只读导入一次，不删除旧库；仅供 legacy 迁移使用） */
const LEGACY_DB_NAME = 'efdraw-ai'
const LEGACY_STORE_NAMES = ['conversations', 'settings', 'templates'] as const

let legacyImportOnce: Promise<void> | null = null

/**
 * 一次性把旧库（efdraw-ai）数据导入新库（doculuma-draw-ai）。
 * 仅在对应新表为空时写入；旧库保留不删除；任何失败静默吞掉，不阻塞编辑器。
 * memoized：各 store 首次读取时 await 它，全局只真正执行一次。
 */
export function ensureLegacyImport(): Promise<void> {
  if (!legacyImportOnce) {
    legacyImportOnce = importLegacyRows().catch(() => {
      /* 迁移失败：保持新库现状，编辑器照常运行 */
    })
  }
  return legacyImportOnce
}

async function importLegacyRows(): Promise<void> {
  const legacy = await readLegacyIndexedDb(LEGACY_DB_NAME, LEGACY_STORE_NAMES)
  if (!legacy) return
  await Promise.all([
    importTable(db.conversations, legacy.conversations),
    importTable(db.settings, legacy.settings),
    importTable(db.templates, legacy.templates),
  ])
}

/** 目标表非空则跳过（本次会话/此前已有新数据，以新库为准） */
async function importTable<T>(table: Table<T, string>, rows: unknown[] | undefined): Promise<void> {
  if (!rows || rows.length === 0) return
  if ((await table.count()) > 0) return
  await table.bulkPut(rows as T[])
}

/** 删除并重建数据库（仅测试用） */
export async function resetDb(): Promise<void> {
  await db.delete()
  await db.open()
}

const SETTINGS_KEY = 'main'
const DEFAULT_SETTINGS: AISettings = { baseUrl: '', apiKey: '', model: '' }

/** AI 服务配置的持久化读写（单行存储） */
export const settingsStore = {
  async getSettings(): Promise<AISettings> {
    await ensureLegacyImport()
    const row = await db.settings.get(SETTINGS_KEY)
    if (!row) return { ...DEFAULT_SETTINGS }
    return { baseUrl: row.baseUrl, apiKey: row.apiKey, model: row.model }
  },

  async saveSettings(s: AISettings): Promise<void> {
    await db.settings.put({ key: SETTINGS_KEY, ...s })
  },

  async resetSettings(): Promise<void> {
    await db.settings.delete(SETTINGS_KEY)
  },

  async isConfigured(): Promise<boolean> {
    const s = await this.getSettings()
    return Boolean(s.baseUrl && s.apiKey && s.model)
  },

  maskApiKey(apiKey?: string): string {
    if (!apiKey) return '***'
    if (apiKey.length <= 8) return '***'
    return `${apiKey.slice(0, 4)}***${apiKey.slice(-4)}`
  },
}

/** 对话历史的增删查改（消息以整条对话为单位落库） */
export const conversationStore = {
  async createConversation(title: string): Promise<string> {
    const id = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const now = Date.now()
    const conv: Conversation = { id, title, messages: [], createdAt: now, updatedAt: now }
    await db.conversations.add(conv)
    return id
  },

  async loadConversation(id: string): Promise<Conversation | undefined> {
    await ensureLegacyImport()
    return db.conversations.get(id)
  },

  async listConversations(): Promise<Conversation[]> {
    await ensureLegacyImport()
    return db.conversations.orderBy('updatedAt').reverse().toArray()
  },

  async deleteConversation(id: string): Promise<void> {
    await db.conversations.delete(id)
  },

  async appendMessage(conversationId: string, message: ConversationMessage): Promise<void> {
    await db.transaction('rw', db.conversations, async () => {
      const conv = await db.conversations.get(conversationId)
      if (!conv) throw new Error(`Conversation ${conversationId} not found`)
      const updated: Conversation = {
        ...conv,
        messages: [...conv.messages, message],
        updatedAt: Date.now(),
      }
      await db.conversations.put(updated)
    })
  },
}

/** 内置模板库（种子数据写入 + 查询） */
export const templateStore = {
  /** 将内置模板幂等写入数据库；失败时直接抛出由调用方处理 */
  async seedBuiltin(): Promise<void> {
    // 先完成旧库导入再播种，避免「新表已非空」误判跳过旧数据
    await ensureLegacyImport()
    await db.transaction('rw', db.templates, async () => {
      for (const t of BUILTIN_TEMPLATES) {
        const existing = await db.templates.get(t.id)
        if (!existing) {
          await db.templates.add(t)
        }
      }
    })
  },

  async getBuiltinTemplates(): Promise<Template[]> {
    await ensureLegacyImport()
    return db.templates.where('builtin').equals(1).toArray()
  },
}
