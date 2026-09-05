import { describe, it, expect } from 'vitest'
import type { LinkerInstance } from '@/types'
import { createLinkerInstance } from '../linker'
import { hitLinkerSegment, isMiddleSegment, isSegmentDraggable, segmentDragPoints } from '../linkerSegment'
import { simplifyOrthogonalPoints } from '../manualRoute'

/** from(0,0)→p(0,40)→p(100,40)→to(100,100) 的折线 */
function brokenLinker(points: Array<{ x: number; y: number }>): LinkerInstance {
  const l = createLinkerInstance(
    { id: null, x: 0, y: 0, angle: 0 },
    { id: null, x: 100, y: 100, angle: 0 },
    0,
  )
  return { ...l, linkerType: 'broken', points }
}

const PTS = [
  { x: 0, y: 40 },
  { x: 100, y: 40 },
]

describe('hitLinkerSegment', () => {
  it('命中垂直首段（segIndex 1，axisAligned v）', () => {
    const hit = hitLinkerSegment(brokenLinker(PTS), 0, 20, 1)
    expect(hit).toEqual({ segIndex: 1, axisAligned: 'v' })
  })

  it('命中水平中段（segIndex 2，axisAligned h）', () => {
    const hit = hitLinkerSegment(brokenLinker(PTS), 50, 42, 1)
    expect(hit).toEqual({ segIndex: 2, axisAligned: 'h' })
  })

  it('命中垂直尾段（segIndex 3）', () => {
    const hit = hitLinkerSegment(brokenLinker(PTS), 100, 70, 1)
    expect(hit).toEqual({ segIndex: 3, axisAligned: 'v' })
  })

  it('容差外返回 null（6px 世界像素）', () => {
    expect(hitLinkerSegment(brokenLinker(PTS), 50, 49, 1)).toBeNull()
  })

  it('折点附近两段同时在容差内时取最近段', () => {
    // 点 (1,37)：距垂直首段（最近点 (0,37)）1px、距水平中段（最近点 (1,40)）3px，
    const hit = hitLinkerSegment(brokenLinker(PTS), 1, 37, 1)
    expect(hit).toEqual({ segIndex: 1, axisAligned: 'v' })
  })

  it('scale=2 时容差减半（6/2=3 世界像素）', () => {
    // 点 (50,43) 距中段 3px：3 <= 3 边界内命中；所有值二进制精确表示，无浮点误差
    expect(hitLinkerSegment(brokenLinker(PTS), 50, 43, 2)).toEqual({
      segIndex: 2,
      axisAligned: 'h',
    })
    // 点 (50,43.5) 距中段 3.5px > 3 → 容差外
    expect(hitLinkerSegment(brokenLinker(PTS), 50, 43.5, 2)).toBeNull()
  })

  it('斜段 axisAligned 为 null', () => {
    const l = brokenLinker([{ x: 50, y: 50 }])
    const hit = hitLinkerSegment(l, 24, 26, 1)
    expect(hit).not.toBeNull()
    expect(hit!.axisAligned).toBeNull()
  })
})

describe('isMiddleSegment（可拖段判定 1 < d <= points.length）', () => {
  it('端段不可拖、中段可拖', () => {
    const l = brokenLinker(PTS)
    expect(isMiddleSegment(l, 1)).toBe(false)
    expect(isMiddleSegment(l, 2)).toBe(true)
    expect(isMiddleSegment(l, 3)).toBe(false)
  })
})

describe('isSegmentDraggable（所有段均可拖）', () => {
  it('Z 形（points.length=2）：三段全部可拖', () => {
    const l = brokenLinker(PTS)
    expect(isSegmentDraggable(l, 1)).toBe(true)
    expect(isSegmentDraggable(l, 2)).toBe(true)
    expect(isSegmentDraggable(l, 3)).toBe(true)
    // 越界下标
    expect(isSegmentDraggable(l, 0)).toBe(false)
    expect(isSegmentDraggable(l, 4)).toBe(false)
  })

  it('L 形（points.length=1）：两段均可拖', () => {
    const l = brokenLinker([{ x: 0, y: 100 }])
    expect(isSegmentDraggable(l, 1)).toBe(true)
    expect(isSegmentDraggable(l, 2)).toBe(true)
  })

  it('直线（points.length=0）：唯一段可拖', () => {
    const l = brokenLinker([])
    expect(isSegmentDraggable(l, 1)).toBe(true)
  })
})

describe('segmentDragPoints（段拖动几何）', () => {
  it('Z 形中段：两端折点单轴平移，折点数不变（水平段 dx 无效）', () => {
    const l = brokenLinker(PTS)
    const result = segmentDragPoints(l, 2, 30, 15)
    expect(result.points).toEqual([
      { x: 0, y: 55 },
      { x: 100, y: 55 },
    ])
    expect(result.dragged).toEqual([
      { x: 0, y: 55 },
      { x: 100, y: 55 },
    ])
  })

  it('中段水平拖 y：仅改 y（保持轴对齐）', () => {
    const l = brokenLinker(PTS)
    const result = segmentDragPoints(l, 2, 0, 15)
    expect(result.points).toEqual([
      { x: 0, y: 55 },
      { x: 100, y: 55 },
    ])
    expect(result.dragged).toEqual([
      { x: 0, y: 55 },
      { x: 100, y: 55 },
    ])
  })

  it('L 形垂直段拖 x：points 替换为两个新折点（L 变 Z）', () => {
    // from(0,0) → p(0,100) → to(100,100)：垂直首段拖 x+50
    const l = brokenLinker([{ x: 0, y: 100 }])
    const result = segmentDragPoints(l, 1, 50, 0)
    expect(result.points).toEqual([
      { x: 50, y: 0 },
      { x: 50, y: 100 },
    ])
    expect(result.dragged).toEqual([
      { x: 50, y: 0 },
      { x: 50, y: 100 },
    ])
  })

  it('L 形水平段拖 y：同理替换', () => {
    const l = brokenLinker([{ x: 0, y: 100 }])
    const result = segmentDragPoints(l, 2, 0, -20)
    expect(result.points).toEqual([
      { x: 0, y: 80 },
      { x: 100, y: 80 },
    ])
    expect(result.dragged).toEqual([
      { x: 0, y: 80 },
      { x: 100, y: 80 },
    ])
  })

  it('直线段拖 y：替换为两个新折点（直线变 Z）', () => {
    // 轴对齐直线 from(0,0)→to(100,0)（斜线 axisAligned=null 在 UI 上不可拖）
    const l = { ...brokenLinker([]), from: { id: null, x: 0, y: 0, angle: 0 }, to: { id: null, x: 100, y: 0, angle: 0 } }
    const result = segmentDragPoints(l, 1, 0, 25)
    expect(result.points).toEqual([
      { x: 0, y: 25 },
      { x: 100, y: 25 },
    ])
    expect(result.dragged).toEqual([
      { x: 0, y: 25 },
      { x: 100, y: 25 },
    ])
  })

  it('Z 形首段垂直拖 x：切出+插入（points +1，正交保持）', () => {
    // from(0,0)→p0(0,40)→p1(100,40)→to(100,100)：首段拖 dx=50
    // 新路径 (0,0)→(50,0)→(50,40)→(100,40)→(100,100)
    const l = brokenLinker(PTS)
    const result = segmentDragPoints(l, 1, 50, 0)
    expect(result.points).toEqual([
      { x: 50, y: 0 },
      { x: 50, y: 40 },
      { x: 100, y: 40 },
    ])
    expect(result.dragged).toEqual([
      { x: 50, y: 0 },
      { x: 50, y: 40 },
    ])
  })

  it('Z 形末段垂直拖 x：切出+插入（尾部插入 to 的平移像）', () => {
    // 末段拖 dx=-30：新路径 (0,40)→(70,40)→(70,100)→(100,100)
    const l = brokenLinker(PTS)
    const result = segmentDragPoints(l, 3, -30, 0)
    expect(result.points).toEqual([
      { x: 0, y: 40 },
      { x: 70, y: 40 },
      { x: 70, y: 100 },
    ])
    expect(result.dragged).toEqual([
      { x: 70, y: 40 },
      { x: 70, y: 100 },
    ])
  })

  it('Z 形首段垂直段拖 x（dy 无效）：同理切出+插入', () => {
    // 首段垂直，段轴是垂直、拖动轴为 x —— dy 无效被忽略，与仅传 dx 等价
    const l = brokenLinker(PTS)
    const result = segmentDragPoints(l, 1, 20, 0)
    expect(result.points).toEqual([
      { x: 20, y: 0 },
      { x: 20, y: 40 },
      { x: 100, y: 40 },
    ])
    expect(result.dragged).toEqual([
      { x: 20, y: 0 },
      { x: 20, y: 40 },
    ])
  })
})

// ═══════════ 端段附着 stub（Task 2）═══════════

/** a 图左锚点(0,30)→…→b 图左锚点(500,200) 的 Z 形直连线（两端附着） */
function zLinkerAttached(): LinkerInstance {
  const l = createLinkerInstance(
    { id: 'a', x: 0, y: 30, angle: 0 },
    { id: 'b', x: 500, y: 200, angle: 0 },
    0,
  )
  return {
    ...l,
    linkerType: 'broken',
    points: [
      { x: 150, y: 30 },
      { x: 150, y: 200 },
      { x: 470, y: 200 },
    ],
  }
}

describe('segmentDragPoints 端段附着 stub', () => {
  it('末段垂直下拖：游程整体平移 + 拐角/stub 插入，末段保持水平进入（箭头方向不变）', () => {
    const l = zLinkerAttached()
    // 末段 segIndex=4：(470,200)→(500,200) 水平；(150,200) 与其共线同属游程
    const result = segmentDragPoints(l, 4, 0, 40)
    expect(result.points).toEqual([
      { x: 150, y: 30 },
      { x: 150, y: 240 },
      { x: 470, y: 240 },
      { x: 470, y: 200 },
    ])
    expect(result.dragged).toEqual([
      { x: 150, y: 240 },
      { x: 470, y: 240 },
    ])
  })

  it('末段下拖、相邻折点不与末段共线：仅平移末段折点并插 stub', () => {
    const l = zLinkerAttached()
    l.points = [
      { x: 150, y: 30 },
      { x: 470, y: 200 },
    ]
    const result = segmentDragPoints(l, 3, 0, 40)
    expect(result.points).toEqual([
      { x: 150, y: 30 },
      { x: 470, y: 240 },
      { x: 470, y: 200 },
    ])
    // 游程单折点：run[0]===runLast 触发 resolveDragged 回退，向前取相邻点作句柄近端
    expect(result.dragged).toEqual([{ x: 150, y: 30 }, { x: 470, y: 240 }])
  })

  it('首段垂直下拖：from 侧插 stub（向西 30px）+ 拐角，其余折点不动', () => {
    const l = zLinkerAttached()
    const result = segmentDragPoints(l, 1, 0, 40)
    expect(result.points).toEqual([
      { x: -30, y: 30 },
      { x: -30, y: 70 },
      { x: 150, y: 70 },
      { x: 150, y: 200 },
      { x: 470, y: 200 },
    ])
    expect(result.dragged).toEqual([
      { x: -30, y: 70 },
      { x: 150, y: 70 },
    ])
  })

  it('直线（points 空）两端附着：两端各插 stub 成 Z 形', () => {
    const l = createLinkerInstance(
      { id: 'a', x: 0, y: 0, angle: Math.PI },
      { id: 'b', x: 200, y: 0, angle: 0 },
      0,
    )
    l.linkerType = 'broken'
    const result = segmentDragPoints(l, 1, 0, 40)
    expect(result.points).toEqual([
      { x: 30, y: 0 },
      { x: 30, y: 40 },
      { x: 170, y: 40 },
      { x: 170, y: 0 },
    ])
    expect(result.dragged).toEqual([
      { x: 30, y: 40 },
      { x: 170, y: 40 },
    ])
  })

  it('被拖端自由：保持现状切出+插入（不插 stub）', () => {
    const l = createLinkerInstance(
      { id: 'a', x: 0, y: 30, angle: 0 },
      { id: null, x: 500, y: 200, angle: 0 },
      0,
    )
    l.linkerType = 'broken'
    l.points = [{ x: 470, y: 200 }]
    const result = segmentDragPoints(l, 2, 0, 40)
    expect(result.points).toEqual([
      { x: 470, y: 240 },
      { x: 500, y: 240 },
    ])
  })

  it('line 类型不插 stub（直线平移像插入）', () => {
    const l = createLinkerInstance(
      { id: 'a', x: 0, y: 0, angle: 0 },
      { id: 'b', x: 200, y: 0, angle: 0 },
      0,
    )
    l.linkerType = 'line'
    const result = segmentDragPoints(l, 1, 0, 40)
    expect(result.points).toEqual([
      { x: 0, y: 40 },
      { x: 200, y: 40 },
    ])
  })
})

// ═══════════ 中段相邻附着端保 stub（Task 3）═══════════

describe('segmentDragPoints 中段相邻附着端', () => {
  it('末侧中段（segIndex=n）下拖：锚点侧折点固定，插入拐角（points +1）', () => {
    const l = zLinkerAttached()
    // segIndex=3：points[1](150,200)→points[2](470,200)，points[2] 紧邻 to
    const result = segmentDragPoints(l, 3, 0, 40)
    expect(result.points).toEqual([
      { x: 150, y: 30 },
      { x: 150, y: 240 },
      { x: 470, y: 240 },
      { x: 470, y: 200 },
    ])
    expect(result.dragged).toEqual([
      { x: 150, y: 240 },
      { x: 470, y: 240 },
    ])
  })

  it('首侧中段（segIndex=2）横拖：from 侧折点固定，插入拐角', () => {
    const l = zLinkerAttached()
    // segIndex=2：points[0](150,30)→points[1](150,200) 垂直段
    const result = segmentDragPoints(l, 2, 60, 0)
    // dx 与 b1→(470,200) 游程同向 → 拐角与游程共线（180° 冗余折点），规格如此定义，共线清理不在本任务范围
    expect(result.points).toEqual([
      { x: 150, y: 30 },
      { x: 150, y: 200 },
      { x: 210, y: 200 },
      { x: 470, y: 200 },
    ])
    expect(result.dragged).toEqual([
      { x: 150, y: 200 },
      { x: 210, y: 200 },
    ])
  })

  it('n=2 两端都相邻（唯一中段）：两侧折点均固定，插入两个拐角（points +2）', () => {
    const l = createLinkerInstance(
      { id: 'a', x: 0, y: 0, angle: Math.PI },
      { id: 'b', x: 200, y: 0, angle: 0 },
      0,
    )
    l.linkerType = 'broken'
    l.points = [
      { x: 30, y: 0 },
      { x: 170, y: 0 },
    ]
    const result = segmentDragPoints(l, 2, 0, 40)
    expect(result.points).toEqual([
      { x: 30, y: 0 },
      { x: 30, y: 40 },
      { x: 170, y: 40 },
      { x: 170, y: 0 },
    ])
    expect(result.dragged).toEqual([
      { x: 30, y: 40 },
      { x: 170, y: 40 },
    ])
  })

  it('Z 形中段横拖：原始折点折叠后共线简化去掉残留 stub', () => {
    // 拖拽中若不实时简化，会短暂出现 from→旧肘→新肘 的水平残留短线（截图缺陷）
    const l = createLinkerInstance(
      { id: 'a', x: 100, y: 100, angle: Math.PI },
      { id: 'b', x: 500, y: 250, angle: 0 },
      0,
    )
    l.linkerType = 'broken'
    l.points = [
      { x: 250, y: 100 },
      { x: 250, y: 250 },
    ]
    const result = segmentDragPoints(l, 2, -100, 0)
    expect(result.points).toEqual([
      { x: 250, y: 100 },
      { x: 150, y: 100 },
      { x: 150, y: 250 },
      { x: 250, y: 250 },
    ])
    expect(simplifyOrthogonalPoints(l.from, result.points, l.to)).toEqual([
      { x: 150, y: 100 },
      { x: 150, y: 250 },
    ])
  })

  it('远离锚点的中段：保持两端折点平移现状', () => {
    const l = zLinkerAttached()
    l.points = [
      { x: 150, y: 30 },
      { x: 150, y: 100 },
      { x: 300, y: 100 },
      { x: 300, y: 200 },
      { x: 470, y: 200 },
    ]
    const result = segmentDragPoints(l, 3, 0, 40)
    expect(result.points).toEqual([
      { x: 150, y: 30 },
      { x: 150, y: 140 },
      { x: 300, y: 140 },
      { x: 300, y: 200 },
      { x: 470, y: 200 },
    ])
    expect(result.dragged).toEqual([
      { x: 150, y: 140 },
      { x: 300, y: 140 },
    ])
  })

  it('line 类型不走相邻分支：退回两端折点平移', () => {
    const l = createLinkerInstance(
      { id: 'a', x: 0, y: 0, angle: Math.PI },
      { id: 'b', x: 200, y: 0, angle: 0 },
      0,
    )
    l.linkerType = 'line'
    l.points = [
      { x: 30, y: 0 },
      { x: 170, y: 0 },
    ]
    const result = segmentDragPoints(l, 2, 0, 40)
    expect(result.points).toEqual([
      { x: 30, y: 40 },
      { x: 170, y: 40 },
    ])
    expect(result.dragged).toEqual([
      { x: 30, y: 40 },
      { x: 170, y: 40 },
    ])
  })

  it('位置相邻但端点自由仍走平移（不插拐角）', () => {
    const l = zLinkerAttached()
    l.from = { id: null, x: 0, y: 30, angle: 0 }
    const result = segmentDragPoints(l, 2, 60, 0)
    expect(result.points).toEqual([
      { x: 210, y: 30 },
      { x: 210, y: 200 },
      { x: 470, y: 200 },
    ])
    expect(result.dragged).toEqual([
      { x: 210, y: 30 },
      { x: 210, y: 200 },
    ])
  })
})

// ═══════════ 端段游程对侧保护（实测缺陷修复：重合折点不拖斜对侧）═══════════

/** 自动路由重合折点形态：a 右锚点(650,280)→重合点×2→b 左锚点(870,280) */
function coincidentLinker(): LinkerInstance {
  const l = createLinkerInstance(
    { id: 'a', x: 650, y: 280, angle: Math.PI },
    { id: 'b', x: 870, y: 280, angle: 0 },
    0,
  )
  return {
    ...l,
    linkerType: 'broken',
    points: [
      { x: 760, y: 280 },
      { x: 760, y: 280 },
    ],
  }
}

describe('segmentDragPoints 端段游程对侧保护', () => {
  it('末段下拖、重合折点：对侧紧邻折点保持原位，插 Z 形拐角无斜段', () => {
    const l = coincidentLinker()
    // 末段 segIndex=3：(760,280)→(870,280) 水平，dy=40 下拖
    // 游程不吞 pts[0]（from 侧保护锚）：head=[(760,280)]，run=[(760,320)]
    // corner=(stub.x, runLast.y)=(840,320)，stub=(840,280) → 全程正交无回折
    const result = segmentDragPoints(l, 3, 0, 40)
    expect(result.points).toEqual([
      { x: 760, y: 280 },
      { x: 760, y: 320 },
      { x: 840, y: 320 },
      { x: 840, y: 280 },
    ])
    // 游程单折点：resolveDragged 回退向前取相邻点
    expect(result.dragged).toEqual([{ x: 760, y: 280 }, { x: 760, y: 320 }])
  })

  it('首段下拖、重合折点：to 侧紧邻折点保持原位（对称保护）', () => {
    const l = coincidentLinker()
    const result = segmentDragPoints(l, 1, 0, 40)
    // stub=(680,280)，corner=(680,320)，run=[(760,320)]，tail=[(760,280)] 保持
    expect(result.points).toEqual([
      { x: 680, y: 280 },
      { x: 680, y: 320 },
      { x: 760, y: 320 },
      { x: 760, y: 280 },
    ])
    expect(result.dragged).toEqual([{ x: 680, y: 320 }, { x: 760, y: 320 }])
  })

  it('垂直段轴对称：首段横拖 dx，重合折点同受保护', () => {
    const l = createLinkerInstance(
      { id: 'a', x: 500, y: 100, angle: Math.PI / 2 },
      { id: 'b', x: 500, y: 400, angle: -Math.PI / 2 },
      0,
    )
    l.linkerType = 'broken'
    l.points = [
      { x: 500, y: 250 },
      { x: 500, y: 250 },
    ]
    // 首段 segIndex=1：(500,100)→(500,250) 垂直，dx=40 右拖
    const result = segmentDragPoints(l, 1, 40, 0)
    expect(result.points).toEqual([
      { x: 500, y: 70 },
      { x: 540, y: 70 },
      { x: 540, y: 250 },
      { x: 500, y: 250 },
    ])
    expect(result.dragged).toEqual([{ x: 540, y: 70 }, { x: 540, y: 250 }])
  })

  it('末段下拖、共线非重合折点：保护截停处插正交拐角，全程无斜段', () => {
    const l = coincidentLinker()
    l.points = [
      { x: 700, y: 280 },
      { x: 760, y: 280 },
    ]
    const result = segmentDragPoints(l, 3, 0, 40)
    // head 末点 (700,280) 仍在游程轴上被保留，插拐角 (700,320) 重接
    expect(result.points).toEqual([
      { x: 700, y: 280 },
      { x: 700, y: 320 },
      { x: 760, y: 320 },
      { x: 840, y: 320 },
      { x: 840, y: 280 },
    ])
    expect(result.dragged).toEqual([{ x: 700, y: 320 }, { x: 760, y: 320 }])
  })

  it('末段横拖 dx、垂直段轴重合折点：corner 垂直侧正交无回折', () => {
    const l = createLinkerInstance(
      { id: 'a', x: 500, y: 100, angle: Math.PI / 2 },
      { id: 'b', x: 500, y: 400, angle: -Math.PI / 2 },
      0,
    )
    l.linkerType = 'broken'
    l.points = [
      { x: 500, y: 250 },
      { x: 500, y: 250 },
    ]
    // 末段 segIndex=3：(500,250)→(500,400) 垂直，dx=40 右拖；stub=(500,430)
    const result = segmentDragPoints(l, 3, 40, 0)
    expect(result.points).toEqual([
      { x: 500, y: 250 },
      { x: 540, y: 250 },
      { x: 540, y: 430 },
      { x: 500, y: 430 },
    ])
    expect(result.dragged).toEqual([{ x: 500, y: 250 }, { x: 540, y: 250 }])
  })

  it('n=1 全共线（已知残留）：保护不生效，但不得掉进切出+插入兜底分支', () => {
    // 单折点全共线时对侧附着保护不生效（n≥2 门限，防止兜底分支 tr(to) 平移附着锚点），
    // from 锚点边斜为已知残留；本用例钉住游程路径（输出含 stub 拐角结构）防回归
    const l = coincidentLinker()
    l.points = [{ x: 760, y: 280 }]
    const result = segmentDragPoints(l, 2, 0, 40)
    expect(result.points).toEqual([
      { x: 760, y: 320 },
      { x: 840, y: 320 },
      { x: 840, y: 280 },
    ])
  })

  it('首段下拖、共线非重合折点：保护截停处插正交拐角（tailJoin 镜像）', () => {
    const l = coincidentLinker()
    l.points = [
      { x: 760, y: 280 },
      { x: 820, y: 280 },
    ]
    const result = segmentDragPoints(l, 1, 0, 40)
    // tail 首点 (820,280) 仍在游程轴上被保留，run 末点 (760,320) 与其连接边被拖斜，插拐角 (820,320) 重接
    expect(result.points).toEqual([
      { x: 680, y: 280 },
      { x: 680, y: 320 },
      { x: 760, y: 320 },
      { x: 820, y: 320 },
      { x: 820, y: 280 },
    ])
    expect(result.dragged).toEqual([{ x: 680, y: 320 }, { x: 760, y: 320 }])
  })
})
