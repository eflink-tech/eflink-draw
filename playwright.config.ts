import { defineConfig } from '@playwright/test'

// 端口可用 E2E_PORT 覆盖：5174 常被本机其他 eflink 子项目的 dev server 占用
const port = Number(process.env.E2E_PORT ?? 5174)

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'on-first-retry',
    launchOptions: {
      channel: 'chrome',
    },
  },
  webServer: {
    // e2e 跑生产构建（vite preview）：dev 实时编译整库在 CI 弱机上过慢，preview 更快更稳定
    command: `pnpm --filter eflink-draw-demo build && pnpm --filter eflink-draw-demo exec vite preview --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
