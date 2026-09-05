// 验证连线段中点句柄：创建图形+L 形连线 → 选中 → 像素探针确认句柄 → 拖动句柄 → 验证 L→Z
// 另一用例：Z 形连线应渲染 3 个句柄，拖动首段验证切出+插入
import { test, expect } from '@playwright/test'

type Store = {
  getState: () => {
    addElement: (el: unknown) => void
    addLinker: (l: unknown) => void
    selectElement: (id: string) => void
    viewport: { scale: number; x: number; y: number }
    selectedIds: Set<string>
    document: { elements: Record<string, unknown> }
  }
}

test('段中点句柄渲染与拖动', async ({ page }) => {
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
  await page.waitForTimeout(800)

  await page.evaluate(() => {
    const store = (window as unknown as { __store: Store }).__store
    const st = store.getState()
    const mkShape = (id: string, x: number, y: number, z: number) => ({
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
      props: { x, y, w: 120, h: 60, zindex: z, angle: 0 },
      shapeStyle: { alpha: 1 },
      lineStyle: {
        lineWidth: 1.5,
        lineColor: '50,50,50',
        lineStyle: 'solid',
        fillType: 'solid',
        fillColor: '255,255,255',
        fillAlpha: 1,
      },
      fillStyle: { fillType: 'solid', color: '255,255,255', alpha: 1 },
      path: [['M', 0, 0], ['L', 'w', 0], ['L', 'w', 'h'], ['L', 0, 'h'], ['Z']],
      fontStyle: {
        family: 'PingFang SC',
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
    st.addElement(mkShape('sh-a', 200, 200, 1))
    st.addElement(mkShape('sh-b', 600, 400, 2))
    st.addLinker({
      id: 'lk-test',
      name: 'linker',
      from: { id: 'sh-a', x: 260, y: 260, angle: (Math.PI / 4) * 5 },
      to: { id: 'sh-b', x: 600, y: 430, angle: 0 },
      text: '',
      linkerType: 'broken',
      lineStyle: {
        lineWidth: 1.5,
        lineColor: '50,50,50',
        lineStyle: 'solid',
        beginArrowStyle: 'none',
        endArrowStyle: 'solidArrow',
      },
      points: [{ x: 260, y: 430 }],
      locked: false,
      dataAttributes: [],
      group: '',
      props: { zindex: 3 },
    })
    st.selectElement('lk-test')
  })
  await page.waitForTimeout(500)

  // Konva 舞台容器（左面板缩略图 canvas 会干扰 locator('canvas')，必须用 konvajs-content）
  const content = page.locator('.konvajs-content').first()
  const box = (await content.boundingBox())!
  const st = await page.evaluate(() => {
    const store = (window as unknown as { __store: Store }).__store
    return { viewport: { ...store.getState().viewport } }
  })
  // L 形水平段中点：世界 (430, 430) → 舞台容器坐标
  const cx = 430 * st.viewport.scale + st.viewport.x
  const cy = 430 * st.viewport.scale + st.viewport.y
  const sx = box.x + cx
  const sy = box.y + cy

  // 像素探针：遍历舞台各层 canvas，检查句柄位置是否出现蓝色句柄（#1677ff）
  const probe = await page.evaluate(({ cx, cy }) => {
    const canvases = Array.from(
      document.querySelectorAll<HTMLCanvasElement>('.konvajs-content canvas'),
    )
    const out: Array<{ layer: number; blue: boolean; sample: string }> = []
    canvases.forEach((c, i) => {
      try {
        const ctx = c.getContext('2d')!
        let blue = false
        const sample = ctx.getImageData(cx - 8, cy - 8, 16, 16)
        for (let p = 0; p < sample.data.length; p += 4) {
          const [r, g, b] = [sample.data[p]!, sample.data[p + 1]!, sample.data[p + 2]!]
          if (b > 200 && g > 80 && g < 160 && r < 80) blue = true
        }
        out.push({ layer: i, blue, sample: `${c.width}x${c.height}` })
      } catch (err) {
        out.push({ layer: i, blue: false, sample: `ERR:${String(err).slice(0, 40)}` })
      }
    })
    return out
  }, { cx, cy })
  console.log('PROBE:', JSON.stringify(probe))
  console.log('ERRORS:', JSON.stringify(errors))
  await page.screenshot({ path: 'test-results/seg-handle-selected.png' })

  // 拖动句柄：向下 60 屏幕像素
  await page.mouse.move(sx, sy)
  await page.mouse.down()
  await page.mouse.move(sx, sy + 60, { steps: 8 })
  await page.mouse.up()
  await page.waitForTimeout(300)
  await page.screenshot({ path: 'test-results/seg-handle-after-drag.png' })

  const after = await page.evaluate(() => {
    const store = (window as unknown as { __store: Store }).__store
    const l = store.getState().document.elements['lk-test'] as {
      points: Array<{ x: number; y: number }>
    }
    return l.points
  })
  expect(realErrors()).toEqual([])
  // 8-28 路由演进后：拖动水平段中点，段整体下移 60 且路由器自动补正交尾段接入终点
  expect(after.length).toBeGreaterThanOrEqual(2)
  // 拖动段：起点侧折点 x 不变、y 随拖动下移 60（430 → 490），段保持水平
  expect(after[0]!.x).toBeCloseTo(260, 0)
  expect(after[0]!.y).toBeCloseTo(490, 0)
  expect(after[1]!.y).toBeCloseTo(490, 0)
  // 尾段正交接入终点（最后折点与终点同 y）
  expect(after[after.length - 1]!.y).toBeCloseTo(430, 0)
  // 正交性：相邻折点必须共 x 或共 y
  for (let i = 1; i < after.length; i++) {
    const sameX = Math.abs(after[i]!.x - after[i - 1]!.x) < 0.5
    const sameY = Math.abs(after[i]!.y - after[i - 1]!.y) < 0.5
    expect(sameX || sameY).toBe(true)
  }
})

test('Z 形连线渲染 3 个句柄且首段可拖', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`)
  })
  const realErrors = (): string[] => errors.filter((e) => !e.includes('404'))

  await page.goto('/')
  await page.waitForSelector('.konvajs-content', { timeout: 15000 })
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.waitForSelector('.konvajs-content', { timeout: 15000 })
  await page.waitForTimeout(800)

  // Z 形：from(200,200) → p0(200,430) → p1(600,430) → to(600,460)
  // viewport 自动居中（1400 宽下 x≈-400），世界坐标必须落在可视区（x>400）内
  await page.evaluate(() => {
    const store = (window as unknown as { __store: Store }).__store
    const st = store.getState()
    const mkShape = (id: string, x: number, y: number, z: number) => ({
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
      props: { x, y, w: 120, h: 60, zindex: z, angle: 0 },
      shapeStyle: { alpha: 1 },
      lineStyle: {
        lineWidth: 1.5,
        lineColor: '50,50,50',
        lineStyle: 'solid',
        fillType: 'solid',
        fillColor: '255,255,255',
        fillAlpha: 1,
      },
      fillStyle: { fillType: 'solid', color: '255,255,255', alpha: 1 },
      path: [['M', 0, 0], ['L', 'w', 0], ['L', 'w', 'h'], ['L', 0, 'h'], ['Z']],
      fontStyle: {
        family: 'PingFang SC',
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
    st.addElement(mkShape('sh-a', 540, 140, 1))
    st.addElement(mkShape('sh-b', 760, 400, 2))
    st.addLinker({
      id: 'lk-z',
      name: 'linker',
      from: { id: 'sh-a', x: 600, y: 200, angle: (Math.PI / 4) * 5 },
      to: { id: 'sh-b', x: 820, y: 460, angle: 0 },
      text: '',
      linkerType: 'broken',
      lineStyle: {
        lineWidth: 1.5,
        lineColor: '50,50,50',
        lineStyle: 'solid',
        beginArrowStyle: 'none',
        endArrowStyle: 'solidArrow',
      },
      points: [
        { x: 600, y: 430 },
        { x: 820, y: 430 },
      ],
      locked: false,
      dataAttributes: [],
      group: '',
      props: { zindex: 3 },
    })
    st.selectElement('lk-z')
  })
  await page.waitForTimeout(500)

  // 全图扫描调节点层（最后一个 canvas）：找出所有蓝色像素团（#1677ff 句柄），
  // 反推世界坐标 —— 不依赖 viewport 换算（曾因 viewport 时刻不一致换算错位）
  const found = await page.evaluate(() => {
    const canvases = Array.from(
      document.querySelectorAll<HTMLCanvasElement>('.konvajs-content canvas'),
    )
    const results: Array<{ layer: number; cluster: { x: number; y: number } }> = []
    for (let i = 0; i < canvases.length; i++) {
      const ctx = canvases[i]!.getContext('2d')!
      const w = canvases[i]!.width
      const h = canvases[i]!.height
      const img = ctx.getImageData(0, 0, w, h)
      const seen = new Uint8Array(w * h)
      for (let p = 0; p < w * h; p++) {
        if (seen[p]) continue
        const r = img.data[p * 4]!
        const g = img.data[p * 4 + 1]!
        const b = img.data[p * 4 + 2]!
        const a = img.data[p * 4 + 3]!
        // #1677ff 精确色 + 白描边中心；宽松匹配蓝色系（排除光晕 alpha 低的）
        if (a > 200 && b > 200 && r < 90 && g > 90 && g < 180) {
          // BFS 收集团块
          const q = [p]
          seen[p] = 1
          const sx = p % w
          const sy = Math.floor(p / w)
          void sx
          void sy
          let sumX = 0
          let sumY = 0
          let n = 0
          while (q.length) {
            const cur = q.pop()!
            const x = cur % w
            const y = Math.floor(cur / w)
            sumX += x
            sumY += y
            n++
            for (const [dx, dy] of [
              [1, 0],
              [-1, 0],
              [0, 1],
              [0, -1],
            ]) {
              const nx = x + dx!
              const ny = y + dy!
              if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
              const ni = ny * w + nx
              if (seen[ni]) continue
              const nr = img.data[ni * 4]!
              const ng = img.data[ni * 4 + 1]!
              const nb = img.data[ni * 4 + 2]!
              const na = img.data[ni * 4 + 3]!
              if (na > 200 && nb > 200 && nr < 90 && ng > 90 && ng < 180) {
                seen[ni] = 1
                q.push(ni)
              }
            }
          }
          // 设备像素比换算回 CSS 像素
          const dpr = canvases[i]!.width / canvases[i]!.clientWidth || 1
          const vp = (window as unknown as { __store: Store }).__store.getState().viewport
          results.push({
            layer: i,
            cluster: {
              x: Math.round(((sumX / n / dpr) - vp.x) / vp.scale),
              y: Math.round(((sumY / n / dpr) - vp.y) / vp.scale),
            },
          })
        }
      }
    }
    return results
  })
  console.log('FOUND:', JSON.stringify(found))
  await page.screenshot({ path: 'test-results/z-handle-selected.png' })
  expect(found.filter((f) => f.layer >= 2)).toHaveLength(3)

  // hover 句柄光标：垂直首段 → e-resize（左右拖），水平中段 → n-resize（上下拖）
  const content = page.locator('.konvajs-content').first()
  const box = (await content.boundingBox())!
  const vp2 = await page.evaluate(() => ({
    ...(window as unknown as { __store: Store }).__store.getState().viewport,
  }))
  const toScreen = (wx: number, wy: number): { x: number; y: number } => ({
    x: box.x + wx * vp2.scale + vp2.x,
    y: box.y + wy * vp2.scale + vp2.y,
  })
  const vSeg = found.filter((f) => f.layer >= 2).find((f) => f.cluster.y < 400)!
  const hSeg = found.filter((f) => f.layer >= 2).find((f) => f.cluster.y >= 400)!
  const readCursor = (): Promise<string> =>
    // stage.container() 是 .konvajs-content 的父元素（react-konva 自建 div），光标设在它上面
    page.evaluate(
      () => (document.querySelector('.konvajs-content')!.parentElement as HTMLElement).style.cursor,
    )
  await page.mouse.move(toScreen(vSeg.cluster.x, vSeg.cluster.y).x, toScreen(vSeg.cluster.x, vSeg.cluster.y).y)
  await page.waitForTimeout(100)
  expect(await readCursor()).toBe('e-resize')
  await page.mouse.move(toScreen(hSeg.cluster.x, hSeg.cluster.y).x, toScreen(hSeg.cluster.x, hSeg.cluster.y).y)
  await page.waitForTimeout(100)
  expect(await readCursor()).toBe('n-resize')
  await page.mouse.move(10, 10)
  await page.waitForTimeout(100)
  expect(await readCursor()).toBe('default')

  // 从扫描结果直接拿首段句柄的世界坐标，再换算屏幕坐标拖动
  const head = vSeg
  const s1 = {
    x: box.x + head.cluster.x * vp2.scale + vp2.x,
    y: box.y + head.cluster.y * vp2.scale + vp2.y,
  }
  await page.mouse.move(s1.x, s1.y)
  await page.mouse.down()
  await page.mouse.move(s1.x + 60, s1.y, { steps: 8 })
  await page.mouse.up()
  await page.waitForTimeout(300)
  await page.screenshot({ path: 'test-results/z-handle-after-drag.png' })

  const after = await page.evaluate(() => {
    const store = (window as unknown as { __store: Store }).__store
    const l = store.getState().document.elements['lk-z'] as {
      points: Array<{ x: number; y: number }>
    }
    return l.points
  })
  expect(realErrors()).toEqual([])
  // 8-28/8-29 路由演进后：起点带 30px 45° 出线 stub，拖动竖直段右移 60，尾段水平接入终点侧
  expect(after).toHaveLength(4)
  const stubLen = Math.hypot(after[0]!.x - 600, after[0]!.y - 200)
  expect(stubLen).toBeCloseTo(30, 0)
  // 拖动的竖直段：x 600 → 660
  expect(after[1]!.x).toBeCloseTo(660, 0)
  expect(after[2]!.x).toBeCloseTo(660, 0)
  expect(after[3]!.y).toBeCloseTo(430, 0)
  // 正交性：除 45° 出线 stub 外，相邻折点必须共 x 或共 y
  for (let i = 2; i < after.length; i++) {
    const sameX = Math.abs(after[i]!.x - after[i - 1]!.x) < 0.5
    const sameY = Math.abs(after[i]!.y - after[i - 1]!.y) < 0.5
    expect(sameX || sameY).toBe(true)
  }
})
