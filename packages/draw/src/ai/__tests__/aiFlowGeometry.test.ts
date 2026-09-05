// src/ai/__tests__/aiFlowGeometry.test.ts
// AI 生成流程图的连线几何回归（源自真实工单流程截图反馈：连线错位/重叠/穿节点）。
// 用真实 schema 走完整 ActionExecutor 管线（布局 + 重锚升级），验证端到端几何契约：
//   双向边侧锚分离、跳连边不穿中间节点、broken 折线正交。
import { describe, it, expect } from 'vitest'
import { ActionExecutor, type ActionExecutorStore } from '../actionExecutor'
import type { AIAction } from '../types'
import type { ElementInstance, LinkerInstance } from '@/types'
import { shapeRegistry } from '@/core/schema/registry'
// 导入即完成全部 schema 注册（与应用引导一致）
import '@/core/schema/shapes'
import { getAngleDir, type ShapeRect } from '@/core/editor/linker'
import { findCrossedRects } from '../autoLayout'

function createMockStore(): ActionExecutorStore {
  const elements: Record<string, ElementInstance | LinkerInstance> = {}
  return {
    addElement: (el) => {
      elements[el.id] = el
    },
    addLinker: (ln) => {
      elements[ln.id] = ln
    },
    updateElement: (id, updates) => {
      const el = elements[id]
      if (el && el.name !== 'linker') elements[id] = { ...el, ...updates } as ElementInstance
    },
    updateLinker: (id, updates) => {
      const el = elements[id]
      if (el && el.name === 'linker') elements[id] = { ...el, ...updates } as LinkerInstance
    },
    deleteElements: (ids) => {
      for (const id of ids) delete elements[id]
    },
    beginBatch: () => {},
    commitBatch: () => {},
    get document() {
      return { elements }
    },
  }
}

// 截图中的工单流程：AI 典型输出（含双向边 + 跳连边）
const TICKET_ACTIONS: AIAction[] = [
  { type: 'add_element', refId: 'start', schema: 'umlStart', x: 400, y: 40, text: '' },
  { type: 'add_element', refId: 'submitted', schema: 'process', x: 340, y: 160, text: '已提交' },
  { type: 'add_element', refId: 'pending', schema: 'process', x: 340, y: 300, text: '待分配' },
  { type: 'add_element', refId: 'processing', schema: 'process', x: 340, y: 440, text: '处理中' },
  { type: 'add_element', refId: 'suspended', schema: 'process', x: 160, y: 580, text: '挂起' },
  { type: 'add_element', refId: 'reviewing', schema: 'process', x: 480, y: 580, text: '待审核' },
  { type: 'add_element', refId: 'resolved', schema: 'process', x: 400, y: 720, text: '已解决' },
  { type: 'add_element', refId: 'closed', schema: 'process', x: 400, y: 860, text: '已关闭' },
  { type: 'add_element', refId: 'end', schema: 'umlEnd', x: 400, y: 980, text: '' },
  { type: 'add_linker', from: 'start', to: 'submitted', text: '用户创建工单' },
  { type: 'add_linker', from: 'submitted', to: 'pending', text: '系统受理' },
  { type: 'add_linker', from: 'pending', to: 'processing', text: '分配处理人' },
  { type: 'add_linker', from: 'processing', to: 'suspended', text: '挂起' },
  { type: 'add_linker', from: 'suspended', to: 'processing', text: '恢复处理' },
  { type: 'add_linker', from: 'processing', to: 'reviewing', text: '提交审核' },
  { type: 'add_linker', from: 'reviewing', to: 'processing', text: '审核退回' },
  { type: 'add_linker', from: 'processing', to: 'resolved', text: '用户确认' },
  { type: 'add_linker', from: 'reviewing', to: 'resolved', text: '审核通过' },
  { type: 'add_linker', from: 'resolved', to: 'closed', text: '确认关闭' },
  { type: 'add_linker', from: 'closed', to: 'end', text: '归档' },
]

// 变体：模型输出 linkerType:'line'（直线类型几何上无法保证绕行，只验证锚点分离）
const TICKET_ACTIONS_LINE: AIAction[] = TICKET_ACTIONS.map((a) =>
  a.type === 'add_linker' && a.from === 'processing' && a.to === 'resolved'
    ? { ...a, linkerType: 'line' as const }
    : a,
)

async function runCase(actions: AIAction[]) {
  const store = createMockStore()
  const executor = new ActionExecutor(store, {
    createElement: (name, x, y) => shapeRegistry.createElement(name, x, y),
    getShape: (name) => shapeRegistry.getShape(name) ?? undefined,
  })
  const result = await executor.execute(actions)
  return { store, result }
}

function shapesOf(store: ActionExecutorStore): ElementInstance[] {
  return Object.values(store.document.elements).filter(
    (e): e is ElementInstance => e.name !== 'linker',
  )
}
function linkersOf(store: ActionExecutorStore): LinkerInstance[] {
  return Object.values(store.document.elements).filter(
    (e): e is LinkerInstance => e.name === 'linker',
  )
}
function textOf(el: ElementInstance): string {
  return el.textBlock[0]?.text ?? ''
}
function rectOf(el: ElementInstance): ShapeRect {
  return { x: el.props.x, y: el.props.y, w: el.props.w, h: el.props.h }
}
function linkerByTexts(
  store: ActionExecutorStore,
  fromText: string,
  toText: string,
): LinkerInstance {
  const byId = new Map(shapesOf(store).map((s) => [s.id, textOf(s)]))
  const ln = linkersOf(store).find(
    (l) => byId.get(l.from.id ?? '') === fromText && byId.get(l.to.id ?? '') === toText,
  )
  if (!ln) throw new Error(`linker ${fromText}→${toText} not found`)
  return ln
}
/** 连线完整路径（from 端点 + 折点 + to 端点） */
function fullOf(ln: LinkerInstance): Array<{ x: number; y: number }> {
  return [ln.from, ...ln.points, ln.to]
}
/** 连线路径的无向线段键集合（方向无关，用于几何重合比对） */
function segKeys(ln: LinkerInstance): string[] {
  const full = fullOf(ln)
  const keys: string[] = []
  for (let i = 0; i < full.length - 1; i++) {
    const p1 = full[i]
    const p2 = full[i + 1]
    const [a, b] = p1.x < p2.x || (p1.x === p2.x && p1.y <= p2.y) ? [p1, p2] : [p2, p1]
    keys.push(`${a.x.toFixed(1)},${a.y.toFixed(1)}|${b.x.toFixed(1)},${b.y.toFixed(1)}`)
  }
  return keys
}

// 工单流程中的两组互逆边对（双向边）
const REVERSE_PAIRS: Array<[string, string]> = [
  ['处理中', '挂起'],
  ['处理中', '待审核'],
]

describe('AI 生成工单流程图：连线几何（broken）', () => {
  it('布局统计锚：moved=9、backEdges=2', async () => {
    const { result } = await runCase(TICKET_ACTIONS)
    expect(result.layout).toEqual({ moved: 9, backEdges: 2 })
  })

  it('11 条边全部无穿越（跳连边不再穿过中间节点）', async () => {
    const { store } = await runCase(TICKET_ACTIONS)
    const shapes = shapesOf(store)
    const allRects = new Map(shapes.map((s) => [s.id, rectOf(s)]))
    expect(linkersOf(store)).toHaveLength(11)
    for (const ln of linkersOf(store)) {
      const exclude = new Set([ln.from.id ?? '', ln.to.id ?? ''])
      const crossed = findCrossedRects(fullOf(ln), allRects, exclude)
      expect(crossed).toEqual([])
    }
  })

  it('两条互逆边对侧锚分离：绕行边两端同侧锚 + 线段集合不相交', async () => {
    const { store } = await runCase(TICKET_ACTIONS)
    for (const [a, b] of REVERSE_PAIRS) {
      const fwd = linkerByTexts(store, a, b)
      const rev = linkerByTexts(store, b, a)
      // 后出现者（rev）为绕行边：两端走同侧锚点（dir 2 右 或 4 左）
      const dirF = getAngleDir(rev.from.angle ?? 0)
      const dirT = getAngleDir(rev.to.angle ?? 0)
      expect(dirF).toBe(dirT)
      expect([2, 4]).toContain(dirF)
      // 两条边线段集合不相交（不再完全重叠、箭头/标签不再堆叠）
      const keysFwd = new Set(segKeys(fwd))
      for (const k of segKeys(rev)) expect(keysFwd.has(k)).toBe(false)
    }
  })

  it('全部 broken 折线正交（相邻点同 x 或同 y，0.5px 容差）', async () => {
    const { store } = await runCase(TICKET_ACTIONS)
    for (const ln of linkersOf(store)) {
      const full = fullOf(ln)
      for (let i = 0; i < full.length - 1; i++) {
        const dx = Math.abs(full[i].x - full[i + 1].x)
        const dy = Math.abs(full[i].y - full[i + 1].y)
        expect(dx < 0.5 || dy < 0.5).toBe(true)
      }
    }
  })
})

describe('AI 生成工单流程图：line 变体', () => {
  it('互逆边锚点分离（直线类型不保证绕行，仅验证不再同锚点重叠）', async () => {
    const { store } = await runCase(TICKET_ACTIONS_LINE)
    const samePt = (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
      Math.abs(p1.x - p2.x) < 0.5 && Math.abs(p1.y - p2.y) < 0.5
    for (const [a, b] of REVERSE_PAIRS) {
      const fwd = linkerByTexts(store, a, b)
      const rev = linkerByTexts(store, b, a)
      // 两端锚点身份均不同（否则两条直线完全重合、箭头叠加）
      expect(samePt(fwd.from, rev.from)).toBe(false)
      expect(samePt(fwd.to, rev.to)).toBe(false)
    }
  })
})
