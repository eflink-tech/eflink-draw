import Dexie, { type Table } from 'dexie'
import type { Conversation, ConversationMessage, AISettings, Template } from './types'
import { BUILTIN_TEMPLATES } from './builtinTemplates'

export class Aidb extends Dexie {
  conversations!: Table<Conversation, string>
  settings!: Table<AISettings & { key: string }, string>
  templates!: Table<Template, string>

  constructor() {
    super('efdraw-ai')
    this.version(1).stores({
      conversations: 'id, updatedAt',
      settings: 'key',
      templates: 'id, builtin',
    })
  }
}

export const db = new Aidb()

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
    return db.conversations.get(id)
  },

  async listConversations(): Promise<Conversation[]> {
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
    return db.templates.where('builtin').equals(1).toArray()
  },
}
