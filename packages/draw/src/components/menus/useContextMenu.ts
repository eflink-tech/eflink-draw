// src/components/menus/useContextMenu.ts
// 右键菜单：监听 contextmenu 事件，按当前选区派生 MenuNode[]
// 菜单项 handler 复用 editorStore action，与 TopBar 菜单语义一致
import { useEffect, useState } from 'react'
import type { MenuNode } from '@/components/common/MenuDropdown'
import { useEditorStore } from '@/store/editorStore'
import { isLinker } from '@/types'
import { applyLayerAction } from '@/core/editor/layerAction'

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
      { label: '粘贴', shortcut: '⌘V', disabled: !st.clipboard, onClick: () => useEditorStore.getState().pasteElements() },
      { label: '全选', shortcut: '⌘A', onClick: () => useEditorStore.getState().selectIds(Object.keys(elements), 'replace') },
      { divider: true },
      { label: '页面设置', onClick: () => { useEditorStore.getState().clearSelection() } },
    ]
  }

  // 多选 → 多选菜单
  if (shapes.length >= 2 || selectedEls.length >= 2) {
    return [
      { label: '组合', shortcut: '⌘G', disabled: shapes.length < 2, onClick: () => useEditorStore.getState().groupSelected() },
      { label: '取消组合', shortcut: '⇧⌘G', disabled: shapes.length < 2, onClick: () => useEditorStore.getState().ungroupSelected() },
      { divider: true },
      { label: '删除', shortcut: '⌦', onClick: () => useEditorStore.getState().deleteElements(ids) },
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
    { label: '剪切', shortcut: '⌘X', onClick: () => {
      useEditorStore.getState().copySelectedElements()
      useEditorStore.getState().deleteElements(ids)
    } },
    { label: '复制', shortcut: '⌘C', onClick: () => useEditorStore.getState().copySelectedElements() },
    { label: '粘贴', shortcut: '⌘V', disabled: !st.clipboard, onClick: () => useEditorStore.getState().pasteElements() },
    { label: '复用', shortcut: '⌘D', onClick: () => {
      useEditorStore.getState().copySelectedElements()
      useEditorStore.getState().pasteElements()
    } },
    { divider: true },
    { label: '置顶', disabled: isLk || single.locked, onClick: () => applyLayerAction('front') },
    { label: '置底', disabled: isLk || single.locked, onClick: () => applyLayerAction('back') },
    { label: '上移一层', disabled: isLk || single.locked || atTop, onClick: () => applyLayerAction('forward') },
    { label: '下移一层', disabled: isLk || single.locked || atBottom, onClick: () => applyLayerAction('backward') },
    { divider: true },
    { label: '锁定', onClick: () => useEditorStore.getState().lockShapes(ids) },
    { label: '解锁', onClick: () => useEditorStore.getState().unlockShapes(ids) },
    { divider: true },
    {
      label: isLk ? '编辑连线文本' : '编辑文本',
      onClick: () => useEditorStore.getState().setTextEdit({ id: single.id, block: isLk ? -1 : 0 }),
    },
    ...(isLinker(single)
      ? [
          {
            label: '重置自动路由',
            disabled: single.manualRoute !== true,
            onClick: () => useEditorStore.getState().resetLinkerRoute(single.id),
          },
        ]
      : []),
    { divider: true },
    { label: '删除', shortcut: '⌦', onClick: () => useEditorStore.getState().deleteElements(ids) },
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
