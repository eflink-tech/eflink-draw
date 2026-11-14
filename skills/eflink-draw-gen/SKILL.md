---
name: eflink-draw-gen
description: "生成易飞绘图（eflink-draw）可编辑图形文件。从图片（如 ProcessOn 模板截图）或文字描述产出 .efd.json（编辑器『导入文件』可直接打开）+ SVG 预览，支持 3695 个原生形状：标准流程图、泳道图(swimlaneV)、UML 时序图、组织架构、BPMN、网络/云图标，以及 draw.io 六套图形库（电气工程、机房机架、Web 原型、通用素材等），连线自动正交路由。Use when: (1) 用户给图表截图要求转成 draw 图/模板, (2) 要求生成流程图/泳道图/时序图/组织架构图/电气图/机房图等 draw 文件, (3) 提到 .efd.json / eflink-draw / 易飞绘图模板, (4) 批量采集转换 ProcessOn 模板入库。"
---

# eflink-draw 图形生成

把图表（图片识别或文字描述）转成 eflink-draw 编辑器原生可编辑文件。核心是产出 **DrawSpec JSON**，
再用打包的转换器生成 `.efd.json`（DocumentData）——转换器移植了编辑器同款几何逻辑（连线正交路由、
泳道 path 构建、时序消息），保证导入编辑器后渲染正确。

## 工作流

1. **读约束**：先读 [references/constraints.md](references/constraints.md)（短，必读——违反会产生
   "预览正常但编辑器不对"类问题，核心一条：连线画在所有形状下方，禁止不透明形状横跨连线）。
2. **选形状**：按图表类型查 [references/shapes.md](references/shapes.md) 的选型指南
   （流程图/泳道图/时序图/组织架构各有既定套路）；网络/云/电气/机房/Web 原型/通用素材图标查
   [references/net-icons.md](references/net-icons.md)（3661 个图标全表可 grep）。
3. **写 spec**：按 [references/spec-format.md](references/spec-format.md) 的格式写 DrawSpec JSON。
   坐标从图片估算（量比例换算，10px 网格取整）；从文字描述生成时自行规划布局（从上到下流程、
   同层居中分布、留白 ≥ 形状间距 1.5 倍）。格式细节拿不准时参考 assets/examples/ 里三个实战验证过的示例。
4. **转换**：
   ```bash
   node <skill目录>/scripts/draw_convert.mjs my-spec.json -o ./out
   # 产出 my-spec.efd.json（编辑器"导入文件"可打开）+ my-spec.svg（同几何预览）
   ```
5. **自检**：SVG 预览转 PNG 检查布局/连线/文字（可 Read 图片）：
   ```bash
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
     --screenshot=preview.png --window-size=1400,1000 --hide-scrollbars file://$(pwd)/out/my-spec.svg
   ```
   核对：形状无重叠、连线不穿形状、回环线走 U 形、文字完整。有问题改 spec 重新生成。
6. **交付**：给用户 .efd.json 路径（编辑器顶栏"导入文件"打开）+ 预览图。

## 图片识别要点（转 ProcessOn 类截图）

- 先看清结构：形状类型（判断菱形/起止圆角/数据平行四边形/文档波形）、连线方向与标签（是/否）、配色
- 对照 shapes.md 选最贴近的原生形状；泳道结构必须用 `swimlaneV`，时序图必须用 lifeline/activation+seq
- 颜色从图取近似 RGB；水印文字忽略
- 布局误差 5% 内可接受，不必逐像素

## 可选：入库为模板草稿

导入本地库（localhost:3306/eflink-tech，office_template + office_template_content 两表，status=0 草稿、
type=14 draw）。批量入库参考 `eflink-backend/scripts/seed-templates.mjs` 的 upsert 模式；上线流程为
草稿 → 用户在 /user/template-review 审核 → 上架。此步骤涉及数据库写入，先和用户确认。

## 维护提示

转换器是从 draw 包源码移植的快照，draw 包几何逻辑改动时需同步：
- spec 格式基准：`eflink-frontend/src/data/templates/helpers.ts`
- 连线路由：`eflink-draw/packages/draw/src/core/editor/linker.ts`
- 泳道构建：`eflink-draw/packages/draw/src/core/editor/swimlane.ts`
- 形状 schema：`eflink-draw/packages/draw/src/core/schema/shapes/*.ts`

形状数据是快照，draw 包新增/调整形状后重新生成：
```bash
node scripts/extract-shapes-data.mjs   # → assets/shapes-data.json（3695 形状）
node scripts/gen-net-icons.mjs         # → references/net-icons.md（3661 图标目录）
```
draw.io 图形库由 `eflink-draw/scripts/gen-drawio-stencils.mjs` 生成到 `schema/shapes/groups/`，
本 skill 的提取脚本会自动收录。
