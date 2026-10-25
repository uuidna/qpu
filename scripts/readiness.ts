// The client of the readiness tool: it measures what only a client can (which cleanup subjects are present, the theorem
// ledger on disk, the verification and discovery of this run), asks the tool for its plan, makes the border calls and the
// unit calls the plan names against the MCP hosts, hands the answers back, and writes what the tool returns. Selftest first.
import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { handle } from '../src/quantum/mcp.ts'
import { depositOf } from '../src/quantum/coins.ts'
import { LEADS, cleanupSubjectsOf } from '../src/quantum/leads.ts'
import { LICENSE } from '../src/quantum/license.ts'
import { uuidOf } from '../src/quantum/blocks.ts'

const ROOT = process.cwd()
// the coins paid at the wire, one line per call, kept by this payer (the unit's own register is per process and silent)
const account = (door: string, body: unknown) => { const d = depositOf(door, body); appendFileSync(join(ROOT, 'docs', 'public', 'coins.ndjson'), JSON.stringify({ date: new Date().toISOString(), client: 'readiness', ...d }) + '\n') }
const UNIT = process.env.UUIDNA_MCP ?? 'https://uuidna.com/mcp'
const call = (args: Record<string, unknown>): any => { const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'readiness', arguments: args } }) as any; if (r.error) throw new Error(r.error.message); return r.result.structuredContent }
const rpc = async (url: string, name: string, args: unknown): Promise<any> => {
  const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', 'user-agent': 'uuidna-qpu-next (ceccec@psg.bg)' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }), signal: AbortSignal.timeout(60000) })
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`)
  const body = await res.json() as { result?: { structuredContent?: unknown; content?: { text: string }[]; isError?: boolean }; error?: { message: string } }
  account(name, body)
  if (body.error) throw new Error(body.error.message)
  if (body.result?.isError) throw new Error(body.result.content?.[0]?.text ?? 'the door refused without a text')
  return body.result?.structuredContent ?? (body.result?.content?.[0] ? JSON.parse(body.result.content[0].text) : body.result)
}
// the unit's answers kept a day by call address (an aura by its block id, a sequence by its value): a run asks only what is new
const cachePath = join(ROOT, 'docs', 'public', 'unit-cache.json')
const unitCache: Record<string, { at: string; answer: unknown }> = existsSync(cachePath) ? (() => { try { return JSON.parse(readFileSync(cachePath, 'utf8')) } catch { return {} } })() : {}
const cached = async (name: string, args: unknown): Promise<unknown> => { const key = `${name}${JSON.stringify(args)}`; const c = unitCache[key]; if (c && Date.now() - Date.parse(c.at) < 86_400_000) return c.answer; const answer = await rpc(UNIT, name, args); unitCache[key] = { at: new Date().toISOString(), answer }; writeFileSync(cachePath, JSON.stringify(unitCache) + '\n'); return answer }
const readJson = (name: string) => { const p = join(ROOT, 'docs', 'public', name); return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : undefined }

const main = async () => {
  const selftest = call({ selftest: true })
  console.log(`readiness selftest: ${selftest.passed ? 'pass' : 'FAIL'} (${selftest.checks.filter((c: { passed: boolean }) => c.passed).length}/${selftest.checks.length})`)
  // what only the client can measure
  const present = LEADS.flatMap((l) => { const s = cleanupSubjectsOf(l); if (!s) return []; return s.kind === 'branches' ? s.names.filter((b) => execFileSync('git', ['branch', '--list', b], { cwd: ROOT, encoding: 'utf8' }).trim() !== '') : s.names.filter((path) => existsSync(join(ROOT, path))) })
  const ledgerPath = join(ROOT, 'docs', 'public', 'theorems.ndjson')
  const ledger = existsSync(ledgerPath) ? readFileSync(ledgerPath, 'utf8').split('\n').filter(Boolean).map((l) => { const r = JSON.parse(l) as { key: string; statement: string }; return { key: r.key, statement: r.statement } }) : []
  const verification = readJson('verification.json')
  const discovery = readJson('discovery.json')
  const plan = call({ verification, discovery, present, ledger })
  // the border: every discovered door, asked
  const hostUrl = (host: string) => (discovery?.hosts as { host: string; kind: string; contract: string }[] | undefined)?.find((h) => h.host === host && h.kind === 'mcp')?.contract ?? UNIT
  const border: { door: string; host: string; arguments: Record<string, unknown>; answer?: unknown; refusal?: string }[] = []
  for (const c of plan.borderPlan as { door: string; host: string; arguments: Record<string, unknown> }[]) {
    try { border.push({ ...c, answer: await rpc(hostUrl(c.host), c.door, c.arguments) }) } catch (e) { border.push({ ...c, refusal: (e as Error).message }) }
  }
  // the unit: readiness, rights, address, auras
  const unitCalls = plan.unitPlan as { name: string; arguments: Record<string, unknown>; example?: string }[]
  const ask = async (name: string) => rpc(UNIT, name, unitCalls.find((c) => c.name === name)!.arguments)
  const readiness = await ask('check_release_readiness')
  const rights = await ask('get_rights')
  const drift: string[] = []
  if (rights.license !== LICENSE.spdx) drift.push(`spdx ${rights.license} vs ${LICENSE.spdx}`)
  if (rights.licenseUrl !== LICENSE.url) drift.push(`url ${rights.licenseUrl} vs ${LICENSE.url}`)
  if (rights.licenseAddress !== LICENSE.address) drift.push(`address ${rights.licenseAddress} vs ${LICENSE.address}`)
  if (rights.imprint !== LICENSE.imprint) drift.push(`imprint ${rights.imprint} vs ${LICENSE.imprint}`)
  let unitAddress: string | null = null
  try { unitAddress = (await ask('compute_address')).address ?? null } catch { unitAddress = null }
  const address = { probe: 'qpu', here: uuidOf('qpu'), unit: unitAddress, agree: unitAddress === uuidOf('qpu'), note: unitAddress === uuidOf('qpu') ? 'the unit and this tree name the same content identically' : "this tree's uuidOf is the unit's published shapeUuidOf; the compute_address door uses a builder not in the sources this tree can read — an open lead, not a claim" }
  const auras: Record<string, unknown> = {}
  for (const c of unitCalls.filter((x) => x.name === 'compute_aura')) { const id = String(c.arguments.subject); try { auras[id] = { example: c.example, ...(await cached('compute_aura', c.arguments) as object) } } catch (err) { auras[id] = { example: c.example, error: (err as Error).message } } }
  // the metaphysical doors: the unit's vortex reflection against the tree's, its triad, and the tree's block addresses on its double torus
  const door = async (name: string) => { try { return await ask(name) } catch (e) { return { refusal: (e as Error).message } } }
  const vortex = { reflection: await door('get_vortex_reflection'), triad: await door('get_triad'), doubleTorus: await door('compute_double_torus') }
  // the Clay register through the unit's sequence door: every distinct value asked, the clay tool compares the two readings
  const clayAnswers: { value: number; answer?: unknown; refusal?: string }[] = []
  for (const c of unitCalls.filter((x) => x.name === 'run_sequence')) { try { clayAnswers.push({ value: Number(c.arguments.input), answer: await cached('run_sequence', c.arguments) }) } catch (e) { clayAnswers.push({ value: Number(c.arguments.input), refusal: (e as Error).message }) } }
  const clayRead = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'clay', arguments: { technique: 'reflection', unit: clayAnswers } } }) as { result?: { structuredContent: { unitAsked: number; unitAgree: number; unitDisagree: number; unitRefused: number; pairsCount: number; fixedCount: number; tunedCount: number; leads: { id: string; statement: string; status: string; reason: string }[] } } }
  const clay = clayRead.result?.structuredContent ?? null
  if (clay?.leads.length) { const docket = join(ROOT, 'docs', 'public', 'next-leads.json'); const previous = existsSync(docket) ? JSON.parse(readFileSync(docket, 'utf8')) as { id: string }[] : []; const fresh = clay.leads.filter((l) => !previous.some((p) => p.id === l.id)).map((l) => ({ ...l, source: 'uuidna.com/mcp run_sequence', evidence: 'clay technique: reflection', head: '', date: new Date().toISOString() })); if (fresh.length) writeFileSync(docket, JSON.stringify([...previous, ...fresh], null, 1) + '\n') }
  const unit = { vortex, readiness, auras, rights: { receipt: rights.receipt, imprint: rights.imprint, licenseAddress: rights.licenseAddress, drift }, address }
  const judged = call({ verification, discovery, present, ledger, border, unit, unitUrl: UNIT })
  const date = new Date().toISOString()
  writeFileSync(join(ROOT, 'docs', 'public', 'readiness.json'), JSON.stringify({ license: LICENSE.attribution, date, unit: UNIT, selftest: { passed: selftest.passed }, measured: verification?.date ?? null, discovered: discovery?.date ?? null, classes: judged.classes, judged: judged.judged, readiness, vortex, clay: clay ? { asked: clay.unitAsked, agree: clay.unitAgree, disagree: clay.unitDisagree, refused: clay.unitRefused, pairs: clay.pairsCount, fixed: clay.fixedCount, tuned: clay.tunedCount, leads: clay.leads } : null, border: { key: judged.probe.key, statement: judged.probe.statement, doors: judged.border, sealedBy: judged.sealedByDoors }, auras, address, rights: unit.rights }, null, 1) + '\n')
  writeFileSync(join(ROOT, 'docs', 'readiness.md'), judged.page)
  console.log(`readiness: ${readiness.ready ? 'ready' : 'not ready'} — ${readiness.why} | served ${judged.served} refuted ${judged.refuted} trial ${judged.trial} | border ${judged.border.length} door(s), sealed by ${judged.sealedBy} | vortex ${(vortex.reflection as { involution?: boolean }).involution === true ? 'agrees' : 'differs or unreached'} | clay ${clay ? `${clay.unitAgree}/${clay.unitAsked} agree, ${clay.unitRefused} refused` : 'unread'} | torus ${(vortex.doubleTorus as { root?: string }).root ? 'rooted' : 'unreached'} | auras ${Object.keys(auras).length} | rights drift ${drift.length} | address ${address.agree ? 'agree' : 'disagree'}`)
  if (drift.length) process.exitCode = 1
}
main().catch((e) => { console.error(e); process.exit(1) })
