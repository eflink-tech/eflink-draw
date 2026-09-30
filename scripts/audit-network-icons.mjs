#!/usr/bin/env node
/**
 * 网络拓扑图标转换质量审计：对比源 SVG 的绘制元素数与转换后子路径数，
 * 找出内容疑似大面积丢失的图标（渐变 / clip-path 被跳过的场景），
 * 以及没有任何可见填充/描边的图标。
 *
 *   node scripts/audit-network-icons.mjs
 *
 * 数据源：packages/draw/src/core/schema/shapes/groups/*.ts（品类级生成文件）
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const ASSETS = path.join(ROOT, 'processon_files')
const GROUPS = path.join(ROOT, 'packages/draw/src/core/schema/shapes/groups')
const DRAWABLE = /<(path|rect|circle|ellipse|line|polyline|polygon)\b/g

/** schema 分类 → shape name 对应的源 SVG 文件名 */
const svgCache = new Map()
function svgOfCategory(category) {
  if (svgCache.has(category)) return svgCache.get(category)
  const map = new Map()
  const file = path.join(ASSETS, `${category}.js`)
  if (fs.existsSync(file)) {
    for (const chunk of fs.readFileSync(file, 'utf8').split('Schema.addShape(').slice(1)) {
      const name = /name:"([^"]+)"/.exec(chunk)
      const svg = /fileId:"[^"]*\/([^"]+\.svg)"/.exec(chunk)
      if (name && svg) map.set(name[1], svg[1])
    }
  }
  svgCache.set(category, map)
  return map
}

/** 品类 id → schema 分类（net-icon-groups.json 的 vendor 归属） */
const GROUP_CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/net-icon-groups.json'), 'utf8'))
const CATEGORY_OF_VENDOR = new Map(GROUP_CONFIG.vendors.map((v) => [v.id, v.schemaCategory]))
const schemaCategoryOf = (groupId) => {
  const vendor = GROUP_CONFIG.groups.find((g) => g.id === groupId)?.vendor
  return vendor ? CATEGORY_OF_VENDOR.get(vendor) : groupId
}

const icons = []
for (const f of fs.readdirSync(GROUPS).filter((n) => n.endsWith('.ts')).sort()) {
  const json = /const raw: IconRaw\[\] = (\[[\s\S]*\])\n/.exec(fs.readFileSync(path.join(GROUPS, f), 'utf8'))
  if (!json) throw new Error(`无法解析品类数据: groups/${f}`)
  const groupId = f.slice(0, -3)
  for (const icon of JSON.parse(json[1])) icons.push({ group: groupId, category: schemaCategoryOf(groupId), ...icon })
}

const rows = []
for (const icon of icons) {
  const file = svgOfCategory(icon.category).get(icon.n)
  const svgPath = file && path.join(ASSETS, file)
  if (!svgPath || !fs.existsSync(svgPath)) { rows.push({ category: icon.category, name: icon.n, srcEls: -1 }); continue }
  const svg = fs.readFileSync(svgPath, 'utf8')
  const srcEls = [...svg.matchAll(DRAWABLE)].filter(
    (m) => /fill="(?!none)[^"]+"/.test(svg.slice(m.index, m.index + 500))
      || /stroke="(?!none)[^"]+"/.test(svg.slice(m.index, m.index + 500)),
  ).length
  rows.push({ category: icon.category, group: icon.group, name: icon.n, title: icon.t, srcEls, segs: icon.segs.length })
}

const categories = [...new Set(icons.map((i) => i.category))]
console.log(`审计 ${icons.length} 个图标（${categories.join(', ')}）/ ${new Set(icons.map((i) => i.group)).size} 个品类`)

const missing = rows.filter((r) => r.srcEls < 0)
if (missing.length) console.log(`\n✗ 找不到源 SVG: ${missing.length} 个 → ${missing.map((m) => m.name).join(', ')}`)

const thin = rows.filter((r) => r.srcEls >= 4 && r.segs / r.srcEls < 0.45)
console.log(`\n△ 子路径数远低于源元素数（可能有内容丢失）: ${thin.length} 个`)
for (const r of thin) console.log(`   ${r.category.padEnd(15)} ${r.name.padEnd(28)} src=${String(r.srcEls).padStart(3)} segs=${String(r.segs).padStart(3)}  ${r.title}`)

const empty = rows.filter((r) => r.segs === 0)
console.log(`\n✗ 空图形: ${empty.length} 个${empty.length ? ' → ' + empty.map((e) => e.name).join(', ') : ''}`)

// 多色图标的样式在子路径上：全为 none 即不可见（单色图标样式在元素级，必然可见）
const invisible = icons.filter(
  (i) => i.m === 'multi'
    && !i.segs.some((s) => (s.fill && s.fill !== 'none') || (s.stroke && s.stroke !== 'none' && s.sw > 0)),
)
console.log(`\n✗ 无任何可见填充/描边的图标: ${invisible.length} 个`)
for (const i of invisible) console.log(`   ${i.category.padEnd(15)} ${i.n.padEnd(28)} ${i.t}`)
