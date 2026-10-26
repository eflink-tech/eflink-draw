// packages/draw/src/DrawEditor.tsx
// 组件库主组件：整幅绘图编辑器（布局 + 画布 + AI 助手），挂载即自动恢复上次文档
import { useEffect } from 'react'
import { I18nProvider, normalizeLocale, type OfficeLocale } from '@eflink-tech/office-kit'
import { AppLayout } from '@/components/layout/AppLayout'
import { TopBar } from '@/components/layout/TopBar'
import { LeftPanel } from '@/components/layout/LeftPanel'
import { RightPanel } from '@/components/layout/RightPanel'
import { BottomBar } from '@/components/layout/BottomBar'
import { Canvas } from '@/components/canvas/Canvas'
import { AIAssistantRoot } from '@/components/ai/AIAssistantRoot'
import { AIChatPanel } from '@/components/ai/AIChatPanel'
import { useEditorStore } from '@/store/editorStore'
import { loadDocumentFromStorage, loadFromRemote } from '@/core/editor/persistence'
import { DRAW_MESSAGES } from '@/i18n/messages'
import { setDrawLocale } from '@/i18n/runtime'

/** 品牌区配置：顶栏左上角的 logo 与产品名 */
export interface DrawEditorBrand {
  logo?: string;
  name: string;
}

export interface DrawEditorProps {
  /** 界面语言（zh-CN / en / es / pt-BR），默认 zh-CN */
  locale?: OfficeLocale | string;
  /** 品牌区（logo + 产品名）；不传则用默认「易飞绘图」 */
  branding?: DrawEditorBrand | false;
}

export function DrawEditor({ locale, branding }: DrawEditorProps) {
  const resolved = normalizeLocale(locale);
  // 非 React 模块（store / AI / 文件操作）读取同一份语言
  setDrawLocale(resolved);
  return (
    <I18nProvider locale={resolved} messages={DRAW_MESSAGES}>
      <DrawEditorInner branding={branding} />
    </I18nProvider>
  );
}

function DrawEditorInner({ branding }: Omit<DrawEditorProps, 'locale'>) {
  // 启动自动恢复：先载入本地缓存（即时），再异步拉取远端覆盖（远端为权威数据源）
  useEffect(() => {
    const saved = loadDocumentFromStorage()
    if (saved) useEditorStore.getState().loadDocument(saved)
    void loadFromRemote().then((doc) => {
      if (doc) useEditorStore.getState().loadDocument(doc)
    })

    // 离页拦截 bridge：宿主（EditorLeaveGuard）通过它读取脏状态、触发保存、清理本地草稿
    ;(window as unknown as Record<string, unknown>).__eflinkEditorBridge = {
      isDirty: () => useEditorStore.getState().isDirty,
      save: () => {
        useEditorStore.getState().saveDocument()
      },
      discard: () => {
        try {
          localStorage.removeItem('efdraw:document:v1')
        } catch {
          /* ignore */
        }
      },
    }
    return () => {
      delete (window as unknown as Record<string, unknown>).__eflinkEditorBridge
    }
  }, [])

  return (
    <>
      <AppLayout
        topBar={<TopBar branding={branding} />}
        leftPanel={<LeftPanel />}
        canvas={<Canvas />}
        rightPanel={<RightPanel />}
        bottomBar={<BottomBar />}
        aiPanel={<AIChatPanel />}
      />
      <AIAssistantRoot />
    </>
  )
}
