# draw.io stencil 源素材

来源：[jgraph/drawio](https://github.com/jgraph/drawio) `dev` 分支（2026-10 提取），
`src/main/webapp/js/stencils.min.js` 内嵌的压缩 stencil XML 解码而来（脚本 `gen-drawio-stencils.mjs`
运行时用 node:zlib gunzip 读取本目录 `*.xml.gz`）。

- 授权：Apache License 2.0（见 drawio 仓库）。
- 覆盖 6 组共 57 套：signs/*（通用素材）、electrical/*（电气）、rack/*（机房机架）、
  mockup/*（Web 原型）、aws4.xml（AWS 2023 新版图标）、alibaba_cloud.xml（阿里云全量）。
- 注意：weblogos/signs 内少量第三方品牌 Logo 图标受各厂商商标政策约束，商用发布前请自查。
- 重新提取：解码方法见仓库外的一次性脚本；更新 drawio 版本后重导即可，`gen-drawio-stencils.mjs`
  按文件名匹配 `net-icon-groups.json` 里的 `file` 字段。
