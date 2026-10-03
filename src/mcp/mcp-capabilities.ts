import { qpuFoldOf, qpuHexCatalogOf, qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuLeanOf, qpuMcpFusedOf, qpuMcpRegisterOf, qpuReceiptStreamsOf } from '../quantum/processing/unit/index.js'
import { hologramStreamsOf } from '../families/holo/index.js'

type Params = Record<string, unknown>
type Resource = { uri: string; name: string; title: string; description: string; mimeType: 'application/json' }
type Template = { uriTemplate: string; name: string; title: string; description: string; mimeType: 'application/json' }
type PromptArg = { name: string; description: string; required?: boolean }
type Prompt = { name: string; title: string; description: string; arguments: PromptArg[]; messages: (args: Record<string, string>) => string }

const PAGE = 8
const rpcError = (code: number, message: string, data?: unknown) => Object.assign(new Error(message), { code, data })
const invalid = (message: string, data?: unknown) => rpcError(-32602, message, data)

/** Continuation: an opaque cursor carries the next offset and a fold of the listing, so a cursor into a list that has changed since is refused. */
const paged = <T>(kind: string, items: readonly T[], idOf: (x: T) => string, params: Params) => {
  const print = qpuFoldOf(`${kind}|${items.map(idOf).join('|')}`)
  let at = 0
  if (params.cursor !== undefined) {
    try {
      const c = JSON.parse(atob(String(params.cursor).replace(/-/g, '+').replace(/_/g, '/'))) as { k?: string; o?: number; f?: string }
      if (c.k !== kind || c.f !== print || !Number.isSafeInteger(c.o) || c.o! < 0 || c.o! > items.length) throw new Error()
      at = c.o!
    } catch {
      throw invalid('Invalid cursor: the listing changed or the cursor is not one this server issued', { kind })
    }
  }
  const next = at + PAGE
  const nextCursor = next < items.length ? btoa(JSON.stringify({ k: kind, o: next, f: print })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : undefined
  return { page: items.slice(at, next), ...(nextCursor ? { nextCursor } : {}) }
}

let hologram: ReturnType<typeof hologramStreamsOf> | undefined
const hologramOf = () => (hologram ??= hologramStreamsOf())

const json = (uri: string, value: unknown) => ({ contents: [{ uri, mimeType: 'application/json' as const, text: JSON.stringify(value) }] })
const families = () => [...qpuHexFamiliesOf().keys()].sort()
const streams = () => qpuReceiptStreamsOf().streams.map((s) => s.stream).sort()

const resourcesOf = (): Resource[] => [
  { uri: 'qpu://receipts', name: 'receipts', title: 'Receipt streams', description: 'Every quantum-receipt stream: head, length, chain, holds', mimeType: 'application/json' },
  { uri: 'qpu://hex', name: 'hex', title: 'Hex catalogue', description: 'Every formula family a hex UUID can program, with handles and nibbles', mimeType: 'application/json' },
  { uri: 'qpu://hologram', name: 'hologram', title: 'Hologram streams', description: 'One signed SHA-256 UUID stream per hologram scale and the Merkle root of all of them', mimeType: 'application/json' },
  { uri: 'qpu://fused', name: 'fused', title: 'Fused tools', description: 'Tools answered by tools/call beside the sixteen sealed doors: name, description, input schema', mimeType: 'application/json' },
  { uri: 'qpu://lean', name: 'lean', title: 'Lean proof', description: 'Every theorem as a row: statement, formula, holds recomputed', mimeType: 'application/json' },
  ...streams().map((s) => ({ uri: `qpu://receipts/${s}`, name: `receipts-${s}`, title: `Stream ${s}`, description: `The ${s} receipt stream with its recent receipts`, mimeType: 'application/json' as const })),
  ...families().map((f) => ({ uri: `qpu://formulas/${f}`, name: `formulas-${f}`, title: `Family ${f}`, description: `The formulas of the ${f} hex family`, mimeType: 'application/json' as const })),
  ...Object.keys(hologramOf().streams).map((s) => ({ uri: `qpu://hologram/${s}`, name: `hologram-${s}`, title: `Scale ${s}`, description: `Signed fragments of the ${s} scale`, mimeType: 'application/json' as const })),
]

const TEMPLATES: Template[] = [
  { uriTemplate: 'qpu://receipts/{stream}', name: 'receipt-stream', title: 'Receipt stream', description: 'One receipt stream by name', mimeType: 'application/json' },
  { uriTemplate: 'qpu://formulas/{family}', name: 'formula-family', title: 'Formula family', description: 'The formulas of one hex family: name, nibble, arity', mimeType: 'application/json' },
  { uriTemplate: 'qpu://hex/{uuid}', name: 'hex-run', title: 'Hex program run', description: 'Run the hex program a UUID encodes; the run is a quantum receipt', mimeType: 'application/json' },
  { uriTemplate: 'qpu://hologram/{scale}', name: 'hologram-scale', title: 'Hologram scale', description: 'Signed, chained fragments of one hologram scale with their Merkle proofs', mimeType: 'application/json' },
]

const readOf = async (uri: string): Promise<unknown> => {
  if (uri === 'qpu://receipts') return { ...qpuReceiptStreamsOf(), streams: qpuReceiptStreamsOf().streams.map(({ recent, ...head }) => head) }
  if (uri === 'qpu://hex') return qpuHexCatalogOf()
  if (uri === 'qpu://lean') return qpuLeanOf()
  if (uri === 'qpu://fused') return { kind: 'fused', tools: qpuMcpFusedOf(), call: 'tools/call { name, arguments }' }
  if (uri === 'qpu://hologram') {
    const h = hologramOf()
    return { kind: h.kind, root: h.root, publicKeys: h.publicKeys, entries: h.entries, scales: Object.fromEntries(Object.entries(h.streams).map(([k, v]) => [k, { length: v.length, head: v.at(-1)?.uuid }])), holds: h.holds }
  }
  const [, kind, key] = /^qpu:\/\/(receipts|formulas|hex|hologram)\/(.+)$/.exec(uri) ?? []
  const name = key ? decodeURIComponent(key) : ''
  if (kind === 'receipts') return qpuReceiptStreamsOf().streams.find((s) => s.stream === name)
  if (kind === 'formulas') return qpuHexFamiliesOf().has(name) ? { family: name, formulas: qpuHexFamiliesOf().get(name)!.map((f, i) => ({ nibble: (i + 1).toString(16), name: f.name, arity: f.arity })) } : undefined
  if (kind === 'hex') return qpuHexRunOf(name)
  if (kind === 'hologram') return hologramOf().streams[name] ? { scale: name, root: hologramOf().root, publicKey: hologramOf().publicKeys[name], fragments: hologramOf().streams[name] } : undefined
  return undefined
}

const PROMPTS: Prompt[] = [
  { name: 'prove', title: 'Prove the unit', description: 'Run qpu_prove and report every face that holds and any that does not', arguments: [], messages: () => 'Call the tool qpu_prove with {}. Report each face with its holds value, and name any face that does not hold with the reading that failed.' },
  {
    name: 'continue', title: 'Continue the walk', description: 'Resume the autonomous walk: qpu_train names the next door; call it and repeat until no face fails',
    arguments: [{ name: 'from', description: 'Registry window to resume at (the next value of the previous qpu_train reply)' }],
    messages: (a) => `Call qpu_train with ${JSON.stringify({ live: true, ...(a.from ? { from: Number(a.from) } : {}) })}. Read its next and steps, call the door it names, then call qpu_train again with from set to the reply's next. Continue until a reply has no failing face or no next, and summarise every step with its receipt.`,
  },
  { name: 'factor', title: 'Factor with Shor', description: "Factor n with the unit's Shor run and explain the period", arguments: [{ name: 'n', description: 'Modulus to factor', required: true }], messages: (a) => `Call crypto_rsa with { "n": ${JSON.stringify(a.n)} }. Report the base, the period found or why none was resolvable, the factors, and the receipt.` },
  {
    name: 'hex-program', title: 'Program a hex UUID', description: 'Compose formulas of a family into a hex program and run it',
    arguments: [{ name: 'family', description: 'Formula family', required: true }, { name: 'formulas', description: 'Comma-separated formula names, in order', required: true }, { name: 'params', description: 'Up to three comma-separated naturals' }],
    messages: (a) => {
      const program = a.formulas!.split(',').map((x) => x.trim()).filter(Boolean)
      const params = (a.params ?? '').split(',').map((x) => x.trim()).filter(Boolean).map(Number)
      let uuid: string
      try {
        uuid = qpuHexUuidOf({ family: a.family!, program, params })
      } catch (e) {
        throw invalid((e as Error).message)
      }
      return `The program ${a.family} [${program.join(', ')}] over (${params.join(', ')}) is the UUID ${uuid}. Read the resource qpu://hex/${uuid}, report each step's value and the run's receipt, and say whether it holds.`
    },
  },
  {
    name: 'research', title: 'Research a human request', description: 'Deep-research any request through the doors: what the unit computes exactly, what the public record says live, what is reached by several families, and what is not known — every step receipted, nothing invented',
    arguments: [{ name: 'request', description: 'The request in the human\'s words (for example "Dreamspell")', required: true }],
    messages: (a) => `The request: ${JSON.stringify(a.request)}. This server does not reason; you do, with exact pieces. 1. Call any sealed door with { doors: true } and name the families and doors that bear on the request; for each, run its formulas through { hex: { family, program, params } } or { door: "family.formula", arguments: { params } } and keep the value and the receipt of every run. 2. For what the public record must settle (a correlation, a constant, a date, a reading), call { door: "qpu_data", arguments: { source: "all" } } for the sources the unit already checks, and { door: "qpu_api", arguments: { api: <name> } } for any public API of the registry; cite the url, status and receipt of every reading. 3. Call { door: "qpu_discover", arguments: { live: [the numbers you read] } } and report every value that two or more families reach: that is the cross-domain explanation. 4. Call { errors: true } and report every warning or error with what resolves it. 5. Answer the human in their words: what is computed (with addresses), what the record says (with receipts), what several domains agree on, and what remains unknown or is a parameter they must supply. Never state a value you did not read or compute.`,
  },
  {
    name: 'develop', title: 'Develop a request into formulas', description: 'Turn a request into formulas of a family, tests first, crossed with the public record, committed through the gate',
    arguments: [{ name: 'request', description: 'What to develop, in the human\'s words', required: true }],
    messages: (a) => `Develop ${JSON.stringify(a.request)} the way this unit develops: 1. Write the test first: what the formulas must answer, as assertions, including one run of each at its hex address and one reading of the live host. 2. Find the family it belongs to with { doors: true } (a family holds fifteen formulas — rule.cap; past that, a sibling family). 3. Write each formula as a function of naturals that returns a value with holds, registered with qpuHexRegisterOf; nothing listed by hand (the registry is generated: run the repo generator). 4. Cross it with the public record: { hex: { family: "data", program: ["research"], params: [f] } } for the family's index — the APIs its formula names find, read live — and { hex: { family: "data", program: ["discover"], params: [n] } } for what other families reach too. 5. The gate decides: { hex: { family: "gate", program: ["commit"], params: [f] } } must hold before the commit. Report every value and receipt; never state a number you did not compute or read.`,
  },
  {
    name: 'imagine', title: 'Imagine what the combinations could hold', description: 'From the families, formulas and live readings, propose compositions and families not yet reached — as addresses to run, never as claims',
    arguments: [{ name: 'about', description: 'A domain, a question, or empty for the whole lattice' }],
    messages: (a) => `Imagine${a.about ? ` about ${JSON.stringify(a.about)}` : ''}, as addresses, not as claims. 1. Read the families and formulas with { doors: true } and the last discovery with { hex: { family: "data", program: ["discover"], params: [50] } }: which families reach values no other family reaches (unrelated), which pairs of families never meet. 2. For each gap, name a composition — two formulas of different families whose values could meet, or a parameter range not yet tried — and mint its address with { hex: { family, program: [a, b], params } }; run it; keep what holds. 3. For a request no family answers, name the family it would need: its fifteen formulas as functions of naturals, the public APIs that would cross it ({ door: "qpu_api", arguments: { search: "..." } }), and the test that would prove it. 4. Rank by what the record can meet: a composition a live reading reaches outranks one nothing reaches. Report addresses, values and receipts; mark every proposal as a proposal.`,
  },
  {
    name: 'refactor', title: 'Refactor by the rules', description: 'Find what the rules reject — hand lists, wrapped doors, sweeps without slices, families past their nibble, hot files — and change the code until the rule formulas hold',
    arguments: [{ name: 'scope', description: 'A file, a family, or empty for the whole unit' }],
    messages: (a) => `Refactor${a.scope ? ` ${JSON.stringify(a.scope)}` : ' the unit'} by the rules, which are formulas: 1. Run { hex: { family: "rule", program: ["over"] } } and, for each family index, ["truncated"]: a family past fifteen is split into a sibling family (as cal/kin), never trimmed. 2. Run { hex: { family: "heat", program: ["temperature"], params: [commits, days] } } over the hottest files (the heat receipt names them): a hot file is split along the regions that keep changing (the cool script), never rewritten. 3. Find every hand list: a module named in an import list, a slug in a target list, a family in a description — each becomes a registry the generator writes or a value read from the unit. 4. Find every door that wraps a door and every sweep that reads a whole set in one call: the first becomes a hex program at an address, the second a slice with { from, take } and next. 5. Find every limit raised by hand: it is removed and the work split. 6. Run the tests and the gate: { hex: { family: "gate", program: ["push"], params: [0] } } must hold, slice by slice. Report each change as the rule it satisfied and the receipt that shows it holding.`,
  },
  { name: 'hologram', title: 'Verify a hologram scale', description: 'Check that every fragment of a scale chains, is signed by its scale key and reaches the root', arguments: [{ name: 'scale', description: 'Hologram scale', required: true }], messages: (a) => `Read qpu://hologram/${a.scale}. For each fragment check that prev is the UUID before it, and that folding its proof from the leaf reaches its root. Report the root and any fragment that does not hold.` },
]

const LEVELS = ['debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency'] as const
let level: (typeof LEVELS)[number] = 'info'

const completeOf = (ref: { type?: unknown; name?: unknown; uri?: unknown }, arg: { name?: unknown; value?: unknown }, context: Record<string, string>): string[] => {
  const name = String(arg.name ?? '')
  if (ref.type === 'ref/prompt') {
    if (name === 'family') return families()
    if (name === 'formulas') return (qpuHexFamiliesOf().get(context.family ?? '') ?? []).map((f) => f.name)
    if (name === 'n') return ['15', '21', '35', '91', '143', '221']
    if (name === 'scale') return Object.keys(hologramOf().streams)
    if (name === 'from') return ['0']
  }
  if (ref.type === 'ref/resource') {
    if (name === 'stream') return streams()
    if (name === 'family') return families()
    if (name === 'scale') return Object.keys(hologramOf().streams)
    if (name === 'uuid') return [qpuHexCatalogOf().example.uuid]
  }
  return []
}

qpuMcpRegisterOf('resources/list', (p) => {
  const { page, ...rest } = paged('resources', resourcesOf(), (r) => r.uri, p)
  return { resources: page, ...rest }
}, { resources: { subscribe: false, listChanged: false } })

qpuMcpRegisterOf('resources/templates/list', (p) => {
  const { page, ...rest } = paged('templates', TEMPLATES, (t) => t.uriTemplate, p)
  return { resourceTemplates: page, ...rest }
})

qpuMcpRegisterOf('resources/read', async (p) => {
  const uri = String(p.uri ?? '')
  const value = await readOf(uri)
  if (value === undefined) throw rpcError(-32002, `Resource not found: ${uri || '(none)'}`, { uri })
  return json(uri, value)
})

qpuMcpRegisterOf('prompts/list', (p) => {
  const { page, ...rest } = paged('prompts', PROMPTS, (x) => x.name, p)
  return { prompts: page.map(({ messages, ...x }) => x), ...rest }
}, { prompts: { listChanged: false } })

qpuMcpRegisterOf('prompts/get', (p) => {
  const prompt = PROMPTS.find((x) => x.name === p.name)
  if (!prompt) throw invalid(`Unknown prompt: ${String(p.name ?? '(none)')}`, { prompts: PROMPTS.map((x) => x.name) })
  const args = Object.fromEntries(Object.entries((p.arguments ?? {}) as Params).map(([k, v]) => [k, String(v)]))
  const missing = prompt.arguments.filter((a) => a.required && !args[a.name]).map((a) => a.name)
  if (missing.length) throw invalid(`Missing required arguments: ${missing.join(', ')}`)
  return { description: prompt.description, messages: [{ role: 'user', content: { type: 'text', text: prompt.messages(args) } }] }
})

qpuMcpRegisterOf('completion/complete', (p) => {
  const ref = (p.ref ?? {}) as { type?: unknown; name?: unknown; uri?: unknown }
  const arg = (p.argument ?? {}) as { name?: unknown; value?: unknown }
  const context = Object.fromEntries(Object.entries(((p.context as Params | undefined)?.arguments ?? {}) as Params).map(([k, v]) => [k, String(v)]))
  const prefix = String(arg.value ?? '').toLowerCase()
  const all = completeOf(ref, arg, context).filter((v) => v.toLowerCase().startsWith(prefix))
  return { completion: { values: all.slice(0, 100), total: all.length, hasMore: all.length > 100 } }
}, { completions: {} })

qpuMcpRegisterOf('logging/setLevel', (p) => {
  if (!LEVELS.includes(p.level as (typeof LEVELS)[number])) throw invalid(`Unknown level: ${String(p.level)}`, { levels: LEVELS })
  level = p.level as (typeof LEVELS)[number]
  return {}
}, { logging: {} })

// every request is answered inside its POST, so there is never one in flight to cancel
qpuMcpRegisterOf('notifications/cancelled', () => ({}))
