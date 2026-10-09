import { permaTrinityOf } from '../../families/perma/index.js'
import { ContractFormulas } from '../../families/contract/index.js'
import { EvidenceFormulas } from '../../families/evidence/index.js'
import { LawFormulas } from '../../families/law/index.js'
import {
  qpuFacesOf,
  qpuHarnessesOf,
  qpuManOf,
  qpuMcpFusedOf,
  qpuMcpToolsListOf,
  qpuRecognizeOf,
  qpuStandardsOf,
} from '../../quantum/processing/unit/index.js'
import { qpuTenantZoneOf } from '../../quantum/processing/unit/presentation.js'
import { usageBillOf } from './billing.js'
import { openMathScaleOf } from './clay.js'
import { domainReadingsOf } from './domains.js'
import { postQuantumUpgradeOf } from './upgrade.js'
import { payloadLeadsOf } from './leads.js'
import { pointOf } from './point.js'
import { waveSweepGridOf } from './wave.js'
import type { QpuPlugin } from './surface.js'

/**
 * perma.family is a commercial client of this unit, not a second app. A tenant under the zone is one label
 * (qpuTenantZoneOf): the slug is the family name `perma`. The client name carries a dot, so it is not itself a
 * zone label. The bill is the usage meter. The margin place stays empty. The prize is not this bill.
 */
const SLUG = 'perma'

/** The connectors qpuHarnessesOf already names, each checked by that function. No efficiency formula takes this count.
 *  benchmark.efficiency and the other efficiency formulas are not called. Unconfirmed novelty is not billed. */
export const connectorExamOf = () => {
  const harnesses = qpuHarnessesOf()
  const reviewed = LawFormulas.reviewed(0)
  return {
    kind: 'connector-exam' as const,
    examined: harnesses.rows.length,
    connectors: harnesses.rows.map((row) => row.harness),
    url: harnesses.url,
    holds: harnesses.holds === true,
    efficiency: { formula: null, hex: null, value: null, holds: false as const, lead: true as const },
    novelty: { confirmed: false as const, billed: false as const, lead: true as const, reviewed: reviewed.holds },
  }
}

/** One public connector: every harness already points at the same MCP url, and a read needs no credential.
 *  A secured API and a write that needs a bearer stay outside. No second protocol.
 *  Combinatorial wave.sweep grids ride this same connector: tools/call connector { from, width, passes }. */
export const publicConnectorOf = () => {
  const harnesses = qpuHarnessesOf()
  const exam = connectorExamOf()
  const faces = qpuFacesOf().faces
  const fused = harnesses.rows.filter((row) => JSON.stringify(row.config).includes(harnesses.url) || row.how.includes(harnesses.url))
  return {
    kind: 'connector' as const,
    url: harnesses.url,
    name: harnesses.name,
    fused: fused.map((row) => row.harness),
    examined: fused.length,
    efficiency: exam.efficiency,
    novelty: exam.novelty,
    combinatorial: {
      formula: 'wave.sweep' as const,
      stride: faces,
      via: 'tools/call connector { from, width, passes }' as const,
      endpoint: '/api/qpu/wave' as const,
      widthDoublesEachPass: true as const,
      note: 'caller supplies from; width defaults to faces·2; passes default 1; next pass uses furthest raw next' as const,
    },
    exam: {
      via: 'tools/call connector { exam: true }' as const,
      endpoint: '/api/qpu/exam' as const,
      dirs: 'inside-out + outside-in' as const,
    },
    access: {
      via: 'tools/call connector { access: true, mode: 0..7, who }' as const,
      endpoint: '/api/qpu/access' as const,
      note: 'Unix rwx×ugo mode enum → access.* hex; not an ACL graph' as const,
    },
    court: {
      via: 'tools/call connector { court: true } | { trial: true }' as const,
      endpoint: '/api/qpu/court' as const,
      note: 'each gate case tried: standard+fidelity+standing+ms; discover.capacity → seal-wave path' as const,
    },
    goal: {
      via: 'tools/call connector { goal: true }' as const,
      endpoint: '/api/qpu/goal' as const,
      note: 'state OPEN|LEAD from combinatorics.combinations / binomial / wave cells; court-tried — not prose document variants' as const,
    },
    enums: {
      via: 'tools/call connector { enums: true }' as const,
      note: 'MCP-backed select options (security, combinatorics, unix mode, tenants, …)' as const,
    },
    tenants: {
      via: 'tools/call connector { tenants: true } | { tenant: "<slug>", model?: "<door>" }' as const,
      endpoint: '/api/qpu/tenants' as const,
      note: 'each tenant’s models and needs — mode enum for access, not per-tenant policy engines' as const,
    },
    point: {
      via: 'tools/call connector { point: true }' as const,
      endpoint: '/api/qpu/point' as const,
      note: 'attracts holds-true seal / lattice / law / cloud.scale calls — the point, not the anti-point' as const,
    },
    use: {
      via: 'tools/call connector { use: true }' as const,
      note: 'agent discovery: tools/list bill vs fused routes; not a legal-doc generator' as const,
    },
    raid: {
      via: 'tools/call connector { raid: true }' as const,
      note: 'Qpu.Hybrid + RAID adapters vs direct bindings — measured ratios only' as const,
    },
    observe: {
      via: 'tools/call connector { observe: true } | { verbosity: 0..3 }' as const,
      endpoint: '/api/qpu/observe' as const,
      note: 'receipt observability + token usage (identifiable who/door/tool/family/hex/panel); secrets sealed — not a tools/list door' as const,
    },
    waits: {
      via: 'tools/call connector { waits: true } | { slow: true, take } | { cool: true }' as const,
      endpoint: '/api/qpu/waits' as const,
      note: 'wait audit / heat.slow next chain / cool-via-formulas — compact, fused' as const,
    },
    online: {
      via: 'tools/call connector { online: true } | { offline: true }' as const,
      endpoint: '/api/qpu/online' as const,
      note: 'level×mode matrix (formula/MCP/Payload/Worker/UI/SDK) online+offline; offline local; secrets sealed' as const,
    },
    chips: {
      via: 'tools/call connector { chips: true } | { print: true }' as const,
      note: 'ray-layered chip blueprints with crypto-imprinted SPDX license (ed25519+HMAC); papers fused — not a tools/list door' as const,
    },
    chat: {
      via: 'tools/call connector { about|chat|search|idea } · /api/qpu/chat' as const,
      endpoint: '/api/qpu/chat' as const,
      note: 'one chat+search surface for all harnesses — idea→blueprint/docs→app; token-sealed' as const,
    },
    distro: {
      via: 'tools/call connector { distro: true } · /api/qpu/chat?distro=true' as const,
      endpoint: '/api/qpu/chat' as const,
      note: 'combinatorial cover on merkaba double-torus/rosetta — outside-in + inside-out; C(faces,k)×binomial×doubled widths' as const,
    },
    cloudflare: {
      via: 'tools/call connector { cloudflare: true } · /api/qpu/cloudflare' as const,
      endpoint: '/api/qpu/cloudflare' as const,
      note: 'logged-in CF account via wrangler — workers/KV/R2/D1/pages/zones tree+live; secret names only; token-sealed' as const,
    },
    papers: {
      via: 'tools/call connector { papers: true } | { blueprint: true } | { docs: true }' as const,
      note: 'papersOf blueprints + whitepapers + docs/skills generators when dist is free' as const,
    },
    outside: [
      { where: 'storage-write' as const, why: 'A storage write needs Authorization: Bearer. That token is not handed to a public caller.' },
      { where: 'googleapis.com:books' as const, why: 'Secured. Not called.' },
      { where: 'nytimes.com:books_api' as const, why: 'Secured. Not called.' },
      { where: 'stdio' as const, why: 'The porting table names stdio. qpuHarnessesOf has no stdio row.' },
      { where: 'legal-document-draft' as const, why: 'QPU does not mint contracts or Drive files. Law/court/point are formulated readings; prose drafting stays with the host agent.' },
      { where: 'google-drive-mcp' as const, why: 'Drive browse/create is another MCP host. QPU connector does not proxy Drive tools.' },
    ],
    holds: harnesses.holds === true && fused.length === harnesses.rows.length && new Set(fused.map(() => harnesses.url)).size === 1,
  }
}

/**
 * Agent use surface — what Perplexity/Cursor/Claude see vs what they can call.
 * tools/list is the measured connect bill (sixteen sealed doors). Fused `connector` is tools/call by name.
 * { use: true } diagnoses that gap without inventing prices or flipping goal/prize.
 */
export const connectorUseOf = () => {
  const base = publicConnectorOf()
  const tools = qpuMcpToolsListOf()
  const fused = qpuMcpFusedOf()
  const listBytes = JSON.stringify({ resultType: 'complete' as const, tools }).length
  const qpuPrefixed = tools.filter((t) => t.name.startsWith('qpu_')).length
  const billHolds = tools.length <= 16 && listBytes < 16384 && qpuPrefixed === 0
  const routes = [
    { args: { use: true }, does: 'this reading — tools/list bill vs fused connector routes' },
    { args: { man: true }, does: 'man page for the connector door' },
    { args: { seal: true }, does: 'claySealWaveOf 0…5 — involution evidence; capacity-gated discover' },
    { args: { pass: 0 }, does: 'one seal-wave (bsd); pass i for seal i' },
    { args: { goal: true }, does: 'goal.combinations measure — OPEN|LEAD; not document-variant prose' },
    { args: { court: true }, does: 'gate-court trials (standard+fidelity+standing+ms)' },
    { args: { adapters: true }, does: 'native foreign→QPU registry; connect bill measured' },
    { args: { access: true, mode: 5, who: 'other' }, does: 'Unix rwx×ugo decides read/write/execute' },
    { args: { point: true }, does: 'holds-true seals + law + lattice + claimCompletenessAuditOf (one completeness field)' },
    { args: { exam: true }, does: 'inside-out + outside-in path hops with ms/timeout notes' },
    { args: { ecommerce: true }, does: 'catalog with court-tried priceRelationOf (no invented USD)' },
    { args: { from: 0 }, does: 'wave.sweep combinatorial grid' },
    { args: { observe: true, verbosity: 2 }, does: 'receipt observability + token usage rows at verbosity 2' },
    { args: { verbosity: 3 }, does: 'set verbosity full — sampling/signal/slo/errorratio on each receipt' },
    { args: { waits: true }, does: 'wait/hang audit sorted by cost' },
    { args: { slow: true, take: 14 }, does: 'heat.slow next chain (faces steps)' },
    { args: { cool: true }, does: 'heat.ways→cooling to threshold' },
    { args: { offline: true }, does: 'level×mode offline matrix (local compute, secrets sealed)' },
    { args: { online: true }, does: 'level×mode + optional host probe' },
    { args: { chips: true }, does: 'ray-layered chip print + crypto-imprinted CC-BY-NC-ND-4.0 license' },
    { args: { print: true }, does: 'all printables × tree printers matrix (includes licensed chips)' },
    { args: { raid: true }, does: 'RAID vs direct bindings — measured Qpu.Hybrid / subrequests / access (no invented magnitudes)' },
    { args: { about: 'search precision 8 10' }, does: 'chat+search one surface — words→formula + api search' },
    { args: { chat: true, about: 'heat quality 3 1000 1' }, does: 'ask door via connector — human-intelligence communication' },
    { args: { search: true, q: 'quantum' }, does: 'api-door search + search.* IR formulas' },
    { args: { papers: true }, does: 'blueprints + whitepapers + docs generators (dist free)' },
    { args: { app: true }, does: 'Public app panel map — idea→app entrypoints' },
    { args: { distro: true }, does: 'combinatorial distro on double-torus/rosetta — outside-in + inside-out' },
  ] as const
  return {
    kind: 'connector-use' as const,
    call: 'tools/call connector { use: true }' as const,
    thesis:
      'tools/list shows sixteen sealed doors (quantum / Lean / crypto). Fused connector is tools/call by name — chat/search, seal, goal, adapters, court, access, point/law, exam, observe/verbosity, papers. Agnostic idea→app path. Not a legal-drafting or Google Drive tool.' as const,
    perplexity: {
      transport: 'streamable-http' as const,
      server_url: base.url,
      auth: 'none for reads; Bearer only for storage writes' as const,
      agent_api: { type: 'mcp' as const, server_label: 'uuidna-qpu' as const, server_url: base.url },
      first_calls: [
        'tools/list — measured connect bill',
        'tools/call connector { use: true } — this map',
        'tools/call connector { about: "…" } — chat+search one surface',
        'tools/call connector { papers: true } — blueprints/docs',
        'tools/call connector { observe: true, verbosity: 2 } — receipt observability',
        'tools/call connector { seal: true } — clay seal-wave',
        'tools/call connector { goal: true } — combinations OPEN',
        'tools/call connector { point: true } — law/seal holds',
      ] as const,
    },
    listed: {
      doors: tools.length,
      names: tools.map((t) => t.name),
      bytes: listBytes,
      under16384: listBytes < 16384,
      qpuPrefixed,
      note: 'connect bill — keep lean; fused work rides connector, not extra list rows' as const,
    },
    fused: {
      names: fused.map((f) => f.name),
      connector: fused.some((f) => f.name === 'connector'),
      note: 'callable via tools/call; omitted from tools/list so the bill stays under 16 KiB' as const,
    },
    routes,
    not: [
      'legal document drafting / .docx generation',
      'Google Drive browse or create',
      'prose “all document combinations” — use host agent; QPU combinations = goal.combinations',
      'flipping prize/citation or UpdateGoal complete',
    ] as const,
    connectBill: {
      doors: tools.length,
      bytes: listBytes,
      under16384: listBytes < 16384,
      qpuPrefixed,
      holds: billHolds,
    },
    goal: 'OPEN' as const,
    // Fused catalogue may be empty until mcp/qpu-fused registers; bill + harness fusion still decide holds.
    holds: base.holds === true && billHolds,
    connector: base,
  }
}

/**
 * Connector answer: man page, recognition, full document, or a combinatorial wave.sweep grid.
 * Grid args go through this door — not a parallel private CLI path.
 */
export const connectorAnswerOf = async (args: Record<string, unknown> = {}) => {
  const { qpuManOf: manOf } = await import('../../quantum/processing/unit/index.js')
  if (args.cloudflare === true || args.cf === true || args.wrangler === true) {
    const { cloudflareAccountOf } = await import('./cloudflare-account.js')
    return { ...(await cloudflareAccountOf(args)), connector: publicConnectorOf() }
  }
  if (args.distro === true) {
    const { distroOf } = await import('./chat-search.js')
    return { ...(await distroOf(args)), connector: publicConnectorOf() }
  }
  if (
    args.chat === true ||
    args.search === true ||
    args.ask === true ||
    args.idea === true ||
    args.papers === true ||
    args.blueprint === true ||
    args.docs === true ||
    args.app === true ||
    args.apps === true ||
    typeof args.about === 'string' ||
    typeof args.q === 'string' ||
    typeof args.idea === 'string' ||
    typeof args.query === 'string'
  ) {
    const { chatSearchOf } = await import('./chat-search.js')
    return { ...(await chatSearchOf(args)), connector: publicConnectorOf() }
  }
  if (args.man === true) {
    return manOf(
      'connector',
      'The one public connector. { about|chat|search|idea } chat+search one surface. { use: true } agent map. { observe: true } / { verbosity } receipt + token usage. { waits|slow|cool } automation. { online|offline } level×mode. { adapters: true }. { seal|pass }. { papers|chips|print }. { court|goal|access|enums|point|tenant|ecommerce|exam|from }.',
      'Chat+search is framework-agnostic (MCP/Payload/Next/stdio/boot/Worker/native/RAID): idea → formula ask + api search → papers/blueprints/docs → Public apps. Native adapters map Qiskit/Braket/Cirq/… onto hex — not vendor clones. Secrets sealed. Not a legal-draft or Drive tool.',
      'https://qpu.uuidna.com/mcp',
      ['hex', 'law', 'court', 'clay', 'wave', 'ecommerce', 'access', 'api'],
    )
  }
  if (
    args.waits === true ||
    args.slow === true ||
    args.cool === true ||
    args.online === true ||
    args.offline === true ||
    args.next === true ||
    args.mode === 'online' ||
    args.mode === 'offline' ||
    args.mode === 'waits' ||
    args.mode === 'slow' ||
    args.mode === 'cool'
  ) {
    const { waitsAnswerOf } = await import('./tokens.js')
    return { ...(await waitsAnswerOf(args)), connector: publicConnectorOf() }
  }
  if (args.observe === true || args.observability === true || typeof args.verbosity === 'number' || typeof args.level === 'number') {
    const { observeOf } = await import('./observability.js')
    return { ...(await observeOf(args)), connector: publicConnectorOf() }
  }
  if (args.chips === true || args.chip === true || args.print === true || args.printAll === true) {
    const { modeAccessOf } = await import('./access-mode.js')
    const mode = typeof args.mode === 'number' && Number.isSafeInteger(args.mode) ? args.mode : 5
    const who =
      args.who === 'other' || args.who === 'user' || args.who === 'group' || args.who === 'owner' ? args.who : 'other'
    const access = modeAccessOf({ mode, who })
    if (access.decides.execute !== true) {
      return {
        kind: 'print-denied' as const,
        call: 'tools/call connector { chips: true }' as const,
        denied: 'unix mode x required to print chips' as const,
        access,
        holds: false as const,
        goal: 'OPEN' as const,
        connector: publicConnectorOf(),
      }
    }
    const { papersOf } = await import('../../mcp/papers.js')
    return { ...(await papersOf(args)), access, connector: publicConnectorOf() }
  }
  if (args.use === true || args.routes === true || args.diagnose === true) {
    return { ...connectorUseOf(), connector: publicConnectorOf() }
  }
  if (args.raid === true || args.hybrid === true) {
    const { raidCompareOf } = await import('./raid-compare.js')
    return { ...raidCompareOf(), connector: publicConnectorOf() }
  }
  if (args.goal === true) {
    const { goalOf } = await import('./goal.js')
    const k = typeof args.k === 'number' && Number.isSafeInteger(args.k) ? args.k : undefined
    const width = typeof args.width === 'number' && Number.isSafeInteger(args.width) ? args.width : undefined
    const passes = typeof args.passes === 'number' && Number.isSafeInteger(args.passes) ? args.passes : undefined
    const mode = typeof args.mode === 'number' && Number.isSafeInteger(args.mode) ? args.mode : undefined
    const who =
      args.who === 'other' || args.who === 'user' || args.who === 'group' || args.who === 'owner' ? args.who : undefined
    return {
      ...goalOf({
        ...(k !== undefined ? { k } : {}),
        ...(width !== undefined ? { width } : {}),
        ...(passes !== undefined ? { passes } : {}),
        ...(mode !== undefined ? { mode } : {}),
        ...(who ? { who } : {}),
      }),
      connector: publicConnectorOf(),
    }
  }
  if (args.adapters === true || args.native === true || typeof args.vendor === 'string' || Array.isArray(args.gates) || typeof args.qasm === 'string' || Array.isArray(args.instructions)) {
    const { nativeAnswerOf } = await import('./native-adapters.js')
    return { ...(await nativeAnswerOf(args)), connector: publicConnectorOf() }
  }
  if (args.court === true || args.trial === true || typeof args.case === 'string') {
    const { gateCourtOf } = await import('./gate-court.js')
    const digest = typeof args.digest === 'string' ? args.digest : undefined
    const flags = typeof args.flags === 'number' && Number.isSafeInteger(args.flags) ? args.flags : undefined
    const mode = typeof args.mode === 'number' && Number.isSafeInteger(args.mode) ? args.mode : undefined
    const who =
      args.who === 'other' || args.who === 'user' || args.who === 'group' || args.who === 'owner'
        ? args.who
        : undefined
    const caseName = typeof args.case === 'string' ? args.case : undefined
    return {
      ...gateCourtOf({
        ...(caseName ? { case: caseName } : {}),
        ...(digest ? { digest } : {}),
        ...(flags !== undefined ? { flags } : {}),
        ...(mode !== undefined ? { mode } : {}),
        ...(who ? { who } : {}),
      }),
      connector: publicConnectorOf(),
    }
  }
  if (args.seal === true || (typeof args.pass === 'number' && Number.isSafeInteger(args.pass))) {
    const { claySealWaveOf, CLAY_SEALS } = await import('../../families/clay/index.js')
    const { connectBillGateOf, discoverCapacityGateOf } = await import('./gate-court.js')
    const i = typeof args.pass === 'number' ? args.pass : 0
    const capacity = discoverCapacityGateOf()
    const bill = connectBillGateOf()
    if (args.seal === true && args.pass === undefined) {
      const waves = await Promise.all(CLAY_SEALS.map((_, j) => claySealWaveOf(j)))
      return {
        kind: 'clay-seal-waves' as const,
        call: 'tools/call connector { seal: true }' as const,
        note: `path=${capacity.path}; court.standard allow=${capacity.allow}` as const,
        capacity,
        waves: waves.map((w) => w && ({
          i: w.i, seal: w.name, hex: w.hex, held: w.held, holds: w.involutive,
          involution: w.involution, agents: w.agents, values: w.values, discover: w.discover,
          capacity: w.capacity, rawNext: w.capacity?.rawNext ?? ('absent' as const),
        })),
        connectBill: {
          doors: bill.gate.value,
          bytes: bill.gate.params[1] ?? 0,
          under16384: bill.allow,
          qpuPrefixed: 0,
          trial: bill.trial,
          holds: bill.holds,
        },
        holds: waves.every((w) => w?.involutive === true) && capacity.fidelity.holds,
        goal: 'OPEN' as const,
        connector: publicConnectorOf(),
      }
    }
    const w = await claySealWaveOf(i)
    return {
      kind: 'clay-seal-wave' as const,
      call: `tools/call connector { pass: ${i} }` as const,
      ...(w ?? { holds: false }),
      capacity,
      rawNext: w?.capacity?.rawNext ?? ('absent' as const),
      connectBill: {
        doors: bill.gate.value,
        bytes: bill.gate.params[1] ?? 0,
        under16384: bill.allow,
        qpuPrefixed: 0,
        trial: bill.trial,
        holds: bill.holds,
      },
      goal: 'OPEN' as const,
      connector: publicConnectorOf(),
    }
  }
  if (args.access === true || typeof args.mode === 'number' || typeof args.who === 'string') {
    const { modeAccessOf } = await import('./access-mode.js')
    const mode = typeof args.mode === 'number' && Number.isSafeInteger(args.mode) ? args.mode : undefined
    const who = typeof args.who === 'string' ? args.who : undefined
    return {
      ...modeAccessOf({
        ...(mode !== undefined ? { mode } : {}),
        ...(who !== undefined ? { who: who as 'other' | 'user' | 'group' | 'owner' } : {}),
      }),
      connector: publicConnectorOf(),
    }
  }
  if (args.enums === true) {
    const { formulatedEnumsOf } = await import('./ecommerce.js')
    const tools = (await import('../../quantum/processing/unit/index.js')).qpuMcpToolsListOf()
    const listBytes = JSON.stringify({ resultType: 'complete', tools }).length
    return {
      kind: 'enums' as const,
      call: 'tools/call connector { enums: true }' as const,
      enums: formulatedEnumsOf(),
      connectBill: {
        doors: tools.length,
        bytes: listBytes,
        under16384: listBytes < 16384,
        qpuPrefixed: tools.filter((t) => t.name.startsWith('qpu_')).length,
      },
      holds: true as const,
      goal: 'OPEN' as const,
      connector: publicConnectorOf(),
    }
  }
  if (args.exam === true) {
    const { examOf } = await import('./exam.js')
    return { ...(await examOf()), connector: publicConnectorOf() }
  }
  if (args.tenants === true || typeof args.tenant === 'string' || typeof args.host === 'string' || typeof args.domain === 'string') {
    const { tenantServeOf } = await import('./tenants.js')
    return { ...(await tenantServeOf(args)), connector: publicConnectorOf() }
  }
  if (args.point === true || args.constraints === true || args.laws === true) {
    return { ...(await pointOf()), connector: publicConnectorOf() }
  }
  if (args.ecommerce === true || args.catalog === true) {
    const { formulatedCatalogOf } = await import('./ecommerce.js')
    return { ...formulatedCatalogOf(), connector: publicConnectorOf() }
  }
  if (typeof args.from === 'number' && Number.isSafeInteger(args.from) && args.from >= 0) {
    const width = typeof args.width === 'number' && Number.isSafeInteger(args.width) && args.width > 0 ? args.width : undefined
    const passes = typeof args.passes === 'number' && Number.isSafeInteger(args.passes) && args.passes > 0 ? args.passes : undefined
    const grid = await waveSweepGridOf({ from: args.from, ...(width !== undefined ? { width } : {}), ...(passes !== undefined ? { passes } : {}) })
    return { ...grid, connector: publicConnectorOf() }
  }
  const base = publicConnectorOf()
  if (args.full === true) return { ...base, full: true as const, point: await pointOf() }
  return base
}

/** What the Payload surface delivers: a holds-true reading beside the usage bill. A lead is listed and not delivered. Margin is not a number. */
export const valueForMoneyOf = () => {
  const trinity = permaTrinityOf()
  const upgrade = postQuantumUpgradeOf().upgrade
  const bill = usageBillOf()
  const citation = openMathScaleOf().citation
  const exam = connectorExamOf()
  const value = [
    ...trinity.readings.filter((row) => row.holds === true).map((row) => ({ where: `perma.${row.face}`, hex: row.uuid, value: row.value, holds: true as const })),
    ...(upgrade.holds === true ? [{ where: 'crypt.curveQuantumBits' as const, hex: upgrade.uuid, value: upgrade.value, holds: true as const }] : []),
  ]
  return {
    kind: 'value-for-money' as const,
    surface: 'Payload frontend RunCard and the generic block' as const,
    tenant: 'perma.uuidna.com' as const,
    value,
    bill: { units: bill.units, charged: bill.charged, billed: bill.billed, prizeBilled: false as const },
    leads: [
      { where: 'legal.citation' as const, holds: citation.holds, lead: citation.lead },
      { where: 'industry-margin' as const, lead: true as const },
      { where: 'connector-efficiency' as const, lead: exam.efficiency.lead },
      { where: 'novelty' as const, lead: exam.novelty.lead, billed: exam.novelty.billed },
      { where: 'clay-prize' as const, lead: bill.prize.lead, billed: bill.prize.billed },
    ],
    productVariant: { where: 'product-variant' as const, lead: false as const, via: 'formulatedCatalogOf / Payload ecommerce' as const },
    holds: value.length > 0 && value.every((row) => row.holds === true) && bill.holds === true && citation.holds === false && bill.margin === null,
  }
}

export const permaTenantOf = () => {
  const zone = qpuTenantZoneOf()
  const underZone = !SLUG.includes('.') && !SLUG.includes('*') && !zone.reserved.includes(SLUG)
  const trinity = permaTrinityOf()
  const usage = usageBillOf()
  const exam = connectorExamOf()
  const bill = { ...usage, tenant: SLUG, client: 'perma.family' as const, novelty: exam.novelty }
  const scale = openMathScaleOf()
  const reviewed = LawFormulas.reviewed(0)
  const cure = ContractFormulas.cure(7, 14)
  const lawful = LawFormulas.lawful(0)
  const chain = EvidenceFormulas.chain(5, 5)
  const domains = domainReadingsOf()
  return {
    kind: 'perma-tenant' as const,
    standards: qpuStandardsOf(),
    client: 'perma.family' as const,
    slug: SLUG,
    host: `${SLUG}.${zone.zone}`,
    of: zone.own,
    zone: zone.zone,
    underZone,
    scale,
    trinity,
    domains,
    protection: [
      { party: 'perma' as const, family: 'contract' as const, formula: 'cure' as const, hex: cure.hex, value: cure.value, holds: cure.holds },
      { party: 'qpu' as const, family: 'law' as const, formula: 'lawful' as const, hex: lawful.hex, value: lawful.value, holds: lawful.holds },
      { party: 'public' as const, family: 'evidence' as const, formula: 'chain' as const, hex: chain.hex, value: chain.value, holds: chain.holds },
    ],
    reviewed: { family: 'law' as const, formula: 'reviewed' as const, params: [0] as const, hex: reviewed.hex, value: reviewed.value, holds: reviewed.holds, lead: true as const, note: 'not advice' as const },
    upgrade: postQuantumUpgradeOf().upgrade,
    exam,
    connector: publicConnectorOf(),
    bill,
    citation: scale.citation,
    valueForMoney: valueForMoneyOf(),
    holds: underZone && trinity.holds === true && bill.holds === true,
  }
}

/** Default is the recognition. { full: true } is the document. { man: true } is the schema page. */
export const permaManOf = () => qpuManOf(
  'permaculture',
  'perma.family is a tenant of this unit. clay.bsd is the author\'s seal arithmetic, recomputed. The citation row is a lead.',
  'The reply is the recognition. { full: true } is the document. { man: true } is this page. The walk is the clay seals, then the domains on this path. No price is confirmed.',
  'https://qpu.uuidna.com/mcp',
  ['hex', 'law', 'clay'],
)

export const permaAnswerOf = (args: { full?: boolean; man?: boolean } = {}) => {
  if (args.man === true) return permaManOf()
  const doc = permaTenantOf()
  return args.full === true ? doc : qpuRecognizeOf(doc)
}

export const permacultureVisionOf = () => {
  const tenant = permaTenantOf()
  return {
    kind: 'permaculture-vision' as const,
    asked: 'permaculture' as const,
    tenant,
    upgrade: tenant.upgrade,
    citation: tenant.citation,
    gateway: payloadLeadsOf(),
    holds: false as const,
    lead: true as const,
  }
}

export const permaculturePlugin = (): QpuPlugin => (config) => ({
  ...config,
  endpoints: [...(config.endpoints ?? []), {
    path: '/qpu/permaculture',
    method: 'get' as const,
    handler: (req: { url?: string }) => {
      const url = req?.url ?? ''
      return Response.json(permaAnswerOf({ full: /[?&]full=true(?:&|$)/.test(url), man: /[?&]man=true(?:&|$)/.test(url) }))
    },
  }],
})
