// src/components/common/PromptDialog.tsx
// 通用单行输入浮层（重命名文件用）：蒙层 + 居中卡片 + 自动聚焦 + Enter 提交
import { useEffect, useRef } from 'react'

interface PromptDialogProps {
  title: string
  defaultValue: string
  onSubmit: (value: string) => void
  onCancel: () => void
}

export function PromptDialog({ title, defaultValue, onSubmit, onCancel }: PromptDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const submit = () => onSubmit(inputRef.current?.value ?? '')

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="w-72 rounded-lg bg-white p-4 shadow-xl">
        <div className="mb-3 text-sm font-medium text-[#333]">{title}</div>
        <input
          ref={inputRef}
          defaultValue={defaultValue}
          className="w-full border border-[#ccc] rounded px-2 py-1.5 text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
            if (e.key === 'Escape') onCancel()
          }}
        />
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            className="rounded px-3 py-1 text-xs border border-[#ddd] hover:bg-gray-50"
            onClick={onCancel}
          >
            取消
          </button>
          <button
            type="button"
            className="rounded px-3 py-1 text-xs bg-[#c00] text-white hover:bg-[#a00]"
            onClick={submit}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  )
}
