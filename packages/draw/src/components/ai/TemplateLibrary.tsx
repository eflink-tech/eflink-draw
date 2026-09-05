// src/components/ai/TemplateLibrary.tsx
import { useEffect, useState, type KeyboardEvent } from 'react'
import { templateStore } from '../../ai/db'
import type { Template } from '../../ai/types'
import './TemplateLibrary.css'

interface TemplateLibraryProps {
  onSelect?: (template: Template) => void
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return '加载模板失败'
}

export function TemplateLibrary({ onSelect }: TemplateLibraryProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    templateStore
      .seedBuiltin()
      .then(() => templateStore.getBuiltinTemplates())
      .then((list) => {
        setTemplates(list)
        setLoading(false)
      })
      .catch((err: unknown) => {
        setError(getErrorMessage(err))
        setLoading(false)
      })
  }, [])

  const handleCardKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    template: Template,
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.(template)
    }
  }

  if (loading) {
    return <div>加载模板中...</div>
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#d32f2f' }}>
        <p>加载失败: {error}</p>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div style={{ padding: '20px', color: '#666' }}>
        <p>暂无模板</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>模板库</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '16px',
        }}
      >
        {templates.map((template) => (
          <div
            key={template.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect?.(template)}
            onKeyDown={(e) => handleCardKeyDown(e, template)}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
            }}
            className="template-card"
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{template.icon}</div>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>{template.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{template.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
