// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { buildContextMenuItems } from '../useContextMenu'
import { useEditorStore } from '@/store/editorStore'
import { shapeRegistry } from '@/core/schema/registry'
import { createLinkerInstance } from '@/core/editor/linker'
import '@/core/schema/shapes'
import type { ElementInstance, LinkerInstance } from '@/types'

function withSelected(overrides: Partial<ElementInstance> = {}): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', 0, 0)!
  useEditorStore.getState().setDocument({
    page: useEditorStore.getState().document.page,
    elements: { [el.id]: { ...el, ...overrides } },
  })
  useEditorStore.getState().selectIds([el.id], 'replace')
  return el
}

/** 构造 n 个 zindex 互异（0..n-1）的矩形，返回 id 数组（[0]=最底，[n-1]=最顶） */
function withStack(n: number): string[] {
  const els = Array.from({ length: n }, () => shapeRegistry.createElement('rectangle', 0, 0)!)
  els.forEach((el, i) => {
    el.props.zindex = i
  })
  useEditorStore.getState().setDocument({
    page: useEditorStore.getState().document.page,
    elements: Object.fromEntries(els.map((el) => [el.id, el])),
  })
  return els.map((el) => el.id)
}

function findItem(label: string) {
  return buildContextMenuItems().find((i) => i.label === label)
}

/** 构造一条指定路由状态的连线并设为单选 */
function withSelectedLinker(manualRoute: boolean | undefined, points: Array<{ x: number; y: number }>): LinkerInstance {
  const l = createLinkerInstance(
    { id: null, x: 0, y: 0, angle: 0 },
    { id: null, x: 100, y: 0, angle: 0 },
    0,
  )
  const el: LinkerInstance = { ...l, manualRoute, points }
  useEditorStore.getState().setDocument({
    page: useEditorStore.getState().document.page,
    elements: { [el.id]: el },
  })
  useEditorStore.getState().selectIds([el.id], 'replace')
  return el
}

describe('buildContextMenuItems', () => {
  it('无选中（画布空白）→ 含全选/页面设置', () => {
    useEditorStore.getState().clearSelection()
    const items = buildContextMenuItems()
    const labels = items.filter((i) => i.label).map((i) => i.label)
    expect(labels).toContain('全选')
    expect(labels).toContain('页面设置')
  })

  it('单图形选中 → 含置顶/删除/编辑文本', () => {
    withSelected()
    const items = buildContextMenuItems()
    const labels = items.filter((i) => i.label).map((i) => i.label)
    expect(labels).toContain('置顶')
    expect(labels).toContain('删除')
    expect(labels).toContain('编辑文本')
  })

  it('多选（≥2）→ 含组合', () => {
    const a = shapeRegistry.createElement('rectangle', 0, 0)!
    const b = shapeRegistry.createElement('rectangle', 100, 0)!
    useEditorStore.getState().setDocument({
      page: useEditorStore.getState().document.page,
      elements: { [a.id]: a, [b.id]: b },
    })
    useEditorStore.getState().selectIds([a.id, b.id], 'replace')
    const items = buildContextMenuItems()
    const labels = items.filter((i) => i.label).map((i) => i.label)
    expect(labels).toContain('组合')
  })

  it('单选中间层图形 → 上移一层 onClick 真正提升 zindex', () => {
    const a = shapeRegistry.createElement('rectangle', 0, 0)!
    const b = shapeRegistry.createElement('rectangle', 0, 0)!
    const c = shapeRegistry.createElement('rectangle', 0, 0)!
    useEditorStore.getState().setDocument({
      page: useEditorStore.getState().document.page,
      elements: { [a.id]: a, [b.id]: b, [c.id]: c },
    })
    // 选中中间那个 b
    useEditorStore.getState().selectIds([b.id], 'replace')
    const items = buildContextMenuItems()
    const upItem = items.find((i) => i.label === '上移一层')
    expect(upItem).toBeTruthy()
    const zBefore = useEditorStore.getState().document.elements[b.id]!.props.zindex
    upItem!.onClick!()
    const zAfter = useEditorStore.getState().document.elements[b.id]!.props.zindex
    expect(zAfter).toBeGreaterThan(zBefore)
  })

  it('单选中间层图形 → 上移/下移一层均可用', () => {
    const ids = withStack(3)
    useEditorStore.getState().selectIds([ids[1]], 'replace')
    expect(findItem('上移一层')!.disabled).toBe(false)
    expect(findItem('下移一层')!.disabled).toBe(false)
  })

  it('单选最顶层图形 → 上移一层禁用、下移可用', () => {
    const ids = withStack(3)
    useEditorStore.getState().selectIds([ids[2]], 'replace')
    expect(findItem('上移一层')!.disabled).toBe(true)
    expect(findItem('下移一层')!.disabled).toBe(false)
  })

  it('单选最底层图形 → 下移一层禁用、上移可用', () => {
    const ids = withStack(3)
    useEditorStore.getState().selectIds([ids[0]], 'replace')
    expect(findItem('下移一层')!.disabled).toBe(true)
    expect(findItem('上移一层')!.disabled).toBe(false)
  })

  it('唯一图形（同时最顶最底）→ 上移/下移均禁用', () => {
    withStack(1)
    const ids = useEditorStore.getState().document.elements
    useEditorStore.getState().selectIds([Object.keys(ids)[0]], 'replace')
    expect(findItem('上移一层')!.disabled).toBe(true)
    expect(findItem('下移一层')!.disabled).toBe(true)
  })

  it('单选连线 → 层级类菜单项（置顶/置底/上移/下移）全部禁用', () => {
    const shape = shapeRegistry.createElement('rectangle', 0, 0)!
    const linker = {
      ...shape,
      name: 'linker' as const,
      props: { zindex: 0 },
    } as unknown as LinkerInstance
    useEditorStore.getState().setDocument({
      page: useEditorStore.getState().document.page,
      elements: { [shape.id]: shape, [linker.id]: linker },
    })
    useEditorStore.getState().selectIds([linker.id], 'replace')
    for (const label of ['置顶', '置底', '上移一层', '下移一层']) {
      expect(findItem(label)!.disabled, `${label} 应禁用`).toBe(true)
    }
  })

  it('单选锁定图形 → 层级类菜单项全部禁用', () => {
    withSelected({ locked: true })
    for (const label of ['置顶', '置底', '上移一层', '下移一层']) {
      expect(findItem(label)!.disabled, `${label} 应禁用`).toBe(true)
    }
  })

  it('手动连线 → 重置自动路由可用', () => {
    withSelectedLinker(true, [])
    const item = findItem('重置自动路由')
    expect(item).toBeDefined()
    expect(item!.disabled).toBe(false)
  })

  it('自动连线 → 重置自动路由置灰', () => {
    withSelectedLinker(undefined, [])
    expect(findItem('重置自动路由')!.disabled).toBe(true)
  })

  it('点击重置 → manualRoute 清除且 points 重算', () => {
    const l = withSelectedLinker(true, [{ x: 7, y: 7 }])
    findItem('重置自动路由')!.onClick!()
    const after = useEditorStore.getState().document.elements[l.id] as LinkerInstance
    expect(after.manualRoute).toBe(false)
    expect(after.points).toEqual([
      { x: 50, y: 0 },
      { x: 50, y: 0 },
    ])
  })
})
