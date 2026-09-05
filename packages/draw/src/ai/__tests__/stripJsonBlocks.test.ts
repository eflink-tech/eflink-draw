// src/ai/__tests__/stripJsonBlocks.test.ts
import { describe, it, expect } from 'vitest'
import { stripJsonBlocks } from '../stripJsonBlocks'

describe('stripJsonBlocks', () => {
  it('完整围栏代码块被剥离', () => {
    const input = '已为您生成流程图\n```json\n[{"type":"add_element"}]\n```'
    expect(stripJsonBlocks(input)).toBe('已为您生成流程图')
  })

  it('流式期间未闭合的围栏被剥离', () => {
    const input = '```json\n[{"type":"add_element","x":1'
    expect(stripJsonBlocks(input)).toBe('')
  })

  it('完整裸 JSON 对象被清空', () => {
    expect(stripJsonBlocks('{"actions":[],"message":"ok"}')).toBe('')
  })

  it('完整裸 JSON 数组被清空', () => {
    expect(stripJsonBlocks('[{"type":"add_linker","from":"a","to":"b"}]')).toBe('')
  })

  it('流式中间态：未闭合的裸 JSON 对象前缀被清空（防 JSON 打字机滚出）', () => {
    // 模拟流式逐字到达：{"actions":[{"type":"add_el
    expect(stripJsonBlocks('{"actions":[{"type":"add_el')).toBe('')
    expect(stripJsonBlocks('{')).toBe('')
  })

  it('流式中间态：未闭合的裸 JSON 数组前缀被清空', () => {
    expect(stripJsonBlocks('[{"type":"add_linker",')).toBe('')
    expect(stripJsonBlocks('[')).toBe('')
  })

  it('正常中文回复保留', () => {
    expect(stripJsonBlocks('已为您生成用户注册流程图，共 5 个节点。')).toBe(
      '已为您生成用户注册流程图，共 5 个节点。',
    )
  })

  it('文字 + 围栏混合时仅保留文字', () => {
    const input = '说明如下：\n```json\n{"actions":[]}\n```\n请查看画布。'
    expect(stripJsonBlocks(input)).toBe('说明如下：\n\n请查看画布。')
  })
})
