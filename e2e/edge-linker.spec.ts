// 验证任意边线连线：选择模式边线拖出（非锚点起点）→ 目标边线任意点吸附；
// 连线工具按图形内部拖出 → 起点为轮廓最近点。
// 断言走 window.__store 的文档状态（与 segment-handle.spec 同模式）。
import { test, expect, type Page } from '@playwright/test'

type Store = {
  getState: () => {
    addElement: (el: unknown) => void
    updateViewport: (vp: { scale: number; x: number; y: number }) => void
    selectedIds: Set<string>
    viewport: { scale: number; x: number; y: number }
    document: { elements: Record<string, LinkerLike> }
  }
}

interface LinkerLike {
  id: string
  name: string
  from: { id: string | null; x: number; y: number }
  to: { id: string | null; x: number; y: number }
}

async function setupBase(page: Page): Promise<{
  toScreen: (x: number, y: number) => { sx: number; sy: number }
  realErrors: () => string[]
}> {
  // 页面错误监听（存量惯例，与 segment-handle.spec 同模式）：本 spec 拦截底层鼠标
  // 交互，静默 JS 异常会让 linkers.length/坐标断言无根因失败，必须显式断言无错误
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`)
  })
  // 过滤无关的静态资源 404 噪音（字体/favicon 等与功能无关）
  const realErrors = (): string[] => errors.filter((e) => !e.includes('404'))

  await page.goto('/')
  await page.waitForSelector('.konvajs-content', { timeout: 15000 })
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.waitForSelector('.konvajs-content', { timeout: 15000 })
  // 等 Canvas 首次 ResizeObserver 自动居中完成（视口出现非零偏移）再重置视口：
  // 若重置后居中回调才执行，{0,0,1} 恰满足居中条件（Canvas.tsx），视口会被拉走
  // → toScreen 全盘错位。容器尺寸恰好使居中偏移为 0 时条件恒不满足，
  // 2s 超时视为无需居中，直接继续
  await page
    .waitForFunction(
      () => {
        const store = (window as unknown as {
          __store: { getState: () => { viewport: { x: number; y: number; scale: number } } }
        }).__store
        if (!store) return false
        const vp = store.getState().viewport
        return vp.x !== 0 || vp.y !== 0 || vp.scale !== 1
      },
      undefined,
      { timeout: 2000 },
    )
    .catch(() => {
      /* 未出现居中偏移 → 视口本就在原点，无需等待 */
    })
  // 注入两个 120×80 矩形。注意两点：
  //   1) page.evaluate 回调在浏览器执行，不能引用外部闭包——对象字面量必须自包含（内联 mk）
  //   2) path 必须用 action 对象格式（executePathAction 消费，与 PathAction 类型对齐）；
  //      键名以 ElementInstance 类型为准（fillStyle.type / fontStyle.fontFamily）
  await page.evaluate(() => {
    const mk = (id: string, x: number, y: number, z: number) => ({
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
      props: { x, y, w: 120, h: 80, zindex: z, angle: 0 },
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
      fontStyle: { fontFamily: 'PingFang SC', size: 14, color: '50,50,50', bold: false, italic: false, underline: false, orientation: 'horizontal' },
      textBlock: [{ position: { x: 10, y: 0, w: 'w-20', h: 'h' }, text: '' }],
      anchors: [
        { x: 'w/2', y: 0 },
        { x: 'w/2', y: 'h' },
        { x: 0, y: 'h/2' },
        { x: 'w', y: 'h/2' },
      ],
    })
    const store = (window as unknown as { __store: Store }).__store
    const st = store.getState()
    st.addElement(mk('sh-a', 200, 200, 1))
    st.addElement(mk('sh-b', 600, 400, 2))
    // demo 启动把视口平移到画布中心（实测 vp≈{x:-420,y:-288}），注入的世界坐标
    // (200..720, 200..480) 会落在默认视区外导致鼠标交互全部 miss——重置到原点视口
    st.updateViewport({ x: 0, y: 0, scale: 1 })
  })
  await page.waitForTimeout(300)
  const content = page.locator('.konvajs-content').first()
  const box = (await content.boundingBox())!
  const vp = await page.evaluate(() => {
    const store = (window as unknown as { __store: Store }).__store
    const { scale, x, y } = store.getState().viewport
    return { scale, x, y }
  })
  return {
    toScreen: (wx: number, wy: number) => ({
      sx: box.x + wx * vp.scale + vp.x,
      sy: box.y + wy * vp.scale + vp.y,
    }),
    realErrors,
  }
}

/** 读取文档中的全部连线（store 状态断言） */
async function linkersOf(page: Page): Promise<LinkerLike[]> {
  return page.evaluate(() => {
    const store = (window as unknown as { __store: Store }).__store
    return Object.values(store.getState().document.elements).filter(
      (el): el is LinkerLike => el.name === 'linker',
    )
  })
}

test('选择模式：边线任意点拖出 → 目标边线任意点吸附', async ({ page }) => {
  const { toScreen, realErrors } = await setupBase(page)
  // sh-a 底边 25% 处（非锚点）：(200+30, 280)
  const from = toScreen(230, 280)
  // sh-b 顶边 40% 处（非锚点）：(600+48, 400)
  const to = toScreen(648, 400)
  await page.mouse.move(from.sx, from.sy)
  await page.mouse.down()
  // 起点在 DragStart 时刻取指针的轮廓投影（Konva 阈值 3px）。先垂直边线向外微移
  // 3px 触发 dragstart（x 不变 → 投影恒为按下点）；若直接大步拖动，dragstart 落在
  // 首步末（约 34px 外），起点会漂移到首步投影
  await page.mouse.move(from.sx, from.sy + 3, { steps: 3 })
  await page.mouse.move(to.sx, to.sy, { steps: 12 })
  await page.mouse.up()
  await page.waitForTimeout(300)

  const linkers = await linkersOf(page)
  expect(linkers.length).toBe(1)
  const lk = linkers[0]!
  expect(lk.from.id).toBe('sh-a')
  expect(lk.from.x).toBeCloseTo(230, 0) // 边线拖出点保持（±0.5px）
  expect(lk.from.y).toBeCloseTo(280, 0)
  expect(lk.to.id).toBe('sh-b')
  expect(lk.to.x).toBeCloseTo(648, 0) // 轮廓带吸附点 = 光标投影
  expect(lk.to.y).toBeCloseTo(400, 0)
  expect(realErrors()).toEqual([])
})

test('选择模式：图形内部按下 → 移动图形（不被边带劫持）', async ({ page }) => {
  const { toScreen, realErrors } = await setupBase(page)
  const before = await page.evaluate(() => {
    const store = (window as unknown as { __store: Store }).__store
    const el = store.getState().document.elements['sh-a'] as { props: { x: number; y: number } }
    return { x: el.props.x, y: el.props.y }
  })
  const center = toScreen(260, 240) // sh-a 中心
  // 坐标经核对远离 snapLine 2px 对齐线（SNAP_THRESHOLD=2，拖后与 sh-b 最近线距
  // y 向 80px / x 向 230px），精确坐标断言不受对齐吸附扰动；调坐标时需保持该距离
  await page.mouse.move(center.sx, center.sy)
  await page.mouse.down()
  await page.mouse.move(center.sx + 50, center.sy + 40, { steps: 6 })
  await page.mouse.up()
  await page.waitForTimeout(300)
  const after = await page.evaluate(() => {
    const store = (window as unknown as { __store: Store }).__store
    const el = store.getState().document.elements['sh-a'] as { props: { x: number; y: number } }
    return { x: el.props.x, y: el.props.y }
  })
  expect(after.x).toBe(before.x + 50)
  expect(after.y).toBe(before.y + 40)
  expect(realErrors()).toEqual([])
})

test('连线工具：图形内部按下拖出 → 起点为轮廓最近点', async ({ page }) => {
  const { toScreen, realErrors } = await setupBase(page)
  await page.keyboard.press('l') // 切到连线工具（useEditorShortcuts）
  // sh-a 内部 (220, 210)：距顶边 10px、距左边 20px → 轮廓点 (220, 200)
  const from = toScreen(220, 210)
  const to = toScreen(660, 440) // sh-b 中心（深处 → 面向另一端锚点）
  await page.mouse.move(from.sx, from.sy)
  await page.mouse.down()
  await page.mouse.move(to.sx, to.sy, { steps: 12 })
  await page.mouse.up()
  await page.waitForTimeout(300)

  const linkers = await linkersOf(page)
  expect(linkers.length).toBe(1)
  const lk = linkers[0]!
  expect(lk.from.id).toBe('sh-a')
  expect(lk.from.x).toBeCloseTo(220, 0)
  expect(lk.from.y).toBeCloseTo(200, 0) // 顶边投影
  expect(lk.to.id).toBe('sh-b')
  expect(realErrors()).toEqual([])
})
