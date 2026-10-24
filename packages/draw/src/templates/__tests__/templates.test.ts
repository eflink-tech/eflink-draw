import { describe, expect, it } from 'vitest'
import '@/core/schema/shapes' // 触发图形注册副作用
import { isLinker, type DocumentData, type ElementInstance, type LinkerInstance } from '@/types'
import { barEdgeX, SEQ_LOOP_W } from '@/core/editor/seqMessage'
import {
  DRAW_TEMPLATES,
  TEMPLATE_CATEGORIES,
  buildTemplateDocument,
  buildTemplateThumbnail,
  getTemplateById,
  getTemplatesByCategory,
} from '../index'
import type { TemplateSpec } from '../types'

function shapesOf(doc: DocumentData): ElementInstance[] {
  return Object.values(doc.elements).filter((e): e is ElementInstance => !isLinker(e))
}

function linkersOf(doc: DocumentData): LinkerInstance[] {
  return Object.values(doc.elements).filter(isLinker)
}

function shapeByName(doc: DocumentData, name: string): ElementInstance {
  const hit = shapesOf(doc).find((e) => e.name === name)
  if (!hit) throw new Error(`文档中未找到形状 ${name}`)
  return hit
}

// ═══════════════════════════════════════════
// 全量通用校验（M2 新增模板自动纳入）
// ═══════════════════════════════════════════

for (const spec of DRAW_TEMPLATES) {
  describe(`模板构建：${spec.id}`, () => {
    const doc = buildTemplateDocument(spec)
    const shapes = shapesOf(doc)
    const linkers = linkersOf(doc)

    it('元素数量与 spec 一致，ID 唯一且可按 ID 索引', () => {
      expect(shapes).toHaveLength(spec.nodes.length)
      expect(linkers).toHaveLength(spec.links.length)
      const all = Object.values(doc.elements)
      expect(new Set(all.map((e) => e.id)).size).toBe(all.length)
      for (const el of all) expect(doc.elements[el.id]).toBe(el)
    })

    it('节点按声明顺序创建且形状/尺寸有效', () => {
      spec.nodes.forEach((node, i) => {
        expect(shapes[i].name).toBe(node.shape)
        expect(shapes[i].props.w).toBeGreaterThan(0)
        expect(shapes[i].props.h).toBeGreaterThan(0)
        expect(Number.isFinite(shapes[i].props.x)).toBe(true)
        expect(Number.isFinite(shapes[i].props.y)).toBe(true)
      })
    })

    it('页面尺寸对齐 spec 且所有连线端点/折点不越界', () => {
      expect(doc.page.width).toBe(spec.page.width)
      expect(doc.page.height).toBe(spec.page.height)
      for (const l of linkers) {
        for (const p of [l.from, l.to, ...l.points]) {
          expect(p.x).toBeGreaterThanOrEqual(0)
          expect(p.x).toBeLessThanOrEqual(spec.page.width)
          expect(p.y).toBeGreaterThanOrEqual(0)
          expect(p.y).toBeLessThanOrEqual(spec.page.height)
        }
      }
    })

    it('连线两端均附着到模板内图形', () => {
      const ids = new Set(shapes.map((s) => s.id))
      for (const l of linkers) {
        expect(l.from.id).not.toBeNull()
        expect(l.to.id).not.toBeNull()
        expect(ids.has(l.from.id!)).toBe(true)
        expect(ids.has(l.to.id!)).toBe(true)
      }
    })

    it('文本块覆盖按索引生效', () => {
      spec.nodes.forEach((node) => {
        if (node.text != null) {
          const inst = shapes[spec.nodes.indexOf(node)]
          expect(inst.textBlock[0]?.text).toBe(node.text)
        }
      })
    })
  })
}

// ═══════════════════════════════════════════
// 单模板特征校验
// ═══════════════════════════════════════════

describe('基础流程图', () => {
  const doc = buildTemplateDocument(getTemplateById('basic-flow')!)

  it('起止为斜胶囊且带底色，判定分支含「是/否」标注', () => {
    const start = shapeByName(doc, 'terminator')
    expect(start.fillStyle).toEqual({ type: 'solid', color: '213,232,212' })
    const texts = linkersOf(doc).map((l) => l.text)
    expect(texts).toContain('是')
    expect(texts).toContain('否')
  })

  it('「否」分支经修改需求回连到需求提出（存在回环连线）', () => {
    const shapes = shapesOf(doc)
    const adjust = shapes.find((s) => s.textBlock[0]?.text === '修改需求')!
    const req = shapes.find((s) => s.textBlock[0]?.text === '需求提出')!
    const back = linkersOf(doc).find((l) => l.from.id === adjust.id && l.to.id === req.id)
    expect(back).toBeTruthy()
    expect(back!.points.length).toBeGreaterThan(0)
  })
})

describe('泳道流程图', () => {
  const doc = buildTemplateDocument(getTemplateById('swimlane')!)

  it('4 泳道布局 + 标题/泳道头文本与配色', () => {
    const lane = shapeByName(doc, 'swimlaneV')
    expect(lane.laneCount).toBe(4)
    expect(lane.textBlock.map((b) => b.text)).toEqual([
      '采购付款流程',
      '申请人',
      '主管',
      '财务',
      '系统',
    ])
    // 泳道体不得上色：不透明填充会遮住泳道内连线（连线层在图形层下方）
    expect(lane.laneColors).toBeUndefined()
    expect(lane.laneHeadColors).toHaveLength(4)
    expect(lane.titleColor).toBe('223,235,250')
  })

  it('流程框位于泳道内容区内（不压标题带与泳道头行）', () => {
    const lane = shapeByName(doc, 'swimlaneV')
    for (const box of shapesOf(doc).filter((s) => s.name === 'process')) {
      expect(box.props.y).toBeGreaterThanOrEqual(lane.props.y + 80)
      expect(box.props.y + box.props.h).toBeLessThanOrEqual(lane.props.y + lane.props.h)
    }
  })
})

describe('BPMN 业务流程', () => {
  const doc = buildTemplateDocument(getTemplateById('bpmn-process')!)

  it('含开始/结束事件、任务与网关，网关文本位于图形下方', () => {
    expect(shapeByName(doc, 'startEvent')).toBeTruthy()
    expect(shapeByName(doc, 'endEvent')).toBeTruthy()
    expect(shapesOf(doc).filter((s) => s.name === 'task')).toHaveLength(4)
    const gw = shapeByName(doc, 'bpmnGateway')
    expect(gw.textBlock[0].text).toBe('同意？')
    expect(gw.textBlock[0].position.y).toBe('h')
  })

  it('驳回分支绕行回主干结束事件（折线含肘点）', () => {
    const reject = shapesOf(doc).find((s) => s.textBlock[0]?.text === '驳回并说明原因')!
    const end = shapeByName(doc, 'endEvent')
    const back = linkersOf(doc).find((l) => l.from.id === reject.id && l.to.id === end.id)!
    expect(back.points.length).toBeGreaterThanOrEqual(1)
    // 肘点：x 取驳回任务中轴，y 取结束事件中轴
    expect(back.points[0].x).toBe(reject.props.x + reject.props.w / 2)
    expect(back.points[0].y).toBe(end.props.y + end.props.h / 2)
  })
})

describe('UML 时序图', () => {
  const doc = buildTemplateDocument(getTemplateById('uml-sequence')!)

  it('消息端点落在激活条缘（与 barEdgeX 同口径），y 恒等于消息高度', () => {
    const seqLinkers = linkersOf(doc).filter((l) => l.seq)
    expect(seqLinkers).toHaveLength(6)
    for (const l of seqLinkers) {
      const src = doc.elements[l.from.id!] as ElementInstance
      const dst = doc.elements[l.to.id!] as ElementInstance
      expect(l.from.x).toBeCloseTo(barEdgeX(src.props, l.seq!.fromDir), 5)
      expect(l.to.x).toBeCloseTo(barEdgeX(dst.props, l.seq!.toDir), 5)
      expect(l.from.y).toBe(l.seq!.y)
      expect(l.to.y).toBe(l.seq!.y)
      expect(l.linkerType).toBe('line')
    }
  })

  it('方向 ±1 的消息必须附着激活条，方向 0 附着生命线中轴', () => {
    for (const l of linkersOf(doc).filter((x) => x.seq)) {
      for (const [epId, dir] of [
        [l.from.id!, l.seq!.fromDir],
        [l.to.id!, l.seq!.toDir],
      ] as const) {
        const node = doc.elements[epId]
        if (dir === 0) {
          expect(['sequenceLifeLine', 'sequenceActorLifeLine']).toContain(node.name)
        } else {
          expect(node.name).toBe('sequenceActivation')
        }
      }
    }
  })

  it('返回消息为虚线开箭头，激活条覆盖全部消息高度', () => {
    const seqLinkers = linkersOf(doc).filter((l) => l.seq)
    const returns = seqLinkers.filter((l) => l.lineStyle.lineStyle === 'dashed')
    expect(returns).toHaveLength(3)
    for (const r of returns) expect(r.lineStyle.endArrowStyle).toBe('normal')

    const acts = [
      doc.elements[seqLinkers.find((l) => l.text === '提交登录请求')!.to.id!] as ElementInstance,
      doc.elements[seqLinkers.find((l) => l.text === '查询用户信息')!.from.id!] as ElementInstance,
    ]
    for (const act of acts) expect(act.name).toBe('sequenceActivation')
    for (const l of seqLinkers) {
      const act = acts.find((a) => a.id === l.from.id || a.id === l.to.id)
      if (act) {
        expect(l.seq!.y).toBeGreaterThanOrEqual(act.props.y)
        expect(l.seq!.y).toBeLessThanOrEqual(act.props.y + act.props.h)
      }
    }
  })

  it('消息标签偏移使文字位于线上方（不压线）', () => {
    for (const l of linkersOf(doc).filter((x) => x.seq)) {
      expect(l.textOffset).toBeTruthy()
      expect(l.textOffset!.t).toBe(0.5)
      expect(Math.abs(l.textOffset!.normal)).toBe(14)
    }
  })
})

describe('状态转换图', () => {
  const doc = buildTemplateDocument(getTemplateById('state-transition')!)

  it('5 个状态均带 entry 分区文本，起止为 UML 开始/结束', () => {
    const states = shapesOf(doc).filter((s) => s.name === 'umlState')
    expect(states).toHaveLength(5)
    for (const s of states) expect(s.textBlock[1].text).toContain('entry /')
    expect(shapeByName(doc, 'umlStart')).toBeTruthy()
    expect(shapeByName(doc, 'umlEnd')).toBeTruthy()
  })

  it('「交易关闭」经右侧绕行汇入结束状态（L 形折线）', () => {
    const closed = shapesOf(doc).find((s) => s.textBlock[0]?.text === '交易关闭')!
    const end = shapeByName(doc, 'umlEnd')
    const back = linkersOf(doc).find((l) => l.from.id === closed.id && l.to.id === end.id)!
    expect(back.points.length).toBeGreaterThanOrEqual(1)
    // 肘点：x 取交易关闭中轴（位于结束事件右侧），y 取结束事件中轴
    expect(back.points[0].x).toBe(closed.props.x + closed.props.w / 2)
    expect(back.points[0].y).toBe(end.props.y + end.props.h / 2)
    expect(back.points[0].x).toBeGreaterThan(end.props.x + end.props.w)
  })

  it('迁移标注覆盖支付/发货/收货/关闭条件', () => {
    const texts = linkersOf(doc).map((l) => l.text)
    expect(texts).toEqual(expect.arrayContaining(['支付成功', '商家发货', '确认收货', '超时未支付', '申请退款']))
  })
})

// ═══════════════════════════════════════════
// 模板库全量：18 类覆盖与缩略图
// ═══════════════════════════════════════════

describe('模板库注册表', () => {
  it('共 18 个模板，ID 唯一，顺序对齐产品编号', () => {
    expect(DRAW_TEMPLATES).toHaveLength(18)
    expect(new Set(DRAW_TEMPLATES.map((t) => t.id)).size).toBe(18)
    expect(DRAW_TEMPLATES.map((t) => t.id)).toEqual([
      'basic-flow',
      'swimlane',
      'bpmn-process',
      'decision-tree',
      'system-flow',
      'dfd-flow',
      'uml-activity',
      'uml-sequence',
      'linear-steps',
      'loop-flow',
      'parallel-flow',
      'approval-flow',
      'service-ticket',
      'order-process',
      'cicd-flow',
      'exception-flow',
      'vsm-flow',
      'state-transition',
    ])
  })

  it('每个分类都有模板，卡片元信息完整', () => {
    for (const c of TEMPLATE_CATEGORIES) {
      expect(getTemplatesByCategory(c.id).length).toBeGreaterThan(0)
    }
    for (const t of DRAW_TEMPLATES) {
      expect(t.title.length).toBeGreaterThan(0)
      expect(t.description.length).toBeGreaterThan(0)
      expect(t.keywords.length).toBeGreaterThan(0)
      expect(t.page.width).toBeGreaterThan(0)
      expect(t.page.height).toBeGreaterThan(0)
    }
  })

  it('缩略图为纯矢量 SVG（无位图），viewBox 与页面尺寸一致', () => {
    for (const t of DRAW_TEMPLATES) {
      const svg = buildTemplateThumbnail(t)
      expect(svg.startsWith('<svg')).toBe(true)
      expect(svg).toContain(`viewBox="0 0 ${t.page.width} ${t.page.height}"`)
      expect(svg).not.toContain('<image')
      expect(svg).not.toContain('data:')
      // 至少包含图元；有连线的模板必须渲染出连线
      expect(svg).toMatch(/<(rect|polygon|ellipse|polyline)/)
      if (t.links.length > 0) expect(svg).toContain('<polyline')
    }
  })
})

// ═══════════════════════════════════════════
// M2 模板特征校验
// ═══════════════════════════════════════════

describe('决策流程图', () => {
  const doc = buildTemplateDocument(getTemplateById('decision-tree')!)

  it('两级判断 + 三路汇合到打款', () => {
    expect(shapesOf(doc).filter((s) => s.name === 'decision')).toHaveLength(2)
    const pay = shapesOf(doc).find((s) => s.textBlock[0]?.text === '财务打款')!
    const incoming = linkersOf(doc).filter((l) => l.to.id === pay.id)
    expect(incoming).toHaveLength(3)
    const sources = incoming.map((l) => (doc.elements[l.from.id!] as ElementInstance).textBlock[0].text)
    expect(sources).toEqual(expect.arrayContaining(['财务复核', '主管审批', '自动批准']))
  })
})

describe('线性步骤流程图', () => {
  const doc = buildTemplateDocument(getTemplateById('linear-steps')!)

  it('6 个箭头块首尾相接、同高排布（无冗余连线）', () => {
    const arrows = shapesOf(doc).filter((s) => s.name === 'singleRightArrow').sort((a, b) => a.props.x - b.props.x)
    expect(arrows).toHaveLength(6)
    expect(new Set(arrows.map((a) => a.props.y)).size).toBe(1)
    for (let i = 1; i < arrows.length; i++) {
      expect(arrows[i].props.x).toBe(arrows[i - 1].props.x + arrows[i - 1].props.w)
    }
    expect(linkersOf(doc)).toHaveLength(0)
  })
})

describe('循环流程图', () => {
  const doc = buildTemplateDocument(getTemplateById('loop-flow')!)

  it('校验失败经修正后回连到读取数据（重试闭环）', () => {
    const read = shapesOf(doc).find((s) => s.textBlock[0]?.text === '读取数据')!
    const fix = shapesOf(doc).find((s) => s.textBlock[0]?.text === '修正数据错误')!
    const retry = linkersOf(doc).find((l) => l.from.id === fix.id && l.to.id === read.id)
    expect(retry?.text).toBe('重试')
    expect(retry!.points.length).toBeGreaterThan(0)
  })
})

describe('并行流程图', () => {
  const doc = buildTemplateDocument(getTemplateById('parallel-flow')!)

  it('两根同步条分叉汇合，分支连线各含折点', () => {
    const bars = shapesOf(doc).filter((s) => s.name === 'Synchronization')
    expect(bars).toHaveLength(2)
    for (const bar of bars) {
      expect(linkersOf(doc).filter((l) => l.from.id === bar.id).length).toBe(bar === bars[0] ? 2 : 1)
    }
    const branch = linkersOf(doc).filter((l) => l.points.length > 0)
    expect(branch.length).toBeGreaterThanOrEqual(4)
  })
})

describe('审批流程图', () => {
  const doc = buildTemplateDocument(getTemplateById('approval-flow')!)

  it('3 泳道 + 预算判断双分支，泳道体不上色', () => {
    const lane = shapeByName(doc, 'swimlaneV')
    expect(lane.laneCount).toBe(3)
    expect(lane.laneColors).toBeUndefined()
    expect(lane.textBlock.map((b) => b.text)).toEqual(['费用报销审批', '申请人', '部门主管', '财务'])
    const flags = linkersOf(doc).map((l) => l.text)
    expect(flags).toContain('超预算')
    expect(flags).toContain('未超预算')
  })
})

describe('系统流程图', () => {
  const doc = buildTemplateDocument(getTemplateById('system-flow')!)

  it('缓存与数据库为圆柱形，链路自上而下贯通', () => {
    expect(shapesOf(doc).filter((s) => s.name === 'directData')).toHaveLength(2)
    const chain = ['客户端请求', 'API 网关', '认证鉴权', '业务服务']
    let prev: ElementInstance | null = null
    for (const text of chain) {
      const node = shapesOf(doc).find((s) => s.textBlock[0]?.text === text)!
      if (prev) {
        expect(linkersOf(doc).some((l) => l.from.id === prev!.id && l.to.id === node.id)).toBe(true)
      }
      prev = node
    }
  })
})

describe('数据流图(DFD)', () => {
  const doc = buildTemplateDocument(getTemplateById('dfd-flow')!)

  it('外部实体 + 加工圆形 + 两个数据存储', () => {
    expect(shapesOf(doc).filter((s) => s.name === 'rectangle')).toHaveLength(2)
    expect(shapeByName(doc, 'round')).toBeTruthy()
    expect(shapesOf(doc).filter((s) => s.name === 'storedData')).toHaveLength(2)
    expect(linkersOf(doc).map((l) => l.text)).toEqual(
      expect.arrayContaining(['订单', '查询商品', '写入订单', '读取订单']),
    )
  })
})

describe('UML 活动图', () => {
  const doc = buildTemplateDocument(getTemplateById('uml-activity')!)

  it('起止符号 + 同步条分叉汇合', () => {
    expect(shapeByName(doc, 'umlStart')).toBeTruthy()
    expect(shapeByName(doc, 'umlEnd')).toBeTruthy()
    expect(shapesOf(doc).filter((s) => s.name === 'Synchronization')).toHaveLength(2)
    expect(shapesOf(doc).filter((s) => s.name === 'roundRectangle')).toHaveLength(5)
  })
})

describe('服务工单流程图', () => {
  const doc = buildTemplateDocument(getTemplateById('service-ticket')!)

  it('未解决时升级专家并回连处理环节', () => {
    const handle = shapesOf(doc).find((s) => s.textBlock[0]?.text === '工程师处理')!
    const esc = shapesOf(doc).find((s) => s.textBlock[0]?.text === '升级专家支持')!
    const back = linkersOf(doc).find((l) => l.from.id === esc.id && l.to.id === handle.id)
    expect(back).toBeTruthy()
    expect(back!.points.length).toBeGreaterThan(0)
  })
})

describe('订单处理流程图', () => {
  const doc = buildTemplateDocument(getTemplateById('order-process')!)

  it('支付失败进入取消/退款/关闭支线', () => {
    const cancel = shapesOf(doc).find((s) => s.textBlock[0]?.text === '取消订单')!
    const refund = shapesOf(doc).find((s) => s.textBlock[0]?.text === '退款处理')!
    const closed = shapesOf(doc).find((s) => s.textBlock[0]?.text === '订单关闭')!
    expect(linkersOf(doc).some((l) => l.from.id === cancel.id && l.to.id === refund.id)).toBe(true)
    expect(linkersOf(doc).some((l) => l.from.id === refund.id && l.to.id === closed.id)).toBe(true)
  })
})

describe('软件开发与部署流程图', () => {
  const doc = buildTemplateDocument(getTemplateById('cicd-flow')!)

  it('测试失败与验收未通过均回到修复缺陷', () => {
    const fix = shapesOf(doc).find((s) => s.textBlock[0]?.text === '修复缺陷')!
    expect(linkersOf(doc).filter((l) => l.to.id === fix.id)).toHaveLength(2)
    expect(linkersOf(doc).map((l) => l.text)).toEqual(
      expect.arrayContaining(['失败', '重提', '未通过']),
    )
  })
})

describe('异常处理流程图', () => {
  const doc = buildTemplateDocument(getTemplateById('exception-flow')!)

  it('捕获异常后事务回滚并重试处理', () => {
    const rollback = shapesOf(doc).find((s) => s.textBlock[0]?.text === '事务回滚')!
    const process = shapesOf(doc).find((s) => s.textBlock[0]?.text === '处理数据')!
    const retry = linkersOf(doc).find((l) => l.from.id === rollback.id && l.to.id === process.id)
    expect(retry?.text).toBe('回滚后重试')
  })
})

describe('价值流图(VSM)', () => {
  const doc = buildTemplateDocument(getTemplateById('vsm-flow')!)

  it('3 个库存三角 + 8 段时间轴，信息流为虚线', () => {
    expect(shapesOf(doc).filter((s) => s.name === 'triangle')).toHaveLength(3)
    expect(shapesOf(doc).filter((s) => s.name === 'rectangle' && s.props.h === 26)).toHaveLength(8)
    const dashed = linkersOf(doc).filter((l) => l.lineStyle.lineStyle === 'dashed')
    expect(dashed).toHaveLength(3)
    // 工序间物料流沿同一水平线穿过库存三角后方（路由点共线在 y=515）
    const flows = linkersOf(doc).filter((l) => l.from.y === 515 && l.to.y === 515)
    expect(flows).toHaveLength(3)
    for (const l of flows) for (const p of l.points) expect(p.y).toBeCloseTo(515, 5)
  })
})

// ═══════════════════════════════════════════
// 时序自消息回环（合成 spec）
// ═══════════════════════════════════════════

describe('时序自消息回环', () => {
  it('from === to 时生成 loopW/H 参数、回环点集与 manualRoute', () => {
    const spec: TemplateSpec = {
      id: 'test-self-message',
      title: '自消息',
      category: 'uml',
      description: '',
      keywords: [],
      page: { width: 600, height: 400 },
      nodes: [
        { id: 'l', shape: 'sequenceLifeLine', x: 100, y: 20, w: 90, h: 300 },
        { id: 'a', shape: 'sequenceActivation', x: 130, y: 100, h: 200 },
      ],
      links: [{ from: 'a', to: 'a', text: '重试', seq: { y: 150, fromDir: 1, toDir: 1 } }],
    }
    const doc = buildTemplateDocument(spec)
    const lk = linkersOf(doc)[0]
    expect(lk.seq?.loopW).toBe(SEQ_LOOP_W)
    expect(lk.seq?.loopH).toBe(24)
    expect(lk.points).toHaveLength(2)
    expect(lk.manualRoute).toBe(true)
    // 回环点位于激活条右缘外侧
    const act = shapeByName(doc, 'sequenceActivation')
    expect(lk.points[0].x).toBeGreaterThan(act.props.x + act.props.w)
    expect(lk.linkerType).toBe('broken')
  })
})