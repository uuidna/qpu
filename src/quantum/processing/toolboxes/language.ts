// The language toolbox: translation by vocabulary, offline, in both directions, with every word no table knows reported as a
// lead; the vocabulary measured against every term the surface emits, so the tables are updated from measurement; and
// programmable prose: a tool's result and its toolbox's skill rendered as sentences in any locale, backed by the toolset
// (the numbers are the tool's) and the skillset (the words are the vocabulary's). Pure.
import { PROSE, proseFill } from '../prose-index.ts'
import { TABLES as PAYLOAD_TABLES } from '../tables-index.ts'
import { defineTool, createChecks, listTools, unlimited, type Toolbox, type Context } from '../toolbox.ts'
import { LOCALES, TABLES, translate as vocabulary, listNumerals } from '../i18n.ts'
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
  const t = (s: string) => vocabulary(s, 'en', locale)
  const sentences: string[] = []
  const untranslated = new Set<string>()
  const say = (s: string) => { const r = t(s); sentences.push(r.text); for (const w of r.untranslated) untranslated.add(w) }
  if (toolbox) say(`the ${toolbox.name} toolbox: ${toolbox.idea}.`)
  const fields = structured && typeof structured === 'object' ? Object.entries(structured as Record<string, unknown>).filter(([, v]) => typeof v === 'number' || typeof v === 'boolean' || (typeof v === 'string' && v.length <= 80 && !v.includes('\n'))) : []
  if (fields.length) say(`the ${tool} tool answered: ${fields.map(([k, v]) => `${splitWords(k)} ${typeof v === 'boolean' ? (v ? 'yes' : 'no') : String(v)}`).join(', ')}.`)
  else say(proseFill(PROSE.quantumProcessingToolboxesLanguage_s1, tool))
  if (toolbox) say(`how to use it: ${toolbox.instructions}`)
  return { text: sentences.join(' '), sentences, untranslated: [...untranslated].filter((w) => !/^\d/.test(w)) }
}

const translate = defineTool('language', {
  name: 'translate',
  description: PROSE.quantumProcessingToolboxesLanguage_description2,
  inputSchema: { type: 'object', properties: { text: { type: 'string' }, from: { type: 'string', enum: Object.keys(LOCALES) }, to: { type: 'string', enum: Object.keys(LOCALES) }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (typeof args.text !== 'string') { const coverage = getLocaleCoverage(); return { phase: 'coverage' as const, terms: SURFACE_TERMS.length, locales: coverage.length, filled: coverage.filter((c) => c.filled).length, missingTotal: coverage.reduce((n, c) => n + c.missing.length, 0), coverage } }
    const from = typeof args.from === 'string' ? args.from : 'en'; const to = typeof args.to === 'string' ? args.to : 'bg'
    const num = listNumerals(args.text)
    const r = vocabulary(num.text, from, to)
    return { phase: 'translated' as const, from, to, text: r.text, via: r.via, untranslated: r.untranslated.length, untranslatedWords: r.untranslated, numerals: num.numerals }
  },
  widget: flowWidget,
})

const prose = defineTool('language', {
  name: 'prose',
  description: PROSE.quantumProcessingToolboxesLanguage_description3,
  inputSchema: { type: 'object', properties: { tool: { type: 'string', description: PROSE.quantumProcessingToolboxesLanguage_description4 }, arguments: { type: 'object' }, locale: { type: 'string', enum: Object.keys(LOCALES) }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (typeof args.tool !== 'string') return unlimited()
    const tool = args.tool; const locale = typeof args.locale === 'string' ? args.locale : 'en'
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
  idea: PROSE.quantumProcessingToolboxesLanguage_idea5,
  tools: [translate, prose],
  examples: [
    { id: 'translate-bg', tool: 'translate', arguments: { text: PROSE.quantumProcessingToolboxesLanguage_text6, from: 'en', to: 'bg' }, shows: PROSE.quantumProcessingToolboxesLanguage_shows7, expect: (s) => (s.phase === 'translated' && /следата|следа/.test(s.text) && /обслужена/.test(s.text) && /неизвестно/.test(s.text) ? null : `${s.text} (${s.untranslatedWords})`) },
    { id: 'translate-coverage', tool: 'translate', arguments: {}, shows: PROSE.quantumProcessingToolboxesLanguage_shows8, expect: (s) => (s.phase === 'coverage' && s.terms === SURFACE_TERMS.length && s.coverage.find((c: { locale: string }) => c.locale === 'bg')?.filled === true ? null : `${s.phase}: ${s.terms} terms, ${s.filled} filled`) },
  ],
  skill: {
    instructions: PROSE.quantumProcessingToolboxesLanguage_instructions9,
    directions: [PROSE.quantumProcessingToolboxesLanguage_s10, PROSE.quantumProcessingToolboxesLanguage_s11, PROSE.quantumProcessingToolboxesLanguage_s12],
    selftest: (ctx: Context) => {
      const { check, done } = createChecks()
      for (const [code, table] of Object.entries(TABLES)) {
        // a term returns if the inverse gives it or a synonym that shares its translation; an empty translation (no article in the locale) has no inverse
        const synonyms = (term: string) => Object.keys(table).filter((k) => table[k] === table[term]).map((k) => k.toLowerCase())
        const broken = Object.keys(table).filter((term) => table[term] !== '' && !synonyms(term).includes(vocabulary(vocabulary(term, 'en', code).text, code, 'en').text.toLowerCase()))
        check(`language:round-trip:${code}`, broken.length === 0, broken.length ? `${broken.length} term(s) do not return: ${broken.slice(0, 5).join(', ')}` : `${Object.keys(table).length} terms return through ${code}`)
      }
      const cov = getLocaleCoverage().find((c) => c.locale === 'bg')!
      check('language:coverage-measured', cov.terms > 0 && Array.isArray(cov.missing), `bg: ${cov.terms} terms, ${cov.missing.length} surface terms missing${cov.missing.length ? ` (${cov.missing.slice(0, 6).join(', ')})` : ''}`)
      const p = writeProse({ name: 'tree', idea: 'the tree knows itself', instructions: 'call match' }, 'clay', { total: 54, holding: 54, maxBits: 33 }, 'bg')
      check('language:prose-bg', p.sentences.length === 3 && p.text.includes('54') && /инструмент/.test(p.text), p.text)
      const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'match', arguments: { statement: 'Разложи Ⰺⰴ с Shor', locale: 'bg' } } })
      check('language:match-in-bg', 'result' in r && r.result.structuredContent.read?.verdictIn === 'обслужена', 'result' in r ? `${r.result.structuredContent.verdict} → ${r.result.structuredContent.read?.verdictIn}` : r.error.message)
      return done()
    },
  },
}
