// ═══════════════════════════════════════════
// elec_plc_ladder 矢量数据（自动生成，勿手改）
// 生成: node scripts/gen-drawio-stencils.mjs
// 来源: scripts/drawio-stencils/（jgraph/drawio stencil XML → IconRaw，Apache 2.0）
// 运行时由 iconShape.buildIconShape 展开为 ShapeDefinition
// 体积大，只允许 networkLoader 经 netIconChunks 动态 import（勿在主入口静态引用）
// ═══════════════════════════════════════════
import type { ShapeDefinition } from '@/types'
import { buildIconShape, type IconRaw } from '../iconShape'

const raw: IconRaw[] = [{"n":"elec_plc_ladder_contact","t":"Contact","c":"elec_plc_ladder","g":"elec_plc_ladder","w":100,"h":50,"segs":[{"cmds":"M0 500 L300 500 M1000 500 L700 500 M300 0 L300 1000 M700 0 L700 1000"}],"m":"stroke","lc":"0,0,0","lw":1},{"n":"elec_plc_ladder_not_contact","t":"Not Contact","c":"elec_plc_ladder","g":"elec_plc_ladder","w":100,"h":50,"segs":[{"cmds":"M0 500 L300 500 M1000 500 L700 500 M300 0 L300 1000 M700 0 L700 1000 M300 1000 L700 0"}],"m":"stroke","lc":"0,0,0","lw":1},{"n":"elec_plc_ladder_not_output_1","t":"Not Output 1","c":"elec_plc_ladder","g":"elec_plc_ladder","w":100,"h":50,"segs":[{"cmds":"M350 0 C261 309 261 691 350 1000 M0 500 L280 500 M1000 500 L720 500 M650 0 C739 309 739 691 650 1000 M300 1000 L700 0"}],"m":"stroke","lc":"0,0,0","lw":1},{"n":"elec_plc_ladder_not_output_2","t":"Not Output 2","c":"elec_plc_ladder","g":"elec_plc_ladder","w":100,"h":50,"segs":[{"cmds":"M750 500 C750 776 638 1000 500 1000 C362 1000 250 776 250 500 C250 224 362 0 500 0 C638 0 750 224 750 500 Z","fill":"255,255,255","stroke":"0,0,0","sw":1},{"cmds":"M0 500 L250 500 M1000 500 L750 500 M300 1000 L700 0","fill":"255,255,255","stroke":"0,0,0","sw":1}],"m":"multi"},{"n":"elec_plc_ladder_output_1","t":"Output 1","c":"elec_plc_ladder","g":"elec_plc_ladder","w":100,"h":50,"segs":[{"cmds":"M350 0 C261 309 261 691 350 1000 M0 500 L280 500 M1000 500 L720 500 M650 0 C739 309 739 691 650 1000"}],"m":"stroke","lc":"0,0,0","lw":1},{"n":"elec_plc_ladder_output_2","t":"Output 2","c":"elec_plc_ladder","g":"elec_plc_ladder","w":100,"h":50,"segs":[{"cmds":"M750 500 C750 776 638 1000 500 1000 C362 1000 250 776 250 500 C250 224 362 0 500 0 C638 0 750 224 750 500 Z","fill":"255,255,255","stroke":"0,0,0","sw":1},{"cmds":"M0 500 L250 500 M1000 500 L750 500","fill":"none","stroke":"0,0,0","sw":1}],"m":"multi"}]

export const shapes: ShapeDefinition[] = raw.map(buildIconShape)
