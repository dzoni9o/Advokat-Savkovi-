import sr from '../content/sr.json';
import cir from '../content/cir.json';
import en from '../content/en.json';

export const LOCALES = ['sr', 'cir', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

/** Label shown in the language switcher for each locale. */
export const LOCALE_LABELS: Record<Locale, string> = {
  sr: 'SR',
  cir: 'ЋИР',
  en: 'EN',
};

/** `hreflang` value for each locale. */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  sr: 'sr-Latn-RS',
  cir: 'sr-Cyrl-RS',
  en: 'en',
};

const CONTENT = { sr, cir, en } as const;

export function getContent(locale: Locale) {
  return CONTENT[locale];
}

/**
 * A content value is "unfilled" while it still carries the TODO marker.
 *
 * The site is being built for a real, named lawyer before his actual
 * registry details are in hand. Anything unverified therefore has to be
 * impossible to ship as if it were fact: unfilled values never render as
 * text, they render as a visibly empty field (see `.todo` in global.css).
 */
export function isTodo(value: unknown): value is string {
  return typeof value === 'string' && value.trimStart().startsWith('TODO:');
}

/** The hint after the marker, e.g. "TODO: broj upisa" -> "broj upisa". */
export function todoHint(value: string): string {
  return value.trimStart().slice('TODO:'.length).trim() || '—';
}

/** True when every string in the tree is filled in. */
export function isComplete(node: unknown): boolean {
  if (isTodo(node)) return false;
  if (Array.isArray(node)) return node.every(isComplete);
  if (node && typeof node === 'object') {
    return Object.entries(node as Record<string, unknown>)
      .filter(([key]) => !key.startsWith('_'))
      .every(([, val]) => isComplete(val));
  }
  return true;
}

/** Count of unfilled fields, used by the build-time reminder. */
export function countTodos(node: unknown): number {
  if (isTodo(node)) return 1;
  if (Array.isArray(node)) return node.reduce<number>((n, v) => n + countTodos(v), 0);
  if (node && typeof node === 'object') {
    return Object.entries(node as Record<string, unknown>)
      .filter(([key]) => !key.startsWith('_'))
      .reduce((n, [, val]) => n + countTodos(val), 0);
  }
  return 0;
}
