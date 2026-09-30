#!/usr/bin/env node
/**
 * 旧系统（processon_files/*.js Schema）与当前图形库的差异盘点。
 * 按图形 name 匹配，输出每个旧分类的覆盖情况与缺失清单。
 *
 *   node scripts/diff-legacy-shapes.mjs [--json out.json]
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const ASSETS = path.join(ROOT, 'processon_files')
const SHAPES = path.join(ROOT, 'packages/draw/src/core/schema/shapes')

/** 已转换的旧网络素材（按源文件排除，其 category 是 46 个品类名） */
const NETWORK_FILES = new Set(['network.js', 'network_cisco.js', 'network_aws.js', 'network_azure.js', 'network_aliyun.js'])
const LEGACY_FILES = fs
  .readdirSync(ASSETS)
  .filter((f) => f.endsWith('.js') && !/^(jquery|analytics|export|designer|ui|util|schema|themes|qrcode|collaboration)/.test(f))

const legacy = []
for (const file of LEGACY_FILES) {
  const src = fs.readFileSync(path.join(ASSETS, file), 'utf8')
  const base = path.basename(file, '.js')
  for (const kind of ['addShape', 'addConnector']) {
    for (const chunk of src.split(`Schema.${kind}(`).slice(1)) {
      const name = /^\{\s*name:"([^"]+)"/.exec(chunk)
      if (!name) continue
      const head = chunk.slice(0, 600)
      const title = /title:"((?:[^"\\]|\\.)*)"/.exec(head)?.[1] ?? ''
      const category = /category:"([^"]+)"/.exec(head)?.[1] ?? base
      legacy.push({
        file,
        name: name[1],
        title: decode(title),
        category: kind === 'addConnector' ? `${category}:connector` : category,
      })
    }
  }
}
function decode(s) {
  return s.replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\"/g, '"')
}

/** 当前注册表里的图形 name：静态 shapes/*.ts + 网络图标名表 */
const current = new Map()
for (const f of fs.readdirSync(SHAPES)) {
  const p = path.join(SHAPES, f)
  if (fs.statSync(p).isDirectory() || !f.endsWith('.ts') || /netIcon|iconShape|networkLoader/.test(f)) continue
  const src = fs.readFileSync(p, 'utf8')
  for (const m of src.matchAll(/name: '([^']+)'/g)) current.set(m[1], path.basename(f, '.ts'))
}
const names = JSON.parse(/= (\{[\s\S]*?\})\n/.exec(fs.readFileSync(path.join(SHAPES, 'netIconNames.ts'), 'utf8'))[1])
for (const list of Object.values(names)) for (const n of list) current.set(n, 'network')

const net = legacy.filter((s) => NETWORK_FILES.has(s.file))
const rest = legacy.filter((s) => !NETWORK_FILES.has(s.file))
console.log(`旧网络素材（已转换）: ${net.length} 个，注册表命中 ${net.filter((s) => current.has(s.name)).length}`)
console.log(`其余旧 Schema 图形: ${rest.length} 个`)
const byCat = new Map()
for (const s of rest) {
  if (!byCat.has(s.category)) byCat.set(s.category, { total: 0, hit: 0, missing: [], files: new Set() })
  const e = byCat.get(s.category)
  e.total++
  e.files.add(s.file)
  if (current.has(s.name)) e.hit++
  else e.missing.push({ name: s.name, title: s.title })
}

const rows = [...byCat.entries()].sort((a, b) => b[1].total - a[1].total)
console.log(`旧 Schema 图形（不含已转换的 5 个网络分类）: ${rows.reduce((n, [, e]) => n + e.total, 0)} 个 / ${rows.length} 个分类`)
console.log(`当前注册表图形: ${current.size} 个\n`)
console.log('分类                 旧图形  已覆盖  缺失   旧文件')
for (const [cat, e] of rows) {
  console.log(
    `${cat.padEnd(20)} ${String(e.total).padStart(5)} ${String(e.hit).padStart(7)} ${String(e.missing.length).padStart(6)}   ${[...e.files].join(', ')}`,
  )
}
if (process.argv.includes('--json')) {
  const out = process.argv[process.argv.indexOf('--json') + 1]
  fs.writeFileSync(path.resolve(out), JSON.stringify(Object.fromEntries(rows), null, 1))
  console.log(`\n明细已写入 ${out}`)
}
console.log('\n── 缺失清单（按分类）──')
for (const [cat, e] of rows) {
  if (!e.missing.length) continue
  console.log(`\n[${cat}] 缺 ${e.missing.length}：`)
  console.log('  ' + e.missing.map((m) => (m.title ? `${m.name}(${m.title})` : m.name)).join(', '))
}
