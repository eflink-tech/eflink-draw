// 在所有测试导入之前注册 fake-indexeddb 全局变量
// 这样 Dexie 等依赖 IndexedDB 的库才能正确初始化
import 'fake-indexeddb/auto'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(cleanup)
