import { describe, it, expect } from 'vitest'
import { useEditorStore } from '../editorStore'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import { createLinkerInstance } from '@/core/editor/linker'
import { createEmptyDocument, type ElementInstance, type LinkerInstance } from '@/types'

function makeRect(id: string, x: number, y: number, w = 120, h = 60): ElementInstance {
  const el = shapeRegistry.createElement('rectangle', x, y)!
  return { ...el, id, props: { ...el.props, x, y, w, h } }
}

function setDoc(els: (ElementInstance | LinkerInstance)[], selected: string[]) {
  const elements: Record<string, ElementInstance | LinkerInstance> = {}
  for (const e of els) elements[e.id] = e
  useEditorStore.setState({
    document: { page: createEmptyDocument().page, elements },
    selectedIds: new Set(selected),
  })
}

const pos = (id: string) => {
  const el = useEditorStore.getState().document.elements[id] as ElementInstance
  return { x: el.props.x, y: el.props.y, w: el.props.w, h: el.props.h }
}

describe('store 排列操作', () => {
  it('alignShapes left 落库并可撤销', () => {
    setDoc([makeRect('A', 100, 100), makeRect('B', 300, 200)], ['A', 'B'])
    useEditorStore.getState().alignShapes(['A', 'B'], 'left')
    expect(pos('B').x).toBe(100)
    expect(pos('B').y).toBe(200)
    useEditorStore.getState().undo()
    expect(pos('B').x).toBe(300)
  })

  it('对齐联动附着连线端点', () => {
    const a = makeRect('A', 100, 100)
    const b = makeRect('B', 400, 150)
    const linker = createLinkerInstance(
      { id: 'A', x: 220, y: 130, angle: Math.PI },
      { id: 'B', x: 400, y: 180, angle: 0 },
      1,
    )
    setDoc([a, b, linker], ['A', 'B'])
    useEditorStore.getState().alignShapes(['A', 'B'], 'left')
    const l = useEditorStore.getState().document.elements[linker.id] as LinkerInstance
    expect(l.to.x).toBe(100)
    useEditorStore.getState().undo()
    const l2 = useEditorStore.getState().document.elements[linker.id] as LinkerInstance
    expect(l2.to.x).toBe(400)
  })

  it('distributeShapes horizontal 落库', () => {
    setDoc([makeRect('A', 100, 0, 200, 50), makeRect('B', 350, 0, 100, 50), makeRect('C', 600, 0, 50, 50)], ['A', 'B', 'C'])
    useEditorStore.getState().distributeShapes(['A', 'B', 'C'], 'horizontal')
    expect(pos('B').x).toBe(362.5)
  })

  it('matchSize 同步宽高到首个', () => {
    setDoc([makeRect('A', 0, 0, 200, 100), makeRect('B', 0, 0, 120, 60)], ['A', 'B'])
    useEditorStore.getState().matchSize(['A', 'B'], { w: true, h: true })
    expect(pos('B')).toEqual({ x: 0, y: 0, w: 200, h: 100 })
  })

  it('锁定图形不参与对齐', () => {
    const a = makeRect('A', 100, 100)
    const b = { ...makeRect('B', 300, 200), locked: true }
    setDoc([a, b], ['A', 'B'])
    useEditorStore.getState().alignShapes(['A', 'B'], 'left')
    expect(pos('B').x).toBe(300)
    expect(pos('A').x).toBe(100)
  })
})
