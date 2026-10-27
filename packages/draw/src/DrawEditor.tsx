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
import { loadDocumentFromStorage, loadFromRemote, STORAGE_KEY } from '@/core/editor/persistence'
import { DRAW_MESSAGES } from '@/i18n/messages'
import { setDrawLocale } from '@/i18n/runtime'
import { builtinEditorBrand, type EditorBrandId } from '@/brand'
import type { OfficeHeaderBrand } from '@eflink-tech/office-kit'

/** 品牌区配置：顶栏左上角的 logo 与产品名 */
export interface DrawEditorBrand {
  logo?: string;
  name: string;
}

export interface DrawEditorProps {
  /** 界面语言（zh-CN / en / es / pt-BR），默认 zh-CN */
  locale?: OfficeLocale | string;
  /**
   * 品牌区：'doculuma' | 'eflink' 选内置品牌，传对象完全自定义，false 隐藏品牌区。
   * 缺省 'doculuma'。
   */
  branding?: DrawEditorBrand | false | EditorBrandId;
}

/** 品牌参数归一：字符串选内置品牌，对象原样使用，缺省 doculuma */
function resolveBranding(branding: DrawEditorProps['branding']): OfficeHeaderBrand | false {
  if (branding === false) return false;
  if (branding === 'eflink' || branding === 'doculuma') return builtinEditorBrand(branding);
  return branding ?? builtinEditorBrand('doculuma');
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

    // 离页拦截 bridge：宿主（EditorLeaveGuard）通过它读取脏状态、触发保存、清理本地草稿。
    // __eflinkEditorBridge 是旧宿主的过渡期别名（同一对象），确认宿主全部改用新名后移除。
    const bridgeRoot = window as unknown as Record<string, unknown>
    bridgeRoot.__doculumaEditorBridge = {
      isDirty: () => useEditorStore.getState().isDirty,
      save: () => {
        useEditorStore.getState().saveDocument()
      },
      discard: () => {
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          /* ignore */
        }
      },
    }
    bridgeRoot.__eflinkEditorBridge = bridgeRoot.__doculumaEditorBridge
    return () => {
      delete bridgeRoot.__doculumaEditorBridge
      delete bridgeRoot.__eflinkEditorBridge
    }
  }, [])

  const resolvedBranding = resolveBranding(branding)

  return (
    <>
      <AppLayout
        topBar={<TopBar branding={resolvedBranding} />}
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
