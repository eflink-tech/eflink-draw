// src/components/ai/TemplateLibrary.tsx
import { useEffect, useState, type KeyboardEvent } from 'react'
import { useI18n } from '@eflink-tech/office-kit'
import { templateStore } from '../../ai/db'
import type { Template } from '../../ai/types'
import { drawT } from '@/i18n/runtime'
import { translateTitle } from '@/i18n'
import './TemplateLibrary.css'

interface TemplateLibraryProps {
  onSelect?: (template: Template) => void
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return drawT('draw.ai.templateLoadFailed')
}

export function TemplateLibrary({ onSelect }: TemplateLibraryProps) {
  const { t, locale } = useI18n()
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
    return <div>{t('draw.ai.templatesLoading')}</div>
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#d32f2f' }}>
        <p>{t('draw.ai.loadFailed', { error })}</p>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div style={{ padding: '20px', color: '#666' }}>
        <p>{t('draw.ai.templatesEmpty')}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>{t('draw.ai.commandTitle')}</h2>
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
            {/* 内置模板名/描述是中文原文素材，展示时查表翻译；prompt 原样送模型 */}
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>{translateTitle(template.name, locale)}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{translateTitle(template.description, locale)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
