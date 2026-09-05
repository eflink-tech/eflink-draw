import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const srcDir = fileURLToPath(new URL('./src/', import.meta.url))

// 库构建：ESM + 类型（tsc 单独产出）+ 单文件 styles.css（含 tailwind 工具类与组件样式）
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    // watch 模式（pnpm dev）不清空 dist，保留 tsc 产出的 dist/types；生产构建经 --emptyOutDir 显式清空
    emptyOutDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      // 仅外部化直接依赖：传递依赖（如 react-konva 的 react-reconciler）打包进产物，
      // 避免 pnpm 严格隔离下消费方无法解析
      external: (id) =>
        /^(react|react-dom|react\/jsx-runtime|konva|react-konva|dexie|lucide-react|openai|use-image|zustand)/.test(id),
      output: {
        assetFileNames: (asset) =>
          asset.names?.[0]?.endsWith('.css') ? 'styles.css' : 'assets/[name][extname]',
      },
    },
  },
})
