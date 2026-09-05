// src/core/editor/fileOps.ts
// 文件菜单能力：导入 JSON 解析 / 下载触发 / 导出文件名清洗。
// 纯函数便于单测；浏览器 DOM 操作集中在 triggerDownload。
import type { DocumentData } from '@/types'
import { isDocumentData } from './persistence'

/** 解析导入文件文本为 DocumentData；坏 JSON / 结构不完整返回 null */
export function parseDocumentFile(text: string): DocumentData | null {
  try {
    const parsed: unknown = JSON.parse(text)
    return isDocumentData(parsed) ? (parsed as DocumentData) : null
  } catch {
    return null
  }
}

/** 触发浏览器下载 dataUrl（a[download] + click） */
export function triggerDownload(dataUrl: string, filename: string): void {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/** 由页面标题生成导出文件名（清洗非法字符 / 截断 / 空则默认名） */
export function buildExportFileName(title: string): string {
  const clean = title.trim().replace(/[\\/:*?"<>|]/g, '').slice(0, 60)
  return `${clean || '未命名图表'}.png`
}

/** 由页面标题生成 .efd.json 导出文件名（清洗规则同上） */
export function buildExportFileNameEfd(title: string): string {
  const clean = title.trim().replace(/[\\/:*?"<>|]/g, '').slice(0, 60)
  return `${clean || '未命名图表'}.efd.json`
}

/** 将 DocumentData 序列化为 .efd.json 文件内容（格式化便于阅读与版本对比） */
export function serializeDocumentFile(doc: DocumentData): string {
  return JSON.stringify(doc, null, 2)
}
