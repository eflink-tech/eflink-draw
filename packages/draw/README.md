# @eflink-tech/draw

开箱即用的在线流程图/绘图编辑器 React 组件（基于 [Konva](https://konvajs.org/)）。可独立运行，也可作为组件嵌入任意 React 应用。

## 安装

```bash
npm install @eflink-tech/draw
# react / react-dom >= 18 为 peer 依赖
```

## 使用

```tsx
import { DrawEditor } from '@eflink-tech/draw';
import '@eflink-tech/draw/styles.css';

<div style={{ width: '100vw', height: '100vh' }}>
  <DrawEditor />
</div>
```

组件自带完整编辑器 UI（工具栏、图形面板、属性面板、状态栏、AI 助手），挂载后自动恢复上次编辑的文档。导出 `useEditorStore`（程序化操作图形）、`saveDocumentToStorage / loadDocumentFromStorage`（快照持久化）与 `DocumentData` 等数据类型。

> **Tailwind 说明**：组件库内部布局用到少量 Tailwind 工具类（已随 `styles.css` 提供回退样式）。若宿主使用 Tailwind v4 且希望得到与 demo 一致的布局，请在入口 CSS 中显式扫描组件包：
>
> ```css
> @import "tailwindcss";
> @source "../node_modules/@eflink-tech/draw";
> ```

完整文档（AI 助手配置、本地开发、目录结构）见仓库根 README：

https://github.com/eflink-tech/eflink-draw

## License

MIT
