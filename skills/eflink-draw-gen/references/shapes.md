# eflink-draw 形状目录

> 生成自 `eflink-draw/packages/draw/src/core/schema/shapes/*.ts`（draw 包改动后需重新生成）。
> spec 节点的 `name` 必须取自本表。默认尺寸可被 spec 的 `w`/`h` 覆盖。
> 属性说明：**容器**=可包含子图形（拖入归属）；**不可连线**=锚点为空、连线无法吸附（如泳道、生命线）。

## 分类速查（选型指南）

- **标准流程图**：`process`（处理）、`decision`（判断）、`terminator`（开始/结束）、`data`（数据/输入输出，平行四边形）、`document`（文档）、`predefinedProcess`（子流程）、`storedData`（存储）
- **泳道图（跨职能）**：一个 `swimlaneV`/`swimlaneH` 复合形状自带标题带+N泳道头格+分隔线（实例字段 `laneCount`、`titleColor`、`laneHeadColors`），业务节点直接放泳道上方；容器透明不挡连线。纯泳池用 `verticalPool`/`horizontalPool`，泳道段用 `verticalLane`/`horizontalLane`，阶段分隔用 `verticalSeparator`/`horizontalSeparator`
- **UML 时序图**：`sequenceLifeLine`（生命线=头块+虚线）、`sequenceActorLifeLine`（角色）、`sequenceActivation`（激活条，可上下拉伸、可吸附连线）、`sequenceDeletion`（销毁叉）；消息=带 `seq` 元数据的 linker（见 spec-format.md），不用普通锚点连线
- **UML 其他**：用例图（actor/useCase）、类图（classBox 等）、状态图（umlState/branchMerge）、部署图、组件图
- **BPMN**：startEvent/endEvent/task/bpmnGateway/dataObject 等
- **组织架构**：用 `rectangle` + 无箭头连线（endArrowStyle:'none'）
- **基础/装饰**：roundRectangle、triangle、note、braces、arrowLine 等

## 全量表

| 分类 | name | 标题 | 默认 w×h | 属性 |
| --- | --- | --- | --- | --- |

### 流程图（category: `flow`）

| 流程图 | `process` | 流程 | 96×54 | — |
| 流程图 | `onPageReference` | 页面内引用 | 96×54 | — |
| 流程图 | `decision` | 判定 | 96×54 | — |
| 流程图 | `terminator` | 开始/结束 | 108×54 | — |
| 流程图 | `document` | 文档 | 96×54 | — |
| 流程图 | `data` | 数据 | 96×54 | — |
| 流程图 | `predefinedProcess` | 子流程 | 96×54 | — |
| 流程图 | `storedData` | 外部数据 | 96×54 | — |
| 流程图 | `internalStorage` | 内部存储 | 96×54 | — |
| 流程图 | `sequentialData` | 队列数据 | 54×54 | — |
| 流程图 | `directData` | 数据库 | 96×54 | — |
| 流程图 | `manualInput` | 人工输入 | 96×54 | — |
| 流程图 | `card` | 卡片 | 96×54 | — |
| 流程图 | `paperTape` | 条带 | 96×54 | — |
| 流程图 | `display` | 展示 | 96×54 | — |
| 流程图 | `manualOperation` | 人工操作 | 96×54 | — |
| 流程图 | `preparation` | 预备 | 96×54 | 容器 |
| 流程图 | `parallelMode` | 并行模式 | 96×54 | 容器 |
| 流程图 | `loopLimit` | 循环限值 | 96×54 | — |
| 流程图 | `offPageReference` | 跨页引用 | 63×54 | 容器 |
| 流程图 | `annotation` | 注释 | 96×54 | 容器 |
| 流程图 | `magneticDrum` | 磁鼓 | 70×90 | — |
| 流程图 | `orJunction` | 或连接 | 54×54 | — |
| 流程图 | `summingJunction` | 汇总连接 | 54×54 | — |
| 流程图 | `sort` | 排序 | 69×54 | 不可连线/不可旋转 |
| 流程图 | `merge` | 合并 | 69×54 | 不可连线/不可旋转 |
| 流程图 | `annotationRight` | 注释(右) | 100×70 | 不可连线/不可旋转 |
| 流程图 | `annotationLeft` | 注释(左) | 100×70 | 不可连线/不可旋转 |

### 泳池/泳道族（category: `lane`）

| 泳池/泳道族 | `verticalPool` | 泳池(垂直) | 250×540 | 容器/不可连线/不可旋转 |
| 泳池/泳道族 | `verticalLane` | 泳道(垂直) | 250×500 | 容器/不可连线/不可旋转 |
| 泳池/泳道族 | `horizontalPool` | 泳池(水平) | 640×200 | 容器/不可连线/不可旋转 |
| 泳池/泳道族 | `horizontalLane` | 泳道(水平) | 600×200 | 容器/不可连线/不可旋转 |
| 泳池/泳道族 | `bidirectionalPoolH` | 双向泳池(水平) | 640×400 | 容器/不可连线/不可旋转 |
| 泳池/泳道族 | `bidirectionalPoolV` | 双向泳池(垂直) | 500×540 | 容器/不可连线/不可旋转 |
| 泳池/泳道族 | `horizontalSeparator` | 分隔符(水平) | 300×20 | 容器/不可连线/不可旋转 |
| 泳池/泳道族 | `verticalSeparator` | 分隔符(垂直) | 20×300 | 容器/不可连线/不可旋转 |
| 泳池/泳道族 | `swimlaneV` | 泳道图(垂直) | 720×480 | 容器/不可连线/不可旋转 |
| 泳池/泳道族 | `swimlaneH` | 泳道图(水平) | 720×480 | 容器/不可连线/不可旋转 |

### UML 时序图（category: `uml_sequence`）

| UML 时序图 | `sequenceObject` | 对象 | 96×54 | — |
| UML 时序图 | `sequenceEntity` | 实体 | 40×40 | — |
| UML 时序图 | `sequenceControl` | 控制 | 40×40 | — |
| UML 时序图 | `sequenceBoundary` | 绑定 | 50×40 | — |
| UML 时序图 | `sequenceTimerSignal` | 时间信号 | 30×30 | 容器/不可连线 |
| UML 时序图 | `sequenceConstraint` | 约束 | 85×54 | 容器/不可连线 |
| UML 时序图 | `sequenceActivation` | 激活 | 30×100 | 不可旋转 |
| UML 时序图 | `sequenceLifeLine` | 生命线 | 70×300 | 不可连线 |
| UML 时序图 | `sequenceDeletion` | 删除 | 40×40 | 容器/不可连线 |
| UML 时序图 | `sequenceActorLifeLine` | 角色生命线 | 70×300 | 不可连线 |
| UML 时序图 | `sequenceStateInvariant` | 状态不变式 | 50×50 | 不可连线 |
| UML 时序图 | `sequenceLostMessageTarget` | 丢失消息目标 | 30×20 | 不可连线 |

### BPMN（category: `bpmn`）

| BPMN | `startEvent` | 开始事件 | 40×40 | — |
| BPMN | `intermediateEvent` | 中间事件 | 40×40 | — |
| BPMN | `boundaryEvent` | 边界事件 | 40×40 | — |
| BPMN | `endEvent` | 结束事件 | 40×40 | 容器/不可旋转 |
| BPMN | `task` | 任务 | 400×280 | 容器/不可旋转 |
| BPMN | `callActivity` | 活动 | 400×280 | 容器/不可旋转 |
| BPMN | `subProcess` | 子流程 | 400×280 | 容器/不可旋转 |
| BPMN | `bpmnGateway` | 网关 | 50×50 | 容器 |
| BPMN | `dataObject` | 数据对象 | 70×90 | 容器 |
| BPMN | `dataStore` | 数据存储 | 54×54 | 容器 |
| BPMN | `message` | 消息 | 60×40 | 容器 |
| BPMN | `group` | 组 | 200×140 | 容器 |
| BPMN | `textAnnotation` | 注释 | 96×54 | 容器 |
| BPMN | `conversation` | 对话 | 45×40 | 容器 |
| BPMN | `choreographyTask` | 编排任务 | 120×120 | 容器 |

### 基础图形（category: `basic`）

| 基础图形 | `rectangle` | 矩形 | 96×54 | — |
| 基础图形 | `roundRectangle` | 圆角矩形 | 96×54 | — |
| 基础图形 | `round` | 圆形 | 54×54 | — |
| 基础图形 | `triangle` | 三角形 | 62×54 | — |
| 基础图形 | `diamond` | 菱形 | 96×54 | — |
| 基础图形 | `polygon` | 五边形 | 57×54 | — |
| 基础图形 | `hexagon` | 六边形 | 65×54 | — |
| 基础图形 | `octagon` | 八边形 | 54×54 | — |
| 基础图形 | `pentagon` | 五角星 | 54×54 | — |
| 基础图形 | `sector` | 扇形 | 54×54 | — |
| 基础图形 | `sector2` | 扇形2 | 96×54 | — |
| 基础图形 | `cloud` | 云 | 69×54 | — |
| 基础图形 | `comment` | 对话气泡 | 69×54 | — |
| 基础图形 | `teardrop` | 水滴 | 54×54 | — |
| 基础图形 | `cross` | 十字形 | 54×54 | — |
| 基础图形 | `apqc` | APQC | 72×54 | — |
| 基础图形 | `singleLeftArrow` | 左箭头 | 81×54 | — |
| 基础图形 | `singleRightArrow` | 右箭头 | 81×54 | — |
| 基础图形 | `doubleHorizontalArrow` | 左右箭头 | 81×54 | — |
| 基础图形 | `singleUpArrow` | 上箭头 | 36×54 | — |
| 基础图形 | `singleDownArrow` | 下箭头 | 36×54 | — |
| 基础图形 | `doubleVerticalArrow` | 上下箭头 | 36×54 | — |
| 基础图形 | `backArrow` | 左返回箭头 | 54×54 | 容器 |
| 基础图形 | `rightBackArrow` | 右返回箭头 | 54×54 | 容器 |
| 基础图形 | `corner` | 拐角 | 54×54 | 容器 |
| 基础图形 | `braces` | 大括号 | 200×140 | 容器/不可连线 |
| 基础图形 | `parentheses` | 中括号 | 200×140 | 容器/不可连线 |
| 基础图形 | `rightBrace` | 备注 | 100×140 | 容器/不可连线 |
| 基础图形 | `leftBrace` | 备注 | 100×140 | 容器/不可连线 |
| 基础图形 | `note` | 备注 | 120×120 | — |
| 基础图形 | `line` | 直线 | 100×60 | 不可连线 |
| 基础图形 | `arrowLine` | 箭头线 | 100×60 | 不可连线 |
| 基础图形 | `rightTriangle` | 直角三角形 | 80×70 | — |
| 基础图形 | `codeBlock` | 代码块 | 400×320 | 不可连线/不可旋转 |

### UML 通用（category: `uml_common`）

| UML 通用 | `package` | 包 | 210×150 | 容器 |
| UML 通用 | `combinedFragment` | 组合片断 | 400×280 | 容器 |
| UML 通用 | `umlNote` | 注释 | 96×54 | 不可连线 |
| UML 通用 | `umlText` | 文本 | 160×40 | 不可连线 |
| UML 通用 | `informationItem` | 信息项 | 60×32 | — |

### UML 类图（category: `uml_class`）

| UML 类图 | `simpleClass` | 简单类 | 96×54 | 容器 |
| UML 类图 | `cls` | 类 | 230×150 | 容器 |
| UML 类图 | `interface` | 接口 | 230×150 | 容器 |
| UML 类图 | `activeClass` | 活动类 | 96×54 | — |
| UML 类图 | `multiplictyClass` | 多例类 | 96×54 | 容器 |
| UML 类图 | `simpleInterface` | 接口 | 110×140 | 容器/不可连线 |
| UML 类图 | `constraint` | 约束 | 85×54 | 容器/不可连线 |
| UML 类图 | `port` | 端口 | 20×20 | 不可连线 |
| UML 类图 | `abstractClass` | 抽象类 | 120×60 | 容器 |
| UML 类图 | `signal` | 信号 | 120×60 | 容器 |
| UML 类图 | `prototypeClass` | 原型类 | 160×120 | — |
| UML 类图 | `primitive` | 原始类型 | 80×40 | 不可连线 |
| UML 类图 | `glyphAggregation` | 聚合符号 | 60×24 | 不可连线 |
| UML 类图 | `glyphComposition` | 组合符号 | 60×24 | 不可连线 |
| UML 类图 | `glyphGeneralization` | 泛化符号 | 60×24 | 不可连线 |
| UML 类图 | `glyphDependency` | 依赖符号 | 60×24 | 不可连线 |
| UML 类图 | `glyphAssociation` | 关联符号 | 60×24 | 不可连线 |

### UML 状态/活动图（category: `uml_stateactivity`）

| UML 状态/活动图 | `umlObject` | 对象 | 96×54 | — |
| UML 状态/活动图 | `umlState` | 状态 | 120×90 | — |
| UML 状态/活动图 | `umlStart` | 开始 | 40×40 | 容器 |
| UML 状态/活动图 | `umlEnd` | 结束 | 40×40 | 容器 |
| UML 状态/活动图 | `flowFinal` | 流终止 | 40×40 | 容器 |
| UML 状态/活动图 | `simpleHistory` | 历史 | 40×40 | 容器 |
| UML 状态/活动图 | `detialHistory` | 详细历史 | 40×40 | 容器 |
| UML 状态/活动图 | `sendSignal` | 发送信号 | 116×54 | — |
| UML 状态/活动图 | `receiveSignal` | 接收信号 | 116×54 | — |
| UML 状态/活动图 | `branchMerge` | 分支 | 40×40 | 不可旋转 |
| UML 状态/活动图 | `Synchronization` | 同步 | 120×20 | 不可旋转 |
| UML 状态/活动图 | `stateRectangleContainer` | 容器 | 300×240 | 容器/不可连线/不可旋转 |
| UML 状态/活动图 | `swimlane` | 泳道(垂直) | 250×540 | 容器/不可连线/不可旋转 |
| UML 状态/活动图 | `horizontalSwimlane` | 泳道(水平) | 640×200 | 容器/不可连线/不可旋转 |
| UML 状态/活动图 | `timeSignalFlag` | 时间信号 | 40×40 | 不可连线 |
| UML 状态/活动图 | `entryPoint` | 进入点 | 20×20 | 不可连线/不可旋转 |
| UML 状态/活动图 | `exitPoint` | 退出点 | 20×20 | 不可连线/不可旋转 |
| UML 状态/活动图 | `exception` | 异常 | 60×40 | 容器 |

### UML 用例图（category: `uml_usecase`）

| UML 用例图 | `actor` | 角色 | 40×50 | 容器 |
| UML 用例图 | `useCase` | 用例 | 96×54 | — |
| UML 用例图 | `ovalContainer` | 容器 | 150×220 | — |
| UML 用例图 | `rectangleContainer` | 容器 | 300×240 | — |
| UML 用例图 | `abstractUseCase` | 抽象用例 | 96×54 | 容器/不可旋转 |
| UML 用例图 | `subject` | 主体 | 300×240 | 容器/不可旋转 |
| UML 用例图 | `useCaseVertical` | 用例(竖排) | 54×96 | — |

### UML 部署图（category: `uml_deployment`）

| UML 部署图 | `devComponentNonInstance` | 组件 | 96×54 | 容器 |
| UML 部署图 | `devComponent` | 实例化组件 | 96×54 | 容器 |
| UML 部署图 | `devNodeNonInstance` | 节点 | 270×270 | 容器 |
| UML 部署图 | `devNodeInstance` | 实例化节点 | 270×270 | 容器 |
| UML 部署图 | `uml_deploymentObject` | 对象 | 96×54 | 容器/不可连线 |
| UML 部署图 | `uml_deploymentConstraint` | 约束 | 85×54 | 容器/不可连线 |
| UML 部署图 | `executionEnvironment` | 执行环境 | 270×270 | 容器 |
| UML 部署图 | `artifact` | 工件 | 80×100 | — |

### UML 组件图（category: `uml_component`）

| UML 组件图 | `component` | 组件 | 96×54 | 容器 |
| UML 组件图 | `componentNodeNonInstance` | 节点 | 270×270 | 容器 |
| UML 组件图 | `componentStart` | 接口 | 40×40 | — |
| UML 组件图 | `componentSocket` | 接口(依赖) | 40×40 | — |

### 文本（不进面板）（category: `basic`）

| 文本（不进面板） | `text` | 文本 | 160×40 | 不可连线 |
| 文本（不进面板） | `freetext` | 文本 | 100×40 | — |
