import { describe, it, expect, beforeEach } from 'vitest'
import { settingsStore, conversationStore, templateStore } from '../db'
import { BUILTIN_TEMPLATES } from '../builtinTemplates'
// fake-indexeddb v6 的具名导出为 indexedDB
import { indexedDB as fakeIndexedDB, IDBKeyRange } from 'fake-indexeddb'

beforeEach(async () => {
  ;(globalThis as any).indexedDB = fakeIndexedDB
  ;(globalThis as any).IDBKeyRange = IDBKeyRange
  const { resetDb } = await import('../db')
  await resetDb()
})

describe('settingsStore', () => {
  it('返回默认配置（首次使用）', async () => {
    const s = await settingsStore.getSettings()
    expect(s).toEqual({ baseUrl: '', apiKey: '', model: '' })
  })

  it('保存并读取配置', async () => {
    await settingsStore.saveSettings({
      baseUrl: 'https://api.openai.com/v1',
      apiKey: 'sk-test',
      model: 'gpt-4o',
    })
    const s = await settingsStore.getSettings()
    expect(s).toEqual({
      baseUrl: 'https://api.openai.com/v1',
      apiKey: 'sk-test',
      model: 'gpt-4o',
    })
  })

  it('覆盖已有配置', async () => {
    await settingsStore.saveSettings({ baseUrl: 'a', apiKey: 'k1', model: 'm1' })
    await settingsStore.saveSettings({ baseUrl: 'b', apiKey: 'k2', model: 'm2' })
    expect(await settingsStore.getSettings()).toEqual({
      baseUrl: 'b', apiKey: 'k2', model: 'm2',
    })
  })

  it('isConfigured() 三个字段全非空才返回 true', async () => {
    expect(await settingsStore.isConfigured()).toBe(false)
    await settingsStore.saveSettings({ baseUrl: 'x', apiKey: 'k', model: 'm' })
    expect(await settingsStore.isConfigured()).toBe(true)
  })

  it('脱敏打印 apiKey（仅显示前4+后4位）', () => {
    expect(settingsStore.maskApiKey('sk-1234567890abcdef')).toBe('sk-1***cdef')
    expect(settingsStore.maskApiKey('short')).toBe('***')
    expect(settingsStore.maskApiKey('')).toBe('***')
  })
})

describe('conversationStore', () => {
  it('createConversation 返回新 id 且 list 可查', async () => {
    const id = await conversationStore.createConversation('测试对话')
    const list = await conversationStore.listConversations()
    expect(list).toHaveLength(1)
    expect(list[0].id).toBe(id)
    expect(list[0].title).toBe('测试对话')
  })

  it('appendMessage 追加消息到对话', async () => {
    const id = await conversationStore.createConversation('d1')
    await conversationStore.appendMessage(id, {
      id: 'm1', role: 'user', content: '你好', timestamp: 1,
    })
    const conv = await conversationStore.loadConversation(id)
    expect(conv?.messages).toHaveLength(1)
    expect(conv?.messages[0].content).toBe('你好')
  })

  it('listConversations 按 updatedAt 倒序', async () => {
    const id1 = await conversationStore.createConversation('first')
    await new Promise((r) => setTimeout(r, 5))
    const id2 = await conversationStore.createConversation('second')
    const list = await conversationStore.listConversations()
    expect(list.map((c) => c.id)).toEqual([id2, id1])
  })

  it('deleteConversation 删除对话', async () => {
    const id = await conversationStore.createConversation('del')
    await conversationStore.deleteConversation(id)
    const list = await conversationStore.listConversations()
    expect(list).toHaveLength(0)
  })

  it('持久化的消息不含画布快照（仅文字+图片）', async () => {
    const id = await conversationStore.createConversation('d')
    await conversationStore.appendMessage(id, {
      id: 'm1',
      role: 'assistant',
      content: '已添加 3 个节点',
      actions: [{ type: 'add_element', schema: 'flowStart', x: 0, y: 0 }],
      timestamp: 1,
    })
    const conv = await conversationStore.loadConversation(id)
    const msg = conv?.messages[0]
    expect(msg?.actions).toHaveLength(1)
    expect((msg as any)?.canvas_context).toBeUndefined()
  })
})

describe('templateStore', () => {
  it('seedBuiltin 写入 5 个内置模板', async () => {
    await templateStore.seedBuiltin()
    const list = await templateStore.getBuiltinTemplates()
    expect(list).toHaveLength(5)
    expect(list.map((t) => t.id).sort()).toEqual(
      BUILTIN_TEMPLATES.map((t) => t.id).sort(),
    )
  })

  it('seedBuiltin 幂等（多次调用不重复）', async () => {
    await templateStore.seedBuiltin()
    await templateStore.seedBuiltin()
    const list = await templateStore.getBuiltinTemplates()
    expect(list).toHaveLength(5)
  })
})
