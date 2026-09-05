import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// monorepo 内直接引用组件库源码：demo 启动/构建无需先构建 packages/draw
const drawSrc = fileURLToPath(new URL('../../packages/draw/src/', import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^@eflink-tech\/draw\/styles\.css$/, replacement: `${drawSrc}styles.css` },
      { find: /^@eflink-tech\/draw$/, replacement: `${drawSrc}index.ts` },
      // 组件库源码内部使用 '@/...' 别名，直连源码编译时需一并映射
      { find: '@', replacement: drawSrc },
    ],
  },
})
