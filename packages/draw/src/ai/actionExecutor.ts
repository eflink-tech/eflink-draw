// src/ai/actionExecutor.ts
// 解析 LLM 输出的 actions 数组，调用 editorStore API 执行动作。
//   - refId 映射：LLM 自拟的临时 id → 真实元素 id
//   - 级联删除：delete_element 时连同附着连线一并删除
//   - 连线跟随：update_element 改变位置时，调用 routeAttachedLinkers 重路由
//   - 历史批量：beginBatch / commitBatch 将整批动作打包为一个撤销单元
import type { AIAction, AddElementAction, AddLinkerAction, UpdateElementAction, DeleteElementAction } from './types'
import type { ElementInstance, LinkerInstance, ShapeDefinition } from '@/types'
import { routeAttachedLinkers, type LiveShapeState } from '@/core/editor/documentOps'
import {
  createLinkerInstance,
  getAnchorPoints,
  getAngleDir,
  getLinkerPoints,
  measureDistance,
  type LinkerRouteOptions,
  type Point,
  type ShapeRect,
} from '@/core/editor/linker'
import { applyThemeToElement, sanitizeStyleOverride } from './colorTheme'
import { computeLayeredLayout, findCrossedRects, type LayoutNode } from './autoLayout'

/**
 * ActionExecutor 所依赖的 editorStore 最小切片。
 * 便于测试注入 mock，也便于未来替换为其它实现。
 */
export interface ActionExecutorStore {
  addElement: (element: ElementInstance) => void
  addLinker: (linker: LinkerInstance) => void
  updateElement: (id: string, updates: Partial<ElementInstance>) => void
  updateLinker: (id: string, updates: Partial<LinkerInstance>) => void
  deleteElements: (ids: string[]) => void
  beginBatch: (ids?: string[]) => void
  commitBatch: () => void
  readonly document: { elements: Record<string, ElementInstance | LinkerInstance> }
}

/**
 * ShapeRegistry 最小切片。
 * createElement 返回 null 表示 schema 不存在。
 */
export interface ActionExecutorRegistry {
  createElement: (shapeName: string, x: number, y: number) => ElementInstance | null
  /** 读取 schema 原始定义：语义主题需区分「schema 自带样式」与「兜底白色」 */
  getShape: (shapeName: string) => ShapeDefinition | undefined
}

/** execute 可选项 */
export interface ExecuteOptions {
  /** 跳过自动分层布局（图片复刻模式：AI 按原图等比摆位，坐标原样落库） */
  skipLayout?: boolean
}

export interface ExecutionResult {
  /** 成功添加的元素/连线 id（按动作顺序） */
  added: string[]
  /** 成功更新的元素 id */
  updated: string[]
  /** 删除统计 */
  deleted: {
    elements: number
    cascadeLinkers: number
  }
  /** 跳过的动作及原因 */
  skipped: { action: AIAction; reason: string }[]
  /** 自动分层布局统计（本批未触发布局时为 undefined） */
  layout?: {
    /** 被移动的元素数 */
    moved: number
    /** 剔出分层图的回边数（"否→重试"类连线，布局保留仅不参与分层） */
    backEdges: number
  }
}

/** 安全属性存在性检查（项目 target 早于 es2022，无 Object.hasOwn） */
function hasOwnKey(obj: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 * 选择图形上朝向 target 点最近的锚点。
 * AI 不知道应连接哪个锚点，按"另一端中心指向本端的方向"选最近锚点，
 * 符合大多数流程图连接场景（左右连接走左右锚点、上下连接走上下锚点）。
 */
function pickAnchorToward(
  el: ElementInstance,
  target: { x: number; y: number },
): { x: number; y: number; angle: number } {
  const anchors = getAnchorPoints(el)
  if (anchors.length === 0) {
    const { x, y, w, h } = el.props
    return { x: x + w / 2, y: y + h / 2, angle: 0 }
  }
  let best = anchors[0]
  let bestDist = Infinity
  for (const a of anchors) {
    const dist = measureDistance(a, target)
    if (dist < bestDist) {
      bestDist = dist
      best = a
    }
  }
  return best
}

/** 元素"新位置视图"：仅替换 props.x/y 的浅拷贝（供布局后重锚计算，不动原对象） */
function applyPos(
  el: ElementInstance,
  pos: { x: number; y: number } | undefined,
): ElementInstance {
  if (!pos) return el
  return { ...el, props: { ...el.props, x: pos.x, y: pos.y } }
}

/** 元素中心（props.x/y 为左上角） */
function centerOf(el: ElementInstance): { x: number; y: number } {
  return { x: el.props.x + el.props.w / 2, y: el.props.y + el.props.h / 2 }
}

// ═══════════════════════════════════════════
// 布局后重锚的侧锚绕行：双向边分离（1b）与跳连穿越规避（1c）共用
// ═══════════════════════════════════════════

/** 锚点方位（值对应 getAngleDir 语义：1 上 2 右 3 下 4 左） */
type Side = 'top' | 'right' | 'bottom' | 'left'
const SIDE_TO_DIR: Record<Side, 1 | 2 | 3 | 4> = { top: 1, right: 2, bottom: 3, left: 4 }

/** 取图形指定侧的锚点；无该侧锚点（free 文本/异形图形）返回 null */
function anchorOnSide(
  el: ElementInstance,
  side: Side,
): { x: number; y: number; angle: number } | null {
  const dir = SIDE_TO_DIR[side]
  for (const a of getAnchorPoints(el)) {
    if (getAngleDir(a.angle) === dir) return a
  }
  return null
}

/** 一条边的侧锚候选对（坐标 + 内向角，不含所属图形 id） */
interface SidePairCandidate {
  from: { x: number; y: number; angle: number }
  to: { x: number; y: number; angle: number }
}

/**
 * 侧向锚点候选对，外侧优先：
 * from 中心在 to 左侧（含正上/正下）→ 先试 left↔left 再试 right↔right；在右则镜像。
 * 双向边分离依赖它：互逆的两条边分别走两侧，几何上不再重叠。
 * 缺侧锚点时丢弃该候选（可能返回空数组）。
 */
function sidePairCandidates(
  fromView: ElementInstance,
  toView: ElementInstance,
): SidePairCandidate[] {
  const sides: Array<[Side, Side]> =
    centerOf(fromView).x <= centerOf(toView).x
      ? [['left', 'left'], ['right', 'right']]
      : [['right', 'right'], ['left', 'left']]
  const out: SidePairCandidate[] = []
  for (const [fs, ts] of sides) {
    const fa = anchorOnSide(fromView, fs)
    const ta = anchorOnSide(toView, ts)
    if (fa && ta) out.push({ from: fa, to: ta })
  }
  return out
}

/**
 * 检测批内互逆边对（A→B 与 B→A 并存）：
 * 返回需要侧锚绕行的边 key 集合（`${from}->${to}`）——同一对中后出现者绕行，
 * 先出现者保留默认锚点，两条边即几何分离。
 */
function detectReverseEdges(
  validLinkers: ReadonlyArray<{ from: string; to: string }>,
): Set<string> {
  const seen = new Set<string>()
  const reroute = new Set<string>()
  for (const b of validLinkers) {
    if (seen.has(`${b.to}->${b.from}`)) reroute.add(`${b.from}->${b.to}`)
    seen.add(`${b.from}->${b.to}`)
  }
  return reroute
}

/** 重锚候选：from/to 端点 + 该锚点组合下的折线路径 */
interface RerouteCandidate {
  from: LinkerInstance['from']
  to: LinkerInstance['to']
  points: Point[]
}

/** 重锚候选规格：from/to 端点 + 可选路由参数（穿越检测时传入 getLinkerPoints） */
interface RerouteCandidateSpec {
  from: LinkerInstance['from']
  to: LinkerInstance['to']
  routeOpts?: LinkerRouteOptions
}

export class ActionExecutor {
  /** 本批动作的 refId → 真实 id 映射 */
  private refIdMap = new Map<string, string>()
  /** 本批成功创建的图形 id（add 顺序，供自动布局登记） */
  private batchElementIds: string[] = []
  /** 本批成功创建的连线（端点为真实 id），供自动布局重锚 */
  private batchLinkers: Array<{ id: string; from: string; to: string }> = []

  constructor(
    private readonly store: ActionExecutorStore,
    private readonly registry: ActionExecutorRegistry,
  ) {}

  /**
   * 安全读取元素：仅匹配自有键。
   * elements 是普通对象字面量，直接下标访问会命中原型链
   * （AI 可输出 "__proto__"/"toString" 等危险 id），必须做防护。
   */
  private getElement(id: string): ElementInstance | LinkerInstance | undefined {
    return hasOwnKey(this.store.document.elements, id)
      ? this.store.document.elements[id]
      : undefined
  }

  /**
   * 执行一批 AI 动作。
   * 整批包裹在 beginBatch / commitBatch 中，构成单个撤销单元。
   */
  async execute(actions: AIAction[], options?: ExecuteOptions): Promise<ExecutionResult> {
    this.refIdMap.clear()
    this.batchElementIds = []
    this.batchLinkers = []
    this.store.beginBatch()

    const result: ExecutionResult = {
      added: [],
      updated: [],
      deleted: { elements: 0, cascadeLinkers: 0 },
      skipped: [],
    }

    try {
      // 两遍执行：先建全部元素，再执行其余动作。
      // LLM 常按思考顺序交错输出元素与连线（连线可能引用其后才定义的 refId），
      // 单遍顺序执行会因前向引用导致大量连线被跳过。
      for (const action of actions) {
        if (action.type === 'add_element') {
          await this.executeAction(action, result)
        }
      }
      for (const action of actions) {
        if (action.type !== 'add_element') {
          await this.executeAction(action, result)
        }
      }
      // 自动分层布局：AI 坐标只当参考，本批新生成的流程图按图结构重排。
      // 在 commitBatch 之前执行，布局并入同一撤销单元（一次 ⌘Z 整体回退）。
      // 图片复刻模式（skipLayout）不重排——坐标即原图等比映射结果。
      if (!options?.skipLayout) {
        this.runAutoLayout(result)
      }
      this.store.commitBatch()
    } catch (error) {
      // 异常路径下仍要关闭 batch，避免历史栈状态错位
      this.store.commitBatch()
      throw error
    }

    return result
  }

  private async executeAction(action: AIAction, result: ExecutionResult): Promise<void> {
    switch (action.type) {
      case 'add_element':
        this.handleAddElement(action, result)
        break
      case 'add_linker':
        this.handleAddLinker(action, result)
        break
      case 'update_element':
        this.handleUpdateElement(action, result)
        break
      case 'delete_element':
        this.handleDeleteElement(action, result)
        break
      case 'update_linker':
        this.handleUpdateLinker(action, result)
        break
      case 'delete_linker':
        this.handleDeleteLinker(action, result)
        break
      default:
        result.skipped.push({
          action,
          reason: `Unknown action type: ${(action as { type: string }).type}`,
        })
    }
  }

  private handleAddElement(action: AddElementAction, result: ExecutionResult): void {
    const element = this.registry.createElement(action.schema, action.x, action.y)
    if (!element) {
      result.skipped.push({ action, reason: `schema "${action.schema}" not found in registry` })
      return
    }

    // 写入文本（LLM 通过 text 字段指定）
    // 先捕获到 const，避免类型收窄在 .map 回调闭包中丢失
    const addText = action.text
    if (addText !== undefined && element.textBlock && element.textBlock.length > 0) {
      element.textBlock = element.textBlock.map((block, i) =>
        i === 0 ? { ...block, text: addText } : block,
      )
    }

    // 语义配色（draw.io 浅色填充+深色描边）+ AI 可选 style 覆盖（白名单清洗后生效）。
    // 必须在 addElement 入 store 之前完成，作为创建快照的一部分进入撤销栈。
    applyThemeToElement(
      element,
      this.registry.getShape(action.schema),
      sanitizeStyleOverride(action.style),
    )

    this.store.addElement(element)
    if (action.refId) {
      this.refIdMap.set(action.refId, element.id)
    }
    this.batchElementIds.push(element.id)
    result.added.push(element.id)
  }

  private handleAddLinker(action: AddLinkerAction, result: ExecutionResult): void {
    const fromId = this.resolveRefId(action.from)
    const toId = this.resolveRefId(action.to)

    if (!fromId || !toId) {
      const missing = [
        !fromId ? `from="${action.from}"` : '',
        !toId ? `to="${action.to}"` : '',
      ]
        .filter(Boolean)
        .join('、')
      result.skipped.push({ action, reason: `连线端点未解析（${missing}）` })
      return
    }

    // 添加前先删除已有的同端点连线，避免重复叠加
    this.removeExistingLinkerBetween(fromId, toId, result)

    const linker = this.buildLinker(fromId, toId, action)
    this.store.addLinker(linker)
    if (action.refId) {
      this.refIdMap.set(action.refId, linker.id)
    }
    this.batchLinkers.push({ id: linker.id, from: fromId, to: toId })
    result.added.push(linker.id)
  }

  /**
   * 自动分层布局：对本批新生成的流程图（≥3 个可移动图形且有内部连线）按图结构重排坐标，
   * 覆盖 LLM 常把节点堆成一列的垃圾坐标。整批仍在 execute() 的 beginBatch/commitBatch 内。
   * 落库顺序契约与 handleUpdateElement 相同：全部 updateLinker 先于任何 updateElement。
   */
  private runAutoLayout(result: ExecutionResult): void {
    // 1. 收集仍存在的批次图形（可能被批内 delete_element 删掉）
    const alive: ElementInstance[] = []
    for (const id of this.batchElementIds) {
      const el = this.getElement(id)
      if (el && el.name !== 'linker') alive.push(el as ElementInstance)
    }
    if (alive.length < 3) return

    // 2. 闸门：泳道/容器结构绝不自动搬（归属必被破坏）
    const isLaneOrContainer = (el: ElementInstance): boolean =>
      el.category === 'lane' || !!el.parent || (el.children?.length ?? 0) > 0
    if (alive.some(isLaneOrContainer)) return

    // 3. 可移动分区：free（文本）排除、原地不动
    const movable = alive.filter((el) => el.category !== 'free')
    if (movable.length < 3) return
    const movableIds = new Set(movable.map((el) => el.id))

    // 4. 有效批内连线（未被批内删除、两端图形仍存在）；既有端点作为 fixed 对齐锚。
    //    任一端是既有泳道 → 整批跳过（往泳道里塞节点布局必破坏归属）
    const validLinkers: Array<{ id: string; from: string; to: string; fromEl: ElementInstance; toEl: ElementInstance }> = []
    const fixedIds = new Set<string>()
    for (const b of this.batchLinkers) {
      const linker = this.getElement(b.id)
      if (!linker || linker.name !== 'linker') continue
      const fromEl = this.getElement(b.from)
      const toEl = this.getElement(b.to)
      if (!fromEl || !toEl || fromEl.name === 'linker' || toEl.name === 'linker') continue
      if (isLaneOrContainer(fromEl as ElementInstance) || isLaneOrContainer(toEl as ElementInstance)) return
      validLinkers.push({ ...b, fromEl: fromEl as ElementInstance, toEl: toEl as ElementInstance })
      if (!movableIds.has(b.from)) fixedIds.add(b.from)
      if (!movableIds.has(b.to)) fixedIds.add(b.to)
    }

    // 5. 触发：至少一条两端都在 movable 的批内边（纯散落节点不布局）
    const edges = validLinkers.map(({ from, to }) => ({ from, to }))
    if (!edges.some((e) => movableIds.has(e.from) && movableIds.has(e.to))) return

    const orderById = new Map(alive.map((el, i) => [el.id, i]))
    const toNode = (el: ElementInstance, order: number): LayoutNode => ({
      id: el.id,
      x: el.props.x,
      y: el.props.y,
      w: el.props.w,
      h: el.props.h,
      order,
    })
    const fixed: LayoutNode[] = []
    for (const id of fixedIds) {
      const el = this.getElement(id) as ElementInstance | undefined
      if (el && el.name !== 'linker') fixed.push(toNode(el, -1))
    }

    const { positions, meta } = computeLayeredLayout({
      movable: movable.map((el) => toNode(el, orderById.get(el.id) ?? 0)),
      edges,
      fixed,
    })
    if (positions.size === 0) return

    // 布局后视角的矩形读取（movable → 新坐标，其余 → store 现值）
    const getRectNew = (id: string): ShapeRect | null => {
      const el = this.getElement(id)
      if (!el || el.name === 'linker') return null
      const e = el as ElementInstance
      const p = positions.get(e.id)
      return p
        ? { x: p.x, y: p.y, w: e.props.w, h: e.props.h }
        : { x: e.props.x, y: e.props.y, w: e.props.w, h: e.props.h }
    }

    // a) 重锚批内连线：按新位置重选两端锚点 + 重算折点。
    //    不用 routeAttachedLinkers 的比例跟随——那会保留 AI 垃圾坐标下选出的错误锚点身份。
    //    候选序列：互逆边（双向边）先试侧锚绕行分离，普通边先试默认锚、侧锚兜底；
    //    每个候选用 findCrossedRects 做穿越检测，取第一条无穿越路径（跳连边不再穿中间节点）；
    //    全部候选都有碰撞时保留默认锚点（宁可穿越也不产生怪异绕行）。
    //    穿越检测的矩形集合覆盖全文档（含画布既有元素）。
    const allRects = new Map<string, ShapeRect>()
    for (const el of Object.values(this.store.document.elements)) {
      if (el.name === 'linker') continue
      const r = getRectNew(el.id)
      if (r) allRects.set(el.id, r)
    }
    const reverseIds = detectReverseEdges(validLinkers)
    const rerouted = new Set<string>()
    for (const b of validLinkers) {
      if (!positions.has(b.from) && !positions.has(b.to)) continue // 两端都没动
      const linker = this.getElement(b.id) as LinkerInstance
      const fromView = applyPos(b.fromEl, positions.get(b.from))
      const toView = applyPos(b.toEl, positions.get(b.to))
      const dflt: RerouteCandidateSpec = {
        from: { id: b.from, ...pickAnchorToward(fromView, centerOf(toView)) },
        to: { id: b.to, ...pickAnchorToward(toView, centerOf(fromView)) },
      }
      // 同锚点但过渡段贴近下方图形：跨层跳连边的中点过渡落在中间行带内时，
      // 贴边版本可把水平段让到层间空隙（仅 fast path 且 bot 为上锚时生效）
      const dfltNearBot: RerouteCandidateSpec = {
        from: dflt.from,
        to: dflt.to,
        routeOpts: { midY: 'nearBot' },
      }
      const sidePairs = sidePairCandidates(fromView, toView).map((c) => ({
        from: { id: b.from, ...c.from },
        to: { id: b.to, ...c.to },
      }))
      const candidates: RerouteCandidateSpec[] =
        reverseIds.has(`${b.from}->${b.to}`)
          ? [...sidePairs, dflt, dfltNearBot]
          : [dflt, dfltNearBot, ...sidePairs]
      const excludeIds = new Set([b.from, b.to])
      let chosen: RerouteCandidate | null = null
      for (const cand of candidates) {
        const pts = getLinkerPoints(
          { ...linker, from: cand.from, to: cand.to },
          getRectNew,
          cand.routeOpts,
        )
        const crossed = findCrossedRects([cand.from, ...pts, cand.to], allRects, excludeIds)
        if (crossed.length === 0) {
          chosen = { from: cand.from, to: cand.to, points: pts }
          break
        }
      }
      // 全碰撞保留默认锚点
      const finalCand: RerouteCandidate = chosen ?? {
        from: dflt.from,
        to: dflt.to,
        points: getLinkerPoints({ ...linker, from: dflt.from, to: dflt.to }, getRectNew),
      }
      this.store.updateLinker(b.id, finalCand)
      rerouted.add(b.id)
    }

    // b) 防御兜底：附着在 movable 上但未走重锚路径的存量连线（理论上不存在）按比例跟随
    const livePos = new Map<string, LiveShapeState>()
    for (const [id, p] of positions) livePos.set(id, { x: p.x, y: p.y })
    for (const [lid, nl] of routeAttachedLinkers(this.store.document.elements, livePos)) {
      if (rerouted.has(lid)) continue
      this.store.updateLinker(lid, nl)
    }

    // c) 最后才移动图形（锁序同 handleUpdateElement：updateLinker 全部先于 updateElement）
    for (const [id, p] of positions) {
      const el = this.getElement(id) as ElementInstance | undefined
      if (!el) continue
      this.store.updateElement(id, { props: { ...el.props, x: p.x, y: p.y } })
    }

    result.layout = { moved: positions.size, backEdges: meta.backEdges.length }
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console -- DEV 模式诊断输出
      console.log('[AI] autoLayout:', { moved: positions.size, components: meta.components, backEdges: meta.backEdges })
    }
  }

  /**
   * 删除从 fromId 到 toId 的所有已有连线。
   * AI 多次生成同一流程图时，避免旧连线与新连线叠加。
   */
  private removeExistingLinkerBetween(fromId: string, toId: string, result: ExecutionResult): void {
    const toDelete: string[] = []
    for (const el of Object.values(this.store.document.elements)) {
      if (el.name !== 'linker') continue
      const l = el as LinkerInstance
      if (l.from.id === fromId && l.to.id === toId) {
        toDelete.push(l.id)
      }
    }
    if (toDelete.length > 0) {
      this.store.deleteElements(toDelete)
      result.deleted.elements += toDelete.length
    }
  }

  private handleUpdateElement(action: UpdateElementAction, result: ExecutionResult): void {
    const resolvedId = this.resolveRefId(action.id)
    if (!resolvedId) {
      result.skipped.push({ action, reason: `Element "${action.id}" not resolved` })
      return
    }
    const el = this.getElement(resolvedId)
    if (!el || el.name === 'linker') {
      result.skipped.push({ action, reason: `Element "${resolvedId}" not found` })
      return
    }

    const shape = el as ElementInstance
    const propsPatch: Partial<ElementInstance['props']> = {}
    if (action.x !== undefined) propsPatch.x = action.x
    if (action.y !== undefined) propsPatch.y = action.y
    if (action.w !== undefined) propsPatch.w = action.w
    if (action.h !== undefined) propsPatch.h = action.h

    const updates: Partial<ElementInstance> = {}
    if (Object.keys(propsPatch).length > 0) {
      updates.props = { ...shape.props, ...propsPatch }
    }

    // 写入文本（与 handleAddElement 保持一致）
    // 先捕获到 const，避免类型收窄在 .map 回调闭包中丢失
    const updateText = action.text
    if (updateText !== undefined && shape.textBlock) {
      updates.textBlock = shape.textBlock.map((block, i) =>
        i === 0 ? { ...block, text: updateText } : block,
      )
    }

    // 位置/尺寸变化时，先基于旧文档状态 + 新目标位置计算重路由
    // 必须在 updateElement 之前调用，否则 store.document.elements 已是新值，
    // routeAttachedLinkers 无法获得旧包围盒进行比例映射。
    const positionChanged = action.x !== undefined || action.y !== undefined
    const sizeChanged = action.w !== undefined || action.h !== undefined
    if (positionChanged || sizeChanged) {
      const livePos: LiveShapeState = {
        x: action.x ?? shape.props.x,
        y: action.y ?? shape.props.y,
      }
      if (action.w !== undefined) livePos.w = action.w
      if (action.h !== undefined) livePos.h = action.h
      const rerouted = routeAttachedLinkers(this.store.document.elements, new Map([[resolvedId, livePos]]))
      for (const [lid, newLinker] of rerouted) {
        this.store.updateLinker(lid, newLinker)
      }
    }

    this.store.updateElement(resolvedId, updates)

    result.updated.push(resolvedId)
  }

  private handleDeleteElement(action: DeleteElementAction, result: ExecutionResult): void {
    const resolvedId = this.resolveRefId(action.id)
    if (!resolvedId) {
      result.skipped.push({ action, reason: `Element "${action.id}" not resolved` })
      return
    }
    const idsToDelete = this.collectCascadeDeleteIds(resolvedId)
    if (idsToDelete.length === 0) {
      result.skipped.push({ action, reason: `Element "${resolvedId}" not found` })
      return
    }

    const cascadeLinkers = idsToDelete.length - 1
    this.store.deleteElements(idsToDelete)

    result.deleted.elements += 1
    result.deleted.cascadeLinkers += cascadeLinkers
  }

  private handleUpdateLinker(action: Extract<AIAction, { type: 'update_linker' }>, result: ExecutionResult): void {
    const resolvedId = this.resolveRefId(action.id)
    if (!resolvedId) {
      result.skipped.push({ action, reason: `Linker "${action.id}" not resolved` })
      return
    }
    const el = this.getElement(resolvedId)
    if (!el || el.name !== 'linker') {
      result.skipped.push({ action, reason: `Linker "${resolvedId}" not found` })
      return
    }
    const updates: Partial<LinkerInstance> = {}
    if (action.text !== undefined) updates.text = action.text
    this.store.updateLinker(resolvedId, updates)
  }

  private handleDeleteLinker(action: Extract<AIAction, { type: 'delete_linker' }>, result: ExecutionResult): void {
    const resolvedId = this.resolveRefId(action.id)
    if (!resolvedId) {
      result.skipped.push({ action, reason: `Linker "${action.id}" not resolved` })
      return
    }
    const el = this.getElement(resolvedId)
    if (!el || el.name !== 'linker') {
      result.skipped.push({ action, reason: `Linker "${resolvedId}" not found` })
      return
    }
    this.store.deleteElements([resolvedId])
    result.deleted.elements += 1
  }

  /**
   * 解析 refId：本批动作新增的元素走 refIdMap；若是画布已有的真实 id 则直接返回；
   * 未知引用返回 undefined，调用方应据此跳过该动作。
   */
  private resolveRefId(ref: string): string | undefined {
    if (this.refIdMap.has(ref)) return this.refIdMap.get(ref)
    // 画布上下文中已有的真实 id（仅匹配自有键，防原型链）
    if (hasOwnKey(this.store.document.elements, ref)) return ref
    // 容错：AI 大小写不一致时按不区分大小写匹配本批 refId
    const lower = ref.toLowerCase()
    for (const [key, realId] of this.refIdMap) {
      if (key.toLowerCase() === lower) return realId
    }
    // 未知引用（既不是本批 refId 也不是画布已有 id）
    return undefined
  }

  /**
   * 根据 from/to id 构造 LinkerInstance。
   * - 端点坐标：按"另一端中心"方向选本端最近锚点（而非元素中心），保证连线吸附到图形边缘
   * - 箭头样式：复用 createLinkerInstance 的 LINKER_DEFAULTS（默认末端实心箭头）
   * - 路径点：立即调用 getLinkerPoints 计算折线/曲线的中间点
   */
  private buildLinker(fromId: string, toId: string, action: AddLinkerAction): LinkerInstance {
    const fromEl = this.getElement(fromId) as ElementInstance | undefined
    const toEl = this.getElement(toId) as ElementInstance | undefined
    const fromCenter = fromEl
      ? { x: fromEl.props.x + fromEl.props.w / 2, y: fromEl.props.y + fromEl.props.h / 2 }
      : { x: 0, y: 0 }
    const toCenter = toEl
      ? { x: toEl.props.x + toEl.props.w / 2, y: toEl.props.y + toEl.props.h / 2 }
      : { x: 0, y: 0 }

    const fromAnchor = fromEl
      ? pickAnchorToward(fromEl, toCenter)
      : { x: fromCenter.x, y: fromCenter.y, angle: 0 }
    const toAnchor = toEl
      ? pickAnchorToward(toEl, fromCenter)
      : { x: toCenter.x, y: toCenter.y, angle: 0 }

    // zindex 取两端较大值 +1（与 designer 中创建连线时的递增逻辑一致）
    const zindex = Math.max(
      fromEl ? (fromEl.props.zindex ?? 0) : 0,
      toEl ? (toEl.props.zindex ?? 0) : 0,
    ) + 1

    // createLinkerInstance 需要 id: string | null，resolveRefId 保证此处 fromId/toId 为 string
    const linker = createLinkerInstance(
      { id: fromId ?? null, ...fromAnchor },
      { id: toId ?? null, ...toAnchor },
      zindex,
    )

    // AI 指定的 linkerType 覆盖默认值（createLinkerInstance 默认为 'broken'）
    // 白名单校验：模型幻觉出的非法值（如 "arrow"）会导致渲染层无法绘制
    const VALID_TYPES = ['curve', 'broken', 'line'] as const
    if (action.linkerType && (VALID_TYPES as readonly string[]).includes(action.linkerType)) {
      linker.linkerType = action.linkerType
    }
    if (action.text !== undefined) {
      linker.text = action.text
    }

    // 立即计算路径中间点（折线/曲线走向依赖 from/to 锚点角度）
    const elements = this.store.document.elements
    linker.points = getLinkerPoints(linker, (id) => {
      const el = hasOwnKey(elements, id) ? elements[id] : undefined
      if (!el || el.name === 'linker') return null
      return {
        x: (el as ElementInstance).props.x,
        y: (el as ElementInstance).props.y,
        w: (el as ElementInstance).props.w,
        h: (el as ElementInstance).props.h,
      }
    })

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console -- DEV 模式诊断输出
      console.log('[AI] add_linker:', {
        id: linker.id,
        from: linker.from,
        to: linker.to,
        linkerType: linker.linkerType,
        points: linker.points,
        lineStyle: linker.lineStyle,
      })
    }

    return linker
  }

  /**
   * 收集 id 及其附着连线 id（用于级联删除）。
   */
  private collectCascadeDeleteIds(id: string): string[] {
    if (!hasOwnKey(this.store.document.elements, id)) return []
    const attached: string[] = []
    for (const el of Object.values(this.store.document.elements)) {
      if (el.name !== 'linker') continue
      const l = el as LinkerInstance
      if (l.from.id === id || l.to.id === id) {
        attached.push(l.id)
      }
    }
    return [id, ...attached]
  }
}
