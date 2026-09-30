// 连线样式记忆：用户最近一次设置的线型/线条样式作为后续新建连线的默认。
// 记忆独立于文档（不随保存/撤销），localStorage 持久化跨会话生效。
import { describe, it, expect, beforeEach } from 'vitest'
import {
  readLinkerStyleMemory,
  resetLinkerStyleMemoryForTest,
  writeLinkerStyleMemory,
  type LinkerStyleMemory,
} from '../linkerStyleMemory'
import { applyMemorizedLinkerStyle, createLinkerInstance, LINKER_DEFAULTS } from '../linker'
import { useEditorStore } from '@/store/editorStore'
import { createEmptyDocument, isLinker } from '@/types'
import type { LinkerInstance } from '@/types'

const endpoint = (x: number, y: number) => ({ id: null, x, y, angle: 0 })

function makeLinker(): LinkerInstance {
  return createLinkerInstance(endpoint(0, 0), endpoint(100, 0), 1)
}

function addLinkerToStore(l: LinkerInstance): void {
  useEditorStore.setState((s) => ({
    document: { ...s.document, elements: { ...s.document.elements, [l.id]: l } },
  }))
}

describe('连线样式记忆（存储层）', () => {
  beforeEach(() => {
    resetLinkerStyleMemoryForTest()
  })

  it('初始无记忆；写入细粒度合并、undefined 字段跳过', () => {
    expect(readLinkerStyleMemory()).toBeNull()

    writeLinkerStyleMemory({ linkerType: 'curve', lineColor: '255,0,0' })
    writeLinkerStyleMemory({ lineWidth: 3, lineColor: undefined })

    expect(readLinkerStyleMemory()).toEqual({
      linkerType: 'curve',
      lineWidth: 3,
      lineColor: '255,0,0',
    })
  })

  it('合并后持久化到 localStorage（跨会话默认）', () => {
    writeLinkerStyleMemory({ lineStyle: 'dashed', endArrowStyle: 'none' })
    expect(localStorage.getItem('draw.linkerStyle')).toBe(
      JSON.stringify({ lineStyle: 'dashed', endArrowStyle: 'none' }),
    )
  })
})

describe('applyMemorizedLinkerStyle（新建连线应用记忆）', () => {
  beforeEach(() => {
    resetLinkerStyleMemoryForTest()
  })

  it('无记忆时保持出厂默认', () => {
    const inst = makeLinker()
    applyMemorizedLinkerStyle(inst)
    expect(inst.linkerType).toBe('broken')
    expect(inst.lineStyle).toEqual({
      lineWidth: LINKER_DEFAULTS.lineWidth,
      lineColor: LINKER_DEFAULTS.lineColor,
      lineStyle: LINKER_DEFAULTS.lineStyle,
      beginArrowStyle: LINKER_DEFAULTS.beginArrowStyle,
      endArrowStyle: LINKER_DEFAULTS.endArrowStyle,
    })
  })

  it('记忆字段覆盖出厂默认，未记忆字段保持默认', () => {
    const mem: LinkerStyleMemory = {
      linkerType: 'curve',
      lineColor: '0,0,255',
      endArrowStyle: 'none',
    }
    writeLinkerStyleMemory(mem)

    const inst = makeLinker()
    applyMemorizedLinkerStyle(inst)

    expect(inst.linkerType).toBe('curve')
    expect(inst.lineStyle.lineColor).toBe('0,0,255')
    expect(inst.lineStyle.endArrowStyle).toBe('none')
    // 未记忆字段沿用出厂
    expect(inst.lineStyle.lineWidth).toBe(LINKER_DEFAULTS.lineWidth)
    expect(inst.lineStyle.beginArrowStyle).toBe(LINKER_DEFAULTS.beginArrowStyle)
  })
})

describe('updateLinker 写入记忆（样式修改入口收口）', () => {
  beforeEach(() => {
    resetLinkerStyleMemoryForTest()
    useEditorStore.setState({
      document: createEmptyDocument(),
      selectedIds: new Set(),
    })
  })

  it('修改线型 → 记忆 linkerType', () => {
    const l = makeLinker()
    addLinkerToStore(l)

    useEditorStore.getState().updateLinker(l.id, { linkerType: 'curve' })

    expect(readLinkerStyleMemory()?.linkerType).toBe('curve')
  })

  it('修改线条样式 → 记忆对应字段（含箭头）', () => {
    const l = makeLinker()
    addLinkerToStore(l)

    useEditorStore.getState().updateLinker(l.id, {
      lineStyle: { ...l.lineStyle, lineStyle: 'dot', endArrowStyle: 'cross' },
    })

    const mem = readLinkerStyleMemory()!
    expect(mem.lineStyle).toBe('dot')
    expect(mem.endArrowStyle).toBe('cross')
    // 调用方传全量 lineStyle：随线携带的字段一并记忆（新线沿用此线完整样式）
    expect(mem.lineWidth).toBe(l.lineStyle.lineWidth)
  })

  it('改 points/from/to 等非样式字段 → 不写记忆', () => {
    const l = makeLinker()
    addLinkerToStore(l)

    useEditorStore.getState().updateLinker(l.id, {
      points: [{ x: 0, y: 0 }, { x: 50, y: 0 }, { x: 100, y: 0 }],
      manualRoute: true,
    })

    expect(readLinkerStyleMemory()).toBeNull()
  })

  it('端到端：改一条连线的线型后，新建连线（endFreeLinker 路径的 createLinkerInstance + apply）沿用', () => {
    const l = makeLinker()
    addLinkerToStore(l)
    useEditorStore.getState().updateLinker(l.id, {
      lineStyle: { ...l.lineStyle, lineColor: '255,0,0', lineStyle: 'dashed' },
    })

    // 模拟新建：创建后先应用记忆再算路由（与 linkerTool.endFreeLinker / ElementRenderer 同序）
    const fresh = createLinkerInstance(endpoint(0, 0), endpoint(80, 80), 2)
    applyMemorizedLinkerStyle(fresh)

    expect(isLinker(fresh)).toBe(true)
    expect(fresh.lineStyle.lineColor).toBe('255,0,0')
    expect(fresh.lineStyle.lineStyle).toBe('dashed')
  })
})
