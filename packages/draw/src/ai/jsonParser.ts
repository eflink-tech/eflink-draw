// src/ai/jsonParser.ts
import { AIError, type AIAction, type AIResponse } from './types'

/**
 * 单次响应允许的最大动作数上限。
 * LLM 输出不受信任，防止异常输出导致浏览器在主线程执行超量绘制（客户端 DoS）。
 */
export const MAX_ACTIONS = 200

/** 严格数字：必须是 number 且有限（拒绝 NaN / Infinity / 数字字符串） */
function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}

/** 非空字符串 */
function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.length > 0
}

/**
 * 校验单个 action 的字段合法性（LLM 输出不可信）。
 * 合法返回 true；可选字段存在时也必须满足类型要求。
 */
function isValidAction(value: unknown): value is AIAction {
  if (!value || typeof value !== 'object') return false
  const a = value as Record<string, unknown>

  switch (a.type) {
    case 'add_element':
      return (
        isNonEmptyString(a.schema) &&
        isFiniteNumber(a.x) &&
        isFiniteNumber(a.y) &&
        (a.refId === undefined || typeof a.refId === 'string') &&
        (a.text === undefined || typeof a.text === 'string') &&
        // style 仅做形态校验，颜色值合法性交给 executor 的 sanitizeStyleOverride
        (a.style === undefined || (typeof a.style === 'object' && a.style !== null && !Array.isArray(a.style)))
      )
    case 'add_linker':
      return (
        isNonEmptyString(a.from) &&
        isNonEmptyString(a.to) &&
        (a.linkerType === undefined || typeof a.linkerType === 'string') &&
        (a.refId === undefined || typeof a.refId === 'string') &&
        (a.text === undefined || typeof a.text === 'string')
      )
    case 'update_element':
      return (
        isNonEmptyString(a.id) &&
        (a.text === undefined || typeof a.text === 'string') &&
        (a.x === undefined || isFiniteNumber(a.x)) &&
        (a.y === undefined || isFiniteNumber(a.y)) &&
        (a.w === undefined || isFiniteNumber(a.w)) &&
        (a.h === undefined || isFiniteNumber(a.h))
      )
    case 'update_linker':
      return (
        isNonEmptyString(a.id) &&
        (a.text === undefined || typeof a.text === 'string')
      )
    case 'delete_element':
    case 'delete_linker':
      return isNonEmptyString(a.id)
    default:
      return false
  }
}

/**
 * 从不可信的 parsed 对象构造安全的 AIResponse：
 * - 丢弃类型不合法的 action（模型偶发幻觉字段时不至于整批失败）
 * - message 强制为 string，避免非字符串进入 React 渲染崩溃
 * - 截断到 MAX_ACTIONS 上限
 * - 提取 reasoning 字段（思考过程）
 */
function toSafeResponse(parsed: object): AIResponse {
  const raw = parsed as { actions?: unknown; message?: unknown; reasoning?: unknown }
  const rawActions = Array.isArray(raw.actions) ? raw.actions : []
  const actions = rawActions.filter(isValidAction).slice(0, MAX_ACTIONS)
  if (import.meta.env.DEV && actions.length < rawActions.length) {
    const invalid = rawActions.filter((a) => !isValidAction(a))
    // eslint-disable-next-line no-console -- DEV 模式诊断输出
    console.warn('[AI] 丢弃非法动作:', JSON.stringify(invalid))
  }
  return {
    actions,
    message: typeof raw.message === 'string' ? raw.message : '',
    reasoning: typeof raw.reasoning === 'string' ? raw.reasoning : undefined,
  }
}

/**
 * 四步容错解析 LLM 输出为 AIResponse：
 * 1. 剥离 markdown 围栏（```json ... ```）
 * 2. 扫描花括号配平，截取含 "actions" 键的 JSON 文本
 * 3. 兜底整体 parse（对象，或模型漏掉外层包裹的裸 actions 数组）
 * 4. 文字后跟裸数组时截取解析
 *
 * 返回前做运行时校验：非法 action 被丢弃、actions 截断到 {@link MAX_ACTIONS}、
 * message 强制字符串。全非法输入抛 AIError('invalid_format')。
 */
export function parseAIResponse(input: string): AIResponse {
  // Step 1: 剥离 markdown 代码围栏
  let cleaned = input.trim()
  const fenceMatch = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/)
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim()
  }

  // Step 2: 从左至右扫描花括号配平，截取含 "actions" 键的 JSON 文本
  let depth = 0
  let start = -1
  let end = -1

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i]

    // 跳过字符串字面量（处理 \" 和 \\ 转义）
    if (char === '"') {
      i++
      while (i < cleaned.length) {
        const sc = cleaned[i]
        if (sc === '\\') {
          i += 2 // 跳过转义字符
          continue
        }
        if (sc === '"') break
        i++
      }
      continue
    }

    if (char === '{') {
      if (depth === 0) start = i
      depth++
    } else if (char === '}') {
      depth--
      if (depth === 0 && start !== -1) {
        end = i
        const candidate = cleaned.slice(start, end + 1)
        try {
          const parsed: unknown = JSON.parse(candidate)
          if (parsed && typeof parsed === 'object' && 'actions' in parsed) {
            return toSafeResponse(parsed)
          }
        } catch {
          // 不是合法 JSON，继续扫描
        }
        // 重置，继续找下一个
        start = -1
        end = -1
      }
    }
  }

  // Step 3: 尝试整体 parse（兜底）：完整对象，或模型漏掉外层包裹的裸 actions 数组
  try {
    const parsed: unknown = JSON.parse(cleaned)
    if (parsed && typeof parsed === 'object' && 'actions' in parsed) {
      return toSafeResponse(parsed)
    }
    if (Array.isArray(parsed)) {
      return toSafeResponse({ actions: parsed })
    }
  } catch {
    // fall through to error
  }

  // Step 4: 文字后跟裸数组（如"生成结果如下：[...]"）——从首个 [ 截到末个 ] 再试
  const arrStart = cleaned.indexOf('[')
  const arrEnd = cleaned.lastIndexOf(']')
  if (arrStart !== -1 && arrEnd > arrStart) {
    try {
      const parsed: unknown = JSON.parse(cleaned.slice(arrStart, arrEnd + 1))
      if (Array.isArray(parsed)) {
        return toSafeResponse({ actions: parsed })
      }
    } catch {
      // fall through to error
    }
  }

  throw new AIError('AI 输出格式错误：无法解析 JSON 或缺少 actions 字段', 'invalid_format')
}
