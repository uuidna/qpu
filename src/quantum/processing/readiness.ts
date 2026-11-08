// Readiness as a pure toolbox: every lead judged by measurement into served, refuted or trial; the border plan (which
// discovered doors to offer a theorem to, with what arguments) and the border read (what they answered); the unit plan (the
// calls the client makes to the unit) and the page. The client fetches and asks; nothing here does I/O.
import { listCleanupSubjects, type Lead } from './leads.ts'
import type { Discovery } from './discovery.ts'
import type { WaveResult } from './wave.ts'
import { TAKES } from './discovery.ts'
import { cellOf as cell } from './widgets.ts'

type Judged = { lead: string; source: string; status: string; class: 'served' | 'refuted' | 'trial'; by: string }
type Source = { source: string; reached: true; settled: number; why: string; open: { source: string; what: string; owes: string }[] }
type BorderCall = { door: string; host: string; arguments: Record<string, unknown> }
export type BorderAnswer = { door: string; host: string; arguments?: Record<string, unknown>; answer?: unknown; refusal?: string }
type Border = { door: string; host: string; args: string[]; verdict: string | null; receipt: string | null; sealed: boolean; note: string | null; refusal: string | null }
type Page = { status: number; title: string | null; rawTitle: string | null; url: string }

const SITE_SUFFIX = /\s*\|\s*(Cirq|Google Quantum AI|OpenFermion|TensorFlow Quantum|Qualtran|Stim)\s*/gi
const entities = (t: string): string => t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim()
const decodeTitle = (t: string): string => entities(t.replace(SITE_SUFFIX, ' '))
// the judge matches the full title with its site word (Cirq, Qualtran, …) left in, so a generic page name is not falsely served by a tool it only shares common words with: the site word lowers the coverage of a wrong match
const decodeRawTitle = (t: string): string => entities(t)

/** The page each lead's source answered with, from the wave's source-page results. */
export const indexPages = (results: readonly WaveResult[]): Map<string, Page> => {
  const pages = new Map<string, Page>()
  for (const r of results) if (r.verifier === 'source-page') for (const id of r.leads) if (!pages.has(id)) { const t = /title="([^"]*)"/.exec(r.note ?? '')?.[1]; pages.set(id, { status: r.status, title: t ? decodeTitle(t) : null, rawTitle: t ? decodeRawTitle(t) : null, url: r.url }) }
  return pages
}

/** One lead judged. `present` names the cleanup subjects the client measured as still present; `match` is the surface's matcher. */
export const judgeLead = (l: Lead, pages: ReadonlyMap<string, Page>, present: ReadonlySet<string>, match: (statement: string) => { verdict: string; tool?: string; evidence: string[]; weak?: boolean; coverage?: number }, measured: string | null): Judged => {
  const j = (cls: Judged['class'], by: string): Judged => ({ lead: l.id, source: l.source, status: l.status, class: cls, by })
  if (l.status === 'served') return j('served', `tool ${l.tool}`)
  const subjects = listCleanupSubjects(l)
  if (subjects) { const here = subjects.names.filter((n) => present.has(n)); return here.length ? j('trial', `${here.join(', ')} is present again`) : j('refuted', `measured absent: ${subjects.names.join(', ')}`) }
  const page = pages.get(l.id)
  if (page && (page.status === 404 || page.status === 410)) return j('refuted', `HTTP ${page.status} at ${page.url}${measured ? ` on ${measured.slice(0, 10)}` : ''}`)
  if (l.status === 'partial') return j('trial', `partial: ${l.tool} serves part; owes: ${l.reason ?? 'unstated'}`)
  if (page?.title) {
    const m = match(page.rawTitle ?? page.title)
    // served only by a match that is not weak: a serve on common words alone (coverage below the bar) is too little to claim the page
    if (m.verdict === 'served' && !m.weak) return j('served', `the match tool serves the page's title "${page.title}" by ${m.tool}`)
    const coverage = m.coverage !== undefined ? Math.round(m.coverage * 100) : Number(/covers (\d+)%/.exec(m.evidence[0] ?? '')?.[1] ?? 0)
    return j('refuted', `measured not served: the surface covers ${coverage}% of the page's title "${page.title}" (HTTP ${page.status})${l.status === 'out_of_scope' ? `; declared out of scope: ${l.reason}` : ''}`)
  }
  if (l.status === 'out_of_scope') return j('refuted', `declared out of scope: ${l.reason ?? 'no reason recorded'}`)
  return j('trial', l.reason ?? l.status)
}

const getHost = (source: string): string => (/^(?:https?:\/\/)?([a-z0-9.-]+\.[a-z]{2,})/i.exec(source) ?? [])[1] ?? (/^[\w./-]+\.(ts|md|lean|json|ndjson)\b/.test(source) ? source.split('/')[0]! : 'qpu')

/** The sources as the unit's readiness door takes them: settled counts and open groups, nothing dropped. */
export const listSources = (judged: readonly Judged[], leads: readonly Lead[]): Source[] => {
  const byHost = new Map<string, { source: string; settled: number; open: { what: string; owes: string }[] }>()
  for (const x of judged) {
    const host = getHost(x.source)
    const s = byHost.get(host) ?? { source: host, settled: 0, open: [] }
    if (x.class === 'trial') s.open.push({ what: `${x.lead}: ${leads.find((l) => l.id === x.lead)?.statement ?? ''}`, owes: x.by }); else s.settled += 1
    byHost.set(host, s)
  }
  return [...byHost.values()].map((s) => {
    const groups = new Map<string, { n: number; example: string }>()
    for (const o of s.open) { const g = groups.get(o.owes) ?? { n: 0, example: o.what }; g.n += 1; groups.set(o.owes, g) }
    return { source: s.source, reached: true as const, settled: s.settled, why: s.open.length ? `${s.open.length} open of ${s.open.length + s.settled}` : 'all settled', open: [...groups.entries()].map(([owes, g]) => ({ source: s.source, what: `${g.n} lead(s), e.g. ${g.example}`, owes })) }
  })
}

/** The border plan: every discovered door that takes a statement and answers a verdict, with arguments filled from the theorem. */
export const planBorder = (discovery: Pick<Discovery, 'doors' | 'capabilities'> | null, probe: { key: string; statement: string | null }): { calls: BorderCall[]; unfillable: Border[] } => {
  const calls: BorderCall[] = []; const unfillable: Border[] = []
  const statement = probe.statement ?? probe.key
  for (const d of (discovery?.doors ?? []).filter((x) => discovery!.capabilities.statementVerdict.includes(x.name) && x.readOnly !== false)) {
    const args: Record<string, unknown> = {}; let ok = true
    for (const p of new Set([...d.required, ...d.takes])) {
      if (['statement', 'claim', 'input', 'text', 'q', 'query', 'message'].includes(p)) args[p] = `${probe.key}: ${statement}`
      else if (p === 'proof' || p === 'key') args[p] = probe.key
      else if (p === 'deposits') args[p] = [{ party: 'qpu', proof: probe.key }, { party: 'qpu', proof: statement }]
      else if (p === 'theorems') args[p] = [probe.key]
      else if (d.required.includes(p)) ok = false
    }
    if (ok) calls.push({ door: d.name, host: d.host, arguments: args }); else unfillable.push({ door: d.name, host: d.host, args: [], verdict: null, receipt: null, sealed: false, note: `requires ${d.required.join(', ')}: not fillable from a theorem`, refusal: null })
  }
  return { calls, unfillable }
}

/** The border read: every answer or refusal, and whether any door sealed or verified the theorem. */
export const getBorder = (answers: readonly BorderAnswer[]): Border[] => answers.map((x) => {
  if (x.refusal !== undefined) return { door: x.door, host: x.host, args: Object.keys(x.arguments ?? {}), verdict: null, receipt: null, sealed: false, note: null, refusal: x.refusal }
  const a = (x.answer ?? {}) as Record<string, unknown>
  const verdict = typeof a.verdict === 'string' ? a.verdict : typeof (a.verdict as { verdict?: string } | undefined)?.verdict === 'string' ? (a.verdict as { verdict: string }).verdict : null
  const sealed = a.deposited === true || a.sealed === true || a.verified === true || /^(VERIFIED|PROVEN)$/.test(verdict ?? '')
  return { door: x.door, host: x.host, args: Object.keys(x.arguments ?? {}), verdict, receipt: typeof a.receipt === 'string' ? a.receipt : null, sealed, note: typeof a.note === 'string' ? a.note : null, refusal: null }
})

/** The tree's own vortex: the doubling cycle and the trinities, each with its σ_10 reflection, as every tail is read. */
const TREE_VORTEX = { forward: [1, 2, 4, 8, 7, 5, 3, 6, 9], reflected: [9, 8, 6, 2, 3, 5, 7, 4, 1], trinities: [[3, 6, 9], [7, 4, 1], [2, 5, 8]], fixed: [5] }
/** The unit's vortex doors read against the tree's: agreement is measured, a one-sided triad is named. */
const getVortex = (unit: { reflection?: { forward?: number[]; reflected?: number[]; involution?: boolean; pairsSumTen?: boolean; fixedPoints?: number[] } | null; triad?: number[] | null; doubleTorus?: { dims?: string[]; root?: string } | null }): { agree: boolean; why: string; triadOneSided: boolean; forward: number[] | null; reflected: number[] | null; doubleTorusRoot: string | null; dims: number } => {
  const r = unit.reflection
  const sameSet = (a: number[] | undefined, b: number[]) => !!a && a.length === b.length && [...a].sort().join() === [...b].sort().join()
  const agree = !!r && sameSet(r.forward, TREE_VORTEX.forward) && sameSet(r.reflected, TREE_VORTEX.reflected) && r.involution === true && r.pairsSumTen === true && (r.reflected ?? []).every((x, i) => x + (r.forward ?? [])[i]! === 10)
  const triadOneSided = Array.isArray(unit.triad) && unit.triad.join() === '3,6,9'
  return { agree, why: !r ? 'the unit\'s reflection door was not reached' : agree ? 'the unit\'s forward and reflected vortex are the tree\'s, an involution with pairs summing to 10' : `the unit\'s vortex differs: forward ${r.forward?.join(',')}, reflected ${r.reflected?.join(',')}`, triadOneSided, forward: r?.forward ?? null, reflected: r?.reflected ?? null, doubleTorusRoot: unit.doubleTorus?.root ?? null, dims: unit.doubleTorus?.dims?.length ?? 0 }
}
export type UnitAnswers = { vortex?: { reflection?: unknown; triad?: number[] | null; doubleTorus?: { dims?: string[]; root?: string } | null } | null; readiness: { ready: boolean; why: string; settled: number; asked: number; answered: number; receipt: string }; auras: Record<string, { example: string; hue?: number; hsl?: string; cmyk?: number[]; error?: string }>; rights: { receipt?: string; imprint?: string; licenseAddress?: string; drift: string[] }; address: { probe: string; here: string; unit: string | null; agree: boolean; note: string } }

/** The readiness page, from the judgement, the border and the unit's answers. */
// text that reaches a page is escaped once: an angle bracket, a brace or a bar in a verdict or a note is text, never a tag
export const getReadinessPage = (p: { unit: string; date: string; measured: string | null; discovered: string | null; probe: { key: string; statement: string | null }; judged: Judged[]; classes: { served: number; refuted: number; trial: number }; sources: Source[]; border: Border[]; sealedBy: string[]; answers: UnitAnswers }): string => {
  const { answers: a } = p
  return ['---', 'title: Readiness', 'order: 53', '---', '', '# The unit judges the tree', '',
    `Asked of the uuidna MCP at ${p.unit} by \`npm run next\` on ${p.date} through the \`readiness\` tool. The verdicts are the unit's; this tree only carries them.`, '',
    `## Release readiness: **${a.readiness.ready ? 'ready' : 'not ready'}**`, '', `${a.readiness.why}`, '', `Settled ${a.readiness.settled}; sources asked ${a.readiness.asked}, answered ${a.readiness.answered}; receipt \`${a.readiness.receipt}\`.`, '',
    '## Every lead judged by measurement', '',
    `Served ${p.classes.served}, refuted ${p.classes.refuted}, in trial ${p.classes.trial} of ${p.judged.length}. Served: a tool of this surface serves it, or the match tool serves the page's fetched title. Refuted: measured not served — the page is gone, a cleanup's subject stays absent, the surface covers too little of the page's own title to claim it, or the lead is declared out of scope. Trial: still owed. Page measurements from the verify step of ${p.measured?.slice(0, 10) ?? 'no run yet'}.`, '',
    '| Lead in trial | Status | Owes |', '|---|---|---|', ...p.judged.filter((x) => x.class === 'trial').map((x) => `| ${cell(x.lead)} | ${cell(x.status)} | ${cell(x.by.replace(/\|/g, '\\|'))} |`), '',
    '<details><summary>The refuted, by measurement</summary>', '', '| Lead | Status | By |', '|---|---|---|', ...p.judged.filter((x) => x.class === 'refuted').map((x) => `| ${cell(x.lead)} | ${cell(x.status)} | ${cell(x.by.replace(/\|/g, '\\|'))} |`), '', '</details>', '',
    '| Source | Settled | Open |', '|---|---:|---:|', ...p.sources.map((s) => `| ${cell(s.source)} | ${cell(s.settled)} | ${cell(s.open.reduce((n, o) => n + Number(/^(\d+) lead/.exec(o.what)?.[1] ?? 1), 0))} |`), '',
    '## Auras', '', "The A432-tuned colour the unit folds from each example block's content address (hue steps by 432/12 = 36°; artistic, not physics, in the unit's own words).", '',
    '| Block | Example | Hue | HSL | CMYK |', '|---|---|---:|---|---|', ...Object.entries(a.auras).map(([id, x]) => `| ${cell(id)} | ${cell(x.example)} | ${cell(x.hue ?? '—')} | ${cell(x.hsl ?? x.error ?? '')} | ${cell(x.cmyk ? x.cmyk.join(', ') : '')} |`), '',
    '## Address agreement', '', `Probe \`${a.address.probe}\`: here ${a.address.here}, unit ${a.address.unit ?? 'no answer'} — ${a.address.agree ? 'agree' : 'disagree'}. ${a.address.note}`, '',
    '## The border', '', `\`${p.probe.key}\` (${p.probe.statement ?? 'statement not in the ledger yet'}) offered to every door discovery found that takes a statement and answers a verdict (${p.border.length} door(s), discovered ${p.discovered?.slice(0, 10) ?? 'never'}). ${p.sealedBy.length ? `Sealed or verified by: ${p.sealedBy.join(', ')}.` : "No door sealed or verified it: qpu's proofs are not citable at the border; lead gap-theorems-unsealed stays blocked on the unit's doors."}`, '',
    '| Door | Asked with | Verdict | Receipt | Note or refusal |', '|---|---|---|---|---|', ...p.border.map((b) => `| ${cell(b.door)} | ${cell(b.args.join(', ') || '—')} | ${cell(b.verdict ?? '—')} | ${cell(b.receipt ?? '—')} | ${cell((b.note ?? b.refusal ?? '').replace(/\|/g, '\\|'))} |`), '',
    '## The vortex, cross-checked with the unit', '', (() => { const v = getVortex((a.vortex ?? {}) as Parameters<typeof getVortex>[0]); return `${v.why}. ${v.triadOneSided ? 'The unit\'s triad door answers 3, 6, 9 alone; this tree carries 7, 4, 1 beside it (triad_reflect).' : ''} ${v.doubleTorusRoot ? `The tree\'s ${v.dims} block addresses folded on the unit\'s double torus: root \`${v.doubleTorusRoot}\`.` : 'The double torus was not reached.'}` })(), '',
    '## Rights', '', a.rights.drift.length ? `Drift between the unit's rights and this tree's licence module: ${a.rights.drift.join('; ')}` : `This tree's licence module matches the unit's rights (address ${a.rights.licenseAddress}, imprint ${a.rights.imprint}, receipt ${a.rights.receipt}).`, ''].join('\n')
}
export { TAKES }
