// 自动生成: node scripts/gen-legacy-shapes.mjs（勿手改）
import type { ShapeDefinition } from '@/types'
import { bpmnLegacyShapes } from './bpmn'
import { erLegacyShapes } from './er'
import { epcLegacyShapes } from './epc'
import { evcLegacyShapes } from './evc'
import { vennLegacyShapes } from './venn'
import { orgLegacyShapes } from './org'
import { weizhuBmLegacyShapes } from './weizhuBm'

/** 旧 Schema 分类移植过来的图形，由 shapes/index.ts 统一注册 */
export const legacyShapes: ShapeDefinition[] = [
  ...bpmnLegacyShapes,
  ...erLegacyShapes,
  ...epcLegacyShapes,
  ...evcLegacyShapes,
  ...vennLegacyShapes,
  ...orgLegacyShapes,
  ...weizhuBmLegacyShapes,
]
