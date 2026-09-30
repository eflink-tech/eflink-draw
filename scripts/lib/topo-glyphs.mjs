/**
 * 拓扑符号（手绘单色矢量）—— 网络拓扑图形库扩充批。
 *
 * 与 ProcessOn 转换来的 738 个图标的区别：全部单色墨迹，面板改「填充色」即整体换色，
 * 因此适合画部署图/架构图时统一配色。数据经 glyph-to-raw 编码成 IconRaw，走网络图标
 * 同一套品类 chunk 懒加载 + 缩略图 + 搜索索引。
 *
 * 坐标写在 48×48（设备符号）或帧的实际默认尺寸里，生成器统一比例化。
 */
import {
  ST,
  arcBand,
  bar,
  hollow,
  hollowRect,
  icon,
  poly,
  ribbon,
  ring,
  rotAbout,
} from './glyph-kit.mjs'
import { CLOSE, cubic, ellipsePath, move } from './mobile-glyphs.mjs'
import { frameRaw, glyphRaw } from './glyph-to-raw.mjs'

const D = 48 // 设备符号默认尺寸
const devs = []
const push = (n, t, draw, g = 'topo_devices') => devs.push({ n, t, g, draw })

const polar = (cx, cy, r, a) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r]

/** 箭头：杆（ribbon）+ 三角头，t 为笔画厚度 */
function arrow(p0, p1, t) {
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1]
  const L = Math.hypot(dx, dy) || 1
  const u = [dx / L, dy / L], n = [u[1], -u[0]]
  const head = t * 2.4
  const base = [p1[0] - u[0] * head, p1[1] - u[1] * head]
  const hw = t * 1.5
  return [
    ribbon([p0, base], t),
    poly([p1, [base[0] + n[0] * hw, base[1] + n[1] * hw], [base[0] - n[0] * hw, base[1] - n[1] * hw]]),
  ]
}

/** 从圆心向四个正方向伸出的箭头（路由器/交换机族共用） */
function radialArrows(cx, cy, r0, r1, t, angles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
  return angles.flatMap((a) => arrow(polar(cx, cy, r0, a), polar(cx, cy, r1, a), t))
}

// ────────────────────────────── 网络互联设备 ──────────────────────────────

// 路由器：圆环 + 四向箭头
push('topo_router', '路由器', (w, h) => {
  const t = ST(w, 0.062)
  const c = w / 2
  return icon('black', [ring(c - w * 0.3, c - w * 0.3, w * 0.6, t), ...radialArrows(c, c, w * 0.1, w * 0.46, t)])
})

// 边界路由器：圆环 + 四向箭头 + 外圈（串联两道环）
push('topo_router_edge', '边界路由器', (w, h) => {
  const t = ST(w, 0.055)
  const c = w / 2
  return icon('black', [
    ring(2, 2, w - 4, t),
    ...radialArrows(c, c, w * 0.12, w * 0.42, t),
    ring(c - w * 0.24, c - w * 0.24, w * 0.48, t),
  ])
})

// 三层交换机：方框 + 框内四向箭头（箭头不越框）
push('topo_switch_l3', '三层交换机', (w, h) => {
  const t = ST(w, 0.062)
  const c = w / 2
  return icon('black', [
    hollowRect(w * 0.08, h * 0.18, w * 0.84, h * 0.64, w * 0.06, t),
    ...radialArrows(c, h * 0.5, w * 0.1, w * 0.26, t),
  ])
})

// 二层交换机：方框 + 一条总线挂三台（更「交换」的观感）
push('topo_switch_l2', '二层交换机', (w, h) => {
  const t = ST(w, 0.062)
  return icon('black', [
    hollowRect(w * 0.08, h * 0.3, w * 0.84, h * 0.4, w * 0.05, t),
    bar(w * 0.2, h * 0.44, w * 0.06, h * 0.12),
    bar(w * 0.34, h * 0.44, w * 0.06, h * 0.12),
    bar(w * 0.48, h * 0.44, w * 0.06, h * 0.12),
    ...[0.24, 0.44, 0.64].map((x) => ribbon([[w * x, h * 0.12], [w * x, h * 0.3]], t * 0.8)),
    ...[0.24, 0.44, 0.64].map((x) => poly([[w * x - w * 0.05, h * 0.12], [w * x + w * 0.05, h * 0.12], [w * x, h * 0.02]])),
  ])
})

// 集线器：机箱 + 一排端口 + 下方总线
push('topo_hub', '集线器', (w, h) => {
  const t = ST(w, 0.06)
  const ports = [0.16, 0.32, 0.48, 0.64, 0.8]
  return icon('black', [
    hollowRect(w * 0.08, h * 0.2, w * 0.84, h * 0.36, w * 0.05, t),
    ...ports.map((x) => bar(w * x - w * 0.045, h * 0.29, w * 0.09, h * 0.18)),
    ...ports.map((x) => ribbon([[w * x, h * 0.56], [w * x, h * 0.78]], t * 0.6)),
    ribbon([[w * 0.16, h * 0.78], [w * 0.8, h * 0.78]], t * 0.6),
  ])
})

// 网桥：两个三角相对（桥接）
push('topo_bridge', '网桥', (w, h) => {
  const t = ST(w, 0.062)
  return icon('black', [
    hollowRect(w * 0.06, h * 0.34, w * 0.26, h * 0.32, w * 0.05, t),
    hollowRect(w * 0.68, h * 0.34, w * 0.26, h * 0.32, w * 0.05, t),
    ribbon([[w * 0.32, h * 0.5], [w * 0.68, h * 0.5]], t),
    poly([[w * 0.44, h * 0.36], [w * 0.56, h * 0.5], [w * 0.44, h * 0.64]]),
  ])
})

// 防火墙：砖墙（错缝横条砖，左右对称不出界）
push('topo_firewall', '防火墙', (w, h) => {
  const t = ST(w, 0.055)
  const BW = 0.28, HB = 0.1175 // 满砖 / 半砖宽（错缝行两端收半砖）
  const brick = (x, bw, y) => hollowRect(w * x, h * y, w * bw, h * 0.18, w * 0.02, t * 0.9)
  const full = [0.035, 0.36, 0.685] // 满砖行：3 砖 2 缝，左右各留 0.035
  const half = [0.035, 0.1975, 0.5225, 0.8475] // 错缝行：半砖+2 满砖+半砖
  const halfW = [HB, BW, BW, HB]
  return icon('black', [
    ...full.map((x) => brick(x, BW, 0.11)),
    ...half.map((x, i) => brick(x, halfW[i], 0.31)),
    ...full.map((x) => brick(x, BW, 0.51)),
    ...half.map((x, i) => brick(x, halfW[i], 0.71)),
  ])
})

// 入侵检测 IDS：盾牌轮廓 + 内部对勾
push('topo_ids', '入侵检测 IDS', (w, h) => {
  const t = ST(w, 0.06)
  const shield = [
    [w * 0.5, h * 0.04], [w * 0.9, h * 0.16], [w * 0.9, h * 0.5],
    [w * 0.5, h * 0.96], [w * 0.1, h * 0.5], [w * 0.1, h * 0.16],
  ]
  return icon('black', [
    hollow(poly(shield), w * 0.5, h * 0.5, w * 0.4, h * 0.46, t),
    ribbon([[w * 0.32, h * 0.46], [w * 0.45, h * 0.62], [w * 0.7, h * 0.28]], t * 1.2),
  ])
})

// 负载均衡：一进三出
push('topo_balancer', '负载均衡', (w, h) => {
  const t = ST(w, 0.06)
  const c = w / 2
  return icon('black', [
    ring(c - w * 0.16, c - w * 0.16, w * 0.32, t),
    ...arrow([w * 0.02, h * 0.5], [w * 0.3, h * 0.5], t),
    ...arrow([w * 0.62, h * 0.34], [w * 0.94, h * 0.14], t),
    ...arrow([w * 0.66, h * 0.5], [w * 0.98, h * 0.5], t),
    ...arrow([w * 0.62, h * 0.66], [w * 0.94, h * 0.86], t),
  ])
})

//  VPN 网关：锁 + 网络节点
push('topo_vpn', 'VPN 网关', (w, h) => {
  const t = ST(w, 0.06)
  return icon('black', [
    hollowRect(w * 0.2, h * 0.44, w * 0.6, h * 0.46, w * 0.06, t),
    arcBand(w * 0.5, h * 0.44, w * 0.22, h * 0.3, t * 1.1, Math.PI, Math.PI * 2, 12),
    bar(w * 0.45, h * 0.6, w * 0.1, h * 0.18),
  ])
})

// ────────────────────────────── 无线 ──────────────────────────────

// 无线 AP：机身 + 两根天线 + 信号弧
push('topo_wireless_ap', '无线 AP', (w, h) => {
  const t = ST(w, 0.06)
  return icon('black', [
    hollowRect(w * 0.14, h * 0.56, w * 0.72, h * 0.28, w * 0.05, t),
    ribbon([[w * 0.28, h * 0.56], [w * 0.2, h * 0.24]], t),
    ribbon([[w * 0.72, h * 0.56], [w * 0.8, h * 0.24]], t),
    ...[0.12, 0.2].map((r) => arcBand(w * 0.5, h * 0.5, w * r, h * r * 1.1, t * 0.9, -Math.PI * 0.85, -Math.PI * 0.15, 10)),
  ])
})

// 天线塔：三角塔 + 顶部发射弧（弧顶收进边界内）
push('topo_antenna', '天线', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    ribbon([[w * 0.5, h * 0.28], [w * 0.22, h * 0.94]], t),
    ribbon([[w * 0.5, h * 0.28], [w * 0.78, h * 0.94]], t),
    ribbon([[w * 0.3, h * 0.71], [w * 0.7, h * 0.71]], t * 0.8),
    ribbon([[w * 0.36, h * 0.54], [w * 0.64, h * 0.54]], t * 0.8),
    bar(w * 0.47, h * 0.15, w * 0.06, h * 0.16),
    ...[0.09, 0.18].map((r) => arcBand(w * 0.5, h * 0.21, w * r, h * r, t * 0.85, -Math.PI * 0.85, -Math.PI * 0.15, 10)),
  ])
})

// 卫星：机身 + 两侧太阳能板 + 顶部天线
push('topo_satellite', '卫星', (w, h) => {
  const t = ST(w, 0.055)
  const panel = (x) => [
    hollowRect(w * x, h * 0.34, w * 0.26, h * 0.32, w * 0.03, t * 0.9),
    bar(w * (x + 0.085), h * 0.36, w * 0.03, h * 0.28),
    ribbon([[w * (x < 0.5 ? x + 0.26 : x), h * 0.5], [w * (x < 0.5 ? 0.36 : 0.64), h * 0.5]], t * 0.9),
  ]
  return icon('black', [
    ...panel(0.04),
    ...panel(0.7),
    hollowRect(w * 0.36, h * 0.3, w * 0.28, h * 0.4, w * 0.04, t),
    ribbon([[w * 0.5, h * 0.3], [w * 0.5, h * 0.14]], t),
    arcBand(w * 0.5, h * 0.14, w * 0.14, h * 0.12, t * 0.9, Math.PI, Math.PI * 2, 10),
    ring(w * 0.44, h * 0.02, w * 0.12, t * 0.8),
  ])
})

// 卫星接收锅：抛物面（半环旋转 45°）+ 馈源臂 + 立柱
push('topo_dish', '卫星接收锅', (w, h) => {
  const t = ST(w, 0.06)
  const cx = w * 0.42, cy = h * 0.44, r = w * 0.32
  return icon('black', [
    rotAbout(arcBand(cx, cy, r, r, t * 1.5, Math.PI * 0.5, Math.PI * 1.5, 16), cx, cy, -Math.PI / 4),
    ribbon([[cx, cy], [w * 0.78, h * 0.14]], t * 0.8),
    ring(w * 0.74, h * 0.06, w * 0.13, t * 0.9),
    ribbon([[cx, cy], [cx, h * 0.94]], t),
    ribbon([[w * 0.22, h * 0.94], [w * 0.62, h * 0.94]], t),
  ])
})

// ────────────────────────────── 计算与存储 ──────────────────────────────

// 服务器：三层机箱叠放
push('topo_server', '服务器', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    ...[0.12, 0.42, 0.72].flatMap((y) => [
      hollowRect(w * 0.1, h * y, w * 0.8, h * 0.24, w * 0.03, t),
      bar(w * 0.2, h * (y + 0.09), w * 0.08, h * 0.06),
      bar(w * 0.32, h * (y + 0.09), w * 0.08, h * 0.06),
    ]),
    ring(w * 0.76, h * 0.19, w * 0.08, t * 0.8),
    ring(w * 0.76, h * 0.49, w * 0.08, t * 0.8),
    ring(w * 0.76, h * 0.79, w * 0.08, t * 0.8),
  ])
})

// 塔式服务器：立机箱
push('topo_server_tower', '塔式服务器', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.28, h * 0.06, w * 0.44, h * 0.88, w * 0.04, t),
    bar(w * 0.36, h * 0.16, w * 0.28, h * 0.06),
    bar(w * 0.36, h * 0.28, w * 0.28, h * 0.06),
    ring(w * 0.42, h * 0.46, w * 0.16, t * 0.9),
    bar(w * 0.36, h * 0.76, w * 0.28, h * 0.08),
  ])
})

// 数据库：圆柱（顶面椭圆 + 两侧 + 底弧）
push('topo_database', '数据库', (w, h) => {
  const t = ST(w, 0.055)
  const cx = w * 0.5, rx = w * 0.34, ry = h * 0.1
  const y0 = h * 0.2, y1 = h * 0.76
  return icon('black', [
    hollow(ellipsePath(cx - rx, y0 - ry, rx * 2, ry * 2), cx, y0, rx, ry, t),
    bar(cx - rx, y0, t, y1 - y0),
    bar(cx + rx - t, y0, t, y1 - y0),
    arcBand(cx, y1, rx - t / 2, ry, t, 0, Math.PI, 14),
    arcBand(cx, y0 + h * 0.19, rx - t / 2, ry * 0.8, t * 0.8, 0, Math.PI, 12),
  ])
})

// ────────────────────────────── 网关与应用服务 ──────────────────────────────

// 网关：六边形 + 穿透箭头
push('topo_gateway', '网关', (w, h) => {
  const t = ST(w, 0.06)
  const hex = [[0.5, 0.06], [0.9, 0.28], [0.9, 0.72], [0.5, 0.94], [0.1, 0.72], [0.1, 0.28]]
    .map(([x, y]) => [w * x, h * y])
  return icon('black', [
    hollow(poly(hex), w * 0.5, h * 0.5, w * 0.4, h * 0.44, t),
    ...arrow([w * 0.26, h * 0.5], [w * 0.74, h * 0.5], t * 0.9),
  ])
})

// NAT：框内一对反向箭头
push('topo_nat', 'NAT', (w, h) => {
  const t = ST(w, 0.058)
  return icon('black', [
    hollowRect(w * 0.08, h * 0.16, w * 0.84, h * 0.68, w * 0.08, t),
    ...arrow([w * 0.22, h * 0.38], [w * 0.78, h * 0.38], t * 0.8),
    ...arrow([w * 0.78, h * 0.62], [w * 0.22, h * 0.62], t * 0.8),
  ])
})

// 代理服务器：两端主机 + 中间代理节点
push('topo_proxy', '代理服务器', (w, h) => {
  const t = ST(w, 0.058)
  return icon('black', [
    hollowRect(w * 0.04, h * 0.36, w * 0.2, h * 0.28, w * 0.04, t * 0.9),
    hollowRect(w * 0.76, h * 0.36, w * 0.2, h * 0.28, w * 0.04, t * 0.9),
    ring(w * 0.36, h * 0.34, w * 0.28, t),
    ribbon([[w * 0.24, h * 0.5], [w * 0.36, h * 0.5]], t * 0.8),
    ribbon([[w * 0.64, h * 0.5], [w * 0.76, h * 0.5]], t * 0.8),
  ])
})

// DNS：显示器 + 放大镜（域名解析）
push('topo_dns', 'DNS 服务器', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.06, h * 0.1, w * 0.88, h * 0.58, w * 0.05, t),
    ribbon([[w * 0.5, h * 0.68], [w * 0.5, h * 0.86]], t),
    ribbon([[w * 0.28, h * 0.9], [w * 0.72, h * 0.9]], t),
    ring(w * 0.26, h * 0.2, w * 0.26, t * 0.9),
    ribbon([[w * 0.47, h * 0.41], [w * 0.64, h * 0.56]], t * 1.2),
  ])
})

// Web 服务器：地球（圆环 + 经线椭圆 + 赤道）
push('topo_web', 'Web 服务器', (w, h) => {
  const t = ST(w, 0.055)
  const c = w / 2
  return icon('black', [
    ring(c - w * 0.42, c - w * 0.42, w * 0.84, t),
    hollow(ellipsePath(c - w * 0.19, c - w * 0.42, w * 0.38, w * 0.84), c, c, w * 0.19, w * 0.42, t * 0.85),
    bar(w * 0.08, h * 0.47, w * 0.84, t * 0.85),
  ])
})

// 邮件服务器：信封
push('topo_mail', '邮件服务器', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.06, h * 0.22, w * 0.88, h * 0.56, w * 0.04, t),
    ribbon([[w * 0.1, h * 0.28], [w * 0.5, h * 0.58], [w * 0.9, h * 0.28]], t * 0.9),
  ])
})

// 文件服务器：文件夹
push('topo_file', '文件服务器', (w, h) => {
  const t = ST(w, 0.055)
  const folder = poly([[w * 0.06, h * 0.18], [w * 0.4, h * 0.18], [w * 0.5, h * 0.3], [w * 0.94, h * 0.3], [w * 0.94, h * 0.86], [w * 0.06, h * 0.86]])
  return icon('black', [
    hollow(folder, w * 0.5, h * 0.52, w * 0.44, h * 0.34, t),
    bar(w * 0.08, h * 0.42, w * 0.84, t * 0.8),
  ])
})

// 缓存：芯片（方块 + 四边引脚 + 内核）
push('topo_cache', '缓存', (w, h) => {
  const t = ST(w, 0.05)
  const pins = []
  for (let i = 0; i < 3; i++) {
    const p = 0.32 + i * 0.18
    pins.push(
      bar(w * p, h * 0.04, w * 0.08, h * 0.16),
      bar(w * p, h * 0.8, w * 0.08, h * 0.16),
      bar(w * 0.04, h * p, w * 0.16, h * 0.08),
      bar(w * 0.8, h * p, w * 0.16, h * 0.08),
    )
  }
  return icon('black', [
    ...pins,
    hollowRect(w * 0.2, h * 0.2, w * 0.6, h * 0.6, w * 0.04, t * 1.1),
    hollowRect(w * 0.38, h * 0.38, w * 0.24, h * 0.24, w * 0.02, t),
  ])
})

// 消息队列：管道 + 三个消息块
push('topo_mq', '消息队列', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.04, h * 0.3, w * 0.78, h * 0.4, w * 0.18, t),
    ...[0.16, 0.36, 0.56].map((x) => hollowRect(w * x, h * 0.42, w * 0.12, h * 0.16, w * 0.02, t * 0.8)),
    ...arrow([w * 0.86, h * 0.5], [w * 0.98, h * 0.5], t * 1.1),
  ])
})

// 虚拟机：窗口框 + 标题栏 + 内嵌小机
push('topo_vm', '虚拟机', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.06, h * 0.1, w * 0.88, h * 0.7, w * 0.05, t),
    bar(w * 0.08, h * 0.26, w * 0.84, t * 0.8),
    hollowRect(w * 0.24, h * 0.4, w * 0.5, h * 0.28, w * 0.03, t * 0.9),
    ...[0.32, 0.44, 0.56].map((x) => bar(w * x, h * 0.5, w * 0.06, h * 0.08)),
  ])
})

// 容器：砖块堆叠
push('topo_container', '容器', (w, h) => {
  const t = ST(w, 0.05)
  const cell = (x, y) => hollowRect(w * x, h * y, w * 0.2, h * 0.18, w * 0.02, t * 1.05)
  return icon('black', [
    cell(0.3, 0.08), cell(0.54, 0.08),
    cell(0.06, 0.3), cell(0.3, 0.3), cell(0.54, 0.3), cell(0.78, 0.3),
    cell(0.3, 0.52), cell(0.54, 0.52),
    bar(w * 0.08, h * 0.78, w * 0.84, t * 1.2),
  ])
})

// 集群：三节点互联
push('topo_cluster', '集群', (w, h) => {
  const t = ST(w, 0.05)
  const node = (x, y) => hollowRect(w * x, h * y, w * 0.26, h * 0.22, w * 0.03, t * 1.1)
  return icon('black', [
    node(0.37, 0.06), node(0.06, 0.62), node(0.68, 0.62),
    ribbon([[w * 0.5, h * 0.28], [w * 0.5, h * 0.46], [w * 0.19, h * 0.46], [w * 0.19, h * 0.62]], t * 0.8),
    ribbon([[w * 0.5, h * 0.46], [w * 0.81, h * 0.46], [w * 0.81, h * 0.62]], t * 0.8),
  ])
})

// NAS 存储：扁盒 + 盘位 + 指示灯
push('topo_nas', 'NAS 存储', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.04, h * 0.3, w * 0.92, h * 0.4, w * 0.04, t),
    ...[0.12, 0.26, 0.4, 0.54].map((x) => bar(w * x, h * 0.38, w * 0.08, h * 0.24)),
    bar(w * 0.76, h * 0.46, w * 0.1, h * 0.08),
  ])
})

// 磁盘阵列：三层圆盘
push('topo_disk', '磁盘阵列', (w, h) => {
  const t = ST(w, 0.05)
  const cx = w * 0.5, rx = w * 0.36, ry = h * 0.08
  const disc = (y) => hollow(ellipsePath(cx - rx, y - ry, rx * 2, ry * 2), cx, y, rx, ry, t)
  return icon('black', [
    disc(h * 0.22), disc(h * 0.5), disc(h * 0.78),
    bar(cx - rx, h * 0.22, t, h * 0.56),
    bar(cx + rx - t, h * 0.22, t, h * 0.56),
  ])
})

// 备份存储：圆柱 → 圆柱
push('topo_backup', '备份存储', (w, h) => {
  const t = ST(w, 0.05)
  const cyl = (x, wd) => [
    hollow(ellipsePath(w * x, h * 0.2, w * wd, h * 0.14), w * (x + wd / 2), h * 0.27, w * wd / 2, h * 0.07, t),
    bar(w * x, h * 0.27, t, h * 0.36),
    bar(w * (x + wd) - t, h * 0.27, t, h * 0.36),
    arcBand(w * (x + wd / 2), h * 0.63, w * wd / 2 - t / 2, h * 0.07, t, 0, Math.PI, 10),
  ]
  return icon('black', [...cyl(0.02, 0.34), ...arrow([w * 0.42, h * 0.46], [w * 0.58, h * 0.46], t * 1.1), ...cyl(0.64, 0.34)])
})

// ────────────────────────────── 接入与无线 ──────────────────────────────

// 光猫 / 调制解调器：扁盒 + 天线 + 状态灯
push('topo_modem', '光猫 / 调制解调器', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.08, h * 0.44, w * 0.84, h * 0.34, w * 0.05, t),
    ribbon([[w * 0.78, h * 0.44], [w * 0.86, h * 0.16]], t),
    ...[0.2, 0.32, 0.44].map((x) => bar(w * x, h * 0.56, w * 0.07, h * 0.1)),
  ])
})

// 中继器：左进右出 + 上方信号
push('topo_repeater', '中继器 / 放大器', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.28, h * 0.36, w * 0.44, h * 0.4, w * 0.05, t),
    ...arrow([w * 0.02, h * 0.56], [w * 0.24, h * 0.56], t * 0.9),
    ...arrow([w * 0.76, h * 0.56], [w * 0.98, h * 0.56], t * 0.9),
    ...[0.12, 0.2].map((r) => arcBand(w * 0.5, h * 0.36, w * r, h * r, t * 0.85, -Math.PI * 0.85, -Math.PI * 0.15, 8)),
  ])
})

// 无线控制器：机箱 + 端口网格 + 天线
push('topo_controller', '无线控制器', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.1, h * 0.42, w * 0.8, h * 0.42, w * 0.05, t),
    ...[0.2, 0.34, 0.48].flatMap((x) => [bar(w * x, h * 0.5, w * 0.08, h * 0.08), bar(w * x, h * 0.66, w * 0.08, h * 0.08)]),
    ribbon([[w * 0.76, h * 0.42], [w * 0.76, h * 0.24]], t),
    ...[0.1, 0.17].map((r) => arcBand(w * 0.76, h * 0.24, w * r, h * r, t * 0.85, -Math.PI * 0.9, -Math.PI * 0.1, 8)),
  ])
})

// ────────────────────────────── 安全与运维 ──────────────────────────────

// Web 应用防火墙：盾牌 + 感叹号
push('topo_waf', 'Web 应用防火墙', (w, h) => {
  const t = ST(w, 0.055)
  const shield = [[0.5, 0.04], [0.9, 0.16], [0.9, 0.5], [0.5, 0.96], [0.1, 0.5], [0.1, 0.16]]
    .map(([x, y]) => [w * x, h * y])
  return icon('black', [
    hollow(poly(shield), w * 0.5, h * 0.5, w * 0.4, h * 0.46, t),
    bar(w * 0.455, h * 0.24, w * 0.09, h * 0.28),
    bar(w * 0.455, h * 0.6, w * 0.09, h * 0.1),
  ])
})

// 访问控制：钥匙
push('topo_acl', '访问控制策略', (w, h) => {
  const t = ST(w, 0.06)
  return icon('black', [
    ring(w * 0.1, h * 0.36, w * 0.28, t),
    bar(w * 0.36, h * 0.46, w * 0.56, t),
    bar(w * 0.72, h * 0.46, t, h * 0.18),
    bar(w * 0.86, h * 0.46, t, h * 0.26),
  ])
})

// 网管监控：屏幕 + 心跳曲线
push('topo_monitor_net', '网管监控', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.06, h * 0.1, w * 0.88, h * 0.58, w * 0.05, t),
    ribbon([[w * 0.14, h * 0.4], [w * 0.3, h * 0.4], [w * 0.38, h * 0.24], [w * 0.52, h * 0.56], [w * 0.62, h * 0.4], [w * 0.86, h * 0.4]], t * 0.85),
    ribbon([[w * 0.5, h * 0.68], [w * 0.5, h * 0.86]], t),
    ribbon([[w * 0.28, h * 0.9], [w * 0.72, h * 0.9]], t),
  ])
})

// 身份认证：工牌（头像 + 信息条）
push('topo_auth', '身份认证', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.14, h * 0.08, w * 0.72, h * 0.84, w * 0.06, t),
    ring(w * 0.38, h * 0.18, w * 0.24, t * 0.9),
    poly([[w * 0.3, h * 0.56], [w * 0.7, h * 0.56], [w * 0.6, h * 0.44], [w * 0.4, h * 0.44]]),
    bar(w * 0.26, h * 0.68, w * 0.48, t * 0.9),
    bar(w * 0.26, h * 0.8, w * 0.3, t * 0.9),
  ])
})

// ────────────────────────────── 终端与办公 ──────────────────────────────

// 台式机：显示器 + 立机
push('topo_pc', '台式机', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.05, h * 0.14, w * 0.52, h * 0.5, w * 0.03, t),
    ribbon([[w * 0.31, h * 0.64], [w * 0.31, h * 0.72]], t),
    ribbon([[w * 0.16, h * 0.74], [w * 0.46, h * 0.74]], t),
    hollowRect(w * 0.65, h * 0.14, w * 0.3, h * 0.72, w * 0.03, t),
    bar(w * 0.71, h * 0.22, w * 0.18, t * 0.8),
    ring(w * 0.76, h * 0.6, w * 0.08, t * 0.8),
  ])
}, 'topo_endpoints')

// 显示器
push('topo_monitor', '显示器', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.05, h * 0.16, w * 0.9, h * 0.52, w * 0.04, t),
    ribbon([[w * 0.5, h * 0.68], [w * 0.5, h * 0.84]], t),
    ribbon([[w * 0.26, h * 0.86], [w * 0.74, h * 0.86]], t),
  ])
}, 'topo_endpoints')

// 工作站：显示器 + 键盘
push('topo_workstation', '工作站', (w, h) => {
  const t = ST(w, 0.05)
  return icon('black', [
    hollowRect(w * 0.08, h * 0.08, w * 0.84, h * 0.5, w * 0.04, t),
    ribbon([[w * 0.5, h * 0.58], [w * 0.5, h * 0.66]], t),
    hollowRect(w * 0.1, h * 0.68, w * 0.8, h * 0.24, w * 0.03, t),
    ...[0.18, 0.3, 0.42, 0.54, 0.66, 0.78].map((x) => bar(w * x, h * 0.76, w * 0.06, t * 0.9)),
  ])
}, 'topo_endpoints')

// 笔记本：屏幕 + 实心底座
push('topo_laptop', '笔记本', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.18, h * 0.1, w * 0.64, h * 0.54, w * 0.03, t),
    poly([[w * 0.06, h * 0.68], [w * 0.94, h * 0.68], [w * 0.86, h * 0.86], [w * 0.14, h * 0.86]]),
  ])
}, 'topo_endpoints')

// 平板
push('topo_tablet', '平板', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.16, h * 0.06, w * 0.68, h * 0.88, w * 0.07, t),
    ring(w * 0.46, h * 0.8, w * 0.08, t * 0.8),
  ])
}, 'topo_endpoints')

// 手机
push('topo_smartphone', '手机', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.28, h * 0.04, w * 0.44, h * 0.92, w * 0.08, t),
    bar(w * 0.42, h * 0.12, w * 0.16, t * 0.8),
    ring(w * 0.45, h * 0.82, w * 0.1, t * 0.75),
  ])
}, 'topo_endpoints')

// IP 话机：机身 + 听筒 + 屏幕 + 按键
push('topo_ip_phone', 'IP 话机', (w, h) => {
  const t = ST(w, 0.05)
  return icon('black', [
    hollowRect(w * 0.06, h * 0.34, w * 0.88, h * 0.5, w * 0.04, t),
    ribbon([[w * 0.12, h * 0.24], [w * 0.36, h * 0.24], [w * 0.4, h * 0.34]], t * 1.1),
    bar(w * 0.5, h * 0.42, w * 0.36, h * 0.12),
    ...[0.52, 0.64, 0.76].flatMap((x) => [bar(w * x, h * 0.6, w * 0.07, h * 0.07), bar(w * x, h * 0.71, w * 0.07, h * 0.07)]),
    bar(w * 0.14, h * 0.46, w * 0.24, h * 0.14),
  ])
}, 'topo_endpoints')

// 打印机：进纸 + 机身 + 出纸
push('topo_printer', '打印机', (w, h) => {
  const t = ST(w, 0.05)
  return icon('black', [
    hollowRect(w * 0.16, h * 0.06, w * 0.68, h * 0.22, w * 0.02, t * 0.9),
    hollowRect(w * 0.06, h * 0.28, w * 0.88, h * 0.34, w * 0.04, t),
    hollowRect(w * 0.22, h * 0.66, w * 0.56, h * 0.28, w * 0.02, t * 0.9),
    bar(w * 0.14, h * 0.36, w * 0.1, h * 0.07),
  ])
}, 'topo_endpoints')

// 摄像头：机身 + 镜头锥 + 支架
push('topo_camera', '摄像头', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.08, h * 0.24, w * 0.58, h * 0.38, w * 0.05, t),
    poly([[w * 0.66, h * 0.3], [w * 0.94, h * 0.16], [w * 0.94, h * 0.7], [w * 0.66, h * 0.56]]),
    ribbon([[w * 0.37, h * 0.62], [w * 0.37, h * 0.8]], t),
    ribbon([[w * 0.2, h * 0.86], [w * 0.54, h * 0.86]], t),
  ])
}, 'topo_endpoints')

// POS 收银机：屏幕 + 键盘底座
push('topo_pos', 'POS 收银机', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.1, h * 0.08, w * 0.8, h * 0.44, w * 0.04, t),
    ribbon([[w * 0.5, h * 0.52], [w * 0.5, h * 0.6]], t),
    hollowRect(w * 0.14, h * 0.6, w * 0.72, h * 0.3, w * 0.03, t),
    ...[0.24, 0.4, 0.56].map((x) => bar(w * x, h * 0.68, w * 0.09, h * 0.12)),
  ])
}, 'topo_endpoints')

// IoT 传感器：机身 + 天线 + 信号
push('topo_iot', 'IoT 传感器', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.2, h * 0.46, w * 0.6, h * 0.44, w * 0.06, t),
    ribbon([[w * 0.5, h * 0.46], [w * 0.5, h * 0.3]], t),
    ...[0.12, 0.22].map((r) => arcBand(w * 0.5, h * 0.3, w * r, h * r, t * 0.85, -Math.PI * 0.85, -Math.PI * 0.15, 8)),
    bar(w * 0.32, h * 0.6, w * 0.16, h * 0.1),
  ])
}, 'topo_endpoints')

/** 实心小人：头 + 肩（用户族共用） */
const person = (cx, top, s) => [
  ellipsePath(cx - s * 0.28, top, s * 0.56, s * 0.56),
  poly([
    [cx - s * 0.5, top + s * 1.55], [cx - s * 0.38, top + s * 0.74],
    [cx, top + s * 0.62], [cx + s * 0.38, top + s * 0.74], [cx + s * 0.5, top + s * 1.55],
  ]),
]

// 用户
push('topo_user', '用户', (w, h) => icon('black', person(w * 0.5, h * 0.12, w * 0.42)), 'topo_endpoints')

// 用户组：三人
push('topo_users', '用户组', (w, h) => icon('black', [
  ...person(w * 0.19, h * 0.34, w * 0.26),
  ...person(w * 0.81, h * 0.34, w * 0.26),
  ...person(w * 0.5, h * 0.1, w * 0.38),
]), 'topo_endpoints')

// 会议室：白板 + 两人
push('topo_meeting', '会议室', (w, h) => {
  const t = ST(w, 0.05)
  return icon('black', [
    hollowRect(w * 0.14, h * 0.06, w * 0.72, h * 0.44, w * 0.03, t),
    ...person(w * 0.28, h * 0.56, w * 0.24),
    ...person(w * 0.72, h * 0.56, w * 0.24),
  ])
}, 'topo_endpoints')

// ────────────────────────────── 网络与云 ──────────────────────────────

/** 云朵轮廓（贝塞尔）：外框单路径，可 hollow 成描边云 */
const cloudActions = (w, h) => [
  move(w * 0.22, h * 0.8),
  cubic(w * 0.03, h * 0.8, w * 0.03, h * 0.52, w * 0.22, h * 0.52),
  cubic(w * 0.18, h * 0.16, w * 0.6, h * 0.12, w * 0.64, h * 0.4),
  cubic(w * 0.94, h * 0.36, w * 1.0, h * 0.8, w * 0.8, h * 0.8),
  CLOSE,
]
const cloudBox = (w, h) => ({ cx: w * 0.51, cy: h * 0.46, rx: w * 0.485, ry: h * 0.34 })

/** 虚线圆环：n 段弧带拼成（保持单色墨迹，不用描边） */
const dashedRing = (cx, cy, rx, ry, t, n = 14, gapRatio = 0.42) =>
  Array.from({ length: n }, (_, i) => {
    const a0 = (i / n) * Math.PI * 2
    const a1 = a0 + ((Math.PI * 2) / n) * (1 - gapRatio)
    return arcBand(cx, cy, rx, ry, t, a0, a1, 3)
  })

// 因特网：实心云 + 三向箭头（箭头整体上移，头部翼点不出底界）
push('topo_internet', '因特网', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    cloudActions(w, h * 0.72),
    ...arrow([w * 0.5, h * 0.66], [w * 0.5, h * 0.87], t),
    ...arrow([w * 0.34, h * 0.91], [w * 0.14, h * 0.91], t),
    ...arrow([w * 0.66, h * 0.91], [w * 0.86, h * 0.91], t),
  ])
}, 'topo_cloud')

// 云：描边云
push('topo_cloud', '云', (w, h) => {
  const t = ST(w, 0.06)
  const b = cloudBox(w, h)
  return icon('black', [hollow(cloudActions(w, h), b.cx, b.cy, b.rx, b.ry, t)])
}, 'topo_cloud')

// 内网 / 私有云：描边云 + 内部三节点
push('topo_intranet', '内网 / 私有云', (w, h) => {
  const t = ST(w, 0.055)
  const b = cloudBox(w, h)
  return icon('black', [
    hollow(cloudActions(w, h), b.cx, b.cy, b.rx, b.ry, t),
    ring(w * 0.4, h * 0.5, w * 0.18, t * 0.9),
    bar(w * 0.18, h * 0.72, w * 0.16, h * 0.07),
    bar(w * 0.64, h * 0.72, w * 0.16, h * 0.07),
    ribbon([[w * 0.34, h * 0.7], [w * 0.49, h * 0.66]], t * 0.7),
    ribbon([[w * 0.51, h * 0.66], [w * 0.66, h * 0.7]], t * 0.7),
  ])
}, 'topo_cloud')

// 广域网：虚线环 + 三节点
push('topo_wan', '广域网 WAN', (w, h) => {
  const t = ST(w, 0.05)
  return icon('black', [
    ...dashedRing(w * 0.5, h * 0.5, w * 0.44, h * 0.44, t * 1.3),
    ring(w * 0.4, h * 0.06, w * 0.2, t),
    ring(w * 0.08, h * 0.68, w * 0.2, t),
    ring(w * 0.72, h * 0.68, w * 0.2, t),
  ])
}, 'topo_cloud')

// 局域网：边框 + 内部三台主机
push('topo_lan', '局域网 LAN', (w, h) => {
  const t = ST(w, 0.05)
  return icon('black', [
    ...dashedRing(w * 0.5, h * 0.5, w * 0.46, h * 0.42, t * 1.3, 18, 0.34),
    hollowRect(w * 0.36, h * 0.16, w * 0.28, h * 0.2, w * 0.02, t),
    hollowRect(w * 0.1, h * 0.6, w * 0.28, h * 0.2, w * 0.02, t),
    hollowRect(w * 0.62, h * 0.6, w * 0.28, h * 0.2, w * 0.02, t),
    ribbon([[w * 0.5, h * 0.36], [w * 0.5, h * 0.5], [w * 0.24, h * 0.5], [w * 0.24, h * 0.6]], t * 0.7),
    ribbon([[w * 0.5, h * 0.5], [w * 0.76, h * 0.5], [w * 0.76, h * 0.6]], t * 0.7),
  ])
}, 'topo_cloud')

// CDN：描边云 + 分发线上的三个边缘节点
push('topo_cdn', 'CDN', (w, h) => {
  const t = ST(w, 0.055)
  const ch = h * 0.66
  const b = cloudBox(w, ch)
  return icon('black', [
    hollow(cloudActions(w, ch), b.cx, b.cy, b.rx, b.ry, t),
    bar(w * 0.16, h * 0.76, w * 0.68, t * 0.7),
    ...[0.06, 0.41, 0.76].map((x) => ellipsePath(w * x, h * 0.71, w * 0.18, w * 0.18)),
  ])
}, 'topo_cloud')

// 边缘节点：六边形 + 内核
push('topo_edge', '边缘节点', (w, h) => {
  const t = ST(w, 0.055)
  const hex = [[0.5, 0.04], [0.9, 0.27], [0.9, 0.73], [0.5, 0.96], [0.1, 0.73], [0.1, 0.27]]
    .map(([x, y]) => [w * x, h * y])
  return icon('black', [
    hollow(poly(hex), w * 0.5, h * 0.5, w * 0.4, h * 0.46, t),
    ring(w * 0.36, h * 0.36, w * 0.28, t),
  ])
}, 'topo_cloud')

// 运营商：云 + 立柱与底座（骨干接入）
push('topo_isp', '运营商', (w, h) => {
  const t = ST(w, 0.055)
  const ch = h * 0.62
  const b = cloudBox(w, ch)
  return icon('black', [
    hollow(cloudActions(w, ch), b.cx, b.cy, b.rx, b.ry, t),
    bar(w * 0.455, h * 0.56, w * 0.09, h * 0.26),
    bar(w * 0.22, h * 0.8, w * 0.56, t),
  ])
}, 'topo_cloud')

// 楼宇 / 办公楼
push('topo_building', '楼宇', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.16, h * 0.08, w * 0.68, h * 0.86, w * 0.02, t),
    ...[0.2, 0.36, 0.52].flatMap((y) => [bar(w * 0.26, h * y, w * 0.12, h * 0.09), bar(w * 0.46, h * y, w * 0.12, h * 0.09), bar(w * 0.66, h * y, w * 0.08, h * 0.09)]),
    bar(w * 0.42, h * 0.72, w * 0.2, h * 0.22),
  ])
}, 'topo_cloud')

// 数据中心 / 机房：楼宇 + 机柜门
push('topo_idc', '数据中心 / 机房', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollow(poly([[w * 0.5, h * 0.04], [w * 0.96, h * 0.26], [w * 0.96, h * 0.9], [w * 0.04, h * 0.9], [w * 0.04, h * 0.26]]), w * 0.5, h * 0.47, w * 0.46, h * 0.43, t),
    hollowRect(w * 0.36, h * 0.5, w * 0.28, h * 0.4, w * 0.02, t * 0.9),
    bar(w * 0.4, h * 0.58, w * 0.2, t * 0.9),
    bar(w * 0.4, h * 0.7, w * 0.2, t * 0.9),
  ])
}, 'topo_cloud')

// 机柜：立框 + 四层设备
push('topo_rack', '机柜', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.2, h * 0.06, w * 0.6, h * 0.82, w * 0.02, t),
    ...[0.14, 0.32, 0.5, 0.68].map((y) => bar(w * 0.26, h * y, w * 0.48, h * 0.1)),
    ribbon([[w * 0.3, h * 0.88], [w * 0.3, h * 0.96]], t),
    ribbon([[w * 0.7, h * 0.88], [w * 0.7, h * 0.96]], t),
  ])
}, 'topo_cloud')

// UPS 电源：电池 + 电极 + 闪电
push('topo_ups', 'UPS 电源', (w, h) => {
  const t = ST(w, 0.055)
  return icon('black', [
    hollowRect(w * 0.06, h * 0.22, w * 0.8, h * 0.56, w * 0.04, t),
    bar(w * 0.88, h * 0.38, w * 0.08, h * 0.24),
    poly([[w * 0.5, h * 0.28], [w * 0.32, h * 0.54], [w * 0.46, h * 0.54], [w * 0.38, h * 0.76], [w * 0.62, h * 0.46], [w * 0.47, h * 0.46]]),
  ])
}, 'topo_cloud')

/** 区域/分组框：默认 320×200，虚线描边 + 可容纳 + 左上角标题 */
const zones = []
const pushZone = (n, t, w = 320, h = 200, opts = {}) => zones.push({ n, t, w, h, opts })

pushZone('topo_zone_security', '安全域')
pushZone('topo_zone_subnet', '子网 / VLAN')
pushZone('topo_zone_vpc', 'VPC')
pushZone('topo_zone_az', '可用区', 300, 180, { radius: 4 })
pushZone('topo_zone_region', '地域 (Region)', 360, 240, { radius: 14 })
pushZone('topo_zone_dmz', 'DMZ')
pushZone('topo_zone_cluster', '集群', 240, 160, { radius: 20 })
pushZone('topo_zone_site', '站点 / 机房', 320, 200, { dash: false })
pushZone('topo_zone_group', '通用分组框', 240, 140, { lc: '120,120,120' })

export const TOPO_CATEGORY = 'network'

export const TOPO_RAW = [
  ...devs.map((d) => glyphRaw({ n: d.n, t: d.t, c: TOPO_CATEGORY, g: d.g }, D, D, d.draw(D, D))),
  ...zones.map((z) => frameRaw({ n: z.n, t: z.t, c: TOPO_CATEGORY, g: z.g ?? 'topo_zones' }, z.w, z.h, z.opts)),
]
