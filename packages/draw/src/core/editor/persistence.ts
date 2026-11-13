// 文档持久化：localStorage 保存与恢复
// 存储格式：{ version: 1, doc: DocumentData }，version 用于未来格式演进
import type { DocumentData } from '@/types'

/** localStorage 存储键（v1 为当前格式版本；旧键 efdraw:document:v1 由 storage/legacy 一次性迁移） */
export const STORAGE_KEY = 'doculuma:draw:document:v1'

/** 存储格式版本号 */
const STORAGE_VERSION = 1

/**
 * 嵌入式编辑器（如 Markdown 预览里的侧车文档弹窗）只做内存编辑：
 * 宿主负责保存，不能覆盖绘图工作区的本地/远端文档。计数式开关支持嵌套。
 */
let persistenceSuppression = 0

/** 当前是否处于「不落存储」的嵌入式会话 */
export function isDocumentPersistenceSuppressed(): boolean {
  return persistenceSuppression > 0
}

/** 进入嵌入式会话，返回释放函数（幂等） */
export function suppressDocumentPersistence(): () => void {
  persistenceSuppression++
  let released = false
  return () => {
    if (released) return
    released = true
    persistenceSuppression = Math.max(0, persistenceSuppression - 1)
  }
}

/** 存储包装结构 */
interface StoredDocument {
  version: number
  doc: DocumentData
}

/**
 * 保存文档到 localStorage。
 * 序列化/配额/隐私模式等异常一律静默返回 false，不打断编辑流程。
 */
export function saveDocumentToStorage(doc: DocumentData): boolean {
  // 嵌入式会话：视为已保存但不动共享存储键
  if (persistenceSuppression > 0) return true
  try {
    const payload: StoredDocument = { version: STORAGE_VERSION, doc }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}

/** 校验任意值是否为合法的 DocumentData（只做结构级检查，不深校验每个元素） */
export function isDocumentData(v: unknown): v is DocumentData {
  if (typeof v !== 'object' || v === null) return false
  const doc = v as Record<string, unknown>
  return (
    typeof doc.elements === 'object' &&
    doc.elements !== null &&
    typeof doc.page === 'object' &&
    doc.page !== null
  )
}

/**
 * 从 localStorage 读取文档。
 * 键缺失 / JSON 损坏 / 版本不匹配 / 结构缺字段 一律返回 null（由调用方回退空文档）。
 */
export function loadDocumentFromStorage(): DocumentData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const stored = parsed as Record<string, unknown>
    if (stored.version !== STORAGE_VERSION) return null
    if (!isDocumentData(stored.doc)) return null
    return stored.doc as DocumentData
  } catch {
    return null
  }
}

/**
 * 远端存储钩子：宿主注入后，文档保存会异步镜像到远端（后端 API），
 * localStorage 仍同步写入作为即时缓存与离线兜底。
 */
export interface DrawRemoteStore {
  /** 启动时拉取远端文档；无文档返回 null */
  load(): Promise<DocumentData | null>
  /** 文档保存时整体覆盖远端 */
  save(doc: DocumentData): Promise<void>
}

let remoteStore: DrawRemoteStore | null = null

/** 注册远端存储（宿主在挂载编辑器前调用；传 null 注销） */
export function setDrawRemoteStore(store: DrawRemoteStore | null): void {
  remoteStore = store
}

/** 内部使用：异步镜像到远端（静默失败，不打断编辑流程） */
export function mirrorToRemote(doc: DocumentData): void {
  if (persistenceSuppression > 0) return
  if (!remoteStore) return
  void remoteStore.save(doc).catch(() => {
    /* 远端不可用时保留本地副本 */
  })
}

/** 内部使用：从远端拉取文档 */
export function loadFromRemote(): Promise<DocumentData | null> {
  if (!remoteStore) return Promise.resolve(null)
  return remoteStore.load().catch(() => null)
}
