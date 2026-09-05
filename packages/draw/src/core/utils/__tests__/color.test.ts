import { describe, it, expect } from 'vitest'
import { rgbToHex, hexToRgb, GRAY_PALETTE, COLOR_ROWS } from '../color'

describe('rgbToHex', () => {
  it('转换基本颜色', () => {
    expect(rgbToHex('255,0,0')).toBe('#ff0000')
    expect(rgbToHex('255,255,255')).toBe('#ffffff')
    expect(rgbToHex('0,0,0')).toBe('#000000')
  })

  it('补齐两位十六进制', () => {
    expect(rgbToHex('5,6,7')).toBe('#050607')
  })

  it('容忍逗号后空格', () => {
    expect(rgbToHex('255, 0, 0')).toBe('#ff0000')
  })

  it('越界值钳制到 0-255', () => {
    expect(rgbToHex('300,-5,0')).toBe('#ff0000')
  })
})

describe('hexToRgb', () => {
  it('6 位 HEX', () => {
    expect(hexToRgb('#ff0000')).toBe('255,0,0')
    expect(hexToRgb('00ff00')).toBe('0,255,0')
  })

  it('3 位 HEX 展开', () => {
    expect(hexToRgb('#f00')).toBe('255,0,0')
    expect(hexToRgb('#abc')).toBe('170,187,204')
  })

  it('非法输入返回 null', () => {
    expect(hexToRgb('#xyz')).toBeNull()
    expect(hexToRgb('#12345')).toBeNull()
    expect(hexToRgb('')).toBeNull()
    expect(hexToRgb('#1234567')).toBeNull()
  })
})

describe('色板数据', () => {
  it('灰阶 12 色', () => {
    expect(GRAY_PALETTE).toHaveLength(12)
    expect(GRAY_PALETTE[0]).toBe('255,255,255')
    expect(GRAY_PALETTE[11]).toBe('0,0,0')
  })

  it('彩色矩阵 9 行 12 列', () => {
    expect(COLOR_ROWS).toHaveLength(9)
    for (const row of COLOR_ROWS) expect(row).toHaveLength(12)
  })

  it('色值抽查', () => {
    expect(COLOR_ROWS[0]![0]).toBe('255,204,204')
    expect(COLOR_ROWS[4]![7]).toBe('0,127,255')
    expect(COLOR_ROWS[8]![11]).toBe('51,0,26')
    expect(COLOR_ROWS[2]![7]).toBe('102,178,255')
    expect(COLOR_ROWS[2]![11]).toBe('255,102,179')
  })
})
