// 在所有测试导入之前注册 fake-indexeddb 全局变量
// 这样 Dexie 等依赖 IndexedDB 的库才能正确初始化
import 'fake-indexeddb/auto'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
// 测试环境同样注册界面文案字典（生产由 DrawEditor 入口注册），
// 否则组件里的 t() 会回落到原始消息键
import '@/i18n/messages'

afterEach(cleanup)
