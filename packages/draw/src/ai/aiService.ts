// src/ai/aiService.ts
import OpenAI from 'openai'
import type { AISettings, AIResponse } from './types'
import { parseAIResponse } from './jsonParser'
import { AIError } from './types'

/** 扩展 OpenAI 消息类型以支持 reasoning_content（千问等模型） */
interface ExtendedChatMessage extends OpenAI.Chat.Completions.ChatCompletionMessage {
  reasoning_content?: string
}

export interface ChatMessageText {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatMessageImage {
  type: 'image_url'
  image_url: { url: string }
}

export interface ChatMessageWithImages {
  role: 'user' | 'assistant'
  content: string | Array<{ type: 'text'; text: string } | ChatMessageImage>
}

export type ChatMessage = ChatMessageText | ChatMessageWithImages

export interface SendMessageParams {
  systemPrompt: string
  messages: ChatMessage[]
  stream?: boolean
  /** 流式模式下，思考过程（reasoning_content）每个增量片段的回调 */
  onReasoningChunk?: (chunk: string, fullSoFar: string) => void
  /** 流式模式下，正文内容（content）每个增量片段的回调 */
  onContentChunk?: (chunk: string, fullSoFar: string) => void
}

/** 连通性自检结果 */
export interface PingResult {
  ok: boolean
  /** 失败时的用户可读错误描述 */
  error?: string
}

/**
 * 判断错误是否为"用户主动取消请求"（AbortController / SDK 中止）。
 * OpenAI SDK 中止时抛出 APIUserAbortError（非 DOMException），
 * 因此同时按 name 与 message 双重判定。
 */
export function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') return true
  if (error && typeof error === 'object' && 'name' in error) {
    const name = (error as { name?: unknown }).name
    if (name === 'AbortError' || name === 'APIUserAbortError') return true
  }
  const message = error instanceof Error ? error.message : ''
  return /aborted/i.test(message)
}

/**
 * 校验 baseUrl 安全性：
 * - 仅允许 https，或本机调试地址 http://localhost / http://127.0.0.1
 * - 拒绝携带 userinfo（user:pass@host）的 URL，防止凭据泄露到第三方路径
 * 非法配置抛出 AIError('invalid_settings')。
 */
export function assertValidBaseUrl(baseUrl: string): void {
  let url: URL
  try {
    url = new URL(baseUrl)
  } catch {
    throw new AIError('Base URL 格式不正确，请检查设置', 'invalid_settings')
  }
  if (url.username || url.password) {
    throw new AIError('Base URL 不应包含用户名或密码', 'invalid_settings')
  }
  const isLocalHttp =
    url.protocol === 'http:' &&
    (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
  if (url.protocol !== 'https:' && !isLocalHttp) {
    throw new AIError(
      '出于安全考虑，Base URL 必须使用 HTTPS（本机调试可使用 http://localhost）',
      'invalid_settings',
    )
  }
}

export class AIService {
  private client: OpenAI
  private model: string

  constructor(settings: AISettings) {
    assertValidBaseUrl(settings.baseUrl)
    this.client = new OpenAI({
      baseURL: settings.baseUrl,
      apiKey: settings.apiKey,
      dangerouslyAllowBrowser: true,
    })
    this.model = settings.model
  }

  async sendMessage(params: SendMessageParams, signal?: AbortSignal): Promise<AIResponse> {
    const { systemPrompt, messages, stream: _stream = false } = params

    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => {
        // 如果 content 是数组（包含图片），直接传递
        if (Array.isArray(m.content)) {
          return {
            role: m.role as 'user' | 'assistant',
            content: m.content,
          } as OpenAI.Chat.ChatCompletionMessageParam
        }
        return {
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }
      }),
    ]

    try {
      // 默认走流式：便于实时透出思考过程与正文，提供"打字机"体验
      return await this.handleStream(openaiMessages, signal, {
        onReasoningChunk: params.onReasoningChunk,
        onContentChunk: params.onContentChunk,
      })
    } catch (error: unknown) {
      if (isAbortError(error)) throw error
      // 解析阶段抛出的 AIError（invalid_format 等）原样透传，
      // 不能被下方网络错误映射重写为 api_server
      if (error instanceof AIError) throw error
      this.handleError(error)
    }
  }

  /**
   * 连通性自检：发起 max_tokens=1 的最小请求。
   * 不经过业务响应解析（sendMessage 会要求 JSON actions 格式，必然误报失败）。
   */
  static async ping(settings: AISettings): Promise<PingResult> {
    try {
      assertValidBaseUrl(settings.baseUrl)
      const client = new OpenAI({
        baseURL: settings.baseUrl,
        apiKey: settings.apiKey,
        dangerouslyAllowBrowser: true,
      })
      await client.chat.completions.create(
        {
          model: settings.model,
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 1,
        },
        { maxRetries: 0 },
      )
      return { ok: true }
    } catch (error: unknown) {
      return { ok: false, error: classifyError(error).message }
    }
  }

  private async handleStream(
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
    signal?: AbortSignal,
    callbacks?: {
      onReasoningChunk?: (chunk: string, fullSoFar: string) => void
      onContentChunk?: (chunk: string, fullSoFar: string) => void
    },
  ): Promise<AIResponse> {
    const stream = await this.client.chat.completions.create(
      { model: this.model, messages, stream: true },
      signal ? { signal } : undefined,
    )

    let contentBuffer = ''
    let reasoningBuffer = ''
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta as ExtendedChatMessage | undefined
      if (!delta) continue

      // 千问等模型在流式下通过 delta.reasoning_content 逐步吐出思考过程
      const reasoningChunk = delta.reasoning_content ?? ''
      if (reasoningChunk) {
        reasoningBuffer += reasoningChunk
        callbacks?.onReasoningChunk?.(reasoningChunk, reasoningBuffer)
      }

      const contentChunk = delta.content ?? ''
      if (contentChunk) {
        contentBuffer += contentChunk
        callbacks?.onContentChunk?.(contentChunk, contentBuffer)
      }
    }

    // DEV 模式打印原始响应，便于调试不同模型的输出格式
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console -- DEV 模式诊断输出
      console.log('[AI] 原始响应:', contentBuffer)
      if (reasoningBuffer) {
        // eslint-disable-next-line no-console -- DEV 模式诊断输出
        console.log('[AI] 思考过程:', reasoningBuffer)
      }
    }

    const result = parseAIResponse(contentBuffer)
    if (reasoningBuffer) {
      result.reasoning = reasoningBuffer
    }
    return result
  }

  /** 将任意异常归一化为 AIError（按 status/code 映射为用户可读消息） */
  private handleError(error: unknown): never {
    throw classifyError(error)
  }
}

function classifyError(error: unknown): AIError {
  if (error instanceof AIError) return error

  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: number }).status

    if (status === 401) {
      return new AIError('API 密钥无效', 'api_unauthorized')
    }
    if (status === 429) {
      return new AIError('请求太频繁', 'api_ratelimit')
    }
    if (status === 500) {
      return new AIError('服务器错误', 'api_server')
    }
  }

  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code

    if (code === 'ECONNREFUSED' || code === 'ENOTFOUND') {
      return new AIError('网络连接失败', 'api_network')
    }
  }

  const message = error instanceof Error ? error.message : String(error)
  return new AIError(`未知错误: ${message}`, 'api_server')
}
