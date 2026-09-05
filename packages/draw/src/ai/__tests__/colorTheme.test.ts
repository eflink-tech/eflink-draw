// src/ai/__tests__/colorTheme.test.ts
// 语义配色主题的纯函数测试：映射、颜色清洗、应用优先级。
import { describe, it, expect } from 'vitest'
import {
  themeForSchema,
  sanitizeColor,
  sanitizeStyleOverride,
  applyThemeToElement,
} from '../colorTheme'
import type { ElementInstance, ShapeDefinition } from '@/types'

/** 构造最小元素实例桩：默认白色填充 + 灰描边（registry 兜底样式） */
function makeEl(name: string, category: string): ElementInstance {
  return {
    name,
    category,
    fillStyle: { type: 'solid', color: '255,255,255' },
    lineStyle: { lineWidth: 1.5, lineColor: '50,50,50', lineStyle: 'solid' },
  } as unknown as ElementInstance
}

/** 构造最小 schema 定义桩 */
function makeSchema(overrides?: Partial<ShapeDefinition>): ShapeDefinition {
  return {
    name: 'x',
    title: 'x',
    category: 'flow',
    path: [[]],
    ...overrides,
  } as unknown as ShapeDefinition
}

describe('themeForSchema', () => {
  it('flow 起止/判定/流程按语义映射', () => {
    expect(themeForSchema('terminator', 'flow')).toEqual({ fill: '213,232,212', line: '130,179,102' })
    expect(themeForSchema('decision', 'flow')).toEqual({ fill: '255,242,204', line: '214,182,86' })
    expect(themeForSchema('process', 'flow')).toEqual({ fill: '218,232,252', line: '108,142,191' })
    expect(themeForSchema('data', 'flow')).toEqual({ fill: '225,213,231', line: '150,115,166' })
    expect(themeForSchema('document', 'flow')).toEqual({ fill: '255,230,204', line: '215,155,0' })
  })

  it('bpmn 事件/网关按语义映射', () => {
    expect(themeForSchema('startEvent', 'bpmn')).toEqual({ fill: '213,232,212', line: '130,179,102' })
    expect(themeForSchema('endEvent', 'bpmn')).toEqual({ fill: '248,206,204', line: '184,84,80' })
    expect(themeForSchema('bpmnGateway', 'bpmn')).toEqual({ fill: '255,242,204', line: '214,182,86' })
    expect(themeForSchema('task', 'bpmn')).toEqual({ fill: '218,232,252', line: '108,142,191' })
  })

  it('name 未命中时按类别兜底浅蓝', () => {
    expect(themeForSchema('unknownShape', 'flow')).toEqual({ fill: '218,232,252', line: '108,142,191' })
    expect(themeForSchema('simpleClass', 'uml_class')).toEqual({ fill: '218,232,252', line: '108,142,191' })
  })

  it('lane / free（文本）类别不上色，返回 null', () => {
    expect(themeForSchema('horizontalPool', 'lane')).toBeNull()
    expect(themeForSchema('freetext', 'free')).toBeNull()
    expect(themeForSchema('text', 'basic')).not.toBeNull() // text 类别为 basic，走兜底（但实际因 schema 自带 none 被豁免）
  })

  it('未知类别返回 null', () => {
    expect(themeForSchema('foo', 'unknown_category')).toBeNull()
  })
})

describe('sanitizeColor', () => {
  it('接受带#与不带#的十六进制', () => {
    expect(sanitizeColor('#D5E8D4')).toBe('213,232,212')
    expect(sanitizeColor('d5e8d4')).toBe('213,232,212')
    expect(sanitizeColor('#abc')).toBe('170,187,204')
  })

  it('接受合法 r,g,b 并规范化空白', () => {
    expect(sanitizeColor('213,232,212')).toBe('213,232,212')
    expect(sanitizeColor(' 213, 232 , 212 ')).toBe('213,232,212')
  })

  it('拒绝非法输入', () => {
    expect(sanitizeColor('not-a-color')).toBeNull()
    expect(sanitizeColor('#gggggg')).toBeNull()
    expect(sanitizeColor('999,0,0')).toBeNull()
    expect(sanitizeColor('256,0,0')).toBeNull()
    expect(sanitizeColor('255,255')).toBeNull()
    expect(sanitizeColor('')).toBeNull()
    expect(sanitizeColor(123)).toBeNull()
    expect(sanitizeColor(null)).toBeNull()
    expect(sanitizeColor(undefined)).toBeNull()
    expect(sanitizeColor({})).toBeNull()
  })
})

describe('sanitizeStyleOverride', () => {
  it('只保留 fill / lineColor 两个合法键', () => {
    expect(
      sanitizeStyleOverride({ fill: '#ff0000', lineColor: '#00ff00', foo: 'bar' }),
    ).toEqual({ fill: '255,0,0', lineColor: '0,255,0' })
  })

  it('非法值丢弃对应键', () => {
    expect(sanitizeStyleOverride({ fill: 'xx', lineColor: '#00ff00' })).toEqual({
      lineColor: '0,255,0',
    })
  })

  it('全非法 / 非对象 / 缺省 → undefined', () => {
    expect(sanitizeStyleOverride({ fill: 'xx' })).toBeUndefined()
    expect(sanitizeStyleOverride('red')).toBeUndefined()
    expect(sanitizeStyleOverride(null)).toBeUndefined()
    expect(sanitizeStyleOverride(undefined)).toBeUndefined()
    expect(sanitizeStyleOverride([])).toBeUndefined()
  })
})

describe('applyThemeToElement', () => {
  it('schema 无自带样式时应用主题（填充+描边）', () => {
    const el = makeEl('process', 'flow')
    applyThemeToElement(el, makeSchema(), undefined)
    expect(el.fillStyle).toEqual({ type: 'solid', color: '218,232,252' })
    expect(el.lineStyle.lineColor).toBe('108,142,191')
  })

  it('schema 自带 fillStyle:none（注释/泳道）时完全不动', () => {
    const el = makeEl('annotation', 'flow')
    applyThemeToElement(el, makeSchema({ fillStyle: { type: 'none' } }), undefined)
    expect(el.fillStyle).toEqual({ type: 'solid', color: '255,255,255' })
    expect(el.lineStyle.lineColor).toBe('50,50,50')
  })

  it('schema 自带实色（umlStart/devNode）时完全不动', () => {
    // 生产中 createElement 已把 schema 实色写入实例；桩元素模拟该状态
    const el = makeEl('umlStart', 'uml_stateactivity')
    el.fillStyle = { type: 'solid', color: '50,50,50' }
    applyThemeToElement(el, makeSchema({ fillStyle: { type: 'solid', color: '50,50,50' } }), undefined)
    expect(el.fillStyle.color).toBe('50,50,50')
    expect(el.lineStyle.lineColor).toBe('50,50,50')
  })

  it('schemaDef 为 undefined 时按可上色处理', () => {
    const el = makeEl('terminator', 'flow')
    applyThemeToElement(el, undefined, undefined)
    expect(el.fillStyle.color).toBe('213,232,212')
  })

  it('AI 覆盖优先于主题', () => {
    const el = makeEl('process', 'flow')
    applyThemeToElement(el, makeSchema(), { fill: '255,0,0', lineColor: '0,0,255' })
    expect(el.fillStyle.color).toBe('255,0,0')
    expect(el.lineStyle.lineColor).toBe('0,0,255')
  })

  it('AI 覆盖可单独只改填充，另一维走主题', () => {
    const el = makeEl('process', 'flow')
    applyThemeToElement(el, makeSchema(), { fill: '255,0,0' })
    expect(el.fillStyle.color).toBe('255,0,0')
    expect(el.lineStyle.lineColor).toBe('108,142,191')
  })

  it('schema 自带 lineColor 时主题不改描边（但自带 none 已整体豁免，此处仅自带实色+描边的组合）', () => {
    const el = makeEl('mystery', 'flow')
    applyThemeToElement(
      el,
      makeSchema({ fillStyle: { type: 'solid', color: '220,220,220' }, lineStyle: { lineColor: '10,20,30' } }),
      undefined,
    )
    // 自带 fillStyle → 主题整体跳过
    expect(el.fillStyle.color).toBe('255,255,255')
    expect(el.lineStyle.lineColor).toBe('50,50,50')
  })

  it('主题命中时保留元素既有 lineStyle 其它字段（如线宽），只改描边颜色', () => {
    const el = makeEl('process', 'flow')
    el.lineStyle = { ...el.lineStyle, lineWidth: 3 } // 模拟 createElement 写入 schema 线宽
    applyThemeToElement(el, makeSchema({ lineStyle: { lineWidth: 3 } }), undefined)
    expect(el.lineStyle.lineWidth).toBe(3) // 线宽保留
    expect(el.lineStyle.lineColor).toBe('108,142,191') // 颜色被主题覆盖
  })
})
