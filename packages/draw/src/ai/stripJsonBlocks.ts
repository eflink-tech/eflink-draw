// src/ai/stripJsonBlocks.ts

/**
 * 剥离消息中的 JSON 代码块与裸 JSON 数据（```json ... ``` 或无围栏的 {...} / [...]）。
 * AI 模型常在 message 里附带完整的 actions JSON，用户不需要看到这些原始数据。
 *
 * 处理策略（三层递进）：
 * 1. 移除完整的 ```[json] ... ``` 围栏代码块
 * 2. 移除末尾未闭合的 ``` 围栏（流式传输中间态）
 * 3. 裸 JSON 数据整体清空：以 { 或 [ 开头的内容无论闭合与否都视为图形数据
 *    （流式期间 JSON 逐字到达，若等闭合才清空，用户会看到 JSON 打字机式滚出）
 */
export function stripJsonBlocks(text: string): string {
  // Step 1: 移除完整的围栏代码块（包括 ```json / ``` / ```txt 等任意语言标记）
  let cleaned = text.replace(/```[a-zA-Z]*\s*\n[\s\S]*?\n\s*```/g, '')
  // 也匹配无换行的紧凑写法 ```...```
  cleaned = cleaned.replace(/```[a-zA-Z]*[\s\S]*?```/g, '')

  // Step 2: 移除末尾未闭合的围栏（流式传输期间 ````json\n{...` 还没收到结尾 ```）
  cleaned = cleaned.replace(/```[a-zA-Z]*\s*\n[\s\S]*$/g, '')
  cleaned = cleaned.replace(/```[a-zA-Z]*[\s\S]*$/g, (match) => {
    // 仅当 match 以 ``` 开头且包含类似 JSON 内容时才移除
    return match.includes('{') || match.includes('[') ? '' : match
  })

  // Step 3: 裸 JSON 整体清空。正常中文回复不会以 { 或 [ 开头；
  // 流式中间态（未闭合）与完整 JSON 都在此拦截，避免原始数据滚给用户
  const trimmed = cleaned.trim()
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return ''
  }

  return cleaned.trim()
}
