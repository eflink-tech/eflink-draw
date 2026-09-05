// 路径动作执行器（ElementRenderer 描路径 / 面板预览 / 命中检测共用）
import type { PathAction, PathDefinition } from '@/types'
import { evaluateExpression } from './expression'

/** 从 PathDefinition 取出动作数组 */
export function getPathActions(segment: PathDefinition): PathAction[] {
  return Array.isArray(segment) ? segment : segment.actions
}

/** 归一化为 StyledPathSegment（纯数组视为仅含 actions） */
export function parsePathSegment(segment: PathDefinition) {
  return Array.isArray(segment) ? { actions: segment } : segment
}

/** 执行单个路径动作（坐标表达式按 {w,h} 求值） */
export function executePathAction(
  context: {
    moveTo: (x: number, y: number) => void
    lineTo: (x: number, y: number) => void
    bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => void
    quadraticCurveTo: (cpx: number, cpy: number, x: number, y: number) => void
    closePath: () => void
  },
  action: PathAction,
  ctx: { w: number; h: number },
) {
  const e = (dim: number | string) => evaluateExpression(dim, ctx)

  switch (action.action) {
    case 'move':
      context.moveTo(e(action.x), e(action.y))
      break
    case 'line':
      context.lineTo(e(action.x), e(action.y))
      break
    case 'curve':
      context.bezierCurveTo(
        e(action.x1), e(action.y1),
        e(action.x2), e(action.y2),
        e(action.x), e(action.y),
      )
      break
    case 'quadraticCurve':
      context.quadraticCurveTo(
        e(action.x1), e(action.y1),
        e(action.x), e(action.y),
      )
      break
    case 'close':
      context.closePath()
      break
  }
}

export function traceActions(
  context: Parameters<typeof executePathAction>[0],
  path: PathDefinition[],
  dims: { w: number; h: number },
): void {
  for (const subPath of path) {
    for (const action of getPathActions(subPath)) {
      executePathAction(context, action, dims)
    }
  }
}
