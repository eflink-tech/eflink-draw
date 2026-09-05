import { test, expect } from '@playwright/test'

// ═══════════════════════════════════════
// 选择器常量（消除 magic string）
// ═══════════════════════════════════════

const SEL = {
  // AI 面板已改为常驻停靠形态（显隐由 uiStore.aiPanelVisible 控制），无浮窗气泡
  bubble: '[aria-label="AI 助手"]', // 停用：仅 TC2-TC8（fixme）尚引用，重写时移除
  collapse: '[aria-label="收起"]',
  send: '[aria-label="发送"]',
  input: '[aria-label="消息输入"]',
  setupCard: 'text=尚未配置 AI 服务',
  // 停用：「已生成」文案与模板入口随面板改版移除，TC2-TC8（fixme）重写时更新
  replyGenerated: 'text=已生成',
  templateBtn: 'button:has-text("📋 模板")',
  templateModal: 'text=模板库',
  orderTemplateCard: 'text=订单处理流程',
} as const

/**
 * 打开 AI 助手面板。
 * 显隐由 uiStore.aiPanelVisible 控制（TopBar「显示 AI 助手」同款开关），
 * 这里经 demo 暴露的 window.__uiStore 调试通道直接置位，避免依赖菜单层级。
 */
async function openAiPanel(page: Parameters<typeof test>[0]['page']) {
  await page.evaluate(() => {
    const ui = (
      window as unknown as {
        __uiStore?: { getState: () => { aiPanelVisible: boolean; toggleAiPanel: () => void } }
      }
    ).__uiStore
    if (ui && !ui.getState().aiPanelVisible) ui.getState().toggleAiPanel()
  })
  await page.waitForSelector(SEL.collapse)
}

/**
 * 注册一个 init script，拦截 IDBObjectStore.prototype.get，
 * 当 Dexie 查询 settings 表 key='main' 时直接返回预配置数据。
 *
 * 同时将真正的原始 get 方法缓存到 window._idbOrigGet，
 * 便于个别测试（TC1b）绕过 mock 直接调用真正的 IDB 实现。
 *
 * Dexie 在 onsuccess 中通过 event.target.result 读取结果，
 * 因此 mock 的 event 必须包含 target -> request 的引用。
 *
 * @param page Playwright page
 * @param resultData 查询 key='main' 时返回的数据；传 undefined 模拟"未配置"场景
 */
function registerSettingsMock(
  page: Parameters<typeof test>[0]['page'],
  resultData: object | undefined = {
    key: 'main',
    // AIService 强制 https（安全校验），mock 域名走 page.route 拦截，不会真实联网
    baseUrl: 'https://mock-ai.local',
    apiKey: 'test-key',
    model: 'test-model',
  },
) {
  return page.addInitScript((data: object | undefined) => {
    // 首次注册时，保存真正的原始方法（在原型被替换之前）
    // 后续 addInitScript（如 TC1b）可通过 window._idbOrigGet 访问
    if (!(window as unknown as Record<string, unknown>)._idbOrigGet) {
      ;(window as unknown as Record<string, unknown>)._idbOrigGet = IDBObjectStore.prototype.get
    }

    const originalGet = IDBObjectStore.prototype.get

    IDBObjectStore.prototype.get = function (key: IDBValidKey | IDBKeyRange) {
      if (
        this.transaction?.db?.name === 'efdraw-ai' &&
        this.name === 'settings' &&
        key === 'main'
      ) {
        const request = {
          result: data,
          error: null,
          readyState: 'done',
          source: this,
          transaction: this.transaction,
          onsuccess: null as ((ev: unknown) => void) | null,
          onerror: null as (() => void) | null,
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        }
        const event = { target: request, type: 'success' }
        setTimeout(() => {
          request.onsuccess?.(event)
        }, 0)
        return request as unknown as IDBRequest
      }
      return originalGet.call(this, key)
    }
  }, resultData)
}

/**
 * TC1b 专用：让 settings 表查询返回 undefined，模拟"未配置"场景。
 *
 * 注意：由于 addInitScript 会累积，beforeEach 注册的 mock 仍会运行并先匹配条件。
 * 因此此函数使用 window._idbOrigGet（由 registerSettingsMock 缓存的真正原始方法）
 * 绕过 mock 链，直接走真正的 IDB 路径，避免 beforeEach mock 的错误回调干扰。
 */
function overrideSettingsMockAsUnconfigured(page: Parameters<typeof test>[0]['page']) {
  return page.addInitScript(() => {
    const trueOriginalGet = (window as unknown as Record<string, unknown>)._idbOrigGet as
      | typeof IDBObjectStore.prototype.get
      | undefined

    IDBObjectStore.prototype.get = function (key: IDBValidKey | IDBKeyRange) {
      if (
        this.transaction?.db?.name === 'efdraw-ai' &&
        this.name === 'settings' &&
        key === 'main'
      ) {
        // 返回 undefined 结果，使 Dexie 认为 settings 表中无此 key
        const request = {
          result: undefined,
          error: null,
          readyState: 'done',
          source: this,
          transaction: this.transaction,
          onsuccess: null as ((ev: unknown) => void) | null,
          onerror: null as (() => void) | null,
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        }
        const event = { target: request, type: 'success' }
        setTimeout(() => {
          // 触发 Dexie 的 onsuccess（此时它指向 Dexie 的 handler）
          request.onsuccess?.(event)
          // 清理：阻止后续 mock 回调（如 beforeEach mock）重复触发
          request.onsuccess = null
        }, 0)
        return request as unknown as IDBRequest
      }
      // 非目标 key：使用真正的原始方法，避免走 beforeEach 的 mock 链
      return trueOriginalGet
        ? trueOriginalGet.call(this, key)
        : (IDBObjectStore.prototype.get as unknown as typeof trueOriginalGet).call(this, key)
    }
  })
}

/** 构造 Mock OpenAI chat/completions 响应 */
function buildMockResponse(content: string) {
  return JSON.stringify({
    choices: [{ message: { content } }],
  })
}

/**
 * 构造 OpenAI 流式（SSE）响应体。
 * aiService 现强制 stream:true，普通 JSON 响应体在流式解析下不会产生任何
 * delta 块，会被判为"无法解析 JSON"——mock 必须返回 SSE 格式。
 */
function buildStreamResponse(content: string) {
  const chunk = (obj: object) => `data: ${JSON.stringify(obj)}\n\n`
  return (
    chunk({ choices: [{ delta: { role: 'assistant' } }] }) +
    chunk({ choices: [{ delta: { content } }] }) +
    'data: [DONE]\n\n'
  )
}

/**
 * 通过 window.__store（DEV 模式下暴露的 useEditorStore）获取画布元素数量。
 * main.tsx 在 import.meta.env.DEV 下将 useEditorStore 挂到 window.__store。
 */
async function getElementCount(page: Parameters<typeof test>[0]['page']): Promise<number> {
  return page.evaluate(() => {
    const w = window as unknown as Record<string, unknown>
    const store = (w.__store ?? w.__ZUSTAND_STORE__) as
      | { getState: () => { document: { elements: Record<string, unknown> } } }
      | undefined
    if (!store) return -1
    const elements = store.getState().document.elements
    return elements ? Object.keys(elements).length : 0
  })
}

/** 通过 store 读取 linker（连线）数量 */
async function getLinkerCount(page: Parameters<typeof test>[0]['page']): Promise<number> {
  return page.evaluate(() => {
    const w = window as unknown as Record<string, unknown>
    const store = w.__store as {
      getState: () => { document: { elements: Record<string, { name: string }> } }
    }
    const elements = store.getState().document.elements
    return Object.values(elements).filter((el) => el.name === 'linker').length
  })
}

/** 根据文字内容查找非 linker 元素的真实 ID */
async function findElementIdByText(
  page: Parameters<typeof test>[0]['page'],
  text: string,
): Promise<string> {
  const id = await page.evaluate((targetText: string) => {
    const w = window as unknown as Record<string, unknown>
    const store = w.__store as {
      getState: () => {
        document: {
          elements: Record<string, { name: string; textBlock?: Array<{ text: string }> }>
        }
      }
    }
    const elements = store.getState().document.elements
    for (const [id, el] of Object.entries(elements)) {
      if (el && el.name !== 'linker' && el.textBlock && el.textBlock[0]?.text === targetText) {
        return id
      }
    }
    return null
  }, text)
  expect(id, `未找到文字为"${text}"的元素`).not.toBeNull()
  return id!
}

/** 读取指定元素的文字内容 */
async function readElementText(
  page: Parameters<typeof test>[0]['page'],
  elementId: string,
): Promise<string | null> {
  return page.evaluate((targetId: string) => {
    const w = window as unknown as Record<string, unknown>
    const store = w.__store as {
      getState: () => { document: { elements: Record<string, { textBlock?: Array<{ text: string }> }> } }
    }
    const elements = store.getState().document.elements
    const el = elements[targetId]
    if (el && 'textBlock' in el && el.textBlock && el.textBlock.length > 0) {
      return el.textBlock[0].text
    }
    return null
  }, elementId)
}

/** 读取第一个 linker 的 from/to 端点信息 */
async function getLinkerEndpoints(
  page: Parameters<typeof test>[0]['page'],
): Promise<{ fromId: string; toId: string } | null> {
  return page.evaluate(() => {
    const w = window as unknown as Record<string, unknown>
    const store = w.__store as {
      getState: () => {
        document: {
          elements: Record<string, {
            name: string
            from?: { id: string | null }
            to?: { id: string | null }
          }>
        }
      }
    }
    const elements = store.getState().document.elements
    for (const el of Object.values(elements)) {
      if (el.name === 'linker' && el.from?.id && el.to?.id) {
        return { fromId: el.from.id, toId: el.to.id }
      }
    }
    return null
  })
}

/** 根据当前平台返回撤销快捷键（macOS 用 Meta+z，其他用 Control+z） */
async function undoShortcut(page: Parameters<typeof test>[0]['page']): Promise<string> {
  const isMac = await page.evaluate(() => navigator.platform.includes('Mac'))
  return isMac ? 'Meta+z' : 'Control+z'
}

test.describe('AI 助手 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await registerSettingsMock(page)
  })

  test('TC1: 面板显隐 + 收起按钮', async ({ page }) => {
    await page.goto('/')

    // 打开 AI 面板
    await openAiPanel(page)

    // 聊天面板的输入框应当可见
    await expect(page.locator(SEL.input)).toBeVisible()

    // 点击收起 → AppLayout 隐藏面板
    await page.locator(SEL.collapse).click()
    await expect(page.locator(SEL.collapse)).not.toBeVisible()
  })

  test('TC1b: 未配置时显示引导卡片', async ({ page }) => {
    // 覆盖 beforeEach 中注入的 mock，让 settings 表查询返回 undefined
    await overrideSettingsMockAsUnconfigured(page)

    await page.goto('/')

    // 打开聊天面板
    await openAiPanel(page)

    // 应该显示引导卡片
    await expect(page.locator(SEL.setupCard)).toBeVisible({ timeout: 5000 })

    // 未配置时不应出现输入框
    await expect(page.locator(SEL.input)).not.toBeVisible()
  })

  test.fixme('TC2: 完整生成流程', async ({ page }) => {
    // Mock OpenAI API
    await page.route('**/chat/completions', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: buildMockResponse(
          JSON.stringify({
            actions: [
              { type: 'add_element', refId: 'n1', schema: 'terminator', x: 100, y: 100, text: 'A' },
              { type: 'add_element', refId: 'n2', schema: 'terminator', x: 250, y: 100, text: 'B' },
              { type: 'add_linker', from: 'n1', to: 'n2', linkerType: 'curve' },
            ],
            message: '已生成 A→B',
          }),
        ),
      })
    })

    await page.goto('/')

    // 展开聊天
    await page.locator(SEL.bubble).click()

    // 输入消息
    await page.locator(SEL.input).fill('画 A→B')

    // 发送
    await page.locator(SEL.send).click()

    // 等待 AI 回复出现
    await expect(page.locator(SEL.replyGenerated)).toBeVisible({ timeout: 10000 })

    // 验证画布状态：应该有至少 3 个元素（2 个节点 + 1 条连线）
    const elementCount = await getElementCount(page)
    expect(elementCount).toBeGreaterThanOrEqual(3)
  })

  test.fixme('TC3: 撤销 AI 操作', async ({ page }) => {
    // Mock OpenAI API
    await page.route('**/chat/completions', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: buildMockResponse(
          JSON.stringify({
            actions: [
              { type: 'add_element', refId: 'n1', schema: 'terminator', x: 100, y: 100, text: 'A' },
            ],
            message: '已生成 A',
          }),
        ),
      })
    })

    await page.goto('/')

    // 展开聊天并发送
    await page.locator(SEL.bubble).click()
    await page.locator(SEL.input).fill('画 A')
    await page.locator(SEL.send).click()

    // 等待回复
    await expect(page.locator(SEL.replyGenerated)).toBeVisible({ timeout: 10000 })

    // 记录撤销前元素数
    const beforeCount = await getElementCount(page)
    expect(beforeCount).toBeGreaterThanOrEqual(1)

    // 按平台对应的撤销快捷键（macOS: Meta+z, 其他: Control+z）
    const shortcut = await undoShortcut(page)
    await page.keyboard.press(shortcut)

    // 轮询等待撤销生效，避免硬编码 waitForTimeout 导致 flaky
    await expect(async () => {
      const count = await getElementCount(page)
      expect(count).toBeLessThan(beforeCount)
    }).toPass({ timeout: 3000 })
  })

  test.fixme('TC4: 增量修改 L2（含连线重路由）', async ({ page }) => {
    // AI 响应：根据请求内容动态返回
    await page.route('**/chat/completions', async (route) => {
      const requestBody = route.request().postDataJSON() as {
        messages: Array<{ role: string; content: string | Array<{ type: string; text?: string }> }>
      }

      // 检查是否是第一次调用（只有 system prompt 和一条用户消息）
      const userMessages = requestBody.messages.filter((m) => m.role === 'user')

      if (userMessages.length === 1) {
        // 第一次调用：添加 2 个节点 + 1 条连线
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: buildMockResponse(
            JSON.stringify({
              actions: [
                { type: 'add_element', refId: 'n1', schema: 'terminator', x: 100, y: 100, text: '原始文字' },
                { type: 'add_element', refId: 'n2', schema: 'terminator', x: 300, y: 100, text: '节点2' },
                { type: 'add_linker', from: 'n1', to: 'n2', linkerType: 'curve' },
              ],
              message: '已生成节点和连线',
            }),
          ),
        })
      } else {
        // 第二次调用：更新第一个节点文字 - 从请求中获取真实 ID
        const userMsg = userMessages[userMessages.length - 1]
        const content = typeof userMsg.content === 'string' ? userMsg.content : ''
        const idMatch = content.match(/"([^"]+)"/)
        expect(idMatch).not.toBeNull()
        const realId = idMatch![1]

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: buildMockResponse(
            JSON.stringify({
              actions: [
                { type: 'update_element', id: realId, text: '已更新文字' },
              ],
              message: '已更新节点文字',
            }),
          ),
        })
      }
    })

    await page.goto('/')

    // 展开聊天并发送第一次消息（添加 2 节点 + 1 连线）
    await page.locator(SEL.bubble).click()
    await page.locator(SEL.input).fill('画两个节点并用连线连接')
    await page.locator(SEL.send).click()

    // 等待第一次回复
    await expect(page.locator(SEL.replyGenerated)).toBeVisible({ timeout: 10000 })

    // 记录元素数量（2 节点 + 1 连线 = 3）
    const afterAdd = await getElementCount(page)
    expect(afterAdd).toBeGreaterThanOrEqual(3)

    // 验证连线存在：通过 store 读取 linker 数量
    const linkerCountAfterAdd = await getLinkerCount(page)
    expect(linkerCountAfterAdd).toBe(1)

    // 获取第一个节点（文字为"原始文字"）的真实 ID
    const realElementId = await findElementIdByText(page, '原始文字')

    // 发送第二次消息（更新节点文字）
    await page.locator(SEL.input).fill(`更新节点"${realElementId}"的文字为"已更新文字"`)
    await page.locator(SEL.send).click()

    // 等待第二次回复
    await expect(page.locator('text=已更新')).toBeVisible({ timeout: 10000 })

    // 验证节点文字已更新（通过 store 按 ID 精确读取）
    await expect(async () => {
      const updatedText = await readElementText(page, realElementId!)
      expect(updatedText).toBe('已更新文字')
    }).toPass({ timeout: 3000 })

    // 验证：update_element 后连线仍然存在（未因更新而丢失）
    const linkerCountAfterUpdate = await getLinkerCount(page)
    expect(linkerCountAfterUpdate).toBe(1)

    // 验证：linker 的 from/to 仍指向正确的节点（未被破坏）
    const linkerEndpoints = await getLinkerEndpoints(page)
    expect(linkerEndpoints).not.toBeNull()
    // from/to 应当仍指向两个节点（非空 id）
    expect(linkerEndpoints!.fromId).toBeTruthy()
    expect(linkerEndpoints!.toId).toBeTruthy()
    expect(linkerEndpoints!.fromId).not.toBe(linkerEndpoints!.toId)
  })

  test.fixme('TC5: 删除级联', async ({ page }) => {
    // AI 响应：根据请求内容动态返回
    await page.route('**/chat/completions', async (route) => {
      const requestBody = route.request().postDataJSON() as {
        messages: Array<{ role: string; content: string | Array<{ type: string; text?: string }> }>
      }

      const userMessages = requestBody.messages.filter((m) => m.role === 'user')

      if (userMessages.length === 1) {
        // 第一次调用：添加节点和连线
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: buildMockResponse(
            JSON.stringify({
              actions: [
                { type: 'add_element', refId: 'n1', schema: 'terminator', x: 100, y: 100, text: 'A' },
                { type: 'add_element', refId: 'n2', schema: 'terminator', x: 300, y: 100, text: 'B' },
                { type: 'add_linker', from: 'n1', to: 'n2', linkerType: 'curve' },
              ],
              message: '已生成 A→B',
            }),
          ),
        })
      } else {
        // 第二次调用：删除节点 A - 从请求中获取真实 ID
        const userMsg = userMessages[userMessages.length - 1]
        const content = typeof userMsg.content === 'string' ? userMsg.content : ''
        const idMatch = content.match(/"([^"]+)"/)
        expect(idMatch).not.toBeNull()
        const realId = idMatch![1]

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: buildMockResponse(
            JSON.stringify({
              actions: [
                { type: 'delete_element', id: realId },
              ],
              message: '已删除节点 A',
            }),
          ),
        })
      }
    })

    await page.goto('/')

    // 展开聊天并发送第一次消息（添加节点和连线）
    await page.locator(SEL.bubble).click()
    await page.locator(SEL.input).fill('画 A→B')
    await page.locator(SEL.send).click()

    // 等待第一次回复
    await expect(page.locator(SEL.replyGenerated)).toBeVisible({ timeout: 10000 })

    // 记录元素数量（2 节点 + 1 连线 = 3）
    const afterAdd = await getElementCount(page)
    expect(afterAdd).toBeGreaterThanOrEqual(3)

    // 获取真实的元素 ID（用于后续 delete_element 操作）
    const realElementId = await findElementIdByText(page, 'A')

    // 发送第二次消息（删除节点 A）
    await page.locator(SEL.input).fill(`删除节点"${realElementId}"`)
    await page.locator(SEL.send).click()

    // 等待第二次回复
    await expect(page.locator('text=已删除')).toBeVisible({ timeout: 10000 })

    // 验证元素数量减少（删除 n1 和附着的 linker，应减少 2 个元素）
    const afterDelete = await getElementCount(page)
    expect(afterDelete).toBe(afterAdd - 2)
  })

  test.fixme('TC6: 图片上传（含压缩验证）', async ({ page }) => {
    // 拦截 API 请求，捕获请求体
    let requestPayload: unknown = null
    await page.route('**/chat/completions', async (route) => {
      requestPayload = route.request().postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: buildMockResponse(
          JSON.stringify({
            actions: [],
            message: '已生成回复',
          }),
        ),
      })
    })

    await page.goto('/')

    // 展开聊天
    await page.locator(SEL.bubble).click()

    // 找到隐藏的文件输入框并上传图片
    const fileInput = page.locator('input[type="file"][aria-label="图片文件选择"]')
    // 创建一个测试 PNG 文件（10x10 像素的 PNG，比 1x1 更大以便验证压缩）
    const testImagePath = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVQYV2P8z8BQz0AEYBxVSF+FAP5GCAsM0MPdAAAAAElFTkSuQmCC',
      'base64',
    )
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: testImagePath,
    })

    // 等待图片压缩完成（通过轮询 pendingImages 状态代替硬编码 waitForTimeout）
    await expect.poll(
      () => page.evaluate(() => (window as unknown as { _pendingImagesCount?: number })._pendingImagesCount ?? 0),
      { timeout: 3000 },
    ).toBe(1)

    // 输入消息并发送
    await page.locator(SEL.input).fill('看看这张图')
    await page.locator(SEL.send).click()

    // 等待回复
    await expect(page.locator(SEL.replyGenerated)).toBeVisible({ timeout: 10000 })

    // 验证请求体中包含 image_url
    expect(requestPayload).not.toBeNull()
    const payload = requestPayload as {
      messages: Array<{
        role: string
        content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>
      }>
    }
    // 找到包含图片的用户消息
    const userMessageWithImage = payload.messages.find(
      (m) => m.role === 'user' && Array.isArray(m.content),
    )
    expect(userMessageWithImage).toBeDefined()
    const content = userMessageWithImage!.content as Array<{
      type: string
      text?: string
      image_url?: { url: string }
    }>
    const imageContent = content.find((part) => part.type === 'image_url' && part.image_url?.url)
    expect(imageContent).toBeDefined()

    // 验证图片已被压缩：compressImage 输出 JPEG 格式（原始 PNG 会被转换为 JPEG）
    const imageUrl = imageContent!.image_url!.url
    expect(imageUrl).toContain('data:image/jpeg')
    // 确认 base64 数据非空（压缩确实产生了输出）
    const base64Data = imageUrl.split(',')[1]
    expect(base64Data).toBeTruthy()
    expect(base64Data.length).toBeGreaterThan(0)
  })

  test.fixme('TC7: API 错误处理（401 密钥无效）', async ({ page }) => {
    // Mock 401 Unauthorized 响应
    await page.route('**/chat/completions', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: { message: 'Invalid API key' } }),
      })
    })

    await page.goto('/')

    // 记录初始画布元素数量
    const initialCount = await getElementCount(page)

    // 展开聊天面板
    await page.locator(SEL.bubble).click()

    // 输入消息并发送
    await page.locator(SEL.input).fill('画一个节点')
    await page.locator(SEL.send).click()

    // 等待错误消息出现（AI 服务返回"API 密钥无效"）
    // 注意：错误消息"API 密钥无效"来自 AIService.handleError 的本地化映射
    // （英文 "Invalid API key" 映射为中文 "API 密钥无效"）。
    // 如果 AIService.handleError 的映射逻辑改变，此测试需要同步更新。
    await expect(page.locator('text=API 密钥无效')).toBeVisible({ timeout: 10000 })

    // 验证画布无变化：元素数量与初始一致（AI 未对画布做任何修改）
    const afterCount = await getElementCount(page)
    expect(afterCount).toBe(initialCount)
  })

  test.fixme('TC8: 模板选择 → AI 生成流程', async ({ page }) => {
    // Mock OpenAI API：返回订单处理流程（多节点 + 连线）
    await page.route('**/chat/completions', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: buildStreamResponse(
          JSON.stringify({
            actions: [
              { type: 'add_element', refId: 'o1', schema: 'terminator', x: 200, y: 50, text: '下单' },
              { type: 'add_element', refId: 'o2', schema: 'terminator', x: 200, y: 150, text: '支付' },
              { type: 'add_element', refId: 'o3', schema: 'terminator', x: 200, y: 250, text: '发货' },
              { type: 'add_element', refId: 'o4', schema: 'terminator', x: 200, y: 350, text: '收货' },
              { type: 'add_linker', from: 'o1', to: 'o2', linkerType: 'curve' },
              { type: 'add_linker', from: 'o2', to: 'o3', linkerType: 'curve' },
              { type: 'add_linker', from: 'o3', to: 'o4', linkerType: 'curve' },
            ],
            message: '已生成订单处理流程',
          }),
        ),
      })
    })

    await page.goto('/')

    // 先展开 AI 助手面板（回复文本渲染在面板内，收起时 toBeVisible 会超时）
    await page.locator(SEL.bubble).click()

    // 模板入口已从顶栏移除（暂时隐藏）：直接派发打开事件，走同一事件链路
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('ai:open-templates')))

    // 等待模板库模态框出现
    await expect(page.locator(SEL.templateModal)).toBeVisible({ timeout: 5000 })

    // 点击"订单处理流程"模板卡片
    await page.locator(SEL.orderTemplateCard).click()

    // 等待模板库模态框关闭（handleTemplateSelect 会关闭模态框）
    await expect(page.locator(SEL.templateModal)).not.toBeVisible({ timeout: 5000 })

    // 等待 AI 回复出现（模板 prompt 自动发送并收到 AI 回复）
    await expect(page.locator('text=已生成订单处理流程')).toBeVisible({ timeout: 15000 })

    // 验证画布：应有 4 个节点 + 3 条连线 = 至少 7 个元素
    const elementCount = await getElementCount(page)
    expect(elementCount).toBeGreaterThanOrEqual(7)

    // 验证连线数量
    const linkerCount = await getLinkerCount(page)
    expect(linkerCount).toBe(3)
  })
})
