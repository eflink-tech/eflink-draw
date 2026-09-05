---
'@eflink-tech/draw': minor
---

1. **fix**：react-konva 升级到 ~19.0.10，修复 React 19 宿主下编辑器崩溃（ReactCurrentOwner undefined），同时保持 React 18.3 兼容。
2. **feat**：新增 `setDrawRemoteStore`，宿主可注入远端存储（load/save），文档保存异步镜像到远端，启动时远端内容覆盖本地缓存。
