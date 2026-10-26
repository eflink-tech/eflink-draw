import type { OfficeLocale } from '@eflink-tech/office-kit';
import { SHAPE_TITLE_I18N, type TitleTriple } from './shapeTitles';
import { CONTENT_TITLE_I18N } from './contentTitles';
import { getDrawLocale } from './runtime';

export { DRAW_MESSAGES } from './messages';
export { setDrawLocale, getDrawLocale, drawT, displayDocTitle } from './runtime';
export { SHAPE_TITLE_I18N } from './shapeTitles';
export { CONTENT_TITLE_I18N } from './contentTitles';

const TITLE_INDEX: Record<string, TitleTriple> = { ...SHAPE_TITLE_I18N, ...CONTENT_TITLE_I18N };
const COLUMN: Partial<Record<OfficeLocale, number>> = { en: 0, es: 1, 'pt-BR': 2 };
const HAS_CJK = /[一-鿿]/;

/**
 * 素材标题本地化：图形库、分类、模板名与模板节点文案共用一张「中文原文 → 三语」表。
 * 未收录的中文原样返回（新增中文标题只需补表，不必改调用方）。
 */
export function translateTitle(title: string, locale: OfficeLocale = getDrawLocale()): string {
  const column = COLUMN[locale];
  if (column === undefined || !HAS_CJK.test(title)) return title;
  return TITLE_INDEX[title]?.[column] ?? title;
}

/** React 侧使用：随 locale 变化重新取表 */
export function makeTitleTranslator(locale: OfficeLocale) {
  return (title: string) => translateTitle(title, locale);
}
