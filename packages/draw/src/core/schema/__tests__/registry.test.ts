import { describe, it, expect, beforeEach } from 'vitest'
import { ShapeRegistry } from '../registry'
import { textShapes } from '../shapes/text'
import type { ShapeDefinition } from '@/types'

describe('ShapeRegistry', () => {
  let registry: ShapeRegistry

  beforeEach(() => {
    registry = new ShapeRegistry()
  })

  it('addShape + getShape', () => {
    const rect: ShapeDefinition = {
      name: 'rectangle',
      title: '矩形',
      category: 'basic',
      path: [[{ action: 'move', x: 0, y: 0 }, { action: 'line', x: 'w', y: 0 }, { action: 'line', x: 'w', y: 'h' }, { action: 'line', x: 0, y: 'h' }, { action: 'close' }]],
    }
    registry.addShape(rect)
    expect(registry.getShape('rectangle')).toBe(rect)
  })

  it('getShapesByCategory', () => {
    const rect: ShapeDefinition = { name: 'rectangle', title: '矩形', category: 'basic', path: [[]] }
    const circle: ShapeDefinition = { name: 'round', title: '圆形', category: 'basic', path: [[]] }
    const terminator: ShapeDefinition = { name: 'terminator', title: '开始/结束', category: 'flow', path: [[]] }

    registry.addShape(rect)
    registry.addShape(circle)
    registry.addShape(terminator)

    const basicShapes = registry.getShapesByCategory('basic')
    expect(basicShapes).toHaveLength(2)
    expect(basicShapes.map((s) => s.name)).toEqual(['rectangle', 'round'])
  })

  it('createElement 从 Schema 生成实例', () => {
    const rect: ShapeDefinition = {
      name: 'rectangle',
      title: '矩形',
      category: 'basic',
      props: { w: 120, h: 60 },
      path: [[]],
      anchors: [{ x: 'w/2', y: 0 }, { x: 'w', y: 'h/2' }, { x: 'w/2', y: 'h' }, { x: 0, y: 'h/2' }],
      fillStyle: { type: 'solid', color: '255,255,255' },
      lineStyle: { lineWidth: 1, lineColor: '0,0,0', lineStyle: 'solid' },
      fontStyle: { size: 14, color: '0,0,0', textAlign: 'center', vAlign: 'middle' },
    }
    registry.addShape(rect)

    const el = registry.createElement('rectangle', 100, 200)
    expect(el).not.toBeNull()
    expect(el!.id).toBeTruthy()
    expect(el!.name).toBe('rectangle')
    expect(el!.props.x).toBe(100)
    expect(el!.props.y).toBe(200)
    expect(el!.props.w).toBe(120)
    expect(el!.props.h).toBe(60)
    expect(el!.anchors).toHaveLength(4)
  })

  it('getCategories 返回已注册分类列表', () => {
    registry.addShape({ name: 'rectangle', title: '矩形', category: 'basic', path: [[]] })
    registry.addShape({ name: 'terminator', title: '开始', category: 'flow', path: [[]] })

    const cats = registry.getCategories()
    expect(cats).toContain('basic')
    expect(cats).toContain('flow')
    expect(cats).toHaveLength(2)
  })

  it('text 实例：无填充、无描边、无锚点、默认文案、不可连线', () => {
    const textShape = textShapes.find((s) => s.name === 'text')
    expect(textShape).toBeDefined()
    registry.addShape(textShape!)
    const el = registry.createElement('text', 0, 0)
    expect(el).not.toBeNull()
    expect(el!.fillStyle.type).toBe('none')
    expect(el!.lineStyle.lineWidth).toBe(0)
    expect(el!.anchors).toHaveLength(0)
    expect(el!.textBlock[0]?.text).toBe('文本')
    expect(el!.attribute?.linkable).toBe(false)
    expect(el!.props.w).toBe(160)
    expect(el!.props.h).toBe(40)
  })

  it('freetext 实例：无填充、无描边、左对齐、textBlock 占满、四边锚点保留', () => {
    const freetext = textShapes.find((s) => s.name === 'freetext')
    expect(freetext).toBeDefined()
    registry.addShape(freetext!)
    const el = registry.createElement('freetext', 0, 0)
    expect(el).not.toBeNull()
    expect(el!.fillStyle.type).toBe('none')
    expect(el!.lineStyle.lineWidth).toBe(0)
    expect(el!.fontStyle.textAlign).toBe('left')
    expect(el!.fontStyle.vAlign).toBe('middle')
    expect(el!.textBlock[0]).toMatchObject({
      position: { x: 0, y: 0, w: 'w', h: 'h' },
      text: '',
    })
    // 默认四边锚点保留（支持连线吸附）
    expect(el!.anchors).toHaveLength(4)
  })

  it('createElement 传播 schema 的 shadow 默认值', () => {
    const rectWithShadow: ShapeDefinition = {
      name: 'rectangle',
      title: '矩形',
      category: 'basic',
      path: [[]],
      shapeStyle: {
        alpha: 1,
        shadowEnabled: true,
        shadowColor: '0,0,0',
        shadowBlur: 10,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
      },
    }
    registry.addShape(rectWithShadow)
    const el = registry.createElement('rectangle', 0, 0)
    expect(el).not.toBeNull()
    expect(el!.shapeStyle).toMatchObject({
      alpha: 1,
      shadowEnabled: true,
      shadowColor: '0,0,0',
      shadowBlur: 10,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
    })
  })
})
