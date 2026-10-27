// 素材本地化覆盖率守卫：所有含中文的采集素材名（图形标题/分类/品类/图标名/模板名与节点文案）
// 必须能在 TITLE_INDEX 里查到译文，否则英文/西语/葡语界面会漏出中文。
// 新增中文素材时只需在 shapeTitles.ts 或 contentTitles.ts 补一行，本测试会列出缺失项。
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { translateTitle } from '@/i18n'
import { SHAPE_TITLE_I18N } from '@/i18n/shapeTitles'
import { CONTENT_TITLE_I18N } from '@/i18n/contentTitles'
import { shapeRegistry } from '@/core/schema/registry'
import '@/core/schema/shapes'
import { SHAPE_CATEGORIES } from '@/store/uiStore'
import { NET_GROUPS, NET_VENDORS } from '@/core/schema/shapes/netIconManifest'
import { NET_GROUP_SHAPE_TITLES } from '@/core/schema/shapes/netIconTitles'
import { DRAW_TEMPLATES, TEMPLATE_CATEGORIES } from '@/templates'

const HAS_CJK = /[一-鿿]/
const CHECK_LOCALES = ['en', 'es', 'pt-BR'] as const

/** 未被查表翻译命中的中文串（translateTitle 原样返回即视为缺失），三语逐列检查 */
function missingFrom(label: string, values: Array<string | undefined | null>, out: string[]) {
  for (const value of values) {
    if (!value || !HAS_CJK.test(value)) continue
    for (const locale of CHECK_LOCALES) {
      if (translateTitle(value, locale) === value) {
        out.push(`${label}[${locale}]: ${value}`)
        break
      }
    }
  }
}

/** LeftPanel 的手写图形清单标题（CATEGORY_SHAPES）：源码正则提取，避免为此改动组件导出面 */
function curatedPanelTitles(): string[] {
  const file = resolve(process.cwd(), 'src/components/layout/LeftPanel.tsx')
  const src = readFileSync(file, 'utf8')
  return [...src.matchAll(/title: '([^']+)'/g)].map((m) => m[1]!)
}

describe('素材标题本地化', () => {
  it('shapeTitles 与 contentTitles 键不重复（重复时 index 合并会静默单边生效）', () => {
    const duplicated = Object.keys(SHAPE_TITLE_I18N).filter((key) => key in CONTENT_TITLE_I18N)
    expect(duplicated, `两表重复键：${duplicated.join(' / ')}`).toEqual([])
  })

  it('图形库、分类、图标品类与模板全部有译文', () => {
    const missing: string[] = []

    missingFrom('图形库分类', SHAPE_CATEGORIES.map((c) => c.name), missing)
    missingFrom('图形库子分组', SHAPE_CATEGORIES.flatMap((c) => c.children?.map((ch) => ch.name) ?? []), missing)

    const shapes = shapeRegistry
      .getCategories()
      .flatMap((category) => shapeRegistry.getShapesByCategory(category))
    expect(shapes.length).toBeGreaterThan(100)
    missingFrom('图形标题', shapes.map((s) => s.title), missing)
    missingFrom('图形分组名', shapes.map((s) => s.groupName), missing)
    missingFrom('图形默认文案', shapes.flatMap((s) => s.textBlock?.map((b) => b.text) ?? []), missing)
    missingFrom('手写面板清单', curatedPanelTitles(), missing)

    missingFrom('图标厂商', NET_VENDORS.map((v) => v.name), missing)
    missingFrom('图标品类', NET_GROUPS.map((g) => g.name), missing)
    missingFrom(
      '图标名称',
      Object.values(NET_GROUP_SHAPE_TITLES).flatMap((blob) => blob.split('\u001e')),
      missing,
    )

    missingFrom('模板分类', TEMPLATE_CATEGORIES.map((c) => c.label), missing)
    missingFrom('模板标题', DRAW_TEMPLATES.map((t) => t.title), missing)
    missingFrom('模板描述', DRAW_TEMPLATES.map((t) => t.description), missing)
    missingFrom(
      '模板文案',
      DRAW_TEMPLATES.flatMap((t) => [
        ...t.nodes.flatMap((n) => [n.text, ...(n.texts ?? [])]),
        ...t.links.map((l) => l.text),
      ]),
      missing,
    )

    // 厂商 tab 下品类名会去掉厂商前缀，翻译必须发生在截断之前，否则漏中文
    const shortCjk = NET_GROUPS
      .map((g) => {
        const name = translateTitle(g.name, 'en')
        const vendor = translateTitle(NET_VENDORS.find((v) => v.id === g.vendor)?.name ?? '', 'en')
        return name.startsWith(vendor) ? name.slice(vendor.length).trim() : name
      })
      .filter((name) => HAS_CJK.test(name))
    expect(shortCjk, `厂商 tab 短名漏出中文：${shortCjk.join(' / ')}`).toEqual([])

    expect(
      missing,
      `缺少 ${missing.length} 项素材译文：\n${missing.slice(0, 60).join('\n')}${missing.length > 60 ? '\n…' : ''}`,
    ).toEqual([])
  })
})
