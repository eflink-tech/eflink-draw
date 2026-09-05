// Command 模式：每次操作记录为 HistoryCommand，支持 undo/redo
import type { ElementInstance, LinkerInstance } from '@/types'

export type HistoryAction = 'create' | 'update' | 'remove' | 'updatePage'

export interface HistoryCommand {
  action: HistoryAction
  content:
    | { elements: (ElementInstance | LinkerInstance)[] } // create/remove
    | { shapes: (ElementInstance | LinkerInstance)[]; updates: (ElementInstance | LinkerInstance)[] } // update
    | { oldPage: PageConfig; newPage: PageConfig } // updatePage
}

interface PageConfig {
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
  padding: number
  gridSize: number
  showGrid: boolean
  backgroundColor: string
}

export class HistoryManager {
  private batchSize = 0
  private messages: HistoryCommand[] = []
  private undoStack: HistoryCommand[][] = []
  private redoStack: HistoryCommand[][] = []
  // 拖拽/调整大小时缓存旧值快照（beginBatch 时生成，commit 时对比）
  private snapshot: Map<string, ElementInstance | LinkerInstance> | null = null
  private snapshotIds: Set<string> = new Set()
  private getElements: () => Record<string, ElementInstance | LinkerInstance>

  constructor(getElements: () => Record<string, ElementInstance | LinkerInstance>) {
    this.getElements = getElements
  }

  /** 开始批量操作（拖拽/调整大小）：缓存当前元素快照 */
  beginBatch(ids?: string[]): void {
    this.batchSize++
    if (this.batchSize === 1) {
      const elements = this.getElements()
      this.snapshot = new Map()
      this.snapshotIds = new Set(ids ?? Object.keys(elements))
      for (const id of this.snapshotIds) {
        const el = elements[id]
        if (el) {
          this.snapshot.set(id, JSON.parse(JSON.stringify(el)))
        }
      }
    }
  }

  /** 提交批量操作：对比快照生成 update 命令 */
  commit(): void {
    this.batchSize--
    if (this.batchSize === 0) {
      if (this.snapshot && this.messages.length === 0) {
        this.generateUpdateCommands()
      }
      this.submit(true)
      this.snapshot = null
      this.snapshotIds.clear()
    }
  }

  /** 发送操作（clearRedo=true 时清空 redo 栈） */
  send(action: HistoryAction, content: HistoryCommand['content'], clearRedo = true): void {
    this.messages.push({ action, content })
    this.submit(clearRedo)
  }

  private submit(clearRedo = true): void {
    if (this.batchSize === 0 && this.messages.length !== 0) {
      if (clearRedo) {
        this.redoStack = [] // 新操作清空 redo 栈
      }
      this.undoStack.push(this.messages)
      this.messages = []
    }
  }

  /** 撤销：返回命令数组，调用方负责反向执行 */
  undo(): HistoryCommand[] | null {
    const msgs = this.undoStack.pop()
    if (!msgs) return null
    this.redoStack.push(msgs)
    return msgs
  }

  /** 重做：返回命令数组，调用方负责正向执行 */
  redo(): HistoryCommand[] | null {
    const msgs = this.redoStack.pop()
    if (!msgs) return null
    this.undoStack.push(msgs)
    return msgs
  }

  /** 是否可撤销 */
  canUndo(): boolean {
    return this.undoStack.length > 0
  }

  /** 是否可重做 */
  canRedo(): boolean {
    return this.redoStack.length > 0
  }

  /** 拖拽结束时对比 snapshot 生成 update 命令 */
  private generateUpdateCommands(): void {
    const oldMap = this.snapshot!
    const newElements = this.getElements()

    const oldShapes: (ElementInstance | LinkerInstance)[] = []
    const updates: (ElementInstance | LinkerInstance)[] = []

    for (const [id, oldEl] of oldMap) {
      const newEl = newElements[id]
      if (newEl && JSON.stringify(oldEl) !== JSON.stringify(newEl)) {
        oldShapes.push(JSON.parse(JSON.stringify(oldEl)))
        updates.push(JSON.parse(JSON.stringify(newEl)))
      }
    }

    if (oldShapes.length > 0) {
      this.messages.push({
        action: 'update',
        content: { shapes: oldShapes, updates },
      })
    }
  }

  /** 清空历史（新建文档时） */
  clear(): void {
    this.undoStack = []
    this.redoStack = []
    this.messages = []
    this.snapshot = null
    this.snapshotIds.clear()
  }
}

/** 反向执行命令（undo） */
export function reverseCommand(
  cmd: HistoryCommand,
  elements: Record<string, ElementInstance | LinkerInstance>,
): Record<string, ElementInstance | LinkerInstance> {
  const newElements = { ...elements }

  switch (cmd.action) {
    case 'create': {
      const { elements: els } = cmd.content as { elements: (ElementInstance | LinkerInstance)[] }
      for (const el of els) {
        delete newElements[el.id]
      }
      break
    }
    case 'remove': {
      const { elements: els } = cmd.content as { elements: (ElementInstance | LinkerInstance)[] }
      for (const el of els) {
        newElements[el.id] = JSON.parse(JSON.stringify(el))
      }
      break
    }
    case 'update': {
      const { shapes, updates } = cmd.content as {
        shapes: (ElementInstance | LinkerInstance)[]
        updates: (ElementInstance | LinkerInstance)[]
      }
      for (let i = 0; i < updates.length; i++) {
        const oldEl = shapes[i]!
        newElements[oldEl.id] = JSON.parse(JSON.stringify(oldEl))
      }
      break
    }
    // updatePage 由 undo() 单独处理（page 不在 elements 中）
  }

  return newElements
}

/** 正向执行命令（redo） */
export function applyCommand(
  cmd: HistoryCommand,
  elements: Record<string, ElementInstance | LinkerInstance>,
): Record<string, ElementInstance | LinkerInstance> {
  const newElements = { ...elements }

  switch (cmd.action) {
    case 'create': {
      const { elements: els } = cmd.content as { elements: (ElementInstance | LinkerInstance)[] }
      for (const el of els) {
        newElements[el.id] = JSON.parse(JSON.stringify(el))
      }
      break
    }
    case 'remove': {
      const { elements: els } = cmd.content as { elements: (ElementInstance | LinkerInstance)[] }
      for (const el of els) {
        delete newElements[el.id]
      }
      break
    }
    case 'update': {
      const { updates } = cmd.content as {
        shapes: (ElementInstance | LinkerInstance)[]
        updates: (ElementInstance | LinkerInstance)[]
      }
      for (let i = 0; i < updates.length; i++) {
        const newEl = updates[i]!
        newElements[newEl.id] = JSON.parse(JSON.stringify(newEl))
      }
      break
    }
    // updatePage 由 redo() 单独处理（page 不在 elements 中）
  }

  return newElements
}

/** 获取命令中的 page 变化（用于 undo/redo 时恢复/应用页面配置） */
export function getPageFromCommand(cmd: HistoryCommand): { oldPage?: PageConfig; newPage?: PageConfig } {
  if (cmd.action !== 'updatePage') return {}
  const { oldPage, newPage } = cmd.content as { oldPage: PageConfig; newPage: PageConfig }
  return { oldPage, newPage }
}
