import { create } from 'zustand'

/** 图形分类定义 */
export interface ShapeCategory {
  id: string
  name: string
  icon: string  // lucide-react icon name
}

/** 预定义的图形分类 */
export const SHAPE_CATEGORIES: ShapeCategory[] = [
  { id: 'basic', name: '基础图形', icon: 'Square' },
  { id: 'flow', name: '流程图', icon: 'GitBranch' },
  { id: 'bpmn', name: 'BPMN', icon: 'Workflow' },
  { id: 'lane', name: '泳池/泳道', icon: 'Columns' },
  // UML 图形分类
  { id: 'uml_common', name: 'UML 通用', icon: 'Folder' },
  { id: 'uml_class', name: 'UML 类图', icon: 'SquareStack' },
  { id: 'uml_sequence', name: 'UML 序列图', icon: 'ArrowDownUp' },
  { id: 'uml_usecase', name: 'UML 用例图', icon: 'Users' },
  { id: 'uml_stateactivity', name: 'UML 状态/活动图', icon: 'CircleDot' },
  { id: 'uml_deployment', name: 'UML 部署图', icon: 'Server' },
  { id: 'uml_component', name: 'UML 组件图', icon: 'Box' },
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
