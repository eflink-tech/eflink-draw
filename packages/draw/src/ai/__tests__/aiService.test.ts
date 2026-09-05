// src/ai/__tests__/aiService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AIService, isAbortError } from '../aiService'
import { AIError, type AISettings } from '../types'

// Mock OpenAI SDK
// 所有实例共享同一个 create mock，便于在"同步构造后立刻调用"的场景（如 ping）预设行为
vi.mock('openai', () => {
  const sharedCreate = vi.fn()
  const OpenAI = vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        get create() {
          return sharedCreate
        },
      },
    },
  }))
  ;(OpenAI as unknown as { __create: unknown }).__create = sharedCreate
  return { default: OpenAI }
})

// 被 vi.mock 替换后的构造器（其 __create 为全部实例共享的 create mock）
import OpenAIMockDefault from 'openai'

/** 取共享的 chat.completions.create mock */
function getSharedCreate(): ReturnType<typeof vi.fn> {
  return (OpenAIMockDefault as unknown as { __create: ReturnType<typeof vi.fn> }).__create
}

const mockSettings: AISettings = {
  baseUrl: 'https://api.openai.com/v1',
  apiKey: 'sk-test-key',
  model: 'gpt-4o',
}

describe('AIService', () => {
  let service: AIService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new AIService(mockSettings)
  })

  it('发送消息并返回 AIResponse', async () => {
    // sendMessage 默认走流式（handleStream），mock 需返回异步可迭代流
    const mockStream = {
      [Symbol.asyncIterator]: async function* () {
        yield { choices: [{ delta: { content: '{"actions":[],"message":"ok"}' } }] }
        yield { choices: [{ delta: {} }] } // done
      },
    }
    vi.mocked((service as any).client.chat.completions.create).mockResolvedValue(mockStream)

    const result = await service.sendMessage({
      systemPrompt: 'You are a helpful assistant',
      messages: [{ role: 'user', content: 'Hello' }],
    })

    expect(result.actions).toEqual([])
    expect(result.message).toBe('ok')
  })

  it('处理流式响应', async () => {
    const mockStream = {
      [Symbol.asyncIterator]: async function* () {
        yield { choices: [{ delta: { content: '{"actions":' } }] }
        yield { choices: [{ delta: { content: '[],"message":"streamed"}' } }] }
        yield { choices: [{ delta: {} }] } // done
      },
    }
    vi.mocked((service as any).client.chat.completions.create).mockResolvedValue(mockStream)

    const result = await service.sendMessage({
      systemPrompt: 'You are a helpful assistant',
      messages: [{ role: 'user', content: 'Hello' }],
      stream: true,
    })

    expect(result.actions).toEqual([])
    expect(result.message).toBe('streamed')
  })

  it('处理 401 错误（API 密钥无效）', async () => {
    const error = new Error('Unauthorized') as any
    error.status = 401
    vi.mocked((service as any).client.chat.completions.create).mockRejectedValue(error)

    await expect(
      service.sendMessage({
        systemPrompt: 'test',
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    ).rejects.toThrow('API 密钥无效')
  })

  it('处理 429 错误（请求太频繁）', async () => {
    const error = new Error('Rate limit') as any
    error.status = 429
    vi.mocked((service as any).client.chat.completions.create).mockRejectedValue(error)

    await expect(
      service.sendMessage({
        systemPrompt: 'test',
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    ).rejects.toThrow('请求太频繁')
  })

  it('signal 通过 RequestOptions 第二参数传递，不出现在请求体中', async () => {
    const controller = new AbortController()
    const createMock = vi.mocked((service as any).client.chat.completions.create)
    createMock.mockResolvedValue({
      [Symbol.asyncIterator]: async function* () {
        yield { choices: [{ delta: { content: '{"actions":[],"message":"ok"}' } }] }
        yield { choices: [{ delta: {} }] } // done
      },
    })

    await service.sendMessage(
      { systemPrompt: 'test', messages: [{ role: 'user', content: 'Hello' }] },
      controller.signal,
    )

    const [body, options] = createMock.mock.calls[0] as [unknown, { signal?: AbortSignal }]
    expect((body as { signal?: unknown }).signal).toBeUndefined()
    expect(options.signal).toBe(controller.signal)
  })

  it('解析阶段抛出的 AIError 原样透传（不被改写为 api_server）', async () => {
    // 流式返回空内容 → parseAIResponse 抛 AIError(invalid_format)
    vi.mocked((service as any).client.chat.completions.create).mockResolvedValue({
      [Symbol.asyncIterator]: async function* () {
        yield { choices: [{ delta: {} }] }
      },
    })

    const err = await service
      .sendMessage({ systemPrompt: 't', messages: [{ role: 'user', content: 'x' }] })
      .catch((e: unknown) => e)

    expect(err).toBeInstanceOf(AIError)
    expect((err as AIError).code).toBe('invalid_format')
    expect((err as Error).message).toContain('无法解析 JSON 或缺少 actions')
  })
})

describe('AIService Base URL 安全校验', () => {
  const okSettings: AISettings = { baseUrl: '', apiKey: 'k', model: 'm' }

  it('非本机 http 地址被拒绝', () => {
    expect(() => new AIService({ ...okSettings, baseUrl: 'http://mock-ai.local' })).toThrow(AIError)
    try {
      new AIService({ ...okSettings, baseUrl: 'http://mock-ai.local' })
    } catch (e) {
      expect((e as AIError).code).toBe('invalid_settings')
    }
  })

  it('http://localhost 与 http://127.0.0.1 允许（本地调试）', () => {
    expect(() => new AIService({ ...okSettings, baseUrl: 'http://localhost:11434/v1' })).not.toThrow()
    expect(() => new AIService({ ...okSettings, baseUrl: 'http://127.0.0.1:8080/v1' })).not.toThrow()
  })

  it('https 地址允许', () => {
    expect(() => new AIService({ ...okSettings, baseUrl: 'https://api.openai.com/v1' })).not.toThrow()
  })

  it('携带 userinfo 的 URL 被拒绝', () => {
    expect(() => new AIService({ ...okSettings, baseUrl: 'https://user:pass@api.openai.com/v1' })).toThrow(/用户名或密码/)
  })

  it('非法 URL 字符串被拒绝', () => {
    expect(() => new AIService({ ...okSettings, baseUrl: 'not a url' })).toThrow(AIError)
  })
})

describe('AIService.ping 连通性自检（不经业务解析）', () => {
  beforeEach(() => {
    getSharedCreate().mockReset()
  })

  it('成功返回 ok:true', async () => {
    const create = getSharedCreate()
    // ping 在首次 await 前同步构造 client 并调用 create，因此必须先预设行为
    create.mockResolvedValueOnce({ choices: [{ message: { content: 'ok' } }] })
    const r = await AIService.ping({ baseUrl: 'https://api.openai.com/v1', apiKey: 'k', model: 'gpt-4o' })

    expect(r.ok).toBe(true)
    const [body] = create.mock.calls[0] as [{ max_tokens?: number; messages: unknown[] }]
    expect(body.max_tokens).toBe(1)
  })

  it('401 返回失败且消息可读', async () => {
    const err = new Error('Unauthorized') as Error & { status: number }
    err.status = 401
    getSharedCreate().mockRejectedValueOnce(err)
    const r = await AIService.ping({ baseUrl: 'https://api.openai.com/v1', apiKey: 'bad', model: 'm' })

    expect(r.ok).toBe(false)
    expect(r.error).toContain('API 密钥无效')
  })

  it('非 https 且非本机的地址直接校验失败（不发请求）', async () => {
    const beforeCount = (OpenAIMockDefault as unknown as { mock: { results: unknown[] } }).mock.results.length
    const r = await AIService.ping({ baseUrl: 'http://evil.example.com', apiKey: 'k', model: 'm' })

    expect(r.ok).toBe(false)
    expect(r.error).toContain('HTTPS')
    const afterCount = (OpenAIMockDefault as unknown as { mock: { results: unknown[] } }).mock.results.length
    // 未构造 client，说明在校验层就拦截了
    expect(afterCount).toBe(beforeCount)
  })
})

describe('isAbortError 判定', () => {
  it('识别 DOMException AbortError', () => {
    expect(isAbortError(new DOMException('aborted', 'AbortError'))).toBe(true)
  })

  it('识别 OpenAI SDK 的 APIUserAbortError（按 name）', () => {
    const e = new Error('Request was aborted.')
    e.name = 'APIUserAbortError'
    expect(isAbortError(e)).toBe(true)
  })

  it('普通错误返回 false', () => {
    expect(isAbortError(new Error('boom'))).toBe(false)
    expect(isAbortError(null)).toBe(false)
    expect(isAbortError(undefined)).toBe(false)
  })
})
