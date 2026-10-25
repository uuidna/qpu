// The unit judges the tree: each run asks the uuidna MCP at its canonical edge for the release-readiness verdict on this
// tree's lead sources, the A432 aura of every example block, and the current rights facts, and records each answer with
// its receipt. The handler stays pure; this script is the client. Network; skipped by `next --offline`.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { handle } from '../src/quantum/mcp.ts'
import { EXAMPLES } from '../src/quantum/examples.ts'
import { LEADS, cleanupSubjectsOf, type Lead } from '../src/quantum/leads.ts'
import { matcherOf } from '../src/quantum/match.ts'
import { LICENSE } from '../src/quantum/license.ts'
import { uuidOf } from '../src/quantum/blocks.ts'

const ROOT = process.cwd()
const UNIT = process.env.UUIDNA_MCP ?? 'https://uuidna.com/mcp'
const rpc = async (name: string, args: unknown): Promise<any> => {
  const res = await fetch(UNIT, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', 'user-agent': 'uuidna-qpu-next (ceccec@psg.bg)' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }), signal: AbortSignal.timeout(60000) })
  const body = await res.json() as { result?: { structuredContent?: unknown; content?: { text: string }[]; isError?: boolean }; error?: { message: string } }
  if (body.error) throw new Error(body.error.message)
  if (body.result?.isError) throw new Error(body.result.content?.[0]?.text ?? 'the door refused without a text')
  return body.result?.structuredContent ?? (body.result?.content?.[0] ? JSON.parse(body.result.content[0].text) : body.result)
}

const main = async () => {
  // 1. readiness: every lead judged by measurement into one of three classes and nothing dropped.
  //    served: a tool of this surface serves it (or the match tool serves the page's fetched title).
  //    refuted: measured not served — the page is gone (HTTP 404/410), a cleanup's subject stays absent, the surface covers too
  //             little of the page's own title to claim it; or declared out of scope, with the page's measurement beside it.
  //    trial: still owed — partial, unmeasured, or blocked on an act outside this tree.
  //    The unit's law is "settle it, or refute it with a measurement": served and refuted are settled; trial stays open.
  const verificationPath = join(ROOT, 'docs', 'public', 'verification.json')
  const verification = existsSync(verificationPath) ? JSON.parse(readFileSync(verificationPath, 'utf8')) as { date: string; results: { verifier: string; url: string; status: number; note: string; leads: string[] }[] } : null
  const pageOf = new Map<string, { status: number; title: string | null; url: string }>()
  const decode = (t: string) => t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s*\|\s*(Cirq|Google Quantum AI|OpenFermion|TensorFlow Quantum|Qualtran|Stim)\s*/gi, ' ').replace(/\s+/g, ' ').trim()
  for (const r of verification?.results ?? []) if (r.verifier === 'source-page') for (const id of r.leads) if (!pageOf.has(id)) { const t = /title="([^"]*)"/.exec(r.note)?.[1]; pageOf.set(id, { status: r.status, title: t ? decode(t) : null, url: r.url }) }
  const match = matcherOf(handle, EXAMPLES, LEADS)
  type Judged = { lead: string; source: string; status: string; class: 'served' | 'refuted' | 'trial'; by: string }
  const judge = (l: Lead): Judged => {
    const j = (cls: Judged['class'], by: string): Judged => ({ lead: l.id, source: l.source, status: l.status, class: cls, by })
    if (l.status === 'served') return j('served', `tool ${l.tool}`)
    const subjects = cleanupSubjectsOf(l)
    if (subjects) {
      const present = subjects.kind === 'branches'
        ? subjects.names.filter((b) => execFileSync('git', ['branch', '--list', b], { cwd: ROOT, encoding: 'utf8' }).trim() !== '')
        : subjects.names.filter((path) => existsSync(join(ROOT, path)))
      return present.length ? j('trial', `${present.join(', ')} is present again`) : j('refuted', `measured absent: ${subjects.names.join(', ')}`)
    }
    const page = pageOf.get(l.id)
    if (page && (page.status === 404 || page.status === 410)) return j('refuted', `HTTP ${page.status} at ${page.url} on ${verification!.date.slice(0, 10)}`)
    if (l.status === 'partial') return j('trial', `partial: ${l.tool} serves part; owes: ${l.reason ?? 'unstated'}`)
    if (page?.title) {
      const m = match(page.title)
      if (m.verdict === 'served') return j('served', `the match tool serves the page's title "${page.title}" by ${m.tool}`)
      const coverage = /covers (\d+)%/.exec(m.evidence[0] ?? '')?.[1]
      return j('refuted', `measured not served: the surface covers ${coverage ?? 0}% of the page's title "${page.title}" (HTTP ${page.status})${l.status === 'out_of_scope' ? `; declared out of scope: ${l.reason}` : ''}`)
    }
    if (l.status === 'out_of_scope') return j('refuted', `declared out of scope: ${l.reason ?? 'no reason recorded'}`)
    return j('trial', l.reason ?? l.status)
  }
  const judged = LEADS.map(judge)
  const classes = { served: judged.filter((x) => x.class === 'served').length, refuted: judged.filter((x) => x.class === 'refuted').length, trial: judged.filter((x) => x.class === 'trial').length }
  const hostOf = (source: string): string => (/^(?:https?:\/\/)?([a-z0-9.-]+\.[a-z]{2,})/i.exec(source) ?? [])[1] ?? (/^[\w./-]+\.(ts|md|lean|json|ndjson)\b/.test(source) ? source.split('/')[0]! : 'qpu')
  const byHost = new Map<string, { source: string; settled: number; open: { what: string; owes: string }[] }>()
  for (const x of judged) {
    const host = hostOf(x.source)
    const s = byHost.get(host) ?? { source: host, settled: 0, open: [] }
    if (x.class === 'trial') s.open.push({ what: `${x.lead}: ${LEADS.find((l) => l.id === x.lead)!.statement}`, owes: x.by })
    else s.settled += 1
    byHost.set(host, s)
  }
  const sources = [...byHost.values()].map((s) => {
    const groups = new Map<string, { n: number; example: string }>()
    for (const o of s.open) { const g = groups.get(o.owes) ?? { n: 0, example: o.what }; g.n += 1; groups.set(o.owes, g) }
    return { source: s.source, reached: true, settled: s.settled, why: s.open.length ? `${s.open.length} open of ${s.open.length + s.settled}` : 'all settled', open: [...groups.entries()].map(([owes, g]) => ({ source: s.source, what: `${g.n} lead(s), e.g. ${g.example}`, owes })) }
  })
  const readiness = await rpc('check_release_readiness', { sources })

  // 2. auras: the unit's A432-tuned colour for every example block, by the block's content address
  const auras: Record<string, unknown> = {}
  for (const e of EXAMPLES) {
    if (e.tool === 'audit') continue
    const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } }) as { result?: { _meta: { block: { meta: { id: string } } } } }
    const id = r.result?._meta.block.meta.id
    if (!id) continue
    try { auras[id] = { example: e.id, ...(await rpc('compute_aura', { subject: id })) } } catch (err) { auras[id] = { example: e.id, error: (err as Error).message } }
  }

  // 3. rights: the unit's current facts against this tree's licence module; a mismatch is a lead, not a silent drift
  const rights = await rpc('get_rights', {})
  const drift: string[] = []
  if (rights.license !== LICENSE.spdx) drift.push(`spdx ${rights.license} vs ${LICENSE.spdx}`)
  if (rights.licenseUrl !== LICENSE.url) drift.push(`url ${rights.licenseUrl} vs ${LICENSE.url}`)
  if (rights.licenseAddress !== LICENSE.address) drift.push(`address ${rights.licenseAddress} vs ${LICENSE.address}`)
  if (rights.imprint !== LICENSE.imprint) drift.push(`imprint ${rights.imprint} vs ${LICENSE.imprint}`)

  // 4. address agreement: does the unit's compute_address name a value as this tree's uuidOf does? Recorded either way.
  const probe = 'qpu'
  let unitAddress: string | null = null
  try { unitAddress = (await rpc('compute_address', { value: probe })).address ?? null } catch { unitAddress = null }
  const address = { probe, here: uuidOf(probe), unit: unitAddress, agree: unitAddress === uuidOf(probe), note: unitAddress === uuidOf(probe) ? 'the unit and this tree name the same content identically' : "this tree's uuidOf is the unit's published shapeUuidOf; the compute_address door uses a builder not in the sources this tree can read — an open lead, not a claim" }

  // 5. deposit: can qpu's own proofs be cited at the border? One hand-written kernel theorem is offered to the unit's deposit_trial
  //    each run, with its key and its exact statement; the answer or the refusal is the measurement (lead gap-theorems-unsealed).
  const ledgerPath = join(ROOT, 'docs', 'public', 'theorems.ndjson')
  const probeKey = 'clay_sigma'
  const probeRow = existsSync(ledgerPath) ? readFileSync(ledgerPath, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as { key: string; statement: string }).find((r) => r.key === probeKey) : undefined
  let deposit: { key: string; statement: string | null; deposited: boolean; answer: unknown; refusal: string | null }
  try {
    const answer = await rpc('deposit_trial', { claim: `qpu kernel theorem ${probeKey}`, deposits: [{ party: 'qpu', proof: probeKey }, ...(probeRow ? [{ party: 'qpu', proof: probeRow.statement }] : [])] })
    deposit = { key: probeKey, statement: probeRow?.statement ?? null, deposited: Boolean((answer as { deposited?: boolean }).deposited), answer, refusal: null }
  } catch (err) { deposit = { key: probeKey, statement: probeRow?.statement ?? null, deposited: false, answer: null, refusal: (err as Error).message } }

  const date = new Date().toISOString()
  const out = { license: LICENSE.attribution, date, unit: UNIT, measured: verification?.date ?? null, classes, judged, readiness, deposit, auras, address, rights: { receipt: rights.receipt, imprint: rights.imprint, licenseAddress: rights.licenseAddress, drift } }
  writeFileSync(join(ROOT, 'docs', 'public', 'readiness.json'), JSON.stringify(out, null, 1) + '\n')
  const page = ['---', 'title: Readiness', 'order: 53', '---', '', '# The unit judges the tree', '',
    `Asked of the uuidna MCP at ${UNIT} by \`npm run next\` on ${date}. The verdicts are the unit's; this tree only carries them.`, '',
    `## Release readiness: **${readiness.ready ? 'ready' : 'not ready'}**`, '', `${readiness.why}`, '', `Settled ${readiness.settled}; sources asked ${readiness.asked}, answered ${readiness.answered}; receipt \`${readiness.receipt}\`.`, '',
    '## Every lead judged by measurement', '',
    `Served ${classes.served}, refuted ${classes.refuted}, in trial ${classes.trial} of ${judged.length}. Served: a tool of this surface serves it, or the match tool serves the page's fetched title. Refuted: measured not served — the page is gone, a cleanup's subject stays absent, the surface covers too little of the page's own title to claim it, or the lead is declared out of scope. Trial: still owed. Page measurements from the verify step of ${verification?.date.slice(0, 10) ?? 'no run yet'}.`, '',
    '| Lead in trial | Status | Owes |', '|---|---|---|', ...judged.filter((x) => x.class === 'trial').map((x) => `| ${x.lead} | ${x.status} | ${x.by.replace(/\|/g, '\\|')} |`), '',
    '<details><summary>The refuted, by measurement</summary>', '', '| Lead | Status | By |', '|---|---|---|', ...judged.filter((x) => x.class === 'refuted').map((x) => `| ${x.lead} | ${x.status} | ${x.by.replace(/\|/g, '\\|')} |`), '', '</details>', '',
    '| Source | Settled | Open |', '|---|---:|---:|', ...sources.map((s) => `| ${s.source} | ${s.settled} | ${s.open.reduce((n, o) => n + Number(/^(\d+) lead/.exec(o.what)?.[1] ?? 1), 0)} |`), '',
    '## Auras', '', 'The A432-tuned colour the unit folds from each example block\'s content address (hue steps by 432/12 = 36°; artistic, not physics, in the unit\'s own words).', '',
    '| Block | Example | Hue | HSL | CMYK |', '|---|---|---:|---|---|', ...Object.entries(auras).map(([id, a]: [string, any]) => `| ${id} | ${a.example} | ${a.hue ?? '—'} | ${a.hsl ?? a.error ?? ''} | ${a.cmyk ? a.cmyk.join(', ') : ''} |`), '',
    '## Address agreement', '', `Probe \`${address.probe}\`: here ${address.here}, unit ${address.unit ?? 'no answer'} — ${address.agree ? 'agree' : 'disagree'}. ${address.note}`, '',
    '## Deposit at the border', '', deposit.refusal ? `The unit's deposit_trial refused \`${deposit.key}\` (and its exact statement) on ${date.slice(0, 10)}: ${deposit.refusal}. qpu's proofs are not citable at the border; lead gap-theorems-unsealed stays blocked on the unit's door.` : `deposit_trial answered for \`${deposit.key}\`: deposited ${deposit.deposited}; ${JSON.stringify(deposit.answer).slice(0, 400)}`, '',
    '## Rights', '', drift.length ? `Drift between the unit's rights and this tree's licence module: ${drift.join('; ')}` : `This tree's licence module matches the unit's rights (address ${rights.licenseAddress}, imprint ${rights.imprint}, receipt ${rights.receipt}).`, ''].join('\n')
  writeFileSync(join(ROOT, 'docs', 'readiness.md'), page)
  console.log(`readiness: ${readiness.ready ? 'ready' : 'not ready'} — ${readiness.why} | served ${classes.served} refuted ${classes.refuted} trial ${classes.trial} | deposit ${deposit.refusal ? 'refused' : deposit.deposited ? 'deposited' : 'answered'} | auras ${Object.keys(auras).length} | rights drift ${drift.length} | address ${address.agree ? 'agree' : 'disagree'}`)
  if (drift.length) process.exitCode = 1
}
main().catch((e) => { console.error(e); process.exit(1) })
