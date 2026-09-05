import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { Tooltip } from '@/components/common/Tooltip'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 图标内容（SVG 或 lucide 组件） */
  icon: ReactNode
  /** 工具提示文本 */
  title: string
  /** 是否激活状态 */
  active?: boolean
  /** 是否禁用 */
  disabled?: boolean
}

/**
 * 工具栏图标按钮
 * - 20×20px 图标区域
 * - hover 显示灰色背景
 * - active 状态显示蓝色背景
 * - 悬停显示自定义文字提示（替代原生 title，出现更快、样式统一）
 */
export function IconButton({ icon, title, active, disabled, className = '', ...rest }: IconButtonProps) {
  return (
    <Tooltip text={title} disabled={disabled}>
      <button
        disabled={disabled}
        className={[
          'inline-flex items-center justify-center w-7 h-7 rounded',
          'transition-colors duration-100',
          active
            ? 'bg-blue-100 text-blue-600'
            : 'text-[#555] hover:bg-[#e0e0e0]',
          disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
          className,
        ].join(' ')}
        {...rest}
      >
        {icon}
      </button>
    </Tooltip>
  )
}
