// liveLinker 直操统一通道
// 连线拖拽（端点/线身/附着图形移动）期间不经 React 重绘：
import type { LinkerInstance } from '@/types'
import { getLinkerLabelNodes, getLinkerNode } from './nodeRegistry'
import { getLinkerMidpoint } from './linkerDraw'

/**
 * 写入/清除连线拖拽期间的实时数据，并同步标签位置与层重绘。
 * live 为 null（拖拽结束）时标签位置不回写——store 提交后 React 重渲染按 props 定位。
 */
export function applyLiveLinker(
  id: string,
  live: LinkerInstance | null,
  opts?: { draw?: boolean },
): void {
  const node = getLinkerNode(id)
  node?.setAttr('liveLinker', live)
  if (live) {
    // 命名约定：name='seg' 的标签为分段文字（跟随所在段中点），
    // 其余（整线文字）跟随 textPos/中点
    const mid = live.textPos ?? getLinkerMidpoint(live)
    for (const node of getLinkerLabelNodes(id)) {
      node.position(node.name() === 'seg' ? getLinkerMidpoint(live) : mid)
    }
  }
  if (opts?.draw !== false) node?.getLayer()?.batchDraw()
}
