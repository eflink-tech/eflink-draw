import { useMemo } from 'react'
import { X } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { useUIStore } from '@/store/uiStore'
import { isLinker, isTextOnlyShape } from '@/types'
import { FillSection, LineSection, ShadowSection } from '@/components/panels/sections/ShapeSection'
import { MetricSection } from '@/components/panels/sections/MetricSection'
import { TextSection } from '@/components/panels/sections/TextSection'
import { PageSection } from '@/components/panels/sections/PageSection'

export function RightPanel() {
  const selectedIds = useEditorStore((s) => s.selectedIds)
  const elements = useEditorStore((s) => s.document.elements)
  const toggleRightPanel = useUIStore((s) => s.toggleRightPanel)

  const first = useMemo(() => {
    if (selectedIds.size === 0) return null
    return elements[[...selectedIds][0]!] ?? null
  }, [selectedIds, elements])

  return (
    <div className="flex flex-col h-full text-xs">
      {/* 面板头部 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#e0e0e0] bg-[#fafafa]">
        <span className="font-medium text-[#333]">属性</span>
        <button
          className="p-1 rounded text-[#999] hover:bg-[#f0f0f0] hover:text-[#333]"
          onClick={toggleRightPanel}
          title="关闭属性面板"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {first == null ? (
          /* 无选中 — 页面设置 */
          <PageSection />
        ) : isLinker(first) ? (
          /* 连线 — 线条（含线型）+ 文本 */
          <>
            <LineSection first={first} />
            <TextSection first={first} />
          </>
        ) : isTextOnlyShape(first) ? (
          /* 纯文本 — 度量 + 文本（无填充/线条/阴影） */
          <>
            <MetricSection first={first} />
            <TextSection first={first} />
          </>
        ) : (
          /* 图形 — 填充 + 线条 + 度量 + 文本 */
          <>
            <FillSection first={first} />
            <LineSection first={first} />
            <MetricSection first={first} />
            <TextSection first={first} />
            <ShadowSection first={first} />
          </>
        )}
      </div>
    </div>
  )
}
