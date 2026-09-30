//
// 连线样式记忆：用户最近一次设置的线型与线条样式，作为后续新建连线的默认
// （「选了某种连接线后，后续连线沿用」）。记忆独立于文档——不随文档保存、
// 不参与撤销重做，localStorage 持久化跨会话生效。
//
// 本模块零运行时依赖（仅 type import），linker.ts 与 editorStore.ts 都可安全引用。
//
import type { LinkerInstance } from '@/types'

export interface LinkerStyleMemory {
  /** 连线类型：折线 broken / 曲线 curve / 直线 line */
  linkerType?: LinkerInstance['linkerType']
  lineWidth?: number
  lineColor?: string
  lineStyle?: LinkerInstance['lineStyle']['lineStyle']
  beginArrowStyle?: LinkerInstance['lineStyle']['beginArrowStyle']
  endArrowStyle?: LinkerInstance['lineStyle']['endArrowStyle']
}

const STORAGE_KEY = 'draw.linkerStyle'

function readPersisted(): LinkerStyleMemory | null {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as LinkerStyleMemory
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    /* 隐私模式 / 无 localStorage / 脏数据：记忆仅保留在内存 */
    return null
  }
}

let memory: LinkerStyleMemory | null = readPersisted()

export function readLinkerStyleMemory(): LinkerStyleMemory | null {
  return memory
}

/** 细粒度合并（undefined 字段跳过、不覆盖已有记忆），合并后写回 localStorage */
export function writeLinkerStyleMemory(patch: LinkerStyleMemory): void {
  const merged: LinkerStyleMemory = { ...memory }
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) merged[k as keyof LinkerStyleMemory] = v
  }
  memory = merged
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(merged))
  } catch {
    /* 无 localStorage：记忆仅保留在内存 */
  }
}

/** 测试专用：清空记忆（内存 + localStorage），恢复出厂默认 */
export function resetLinkerStyleMemoryForTest(): void {
  memory = null
  try {
    globalThis.localStorage?.removeItem(STORAGE_KEY)
  } catch {
    /* 忽略 */
  }
}
