// src/components/ai/SettingsPage.tsx
import { useEffect, useState } from 'react'
import { useI18n } from '@eflink-tech/office-kit'
import { settingsStore } from '../../ai/db'
import { AIService } from '../../ai/aiService'
import type { AISettings } from '../../ai/types'
import { ACCENT_COLOR } from './theme'
import { drawT } from '@/i18n/runtime'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  return drawT('draw.ai.actionFailedRetry')
}

export const SettingsPage = () => {
  const { t } = useI18n()
  const [settings, setSettings] = useState<AISettings>({
    baseUrl: '',
    apiKey: '',
    model: '',
  })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    settingsStore
      .getSettings()
      .then((s) => {
        setSettings(s)
        setLoading(false)
      })
      .catch((err: unknown) => {
        // 配置读取失败也要给出反馈并允许页面继续使用（可重新填写保存）
        setLoadError(getErrorMessage(err))
        setLoading(false)
      })
  }, [])

  const handleChange = (field: keyof AISettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = async () => {
    if (!confirm(t('draw.ai.resetConfirm'))) return
    setResetting(true)
    setTestResult(null)
    try {
      await settingsStore.resetSettings()
      setSettings({ baseUrl: '', apiKey: '', model: '' })
      setTestResult({ success: true, message: t('draw.ai.resetDone') })
    } catch (error: unknown) {
      setTestResult({ success: false, message: t('draw.ai.resetFailed', { reason: getErrorMessage(error) }) })
    }
    setResetting(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setTestResult(null)

    try {
      await settingsStore.saveSettings(settings)
    } catch (error: unknown) {
      setTestResult({ success: false, message: t('draw.ai.saveFailed', { reason: getErrorMessage(error) }) })
      setSaving(false)
      return
    }

    // 连通性自检：用最小请求（max_tokens=1）验证密钥/地址可达，
    // 不走 sendMessage（后者要求 JSON actions 格式，正常回复也会误报）
    const ping = await AIService.ping(settings)
    setTestResult(
      ping.ok
        ? { success: true, message: t('draw.ai.savedConnected') }
        : {
            success: false,
            message: t('draw.ai.savedPingFailed', { error: ping.error ?? t('draw.ai.error.unknown') }),
          },
    )
    setSaving(false)
  }

  if (loading) {
    return <div>{t('draw.ai.loading')}</div>
  }

  return (
    <div className="settings-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>{t('draw.ai.settingsTitle')}</h2>

      {loadError && (
        <div
          role="alert"
          style={{
            padding: '12px',
            backgroundColor: '#f8d7da',
            border: '1px solid #dc3545',
            borderRadius: '4px',
            color: '#721c24',
            marginBottom: '20px',
          }}
        >
          {t('draw.ai.loadSettingsFailed', { error: loadError })}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="settings-baseUrl" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
          API Base URL
        </label>
        <input
          id="settings-baseUrl"
          type="text"
          placeholder="https://api.openai.com/v1"
          value={settings.baseUrl}
          onChange={(e) => handleChange('baseUrl', e.target.value)}
          autoComplete="off"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="settings-apiKey" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
          API Key
        </label>
        <input
          id="settings-apiKey"
          type="password"
          placeholder="API Key"
          value={settings.apiKey}
          onChange={(e) => handleChange('apiKey', e.target.value)}
          autoComplete="new-password"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
        {/* 已存密钥的掩码提示：让用户能确认是否已有配置，同时不暴露完整密钥 */}
        {settings.apiKey && (
          <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#888' }}>
            {t('draw.ai.currentlySaved', { masked: settingsStore.maskApiKey(settings.apiKey) })}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="settings-model" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
          Model
        </label>
        <input
          id="settings-model"
          type="text"
          placeholder="gpt-4o"
          value={settings.model}
          onChange={(e) => handleChange('model', e.target.value)}
          autoComplete="off"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      </div>

      <div
        style={{
          padding: '12px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px',
          marginBottom: '20px',
        }}
      >
        <strong>{t('draw.ai.hintLabel')}</strong>
        {t('draw.ai.multimodalHint')}
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={() => void handleSave()}
          disabled={saving || loading}
          style={{
            padding: '10px 20px',
            backgroundColor: ACCENT_COLOR,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? t('draw.ai.saving') : t('action.save')}
        </button>

        <button
          onClick={() => void handleReset()}
          disabled={resetting || loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: resetting ? 'not-allowed' : 'pointer',
          }}
        >
          {resetting ? t('draw.ai.clearing') : t('draw.ai.clearConfig')}
        </button>
      </div>

      {testResult && (
        <div
          role="alert"
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: testResult.success ? '#d4edda' : '#f8d7da',
            border: `1px solid ${testResult.success ? '#28a745' : '#dc3545'}`,
            borderRadius: '4px',
            color: testResult.success ? '#155724' : '#721c24',
          }}
        >
          {testResult.message}
        </div>
      )}
    </div>
  )
}
