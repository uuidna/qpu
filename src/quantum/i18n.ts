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
  factor: 'разложи', with: 'с', qubits: 'кубита', 'how many': 'колко', have: 'има', numeral: 'числител', numerals: 'числители',
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
export const TABLES: Record<string, Record<string, string>> = { bg: BG }
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

/** The Glagolitic numerals, additive like the Cyrillic system: each letter carries the value of its alphabetic place, units,
 * tens and hundreds, then Ⱍ for 1000 (en.wikipedia.org/wiki/Glagolitic_numerals). Values above 1000 are not in this table:
 * a lead, never guessed. */
export const GLAGOLITIC: Readonly<Record<string, number>> = {
  'Ⰰ': 1, 'Ⰱ': 2, 'Ⰲ': 3, 'Ⰳ': 4, 'Ⰴ': 5, 'Ⰵ': 6, 'Ⰶ': 7, 'Ⰷ': 8, 'Ⰸ': 9,
  'Ⰺ': 10, 'Ⰻ': 20, 'Ⰼ': 30, 'Ⰽ': 40, 'Ⰾ': 50, 'Ⰿ': 60, 'Ⱀ': 70, 'Ⱁ': 80, 'Ⱂ': 90,
  'Ⱃ': 100, 'Ⱄ': 200, 'Ⱅ': 300, 'Ⱆ': 400, 'Ⱇ': 500, 'Ⱈ': 600, 'Ⱉ': 700, 'Ⱋ': 800, 'Ⱌ': 900,
  'Ⱍ': 1000,
}
// Glagolitic has a lower case (U+2C30..) with the same values; the table is written in capitals and read in both.
const GLAGOLITIC_RUN = new RegExp(`[${Object.keys(GLAGOLITIC).map((g) => g + g.toLowerCase()).join('')}]+`, 'gu')
/** An integer 1..1999 written in Glagolitic numerals, largest letter first; null beyond the table. */
export const glagoliticOf = (n: number): string | null => {
  if (!Number.isInteger(n) || n < 1 || n > 1999) return null
  const letters = Object.entries(GLAGOLITIC).sort((a, b) => b[1] - a[1])
  let rest = n, out = ''
  for (const [glyph, value] of letters) while (rest >= value) { out += glyph; rest -= value }
  return rest === 0 ? out : null
}
/** Every run of Glagolitic letters in a text read as one additive numeral and written as digits; the runs are reported. */
export const numeralsOf = (text: string): { text: string; numerals: { glyphs: string; value: number }[] } => {
  const numerals: { glyphs: string; value: number }[] = []
  const out = text.replace(GLAGOLITIC_RUN, (glyphs) => { const value = [...glyphs].reduce((n, g) => n + GLAGOLITIC[g.toUpperCase()]!, 0); numerals.push({ glyphs, value }); return String(value) })
  return { text: out, numerals }
}
/** A hex spoken in Glagolitic numerals: each digit the numeral of its own value written by glagoliticOf (0 silent, 1 to 9 the units Ⰰ to Ⰸ,
 *  10 Ⰺ, 11 to 15 Ⰺ and a unit, additive as the system adds), every position kept so a silent zero still has its place, then read back through
 *  the same table to the digits it came from; the dialect is how often each letter speaks across the hex. The table decides both ways. */
export const speakHexOf = (hex: string) => {
  const clean = hex.toLowerCase().replace(/[^0-9a-f]/g, '')
  const letters = [...clean].map((digit, at) => { const value = parseInt(digit, 16); return { at, digit, value, spoken: value === 0 ? '' : glagoliticOf(value)! } })
  const read = letters.map((l) => [...l.spoken].reduce((n, g) => n + GLAGOLITIC[g]!, 0).toString(16)).join('')
  const dialect: Record<string, number> = {}
  for (const l of letters) for (const g of l.spoken) dialect[g] = (dialect[g] ?? 0) + 1
  const silent = letters.filter((l) => l.spoken === '').length
  return { hex: clean, letters, spoken: letters.map((l) => l.spoken || '·').join(' '), read, roundTrip: read === clean, dialect, silent, says: `${clean.length} digit(s) spoken in Glagolitic numerals, ${silent} silent; read back through the same table ${read === clean ? 'to the same hex' : 'to a different hex'}`, theorem: 'textbook_glagolitic_round_trip' }
}
