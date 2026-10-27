import type { OfficeMessagesByLocale } from '@eflink-tech/office-kit';

/**
 * AI 助手面板专属文案（draw.ai.* 命名空间，避免与 messages.ts 的既有 key 冲突）。
 * 数组顺序固定为 [zh-CN, en, es, pt-BR]，与 messages.ts 完全一致。
 * 注意：本文件不调用 registerOfficeMessages——合并进 DRAW_MESSAGES 的动作
 * 统一在 messages.ts 完成，保持单一注册点与注册顺序可控。
 */
type Row = readonly [string, string, string, string];

const ROWS = {
  'draw.ai.title': ['AI 智能助手', 'AI Assistant', 'Asistente de IA', 'Assistente de IA'],
  'draw.ai.collapse': ['收起', 'Collapse panel', 'Ocultar panel', 'Recolher painel'],

  // 未配置引导
  'draw.ai.notConfiguredTitle': ['尚未配置 AI 服务', 'AI is not set up yet', 'La IA aún no está configurada', 'A IA ainda não está configurada'],
  'draw.ai.notConfiguredHint': [
    '请先前往设置页面配置 API Key 等信息后使用。',
    'Open Settings first and add your API key and other details to start using the assistant.',
    'Abre la configuración y añade tu clave de API y demás datos para empezar.',
    'Abra as configurações e adicione sua chave de API e outros dados para começar.',
  ],

  // 欢迎区（问候语 + 拼接句 + 提示 + 示例指令）
  'draw.ai.greeting.early': ['凌晨好', 'Hello', 'Buenas madrugadas', 'Boa madrugada'],
  'draw.ai.greeting.morning': ['上午好', 'Good morning', 'Buenos días', 'Bom dia'],
  'draw.ai.greeting.noon': ['中午好', 'Good afternoon', 'Buenas tardes', 'Boa tarde'],
  'draw.ai.greeting.afternoon': ['下午好', 'Good afternoon', 'Buenas tardes', 'Boa tarde'],
  'draw.ai.greeting.evening': ['晚上好', 'Good evening', 'Buenas noches', 'Boa noite'],
  'draw.ai.welcome': [
    '{greeting}，今天想用 AI 做点什么呢',
    '{greeting}! What would you like to create with AI today?',
    '¡{greeting}! ¿Qué quieres crear hoy con la IA?',
    '{greeting}! O que você gostaria de criar com a IA hoje?',
  ],
  'draw.ai.welcomeHint': [
    '点击下方提示词，快速生成流程图，或者截图粘贴图片，也可以描述您想要创建的内容',
    'Pick a prompt below to generate a flowchart, paste a screenshot to replicate it, or describe what you want to draw',
    'Elige una indicación de abajo para generar un diagrama de flujo, pega una captura o describe lo que quieres dibujar',
    'Escolha um prompt abaixo para gerar um fluxograma, cole uma captura de tela ou descreva o que você quer desenhar',
  ],
  'draw.ai.examplePrompt1': [
    '工单处理过程的状态流转',
    'State transitions in a ticket handling workflow',
    'Transiciones de estado en el flujo de gestión de tickets',
    'Transições de estado no fluxo de tratamento de chamados',
  ],
  'draw.ai.examplePrompt2': [
    '用户注册并完成邮箱验证的流程',
    'Flow for user sign-up and email verification',
    'Flujo de registro de usuario con verificación de correo',
    'Fluxo de cadastro de usuário com verificação de e-mail',
  ],
  'draw.ai.examplePrompt3': [
    '下单时前端与后端的调用时序',
    'Front-end and back-end call sequence for placing an order',
    'Secuencia de llamadas entre front-end y back-end al hacer un pedido',
    'Sequência de chamadas entre front-end e back-end ao fazer um pedido',
  ],

  // 输入区
  'draw.ai.inputAria': ['消息输入', 'Message input', 'Entrada de mensaje', 'Entrada de mensagem'],
  'draw.ai.inputPlaceholder': [
    '你可以这样提问：用户登录注册流程。',
    'Try asking: user sign-up and login flow.',
    'Prueba con: flujo de registro e inicio de sesión.',
    'Experimente com: fluxo de cadastro e login.',
  ],
  'draw.ai.pendingImageAlt': ['待发送图片 {index}', 'Image to send {index}', 'Imagen por enviar {index}', 'Imagem a enviar {index}'],
  'draw.ai.removeImage': ['移除图片 {index}', 'Remove image {index}', 'Quitar imagen {index}', 'Remover imagem {index}'],
  'draw.ai.filePickerAria': ['图片文件选择', 'Image file picker', 'Selector de archivos de imagen', 'Seletor de arquivos de imagem'],
  'draw.ai.uploadImage': ['图片上传', 'Upload image', 'Subir imagen', 'Enviar imagem'],
  'draw.ai.send': ['发送', 'Send', 'Enviar', 'Enviar'],

  // 动作执行摘要
  'draw.ai.applied': ['已应用：{items}', 'Applied: {items}', 'Aplicado: {items}', 'Aplicado: {items}'],
  'draw.ai.added': ['新增 {count}', '{count} added', '{count} agregadas', '{count} adicionadas'],
  'draw.ai.updated': ['修改 {count}', '{count} updated', '{count} actualizadas', '{count} atualizadas'],
  'draw.ai.deleted': ['删除 {count}', '{count} deleted', '{count} eliminadas', '{count} excluídas'],
  'draw.ai.deletedCascade': [
    '删除 {count}（级联连线 {cascade}）',
    '{count} deleted ({cascade} cascading connectors)',
    '{count} eliminadas ({cascade} conectores en cascada)',
    '{count} excluídas ({cascade} conectores em cascata)',
  ],
  'draw.ai.listSeparator': ['、', ", ", ", ", ", "],
  'draw.ai.skipped': [
    '⚠ {count} 个操作被跳过：',
    '⚠ {count} actions were skipped:',
    '⚠ {count} acciones omitidas:',
    '⚠ {count} ações ignoradas:',
  ],
  'draw.ai.linkerWarning': [
    '⚠ AI 未生成连线动作，图形之间没有连接。可重试或手动连线。',
    '⚠ The AI generated no connectors, so the shapes are not linked. Try again or connect them manually.',
    '⚠ La IA no generó conectores y las formas quedaron sin conectar. Inténtalo de nuevo o conéctalas manualmente.',
    '⚠ A IA não gerou conectores e as formas ficaram sem conexão. Tente novamente ou conecte-as manualmente.',
  ],
  'draw.ai.actionFailed': [
    '⚠ 动作执行失败：{reason}',
    '⚠ Failed to apply the actions: {reason}',
    '⚠ Error al aplicar las acciones: {reason}',
    '⚠ Falha ao aplicar as ações: {reason}',
  ],
  'draw.ai.done': ['已完成', 'Done', 'Listo', 'Concluído'],

  // 服务与错误提示
  'draw.ai.error.unknown': ['未知错误', 'Unknown error', 'Error desconocido', 'Erro desconhecido'],
  'draw.ai.error.fileRead': ['文件读取失败', 'Could not read the file', 'No se pudo leer el archivo', 'Não foi possível ler o arquivo'],
  'draw.ai.error.imageDecode': ['图片加载失败', 'Could not load the image', 'No se pudo cargar la imagen', 'Não foi possível carregar a imagem'],
  'draw.ai.errorPrefix': ['错误：{message}', 'Error: {message}', 'Error: {message}', 'Erro: {message}'],
  'draw.ai.visionHint': [
    '（当前模型可能不支持图片输入，请在 AI 设置中更换视觉模型，如 qwen-vl 系列）',
    ' (The current model may not support image input. Switch to a vision model, such as the qwen-vl series, in AI settings.)',
    ' (Es posible que el modelo actual no admita imágenes. Cambia a un modelo visual, como la serie qwen-vl, en la configuración de IA.)',
    ' (O modelo atual talvez não aceite imagens. Troque por um modelo visual, como a série qwen-vl, nas configurações de IA.)',
  ],
  'draw.ai.serviceTimeout': [
    'AI 服务初始化超时，请检查设置后重试',
    'AI service took too long to initialize. Check your settings and try again.',
    'El servicio de IA tardó demasiado en iniciarse. Revisa la configuración e inténtalo de nuevo.',
    'O serviço de IA demorou para ser inicializado. Verifique as configurações e tente novamente.',
  ],
  'draw.ai.serviceNotReady': [
    'AI 服务尚未就绪，请确认已在设置中正确配置',
    'The AI service is not ready yet. Make sure it is configured correctly in Settings.',
    'El servicio de IA aún no está listo. Verifica que esté bien configurado en Configuración.',
    'O serviço de IA ainda não está pronto. Confirme se ele está configurado corretamente em Configurações.',
  ],
  'draw.ai.imageProcessFailed': [
    '图片处理失败：{reason}',
    'Image processing failed: {reason}',
    'Error al procesar la imagen: {reason}',
    'Falha ao processar a imagem: {reason}',
  ],

  // 历史对话
  'draw.ai.history': ['历史对话', 'Chat history', 'Historial de chats', 'Histórico de conversas'],
  'draw.ai.closeHistory': ['关闭历史', 'Close history', 'Cerrar historial', 'Fechar histórico'],
  'draw.ai.loading': ['加载中...', 'Loading…', 'Cargando…', 'Carregando…'],
  'draw.ai.historyEmpty': ['暂无历史对话', 'No conversations yet', 'Aún no hay conversaciones', 'Nenhuma conversa ainda'],
  'draw.ai.historyLoadFailed': ['读取历史对话失败', 'Could not load chat history', 'No se pudo cargar el historial de chats', 'Não foi possível carregar o histórico de conversas'],
  'draw.ai.untitledConversation': ['未命名对话', 'Untitled chat', 'Chat sin título', 'Conversa sem título'],
  'draw.ai.imageConversationTitle': ['图片对话', 'Image chat', 'Chat de imagen', 'Conversa com imagem'],
  'draw.ai.messageCount': ['{count} 条消息', '{count} messages', '{count} mensajes', '{count} mensagens'],
  'draw.ai.deleteConversationAria': ['删除对话 {title}', 'Delete conversation {title}', 'Eliminar conversación {title}', 'Excluir conversa {title}'],
  'draw.ai.conversationMissing': [
    '该对话不存在或已被删除',
    'This conversation no longer exists',
    'Esta conversación ya no existe o fue eliminada',
    'Esta conversa não existe mais ou foi excluída',
  ],
  'draw.ai.loadConversationFailed': [
    '读取对话失败：{reason}',
    'Could not load the conversation: {reason}',
    'Error al cargar la conversación: {reason}',
    'Falha ao carregar a conversa: {reason}',
  ],

  // 消息气泡
  'draw.ai.reasoning': ['思考过程', 'Thinking process', 'Razonamiento', 'Raciocínio'],
  'draw.ai.thinking': ['思考中', 'Thinking', 'Pensando', 'Pensando'],
  'draw.ai.generating': ['正在生成', 'Generating', 'Generando', 'Gerando'],
  'draw.ai.messageImageAlt': ['消息图片 {index}', 'Message image {index}', 'Imagen del mensaje {index}', 'Imagem da mensagem {index}'],

  // AI 设置页
  'draw.ai.settingsTitle': ['AI 助手设置', 'AI Assistant Settings', 'Configuración del asistente de IA', 'Configurações do assistente de IA'],
  'draw.ai.actionFailedRetry': [
    '操作失败，请重试',
    'Operation failed. Please try again.',
    'La operación falló. Inténtalo de nuevo.',
    'A operação falhou. Tente novamente.',
  ],
  'draw.ai.resetConfirm': [
    '确定要清空已保存的 AI 配置吗？此操作不可恢复。',
    'Clear the saved AI configuration? This cannot be undone.',
    '¿Borrar la configuración de IA guardada? Esta acción no se puede deshacer.',
    'Deseja apagar a configuração de IA salva? Esta ação não pode ser desfeita.',
  ],
  'draw.ai.resetDone': ['已清空配置', 'Configuration cleared', 'Configuración borrada', 'Configuração apagada'],
  'draw.ai.resetFailed': ['清空失败：{reason}', 'Failed to clear: {reason}', 'Error al borrar: {reason}', 'Falha ao apagar: {reason}'],
  'draw.ai.saveFailed': ['保存失败：{reason}', 'Failed to save: {reason}', 'Error al guardar: {reason}', 'Falha ao salvar: {reason}'],
  'draw.ai.savedConnected': [
    '已保存，连接正常',
    'Saved. Connection is working.',
    'Guardado. La conexión funciona correctamente.',
    'Salvo. A conexão está funcionando.',
  ],
  'draw.ai.savedPingFailed': [
    '已保存，但连通性检测失败：{error}',
    'Saved, but the connection check failed: {error}',
    'Guardado, pero la prueba de conexión falló: {error}',
    'Salvo, mas o teste de conexão falhou: {error}',
  ],
  'draw.ai.loadSettingsFailed': [
    '读取已保存配置失败：{error}',
    'Could not read the saved configuration: {error}',
    'No se pudo leer la configuración guardada: {error}',
    'Não foi possível ler a configuração salva: {error}',
  ],
  'draw.ai.currentlySaved': ['当前已保存：{masked}', 'Currently saved: {masked}', 'Guardada actualmente: {masked}', 'Salva atualmente: {masked}'],
  'draw.ai.hintLabel': ['提示：', 'Tip:', 'Consejo:', 'Dica:'],
  'draw.ai.multimodalHint': [
    'AI 绘图依赖图片理解能力，请选择支持视觉的多模态模型（如 GPT-4o、Claude 3 Sonnet、Qwen-VL 等）。',
    'AI drawing relies on image understanding, so pick a multimodal model with vision support (such as GPT-4o, Claude 3 Sonnet or Qwen-VL).',
    'El dibujo con IA depende de la comprensión de imágenes, así que elige un modelo multimodal con visión (como GPT-4o, Claude 3 Sonnet o Qwen-VL).',
    'O desenho com IA depende da compreensão de imagens, então escolha um modelo multimodal com visão (como GPT-4o, Claude 3 Sonnet ou Qwen-VL).',
  ],
  'draw.ai.saving': ['保存中...', 'Saving…', 'Guardando…', 'Salvando…'],
  'draw.ai.clearConfig': ['清空配置', 'Clear configuration', 'Borrar configuración', 'Limpar configuração'],
  'draw.ai.clearing': ['清空中...', 'Clearing…', 'Borrando…', 'Limpando…'],

  // AI 快捷指令（模板库）
  'draw.ai.commandTitle': ['AI 快捷指令', 'AI Quick Commands', 'Comandos rápidos de IA', 'Comandos rápidos de IA'],
  'draw.ai.templatesLoading': ['加载模板中...', 'Loading templates…', 'Cargando plantillas…', 'Carregando modelos…'],
  'draw.ai.templateLoadFailed': ['加载模板失败', 'Failed to load templates', 'No se pudieron cargar las plantillas', 'Falha ao carregar os modelos'],
  'draw.ai.loadFailed': ['加载失败: {error}', 'Load failed: {error}', 'Error al cargar: {error}', 'Falha ao carregar: {error}'],
  'draw.ai.templatesEmpty': ['暂无模板', 'No templates available', 'No hay plantillas disponibles', 'Nenhum modelo disponível'],
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

export const DRAW_AI_MESSAGES: OfficeMessagesByLocale = build();
