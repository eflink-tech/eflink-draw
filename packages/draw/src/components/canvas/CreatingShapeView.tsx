// 面板拖拽创建预览（UI 层）
// 位置由 panelDrag 每帧直操（中心定位模型与 ElementRenderer 一致），
// 本组件只在进入/离开画布时随 store 重渲染。
import { useEffect, useMemo, useRef } from 'react'
import { Group, Shape } from 'react-konva'
import type Konva from 'konva'
import { useEditorStore } from '@/store/editorStore'
import { registerCreatingNode } from '@/core/editor/panelDrag'
import { makeShapeSceneFunc } from '@/core/editor/shapePaint'

export function CreatingShapeView() {
  const el = useEditorStore((s) => s.creatingShape)
  const groupRef = useRef<Konva.Group>(null)

  // 节点注册/注销（panelDrag 高频直操 position 的入口）
  useEffect(() => {
    registerCreatingNode(el ? groupRef.current : null)
    return () => registerCreatingNode(null)
  }, [el])

  const sceneFunc = useMemo(() => (el ? makeShapeSceneFunc(el) : null), [el])

  if (!el || !sceneFunc) return null
  const { x, y, w, h } = el.props
  return (
    <Group
      ref={groupRef}
      x={x + w / 2}
      y={y + h / 2}
      offset={{ x: w / 2, y: h / 2 }}
      listening={false}
    >
      <Shape width={w} height={h} sceneFunc={sceneFunc} />
    </Group>
  )
}
