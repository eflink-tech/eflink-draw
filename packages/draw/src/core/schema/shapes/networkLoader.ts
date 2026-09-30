// ═══════════════════════════════════════════
// 网络拓扑图标按需加载：品类（group）级 chunk，由 netIconChunks.ts 的静态映射驱动
// 触发点：面板展开品类 / 加载整厂商 / 搜索命中 / 常驻偏好 / 打开文档的 iconGroups
// 注册完成后 bump netIconsRev 驱动面板重绘。幂等、并发去重。
// 已落图元素自带 path 快照，文档渲染不依赖这里 —— 少加载只影响面板能否拖出新图形。
// ═══════════════════════════════════════════
import { shapeRegistry } from '../registry'
import { NET_ICON_LOADERS } from './netIconChunks'
import { NET_GROUPS, NET_VENDORS } from './netIconManifest'
import { NET_GROUP_SHAPE_NAMES } from './netIconNames'
import type { ShapeDefinition } from '@/types'
import { useUIStore } from '@/store/uiStore'

const promises = new Map<string, Promise<void>>()
const ready = new Set<string>()

/** 图形名 → 品类 id（主包常驻清单反查，供文档 meta 与搜索定位） */
const groupOfShape = new Map<string, string>()
for (const [groupId, names] of Object.entries(NET_GROUP_SHAPE_NAMES)) {
  for (const name of names) groupOfShape.set(name, groupId)
}

/** 加载并注册单个图标品类的矢量数据；未知品类或已加载过则跳过 */
export function loadNetworkGroup(groupId: string): Promise<void> {
  const existing = promises.get(groupId)
  if (existing) return existing
  const importShapes = NET_ICON_LOADERS[groupId]
  if (!importShapes) return Promise.resolve()
  const promise = importShapes()
    .then((shapes) => {
      for (const shape of shapes as ShapeDefinition[]) shapeRegistry.addShape(shape)
      ready.add(groupId)
      useUIStore.getState().bumpNetworkIconsRev()
    })
    .catch((e) => {
      promises.delete(groupId)
      throw e
    })
  promises.set(groupId, promise)
  return promise
}

/** 矢量数据已注册完成的品类 */
export function loadedNetworkGroups(): string[] {
  return [...ready]
}

export function isNetworkGroupLoaded(groupId: string): boolean {
  return ready.has(groupId)
}

/** 搜索结果里的图形可能还没加载完：落图/拖拽前先按品类拉取，返回是否可用 */
export async function ensureNetworkShapeLoaded(shapeName: string): Promise<boolean> {
  if (shapeRegistry.getShape(shapeName)) return true
  const groupId = groupOfShape.get(shapeName)
  if (!groupId) return false
  await loadNetworkGroup(groupId)
  return !!shapeRegistry.getShape(shapeName)
}

/** 并行加载某厂商全部品类（面板「加载整厂商」） */
export function loadNetworkVendor(vendorId: string): Promise<void> {
  const vendor = NET_VENDORS.find((v) => v.id === vendorId)
  if (!vendor) return Promise.resolve()
  return preloadNetworkGroups(vendor.groupIds)
}

/** 定向预载（常驻偏好 / 文档 iconGroups）：不阻塞渲染，失败静默 */
export function preloadNetworkGroups(groupIds: Iterable<string>): Promise<void> {
  const valid = [...new Set(groupIds)].filter((id) => id in NET_ICON_LOADERS)
  if (valid.length === 0) return Promise.resolve()
  return Promise.all(valid.map((id) => loadNetworkGroup(id))).then(() => undefined)
}

/** 按用户常驻偏好预载（编辑器挂载时调用） */
export function applyNetworkIconPrefs(): Promise<void> {
  return preloadNetworkGroups(useUIStore.getState().netIconPrefs)
}

/** 文档用到哪些图标品类：写进 meta.iconGroups，打开时定向预载面板 */
export function networkGroupsOfShapes(shapeNames: Iterable<string>): string[] {
  const ids = new Set<string>()
  for (const name of shapeNames) {
    const groupId = groupOfShape.get(name)
    if (groupId) ids.add(groupId)
  }
  return [...ids]
}

export interface NetIconEntry {
  name: string
  title: string
  groupId: string
  /** 品类中文名：Cisco/AWS 图标标题多为英文，靠品类名补齐中文可搜性 */
  groupName: string
}

let searchIndex: Promise<NetIconEntry[]> | null = null

/** 中文标题体积大，仅面板首次搜索时拉取（约 15KB） */
export function loadNetworkSearchIndex(): Promise<NetIconEntry[]> {
  if (searchIndex) return searchIndex
  searchIndex = import('./netIconTitles')
    .then(({ NET_GROUP_SHAPE_TITLES }) => {
      const entries: NetIconEntry[] = []
      for (const [groupId, names] of Object.entries(NET_GROUP_SHAPE_NAMES)) {
        const titles = (NET_GROUP_SHAPE_TITLES[groupId] ?? '').split('\u001e')
        const groupName = NET_GROUPS.find((g) => g.id === groupId)?.name ?? groupId
        names.forEach((name, i) => entries.push({ name, title: titles[i] ?? '', groupId, groupName }))
      }
      return entries
    })
    .catch((e) => {
      searchIndex = null
      throw e
    })
  return searchIndex
}

/** 面板按品类取图形清单（矢量数据是否已注册由 isNetworkGroupLoaded 判断） */
export function networkGroupShapeNames(groupId: string): string[] {
  return NET_GROUP_SHAPE_NAMES[groupId] ?? []
}
