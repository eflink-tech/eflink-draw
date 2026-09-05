import { useState } from 'react'
import { useUIStore, SHAPE_CATEGORIES } from '@/store/uiStore'
import { shapeRegistry } from '@/core/schema/registry'
import { useEditorStore } from '@/store/editorStore'
import { startPanelDrag } from '@/core/editor/panelDrag'
import { ShapePreview } from '@/components/common/ShapePreview'
import {
  // 基础
  Square, Circle, Diamond, Triangle, Pentagon, Hexagon,
  GitBranch, ArrowRight, CircleDot, CircleDashed, Disc3,
  Workflow, Box, Users, Database,
  Columns, Minus, Grid2x2,
  ChevronDown, ChevronRight, Search,
  // 基础图形扩展
  RectangleHorizontal, RectangleVertical, Octagon, Star,
  Cloud, MessageCircle, Droplet,
  Plus, ArrowLeft, ArrowLeftRight, ArrowUp, ArrowDown, ArrowUpDown,
  Undo2, Redo2, CornerDownRight,
  Braces, Brackets, MessageSquare, Type,
  // 流程图扩展
  FileText, Layers, HardDrive, Grid3x3, List, Keyboard, CreditCard,
  ScrollText, Monitor, Hand, Equal, Repeat, ArrowDownToLine, StickyNote,
  SquareStack, SquareDashed,
  // UML 图形扩展
  Folder, Server, X, Hourglass,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/** 分类对应的图标映射 */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  basic: Square,
  flow: GitBranch,
  bpmn: Workflow,
  lane: Columns,
  // UML 分类
  uml_common: Folder,
  uml_class: Box,
  uml_sequence: ArrowRight,
  uml_usecase: Users,
  uml_stateactivity: CircleDot,
  uml_deployment: Server,
  uml_component: Box,
}

/** 每个分类下的示例图形（Phase 1 用占位，Phase 2 从 registry 获取） */
const CATEGORY_SHAPES: Record<string, Array<{ name: string; title: string; icon: LucideIcon }>> = {
  basic: [
    { name: 'text', title: '文本', icon: Type },
    // 基础几何
    { name: 'rectangle', title: '矩形', icon: Square },
    { name: 'roundRectangle', title: '圆角矩形', icon: RectangleHorizontal },
    { name: 'round', title: '圆形', icon: Circle },
    { name: 'triangle', title: '三角形', icon: Triangle },
    { name: 'diamond', title: '菱形', icon: Diamond },
    { name: 'polygon', title: '五边形', icon: Pentagon },
    { name: 'hexagon', title: '六边形', icon: Hexagon },
    { name: 'octagon', title: '八边形', icon: Octagon },
    { name: 'pentagon', title: '五角星', icon: Star },
    // 曲线图形
    { name: 'sector', title: '扇形', icon: CircleDot },
    { name: 'sector2', title: '扇形2', icon: CircleDot },
    { name: 'cloud', title: '云', icon: Cloud },
    { name: 'comment', title: '对话气泡', icon: MessageCircle },
    { name: 'teardrop', title: '水滴', icon: Droplet },
    // 十字形与 APQC
    { name: 'cross', title: '十字形', icon: Plus },
    { name: 'apqc', title: 'APQC', icon: Box },
    // 箭头类
    { name: 'singleLeftArrow', title: '左箭头', icon: ArrowLeft },
    { name: 'singleRightArrow', title: '右箭头', icon: ArrowRight },
    { name: 'doubleHorizontalArrow', title: '左右箭头', icon: ArrowLeftRight },
    { name: 'singleUpArrow', title: '上箭头', icon: ArrowUp },
    { name: 'singleDownArrow', title: '下箭头', icon: ArrowDown },
    { name: 'doubleVerticalArrow', title: '上下箭头', icon: ArrowUpDown },
    { name: 'backArrow', title: '左返回箭头', icon: Undo2 },
    { name: 'rightBackArrow', title: '右返回箭头', icon: Redo2 },
    { name: 'corner', title: '拐角', icon: CornerDownRight },
    // 括号类
    { name: 'braces', title: '大括号', icon: Braces },
    { name: 'parentheses', title: '中括号', icon: Brackets },
    { name: 'rightBrace', title: '备注（右）', icon: MessageSquare },
    { name: 'leftBrace', title: '备注（左）', icon: MessageSquare },
  ],
  flow: [
    { name: 'process', title: '流程', icon: Square },
    { name: 'decision', title: '判定', icon: Diamond },
    { name: 'terminator', title: '开始/结束', icon: CircleDot },
    { name: 'document', title: '文档', icon: FileText },
    { name: 'data', title: '数据', icon: Database },
    { name: 'predefinedProcess', title: '子流程', icon: Layers },
    { name: 'storedData', title: '外部数据', icon: HardDrive },
    { name: 'internalStorage', title: '内部存储', icon: Grid3x3 },
    { name: 'sequentialData', title: '队列数据', icon: List },
    { name: 'directData', title: '数据库', icon: Database },
    { name: 'manualInput', title: '人工输入', icon: Keyboard },
    { name: 'card', title: '卡片', icon: CreditCard },
    { name: 'paperTape', title: '条带', icon: ScrollText },
    { name: 'display', title: '展示', icon: Monitor },
    { name: 'manualOperation', title: '人工操作', icon: Hand },
    { name: 'preparation', title: '预备', icon: Hexagon },
    { name: 'parallelMode', title: '并行模式', icon: Equal },
    { name: 'loopLimit', title: '循环限值', icon: Repeat },
    { name: 'onPageReference', title: '页面内引用', icon: Circle },
    { name: 'offPageReference', title: '跨页引用', icon: ArrowDownToLine },
    { name: 'annotation', title: '注释', icon: StickyNote },
  ],
  bpmn: [
    { name: 'startEvent', title: '开始事件', icon: Circle },
    { name: 'intermediateEvent', title: '中间事件', icon: CircleDot },
    { name: 'boundaryEvent', title: '边界事件', icon: CircleDashed },
    { name: 'endEvent', title: '结束事件', icon: Disc3 },
    { name: 'task', title: '任务', icon: Square },
    { name: 'callActivity', title: '活动', icon: SquareStack },
    { name: 'subProcess', title: '子流程', icon: SquareDashed },
    { name: 'bpmnGateway', title: '网关', icon: Diamond },
    { name: 'dataObject', title: '数据对象', icon: FileText },
    { name: 'dataStore', title: '数据存储', icon: Database },
    { name: 'message', title: '消息', icon: MessageSquare },
    { name: 'group', title: '组', icon: Layers },
    { name: 'textAnnotation', title: '注释', icon: StickyNote },
    { name: 'conversation', title: '对话', icon: Hexagon },
    { name: 'choreographyTask', title: '编排任务', icon: Users },
  ],
  lane: [
    { name: 'verticalPool', title: '泳池(垂直)', icon: RectangleVertical },
    { name: 'verticalLane', title: '泳道(垂直)', icon: RectangleVertical },
    { name: 'horizontalPool', title: '泳池(水平)', icon: RectangleHorizontal },
    { name: 'horizontalLane', title: '泳道(水平)', icon: RectangleHorizontal },
    { name: 'bidirectionalPoolH', title: '双向泳池(水平)', icon: Grid2x2 },
    { name: 'bidirectionalPoolV', title: '双向泳池(垂直)', icon: Grid2x2 },
    { name: 'horizontalSeparator', title: '分隔符(水平)', icon: Minus },
    { name: 'verticalSeparator', title: '分隔符(垂直)', icon: Minus },
  ],
  // UML 通用
  uml_common: [
    { name: 'package', title: '包', icon: SquareStack },
    { name: 'combinedFragment', title: '组合片段', icon: SquareStack },
    { name: 'umlNote', title: '注释', icon: StickyNote },
    { name: 'umlText', title: '文本', icon: Type },
  ],
  // UML 类图
  uml_class: [
    { name: 'simpleClass', title: '简单类', icon: Box },
    { name: 'cls', title: '类', icon: FileText },
    { name: 'interface', title: '接口', icon: SquareStack },
    { name: 'activeClass', title: '活动类', icon: SquareDashed },
    { name: 'multiplictyClass', title: '多例类', icon: Layers },
    { name: 'simpleInterface', title: '简单接口', icon: Box },
    { name: 'constraint', title: '约束', icon: Braces },
    { name: 'port', title: '端口', icon: Square },
  ],
  // UML 序列图
  uml_sequence: [
    { name: 'sequenceObject', title: '对象', icon: Box },
    { name: 'sequenceEntity', title: '实体', icon: Circle },
    { name: 'sequenceControl', title: '控制', icon: CircleDot },
    { name: 'sequenceBoundary', title: '绑定', icon: ArrowDown },
    { name: 'sequenceTimerSignal', title: '时间信号', icon: Hourglass },
    { name: 'sequenceConstraint', title: '约束', icon: Braces },
    { name: 'sequenceActivation', title: '激活', icon: RectangleVertical },
    { name: 'sequenceLifeLine', title: '生命线', icon: ArrowUpDown },
    { name: 'sequenceDeletion', title: '删除', icon: X },
  ],
  // UML 用例图
  uml_usecase: [
    { name: 'actor', title: '参与者', icon: Users },
    { name: 'useCase', title: '用例', icon: Circle },
    { name: 'ovalContainer', title: '椭圆容器', icon: Circle },
    { name: 'rectangleContainer', title: '矩形容器', icon: Square },
  ],
  // UML 状态/活动图
  uml_stateactivity: [
    { name: 'umlObject', title: '对象', icon: Box },
    { name: 'umlState', title: '状态', icon: SquareStack },
    { name: 'umlStart', title: '开始', icon: CircleDot },
    { name: 'umlEnd', title: '结束', icon: Disc3 },
    { name: 'flowFinal', title: '流终止', icon: CircleDot },
    { name: 'simpleHistory', title: '历史', icon: CircleDot },
    { name: 'detialHistory', title: '详细历史', icon: CircleDot },
    { name: 'sendSignal', title: '发送信号', icon: ArrowRight },
    { name: 'receiveSignal', title: '接收信号', icon: ArrowLeft },
    { name: 'branchMerge', title: '分支', icon: Diamond },
    { name: 'Synchronization', title: '同步', icon: Minus },
    { name: 'stateRectangleContainer', title: '容器', icon: Square },
    { name: 'swimlane', title: '泳道(垂直)', icon: RectangleVertical },
    { name: 'horizontalSwimlane', title: '泳道(水平)', icon: RectangleHorizontal },
  ],
  // UML 部署图
  uml_deployment: [
    { name: 'devComponentNonInstance', title: '组件', icon: Box },
    { name: 'devComponent', title: '实例化组件', icon: Box },
    { name: 'devNodeNonInstance', title: '节点', icon: Server },
    { name: 'devNodeInstance', title: '实例化节点', icon: Server },
    { name: 'uml_deploymentObject', title: '对象', icon: Box },
    { name: 'uml_deploymentConstraint', title: '约束', icon: Braces },
  ],
  // UML 组件图
  uml_component: [
    { name: 'component', title: '组件', icon: Box },
    { name: 'componentNodeNonInstance', title: '节点', icon: Server },
    { name: 'componentStart', title: '接口', icon: Circle },
  ],
}

export function LeftPanel() {
  const activeCategory = useUIStore((s) => s.activeCategory)
  const setActiveCategory = useUIStore((s) => s.setActiveCategory)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['basic']),
  )
  // 自定义 tooltip 状态
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* 搜索框 */}
      <div className="p-2 border-b border-[#eee]">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#f5f5f5] rounded text-xs text-gray-400">
          <Search size={14} />
          <span>搜索图形…</span>
        </div>
      </div>

      {/* 分类列表 */}
      <div className="flex-1 overflow-y-auto">
        {SHAPE_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] || Square
          const isExpanded = expandedCategories.has(cat.id)
          const isActive = activeCategory === cat.id
          const catShapes = CATEGORY_SHAPES[cat.id] || []

          return (
            <div key={cat.id}>
              {/* 分类头 */}
              <button
                className={[
                  'flex items-center w-full px-3 py-1.5 text-xs cursor-pointer',
                  'hover:bg-[#f5f5f5] transition-colors',
                  isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-[#555]',
                ].join(' ')}
                onClick={() => {
                  setActiveCategory(cat.id)
                  toggleCategory(cat.id)
                }}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <Icon size={14} className="ml-1 mr-2" />
                <span>{cat.name}</span>
                <span className="ml-auto text-[10px] text-gray-400">{catShapes.length}</span>
              </button>

              {/* 分类下的图形列表 */}
              {isExpanded && (
                <div className="grid grid-cols-5 gap-1 p-2">
                  {catShapes.map((shape) => {
                    const ShapeIcon = shape.icon
                    return (
                      <div
                        key={shape.name}
                        onMouseDown={(e) => {
                          // 拖入画布后立即显示真实图形跟随鼠标）
                          e.preventDefault()
                          setTooltip(null)
                          startPanelDrag(shape.name, e)
                        }}
                        onDoubleClick={() => {
                          const { viewport } = useEditorStore.getState()
                          const cx = (-viewport.x + 400) / viewport.scale
                          const cy = (-viewport.y + 300) / viewport.scale
                          // 与拖拽落点同语义：以 (cx, cy) 为图形中心
                          const el = shapeRegistry.createElementAtCenter(shape.name, cx, cy)
                          if (el) {
                            useEditorStore.getState().addElement(el)
                          }
                        }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect()
                          setTooltip({
                            text: shape.title,
                            x: rect.right + 6,
                            y: rect.top + rect.height / 2,
                          })
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        className={[
                          'flex items-center justify-center w-9 h-9 mx-auto rounded cursor-grab select-none',
                          'hover:bg-[#e8e8e8] transition-colors',
                        ].join(' ')}
                      >
                        {shapeRegistry.getShape(shape.name) ? (
                          <ShapePreview name={shape.name} size={30} />
                        ) : (
                          <ShapeIcon size={28} strokeWidth={1.5} className="text-[#555]" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 自定义 tooltip（固定在 viewport 上，不被 overflow 裁剪） */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-xs bg-[#333] text-white rounded shadow pointer-events-none whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translateY(-50%)' }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}
