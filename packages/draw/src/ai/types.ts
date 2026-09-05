// src/ai/types.ts

// ═══════════════════════════════════════
// 动作类型（LLM 输出）
// ═══════════════════════════════════════

export interface AddElementAction {
  type: 'add_element'
  refId?: string
  schema: string
  x: number
  y: number
  text?: string
  /**
   * 可选样式覆盖（"#rrggbb" 或 "r,g,b"），优先于内置语义配色主题。
   * 值在执行前由 colorTheme.sanitizeStyleOverride 白名单清洗，非法值丢弃。
   */
  style?: { fill?: string; lineColor?: string }
}

export interface AddLinkerAction {
  type: 'add_linker'
  refId?: string
  from: string        // 真实 id 或本批 add_element 的 refId
  to: string
  text?: string
  linkerType?: 'curve' | 'broken' | 'line'
}

export interface UpdateElementAction {
  type: 'update_element'
  id: string          // 真实 id 或本批 add_element 的 refId
  text?: string
  x?: number
  y?: number
  w?: number
  h?: number
}

export interface UpdateLinkerAction {
  type: 'update_linker'
  id: string
  text?: string
}

export interface DeleteElementAction {
  type: 'delete_element'
  id: string
}

export interface DeleteLinkerAction {
  type: 'delete_linker'
  id: string
}

export type AIAction =
  | AddElementAction
  | AddLinkerAction
  | UpdateElementAction
  | UpdateLinkerAction
  | DeleteElementAction
  | DeleteLinkerAction

export interface AIResponse {
  actions: AIAction[]
  message: string
  /** 模型思考过程（reasoning_content） */
  reasoning?: string
}

// ═══════════════════════════════════════
// 画布压缩格式
// ═══════════════════════════════════════

export interface CompressedElement {
  id: string
  name: string
  category: string
  text: string
  x: number
  y: number
  w: number
  h: number
}

export interface CompressedLinker {
  id: string
  from: string | null
  to: string | null
  text: string
  type: 'curve' | 'broken' | 'line'
}

export interface CompressedCanvas {
  elements: CompressedElement[]
  linkers: CompressedLinker[]
}

// ═══════════════════════════════════════
// 持久化：对话/消息/配置/模板
// ═══════════════════════════════════════

export interface MessageImage {
  /** 压缩后的 base64（≤1536px, JPEG q0.85） */
  dataUrl: string
}

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  images?: MessageImage[]
  /** assistant 消息里携带的 AI 动作（用于显示动作摘要） */
  actions?: AIAction[]
  /** 模型思考过程 */
  reasoning?: string
  timestamp: number
}

export interface Conversation {
  id: string
  title: string
  messages: ConversationMessage[]
  createdAt: number
  updatedAt: number
}

export interface AISettings {
  baseUrl: string
  apiKey: string
  model: string
}

export interface Template {
  id: string
  name: string
  description: string
  icon: string
  prompt: string
  builtin: number
}

// ═══════════════════════════════════════
// 错误类型
// ═══════════════════════════════════════

export class AIError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'api_unauthorized'
      | 'api_ratelimit'
      | 'api_server'
      | 'api_network'
      | 'api_unsupported_image'
      | 'invalid_format'
      | 'missing_actions'
      /** 本地配置非法（如 Base URL 非 HTTPS） */
      | 'invalid_settings',
  ) {
    super(message)
    this.name = 'AIError'
  }
}

// ═══════════════════════════════════════
// 辅助类型
// ═══════════════════════════════════════

export interface ActionExecutionResult {
  action: AIAction
  ok: boolean
  /** 本批 add_element / add_linker 执行后生成的真实 id */
  realId?: string
  error?: string
}

export interface ExecutionReport {
  results: ActionExecutionResult[]
  message: string
}
