// 视口事件：让画布把整页缩放居中（模板新建/插入后调用，画布才知道可视区尺寸）
export const FIT_PAGE_EVENT = 'doculuma:draw:fit-page'

export function requestFitPage(): void {
  window.dispatchEvent(new CustomEvent(FIT_PAGE_EVENT))
}
