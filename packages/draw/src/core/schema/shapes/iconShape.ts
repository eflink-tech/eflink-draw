// 图标形状构建器：把 scripts/gen-network-shapes.mjs 生成的紧凑 IconRaw 数据
// 展开为标准 ShapeDefinition（坐标 → 'w*因子' 表达式，resize 拉伸语义对齐旧版图片 stretch）。
import type { PathAction, ShapeDefinition } from '@/types'

export interface IconSegmentRaw {
  /** 指令流字符串："M225 137 C227 132 229 125 229 118 Z"，千分比整数（x 按视口宽、y 按高归一） */
  cmds: string
  /** multi 模式：'r,g,b' 或 'none'；mono 模式省略 */
  fill?: string
  stroke?: string
  sw?: number
  /** SVG fill-rule="evenodd"（图标内镂空），绘制时按偶奇绕序填充 */
  fr?: 'evenodd'
}

export interface IconRaw {
  n: string
  t: string
  c: string
  /** 面板二级分组（schema 原始子分类，如 cisco_routers） */
  g?: string
  w: number
  h: number
  /** fill=单色填充(跟随填充色) / stroke=单色描边(跟随边线色) / multi=多色锁定 */
  m: 'fill' | 'stroke' | 'multi'
  fc?: string
  lc?: string
  lw?: number
  segs: IconSegmentRaw[]
}

function decodeCmds(str: string): PathAction[] {
  const parts = str.match(/[MLCZ]|-?\d+/g)
  if (!parts) throw new Error(`IconRaw 指令流为空: ${str.slice(0, 40)}`)
  const out: PathAction[] = []
  for (let i = 0; i < parts.length; ) {
    const c = parts[i++]
    const num = () => Number(parts[i++]) / 1000
    if (c === 'M' || c === 'L') {
      const x = num(), y = num()
      out.push({ action: c === 'M' ? 'move' : 'line', x: `w*${x}`, y: `h*${y}` })
    } else if (c === 'C') {
      const x1 = num(), y1 = num(), x2 = num(), y2 = num(), x = num(), y = num()
      out.push({ action: 'curve', x1: `w*${x1}`, y1: `h*${y1}`, x2: `w*${x2}`, y2: `h*${y2}`, x: `w*${x}`, y: `h*${y}` })
    } else if (c === 'Z') {
      out.push({ action: 'close' })
    } else {
      throw new Error(`IconRaw 指令解析失败: ${c} @ ${str.slice(0, 40)}`)
    }
  }
  return out
}

const TEXT_BLOCK = [{ position: { x: 'w/2-70', y: 'h', w: 140, h: 28 }, text: '' }]

/** 单色模式路径：带 evenodd 的子路径需升级为带样式对象才能携带 fillRule */
function monoPath(segs: IconSegmentRaw[]) {
  return segs.map((s) => (s.fr ? { actions: decodeCmds(s.cmds), fillRule: 'evenodd' as const } : decodeCmds(s.cmds)))
}

export function buildIconShape(def: IconRaw): ShapeDefinition {
  let shape: ShapeDefinition
  if (def.m === 'fill') {
    shape = {
      name: def.n, title: def.t, category: def.c,
      props: { w: def.w, h: def.h },
      textBlock: TEXT_BLOCK,
      fillStyle: { type: 'solid', color: def.fc ?? '50,50,50' },
      lineStyle: { lineWidth: 0 },
      path: monoPath(def.segs),
    }
  } else if (def.m === 'stroke') {
    shape = {
      name: def.n, title: def.t, category: def.c,
      props: { w: def.w, h: def.h },
      textBlock: TEXT_BLOCK,
      fillStyle: { type: 'none' },
      lineStyle: { lineColor: def.lc ?? '50,50,50', lineWidth: def.lw ?? 1 },
      path: monoPath(def.segs),
    }
  } else {
    shape = {
      name: def.n, title: def.t, category: def.c,
      props: { w: def.w, h: def.h },
      textBlock: TEXT_BLOCK,
      fillStyle: { type: 'none' },
      lineStyle: { lineWidth: 0 },
      path: def.segs.map((s) => ({
        actions: decodeCmds(s.cmds),
        fillStyle: s.fill && s.fill !== 'none' ? { type: 'solid' as const, color: s.fill } : { type: 'none' as const },
        lineStyle: s.stroke && s.stroke !== 'none' && s.sw ? { lineWidth: s.sw, lineColor: s.stroke } : { lineWidth: 0 },
        ...(s.fr === 'evenodd' && { fillRule: 'evenodd' as const }),
      })),
    }
  }
  return shape
}
