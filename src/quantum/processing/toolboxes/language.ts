// The language toolbox: translation by vocabulary, offline, in both directions, with every word no table knows reported as a
// lead; the vocabulary measured against every term the surface emits, so the tables are updated from measurement; and
// programmable prose: a tool's result and its toolbox's skill rendered as sentences in any locale, backed by the toolset
// (the numbers are the tool's) and the skillset (the words are the vocabulary's). Pure.
import { TABLES as PAYLOAD_TABLES } from '../tables-index.ts'
import { defineTool, createChecks, listTools, type Toolbox, type Context } from '../toolbox.ts'
import { LOCALES, TABLES, translateOf, listNumerals } from '../i18n.ts'
import { flowWidget } from '../widgets.ts'

/** Every term the surface emits as a label a reader sees: statuses, verdicts, classes, phases and the headings of its pages. */
const SURFACE_TERMS = PAYLOAD_TABLES.SURFACE_TERMS as unknown as readonly string[]

const splitWords = (key: string): string => key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').toLowerCase()

/** The vocabulary measured: for every filled locale, which surface terms have no entry. */
const getLocaleCoverage = (): { locale: string; filled: boolean; terms: number; missing: string[] }[] => Object.entries(LOCALES).filter(([code]) => code !== 'en').map(([code, l]) => {
  const table = TABLES[code]
  const missing = table ? SURFACE_TERMS.filter((t) => !(t in table)) : [...SURFACE_TERMS]
  return { locale: code, filled: l.filled && !!table, terms: table ? Object.keys(table).length : 0, missing }
})

/** Sentences from a tool's result: its scalar fields as "label value", in the locale's words; the numbers are the tool's. */
const writeProse = (toolbox: { name: string; idea: string; instructions: string } | null, tool: string, structured: unknown, locale: string): { text: string; sentences: string[]; untranslated: string[] } => {
  const t = (s: string) => translateOf(s, 'en', locale)
  const sentences: string[] = []
  const untranslated = new Set<string>()
  const say = (s: string) => { const r = t(s); sentences.push(r.text); for (const w of r.untranslated) untranslated.add(w) }
  if (toolbox) say(`the ${toolbox.name} toolbox: ${toolbox.idea}.`)
  const fields = structured && typeof structured === 'object' ? Object.entries(structured as Record<string, unknown>).filter(([, v]) => typeof v === 'number' || typeof v === 'boolean' || (typeof v === 'string' && v.length <= 80 && !v.includes('\n'))) : []
  if (fields.length) say(`the ${tool} tool answered: ${fields.map(([k, v]) => `${splitWords(k)} ${typeof v === 'boolean' ? (v ? 'yes' : 'no') : String(v)}`).join(', ')}.`)
  else say(`the ${tool} tool answered with no scalar fields.`)
  if (toolbox) say(`how to use it: ${toolbox.instructions}`)
  return { text: sentences.join(' '), sentences, untranslated: [...untranslated].filter((w) => !/^\d/.test(w)) }
}

const translate = defineTool('language', {
  name: 'translate',
  description: 'Translation by vocabulary, offline, both ways: text, from, to. A word no table knows stays as it is and is reported, never guessed; Glagolitic numerals are read as integers. Without text: the vocabulary measured — for every locale, the surface terms with no entry (the leads of the tables).',
  inputSchema: { type: 'object', properties: { text: { type: 'string' }, from: { type: 'string', enum: Object.keys(LOCALES) }, to: { type: 'string', enum: Object.keys(LOCALES) }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...LANGUAGE.skill.selftest(ctx) }
    if (typeof args.text !== 'string') { const coverage = getLocaleCoverage(); return { phase: 'coverage' as const, terms: SURFACE_TERMS.length, locales: coverage.length, filled: coverage.filter((c) => c.filled).length, missingTotal: coverage.reduce((n, c) => n + c.missing.length, 0), coverage } }
    const from = typeof args.from === 'string' ? args.from : 'en'; const to = typeof args.to === 'string' ? args.to : 'bg'
    const num = listNumerals(args.text)
    const r = translateOf(num.text, from, to)
    return { phase: 'translated' as const, from, to, text: r.text, via: r.via, untranslated: r.untranslated.length, untranslatedWords: r.untranslated, numerals: num.numerals }
  },
  widget: flowWidget,
})

const prose = defineTool('language', {
  name: 'prose',
  description: 'Programmable prose: call a tool with its arguments and render its result as sentences in a locale — the toolbox\'s idea, the tool\'s scalar answers, the toolbox\'s instructions — every word from the vocabulary, every number from the tool, every unknown word reported.',
  inputSchema: { type: 'object', required: ['tool'], properties: { tool: { type: 'string' }, arguments: { type: 'object' }, locale: { type: 'string', enum: Object.keys(LOCALES) }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...LANGUAGE.skill.selftest(ctx) }
    const tool = String(args.tool); const locale = typeof args.locale === 'string' ? args.locale : 'en'
    const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool, arguments: args.arguments ?? {} } })
    if ('error' in r) throw new Error(r.error.message)
    const boxName = listTools(ctx).find((t) => t.name === tool)?._meta?.toolbox ?? null
    const init = ctx.handle({ jsonrpc: '2.0', id: 0, method: 'initialize' }) as { result: { instructions: string } }
    const line = boxName ? init.result.instructions.split('\n').find((l) => l.startsWith(`${boxName} (`)) : undefined
    const box = boxName && line ? { name: boxName, idea: line.slice(line.indexOf('): ') + 3, line.indexOf('. ') + 1).replace(/\.$/, ''), instructions: line.slice(line.indexOf('. ') + 2) } : null
    const p = writeProse(box, tool, r.result.structuredContent, locale)
    return { tool, toolbox: boxName ?? 'none', locale, sentences: p.sentences.length, untranslated: p.untranslated.length, text: p.text, untranslatedWords: p.untranslated, sentenceList: p.sentences }
  },
  widget: flowWidget,
})

export const LANGUAGE: Toolbox = {
  name: 'language',
  idea: 'any language and dialect, offline and token-free: translation by vocabulary both ways, the vocabulary measured against every term the surface emits, and prose programmed from a tool\'s result and its toolbox\'s skill',
  tools: [translate, prose],
  examples: [
    { id: 'translate-bg', tool: 'translate', arguments: { text: 'The lead is served; the verdict is unknown', from: 'en', to: 'bg' }, shows: 'English to Bulgarian by vocabulary: the labels and verdicts translate; a word with no entry stays and is reported.', expect: (s) => (s.phase === 'translated' && /следата|следа/.test(s.text) && /обслужена/.test(s.text) && /неизвестно/.test(s.text) ? null : `${s.text} (${s.untranslatedWords})`) },
    { id: 'translate-coverage', tool: 'translate', arguments: {}, shows: 'The vocabulary measured: for every locale, which surface terms have no entry — the leads of the tables, updated from measurement.', expect: (s) => (s.phase === 'coverage' && s.terms === SURFACE_TERMS.length && s.coverage.find((c: { locale: string }) => c.locale === 'bg')?.filled === true ? null : `${s.phase}: ${s.terms} terms, ${s.filled} filled`) },
    { id: 'prose-clay-bg', theorem: 'relation_15', tool: 'prose', arguments: { tool: 'clay', arguments: { name: 'relation_15' }, locale: 'bg' }, shows: 'Programmable prose in Bulgarian from the clay tool\'s answer and the tree toolbox\'s skill: the numbers are the tool\'s, the words the vocabulary\'s, the rest reported.', expect: (s) => (s.tool === 'clay' && s.toolbox === 'tree' && s.locale === 'bg' && s.sentences === 3 && /инструмент/.test(s.text) && /33/.test(s.text) ? null : `${s.toolbox}/${s.sentences}: ${s.text.slice(0, 120)}`) },
  ],
  skill: {
    instructions: 'translate takes text, from and to and answers by vocabulary; call it without text to measure the tables and get the missing terms per locale, which are the leads to fill (from the unit\'s vocabulary door where discovery finds one, or by a person). prose takes a tool, its arguments and a locale and renders the answer as sentences; feed its untranslated words back as vocabulary leads.',
    directions: ['server only: every table reads both ways (en→locale→en returns the term)', 'toolbox → toolbox: prose renders the tree and flow toolboxes\' answers; numerals read by the match toolbox\'s reader', 'client → server: the coverage phase hands the client the missing terms to fill'],
    selftest: (ctx: Context) => {
      const { check, done } = createChecks()
      for (const [code, table] of Object.entries(TABLES)) {
        // a term returns if the inverse gives it or a synonym that shares its translation; an empty translation (no article in the locale) has no inverse
        const synonyms = (term: string) => Object.keys(table).filter((k) => table[k] === table[term]).map((k) => k.toLowerCase())
        const broken = Object.keys(table).filter((term) => table[term] !== '' && !synonyms(term).includes(translateOf(translateOf(term, 'en', code).text, code, 'en').text.toLowerCase()))
        check(`language:round-trip:${code}`, broken.length === 0, broken.length ? `${broken.length} term(s) do not return: ${broken.slice(0, 5).join(', ')}` : `${Object.keys(table).length} terms return through ${code}`)
      }
      const cov = getLocaleCoverage().find((c) => c.locale === 'bg')!
      check('language:coverage-measured', cov.terms > 0 && Array.isArray(cov.missing), `bg: ${cov.terms} terms, ${cov.missing.length} surface terms missing${cov.missing.length ? ` (${cov.missing.slice(0, 6).join(', ')})` : ''}`)
      const p = writeProse({ name: 'tree', idea: 'the tree knows itself', instructions: 'call match' }, 'clay', { total: 54, holding: 54, maxBits: 33 }, 'bg')
      check('language:prose-bg', p.sentences.length === 3 && p.text.includes('54') && /инструмент/.test(p.text), p.text.slice(0, 160))
      const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'match', arguments: { statement: 'Разложи Ⰺⰴ с Shor', locale: 'bg' } } })
      check('language:match-in-bg', 'result' in r && r.result.structuredContent.read?.verdictIn === 'обслужена', 'result' in r ? `${r.result.structuredContent.verdict} → ${r.result.structuredContent.read?.verdictIn}` : r.error.message)
      return done()
    },
  },
}
