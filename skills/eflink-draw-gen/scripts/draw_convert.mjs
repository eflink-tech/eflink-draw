#!/usr/bin/env node
/**
 * eflink-draw 图形生成转换器（DrawSpec JSON → DocumentData）
 * 移植自 eflink-draw 编辑器源码，保证与编辑器几何/行为一致（改动需同步）：
 *   - buildDraw/spec 格式基准：eflink-frontend/src/data/templates/helpers.ts
 *   - 连线正交路由：eflink-draw/packages/draw/src/core/editor/linker.ts（brokenBothAttached，STUB_R=30）
 *   - 泳道 path/textBlock：eflink-draw/packages/draw/src/core/editor/swimlane.ts
 *   - 原生形状 schema：eflink-draw/packages/draw/src/core/schema/shapes/*.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DRAW_SIZE = {
  process: { w: 150, h: 56 },
  decision: { w: 130, h: 80 },
  terminator: { w: 130, h: 48 },
  rectangle: { w: 180, h: 52 },
  round: { w: 72, h: 72 },
  document: { w: 140, h: 64 },
  data: { w: 150, h: 56 },
  predefinedProcess: { w: 160, h: 56 },
  storedData: { w: 140, h: 64 },
};
const DRAW_FLOW_NAMES = new Set(['process', 'decision', 'terminator', 'document', 'data', 'predefinedProcess', 'storedData']);
const DRAW_PATH = {
  process: [[{ action: 'move', x: 0, y: 0 }, { action: 'line', x: 'w', y: 0 }, { action: 'line', x: 'w', y: 'h' }, { action: 'line', x: 0, y: 'h' }, { action: 'close' }]],
  rectangle: [[{ action: 'move', x: 0, y: 0 }, { action: 'line', x: 'w', y: 0 }, { action: 'line', x: 'w', y: 'h' }, { action: 'line', x: 0, y: 'h' }, { action: 'close' }]],
  decision: [[{ action: 'move', x: 0, y: 'h/2' }, { action: 'line', x: 'w/2', y: 0 }, { action: 'line', x: 'w', y: 'h/2' }, { action: 'line', x: 'w/2', y: 'h' }, { action: 'line', x: 0, y: 'h/2' }, { action: 'close' }]],
  terminator: [[{ action: 'move', x: 'Math.min(w,h)/3', y: 0 }, { action: 'line', x: 'w-Math.min(w,h)/3', y: 0 }, { action: 'curve', x1: 'w+Math.min(w,h)/3/3', y1: 0, x2: 'w+Math.min(w,h)/3/3', y2: 'h', x: 'w-Math.min(w,h)/3', y: 'h' }, { action: 'line', x: 'Math.min(w,h)/3', y: 'h' }, { action: 'curve', x1: '-Math.min(w,h)/3/3', y1: 'h', x2: '-Math.min(w,h)/3/3', y2: 0, x: 'Math.min(w,h)/3', y: 0 }, { action: 'close' }]],
  round: [[{ action: 'move', x: 'w/2', y: 0 }, { action: 'curve', x1: 'w', y1: 0, x2: 'w', y2: 'h', x: 'w/2', y: 'h' }, { action: 'curve', x1: 0, y1: 'h', x2: 0, y2: 0, x: 'w/2', y: 0 }, { action: 'close' }]],
  document: [[{ action: 'move', x: 0, y: 'h-Math.min(h/8,w/12)' }, { action: 'line', x: 0, y: 0 }, { action: 'line', x: 'w', y: 0 }, { action: 'line', x: 'w', y: 'h-Math.min(h/8,w/12)' }, { action: 'quadraticCurve', x1: 'w*0.75', y1: 'h-3*Math.min(h/8,w/12)', x: 'w*0.5', y: 'h-Math.min(h/8,w/12)' }, { action: 'quadraticCurve', x1: 'w*0.25', y1: 'h+Math.min(h/8,w/12)', x: 0, y: 'h-Math.min(h/8,w/12)' }, { action: 'close' }]],
  data: [[{ action: 'move', x: 'Math.min(h/3,w/3)', y: 0 }, { action: 'line', x: 'w', y: 0 }, { action: 'line', x: 'w-Math.min(h/3,w/3)', y: 'h' }, { action: 'line', x: 0, y: 'h' }, { action: 'line', x: 'Math.min(h/3,w/3)', y: 0 }, { action: 'close' }]],
  predefinedProcess: [[{ action: 'move', x: 0, y: 0 }, { action: 'line', x: 'w', y: 0 }, { action: 'line', x: 'w', y: 'h' }, { action: 'line', x: 0, y: 'h' }, { action: 'line', x: 0, y: 0 }, { action: 'close' }, { action: 'move', x: 'Math.min(w/6,20)', y: 0 }, { action: 'line', x: 'Math.min(w/6,20)', y: 'h' }, { action: 'move', x: 'w-Math.min(w/6,20)', y: 0 }, { action: 'line', x: 'w-Math.min(w/6,20)', y: 'h' }]],
  storedData: [[{ action: 'move', x: 'w/6', y: 0 }, { action: 'line', x: 'w', y: 0 }, { action: 'curve', x1: 'w-w/6', y1: 0, x2: 'w-w/6', y2: 'h', x: 'w', y: 'h' }, { action: 'line', x: 'w/6', y: 'h' }, { action: 'curve', x1: '-w/17', y1: 'h', x2: '-w/17', y2: 0, x: 'w/7', y: 0 }, { action: 'close' }]],
};
const rgbLuma = (rgb) => {
  const [r, g, b] = rgb.split(',').map((n) => Number(n) || 0);
  return r * 0.299 + g * 0.587 + b * 0.114;
};
// 端点角度用编辑器原生的内向角约定（见 linker.ts getAnchorPoints：指向图形中心，归一化 [0,2π)）：
// top=π/2、right=π、bottom=3π/2、left=0 —— getAngleDir 据此判向（1=上锚点 2=右 3=下 4=左）。
// 注意 helpers.ts 的 sidePoint 存的是外向角（top=-π/2），与编辑器路由不一致，此处有意不同。
const sidePoint = (box, side) => {
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  if (side === 'top') return { x: cx, y: box.y, angle: Math.PI / 2 };
  if (side === 'bottom') return { x: cx, y: box.y + box.h, angle: (3 * Math.PI) / 2 };
  if (side === 'left') return { x: box.x, y: cy, angle: 0 };
  return { x: box.x + box.w, y: cy, angle: Math.PI };
};
const inferSides = (a, b) => {
  const acx = a.x + a.w / 2, acy = a.y + a.h / 2, bcx = b.x + b.w / 2, bcy = b.y + b.h / 2;
  if (Math.abs(bcy - acy) >= Math.abs(bcx - acx)) return acy < bcy ? { from: 'bottom', to: 'top' } : { from: 'top', to: 'bottom' };
  return acx < bcx ? { from: 'right', to: 'left' } : { from: 'left', to: 'right' };
};

// ── 连线正交路由：从 eflink-draw packages/draw/src/core/editor/linker.ts 原样移植 ──
// （brokenBothAttached + getAngleDir + STUB_R，编辑器拖拽重路由用同一算法，保证存点与编辑器行为一致）
const STUB_R = 30;
function getAngleDir(angle) {
  const a = Math.PI;
  if (angle >= a / 4 && angle < (a / 4) * 3) return 1;
  if (angle >= (a / 4) * 3 && angle < (a / 4) * 5) return 2;
  if (angle >= (a / 4) * 5 && angle < (a / 4) * 7) return 3;
  return 4;
}
const rectOf = (ep, boxes) => boxes[ep.id] ?? { x: ep.x, y: ep.y, w: 0, h: 0 };
function brokenBothAttached(w, d, A, boxes, m, D, r) {
  const c = getAngleDir(w.angle ?? 0);
  const b = getAngleDir(d.angle ?? 0);
  let g, i, l;
  if ((c === 1 && b === 3) || (c === 3 && b === 1)) {
    let top, bot;
    if (w.y <= d.y) { top = w; bot = d; } else { top = d; bot = w; }
    const topRect = rectOf(top, boxes);
    if (topRect.y + topRect.h <= bot.y && bot.x >= topRect.x - r && bot.x <= topRect.x + topRect.w + r) {
      const dx = Math.abs(top.x - bot.x);
      if (dx < 2) {
        // x 几乎相同：不推中间点，直线连接
      } else if (dx <= 15) {
        A.push({ x: (top.x + bot.x) / 2, y: (top.y + bot.y) / 2 });
      } else {
        const midY = (top.y + bot.y) / 2;
        A.push({ x: top.x, y: midY }, { x: bot.x, y: midY });
        if (top !== w) A.reverse();
      }
      return;
    }
  }
  if (c === 1 && b === 1) {
    if (w.y < d.y) { g = w; i = d; l = false; } else { g = d; i = w; l = true; }
    const h = rectOf(g, boxes);
    if (i.x >= h.x - r && i.x <= h.x + h.w + r) {
      const o = i.x < h.x + h.w / 2 ? h.x - r : h.x + h.w + r;
      let n = g.y - r;
      A.push({ x: g.x, y: n }, { x: o, y: n });
      n = i.y - r;
      A.push({ x: o, y: n }, { x: i.x, y: n });
    } else {
      const n = g.y - r;
      A.push({ x: g.x, y: n }, { x: i.x, y: n });
    }
  } else if (c === 3 && b === 3) {
    if (w.y > d.y) { g = w; i = d; l = false; } else { g = d; i = w; l = true; }
    const h = rectOf(g, boxes);
    if (i.x >= h.x - r && i.x <= h.x + h.w + r) {
      const o = i.x < h.x + h.w / 2 ? h.x - r : h.x + h.w + r;
      let n = g.y + r;
      A.push({ x: g.x, y: n }, { x: o, y: n });
      n = i.y + r;
      A.push({ x: o, y: n }, { x: i.x, y: n });
    } else {
      const n = g.y + r;
      A.push({ x: g.x, y: n }, { x: i.x, y: n });
    }
  } else if (c === 2 && b === 2) {
    if (w.x > d.x) { g = w; i = d; l = false; } else { g = d; i = w; l = true; }
    const h = rectOf(g, boxes);
    if (i.y >= h.y - r && i.y <= h.y + h.h + r) {
      const o = g.x + r;
      const n = i.y < h.y + h.h / 2 ? h.y - r : h.y + h.h + r;
      A.push({ x: o, y: g.y }, { x: o, y: n });
      const o2 = i.x + r;
      A.push({ x: o2, y: n }, { x: o2, y: i.y });
    } else {
      const o = g.x + r;
      A.push({ x: o, y: g.y }, { x: o, y: i.y });
    }
  } else if (c === 4 && b === 4) {
    if (w.x < d.x) { g = w; i = d; l = false; } else { g = d; i = w; l = true; }
    const h = rectOf(g, boxes);
    if (i.y >= h.y - r && i.y <= h.y + h.h + r) {
      const o = g.x - r;
      const n = i.y < h.y + h.h / 2 ? h.y - r : h.y + h.h + r;
      A.push({ x: o, y: g.y }, { x: o, y: n });
      const o2 = i.x - r;
      A.push({ x: o2, y: n }, { x: o2, y: i.y });
    } else {
      const o = g.x - r;
      A.push({ x: o, y: g.y }, { x: o, y: i.y });
    }
  } else if ((c === 1 && b === 3) || (c === 3 && b === 1)) {
    // 上下相对（g=dir1=底锚点端）
    if (c === 1) { g = w; i = d; l = false; } else { g = d; i = w; l = true; }
    const h = rectOf(g, boxes);
    const v = rectOf(i, boxes);
    if (i.y <= g.y) {
      const n = g.y - D / 2;
      A.push({ x: g.x, y: n }, { x: i.x, y: n });
    } else {
      const a = h.x + h.w;
      const j = v.x + v.w;
      let n = g.y - r;
      let o;
      if (j >= h.x && v.x <= a) {
        const z = h.x + h.w / 2;
        if (i.x < z) o = h.x < v.x ? h.x - r : v.x - r;
        else o = a > j ? a + r : j + r;
        if (v.y < g.y) n = v.y - r;
      } else {
        if (i.x < g.x) o = j + (h.x - j) / 2;
        else o = a + (v.x - a) / 2;
      }
      A.push({ x: g.x, y: n }, { x: o, y: n });
      n = i.y + r;
      A.push({ x: o, y: n }, { x: i.x, y: n });
    }
  } else if ((c === 2 && b === 4) || (c === 4 && b === 2)) {
    // 左右相对（g=右锚点端）
    if (c === 2) { g = w; i = d; l = false; } else { g = d; i = w; l = true; }
    const h = rectOf(g, boxes);
    const v = rectOf(i, boxes);
    if (i.x > g.x) {
      const o = g.x + m / 2;
      A.push({ x: o, y: g.y }, { x: o, y: i.y });
    } else {
      const u = h.y + h.h;
      const p = v.y + v.h;
      let o = g.x + r;
      let n;
      if (p >= h.y && v.y <= u) {
        const z = h.y + h.h / 2;
        if (i.y < z) n = h.y < v.y ? h.y - r : v.y - r;
        else n = u > p ? u + r : p + r;
        if (v.x + v.w > g.x) o = v.x + v.w + r;
      } else {
        if (i.y < g.y) n = p + (h.y - p) / 2;
        else n = u + (v.y - u) / 2;
      }
      A.push({ x: o, y: g.y }, { x: o, y: n });
      o = i.x - r;
      A.push({ x: o, y: n }, { x: o, y: i.y });
    }
  } else if ((c === 1 && b === 2) || (c === 2 && b === 1)) {
    // 上-右相邻（g=右锚点端，i=上锚点端）
    if (c === 2) { g = w; i = d; l = false; } else { g = d; i = w; l = true; }
    const h = rectOf(g, boxes);
    const v = rectOf(i, boxes);
    if (i.x > g.x && i.y > g.y) {
      A.push({ x: i.x, y: g.y });
    } else if (i.x > g.x && v.x > g.x) {
      const o = v.x - g.x < r * 2 ? g.x + (v.x - g.x) / 2 : g.x + r;
      const n = i.y - r;
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n });
    } else if (i.x <= g.x && i.y > h.y + h.h) {
      const u = h.y + h.h;
      const o = g.x + r;
      const n = i.y - u < r * 2 ? u + (i.y - u) / 2 : i.y - r;
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n });
    } else {
      const j = v.x + v.w;
      const o = j > g.x ? j + r : g.x + r;
      const n = i.y < h.y ? i.y - r : h.y - r;
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n });
    }
  } else if ((c === 1 && b === 4) || (c === 4 && b === 1)) {
    // 上-左相邻（g=左锚点端，i=上锚点端）
    if (c === 4) { g = w; i = d; l = false; } else { g = d; i = w; l = true; }
    const h = rectOf(g, boxes);
    const v = rectOf(i, boxes);
    const j = v.x + v.w;
    if (i.x < g.x && i.y > g.y) {
      A.push({ x: i.x, y: g.y });
    } else if (i.x < g.x && j < g.x) {
      const o = g.x - j < r * 2 ? j + (g.x - j) / 2 : g.x - r;
      const n = i.y - r;
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n });
    } else if (i.x >= g.x && i.y > h.y + h.h) {
      const u = h.y + h.h;
      const o = g.x - r;
      const n = i.y - u < r * 2 ? u + (i.y - u) / 2 : i.y - r;
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n });
    } else {
      const o = v.x < g.x ? v.x - r : g.x - r;
      const n = i.y < h.y ? i.y - r : h.y - r;
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n });
    }
  } else if ((c === 2 && b === 3) || (c === 3 && b === 2)) {
    // 右-下相邻（g=右锚点端，i=下锚点端）
    if (c === 2) { g = w; i = d; l = false; } else { g = d; i = w; l = true; }
    const h = rectOf(g, boxes);
    const v = rectOf(i, boxes);
    if (i.x > g.x && i.y < g.y) {
      A.push({ x: i.x, y: g.y });
    } else if (i.x > g.x && v.x > g.x) {
      const o = v.x - g.x < r * 2 ? g.x + (v.x - g.x) / 2 : g.x + r;
      const n = i.y + r;
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n });
    } else if (i.x <= g.x && i.y < h.y) {
      const o = g.x + r;
      const n = h.y - i.y < r * 2 ? i.y + (h.y - i.y) / 2 : i.y + r;
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n });
    } else {
      const j = v.x + v.w;
      const o = j > g.x ? j + r : g.x + r;
      const n = i.y > h.y + h.h ? i.y + r : h.y + h.h + r;
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n });
    }
  } else {
    // 下-左相邻（c,b 为 3&4 或 4&3）（g=左锚点端，i=下锚点端）
    if (c === 4) { g = w; i = d; l = false; } else { g = d; i = w; l = true; }
    const h = rectOf(g, boxes);
    const v = rectOf(i, boxes);
    const j = v.x + v.w;
    if (i.x < g.x && i.y < g.y) {
      A.push({ x: i.x, y: g.y });
    } else if (i.x < g.x && j < g.x) {
      const o = g.x - j < r * 2 ? j + (g.x - j) / 2 : g.x - r;
      const n = i.y + r;
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n });
    } else if (i.x >= g.x && i.y < h.y) {
      const o = g.x - r;
      const n = h.y - i.y < r * 2 ? i.y + (h.y - i.y) / 2 : i.y + r;
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n });
    } else {
      const o = v.x < g.x ? v.x - r : g.x - r;
      const n = i.y > h.y + h.h ? i.y + r : h.y + h.h + r;
      A.push({ x: o, y: g.y }, { x: o, y: n }, { x: i.x, y: n });
    }
  }
  if (l) A.reverse();
}
function getLinkerPoints(linker, boxes) {
  const A = [];
  const w = linker.from, d = linker.to;
  const m = Math.abs(d.x - w.x), D = Math.abs(d.y - w.y);
  const r = STUB_R;
  if (linker.linkerType === 'broken') {
    if (w.id != null && d.id != null) brokenBothAttached(w, d, A, boxes, m, D, r);
  } else if (linker.linkerType === 'curve') {
    const f = Math.hypot(d.x - w.x, d.y - w.y);
    const k = f * 0.4;
    A.push(curveControl(w, d, k), curveControl(d, w, k));
  }
  // 去重：相邻零长段（锚点 y 对齐后可能产生）
  return A.filter((p, idx) => idx === 0 || Math.hypot(p.x - A[idx - 1].x, p.y - A[idx - 1].y) > 0.5);
}
function curveControl(E, F, k) {
  if (E.id != null) return { x: E.x - k * Math.cos(E.angle ?? 0), y: E.y - k * Math.sin(E.angle ?? 0) };
  const G = Math.abs(E.y - F.y), y0 = Math.abs(E.x - F.x);
  const H = Math.atan(G / y0);
  return {
    x: E.x <= F.x ? E.x + k * Math.cos(H) : E.x - k * Math.cos(H),
    y: E.y <= F.y ? E.y + k * Math.sin(H) : E.y - k * Math.sin(H),
  };
}

// ── 泳道族 path/textBlock 构建：从 eflink-draw core/editor/swimlane.ts 原样移植（仅 v 向分支） ──
const SWIMLANE_HEADER = 40;
const fillRectSegment = (x0, y0, x1, y1, color) => ({
  actions: [
    { action: 'move', x: x0, y: y0 },
    { action: 'line', x: x1, y: y0 },
    { action: 'line', x: x1, y: y1 },
    { action: 'line', x: x0, y: y1 },
    { action: 'close' },
  ],
  fillStyle: { type: 'solid', color },
});
const makeFrame = () => [
  { action: 'move', x: 0, y: 0 },
  { action: 'line', x: 'w', y: 0 },
  { action: 'line', x: 'w', y: 'h' },
  { action: 'line', x: 0, y: 'h' },
  { action: 'close' },
];
function buildSwimlanePathV(laneCount, opts = {}) {
  const { titleColor, laneHeadColors, laneColors, laneRatios, stageCount } = opts;
  const titleSize = 40;
  const hasHeadRow = true;
  const n = laneCount;
  const bodyStart = titleSize + (hasHeadRow ? SWIMLANE_HEADER : 0);
  const paths = [];
  if (titleColor) paths.push(fillRectSegment(0, 0, 'w', titleSize, titleColor));
  for (let i = 0; i < n; i++) {
    const start = i === 0 ? 0 : `w*${i}/${n}`;
    const end = `w*${i + 1}/${n}`;
    const hc = hasHeadRow ? laneHeadColors?.[i] : undefined;
    if (hc) paths.push(fillRectSegment(start, titleSize, end, bodyStart, hc));
    const c = laneColors?.[i];
    if (c) paths.push(fillRectSegment(start, bodyStart, end, 'h', c));
  }
  paths.push(makeFrame());
  paths.push([{ action: 'move', x: 0, y: titleSize }, { action: 'line', x: 'w', y: titleSize }]);
  if (hasHeadRow) paths.push([{ action: 'move', x: 0, y: bodyStart }, { action: 'line', x: 'w', y: bodyStart }]);
  for (let i = 1; i < n; i++) {
    const x = `w*${i}/${n}`;
    paths.push([{ action: 'move', x, y: titleSize }, { action: 'line', x, y: 'h' }]);
  }
  // 阶段线
  const s = stageCount ?? 0;
  for (let j = 1; j <= s; j++) {
    const y = `${bodyStart}+(h-${bodyStart})*${j}/${s + 1}`;
    paths.push([{ action: 'move', x: 0, y }, { action: 'line', x: 'w', y }]);
  }
  return paths;
}
function buildSwimlaneTextBlocksV(laneCount, titleText, headTexts = []) {
  const titleSize = 40;
  const blocks = [{
    position: { x: 10, y: 0, w: 'w-20', h: titleSize },
    text: titleText,
    fontStyle: { size: 16 },
  }];
  for (let i = 0; i < laneCount; i++) {
    blocks.push({
      position: { x: i === 0 ? 8 : `w*${i}/${laneCount}+8`, y: titleSize, w: `w/${laneCount}-16`, h: SWIMLANE_HEADER },
      text: headTexts[i] ?? '',
    });
  }
  return blocks;
}

// ── 原生形状构建器（字段对齐 shapeRegistry.createElement 产物 + schema 默认值） ──
/** 窄高框竖排文字：h≥w*1.4 的窄高矩形（ProcessOn 组织架构叶节点等原图即逐字竖排标签），
 *  文字以 CJK 为主、无换行、且逐字竖排放得下时 → 每字一行竖排 */
const verticalizeText = (text, w, h, fontSize) => {
  if (!text || text.includes('\n') || h < w * 1.4 || w < fontSize + 18) return text;
  const chars = [...String(text)];
  const cjk = chars.filter((c) => /[\u4e00-\u9fa5]/.test(c)).length;
  if (cjk < 3 || cjk * 1.5 < chars.length) return text;
  if (chars.length > Math.floor(h / (fontSize * 1.2))) return text;
  return chars.join('\n');
};
function baseElement(name, category, spec, extra = {}) {
  return {
    id: spec.id,
    name,
    title: spec.text ?? '',
    category,
    group: '',
    groupName: null,
    locked: false,
    link: '',
    children: [],
    parent: '',
    resizeDir: ['tl', 'tr', 'br', 'bl'],
    attribute: { visible: true },
    dataAttributes: [],
    props: { x: spec.x, y: spec.y, w: spec.w, h: spec.h, zindex: spec.z ?? 10, angle: 0 },
    shapeStyle: { alpha: 1 },
    lineStyle: { lineWidth: spec.lineWidth ?? 1.5, lineColor: spec.lineColor ?? '50,50,50', lineStyle: 'solid' },
    fillStyle: spec.fill === 'none' ? { type: 'none' } : { type: 'solid', color: spec.fill ?? '255,255,255' },
    fontStyle: {
      fontFamily: 'yahei', size: spec.fontSize ?? 13,
      color: spec.textColor ?? '50,50,50',
      textAlign: 'center', vAlign: 'middle', bold: spec.bold ?? false,
      italic: false, underline: false, orientation: 'horizontal',
    },
    textBlock: [{ position: { x: 8, y: 0, w: 'w-16', h: 'h' }, text: verticalizeText(spec.text ?? '', spec.w, spec.h, spec.fontSize ?? 13) }],
    anchors: [],
    ...extra,
  };
}
/** 泳道图(垂直)：标题带 + N 泳道头格 + 分隔线，容器透明（fillStyle none，连线从其下方穿过仍可见） */
function buildSwimlaneVElement(spec) {
  const n = spec.laneCount ?? 2;
  const el = baseElement('swimlaneV', 'lane', { ...spec, fill: undefined, text: undefined }, {
    attribute: { visible: true, container: true, rotatable: false, linkable: false },
    fillStyle: { type: 'none' },
    anchors: [],
    laneCount: n,
    stageCount: spec.stageCount ?? 0,
    ...(spec.titleColor ? { titleColor: spec.titleColor } : {}),
    ...(spec.laneHeadColors ? { laneHeadColors: spec.laneHeadColors } : {}),
    ...(spec.laneColors ? { laneColors: spec.laneColors } : {}),
    path: buildSwimlanePathV(n, { titleColor: spec.titleColor, laneHeadColors: spec.laneHeadColors, laneColors: spec.laneColors, stageCount: spec.stageCount }),
    textBlock: buildSwimlaneTextBlocksV(n, spec.title ?? '', spec.headTexts ?? []),
  });
  return el;
}
/** UML 生命线：头部方块 + 虚线中轴（schema path 原样） */
function buildLifelineElement(spec) {
  return baseElement('sequenceLifeLine', 'uml_sequence', spec, {
    attribute: { visible: true, linkable: false },
    textBlock: [{ position: { x: 10, y: 0, w: 'w-20', h: 30 }, text: spec.text ?? '' }],
    anchors: [],
    path: [
      {
        lineStyle: { lineWidth: 2, lineStyle: 'dot' },
        fillStyle: { type: 'none' },
        actions: [
          { action: 'move', x: 'w*(1/2)', y: 30 },
          { action: 'line', x: 'w*(1/2)', y: 'h' },
        ],
      },
      [
        { action: 'move', x: 0, y: 0 },
        { action: 'line', x: 'w', y: 0 },
        { action: 'line', x: 'w', y: 30 },
        { action: 'line', x: 0, y: 30 },
        { action: 'close' },
      ],
    ],
  });
}
/** UML 激活条：细长圆角矩形（schema path 原样），带四向锚点供消息吸附/重路由 */
function buildActivationElement(spec) {
  return baseElement('sequenceActivation', 'uml_sequence', spec, {
    resizeDir: ['t', 'b'],
    attribute: { visible: true, linkable: true, container: false, rotatable: false },
    textBlock: [],
    anchors: [
      { x: 'w/2', y: 0 },
      { x: 'w/2', y: 'h' },
      { x: 0, y: 'h/2' },
      { x: 'w', y: 'h/2' },
    ],
    path: [[
      { action: 'move', x: 0, y: 4 },
      { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
      { action: 'line', x: 'w-4', y: 0 },
      { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
      { action: 'line', x: 'w', y: 'h-4' },
      { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
      { action: 'line', x: 4, y: 'h' },
      { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
      { action: 'line', x: 0, y: 4 },
      { action: 'close' },
    ]],
  });
}

/** 泳道图(水平)：标题列 + N 行泳道头格 + 分隔线（swimlane.ts h 分支移植） */
function buildSwimlaneHElement(spec) {
  const n = spec.laneCount ?? 2;
  const titleSize = 40, head = SWIMLANE_HEADER, bodyStart = titleSize + head;
  const paths = [];
  if (spec.titleColor) paths.push(fillRectSegment(0, 0, titleSize, 'h', spec.titleColor));
  for (let i = 0; i < n; i++) {
    const start = i === 0 ? 0 : `h*${i}/${n}`;
    const end = `h*${i + 1}/${n}`;
    if (spec.laneHeadColors?.[i]) paths.push(fillRectSegment(titleSize, start, bodyStart, end, spec.laneHeadColors[i]));
    if (spec.laneColors?.[i]) paths.push(fillRectSegment(bodyStart, start, 'w', end, spec.laneColors[i]));
  }
  paths.push(makeFrame());
  paths.push([{ action: 'move', x: titleSize, y: 0 }, { action: 'line', x: titleSize, y: 'h' }]);
  paths.push([{ action: 'move', x: bodyStart, y: 0 }, { action: 'line', x: bodyStart, y: 'h' }]);
  for (let i = 1; i < n; i++) {
    const y = `h*${i}/${n}`;
    paths.push([{ action: 'move', x: titleSize, y }, { action: 'line', x: 'w', y }]);
  }
  const blocks = [{
    position: { x: 0, y: 10, w: titleSize, h: 'h-20' },
    text: spec.title ?? '',
    fontStyle: { size: 16, orientation: 'vertical' },
  }];
  for (let i = 0; i < n; i++) {
    blocks.push({
      position: { x: titleSize + 4, y: i === 0 ? 4 : `h*${i}/${n}+4`, w: head - 8, h: `h/${n}-8` },
      text: (spec.headTexts ?? [])[i] ?? '',
    });
  }
  return baseElement('swimlaneH', 'lane', { ...spec, fill: undefined, text: undefined }, {
    attribute: { visible: true, container: true, rotatable: false, linkable: false },
    fillStyle: { type: 'none' },
    anchors: [],
    laneCount: n,
    stageCount: 0,
    ...(spec.titleColor ? { titleColor: spec.titleColor } : {}),
    ...(spec.laneHeadColors ? { laneHeadColors: spec.laneHeadColors } : {}),
    ...(spec.laneColors ? { laneColors: spec.laneColors } : {}),
    path: paths,
    textBlock: blocks,
  });
}

/** 六边形（basic schema 原样 path） */
function buildHexagonElement(spec) {
  return baseElement('hexagon', 'basic', spec, {
    path: [[
      { action: 'move', x: 'Math.min(w,h)*0.21', y: 0 },
      { action: 'line', x: 'w-Math.min(w,h)*0.21', y: 0 },
      { action: 'line', x: 'w', y: 'h/2' },
      { action: 'line', x: 'w-Math.min(w,h)*0.21', y: 'h' },
      { action: 'line', x: 'Math.min(w,h)*0.21', y: 'h' },
      { action: 'line', x: 0, y: 'h/2' },
      { action: 'close' },
    ]],
  });
}
/** 直线：支持绝对端点 x1,y1,x2,y2（任意方向线段，spec 坐标）；省略时为框内对角线 (0,h)→(w,0)（basic schema 原样） */
function buildLineElement(spec) {
  let { x, y, w, h } = spec;
  let path;
  if (spec.x1 != null && spec.y1 != null && spec.x2 != null && spec.y2 != null) {
    x = Math.min(spec.x1, spec.x2);
    y = Math.min(spec.y1, spec.y2);
    w = Math.abs(spec.x2 - spec.x1);
    h = Math.abs(spec.y2 - spec.y1);
    const x2l = spec.x2 >= spec.x1 ? w : 0;
    const y2l = spec.y2 >= spec.y1 ? h : 0;
    const x1l = w - x2l;
    const y1l = h - y2l;
    path = [[{ action: 'move', x: x1l, y: y1l }, { action: 'line', x: x2l, y: y2l }]];
  } else {
    path = [[{ action: 'move', x: 0, y: 'h' }, { action: 'line', x: 'w', y: 0 }]];
  }
  spec.x = x; spec.y = y; spec.w = w; spec.h = h;
  return baseElement('line', 'basic', { ...spec, text: undefined }, {
    attribute: { visible: true, container: false, rotatable: true, linkable: false },
    fillStyle: { type: 'none' },
    textBlock: [],
    anchors: [],
    path,
  });
}

/** UML 类（三段式：类名/属性/操作）——schema shapes/umlClass.ts 的 cls 原样移植 */
function buildClsElement(spec) {
  return baseElement('cls', 'uml_class', { ...spec, bold: spec.bold ?? true }, {
    attrs: spec.attrs ?? '', ops: spec.ops ?? '',
    attribute: { visible: true, container: true },
    textBlock: [
      { position: { x: 10, y: 0, w: 'w-20', h: 30 }, text: spec.text ?? '' },
      { position: { x: 10, y: 30, w: 'w-20', h: '(h-30)/2' }, text: spec.attrs ?? '', fontStyle: { textAlign: 'left', bold: false } },
      { position: { x: 10, y: '(h-30)/2 + 30', w: 'w-20', h: '(h-30)/2' }, text: spec.ops ?? '', fontStyle: { textAlign: 'left', bold: false } },
    ],
    anchors: [{ x: 'w/2', y: 0 }, { x: 'w/2', y: 'h' }, { x: 0, y: 'h/2' }, { x: 'w', y: 'h/2' }],
    path: [
      [
        { action: 'move', x: 0, y: 4 },
        { action: 'quadraticCurve', x1: 0, y1: 0, x: 4, y: 0 },
        { action: 'line', x: 'w-4', y: 0 },
        { action: 'quadraticCurve', x1: 'w', y1: 0, x: 'w', y: 4 },
        { action: 'line', x: 'w', y: 'h-4' },
        { action: 'quadraticCurve', x1: 'w', y1: 'h', x: 'w-4', y: 'h' },
        { action: 'line', x: 4, y: 'h' },
        { action: 'quadraticCurve', x1: 0, y1: 'h', x: 0, y: 'h-4' },
        { action: 'close' },
      ],
      [{ action: 'move', x: 0, y: 30 }, { action: 'line', x: 'w', y: 30 }],
      [{ action: 'move', x: 0, y: 'h/2+15' }, { action: 'line', x: 'w', y: 'h/2+15' }],
    ],
  });
}
/** 三段矩形（同宽贴合堆叠：短标题 + 两个多行正文）自动合并为原生 cls——
 *  agents 曾按退化规则用矩形拼装类图，此处兜底合并；spec 也可直接写 native:'cls' */
function mergeClassChains(nodes, links) {
  const byKey = new Map();
  for (const n of nodes) {
    if (n.native || n.name !== 'rectangle') continue;
    const key = `${Math.round(n.x / 4)}:${Math.round(n.w / 4)}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(n);
  }
  const remap = new Map(); const merged = new Set();
  for (const g of byKey.values()) {
    g.sort((a, b) => a.y - b.y);
    for (let i = 0; i + 2 < g.length; i++) {
      const t = g[i], a1 = g[i + 1], a2 = g[i + 2];
      const contig = Math.abs(t.y + t.h - a1.y) <= 3 && Math.abs(a1.y + a1.h - a2.y) <= 3;
      const tHead = t.h <= 70 && t.text && !String(t.text).includes('\n') && String(t.text).length <= 40;
      const bodies = String(a1.text ?? '').includes('\n') && String(a2.text ?? '').includes('\n');
      if (!contig || !tHead || !bodies || merged.has(t.id) || merged.has(a1.id) || merged.has(a2.id)) continue;
      t.native = 'cls';
      t.h = a2.y + a2.h - t.y;
      t.attrs = a1.text; t.ops = a2.text;
      remap.set(a1.id, t.id); remap.set(a2.id, t.id);
      merged.add(t.id); merged.add(a1.id); merged.add(a2.id);
      i += 2;
    }
  }
  if (!remap.size) return nodes;
  const seen = new Set();
  const outLinks = [];
  for (const l of links) {
    if (remap.has(l.from)) l.from = remap.get(l.from);
    if (remap.has(l.to)) l.to = remap.get(l.to);
    if (l.from === l.to) continue;
    const k = `${l.from}|${l.to}|${l.text ?? ''}`;
    if (seen.has(k)) continue;
    seen.add(k);
    outLinks.push(l);
  }
  links.length = 0; links.push(...outLinks);
  return nodes.filter((n) => !remap.has(n.id));
}
function buildDraw(title, nodes, links, opts = {}) {
  nodes = mergeClassChains(nodes, links);

  links = links ?? [];
  const boxes = {};
  const elements = {};
  let autoZ = 10;
  for (const node of nodes) {
    // 原生形状分支：swimlaneV / sequenceLifeLine / sequenceActivation
    if (node.native) {
      const el = node.native === 'swimlaneV'
        ? buildSwimlaneVElement(node)
        : node.native === 'swimlaneH'
          ? buildSwimlaneHElement(node)
          : node.native === 'lifeline'
            ? buildLifelineElement(node)
            : node.native === 'line'
              ? buildLineElement(node)
            : node.native === 'hexagon'
              ? buildHexagonElement(node)
              : node.native === 'cls'
                ? buildClsElement(node)
              : (SHAPES_DATA[node.native] || (SHAPES_DATA[node.name] && !DRAW_PATH[node.name]))
                ? (() => { const def = SHAPES_DATA[node.native] || SHAPES_DATA[node.name]; node.w = node.w ?? def.props.w; node.h = node.h ?? def.props.h; return buildGenericNative(node); })()
              : buildActivationElement(node);
      boxes[node.id] = { x: node.x, y: node.y, w: node.w, h: node.h, name: node.name };
      const zindex = node.z ?? autoZ++;
      autoZ = Math.max(autoZ, zindex + 1);
      el.props.zindex = zindex;
      elements[node.id] = el;
      continue;
    }
    const size = DRAW_SIZE[node.name];
    const w = node.w ?? size.w;
    const h = node.h ?? size.h;
    boxes[node.id] = { x: node.x, y: node.y, w, h, name: node.name };
    const noFill = node.fill === 'none';
    const fill = noFill ? '255,255,255' : (node.fill ?? '255,255,255');
    const dark = !noFill && rgbLuma(fill) < 150;
    const zindex = node.z ?? autoZ++;
    autoZ = Math.max(autoZ, zindex + 1);
    elements[node.id] = {
      id: node.id, name: node.name, title: node.text,
      category: DRAW_FLOW_NAMES.has(node.name) ? 'flow' : 'basic',
      group: '', groupName: null, locked: false, link: '', children: [], parent: '',
      resizeDir: ['tl', 'tr', 'br', 'bl'], attribute: { visible: true }, dataAttributes: [],
      props: { x: node.x, y: node.y, w, h, zindex, angle: 0 },
      shapeStyle: { alpha: 1 },
      lineStyle: { lineWidth: node.lineWidth ?? 1.5, lineColor: node.lineColor ?? '50,50,50', lineStyle: node.lineStyle ?? 'solid' },
      fillStyle: noFill ? { type: 'none' } : { type: 'solid', color: fill },
      fontStyle: {
        fontFamily: 'yahei', size: node.fontSize ?? 13,
        color: node.textColor ?? (dark ? '255,255,255' : '50,50,50'),
        textAlign: 'center', vAlign: 'middle', bold: node.bold ?? dark,
        italic: false, underline: false, orientation: 'horizontal',
      },
      textBlock: [{ position: { x: 8, y: 0, w: 'w-16', h: 'h' }, text: verticalizeText(node.text, w, h, node.fontSize ?? 13) }],
      anchors: [{ x: 'w/2', y: 0 }, { x: 'w/2', y: 'h' }, { x: 0, y: 'h/2' }, { x: 'w', y: 'h/2' }],
      path: DRAW_PATH[node.name],
    };
  }
  links.forEach((link, i) => {
    const a = boxes[link.from], b = boxes[link.to];
    if (!a || !b) return;
    const id = link.id ?? `lk-${i + 1}`;
    const dashed = link.lineStyle === 'dashed';
    // 时序消息：端点恒在激活条左右缘、seq.y 高度，存 seq 元数据供编辑器移动激活条时重算
    if (link.seq) {
      const edgeX = (box, dir) => (dir === 1 ? box.x + box.w : dir === -1 ? box.x : box.x + box.w / 2);
      const fx = edgeX(a, link.seq.fromDir), tx = edgeX(b, link.seq.toDir);
      elements[id] = {
        id, name: 'linker',
        from: { id: link.from, x: fx, y: link.seq.y, angle: 0 },
        to: { id: link.to, x: tx, y: link.seq.y, angle: 0 },
        text: link.text ?? '', linkerType: 'line',
        lineStyle: { lineWidth: 1.5, lineColor: '50,50,50', lineStyle: dashed ? 'dashed' : 'solid', beginArrowStyle: 'none', endArrowStyle: link.endArrowStyle ?? 'solidArrow' },
        points: [],
        seq: { y: link.seq.y, fromDir: link.seq.fromDir, toDir: link.seq.toDir },
        locked: false, dataAttributes: [], group: '', props: { zindex: autoZ++ },
      };
      return;
    }
    const inferred = inferSides(a, b);
    let fromSide = link.fromSide ?? inferred.from;
    let toSide = link.toSide ?? inferred.to;
    // 树式路由：子节点在正下方/正上方（WBS/组织架构/层级树）时，父底(顶)中点 → 中位横线 → 子顶(底)中点，
    // 贴合原图树连接；inferSides 的主轴推断在这种宽浅树上会选出"右出左进"导致连线横穿（#696）
    const aName = a.name ?? boxes[link.from]?.name, bName = b.name ?? boxes[link.to]?.name;
    let treeMid = null;
    if (!link.fromSide && !link.toSide && aName !== 'round' && bName !== 'round') {
      if (b.y > a.y + a.h) {
        const my = (a.y + a.h + b.y) / 2;
        fromSide = 'bottom'; toSide = 'top';
        treeMid = Math.abs(a.x + a.w / 2 - (b.x + b.w / 2)) < 1 ? [] :
          [{ x: a.x + a.w / 2, y: my }, { x: b.x + b.w / 2, y: my }];
      } else if (a.y > b.y + b.h) {
        const my = (b.y + b.h + a.y) / 2;
        fromSide = 'top'; toSide = 'bottom';
        treeMid = Math.abs(a.x + a.w / 2 - (b.x + b.w / 2)) < 1 ? [] :
          [{ x: a.x + a.w / 2, y: my }, { x: b.x + b.w / 2, y: my }];
      }
    }
    const from = sidePoint(a, fromSide);
    const to = sidePoint(b, toSide);
    // 直线连接：椭圆（round）参与的连线（ER 属性/中心辐射/思维导图气泡）原图一律直线，
    // 正交路由会把斜向线掰成 Z 形弯折、把近垂直线掰出小台阶
    const straightLink = aName === 'round' || bName === 'round';
    elements[id] = {
      id, name: 'linker',
      from: { id: link.from, x: from.x, y: from.y, angle: from.angle },
      to: { id: link.to, x: to.x, y: to.y, angle: to.angle },
      text: link.text ?? '', linkerType: 'broken',
      lineStyle: { lineWidth: 1.5, lineColor: '50,50,50', lineStyle: link.lineStyle ?? 'solid', beginArrowStyle: link.beginArrowStyle ?? 'none', endArrowStyle: link.endArrowStyle ?? 'solidArrow' },
      points: straightLink ? [] : treeMid !== null ? treeMid : getLinkerPoints(
        { linkerType: 'broken', from: { id: link.from, ...from }, to: { id: link.to, ...to } },
        boxes,
      ),
      locked: false, dataAttributes: [], group: '', props: { zindex: autoZ++ },
    };
  });
  return {
    page: { showGrid: true, gridSize: 10, orientation: 'landscape', width: opts.width ?? 1600, height: opts.height ?? 1200, backgroundColor: '255,255,255', padding: 0, title },
    elements,
  };
}
// ── 移植结束 ──

// SVG 预览渲染：直接画生成的 DocumentData（节点按 zindex、连线按存入折点），与编辑器几何一致
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** 按显示宽度换行（CJK 字宽≈fontSize，ASCII≈0.56×）；显式 \n 保留为段落 */
const CJK_RE = /[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef\u3000-\u303f]/;
function wrapText(text, maxWidth, fontSize) {
  const out = [];
  for (const para of String(text).split('\n')) {
    if (para === '') { out.push(''); continue; }
    let cur = '', curW = 0;
    for (const ch of para) {
      const cw = CJK_RE.test(ch) ? fontSize : fontSize * 0.56;
      if (curW + cw > maxWidth && cur) { out.push(cur); cur = ch; curW = cw; }
      else { cur += ch; curW += cw; }
    }
    out.push(cur);
  }
  return out;
}
/** SVG 多行文字（水平居中，块内垂直居中）；放不下自动缩字号（最小 8），仍溢出截断加省略号 */
function svgWrappedText(cx, by, bw, bh, text, opts = {}) {
  const maxW = Math.max(bw - 6, 8);
  let fs = opts.fontSize ?? 13;
  let lines = wrapText(text, maxW, fs);
  for (let i = 0; i < 8 && lines.length * fs * 1.2 > bh && fs > 8; i++) {
    fs = Math.max(fs - 1, 8);
    lines = wrapText(text, maxW, fs);
  }
  const maxLines = Math.max(Math.floor(bh / (fs * 1.2)), 1);
  if (lines.length > maxLines) lines = lines.slice(0, maxLines).map((l, i2) => (i2 === maxLines - 1 ? l + '…' : l));
  const lh = fs * 1.2;
  const y0 = by + bh / 2 - ((lines.length - 1) * lh) / 2;
  const anchor = opts.anchor ?? 'middle';
  const tx = anchor === 'middle' ? cx : cx;
  return lines.map((ln, li) =>
    `<text x="${tx}" y="${y0 + li * lh}" fill="rgb(${opts.fill ?? '50,50,50'})" font-size="${fs}" font-weight="${opts.bold ? 'bold' : 'normal'}" text-anchor="${anchor}" dominant-baseline="central" font-family="'Microsoft YaHei',sans-serif">${esc(ln)}</text>`
  ).join('');
}

/** 求值 "w/5-16"、"h*i/n+4" 类表达式为绝对长度（泳道文本块定位用，与编辑器表达式语义一致） */
const _lenCache = new Map();
function evalLen(expr, wTotal, hTotal) {
  if (typeof expr === 'number') return Number.isFinite(expr) ? expr : 0;
  if (typeof expr !== 'string' || !expr.trim()) return 0;
  let fn = _lenCache.get(expr);
  if (fn === undefined) {
    try {
      fn = new Function('w', 'h', `return (${expr})`);
      if (typeof fn(1, 1) !== 'number') fn = null;
    } catch { fn = null; }
    _lenCache.set(expr, fn);
  }
  if (!fn) return 0;
  const r = fn(wTotal, hTotal);
  return typeof r === 'number' && isFinite(r) ? r : 0;
}
function docToSvg(doc) {
  const { width: W, height: H, } = doc.page;
  const els = Object.values(doc.elements);
  const nodes = els.filter((e) => e.name !== 'linker').sort((a, b) => a.props.zindex - b.props.zindex);
  const linkers = els.filter((e) => e.name === 'linker');
  let s = '';
  for (const n of nodes) {
    const { x, y, w, h } = n.props;
    const fill = n.fillStyle.type === 'none' ? 'none' : n.fillStyle.color;
    const lc = n.lineStyle.lineColor;
    const lw = n.lineStyle.lineWidth;
    const tc = n.fontStyle.color;
    const fs = n.fontStyle.size;
    const bold = n.fontStyle.bold;
    // 原生形状分支
    if (GENERIC_NATIVE.has(n.name) && n.path && n.path.length) {
      s += pathSegsToSvg(n.path, x, y, w, h, fill, lc, lw);
      for (const b of n.textBlock ?? []) {
        const bx = x + evalLen(b.position.x, w, h), by = y + evalLen(b.position.y, w, h);
        const bw = evalLen(b.position.w, w, h), bh = evalLen(b.position.h, w, h);
        if (b.text) s += svgWrappedText(bx + bw / 2, by, bw, bh, b.text, { fontSize: b.fontStyle?.size ?? 12, bold: b.fontStyle?.bold, anchor: b.fontStyle?.textAlign === 'left' ? 'start' : 'middle', fill: tc });
      }
      continue;
    }
    if (n.name === 'swimlaneV') {
      const titleSize = 40;
      const head = SWIMLANE_HEADER;
      const nn = n.laneCount ?? 2;
      let laneSvg = '';
      if (n.titleColor) laneSvg += `<rect x="${x}" y="${y}" width="${w}" height="${titleSize}" fill="rgb(${n.titleColor})" stroke="none"/>`;
      for (let i = 0; i < nn; i++) {
        const hc = n.laneHeadColors?.[i];
        const l0 = x + (w * i) / nn, l1 = x + (w * (i + 1)) / nn;
        if (hc) laneSvg += `<rect x="${l0}" y="${y + titleSize}" width="${l1 - l0}" height="${head}" fill="rgb(${hc})" stroke="none"/>`;
      }
      laneSvg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="rgb(${lc})" stroke-width="1.5"/>`;
      laneSvg += `<line x1="${x}" y1="${y + titleSize}" x2="${x + w}" y2="${y + titleSize}" stroke="rgb(${lc})" stroke-width="1.5"/>`;
      laneSvg += `<line x1="${x}" y1="${y + titleSize + head}" x2="${x + w}" y2="${y + titleSize + head}" stroke="rgb(${lc})" stroke-width="1.5"/>`;
      for (let i = 1; i < nn; i++) {
        const dx = x + (w * i) / nn;
        laneSvg += `<line x1="${dx}" y1="${y + titleSize}" x2="${dx}" y2="${y + h}" stroke="rgb(${lc})" stroke-width="1.5"/>`;
      }
      for (const b of n.textBlock) {
        const bx = x + evalLen(b.position.x, w, 0);
        const bw = evalLen(b.position.w, w, 0);
        const by = y + (typeof b.position.y === 'number' ? b.position.y : evalLen(b.position.y, w, h));
        const bh = typeof b.position.h === 'number' ? b.position.h : evalLen(b.position.h, w, h);
        if (b.text) laneSvg += svgWrappedText(bx + bw / 2, by, bw, bh, b.text, { fontSize: b.fontStyle?.size ?? 13 });
      }
      s += laneSvg;
      continue;
    }
    if (n.name === 'sequenceLifeLine') {
      s += `<rect x="${x}" y="${y}" width="${w}" height="30" fill="rgb(${fill})" stroke="rgb(${lc})" stroke-width="${lw}"/>`;
      s += `<line x1="${x + w / 2}" y1="${y + 30}" x2="${x + w / 2}" y2="${y + h}" stroke="rgb(${lc})" stroke-width="2" stroke-dasharray="2,4"/>`;
      if (n.title) s += `<text x="${x + w / 2}" y="${y + 15}" fill="rgb(${tc})" font-size="${fs}" font-weight="${bold ? 'bold' : 'normal'}" text-anchor="middle" dominant-baseline="central" font-family="'Microsoft YaHei',sans-serif">${esc(n.title)}</text>`;
      continue;
    }
    if (n.name === 'cls') {
      let cs = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="rgb(${fill})" stroke="rgb(${lc})" stroke-width="${lw}"/>`;
      cs += `<line x1="${x}" y1="${y + 30}" x2="${x + w}" y2="${y + 30}" stroke="rgb(${lc})" stroke-width="${lw}"/>`;
      cs += `<line x1="${x}" y1="${y + h / 2 + 15}" x2="${x + w}" y2="${y + h / 2 + 15}" stroke="rgb(${lc})" stroke-width="${lw}"/>`;
      cs += `<text x="${x + w / 2}" y="${y + 15}" fill="rgb(${tc})" font-size="${fs}" font-weight="bold" text-anchor="middle" dominant-baseline="central" font-family="'Microsoft YaHei',sans-serif">${esc(n.title ?? '')}</text>`;
      if (n.attrs) cs += svgWrappedText(x + 12, y + 30, w - 24, h / 2 - 15, n.attrs, { fontSize: fs, anchor: 'start' });
      if (n.ops) cs += svgWrappedText(x + 12, y + h / 2 + 15, w - 24, h / 2 - 15, n.ops, { fontSize: fs, anchor: 'start' });
      s += cs;
      continue;
    }
    if (n.name === 'sequenceActivation') {
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="rgb(${fill})" stroke="rgb(${lc})" stroke-width="${lw}"/>`;
      continue;
    }
    if (n.name === 'swimlaneH') {
      const titleSize = 40;
      const head = SWIMLANE_HEADER;
      const nn = n.laneCount ?? 2;
      let laneSvg = '';
      if (n.titleColor) laneSvg += `<rect x="${x}" y="${y}" width="${titleSize}" height="${h}" fill="rgb(${n.titleColor})" stroke="none"/>`;
      for (let i = 0; i < nn; i++) {
        const hc = n.laneHeadColors?.[i];
        const l0 = y + (h * i) / nn, l1 = y + (h * (i + 1)) / nn;
        if (hc) laneSvg += `<rect x="${x + titleSize}" y="${l0}" width="${head}" height="${l1 - l0}" fill="rgb(${hc})" stroke="none"/>`;
      }
      laneSvg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="rgb(${lc})" stroke-width="1.5"/>`;
      laneSvg += `<line x1="${x + titleSize}" y1="${y}" x2="${x + titleSize}" y2="${y + h}" stroke="rgb(${lc})" stroke-width="1.5"/>`;
      laneSvg += `<line x1="${x + titleSize + head}" y1="${y}" x2="${x + titleSize + head}" y2="${y + h}" stroke="rgb(${lc})" stroke-width="1.5"/>`;
      for (let i = 1; i < nn; i++) {
        const dy = y + (h * i) / nn;
        laneSvg += `<line x1="${x + titleSize}" y1="${dy}" x2="${x + w}" y2="${dy}" stroke="rgb(${lc})" stroke-width="1.5"/>`;
      }
      for (const b of n.textBlock) {
        const isTitle = b.position.y === 10 || b.position.y === '10';
        const by = isTitle ? y : y + evalLen(b.position.y, w, h);
        const bh = isTitle ? h - 20 : evalLen(b.position.h, w, h);
        const vertical = !!b.fontStyle?.orientation || isTitle;
        if (!b.text) continue;
        if (vertical) {
          // 竖排（标题列）：逐字竖排近似
          const chs = [...b.text];
          const lh = Math.min((bh - 10) / chs.length, 20);
          const y0 = y + bh / 2 - ((chs.length - 1) * lh) / 2;
          laneSvg += chs.map((ch, ci) => `<text x="${x + titleSize / 2}" y="${y0 + ci * lh}" fill="rgb(50,50,50)" font-size="${b.fontStyle?.size ?? 13}" text-anchor="middle" dominant-baseline="central" font-family="'Microsoft YaHei',sans-serif">${esc(ch)}</text>`).join('');
        } else {
          const bw = head - 12;
          laneSvg += svgWrappedText(x + titleSize + head / 2, by + 4, bw, bh - 8, b.text, { fontSize: b.fontStyle?.size ?? 13 });
        }
      }
      s += laneSvg;
      continue;
    }
    if (n.name === 'line') {
      const acts = n.path[0];
      const lx1 = x + evalLen(acts[0].x, w, h), ly1 = y + evalLen(acts[0].y, w, h);
      const lx2 = x + evalLen(acts[1].x, w, h), ly2 = y + evalLen(acts[1].y, w, h);
      s += `<line x1="${lx1}" y1="${ly1}" x2="${lx2}" y2="${ly2}" stroke="rgb(${lc})" stroke-width="${lw}"/>`;
      continue;
    }
    if (n.name === 'hexagon') {
      const k = Math.min(w, h) * 0.21;
      s += `<polygon points="${x + k},${y} ${x + w - k},${y} ${x + w},${y + h / 2} ${x + w - k},${y + h} ${x + k},${y + h} ${x},${y + h / 2}" fill="rgb(${fill})" stroke="rgb(${lc})" stroke-width="${lw}"/>`;
      if (n.title) s += `<text x="${x + w / 2}" y="${y + h / 2}" fill="rgb(${tc})" font-size="${fs}" font-weight="${bold ? 'bold' : 'normal'}" text-anchor="middle" dominant-baseline="central" font-family="'Microsoft YaHei',sans-serif">${esc(n.title)}</text>`;
      continue;
    }
    let shape = '';
    if (n.name === 'decision') {
      shape = `<polygon points="${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}" fill="rgb(${fill})" stroke="rgb(${lc})" stroke-width="${lw}"/>`;
    } else if (n.name === 'round') {
      shape = `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" fill="rgb(${fill})" stroke="rgb(${lc})" stroke-width="${lw}"/>`;
    } else if (n.name === 'terminator') {
      shape = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w, h) / 2.2}" fill="rgb(${fill})" stroke="rgb(${lc})" stroke-width="${lw}"/>`;
    } else if (n.name === 'data') {
      const sk = Math.min(h / 3, w / 3);
      shape = `<polygon points="${x + sk},${y} ${x + w},${y} ${x + w - sk},${y + h} ${x},${y + h}" fill="rgb(${fill})" stroke="rgb(${lc})" stroke-width="${lw}"/>`;
    } else if (n.name === 'document') {
      const dy = y + h - Math.min(h / 8, w / 12);
      shape = `<path d="M${x},${y} L${x + w},${y} L${x + w},${dy} Q${x + w * 0.75},${y + h + 4} ${x + w * 0.5},${dy} Q${x + w * 0.25},${y + h - 6} ${x},${dy} Z" fill="rgb(${fill})" stroke="rgb(${lc})" stroke-width="${lw}"/>`;
    } else {
      const fillAttr = fill === 'none' ? 'none' : `rgb(${fill})`;
      const ndash = n.lineStyle.lineStyle === 'dashed' ? ' stroke-dasharray="8,5"' : '';
      shape = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fillAttr}" stroke="rgb(${lc})" stroke-width="${lw}"${ndash}/>`;
    }
    s += shape;
    if (n.title) {
      // 单 textBlock 元素按 textBlock 文字渲染（尊重竖排 \n），宽度对齐编辑器 w-16
      const blockText = n.textBlock?.length === 1 ? n.textBlock[0].text : n.title;
      s += svgWrappedText(x + w / 2, y, Math.max(w - 16, 20), h, blockText, { fontSize: fs, fill: tc, bold });
    }
  }
  for (const l of linkers) {
    // 时序消息：恒水平线 + 箭头 + 中点标签
    if (l.seq) {
      const arrow = l.lineStyle.endArrowStyle === 'none' ? '' : ' marker-end="url(#arrow)"';
      const dash = l.lineStyle.lineStyle === 'dashed' ? 'stroke-dasharray="8,5"' : '';
      s += `<line x1="${l.from.x}" y1="${l.seq.y}" x2="${l.to.x}" y2="${l.seq.y}" stroke="rgb(${l.lineStyle.lineColor})" stroke-width="${l.lineStyle.lineWidth}" ${dash}${arrow}/>`;
      if (l.text) {
        s += `<text x="${(l.from.x + l.to.x) / 2}" y="${l.seq.y - 6}" fill="rgb(50,50,50)" font-size="12" font-weight="bold" text-anchor="middle" font-family="'Microsoft YaHei',sans-serif">${esc(l.text)}</text>`;
      }
      continue;
    }
    const pts = [l.from, ...l.points, l.to];
    const pathStr = pts.map((p) => `${p.x},${p.y}`).join(' ');
    const ls = l.lineStyle.lineStyle;
    const dash = ls === 'dashed' ? 'stroke-dasharray="8,5"' : ls === 'dot' ? 'stroke-dasharray="2,4"' : '';
    const arrow = l.lineStyle.endArrowStyle === 'none' ? '' : ' marker-end="url(#arrow)"';
    s += `<polyline points="${pathStr}" fill="none" stroke="rgb(${l.lineStyle.lineColor})" stroke-width="${l.lineStyle.lineWidth}" ${dash}${arrow}/>`;
    if (l.text) {
      // 标签放路径中点（按长度）
      let total = 0;
      const segs = [];
      for (let i = 1; i < pts.length; i++) {
        const len = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        segs.push(len);
        total += len;
      }
      let acc = 0, mid = { x: pts[0].x, y: pts[0].y };
      for (let i = 0; i < segs.length; i++) {
        if (acc + segs[i] >= total / 2) {
          const t = (total / 2 - acc) / (segs[i] || 1);
          mid = { x: pts[i].x + (pts[i + 1].x - pts[i].x) * t, y: pts[i].y + (pts[i + 1].y - pts[i].y) * t };
          break;
        }
        acc += segs[i];
      }
      s += `<text x="${mid.x}" y="${mid.y - 6}" fill="rgb(50,50,50)" font-size="12" font-weight="bold" text-anchor="middle" font-family="'Microsoft YaHei',sans-serif">${esc(l.text)}</text>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrow" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0,0 L9,4 L0,8 Z" fill="rgb(50,50,50)"/></marker></defs><rect x="0" y="0" width="${W}" height="${H}" fill="white"/>${s}</svg>`;
}

// ── CLI：node draw_convert.mjs <spec.json>[,...] [-o 输出目录] ──
// 输入：DrawSpec JSON（见 references/spec-format.md）
// 输出：<name>.efd.json（draw 编辑器可导入的 DocumentData）+ <name>.svg（同几何预览）

// ── 通用原生形状库：schema 提取数据（extract-shapes-data.mjs 生成，3695 形状含网络图标/draw.io 图形库/部署节点/箭头等）──
const SHAPES_DATA = JSON.parse(fs.readFileSync('/Users/apple/.agents/skills/eflink-draw-gen/assets/shapes-data.json', 'utf8'));
const GENERIC_NATIVE = new Set(Object.keys(SHAPES_DATA));
/** 表达式路径段 → SVG path 片段（支持 move/line/curve/quadraticCurve/close + 分段样式对象 + evenodd） */
function pathSegsToSvg(segs, x, y, w, h, fill, lc, lw) {
  let out = '';
  for (const seg of segs) {
    const acts = Array.isArray(seg) ? seg : seg.actions;
    const segFill = !Array.isArray(seg) && seg.fillStyle ? seg.fillStyle : null;
    const segLine = !Array.isArray(seg) && seg.lineStyle ? seg.lineStyle : null;
    let d = '';
    for (const act of acts) {
      if (act.action === 'move') d += `M${ (x + evalLen(act.x, w, h)).toFixed(1) } ${ (y + evalLen(act.y, w, h)).toFixed(1) } `;
      else if (act.action === 'line') d += `L${ (x + evalLen(act.x, w, h)).toFixed(1) } ${ (y + evalLen(act.y, w, h)).toFixed(1) } `;
      else if (act.action === 'curve') d += `C${ (x + evalLen(act.x1, w, h)).toFixed(1) } ${ (y + evalLen(act.y1, w, h)).toFixed(1) } ${ (x + evalLen(act.x2, w, h)).toFixed(1) } ${ (y + evalLen(act.y2, w, h)).toFixed(1) } ${ (x + evalLen(act.x, w, h)).toFixed(1) } ${ (y + evalLen(act.y, w, h)).toFixed(1) } `;
      else if (act.action === 'quadraticCurve') d += `Q${ (x + evalLen(act.x1, w, h)).toFixed(1) } ${ (y + evalLen(act.y1, w, h)).toFixed(1) } ${ (x + evalLen(act.x, w, h)).toFixed(1) } ${ (y + evalLen(act.y, w, h)).toFixed(1) } `;
      else if (act.action === 'close') d += 'Z ';
    }
    if (!d) continue;
    const fillAttr = segFill ? (segFill.type === 'solid' ? `rgb(${segFill.color})` : 'none') : (fill === 'none' ? 'none' : `rgb(${fill})`);
    const strokeAttr = segLine ? (segLine.lineWidth ? `rgb(${segLine.lineColor ?? lc})` : 'none') : `rgb(${lc})`;
    const sw = segLine ? (segLine.lineWidth ?? 0) : lw;
    const fr = !Array.isArray(seg) && seg.fillRule ? ` fill-rule="${seg.fillRule}"` : '';
    out += `<path d="${d.trim()}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${sw}"${fr}/>`;
  }
  return out;
}
/** 通用原生构建器：shapes-data.json 里任何形状都能按 name 构建（图标文字默认在下方 140×28 块） */
function buildGenericNative(spec) {
  const def = SHAPES_DATA[spec.native || spec.name];
  const w = spec.w ?? def.props.w, h = spec.h ?? def.props.h;
  const textBlock = def.textBlock ? JSON.parse(JSON.stringify(def.textBlock)) : undefined;
  if (textBlock && textBlock.length && spec.text != null) {
    textBlock[0] = { ...textBlock[0], text: spec.text };
    for (let i = 1; i < textBlock.length; i++) textBlock[i] = { ...textBlock[i], text: '' };
  }
  const fillStyle = def.fillStyle ?? (spec.fill && spec.fill !== 'none' ? { type: 'solid', color: spec.fill } : { type: 'none' });
  if (spec.fill && spec.fill !== 'none' && fillStyle.type === 'solid') fillStyle.color = spec.fill;
  const lineStyle = def.lineStyle ?? { lineWidth: spec.lineWidth ?? 1.5, lineColor: spec.lineColor ?? '50,50,50' };
  if (spec.lineColor && lineStyle.lineWidth) lineStyle.lineColor = spec.lineColor;
  return baseElement(def.name, def.category, { ...spec, w, h, fill: undefined, text: undefined }, {
    ...(textBlock ? { textBlock } : {}),
    fillStyle,
    lineStyle,
    ...(def.attribute ? { attribute: { visible: true, ...def.attribute } } : {}),
    anchors: [{ x: 'w/2', y: 0 }, { x: 'w/2', y: 'h' }, { x: 0, y: 'h/2' }, { x: 'w', y: 'h/2' }],
    path: def.path,
  });
}

const argv = process.argv.slice(2);
const outIx = argv.indexOf('-o');
const outDir = outIx >= 0 ? path.resolve(argv[outIx + 1]) : null;
const files = argv.filter((a, i) => (outIx >= 0 && (i === outIx || i === outIx + 1) ? false : a.endsWith('.json')));
if (files.length === 0) {
  console.error('用法：node draw_convert.mjs <spec.json>[...] [-o 输出目录]');
  process.exit(1);
}
for (const f of files) {
  const spec = JSON.parse(fs.readFileSync(path.resolve(f), 'utf8'));
  const doc = buildDraw(spec.title, spec.nodes, spec.links, { width: spec.width, height: spec.height });
  const base = path.basename(f).replace(/\.json$/i, '');
  const dir = outDir ?? path.dirname(path.resolve(f));
  fs.mkdirSync(dir, { recursive: true });
  const efd = path.join(dir, `${base}.efd.json`);
  fs.writeFileSync(efd, JSON.stringify(doc));
  fs.writeFileSync(path.join(dir, `${base}.svg`), docToSvg(doc));
  const kinds = {};
  for (const e of Object.values(doc.elements)) kinds[e.name] = (kinds[e.name] || 0) + 1;
  console.log(`✓ ${efd}  元素: ${JSON.stringify(kinds)}`);
}
