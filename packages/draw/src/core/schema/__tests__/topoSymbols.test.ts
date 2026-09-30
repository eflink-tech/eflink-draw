// 手绘拓扑符号（scripts/lib/topo-glyphs.mjs → groups/topo_*.ts）
// 这批与 ProcessOn 转换图标的差别：全部单色可改色，且区域框要能当容器用。
import { describe, it, expect, beforeAll } from 'vitest'
import { shapeRegistry } from '../registry'
import { loadNetworkGroup } from '../shapes/networkLoader'
import { NET_GROUP_SHAPE_NAMES } from '../shapes/netIconNames'

const DEVICE_GROUPS = ['topo_devices', 'topo_endpoints', 'topo_cloud']

/** 子路径是否自带样式：单色墨迹要求全部继承元素级 fillStyle/lineStyle */
function hasOwnStyle(path: unknown[]) {
  return path.some((sp) => !Array.isArray(sp) && ('fillStyle' in (sp as object) || 'lineStyle' in (sp as object)))
}

describe('手绘拓扑符号', () => {
  beforeAll(async () => {
    await Promise.all([...DEVICE_GROUPS, 'topo_zones'].map((g) => loadNetworkGroup(g)))
  })

  it('74 个符号全部注册，名称统一 topo_ 前缀且不与既有图标冲突', () => {
    const names = [...DEVICE_GROUPS, 'topo_zones'].flatMap((g) => NET_GROUP_SHAPE_NAMES[g])
    expect(names.length).toBe(74)
    expect(new Set(names).size).toBe(names.length)
    for (const name of names) {
      expect(name.startsWith('topo_'), name).toBe(true)
      expect(shapeRegistry.getShape(name), name).toBeDefined()
    }
  })

  it('设备符号走单色墨迹模型：元素级填充 + 零线宽 + 子路径不写样式', () => {
    for (const name of [...DEVICE_GROUPS].flatMap((g) => NET_GROUP_SHAPE_NAMES[g])) {
      const shape = shapeRegistry.getShape(name)!
      expect(shape.fillStyle, name).toEqual({ type: 'solid', color: '51,51,51' })
      expect(shape.lineStyle?.lineWidth, name).toBe(0)
      expect(hasOwnStyle(shape.path ?? []), name).toBe(false)
      expect(shape.props).toEqual({ w: 48, h: 48 })
      expect((shape.path ?? []).length, name).toBeGreaterThan(0)
    }
  })

  it('至少三成设备符号用 evenodd 挖空，保证描边观感仍是单色', () => {
    const hollowed = [...DEVICE_GROUPS]
      .flatMap((g) => NET_GROUP_SHAPE_NAMES[g])
      .filter((name) =>
        (shapeRegistry.getShape(name)!.path ?? []).some((sp) => !Array.isArray(sp) && sp.fillRule === 'evenodd'),
      )
    expect(hollowed.length * 3).toBeGreaterThanOrEqual(51)
    for (const name of ['topo_router', 'topo_firewall', 'topo_database', 'topo_server']) {
      expect(hollowed, name).toContain(name)
    }
  })

  it('区域框：虚线描边 + 容器属性 + 左上角预填标题', () => {
    const zones = NET_GROUP_SHAPE_NAMES['topo_zones']
    expect(zones.length).toBe(9)
    for (const name of zones) {
      const shape = shapeRegistry.getShape(name)!
      expect(shape.lineStyle?.lineWidth, name).toBe(2)
      expect(shape.fillStyle?.type, name).toBe('none')
      expect(shape.attribute?.container, name).toBe(true)
      expect(shape.attribute?.rotatable, name).toBe(false)
      expect(shape.textBlock?.[0]?.text, name).toBeTruthy()
      expect(shape.textBlock?.[0]?.position, name).toMatchObject({ x: 12, y: 8 })
      expect(shape.props!.w).toBeGreaterThanOrEqual(240)
    }
    // 站点框用实线区分「物理边界」（不带 lineStyle 字段即实线），其余为逻辑分组虚线
    expect(zones.filter((n) => shapeRegistry.getShape(n)?.lineStyle?.lineStyle === 'dashed').length).toBe(8)
    expect(shapeRegistry.getShape('topo_zone_site')?.lineStyle?.lineStyle).toBeUndefined()
  })
})
