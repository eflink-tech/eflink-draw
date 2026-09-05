import { create } from 'zustand'
import type { DocumentData, ElementInstance, LinkerDraft, LinkerInstance, PageConfig } from '@/types'
import { createEmptyDocument, isLinker } from '@/types'
import {
  attachedLinkerIds,
  deleteElementsInDoc,
  moveElementsInDoc,
  resizeElementInDoc,
} from '@/core/editor/documentOps'
import { LINKER_FONT_DEFAULTS } from '@/core/editor/linker'
import { resetManualRoute } from '@/core/editor/manualRoute'
import { expandGroupIds, newGroupId, remapGroupIdsForCopy } from '@/core/editor/groupOps'
import { saveDocumentToStorage } from '@/core/editor/persistence'
import { HistoryManager, applyCommand, reverseCommand, getPageFromCommand } from '@/core/editor/history'
import { alignShapes, applyShapeTransform, distributeShapes, matchSize } from '@/core/editor/alignmentOps'

/** 剪贴板数据（复制时深拷贝的选中元素，含端点引用映射） */
export interface ClipboardData {
  shapes: ElementInstance[]
  linkers: LinkerInstance[]
  /** 原始 ID → 新 ID 映射（粘贴时恢复连线端点引用） */
  idMap: Record<string, string>
}

/** 全局历史管理器实例（store 外部创建，供所有方法使用） */
export const historyManager: HistoryManager = new HistoryManager(() => {
  // 延迟获取，避免循环引用
  return useEditorStore.getState().document.elements
})

/** 排列操作的公共落库：换元素表 + 单条 update 历史（changedIds 覆盖被联动路由的连线） */
function commitAlign(
  state: EditorState,
  elements: Record<string, ElementInstance | LinkerInstance>,
  changedIds: string[],
): Partial<EditorState> {
  if (changedIds.length === 0) return state
  const shapes = changedIds
    .map((id) => state.document.elements[id])
    .filter((el): el is ElementInstance | LinkerInstance => el != null)
    .map((el) => JSON.parse(JSON.stringify(el)))
  const updates = changedIds
    .map((id) => elements[id])
    .filter((el): el is ElementInstance | LinkerInstance => el != null)
    .map((el) => JSON.parse(JSON.stringify(el)))
  historyManager.send('update', { shapes, updates })
  return { document: { ...state.document, elements }, isDirty: true }
}

interface Viewport {
  x: number
  y: number
  scale: number
}

interface EditorState {
  /** 当前文档数据 */
  document: DocumentData
  /** 选中的元素 ID 集合（含图形与连线） */
  selectedIds: Set<string>
  /** 鼠标悬停的元素 ID */
  hoveredId: string | null
  /** 连线创建草稿（锚点拖拽中） */
  linkerDraft: LinkerDraft | null
  /** 文字编辑状态：block 为图形 textBlock 下标；连线为 -1；fresh 标记刚创建未输入的自由文本 */
  textEdit: { id: string; block: number; fresh?: boolean } | null
  /** 面板拖拽创建中的图形预览（creating_from_panel；位置由 panelDrag 直操） */
  creatingShape: ElementInstance | null
  /** 剪贴板（复制时存入，粘贴时读取） */
  clipboard: ClipboardData | null
  /** 当前工具 */
  currentTool: 'select' | 'hand' | 'text' | 'linker'
  /** 文档是否被修改（未保存） */
  isDirty: boolean
  /** 视口状态 */
  viewport: Viewport

  // Actions
  setDocument: (doc: DocumentData) => void
  /** ⌘S 保存：写 localStorage，成功后清除脏标记；失败返回 false */
  saveDocument: () => boolean
  /** 启动恢复：载入文档并清空历史栈、复位全部编辑态（不复用 setDocument） */
  loadDocument: (doc: DocumentData) => void
  /** 新建空白文档：清历史、复位编辑态、落盘覆盖自动保存 */
  newDocument: () => void
  selectElement: (id: string, multi?: boolean) => void
  clearSelection: () => void
  setHoveredId: (id: string | null) => void
  setTool: (tool: EditorState['currentTool']) => void
  updateElement: (id: string, updates: Partial<ElementInstance>) => void
  resizeElement: (id: string, x: number, y: number, w: number, h: number) => void
  moveElements: (ids: string[], dx: number, dy: number) => void
  /** 批量设置选区（全选/框选入口；mode='add' 合并现有选区） */
  selectIds: (ids: string[], mode: 'replace' | 'add') => void
  /** 切换字体样式（加粗/斜体/下划线）：作用于全部选中图形与连线，单条历史 */
  toggleFontStyle: (key: 'bold' | 'italic' | 'underline') => void
  /** 移动元素但不记历史（供方向键连按批处理，配合 beginBatch/commitBatch） */
  moveElementsNoHistory: (ids: string[], dx: number, dy: number) => void
  /** ⌘G 组合：≥2 个未锁定图形编为新组；被抽空的旧组自动解散；单条历史 */
  groupSelected: () => void
  /** ⇧⌘G 取消组合：整组清除选中图形所属各组的 groupId；单条历史 */
  ungroupSelected: () => void
  addElement: (element: ElementInstance) => void
  addLinker: (linker: LinkerInstance) => void
  updateLinker: (id: string, updates: Partial<LinkerInstance>) => void
  /** 重置手动路由：清除 manualRoute 并按当前图形位置重新自动路由 */
  resetLinkerRoute: (id: string) => void
  deleteElement: (id: string) => void
  deleteElements: (ids: string[]) => void
  setLinkerDraft: (draft: LinkerDraft | null) => void
  copySelectedElements: () => void
  pasteElements: (offsetX?: number, offsetY?: number) => void
  setTextEdit: (v: { id: string; block: number; fresh?: boolean } | null) => void
  updatePage: (patch: Partial<PageConfig>) => void
  setCreatingShape: (el: ElementInstance | null) => void
  updateViewport: (viewport: Partial<Viewport>) => void
  getVisibleElements: () => (ElementInstance | LinkerInstance)[]

  // 撤销重做
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  // 批量控制（拖拽/调整大小时使用）
  beginBatch: (ids?: string[]) => void
  commitBatch: () => void

  // 层级调整
  layerShapes: (ids: string[], action: 'front' | 'back' | 'forward' | 'backward') => void

  // 排列：对齐/分布/匹配大小（≥2/≥3 个非连线未锁定图形；单条历史，附着连线联动）
  alignShapes: (ids: string[], dir: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void
  distributeShapes: (ids: string[], dir: 'horizontal' | 'vertical') => void
  matchSize: (ids: string[], opts: { w?: boolean; h?: boolean }) => void

  // 锁定/解锁
  toggleLock: (ids: string[]) => void
  lockShapes: (ids: string[]) => void
  unlockShapes: (ids: string[]) => void

  // 格式刷
  brushData: {
    fillStyle?: ElementInstance['fillStyle']
    lineStyle?: ElementInstance['lineStyle']
    fontStyle?: ElementInstance['fontStyle']
  } | null
  startBrush: () => void
  applyBrush: (targetIds: string[]) => void
  cancelBrush: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  document: createEmptyDocument(),
  selectedIds: new Set(),
  hoveredId: null,
  linkerDraft: null,
  textEdit: null,
  creatingShape: null,
  clipboard: null,
  currentTool: 'select',
  isDirty: false,
  brushData: null,
  // 初始视口：页面左上角对齐容器左上角（Canvas 组件可在首次渲染时居中）
  viewport: { x: 0, y: 0, scale: 1 },

  // 换文档必关编辑器：旧文档的编辑会话对新文档无意义（textEdit 必须指向当前文档内元素）
  setDocument: (doc) => set({ document: doc, isDirty: false, textEdit: null }),

  // ⌘S 保存：写 localStorage，成功后清除脏标记；失败保留 isDirty 提示未保存
  saveDocument: () => {
    const ok = saveDocumentToStorage(get().document)
    if (ok) set({ isDirty: false })
    return ok
  },

  // 启动恢复：载入持久化文档。与 setDocument 的区别：
  // - 清空历史栈（持久化文档的撤销/重做对用户无意义）
  // - 复位全部编辑态（选区/草稿/剪贴板/工具/格式刷/悬停），避免指向旧文档元素
  loadDocument: (doc) => {
    historyManager.clear()
    set({
      document: doc,
      selectedIds: new Set(),
      hoveredId: null,
      linkerDraft: null,
      textEdit: null,
      creatingShape: null,
      clipboard: null,
      currentTool: 'select',
      brushData: null,
      isDirty: false,
    })
  },

  newDocument: () => {
    const doc = createEmptyDocument()
    historyManager.clear()
    saveDocumentToStorage(doc)
    set({
      document: doc,
      selectedIds: new Set(),
      hoveredId: null,
      linkerDraft: null,
      textEdit: null,
      creatingShape: null,
      clipboard: null,
      currentTool: 'select',
      brushData: null,
      isDirty: false,
    })
  },

  // 普通点击：单选；multi（Ctrl/Shift）：切换加入/移出选区
  selectElement: (id, multi = false) =>
    set((state) => {
      const ids = expandGroupIds(state.document.elements, [id])
      if (multi) {
        const next = new Set(state.selectedIds)
        // 若该组任一成员已在选区，则整组移出；否则整组加入
        const present = ids.some((x) => next.has(x))
        for (const x of ids) {
          if (present) next.delete(x)
          else next.add(x)
        }
        return { selectedIds: next }
      }
      // 选区已恰为整组时避免无谓更新
      if (state.selectedIds.size === ids.length && ids.every((x) => state.selectedIds.has(x))) {
        return state
      }
      return { selectedIds: new Set(ids) }
    }),

  clearSelection: () => set({ selectedIds: new Set() }),

  setHoveredId: (id) => set((s) => (s.hoveredId === id ? s : { hoveredId: id })),

  setTool: (tool) => set({ currentTool: tool }),

  updateElement: (id, updates) =>
    set((state) => {
      const el = state.document.elements[id]
      if (!el || el.name === 'linker') return state
      const oldEl = JSON.parse(JSON.stringify(el))
      const newEl = { ...el, ...updates } as ElementInstance
      historyManager.send('update', { shapes: [oldEl], updates: [newEl] })
      return {
        document: {
          ...state.document,
          elements: {
            ...state.document.elements,
            [id]: newEl,
          },
        },
        isDirty: true,
      }
    }),

  resizeElement: (id, x, y, w, h) =>
    set((state) => {
      const oldEl = state.document.elements[id]
      if (!oldEl) return state
      const oldSnapshot = JSON.parse(JSON.stringify(oldEl))
      const newDoc = resizeElementInDoc(state.document, id, x, y, w, h)
      const newEl = newDoc.elements[id]
      if (newEl) {
        historyManager.send('update', { shapes: [oldSnapshot], updates: [JSON.parse(JSON.stringify(newEl))] })
      }
      return { document: newDoc, isDirty: true }
    }),

  moveElements: (ids, dx, dy) =>
    set((state) => {
      // 快照范围并入被联动路由的附着连线（否则撤销移动后连线端点不回位）
      const snapshotIds = [...new Set([...ids, ...attachedLinkerIds(state.document.elements, ids)])]
      const oldSnapshots = snapshotIds
        .map((id) => state.document.elements[id])
        .filter((el): el is ElementInstance | LinkerInstance => el != null)
        .map((el) => JSON.parse(JSON.stringify(el)))
      const newDoc = moveElementsInDoc(state.document, ids, dx, dy)
      const newSnapshots = snapshotIds
        .map((id) => newDoc.elements[id])
        .filter((el): el is ElementInstance | LinkerInstance => el != null)
        .map((el) => JSON.parse(JSON.stringify(el)))
      if (oldSnapshots.length > 0) {
        historyManager.send('update', { shapes: oldSnapshots, updates: newSnapshots })
      }
      return { document: newDoc, isDirty: true }
    }),

  moveElementsNoHistory: (ids, dx, dy) =>
    set((state) => {
      const newDoc = moveElementsInDoc(state.document, ids, dx, dy)
      return { document: newDoc, isDirty: true }
    }),

  selectIds: (ids, mode) =>
    set((state) => {
      // 框选/全选入口：命中任一组成员即整组展开
      const expanded = expandGroupIds(state.document.elements, ids)
      if (mode === 'add') {
        if (expanded.length === 0) return state
        const next = new Set(state.selectedIds)
        for (const id of expanded) next.add(id)
        return { selectedIds: next }
      }
      if (expanded.length === 0) {
        return state.selectedIds.size === 0 ? state : { selectedIds: new Set<string>() }
      }
      return { selectedIds: new Set(expanded) }
    }),

  toggleFontStyle: (key) => {
    const state = get()
    if (state.selectedIds.size === 0) return
    // 批处理包裹：多个元素的切换合并为一条撤销记录
    state.beginBatch()
    for (const id of [...state.selectedIds]) {
      const el = get().document.elements[id]
      if (!el) continue
      if (isLinker(el)) {
        // 连线 fontStyle 可选，以 LINKER_FONT_DEFAULTS 兜底取当前值
        const base = { ...LINKER_FONT_DEFAULTS, ...el.fontStyle }
        get().updateLinker(id, { fontStyle: { ...el.fontStyle, [key]: !base[key] } })
      } else {
        const current = el.fontStyle ?? {}
        get().updateElement(id, { fontStyle: { ...current, [key]: !(current[key] ?? false) } })
      }
    }
    state.commitBatch()
  },

  groupSelected: () =>
    set((state) => {
      // 参与者 = 选中、非连线、未锁定图形（选择已整组展开，无需再展开）
      const participants = [...state.selectedIds]
        .map((id) => state.document.elements[id])
        .filter((el): el is ElementInstance => el != null && !isLinker(el) && !el.locked)
      if (participants.length < 2) return state

      const gid = newGroupId()
      // 旧快照与涉及的旧组
      const oldSnapshots = new Map<string, ElementInstance>()
      const touchedGroups = new Set<string>()
      for (const p of participants) {
        oldSnapshots.set(p.id, JSON.parse(JSON.stringify(p)))
        if (p.groupId) touchedGroups.add(p.groupId)
      }

      // 写入新组
      const elements = { ...state.document.elements }
      for (const p of participants) {
        elements[p.id] = { ...p, groupId: gid }
      }

      // 解散检查：被抽走成员的旧组若剩余 ≤1 成员则自动解散
      for (const oldGid of touchedGroups) {
        const remaining = Object.values(elements).filter(
          (el): el is ElementInstance => !isLinker(el) && el.groupId === oldGid,
        )
        if (remaining.length <= 1) {
          for (const r of remaining) {
            const old = state.document.elements[r.id]
            if (old && !oldSnapshots.has(r.id)) {
              oldSnapshots.set(r.id, JSON.parse(JSON.stringify(old)))
            }
            const { groupId: _omit, ...rest } = r
            elements[r.id] = rest
          }
        }
      }

      // 单条 'update' 历史：旧快照与新状态平行数组
      const shapes: ElementInstance[] = []
      const updates: ElementInstance[] = []
      for (const [id, oldEl] of oldSnapshots) {
        shapes.push(oldEl)
        updates.push(JSON.parse(JSON.stringify(elements[id])))
      }
      historyManager.send('update', { shapes, updates })
      return { document: { ...state.document, elements }, isDirty: true }
    }),

  ungroupSelected: () =>
    set((state) => {
      // 收集选中图形所属的组
      const gids = new Set<string>()
      for (const id of state.selectedIds) {
        const el = state.document.elements[id]
        if (el && !isLinker(el) && el.groupId) gids.add(el.groupId)
      }
      if (gids.size === 0) return state

      // 整组清除（不只选中成员）
      const shapes: ElementInstance[] = []
      const updates: ElementInstance[] = []
      const elements = { ...state.document.elements }
      for (const el of Object.values(state.document.elements)) {
        if (!isLinker(el) && el.groupId && gids.has(el.groupId)) {
          shapes.push(JSON.parse(JSON.stringify(el)))
          const { groupId: _omit, ...rest } = el
          elements[el.id] = rest
          updates.push(JSON.parse(JSON.stringify(rest)))
        }
      }
      historyManager.send('update', { shapes, updates })
      return { document: { ...state.document, elements }, isDirty: true }
    }),

  addElement: (element) =>
    set((state) => {
      historyManager.send('create', { elements: [JSON.parse(JSON.stringify(element))] })
      return {
        document: {
          ...state.document,
          elements: {
            ...state.document.elements,
            [element.id]: element,
          },
        },
        isDirty: true,
      }
    }),

  addLinker: (linker) =>
    set((state) => {
      historyManager.send('create', { elements: [JSON.parse(JSON.stringify(linker))] })
      return {
        document: {
          ...state.document,
          elements: {
            ...state.document.elements,
            [linker.id]: linker,
          },
        },
        isDirty: true,
      }
    }),

  updateLinker: (id, updates) =>
    set((state) => {
      const el = state.document.elements[id]
      if (!el || !isLinker(el)) return state
      const oldEl = JSON.parse(JSON.stringify(el))
      const newEl = { ...el, ...updates } as LinkerInstance
      historyManager.send('update', { shapes: [oldEl], updates: [newEl] })
      return {
        document: {
          ...state.document,
          elements: {
            ...state.document.elements,
            [id]: newEl,
          },
        },
        isDirty: true,
      }
    }),

  resetLinkerRoute: (id) => {
    const state = get()
    const next = resetManualRoute(state.document, id)
    if (next === state.document) return
    const oldEl = JSON.parse(JSON.stringify(state.document.elements[id]))
    const newEl = JSON.parse(JSON.stringify(next.elements[id]!))
    historyManager.send('update', { shapes: [oldEl], updates: [newEl] })
    set({ document: next, isDirty: true })
  },

  deleteElement: (id) => get().deleteElements([id]),

  deleteElements: (ids) =>
    set((state) => {
      if (ids.length === 0) return state
      // 先缓存被删除的元素快照（用于 undo）
      const removedElements = ids
        .map((id) => state.document.elements[id])
        .filter((el): el is ElementInstance | LinkerInstance => el != null)
        .map((el) => JSON.parse(JSON.stringify(el)))
      const { document, removedIds } = deleteElementsInDoc(state.document, ids)
      // 还需要包含级联删除的连线
      const cascadedLinkers = [...removedIds]
        .filter((id) => !ids.includes(id))
        .map((id) => state.document.elements[id])
        .filter((el): el is LinkerInstance => el != null && isLinker(el))
        .map((el) => JSON.parse(JSON.stringify(el)))
      const allRemoved = [...removedElements, ...cascadedLinkers]
      if (allRemoved.length > 0) {
        historyManager.send('remove', { elements: allRemoved })
      }
      return {
        document,
        selectedIds: new Set([...state.selectedIds].filter((sid) => !removedIds.has(sid))),
        textEdit:
          state.textEdit && removedIds.has(state.textEdit.id) ? null : state.textEdit,
        isDirty: true,
      }
    }),

  setLinkerDraft: (draft) => set({ linkerDraft: draft }),

  // 复制选中元素（深拷贝 + ID 映射；连线端点仅当对端也在选区时保留引用）
  copySelectedElements: () =>
    set((state) => {
      if (state.selectedIds.size === 0) return state
      const idMap: Record<string, string> = {}
      const shapes: ElementInstance[] = []
      const linkers: LinkerInstance[] = []
      const selectedIds = new Set(state.selectedIds)

      // 按 zindex 升序排序，保持层级顺序
      const sorted = [...state.selectedIds]
        .map((id) => state.document.elements[id])
        .filter((el): el is ElementInstance | LinkerInstance => el != null)
        .sort((a, b) => a.props.zindex - b.props.zindex)

      for (const el of sorted) {
        const newId = `el-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        idMap[el.id] = newId
        if (isLinker(el)) {
          const l: LinkerInstance = JSON.parse(JSON.stringify(el))
          l.id = newId
          // 连线端点：对端在选区则映射新 ID，否则变为自由端点
          if (l.from.id && selectedIds.has(l.from.id)) {
            l.from.id = idMap[l.from.id] ?? null
          } else {
            l.from.id = null
          }
          if (l.to.id && selectedIds.has(l.to.id)) {
            l.to.id = idMap[l.to.id] ?? null
          } else {
            l.to.id = null
          }
          linkers.push(l)
        } else {
          const shape: ElementInstance = JSON.parse(JSON.stringify(el))
          shape.id = newId
          shapes.push(shape)
        }
      }

      return {
        // 副本组重映射：与原组彻底独立（整组复制时换发新 groupId）
        clipboard: { shapes: remapGroupIdsForCopy(shapes, state.document.elements), linkers, idMap },
      }
    }),

  // 粘贴剪贴板元素（默认偏移 20px；offsetX/offsetY 指定时以该点为包围盒中心）
  pasteElements: (offsetX?: number, offsetY?: number) =>
    set((state) => {
      if (!state.clipboard) return state
      const { shapes, linkers } = state.clipboard
      if (shapes.length === 0 && linkers.length === 0) return state

      const newElements: Record<string, ElementInstance | LinkerInstance> = {}
      const dx = offsetX !== undefined ? 0 : 20
      const dy = offsetY !== undefined ? 0 : 20
      const zMax = Math.max(
        0,
        ...Object.values(state.document.elements).map((e) => e.props.zindex),
      )

      let z = zMax + 1
      for (const shape of shapes) {
        const s: ElementInstance = {
          ...JSON.parse(JSON.stringify(shape)),
          props: { ...shape.props, zindex: z++ },
        }
        // 有指定偏移则以包围盒中心为基准；否则统一 +20px
        if (offsetX !== undefined && offsetY !== undefined) {
          s.props.x = offsetX - s.props.w / 2
          s.props.y = offsetY - s.props.h / 2
        } else {
          s.props.x += dx
          s.props.y += dy
        }
        newElements[s.id] = s
      }
      for (const linker of linkers) {
        const l: LinkerInstance = {
          ...JSON.parse(JSON.stringify(linker)),
          props: { ...linker.props, zindex: z++ },
        }
        if (offsetX !== undefined && offsetY !== undefined) {
          // 偏移所有点坐标
          const cx = offsetX
          const cy = offsetY
          // 计算包围盒中心与目标中心的偏移
          const lx = (linker.from.x + linker.to.x) / 2
          const ly = (linker.from.y + linker.to.y) / 2
          const pdx = cx - lx
          const pdy = cy - ly
          l.from.x += pdx
          l.from.y += pdy
          l.to.x += pdx
          l.to.y += pdy
          l.points = l.points.map((p) => ({ x: p.x + pdx, y: p.y + pdy }))
        } else {
          l.from.x += dx
          l.from.y += dy
          l.to.x += dx
          l.to.y += dy
          l.points = l.points.map((p) => ({ x: p.x + dx, y: p.y + dy }))
        }
        newElements[l.id] = l
      }

      // 记录到历史（用于 undo）
      const allNew = Object.values(newElements)
      if (allNew.length > 0) {
        historyManager.send('create', { elements: JSON.parse(JSON.stringify(allNew)) })
      }

      return {
        document: {
          ...state.document,
          elements: { ...state.document.elements, ...newElements },
        },
        selectedIds: new Set(Object.keys(newElements)),
        isDirty: true,
      }
    }),

  setTextEdit: (v) => set((s) => (s.textEdit === v ? s : { textEdit: v })),

  updatePage: (patch) =>
    set((state) => {
      const oldPage = JSON.parse(JSON.stringify(state.document.page))
      const newPage = { ...state.document.page, ...patch }
      historyManager.send('updatePage', { oldPage, newPage })
      return {
        document: { ...state.document, page: newPage },
        isDirty: true,
      }
    }),

  setCreatingShape: (el) => set((s) => (s.creatingShape === el ? s : { creatingShape: el })),

  updateViewport: (vp) =>
    set((state) => ({
      viewport: { ...state.viewport, ...vp },
    })),

  getVisibleElements: () => {
    const { elements } = get().document
    return Object.values(elements).filter(
      (el) => el.name === 'linker' || (el as ElementInstance).attribute?.visible !== false,
    )
  },

  // 撤销重做实现
  undo: () => {
    const cmds = historyManager.undo()
    if (!cmds) return

    set((state) => {
      let elements = { ...state.document.elements }
      let page = state.document.page

      for (const cmd of cmds) {
        if (cmd.action === 'updatePage') {
          const { oldPage } = getPageFromCommand(cmd)
          if (oldPage) page = oldPage
        } else {
          elements = reverseCommand(cmd, elements)
        }
      }

      return {
        document: { ...state.document, elements, page },
        isDirty: true,
      }
    })
  },

  redo: () => {
    const cmds = historyManager.redo()
    if (!cmds) return

    set((state) => {
      let elements = { ...state.document.elements }
      let page = state.document.page

      for (const cmd of cmds) {
        if (cmd.action === 'updatePage') {
          const { newPage } = getPageFromCommand(cmd)
          if (newPage) page = newPage
        } else {
          elements = applyCommand(cmd, elements)
        }
      }

      return {
        document: { ...state.document, elements, page },
        isDirty: true,
      }
    })
  },

  canUndo: () => historyManager.canUndo(),
  canRedo: () => historyManager.canRedo(),

  beginBatch: (ids) => historyManager.beginBatch(ids),
  commitBatch: () => historyManager.commit(),

  // 层级调整
  layerShapes: (ids, action) =>
    set((state) => {
      const elements = { ...state.document.elements }
      const idSet = new Set(ids)
      const allEls = Object.values(elements)

      // 仅图形参与 z 序（连线不占 z 层）
      const shapeEls = allEls.filter((e): e is ElementInstance => !isLinker(e))
      // 按 zindex 升序（底→顶）
      const sorted = [...shapeEls].sort((a, b) => a.props.zindex - b.props.zindex)

      const oldSnapshots: ElementInstance[] = []
      const newSnapshots: ElementInstance[] = []

      if (action === 'forward' || action === 'backward') {
        // 单步移动前统一归一化为 0..n-1（叠放序），避免同 z / 大间隔导致交换后重分配无变化
        for (let i = 0; i < sorted.length; i++) {
          const el = sorted[i]!
          if (el.props.zindex === i) continue
          const oldEl = JSON.parse(JSON.stringify(el)) as ElementInstance
          const newEl = { ...el, props: { ...el.props, zindex: i } } as ElementInstance
          elements[el.id] = newEl
          sorted[i] = newEl
          oldSnapshots.push(oldEl)
          newSnapshots.push(newEl)
        }

        const movable = (e: ElementInstance) => idSet.has(e.id) && !e.locked

        const swapZAt = (i: number, j: number) => {
          const a = sorted[i]!
          const b = sorted[j]!
          const zA = a.props.zindex
          const zB = b.props.zindex
          if (zA === zB) return
          const oldA = JSON.parse(JSON.stringify(a)) as ElementInstance
          const oldB = JSON.parse(JSON.stringify(b)) as ElementInstance
          const newA = { ...a, props: { ...a.props, zindex: zB } } as ElementInstance
          const newB = { ...b, props: { ...b.props, zindex: zA } } as ElementInstance
          elements[a.id] = newA
          elements[b.id] = newB
          sorted[i] = newA
          sorted[j] = newB
          oldSnapshots.push(oldA, oldB)
          newSnapshots.push(newA, newB)
        }

        if (action === 'forward') {
          // 顶→底：可移动块与上方相邻不可移动元素交换 zindex
          for (let i = sorted.length - 1; i >= 0; i--) {
            if (movable(sorted[i]!) && i + 1 < sorted.length && !movable(sorted[i + 1]!)) {
              swapZAt(i, i + 1)
            }
          }
        } else {
          // 底→顶：可移动块与下方相邻不可移动元素交换 zindex
          for (let i = 0; i < sorted.length; i++) {
            if (movable(sorted[i]!) && i - 1 >= 0 && !movable(sorted[i - 1]!)) {
              swapZAt(i - 1, i)
            }
          }
        }
      } else {
        // front / back：整体置于最顶/最底
        const allZ = shapeEls.map((e) => e.props.zindex)
        const maxZ = allZ.length > 0 ? Math.max(...allZ) : 0
        const minZ = allZ.length > 0 ? Math.min(...allZ) : 0
        for (const id of ids) {
          const el = elements[id]
          if (!el || isLinker(el) || el.locked) continue
          const oldEl = JSON.parse(JSON.stringify(el)) as ElementInstance
          const newZ = action === 'front' ? maxZ + 1 : minZ - 1
          const newEl = { ...el, props: { ...el.props, zindex: newZ } } as ElementInstance
          elements[id] = newEl
          oldSnapshots.push(oldEl)
          newSnapshots.push(newEl)
        }
      }

      if (oldSnapshots.length > 0) {
        historyManager.send('update', { shapes: oldSnapshots, updates: newSnapshots })
      }

      return { document: { ...state.document, elements }, isDirty: true }
    }),

  alignShapes: (ids, dir) =>
    set((state) => {
      const { elements, changedIds } = applyShapeTransform(state.document.elements, ids, (els) => alignShapes(els, dir))
      return commitAlign(state, elements, changedIds)
    }),

  distributeShapes: (ids, dir) =>
    set((state) => {
      const { elements, changedIds } = applyShapeTransform(state.document.elements, ids, (els) => distributeShapes(els, dir))
      return commitAlign(state, elements, changedIds)
    }),

  matchSize: (ids, opts) =>
    set((state) => {
      const { elements, changedIds } = applyShapeTransform(state.document.elements, ids, (els) => matchSize(els, opts))
      return commitAlign(state, elements, changedIds)
    }),

  // 锁定/解锁
  toggleLock: (ids) =>
    set((state) => {
      const elements = { ...state.document.elements }
      // 检查是否全部已锁定
      const allLocked = ids.every((id) => elements[id]?.locked)
      const newLocked = !allLocked // 切换

      const oldSnapshots: ElementInstance[] = []
      const newSnapshots: ElementInstance[] = []

      for (const id of ids) {
        const el = elements[id]
        if (!el || isLinker(el)) continue
        const oldEl = JSON.parse(JSON.stringify(el)) as ElementInstance
        const newEl = { ...el, locked: newLocked } as ElementInstance
        elements[id] = newEl
        oldSnapshots.push(oldEl)
        newSnapshots.push(newEl)
      }

      if (oldSnapshots.length > 0) {
        historyManager.send('update', { shapes: oldSnapshots, updates: newSnapshots })
      }

      return { document: { ...state.document, elements }, isDirty: true }
    }),

  // 锁定图形
  lockShapes: (ids) =>
    set((state) => {
      const elements = { ...state.document.elements }
      const oldSnapshots: ElementInstance[] = []
      const newSnapshots: ElementInstance[] = []

      for (const id of ids) {
        const el = elements[id]
        if (!el || isLinker(el) || el.locked) continue
        const oldEl = JSON.parse(JSON.stringify(el)) as ElementInstance
        const newEl = { ...el, locked: true } as ElementInstance
        elements[id] = newEl
        oldSnapshots.push(oldEl)
        newSnapshots.push(newEl)
      }

      if (oldSnapshots.length > 0) {
        historyManager.send('update', { shapes: oldSnapshots, updates: newSnapshots })
      }

      return { document: { ...state.document, elements }, isDirty: true }
    }),

  // 解锁图形
  unlockShapes: (ids) =>
    set((state) => {
      const elements = { ...state.document.elements }
      const oldSnapshots: ElementInstance[] = []
      const newSnapshots: ElementInstance[] = []

      for (const id of ids) {
        const el = elements[id]
        if (!el || isLinker(el) || !el.locked) continue
        const oldEl = JSON.parse(JSON.stringify(el)) as ElementInstance
        const newEl = { ...el, locked: false } as ElementInstance
        elements[id] = newEl
        oldSnapshots.push(oldEl)
        newSnapshots.push(newEl)
      }

      if (oldSnapshots.length > 0) {
        historyManager.send('update', { shapes: oldSnapshots, updates: newSnapshots })
      }

      return { document: { ...state.document, elements }, isDirty: true }
    }),

  // 格式刷：复制第一个选中图形的样式
  startBrush: () =>
    set((state) => {
      if (state.selectedIds.size === 0) return state
      const firstId = [...state.selectedIds][0]!
      const el = state.document.elements[firstId]
      if (!el || isLinker(el)) return state

      return {
        brushData: {
          fillStyle: JSON.parse(JSON.stringify(el.fillStyle)),
          lineStyle: JSON.parse(JSON.stringify(el.lineStyle)),
          fontStyle: JSON.parse(JSON.stringify(el.fontStyle)),
        },
      }
    }),

  // 格式刷：应用样式到目标
  applyBrush: (targetIds) =>
    set((state) => {
      if (!state.brushData) return state
      const elements = { ...state.document.elements }

      const oldSnapshots: ElementInstance[] = []
      const newSnapshots: ElementInstance[] = []

      for (const id of targetIds) {
        const el = elements[id]
        if (!el || isLinker(el) || el.locked) continue

        const oldEl = JSON.parse(JSON.stringify(el)) as ElementInstance
        const newEl: ElementInstance = {
          ...el,
          // 格式刷样式合并：brushData 的字段覆盖目标（空对象也保留，避免 ?? 不触发）
          fillStyle: state.brushData.fillStyle ? { ...(el.fillStyle ?? {}), ...state.brushData.fillStyle } : el.fillStyle,
          lineStyle: state.brushData.lineStyle ? { ...(el.lineStyle ?? {}), ...state.brushData.lineStyle } : el.lineStyle,
          fontStyle: state.brushData.fontStyle ? { ...(el.fontStyle ?? {}), ...state.brushData.fontStyle } : el.fontStyle,
        }
        elements[id] = newEl
        oldSnapshots.push(oldEl)
        newSnapshots.push(newEl)
      }

      if (oldSnapshots.length > 0) {
        historyManager.send('update', { shapes: oldSnapshots, updates: newSnapshots })
      }

      // 应用后保持刷子模式，用户可以继续应用到其他图形
      return { document: { ...state.document, elements }, isDirty: true }
    }),

  cancelBrush: () => set({ brushData: null }),
}))
