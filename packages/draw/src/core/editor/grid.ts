// 网格计算
// - 减法调色：getDarkerColor(c, 13) = round(v - v/255*13)，getDarkestColor = 强度 26
// - 网格线画在屏幕空间 0.5 偏移处（1px 锐利），屏幕间距 d = max(round(gridSize*scale), 10)
// - 索引 i 为世界网格线索引（从世界原点起算），i % 4 == 0 为主线（darkest）
//   线的屏幕位置 = pan + i*d + 0.5，反推世界坐标 = (i*d + 0.5) / scale

export function getDarkerColor(rgb: string, amount = 13): string {
  const parts = rgb.split(',').map(Number)
  if (parts.length < 3 || parts.some((v) => Number.isNaN(v))) return '221,221,221'
  const darken = (v: number): number => Math.max(0, Math.round(v - (v / 255) * amount))
  return `${darken(parts[0])},${darken(parts[1])},${darken(parts[2])}`
}

export function getDarkestColor(rgb: string): string {
  return getDarkerColor(rgb, 26)
}

/** 一条网格线（world 为世界坐标位置） */
export interface GridLine {
  world: number
  major: boolean
}

export interface GridViewport {
  /** 视口宽（屏幕像素） */
  width: number
  /** 视口高（屏幕像素） */
  height: number
  gridSize: number
  scale: number
  /** 视口平移（viewport.x/y，屏幕像素） */
  panX: number
  panY: number
}

/** 计算视口内可见的网格线（垂直 + 水平） */
export function computeGridLines(vp: GridViewport): {
  vertical: GridLine[]
  horizontal: GridLine[]
} {
  const d = Math.max(Math.round(vp.gridSize * vp.scale), 10)
  return {
    vertical: linesAlong(vp.width, d, vp.panX, vp.scale),
    horizontal: linesAlong(vp.height, d, vp.panY, vp.scale),
  }
}

/** 沿某一轴的可见网格线 */
function linesAlong(size: number, d: number, pan: number, scale: number): GridLine[] {
  const out: GridLine[] = []
  // 屏幕位置 pan + i*d + 0.5 ∈ [0, size]
  const iMin = Math.ceil((-pan - 0.5) / d)
  const iMax = Math.floor((size - pan - 0.5) / d)
  for (let i = iMin; i <= iMax; i++) {
    out.push({
      world: (i * d + 0.5) / scale,
      major: ((i % 4) + 4) % 4 === 0,
    })
  }
  return out
}

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────

/** 页面配置（PageConfig 的几何相关子集） */
export interface PageGeometry {
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
  padding: number
}

/** 页面矩形：总尺寸 + 白色内容区（世界坐标） */
export interface PageRect {
  /** 页面总宽高（含 padding 环） */
  width: number
  height: number
  /** 白色内容区（世界坐标矩形） */
  inner: { x: number; y: number; width: number; height: number }
}

/**
 * 页面生效尺寸：portrait 约定下 width/height 存的是竖版基准值，渲染时横竖交换
 * （旧数据兼容）；属性面板/底栏等一切展示与编辑都应使用本函数的生效尺寸
 */
export function effectivePageSize(page: Pick<PageGeometry, 'width' | 'height' | 'orientation'>): {
  width: number
  height: number
} {
  return page.orientation === 'portrait'
    ? { width: page.height, height: page.width }
    : { width: page.width, height: page.height }
}

/**
 * 计算页面矩形。
 */
export function computePageRect(page: PageGeometry): PageRect {
  const { width, height } = effectivePageSize(page)
  const p = Math.max(0, Math.min(page.padding, width / 2, height / 2))
  return {
    width,
    height,
    inner: {
      x: p,
      y: p,
      width: Math.max(0, width - p * 2),
      height: Math.max(0, height - p * 2),
    },
  }
}

/** 页面内网格线（世界坐标线段，端点已钳制到白区边界） */
export interface PageGridLine {
  x1: number
  y1: number
  x2: number
  y2: number
  major: boolean
}

/**
 * 计算页面白区内的全部网格线段（垂直 + 水平）。
 * 线集合只依赖 scale（屏幕间距 d 与 0.5 偏移），与平移/视口无关——
 * 页面比视口大时拖拽平移不重渲染，新露出的页面部分也已有线。
 */
export function computePageGridLines(
  page: PageGeometry & { gridSize: number },
  vp: { scale: number },
): { vertical: PageGridLine[]; horizontal: PageGridLine[] } {
  const { inner } = computePageRect(page)
  const scale = vp.scale
  // 屏幕空间间距与 0.5 偏移（同 computeGridLines），i 为世界网格线索引（主线锚定原点）
  const d = Math.max(Math.round(page.gridSize * scale), 10)
  const worldsIn = (min: number, max: number): { world: number; major: boolean }[] => {
    const out: { world: number; major: boolean }[] = []
    const iMin = Math.ceil((min * scale - 0.5) / d)
    const iMax = Math.floor((max * scale - 0.5) / d)
    for (let i = iMin; i <= iMax; i++) {
      out.push({ world: (i * d + 0.5) / scale, major: ((i % 4) + 4) % 4 === 0 })
    }
    return out
  }
  return {
    vertical: worldsIn(inner.x, inner.x + inner.width).map((l) => ({
      x1: l.world,
      y1: inner.y,
      x2: l.world,
      y2: inner.y + inner.height,
      major: l.major,
    })),
    horizontal: worldsIn(inner.y, inner.y + inner.height).map((l) => ({
      x1: inner.x,
      y1: l.world,
      x2: inner.x + inner.width,
      y2: l.world,
      major: l.major,
    })),
  }
}
