#!/usr/bin/env node
/**
 * 提取 eflink-draw 原生形状定义 → shapes-data.json（转换器通用 native 构建器数据源）
 * - groups/*.ts：网络图标 IconRaw 紧凑数据，按 iconShape.buildIconShape 同款逻辑展开
 * - 静态 schema（basic/flow/umlDeployment/umlComponent）：按名单提取对象字面量
 * 用法：node extract-shapes-data.mjs  （在 eflink-draw schema 目录或任意位置运行）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const SCHEMA_DIR = '/Users/apple/Documents/myf-project/eflink.tech/eflink-draw/packages/draw/src/core/schema/shapes';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'shapes-data.json');

// ── IconRaw 展开（移植自 schema/shapes/iconShape.ts，保持一致）──
function decodeCmds(str) {
  const parts = str.match(/[MLCZ]|-?\d+/g);
  if (!parts) throw new Error('空指令流');
  const out = [];
  for (let i = 0; i < parts.length; ) {
    const c = parts[i++];
    const num = () => Number(parts[i++]) / 1000;
    if (c === 'M' || c === 'L') out.push({ action: c === 'M' ? 'move' : 'line', x: `w*${num()}`, y: `h*${num()}` });
    else if (c === 'C') {
      const x1 = num(), y1 = num(), x2 = num(), y2 = num(), x = num(), y = num();
      out.push({ action: 'curve', x1: `w*${x1}`, y1: `h*${y1}`, x2: `w*${x2}`, y2: `h*${y2}`, x: `w*${x}`, y: `h*${y}` });
    } else if (c === 'Z') out.push({ action: 'close' });
    else throw new Error('指令解析失败: ' + c);
  }
  return out;
}
const monoPath = (segs) => segs.map((s) => (s.fr ? { actions: decodeCmds(s.cmds), fillRule: 'evenodd' } : decodeCmds(s.cmds)));
// 与 iconShape.ts 同步：drawio stencil 的唯一文本节点映射为 tx（落图即见的预填文案）
const textBlock = (tx) => [{ position: { x: 'w/2-70', y: 'h', w: 140, h: 28 }, text: tx ?? '' }];
function buildIconShape(def) {
  let shape;
  if (def.m === 'fill') {
    shape = { name: def.n, title: def.t, category: def.c, props: { w: def.w, h: def.h }, textBlock: textBlock(def.tx), fillStyle: { type: 'solid', color: def.fc ?? '50,50,50' }, lineStyle: { lineWidth: 0 }, path: monoPath(def.segs) };
  } else if (def.m === 'stroke') {
    shape = { name: def.n, title: def.t, category: def.c, props: { w: def.w, h: def.h }, textBlock: textBlock(def.tx), fillStyle: { type: 'none' }, lineStyle: { lineColor: def.lc ?? '50,50,50', lineWidth: def.lw ?? 1 }, path: monoPath(def.segs) };
  } else {
    shape = { name: def.n, title: def.t, category: def.c, props: { w: def.w, h: def.h }, textBlock: textBlock(def.tx), fillStyle: { type: 'none' }, lineStyle: { lineWidth: 0 }, path: def.segs.map((s) => ({ actions: decodeCmds(s.cmds), fillStyle: s.fill && s.fill !== 'none' ? { type: 'solid', color: s.fill } : { type: 'none' }, lineStyle: s.stroke && s.stroke !== 'none' && s.sw ? { lineWidth: s.sw, lineColor: s.stroke } : { lineWidth: 0 }, ...(s.fr === 'evenodd' && { fillRule: 'evenodd' }) })) };
  }
  if (def.tb === 'top') {
    shape.textBlock = [{ position: { x: 12, y: 8, w: 'w-24', h: 24 }, text: def.t }];
    shape.fontStyle = { textAlign: 'left', vAlign: 'top', size: 14, bold: true };
  }
  if (def.ds && shape.lineStyle) shape.lineStyle = { ...shape.lineStyle, lineStyle: 'dashed' };
  if (def.ct) shape.attribute = { container: true, rotatable: false };
  return shape;
}

const out = {};

// ── 1. 网络图标 groups/*.ts（IconRaw 数组为纯 JSON 字面量）──
const groupsDir = path.join(SCHEMA_DIR, 'groups');
let iconCount = 0;
for (const f of fs.readdirSync(groupsDir).filter((x) => x.endsWith('.ts'))) {
  const text = fs.readFileSync(path.join(groupsDir, f), 'utf8');
  const m = text.match(/const raw: IconRaw\[\] = (\[[\s\S]*?\])\n\nexport const shapes/);
  if (!m) { console.error('跳过(无 raw):', f); continue; }
  const raws = JSON.parse(m[1]);
  for (const def of raws) {
    const shape = buildIconShape(def);
    out[shape.name] = shape;
    iconCount++;
  }
}
console.log('网络图标:', iconCount);

// ── 2. 静态 schema 按名单提取（对象字面量 eval，drawIcon 函数可求值后丢弃）──
const STATIC_FILES = ['basic.ts', 'flow.ts', 'umlDeployment.ts', 'umlComponent.ts', 'umlCommon.ts'];
let staticCount = 0;
const dupeLog = [];
const staticOut = {};
const WANT = new Set(['rectangle', 'round', 'cloud', 'directData', 'internalStorage', 'storedData', 'magneticDrum', 'sequentialData', 'manualInput', 'display', 'card', 'devNodeNonInstance', 'devNodeInstance', 'executionEnvironment', 'devComponent', 'devComponentNonInstance', 'component', 'componentNodeNonInstance', 'artifact', 'uml_deploymentObject', 'sector', 'sector2', 'singleUpArrow', 'singleDownArrow', 'singleLeftArrow', 'singleRightArrow', 'doubleHorizontalArrow', 'doubleVerticalArrow', 'note', 'comment', 'octagon', 'pentagon', 'teardrop', 'roundRectangle', 'triangle']);
// 括号平衡截取 const 块字面量
function blockFrom(text, startIdx) {
  let depth = 0;
  for (let i = startIdx; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') { depth--; if (depth === 0) return text.slice(startIdx, i + 1); }
  }
  return null;
}
for (const f of STATIC_FILES) {
  // 转译为 CommonJS，函数包装执行后按名字取（顶层 const 也能通过 exports/直取拿到）
  const raw = fs.readFileSync(path.join(SCHEMA_DIR, f), 'utf8').replace(/^import[^\n]*$/gm, '');
  const jsCjs = require('/Users/apple/Documents/myf-project/eflink.tech/eflink-frontend/node_modules/typescript/lib/typescript.js').transpileModule(raw, { compilerOptions: { module: 1, target: 99 } }).outputText;
  // 注入已提取形状为常量（flow.ts 等会 ...rectangle 展开 basic 的定义）
  const injected = Object.entries(staticOut).filter(([k]) => !jsCjs.includes('const ' + k + ' ') && !jsCjs.includes('exports.' + k + ' ')).map(([k, v]) => `var ${k} = ${JSON.stringify(v)};`).join('\n');
  for (const name of WANT) {
    if (out[name]) { dupeLog.push(name); continue; }
    if (!jsCjs.includes('const ' + name + ' ') && !jsCjs.includes('exports.' + name)) continue;
    try {
      const fn = new Function('exports', 'module', 'require', injected + '\n' + jsCjs + `\nreturn typeof ${name} !== "undefined" ? ${name} : exports[${JSON.stringify(name)}];`);
      const { drawIcon, ...rest } = fn({}, { exports: {} }, require);
      if (!rest || !rest.name) throw new Error('未找到');
      const clean = { name, title: rest.title ?? name, category: rest.category ?? 'basic', props: rest.props ?? { w: 96, h: 54 }, ...(['textBlock', 'path', 'fillStyle', 'lineStyle', 'attribute', 'fontStyle', 'anchors'].reduce((a, k) => (rest[k] !== undefined && (a[k] = rest[k]), a), {})) };
      out[name] = clean; staticOut[name] = clean;
      staticCount++;
    } catch (e) {
      console.error('  eval失败', f, name, String(e).slice(0, 120));
    }
  }
}
if (dupeLog.length) console.error('重名跳过:', dupeLog.join(','));
console.log('静态形状:', staticCount);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(`✅ ${OUT}：共 ${Object.keys(out).length} 个形状，大小 ${(fs.statSync(OUT).size / 1024).toFixed(0)}KB`);
