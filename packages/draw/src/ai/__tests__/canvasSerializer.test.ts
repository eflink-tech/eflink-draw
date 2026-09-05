// src/ai/__tests__/canvasSerializer.test.ts
import { describe, it, expect } from 'vitest'
import { serializeElement, deserializeElement, serializeCanvas } from '../canvasSerializer'
import type { ElementInstance, LinkerInstance } from '@/types'

/**
 * 创建简化的 mock ElementInstance。
 * 只填充序列化/反序列化需要用到的字段，其余用合理默认值。
 */
function createMockElement(overrides: Partial<ElementInstance> & { _title?: string; _x?: number; _y?: number; _w?: number; _h?: number } = {}): ElementInstance {
  const {
    _title = '开始',
    _x = 100,
    _y = 200,
    _w = 80,
    _h = 40,
    ...rest
  } = overrides

  return {
    id: 'el-123',
    name: 'flowStart',
    title: _title,
    category: 'flow',
    group: '',
    groupName: null,
    locked: false,
    link: '',
    children: [],
    parent: '',
    resizeDir: [],
    attribute: {} as any,
    dataAttributes: [],
    props: { x: _x, y: _y, w: _w, h: _h, zindex: 0, angle: 0 },
    shapeStyle: { alpha: 1 },
    lineStyle: {} as any,
    fillStyle: {} as any,
    path: [],
    fontStyle: {} as any,
    textBlock: [],
    anchors: [],
    ...rest,
  }
}

function createMockLinker(overrides: Partial<LinkerInstance> = {}): LinkerInstance {
  return {
    id: 'ln-1',
    name: 'linker',
    from: { id: 'el-1', x: 0, y: 0, angle: 0 },
    to: { id: 'el-2', x: 0, y: 0, angle: 0 },
    text: '',
    linkerType: 'curve',
    lineStyle: {} as any,
    points: [],
    locked: false,
    dataAttributes: [],
    group: '',
    props: { zindex: 0 },
    ...overrides,
  }
}

describe('canvasSerializer', () => {
  describe('serializeElement', () => {
    it('压缩 ElementInstance 为精简 JSON', () => {
      const el = createMockElement()
      const result = serializeElement(el)
      expect(result).toEqual({
        id: 'el-123',
        name: 'flowStart',
        category: 'flow',
        text: '开始',
        x: 100,
        y: 200,
        w: 80,
        h: 40,
      })
    })

    it('丢弃 path/anchors/dataAttributes 等冗余字段', () => {
      const el = createMockElement()
      const result = serializeElement(el)
      expect(result).not.toHaveProperty('path')
      expect(result).not.toHaveProperty('anchors')
      expect(result).not.toHaveProperty('dataAttributes')
      expect(result).not.toHaveProperty('props')
      expect(result).not.toHaveProperty('shapeStyle')
      expect(result).not.toHaveProperty('fillStyle')
    })

    it('处理空 title 字段', () => {
      const el = createMockElement({ _title: '' })
      const result = serializeElement(el)
      expect(result.text).toBe('')
    })
  })

  describe('deserializeElement', () => {
    it('从压缩 JSON 还原为 ElementInstance 部分字段', () => {
      const compressed = {
        id: 'el-456',
        name: 'flowProcess',
        category: 'flow',
        text: '处理',
        x: 300,
        y: 400,
        w: 120,
        h: 60,
      }
      const result = deserializeElement(compressed)
      expect(result.id).toBe('el-456')
      expect(result.name).toBe('flowProcess')
      expect(result.title).toBe('处理')
      expect(result.props).toMatchObject({ x: 300, y: 400, w: 120, h: 60 })
    })

    it('还原的 ElementInstance 不包含 path/anchors 等字段', () => {
      const compressed = {
        id: 'el-789',
        name: 'flowEnd',
        category: 'flow',
        text: '结束',
        x: 500,
        y: 600,
        w: 80,
        h: 40,
      }
      const result = deserializeElement(compressed)
      expect(result).not.toHaveProperty('path')
      expect(result).not.toHaveProperty('anchors')
      expect(result).not.toHaveProperty('dataAttributes')
    })
  })

  describe('serializeCanvas', () => {
    it('序列化整个画布（elements + linkers）', () => {
      const elements = [
        createMockElement({ id: 'el-1' }),
        createMockElement({ id: 'el-2' }),
      ]
      const linkers = [
        createMockLinker({ id: 'ln-1' }),
      ]
      const result = serializeCanvas(elements, linkers)
      expect(result.elements).toHaveLength(2)
      expect(result.linkers).toHaveLength(1)
      expect(result.elements[0]).not.toHaveProperty('path')
      expect(result.linkers[0].from).toBe('el-1')
      expect(result.linkers[0].to).toBe('el-2')
      expect(result.linkers[0].type).toBe('curve')
    })

    it('空画布返回空数组', () => {
      const result = serializeCanvas([], [])
      expect(result).toEqual({ elements: [], linkers: [] })
    })
  })
})
