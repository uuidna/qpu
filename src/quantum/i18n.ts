// Translation without a network and without a model: the surface speaks a small vocabulary — labels, statuses, verdicts,
// headings — and a table per language translates it both ways. A word with no entry stays as it is and is reported as a
// lead, never guessed. Free text inside entries is not translated. Any language or dialect is one more table.

export const LOCALES: Record<string, { name: string; native: string; filled: boolean }> = {
  en: { name: 'English', native: 'English', filled: true },
  bg: { name: 'Bulgarian', native: 'Български', filled: true },
  de: { name: 'German', native: 'Deutsch', filled: false }, fr: { name: 'French', native: 'Français', filled: false }, es: { name: 'Spanish', native: 'Español', filled: false },
  it: { name: 'Italian', native: 'Italiano', filled: false }, ru: { name: 'Russian', native: 'Русский', filled: false }, zh: { name: 'Chinese', native: '中文', filled: false },
  ja: { name: 'Japanese', native: '日本語', filled: false }, pt: { name: 'Portuguese', native: 'Português', filled: false }, nl: { name: 'Dutch', native: 'Nederlands', filled: false },
}

/** English → Bulgarian for every term the surface emits. The inverse is derived, so the table reads both ways. */
const BG: Record<string, string> = {
  tool: 'инструмент', tools: 'инструменти', example: 'пример', examples: 'примери', lead: 'следа', leads: 'следи', verifier: 'проверител', verifiers: 'проверители',
  block: 'блок', receipt: 'разписка', receipts: 'разписки', previous: 'предишен', next: 'следващ', program: 'програма', handle: 'дръжка', tail: 'опашка',
  seal: 'печат', valid: 'валиден', invalid: 'невалиден', served: 'обслужена', partial: 'частична', blocked: 'блокирана', open: 'отворена', 'out of scope': 'извън обхват',
  impossible: 'невъзможно', unknown: 'неизвестно', verdict: 'присъда', evidence: 'доказателство', docket: 'досие', entry: 'запис', entries: 'записи', mirror: 'огледало',
  mirrors: 'огледала', fragment: 'фрагмент', fragments: 'фрагменти', parity: 'паритет', licence: 'лиценз', license: 'лиценз', author: 'автор', family: 'семейство',
  door: 'врата', doors: 'врати', address: 'адрес', content: 'съдържание', chain: 'верига', step: 'стъпка', steps: 'стъпки', statement: 'твърдение', reason: 'причина',
  'translate later': 'превод по-късно', decided: 'решено', walk: 'обход', page: 'страница', arguments: 'аргументи', nibble: 'полубайт', message: 'съобщение',
  executed: 'изпълнено', loading: 'зареждане', none: 'няма', version: 'версия', variant: 'вариант', hue: 'нюанс', here: 'тук', chooses: 'избира', the: '', of: 'на',
  'commercial use by licence': 'търговска употреба по лиценз', 'caught': 'уловено', 'this path is not a walk': 'този път не е обход', 'by the match tool': 'от инструмента за съвпадение',
}
const TABLES: Record<string, Record<string, string>> = { bg: BG }
const inverted = (t: Record<string, string>): Record<string, string> => Object.fromEntries(Object.entries(t).filter(([, v]) => v).map(([k, v]) => [v, k]))

/** Translate text between two locales by vocabulary, longest phrase first, case-aware; report every word no table knows. */
export const translateOf = (text: string, from: string, to: string): { text: string; untranslated: string[]; via: string } => {
  if (from === to) return { text, untranslated: [], via: 'identity' }
  const table = from === 'en' ? TABLES[to] : to === 'en' ? (TABLES[from] ? inverted(TABLES[from]!) : undefined) : undefined
  if (!table) {
    const words = [...new Set(text.toLowerCase().match(/[\p{L}]+/gu) ?? [])]
    return { text, untranslated: words, via: `no table for ${from}→${to}: a lead; served as is` }
  }
  const phrases = Object.keys(table).sort((a, b) => b.length - a.length)
  let out = text
  const hit = new Set<string>()
  for (const ph of phrases) {
    const re = new RegExp(`(?<![\\p{L}])${ph.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}])`, 'giu')
    out = out.replace(re, (m) => { hit.add(ph); const v = table[ph]!; return m[0] === m[0]!.toUpperCase() && v ? v[0]!.toUpperCase() + v.slice(1) : v })
  }
  const known = new Set(Object.keys(table).flatMap((k) => k.split(' ')).concat(Object.values(table).flatMap((v) => v.split(' '))))
  const untranslated = [...new Set((out.match(/[\p{L}]+/gu) ?? []).map((w) => w.toLowerCase()))].filter((w) => !known.has(w) && !/^[0-9a-f]{8,}$/.test(w))
  return { text: out.replace(/\s{2,}/g, ' ').trim(), untranslated, via: `vocabulary ${from}→${to}, ${hit.size} phrase(s)` }
}
