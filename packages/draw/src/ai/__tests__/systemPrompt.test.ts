import { describe, it, expect } from 'vitest'
import { buildSystemPrompt } from '../systemPrompt'

describe('buildSystemPrompt', () => {
  it('包含角色定义', () => {
    const result = buildSystemPrompt({
      canvasContext: '{}',
      schemaList: ['flowStart', 'flowProcess'],
    })
    expect(result).toContain('efdraw 绘图助手')
  })

  it('包含当前画布状态', () => {
    const canvasContext = '{"elements":[{"id":"el-1"}]}'
    const result = buildSystemPrompt({
      canvasContext,
      schemaList: [],
    })
    expect(result).toContain(canvasContext)
  })

  it('包含可用图形 Schema 列表', () => {
    const schemaList = ['flowStart', 'flowProcess', 'flowDecision']
    const result = buildSystemPrompt({
      canvasContext: '{}',
      schemaList,
    })
    schemaList.forEach((schema) => {
      expect(result).toContain(schema)
    })
  })

  it('包含输出格式要求（JSON + actions）', () => {
    const result = buildSystemPrompt({
      canvasContext: '{}',
      schemaList: [],
    })
    expect(result).toContain('JSON')
    expect(result).toContain('actions')
  })

  it('包含规则说明', () => {
    const result = buildSystemPrompt({
      canvasContext: '{}',
      schemaList: [],
    })
    expect(result).toContain('schema 值必须是冒号后面的具体名称')
  })

  it('包含自动配色规则说明（语义色 + 可选 style 覆盖字段）', () => {
    const result = buildSystemPrompt({
      canvasContext: '{}',
      schemaList: [],
    })
    expect(result).toContain('自动配色')
    expect(result).toContain('lineColor')
    expect(result).toContain('#rrggbb')
  })

  it('包含语义状态色板（挂起灰/审核黄/失败红/成功绿/排队橙/数据紫）', () => {
    const result = buildSystemPrompt({
      canvasContext: '{}',
      schemaList: [],
    })
    // 六组语义状态色（fill/lineColor 成对出现）
    expect(result).toContain('#F5F5F5')
    expect(result).toContain('#666666')
    expect(result).toContain('#FFF2CC')
    expect(result).toContain('#D6B656')
    expect(result).toContain('#F8CECC')
    expect(result).toContain('#B85450')
    expect(result).toContain('#D5E8D4')
    expect(result).toContain('#82B366')
    expect(result).toContain('#FFE6CC')
    expect(result).toContain('#D79B00')
    expect(result).toContain('#E1D5E7')
    expect(result).toContain('#9673A6')
  })

  it('引导无状态节点不要指定 style（保留自动配色兜底）', () => {
    const result = buildSystemPrompt({
      canvasContext: '{}',
      schemaList: [],
    })
    expect(result).toContain('不要指定 style')
  })

  it('包含坐标仅供参考与自动分层布局规则（规则 6/9）', () => {
    const result = buildSystemPrompt({
      canvasContext: '{}',
      schemaList: [],
    })
    expect(result).toContain('坐标仅供参考')
    expect(result).toContain('分层布局')
    expect(result).toContain('分支与回环靠连线表达')
    expect(result).toContain('泳道（lane）与文本类元素不会被自动整理')
  })

  it('包含图片复刻模式规则（等比摆位/坐标原样落库/上色/形状映射/双向箭头/兜底）', () => {
    const result = buildSystemPrompt({
      canvasContext: '{}',
      schemaList: [],
    })
    expect(result).toContain('图片复刻模式')
    expect(result).toContain('等比映射')
    expect(result).toContain('不会触发自动布局')
    expect(result).toContain('形状映射')
    expect(result).toContain('双向箭头')
    expect(result).toContain('无法辨认结构')
  })
})
