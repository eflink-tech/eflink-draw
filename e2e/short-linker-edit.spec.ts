// 极短连线（线身被端点手柄/锚点命中区覆盖）双击进入文字编辑 + 单击可选中。
// 断言走 window.__store 文档状态（与 segment-handle.spec 同模式）。
import { test, expect, type Page } from '@playwright/test'

type Store = {
  getState: () => {
    addElement: (el: unknown) => void
    addLinker: (l: unknown) => void
    selectElement: (id: string) => void
    viewport: { scale: number; x: number; y: number }
    selectedIds: Set<string>
    textEdit: { id: string; block: number; seg?: number } | null
    document: { elements: Record<string, unknown> }
  }
}

/** 两图形上下相距 20px（连线从 280 到 300，中点在两端 10px 手柄边缘） */
async function setupShortLinker(page: Page): Promise<{
  dblclickAt: (wx: number, wy: number) => Promise<void>
  state: () => Promise<{
    textEdit: { id: string; block: number; seg?: number } | null
    selectedIds: string[]
  }>
}> {
  await page.goto('/')
  await page.waitForSelector('.konvajs-content', { timeout: 15000 })
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.waitForSelector('.konvajs-content', { timeout: 15000 })
  await page.waitForTimeout(600)
  await page.evaluate(() => {
    const store = (window as unknown as { __store: Store }).__store
    const st = store.getState()
    const mk = (id: string, x: number, y: number, w: number, h: number, z: number) => ({
      id,
      name: 'rectangle',
      title: '矩形',
      category: 'basic',
      group: '',
      groupName: null,
      locked: false,
      link: '',
      children: [],
      parent: '',
      resizeDir: ['tl', 'tr', 'br', 'bl'],
      attribute: { linkable: true },
      dataAttributes: [],
      props: { x, y, w, h, zindex: z, angle: 0 },
      shapeStyle: { alpha: 1 },
      lineStyle: { lineWidth: 1.5, lineColor: '50,50,50', lineStyle: 'solid' },
      fillStyle: { type: 'solid', color: '255,255,255' },
      path: [
        [
          { action: 'move', x: 0, y: 0 },
          { action: 'line', x: 'w', y: 0 },
          { action: 'line', x: 'w', y: 'h' },
          { action: 'line', x: 0, y: 'h' },
          { action: 'close' },
        ],
      ],
      fontStyle: {
        fontFamily: 'PingFang SC',
        size: 14,
        color: '50,50,50',
        bold: false,
        italic: false,
        underline: false,
        orientation: 'horizontal',
      },
      textBlock: [{ position: { x: 10, y: 0, w: 'w-20', h: 'h' }, text: '' }],
      anchors: [
        { x: 'w/2', y: 0 },
        { x: 'w/2', y: 'h' },
        { x: 0, y: 'h/2' },
        { x: 'w', y: 'h/2' },
      ],
    })
    st.addElement(mk('sh-a', 200, 200, 120, 80, 1))
    st.addElement(mk('sh-b', 220, 300, 80, 40, 2))
    st.addLinker({
      id: 'lk-short',
      name: 'linker',
      from: { id: 'sh-a', x: 260, y: 280, angle: Math.PI / 2 },
      to: { id: 'sh-b', x: 260, y: 300, angle: -Math.PI / 2 },
      text: '',
      linkerType: 'broken',
      lineStyle: {
        lineWidth: 1.5,
        lineColor: '50,50,50',
        lineStyle: 'solid',
        beginArrowStyle: 'none',
        endArrowStyle: 'solidArrow',
      },
      points: [],
      locked: false,
      dataAttributes: [],
      group: '',
      props: { zindex: 3 },
    })
    st.updateViewport({ x: 0, y: 0, scale: 1 })
  })
  await page.waitForTimeout(500)
  const content = page.locator('.konvajs-content').first()
  const box = (await content.boundingBox())!
  const screen = async (wx: number, wy: number) => {
    const vp = await page.evaluate(() => {
      const s = (window as unknown as { __store: Store }).__store.getState()
      return { scale: s.viewport.scale, x: s.viewport.x, y: s.viewport.y }
    })
    return { x: box.x + wx * vp.scale + vp.x, y: box.y + wy * vp.scale + vp.y }
  }
  return {
    dblclickAt: async (wx, wy) => {
      const p = await screen(wx, wy)
      await page.mouse.dblclick(p.x, p.y)
      await page.waitForTimeout(300)
    },
    state: () =>
      page.evaluate(() => {
        const s = (window as unknown as { __store: Store }).__store.getState()
        return { textEdit: s.textEdit, selectedIds: [...s.selectedIds] }
      }),
  }
}

test('极短连线：未选中时双击线身中点进入文字编辑', async ({ page }) => {
  const h = await setupShortLinker(page)
  await h.dblclickAt(260, 290)
  const s = await h.state()
  expect(s.textEdit?.id).toBe('lk-short')
  expect(s.textEdit?.block).toBe(-1)
  expect(s.textEdit?.seg).toBe(1)
  await expect(page.locator('textarea:visible')).toHaveCount(1)
})

test('极短连线：端点图形被选中（端点手柄让位）时仍可双击线身编辑', async ({ page }) => {
  const h = await setupShortLinker(page)
  await page.evaluate(() => {
    const store = (window as unknown as { __store: Store }).__store
    store.getState().selectElement('sh-b')
  })
  await page.waitForTimeout(300)
  await h.dblclickAt(260, 290)
  expect((await h.state()).textEdit?.id).toBe('lk-short')
})

test('极短连线：已选中时双击线身中点进入文字编辑', async ({ page }) => {
  const h = await setupShortLinker(page)
  await page.evaluate(() => {
    const store = (window as unknown as { __store: Store }).__store
    store.getState().selectElement('lk-short')
  })
  await page.waitForTimeout(300)
  await h.dblclickAt(260, 290)
  expect((await h.state()).textEdit?.id).toBe('lk-short')
})
