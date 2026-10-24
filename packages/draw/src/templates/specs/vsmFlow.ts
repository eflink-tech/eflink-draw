import type { TemplateSpec } from '../types'

/** 价值流图(VSM)：信息流 + 物料流 + 库存三角 + 增值/等待时间轴 */
export const vsmFlowTemplate: TemplateSpec = {
  id: 'vsm-flow',
  title: '价值流图(VSM)',
  category: 'lean',
  description: '精益价值流：物料流与信息流并行，量化增值时间与等待时间',
  keywords: ['价值流', 'VSM', '精益', '库存', '节拍', '增值'],
  page: { width: 1400, height: 800 },
  nodes: [
    // ── 信息流两端与生产计划 ──
    { id: 'supplier', shape: 'rectangle', text: '供应商', x: 110, y: 280, w: 170, h: 58, fill: '225,232,240' },
    { id: 'plan', shape: 'rectangle', text: '生产计划', x: 615, y: 180, w: 170, h: 70, fill: '255,242,204' },
    { id: 'customer', shape: 'rectangle', text: '客户', x: 1120, y: 280, w: 170, h: 58, fill: '225,232,240' },
    // ── 物料流：4 道工序 ──
    { id: 'p1', shape: 'process', text: '冲压', x: 200, y: 480, w: 170, h: 70, fill: '218,232,252' },
    { id: 'p2', shape: 'process', text: '焊接', x: 500, y: 480, w: 170, h: 70, fill: '218,232,252' },
    { id: 'p3', shape: 'process', text: '涂装', x: 800, y: 480, w: 170, h: 70, fill: '218,232,252' },
    { id: 'p4', shape: 'process', text: '总装', x: 1100, y: 480, w: 170, h: 70, fill: '218,232,252' },
    // ── 工序间库存（物料线从其上方穿过） ──
    { id: 'inv1', shape: 'triangle', x: 413, y: 493, w: 44, h: 44, fill: '255,230,204' },
    { id: 'inv2', shape: 'triangle', x: 713, y: 493, w: 44, h: 44, fill: '255,230,204' },
    { id: 'inv3', shape: 'triangle', x: 1013, y: 493, w: 44, h: 44, fill: '255,230,204' },
    // ── 时间轴：绿色=增值作业，红色=等待 ──
    { id: 't0', shape: 'rectangle', text: '4天', x: 110, y: 620, w: 90, h: 26, fill: '248,206,204', fontSize: 14 },
    { id: 't1', shape: 'rectangle', text: '45秒', x: 200, y: 620, w: 170, h: 26, fill: '213,232,212', fontSize: 14 },
    { id: 't2', shape: 'rectangle', text: '2天', x: 370, y: 620, w: 130, h: 26, fill: '248,206,204', fontSize: 14 },
    { id: 't3', shape: 'rectangle', text: '60秒', x: 500, y: 620, w: 170, h: 26, fill: '213,232,212', fontSize: 14 },
    { id: 't4', shape: 'rectangle', text: '1天', x: 670, y: 620, w: 130, h: 26, fill: '248,206,204', fontSize: 14 },
    { id: 't5', shape: 'rectangle', text: '50秒', x: 800, y: 620, w: 170, h: 26, fill: '213,232,212', fontSize: 14 },
    { id: 't6', shape: 'rectangle', text: '3天', x: 970, y: 620, w: 130, h: 26, fill: '248,206,204', fontSize: 14 },
    { id: 't7', shape: 'rectangle', text: '70秒', x: 1100, y: 620, w: 170, h: 26, fill: '213,232,212', fontSize: 14 },
    { id: 'summary', shape: 'text', text: '交付周期 10 天 · 增值时间 3.75 分钟', x: 350, y: 690, w: 700, h: 30, fontSize: 18, bold: true },
  ],
  links: [
    // 信息流（虚线）：客户需求 → 生产计划 → 供应商 / 首道工序
    { from: 'customer', to: 'plan', fromSide: 'left', toSide: 'right', dashed: true, text: '需求预测', textOffset: { t: 0.5, normal: 16 } },
    { from: 'plan', to: 'supplier', fromSide: 'left', toSide: 'right', dashed: true, text: '采购订单', textOffset: { t: 0.5, normal: 16 } },
    { from: 'plan', to: 'p1', fromSide: 'bottom', toSide: 'top', dashed: true, text: '生产排程', textOffset: { t: 0.5, normal: -14 } },
    // 物料流（实线）：供应商 → 冲压 → 焊接 → 涂装 → 总装 → 客户
    { from: 'supplier', to: 'p1', fromSide: 'bottom', toSide: 'left', text: '原材料', textOffset: { t: 0.5, normal: 16 } },
    { from: 'p1', to: 'p2', fromSide: 'right', toSide: 'left' },
    { from: 'p2', to: 'p3', fromSide: 'right', toSide: 'left' },
    { from: 'p3', to: 'p4', fromSide: 'right', toSide: 'left' },
    { from: 'p4', to: 'customer', fromSide: 'right', toSide: 'bottom', text: '成品', textOffset: { t: 0.5, normal: 16 } },
  ],
}