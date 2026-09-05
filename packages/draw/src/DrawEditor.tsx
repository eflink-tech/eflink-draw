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
import { loadDocumentFromStorage } from '@/core/editor/persistence'

export function DrawEditor() {
  // 启动自动恢复：读到合法持久化文档则载入（StrictMode 下 effect 重跑两次，loadDocument 幂等）
  useEffect(() => {
    const saved = loadDocumentFromStorage()
    if (saved) useEditorStore.getState().loadDocument(saved)
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
