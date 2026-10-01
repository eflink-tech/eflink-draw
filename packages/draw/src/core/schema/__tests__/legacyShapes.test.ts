// 旧 Schema 分类移植（scripts/gen-legacy-shapes.mjs）的落地断言
import { describe, it, expect } from 'vitest'
import type { ShapeDefinition } from '@/types'
import { shapeRegistry } from '@/core/schema/registry'
import { legacyShapes } from '@/core/schema/shapes/legacy'
import { SHAPE_CATEGORIES } from '@/store/uiStore'
import '@/core/schema/shapes'

const BPMN_GROUPS = ['bpmn_start', 'bpmn_intermediate', 'bpmn_boundary', 'bpmn_end', 'bpmn_task', 'bpmn_sub', 'bpmn_gateway', 'bpmn_data', 'bpmn_collab', 'bpmn_misc']
const MOBILE_GROUPS = ['mobile_ios_control', 'mobile_ios_element', 'mobile_ios_device', 'mobile_ios_icon', 'mobile_and_control', 'mobile_and_element', 'mobile_and_device', 'mobile_and_icon']
/** 旧素材本就是矢量路径、沿用原样式的 iOS 图标（四个方向箭头） */
const ICON_AS_IS = new Set(['ios7ArrowUp', 'ios7ArrowDown', 'ios7ArrowLeft', 'ios7ArrowRight'])
/** 线框素材里的纯文字元素：本体是隐形矩形，只有文案 */
const TEXT_ONLY_SHAPES = new Set(['ios7Heading1', 'ios7Heading2', 'ios7TextLabel', 'ios7Label', 'andriodHeading1', 'andriodHeading2', 'andriodTextLabel'])

describe('旧 Schema 移植图形', () => {
  it('全部注册进 shapeRegistry，名称不重复', () => {
    expect(legacyShapes.length).toBe(337)
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
    expect(byCat('mobile').length).toBe(202)
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
    expect(subs('andriodCheck'), '方框 + 对勾').toBe(2)
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
      mobile_ios_icon: 40,
      mobile_and_control: 270,
      mobile_and_element: 270,
      mobile_and_device: 270,
      mobile_and_icon: 40,
    }
    for (const shape of mobile) {
      const { w, h } = shape.props ?? {}
      expect(typeof w, shape.name).toBe('number')
      expect(typeof h, shape.name).toBe('number')
      // 通栏元素不得超出所属平台的屏幕宽度
      expect(w!, `${shape.name} 宽 ${w}`).toBeLessThanOrEqual(screenW[shape.group!])
      // 独立控件（按钮 / 输入框 / 开关）不该有半屏宽（按钮定档 84×50，高度上限放宽到 60）；
      // 单选组是「圆 + 文字」三项横排的组合图形，宽度按通栏元素只受屏宽上限约束
      const isGroup = shape.name === 'andriodRadio'
      if (shape.group!.endsWith('_control') && !isGroup) {
        expect(w! <= 160 && h! <= 60, `${shape.name} ${w}×${h}`).toBe(true)
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

  it('iOS 图标重画为单色墨迹：颜色只写在图形级，子路径不写死（面板改填充色即整体换色）', () => {
    const icons = legacyShapes.filter((s) => s.group === 'mobile_ios_icon')
    expect(icons.length).toBe(59)
    for (const shape of icons) {
      if (ICON_AS_IS.has(shape.name)) continue
      expect(shape.fillStyle?.type, shape.name).toBe('solid')
      expect(shape.fillStyle?.color, shape.name).toBeTruthy()
      expect(shape.lineStyle?.lineWidth, `${shape.name} 墨迹图标不描边`).toBe(0)
      for (const p of shape.path) {
        expect(Array.isArray(p) ? undefined : p.fillStyle, `${shape.name} 子路径写死填充色`).toBeUndefined()
        expect(Array.isArray(p) ? undefined : p.lineStyle, `${shape.name} 子路径写死线样式`).toBeUndefined()
      }
    }
    // 反白符号改成同子路径的 evenodd 镂空（旧观感靠 PNG 里的白像素）
    const hollowed = icons.filter((s) => s.path.some((p) => !Array.isArray(p) && p.fillRule === 'evenodd'))
    expect(hollowed.length).toBeGreaterThanOrEqual(20)
    for (const name of ['ios7AddBlack', 'ios7Check2', 'ios7Profile', 'ios7Close3']) {
      expect(hollowed.map((s) => s.name), name).toContain(name)
    }
  })

  it('Android 图标同样重画为单色墨迹（86 个位图图标全部转矢量，无一残留图片填充）', () => {
    const icons = legacyShapes.filter((s) => s.group === 'mobile_and_icon')
    expect(icons.length).toBe(86)
    for (const shape of icons) {
      expect(shape.fillStyle?.type, shape.name).toBe('solid')
      expect(shape.fillStyle?.color, shape.name).toBeTruthy()
      expect(shape.lineStyle?.lineWidth, `${shape.name} 墨迹图标不描边`).toBe(0)
      for (const p of shape.path) {
        expect(Array.isArray(p) ? undefined : p.fillStyle, `${shape.name} 子路径写死填充色`).toBeUndefined()
        expect(Array.isArray(p) ? undefined : p.lineStyle, `${shape.name} 子路径写死线样式`).toBeUndefined()
      }
      // 旧素材是 40×40 透明框里摆 29×29 的字形，默认尺寸按字形本体给
      expect(shape.props, shape.name).toEqual({ w: 29, h: 29 })
    }
    const hollowed = icons.filter((s) => s.path.some((p) => !Array.isArray(p) && p.fillRule === 'evenodd'))
    expect(hollowed.length).toBeGreaterThanOrEqual(15)
    for (const name of ['andriod_icons_alert1', 'andriod_icons_73', 'andriod_icons_27']) {
      expect(hollowed.map((s) => s.name), name).toContain(name)
    }
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
