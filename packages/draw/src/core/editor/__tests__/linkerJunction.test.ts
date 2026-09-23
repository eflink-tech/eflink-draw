// junction（端点附着到另一条连线）纯函数测试：
//   最近点求解（t 与 cursorPointAt 口径互逆）/ 吸附目标选择 / 防环 / 解析联动
import { describe, it, expect } from 'vitest'
import type { DocumentData, LinkerInstance } from '@/types'
import { createLinkerInstance, getLinkerPoints, type LinkerEndpoint } from '../linker'
import { cursorPointAt } from '../linkerCursor'
import {
  findJunctionSnap,
  nearestPointOnLinker,
  resolveJunctionLinkers,
  resolveJunctionPoint,
  wouldCreateJunctionCycle,
  JUNCTION_SNAP_PX,
} from '../linkerJunction'

type Ep = { id: string | null; x: number; y: number; angle: number; junction?: { linkerId: string; t: number } }

function makeLinker(
  from: Ep,
  to: Ep,
  points: Array<{ x: number; y: number }> = [],
  linkerType: LinkerInstance['linkerType'] = 'broken',
): LinkerInstance {
  const l = createLinkerInstance(from, to, 0)
  return { ...l, linkerType, points }
}

/** from(0,0)→(0,40)→(100,40)→to(100,100)，总长 40+100+60=200 */
function elbow(): LinkerInstance {
  return makeLinker(
    { id: null, x: 0, y: 0, angle: 0 },
    { id: null, x: 100, y: 100, angle: 0 },
    [
      { x: 0, y: 40 },
      { x: 100, y: 40 },
    ],
  )
}

function elementsOf(...ls: LinkerInstance[]): DocumentData['elements'] {
  return Object.fromEntries(ls.map((l) => [l.id, l]))
}

const noRect = () => null

describe('nearestPointOnLinker', () => {
  it('line：中点投影（t 即 lerp 参数）', () => {
    const l = makeLinker({ id: null, x: 0, y: 0, angle: 0 }, { id: null, x: 100, y: 0, angle: 0 }, [], 'line')
    const r = nearestPointOnLinker(l, 50, 10)
    expect(r).toMatchObject({ x: 50, y: 0, t: 0.5 })
    expect(r.dist).toBeCloseTo(10, 10)
  })

  it('line：投影落在线段外时钳制到端点', () => {
    const l = makeLinker({ id: null, x: 0, y: 0, angle: 0 }, { id: null, x: 100, y: 0, angle: 0 }, [], 'line')
    expect(nearestPointOnLinker(l, -20, 0)).toMatchObject({ x: 0, y: 0, t: 0 })
    expect(nearestPointOnLinker(l, 120, 0)).toMatchObject({ x: 100, y: 0, t: 1 })
  })

  it('broken：多段取最近段，t 换算为全路径长度比例', () => {
    const l = elbow()
    // 水平中段 (0,40)-(100,40) 上距 10：accLen 40 + 段内 10 → t = 50/200 = 0.25
    const r = nearestPointOnLinker(l, 10, 50)
    expect(r).toMatchObject({ x: 10, y: 40 })
    expect(r.t).toBeCloseTo(0.25, 10)
    expect(r.dist).toBeCloseTo(10, 10)
  })

  it('broken：t 与 cursorPointAt 往返互逆（全路径抽样）', () => {
    const l = elbow()
    for (const t of [0, 0.13, 0.25, 0.5, 0.77, 0.99, 1]) {
      const p = cursorPointAt(l, t)
      const near = nearestPointOnLinker(l, p.x, p.y)
      expect(near.dist).toBeCloseTo(0, 6)
      expect(near.t).toBeCloseTo(t, 6)
      expect(cursorPointAt(l, near.t).x).toBeCloseTo(near.x, 6)
      expect(cursorPointAt(l, near.t).y).toBeCloseTo(near.y, 6)
    }
  })

  it('curve：采样+细化后 t 逼近真实参数', () => {
    const l = makeLinker(
      { id: null, x: 0, y: 0, angle: 0 },
      { id: null, x: 100, y: 0, angle: 0 },
      [
        { x: 25, y: -60 },
        { x: 75, y: -60 },
      ],
      'curve',
    )
    for (const t of [0.2, 0.5, 0.8]) {
      const p = cursorPointAt(l, t)
      const near = nearestPointOnLinker(l, p.x, p.y)
      expect(near.t).toBeCloseTo(t, 1) // 误差 < 0.05
      expect(near.dist).toBeLessThan(0.5)
    }
  })
})

describe('findJunctionSnap', () => {
  it('容差内吸附最近的连线，返回投影点与 t', () => {
    const near = makeLinker({ id: null, x: 0, y: 0, angle: 0 }, { id: null, x: 100, y: 0, angle: 0 }, [], 'line')
    const far = makeLinker({ id: null, x: 0, y: 8, angle: 0 }, { id: null, x: 100, y: 8, angle: 0 }, [], 'line')
    const r = findJunctionSnap([far, near], 50, 3, 1) // 距 near 3 < 距 far 5
    expect(r).not.toBeNull()
    expect(r!.linkerId).toBe(near.id)
    expect(r!).toMatchObject({ x: 50, y: 0, t: 0.5 })
  })

  it('超出容差（JUNCTION_SNAP_PX/scale）返回 null', () => {
    const l = makeLinker({ id: null, x: 0, y: 0, angle: 0 }, { id: null, x: 100, y: 0, angle: 0 }, [], 'line')
    expect(findJunctionSnap([l], 50, JUNCTION_SNAP_PX + 1, 1)).toBeNull()
  })

  it('容差随缩放换算（scale=2 时 10 屏幕px = 5 世界px）', () => {
    const l = makeLinker({ id: null, x: 0, y: 0, angle: 0 }, { id: null, x: 100, y: 0, angle: 0 }, [], 'line')
    expect(findJunctionSnap([l], 50, 4, 2)).not.toBeNull() // 4 世界 = 8 屏幕 < 10
    expect(findJunctionSnap([l], 50, 6, 2)).toBeNull() // 6 世界 = 12 屏幕 > 10
  })

  it('排除被拖连线自身与锁定宿主', () => {
    const self = makeLinker({ id: null, x: 0, y: 0, angle: 0 }, { id: null, x: 100, y: 0, angle: 0 }, [], 'line')
    expect(findJunctionSnap([self], 50, 2, 1, { selfId: self.id })).toBeNull()
    const locked = { ...self, id: 'lk-locked', locked: true }
    expect(findJunctionSnap([locked], 50, 2, 1)).toBeNull()
  })

  it('排除另一端已附着的宿主（同宿主双端）', () => {
    const host = makeLinker({ id: null, x: 0, y: 0, angle: 0 }, { id: null, x: 100, y: 0, angle: 0 }, [], 'line')
    const r = findJunctionSnap([host], 50, 2, 1, { otherJunctionHostId: host.id })
    expect(r).toBeNull()
  })

  it('排除会造成循环附着的宿主', () => {
    const self = makeLinker({ id: null, x: 0, y: 100, angle: 0 }, { id: null, x: 100, y: 100, angle: 0 }, [], 'line')
    // host 已附着在 self 上：self → host 成环
    const host = makeLinker(
      { id: null, x: 0, y: 0, angle: 0, junction: { linkerId: self.id, t: 0.5 } },
      { id: null, x: 100, y: 0, angle: 0 },
      [],
      'line',
    )
    const elements = elementsOf(self, host)
    expect(findJunctionSnap([host], 50, 2, 1, { selfId: self.id, elements })).toBeNull()
  })
})

describe('wouldCreateJunctionCycle', () => {
  it('直接环：host 已附着 self → true', () => {
    const self = makeLinker({ id: null, x: 0, y: 0, angle: 0 }, { id: null, x: 10, y: 0, angle: 0 }, [], 'line')
    const host = makeLinker(
      { id: null, x: 0, y: 5, angle: 0, junction: { linkerId: self.id, t: 0.5 } },
      { id: null, x: 10, y: 5, angle: 0 },
      [],
      'line',
    )
    expect(wouldCreateJunctionCycle(elementsOf(self, host), self.id, host.id)).toBe(true)
  })

  it('传递环：A→B、B→C，C 再附着 A → true', () => {
    const a = makeLinker({ id: null, x: 0, y: 0, angle: 0, junction: { linkerId: 'B', t: 0.5 } }, { id: null, x: 1, y: 0, angle: 0 }, [], 'line')
    const b = makeLinker({ id: null, x: 0, y: 1, angle: 0, junction: { linkerId: 'C', t: 0.5 } }, { id: null, x: 1, y: 1, angle: 0 }, [], 'line')
    const c = makeLinker({ id: null, x: 0, y: 2, angle: 0 }, { id: null, x: 1, y: 2, angle: 0 }, [], 'line')
    const elements = { ...elementsOf(a, b, c), B: { ...b, id: 'B' }, C: { ...c, id: 'C' } }
    expect(wouldCreateJunctionCycle(elements, 'C', a.id)).toBe(true)
  })

  it('无环：host 链上不经过 self → false', () => {
    const host = makeLinker({ id: null, x: 0, y: 0, angle: 0 }, { id: null, x: 10, y: 0, angle: 0 }, [], 'line')
    const self = makeLinker({ id: null, x: 0, y: 5, angle: 0 }, { id: null, x: 10, y: 5, angle: 0 }, [], 'line')
    expect(wouldCreateJunctionCycle(elementsOf(self, host), self.id, host.id)).toBe(false)
  })

  it('自附着 → true', () => {
    const self = makeLinker({ id: null, x: 0, y: 0, angle: 0 }, { id: null, x: 10, y: 0, angle: 0 }, [], 'line')
    expect(wouldCreateJunctionCycle(elementsOf(self), self.id, self.id)).toBe(true)
  })
})

describe('resolveJunctionPoint', () => {
  it('宿主存在：返回 cursorPointAt(宿主, t) 坐标', () => {
    const host = elbow()
    const ep: LinkerEndpoint = { id: null, x: 0, y: 0, angle: null, junction: { linkerId: host.id, t: 0.25 } }
    expect(resolveJunctionPoint(elementsOf(host), ep)).toEqual(cursorPointAt(host, 0.25))
  })

  it('宿主缺失或无 junction：返回 null', () => {
    const ep: LinkerEndpoint = { id: null, x: 1, y: 2, angle: null, junction: { linkerId: 'ghost', t: 0.5 } }
    expect(resolveJunctionPoint({}, ep)).toBeNull()
    expect(resolveJunctionPoint({}, { id: null, x: 1, y: 2, angle: null })).toBeNull()
  })
})

describe('resolveJunctionLinkers', () => {
  it('宿主几何变更后附着端点跟随到新位置并重路由', () => {
    const host = elbow()
    const dep = makeLinker(
      { id: null, x: 200, y: 200, angle: 0 },
      { id: null, x: 10, y: 40, angle: 0, junction: { linkerId: host.id, t: 0.25 } },
    )
    // 宿主换一组 points（等价段拖拽后）：(0,80)→(100,80)，总长 80+100+20=200
    const movedHost: LinkerInstance = {
      ...host,
      points: [
        { x: 0, y: 80 },
        { x: 100, y: 80 },
      ],
    }
    const out = resolveJunctionLinkers(elementsOf(movedHost, dep), noRect)
    const nd = out.get(dep.id)!
    const expectP = cursorPointAt(movedHost, 0.25) // (10, 80)
    expect(nd.to.x).toBeCloseTo(expectP.x, 6)
    expect(nd.to.y).toBeCloseTo(expectP.y, 6)
    expect(nd.to.junction).toEqual({ linkerId: host.id, t: 0.25 })
    // 两端自由的重路由结果与 getLinkerPoints 一致
    expect(nd.points).toEqual(getLinkerPoints(nd, noRect))
  })

  it('链式附着（A→B→C）：宿主 C 变动后一轮拓扑解析全部到位', () => {
    const c = elbow()
    const b = makeLinker(
      { id: null, x: 300, y: 0, angle: 0 },
      { id: null, x: 10, y: 40, angle: 0, junction: { linkerId: c.id, t: 0.25 } },
      [],
      'line',
    )
    const a = makeLinker(
      { id: null, x: 300, y: 200, angle: 0 },
      { id: null, x: 50, y: 22, angle: 0, junction: { linkerId: b.id, t: 0.5 } },
      [],
      'line',
    )
    const movedC: LinkerInstance = {
      ...c,
      points: [
        { x: 0, y: 80 },
        { x: 100, y: 80 },
      ],
    }
    const out = resolveJunctionLinkers(elementsOf(movedC, b, a), noRect)
    const nb = out.get(b.id)!
    // movedC 的 t=0.25 落在第一段 (0,0)→(0,80) 上：accLen 80/200 → (0, 50)
    const expectB = cursorPointAt(movedC, 0.25)
    expect(nb.to.x).toBeCloseTo(expectB.x, 6)
    expect(nb.to.y).toBeCloseTo(expectB.y, 6)
    // a 的宿主是 b，应取解析后的新 b 几何
    const na = out.get(a.id)!
    const expectA = cursorPointAt(nb, 0.5)
    expect(na.to.x).toBeCloseTo(expectA.x, 6)
    expect(na.to.y).toBeCloseTo(expectA.y, 6)
  })

  it('宿主已删除：端点脱附为自由点（junction 清除、坐标保留）', () => {
    const dep = makeLinker(
      { id: null, x: 200, y: 200, angle: 0 },
      { id: null, x: 10, y: 40, angle: 0, junction: { linkerId: 'ghost', t: 0.25 } },
    )
    const out = resolveJunctionLinkers(elementsOf(dep), noRect)
    const nd = out.get(dep.id)!
    expect(nd.to.junction).toBeUndefined()
    expect(nd.to.id).toBeNull()
    expect(nd.to).toMatchObject({ x: 10, y: 40 })
  })

  it('坐标已一致时不产生更新（避免无效历史记录）', () => {
    const host = elbow()
    const p = cursorPointAt(host, 0.25)
    const dep = makeLinker(
      { id: null, x: 200, y: 200, angle: 0 },
      { id: null, x: p.x, y: p.y, angle: 0, junction: { linkerId: host.id, t: 0.25 } },
    )
    expect(resolveJunctionLinkers(elementsOf(host, dep), noRect).size).toBe(0)
  })

  it('manualRoute 连线：端点跟随但折点走拉伸策略（不全量重算）', () => {
    const host = elbow()
    const dep: LinkerInstance = {
      ...makeLinker(
        { id: null, x: 200, y: 200, angle: 0 },
        { id: null, x: 10, y: 40, angle: 0, junction: { linkerId: host.id, t: 0.25 } },
        [
          { x: 200, y: 100 },
          { x: 10, y: 100 },
        ],
      ),
      manualRoute: true,
    }
    const movedHost: LinkerInstance = {
      ...host,
      points: [
        { x: 0, y: 80 },
        { x: 100, y: 80 },
      ],
    }
    const out = resolveJunctionLinkers(elementsOf(movedHost, dep), noRect)
    const nd = out.get(dep.id)!
    expect(nd.to.y).toBeCloseTo(cursorPointAt(movedHost, 0.25).y, 6)
    expect(nd.manualRoute).toBe(true)
    // 手动折点保留数量（拉伸策略不增不减中段折点）
    expect(nd.points).toHaveLength(2)
  })

  it('意外环（脏数据）：脱附成环节点而不是死循环', () => {
    const a = makeLinker(
      { id: null, x: 0, y: 0, angle: 0, junction: { linkerId: 'B', t: 0.5 } },
      { id: null, x: 10, y: 0, angle: 0 },
      [],
      'line',
    )
    const b = makeLinker(
      { id: null, x: 0, y: 5, angle: 0, junction: { linkerId: a.id, t: 0.5 } },
      { id: null, x: 10, y: 5, angle: 0 },
      [],
      'line',
    )
    const elements = { [a.id]: a, B: { ...b, id: 'B' } }
    const out = resolveJunctionLinkers(elements, noRect)
    // 两条都成环 → 都脱附，junction 被清除
    for (const nl of out.values()) {
      expect(nl.from.junction).toBeUndefined()
    }
    expect(out.size).toBe(2)
  })

  it('无 junction 的连线不受影响', () => {
    const plain = elbow()
    expect(resolveJunctionLinkers(elementsOf(plain), noRect).size).toBe(0)
  })
})
