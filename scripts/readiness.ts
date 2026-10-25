// The unit judges the tree: each run asks the uuidna MCP at its canonical edge for the release-readiness verdict on this
// tree's lead sources, the A432 aura of every example block, and the current rights facts, and records each answer with
// its receipt. The handler stays pure; this script is the client. Network; skipped by `next --offline`.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { handle } from '../src/quantum/mcp.ts'
import { EXAMPLES } from '../src/quantum/examples.ts'
import { LEADS } from '../src/quantum/leads.ts'
import { LICENSE } from '../src/quantum/license.ts'
import { uuidOf } from '../src/quantum/blocks.ts'

const ROOT = process.cwd()
const UNIT = process.env.UUIDNA_MCP ?? 'https://uuidna.com/mcp'
const rpc = async (name: string, args: unknown): Promise<any> => {
  const res = await fetch(UNIT, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', 'user-agent': 'uuidna-qpu-next (ceccec@psg.bg)' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }), signal: AbortSignal.timeout(60000) })
  const body = await res.json() as { result?: { structuredContent?: unknown; content?: { text: string }[] }; error?: { message: string } }
  if (body.error) throw new Error(body.error.message)
  return body.result?.structuredContent ?? (body.result?.content?.[0] ? JSON.parse(body.result.content[0].text) : body.result)
}

const main = async () => {
  // 1. readiness: the tree's lead sources, each with what it settled and what it still owes, grouped by reason (nothing dropped)
  const byHost = new Map<string, { source: string; settled: number; open: { what: string; owes: string }[] }>()
  for (const l of LEADS) {
    const host = (/^(?:https?:\/\/)?([a-z0-9.-]+\.[a-z]{2,})/i.exec(l.source) ?? [])[1] ?? l.source.split(/[,/ ]/)[0] ?? 'other'
    const s = byHost.get(host) ?? { source: host, settled: 0, open: [] }
    if (l.status === 'served') s.settled += 1
    else s.open.push({ what: `${l.id}: ${l.statement}`, owes: l.reason ?? l.status })
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

  const date = new Date().toISOString()
  const out = { license: LICENSE.attribution, date, unit: UNIT, readiness, auras, address, rights: { receipt: rights.receipt, imprint: rights.imprint, licenseAddress: rights.licenseAddress, drift } }
  writeFileSync(join(ROOT, 'docs', 'public', 'readiness.json'), JSON.stringify(out, null, 1) + '\n')
  const page = ['---', 'title: Readiness', 'order: 53', '---', '', '# The unit judges the tree', '',
    `Asked of the uuidna MCP at ${UNIT} by \`npm run next\` on ${date}. The verdicts are the unit's; this tree only carries them.`, '',
    `## Release readiness: **${readiness.ready ? 'ready' : 'not ready'}**`, '', `${readiness.why}`, '', `Settled ${readiness.settled}; sources asked ${readiness.asked}, answered ${readiness.answered}; receipt \`${readiness.receipt}\`.`, '',
    '| Source | Settled | Open |', '|---|---:|---:|', ...sources.map((s) => `| ${s.source} | ${s.settled} | ${s.open.reduce((n, o) => n + Number(/^(\d+) lead/.exec(o.what)?.[1] ?? 1), 0)} |`), '',
    '## Auras', '', 'The A432-tuned colour the unit folds from each example block\'s content address (hue steps by 432/12 = 36°; artistic, not physics, in the unit\'s own words).', '',
    '| Block | Example | Hue | HSL | CMYK |', '|---|---|---:|---|---|', ...Object.entries(auras).map(([id, a]: [string, any]) => `| ${id} | ${a.example} | ${a.hue ?? '—'} | ${a.hsl ?? a.error ?? ''} | ${a.cmyk ? a.cmyk.join(', ') : ''} |`), '',
    '## Address agreement', '', `Probe \`${address.probe}\`: here ${address.here}, unit ${address.unit ?? 'no answer'} — ${address.agree ? 'agree' : 'disagree'}. ${address.note}`, '',
    '## Rights', '', drift.length ? `Drift between the unit's rights and this tree's licence module: ${drift.join('; ')}` : `This tree's licence module matches the unit's rights (address ${rights.licenseAddress}, imprint ${rights.imprint}, receipt ${rights.receipt}).`, ''].join('\n')
  writeFileSync(join(ROOT, 'docs', 'readiness.md'), page)
  console.log(`readiness: ${readiness.ready ? 'ready' : 'not ready'} — ${readiness.why} | auras ${Object.keys(auras).length} | rights drift ${drift.length} | address ${address.agree ? 'agree' : 'disagree'}`)
  if (drift.length) process.exitCode = 1
}
main().catch((e) => { console.error(e); process.exit(1) })
