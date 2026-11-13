// DrawViewer / 离屏导出 / embedded 编辑器的本地验收页：vite dev 下打开 /viewer.html
import '@eflink-tech/draw/styles.css'
import './index.css'
import { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  DrawEditor,
  DrawViewer,
  renderDocumentToDataUrl,
  type DrawViewerHandle,
  type DocumentData,
  type ElementInstance,
  type LinkerInstance,
} from '@eflink-tech/draw'

const PAGE = {
  showGrid: false,
  gridSize: 10,
  orientation: 'landscape' as const,
  width: 900,
  height: 420,
  backgroundColor: '255,255,255' as const,
  padding: 0,
  title: '验收样例',
}

const BOX_PATH = [
  [
    { action: 'move' as const, x: 0, y: 0 },
    { action: 'line' as const, x: 'w', y: 0 },
    { action: 'line' as const, x: 'w', y: 'h' },
    { action: 'line' as const, x: 0, y: 'h' },
    { action: 'close' as const },
  ],
]

function box(id: string, x: number, y: number, text: string, angle = 0): ElementInstance {
  return {
    id,
    name: 'rectangle',
    title: '矩形',
    category: 'basic',
    group: 'basic',
    groupName: null,
    locked: false,
    link: '',
    children: [],
    parent: '',
    resizeDir: ['tl', 'tr', 'br', 'bl'],
    attribute: {},
    dataAttributes: [],
    props: { x, y, w: 160, h: 72, zindex: 1, angle },
    shapeStyle: { alpha: 1 },
    lineStyle: { lineColor: '41,102,204', lineWidth: 2, lineStyle: 'solid' },
    fillStyle: { type: 'solid', color: '232,241,255' },
    path: BOX_PATH,
    fontStyle: { size: 14, color: '31,35,41' },
    textBlock: [{ position: { x: 0, y: 0, w: 'w', h: 'h' }, text }],
    anchors: [],
  }
}

function arrow(
  id: string,
  from: { x: number; y: number },
  to: { x: number; y: number },
  text: string,
): LinkerInstance {
  return {
    id,
    name: 'linker',
    from: { id: null, x: from.x, y: from.y, angle: 0 },
    to: { id: null, x: to.x, y: to.y, angle: 0 },
    text,
    linkerType: 'broken',
    lineStyle: {
      lineColor: '50,50,50',
      lineWidth: 2,
      lineStyle: 'solid',
      endArrowStyle: 'solidArrow',
    },
    points: [from, { x: (from.x + to.x) / 2, y: from.y }, to],
    locked: false,
    dataAttributes: [],
    group: '',
    props: { zindex: 3 },
  }
}

const SAMPLE: DocumentData = {
  page: PAGE,
  elements: {
    a: box('a', 80, 100, '开始'),
    b: box('b', 360, 100, '处理'),
    c: box('c', 640, 160, '结束', Math.PI / 12),
    l1: arrow('l1', { x: 240, y: 136 }, { x: 360, y: 136 }, '下一步'),
    l2: arrow('l2', { x: 520, y: 136 }, { x: 700, y: 196 }, '完成'),
  },
}

function App() {
  const viewerRef = useRef<DrawViewerHandle>(null)
  const [img, setImg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const exportImage = async () => {
    setBusy(true)
    try {
      setImg(await renderDocumentToDataUrl(SAMPLE))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: '32px auto', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 18 }}>DrawViewer 只读渲染（裁到内容外接框）</h1>
      <div
        id="viewer-host"
        style={{ border: '1px solid #d9d9d9', borderRadius: 8, background: '#fff', padding: 8 }}
      >
        <DrawViewer ref={viewerRef} document={SAMPLE} maxHeight={480} />
      </div>
      <p style={{ color: '#666', fontSize: 12 }}>
        放大倍数会随容器宽度自适应；旋转图形按四角扩张外接框。
      </p>
      <button onClick={exportImage} disabled={busy}>
        {busy ? '导出中…' : '离屏导出 PNG'}
      </button>{' '}
      <button onClick={() => setImg(viewerRef.current?.toDataURL() ?? null)}>
        从 DrawViewer 导出
      </button>
      {img && (
        <img
          id="exported"
          src={img}
          alt="导出的图"
          style={{ display: 'block', marginTop: 16, maxWidth: '100%', border: '1px solid #eee' }}
        />
      )}
      <h1 style={{ fontSize: 18, marginTop: 32 }}>嵌入式编辑器（不写本地存储）</h1>
      <div id="embedded-host" style={{ height: 520, border: '1px solid #d9d9d9' }}>
        <DrawEditor embedded initialDocument={SAMPLE} branding={false} />
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
