#!/usr/bin/env node
/**
 * 从 assets/shapes-data.json 生成 references/net-icons.md 图标目录。
 * 形状来源：groups/*.ts（网络图标 + draw.io 六套图形库）。
 * 用法：node gen-net-icons.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(DIR, '..', 'assets', 'shapes-data.json');
const OUT = path.join(DIR, '..', 'references', 'net-icons.md');

const STATIC_CATEGORIES = new Set(['basic', 'flow', 'uml_component', 'uml_deployment']);
const SECTION_LABELS = {
  topo_devices: '网络设备', topo_endpoints: '终端', topo_cloud: '云与机房',
  topo_zones: '拓扑分区框（自带虚线边框）',
  ali_elastic_calc: '阿里云 · 弹性计算', ali_database: '阿里云 · 数据库',
  ali_storage_cdn: '阿里云 · 存储与 CDN', ali_network: '阿里云 · 网络',
  ali_security: '阿里云 · 安全', ali_manage_monitor: '阿里云 · 管理与监控',
  ali_app_service: '阿里云 · 应用服务', ali_internet_midd: '阿里云 · 互联网中间件',
  ali_large_scale_calc: '阿里云 · 大规模计算', ali_domain_website: '阿里云 · 域名与网站',
  ali_industry_cloud: '阿里云 · 行业云', ali_mobile_service: '阿里云 · 移动服务',
  ali_other_products: '阿里云 · 其他产品', ali_devel_resource: '阿里云 · 开发者资源',
  ali2_a_e: '阿里云 2023 · A–E', ali2_f_m: '阿里云 2023 · F–M',
  ali2_n_s: '阿里云 2023 · N–S', ali2_t_z: '阿里云 2023 · T–Z',
  azure: 'Azure', network: '网络通用',
  cisco_bulidings: 'Cisco · 建筑', cisco_computers_peripherals: 'Cisco · 计算机与外设',
  cisco_control_module: 'Cisco · 控制模块', cisco_directors: 'Cisco · 调度器',
  cisco_hubs_gateways: 'Cisco · 集线器与网关', cisco_misc: 'Cisco · 其他',
  cisco_modems_phones: 'Cisco · 调制解调器与电话', cisco_people: 'Cisco · 人物',
  cisco_routers: 'Cisco · 路由器', cisco_security: 'Cisco · 安全',
  cisco_servers: 'Cisco · 服务器', cisco_storage: 'Cisco · 存储',
  cisco_switches: 'Cisco · 交换机', cisco_wireless: 'Cisco · 无线',
  aws_compute: 'AWS · 计算', aws_database: 'AWS · 数据库', aws_storage: 'AWS · 存储',
  aws_networking: 'AWS · 网络', aws_security_identity: 'AWS · 安全与身份',
  aws_general: 'AWS · 通用', aws_groups: 'AWS · 分组', aws_app_servers: 'AWS · 应用服务',
  aws_analytics: 'AWS · 分析', aws_mgmt_tools: 'AWS · 管理工具',
  aws_devel_tools: 'AWS · 开发工具', aws_iot: 'AWS · IoT', aws_mobile_servers: 'AWS · 移动服务',
  aws_sdk: 'AWS · SDK', aws_workforce: 'AWS · 协作', aws_enterprise_apps: 'AWS · 企业应用',
  aws4_a_b: 'AWS 2023 · A–B', aws4_c: 'AWS 2023 · C', aws4_d_f: 'AWS 2023 · D–F',
  aws4_g_i: 'AWS 2023 · G–I', aws4_j_m: 'AWS 2023 · J–M', aws4_n_r: 'AWS 2023 · N–R',
  aws4_s_z: 'AWS 2023 · S–Z',
  elec_abstract: '电气工程 · 抽象符号', elec_capacitors: '电气工程 · 电容',
  elec_diodes: '电气工程 · 二极管', elec_electro_mech: '电气工程 · 机电',
  elec_iec417: '电气工程 · IEC 417', elec_iec_logic_gates: '电气工程 · IEC 逻辑门',
  elec_inductors: '电气工程 · 电感', elec_instruments: '电气工程 · 仪表',
  elec_logic_gates: '电气工程 · 逻辑门', elec_misc: '电气工程 · 其他',
  elec_mosfets1: '电气工程 · MOSFET 1', elec_mosfets2: '电气工程 · MOSFET 2',
  elec_op_amps: '电气工程 · 运放', elec_opto_electronics: '电气工程 · 光电子',
  elec_plc_ladder: '电气工程 · PLC 梯形图', elec_power_semicond: '电气工程 · 功率半导体',
  elec_radio: '电气工程 · 无线电', elec_resistors: '电气工程 · 电阻',
  elec_rot_mech: '电气工程 · 旋转机械', elec_signal_sources: '电气工程 · 信号源',
  elec_thermionic: '电气工程 · 热电子管', elec_transistors: '电气工程 · 晶体管',
  elec_transmission: '电气工程 · 传输', elec_waveforms: '电气工程 · 波形',
  rack_apc: '机房机架 · APC', rack_cisco: '机房机架 · Cisco', rack_dell: '机房机架 · Dell',
  rack_f5: '机房机架 · F5', rack_general: '机房机架 · 通用', rack_hp: '机房机架 · HP',
  rack_hpe_gateways: '机房机架 · HPE 网关', rack_hpe_security: '机房机架 · HPE 安全',
  rack_hpe_switches: '机房机架 · HPE 交换机', rack_ibm: '机房机架 · IBM',
  rack_oracle: '机房机架 · Oracle',
  mk_advertising: 'Web 原型 · 广告位', mk_calendars: 'Web 原型 · 日历',
  mk_carousel: 'Web 原型 · 轮播', mk_charts_tables: 'Web 原型 · 图表与表格',
  mk_controls: 'Web 原型 · 控件', mk_form_elements: 'Web 原型 · 表单元素',
  mk_menus_buttons: 'Web 原型 · 菜单与按钮', mk_misc: 'Web 原型 · 其他', mk_tabs: 'Web 原型 · 标签页',
  signs_animals: '通用素材 · 动物', signs_food: '通用素材 · 食物',
  signs_healthcare: '通用素材 · 医疗', signs_nature: '通用素材 · 自然',
  signs_people: '通用素材 · 人物', signs_safety: '通用素材 · 安全',
  signs_science: '通用素材 · 科学', signs_sports: '通用素材 · 运动',
  signs_tech: '通用素材 · 科技', signs_transportation: '通用素材 · 交通',
  signs_travel: '通用素材 · 旅行',
};

const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const groups = new Map();
for (const def of Object.values(data)) {
  if (STATIC_CATEGORIES.has(def.category)) continue;
  if (!groups.has(def.category)) groups.set(def.category, []);
  groups.get(def.category).push(def);
}

const ORDER = [
  'topo_devices', 'topo_endpoints', 'topo_cloud', 'topo_zones',
  'ali_elastic_calc', 'ali_database', 'ali_storage_cdn', 'ali_network', 'ali_security',
  'ali_manage_monitor', 'ali_app_service', 'ali_internet_midd', 'ali_large_scale_calc',
  'ali_domain_website', 'ali_industry_cloud', 'ali_mobile_service', 'ali_other_products',
  'ali_devel_resource', 'ali2_a_e', 'ali2_f_m', 'ali2_n_s', 'ali2_t_z',
  'aws_compute', 'aws_database', 'aws_storage', 'aws_networking', 'aws_security_identity',
  'aws_general', 'aws_groups', 'aws_app_servers', 'aws_analytics', 'aws_mgmt_tools',
  'aws_devel_tools', 'aws_iot', 'aws_mobile_servers', 'aws_sdk', 'aws_workforce',
  'aws_enterprise_apps', 'aws4_a_b', 'aws4_c', 'aws4_d_f', 'aws4_g_i', 'aws4_j_m',
  'aws4_n_r', 'aws4_s_z', 'azure', 'network',
  ...Array.from(groups.keys()).filter((c) => c.startsWith('cisco_')).sort(),
  ...Array.from(groups.keys()).filter((c) => c.startsWith('elec_')).sort(),
  ...Array.from(groups.keys()).filter((c) => c.startsWith('rack_')).sort(),
  ...Array.from(groups.keys()).filter((c) => c.startsWith('mk_')).sort(),
  ...Array.from(groups.keys()).filter((c) => c.startsWith('signs_')).sort(),
];
const ordered = [...new Set([...ORDER.filter((c) => groups.has(c)),
  ...Array.from(groups.keys()).sort()])];

const total = ordered.reduce((n, c) => n + groups.get(c).length, 0);
const lines = [
  `# 网络图标形状目录（native 直接用 shape 名，全库 ${total} 个）`,
  '',
  '架构图/拓扑图/云部署图优先用这里的图标而不是矩形。用法：`{"id":"rds1","native":"RDS","text":"云数据库 RDS","x":..,"y":..}`（w/h 缺省用图标自带尺寸，text 显示在图标下方；检索本文件用 grep -i 关键词）。',
  '',
  'topo_zone_* 系分区框自带虚线边框+左上角组名，可直接当分组背景。draw.io 六套图形库（电气/机房机架/Web 原型/通用素材）的图标名均为 `<分类>_<英文原名>`，标题保留英文。',
  '',
];
for (const cat of ordered) {
  const items = groups.get(cat).slice().sort((a, b) => a.name.localeCompare(b.name));
  lines.push(`## ${SECTION_LABELS[cat] ?? cat}（${cat}）— ${items.length} 个`, '');
  for (const s of items) lines.push(`- \`${s.name}\` — ${s.title || s.name}`);
  lines.push('');
}
fs.writeFileSync(OUT, lines.join('\n'));
console.log(`✅ ${OUT}：${ordered.length} 个分类，${total} 个图标，${(fs.statSync(OUT).size / 1024).toFixed(0)}KB`);
