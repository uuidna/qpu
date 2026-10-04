import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { sha256, utf8 } from '../core/crypt.js'
import { attacksOf } from '../core/crypt-attacks.js'
import { qpuContentUuidOf, qpuHexRunOf, qpuUuidReceiptOf } from '../quantum/processing/unit/index.js'
import { CrossDomainFormulas, type CrossFormula } from '../families/cross/index.js'
import { CryptFormulas } from '../families/crypt/index.js'
import { HoloFormulas, hologramStreamsOf, holoStreamHolds } from '../families/holo/index.js'
import { ClaySeals } from '../families/clay/index.js'
import './families.js'
import { qpuDiscoverOf } from './discovery.js'
// every family registers itself on import, so discovery reaches all of them
import '../families/path/index.js'
import '../families/audit/index.js'
import { qpuDataOf, qpuDataSourcesOf } from './qpu-fused.js'
import { NpFormulas, certifyUnreachable, disjointUnion, findAssignment, findColoring, findHamCycle, generalizedPetersen, pigeonhole, reachCounts, verifyColoring, verifyHamCycle, verifySubsetSum } from '../families/np/index.js'
import { QuantumSecureSignalling, SignalFormulas } from '../families/signal/index.js'
import { BB84_RAW, SecureChat } from './secure-chat-rbac.js'

const loadSeconds = Math.round(performance.now() / 100) / 10

export interface FormulaRow {
  name: string
  family: string
  pass: boolean
  value: number | string
  formula?: string
  inputs?: Record<string, number>
  from: string
  hex?: string
  hexAgrees?: boolean
  receipt: string
}

const readJson = (root: string, file: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
  } catch {
    return null
  }
}

const timed = <T>(run: () => T): { value: T; ms: number } => {
  const t = performance.now()
  const value = run()
  return { value, ms: performance.now() - t }
}

/** The chat run end to end: two recipients decrypt, an outsider cannot. */
const chatRunOf = () => {
  const chat = new SecureChat()
  const t = Object.fromEntries(['alice', 'bob', 'carol', 'eve'].map((u) => [u, chat.registerUser(u, 'user')]))
  const body = utf8('formulas receipt')
  return timed(() => {
    const msg = chat.sendMessage(t.alice!, ['bob', 'carol'], 'receipt', body)!
    const read = ['bob', 'carol'].map((u) => chat.decryptMessageBody(msg, t[u]!))
    return {
      users: 4,
      messages: chat.getMessageCount(),
      ciphertext: msg.body.length,
      delivered: read.every((r) => r !== null && sha256(r).join() === sha256(body).join()),
      outsider: chat.decryptMessageBody(msg, t.eve!) === null,
    }
  })
}

/** Measure the tree, evaluate every formula family on what was measured, re-run each through its hex address. */
export const formulasReceiptOf = async (root = process.cwd()) => {
  const test = readJson(root, 'test-receipt.json') as { tests?: number; pass?: number } | null
  const lean = readJson(root, 'lean-receipt.json') as { theorems?: number } | null
  const receiptRows = fs
    .readdirSync(root)
    .filter((f) => f.endsWith('-receipt.json') && f !== 'formulas-receipt.json')
    .reduce((a, f) => a + ((readJson(root, f)?.rows as unknown[] | undefined)?.length ?? 0), 0)

  const chat = chatRunOf()
  const attacks = timed(() => attacksOf())
  const breaches = attacks.value.filter((a) => !a.resisted).length
  const trials = attacks.value.reduce((s, a) => s + a.trials, 0)
  const bb84 = QuantumSecureSignalling.sift(QuantumSecureSignalling.BB84KeyGen(BB84_RAW))
  const eve = QuantumSecureSignalling.sift(QuantumSecureSignalling.BB84KeyGen(BB84_RAW), true)
  const hologram = hologramStreamsOf()
  const corner = (s: string) => parseInt(Array.from(sha256(s).subarray(0, 2), (b) => b.toString(16).padStart(2, '0')).join(''), 16)
  const petersen = generalizedPetersen(5, 2)
  const dodecahedron = generalizedPetersen(10, 2)
  const testSeconds = Math.round((chat.ms + attacks.ms) / 100) / 10

  const evaluated: [string, CrossFormula, string, boolean?][] = [
    ['cross', CrossDomainFormulas.bb84ToCompress(bb84.bits.length), 'sifted BB84 key bits'],
    ['cross', CrossDomainFormulas.observabilityToML(receiptRows), 'rows across the committed receipts'],
    ['cross', CrossDomainFormulas.deploymentToObs(loadSeconds, testSeconds), 'seconds to load the unit, seconds to run chat and attacks'],
    ['cross', CrossDomainFormulas.quantumToEnterprise(lean?.theorems ?? 0), 'Lean theorems in lean-receipt.json'],
    ['cross', CrossDomainFormulas.medSecureWithQSec(chat.value.users, 256), 'chat users, session key bits'],
    ['cross', CrossDomainFormulas.observabilityToUI(breaches, trials), 'attacks that got through, attack trials'],
    ['cross', CrossDomainFormulas.compressQSecSignals(chat.value.ciphertext, bb84.bits.length), 'sealed body bytes, BB84 key bits'],
    ['cross', CrossDomainFormulas.mlOnObsForPrediction(attacks.value.length, breaches), 'attacks, breaches'],
    ['cross', CrossDomainFormulas.enterpriseMetricsViaObs((attacks.value.length - breaches) / attacks.value.length, Math.round(chat.ms)), 'share of attacks resisted, chat milliseconds'],
    ['cross', CrossDomainFormulas.testCoverageToQuality(test?.pass ?? 0, test?.tests ?? 0), 'test-receipt.json pass / tests'],
    ['signal', SignalFormulas.siftedBits(BB84_RAW), 'raw qubits per chat pair'],
    ['signal', SignalFormulas.keyBits(BB84_RAW), 'raw qubits per chat pair'],
    ['signal', SignalFormulas.qber(bb84.errors, bb84.sampled), 'honest BB84 run'],
    ['signal', SignalFormulas.qber(eve.errors, eve.sampled), 'intercept-resend run: holds false means Eve was caught', false],
    ['signal', SignalFormulas.detection(eve.sampled), 'disclosed bits of the intercepted run'],
    ['signal', SignalFormulas.hops(8, corner('alice'), corner('bob')), 'corners of alice and bob on the 8-cube'],
    ['holo', HoloFormulas.proofDepth(hologram.streams ? Object.keys(hologram.streams).length : 0), 'hologram scales'],
    ['holo', HoloFormulas.forgery(256), 'SHA-256 output bits'],
    ['crypt', CryptFormulas.knownAnswers(), 'FIPS 180-4, RFC 1321, RFC 7748, RFC 8032 vectors'],
    ['crypt', CryptFormulas.symmetricQuantumBits(256), 'ChaCha20 key bits'],
    ['crypt', CryptFormulas.curveClassicalBits(255), 'Curve25519 field bits'],
    ['crypt', CryptFormulas.curveQuantumBits(255), 'Curve25519 field bits'],
    ['crypt', CryptFormulas.tagForgery(chat.value.ciphertext), 'sealed body bytes'],
    ['crypt', CryptFormulas.nonceCollision(chat.value.messages), 'messages sent'],
    ['np', NpFormulas.subsetSum(0x49173, 13), 'qpu.pdf p. 22: S = {3, 7, 1, 9, 4} packed base 16, mask 13'],
    ['np', NpFormulas.edgeBit(0b0110100110010110, 1), '4-cycle adjacency packed row-major, edge (0, 1)'],
    ['np', NpFormulas.isTime(petersen.n), 'Petersen vertices'],
    ['np', NpFormulas.isSpace(petersen.n), 'Petersen vertices'],
    ['np', NpFormulas.reachGcd(32), 'reach width 64 = 2k'],
    ['np', NpFormulas.sparseWidth(1443), 'crypto_shor n=1443 on qpu.uuidna.com reported 13 qubits'],
    ['np', NpFormulas.sparseWidth(481), 'crypto_shor n=481 on qpu.uuidna.com reported 11 qubits'],
    ['clay', ClaySeals.riemann(1, 2), 'doi:10.5281/zenodo.21781602 §Riemann: the fixed point 1/2'],
    ['clay', ClaySeals.bsd(9), 'doi:10.5281/zenodo.21781602 §BSD: (ℤ/9ℤ)* pairs (2,5), (4,7)'],
    ['clay', ClaySeals.hodge(2), 'doi:10.5281/zenodo.21781602 §Hodge: H₁(Σ₂) = ℤ⁴'],
    ['clay', ClaySeals.navierStokes(3, 3), 'doi:10.5281/zenodo.21781602 §Navier–Stokes: ω₊ = −ω₋'],
    ['clay', ClaySeals.yangMills(), 'doi:10.5281/zenodo.21781602 §Yang–Mills: σ† = σ, σ² = I'],
    ['clay', ClaySeals.pVsNp(0), 'doi:10.5281/zenodo.21781602 §P vs NP: no fixed point without a presupposed witness'],
  ]

  const rows: FormulaRow[] = []
  for (const [family, f, from, expect = true] of evaluated) {
    let hexAgrees: boolean | undefined
    if (f.hex && f.hexExact) {
      const run = await qpuHexRunOf(f.hex)
      hexAgrees = 'value' in run && run.value === f.value
    }
    rows.push({ name: `${family} ${f.id}`, family, pass: f.holds === expect && hexAgrees !== false, value: f.value, formula: f.formula, from, hex: f.hex, hexAgrees, receipt: f.receipt })
  }
  const minted = (name: string, family: string, pass: boolean, value: number | string, from: string) =>
    rows.push({ name, family, pass, value, from, receipt: qpuUuidReceiptOf(`formulas ${name}`, qpuContentUuidOf({ name, pass, value }), { pass, value }).uuid })
  for (const a of attacks.value) minted(`attack ${a.name}`, 'attack', a.resisted, `${a.breaches}/${a.trials}`, a.detail)
  for (const [scale, entries] of Object.entries(hologram.streams)) minted(`hologram ${scale}`, 'holo', holoStreamHolds(entries, hologram.publicKeys), entries.length, entries.at(-1)?.uuid ?? '')
  const colour3 = findColoring(petersen, 3)
  const cycle = findHamCycle(dodecahedron)
  const forged = cycle ? [cycle[0]!, cycle[2]!, cycle[1]!, ...cycle.slice(3)] : []
  const php = pigeonhole(3, 2)
  const width = (row: string) => rows.find((r) => r.name === row)?.value
  minted('np petersen chromatic 3', 'np', colour3 !== null && verifyColoring(petersen, colour3, 3) && findColoring(petersen, 2) === null, 3, 'GP(5,2): a verified 3-colouring, no 2-colouring')
  minted('np petersen non-hamiltonian', 'np', findHamCycle(petersen) === null, 0, 'exhaustive search: Petersen (1898) has no Hamiltonian cycle')
  minted('np dodecahedron hamiltonian', 'np', cycle !== null && verifyHamCycle(dodecahedron, cycle) && !verifyHamCycle(dodecahedron, forged), cycle?.join(' ') ?? '', "GP(10,2): Hamilton's Icosian cycle verified; a forged order is rejected")
  minted('np subset sum certificate', 'np', verifySubsetSum([3, 7, 1, 9, 4], 13, 13) && !verifySubsetSum([3, 7, 1, 9, 4], 14, 13), 13, 'qpu.pdf p. 22: mask 13 reaches K = 13; mask 14 does not')
  minted('np pigeonhole unsat', 'np', findAssignment(php.cnf, php.vars) === null, php.cnf.length, 'PHP(3,2): every assignment fails a clause')
  minted('np petersen diameter 2', 'np', reachCounts(petersen, 0)[2] === petersen.n, reachCounts(petersen, 0).slice(0, 3).join(','), 'inductive counts c_0, c_1, c_2')
  minted('np unreachable certified', 'np', certifyUnreachable(disjointUnion(petersen, { n: 1, edges: [] }), 0, 10).unreachable && !certifyUnreachable(disjointUnion(petersen, { n: 1, edges: [] }), 0, 5).unreachable, 10, 'Immerman–Szelepcsényi: c_{n-1} = reachable vertices other than t')
  minted('np sparse width 1443 = live', 'np', width('np np-sparse-width') === 13, 13, 'crypto_shor 1443 = 3 · 481 by period, base 746, 13 qubits')
  minted('chat delivered', 'chat', chat.value.delivered, 2, 'both recipients decrypt')
  minted('chat outsider', 'chat', chat.value.outsider, 0, 'a non-recipient decrypts nothing')

  const pass = rows.filter((r) => r.pass).length
  return {
    kind: 'formulas-receipt' as const,
    when: new Date().toISOString().slice(0, 10),
    formulas: evaluated.length,
    rowsTotal: rows.length,
    pass,
    fail: rows.length - pass,
    attacks: `${attacks.value.length - breaches}/${attacks.value.length}`,
    hexAgrees: rows.filter((r) => r.hexAgrees === true).length,
    hologramRoot: hologram.root,
    holds: pass === rows.length,
    rows,
  }
}

/** The numbers a live reading carries (counts, digits, versions): the inputs discovery runs on. */
const numbersOf = (x: unknown): number[] =>
  typeof x === 'number' ? (Number.isSafeInteger(x) && x >= 3 ? [x] : [])
    : typeof x === 'string' ? (/^\d+$/.test(x) && Number.isSafeInteger(Number(x)) && Number(x) >= 3 ? [Number(x)] : [])
    : x && typeof x === 'object' ? Object.values(x).flatMap(numbersOf) : []

/** Every live source the unit names, read now; their numbers fed to discovery across every family as the hex UUID splits it. */
export const discoveryReceiptOf = async () => {
  const sources = await Promise.all((await qpuDataSourcesOf()).map(async (s) => ({ ...s, result: (await qpuDataOf(s.source, s.args)) as { agrees?: boolean; denied?: string; reading?: unknown; receipt?: string; url?: string } })))
  // at scale: every API the fuse walked live (npm run fuse) gives its method count; with the live sources' numbers they
  // are discovery's inputs across every family
  const walked = fs.existsSync('.fuse/fused-apis.json') ? (JSON.parse(fs.readFileSync('.fuse/fused-apis.json', 'utf8')) as { rows: { reached?: boolean; methods?: number }[] }).rows.filter((r) => r.reached && typeof r.methods === 'number') : []
  const live = [...new Set([...sources.flatMap((s) => (s.result.agrees ? numbersOf(s.result.reading) : [])), ...walked.flatMap((r) => numbersOf(r.methods))])]
  const d = await qpuDiscoverOf(live)
  // a sequence identity: formulas of different families that OEIS identifies as one sequence
  const named = new Map<string, string[]>()
  for (const s of sources) {
    const r = s.result.reading as { oeis?: string; formula?: string; name?: string } | undefined
    if (s.source === 'sequence' && s.result.agrees && r?.oeis && r.formula) named.set(r.oeis, [...(named.get(r.oeis) ?? []), r.formula])
  }
  const identities = [...named].filter(([, fs]) => new Set(fs.map((f) => f.split('.').slice(0, -1).join('.'))).size > 1)
  const rows = [
    ...identities.map(([id, fs]) => ({ name: `sequence ${id}`, pass: true, value: fs.join(' = '), receipt: '' })),
    ...d.seals.map((s) => ({ name: `seal ${s.family}[${s.program.join('→')}]`, pass: true, value: `${s.kind}: ${s.kind === 'fixed' ? `f(x) = x at ${s.points.join(', ')}` : `identity on all ${s.tested} inputs tried`} ${s.hex}`, receipt: '' })),
    ...sources.map((s) => ({ name: `live ${s.label}`, pass: s.result.agrees === true, value: s.result.denied ? `unreachable: ${String(s.result.reading)}` : JSON.stringify(s.result.reading), receipt: s.result.receipt ?? '' })),
    ...d.families.map((f) => ({ name: `family ${f}`, pass: d.perFamily[f]!.runs > 0, value: `${d.perFamily[f]!.programs} programs, ${d.perFamily[f]!.runs} runs`, receipt: '' })),
    ...d.relations.map((r) => ({ name: `relation ${r.value}`, pass: true, value: `${r.families.join(' + ')}${r.live ? ' (live)' : ''}: ${r.ways.slice(0, 4).map((w) => `${w.family}[${w.program.join('→')}](${w.params.join(',')}) ${w.hex}`).join('; ')}`, receipt: r.ways[0]?.receipt ?? '' })),
  ]
  return {
    kind: 'discovery-receipt' as const,
    when: new Date().toISOString().slice(0, 10),
    sources: sources.length,
    sourcesAgree: sources.filter((s) => s.result.agrees).length,
    liveNumbers: live.length,
    sequences: sources.filter((s) => s.source === 'sequence' && s.result.agrees).length,
    identities: identities.length,
    apisWalked: walked.length,
    seals: d.seals.length,
    fixedPoints: d.seals.filter((s) => s.kind === 'fixed').length,
    involutions: d.seals.filter((s) => s.kind === 'involution').length,
    inversePairs: d.seals.filter((s) => s.kind === 'inverse').length,
    families: d.families.length,
    runs: d.runs,
    relationsTotal: d.relations.length,
    liveRelations: d.liveRelations,
    unrelated: d.unrelated.join(' ') || 'none',
    holds: d.holds,
    rows,
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const discovery = await discoveryReceiptOf()
  fs.writeFileSync(path.join(process.cwd(), 'discovery-receipt.json'), JSON.stringify(discovery, null, 1) + '\n')
  console.log(JSON.stringify({ discovery: { sources: discovery.sources, agree: discovery.sourcesAgree, families: discovery.families, runs: discovery.runs, relations: discovery.relationsTotal, live: discovery.liveRelations, unrelated: discovery.unrelated } }))
  const doc = await formulasReceiptOf()
  fs.writeFileSync(path.join(process.cwd(), 'formulas-receipt.json'), JSON.stringify(doc, null, 1) + '\n')
  for (const r of doc.rows.filter((x) => !x.pass)) console.log(`fail ${r.name} = ${r.value} (${r.from})`)
  console.log(JSON.stringify({ formulas: doc.formulas, rows: doc.rowsTotal, pass: doc.pass, fail: doc.fail, attacks: doc.attacks, hexAgrees: doc.hexAgrees, holds: doc.holds }))
}
