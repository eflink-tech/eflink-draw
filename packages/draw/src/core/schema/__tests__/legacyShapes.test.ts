// 旧 Schema 分类移植（scripts/gen-legacy-shapes.mjs）的落地断言
import { describe, it, expect } from 'vitest'
import type { ShapeDefinition } from '@/types'
import { shapeRegistry } from '@/core/schema/registry'
import { legacyShapes } from '@/core/schema/shapes/legacy'
import { SHAPE_CATEGORIES } from '@/store/uiStore'
import '@/core/schema/shapes'

const BPMN_GROUPS = ['bpmn_start', 'bpmn_intermediate', 'bpmn_boundary', 'bpmn_end', 'bpmn_task', 'bpmn_sub', 'bpmn_gateway', 'bpmn_data', 'bpmn_collab', 'bpmn_misc']
const MOBILE_GROUPS = ['mobile_ios_control', 'mobile_ios_element', 'mobile_ios_device', 'mobile_and_control', 'mobile_and_element', 'mobile_and_device']
/** 线框素材里的纯文字元素：本体是隐形矩形，只有文案 */
const TEXT_ONLY_SHAPES = new Set(['ios7Heading1', 'ios7Heading2', 'ios7TextLabel', 'ios7Label', 'andriodHeading1', 'andriodHeading2', 'andriodTextLabel'])

describe('旧 Schema 移植图形', () => {
  it('全部注册进 shapeRegistry，名称不重复', () => {
    expect(legacyShapes.length).toBe(192)
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

  it('BPMN / 移动端图形带面板二级分组，其余分类不分组', () => {
    const byCat = (cat: string) => legacyShapes.filter((s) => s.category === cat)
    expect(byCat('bpmn').length).toBe(90)
    expect(byCat('mobile').length).toBe(57)
    for (const shape of [...byCat('bpmn'), ...byCat('mobile')]) expect(shape.groupName, shape.name).toBeTruthy()
    for (const shape of byCat('bpmn')) expect(BPMN_GROUPS, `${shape.name} → ${shape.group}`).toContain(shape.group)
    for (const shape of byCat('mobile')) expect(MOBILE_GROUPS, `${shape.name} → ${shape.group}`).toContain(shape.group)
    for (const shape of legacyShapes.filter((s) => s.category !== 'bpmn' && s.category !== 'mobile')) {
      expect(shape.group, shape.name).toBeUndefined()
    }
  })

  it('旧素材用位图表达的细节已重画为矢量（开关滑块、勾选、放大镜、键盘按键）', () => {
    const subs = (name: string) => shapeRegistry.getShape(name)!.path.length
    expect(subs('ios7SwitchOn'), '轨道 + 滑块').toBe(2)
    expect(subs('andriodCheck'), '方框 + 对勾').toBeGreaterThanOrEqual(3)
    expect(subs('andriodSlider'), '两段轨道 + 圆形滑块').toBe(3)
    expect(subs('ios7Keyboard'), '逐键矢量').toBeGreaterThan(25)
    expect(subs('andriodInput'), '逐键矢量').toBeGreaterThan(25)
    // 状态栏的 5 个信号点 + 电池三件 + 底板
    expect(subs('ios7StatusDark'), '信号点 + 电池').toBe(9)
  })

  it('移动端图形在白画布上看得见：有描边或非白填充（旧素材靠设备底图反衬）', () => {
    const hasInk = (s: ShapeDefinition) =>
      s.path.some((p) => {
        const seg = Array.isArray(p) ? undefined : p
        const width = seg?.lineStyle?.lineWidth ?? s.lineStyle?.lineWidth ?? 1.5
        if (width > 0) return true
        const fill = seg?.fillStyle ?? s.fillStyle
        return fill?.type === 'solid' && !!fill.color && fill.color !== '255,255,255'
      })
    for (const shape of legacyShapes.filter((s) => s.category === 'mobile')) {
      expect(hasInk(shape) || TEXT_ONLY_SHAPES.has(shape.name), `${shape.name} 无形体`).toBe(true)
    }
    // 标题/文本/标签本就是纯文字，靠面板缩略图绘制默认文案才认得出
    for (const name of TEXT_ONLY_SHAPES) {
      const shape = shapeRegistry.getShape(name)!
      expect(hasInk(shape), name).toBe(false)
      expect(shape.textBlock?.some((b) => b.text.trim()), name).toBe(true)
    }
  })

  it('移动端默认尺寸收敛到画布常用尺度（旧素材是真机截图像素，拖出来比常规矩形还大）', () => {
    const mobile = legacyShapes.filter((s) => s.category === 'mobile')
    const screenW: Record<string, number> = {
      mobile_ios_control: 210,
      mobile_ios_element: 210,
      mobile_ios_device: 210,
      mobile_and_control: 270,
      mobile_and_element: 270,
      mobile_and_device: 270,
    }
    for (const shape of mobile) {
      const { w, h } = shape.props ?? {}
      expect(typeof w, shape.name).toBe('number')
      expect(typeof h, shape.name).toBe('number')
      // 通栏元素不得超出所属平台的屏幕宽度
      expect(w!, `${shape.name} 宽 ${w}`).toBeLessThanOrEqual(screenW[shape.group!])
      // 独立控件（按钮 / 输入框 / 开关）不该有半屏宽
      if (shape.group!.endsWith('_control')) {
        expect(w! <= 160 && h! <= 40, `${shape.name} ${w}×${h}`).toBe(true)
      }
      // 文字不会自适应缩小：字号必须放得进框子，否则会溢出到隔壁图形上
      if (shape.textBlock?.some((b) => b.text.trim())) {
        const size = shape.fontStyle?.size ?? 13
        expect(size, shape.name).toBeGreaterThanOrEqual(10)
        expect(size, `${shape.name} 字号 ${size} / 高 ${h}`).toBeLessThanOrEqual(h!)
      }
    }
    // 通栏元素与设备底图同宽，叠上去才对得齐
    expect(mobile.find((s) => s.name === 'ios7Nav')!.props!.w).toBe(210)
    expect(mobile.find((s) => s.name === 'andriodTitle1')!.props!.w).toBe(270)
  })

  it('移动端残留的英文示例文案已中文化', () => {
    const texts = legacyShapes
      .filter((s) => s.category === 'mobile')
      .flatMap((s) => (s.textBlock ?? []).map((b) => b.text))
      .join('|')
    expect(texts).not.toMatch(/Button|Title|Search|Menu A|Single line item|List Item|This is a Dialog|Cancel|Save/)
  })

  it('新分类都出现在左侧面板，且标题为中文', () => {
    const panels = new Map(SHAPE_CATEGORIES.map((c) => [c.id, c.children?.map((ch) => ch.id) ?? []]))
    for (const cat of ['er', 'org', 'venn', 'epc', 'evc', 'weizhu_bm']) {
      expect(panels.has(cat), cat).toBe(true)
    }
    expect(panels.get('mobile')).toEqual(MOBILE_GROUPS)
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
