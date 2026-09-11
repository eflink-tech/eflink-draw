// packages/draw/src/DrawEditor.tsx
// 组件库主组件：整幅绘图编辑器（布局 + 画布 + AI 助手），挂载即自动恢复上次文档
import { useEffect } from 'react'
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

export function DrawEditor() {
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
        topBar={<TopBar />}
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
