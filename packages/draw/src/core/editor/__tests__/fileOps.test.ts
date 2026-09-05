// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { buildExportFileName, buildExportFileNameEfd, parseDocumentFile, serializeDocumentFile, triggerDownload } from '../fileOps'

describe('parseDocumentFile', () => {
  it('合法文档返回 DocumentData', () => {
    const doc = { page: { width: 1600, height: 1200 }, elements: {} }
    expect(parseDocumentFile(JSON.stringify(doc))).toEqual(doc)
  })

  it('坏 JSON 返回 null', () => {
    expect(parseDocumentFile('{oops')).toBeNull()
  })

  it('缺 elements 返回 null', () => {
    expect(parseDocumentFile(JSON.stringify({ page: {} }))).toBeNull()
  })
})

describe('buildExportFileName', () => {
  it('清洗非法文件名字符', () => {
    expect(buildExportFileName('流程/图: 新建*图?')).toBe('流程图 新建图.png')
  })
  it('空标题回退默认名', () => {
    expect(buildExportFileName('   ')).toBe('未命名图表.png')
  })
})

describe('triggerDownload', () => {
  it('触发 <a download> 点击', () => {
    const click = vi.fn()
    const origCreate = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = origCreate(tag)
      if (tag === 'a') {
        el.click = click as unknown as typeof el.click
        ;(el as HTMLAnchorElement).download = ''
      }
      return el
    })
    triggerDownload('data:image/png;base64,x', 'f.png')
    expect(click).toHaveBeenCalledOnce()
  })
})

describe('buildExportFileNameEfd', () => {
  it('清洗非法字符并追加 .efd.json 后缀', () => {
    expect(buildExportFileNameEfd('流程/图: 新建*图?')).toBe('流程图 新建图.efd.json')
  })
  it('空标题回退默认名', () => {
    expect(buildExportFileNameEfd('   ')).toBe('未命名图表.efd.json')
  })
  it('截断超长标题', () => {
    const long = 'a'.repeat(100)
    expect(buildExportFileNameEfd(long).length).toBe(60 + '.efd.json'.length)
  })
})

describe('serializeDocumentFile', () => {
  it('输出可解析的 JSON 字符串并包含 page 与 elements', () => {
    const doc = { page: { width: 1600, height: 1200 }, elements: { a: { id: 'a' } } }
    const text = serializeDocumentFile(doc as never)
    expect(JSON.parse(text)).toEqual(doc)
  })
  it('与 parseDocumentFile 互逆（round-trip）', () => {
    const doc = { page: { width: 1600, height: 1200 }, elements: {} }
    expect(parseDocumentFile(serializeDocumentFile(doc as never))).toEqual(doc)
  })
})
