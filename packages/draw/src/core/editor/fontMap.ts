/** 字体家族选项：value 存入 fontStyle.fontFamily，css 为渲染 fallback 链 */
export const FONT_OPTIONS: Array<{ value: string; label: string; css: string }> = [
  { value: 'yahei', label: '微软雅黑', css: '"微软雅黑", "Microsoft YaHei", sans-serif' },
  { value: 'hei', label: '思源黑体', css: '"Source Han Sans", "Noto Sans CJK SC", sans-serif' },
  { value: 'song', label: '思源宋体', css: '"Source Han Serif", "Noto Serif CJK SC", serif' },
  { value: 'kai', label: '楷体', css: '"楷体", "KaiTi", serif' },
  { value: 'arial', label: 'Arial', css: 'Arial, sans-serif' },
  { value: 'times', label: 'Times New Roman', css: '"Times New Roman", serif' },
  { value: 'courier', label: 'Courier New', css: '"Courier New", monospace' },
]

/** 默认字体 value（fontStyle.fontFamily 缺省时的存储值） */
export const DEFAULT_FONT_VALUE = 'yahei'

/** 默认字体 CSS fallback（渲染时使用） */
export const DEFAULT_FONT_CSS = '"微软雅黑", "Microsoft YaHei", sans-serif'

/** fontStyle.fontFamily value → CSS font-family 字符串 */
const FONT_CSS: Record<string, string> = Object.fromEntries(
  FONT_OPTIONS.map((o) => [o.value, o.css]),
)

export function fontFamilyCSS(value: string | undefined): string {
  if (!value) return DEFAULT_FONT_CSS
  return FONT_CSS[value] ?? value
}
