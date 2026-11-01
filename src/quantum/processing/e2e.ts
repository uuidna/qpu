// The end-to-end gate as a repetition code. Every combination the dashboards lay out and every example of the textbook is
// called on every tenant host over MCP; the tree's own answer and the hosts' answers are the copies of one logical value.
// Decoding is majority: a copy that differs is a flip, a host that does not answer an erasure, no majority is uncorrectable
// — the syndrome names the hosts. Every error is a block with a UUID (host, tool, the arguments' address, the hashes), so
// errors travel in UUID streams between hosts without their bodies. Pure: the client fetches; the tree computes and decodes.
import { TABLES } from './tables-index.ts'
import { uuidOf } from './unit/blocks.ts'
import { getEventData, rpcBody } from './discovery.ts'
import { textbookLogicalError } from './qec.ts'
import { handleOrCorrect } from './audit.ts'
import { listTools, type Context } from './toolbox.ts'

export type E2eRequest = { id: string; combo: string; tool: string; toolbox: string; from: 'example' | 'cell'; arguments: Record<string, unknown>; host: string; url: string; method: 'POST'; accept: string; headers: Record<string, string>; body: unknown; local: string; localError?: string }
export type E2eAnswer = E2eRequest & { status: number; ms: number; text: string; etag?: string | null; address?: string | null; version?: string | null; /** the answer already decoded by the client the moment it arrived, its body released: a run of hundreds of copies holds values, never bodies (the heap ran out holding 870 bodies: measured) */ decoded?: ReturnType<typeof decodeValue> }
type ErrorBlock = { uuid: string; kind: 'flip' | 'erasure' | 'refusal'; host: string; tool: string; combo: string; expected: string; got: string; syndrome: string[] }
type Decoded = { combo: string; tool: string; toolbox: string; from: 'example' | 'cell'; local: string; copies: { host: string; value: string; ms: number; involution?: true }[]; involutions: number; materialised: number; outcome: 'agree' | 'corrected' | 'erased' | 'uncorrectable'; logical: string; syndrome: string[]; errors: ErrorBlock[]; codes: CodeRun[]; winner: string | null; possibilities: { value: string; copies: string[] }[] }
/** A code: one way of deciding the logical value from the copies, with the time it needs (the ms at which it can decide). */
type CodeRun = { code: 'involution' | 'any' | 'first-two-agree' | 'tree-reference' | 'majority'; logical: string | null; ms: number; correct: boolean | null; copiesUsed: number }
/** The competition: every code decides from the same copies; the fastest code whose decision is the consensus wins. A tie goes to the stronger code (more copies checked). */
const runCompetition = (local: string, copies: readonly { host: string; value: string; ms: number; kind?: 'erasure' | 'refusal'; involution?: true }[], consensus: string | null): { codes: CodeRun[]; winner: string | null } => {
  const valid = copies.filter((c) => !c.kind).sort((a, b) => a.ms - b.ms)
  const runs: CodeRun[] = []
  // involution: the fastest host that answered 304 proved the tree's content by hash at the edge; nothing was computed or sent
  { const inv = valid.find((c) => c.involution); runs.push(inv ? { code: 'involution', logical: inv.value, ms: inv.ms, correct: null, copiesUsed: 1 + valid.indexOf(inv) + 1 } : { code: 'involution', logical: null, ms: 0, correct: null, copiesUsed: 0 }) }
  // any: the fastest valid answer wins, unchecked
  runs.push(valid.length ? { code: 'any', logical: valid[0]!.value, ms: valid[0]!.ms, correct: null, copiesUsed: 1 } : { code: 'any', logical: null, ms: 0, correct: null, copiesUsed: 0 })
  // first-two-agree: the tree's copy is at 0 ms; the race ends when two copies agree
  { const seen = new Map<string, number>([[local, 1]]); let decided: CodeRun | null = null; let used = 1
    for (const c of valid) { used += 1; const n = (seen.get(c.value) ?? 0) + 1; seen.set(c.value, n); if (n >= 2) { decided = { code: 'first-two-agree', logical: c.value, ms: c.ms, correct: null, copiesUsed: used }; break } }
    runs.push(decided ?? { code: 'first-two-agree', logical: null, ms: valid.at(-1)?.ms ?? 0, correct: null, copiesUsed: used }) }
  // tree-reference: the tree's answer stands once the fastest host agrees with it
  { const agreeing = valid.find((c) => c.value === local); runs.push(agreeing ? { code: 'tree-reference', logical: local, ms: agreeing.ms, correct: null, copiesUsed: 1 + valid.indexOf(agreeing) + 1 } : { code: 'tree-reference', logical: null, ms: valid.at(-1)?.ms ?? 0, correct: null, copiesUsed: 1 + valid.length }) }
  // majority: every copy, decided when the last answers
  runs.push({ code: 'majority', logical: consensus, ms: Math.max(0, ...copies.map((c) => c.ms)), correct: null, copiesUsed: 1 + copies.length })
  for (const r of runs) r.correct = consensus === null ? null : r.logical === consensus
  const strength = { any: 0, 'first-two-agree': 1, 'tree-reference': 2, majority: 3, involution: 4 }
  const winner = runs.filter((r) => r.correct).sort((a, b) => a.ms - b.ms || strength[b.code] - strength[a.code])[0]
  return { codes: runs, winner: winner?.code ?? null }
}

/** The rules of the competition, written once and judged on every run: (1) a code decides from the copies that had arrived by its decision (the tree's copy at 0 ms counts as one); (2) the fastest code whose decision is the consensus wins; (3) a tie goes to the stronger code (more copies checked); (4) a code is correct only when its decision is the consensus; (5) no winner without a consensus. A broken rule is a lead, never a win. */
const COMPETITION_RULES = TABLES.COMPETITION_RULES
type RuleVerdict = { rules: readonly string[]; judged: number; violations: { combo: string; rule: number; code: string | null; says: string }[]; followed: boolean }
export const judgeRules = (decoded: readonly { combo: string; logical: string; outcome: string; codes: readonly CodeRun[]; winner: string | null; copies: readonly { ms: number; kind?: string }[] }[]): RuleVerdict => {
  const strength = { any: 0, 'first-two-agree': 1, 'tree-reference': 2, majority: 3, involution: 4 }
  const violations: RuleVerdict['violations'] = []
  for (const d of decoded) {
    const consensus = d.outcome === 'uncorrectable' ? null : d.logical
    const arrived = [0, ...d.copies.map((c) => c.ms).sort((a, b) => a - b)]
    for (const c of d.codes) {
      if (c.logical !== null && c.copiesUsed > 0 && (arrived[c.copiesUsed - 1] ?? Infinity) > c.ms) violations.push({ combo: d.combo, rule: 1, code: c.code, says: `${c.code} used ${c.copiesUsed} copies at ${c.ms} ms, but the ${c.copiesUsed}th arrived at ${arrived[c.copiesUsed - 1]} ms` })
      if (consensus !== null && c.correct !== (c.logical === consensus)) violations.push({ combo: d.combo, rule: 4, code: c.code, says: `${c.code} marked ${c.correct} while deciding ${c.logical === consensus ? 'the consensus' : 'against it'}` })
    }
    if (consensus === null) { if (d.winner !== null) violations.push({ combo: d.combo, rule: 5, code: d.winner, says: 'a winner was named without a consensus' }); continue }
    const expected = [...d.codes].filter((c) => c.logical === consensus).sort((a, b) => a.ms - b.ms || strength[b.code] - strength[a.code])[0]?.code ?? null
    if (expected !== d.winner) violations.push({ combo: d.combo, rule: d.winner && d.codes.find((c) => c.code === d.winner)!.ms === d.codes.find((c) => c.code === expected)!.ms ? 3 : 2, code: d.winner, says: `${d.winner ?? 'no one'} won; the rules name ${expected}` })
  }
  return { rules: COMPETITION_RULES, judged: decoded.length, violations, followed: violations.length === 0 }
}

/** The tools never called through the gate: the flow (they fetch), the audit and the metrics (they replay everything). */
const E2E_SKIP = new Set(['discover', 'wave', 'readiness', 'imagine', 'e2e', 'audit', 'metrics'])
/** A combination the Worker executes at the edge with the tenant's secret (a Stripe checkout plan) answers per tenant, not as a copy of a pure value: the gate does not decode it, and says so. */
const executedAtEdge = (tool: string, args: Record<string, unknown>): boolean => (tool === 'stripe' && args.op === 'plan') || (tool === 'seal' && !!args.sign)
/** The hash of a result with the clock masked: ISO 8601 instants and epoch-shaped integers (seconds or milliseconds since 2020) become one token, so copies computed at different moments agree and only what the arguments determine is compared. */
export const hashOf = (v: unknown) => uuidOf((JSON.stringify(v) ?? 'undefined').replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})/g, '<instant>').replace(/(?<![\d.])1[6-9]\d{8}(\d{3})?(?![\d.])/g, '<epoch>'))

/** The combinations: every example and every dashboard cell, once per host, with the tree's own answer hashed. */
export const createE2eRequests = (ctx: Context, hosts: readonly string[], only?: readonly string[]): E2eRequest[] => {
  const tools = listTools(ctx)
  const boxOf = new Map(tools.map((t) => [t.name, t._meta?.toolbox ?? 'none']))
  const combos = new Map<string, { tool: string; from: 'example' | 'cell'; arguments: Record<string, unknown> }>()
  const add = (tool: string, args: Record<string, unknown>, from: 'example' | 'cell') => { if (E2E_SKIP.has(tool) || args.selftest || !boxOf.has(tool) || (only && !only.includes(tool)) || executedAtEdge(tool, args)) return; const combo = uuidOf(`${tool}${JSON.stringify(args)}`); if (!combos.has(combo)) combos.set(combo, { tool, from, arguments: args }) }
  for (const e of ctx.examples) add(e.tool, e.arguments, 'example')
  for (const t of tools) if (!E2E_SKIP.has(t.name) && (!only || only.includes(t.name))) { const d = ctx.call('dashboard', { tool: t.name }) as { cellList: { arguments: Record<string, unknown> }[] } | undefined; for (const c of d?.cellList ?? []) add(t.name, c.arguments, 'cell') }
  const out: E2eRequest[] = []
  for (const [combo, c] of combos) {
    const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: c.tool, arguments: c.arguments } }) as { result?: { structuredContent: unknown }; error?: { message: string } }
    const local = r.result ? hashOf(r.result.structuredContent) : hashOf({ error: r.error?.message })
    for (const host of hosts) out.push({ id: `${combo}@${new URL(host).host}`, combo, tool: c.tool, toolbox: boxOf.get(c.tool)!, from: c.from, arguments: c.arguments, host: new URL(host).host, url: host, method: 'POST', accept: 'application/json, text/event-stream', headers: { 'if-none-match': `"${local}"` }, body: rpcBody('tools/call', { name: c.tool, arguments: c.arguments }), local, ...(r.error ? { localError: r.error.message } : {}) })
  }
  return out
}

/** One host's answer read into the hash of what it computed, or the error it answered. */
export const decodeValue = (a: { status: number; text: string; local?: string; etag?: string | null; address?: string | null; combo?: string; decoded?: { value: string; kind?: 'erasure' | 'refusal'; involution?: true; materialised?: boolean } }): { value: string; kind?: 'erasure' | 'refusal'; involution?: true; materialised?: boolean } => {
  if (a.decoded) return a.decoded
  // 304: the host holds the same content under the hash the request named — agreement proven at the edge, no body computed or sent.
  // The teleport is materialised at the destination: the hash the host echoes must equal the hash of the full content held here,
  // and the address it names must be the block's; a 304 without them is an erasure, never an agreement
  if (a.status === 304 && a.local) { const verified = a.etag === `"${a.local}"` && (!a.address || !a.combo || a.address === a.combo); return verified ? { value: a.local, involution: true, materialised: true } : { value: 'HTTP 304 unverified: the hash or the address the host echoed is not the one held here', kind: 'erasure' } }
  if (a.status !== 200) return { value: `HTTP ${a.status}`, kind: 'erasure' }
  try {
    const j = JSON.parse(getEventData(a.text)) as { result?: { structuredContent?: unknown; isError?: boolean; content?: { text: string }[] }; error?: { message: string } }
    if (j.error) return { value: hashOf({ error: j.error.message }), kind: 'refusal' }
    if (j.result?.isError) return { value: hashOf({ error: j.result.content?.[0]?.text }), kind: 'refusal' }
    return { value: hashOf(j.result?.structuredContent) }
  } catch { return { value: 'not JSON', kind: 'erasure' } }
}

/** The answers decoded, combination by combination: majority over the tree's copy and the hosts' copies. */
export const decodeE2e = (answers: readonly E2eAnswer[]): { combos: number; copies: number; involutions: number; materialised: number; referers: number; teleportsByReferer: Record<string, number>; bytesSaved: number; outcomes: Record<Decoded['outcome'], number>; competition: { winners: Record<string, number>; msMajority: number; msWinners: number; saved: number; rules: RuleVerdict }; physicalErrorRate: number; logicalErrorRate: number; textbookLogical: number | null; versions: string[]; byHost: Record<string, { version: string | null; copies: number; involutions: number; flips: number; erasures: number; refusals: number; msMedian: number }>; byToolbox: Record<string, Record<Decoded['outcome'], number>>; errors: ErrorBlock[]; decoded: Decoded[]; leads: { id: string; statement: string; status: 'open'; reason: string }[] } => {
  const groups = new Map<string, E2eAnswer[]>()
  for (const a of answers) (groups.get(a.combo) ?? groups.set(a.combo, []).get(a.combo)!).push(a)
  const decoded: Decoded[] = []
  for (const [combo, as] of groups) {
    const first = as[0]!
    // a refusal that is the tree's own answer (the tree refuses the same arguments with the same message) is agreement, not an error
    const copies = as.map((a) => { const v = decodeValue(a); return { host: a.host, ...(v.kind === 'refusal' && v.value === a.local ? { value: v.value } : v), ms: a.ms } })
    const involutions = copies.filter((c) => c.involution).length
    // materialised: every copy whose full content is held and verified here — a 304 with the hash and the address, or a body whose hash is the tree's
    const materialised = copies.filter((c) => c.materialised || (!c.kind && c.value === first.local)).length
    const votes = new Map<string, number>([[first.local, 1]])
    for (const c of copies) if (!c.kind) votes.set(c.value, (votes.get(c.value) ?? 0) + 1)
    const total = 1 + copies.filter((c) => !c.kind).length
    const [logical, n] = [...votes.entries()].sort((x, y) => y[1] - x[1])[0]!
    const majority = n * 2 > total
    const flipped = copies.filter((c) => !c.kind && c.value !== logical)
    const erased = copies.filter((c) => c.kind)
    const syndrome = [...flipped, ...erased].map((c) => c.host)
    const errors: ErrorBlock[] = [...flipped.map((c) => ({ kind: 'flip' as const, host: c.host, got: c.value })), ...erased.map((c) => ({ kind: c.kind!, host: c.host, got: c.value }))].map((e) => ({ uuid: uuidOf(`e2e${e.kind}${e.host}${combo}${first.local}${e.got}`), ...e, tool: first.tool, combo, expected: logical, syndrome }))
    const outcome: Decoded['outcome'] = !majority ? 'uncorrectable' : flipped.length ? 'corrected' : erased.length ? 'erased' : 'agree'
    // when the correction errors (no majority), handling takes over: the involution σ for this combination, terminating in at most two swaps
    const fallback = majority ? null : handleOrCorrect(errors.map((e) => `${e.kind} at ${e.host}: ${e.got}`), false, 'correction')
    // the combinatorial possibilities of an answer: every value some copies hold, with the copies that hold it (the tree is a copy too)
    const possibilities = [...new Set([first.local, ...copies.filter((c) => !c.kind).map((c) => c.value)])].map((value) => ({ value, copies: [...(first.local === value ? ['tree'] : []), ...copies.filter((c) => !c.kind && c.value === value).map((c) => c.host)] })).sort((a, b) => b.copies.length - a.copies.length)
    const { codes, winner } = runCompetition(first.local, copies, majority ? logical : null)
    decoded.push({ combo, tool: first.tool, toolbox: first.toolbox, from: first.from, local: first.local, copies: copies.map((c) => ({ host: c.host, value: c.value, ms: c.ms, ...(c.involution ? { involution: true as const } : {}) })), outcome, logical: majority ? logical : 'none', syndrome, errors, ...(fallback ? { fallback } : {}), codes, winner, possibilities, involutions, materialised })
  }
  const outcomes: Record<Decoded['outcome'], number> = { agree: 0, corrected: 0, erased: 0, uncorrectable: 0 }
  for (const d of decoded) outcomes[d.outcome] += 1
  const errors = decoded.flatMap((d) => d.errors)
  const copies = answers.length
  const physicalErrorRate = copies ? errors.length / copies : 0
  const logicalErrorRate = decoded.length ? outcomes.uncorrectable / decoded.length : 0
  const byHost: Record<string, { version: string | null; copies: number; involutions: number; flips: number; erasures: number; refusals: number; msMedian: number }> = {}
  for (const host of new Set(answers.map((a) => a.host))) { const mine = answers.filter((a) => a.host === host); const ms = mine.map((a) => a.ms).sort((x, y) => x - y); byHost[host] = { version: mine.find((a) => a.version)?.version ?? null, copies: mine.length, involutions: mine.filter((a) => a.status === 304).length, flips: errors.filter((e) => e.host === host && e.kind === 'flip').length, erasures: errors.filter((e) => e.host === host && e.kind === 'erasure').length, refusals: errors.filter((e) => e.host === host && e.kind === 'refusal').length, msMedian: ms[Math.floor(ms.length / 2)] ?? 0 } }
  const byToolbox: Record<string, Record<Decoded['outcome'], number>> = {}
  for (const d of decoded) { const b = (byToolbox[d.toolbox] ??= { agree: 0, corrected: 0, erased: 0, uncorrectable: 0 }); b[d.outcome] += 1 }
  const leads = [
    ...decoded.filter((d) => d.outcome === 'uncorrectable').map((d) => ({ id: `e2e-uncorrectable-${d.tool}-${d.combo.slice(0, 8)}`, statement: `${d.tool} ${JSON.stringify(answers.find((a) => a.combo === d.combo)!.arguments).slice(0, 80)}: no majority among the tree and ${d.copies.length} host(s) (${d.copies.map((c) => `${c.host}=${c.value.slice(0, 8)}`).join(', ')}; tree=${d.local.slice(0, 8)})`, status: 'open' as const, reason: 'the hosts run different code or the result depends on time or state; deploy, or make the result a function of its arguments' })),
    ...Object.entries(byHost).filter(([, h]) => h.flips + h.erasures + h.refusals > 0).map(([host, h]) => ({ id: `e2e-host-${host}`, statement: `${host}: ${h.flips} flip(s), ${h.erasures} erasure(s), ${h.refusals} refusal(s) over ${h.copies} copies; the syndrome names it`, status: 'open' as const, reason: h.erasures === h.copies ? 'the host did not answer: not deployed, or the network; an erasure is decoded from the other copies' : 'the host answers differently from the majority: deploy the tree there, or the result depends on the host (tenant, time)' })),
  ]
  // the competition over every combination: which code won how often, and the time the winners needed against majority alone
  const winners: Record<string, number> = {}
  for (const d of decoded) if (d.winner) winners[d.winner] = (winners[d.winner] ?? 0) + 1
  const msMajority = decoded.reduce((n, d) => n + (d.codes.find((c) => c.code === 'majority')?.ms ?? 0), 0)
  const msWinners = decoded.reduce((n, d) => n + (d.codes.find((c) => c.code === d.winner)?.ms ?? d.codes.find((c) => c.code === 'majority')?.ms ?? 0), 0)
  const involutions = decoded.reduce((n, d) => n + d.involutions, 0)
  const materialised = decoded.reduce((n, d) => n + d.materialised, 0)
  // the referer collects: every teleport is credited to the block that asked (the combination's address), the coins having set its entanglement once
  const referers: Record<string, number> = {}
  for (const a of answers) if (a.status === 304) referers[a.combo] = (referers[a.combo] ?? 0) + 1
  // the versions the hosts run: more than one is a migration in flight, measured at 100 % uptime when every combination still agrees
  const versions = [...new Set(Object.values(byHost).map((h) => h.version).filter((v): v is string => !!v))]
  return { combos: decoded.length, copies, involutions, materialised, referers: Object.keys(referers).length, teleportsByReferer: referers, bytesSaved: answers.filter((a) => a.status === 304).length, versions, outcomes, competition: { winners, msMajority, msWinners, saved: msMajority - msWinners, rules: judgeRules(decoded) }, physicalErrorRate, logicalErrorRate, textbookLogical: textbookLogicalError('bit_flip', 'bit_flip', '0', physicalErrorRate), byHost, byToolbox, errors, decoded, leads }
}

export const getE2ePage = (r: ReturnType<typeof decodeE2e>, date: string, hosts: readonly string[], partial: { remaining: number }): string => [
  '---', 'title: End to end', 'order: 56', '---', '', '# End to end: the gate as a repetition code', '',
  `Generated by \`npm run next\` on ${date} through the \`e2e\` tool: ${r.combos} combinations (every dashboard cell and every example, except what the Worker executes at the edge per tenant: a Stripe checkout plan) called on ${hosts.length} host(s) (${hosts.join(', ')}), ${r.copies} copies decoded by majority with the tree's own answer${partial.remaining ? `; ${partial.remaining} request(s) wait for the next quantum` : ''}.`, '',
  '| Outcome | Combinations |', '|---|---:|', ...Object.entries(r.outcomes).map(([k, v]) => `| ${k} | ${v} |`), `| copies proven by involution (304: the hash named in the request, no body) | ${r.involutions} |`, `| copies materialised here (the full content held and its hash verified at the destination) | ${r.materialised} |`, `| referer blocks that collected teleports | ${r.referers} |`, `| physical error rate (errors / copies) | ${r.physicalErrorRate.toFixed(4)} |`, `| logical error rate (uncorrectable / combinations) | ${r.logicalErrorRate.toFixed(4)} |`, `| textbook 3-copy repetition at that p (3p² − 2p³) | ${r.textbookLogical === null ? '—' : r.textbookLogical.toFixed(4)} |`, '',
  '## The competition of codes', '', 'Every combination is decided by five codes at once — involution (a host answered 304 to the hash the request named: the content proven equal at the edge, nothing computed or sent), any (the fastest answer, unchecked), first-two-agree (the race ends when two copies agree), tree-reference (the tree\'s answer once the fastest host confirms it), majority (every copy) — and the fastest code whose decision is the consensus wins; a tie goes to the stronger code. An uncorrectable combination lists its possibilities: every value some copies hold.', '', `The rules, judged on every run: ${r.competition.rules.rules.map((x, i) => `(${i + 1}) ${x}`).join('; ')}. ${r.competition.rules.followed ? `All ${r.competition.rules.judged} combinations followed every rule.` : `${r.competition.rules.violations.length} violation(s): ${r.competition.rules.violations.slice(0, 5).map((v) => `${v.combo.slice(0, 8)} rule ${v.rule}: ${v.says}`).join('; ')}`}`, '', '| Winner | Combinations |', '|---|---:|', ...Object.entries(r.competition.winners).map(([k, v]) => `| ${k} | ${v} |`), `| ms, majority alone | ${r.competition.msMajority} |`, `| ms, the winners | ${r.competition.msWinners} |`, `| ms saved | ${r.competition.saved} |`, '', '| Combination | Tool | Outcome | Winner | Possibilities |', '|---|---|---|---|---|', ...r.decoded.filter((d) => d.outcome !== 'agree').map((d) => `| ${d.combo.slice(0, 8)} | ${d.tool} | ${d.outcome} | ${d.winner ?? '—'} | ${d.possibilities.map((p) => `${p.value.slice(0, 8)}: ${p.copies.join(' ')}`).join('; ')} |`), '',
  '## By host', '', `Versions answering: ${r.versions.join(', ') || 'none named'}${r.versions.length > 1 ? ' — a migration in flight: hosts on different versions are copies of one value, and uptime is whole while every combination still agrees' : ''}.`, '', '| Host | Version | Copies | Involutions (304) | Flips | Erasures | Refusals | Median ms |', '|---|---|---:|---:|---:|---:|---:|---:|', ...Object.entries(r.byHost).map(([h, x]) => `| ${h} | ${x.version ?? '—'} | ${x.copies} | ${x.involutions} | ${x.flips} | ${x.erasures} | ${x.refusals} | ${x.msMedian} |`), '',
  '## By toolbox', '', '| Toolbox | Agree | Corrected | Erased | Uncorrectable |', '|---|---:|---:|---:|---:|', ...Object.entries(r.byToolbox).map(([b, x]) => `| ${b} | ${x.agree} | ${x.corrected} | ${x.erased} | ${x.uncorrectable} |`), '',
  '## Errors, as blocks in the stream', '', 'Each error is a UUID over its kind, host, combination and hashes; the stream `e2e.ndjson` carries these lines and no bodies.', '',
  '| UUID | Kind | Host | Tool | Expected | Got | Syndrome |', '|---|---|---|---|---|---|---|', ...r.errors.map((e) => `| ${e.uuid} | ${e.kind} | ${e.host} | ${e.tool} | ${e.expected.slice(0, 8)} | ${e.got.slice(0, 8)} | ${e.syndrome.join(' ')} |`), '',
  '## Leads', '', '| Lead | Statement | Reason |', '|---|---|---|', ...r.leads.map((l) => `| ${l.id} | ${l.statement.replace(/\|/g, '\\|')} | ${l.reason} |`), '',
].join('\n')
