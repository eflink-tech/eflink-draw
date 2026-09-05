//
// 已实现：
// - 缩放（⌘+/⌘-/⌘0）、剪贴板（⌘C/⌘X/⌘V）、撤销重做（⌘Z/⇧⌘Z/⌘Y）
// - 层级（⌘]/⌘[ 置顶置底；⌥]/⌥[ 上移下移）
// - 删除（Delete/Backspace）、空格平移（松开进文字编辑）
// - 新增：⌘A 全选、⌘D 复制副本、⇧⌘B 格式刷、⌘L/⇧⌘L 锁定/解锁、
//   ⌘B/⌘I/⌘U 文字样式、方向键微调（批量合并历史）、Esc 优先级链、T/L 工具切换
import { useEffect, useRef, type MutableRefObject } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { useUIStore } from '@/store/uiStore'
import { isLinker } from '@/types'
import { attachedLinkerIds } from '@/core/editor/documentOps'
import { cancelPanelDrag } from '@/core/editor/panelDrag'
import { cancelFreeLinker } from '@/core/editor/linkerTool'
import { handleLayerKeydown } from '@/core/editor/layerAction'

export interface ShortcutRefs {
  /** 空格按下标记（平移模式） */
  spacePressed: MutableRefObject<boolean>
  /** 空格按下后是否发生过拖拽平移 */
  spacePanned: MutableRefObject<boolean>
  /** 空格按下状态（驱动光标样式） */
  setSpaceHeld: (v: boolean) => void
}

/** 方向键集合（微调移动） */
const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

/** 全局键盘快捷键：缩放/剪贴板/层级/删除/空格平移 + 新增快捷键 */
export function useEditorShortcuts(refs: ShortcutRefs): void {
  const { spacePressed, spacePanned, setSpaceHeld } = refs
  // 方向键批处理标记：首次按下开启 batch，keyup/blur 时提交（连按合并为一条撤销）
  const arrowBatchActive = useRef(false)

  useEffect(() => {
    const isTextInput = (target: EventTarget | null) => {
      const el = target as HTMLElement | null
      return (
        el &&
        (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
      )
    }

    // 层级快捷键 capture 阶段优先处理（菜单/按钮聚焦时仍能响应 ⌥]/⌥[）
    const layerCaptureHandler = (e: KeyboardEvent) => {
      if (isTextInput(e.target)) return
      if (handleLayerKeydown(e)) e.stopPropagation()
    }

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      // 输入框内不拦截（文本编辑中的 ⌘B/I/U、Esc 由 TextEditorOverlay 自行处理）
      if (isTextInput(target)) {
        return
      }

      const mod = e.ctrlKey || e.metaKey
      if (mod) {
        if (e.key === 's' || e.key === 'S') {
          // ⌘S 保存到 localStorage（屏蔽浏览器存页框）
          e.preventDefault()
          useEditorStore.getState().saveDocument()
          return
        }
        if (e.key === '=' || e.key === '+') {
          e.preventDefault()
          const { viewport: vp, updateViewport: uv } = useEditorStore.getState()
          const newScale = Math.round((Math.min(4, vp.scale + 0.05)) * 20) / 20
          uv({ scale: newScale })
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault()
          const { viewport: vp, updateViewport: uv } = useEditorStore.getState()
          const newScale = Math.round((Math.max(0.25, vp.scale - 0.05)) * 20) / 20
          uv({ scale: newScale })
        } else if (e.key === '0') {
          e.preventDefault()
          useEditorStore.getState().updateViewport({ scale: 1 })
        } else if (e.key === 'a' || e.key === 'A') {
          // 全选：全部图形 + 连线
          e.preventDefault()
          const st = useEditorStore.getState()
          st.selectIds(Object.keys(st.document.elements), 'replace')
        } else if (e.key === 'd' || e.key === 'D') {
          // 复制副本：复制选区并偏移粘贴；连按时对上一份副本链式 +20
          e.preventDefault()
          const st = useEditorStore.getState()
          st.copySelectedElements()
          st.pasteElements()
        } else if (e.key === 'c' || e.key === 'C') {
          e.preventDefault()
          useEditorStore.getState().copySelectedElements()
        } else if (e.key === 'v' || e.key === 'V') {
          e.preventDefault()
          useEditorStore.getState().pasteElements()
        } else if (e.key === 'x' || e.key === 'X') {
          e.preventDefault()
          const st = useEditorStore.getState()
          st.copySelectedElements()
          if (st.selectedIds.size > 0) st.deleteElements([...st.selectedIds])
        } else if (e.key === 'z' || e.key === 'Z') {
          e.preventDefault()
          if (e.shiftKey) {
            useEditorStore.getState().redo()
          } else {
            useEditorStore.getState().undo()
          }
        } else if (e.key === 'y' || e.key === 'Y') {
          e.preventDefault()
          useEditorStore.getState().redo()
        } else if (e.key === 'b' || e.key === 'B') {
          e.preventDefault()
          const st = useEditorStore.getState()
          if (e.shiftKey) {
            st.startBrush()
          } else {
            st.toggleFontStyle('bold')
          }
        } else if (e.key === 'g' || e.key === 'G') {
          e.preventDefault()
          const st = useEditorStore.getState()
          if (e.shiftKey) {
            st.ungroupSelected()
          } else {
            st.groupSelected()
          }
        } else if (e.key === 'i' || e.key === 'I') {
          e.preventDefault()
          useEditorStore.getState().toggleFontStyle('italic')
        } else if (e.key === 'u' || e.key === 'U') {
          e.preventDefault()
          useEditorStore.getState().toggleFontStyle('underline')
        } else if (e.key === 'l' || e.key === 'L') {
          e.preventDefault()
          const st = useEditorStore.getState()
          if (e.shiftKey) {
            st.unlockShapes([...st.selectedIds])
          } else {
            st.lockShapes([...st.selectedIds])
          }
        }
        return
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const st = useEditorStore.getState()
        if (st.selectedIds.size > 0) {
          e.preventDefault()
          st.deleteElements([...st.selectedIds])
        }
        return
      }

      // Esc 优先级链：专注模式 → 文本编辑 → 创建中 → 连线草稿 → 格式刷 → 工具 → 选区
      // （文本编辑中焦点在 textarea，被上方输入框早退拦截，此处第 2 步仅兜底）
      if (e.key === 'Escape') {
        if (useUIStore.getState().focusMode) {
          e.preventDefault()
          useUIStore.getState().setFocusMode(false)
          return
        }
        const st = useEditorStore.getState()
        if (st.textEdit) {
          e.preventDefault()
          st.setTextEdit(null)
          return
        }
        if (st.creatingShape) {
          e.preventDefault()
          cancelPanelDrag()
          return
        }
        if (st.linkerDraft) {
          e.preventDefault()
          st.setLinkerDraft(null)
          return
        }
        if (st.brushData) {
          e.preventDefault()
          st.cancelBrush()
          return
        }
        if (st.currentTool !== 'select') {
          e.preventDefault()
          st.setTool('select')
          return
        }
        if (st.selectedIds.size > 0) {
          e.preventDefault()
          st.clearSelection()
        }
        return
      }

      // 方向键微调：步长 10，⌘/⇧ 时 1；连按合并为一条撤销（含附着连线）
      if (ARROW_KEYS.includes(e.key)) {
        const st = useEditorStore.getState()
        if (st.selectedIds.size === 0) return
        const movable = [...st.selectedIds].filter((id) => {
          const el = st.document.elements[id]
          return el != null && !isLinker(el) && !el.locked
        })
        if (movable.length === 0) return
        e.preventDefault()
        if (!arrowBatchActive.current) {
          // 快照范围必须并入附着连线，否则 commit 对比漏掉连线变更
          st.beginBatch([...movable, ...attachedLinkerIds(st.document.elements, movable)])
          arrowBatchActive.current = true
        }
        const step = e.ctrlKey || e.metaKey || e.shiftKey ? 1 : 10
        const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0
        const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0
        st.moveElementsNoHistory([...st.selectedIds], dx, dy)
        return
      }

      // T/L：切换文本/连线工具（再按一次回选择工具）
      if (!e.altKey && !e.shiftKey) {
        if (e.key === 't' || e.key === 'T') {
          const st = useEditorStore.getState()
          st.setTool(st.currentTool === 'text' ? 'select' : 'text')
          return
        }
        if (e.key === 'l' || e.key === 'L') {
          const st = useEditorStore.getState()
          st.setTool(st.currentTool === 'linker' ? 'select' : 'linker')
          return
        }
      }

      // 空格按下：阻止默认滚动，标记平移模式
      if (e.key === ' ' && !spacePressed.current) {
        e.preventDefault()
        spacePressed.current = true
        setSpaceHeld(true)
      }
    }

    const keyupHandler = (e: KeyboardEvent) => {
      // 输入框内按键不触发任何快捷键收尾：文本编辑中按空格（中文输入法选字）
      // 若落到下方"空格松开进文字编辑"，会把编辑会话劫持到 block 0，已输内容丢失
      if (isTextInput(e.target)) return

      // 方向键批处理收尾：连按的全部位移合并为一条撤销记录
      if (ARROW_KEYS.includes(e.key) && arrowBatchActive.current) {
        arrowBatchActive.current = false
        useEditorStore.getState().commitBatch()
        return
      }

      if (e.key === ' ') {
        spacePressed.current = false
        setSpaceHeld(false)
        // 仅在未发生空格平移、且当前没有打开的编辑会话时，释放空格才进入文字编辑
        if (!spacePanned.current && !useEditorStore.getState().textEdit) {
          const st = useEditorStore.getState()
          if (st.selectedIds.size === 1) {
            const id = [...st.selectedIds][0]!
            const el = st.document.elements[id]
            if (!el || el.locked) return
            if (isLinker(el)) {
              st.setTextEdit({ id, block: -1 })
            } else if (el && el.textBlock.length > 0) {
              st.setTextEdit({ id, block: 0 })
            }
          }
        }
        spacePanned.current = false
      }
    }

    // 窗口失焦时重置空格状态（防止 Alt+Tab 后空格状态残留）；方向键批次兜底提交
    const blurHandler = () => {
      spacePressed.current = false
      setSpaceHeld(false)
      spacePanned.current = false
      if (arrowBatchActive.current) {
        arrowBatchActive.current = false
        useEditorStore.getState().commitBatch()
      }
      // 窗口失焦时取消进行中的自由连线拖拽（防止拖拽状态残留）
      cancelFreeLinker()
    }

    document.addEventListener('keydown', layerCaptureHandler, true)
    window.addEventListener('keydown', handler)
    window.addEventListener('keyup', keyupHandler)
    window.addEventListener('blur', blurHandler)
    return () => {
      document.removeEventListener('keydown', layerCaptureHandler, true)
      window.removeEventListener('keydown', handler)
      window.removeEventListener('keyup', keyupHandler)
      window.removeEventListener('blur', blurHandler)
    }
    // refs 由 Canvas 以 useRef/useState setter 提供，引用恒定
  }, [spacePressed, spacePanned, setSpaceHeld])
}
