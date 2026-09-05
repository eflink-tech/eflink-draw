// src/ai/__tests__/fitToPage.test.ts
import { describe, it, expect } from 'vitest'
import { computeFitToPage, FIT_PAGE_MARGIN } from '../fitToPage'
import {
  createEmptyDocument,
  createDefaultPageConfig,
  type ElementInstance,
  type LinkerInstance,
} from '@/types'

/** 构造矩形元素实例（仅 bbox 相关字段有意义） */
function makeElement(id: string, x: number, y: number, w = 120, h = 60): ElementInstance {
  return {
    id,
    name: 'rect',
    props: { x, y, w, h, zindex: 0, angle: 0 },
  } as unknown as ElementInstance
}

/** 构造连线实例（from/to + 折点均为画布绝对坐标） */
function makeLinker(
  id: string,
  from: { x: number; y: number },
  to: { x: number; y: number },
  points: Array<{ x: number; y: number }> = [],
): LinkerInstance {
  return {
    id,
    name: 'linker',
    from: { id: 'a', ...from, angle: 0 },
    to: { id: 'b', ...to, angle: 0 },
    points,
  } as unknown as LinkerInstance
}

/** 构造带指定 page 尺寸与元素的文档 */
function makeDoc(
  elements: Array<ElementInstance | LinkerInstance>,
  page?: Partial<{ width: number; height: number }>,
) {
  return {
    page: createDefaultPageConfig(page),
    elements: Object.fromEntries(elements.map((el) => [el.id, el])),
  } as ReturnType<typeof createEmptyDocument>
}

describe('computeFitToPage', () => {
  it('addedIds 为空时不做任何调整', () => {
    const doc = makeDoc([])
    expect(computeFitToPage(doc, [])).toEqual({ dx: 0, dy: 0, pagePatch: {} })
  })

  it('ids 均不存在于文档时忽略', () => {
    const doc = makeDoc([])
    expect(computeFitToPage(doc, ['ghost'])).toEqual({ dx: 0, dy: 0, pagePatch: {} })
  })

  it('偏离中心的元素平移到页面中心（1600x1200）', () => {
    // 元素 (100,100,120,60) 中心 (160,130) → 页中心 (800,600)：dx=640, dy=470
    const doc = makeDoc([makeElement('e1', 100, 100)])
    expect(computeFitToPage(doc, ['e1'])).toEqual({
      dx: 640,
      dy: 470,
      pagePatch: {},
    })
  })

  it('已居中的内容不平移、不扩页', () => {
    // 中心恰在页中心 (800,600)：x = 800-60, y = 600-30
    const doc = makeDoc([makeElement('e1', 740, 570)])
    expect(computeFitToPage(doc, ['e1'])).toEqual({ dx: 0, dy: 0, pagePatch: {} })
  })

  it('局部超出画布（右上角）居中后不再超出，无需扩页', () => {
    // 元素 (1500,0,100,100)：宽 100 < 1600-2*margin，居中即可
    const doc = makeDoc([makeElement('e1', 1500, 0, 100, 100)])
    const fit = computeFitToPage(doc, ['e1'])
    expect(fit.pagePatch).toEqual({})
    // 平移后中心 = (800,600)
    expect(fit.dx).toBe(800 - 1550)
    expect(fit.dy).toBe(600 - 50)
  })

  it('内容宽超出页面时扩页，并按扩页后的新中心居中', () => {
    // 元素 (0,100,1700,60)：宽 1700 > 1600 → targetW = ceil(1700+2*60) = 1820
    const doc = makeDoc([makeElement('e1', 0, 100, 1700, 60)])
    const fit = computeFitToPage(doc, ['e1'])
    expect(fit.pagePatch).toEqual({ width: 1820 })
    // 新中心 x = 910，内容中心 x = 850 → dx = 60；y 不扩页按原中心
    expect(fit.dx).toBe(60)
    expect(fit.dy).toBe(600 - 130)
  })

  it('连线端点/折点参与包围盒计算', () => {
    // 元素在页内，但连线折点伸到 x=1900 超出页宽
    const doc = makeDoc([
      makeElement('e1', 100, 100),
      makeLinker('l1', { x: 220, y: 130 }, { x: 1900, y: 300 }, [
        { x: 1900, y: 130 },
      ]),
    ])
    const fit = computeFitToPage(doc, ['e1', 'l1'])
    // bbox: x 100..1900 (w=1800 > 1600 → targetW = 1920), y 100..300
    expect(fit.pagePatch).toEqual({ width: 1920 })
    // 新中心 x = 960，内容中心 x = 1000 → dx = -40
    expect(fit.dx).toBe(-40)
  })

  it('页面尺寸不因居中缩小（内容小于页面时保持原尺寸）', () => {
    const doc = makeDoc([makeElement('e1', 100, 100)])
    const fit = computeFitToPage(doc, ['e1'])
    expect(fit.pagePatch).toEqual({})
  })

  it(`默认边距为 ${FIT_PAGE_MARGIN}px`, () => {
    expect(FIT_PAGE_MARGIN).toBe(60)
  })
})
