// 旧 Schema 分类移植（scripts/gen-legacy-shapes.mjs）的落地断言
import { describe, it, expect } from 'vitest'
import { shapeRegistry } from '@/core/schema/registry'
import { legacyShapes } from '@/core/schema/shapes/legacy'
import { SHAPE_CATEGORIES } from '@/store/uiStore'
import '@/core/schema/shapes'

const BPMN_GROUPS = ['bpmn_start', 'bpmn_intermediate', 'bpmn_boundary', 'bpmn_end', 'bpmn_task', 'bpmn_sub', 'bpmn_gateway', 'bpmn_data', 'bpmn_collab', 'bpmn_misc']

describe('旧 Schema 移植图形', () => {
  it('全部注册进 shapeRegistry，名称不重复', () => {
    expect(legacyShapes.length).toBe(135)
    expect(new Set(legacyShapes.map((s) => s.name)).size).toBe(legacyShapes.length)
    for (const shape of legacyShapes) {
      expect(shapeRegistry.getShape(shape.name), shape.name).toBe(shape)
    }
  })

  it('每个图形都有可绘制的路径，且动作都在本项目支持范围内', () => {
    const ACTIONS = new Set(['move', 'line', 'curve', 'quadraticCurve', 'close'])
    for (const shape of legacyShapes) {
      const subs = shape.path.map((p) => (Array.isArray(p) ? p : p.actions))
      expect(subs.length, shape.name).toBeGreaterThan(0)
      for (const sub of subs) {
        expect(sub.length, `${shape.name} 空子路径`).toBeGreaterThan(0)
        for (const a of sub) expect(ACTIONS.has(a.action), `${shape.name}.${a.action}`).toBe(true)
      }
    }
  })

  it('不残留旧引擎专有写法：位图填充 / 渐变 / 相对颜色 / 相对线宽', () => {
    const json = JSON.stringify(legacyShapes)
    expect(json).not.toContain('"image"')
    expect(json).not.toContain('gradient')
    expect(json).not.toMatch(/"color":"r-/)
    expect(json).not.toContain('lineWidth+')
  })

  it('BPMN 补全图形带面板二级分组，其余分类不分组', () => {
    const bpmn = legacyShapes.filter((s) => s.category === 'bpmn')
    expect(bpmn.length).toBe(90)
    for (const shape of bpmn) {
      expect(BPMN_GROUPS, `${shape.name} → ${shape.group}`).toContain(shape.group)
      expect(shape.groupName).toBeTruthy()
    }
    for (const shape of legacyShapes.filter((s) => s.category !== 'bpmn')) {
      expect(shape.group, shape.name).toBeUndefined()
    }
  })

  it('新分类都出现在左侧面板，且标题为中文', () => {
    const panels = new Set(SHAPE_CATEGORIES.map((c) => c.id))
    for (const cat of ['er', 'org', 'venn', 'epc', 'evc', 'weizhu_bm']) {
      expect(panels.has(cat), cat).toBe(true)
    }
    for (const shape of legacyShapes) {
      expect(shape.title, shape.name).toMatch(/[一-龥]/)
    }
  })

  it('实例化后带路径与锚点（可拖拽、可连线）', () => {
    const el = shapeRegistry.createElement('entity', 0, 0)
    expect(el?.path.length).toBeGreaterThan(0)
    expect(el?.anchors.length).toBeGreaterThan(0)
  })
})
