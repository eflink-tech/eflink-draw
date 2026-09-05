import { BaseIcon } from './BaseIcon'

/** 折线连线类型预览 */
export function LineTypeBrokenIcon() {
  return (
    <BaseIcon>
      <polyline points="3,17 9,7 15,12 21,5" />
    </BaseIcon>
  )
}

/** 曲线连线类型预览 */
export function LineTypeCurveIcon() {
  return (
    <BaseIcon>
      <path d="M3,17 C9,7 15,12 21,5" />
    </BaseIcon>
  )
}

/** 直线连线类型预览 */
export function LineTypeStraightIcon() {
  return (
    <BaseIcon>
      <line x1="3" y1="17" x2="21" y2="5" />
    </BaseIcon>
  )
}

/** 虚线样式预览 */
export function LineStyleDashedIcon() {
  return (
    <BaseIcon>
      <line x1="3" y1="12" x2="21" y2="12" strokeDasharray="4 2" />
    </BaseIcon>
  )
}

/** 点线样式预览 */
export function LineStyleDottedIcon() {
  return (
    <BaseIcon>
      <line x1="3" y1="12" x2="21" y2="12" strokeDasharray="1 3" />
    </BaseIcon>
  )
}

/** 实线样式预览 */
export function LineStyleSolidIcon() {
  return (
    <BaseIcon>
      <line x1="3" y1="12" x2="21" y2="12" />
    </BaseIcon>
  )
}

/** 实线箭头 */
export function ArrowStyleSolidIcon() {
  return (
    <BaseIcon>
      <line x1="5" y1="12" x2="17" y2="12" />
      <polygon points="17,8 23,12 17,16" fill="currentColor" stroke="none" />
    </BaseIcon>
  )
}

/** 虚线箭头 */
export function ArrowStyleDashedIcon() {
  return (
    <BaseIcon>
      <line x1="5" y1="12" x2="17" y2="12" strokeDasharray="4 2" />
      <polygon points="17,8 23,12 17,16" fill="currentColor" stroke="none" />
    </BaseIcon>
  )
}

/** 无箭头 */
export function ArrowStyleNoneIcon() {
  return (
    <BaseIcon>
      <line x1="5" y1="12" x2="21" y2="12" />
      <circle cx="21" cy="12" r="2" fill="none" />
    </BaseIcon>
  )
}

/** 字体颜色图标（Type + 颜色下划线） */
export function FontColorIcon({ color = '#000' }: { color?: string }) {
  return (
    <div className="relative inline-flex">
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4,7 4,4 20,4 20,7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
      <div className="absolute bottom-0 left-0 h-[3px] w-full rounded" style={{ background: color }} />
    </div>
  )
}

/** 填充颜色图标（Bucket + 色块） */
export function FillColorIcon({ color = '#fff' }: { color?: string }) {
  return (
    <div className="relative inline-flex">
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      <div className="absolute bottom-0 left-1 right-1 h-[4px] rounded-sm border border-gray-300" style={{ background: color }} />
    </div>
  )
}
