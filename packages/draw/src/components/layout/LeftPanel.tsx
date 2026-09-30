import { useEffect, useMemo, useState } from 'react'
import { useUIStore, SHAPE_CATEGORIES } from '@/store/uiStore'
import { shapeRegistry } from '@/core/schema/registry'
import { NET_GROUPS, NET_VENDORS } from '@/core/schema/shapes/netIconManifest'
import {
  applyNetworkIconPrefs,
  ensureNetworkShapeLoaded,
  isNetworkGroupLoaded,
  loadNetworkGroup,
  loadNetworkSearchIndex,
  loadNetworkVendor,
  networkGroupShapeNames,
  preloadNetworkGroups,
  type NetIconEntry,
} from '@/core/schema/shapes/networkLoader'
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
  ArrowUpRight, Slash, Cylinder, CirclePlus, CircleX,
  Code,
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
  Network, Waypoints, Link, Boxes, Smartphone,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/** 分类对应的图标映射 */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  basic: Square,
  flow: GitBranch,
  bpmn: Workflow,
  lane: Columns,
  // UML 分类
  uml: Folder,
  uml_common: Folder,
  uml_class: Box,
  uml_sequence: ArrowRight,
  uml_usecase: Users,
  uml_stateactivity: CircleDot,
  uml_deployment: Server,
  uml_component: Box,
  // 旧 Schema 移植的建模图种
  er: Database,
  org: Network,
  venn: Circle,
  epc: Waypoints,
  evc: Link,
  weizhu_bm: Boxes,
  mobile: Smartphone,
  // 网络拓扑 / 云服务图标（懒加载矢量图标）
  net_topo: Network,
  cloud_icons: Cloud,
}

/** 每个分类下的示例图形（Phase 1 用占位，Phase 2 从 registry 获取；懒加载分组的图形来自生成器面板数据） */
const CATEGORY_SHAPES: Record<string, Array<{ name: string; title: string; icon?: LucideIcon }>> = {
  basic: [
    { name: 'text', title: '文本', icon: Type },
    { name: 'note', title: '备注', icon: StickyNote },
    { name: 'arrowLine', title: '箭头线', icon: ArrowUpRight },
    { name: 'line', title: '直线', icon: Slash },
    // 基础几何
    { name: 'roundRectangle', title: '圆角矩形', icon: RectangleHorizontal },
    { name: 'round', title: '圆形', icon: Circle },
    { name: 'rectangle', title: '矩形', icon: Square },
    { name: 'triangle', title: '三角形', icon: Triangle },
    { name: 'rightTriangle', title: '直角三角形', icon: Triangle },
    { name: 'diamond', title: '菱形', icon: Diamond },
    { name: 'polygon', title: '五边形', icon: Pentagon },
    { name: 'hexagon', title: '六边形', icon: Hexagon },
    { name: 'octagon', title: '八边形', icon: Octagon },
    { name: 'pentagon', title: '五角星', icon: Star },
    // 曲线图形
    { name: 'sector', title: '扇形', icon: CircleDot },
    { name: 'cloud', title: '云', icon: Cloud },
    { name: 'sector2', title: '扇形2', icon: CircleDot },
    { name: 'teardrop', title: '水滴', icon: Droplet },
    { name: 'comment', title: '对话气泡', icon: MessageCircle },
    // 十字形与拐角
    { name: 'cross', title: '十字形', icon: Plus },
    { name: 'corner', title: '拐角', icon: CornerDownRight },
    // 箭头类
    { name: 'backArrow', title: '左返回箭头', icon: Undo2 },
    { name: 'rightBackArrow', title: '右返回箭头', icon: Redo2 },
    { name: 'singleLeftArrow', title: '左箭头', icon: ArrowLeft },
    { name: 'singleRightArrow', title: '右箭头', icon: ArrowRight },
    { name: 'doubleHorizontalArrow', title: '左右箭头', icon: ArrowLeftRight },
    { name: 'singleUpArrow', title: '上箭头', icon: ArrowUp },
    { name: 'singleDownArrow', title: '下箭头', icon: ArrowDown },
    { name: 'doubleVerticalArrow', title: '上下箭头', icon: ArrowUpDown },
    // 括号类
    { name: 'parentheses', title: '中括号', icon: Brackets },
    { name: 'braces', title: '大括号', icon: Braces },
    { name: 'apqc', title: 'APQC', icon: Box },
    { name: 'codeBlock', title: '代码块', icon: Code },
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
    { name: 'magneticDrum', title: '磁鼓', icon: Cylinder },
    { name: 'manualInput', title: '人工输入', icon: Keyboard },
    { name: 'card', title: '卡片', icon: CreditCard },
    { name: 'paperTape', title: '条带', icon: ScrollText },
    { name: 'display', title: '展示', icon: Monitor },
    { name: 'manualOperation', title: '人工操作', icon: Hand },
    { name: 'preparation', title: '预备', icon: Hexagon },
    { name: 'parallelMode', title: '并行模式', icon: Equal },
    { name: 'loopLimit', title: '循环限值', icon: Repeat },
    { name: 'onPageReference', title: '页面内引用', icon: Circle },
    { name: 'orJunction', title: '或连接', icon: CirclePlus },
    { name: 'summingJunction', title: '汇总连接', icon: CircleX },
    { name: 'offPageReference', title: '跨页引用', icon: ArrowDownToLine },
    { name: 'sort', title: '排序', icon: Diamond },
    { name: 'merge', title: '合并', icon: Triangle },
    { name: 'annotationRight', title: '注释(右)', icon: MessageSquare },
    { name: 'annotationLeft', title: '注释(左)', icon: MessageSquare },
    { name: 'rightBrace', title: '括号注释(右)', icon: MessageSquare },
    { name: 'leftBrace', title: '括号注释(左)', icon: MessageSquare },
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
    // 面板仅保留 6 个；泳道图/泳道不再新增，registry 仍注册供旧文档编辑
    { name: 'bidirectionalPoolV', title: '双向泳池(垂直)', icon: Grid2x2 },
    { name: 'verticalPool', title: '泳池(垂直)', icon: RectangleVertical },
    { name: 'horizontalSeparator', title: '分隔符(水平)', icon: Minus },
    { name: 'verticalSeparator', title: '分隔符(垂直)', icon: Minus },
    { name: 'bidirectionalPoolH', title: '双向泳池(水平)', icon: Grid2x2 },
    { name: 'horizontalPool', title: '泳池(水平)', icon: RectangleHorizontal },
  ],
  // UML 通用
  uml_common: [
    { name: 'package', title: '包', icon: SquareStack },
    { name: 'combinedFragment', title: '组合片段', icon: SquareStack },
    { name: 'umlNote', title: '注释', icon: StickyNote },
    { name: 'umlText', title: '文本', icon: Type },
    { name: 'informationItem', title: '信息项', icon: Box },
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
    { name: 'abstractClass', title: '抽象类', icon: FileText },
    { name: 'signal', title: '信号', icon: FileText },
    { name: 'prototypeClass', title: '原型类', icon: FileText },
    { name: 'primitive', title: '原始类型', icon: Box },
    { name: 'glyphAggregation', title: '聚合符号', icon: Diamond },
    { name: 'glyphComposition', title: '组合符号', icon: Diamond },
    { name: 'glyphGeneralization', title: '泛化符号', icon: Triangle },
    { name: 'glyphDependency', title: '依赖符号', icon: ArrowRight },
    { name: 'glyphAssociation', title: '关联符号', icon: ArrowRight },
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
    { name: 'sequenceActorLifeLine', title: '角色生命线', icon: Users },
    { name: 'sequenceStateInvariant', title: '状态不变式', icon: CircleDot },
    { name: 'sequenceLostMessageTarget', title: '丢失消息目标', icon: Box },
  ],
  // UML 用例图
  uml_usecase: [
    { name: 'actor', title: '参与者', icon: Users },
    { name: 'useCase', title: '用例', icon: Circle },
    { name: 'ovalContainer', title: '椭圆容器', icon: Circle },
    { name: 'rectangleContainer', title: '矩形容器', icon: Square },
    { name: 'abstractUseCase', title: '抽象用例', icon: Circle },
    { name: 'subject', title: '主体', icon: Square },
    { name: 'useCaseVertical', title: '用例(竖排)', icon: Circle },
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
    { name: 'verticalPool', title: '泳池(垂直)', icon: RectangleVertical },
    { name: 'horizontalPool', title: '泳池(水平)', icon: RectangleHorizontal },
    { name: 'timeSignalFlag', title: '时间信号', icon: Hourglass },
    { name: 'entryPoint', title: '进入点', icon: CircleDot },
    { name: 'exitPoint', title: '退出点', icon: CircleDot },
    { name: 'exception', title: '异常', icon: Octagon },
  ],
  // UML 部署图/组件图（合并去重：componentNodeNonInstance 与节点重复，移出面板保留注册）
  uml_deployment: [
    { name: 'component', title: '组件', icon: Box },
    { name: 'componentStart', title: '接口', icon: Circle },
    { name: 'componentSocket', title: '接口(依赖)', icon: Circle },
    { name: 'devComponentNonInstance', title: '组件(部署形态)', icon: Box },
    { name: 'devComponent', title: '实例化组件(部署)', icon: Box },
    { name: 'devNodeNonInstance', title: '节点', icon: Server },
    { name: 'devNodeInstance', title: '实例化节点', icon: Server },
    { name: 'executionEnvironment', title: '执行环境', icon: Server },
    { name: 'artifact', title: '工件', icon: FileText },
    { name: 'uml_deploymentObject', title: '对象', icon: Box },
    { name: 'uml_deploymentConstraint', title: '约束', icon: Braces },
  ],
}

/**
 * 面板分组图形：手写清单在前，注册表派生补齐在后（旧 Schema 移植的图种只注册不手写清单）。
 * 派生规则：子分组按 shape.group 匹配，主分类取无 group 的图形，两边都不会重复。
 */
function registryShapesFor(catId: string, childId?: string): Array<{ name: string; title: string }> {
  const curated = CATEGORY_SHAPES[childId ?? catId] ?? []
  const seen = new Set(curated.map((s) => s.name))
  const derived = shapeRegistry
    .getShapesByCategory(catId)
    .filter((s) => (s.group ? s.group === childId : !childId) && !seen.has(s.name))
    .map((s) => ({ name: s.name, title: s.title }))
  return [...curated, ...derived]
}

/** 图标懒加载辅助：品类矢量数据由 networkLoader 按需 import（见 netIconChunks） */
/** 一级分类 id → 厂商列表（网络拓扑 / 云服务图标） */
const VENDORS_OF_PANEL: Record<string, typeof NET_VENDORS> = {}
for (const vendor of NET_VENDORS) (VENDORS_OF_PANEL[vendor.panel] ??= []).push(vendor)

const vendorPanelOf = (vendorId: string) => NET_VENDORS.find((v) => v.id === vendorId)?.panel ?? ''

/** 品类标题在厂商 tab 下省略厂商前缀（Cisco tab 里的「Cisco 路由器」→「路由器」） */
function shortGroupName(name: string, vendorName: string): string {
  const short = name.startsWith(vendorName) ? name.slice(vendorName.length).trim() : name
  return short || name
}

/** 已加载品类的图形清单（中文标题取自注册后的 ShapeDefinition）；未加载返回 null */
function loadedGroupShapes(groupId: string): Array<{ name: string; title: string }> | null {
  if (!isNetworkGroupLoaded(groupId)) return null
  return networkGroupShapeNames(groupId).map((name) => ({
    name,
    title: shapeRegistry.getShape(name)?.title ?? name,
  }))
}

export function LeftPanel() {
  const activeCategory = useUIStore((s) => s.activeCategory)
  const setActiveCategory = useUIStore((s) => s.setActiveCategory)
  useUIStore((s) => s.netIconsRev) // 图标 chunk 注册完成后刷新面板缩略图
  const netIconPrefs = useUIStore((s) => s.netIconPrefs)
  const setNetIconPrefs = useUIStore((s) => s.setNetIconPrefs)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['basic']),
  )
  // 懒加载子分组（网络图标品类）单独折叠，避免一次展开数百个图形
  const [expandedChildren, setExpandedChildren] = useState<Set<string>>(new Set())
  /** 一级分类 → 当前厂商 tab */
  const [activeVendor, setActiveVendor] = useState<Record<string, string>>({})
  const [query, setQuery] = useState('')
  const [searchEntries, setSearchEntries] = useState<NetIconEntry[] | null>(null)
  // 自定义 tooltip 状态
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  // 常驻品类预载（用户上次勾选的）
  useEffect(() => {
    void applyNetworkIconPrefs().catch(() => {})
  }, [])

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || !searchEntries) return null
    return searchEntries
      .filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.name.toLowerCase().includes(q) ||
          e.groupName.toLowerCase().includes(q),
      )
      .slice(0, 100)
  }, [query, searchEntries])

  // 首次搜索拉中文标题索引；命中结果所在品类按需加载
  useEffect(() => {
    if (!query.trim() || searchEntries) return
    let alive = true
    void loadNetworkSearchIndex()
      .then((entries) => {
        if (alive) setSearchEntries(entries)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [query, searchEntries])

  useEffect(() => {
    if (!searchResults) return
    void preloadNetworkGroups(searchResults.map((r) => r.groupId)).catch(() => {})
  }, [searchResults])

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

  /** 展开分类；品类矢量数据在展开具体品类时才拉（见 toggleLazyChild） */
  const onCategoryHeaderClick = (cat: (typeof SHAPE_CATEGORIES)[number]) => {
    setActiveCategory(cat.id)
    toggleCategory(cat.id)
  }

  /** 品类单独折叠：展开时才拉对应 chunk */
  const toggleLazyChild = (childId: string) => {
    const willExpand = !expandedChildren.has(childId)
    setExpandedChildren((prev) => {
      const next = new Set(prev)
      if (next.has(childId)) next.delete(childId)
      else next.add(childId)
      return next
    })
    if (willExpand) void loadNetworkGroup(childId).catch(() => {})
  }

  /** 常驻偏好：勾选后进入编辑器即预载，不必每次点开 */
  const togglePref = (groupId: string) => {
    const next = netIconPrefs.includes(groupId)
      ? netIconPrefs.filter((id) => id !== groupId)
      : [...netIconPrefs, groupId]
    setNetIconPrefs(next)
    if (!netIconPrefs.includes(groupId)) void loadNetworkGroup(groupId).catch(() => {})
  }

  /** 加载全部：矢量数据与该厂商所有品类一次性铺开，不必再逐个点开 */
  const loadVendor = (vendorId: string) => {
    setActiveVendor((prev) => ({ ...prev, [vendorPanelOf(vendorId)]: vendorId }))
    const groupIds = NET_GROUPS.filter((g) => g.vendor === vendorId).map((g) => g.id)
    setExpandedChildren((prev) => new Set([...prev, ...groupIds]))
    void loadNetworkVendor(vendorId).catch(() => {})
  }

  /** 图形九宫格（单级分类、二级分组与搜索结果共用） */
  const renderShapeGrid = (
    shapes: Array<{ name: string; title: string; icon?: LucideIcon }>,
    deferThumb = false,
  ) => (
    <div className="grid grid-cols-5 gap-1 p-2">
      {shapes.map((shape) => {
        const ShapeIcon = shape.icon ?? Network
        const registered = !!shapeRegistry.getShape(shape.name)
        return (
          <div
            key={shape.name}
            data-shape={shape.name}
            onMouseDown={(e) => {
              // 拖入画布后立即显示真实图形跟随鼠标）
              e.preventDefault()
              setTooltip(null)
              if (!registered) {
                // 矢量数据还在路上：先拉取，本次不启动拖拽（ghost 需要真实图形）
                void ensureNetworkShapeLoaded(shape.name).catch(() => {})
                return
              }
              startPanelDrag(shape.name, e)
            }}
            onDoubleClick={() => {
              const place = () => {
                const { viewport, addElement } = useEditorStore.getState()
                const cx = (-viewport.x + 400) / viewport.scale
                const cy = (-viewport.y + 300) / viewport.scale
                // 与拖拽落点同语义：以 (cx, cy) 为图形中心
                const el = shapeRegistry.createElementAtCenter(shape.name, cx, cy)
                if (el) addElement(el)
              }
              if (registered) {
                place()
              } else {
                void ensureNetworkShapeLoaded(shape.name).then((ok) => ok && place()).catch(() => {})
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
              'flex items-center justify-center w-9 h-9 mx-auto rounded select-none',
              registered ? 'cursor-grab hover:bg-[#e8e8e8]' : 'cursor-wait opacity-40',
              'transition-colors',
            ].join(' ')}
          >
            {registered ? (
              <ShapePreview name={shape.name} size={30} defer={deferThumb} />
            ) : (
              <ShapeIcon size={28} strokeWidth={1.5} className="text-[#555]" />
            )}
          </div>
        )
      })}
    </div>
  )

  /** 搜索结果：跨厂商按中文标题/英文名匹配，命中品类自动按需加载 */
  const renderSearchResults = () => {
    const q = query.trim()
    if (!searchResults) return <div className="p-3 text-[11px] text-gray-400">正在载入图标索引…</div>
    if (searchResults.length === 0) {
      return <div className="p-3 text-[11px] text-gray-400">没有匹配「{q}」的图形</div>
    }
    return (
      <div>
        <div className="px-3 py-1.5 text-[11px] text-gray-400 bg-[#fafafa] border-b border-[#f0f0f0]">
          {searchResults.length >= 100 ? `「${q}」匹配过多，仅显示前 100 个` : `「${q}」匹配 ${searchResults.length} 个`}
        </div>
        {renderShapeGrid(
          searchResults.map((e) => ({ name: e.name, title: `${e.title || e.name}（${e.groupName}）` })),
          true,
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* 搜索框 */}
      <div className="p-2 border-b border-[#eee]">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#f5f5f5] rounded">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索图形…"
            className="flex-1 min-w-0 bg-transparent text-xs outline-none placeholder:text-gray-400"
          />
          {query && (
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setQuery('')}
              aria-label="清空搜索"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 分类列表 */}
      <div className="flex-1 overflow-y-auto">
        {query.trim() ? (
          renderSearchResults()
        ) : (
        SHAPE_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] || Square
          const isExpanded = expandedCategories.has(cat.id)
          const isActive = activeCategory === cat.id

          // 二级分组（UML 子分类 / 网络图标品类）：折叠作用于主分组，品类可单独展开并按需拉数据
          if (cat.children) {
            const countOf = (ch: (typeof cat.children)[number]) =>
              ch.lazy ? (NET_GROUPS.find((g) => g.id === ch.id)?.count ?? 0) : registryShapesFor(cat.id, ch.id).length
            const childShapesOf = (ch: (typeof cat.children)[number]) =>
              ch.lazy ? (loadedGroupShapes(ch.id) ?? []) : registryShapesFor(cat.id, ch.id)
            const total = cat.children.reduce((n, ch) => n + countOf(ch), 0)
            const vendors = cat.vendorTabs ? (VENDORS_OF_PANEL[cat.id] ?? []) : []
            const vendor = vendors.find((v) => v.id === activeVendor[cat.id]) ?? vendors[0]
            const children = vendor ? cat.children.filter((ch) => ch.vendor === vendor.id) : cat.children
            return (
              <div key={cat.id} data-panel={cat.id}>
                <button
                  className={[
                    'flex items-center w-full px-3 py-1.5 text-xs cursor-pointer',
                    'hover:bg-[#f5f5f5] transition-colors',
                    isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-[#555]',
                  ].join(' ')}
                  onClick={() => onCategoryHeaderClick(cat)}
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Icon size={14} className="ml-1 mr-2" />
                  <span>{cat.name}</span>
                  <span className="ml-auto text-[10px] text-gray-400">{total}</span>
                </button>

                {isExpanded && (
                  <>
                    {/* 厂商 tab：品类数量多时避免数十个二级标题平铺 */}
                    {vendor && (
                      <div className="flex items-center flex-wrap gap-1 px-2 py-1.5 border-b border-[#f0f0f0]">
                        {vendors.map((v) => {
                          const vTotal = NET_GROUPS
                            .filter((g) => v.groupIds.includes(g.id))
                            .reduce((n, g) => n + g.count, 0)
                          return (
                            <button
                              key={v.id}
                              data-vendor={v.id}
                              onClick={() => setActiveVendor((prev) => ({ ...prev, [cat.id]: v.id }))}
                              className={[
                                'px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer',
                                v.id === vendor.id
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-[#f0f0f0] text-[#666] hover:bg-[#e4e4e4]',
                              ].join(' ')}
                            >
                              {v.name}
                              <span className="ml-1 opacity-70">{vTotal}</span>
                            </button>
                          )
                        })}
                        <button
                          data-action="load-vendor"
                          onClick={() => loadVendor(vendor.id)}
                          title={`一次性加载 ${vendor.name} 全部品类`}
                          className="ml-auto px-1.5 py-0.5 text-[10px] text-gray-400 hover:text-blue-500 cursor-pointer"
                        >
                          加载全部
                        </button>
                      </div>
                    )}

                    {children.map((child) => {
                      const loaded = !child.lazy || isNetworkGroupLoaded(child.id)
                      const open = !child.lazy || expandedChildren.has(child.id)
                      const vendorName = vendors.find((v) => v.id === child.vendor)?.name ?? ''
                      const pinned = netIconPrefs.includes(child.id)
                      return (
                        <div key={child.id}>
                          <div className="flex items-center bg-[#fafafa] border-y border-[#f0f0f0]">
                            <button
                              data-group={child.id}
                              className={[
                                'flex items-center flex-1 min-w-0 px-3 py-1 pl-8 text-[11px] transition-colors text-left',
                                child.lazy ? 'cursor-pointer hover:bg-[#f0f0f0]' : 'cursor-default',
                                loaded ? 'text-gray-500' : 'text-gray-400',
                              ].join(' ')}
                              onClick={() => child.lazy && toggleLazyChild(child.id)}
                            >
                              {child.lazy &&
                                (open ? <ChevronDown size={12} className="mr-1 shrink-0" /> : <ChevronRight size={12} className="mr-1 shrink-0" />)}
                              <span className="truncate">
                                {child.lazy ? shortGroupName(child.name, vendorName) : child.name}
                              </span>
                              <span
                                className={[
                                  'ml-auto pl-1 text-[10px] shrink-0',
                                  loaded ? 'text-blue-400' : 'text-gray-300',
                                ].join(' ')}
                              >
                                {countOf(child)}
                              </span>
                            </button>
                            {child.lazy && (
                              <button
                                data-pin={child.id}
                                onClick={() => togglePref(child.id)}
                                title={pinned ? '取消常驻（下次进入不再自动预载）' : '设为常驻（进入编辑器自动预载）'}
                                className="px-1.5 cursor-pointer"
                              >
                                <Star
                                  size={11}
                                  className={pinned ? 'text-amber-500 fill-amber-400' : 'text-gray-300 hover:text-amber-400'}
                                />
                              </button>
                            )}
                          </div>
                          {open &&
                            (child.lazy && !loaded ? (
                              <div className="px-8 py-1.5 text-[11px] text-gray-300">正在载入矢量数据…</div>
                            ) : (
                              renderShapeGrid(childShapesOf(child), !!child.lazy)
                            ))}
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
            )
          }

          const catShapes = registryShapesFor(cat.id)

          return (
            <div key={cat.id} data-panel={cat.id}>
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
              {isExpanded && renderShapeGrid(catShapes)}
            </div>
          )
        })
        )}
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
