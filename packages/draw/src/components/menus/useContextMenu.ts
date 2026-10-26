// src/components/menus/useContextMenu.ts
// 右键菜单：监听 contextmenu 事件，按当前选区派生 MenuNode[]
// 菜单项 handler 复用 editorStore action，与 TopBar 菜单语义一致
import { useEffect, useState } from 'react'
import type { MenuNode } from '@/components/common/MenuDropdown'
import { useEditorStore } from '@/store/editorStore'
import { isLinker } from '@/types'
import { applyLayerAction } from '@/core/editor/layerAction'
import { drawT } from '@/i18n/runtime'

/** 按当前选区派生右键菜单项（纯函数，便于测试） */
export function buildContextMenuItems(): MenuNode[] {
  const st = useEditorStore.getState()
  const ids = [...st.selectedIds]
  const elements = st.document.elements
  const selectedEls = ids.map((id) => elements[id]).filter((el) => el != null)
  const shapes = selectedEls.filter((el) => !isLinker(el))

  // 无选中 → 画布菜单
  if (selectedEls.length === 0) {
    return [
      { label: drawT('action.paste'), shortcut: '⌘V', disabled: !st.clipboard, onClick: () => useEditorStore.getState().pasteElements() },
      { label: drawT('action.selectAll'), shortcut: '⌘A', onClick: () => useEditorStore.getState().selectIds(Object.keys(elements), 'replace') },
      { divider: true },
      { label: drawT('draw.ctx.pageSetup'), onClick: () => { useEditorStore.getState().clearSelection() } },
    ]
  }

  // 多选 → 多选菜单
  if (shapes.length >= 2 || selectedEls.length >= 2) {
    return [
      { label: drawT('draw.arrange.group'), shortcut: '⌘G', disabled: shapes.length < 2, onClick: () => useEditorStore.getState().groupSelected() },
      { label: drawT('draw.arrange.ungroup'), shortcut: '⇧⌘G', disabled: shapes.length < 2, onClick: () => useEditorStore.getState().ungroupSelected() },
      { divider: true },
      { label: drawT('action.delete'), shortcut: '⌦', onClick: () => useEditorStore.getState().deleteElements(ids) },
    ]
  }

  // 单图形 / 单连线
  const single = selectedEls[0]!
  const isLk = isLinker(single)

  // 计算 single 在所有图形中的 z 排序位次（连线不参与层级，置为 -1）
  const allShapes = Object.values(elements).filter((el) => !isLinker(el))
    .sort((a, b) => a.props.zindex - b.props.zindex)
  const rank = isLk ? -1 : allShapes.findIndex((el) => el.id === single.id)
  const atTop = rank === allShapes.length - 1 // 最顶层 → 上移一层应禁用
  const atBottom = rank === 0                 // 最底层 → 下移一层应禁用

  const items: MenuNode[] = [
    { label: drawT('action.cut'), shortcut: '⌘X', onClick: () => {
      useEditorStore.getState().copySelectedElements()
      useEditorStore.getState().deleteElements(ids)
    } },
    { label: drawT('action.copy'), shortcut: '⌘C', onClick: () => useEditorStore.getState().copySelectedElements() },
    { label: drawT('action.paste'), shortcut: '⌘V', disabled: !st.clipboard, onClick: () => useEditorStore.getState().pasteElements() },
    { label: drawT('draw.edit.duplicate'), shortcut: '⌘D', onClick: () => {
      useEditorStore.getState().copySelectedElements()
      useEditorStore.getState().pasteElements()
    } },
    { divider: true },
    { label: drawT('draw.ctx.front'), disabled: isLk || single.locked, onClick: () => applyLayerAction('front') },
    { label: drawT('draw.ctx.back'), disabled: isLk || single.locked, onClick: () => applyLayerAction('back') },
    { label: drawT('draw.arrange.forward'), disabled: isLk || single.locked || atTop, onClick: () => applyLayerAction('forward') },
    { label: drawT('draw.arrange.backward'), disabled: isLk || single.locked || atBottom, onClick: () => applyLayerAction('backward') },
    { divider: true },
    { label: drawT('draw.arrange.lock'), onClick: () => useEditorStore.getState().lockShapes(ids) },
    { label: drawT('draw.arrange.unlock'), onClick: () => useEditorStore.getState().unlockShapes(ids) },
    { divider: true },
    {
      label: isLk ? drawT('draw.ctx.editConnectorText') : drawT('draw.ctx.editText'),
      onClick: () => useEditorStore.getState().setTextEdit({ id: single.id, block: isLk ? -1 : 0 }),
    },
    ...(isLinker(single)
      ? [
          {
            label: drawT('draw.ctx.resetRoute'),
            disabled: single.manualRoute !== true,
            onClick: () => useEditorStore.getState().resetLinkerRoute(single.id),
          },
        ]
      : []),
    { divider: true },
    { label: drawT('action.delete'), shortcut: '⌦', onClick: () => useEditorStore.getState().deleteElements(ids) },
  ]
  return items
}

/** 右键菜单状态 hook：绑定 contextmenu 事件，暴露 {open,x,y,items,onClose} */
export function useContextMenu() {
  const [state, setState] = useState<{ open: boolean; x: number; y: number }>({ open: false, x: 0, y: 0 })

  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      setState({ open: true, x: e.clientX, y: e.clientY })
    }
    window.addEventListener('contextmenu', onContextMenu)
    return () => window.removeEventListener('contextmenu', onContextMenu)
  }, [])

  const onClose = () => setState((s) => ({ ...s, open: false }))
  return { ...state, items: state.open ? buildContextMenuItems() : [], onClose }
}
