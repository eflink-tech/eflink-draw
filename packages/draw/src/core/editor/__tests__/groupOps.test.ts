// 组合纯函数测试：选择展开 / 成员查询 / 复制重映射
import { describe, it, expect } from 'vitest'
import { expandGroupIds, groupMembers, newGroupId, remapGroupIdsForCopy } from '../groupOps'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import { createEmptyDocument, isLinker, type DocumentData, type ElementInstance } from '@/types'
import { createLinkerInstance } from '../linker'

function shape(id: string, groupId?: string): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', 0, 0)
  if (!el) throw new Error('rectangle schema missing')
  return { ...el, id, groupId }
}

function makeDoc(): DocumentData {
  const a = shape('a', 'grp-1')
  const b = shape('b', 'grp-1')
  const c = shape('c')
  const linker = createLinkerInstance(
    { id: 'a', x: 0, y: 0, angle: 0 },
    { id: 'b', x: 0, y: 0, angle: Math.PI },
    1,
  )
  return {
    ...createEmptyDocument(),
    elements: { a, b, c, [linker.id]: linker },
  }
}

describe('expandGroupIds', () => {
  it('命中组成员展开为整组', () => {
    const doc = makeDoc()
    expect(expandGroupIds(doc.elements, ['a'])).toEqual(['a', 'b'])
  })

  it('无组图形与连线原样通过，去重保序', () => {
    const doc = makeDoc()
    const linkerId = Object.keys(doc.elements).find((id) => isLinker(doc.elements[id]!))!
    const out = expandGroupIds(doc.elements, ['a', 'b', 'c', linkerId])
    expect(out).toEqual(['a', 'b', 'c', linkerId])
  })

  it('不存在的 id 跳过', () => {
    const doc = makeDoc()
    expect(expandGroupIds(doc.elements, ['ghost', 'c'])).toEqual(['c'])
  })
})

describe('groupMembers', () => {
  it('返回整组成员', () => {
    const doc = makeDoc()
    expect(groupMembers(doc.elements, 'grp-1').sort()).toEqual(['a', 'b'])
    expect(groupMembers(doc.elements, 'grp-none')).toEqual([])
  })
})

describe('newGroupId', () => {
  it('生成唯一 id', () => {
    const ids = new Set(Array.from({ length: 100 }, () => newGroupId()))
    expect(ids.size).toBe(100)
  })
})

describe('remapGroupIdsForCopy', () => {
  it('整组复制：副本共享新 groupId 且与原组不同', () => {
    const doc = makeDoc()
    const copies = [
      { ...shape('a2', 'grp-1') },
      { ...shape('b2', 'grp-1') },
    ]
    const out = remapGroupIdsForCopy(copies, doc.elements)
    expect(out[0]!.groupId).toBe(out[1]!.groupId)
    expect(out[0]!.groupId).not.toBe('grp-1')
  })

  it('部分复制：清除 groupId，不与原组共享', () => {
    const doc = makeDoc()
    const out = remapGroupIdsForCopy([{ ...shape('a2', 'grp-1') }], doc.elements)
    expect(out[0]!.groupId).toBeUndefined()
  })

  it('无组图形原样返回', () => {
    const out = remapGroupIdsForCopy([shape('x')], makeDoc().elements)
    expect(out[0]!.groupId).toBeUndefined()
  })
})
