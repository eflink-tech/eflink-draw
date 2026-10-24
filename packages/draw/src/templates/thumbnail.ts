// 模板缩略图：TemplateSpec → 矢量 SVG 示意图
//
// 与真实文档同源：先 buildTemplateDocument（原生形状 + 真实 getLinkerPoints 路由），
// 再把 DocumentData 折算成简化的矢量图元（不引用图片/位图，缩略图只表达版式与配色）。
import { isLinker, type ElementInstance, type LinkerInstance, type RGBColor } from '@/types'
import { SWIMLANE_HEADER, isSwimlane, swimlaneLayoutOf } from '@/core/editor/swimlane'
import { buildTemplateDocument } from './builder'
import type { TemplateSpec } from './types'

const OUTLINE = '#59616e'
const LINE = '#4b5563'
const SWIMLANE_SHAPES = new Set(['swimlaneV', 'swimlaneH', 'verticalPool', 'verticalLane', 'horizontalPool', 'horizontalLane'])
const DIAMOND_SHAPES = new Set(['decision', 'bpmnGateway', 'diamond'])
const CIRCLE_SHAPES = new Set(['round', 'umlStart', 'umlEnd', 'startEvent', 'endEvent', 'flowFinal'])
const ROUNDED_SHAPES = new Set(['roundRectangle', 'umlState', 'sequenceActivation', 'activity'])

const n = (v: number) => Math.round(v * 10) / 10
const pts = (list: { x: number; y: number }[]) => list.map((p) => `${n(p.x)},${n(p.y)}`).join(' ')

function solid(fill: { type: string; color?: RGBColor }): string | null {
  return fill.type === 'solid' && fill.color ? `rgb(${fill.color})` : null
}

function rect(x: number, y: number, w: number, h: number, fill: string, stroke = 'none', sw = 0, rx = 0): string {
  const r = rx ? ` rx="${n(rx)}"` : ''
  const strokeAttr = stroke === 'none' ? 'stroke="none"' : `stroke="${stroke}" stroke-width="${n(sw)}"`
  return `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"${r} fill="${fill}" ${strokeAttr}/>`
}

function paintSwimlane(el: ElementInstance, sw: number): string {
  const layout = swimlaneLayoutOf(el)
  const { x, y, w, h } = el.props
  const titleSize = layout.titleSize ?? 40
  const band = layout.hasHeadRow ? SWIMLANE_HEADER : 0
  const lanes = Math.max(1, layout.laneCount)
  const out: string[] = []
  const vertical = layout.orientation === 'v'

  if (vertical) {
    if (layout.titleColor) out.push(rect(x, y, w, titleSize, `rgb(${layout.titleColor})`))
    if (band) {
      for (let i = 0; i < lanes; i++) {
        const c = layout.laneHeadColors?.[i]
        if (c) out.push(rect(x + (w * i) / lanes, y + titleSize, w / lanes, band, `rgb(${c})`))
      }
    }
    out.push(rect(x, y, w, h, 'none', OUTLINE, sw))
    for (let i = 1; i < lanes; i++) {
      const lx = x + (w * i) / lanes
      out.push(`<line x1="${n(lx)}" y1="${n(y + titleSize)}" x2="${n(lx)}" y2="${n(y + h)}" stroke="${OUTLINE}" stroke-width="${n(sw)}"/>`)
    }
  } else {
    if (layout.titleColor) out.push(rect(x, y, titleSize, h, `rgb(${layout.titleColor})`))
    if (band) {
      for (let i = 0; i < lanes; i++) {
        const c = layout.laneHeadColors?.[i]
        if (c) out.push(rect(x + titleSize, y + (h * i) / lanes, band, h / lanes, `rgb(${c})`))
      }
    }
    out.push(rect(x, y, w, h, 'none', OUTLINE, sw))
    for (let i = 1; i < lanes; i++) {
      const ly = y + (h * i) / lanes
      out.push(`<line x1="${n(x + titleSize)}" y1="${n(ly)}" x2="${n(x + w)}" y2="${n(ly)}" stroke="${OUTLINE}" stroke-width="${n(sw)}"/>`)
    }
  }
  // 标题带/头格与泳道体的分界
  out.push(
    vertical
      ? `<line x1="${n(x)}" y1="${n(y + titleSize)}" x2="${n(x + w)}" y2="${n(y + titleSize)}" stroke="${OUTLINE}" stroke-width="${n(sw)}"/>`
      : `<line x1="${n(x + titleSize)}" y1="${n(y)}" x2="${n(x + titleSize)}" y2="${n(y + h)}" stroke="${OUTLINE}" stroke-width="${n(sw)}"/>`,
  )
  return out.join('')
}

function paintLifeline(el: ElementInstance, sw: number, actor: boolean): string {
  const { x, y, w, h } = el.props
  const headH = actor ? 44 : 30
  const cx = x + w / 2
  const fill = solid(el.fillStyle) ?? '#ffffff'
  return [
    rect(x, y, w, headH, fill, OUTLINE, sw),
    `<line x1="${n(cx)}" y1="${n(y + headH)}" x2="${n(cx)}" y2="${n(y + h)}" stroke="${OUTLINE}" stroke-width="${n(sw * 1.2)}" stroke-dasharray="${n(sw * 3)} ${n(sw * 2.4)}"/>`,
  ].join('')
}

function paintNode(el: ElementInstance, sw: number): string {
  if (el.name === 'text' || el.name === 'freetext') return ''
  const { x, y, w, h } = el.props
  if (el.name === 'sequenceActivation') {
    return rect(x, y, w, h, solid(el.fillStyle) ?? '#eef3fa', OUTLINE, sw * 0.8, Math.min(w, h) * 0.3)
  }
  if (el.name === 'sequenceLifeLine') return paintLifeline(el, sw, false)
  if (el.name === 'sequenceActorLifeLine') return paintLifeline(el, sw, true)
  if (SWIMLANE_SHAPES.has(el.name) || isSwimlane(el)) return paintSwimlane(el, sw)
  if (el.name === 'Synchronization') return rect(x, y, w, h, solid(el.fillStyle) ?? 'rgb(50,50,50)')

  const fill = solid(el.fillStyle) ?? 'none'
  const stroke = el.lineStyle.lineWidth === 0 ? 'none' : OUTLINE
  if (el.name === 'singleRightArrow') {
    const tip = h / 2
    return `<polygon points="${pts([
      { x, y },
      { x: x + w - tip, y },
      { x: x + w, y: y + h / 2 },
      { x: x + w - tip, y: y + h },
      { x, y: y + h },
    ])}" fill="${fill}" stroke="${stroke}" stroke-width="${n(sw)}"/>`
  }
  if (el.name === 'triangle') {
    return `<polygon points="${pts([
      { x: x + w / 2, y },
      { x: x + w, y: y + h },
      { x, y: y + h },
    ])}" fill="${fill}" stroke="${stroke}" stroke-width="${n(sw)}"/>`
  }
  if (el.name === 'directData') {
    const ry = Math.max(4, h * 0.16)
    return [
      `<path d="M ${n(x)} ${n(y + ry)} A ${n(w / 2)} ${n(ry)} 0 0 1 ${n(x + w)} ${n(y + ry)} L ${n(x + w)} ${n(y + h - ry)} A ${n(w / 2)} ${n(ry)} 0 0 1 ${n(x)} ${n(y + h - ry)} Z" fill="${fill}" stroke="${stroke}" stroke-width="${n(sw)}"/>`,
      `<path d="M ${n(x)} ${n(y + ry)} A ${n(w / 2)} ${n(ry)} 0 0 0 ${n(x + w)} ${n(y + ry)}" fill="none" stroke="${stroke}" stroke-width="${n(sw)}"/>`,
    ].join('')
  }
  if (DIAMOND_SHAPES.has(el.name)) {
    return `<polygon points="${pts([
      { x: x + w / 2, y },
      { x: x + w, y: y + h / 2 },
      { x: x + w / 2, y: y + h },
      { x, y: y + h / 2 },
    ])}" fill="${fill}" stroke="${stroke}" stroke-width="${n(sw)}"/>`
  }
  if (CIRCLE_SHAPES.has(el.name)) {
    return `<ellipse cx="${n(x + w / 2)}" cy="${n(y + h / 2)}" rx="${n(w / 2)}" ry="${n(h / 2)}" fill="${fill}" stroke="${stroke}" stroke-width="${n(sw)}"/>`
  }
  if (el.name === 'terminator') {
    return rect(x, y, w, h, fill, stroke, sw, h / 2)
  }
  if (ROUNDED_SHAPES.has(el.name)) {
    return rect(x, y, w, h, fill, stroke, sw, Math.min(w, h) * 0.22)
  }
  return rect(x, y, w, h, fill, stroke, sw)
}

function arrowHead(list: { x: number; y: number }[], sw: number): string {
  if (list.length < 2) return ''
  const a = list[list.length - 2]
  const b = list[list.length - 1]
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const L = sw * 3.4
  const W = sw * 1.7
  const bx = b.x - ux * L
  const by = b.y - uy * L
  return `<polygon points="${pts([
    b,
    { x: bx - uy * W, y: by + ux * W },
    { x: bx + uy * W, y: by - ux * W },
  ])}" fill="${LINE}"/>`
}

function paintLinker(lk: LinkerInstance, sw: number): string {
  const list = [{ x: lk.from.x, y: lk.from.y }, ...lk.points, { x: lk.to.x, y: lk.to.y }]
  const dashed = lk.lineStyle.lineStyle === 'dashed'
  const dash = dashed ? ` stroke-dasharray="${n(sw * 2.6)} ${n(sw * 2)}"` : ''
  return [
    `<polyline points="${pts(list)}" fill="none" stroke="${LINE}" stroke-width="${n(sw * 0.9)}" stroke-linejoin="round" stroke-linecap="round"${dash}/>`,
    lk.lineStyle.endArrowStyle !== 'none' ? arrowHead(list, sw) : '',
  ].join('')
}

/** 生成模板缩略图 SVG 源码（viewBox 与模板页面尺寸一致） */
export function buildTemplateThumbnail(spec: TemplateSpec): string {
  const doc = buildTemplateDocument(spec)
  const { width: W, height: H } = doc.page
  const sw = Math.max(W, H) / 150
  const all = Object.values(doc.elements)
  // 连线在图形之下的层级与画布一致；节点按 zindex 升序绘制（泳道等容器先画）
  const nodes = all.filter((el): el is ElementInstance => !isLinker(el)).sort((a, b) => a.props.zindex - b.props.zindex)
  const body = [
    ...all.filter(isLinker).map((lk) => paintLinker(lk, sw)),
    ...nodes.map((el) => paintNode(el, sw)),
  ]
    .filter(Boolean)
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">${body}</svg>`
}