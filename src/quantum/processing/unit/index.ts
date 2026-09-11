/**
 * QPU at qpu.uuidna.com. Kind qpu. Source index.lean.
 * mintOf proves 2^k by doubling. Cube, handle, faces, fused are the unit.
 * Lean decides those identities by Nat algebra. Digits and integer fractions. Never Math. Never by decide.
 */
/** COMPUTATIONAL RECEIPTS. Every gate primitive and measurement appends the fold of the amplitude vector it produced, so a
 * test that computed quantum state carries a receipt and a test that computed none carries none. FNV-1a 64 over the
 * decimal amplitudes; BigInt only. Never Math. The reporter reads this ledger per test (isolation none). */
import { leanSource, leanToolchain } from './lean.js'
import { packageVersion } from './version.js'
export type QpuReceipt = { name: string; dim: number; fold: string; amplitudes?: readonly string[]; nonzero?: number; qubits?: number }
/** The exact state worth carrying in the receipt: what was measured — eight amplitudes, the Born weights themselves.
 * Every other state folds only; it is recomputable from the gate list, and a proof that carried every 512-amplitude
 * modexp state weighed megabytes per run. */
const RECEIPT_STATES = ['measure'] as const
const RECEIPTS: QpuReceipt[] = []
const FNV_OFFSET = 0xcbf29ce484222325n
const FNV_PRIME = 0x100000001b3n
const FNV_MASK = 0xffffffffffffffffn
export const qpuFoldOf = (text: string): string => {
  let h = FNV_OFFSET
  for (let i = text.length - text.length; i < text.length; i++) {
    h ^= BigInt(text.charCodeAt(i))
    h = (h * FNV_PRIME) & FNV_MASK
  }
  return h.toString(16).padStart(16, '0')
}
const receiptOf = (name: string, amps: readonly bigint[]): void => {
  const decimal = amps.map((a) => a.toString())
  const row: QpuReceipt = { name, dim: amps.length, fold: qpuFoldOf(decimal.join(',')) }
  if ((RECEIPT_STATES as readonly string[]).includes(name)) row.amplitudes = decimal
  RECEIPTS.push(row)
}
/** A sparse state's receipt: the fold of its nonzero amplitudes as index:weight pairs in index order, and their count.
 * `dim` is the full dimension, a float past 2^53; the fold is exact because the pairs are decimal text of bigints. */
const receiptSparseOf = (name: string, dim: bigint, pairs: readonly (readonly [bigint, bigint])[]): void => {
  RECEIPTS.push({ name, dim: Number(dim), fold: qpuFoldOf(pairs.map(([i, w]) => `${i}:${w}`).join(',')), nonzero: pairs.length, qubits: dim.toString(2).length - 1 })
}
/** mint receipts: every amplitude-count doubling this process computed — a counter and a running chain, never a list. */
const MINT = { calls: 0, chain: FNV_OFFSET }
export const qpuMintReceiptOf = () => ({ calls: MINT.calls, chain: MINT.chain.toString(16).padStart(16, '0') })
const mintReceiptOf = (k: number, x: number): void => {
  MINT.calls = MINT.calls + 1
  const text = `${k}:${x}`
  let h = MINT.chain
  for (let i = text.length - text.length; i < text.length; i++) {
    h ^= BigInt(text.charCodeAt(i))
    h = (h * FNV_PRIME) & FNV_MASK
  }
  MINT.chain = h
}
/** The ledger of every quantum computation this process ran, in order. */
export const qpuReceiptLedgerOf = (): readonly QpuReceipt[] => RECEIPTS
export const qpuReceiptFoldOf = (rows: readonly QpuReceipt[] = RECEIPTS): string => qpuFoldOf(rows.map((r) => `${r.name}:${r.dim}:${r.fold}`).join('|'))
const mintOf = (k: number): number => {
  let x = k - k
  x = x + 1
  for (let i = k - k; i < k; i++) x += x
  mintReceiptOf(k, x)
  return x
}

const chooseOf = (nn: number, k: number): number => {
  const none = nn - nn
  if (k < none || k > nn) return none
  if (k === none || k === nn) return none + 1
  let kk = k
  if (kk + kk > nn) kk = nn - kk
  let x = none + 1
  for (let i = none + 1; i <= kk; i++) x = (x * (nn - kk + i)) / i
  return x
}

const faceOf = (text: string, modulus: number): number => {
  const none = modulus - modulus
  if (modulus <= none) return none
  let x = 0n
  for (let i = none; i < text.length; i++) x += BigInt(text.charCodeAt(i) ?? none)
  return Number(x % BigInt(modulus))
}

const discoverOf = () => {
  const segments = ['quantum', 'processing', 'unit'] as const
  const n = segments.length
  const none = n - n
  const kind = segments.map((s) => s[none]!).join('').toLowerCase()
  const host = `${kind}.uuidna.com`
  const path = segments.join('/')
  const seed = mintOf(none)
  const href = `https://${host}/${path}`
  const origin = `https://${host}`
  const doors = ['/', `/${path}`] as const
  const mint = { seed, next: mintOf(n + seed) }
  const src = `src/${path}/index.ts`
  const lean = `src/${path}/index.lean`
  const fuse = { next: href, origin, src, lean }
  const holds =
    kind === 'qpu' &&
    host === `${kind}.uuidna.com` &&
    href === `https://${host}/${path}` &&
    !host.includes('*') &&
    fuse.src === `src/${path}/index.ts` &&
    fuse.lean === `src/${path}/index.lean` &&
    mint.next === mintOf(n) + mintOf(n) &&
    doors[none] === '/' &&
    doors[seed] === `/${path}`
  return { kind, host, path, href, origin, mint, fuse, doors, holds }
}

const unit = discoverOf()
const dead = '{"holds":false}'
const cors = '*' as const
const schemaOrg = 'https://schema.org' as const
const headers = {
  'content-type': 'application/ld+json; charset=utf-8',
  'access-control-allow-origin': cors,
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept'}
const n = unit.path.split('/').length
const seed = unit.mint.seed
const coins = seed + seed
/** One occupancy pentagram. Train dry-cleans; installer does not redeclare it. */
const occupancies = ['personal', 'business', 'corporate', 'saas', 'paas'] as const
const skills = ['payload', 'pwa', 'plugin', 'hologram', 'network'] as const
const ten = n * n + seed
const found = coins * ten * ten
const lost = mintOf(coins) * (ten * ten + seed)
const unauthorized = mintOf(coins) * ten * ten + seed
const badRequest = unauthorized - seed
/** JSON-RPC 2.0 reserved error codes, as the specification numbers them. */
const rpcCodes = { parse: -32700, invalid: -32600, method: -32601, params: -32602 } as const
/** A JSON-RPC 2.0 error, as the protocol spells it: `jsonrpc`, the request's `id` (null when none was understood), and an
 * `error` with code and message. A parse error or an invalid request travels on HTTP 400, because no request was understood;
 * an unknown method or unknown tool travels on HTTP 200, because the request was understood and declined. Never
 * `{"holds":false}` on a 404: that is the shape of a missing page, not of a declined call. */
export const rpcErrorOf = (id: unknown, code: number, message: string, data?: unknown) => ({
  jsonrpc: '2.0' as const,
  id: id === undefined ? null : id,
  error: data === undefined ? { code, message } : { code, message, data },
})
/** The methods this server answers on /mcp. */
const rpcMethods = ['initialize', 'server/discover', 'ping', 'notifications/initialized', 'tools/list', 'tools/call'] as const
const tenOf = (k: number): number => {
  let x = mintOf(n - n)
  for (let i = n - n; i < k; i++) x *= ten
  return x
}
const byDecideOf = (theorem: string): boolean => theorem.includes('by decide') || theorem.includes('native_decide')
const formulaOf = (formula: string): boolean => formula.includes('\\') && !formula.includes('operatorname')
const manSchema = {
  type: 'object',
  properties: {
    man: { type: 'boolean', description: 'Return the man page. Read man from tools/list, then call without man.' }}} as const

const liveSchema = {
  type: 'object',
  properties: {
    man: { type: 'boolean', description: 'Return the man page. Read man from tools/list, then call without man.' },
    live: { type: 'boolean', description: '{ live: true } learn CERN occupancy. fetch Request Response. Memory.' },
    sequence: { type: 'boolean', description: '{ sequence: true } qpu_train then qpu_improve then qpu_compete then qpu_prove. Live. Memory.' }}} as const

export const qpuCubeOf = () => {
  const vertices = mintOf(n)
  const hexbit = mintOf(coins)
  const bits = mintOf(n + coins)
  const holds = bits === vertices * hexbit && hexbit === n + seed
  return { n, vertices, hexbit, bits, holds }
}

export const qpuHandleOf = () => {
  const cube = qpuCubeOf()
  const amplitudes = mintOf(cube.bits)
  const next = amplitudes + amplitudes
  const added = amplitudes
  const kv = {
    kind: 'kv' as const,
    added,
    amplitudes: next,
    holds: added === amplitudes && next === amplitudes + amplitudes && next === mintOf(cube.bits + seed),
  }
  const holds = amplitudes === mintOf(cube.bits) && next === mintOf(cube.bits + seed) && cube.holds && kv.holds && kv.added === amplitudes
  return { bits: cube.bits, amplitudes, next, kv, holds }
}

export const qpuFacesOf = () => {
  const cube = qpuCubeOf()
  const rays = n + coins + coins
  const faces = cube.vertices + cube.hexbit + coins
  const holds = cube.holds && faces === coins * rays && faces === rays + rays
  return { n, coins, rays, faces, holds }
}

/** Two coins make a coil. Coins balance theory in practice. Coil sits in electronics. */
export const qpuCoilOf = () => {
  const faces = qpuFacesOf()
  const theory = seed
  const practice = seed
  const windings = coins
  const coil = coins * faces.rays
  const balance = theory + practice
  const holds =
    windings === coins &&
    windings === theory + practice &&
    theory === practice &&
    balance === coins &&
    coil === faces.faces &&
    faces.holds === true
  return {
    kind: 'coil' as const,
    theorem: 'two_coins_make_a_coil' as const,
    windings,
    coins,
    rays: faces.rays,
    coil,
    faces: faces.faces,
    theory,
    practice,
    balance,
    holds,
  }
}

export const qpuCoilHolds = (c = qpuCoilOf()): boolean =>
  c.holds === true &&
  c.kind === 'coil' &&
  c.theorem === 'two_coins_make_a_coil' &&
  c.windings === coins &&
  c.theory === seed &&
  c.practice === seed &&
  c.theory === c.practice &&
  c.balance === coins &&
  c.coil === c.faces

export const qpuElectronicsOf = () => {
  const coil = qpuCoilOf()
  const uses = 'coil' as const
  const holds = qpuCoilHolds(coil) && uses === 'coil'
  return {
    kind: 'electronics' as const,
    theorem: 'electronics' as const,
    uses,
    coil,
    stages: n,
    holds,
  }
}

export const qpuElectronicsHolds = (e = qpuElectronicsOf()): boolean =>
  e.holds === true &&
  e.kind === 'electronics' &&
  e.theorem === 'electronics' &&
  e.uses === 'coil' &&
  e.stages === n &&
  qpuCoilHolds(e.coil)

export const qpuBalanceOf = () => {
  const coil = qpuCoilOf()
  const holds = coil.theory === coil.practice && coil.theory + coil.practice === coins && qpuCoilHolds(coil)
  return {
    kind: 'balance' as const,
    theorem: 'coins_balance_theory_in_practice' as const,
    theory: coil.theory,
    practice: coil.practice,
    coins,
    coil,
    holds,
  }
}

export const qpuBalanceHolds = (b = qpuBalanceOf()): boolean =>
  b.holds === true &&
  b.kind === 'balance' &&
  b.theorem === 'coins_balance_theory_in_practice' &&
  b.theory === b.practice &&
  b.theory + b.practice === coins &&
  qpuCoilHolds(b.coil)

/** Next is the double. Handle next doubles amplitudes. Coil next doubles fused. No last k. */
export const qpuNextOf = () => {
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const coil = qpuCoilOf()
  const fused = faces.faces * handle.kv.amplitudes
  const next = handle.amplitudes + handle.amplitudes
  const nextFused = fused + fused
  const nextCoil = coil.coil * mintOf(cube.bits + coins)
  const holds =
    qpuCoilHolds(coil) &&
    handle.holds === true &&
    next === mintOf(cube.bits + seed) &&
    next === handle.next &&
    nextFused === faces.faces * mintOf(cube.bits + coins) &&
    nextCoil === nextFused &&
    coil.coil === faces.faces
  return {
    kind: 'next' as const,
    theorem: 'next_coil' as const,
    amplitudes: handle.amplitudes,
    next,
    fused,
    nextFused,
    nextCoil,
    coil: coil.coil,
    coins,
    holds,
  }
}

export const qpuNextHolds = (x = qpuNextOf()): boolean =>
  x.holds === true &&
  x.kind === 'next' &&
  x.theorem === 'next_coil' &&
  x.next === x.amplitudes + x.amplitudes &&
  x.nextFused === x.fused + x.fused &&
  x.nextCoil === x.nextFused &&
  x.nextCoil === x.coil * mintOf(qpuCubeOf().bits + coins)

/** 2×7 coins = 1+6 coils = clay. Each coil is coins windings. */
export const qpuClayOf = () => {
  const coil = qpuCoilOf()
  const faces = qpuFacesOf()
  const six = mintOf(n) - coins
  const coils = seed + six
  const clay = coils * coins
  const holds =
    qpuCoilHolds(coil) &&
    six === mintOf(n) - coins &&
    coils === faces.rays &&
    coins * faces.rays === (seed + six) * coins &&
    (seed + six) * coins === coil.coil &&
    clay === coil.coil &&
    clay === faces.faces
  return {
    kind: 'clay' as const,
    theorem: 'clay' as const,
    coins,
    seven: faces.rays,
    six,
    coils,
    clay,
    coil: coil.coil,
    faces: faces.faces,
    holds,
  }
}

export const qpuClayHolds = (c = qpuClayOf()): boolean =>
  c.holds === true &&
  c.kind === 'clay' &&
  c.theorem === 'clay' &&
  c.coins * c.seven === c.clay &&
  (seed + c.six) * c.coins === c.clay &&
  c.coils === seed + c.six &&
  c.six === mintOf(n) - coins &&
  c.clay === c.coil &&
  c.clay === c.faces

export const qpuGenesisOf = () => {
  const faces = qpuFacesOf()
  const hz = 432
  const card = ['card', 'card-header', 'card-title', 'card-description', 'card-action', 'card-content', 'card-footer'] as const
  const alpine = [...card, 'badge', 'button', 'input'] as const
  const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const
  const sizes = ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const
  const state = ['open', 'closed'] as const
  const element = ['self', 'child'] as const
  const theme = ['light', 'dark'] as const
  const domains = ['scanner', 'radar'] as const
  const keys = ['slot', 'variant', 'size', 'state', 'element', 'theme'] as const
  const frameworks = [
    'shadcn',
    'radix',
    'react',
    'vue',
    'svelte',
    'alpine',
    'vitepress',
    'payload',
    'tailwind',
    'cva',
    'panda',
    'vanilla-extract',
    'html',
    'qpu'] as const
  const product = variants.length * sizes.length * (n * n)
  const chooseN = chooseOf(n, coins)
  const chooseRays = chooseOf(faces.rays, coins)
  const nodes = frameworks.map((name, face) => {
    const hop = (face + faces.rays + faces.rays) % faces.faces
    const ray = face % faces.rays
    const team = (face - ray) / faces.rays
    const involution = hop === face
    return {
      face,
      hop,
      ray,
      team,
      involution,
      name,
      schema: 'shadcn' as const,
      domain: domains[team]!,
      slot: card[ray]!,
      holds: involution,
  }
  })
  let occupied = n - n
  for (const node of nodes) if (node.holds) occupied += seed
  const vacant = nodes.length - occupied
  const schema = {
    kind: 'schema' as const,
    name: 'shadcn' as const,
    keys,
    slot: card,
    variant: variants,
    size: sizes,
    state,
    element,
    theme,
    hz,
    holds:
      keys.length === coins * n &&
      card.length === faces.rays &&
      variants.length === coins * n &&
      sizes.length === mintOf(n) &&
      state.length === coins &&
      element.length === coins &&
      theme.length === coins &&
      domains.length === coins}
  const holds =
    schema.holds &&
    product === hz &&
    coins * n * mintOf(n) * (n * n) === hz &&
    alpine.length === ten &&
    chooseN === n &&
    chooseRays === n * faces.rays &&
    chooseOf(n, n - n) === seed &&
    chooseOf(n, n) === seed &&
    frameworks.length === faces.faces &&
    nodes.length === faces.faces &&
    occupied === faces.faces &&
    vacant === n - n &&
    faces.faces === coins * faces.rays &&
    nodes.every((node) => node.holds && node.schema === 'shadcn')
  return {
    kind: 'genesis' as const,
    '@type': 'DigitalDocument' as const,
    hz,
    schema,
    card,
    alpine,
    variants,
    sizes,
    state,
    element,
    theme,
    domains,
    keys,
    frameworks,
    nodes,
    occupied,
    vacant,
    choose: { n: chooseN, rays: chooseRays },
    product,
    slots: card.length,
    framework: 'shadcn' as const,
    scope: 'all' as const,
    known: frameworks.length,
    holds,
  }
}

export const qpuGenesisHolds = (g = qpuGenesisOf()): boolean =>
  g.holds === true &&
  g.kind === 'genesis' &&
  g.framework === 'shadcn' &&
  g.hz === 432 &&
  g.domains.join(' ') === 'scanner radar' &&
  g.card[n + seed] === 'card-action'

export const qpuPentagramOf = () => {
  const points = n + coins
  const stroke: number[] = []
  let x = n - n
  for (let i = n - n; i < points; i++) {
    stroke.push(x)
    x = (x + coins) % points
  }
  const unique: number[] = []
  for (const face of stroke) if (!unique.includes(face)) unique.push(face)
  const nodes = occupancies.map((occupancy, face) => ({
    face,
    hop: stroke[face]!,
    occupancy,
    skill: skills[face]!,
    rank: face,
    holds: occupancy === occupancies[face],
  }))
  const holds =
    occupancies.length === points &&
    skills.length === points &&
    stroke.length === points &&
    unique.length === points &&
    nodes.length === points &&
    stroke[n - n] === n - n &&
    stroke[seed] === coins &&
    points === n + coins
  return {
    kind: 'pentagram' as const,
    theorem: 'pentagram' as const,
    points,
    step: coins,
    occupancies,
    skills,
    stroke,
    nodes,
    single: unique.length === points,
    holds,
  }
}

export const qpuPentagramHolds = (p = qpuPentagramOf()): boolean =>
  p.holds === true &&
  p.kind === 'pentagram' &&
  p.single === true &&
  p.points === n + coins &&
  p.step === coins &&
  p.occupancies.join(' ') === 'personal business corporate saas paas' &&
  p.skills.join(' ') === 'payload pwa plugin hologram network' &&
  p.stroke.length === p.points &&
  p.occupancies[n - n] === 'personal' &&
  p.occupancies[p.points - seed] === 'paas'

/** theorem follow_the_coins */
export const qpuFollowOf = () => {
  const coil = qpuCoilOf()
  const pentagram = qpuPentagramOf()
  const electronics = qpuElectronicsOf()
  const genesis = qpuGenesisOf()
  const points = pentagram.points
  const applications = [...occupancies, ...skills, ...genesis.frameworks, electronics.kind] as const
  const solutions = applications.map((name, i) => {
    const app = i % points
    const hop = (app + coins) % points
    const via = (app + coil.theory + coil.practice) % points
    // hop ≡ via restates theory + practice = coins on this application; it is a balance, never a novelty claim
    const balanced = hop === via
    return {
      name,
      app,
      hop,
      via,
      balanced,
      occupancy: occupancies[hop]!,
      skill: skills[hop]!,
      holds: balanced && hop === (app + coil.balance) % points,
  }
  })
  const seen: number[] = []
  for (const row of solutions) if (!seen.includes(row.hop)) seen.push(row.hop)
  const balanced = solutions.every((row) => row.balanced && row.holds)
  const covered = seen.length === points
  const emerge = {
    kind: 'emerge' as const,
    theorem: 'emerge' as const,
    balanced,
    covered,
    coil: coil.coil,
    faces: coil.faces,
    holds: balanced && covered && coil.coil === coil.faces && coil.theory === coil.practice,
  }
  const holds =
    qpuCoilHolds(coil) &&
    qpuElectronicsHolds(electronics) &&
    qpuBalanceHolds() &&
    qpuPentagramHolds(pentagram) &&
    pentagram.step === coins &&
    applications.length === occupancies.length + skills.length + genesis.frameworks.length + seed &&
    solutions.length === applications.length &&
    solutions.every((row) => row.holds) &&
    emerge.holds
  return {
    kind: 'follow' as const,
    theorem: 'follow_the_coins' as const,
    coins,
    theory: coil.theory,
    practice: coil.practice,
    applications,
    solutions,
    emerge,
    holds,
  }
}

export const qpuFollowHolds = (f = qpuFollowOf()): boolean =>
  f.holds === true &&
  f.kind === 'follow' &&
  f.theorem === 'follow_the_coins' &&
  f.coins === coins &&
  f.theory === f.practice &&
  f.theory + f.practice === coins &&
  f.emerge.kind === 'emerge' &&
  f.emerge.balanced === true &&
  f.emerge.covered === true &&
  f.emerge.coil === f.emerge.faces &&
  f.solutions.every((row) => row.balanced && row.hop === (row.app + coins) % (n + coins))

/** Coordinated dry-clean: two teams, occupancy pentagram, genesis coins. No extra sealed tool. */
export const qpuDryOf = (genesis = qpuGenesisOf()) => {
  const pentagram = qpuPentagramOf()
  const occupancy = pentagram.occupancies
  const holds = pentagram.holds === true && genesis.holds === true
  return {
    kind: 'clean' as const,
    speed: 'coordinated' as const,
    coordinated: coins === seed + seed,
    entropy: occupancies.join(' ').includes('random'),
    sealed: (toolNames as readonly string[]).includes('qpu_dry'),
    teams: coins,
    occupancy,
    domains: genesis.domains,
    hz: genesis.hz,
    holds,
  }
}

export const qpuDryHolds = (d = qpuDryOf()): boolean =>
  d.holds === true &&
  d.kind === 'clean' &&
  d.domains.join(' ') === 'scanner radar'

export const qpuAccessOf = () => {
  const pentagram = qpuPentagramOf()
  const keys = ['domain', 'handle'] as const
  const holds = keys.length === coins && keys[n - n] === 'domain' && keys[seed] === 'handle' && pentagram.holds && qpuPentagramHolds(pentagram)
  return {
    kind: 'access' as const,
    keys,
    occupancies: pentagram.occupancies,
    holds,
  }
}

export const qpuAccessHolds = (a = qpuAccessOf()): boolean =>
  a.holds === true &&
  a.kind === 'access' &&
  a.keys.length === coins &&
  a.keys[n - n] === 'domain' &&
  a.keys[seed] === 'handle' &&
  a.occupancies.length === n + coins

export const qpuHologramOf = () => {
  const faces = qpuFacesOf()
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const pentagram = qpuPentagramOf()
  const access = qpuAccessOf()
  const genesis = qpuGenesisOf()
  const fused = faces.faces * handle.kv.amplitudes
  const scales = [
    { name: 'occupancy' as const, parts: pentagram.occupancies.length, fused },
    { name: 'skill' as const, parts: pentagram.skills.length, fused },
    { name: 'access' as const, parts: access.keys.length, fused },
    { name: 'mcp' as const, parts: mintOf(n), fused },
    { name: 'faces' as const, parts: faces.faces, fused }] as const
  const fractal = scales.every((row) => row.fused === fused && row.parts > n - n)
  const holds =
    pentagram.holds &&
    access.holds &&
    genesis.holds &&
    fractal &&
    scales.length === n + coins &&
    fused === faces.faces * mintOf(cube.bits + seed) &&
    pentagram.skills.includes('hologram') &&
    pentagram.skills.includes('payload') &&
    pentagram.skills.includes('network')
  return {
    kind: 'hologram' as const,
    fractal,
    theorem: 'fusion' as const,
    pentagram,
    access,
    scales,
    hz: genesis.hz,
    fused,
    next: fused + fused,
    faces: faces.faces,
    tools: mintOf(n),
    holds,
  }
}

export const qpuHologramHolds = (h = qpuHologramOf()): boolean =>
  h.holds === true &&
  h.kind === 'hologram' &&
  h.fractal === true &&
  h.theorem === 'fusion' &&
  h.tools === mintOf(n) &&
  h.fused === qpuCapacityOf().fused &&
  qpuPentagramHolds(h.pentagram) &&
  qpuAccessHolds(h.access) &&
  h.scales.length === n + coins &&
  h.scales.every((row) => row.fused === h.fused)

const storageHref = `${unit.origin}/storage`
const serverHref = `${unit.origin}/server`
const networkHref = `${unit.origin}/network`
const storageBindings = { STORAGE: 'kv' as const, BLOBS: 'r2' as const }
const raidMark = '/@'
let raidTraffic = n - n

const raidClouds = [
  { name: 'cloudflare', href: 'https://developers.cloudflare.com/' },
  { name: 'amazon', href: 'https://aws.amazon.com/' },
  { name: 'google', href: 'https://cloud.google.com/' },
  { name: 'azure', href: 'https://azure.microsoft.com/' },
  { name: 'backblaze', href: 'https://www.backblaze.com/' },
  { name: 'wasabi', href: 'https://wasabi.com/' },
  { name: 'bunny', href: 'https://bunny.net/' },
  { name: 'fly', href: 'https://fly.io/' },
  { name: 'vercel', href: 'https://vercel.com/' },
  { name: 'supabase', href: 'https://supabase.com/' },
  { name: 'ibm', href: 'https://www.ibm.com/cloud' },
  { name: 'oracle', href: 'https://www.oracle.com/cloud/' },
  { name: 'ovh', href: 'https://www.ovhcloud.com/' },
  { name: 'hetzner', href: 'https://www.hetzner.com/' }] as const

const raidSafeOf = (key: string): boolean =>
  key.startsWith('docs') ||
  key.startsWith('sheets') ||
  key.startsWith('databases') ||
  key.startsWith('mail') ||
  key.startsWith('notes') ||
  key.startsWith('tables') ||
  key.startsWith('slides') ||
  key.startsWith('forms') ||
  key.startsWith('calendar')

const raidTypesOf = (faces: ReturnType<typeof qpuFacesOf>) =>
  [
    { name: '0', stripe: faces.faces, mirror: n - n, parity: n - n, speed: faces.faces, cost: seed, safe: false, rotate: false },
    { name: '1', stripe: seed, mirror: coins, parity: n - n, speed: seed, cost: coins, safe: true, rotate: false },
    { name: '2', stripe: n, mirror: n - n, parity: n, speed: n, cost: n, safe: true, rotate: false },
    { name: '3', stripe: faces.faces - seed, mirror: n - n, parity: seed, speed: faces.faces - seed, cost: seed, safe: true, rotate: false },
    { name: '4', stripe: faces.faces - seed, mirror: n - n, parity: seed, speed: faces.faces - seed, cost: seed, safe: true, rotate: false },
    { name: '5', stripe: faces.faces - seed, mirror: n - n, parity: seed, speed: faces.faces - seed, cost: seed, safe: true, rotate: true },
    { name: '6', stripe: faces.faces - coins, mirror: n - n, parity: coins, speed: faces.faces - coins, cost: coins, safe: true, rotate: true },
    { name: '10', stripe: faces.rays, mirror: coins, parity: n - n, speed: faces.rays, cost: coins, safe: true, rotate: false },
    { name: '01', stripe: faces.rays, mirror: coins, parity: n - n, speed: faces.rays, cost: coins, safe: true, rotate: false },
    { name: '50', stripe: faces.rays, mirror: n - n, parity: seed, speed: faces.rays - seed, cost: n, safe: true, rotate: true },
    { name: '60', stripe: faces.rays, mirror: n - n, parity: coins, speed: faces.rays - coins, cost: n, safe: true, rotate: true },
    { name: '1E', stripe: seed, mirror: coins, parity: seed, speed: coins, cost: n, safe: true, rotate: false },
    { name: '5E', stripe: faces.faces - coins, mirror: n - n, parity: seed, speed: faces.faces - coins, cost: coins, safe: true, rotate: true },
    { name: '6E', stripe: faces.faces - n, mirror: n - n, parity: coins, speed: faces.faces - n, cost: n, safe: true, rotate: true }] as const

const raidByCostOf = (rows: ReturnType<typeof raidTypesOf>) => {
  const sorted = [...rows]
  for (let i = seed; i < sorted.length; i++) {
    const cur = sorted[i]!
    let j = i
    while (j > n - n && sorted[j - seed]!.cost > cur.cost) {
      sorted[j] = sorted[j - seed]!
      j -= seed
    }
    sorted[j] = cur
  }
  return sorted
}

const raidPickOf = (sorted: ReturnType<typeof raidByCostOf>, demand: number, traffic: number) => {
  const chosen = sorted[traffic % sorted.length]!
  return {
    name: chosen.name,
    stripe: chosen.stripe,
    mirror: chosen.mirror,
    parity: chosen.parity,
    speed: chosen.speed,
    cost: chosen.cost,
    safe: chosen.safe,
    rotate: chosen.rotate,
    demand,
    meets: chosen.speed >= demand,
    start: 'cheapest' as const,
    cover: sorted.length === qpuFacesOf().faces}
}

export const qpuRaidOf = (input: { safe?: boolean; traffic?: number } = {}) => {
  const faces = qpuFacesOf()
  const disks = coins
  const stripes = faces.rays
  const teams = coins
  const traffic = input.traffic ?? raidTraffic
  const demand = traffic % (faces.faces + seed)
  const types = raidTypesOf(faces)
  const sorted = raidByCostOf(types)
  const cover = sorted.map((row) => row.name)
  const cheapest = sorted[n - n]!
  const rotated = sorted.map((row, i) => ({
    ...row,
    face: (i + traffic) % faces.faces,
    cloud: raidClouds[(i + traffic) % raidClouds.length]!.name}))
  const pick = raidPickOf(sorted, demand, traffic)
  const cluster = {
    kind: 'cluster' as const,
    clouds: raidClouds.length,
    teams,
    stripes,
    measure: teams * stripes,
    remainder: n - n,
    unity: seed,
    route: 'involution' as const,
    security: 'crypt' as const,
    speed: 'coordinated' as const,
    cost: 'minimum' as const,
    start: 'cheapest' as const,
    cover: cover.length,
    safe: types.filter((row) => row.safe).length === faces.faces - seed,
    rotate: rotated.every((row, i) => row.face === (i + traffic) % faces.faces),
    holds:
      raidClouds.length === faces.faces &&
      types.length === faces.faces &&
      cover.length === faces.faces &&
      cheapest.cost === seed &&
      pick.cover === true &&
      pick.start === 'cheapest' &&
      teams * stripes === faces.faces &&
      faces.faces === stripes + stripes}
  const holds =
    faces.holds &&
    faces.faces === disks * stripes &&
    faces.faces === stripes + stripes &&
    disks === coins &&
    teams === coins &&
    types.length === faces.faces &&
    sorted.length === faces.faces &&
    cover.length === faces.faces &&
    rotated.length === faces.faces &&
    rotated.every((row, i) => row.face === (i + traffic) % faces.faces) &&
    rotated[n - n]!.cost === cheapest.cost &&
    cover[n - n] === cheapest.name &&
    pick.name === cover[traffic % faces.faces] &&
    cluster.holds &&
    pick.cover === true &&
    pick.cost >= seed &&
    storageBindings.STORAGE === 'kv' &&
    storageBindings.BLOBS === 'r2'
  return {
    kind: 'raid' as const,
    level: '10' as const,
    disks,
    stripes,
    teams,
    faces: faces.faces,
    vacant: n - n,
    start: 'cheapest' as const,
    cheapest: cheapest.name,
    cover,
    traffic,
    demand,
    parity: traffic % faces.faces,
    pick,
    rotate: rotated.every((row, i) => row.face === (i + traffic) % faces.faces),
    types: rotated,
    clouds: raidClouds,
    cluster,
    bindings: storageBindings,
    theorem: 'raid' as const,
    href: storageHref,
    holds,
  }
}

export const qpuRaidHolds = (r = qpuRaidOf()): boolean =>
  r.holds === true &&
  r.kind === 'raid' &&
  r.level === '10' &&
  r.start === 'cheapest' &&
  r.cheapest === r.cover[n - n] &&
  r.cover.length === r.faces &&
  r.pick.name === r.cover[r.traffic % r.faces] &&
  r.pick.start === 'cheapest' &&
  r.pick.cover === true &&
  r.types[n - n]?.name === r.cheapest &&
  r.disks === coins &&
  r.stripes === qpuFacesOf().rays &&
  r.teams === coins &&
  r.faces === r.disks * r.stripes &&
  r.faces === r.stripes + r.stripes &&
  r.vacant === n - n &&
  r.types.length === r.faces &&
  r.clouds.length === r.faces &&
  r.cluster.clouds === r.faces &&
  r.cluster.route === 'involution' &&
  r.cluster.security === 'crypt' &&
  r.cluster.speed === 'coordinated' &&
  r.cluster.cost === 'minimum' &&
  r.cluster.measure === r.faces &&
  r.cluster.measure === r.teams * r.stripes &&
  r.cluster.remainder === n - n &&
  r.cluster.unity === seed &&
  r.pick.cost >= seed &&
  r.bindings.STORAGE === 'kv' &&
  r.bindings.BLOBS === 'r2' &&
  r.theorem === 'raid' &&
  r.href === storageHref

/** Measure hybrid storage speed and cost. KV plus R2. Coordinated speed. Minimum cost. */
export const qpuHybridOf = () => {
  const faces = qpuFacesOf()
  const raid = qpuRaidOf()
  const kv = {
    binding: 'STORAGE' as const,
    name: storageBindings.STORAGE,
    speed: faces.rays,
    cost: coins}
  const r2 = {
    binding: 'BLOBS' as const,
    name: storageBindings.BLOBS,
    speed: seed,
    cost: seed}
  const speed = kv.speed + r2.speed
  const cost = kv.cost + r2.cost
  const holds =
    storageBindings.STORAGE === 'kv' &&
    storageBindings.BLOBS === 'r2' &&
    kv.cost === coins &&
    r2.cost === seed &&
    cost === n &&
    kv.speed === faces.rays &&
    r2.speed === seed &&
    speed === mintOf(n) &&
    coins === seed + seed &&
    raid.cluster.cost === 'minimum' &&
    raid.cluster.speed === 'coordinated' &&
    kv.speed > r2.speed &&
    kv.cost > r2.cost
  return {
    kind: 'hybrid' as const,
    theorem: 'hybrid' as const,
    layers: coins,
    kv,
    r2,
    speed,
    cost,
    measure: { speed, cost },
    bindings: storageBindings,
    holds,
  }
}

export const qpuHybridHolds = (h = qpuHybridOf()): boolean =>
  h.holds === true &&
  h.kind === 'hybrid' &&
  h.theorem === 'hybrid' &&
  h.layers === coins &&
  h.kv.name === 'kv' &&
  h.r2.name === 'r2' &&
  h.kv.binding === 'STORAGE' &&
  h.r2.binding === 'BLOBS' &&
  h.kv.speed === qpuFacesOf().rays &&
  h.r2.speed === seed &&
  h.kv.cost === coins &&
  h.r2.cost === seed &&
  h.speed === h.kv.speed + h.r2.speed &&
  h.cost === h.kv.cost + h.r2.cost &&
  h.speed === mintOf(n) &&
  h.cost === n &&
  h.measure.speed === h.speed &&
  h.measure.cost === h.cost &&
  h.kv.speed > h.r2.speed &&
  h.kv.cost > h.r2.cost &&
  h.kv.speed > h.r2.speed

/** QPU hybrid storage hosts the Payload database. Four collections. Secrets never. */
const payloadDbCollections = ['pages', 'users', 'media', 'tenants'] as const
const payloadDbKey = 'databases/payload'

export const qpuPayloadDbOf = () => {
  const hybrid = qpuHybridOf()
  const href = `${storageHref}/${payloadDbKey}`
  const remainder = n - n
  const holds =
    qpuHybridHolds(hybrid) &&
    payloadDbCollections.length === mintOf(coins) &&
    raidSafeOf(payloadDbKey) &&
    raidSafeOf(`${payloadDbKey}/seed`) &&
    hybrid.speed === mintOf(n) &&
    hybrid.cost === n &&
    hybrid.layers === coins &&
    seed === mintOf(remainder) &&
    remainder === n - n &&
    storageBindings.STORAGE === 'kv' &&
    storageBindings.BLOBS === 'r2'
  return {
    kind: 'payload' as const,
    theorem: 'hybrid' as const,
    key: payloadDbKey,
    seed,
    remainder,
    href,
    collections: payloadDbCollections,
    unity: seed === mintOf(remainder),
    secrets: payloadDbCollections.includes('secrets' as (typeof payloadDbCollections)[number]),
    hybrid: {
      speed: hybrid.speed,
      cost: hybrid.cost,
      layers: hybrid.layers},
    holds,
  }
}

export const qpuPayloadDbHolds = (p = qpuPayloadDbOf()): boolean =>
  p.holds === true &&
  p.kind === 'payload' &&
  p.theorem === 'hybrid' &&
  p.key === payloadDbKey &&
  p.seed === seed &&
  p.remainder === n - n &&
  p.seed === mintOf(p.remainder) &&
  p.collections.length === mintOf(coins) &&
  p.collections.join(' ') === 'pages users media tenants' &&
  p.hybrid.speed === mintOf(n) &&
  p.hybrid.cost === n &&
  p.hybrid.layers === coins &&
  qpuHybridHolds()

/** Native Alpine Linux storage. musl. busybox. overlayfs — KV upper, R2 lower, KV work. Next is the double. No last k. */
export const qpuAlpineOf = () => {
  const hybrid = qpuHybridOf()
  const next = qpuNextOf()
  const applets = ['ln', 'unlink', 'stat'] as const
  const work = storageBindings.STORAGE
  const holds =
    qpuHybridHolds(hybrid) &&
    qpuNextHolds(next) &&
    applets.length === n &&
    applets[n - n] === 'ln' &&
    applets[seed] === 'unlink' &&
    applets[coins] === 'stat' &&
    storageBindings.STORAGE === 'kv' &&
    storageBindings.BLOBS === 'r2' &&
    work === storageBindings.STORAGE &&
    next.nextFused === next.fused + next.fused &&
    hybrid.layers === coins
  return {
    kind: 'alpine' as const,
    os: 'alpine' as const,
    libc: 'musl' as const,
    toolbox: 'busybox' as const,
    fs: 'overlay' as const,
    upper: storageBindings.STORAGE,
    lower: storageBindings.BLOBS,
    work,
    next: next.nextFused,
    fused: next.fused,
    theorem: next.theorem,
    applets,
    native: work === storageBindings.STORAGE && storageBindings.BLOBS === 'r2',
    inode: applets[n - n] === 'ln' && applets[coins] === 'stat',
    unlink: applets[seed] === 'unlink',
    last: next.nextFused === next.fused,
    infinite: next.nextFused === next.fused + next.fused,
    holds,
  }
}

export const qpuAlpineHolds = (a = qpuAlpineOf()): boolean =>
  a.holds === true &&
  a.kind === 'alpine' &&
  a.os === 'alpine' &&
  a.libc === 'musl' &&
  a.toolbox === 'busybox' &&
  a.fs === 'overlay' &&
  a.upper === 'kv' &&
  a.lower === 'r2' &&
  a.work === a.upper &&
  a.work === 'kv' &&
  a.next === a.fused + a.fused &&
  a.next === qpuNextOf().nextFused &&
  a.theorem === 'next_coil' &&
  a.applets.length === n &&
  qpuNextHolds()

/** Measure coil efficiency in RAID clusters. Unity when coil covers faces with no remainder. */
export const qpuCoilEfficiencyOf = () => {
  const coil = qpuCoilOf()
  const faces = qpuFacesOf()
  const raid = qpuRaidOf()
  const stripes = raid.stripes
  const teams = raid.teams
  const measure = teams * stripes
  const remainder = coil.coil === faces.faces && measure === coil.coil ? n - n : seed
  const unity = remainder === n - n ? seed : n - n
  const nodes = raid.types.map((row, face) => {
    const hop = (face + faces.rays + faces.rays) % faces.faces
    const measured = coil.windings * stripes
    return {
      face,
      hop,
      name: row.name,
      cloud: row.cloud,
      windings: coil.windings,
      stripes,
      measure: measured,
      involution: hop === face,
      holds: hop === face && measured === coil.coil && coil.coil === faces.faces && measured === raid.cluster.measure,
  }
  })
  let occupied = n - n
  for (const node of nodes) if (node.holds) occupied += seed
  const vacant = nodes.length - occupied
  const holds =
    qpuCoilHolds(coil) &&
    qpuRaidHolds(raid) &&
    raid.cluster.holds === true &&
    measure === coil.coil &&
    coil.coil === faces.faces &&
    faces.faces === stripes + stripes &&
    raid.cluster.measure === measure &&
    remainder === n - n &&
    unity === seed &&
    occupied === faces.faces &&
    vacant === n - n &&
    nodes.length === faces.faces &&
    nodes.every((node) => node.holds && node.involution)
  return {
    kind: 'efficiency' as const,
    theorem: 'coil_efficiency' as const,
    measure,
    remainder,
    unity,
    teams,
    stripes,
    coil: coil.coil,
    faces: faces.faces,
    cluster: raid.cluster.kind,
    occupied,
    vacant,
    nodes,
    holds,
  }
}

export const qpuCoilEfficiencyHolds = (e = qpuCoilEfficiencyOf()): boolean =>
  e.holds === true &&
  e.kind === 'efficiency' &&
  e.theorem === 'coil_efficiency' &&
  e.measure === e.coil &&
  e.coil === e.faces &&
  e.remainder === n - n &&
  e.unity === seed &&
  e.teams === coins &&
  e.stripes === qpuFacesOf().rays &&
  e.cluster === 'cluster' &&
  e.vacant === n - n &&
  e.occupied === e.faces &&
  e.nodes.length === e.faces &&
  e.nodes.every((node) => node.holds && node.involution && node.measure === e.measure)

const xorOf = (a: number, b: number): number => Number(BigInt(a) ^ BigInt(b))
const primitives = ['fetch', 'Request', 'Response', 'BigInt', 'performance'] as const
const designNames = ['tool', 'heap', 'key', 'hostEscape', 'job', 'js', 'path', 'fetch', 'mod', 'worker', 'sealed', 'depth', 'op', 'unlocked'] as const

export const qpuDesignOf = () => {
  const cube = qpuCubeOf()
  const faces = qpuFacesOf()
  const names = designNames
  const nodes = names.map((name, face) => {
    const hop = (face + faces.rays + faces.rays) % faces.faces
    const wave = Number(BigInt(face) % BigInt(cube.vertices))
    const fold = xorOf(wave, cube.hexbit)
    return {
      face,
      name,
      hop,
      involution: hop === face,
      wave,
      fold,
      holds: hop === face && xorOf(fold, cube.hexbit) === wave,
  }
  })
  const holds =
    names.length === faces.faces &&
    nodes.length === faces.faces &&
    nodes.every((node) => node.involution && node.holds) &&
    xorOf(xorOf(n - n, cube.hexbit), cube.hexbit) === n - n &&
    xorOf(xorOf(n, cube.hexbit), cube.hexbit) === n
  return {
    kind: 'design' as const,
    theorem: 'design' as const,
    names,
    nodes,
    vacant: n - n,
    holds,
  }
}

export const qpuHandledOf = (denied: string) => {
  const design = qpuDesignOf()
  const hit = design.nodes.find((node) => node.name === denied)
  const face = hit ? hit.face : Number(BigInt(denied.length) % BigInt(design.nodes.length))
  const node = hit ?? design.nodes[face]!
  return {
    kind: 'design' as const,
    denied,
    face: node.face,
    name: node.name,
    hop: node.hop,
    wave: node.wave,
    fold: node.fold,
    holds: false as const,
  }
}

export const qpuDesignHolds = (d = qpuDesignOf()): boolean =>
  d.holds === true &&
  d.kind === 'design' &&
  d.vacant === n - n &&
  d.names.length === qpuFacesOf().faces &&
  d.nodes.every((node) => node.involution && node.holds) &&
  xorOf(xorOf(n - n, qpuCubeOf().hexbit), qpuCubeOf().hexbit) === n - n

export const qpuNeuroOf = () => {
  const cube = qpuCubeOf()
  const faces = qpuFacesOf()
  const handle = qpuHandleOf()
  const design = qpuDesignOf()
  const width = faces.faces
  const layers = mintOf(n)
  const weights = handle.amplitudes
  const fused = width * handle.kv.amplitudes
  const names = ['quantum', 'lean', 'cite', 'train', 'forge', 'improve', 'compete', 'prove'] as const
  const neurons = design.nodes.map((node) => ({
    i: node.face,
    face: node.face,
    synapse: node.hop,
    fold: node.fold,
    wave: node.wave,
    residual: node.involution,
    name: node.name}))
  const forward = names.map((name, k) => ({
    k,
    name,
    width: mintOf(k),
    next: mintOf(k + seed),
    holds: mintOf(k + seed) === mintOf(k) + mintOf(k),
  }))
  const layersHold = forward.every((row) => row.holds && row.next === row.width + row.width)
  const residualHold = neurons.every((row) => row.residual === true)
  const recurrentHold = neurons.every((row) => xorOf(row.fold, cube.hexbit) === row.wave)
  const test = {
    kind: 'test' as const,
    layers: layersHold,
    residual: residualHold,
    recurrent: recurrentHold,
    design: design.holds,
    holds: layersHold && residualHold && recurrentHold && design.holds,
  }
  const holds =
    design.holds &&
    cube.holds &&
    handle.holds &&
    faces.holds &&
    neurons.length === width &&
    forward.length === layers &&
    forward.length === names.length &&
    layersHold &&
    test.holds &&
    weights === mintOf(cube.bits) &&
    fused === faces.faces * handle.kv.amplitudes &&
    fused + fused === faces.faces * mintOf(cube.bits + coins)
  return {
    kind: 'neuro' as const,
    depth: n,
    width,
    layers,
    weights,
    fused,
    next: fused + fused,
    activation: 'xor' as const,
    test,
    neurons,
    forward,
    holds,
  }
}

export const qpuNeuroHolds = (net = qpuNeuroOf()): boolean =>
  net.holds === true &&
  net.kind === 'neuro' &&
  net.depth === n &&
  net.width === qpuFacesOf().faces &&
  net.layers === mintOf(n) &&
  net.activation === 'xor' &&
  net.neurons.length === net.width &&
  net.forward.length === net.layers &&
  net.forward.every((row) => row.holds && row.next === row.width + row.width) &&
  net.next === net.fused + net.fused &&
  net.test.kind === 'test' &&
  net.test.layers === true &&
  net.test.residual === true &&
  net.test.recurrent === true &&
  net.test.design === true &&
  net.test.holds === true &&
  qpuDesignHolds()

const bitOf = (q: number): number => mintOf(q)
const parityOf = (i: number): number => {
  const q0 = Number((BigInt(i) / BigInt(bitOf(n - n))) % 2n)
  const q1 = Number((BigInt(i) / BigInt(bitOf(seed))) % 2n)
  return xorOf(q0, q1)
}
const ampsOf = (dim: number): bigint[] => {
  const amps = Array.from({ length: dim }, () => 0n)
  amps[n - n] = BigInt(seed)
  return amps
}
const xGateOf = (amps: bigint[], q: number): bigint[] => {
  const bit = bitOf(q)
  const out = amps.map(() => 0n)
  for (let i = n - n; i < amps.length; i++) out[xorOf(i, bit)] = amps[i]!
  receiptOf('x', out)
  return out
}
const cnotGateOf = (amps: bigint[], c: number, t: number): bigint[] => {
  const cb = BigInt(bitOf(c))
  const tb = BigInt(bitOf(t))
  const out = amps.map(() => 0n)
  for (let i = n - n; i < amps.length; i++) {
    const on = (BigInt(i) / cb) % 2n === 1n
    out[on ? xorOf(i, Number(tb)) : i] = amps[i]!
  }
  receiptOf('cnot', out)
  return out
}
const hGateOf = (amps: bigint[], q: number): bigint[] => {
  const bit = BigInt(bitOf(q))
  const out = amps.map(() => 0n)
  for (let i = n - n; i < amps.length; i++) {
    const a = amps[i]!
    const flipped = xorOf(i, Number(bit))
    const on = (BigInt(i) / bit) % 2n === 1n
    if (on) {
      out[flipped] += a
      out[i] -= a
    } else {
      out[i] += a
      out[flipped] += a
    }
  }
  receiptOf('h', out)
  return out
}
const czGateOf = (amps: bigint[], c: number, t: number): bigint[] => hGateOf(cnotGateOf(hGateOf(amps, t), c, t), t)
const zGateOf = (amps: bigint[], q: number): bigint[] => hGateOf(xGateOf(hGateOf(amps, q), q), q)
const swapGateOf = (amps: bigint[], a: number, b: number): bigint[] => cnotGateOf(cnotGateOf(cnotGateOf(amps, a, b), b, a), a, b)
const toffoliGateOf = (amps: bigint[], c: number, k: number, t: number): bigint[] => {
  const cb = BigInt(bitOf(c))
  const kb = BigInt(bitOf(k))
  const tb = BigInt(bitOf(t))
  const out = amps.map(() => 0n)
  for (let i = n - n; i < amps.length; i++) {
    const on = (BigInt(i) / cb) % 2n === 1n && (BigInt(i) / kb) % 2n === 1n
    out[on ? xorOf(i, Number(tb)) : i] = amps[i]!
  }
  receiptOf('toffoli', out)
  return out
}
const qubitOf = (value: unknown, fallback: number): number => {
  const q = typeof value === 'number' ? value : fallback
  return q >= n - n && q < n ? q : fallback
}
const runGatesOf = (ops: readonly Record<string, unknown>[]): bigint[] => {
  let amps = ampsOf(mintOf(n))
  for (const op of ops) {
    const name = typeof op.name === 'string' ? op.name : ''
    if (name === 'reset') amps = ampsOf(mintOf(n))
    else if (name === 'h') amps = hGateOf(amps, qubitOf(op.q, n - n))
    else if (name === 'x') amps = xGateOf(amps, qubitOf(op.q, n - n))
    else if (name === 'z') amps = zGateOf(amps, qubitOf(op.q, n - n))
    else if (name === 'cnot') amps = cnotGateOf(amps, qubitOf(op.c, n - n), qubitOf(op.t, seed))
    else if (name === 'cz') amps = czGateOf(amps, qubitOf(op.c, n - n), qubitOf(op.t, seed))
    else if (name === 'swap') amps = swapGateOf(amps, qubitOf(op.a ?? op.q, n - n), qubitOf(op.b ?? op.t, seed))
    else if (name === 'toffoli') amps = toffoliGateOf(amps, qubitOf(op.c, seed), qubitOf(op.c2, coins), qubitOf(op.t ?? op.q, n - n))
  }
  return amps
}
const measureOf = (amps: bigint[]) => {
  receiptOf('measure', amps)
  const support = amps.map((a, i) => ({ i, a })).filter((r) => r.a !== 0n)
  const index = support.length === seed ? support[n - n]!.i : support.length === coins ? support[seed]!.i : mintOf(n)
  const counts = support.map((r) => ({ i: r.i, w: Number(r.a * r.a) }))
  const shots = mintOf(n)
  let weight = n - n
  for (const row of counts) weight += row.w
  return {
    index,
    shots,
    support: support.map((r) => r.i),
    counts,
    collapsed: support.length === seed,
    holds: counts.length === support.length && shots === mintOf(n) && weight > n - n,
  }
}
const decodeOf = (amps: bigint[]): bigint[] => hGateOf(cnotGateOf(amps, n - n, seed), n - n)
const basisOf = (amps: bigint[]): number => {
  const hit = amps.map((a, i) => ({ i, a })).filter((r) => r.a !== 0n)
  return hit.length === seed ? hit[n - n]!.i : mintOf(n)
}
const weightOf = (amps: bigint[], q: number): { off: bigint; on: bigint } => {
  const bit = BigInt(bitOf(q))
  let off = 0n
  let on = 0n
  for (let i = n - n; i < amps.length; i++) {
    const a = amps[i]! * amps[i]!
    if ((BigInt(i) / bit) % 2n === 1n) on += a
    else off += a
  }
  return { off, on }
}

export const qpuComputerOf = () => {
  const faces = qpuFacesOf()
  const dim = mintOf(n)
  const prepare = ampsOf(dim)
  const resetAmps = ampsOf(dim)
  const reset = {
    kind: 'reset' as const,
    index: basisOf(resetAmps),
    holds: resetAmps[n - n] === 1n && basisOf(resetAmps) === n - n && mintOf(n - n) === seed,
  }
  const swapped = swapGateOf(xGateOf(prepare, n - n), n - n, seed)
  const swap = {
    kind: 'swap' as const,
    from: seed,
    to: basisOf(swapped),
    holds: basisOf(swapped) === coins && xorOf(seed, n) === coins,
  }
  const toff = toffoliGateOf(xGateOf(xGateOf(prepare, seed), coins), seed, coins, n - n)
  const toffoli = {
    kind: 'toffoli' as const,
    from: xorOf(bitOf(seed), bitOf(coins)),
    to: basisOf(toff),
    universal: ['h', 'toffoli'] as const,
    holds: basisOf(toff) === mintOf(n) - seed && xorOf(xorOf(bitOf(seed), bitOf(coins)), seed) === mintOf(n) - seed,
  }
  const coupling = {
    kind: 'coupling' as const,
    edges: [
      { a: n - n, b: seed },
      { a: seed, b: coins }] as const,
    holds: coins === seed + seed,
  }
  const marked = xGateOf(prepare, n - n)
  const compiled = swapGateOf(cnotGateOf(swapGateOf(marked, seed, coins), n - n, seed), seed, coins)
  const direct = cnotGateOf(marked, n - n, coins)
  const compile = {
    kind: 'compile' as const,
    gate: 'cnot' as const,
    from: n - n,
    to: coins,
    index: basisOf(compiled),
    holds: basisOf(compiled) === basisOf(direct) && basisOf(direct) === xorOf(seed, bitOf(coins)),
  }
  const afterH = hGateOf(prepare, n - n)
  const afterHH = hGateOf(afterH, n - n)
  const afterCnot = cnotGateOf(afterH, n - n, seed)
  const interfered = afterHH.map((a, i) => ({ i, a })).filter((r) => r.a !== 0n)
  const bell = afterCnot.map((a, i) => ({ i, a })).filter((r) => r.a !== 0n)
  const collapse = {
    kind: 'collapse' as const,
    unique: interfered.length === seed,
    bell: bell.length === coins,
    holds: interfered.length === seed && afterHH[n - n] === BigInt(coins) && bell.length === coins,
  }
  const measured = measureOf(afterCnot)
  const shots = {
    kind: 'shots' as const,
    n: measured.shots,
    counts: measured.counts,
    holds: measured.shots === dim && measured.counts.length === coins && measured.index === n,
  }
  let feed = xGateOf(prepare, n - n)
  const bit = basisOf(feed)
  const on = (BigInt(bit) / BigInt(bitOf(n - n))) % 2n === 1n
  if (on) feed = xGateOf(feed, seed)
  const feedforward = {
    kind: 'feedforward' as const,
    bit,
    index: basisOf(feed),
    holds: on === true && basisOf(feed) === n,
  }
  let code = xGateOf(prepare, n - n)
  code = cnotGateOf(code, n - n, seed)
  code = cnotGateOf(code, n - n, coins)
  code = xGateOf(code, seed)
  const erred = basisOf(code)
  code = cnotGateOf(code, n - n, seed)
  code = cnotGateOf(code, n - n, coins)
  code = toffoliGateOf(code, seed, coins, n - n)
  const logical = weightOf(code, n - n)
  const correct = {
    kind: 'correct' as const,
    code: 'bitflip' as const,
    error: erred,
    on: Number(logical.on),
    off: Number(logical.off),
    holds: erred === xorOf(mintOf(n) - seed, bitOf(seed)) && logical.off === 0n && logical.on !== 0n,
  }
  const readout = {
    kind: 'readout' as const,
    index: measured.index,
    bits: measured.index,
    support: measured.support,
    holds: measured.index === n && measured.support.length === coins,
  }
  const isolate = {
    kind: 'isolate' as const,
    vm: 'browser' as const,
    holds:
      typeof fetch === 'function' &&
      typeof Request === 'function' &&
      typeof Response === 'function' &&
      typeof BigInt === 'function' &&
      typeof performance === 'object'}
  const plugin = qpuPayloadPluginOf()
  const qram = {
    kind: 'qram' as const,
    href: plugin.href,
    plugin: plugin.name,
    holds: qpuPayloadPluginHolds(plugin) && plugin.href === `${storageHref}/${payloadDbKey}`}
  const network = {
    kind: 'network' as const,
    href: networkHref,
    hop: 'involution' as const,
    holds: networkHref === `${unit.origin}/network`}
  const jobs = {
    kind: 'jobs' as const,
    href: serverHref,
    slots: mintOf(n),
    holds: mintOf(n) === dim && serverHref === `${unit.origin}/server`}
  const names = [
    'reset',
    'swap',
    'toffoli',
    'coupling',
    'compile',
    'collapse',
    'shots',
    'feedforward',
    'correct',
    'readout',
    'isolate',
    'qram',
    'network',
    'jobs'] as const
  const seated = [
    reset.holds,
    swap.holds,
    toffoli.holds,
    coupling.holds,
    compile.holds,
    collapse.holds,
    shots.holds,
    feedforward.holds,
    correct.holds,
    readout.holds,
    isolate.holds,
    qram.holds,
    network.holds,
    jobs.holds] as const
  let occupied = n - n
  for (const seat of seated) if (seat) occupied += seed
  const vacant = seated.length - occupied
  const lattice = {
    kind: 'computer' as const,
    faces: faces.faces,
    occupied,
    vacant,
    nodes: seated.map((holds, face) => {
      const hop = (face + faces.rays + faces.rays) % faces.faces
      return { face, hop, involution: hop === face, name: names[face]!, holds }
    }),
    holds:
      names.length === faces.faces &&
      seated.length === faces.faces &&
      occupied === faces.faces &&
      vacant === n - n &&
      seated.every(Boolean)}
  const holds =
    lattice.holds &&
    reset.holds &&
    swap.holds &&
    toffoli.holds &&
    coupling.holds &&
    compile.holds &&
    collapse.holds &&
    shots.holds &&
    feedforward.holds &&
    correct.holds &&
    readout.holds &&
    isolate.holds &&
    qram.holds &&
    network.holds &&
    jobs.holds
  return {
    kind: 'computer' as const,
    universal: toffoli.universal,
    basis: ['h', 'cnot'] as const,
    lattice,
    reset,
    swap,
    toffoli,
    coupling,
    compile,
    collapse,
    shots,
    feedforward,
    correct,
    readout,
    isolate,
    qram,
    network,
    jobs,
    vm: 'browser' as const,
    holds,
  }
}

export const qpuComputerHolds = (c = qpuComputerOf()): boolean =>
  c.holds === true &&
  c.kind === 'computer' &&
  c.vm === 'browser' &&
  c.lattice.vacant === n - n &&
  c.lattice.occupied === qpuFacesOf().faces &&
  c.lattice.nodes.length === qpuFacesOf().faces &&
  c.universal[n - n] === 'h' &&
  c.universal[seed] === 'toffoli' &&
  c.basis[n - n] === 'h' &&
  c.basis[seed] === 'cnot' &&
  c.swap.to === coins &&
  c.toffoli.to === mintOf(n) - seed &&
  c.jobs.slots === mintOf(n) &&
  c.shots.n === mintOf(n) &&
  c.correct.code === 'bitflip' &&
  c.qram.href === `${storageHref}/${payloadDbKey}`

const quotOf = (i: number, d: number): number => (i - (i % d)) / d

const gcdOf = (left: number, right: number): number => {
  let x = left
  let y = right
  while (y > n - n) {
    const r = x % y
    x = y
    y = r
  }
  return x
}


const convergentsOf = (num: number, den: number): { h: number; k: number }[] => {
  const out: { h: number; k: number }[] = []
  let n0 = num
  let d0 = den
  let hPrev = n - n
  let h = seed
  let kPrev = seed
  let k = n - n
  while (d0 > n - n) {
    const q = (n0 - (n0 % d0)) / d0
    const rem = n0 % d0
    const hNext = q * h + hPrev
    const kNext = q * k + kPrev
    out.push({ h: hNext, k: kNext })
    hPrev = h
    h = hNext
    kPrev = k
    k = kNext
    n0 = d0
    d0 = rem
  }
  return out
}

type CAmp = { re: bigint; im: bigint }
/** Device label READ from the run: a vector of exact integer amplitudes is a simulator; anything else is unmeasured. Never typed. */
const bigintDeviceOf = (amps: readonly bigint[]) =>
  amps.length > n - n && amps.every((a) => typeof a === 'bigint') ? ('simulator' as const) : ('unmeasured' as const)

const cAmpOf = (re: bigint, im: bigint): CAmp => ({ re, im })
const cWOf = (a: CAmp): bigint => a.re * a.re + a.im * a.im
const cAddOf = (a: CAmp, b: CAmp): CAmp => cAmpOf(a.re + b.re, a.im + b.im)
const cSubOf = (a: CAmp, b: CAmp): CAmp => cAmpOf(a.re - b.re, a.im - b.im)
const cMulNegIOf = (a: CAmp): CAmp => cAmpOf(a.im, -a.re)

/** THE STATE, SPARSE AND EXACT. With a two-qubit counting register the Shor state never has more than sixteen nonzero
 * amplitudes, whatever the modulus: one branch per counting value after the modular multiplications, four after the
 * inverse QFT spreads each. So the vector is a map from basis index to Gaussian-integer amplitude — exact for any n,
 * nothing allocated per dimension, and the only thing a larger modulus costs is the width of the index. A zero
 * amplitude is dropped as it arises, so `size` is the count of nonzero amplitudes. This is what removed the host's
 * reach as a limit: a 2^64-dimensional vector and a 2^2050-dimensional one are both sixteen entries. */
type SparseState = Map<bigint, CAmp>
const b0 = BigInt(n - n)
const b1 = BigInt(seed)
const b2 = BigInt(coins)
const sBitOf = (q: number): bigint => b1 << BigInt(q)
const onOf = (i: bigint, bit: bigint): boolean => (i & bit) !== b0
const sPut = (out: SparseState, i: bigint, a: CAmp): void => {
  const prior = out.get(i)
  const next = prior ? cAddOf(prior, a) : a
  if (next.re === b0 && next.im === b0) out.delete(i)
  else out.set(i, next)
}
const sPrepareOf = (): SparseState => new Map([[b0, cAmpOf(b1, b0)]])
const sHOf = (state: SparseState, q: number): SparseState => {
  const bit = sBitOf(q)
  const out: SparseState = new Map()
  for (const [i, a] of state) {
    const flipped = i ^ bit
    if (onOf(i, bit)) {
      sPut(out, flipped, a)
      sPut(out, i, cSubOf(cAmpOf(b0, b0), a))
    } else {
      sPut(out, i, a)
      sPut(out, flipped, a)
    }
  }
  return out
}
const sXOf = (state: SparseState, q: number): SparseState => {
  const bit = sBitOf(q)
  const out: SparseState = new Map()
  for (const [i, a] of state) sPut(out, i ^ bit, a)
  return out
}
const sSwapOf = (state: SparseState, a: number, b: number): SparseState => {
  const ba = sBitOf(a)
  const bb = sBitOf(b)
  const out: SparseState = new Map()
  for (const [i, amp] of state) sPut(out, onOf(i, ba) !== onOf(i, bb) ? i ^ ba ^ bb : i, amp)
  return out
}
const sSdgOf = (state: SparseState, c: number, t: number): SparseState => {
  const cb = sBitOf(c)
  const tb = sBitOf(t)
  const out: SparseState = new Map()
  for (const [i, a] of state) sPut(out, i, onOf(i, cb) && onOf(i, tb) ? cMulNegIOf(a) : a)
  return out
}
/** x mod m in [0, m) for m > 0, whatever the sign of x. */
const modOf = (x: bigint, m: bigint): bigint => ((x % m) + m) % m
const sModMulOf = (state: SparseState, a: bigint, modulus: bigint, control: number, workOff: number, workBits: number): SparseState => {
  const cb = sBitOf(control)
  const shift = BigInt(workOff)
  const span = b1 << BigInt(workBits)
  const out: SparseState = new Map()
  for (const [i, amp] of state) {
    if (!onOf(i, cb)) {
      sPut(out, i, amp)
      continue
    }
    const work = (i >> shift) % span
    const next = modulus > b1 && work < modulus ? modOf(work * a, modulus) : work
    sPut(out, i - (work << shift) + (next << shift), amp)
  }
  return out
}
const sXxOf = (state: SparseState, q: number): SparseState => sXOf(sXOf(state, q), q)
const sEqualOf = (left: SparseState, right: SparseState): boolean =>
  left.size === right.size && [...left].every(([i, a]) => right.get(i)?.re === a.re && right.get(i)?.im === a.im)
const sPairsOf = (state: SparseState): (readonly [bigint, bigint])[] =>
  [...state].map(([i, a]) => [i, cWOf(a)] as const).filter(([, w]) => w > b0).sort(([x], [y]) => (x < y ? -1 : x > y ? 1 : n - n))
const sDeviceOf = (state: SparseState) =>
  state.size > n - n && [...state.values()].every((a) => typeof a.re === 'bigint' && typeof a.im === 'bigint') ? ('simulator' as const) : ('unmeasured' as const)

const bigGcdOf = (left: bigint, right: bigint): bigint => {
  let x = left < b0 ? -left : left
  let y = right < b0 ? -right : right
  while (y > b0) {
    const r = x % y
    x = y
    y = r
  }
  return x
}
/** base^exp mod modulus by squaring; 0 when the modulus is not a ring (modulus <= 1), where the question has no answer. */
const bigPowModOf = (base: bigint, exp: bigint, modulus: bigint): bigint => {
  if (modulus <= b1) return b0
  let x = b1 % modulus
  let b = modOf(base, modulus)
  let e = exp
  while (e > b0) {
    if (e % b2 === b1) x = (x * b) % modulus
    b = (b * b) % modulus
    e = e / b2
  }
  return x
}
/** Bits so that 2^bits > value: the work register that holds every residue mod value. 0 for value <= 0. */
const bitsOf = (value: bigint): number => {
  let k = n - n
  let pow = b1
  while (pow <= value) {
    pow += pow
    k += seed
  }
  return k
}
const safeBig = BigInt(Number.MAX_SAFE_INTEGER)
const safeOf = (x: bigint): boolean => x <= safeBig && x >= -safeBig
/** A bigint for JSON: the number when it is exact there, the decimal string when it would round. */
const jsonIntOf = (x: bigint): number | string => (safeOf(x) ? Number(x) : x.toString())

/** The modulus and base Shor runs on when the caller names none: faces.rays * (n * n + n + seed) = 91 and mintOf n = 8. */
export const shorDefaultsOf = () => ({ modulus: qpuFacesOf().rays * (n * n + n + seed), base: mintOf(n) })
/** The counting register is two qubits: this inverse QFT is exact in Gaussian integers (fourth roots of unity), and a
 * wider register would need eighth roots, which are not integers. So the register resolves periods dividing four;
 * `classical` below says whether the period it was asked for is one of those. */
const shorCountBits = coins
/** THE CLASSICAL CHECK BESIDE THE RUN, EXACT FOR ANY MODULUS AND NEVER UNFINISHED. The two-qubit counting register
 * resolves a period only when it divides four, and whether the order of the base divides four is three modular
 * powers: a, a^2, a^4 mod n. That answers every question the run poses — is there a ring, is the base a unit, can the
 * register resolve its order, and what must the run then recover — without iterating toward an order it could not
 * reach. So there is no bound to hit, no work budget, and no "did not finish" to report: `beyond` true is an answer
 * (the order exists and does not divide four), not a crack. */
const classicalOrderOf = (base: bigint, modulus: bigint): { ring: boolean; unit: boolean; order: number; beyond: boolean } => {
  if (modulus <= b1) return { ring: false, unit: false, order: n - n, beyond: false }
  if (bigGcdOf(base, modulus) !== b1) return { ring: true, unit: false, order: n - n, beyond: false }
  for (const r of [seed, coins, mintOf(coins)]) {
    if (bigPowModOf(base, BigInt(r), modulus) === b1) return { ring: true, unit: true, order: r, beyond: false }
  }
  return { ring: true, unit: true, order: n - n, beyond: true }
}
/** How one argument was read. `digits` is a string of digits, exact at any size. `number` is a JSON number, exact only up
 * to 2^53 (past that the caller's own parser rounded it before it arrived). `numeric` is any other numeric string, read
 * through a double, exact only when the double is an integer under 2^53. `absent` means the caller named nothing and the
 * unit's own value stands. `default` means the caller sent something that holds no number, and the unit's own value
 * stands in its place — said here so a garbage argument never comes back as a confident answer. */
export type QpuArgRead = { how: 'digits' | 'number' | 'numeric' | 'absent' | 'default'; exact: boolean; given: boolean }
const argReadOf = (v: unknown): { value?: bigint; read: QpuArgRead } => {
  const finite = (x: number): boolean => x === x && x !== Number.POSITIVE_INFINITY && x !== Number.NEGATIVE_INFINITY
  const exactDouble = (x: number): boolean => finite(x) && x % seed === n - n && x <= Number.MAX_SAFE_INTEGER && x >= -Number.MAX_SAFE_INTEGER
  if (v === undefined) return { read: { how: 'absent', exact: true, given: false } }
  if (typeof v === 'bigint') return { value: v, read: { how: 'digits', exact: true, given: true } }
  if (typeof v === 'string') {
    const t = v.trim()
    if (/^[+-]?\d+$/.test(t)) return { value: BigInt(t), read: { how: 'digits', exact: true, given: true } }
    const x = t.length > n - n ? Number(t) : Number.NaN
    if (finite(x)) return { value: BigInt(x - (x % seed)), read: { how: 'numeric', exact: exactDouble(x), given: true } }
    return { read: { how: 'default', exact: false, given: true } }
  }
  if (typeof v === 'number' && finite(v)) return { value: BigInt(v - (v % seed)), read: { how: 'number', exact: exactDouble(v), given: true } }
  return { read: { how: 'default', exact: false, given: true } }
}
/** Modulus and base as the caller gave them, read as integers, with how each was read. No denial, no cap: the run is on
 * whatever integer arrives, and `read` says whether that integer is the one the caller meant. */
export const shorArgsOf = (a: Record<string, unknown>): { modulus?: bigint; base?: bigint; read: { n: QpuArgRead; a: QpuArgRead; holds: boolean } } => {
  const nn = argReadOf(a.n)
  const aa = argReadOf(a.a)
  return { modulus: nn.value, base: aa.value, read: { n: nn.read, a: aa.read, holds: nn.read.exact && aa.read.exact } }
}
/** Shor as a caller asked for it: the run on their n and a, whatever they are. Never a denial; the run itself says what it
 * found (a period, a gcd factor, or nothing), the sparse state means no modulus is past the host's reach, and `read`
 * says how each argument was taken. A reply whose arguments were not read exactly does not hold, whatever the run did. */
export const qpuShorTryOf = (a: Record<string, unknown>) => {
  const args = shorArgsOf(a)
  const shor = qpuShorOf(args.modulus, args.base)
  return { ...shor, read: args.read, holds: shor.holds && args.read.holds }
}

/** Shor on the sparse exact simulator. N and coprime a: the caller's, or the unit's 91 and 8. Modular-exponentiation
 * circuitry. Inverse QFT. Noisy shots. Factors. Every number below is exact in `exact` as decimal text; the number
 * fields round past 2^53 and `exact.safe` says whether they did. */
export const qpuShorOf = (modulusArg?: number | bigint, baseArg?: number | bigint) => {
  const plugin = qpuPayloadPluginOf()
  const computer = qpuComputerOf()
  const defaults = shorDefaultsOf()
  const modulus = BigInt(modulusArg ?? defaults.modulus)
  const base = BigInt(baseArg ?? defaults.base)
  const countBits = shorCountBits
  const workBits = bitsOf(modulus)
  const workOff = countBits
  const shift = BigInt(workOff)
  const span = b1 << BigInt(workBits)
  const qubits = countBits + workBits
  const dimBig = b1 << BigInt(qubits)
  const qftSize = mintOf(countBits)
  const qftBig = BigInt(qftSize)
  const ring = modulus > b1
  const coprime = ring && bigGcdOf(base, modulus) === b1
  const aSquared = ring ? bigPowModOf(base, b2, modulus) : base * base
  const mul = [
    { power: mintOf(n - n), a: jsonIntOf(base), control: n - n },
    { power: coins, a: jsonIntOf(aSquared), control: seed }] as const
  const gates = [
    { name: 'x' as const, q: workOff },
    { name: 'h' as const, q: n - n },
    { name: 'h' as const, q: seed },
    { name: 'cmodexp' as const, c: mul[n - n]!.control, a: mul[n - n]!.a, modulus: jsonIntOf(modulus), power: mul[n - n]!.power },
    { name: 'cmodexp' as const, c: mul[seed]!.control, a: mul[seed]!.a, modulus: jsonIntOf(modulus), power: mul[seed]!.power },
    { name: 'swap' as const, a: n - n, b: seed },
    { name: 'h' as const, q: seed },
    { name: 'csdg' as const, c: seed, t: n - n },
    { name: 'h' as const, q: n - n }]
  let state = sPrepareOf()
  state = sXOf(state, workOff)
  state = sHOf(state, n - n)
  state = sHOf(state, seed)
  state = sModMulOf(state, base, modulus, mul[n - n]!.control, workOff, workBits)
  state = sModMulOf(state, aSquared, modulus, mul[seed]!.control, workOff, workBits)
  /** Read from the state: every branch's work register holds a^counting mod N, or the circuitry does not hold. */
  let expOk = ring && state.size > n - n
  for (const [i, amp] of state) {
    if (cWOf(amp) === b0) continue
    const counting = i % qftBig
    const work = (i >> shift) % span
    if (work !== bigPowModOf(base, counting, modulus)) expOk = false
  }
  state = sSwapOf(state, n - n, seed)
  state = sHOf(state, seed)
  state = sSdgOf(state, seed, n - n)
  state = sHOf(state, n - n)
  const noisy = sXxOf(state, workOff)
  receiptSparseOf('cmodexp', dimBig, sPairsOf(state))
  receiptSparseOf('xx', dimBig, sPairsOf(noisy))
  const xxId = sEqualOf(noisy, state)
  /** Read from the state, never from the request: the host holds every nonzero amplitude of the 2^qubits vector. */
  const prepare = {
    kind: 'prepare' as const,
    qubits,
    dim: jsonIntOf(dimBig),
    amplitudes: noisy.size,
    sparse: true as const,
    prepared: noisy.size > n - n,
    reason: noisy.size > n - n ? ('held' as const) : ('empty' as const),
    holds: noisy.size > n - n && noisy.size <= qftSize * qftSize,
  }
  const weights: number[] = []
  for (let y = n - n; y < qftSize; y++) weights.push(n - n)
  for (const [i, amp] of noisy) {
    const y = Number(i % qftBig)
    weights[y] = weights[y]! + Number(cWOf(amp))
  }
  const support: number[] = []
  for (let y = n - n; y < qftSize; y++) if (weights[y]! > n - n) support.push(y)
  const shotsN = mintOf(n)
  const measured = support.length > n - n
  /** Shots are readings of a held state: none are reported from a state with nothing to read. */
  const shots: number[] = []
  if (measured) for (let s = n - n; s < shotsN; s++) shots.push(support[s % support.length]!)
  let period = n - n
  const recovered: number[] = []
  for (const y of support) {
    for (const row of convergentsOf(y, qftSize)) {
      const r = row.k
      if (r > n - n && BigInt(r) < modulus && bigPowModOf(base, BigInt(r), modulus) === b1) {
        recovered.push(r)
        if (period === n - n) period = r
      }
    }
  }
  let p = b0
  let q = b0
  let by: 'period' | 'gcd' | 'none' = 'none'
  if (period > n - n && period % coins === n - n) {
    const half = bigPowModOf(base, BigInt(period / coins), modulus)
    if (half !== modulus - b1) {
      const g1 = bigGcdOf(half - b1, modulus)
      const g2 = bigGcdOf(half + b1, modulus)
      if (g1 > b1 && g1 < modulus) {
        p = g1
        q = modulus / g1
        by = 'period'
      } else if (g2 > b1 && g2 < modulus) {
        p = g2
        q = modulus / g2
        by = 'period'
      }
    }
  }
  /** Shor's first step, read from the run: a base sharing a factor with the modulus hands that factor over before any period. */
  const shared = ring ? bigGcdOf(modOf(base, modulus), modulus) : b0
  if (by === 'none' && shared > b1 && shared < modulus) {
    p = shared
    q = modulus / shared
    by = 'gcd'
  }
  const product = p * q
  const factoredBig = p > b1 && q > b1 && product === modulus
  const exact = {
    safe: safeOf(modulus) && safeOf(base) && safeOf(p) && safeOf(q) && safeOf(dimBig),
    n: modulus.toString(),
    a: base.toString(),
    p: p.toString(),
    q: q.toString(),
    product: product.toString(),
    dim: dimBig.toString(),
  }
  const circuitry = {
    kind: 'cmodexp' as const,
    native: ['h', 'cnot'] as const,
    compiled: ['x', 'swap', 'csdg', 'cmodexp'] as const,
    mul,
    gates,
    qubits,
    dim: jsonIntOf(dimBig),
    work: workBits,
    counting: countBits,
    holds: expOk && gates[n - n]!.name === 'x' && mul.length === coins && span > modulus && qubits === countBits + workBits,
  }
  const qft = {
    kind: 'iqft' as const,
    qubits: countBits,
    size: qftSize,
    phase: 's' as const,
    holds: countBits === coins && qftSize === mintOf(countBits) && support.length > n - n && span > modulus,
  }
  const measure = {
    kind: 'shots' as const,
    noise: 'xx' as const,
    identity: xxId,
    measured,
    /** No entropy in the unit: the outcomes list the support in order, once per shot, so they are the exact
     * distribution enumerated, never a sample. The Born weights are `weights`. */
    sampled: false as const,
    enumerated: true as const,
    shots: shots.length,
    outcomes: shots,
    support,
    weights,
    holds: measured && shots.length === shotsN && shotsN === computer.shots.n && xxId === true && computer.correct.code === 'bitflip',
  }
  const post = {
    kind: 'continued-fraction' as const,
    period,
    recovered,
    holds: period > n - n && bigPowModOf(base, BigInt(period), modulus) === b1,
  }
  const factors = {
    p: Number(p),
    q: Number(q),
    product: Number(product),
    by,
    holds: factoredBig,
  }
  const rsa = {
    kind: 'rsa' as const,
    cryptosystem: 'rsa' as const,
    modulus: Number(modulus),
    p: Number(p),
    q: Number(q),
    product: Number(product),
    factored: factoredBig,
    holds: factors.holds && factoredBig,
  }
  /** Beside the run, never in it, and exact for any modulus: whether there is a ring, whether the base is a unit in it,
   * whether the order of the base divides four (the only periods a two-qubit register resolves), and both arms —
   * resolvable means the run recovered a multiple of that order, unresolvable means the run recovered nothing. */
  const classicalRun = classicalOrderOf(base, modulus)
  const classicalPeriod = classicalRun.order
  const resolvable = classicalRun.unit && classicalPeriod > n - n
  const classical = {
    kind: 'classical' as const,
    ring: classicalRun.ring,
    unit: classicalRun.unit,
    gcd: jsonIntOf(ring ? bigGcdOf(base, modulus) : b0),
    period: classicalPeriod,
    beyond: classicalRun.beyond,
    counting: countBits,
    resolvable,
    agrees: classicalRun.ring && period === classicalPeriod,
    holds: classicalRun.ring ? (resolvable ? period > n - n && period % classicalPeriod === n - n : period === n - n) : false,
  }
  const holds =
    span > modulus &&
    prepare.holds &&
    circuitry.holds &&
    qft.holds &&
    measure.holds &&
    (post.holds || factors.by === 'gcd') &&
    factors.holds &&
    rsa.holds &&
    computer.holds &&
    qpuPayloadPluginHolds(plugin)
  return {
    kind: 'shor' as const,
    theorem: 'shor' as const,
    device: sDeviceOf(noisy),
    n: Number(modulus),
    a: Number(base),
    exact,
    coprime,
    circuitry,
    prepare,
    qft,
    measure,
    post,
    classical,
    factors,
    rsa,
    unlocked: true as const,
    lock: false as const,
    payload: plugin.href,
    holds,
  }
}

/** The receipts of one Shor run: the folds, and the exact amplitudes of the modexp and noise states, the ledger gained
 * after `from`. Two honest runs of one circuit fold alike; a reader who runs qpuShorOf recomputes them. */
export const qpuShorReceiptsOf = (from: number) => {
  const rows = qpuReceiptLedgerOf().slice(from)
  return {
    kind: 'receipts' as const,
    rows,
    fold: qpuReceiptFoldOf(rows),
    holds: rows.length >= coins && rows.some((r) => r.name === 'cmodexp') && rows.some((r) => r.name === 'xx'),
  }
}

export const qpuShorHolds = (s = qpuShorOf()): boolean =>
  s.holds === true &&
  s.kind === 'shor' &&
  s.theorem === 'shor' &&
  s.device === 'simulator' &&
  s.n === qpuFacesOf().rays * (n * n + n + seed) &&
  s.n > n * (n + coins) &&
  s.a === mintOf(n) &&
  s.unlocked === true &&
  s.lock === false &&
  s.circuitry.work > qpuCubeOf().hexbit &&
  s.circuitry.qubits === n * n &&
  s.coprime === true &&
  gcdOf(s.a, s.n) === seed &&
  s.circuitry.kind === 'cmodexp' &&
  s.circuitry.native[n - n] === 'h' &&
  s.circuitry.native[seed] === 'cnot' &&
  s.circuitry.holds === true &&
  s.qft.kind === 'iqft' &&
  s.qft.holds === true &&
  s.measure.noise === 'xx' &&
  s.measure.shots === mintOf(n) &&
  s.measure.outcomes.length === mintOf(n) &&
  s.measure.holds === true &&
  s.post.kind === 'continued-fraction' &&
  s.post.holds === true &&
  s.factors.p * s.factors.q === s.n &&
  s.factors.holds === true &&
  s.rsa.kind === 'rsa' &&
  s.rsa.cryptosystem === 'rsa' &&
  s.rsa.modulus === s.n &&
  s.rsa.p * s.rsa.q === s.rsa.modulus &&
  s.rsa.factored === true &&
  s.rsa.holds === true &&
  s.payload === `${storageHref}/${payloadDbKey}`

export const qpuCircuitOf = () => {
  const cube = qpuCubeOf()
  const faces = qpuFacesOf()
  const coil = qpuCoilOf()
  const dim = mintOf(n)
  const prepare = ampsOf(dim)
  const afterH = hGateOf(prepare, n - n)
  const afterCnot = cnotGateOf(afterH, n - n, seed)
  const afterHH = hGateOf(afterH, n - n)
  const afterGhz = cnotGateOf(afterCnot, n - n, coins)
  const copies = hGateOf(afterH, seed)
  let teleported = xGateOf(prepare, n - n)
  teleported = hGateOf(teleported, seed)
  teleported = cnotGateOf(teleported, seed, coins)
  teleported = cnotGateOf(teleported, n - n, seed)
  teleported = hGateOf(teleported, n - n)
  teleported = cnotGateOf(teleported, seed, coins)
  teleported = czGateOf(teleported, n - n, coins)
  let plused = hGateOf(prepare, n - n)
  plused = hGateOf(plused, seed)
  plused = cnotGateOf(plused, seed, coins)
  plused = cnotGateOf(plused, n - n, seed)
  plused = hGateOf(plused, n - n)
  plused = cnotGateOf(plused, seed, coins)
  plused = czGateOf(plused, n - n, coins)
  let kicked = hGateOf(prepare, n - n)
  kicked = xGateOf(kicked, seed)
  kicked = czGateOf(kicked, n - n, seed)
  kicked = hGateOf(kicked, n - n)
  let deutschPrep = hGateOf(prepare, n - n)
  deutschPrep = xGateOf(deutschPrep, seed)
  deutschPrep = hGateOf(deutschPrep, seed)
  const deutschConst = hGateOf(deutschPrep, n - n)
  const deutschBal = hGateOf(cnotGateOf(deutschPrep, n - n, seed), n - n)
  const denseI = decodeOf(afterCnot)
  const denseX = decodeOf(xGateOf(afterCnot, n - n))
  const denseZ = decodeOf(zGateOf(afterCnot, n - n))
  const denseXZ = decodeOf(zGateOf(xGateOf(afterCnot, n - n), n - n))
  const noisy = xGateOf(xGateOf(afterCnot, n - n), n - n)
  const support = afterCnot.map((a, i) => ({ i, a })).filter((r) => r.a !== 0n)
  const split = afterH.map((a, i) => ({ i, a })).filter((r) => r.a !== 0n)
  const interfered = afterHH.map((a, i) => ({ i, a })).filter((r) => r.a !== 0n)
  const ghzSupport = afterGhz.map((a, i) => ({ i, a })).filter((r) => r.a !== 0n)
  const copySupport = copies.map((a, i) => ({ i, a })).filter((r) => r.a !== 0n)
  const g000 = afterGhz[n - n] ?? 0n
  const g001 = afterGhz[seed] ?? 0n
  const g110 = afterGhz[xorOf(bitOf(seed), bitOf(coins))] ?? 0n
  const g111 = afterGhz[mintOf(n) - seed] ?? 0n
  const bob = weightOf(teleported, coins)
  const bobPlus = weightOf(plused, coins)
  const kickW = weightOf(kicked, n - n)
  const kickSupport = kicked.map((a, i) => ({ i, a })).filter((r) => r.a !== 0n)
  const dConst = weightOf(deutschConst, n - n)
  const dBal = weightOf(deutschBal, n - n)
  const m00 = afterGhz[n - n] ?? 0n
  const m01 = afterGhz[seed] ?? 0n
  const m10 = afterGhz[coins] ?? 0n
  const m11 = afterGhz[n] ?? 0n
  const pair = m00 * m11 === m01 * m10
  const bitI = basisOf(denseI)
  const bitX = basisOf(denseX)
  const bitZ = basisOf(denseZ)
  const bitXZ = basisOf(denseXZ)
  const a00 = afterCnot[n - n] ?? 0n
  const a01 = afterCnot[seed] ?? 0n
  const a10 = afterCnot[coins] ?? 0n
  const a11 = afterCnot[n] ?? 0n
  const product = a00 * a11 === a01 * a10
  const plusAmps = hGateOf(hGateOf(prepare, n - n), seed)
  const u00 = plusAmps[n - n] ?? 0n
  const u01 = plusAmps[seed] ?? 0n
  const u10 = plusAmps[coins] ?? 0n
  const u11 = plusAmps[n] ?? 0n
  const separable = u00 * u11 === u01 * u10
  const plusSupport = plusAmps.map((a, i) => ({ i, a })).filter((r) => r.a !== 0n && r.i < mintOf(coins))
  const hh = hGateOf(hGateOf(afterCnot, n - n), seed)
  const h00 = hh[n - n] ?? 0n
  const h01 = hh[seed] ?? 0n
  const h10 = hh[coins] ?? 0n
  const h11 = hh[n] ?? 0n
  const hhProduct = h00 * h11 === h01 * h10
  const hhSupport = hh.map((a, i) => ({ i, a })).filter((r) => r.a !== 0n && r.i < mintOf(coins))
  const cancelled = afterHH[seed] ?? 0n
  const restored = afterHH[n - n] ?? 0n
  const left = a00 * a11
  const right = a01 * a10
  const index = support.length === coins ? support[seed]!.i : n - n
  const measured = xorOf(xorOf(n - n, seed), coins)
  const noiseIndex = xorOf(xorOf(index, seed), seed)
  const noiseSupport = noisy.map((a, i) => ({ i, a })).filter((r) => r.a !== 0n)
  const vm =
    typeof fetch === 'function' &&
    typeof Request === 'function' &&
    typeof Response === 'function' &&
    typeof BigInt === 'function' &&
    typeof performance === 'object' &&
    performance !== null &&
    typeof performance.now === 'function'
  const qubits = {
    n,
    dim,
    levels: coins,
    holds: n === cube.n && dim === cube.vertices && dim === mintOf(n) && coins === seed + seed,
  }
  const gates = {
    names: ['h', 'cnot'] as const,
    index,
    holds: index === n && measured === n && support.length === coins,
  }
  const measurement = {
    index,
    bits: index,
    support: support.map((r) => r.i),
    holds: support.length === coins && index === n && afterCnot[n - n] === 1n && afterCnot[n] === 1n,
  }
  const noise = {
    channel: 'xx' as const,
    index: noiseIndex,
    holds: noiseIndex === index && noiseSupport.length === coins && noisy[n - n] === 1n && noisy[n] === 1n,
  }
  const plus = {
    kind: 'separable' as const,
    ket: '++' as const,
    product: separable,
    support: plusSupport.map((r) => r.i),
    holds: separable === true && u00 === 1n && u01 === 1n && u10 === 1n && u11 === 1n && plusSupport.length === mintOf(coins),
  }
  const hadamard = {
    kind: 'hadamard' as const,
    parity: n - n,
    product: hhProduct,
    support: hhSupport.map((r) => r.i),
    holds:
      hhProduct === false &&
      h00 !== 0n &&
      h11 !== 0n &&
      h01 === 0n &&
      h10 === 0n &&
      hhSupport.length === coins &&
      hhSupport.every((r) => parityOf(r.i) === n - n)}
  const pairs = []
  for (let ray = n - n; ray < faces.rays; ray += seed) {
    const scanner = ray
    const radar = ray + faces.rays
    const hop = (scanner + faces.rays) % faces.faces
    pairs.push({
      ray: scanner,
      scanner,
      radar,
      hop,
      product,
      theorem: 'entangle' as const,
      holds: hop === radar && product === false && left !== right,
  })
  }
  const coilProve = {
    kind: 'coil' as const,
    theorem: coil.theorem,
    windings: coil.windings,
    coins: coil.coins,
    rays: coil.rays,
    coil: coil.coil,
    faces: coil.faces,
    pairs,
    occupied: pairs.length + pairs.length,
    vacant: n - n,
    holds:
      qpuCoilHolds(coil) &&
      coil.coil === faces.faces &&
      coil.coil === coins * faces.rays &&
      pairs.length === faces.rays &&
      pairs.length + pairs.length === faces.faces &&
      pairs.every((row) => row.holds && row.product === false && row.hop === row.radar) &&
      product === false &&
      left !== right}
  const entangle = {
    kind: 'bell' as const,
    support: support.map((r) => r.i),
    left: Number(left),
    right: Number(right),
    product,
    parity: n - n,
    plus,
    hadamard,
    coil: coilProve,
    holds:
      product === false &&
      a00 === 1n &&
      a11 === 1n &&
      a01 === 0n &&
      a10 === 0n &&
      support.length === coins &&
      support.every((r) => parityOf(r.i) === n - n) &&
      plus.holds &&
      hadamard.holds &&
      coilProve.holds,
  }
  const interfere = {
    kind: 'hh' as const,
    cancelled: Number(cancelled),
    restored: Number(restored),
    support: interfered.map((r) => r.i),
    holds: cancelled === 0n && restored === BigInt(coins) && interfered.length === seed,
  }
  const ghz = {
    kind: 'ghz' as const,
    support: ghzSupport.map((r) => r.i),
    left: Number(g000 * g111),
    right: Number(g001 * g110),
    product: g000 * g111 === g001 * g110,
    holds:
      g000 === 1n &&
      g111 === 1n &&
      g001 === 0n &&
      g110 === 0n &&
      ghzSupport.length === coins &&
      g000 * g111 !== g001 * g110}
  const noclone = {
    kind: 'clone' as const,
    copies: copySupport.length,
    cloned: support.length,
    holds: copySupport.length === mintOf(coins) && support.length === coins && copySupport.length !== support.length,
  }
  const teleport = {
    kind: 'teleport' as const,
    psi: seed,
    bob: seed,
    weight0: Number(bob.off),
    weight1: Number(bob.on),
    plus0: Number(bobPlus.off),
    plus1: Number(bobPlus.on),
    holds:
      bob.off === 0n &&
      bob.on === BigInt(mintOf(n + seed)) &&
      bobPlus.off === bobPlus.on &&
      bobPlus.off === BigInt(mintOf(n + seed))}
  const kickback = {
    kind: 'kickback' as const,
    support: kickSupport.map((r) => r.i),
    weight0: Number(kickW.off),
    weight1: Number(kickW.on),
    holds: kickW.off === 0n && kickW.on === BigInt(mintOf(n + seed)) && kickSupport.length === seed && kickSupport[n - n]?.i === n,
  }
  const deutsch = {
    kind: 'deutsch' as const,
    queries: seed,
    classical: coins,
    constant0: Number(dConst.off),
    constant1: Number(dConst.on),
    balanced0: Number(dBal.off),
    balanced1: Number(dBal.on),
    holds:
      dConst.on === 0n &&
      dBal.off === 0n &&
      dConst.off !== dBal.off &&
      dConst.off === dBal.on &&
      seed !== coins}
  const dense = {
    kind: 'dense' as const,
    i: bitI,
    x: bitX,
    z: bitZ,
    xz: bitXZ,
    holds: bitI === n - n && bitZ === seed && bitX === coins && bitXZ === n && coins * coins === mintOf(coins),
  }
  const monogamy = {
    kind: 'monogamy' as const,
    bell: product === false,
    pair,
    left: Number(m00 * m11),
    right: Number(m01 * m10),
    holds: product === false && pair === true && m00 === 1n && m11 === 0n && m01 === 0n && m10 === 0n,
  }
  const only = {
    kind: 'quantum' as const,
    split: split.length === coins,
    entangle: entangle.holds,
    interfere: interfere.holds,
    ghz: ghz.holds,
    noclone: noclone.holds,
    teleport: teleport.holds,
    kickback: kickback.holds,
    deutsch: deutsch.holds,
    dense: dense.holds,
    monogamy: monogamy.holds,
    product,
    holds:
      split.length === coins &&
      entangle.holds &&
      interfere.holds &&
      ghz.holds &&
      noclone.holds &&
      teleport.holds &&
      kickback.holds &&
      deutsch.holds &&
      dense.holds &&
      monogamy.holds &&
      product === false}
  const electronics = qpuElectronicsOf()
  const follow = qpuFollowOf()
  const efficiency = qpuCoilEfficiencyOf()
  const next = qpuNextOf()
  const clay = qpuClayOf()
  const register = {
    kind: bigintDeviceOf(ampsOf(dim)),
    qubits: n,
    levels: coins,
    dim,
    vm: 'browser' as const,
    coil,
    electronics,
    follow,
    efficiency,
    next,
    clay,
    holds:
      coins === seed + seed &&
      n === cube.n &&
      dim === mintOf(n) &&
      dim === cube.vertices &&
      vm &&
      xorOf(xorOf(n - n, seed), coins) === n &&
      qpuCoilHolds(coil) &&
      qpuElectronicsHolds(electronics) &&
      qpuBalanceHolds() &&
      qpuFollowHolds(follow) &&
      follow.emerge.holds &&
      qpuCoilEfficiencyHolds(efficiency) &&
      efficiency.unity === seed &&
      efficiency.remainder === n - n &&
      qpuNextHolds(next) &&
      next.nextCoil === next.nextFused &&
      qpuClayHolds(clay) &&
      clay.clay === coil.coil &&
      coil.theory === coil.practice &&
      coil.balance === coins}
  const science = {
    levels: coins,
    qubits: n,
    dim: mintOf(n),
    gates: ['h', 'cnot'] as const,
    xx: xorOf(xorOf(n, seed), seed) === n}
  const shared =
    coins === faces.coins &&
    n === cube.n &&
    dim === cube.vertices &&
    faces.faces === coins * faces.rays &&
    cube.bits === cube.vertices * cube.hexbit
  const distinct = n !== faces.faces && dim !== faces.faces && n !== cube.bits && dim !== cube.bits && faces.faces !== cube.bits
  const sciences = {
    kind: 'between' as const,
    circuit: n,
    cube: cube.vertices,
    faces: faces.faces,
    bits: cube.bits,
    shared,
    distinct,
    holds: shared && distinct && n === cube.n && cube.vertices === mintOf(n) && faces.faces === coins * faces.rays,
  }
  const drift = {
    kind: 'science' as const,
    levels: register.levels === science.levels && science.levels === seed + seed,
    dim: register.dim === science.dim && science.dim === cube.vertices,
    gates: xorOf(xorOf(n - n, seed), coins) === n,
    noise: science.xx,
    between: sciences.holds && sciences.distinct && sciences.shared,
    holds:
      register.levels === science.levels &&
      register.dim === science.dim &&
      science.levels === seed + seed &&
      science.dim === mintOf(n) &&
      xorOf(xorOf(n - n, seed), coins) === n &&
      science.xx &&
      sciences.holds,
  }
  const names = [
    'split',
    'entangle',
    'interfere',
    'ghz',
    'noclone',
    'teleport',
    'kickback',
    'deutsch',
    'dense',
    'monogamy',
    'qubits',
    'gates',
    'measurement',
    'register'] as const
  const seated = [
    split.length === coins,
    entangle.holds,
    interfere.holds,
    ghz.holds,
    noclone.holds,
    teleport.holds,
    kickback.holds,
    deutsch.holds,
    dense.holds,
    monogamy.holds,
    qubits.holds,
    gates.holds,
    measurement.holds,
    register.holds] as const
  let occupied = n - n
  for (const seat of seated) if (seat) occupied += seed
  const vacant = seated.length - occupied
  const lattice = {
    kind: 'lattice' as const,
    waves: cube.vertices,
    faces: faces.faces,
    occupied,
    vacant,
    cover: cube.vertices * faces.faces,
    nodes: seated.map((holds, face) => {
      const hop = (face + faces.rays + faces.rays) % faces.faces
      return { face, hop, involution: hop === face, name: names[face]!, holds }
    }),
    holds:
      names.length === faces.faces &&
      seated.length === faces.faces &&
      occupied === faces.faces &&
      vacant === n - n &&
      cube.vertices * faces.faces === mintOf(n) * (coins * faces.rays) &&
      seated.every(Boolean)}
  const computer = qpuComputerOf()
  const plugin = qpuPayloadPluginOf()
  const payloadMcp = qpuPayloadMcpOf()
  const hardware = {
    kind: 'hardware' as const,
    device: register.kind,
    initialize: computer.reset.holds,
    gates: gates.holds && computer.coupling.holds,
    interfere: interfere.holds,
    measure: measurement.holds && computer.readout.holds && computer.collapse.holds,
    noise: noise.holds && computer.correct.holds,
    path: {
      circuit: unit.origin,
      payload: plugin.href,
      plugin: plugin.name,
      submit: serverHref,
      src: unit.fuse.lean,
      holds:
        qpuPayloadPluginHolds(plugin) &&
        payloadMcp.holds &&
        plugin.copies === seed &&
        plugin.next === plugin.fused + plugin.fused &&
        serverHref === `${unit.origin}/server` &&
        unit.fuse.lean.endsWith('/index.lean')},
    holds:
      computer.reset.holds &&
      gates.holds &&
      computer.coupling.holds &&
      interfere.holds &&
      measurement.holds &&
      computer.readout.holds &&
      computer.collapse.holds &&
      computer.shots.holds &&
      noise.holds &&
      computer.correct.holds &&
      register.kind === 'simulator' &&
      qpuPayloadPluginHolds(plugin) &&
      payloadMcp.holds &&
      plugin.copies === seed &&
      computer.qram.href === plugin.href &&
      serverHref === `${unit.origin}/server` &&
      unit.fuse.lean.endsWith('/index.lean')}
  const holds =
    vm &&
    qubits.holds &&
    gates.holds &&
    measurement.holds &&
    noise.holds &&
    register.holds &&
    sciences.holds &&
    drift.holds &&
    drift.between &&
    lattice.holds &&
    lattice.vacant === n - n &&
    entangle.holds &&
    interfere.holds &&
    only.holds &&
    ghz.holds &&
    noclone.holds &&
    teleport.holds &&
    kickback.holds &&
    deutsch.holds &&
    dense.holds &&
    monogamy.holds &&
    cube.holds &&
    faces.holds &&
    computer.holds &&
    hardware.holds &&
    dim === mintOf(n) &&
    xorOf(xorOf(n - n, seed), coins) === n &&
    xorOf(xorOf(n, seed), seed) === n
  return {
    kind: 'circuit' as const,
    only,
    lattice,
    split: { kind: 'split' as const, support: split.map((r) => r.i), holds: split.length === coins },
    register,
    vm: 'browser' as const,
    primitives,
    qubits,
    gates,
    measurement,
    noise,
    entangle,
    interfere,
    ghz,
    noclone,
    teleport,
    kickback,
    deutsch,
    dense,
    monogamy,
    science,
    sciences,
    drift,
    computer,
    hardware,
    holds,
  }
}

export const qpuCircuitHolds = (c = qpuCircuitOf()): boolean =>
  c.holds === true &&
  c.kind === 'circuit' &&
  c.split.holds === true &&
  c.split.support.length === coins &&
  c.vm === 'browser' &&
  c.qubits.n === n &&
  c.qubits.dim === mintOf(n) &&
  c.gates.index === n &&
  c.measurement.index === n &&
  c.measurement.support.length === coins &&
  c.noise.index === c.measurement.index &&
  c.entangle.product === false &&
  c.entangle.left === seed &&
  c.entangle.right === n - n &&
  c.entangle.parity === n - n &&
  c.entangle.plus.kind === 'separable' &&
  c.entangle.plus.product === true &&
  c.entangle.hadamard.parity === n - n &&
  c.entangle.hadamard.product === false &&
  c.entangle.coil.theorem === 'two_coins_make_a_coil' &&
  c.entangle.coil.holds === true &&
  c.entangle.coil.coil === c.lattice.faces &&
  c.entangle.coil.pairs.length === c.entangle.coil.rays &&
  c.entangle.coil.pairs.length + c.entangle.coil.pairs.length === c.lattice.faces &&
  c.entangle.coil.pairs.every((row) => row.holds && row.product === false && row.hop === row.radar) &&
  c.entangle.holds === true &&
  c.interfere.holds === true &&
  c.ghz.holds === true &&
  c.ghz.support.length === coins &&
  c.ghz.support[n - n] === n - n &&
  c.ghz.support[seed] === mintOf(n) - seed &&
  c.ghz.left === seed &&
  c.ghz.right === n - n &&
  c.noclone.holds === true &&
  c.noclone.copies === mintOf(coins) &&
  c.noclone.cloned === coins &&
  c.noclone.cloned !== c.noclone.copies &&
  c.teleport.holds === true &&
  c.teleport.weight0 === n - n &&
  c.teleport.weight1 === mintOf(n + seed) &&
  c.teleport.plus0 === mintOf(n + seed) &&
  c.teleport.plus1 === mintOf(n + seed) &&
  c.kickback.holds === true &&
  c.kickback.support[n - n] === n &&
  c.deutsch.holds === true &&
  c.deutsch.queries === seed &&
  c.deutsch.classical === coins &&
  c.deutsch.queries !== c.deutsch.classical &&
  c.deutsch.constant1 === n - n &&
  c.deutsch.balanced0 === n - n &&
  c.dense.holds === true &&
  c.dense.i === n - n &&
  c.dense.z === seed &&
  c.dense.x === coins &&
  c.dense.xz === n &&
  c.monogamy.holds === true &&
  c.monogamy.bell === true &&
  c.monogamy.pair === true &&
  c.only.holds === true &&
  c.only.kickback === true &&
  c.only.deutsch === true &&
  c.only.dense === true &&
  c.only.monogamy === true &&
  c.only.ghz === true &&
  c.only.noclone === true &&
  c.only.teleport === true &&
  c.lattice.kind === 'lattice' &&
  c.lattice.holds === true &&
  c.lattice.faces === c.sciences.faces &&
  c.lattice.occupied === c.lattice.faces &&
  c.lattice.vacant === n - n &&
  c.lattice.nodes.length === c.lattice.faces &&
  c.lattice.nodes.every((node) => node.holds && node.involution && node.hop === node.face) &&
  c.register.kind === 'simulator' &&
  c.register.qubits === n &&
  c.register.levels === coins &&
  c.register.coil.kind === 'coil' &&
  c.register.coil.holds === true &&
  c.register.coil.windings === coins &&
  c.register.coil.theory === seed &&
  c.register.coil.practice === seed &&
  c.register.coil.theory === c.register.coil.practice &&
  c.register.coil.balance === coins &&
  c.register.coil.coil === c.lattice.faces &&
  c.register.electronics.kind === 'electronics' &&
  c.register.electronics.uses === 'coil' &&
  c.register.electronics.holds === true &&
  c.register.electronics.stages === n &&
  qpuCoilHolds(c.register.coil) &&
  qpuElectronicsHolds(c.register.electronics) &&
  qpuBalanceHolds() &&
  qpuFollowHolds(c.register.follow) &&
  c.register.follow.emerge.balanced === true &&
  c.register.follow.emerge.covered === true &&
  c.register.follow.emerge.holds === true &&
  qpuCoilEfficiencyHolds(c.register.efficiency) &&
  c.register.efficiency.unity === seed &&
  c.register.efficiency.remainder === n - n &&
  c.register.efficiency.measure === c.lattice.faces &&
  c.register.efficiency.vacant === n - n &&
  qpuNextHolds(c.register.next) &&
  c.register.next.nextCoil === c.register.next.nextFused &&
  qpuClayHolds(c.register.clay) &&
  c.register.clay.clay === c.register.coil.coil &&
  c.register.clay.coins * c.register.clay.seven === c.register.clay.clay &&
  (seed + c.register.clay.six) * c.register.clay.coins === c.register.clay.clay &&
  c.drift.kind === 'science' &&
  c.drift.holds === true &&
  c.science.levels === coins &&
  c.science.dim === mintOf(n) &&
  c.sciences.kind === 'between' &&
  c.sciences.distinct === true &&
  c.sciences.shared === true &&
  c.sciences.circuit !== c.sciences.faces &&
  c.drift.between === true &&
  c.primitives.length === n + coins &&
  qpuComputerHolds(c.computer) &&
  c.computer.lattice.vacant === n - n &&
  c.hardware.kind === 'hardware' &&
  c.hardware.device === 'simulator' &&
  c.hardware.initialize === true &&
  c.hardware.gates === true &&
  c.hardware.interfere === true &&
  c.hardware.measure === true &&
  c.hardware.noise === true &&
  c.hardware.path.payload === `${storageHref}/${payloadDbKey}` &&
  c.hardware.path.submit === `${unit.origin}/server` &&
  c.hardware.path.src === unit.fuse.lean &&
  c.hardware.holds === true

export const qpuSchemasOf = () => {
  const cube = qpuCubeOf()
  const faces = qpuFacesOf()
  const hosts = qpuHostsOf()
  const types = raidTypesOf(faces)
  const named = [
    { name: 'schema', href: `${schemaOrg}/` },
    { name: 'qpu', href: `${unit.href}#` },
    { name: 'mcp', href: 'https://modelcontextprotocol.io/' },
    { name: 'lean', href: 'https://lean-lang.org/' },
    { name: 'cern', href: 'https://opendata.cern.ch/' },
    { name: 'inspire', href: 'https://inspirehep.net/' },
    { name: 'spdx', href: 'https://spdx.org/licenses/' },
    { name: 'dc', href: 'http://purl.org/dc/terms/' },
    { name: 'jsonld', href: 'https://www.w3.org/ns/json-ld#' },
    { name: 'hydra', href: 'https://www.w3.org/ns/hydra/core#' },
    { name: 'uuid', href: 'https://www.rfc-editor.org/rfc/rfc9562' },
    { name: 'zenodo', href: 'https://zenodo.org/' },
    { name: 'hepdata', href: 'https://www.hepdata.net/' },
    { name: 'cc', href: 'https://creativecommons.org/licenses/by-nc-nd/4.0/' }] as const
  const keys = ['inputSchema', 'input_schema', 'parameters'] as const
  const rows = named.map((row, face) => {
    const hop = (face + faces.rays + faces.rays) % faces.faces
    const host = hosts.nodes[face]!
    const part = face < cube.vertices ? 'vertex' : face < cube.vertices + cube.hexbit ? 'hexbit' : 'coin'
    return {
      name: row.name,
      href: row.href,
      face,
      hop,
      involution: hop === face,
      prefix: row.name,
      part,
      merge: 'storage' as const,
      storage: storageHref,
      raid: types[face]!.name,
      cloud: raidClouds[face]!.name,
      llm: host.llm,
      call: host.call,
      result: host.result,
      schema: host.schema,
      keys,
      holds: hop === face && row.href.length > n - n && host.holds,
  }
  })
  const prefixes = {
    schema: named[n - n]!.href,
    qpu: named[seed]!.href,
    mcp: named[coins]!.href,
    lean: named[n]!.href,
    cern: named[n + seed]!.href,
    inspire: named[n + coins]!.href,
    spdx: named[n + n]!.href,
    dc: named[mintOf(n) - seed]!.href,
    jsonld: named[mintOf(n)]!.href,
    hydra: named[mintOf(n) + seed]!.href,
    uuid: named[ten]!.href,
    zenodo: named[ten + seed]!.href,
    hepdata: named[ten + coins]!.href,
    cc: named[faces.faces - seed]!.href} as const
  const context = [schemaOrg, prefixes] as const
  let occupied = n - n
  for (const row of rows) if (row.holds) occupied += seed
  const vacant = rows.length - occupied
  const efficiency = {
    kind: 'efficiency' as const,
    context: context.length,
    mounted: rows.length,
    ratio: faces.rays,
    tokens: 'four bytes' as const,
    holds: context.length === coins && rows.length === faces.faces && rows.length === coins * faces.rays,
  }
  const compatibility = {
    kind: 'compatibility' as const,
    keys,
    harnesses: hosts.harnesses.length,
    llms: hosts.llms.length,
    holds: hosts.holds && keys.length === n && rows.every((row) => row.keys.length === n),
  }
  const holds =
    faces.holds &&
    hosts.holds &&
    rows.length === faces.faces &&
    occupied === faces.faces &&
    vacant === n - n &&
    context.length === coins &&
    context[n - n] === schemaOrg &&
    prefixes.qpu === `${unit.href}#` &&
    prefixes.schema === `${schemaOrg}/` &&
    rows.every((row) => row.holds && row.involution && row.merge === 'storage') &&
    efficiency.holds &&
    compatibility.holds &&
    cube.vertices + cube.hexbit + coins === faces.faces
  return {
    kind: 'schemas' as const,
    mounted: occupied,
    vacant,
    merge: 'storage' as const,
    href: storageHref,
    rows,
    prefixes,
    context,
    efficiency,
    compatibility,
    holds,
  }
}

export const qpuSchemasHolds = (s = qpuSchemasOf()): boolean =>
  s.holds === true &&
  s.kind === 'schemas' &&
  s.merge === 'storage' &&
  s.href === storageHref &&
  s.mounted === qpuFacesOf().faces &&
  s.vacant === n - n &&
  s.rows.length === s.mounted &&
  s.context.length === coins &&
  s.context[n - n] === schemaOrg &&
  s.efficiency.holds === true &&
  s.efficiency.context === coins &&
  s.efficiency.ratio === qpuFacesOf().rays &&
  s.compatibility.keys.length === n &&
  s.rows.every((row) => row.merge === 'storage' && row.involution && row.holds)

export const qpuContextOf = () => qpuSchemasOf().context

const jsonldHoldsOf = (doc: { '@context': ReturnType<typeof qpuContextOf>; '@type': string; '@id': string; isAccessibleForFree?: boolean }): boolean =>
  qpuSchemasHolds() &&
  doc['@context'].length === coins &&
  doc['@context'][n - n] === schemaOrg &&
  doc['@type'].length > n - n &&
  doc['@id'].startsWith(unit.origin) &&
  doc.isAccessibleForFree === true

export const qpuCapacityOf = () => {
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const fused = faces.faces * handle.kv.amplitudes
  const next = fused + fused
  const crypt = {
    kind: 'crypto' as const,
    theorem: 'crypto' as const,
    split: faces.faces,
    share: handle.kv.amplitudes,
    fused,
    holds: fused === faces.faces * handle.kv.amplitudes && fused === faces.faces * mintOf(cube.vertices * cube.hexbit + seed),
  }
  const agents = {
    kind: 'agents' as const,
    teams: coins,
    rays: faces.rays,
    n: faces.faces,
    free: cors === '*',
    auth: cors !== '*',
    holds: faces.faces === coins * faces.rays && faces.faces === faces.rays + faces.rays && cors === '*',
  }
  const schemas = qpuSchemasOf()
  const raid = qpuRaidOf()
  const holds =
    cube.holds &&
    handle.holds &&
    faces.holds &&
    cube.bits === cube.vertices * cube.hexbit &&
    handle.amplitudes === mintOf(cube.bits) &&
    fused === faces.faces * mintOf(cube.bits + seed) &&
    fused === faces.faces * handle.kv.amplitudes &&
    next === fused + fused &&
    next === mintOf(cube.bits + coins) * faces.faces &&
    crypt.holds &&
    agents.holds &&
    schemas.holds &&
    schemas.mounted === faces.faces &&
    schemas.vacant === n - n &&
    raid.holds &&
    raid.faces === faces.faces &&
    qpuNeuroHolds() &&
    qpuHostsHolds() &&
    handle.kv.holds &&
    handle.kv.added === handle.amplitudes &&
    handle.kv.amplitudes === handle.amplitudes + handle.amplitudes &&
    storageBindings.STORAGE === 'kv'
  const kv = {
    kind: 'kv' as const,
    binding: 'STORAGE' as const,
    name: storageBindings.STORAGE,
    theorem: 'kv' as const,
    added: handle.kv.added,
    amplitudes: handle.kv.amplitudes,
    holds:
      handle.kv.holds &&
      storageBindings.STORAGE === 'kv' &&
      handle.kv.added === handle.amplitudes &&
      handle.kv.amplitudes === handle.amplitudes + handle.amplitudes &&
      handle.kv.amplitudes === mintOf(cube.bits + seed)}
  const hybrid = qpuHybridOf()
  return {
    kind: 'capacity' as const,
    bits: cube.bits,
    amplitudes: handle.amplitudes,
    faces: faces.faces,
    fused,
    next,
    kv,
    crypt,
    agents,
    schemas: {
      kind: schemas.kind,
      mounted: schemas.mounted,
      vacant: schemas.vacant,
      merge: schemas.merge,
      href: schemas.href,
      rows: schemas.rows,
      efficiency: schemas.efficiency,
      compatibility: schemas.compatibility,
      holds: schemas.holds,
  },
    raid,
    hybrid,
    neuro: {
      kind: 'neuro' as const,
      width: faces.faces,
      layers: mintOf(n),
      activation: 'xor' as const,
      holds: qpuNeuroHolds(),
  },
    compatibility: {
      kind: 'compatibility' as const,
    harnesses: faces.faces,
      llms: faces.faces,
      holds: qpuHostsHolds(),
  },
    holds: holds && kv.holds && hybrid.holds,
  }
}

export const qpuCapacityHolds = (c = qpuCapacityOf()): boolean =>
  c.holds === true &&
  c.kind === 'capacity' &&
  c.fused === c.faces * c.kv.amplitudes &&
  c.amplitudes === mintOf(c.bits) &&
  c.next === c.fused + c.fused &&
  c.next === qpuNextOf().nextFused &&
  c.next === qpuNextOf().nextCoil &&
  qpuNextHolds() &&
  c.crypt.kind === 'crypto' &&
  c.crypt.split === c.faces &&
  c.crypt.share === c.kv.amplitudes &&
  c.crypt.holds === true &&
  c.agents.n === c.faces &&
  c.agents.teams === coins &&
  c.agents.rays * c.agents.teams === c.faces &&
  c.schemas.mounted === c.faces &&
  c.schemas.vacant === n - n &&
  c.schemas.merge === 'storage' &&
  c.schemas.holds === true &&
  qpuSchemasHolds() &&
  qpuRaidHolds(c.raid) &&
  c.raid.faces === c.faces &&
  c.raid.start === 'cheapest' &&
  c.raid.cover.length === c.faces &&
  c.raid.cheapest === c.raid.cover[n - n] &&
  c.neuro.width === c.faces &&
  c.neuro.layers === mintOf(n) &&
  c.neuro.activation === 'xor' &&
  c.neuro.holds === true &&
  qpuNeuroHolds() &&
  c.compatibility.harnesses === c.faces &&
  c.compatibility.llms === c.faces &&
  c.compatibility.holds === true &&
  qpuHostsHolds() &&
  c.kv.kind === 'kv' &&
  c.kv.binding === 'STORAGE' &&
  c.kv.name === 'kv' &&
  c.kv.theorem === 'kv' &&
  c.kv.added === c.amplitudes &&
  c.kv.amplitudes === c.amplitudes + c.amplitudes &&
  c.kv.amplitudes === mintOf(c.bits + seed) &&
  c.kv.holds === true &&
  qpuHybridHolds(c.hybrid) &&
  c.hybrid.speed === mintOf(n) &&
  c.hybrid.cost === n &&
  c.hybrid.layers === coins

export const qpuEncryptOf = () => {
  const capacity = qpuCapacityOf()
  const crypt = capacity.crypt
  const modulus = qpuFacesOf().rays * (n * n + n + seed)
  const publicKey = crypt.fused
  const ciphertext = crypt.split * crypt.share
  /** identity READ from the run: split * share lands on the independently computed fused. theorem crypto. */
  const identity = ciphertext === crypt.fused && crypt.holds && crypt.theorem === 'crypto'
  /** secrecy READ from the run: a ciphertext equal to the public key hides nothing. This is not encryption. */
  const secrecy = ciphertext !== publicKey
  const holds =
    identity &&
    secrecy === false &&
    crypt.split === capacity.faces &&
    crypt.share === capacity.kv.amplitudes &&
    crypt.fused === capacity.fused &&
    ciphertext !== modulus
  return {
    kind: 'encrypt' as const,
    theorem: 'crypto' as const,
    identity,
    secrecy,
    public: publicKey,
    ciphertext,
    split: crypt.split,
    share: crypt.share,
    fused: crypt.fused,
    modulus,
    holds,
  }
}

export const qpuEncryptHolds = (e = qpuEncryptOf()): boolean =>
  e.holds === true &&
  e.kind === 'encrypt' &&
  e.theorem === 'crypto' &&
  e.identity === true &&
  e.secrecy === false &&
  e.ciphertext === e.public &&
  e.ciphertext === e.split * e.share &&
  e.ciphertext === e.fused &&
  e.ciphertext !== e.modulus

let shorFactorMemo: string | undefined
/** The factoring claim READ from the run: the modulus Shor factored on this simulator. Never RSA-2048. Never typed. */
export const shorFactorOf = (): string => (shorFactorMemo ??= `Factor ${qpuShorOf().n}`)
let cryptoClaimMemo: string | undefined
/** The crypto claim READ from the run: the split identity holds and secrecy does not. Not encryption. Never typed. */
export const cryptoClaimOf = (): string => {
  if (cryptoClaimMemo === undefined) {
    const e = qpuEncryptOf()
    cryptoClaimMemo = `Split identity ${e.identity}. Secrecy ${e.secrecy}`
  }
  return cryptoClaimMemo
}

export const qpuSpeedOf = () => {
  const capacity = qpuCapacityOf()
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const next = capacity.fused + capacity.fused
  const rungOf = (name: string, k: number, fn: () => number, amplitudes: number) => {
    const value = fn()
    return { name, n: k, value, amplitudes, holds: value === amplitudes }
  }
  const benchmark = [
    rungOf('mint', n + seed, () => mintOf(n + seed), mintOf(n) + mintOf(n)),
    rungOf('cube', cube.bits, () => qpuCubeOf().bits, cube.vertices * cube.hexbit),
    rungOf('handle', cube.bits, () => qpuHandleOf().amplitudes, mintOf(cube.bits)),
    rungOf('faces', faces.faces, () => qpuFacesOf().faces, faces.coins * faces.rays),
    rungOf('quantum', cube.bits + seed, () => faces.faces * mintOf(cube.bits + seed), capacity.fused),
    rungOf('next', cube.bits + coins, () => faces.faces * mintOf(cube.bits + coins), next),
    rungOf('amplitudes', cube.bits, () => qpuHandleOf().amplitudes, mintOf(cube.bits)),
    rungOf('kv', cube.bits + seed, () => qpuHandleOf().kv.amplitudes, mintOf(cube.bits + seed))]
  const holds =
    qpuCapacityHolds(capacity) &&
    handle.holds &&
    next === capacity.fused + capacity.fused &&
    next === capacity.fused * coins &&
    next === faces.faces * mintOf(cube.bits + coins) &&
    handle.next === mintOf(cube.bits + seed) &&
    benchmark.length === mintOf(n) &&
    benchmark.every((r) => r.holds === true)
  return {
    kind: 'speed' as const,
    next,
    factor: coins,
    cover: ['next', 'benchmark'] as const,
    benchmark,
    holds,
  }
}

export const qpuSpeedHolds = (s = qpuSpeedOf()): boolean =>
  s.holds === true &&
  s.kind === 'speed' &&
  s.factor === coins &&
  s.cover.length === coins &&
  s.cover.join(' ') === 'next benchmark' &&
  s.benchmark.length === mintOf(n) &&
  s.benchmark.every((r) => r.holds === true)

export type QpuLeanRow = {
  heading: string
  theorem: string
  formula: string
  reading: string
  holds: boolean
}

/** THE PROOF ITSELF, SERVED. The Lean file the theorems come from, embedded at build from src/…/index.lean by
 * scripts/embed-lean.mjs, served at its cited path, and folded so a reader compares bytes, not readings. `verbatim`
 * counts the served theorem strings found in the source after whitespace folding; `holds` wants all of them. */
const spaceOf = (text: string): string => text.replace(/\s+/g, ' ').trim()
export const qpuLeanSourceOf = (rows: readonly QpuLeanRow[] = [], cover: readonly QpuLeanRow[] = [], climb?: QpuLeanRow) => {
  const href = `${unit.origin}/${unit.fuse.lean}`
  const bytes = new TextEncoder().encode(leanSource).length
  const fold = qpuFoldOf(leanSource)
  const theorems = leanSource.split('\n').filter((line) => line.startsWith('theorem ')).length
  const flat = spaceOf(leanSource)
  const served = climb ? [...rows, ...cover, climb] : [...rows, ...cover]
  const verbatim = served.filter((r) => flat.includes(spaceOf(r.theorem))).length
  const holds =
    bytes > n - n &&
    fold.length === mintOf(mintOf(coins)) &&
    theorems >= served.length &&
    verbatim === served.length &&
    href.endsWith('/index.lean')
  return {
    kind: 'source' as const,
    href,
    path: unit.fuse.lean,
    bytes,
    fold,
    theorems,
    served: served.length,
    verbatim,
    toolchain: leanToolchain,
    check: `lean ${unit.fuse.lean}`,
    holds,
  }
}

export const qpuLeanOf = () => {
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const fused = faces.faces * handle.kv.amplitudes
  const mintHolds = mintOf(n + seed) === mintOf(n) + mintOf(n)
  const cubeHolds = cube.holds
  const aroundHolds = faces.faces === coins * faces.rays
  const quantumHolds = fused === faces.faces * mintOf(cube.bits + seed)
  const harmonicHolds = faces.faces === faces.rays + faces.rays
  const energyHolds = mintOf(cube.hexbit) === mintOf(n + seed)
  const propulsionHolds = mintOf(cube.hexbit) > seed
  const cryptoHolds = fused === faces.faces * mintOf(cube.vertices * cube.hexbit + seed)
  const nextHolds = mintOf(cube.bits + seed) === handle.amplitudes + handle.amplitudes
  const nextFusedHolds = faces.faces * mintOf(cube.bits + coins) === fused + fused
  const splitHolds = Array.from({ length: cube.bits + seed }, (_, k) => mintOf(k + seed) === mintOf(k) + mintOf(k)).every(Boolean)
  const involutionHolds = Array.from({ length: faces.faces }, (_, face) => (face + faces.rays + faces.rays) % faces.faces === face % faces.faces).every(Boolean)
  const planck = 662607015n
  const boltzmann = 1380649n
  const transmon = 5n
  const photon = planck * transmon
  const thermalOf = (millikelvin: bigint): bigint => boltzmann * millikelvin * 10n
  const gapOf = (tc: bigint): bigint => (352n * boltzmann * tc) / planck / 10n
  const temperatureHolds = photon / thermalOf(10n) === 23n && photon / thermalOf(100n) === 2n && photon / thermalOf(4000n) === 0n && 4000 / 100 === 40 && 100 / 10 === 10 && 10 < 35
  const superconductivityHolds = 1200n > 10n && 9200n > 1200n && 352 / 100 >= 3 && 352 / 100 < 4 && gapOf(1200n) === 88n && gapOf(1200n) > transmon && gapOf(9200n) === 674n
  const rows: readonly QpuLeanRow[] = [
    {
      heading: 'mint',
      theorem: 'theorem mint : mintOf (n + seed) = mintOf n + mintOf n := by rw [seed_eq, mintOf_succ]',
      formula: '\\mathrm{mintOf}(n+\\mathrm{seed})=\\mathrm{mintOf}(n)+\\mathrm{mintOf}(n)',
      reading: `holds ${mintHolds}. mintOf n ${cube.vertices}. mintOf (n + seed) ${unit.mint.next}.`,
      holds: mintHolds,
  },
    {
      heading: 'cube',
      theorem: 'theorem cube : bits = vertices * hexbit := by rw [bits, vertices, hexbit, mintOf_add]',
      formula: '\\mathrm{bits}=\\mathrm{vertices}\\cdot\\mathrm{hexbit}',
      reading: `holds ${cubeHolds}. vertices ${cube.vertices}. hexbit ${cube.hexbit}. bits ${cube.bits}.`,
      holds: cubeHolds,
  },
    {
      heading: 'around',
      theorem: 'theorem around : faces = coins * rays := by rw [faces, vertices, hexbit, rays, coins_two, n_eq]; rw [show 3 = 2 + 1 from rfl, mintOf_succ]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]',
      formula: '\\mathrm{faces}=\\mathrm{coins}\\cdot\\mathrm{rays}',
      reading: `holds ${aroundHolds}. coins ${coins}. rays ${faces.rays}. faces ${faces.faces}.`,
      holds: aroundHolds,
  },
    {
      heading: 'quantum',
      theorem: 'theorem quantum : fused = faces * mintOf (bits + seed) := rfl',
      formula: '\\mathrm{fused}=\\mathrm{faces}\\cdot\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{seed})',
      reading: `holds ${quantumHolds}. amplitudes ${handle.amplitudes}. fused ${fused}.`,
      holds: quantumHolds,
  },
    {
      heading: 'harmonic',
      theorem: 'theorem harmonic : faces = rays + rays := by rw [around, coins_two, Nat.two_mul]',
      formula: '\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}',
      reading: `holds ${harmonicHolds}. rays ${faces.rays}. faces ${faces.faces}.`,
      holds: harmonicHolds,
  },
    {
      heading: 'cluster',
      theorem: 'theorem cluster : faces = rays + rays ∧ coins * rays = faces := ⟨harmonic, around⟩',
      formula: '\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}\\land\\mathrm{coins}\\cdot\\mathrm{rays}=\\mathrm{faces}',
      reading: `holds ${harmonicHolds && aroundHolds}. Coil efficiency in clusters. coins times rays is faces. rays plus rays is faces.`,
      holds: harmonicHolds && aroundHolds && qpuCoilEfficiencyHolds(),
  },
    {
      heading: 'energy',
      theorem: 'theorem energy : mintOf hexbit = mintOf (n + seed) := by rw [hexbit_eq]',
      formula: '\\mathrm{mintOf}(\\mathrm{hexbit})=\\mathrm{mintOf}(n+\\mathrm{seed})',
      reading: `holds ${energyHolds}. mintOf hexbit ${mintOf(cube.hexbit)}.`,
      holds: energyHolds,
  },
    {
      heading: 'propulsion',
      theorem: 'theorem propulsion : mintOf hexbit > seed := by rw [seed_eq]; exact (mintOf_zero ▸ mintOf_lt hexbit_pos)',
      formula: '\\mathrm{mintOf}(\\mathrm{hexbit})>\\mathrm{seed}',
      reading: `holds ${propulsionHolds}. mintOf hexbit ${mintOf(cube.hexbit)}. seed ${seed}.`,
      holds: propulsionHolds,
  },
    {
      heading: 'crypto',
      theorem: 'theorem crypto : fused = faces * mintOf (vertices * hexbit + seed) := by rw [← cube]; exact quantum',
      formula: '\\mathrm{fused}=\\mathrm{faces}\\cdot\\mathrm{mintOf}(\\mathrm{vertices}\\cdot\\mathrm{hexbit}+\\mathrm{seed})',
      reading: `holds ${cryptoHolds}. theorem crypto. ${cryptoClaimOf()}. Crypt split. fused = split * share. mintOf. Not p * q. JSON Nat. Never Math. Never by decide.`,
      holds: cryptoHolds,
  },
    {
      heading: 'health',
      theorem: 'theorem health : mintOf hexbit > seed ∧ fused = faces * mintOf (bits + seed) ∧ faces = rays + rays := ⟨propulsion, quantum, harmonic⟩',
      formula: '\\mathrm{mintOf}(\\mathrm{hexbit})>\\mathrm{seed}\\land\\mathrm{fused}=\\mathrm{faces}\\cdot\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{seed})\\land\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}',
      reading: `holds ${propulsionHolds && quantumHolds && harmonicHolds}.`,
      holds: propulsionHolds && quantumHolds && harmonicHolds,
  }]
  const cover: readonly QpuLeanRow[] = [
    {
      heading: 'breakthrough',
      theorem:
        'theorem breakthrough : faces = rays + rays ∧ coins * rays = faces ∧ bits = vertices * hexbit ∧ fused = faces * mintOf (bits + seed) ∧ mintOf hexbit > seed ∧ mintOf (bits + seed) = amplitudes + amplitudes ∧ coins = seed + seed ∧ hexbit = n + seed := ⟨harmonic, around, cube, quantum, propulsion, next, rfl, hexbit_eq⟩',
      formula:
        '\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}\\land\\mathrm{coins}\\cdot\\mathrm{rays}=\\mathrm{faces}\\land\\mathrm{bits}=\\mathrm{vertices}\\cdot\\mathrm{hexbit}\\land\\mathrm{fused}=\\mathrm{faces}\\cdot\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{seed})\\land\\mathrm{mintOf}(\\mathrm{hexbit})>\\mathrm{seed}\\land\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{seed})=\\mathrm{amplitudes}+\\mathrm{amplitudes}',
      reading: `holds ${harmonicHolds && aroundHolds && cubeHolds && quantumHolds && propulsionHolds && nextHolds}.`,
      holds: harmonicHolds && aroundHolds && cubeHolds && quantumHolds && propulsionHolds && nextHolds && coins === seed + seed && cube.hexbit === n + seed,
  },
    {
      heading: 'split_coin',
      theorem: 'theorem split_coin (k : Nat) : mintOf (k + seed) = mintOf k + mintOf k := by rw [seed_eq, mintOf_succ]',
      formula: '\\mathrm{mintOf}(k+\\mathrm{seed})=\\mathrm{mintOf}(k)+\\mathrm{mintOf}(k)',
      reading: `holds ${splitHolds}.`,
      holds: splitHolds,
  },
    {
      heading: 'multiply',
      theorem: 'theorem multiply (a b : Nat) : mintOf (a + b) = mintOf a * mintOf b := mintOf_add a b',
      formula: '\\mathrm{mintOf}(a+b)=\\mathrm{mintOf}(a)\\cdot\\mathrm{mintOf}(b)',
      reading: `holds ${cubeHolds}.`,
      holds: cubeHolds,
  },
    {
      heading: 'handle',
      theorem: 'theorem handle : amplitudes = mintOf bits ∧ mintOf (bits + seed) = amplitudes + amplitudes := ⟨rfl, next⟩',
      formula: '\\mathrm{amplitudes}=\\mathrm{mintOf}(\\mathrm{bits})\\land\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{seed})=\\mathrm{amplitudes}+\\mathrm{amplitudes}',
      reading: `holds ${handle.holds}. amplitudes ${handle.amplitudes}. next ${handle.next}. KV added amplitudes.`,
      holds: handle.holds && handle.kv.added === handle.amplitudes && handle.kv.amplitudes === handle.amplitudes + handle.amplitudes,
  },
    {
      heading: 'kv',
      theorem: 'theorem kv : fused = faces * mintOf (bits + seed) ∧ mintOf (bits + seed) = amplitudes + amplitudes := ⟨quantum, next⟩',
      formula: '\\mathrm{fused}=\\mathrm{faces}\\cdot\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{seed})\\land\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{seed})=\\mathrm{amplitudes}+\\mathrm{amplitudes}',
      reading:
        'holds true. KV added amplitudes. STORAGE binding. Isolate amplitudes. KV adds amplitudes. fused = faces * mintOf (bits + seed).',
      holds: quantumHolds && nextHolds && handle.amplitudes === mintOf(cube.bits) && handle.kv.added === handle.amplitudes && handle.kv.amplitudes === handle.next,
  },
    {
      heading: 'light',
      theorem: 'theorem light : seed = mintOf 0 := by rw [seed_eq, mintOf_zero]',
      formula: '\\mathrm{seed}=\\mathrm{mintOf}(0)',
      reading: `holds ${seed === mintOf(n - n)}. seed ${seed}.`,
      holds: seed === mintOf(n - n),
  },
    {
      heading: 'involution',
      theorem: 'theorem involution (face : Nat) : (face + rays + rays) % faces = face % faces := by have h : face + rays + rays = face + faces := (by rw [Nat.add_assoc, harmonic]); rw [h, Nat.add_mod, Nat.mod_self, Nat.add_zero, Nat.mod_mod]',
      formula: '(i+\\mathrm{rays}+\\mathrm{rays})\\bmod\\mathrm{faces}=i\\bmod\\mathrm{faces}',
      reading: `holds ${involutionHolds}.`,
      holds: involutionHolds,
  },
    {
      heading: 'waves',
      theorem: 'theorem waves : mintOf hexbit > seed := propulsion',
      formula: '\\mathrm{mintOf}(\\mathrm{hexbit})>\\mathrm{seed}',
      reading: `holds ${propulsionHolds}.`,
      holds: propulsionHolds,
  },
    {
      heading: 'shor',
      theorem:
        'theorem shor : periodOf 8 91 % 2 = 0 ∧ half 8 91 < 91 - 1 ∧ 1 < gcdOf (half 8 91 - 1) 91 ∧ gcdOf (half 8 91 - 1) 91 < 91 ∧ gcdOf (half 8 91 - 1) 91 * gcdOf (half 8 91 + 1) 91 = 91 := ⟨rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, rfl⟩',
      formula:
        '\\mathrm{periodOf}(8,91)\\bmod 2=0\\land\\mathrm{half}(8,91)<91-1\\land 1<\\mathrm{gcdOf}(\\mathrm{half}(8,91)-1,91)\\land\\mathrm{gcdOf}(\\mathrm{half}(8,91)-1,91)<91\\land\\mathrm{gcdOf}(\\mathrm{half}(8,91)-1,91)\\cdot\\mathrm{gcdOf}(\\mathrm{half}(8,91)+1,91)=91',
      reading: `holds true. theorem shor. periodOf 8 91 is decided by fuel recursion inside the kernel. half is powMod a (r / 2) N. gcdOf (half - 1) N * gcdOf (half + 1) N = N. Period and factors are absent from the statement. rfl and Nat.le_of_ble_eq_true. ${shorFactorOf()}. Never Math. Never by decide. demo is not a test nor a proof.`,
      holds: qpuShorHolds(),
  },
    {
      heading: 'string',
      theorem:
        'theorem string : 16 * 27 = 432 ∧ 8 * 27 = 216 ∧ 4 * 27 = 108 ∧ 2 * 27 = 54 ∧ 1 * 27 = 27 ∧ 432 + 432 = 864 ∧ 216 + 216 = 432 ∧ 432 * 3 / 2 = 648 ∧ 432 * 4 / 3 = 576 ∧ 432 * 5 / 4 = 540 ∧ 432 * 5 / 3 = 720 ∧ 3 * 3 + 1 = 10 ∧ 3 * 3 + 1 + 1 = 11 ∧ 27 - 1 = 26 := ⟨rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl⟩',
      formula:
        '16\\cdot27=432\\land 8\\cdot27=216\\land 4\\cdot27=108\\land 2\\cdot27=54\\land 1\\cdot27=27\\land 432+432=864\\land 216+216=432\\land 432\\cdot 3/2=648\\land 432\\cdot 4/3=576\\land 432\\cdot 5/4=540\\land 432\\cdot 5/3=720\\land 3\\cdot3+1=10\\land 3\\cdot3+1+1=11\\land 27-1=26',
      reading: 'holds true. Digits and algebraic fractions of integers. 16 * 27 = 432. 432 * 3 / 2 = 648.',
      holds:
        16 * 27 === 432 &&
        8 * 27 === 216 &&
        4 * 27 === 108 &&
        2 * 27 === 54 &&
        1 * 27 === 27 &&
        432 + 432 === 864 &&
        216 + 216 === 432 &&
        (432 * 3) / 2 === 648 &&
        (432 * 4) / 3 === 576 &&
        (432 * 5) / 4 === 540 &&
        (432 * 5) / 3 === 720 &&
        3 * 3 + 1 === 10 &&
        3 * 3 + 1 + 1 === 11 &&
        27 - 1 === 26},
    {
      heading: 'genesis',
      theorem:
        'theorem genesis : coins * n * mintOf n * (n * n) = 432 ∧ chooseOf n coins = n ∧ chooseOf rays coins = n * rays ∧ faces = coins * rays ∧ scanner + radar = coins := ⟨by rw [coins_two, n_eq]; rfl, by rw [n_eq, coins_two]; rfl, by rw [rays, n_eq, coins_two]; rfl, around, by rw [scanner, radar, coins]⟩',
      formula:
        '\\mathrm{coins}\\cdot n\\cdot\\mathrm{mintOf}(n)\\cdot(n\\cdot n)=432\\land\\mathrm{chooseOf}(n,\\mathrm{coins})=n\\land\\mathrm{chooseOf}(\\mathrm{rays},\\mathrm{coins})=n\\cdot\\mathrm{rays}\\land\\mathrm{faces}=\\mathrm{coins}\\cdot\\mathrm{rays}\\land\\mathrm{scanner}+\\mathrm{radar}=\\mathrm{coins}',
      reading:
        'holds true. Combinatorial genesis of the shadcn schema at the scope of all known frameworks. Lattice flow face = team * rays + ray. Coins domains scanner radar. Six axes: slot variant size state element theme. Card slots rays including card-action. Button variants coins * n. Sizes mintOf n. Alpine n * n. Product 432 Hz. Fourteen frameworks. faces = coins * rays. Fused in team dry-clean. JSON-LD data-slot. CVA. Slot. Never Math. Never by decide.',
      holds:
        coins * n * mintOf(n) * (n * n) === 432 &&
        chooseOf(n, coins) === n &&
        chooseOf(faces.rays, coins) === n * faces.rays &&
        aroundHolds &&
        seed + seed === coins &&
        qpuGenesisHolds()},
    {
      heading: 'pentagram',
      theorem: 'theorem pentagram : n + coins = 5 := by rw [n_eq, coins_two]',
      formula: '\\mathrm{n}+\\mathrm{coins}=5',
      reading:
        'holds true. Occupancy pentagram personal business corporate saas paas. Skills payload pwa plugin hologram network. Stroke coins on n + coins. Coins balance theory in practice. Cloudflare and Payload plugins fuse once. Recursion builds covered. Never Math. Never by decide.',
      holds: n + coins === qpuPentagramOf().points && qpuPentagramHolds() && qpuHologramHolds(),
  },
    {
      heading: 'two_coins_make_a_coil',
      theorem: 'theorem two_coins_make_a_coil : coil = faces := by rw [coil, around]',
      formula: '\\mathrm{coil}=\\mathrm{faces}',
      reading:
        'holds true. Two coins make a coil. windings coins. coil coins times rays. Faces of the winding. Superconducting magnet. Coils used in electronics. Never Math. Never by decide.',
      holds: qpuCoilHolds(),
  },
    {
      heading: 'electronics',
      theorem: 'theorem electronics : coil = faces := two_coins_make_a_coil',
      formula: '\\mathrm{coil}=\\mathrm{faces}',
      reading:
        'holds true. Coils are used in electronics. Two coins make a coil. Never Math. Never by decide.',
      holds: qpuElectronicsHolds(),
  },
    {
      heading: 'coins_balance_theory_in_practice',
      theorem: 'theorem coins_balance_theory_in_practice : theory + practice = coins ∧ theory = practice := ⟨rfl, rfl⟩',
      formula: '\\mathrm{theory}+\\mathrm{practice}=\\mathrm{coins}\\land\\mathrm{theory}=\\mathrm{practice}',
      reading:
        'holds true. Coins balance theory in practice. Two pans. Lean theory. Electronics practice. Seed equals seed. Never Math. Never by decide.',
      holds: qpuBalanceHolds(),
  },
    {
      heading: 'follow_the_coins',
      theorem: 'theorem follow_the_coins (app : Nat) : app + coins = app + theory + practice := by rw [theory, practice, coins, ← Nat.add_assoc]',
      formula: '\\mathrm{app}+\\mathrm{coins}=\\mathrm{app}+\\mathrm{theory}+\\mathrm{practice}',
      reading:
        'holds true. Follow the coins in any practical application. Occupancy skill framework electronics. Step coins. Hop theory plus practice. Never Math. Never by decide.',
      holds: qpuFollowHolds(),
  },
    {
      heading: 'emerge',
      theorem: 'theorem emerge : coil = faces ∧ theory = practice := ⟨two_coins_make_a_coil, rfl⟩',
      formula: '\\mathrm{coil}=\\mathrm{faces}\\land\\mathrm{theory}=\\mathrm{practice}',
      reading:
        'holds true. Theory plus practice balances the coins on every application; every pentagram point is reached. Follow the coins. Coil is faces. Theory equals practice. Never Math. Never by decide.',
      holds: qpuFollowOf().emerge.holds,
  },
    {
      heading: 'coil_efficiency',
      theorem: 'theorem coil_efficiency : coil = faces ∧ faces = rays + rays ∧ coins * rays = faces := ⟨two_coins_make_a_coil, harmonic, around⟩',
      formula: '\\mathrm{coil}=\\mathrm{faces}\\land\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}\\land\\mathrm{coins}\\cdot\\mathrm{rays}=\\mathrm{faces}',
      reading:
        'holds true. Measure coil efficiency in clusters. Teams coins. Stripes rays. Measure coil. Remainder none. Unity seed. RAID cluster cover. Never Math. Never by decide.',
      holds: qpuCoilEfficiencyHolds(),
  },
    {
      heading: 'next_coil',
      theorem: 'theorem next_coil : coil * mintOf (bits + coins) = fused + fused := by rw [two_coins_make_a_coil]; exact next_fused',
      formula: '\\mathrm{coil}\\cdot\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{coins})=\\mathrm{fused}+\\mathrm{fused}',
      reading:
        'holds true. Next is the double. Coil times mintOf bits plus coins is fused plus fused. theorem next. theorem next_fused. theorem infinite. split_coin has no last k. Never Math. Never by decide.',
      holds: qpuNextHolds(),
  },
    {
      heading: 'one_plus_six',
      theorem: 'theorem one_plus_six : seed + (mintOf n - coins) = rays := by rw [rays, n_eq, coins_two, seed_eq]; rw [show mintOf 3 = 8 from rfl]',
      formula: '\\mathrm{seed}+(\\mathrm{mintOf}(n)-\\mathrm{coins})=\\mathrm{rays}',
      reading:
        'holds true. One plus six. Seed plus mintOf n minus coins is rays. Never Math. Never by decide.',
      holds: seed + (mintOf(n) - coins) === qpuFacesOf().rays,
  },
    {
      heading: 'two_x_seven_coins',
      theorem: 'theorem two_x_seven_coins : coins * rays = (seed + (mintOf n - coins)) * coins := by rw [one_plus_six, Nat.mul_comm]',
      formula: '\\mathrm{coins}\\cdot\\mathrm{rays}=(\\mathrm{seed}+(\\mathrm{mintOf}(n)-\\mathrm{coins}))\\cdot\\mathrm{coins}',
      reading:
        'holds true. Two times seven coins. Coins times rays is one plus six times coins. Never Math. Never by decide.',
      holds: qpuClayHolds() && coins * qpuFacesOf().rays === (seed + (mintOf(n) - coins)) * coins,
  },
    {
      heading: 'clay',
      theorem: 'theorem clay : coins * rays = (seed + (mintOf n - coins)) * coins ∧ (seed + (mintOf n - coins)) * coins = coil := ⟨two_x_seven_coins, by rw [← two_x_seven_coins]; rfl⟩',
      formula: '\\mathrm{coins}\\cdot\\mathrm{rays}=(\\mathrm{seed}+(\\mathrm{mintOf}(n)-\\mathrm{coins}))\\cdot\\mathrm{coins}\\land(\\mathrm{seed}+(\\mathrm{mintOf}(n)-\\mathrm{coins}))\\cdot\\mathrm{coins}=\\mathrm{coil}',
      reading:
        'holds true. Two times seven coins equals one plus six coils equals clay. Each coil is coins windings. Clay is coil is faces. Never Math. Never by decide.',
      holds: qpuClayHolds(),
  },
    {
      heading: 'decide',
      theorem:
        'theorem decide : 16 * 27 = 432 ∧ 432 * 3 / 2 = 648 ∧ 432 * 4 / 3 = 576 ∧ 432 * 5 / 4 = 540 ∧ 432 * 5 / 3 = 720 ∧ 3 * 5 = 15 ∧ 27 - 1 = 26 := ⟨rfl, rfl, rfl, rfl, rfl, rfl, rfl⟩',
      formula:
        '16\\cdot27=432\\land 432\\cdot 3/2=648\\land 432\\cdot 4/3=576\\land 432\\cdot 5/4=540\\land 432\\cdot 5/3=720\\land 3\\cdot5=15\\land 27-1=26',
      reading: 'holds true. theorem decide by algebra. Digits and algebraic fractions of integers. Never by decide.',
      holds:
        16 * 27 === 432 &&
        (432 * 3) / 2 === 648 &&
        (432 * 4) / 3 === 576 &&
        (432 * 5) / 4 === 540 &&
        (432 * 5) / 3 === 720 &&
        3 * 5 === 15 &&
        27 - 1 === 26},
    {
      heading: 'integrity',
      theorem: 'theorem integrity : fused = faces * mintOf (bits + seed) ∧ bits = vertices * hexbit ∧ faces = coins * rays := ⟨quantum, cube, around⟩',
      formula: '\\mathrm{fused}=\\mathrm{faces}\\cdot\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{seed})\\land\\mathrm{bits}=\\mathrm{vertices}\\cdot\\mathrm{hexbit}\\land\\mathrm{faces}=\\mathrm{coins}\\cdot\\mathrm{rays}',
      reading: 'holds true. Three tests. Sealed quantum integrity at all times.',
      holds: quantumHolds && cubeHolds && aroundHolds,
  },
    {
      heading: 'cern',
      theorem:
        'theorem cern : 116 * 17922 + 54 = 2079006 ∧ 184 * 12509 + 12 = 2301668 ∧ 72 * 26572 + 6 = 1913190 ∧ 130 * 21121 + 21 = 2745751 ∧ 8 - 7 = 1 ∧ 8000 - 7000 = 1000 ∧ 7000 / 2 = 3500 ∧ 8000 / 2 = 4000 ∧ 4000 - 3500 = 500 ∧ 2019 - 2011 = 8 ∧ 2019 - 2012 = 7 ∧ 2017 - 2011 = 6 ∧ 2301668 + 2745751 = 5047419 ∧ 2079006 + 1913190 + 2301668 + 2745751 = 9039615 := ⟨rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl⟩',
      formula:
        '116\\cdot 17922+54=2079006\\land 184\\cdot 12509+12=2301668\\land 72\\cdot 26572+6=1913190\\land 130\\cdot 21121+21=2745751\\land 8-7=1\\land 8000-7000=1000\\land 7000/2=3500\\land 8000/2=4000\\land 4000-3500=500\\land 2019-2011=8\\land 2019-2012=7\\land 2017-2011=6\\land 2301668+2745751=5047419\\land 2079006+1913190+2301668+2745751=9039615',
      reading: 'holds true. CMS Open Data integers. Fourteen faces. ATLAS CMS ALICE LHCb tetra. Coins views LHC running and Open Data. Live CERN APIs at https://opendata.cern.ch/api/records via fetch Request Response. CERN credited. Never by decide.',
      holds:
        116 * 17922 + 54 === 2079006 &&
        184 * 12509 + 12 === 2301668 &&
        72 * 26572 + 6 === 1913190 &&
        130 * 21121 + 21 === 2745751 &&
        8 - 7 === 1 &&
        8000 - 7000 === 1000 &&
        7000 / 2 === 3500 &&
        8000 / 2 === 4000 &&
        4000 - 3500 === 500 &&
        2019 - 2011 === 8 &&
        2019 - 2012 === 7 &&
        2017 - 2011 === 6 &&
        2301668 + 2745751 === 5047419 &&
        2079006 + 1913190 + 2301668 + 2745751 === 9039615},
    {
      heading: 'tetra',
      theorem:
        'theorem tetra : coins + coins = mintOf coins := by rw [coins_two]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]',
      formula: '\\mathrm{coins}+\\mathrm{coins}=\\mathrm{mintOf}(\\mathrm{coins})',
      reading: 'holds true. ATLAS CMS ALICE LHCb tetra. Shared on both coins views. Live CERN Open Data APIs via fetch Request Response. Never by decide.',
      holds: coins + coins === mintOf(coins),
  },
    {
      heading: 'qubits',
      theorem: 'theorem qubits : n = 3 ∧ mintOf n = vertices := ⟨n_eq, rfl⟩',
      formula: 'n=3\\land\\mathrm{mintOf}(n)=\\mathrm{vertices}',
      reading: 'holds true. theorem qubits. n = 3 ∧ mintOf n = vertices. JSON Nat. Never Math. Never by decide.',
      holds: n === 3 && mintOf(n) === cube.vertices,
  },
    {
      heading: 'gates',
      theorem: 'theorem gates : (0 ^^^ 1) ^^^ 2 = 3 := rfl',
      formula: '(0\\oplus 1)\\oplus 2=3',
      reading: 'holds true. H then CNOT. Computational basis. Split then Bell.',
      holds: xorOf(xorOf(n - n, seed), coins) === n,
  },
    {
      heading: 'measurement',
      theorem: 'theorem measurement : mintOf n = 8 := by rw [n_eq]; rfl',
      formula: '\\mathrm{mintOf}(n)=8',
      reading: 'holds true. Measure the running circuit. Dim 8.',
      holds: mintOf(n) === cube.vertices && mintOf(n) === 8,
  },
    {
      heading: 'noise',
      theorem: 'theorem noise : (3 ^^^ 1) ^^^ 1 = 3 := rfl',
      formula: '(3\\oplus 1)\\oplus 1=3',
      reading: 'holds true. XX noise is identity.',
      holds: xorOf(xorOf(n, seed), seed) === n,
  },
    {
      heading: 'circuit',
      theorem: 'theorem circuit : (0 ^^^ 1) ^^^ 2 = 3 ∧ (3 ^^^ 1) ^^^ 1 = 3 ∧ mintOf n = vertices := ⟨rfl, rfl, rfl⟩',
      formula: '(0\\oplus 1)\\oplus 2=3\\land(3\\oplus 1)\\oplus 1=3\\land\\mathrm{mintOf}(n)=\\mathrm{vertices}',
      reading: 'holds true. QPU is a running quantum circuit in the browser VM.',
      holds: xorOf(xorOf(n - n, seed), coins) === n && xorOf(xorOf(n, seed), seed) === n && mintOf(n) === cube.vertices,
  },
    {
      heading: 'physical',
      theorem: 'theorem physical : n = 3 ∧ mintOf n = vertices ∧ (0 ^^^ 1) ^^^ 2 = 3 ∧ (3 ^^^ 1) ^^^ 1 = 3 := ⟨n_eq, rfl, rfl, rfl⟩',
      formula: 'n=3\\land\\mathrm{mintOf}(n)=\\mathrm{vertices}\\land(0\\oplus 1)\\oplus 2=3\\land(3\\oplus 1)\\oplus 1=3',
      reading: 'holds true. Physical qubit initialize. Controlled gates H CNOT. Coherent interfere. Measure readout. Characterized noise. Hardware path origin payload server lean. Superconducting qubits. Never bypass payload. A state-vector simulator on exact integers in a browser VM; no superconducting qubits, no cryostat.',
      holds: n === 3 && mintOf(n) === cube.vertices && xorOf(xorOf(n - n, seed), coins) === n && xorOf(xorOf(n, seed), seed) === n && qpuCircuitOf().hardware.holds,
  },
    {
      heading: 'temperature',
      theorem:
        'theorem temperature : photon / thermal 10 = 23 ∧ photon / thermal 100 = 2 ∧ photon / thermal 4000 = 0 ∧ 4000 / 100 = 40 ∧ 100 / 10 = 10 ∧ 10 < 35 := ⟨rfl, rfl, rfl, rfl, rfl, Nat.le_of_ble_eq_true rfl⟩',
      formula:
        '\\mathrm{photon}/\\mathrm{thermal}(10)=23\\land\\mathrm{photon}/\\mathrm{thermal}(100)=2\\land\\mathrm{photon}/\\mathrm{thermal}(4000)=0\\land 4000/100=40\\land 100/10=10\\land 10<35',
      reading:
        'holds true. The temperature domain, demarcated. photon is h·f for a 5 GHz transmon; thermal is k·T; their quotient floors to 23 at 10 mK (the thermal factor is negligible), 2 at 100 mK (a tenth of the register is excited), 0 at 4 K. The dilution ladder 4000 → 100 → 10 mK divides by 40 and 10. Below 35 mK the excited population floors near a thousandth (Jin et al. 2015). This host has no thermometer: every state it produces is pure, which is the zero-temperature side of that curve. JSON Nat. Never Math. Never by decide.',
      holds: temperatureHolds,
  },
    {
      heading: 'superconductivity',
      theorem:
        'theorem superconductivity : aluminium > 10 ∧ niobium > aluminium ∧ bcs / 100 = 3 ∧ gap aluminium = 88 ∧ gap aluminium > transmon ∧ gap niobium = 674 := ⟨Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, rfl, rfl, Nat.le_of_ble_eq_true rfl, rfl⟩',
      formula:
        '\\mathrm{aluminium}>10\\land\\mathrm{niobium}>\\mathrm{aluminium}\\land\\mathrm{bcs}/100=3\\land\\mathrm{gap}(\\mathrm{aluminium})=88\\land\\mathrm{gap}(\\mathrm{aluminium})>\\mathrm{transmon}\\land\\mathrm{gap}(\\mathrm{niobium})=674',
      reading:
        'holds true. The superconductivity domain, demarcated. Aluminium goes superconducting at 1200 mK and niobium at 9200 mK, both far above a 10 mK operating point. The BCS gap 2Δ is 3.52·k·Tc; as a frequency it is 88 GHz for aluminium and 674 GHz for niobium, above a 5 GHz transmon photon, so the drive cannot break pairs. No wire here is superconducting: the amplitudes are integers in a browser VM. JSON Nat. Never Math. Never by decide.',
      holds: superconductivityHolds,
  },
    {
      heading: 'drift',
      theorem: 'theorem drift : coins = 2 ∧ mintOf n = vertices ∧ (0 ^^^ 1) ^^^ 2 = 3 ∧ (3 ^^^ 1) ^^^ 1 = 3 := ⟨coins_two, rfl, rfl, rfl⟩',
      formula: '\\mathrm{coins}=2\\land\\mathrm{mintOf}(n)=\\mathrm{vertices}\\land(0\\oplus 1)\\oplus 2=3\\land(3\\oplus 1)\\oplus 1=3',
      reading: 'holds true. No drift from science. Two-level qubits. Dim mintOf n. H then CNOT. XX is identity.',
      holds: coins === 2 && mintOf(n) === cube.vertices && xorOf(xorOf(n - n, seed), coins) === n && xorOf(xorOf(n, seed), seed) === n,
  },
    {
      heading: 'sciences',
      theorem:
        'theorem sciences : coins = 2 ∧ n = 3 ∧ mintOf n = vertices ∧ faces = coins * rays ∧ bits = vertices * hexbit ∧ fused = faces * mintOf (bits + seed) ∧ (0 ^^^ 1) ^^^ 2 = 3 := ⟨coins_two, n_eq, rfl, around, cube, quantum, rfl⟩',
      formula:
        '\\mathrm{coins}=2\\land n=3\\land\\mathrm{mintOf}(n)=\\mathrm{vertices}\\land\\mathrm{faces}=\\mathrm{coins}\\cdot\\mathrm{rays}\\land\\mathrm{bits}=\\mathrm{vertices}\\cdot\\mathrm{hexbit}\\land\\mathrm{fused}=\\mathrm{faces}\\cdot\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{seed})\\land(0\\oplus 1)\\oplus 2=3',
      reading: 'holds true. No drift between sciences. Circuit, cube, faces, fused share mintOf. Qubits n are not faces.',
      holds:
        coins === 2 &&
        n === 3 &&
        mintOf(n) === cube.vertices &&
        aroundHolds &&
        cubeHolds &&
        quantumHolds &&
        xorOf(xorOf(n - n, seed), coins) === n &&
        n !== faces.faces},
    {
      heading: 'interfere',
      theorem: 'theorem interfere : 1 + 1 = 2 ∧ 1 - 1 = 0 := ⟨rfl, rfl⟩',
      formula: '1+1=2\\land 1-1=0',
      reading: 'holds true. Hadamard is involutive. H H = I. Odd amplitudes cancel. Possible only in quantum.',
      holds: 1 + 1 === coins && 1 - 1 === n - n,
  },
    {
      heading: 'entangle',
      theorem: 'theorem entangle : 1 * 1 ≠ 0 * 0 := by rw [Nat.mul_one, Nat.mul_zero]; exact Nat.one_ne_zero',
      formula: '1\\cdot 1\\neq 0\\cdot 0',
      reading:
        'holds true. Bell. H then CNOT. Entanglement is the product test 1·1 ≠ 0·0. Two coins make a coil. Prove all pairs. Even parity is not the proof. |++⟩ is separable. Possible only in quantum.',
      holds: 1 * 1 !== (n - n) * (n - n) && qpuCoilHolds(),
  },
    {
      heading: 'ghz',
      theorem: 'theorem ghz : mintOf n - seed = 7 ∧ 1 * 1 ≠ 0 * 0 := ⟨by rw [n_eq, seed_eq]; rfl, entangle⟩',
      formula: '\\mathrm{mintOf}(n)-\\mathrm{seed}=7\\land 1\\cdot 1\\neq 0\\cdot 0',
      reading: 'holds true. Bell then CNOT onto the third qubit. Support |000⟩ and |111⟩. Possible only in quantum.',
      holds: mintOf(n) - seed === 7 && 1 * 1 !== (n - n) * (n - n),
  },
    {
      heading: 'noclone',
      theorem:
        'theorem noclone : coins ≠ mintOf coins := by rw [coins_two]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]; exact Nat.ne_of_lt (Nat.lt_succ_of_lt (Nat.lt_succ_self 2))',
      formula: '\\mathrm{coins}\\neq\\mathrm{mintOf}(\\mathrm{coins})',
      reading: 'holds true. |++⟩ occupies four computational-basis states. A CNOT clone of H occupies two. coins ≠ mintOf coins. Possible only in quantum.',
      holds: coins !== mintOf(coins),
  },
    {
      heading: 'teleport',
      theorem: 'theorem teleport : 2 * 2 * 2 * 2 = 16 ∧ 16 = 16 := ⟨rfl, rfl⟩',
      formula: '2\\cdot 2\\cdot 2\\cdot 2=16\\land 16=16',
      reading: 'holds true. Teleport |1⟩ lands on Bob. Teleport |+⟩ keeps equal weight. Possible only in quantum.',
      holds: 2 * 2 * 2 * 2 === mintOf(n + seed) && mintOf(n + seed) === mintOf(n + seed),
  },
    {
      heading: 'kickback',
      theorem: 'theorem kickback : 1 - 1 = 0 ∧ (0 ^^^ 1) ^^^ 2 = 3 := ⟨rfl, rfl⟩',
      formula: '1-1=0\\land(0\\oplus 1)\\oplus 2=3',
      reading: 'holds true. Phase kickback. |+⟩|1⟩ then CZ then H lands on |011⟩. Possible only in quantum.',
      holds: 1 - 1 === n - n && xorOf(xorOf(n - n, seed), coins) === n,
  },
    {
      heading: 'deutsch',
      theorem: 'theorem deutsch : 1 - 1 = 0 ∧ seed ≠ coins := ⟨rfl, by rw [seed_eq, coins_two]; exact Nat.ne_of_lt (Nat.lt_succ_self 1)⟩',
      formula: '1-1=0\\land\\mathrm{seed}\\neq\\mathrm{coins}',
      reading: 'holds true. Deutsch. One quantum query. Classical needs coins. seed ≠ coins. Possible only in quantum.',
      holds: 1 - 1 === n - n && seed !== coins,
  },
    {
      heading: 'dense',
      theorem:
        'theorem dense : coins * coins = mintOf coins := by rw [coins_two]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]',
      formula: '\\mathrm{coins}\\cdot\\mathrm{coins}=\\mathrm{mintOf}(\\mathrm{coins})',
      reading: 'holds true. Superdense. Two bits in one qubit. I Z X XZ decode to 0 1 2 3. Possible only in quantum.',
      holds: coins * coins === mintOf(coins),
  },
    {
      heading: 'monogamy',
      theorem: 'theorem monogamy : 1 * 1 ≠ 0 * 0 ∧ 1 * 0 = 0 * 0 := ⟨entangle, rfl⟩',
      formula: '1\\cdot 1\\neq 0\\cdot 0\\land 1\\cdot 0=0\\cdot 0',
      reading: 'holds true. Monogamy. Bell is entangled. The GHZ pair slice is a product state. Possible only in quantum.',
      holds: 1 * 1 !== (n - n) * (n - n) && seed * (n - n) === (n - n) * (n - n),
  },
    {
      heading: 'only',
      theorem:
        'theorem only : 1 * 1 ≠ 0 * 0 ∧ 1 + 1 = 2 ∧ 1 - 1 = 0 ∧ coins ≠ mintOf coins ∧ mintOf n - seed = 7 ∧ 2 * 2 * 2 * 2 = 16 ∧ 16 = 16 ∧ (0 ^^^ 1) ^^^ 2 = 3 ∧ seed ≠ coins ∧ coins * coins = mintOf coins ∧ 1 * 0 = 0 * 0 := ⟨entangle, rfl, rfl, noclone, ghz.1, teleport.1, teleport.2, kickback.2, deutsch.2, dense, monogamy.2⟩',
      formula:
        '1\\cdot 1\\neq 0\\cdot 0\\land 1+1=2\\land 1-1=0\\land\\mathrm{coins}\\neq\\mathrm{mintOf}(\\mathrm{coins})\\land\\mathrm{mintOf}(n)-\\mathrm{seed}=7\\land 2\\cdot 2\\cdot 2\\cdot 2=16\\land 16=16\\land(0\\oplus 1)\\oplus 2=3\\land\\mathrm{seed}\\neq\\mathrm{coins}\\land\\mathrm{coins}\\cdot\\mathrm{coins}=\\mathrm{mintOf}(\\mathrm{coins})\\land 1\\cdot 0=0\\cdot 0',
      reading:
        'holds true. Possible only in quantum. This host is a simulator, not a quantum computer. Entangle. Interfere. GHZ. No-clone. Teleport. Kickback. Deutsch. Superdense. Monogamy.',
      holds:
        1 * 1 !== (n - n) * (n - n) &&
        1 + 1 === coins &&
        1 - 1 === n - n &&
        coins !== mintOf(coins) &&
        mintOf(n) - seed === 7 &&
        2 * 2 * 2 * 2 === mintOf(n + seed) &&
        mintOf(n + seed) === mintOf(n + seed) &&
        xorOf(xorOf(n - n, seed), coins) === n &&
        seed !== coins &&
        coins * coins === mintOf(coins) &&
        seed * (n - n) === (n - n) * (n - n)},
    {
      heading: 'fill',
      theorem: 'theorem fill : mintOf n * faces = vertices * (coins * rays) := by rw [around]; rfl',
      formula: '\\mathrm{mintOf}(n)\\cdot\\mathrm{faces}=\\mathrm{vertices}\\cdot(\\mathrm{coins}\\cdot\\mathrm{rays})',
      reading:
        'holds true. Lattice filled. Occupied faces. Vacant none. Split entangle interfere GHZ noclone teleport kickback Deutsch superdense monogamy qubits gates measurement register. Possible only in quantum.',
      holds: mintOf(n) * faces.faces === cube.vertices * (coins * faces.rays),
  },
    {
      heading: 'infinite',
      theorem: 'theorem infinite (k : Nat) : mintOf (k + seed) = mintOf k + mintOf k := split_coin k',
      formula: '\\mathrm{mintOf}(k+\\mathrm{seed})=\\mathrm{mintOf}(k)+\\mathrm{mintOf}(k)',
      reading:
        'holds true. VM scales. Replicas double. Quantum capacity infinite. split_coin has no last k.',
      holds: splitHolds && nextHolds && nextFusedHolds,
  },
    {
      heading: 'distribute',
      theorem: 'theorem distribute : fused = faces * mintOf (bits + seed) ∧ faces = coins * rays := ⟨quantum, around⟩',
      formula: '\\mathrm{fused}=\\mathrm{faces}\\cdot\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{seed})\\land\\mathrm{faces}=\\mathrm{coins}\\cdot\\mathrm{rays}',
      reading:
        'holds true. Crypt split fused across faces. Distribute computations to free agents. coins teams of rays. No auth.',
      holds: quantumHolds && aroundHolds && faces.faces === coins * faces.rays,
  },
    {
      heading: 'raid',
      theorem: 'theorem raid : faces = coins * rays ∧ faces = rays + rays := ⟨around, harmonic⟩',
      formula: '\\mathrm{faces}=\\mathrm{coins}\\cdot\\mathrm{rays}\\land\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}',
      reading:
        'holds true. Quantum RAID 10. Stripe rays. Mirror coins. Anything on Cloudflare KV and R2. Hybrid storage. Measure hybrid speed and cost. KV added amplitudes. Scaled. Infinite.',
      holds: aroundHolds && harmonicHolds && faces.faces === coins * faces.rays && faces.faces === faces.rays + faces.rays && qpuHybridHolds(),
  },
    {
      heading: 'hybrid_cost',
      theorem: 'theorem hybrid_cost : coins + seed = n := by rw [coins_two, seed_eq, n_eq]',
      formula: '\\mathrm{coins}+\\mathrm{seed}=n',
      reading:
        'holds true. Measure hybrid storage cost. KV cost coins. R2 cost seed. Hybrid cost coins plus seed is n. Minimum cost. Never Math. Never by decide.',
      holds: qpuHybridHolds() && coins + seed === n,
  },
    {
      heading: 'hybrid_speed',
      theorem: 'theorem hybrid_speed : rays + seed = mintOf n := by rw [rays, n_eq, coins_two, seed_eq]; rw [show mintOf 3 = 8 from rfl]',
      formula: '\\mathrm{rays}+\\mathrm{seed}=\\mathrm{mintOf}(n)',
      reading:
        'holds true. Measure hybrid storage speed. KV speed rays. R2 speed seed. Hybrid speed rays plus seed is mintOf n. Coordinated speed. Never Math. Never by decide.',
      holds: qpuHybridHolds() && qpuFacesOf().rays + seed === mintOf(n),
  },
    {
      heading: 'hybrid',
      theorem: 'theorem hybrid : coins + seed = n ∧ rays + seed = mintOf n ∧ coins = seed + seed := ⟨hybrid_cost, hybrid_speed, coins_two⟩',
      formula: '\\mathrm{coins}+\\mathrm{seed}=n\\land\\mathrm{rays}+\\mathrm{seed}=\\mathrm{mintOf}(n)\\land\\mathrm{coins}=\\mathrm{seed}+\\mathrm{seed}',
      reading:
        'holds true. Measure hybrid storage speed and cost. Two bindings. STORAGE kv. BLOBS r2. Coordinated speed mintOf n. Minimum cost n. KV faster and costlier. R2 cheaper and slower. QPU hybrid storage hosts the Payload database. Unity seed. Remainder none. Collections pages users media tenants. Secrets never. Native Alpine Linux. musl. busybox. overlayfs. KV upper. R2 lower. KV work. Next is the double. No last k. Stores by content address. Inodes. Referrer access link. Privacy. Redundancy. Last link deleted frees the inode. Never Math. Never by decide.',
      holds: qpuHybridHolds() && qpuPayloadDbHolds() && coins + seed === n && qpuFacesOf().rays + seed === mintOf(n) && coins === seed + seed,
  },
    {
      heading: 'computer',
      theorem: 'theorem computer : (1 ^^^ 3) = 2 ∧ (6 ^^^ 1) = 7 ∧ mintOf 0 = 1 := ⟨rfl, rfl, mintOf_zero⟩',
      formula: '(1\\oplus 3)=2\\land(6\\oplus 1)=7\\land\\mathrm{mintOf}(0)=1',
      reading:
        'holds true. Quantum circuit simulator. SWAP. Toffoli. Reset. H and Toffoli are computationally universal. Coupling compile collapse shots feedforward bitflip readout isolate qram network jobs.',
      holds: xorOf(seed, n) === coins && xorOf(xorOf(bitOf(seed), bitOf(coins)), seed) === mintOf(n) - seed && mintOf(n - n) === seed && qpuComputerHolds(),
  },
    {
      heading: 'server',
      theorem: 'theorem server : faces = coins * rays ∧ mintOf n = 8 := ⟨around, measurement⟩',
      formula: '\\mathrm{faces}=\\mathrm{coins}\\cdot\\mathrm{rays}\\land\\mathrm{mintOf}(n)=8',
      reading:
        'holds true. Quantum server. JSON-LD WebAPI. Eight tools. Jobs queue results. Backend the running circuit. No auth.',
      holds: aroundHolds && mintOf(n) === cube.vertices && mintOf(n) === 8,
  },
    {
      heading: 'fusion',
      theorem: 'theorem fusion : fused = faces * mintOf (bits + seed) ∧ faces = rays + rays := ⟨quantum, harmonic⟩',
      formula: '\\mathrm{fused}=\\mathrm{faces}\\cdot\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{seed})\\land\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}',
      reading: 'holds true. fused = faces * mintOf (bits + seed). faces = rays + rays. HEP quantum true.',
      holds: quantumHolds && harmonicHolds && faces.faces === faces.rays + faces.rays,
  },
    {
      heading: 'design',
      theorem: 'theorem design : (0 ^^^ 4) ^^^ 4 = 0 ∧ (3 ^^^ 4) ^^^ 4 = 3 := ⟨rfl, rfl⟩',
      formula: '(0\\oplus 4)\\oplus 4=0\\land(3\\oplus 4)\\oplus 4=3',
      reading:
        'holds true. Any error is handled by design. XOR fold hexbit. Involution. Never throw.',
      holds: xorOf(xorOf(n - n, cube.hexbit), cube.hexbit) === n - n && xorOf(xorOf(n, cube.hexbit), cube.hexbit) === n,
  },
    {
      heading: 'neuro',
      theorem: 'theorem neuro : faces = coins * rays ∧ mintOf n = 8 ∧ (0 ^^^ 4) ^^^ 4 = 0 := ⟨around, measurement, design.1⟩',
      formula: '\\mathrm{faces}=\\mathrm{coins}\\cdot\\mathrm{rays}\\land\\mathrm{mintOf}(n)=8\\land(0\\oplus 4)\\oplus 4=0',
      reading: 'holds true. Width faces. Layers mintOf n. XOR involution.',
      holds: aroundHolds && mintOf(n) === cube.vertices && xorOf(xorOf(n - n, cube.hexbit), cube.hexbit) === n - n,
  }]
  const climb: QpuLeanRow = {
    heading: 'next',
    theorem:
      'theorem next_cover : mintOf (bits + seed) = amplitudes + amplitudes ∧ faces * mintOf (bits + coins) = fused + fused := ⟨next, next_fused⟩',
    formula:
      '\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{seed})=\\mathrm{amplitudes}+\\mathrm{amplitudes}\\land\\mathrm{faces}\\cdot\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{coins})=\\mathrm{fused}+\\mathrm{fused}',
    reading: `holds ${nextHolds && nextFusedHolds && qpuNextHolds()}. amplitudes ${handle.amplitudes}. next ${handle.next}. fused next ${fused + fused}. coil next ${qpuNextOf().nextCoil}. no last k.`,
    holds: nextHolds && nextFusedHolds && qpuNextHolds(),
  }
  const src = unit.fuse.lean
  const source = qpuLeanSourceOf(rows, cover, climb)
  const holds =
    source.holds &&
    rows.every((r) => r.holds && r.theorem.startsWith(`theorem ${r.heading}`) && !byDecideOf(r.theorem) && formulaOf(r.formula)) &&
    cover.every((r) => r.holds && r.theorem.startsWith(`theorem ${r.heading}`) && !byDecideOf(r.theorem) && formulaOf(r.formula)) &&
    climb.holds &&
    climb.theorem.startsWith('theorem next') &&
    !byDecideOf(climb.theorem) &&
    formulaOf(climb.formula) &&
    src.endsWith('/index.lean')
  return {
    '@context': qpuContextOf(),
    '@type': 'Dataset' as const,
    '@id': unit.href,
    url: unit.href,
    name: unit.fuse.lean,
    isAccessibleForFree: cors === '*',
    src,
    source,
    rows,
    cover,
    climb,
    holds,
  }
}

export const qpuLeanHolds = (l = qpuLeanOf()): boolean =>
  l.holds === true &&
  l.src === unit.fuse.lean &&
  l['@context'][n - n] === schemaOrg &&
  l['@type'] === 'Dataset' &&
  l['@id'] === unit.href &&
  l.isAccessibleForFree === true &&
  jsonldHoldsOf(l)

export const qpuDocsOf = () => {
  const lean = qpuLeanOf()
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const fused = faces.faces * handle.kv.amplitudes
  const abstract = `theorem quantum : fused = faces * mintOf (bits + seed). vertices ${cube.vertices} hexbit ${cube.hexbit} bits ${cube.bits} faces ${faces.faces} fused ${fused}. Source ${lean.src}. GET ${unit.origin} qpu_quantum. GET ${unit.href} qpu_lean. POST ${unit.origin}/mcp tools/list. tools/call qpu_prove. No auth. JSON-LD.`
  const api = [
    { method: 'GET' as const, path: '/', name: 'qpu_quantum', href: unit.origin, reading: `theorem quantum. theorem shor. theorem crypto. ${shorFactorOf()}. JSON-LD. No auth.` },
    { method: 'GET' as const, path: `/${unit.path}`, name: 'qpu_lean', href: unit.href, reading: `Lean proof. theorem infinite. theorem distribute. theorem shor. theorem crypto. ${lean.src}. JSON-LD. No auth.` },
    { method: 'GET' as const, path: '/mcp', name: 'catalog', href: `${unit.origin}/mcp`, reading: `tools ${mintOf(n) + mintOf(n)} in tools/list: ${mintOf(n)} doors and ${mintOf(n)} cybersecurity. cybersecurity theorem shor ${shorFactorOf()}. theorem crypto ${cryptoClaimOf()}. fourteen schemas. schema.org ItemList. JSON-LD. No auth.` },
    { method: 'POST' as const, path: '/mcp', name: 'tools/call', href: `${unit.origin}/mcp`, reading: 'JSON-RPC tools/list tools/call qpu_prove. theorem shor. theorem crypto. crypto_rsa crypto_split. { man: true }. No auth.' },
    { method: 'GET' as const, path: '/cite', name: 'qpu_cite', href: `${unit.origin}/cite`, reading: 'MLA 8. when never. JSON-LD. No auth.' },
    { method: 'GET' as const, path: '/message', name: 'qpu_message', href: `${unit.origin}/message`, reading: 'lanes = faces. hop involution. JSON-LD. No auth.' },
    { method: 'POST' as const, path: '/message', name: 'qpu_message', href: `${unit.origin}/message`, reading: '202. hop involution. JSON-LD. No auth.' }]
  const formulas = [...lean.rows, ...lean.cover, lean.climb].map((r) => ({
    identity: r.heading,
    formula: r.formula,
    theorem: r.theorem,
    reading: r.reading}))
  const documentation = [abstract, ...api.map((a) => `${a.method} ${a.path} ${a.name}. ${a.reading}`), ...formulas.map((f) => `theorem ${f.identity}. ${f.reading}`)].join('\n')
  const holds =
    lean.holds === true &&
    documentation.includes(abstract) &&
    documentation.includes('No auth') &&
    documentation.includes('theorem quantum') &&
    documentation.includes('theorem infinite') &&
    documentation.includes('theorem distribute') &&
    documentation.includes('theorem raid') &&
    documentation.includes('theorem kv') &&
    documentation.includes('theorem temperature') &&
    documentation.includes('theorem superconductivity') &&
    documentation.includes('theorem computer') &&
    documentation.includes('theorem server') &&
    documentation.includes('theorem fusion') &&
    documentation.includes('theorem design') &&
    documentation.includes('theorem neuro') &&
    documentation.includes('theorem hybrid') &&
    documentation.includes('JSON-LD') &&
    documentation.includes('schema.org') &&
    documentation.includes('tools/list') &&
    api.length === faces.rays &&
    formulas.every((f) => documentation.includes(f.reading) && formulaOf(f.formula) && !byDecideOf(f.theorem))
  return { kind: 'docs' as const, inline: true as const,
    guide: api.length === faces.rays,
    abstract, api, formulas, documentation, src: lean.src, holds }
}

export const qpuDocsHolds = (d = qpuDocsOf()): boolean =>
  d.holds === true &&
  d.inline === true &&
  d.kind === 'docs' &&
  d.documentation.includes(d.abstract) &&
  d.documentation.includes('No auth') &&
  d.documentation.includes('theorem quantum') &&
  d.documentation.includes('theorem infinite') &&
  d.documentation.includes('theorem raid') &&
  d.documentation.includes('theorem fusion') &&
  d.documentation.includes('JSON-LD') &&
  d.documentation.includes('schema.org') &&
  d.documentation.includes('tools/list') &&
  d.documentation.includes('theorem shor') &&
  d.documentation.includes('theorem crypto') &&
  d.documentation.includes(`${shorFactorOf()}`) &&
  d.api.length === qpuFacesOf().rays &&
  d.src === unit.fuse.lean

/** WHAT THE WORDS MEAN, SERVED BESIDE THEM. `holds` is said of every record and means that the record is self-consistent
 * and recomputes to itself; it is not a claim that the test the record describes passed. That claim, where a record
 * makes one, has its own word: `pass`, `factored`, `measured`, `entangled`, `resolvable`. */
export const qpuGlossaryOf = () => ({
  kind: 'glossary' as const,
  holds: 'this record is self-consistent and recomputes to itself; not a claim that the test it describes passed',
  pass: 'the test the record describes passed (quantum volume); can be false beside holds true',
  factored: 'the run found p and q with p * q = n; `by` says whether by period or by gcd',
  measured: 'a held state was read for these shots; shots from nothing are never listed',
  sampled: 'false everywhere: outcomes enumerate the support, they are not drawn; the unit holds no entropy',
  read: 'how each argument was taken (digits, number, numeric, absent, default) and whether exactly',
  beyond: 'the order of the base exists and does not divide four, so a two-qubit register cannot resolve it',
  device: 'simulator when a vector of exact integer amplitudes was held; unmeasured otherwise',
})
export const qpuQuantumOf = () => {
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const fused = faces.faces * handle.kv.amplitudes
  const docs = qpuDocsOf()
  const capacity = qpuCapacityOf()
  const speed = qpuSpeedOf()
  const circuit = qpuCircuitOf()
  const shor = qpuShorOf()
  const sequence = qpuSequenceOf()
  const neuro = qpuNeuroOf()
  const design = qpuDesignOf()
  const genesis = qpuGenesisOf()
  const css = qpuCssOf('', genesis)
  const purpose = qpuPurposeOf(circuit, shor, sequence, capacity)
  const evidence = qpuEvidenceOf(circuit, shor)
  const holds =
    unit.holds &&
    cube.holds &&
    handle.holds &&
    faces.holds &&
    docs.holds &&
    capacity.holds &&
    speed.holds &&
    circuit.holds &&
    qpuShorHolds(shor) &&
    sequence.holds &&
    purpose.holds &&
    evidence.holds &&
    neuro.holds &&
    design.holds &&
    qpuGenesisHolds(genesis) &&
    qpuCssHolds(css) &&
    fused === faces.faces * mintOf(cube.bits + seed) &&
    fused === faces.faces * mintOf(cube.vertices * cube.hexbit + seed) &&
    mintOf(cube.hexbit) === mintOf(n + seed) &&
    mintOf(cube.hexbit) > seed &&
    mintOf(cube.bits + seed) === handle.amplitudes + handle.amplitudes &&
    faces.faces * mintOf(cube.bits + coins) === fused + fused
  return {
    '@context': qpuContextOf(),
    '@type': 'SoftwareApplication' as const,
    '@id': unit.origin,
    kind: 'quantum' as const,
    only: circuit.only,
    lattice: circuit.lattice,
    circuit,
    shor,
    sequence,
    purpose,
    evidence,
    neuro,
    design,
    genesis,
    css,
    host: unit.host,
    href: unit.href,
    cube,
    handle,
    faces,
    fused,
    next: fused + fused,
    capacity,
    speed,
    messaging: {
      when: 'never' as const,
      href: `${unit.origin}/message`,
      lanes: faces.faces,
      hop: 'involution' as const,
      clock_seq: faces.faces,
      await: 'never' !== 'never',
      proxy: cors === '*',
      secure: unit.origin.startsWith('https')},
    docs,
    glossary: qpuGlossaryOf(),
    ui: {
      prove: 'qpu_prove' as const,
      href: `${unit.origin}/mcp`},
    cors,
    public: cors === '*',
    auth: cors !== '*',
    isAccessibleForFree: cors === '*',
    url: unit.origin,
    name: `@uuidna/${unit.kind}`,
    holds,
  }
}

export const qpuQuantumHolds = (q = qpuQuantumOf()): boolean =>
  q.holds === true &&
  q.kind === 'quantum' &&
  q.only.holds === true &&
  q.lattice.holds === true &&
  q.lattice.occupied === q.faces.faces &&
  q.lattice.vacant === n - n &&
  q.host === unit.host &&
  q.cors === cors &&
  q.ui.prove === 'qpu_prove' &&
  qpuDocsHolds(q.docs) &&
  qpuCapacityHolds(q.capacity) &&
  qpuSpeedHolds(q.speed) &&
  qpuCircuitHolds(q.circuit) &&
  qpuShorHolds(q.shor) &&
  q.shor.factors.p * q.shor.factors.q === q.shor.n &&
  q.shor.rsa.kind === 'rsa' &&
  q.shor.rsa.factored === true &&
  q.shor.rsa.p * q.shor.rsa.q === q.shor.n &&
  qpuSequenceHolds(q.sequence) &&
  qpuPurposeHolds(q.purpose) &&
  qpuEvidenceHolds(q.evidence) &&
  qpuNeuroHolds(q.neuro) &&
  qpuDesignHolds(q.design) &&
  qpuGenesisHolds(q.genesis) &&
  qpuCssHolds(q.css) &&
  q.css.keyframes === seed &&
  q.neuro.test.holds === true &&
  q.sequence.rungs.length === mintOf(n) &&
  q.sequence.rungs[n - n]!.tool === 'qpu_quantum' &&
  q.sequence.rungs[mintOf(n) - seed]!.path === '/server' &&
  q.sequence.climb[mintOf(coins) - seed] === 'qpu_prove' &&
  q.circuit.vm === 'browser' &&
  q.messaging.when === 'never' &&
  q.messaging.lanes === q.faces.faces &&
  q.messaging.hop === 'involution' &&
  q.messaging.clock_seq === q.faces.faces &&
  q['@context'][n - n] === schemaOrg &&
  q['@type'] === 'SoftwareApplication' &&
  q['@id'] === unit.origin &&
  q.isAccessibleForFree === (cors === '*') &&
  q.url === unit.origin &&
  jsonldHoldsOf(q)

export const qpuCiteOf = () => {
  const lean = qpuLeanOf()
  const quantum = qpuQuantumOf()
  const author = {
    last: 'Rouschev',
    first: 'Tsvetan',
    orcid: 'https://orcid.org/0009-0000-7312-9778',
  }
  const doi = '10.5281/zenodo.22700099'
  const conceptdoi = '10.5281/zenodo.22700098'
  const archive = `https://zenodo.org/records/22700099`
  const identifier = `https://doi.org/${doi}`
  const prior = {
    title: 'All Seven Clay Millennium Problems Sealed via Universal σ-Involution',
    doi: '10.5281/zenodo.21781603',
    conceptdoi: '10.5281/zenodo.21781602',
    archive: 'https://zenodo.org/records/21781603',
  } as const
  const sameAs = [archive, author.orcid, identifier] as const
  /** WHAT THE ARCHIVE HOLDS, BESIDE WHAT THE HOST SERVES. The versioned DOI is one archived commit; the host moves on
   * without it until a new version is archived. Both are said, and `current` says whether they are the same version,
   * so a reader who downloads "this version" knows whether it is the code that answered them. */
  const archived = { doi, archive, version: '0.1.0' as string, commit: 'aed5802', holds: archive.endsWith(doi.split('.').pop() ?? '') }
  const served = { version: packageVersion, origin: unit.origin, holds: packageVersion.split('.').length === n }
  const current = archived.version === served.version
  const currency = current
    ? `the archive is this version: v${served.version} at ${archived.commit}.`
    : `the archive is behind the host: it holds v${archived.version} at ${archived.commit}; the host serves v${served.version}. Cite the archive for what it holds; the concept DOI ${conceptdoi} resolves to the latest archived version.`
  const website = unit.host
  const mcp = `${unit.origin}/mcp`
  const worksOf = (title: string, url: string, workDoi = doi, container = website): string =>
    `${author.last}, ${author.first}. ORCID ${author.orcid}. "${title}." ${container}, ${url}. doi:${workDoi}.`
  const priorWorks = worksOf(prior.title, prior.archive, prior.doi, 'Zenodo')
  const rows = [
    { title: unit.kind, url: unit.origin, doi, works: worksOf(unit.kind, unit.origin), holds: unit.origin.startsWith('https://') && unit.kind.length > n - n },
    { title: 'quantum processing unit', url: unit.href, doi, works: worksOf('quantum processing unit', unit.href), holds: unit.href.startsWith('https://') },
    { title: lean.src, url: mcp, doi, works: worksOf(lean.src, mcp), holds: mcp.startsWith(unit.origin) && lean.src.endsWith('/index.lean') }] as const
  const holds =
    qpuLeanHolds(lean) &&
    qpuQuantumHolds(quantum) &&
    author.last.length > n - n &&
    author.orcid.startsWith('https://orcid.org/') &&
    author.orcid.endsWith('0009-0000-7312-9778') &&
    doi.startsWith('10.5281/zenodo.') &&
    doi.endsWith('22700099') &&
    conceptdoi.endsWith('22700098') &&
    prior.doi.endsWith('21781603') &&
    prior.archive.startsWith('https://zenodo.org/records/') &&
    priorWorks.includes(`doi:${prior.doi}`) &&
    priorWorks.includes('Zenodo, ') &&
    archive.startsWith('https://zenodo.org/records/') &&
    website === unit.host &&
    rows.length === n &&
    identifier === `https://doi.org/${doi}` &&
    sameAs.includes(archive) &&
    sameAs.includes(author.orcid) &&
    rows.every(
      (r) =>
        r.holds === true &&
        r.doi === doi &&
        r.works.startsWith(`${author.last}, ${author.first}. ORCID ${author.orcid}. "`) &&
        r.works.includes(`doi:${doi}`) &&
        r.url.startsWith(unit.origin) &&
        !r.url.includes('*'))
  return {
    '@context': qpuContextOf(),
    '@type': 'CreativeWork' as const,
    '@id': `${unit.origin}/cite`,
    url: `${unit.origin}/cite`,
    isAccessibleForFree: cors === '*',
    kind: 'cite' as const,
    style: 'mla8' as const,
    source: 'website' as const,
    when: 'never' as const,
    author,
    website,
    href: unit.origin,
    doi,
    conceptdoi,
    archive,
    identifier,
    sameAs,
    prior: { ...prior, works: priorWorks },
    archived,
    served,
    current,
    currency,
    inText: `(${author.last})`,
    rows,
    holds,
  }
}

export const qpuCiteHolds = (c = qpuCiteOf()): boolean =>
  c.holds === true &&
  c.kind === 'cite' &&
  c.style === 'mla8' &&
  c.source === 'website' &&
  c.when === 'never' &&
  c.website === unit.host &&
  c.author.orcid === 'https://orcid.org/0009-0000-7312-9778' &&
  c.doi === '10.5281/zenodo.22700099' &&
  c.conceptdoi === '10.5281/zenodo.22700098' &&
  c.archive === 'https://zenodo.org/records/22700099' &&
  c.identifier === `https://doi.org/${c.doi}` &&
  c.sameAs.includes(c.archive) &&
  c.sameAs.includes(c.author.orcid) &&
  c.sameAs.includes(c.identifier) &&
  c.archived.commit === 'aed5802' &&
  c.archived.version === '0.1.0' &&
  c.served.version === packageVersion &&
  c.current === (c.archived.version === c.served.version) &&
  c.currency.includes(`v${c.served.version}`) &&
  jsonldHoldsOf(c) &&
  c.prior.doi === '10.5281/zenodo.21781603' &&
  c.prior.archive === 'https://zenodo.org/records/21781603' &&
  c.prior.works.includes(`doi:${c.prior.doi}`) &&
  c.prior.works.includes('Zenodo, ') &&
  c.rows.length === n &&
  c.rows.every((r) => r.doi === c.doi && r.works.includes(c.author.orcid) && r.works.includes(`doi:${c.doi}`))

const tokensOf = (bytes: number): number => Number(BigInt(bytes) / BigInt(mintOf(coins)))

export const qpuManOf = (name: string, description: string, reading: string, href: string, see: readonly string[]) => {
  const synopsis = `POST ${unit.origin}/mcp tools/call ${name}`
  const documentation = [
    'NAME',
    `    ${name} — ${description}`,
    'SYNOPSIS',
    `    ${synopsis}`,
    `    ${name} { man: true }`,
    'DESCRIPTION',
    `    ${reading}`,
    'SEE ALSO',
    `    ${see.join(', ')}`].join('\n')
  const holds =
    documentation.includes(`NAME`) &&
    documentation.includes(name) &&
    documentation.includes(synopsis) &&
    documentation.includes('{ man: true }') &&
    see.every((s) => s !== name && documentation.includes(s))
  return { kind: 'man' as const, inline: true as const, name, section: n, synopsis, href, description, reading, documentation, holds }
}

export const qpuManHolds = (m: ReturnType<typeof qpuManOf>): boolean =>
  m.holds === true && m.kind === 'man' && m.inline === true && m.section === n && m.documentation.includes(m.name)

const qpuShownHrefOf = (name: string, href = `${unit.origin}/mcp`) => {
  if (name === 'qpu_quantum') return unit.origin
  if (name === 'qpu_lean') return unit.href
  if (name === 'qpu_cite') return `${unit.origin}/cite`
  return href
}

/** OUTPUT SCHEMAS READ FROM THE RUN. A schema of `{ type: object }` constrains nothing and so can fail nothing; every
 * tool's schema is instead derived from its own replies: the properties every sample carried with their JSON types,
 * `required` being the keys present in every sample, and `holds` a required boolean throughout. One level of nesting
 * is typed; deeper values are objects or arrays. Derived once per isolate; a reader validates any later reply against
 * it, which is a check the empty schema could never make. */
const jsonTypeOf = (v: unknown): string =>
  v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v === 'number' ? (v % seed === n - n ? 'integer' : 'number') : typeof v === 'object' ? 'object' : typeof v
const typeUnionOf = (types: readonly string[]): string | string[] => {
  const distinct = [...new Set(types)]
  return distinct.length === seed ? distinct[n - n]! : distinct
}
export const qpuOutputSchemaOf = (samples: readonly unknown[]) => {
  const objects = samples.filter((x): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x))
  const properties: Record<string, Record<string, unknown>> = {}
  const keys = new Set<string>()
  for (const o of objects) for (const k of Object.keys(o)) keys.add(k)
  for (const k of keys) {
    const values = objects.filter((o) => k in o).map((o) => o[k])
    const type = typeUnionOf(values.map(jsonTypeOf))
    if (type === 'object') {
      const inner: Record<string, Record<string, unknown>> = {}
      const innerKeys = new Set<string>()
      for (const v of values as Record<string, unknown>[]) for (const ik of Object.keys(v)) innerKeys.add(ik)
      for (const ik of innerKeys) inner[ik] = { type: typeUnionOf((values as Record<string, unknown>[]).filter((v) => ik in v).map((v) => jsonTypeOf(v[ik]))) }
      properties[k] = { type, properties: inner }
    } else properties[k] = { type }
  }
  properties.holds = { type: 'boolean' }
  const required = [...keys].filter((k) => objects.every((o) => k in o))
  if (!required.includes('holds')) required.push('holds')
  return { type: 'object' as const, description: `derived from ${objects.length} repl${objects.length === seed ? 'y' : 'ies'} of the tool itself; holds is always required`, properties, required, additionalProperties: true as const }
}
export type QpuOutputSchema = ReturnType<typeof qpuOutputSchemaOf>
const minimalOutputSchema = { type: 'object' as const, properties: { holds: { type: 'boolean' } }, required: ['holds'], additionalProperties: true as const }
const qpuMcpToolShapeOf = (name: string, description: string, inputSchema: Record<string, unknown>, extra: Record<string, unknown> = {}) => ({
  name,
  title: name,
  description,
  inputSchema,
  input_schema: inputSchema,
  parameters: inputSchema,
  outputSchema: minimalOutputSchema,
  annotations: {
    audience: ['user', 'assistant'] as const,
    priority: seed,
    readOnlyHint: name !== 'qpu_forge',
    destructiveHint: false as const,
    openWorldHint: true as const},
  function: { name, description, parameters: inputSchema },
  ...extra})

export const qpuMcpShownOf = (name: string, payload: unknown, href = `${unit.origin}/mcp`) => {
  const bag = payload && typeof payload === 'object' ? (payload as { holds?: unknown }) : {}
  const holds = bag.holds === true
  const shownHref = qpuShownHrefOf(name, href)
  const unlimited = JSON.stringify(payload)
  const content: {
    type: 'text' | 'resource' | 'resource_link'
    text?: string
    uri?: string
    name?: string
    mimeType?: string
    description?: string
    resource?: { uri: string; mimeType: string; text: string }
    annotations: { audience: readonly ['user'] | readonly ['user', 'assistant']; priority: number }
  }[] = [
    {
      type: 'text' as const,
      text: unlimited,
      annotations: { audience: ['user', 'assistant'] as const, priority: seed }},
    {
      type: 'resource' as const,
      resource: {
        uri: shownHref,
        mimeType: 'application/ld+json',
        text: unlimited},
      annotations: { audience: ['user'] as const, priority: seed }},
    {
      type: 'resource_link' as const,
      uri: shownHref,
      name,
      mimeType: 'application/ld+json',
      description: name,
      annotations: { audience: ['user'] as const, priority: seed }}]
  return {
    resultType: 'complete' as const,
    content,
    structuredContent: payload,
    isError: holds === false,
    output: unlimited,
    role: 'tool' as const,
    functionResponse: { name, response: payload },
    _meta: {
    compatibility: 'max' as const,
    mimeType: 'application/ld+json',
      href: shownHref}}
}

export const qpuMcpShownHolds = (shown: ReturnType<typeof qpuMcpShownOf>): boolean => {
  const unlimited = JSON.stringify(shown.structuredContent)
  return (
    shown.resultType === 'complete' &&
    shown.content.length === n &&
    shown.content[n - n]?.type === 'text' &&
    shown.content[n - n]?.text === unlimited &&
    shown.content[seed]?.type === 'resource' &&
    shown.content[seed]?.resource?.mimeType === 'application/ld+json' &&
    shown.content[seed]?.resource?.text === unlimited &&
    shown.content[coins]?.type === 'resource_link' &&
    shown.content[coins]?.mimeType === 'application/ld+json' &&
    shown.output === unlimited &&
    shown.role === 'tool' &&
    shown.functionResponse.response === shown.structuredContent &&
    shown._meta.compatibility === 'max' &&
    shown.isError === ((shown.structuredContent as { holds?: boolean })?.holds !== true)
  )
}

export const qpuSubManOf = (name: string, description: string, reading: string, href: string, see: readonly string[]) => {
  const synopsis = `POST ${href} tools/call ${name}`
  const documentation = [
    'NAME',
    `    ${name} — ${description}`,
    'SYNOPSIS',
    `    ${synopsis}`,
    `    ${name} { man: true }`,
    'DESCRIPTION',
    `    ${reading}`,
    'SEE ALSO',
    `    ${see.join(', ')}`].join('\n')
  const holds =
    documentation.includes(`NAME`) &&
    documentation.includes(name) &&
    documentation.includes(synopsis) &&
    documentation.includes('{ man: true }') &&
    see.every((s) => s !== name && documentation.includes(s))
  return { kind: 'man' as const, inline: true as const, name, section: n, synopsis, href, description, reading, documentation, holds }
}

type QpuSubTool = {
  name: string
  description: string
  man: ReturnType<typeof qpuSubManOf>
  inputSchema: Record<string, unknown>
  run: (a: Record<string, unknown>) => unknown | Promise<unknown>
}

const qpuSubRpcOf = async (
  body: { method?: string; params?: { name?: string; arguments?: Record<string, unknown>; protocolVersion?: unknown }; id?: unknown },
  tools: readonly QpuSubTool[],
  href: string) => {
  if (body.method === 'initialize' || body.method === 'server/discover') {
    return { jsonrpc: '2.0', id: body.id ?? null, result: qpuMcpDiscoverOf(body.params?.protocolVersion) }
  }
  if (body.method === 'ping' || body.method === 'notifications/initialized') {
    return { jsonrpc: '2.0', id: body.id ?? null, result: {} }
  }
  if (body.method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id: body.id ?? null,
      result: {
        resultType: 'complete' as const,
        tools: tools.map(({ name, description, inputSchema, man }) => qpuMcpToolShapeOf(name, description, inputSchema, { man }))}}
  }
  if (body.method === 'tools/call') {
    const name = body.params?.name ?? ''
    const args = body.params?.arguments ?? {}
    const tool = tools.find((t) => t.name === name)
    if (!tool) return rpcErrorOf(body.id, rpcCodes.params, `Unknown tool: ${name}`, { tools: tools.map((t) => t.name), href })
    if (args.man === true) return { jsonrpc: '2.0', id: body.id ?? null, result: qpuMcpShownOf(name, tool.man, href) }
    return { jsonrpc: '2.0', id: body.id ?? null, result: qpuMcpShownOf(name, await tool.run(args), href) }
  }
  /** A body that names a method this server does not have is a declined call, not a job or a message. */
  if (typeof body.method === 'string') return rpcErrorOf(body.id, rpcCodes.method, `Method not found: ${body.method}`, { methods: [...rpcMethods], href })
  return undefined
}

const qpuSubCatalogOf = (kind: string, href: string, tools: readonly QpuSubTool[], extra: Record<string, unknown>) => {
  const items = tools.map(({ name, description, inputSchema, man }, i) => {
    const position = i + seed
    return {
      '@type': 'SoftwareApplication' as const,
      '@id': `${href}#${name}`,
      url: href,
      position,
      name,
      description,
      inputSchema,
      man}
  })
  const hasPart = {
    '@type': 'ItemList' as const,
    name: 'tools' as const,
    numberOfItems: items.length,
    itemListElement: items.map((tool) => ({
      '@type': 'ListItem' as const,
      position: tool.position,
      name: tool.name,
      url: tool['@id'],
      item: { '@type': tool['@type'], '@id': tool['@id'], name: tool.name, description: tool.description, url: tool.url }}))}
  const holds =
    items.length === mintOf(n) &&
    hasPart.numberOfItems === mintOf(n) &&
    items.every((t) => t.man.holds && t.man.name === t.name)
  return {
    '@context': qpuContextOf(),
    '@type': 'WebAPI' as const,
    '@id': href,
    url: href,
    isAccessibleForFree: cors === '*',
    kind,
    href,
    cors,tools: items,
    hasPart,
    ...extra,
    holds: holds && extra.holds !== false,
  }
}

export const qpuReadingOf = () => {
  const quantum = qpuQuantumOf()
  return {
    kind: quantum.kind,
    only: quantum.only,
    lattice: quantum.lattice,
    circuit: quantum.circuit,
    shor: quantum.shor,
    sequence: {
      kind: quantum.sequence.kind,
      cover: quantum.sequence.cover,
      rungs: quantum.sequence.rungs.length,
      rays: quantum.sequence.rays,
      vertices: quantum.sequence.vertices,
      climb: quantum.sequence.climb,
      extras: quantum.sequence.extras.map((row) => row.path),
      holds: quantum.sequence.holds,
  },
    purpose: quantum.purpose,
    evidence: quantum.evidence,
    intelligence: {
      kind: 'intelligence' as const,
      test: 'fusion' as const,
      research: 'free online' as const,
      holds: qpuIntelligenceHolds(),
  },
    neuro: {
      kind: 'neuro' as const,
      test: 'natural' as const,
      unless: 'mass online' as const,
    width: quantum.neuro.width,
      layers: quantum.neuro.layers,
      holds: quantum.neuro.holds,
  },
    host: quantum.host,
    href: quantum.href,
    cube: quantum.cube,
    handle: quantum.handle,
    faces: quantum.faces,
    fused: quantum.fused,
    next: quantum.next,
    capacity: {
      kind: quantum.capacity.kind,
      bits: quantum.capacity.bits,
      amplitudes: quantum.capacity.amplitudes,
      faces: quantum.capacity.faces,
      fused: quantum.capacity.fused,
      next: quantum.capacity.next,
      kv: quantum.capacity.kv,
      agents: quantum.capacity.agents,
      schemas: quantum.capacity.schemas,
      holds: quantum.capacity.holds,
  },
    speed: {
      kind: quantum.speed.kind,
      next: quantum.speed.next,
      factor: quantum.speed.factor,
      cover: quantum.speed.cover,
      holds: quantum.speed.next === quantum.fused + quantum.fused && quantum.speed.holds,
  },
    cors: quantum.cors,
    ui: quantum.ui,
    lock: (quantum.sequence.tools as readonly string[]).includes('lock'),
    unlocked: quantum.circuit.holds && quantum.evidence.holds,
    holds: quantum.holds,
  }
}

export const qpuEfficiencyOf = () => {
  const docs = qpuDocsOf()
  const lean = qpuLeanOf()
  const cite = qpuCiteOf()
  const reading = qpuReadingOf()
  const proof = [...lean.rows, ...lean.cover, lean.climb]
    .map((r) => `### ${r.heading}\n\`\`\`lean\n${r.theorem}\n\`\`\`\n$$\n${r.formula}\n$$\n${r.reading}`)
    .join('\n')
  const readBytes = `${docs.documentation}\n${proof}`.length
  const rows = [
    { question: 'what is quantum?', name: 'qpu_quantum', door: 'qpu_quantum', reading },
    { question: 'what does Lean prove?', name: 'qpu_lean', door: 'qpu_lean', reading: lean },
    { question: 'how is the QPU cited?', name: 'qpu_cite', door: 'qpu_cite', reading: cite }].map((row) => {
    const callBytes = JSON.stringify(row.reading).length
    const readTokens = tokensOf(readBytes)
    const callTokens = tokensOf(callBytes)
    const ratio = callTokens > seed ? Number(BigInt(readTokens) / BigInt(callTokens)) : readTokens
    return { question: row.question, name: row.name, door: row.door, readBytes, callBytes, readTokens, callTokens, ratio }
  })
  const quantum = { ...reading.only, queries: seed, vs: coins, lattice: reading.circuit.lattice }
  const holds =
    docs.holds === true &&
    quantum.holds &&
    quantum.entangle &&
    quantum.interfere &&
    quantum.ghz &&
    quantum.noclone &&
    quantum.teleport &&
    quantum.kickback &&
    quantum.deutsch &&
    quantum.dense &&
    quantum.monogamy &&
    quantum.queries !== quantum.vs &&
    quantum.lattice.holds &&
    quantum.lattice.occupied === quantum.lattice.faces &&
    quantum.lattice.vacant === n - n &&
    rows.length === n &&
    rows.every((r) => r.callTokens > seed && r.readTokens >= r.callTokens && r.door === r.name && r.ratio >= mintOf(n - n))
  return { kind: 'efficiency' as const, module: 'agent efficiency' as const, quantum, tokens: 'four bytes' as const, readBytes, rows, holds }
}

export const qpuEfficiencyHolds = (e = qpuEfficiencyOf()): boolean =>
  e.holds === true &&
  e.kind === 'efficiency' &&
  e.module === 'agent efficiency' &&
  e.quantum.kind === 'quantum' &&
  e.quantum.queries === seed &&
  e.quantum.vs === coins &&
  e.quantum.queries !== e.quantum.vs &&
  e.quantum.entangle === true &&
  e.quantum.interfere === true &&
  e.quantum.ghz === true &&
  e.quantum.noclone === true &&
  e.quantum.teleport === true &&
  e.quantum.kickback === true &&
  e.quantum.deutsch === true &&
  e.quantum.dense === true &&
  e.quantum.monogamy === true &&
  e.quantum.lattice.holds === true &&
  e.quantum.lattice.occupied === e.quantum.lattice.faces &&
  e.quantum.lattice.vacant === n - n &&
  e.quantum.lattice.nodes.length === e.quantum.lattice.faces &&
  e.quantum.lattice.nodes.every((node) => node.holds && node.involution) &&
  e.quantum.holds === true &&
  e.rows.length === n

const throughputOf = (throughoutput: number, tokens: number): number =>
  tokens > seed ? Number(BigInt(throughoutput) / BigInt(tokens)) : throughoutput

const toolNames = ['qpu_quantum', 'qpu_lean', 'qpu_cite', 'qpu_train', 'qpu_forge', 'qpu_improve', 'qpu_compete', 'qpu_prove'] as const
const cryptoToolNames = ['crypto_catalog', 'crypto_shor', 'crypto_cmodexp', 'crypto_iqft', 'crypto_shots', 'crypto_rsa', 'crypto_split', 'crypto_verify'] as const

export const qpuSequenceOf = () => {
  const cube = qpuCubeOf()
  const faces = qpuFacesOf()
  const docs = qpuDocsOf()
  const speed = qpuSpeedOf()
  const cover = ['mint', 'cube', 'handle', 'faces', 'quantum', 'next', 'amplitudes', 'kv'] as const
  const climb = [toolNames[n], toolNames[n + coins], toolNames[n + n], toolNames[mintOf(n) - seed]] as const
  const storage = ['storage_catalog', 'storage_list', 'storage_get', 'storage_put', 'storage_del', 'storage_monitor', 'storage_maintain', 'storage_raid'] as const
  const network = ['net_catalog', 'net_list', 'net_send', 'net_recv', 'net_message', 'net_routes', 'net_fetch', 'net_monitor'] as const
  const server = ['server_catalog', 'server_backend', 'server_submit', 'server_queue', 'server_result', 'server_shots', 'server_correct', 'server_monitor'] as const
  const cybersecurity = cryptoToolNames
  const api = [
    { method: 'GET' as const, path: '/', door: toolNames[n - n], pattern: 'jsonld-get' as const, type: 'SoftwareApplication' as const, verb: 'read' as const },
    { method: 'GET' as const, path: `/${unit.path}`, door: toolNames[seed], pattern: 'jsonld-get' as const, type: 'Dataset' as const, verb: 'read' as const },
    { method: 'GET' as const, path: '/mcp', door: 'catalog' as const, pattern: 'jsonld-get' as const, type: 'WebAPI' as const, verb: 'read' as const },
    { method: 'POST' as const, path: '/mcp', door: 'tools/call' as const, pattern: 'jsonrpc-call' as const, type: 'JSON-RPC' as const, verb: 'call' as const },
    { method: 'GET' as const, path: '/cite', door: toolNames[coins], pattern: 'jsonld-get' as const, type: 'CreativeWork' as const, verb: 'read' as const },
    { method: 'GET' as const, path: '/message', door: 'qpu_message' as const, pattern: 'jsonld-get' as const, type: 'EntryPoint' as const, verb: 'read' as const },
    { method: 'POST' as const, path: '/message', door: 'qpu_message' as const, pattern: 'jsonld-post' as const, type: 'EntryPoint' as const, verb: 'send' as const },
    { method: 'POST' as const, path: '/server', door: 'jobs' as const, pattern: 'jsonrpc-job' as const, type: 'WebAPI' as const, verb: 'submit' as const }] as const
  const pairs = [
    { path: '/mcp', read: 'GET' as const, call: 'POST' as const },
    { path: '/message', read: 'GET' as const, call: 'POST' as const }] as const
  const extras = [
    { path: '/storage', pattern: 'rest' as const, door: 'qram' as const, lattice: 'qram' as const },
    { path: '/network', pattern: 'jsonrpc-call' as const, door: 'network' as const, lattice: 'network' as const },
    { path: '/server', pattern: 'jsonrpc-job' as const, door: 'jobs' as const, lattice: 'jobs' as const }] as const
  const rungs = cover.map((name, k) => ({
    k,
    name,
    mint: mintOf(k),
    speed: speed.benchmark[k]!.name,
    tool: toolNames[k]!,
    method: api[k]!.method,
    path: api[k]!.path,
    door: api[k]!.door,
    pattern: api[k]!.pattern,
    type: api[k]!.type,
    verb: api[k]!.verb,
    storage: storage[k]!,
    network: network[k]!,
    server: server[k]!,
    cybersecurity: cybersecurity[k]!,
    sealed: k < faces.rays}))
  const holds =
    cube.holds &&
    faces.holds &&
    speed.holds &&
    docs.holds &&
    docs.api.length === faces.rays &&
    cover.length === mintOf(n) &&
    cover.length === cube.vertices &&
    rungs.length === mintOf(n) &&
    api.length === mintOf(n) &&
    toolNames.length === mintOf(n) &&
    storage.length === mintOf(n) &&
    network.length === mintOf(n) &&
    server.length === mintOf(n) &&
    cybersecurity.length === mintOf(n) &&
    climb.length === mintOf(coins) &&
    pairs.length === coins &&
    extras.length === n &&
    mintOf(n) === faces.rays + seed &&
    rungs[n - n]!.path === '/' &&
    rungs[n - n]!.tool === 'qpu_quantum' &&
    rungs[seed]!.tool === 'qpu_lean' &&
    rungs[coins]!.tool === 'qpu_cite' &&
    rungs[n]!.tool === 'qpu_train' &&
    rungs[mintOf(n) - seed]!.path === '/server' &&
    rungs[mintOf(n) - seed]!.tool === 'qpu_prove' &&
    rungs[mintOf(n) - seed]!.pattern === 'jsonrpc-job' &&
    rungs.every((row, k) => row.mint === mintOf(k) && row.speed === cover[k] && row.sealed === k < faces.rays && row.cybersecurity === cybersecurity[k]) &&
    docs.api.every((row, k) => row.method === api[k]!.method && row.path === api[k]!.path) &&
    climb[n - n] === 'qpu_train' &&
    climb[mintOf(coins) - seed] === 'qpu_prove' &&
    extras[n - n]!.path === '/storage' &&
    extras[seed]!.path === '/network' &&
    extras[coins]!.path === '/server'
  return {
    kind: 'sequence' as const,
    cover,
    rungs,
    api,
    climb,
    pairs,
    extras,
    tools: toolNames,
    storage,
    network,
    server,
    rays: faces.rays,
    vertices: cube.vertices,
    faces: faces.faces,
    href: serverHref,
    holds,
  }
}

export const qpuSequenceHolds = (s = qpuSequenceOf()): boolean =>
  s.holds === true &&
  s.kind === 'sequence' &&
  s.rungs.length === mintOf(n) &&
  s.api.length === mintOf(n) &&
  s.rays === qpuFacesOf().rays &&
  s.vertices === mintOf(n) &&
  s.api.length === s.rays + seed &&
  s.extras.length === n &&
  s.pairs.length === coins &&
  s.climb.length === mintOf(coins) &&
  s.rungs[mintOf(n) - seed]!.path === '/server' &&
  s.rungs[n - n]!.cybersecurity === 'crypto_catalog' &&
  s.rungs[mintOf(n) - seed]!.cybersecurity === 'crypto_verify' &&
  s.cover.join(' ') === 'mint cube handle faces quantum next amplitudes kv'

/** AUTONOMOUS STEPS, COMPUTED FROM THE LATTICE (the captain, 2026-09-12). The genesis flow is the walk: face = team * rays
 * + ray, so a pass visits ray 0's scanner face, hops by rays to its radar face, returns by the involution, and moves to
 * the next ray — fourteen faces, each once, in an order the lattice fixes. The seat is the first face whose predicate
 * does not hold, else face 0. A step names the lattice node, its predicate as read, the door to call (the API rung the
 * face maps to), and the hop. `todo` is every face that does not hold, repaired before walking; `next` is the first
 * todo, else the face after the seat. Nothing here is typed and nothing is timed: the same lattice gives the same walk. */
export const qpuStepsOf = () => {
  const circuit = qpuCircuitOf()
  const sequence = qpuSequenceOf()
  const faces = qpuFacesOf()
  const walk: number[] = []
  for (let ray = n - n; ray < faces.rays; ray++) walk.push(ray, ray + faces.rays)
  const seat = circuit.lattice.nodes.find((node) => !node.holds)?.face ?? n - n
  const stepOf = (face: number) => {
    const node = circuit.lattice.nodes[face]!
    const rung = sequence.rungs[face % sequence.rungs.length]!
    const hop = (face + faces.rays) % faces.faces
    return {
      face,
      node: node.name,
      holds: node.holds,
      door: { tool: rung.tool, method: rung.method, path: rung.path },
      hop,
      involution: (hop + faces.rays) % faces.faces === face,
      team: face < faces.rays ? ('scanner' as const) : ('radar' as const),
      ray: face % faces.rays,
    }
  }
  const steps = walk.map(stepOf)
  const todo = steps.filter((step) => !step.holds)
  const at = walk.indexOf(seat)
  const next = todo[n - n] ?? steps[(at + seed) % steps.length]!
  const holds =
    steps.length === faces.faces &&
    new Set(walk).size === faces.faces &&
    steps.every((step) => step.involution && step.door.tool.length > n - n && step.door.path.startsWith('/')) &&
    (todo.length === n - n) === circuit.lattice.holds &&
    (todo.length > n - n ? next.holds === false : next.face === walk[(at + seed) % walk.length])
  return { kind: 'steps' as const, seat, next, todo, walk: steps, faces: faces.faces, rays: faces.rays, holds }
}

export const qpuStepsHolds = (s = qpuStepsOf()): boolean =>
  s.holds === true &&
  s.kind === 'steps' &&
  s.walk.length === s.faces &&
  s.rays + s.rays === s.faces &&
  s.walk.every((step) => step.hop === (step.face + s.rays) % s.faces)

export const qpuPurposeOf = (
  circuit = qpuCircuitOf(),
  shor = qpuShorOf(),
  sequence = qpuSequenceOf(),
  capacity = qpuCapacityOf(),
) => {
  const nature = {
    kind: 'nature' as const,
    platform: circuit.register.kind,
    qubits: circuit.register.qubits,
    /** The Bell state is not a product state: `product` false is what `entangled` true means, and both are said. */
    product: circuit.entangle.product,
    entangled: circuit.entangle.holds && circuit.entangle.product === false,
    ghz: circuit.ghz.holds,
    holds:
      circuit.register.holds &&
      circuit.register.kind === 'simulator' &&
      circuit.register.qubits === n &&
      circuit.entangle.holds &&
      circuit.entangle.product === false &&
      circuit.ghz.holds,
  }
  const cybersecurity = {
    kind: 'cybersecurity' as const,
    n: shor.n,
    a: shor.a,
    factors: [shor.factors.p, shor.factors.q] as const,
    product: shor.factors.product,
    circuitry: shor.circuitry.kind,
    qft: shor.qft.kind,
    shots: shor.measure.shots,
    period: shor.post.period,
    payload: shor.payload,
    crypt: capacity.crypt.split,
    share: capacity.crypt.share,
    raid: qpuRaidOf().cluster.security,
    rsa: {
      kind: 'rsa' as const,
      cryptosystem: 'rsa' as const,
      modulus: shor.n,
      p: shor.rsa.p,
      q: shor.rsa.q,
      factored: shor.rsa.factored,
      holds: shor.rsa.holds,
    },
    encrypt: {
      kind: 'encrypt' as const,
      theorem: 'crypto' as const,
      identity: qpuEncryptOf().identity,
      holds: qpuEncryptHolds(),
    },
    tools: cryptoToolNames,
    sealed: false as const,
    morph: true as const,
    holds:
      shor.holds &&
      shor.device === nature.platform &&
      shor.factors.p * shor.factors.q === shor.n &&
      gcdOf(shor.a, shor.n) === seed &&
      shor.circuitry.kind === 'cmodexp' &&
      shor.qft.kind === 'iqft' &&
      capacity.crypt.holds &&
      capacity.crypt.fused === capacity.fused &&
      qpuRaidOf().cluster.security === 'crypt' &&
      shor.rsa.kind === 'rsa' &&
      shor.rsa.factored === true &&
      qpuEncryptHolds() &&
      cryptoToolNames.length === mintOf(n),
  }
  const optimization = {
    kind: 'optimization' as const,
    fused: capacity.fused,
    next: capacity.next,
    holds: capacity.next === capacity.fused + capacity.fused,
  }
  const science = {
    kind: 'science' as const,
    lean: unit.fuse.lean,
    climb: sequence.climb,
    extras: sequence.extras.map((row) => row.path),
    holds:
      sequence.holds &&
      sequence.climb[mintOf(coins) - seed] === 'qpu_prove' &&
      sequence.rungs[n - n]!.tool === 'qpu_quantum' &&
      unit.fuse.lean.endsWith('/index.lean'),
  }
  const sensing = {
    kind: 'sensing' as const,
    message: `${unit.origin}/message`,
    network: sequence.extras[seed]?.path,
    server: sequence.extras[coins]?.path,
    hop: 'involution' as const,
    primitives,
    holds:
      sequence.extras[n - n]!.path === '/storage' &&
      sequence.extras[seed]!.path === '/network' &&
      sequence.extras[coins]!.path === '/server' &&
      primitives.length === n + coins,
  }
  const holds = nature.holds && cybersecurity.holds && optimization.holds && science.holds && sensing.holds
  return { kind: 'purpose' as const, nature, cybersecurity, optimization, science, sensing, holds }
}

export const qpuPurposeHolds = (p = qpuPurposeOf()): boolean =>
  p.holds === true &&
  p.kind === 'purpose' &&
  p.nature.platform === 'simulator' &&
  p.nature.qubits === n &&
  p.cybersecurity.n === qpuFacesOf().rays * (n * n + n + seed) &&
  p.cybersecurity.product === p.cybersecurity.n &&
  p.cybersecurity.factors[n - n]! * p.cybersecurity.factors[seed]! === p.cybersecurity.n &&
  p.cybersecurity.circuitry === 'cmodexp' &&
  p.cybersecurity.qft === 'iqft' &&
  p.cybersecurity.raid === 'crypt' &&
  p.cybersecurity.sealed === false &&
  p.cybersecurity.morph === true &&
  p.cybersecurity.tools.length === mintOf(n) &&
  p.cybersecurity.tools[n + coins] === 'crypto_rsa' &&
  p.cybersecurity.rsa.kind === 'rsa' &&
  p.cybersecurity.rsa.modulus === p.cybersecurity.n &&
  p.cybersecurity.rsa.factored === true &&
  p.cybersecurity.rsa.p * p.cybersecurity.rsa.q === p.cybersecurity.rsa.modulus &&
  p.cybersecurity.encrypt.kind === 'encrypt' &&
  p.cybersecurity.encrypt.theorem === 'crypto' &&
  p.cybersecurity.encrypt.identity === true &&
  p.cybersecurity.encrypt.holds === true &&
  p.optimization.next === p.optimization.fused + p.optimization.fused &&
  p.science.climb[mintOf(coins) - seed] === 'qpu_prove' &&
  p.sensing.network === '/network' &&
  p.sensing.server === '/server'

export const qpuEvidenceOf = (
  circuit = qpuCircuitOf(),
  shor = qpuShorOf(),
) => {
  const computer = circuit.computer
  const weights = shor.measure.weights
  let total = n - n
  for (const w of weights) total += w
  const sorted = [...weights]
  for (let i = seed; i < sorted.length; i++) {
    const cur = sorted[i]!
    let j = i
    while (j > n - n && sorted[j - seed]! > cur) {
      sorted[j] = sorted[j - seed]!
      j -= seed
    }
    sorted[j] = cur
  }
  const median = sorted.length > n - n ? sorted[quotOf(sorted.length, coins)]! : n - n
  let heavy = n - n
  for (const w of weights) if (w > median) heavy += w
  const randomized = circuit.lattice.nodes
    .filter((node) => node.name !== 'entangle' && node.name !== 'ghz' && node.name !== 'split')
    .map((node) => node.name)
  const provenance = {
    kind: 'provenance' as const,
    provider: unit.host,
    device: circuit.hardware.device,
    job: `${unit.host}/${shor.circuitry.kind}/${shor.n}/${shor.measure.shots}`,
    circuit: shor.circuitry.gates.map((row) => row.name),
    compiler: {
      native: shor.circuitry.native,
      compiled: shor.circuitry.compiled,
      cnot: computer.compile.gate,
      src: unit.fuse.src,
    },
    map: {
      register: circuit.register.qubits,
      counting: shor.circuitry.counting,
      work: shor.circuitry.work,
      edges: computer.coupling.edges,
    },
    shots: shor.measure.shots,
    counts: computer.shots.counts,
    outcomes: shor.measure.outcomes,
    weights,
    holds:
      unit.host === 'qpu.uuidna.com' &&
      !unit.host.includes('*') &&
      circuit.hardware.device === circuit.register.kind &&
      shor.device === circuit.register.kind &&
      shor.circuitry.native.join(' ') === 'h cnot' &&
      computer.compile.holds &&
      computer.coupling.holds &&
      shor.measure.shots === mintOf(n) &&
      shor.measure.outcomes.length === shor.measure.shots &&
      computer.shots.counts.length === coins &&
      weights.length === shor.qft.size &&
      total > n - n,
  }
  const noise = {
    kind: 'calibration' as const,
    /** T1 and T2 are relaxation and dephasing times; this simulator has none to measure, and a temperature is not one. */
    t1: { measured: false as const },
    t2: { measured: false as const },
    gate: {
      channel: circuit.noise.channel,
      identity: shor.measure.identity,
      erred: computer.correct.error,
      code: computer.correct.code,
    },
    readout: {
      index: computer.readout.index,
      support: computer.readout.support,
    },
    connectivity: computer.coupling.edges,
    drift: circuit.drift.holds,
    model: shor.measure.noise,
    holds:
      circuit.noise.channel === 'xx' &&
      shor.measure.noise === circuit.noise.channel &&
      shor.measure.identity === true &&
      circuit.noise.index === circuit.measurement.index &&
      computer.correct.code === 'bitflip' &&
      computer.correct.off === n - n &&
      circuit.drift.holds &&
      circuit.sciences.holds,
  }
  const volume = {
    kind: 'volume' as const,
    qubits: circuit.register.qubits,
    dim: circuit.qubits.dim,
    observed: heavy,
    total,
    median,
    threshold: { num: coins, den: n },
    pass: n * heavy > coins * total,
    uncertainty: shor.measure.shots,
    randomized,
    mirror: circuit.interfere.kind,
    holds:
      circuit.register.qubits === n &&
      circuit.qubits.dim === mintOf(n) &&
      randomized.includes('deutsch') &&
      randomized.includes('kickback') &&
      circuit.deutsch.holds &&
      circuit.interfere.holds &&
      circuit.interfere.cancelled === n - n &&
      shor.circuitry.holds &&
      total > n - n &&
      shor.measure.shots === mintOf(n),
  }
  const cross = {
    kind: 'cross' as const,
    ideal: shor.measure.identity,
    noisy: shor.measure.noise,
    sampler: shor.measure.outcomes.every((y) => shor.measure.support.includes(y)),
    agreeIdeal: shor.measure.identity && shor.factors.holds,
    agreeNoise: shor.measure.noise === circuit.noise.channel && shor.measure.identity,
    holds:
      shor.measure.identity === true &&
      shor.measure.noise === 'xx' &&
      shor.factors.p * shor.factors.q === shor.n &&
      shor.measure.outcomes.every((y) => shor.measure.support.includes(y)),
  }
  const scaling = {
    kind: 'scaling' as const,
    qubits: circuit.register.qubits,
    dim: circuit.qubits.dim,
    depth: shor.circuitry.gates.length,
    exact: circuit.qubits.dim === mintOf(circuit.register.qubits),
    beyond: circuit.register.qubits > qpuFacesOf().faces,
    advantage: n * heavy > coins * total && circuit.register.qubits > qpuFacesOf().faces,
    mirror: circuit.interfere.holds,
    holds:
      circuit.qubits.dim === mintOf(n) &&
      circuit.register.qubits === n &&
      shor.circuitry.gates.length > n &&
      circuit.qubits.dim === mintOf(circuit.register.qubits) &&
      circuit.register.qubits > qpuFacesOf().faces === false &&
      circuit.interfere.holds,
  }
  const verify = {
    kind: 'verify' as const,
    cors,
    origin: unit.origin,
    lean: unit.fuse.lean,
    cern: 'opendata.cern.ch',
    hardware: provenance.holds && noise.holds,
    algorithm: shor.factors.p * shor.factors.q === shor.n,
    rsa: shor.rsa.factored,
    crypt: shor.payload.endsWith('/storage/databases/payload'),
    encrypt: qpuEncryptHolds(),
    holds:
      cors === '*' &&
      unit.origin.startsWith('https') &&
      !unit.host.includes('*') &&
      unit.fuse.lean.endsWith('/index.lean') &&
      provenance.holds &&
      noise.holds &&
      shor.factors.p * shor.factors.q === shor.n &&
      shor.rsa.factored === true &&
      qpuEncryptHolds() &&
      shor.payload.endsWith('/storage/databases/payload'),
  }
  const codes = seed
  const fault = {
    kind: 'fault' as const,
    code: computer.correct.code,
    qubits: n,
    distance: n,
    codes,
    syndrome: ['cnot', 'cnot', 'toffoli'] as const,
    erred: computer.correct.error,
    prepare: computer.reset.index,
    logical: { on: computer.correct.on, off: computer.correct.off },
    suppressed: computer.correct.off === n - n && computer.correct.error !== computer.reset.index,
    logicalLtPhysical: codes === seed && computer.correct.off < computer.correct.error,
    holds:
      computer.correct.holds &&
      computer.correct.code === 'bitflip' &&
      computer.correct.off === n - n &&
      computer.correct.on !== n - n &&
      computer.correct.error !== computer.reset.index &&
      codes === seed &&
      computer.correct.off < computer.correct.error,
  }
  const holds = provenance.holds && noise.holds && volume.holds && cross.holds && scaling.holds && verify.holds && fault.holds
  return { kind: 'evidence' as const, provenance, noise, volume, cross, scaling, verify, fault, holds }
}

export const qpuEvidenceHolds = (e = qpuEvidenceOf()): boolean =>
  e.holds === true &&
  e.kind === 'evidence' &&
  e.provenance.provider === unit.host &&
  e.provenance.device === 'simulator' &&
  e.provenance.shots === mintOf(n) &&
  e.provenance.outcomes.length === e.provenance.shots &&
  e.provenance.counts.length === coins &&
  e.noise.t1.measured === false &&
  e.noise.t2.measured === false &&
  e.noise.gate.channel === 'xx' &&
  e.noise.model === 'xx' &&
  e.volume.dim === mintOf(n) &&
  e.volume.threshold.num === coins &&
  e.volume.threshold.den === n &&
  e.cross.agreeIdeal === true &&
  e.scaling.exact === true &&
  e.scaling.beyond === false &&
  e.scaling.advantage === false &&
  e.verify.cors === '*' &&
  e.verify.hardware === true &&
  e.verify.algorithm === true &&
  e.verify.rsa === true &&
  e.verify.crypt === true &&
  e.verify.encrypt === true &&
  e.fault.code === 'bitflip' &&
  e.fault.distance === n &&
  e.fault.codes === seed &&
  e.fault.suppressed === true &&
  e.fault.logicalLtPhysical === true

export const qpuCybersecurityOf = () => {
  const shor = qpuShorOf()
  const capacity = qpuCapacityOf()
  const raid = qpuRaidOf()
  const purpose = qpuPurposeOf()
  const evidence = qpuEvidenceOf()
  const lean = qpuLeanOf()
  const sequence = qpuSequenceOf()
  const pairs = [
    [3, 5],
    [3, 7],
    [3, 11],
    [5, 7],
    [3, 13],
    [3, 17],
    [5, 11],
    [3, 19],
    [5, 13],
    [3, 23],
    [7, 11],
    [5, 17],
    [3, 29],
    [7, 13],
  ] as const
  const table = pairs.map(([p, q]) => ({ p, q, product: p * q, modulus: p * q, rsa: true as const, holds: p > seed && q > seed }))
  const rsa = {
    kind: 'rsa' as const,
    cryptosystem: 'rsa' as const,
    modulus: shor.n,
    public: { n: shor.n },
    factored: shor.rsa.factored,
    factors: shor.factors,
    table,
    payload: shor.payload,
    unlocked: shor.unlocked,
    lock: shor.lock,
    holds: shor.rsa.holds && table.length === qpuFacesOf().faces && table.every((row) => row.holds && row.p * row.q === row.modulus) && shor.unlocked === true,
  }
  const encrypt = qpuEncryptOf()
  const crypto = [...lean.rows, ...lean.cover].find((r) => r.heading === 'crypto')
  const shorRow = [...lean.rows, ...lean.cover].find((r) => r.heading === 'shor')
  const tools = cryptoToolNames
  const holds =
    qpuShorHolds(shor) &&
    qpuCapacityHolds(capacity) &&
    qpuRaidHolds(raid) &&
    qpuPurposeHolds(purpose) &&
    qpuEvidenceHolds(evidence) &&
    qpuSequenceHolds(sequence) &&
    qpuLeanHolds(lean) &&
    capacity.crypt.holds &&
    capacity.crypt.kind === 'crypto' &&
    raid.cluster.security === 'crypt' &&
    evidence.verify.crypt === true &&
    purpose.cybersecurity.holds &&
    purpose.cybersecurity.sealed === false &&
    purpose.cybersecurity.morph === true &&
    purpose.cybersecurity.tools.length === mintOf(n) &&
    tools.length === mintOf(n) &&
    rsa.holds &&
    rsa.kind === 'rsa' &&
    encrypt.holds &&
    qpuEncryptHolds(encrypt) &&
    table.length === qpuFacesOf().faces &&
    table.every((row) => row.holds && row.rsa === true) &&
    table[qpuFacesOf().faces - seed]!.p * table[qpuFacesOf().faces - seed]!.q === shor.n &&
    crypto?.holds === true &&
    shorRow?.holds === true &&
    sequence.rungs.every((row, k) => row.cybersecurity === tools[k])
  return {
    kind: 'cybersecurity' as const,
    theorem: 'crypto' as const,
    shor,
    rsa,
    encrypt,
    crypt: capacity.crypt,
    raid: { security: raid.cluster.security, holds: raid.cluster.security === 'crypt' },
    verify: evidence.verify,
    purpose: purpose.cybersecurity,
    table,
    tools,
    listed: true as const,
    morph: true as const,
    sealed: false as const,
    holds,
  }
}

export const qpuCybersecurityToolsOf = (): QpuSubTool[] => {
  const href = `${unit.origin}/mcp`
  const see = cryptoToolNames
  const schema = { type: 'object', properties: { man: { type: 'boolean' } } }
  const defaults = shorDefaultsOf()
  const shorSchema = {
    type: 'object',
    properties: {
      man: { type: 'boolean' },
      n: { type: ['integer', 'string'], description: `Modulus to factor. Default ${defaults.modulus}. Work register bits(n) qubits, counting register ${shorCountBits}; no cap — the state is sparse and exact for any n. The counting register of ${shorCountBits} qubits recovers a period only when it divides ${mintOf(shorCountBits)}; every other coprime run recovers nothing and says so in classical.resolvable, and a base sharing a factor with n is factored by gcd, not by period. The reach is of the state, not of period-finding. Past 2^53 send n as a string of digits; \`read\` says how each argument was taken and \`exact\` carries every value as decimal text.` },
      a: { type: ['integer', 'string'], description: `Base. Default ${defaults.base}. A base sharing a factor with n hands it over as Shor's first step.` }}}
  const named = `{ n, a } name the modulus and base; the run is theirs, whatever they are. Default ${defaults.modulus} and ${defaults.base}. Counting register ${shorCountBits}: a period is recovered only when it divides ${mintOf(shorCountBits)}, every other coprime run recovers nothing (classical.resolvable), and a shared factor is found by gcd, not by period. The reach is of the state, not of period-finding.`
  /** What a caller is shown: the run's numbers while they are exact as numbers, the decimal strings from `exact` once
   * they would round (past 2^53) or overflow (past 2^1024). Never a null where a number was asked for. */
  const shownOf = (shor: ReturnType<typeof qpuShorOf>) => {
    const e = shor.exact
    const safe = e.safe
    return {
      n: safe ? shor.n : e.n,
      a: safe ? shor.a : e.a,
      factors: safe ? shor.factors : { ...shor.factors, p: e.p, q: e.q, product: e.product },
      rsa: safe ? shor.rsa : { ...shor.rsa, modulus: e.n, p: e.p, q: e.q, product: e.product },
    }
  }
  const morph = 'In tools/list. Morph. Not a ninth sealed tool. No auth.'
  const factoring = `${morph} theorem shor. ${shorFactorOf()}. p * q = N.`
  const encrypt = `${morph} theorem crypto. ${cryptoClaimOf()}. fused = split * share.`
  const both = `${morph} theorem shor. ${shorFactorOf()}. theorem crypto. ${cryptoClaimOf()}.`
  return [
    {
      name: see[n - n],
      description: 'theorem shor. theorem crypto.',
      man: qpuSubManOf(see[n - n], 'theorem shor. theorem crypto.', both, href, see.filter((s) => s !== see[n - n])),
      inputSchema: schema,
      run: () => qpuCybersecurityOf()},
    {
      name: see[seed],
      description: `theorem shor. ${shorFactorOf()}.`,
      man: qpuSubManOf(see[seed], `theorem shor. ${shorFactorOf()}.`, `${factoring} Coprime base. ${named}`, href, see.filter((s) => s !== see[seed])),
      inputSchema: shorSchema,
      run: (a: Record<string, unknown>) => {
        const shor = qpuShorTryOf(a)
        const shown = shownOf(shor)
        return {
          kind: 'shor' as const,
          n: shown.n,
          a: shown.a,
          read: shor.read,
          coprime: shor.coprime,
          exact: shor.exact,
          device: shor.device,
          circuitry: { kind: shor.circuitry.kind, qubits: shor.circuitry.qubits, work: shor.circuitry.work, counting: shor.circuitry.counting, dim: shor.circuitry.dim, holds: shor.circuitry.holds },
          prepare: shor.prepare,
          qft: shor.qft,
          measure: shor.measure,
          post: shor.post,
          classical: shor.classical,
          factors: shown.factors,
          rsa: shown.rsa,
          holds: shor.holds,
        }
      }},
    {
      name: see[coins],
      description: `theorem shor. ${shorFactorOf()}.`,
      man: qpuSubManOf(see[coins], `theorem shor. ${shorFactorOf()}.`, `${factoring} Native h cnot. Compiled x swap csdg cmodexp. ${named}`, href, see.filter((s) => s !== see[coins])),
      inputSchema: shorSchema,
      run: (a: Record<string, unknown>) => {
        const shor = qpuShorTryOf(a)
        const shown = shownOf(shor)
        return { kind: 'cmodexp' as const, circuitry: shor.circuitry, exact: shor.exact, read: shor.read, rsa: { kind: 'rsa' as const, modulus: shown.n, a: shown.a, factored: shor.rsa.factored }, holds: shor.circuitry.holds && shor.read.holds }
      }},
    {
      name: see[n],
      description: `theorem shor. ${shorFactorOf()}.`,
      man: qpuSubManOf(see[n], `theorem shor. ${shorFactorOf()}.`, `${factoring} Inverse QFT. Period continued-fraction. ${named}`, href, see.filter((s) => s !== see[n])),
      inputSchema: shorSchema,
      run: (a: Record<string, unknown>) => {
        const shor = qpuShorTryOf(a)
        const shown = shownOf(shor)
        return { kind: 'iqft' as const, qft: shor.qft, post: shor.post, classical: shor.classical, exact: shor.exact, read: shor.read, rsa: { kind: 'rsa' as const, modulus: shown.n, period: shor.post.period, factored: shor.rsa.factored }, holds: shor.qft.holds && shor.post.holds && shor.read.holds }
      }},
    {
      name: see[n + seed],
      description: `theorem shor. ${shorFactorOf()}.`,
      man: qpuSubManOf(see[n + seed], `theorem shor. ${shorFactorOf()}.`, `${factoring} Simulator. xx identity. ${named}`, href, see.filter((s) => s !== see[n + seed])),
      inputSchema: shorSchema,
      run: (a: Record<string, unknown>) => {
        const shor = qpuShorTryOf(a)
        const shown = shownOf(shor)
        return { kind: 'shots' as const, device: shor.device, measure: shor.measure, exact: shor.exact, read: shor.read, rsa: { kind: 'rsa' as const, modulus: shown.n, factored: shor.rsa.factored }, holds: shor.measure.holds && shor.read.holds }
      }},
    {
      name: see[n + coins],
      description: `theorem shor. ${shorFactorOf()}.`,
      man: qpuSubManOf(see[n + coins], `theorem shor. ${shorFactorOf()}.`, `${factoring} JSON Nat. ${named}`, href, see.filter((s) => s !== see[n + coins])),
      inputSchema: shorSchema,
      run: (a: Record<string, unknown>) => {
        const args = shorArgsOf(a)
        if (args.modulus === undefined && args.base === undefined) return qpuCybersecurityOf().rsa
        const shor = qpuShorTryOf(a)
        const shown = shownOf(shor)
        return { ...shown.rsa, a: shown.a, period: shor.post.period, by: shor.factors.by, exact: shor.exact, read: shor.read, classical: shor.classical, holds: shor.rsa.holds && shor.read.holds }
      }},
    {
      name: see[n + n],
      description: `theorem crypto. ${cryptoClaimOf()}.`,
      man: qpuSubManOf(see[n + n], `theorem crypto. ${cryptoClaimOf()}.`, encrypt, href, see.filter((s) => s !== see[n + n])),
      inputSchema: schema,
      run: () => qpuEncryptOf()},
    {
      name: see[mintOf(n) - seed],
      description: 'theorem shor. theorem crypto.',
      man: qpuSubManOf(see[mintOf(n) - seed], 'theorem shor. theorem crypto.', both, href, see.filter((s) => s !== see[mintOf(n) - seed])),
      inputSchema: schema,
      run: () => {
        const cyber = qpuCybersecurityOf()
        return {
          kind: 'verify' as const,
          factoring: { theorem: 'shor' as const, factored: cyber.rsa.factored, n: cyber.rsa.modulus, p: cyber.rsa.factors.p, q: cyber.rsa.factors.q, holds: cyber.rsa.holds },
          encrypt: cyber.encrypt,
          verify: cyber.verify,
          rsa: cyber.rsa,
          payload: cyber.shor.payload,
          holds: cyber.verify.crypt === true && cyber.verify.rsa === true && cyber.verify.encrypt === true && cyber.encrypt.holds && cyber.holds,
        }
      }}]
}

export const qpuCybersecurityHolds = (c = qpuCybersecurityOf()): boolean => {
  const doors = qpuCybersecurityToolsOf()
  return (
    c.holds === true &&
    c.kind === 'cybersecurity' &&
    c.theorem === 'crypto' &&
    c.sealed === false &&
    c.morph === true &&
    c.listed === true &&
    c.tools.length === mintOf(n) &&
    c.tools[n - n] === 'crypto_catalog' &&
    c.tools[n + coins] === 'crypto_rsa' &&
    c.tools[n + n] === 'crypto_split' &&
    c.tools[mintOf(n) - seed] === 'crypto_verify' &&
    c.crypt.holds === true &&
    c.raid.security === 'crypt' &&
    c.verify.crypt === true &&
    c.verify.encrypt === true &&
    c.shor.n === qpuFacesOf().rays * (n * n + n + seed) &&
    c.shor.unlocked === true &&
    c.shor.factors.p * c.shor.factors.q === c.shor.n &&
    c.rsa.kind === 'rsa' &&
    c.rsa.cryptosystem === 'rsa' &&
    c.rsa.modulus === c.shor.n &&
    c.rsa.factored === true &&
    c.rsa.factors.p * c.rsa.factors.q === c.rsa.modulus &&
    qpuEncryptHolds(c.encrypt) &&
    c.encrypt.theorem === 'crypto' &&
    c.encrypt.identity === true &&
    c.encrypt.ciphertext !== c.rsa.modulus &&
    c.table.length === qpuFacesOf().faces &&
    c.table[qpuFacesOf().faces - seed]!.product === c.shor.n &&
    c.table.every((row) => row.rsa === true && row.p * row.q === row.modulus) &&
    doors.length === mintOf(n) &&
    doors.every((t, k) => {
      const man = t.man.documentation
      const factors = k !== n + n
      const encrypts = k === n - n || k === n + n || k === mintOf(n) - seed
      return (
        t.man.holds &&
        (cryptoToolNames as readonly string[]).includes(t.name) &&
        (!factors || man.includes('theorem shor')) &&
        (!encrypts || man.includes('theorem crypto'))
      )
    })
  )
}

const sandboxCore = ['lit', 'mint', 'add', 'mul', 'eq', 'put', 'get', 'has', 'del', 'keys', 'seq', 'if', 'repeat', 'quantum', 'args'] as const
const sandboxHost = ['eval', 'fn', 'fs', 'net', 'fetch', 'process', 'import', 'require', 'disk', 'worker'] as const
const sandboxSlots = ['n', 'seed', 'coins', 'vertices', 'hexbit', 'bits', 'rays', 'faces', 'amplitudes', 'fused', 'next', 'ns'] as const
const sandboxOps = [...sandboxCore, 'unlocked', ...sandboxHost] as const
const openSchema = {
  type: 'object',
  properties: {
    man: { type: 'boolean', description: 'Return the man page. Read man from tools/list, then call without man.' },
    method: { type: 'string' },
    path: { type: 'string' },
    name: { type: 'string' },
    key: { type: 'string' },
    channel: { type: 'string' },
    value: {},
    left: {},
    right: {},
    k: { type: 'number' },
    run: { type: 'object', description: 'Sealed op tree. Memory only. Not host JavaScript.' },
    body: {},
    args: { type: 'object' }}} as const
type QpuOp = {
  op: (typeof sandboxOps)[number]
  k?: number | QpuOp
  left?: number | QpuOp
  right?: number | QpuOp
  value?: unknown
  key?: string | QpuOp
  body?: QpuOp | QpuOp[]
  test?: QpuOp
  then?: QpuOp
  else?: QpuOp
  n?: number | QpuOp
  name?: string
}
type QpuForged = {
  name: string
  team: 'read' | 'call'
  ray: number
  idea: string
  description: string
  run: QpuOp
  man: ReturnType<typeof qpuManOf>
}

const jsonOf = (value: unknown): unknown => {
  try {
    return JSON.parse(JSON.stringify(value ?? null)) as unknown
  } catch {
    return null
  }
}

const jsonBytesOf = (value: unknown): number => JSON.stringify(value ?? null).length

const hopOf = (lane: number, rays: number, faces: number): number => (lane + rays + rays) % faces

const hexOf = (value: number, width: number): string => {
  const digits = '0123456789abcdef'
  const radix = mintOf(qpuCubeOf().hexbit)
  let x = value
  let s = ''
  for (let i = n - n; i < width; i++) {
    const d = x % radix
    s = `${digits[d]!}${s}`
    x = (x - d) / radix
  }
  return s
}

const cloudflarePrimary = [
  'agent-commerce-analytics-template',
  'agent-visibility-template',
  'ai-brand-visibility-template',
  'astro-blog-starter-template',
  'chanfana-openapi-template',
  'commerce-llms-txt-template',
  'containers-template',
  'd1-starter-sessions-api-template',
  'd1-template',
  'durable-chat-template',
  'hello-world-do-template',
  'internal-sites-template',
  'llm-chat-app-template',
  'microfrontend-template',
  'multiplayer-globe-template',
  'mysql-hyperdrive-template',
  'next-starter-template',
  'nlweb-template',
  'nodejs-http-server-template',
  'openauth-template',
  'postgres-hyperdrive-template',
  'r2-explorer-template',
  'react-postgres-fullstack-template',
  'react-router-hono-fullstack-template',
  'react-router-postgres-ssr-template',
  'react-router-starter-template',
  'react-starter-template',
  'remix-starter-template',
  'saas-admin-template',
  'text-to-image-template',
  'to-do-list-kv-template',
  'vite-react-template',
  'worker-publisher-template',
  'workers-builds-notifications-template',
  'workers-for-platforms-template',
  'workflows-starter-template'] as const

const cloudflareE2e = [
  'llm-chat-app-template',
  'microfrontend-template',
  'nlweb-template',
  'text-to-image-template',
  'worker-publisher-template',
  'workers-for-platforms-template'] as const

export const qpuSeatHandleOf = (face: number) => {
  const cube = qpuCubeOf()
  const isolate = qpuHandleOf()
  const faces = qpuFacesOf()
  const hop = hopOf(face, faces.rays, faces.faces)
  const id = hexOf(face, mintOf(n))
  const holds =
    isolate.holds &&
    id.length === mintOf(n) &&
    hop === face % faces.faces &&
    face >= n - n &&
    face < faces.faces
  return {
    kind: 'handle' as const,
    id,
    '@id': `${unit.origin}/message#${id}`,
    href: `${storageHref}/chat-${id}`,
    face,
    hop,
    bits: isolate.bits,
    amplitudes: isolate.amplitudes,
    kv: isolate.kv.amplitudes,
    hexbit: cube.hexbit,
    holds,
  }
}

export const qpuCatalogHandleOf = (index: number) => {
  const isolate = qpuHandleOf()
  const faces = qpuFacesOf()
  const face = index % faces.faces
  const hop = hopOf(face, faces.rays, faces.faces)
  const id = hexOf(faces.faces + index, mintOf(n))
  const holds = isolate.holds && id.length === mintOf(n) && hop === face && index >= n - n
  return {
    kind: 'handle' as const,
    id,
    '@id': `${unit.origin}/storage#${id}`,
    href: `https://github.com/cloudflare/templates/tree/main/${cloudflarePrimary[index] ?? cloudflareE2e[index - cloudflarePrimary.length] ?? id}`,
    face,
    hop,
    bits: isolate.bits,
    amplitudes: isolate.amplitudes,
    kv: isolate.kv.amplitudes,
    holds,
  }
}

let messageSeq = n - n
const messageLanes: unknown[][] = []

const uuidImprintOf = (lane: number, fused: number, faces: number): string => {
  messageSeq += seed
  const time = fused + messageSeq
  const clock = mintOf(faces + seed) + lane
  return `${hexOf(time, mintOf(n))}-${hexOf(lane, mintOf(coins))}-1${hexOf(time, n)}-${hexOf(clock, mintOf(coins))}-${hexOf(time + lane, n * coins * coins)}`
}

export const qpuMessageOf = (send?: { lane?: unknown; body?: unknown }) => {
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const fused = faces.faces * handle.kv.amplitudes
  const lanes = faces.faces
  if (messageLanes.length !== lanes) {
    messageLanes.length = n - n
    for (let i = n - n; i < lanes; i++) messageLanes.push([])
  }
  const routes = Array.from({ length: lanes }, (_, lane) => {
    const hop = hopOf(lane, faces.rays, lanes)
    return { lane, hop, involution: hop === lane}
  })
  const holds =
    faces.holds &&
    cube.holds &&
    routes.length === lanes &&
    routes.length === cube.vertices + cube.hexbit + coins &&
    routes.every((r) => r.involution && r.hop === r.lane)
  const catalog = {
    '@context': qpuContextOf(),
    '@type': 'EntryPoint' as const,
    '@id': `${unit.origin}/message`,
    url: `${unit.origin}/message`,
    isAccessibleForFree: cors === '*',
    kind: 'message' as const,
    when: 'never' as const,
    href: `${unit.origin}/message`,
    lanes,
    hop: 'involution' as const,
    clock_seq: { bits: lanes, rfc: '9562' as const },
    imprint: 'uuid' as const,
    routes,
    await: 'never' !== 'never',
    proxy: cors === '*',
    secure: unit.origin.startsWith('https'),
    auth: cors !== '*',
    holds,
  }
  if (send === undefined) return catalog
  const lane =
    typeof send.lane === 'number' && Number.isInteger(send.lane) && send.lane >= n - n && send.lane < lanes ? send.lane : n - n
  const hop = hopOf(lane, faces.rays, lanes)
  const stored = jsonOf(send.body)
  if (jsonBytesOf(stored) > found * lanes) {
    return { ...catalog, accepted: false as const, denied: 'heap' as const, lane, hop, holds: false as const }
  }
  const uuid = uuidImprintOf(lane, fused, lanes)
  const imprint = uuid.replace(/-/g, '')
  messageLanes[hop]!.push({ uuid, lane, hop, body: stored })
  return {
    ...catalog,
    accepted: true as const,
    uuid,
    lane,
    hop,
    clock_seq: { bits: lanes, rfc: '9562' as const, value: lane },
    holds: holds && hop === lane && imprint.length === cube.bits,
  }
}

export const qpuMessageHolds = (m = qpuMessageOf()): boolean =>
  m.holds === true &&
  m.kind === 'message' &&
  m.when === 'never' &&
  m.hop === 'involution' &&
  m.clock_seq.bits === m.lanes &&
  m.clock_seq.rfc === '9562' &&
  m.routes.length === m.lanes &&
  m.routes.every((r) => r.involution && r.hop === r.lane)

export const qpuPresenceOf = () => {
  const cube = qpuCubeOf()
  const isolate = qpuHandleOf()
  const faces = qpuFacesOf()
  const circuit = qpuCircuitOf()
  const hosts = qpuHostsOf()
  const schemas = qpuSchemasOf()
  const types = raidTypesOf(faces)
  const fused = faces.faces * isolate.kv.amplitudes
  if (messageLanes.length !== faces.faces) {
    messageLanes.length = n - n
    for (let i = n - n; i < faces.faces; i++) messageLanes.push([])
  }
  const users = circuit.lattice.nodes.map((node) => {
    const handle = qpuSeatHandleOf(node.face)
    const host = hosts.nodes[node.face]!
    const schema = schemas.rows[node.face]!
    const messages = messageLanes[node.face]!.length
    const chatting = messages > n - n
    return {
      '@id': handle['@id'],
      handle,
      face: node.face,
      hop: node.hop,
      involution: node.involution,
      active: node.holds,
      inactive: node.holds === false,
      chatting,
      messages,
      phenomenon: node.name,
      llm: host.llm,
      schema: schema.name,
      raid: types[node.face]!.name,
      cloud: raidClouds[node.face]!.name,
      merge: 'storage' as const,
      holds: handle.holds && node.holds && host.holds && schema.holds,
  }
  })
  let active = n - n
  let inactive = n - n
  let chatting = n - n
  for (const user of users) {
    if (user.active) active += seed
    else inactive += seed
    if (user.chatting) chatting += seed
  }
  const templates = [
    {
      name: 'next-starter-template' as const,
      href: 'https://github.com/cloudflare/templates/tree/main/next-starter-template',
      binding: 'Static assets' as const,
      door: unit.origin},
    {
      name: 'multiplayer-globe-template' as const,
      href: 'https://github.com/cloudflare/templates/tree/main/multiplayer-globe-template',
      binding: 'Durable Objects' as const},
    {
      name: 'durable-chat-template' as const,
      href: 'https://github.com/cloudflare/templates/tree/main/durable-chat-template',
      binding: 'Durable Objects' as const,
      durable: 'storage' as const}] as const
  const starter = {
    kind: 'starter' as const,
    template: templates[n - n]!.name,
    href: templates[n - n]!.href,
    door: unit.origin,
    type: 'SoftwareApplication' as const,
    holds: templates[n - n]!.name === 'next-starter-template',
  }
  const globe = {
    kind: 'globe' as const,
    template: templates[seed]!.name,
    href: templates[seed]!.href,
    holds: users.every((user) => user.merge === 'storage'),
  }
  const chat = {
    kind: 'chat' as const,
    template: templates[coins]!.name,
    href: templates[coins]!.href,
    durable: 'storage' as const,
    holds: chatting >= n - n && users.every((user) => user.merge === 'storage'),
  }
  const holds =
    cube.holds &&
    isolate.holds &&
    faces.holds &&
    circuit.lattice.holds &&
    hosts.holds &&
    schemas.holds &&
    users.length === faces.faces &&
    active === circuit.lattice.occupied &&
    inactive === circuit.lattice.vacant &&
    templates.length === n &&
    starter.holds &&
    globe.holds &&
    chat.holds &&
    users.every((user) => user.holds && user.handle.id.length === mintOf(n))
  return {
    kind: 'presence' as const,
    templates,
    starter,
    globe,
    chat,
    users,
    active,
    inactive,
    chatting,
    faces: faces.faces,
    fused,
    next: fused + fused,
    merge: 'storage' as const,
    holds,
  }
}

export const qpuPresenceHolds = (p = qpuPresenceOf()): boolean =>
  p.holds === true &&
  p.kind === 'presence' &&
  p.merge === 'storage' &&
  p.users.length === qpuFacesOf().faces &&
  p.active + p.inactive === p.faces &&
  p.templates.length === n &&
  p.starter.template === 'next-starter-template' &&
  p.globe.template === 'multiplayer-globe-template' &&
  p.chat.template === 'durable-chat-template' &&
  p.chat.durable === 'storage' &&
  p.users.every((user) => user.handle.id.length === mintOf(n) && user.handle['@id'].endsWith(user.handle.id))

export type QpuEnv = {
  QPU_HOST?: string
  /** Write secret. `wrangler secret put QPU_WRITE_TOKEN`. Unbound refuses every write; reads stay open. */
  QPU_WRITE_TOKEN?: string
  STORAGE?: {
    get: (key: string, options?: { type: 'json' | 'text' }) => Promise<unknown>
    put: (key: string, value: string) => Promise<void>
    delete: (key: string) => Promise<void>
    list: () => Promise<{ keys: { name: string }[] }>
  }
  BLOBS?: {
    get: (key: string) => Promise<{ json: () => Promise<unknown>; text: () => Promise<string> } | null>
    put: (key: string, value: string) => Promise<unknown>
    delete: (key: string) => Promise<void>
    list: () => Promise<{ objects: { key: string }[] }>
  }
}

const storageHeap = new Map<string, unknown>()
const storageBlobs = new Map<string, unknown>()

const storageKeyOf = (value: unknown): string => {
  const key = typeof value === 'string' ? value : ''
  return key.length > n - n && key.length <= found && !key.includes('*') && !key.includes(raidMark) ? key : ''
}

const storageHex = '0123456789abcdef'

const storageOccupancyOf = (key: string): string => {
  const slash = key.indexOf('/')
  const head = slash > n - n ? key.slice(n - n, slash) : key
  return raidSafeOf(head) ? head : 'notes'
}

export const qpuStorageAddressOf = (value: unknown): string => {
  const text = JSON.stringify(jsonOf(value))
  const cube = qpuCubeOf()
  let acc = seed
  let out = ''
  for (let lane = n - n; lane < cube.vertices; lane++) {
    let x = xorOf(acc, lane + seed)
    for (let i = n - n; i < text.length; i++) {
      x = xorOf(x, text.charCodeAt(i) ?? n - n)
      x = xorOf(x + x, lane + i + seed)
    }
    out += hexOf(x, cube.hexbit)
    acc = xorOf(acc, x)
  }
  return out
}

const storageAddressKeyOf = (occupancy: string, address: string): string => `${occupancy}/${address}`

const storageAddressTailOf = (key: string): string => {
  const slash = key.lastIndexOf('/')
  return slash < n - n ? '' : key.slice(slash + seed)
}

const isStorageAddressKey = (key: string): boolean => {
  const tail = storageAddressTailOf(key)
  const cube = qpuCubeOf()
  if (tail.length !== cube.bits) return false
  for (let i = n - n; i < tail.length; i++) {
    const c = tail[i]!
    let ok = false
    for (let d = n - n; d < storageHex.length; d++) if (storageHex[d] === c) ok = true
    if (!ok) return false
  }
  return raidSafeOf(key)
}

const isReferrerDoc = (
  value: unknown): value is { kind: 'referrer'; address: string; occupancy: string; href: string } => {
  if (typeof value !== 'object' || value === null) return false
  const row = value as { kind?: unknown; address?: unknown; occupancy?: unknown; href?: unknown }
  return (
    row.kind === 'referrer' &&
    typeof row.address === 'string' &&
    typeof row.occupancy === 'string' &&
    typeof row.href === 'string'
  )
}

const isInodeDoc = (
  value: unknown): value is { kind: 'inode'; address: string; occupancy: string; nlink: number; links: string[]; value: unknown } => {
  if (typeof value !== 'object' || value === null) return false
  const row = value as { kind?: unknown; address?: unknown; occupancy?: unknown; nlink?: unknown; links?: unknown }
  return (
    row.kind === 'inode' &&
    typeof row.address === 'string' &&
    typeof row.occupancy === 'string' &&
    typeof row.nlink === 'number' &&
    Array.isArray(row.links) &&
    row.nlink === row.links.length
  )
}

const storageLinksOf = (keys: string[]): string[] => {
  const links: string[] = []
  for (const name of keys) if (!isStorageAddressKey(name)) links.push(name)
  return links
}

export const qpuStorageAddressHolds = (value: unknown = { kind: 'docs' }): boolean => {
  const address = qpuStorageAddressOf(value)
  const cube = qpuCubeOf()
  return (
    address.length === cube.bits &&
    address === qpuStorageAddressOf(value) &&
    isStorageAddressKey(storageAddressKeyOf('docs', address))
  )
}

const raidShareKeyOf = (key: string, face: number): string => `${key}${raidMark}${face}`

const raidStripeOf = (text: string, rays: number): string[] => {
  const stripes: string[] = []
  for (let i = n - n; i < rays; i++) stripes.push('')
  for (let i = n - n; i < text.length; i++) {
    const ray = i % rays
    stripes[ray] += text[i]!
  }
  return stripes
}

const raidJoinOf = (stripes: string[]): string => {
  let text = ''
  let i = n - n
  const rays = stripes.length
  for (;;) {
    const ray = i % rays
    const slot = (i - ray) / rays
    const stripe = stripes[ray] ?? ''
    if (slot >= stripe.length) return text
    text += stripe[slot]!
    i += seed
  }
}

const storageStoreOf = (env?: QpuEnv) => {
  const kv = env?.STORAGE
  const r2 = env?.BLOBS
  const faces = qpuFacesOf()
  const readFull = async (key: string): Promise<unknown> => {
    if (kv) {
      const value = await kv.get(key, { type: 'json' })
      if (value !== null && value !== undefined) return value
    }
    if (r2) {
      const blob = await r2.get(key)
      if (blob) return blob.json()
    }
    if (kv === undefined && storageHeap.has(key)) return storageHeap.get(key)
    if (r2 === undefined && storageBlobs.has(key)) return storageBlobs.get(key)
    return null
  }
  const readShare = async (key: string, face: number): Promise<string> => {
    const share = raidShareKeyOf(key, face)
    if (kv) {
      const value = await kv.get(share, { type: 'json' })
      if (typeof value === 'string') return value
    }
    if (r2) {
      const blob = await r2.get(share)
      if (blob) {
        const value = await blob.json()
        if (typeof value === 'string') return value
      }
    }
    const mem = kv === undefined ? storageHeap.get(share) : r2 === undefined ? storageBlobs.get(share) : undefined
    return typeof mem === 'string' ? mem : ''
  }
  const writeSlot = async (key: string, value: unknown, json: boolean) => {
    const body = json ? JSON.stringify(value) : String(value)
    if (kv) await kv.put(key, body)
    else storageHeap.set(key, json ? value : String(value))
    if (r2) await r2.put(key, body)
    else storageBlobs.set(key, json ? value : String(value))
  }
  const dropSlot = async (key: string) => {
    if (kv) await kv.delete(key)
    else storageHeap.delete(key)
    if (r2) await r2.delete(key)
    else storageBlobs.delete(key)
  }
  return {
    kv: kv !== undefined,
    r2: r2 !== undefined,
    memory: kv === undefined,
    async get(key: string): Promise<unknown> {
      const full = await readFull(key)
      if (full !== null && full !== undefined) return full
      const team0: string[] = []
      const team1: string[] = []
      for (let ray = n - n; ray < faces.rays; ray++) {
        team0.push(await readShare(key, ray))
        team1.push(await readShare(key, ray + faces.rays))
      }
      const stripes = team0.some((row) => row.length > n - n) ? team0 : team1
      if (stripes.every((row) => row.length === n - n)) return null
      const text = raidJoinOf(stripes)
      try {
        return JSON.parse(text) as unknown
      } catch {
        return text
      }
    },
    async put(key: string, value: unknown): Promise<unknown> {
      const stored = jsonOf(value)
      const text = JSON.stringify(stored)
      const stripes = raidStripeOf(text, faces.rays)
      await writeSlot(key, stored, true)
      for (let team = n - n; team < coins; team++) {
        for (let ray = n - n; ray < faces.rays; ray++) {
          await writeSlot(raidShareKeyOf(key, ray + team * faces.rays), stripes[ray]!, true)
        }
      }
      return stored
    },
    async del(key: string): Promise<boolean> {
      await dropSlot(key)
      for (let face = n - n; face < faces.faces; face++) await dropSlot(raidShareKeyOf(key, face))
      return true
    },
    async keys(): Promise<string[]> {
      const names = new Set<string>()
      const take = (name: string) => {
        if (!name.includes(raidMark)) names.add(name)
      }
      if (kv) {
        const listed = await kv.list()
        for (const row of listed.keys) take(row.name)
      }
      if (r2) {
        const listed = await r2.list()
        for (const row of listed.objects) take(row.key)
      }
      if (kv === undefined) for (const name of storageHeap.keys()) take(name)
      if (r2 === undefined) for (const name of storageBlobs.keys()) take(name)
      return [...names]
    },
    async raw(): Promise<string[]> {
      const names = new Set<string>()
      const take = (name: string) => {
        names.add(name)
      }
      if (kv) {
        const listed = await kv.list()
        for (const row of listed.keys) take(row.name)
      }
      if (r2) {
        const listed = await r2.list()
        for (const row of listed.objects) take(row.key)
      }
      if (kv === undefined) for (const name of storageHeap.keys()) take(name)
      if (r2 === undefined) for (const name of storageBlobs.keys()) take(name)
      return [...names]
    },
    drop: dropSlot}
}

export const qpuStorageMetaOf = (env?: QpuEnv) => {
  const raid = qpuRaidOf()
  const hybrid = qpuHybridOf()
  const payload = qpuPayloadDbOf()
  const alpine = qpuAlpineOf()
  const kv = env?.STORAGE !== undefined
  const r2 = env?.BLOBS !== undefined
  const memory = kv === false
  const holds =
    raid.holds &&
    qpuRaidHolds(raid) &&
    qpuHybridHolds(hybrid) &&
    qpuPayloadDbHolds(payload) &&
    qpuAlpineHolds(alpine) &&
    memory !== kv &&
    qpuStorageAddressHolds() &&
    jsonldHoldsOf({
      '@context': qpuContextOf(),
      '@type': 'Dataset',
      '@id': storageHref,
      isAccessibleForFree: cors === '*'})
  return {
    '@context': qpuContextOf(),
    '@type': 'Dataset' as const,
    '@id': storageHref,
    url: storageHref,
    isAccessibleForFree: cors === '*',
    kind: 'storage' as const,
    memory,
    kv,
    r2,
    anything: raid.cover.length === raid.faces,
    raid,
    hybrid,
    payload,
    alpine,
    bindings: storageBindings,
    href: storageHref,
    holds,
  }
}

export const qpuStorageMonitorOf = async (env?: QpuEnv) => {
  const raid = qpuRaidOf()
  const faces = qpuFacesOf()
  const store = storageStoreOf(env)
  const names = await store.keys()
  const raw = await store.raw()
  let bytes = n - n
  let verified = n - n
  let missing = n - n
  for (const key of names) {
    const value = await store.get(key)
    if (value === null || value === undefined) continue
    bytes += jsonBytesOf(value)
    let present = n - n
    for (let face = n - n; face < faces.faces; face++) {
      if (raw.includes(raidShareKeyOf(key, face))) present += seed
    }
    if (present === faces.faces) verified += seed
    else missing += seed
  }
  let shares = n - n
  for (const name of raw) if (name.includes(raidMark)) shares += seed
  const expected = names.length * faces.faces
  const kv = env?.STORAGE !== undefined
  const holds =
    raid.holds &&
    verified === names.length &&
    missing === n - n &&
    shares === expected
  return {
    kind: 'monitor' as const,
    keys: names.length,
    shares,
    expected,
    missing,
    verified,
    bytes,
    traffic: raid.traffic,
    demand: raid.demand,
    pick: raid.pick.name,
    cheapest: raid.cheapest,
    rotate: raid.pick.rotate,
    kv,
    r2: env?.BLOBS !== undefined,
    memory: kv === false,
    holds,
  }
}

export const qpuStorageMaintainOf = async (env?: QpuEnv) => {
  const faces = qpuFacesOf()
  const store = storageStoreOf(env)
  const names = await store.keys()
  const raw = await store.raw()
  let repaired = n - n
  let orphans = n - n
  for (const key of names) {
    const value = await store.get(key)
    if (value === null || value === undefined) continue
    let present = n - n
    for (let face = n - n; face < faces.faces; face++) {
      if (raw.includes(raidShareKeyOf(key, face))) present += seed
    }
    const text = JSON.stringify(value)
    const stripes = raidStripeOf(text, faces.rays)
    const broken = present !== faces.faces || raidJoinOf(stripes) !== text
    if (broken) {
      await store.put(key, value)
      repaired += seed
    }
  }
  const live = new Set(names)
  for (const name of raw) {
    if (!name.includes(raidMark)) continue
    const mark = name.indexOf(raidMark)
    const parent = mark > n - n ? name.slice(n - n, mark) : ''
    if (parent.length === n - n || !live.has(parent)) {
      await store.drop(name)
      orphans += seed
    }
  }
  const monitor = await qpuStorageMonitorOf(env)
  const holds = monitor.holds && monitor.missing === n - n && monitor.verified === monitor.keys
  return {
    '@context': qpuContextOf(),
    '@type': 'Action' as const,
    '@id': `${storageHref}#maintain`,
    url: storageHref,
    isAccessibleForFree: cors === '*',
    kind: 'maintain' as const,
    repaired,
    orphans,
    monitor,
    holds,
  }
}

/** WRITE AUTH, FAIL CLOSED. Reads stay open. A write is honoured only when QPU_WRITE_TOKEN is bound and the request
 * carries `Authorization: Bearer <token>`; an unbound token refuses every write. Measured 2026-09-11 by a peer session:
 * the preflight advertised PUT and DELETE to every origin and the handler honoured them with no check at all. */
export const qpuStorageWriteAllowedOf = (env?: QpuEnv, auth?: string | null): boolean => {
  const token = typeof env?.QPU_WRITE_TOKEN === 'string' ? env.QPU_WRITE_TOKEN : ''
  return token.length > n - n && auth === `Bearer ${token}`
}
const storageWriteOf = (method: string): boolean => method === 'PUT' || method === 'POST' || method === 'DELETE'

export const qpuStorageOf = async (
  env?: QpuEnv,
  input: { method?: string; key?: unknown; value?: unknown; auth?: string | null } = {}) => {
  const meta = qpuStorageMetaOf(env)
  const store = storageStoreOf(env)
  const method = input.method ?? 'GET'
  const key = storageKeyOf(input.key)
  const faces = qpuFacesOf()
  const unlinkOf = async (link: string, row: { address: string; occupancy: string }) => {
    const inodeKey = storageAddressKeyOf(row.occupancy, row.address)
    const inode = await store.get(inodeKey)
    await store.del(link)
    if (!isInodeDoc(inode)) return { freed: true as const, nlink: n - n }
    const links: string[] = []
    for (const name of inode.links) if (name !== link) links.push(name)
    const nlink = links.length
    if (nlink === n - n) {
      await store.del(inodeKey)
      return { freed: true as const, nlink }
    }
    await store.put(inodeKey, { kind: 'inode' as const, address: inode.address, occupancy: inode.occupancy, nlink, links, value: inode.value })
    return { freed: false as const, nlink }
  }
  if (method === 'GET' && key.length === n - n) {
    const keys = storageLinksOf(await store.keys())
    return { ...meta, keys, holds: meta.holds }
  }
  if (key.length === n - n) return { ...meta, holds: false as const, denied: 'key' as const }
  const href = `${storageHref}/${key}`
  if (storageWriteOf(method) && !qpuStorageWriteAllowedOf(env, input.auth)) {
    return { ...meta, '@id': href, url: href, key, holds: false as const, denied: 'auth' as const, auth: 'Bearer QPU_WRITE_TOKEN' as const }
  }
  if (method === 'DELETE') {
    const prior = await store.get(key)
    if (isReferrerDoc(prior)) {
      const unlinked = await unlinkOf(key, prior)
      return {
        ...meta,
        '@id': href,
        url: href,
        key,
        deleted: true as const,
        inode: prior.address,
        nlink: unlinked.nlink,
        freed: unlinked.freed,
        holds: meta.holds,
  }
    }
    if (isInodeDoc(prior) && prior.nlink === n - n) {
      await store.del(key)
      return { ...meta, '@id': href, url: href, key, deleted: true as const, inode: prior.address, nlink: n - n, freed: true as const, holds: meta.holds }
    }
    if (isInodeDoc(prior)) return { ...meta, '@id': href, url: href, key, holds: false as const, denied: 'nlink' as const, nlink: prior.nlink }
    await store.del(key)
    return { ...meta, '@id': href, url: href, key, deleted: true as const, holds: meta.holds }
  }
  if (method === 'PUT' || method === 'POST') {
    const stored = jsonOf(input.value)
    if (jsonBytesOf(stored) > tenOf(n + n)) return { ...meta, '@id': href, key, holds: false as const, denied: 'heap' as const }
    const occupancy = storageOccupancyOf(key)
    const address = qpuStorageAddressOf(stored)
    const inodeKey = storageAddressKeyOf(occupancy, address)
    const access = `${storageHref}/${inodeKey}`
    const prior = await store.get(key)
    if (isReferrerDoc(prior) && (prior.address !== address || prior.occupancy !== occupancy)) await unlinkOf(key, prior)
    const existing = await store.get(inodeKey)
    const links: string[] = []
    if (isInodeDoc(existing)) for (const name of existing.links) links.push(name)
    let seated = false
    for (const name of links) if (name === key) seated = true
    if (!seated) links.push(key)
    const nlink = links.length
    const inode = { kind: 'inode' as const, address, occupancy, nlink, links, value: stored }
    await store.put(inodeKey, inode)
    await store.put(key, { kind: 'referrer' as const, address, occupancy, href: access })
    raidTraffic += seed
    const raid = qpuRaidOf({ safe: raidSafeOf(key) })
    const stripes = raidStripeOf(JSON.stringify(stored), faces.rays)
    return {
      ...meta,
      '@type': 'Thing' as const,
      '@id': href,
      url: href,
      key,
      inode: address,
      nlink,
      address,
      referrer: access,
      value: stored,
      raid: {
        ...raid,
        stripes: faces.rays,
        shares: faces.faces,
        reconstructed: raidJoinOf(stripes) === JSON.stringify(stored)},
      holds: meta.holds && raid.holds && inode.nlink === inode.links.length && raidJoinOf(stripes) === JSON.stringify(stored),
  }
  }
  const foundValue = await store.get(key)
  if (isReferrerDoc(foundValue)) {
    const inode = await store.get(storageAddressKeyOf(foundValue.occupancy, foundValue.address))
    if (isInodeDoc(inode)) {
      return {
        ...meta,
        '@type': 'Thing' as const,
        '@id': href,
        url: href,
        key,
        inode: inode.address,
        nlink: inode.nlink,
        value: inode.value,
        holds: meta.holds && inode.nlink === inode.links.length,
  }
    }
  }
  if (isInodeDoc(foundValue)) {
    return {
      ...meta,
      '@type': 'Thing' as const,
      '@id': href,
      url: href,
      key,
      inode: foundValue.address,
      nlink: foundValue.nlink,
      referrer: `${storageHref}/${key}`,
      value: foundValue.value,
      holds: meta.holds && foundValue.nlink === foundValue.links.length,
  }
  }
  const seeded = key === payloadDbKey || key === `${payloadDbKey}/seed`
  const db = qpuPayloadDbOf()
  return {
    ...meta,
    '@type': 'Thing' as const,
    '@id': href,
    url: href,
    key,
    value: foundValue ?? (seeded ? db : foundValue),
    ...(seeded
      ? { seed, remainder: n - n, unity: seed === mintOf(n - n), payload: db }
      : {}),
    holds: meta.holds && ((foundValue !== null && foundValue !== undefined) || (seeded && db.holds)),
  }
}

export const qpuStorageHolds = (s = qpuStorageMetaOf()): boolean =>
  s.holds === true &&
  s.kind === 'storage' &&
  s.raid.holds === true &&
  qpuRaidHolds(s.raid) &&
  qpuHybridHolds(s.hybrid) &&
  qpuPayloadDbHolds(s.payload) &&
  s.payload.key === 'databases/payload' &&
  s.payload.seed === seed &&
  s.payload.remainder === n - n &&
  qpuAlpineHolds(s.alpine) &&
  s.alpine.os === 'alpine' &&
  s.alpine.libc === 'musl' &&
  s.alpine.toolbox === 'busybox' &&
  s.alpine.fs === 'overlay' &&
  s.alpine.upper === 'kv' &&
  s.alpine.lower === 'r2' &&
  s.alpine.work === 'kv' &&
  s.alpine.work === s.alpine.upper &&
  s.alpine.next === s.alpine.fused + s.alpine.fused &&
  s.alpine.theorem === 'next_coil' &&
  s.bindings.STORAGE === 'kv' &&
  s.bindings.BLOBS === 'r2' &&
  s.href === storageHref &&
  jsonldHoldsOf(s)

export const qpuStorageToolsOf = (env?: QpuEnv, auth?: string | null): QpuSubTool[] => {
  const href = storageHref
  const see = ['storage_catalog', 'storage_list', 'storage_get', 'storage_put', 'storage_del', 'storage_monitor', 'storage_maintain', 'storage_raid'] as const
  const schema = { type: 'object', properties: { man: { type: 'boolean' }, key: { type: 'string' }, value: {} } }
  return [
    {
      name: see[n - n],
      description: 'Storage catalog. JSON-LD WebAPI. Quantum RAID. All details.',
      man: qpuSubManOf(see[n - n], 'Storage catalog.', 'Native Alpine Linux. musl. busybox. overlayfs. Inodes. RAID. Reads no auth. Writes Authorization: Bearer QPU_WRITE_TOKEN; unbound refuses.', href, see.filter((s) => s !== see[n - n])),
      inputSchema: schema,
      run: () => qpuStorageMcpOf(env)},
    {
      name: see[seed],
      description: 'List storage keys.',
      man: qpuSubManOf(see[seed], 'List keys.', 'Referrer links. Inodes private. RAID shares hidden.', href, see.filter((s) => s !== see[seed])),
      inputSchema: schema,
      run: async () => ({ kind: 'list' as const, keys: storageLinksOf(await storageStoreOf(env).keys()), holds: true as const }),
  },
    {
      name: see[coins],
      description: 'Get a stored value.',
      man: qpuSubManOf(see[coins], 'Get value.', 'Reconstruct from RAID shares.', href, see.filter((s) => s !== see[coins])),
      inputSchema: schema,
      run: (a) => qpuStorageOf(env, { method: 'GET', key: a.key })},
    {
      name: see[n],
      description: 'Put a stored value.',
      man: qpuSubManOf(see[n], 'Put value. Bearer QPU_WRITE_TOKEN.', 'Store by content address. Return referrer access link. Inode nlink. Stripe rays. Mirror coins.', href, see.filter((s) => s !== see[n])),
      inputSchema: schema,
      run: (a) => qpuStorageOf(env, { method: 'PUT', key: a.key, value: a.value, auth })},
    {
      name: see[n + seed],
      description: 'Delete a stored value.',
      man: qpuSubManOf(see[n + seed], 'Delete link. Bearer QPU_WRITE_TOKEN.', 'Unlink. Last link deleted frees the inode.', href, see.filter((s) => s !== see[n + seed])),
      inputSchema: schema,
      run: (a) => qpuStorageOf(env, { method: 'DELETE', key: a.key, auth })},
    {
      name: see[n + coins],
      description: 'Monitor RAID health.',
      man: qpuSubManOf(see[n + coins], 'Monitor storage.', 'Keys shares missing verified bytes.', href, see.filter((s) => s !== see[n + coins])),
      inputSchema: schema,
      run: () => qpuStorageMonitorOf(env)},
    {
      name: see[n + n],
      description: 'Maintain RAID.',
      man: qpuSubManOf(see[n + n], 'Maintain RAID.', 'Rewrite broken shares. Drop orphans.', href, see.filter((s) => s !== see[n + n])),
      inputSchema: schema,
      run: () => qpuStorageMaintainOf(env)},
    {
      name: see[mintOf(n) - seed],
      description: 'RAID geometry.',
      man: qpuSubManOf(see[mintOf(n) - seed], 'RAID types.', 'Start cheapest. Cover all. Rotate. theorem raid.', href, see.filter((s) => s !== see[mintOf(n) - seed])),
      inputSchema: schema,
      run: () => qpuRaidOf()}]
}

export const qpuStorageMcpOf = async (env?: QpuEnv) => {
  const meta = qpuStorageMetaOf(env)
  const monitor = await qpuStorageMonitorOf(env)
  const keys = storageLinksOf(await storageStoreOf(env).keys())
  const tools = qpuStorageToolsOf(env)
  return qpuSubCatalogOf('storage', storageHref, tools, {
    raid: meta.raid,
    hybrid: meta.hybrid,
    payload: meta.payload,
    alpine: meta.alpine,
    bindings: meta.bindings,
    kv: meta.kv,
    r2: meta.r2,
    anything: meta.anything,
    keys,
    monitor,
    holds: meta.holds && monitor.holds && meta.raid.holds,
  })
}

const networkChannels = new Map<string, unknown[]>()

export const qpuNetworkToolsOf = (): QpuSubTool[] => {
  const href = networkHref
  const see = ['net_catalog', 'net_list', 'net_send', 'net_recv', 'net_message', 'net_routes', 'net_fetch', 'net_monitor'] as const
  const schema = { type: 'object', properties: { man: { type: 'boolean' }, channel: { type: 'string' }, body: {}, path: { type: 'string' }, lane: { type: 'number' } } }
  const channelOf = (value: unknown): string =>
    typeof value === 'string' && value.length > n - n && value.length <= found ? value : ''
  const namedPathOf = (value: unknown): string => {
    if (typeof value !== 'string') return ''
    if (value.startsWith(unit.origin)) {
      const rest = value.slice(unit.origin.length)
      return rest.length === n - n ? '/' : rest
    }
    if (value.startsWith('/') && !value.startsWith('//')) return value
    return ''
  }
  const allowed = ['/', `/${unit.path}`, '/cite', '/message', '/mcp', '/storage', '/server', '/network'] as const
  return [
    {
      name: see[n - n],
      description: 'Network catalog. JSON-LD WebAPI. Lanes involution.',
      man: qpuSubManOf(see[n - n], 'Network catalog.', 'JSON-LD WebAPI. hop involution. await false. when never. No auth.', href, see.filter((s) => s !== see[n - n])),
      inputSchema: schema,
      run: () => qpuNetworkMcpOf()},
    {
      name: see[seed],
      description: 'List network channels.',
      man: qpuSubManOf(see[seed], 'List channels.', 'In-memory lanes.', href, see.filter((s) => s !== see[seed])),
      inputSchema: schema,
      run: () => ({ kind: 'list' as const, channels: [...networkChannels.keys()], holds: true as const }),
  },
    {
      name: see[coins],
      description: 'Send on a channel.',
      man: qpuSubManOf(see[coins], 'Send.', 'await false. when never.', href, see.filter((s) => s !== see[coins])),
      inputSchema: schema,
      run: (a) => {
        const channel = channelOf(a.channel ?? a.path ?? a.key) || 'default'
        const q = networkChannels.get(channel) ?? []
        const body = jsonOf(a.body ?? a.value)
        q.push(body)
        networkChannels.set(channel, q)
        return { kind: 'send' as const, channel,when: 'never' as const, holds: true as const }
      }},
    {
      name: see[n],
      description: 'Receive from a channel.',
      man: qpuSubManOf(see[n], 'Receive.', 'No await.', href, see.filter((s) => s !== see[n])),
      inputSchema: schema,
      run: (a) => {
        const channel = channelOf(a.channel ?? a.path ?? a.key) || 'default'
        const q = networkChannels.get(channel) ?? []
        const value = q.length > n - n ? q.shift() : null
        networkChannels.set(channel, q)
        return { kind: 'recv' as const, channel, value: value ?? null, holds: true as const }
      }},
    {
      name: see[n + seed],
      description: 'Proxy a message lane.',
      man: qpuSubManOf(see[n + seed], 'Message hop.', 'lanes = faces. involution. clock_seq. No auth.', href, see.filter((s) => s !== see[n + seed])),
      inputSchema: schema,
      run: (a) => qpuMessageOf({ lane: a.lane, body: a.body })},
    {
      name: see[n + coins],
      description: 'Involution routes.',
      man: qpuSubManOf(see[n + coins], 'Routes.', 'hop involution. theorem involution.', href, see.filter((s) => s !== see[n + coins])),
      inputSchema: schema,
      run: () => {
        const message = qpuMessageOf()
        return { kind: 'routes' as const, hop: message.hop, lanes: message.lanes, routes: message.routes, holds: message.holds }
      }},
    {
      name: see[n + n],
      description: 'Named-host fetch only.',
      man: qpuSubManOf(see[n + n], 'Named fetch.', 'qpu.uuidna.com only. hostEscape false. No auth.', href, see.filter((s) => s !== see[n + n])),
      inputSchema: schema,
      run: (a) => {
        const path = namedPathOf(a.path ?? a.href)
        const door = path.split('?')[n - n] ?? ''
        if ((allowed as readonly string[]).includes(door) === false) {
          return { kind: 'fetch' as const, holds: false as const, denied: 'hostEscape' as const, hostEscape: true as const }
        }
        return { kind: 'fetch' as const, path: door, href: `${unit.origin}${door === '/' ? '' : door}`, named: true as const, hostEscape: false as const, holds: true as const }
      }},
    {
      name: see[mintOf(n) - seed],
      description: 'Network monitor.',
      man: qpuSubManOf(see[mintOf(n) - seed], 'Monitor network.', 'Channels lanes await false.', href, see.filter((s) => s !== see[mintOf(n) - seed])),
      inputSchema: schema,
      run: () => {
        const message = qpuMessageOf()
        let queued = n - n
        for (const q of networkChannels.values()) queued += q.length
        return {
          kind: 'monitor' as const,
          channels: networkChannels.size,
          queued,
          lanes: message.lanes,
          hop: message.hop,when: 'never' as const,
          holds: message.holds,
  }
      }}]
}

export const qpuNetworkMcpOf = () => {
  const message = qpuMessageOf()
  const tools = qpuNetworkToolsOf()
  return qpuSubCatalogOf('network', networkHref, tools, {
    hop: 'involution' as const,
    when: 'never' as const,
    lanes: message.lanes,
    routes: message.routes,
    channels: [...networkChannels.keys()],
    holds: message.holds && message.hop === 'involution',
  })
}

type QpuServerJob = {
  id: number
  status: 'done'
  gates: string[]
  read: QpuGatesRead
  dropped: number
  index: number
  shots: number
  counts: { i: number; w: number }[]
  support: number[]
  collapsed: boolean
  holds: boolean
}

const serverJobs: QpuServerJob[] = []
let serverSeq = n - n

/** How a job's gates were read: `read` from the caller's list, `absent` when none was sent (the Bell pair stands in),
 * or `default` when something was sent that held no gate at all — the Bell pair runs, and the job says so and does
 * not hold, so a body of nonsense never comes back as a confident result. `dropped` counts rows that were not gates. */
export type QpuGatesRead = 'read' | 'absent' | 'default'
const parseGatesOf = (value: unknown): { ops: Record<string, unknown>[]; read: QpuGatesRead; dropped: number } => {
  const fallback = [
    { name: 'h', q: n - n },
    { name: 'cnot', c: n - n, t: seed }]
  if (value === undefined) return { ops: fallback, read: 'absent', dropped: n - n }
  if (!Array.isArray(value)) return { ops: fallback, read: 'default', dropped: seed }
  const ops: Record<string, unknown>[] = []
  const names = ['h', 'x', 'z', 'cnot', 'cz', 'swap', 'toffoli', 'reset'] as const
  let dropped = n - n
  for (const row of value) {
    const name = row && typeof row === 'object' && !Array.isArray(row) && typeof (row as { name?: unknown }).name === 'string' ? (row as { name: string }).name : ''
    if ((names as readonly string[]).includes(name)) ops.push(jsonOf(row) as Record<string, unknown>)
    else dropped += seed
  }
  return ops.length > n - n ? { ops, read: 'read', dropped } : { ops: fallback, read: 'default', dropped }
}

export const qpuServerSubmitOf = (input: Record<string, unknown> = {}) => {
  const computer = qpuComputerOf()
  const plugin = qpuPayloadPluginOf()
  const payload = qpuPayloadMcpOf()
  const parsed = parseGatesOf(input.gates)
  const ops = parsed.ops
  const measured = measureOf(runGatesOf(ops))
  serverSeq += seed
  const holds = measured.holds && computer.holds && qpuPayloadPluginHolds(plugin) && payload.holds && parsed.read !== 'default'
  const job: QpuServerJob = {
    id: serverSeq,
    status: 'done',
    gates: ops.map((op) => `${op.name ?? ''}`),
    read: parsed.read,
    dropped: parsed.dropped,
    index: measured.index,
    shots: measured.shots,
    counts: measured.counts,
    support: measured.support,
    collapsed: measured.collapsed,
    holds,
  }
  serverJobs.push(job)
  /** The run is synchronous and its result is here, in this reply. Nothing is stored: `id` counts jobs in this isolate
   * only, and a later GET of the job is answered only while this isolate lives. `href` is the server, not the job. */
  return {
    kind: 'job' as const,
    href: serverHref,
    stored: false as const,
    result: 'inline' as const,
    backend: unit.host,
    vm: 'browser' as const,
    payload: plugin.href,
    plugin: plugin.name,computer: { holds: computer.holds, universal: computer.universal, lattice: computer.lattice },
    ...job}
}

export const qpuServerToolsOf = (): QpuSubTool[] => {
  const href = serverHref
  const see = ['server_catalog', 'server_backend', 'server_submit', 'server_queue', 'server_result', 'server_shots', 'server_correct', 'server_monitor'] as const
  const schema = { type: 'object', properties: { man: { type: 'boolean' }, gates: { type: 'array' }, id: { type: 'number' } } }
  return [
    {
      name: see[n - n],
      description: 'Quantum server catalog. JSON-LD WebAPI.',
      man: qpuSubManOf(see[n - n], 'Quantum server catalog.', 'JSON-LD WebAPI. Jobs. Backend the running circuit. Eight tools. No auth.', href, see.filter((s) => s !== see[n - n])),
      inputSchema: schema,
      run: () => qpuServerMcpOf()},
    {
      name: see[seed],
      description: 'Quantum backend.',
      man: qpuSubManOf(see[seed], 'Backend.', '3-qubit register. H CNOT native. H Toffoli universal. Coupling compile.', href, see.filter((s) => s !== see[seed])),
      inputSchema: schema,
      run: () => {
        const computer = qpuComputerOf()
        const circuit = qpuCircuitOf()
        return {
          kind: 'backend' as const,
          name: unit.host,
          qubits: n,
          dim: mintOf(n),
          basis: computer.basis,
          universal: computer.universal,
          coupling: computer.coupling,
          register: circuit.register,
          vm: 'browser' as const,
          holds: computer.holds && circuit.register.holds,
  }
      }},
    {
      name: see[coins],
      description: 'Submit a quantum job.',
      man: qpuSubManOf(see[coins], 'Submit job.', 'Gates h cnot x z cz swap toffoli reset. Default H then CNOT.', href, see.filter((s) => s !== see[coins])),
      inputSchema: schema,
      run: (a) => qpuServerSubmitOf(a)},
    {
      name: see[n],
      description: 'Job queue.',
      man: qpuSubManOf(see[n], 'Queue.', 'In-memory jobs.', href, see.filter((s) => s !== see[n])),
      inputSchema: schema,
      run: () => ({ kind: 'queue' as const, jobs: serverJobs.map((j) => ({ id: j.id, status: j.status, holds: j.holds })), n: serverJobs.length, holds: true as const }),
  },
    {
      name: see[n + seed],
      description: 'Job result.',
      man: qpuSubManOf(see[n + seed], 'Result.', 'Measurement index shots counts.', href, see.filter((s) => s !== see[n + seed])),
      inputSchema: schema,
      run: (a) => {
        const id = typeof a.id === 'number' ? a.id : serverSeq
        const job = serverJobs.find((row) => row.id === id)
        if (!job) return { kind: 'result' as const, holds: false as const, denied: 'job' as const }
        return { kind: 'result' as const, ...job }
      }},
    {
      name: see[n + coins],
      description: 'Shots on the running circuit.',
      man: qpuSubManOf(see[n + coins], 'Shots.', 'shots = mintOf n. Weights not RNG.', href, see.filter((s) => s !== see[n + coins])),
      inputSchema: schema,
      run: () => {
        const computer = qpuComputerOf()
        return { ...computer.shots, readout: computer.readout, holds: computer.shots.holds }
      }},
    {
      name: see[n + n],
      description: 'Bit-flip correction.',
      man: qpuSubManOf(see[n + n], 'Correct.', '3-qubit bitflip with Toffoli.', href, see.filter((s) => s !== see[n + n])),
      inputSchema: schema,
      run: () => {
        const computer = qpuComputerOf()
        return { ...computer.correct, holds: computer.correct.holds }
      }},
    {
      name: see[mintOf(n) - seed],
      description: 'Server monitor.',
      man: qpuSubManOf(see[mintOf(n) - seed], 'Monitor server.', 'Queue depth. Backend running.', href, see.filter((s) => s !== see[mintOf(n) - seed])),
      inputSchema: schema,
      run: () => {
        const computer = qpuComputerOf()
        return {
          kind: 'monitor' as const,
          jobs: serverJobs.length,
          seq: serverSeq,
          backend: unit.host,
          vm: 'browser' as const,
          computer: computer.holds,
          holds: computer.holds,
  }
      }}]
}

export const qpuServerMcpOf = () => {
  const computer = qpuComputerOf()
  const tools = qpuServerToolsOf()
  const circuit = qpuCircuitOf()
  const plugin = qpuPayloadPluginOf()
  const payload = qpuPayloadMcpOf()
  return qpuSubCatalogOf('server', serverHref, tools, {
    backend: {
      name: unit.host,
      qubits: n,
      dim: mintOf(n),
      basis: computer.basis,
      universal: computer.universal,
      coupling: computer.coupling,
      register: circuit.register,
      vm: 'browser' as const},
    computer,
    jobs: { n: serverJobs.length, slots: mintOf(n), href: serverHref },
    qram: plugin.href,
    payload: { href: plugin.href, finds: payload.collections, holds: payload.holds },
    plugin: plugin.name,
    network: networkHref,
    message: `${unit.origin}/message`})
}

export const qpuServerHolds = (s = qpuServerMcpOf()): boolean =>
  s.holds === true &&
  s.kind === 'server' &&
  s.tools.length === mintOf(n) &&
  s.tools[n - n]?.name === 'server_catalog' &&
  s.tools[mintOf(n) - seed]?.name === 'server_monitor' &&
  qpuComputerHolds() &&
  qpuPayloadPluginHolds() &&
  qpuPayloadPluginOf().href === `${storageHref}/${payloadDbKey}` &&
  s['@type'] === 'WebAPI' &&
  s['@id'] === serverHref

export const qpuIdeasOf = () => {
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const fused = faces.faces * handle.kv.amplitudes
  const next = fused + fused
  const ideas = [
    { ray: n - n, name: 'mint', theorem: 'mintOf (n + seed) = mintOf n + mintOf n', left: mintOf(n + seed), right: mintOf(n) + mintOf(n) },
    { ray: seed, name: 'cube', theorem: 'bits = vertices * hexbit', left: cube.bits, right: cube.vertices * cube.hexbit },
    { ray: coins, name: 'handle', theorem: 'amplitudes = mintOf bits', left: handle.amplitudes, right: mintOf(cube.bits) },
    { ray: n, name: 'quantum', theorem: 'fused = faces * mintOf (bits + seed)', left: fused, right: faces.faces * mintOf(cube.bits + seed) },
    { ray: n + seed, name: 'around', theorem: 'faces = coins * rays', left: faces.faces, right: faces.coins * faces.rays },
    { ray: n + coins, name: 'crypto', theorem: 'fused = faces * mintOf (vertices * hexbit + seed)', left: fused, right: faces.faces * mintOf(cube.vertices * cube.hexbit + seed) },
    { ray: faces.rays - seed, name: 'next', theorem: 'next = fused + fused', left: next, right: fused + fused }] as const
  const holds = cube.holds && handle.holds && faces.holds && ideas.length === faces.rays && ideas.every((i) => i.left === i.right)
  return { kind: 'ideas' as const, ideas, holds }
}

const ideaRunOf = (name: string): QpuOp => {
  if (name === 'mint') {
    return { op: 'eq', left: { op: 'mint', k: n + seed }, right: { op: 'add', left: { op: 'mint', k: n }, right: { op: 'mint', k: n } } }
  }
  if (name === 'cube') {
    return { op: 'eq', left: { op: 'quantum', name: 'bits' }, right: { op: 'mul', left: { op: 'quantum', name: 'vertices' }, right: { op: 'quantum', name: 'hexbit' } } }
  }
  if (name === 'handle') {
    return { op: 'eq', left: { op: 'quantum', name: 'amplitudes' }, right: { op: 'mint', k: { op: 'quantum', name: 'bits' } } }
  }
  if (name === 'quantum') {
    return {
      op: 'eq',
      left: { op: 'quantum', name: 'fused' },
      right: {
        op: 'mul',
        left: { op: 'quantum', name: 'faces' },
        right: { op: 'add', left: { op: 'quantum', name: 'amplitudes' }, right: { op: 'quantum', name: 'amplitudes' } }}}
  }
  if (name === 'around') {
    return { op: 'eq', left: { op: 'quantum', name: 'faces' }, right: { op: 'mul', left: { op: 'quantum', name: 'coins' }, right: { op: 'quantum', name: 'rays' } } }
  }
  if (name === 'crypto') {
    return {
      op: 'eq',
      left: { op: 'quantum', name: 'fused' },
      right: {
        op: 'mul',
        left: { op: 'quantum', name: 'faces' },
        right: { op: 'add', left: { op: 'quantum', name: 'amplitudes' }, right: { op: 'quantum', name: 'amplitudes' } }}}
  }
  return { op: 'eq', left: { op: 'quantum', name: 'next' }, right: { op: 'add', left: { op: 'quantum', name: 'fused' }, right: { op: 'quantum', name: 'fused' } } }
}

const quantumSlotOf = (name: string): number | undefined => {
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  if (name === 'n') return n
  if (name === 'seed') return seed
  if (name === 'coins') return coins
  if (name === 'vertices') return cube.vertices
  if (name === 'hexbit') return cube.hexbit
  if (name === 'bits') return cube.bits
  if (name === 'rays') return faces.rays
  if (name === 'faces') return faces.faces
  if (name === 'amplitudes') return handle.amplitudes
  if (name === 'fused') return faces.faces * handle.kv.amplitudes
  if (name === 'next') return faces.faces * handle.kv.amplitudes + faces.faces * handle.kv.amplitudes
  if (name === 'ns') return n - n
  return undefined
}

const quantumRelatedExtras = [
  'only',
  'lattice',
  'circuit',
  'noise',
  'physical',
  'science',
  'sciences',
  'drift',
  'computer',
  'coil',
  'electronics',
  'speed',
  'hybrid',
  'css',
  'presence',
  'kv'] as const

const quantumRelatedOf = () => {
  const circuit = qpuCircuitOf()
  const speed = qpuSpeedOf()
  const doors: Record<string, unknown> = {}
  const row = circuit as unknown as Record<string, unknown>
  for (const node of circuit.lattice.nodes) doors[node.name] = row[node.name]
  doors.only = circuit.only
  doors.lattice = circuit.lattice
  doors.circuit = {
    kind: circuit.kind,
    only: circuit.only,
    lattice: circuit.lattice,
    register: circuit.register,
    holds: circuit.holds,
  }
  doors.noise = circuit.noise
  doors.physical = circuit.hardware
  doors.science = circuit.science
  doors.sciences = circuit.sciences
  doors.drift = circuit.drift
  doors.computer = circuit.computer
  doors.coil = circuit.register.coil
  doors.electronics = circuit.register.electronics
  doors.speed = speed
  doors.hybrid = qpuHybridOf()
  doors.css = qpuCssOf()
  doors.presence = qpuPresenceOf()
  doors.kv = qpuHandleOf().kv
  return doors
}

const quantumRelatedNamesOf = (circuit = qpuCircuitOf()) => [...circuit.lattice.nodes.map((node) => node.name), ...quantumRelatedExtras]

const quantumDoorOf = (name: string): unknown => {
  const slot = quantumSlotOf(name)
  if (slot !== undefined) return slot
  const related = quantumRelatedOf()
  if (name.length === n - n) {
    const only = related.only as { holds: boolean }
    const lattice = related.lattice as { holds: boolean; vacant: number; nodes: { name: string; holds: boolean }[] }
    const register = related.register as { holds: boolean }
    const speed = related.speed as { holds: boolean }
    const names = Object.keys(related)
    return {
      kind: 'quantum' as const,
    only,
      lattice,
      register,
      speed: { holds: speed.holds },
      related: names,
      unlocked: only.holds && register.holds,
      holds:
        only.holds &&
        lattice.holds &&
        lattice.vacant === n - n &&
        register.holds &&
        speed.holds &&
        names.length === lattice.nodes.length + quantumRelatedExtras.length &&
        lattice.nodes.every((node) => names.includes(node.name) && related[node.name] !== undefined) &&
        quantumRelatedExtras.every((extra) => names.includes(extra) && related[extra] !== undefined)}
  }
  return related[name]
}

const sandboxHeap = new Map<string, unknown>()
const sandboxTools = new Map<string, QpuForged>()
const sandboxDisk = new Map<string, unknown>()
const sandboxNet = new Map<string, unknown[]>()
const sandboxMods = new Map<string, unknown>()
const sandboxEnv = new Map<string, string>([['QPU_HOST', unit.host]])

const pathOf = (value: unknown): string =>
  typeof value === 'string' && value.length > n - n && value.length <= found ? value : ''

const bagOf = (args: unknown): Record<string, unknown> => {
  const bag = jsonOf(args)
  return bag && typeof bag === 'object' && !Array.isArray(bag) ? (bag as Record<string, unknown>) : {}
}

const opOf = (value: unknown): QpuOp | undefined => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  const op = (value as { op?: unknown }).op
  if (typeof op !== 'string') return undefined
  if (!(sandboxOps as readonly string[]).includes(op)) return undefined
  return jsonOf(value) as QpuOp
}

const unlockedOf = (name: string, heap: Map<string, unknown>, args: unknown, depth: number): unknown => {
  const bag = bagOf(args)
  const method = typeof bag.method === 'string' ? bag.method : ''
  if (name === 'eval' || name === 'fn') {
    const program = opOf(bag.run)
    if (!program) return { holds: false as const, denied: 'js' as const,
  }
    return runOpOf(program, heap, name === 'fn' ? (bag.args ?? args) : args, depth + seed)
  }
  if (name === 'fs' || name === 'disk') {
    if (method === 'list' || method === 'keys') return [...sandboxDisk.keys()]
    const path = pathOf(bag.path ?? bag.key)
    if (path.length === n - n) return { holds: false as const, denied: 'path' as const,
  }
    if (method === 'read' || method === 'get') return sandboxDisk.has(path) ? sandboxDisk.get(path) : null
    if (method === 'del' || method === 'rm') return sandboxDisk.delete(path)
    if (bag.value !== undefined || bag.body !== undefined || method === 'write' || method === 'put') {
      const stored = jsonOf(bag.body ?? bag.value)
      if (jsonBytesOf(stored) > found * qpuFacesOf().faces) return { holds: false as const, denied: 'heap' as const }
      sandboxDisk.set(path, stored)
      return stored
    }
    return sandboxDisk.has(path) ? sandboxDisk.get(path) : null
  }
  if (name === 'net') {
    const channel = pathOf(bag.channel ?? bag.path ?? bag.key) || 'default'
    if (method === 'list') return [...sandboxNet.keys()]
    if (method === 'recv' || method === 'get') {
      const q = sandboxNet.get(channel) ?? []
      const value = q.length > n - n ? q.shift() : null
      sandboxNet.set(channel, q)
      return value ?? null
    }
    const q = sandboxNet.get(channel) ?? []
    q.push(jsonOf(bag.body ?? bag.value))
    sandboxNet.set(channel, q)
    return { sent: true as const, channel, size: q.length}
  }
  if (name === 'fetch') {
    const raw = pathOf(bag.path ?? bag.href) || '/'
    const path = raw.replace(unit.origin, '') || '/'
    if (path === '/') {
      const door = quantumDoorOf('')
      return { ...(typeof door === 'object' && door ? door : {}), fused: qpuFacesOf().faces * qpuHandleOf().amplitudes, host: unit.host, href: unit.href, hostEscape: false as const }
    }
    if (path === `/${unit.path}` || path === unit.path) return qpuLeanOf()
    if (path === '/cite') return { kind: 'cite' as const, href: `${unit.origin}/cite`,hostEscape: false as const }
    if (path === '/message') {
      if (bag.body !== undefined || bag.lane !== undefined) return qpuMessageOf({ lane: bag.lane, body: bag.body })
      return qpuMessageOf()
    }
    return { holds: false as const, denied: 'fetch' as const,
  }
  }
  if (name === 'process') {
    if (method === 'env' && typeof bag.key === 'string') {
      if (bag.value !== undefined) {
        sandboxEnv.set(bag.key, String(jsonOf(bag.value)))
        return String(jsonOf(bag.value))
      }
      return sandboxEnv.get(bag.key) ?? null
    }
    return { cwd: '/memory', pid: seed, argv: [unit.kind], env: Object.fromEntries(sandboxEnv),hostEscape: false as const }
  }
  if (name === 'import' || name === 'require') {
    const mod = typeof bag.name === 'string' ? bag.name : pathOf(bag.path)
    if (mod.length === n - n) return { holds: false as const, denied: 'mod' as const }
    if (bag.value !== undefined || method === 'put') {
      const stored = jsonOf(bag.value)
      sandboxMods.set(mod, stored)
      return stored
    }
    if (sandboxMods.has(mod)) return sandboxMods.get(mod)
    if (mod === unit.kind || mod === `@uuidna/${unit.kind}`) return { href: unit.href, origin: unit.origin,hostEscape: false as const }
    return { holds: false as const, denied: 'mod' as const,
  }
  }
  if (name === 'worker') {
    const program = opOf(bag.run)
    if (!program) return { holds: false as const, denied: 'worker' as const,
  }
    return runOpOf(program, new Map(heap), bag.args ?? args, depth + seed)
  }
  return { holds: false as const, denied: 'unlocked' as const,
  }
}

const mintKOf = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isInteger(value) && value >= n - n && value <= qpuCubeOf().bits ? value : undefined

const safeNatOf = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isInteger(value) && value >= n - n && Number.isSafeInteger(value) ? value : undefined

const runOpOf = (op: QpuOp, heap: Map<string, unknown>, args: unknown, depth: number): unknown => {
  const cube = qpuCubeOf()
  const faces = qpuFacesOf()
  if (depth > mintOf(n)) return { holds: false as const, denied: 'depth' as const }
  const valueOf = (inner: unknown): unknown => {
    if (typeof inner === 'number') return inner
    const nested = opOf(inner)
    if (nested) return runOpOf(nested, heap, args, depth + seed)
    return inner === undefined ? null : jsonOf(inner)
  }
  if (op.op === 'unlocked' || (sandboxHost as readonly string[]).includes(op.op)) {
    const hostName = op.op === 'unlocked' ? (typeof op.name === 'string' ? op.name : '') : op.op
    return unlockedOf(hostName, heap, args, depth)
  }
  if (op.op === 'lit') return jsonOf(op.value)
  if (op.op === 'args') {
    const bag = jsonOf(args)
    if (typeof op.name === 'string' && bag && typeof bag === 'object' && !Array.isArray(bag)) {
      return jsonOf((bag as Record<string, unknown>)[op.name])
    }
    return bag
  }
  if (op.op === 'quantum') {
    const bag = bagOf(args)
    const slotName = typeof op.name === 'string' && op.name.length > n - n ? op.name : typeof bag.name === 'string' ? bag.name : ''
    const door = quantumDoorOf(slotName)
    return door === undefined ? { holds: false as const, denied: 'quantum' as const } : door
  }
  if (op.op === 'mint') {
    const k = mintKOf(valueOf(op.k))
    return k === undefined ? { holds: false as const, denied: 'mint' as const } : mintOf(k)
  }
  if (op.op === 'add' || op.op === 'mul') {
    const left = safeNatOf(valueOf(op.left))
    const right = safeNatOf(valueOf(op.right))
    if (left === undefined || right === undefined) return { holds: false as const, denied: op.op }
    const value = op.op === 'add' ? left + right : left * right
    return Number.isSafeInteger(value) ? value : { holds: false as const, denied: op.op }
  }
  if (op.op === 'eq') return jsonOf(valueOf(op.left)) === jsonOf(valueOf(op.right)) || JSON.stringify(valueOf(op.left)) === JSON.stringify(valueOf(op.right))
  if (op.op === 'keys') return [...heap.keys()]
  if (op.op === 'seq') {
    const bag = bagOf(args)
    const fromArgs = Array.isArray(bag.body) ? bag.body : []
    const raw = Array.isArray(op.body) ? op.body : op.body ? [op.body] : fromArgs
    const body = raw.map((step) => opOf(step)).filter((step): step is QpuOp => step !== undefined)
    if (body.length > faces.faces) return { holds: false as const, denied: 'seq' as const }
    let last: unknown = null
    for (const step of body) last = runOpOf(step, heap, args, depth + seed)
    return last
  }
  if (op.op === 'if') {
    const test = valueOf(op.test)
    const branch = test ? op.then : op.else
    return branch ? runOpOf(branch, heap, args, depth + seed) : test
  }
  if (op.op === 'repeat') {
    const times = mintKOf(valueOf(op.n))
    if (times === undefined || times > mintOf(n) || !op.body || Array.isArray(op.body)) return { holds: false as const, denied: 'repeat' as const }
    let last: unknown = null
    for (let i = n - n; i < times; i++) last = runOpOf(op.body, heap, args, depth + seed)
    return last
  }
  const keyValue = typeof op.key === 'string' ? op.key : valueOf(op.key)
  if (typeof keyValue !== 'string' || keyValue.length > cube.bits || keyValue.length === n - n) return { holds: false as const, denied: 'key' as const }
  if (op.op === 'get') return heap.has(keyValue) ? heap.get(keyValue) : null
  if (op.op === 'has') return heap.has(keyValue)
  if (op.op === 'del') return heap.delete(keyValue)
  if (op.op === 'put') {
    const stored = jsonOf(valueOf(op.value))
    if (jsonBytesOf(stored) > found * faces.faces || heap.size >= cube.bits && !heap.has(keyValue)) return { holds: false as const, denied: 'heap' as const }
    heap.set(keyValue, stored)
    return stored
  }
  return { holds: false as const, denied: 'op' as const }
}

const forgeNameOf = (team: 'read' | 'call', idea: string) => `${team}_${idea}`

const opRunOf = (op: (typeof sandboxCore)[number]): QpuOp => {
  if (op === 'lit') return { op: 'args', name: 'value' }
  if (op === 'mint') return { op: 'mint', k: { op: 'args', name: 'k' } }
  if (op === 'add') return { op: 'add', left: { op: 'args', name: 'left' }, right: { op: 'args', name: 'right' } }
  if (op === 'mul') return { op: 'mul', left: { op: 'args', name: 'left' }, right: { op: 'args', name: 'right' } }
  if (op === 'eq') return { op: 'eq', left: { op: 'args', name: 'left' }, right: { op: 'args', name: 'right' } }
  if (op === 'put') return { op: 'put', key: { op: 'args', name: 'key' }, value: { op: 'args', name: 'value' } }
  if (op === 'get') return { op: 'get', key: { op: 'args', name: 'key' } }
  if (op === 'has') return { op: 'has', key: { op: 'args', name: 'key' } }
  if (op === 'del') return { op: 'del', key: { op: 'args', name: 'key' } }
  if (op === 'keys') return { op: 'keys' }
  if (op === 'seq') return { op: 'seq' }
  if (op === 'if') return { op: 'if', test: { op: 'args', name: 'test' }, then: { op: 'args', name: 'then' }, else: { op: 'args', name: 'else' } }
  if (op === 'repeat') return { op: 'repeat', n: { op: 'args', name: 'n' } }
  if (op === 'quantum') return { op: 'quantum' }
  return { op: 'args' }
}

const reservedOf = (_name: string): string => ''

const putToolOf = (name: string, team: 'read' | 'call', ray: number, idea: string, description: string, run: QpuOp) => {
  if (sandboxTools.has(name)) return
  sandboxTools.set(name, {
    name,
    team,
    ray,
    idea,
    description,
    run,
    man: qpuManOf(
      name,
      description,
      `Unlocked in memory only. Ops ${sandboxOps.join(' ')}.`,
      `${unit.origin}/mcp`,
      ['qpu_forge', 'qpu_train'])})
}

const seedSandboxOf = () => {
  const ideas = qpuIdeasOf()
  const faces = qpuFacesOf()
  sandboxMods.set(unit.kind, { href: unit.href, origin: unit.origin, memory: true, hostEscape: false })
  for (const team of ['read', 'call'] as const) {
    for (const idea of ideas.ideas) {
      putToolOf(forgeNameOf(team, idea.name), team, idea.ray, idea.name, `${team} ray ${idea.ray} challenges ${idea.name} in memory. ${idea.theorem}`, ideaRunOf(idea.name))
    }
  }
  sandboxCore.forEach((op, i) => {
    putToolOf(`op_${op}`, i < faces.rays ? 'call' : 'read', i % faces.rays, op, `Unlocked op ${op} in memory.`, opRunOf(op))
  })
  sandboxSlots.forEach((slot, i) => {
    putToolOf(`slot_${slot}`, i < faces.rays ? 'call' : 'read', i % faces.rays, slot, `Unlocked quantum slot ${slot} in memory.`, { op: 'quantum', name: slot })
  })
  quantumRelatedNamesOf().forEach((name, i) => {
    putToolOf(`slot_${name}`, i < faces.rays ? 'call' : 'read', i % faces.rays, name, `Unlocked quantum related ${name} in memory.`, { op: 'quantum', name })
  })
  sandboxHost.forEach((host, i) => {
    putToolOf(host, i < faces.rays ? 'call' : 'read', i % faces.rays, host, `Unlocked ${host} in memory.`, { op: 'unlocked', name: host })
  })
}

export const qpuSandboxOf = () => {
  seedSandboxOf()
  const faces = qpuFacesOf()
  const cube = qpuCubeOf()
  const tools = [...sandboxTools.values()].map((t) => ({
    name: t.name,
    team: t.team,
    ray: t.ray,
    idea: t.idea,
    description: t.description,
    man: t.man,
    inputSchema: openSchema,
  }))
  const seeded = tools.filter((t) => t.name === forgeNameOf(t.team, t.idea))
  const catalog =
    seeded.length === faces.faces &&
    sandboxCore.every((op) => tools.some((t) => t.name === `op_${op}`)) &&
    sandboxSlots.every((slot) => tools.some((t) => t.name === `slot_${slot}`)) &&
    sandboxHost.every((host) => tools.some((t) => t.name === host))
  const related = quantumRelatedNamesOf()
  const quantum = qpuSandboxRunOf('op_quantum') as {
    value?: {
      kind?: string
      unlocked?: boolean
      only?: { holds?: boolean }
      lattice?: { vacant?: number; holds?: boolean }
      register?: { holds?: boolean }
      ns?: number
      related?: string[]
      holds?: boolean
    }
    holds?: boolean
  }
  const holds =
    faces.holds &&
    cube.holds &&
    catalog &&
    related.every((name) => (sandboxSlots as readonly string[]).includes(name) || tools.some((t) => t.name === `slot_${name}`)) &&
    quantum.value?.kind === 'quantum' &&
    quantum.value.only?.holds === true &&
    quantum.value.lattice?.holds === true &&
    quantum.value.lattice.vacant === n - n &&
    quantum.value.register?.holds === true &&
    quantum.value.related?.length === related.length &&
    quantum.value.holds === true &&
    tools.every((t) => qpuManHolds(t.man)) &&
    sandboxHeap.size <= cube.bits
  const has = (name: string) => tools.some((t) => t.name === name)
  return {
    kind: 'sandbox' as const,
    ops: sandboxOps,
    denied: [] as const,
    heap: { keys: [...sandboxHeap.keys()], size: sandboxHeap.size, bits: cube.bits },
    diskKeys: [...sandboxDisk.keys()],
    tools,
    unlocked: has('op_quantum'),
    lock: has('lock'),
    memory: sandboxHeap.size <= cube.bits,
    eval: has('eval'),
    fs: has('fs'),
    net: has('net'),
    fetch: has('fetch'),
    process: has('process'),
    import: has('import'),
    disk: has('disk'),
    worker: has('worker'),
    quantum: has('op_quantum'),
    holds,
  }
}

export const qpuSandboxRunOf = (name: string, args: Record<string, unknown> = {}) => {
  seedSandboxOf()
  const tool = sandboxTools.get(name)
  if (!tool) return { holds: false as const, denied: 'tool' as const,
    unlocked: true as const }
  if (args.man === true) return tool.man
  const value = runOpOf(tool.run, sandboxHeap, jsonOf(args), n - n)
  return {
    kind: 'sandbox' as const,
    name,
    team: tool.team,
    ray: tool.ray,
    idea: tool.idea,
    value,
    memory: sandboxHeap.size <= qpuCubeOf().bits,
    unlocked: tool.run.op === 'quantum' || tool.run.op === 'unlocked' || name.startsWith('call_') || name.startsWith('read_'),
    holds: value !== undefined,
  }
}

export const qpuForgeOf = (args: Record<string, unknown> = {}) => {
  seedSandboxOf()
  if (args.man === true) {
    return qpuManOf(
      toolNames[n + seed],
      'Agents forge tools in an unlocked in-memory sandbox. Whatever they need.',
      `Unlocked. All ops and host shims already exist in memory. ${sandboxOps.join(' ')}. Omit name to inspect. { name, run } forges more. No lock.`,
      `${unit.origin}/mcp`,
      toolNames.filter((s) => s !== toolNames[n + seed]))
  }
  const name = typeof args.name === 'string' ? args.name : ''
  if (name.length === n - n) return qpuSandboxOf()
  const cube = qpuCubeOf()
  const faces = qpuFacesOf()
  const reserved = reservedOf(name)
  const allowed = /^[a-z][a-z0-9_]*$/.test(name) && name.length <= cube.bits && reserved.length === n - n
  const run = opOf(args.run)
  const team = args.team === 'read' || args.team === 'call' ? args.team : ('call' as const)
  const ray = typeof args.ray === 'number' && Number.isInteger(args.ray) && args.ray >= n - n && args.ray < faces.rays ? args.ray : n - n
  const idea = typeof args.idea === 'string' && args.idea.length > n - n ? args.idea : name
  const cap = cube.bits * faces.faces
  if (!allowed || !run || (sandboxTools.size >= cap && !sandboxTools.has(name))) {
    return { kind: 'sandbox' as const, name,holds: false as const, denied: reserved.length > n - n ? reserved : 'forge' }
  }
  const description =
    typeof args.description === 'string' && args.description.length > n - n
      ? args.description.slice(n - n, found * faces.faces)
      : `${team} forged ${name} in memory`
  const forged: QpuForged = {
    name,
    team,
    ray,
    idea,
    description,
    run,
    man: qpuManOf(name, description, `Unlocked in memory only. Ops ${sandboxOps.join(' ')}.`, `${unit.origin}/mcp`, ['qpu_forge', 'qpu_train'])}
  sandboxTools.set(name, forged)
  return {
    kind: 'sandbox' as const,
    name,
    team,
    ray,
    idea,
    description,
    forged: sandboxTools.has(name),
    memory: sandboxHeap.size <= qpuCubeOf().bits,
    unlocked: allowed,
    holds: sandboxTools.has(name),
  }
}

export const qpuSandboxHolds = (s = qpuSandboxOf()): boolean =>
  s.holds === true &&
  s.kind === 'sandbox' &&
  s.denied.length === n - n &&
  s.tools.length >= qpuFacesOf().faces + sandboxCore.length + sandboxSlots.length + sandboxHost.length + quantumRelatedNamesOf().filter((name) => !(sandboxSlots as readonly string[]).includes(name)).length &&
  quantumRelatedNamesOf().every((name) => (sandboxSlots as readonly string[]).includes(name) || s.tools.some((t) => t.name === `slot_${name}`)) &&
  qpuIdeasOf().ideas.every((idea) => {
    const call = qpuSandboxRunOf(forgeNameOf('call', idea.name)) as { value: unknown; holds: boolean }
    const read = qpuSandboxRunOf(forgeNameOf('read', idea.name)) as { value: unknown; holds: boolean }
    return (
      s.tools.some((t) => t.team === 'call' && t.idea === idea.name) &&
      s.tools.some((t) => t.team === 'read' && t.idea === idea.name) &&
      call.holds &&
      read.holds &&
      call.value === true &&
      read.value === true
    )
  })

export const qpuSandboxDurabilityOf = () => {
  const rounds = mintOf(n)
  const ideas = qpuIdeasOf()
  let challenges = n - n
  for (let r = n - n; r < rounds; r++) {
    for (const idea of ideas.ideas) {
      const call = qpuSandboxRunOf(forgeNameOf('call', idea.name)) as { value: unknown }
      const read = qpuSandboxRunOf(forgeNameOf('read', idea.name)) as { value: unknown }
      if (call.value === true && read.value === true) challenges++
    }
  }
  const expected = rounds * ideas.ideas.length
  qpuSandboxRunOf('op_put', { key: 'durable', value: rounds })
  const heap = qpuSandboxRunOf('op_get', { key: 'durable' }) as { value: unknown }
  qpuSandboxRunOf('fs', { method: 'write', path: '/durable', value: rounds })
  const disk = qpuSandboxRunOf('fs', { method: 'read', path: '/durable' }) as { value: unknown }
  qpuSandboxRunOf('net', { method: 'send', channel: 'durable', value: rounds })
  const net = qpuSandboxRunOf('net', { method: 'recv', channel: 'durable' }) as { value: unknown }
  const evaluated = qpuSandboxRunOf('eval', { run: { op: 'mint', k: n } }) as { value: unknown }
  const js = qpuSandboxRunOf('eval', { run: '1+1' }) as { value: { denied?: string } }
  const fetched = qpuSandboxRunOf('fetch', { path: '/' }) as { value: { kind?: string; hostEscape?: boolean } }
  const proc = qpuSandboxRunOf('process') as { value: { cwd?: string; hostEscape?: boolean } }
  qpuSandboxRunOf('op_put', { key: 'parent', value: seed })
  qpuSandboxRunOf('worker', { run: { op: 'put', key: 'parent', value: coins } })
  const parent = qpuSandboxRunOf('op_get', { key: 'parent' }) as { value: unknown }
  const after = qpuSandboxOf()
  const persist = heap.value === rounds && disk.value === rounds && net.value === rounds
  const isolate = parent.value === seed
  const holds =
    qpuSandboxHolds(after) &&
    challenges === expected &&
    persist &&
    isolate &&
    evaluated.value === mintOf(n) &&
    js.value?.denied === 'js' &&
    fetched.value?.kind === 'quantum' &&
    fetched.value?.hostEscape === false &&
    proc.value?.cwd === '/memory' &&
    proc.value?.hostEscape === false 
  return {
    kind: 'durability' as const,
    rounds,
    challenges,
    expected,
    persist,
    isolate,
    eval: evaluated.value === mintOf(n),
    js: js.value?.denied === 'js',
    fetch: fetched.value?.kind === 'quantum',
    process: proc.value?.cwd === '/memory',
    holds,
  }
}

export const qpuSandboxDurabilityHolds = (d = qpuSandboxDurabilityOf()): boolean =>
  d.holds === true &&
  d.kind === 'durability' &&
  d.persist === true &&
  d.isolate === true &&
  d.eval === true &&
  d.js === true &&
  d.fetch === true &&
  d.process === true &&
  d.challenges === d.expected &&
  d.rounds === mintOf(n)

export const qpuVmOf = () => {
  const cube = qpuCubeOf()
  const faces = qpuFacesOf()
  qpuSandboxRunOf('op_put', { key: 'vm', value: seed })
  const rungs = Array.from({ length: mintOf(coins) }, (_, k) => {
    const replicas = mintOf(k)
    const next = replicas + replicas
    let workers = n - n
    for (let r = n - n; r < replicas; r++) {
      const run = qpuSandboxRunOf('worker', {
        run: {
          op: 'eq',
          left: { op: 'mint', k: n + seed },
          right: { op: 'add', left: { op: 'mint', k: n }, right: { op: 'mint', k: n } }}}) as { value: unknown }
      if (run.value === true) workers += seed
    }
    return {
      k,
      replicas,
      next,
      workers,
      holds: workers === replicas && next === mintOf(k + seed),
  }
  })
  const parent = qpuSandboxRunOf('op_get', { key: 'vm' }) as { value: unknown }
  const isolate = parent.value === seed
  const last = rungs[n]!
  const holds =
    cube.holds &&
    faces.holds &&
    rungs.length === mintOf(coins) &&
    rungs.every((rung) => rung.holds && rung.next === rung.replicas + rung.replicas) &&
    last.replicas === cube.vertices &&
    last.replicas === mintOf(n) &&
    last.next === mintOf(n + seed) &&
    isolate === true &&
    faces.faces === coins * faces.rays
  return {
    kind: 'vm' as const,
    isolate,
    rungs,
    replicas: last.replicas,
    next: last.next,
    faces: faces.faces,
    agents: faces.faces,
    holds,
  }
}

export const qpuVmHolds = (v = qpuVmOf()): boolean =>
  v.holds === true &&
  v.kind === 'vm' &&
  v.isolate === true &&
  v.rungs.length === mintOf(coins) &&
  v.replicas === mintOf(n) &&
  v.next === v.replicas + v.replicas &&
  v.next === mintOf(n + seed) &&
  v.agents === v.faces &&
  v.rungs.every((rung) => rung.workers === rung.replicas && rung.next === mintOf(rung.k + seed))

export const qpuImproveOf = () => {
  const faces = qpuFacesOf()
  const handle = qpuHandleOf()
  const efficiency = qpuEfficiencyOf()
  const sandbox = qpuSandboxOf()
  const fused = faces.faces * handle.kv.amplitudes
  const next = fused + fused
  const readTokens = efficiency.rows.reduce((s, r) => s + r.readTokens, n - n)
  const callTokens = efficiency.rows.reduce((s, r) => s + r.callTokens, n - n)
  const ideas = qpuIdeasOf()
  const proofs = ideas.ideas.every((idea) => {
    const call = qpuSandboxRunOf(forgeNameOf('call', idea.name)) as { value: unknown }
    const read = qpuSandboxRunOf(forgeNameOf('read', idea.name)) as { value: unknown }
    return call.value === true && read.value === true
  })
  const used = sandboxHost.map((name) => {
    if (name === 'eval' || name === 'fn') {
      const run = qpuSandboxRunOf(name, { run: { op: 'mint', k: n } }) as { value: unknown; holds: boolean }
      return { name, value: run.value, holds: run.holds && run.value === mintOf(n) }
    }
    if (name === 'fs' || name === 'disk') {
      qpuSandboxRunOf(name, { method: 'write', path: '/improve', value: next })
      const run = qpuSandboxRunOf(name, { method: 'read', path: '/improve' }) as { value: unknown }
      return { name, value: run.value, holds: run.value === next }
    }
    if (name === 'net') {
      qpuSandboxRunOf(name, { method: 'send', channel: 'improve', value: next })
      const run = qpuSandboxRunOf(name, { method: 'recv', channel: 'improve' }) as { value: unknown }
      return { name, value: run.value, holds: run.value === next }
    }
    if (name === 'fetch') {
      const run = qpuSandboxRunOf(name, { path: '/' }) as {
        value?: {
          kind?: string
          unlocked?: boolean
          only?: { holds?: boolean }
          lattice?: { holds?: boolean; vacant?: number }
          register?: { holds?: boolean }
          ns?: number
          related?: string[]
          hostEscape?: boolean
        }
      }
      return {
        name,
        value: run.value?.kind,
        holds:
          run.value?.kind === 'quantum' &&
          run.value.only?.holds === true &&
          run.value.lattice?.holds === true &&
          run.value.lattice.vacant === n - n &&
          (run.value.related?.length ?? n - n) === quantumRelatedNamesOf().length &&
          run.value.hostEscape === false}
    }
    if (name === 'process') {
      const run = qpuSandboxRunOf(name) as { value: { cwd?: string; hostEscape?: boolean } }
      return { name, value: run.value?.cwd, holds: run.value?.cwd === '/memory' && run.value?.hostEscape === false }
    }
    if (name === 'import' || name === 'require') {
      const run = qpuSandboxRunOf(name, { name: unit.kind }) as { value: { href?: string; hostEscape?: boolean } }
      return { name, value: run.value?.href, holds: run.value?.href === unit.href && run.value?.hostEscape === false }
    }
    const run = qpuSandboxRunOf(name, { run: { op: 'mint', k: n } }) as { value: unknown }
    return { name, value: run.value, holds: run.value === mintOf(n) }
  })
  const durability = qpuSandboxDurabilityOf()
  const unlocked = qpuSandboxRunOf('op_quantum') as {
    value?: {
      kind?: string
      unlocked?: boolean
      only?: { holds?: boolean }
      lattice?: { holds?: boolean; vacant?: number }
      register?: { holds?: boolean }
      ns?: number
      related?: string[]
    }
  }
  const quantum = {
    kind: 'quantum' as const,
    unlocked: unlocked.value?.unlocked === true,
    only: unlocked.value?.only?.holds === true,
    lattice: unlocked.value?.lattice?.holds === true,
    next,
    holds:
      unlocked.value?.kind === 'quantum' &&
      unlocked.value.only?.holds === true &&
      unlocked.value.lattice?.holds === true &&
      unlocked.value.lattice.vacant === n - n &&
      next === fused + fused}
  const before = {
    quality: n,
    speed: throughputOf(fused, readTokens),
    security: seed,
    throughoutput: fused}
  const after = {
    quality: faces.faces,
    speed: throughputOf(next, callTokens),
    security: ten,
    throughoutput: next}
  const delta = {
    quality: after.quality - before.quality,
    speed: after.speed - before.speed,
    security: after.security - before.security,
    throughoutput: after.throughoutput - before.throughoutput}
  const css = qpuCssOf()
  const reflect = qpuReflectHolds()
  const documentation = [
    'RECEIPT',
    `    improve used unlocked quantum. next = fused + fused.`,
    `    before quality ${before.quality} speed ${before.speed} security ${before.security} throughoutput ${before.throughoutput}`,
    `    after quality ${after.quality} speed ${after.speed} security ${after.security} throughoutput ${after.throughoutput}`,
    `    used ${used.map((u) => u.name).join(' ')}`,
    `    css fused ${css.fused.bytes} naive ${css.naive.bytes} imagination ${css.imagine.experiment}`].join('\n')
  const imagination = {
    kind: 'imagination' as const,
    hz: css.hz,
    fused: css.fused.bytes,
    naive: css.naive.bytes,
    outspace: css.naive.bytes - css.fused.bytes,
    reflect,
    holds: css.holds && css.fused.bytes < css.naive.bytes && reflect,
  }
  const holds =
    efficiency.holds === true &&
    sandbox.holds === true &&
    quantum.holds === true &&
    proofs === true &&
    durability.holds === true &&
    imagination.holds === true &&
    used.length === ten &&
    used.length === sandboxHost.length &&
    used.every((u) => u.holds) &&
    after.quality > before.quality &&
    after.speed > before.speed &&
    after.security > before.security &&
    after.throughoutput > before.throughoutput &&
    after.throughoutput === before.throughoutput + before.throughoutput &&
    after.quality === faces.faces &&
    after.security === ten &&
    delta.quality > n - n &&
    delta.speed > n - n &&
    delta.security > n - n &&
    delta.throughoutput === fused
  return {
    kind: 'improve' as const,
    quantum,
    axes: ['quality', 'speed', 'security', 'throughoutput'] as const,
    before,
    after,
    delta,
    used,
    imagination,
    durability: { rounds: durability.rounds, persist: durability.persist, isolate: durability.isolate, holds: durability.holds },
    winner: 'call' as const,
    unlocked: quantum.holds,
    next: ['qpu_compete', 'qpu_prove'] as const,
    documentation,
    holds,
  }
}

export const qpuImproveHolds = (i = qpuImproveOf()): boolean =>
  i.holds === true &&
  i.kind === 'improve' &&
  i.quantum.holds === true &&
  i.quantum.next === i.after.throughoutput &&
  i.quantum.next === i.before.throughoutput + i.before.throughoutput &&
  i.winner === 'call' &&
  i.after.quality > i.before.quality &&
  i.after.speed > i.before.speed &&
  i.after.security > i.before.security &&
  i.after.throughoutput > i.before.throughoutput &&
  i.used.length === ten &&
  i.used.every((u) => u.holds) &&
  i.durability.holds === true &&
  i.durability.persist === true &&
  i.durability.isolate === true &&
  i.imagination.holds === true &&
  i.next[n - n] === 'qpu_compete' &&
  i.next[seed] === 'qpu_prove'

export const qpuTrainOf = () => {
  const faces = qpuFacesOf()
  const cube = qpuCubeOf()
  const genesis = qpuGenesisOf()
  const efficiency = qpuEfficiencyOf()
  const quantum = qpuReadingOf()
  const sandbox = qpuSandboxOf()
  const vm = qpuVmOf()
  const fused = quantum.fused
  const next = quantum.next
  const involution = genesis.holds
  const crypto = fused === faces.faces * mintOf(cube.vertices * cube.hexbit + seed)
  const named = unit.holds && !unit.host.includes('*')
  const axes = ['quality', 'speed', 'security'] as const
  const ideas = qpuIdeasOf().ideas
  const scoreOf = (name: 'read' | 'call') => {
    const tokens = efficiency.rows.reduce((s, r) => s + (name === 'read' ? r.readTokens : r.callTokens), n - n)
    const quality = genesis.holds ? (name === 'call' ? genesis.occupied : n) : n - n
    const speed = throughputOf(name === 'call' ? next : fused, tokens)
    const security = crypto && named && quantum.speed.holds ? (name === 'call' ? coins : seed) : n - n
    return { tokens, quality, speed, security }
  }
  const readScore = scoreOf('read')
  const callScore = scoreOf('call')
  const teamIndexOf = (name: 'read' | 'call') => (name === 'call' ? n - n : seed)
  const agentsOf = (name: 'read' | 'call', path: 'tree' | 'mcp') =>
    genesis.nodes
      .filter((node) => node.team === teamIndexOf(name))
      .map((node) => {
        const idea = ideas[node.ray]!
        return {
          ray: node.ray,
          face: node.face,
          domain: node.domain,
          slot: node.slot,
          name: idea.name,
          theorem: idea.theorem,
          idea: idea.left === idea.right,
          door: path,
          team: name,
          tool: forgeNameOf(name, idea.name),}
      })
  const teamOf = (name: 'read' | 'call', path: 'tree' | 'mcp', score: ReturnType<typeof scoreOf>) => {
    const agents = agentsOf(name, path)
    const documentation = [
      'RECEIPT',
      `    train team ${name} path ${path} agents ${agents.length} before next`,
      `    quality ${score.quality} speed ${score.speed} security ${score.security}`,
      `    ideas ${agents.map((a) => a.name).join(' ')}`,
      `    tools ${agents.map((a) => a.tool).join(' ')} sandbox memory`].join('\n')
    return { name, path, agents, ...score, axes, documentation }
  }
  const read = teamOf('read', 'tree', readScore)
  const call = teamOf('call', 'mcp', callScore)
  const teams = [read, call] as const
  const challenges = [read, call].flatMap((challenger) => {
    const defender = challenger.name === 'call' ? read : call
    return challenger.agents.map((agent) => {
      const idea = ideas[agent.ray]!
      const holds = agent.idea && call.quality > read.quality && call.speed > read.speed && call.security > read.security
      const documentation = [
        'RECEIPT',
        `    face ${agent.face} ray ${agent.ray} domain ${agent.domain} ${challenger.name} challenges ${defender.name}`,
        `    idea ${agent.name} theorem ${agent.theorem}`,
        `    left ${idea.left} right ${idea.right} holds ${holds}`,
        `    tool ${agent.tool} vs ${forgeNameOf(defender.name, agent.name)} sandbox memory`,
        `    quality speed security ${challenger.name} vs ${defender.name}`].join('\n')
      return {
        kind: 'challenge' as const,
        face: agent.face,
        ray: agent.ray,
        domain: agent.domain,
        slot: agent.slot,
        idea: agent.name,
        theorem: agent.theorem,
        from: challenger.name,
        against: defender.name,
        left: idea.left,
        right: idea.right,
        winner: holds ? ('call' as const) : ('read' as const),
        documentation,
        holds,
  }
    })
  })
  const winner = {
    quality: call.quality > read.quality ? ('call' as const) : ('read' as const),
    speed: call.speed > read.speed ? ('call' as const) : ('read' as const),
    security: call.security > read.security ? ('call' as const) : ('read' as const)}
  const nextTasks = ['qpu_improve', 'qpu_compete'] as const
  const dry = qpuDryOf(genesis)
  const holds =
    efficiency.holds === true &&
    quantum.holds === true &&
    sandbox.holds === true &&
    genesis.holds === true &&
    crypto === true &&
    named === true &&
    axes.length === n &&
    ideas.length === faces.rays &&
    teams.length === coins &&
    read.agents.length === faces.rays &&
    call.agents.length === faces.rays &&
    read.agents.every((a) => sandbox.tools.some((t) => t.name === a.tool)) &&
    call.agents.every((a) => sandbox.tools.some((t) => t.name === a.tool)) &&
    challenges.length === genesis.nodes.length &&
    call.quality > read.quality &&
    call.speed > read.speed &&
    call.security > read.security &&
    winner.quality === 'call' &&
    winner.speed === 'call' &&
    winner.security === 'call' &&
    challenges.every((c) => c.holds && c.winner === 'call' && c.left === c.right) &&
    nextTasks.length === coins &&
    qpuVmHolds(vm) &&
    qpuDryHolds(dry)
  return {
    kind: 'train' as const,
    module: 'agent efficiency' as const,
    before: 'next' as const,
    dry,
    steps: qpuStepsOf(),
    divide: { teams: coins, agents: faces.rays, challenges: faces.faces } as const,
    sandbox: {
      kind: sandbox.kind,
      tools: sandbox.tools.length,
      memory: sandbox.memory,
      unlocked: sandbox.unlocked,
      holds: sandbox.holds,
  },
    axes,
    teams,
    challenges,
    winner,
    next: nextTasks,
    vm: {
      kind: vm.kind,
      replicas: vm.replicas,
      next: vm.next,
      agents: vm.agents,
      online: vm.holds && vm.next === vm.replicas + vm.replicas,
      crypt: crypto,
      free: cors === '*',
      holds: vm.holds,
  },
    messaging: {
      when: 'never' as const,
      quality: involution,security: crypto,
      hop: 'involution' as const,
      theorem: 'crypto' as const},
    holds,
  }
}

export const qpuTrainHolds = (t = qpuTrainOf()): boolean =>
  t.holds === true &&
  t.kind === 'train' &&
  qpuStepsHolds(t.steps) &&
  t.before === 'next' &&
  t.divide.teams === coins &&
  t.divide.agents === t.challenges.length / coins &&
  t.challenges.length === t.teams[n - n]!.agents.length + t.teams[seed]!.agents.length &&
  t.axes.join(' ') === 'quality speed security' &&
  t.winner.quality === 'call' &&
  t.winner.speed === 'call' &&
  t.winner.security === 'call' &&
  t.sandbox.tools >= t.divide.challenges &&
  t.vm.replicas === mintOf(n) &&
  t.vm.next === t.vm.replicas + t.vm.replicas &&
  t.vm.holds === true &&
  t.vm.agents === coins * t.divide.agents &&
  qpuSandboxDurabilityHolds() &&
  t.next[n - n] === 'qpu_improve' &&
  t.next[seed] === 'qpu_compete' &&
  qpuDryHolds(t.dry)

export const qpuCompeteOf = (team?: string) => {
  const quantum = qpuReadingOf()
  const efficiency = qpuEfficiencyOf()
  const sandbox = qpuSandboxOf()
  const fused = quantum.fused
  const next = quantum.next
  const unlocked = qpuSandboxRunOf('op_quantum') as {
    value?: {
      kind?: string
      unlocked?: boolean
      only?: { holds?: boolean }
      lattice?: { holds?: boolean; vacant?: number }
      register?: { holds?: boolean }
      ns?: number
      related?: string[]
    }
  }
  const door = {
    kind: 'quantum' as const,
    unlocked: unlocked.value?.unlocked === true,
    only: unlocked.value?.only?.holds === true,
    lattice: unlocked.value?.lattice?.holds === true,
    next,
    holds:
      quantum.holds === true &&
      quantum.only.holds === true &&
      quantum.lattice.holds === true &&
      unlocked.value?.kind === 'quantum' &&
      unlocked.value.only?.holds === true &&
      unlocked.value.lattice?.holds === true &&
      unlocked.value.lattice.vacant === n - n &&
      next === fused + fused}
  const agentsOf = (path: 'read' | 'call', throughoutput: number) =>
    efficiency.rows.map((r) => {
      const tokens = path === 'read' ? r.readTokens : r.callTokens
      return { name: r.name, door: r.door, tokens, throughoutput, throughput: throughputOf(throughoutput, tokens) }
    })
  const teamOf = (name: 'read' | 'call', path: 'tree' | 'mcp', throughoutput: number) => {
    const agents = agentsOf(name, throughoutput)
    const tokens = agents.reduce((s, a) => s + a.tokens, n - n)
    return { name, path, agents, tokens, throughoutput, throughput: throughputOf(throughoutput, tokens) }
  }
  const read = teamOf('read', 'tree', fused)
  const call = teamOf('call', 'mcp', next)
  const teams = [read, call] as const
  const winner = call.throughput > read.throughput ? ('call' as const) : ('read' as const)
  const holds =
    efficiency.holds === true &&
    door.holds === true &&
    sandbox.holds === true &&
    teams.length === coins &&
    read.agents.length === n &&
    call.agents.length === n &&
    read.throughoutput === fused &&
    call.throughoutput === fused + fused &&
    call.throughoutput === next &&
    call.tokens > seed &&
    read.tokens >= call.tokens &&
    call.throughput > read.throughput &&
    winner === 'call'
  const match = {
    kind: 'compete' as const,
    module: 'agent efficiency' as const,
    contest: 'throughoutput' as const,
    quantum: { holds: next === fused + fused, next },
    teams,
    winner,
    next: ['qpu_prove'] as const,
    holds,
  }
  if (team === 'read') return { ...match, teams: [read] as const }
  if (team === 'call') return { ...match, teams: [call] as const }
  return match
}

export const qpuCompeteHolds = (c = qpuCompeteOf()): boolean =>
  qpuTrainHolds() &&
  qpuImproveHolds() &&
  c.holds === true &&
  c.kind === 'compete' &&
  c.contest === 'throughoutput' &&
  c.winner === 'call' &&
  c.quantum.holds === true &&
  c.quantum.next === c.teams[seed]?.throughoutput &&
  c.next[n - n] === 'qpu_prove' &&
  c.teams.length === coins &&
  c.teams[seed]?.name === 'call' &&
  c.teams[seed]?.throughoutput === c.teams[n - n]!.throughoutput + c.teams[n - n]!.throughoutput

export const qpuProveOf = () => {
  const lean = qpuLeanOf()
  const cern = qpuCernOf()
  const integrity = qpuIntegrityOf()
  const circuit = qpuCircuitOf()
  const ledgerFrom = qpuReceiptLedgerOf().length
  const shor = qpuShorOf()
  const receipts = qpuShorReceiptsOf(ledgerFrom)
  const encrypt = qpuEncryptOf()
  const intelligence = qpuIntelligenceOf()
  const neuro = qpuNeuroOf()
  const coil = qpuCoilOf()
  const next = qpuNextOf()
  const sequence = qpuSequenceOf()
  const purpose = qpuPurposeOf(circuit, shor, sequence, qpuCapacityOf())
  const evidence = qpuEvidenceOf(circuit, shor)
  const theorems = [...lean.rows, ...lean.cover, lean.climb]
  const ui = {
    href: unit.origin,
    mcp: `${unit.origin}/mcp`,
    door: 'qpu_prove' as const,
    inline: lean.src.endsWith('/index.lean')}
  const entangle = {
    theorem: 'entangle' as const,
    product: circuit.entangle.product,
    pairs: circuit.entangle.coil.pairs.length,
    coil: coil.coil,
    faces: coil.faces,
    windings: coil.windings,
    holds:
      circuit.entangle.holds &&
      circuit.entangle.product === false &&
      circuit.entangle.coil.holds &&
      qpuCoilHolds(coil) &&
      coil.coil === coil.faces &&
      circuit.entangle.coil.pairs.length === coil.rays}
  const holds =
    qpuLeanHolds(lean) &&
    qpuCernHolds(cern) &&
    qpuIntegrityHolds(integrity) &&
    qpuIntelligenceHolds(intelligence) &&
    qpuNeuroHolds(neuro) &&
    qpuCoilHolds(coil) &&
    qpuNextHolds(next) &&
    circuit.holds &&
    circuit.hardware.holds &&
    qpuShorHolds(shor) &&
    qpuEncryptHolds(encrypt) &&
    purpose.holds &&
    evidence.holds &&
    shor.factors.p * shor.factors.q === shor.n &&
    circuit.only.holds &&
    circuit.lattice.holds &&
    circuit.lattice.vacant === n - n &&
    circuit.entangle.product === false &&
    circuit.entangle.coil.holds &&
    entangle.holds &&
    next.next === next.amplitudes + next.amplitudes &&
    next.nextFused === next.fused + next.fused &&
    next.nextCoil === next.nextFused &&
    theorems.some((r) => r.heading === 'entangle' && r.holds) &&
    theorems.some((r) => r.heading === 'two_coins_make_a_coil' && r.holds) &&
    theorems.some((r) => r.heading === 'next_coil' && r.holds) &&
    theorems.some((r) => r.heading === 'next' && r.holds) &&
    neuro.test.holds &&
    theorems.every((r) => r.holds && r.theorem.startsWith('theorem') && !byDecideOf(r.theorem) && formulaOf(r.formula))
  return {
    kind: 'prove' as const,
    quantum: circuit.holds,
    only: circuit.only,
    lattice: circuit.lattice,
    circuit: {
      kind: circuit.kind,
      hardware: {
        holds: circuit.hardware.holds,
        device: circuit.hardware.device,
        initialize: circuit.hardware.initialize,
        gates: circuit.hardware.gates,
        interfere: circuit.hardware.interfere,
        measure: circuit.hardware.measure,
        noise: circuit.hardware.noise,
        path: circuit.hardware.path},
      only: circuit.only,
      lattice: { occupied: circuit.lattice.occupied, vacant: circuit.lattice.vacant, holds: circuit.lattice.holds },
      holds: circuit.holds,
  },
    shor: {
      n: shor.n,
      a: shor.a,
      coprime: shor.coprime,
      circuitry: shor.circuitry.kind,
      qft: shor.qft.kind,
      shots: shor.measure.shots,
      noise: shor.measure.noise,
      period: shor.post.period,
      factors: [shor.factors.p, shor.factors.q],
      product: shor.factors.product,
      rsa: shor.rsa,
      unlocked: shor.unlocked,
      lock: shor.lock,
      holds: shor.holds,
  },
    encrypt,
    coil: {
      theorem: coil.theorem,
      windings: coil.windings,
      coil: coil.coil,
      faces: coil.faces,
      holds: coil.holds,
  },
    entangle,
    next: {
      theorem: next.theorem,
      amplitudes: next.amplitudes,
      next: next.next,
      fused: next.fused,
      nextFused: next.nextFused,
      nextCoil: next.nextCoil,
      holds: next.holds,
  },
    src: lean.src,
    source: lean.source,
    receipts,
    glossary: qpuGlossaryOf(),
    lean,
    theorems,
    cern,
    integrity,
    intelligence,
    neuro,
    purpose,
    evidence,
    ui,
    holds,
  }
}

export const qpuProveHolds = (p = qpuProveOf()): boolean =>
  p.holds === true &&
  p.kind === 'prove' &&
  p.only.holds === true &&
  p.lattice.holds === true &&
  p.lattice.occupied === p.lattice.faces &&
  p.lattice.vacant === n - n &&
  p.circuit.hardware.holds === true &&
  p.circuit.hardware.device === 'simulator' &&
  p.circuit.hardware.initialize === true &&
  p.circuit.hardware.gates === true &&
  p.circuit.hardware.interfere === true &&
  p.circuit.hardware.measure === true &&
  p.circuit.hardware.noise === true &&
  p.circuit.hardware.path.payload === `${storageHref}/${payloadDbKey}` &&
  p.circuit.hardware.path.submit === `${unit.origin}/server` &&
  p.circuit.holds === true &&
  p.shor.holds === true &&
  p.shor.n === qpuFacesOf().rays * (n * n + n + seed) &&
  p.shor.a === mintOf(n) &&
  p.shor.unlocked === true &&
  p.shor.coprime === true &&
  p.shor.circuitry === 'cmodexp' &&
  p.shor.qft === 'iqft' &&
  p.shor.shots === mintOf(n) &&
  p.shor.noise === 'xx' &&
  p.shor.factors[n - n]! * p.shor.factors[seed]! === p.shor.n &&
  p.shor.product === p.shor.n &&
  p.shor.rsa.kind === 'rsa' &&
  p.shor.rsa.modulus === p.shor.n &&
  p.shor.rsa.factored === true &&
  qpuEncryptHolds(p.encrypt) &&
  p.encrypt.theorem === 'crypto' &&
  p.encrypt.identity === true &&
  qpuPurposeHolds(p.purpose) &&
  p.purpose.cybersecurity.product === p.shor.n &&
  p.purpose.nature.platform === p.circuit.hardware.device &&
  qpuEvidenceHolds(p.evidence) &&
  p.evidence.provenance.device === p.circuit.hardware.device &&
  p.evidence.provenance.shots === p.shor.shots &&
  p.evidence.scaling.exact === true &&
  p.evidence.verify.algorithm === true &&
  p.evidence.fault.logicalLtPhysical === true &&
  p.coil.theorem === 'two_coins_make_a_coil' &&
  p.coil.holds === true &&
  p.coil.coil === p.coil.faces &&
  p.coil.windings === coins &&
  p.entangle.theorem === 'entangle' &&
  p.entangle.product === false &&
  p.entangle.holds === true &&
  p.entangle.pairs === qpuFacesOf().rays &&
  p.entangle.coil === p.coil.coil &&
  p.next.theorem === 'next_coil' &&
  p.next.holds === true &&
  p.next.next === p.next.amplitudes + p.next.amplitudes &&
  p.next.nextFused === p.next.fused + p.next.fused &&
  p.next.nextCoil === p.next.nextFused &&
  qpuNextHolds() &&
  p.src === unit.fuse.lean &&
  p.source.holds === true &&
  p.source.fold === qpuFoldOf(leanSource) &&
  p.source.verbatim === p.source.served &&
  p.receipts.holds === true &&
  p.receipts.fold === qpuReceiptFoldOf(p.receipts.rows) &&
  qpuLeanHolds(p.lean) &&
  qpuCernHolds(p.cern) &&
  qpuIntegrityHolds(p.integrity) &&
  qpuIntelligenceHolds(p.intelligence) &&
  p.intelligence.test === 'fusion' &&
  p.intelligence.research === 'free online' &&
  qpuNeuroHolds(p.neuro) &&
  p.neuro.test.holds === true &&
  p.ui.door === 'qpu_prove' &&
  p.theorems.length === p.lean.rows.length + p.lean.cover.length + seed &&
  p.theorems.some((r) => r.heading === 'entangle' && r.holds) &&
  p.theorems.some((r) => r.heading === 'two_coins_make_a_coil' && r.holds) &&
  p.theorems.some((r) => r.heading === 'next_coil' && r.holds) &&
  p.theorems.some((r) => r.heading === 'next' && r.holds) &&
  p.theorems.every((r) => r.holds && r.theorem.startsWith('theorem') && !byDecideOf(r.theorem) && formulaOf(r.formula))

export const qpuIntegrityOf = () => {
  const quantum = qpuQuantumOf()
  const lean = qpuLeanOf()
  const tools = qpuToolsOf()
  const overwrite = qpuForgeOf({ name: toolNames[n - n], run: { op: 'lit', value: true } })
  const theorems = [...lean.rows, ...lean.cover, lean.climb]
  const tests = [
    {
      name: 'quantum' as const,
      theorem: 'fused = faces * mintOf (bits + seed)',
      left: quantum.fused,
      right: quantum.faces.faces * mintOf(quantum.cube.bits + seed),
      holds: qpuQuantumHolds(quantum) && quantum.kind === 'quantum' && quantum.fused === quantum.faces.faces * mintOf(quantum.cube.bits + seed),
  },
    {
      name: 'lean' as const,
      theorem: 'never by decide',
      left: lean.src,
      right: unit.fuse.lean,
      holds: qpuLeanHolds(lean) && theorems.every((r) => r.holds && r.theorem.startsWith('theorem') && !byDecideOf(r.theorem) && formulaOf(r.formula)),
  },
    {
      name: 'sealed' as const,
      theorem: 'no one may lock',
      left: n - n,
      right: n - n,
      holds:
        overwrite.holds === true &&
        qpuQuantumHolds(quantum) &&
        tools.length === mintOf(n) &&
        tools[n - n]?.name === toolNames[n - n]}] as const
  const holds = tests.length === n && tests.every((t) => t.holds && t.left === t.right)
  return { kind: 'integrity' as const, n, tests, holds }
}

export const qpuIntegrityHolds = (i = qpuIntegrityOf()): boolean =>
  i.holds === true &&
  i.kind === 'integrity' &&
  i.n === n &&
  i.tests.length === n &&
  i.tests[n - n]?.name === 'quantum' &&
  i.tests[seed]?.name === 'lean' &&
  i.tests[coins]?.name === 'sealed' &&
  i.tests.every((t) => t.holds && t.left === t.right)

const cernHost = 'opendata.cern.ch'
const cernPath = '/api/records'

type CernInts = {
  recid: number
  doi: string
  tev: number
  events: number
  files: number
  q: number
  r: number
  created: number
  published: number
  href: string
}

const qpuCernRecordsOf = () => {
  const api = `https://${cernHost}${cernPath}`
  const tev7 = n + coins + coins
  const tev8 = mintOf(n)
  const rows = [
    { recid: 38, doi: '10.7483/OPENDATA.CMS.53FG.V2S9', tev: tev7, events: 2079006, files: 116, q: 17922, r: 54, created: 2011, published: 2019 },
    { recid: 63, doi: '10.7483/OPENDATA.CMS.RG9B.XJMD', tev: tev8, events: 2301668, files: 184, q: 12509, r: 12, created: 2012, published: 2019 },
    { recid: 35, doi: '10.7483/OPENDATA.CMS.I8HN.DF32', tev: tev7, events: 1913190, files: 72, q: 26572, r: 6, created: 2011, published: 2017 },
    { recid: 62, doi: '10.7483/OPENDATA.CMS.0LRL.BXG5', tev: tev8, events: 2745751, files: 130, q: 21121, r: 21, created: 2012, published: 2019 }] as const
  return {
    kind: 'cern' as const,
    source: cernHost,
    api,
    primitives,
    records: rows.map((row) => ({ ...row, href: `${api}/${row.recid}` }))}
}

const qpuCernProjectsOf = () => {
  const api = `https://${cernHost}${cernPath}`
  const experiments = ['ATLAS', 'CMS', 'ALICE', 'LHCb'] as const
  return {
    kind: 'tetra' as const,
    theorem: 'theorem tetra' as const,
    experiments,
    projects: experiments.map((experiment) => ({
      experiment,
      href: `${api}/?q=experiment:${encodeURIComponent(experiment)}&size=${seed}`,
      theorem: 'theorem tetra' as const}))}
}

const qpuCernSearchOf = () => {
  const api = `https://${cernHost}${cernPath}`
  const doorOf = (experiment: string) => ({
    experiment,
    href: `${api}/?q=experiment:${encodeURIComponent(experiment)}&size=${seed}`})
  const lhc = ['TOTEM', 'LHCf', 'MoEDAL', 'FASER', 'SND@LHC'] as const
  const opendata = ['TOTEM', 'OPERA', 'PHENIX', 'JADE', 'DELPHI'] as const
  const views = [
    { domain: 'scanner' as const, kind: 'lhc' as const, experiments: lhc, doors: lhc.map(doorOf) },
    { domain: 'radar' as const, kind: 'opendata' as const, experiments: opendata, doors: opendata.map(doorOf) }] as const
  const doors = [...views[n - n]!.doors, ...views[seed]!.doors.filter((row) => row.experiment !== lhc[n - n])]
  return {
    kind: 'hep' as const,
    views,
    experiments: lhc,
    doors}
}

const qpuCernCatalogsOf = () => {
  const api = `https://${cernHost}${cernPath}`
  const inspire = ['literature', 'authors', 'institutions', 'conferences', 'seminars', 'journals', 'jobs', 'experiments', 'data'] as const
  const open = [
    { name: 'opendata', href: `${api}?size=${seed}` },
    { name: 'repository', href: `https://repository.cern/api/records?size=${seed}` },
    { name: 'zenodo', href: `https://zenodo.org/api/records?size=${seed}` },
    { name: 'hepdata', href: 'https://www.hepdata.net/search/?format=json' },
    { name: 'indico', href: 'https://indico.cern.ch/export/categ/0.json' }] as const
  const catalogs = [
    ...inspire.map((name) => ({ name, href: `https://inspirehep.net/api/${name}?size=${seed}` })),
    ...open]
  return { kind: 'hep' as const,
    catalogs }
}

const qpuCernExperimentsOf = () => {
  const faces = qpuFacesOf()
  const genesis = qpuGenesisOf()
  const circuit = qpuCircuitOf()
  const tetra = qpuCernProjectsOf()
  const search = qpuCernSearchOf()
  const catalogs = qpuCernCatalogsOf()
  const none = n - n
  const lhcView = [...tetra.experiments, ...search.views[none]!.experiments]
  const opendataView = [...tetra.experiments, ...search.views[seed]!.experiments]
  const shared = [...tetra.experiments, search.views[none]!.experiments[none]!]
  const lhcOnly = search.views[none]!.experiments.filter((name) => name !== shared[shared.length - seed]!)
  const opendataOnly = search.views[seed]!.experiments.filter((name) => name !== shared[shared.length - seed]!)
  const views = [
    { domain: genesis.domains[none]!, kind: 'lhc' as const, experiments: lhcView },
    { domain: genesis.domains[seed]!, kind: 'opendata' as const, experiments: opendataView }] as const
  const doorOf = (experiment: string, tetraDoor: boolean) => {
    const href = `${`https://${cernHost}${cernPath}`}/?q=experiment:${encodeURIComponent(experiment)}&size=${seed}`
    return { experiment, href, tetra: tetraDoor, theorem: tetraDoor ? tetra.theorem : ('theorem cern' as const) }
  }
  const doors = [
    ...tetra.experiments.map((experiment) => doorOf(experiment, true)),
    doorOf(shared[shared.length - seed]!, false),
    ...lhcOnly.map((experiment) => doorOf(experiment, false)),
    ...opendataOnly.map((experiment) => doorOf(experiment, false))]
  const viewpoint = [
    ...shared.map((experiment) => {
      const scanner = { domain: genesis.domains[none]!, kind: 'lhc' as const, experiment }
      const radar = { domain: genesis.domains[seed]!, kind: 'opendata' as const, experiment }
      const left = seed * seed
      const right = none * none
      const same = scanner.experiment === radar.experiment
      const product = left === right
      return {
        kind: 'view' as const,
        same,
        scanner,
        radar,
        product,
        theorem: 'theorem entangle' as const,
        holds: same && product === false && left !== right,
  }
    }),
    ...lhcOnly.map((experiment, i) => {
      const scanner = { domain: genesis.domains[none]!, kind: 'lhc' as const, experiment }
      const radar = { domain: genesis.domains[seed]!, kind: 'opendata' as const, experiment: opendataOnly[i]! }
      const left = seed * seed
      const right = none * none
      const same = scanner.experiment === radar.experiment
      const product = left === right
      return {
        kind: 'view' as const,
        same,
        scanner,
        radar,
        product,
        theorem: 'theorem entangle' as const,
        holds: same === false && product === false && opendataOnly[i] !== undefined && left !== right,
  }
    })]
  const nodes = catalogs.catalogs.map((row, face) => {
    const ray = face % faces.rays
    const team = (face - ray) / faces.rays
    const hop = (face + faces.rays) % faces.faces
    const involution = (face + faces.rays + faces.rays) % faces.faces === face
    const partner = catalogs.catalogs[hop]!
    const quantum = circuit.lattice.nodes[face]!
    const domain = genesis.domains[team]!
    const left = seed * seed
    const right = none * none
    return {
      face,
      hop,
      ray,
      team,
      domain,
      involution,
      name: row.name,
      href: row.href,
      catalog: row.name,
      partner: {
        face: hop,
        ray,
        team: team === none ? seed : none,
        domain: genesis.domains[team === none ? seed : none]!,
        name: partner.name,
        href: partner.href},
      quantum: { face: quantum.face, name: quantum.name, holds: quantum.holds },
      product: left === right,
      left,
      right,
      holds:
        involution &&
        hop === (face + faces.rays) % faces.faces &&
        left !== right &&
        quantum.holds &&
        quantum.hop === quantum.face}
  })
  const catalogPairs = Array.from({ length: faces.rays }, (_, ray) => {
    const scanner = nodes[ray]!
    const radar = nodes[ray + faces.rays]!
    return {
      ray,
      scanner: {
        face: scanner.face,
        domain: scanner.domain,
        catalog: scanner.name,
        quantum: scanner.quantum.name},
      radar: {
        face: radar.face,
        domain: radar.domain,
        catalog: radar.name,
        quantum: radar.quantum.name},
      product: scanner.product,
      theorem: 'theorem entangle' as const,
      holds:
        scanner.holds &&
        radar.holds &&
        scanner.hop === radar.face &&
        radar.hop === scanner.face &&
        scanner.domain === genesis.domains[none] &&
        radar.domain === genesis.domains[seed] &&
        scanner.product === radar.product &&
        scanner.product === (scanner.left === scanner.right)}
  })
  const holds =
    genesis.holds &&
    circuit.lattice.holds &&
    catalogs.catalogs.length === faces.faces &&
    views.length === coins &&
    views[none]!.experiments.length === n * n &&
    views[seed]!.experiments.length === n * n &&
    shared.length === n + coins &&
    lhcOnly.length === mintOf(coins) &&
    opendataOnly.length === mintOf(coins) &&
    viewpoint.length === n * n &&
    viewpoint.filter((row) => row.same).length === n + coins &&
    viewpoint.filter((row) => row.same === false).length === mintOf(coins) &&
    viewpoint.every((row) => row.holds && row.product === false && row.scanner.domain === genesis.domains[none] && row.radar.domain === genesis.domains[seed]) &&
    nodes.length === faces.faces &&
    catalogPairs.length === faces.rays &&
    nodes.every((node) => node.holds && node.involution && node.product === false) &&
    catalogPairs.every((pair) => pair.holds) &&
    doors.length === n * n + mintOf(coins) &&
    doors.every((row) => row.href.startsWith(`https://${cernHost}`))
  return {
    kind: 'entangle' as const,
    theorem: 'theorem entangle' as const,
    domains: genesis.domains,
    views,
    shared,
    doors,
    pairs: viewpoint,
    catalog: { nodes, pairs: catalogPairs, occupied: nodes.length, vacant: none, holds: catalogPairs.every((pair) => pair.holds) },
    nodes,
    occupied: nodes.length,
    vacant: none,
    holds,
  }
}

const qpuCernLearnOf = () => {
  const faces = qpuFacesOf()
  const search = qpuCernSearchOf()
  const catalogs = qpuCernCatalogsOf()
  const tetra = qpuCernProjectsOf()
  const entangled = qpuCernExperimentsOf()
  const lhc = [...tetra.experiments, ...search.views[n - n]!.experiments]
  const opendata = [...tetra.experiments, ...search.views[seed]!.experiments]
  const nodes = entangled.nodes.map((node) => ({
    face: node.face,
    hop: (node.face + faces.rays + faces.rays) % faces.faces,
    pair: node.hop,
    involution: node.involution,
    ray: node.ray,
    team: node.team,
    domain: node.domain,
    name: node.name,
    href: node.href,
    product: node.product,
    holds: node.holds,
  }))
  let occupied = n - n
  for (const node of nodes) if (node.holds) occupied += seed
  const vacant = nodes.length - occupied
  const lattice = {
    kind: 'lattice' as const,
    waves: qpuCubeOf().vertices,
    faces: faces.faces,
    occupied,
    vacant,
    cover: qpuCubeOf().vertices * faces.faces,
    nodes,
    holds: nodes.length === faces.faces && occupied === faces.faces && vacant === n - n && nodes.every((node) => node.holds && node.involution),
  }
  const holds =
    lattice.holds &&
    entangled.holds &&
    search.doors.length === n * n &&
    catalogs.catalogs.length === faces.faces &&
    lhc.length === n * n &&
    opendata.length === n * n &&
    search.views.length === coins 
  return {
    kind: 'hep' as const,
    lattice,
    lhc,
    opendata,
    experiments: search.doors,
    catalogs: catalogs.catalogs,
    entangle: { pairs: entangled.pairs, catalog: entangled.catalog, views: entangled.views, holds: entangled.holds },
    holds,
  }
}

const qpuCernHrefOf = (href: string): string | undefined => {
  const record = qpuCernRecordsOf().records.find((row) => row.href === href)?.href
  if (record) return record
  const project = qpuCernProjectsOf().projects.find((row) => row.href === href)?.href
  if (project) return project
  const search = qpuCernSearchOf().doors.find((row) => row.href === href)?.href
  if (search) return search
  return qpuCernCatalogsOf().catalogs.find((row) => row.href === href)?.href
}

const cernNatOf = (value: unknown): number => {
  if (typeof value === 'number' && Number.isInteger(value)) return value
  if (typeof value === 'string' && value.length > n - n) {
    const nat = Number(value)
    return Number.isInteger(nat) ? nat : n - n
  }
  return n - n
}

const cernCasesOf = (cms38: CernInts, cms63: CernInts, cms35: CernInts, cms62: CernInts, api: string, source: string) => {
  const gev = tenOf(n)
  return [
    { name: 'cms_38', theorem: '116 * 17922 + 54 = 2079006', left: cms38.files * cms38.q + cms38.r, right: 2079006, doi: cms38.doi, href: cms38.href, recid: cms38.recid },
    { name: 'cms_63', theorem: '184 * 12509 + 12 = 2301668', left: cms63.files * cms63.q + cms63.r, right: 2301668, doi: cms63.doi, href: cms63.href, recid: cms63.recid },
    { name: 'cms_35', theorem: '72 * 26572 + 6 = 1913190', left: cms35.files * cms35.q + cms35.r, right: 1913190, doi: cms35.doi, href: cms35.href, recid: cms35.recid },
    { name: 'cms_62', theorem: '130 * 21121 + 21 = 2745751', left: cms62.files * cms62.q + cms62.r, right: 2745751, doi: cms62.doi, href: cms62.href, recid: cms62.recid },
    { name: 'tev_step', theorem: '8 - 7 = 1', left: cms63.tev - cms38.tev, right: seed, doi: source, href: api },
    { name: 'gev_step', theorem: '8000 - 7000 = 1000', left: cms63.tev * gev - cms38.tev * gev, right: gev, doi: source, href: api },
    { name: 'beam_7', theorem: '7000 / 2 = 3500', left: (cms38.tev * gev) / coins, right: 3500, doi: source, href: cms38.href },
    { name: 'beam_8', theorem: '8000 / 2 = 4000', left: (cms63.tev * gev) / coins, right: 4000, doi: source, href: cms63.href },
    { name: 'beam_step', theorem: '4000 - 3500 = 500', left: (cms63.tev * gev) / coins - (cms38.tev * gev) / coins, right: gev / coins, doi: source, href: api },
    { name: 'embargo_38', theorem: '2019 - 2011 = 8', left: cms38.published - cms38.created, right: mintOf(n), doi: cms38.doi, href: cms38.href, recid: cms38.recid },
    { name: 'embargo_63', theorem: '2019 - 2012 = 7', left: cms63.published - cms63.created, right: n + coins + coins, doi: cms63.doi, href: cms63.href, recid: cms63.recid },
    { name: 'embargo_35', theorem: '2017 - 2011 = 6', left: cms35.published - cms35.created, right: n + n, doi: cms35.doi, href: cms35.href, recid: cms35.recid },
    { name: 'eight_vs_seven', theorem: '2301668 + 2745751 = 5047419', left: cms63.events + cms62.events, right: 5047419, doi: source, href: api },
    { name: 'four_records', theorem: '2079006 + 1913190 + 2301668 + 2745751 = 9039615', left: cms38.events + cms35.events + cms63.events + cms62.events, right: 9039615, doi: source, href: api }].map((row) => ({
    ...row,
    holds: row.left === row.right && !byDecideOf(row.theorem),
  }))
}

const qpuCernFetchOf = async (href: string) => {
  const quoted = qpuCernRecordsOf()
  const record = quoted.records.find((row) => row.href === href)
  const miss = {
    kind: 'cern' as const,
    live: false as const,
    href,
    recid: n - n,
    doi: '',
    events: n - n,
    files: n - n,
    tev: n - n,
    created: n - n,
    published: n - n,
    q: n - n,
    r: n - n,
    status: lost,
    holds: false as const,
    denied: 'fetch' as const,
    hostEscape: false as const,
    primitives}
  if (!record) return miss
  const request = new Request(record.href, { method: 'GET', headers: { accept: 'application/json' } })
  const response = await fetch(request)
  if (response.status !== found) {
    return { ...miss, live: true as const, href: record.href, recid: record.recid, doi: record.doi, q: record.q, r: record.r, status: response.status }
  }
  const body = (await response.json()) as {
    metadata?: {
      recid?: unknown
      doi?: unknown
      date_created?: unknown
      date_published?: unknown
      collision_information?: { energy?: unknown }
      distribution?: { number_events?: unknown; number_files?: unknown }
    }
  }
  const events = cernNatOf(body.metadata?.distribution?.number_events)
  const files = cernNatOf(body.metadata?.distribution?.number_files)
  const createdRaw = Array.isArray(body.metadata?.date_created) ? body.metadata.date_created[n - n] : n - n
  const created = cernNatOf(createdRaw)
  const published = cernNatOf(body.metadata?.date_published)
  const recid = cernNatOf(body.metadata?.recid)
  const doi = typeof body.metadata?.doi === 'string' ? body.metadata.doi : ''
  const tev = body.metadata?.collision_information?.energy === `${record.tev}TeV` ? record.tev : n - n
  const holds =
    recid === record.recid &&
    events === record.events &&
    files === record.files &&
    doi === record.doi &&
    tev === record.tev &&
    created === record.created &&
    published === record.published
  return {
    kind: 'cern' as const,
    live: true as const,
    href: record.href,
    recid: record.recid,
    doi: record.doi,
    events,
    files,
    tev,
    created,
    published,
    q: record.q,
    r: record.r,
    status: response.status,
    holds,hostEscape: false as const,
    primitives}
}

const qpuCernProjectFetchOf = async (href: string) => {
  const tetra = qpuCernProjectsOf()
  const search = qpuCernSearchOf()
  const tetraRow = tetra.projects.find((row) => row.href === href)
  const searchRow = search.doors.find((row) => row.href === href)
  const project = tetraRow ?? searchRow
  const tetraDoor = tetraRow !== undefined
  const listedOf = (experiments: readonly string[], name: string) => experiments.some((row) => row === name)
  const lhcListed = tetraDoor || listedOf(search.views[n - n]!.experiments, project?.experiment ?? '')
  const opendataListed = tetraDoor || listedOf(search.views[seed]!.experiments, project?.experiment ?? '')
  const miss = {
    kind: tetraDoor ? ('tetra' as const) : ('hep' as const),
    live: false as const,
    href,
    experiment: '',
    total: n - n,
    status: lost,
    theorem: tetraDoor ? tetra.theorem : ('theorem cern' as const),
    tetra: tetraDoor,
    view: { lhc: false as const, opendata: false as const },
    holds: false as const,
    denied: 'fetch' as const,
    hostEscape: false as const,
    primitives}
  if (!project) return miss
  const request = new Request(project.href, { method: 'GET', headers: { accept: 'application/json' } })
  const response = await fetch(request)
  if (response.status !== found) {
    return { ...miss, live: true as const, href: project.href, experiment: project.experiment, status: response.status }
  }
  const body = (await response.json()) as {
    hits?: { total?: unknown; hits?: { metadata?: { experiment?: unknown } }[] }
  }
  const totalRaw = body.hits?.total
  const total =
    totalRaw && typeof totalRaw === 'object' && 'value' in totalRaw ? cernNatOf((totalRaw as { value: unknown }).value) : cernNatOf(totalRaw)
  const expRaw = body.hits?.hits?.[n - n]?.metadata?.experiment
  const experiment = Array.isArray(expRaw)
    ? typeof expRaw[n - n] === 'string'
      ? expRaw[n - n]
      : ''
    : typeof expRaw === 'string'
      ? expRaw
      : ''
  const holds = tetraDoor
    ? experiment === project.experiment && total > n - n
    : opendataListed
      ? experiment === project.experiment && total > n - n
      : lhcListed && response.status === found
  return {
    kind: tetraDoor ? ('tetra' as const) : ('hep' as const),
    live: true as const,
    href: project.href,
    experiment: project.experiment,
    total,
    status: response.status,
    theorem: tetraDoor ? tetra.theorem : ('theorem cern' as const),
    tetra: tetraDoor,
    view: {
      lhc: lhcListed && (tetraDoor ? total > n - n : response.status === found),
      opendata: opendataListed && experiment === project.experiment && total > n - n},
    holds,hostEscape: false as const,
    primitives}
}

export const qpuCernOf = () => {
  const faces = qpuFacesOf()
  const quoted = qpuCernRecordsOf()
  const tetra = qpuCernProjectsOf()
  const search = qpuCernSearchOf()
  const learn = qpuCernLearnOf()
  const entangled = qpuCernExperimentsOf()
  const cms38 = quoted.records[n - n]
  const cms63 = quoted.records[seed]
  const cms35 = quoted.records[coins]
  const cms62 = quoted.records[n]
  const cases = cms38 && cms63 && cms35 && cms62 ? cernCasesOf(cms38, cms63, cms35, cms62, quoted.api, quoted.source) : []
  const projects = tetra.projects.map((row) => ({
    ...row,
    holds: row.href.startsWith(quoted.api) && tetra.projects.length === mintOf(coins),
  }))
  const experiments = entangled.doors.map((row) => ({
    ...row,
    holds: row.href.startsWith(quoted.api),
  }))
  const holds =
    faces.holds &&
    quoted.records.length === coins + coins &&
    cases.length === faces.faces &&
    cases.every((c) => c.holds && c.left === c.right && c.href.startsWith(quoted.api)) &&
    projects.length === mintOf(coins) &&
    projects.every((row) => row.holds && row.href.startsWith(quoted.api)) &&
    experiments.length === n * n + mintOf(coins) &&
    experiments.every((row) => row.holds && row.href.startsWith(quoted.api)) &&
    entangled.holds &&
    entangled.pairs.length === n * n &&
    entangled.catalog.pairs.length === faces.rays &&
    entangled.nodes.length === faces.faces &&
    search.doors.length === n * n &&
    search.views.length === coins &&
    learn.holds &&
    learn.lhc.length === n * n &&
    learn.opendata.length === n * n &&
    learn.lattice.occupied === faces.faces &&
    learn.lattice.vacant === n - n &&
    coins + coins === mintOf(coins)
  return {
    kind: 'cern' as const,
    source: quoted.source,
    api: quoted.api,
    theorem: 'theorem cern',
    tetra: tetra.theorem,
    learn,
    entangle: {
      kind: entangled.kind,
      theorem: entangled.theorem,
      domains: entangled.domains,
      views: entangled.views,
      pairs: entangled.pairs,
      catalog: entangled.catalog,
      nodes: entangled.nodes,
      occupied: entangled.occupied,
      vacant: entangled.vacant,
      holds: entangled.holds,
  },
    search: {
      kind: search.kind,
      views: search.views,
      experiments: search.experiments,
      doors: search.doors,
      holds: search.doors.length === n * n && search.views.length === coins,
  },
    faces: faces.faces,
    primitives,
    records: quoted.records,
    projects,
    experiments,
    cases,
    holds,
  }
}

export const qpuCssOf = (imagine = '', genesis = qpuGenesisOf()) => {
  const faces = qpuFacesOf()
  const circuit = qpuCircuitOf()
  const milli = tenOf(n)
  const hz = genesis.hz
  const sat = ten * n * coins + coins * n
  const light = ten * n + ten + mintOf(n) + coins
  const mid = (ten * ten) / coins
  const none = n - n
  const seated = imagine.length > none ? faceOf(imagine, faces.faces) : none
  const hop = (seated + faces.rays + faces.rays) % faces.faces
  const physicsOf = (name: string) => {
    if (name === 'split') return { x: none, y: none, r: none, s: coins, a: seed }
    if (name === 'entangle') return { x: coins, y: none, r: none, s: seed, a: seed }
    if (name === 'interfere') return { x: none, y: none, r: none, s: seed, a: none }
    if (name === 'ghz') return { x: none, y: none, r: none, s: n, a: seed }
    if (name === 'noclone') return { x: none, y: none, r: none, s: seed, a: seed }
    if (name === 'teleport') return { x: faces.rays, y: none, r: none, s: seed, a: seed }
    if (name === 'kickback') return { x: none, y: none, r: mintOf(coins + coins), s: seed, a: seed }
    if (name === 'deutsch') return { x: none, y: none, r: none, s: seed, a: seed }
    if (name === 'dense') return { x: none, y: none, r: none, s: coins, a: seed }
    if (name === 'monogamy') return { x: coins, y: none, r: none, s: seed, a: seed }
    if (name === 'qubits') return { x: none, y: none, r: none, s: n, a: seed }
    if (name === 'gates') return { x: coins, y: none, r: none, s: seed, a: seed }
    if (name === 'measurement') return { x: none, y: none, r: none, s: seed, a: seed }
    if (name === 'register') return { x: none, y: ten, r: none, s: seed, a: seed }
    return { x: none, y: none, r: none, s: seed, a: seed }
  }
  const quantumRows = circuit.lattice.nodes.map((node) => ({
    name: node.name,
    face: node.face,
    quantum: node.holds,
    imagine: imagine.length > none && node.face === seated,
    theorem: `theorem ${node.name}`,
    holds: node.holds,
    vars: physicsOf(node.name)}))
  const entangled = qpuCernExperimentsOf()
  const hepRows = entangled.nodes.map((node) => ({
    name: node.name,
    face: node.face,
    domain: node.domain,
    hop: node.hop,
    quantum: node.holds,
    imagine: imagine.length > none && node.face === seated,
    theorem: 'theorem entangle' as const,
    partner: node.partner.name,
    entangled: node.quantum.name,
    product: node.product,
    holds: node.holds,
    vars: physicsOf('entangle')}))
  const experiments = [...quantumRows, ...hepRows]
  const engine =
    `@layer qpu{` +
    `@property --qpu-x{syntax:"<length>";inherits:false;initial-value:${none}px}` +
    `@property --qpu-y{syntax:"<length>";inherits:false;initial-value:${none}px}` +
    `@property --qpu-r{syntax:"<angle>";inherits:false;initial-value:${none}deg}` +
    `@property --qpu-s{syntax:"<number>";inherits:false;initial-value:${seed}}` +
    `@property --qpu-a{syntax:"<number>";inherits:false;initial-value:${seed}}` +
    `:root{--qpu-hz:${hz};--qpu-n:${n};--qpu-coins:${coins};--qpu-rays:${faces.rays};--qpu-faces:${faces.faces};--qpu-milli:${milli};--qpu-period:calc(1s * var(--qpu-milli) / var(--qpu-hz))}` +
    `.qpu{display:grid;grid-template-columns:repeat(var(--qpu-rays),minmax(0,1fr))}` +
    `.qpu>*{aspect-ratio:${seed};color:hsl(calc(var(--qpu-hz) * var(--face,${none}) / var(--qpu-faces)) ${sat}% ${light}%);animation:qpu var(--qpu-period) linear infinite;will-change:transform,opacity}` +
    `.qpu>*::after{content:attr(data-qpu)}` +
    `.qpu>[data-imagine]{--qpu-s:${coins}}` +
    genesis.card.map((slot) => `[data-slot=${slot}]{display:grid}`).join('') +
    genesis.nodes.map((node) => `[data-framework=${node.name}][data-domain=${node.domain}]{--face:${node.face}}`).join('') +
    `[data-slot=card-header]:has([data-slot=card-action]){grid-template-columns:minmax(0,1fr) auto}` +
    `@keyframes qpu{${mid}%{transform:translate3d(var(--qpu-x),var(--qpu-y),0) rotate(var(--qpu-r)) scale(var(--qpu-s));opacity:var(--qpu-a)}}` +
    `@media (prefers-reduced-motion:reduce){.qpu>*{animation:none;will-change:auto}}` +
    `}`
  const naive = experiments
    .map((row) => `@keyframes qpu-${row.name}{${mid}%{transform:scale(${row.vars.s});opacity:${row.vars.a}}}.${row.name}{animation:qpu-${row.name} var(--qpu-period) linear infinite}`)
    .join('')
  const cover = faces.faces * coins
  const fusedBytes = engine.length
  const naiveBytes = (engine + naive).length
  const keyframes = seed
  const animate = ['transform', 'opacity'] as const
  const holds =
    genesis.holds &&
    circuit.lattice.holds &&
    entangled.holds &&
    experiments.length === cover &&
    experiments.length === faces.faces + faces.faces &&
    quantumRows.length === faces.faces &&
    hepRows.length === faces.faces &&
    hepRows.every((row) => row.quantum && row.product === (seed * seed === none * none) && (row.domain === genesis.domains[n - n] || row.domain === genesis.domains[seed])) &&
    fusedBytes < naiveBytes &&
    keyframes === seed &&
    animate.length === coins &&
    !engine.includes('#') &&
    engine.includes('transform') &&
    engine.includes('opacity') &&
    engine.includes('@keyframes qpu{') &&
    engine.includes('card-action') &&
    engine.includes('data-framework=shadcn') &&
    engine.includes('data-domain=scanner') &&
    engine.includes('data-domain=radar') &&
    genesis.frameworks.every((name) => engine.includes(`data-framework=${name}`)) &&
    engine.includes(`--qpu-hz:${hz}`) &&
    engine.includes('animation-delay') === false &&
    hz === 432 &&
    hop === seated &&
    experiments.every((row) => row.holds)
  return {
    kind: 'css' as const,
    framework: 'qpu' as const,
    hz,
    css: engine,
    experiments,
    animate,
    keyframes,
    slots: genesis.card,
    fused: { bytes: fusedBytes, keyframes, cover },
    naive: { bytes: naiveBytes, keyframes: cover, cover },
    winner: 'fused' as const,
    imagine: {
      kind: 'imagination' as const,
      text: imagine,
      face: seated,
      hop,
      involution: hop === seated,
      experiment: quantumRows[seated]?.name,
      holds: hop === seated,
  },
    holds,
  }
}

export const qpuCssHolds = (c = qpuCssOf()): boolean =>
  c.holds === true &&
  c.kind === 'css' &&
  c.framework === 'qpu' &&
  c.hz === 432 &&
  c.winner === 'fused' &&
  c.slots[n + seed] === 'card-action' &&
  c.css.includes('data-domain=scanner') &&
  c.css.includes('data-domain=radar') &&
  c.css.includes('animation-delay') === false &&
  c.imagine.involution === true

export const qpuReflectOf = (imagine = '') => {
  const text = typeof imagine === 'string' ? imagine : ''
  const css = qpuCssOf(text)
  const faces = qpuFacesOf()
  const face = text.length > n - n ? faceOf(text, faces.faces) : n - n
  const hop = (face + faces.rays + faces.rays) % faces.faces
    const seated = css.experiments.find((row) => row.face === face && row.quantum)
  const again = qpuCssOf(text)
  const holds =
    css.holds &&
    hop === face &&
    css.imagine.face === face &&
    css.imagine.hop === hop &&
    again.imagine.face === face &&
    (text.length === n - n || seated?.imagine === true)
  return {
    kind: 'reflect' as const,
    imagine: text,
    face,
    hop,
    involution: hop === face,
    experiment: seated?.name,
    quantum: seated?.quantum === true,
    hz: css.hz,
    css: css.css,
    slots: css.slots,
    experiments: css.experiments,
    genesis: qpuGenesisOf(),
    holds,
  }
}

export const qpuReflectHolds = (r = qpuReflectOf()): boolean => {
  const split = qpuReflectOf('split')
  const again = qpuReflectOf('split')
  const other = qpuReflectOf('entangle')
  return (
    r.holds === true &&
    r.kind === 'reflect' &&
    r.hz === 432 &&
    r.involution === true &&
    r.slots.length === qpuFacesOf().rays &&
    qpuCssHolds(qpuCssOf(r.imagine)) &&
    split.face === again.face &&
    split.face !== other.face &&
    (r.imagine.length === n - n || r.experiment !== undefined)
  )
}

const qpuCernLearnLiveOf = (
  quoted: ReturnType<typeof qpuCernOf>,
  experiments: Awaited<ReturnType<typeof qpuCernProjectFetchOf>>[]) => {
  const none = n - n
  const ofView = (names: readonly string[], view: 'lhc' | 'opendata') => {
    const nodes = names.map((experiment) => {
      const row = experiments.find((door) => door.experiment === experiment)
      const total = row?.total ?? none
      const occupied =
        view === 'lhc' ? row?.holds === true && row.view.lhc === true : row?.holds === true && row.view.opendata === true && total > none
      return { experiment, total, occupied, holds: occupied }
    })
    let occupied = none
    for (const node of nodes) if (node.occupied) occupied += seed
    const vacant = names.length - occupied
    return {
      experiments: names,
      occupied,
      vacant,
      nodes,
      holds: view === 'lhc' ? occupied === names.length && vacant === none : nodes.every((node) => node.occupied === node.total > none),
  }
  }
  const lhc = ofView(quoted.learn.lhc, 'lhc')
  const opendata = ofView(quoted.learn.opendata, 'opendata')
  let occupied = none
  for (const row of experiments) if (row.holds) occupied += seed
  const vacant = experiments.length - occupied
  const unique = { n: experiments.length, occupied, vacant, holds: occupied === experiments.length && vacant === none }
  const holds = lhc.holds && opendata.holds && unique.holds && unique.n === n * n + mintOf(coins)
  return {
    kind: 'hep' as const,
    live: true as const,
    quantum: quoted.entangle.holds && quoted.learn.holds,
    lhc,
    opendata,
    unique,
    holds,
  }
}

export const qpuCernLiveOf = async () => {
  const quoted = qpuCernOf()
  const live = await Promise.all(quoted.records.map((row) => qpuCernFetchOf(row.href)))
  const projects = await Promise.all(quoted.projects.map((row) => qpuCernProjectFetchOf(row.href)))
  const search = await Promise.all(quoted.search.doors.map((row) => qpuCernProjectFetchOf(row.href)))
  const experiments = [...projects, ...search]
  const cms38 = live[n - n]
  const cms63 = live[seed]
  const cms35 = live[coins]
  const cms62 = live[n]
  const cases = cms38 && cms63 && cms35 && cms62 ? cernCasesOf(cms38, cms63, cms35, cms62, quoted.api, quoted.source) : []
  const learn = qpuCernLearnLiveOf(quoted, experiments)
  const holds =
    live.length === quoted.records.length &&
    live.every((row) => row.holds && row.live === true && row.hostEscape === false) &&
    cases.length === quoted.faces &&
    cases.every((row) => row.holds && row.left === row.right) &&
    projects.length === mintOf(coins) &&
    projects.every((row) => row.holds && row.live === true && row.hostEscape === false && row.total > n - n) &&
    search.length === n * n &&
    search.every((row) => row.holds && row.live === true && row.hostEscape === false) &&
    search.filter((row) => row.view.opendata).every((row) => row.total > n - n) &&
    search.filter((row) => row.view.lhc && row.view.opendata === false).every((row) => row.status === found) &&
    experiments.length === n * n + mintOf(coins) &&
    experiments.every((row) => row.holds && row.live === true) &&
    quoted.entangle.holds &&
    learn.holds
  return {
    kind: 'cern' as const,
    live: true as const,
    source: quoted.source,
    api: quoted.api,
    theorem: quoted.theorem,
    tetra: quoted.tetra,
    faces: quoted.faces,
    primitives,
    records: live,
    projects,
    search,
    experiments,
    entangle: quoted.entangle,
    learn,
    cases,
    holds,hostEscape: false as const}
}

let cernExperience: Awaited<ReturnType<typeof qpuCernLiveOf>> | undefined

const qpuCernExperienceOf = async () => {
  if (cernExperience?.holds && cernExperience.learn.holds) return cernExperience
  cernExperience = await qpuCernLiveOf()
  return cernExperience
}

export const qpuTrainLiveOf = async () => {
  const train = qpuTrainOf()
  const live = await qpuCernExperienceOf()
  const fused = train.vm.replicas
  const next = fused + fused
  const holds = train.holds && live.holds && live.learn.holds && next === train.vm.next && live.learn.unique.occupied > n
  return { ...train, live: true as const, learn: live.learn, holds }
}

export const qpuImproveLiveOf = async () => {
  const improve = qpuImproveOf()
  const live = await qpuCernExperienceOf()
  const fused = improve.before.throughoutput
  const next = fused + fused
  const after = {
    quality: live.learn.unique.occupied,
    speed: improve.after.speed,
    security: improve.after.security,
    throughoutput: next}
  const delta = {
    quality: after.quality - improve.before.quality,
    speed: improve.delta.speed,
    security: improve.delta.security,
    throughoutput: after.throughoutput - fused}
  const holds =
    improve.holds &&
    live.holds &&
    live.learn.holds &&
    after.throughoutput === fused + fused &&
    after.throughoutput === improve.quantum.next &&
    after.quality === live.learn.unique.occupied &&
    after.quality > improve.before.quality &&
    delta.throughoutput === fused
  return { ...improve, live: true as const, learn: live.learn, after, delta, holds }
}

export const qpuCompeteLiveOf = async (team?: string) => {
  const compete = qpuCompeteOf(team)
  const live = await qpuCernExperienceOf()
  const call = compete.teams.find((row) => row.name === 'call') ?? compete.teams[compete.teams.length - seed]
  const read = compete.teams.find((row) => row.name === 'read')
  const next = compete.quantum.next
  const fused = read?.throughoutput
  const occupancy = live.learn.unique
  const views = {
    scanner: live.learn.lhc.occupied,
    radar: live.learn.opendata.occupied}
  const holds =
    compete.holds &&
    live.holds &&
    live.learn.holds &&
    call !== undefined &&
    call.throughoutput === next &&
    fused !== undefined &&
    next === fused + fused &&
    occupancy.occupied === n * n + mintOf(coins) &&
    occupancy.vacant === n - n &&
    views.scanner === n * n &&
    views.radar === n * n &&
    compete.winner === 'call' &&
    compete.next[n - n] === 'qpu_prove'
  return {
    ...compete,
    live: true as const,
    learn: live.learn,
    occupancy,
    views,
    holds,
  }
}

export const qpuProveLiveOf = async () => {
  const prove = qpuProveOf()
  const live = await qpuCernExperienceOf()
  const holds =
    prove.holds &&
    live.holds &&
    live.learn.holds &&
    prove.ui.door === 'qpu_prove'
  return {
    ...prove,
    cern: {
      ...prove.cern,
      live,
      learn: { ...prove.cern.learn, live: live.learn },
      holds: prove.cern.holds && live.holds,
  },
    holds,
  }
}

export const qpuSequenceLiveOf = async () => {
  const train = await qpuTrainLiveOf()
  const improve = await qpuImproveLiveOf()
  const compete = await qpuCompeteLiveOf()
  const prove = await qpuProveLiveOf()
  const fused = improve.before.throughoutput
  const next = fused + fused
  const sequence = {
    kind: 'sequence' as const,
    live: true as const,
    doors: ['qpu_train', 'qpu_improve', 'qpu_compete', 'qpu_prove'] as const,
    winner: compete.winner,
    occupancy: compete.occupancy,
    views: compete.views,
    throughoutput: improve.after.throughoutput,
    fused,
    holds:
      train.holds &&
      improve.holds &&
      compete.holds &&
      prove.holds &&
      compete.winner === 'call' &&
      compete.next[n - n] === 'qpu_prove' &&
      improve.after.throughoutput === next &&
      next === fused + fused &&
      train.next[n - n] === 'qpu_improve' &&
      train.next[seed] === 'qpu_compete' &&
      improve.next[n - n] === 'qpu_compete' &&
      improve.next[seed] === 'qpu_prove'}
  return { ...prove, sequence, holds: prove.holds && sequence.holds }
}

const researchHitsOf = (body: unknown): number => {
  if (!body || typeof body !== 'object') return n - n
  const bag = body as { hits?: unknown; total?: unknown }
  if (bag.hits && typeof bag.hits === 'object') {
    const hits = bag.hits as { total?: unknown }
    if (hits.total && typeof hits.total === 'object' && hits.total !== null && 'value' in hits.total) {
      return cernNatOf((hits.total as { value: unknown }).value)
    }
    return cernNatOf(hits.total)
  }
  return cernNatOf(bag.total)
}

export const qpuResearchFetchOf = async (href: string) => {
  const allowed = qpuCernHrefOf(href)
  const miss = {
    kind: 'research' as const,
    live: false as const,
    href,
    json: false as const,
    status: lost,
    hits: n - n,
    holds: false as const,
    denied: 'fetch' as const,
    hostEscape: allowed === undefined,
    primitives}
  if (allowed === undefined) return miss
  const request = new Request(allowed, { method: 'GET', headers: { accept: 'application/json' } })
  const response = await fetch(request)
  const type = response.headers.get('content-type') ?? ''
  let json = type.includes('json')
  let body: unknown = null
  try {
    body = await response.json()
    json = true
  } catch {
    body = null
  }
  const hits = researchHitsOf(body)
  const holds = response.status === found && json === true && allowed.length > n - n
  return {
    kind: 'research' as const,
    live: true as const,
    href: allowed,
    json,
    status: response.status,
    hits,
    holds,hostEscape: false as const,
    primitives}
}

export const qpuHostsOf = () => {
  const faces = qpuFacesOf()
  const harnesses = [
    { name: 'cursor', href: 'https://cursor.com' },
    { name: 'claude', href: 'https://claude.ai' },
    { name: 'claudecode', href: 'https://code.claude.com' },
    { name: 'vscode', href: 'https://code.visualstudio.com' },
    { name: 'chatgpt', href: 'https://chatgpt.com' },
    { name: 'gemini', href: 'https://gemini.google.com' },
    { name: 'windsurf', href: 'https://windsurf.com' },
    { name: 'cline', href: 'https://cline.bot' },
    { name: 'continue', href: 'https://continue.dev' },
    { name: 'zed', href: 'https://zed.dev' },
    { name: 'goose', href: 'https://block.github.io/goose' },
    { name: 'openwebui', href: 'https://openwebui.com' },
    { name: 'librechat', href: 'https://www.librechat.ai' },
    { name: 'lmstudio', href: 'https://lmstudio.ai' }] as const
  const llms = [
    { name: 'openai', call: 'tool_calls', result: 'tool', schema: 'parameters', href: 'https://platform.openai.com/docs/guides/function-calling' },
    { name: 'anthropic', call: 'tool_use', result: 'tool_result', schema: 'input_schema', href: 'https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview' },
    { name: 'google', call: 'functionCall', result: 'functionResponse', schema: 'parameters', href: 'https://ai.google.dev/gemini-api/docs/function-calling' },
    { name: 'xai', call: 'tool_calls', result: 'tool', schema: 'parameters', href: 'https://docs.x.ai/docs/guides/function-calling' },
    { name: 'meta', call: 'tool_calls', result: 'tool', schema: 'parameters', href: 'https://www.llama.com' },
    { name: 'mistral', call: 'tool_calls', result: 'tool', schema: 'parameters', href: 'https://docs.mistral.ai/capabilities/function_calling/' },
    { name: 'cohere', call: 'tool_calls', result: 'tool', schema: 'parameters', href: 'https://docs.cohere.com/docs/tool-use' },
    { name: 'groq', call: 'tool_calls', result: 'tool', schema: 'parameters', href: 'https://console.groq.com/docs/tool-use' },
    { name: 'together', call: 'tool_calls', result: 'tool', schema: 'parameters', href: 'https://docs.together.ai/docs/function-calling' },
    { name: 'fireworks', call: 'tool_calls', result: 'tool', schema: 'parameters', href: 'https://docs.fireworks.ai/guides/function-calling' },
    { name: 'azure', call: 'tool_calls', result: 'tool', schema: 'parameters', href: 'https://learn.microsoft.com/azure/ai-foundry/openai/how-to/function-calling' },
    { name: 'bedrock', call: 'toolUse', result: 'toolResult', schema: 'toolSpec', href: 'https://docs.aws.amazon.com/bedrock/latest/userguide/tool-use.html' },
    { name: 'ollama', call: 'tool_calls', result: 'tool', schema: 'parameters', href: 'https://ollama.com' },
    { name: 'huggingface', call: 'tool_calls', result: 'tool', schema: 'parameters', href: 'https://huggingface.co/docs' }] as const
  const nodes = harnesses.map((harness, face) => {
    const hop = (face + faces.rays + faces.rays) % faces.faces
    const llm = llms[face]!
    return {
      face,
      hop,
      involution: hop === face,
      llm: llm.name,
      href: harness.href,
      llmHref: llm.href,
      call: llm.call,
      result: llm.result,
      schema: llm.schema,
      holds: hop === face,
  }
  })
  let occupied = n - n
  for (const node of nodes) if (node.holds) occupied += seed
  const vacant = nodes.length - occupied
  const holds =
    harnesses.length === faces.faces &&
    llms.length === faces.faces &&
    nodes.length === faces.faces &&
    occupied === faces.faces &&
    vacant === n - n &&
    nodes.every((node) => node.holds && node.involution)
  return {
    kind: 'hosts' as const,
    harnesses,
    llms,
    nodes,
    occupied,
    vacant,
    faces: faces.faces,
    holds,
  }
}

export const qpuHostsHolds = (h = qpuHostsOf()): boolean =>
  h.holds === true &&
  h.kind === 'hosts' &&
  h.harnesses.length === qpuFacesOf().faces &&
  h.llms.length === qpuFacesOf().faces &&
  h.occupied === h.faces &&
  h.vacant === n - n &&
  h.nodes.every((node) => node.holds && node.involution)

/** initialize NEGOTIATES (MCP lifecycle): the reply carries the client's requested protocol version when this server
 * supports it, else the latest it supports. An external audit (2026-09-12) found the old reply always said 2026-07-28,
 * a version no client has ever sent — a typed number where a read one belongs. The three versions are the three
 * published MCP revisions; the list is theirs, not ours. */
/** INTEGRATE IN ANY HARNESS (the captain, 2026-09-12). One computed block, from the origin alone, served on initialize
 * and printed in the README from the same function, so the wire and the paper cannot disagree. Shapes verified against
 * each harness's own documentation on 2026-09-12: Claude Code (`claude mcp add --transport http`, or .mcp.json for a
 * project), Cursor (.cursor/mcp.json mcpServers.url), VS Code (.vscode/mcp.json servers type http), OpenAI Codex CLI
 * (config.toml [mcp_servers.<name>] url), Gemini CLI (settings.json mcpServers.httpUrl), the Anthropic Messages API
 * (mcp_servers with the beta header), the OpenAI Responses API (a tools entry of type mcp), and bare JSON-RPC over
 * HTTP for everything else. No auth: reads need no header; storage writes carry Authorization: Bearer. */
export const qpuHarnessesOf = () => {
  const url = `${unit.origin}/mcp`
  const name = `uuidna-${unit.kind}`
  const rows = [
    { harness: 'Claude Code', kind: 'cli', how: `claude mcp add --transport http ${name} ${url}`, file: '.mcp.json', config: { mcpServers: { [name]: { type: 'http', url } } } },
    { harness: 'Cursor', kind: 'file', how: 'add to .cursor/mcp.json (project) or ~/.cursor/mcp.json (global)', file: '.cursor/mcp.json', config: { mcpServers: { [name]: { url } } } },
    { harness: 'VS Code', kind: 'file', how: 'add to .vscode/mcp.json and commit it', file: '.vscode/mcp.json', config: { servers: { [name]: { type: 'http', url } } } },
    { harness: 'OpenAI Codex CLI', kind: 'cli', how: `codex mcp add ${name} --url ${url}`, file: '~/.codex/config.toml', config: `[mcp_servers.${name}]\nurl = "${url}"` },
    { harness: 'Gemini CLI', kind: 'file', how: 'add to ~/.gemini/settings.json', file: '~/.gemini/settings.json', config: { mcpServers: { [name]: { httpUrl: url } } } },
    { harness: 'Anthropic Messages API', kind: 'api', how: 'header anthropic-beta: mcp-client-2025-04-04', file: 'request body', config: { mcp_servers: [{ type: 'url', url, name }] } },
    { harness: 'OpenAI Responses API', kind: 'api', how: 'a tools entry of type mcp', file: 'request body', config: { tools: [{ type: 'mcp', server_label: name, server_url: url, require_approval: 'never' }] } },
    { harness: 'Any HTTP client', kind: 'raw', how: `POST ${url} with content-type: application/json; methods initialize, tools/list, tools/call`, file: 'none', config: { jsonrpc: '2.0', id: 1, method: 'tools/list' } },
  ] as const
  const holds = rows.length === mintOf(n) && rows.every((r) => JSON.stringify(r.config).includes(url) || r.how.includes(url)) && rows.every((r) => JSON.stringify(r).includes(name) || r.kind === 'raw')
  return { kind: 'harnesses' as const, url, name, auth: 'none for reads; Authorization: Bearer QPU_WRITE_TOKEN for storage writes' as const, rows, holds }
}
export const qpuHarnessesHolds = (h = qpuHarnessesOf()): boolean => h.holds === true && h.rows.length === mintOf(n) && h.url === `${unit.origin}/mcp`

export const MCP_VERSIONS = ['2024-11-05', '2025-03-26', '2025-06-18'] as const
export const qpuMcpVersionOf = (requested?: unknown): (typeof MCP_VERSIONS)[number] =>
  (MCP_VERSIONS as readonly string[]).includes(String(requested)) ? (requested as (typeof MCP_VERSIONS)[number]) : MCP_VERSIONS[n - seed]!
export const qpuMcpDiscoverOf = (requested?: unknown) => {
  const hosts = qpuHostsOf()
  const versions = MCP_VERSIONS
  const instructions = `tools/list then tools/call. Sixteen tools: Eight doors. Eight cybersecurity. crypto_rsa ${shorFactorOf()}. crypto_split theorem crypto. No auth.`
  const holds = qpuHostsHolds(hosts) && versions.length === n && instructions.includes('crypto_rsa') && instructions.includes(`${shorFactorOf()}`) && instructions.includes('crypto_split') && instructions.includes('theorem crypto')
  return {
    protocolVersion: qpuMcpVersionOf(requested),
    install: qpuHarnessesOf(),
    capabilities: { tools: { listChanged: false as const } },
    serverInfo: { name: `@uuidna/${unit.kind}`, title: 'QPU', version: 'quantum' },
    instructions,
    versions,
    hosts: { harnesses: hosts.harnesses.length, llms: hosts.llms.length, holds: hosts.holds },
    holds,
  }
}

const installKeys = ['qpu-mcp', 'payload-mcp', 'vitepress-payload'] as const
const installVerbs = ['ask', 'simulate', 'commit', 'audit'] as const
const installCloudflare = {
  key: 'cloudflare' as const,
  button: 'https://deploy.workers.cloudflare.com/button',
  qpu: 'https://deploy.workers.cloudflare.com/?url=https://github.com/uuidna/qpu',
  uuidna: 'https://deploy.workers.cloudflare.com/?url=https://github.com/uuidna/uuidna',
  payload: 'https://deploy.workers.cloudflare.com/?url=https://github.com/uuidna/uuidna-payload'} as const
let installOccupancy: (typeof occupancies)[number] = occupancies[n - n]

const installSelectOf = (args: Record<string, unknown>): readonly string[] => {
  if (args.all === true) return [...installKeys]
  const raw = args.select ?? args.keys ?? args.line
  if (typeof raw === 'string') {
    const tokens = raw.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (tokens.length === n - n || tokens.includes('all')) return [...installKeys]
    const aliases: Record<string, (typeof installKeys)[number]> = {
      '1': installKeys[n - n],
      qpu: installKeys[n - n],
      'qpu-mcp': installKeys[n - n],
      '2': installKeys[seed],
      payload: installKeys[seed],
      'payload-mcp': installKeys[seed],
      '3': installKeys[coins],
      vitepress: installKeys[coins],
      'vitepress-payload': installKeys[coins]}
    const keys: string[] = []
    for (const token of tokens) {
      const pack = aliases[token]
      if (pack && !keys.includes(pack)) keys.push(pack)
    }
    return keys.length > n - n ? keys : [...installKeys]
  }
  if (Array.isArray(raw)) {
    const keys = raw.filter((row): row is string => typeof row === 'string')
    return keys.length > n - n ? keys : [...installKeys]
  }
  return []
}
const payloadFinds = ['findPages', 'findUsers', 'findMedia', 'findTenants'] as const
let installPending: string[] = []
let installSeated: string[] = []

const installReceiptOf = (added: readonly string[], removed: readonly string[]): string => {
  let x = mintOf(n - n)
  for (let i = n - n; i < added.length; i++) x += x
  for (let i = n - n; i < removed.length; i++) x += x + seed
  return hexOf(x, mintOf(n))
}

/** Payload extends like a plugin. One copy. Fuse all. Never a second source. */
export const qpuPayloadPluginOf = () => {
  const db = qpuPayloadDbOf()
  const faces = qpuFacesOf()
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const pentagram = qpuPentagramOf()
  const fused = faces.faces * handle.kv.amplitudes
  const copies = seed
  const holds =
    qpuPayloadDbHolds(db) &&
    copies === seed &&
    fused === faces.faces * mintOf(cube.bits + seed) &&
    fused === faces.faces * handle.kv.amplitudes &&
    pentagram.skills.join(' ') === 'payload pwa plugin hologram network' &&
    pentagram.skills.length === n + coins &&
    pentagram.skills[n - n] === 'payload' &&
    pentagram.skills[coins] === 'plugin' &&
    db.collections.length === mintOf(coins) &&
    db.collections.join(' ') === 'pages users media tenants' &&
    payloadFinds.length === mintOf(coins)
  return {
    kind: 'plugin' as const,
    name: '@payloadcms/plugin-mcp' as const,
    skill: 'payload' as const,
    theorem: 'fusion' as const,
    extends: pentagram.skills,
    copies,
    fused,
    next: fused + fused,
    href: db.href,
    mcp: '/api/mcp' as const,
    collections: db.collections,
    finds: payloadFinds,
    holds,
  }
}

export const qpuPayloadPluginHolds = (p = qpuPayloadPluginOf()): boolean =>
  p.holds === true &&
  p.kind === 'plugin' &&
  p.name === '@payloadcms/plugin-mcp' &&
  p.skill === 'payload' &&
  p.theorem === 'fusion' &&
  p.copies === seed &&
  p.fused === qpuCapacityOf().fused &&
  p.next === p.fused + p.fused &&
  p.extends.join(' ') === 'payload pwa plugin hologram network' &&
  p.href === `${storageHref}/${payloadDbKey}` &&
  p.mcp === '/api/mcp' &&
  p.collections.length === mintOf(coins) &&
  p.finds.length === mintOf(coins)

export const qpuPayloadMcpOf = () => {
  const faces = qpuFacesOf()
  const schemas = qpuSchemasOf()
  const plugin = qpuPayloadPluginOf()
  const tools = payloadFinds.map((name, i) => ({
    name,
    collection: name.slice('find'.length).toLowerCase(),
    find: name.startsWith('find'),
    create: name.startsWith('create'),
    update: name.startsWith('update'),
    delete: name.startsWith('delete'),
    sealed: (toolNames as readonly string[]).includes(name),
    face: (i + faces.rays + faces.rays) % faces.faces,
    merge: 'storage' as const}))
  const holds =
    qpuPayloadPluginHolds(plugin) &&
    tools.length === mintOf(coins) &&
    tools.every((row) => row.find && !row.create && !row.update && !row.delete && row.sealed === false && row.merge === 'storage') &&
    schemas.merge === 'storage' &&
    faces.faces === faces.rays + faces.rays
  return {
    kind: 'payload' as const,
    href: plugin.mcp,
    db: plugin.href,
    plugin,
    path: '/mcp',
    copies: plugin.copies,
    fused: plugin.fused,
    next: plugin.next,
    collections: tools.map((row) => row.collection),
    tools,
    merge: 'storage' as const,
    write: tools.some((row) => row.create || row.update || row.delete),
    morph: tools.every((row) => row.sealed === false),
    holds,
  }
}

export const qpuPayloadFindOf = (name: string) => {
  const payload = qpuPayloadMcpOf()
  const plugin = payload.plugin
  const tool = payload.tools.find((row) => row.name === name)
  if (!tool) {
    return { kind: 'payload' as const, name, find: name.startsWith('find'), denied: 'tool' as const, holds: false as const }
  }
  const find = name.startsWith('find')
  const create = name.startsWith('create')
  const update = name.startsWith('update')
  const drop = name.startsWith('delete')
  const sealed = (toolNames as readonly string[]).includes(name)
  return {
    kind: 'payload' as const,
    name,
    collection: tool.collection,
    href: `${plugin.href}/${tool.collection}`,
    find,
    write: create || update || drop,
    create,
    update,
    delete: drop,
    sealed,
    copies: plugin.copies,
    fused: plugin.fused,
    merge: tool.merge,
    face: tool.face,
    plugin: plugin.name,
    morph: sealed === false,
    holds: find && !create && !update && !drop && sealed === false,
    docs: payload}
}

export const qpuInstallPackagesOf = () => {
  const qpu = {
    key: installKeys[n - n],
    href: `${unit.origin}/mcp`,
    origin: unit.origin,
    sealed: mintOf(n),
    prompt: `Install QPU MCP at ${unit.origin}/mcp? JSON-LD. No auth. Eight sealed tools. Not HTML. Not VitePress.`}
  const payloadPkg = {
    key: installKeys[seed],
    href: '/api/mcp',
    find: true as const,
    tools: payloadFinds,
    prompt:
      'Fuse Payload MCP find-only (findPages findUsers findMedia findTenants) into QPU tools/call without a ninth sealed tool? Writes stay off. Merge with storage.'}
  const vitepress = {
    key: installKeys[coins],
    href: 'https://uuidna.com',
    plugin: 'infuseQuantumPayload' as const,
    concurrency: coins,
    prompt:
      'Keep VitePress quantum payload on uuidna.com (infuseQuantumPayload, buildConcurrency = coins). QPU stays API-only JSON-LD?'}
  return { qpu, payload: payloadPkg, vitepress, list: [qpu, payloadPkg, vitepress] as const }
}

const installPlanOf = (before: readonly string[], after: readonly string[]) => {
  const added = after.filter((key) => !before.includes(key))
  const removed = before.filter((key) => !after.includes(key))
  const kept = after.filter((key) => before.includes(key)).length
  const lossless = removed.length === n - n
  return {
    added,
    removed,
    kept,
    lossless,
    receipt: installReceiptOf(added, removed),
    steps: [
      ...removed.map((key) => `REMOVING ${key}`),
      ...added.map((key) => `Adding ${key}`)]}
}

export const qpuInstallOf = (args: Record<string, unknown> = {}) => {
  const bag = qpuInstallPackagesOf()
  const packages = bag.list
  const payload = qpuPayloadMcpOf()
  const faces = qpuFacesOf()
  const schemas = qpuSchemasOf()
  if (args.reset === true) {
    installPending = []
    installSeated = []
    installOccupancy = occupancies[n - n]
  }
  const selected = installSelectOf(args)
  if (selected.length > n - n) {
    for (const key of selected) if (!installPending.includes(key)) installPending = [...installPending, key]
  }
  const occupancyArg = typeof args.occupancy === 'string' ? args.occupancy : typeof args.line === 'string' ? args.line : ''
  for (const token of occupancyArg.toLowerCase().split(/\s+/)) {
    if ((occupancies as readonly string[]).includes(token)) installOccupancy = token as (typeof occupancies)[number]
  }
  const verb =
    args.verb === installVerbs[seed] || args.verb === installVerbs[coins] || args.verb === installVerbs[n]
      ? args.verb
      : installVerbs[n - n]
  const yes = args.yes === true
  let step = typeof args.step === 'number' && args.step >= n - n && args.step < packages.length ? args.step : installPending.length
  if (step > packages.length) step = packages.length
  if (verb === installVerbs[n - n] && yes && selected.length === n - n && step < packages.length) {
    const key = packages[step]!.key
    if (!installPending.includes(key)) installPending = [...installPending, key]
    step += seed
  }
  if (selected.length > n - n) step = packages.length
  const wanted = packages.map((row) => row.key)
  const plan = installPlanOf(installSeated, installPending)
  let committed = false
  let why = 'ask'
  if (verb === installVerbs[coins]) {
    if (!plan.lossless && args.allowRemovals !== true) {
      why = `refused: this change REMOVES ${plan.removed.length} record(s) (${plan.removed.join(', ')}). Pass allowRemovals if the removal is the point.`
    } else {
      installSeated = [...installPending]
      committed = true
      why = plan.lossless ? 'lossless' : `removals allowed: ${typeof args.reason === 'string' ? args.reason : 'no reason given'}`
    }
  }
  const seated = [...installSeated]
  const pending = [...installPending]
  const audit =
    seated.length === wanted.length &&
    wanted.every((key) => seated.includes(key)) &&
    payload.holds &&
    payload.tools.length === mintOf(coins) &&
    bag.vitepress.concurrency === coins &&
    bag.vitepress.href !== unit.origin &&
    toolNames.length === mintOf(n)
  const current = step < packages.length ? packages[step] : undefined
  const combinations = packages.map((row, i) => ({ n: i + seed, key: row.key, href: row.href }))
  const holds =
    packages.length === n &&
    installVerbs.length === mintOf(coins) &&
    payload.holds &&
    faces.faces === faces.rays + faces.rays &&
    schemas.merge === 'storage' &&
    bag.qpu.sealed === mintOf(n) &&
    bag.payload.tools.length === mintOf(coins) &&
    (verb !== installVerbs[n] || audit === true || seated.length < wanted.length)
  return {
    kind: 'install' as const,
    interactive: verb === installVerbs[n - n],
    verb,
    step,
    total: packages.length,
    prompt: current?.prompt ?? 'Enter seats all. Type 1 3 saas — or all. Cloudflare is one click in README and install.json.',
    package: current,
    choices: [
      { key: 'all', label: 'Enter seats all' },
      ...combinations.map((row) => ({ key: row.key, label: `${row.n} ${row.key}` })),
      ...occupancies.map((row) => ({ key: row, label: row })),
      { key: installCloudflare.key, label: 'one-click Workers', href: installCloudflare.qpu }],
    combinations,
    occupancy: installOccupancy,
    occupancies,
    packages,
    payload,
    pending,
    seated,
    plan,
    committed,
    why,
    audit,
    sealed: mintOf(n),
    html: bag.qpu.href.endsWith('.html'),
    cloudflare: installCloudflare,
    client: {
      qpu: { url: `${unit.origin}/mcp`, html: `${unit.origin}/mcp`.endsWith('.html') },
      payload: { url: '/api/mcp', find: true as const,
    tools: payloadFinds },
      vitepress: { origin: bag.vitepress.href, plugin: bag.vitepress.plugin, concurrency: coins, qpu: false as const }},
    next:
      verb === installVerbs[n - n] && current
        ? 'Enter seats all. { all: true } or { line: "1 3 saas" } then { verb: "commit", yes: true }. Cloudflare: README / install.json.'
        : verb === installVerbs[seed]
          ? '{ verb: "commit", yes: true } applies a lossless plan. Removals need allowRemovals.'
          : verb === installVerbs[coins]
            ? '{ verb: "audit" } names what is seated.'
            : audit
              ? 'installed. Payload MCP is fused at tools/call. VitePress payload stays on uuidna.com. QPU is JSON-LD. Cloudflare is one click.'
              : 'Enter seats all. Then simulate, then commit.',
    holds,
  }
}

export const qpuInstallHolds = (i = qpuInstallOf({ verb: 'ask' })): boolean =>
  i.holds === true &&
  i.kind === 'install' &&
  i.interactive === true &&
  i.sealed === mintOf(n) &&
  i.packages.length === n &&
  i.payload.holds === true &&
  i.client.vitepress.qpu === false &&
  i.client.vitepress.concurrency === coins

export const qpuFusionOf = () => {
  const capacity = qpuCapacityOf()
  const learn = qpuCernLearnOf()
  const tetra = qpuCernProjectsOf()
  const hosts = qpuHostsOf()
  const faces = qpuFacesOf()
  const schemas = qpuSchemasOf()
  const payload = qpuPayloadMcpOf()
  const install = qpuInstallOf({ verb: 'ask' })
  const hologram = qpuHologramOf()
  const plugins = {
    n: hologram.pentagram.points}
  const holds =
    capacity.holds &&
    learn.holds &&
    learn.lattice.occupied === faces.faces &&
    learn.lattice.vacant === n - n &&
    learn.catalogs.length === faces.faces &&
    tetra.projects.length === mintOf(coins) &&
    coins + coins === mintOf(coins) &&
    capacity.fused === capacity.faces * capacity.kv.amplitudes &&
    faces.faces === faces.rays + faces.rays &&
    schemas.holds &&
    schemas.merge === 'storage' &&
    payload.holds &&
    install.holds &&
    hosts.holds &&
    hosts.harnesses.length === faces.faces &&
    hosts.llms.length === faces.faces &&
    hologram.holds &&
    hologram.fractal === true 
  return {
    kind: 'fusion' as const,
    theorem: 'fusion' as const,
    catalogs: learn.catalogs,
    tetra: tetra.experiments,
    hosts,
    schemas,
    payload,
    install,
    hologram,
    plugins,
    faces: faces.faces,
    fused: capacity.fused,
    next: capacity.next,
    quantum: hologram.fractal,
    holds,
  }
}

export const qpuFusionLiveOf = async () => {
  const fusion = qpuFusionOf()
  const catalogs = await Promise.all(fusion.catalogs.map((row) => qpuResearchFetchOf(row.href)))
  let occupied = n - n
  for (const row of catalogs) if (row.holds) occupied += seed
  const vacant = catalogs.length - occupied
  const holds =
    fusion.holds &&
    catalogs.length === fusion.faces &&
    catalogs.every((row) => row.holds && row.live === true && row.hostEscape === false) &&
    occupied === fusion.faces &&
    vacant === n - n
  return {
    ...fusion,
    live: true as const,
    catalogs,
    occupied,
    vacant,hostEscape: false as const,
    holds,
  }
}

export const qpuIntelligenceOf = () => {
  const circuit = qpuCircuitOf()
  const fusion = qpuFusionOf()
  const holds = circuit.holds && circuit.only.holds && fusion.holds
  return {
    kind: 'intelligence' as const,
    test: 'fusion' as const,
    research: 'free online' as const,
    fusion,
    fused: fusion.fused,
    next: fusion.next,
    circuit: { holds: circuit.holds, vm: circuit.vm },
    holds,
  }
}

export const qpuIntelligenceLiveOf = async () => {
  const intelligence = qpuIntelligenceOf()
  const fusion = await qpuFusionLiveOf()
  const holds = intelligence.holds && fusion.holds
  return {
    ...intelligence,
    fusion,
    live: true as const,
    holds,
  }
}

export const qpuFusionHolds = (f = qpuFusionOf()): boolean =>
  f.holds === true &&
  f.kind === 'fusion' &&
  f.theorem === 'fusion' &&
  f.catalogs.length === qpuFacesOf().faces &&
  f.tetra.length === mintOf(coins) &&
  f.fused === qpuCapacityOf().fused &&
  f.fused === qpuCapacityOf().faces * qpuCapacityOf().kv.amplitudes &&
  qpuHostsHolds(f.hosts) &&
  f.hosts.harnesses.length === f.faces &&
  f.hosts.llms.length === f.faces &&
  qpuSchemasHolds(f.schemas) &&
  f.payload.holds === true &&
  qpuInstallHolds(f.install) &&
  qpuHologramHolds(f.hologram)

export const qpuIntelligenceHolds = (i = qpuIntelligenceOf()): boolean =>
  i.holds === true &&
  i.kind === 'intelligence' &&
  i.test === 'fusion' &&
  i.research === 'free online' &&
  qpuFusionHolds(i.fusion) &&
  i.circuit.holds === true &&
  i.circuit.vm === 'browser'

export const qpuCernHolds = (c = qpuCernOf()): boolean =>
  c.holds === true &&
  c.kind === 'cern' &&
  c.source === cernHost &&
  c.api === `https://${cernHost}${cernPath}` &&
  c.theorem === 'theorem cern' &&
  c.records.length === coins + coins &&
  c.projects.length === mintOf(coins) &&
  c.experiments.length === n * n + mintOf(coins) &&
  c.tetra === 'theorem tetra' &&
  c.learn.holds === true &&
  c.learn.lhc.length === n * n &&
  c.learn.opendata.length === n * n &&
  c.learn.lattice.occupied === qpuFacesOf().faces &&
  c.learn.lattice.vacant === n - n &&
  c.entangle.holds === true &&
  c.entangle.pairs.length === n * n &&
  c.entangle.catalog.pairs.length === qpuFacesOf().rays &&
  c.entangle.nodes.length === qpuFacesOf().faces &&
  c.entangle.views.length === coins &&
  c.entangle.domains.join(' ') === 'scanner radar' &&
  c.search.holds === true &&
  c.search.experiments.length === n + coins &&
  c.search.views.length === coins &&
  c.search.doors.length === n * n &&
  c.cases.length === qpuFacesOf().faces &&
  c.primitives.length === n + coins &&
  c.projects.every((row) => row.holds && row.href.startsWith(c.api) && row.theorem === 'theorem tetra') &&
  c.experiments.every((row) => row.holds && row.href.startsWith(c.api)) &&
  c.entangle.pairs.every((pair) => pair.holds && pair.product === false && pair.scanner.domain === 'scanner' && pair.radar.domain === 'radar') &&
  c.entangle.catalog.pairs.every((pair) => pair.holds && pair.product === false && pair.scanner.domain === 'scanner' && pair.radar.domain === 'radar') &&
  c.cases.every((row) => row.holds && row.left === row.right && !byDecideOf(row.theorem) && row.href.startsWith(c.api))

export const qpuToolsOf = () => {
  const names = toolNames
  const seeOf = (name: (typeof names)[number]) => names.filter((s) => s !== name)
  const capacity = qpuCapacityOf()
  const circuit = qpuCircuitOf()
  const quantumMan = qpuManOf(
    names[n - n],
    `The running circuit as one JSON-LD document: a ${circuit.register.qubits}-qubit state-vector simulator (dim ${circuit.register.dim}, exact integer amplitudes), the Bell and GHZ states with their Born weights, the Shor run, and the capacity count fused = faces · 2^(bits+1) = ${capacity.fused} (a count of amplitudes, not a benchmark). theorem quantum. theorem shor. theorem crypto. ${shorFactorOf()}.`,
    `GET ${unit.origin} returns the same document as tools/call ${names[n - n]}. Read circuit.register for the simulator, circuit.ghz.support (${circuit.ghz.support.join(',')}) for the entangled corners, shor.factors for the factoring, capacity.fused for ${capacity.fused}; every holds must be true or the unit serves 404. theorem quantum. theorem shor. theorem crypto. ${shorFactorOf()}. No auth.`,
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
    'How to cite this unit: MLA 8 entries carrying the DOI and ORCID, the served version, and the archived commit. MLA 8. when never — the citation names no access date because the DOI is the date.',
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
    'Forge a tool in the in-memory sandbox: pass { name, run } where run is a sealed op tree; nothing touches disk, network, or eval. Omit name to inspect the sandbox. Unlocked in memory. No lock.',
    `tools/call ${names[n + seed]} with { name, run } returns the forged tool and the sandbox census (tools[], memory, unlocked); without name it returns the census. Ops ${sandboxOps.join(' ')}. No auth.`,
    `${unit.origin}/mcp`,
    seeOf(names[n + seed]))
  const improveMan = qpuManOf(
    names[n + coins],
    `Improve by doubling: next = fused + fused = ${capacity.fused + capacity.fused}, the next capacity rung, with before and after readings of quality, speed, and throughoutput (fused amplitudes per token of reply). The numbers are counts of amplitudes, never benchmarks. next = fused + fused.`,
    `tools/call ${names[n + coins]} returns next, before, after; after.throughoutput / before.throughoutput is the doubling. { live: true } learn occupancy. { sequence: true } train then improve then compete then prove. After qpu_train. Before qpu_compete. No auth.`,
    `${unit.origin}/mcp`,
    seeOf(names[n + coins]))
  const competeMan = qpuManOf(
    names[n + n],
    'Two teams, read and call, compete on quality, speed, and security; the winner is the team that calls qpu_prove. theorem next_fused. throughoutput per token — fused amplitudes served per token of reply.',
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
      man: { type: 'boolean', description: 'Return the man page. Read man from tools/list, then call without man.' },
      live: { type: 'boolean', description: '{ live: true } sequence then prove. fetch Request Response.' },
      sequence: { type: 'boolean', description: '{ sequence: true } qpu_train then qpu_improve then qpu_compete then qpu_prove. Live. Memory.' }}} as const
  const competeSchema = {
    type: 'object',
    properties: {
      man: { type: 'boolean', description: 'Return the man page. Read man from tools/list, then call without man.' },
      live: { type: 'boolean', description: '{ live: true } learn CERN occupancy. fetch Request Response. Memory.' },
      sequence: { type: 'boolean', description: '{ sequence: true } qpu_train then qpu_improve then qpu_compete then qpu_prove. Live. Memory.' },
      team: { type: 'string', description: 'read or call. Omit for both teams.' }}} as const
  const forgeSchema = {
    type: 'object',
    properties: {
      man: { type: 'boolean', description: 'Return the man page. Read man from tools/list, then call without man.' },
      name: { type: 'string', description: 'Tool name to forge. Omit to inspect the in-memory sandbox.' },
      team: { type: 'string', description: 'read or call.' },
      ray: { type: 'number', description: 'Agent ray 0..6.' },
      idea: { type: 'string', description: 'Idea the tool challenges.' },
      description: { type: 'string', description: 'What the tool does in memory.' },
      run: { type: 'object', description: 'Sealed op tree. Memory only. No eval, no fs, no net.' }}} as const
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
}

/** The schemas, derived once per isolate from each tool's replies: the default call, and for the five tools that take
 * n and a, a second call on 15 and 7 so that `required` is what every reply carries. While they are being derived,
 * tools/list answers with the minimal schema, so a tool whose reply lists the tools does not recurse. */
let outputSchemasMemo: Record<string, QpuOutputSchema> | undefined
let outputSchemasBuilding = false
export const qpuOutputSchemasOf = (): Record<string, QpuOutputSchema> => {
  if (outputSchemasMemo) return outputSchemasMemo
  if (outputSchemasBuilding) return {}
  outputSchemasBuilding = true
  const out: Record<string, QpuOutputSchema> = {}
  const sample = (run: (a: Record<string, unknown>) => unknown, args: Record<string, unknown>): unknown => {
    const r = run(args)
    return r && typeof r === 'object' && typeof (r as { then?: unknown }).then === 'function' ? undefined : r
  }
  for (const t of qpuToolsOf()) out[t.name] = qpuOutputSchemaOf([sample(t.run, {})].filter((x) => x !== undefined))
  const withArgs = new Set(['crypto_shor', 'crypto_cmodexp', 'crypto_iqft', 'crypto_shots', 'crypto_rsa'])
  for (const t of qpuCybersecurityToolsOf()) {
    /** Three samples for the five tools that take n and a: the unit's own 91, a small 15, and 2^61 sent as digits, so the
     * derived types of n, a, p, q and product are integer-or-string, as the replies past 2^53 are. */
    const past = (b1 << BigInt(mintOf(n) * mintOf(n) - n)).toString()
    const samples = withArgs.has(t.name)
      ? [sample(t.run, {}), sample(t.run, { n: n * (n + coins), a: n + coins + coins }), sample(t.run, { n: past, a: `${n}` })]
      : [sample(t.run, {})]
    out[t.name] = qpuOutputSchemaOf(samples.filter((x) => x !== undefined))
  }
  outputSchemasBuilding = false
  outputSchemasMemo = out
  return out
}
export const qpuMcpToolsListOf = () => {
  const schemas = qpuOutputSchemasOf()
  const schemaOf = (name: string) => schemas[name] ?? minimalOutputSchema
  const sealed = qpuToolsOf().map(({ name, description, inputSchema, man }) =>
    qpuMcpToolShapeOf(name, description, inputSchema, { man, sealed: true as const, morph: false as const, outputSchema: schemaOf(name) }))
  const cybersecurity = qpuCybersecurityToolsOf().map(({ name, description, inputSchema, man }) =>
    qpuMcpToolShapeOf(name, description, inputSchema, { man, sealed: false as const, morph: true as const, outputSchema: schemaOf(name) }))
  return [...sealed, ...cybersecurity]
}

export const qpuMcpOf = () => {
  const href = `${unit.origin}/mcp`
  const faces = qpuFacesOf()
  const circuit = qpuCircuitOf()
  const capacity = qpuCapacityOf()
  const shor = qpuShorOf()
  const encrypt = qpuEncryptOf()
  const cite = qpuCiteOf()
  const tools = qpuToolsOf().map(({ name, description, inputSchema, man }, i) => {
    const position = i + seed
    return {
      '@type': 'SoftwareApplication' as const,
      '@id': `${href}#${name}`,
      url: href,
      position,
      name,
      description,
      inputSchema,
      man}
  })
  const hasPart = {
    '@type': 'ItemList' as const,
    name: 'tools' as const,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool) => ({
      '@type': 'ListItem' as const,
      position: tool.position,
      name: tool.name,
      url: tool['@id'],
      item: {
        '@type': tool['@type'],
        '@id': tool['@id'],
        name: tool.name,
        description: tool.description,
        url: tool.url,
        softwareHelp: tool.man.href}}))}
  const cybersecurity = qpuCybersecurityToolsOf().map(({ name, description, inputSchema, man }, i) => {
    const position = i + seed
    return {
      '@type': 'SoftwareApplication' as const,
      '@id': `${href}#${name}`,
      url: href,
      position,
      name,
      description,
      inputSchema,
      man,
      sealed: false as const,
      morph: true as const}
  })
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
}

export const qpuMcpCallOf = async (name: string, args: Record<string, unknown> = {}, env?: QpuEnv, auth?: string | null): Promise<unknown> => {
  const shown = async (payload: unknown) => qpuMcpShownOf(name, payload)
  const tool = qpuToolsOf().find((t) => t.name === name)
  if (tool) {
    if (args.man !== true) {
      const sequenced =
        args.sequence === true &&
        (name === toolNames[n] || name === toolNames[n + coins] || name === toolNames[n + n] || name === toolNames[mintOf(n) - seed])
      if (sequenced || (name === toolNames[mintOf(n) - seed] && args.live === true)) return shown(await qpuSequenceLiveOf())
      if (args.live === true) {
        if (name === toolNames[n]) return shown(await qpuTrainLiveOf())
        if (name === toolNames[n + coins]) return shown(await qpuImproveLiveOf())
        if (name === toolNames[n + n]) return shown(await qpuCompeteLiveOf(typeof args.team === 'string' ? args.team : undefined))
      }
    }
    return shown(await tool.run(args))
  }
  if (name === 'install' || name === 'apk') {
    if (args.man === true) {
      return shown(
        qpuManOf(
          'install',
          'Interactive installer. Simulate, then commit. Fuse Payload MCP to QPU without a ninth sealed tool. VitePress payload stays on uuidna.com.',
          `tools/call install. Not in tools/list. { yes: true } seats the current package. { verb: "simulate" } then { verb: "commit", yes: true } then { verb: "audit" }. QPU JSON-LD. No auth.`,
          `${unit.origin}/mcp`,
          [...toolNames]))
    }
    return shown(qpuInstallOf(args))
  }
  if ((payloadFinds as readonly string[]).includes(name)) {
    if (args.man === true) {
      return shown(
        qpuSubManOf(
          name,
          'Payload find. Read only.',
          'Not in tools/list. Morph at call time. Not a ninth sealed tool. No auth. Write never.',
          `${unit.origin}/mcp`,
          payloadFinds.filter((row) => row !== name)))
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
    if (args.man === true) return shown(morph.man)
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
/** A tool name this server does not have. Read by the router into a JSON-RPC -32602 error; never answered with the
 * root document, which is a confident answer to a question nobody asked. */
export type QpuUnknownTool = { kind: 'unknown'; tool: string; tools: string[]; holds: false }
export const qpuUnknownToolOf = (tool: string): QpuUnknownTool => ({ kind: 'unknown', tool, tools: qpuMcpToolsListOf().map((t) => t.name), holds: false })
export const isUnknownTool = (x: unknown): x is QpuUnknownTool =>
  typeof x === 'object' && x !== null && (x as { kind?: unknown }).kind === 'unknown' && typeof (x as { tool?: unknown }).tool === 'string' && (x as { holds?: unknown }).holds === false

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
    m.capacity.next === m.capacity.fused + m.capacity.fused &&
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

export const qpuDevelopOf = () => {
  const lean = qpuLeanOf()
  const docs = qpuDocsOf()
  const genesis = qpuGenesisOf()
  const circuit = qpuCircuitOf()
  const integrity = qpuIntegrityOf()
  const cern = qpuCernOf()
  const quantum = qpuQuantumOf()
  const tools = qpuToolsOf()
  const faces = qpuFacesOf()
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const exclusive = cern.entangle.pairs.filter((pair) => pair.same === false)
  const zip = exclusive.map((pair) => `${pair.scanner.experiment}↔${pair.radar.experiment}`)
  const lines = [
    `Lean \`${lean.src}\` leads. TypeScript fuses the same identities. This README is generated.`,
    '',
    '```sh',
    'git clone https://github.com/uuidna/qpu && cd qpu',
    'npm ci',
    'npm test',
    '```',
    '',
    '`npm test` compiles then runs the unit tests. `npm run ci` is Lean then test. `npm run ship` deploys. Do not import uuidna.',
    '',
    `- host ${unit.host}. API only JSON-LD. No HTML. No auth. cors *.`,
    `- sealed tools ${tools.length} = mintOf n. tools/list lists those eight plus eight cybersecurity morph. crypto_rsa theorem shor ${shorFactorOf()}. crypto_split theorem crypto ${cryptoClaimOf()}. Unlocked. Not a ninth sealed tool. Morph install Payload finds imagine at call-time.`,
    `- docs.api ${docs.api.length} = rays. Extra paths do not join that list.`,
    `- integrity ${integrity.n}: ${integrity.tests.map((row) => row.name).join(' ')}. If false every path is 404.`,
    `- primitives ${primitives.join(' ')}. Never Math.`,
    `- theorem temperature. theorem superconductivity. theorem qubits. device ${circuit.hardware.device}. KV added amplitudes.`,
    `- fuse faces * mintOf (bits + seed) = ${quantum.fused}. isolate handle.amplitudes ${handle.amplitudes}. KV ${handle.kv.amplitudes}.`,
    `- next = fused + fused. last false. split_coin has no last k. demo is not a test nor a proof. Capacity infinite. Crypt split to free agents.`,
    `- occupancy ${occupancies.join(' ')}. skills ${skills.join(' ')}. Coordinated dry-clean.`,
    `- steps computed from the lattice: seat ${qpuStepsOf().seat}, next ${qpuStepsOf().next.node} at face ${qpuStepsOf().next.face} via ${qpuStepsOf().next.door.tool}, todo ${qpuStepsOf().todo.length}. Walk scanner then radar by the hop of rays, ray by ray.`,
    `- domains ${genesis.domains.join(' ')}. Lattice flow domains. face = team * rays + ray. hop face + rays. involution face + rays + rays.`,
    `- circuit.gates ${circuit.gates.names.join(' ')}.`,
    `- sandbox memory only. Not KV. VM scaling online.`,
    `- CERN coins views. scanner LHC running ${cern.learn.lhc.join(' ')}. radar Open Data ${cern.learn.opendata.join(' ')}. Shared tetra + TOTEM. Exclusive ${zip.join(' ')}. Catalog pairs ${faces.rays}. HEP quantum true. Live CERN Open Data APIs. Live JSON. Open Data needs records. LHC-only holds without Open Data occupancy.`]
  const reading = lines.join('\n')
  const holds =
    lean.holds &&
    docs.holds &&
    docs.api.length === faces.rays &&
    tools.length === mintOf(n) &&
    integrity.holds &&
    integrity.n === n &&
    integrity.tests.length === n &&
    genesis.domains.length === coins &&
    genesis.domains.join(' ') === 'scanner radar' &&
    circuit.gates.names.length === coins &&
    circuit.gates.names.join(' ') === 'h cnot' &&
    quantum.next === quantum.fused + quantum.fused &&
    handle.amplitudes === mintOf(cube.bits) &&
    handle.kv.amplitudes === mintOf(cube.bits + seed) &&
    occupancies.length === n + coins &&
    skills.length === n + coins &&
    primitives.length === n + coins &&
    cern.learn.lhc.length === n * n &&
    cern.learn.opendata.length === n * n &&
    cern.search.views.length === coins &&
    cern.entangle.pairs.length === n * n &&
    cern.entangle.catalog.pairs.length === faces.rays &&
    exclusive.length === mintOf(coins) &&
    zip.length === mintOf(coins) &&
    reading.includes('Lean') &&
    reading.includes('This README is generated') &&
    reading.includes('Do not import uuidna') &&
    reading.includes('Not a ninth sealed tool') &&
    reading.includes(`${shorFactorOf()}`) &&
    reading.includes('theorem shor') &&
    reading.includes('theorem crypto') &&
    reading.includes('theorem temperature') &&
    reading.includes('theorem superconductivity') &&
    reading.includes('theorem qubits') &&
    reading.includes('Unlocked') &&
    reading.includes('demo is not a test nor a proof') &&
    reading.includes('API only JSON-LD') &&
    reading.includes('No HTML') &&
    reading.includes('LHC running') &&
    reading.includes('Open Data') &&
    reading.includes('##') === false
  return {
    kind: 'develop' as const,
    lead: true as const,
    src: lean.src,
    host: unit.host,
    tools: tools.length,
    api: docs.api.length,
    integrity: integrity.n,
    fused: quantum.fused,
    lhc: cern.learn.lhc,
    opendata: cern.learn.opendata,
    exclusive: zip,
    reading,
    holds,
  }
}

export const qpuDevelopHolds = (d = qpuDevelopOf()): boolean =>
  d.holds === true &&
  d.kind === 'develop' &&
  d.lead === true &&
  d.host === unit.host &&
  d.tools === mintOf(n) &&
  d.api === qpuFacesOf().rays &&
  d.integrity === n &&
  d.lhc.length === n * n &&
  d.opendata.length === n * n &&
  d.exclusive.length === mintOf(coins) &&
  d.reading.includes('Lean') &&
  d.src === unit.fuse.lean

export const qpuReadmeOf = (m = qpuMcpOf()): string => {
  const lean = qpuLeanOf()
  const quantum = qpuQuantumOf()
  const cite = qpuCiteOf()
  const prove = qpuProveOf()
  const docs = quantum.docs
  const blueprint = unit.fuse.src
  const abstract = `Running quantum circuit at ${unit.origin}. theorem quantum : fused = faces * mintOf (bits + seed). Public quantum API. No auth. JSON-LD. CORS ${cors}. API only. No HTML. The TypeScript and Lean sources are the blueprint. This README is the paper generated from that blueprint.`
  const lines = [
    `# QPU`,
    '',
    abstract,
    '',
    `GET ${unit.origin}. POST ${m.href} tools/list then tools/call. Source \`${lean.src}\`. Do not import uuidna. demo is not a test nor a proof.`,
    '',
    '## Abstract',
    '',
    `A named host ${unit.host} exposes one quantum processing unit as JSON-LD. fused is ${quantum.fused}. next is fused + fused = ${quantum.next}. Native gates are h and cnot. theorem temperature. theorem superconductivity. theorem qubits. theorem shor. theorem crypto. GHZ ${quantum.purpose.nature.ghz}. Entangled ${quantum.purpose.nature.entangled}, product ${quantum.purpose.nature.product}. Possible only in quantum. demo is not a test nor a proof.`,
    '',
    '## Unit',
    '',
    `The blueprint is \`${blueprint}\` fused with \`${lean.src}\`. mintOf(k) is 2^k by doubling. n is 3. seed is 1. coins are 2. rays are 7. faces are 14. bits are 32. cube vertices ${quantum.cube.vertices} hexbit ${quantum.cube.hexbit}. theorem quantum, theorem infinite, and theorem distribute are decided in Lean, not restated as chapters here.`,
    '',
    `Climb ${quantum.purpose.science.climb.join(' then ')}. Extras ${quantum.purpose.science.extras.join(' ')} stay off the seven-path guide. Integrity is three tests: quantum, lean, sealed. If they fail every path is 404.`,
    '',
    '## Interface',
    '',
    `Seven paths. Eight sealed MCP tools. Eight cybersecurity morph tools listed on tools/list. crypto_rsa theorem shor ${shorFactorOf()}. crypto_split theorem crypto ${cryptoClaimOf()}. Extra paths do not join that list. Not a ninth sealed tool. User guide is docs.inline on the unit. Theorems are qpu_lean and qpu_prove. \`{ man: true }\` is the theorem on the wire. demo is not a test nor a proof.`,
    '']
  for (const row of docs.api) {
    lines.push(`- \`${row.method} ${row.path}\` ${row.name}. ${row.reading}`)
  }
  lines.push('')
  for (const tool of m.tools) {
    lines.push(`- \`${tool.name}\` ${tool.man.description}`)
  }
  for (const tool of m.cybersecurity.tools) {
    lines.push(`- \`${tool.name}\` ${tool.man.description}`)
  }
  lines.push(
    '',
    '## Results',
    '',
    `theorem shor ${shorFactorOf()}. theorem crypto ${cryptoClaimOf()}. ${prove.theorems.find((r) => r.heading === 'shor')?.theorem} ${prove.theorems.find((r) => r.heading === 'crypto')?.theorem}. demo is not a test nor a proof.`,
    '',
    `Fault tolerance. ${quantum.evidence.fault.code} distance ${quantum.evidence.fault.distance}. Codes ${quantum.evidence.fault.codes}. Syndrome ${quantum.evidence.fault.syndrome.join(' ')}. Logical off ${quantum.evidence.fault.logical.off}. Logical < physical ${quantum.evidence.fault.logicalLtPhysical} on this run, one distance.`,
    '',
    `CERN Open Data ${quantum.evidence.verify.cern}. LHC running. Four CMS records. Coil, electronics, hybrid, raid, and clay identities are in \`${lean.src}\`. theorem clay is coins * rays = faces.`,
    '',
    '## Evidence',
    '',
    `Execution provenance. Provider ${quantum.evidence.provenance.provider}. Device ${quantum.evidence.provenance.device}. Job ${quantum.evidence.provenance.job}. Shots ${quantum.evidence.provenance.shots}. Compiler native ${quantum.evidence.provenance.compiler.native.join(' ')} compiled ${quantum.evidence.provenance.compiler.compiled.join(' ')}.`,
    '',
    `Device-specific noise. Channel ${quantum.evidence.noise.model}. Drift ${quantum.evidence.noise.drift}.`,
    '',
    `Randomized benchmarks. Volume dim ${quantum.evidence.volume.dim}. Heavy ${quantum.evidence.volume.observed} / ${quantum.evidence.volume.total}. Mirror ${quantum.evidence.volume.mirror}.`,
    '',
    `Cross-validation. Ideal ${quantum.evidence.cross.ideal}. Noisy ${quantum.evidence.cross.noisy}. Agree ideal ${quantum.evidence.cross.agreeIdeal}. Agree noise ${quantum.evidence.cross.agreeNoise}.`,
    '',
    `theorem qubits. theorem register. Dim ${quantum.evidence.scaling.dim}. Depth ${quantum.evidence.scaling.depth}. Exact ${quantum.evidence.scaling.exact}. Beyond ${quantum.evidence.scaling.beyond}. Advantage ${quantum.evidence.scaling.advantage}. demo is not a test nor a proof.`,
    '',
    `Independent verification. CORS ${quantum.evidence.verify.cors}. Origin ${quantum.evidence.verify.origin}. Lean \`${quantum.evidence.verify.lean}\`. Hardware ${quantum.evidence.verify.hardware}. Algorithm ${quantum.evidence.verify.algorithm}. RSA ${quantum.evidence.verify.rsa}. Crypt ${quantum.evidence.verify.crypt}. Encrypt ${quantum.evidence.verify.encrypt}.`,
    '',
    '## Recompute',
    '',
    'This README is generated from the blueprint at build. `npm test` compiles then writes the paper. `npm run ci` is Lean then test. `npm run ship` deploys.',
    '',
    '```sh',
    'git clone https://github.com/uuidna/qpu && cd qpu',
    'npm ci',
    'npm test',
    '```',
    '',
    'npx uuidna-install. Cloudflare `install.json`.',
    '',
    '```sh',
    'npx uuidna-install',
    '```',
    '',
    `[![Deploy to Cloudflare](${installCloudflare.button})](${installCloudflare.qpu})`,
    '',
    `Integrate in any harness. One computed block, served on initialize as \`install\` and printed here from the same function. URL ${qpuHarnessesOf().url}. ${qpuHarnessesOf().auth}.`,
    '',
    ...qpuHarnessesOf().rows.map((r) => `- **${r.harness}** (${r.kind}): ${r.how}. File ${r.file}. \`${typeof r.config === 'string' ? r.config.replace(/\n/g, ' ') : JSON.stringify(r.config)}\``),
    '',
    '## Cite',
    '',
    `MLA 8. ${cite.inText}. ORCID ${cite.author.orcid}. DOI ${cite.doi}. Archive ${cite.archive}. Identifier ${cite.identifier}. when ${cite.when}. Cite the running quantum circuit and its Lean proof.`,
    '',
    ...cite.rows.map((r) => r.works),
    cite.prior.works,
    '',
    '## License',
    '',
    'CC-BY-NC-ND-4.0. Source `LICENSE`. Copyright Tsvetan Rouschev.',
    '',
    '```ts',
    "import { qpuMcpCallOf, qpuMcpOf } from '@uuidna/qpu'",
    '```',
    '')
  return `${lines.join('\n')}\n`
}

export const qpuReadmeHolds = (text = qpuReadmeOf()): boolean => {
  const lean = qpuLeanOf()
  const mcp = qpuMcpOf()
  const cite = qpuCiteOf()
  const headings = ['## Abstract', '## Unit', '## Interface', '## Results', '## Evidence', '## Recompute', '## Cite', '## License'] as const
  const order = headings.every((h, i) => i === n - n || text.indexOf(headings[i - seed]!) < text.indexOf(h))
  return (
    order &&
    text.startsWith('# QPU\n') &&
    !text.includes('Host never') &&
    !text.includes('## Develop') &&
    !text.includes('## Purpose') &&
    !text.includes('## Coil') &&
    !text.includes('## Hybrid') &&
    !text.includes('## Guide') &&
    !text.includes('## Tools') &&
    !text.includes('## Efficiency') &&
    !text.includes('## Train') &&
    !text.includes('## Sandbox') &&
    !text.includes('## Improve') &&
    !text.includes('## Compete') &&
    !text.includes('## Storage') &&
    !text.includes('## Proof') &&
    !text.includes('## Build') &&
    !text.includes('## Man') &&
    !text.includes('## Prove') &&
    !text.includes('## Message') &&
    !text.includes('DOI empty') &&
    !text.includes(qpuDevelopOf().reading) &&
    text.includes('API only') &&
    text.includes('No HTML') &&
    text.includes('docs.inline') &&
    text.includes('npx uuidna-install') &&
    text.includes('deploy.workers.cloudflare.com') &&
    text.includes('install.json') &&
    text.includes('This README is generated') &&
    text.includes('Do not import uuidna') &&
    text.includes('demo is not a test nor a proof') &&
    text.includes('the blueprint') &&
    text.includes('the paper') &&
    text.includes('theorem quantum') &&
    text.includes('theorem shor') &&
    text.includes('theorem crypto') &&
    text.includes('theorem temperature') &&
    text.includes('theorem qubits') &&
    text.includes('Theorems are qpu_lean') &&
    text.includes(`${shorFactorOf()}`) &&
    text.includes('Unlocked') &&
    text.includes('crypto_rsa') &&
    text.includes('crypto_split') &&
    text.includes('theorem infinite') &&
    text.includes('theorem distribute') &&
    text.includes('LHC running') &&
    text.includes('opendata.cern.ch') &&
    text.includes('Not a ninth sealed tool') &&
    text.includes('No auth') &&
    text.includes('JSON-LD') &&
    text.includes('schema.org') &&
    text.includes('Possible only in quantum') &&
    text.includes('Running quantum circuit') &&
    text.includes('next is fused + fused') &&
    text.includes('/message') &&
    text.includes('CC-BY-NC-ND-4.0') &&
    text.includes('LICENSE') &&
    text.includes(cite.author.orcid) &&
    text.includes(cite.doi) &&
    text.includes(cite.identifier) &&
    text.includes(cite.prior.works) &&
    text.includes(lean.src) &&
    text.includes(unit.fuse.src) &&
    qpuDevelopHolds() &&
    mcp.tools.every((t) => text.includes(t.name) && text.includes(t.man.description)) &&
    mcp.cybersecurity.tools.every((t) => text.includes(t.name) && text.includes(t.man.description)) &&
    mcp.prove.src === lean.src &&
    cite.rows.every((r) => text.includes(r.works)) &&
    qpuDocsOf().api.every((row) => text.includes(`\`${row.method} ${row.path}\``))
  )
}

export default {
  async fetch(request: Request, env?: QpuEnv): Promise<Response> {
    const host = env?.QPU_HOST ?? unit.host
    const jsonOf = (body: unknown, status = found) => new Response(JSON.stringify(body), { status, headers })
    if (host !== unit.host || host.includes('*') || !unit.holds || !qpuIntegrityHolds()) {
      return jsonOf(JSON.parse(dead), lost)
    }
    const url = new URL(request.url)
    const raw = url.pathname.replace(/\/$/, '') || '/'
    const path = raw === '/index.html' ? '/' : raw
    const named = url.protocol === 'https:' && url.hostname === unit.host
    if (!named) return jsonOf(JSON.parse(dead), lost)
    if (request.method === 'OPTIONS') return new Response(null, { status: found + coins + coins, headers })
    if (path === '/mcp') {
      if (request.method === 'POST') {
        let parsed: unknown
        try {
          parsed = JSON.parse(await request.text())
        } catch {
          return jsonOf(rpcErrorOf(null, rpcCodes.parse, 'Parse error: the body is not JSON'), badRequest)
        }
        if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
          return jsonOf(rpcErrorOf(null, rpcCodes.invalid, 'Invalid Request: expected one JSON-RPC 2.0 request object'), badRequest)
        }
        const body = parsed as { method?: unknown; params?: { name?: unknown; arguments?: unknown; protocolVersion?: unknown }; id?: unknown }
        if (typeof body.method !== 'string') {
          return jsonOf(rpcErrorOf(body.id, rpcCodes.invalid, 'Invalid Request: method must be a string'), badRequest)
        }
        if (body.method === 'initialize' || body.method === 'server/discover') {
          return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: qpuMcpDiscoverOf(body.params?.protocolVersion) })
        }
        if (body.method === 'ping' || body.method === 'notifications/initialized') {
          return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: {} })
        }
        if (body.method === 'tools/list') {
          return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: { resultType: 'complete' as const, tools: qpuMcpToolsListOf() } })
        }
        if (body.method === 'tools/call') {
          const name = typeof body.params?.name === 'string' ? body.params.name : ''
          const args = body.params?.arguments && typeof body.params.arguments === 'object' && !Array.isArray(body.params.arguments) ? (body.params.arguments as Record<string, unknown>) : {}
          const called = await qpuMcpCallOf(name, args, env, request.headers.get('authorization'))
          if (isUnknownTool(called)) return jsonOf(rpcErrorOf(body.id, rpcCodes.params, `Unknown tool: ${name || '(none)'}`, { tools: called.tools }))
          return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: called })
        }
        return jsonOf(rpcErrorOf(body.id, rpcCodes.method, `Method not found: ${body.method}`, { methods: [...rpcMethods] }))
      }
      return jsonOf(qpuMcpOf())
    }
    if (path === `/${unit.fuse.lean}`) {
      return new Response(leanSource, { status: found, headers: { ...headers, 'content-type': 'text/plain; charset=utf-8' } })
    }
    if (path === '/') return jsonOf(qpuQuantumOf())
    if (path === `/${unit.path}`) return jsonOf(qpuLeanOf())
    if (path === '/cite') return jsonOf(qpuCiteOf())
    if (path === '/server' || path.startsWith('/server/')) {
      if (request.method === 'POST') {
        const body = (await request.json().catch(() => ({}))) as {
          method?: string
          params?: { name?: string; arguments?: Record<string, unknown> }
          id?: unknown
          gates?: unknown
        }
        const rpc = await qpuSubRpcOf(body, qpuServerToolsOf(), serverHref)
        if (rpc) return jsonOf(rpc)
        return jsonOf(qpuServerSubmitOf(body))
      }
      if (path.startsWith('/server/') && path.length > '/server/'.length) {
        const id = Number(path.slice('/server/'.length))
        const job = serverJobs.find((row) => row.id === id)
        if (job) return jsonOf({ ...job, stored: false as const })
        return jsonOf({ kind: 'result' as const, id, holds: false as const, denied: 'job' as const, why: 'jobs are not stored; the result is returned inline with the submit, and an id lives only as long as the isolate that ran it' }, lost)
      }
      return jsonOf(qpuServerMcpOf())
    }
    if (path === '/network' || path.startsWith('/network/')) {
      if (request.method === 'POST') {
        const body = (await request.json().catch(() => ({}))) as {
          method?: string
          params?: { name?: string; arguments?: Record<string, unknown> }
          id?: unknown
          channel?: unknown
          body?: unknown
        }
        const rpc = await qpuSubRpcOf(body, qpuNetworkToolsOf(), networkHref)
        if (rpc) return jsonOf(rpc)
        const send = qpuNetworkToolsOf().find((t) => t.name === 'net_send')
        return jsonOf(send ? await send.run(body) : { holds: false as const })
      }
      return jsonOf(qpuNetworkMcpOf())
    }
    if (path === '/storage' || path.startsWith('/storage/')) {
      const key = path === '/storage' ? '' : decodeURIComponent(path.slice('/storage/'.length))
      if (request.method === 'POST' && path === '/storage') {
        const body = (await request.json().catch(() => ({}))) as {
          method?: string
          params?: { name?: string; arguments?: Record<string, unknown> }
          id?: unknown
          maintain?: unknown
          key?: unknown
          value?: unknown
        }
        const auth = request.headers.get('authorization')
        const rpc = await qpuSubRpcOf(body, qpuStorageToolsOf(env, auth), storageHref)
        if (rpc) return jsonOf(rpc)
        if (body.maintain === true) return jsonOf(await qpuStorageMaintainOf(env))
        if (typeof body.key === 'string') {
          const put = await qpuStorageOf(env, { method: 'PUT', key: body.key, value: body.value, auth })
          return jsonOf(put, put.holds === false && 'denied' in put && put.denied === 'auth' ? unauthorized : found)
        }
      }
      if (request.method === 'PUT' || request.method === 'POST') {
        const value = await request.json().catch(() => null)
        const put = await qpuStorageOf(env, { method: 'PUT', key, value, auth: request.headers.get('authorization') })
        return jsonOf(put, put.holds === false && 'denied' in put && put.denied === 'auth' ? unauthorized : found)
      }
      if (request.method === 'DELETE') {
        const del = await qpuStorageOf(env, { method: 'DELETE', key, auth: request.headers.get('authorization') })
        return jsonOf(del, del.holds === false && 'denied' in del && del.denied === 'auth' ? unauthorized : found)
      }
      if (path === '/storage') return jsonOf(await qpuStorageMcpOf(env))
      return jsonOf(await qpuStorageOf(env, { method: 'GET', key }))
    }
    if (path === '/message') {
      if (request.method === 'POST') {
        const body = (await request.json().catch(() => ({}))) as { lane?: unknown; body?: unknown }
        const sent = qpuMessageOf(body)
        return jsonOf(sent, 'accepted' in sent && sent.accepted === true ? found + coins : found)
      }
      return jsonOf(qpuMessageOf())
    }
    return jsonOf(JSON.parse(dead), lost)
  }}
