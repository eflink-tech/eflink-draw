/**
 * 移动端原型图形的手绘矢量补丁。
 *
 * 旧 Schema 的 iOS/Android 图形里有 17 个是「矢量骨架 + 位图装饰」：外框/输入框/滑轨
 * 是 path 动作，勾选标记、开关滑块、放大镜、键盘按键等细节整块是一张 PNG
 * （/images/designer/…，本地素材也无命中）。本项目口径是全部可编辑矢量，所以这里按
 * 默认尺寸把这些位图区域重画成矢量，生成时替换掉 image 子路径；随后由生成器统一把
 * 绝对像素改写成 w/h 比例，缩放图形时细节跟随。
 *
 * 坐标一律用旧图形的默认尺寸（w×h）书写，保持可读；比例化交给 gen-legacy-shapes.mjs。
 */

const move = (x, y) => ({ action: 'move', x, y })
const line = (x, y) => ({ action: 'line', x, y })
const quad = (x1, y1, x, y) => ({ action: 'quadraticCurve', x1, y1, x, y })
const cubic = (x1, y1, x2, y2, x, y) => ({ action: 'curve', x1, y1, x2, y2, x, y })
const CLOSE = { action: 'close' }
export { move, line, quad, cubic, CLOSE }

/** 子路径：带样式时包成 {actions, lineStyle, fillStyle}，否则裸数组 */
const sub = (actions, style) => (style ? { actions, ...style } : actions)
const fill = (color) => ({ fillStyle: { type: 'solid', color }, lineStyle: { lineWidth: 0 } })
const stroke = (lineColor, lineWidth = 1.5) => ({ fillStyle: { type: 'none' }, lineStyle: { lineWidth, lineColor } })
const both = (color, lineColor, lineWidth = 1) => ({ fillStyle: { type: 'solid', color }, lineStyle: { lineWidth, lineColor } })
export { sub, fill, stroke, both }

const rectPath = (x, y, w, h) => [move(x, y), line(x + w, y), line(x + w, y + h), line(x, y + h), CLOSE]
const ellipsePath = (x, y, w, h) => [
  move(x, y + h / 2),
  cubic(x, y - h / 6, x + w, y - h / 6, x + w, y + h / 2),
  cubic(x + w, y + h + h / 6, x, y + h + h / 6, x, y + h / 2),
  CLOSE,
]
const roundRectPath = (x, y, w, h, r) => [
  move(x, y + r),
  quad(x, y, x + r, y),
  line(x + w - r, y),
  quad(x + w, y, x + w, y + r),
  line(x + w, y + h - r),
  quad(x + w, y + h, x + w - r, y + h),
  line(x + r, y + h),
  quad(x, y + h, x, y + h - r),
  CLOSE,
]
export { rectPath, ellipsePath, roundRectPath }

/**
 * 表达式版正圆：x/y/d 均为完整表达式字符串（如 'w/3'、'h*0.84'）。
 * 用于新旧默认尺寸非等比的图形（如单选组 24×24 → 234×24）：数字坐标会被生成器
 * 按旧框比例化，宽高轴各换各的，圆就压成椭圆；表达式原样保留、渲染时按当前尺寸求值。
 */
const circle = (x, y, d) => [
  move(x, `(${y})+(${d})/2`),
  cubic(x, `(${y})-(${d})/6`, `(${x})+(${d})`, `(${y})-(${d})/6`, `(${x})+(${d})`, `(${y})+(${d})/2`),
  cubic(`(${x})+(${d})`, `(${y})+(${d})*7/6`, x, `(${y})+(${d})*7/6`, x, `(${y})+(${d})/2`),
  CLOSE,
]

export const GREY = '120,120,120'
const TEAL = '0,150,136'

/** 放大镜：圆环 + 手柄 */
export const magnifier = (x, y, d, color = GREY) => [
  sub(ellipsePath(x, y, d, d), stroke(color, 1.5)),
  sub([line(x + d * 0.78, y + d * 0.78), line(x + d, y + d)], stroke(color, 2)),
]
/** 电池：外壳 + 电量 + 正极凸点 */
export const battery = (x, y, w, h, color) => [
  sub(roundRectPath(x, y, w, h, h / 4), stroke(color, 1)),
  sub(rectPath(x + h / 3, y + h / 3, w * 0.6, h / 3), fill(color)),
  sub(rectPath(x + w + 1, y + h / 3, 2, h / 3), fill(color)),
]
/** 信号阶梯：n 根渐高小柱 */
const signalBars = (x, yBase, n, color) =>
  Array.from({ length: n }, (_, i) =>
    sub(rectPath(x + i * 6, yBase - (4 + i * 3), 4, 4 + i * 3), fill(color)),
  )

/** 键盘按键排布：rows = [{ keys, y, h, indent }]，键宽按可用宽度均分 */
const keyboard = (w, rows, keyFill, keyLine) => {
  const out = []
  const gap = 4
  for (const { keys, y, h, indent = 0 } of rows) {
    const usable = w - 8 - indent * 2
    const kw = (usable - gap * (keys - 1)) / keys
    for (let i = 0; i < keys; i++) {
      out.push(sub(roundRectPath(4 + indent + i * (kw + gap), y, kw, h, 3), both(keyFill, keyLine, 0.8)))
    }
  }
  return out
}

const IOS_GREEN = '90,200,125'
const SWITCH_WHITE = '255,255,255'

/**
 * name → 补丁。
 * subPaths 追加到（已剔除 image 子路径的）原路径之后；fill / alpha / textColor /
 * textBlocks 用于覆盖旧素材里靠位图表达的整块外观。
 */
export const MOBILE_GLYPHS = {
  // 复选框：左侧方框 + 右侧可编辑文字（对齐单选组的观感）；
  // 方框与勾同样走表达式坐标（边长定 h 轴），非等比的新档尺寸下仍是正方形
  andriodCheck: {
    replace: true,
    subPaths: () => [
      sub(
        [
          move('0', 'h*0.04'),
          line('h*0.92', 'h*0.04'),
          line('h*0.92', 'h*0.96'),
          line('0', 'h*0.96'),
          CLOSE,
        ],
        stroke(GREY, 1.5),
      ),
      sub(
        [line('h*0.25', 'h*0.54'), line('h*0.46', 'h*0.75'), line('h*0.79', 'h*0.29')],
        stroke(TEAL, 2),
      ),
    ],
    textBlocks: () => [{ position: { x: 'h+5', y: 0, w: 'w-h-5', h: 'h' }, text: '复选框' }],
  },
  // 单选组：横排「圆 + 文字」三项，第一项选中（对齐 drawio/ProcessOn 的单选按钮组观感）。
  // 圆走 circle（表达式版）：直径定 h 轴、位置定 w 轴，非等比的新档尺寸下仍是正圆
  andriodRadio: {
    replace: true,
    subPaths: () => [
      sub(circle('0', 'h*0.08', 'h*0.84'), stroke(GREY, 1.5)),
      sub(circle('h*0.21', 'h*0.29', 'h*0.42'), fill(TEAL)),
      sub(circle('w/3', 'h*0.08', 'h*0.84'), stroke(GREY, 1.5)),
      sub(circle('w*2/3', 'h*0.08', 'h*0.84'), stroke(GREY, 1.5)),
    ],
    textBlocks: () => [
      { position: { x: 'w*0.111', y: 0, w: 'w*0.22', h: 'h' }, text: '单选按钮' },
      { position: { x: 'w*0.444', y: 0, w: 'w*0.22', h: 'h' }, text: '单选按钮' },
      { position: { x: 'w*0.778', y: 0, w: 'w*0.22', h: 'h' }, text: '单选按钮' },
    ],
  },
  // Material 开关：轨道是全高胶囊（初版按旧位图描的 6px 细轨，视觉上认不出是开关）
  andriodSwitchOff: {
    subPaths: () => [
      sub(roundRectPath(2, 12, 68, 16, 8), fill('176,178,182')),
      sub(ellipsePath(5, 9, 22, 22), both(SWITCH_WHITE, '170,170,170')),
    ],
  },
  andriodSwitchOnf: {
    subPaths: () => [
      sub(roundRectPath(2, 12, 68, 16, 8), fill(TEAL)),
      sub(ellipsePath(45, 9, 22, 22), both(SWITCH_WHITE, TEAL)),
    ],
  },
  andriodSlider: {
    subPaths: () => [sub(ellipsePath(107, 2, 26, 26), both(SWITCH_WHITE, TEAL, 1.5))],
  },
  ios7Slider: {
    subPaths: () => [sub(ellipsePath(107, 2, 26, 26), both(SWITCH_WHITE, '73,126,191', 1.5))],
  },
  ios7SwitchOn: {
    subPaths: () => [
      sub(roundRectPath(0, 0, 50, 28, 14), fill(IOS_GREEN)),
      sub(ellipsePath(23, 2, 24, 24), fill(SWITCH_WHITE)),
    ],
  },
  ios7SwitchOff: {
    subPaths: () => [
      sub(roundRectPath(1, 1, 48, 26, 13), both(SWITCH_WHITE, '205,205,205')),
      sub(ellipsePath(2, 2, 24, 24), both(SWITCH_WHITE, '215,215,215')),
    ],
  },

  andriodStatusDark: {
    fill: { type: 'solid', color: '51,51,51' },
    subPaths: () => [
      ...signalBars(298, 18, 3, '255,255,255'),
      ...battery(326, 8, 20, 8, '255,255,255'),
    ],
  },
  ios7StatusDark: {
    fill: { type: 'solid', color: '0,0,0' },
    subPaths: () => [
      ...Array.from({ length: 5 }, (_, i) => sub(ellipsePath(214 + i * 7, 7, 5, 5), fill('255,255,255'))),
      ...battery(250, 6, 20, 8, '255,255,255'),
    ],
    textColor: '255,255,255',
  },
  ios7StatusLight: {
    fill: { type: 'solid', color: '245,245,245' },
    subPaths: () => [
      ...Array.from({ length: 5 }, (_, i) => sub(ellipsePath(214 + i * 7, 7, 5, 5), fill(GREY))),
      ...battery(250, 6, 20, 8, GREY),
    ],
    textColor: '80,80,80',
  },

  andriodSearch1: {
    subPaths: () => [
      ...[17, 22, 27].map((y) => sub([line(18, y), line(36, y)], stroke('100,100,100', 2))),
      ...magnifier(324, 14, 16),
    ],
  },
  andriodBack: {
    subPaths: () => [
      sub([line(18, 22), line(36, 22)], stroke('100,100,100', 2)),
      sub([line(25, 15), line(18, 22), line(25, 29)], stroke('100,100,100', 2)),
      ...magnifier(324, 14, 16),
    ],
  },
  andriodSearch: {
    subPaths: () => [
      ...magnifier(18, 14, 16),
      sub(roundRectPath(330, 12, 8, 13, 4), fill('100,100,100')),
      sub([line(334, 26), line(334, 30)], stroke('100,100,100', 1.5)),
      sub([line(330, 30), line(338, 30)], stroke('100,100,100', 1.5)),
    ],
  },
  ios7Search: {
    subPaths: () => magnifier(14, 14, 16, '160,160,160'),
  },

  andriodInput: {
    fill: { type: 'solid', color: '233,233,233' },
    subPaths: () =>
      keyboard(
        360,
        [
          { keys: 10, y: 12, h: 40 },
          { keys: 9, y: 58, h: 40, indent: 18 },
          { keys: 8, y: 104, h: 40, indent: 30 },
          { keys: 4, y: 150, h: 40 },
        ],
        '255,255,255',
        '205,205,205',
      ),
  },
  ios7Keyboard: {
    fill: { type: 'solid', color: '214,212,220' },
    subPaths: () =>
      keyboard(
        280,
        [
          { keys: 10, y: 10, h: 32 },
          { keys: 9, y: 48, h: 32, indent: 12 },
          { keys: 7, y: 86, h: 32, indent: 26 },
          { keys: 4, y: 124, h: 32 },
        ],
        '255,255,255',
        '190,190,196',
      ),
  },

  // ── 设备外框 ──────────────────────────────
  // 旧素材只有一块直角纯色矩形（黑/灰机身在画布上是毫无细节的色块），
  // 按 iPhone 8 / 经典 Android 的线框观感重画：圆角外框 + 屏区 + 听筒 + home 键/三键
  ios7WhiteBg: {
    replace: true,
    subPaths: (w, h) => iosDeviceFrame(w, h, '255,255,255', '203,204,209', '172,174,179'),
  },
  ios7GreyBg: {
    replace: true,
    subPaths: (w, h) => iosDeviceFrame(w, h, '230,230,230', '189,190,195', '140,142,147'),
  },
  ios7BlackBg: {
    replace: true,
    subPaths: (w, h) => iosDeviceFrame(w, h, '45,45,48', '95,96,101', '150,152,157'),
  },
  andriodGreyBg: {
    replace: true,
    subPaths: (w, h) => [
      sub(roundRectPath(2, 2, w - 4, h - 4, w * 0.083), both('230,230,230', '189,190,195', 1)),
      sub(rectPath(w * 0.039, h * 0.066, w * 0.922, h * 0.876), fill('250,250,251')),
      // 听筒（顶部边框内）+ 经典三键导航：返回 / home / 菜单
      sub(roundRectPath(w * 0.444, h * 0.026, w * 0.112, h * 0.012, h * 0.006), fill('172,174,179')),
      sub(
        [move(w * 0.414, h * 0.958), line(w * 0.443, h * 0.978), line(w * 0.414, h * 0.978), CLOSE],
        stroke('150,152,157', 1.5),
      ),
      sub(ellipsePath(w * 0.478, h * 0.952, w * 0.055, w * 0.055), stroke('150,152,157', 1.5)),
      sub(
        [
          move(w * 0.536, h * 0.9585), line(w * 0.583, h * 0.9585),
          move(w * 0.536, h * 0.9677), line(w * 0.583, h * 0.9677),
          move(w * 0.536, h * 0.977), line(w * 0.583, h * 0.977),
        ],
        stroke('150,152,157', 1.2),
      ),
    ],
  },
}

/** iPhone 8 线框：圆角外框 + 屏区 + 听筒/摄像头 + home 键，机身三色由调用方给 */
const iosDeviceFrame = (w, h, body, edge, detail) => [
  sub(roundRectPath(2, 2, w - 4, h - 4, w * 0.13), both(body, edge, 1)),
  sub(rectPath(w * 0.057, h * 0.121, w * 0.886, h * 0.758), fill('250,250,251')),
  sub(roundRectPath(w * 0.435, h * 0.063, w * 0.13, h * 0.015, h * 0.0075), fill(detail)),
  sub(ellipsePath(w * 0.375, h * 0.056, w * 0.038, w * 0.038), fill(detail)),
  sub(ellipsePath(w * 0.464, h * 0.917, w * 0.072, w * 0.072), stroke(detail, 1.5)),
]
