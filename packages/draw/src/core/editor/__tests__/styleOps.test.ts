import { describe, it, expect } from 'vitest'
import { convertFillStyle, linkerFont } from '../styleOps'
import { createLinkerInstance } from '../linker'

describe('convertFillStyle（仅 none/solid 两型）', () => {
  it('→ none 丢弃颜色', () => {
    expect(convertFillStyle({ type: 'solid', color: '255,0,0' }, 'none')).toEqual({ type: 'none' })
  })

  it('→ solid 已是纯色则保留颜色', () => {
    expect(convertFillStyle({ type: 'solid', color: '255,0,0' }, 'solid')).toEqual({
      type: 'solid',
      color: '255,0,0',
    })
  })

  it('none → solid 默认白底', () => {
    expect(convertFillStyle({ type: 'none' }, 'solid')).toEqual({
      type: 'solid',
      color: '255,255,255',
    })
  })

  it('无色 solid → solid 补白底', () => {
    expect(convertFillStyle({ type: 'solid' }, 'solid')).toEqual({
      type: 'solid',
      color: '255,255,255',
    })
  })

  it('gradient → solid 无 color 补白底（丢弃渐变残留字段）', () => {
    expect(
      convertFillStyle(
        { type: 'gradient', gradientType: 'linear', beginColor: '255,0,0', endColor: '0,0,255' },
        'solid',
      ),
    ).toEqual({ type: 'solid', color: '255,255,255' })
  })
})

describe('linkerFont（连线字体兜底）', () => {
  it('空 fontStyle 对象 → 各字段取 LINKER_FONT_DEFAULTS', () => {
    const linker = createLinkerInstance(
      { id: null, x: 0, y: 0, angle: null },
      { id: null, x: 100, y: 100, angle: null },
      0,
    )
    linker.fontStyle = {}
    expect(linkerFont(linker)).toEqual({
      fontFamily: 'yahei',
      size: 13,
      color: '50,50,50',
    })
  })
})
