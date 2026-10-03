// Cooled out of index.ts by the heat family (scripts/cool.mjs): qpuToolsOf, qpuMcpOf, qpuMcpCallOf, qpuMcpHolds.
import {
  FUSED_TOOLS,
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
  qpuHexUuidOf,
  qpuHostsHolds,
  qpuImproveLiveOf,
  qpuInstallOf,
  qpuManHolds,
  qpuManOf,
  qpuManPageOf,
  qpuMcpShownOf,
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
    `tools/call ${names[n]} returns steps.next.door (the tool an autonomous agent calls next), steps.todo (faces to repair first), steps.walk (all fourteen faces, scanner then radar), teams[] and winner. { live: true } learn occupancy. { sequence: true } then qpu_improve then qpu_compete then qpu_prove. No auth.`,
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
    `tools/call ${names[n + coins]} returns next, before, after; after.throughoutput / before.throughoutput is the doubling. { live: true } learn occupancy. { sequence: true } train then improve then compete then prove. After qpu_train. Before qpu_compete. No auth.`,
    `${unit.origin}/mcp`,
    seeOf(names[n + coins]))
  const competeMan = qpuManOf(
    names[n + n],
    'Two teams, read and call, compete on quality, speed, and security; the winner is the team that calls qpu_prove. theorem next_fused. throughoutput is the total of fused amplitudes served; throughput is that per token of reply.',
    `tools/call ${names[n + n]} returns winner.{quality,speed,security}, teams[] with scores, and the axes. { live: true } learn occupancy. { sequence: true } train then improve then compete then prove. After qpu_improve. Winner calls qpu_prove. No auth.`,
    `${unit.origin}/mcp`,
    seeOf(names[n + n]))
  const proveMan = qpuManOf(
    names[mintOf(n) - seed],
    `Prove the unit end to end: every Lean row with holds, the Shor run with its receipts, the source fold of index.lean, and the evidence block; holds is their conjunction and a false anywhere makes every path 404. theorem quantum. theorem shor. theorem crypto. ${shorFactorOf()}.`,
    `tools/call ${names[mintOf(n) - seed]} returns theorems[] (each with holds), shor.factors, receipts, source.fold, evidence. theorem shor. theorem crypto. ${shorFactorOf()}. { live: true } sequence then prove. { sequence: true } qpu_train then qpu_improve then qpu_compete then qpu_prove. fetch Request Response. Source ${unit.fuse.lean}. After qpu_compete. No auth.`,
    `${unit.origin}/mcp`,
    seeOf(names[mintOf(n) - seed]))
  const proveSchema = {
    type: 'object',
    properties: {
      man: { type: 'boolean', description: 'Return the man page: call with { man: true }. tools/list stays lean; the man page is one call away.' },
      live: { type: 'boolean', description: '{ live: true } sequence then prove. fetch Request Response.' },
      sequence: { type: 'boolean', description: '{ sequence: true } qpu_train then qpu_improve then qpu_compete then qpu_prove. Live. Memory.' }}} as const
  const competeSchema = {
    type: 'object',
    properties: {
      man: { type: 'boolean', description: 'Return the man page: call with { man: true }. tools/list stays lean; the man page is one call away.' },
      live: { type: 'boolean', description: '{ live: true } learn CERN occupancy. fetch Request Response. Memory.' },
      sequence: { type: 'boolean', description: '{ sequence: true } qpu_train then qpu_improve then qpu_compete then qpu_prove. Live. Memory.' },
      team: { type: 'string', description: 'read or call. Omit for both teams.' }}} as const
  const forgeSchema = {
    type: 'object',
    properties: {
      man: { type: 'boolean', description: 'Return the man page: call with { man: true }. tools/list stays lean; the man page is one call away.' },
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
      ui: { href: unit.origin, mcp: href, door: 'qpu_prove' as const },
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
/** EVERY CAPABILITY THROUGH EVERY DOOR. tools/list is sealed (theorem agents_mcp_tools), and an MCP client calls only
 *  what it was listed; so each listed door also takes an address or another door. The rule is one schema, added to
 *  every listed door: { hex } runs a hex program (a UUID, or { family, program, params }), { door, arguments } answers
 *  as any door the registries hold or any formula as family.formula, { doors: true } lists them all. Nothing is named
 *  here: the doors are read from the registries and the formulas from the families.
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
  },
})

/**
 * Every door this unit answers, read from its registries, and every formula of every hex family as family.formula.
 * @wing agents
 * @kind builder
 */
export const qpuMcpDoorsOf = (env?: QpuEnv, auth?: string | null) => {
  const doors = [
    ...qpuToolsOf().map((t) => ({ name: t.name, kind: 'sealed' })),
    ...qpuCybersecurityToolsOf().map((t) => ({ name: t.name, kind: 'cybersecurity' })),
    ...qpuMcpFusedOf().map((t) => ({ name: t.name, kind: 'fused', description: t.description })),
    ...qpuStorageToolsOf(env, auth).map((t) => ({ name: t.name, kind: 'storage' })),
    ...qpuNetworkToolsOf().map((t) => ({ name: t.name, kind: 'network' })),
    ...qpuServerToolsOf().map((t) => ({ name: t.name, kind: 'server' })),
    ...payloadFinds.map((name) => ({ name, kind: 'payload' })),
    { name: 'install', kind: 'install' },
    ...[...sandboxTools.keys()].map((name) => ({ name, kind: 'sandbox' })),
  ]
  const formulas = [...qpuHexFamiliesOf()].flatMap(([family, fs]) => fs.map((f) => ({ name: `${family}.${f.name}`, arity: f.arity })))
  return { kind: 'doors' as const, doors, formulas, reachable: doors.length + formulas.length, holds: doors.length > n - n && formulas.length > n - n }
}

export const qpuMcpCallOf = async (name: string, args: Record<string, unknown> = {}, env?: QpuEnv, auth?: string | null): Promise<unknown> => {
  // the hex address that reproduces this call, when it is a pure door call (no man, live or sequence flags)
  const hexOf = (): string | undefined => {
    if (args.man === true || args.live === true || args.sequence === true) return undefined
    const family = qpuToolsOf().some((t) => t.name === name) ? 'qpu' : qpuCybersecurityToolsOf().some((t) => t.name === name) ? 'crypto' : undefined
    if (!family) return undefined
    const params = family === 'crypto' ? [args.n, args.a].map((x) => (x === undefined ? n - n : Number(x))) : []
    try { return qpuHexUuidOf({ family, program: [name], params: params.every((x) => x === n - n) ? [] : params }) } catch { return undefined }
  }
  const shown = async (payload: unknown) => {
    const r = qpuMcpShownOf(name, payload) as { _meta?: Record<string, unknown> }
    const hex = hexOf()
    return hex && r._meta ? { ...r, _meta: { ...r._meta, hex } } : r
  }
  // through this door: the listing, a hex program, or another door (see qpuThroughSchemaOf)
  if (args.doors === true) return shown(qpuMcpDoorsOf(env, auth))
  if (typeof args.hex === 'string' || (typeof args.hex === 'object' && args.hex !== null)) {
    const h = args.hex as string | { family?: unknown; program?: unknown; params?: unknown }
    try {
      const uuid = typeof h === 'string' ? h : qpuHexUuidOf({ family: String(h.family ?? ''), program: Array.isArray(h.program) ? h.program.map(String) : String(h.program ?? '').split(/[+,]/).filter(Boolean), params: Array.isArray(h.params) ? h.params.map(Number) : [] })
      return shown(await qpuHexRunOf(uuid, undefined, env))
    } catch (e) {
      return shown({ kind: 'hex' as const, holds: false as const, denied: 'program', reading: (e as Error).message })
    }
  }
  if (typeof args.door === 'string' && args.door !== name) {
    const inner = typeof args.arguments === 'object' && args.arguments !== null ? (args.arguments as Record<string, unknown>) : {}
    const formula = /^(.+)\.([A-Za-z0-9_]+)$/.exec(args.door)
    if (formula && qpuHexFamiliesOf().get(formula[1]!)?.some((f) => f.name === formula[2])) return qpuMcpCallOf(name, { hex: { family: formula[1], program: [formula[2]], params: inner.params ?? [] } }, env, auth)
    return qpuMcpCallOf(args.door, inner, env, auth)
  }
  const tool = qpuToolsOf().find((t) => t.name === name)
  if (tool) {
    if (args.man !== true) {
      const sequenced =
        args.sequence === true &&
        (name === toolNames[n] || name === toolNames[n + coins] || name === toolNames[n + n] || name === toolNames[mintOf(n) - seed])
      if (sequenced || (name === toolNames[mintOf(n) - seed] && args.live === true)) return shown({ ...(await qpuSequenceLiveOf()), data: await qpuDataLiveOf(env) })
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
  if (fused) return shown(await fused.run(args, env))
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
  const morph = [
    ...qpuCybersecurityToolsOf(),
    ...qpuStorageToolsOf(env, auth),
    ...qpuNetworkToolsOf(),
    ...qpuServerToolsOf(),
  ].find((t) => t.name === name)
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

export const qpuMcpHolds = (m = qpuMcpOf()): boolean => {
  const capacity = qpuCapacityOf()
  const circuit = qpuCircuitOf()
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
    m.tools[n - n]?.name === 'qpu_quantum' &&
    m.tools[seed]?.name === 'qpu_lean' &&
    m.tools[coins]?.name === 'qpu_cite' &&
    m.tools[n]?.name === 'qpu_train' &&
    m.tools[n + seed]?.name === 'qpu_forge' &&
    m.tools[n + coins]?.name === 'qpu_improve' &&
    m.tools[n + n]?.name === 'qpu_compete' &&
    m.tools[mintOf(n) - seed]?.name === 'qpu_prove' &&
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
    qpuMcpToolsListOf().slice(n - n, mintOf(n)).every((t, i) => t.name === toolNames[i]) &&
    qpuMcpToolsListOf().slice(mintOf(n)).every((t, i) => t.name === cryptoToolNames[i]) &&
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
    qpuDevelopHolds()
  )
}
