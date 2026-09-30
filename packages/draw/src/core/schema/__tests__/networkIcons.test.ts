import { describe, it, expect } from 'vitest'
import { shapeRegistry } from '../registry'
import {
  isNetworkGroupLoaded,
  loadNetworkGroup,
  loadNetworkSearchIndex,
  networkGroupsOfShapes,
  preloadNetworkGroups,
} from '../shapes/networkLoader'
import { NET_GROUPS, NET_VENDORS } from '../shapes/netIconManifest'
import { NET_GROUP_SHAPE_NAMES } from '../shapes/netIconNames'
import { SHAPE_CATEGORIES, useUIStore } from '@/store/uiStore'

describe('网络拓扑图标品类级懒加载', () => {
  it('manifest 覆盖 50 个品类 / 812 个图标，图形名全局唯一', () => {
    expect(NET_VENDORS.map((v) => v.id)).toEqual(['topo', 'generic', 'cisco', 'aws', 'azure', 'aliyun'])
    expect(NET_GROUPS.length).toBe(50)
    const names = Object.values(NET_GROUP_SHAPE_NAMES).flat()
    expect(names.length).toBe(812)
    expect(new Set(names).size).toBe(names.length)
    for (const group of NET_GROUPS) {
      expect(NET_GROUP_SHAPE_NAMES[group.id]?.length).toBe(group.count)
    }
  })

  it('面板分类由 manifest 派生：网络拓扑 3 厂商、云服务图标 3 厂商', () => {
    const net = SHAPE_CATEGORIES.find((c) => c.id === 'net_topo')
    const cloud = SHAPE_CATEGORIES.find((c) => c.id === 'cloud_icons')
    expect(net?.vendorTabs).toBe(true)
    expect([...new Set(net?.children?.map((c) => c.vendor))]).toEqual(['topo', 'generic', 'cisco'])
    expect(net?.children?.length).toBe(19)
    expect(cloud?.children?.length).toBe(31)
    const total = [...net!.children!, ...cloud!.children!].reduce(
      (n, c) => n + (NET_GROUPS.find((g) => g.id === c.id)?.count ?? 0),
      0,
    )
    expect(total).toBe(812)
  })

  it('展开品类才注册矢量数据；品类间互不牵连；重复调用幂等', async () => {
    expect(shapeRegistry.getShape('branch office')).toBeUndefined()
    const revBefore = useUIStore.getState().netIconsRev

    await Promise.all([loadNetworkGroup('cisco_bulidings'), loadNetworkGroup('cisco_routers')])
    const schema = shapeRegistry.getShape('branch office')
    expect(schema?.title).toBeTruthy()
    expect(schema?.path?.length).toBeGreaterThan(0)
    // 每个品类一个 chunk：各自注册、各自自增一次
    expect(useUIStore.getState().netIconsRev).toBe(revBefore + 2)
    expect(isNetworkGroupLoaded('cisco_bulidings')).toBe(true)
    // 只展开两个品类，不应把整个 Cisco 拉进来
    expect(isNetworkGroupLoaded('cisco_misc')).toBe(false)

    await loadNetworkGroup('cisco_bulidings')
    expect(useUIStore.getState().netIconsRev).toBe(revBefore + 2)
  })

  it('未知品类与空清单不触发加载', async () => {
    await expect(loadNetworkGroup('not_a_group')).resolves.toBeUndefined()
    await expect(preloadNetworkGroups(['not_a_group'])).resolves.toBeUndefined()
  })

  it('落图元素自带 path，旧文档无需 chunk 也能渲染', async () => {
    await loadNetworkGroup('network')
    const el = shapeRegistry.createElement('router', 0, 0)
    expect(el?.path?.length).toBeGreaterThan(0)
    expect(el?.anchors?.length).toBe(4)
  })

  it('SVG fill-rule="evenodd" 透传到子路径，保留图标内镂空', async () => {
    await loadNetworkGroup('ali_network')
    const withEvenOdd = shapeRegistry.getShape('ACS_ali')?.path?.some(
      (sp) => !Array.isArray(sp) && sp.fillRule === 'evenodd',
    )
    expect(withEvenOdd).toBe(true)
  })

  it('图形名可反查品类，供文档 meta.iconGroups 使用', () => {
    expect(networkGroupsOfShapes(['router', 'branch office', 'process'])).toEqual(
      expect.arrayContaining(['network', 'cisco_bulidings']),
    )
    // 非图标图形不参与
    expect(networkGroupsOfShapes(['process'])).toEqual([])
  })

  it('搜索索引按需拉取并与图形名对齐', async () => {
    const entries = await loadNetworkSearchIndex()
    expect(entries.length).toBe(812)
    const router = entries.find((e) => e.name === 'router')
    expect(router?.groupId).toBe('network')
    expect(router?.title).toBeTruthy()
    expect(entries.filter((e) => !e.groupName).length).toBe(0)
    // Cisco/AWS 图标标题多为英文，中文检索靠品类名补齐
    expect(entries.filter((e) => e.groupName.includes('交换机')).length).toBeGreaterThan(20)
  })
})
