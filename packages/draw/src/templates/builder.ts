// 模板构建器：TemplateSpec → 原生 DocumentData
// 全程使用编辑器自身 API（registry/linker/swimlane/seqMessage），保证形状、锚点、
// 路由与手动绘制后的文档完全同构；模板 ID 仅存在于 spec 内，落成文档时替换为真实 ID。
import { translateTitle } from '@/i18n'
import { shapeRegistry } from '@/core/schema/registry'
import {
  createLinkerInstance,
  getAngleDir,
  getAnchorPoints,
  getLinkerPoints,
  measureDistance,
  normAngle,
  type ShapeRect,
} from '@/core/editor/linker'
import { buildSwimlaneUpdate } from '@/core/editor/swimlane'
import { SEQ_LOOP_H, SEQ_LOOP_W, barEdgeX, selfLoopPoints } from '@/core/editor/seqMessage'
import {
  createEmptyDocument,
  isLinker,
  type DocumentData,
  type ElementInstance,
  type LinkerInstance,
} from '@/types'
import type { AnchorSide, TemplateLinkSpec, TemplateNodeSpec, TemplateSpec } from './types'

const SIDE_DIR: Record<AnchorSide, 1 | 2 | 3 | 4> = { top: 1, right: 2, bottom: 3, left: 4 }

/** 时序消息标签默认上抬距离（避免压在消息线上） */
const SEQ_LABEL_NORMAL = 14

type RectGetter = (id: string) => ShapeRect | null

function applyNodeSpec(inst: ElementInstance, node: TemplateNodeSpec, fallbackZ: number): void {
  if (node.w != null) inst.props.w = node.w
  if (node.h != null) inst.props.h = node.h
  inst.props.zindex = node.z ?? fallbackZ
  if (node.fill) inst.fillStyle = { type: 'solid', color: node.fill }
  if (node.textColor) inst.fontStyle.color = node.textColor
  if (node.fontSize != null) inst.fontStyle.size = node.fontSize
  if (node.bold != null) inst.fontStyle.bold = node.bold
  if (node.laneCount != null) {
    Object.assign(
      inst,
      buildSwimlaneUpdate(inst, {
        laneCount: node.laneCount,
        ...(node.laneColors ? { laneColors: node.laneColors } : {}),
        ...(node.laneHeadColors ? { laneHeadColors: node.laneHeadColors } : {}),
        ...(node.titleColor ? { titleColor: node.titleColor } : {}),
      }),
    )
  }
  if (node.text != null && inst.textBlock[0]) inst.textBlock[0].text = translateTitle(node.text)
  node.texts?.forEach((text, i) => {
    if (inst.textBlock[i]) inst.textBlock[i].text = translateTitle(text)
  })
}

/** 端点落点：优先取请求方位的锚点，缺省退最近锚点，无锚点图形按朝向取边点 */
function resolveEndpoint(
  el: ElementInstance,
  side: AnchorSide | undefined,
  other: ElementInstance,
): { x: number; y: number; angle: number } {
  const anchors = getAnchorPoints(el)
  if (side) {
    const dir = SIDE_DIR[side]
    const hit = anchors.find((a) => getAngleDir(a.angle) === dir)
    if (hit) return hit
  }
  const cx = other.props.x + other.props.w / 2
  const cy = other.props.y + other.props.h / 2
  let best: { x: number; y: number; angle: number } | null = null
  let bestDist = Infinity
  for (const a of anchors) {
    const dist = measureDistance(a, { x: cx, y: cy })
    if (dist < bestDist) {
      bestDist = dist
      best = a
    }
  }
  if (best) return best
  const { x, y, w, h } = el.props
  const px = Math.min(Math.max(cx, x), x + w)
  const py = Math.min(Math.max(cy, y), y + h)
  return { x: px, y: py, angle: normAngle(Math.atan2(y + h / 2 - py, x + w / 2 - px)) }
}

function applyLinkStyle(lk: LinkerInstance, link: TemplateLinkSpec): void {
  if (link.type) lk.linkerType = link.type
  if (link.dashed) lk.lineStyle.lineStyle = 'dashed'
  if (link.beginArrow) lk.lineStyle.beginArrowStyle = link.beginArrow
  if (link.endArrow) lk.lineStyle.endArrowStyle = link.endArrow
}

function applyLinkText(lk: LinkerInstance, link: TemplateLinkSpec, defaultNormal?: number): void {
  if (link.text) lk.text = translateTitle(link.text)
  const offset =
    link.textOffset ?? (link.text && defaultNormal != null ? { t: 0.5, normal: defaultNormal } : undefined)
  if (offset) lk.textOffset = offset
}

function buildSeqLinker(
  link: TemplateLinkSpec,
  a: ElementInstance,
  b: ElementInstance,
  zindex: number,
): LinkerInstance {
  const seq = link.seq!
  const y = seq.y

  if (link.from === link.to) {
    // 自消息回环：固定点集 + manualRoute，激活条移动时整体平移
    const dir = seq.fromDir === 1 ? 1 : -1
    const edge = barEdgeX(a.props, dir)
    const lk = createLinkerInstance(
      { id: a.id, x: edge, y, angle: dir === 1 ? 0 : Math.PI },
      { id: a.id, x: edge, y: y + SEQ_LOOP_H, angle: dir === 1 ? Math.PI : 0 },
      zindex,
    )
    applyLinkStyle(lk, link)
    lk.linkerType = 'broken'
    lk.seq = { y, fromDir: dir, toDir: dir, loopW: SEQ_LOOP_W, loopH: SEQ_LOOP_H }
    lk.points = selfLoopPoints(a.props, dir, y, SEQ_LOOP_W, SEQ_LOOP_H)
    lk.manualRoute = true
    applyLinkText(lk, link, SEQ_LABEL_NORMAL)
    return lk
  }

  const fx = barEdgeX(a.props, seq.fromDir)
  const tx = barEdgeX(b.props, seq.toDir)
  const lk = createLinkerInstance(
    { id: a.id, x: fx, y, angle: seq.fromDir === 1 ? 0 : Math.PI },
    { id: b.id, x: tx, y, angle: seq.toDir === 1 ? 0 : Math.PI },
    zindex,
  )
  applyLinkStyle(lk, link)
  lk.linkerType = 'line'
  lk.seq = { y, fromDir: seq.fromDir, toDir: seq.toDir }
  lk.points = []
  // 标签上抬：右向左的消息法向量与左向右相反
  applyLinkText(lk, link, tx >= fx ? SEQ_LABEL_NORMAL : -SEQ_LABEL_NORMAL)
  return lk
}

function buildLinker(
  link: TemplateLinkSpec,
  a: ElementInstance,
  b: ElementInstance,
  rectOf: RectGetter,
  zindex: number,
): LinkerInstance {
  if (link.seq) return buildSeqLinker(link, a, b, zindex)
  const epA = resolveEndpoint(a, link.fromSide, b)
  const epB = resolveEndpoint(b, link.toSide, a)
  const lk = createLinkerInstance(
    { id: a.id, x: epA.x, y: epA.y, angle: epA.angle },
    { id: b.id, x: epB.x, y: epB.y, angle: epB.angle },
    zindex,
  )
  applyLinkStyle(lk, link)
  lk.points = getLinkerPoints(lk, rectOf)
  applyLinkText(lk, link)
  return lk
}

/**
 * 按 spec 构建完整文档（元素 ID 全新生成；可直接写入画布/存储）
 */
export function buildTemplateDocument(spec: TemplateSpec): DocumentData {
  const doc = createEmptyDocument(translateTitle(spec.title))
  doc.page = { ...doc.page, width: spec.page.width, height: spec.page.height }

  const elements: Record<string, ElementInstance | LinkerInstance> = {}
  const bySpecId: Record<string, ElementInstance> = {}

  spec.nodes.forEach((node, i) => {
    const inst = shapeRegistry.createElement(node.shape, node.x, node.y)
    if (!inst) throw new Error(`模板 ${spec.id}: 未知形状 "${node.shape}"`)
    applyNodeSpec(inst, node, i + 1)
    elements[inst.id] = inst
    bySpecId[node.id] = inst
  })

  const rectOf: RectGetter = (id) => {
    const el = elements[id]
    if (!el || isLinker(el)) return null
    return { x: el.props.x, y: el.props.y, w: el.props.w, h: el.props.h }
  }

  let z = spec.nodes.length + 1
  for (const link of spec.links) {
    const a = bySpecId[link.from]
    const b = bySpecId[link.to]
    if (!a || !b) {
      throw new Error(`模板 ${spec.id}: 连线端点 "${link.from}" → "${link.to}" 不存在`)
    }
    const lk = buildLinker(link, a, b, rectOf, z++)
    elements[lk.id] = lk
  }

  doc.elements = elements
  return doc
}