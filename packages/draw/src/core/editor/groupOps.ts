// 组合（⌘G/⇧⌘G）纯函数：选择展开、成员查询、复制重映射
//
// 方案：给 ElementInstance 加轻量 `groupId`（与旧分类字段 `group`/`groupName` 无关），
// 组内成员保持独立坐标与 zindex，"组合"只体现在选择时整组展开。
import { isLinker, type DocumentData, type ElementInstance } from '@/types'

/** 生成组合 ID（grp-时间戳-随机） */
export function newGroupId(): string {
  return `grp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/** 取某组全部成员 ID（图形） */
export function groupMembers(
  elements: DocumentData['elements'],
  groupId: string,
): string[] {
  const out: string[] = []
  for (const el of Object.values(elements)) {
    if (!isLinker(el) && el.groupId === groupId) out.push(el.id)
  }
  return out
}

/**
 * 展开选择：图形按其 groupId 展开为整组成员；连线原样；去重保序。
 * 点选/框选/全选的组成员收敛入口。
 */
export function expandGroupIds(
  elements: DocumentData['elements'],
  ids: Iterable<string>,
): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const id of ids) {
    const el = elements[id]
    if (!el) continue
    if (!isLinker(el) && el.groupId) {
      for (const mid of groupMembers(elements, el.groupId)) {
        if (!seen.has(mid)) {
          seen.add(mid)
          out.push(mid)
        }
      }
    } else if (!seen.has(id)) {
      seen.add(id)
      out.push(id)
    }
  }
  return out
}

/**
 * 复制重映射：同组成员共享新 groupId，使副本组与原组彻底独立。
 * 防御分支：若某组成员未全部包含于副本（正常选择模型下不会发生，
 * 因为选择恒展开整组）或组仅剩 1 个成员，则清除 groupId。
 * @param shapes 副本图形列表（已换发新 id）
 * @param elements 全文档（用于比对原组成员总数；缺省时以副本内计数兜底）
 */
export function remapGroupIdsForCopy(
  shapes: ElementInstance[],
  elements?: DocumentData['elements'],
): ElementInstance[] {
  // 统计副本内每个旧 groupId 的出现次数
  const countInCopy = new Map<string, number>()
  for (const s of shapes) {
    if (s.groupId) countInCopy.set(s.groupId, (countInCopy.get(s.groupId) ?? 0) + 1)
  }
  // 旧 groupId → 新 groupId 映射
  const remap = new Map<string, string>()
  for (const gid of countInCopy.keys()) remap.set(gid, newGroupId())

  return shapes.map((s) => {
    if (!s.groupId) return s
    const inCopy = countInCopy.get(s.groupId) ?? 0
    const full = elements ? groupMembers(elements, s.groupId).length : inCopy
    if (inCopy === full && inCopy >= 2) {
      return { ...s, groupId: remap.get(s.groupId) }
    }
    // 部分复制或单成员组：清除组标识（最安全降级）
    const copy = { ...s }
    delete copy.groupId
    return copy
  })
}
