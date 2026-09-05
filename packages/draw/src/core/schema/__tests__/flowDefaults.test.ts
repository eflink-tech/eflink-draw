import { describe, it, expect } from 'vitest'
import { shapeRegistry } from '../registry'
import { flowShapes } from '../shapes/flow'
import '@/core/schema/shapes'

describe('流程图形状默认样式', () => {
  it('flowShapes 共 21 个', () => {
    expect(flowShapes).toHaveLength(21)
  })

  it('registry 已注册全部流程图形状', () => {
    for (const s of flowShapes) {
      expect(shapeRegistry.getShape(s.name)).toBeDefined()
    }
  })

  it('所有流程图形状 category 均为 flow', () => {
    for (const s of flowShapes) {
      expect(s.category, `${s.name}.category`).toBe('flow')
    }
  })

  it('流程图形状默认尺寸', () => {
    const expected: Record<string, [number, number]> = {
      process: [100, 70],
      decision: [90, 70],
      terminator: [100, 50],
      document: [100, 70],
      data: [100, 70],
      predefinedProcess: [100, 70],
      storedData: [100, 70],
      internalStorage: [100, 70],
      sequentialData: [70, 70],
      directData: [100, 70],
      manualInput: [100, 70],
      card: [100, 70],
      paperTape: [100, 70],
      display: [100, 70],
      manualOperation: [100, 70],
      preparation: [100, 70],
      parallelMode: [100, 70],
      loopLimit: [100, 70],
      onPageReference: [70, 70],
      offPageReference: [70, 60],
      annotation: [100, 70],
    }
    for (const [name, [w, h]] of Object.entries(expected)) {
      const el = shapeRegistry.createElement(name, 0, 0)!
      expect(el.props.w, `${name}.w`).toBe(w)
      expect(el.props.h, `${name}.h`).toBe(h)
    }
  })

  it('process 复用 rectangle 路径', () => {
    const process = shapeRegistry.getShape('process')!
    const rectangle = shapeRegistry.getShape('rectangle')!
    expect(process.path).toEqual(rectangle.path)
  })

  it('onPageReference 复用 round 路径', () => {
    const onPageReference = shapeRegistry.getShape('onPageReference')!
    const round = shapeRegistry.getShape('round')!
    expect(onPageReference.path).toEqual(round.path)
  })

  it('parallelMode 无填充 + container + 2 锚点', () => {
    const el = shapeRegistry.createElement('parallelMode', 0, 0)!
    expect(el.fillStyle.type).toBe('none')
    expect(el.attribute.container).toBe(true)
    expect(el.anchors).toEqual([
      { x: 'w*0.5', y: 0 },
      { x: 'w*0.5', y: 'h' },
    ])
  })

  it('annotation 无填充 + container + 1 锚点', () => {
    const el = shapeRegistry.createElement('annotation', 0, 0)!
    expect(el.fillStyle.type).toBe('none')
    expect(el.attribute.container).toBe(true)
    expect(el.anchors).toEqual([{ x: 0, y: 'h*0.5' }])
  })

  it('document 底部锚点在波浪线中点', () => {
    const el = shapeRegistry.createElement('document', 0, 0)!
    expect(el.anchors).toEqual([
      { x: 'w*0.5', y: 0 },
      { x: 'w', y: 'h*0.5' },
      { x: 'w*0.5', y: 'h-Math.min(h/8,w/12)' },
      { x: 0, y: 'h*0.5' },
    ])
  })

  it('所有显式 textBlock 均含空 text 字段', () => {
    for (const s of flowShapes) {
      if (s.textBlock) {
        for (const tb of s.textBlock) {
          expect(tb.text, `${s.name}.textBlock.text`).toBe('')
        }
      }
    }
  })
})
