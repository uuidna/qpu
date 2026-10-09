/**
 * Operate the public surface once — print friction, exit non-zero on hard fails.
 * node --import tsx scripts/use-surface.mts
 */
import { performance } from 'node:perf_hooks'
import * as node from 'node:crypto'
import '../src/mcp/families.js'

const t0 = performance.now()
const log = (label: string, obj: unknown) => {
  const s = typeof obj === 'string' ? obj : JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
  console.log(`\n== ${label} ==\n${s.length > 1400 ? `${s.slice(0, 1400)}…` : s}`)
}

const main = async () => {
  const { connectorAnswerOf } = await import('../src/payload/plugins/permaculture.ts')
  const { gateCourtOf, discoverCapacityGateOf, connectBillGateOf, gateCourtTrialOf } = await import(
    '../src/payload/plugins/gate-court.ts'
  )
  const { priceRelationOf } = await import('../src/payload/plugins/price-relation.ts')
  const { modeAccessOf } = await import('../src/payload/plugins/access-mode.ts')
  const { qpuMcpToolsListOf } = await import('../src/quantum/processing/unit/index.ts')
  const { scrypt, pbkdf2Sha512, checkPrime, randomInt, hexOf, ed25519Sign, ed25519Verify, ed25519PublicKey, randomBytes } =
    await import('../src/core/crypt.ts')

  const gaps: string[] = []

  const tools = qpuMcpToolsListOf()
  const bytes = JSON.stringify({ resultType: 'complete', tools }).length
  const bill = { doors: tools.length, bytes, under16384: bytes < 16384, qpu_: tools.filter((t) => t.name.startsWith('qpu_')).length }
  log('tools/list bill', { ...bill, names: tools.map((t) => t.name) })
  if (!bill.under16384 || bill.qpu_ > 0 || bill.doors > 16) gaps.push(`connect bill fails: ${JSON.stringify(bill)}`)

  const base = await connectorAnswerOf({})
  log('connector {}', {
    kind: (base as { kind?: string }).kind,
    url: (base as { url?: string }).url,
    hasCourt: !!(base as { court?: unknown }).court,
    access: (base as { access?: unknown }).access,
    use: (base as { use?: unknown }).use,
  })
  if (!(base as { access?: { via?: string } }).access?.via) gaps.push('connector {} missing access.via')
  if (!(base as { use?: { via?: string } }).use?.via) gaps.push('connector {} missing use.via')

  const use = (await connectorAnswerOf({ use: true })) as Record<string, unknown>
  log('connector { use: true }', {
    kind: use.kind,
    goal: use.goal,
    holds: use.holds,
    bill: use.connectBill,
    fusedConnector: (use.fused as { connector?: boolean } | undefined)?.connector,
    first: (use.perplexity as { first_calls?: string[] } | undefined)?.first_calls?.slice(0, 3),
    notCount: Array.isArray(use.not) ? use.not.length : 0,
  })
  if (use.kind !== 'connector-use') gaps.push(`use:true kind=${use.kind}`)
  if (use.goal !== 'OPEN') gaps.push('use:true flipped goal away from OPEN')
  if (use.holds !== true) gaps.push('use:true holds false')
  if ((use.fused as { connector?: boolean } | undefined)?.connector !== true) {
    gaps.push('use:true fused.connector false — families/fuse not registered')
  }

  const courtT0 = performance.now()
  const court = gateCourtOf()
  const courtMs = Math.round(performance.now() - courtT0)
  log('gateCourtOf', {
    ms: courtMs,
    held: court.held,
    of: court.of,
    stable: court.stable,
    holds: court.holds,
    cases: court.cases.map((c) => ({
      case: c.case,
      allow: c.allow,
      holds: c.holds,
      conf: c.confidence,
      trial: c.trial.call,
      hex: c.trial.hex,
      fidelity: c.fidelity.value,
      standing: (c as { standing?: { value: number } }).standing?.value,
      ms: (c as { ms?: number }).ms,
    })),
  })
  if (!court.stable) gaps.push('court not stable (fidelity re-trial)')
  if (!(court as { ms?: number }).ms && courtMs >= 0 && !(court.cases[0] as { ms?: number } | undefined)?.ms) {
    gaps.push('trial diagnostics missing ms on cases')
  }
  if (!('combinations' in court)) gaps.push('court missing combinatorics of cases')
  if (!('execute' in court) && !court.cases.some((c) => c.case.includes('access.execute') || c.case.includes('unix'))) {
    gaps.push('no unix execute trial case')
  }

  log('discover.capacity', discoverCapacityGateOf())
  log('connect.bill gate', connectBillGateOf())

  for (const mode of [0, 4, 5, 7] as const) {
    const a = modeAccessOf({ mode, who: 'other' })
    log(`access mode ${mode}`, { decides: a.decides, symbolic: a.unix.mode.symbolic, holds: a.holds })
  }
  const xOff = modeAccessOf({ mode: 4, who: 'other' }) // r--
  if (xOff.decides.execute) gaps.push('mode 4 (r--) should deny execute')
  const xOn = modeAccessOf({ mode: 5, who: 'other' }) // r-x
  if (!xOn.decides.execute) gaps.push('mode 5 (r-x) should allow execute')

  const price = priceRelationOf({ shots: 1024, batches: 1, vendorIndex: 0, mode: 5, sealIndex: 0 })
  log('priceRelationOf', {
    holds: price.holds,
    measure: price.measure,
    bare: price.bare,
    courtHolds: price.court.holds,
    fidelity: price.court.fidelity.value,
    standard: price.court.standard.value,
    standing: price.court.standing.value,
    legs: price.legs.map((l) => `${l.address}=${l.value}${l.holds ? '✓' : '✗'}`),
  })

  const sealT0 = performance.now()
  const seal = (await connectorAnswerOf({ pass: 0 })) as Record<string, unknown>
  log('seal pass 0', {
    ms: Math.round(performance.now() - sealT0),
    kind: seal.kind,
    name: seal.name,
    held: seal.held,
    involutive: seal.involutive,
    discover: seal.discover,
    capacity: seal.capacity,
  })
  if (seal.discover === 'full-registry') gaps.push('pass 0 used full-registry discover')

  const sealAll = (await connectorAnswerOf({ seal: true })) as Record<string, unknown>
  log('seal:true', {
    kind: sealAll.kind,
    waveCount: Array.isArray(sealAll.waves) ? sealAll.waves.length : 0,
    capacity: sealAll.capacity,
    holds: sealAll.holds,
  })

  const adapters = (await connectorAnswerOf({ adapters: true })) as Record<string, unknown>
  const sealMeta = adapters.seal as { fullDiscover?: string; capacity?: unknown; note?: string } | undefined
  log('adapters', {
    kind: adapters.kind,
    count: adapters.count,
    bill: adapters.connectBill,
    sealNote: sealMeta?.note,
    hasFullDiscoverProse: typeof sealMeta?.fullDiscover === 'string',
    court: adapters.court
      ? {
          billAllow: (adapters.court as { bill?: { allow?: boolean } }).bill?.allow,
          path: (adapters.court as { capacity?: { path?: string } }).capacity?.path,
        }
      : null,
    holds: adapters.holds,
  })
  if (sealMeta?.fullDiscover) gaps.push('adapters still expose fullDiscover OOM prose')

  // court:true connector path
  const viaCourt = (await connectorAnswerOf({ court: true })) as Record<string, unknown>
  log('connector { court: true }', {
    kind: viaCourt.kind,
    held: viaCourt.held,
    of: viaCourt.of,
    stable: viaCourt.stable,
  })
  if (viaCourt.kind !== 'gate-court') gaps.push(`court:true kind=${viaCourt.kind}`)

  // trial alias
  const viaTrial = (await connectorAnswerOf({ trial: true })) as Record<string, unknown>
  log('connector { trial: true }', { kind: viaTrial.kind, error: viaTrial.error ?? null })
  if (viaTrial.kind !== 'gate-court') gaps.push('connector { trial: true } not wired')

  // crypto
  try {
    const s = scrypt('password', 'salt', 32, { N: 16, r: 1, p: 1 })
    const ns = node.scryptSync('password', 'salt', 32, { N: 16, r: 1, p: 1, maxmem: 64 * 1024 * 1024 })
    const match = hexOf(s) === ns.toString('hex')
    log('scrypt parity', { match, qpu: hexOf(s), node: ns.toString('hex') })
    if (!match) gaps.push('scrypt parity fail')
  } catch (e) {
    gaps.push(`scrypt threw: ${(e as Error).message}`)
  }
  try {
    const p512 = pbkdf2Sha512('p', 's', 2, 32)
    const n512 = node.pbkdf2Sync('p', 's', 2, 32, 'sha512')
    const match = hexOf(p512) === n512.toString('hex')
    log('pbkdf2-sha512', { match })
    if (!match) gaps.push('pbkdf2-sha512 parity fail')
  } catch (e) {
    gaps.push(`pbkdf2Sha512 threw: ${(e as Error).message}`)
  }
  const seed = randomBytes(32)
  const pub = ed25519PublicKey(seed)
  const sig = ed25519Sign(seed, new Uint8Array([1, 2, 3]))
  if (!ed25519Verify(pub, new Uint8Array([1, 2, 3]), sig)) gaps.push('ed25519 verify fail')
  log('primes/randomInt', { p17: checkPrime(17), r: randomInt(1, 10) })

  // empty gate trial experience
  const empty = gateCourtTrialOf({
    case: 'probe.empty',
    gate: { call: 'probe', name: 'probe', params: [], hex: null, value: 0, holds: false, rawNext: 'absent' },
  })
  log('empty gate trial shape', Object.keys(empty).sort())

  console.log('\n== GAPS ==')
  for (const g of gaps) console.log('-', g)
  console.log('ELAPSED_MS', Math.round(performance.now() - t0))
  console.log('GAP_COUNT', gaps.length)
  if (gaps.length) process.exitCode = 1
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
