import type { ShapeDefinition, ElementInstance } from '@/types'
import { DEFAULT_FONT_SIZE, DEFAULT_LINE_WIDTH } from '@/types'
import { DEFAULT_FONT_VALUE } from '@/core/editor/fontMap'

// 默认锚点 上、下、左、右；默认文本区 {x:10, y:0, w:w-20, h:h}

/**
 * 图形注册表
 * 管理所有图形 Schema 定义，提供分类查询和元素实例化
 */
export class ShapeRegistry {
  private shapes: Map<string, ShapeDefinition> = new Map()

  addShape(shape: ShapeDefinition): void {
    this.shapes.set(shape.name, shape)
  }

  getShape(name: string): ShapeDefinition | undefined {
    return this.shapes.get(name)
  }

  getShapesByCategory(category: string): ShapeDefinition[] {
    return [...this.shapes.values()].filter((s) => s.category === category)
  }

  getCategories(): string[] {
    return [...new Set([...this.shapes.values()].map((s) => s.category))]
  }

  /**
   * 从 Schema 创建元素实例（x/y 为左上角）
   */
  createElement(shapeName: string, x: number, y: number): ElementInstance | null {
    const schema = this.getShape(shapeName)
    if (!schema) return null

    const id = `el-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    return {
      id,
      name: schema.name,
      title: schema.title,
      category: schema.category,
      group: schema.group || '',
      groupName: schema.groupName ?? null,
      locked: false,
      link: '',
      children: [],
      parent: '',
      resizeDir: schema.resizeDir || ['tl', 'tr', 'br', 'bl'],
      attribute: schema.attribute ? { ...schema.attribute } : { visible: true },
      dataAttributes: schema.dataAttributes ? [...schema.dataAttributes] : [],
      props: {
        x,
        y,
        w: schema.props?.w || 100,
        h: schema.props?.h || 60,
        zindex: 0,
        angle: 0,
      },
      shapeStyle: {
        alpha: schema.shapeStyle?.alpha ?? 1,
        ...(schema.shapeStyle?.shadowEnabled != null && {
          shadowEnabled: schema.shapeStyle.shadowEnabled,
          shadowColor: schema.shapeStyle.shadowColor,
          shadowBlur: schema.shapeStyle.shadowBlur,
          shadowOffsetX: schema.shapeStyle.shadowOffsetX,
          shadowOffsetY: schema.shapeStyle.shadowOffsetY,
        }),
      },
      lineStyle: {
        lineWidth: schema.lineStyle?.lineWidth ?? DEFAULT_LINE_WIDTH,
        lineColor: schema.lineStyle?.lineColor ?? '50,50,50',
        lineStyle: schema.lineStyle?.lineStyle ?? 'solid',
      },
      fillStyle: schema.fillStyle
        ? { ...schema.fillStyle }
        : { type: 'solid', color: '255,255,255' },
      // 结构拷贝：实例原地写入（如文本编辑）不得污染注册表单例
      path: schema.path
        ? schema.path.map((sp) => (Array.isArray(sp) ? [...sp] : { ...sp, actions: [...sp.actions] }))
        : [[]],
      fontStyle: {
        fontFamily: schema.fontStyle?.fontFamily ?? DEFAULT_FONT_VALUE,
        size: schema.fontStyle?.size ?? DEFAULT_FONT_SIZE,
        color: schema.fontStyle?.color ?? '50,50,50',
        textAlign: schema.fontStyle?.textAlign ?? 'center',
        vAlign: schema.fontStyle?.vAlign ?? 'middle',
        bold: schema.fontStyle?.bold ?? false,
        italic: schema.fontStyle?.italic ?? false,
        underline: schema.fontStyle?.underline ?? false,
        orientation: schema.fontStyle?.orientation ?? 'horizontal',
      },
      textBlock: (schema.textBlock ?? [
        { position: { x: 10, y: 0, w: 'w-20', h: 'h' }, text: '' },
      ]).map((b) => ({ ...b, position: { ...b.position } })),
      anchors: (schema.anchors ?? [
        { x: 'w/2', y: 0 },
        { x: 'w/2', y: 'h' },
        { x: 0, y: 'h/2' },
        { x: 'w', y: 'h/2' },
      ]).map((a) => ({ ...a })),
    }
  }

  /**
   * 以 (cx, cy) 为中心创建元素实例
   */
  createElementAtCenter(shapeName: string, cx: number, cy: number): ElementInstance | null {
    const schema = this.getShape(shapeName)
    if (!schema) return null
    const w = schema.props?.w || 100
    const h = schema.props?.h || 60
    return this.createElement(shapeName, cx - w / 2, cy - h / 2)
  }
}

/** 全局单例 */
export const shapeRegistry = new ShapeRegistry()
