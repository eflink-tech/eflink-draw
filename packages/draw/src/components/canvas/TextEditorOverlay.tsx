// - wrapper 定位到锚点（图形文本区中心 / 连线中点）的屏幕坐标，
//   transform: translate(-50%,-50%) rotate(deg) scale(视口缩放) 绕中心变换
// - 字体样式与 Konva Text 渲染一致（lineHeight = size*1.25）；
// - vAlign 以锚点偏移模拟（top 贴块顶 / middle 居中 / bottom 贴块底）
// - Ctrl+Enter/blur 确认写回；Esc 取消；Ctrl+B/I/U 边编辑边改 fontStyle
import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { useEditorStore } from '@/store/editorStore'
import {
  isLinker,
  DEFAULT_FONT_SIZE,
  TEXT_LINE_HEIGHT,
  type FontStyle,
} from '@/types'
import { getLinkerMidpoint } from '@/core/editor/linkerDraw'
import { LINKER_FONT_DEFAULTS } from '@/core/editor/linker'
import { worldToScreen } from '@/core/editor/interaction'
import { evalTextBlockRect } from '@/core/editor/textEdit'
import { buildFontStyleCSS } from '@/core/editor/textOverlayStyle'

const LINKER_MIN_W = 50
const LINKER_PAD_W = 20

export function TextEditorOverlay() {
  const textEdit = useEditorStore((s) => s.textEdit)
  if (!textEdit) return null
  // key 重挂载：每次打开（元素/块变化）都是全新编辑会话
  return <Editor key={`${textEdit.id}:${textEdit.block}`} id={textEdit.id} block={textEdit.block} />
}

function Editor({ id, block }: { id: string; block: number }) {
  const el = useEditorStore((s) => s.document.elements[id])
  // 订阅整个 viewport 而非仅 scale（updateViewport 每次返回新对象，引用比较安全）：
  // 平移时 x/y 变化同样需要重算锚点屏幕坐标，使编辑器跟随锚点
  const { scale } = useEditorStore((s) => s.viewport)

  // 图形 fontStyle 必选；连线可选（LINKER_FONT_DEFAULTS 兜底）。
  // 图形需合并块级 fontStyle 覆盖（如 UML 类的属性/方法块 textAlign:'left'），
  // 否则编辑态用图形级默认（居中）、提交后按块级（居左）渲染，产生对齐跳变。
  // 直接调用 isLinker(el) 收窄联合类型（布尔变量不触发 TS 收窄）。
  // 提前到早退之前：测量 effect 的依赖需要字体因子，hooks 不能位于条件早退之后；
  // el 为 null（元素被删、即将卸载）时兜底默认值，仅维持 hooks 依赖
  const font: FontStyle = el
    ? isLinker(el)
      ? { ...LINKER_FONT_DEFAULTS, ...el.fontStyle }
      : { ...el.fontStyle, ...el.textBlock[block]?.fontStyle }
    : LINKER_FONT_DEFAULTS
  const fontSize = font.size ?? DEFAULT_FONT_SIZE
  const lineHeight = fontSize * TEXT_LINE_HEIGHT

  const [value, setValue] = useState(() => {
    if (!el) return ''
    return isLinker(el) ? el.text : el.textBlock[block]?.text ?? ''
  })
  // 内容实际尺寸：
  // - span 测最长行宽（不折行，用于连线编辑框宽度）
  // - div 与 textarea 等宽同字体，测折行后真实高度（用于 vAlign 居中偏移）
  // 与 Konva Text 单行高度一致（size*1.25），勿用更大下限以免 vAlign 偏移
  const [contentH, setContentH] = useState(lineHeight)
  const [textW, setTextW] = useState(0)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const rulerRef = useRef<HTMLDivElement>(null)
  const longestLineRef = useRef<HTMLSpanElement>(null)
  // Esc 取消后卸载触发 blur，该标志阻止 blur 再写回
  const cancelledRef = useRef(false)

  // 挂载即聚焦全选
  useLayoutEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.focus()
    ta.select()
  }, [])

  // 内容变化后测量（DOM 已更新，无闪烁）。
  // - span（不折行）测最长行宽 → 连线编辑框宽度
  // - div（与 textarea 等宽同字体）offsetHeight = 折行后真实内容高度 → vAlign 居中偏移
  // 字体变化（Ctrl+B/I/U 写 store → fontStyleCSS 变）同样影响测量
  useLayoutEffect(() => {
    const span = longestLineRef.current
    const ruler = rulerRef.current
    if (span) setTextW(span.offsetWidth)
    if (ruler) setContentH(Math.max(ruler.offsetHeight, lineHeight))
  }, [value, fontSize, lineHeight, font.bold, font.italic, font.underline, font.fontFamily])

  if (!el) return null

  // —— 几何：wrapper 锚点（世界坐标）与宽度 ——
  // 图形：Konva Text 以整个图形矩形布局（width=w height=h verticalAlign），
  // 编辑器锚点对齐图形中心，wrapper 使用固定 shape 高度（而非动态 contentH），
  // 保证输入过程中容器尺寸不变 → translate(-50%,-50%) 锚点稳定 → 无跳动
  let anchorX: number
  let anchorY: number
  let worldW: number
  let worldH: number
  let rotDeg = 0
  let taPadTop = 0 // textarea 内部垂直对齐偏移（px），模拟 Konva verticalAlign
  let taBg = 'transparent' // 图形有自身填充色 → 透明；连线无填充 → 白底，编辑态可见
  if (isLinker(el)) {
    const mid = getLinkerMidpoint(el)
    anchorX = mid.x
    anchorY = mid.y
    worldW = Math.max(LINKER_MIN_W, textW + LINKER_PAD_W)
    worldH = lineHeight // 连线单行高
    taBg = 'white'
  } else {
    const { x, y, w, h, angle } = el.props
    // 使用 textBlock 区域定位编辑框（而非整个图形包围盒）
    const blockRect = evalTextBlockRect(el.textBlock[block]!, w, h)
    anchorX = x + blockRect.x + blockRect.w / 2
    anchorY = y + blockRect.y + blockRect.h / 2
    worldW = blockRect.w
    worldH = blockRect.h
    rotDeg = (angle * 180) / Math.PI
    // textarea 在固定高度 wrapper 内垂直对齐（等价 Konva verticalAlign）
    const vAlign = font.vAlign ?? 'middle'
    if (vAlign === 'top') {
      taPadTop = 0
    } else if (vAlign === 'bottom') {
      taPadTop = Math.max(blockRect.h - contentH, 0)
    } else {
      taPadTop = Math.max((blockRect.h - contentH) / 2, 0)
    }
  }
  const screen = worldToScreen(anchorX, anchorY)

  const fontStyleCSS: CSSProperties = buildFontStyleCSS(font, fontSize)

  const commit = (): void => {
    if (cancelledRef.current) return
    const st = useEditorStore.getState()
    const cur = st.document.elements[id]
    // 空内容回收：刚创建的 freetext 未输入任何文字 → 删除残骸（deleteElements 自动清 textEdit）
    if (
      st.textEdit?.fresh === true &&
      cur &&
      !isLinker(cur) &&
      cur.name === 'freetext' &&
      value.trim() === ''
    ) {
      st.deleteElements([id])
      return
    }
    if (cur && isLinker(cur)) {
      if (value !== cur.text) st.updateLinker(cur.id, { text: value })
    } else if (cur && cur.textBlock[block] && value !== cur.textBlock[block]!.text) {
      const textBlock = cur.textBlock.map((tb, i) => (i === block ? { ...tb, text: value } : tb))
      st.updateElement(cur.id, { textBlock })
    }
    st.setTextEdit(null)
  }

  const cancel = (): void => {
    cancelledRef.current = true
    const st = useEditorStore.getState()
    const cur = st.document.elements[id]
    // Esc 取消：空 freetext 同样回收（不留隐形残骸）
    if (
      st.textEdit?.fresh === true &&
      cur &&
      !isLinker(cur) &&
      cur.name === 'freetext' &&
      value.trim() === ''
    ) {
      st.deleteElements([id])
      return
    }
    st.setTextEdit(null)
  }

  const toggleFont = (key: 'bold' | 'italic' | 'underline'): void => {
    const st = useEditorStore.getState()
    const cur = st.document.elements[id]
    if (!cur) return
    if (isLinker(cur)) {
      const base: FontStyle = { ...LINKER_FONT_DEFAULTS, ...cur.fontStyle }
      st.updateLinker(cur.id, { fontStyle: { ...base, [key]: !base[key] } })
    } else {
      st.updateElement(cur.id, {
        fontStyle: { ...cur.fontStyle, [key]: !cur.fontStyle[key] },
      })
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    const mod = e.ctrlKey || e.metaKey
    if (mod && e.key === 'Enter') {
      e.preventDefault()
      commit()
      taRef.current?.blur()
      return
    }
    // ⌘S：textarea 内先提交并失焦，避免全局快捷键早退导致触发浏览器存页框
    if (mod && (e.key === 's' || e.key === 'S')) {
      e.preventDefault()
      commit()
      taRef.current?.blur()
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      cancel()
      return
    }
    if (mod && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault()
      toggleFont('bold')
    } else if (mod && (e.key === 'i' || e.key === 'I')) {
      e.preventDefault()
      toggleFont('italic')
    } else if (mod && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault()
      toggleFont('underline')
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${screen.x}px`,
        top: `${screen.y}px`,
        width: `${worldW}px`,
        height: `${worldH}px`,
        transform: `translate(-50%, -50%) rotate(${rotDeg}deg) scale(${scale})`,
        transformOrigin: 'center',
        background: 'transparent',
        zIndex: 20,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        spellCheck={false}
        style={{
          all: 'unset',
          width: '100%',
          height: '100%',
          ...fontStyleCSS,
          background: taBg,
          paddingTop: `${taPadTop}px`,
          resize: 'none',
          overflow: 'hidden',
          display: 'block',
          boxSizing: 'border-box',
          WebkitAppearance: 'none',
        }}
      />
      {/* 隐藏标尺：div 与 textarea 等宽同字体，测折行后真实高度 */}
      <div
        ref={rulerRef}
        style={{
          ...fontStyleCSS,
          position: 'absolute',
          visibility: 'hidden',
          left: 0,
          top: 0,
          width: `${worldW}px`,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {value}
      </div>
      {/* 隐藏测宽尺：span 不折行，测最长行宽（连线编辑框宽度用） */}
      <span
        ref={longestLineRef}
        style={{
          ...fontStyleCSS,
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre',
          left: -9999,
          top: 0,
        }}
      >
        {value.split('\n').reduce((m, l) => (l.length > m.length ? l : m), '') || ' '}
      </span>
    </div>
  )
}
