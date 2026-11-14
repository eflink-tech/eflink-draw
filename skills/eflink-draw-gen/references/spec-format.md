# DrawSpec 格式参考

DrawSpec 是面向生成方的简化 JSON，由 `scripts/draw_convert.mjs` 转成 eflink-draw 编辑器原生
`DocumentData`（`.efd.json`）。转换器内置编辑器同款几何逻辑（连线正交路由、泳道 path 构建），
spec 里**不需要**写折点、锚点、path、zindex 等派生字段。

## 顶层

```jsonc
{
  "title": "图表标题",          // 写入 page.title
  "width": 1100, "height": 885, // 画布尺寸（建议与内容占满程度匹配，留 10% 边距）
  "nodes": [ ... ],             // 形状数组
  "links": [ ... ]              // 连线数组
}
```

## 节点（基础 9 形状）

```jsonc
{
  "id": "n1",                  // 唯一 id（连线引用用，建议语义化短 id）
  "name": "process",           // 形状名：process | decision | terminator | rectangle | round |
                               //         document | data | predefinedProcess | storedData
  "text": "处理",               // 文字（可空）；\n 为强制换行。窄高框（h≥w×1.4）的 CJK 短文本
                               // 转换器自动逐字竖排（原图此类框即竖排标签），照抄原图窄高尺寸即可
  "x": 400, "y": 200,          // 左上角坐标（建议 10 的倍数，编辑器网格 10px）
  "w": 150, "h": 56,           // 可省略，省略用默认（process 150×56、decision 130×80、terminator 130×48、
                               // rectangle 180×52、round 72×72、document 140×64、data 150×56）
  "fill": "47,107,255",        // RGB 串；深色自动白字，浅色自动黑字（可被 textColor 覆盖）；
                               // "none" = 透明（背景层带/虚线分组框用，配合 z 低图层 + lineStyle dashed）
  "textColor": "255,255,255",  // 可选，覆盖自动字色
  "bold": true,                // 可选
  "fontSize": 14,              // 可选，默认 13
  "lineColor": "50,50,50",     // 可选，边框色
  "lineWidth": 1.5,            // 可选
  "lineStyle": "solid",        // solid | dashed | dot | dotdash
  "z": 5                       // 可选，图层（泳道容器用低 z）
}
```

## 节点（原生形状扩展 `native`）

超出 9 形状时用 `native` 字段（形状名见 shapes.md）：

### 泳道图（跨职能流程图必用，不要用矩形拼）

```jsonc
{
  "id": "pool", "native": "swimlaneV",   // 或 swimlaneH（水平泳道）
  "x": 38, "y": 38, "w": 1027, "h": 812, // 画布内留边距；标题带 40px + 头行 40px 由形状内建
  "title": "<ProcessName>",              // 标题带文字
  "headTexts": ["<Function>", ...],      // 每泳道头格文字，数量 = laneCount
  "titleColor": "216,191,231",           // 标题带背景（可省，省则透明）
  "laneHeadColors": ["190,220,250", ...],// 每格头格背景（可省）
  "laneColors": [...],                   // 每泳道体背景（可省，省则透明）
  "laneCount": 4,
  "z": 5                                 // 低图层；业务节点 z≥10 放泳道区域上方
}
```
固定几何：标题带高 40、头行高 40（不可调）；泳道等分（不支持 laneRatios）。

### UML 时序图

```jsonc
// 生命线：头块(高30) + 虚线中轴；h 覆盖整个交互区
{ "id": "lifeA", "native": "lifeline", "x": 318, "y": 140, "w": 134, "h": 578, "text": "A", "fill": "245,245,200" }
// 激活条：细长圆角矩形，w=30；可吸附连线
{ "id": "act1", "native": "activation", "x": 370, "y": 288, "w": 30, "h": 179, "lineColor": "200,30,30", "lineWidth": 2 }
```
坐标推算：生命线中轴 x = lifeline.x + w/2；激活条 x = 中轴 − 15；激活条 h 覆盖其参与的全部消息 y ± 20。

### UML 类图（三段式类框，不要用矩形拼）

```jsonc
// 类名/属性/操作三段，分隔线内建；attrs/ops 每行一条（+ public / - private）
{ "id": "clsA", "native": "cls", "x": 40, "y": 40, "w": 545, "h": 430,
  "text": "Class（类的名称）",                  // 类名（标题栏，加粗居中）
  "attrs": "类的属性\n+ attribute1:type\n- attribute2:type",  // 属性栏（左对齐）
  "ops": "类的操作\n+ operation1(params):ret",  // 操作栏（左对齐）
  "fill": "230,250,250", "fontSize": 16 }
// 类间关系连线照常 from/to；继承/实现可在 text 写 «implements»、lineStyle dashed
```

### 网络/云产品/图形库图标（3661 个原生图标 + 34 个基础形状）

`references/net-icons.md` 目录里的所有图标名都能直接 `"native": "<图标名>"` 使用：
- 阿里云全家桶 `ali_*` / `ali2_*`（2023 分段）：ECS/ RDS/ OSS/ SLB/ CDN/ WAF/ VPC/ KVStore/ ODPS/ RAM…
- 网络设备 `topo_*`：topo_router/ topo_switch_l3/ topo_firewall/ topo_server/ topo_database/ topo_balancer/ topo_waf…（48×48）
- AWS `aws_*` / `aws4_*`（2023 分段）、Azure、Cisco 全系列
- draw.io 六套图形库：电气工程 `elec_*`（电阻/电容/二极管/逻辑门/波形…）、机房机架 `rack_*`（APC/Dell/HP/HPE/IBM/Oracle/F5…）、Web 原型 `mk_*`（表单/按钮/轮播/日历…）、通用素材 `signs_*`（人物/动物/医疗/交通/科技…）
- 基础扩展：cloud/ directData(数据库圆柱)/ internalStorage/ sector/ single*Arrow 等
- `text` 显示在图标下方（140×28 块）；部分 draw.io 图标自带预填文案（如电气符号、机架设备型号），text 省略时保留原词
- w/h 可省略（用图标自带尺寸）；拓扑分区框 `topo_zone_*` 自带虚线边框+左上角组名，可直接当分组背景
- 检索图标名：grep -i 关键词 references/net-icons.md（如 `grep -i 'oss\\|cdn' net-icons.md`）

其他原生形状（UML 用例/BPMN/基础装饰等）同样可用 `"native": "<shapes.md 中的 name>"`；
schema 定义在 eflink-draw `core/schema/shapes/*.ts`，数据已提取至 assets/shapes-data.json。

## 连线

```jsonc
{
  "from": "n1", "to": "n2",
  "text": "是",                    // 可选，标签放路径中点
  "fromSide": "bottom",            // 可选 top|right|bottom|left，省略自动按相对方位推断
  "toSide": "top",
  // 任一端是 round 的连线自动直线（ER 属性/辐射图原图即直线），矩形/菱形间走正交路由
  "lineStyle": "solid",            // solid | dashed
  "beginArrowStyle": "none",       // 默认 none
  "endArrowStyle": "solidArrow"    // 默认 solidArrow；无箭头（组织架构）用 "none"
}
```
折点由转换器按编辑器同款正交路由自动计算（30px 出线短距、U 形回环、直线快速路径），
**不要**在 spec 里写 points。

### 时序消息（仅 UML 时序图，端点必须是 activation 或 lifeline）

```jsonc
{
  "from": "act1", "to": "act2",
  "text": "request",
  "seq": { "y": 354, "fromDir": 1, "toDir": -1 }  // y=消息高度(绝对坐标)；dir: 1=右缘 -1=左缘 0=中轴
  , "lineStyle": "dashed"                          // 返回/响应消息用 dashed
}
```

## 常用画布尺寸参考

- 流程图（竖向 8~12 节点）：800×1200
- 泳道图 4 泳道：1100×885（swimlaneV 占 38,38 起 1027×812）
- 组织架构 3 层：1200×900
- UML 时序 4 对象：1150×800
