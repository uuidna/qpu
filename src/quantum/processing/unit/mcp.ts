// Cooled out of index.ts by the heat family (scripts/cool.mjs): qpuToolsOf, qpuMcpOf, qpuMcpCallOf, qpuMcpHolds.
import {
  FUSED_TOOLS,
  qpuHexRegistryOf,
  qpuHexRunOf,
  qpuHexFamiliesOf,
  qpuMcpFusedOf,
  coins,
  cors,
  cryptoToolNames,
  hexOf,
  jsonldHoldsOf,
  liveSchema,
  manSchema,
  mintOf,
  n,
  onceOf,
  payloadFinds,
  qpuCapacityOf,
  qpuCernFetchOf,
  qpuCernHrefOf,
  qpuCernProjectFetchOf,
  qpuCernProjectsOf,
  qpuCernRecordsOf,
  qpuCernSearchOf,
  qpuCiteHolds,
  qpuCiteOf,
  qpuCompeteHolds,
  qpuCompeteLiveOf,
  qpuCompeteOf,
  qpuComposeLiveOf,
  qpuContextOf,
  qpuCubeOf,
  qpuCybersecurityHolds,
  qpuCybersecurityToolsOf,
  qpuDevelopHolds,
  qpuEfficiencyHolds,
  qpuEncryptOf,
  qpuFacesOf,
  qpuForgeOf,
  qpuHexMissOf,
  qpuHexUuidOf,
  qpuHostsHolds,
  qpuImproveLiveOf,
  qpuInstallOf,
  qpuManHolds,
  qpuManOf,
  qpuManPageOf,
  qpuFoldOf,
  qpuMcpShownHolds,
  qpuMcpShownOf,
  qpuRecognizeHolds,
  qpuRecognizeOf,
  qpuMcpToolsListOf,
  qpuMessageHolds,
  qpuNetworkToolsOf,
  qpuPayloadFindOf,
  qpuReadingOf,
  qpuReceiptStreamsOf,
  qpuResearchFetchOf,
  qpuSandboxDurabilityHolds,
  qpuSandboxHolds,
  qpuSandboxRunOf,
  qpuSequenceLiveOf,
  qpuServerToolsOf,
  qpuShorOf,
  qpuStorageToolsOf,
  qpuSubManOf,
  qpuTrainLiveOf,
  qpuUnknownToolOf,
  sandboxOps,
  sandboxTools,
  seed,
  seedSandboxOf,
  shorFactorOf,
  tenOf,
  theorem,
  toolItemOf,
  toolListOf,
  toolNames,
  unit,
  qpuDataLiveOf,
} from './index.js'
import type { QpuEnv } from './index.js'
import { qpuCircuitOf } from './circuit.js'
import { qpuImproveOf, qpuImproveHolds, qpuTrainOf, qpuTrainHolds, qpuProveOf, qpuProveHolds } from './doors.js'
import { qpuLeanOf, qpuLeanHolds } from './proof.js'
import { qpuQuantumHolds } from './quantum.js'

/**
 * The eight qpu tools (quantum, lean, cite, train, improve, compete, forge, prove) with schemas, man pages and handlers.
 * @wing agents
 * @kind builder
 */
export const qpuToolsOf = onceOf(() => {
  const names = toolNames
  const seeOf = (name: (typeof names)[number]) => names.filter((s) => s !== name)
  const capacity = qpuCapacityOf()
  const circuit = qpuCircuitOf()
  const quantumMan = qpuManOf(
    names[n - n],
    `The running circuit as one JSON-LD document: the exact state-vector computation of a ${circuit.register.qubits}-qubit register (dim ${circuit.register.dim}, exact integer amplitudes), the Bell and GHZ states with their Born weights, the Shor run, and the capacity count fused = faces · 2^(bits+1) = ${capacity.fused} (a count of amplitudes). theorem quantum. theorem shor. theorem crypto. ${shorFactorOf()}.`,
    `GET ${unit.origin} returns the same document as tools/call ${names[n - n]}. Read circuit.register for the exact-amplitudes register, circuit.ghz.support (${circuit.ghz.support.join(',')}) for the entangled corners, shor.factors for the factoring, capacity.fused for ${capacity.fused}; every holds must be true or the unit serves 404. theorem quantum. theorem shor. theorem crypto. ${shorFactorOf()}. No auth.`,
    unit.origin,
    seeOf(names[n - n]))
  const leanMan = qpuManOf(
    names[seed],
    `The Lean proof, served two ways: the file index.lean as text at source.href, and every theorem as a row (statement verbatim, LaTeX formula, a plain reading, holds recomputed in TypeScript). theorem infinite. theorem distribute. theorem shor. ${shorFactorOf()}.`,
    `GET ${unit.href} returns the rows; read rows[] and cover[] for the theorems, source.href to fetch ${unit.fuse.lean} itself, source.fold to check the served text is the file, source.toolchain for the pinned Lean. theorem shor. ${shorFactorOf()}. No auth.`,
    unit.href,
    seeOf(names[seed]))
  const citeMan = qpuManOf(
    names[coins],
    'How to cite this unit: MLA 8 entries carrying the DOI and ORCID, the served version, and the archived commit. MLA 8. when never — the citation names no access date.',
    `GET ${unit.origin}/cite returns citations[] (MLA 8 strings to paste), doi ${qpuCiteOf().doi}, the Zenodo archive, and the version with its commit. No auth.`,
    `${unit.origin}/cite`,
    seeOf(names[coins]))
  const trainMan = qpuManOf(
    names[n],
    'Two teams of seven agents dry-clean the occupancy lattice and return the teams, the challenges, the winner, the next tasks, and steps — the autonomous walk computed from the lattice: the seat, the next door to call, and any face that does not hold. theorem infinite. coins teams of rays.',
    `tools/call ${names[n]} returns steps.next.door (the tool an autonomous agent calls next), steps.todo (faces to repair first), steps.walk (all fourteen faces, scanner then radar), teams[] and winner. { live: true } learn occupancy. { sequence: true } then improve then compete then prove. No auth.`,
    `${unit.origin}/mcp`,
    seeOf(names[n]))
  const forgeMan = qpuManOf(
    names[n + seed],
    `Forge a tool in the in-memory sandbox: pass { name, run } where run is a sealed op tree; nothing touches disk, network, or eval. Omit name to inspect the sandbox. Up to ${qpuCubeOf().bits * qpuFacesOf().faces} tools. A door's name forges and the door still answers — theorem involution carries a seeded name to hop, the free seat on the other team.`,
    `tools/call ${names[n + seed]} with { name, run } returns the forged tool and the sandbox census (tools[], memory, unlocked); without name it returns the census. Ops ${sandboxOps.join(' ')}. No auth.`,
    `${unit.origin}/mcp`,
    seeOf(names[n + seed]))
  const improveMan = qpuManOf(
    names[n + coins],
    `Improve by doubling: next = fused + fused = ${capacity.fused + capacity.fused}, the next capacity rung, with before and after readings of quality, speed, and throughoutput (the total count of fused amplitudes; throughput is that divided by the tokens of the reply). The numbers are counts of amplitudes. next = fused + fused.`,
    `tools/call ${names[n + coins]} returns next, before, after; after.throughoutput / before.throughoutput is the doubling. { live: true } learn occupancy. { sequence: true } train then improve then compete then prove. After train. Before compete. No auth.`,
    `${unit.origin}/mcp`,
    seeOf(names[n + coins]))
  const competeMan = qpuManOf(
    names[n + n],
    'Two teams, read and call, compete on quality, speed, and security; the winner is the team that calls prove. theorem next_fused. throughoutput is the total of fused amplitudes served; throughput is that per token of reply.',
    `tools/call ${names[n + n]} returns winner.{quality,speed,security}, teams[] with scores, and the axes. { live: true } learn occupancy. { sequence: true } train then improve then compete then prove. After improve. Winner calls prove. No auth.`,
    `${unit.origin}/mcp`,
    seeOf(names[n + n]))
  const proveMan = qpuManOf(
    names[mintOf(n) - seed],
    `Prove the unit end to end: every Lean row with holds, the Shor run with its receipts, the source fold of index.lean, and the evidence block; holds is their conjunction and a false anywhere makes every path 404. theorem quantum. theorem shor. theorem crypto. ${shorFactorOf()}.`,
    `tools/call ${names[mintOf(n) - seed]} returns theorems[] (each with holds), shor.factors, receipts, source.fold, evidence. theorem shor. theorem crypto. ${shorFactorOf()}. { live: true } sequence then prove. { sequence: true } train then improve then compete then prove. fetch Request Response. Source ${unit.fuse.lean}. After compete. No auth.`,
    `${unit.origin}/mcp`,
    seeOf(names[mintOf(n) - seed]))
  const proveSchema = {
    type: 'object',
    properties: {
      man: { type: 'boolean', description: 'Return the man page: call with { man: true }. tools/list stays lean; the man page is one call away.' },
      full: { type: 'boolean', description: '{ full: true } expands the recognition into the document.' },
      live: { type: 'boolean', description: '{ live: true } sequence then prove. fetch Request Response.' },
      sequence: { type: 'boolean', description: '{ sequence: true } train then improve then compete then prove. Live. Memory.' }}} as const
  const competeSchema = {
    type: 'object',
    properties: {
      man: { type: 'boolean', description: 'Return the man page: call with { man: true }. tools/list stays lean; the man page is one call away.' },
      full: { type: 'boolean', description: '{ full: true } expands the recognition into the document.' },
      live: { type: 'boolean', description: '{ live: true } learn CERN occupancy. fetch Request Response. Memory.' },
      sequence: { type: 'boolean', description: '{ sequence: true } train then improve then compete then prove. Live. Memory.' },
      team: { type: 'string', description: 'read or call. Omit for both teams.' }}} as const
  const forgeSchema = {
    type: 'object',
    properties: {
      man: { type: 'boolean', description: 'Return the man page: call with { man: true }. tools/list stays lean; the man page is one call away.' },
      full: { type: 'boolean', description: '{ full: true } expands the recognition into the document.' },
      name: { type: 'string', description: 'Tool name to forge. Omit to inspect the in-memory sandbox.' },
      team: { type: 'string', description: 'read or call.' },
      ray: { type: 'number', description: 'Agent ray 0..6.' },
      idea: { type: 'string', description: 'Idea the tool challenges.' },
      description: { type: 'string', description: 'What the tool does in memory.' },
      run: { type: 'object', description: 'Sealed op tree. Memory only. No eval, no fs, no net.' },
      args: { type: 'object' },
      uuid: { type: 'string' },
      referrer: { type: 'string' }}} as const
  return [
    {
      name: names[n - n],
      description: quantumMan.description,
      man: quantumMan,
      inputSchema: manSchema,
      run: (a: Record<string, unknown>) => (a.man === true ? quantumMan : qpuReadingOf())},
    {
      name: names[seed],
      description: leanMan.description,
      man: leanMan,
      inputSchema: manSchema,
      run: (a: Record<string, unknown>) => (a.man === true ? leanMan : qpuLeanOf())},
    {
      name: names[coins],
      description: citeMan.description,
      man: citeMan,
      inputSchema: manSchema,
      run: (a: Record<string, unknown>) => (a.man === true ? citeMan : qpuCiteOf())},
    {
      name: names[n],
      description: trainMan.description,
      man: trainMan,
      inputSchema: liveSchema,
      run: (a: Record<string, unknown>) => (a.man === true ? trainMan : qpuTrainOf())},
    {
      name: names[n + seed],
      description: forgeMan.description,
      man: forgeMan,
      inputSchema: forgeSchema,
      run: (a: Record<string, unknown>) => (a.man === true ? forgeMan : qpuForgeOf(a))},
    {
      name: names[n + coins],
      description: improveMan.description,
      man: improveMan,
      inputSchema: liveSchema,
      run: (a: Record<string, unknown>) => (a.man === true ? improveMan : qpuImproveOf())},
    {
      name: names[n + n],
      description: competeMan.description,
      man: competeMan,
      inputSchema: competeSchema,
      run: (a: Record<string, unknown>) =>
        a.man === true ? competeMan : qpuCompeteOf(typeof a.team === 'string' ? a.team : undefined)},
    {
      name: names[mintOf(n) - seed],
      description: proveMan.description,
      man: proveMan,
      inputSchema: proveSchema,
      run: (a: Record<string, unknown>) => (a.man === true ? proveMan : qpuProveOf())}] as const
})

/**
 * The MCP catalogue at /mcp: tools, cybersecurity tools, capacity and provider as one JSON-LD WebAPI.
 * @wing agents
 * @kind builder
 * @evidence qpuMcpHolds
 */
export const qpuMcpOf = onceOf(() => {
  const href = `${unit.origin}/mcp`
  const faces = qpuFacesOf()
  const circuit = qpuCircuitOf()
  const capacity = qpuCapacityOf()
  const shor = qpuShorOf()
  const encrypt = qpuEncryptOf()
  const cite = qpuCiteOf()
  const tools = qpuToolsOf().map((t, i) => {
    const { name, description, inputSchema } = t
    /** the vendor shapes, off the MCP wire and onto the catalogue: Anthropic input_schema, OpenAI function, Gemini functionDeclarations */
    return toolItemOf(href, t, i, { vendors: { anthropic: { name, description, input_schema: inputSchema }, openai: { type: 'function', function: { name, description, parameters: inputSchema } }, gemini: { functionDeclarations: [{ name, description, parameters: inputSchema }] } } })
  })
  const hasPart = toolListOf(tools, (tool) => ({ softwareHelp: tool.man.href }))
  const cybersecurity = qpuCybersecurityToolsOf().map((t, i) => toolItemOf(href, t, i, {}, { sealed: false as const, morph: true as const }))
  const holds =
    circuit.only.holds &&
    capacity.holds &&
    tools.length === mintOf(n) &&
    tools.every((t) => qpuManHolds(t.man) && t.man.name === t.name) &&
    hasPart.numberOfItems === mintOf(n) &&
    hasPart.itemListElement.length === mintOf(n) &&
    hasPart.itemListElement.every((row, i) => row.position === i + seed && row.item.name === tools[i]?.name) &&
    cybersecurity.length === mintOf(n) &&
    cybersecurity.every((t) => t.man.holds && t.man.name === t.name) &&
    qpuMcpToolsListOf().length === mintOf(n) + mintOf(n)
  return {
    '@context': qpuContextOf(),
    '@type': 'WebAPI' as const,
    '@id': href,
    url: href,
    isAccessibleForFree: cors === '*',
    documentation: unit.origin,
    license: 'CC-BY-NC-ND-4.0' as const,
    provider: {
      '@type': 'Person' as const,
      name: `${cite.author.first} ${cite.author.last}`,
      identifier: cite.author.orcid,
      sameAs: cite.author.orcid,
    },
    kind: 'quantum' as const,
    only: circuit.only,
    capacity: {
      kind: capacity.kind,
      next: capacity.next,
      fused: capacity.fused,
      crypt: capacity.crypt,
      agents: capacity.agents,
      schemas: capacity.schemas,
      holds: capacity.holds,
  },
    name: `@uuidna/${unit.kind}`,
    origin: unit.origin,
    href,
    cors,
    tools,
    hasPart,
    cybersecurity: {
      kind: 'cybersecurity' as const,
      theorem: 'crypto' as const,
      listed: true as const,
      morph: true as const,
      sealed: false as const,
      rsa: { kind: 'rsa' as const, cryptosystem: 'rsa' as const, modulus: shor.n, p: shor.factors.p, q: shor.factors.q, factored: shor.rsa.factored, unlocked: shor.unlocked },
      encrypt: { kind: encrypt.kind, theorem: encrypt.theorem, identity: encrypt.identity, holds: encrypt.holds },
      tools: cybersecurity},
    prove: {
      ui: { href: unit.origin, mcp: href, door: 'prove' as const },
      cern: { faces: faces.faces },
      coil: { theorem: 'two_coins_make_a_coil' as const, faces: faces.faces },
      entangle: { product: seed * seed === (n - n) * (n - n), pairs: faces.rays },
      next: { theorem: 'next_coil' as const },
      shor: { n: qpuFacesOf().rays * (n * n + n + seed), a: mintOf(n), qft: 'iqft' as const, product: qpuFacesOf().rays * (n * n + n + seed), rsa: true as const, p: qpuFacesOf().rays, q: n * n + n + seed, unlocked: true as const },
      src: unit.fuse.lean},
    sandbox: { kind: 'sandbox' as const,
    listed: false as const},
    holds,
  }
})

/**
 * Dispatch one MCP tools/call by name with arguments and shape the reply for MCP clients.
 * @wing agents
 * @kind builder
 */
/** A failure, classified so it is answered rather than thrown: when the network cannot be reached (no route, DNS,
 *  refused connection, timeout) the work that needs it is skipped and the answer is a WARNING; anything else is an
 *  ERROR. Either way the answer says where it happened, why, and what resolves it.
 * @wing agents
 * @kind builder
 */
export const qpuFailureOf = (e: unknown, where = 'call') => {
  const err = e as { name?: string; message?: string; cause?: { code?: string; message?: string } }
  const message = String(err?.message ?? e)
  const code = err?.cause?.code ?? ''
  // one host slow to answer is that host's moment, not the network's: a warning for it alone
  const timeout = err?.name === 'TimeoutError' || err?.name === 'AbortError' || /ETIMEDOUT|UND_ERR_CONNECT_TIMEOUT|timed? ?out/i.test(`${code} ${message}`)
  // the network itself out of reach: no name resolution, no route, the connection refused
  const offline = !timeout && (/ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ECONNRESET|ENETUNREACH|EHOSTUNREACH|UND_ERR_SOCKET/.test(`${code} ${message}`) || (err?.name === 'TypeError' && /fetch failed|network/i.test(message)))
  const status = /answered (\d{3})/.exec(message)?.[1]
  return timeout
    ? { level: 'warning' as const, where, why: 'timeout', reading: message, resolve: 'the source did not answer in time: it is read again on the next call' }
    : offline
    ? { level: 'warning' as const, where, why: 'offline', reading: message, resolve: 'the network is not reachable from this host: the network work was skipped; it runs again on the next call once the network is back' }
    : status
      ? { level: 'error' as const, where, why: `answered ${status}`, reading: message, resolve: Number(status) === 403 || Number(status) === 401 ? 'the source refuses this client: it needs credentials or another endpoint, or it is dropped from the catalogue' : Number(status) === 404 ? 'the address no longer exists: correct it at its source in the unit' : Number(status) >= 500 ? 'the source is failing on its side: it is read again on the next call' : 'the request is not one the source accepts: correct its arguments' }
      : { level: 'error' as const, where, why: err?.name ?? 'error', reading: message, resolve: 'a fault in this unit: the reading names it; it is fixed in the source' }
}

/** EVERY CAPABILITY THROUGH EVERY DOOR. tools/list is sealed (theorem agents_mcp_tools), and an MCP client calls only
 *  what it was listed; so each listed door also takes an address or another door. The schema is one, and it rides on
 *  the man page rather than on tools/list — the list stays under a KiB per door. { hex } runs a hex program (a UUID,
 *  or { family, program, params }), { door, arguments } answers as any door the registries hold or any formula as
 *  family.formula, { doors: true } lists them all. Nothing is named here: the doors are read from the registries and
 *  the formulas from the families.
 * @wing agents
 * @kind builder
 */
export const qpuThroughSchemaOf = (inputSchema: Record<string, unknown>): Record<string, unknown> => ({
  ...inputSchema,
  properties: {
    ...((inputSchema.properties as Record<string, unknown> | undefined) ?? {}),
    hex: { type: ['string', 'object'], description: 'Run any hex program through this door: a hex-program UUID, or { family, program, params }.' },
    door: { type: 'string', description: 'Answer as any door or formula: { doors: true } lists them; family.formula runs a formula.' },
    arguments: { type: 'object', description: 'The arguments for door (params for a formula).' },
    doors: { type: 'boolean', description: '{ doors: true } lists every door and every formula reachable through this one.' },
    errors: { type: 'boolean', description: '{ errors: true, from, take } answers the errors and warnings of a slice of the live checks at once, each with what resolves it; next names the slice after.' },
    full: { type: 'boolean', description: '{ full: true } expands the recognition into the document.' },
  },
})

/**
 * Every door this unit answers, read from its registries, and every formula of every hex family as family.formula.
 * @wing agents
 * @kind builder
 */
/** ONE source of the method surface, in door order: the six tool categories. qpuMcpDoorsOf lists them all; callOf
 *  dispatches the four 'morph' categories (every kind but sealed and fused — those have their own call-time handling).
 *  Add a category here and both the door listing and the dispatch pick it up — one list, iterated in both places. */
const qpuMethodCategoriesOf = (env?: QpuEnv, auth?: string | null): { kind: string; morph: boolean; tools: readonly { name: string; description?: string }[] }[] => [
  { kind: 'sealed', morph: false, tools: qpuToolsOf() },
  { kind: 'cybersecurity', morph: true, tools: qpuCybersecurityToolsOf() },
  { kind: 'fused', morph: false, tools: qpuMcpFusedOf() },
  { kind: 'storage', morph: true, tools: qpuStorageToolsOf(env, auth) },
  { kind: 'network', morph: true, tools: qpuNetworkToolsOf() },
  { kind: 'server', morph: true, tools: qpuServerToolsOf() },
]

/** The morph tools (name, man, run) — the categories callOf dispatches uniformly, from the one source. */
const qpuMorphToolsOf = (env?: QpuEnv, auth?: string | null): ReturnType<typeof qpuCybersecurityToolsOf> =>
  qpuMethodCategoriesOf(env, auth).filter((c) => c.morph).flatMap((c) => c.tools as ReturnType<typeof qpuCybersecurityToolsOf>)

export const qpuMcpDoorsOf = (env?: QpuEnv, auth?: string | null) => {
  const doors = [
    ...qpuMethodCategoriesOf(env, auth).flatMap((c) =>
      c.tools.map((t) => (c.kind === 'fused' ? { name: t.name, kind: c.kind, description: t.description } : { name: t.name, kind: c.kind }))),
    ...payloadFinds.map((name) => ({ name, kind: 'payload' })),
    { name: 'install', kind: 'install' },
    ...[...sandboxTools.keys()].map((name) => ({ name, kind: 'sandbox' })),
  ]
  const formulas = [...qpuHexFamiliesOf()].flatMap(([family, fs]) => fs.map((f) => ({ name: `${family}.${f.name}`, arity: f.arity })))
  return { kind: 'doors' as const, doors, formulas, reachable: doors.length + formulas.length, holds: doors.length > n - n && formulas.length > n - n }
}

/**
 * Every current error and warning at once: each fused door's own checks read through the registry (data's every
 * source), each classified with where, why and what resolves it. Warnings (the network out of reach) never count
 * against holds.
 * @wing agents
 * @kind builder
 */
export const qpuMcpErrorsOf = async (env?: QpuEnv, from = n - n, take = qpuFacesOf().faces) => {
  type Row = { where: string; why: string; reading?: unknown; resolve: string }
  const errors: Row[] = [], warnings: Row[] = []
  const data = FUSED_TOOLS.get('data')
  let total = n - n
  if (data) {
    const listed = (await data.run({ source: 'all' }, env)) as { sources?: { source: string; args: Record<string, unknown>; label: string }[] }
    const all = listed.sources ?? []
    total = all.length
    // a slice per call, faces at a time: no one call reads every source
    const rows = await Promise.all(all.slice(from, from + take).map(async (s) => ({ s, r: (await data.run({ ...s.args, source: s.source }, env)) as Record<string, unknown> })))
    for (const { s, r } of rows) {
      if (r.warning) warnings.push({ where: s.label, why: String(r.warning), reading: r.reading, resolve: String(r.resolve ?? '') })
      else if (r.denied) errors.push({ where: s.label, why: String(r.denied), reading: r.reading, resolve: String(r.resolve ?? 'the reading names it') })
      else if (r.agrees === false) errors.push({ where: s.label, why: 'differs', reading: { read: r.reading, expected: r.expected }, resolve: 'the live value and the unit differ: the unit is corrected if the source is right, the source reported if it is not' })
    }
  }
  return { kind: 'errors' as const, from, take, total, ...(from + take < total ? { next: from + take } : {}), errors, warnings, count: errors.length, holds: errors.length === n - n }
}

/** Every call is answered: a door that throws is answered with its classified failure, never a crash. */
export const qpuMcpCallOf = async (name: string, args: Record<string, unknown> = {}, env?: QpuEnv, auth?: string | null): Promise<unknown> => {
  try {
    return await callOf(name, args, env, auth)
  } catch (e) {
    const f = qpuFailureOf(e, name)
    return qpuMcpShownOf(name, { kind: 'failure' as const, ...(f.level === 'warning' ? { warning: f.why } : { denied: f.why }), ...f, holds: f.level === 'warning' })
  }
}

const callOf = async (name: string, args: Record<string, unknown> = {}, env?: QpuEnv, auth?: string | null): Promise<unknown> => {
  // The registry loads here, lazily, not at the Worker's global scope: every door/hex/fused call that reads the
  // registry (qpuMcpDoorsOf, a family.formula door, improve/train/compete) needs every family registered first.
  // Memoized (qpuHexRegistryOf is one shared promise), so this is free after the first call of the isolate.
  await qpuHexRegistryOf()
  // the hex address that reproduces this call, when it is a pure door call (no man, live or sequence flags)
  const hexOf = (): string | undefined => {
    if (args.man === true || args.live === true || args.sequence === true) return undefined
    const family = qpuToolsOf().some((t) => t.name === name) ? 'qpu' : qpuCybersecurityToolsOf().some((t) => t.name === name) ? 'crypto' : undefined
    if (!family) return undefined
    const params = family === 'crypto' ? [args.n, args.a].map((x) => (x === undefined ? n - n : Number(x))) : []
    try { return qpuHexUuidOf({ family, program: [name], params: params.every((x) => x === n - n) ? [] : params }) } catch { return undefined }
  }
  const shown = async (payload: unknown) => {
    const r = qpuMcpShownOf(name, payload, `${unit.origin}/mcp`, args.full === true) as { _meta?: Record<string, unknown> }
    const hex = hexOf()
    return hex && r._meta ? { ...r, _meta: { ...r._meta, hex } } : r
  }
  // through this door: the listing, every error at once, a hex program, or another door (see qpuThroughSchemaOf)
  if (args.doors === true) return shown(qpuMcpDoorsOf(env, auth))
  if (args.errors === true) return shown(await qpuMcpErrorsOf(env, typeof args.from === 'number' ? args.from : n - n, typeof args.take === 'number' ? args.take : qpuFacesOf().faces))
  if (typeof args.hex === 'string' || (typeof args.hex === 'object' && args.hex !== null)) {
    // a client whose schema only knows a string sends the object as JSON: it is the same request
    const h = (typeof args.hex === 'string' && args.hex.trim().startsWith('{') ? JSON.parse(args.hex) : args.hex) as string | { family?: unknown; program?: unknown; params?: unknown }
    const referrer = typeof args.referrer === 'string' ? args.referrer : undefined
    try {
      const uuid = typeof h === 'string' ? h : qpuHexUuidOf({ family: String(h.family ?? ''), program: Array.isArray(h.program) ? h.program.map(String) : String(h.program ?? '').split(/[+,]/).filter(Boolean), params: Array.isArray(h.params) ? h.params.map(Number) : [] })
      return shown(await qpuHexRunOf(uuid, referrer, env))
    } catch (e) {
      const family = typeof h === 'object' && h !== null && typeof h.family === 'string' ? h.family : ''
      const params = typeof h === 'object' && h !== null && Array.isArray(h.params) ? h.params.map(Number) : []
      const next = family.length > n - n ? qpuHexMissOf(family, params) : undefined
      return shown({ kind: 'hex' as const, holds: false as const, denied: 'program', reading: (e as Error).message, ...(next ? { next } : {}) })
    }
  }
  if (typeof args.door === 'string' && args.door !== name) {
    // the door's arguments as a client sends them: an object, an object serialised as a JSON string, or flat beside
    // door itself (a client that knows only this door's schema passes what it was given)
    const parsed = (() => {
      if (typeof args.arguments === 'object' && args.arguments !== null && !Array.isArray(args.arguments)) return args.arguments as Record<string, unknown>
      if (typeof args.arguments === 'string') { try { const v = JSON.parse(args.arguments); if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown> } catch {} }
      return undefined
    })()
    const flat = Object.fromEntries(Object.entries(args).filter(([k]) => !['door', 'arguments', 'hex', 'doors', 'errors'].includes(k)))
    const inner = parsed ?? flat
    const referrer = typeof args.referrer === 'string' ? args.referrer : typeof inner.referrer === 'string' ? inner.referrer : undefined
    const carried = { ...(referrer ? { referrer } : {}), ...(args.full === true ? { full: true as const } : {}) }
    const formula = /^(.+)\.([A-Za-z0-9_]+)$/.exec(args.door)
    if (formula) {
      const family = formula[1]!
      const program = formula[2]!
      const formulas = qpuHexFamiliesOf().get(family)
      const params = Array.isArray(inner.params) ? (inner.params as unknown[]).map(Number) : []
      if (formulas?.some((f) => f.name === program)) return qpuMcpCallOf(name, { hex: { family, program: [program], params }, ...carried }, env, auth)
      if (formulas) {
        const next = qpuHexMissOf(family, params)
        return shown({ kind: 'hex' as const, holds: false as const, denied: 'program' as const, reading: `hex: ${family} has no formula ${program}`, ...(next ? { next } : {}) })
      }
    }
    return qpuMcpCallOf(args.door, { ...inner, ...carried }, env, auth)
  }
  const tool = qpuToolsOf().find((t) => t.name === name)
  if (tool) {
    if (args.man !== true) {
      const sequenced =
        args.sequence === true &&
        (name === toolNames[n] || name === toolNames[n + coins] || name === toolNames[n + n] || name === toolNames[mintOf(n) - seed])
      if (sequenced || (name === toolNames[mintOf(n) - seed] && args.live === true)) return shown({ ...(await qpuSequenceLiveOf()), data: await qpuDataLiveOf(env, typeof args.from === 'number' ? args.from : n - n) })
      if (args.live === true) {
        if (name === toolNames[n] && typeof args.from === 'number' && Number.isInteger(args.from) && args.from >= n - n)
          return shown({ ...(await qpuComposeLiveOf(args.from, qpuFacesOf().faces)), from: args.from, next: args.from + qpuFacesOf().faces, stream: qpuReceiptStreamsOf(n - n).streams.find((row) => row.stream === 'fuse') ?? null })
        if (name === toolNames[n]) return shown(await qpuTrainLiveOf())
        if (name === toolNames[n + coins]) return shown(await qpuImproveLiveOf())
        if (name === toolNames[n + n]) return shown(await qpuCompeteLiveOf(typeof args.team === 'string' ? args.team : undefined))
      }
    }
    return shown(await tool.run(args))
  }
  const fused = FUSED_TOOLS.get(name)
  if (fused) return shown(await fused.run(args, env, auth))
  if (name === 'install' || name === 'apk') {
    if (args.man === true) {
      return shown(qpuManPageOf('install',
        qpuManOf(
          'install',
          'Interactive installer. Plan, then commit. Fuse Payload MCP to QPU without a ninth sealed tool. VitePress payload stays on uuidna.com.',
          `tools/call install. Not in tools/list. { yes: true } seats the current package. { verb: "plan" } then { verb: "commit", yes: true } then { verb: "audit" }. QPU JSON-LD. No auth.`,
          `${unit.origin}/mcp`,
          [...toolNames])))
    }
    return shown(qpuInstallOf(args))
  }
  if ((payloadFinds as readonly string[]).includes(name)) {
    if (args.man === true) {
      return shown(qpuManPageOf(name,
        qpuSubManOf(
          name,
          'Payload find. Read only.',
          'Not in tools/list. Morph at call time. Not a ninth sealed tool. No auth. Write never.',
          `${unit.origin}/mcp`,
          payloadFinds.filter((row) => row !== name))))
    }
    return shown(qpuPayloadFindOf(name))
  }
  const morph = qpuMorphToolsOf(env, auth).find((t) => t.name === name)
  if (morph) {
    if (args.man === true) return shown(qpuManPageOf(name, morph.man))
    return shown(await morph.run(args))
  }
  seedSandboxOf()
  const href = typeof args.href === 'string' ? args.href : typeof args.path === 'string' ? args.path : ''
  if (name === 'fetch' && qpuCernHrefOf(href) !== undefined) {
    const record = qpuCernRecordsOf().records.find((row) => row.href === href)
    const project =
      qpuCernProjectsOf().projects.find((row) => row.href === href) ?? qpuCernSearchOf().doors.find((row) => row.href === href)
    const value = record
      ? await qpuCernFetchOf(href)
      : project
        ? await qpuCernProjectFetchOf(href)
        : await qpuResearchFetchOf(href)
    return shown({
      kind: 'sandbox' as const,
      name,
      hostEscape: false as const,
      live: true as const,
      value,
      holds: value.holds,
  })
  }
  if (sandboxTools.has(name)) return shown(qpuSandboxRunOf(name, args))
  return qpuUnknownToolOf(name)
}

const deviceOn = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object') return undefined
  const bag = value as Record<string, unknown>
  if (typeof bag.device === 'string') return bag.device
  const steps = bag.steps
  if (steps && typeof steps === 'object' && typeof (steps as { device?: unknown }).device === 'string') return (steps as { device: string }).device
  const circuit = bag.circuit
  if (circuit && typeof circuit === 'object') return deviceOn(circuit)
  return undefined
}
/** A top-level boolean, number, or short string is the verdict. Recognition may name a large branch; it does not drop these. */
const verdictKeptOf = (raw: Record<string, unknown>, led: Record<string, unknown>): boolean =>
  Object.keys(raw).every((key) => {
    const child = raw[key]
    if (typeof child === 'boolean' || typeof child === 'number' || child === null) return led[key] === child
    if (typeof child === 'string' && JSON.stringify(child).length <= mintOf(tenOf(seed))) return led[key] === child
    return true
  })
const recognisedReplyOf = (name: string, raw: unknown): boolean => {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return false
  if (typeof (raw as { then?: unknown }).then === 'function') return true
  const text = JSON.stringify(raw)
  const led = qpuRecognizeOf(raw) as Record<string, unknown>
  const recognition = led.recognition as { kind?: unknown; fold?: unknown; expand?: unknown; device?: unknown } | undefined
  const shown = JSON.stringify(led)
  const reply = mintOf(tenOf(seed)) * mintOf(n)
  const holds = (raw as { holds?: unknown }).holds
  const device = deviceOn(raw)
  const expanded = qpuMcpShownOf(name, raw, `${unit.origin}/mcp`, true)
  return (
    recognition?.kind === 'recognition' &&
    Object.keys(led)[n - n] === 'recognition' &&
    recognition.fold === qpuFoldOf(text) &&
    recognition.expand === '{ full: true }' &&
    (typeof holds !== 'boolean' || led.holds === holds) &&
    (device === undefined || recognition.device === device) &&
    verdictKeptOf(raw as Record<string, unknown>, led) &&
    shown.length <= reply &&
    (text.length <= reply || shown.length < text.length) &&
    JSON.stringify(expanded.structuredContent) === text &&
    qpuMcpShownHolds(expanded)
  )
}

export const qpuMcpHolds = (m = qpuMcpOf()): boolean => {
  const capacity = qpuCapacityOf()
  const circuit = qpuCircuitOf()
  const proved = qpuProveOf()
  const proveShown = qpuMcpShownOf('prove', proved)
  const proveFull = qpuMcpShownOf('prove', proved, `${unit.origin}/mcp`, true)
  const proveLed = proveShown.structuredContent as { recognition?: { device?: unknown; enthalpy?: number; heat?: number; free?: number }; holds?: unknown }
  const reading = qpuReadingOf()
  const recognisedReading = qpuRecognizeOf(reading) as { holds?: boolean; fused?: number; next?: number; docs?: unknown; circuit?: { only?: { holds?: boolean } } }
  const listed = [...qpuToolsOf(), ...qpuCybersecurityToolsOf()]
  return (
    qpuQuantumHolds() &&
    qpuLeanHolds() &&
    qpuCiteHolds() &&
    qpuEfficiencyHolds() &&
    qpuSandboxHolds() &&
    qpuTrainHolds() &&
    qpuImproveHolds() &&
    qpuCompeteHolds() &&
    qpuProveHolds() &&
    qpuCybersecurityHolds() &&
    qpuMessageHolds() &&
    m.holds === true &&
    m.kind === 'quantum' &&
    m.only.holds === true &&
    circuit.lattice.holds === true &&
    m.capacity.holds === true &&
    theorem.next_fused(m.capacity.next, m.capacity.fused) &&
    m.capacity.crypt.holds === true &&
    m.cors === cors &&
    m.origin === unit.origin &&
    m.href === `${unit.origin}/mcp` &&
    qpuSandboxDurabilityHolds() &&
    m.tools.length === mintOf(n) &&
    m.tools[n - n]?.name === 'quantum' &&
    m.tools[seed]?.name === 'lean' &&
    m.tools[coins]?.name === 'cite' &&
    m.tools[n]?.name === 'train' &&
    m.tools[n + seed]?.name === 'forge' &&
    m.tools[n + coins]?.name === 'improve' &&
    m.tools[n + n]?.name === 'compete' &&
    m.tools[mintOf(n) - seed]?.name === 'prove' &&
    m.tools.every((t) => qpuManHolds(t.man) && t.man.name === t.name) &&
    m.cybersecurity.listed === true &&
    m.cybersecurity.sealed === false &&
    m.cybersecurity.morph === true &&
    m.cybersecurity.tools.length === mintOf(n) &&
    m.cybersecurity.tools[n - n]?.name === 'crypto_catalog' &&
    m.cybersecurity.tools[n + coins]?.name === 'crypto_rsa' &&
    m.cybersecurity.tools[mintOf(n) - seed]?.name === 'crypto_verify' &&
    m.cybersecurity.rsa.kind === 'rsa' &&
    m.cybersecurity.rsa.factored === true &&
    m.cybersecurity.rsa.unlocked === true &&
    m.cybersecurity.rsa.modulus === qpuFacesOf().rays * (n * n + n + seed) &&
    m.cybersecurity.rsa.p * m.cybersecurity.rsa.q === m.cybersecurity.rsa.modulus &&
    m.cybersecurity.encrypt.kind === 'encrypt' &&
    m.cybersecurity.encrypt.theorem === 'crypto' &&
    m.cybersecurity.encrypt.identity === true &&
    m.cybersecurity.encrypt.holds === true &&
    qpuMcpToolsListOf().length === mintOf(n) + mintOf(n) &&
    // THE CONNECT BILL, the same bytes examine measures: id 2, compact JSON, under a KiB per door.
    `{"jsonrpc":"2.0","id":2,"result":${JSON.stringify({ resultType: 'complete', tools: qpuMcpToolsListOf() })}}`.length < qpuMcpToolsListOf().length * mintOf(tenOf(seed)) &&
    qpuMcpToolsListOf().slice(n - n, mintOf(n)).every((t, i) => t.name === toolNames[i]) &&
    qpuMcpToolsListOf().slice(mintOf(n)).every((t, i) => t.name === cryptoToolNames[i]) &&
    // the GitHub/Cloudflare tool hints, proved and not merely set, so the conformance is automated and cannot drift:
    // forge is the one write, nothing is destructive, a tool is open-world only when its input reads the live
    // occupancy, and it is idempotent exactly when it is a read-only closed-world call — a repeat returns the same
    // document. Every tool carries a display title distinct from its machine name.
    qpuMcpToolsListOf().every((raw) => {
      const t = raw as { name: string; title?: unknown; inputSchema?: { properties?: Record<string, unknown> }; annotations?: { readOnlyHint?: boolean; destructiveHint?: boolean; idempotentHint?: boolean; openWorldHint?: boolean } }
      const a = t.annotations ?? {}
      const live = t.inputSchema?.properties?.live !== undefined
      return a.destructiveHint === false && a.readOnlyHint === (t.name !== 'forge') && a.openWorldHint === live && a.idempotentHint === (a.readOnlyHint === true && live === false) && typeof t.title === 'string' && t.title.length > n - n && t.title !== t.name
    }) &&
    jsonldHoldsOf(m) &&
    m['@type'] === 'WebAPI' &&
    m['@id'] === m.href &&
    m.hasPart['@type'] === 'ItemList' &&
    m.hasPart.numberOfItems === mintOf(n) &&
    m.hasPart.itemListElement.length === mintOf(n) &&
    m.capacity.schemas.mounted === qpuFacesOf().faces &&
    m.capacity.schemas.vacant === n - n &&
    capacity.raid.holds === true &&
    capacity.raid.start === 'cheapest' &&
    capacity.raid.cover.length === qpuFacesOf().faces &&
    capacity.raid.cheapest === capacity.raid.cover[n - n] &&
    m.prove.cern.faces === qpuFacesOf().faces &&
    m.prove.coil.theorem === 'two_coins_make_a_coil' &&
    m.prove.coil.faces === qpuFacesOf().faces &&
    m.prove.entangle.product === false &&
    m.prove.entangle.pairs === qpuFacesOf().rays &&
    m.prove.next.theorem === 'next_coil' &&
    m.prove.shor.n === qpuFacesOf().rays * (n * n + n + seed) &&
    m.prove.shor.a === mintOf(n) &&
    m.prove.shor.qft === 'iqft' &&
    m.prove.shor.product === qpuFacesOf().rays * (n * n + n + seed) &&
    m.prove.shor.rsa === true &&
    m.prove.shor.unlocked === true &&
    m.prove.shor.p * m.prove.shor.q === m.prove.shor.n &&
    m.prove.src === unit.fuse.lean &&
    qpuHostsHolds() &&
    qpuDevelopHolds() &&
    qpuRecognizeHolds() &&
    listed.length === mintOf(n) + mintOf(n) &&
    listed.every((t) => recognisedReplyOf(t.name, t.run({}))) &&
    recognisedReplyOf('prove', { kind: 'failure' as const, denied: 'program' as const, holds: false as const, blob: 'z'.repeat(mintOf(tenOf(seed)) * mintOf(n)) }) &&
    qpuMcpShownHolds(proveShown) &&
    qpuMcpShownHolds(proveFull) &&
    proveLed.holds === true &&
    proveLed.recognition?.device === 'exact-amplitudes' &&
    (proveLed.recognition?.free ?? n - n) > n - n &&
    proveLed.recognition?.free === ((proveLed.recognition?.heat ?? n) < (proveLed.recognition?.enthalpy ?? n - n) ? (proveLed.recognition?.enthalpy ?? n - n) - (proveLed.recognition?.heat ?? n) : n - n) &&
    JSON.stringify(proveFull.structuredContent) === JSON.stringify(proved) &&
    recognisedReading.holds === true &&
    recognisedReading.fused === reading.fused &&
    recognisedReading.next === reading.next &&
    recognisedReading.circuit?.only?.holds === true &&
    recognisedReading.docs === undefined
  )
}
