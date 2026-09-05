import type { ReactNode } from 'react'

interface BaseIconProps {
  size?: number
  children: ReactNode
  className?: string
}

/**
 * 统一 SVG 图标容器
 * 强制 Lucide 设计规范：
 * - viewBox="0 0 24 24"
 * - strokeWidth=2
 * - strokeLinecap="round"
 * - strokeLinejoin="round"
 * - fill="none"
 * - color="currentColor"
 */
export function BaseIcon({ size = 20, children, className = '' }: BaseIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  )
}
