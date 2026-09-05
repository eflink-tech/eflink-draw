export interface CompressedImage {
  base64: string
  width: number
  height: number
}

export function compressImage(
  img: HTMLImageElement,
  maxSize: number = 1536,
  quality: number = 0.85,
): Promise<CompressedImage> {
  // 输入校验
  if (typeof quality !== 'number' || quality < 0 || quality > 1) {
    throw new Error(`quality 必须在 [0, 1] 范围内，收到: ${quality}`)
  }
  if (typeof maxSize !== 'number' || maxSize <= 0) {
    throw new Error(`maxSize 必须是正数，收到: ${maxSize}`)
  }

  const { naturalWidth, naturalHeight } = img
  let width = naturalWidth
  let height = naturalHeight

  // 长边缩放至 maxSize
  const longSide = Math.max(width, height)
  if (longSide > maxSize) {
    const scale = maxSize / longSide
    width = Math.round(width * scale)
    height = Math.round(height * scale)
  }

  // 创建 canvas 绘制
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('无法获取 canvas 2D 上下文')
  }
  ctx.drawImage(img, 0, 0, width, height)

  // 转 JPEG base64
  const base64 = canvas.toDataURL('image/jpeg', quality)

  return Promise.resolve({ base64, width, height })
}
