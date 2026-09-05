// 手动路由连线端段拉伸测试
import { describe, it, expect } from 'vitest'
import type { ElementInstance, LinkerInstance, DocumentData } from '@/types'
import { createEmptyDocument, isLinker } from '@/types'
import { stretchManualPoints, resetManualRoute } from '../manualRoute'
import { createLinkerInstance } from '../linker'
import { routeAttachedLinkers } from '../documentOps'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'

// 返回类型用 LinkerInstance['from']（angle 必为 number），可协变赋给 LinkerEndpoint
const ep = (id: string | null, x: number, y: number, angle = 0): LinkerInstance['from'] => ({
  id,
  x,
  y,
  angle,
})

/** Z 形手动连线：a(0,30)左锚点 → (150,30)→(150,200)→(470,200) → b(500,200)左锚点 */
function manualZ(): Pick<LinkerInstance, 'from' | 'to' | 'points'> {
  return {
    from: ep('a', 0, 30, 0),
    to: ep('b', 500, 200, 0),
    points: [
      { x: 150, y: 30 },
      { x: 150, y: 200 },
      { x: 470, y: 200 },
    ],
  }
}

describe('stretchManualPoints（端段拉伸）', () => {
  it('to 端垂直移动：端段随锚点平移保持正交，段长吸收轴向分量', () => {
    const oldL = manualZ()
    const nextTo = ep('b', 500, 260, 0)
    // 末侧共线游程整体平移后，与 to 共线的 stub 折点被简化掉
    expect(stretchManualPoints(oldL, oldL.from, nextTo)).toEqual([
      { x: 150, y: 30 },
      { x: 150, y: 260 },
    ])
  })

  it('to 端沿轴移动：折点不动（段长自然变化）', () => {
    const oldL = manualZ()
    const nextTo = ep('b', 560, 200, 0)
    // 沿轴移动后共线 stub (470,200) 仍被简化
    expect(stretchManualPoints(oldL, oldL.from, nextTo)).toEqual([
      { x: 150, y: 30 },
      { x: 150, y: 200 },
    ])
  })

  it('to 端斜向移动：垂直分量平移端段、水平分量由段长吸收', () => {
    const oldL = manualZ()
    const nextTo = ep('b', 560, 260, 0)
    expect(stretchManualPoints(oldL, oldL.from, nextTo)).toEqual([
      { x: 150, y: 30 },
      { x: 150, y: 260 },
    ])
  })

  it('from 端移动：首段折点平移到新端点轴线上（仅首点动，其余保持）', () => {
    // oldFrom=(0,30)→nextFrom=(0,90)：首折点 (150,30) 距 oldFrom 水平差 150 > 垂直差 0，
    // 判为水平端段 → 折点移到新端点水平轴 y=90；末侧共线 stub 简化掉
    const oldL = manualZ()
    const nextFrom = ep('a', 0, 90, 0)
    expect(stretchManualPoints(oldL, nextFrom, oldL.to)).toEqual([
      { x: 150, y: 90 },
      { x: 150, y: 200 },
    ])
  })

  it('两端同时移动：先 from 后 to，两端各自正交', () => {
    const oldL = manualZ()
    const out = stretchManualPoints(oldL, ep('a', 0, 90, 0), ep('b', 500, 260, 0))
    expect(out).toEqual([
      { x: 150, y: 90 },
      { x: 150, y: 260 },
    ])
  })

  it('L 形单折点两端同时移动：基于原始折点各自归轴（L 变 Z，全程正交）', () => {
    // n=1 时 from（i=0）与 to（i=length-1=0）操作同一下标，
    // 须基于原始折点分别归轴后拼接，避免 to 覆盖 from 产生斜段
    const oldL = {
      from: ep('a', 0, 100, 0),
      to: ep('b', 300, 200, 0),
      points: [{ x: 150, y: 100 }],
    }
    const out = stretchManualPoints(oldL, ep('a', 0, 160, 0), ep('b', 300, 260, 0))
    expect(out).toEqual([
      { x: 150, y: 160 },
      { x: 150, y: 260 },
    ])
  })

  it('垂直端段（上下锚点）横移：折点平移到新 x 轴线', () => {
    const oldL = {
      from: ep('a', 150, 0, Math.PI / 2),
      to: ep('b', 500, 200, 0),
      points: [
        { x: 150, y: 200 },
        { x: 470, y: 200 },
      ],
    }
    const out = stretchManualPoints(oldL, ep('a', 250, 0, Math.PI / 2), oldL.to)
    // (470,200) 与 to 共线被简化，留下垂直拐角
    expect(out).toEqual([{ x: 250, y: 200 }])
  })

  it('两端未移动：原样返回（引用相等）', () => {
    const oldL = manualZ()
    expect(stretchManualPoints(oldL, oldL.from, oldL.to)).toBe(oldL.points)
  })

  it('端点亚阈值位移（<0.5px）：视为未移动，原样返回', () => {
    const oldL = manualZ()
    expect(stretchManualPoints(oldL, oldL.from, ep('b', 500, 200.3, 0))).toBe(oldL.points)
  })

  it('直线（points 空）沿轴移动：保持直线', () => {
    const oldL = { from: ep('a', 0, 0, Math.PI), to: ep('b', 200, 0, 0), points: [] as Array<{ x: number; y: number }> }
    expect(stretchManualPoints(oldL, oldL.from, ep('b', 260, 0, 0))).toEqual([])
  })

  it('直线垂直移动：插 Z 形（两端 stub + 拐角）', () => {
    const oldL = { from: ep('a', 0, 0, Math.PI), to: ep('b', 200, 0, 0), points: [] as Array<{ x: number; y: number }> }
    // to 侧 stub 与 to 共线被简化掉；from stub + 拐角保留，末段仍水平进锚点
    expect(stretchManualPoints(oldL, oldL.from, ep('b', 200, 60, 0))).toEqual([
      { x: 30, y: 0 },
      { x: 30, y: 60 },
    ])
  })

  it('L 形单折点仅一端移动：归轴后插拐角保持对侧端段正交', () => {
    const oldL = {
      from: ep('a', 0, 100, 0),
      to: ep('b', 300, 200, 0),
      points: [{ x: 150, y: 100 }],
    }
    const out = stretchManualPoints(oldL, ep('a', 0, 160, 0), oldL.to)
    // (150,160) 落在 from→(300,160) 上被简化，留下接 to 的垂直拐角
    expect(out).toEqual([{ x: 300, y: 160 }])
  })

  it('全共线折点仅一端移动：游程不吞并对侧紧邻折点，插拐角保持正交', () => {
    const oldL = {
      from: ep('a', 100, 35, Math.PI),
      to: ep('b', 300, 35, 0),
      points: [
        { x: 150, y: 35 },
        { x: 250, y: 35 },
      ],
    }
    const out = stretchManualPoints(oldL, ep('a', 100, 95, Math.PI), oldL.to)
    // 共线简化：(150,95) 落在 from→(250,95) 上被去掉，留下正交拐角
    expect(out).toEqual([
      { x: 250, y: 95 },
      { x: 250, y: 35 },
    ])
  })

  it('U 形折叠到底部（含 stub）：共线折点合并，底部仅剩一段', () => {
    // 截图缺陷：右图形下移使 U 底与末段重合后，stub 共线残留产生双拖拽点
    const oldL = {
      from: ep('a', 100, 100, Math.PI),
      to: ep('b', 500, 180, 0),
      points: [
        { x: 130, y: 100 },
        { x: 130, y: 280 },
        { x: 400, y: 280 },
        { x: 400, y: 180 },
        { x: 470, y: 180 },
      ],
    }
    const out = stretchManualPoints(oldL, oldL.from, ep('b', 500, 280, 0))
    expect(out).toEqual([
      { x: 130, y: 100 },
      { x: 130, y: 280 },
    ])
  })

  it('底部共线回折：重叠折点合并为单段', () => {
    // A→B→C 同 y 且 C 在 A-B 之间（回折重叠）→ 去掉 B，保留 A→C
    const oldL = {
      from: ep('a', 100, 100, Math.PI),
      to: ep('b', 500, 280, 0),
      points: [
        { x: 130, y: 100 },
        { x: 130, y: 280 },
        { x: 450, y: 280 },
        { x: 350, y: 280 },
      ],
    }
    // 端点未移动时 stretch 原样返回；沿轴微移触发拉伸后再共线简化
    const moved = stretchManualPoints(oldL, oldL.from, ep('b', 500.6, 280, 0))
    expect(moved).toEqual([
      { x: 130, y: 100 },
      { x: 130, y: 280 },
    ])
  })
})

describe('resetManualRoute（重置自动路由）', () => {
  function docWith(
    manualRoute: boolean | undefined,
    points: Array<{ x: number; y: number }>,
  ): { doc: DocumentData; id: string } {
    const l = createLinkerInstance(ep(null, 0, 0, 0), ep(null, 100, 0, 0), 0)
    const manual: LinkerInstance = { ...l, manualRoute, points }
    const doc: DocumentData = { ...createEmptyDocument(), elements: { [manual.id]: manual } }
    return { doc, id: manual.id }
  }

  it('手动连线：清除标记并重算自动路由（自由端直线 → 主轴中点肘形）', () => {
    const { doc, id } = docWith(true, [{ x: 7, y: 7 }])
    const next = resetManualRoute(doc, id)
    const after = next.elements[id]
    expect(isLinker(after) && after.manualRoute).toBe(false)
    expect(isLinker(after) && after.points).toEqual([
      { x: 50, y: 0 },
      { x: 50, y: 0 },
    ])
  })

  it('非手动连线：原样返回（引用相等）', () => {
    const { doc, id } = docWith(undefined, [{ x: 7, y: 7 }])
    expect(resetManualRoute(doc, id)).toBe(doc)
  })
})

// ═══════════ routeAttachedLinkers 分支接入 ═══════════

/** 矩形默认尺寸 100×70（registry createElement，未触发 60 回退） */
function rect(id: string, x: number, y: number): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', x, y)!
  el.id = id
  return el
}

describe('routeAttachedLinkers manualRoute 分支', () => {
  it('手动连线：图形移动仅拉伸端段（不全量重算）', () => {
    const a = rect('sa', 0, 0) // 右锚点 (100,35) angle π
    const b = rect('sb', 300, 60) // 左锚点 (300,95) angle 0
    const l = createLinkerInstance(ep('sa', 100, 35, Math.PI), ep('sb', 300, 95, 0), 0)
    const manual: LinkerInstance = {
      ...l,
      manualRoute: true,
      points: [
        { x: 150, y: 35 },
        { x: 150, y: 95 },
        { x: 250, y: 95 },
      ],
    }
    const elements = { sa: a, sb: b, [manual.id]: manual }
    // b 上移 60 → 左锚点 (300,35)；to 侧游程平移后全共线，简化为直线（无中间折点）
    const out = routeAttachedLinkers(elements, new Map([['sb', { x: 300, y: 0 }]]))
    const after = out.get(manual.id)!
    expect(after.points).toEqual([])
    expect(after.manualRoute).toBe(true)
  })

  it('非手动连线：保持全量自动路由', () => {
    const a = rect('sa', 0, 0)
    const b = rect('sb', 300, 60)
    const l = createLinkerInstance(ep('sa', 100, 35, Math.PI), ep('sb', 300, 95, 0), 0)
    const auto: LinkerInstance = { ...l, points: [] }
    const elements = { sa: a, sb: b, [auto.id]: auto }
    const out = routeAttachedLinkers(elements, new Map([['sb', { x: 300, y: 0 }]]))
    const after = out.get(auto.id)!
    // 左右相对路由：中点 x=200
    expect(after.points).toEqual([
      { x: 200, y: 35 },
      { x: 200, y: 35 },
    ])
  })
})
