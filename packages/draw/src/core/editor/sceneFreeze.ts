// 拖动/缩放期间冻结静态图形：cache 光栅化 sceneFunc，被拖节点保持矢量直操。
// 连线 Shape 无宽高，Konva cache 会跳过并刷 error，故不 cache 连线。
import type Konva from 'konva'
import { forEachElementNode } from './nodeRegistry'

function cachePixelRatio(): number {
  if (typeof window === 'undefined') return 1
  return Math.min(2, window.devicePixelRatio || 1)
}

let cachedNodes: Konva.Node[] = []

export function freezeStaticScene(opts: {
  movingShapeIds: Iterable<string>
  liveLinkerIds?: Iterable<string>
}): void {
  if (cachedNodes.length > 0) return
  const moving = new Set(opts.movingShapeIds)
  const pixelRatio = cachePixelRatio()

  forEachElementNode((id, node) => {
    if (moving.has(id)) return
    try {
      node.cache({ pixelRatio })
      cachedNodes.push(node)
    } catch {
      // 尚未挂到 stage / 尺寸为 0 时跳过，不影响手势
    }
  })
}

export function unfreezeStaticScene(): void {
  for (const node of cachedNodes) {
    try {
      node.clearCache()
    } catch {
      /* 节点可能已卸载 */
    }
  }
  cachedNodes = []
}
