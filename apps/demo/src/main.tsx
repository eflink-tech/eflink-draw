import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@eflink-tech/draw/styles.css'
import './index.css'
import App from './App'
import { useEditorStore, useUIStore } from '@eflink-tech/draw'

// 调试/E2E 通道：Playwright 探针经 window.__store/__uiStore 读取与驱动编辑器状态
;(window as unknown as Record<string, unknown>).__store = useEditorStore
;(window as unknown as Record<string, unknown>).__uiStore = useUIStore

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
