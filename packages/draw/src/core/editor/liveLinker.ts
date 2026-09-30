// liveLinker 直操统一通道
// 连线拖拽（端点/线身/附着图形移动）期间不经 React 重绘：
import type { LinkerInstance } from '@/types'
import { getLinkerLabelNodes, getLinkerNode } from './nodeRegistry'
import { linkerTextAnchor } from './linkerText'

/** 标签段号：name='seg-N'（分段文字）→ N；其余（整线文字）→ undefined */
function segOfLabel(node: { name(): string }): number | undefined {
  const name = node.name()
  if (!name.startsWith('seg-')) return undefined
  const v = Number(name.slice(4))
  return Number.isFinite(v) ? v : undefined
}

/**
 * 写入/清除连线拖拽期间的实时数据，并同步标签位置与层重绘。
 * live 为 null（拖拽结束）时标签位置不回写——store 提交后 React 重渲染
 * 按锚点定位，且 LinkerLabel 的强制回位 effect 兜底（见其注释）。
 */
export function applyLiveLinker(
  id: string,
  live: LinkerInstance | null,
  opts?: { draw?: boolean },
): void {
  const node = getLinkerNode(id)
  node?.setAttr('liveLinker', live)
  if (live) {
    // 各标签按自己的锚点跟随 live 几何（整线/分段共用 linkerTextAnchor，
    // name='seg-N' 携带段号，拖拽过的 offset 随线身变化实时还原）
    for (const label of getLinkerLabelNodes(id)) {
      label.position(linkerTextAnchor(live, segOfLabel(label)))
    }
  }
  if (opts?.draw !== false) node?.getLayer()?.batchDraw()
}
