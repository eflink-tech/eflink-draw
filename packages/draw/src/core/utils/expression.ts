/**
 * 表达式解析器
 * 支持数字直接返回，或计算包含 w/h 变量的简单算术表达式
 * 例如: "w/2", "h*0.5", "w-20", "Math.min(w,h)*0.5"
 *
 * 编译缓存：同一表达式字符串只编译一次（w/h 作为函数参数传入），
 * 拖拽期间每帧会重复求值，缓存后不再有 new Function 编译开销。
 */

/** 表达式字符串 → 编译后的求值函数（w/h 为参数） */
const compileCache = new Map<string, ((w: number, h: number) => number) | null>()

/**
 * 编译表达式。
 * 语法错误（构造抛异常）或任何尺寸都返回非数字 → 缓存 null，避免反复编译；
 * 探针点 (1,1) 处 NaN/Infinity 视为尺寸相关合法表达式（如 w/(w-h)），照常缓存，
 * 求值处对 NaN 已有返回 0 的兜底。
 */
function compile(expr: string): ((w: number, h: number) => number) | null {
  if (compileCache.has(expr)) return compileCache.get(expr) ?? null
  try {
    const fn = new Function('w', 'h', `return (${expr})`) as (w: number, h: number) => number
    if (typeof fn(1, 1) !== 'number') {
      compileCache.set(expr, null)
      return null
    }
    compileCache.set(expr, fn)
    return fn
  } catch {
    compileCache.set(expr, null)
    return null
  }
}

export function evaluateExpression(
  expr: number | string,
  context: { w: number; h: number },
): number {
  if (typeof expr === 'number') return expr

  const trimmed = expr.trim()
  if (trimmed === '') return 0

  const fn = compile(trimmed)
  if (!fn) return 0
  const result = fn(context.w, context.h)
  return typeof result === 'number' && isFinite(result) ? result : 0
}

/**
 * 批量解析路径动作中的坐标（别名）
 */
export function evaluateDimension(
  dim: number | string,
  context: { w: number; h: number },
): number {
  return evaluateExpression(dim, context)
}
