// src/components/ai/SettingsPage.tsx
import { useEffect, useState } from 'react'
import { settingsStore } from '../../ai/db'
import { AIService } from '../../ai/aiService'
import type { AISettings } from '../../ai/types'
import { ACCENT_COLOR } from './theme'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  return '操作失败，请重试'
}

export const SettingsPage = () => {
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
    if (!confirm('确定要清空已保存的 AI 配置吗？此操作不可恢复。')) return
    setResetting(true)
    setTestResult(null)
    try {
      await settingsStore.resetSettings()
      setSettings({ baseUrl: '', apiKey: '', model: '' })
      setTestResult({ success: true, message: '已清空配置' })
    } catch (error: unknown) {
      setTestResult({ success: false, message: `清空失败：${getErrorMessage(error)}` })
    }
    setResetting(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setTestResult(null)

    try {
      await settingsStore.saveSettings(settings)
    } catch (error: unknown) {
      setTestResult({ success: false, message: `保存失败：${getErrorMessage(error)}` })
      setSaving(false)
      return
    }

    // 连通性自检：用最小请求（max_tokens=1）验证密钥/地址可达，
    // 不走 sendMessage（后者要求 JSON actions 格式，正常回复也会误报）
    const ping = await AIService.ping(settings)
    setTestResult(
      ping.ok
        ? { success: true, message: '已保存，连接正常' }
        : { success: false, message: `已保存，但连通性检测失败：${ping.error ?? '未知错误'}` },
    )
    setSaving(false)
  }

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div className="settings-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>AI 助手设置</h2>

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
          读取已保存配置失败：{loadError}
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
            当前已保存：{settingsStore.maskApiKey(settings.apiKey)}
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
        <strong>提示：</strong>AI 绘图依赖图片理解能力，请选择支持视觉的多模态模型（如 GPT-4o、Claude 3 Sonnet、Qwen-VL 等）。
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
          {saving ? '保存中...' : '保存'}
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
          {resetting ? '清空中...' : '清空配置'}
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
