import { create } from 'zustand'
import { NET_GROUPS, NET_VENDORS } from '@/core/schema/shapes/netIconManifest'

/** 图形分类定义 */
export interface ShapeCategory {
  id: string
  name: string
  icon: string  // lucide-react icon name
  /** 二级子分组（UML 子分类、网络拓扑品类）：仅作二级标题，折叠/展开由父分组控制 */
  children?: Array<{
    id: string
    name: string
    /** 矢量数据按需加载，图形名来自生成器 manifest（netIconManifest.ts） */
    lazy?: boolean
    /** 所属厂商 tab（网络拓扑图标），同一分类内按厂商切换显示 */
    vendor?: string
  }>
  /** 子分组以厂商 tab 切换展示，而非全部平铺（图标数量多的分类） */
  vendorTabs?: boolean
}

/** 按厂商 tab 生成网络拓扑图标的子分组清单（数据源：生成器 manifest） */
const netChildrenOf = (panel: string) =>
  NET_VENDORS.filter((v) => v.panel === panel).flatMap((v) =>
    NET_GROUPS.filter((g) => v.groupIds.includes(g.id)).map((g) => ({
      id: g.id,
      name: g.name,
      lazy: true,
      vendor: v.id,
    })),
  )

/** 预定义的图形分类 */
export const SHAPE_CATEGORIES: ShapeCategory[] = [
  { id: 'basic', name: '基础图形', icon: 'Square' },
  { id: 'flow', name: '流程图', icon: 'GitBranch' },
  {
    id: 'bpmn',
    name: 'BPMN',
    icon: 'Workflow',
    // 核心图形为手写移植（CATEGORY_SHAPES.bpmn），其余按旧 groupName 自动派生二级分组
    children: [
      { id: 'bpmn', name: '核心' },
      { id: 'bpmn_start', name: '开始事件' },
      { id: 'bpmn_intermediate', name: '中间事件' },
      { id: 'bpmn_boundary', name: '边界事件' },
      { id: 'bpmn_end', name: '结束事件' },
      { id: 'bpmn_task', name: '任务' },
      { id: 'bpmn_sub', name: '子流程与调用活动' },
      { id: 'bpmn_gateway', name: '网关' },
      { id: 'bpmn_data', name: '数据对象' },
      { id: 'bpmn_collab', name: '对话与编排' },
      { id: 'bpmn_misc', name: '其他' },
    ],
  },
  { id: 'lane', name: '泳池/泳道', icon: 'Columns' },
  // UML：子分类作为二级标题，各自可折叠展开（默认展开）
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
      { id: 'uml_deployment', name: '部署图/组件图' },
    ],
  },
  // 旧 Schema 移植的建模图种（scripts/gen-legacy-shapes.mjs 自动生成，静态注册）
  { id: 'er', name: '实体关系图', icon: 'Database' },
  { id: 'org', name: '组织结构图', icon: 'Network' },
  { id: 'venn', name: '维恩图', icon: 'Circle' },
  { id: 'epc', name: 'EPC 事件过程链', icon: 'Waypoints' },
  { id: 'evc', name: 'EVC 企业价值链', icon: 'Link' },
  { id: 'weizhu_bm', name: '魏朱商业模式', icon: 'Boxes' },
  // 移动端线框原型：iOS / Android 控件与元素（旧 Schema 的位图细节已重画为矢量）
  {
    id: 'mobile',
    name: '移动端原型',
    icon: 'Smartphone',
    children: [
      { id: 'mobile_ios_control', name: 'iOS 控件' },
      { id: 'mobile_ios_element', name: 'iOS 元素' },
      { id: 'mobile_ios_device', name: 'iOS 设备背景' },
      { id: 'mobile_ios_icon', name: 'iOS 图标' },
      { id: 'mobile_and_control', name: 'Android 控件' },
      { id: 'mobile_and_element', name: 'Android 元素' },
      { id: 'mobile_and_device', name: 'Android 设备背景' },
      { id: 'mobile_and_icon', name: 'Android 图标' },
    ],
  },
  // 网络拓扑 / 云服务图标：ProcessOn SVG 转换的原生矢量图标（gen-network-shapes.mjs 自动生成）
  // 品类清单与厂商归属来自 netIconManifest，矢量数据按品类 chunk 按需加载
  {
    id: 'net_topo',
    name: '网络拓扑',
    icon: 'Network',
    vendorTabs: true,
    children: netChildrenOf('net_topo'),
  },
  {
    id: 'cloud_icons',
    name: '云服务图标',
    icon: 'Cloud',
    vendorTabs: true,
    children: netChildrenOf('cloud_icons'),
  },
  // ── draw.io stencil 移植批（gen-drawio-stencils.mjs 生成，懒加载 chunk 与网络图标同机制）──
  {
    id: 'signs_icons',
    name: '通用素材',
    icon: 'Shapes',
    children: [
      { id: 'signs_animals', name: '动物', lazy: true },
      { id: 'signs_food', name: '餐饮食品', lazy: true },
      { id: 'signs_healthcare', name: '医疗健康', lazy: true },
      { id: 'signs_nature', name: '自然天体', lazy: true },
      { id: 'signs_people', name: '人物', lazy: true },
      { id: 'signs_safety', name: '安全警示', lazy: true },
      { id: 'signs_science', name: '科研', lazy: true },
      { id: 'signs_sports', name: '体育场馆', lazy: true },
      { id: 'signs_tech', name: '科技', lazy: true },
      { id: 'signs_transportation', name: '交通运输', lazy: true },
      { id: 'signs_travel', name: '旅行导向', lazy: true },
    ],
  },
  {
    id: 'electrical',
    name: '电气工程',
    icon: 'CircuitBoard',
    children: [
      { id: 'elec_abstract', name: '抽象模块', lazy: true },
      { id: 'elec_capacitors', name: '电容器', lazy: true },
      { id: 'elec_diodes', name: '二极管', lazy: true },
      { id: 'elec_electro_mech', name: '机电与开关', lazy: true },
      { id: 'elec_iec417', name: 'IEC 设备符号', lazy: true },
      { id: 'elec_iec_logic_gates', name: 'IEC 逻辑门', lazy: true },
      { id: 'elec_inductors', name: '电感与变压器', lazy: true },
      { id: 'elec_instruments', name: '测量仪表', lazy: true },
      { id: 'elec_logic_gates', name: '逻辑门', lazy: true },
      { id: 'elec_misc', name: '杂项元件', lazy: true },
      { id: 'elec_mosfets1', name: 'MOSFET 一', lazy: true },
      { id: 'elec_mosfets2', name: 'MOSFET 二', lazy: true },
      { id: 'elec_op_amps', name: '运算放大电路', lazy: true },
      { id: 'elec_opto_electronics', name: '光电元件', lazy: true },
      { id: 'elec_plc_ladder', name: 'PLC 梯形图', lazy: true },
      { id: 'elec_power_semicond', name: '功率半导体', lazy: true },
      { id: 'elec_radio', name: '射频与天线', lazy: true },
      { id: 'elec_resistors', name: '电阻器', lazy: true },
      { id: 'elec_rot_mech', name: '旋转机构', lazy: true },
      { id: 'elec_signal_sources', name: '信号源', lazy: true },
      { id: 'elec_thermionic', name: '电真空器件', lazy: true },
      { id: 'elec_transistors', name: '晶体管', lazy: true },
      { id: 'elec_transmission', name: '传输线路', lazy: true },
      { id: 'elec_waveforms', name: '波形图', lazy: true },
    ],
  },
  {
    id: 'rack',
    name: '机房机架',
    icon: 'Server',
    children: [
      { id: 'rack_apc', name: 'APC', lazy: true },
      { id: 'rack_cisco', name: 'Cisco 机架', lazy: true },
      { id: 'rack_dell', name: '戴尔 PowerEdge', lazy: true },
      { id: 'rack_f5', name: 'F5', lazy: true },
      { id: 'rack_general', name: '通用机架', lazy: true },
      { id: 'rack_hp', name: 'HP', lazy: true },
      { id: 'rack_hpe_gateways', name: 'HPE Aruba 网关控制器', lazy: true },
      { id: 'rack_hpe_security', name: 'HPE Aruba 安全', lazy: true },
      { id: 'rack_hpe_switches', name: 'HPE Aruba 交换机', lazy: true },
      { id: 'rack_ibm', name: 'IBM', lazy: true },
      { id: 'rack_oracle', name: '甲骨文', lazy: true },
    ],
  },
  {
    id: 'mockup',
    name: 'Web 原型',
    icon: 'PanelsTopLeft',
    children: [
      { id: 'mk_advertising', name: '广告位', lazy: true },
      { id: 'mk_calendars', name: '日历', lazy: true },
      { id: 'mk_carousel', name: '轮播', lazy: true },
      { id: 'mk_charts_tables', name: '图表与表格', lazy: true },
      { id: 'mk_controls', name: '控件', lazy: true },
      { id: 'mk_form_elements', name: '表单元素', lazy: true },
      { id: 'mk_menus_buttons', name: '菜单与按钮', lazy: true },
      { id: 'mk_misc', name: '通用元素', lazy: true },
      { id: 'mk_tabs', name: '选项卡', lazy: true },
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
  /** 网络拓扑图标懒加载版本号（chunk 注册完成后自增，驱动面板刷新） */
  netIconsRev: number
  /** 常驻加载的图标品类（用户勾选，localStorage 持久化）：进入编辑器即预载，不必逐个点开 */
  netIconPrefs: string[]

  setActiveCategory: (category: string) => void
  toggleLeftPanel: () => void
  toggleRightPanel: () => void
  toggleAiPanel: () => void
  setFocusMode: (v: boolean) => void
  bumpNetworkIconsRev: () => void
  setNetIconPrefs: (ids: string[]) => void
}

const NET_ICON_PREFS_KEY = 'draw.netIconPrefs'

/** 常驻品类读写 localStorage（测试/SSR 环境无 localStorage 时静默降级） */
function readNetIconPrefs(): string[] {
  try {
    const raw = globalThis.localStorage?.getItem(NET_ICON_PREFS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

function writeNetIconPrefs(ids: string[]) {
  try {
    globalThis.localStorage?.setItem(NET_ICON_PREFS_KEY, JSON.stringify(ids))
  } catch {
    /* 隐私模式 / 无 localStorage：偏好仅保留在内存 */
  }
}

export const useUIStore = create<UIState>((set) => ({
  activeCategory: 'basic',
  leftPanelVisible: true,
  rightPanelVisible: true,
  aiPanelVisible: false,
  focusMode: false,
  netIconsRev: 0,
  netIconPrefs: readNetIconPrefs(),

  setActiveCategory: (category) => set({ activeCategory: category }),
  toggleLeftPanel: () => set((s) => ({ leftPanelVisible: !s.leftPanelVisible })),
  toggleRightPanel: () => set((s) => ({ rightPanelVisible: !s.rightPanelVisible })),
  toggleAiPanel: () => set((s) => ({ aiPanelVisible: !s.aiPanelVisible })),
  setFocusMode: (v) => set({ focusMode: v }),
  bumpNetworkIconsRev: () => set((s) => ({ netIconsRev: s.netIconsRev + 1 })),
  setNetIconPrefs: (ids) => {
    writeNetIconPrefs(ids)
    set({ netIconPrefs: ids })
  },
}))
