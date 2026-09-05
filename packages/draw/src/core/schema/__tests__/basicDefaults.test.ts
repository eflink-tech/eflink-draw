import { describe, it, expect } from 'vitest'
import { shapeRegistry } from '../registry'
import { basicShapes } from '../shapes/basic'
import '@/core/schema/shapes'

describe('基础图形默认样式', () => {
  it('registry 已注册全部基础图形', () => {
    for (const s of basicShapes) {
      expect(shapeRegistry.getShape(s.name)).toBeDefined()
    }
  })

  it('默认边线：lineWidth 1.5、颜色 50,50,50', () => {
    const el = shapeRegistry.createElement('rectangle', 0, 0)!
    expect(el.lineStyle.lineWidth).toBe(1.5)
    expect(el.lineStyle.lineColor).toBe('50,50,50')
    expect(el.lineStyle.lineStyle).toBe('solid')
  })

  it('默认字体：微软雅黑 13 号、颜色 50,50,50', () => {
    const el = shapeRegistry.createElement('rectangle', 0, 0)!
    expect(el.fontStyle.fontFamily).toBe('yahei')
    expect(el.fontStyle.size).toBe(13)
    expect(el.fontStyle.color).toBe('50,50,50')
  })

  it('默认锚点顺序：上、下、左、右', () => {
    const el = shapeRegistry.createElement('rectangle', 0, 0)!
    expect(el.anchors).toEqual([
      { x: 'w/2', y: 0 },
      { x: 'w/2', y: 'h' },
      { x: 0, y: 'h/2' },
      { x: 'w', y: 'h/2' },
    ])
  })

  it('图形默认尺寸', () => {
    const expected: Record<string, [number, number]> = {
      rectangle: [100, 70],
      roundRectangle: [100, 70],
      round: [70, 70],
      diamond: [120, 80],
      triangle: [80, 70],
      polygon: [74, 70],
      hexagon: [84, 70],
      octagon: [70, 70],
      pentagon: [70, 70], // 五角星
      sector: [80, 80],
      sector2: [80, 45],
      cloud: [90, 70],
      comment: [90, 70],
      teardrop: [70, 70],
      cross: [70, 70],
      apqc: [200, 150],
      singleLeftArrow: [90, 60],
      singleRightArrow: [90, 60],
      doubleHorizontalArrow: [90, 60],
      singleUpArrow: [60, 90],
      singleDownArrow: [60, 90],
      doubleVerticalArrow: [60, 90],
      backArrow: [70, 70],
      rightBackArrow: [70, 70],
      corner: [70, 70],
      braces: [200, 140],
      parentheses: [200, 140],
      rightBrace: [100, 140],
      leftBrace: [100, 140],
    }
    for (const [name, [w, h]] of Object.entries(expected)) {
      const el = shapeRegistry.createElement(name, 0, 0)!
      expect(el.props.w, `${name}.w`).toBe(w)
      expect(el.props.h, `${name}.h`).toBe(h)
    }
  })

  it('registry 注册了全部 29 个基础图形', () => {
    expect(basicShapes).toHaveLength(29)
    const names = basicShapes.map((s) => s.name)
    // 基础几何
    expect(names).toContain('rectangle')
    expect(names).toContain('roundRectangle')
    expect(names).toContain('round')
    expect(names).toContain('triangle')
    expect(names).toContain('diamond')
    expect(names).toContain('polygon') // 五边形
    expect(names).toContain('hexagon')
    expect(names).toContain('octagon')
    expect(names).toContain('pentagon') // 五角星
    // 曲线图形
    expect(names).toContain('sector')
    expect(names).toContain('sector2')
    expect(names).toContain('cloud')
    expect(names).toContain('comment')
    expect(names).toContain('teardrop')
    // 十字形与 APQC
    expect(names).toContain('cross')
    expect(names).toContain('apqc')
    // 箭头类
    expect(names).toContain('singleLeftArrow')
    expect(names).toContain('singleRightArrow')
    expect(names).toContain('doubleHorizontalArrow')
    expect(names).toContain('singleUpArrow')
    expect(names).toContain('singleDownArrow')
    expect(names).toContain('doubleVerticalArrow')
    expect(names).toContain('backArrow')
    expect(names).toContain('rightBackArrow')
    expect(names).toContain('corner')
    // 括号类
    expect(names).toContain('braces')
    expect(names).toContain('parentheses')
    expect(names).toContain('rightBrace')
    expect(names).toContain('leftBrace')
  })

  it('三角形锚点为四边中点', () => {
    const el = shapeRegistry.createElement('triangle', 0, 0)!
    expect(el.anchors).toEqual([
      { x: 'w/2', y: 0 },
      { x: 'w/2', y: 'h' },
      { x: 'w*0.25', y: 'h/2' },
      { x: 'w*0.75', y: 'h/2' },
    ])
  })
})

describe('createElementAtCenter（以拖拽中心点创建）', () => {
  it('props.x/y 为中心点减去半宽半高', () => {
    const el = shapeRegistry.createElementAtCenter('rectangle', 500, 400)!
    expect(el.props.x).toBe(500 - el.props.w / 2)
    expect(el.props.y).toBe(400 - el.props.h / 2)
  })

  it('未注册图形返回 null', () => {
    expect(shapeRegistry.createElementAtCenter('nope', 0, 0)).toBeNull()
  })

  it('实例与 schema 不共享可变引用（原地写入不污染注册表）', () => {
    const schema = shapeRegistry.getShape('diamond')!
    const a = shapeRegistry.createElement('diamond', 0, 0)!
    const b = shapeRegistry.createElement('diamond', 0, 0)!
    // 模拟未来双击编辑文本等原地写入
    ;(a.textBlock[0] as { text: string }).text = '已修改'
    ;(a.anchors[0] as { x: string }).x = 'w/3'
    a.props.w = 999
    expect((b.textBlock[0] as { text: string }).text).toBe('')
    expect(b.anchors[0].x).not.toBe('w/3')
    expect(schema.anchors![0].x).not.toBe('w/3')
    expect(b.props.w).toBe(schema.props!.w)
  })
})
