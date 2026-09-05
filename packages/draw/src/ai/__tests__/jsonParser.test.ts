// src/ai/__tests__/jsonParser.test.ts
import { describe, it, expect } from 'vitest'
import { parseAIResponse, MAX_ACTIONS } from '../jsonParser'
import { AIError } from '../types'

// 合法的 add_element 动作示例（字段齐全）
const VALID_ADD_ELEMENT =
  '{"type":"add_element","refId":"n1","schema":"terminator","x":100,"y":100,"text":"a"}'

describe('parseAIResponse', () => {
  it('解析标准 JSON', () => {
    const input = `{"actions":[${VALID_ADD_ELEMENT}],"message":"done"}`
    const result = parseAIResponse(input)
    expect(result.actions).toHaveLength(1)
    expect(result.message).toBe('done')
  })

  it('剥离 markdown 代码围栏', () => {
    const input = '```json\n{"actions":[],"message":"ok"}\n```'
    const result = parseAIResponse(input)
    expect(result.actions).toEqual([])
  })

  it('剥离首尾非 JSON 文字', () => {
    const input = 'Here is the result:\n{"actions":[],"message":"ok"}\nDone!'
    const result = parseAIResponse(input)
    expect(result.actions).toEqual([])
  })

  it('截取配平的花括号块（含 actions 键）', () => {
    const input = `Some text {"actions":[${VALID_ADD_ELEMENT}],"message":"ok"} more text`
    const result = parseAIResponse(input)
    expect(result.actions).toHaveLength(1)
  })

  it('add_element 的可选 style 对象原样穿透（深层清洗交给执行器）', () => {
    const input =
      '{"actions":[{"type":"add_element","refId":"n1","schema":"terminator","x":1,"y":2,"style":{"fill":"#ff0000","lineColor":"bad"}}],"message":"ok"}'
    const result = parseAIResponse(input)
    expect(result.actions[0]).toEqual(
      expect.objectContaining({ style: { fill: '#ff0000', lineColor: 'bad' } }),
    )
  })

  it('style 非对象时该动作被判定非法丢弃', () => {
    const input =
      '{"actions":[{"type":"add_element","refId":"n1","schema":"terminator","x":1,"y":2,"style":"red"}],"message":"ok"}'
    const result = parseAIResponse(input)
    expect(result.actions).toHaveLength(0)
  })

  it('缺少 actions 字段时抛错', () => {
    const input = '{"message":"no actions here"}'
    expect(() => parseAIResponse(input)).toThrow()
  })

  it('JSON 完全非法时抛错（零执行）', () => {
    const input = '{"actions": [invalid json'
    expect(() => parseAIResponse(input)).toThrow()
  })

  it('多个 JSON 块时取第一个含 actions 的', () => {
    const input = '{"foo":"bar"} {"actions":[],"message":"ok"}'
    const result = parseAIResponse(input)
    expect(result.actions).toEqual([])
  })

  it('字符串值内包含花括号时不会提前截断', () => {
    const input = '{"message":"use {name}"} {"actions":[],"message":"ok"}'
    const result = parseAIResponse(input)
    expect(result.actions).toEqual([])
    expect(result.message).toBe('ok')
  })

  it('空字符串输入抛出 AIError', () => {
    expect(() => parseAIResponse('')).toThrow(AIError)
  })

  it('纯无关文本抛出 AIError', () => {
    expect(() => parseAIResponse('just some random text with no json')).toThrow(AIError)
  })
})

describe('parseAIResponse 运行时校验（LLM 输出不可信）', () => {
  /** 构造包含给定 action 数组的响应文本 */
  const buildInput = (actionsJson: string[], message = '"ok"') =>
    `{"actions":[${actionsJson.join(',')}],"message":${message}}`

  it('坐标为数字字符串的 add_element 被丢弃', () => {
    const bad = '{"type":"add_element","schema":"t","x":"100","y":50}'
    const result = parseAIResponse(buildInput([bad]))
    expect(result.actions).toHaveLength(0)
  })

  it('坐标为 NaN/Infinity 的 action 被丢弃', () => {
    // JSON 中不能直接写 NaN/Infinity，用 1e999 溢出为 Infinity
    const inf = '{"type":"add_element","schema":"t","x":1e999,"y":50}'
    const result = parseAIResponse(buildInput([inf]))
    expect(result.actions).toHaveLength(0)
  })

  it('缺少 schema 或坐标的 add_element 被丢弃', () => {
    const noSchema = '{"type":"add_element","x":1,"y":2}'
    const noCoords = '{"type":"add_element","schema":"t"}'
    const result = parseAIResponse(buildInput([noSchema, noCoords]))
    expect(result.actions).toHaveLength(0)
  })

  it('from/to 为空或类型错误的 add_linker 被丢弃', () => {
    const emptyFrom = '{"type":"add_linker","from":"","to":"n2"}'
    const numTo = '{"type":"add_linker","from":"n1","to":123}'
    const result = parseAIResponse(buildInput([emptyFrom, numTo]))
    expect(result.actions).toHaveLength(0)
  })

  it('非法 update/delete id 被丢弃', () => {
    const missingId = '{"type":"update_element","text":"x"}'
    const emptyId = '{"type":"delete_linker","id":""}'
    const result = parseAIResponse(buildInput([missingId, emptyId]))
    expect(result.actions).toHaveLength(0)
  })

  it('合法 action 与非法 action 混合时仅保留合法部分', () => {
    const bad = '{"type":"add_element","schema":"t","x":"1","y":2}'
    const good = VALID_ADD_ELEMENT
    const result = parseAIResponse(buildInput([bad, good]))
    expect(result.actions).toHaveLength(1)
    expect(result.actions[0].type).toBe('add_element')
  })

  it('message 非字符串时回退为空字符串（防止渲染崩溃）', () => {
    const result = parseAIResponse(buildInput([], '42'))
    expect(result.message).toBe('')
  })

  it(`动作数超过 ${MAX_ACTIONS} 时截断`, () => {
    const many = Array.from({ length: MAX_ACTIONS + 50 }, () =>
      '{"type":"delete_element","id":"x"}',
    )
    const result = parseAIResponse(buildInput(many))
    expect(result.actions).toHaveLength(MAX_ACTIONS)
  })
})

describe('parseAIResponse 裸 actions 数组兜底', () => {
  it('模型漏掉外层包裹直接输出 actions 数组时可解析', () => {
    const input = `[${VALID_ADD_ELEMENT}]`
    const result = parseAIResponse(input)
    expect(result.actions).toHaveLength(1)
    expect(result.actions[0].type).toBe('add_element')
    expect(result.message).toBe('')
  })

  it('围栏包裹的裸数组可解析', () => {
    const input = '```json\n[{"type":"delete_element","id":"x"}]\n```'
    const result = parseAIResponse(input)
    expect(result.actions).toHaveLength(1)
    expect(result.actions[0].type).toBe('delete_element')
  })

  it('文字后跟裸数组时可截取解析', () => {
    const input = `生成结果如下：[${VALID_ADD_ELEMENT}]`
    const result = parseAIResponse(input)
    expect(result.actions).toHaveLength(1)
  })

  it('裸数组中的非法 action 仍被过滤', () => {
    const input = '[{"type":"add_element","x":1},{"type":"delete_element","id":"ok"}]'
    const result = parseAIResponse(input)
    expect(result.actions).toHaveLength(1)
    expect(result.actions[0].type).toBe('delete_element')
  })
})
