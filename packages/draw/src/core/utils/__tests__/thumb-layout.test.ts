// 全量面板图标布局断言：墨迹必须落在画布内（防裁切）且居中（防偏移）
import { describe, it, expect } from 'vitest'
import { shapeRegistry } from '@/core/schema/registry'
import { computeThumbLayout, pathInkBounds } from '../shapeThumb'
import type { ElementInstance } from '@/types'
import '@/core/schema/shapes'

const SIZE = 30
const TOL = 0.6 // 描边半径 + 量测采样容差

describe('面板图标布局（全图形）', () => {
  const names = shapeRegistry.getShapeNames ? [] : []
  void names

  it('所有注册图形：墨迹完全落在画布内且水平垂直居中', () => {
    const problems: string[] = []
    const schemas = shapeRegistry
      .getCategories()
      .flatMap((c) => shapeRegistry.getShapesByCategory(c))
    for (const schema of schemas) {
      if (schema.name === 'text') continue // fillText 文字图形走特殊分支
      const layout = computeThumbLayout(schema, SIZE)
      const ink = pathInkBounds(
        schema.drawIcon ? schema.drawIcon(layout.w, layout.h) : schema.path ?? [],
        layout.w,
        layout.h,
      )
      const left = layout.offsetX + ink.minX
      const right = layout.offsetX + ink.maxX
      const top = layout.offsetY + ink.minY
      const bottom = layout.offsetY + ink.maxY
      if (left < -TOL || top < -TOL || right > SIZE + TOL || bottom > SIZE + TOL) {
        problems.push(`${schema.name}: 越界 left=${left.toFixed(1)} top=${top.toFixed(1)} right=${right.toFixed(1)} bottom=${bottom.toFixed(1)}`)
      }
      const offX = (left + right) / 2 - SIZE / 2
      const offY = (top + bottom) / 2 - SIZE / 2
      if (Math.abs(offX) > 1.5 || Math.abs(offY) > 1.5) {
        problems.push(`${schema.name}: 偏移 offX=${offX.toFixed(1)} offY=${offY.toFixed(1)}`)
      }
    }
    expect(problems, `\n${problems.join('\n')}`).toEqual([])
  })
})

// ElementInstance 引用占位（避免未使用告警的临时类型引用）
export type _EI = ElementInstance
