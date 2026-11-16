// packages/draw/src/DrawEditor.tsx
// 组件库主组件：整幅绘图编辑器（布局 + 画布 + AI 助手），挂载即自动恢复上次文档
import { useEffect, useState } from 'react'
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
import {
  loadDocumentFromStorage,
  loadFromRemote,
  STORAGE_KEY,
  suppressDocumentPersistence,
} from '@/core/editor/persistence'
import { createEmptyDocument, type DocumentData } from '@/types'
import { DRAW_MESSAGES } from '@/i18n/messages'
import { setDrawLocale, drawT } from '@/i18n/runtime'
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
  /**
   * 嵌入式模式：不恢复/写入本地与远端文档，也不注册离页保存 bridge。
   * 用于宿主临时编辑一份独立文档（如 Markdown 里内嵌的图表文档），
   * 文档由宿主自行保存。缺省 false（独立工作区编辑器）。
   */
  embedded?: boolean;
  /** 嵌入式模式的初始文档；缺省空文档 */
  initialDocument?: DocumentData;
  /**
   * 显式指定的启动画板（如从「我的文档」列表打开）。提供时不再先渲染本地缓存：
   * draw 的本地缓存键全局唯一（不按画板分），先缓存后远端会闪出另一画板的内容。
   * 远端加载失败才回退本地缓存（保存侧已有跨画板污染拦截）。
   */
  bootDocId?: string;
}

/** 品牌参数归一：字符串选内置品牌，对象原样使用，缺省 doculuma */
function resolveBranding(branding: DrawEditorProps['branding']): OfficeHeaderBrand | false {
  if (branding === false) return false;
  if (branding === 'eflink' || branding === 'doculuma') return builtinEditorBrand(branding);
  return branding ?? builtinEditorBrand('doculuma');
}

export function DrawEditor({ locale, branding, embedded = false, initialDocument, bootDocId }: DrawEditorProps) {
  const resolved = normalizeLocale(locale);
  // 非 React 模块（store / AI / 文件操作）读取同一份语言
  setDrawLocale(resolved);
  return (
    <I18nProvider locale={resolved} messages={DRAW_MESSAGES}>
      <DrawEditorInner
        branding={branding}
        embedded={embedded}
        initialDocument={initialDocument}
        bootDocId={bootDocId}
      />
    </I18nProvider>
  );
}

function DrawEditorInner({
  branding,
  embedded = false,
  initialDocument,
  bootDocId,
}: Omit<DrawEditorProps, 'locale'>) {
  // 指定启动画板：等远端加载落定再挂编辑器，避免先上屏本地缓存（可能是另一画板）再被覆盖
  const [ready, setReady] = useState(!bootDocId)
  useEffect(() => {
    if (embedded) {
      // 嵌入式：初始文档由宿主提供，整段编辑会话不触碰本地/远端存储
      const release = suppressDocumentPersistence()
      useEditorStore.getState().loadDocument(initialDocument ?? createEmptyDocument())
      setReady(true)
      return release
    }

    let cancelled = false
    // 启动自动恢复：未指定画板时先载入本地缓存（即时），再异步拉取远端覆盖（远端为权威数据源）；
    // 指定画板时跳过本地缓存，只等远端，失败才回退缓存兜底
    if (!bootDocId) {
      const saved = loadDocumentFromStorage()
      if (saved) useEditorStore.getState().loadDocument(saved)
    }
    void loadFromRemote().then((doc) => {
      if (cancelled) return
      if (doc) useEditorStore.getState().loadDocument(doc)
      else if (bootDocId) {
        const cached = loadDocumentFromStorage()
        if (cached) useEditorStore.getState().loadDocument(cached)
      }
      setReady(true)
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

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        {drawT('shell.loading')}
      </div>
    )
  }

  return (
    <>
      <AppLayout
        contained={embedded}
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
