// src/components/ai/AIChatPanel.tsx
import { useEffect, useRef, useState } from 'react'
import { Settings, X } from 'lucide-react'
import { settingsStore, conversationStore } from '../../ai/db'
import { MessageBubble } from './MessageBubble'
import { HistoryDialog } from './HistoryDialog'
import { ACCENT_COLOR } from './theme'
import type { ConversationMessage, MessageImage, Template } from '../../ai/types'
import { AIService, isAbortError, type ChatMessage } from '../../ai/aiService'
import { buildCurrentSystemPrompt } from '../../ai/promptContext'
import { ActionExecutor } from '../../ai/actionExecutor'
import type { ActionExecutorStore, ExecutionResult, ExecuteOptions } from '../../ai/actionExecutor'
import type { AIAction } from '../../ai/types'
import { shapeRegistry } from '../../core/schema/registry'
import { useEditorStore } from '@/store/editorStore'
import { useUIStore } from '@/store/uiStore'
import { compressImage } from '../../ai/imageCompressor'
import { stripJsonBlocks } from '../../ai/stripJsonBlocks'
import { computeFitToPage } from '../../ai/fitToPage'
import { AI_TEMPLATE_SELECTED, AI_OPEN_SETTINGS } from '@/ai/events'

/** 未知异常转用户可读消息 */
function getUserErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  return String(error ?? '未知错误')
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

function decodeImageDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = dataUrl
  })
}

/** 读文件 → 解码 → 压缩（≤1536px JPEG），返回可直接发给 API 的 dataUrl */
async function loadImageAsCompressedDataUrl(file: File): Promise<string> {
  const raw = await readFileAsDataUrl(file)
  const img = await decodeImageDataUrl(raw)
  const compressed = await compressImage(img)
  return compressed.base64
}

/** 将本地消息转换为 OpenAI 协议格式（含图片的消息用 vision 数组结构） */
function toApiMessages(messages: ConversationMessage[]): ChatMessage[] {
  return messages.map((m) => {
    if (m.images && m.images.length > 0) {
      return {
        role: m.role as 'user' | 'assistant',
        content: [
          { type: 'text' as const, text: m.content },
          ...m.images.map((img) => ({
            type: 'image_url' as const,
            image_url: { url: img.dataUrl },
          })),
        ],
      }
    }
    return { role: m.role as 'user' | 'assistant', content: m.content }
  })
}

/** 用当前 editorStore 快照构造执行器依赖（document 取 getter 保证读到最新值） */
function buildExecutorStore(): ActionExecutorStore {
  const store = useEditorStore.getState()
  return {
    addElement: store.addElement,
    addLinker: store.addLinker,
    updateElement: store.updateElement,
    updateLinker: store.updateLinker,
    deleteElements: store.deleteElements,
    beginBatch: store.beginBatch,
    commitBatch: store.commitBatch,
    get document() {
      return useEditorStore.getState().document
    },
  }
}

/**
 * 把动作执行结果压缩为简短摘要：
 * - 有增删改时输出统计行
 * - 有被跳过的动作时逐条列出原因（用户能看到"为什么没画出来"）
 */
function buildExecutionSummary(result: ExecutionResult): string {
  const parts: string[] = []
  const applied: string[] = []
  if (result.added.length > 0) applied.push(`新增 ${result.added.length}`)
  if (result.updated.length > 0) applied.push(`修改 ${result.updated.length}`)
  const deletedTotal = result.deleted.elements
  if (deletedTotal > 0) {
    const cascade =
      result.deleted.cascadeLinkers > 0 ? `（级联连线 ${result.deleted.cascadeLinkers}）` : ''
    applied.push(`删除 ${deletedTotal}${cascade}`)
  }
  if (applied.length > 0) parts.push(`已应用：${applied.join('、')}`)

  if (result.skipped.length > 0) {
    const lines = result.skipped.map((s) => `- ${s.reason}`)
    parts.unshift(`⚠ ${result.skipped.length} 个操作被跳过：\n${lines.join('\n')}`)
  }
  return parts.join('\n')
}

/** 获取问候语 */
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
}

export const AIChatPanel = () => {
  const [isConfigured, setIsConfigured] = useState(true)
  const [serviceError, setServiceError] = useState<string | null>(null)
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [sending, setSending] = useState(false)
  const [pendingImages, setPendingImages] = useState<MessageImage[]>([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const aiServiceRef = useRef<AIService | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  /** 当前持久化对话 id；ref 供异步流程同步读写，state 镜像供渲染高亮 */
  const conversationIdRef = useRef<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)

  /**
   * 流式累积缓冲区：AI 流式回调运行在 async iterator 的微任务中，
   * 通过 ref 暴露可变的 reasoning/content 缓冲，渲染层按帧同步到 React state，
   * 既避免高频 setState 引发的性能问题，又能让用户看到打字机效果。
   */
  const streamBufferRef = useRef<{ reasoning: string; content: string } | null>(null)
  /** 流式期间临时 assistant 消息 id，便于按 id 更新其 reasoning/content */
  const streamingMsgIdRef = useRef<string | null>(null)
  /** ref 的 state 镜像：渲染层据此给占位消息传 streaming 标记（ref 变化不触发渲染） */
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null)

  /** 统一更新当前对话 id（同时写 ref 与 state，保持两侧一致） */
  const applyConversationId = (id: string | null) => {
    conversationIdRef.current = id
    setConversationId(id)
  }
  // 同步追踪 messages，避免 handleSend 中闭包读到过期值
  const messagesRef = useRef<ConversationMessage[]>(messages)
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // 组件卸载时取消进行中的请求
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  /** 聊天内容区 ref + 自动滚到底部 */
  const chatContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = chatContainerRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight
    })
  })

  // DEV 模式下暴露 pendingImages 数量到 window，供 E2E 测试轮询
  useEffect(() => {
    if (import.meta.env.DEV) {
      ;(window as unknown as { _pendingImagesCount?: number })._pendingImagesCount = pendingImages.length
    }
  }, [pendingImages])

  // 面板内追加一条提示性 assistant 消息（如初始化失败反馈）。
  // 仅写入视图，不做持久化 —— 属于瞬时诊断信息。
  const pushNotice = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${crypto.randomUUID()}`,
        role: 'assistant' as const,
        content,
        timestamp: Date.now(),
      },
    ])
  }

  // 面板显示时检查配置并初始化服务；任何一步失败都通过 UI 反馈（不静默）
  useEffect(() => {
    let cancelled = false
    settingsStore
      .isConfigured()
      .then(async (configured) => {
        if (cancelled) return
        setIsConfigured(configured)
        if (!configured) return
        try {
          const settings = await settingsStore.getSettings()
          if (cancelled) return
          aiServiceRef.current = new AIService(settings)
        } catch (error: unknown) {
          // 配置合法但服务初始化失败（如 Base URL 不合规）：显示错误而不是静默吞掉
          if (!cancelled) setServiceError(getUserErrorMessage(error))
        }
      })
      .catch(() => {
        // 配置读取本身失败时降级为"未配置"，显示引导卡片
        if (!cancelled) setIsConfigured(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  /**
   * 等待 aiServiceRef 初始化就绪，轮询检查（每 50ms 一次），超时 2s 放弃。
   * 避免依赖固定 setTimeout 导致 IDB 慢时竞态。
   */
  const waitForService = () =>
    new Promise<void>((resolve) => {
      const start = Date.now()
      const check = () => {
        if (aiServiceRef.current || Date.now() - start > 2000) resolve()
        else setTimeout(check, 50)
      }
      check()
    })

  /** 惰性创建持久化对话；失败视为 best-effort，返回 null 继续纯内存会话 */
  const ensureConversation = async (title: string): Promise<string | null> => {
    if (conversationIdRef.current) return conversationIdRef.current
    try {
      const id = await conversationStore.createConversation(title)
      applyConversationId(id)
      return id
    } catch {
      // 持久化失败不阻断对话主流程（设计取舍：历史记录为辅助能力）
      return null
    }
  }

  /** 追加一条消息到持久化对话（best-effort，静默失败） */
  const persistMessage = (conversationId: string | null, message: ConversationMessage) => {
    if (!conversationId) return
    void conversationStore.appendMessage(conversationId, message).catch(() => {})
  }

  /** 执行 AI 返回的动作批次并给出摘要文本（抛错由调用方兜底展示） */
  const runActions = async (actions: AIAction[], options?: ExecuteOptions): Promise<ExecutionResult> => {
    const executor = new ActionExecutor(buildExecutorStore(), shapeRegistry)
    return executor.execute(actions, options)
  }

  /**
   * 落图归位：新增内容整体居中到页面中心，超出页面时自动扩页
   * （居中保持 1:1 仿摆位的相对位置；移动与扩页合并为单条历史，一次 ⌘Z 整体回退）
   */
  const applyFitToPage = (result: ExecutionResult) => {
    if (result.added.length === 0) return
    const store = useEditorStore.getState()
    const fit = computeFitToPage(store.document, result.added)
    const hasMove = fit.dx !== 0 || fit.dy !== 0
    const hasPatch = fit.pagePatch.width !== undefined || fit.pagePatch.height !== undefined
    if (!hasMove && !hasPatch) return
    store.beginBatch()
    try {
      if (hasMove) store.moveElements(result.added, fit.dx, fit.dy)
      if (hasPatch) store.updatePage(fit.pagePatch)
    } finally {
      store.commitBatch()
    }
  }

  /** 连线缺失检测：AI 生成了 ≥2 个图形但没有任何连线动作时给出提示 */
  const buildLinkerWarning = (actions: AIAction[]): string => {
    const addElements = actions.filter((a) => a.type === 'add_element')
    const addLinkers = actions.filter((a) => a.type === 'add_linker')
    if (addElements.length >= 2 && addLinkers.length === 0) {
      return '⚠ AI 未生成连线动作，图形之间没有连接。可重试或手动连线。'
    }
    return ''
  }

  /**
   * 将流式缓冲区（ref）同步到 React state：按 id 定位占位 assistant 消息，
   * 替换其 reasoning / content 字段。仅在缓冲区非空时更新，避免无谓重渲染。
   */
  const flushStreamBufferToState = () => {
    const buf = streamBufferRef.current
    const msgId = streamingMsgIdRef.current
    if (!buf || !msgId) return
    const { reasoning, content } = buf
    setMessages((prev) =>
      prev.map((m) => (m.id !== msgId ? m : { ...m, reasoning, content })),
    )
  }

  /**
   * 核心发送逻辑：文字（可为空字符串）+ 可选图片 → 调用 AI → 执行动作 → 回复
   * 流式模式下：先追加一条占位 assistant 消息，边接收边更新其 reasoning/content，
   * 流结束后固化到最终状态。
   */
  const sendToAI = async (userText: string, images?: MessageImage[]) => {
    // 纯图片消息也允许发送（文字可为空），仅在没有文字且没有图片时拦截
    if ((!userText && !(images && images.length > 0)) || !aiServiceRef.current) return

    setSending(true)
    const userMessage: ConversationMessage = {
      id: `msg-${crypto.randomUUID()}`,
      role: 'user',
      content: userText,
      ...(images && images.length > 0 ? { images } : {}),
      timestamp: Date.now(),
    }

    // 通过 ref 读取最新状态，避免闭包过期问题
    const updatedMessages = [...messagesRef.current, userMessage]
    setMessages(() => updatedMessages)

    // 取消上一次进行中的请求，再创建新的 AbortController
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    const conversationId = await ensureConversation(
      userText.slice(0, 20) || '图片对话',
    )
    persistMessage(conversationId, userMessage)

    // 流式缓冲区：ref 暴露给异步回调，按 requestAnimationFrame 节奏同步到 state
    const streamBuffer = { reasoning: '', content: '' }
    streamBufferRef.current = streamBuffer
    const streamingMsgId = `msg-${crypto.randomUUID()}`
    streamingMsgIdRef.current = streamingMsgId
    setStreamingMsgId(streamingMsgId)

    // 先追加一条占位 assistant 消息，便于流式期间让用户看到思考/正文逐步呈现
    const placeholder: ConversationMessage = {
      id: streamingMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, placeholder])

    // requestAnimationFrame 节流：每帧最多同步一次，避免高频 setState
    let rafId: number | null = null
    const scheduleFlush = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        flushStreamBufferToState()
      })
    }

    let aborted = false
    try {
      const systemPrompt = buildCurrentSystemPrompt(useEditorStore.getState().document)
      const response = await aiServiceRef.current!.sendMessage(
        {
          systemPrompt,
          messages: toApiMessages(updatedMessages),
          onReasoningChunk: (_chunk, full) => {
            streamBuffer.reasoning = full
            scheduleFlush()
          },
          onContentChunk: (_chunk, full) => {
            streamBuffer.content = stripJsonBlocks(full)
            scheduleFlush()
          },
        },
        abortControllerRef.current.signal,
      )

      // 流式结束：最后一次刷新确保缓冲区完全同步（避免 RAF 尚未触发时丢字）
      flushStreamBufferToState()

      let execSummary = ''
      if (response.actions.length > 0) {
        const linkerWarning = buildLinkerWarning(response.actions)
        try {
          // 带图消息为图片复刻模式：跳过自动布局，按 AI 给出的原图等比坐标落库
          const execOptions = images && images.length > 0 ? { skipLayout: true } : undefined
          const execResult = await runActions(response.actions, execOptions)
          applyFitToPage(execResult)
          execSummary = [linkerWarning, buildExecutionSummary(execResult)]
            .filter(Boolean)
            .join('\n')
        } catch (error: unknown) {
          // 动作执行失败不阻塞回复展示，但要明确告知用户画布未变化
          execSummary = `⚠ 动作执行失败：${getUserErrorMessage(error)}`
        }
      }

      // 用最终响应覆盖占位 assistant 消息的字段（reasoning/content 可能与缓冲相同，
      // 但以响应对象为准，保证一致性），同时追加执行摘要到 content
      const cleanMessage = stripJsonBlocks(response.message || '')
      const finalContent = [cleanMessage || '已完成', execSummary].filter(Boolean).join('\n\n')
      setMessages((prev) =>
        prev.map((m) =>
          m.id !== streamingMsgId
            ? m
            : {
                ...m,
                content: finalContent,
                reasoning: response.reasoning ?? m.reasoning,
              },
        ),
      )

      const aiMessage: ConversationMessage = {
        id: streamingMsgId,
        role: 'assistant',
        content: finalContent,
        reasoning: response.reasoning,
        timestamp: Date.now(),
      }
      persistMessage(conversationId, aiMessage)
    } catch (error: unknown) {
      if (isAbortError(error)) {
        aborted = true
        // 用户主动取消：移除占位消息，避免残留半截内容
        setMessages((prev) => prev.filter((m) => m.id !== streamingMsgId))
        return
      }
      // 非 abort 错误：移除占位消息，以 pushNotice 形式展示错误
      setMessages((prev) => prev.filter((m) => m.id !== streamingMsgId))
      // 带图消息失败时大概率是模型不支持视觉输入，给出可操作的指引
      const visionHint =
        images && images.length > 0
          ? '（当前模型可能不支持图片输入，请在 AI 设置中更换视觉模型，如 qwen-vl 系列）'
          : ''
      pushNotice(`错误：${getUserErrorMessage(error)}${visionHint}`)
    } finally {
      streamBufferRef.current = null
      streamingMsgIdRef.current = null
      setStreamingMsgId(null)
      if (rafId !== null) cancelAnimationFrame(rafId)
      if (!aborted) setSending(false)
    }
  }

  // 监听模板选择事件：收到模板 prompt 后自动发送给 AI
  useEffect(() => {
    const onTemplateSelected = async (e: Event) => {
      const detail = (e as CustomEvent<Template>).detail
      if (!detail?.prompt) return
      // 等待 settings 初始化完成后再发送，避免竞态
      await waitForService()
      if (aiServiceRef.current) {
        void sendToAI(detail.prompt)
      } else {
        // 初始化超时的显式反馈（替代曾经的静默放弃）
        pushNotice('AI 服务初始化超时，请检查设置后重试')
      }
    }
    window.addEventListener(AI_TEMPLATE_SELECTED, onTemplateSelected)
    return () => window.removeEventListener(AI_TEMPLATE_SELECTED, onTemplateSelected)
    // sendToAI/waitForService/pushNotice 在组件生命周期内稳定，无需加入依赖数组
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelectConversation = async (conversationId: string) => {
    try {
      const conv = await conversationStore.loadConversation(conversationId)
      if (!conv) {
        pushNotice('该对话不存在或已被删除')
        return
      }
      applyConversationId(conv.id)
      setMessages(conv.messages)
      setHistoryOpen(false)
    } catch (error: unknown) {
      pushNotice(`读取对话失败：${getUserErrorMessage(error)}`)
    }
  }

  const handleSend = async () => {
    if ((!inputText.trim() && pendingImages.length === 0) || sending) return

    // 服务可能尚未完成异步初始化：等待一轮后再判断，仍不可用则给出反馈
    if (!aiServiceRef.current) {
      await waitForService()
      if (!aiServiceRef.current) {
        pushNotice(serviceError ?? 'AI 服务尚未就绪，请确认已在设置中正确配置')
        return
      }
    }

    const userText = inputText.trim()
    const imagesToSend = pendingImages.length > 0 ? [...pendingImages] : undefined
    setInputText('')
    setPendingImages([])

    // 统一调用 sendToAI，图片与纯文字共用同一分支
    await sendToAI(userText, imagesToSend)
  }

  /** 批量把图片文件压成 dataUrl 加入待发送列表；单个失败不阻断其余，逐条提示 */
  const addImageFiles = async (files: Array<File | null>) => {
    for (const file of files) {
      if (!file || !file.type.startsWith('image/')) continue
      try {
        const dataUrl = await loadImageAsCompressedDataUrl(file)
        setPendingImages((prev) => [...prev, { dataUrl }])
      } catch (err: unknown) {
        pushNotice(`图片处理失败：${getUserErrorMessage(err)}`)
      }
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    await addImageFiles(files ? Array.from(files) : [])
    // 清空 input 以便下次选择同一文件时仍能触发 change
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /** 粘贴截图：提取剪贴板中的图片文件走上传管道；纯文本粘贴不拦截 */
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    const files = Array.from(items)
      .filter((it) => it.kind === 'file' && it.type.startsWith('image/'))
      .map((it) => it.getAsFile())
    if (!files.some(Boolean)) return
    e.preventDefault()
    void addImageFiles(files)
  }

  const examplePrompts = [
    '工单处理过程的状态流转',
    '用户注册并完成邮箱验证的流程',
    '下单时前端与后端的调用时序',
  ]

  // 纯内容面板（由 AppLayout 控制显示/隐藏）
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* 标题栏（紧凑高度，与属性面板头部对齐；右侧：AI 设置 + 收起） */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: '1px solid #eee',
          backgroundColor: '#fafafa',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '14px', color: '#333' }}>
          AI 智能助手
        </span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent(AI_OPEN_SETTINGS))}
            aria-label="AI 设置"
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#999',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0'
              e.currentTarget.style.color = '#333'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#999'
            }}
          >
            <Settings size={16} />
          </button>
          <button
            onClick={() => useUIStore.getState().toggleAiPanel()}
            aria-label="收起"
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#999',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0'
              e.currentTarget.style.color = '#333'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#999'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div
        ref={chatContainerRef}
        style={{ flex: 1, overflowY: 'auto', padding: '20px' }}
      >
        {!isConfigured ? (
          <div
            style={{
              padding: '16px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              fontSize: '13px',
              lineHeight: '1.5',
            }}
          >
            <strong>尚未配置 AI 服务</strong>
            <p style={{ margin: '8px 0 0', fontSize: '12px' }}>
              请先前往设置页面配置 API Key 等信息后使用。
            </p>
          </div>
        ) : messages.length === 0 ? (
          <>
            {/* 欢迎区域 */}
            <div style={{ textAlign: 'center', padding: '32px 0 24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#333', marginBottom: '12px' }}>
                {getGreeting()}，今天想用 AI 做点什么呢
              </h2>
              <p style={{ fontSize: '13px', color: '#888', lineHeight: '1.6' }}>
                点击下方提示词，快速生成流程图，或者截图粘贴图片，也可以描述您想要创建的内容
              </p>
            </div>

            {/* 示例提示 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
              {examplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInputText(prompt)}
                  style={{
                    padding: '12px 16px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#333',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = ACCENT_COLOR
                    e.currentTarget.style.backgroundColor = '#f0f7ff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e8e8e8'
                    e.currentTarget.style.backgroundColor = '#fff'
                  }}
                >
                  <span style={{ fontSize: '16px' }}></span>
                  {prompt}
                </button>
              ))}
            </div>
          </>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              streaming={sending && msg.id === streamingMsgId}
            />
          ))
        )}
      </div>

      {/* 服务初始化失败的显式反馈条 */}
      {isConfigured && serviceError && (
        <div
          role="alert"
          style={{
            margin: '0 20px 8px',
            padding: '8px 10px',
            backgroundColor: '#f8d7da',
            border: '1px solid #dc3545',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#721c24',
          }}
        >
          {serviceError}
        </div>
      )}

      {/* 输入区 */}
      {isConfigured && (
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid #eee',
            backgroundColor: '#fafafa',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              backgroundColor: '#fff',
            }}
          >
            <textarea
              aria-label="消息输入"
              placeholder="你可以这样提问：用户登录注册流程。"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void handleSend()
                }
              }}
              rows={2}
              style={{
                display: 'block',
                width: '100%',
                border: 'none',
                background: 'none',
                outline: 'none',
                resize: 'none',
                fontSize: '14px',
                lineHeight: '1.5',
                fontFamily: 'inherit',
                color: '#333',
              }}
            />
            {pendingImages.length > 0 && (
              <div
                data-testid="pending-images"
                style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '8px 0 4px' }}
              >
                {pendingImages.map((img, i) => (
                  <div key={`${i}-${img.dataUrl.slice(-12)}`} style={{ position: 'relative' }}>
                    <img
                      src={img.dataUrl}
                      alt={`待发送图片 ${i + 1}`}
                      style={{
                        height: '40px',
                        borderRadius: '6px',
                        display: 'block',
                        border: '1px solid #e0e0e0',
                      }}
                    />
                    <button
                      aria-label={`移除图片 ${i + 1}`}
                      onClick={() => setPendingImages((prev) => prev.filter((_, j) => j !== i))}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        fontSize: '11px',
                        lineHeight: '17px',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              aria-label="图片文件选择"
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '4px',
              }}
            >
              <button
                onClick={() => fileInputRef.current?.click()}
                aria-label="图片上传"
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px',
                }}
              >
                ⊕
              </button>
              <button
                onClick={() => void handleSend()}
                aria-label="发送"
                disabled={sending}
                style={{
                  border: 'none',
                  backgroundColor: ACCENT_COLOR,
                  color: '#fff',
                  cursor: sending ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: sending ? 0.6 : 1,
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 历史对话浮层 */}
      {historyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="历史对话"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#fff',
            zIndex: 5,
            display: 'flex',
          }}
        >
          <HistoryDialog
            currentId={conversationId}
            onSelect={(id) => void handleSelectConversation(id)}
            onClose={() => setHistoryOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
