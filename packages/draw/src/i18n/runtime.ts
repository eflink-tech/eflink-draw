import { COMMON_MESSAGES, normalizeLocale, type OfficeLocale, type OfficeMessages } from '@eflink-tech/office-kit';
import { DEFAULT_PAGE_TITLE } from '@/types'
import { DRAW_MESSAGES } from './messages';

let currentLocale: OfficeLocale = normalizeLocale();

export function setDrawLocale(locale: string | null | undefined): OfficeLocale {
  currentLocale = normalizeLocale(locale);
  return currentLocale;
}

export function getDrawLocale(): OfficeLocale {
  return currentLocale;
}

/** 与 I18nProvider 同源：共用文案打底，编辑器文案按 key 覆盖 */
const MERGED: Partial<Record<OfficeLocale, OfficeMessages>> = {};
function dictFor(locale: OfficeLocale): OfficeMessages {
  MERGED[locale] ??= { ...COMMON_MESSAGES[locale], ...DRAW_MESSAGES[locale] };
  return MERGED[locale]!;
}

/** 非 React 模块（store / AI / 画布操作）使用的翻译入口，缺省回退 zh-CN */
export function drawT(key: string, vars?: Record<string, string | number>): string {
  const template = dictFor(currentLocale)[key] ?? dictFor('zh-CN')[key] ?? key;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  );
}

/** 文档标题展示：未改名的默认标题按 locale 走 draw.untitled，其余保留用户命名 */
export function displayDocTitle(
  title: string | null | undefined,
  translate: (key: string) => string,
): string {
  return !title || title === DEFAULT_PAGE_TITLE ? translate('draw.untitled') : title
}
