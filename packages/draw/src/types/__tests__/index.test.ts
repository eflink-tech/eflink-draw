import { describe, it, expect } from 'vitest'
import type {
  RGBColor, PathAction, FillStyle, LineStyle,
  ShapeDefinition, ElementInstance,
  DocumentData
} from '../index'
import { isTextOnlyShape } from '../index'

describe('类型定义', () => {
  it('RGBColor 是逗号分隔的字符串', () => {
    const color: RGBColor = '255,128,0'
    expect(color).toBe('255,128,0')
  })

  it('FillStyle solid 类型正确', () => {
    const fill: FillStyle = { type: 'solid', color: '255,255,255' }
    expect(fill.type).toBe('solid')
    expect(fill.color).toBe('255,255,255')
  })

  it('FillStyle gradient 类型正确', () => {
    const fill: FillStyle = {
      type: 'gradient',
      gradientType: 'linear',
      beginColor: '255,0,0',
      endColor: '0,0,255',
      angle: 45,
    }
    expect(fill.type).toBe('gradient')
  })

  it('LineStyle 默认值正确', () => {
    const line: LineStyle = { lineWidth: 1, lineColor: '0,0,0', lineStyle: 'solid' }
    expect(line.lineWidth).toBe(1)
  })

  it('PathAction 各类型正确', () => {
    const move: PathAction = { action: 'move', x: 0, y: 0 }
    const line: PathAction = { action: 'line', x: 100, y: 100 }
    const close: PathAction = { action: 'close' }
    expect(move.action).toBe('move')
    expect(line.action).toBe('line')
    expect(close.action).toBe('close')
  })

  it('isTextOnlyShape 识别面板文本与 T 工具自由文本', () => {
    expect(isTextOnlyShape({ name: 'text' } as ElementInstance)).toBe(true)
    expect(isTextOnlyShape({ name: 'freetext' } as ElementInstance)).toBe(true)
    expect(isTextOnlyShape({ name: 'rectangle' } as ElementInstance)).toBe(false)
  })

  it('ShapeDefinition 最小结构', () => {
    const shape: ShapeDefinition = {
      name: 'rectangle',
      title: '矩形',
      category: 'basic',
      path: [[
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: 'w', y: 0 },
        { action: 'line', x: 'w', y: 'h' },
        { action: 'line', x: 0, y: 'h' },
        { action: 'close' },
      ]],
    }
    expect(shape.name).toBe('rectangle')
    expect(shape.path[0]).toHaveLength(5)
  })

  it('ElementInstance 完整结构', () => {
    const el: ElementInstance = {
      id: 'el-1',
      name: 'rectangle',
      title: '矩形',
      category: 'basic',
      group: '',
      groupName: null,
      locked: false,
      link: '',
      children: [],
      parent: '',
      resizeDir: ['tl', 'tr', 'br', 'bl'],
      attribute: { visible: true, linkable: true, container: false },
      dataAttributes: [],
      props: { x: 100, y: 100, w: 120, h: 60, zindex: 0, angle: 0 },
      shapeStyle: { alpha: 1 },
      lineStyle: { lineWidth: 1, lineColor: '0,0,0', lineStyle: 'solid' },
      fillStyle: { type: 'solid', color: '255,255,255' },
      path: [[{ action: 'move', x: 0, y: 0 }]],
      fontStyle: { size: 14, color: '0,0,0', textAlign: 'center', vAlign: 'middle' },
      textBlock: [{
        position: { x: 0, y: 0, w: 'w', h: 'h' },
        text: 'Hello',
      }],
      anchors: [
        { x: 'w/2', y: 0 },
        { x: 'w', y: 'h/2' },
        { x: 'w/2', y: 'h' },
        { x: 0, y: 'h/2' },
      ],
    }
    expect(el.id).toBe('el-1')
    expect(el.props.w).toBe(120)
    expect(el.anchors).toHaveLength(4)
  })

  it('DocumentData 包含 page 和 elements', () => {
    const doc: DocumentData = {
      page: {
        showGrid: true,
        gridSize: 10,
        orientation: 'landscape',
        height: 1200,
        width: 1600,
        backgroundColor: '255,255,255',
        padding: 0,
        title: '未命名图表',
      },
      elements: {},
    }
    expect(doc.page.showGrid).toBe(true)
    expect(Object.keys(doc.elements)).toHaveLength(0)
  })
})
