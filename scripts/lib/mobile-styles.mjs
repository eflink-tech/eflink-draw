/**
 * 移动端原型图形的样式补丁表。
 *
 * 旧 designer 的 iOS/Android 素材是「贴在设备截图上画的线框」：卡片、按钮、输入框、
 * 标题栏一律写成 `fillStyle: 白 + lineStyle.lineWidth: 0`，靠素材背景反衬才看得见。
 * 落到本项目的白色画布上就等于隐形（面板缩略图里是一格空白）。
 * 这里按现代 iOS / Material 观感补齐「表面 + 发丝描边 + 强调色」，并把过大的默认尺寸收敛到
 * 画布常用尺度；颜色与尺寸仍是图形实例的可编辑属性，用户拖上去后随便改。
 *
 * 字段（生成器 applyMobileStyle / applyMobileSize / applyRadius 消费）：
 *   size   落到画布的默认尺寸 [w, h]；未写的图形按 MOBILE_SCALE 等比缩小
 *   fill   图形级填充色，'none' 表示无填充
 *   line   图形级描边（未显式写样式的子路径继承它）
 *   alpha  图形级不透明度（覆盖旧素材贴截图用的低透明度，如 stepper 的 0.1）
 *   body   主体路径（path[0]）的描边；'inherit' = 去掉它的 lineWidth:0 让它继承 line
 *   radius 主体圆角矩形按像素半径重画（旧素材圆角量过小，视觉上就是直角矩形）
 *   subs   按下标修某条子路径：{ line, fill }
 *   font   图形级字体样式（合并）
 *   text   占位文案替换（旧素材残留的英文示例文字换成中文）
 *   label  旧素材无文字的图形补占位文案（如深灰气泡）
 */

/** iOS 发丝线 / 表面 / 强调色（208 一档在白画布上对比不足，统一加深） */
const HAIR = '199,201,205'
/** Android 发丝线（Material divider） */
const HAIR_AND = '203,205,208'
const TEAL = '0,150,136'

/**
 * 旧素材的默认尺寸是「贴着真机截图量出来的像素」：按钮 240×40、元素分类一律 280/360 宽，
 * 拖到画布上比常规矩形（120×60）还大一圈，当「控件」用完全不成比例。
 * 这里统一收敛：整族按 k 等比缩小（保证导航栏 / 列表 / 键盘这些「通栏」元素始终与设备底图同宽），
 * 独立控件再按真实 UI 尺寸单独定档（iOS 按钮 150×32、Android 复选框 20×20 这种量级）。
 */
export const MOBILE_SCALE = 0.75

export const MOBILE_STYLES = {
  // ── iOS 控件 ──────────────────────────────
  // 通栏基准：设备底图与通栏元素等比到 210 宽，独立控件按真实 UI 尺寸定档
  // 按钮：旧素材圆角只有 3px、文字还是橙色加粗，视觉上就是一块矩形——圆角按 iOS 观感重建、字色统一系统蓝
  // 默认尺寸 84×50；圆角与字号随高度配套（radius 8 / 默认 13px）
  ios7Button1: {
    size: [84, 50],
    radius: 8,
    fill: '248,248,250',
    line: { lineWidth: 1, lineColor: HAIR },
    font: { color: '34,124,231', bold: false },
  },
  ios7Button2: { size: [84, 50], radius: 8, fill: '248,248,250', line: { lineWidth: 1, lineColor: HAIR }, text: { Cancel: '取消' } },
  ios7Text: { size: [160, 28], fill: '255,255,255', line: { lineWidth: 1, lineColor: HAIR } },
  // 步进器：旧素材挂了 alpha:0.1（贴设备截图用的），落到白画布整个图形近乎隐形
  ios7Stepper: {
    size: [72, 24],
    alpha: 1,
    fill: '248,248,250',
    line: { lineWidth: 1, lineColor: HAIR },
    subs: { 1: { line: { lineWidth: 1.5, lineColor: '153,154,158' } } },
  },
  ios7Slider: { size: [150, 22] },
  ios7ControlProgress: { size: [150, 8] },
  ios7SwitchOn: { size: [44, 24] },
  // 开关：关 —— 轨道给浅灰底，白色滑块才有对比
  ios7SwitchOff: {
    size: [44, 24],
    subs: { 0: { fill: '233,234,238', line: { lineWidth: 1, lineColor: '186,188,194' } } },
  },

  // ── iOS 元素 ──────────────────────────────
  ios7Heading1: { size: [90, 24] },
  ios7Heading2: { size: [90, 24] },
  ios7TextLabel: { size: [150, 30] },
  ios7Label: { size: [72, 18] },
  ios7TransparentBg: { body: { lineWidth: 1, lineColor: HAIR } },
  ios7StatusLight: { body: { lineWidth: 1, lineColor: '222,223,227' } },
  // 导航栏：主体给中性发丝线，两侧按钮保持原有蓝色（图形级 line 会串色，只补 body）
  ios7Nav: { body: { lineWidth: 1, lineColor: HAIR } },
  ios7Progress: { body: { lineWidth: 1, lineColor: HAIR } },
  ios7TitleScope: { body: { lineWidth: 1, lineColor: HAIR } },
  ios7Search: { body: { lineWidth: 1, lineColor: HAIR }, subs: { 1: { fill: '226,227,232' } } },
  ios7ListView: { body: { lineWidth: 1, lineColor: HAIR } },
  ios7ListRow: { body: { lineWidth: 1, lineColor: HAIR } },
  ios7Tooltip: { size: [100, 46], fill: '255,255,255', line: { lineWidth: 1, lineColor: HAIR } },
  ios7Alert: { size: [180, 90], fill: '255,255,255', line: { lineWidth: 1, lineColor: HAIR } },
  ios7Dropdown: { fill: '255,255,255', body: { lineWidth: 1, lineColor: HAIR } },

  // ── iOS 设备背景 ──────────────────────────
  // 外框/屏区/听筒/home 键由 mobile-glyphs.mjs 重画，无需样式补丁

  // ── Android 控件 ──────────────────────────
  // Material 主按钮：teal 实底 + 白字（勾选/单选/滑块的强调色同一套）；圆角按 Material 观感重建
  andriodButton1: { size: [84, 50], radius: 10, fill: TEAL, font: { color: '255,255,255' }, text: { Button: '按钮' } },
  andriodInput1: {
    size: [150, 30],
    fill: '250,250,250',
    line: { lineWidth: 1, lineColor: '186,188,194' },
    font: { color: '60,60,60' },
  },
  // 复选框：左侧方框 + 右侧文字（双击可改），宽含文字区
  andriodCheck: { size: [66, 20] },
  // 单选组：横排三项（圆 + 文字），文字 13px 贴着下项圆排布
  andriodRadio: { size: [234, 24] },
  andriodSwitchOff: { size: [52, 28] },
  andriodSwitchOnf: { size: [52, 28] },
  andriodSlider: { size: [150, 22] },

  // ── Android 元素 ──────────────────────────
  andriodHeading1: { size: [90, 24] },
  andriodHeading2: { size: [90, 24] },
  andriodTextLabel: { size: [150, 30] },
  andriodTitle1: { fill: '250,250,250', line: { lineWidth: 1, lineColor: HAIR_AND }, text: { Title: '标题' } },
  andriodTitle2: { fill: '250,250,250', line: { lineWidth: 1, lineColor: HAIR_AND }, text: { Title: '标题' } },
  andriodSearch1: { body: { lineWidth: 1, lineColor: HAIR_AND }, text: { Title: '标题' } },
  andriodBack: { body: { lineWidth: 1, lineColor: HAIR_AND }, text: { Title: '标题' } },
  // 菜单条：主体发丝线 + 选中项下方的 teal 指示条（旧素材只写了颜色没写线宽）
  andriodTitle3: {
    body: { lineWidth: 1, lineColor: HAIR_AND },
    subs: { 1: { line: { lineWidth: 2, lineColor: TEAL } } },
    text: { 'Menu A': '菜单 A', 'Menu B': '菜单 B', 'Menu C': '菜单 C' },
  },
  andriodSearch: {
    body: { lineWidth: 1, lineColor: HAIR_AND },
    subs: { 1: { fill: '228,229,233' } },
    text: { Search: '搜索' },
  },
  // 列表：path[1] 是行分隔线组，旧素材 220 灰在白底上几乎不可见，加深一档
  andriodListView1: {
    fill: '255,255,255',
    body: { lineWidth: 1, lineColor: HAIR_AND },
    subs: { 1: { line: { lineColor: '205,207,210' } } },
    text: { 'Single line item': '单行条目' },
  },
  andriodListView2: {
    fill: '255,255,255',
    body: { lineWidth: 1, lineColor: HAIR_AND },
    subs: { 1: { line: { lineColor: '205,207,210' } } },
    text: { 'Single line item': '单行条目' },
  },
  andriodListRow: { fill: '255,255,255', body: { lineWidth: 1, lineColor: HAIR_AND }, text: { 'Single line item': '单行条目' } },
  andriodListView3: { fill: '255,255,255', body: { lineWidth: 1, lineColor: HAIR_AND }, text: { 'List Item': '列表项' } },
  andriodTag: { size: [52, 20], fill: '117,117,117', text: { tag: '标签' } },
  // Material 提示气泡：深灰实底白字（旧素材是淡紫无字，白底上几乎看不见）
  andriodTooltip: { size: [100, 46], fill: '97,97,101', font: { color: '255,255,255' }, label: '提示' },
  andriodDialog: {
    size: [210, 120],
    fill: '255,255,255',
    body: { lineWidth: 1, lineColor: '200,202,206' },
    text: {
      'This is a Dialog': '这是一个对话框',
      'This is a Dialog, you can use it as a simple dialog, or a confirm window yet.':
        '可以当作普通对话框，也可以当作确认窗口使用。',
      Save: '保存',
      Cancel: '取消',
    },
  },
  andriodConfirm: {
    size: [210, 76],
    fill: '255,255,255',
    body: { lineWidth: 1, lineColor: '200,202,206' },
    text: {
      'Are you sure to delete this messages?': '确定要删除这条消息吗？',
      Done: '完成',
      Cancel: '取消',
    },
  },
  // 容器：虚线框，语义上是「放东西的区域」
  andriodCon: {
    fill: '252,252,253',
    line: { lineWidth: 1, lineColor: '170,172,178', lineStyle: 'dashed' },
  },
}
