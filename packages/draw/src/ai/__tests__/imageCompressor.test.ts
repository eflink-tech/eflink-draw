// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { compressImage } from '../imageCompressor'

// Mock canvas for Node.js environment
function createMockImage(width: number, height: number): HTMLImageElement {
  const img = document.createElement('img')
  Object.defineProperty(img, 'naturalWidth', { value: width })
  Object.defineProperty(img, 'naturalHeight', { value: height })
  return img
}

// Mock HTMLCanvasElement APIs (jsdom 没有 canvas 原生实现)
function setupCanvasMock() {
  const drawImageMock = vi.fn()
  const getContextMock = vi.fn().mockReturnValue({ drawImage: drawImageMock })
  const toDataURLMock = vi.fn().mockReturnValue('data:image/jpeg;base64,/9j/4AAQ')

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
    getContextMock as unknown as typeof HTMLCanvasElement.prototype.getContext,
  )
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(
    toDataURLMock as unknown as typeof HTMLCanvasElement.prototype.toDataURL,
  )

  return { drawImageMock, getContextMock, toDataURLMock }
}

describe('compressImage', () => {
  let mocks: ReturnType<typeof setupCanvasMock>

  beforeEach(() => {
    vi.restoreAllMocks()
    mocks = setupCanvasMock()
  })

  it('长边 > 1536px 时缩放至 1536px', async () => {
    const img = createMockImage(3000, 2000)
    const result = await compressImage(img)
    // 长边 3000 → 1536，短边等比 2000 → 1024
    expect(result.width).toBe(1536)
    expect(result.height).toBe(1024)
  })

  it('长边 <= 1536px 时保持原尺寸', async () => {
    const img = createMockImage(1000, 800)
    const result = await compressImage(img)
    expect(result.width).toBe(1000)
    expect(result.height).toBe(800)
  })

  it('返回 base64 JPEG 格式', async () => {
    mocks.toDataURLMock.mockReturnValue('data:image/jpeg;base64,/9j/4AAQ')
    const img = createMockImage(800, 600)
    const result = await compressImage(img)
    expect(result.base64).toMatch(/^data:image\/jpeg;base64,/)
  })

  it('竖图按高度缩放', async () => {
    const img = createMockImage(1000, 3000)
    const result = await compressImage(img)
    // 长边 3000 → 1536，短边等比 1000 → 512
    expect(result.width).toBe(512)
    expect(result.height).toBe(1536)
  })

  it('自定义 maxSize 参数生效', async () => {
    const img = createMockImage(2000, 1500)
    const result = await compressImage(img, 500)
    // 长边 2000 → 500，短边等比 1500 → 375
    expect(result.width).toBe(500)
    expect(result.height).toBe(375)
  })

  it('drawImage 使用正确的缩放尺寸调用', async () => {
    const img = createMockImage(3000, 2000)
    await compressImage(img)
    expect(mocks.drawImageMock).toHaveBeenCalledTimes(1)
    expect(mocks.drawImageMock).toHaveBeenCalledWith(img, 0, 0, 1536, 1024)
  })

  it('toDataURL 使用正确的 quality 参数调用', async () => {
    const img = createMockImage(800, 600)
    await compressImage(img, 1536, 0.5)
    expect(mocks.toDataURLMock).toHaveBeenCalledWith('image/jpeg', 0.5)
  })

  it('quality 超出范围时抛出错误', () => {
    const img = createMockImage(800, 600)
    expect(() => compressImage(img, 1536, 1.5)).toThrow(/quality/)
    expect(() => compressImage(img, 1536, -0.1)).toThrow(/quality/)
  })

  it('maxSize 非正数时抛出错误', () => {
    const img = createMockImage(800, 600)
    expect(() => compressImage(img, 0)).toThrow(/maxSize/)
    expect(() => compressImage(img, -100)).toThrow(/maxSize/)
  })

  it('getContext 返回 null 时抛出错误', () => {
    mocks.getContextMock.mockReturnValueOnce(null)
    const img = createMockImage(800, 600)
    expect(() => compressImage(img)).toThrow(/2D/)
  })
})
