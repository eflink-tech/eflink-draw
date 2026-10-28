import { registerOfficeMessages, type OfficeLocale, type OfficeMessagesByLocale } from '@eflink-tech/office-kit';
import { DRAW_AI_MESSAGES } from './messagesAi';

/**
 * 绘图编辑器专属文案。数组顺序固定为 [zh-CN, en, es, pt-BR]。
 * 图形/分类/模板等素材标题按中文原文查表，见 shapeTitles.ts 与 contentTitles.ts。
 */
type Row = readonly [string, string, string, string];

const ROWS = {
  'draw.untitled': ['未命名图表', 'Untitled diagram', 'Diagrama sin título', 'Diagrama sem título'],
  'draw.brand': ['DocuLuma Draw', 'DocuLuma Draw', 'DocuLuma Draw', 'DocuLuma Draw'],

  'draw.menu.file': ['文件', 'File', 'Archivo', 'Arquivo'],
  'draw.menu.edit': ['编辑', 'Edit', 'Editar', 'Editar'],
  'draw.menu.view': ['视图', 'View', 'Ver', 'Exibir'],
  'draw.menu.insert': ['插入', 'Insert', 'Insertar', 'Inserir'],
  'draw.menu.arrange': ['排列', 'Arrange', 'Organizar', 'Organizar'],
  'draw.menu.help': ['帮助', 'Help', 'Ayuda', 'Ajuda'],

  'draw.file.rename': ['重命名', 'Rename', 'Renombrar', 'Renomear'],
  'draw.file.new': ['新建', 'New', 'Nuevo', 'Novo'],
  'draw.file.newConfirm': [
    '新建将清空当前画布，确定？',
    'Create a new diagram? The current canvas will be cleared.',
    '¿Crear un diagrama nuevo? Se borrará el lienzo actual.',
    'Criar um novo diagrama? A tela atual será limpa.',
  ],
  'draw.file.fromTemplate': ['从模板新建…', 'New from template…', 'Nuevo desde plantilla…', 'Novo a partir de modelo…'],
  'draw.file.import': ['导入文件', 'Import file', 'Importar archivo', 'Importar arquivo'],
  'draw.file.download': ['下载文件', 'Download file', 'Descargar archivo', 'Baixar arquivo'],
  'draw.file.downloadPng': ['下载为 PNG', 'Download as PNG', 'Descargar como PNG', 'Baixar como PNG'],
  'draw.dialog.renameFile': ['重命名文件', 'Rename file', 'Renombrar archivo', 'Renomear arquivo'],

  'draw.edit.duplicate': ['复用', 'Duplicate', 'Duplicar', 'Duplicar'],
  'draw.edit.formatBrush': ['格式刷', 'Format painter', 'Copiar formato', 'Pincel de formatação'],

  'draw.view.showShapes': ['显示图形库', 'Show shape library', 'Mostrar biblioteca de formas', 'Mostrar biblioteca de formas'],
  'draw.view.showProperties': ['显示属性面板', 'Show properties panel', 'Mostrar panel de propiedades', 'Mostrar painel de propriedades'],
  'draw.view.showAi': ['显示 AI 助手', 'Show AI assistant', 'Mostrar asistente de IA', 'Mostrar assistente de IA'],

  'draw.insert.text': ['文本', 'Text', 'Texto', 'Texto'],
  'draw.insert.linker': ['连线', 'Connector', 'Conector', 'Conector'],
  'draw.insert.image': ['图片', 'Image', 'Imagen', 'Imagem'],

  'draw.arrange.front': ['置于顶层', 'Bring to front', 'Traer al frente', 'Trazer para frente'],
  'draw.arrange.back': ['置于底层', 'Send to back', 'Enviar al fondo', 'Enviar para trás'],
  'draw.arrange.forward': ['上移一层', 'Bring forward', 'Traer adelante', 'Avançar'],
  'draw.arrange.backward': ['下移一层', 'Send backward', 'Enviar atrás', 'Voltar'],
  'draw.arrange.align': ['对齐', 'Align', 'Alinear', 'Alinhar'],
  'draw.arrange.distribute': ['分布', 'Distribute', 'Distribuir', 'Distribuir'],
  'draw.arrange.matchSize': ['匹配大小', 'Match size', 'Igualar tamaño', 'Igualar tamanho'],
  'draw.arrange.lock': ['锁定', 'Lock', 'Bloquear', 'Bloquear'],
  'draw.arrange.unlock': ['解锁', 'Unlock', 'Desbloquear', 'Desbloquear'],
  'draw.arrange.group': ['组合', 'Group', 'Agrupar', 'Agrupar'],
  'draw.arrange.ungroup': ['取消组合', 'Ungroup', 'Desagrupar', 'Desagrupar'],

  'draw.align.left': ['左对齐', 'Align left', 'Alinear a la izquierda', 'Alinhar à esquerda'],
  'draw.align.centerH': ['水平居中', 'Align center', 'Centrar horizontalmente', 'Centralizar horizontalmente'],
  'draw.align.right': ['右对齐', 'Align right', 'Alinear a la derecha', 'Alinhar à direita'],
  'draw.align.top': ['顶端对齐', 'Align top', 'Alinear arriba', 'Alinhar ao topo'],
  'draw.align.middle': ['垂直居中', 'Align middle', 'Centrar verticalmente', 'Centralizar verticalmente'],
  'draw.align.bottom': ['底端对齐', 'Align bottom', 'Alinear abajo', 'Alinhar embaixo'],
  'draw.distribute.horizontal': ['水平平均分布', 'Distribute horizontally', 'Distribuir horizontalmente', 'Distribuir horizontalmente'],
  'draw.distribute.vertical': ['垂直平均分布', 'Distribute vertically', 'Distribuir verticalmente', 'Distribuir verticalmente'],
  'draw.matchSize.width': ['宽度', 'Width', 'Ancho', 'Largura'],
  'draw.matchSize.height': ['高度', 'Height', 'Alto', 'Altura'],
  'draw.matchSize.both': ['宽度和高度', 'Width and height', 'Ancho y alto', 'Largura e altura'],

  'draw.toolbar.fillColor': ['填充颜色', 'Fill color', 'Color de relleno', 'Cor de preenchimento'],
  'draw.toolbar.textColor': ['文本颜色', 'Text color', 'Color del texto', 'Cor do texto'],
  'draw.toolbar.lineColor': ['线条颜色', 'Line color', 'Color de línea', 'Cor da linha'],
  'draw.toolbar.layerOrder': ['层级排列', 'Layer order', 'Orden de capas', 'Ordem das camadas'],
  'draw.toolbar.lineStyle': ['线型', 'Line style', 'Estilo de línea', 'Estilo de linha'],
  'draw.toolbar.linkerType': ['连线类型', 'Connector type', 'Tipo de conector', 'Tipo de conector'],
  'draw.toolbar.startPoint': ['起点', 'Start point', 'Punto inicial', 'Ponto inicial'],
  'draw.toolbar.endPoint': ['终点', 'End point', 'Punto final', 'Ponto final'],
  'draw.toolbar.bold': ['加粗', 'Bold', 'Negrita', 'Negrito'],
  'draw.toolbar.italic': ['斜体', 'Italic', 'Cursiva', 'Itálico'],
  'draw.toolbar.underline': ['下划线', 'Underline', 'Subrayado', 'Subrayado'],
  'draw.toolbar.linkerTool': ['连线工具', 'Connector tool', 'Herramienta de conector', 'Ferramenta de conector'],

  'draw.status.elements': ['图形: {count}', 'Shapes: {count}', 'Formas: {count}', 'Formas: {count}'],
  'draw.status.page': ['页面: {size}', 'Page: {size}', 'Página: {size}', 'Página: {size}'],
  'draw.status.unsaved': ['● 未保存', '● Unsaved', '● Sin guardar', '● Não salvo'],
  'draw.status.saved': ['✓ 已保存', '✓ Saved', '✓ Guardado', '✓ Salvo'],
  'draw.status.renameHint': ['点击重命名文件', 'Click to rename file', 'Haz clic para renombrar', 'Clique para renomear'],
  'draw.status.zoomOut': ['缩小', 'Zoom out', 'Alejar', 'Reduzir'],
  'draw.status.zoomIn': ['放大', 'Zoom in', 'Acercar', 'Ampliar'],
  'draw.status.zoomSlider': ['缩放滑块', 'Zoom slider', 'Control de zoom', 'Controle de zoom'],
  'draw.status.resetZoom': ['重置缩放', 'Reset zoom', 'Restablecer zoom', 'Redefinir zoom'],
  'draw.status.enterFocus': ['进入专注模式', 'Enter focus mode', 'Entrar en modo de enfoque', 'Entrar no modo foco'],
  'draw.status.exitFocus': ['退出专注模式 (Esc)', 'Exit focus mode (Esc)', 'Salir del modo de enfoque (Esc)', 'Sair do modo foco (Esc)'],
  'draw.focus.exit': ['退出专注', 'Exit focus', 'Salir del enfoque', 'Sair do modo foco'],

  'draw.panel.shapes': ['图形库', 'Shape library', 'Biblioteca de formas', 'Biblioteca de formas'],
  'draw.panel.loadAll': ['加载全部', 'Load all', 'Cargar todas', 'Carregar tudo'],
  'draw.panel.loadAllVendor': [
    '一次性加载 {name} 全部品类',
    'Load all {name} categories at once',
    'Carga todas las categorías de {name} de una vez',
    'Carrega todas as categorias de {name} de uma vez',
  ],
  'draw.panel.pin': [
    '设为常驻（进入编辑器自动预载）',
    'Pin (preload when the editor opens)',
    'Fijar (se precarga al abrir el editor)',
    'Fixar (pré-carrega ao abrir o editor)',
  ],
  'draw.panel.unpin': [
    '取消常驻（下次进入不再自动预载）',
    'Unpin (stop preloading)',
    'Quitar fijación (dejará de precargarse)',
    'Desafixar (deixará de pré-carregar)',
  ],
  'draw.panel.loadingVectors': ['正在载入矢量数据…', 'Loading vector data…', 'Cargando datos vectoriales…', 'Carregando dados vetoriais…'],
  'draw.panel.properties': ['属性', 'Properties', 'Propiedades', 'Propriedades'],
  'draw.panel.propertiesPanel': ['属性面板', 'Properties panel', 'Panel de propiedades', 'Painel de propriedades'],
  'draw.color.transparent': ['透明', 'Transparent', 'Transparente', 'Transparente'],
  'draw.toolbar.lineStyleDropdown': ['线条样式', 'Line style', 'Estilo de línea', 'Estilo de linha'],
  'draw.panel.closeProperties': ['关闭属性面板', 'Close properties panel', 'Cerrar panel de propiedades', 'Fechar painel de propriedades'],
  'draw.panel.ai': ['AI 助手', 'AI assistant', 'Asistente de IA', 'Assistente de IA'],
  'draw.panel.aiSettings': ['AI 设置', 'AI settings', 'Configuración de IA', 'Configurações de IA'],

  'draw.search.placeholder': ['搜索图形…', 'Search shapes…', 'Buscar formas…', 'Buscar formas…'],
  'draw.search.clear': ['清空搜索', 'Clear search', 'Limpiar búsqueda', 'Limpar busca'],
  'draw.search.loading': ['正在载入图标索引…', 'Loading icon index…', 'Cargando índice de iconos…', 'Carregando índice de ícones…'],
  'draw.search.empty': ['没有匹配「{query}」的图形', 'No shapes match “{query}”', 'Ninguna forma coincide con «{query}»', 'Nenhuma forma corresponde a “{query}”'],
  'draw.search.tooMany': ['「{query}」匹配过多，仅显示前 100 个', 'Too many matches for “{query}” — showing the first 100', 'Demasiadas coincidencias para «{query}»: se muestran las primeras 100', 'Muitas correspondências para “{query}” — exibindo as 100 primeiras'],
  'draw.search.count': ['「{query}」匹配 {count} 个', '{count} shapes match “{query}”', '{count} formas coinciden con «{query}»', '{count} formas correspondem a “{query}”'],

  'draw.share.title': ['分享画板', 'Share diagram', 'Compartir diagrama', 'Compartilhar diagrama'],
  'draw.share.generating': ['正在生成分享链接...', 'Generating share link…', 'Generando enlace para compartir…', 'Gerando link de compartilhamento…'],
  'draw.share.unsupported': ['当前环境不支持分享', 'Sharing is not available here', 'Compartir no está disponible aquí', 'Compartilhar não está disponível aqui'],
  'draw.share.failed': ['分享失败，请稍后重试', 'Sharing failed. Please try again later.', 'No se pudo compartir. Inténtalo de nuevo más tarde.', 'Falha ao compartilhar. Tente novamente mais tarde.'],
  'draw.share.retry': ['重试', 'Retry', 'Reintentar', 'Tentar novamente'],
  'draw.share.link': ['分享链接', 'Share link', 'Enlace para compartir', 'Link de compartilhamento'],
  'draw.share.copied': ['已复制', 'Copied', 'Copiado', 'Copiado'],
  'draw.share.copy': ['复制', 'Copy', 'Copiar', 'Copiar'],
  'draw.share.done': ['完成', 'Done', 'Listo', 'Concluído'],

  'draw.template.title': ['从模板新建', 'New from template', 'Nuevo desde plantilla', 'Novo a partir de modelo'],
  'draw.template.subtitle': ['{count} 种常用流程图，选一个开始', '{count} ready-made diagrams — pick one to start', '{count} diagramas listos: elige uno para empezar', '{count} diagramas prontos — escolha um para começar'],
  'draw.template.all': ['全部', 'All', 'Todas', 'Todas'],
  'draw.template.search': ['搜索模板名称、关键字…', 'Search templates…', 'Buscar plantillas…', 'Buscar modelos…'],
  'draw.template.searchAria': ['搜索模板', 'Search templates', 'Buscar plantillas', 'Buscar modelos'],
  'draw.template.empty': ['没有匹配的模板', 'No matching templates', 'No hay plantillas coincidentes', 'Nenhum modelo correspondente'],
  'draw.template.nodes': ['{count} 个图形', '{count} shapes', '{count} formas', '{count} formas'],
  'draw.template.links': ['{count} 条连线', '{count} connectors', '{count} conectores', '{count} conectores'],
  'draw.template.useNew': ['新建画布使用', 'Use in new canvas', 'Usar en un lienzo nuevo', 'Usar em uma nova tela'],
  'draw.template.insert': ['插入当前画布', 'Insert into current canvas', 'Insertar en el lienzo actual', 'Inserir na tela atual'],
  'draw.template.insertHint': ['已有内容时会插到其右侧，画布自动扩展', 'Existing content stays; the template is placed to its right and the canvas expands', 'El contenido existente se conserva; la plantilla se coloca a la derecha y el lienzo se amplía', 'O conteúdo existente é mantido; o modelo é colocado à direita e a tela se expande'],
  'draw.template.pickHint': ['选择左侧模板查看预览', 'Select a template to preview it', 'Selecciona una plantilla para verla', 'Selecione um modelo para visualizar'],

  'draw.font.yahei': ['微软雅黑', 'Microsoft YaHei', 'Microsoft YaHei', 'Microsoft YaHei'],
  'draw.font.hei': ['思源黑体', 'Source Han Sans', 'Source Han Sans', 'Source Han Sans'],
  'draw.font.song': ['思源宋体', 'Source Han Serif', 'Source Han Serif', 'Source Han Serif'],
  'draw.font.kai': ['楷体', 'KaiTi', 'KaiTi', 'KaiTi'],

  'draw.swimlane.title': ['标题', 'Title', 'Título', 'Título'],
  'draw.swimlane.subTitle': ['二级标题 {index}', 'Subtitle {index}', 'Subtítulo {index}', 'Subtítulo {index}'],
  'draw.swimlane.lane': ['泳道 {index}', 'Lane {index}', 'Carril {index}', 'Raia {index}'],
  'draw.swimlane.laneCount': ['泳道', 'Lanes', 'Carriles', 'Raias'],
  'draw.swimlane.stageCount': ['阶段', 'Stages', 'Fases', 'Etapas'],
  'draw.swimlane.pickHint': [
    '在画布上点击标题带 / 二级标题格 / 泳道即可切换目标',
    'Click a title band, sub-title cell or lane on the canvas to switch target',
    'Haz clic en una banda de título, celda de subtítulo o carril para cambiar el objetivo',
    'Clique em uma faixa de título, célula de subtítulo ou raia para mudar o alvo',
  ],
  'draw.swimlane.border': ['边框', 'Border', 'Borde', 'Borda'],
  'draw.swimlane.textStyleHint': ['当前目标的文字样式', 'Text style for the current target', 'Estilo de texto del objetivo actual', 'Estilo de texto do alvo atual'],
  'draw.swimlane.text': ['文字', 'Text', 'Texto', 'Texto'],
  'draw.swimlane.alignCenter': ['居中', 'Center', 'Centrado', 'Centralizado'],
  'draw.swimlane.vertical': ['垂直泳道', 'Vertical lanes', 'Carriles verticales', 'Raias verticais'],
  'draw.swimlane.horizontal': ['水平泳道', 'Horizontal lanes', 'Carriles horizontales', 'Raias horizontais'],
  'draw.code.language': ['代码语言', 'Code language', 'Lenguaje de código', 'Linguagem de código'],
  'draw.code.theme': ['主题', 'Theme', 'Tema', 'Tema'],
  'draw.code.copy': ['复制代码', 'Copy code', 'Copiar código', 'Copiar código'],

  'draw.ctx.pageSetup': ['页面设置', 'Page setup', 'Configuración de página', 'Configuração da página'],
  'draw.ctx.front': ['置顶', 'To front', 'Al frente', 'Para frente'],
  'draw.ctx.back': ['置底', 'To back', 'Al fondo', 'Para trás'],
  'draw.ctx.editText': ['编辑文本', 'Edit text', 'Editar texto', 'Editar texto'],
  'draw.ctx.editConnectorText': ['编辑连线文本', 'Edit connector text', 'Editar texto del conector', 'Editar texto do conector'],
  'draw.ctx.resetRoute': ['重置自动路由', 'Reset auto routing', 'Restablecer enrutado automático', 'Redefinir roteamento automático'],

  'draw.hotkey.title': ['快捷键列表', 'Keyboard shortcuts', 'Atajos de teclado', 'Atalhos de teclado'],
  'draw.hotkey.text': ['文字', 'Text', 'Texto', 'Texto'],
  'draw.hotkey.layers': ['层级', 'Layers', 'Capas', 'Camadas'],
  'draw.hotkey.tools': ['工具', 'Tools', 'Herramientas', 'Ferramentas'],
  'draw.hotkey.cutCopyPaste': ['剪切 / 复制 / 粘贴', 'Cut / Copy / Paste', 'Cortar / Copiar / Pegar', 'Recortar / Copiar / Colar'],
  'draw.hotkey.duplicate': ['复制副本', 'Duplicate', 'Duplicar', 'Duplicar'],
  'draw.hotkey.boldItalicUnderline': [
    '加粗 / 斜体 / 下划线',
    'Bold / Italic / Underline',
    'Negrita / Cursiva / Subrayado',
    'Negrito / Itálico / Sublinhado',
  ],
  'draw.hotkey.frontBack': ['置于顶层 / 底层', 'Bring to front / send to back', 'Traer al frente / enviar al fondo', 'Trazer para frente / enviar para trás'],
  'draw.hotkey.stepLayers': ['上移 / 下移一层', 'Move up / down a layer', 'Traer adelante / enviar atrás', 'Avançar / voltar'],
  'draw.hotkey.lockUnlock': ['锁定 / 解锁', 'Lock / unlock', 'Bloquear / desbloquear', 'Bloquear / desbloquear'],
  'draw.hotkey.groupUngroup': ['组合 / 取消组合', 'Group / ungroup', 'Agrupar / desagrupar', 'Agrupar / desagrupar'],
  'draw.hotkey.textTool': ['文本工具', 'Text tool', 'Herramienta de texto', 'Ferramenta de texto'],
  'draw.hotkey.panSpace': [
    '空格平移（松开进文字编辑）',
    'Hold Space to pan (release to edit text)',
    'Mantén Espacio para desplazar (suelta para editar el texto)',
    'Segure Espaço para mover (solte para editar o texto)',
  ],
  'draw.hotkey.zoomInOut': ['放大 / 缩小', 'Zoom in / out', 'Acercar / alejar', 'Ampliar / reduzir'],

  'draw.prop.section.metrics': ['度量', 'Metrics', 'Medidas', 'Medidas'],
  'draw.prop.section.page': ['页面设置', 'Page settings', 'Configuración de página', 'Configuração da página'],
  'draw.prop.section.fill': ['填充', 'Fill', 'Relleno', 'Preenchimento'],
  'draw.prop.section.line': ['线条', 'Line', 'Línea', 'Linha'],
  'draw.prop.section.shadow': ['阴影', 'Shadow', 'Sombra', 'Sombra'],
  'draw.prop.section.text': ['文本', 'Text', 'Texto', 'Texto'],
  'draw.prop.x': ['X', 'X', 'X', 'X'],
  'draw.prop.y': ['Y', 'Y', 'Y', 'Y'],
  'draw.prop.width': ['宽', 'Width', 'Ancho', 'Largura'],
  'draw.prop.widthLong': ['宽度', 'Width', 'Ancho', 'Largura'],
  'draw.prop.height': ['高', 'Height', 'Alto', 'Altura'],
  'draw.prop.heightLong': ['高度', 'Height', 'Alto', 'Altura'],
  'draw.prop.angle': ['角度', 'Angle', 'Ángulo', 'Ângulo'],
  'draw.prop.background': ['背景色', 'Background', 'Color de fondo', 'Cor de fundo'],
  'draw.prop.grid': ['网格', 'Grid', 'Cuadrícula', 'Grade'],
  'draw.prop.showGrid': ['显示网格', 'Show grid', 'Mostrar cuadrícula', 'Mostrar grade'],
  'draw.prop.gridSize': ['网格大小', 'Grid size', 'Tamaño de cuadrícula', 'Tamanho da grade'],
  'draw.prop.sizeSmall': ['小', 'Small', 'Pequeño', 'Pequeno'],
  'draw.prop.sizeNormal': ['正常', 'Normal', 'Normal', 'Normal'],
  'draw.prop.sizeBig': ['大', 'Large', 'Grande', 'Grande'],
  'draw.prop.sizeHuge': ['很大', 'Extra large', 'Muy grande', 'Muito grande'],
  'draw.prop.type': ['类型', 'Type', 'Tipo', 'Tipo'],
  'draw.prop.none': ['无', 'None', 'Ninguno', 'Nenhum'],
  'draw.prop.solid': ['纯色', 'Solid', 'Sólido', 'Sólido'],
  'draw.prop.color': ['颜色', 'Color', 'Color', 'Cor'],
  'draw.prop.opacity': ['透明度', 'Opacity', 'Opacidad', 'Opacidade'],
  'draw.prop.thickness': ['粗细', 'Thickness', 'Grosor', 'Espessura'],
  'draw.prop.style': ['样式', 'Style', 'Estilo', 'Estilo'],
  'draw.prop.umlRelation': ['UML 关系', 'UML relation', 'Relación UML', 'Relação UML'],
  'draw.prop.messageType': ['消息类型', 'Message type', 'Tipo de mensaje', 'Tipo de mensagem'],
  'draw.prop.custom': ['自定义', 'Custom', 'Personalizado', 'Personalizado'],
  'draw.prop.lineType': ['线型', 'Line type', 'Tipo de línea', 'Tipo de linha'],
  'draw.prop.beginArrow': ['起箭头', 'Start arrow', 'Flecha inicial', 'Seta inicial'],
  'draw.prop.endArrow': ['止箭头', 'End arrow', 'Flecha final', 'Seta final'],
  'draw.prop.enabled': ['启用', 'Enable', 'Activar', 'Ativar'],
  'draw.prop.blur': ['模糊', 'Blur', 'Desenfoque', 'Desfoque'],
  // es 用缩写：完整词 Desplazamiento 比 80px 标签列更宽，会被裁掉
  'draw.prop.xOffset': ['X 偏移', 'X offset', 'Desplaz. X', 'Deslocamento X'],
  'draw.prop.yOffset': ['Y 偏移', 'Y offset', 'Desplaz. Y', 'Deslocamento Y'],
  'draw.prop.fontFamily': ['字体', 'Font', 'Fuente', 'Fonte'],
  'draw.prop.direction': ['方向', 'Direction', 'Dirección', 'Direção'],
  'draw.prop.horizontalText': ['横', 'Horizontal', 'Horizontal', 'Horizontal'],
  'draw.prop.verticalText': ['竖', 'Vertical', 'Vertical', 'Vertical'],
  'draw.prop.fontSize': ['字号', 'Font size', 'Tamaño de fuente', 'Tamanho da fonte'],
  'draw.prop.alignH': ['水平', 'Horizontal', 'Horizontal', 'Horizontal'],
  'draw.prop.alignV': ['垂直', 'Vertical', 'Vertical', 'Vertical'],
  'draw.prop.alignLeft': ['左', 'Left', 'Izquierda', 'Esquerda'],
  'draw.prop.alignCenter': ['中', 'Center', 'Centro', 'Centro'],
  'draw.prop.alignRight': ['右', 'Right', 'Derecha', 'Direita'],
  'draw.prop.alignTop': ['顶', 'Top', 'Arriba', 'Superior'],
  'draw.prop.alignMiddle': ['中', 'Middle', 'Medio', 'Centro'],
  'draw.prop.alignBottom': ['底', 'Bottom', 'Abajo', 'Inferior'],

  // UML 关系 / 时序消息预设（连线属性面板下拉）
  'draw.link.association': ['关联', 'Association', 'Asociación', 'Associação'],
  'draw.link.directed': ['定向关联', 'Directed association', 'Asociación dirigida', 'Associação dirigida'],
  'draw.link.dependency': ['依赖', 'Dependency', 'Dependencia', 'Dependência'],
  'draw.link.realization': ['实现', 'Realization', 'Realización', 'Realização'],
  'draw.link.generalization': ['泛化', 'Generalization', 'Generalización', 'Generalização'],
  'draw.link.aggregation': ['聚合', 'Aggregation', 'Agregación', 'Agregação'],
  'draw.link.composition': ['组合', 'Composition', 'Composición', 'Composição'],
  'draw.link.sync': ['同步消息', 'Sync message', 'Mensaje síncrono', 'Mensagem síncrona'],
  'draw.link.async': ['异步消息', 'Async message', 'Mensaje asíncrono', 'Mensagem assíncrona'],
  'draw.link.return': ['返回消息', 'Return message', 'Mensaje de retorno', 'Mensagem de retorno'],

  // 非 React 层（AI 服务 / 动作执行器）错误文案
  'draw.err.baseUrlInvalid': [
    'Base URL 格式不正确，请检查设置',
    'Invalid Base URL format. Check your settings',
    'El formato de la URL base no es válido. Revisa la configuración',
    'O formato da URL base é inválido. Verifique as configurações',
  ],
  'draw.err.baseUrlCredentials': [
    'Base URL 不应包含用户名或密码',
    'Base URL must not contain a username or password',
    'La URL base no debe incluir usuario ni contraseña',
    'A URL base não deve conter usuário nem senha',
  ],
  'draw.err.baseUrlHttps': [
    '出于安全考虑，Base URL 必须使用 HTTPS（本机调试可使用 http://localhost）',
    'For security, the Base URL must use HTTPS (http://localhost is allowed for local debugging)',
    'Por seguridad, la URL base debe usar HTTPS (se permite http://localhost para depuración local)',
    'Por segurança, a URL base deve usar HTTPS (http://localhost é permitido para depuração local)',
  ],
  'draw.err.apiUnauthorized': ['API 密钥无效', 'Invalid API key', 'Clave de API no válida', 'Chave de API inválida'],
  'draw.err.apiRatelimit': ['请求太频繁', 'Too many requests', 'Demasiadas solicitudes', 'Muitas solicitações'],
  'draw.err.apiServer': ['服务器错误', 'Server error', 'Error del servidor', 'Erro do servidor'],
  'draw.err.apiNetwork': ['网络连接失败', 'Network connection failed', 'Error de conexión de red', 'Falha na conexión de rede'],
  'draw.err.apiUnknown': ['未知错误: {message}', 'Unknown error: {message}', 'Error desconocido: {message}', 'Erro desconhecido: {message}'],
  'draw.err.invalidOutput': [
    'AI 输出格式错误：无法解析 JSON 或缺少 actions 字段',
    'Bad AI output: could not parse JSON or the actions field is missing',
    'Salida de IA no válida: no se pudo analizar JSON o falta el campo actions',
    'Saída de IA inválida: não foi possível analisar o JSON ou falta o campo actions',
  ],
  'draw.err.linkerEndpointsUnresolved': [
    '连线端点未解析（{missing}）',
    'Connector endpoints unresolved ({missing})',
    'Extremos del conector sin resolver ({missing})',
    'Extremos do conector não resolvidos ({missing})',
  ],

  'draw.page.width': ['宽', 'Width', 'Ancho', 'Largura'],
  'draw.page.height': ['高', 'Height', 'Alto', 'Altura'],
  'draw.page.apply': ['应用', 'Apply', 'Aplicar', 'Aplicar'],

} as const satisfies Record<string, Row>;

const ORDER = ['zh-CN', 'en', 'es', 'pt-BR'] as const;

function build(): OfficeMessagesByLocale {
  const out: OfficeMessagesByLocale = { 'zh-CN': {}, en: {}, es: {}, 'pt-BR': {} };
  for (const [key, values] of Object.entries(ROWS)) {
    ORDER.forEach((locale, index) => {
      out[locale]![key] = values[index];
    });
  }
  return out;
}

const CHROME_MESSAGES = build();

/** AI 面板字典单独文件维护（见 messagesAi.ts），此处合并为单一注册入口 */
export const DRAW_MESSAGES: OfficeMessagesByLocale = Object.fromEntries(
  ORDER.map((locale) => [locale, { ...CHROME_MESSAGES[locale], ...DRAW_AI_MESSAGES[locale] }]),
) as Record<OfficeLocale, OfficeMessagesByLocale[OfficeLocale]>;

registerOfficeMessages(DRAW_MESSAGES);
