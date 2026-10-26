// 模板选择弹窗：文件 → 从模板新建…
// 左分类 / 中缩略图画廊 / 右预览与落点（新建画布 / 插入当前画布）
import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '@eflink-tech/office-kit'
import { translateTitle } from '@/i18n'
import { createPortal } from 'react-dom'
import {
  DRAW_TEMPLATES,
  TEMPLATE_CATEGORIES,
  buildTemplateDocument,
  buildTemplateThumbnail,
  type TemplateCategoryId,
  type TemplateSpec,
} from '@/templates'
import { useEditorStore } from '@/store/editorStore'
import { requestFitPage } from '@/core/editor/viewportEvents'

interface TemplatePickerDialogProps {
  onClose: () => void
}

type CategoryFilter = TemplateCategoryId | 'all'

const CATEGORY_LABEL: Record<TemplateCategoryId, string> = Object.fromEntries(
  TEMPLATE_CATEGORIES.map((c) => [c.id, c.label]),
) as Record<TemplateCategoryId, string>

export function TemplatePickerDialog({ onClose }: TemplatePickerDialogProps) {
  const { t: msg, locale } = useI18n()
  const tt = (title: string) => translateTitle(title, locale)
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(DRAW_TEMPLATES[0].id)

  // 缩略图由真实 builder 生成，只算一次（纯 SVG，无位图）
  const thumbnails = useMemo(() => {
    const map: Record<string, string> = {}
    for (const t of DRAW_TEMPLATES) map[t.id] = buildTemplateThumbnail(t)
    return map
  }, [locale])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = q
      ? DRAW_TEMPLATES
      : category === 'all'
        ? DRAW_TEMPLATES
        : DRAW_TEMPLATES.filter((t) => t.category === category)
    if (!q) return base
    return base.filter((t) =>
      [t.title, t.description, CATEGORY_LABEL[t.category], ...t.keywords,
        tt(t.title), tt(t.description), tt(CATEGORY_LABEL[t.category])]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [category, query, locale])

  const selected: TemplateSpec | undefined = useMemo(
    () => DRAW_TEMPLATES.find((t) => t.id === selectedId),
    [selectedId],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const applyNewCanvas = (spec: TemplateSpec) => {
    const store = useEditorStore.getState()
    if (
      Object.keys(store.document.elements).length > 0 &&
      !window.confirm(msg('draw.file.newConfirm'))
    ) {
      return
    }
    store.newDocumentFromTemplate(buildTemplateDocument(spec))
    requestFitPage()
    onClose()
  }

  const applyInsert = (spec: TemplateSpec) => {
    useEditorStore.getState().insertDocument(buildTemplateDocument(spec))
    requestFitPage()
    onClose()
  }

  return createPortal(
    <div
      data-testid="template-picker"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={msg('draw.template.title')}
        className="flex h-[640px] max-h-[88vh] w-[1000px] max-w-[94vw] flex-col overflow-hidden rounded-lg bg-white shadow-xl"
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between border-b border-[#eee] px-5 py-3">
          <div>
            <div className="text-sm font-medium text-[#333]">{msg('draw.template.title')}</div>
            <div className="mt-0.5 text-xs text-gray-400">
              {msg('draw.template.subtitle', { count: DRAW_TEMPLATES.length })}
            </div>
          </div>
          <button
            type="button"
            aria-label={msg('action.close')}
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-lg leading-none text-gray-500 hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* 分类 */}
          <div className="w-[152px] shrink-0 overflow-y-auto border-r border-[#eee] py-2">
            {([['all', msg('draw.template.all')] as const, ...TEMPLATE_CATEGORIES.map((c) => [c.id, tt(c.label)] as const)] as const).map(
              ([id, label]) => {
                const count =
                  id === 'all'
                    ? DRAW_TEMPLATES.length
                    : DRAW_TEMPLATES.filter((t) => t.category === id).length
                const active = category === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setCategory(id)}
                    className={`flex w-full items-center justify-between px-4 py-1.5 text-left text-xs ${
                      active ? 'bg-[#eef4ff] font-medium text-[#2f6bd8]' : 'text-[#444] hover:bg-gray-50'
                    }`}
                  >
                    <span>{label}</span>
                    <span className={active ? 'text-[#7aa1e8]' : 'text-gray-300'}>{count}</span>
                  </button>
                )
              },
            )}
          </div>

          {/* 画廊 */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="border-b border-[#eee] px-4 py-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={msg('draw.template.search')}
                aria-label={msg('draw.template.searchAria')}
                className="w-full rounded border border-[#ddd] px-2.5 py-1.5 text-xs outline-none focus:border-[#4a7fde]"
              />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              {list.length === 0 ? (
                <div className="py-16 text-center text-xs text-gray-400">{msg('draw.template.empty')}</div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {list.map((t) => {
                    const active = t.id === selectedId
                    return (
                      <button
                        key={t.id}
                        type="button"
                        data-template-id={t.id}
                        onClick={() => setSelectedId(t.id)}
                        onDoubleClick={() => applyNewCanvas(t)}
                        className={`rounded-md border p-1.5 text-left transition-colors ${
                          active
                            ? 'border-[#4a7fde] bg-[#f5f9ff] ring-1 ring-[#bcd2f7]'
                            : 'border-[#e5e7eb] hover:border-[#b9cdf0] hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className="h-[86px] w-full overflow-hidden rounded bg-white [&>svg]:h-full [&>svg]:w-full"
                          dangerouslySetInnerHTML={{ __html: thumbnails[t.id] }}
                        />
                        <div className="mt-1.5 truncate px-0.5 text-xs text-[#333]">{tt(t.title)}</div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 预览 */}
          <div data-testid="template-preview" className="flex w-[292px] shrink-0 flex-col border-l border-[#eee] p-4">
            {selected ? (
              <>
                <div
                  className="h-[180px] w-full overflow-hidden rounded border border-[#eee] bg-[#fafbfc] p-1 [&>svg]:h-full [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: thumbnails[selected.id] }}
                />
                <div className="mt-3 text-sm font-medium text-[#333]">{tt(selected.title)}</div>
                <div className="mt-1 text-[11px] text-gray-400">
                  {tt(CATEGORY_LABEL[selected.category])} ·{' '}
                  {msg('draw.template.nodes', { count: selected.nodes.length })} ·{' '}
                  {msg('draw.template.links', { count: selected.links.length })}
                </div>
                <div className="mt-2 text-xs leading-5 text-gray-500">{tt(selected.description)}</div>
                <div className="mt-auto flex flex-col gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => applyNewCanvas(selected)}
                    className="rounded bg-[#2f6bd8] px-3 py-2 text-xs font-medium text-white hover:bg-[#275cbb]"
                  >
                    {msg('draw.template.useNew')}
                  </button>
                  <button
                    type="button"
                    onClick={() => applyInsert(selected)}
                    className="rounded border border-[#d5dbe6] bg-white px-3 py-2 text-xs text-[#333] hover:bg-gray-50"
                  >
                    {msg('draw.template.insert')}
                  </button>
                  <div className="text-center text-[11px] text-gray-400">
                    {msg('draw.template.insertHint')}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-xs text-gray-400">
                {msg('draw.template.pickHint')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
