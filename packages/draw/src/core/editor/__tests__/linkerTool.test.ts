// L 连线工具：起点解析测试（resolveLinkerStart 纯函数）+ junction 吸附创建集成
import { describe, it, expect, beforeEach } from 'vitest'
import { resolveLinkerStart, beginFreeLinker, moveFreeLinker, endFreeLinker } from '../linkerTool'
import { useEditorStore } from '@/store/editorStore'
import { createEmptyDocument, isLinker } from '@/types'
import type { ElementInstance, LinkerInstance } from '@/types'
import { createLinkerInstance } from '../linker'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'

function shape(x: number, y: number, w = 100, h = 60): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', x, y)
  if (!el) throw new Error('rectangle schema missing')
  el.props.w = w
  el.props.h = h
  return el
}

describe('resolveLinkerStart（L 连线工具起点）', () => {
  it('命中图形 → 吸附最近锚点', () => {
    const el = shape(100, 200, 100, 60)
    // 点击上锚点附近 (150, 200)：上锚点 (150,200)，内向角 π/2
    const r = resolveLinkerStart([el], 150, 200)
    expect(r.id).toBe(el.id)
    expect(r.x).toBe(150)
    expect(r.y).toBe(200)
    expect(r.angle).toBeCloseTo(Math.PI / 2)
  })

  it('空白区域 → 自由端点', () => {
    const el = shape(100, 200, 100, 60)
    // 远离图形包围盒（+10px 粗筛外）
    const r = resolveLinkerStart([el], 400, 400)
    expect(r.id).toBeNull()
    expect(r.x).toBe(400)
    expect(r.y).toBe(400)
    expect(r.angle).toBe(0)
  })

  it('锁定图形 → 回退为自由端点（不可连线/吸附）', () => {
    const el = shape(100, 200, 100, 60)
    el.locked = true
    // 命中锁定图形位置，也应回退自由端点
    const r = resolveLinkerStart([el], 150, 200)
    expect(r.id).toBeNull()
    expect(r.x).toBe(150)
    expect(r.y).toBe(200)
  })
})

describe('自由连线工具（junction 吸附集成）', () => {
  beforeEach(() => {
    useEditorStore.setState({
      document: createEmptyDocument(),
      selectedIds: new Set(),
      viewport: { x: 0, y: 0, scale: 1 },
      isDirty: false,
    })
  })

  /** from(0,0)→(0,40)→(100,40)→to(100,100) 的折线宿主（入库） */
  function addHost(): LinkerInstance {
    const l = createLinkerInstance(
      { id: null, x: 0, y: 0, angle: 0 },
      { id: null, x: 100, y: 100, angle: 0 },
      1,
    )
    const host: LinkerInstance = {
      ...l,
      linkerType: 'broken',
      points: [
        { x: 0, y: 40 },
        { x: 100, y: 40 },
      ],
    }
    useEditorStore.getState().addLinker(host)
    return host
  }

  it('moveFreeLinker 吸附宿主连线 → endFreeLinker 创建的实例带 junction', () => {
    const host = addHost()
    beginFreeLinker(400, 400) // 空白起点 → 自由端点
    moveFreeLinker(10, 50, null) // 光标落在宿主水平段 10px 内 → junction 吸附
    endFreeLinker()

    const els = useEditorStore.getState().document.elements
    const created = Object.values(els).find(
      (el): el is LinkerInstance => isLinker(el) && el.id !== host.id,
    )
    expect(created).toBeDefined()
    expect(created!.to.id).toBeNull()
    expect(created!.to.junction).toEqual({ linkerId: host.id, t: 0.25 })
    expect(created!.to).toMatchObject({ x: 10, y: 40 })
  })

  it('空白处结束拖拽 → 普通自由连线（无 junction）', () => {
    addHost()
    beginFreeLinker(400, 400)
    moveFreeLinker(500, 500, null) // 远离宿主路径
    endFreeLinker()

    const created = Object.values(useEditorStore.getState().document.elements).find(
      (el): el is LinkerInstance => isLinker(el),
    )
    expect(created).toBeDefined()
    expect(created!.to.junction).toBeUndefined()
  })
})
