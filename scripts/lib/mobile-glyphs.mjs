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

export const LABEL_LEFT = (w) => [
  { position: { x: 'w+4', y: 0, w: 'w*3', h: 'h' }, text: '' },
]

/**
 * name → 补丁。
 * subPaths 追加到（已剔除 image 子路径的）原路径之后；fill / alpha / textColor /
 * textBlocks 用于覆盖旧素材里靠位图表达的整块外观。
 */
export const MOBILE_GLYPHS = {
  andriodCheck: {
    subPaths: () => [
      sub(rectPath(1, 1, 23, 23), stroke(GREY)),
      sub([line(6, 13), line(11, 18), line(19, 7)], stroke(TEAL, 2)),
    ],
    textBlocks: LABEL_LEFT,
  },
  andriodRadio: {
    subPaths: () => [
      sub(ellipsePath(1, 1, 23, 23), stroke(GREY)),
      sub(ellipsePath(8, 8, 9, 9), fill(TEAL)),
    ],
    textBlocks: LABEL_LEFT,
  },
  andriodSwitchOff: {
    subPaths: () => [
      sub(roundRectPath(2, 17, 66, 6, 3), fill('190,190,190')),
      sub(ellipsePath(6, 5, 30, 30), both(SWITCH_WHITE, '170,170,170')),
    ],
  },
  andriodSwitchOnf: {
    subPaths: () => [
      sub(roundRectPath(2, 17, 66, 6, 3), fill('105,214,194')),
      sub(ellipsePath(34, 5, 30, 30), fill(TEAL)),
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
}
