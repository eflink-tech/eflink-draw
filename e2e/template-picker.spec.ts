import { test, expect, type Page } from '@playwright/test'

const picker = '[data-testid="template-picker"]'

async function openPicker(page: Page) {
  await page.getByRole('button', { name: '文件', exact: true }).click()
  await page.getByText('从模板新建…', { exact: true }).click()
  await expect(page.locator(picker)).toBeVisible()
}

async function storeState(page: Page) {
  return page.evaluate(() => {
    const store = (window as unknown as {
      __store: { getState: () => { document: { page: { width: number; height: number; title?: string }; elements: Record<string, unknown> } } }
    }).__store
    const doc = store.getState().document
    return {
      title: doc.page.title,
      width: doc.page.width,
      height: doc.page.height,
      elements: Object.keys(doc.elements).length,
    }
  })
}

test.describe('模板选择弹窗', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => Boolean((window as unknown as { __store?: unknown }).__store))
  })

  test('文件→从模板新建…：18 个模板、分类与搜索过滤、ESC 关闭', async ({ page }) => {
    await openPicker(page)
    await expect(page.locator('[data-template-id]')).toHaveCount(18)
    await expect(page.locator('[data-testid="template-preview"]')).toContainText('基础流程图')

    await page.getByRole('button', { name: /系统技术/ }).click()
    await expect(page.locator('[data-template-id]')).toHaveCount(3)

    await page.getByLabel('搜索模板').fill('BPMN')
    await expect(page.locator('[data-template-id]')).toHaveCount(1)
    await expect(page.locator('[data-template-id="bpmn-process"]')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.locator(picker)).toHaveCount(0)
  })

  test('新建画布使用：载入模板并适配视口', async ({ page }) => {
    await openPicker(page)
    await page.locator('[data-template-id="swimlane"]').click()
    await page.getByRole('button', { name: '新建画布使用' }).click()
    await expect(page.locator(picker)).toHaveCount(0)

    await expect
      .poll(async () => (await storeState(page)).title)
      .toBe('泳道流程图')
    const st = await storeState(page)
    expect(st.elements).toBeGreaterThan(0)
    expect(st.width).toBe(1300)
    const scale = await page.evaluate(
      () => (window as unknown as { __store: { getState: () => { viewport: { scale: number } } } }).__store.getState().viewport.scale,
    )
    expect(scale).toBeLessThan(1)
  })

  test('插入当前画布：落到现有内容右侧、扩页，undo 一次整体回退', async ({ page }) => {
    // 先新建一个基础流程图作为已有内容
    await openPicker(page)
    await page.locator('[data-template-id="basic-flow"]').click()
    await page.getByRole('button', { name: '新建画布使用' }).click()
    await expect(page.locator(picker)).toHaveCount(0)
    const before = await storeState(page)

    await openPicker(page)
    await page.locator('[data-template-id="vsm-flow"]').click()
    await page.getByRole('button', { name: '插入当前画布' }).click()
    await expect(page.locator(picker)).toHaveCount(0)

    const after = await storeState(page)
    expect(after.elements).toBeGreaterThan(before.elements)
    expect(after.width).toBeGreaterThan(before.width)
    expect(after.title).toBe('基础流程图')

    await page.evaluate(() =>
      (window as unknown as { __store: { getState: () => { undo: () => void } } }).__store.getState().undo(),
    )
    const undone = await storeState(page)
    expect(undone.elements).toBe(before.elements)
    expect(undone.width).toBe(before.width)
  })
})
