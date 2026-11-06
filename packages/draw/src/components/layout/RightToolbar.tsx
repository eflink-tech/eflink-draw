// src/components/layout/RightToolbar.tsx
import { SlidersHorizontal } from 'lucide-react'
import { useI18n } from '@eflink-tech/office-kit'
import { IconButton } from '@/components/common/IconButton'
import { useUIStore } from '@/store/uiStore'

/**
 * 右侧竖排工具栏：贴窗口最右缘，仅保留属性面板开关。
 * - 始终渲染（专注模式下随 AppLayout 整体不渲染）
 * - AI 助手与设置入口已移到顶栏 actions 区（与其它办公编辑器一致）；
 *   设置改在 AI 面板内切换视图，模板库入口暂时隐藏，AI_OPEN_TEMPLATES 事件链路保留
 */
export function RightToolbar() {
  const { t } = useI18n()
  const rightVisible = useUIStore((s) => s.rightPanelVisible)

  return (
    <aside className="relative z-10 flex w-10 flex-shrink-0 flex-col items-center gap-1 border-l border-[#e0e0e0] bg-white py-2">
      <IconButton
        icon={<SlidersHorizontal size={16} />}
        title={t('draw.panel.propertiesPanel')}
        aria-label={t('draw.panel.propertiesPanel')}
        active={rightVisible}
        onClick={() => useUIStore.getState().toggleRightPanel()}
      />
    </aside>
  )
}
