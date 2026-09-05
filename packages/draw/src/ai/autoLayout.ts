// src/ai/autoLayout.ts
// AI 生成流程图的本地自动分层布局（简化 Sugiyama，垂直方向）。
// 设计哲学与 colorTheme 一致：AI 负责语义结构（节点+连线），本地负责美观。
// LLM 输出的坐标常把节点堆成一根竖线，本模块按图结构重新摆放：
//   拓扑分层定纵向、同层分支横向展开、层块向父节点重心居中。
// 纯函数：不依赖 store/registry，输入输出全部 plain 数据，可独立单测。
// 坐标约定与 ElementInstance.props 一致：x/y 为左上角，世界坐标。

export interface LayoutNode {
  id: string
  /** 现状坐标（提供布局原点参照与层内初序参照） */
  x: number
  y: number
  w: number
  h: number
  /** 批次内输出顺序（AI 先输出主干后输出分支，作稳定排序初值） */
  order: number
}

export interface LayoutEdge {
  from: string
  to: string
}

export interface AutoLayoutInput {
  /** 参与布局的新元素 */
  movable: LayoutNode[]
  /** 本批连线边（有向）；端点可能落在 fixed 上 */
  edges: LayoutEdge[]
  /** 被边引用的画布既有元素：只读锚，绝不出现在输出里 */
  fixed: LayoutNode[]
}

export interface AutoLayoutOptions {
  /** 层间垂直空隙（上一行底边 → 下一行顶边，边到边） */
  vGap?: number
  /** 同层节点水平空隙（边到边） */
  hGap?: number
  /** 互不连通分量之间的水平间隔 */
  componentGap?: number
}

export interface AutoLayoutResult {
  /** movable id → 新左上角坐标；断言不含 fixed id */
  positions: Map<string, { x: number; y: number }>
  meta: {
    components: number
    layers: number
    /** 被剔除的分层回边（"否→重试"这类指回上方的连线），供调试 */
    backEdges: Array<[string, string]>
  }
}

// 常量依据：flow 节点常见 w 70-160 / h 50-90。
// vGap=80 时垂直中心距 ≥130、hGap=60 时水平中心距 ≥160，
// 满足 systemPrompt「垂直 120 / 水平 150」量级，折线拐点有显示空间且整图不过长。
export const LAYOUT_DEFAULTS = { vGap: 80, hGap: 60, componentGap: 160 }

/** 尺寸下限保护（AI/异常数据可能给 0 或负） */
function safeW(n: LayoutNode): number {
  return Math.max(1, n.w)
}
function safeH(n: LayoutNode): number {
  return Math.max(1, n.h)
}

/** 并查集（弱连通分量划分） */
function createUnionFind(ids: string[]): {
  find: (id: string) => string
  union: (a: string, b: string) => void
} {
  const parent = new Map<string, string>(ids.map((id) => [id, id]))
  const find = (id: string): string => {
    let root = id
    while (parent.get(root) !== root) root = parent.get(root)!
    // 路径压缩
    let cur = id
    while (parent.get(cur) !== root) {
      const next = parent.get(cur)!
      parent.set(cur, root)
      cur = next
    }
    return root
  }
  const union = (a: string, b: string): void => {
    const ra = find(a)
    const rb = find(b)
    if (ra !== rb) parent.set(ra, rb)
  }
  return { find, union }
}

/**
 * 剔除回边（迭代 DFS 三色标记）：返回 DAG 边集与回边列表。
 * 邻接表与起点均按 order 排序，保证确定性。
 */
function stripBackEdges(
  nodes: LayoutNode[],
  edges: LayoutEdge[],
): { dag: LayoutEdge[]; back: Array<[string, string]> } {
  const byOrder = new Map(nodes.map((n) => [n.id, n.order]))
  const adj = new Map<string, string[]>()
  for (const n of nodes) adj.set(n.id, [])
  for (const e of edges) adj.get(e.from)!.push(e.to)
  for (const list of adj.values()) {
    list.sort((a, b) => (byOrder.get(a) ?? 0) - (byOrder.get(b) ?? 0))
  }

  // 起点：组件内入度为 0 者；全在环里则取 order 最小者
  const indeg = new Map<string, number>(nodes.map((n) => [n.id, 0]))
  for (const e of edges) indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1)
  let starts = nodes.filter((n) => (indeg.get(n.id) ?? 0) === 0).map((n) => n.id)
  if (starts.length === 0) {
    starts = [nodes.reduce((a, b) => (a.order <= b.order ? a : b)).id]
  } else {
    starts.sort((a, b) => (byOrder.get(a) ?? 0) - (byOrder.get(b) ?? 0))
  }

  const WHITE = 0
  const GRAY = 1
  const BLACK = 2
  const color = new Map<string, number>(nodes.map((n) => [n.id, WHITE]))
  const back: Array<[string, string]> = []
  const backKeys = new Set<string>()

  for (const root of starts) {
    if (color.get(root) !== WHITE) continue
    // 迭代 DFS：栈帧记录节点与其邻接推进位
    const stack: Array<{ id: string; next: number }> = [{ id: root, next: 0 }]
    color.set(root, GRAY)
    while (stack.length > 0) {
      const frame = stack[stack.length - 1]
      const succ = adj.get(frame.id)!
      if (frame.next < succ.length) {
        const v = succ[frame.next++]
        const c = color.get(v)
        if (c === GRAY) {
          // 指向祖先 → 回边，剔除
          const key = `${frame.id}->${v}`
          if (!backKeys.has(key)) {
            backKeys.add(key)
            back.push([frame.id, v])
          }
        } else if (c === WHITE) {
          color.set(v, GRAY)
          stack.push({ id: v, next: 0 })
        }
        // BLACK：已完成的交叉/前向边，保留
      } else {
        color.set(frame.id, BLACK)
        stack.pop()
      }
    }
  }

  const dag = edges.filter((e) => !backKeys.has(`${e.from}->${e.to}`))
  return { dag, back }
}

/** Kahn 拓扑序上的最长路径分层：layer[n] = max(layer[preds]) + 1 */
function assignLayers(nodes: LayoutNode[], dag: LayoutEdge[]): Map<string, number> {
  const layer = new Map<string, number>(nodes.map((n) => [n.id, 0]))
  const indeg = new Map<string, number>(nodes.map((n) => [n.id, 0]))
  const adj = new Map<string, string[]>(nodes.map((n) => [n.id, []]))
  for (const e of dag) {
    adj.get(e.from)!.push(e.to)
    indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1)
  }

  // 就绪队列按 order 排序取出，保证处理顺序确定
  const orderById = new Map(nodes.map((n) => [n.id, n.order]))
  const ready = nodes.filter((n) => (indeg.get(n.id) ?? 0) === 0).map((n) => n.id)
  const processed = new Set<string>()
  while (ready.length > 0) {
    ready.sort((a, b) => (orderById.get(a) ?? 0) - (orderById.get(b) ?? 0))
    const u = ready.shift()!
    if (processed.has(u)) continue
    processed.add(u)
    for (const v of adj.get(u) ?? []) {
      layer.set(v, Math.max(layer.get(v) ?? 0, (layer.get(u) ?? 0) + 1))
      indeg.set(v, (indeg.get(v) ?? 0) - 1)
      if ((indeg.get(v) ?? 0) === 0) ready.push(v)
    }
  }
  // 理论上不可达（DAG 必全清）；防御性保留未处理节点 layer=0
  return layer
}

/**
 * 单个连通分量的分层布局，输出以 (0,0) 为包围盒左上的局部坐标。
 * 返回 positions（局部）与层数。
 */
function layoutComponent(
  nodes: LayoutNode[],
  dag: LayoutEdge[],
  fixedParents: LayoutEdge[], // fixed(from) → movable(to)：既有节点作为首层对齐参考
  fixedCenters: Map<string, number>, // fixed id → 中心 x（已换算为本分量局部系：world − originX）
  vGap: number,
  hGap: number,
): { local: Map<string, { x: number; y: number }>; layerCount: number } {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const layer = assignLayers(nodes, dag)
  const layerCount = Math.max(...nodes.map((n) => (layer.get(n.id) ?? 0))) + 1

  // 按层分组，初序 = AI 输出顺序（order）
  const layers: LayoutNode[][] = Array.from({ length: layerCount }, () => [])
  for (const n of [...nodes].sort((a, b) => a.order - b.order)) {
    layers[layer.get(n.id) ?? 0].push(n)
  }

  // 前驱表（DAG 边 + fixed 父边，仅取"to 在本组件"的）
  const parents = new Map<string, string[]>(nodes.map((n) => [n.id, []]))
  for (const e of dag) parents.get(e.to)?.push(e.from)
  for (const e of fixedParents) parents.get(e.to)?.push(e.from)

  // 一次重心排序：有父者按父重心，无父者保持原序（fallback 用当前序号）
  const posIdx = new Map<string, number>()
  layers.forEach((layerNodes, k) => {
    const keyed = layerNodes.map((n, i) => {
      const ps = (parents.get(n.id) ?? []).filter((p) => posIdx.has(p))
      const key = ps.length > 0 ? ps.reduce((s, p) => s + posIdx.get(p)!, 0) / ps.length : i
      return { n, key, i }
    })
    keyed.sort((a, b) => a.key - b.key || a.n.order - b.n.order)
    const sorted = keyed.map((k) => k.n)
    layers[k] = sorted
    sorted.forEach((n, i) => posIdx.set(n.id, i))
  })

  // 纵向：层顶累加（每层高度取层内最大 h），节点层内垂直居中
  const local = new Map<string, { x: number; y: number }>()
  let top = 0
  for (const layerNodes of layers) {
    const hMax = Math.max(...layerNodes.map((n) => safeH(n)))
    for (const n of layerNodes) {
      local.set(n.id, { x: 0, y: top + (hMax - safeH(n)) / 2 })
    }
    top += hMax + vGap
  }

  // 横向：层内按 hGap 展开，整层平移至 ≈ 前驱重心。
  // 局部坐标系以 (originX, originY) 为参照原点在调用方加回：
  // 无前驱的层从 0 起排；有 fixed 父的层直接对齐 fixed（追加链落在既有节点正下方）。
  // 分支展开可能产生负 x——这是相对 origin 的正确摆位，不归一化抹除。
  for (let k = 0; k < layerCount; k++) {
    const layerNodes = layers[k]
    const band =
      layerNodes.reduce((s, n) => s + safeW(n), 0) + hGap * (layerNodes.length - 1)

    let sum = 0
    let cnt = 0
    for (const n of layerNodes) {
      for (const p of parents.get(n.id) ?? []) {
        const pc = local.get(p)
        if (pc && byId.has(p)) {
          sum += pc.x + safeW(byId.get(p)!) / 2
          cnt++
        } else {
          const f = fixedCenters.get(p)
          if (f != null) {
            sum += f
            cnt++
          }
        }
      }
    }
    const target = cnt > 0 ? sum / cnt : band / 2

    let cursor = target - band / 2
    for (const n of layerNodes) {
      local.get(n.id)!.x = cursor
      cursor += safeW(n) + hGap
    }
  }

  return { local, layerCount }
}

/**
 * 计算分层布局。
 * - 输出仅含 movable 的新左上角坐标；fixed 绝不出现。
 * - 各连通分量独立布局后横排，x 起点 = max(自身 origin.x, 前分量右缘 + componentGap)，
 *   y 用自己的 origin——"只推不拉"，图整体不会跳走。
 */
export function computeLayeredLayout(
  input: AutoLayoutInput,
  opts?: AutoLayoutOptions,
): AutoLayoutResult {
  const vGap = opts?.vGap ?? LAYOUT_DEFAULTS.vGap
  const hGap = opts?.hGap ?? LAYOUT_DEFAULTS.hGap
  const componentGap = opts?.componentGap ?? LAYOUT_DEFAULTS.componentGap

  const positions = new Map<string, { x: number; y: number }>()
  const meta = { components: 0, layers: 0, backEdges: [] as Array<[string, string]> }
  if (input.movable.length === 0) return { positions, meta }

  const movableMap = new Map(input.movable.map((n) => [n.id, n]))
  const fixedMap = new Map(input.fixed.map((n) => [n.id, n]))

  // 1) 边规范化：去重、剔自环、剔悬空（movable/fixed 之外的未知 id）、剔两端皆 fixed
  const seen = new Set<string>()
  const edges: LayoutEdge[] = []
  for (const e of input.edges) {
    if (e.from === e.to) continue
    const known = (id: string) => movableMap.has(id) || fixedMap.has(id)
    if (!known(e.from) || !known(e.to)) continue
    if (!movableMap.has(e.from) && !movableMap.has(e.to)) continue
    const key = `${e.from}->${e.to}`
    if (seen.has(key)) continue
    seen.add(key)
    edges.push(e)
  }

  // 2) 弱连通分量（仅 movable 间边参与合并；fixed 端点不分量）
  const uf = createUnionFind(input.movable.map((n) => n.id))
  for (const e of edges) {
    if (movableMap.has(e.from) && movableMap.has(e.to)) uf.union(e.from, e.to)
  }
  const compOf = new Map<string, string>()
  for (const n of input.movable) compOf.set(n.id, uf.find(n.id))
  const compNodes = new Map<string, LayoutNode[]>()
  for (const n of input.movable) {
    const root = compOf.get(n.id)!
    if (!compNodes.has(root)) compNodes.set(root, [])
    compNodes.get(root)!.push(n)
  }

  // 分量顺序：按原始 minX 升序（保持 AI 的全局左右习惯）
  const components = [...compNodes.values()].sort((a, b) => {
    const minAx = Math.min(...a.map((n) => n.x))
    const minBx = Math.min(...b.map((n) => n.x))
    return minAx - minBx || Math.min(...a.map((n) => n.order)) - Math.min(...b.map((n) => n.order))
  })

  // fixed 世界重心表
  const fixedWorldCenters = new Map<string, number>()
  for (const n of input.fixed) fixedWorldCenters.set(n.id, n.x + safeW(n) / 2)

  // 3) 逐分量布局 → 横排平移（只推不拉：被前一分量挤占时右移，否则锚自己的 origin）
  let prevRight = -Infinity
  for (const nodes of components) {
    const idSet = new Set(nodes.map((n) => n.id))
    const compEdges = edges.filter((e) => idSet.has(e.from) && idSet.has(e.to))
    const fixedParentEdges = edges.filter((e) => !movableMap.has(e.from) && idSet.has(e.to))

    const { dag, back } = stripBackEdges(nodes, compEdges)
    meta.backEdges.push(...back)

    // 分量原始包围盒左上 = 布局原点；fixed 重心换算到以 originX 为零点的局部系
    const originX = Math.min(...nodes.map((n) => n.x))
    const originY = Math.min(...nodes.map((n) => n.y))
    const fixedCenters = new Map<string, number>()
    for (const e of fixedParentEdges) {
      const wc = fixedWorldCenters.get(e.from)
      if (wc != null) fixedCenters.set(e.from, wc - originX)
    }

    const { local, layerCount } = layoutComponent(nodes, dag, fixedParentEdges, fixedCenters, vGap, hGap)
    meta.layers = Math.max(meta.layers, layerCount)

    let bboxMinX = Infinity
    let bboxMaxX = -Infinity
    for (const n of nodes) {
      const lx = local.get(n.id)!.x
      bboxMinX = Math.min(bboxMinX, lx)
      bboxMaxX = Math.max(bboxMaxX, lx + safeW(n))
    }
    const x0 =
      prevRight === -Infinity
        ? originX
        : Math.max(originX, prevRight + componentGap - bboxMinX)
    prevRight = x0 + bboxMaxX

    for (const n of nodes) {
      const p = local.get(n.id)!
      positions.set(n.id, { x: x0 + p.x, y: originY + p.y })
    }
  }
  meta.components = components.length

  return { positions, meta }
}

// ═══════════════════════════════════════════
// 穿越检测（供 AI 重锚选路：折线段 vs 中间图形矩形）
// ═══════════════════════════════════════════

/** 线段与矩形是否相交（Liang-Barsky 参数裁剪）。
 *  inset 将矩形四边内收，规避贴边/共端点的误报（端点锚点恰在图形边上属正常连接）。 */
export function segIntersectsRect(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  rect: { x: number; y: number; w: number; h: number },
  inset = 2,
): boolean {
  const rx = rect.x + inset
  const ry = rect.y + inset
  const rw = rect.w - inset * 2
  const rh = rect.h - inset * 2
  if (rw <= 0 || rh <= 0) return false
  // 端点落在矩形内必相交
  const inside = (p: { x: number; y: number }) =>
    p.x > rx && p.x < rx + rw && p.y > ry && p.y < ry + rh
  if (inside(p1) || inside(p2)) return true

  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  let t0 = 0
  let t1 = 1
  const clip = (p: number, q: number): boolean => {
    if (p === 0) return q >= 0
    const t = q / p
    if (p < 0) {
      if (t > t1) return false
      if (t > t0) t0 = t
    } else {
      if (t < t0) return false
      if (t < t1) t1 = t
    }
    return true
  }
  return (
    clip(-dx, p1.x - rx) &&
    clip(dx, rx + rw - p1.x) &&
    clip(-dy, p1.y - ry) &&
    clip(dy, ry + rh - p1.y)
  )
}

/** 折线路径（含首尾端点）穿过的矩形 id 列表；excludeIds 为两端所属图形（连接本身不算穿越）。
 *  返回顺序跟随 rects 的插入序，确定性可测。 */
export function findCrossedRects(
  full: ReadonlyArray<{ x: number; y: number }>,
  rects: ReadonlyMap<string, { x: number; y: number; w: number; h: number }>,
  excludeIds: ReadonlySet<string>,
  inset = 2,
): string[] {
  const hit: string[] = []
  for (const [id, rect] of rects) {
    if (excludeIds.has(id)) continue
    for (let i = 0; i < full.length - 1; i++) {
      if (segIntersectsRect(full[i], full[i + 1], rect, inset)) {
        hit.push(id)
        break
      }
    }
  }
  return hit
}
