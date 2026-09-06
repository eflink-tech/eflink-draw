// 宿主编辑器外观注入：返回链接
// 宿主（如在线办公站点）设置后，顶栏 logo 前渲染一个返回按钮
let backHref: string | null = null

export function setEditorBackHref(href: string | null): void {
  backHref = href
}

export function getEditorBackHref(): string | null {
  return backHref
}
