// 文档持久化：localStorage 保存与恢复
// 存储格式：{ version: 1, doc: DocumentData }，version 用于未来格式演进
import type { DocumentData } from '@/types'

/** localStorage 存储键（v1 为当前格式版本） */
export const STORAGE_KEY = 'efdraw:document:v1'

/** 存储格式版本号 */
const STORAGE_VERSION = 1

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
