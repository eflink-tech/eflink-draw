// 页面设置（无选中时显示；写 document.page）
import { useEditorStore } from '@/store/editorStore'
import { effectivePageSize } from '@/core/editor/grid'
import { ColorButton } from '@/components/common/ColorPicker'
import { NumField, Row, Section } from '../fields'

export function PageSection() {
  const page = useEditorStore((s) => s.document.page)
  const updatePage = useEditorStore((s) => s.updatePage)

  // portrait 约定：存储值渲染时横竖交换，面板按生效尺寸显示与写回
  const size = effectivePageSize(page)
  const commitSize = (field: 'width' | 'height', value: number) => {
    if (page.orientation === 'portrait') {
      updatePage(field === 'width' ? { height: value } : { width: value })
    } else {
      updatePage(field === 'width' ? { width: value } : { height: value })
    }
  }

  return (
    <Section title="页面设置">
      <Row label="宽度">
        <NumField value={size.width} min={100} live onCommit={(v) => commitSize('width', v)} />
      </Row>
      <Row label="高度">
        <NumField value={size.height} min={100} live onCommit={(v) => commitSize('height', v)} />
      </Row>
      <Row label="背景色">
        <ColorButton
          value={page.backgroundColor === 'transparent' ? null : page.backgroundColor}
          transparent
          onSelect={(rgb) => updatePage({ backgroundColor: rgb ?? 'transparent' })}
        />
      </Row>
      <Row label="网格">
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={page.showGrid}
            onChange={(e) => updatePage({ showGrid: e.target.checked })}
          />
          <span>显示网格</span>
        </label>
      </Row>
      <Row label="网格大小">
        <div className="flex gap-1">
          {[
            { label: '小', v: 10 },
            { label: '正常', v: 15 },
            { label: '大', v: 20 },
            { label: '很大', v: 30 },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              className={`rounded border px-2 py-0.5 text-[11px] ${
                page.gridSize === o.v ? 'border-[#c00] bg-[#ffecec] text-[#a00]' : 'border-[#ddd] bg-white text-[#555] hover:border-[#833]'
              }`}
              onClick={() => updatePage({ gridSize: o.v })}
            >
              {o.label}
            </button>
          ))}
        </div>
      </Row>
    </Section>
  )
}
