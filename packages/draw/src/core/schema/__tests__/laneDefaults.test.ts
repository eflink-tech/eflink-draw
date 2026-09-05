import { describe, it, expect } from 'vitest'
import { shapeRegistry } from '../registry'
import { laneShapes } from '../shapes/lane'
import '@/core/schema/shapes'

describe('泳池/泳道形状默认样式', () => {
  it('laneShapes 共 8 个', () => {
    expect(laneShapes).toHaveLength(8)
  })

  it('registry 已注册全部 lane 形状', () => {
    for (const s of laneShapes) {
      expect(shapeRegistry.getShape(s.name), `missing: ${s.name}`).toBeDefined()
    }
  })

  it('registry lane 分类数量 = 8', () => {
    expect(shapeRegistry.getShapesByCategory('lane')).toHaveLength(8)
  })

  it('所有 lane 形状 category 均为 lane', () => {
    for (const s of laneShapes) {
      expect(s.category, `${s.name}.category`).toBe('lane')
      expect(s.title, `${s.name}.title`).toBeTruthy()
    }
  })

  it('lane 形状默认尺寸', () => {
    const expected: Record<string, [number, number]> = {
      verticalPool:          [250, 540],
      verticalLane:          [250, 500],
      horizontalPool:        [640, 200],
      horizontalLane:        [600, 200],
      bidirectionalPoolH:    [640, 400],
      bidirectionalPoolV:    [500, 540],
      horizontalSeparator:   [300, 20],
      verticalSeparator:     [20, 300],
    }
    for (const [name, [w, h]] of Object.entries(expected)) {
      const el = shapeRegistry.createElement(name, 0, 0)!
      expect(el.props.w, `${name}.w`).toBe(w)
      expect(el.props.h, `${name}.h`).toBe(h)
    }
  })

  it('所有 lane 形状均为 container', () => {
    for (const s of laneShapes) {
      const el = shapeRegistry.createElement(s.name, 0, 0)!
      expect(el.attribute.container, `${s.name}.container`).toBe(true)
    }
  })

  it('所有 lane 形状均无填充（fillStyle.type === none）', () => {
    for (const s of laneShapes) {
      const el = shapeRegistry.createElement(s.name, 0, 0)!
      expect(el.fillStyle.type, `${s.name}.fillStyle.type`).toBe('none')
    }
  })

  it('所有 lane 形状 rotatable=false', () => {
    for (const s of laneShapes) {
      const el = shapeRegistry.createElement(s.name, 0, 0)!
      expect(el.attribute.rotatable, `${s.name}.rotatable`).toBe(false)
    }
  })

  it('所有 lane 形状 linkable=false', () => {
    for (const s of laneShapes) {
      const el = shapeRegistry.createElement(s.name, 0, 0)!
      expect(el.attribute.linkable, `${s.name}.linkable`).toBe(false)
    }
  })

  it('所有 lane 形状 anchors 为空', () => {
    for (const s of laneShapes) {
      const el = shapeRegistry.createElement(s.name, 0, 0)!
      expect(el.anchors, `${s.name}.anchors`).toEqual([])
    }
  })

  it('分隔条默认文本「阶段」', () => {
    for (const name of ['horizontalSeparator', 'verticalSeparator']) {
      const el = shapeRegistry.createElement(name, 0, 0)!
      expect(el.textBlock).toHaveLength(1)
      expect(el.textBlock[0].text, `${name}.textBlock[0].text`).toBe('阶段')
    }
  })

  it('池/道 textBlock 为空字符串', () => {
    for (const name of ['verticalPool', 'verticalLane', 'horizontalPool', 'horizontalLane', 'bidirectionalPoolH', 'bidirectionalPoolV']) {
      const el = shapeRegistry.createElement(name, 0, 0)!
      for (const tb of el.textBlock) {
        expect(tb.text, `${name}.textBlock.text`).toBe('')
      }
    }
  })

  it('verticalPool / horizontalPool / bidirectionalPoolH / bidirectionalPoolV 字体 size 16', () => {
    for (const name of ['verticalPool', 'horizontalPool', 'bidirectionalPoolH', 'bidirectionalPoolV']) {
      const el = shapeRegistry.createElement(name, 0, 0)!
      expect(el.fontStyle.size, `${name}.fontStyle.size`).toBe(16)
    }
  })

  it('顶部标题带（verticalPool / verticalLane / bidirectionalPoolV / verticalSeparator）横排文字 orientation=horizontal', () => {
    for (const name of ['verticalPool', 'verticalLane', 'bidirectionalPoolV', 'verticalSeparator']) {
      const el = shapeRegistry.createElement(name, 0, 0)!
      expect(el.fontStyle.orientation, `${name}.fontStyle.orientation`).toBe('horizontal')
    }
  })

  it('左侧标题列（horizontalPool / horizontalLane / bidirectionalPoolH / horizontalSeparator）竖排文字 orientation=vertical', () => {
    for (const name of ['horizontalPool', 'horizontalLane', 'bidirectionalPoolH', 'horizontalSeparator']) {
      const el = shapeRegistry.createElement(name, 0, 0)!
      expect(el.fontStyle.orientation, `${name}.fontStyle.orientation`).toBe('vertical')
    }
  })
})
