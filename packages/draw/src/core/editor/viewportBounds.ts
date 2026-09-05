// src/core/editor/viewportBounds.ts
// 画布视口平移边界与滚动条滑块的计算（纯函数，供 Canvas.tsx 使用）
import { isLinker, type ElementInstance, type LinkerInstance } from '@/types'

/**
 * 计算全部元素（含连线端点/折点）的世界坐标包围盒；无元素返回空盒。
 * 元素画在页面矩形之外（工作区）时，滚动边界需要容纳它们。
 */
export function getContentWorldBounds(
  elements: Record<string, ElementInstance | LinkerInstance>,
): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  const visit = (x: number, y: number, x2 = x, y2 = y) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x2)
    maxY = Math.max(maxY, y2)
  }
  for (const el of Object.values(elements)) {
    if (isLinker(el)) {
      visit(el.from.x, el.from.y)
      visit(el.to.x, el.to.y)
      for (const p of el.points) visit(p.x, p.y)
    } else {
      visit(el.props.x, el.props.y, el.props.x + el.props.w, el.props.y + el.props.h)
    }
  }
  if (!Number.isFinite(minX)) return { minX: 0, minY: 0, maxX: 0, maxY: 0 }
  return { minX, minY, maxX, maxY }
}

export interface ScrollWorld {
  /** 内容世界范围（已并入页面矩形） */
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export interface ScrollBounds {
  /** viewport.x/y 允许范围（屏幕像素，stage 平移量） */
  hMinVx: number
  hMaxVx: number
  vMinVy: number
  vMaxVy: number
  /** 滑块可滚动行程（屏幕像素） */
  hRange: number
  vRange: number
}

/**
 * 计算视口平移边界。
 *
 * 以「内容中心对准视口中心」的平移量为基准，可滚动行程 =
 * 内容超出视口的量 + 两端 `pad` 边距。放大后向内滚到头即到达内容真实
 * 边缘（而非把内容大部分推出视口外）；内容不超出视口时，行程固定为
 * 两端边距，内容可在视口内小幅平移。
 *
 * @param viewW viewH 视口尺寸（屏幕像素）
 * @param world 内容世界范围（须已并入页面矩形）
 * @param scale 当前缩放
 * @param pad  两端衬板边距（屏幕像素；默认 1000，对齐旧 ProcessOn pageMargin）
 */
export function getScrollBounds(
  viewW: number,
  viewH: number,
  world: ScrollWorld,
  scale: number,
  pad = 1000,
): ScrollBounds {
  const spanW = (world.maxX - world.minX) * scale
  const spanH = (world.maxY - world.minY) * scale
  // 内容中心对准视口中心时 viewport 的平移量
  const hCenterVx = viewW / 2 - ((world.minX + world.maxX) / 2) * scale
  const vCenterVy = viewH / 2 - ((world.minY + world.maxY) / 2) * scale
  // 可滚动行程：内容超出视口的量 + 两端边距（至少为两端边距）
  const hRange = Math.max(0, spanW - viewW + 2 * pad)
  const vRange = Math.max(0, spanH - viewH + 2 * pad)
  return {
    hMinVx: hCenterVx - hRange / 2,
    hMaxVx: hCenterVx + hRange / 2,
    vMinVy: vCenterVy - vRange / 2,
    vMaxVy: vCenterVy + vRange / 2,
    hRange,
    vRange,
  }
}

/**
 * 滚动条滑块位置 ← viewport 平移量（screen 像素）。
 *
 * 关键方向约定：世界坐标 world = (screen − vp)/scale，vp 越小显示的内容世界越靠右，
 * 所以「滚动条 thumb 在轨道右端」应对应 vp 最小（看到内容右侧）。
 * 即 thumb 位置与 vp 成反比，与可见内容的范围成正比。
 *
 * @param minVp 看到内容最右时的 vp（hMinVx / vMinVy）
 * @param maxVp 看到内容最左时的 vp（hMaxVx / vMaxVy）
 * @param vp    当前 viewport 平移量
 * @param trackLen thumb 可动长度（轨道 − thumb）
 */
export function thumbPosFromVp(minVp: number, maxVp: number, vp: number, trackLen: number): number {
  if (maxVp === minVp) return 0
  return ((maxVp - vp) / (maxVp - minVp)) * trackLen
}

/** thumbPosFromVp 的逆映射：thumb 位置 → viewport 平移量 */
export function vpFromThumbPos(minVp: number, maxVp: number, pos: number, trackLen: number): number {
  if (trackLen === 0) return (minVp + maxVp) / 2
  return maxVp - (pos / trackLen) * (maxVp - minVp)
}