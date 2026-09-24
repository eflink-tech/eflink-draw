import { create } from 'zustand'

/** 图形分类定义 */
export interface ShapeCategory {
  id: string
  name: string
  icon: string  // lucide-react icon name
  /** 二级子分组（如 UML 下的通用/类图…）：仅作二级标题，折叠/展开由父分组控制 */
  children?: Array<{ id: string; name: string }>
}

/** 预定义的图形分类 */
export const SHAPE_CATEGORIES: ShapeCategory[] = [
  { id: 'basic', name: '基础图形', icon: 'Square' },
  { id: 'flow', name: '流程图', icon: 'GitBranch' },
  { id: 'bpmn', name: 'BPMN', icon: 'Workflow' },
  { id: 'lane', name: '泳池/泳道', icon: 'Columns' },
  // UML：单一主分组，子分类作为二级标题（折叠/展开仅作用于主分组）
  {
    id: 'uml',
    name: 'UML',
    icon: 'Folder',
    children: [
      { id: 'uml_common', name: '通用' },
      { id: 'uml_class', name: '类图' },
      { id: 'uml_sequence', name: '序列图' },
      { id: 'uml_usecase', name: '用例图' },
      { id: 'uml_stateactivity', name: '状态/活动图' },
      { id: 'uml_deployment', name: '部署图' },
      { id: 'uml_component', name: '组件图' },
    ],
  },
]

interface UIState {
  /** 左侧面板当前激活的分类 */
  activeCategory: string
  /** 左侧面板可见性 */
  leftPanelVisible: boolean
  /** 右侧面板可见性 */
  rightPanelVisible: boolean
  /** AI 助手面板可见性 */
  aiPanelVisible: boolean
  /** 专注模式：隐藏顶栏/底栏/左右面板，画布占满窗口（Esc 退出） */
  focusMode: boolean

  setActiveCategory: (category: string) => void
  toggleLeftPanel: () => void
  toggleRightPanel: () => void
  toggleAiPanel: () => void
  setFocusMode: (v: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeCategory: 'basic',
  leftPanelVisible: true,
  rightPanelVisible: true,
  aiPanelVisible: false,
  focusMode: false,

  setActiveCategory: (category) => set({ activeCategory: category }),
  toggleLeftPanel: () => set((s) => ({ leftPanelVisible: !s.leftPanelVisible })),
  toggleRightPanel: () => set((s) => ({ rightPanelVisible: !s.rightPanelVisible })),
  toggleAiPanel: () => set((s) => ({ aiPanelVisible: !s.aiPanelVisible })),
  setFocusMode: (v) => set({ focusMode: v }),
}))
