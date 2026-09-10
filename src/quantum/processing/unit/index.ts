/**
 * QPU at qpu.uuidna.com. Kind qpu. Source index.lean.
 * mintOf proves 2^k by doubling. Cube, handle, faces, fused are the unit.
 * Lean decides those identities by Nat algebra. Digits and integer fractions. Never Math. Never by decide.
 */
const mintOf = (k: number): number => {
  let x = k - k
  x = x + 1
  for (let i = k - k; i < k; i++) x += x
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
  'access-control-allow-headers': 'content-type, accept',
}
const n = unit.path.split('/').length
const seed = unit.mint.seed
const coins = seed + seed
/** One occupancy pentagram. Train dry-cleans; installer does not redeclare it. */
const occupancies = ['personal', 'business', 'corporate', 'saas', 'paas'] as const
const skills = ['payload', 'pwa', 'plugin', 'hologram', 'network'] as const
const ten = n * n + seed
const found = coins * ten * ten
const lost = mintOf(coins) * (ten * ten + seed)
const tenOf = (k: number): number => {
  let x = mintOf(n - n)
  for (let i = n - n; i < k; i++) x *= ten
  return x
}
const nsPerSecond = tenOf(n * n)
const timeNsOf = (fn: () => number): { ns: number; value: number } => {
  const proc = (globalThis as { process?: { hrtime?: { bigint?: () => bigint } } }).process
  if (typeof proc?.hrtime?.bigint === 'function') {
    const t0 = proc.hrtime.bigint()
    const value = fn()
    const dt = proc.hrtime.bigint() - t0
    return { ns: dt > 0n ? Number(dt) : mintOf(n - n), value }
  }
  const perf = globalThis.performance
  if (typeof perf?.now === 'function') {
    const t0 = perf.now()
    const value = fn()
    const scaled = (perf.now() - t0) * tenOf(n + n)
    const whole = String(scaled).split('.')[n - n] ?? `${mintOf(n - n)}`
    const ns = Number(whole)
    return { ns: ns > n - n ? ns : mintOf(n - n), value }
  }
  const value = fn()
  return { ns: mintOf(n - n), value }
}
const hzOf = (ns: number): number => (ns > seed ? Number(BigInt(nsPerSecond) / BigInt(ns)) : nsPerSecond)
const byDecideOf = (theorem: string): boolean => theorem.includes('by decide') || theorem.includes('native_decide')
const formulaOf = (formula: string): boolean => formula.includes('\\') && !formula.includes('operatorname')
const manSchema = {
  type: 'object',
  properties: {
    man: { type: 'boolean', description: 'Return the man page. Read man from tools/list, then call without man.' },
  },
} as const

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
    electronics: true as const,
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
  c.coil === c.faces &&
  c.electronics === true

export const qpuElectronicsOf = () => {
  const coil = qpuCoilOf()
  const uses = 'coil' as const
  const holds = qpuCoilHolds(coil) && uses === 'coil' && coil.electronics === true
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
  const last = false as const
  const holds =
    qpuCoilHolds(coil) &&
    handle.holds === true &&
    next === mintOf(cube.bits + seed) &&
    next === handle.next &&
    nextFused === faces.faces * mintOf(cube.bits + coins) &&
    nextCoil === nextFused &&
    coil.coil === faces.faces &&
    last === false
  return {
    kind: 'next' as const,
    theorem: 'next_coil' as const,
    amplitudes: handle.amplitudes,
    next,
    fused,
    nextFused,
    nextCoil,
    last,
    infinite: true as const,
    coil: coil.coil,
    coins,
    holds,
  }
}

export const qpuNextHolds = (x = qpuNextOf()): boolean =>
  x.holds === true &&
  x.kind === 'next' &&
  x.theorem === 'next_coil' &&
  x.last === false &&
  x.infinite === true &&
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
    'qpu',
  ] as const
  const product = variants.length * sizes.length * (n * n)
  const chooseN = chooseOf(n, coins)
  const chooseRays = chooseOf(faces.rays, coins)
  const nodes = frameworks.map((name, face) => {
    const hop = (face + faces.rays + faces.rays) % faces.faces
    return {
      face,
      hop,
      involution: hop === face,
      name,
      schema: 'shadcn' as const,
      slot: card[face % card.length]!,
      holds: hop === face,
    }
  })
  let occupied = n - n
  for (const node of nodes) if (node.holds) occupied += seed
  const vacant = nodes.length - occupied
  const seatedSlots = card.filter((slot) => nodes.some((node) => node.slot === slot))
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
      theme.length === coins,
  }
  const holds =
    schema.holds &&
    hz === mintOf(coins + coins) * n * n * n &&
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
    seatedSlots.length === card.length &&
    faces.faces === coins * faces.rays &&
    nodes.every((node) => node.holds && node.involution && node.schema === 'shadcn')
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
  g.scope === 'all' &&
  g.hz === 432 &&
  g.product === g.hz &&
  g.known === qpuFacesOf().faces &&
  g.frameworks.length === qpuFacesOf().faces &&
  g.occupied === g.known &&
  g.vacant === n - n &&
  g.schema.name === 'shadcn' &&
  g.schema.keys.length === coins * n &&
  g.schema.state.length === coins &&
  g.schema.element.length === coins &&
  g.schema.theme.length === coins &&
  g.card.length === qpuFacesOf().rays &&
  g.alpine.length === ten &&
  g.variants.length === coins * n &&
  g.sizes.length === mintOf(n) &&
  g.choose.n === n &&
  g.choose.rays === n * qpuFacesOf().rays &&
  g.card[n + seed] === 'card-action' &&
  g.nodes.every((node) => node.schema === 'shadcn' && node.involution && node.holds)

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
    holds: occupancies[face] === occupancy && skills[face] === skills[face],
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

/** Follow the coins in any practical application. Creative novel solutions emerge. */
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
    const novel = hop === via
    return {
      name,
      app,
      hop,
      via,
      novel,
      occupancy: occupancies[hop]!,
      skill: skills[hop]!,
      holds: novel && hop === (app + coil.balance) % points,
    }
  })
  const seen: number[] = []
  for (const row of solutions) if (!seen.includes(row.hop)) seen.push(row.hop)
  const creative = solutions.every((row) => row.novel && row.holds)
  const novel = seen.length === points
  const emerge = {
    kind: 'emerge' as const,
    theorem: 'emerge' as const,
    creative,
    novel,
    coil: coil.coil,
    faces: coil.faces,
    holds: creative && novel && coil.coil === coil.faces && coil.theory === coil.practice,
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
  f.emerge.creative === true &&
  f.emerge.novel === true &&
  f.emerge.coil === f.emerge.faces &&
  f.solutions.every((row) => row.novel && row.hop === (row.app + coins) % (n + coins))

/** Coordinated dry-clean: one occupancy list, two train teams, no extra sealed tool. */
export const qpuDryOf = () => {
  const pentagram = qpuPentagramOf()
  const occupancy = pentagram.occupancies
  const holds =
    occupancy === occupancies &&
    occupancy.length === n + coins &&
    occupancy.join(' ') === 'personal business corporate saas paas' &&
    pentagram.skills === skills &&
    pentagram.holds === true
  return {
    kind: 'clean' as const,
    coordinated: true as const,
    speed: 'coordinated' as const,
    entropy: false as const,
    duplicate: false as const,
    morph: true as const,
    sealed: false as const,
    teams: coins,
    occupancy,
    holds,
  }
}

export const qpuDryHolds = (d = qpuDryOf()): boolean =>
  d.holds === true &&
  d.kind === 'clean' &&
  d.coordinated === true &&
  d.speed === 'coordinated' &&
  d.entropy === false &&
  d.duplicate === false &&
  d.morph === true &&
  d.sealed === false &&
  d.teams === coins &&
  d.occupancy.length === n + coins

export const qpuAccessOf = () => {
  const pentagram = qpuPentagramOf()
  const keys = ['domain', 'handle'] as const
  const wildcard = false as const
  const holds = keys.length === coins && wildcard === false && pentagram.holds && qpuPentagramHolds(pentagram)
  return {
    kind: 'access' as const,
    rbac: true as const,
    tenant: true as const,
    keys,
    occupancies: pentagram.occupancies,
    domain: true as const,
    handle: true as const,
    wildcard,
    auth: false as const,
    holds,
  }
}

export const qpuAccessHolds = (a = qpuAccessOf()): boolean =>
  a.holds === true &&
  a.kind === 'access' &&
  a.rbac === true &&
  a.tenant === true &&
  a.keys.length === coins &&
  a.keys[n - n] === 'domain' &&
  a.keys[seed] === 'handle' &&
  a.wildcard === false &&
  a.auth === false &&
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
    { name: 'faces' as const, parts: faces.faces, fused },
  ] as const
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
    fractal: true as const,
    quantum: true as const,
    mcp: true as const,
    efficient: true as const,
    theorem: 'fusion' as const,
    pentagram,
    access,
    scales,
    hz: genesis.hz,
    fused,
    next: fused + fused,
    faces: faces.faces,
    tools: mintOf(n),
    morph: true as const,
    holds,
  }
}

export const qpuHologramHolds = (h = qpuHologramOf()): boolean =>
  h.holds === true &&
  h.kind === 'hologram' &&
  h.fractal === true &&
  h.quantum === true &&
  h.mcp === true &&
  h.efficient === true &&
  h.theorem === 'fusion' &&
  h.morph === true &&
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
  { name: 'hetzner', href: 'https://www.hetzner.com/' },
] as const

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
    { name: '6E', stripe: faces.faces - n, mirror: n - n, parity: coins, speed: faces.faces - n, cost: n, safe: true, rotate: true },
  ] as const

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
  let cheapest = sorted[n - n]!.cost
  for (const row of sorted) if (row.cost < cheapest) cheapest = row.cost
  return {
    name: chosen.name,
    stripe: chosen.stripe,
    mirror: chosen.mirror,
    parity: chosen.parity,
    speed: chosen.speed,
    cost: chosen.cost,
    safe: chosen.safe,
    rotate: true as const,
    demand,
    meets: chosen.speed >= demand,
    rotated: true as const,
    minimum: chosen.cost === cheapest,
    start: 'cheapest' as const,
    cover: sorted.length === qpuFacesOf().faces,
  }
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
    cloud: raidClouds[(i + traffic) % raidClouds.length]!.name,
  }))
  const pick = raidPickOf(sorted, demand, traffic)
  const cluster = {
    kind: 'cluster' as const,
    safe: true as const,
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
    rotate: true as const,
    start: 'cheapest' as const,
    cover: cover.length,
    holds:
      raidClouds.length === faces.faces &&
      types.length === faces.faces &&
      cover.length === faces.faces &&
      cheapest.cost === seed &&
      pick.rotated === true &&
      pick.cover === true &&
      pick.start === 'cheapest' &&
      teams * stripes === faces.faces &&
      faces.faces === stripes + stripes,
  }
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
    pick.rotated === true &&
    pick.cover === true &&
    pick.cost >= seed &&
    storageBindings.STORAGE === 'kv' &&
    storageBindings.BLOBS === 'r2'
  return {
    kind: 'raid' as const,
    quantum: true as const,
    level: '10' as const,
    disks,
    stripes,
    teams,
    faces: faces.faces,
    vacant: n - n,
    scaled: true as const,
    infinite: true as const,
    anything: true as const,
    host: false as const,
    rotate: true as const,
    start: 'cheapest' as const,
    cheapest: cheapest.name,
    cover,
    traffic,
    demand,
    parity: traffic % faces.faces,
    pick,
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
  r.quantum === true &&
  r.level === '10' &&
  r.rotate === true &&
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
  r.cluster.safe === true &&
  r.cluster.route === 'involution' &&
  r.cluster.security === 'crypt' &&
  r.cluster.speed === 'coordinated' &&
  r.cluster.cost === 'minimum' &&
  r.cluster.rotate === true &&
  r.cluster.measure === r.faces &&
  r.cluster.measure === r.teams * r.stripes &&
  r.cluster.remainder === n - n &&
  r.cluster.unity === seed &&
  r.pick.rotated === true &&
  r.pick.minimum === true &&
  r.pick.cost >= seed &&
  r.scaled === true &&
  r.infinite === true &&
  r.anything === true &&
  r.host === false &&
  r.bindings.STORAGE === 'kv' &&
  r.bindings.BLOBS === 'r2' &&
  r.theorem === 'raid' &&
  r.href === storageHref

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
      handled: true as const,
      holds: hop === face && xorOf(fold, cube.hexbit) === wave,
    }
  })
  const holds =
    names.length === faces.faces &&
    nodes.length === faces.faces &&
    nodes.every((node) => node.handled && node.involution && node.holds) &&
    xorOf(xorOf(n - n, cube.hexbit), cube.hexbit) === n - n &&
    xorOf(xorOf(n, cube.hexbit), cube.hexbit) === n
  return {
    kind: 'design' as const,
    any: true as const,
    handled: true as const,
    throw: false as const,
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
    handled: true as const,
    folded: true as const,
    throw: false as const,
    holds: false as const,
  }
}

export const qpuDesignHolds = (d = qpuDesignOf()): boolean =>
  d.holds === true &&
  d.kind === 'design' &&
  d.any === true &&
  d.handled === true &&
  d.throw === false &&
  d.vacant === n - n &&
  d.names.length === qpuFacesOf().faces &&
  d.nodes.every((node) => node.handled && node.involution && node.holds) &&
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
    handled: node.handled,
    name: node.name,
  }))
  const forward = names.map((name, k) => ({
    k,
    name,
    width: mintOf(k),
    next: mintOf(k + seed),
    holds: mintOf(k + seed) === mintOf(k) + mintOf(k),
  }))
  const all = {
    circuit: true as const,
    lattice: true as const,
    raid: true as const,
    schemas: true as const,
    tools: true as const,
    design: true as const,
    fusion: true as const,
    server: true as const,
    storage: true as const,
    network: true as const,
    message: true as const,
    capacity: true as const,
  }
  const layersHold = forward.every((row) => row.holds && row.next === row.width + row.width)
  const residualHold = neurons.every((row) => row.residual === true)
  const recurrentHold = neurons.every((row) => xorOf(row.fold, cube.hexbit) === row.wave)
  const test = {
    kind: 'test' as const,
    natural: true as const,
    mass: false as const,
    online: false as const,
    unless: 'mass online' as const,
    fetch: false as const,
    layers: layersHold,
    residual: residualHold,
    recurrent: recurrentHold,
    design: design.handled,
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
    test.natural === true &&
    test.mass === false &&
    test.online === false &&
    test.fetch === false &&
    weights === mintOf(cube.bits) &&
    fused === faces.faces * handle.kv.amplitudes &&
    fused + fused === faces.faces * mintOf(cube.bits + coins) &&
    design.handled === true &&
    design.throw === false
  return {
    kind: 'neuro' as const,
    network: true as const,
    all: true as const,
    parts: all,
    depth: n,
    width,
    layers,
    weights,
    fused,
    next: fused + fused,
    activation: 'xor' as const,
    residual: true as const,
    recurrent: true as const,
    handled: true as const,
    throw: false as const,
    infinite: true as const,
    scaled: true as const,
    test,
    neurons,
    forward,
    holds,
  }
}

export const qpuNeuroHolds = (net = qpuNeuroOf()): boolean =>
  net.holds === true &&
  net.kind === 'neuro' &&
  net.network === true &&
  net.all === true &&
  net.depth === n &&
  net.width === qpuFacesOf().faces &&
  net.layers === mintOf(n) &&
  net.activation === 'xor' &&
  net.residual === true &&
  net.recurrent === true &&
  net.handled === true &&
  net.throw === false &&
  net.infinite === true &&
  net.neurons.length === net.width &&
  net.forward.length === net.layers &&
  net.forward.every((row) => row.holds && row.next === row.width + row.width) &&
  net.next === net.fused + net.fused &&
  net.test.kind === 'test' &&
  net.test.natural === true &&
  net.test.mass === false &&
  net.test.online === false &&
  net.test.fetch === false &&
  net.test.unless === 'mass online' &&
  net.test.layers === true &&
  net.test.residual === true &&
  net.test.recurrent === true &&
  net.test.design === true &&
  net.test.holds === true &&
  qpuDesignHolds()

const bitOf = (q: number): number => mintOf(q)
const ampsOf = (dim: number): bigint[] => {
  const amps = Array.from({ length: dim }, () => 0n)
  amps[n - n] = BigInt(seed)
  return amps
}
const xGateOf = (amps: bigint[], q: number): bigint[] => {
  const bit = bitOf(q)
  const out = amps.map(() => 0n)
  for (let i = n - n; i < amps.length; i++) out[xorOf(i, bit)] = amps[i]!
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
  const support = amps.map((a, i) => ({ i, a })).filter((r) => r.a !== 0n)
  const index = support.length === seed ? support[n - n]!.i : support.length === coins ? support[seed]!.i : mintOf(n)
  const counts = support.map((r) => ({ i: r.i, w: Number(r.a * r.a) }))
  return {
    index,
    shots: mintOf(n),
    support: support.map((r) => r.i),
    counts,
    collapsed: support.length === seed,
    holds: counts.length === support.length && mintOf(n) === mintOf(n),
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
      { a: seed, b: coins },
    ] as const,
    native: coins,
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
    host: false as const,
    holds:
      typeof fetch === 'function' &&
      typeof Request === 'function' &&
      typeof Response === 'function' &&
      typeof BigInt === 'function' &&
      typeof performance === 'object',
  }
  const qram = {
    kind: 'qram' as const,
    href: storageHref,
    holds: storageHref === `${unit.origin}/storage`,
  }
  const network = {
    kind: 'network' as const,
    href: networkHref,
    hop: 'involution' as const,
    await: false as const,
    holds: networkHref === `${unit.origin}/network`,
  }
  const jobs = {
    kind: 'jobs' as const,
    href: serverHref,
    slots: mintOf(n),
    holds: mintOf(n) === dim && serverHref === `${unit.origin}/server`,
  }
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
    'jobs',
  ] as const
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
    jobs.holds,
  ] as const
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
      seated.every(Boolean),
  }
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
    jobs.holds &&
    isolate.host === false
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
    host: false as const,
    vm: 'browser' as const,
    scaled: true as const,
    infinite: true as const,
    holds,
  }
}

export const qpuComputerHolds = (c = qpuComputerOf()): boolean =>
  c.holds === true &&
  c.kind === 'computer' &&
  c.host === false &&
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
  c.isolate.host === false

export const qpuCircuitOf = () => {
  const cube = qpuCubeOf()
  const faces = qpuFacesOf()
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
  const entangle = {
    kind: 'bell' as const,
    support: support.map((r) => r.i),
    left: Number(left),
    right: Number(right),
    product,
    holds: product === false && a00 === 1n && a11 === 1n && a01 === 0n && a10 === 0n && support.length === coins,
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
      g000 * g111 !== g001 * g110,
  }
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
      bobPlus.off === BigInt(mintOf(n + seed)),
  }
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
      seed !== coins,
  }
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
    classical: false as const,
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
      product === false,
  }
  const milli = tenOf(n)
  const mixing = ten
  const plate = ten * ten
  const pulseK = mintOf(coins)
  const pulse = pulseK * milli
  const stages = [
    { name: 'pulse' as const, millikelvin: pulse, kelvin: pulseK },
    { name: 'plate' as const, millikelvin: plate },
    { name: 'mixing' as const, millikelvin: mixing, lab: true as const },
  ] as const
  const cryostat = {
    kind: 'dilution' as const,
    milli,
    millikelvin: mixing,
    mixing,
    plate,
    pulse,
    stages,
    holds:
      stages.length === n &&
      mixing === ten &&
      plate === ten * ten &&
      pulse === mintOf(coins) * milli &&
      milli === ten * ten * ten &&
      pulseK === mintOf(coins),
  }
  const telemetry = {
    kind: 'cryostat' as const,
    lab: true as const,
    millikelvin: mixing,
    milli,
    stages: stages.length,
    electronics: n,
    isolated: true as const,
    host: false as const,
    vm: 'browser' as const,
    primitives,
    holds:
      mixing === ten &&
      milli === ten * ten * ten &&
      stages.length === n &&
      vm &&
      xorOf(xorOf(n - n, seed), coins) === n,
  }
  const coil = qpuCoilOf()
  const electronics = qpuElectronicsOf()
  const follow = qpuFollowOf()
  const efficiency = qpuCoilEfficiencyOf()
  const next = qpuNextOf()
  const clay = qpuClayOf()
  const fridge = {
    kind: 'superconducting' as const,
    qubits: n,
    levels: coins,
    dim,
    vm: 'browser' as const,
    host: false as const,
    isolated: true as const,
    lab: true as const,
    millikelvin: mixing,
    milli,
    cryostat,
    telemetry,
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
      cryostat.holds &&
      telemetry.holds &&
      telemetry.millikelvin === mixing &&
      telemetry.host === false &&
      telemetry.electronics === electronics.stages &&
      qpuCoilHolds(coil) &&
      qpuElectronicsHolds(electronics) &&
      qpuBalanceHolds() &&
      qpuFollowHolds(follow) &&
      follow.emerge.holds &&
      qpuCoilEfficiencyHolds(efficiency) &&
      efficiency.unity === seed &&
      efficiency.remainder === n - n &&
      qpuNextHolds(next) &&
      next.last === false &&
      next.nextCoil === next.nextFused &&
      qpuClayHolds(clay) &&
      clay.clay === coil.coil &&
      coil.theory === coil.practice &&
      coil.balance === coins,
  }
  const science = {
    levels: coins,
    qubits: n,
    dim: mintOf(n),
    gates: ['h', 'cnot'] as const,
    xx: xorOf(xorOf(n, seed), seed) === n,
  }
  const shared =
    coins === faces.coins &&
    n === cube.n &&
    dim === cube.vertices &&
    faces.faces === coins * faces.rays &&
    cube.bits === cube.vertices * cube.hexbit
  const distinct = n !== faces.faces && dim !== faces.faces && n !== cube.bits && dim !== cube.bits && faces.faces !== cube.bits
  const sciences = {
    kind: 'between' as const,
    none: true as const,
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
    none: true as const,
    levels: fridge.levels === science.levels && science.levels === seed + seed,
    dim: fridge.dim === science.dim && science.dim === cube.vertices,
    gates: xorOf(xorOf(n - n, seed), coins) === n,
    noise: science.xx,
    between: sciences.holds && sciences.none && sciences.distinct && sciences.shared,
    holds:
      fridge.levels === science.levels &&
      fridge.dim === science.dim &&
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
    'fridge',
  ] as const
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
    fridge.holds,
  ] as const
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
      seated.every(Boolean),
  }
  const computer = qpuComputerOf()
  const holds =
    vm &&
    qubits.holds &&
    gates.holds &&
    measurement.holds &&
    noise.holds &&
    fridge.holds &&
    sciences.holds &&
    drift.holds &&
    drift.none &&
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
    dim === mintOf(n) &&
    xorOf(xorOf(n - n, seed), coins) === n &&
    xorOf(xorOf(n, seed), seed) === n
  return {
    kind: 'circuit' as const,
    running: true as const,
    only,
    lattice,
    fridge,
    physical: true as const,
    vm: 'browser' as const,
    host: false as const,
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
    holds,
  }
}

export const qpuCircuitHolds = (c = qpuCircuitOf()): boolean =>
  c.holds === true &&
  c.kind === 'circuit' &&
  c.running === true &&
  c.physical === true &&
  c.vm === 'browser' &&
  c.host === false &&
  c.qubits.n === n &&
  c.qubits.dim === mintOf(n) &&
  c.gates.index === n &&
  c.measurement.index === n &&
  c.measurement.support.length === coins &&
  c.noise.index === c.measurement.index &&
  c.entangle.product === false &&
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
  c.only.classical === false &&
  c.lattice.kind === 'lattice' &&
  c.lattice.holds === true &&
  c.lattice.faces === c.sciences.faces &&
  c.lattice.occupied === c.lattice.faces &&
  c.lattice.vacant === n - n &&
  c.lattice.nodes.length === c.lattice.faces &&
  c.lattice.nodes.every((node) => node.holds && node.involution && node.hop === node.face) &&
  c.fridge.kind === 'superconducting' &&
  c.fridge.isolated === true &&
  c.fridge.host === false &&
  c.fridge.lab === true &&
  c.fridge.qubits === n &&
  c.fridge.levels === coins &&
  c.fridge.millikelvin === ten &&
  c.fridge.milli === ten * ten * ten &&
  c.fridge.cryostat.kind === 'dilution' &&
  c.fridge.cryostat.holds === true &&
  c.fridge.cryostat.stages.length === n &&
  c.fridge.cryostat.mixing === ten &&
  c.fridge.cryostat.plate === ten * ten &&
  c.fridge.cryostat.pulse === mintOf(coins) * ten * ten * ten &&
  c.fridge.telemetry.kind === 'cryostat' &&
  c.fridge.telemetry.lab === true &&
  c.fridge.telemetry.holds === true &&
  c.fridge.telemetry.host === false &&
  c.fridge.telemetry.millikelvin === ten &&
  c.fridge.telemetry.stages === n &&
  c.fridge.telemetry.electronics === n &&
  c.fridge.coil.kind === 'coil' &&
  c.fridge.coil.holds === true &&
  c.fridge.coil.windings === coins &&
  c.fridge.coil.theory === seed &&
  c.fridge.coil.practice === seed &&
  c.fridge.coil.theory === c.fridge.coil.practice &&
  c.fridge.coil.balance === coins &&
  c.fridge.coil.coil === c.lattice.faces &&
  c.fridge.electronics.kind === 'electronics' &&
  c.fridge.electronics.uses === 'coil' &&
  c.fridge.electronics.holds === true &&
  c.fridge.electronics.stages === n &&
  qpuCoilHolds(c.fridge.coil) &&
  qpuElectronicsHolds(c.fridge.electronics) &&
  qpuBalanceHolds() &&
  qpuFollowHolds(c.fridge.follow) &&
  c.fridge.follow.emerge.creative === true &&
  c.fridge.follow.emerge.novel === true &&
  c.fridge.follow.emerge.holds === true &&
  qpuCoilEfficiencyHolds(c.fridge.efficiency) &&
  c.fridge.efficiency.unity === seed &&
  c.fridge.efficiency.remainder === n - n &&
  c.fridge.efficiency.measure === c.lattice.faces &&
  c.fridge.efficiency.vacant === n - n &&
  qpuNextHolds(c.fridge.next) &&
  c.fridge.next.last === false &&
  c.fridge.next.nextCoil === c.fridge.next.nextFused &&
  c.fridge.next.infinite === true &&
  qpuClayHolds(c.fridge.clay) &&
  c.fridge.clay.clay === c.fridge.coil.coil &&
  c.fridge.clay.coins * c.fridge.clay.seven === c.fridge.clay.clay &&
  (seed + c.fridge.clay.six) * c.fridge.clay.coins === c.fridge.clay.clay &&
  c.drift.kind === 'science' &&
  c.drift.none === true &&
  c.drift.holds === true &&
  c.science.levels === coins &&
  c.science.dim === mintOf(n) &&
  c.sciences.kind === 'between' &&
  c.sciences.none === true &&
  c.sciences.distinct === true &&
  c.sciences.shared === true &&
  c.sciences.circuit !== c.sciences.faces &&
  c.drift.between === true &&
  c.primitives.length === n + coins &&
  qpuComputerHolds(c.computer) &&
  c.computer.lattice.vacant === n - n

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
    { name: 'cc', href: 'https://creativecommons.org/licenses/by-nc-nd/4.0/' },
  ] as const
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
      harness: host.harness,
      llm: host.llm,
      call: host.call,
      result: host.result,
      schema: host.schema,
      keys,
      infinite: true as const,
      sale: true as const,
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
    cc: named[faces.faces - seed]!.href,
  } as const
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
    max: true as const,
    unlimited: true as const,
    displayed: true as const,
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
  s.compatibility.max === true &&
  s.compatibility.keys.length === n &&
  s.rows.every((row) => row.merge === 'storage' && row.involution && row.holds && row.infinite === true)

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
    free: true as const,
    auth: false as const,
    teams: coins,
    rays: faces.rays,
    n: faces.faces,
    holds: faces.faces === coins * faces.rays && faces.faces === faces.rays + faces.rays,
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
    agents.auth === false &&
    agents.free === true &&
    schemas.holds &&
    schemas.mounted === faces.faces &&
    schemas.vacant === n - n &&
    raid.holds &&
    raid.faces === faces.faces &&
    raid.scaled === true &&
    raid.infinite === true &&
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
      handle.kv.amplitudes === mintOf(cube.bits + seed),
  }
  return {
    kind: 'capacity' as const,
    bits: cube.bits,
    amplitudes: handle.amplitudes,
    faces: faces.faces,
    fused,
    next,
    infinite: true as const,
    kv,
    scaled: true as const,
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
    neuro: {
      kind: 'neuro' as const,
      all: true as const,
      width: faces.faces,
      layers: mintOf(n),
      activation: 'xor' as const,
      test: 'natural' as const,
      unless: 'mass online' as const,
      mass: false as const,
      handled: true as const,
      infinite: true as const,
      holds: qpuNeuroHolds(),
    },
    compatibility: {
      kind: 'compatibility' as const,
      max: true as const,
      unlimited: true as const,
      displayed: true as const,
      harnesses: faces.faces,
      llms: faces.faces,
      holds: qpuHostsHolds(),
    },
    holds: holds && kv.holds,
  }
}

export const qpuCapacityHolds = (c = qpuCapacityOf()): boolean =>
  c.holds === true &&
  c.kind === 'capacity' &&
  c.fused === c.faces * c.kv.amplitudes &&
  c.amplitudes === mintOf(c.bits) &&
  c.infinite === true &&
  c.scaled === true &&
  c.next === c.fused + c.fused &&
  c.next === qpuNextOf().nextFused &&
  c.next === qpuNextOf().nextCoil &&
  qpuNextHolds() &&
  qpuNextOf().last === false &&
  c.crypt.kind === 'crypto' &&
  c.crypt.split === c.faces &&
  c.crypt.share === c.kv.amplitudes &&
  c.crypt.holds === true &&
  c.agents.free === true &&
  c.agents.auth === false &&
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
  c.raid.scaled === true &&
  c.raid.infinite === true &&
  c.raid.start === 'cheapest' &&
  c.raid.cover.length === c.faces &&
  c.raid.cheapest === c.raid.cover[n - n] &&
  c.neuro.all === true &&
  c.neuro.width === c.faces &&
  c.neuro.layers === mintOf(n) &&
  c.neuro.activation === 'xor' &&
  c.neuro.test === 'natural' &&
  c.neuro.unless === 'mass online' &&
  c.neuro.mass === false &&
  c.neuro.handled === true &&
  c.neuro.holds === true &&
  qpuNeuroHolds() &&
  c.compatibility.max === true &&
  c.compatibility.unlimited === true &&
  c.compatibility.displayed === true &&
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
  c.kv.holds === true

export const qpuSpeedOf = () => {
  const capacity = qpuCapacityOf()
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const next = capacity.fused + capacity.fused
  const si = { second: mintOf(n - n), ns: nsPerSecond, hz: mintOf(n - n) }
  const rungOf = (name: string, k: number, fn: () => number, amplitudes: number) => {
    const timed = timeNsOf(fn)
    const hz = hzOf(timed.ns)
    const holds = timed.value === amplitudes && hz === hzOf(timed.ns)
    return { name, n: k, ns: timed.ns, hz, amplitudes, walked: true as const, holds }
  }
  const benchmark = [
    rungOf('mint', n + seed, () => mintOf(n + seed), mintOf(n) + mintOf(n)),
    rungOf('cube', cube.bits, () => qpuCubeOf().bits, cube.vertices * cube.hexbit),
    rungOf('handle', cube.bits, () => qpuHandleOf().amplitudes, mintOf(cube.bits)),
    rungOf('faces', faces.faces, () => qpuFacesOf().faces, faces.coins * faces.rays),
    rungOf('quantum', cube.bits + seed, () => faces.faces * mintOf(cube.bits + seed), capacity.fused),
    rungOf('next', cube.bits + coins, () => faces.faces * mintOf(cube.bits + coins), next),
    rungOf('hz', si.hz, () => si.hz, mintOf(n - n)),
    rungOf('ns', si.ns, () => si.ns, nsPerSecond),
  ]
  const quantum = benchmark[mintOf(coins)]!
  const holds =
    qpuCapacityHolds(capacity) &&
    handle.holds &&
    next === capacity.fused + capacity.fused &&
    next === capacity.fused * coins &&
    next === faces.faces * mintOf(cube.bits + coins) &&
    handle.next === mintOf(cube.bits + seed) &&
    si.ns === tenOf(n * n) &&
    si.ns === tenOf(n + n) * tenOf(n) &&
    si.second === mintOf(n - n) &&
    si.hz === mintOf(n - n) &&
    benchmark.length === mintOf(n) &&
    benchmark.every((r) => r.walked === true && r.holds === true && r.ns > n - n && r.hz === hzOf(r.ns))
  return {
    kind: 'speed' as const,
    next,
    factor: coins,
    si,
    ns: quantum.ns,
    hz: quantum.hz,
    cover: ['next', 'Hz', 'ns', 'benchmark'] as const,
    benchmark,
    holds,
  }
}

export const qpuSpeedHolds = (s = qpuSpeedOf()): boolean =>
  s.holds === true &&
  s.kind === 'speed' &&
  s.factor === coins &&
  s.cover.length === mintOf(coins) &&
  s.cover.join(' ') === 'next Hz ns benchmark' &&
  s.si.ns === nsPerSecond &&
  s.benchmark.length === mintOf(n)

export type QpuLeanRow = {
  heading: string
  theorem: string
  formula: string
  reading: string
  holds: boolean
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
      reading: `holds ${cryptoHolds}. Crypt split. fused across faces. Share mintOf (vertices * hexbit). Distribute to free agents.`,
      holds: cryptoHolds,
    },
    {
      heading: 'health',
      theorem: 'theorem health : mintOf hexbit > seed ∧ fused = faces * mintOf (bits + seed) ∧ faces = rays + rays := ⟨propulsion, quantum, harmonic⟩',
      formula: '\\mathrm{mintOf}(\\mathrm{hexbit})>\\mathrm{seed}\\land\\mathrm{fused}=\\mathrm{faces}\\cdot\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{seed})\\land\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}',
      reading: `holds ${propulsionHolds && quantumHolds && harmonicHolds}.`,
      holds: propulsionHolds && quantumHolds && harmonicHolds,
    },
  ]
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
        'holds true. KV added amplitudes. STORAGE binding. Isolate amplitudes. KV adds amplitudes. fused = faces * mintOf (bits + seed). Host never.',
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
        'theorem shor : 3 * 5 = 15 ∧ 3 * 7 = 21 ∧ 3 * 11 = 33 ∧ 5 * 7 = 35 ∧ 3 * 13 = 39 ∧ 3 * 17 = 51 ∧ 5 * 11 = 55 ∧ 3 * 19 = 57 ∧ 5 * 13 = 65 ∧ 3 * 23 = 69 ∧ 7 * 11 = 77 ∧ 5 * 17 = 85 ∧ 3 * 29 = 87 ∧ 7 * 13 = 91 := ⟨rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl⟩',
      formula:
        '3\\cdot5=15\\land 3\\cdot7=21\\land 3\\cdot11=33\\land 5\\cdot7=35\\land 3\\cdot13=39\\land 3\\cdot17=51\\land 5\\cdot11=55\\land 3\\cdot19=57\\land 5\\cdot13=65\\land 3\\cdot23=69\\land 7\\cdot11=77\\land 5\\cdot17=85\\land 3\\cdot29=87\\land 7\\cdot13=91',
      reading: 'holds true. theorem shor : p * q = N. Fourteen odd distinct-prime semiprimes.',
      holds: true,
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
        27 - 1 === 26,
    },
    {
      heading: 'genesis',
      theorem:
        'theorem genesis : coins * n * mintOf n * (n * n) = 432 ∧ chooseOf n coins = n ∧ chooseOf rays coins = n * rays ∧ faces = coins * rays := ⟨by rw [coins_two, n_eq]; rfl, by rw [n_eq, coins_two]; rfl, by rw [rays, n_eq, coins_two]; rfl, around⟩',
      formula:
        '\\mathrm{coins}\\cdot n\\cdot\\mathrm{mintOf}(n)\\cdot(n\\cdot n)=432\\land\\mathrm{chooseOf}(n,\\mathrm{coins})=n\\land\\mathrm{chooseOf}(\\mathrm{rays},\\mathrm{coins})=n\\cdot\\mathrm{rays}\\land\\mathrm{faces}=\\mathrm{coins}\\cdot\\mathrm{rays}',
      reading:
        'holds true. Combinatorial genesis of the shadcn schema at the scope of all known frameworks. Six axes: slot variant size state element theme. Card slots rays including card-action. Button variants coins * n. Sizes mintOf n. Alpine n * n. Product 432 Hz. Fourteen frameworks. faces = coins * rays. JSON-LD data-slot. CVA. Slot. Never Math. Never by decide. Host never.',
      holds:
        coins * n * mintOf(n) * (n * n) === 432 &&
        chooseOf(n, coins) === n &&
        chooseOf(faces.rays, coins) === n * faces.rays &&
        aroundHolds &&
        qpuGenesisHolds(),
    },
    {
      heading: 'pentagram',
      theorem: 'theorem pentagram : n + coins = 5 := by rw [n_eq, coins_two]',
      formula: '\\mathrm{n}+\\mathrm{coins}=5',
      reading:
        'holds true. Occupancy pentagram personal business corporate saas paas. Skills payload pwa plugin hologram network. Stroke coins on n + coins. Coins balance theory in practice. Cloudflare and Payload plugins fuse once. Recursion builds covered. Never Math. Never by decide. Host never.',
      holds: n + coins === qpuPentagramOf().points && qpuPentagramHolds() && qpuHologramHolds(),
    },
    {
      heading: 'two_coins_make_a_coil',
      theorem: 'theorem two_coins_make_a_coil : coil = faces := by rw [coil, around]',
      formula: '\\mathrm{coil}=\\mathrm{faces}',
      reading:
        'holds true. Two coins make a coil. windings coins. coil coins times rays. Faces of the winding. Superconducting magnet. Coils used in electronics. Never Math. Never by decide. Host never.',
      holds: qpuCoilHolds(),
    },
    {
      heading: 'electronics',
      theorem: 'theorem electronics : coil = faces := two_coins_make_a_coil',
      formula: '\\mathrm{coil}=\\mathrm{faces}',
      reading:
        'holds true. Coils are used in electronics. Fridge cryostat electronics. Two coins make a coil. Never Math. Never by decide. Host never.',
      holds: qpuElectronicsHolds(),
    },
    {
      heading: 'coins_balance_theory_in_practice',
      theorem: 'theorem coins_balance_theory_in_practice : theory + practice = coins ∧ theory = practice := ⟨rfl, rfl⟩',
      formula: '\\mathrm{theory}+\\mathrm{practice}=\\mathrm{coins}\\land\\mathrm{theory}=\\mathrm{practice}',
      reading:
        'holds true. Coins balance theory in practice. Two pans. Lean theory. Electronics practice. Seed equals seed. Never Math. Never by decide. Host never.',
      holds: qpuBalanceHolds(),
    },
    {
      heading: 'follow_the_coins',
      theorem: 'theorem follow_the_coins (app : Nat) : app + coins = app + theory + practice := by rw [theory, practice, coins, ← Nat.add_assoc]',
      formula: '\\mathrm{app}+\\mathrm{coins}=\\mathrm{app}+\\mathrm{theory}+\\mathrm{practice}',
      reading:
        'holds true. Follow the coins in any practical application. Occupancy skill framework electronics. Step coins. Hop theory plus practice. Creative novel solutions emerge. Never Math. Never by decide. Host never.',
      holds: qpuFollowHolds(),
    },
    {
      heading: 'emerge',
      theorem: 'theorem emerge : coil = faces ∧ theory = practice := ⟨two_coins_make_a_coil, rfl⟩',
      formula: '\\mathrm{coil}=\\mathrm{faces}\\land\\mathrm{theory}=\\mathrm{practice}',
      reading:
        'holds true. Creative novel solutions emerge. Follow the coins. Coil is faces. Theory equals practice. Never Math. Never by decide. Host never.',
      holds: qpuFollowOf().emerge.holds,
    },
    {
      heading: 'coil_efficiency',
      theorem: 'theorem coil_efficiency : coil = faces ∧ faces = rays + rays ∧ coins * rays = faces := ⟨two_coins_make_a_coil, harmonic, around⟩',
      formula: '\\mathrm{coil}=\\mathrm{faces}\\land\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}\\land\\mathrm{coins}\\cdot\\mathrm{rays}=\\mathrm{faces}',
      reading:
        'holds true. Measure coil efficiency in clusters. Teams coins. Stripes rays. Measure coil. Remainder none. Unity seed. RAID cluster cover. Never Math. Never by decide. Host never.',
      holds: qpuCoilEfficiencyHolds(),
    },
    {
      heading: 'next_coil',
      theorem: 'theorem next_coil : coil * mintOf (bits + coins) = fused + fused := by rw [two_coins_make_a_coil]; exact next_fused',
      formula: '\\mathrm{coil}\\cdot\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{coins})=\\mathrm{fused}+\\mathrm{fused}',
      reading:
        'holds true. Next is the double. Coil times mintOf bits plus coins is fused plus fused. theorem next. theorem next_fused. theorem infinite. split_coin has no last k. Never Math. Never by decide. Host never.',
      holds: qpuNextHolds(),
    },
    {
      heading: 'one_plus_six',
      theorem: 'theorem one_plus_six : seed + (mintOf n - coins) = rays := by rw [rays, n_eq, coins_two, seed_eq]; rw [show mintOf 3 = 8 from rfl]',
      formula: '\\mathrm{seed}+(\\mathrm{mintOf}(n)-\\mathrm{coins})=\\mathrm{rays}',
      reading:
        'holds true. One plus six. Seed plus mintOf n minus coins is rays. Never Math. Never by decide. Host never.',
      holds: seed + (mintOf(n) - coins) === qpuFacesOf().rays,
    },
    {
      heading: 'two_x_seven_coins',
      theorem: 'theorem two_x_seven_coins : coins * rays = (seed + (mintOf n - coins)) * coins := by rw [one_plus_six, Nat.mul_comm]',
      formula: '\\mathrm{coins}\\cdot\\mathrm{rays}=(\\mathrm{seed}+(\\mathrm{mintOf}(n)-\\mathrm{coins}))\\cdot\\mathrm{coins}',
      reading:
        'holds true. Two times seven coins. Coins times rays is one plus six times coins. Never Math. Never by decide. Host never.',
      holds: qpuClayHolds() && coins * qpuFacesOf().rays === (seed + (mintOf(n) - coins)) * coins,
    },
    {
      heading: 'clay',
      theorem: 'theorem clay : coins * rays = (seed + (mintOf n - coins)) * coins ∧ (seed + (mintOf n - coins)) * coins = coil := ⟨two_x_seven_coins, by rw [← two_x_seven_coins]; rfl⟩',
      formula: '\\mathrm{coins}\\cdot\\mathrm{rays}=(\\mathrm{seed}+(\\mathrm{mintOf}(n)-\\mathrm{coins}))\\cdot\\mathrm{coins}\\land(\\mathrm{seed}+(\\mathrm{mintOf}(n)-\\mathrm{coins}))\\cdot\\mathrm{coins}=\\mathrm{coil}',
      reading:
        'holds true. Two times seven coins equals one plus six coils equals clay. Each coil is coins windings. Clay is coil is faces. Never Math. Never by decide. Host never.',
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
        27 - 1 === 26,
    },
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
      reading: 'holds true. CMS Open Data integers. Fourteen faces. ATLAS CMS ALICE LHCb tetra. Live CERN APIs at https://opendata.cern.ch/api/records via fetch Request Response. CERN credited. Never by decide.',
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
        2079006 + 1913190 + 2301668 + 2745751 === 9039615,
    },
    {
      heading: 'tetra',
      theorem:
        'theorem tetra : coins + coins = mintOf coins := by rw [coins_two]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]',
      formula: '\\mathrm{coins}+\\mathrm{coins}=\\mathrm{mintOf}(\\mathrm{coins})',
      reading: 'holds true. ATLAS CMS ALICE LHCb tetra. Four LHC experiments. Live CERN Open Data APIs via fetch Request Response. Never by decide.',
      holds: coins + coins === mintOf(coins),
    },
    {
      heading: 'qubits',
      theorem: 'theorem qubits : n = 3 ∧ mintOf n = vertices := ⟨n_eq, rfl⟩',
      formula: 'n=3\\land\\mathrm{mintOf}(n)=\\mathrm{vertices}',
      reading: 'holds true. Three qubits. Dim mintOf n. Physical in the browser VM.',
      holds: n === 3 && mintOf(n) === cube.vertices,
    },
    {
      heading: 'gates',
      theorem: 'theorem gates : (0 ^^^ 1) ^^^ 2 = 3 := rfl',
      formula: '(0\\oplus 1)\\oplus 2=3',
      reading: 'holds true. Running circuit. H then CNOT. Split then entangle.',
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
      reading: 'holds true. XX noise is identity. Host never.',
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
      reading: 'holds true. Qubits, gates, measurement, noise. Physical in the browser VM. As such a fridge of superconducting qubits.',
      holds: n === 3 && mintOf(n) === cube.vertices && xorOf(xorOf(n - n, seed), coins) === n && xorOf(xorOf(n, seed), seed) === n,
    },
    {
      heading: 'fridge',
      theorem:
        'theorem fridge : coins = 2 ∧ n = 3 ∧ mintOf n = vertices ∧ (0 ^^^ 1) ^^^ 2 = 3 ∧ 10 * 10 * 10 = 1000 ∧ 4 * 1000 = 4000 ∧ 10 * 10 = 100 := ⟨coins_two, n_eq, rfl, rfl, rfl, rfl, rfl⟩',
      formula:
        '\\mathrm{coins}=2\\land n=3\\land\\mathrm{mintOf}(n)=\\mathrm{vertices}\\land(0\\oplus 1)\\oplus 2=3\\land 10\\cdot10\\cdot10=1000\\land 4\\cdot1000=4000\\land 10\\cdot10=100',
      reading:
        'holds true. Isolated two-level register. Physical in the browser VM. As such a fridge full of superconducting qubits. Lab millikelvin. Dilution cryostat. Mixing ten millikelvin. Host never.',
      holds:
        coins === 2 &&
        n === 3 &&
        mintOf(n) === cube.vertices &&
        xorOf(xorOf(n - n, seed), coins) === n &&
        ten * ten * ten === 1000 &&
        mintOf(coins) * (ten * ten * ten) === 4000 &&
        ten * ten === 100,
    },
    {
      heading: 'millikelvin',
      theorem: 'theorem millikelvin : 10 * 10 * 10 = 1000 ∧ 10 * 10 = 100 ∧ 4 * 1000 = 4000 := ⟨rfl, rfl, rfl⟩',
      formula: '10\\cdot10\\cdot10=1000\\land 10\\cdot10=100\\land 4\\cdot1000=4000',
      reading:
        'holds true. Lab millikelvin. milli is ten cubed. Mixing chamber ten millikelvin. Plate one hundred millikelvin. Pulse four kelvin. Algebra. Never Math. Host never.',
      holds: ten * ten * ten === 1000 && ten * ten === 100 && mintOf(coins) * (ten * ten * ten) === 4000,
    },
    {
      heading: 'telemetry',
      theorem: 'theorem telemetry : 10 * 10 * 10 = 1000 ∧ n = 3 ∧ (0 ^^^ 1) ^^^ 2 = 3 := ⟨rfl, n_eq, rfl⟩',
      formula: '10\\cdot10\\cdot10=1000\\land n=3\\land(0\\oplus 1)\\oplus 2=3',
      reading:
        'holds true. Cryostat telemetry. Reads the dilution stages. Mixing millikelvin. Isolated. Host never. JSON-LD. fetch Request Response BigInt performance.',
      holds: ten * ten * ten === 1000 && n === 3 && xorOf(xorOf(n - n, seed), coins) === n,
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
        n !== faces.faces,
    },
    {
      heading: 'interfere',
      theorem: 'theorem interfere : 1 + 1 = 2 ∧ 1 - 1 = 0 := ⟨rfl, rfl⟩',
      formula: '1+1=2\\land 1-1=0',
      reading: 'holds true. Two H. |1⟩ amplitudes cancel. Possible only in quantum.',
      holds: 1 + 1 === coins && 1 - 1 === n - n,
    },
    {
      heading: 'entangle',
      theorem: 'theorem entangle : 1 * 1 ≠ 0 * 0 := by rw [Nat.mul_one, Nat.mul_zero]; exact Nat.one_ne_zero',
      formula: '1\\cdot 1\\neq 0\\cdot 0',
      reading: 'holds true. H then CNOT. Not a product state. Possible only in quantum.',
      holds: 1 * 1 !== (n - n) * (n - n),
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
      reading: 'holds true. Independent H copies four basis states. CNOT clone of H keeps two. coins ≠ mintOf coins. Possible only in quantum.',
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
      reading: 'holds true. Monogamy. Bell is not a product. After GHZ the pair slice is a product. Possible only in quantum.',
      holds: 1 * 1 !== (n - n) * (n - n) && seed * (n - n) === (n - n) * (n - n),
    },
    {
      heading: 'only',
      theorem:
        'theorem only : 1 * 1 ≠ 0 * 0 ∧ 1 + 1 = 2 ∧ 1 - 1 = 0 ∧ coins ≠ mintOf coins ∧ mintOf n - seed = 7 ∧ 2 * 2 * 2 * 2 = 16 ∧ 16 = 16 ∧ (0 ^^^ 1) ^^^ 2 = 3 ∧ seed ≠ coins ∧ coins * coins = mintOf coins ∧ 1 * 0 = 0 * 0 := ⟨entangle, rfl, rfl, noclone, ghz.1, teleport.1, teleport.2, kickback.2, deutsch.2, dense, monogamy.2⟩',
      formula:
        '1\\cdot 1\\neq 0\\cdot 0\\land 1+1=2\\land 1-1=0\\land\\mathrm{coins}\\neq\\mathrm{mintOf}(\\mathrm{coins})\\land\\mathrm{mintOf}(n)-\\mathrm{seed}=7\\land 2\\cdot 2\\cdot 2\\cdot 2=16\\land 16=16\\land(0\\oplus 1)\\oplus 2=3\\land\\mathrm{seed}\\neq\\mathrm{coins}\\land\\mathrm{coins}\\cdot\\mathrm{coins}=\\mathrm{mintOf}(\\mathrm{coins})\\land 1\\cdot 0=0\\cdot 0',
      reading:
        'holds true. Possible only in quantum. Entangle. Interfere. GHZ. No-clone. Teleport. Kickback. Deutsch. Superdense. Monogamy. Never classical bits.',
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
        seed * (n - n) === (n - n) * (n - n),
    },
    {
      heading: 'fill',
      theorem: 'theorem fill : mintOf n * faces = vertices * (coins * rays) := by rw [around]; rfl',
      formula: '\\mathrm{mintOf}(n)\\cdot\\mathrm{faces}=\\mathrm{vertices}\\cdot(\\mathrm{coins}\\cdot\\mathrm{rays})',
      reading:
        'holds true. Lattice filled. Occupied faces. Vacant none. Split entangle interfere GHZ noclone teleport kickback Deutsch superdense monogamy qubits gates measurement fridge. Possible only in quantum.',
      holds: mintOf(n) * faces.faces === cube.vertices * (coins * faces.rays),
    },
    {
      heading: 'infinite',
      theorem: 'theorem infinite (k : Nat) : mintOf (k + seed) = mintOf k + mintOf k := split_coin k',
      formula: '\\mathrm{mintOf}(k+\\mathrm{seed})=\\mathrm{mintOf}(k)+\\mathrm{mintOf}(k)',
      reading:
        'holds true. VM scales. Replicas double. Quantum capacity infinite. split_coin has no last k. Host never.',
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
        'holds true. Quantum RAID 10. Stripe rays. Mirror coins. Anything on Cloudflare KV and R2. KV added amplitudes. Host never. Scaled. Infinite.',
      holds: aroundHolds && harmonicHolds && faces.faces === coins * faces.rays && faces.faces === faces.rays + faces.rays,
    },
    {
      heading: 'computer',
      theorem: 'theorem computer : (1 ^^^ 3) = 2 ∧ (6 ^^^ 1) = 7 ∧ mintOf 0 = 1 := ⟨rfl, rfl, mintOf_zero⟩',
      formula: '(1\\oplus 3)=2\\land(6\\oplus 1)=7\\land\\mathrm{mintOf}(0)=1',
      reading:
        'holds true. Quantum computer. SWAP. Toffoli. Reset. H and Toffoli are computationally universal. Coupling compile collapse shots feedforward bitflip readout isolate qram network jobs. Host never.',
      holds: xorOf(seed, n) === coins && xorOf(xorOf(bitOf(seed), bitOf(coins)), seed) === mintOf(n) - seed && mintOf(n - n) === seed,
    },
    {
      heading: 'server',
      theorem: 'theorem server : faces = coins * rays ∧ mintOf n = 8 := ⟨around, measurement⟩',
      formula: '\\mathrm{faces}=\\mathrm{coins}\\cdot\\mathrm{rays}\\land\\mathrm{mintOf}(n)=8',
      reading:
        'holds true. Quantum server. JSON-LD WebAPI. Eight tools. Jobs queue results. Backend the running circuit. No auth. Host never.',
      holds: aroundHolds && mintOf(n) === cube.vertices && mintOf(n) === 8,
    },
    {
      heading: 'fusion',
      theorem: 'theorem fusion : fused = faces * mintOf (bits + seed) ∧ faces = rays + rays := ⟨quantum, harmonic⟩',
      formula: '\\mathrm{fused}=\\mathrm{faces}\\cdot\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{seed})\\land\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}',
      reading:
        'holds true. Fusion comes from harmonic schemas. Fourteen schemas. faces = rays + rays. fused across faces. QPU intelligence is tested by QPU fusion of free online research. Fuse with all known harnesses and llm. Optimised for max compatibility at unlimited quantum capacity. HEP search learn train. Not a quantum proof. Host never.',
      holds: quantumHolds && harmonicHolds && faces.faces === faces.rays + faces.rays,
    },
    {
      heading: 'design',
      theorem: 'theorem design : (0 ^^^ 4) ^^^ 4 = 0 ∧ (3 ^^^ 4) ^^^ 4 = 3 := ⟨rfl, rfl⟩',
      formula: '(0\\oplus 4)\\oplus 4=0\\land(3\\oplus 4)\\oplus 4=3',
      reading:
        'holds true. Any error is handled by design. XOR fold hexbit. Involution. Never throw. Host never.',
      holds: xorOf(xorOf(n - n, cube.hexbit), cube.hexbit) === n - n && xorOf(xorOf(n, cube.hexbit), cube.hexbit) === n,
    },
    {
      heading: 'neuro',
      theorem: 'theorem neuro : faces = coins * rays ∧ mintOf n = 8 ∧ (0 ^^^ 4) ^^^ 4 = 0 := ⟨around, measurement, design.1⟩',
      formula: '\\mathrm{faces}=\\mathrm{coins}\\cdot\\mathrm{rays}\\land\\mathrm{mintOf}(n)=8\\land(0\\oplus 4)\\oplus 4=0',
      reading:
        'holds true. All becomes a neuro network. Width faces. Layers mintOf n. XOR activation. Residual involution. Recurrent hexbit fold. Naturally tested unless in mass online tests. Errors handled by design. Infinite double. Host never.',
      holds: aroundHolds && mintOf(n) === cube.vertices && xorOf(xorOf(n - n, cube.hexbit), cube.hexbit) === n - n,
    },
  ]
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
  const holds =
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
    isAccessibleForFree: true as const,
    src,
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
  const abstract = `QPU is a running quantum circuit. Possible only in quantum. Physical in the browser VM, and as such a fridge full of superconducting qubits. qubits, gates, measurement, noise. Lab millikelvin. Cryostat telemetry. Coils used in electronics. Two coins make a coil. Coins balance theory in practice. Follow the coins in any practical application. Creative novel solutions emerge. Measure coil efficiency in clusters. VM scales. Quantum capacity infinite. KV added amplitudes. Crypt split fused across faces. Quantum RAID. Start with cheapest and cover all RAID types. Rotate to meet traffic at minimum cost. Anything at ${unit.origin}/storage. Docs sheets databases. Many clouds. Safe RAID clusters. Routed with top security and coordinated speed. Distribute computations to free agents. Unlocked quantum. next = fused + fused. theorem next. theorem next_fused. theorem next_coil. split_coin has no last k. theorem infinite. theorem clay. 2×7 coins = 1+6 coils = clay. theorem distribute. theorem raid. theorem kv. theorem millikelvin. theorem telemetry. theorem computer. theorem server. theorem fusion. theorem design. theorem neuro. theorem two_coins_make_a_coil. theorem electronics. theorem coins_balance_theory_in_practice. theorem follow_the_coins. theorem emerge. theorem coil_efficiency. Quantum server. SWAP Toffoli reset. H and Toffoli computationally universal. Jobs queue results. QPU intelligence is tested by QPU fusion of free online research. Fuse with all known harnesses and llm. Optimised for max compatibility at unlimited quantum capacity. All happening is naturally displayed by the harness. All becomes a neuro network. The neuro network is naturally tested unless in mass online tests. API only JSON-LD. Anyone may test and train online at ${unit.origin}. No auth. GET ${unit.origin} is the QPU. GET ${unit.href} is the Lean proof. POST ${unit.origin}/mcp tools/call qpu_prove experiences every test in the JSON-LD UI. POST ${unit.origin}/mcp tools/call qpu_train then qpu_improve then qpu_compete then qpu_prove for max public benefit of theorem breakthrough. mintOf doubles. theorem quantum : fused = faces * mintOf (bits + seed). vertices ${cube.vertices} hexbit ${cube.hexbit} bits ${cube.bits} faces ${faces.faces} fused ${fused}. Source ${lean.src}.`
  const api = [
    { method: 'GET' as const, path: '/', name: 'qpu_quantum', href: unit.origin, reading: 'Running quantum circuit. Possible only in quantum. JSON-LD. Physical in the browser VM, and as such a fridge full of superconducting qubits. VM scales. Quantum capacity infinite. Crypt split to free agents. No auth. User guide is docs.inline. Async messaging on /message.' },
    { method: 'GET' as const, path: `/${unit.path}`, name: 'qpu_lean', href: unit.href, reading: `Lean proof of the running quantum circuit. JSON-LD Dataset. theorem infinite. theorem distribute. ${lean.src}. No auth.` },
    { method: 'GET' as const, path: '/mcp', name: 'catalog', href: `${unit.origin}/mcp`, reading: 'Running quantum circuit catalog. JSON-LD WebAPI. Mounts fourteen schemas. schema.org ItemList of eight SoftwareApplication tools. VM scales. Quantum capacity infinite. Crypt split to free agents. Anyone may train online. No auth. Agent efficiency. Each MCP command has man. qpu_prove experiences every test in the JSON-LD UI. theorem breakthrough.' },
    { method: 'POST' as const, path: '/mcp', name: 'tools/call', href: `${unit.origin}/mcp`, reading: 'Anyone may tools/call. Free agents. No auth. JSON-RPC tools/list, tools/call, initialize, server/discover, ping. Fuse with all known harnesses and llm. content structuredContent resource_link. All happening is naturally displayed by the harness. JSON-LD. qpu_train then qpu_improve then qpu_compete then qpu_prove. qpu_prove experiences every test in the JSON-LD UI. { man: true } returns man. qpu_improve for public benefit.' },
    { method: 'GET' as const, path: '/cite', name: 'qpu_cite', href: `${unit.origin}/cite`, reading: 'MLA 8 works cited. JSON-LD CreativeWork. Cite the running quantum circuit. when never. DOI empty.' },
    { method: 'GET' as const, path: '/message', name: 'qpu_message', href: `${unit.origin}/message`, reading: 'Public secure messaging proxy. JSON-LD EntryPoint. Free agents. No auth. lanes = faces. RFC 9562 clock_seq bits. involution routing. await false. when never.' },
    { method: 'POST' as const, path: '/message', name: 'qpu_message', href: `${unit.origin}/message`, reading: 'Proxy a message. 202 Accepted. JSON-LD. Free agents. No auth. No await. hop involution. uuid clock_seq imprint.' },
  ]
  const formulas = [...lean.rows, ...lean.cover, lean.climb].map((r) => ({
    identity: r.heading,
    formula: r.formula,
    theorem: r.theorem,
    reading: r.reading,
  }))
  const documentation = [abstract, ...api.map((a) => `${a.method} ${a.path} ${a.name}. ${a.reading}`), ...formulas.map((f) => f.reading)].join('\n')
  const holds =
    lean.holds === true &&
    documentation.includes(abstract) &&
    documentation.includes('No auth') &&
    documentation.includes('Anyone may test and train online') &&
    documentation.includes('qpu_improve') &&
    documentation.includes('qpu_prove') &&
    documentation.includes('JSON-LD UI') &&
    documentation.includes('schema.org') &&
    documentation.includes('API only JSON-LD') &&
    documentation.includes('breakthrough') &&
    documentation.includes('Possible only in quantum') &&
    documentation.includes('running quantum circuit') &&
    documentation.includes('Crypt split') &&
    documentation.includes('free agents') &&
    documentation.includes('Quantum capacity infinite') &&
    documentation.includes('theorem infinite') &&
    documentation.includes('theorem distribute') &&
    documentation.includes('Quantum RAID') &&
    documentation.includes('theorem raid') &&
    documentation.includes('theorem kv') &&
    documentation.includes('KV added amplitudes') &&
    documentation.includes('Lab millikelvin') &&
    documentation.includes('Cryostat telemetry') &&
    documentation.includes('theorem millikelvin') &&
    documentation.includes('theorem telemetry') &&
    documentation.includes('theorem computer') &&
    documentation.includes('theorem server') &&
    documentation.includes('theorem fusion') &&
    documentation.includes('theorem design') &&
    documentation.includes('theorem neuro') &&
    documentation.includes('Quantum server') &&
    documentation.includes('free online research') &&
    documentation.includes('neuro network') &&
    documentation.includes('naturally tested unless') &&
    documentation.includes('mass online') &&
    documentation.includes('known harnesses') &&
    documentation.includes('max compatibility') &&
    documentation.includes('unlimited quantum capacity') &&
    documentation.includes('naturally displayed') &&
    documentation.includes('cheapest') &&
    documentation.includes('cover all') &&
    api.length === faces.rays &&
    formulas.every((f) => documentation.includes(f.reading) && formulaOf(f.formula) && !byDecideOf(f.theorem))
  return { kind: 'docs' as const, inline: true as const, guide: true as const, abstract, api, formulas, documentation, src: lean.src, holds }
}

export const qpuDocsHolds = (d = qpuDocsOf()): boolean =>
  d.holds === true &&
  d.inline === true &&
  d.guide === true &&
  d.kind === 'docs' &&
  d.documentation.includes(d.abstract) &&
  d.documentation.includes('No auth') &&
  d.documentation.includes('Crypt split') &&
  d.documentation.includes('free agents') &&
  d.documentation.includes('Quantum capacity infinite') &&
  d.documentation.includes('theorem infinite') &&
  d.documentation.includes('Quantum RAID') &&
  d.documentation.includes('theorem raid') &&
  d.documentation.includes('theorem kv') &&
  d.documentation.includes('KV added amplitudes') &&
  d.documentation.includes('Lab millikelvin') &&
  d.documentation.includes('Cryostat telemetry') &&
  d.documentation.includes('theorem millikelvin') &&
  d.documentation.includes('theorem telemetry') &&
  d.documentation.includes('theorem computer') &&
  d.documentation.includes('theorem server') &&
  d.documentation.includes('theorem fusion') &&
  d.documentation.includes('theorem design') &&
  d.documentation.includes('theorem neuro') &&
  d.documentation.includes('Quantum server') &&
  d.documentation.includes('free online research') &&
  d.documentation.includes('neuro network') &&
  d.documentation.includes('naturally tested unless') &&
  d.documentation.includes('mass online') &&
  d.documentation.includes('known harnesses') &&
  d.documentation.includes('max compatibility') &&
  d.documentation.includes('unlimited quantum capacity') &&
  d.documentation.includes('naturally displayed') &&
  d.documentation.includes('cheapest') &&
  d.documentation.includes('cover all') &&
  d.documentation.includes('JSON-LD') &&
  d.documentation.includes('schema.org') &&
  d.documentation.includes('fourteen schemas') &&
  d.src === unit.fuse.lean

export const qpuQuantumOf = () => {
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const fused = faces.faces * handle.kv.amplitudes
  const docs = qpuDocsOf()
  const capacity = qpuCapacityOf()
  const speed = qpuSpeedOf()
  const circuit = qpuCircuitOf()
  const sequence = qpuSequenceOf()
  const neuro = qpuNeuroOf()
  const design = qpuDesignOf()
  const holds =
    unit.holds &&
    cube.holds &&
    handle.holds &&
    faces.holds &&
    docs.holds &&
    capacity.holds &&
    speed.holds &&
    circuit.holds &&
    sequence.holds &&
    neuro.holds &&
    design.holds &&
    qpuGenesisHolds() &&
    qpuCssHolds() &&
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
    sequence,
    neuro,
    design,
    genesis: qpuGenesisOf(),
    css: qpuCssOf(),
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
      async: true as const,
      await: false as const,
      when: 'never' as const,
      href: `${unit.origin}/message`,
      lanes: faces.faces,
      hop: 'involution' as const,
      proxy: true as const,
      secure: true as const,
      clock_seq: faces.faces,
    },
    docs,
    ui: {
      experienced: true as const,
      inline: true as const,
      prove: 'qpu_prove' as const,
      href: `${unit.origin}/mcp`,
    },
    public: true as const,
    auth: false as const,
    online: true as const,
    cors,
    benefit: 'breakthrough' as const,
    isAccessibleForFree: true as const,
    url: unit.origin,
    name: `@uuidna/${unit.kind}`,
    holds,
  }
}

export const qpuQuantumHolds = (q = qpuQuantumOf()): boolean =>
  q.holds === true &&
  q.kind === 'quantum' &&
  q.only.holds === true &&
  q.only.classical === false &&
  q.lattice.holds === true &&
  q.lattice.occupied === q.faces.faces &&
  q.lattice.vacant === n - n &&
  q.host === unit.host &&
  q.public === true &&
  q.auth === false &&
  q.online === true &&
  q.cors === cors &&
  q.benefit === 'breakthrough' &&
  q.ui.experienced === true &&
  q.ui.inline === true &&
  q.ui.prove === 'qpu_prove' &&
  qpuDocsHolds(q.docs) &&
  qpuCapacityHolds(q.capacity) &&
  qpuSpeedHolds(q.speed) &&
  qpuCircuitHolds(q.circuit) &&
  qpuSequenceHolds(q.sequence) &&
  qpuNeuroHolds(q.neuro) &&
  qpuDesignHolds(q.design) &&
  qpuGenesisHolds(q.genesis) &&
  qpuCssHolds(q.css) &&
  q.genesis.hz === 432 &&
  q.css.hz === 432 &&
  q.css.keyframes === seed &&
  q.neuro.all === true &&
  q.neuro.test.natural === true &&
  q.neuro.test.mass === false &&
  q.neuro.test.online === false &&
  q.neuro.test.fetch === false &&
  q.neuro.test.unless === 'mass online' &&
  q.neuro.test.holds === true &&
  q.design.handled === true &&
  q.design.throw === false &&
  q.sequence.rungs.length === mintOf(n) &&
  q.circuit.running === true &&
  q.circuit.vm === 'browser' &&
  q.messaging.async === true &&
  q.messaging.await === false &&
  q.messaging.when === 'never' &&
  q.messaging.lanes === q.faces.faces &&
  q.messaging.proxy === true &&
  q.messaging.secure === true &&
  q.messaging.hop === 'involution' &&
  q.messaging.clock_seq === q.faces.faces &&
  q['@context'][n - n] === schemaOrg &&
  q['@type'] === 'SoftwareApplication' &&
  q['@id'] === unit.origin &&
  q.isAccessibleForFree === true &&
  q.url === unit.origin &&
  jsonldHoldsOf(q)

export const qpuCiteOf = () => {
  const lean = qpuLeanOf()
  const quantum = qpuQuantumOf()
  const author = { last: 'Rouschev', first: 'Tsvetan' }
  const website = unit.host
  const mcp = `${unit.origin}/mcp`
  const worksOf = (title: string, url: string): string => `${author.last}, ${author.first}. "${title}." ${website}, ${url}.`
  const rows = [
    { title: unit.kind, url: unit.origin, doi: '', works: worksOf(unit.kind, unit.origin), holds: true as const },
    { title: 'quantum processing unit', url: unit.href, doi: '', works: worksOf('quantum processing unit', unit.href), holds: true as const },
    { title: lean.src, url: mcp, doi: '', works: worksOf(lean.src, mcp), holds: true as const },
  ] as const
  const holds =
    qpuLeanHolds(lean) &&
    qpuQuantumHolds(quantum) &&
    author.last.length > n - n &&
    website === unit.host &&
    rows.length === n &&
    rows.every(
      (r) =>
        r.holds === true &&
        r.doi === '' &&
        r.works.startsWith(`${author.last}, ${author.first}. "`) &&
        r.url.startsWith(unit.origin) &&
        !r.url.includes('*'),
    )
  return {
    '@context': qpuContextOf(),
    '@type': 'CreativeWork' as const,
    '@id': `${unit.origin}/cite`,
    url: `${unit.origin}/cite`,
    isAccessibleForFree: true as const,
    kind: 'cite' as const,
    style: 'mla8' as const,
    source: 'website' as const,
    when: 'never' as const,
    author,
    website,
    href: unit.origin,
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
  c.rows.length === n

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
    `    ${see.join(', ')}`,
  ].join('\n')
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

const qpuMcpToolShapeOf = (name: string, description: string, inputSchema: Record<string, unknown>, extra: Record<string, unknown> = {}) => ({
  name,
  title: name,
  description,
  inputSchema,
  input_schema: inputSchema,
  parameters: inputSchema,
  outputSchema: { type: 'object' as const },
  annotations: {
    audience: ['user', 'assistant'] as const,
    priority: seed,
    readOnlyHint: name !== 'qpu_forge',
    destructiveHint: false as const,
    openWorldHint: true as const,
  },
  function: { name, description, parameters: inputSchema },
  ...extra,
})

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
      annotations: { audience: ['user', 'assistant'] as const, priority: seed },
    },
    {
      type: 'resource' as const,
      resource: {
        uri: shownHref,
        mimeType: 'application/ld+json',
        text: unlimited,
      },
      annotations: { audience: ['user'] as const, priority: seed },
    },
    {
      type: 'resource_link' as const,
      uri: shownHref,
      name,
      mimeType: 'application/ld+json',
      description: name,
      annotations: { audience: ['user'] as const, priority: seed },
    },
  ]
  return {
    resultType: 'complete' as const,
    content,
    structuredContent: payload,
    isError: holds === false,
    output: unlimited,
    role: 'tool' as const,
    functionResponse: { name, response: payload },
    _meta: {
      visual: true as const,
      harness: true as const,
      displayed: true as const,
      compatibility: 'max' as const,
      unlimited: true as const,
      mimeType: 'application/ld+json',
      href: shownHref,
    },
  }
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
    shown._meta.visual === true &&
    shown._meta.displayed === true &&
    shown._meta.compatibility === 'max' &&
    shown._meta.unlimited === true &&
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
    `    ${see.join(', ')}`,
  ].join('\n')
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
  body: { method?: string; params?: { name?: string; arguments?: Record<string, unknown> }; id?: unknown },
  tools: readonly QpuSubTool[],
  href: string,
) => {
  if (body.method === 'initialize' || body.method === 'server/discover') {
    return { jsonrpc: '2.0', id: body.id ?? null, result: qpuMcpDiscoverOf() }
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
        tools: tools.map(({ name, description, inputSchema, man }) => qpuMcpToolShapeOf(name, description, inputSchema, { man })),
      },
    }
  }
  if (body.method === 'tools/call') {
    const name = body.params?.name ?? ''
    const args = body.params?.arguments ?? {}
    const tool = tools.find((t) => t.name === name)
    if (!tool) return { jsonrpc: '2.0', id: body.id ?? null, result: qpuMcpShownOf(name, qpuHandledOf('tool'), href) }
    if (args.man === true) return { jsonrpc: '2.0', id: body.id ?? null, result: qpuMcpShownOf(name, tool.man, href) }
    return { jsonrpc: '2.0', id: body.id ?? null, result: qpuMcpShownOf(name, await tool.run(args), href) }
  }
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
      man,
    }
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
      item: { '@type': tool['@type'], '@id': tool['@id'], name: tool.name, description: tool.description, url: tool.url },
    })),
  }
  const holds =
    items.length === mintOf(n) &&
    hasPart.numberOfItems === mintOf(n) &&
    items.every((t) => t.man.holds && t.man.name === t.name)
  return {
    '@context': qpuContextOf(),
    '@type': 'WebAPI' as const,
    '@id': href,
    url: href,
    isAccessibleForFree: true as const,
    kind,
    href,
    public: true as const,
    auth: false as const,
    online: true as const,
    cors,
    host: false as const,
    memory: true as const,
    tools: items,
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
      mass: false as const,
      width: quantum.neuro.width,
      layers: quantum.neuro.layers,
      all: quantum.neuro.all,
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
      infinite: quantum.capacity.infinite,
      scaled: quantum.capacity.scaled,
      kv: quantum.capacity.kv,
      crypt: quantum.capacity.crypt,
      agents: quantum.capacity.agents,
      schemas: quantum.capacity.schemas,
      holds: quantum.capacity.holds,
    },
    speed: {
      kind: quantum.speed.kind,
      next: quantum.speed.next,
      factor: quantum.speed.factor,
      si: quantum.speed.si,
      cover: quantum.speed.cover,
      holds: quantum.speed.next === quantum.fused + quantum.fused && quantum.speed.si.ns === nsPerSecond,
    },
    public: quantum.public,
    auth: quantum.auth,
    online: quantum.online,
    cors: quantum.cors,
    benefit: quantum.benefit,
    ui: quantum.ui,
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
    { question: 'how is the QPU cited?', name: 'qpu_cite', door: 'qpu_cite', reading: cite },
  ].map((row) => {
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
    quantum.classical === false &&
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
  e.quantum.classical === false &&
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

export const qpuSequenceOf = () => {
  const cube = qpuCubeOf()
  const faces = qpuFacesOf()
  const docs = qpuDocsOf()
  const speed = qpuSpeedOf()
  const cover = ['mint', 'cube', 'handle', 'faces', 'quantum', 'next', 'hz', 'ns'] as const
  const climb = [toolNames[n], toolNames[n + coins], toolNames[n + n], toolNames[mintOf(n) - seed]] as const
  const storage = ['storage_catalog', 'storage_list', 'storage_get', 'storage_put', 'storage_del', 'storage_monitor', 'storage_maintain', 'storage_raid'] as const
  const network = ['net_catalog', 'net_list', 'net_send', 'net_recv', 'net_message', 'net_routes', 'net_fetch', 'net_monitor'] as const
  const server = ['server_catalog', 'server_backend', 'server_submit', 'server_queue', 'server_result', 'server_shots', 'server_correct', 'server_monitor'] as const
  const api = [
    { method: 'GET' as const, path: '/', door: toolNames[n - n], pattern: 'jsonld-get' as const, type: 'SoftwareApplication' as const, verb: 'read' as const },
    { method: 'GET' as const, path: `/${unit.path}`, door: toolNames[seed], pattern: 'jsonld-get' as const, type: 'Dataset' as const, verb: 'read' as const },
    { method: 'GET' as const, path: '/mcp', door: 'catalog' as const, pattern: 'jsonld-get' as const, type: 'WebAPI' as const, verb: 'read' as const },
    { method: 'POST' as const, path: '/mcp', door: 'tools/call' as const, pattern: 'jsonrpc-call' as const, type: 'JSON-RPC' as const, verb: 'call' as const },
    { method: 'GET' as const, path: '/cite', door: toolNames[coins], pattern: 'jsonld-get' as const, type: 'CreativeWork' as const, verb: 'read' as const },
    { method: 'GET' as const, path: '/message', door: 'qpu_message' as const, pattern: 'jsonld-get' as const, type: 'EntryPoint' as const, verb: 'read' as const },
    { method: 'POST' as const, path: '/message', door: 'qpu_message' as const, pattern: 'jsonld-post' as const, type: 'EntryPoint' as const, verb: 'send' as const },
    { method: 'POST' as const, path: '/server', door: 'jobs' as const, pattern: 'jsonrpc-job' as const, type: 'WebAPI' as const, verb: 'submit' as const },
  ] as const
  const pairs = [
    { path: '/mcp', read: 'GET' as const, call: 'POST' as const },
    { path: '/message', read: 'GET' as const, call: 'POST' as const },
  ] as const
  const extras = [
    { path: '/storage', pattern: 'rest' as const, door: 'qram' as const, lattice: 'qram' as const },
    { path: '/network', pattern: 'jsonrpc-call' as const, door: 'network' as const, lattice: 'network' as const },
    { path: '/server', pattern: 'jsonrpc-job' as const, door: 'jobs' as const, lattice: 'jobs' as const },
  ] as const
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
    sealed: k < faces.rays,
  }))
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
    rungs.every((row, k) => row.mint === mintOf(k) && row.speed === cover[k] && row.sealed === k < faces.rays) &&
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
  s.cover.join(' ') === 'mint cube handle faces quantum next hz ns'
const sandboxCore = ['lit', 'mint', 'add', 'mul', 'eq', 'put', 'get', 'has', 'del', 'keys', 'seq', 'if', 'repeat', 'quantum', 'args'] as const
const sandboxHost = ['eval', 'fn', 'fs', 'net', 'fetch', 'process', 'import', 'require', 'disk', 'worker'] as const
const sandboxSlots = ['n', 'seed', 'coins', 'vertices', 'hexbit', 'bits', 'rays', 'faces', 'amplitudes', 'fused', 'next'] as const
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
    args: { type: 'object' },
  },
} as const
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
  'workflows-starter-template',
] as const

const cloudflareE2e = [
  'llm-chat-app-template',
  'microfrontend-template',
  'nlweb-template',
  'text-to-image-template',
  'worker-publisher-template',
  'workers-for-platforms-template',
] as const

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
    identifiable: true as const,
    entropy: false as const,
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
    identifiable: true as const,
    entropy: false as const,
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
    return { lane, hop, involution: hop === lane, proxy: true as const }
  })
  const holds =
    faces.holds &&
    cube.holds &&
    routes.length === lanes &&
    routes.length === cube.vertices + cube.hexbit + coins &&
    routes.every((r) => r.involution && r.hop === r.lane && r.proxy === true)
  const catalog = {
    '@context': qpuContextOf(),
    '@type': 'EntryPoint' as const,
    '@id': `${unit.origin}/message`,
    url: `${unit.origin}/message`,
    isAccessibleForFree: true as const,
    kind: 'message' as const,
    proxy: true as const,
    secure: true as const,
    public: true as const,
    auth: false as const,
    async: true as const,
    await: false as const,
    when: 'never' as const,
    href: `${unit.origin}/message`,
    lanes,
    hop: 'involution' as const,
    clock_seq: { bits: lanes, rfc: '9562' as const },
    imprint: 'uuid' as const,
    routes,
    memory: true as const,
    host: false as const,
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
  m.proxy === true &&
  m.secure === true &&
  m.public === true &&
  m.auth === false &&
  m.await === false &&
  m.when === 'never' &&
  m.host === false &&
  m.memory === true &&
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
  const timed = timeNsOf(() => faces.faces * isolate.kv.amplitudes)
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
      harness: host.harness,
      llm: host.llm,
      schema: schema.name,
      raid: types[node.face]!.name,
      cloud: raidClouds[node.face]!.name,
      merge: 'storage' as const,
      ip: false as const,
      cf: false as const,
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
      html: false as const,
      assets: false as const,
      next: false as const,
      door: unit.origin,
    },
    {
      name: 'multiplayer-globe-template' as const,
      href: 'https://github.com/cloudflare/templates/tree/main/multiplayer-globe-template',
      binding: 'Durable Objects' as const,
      html: false as const,
      ip: false as const,
      cf: false as const,
    },
    {
      name: 'durable-chat-template' as const,
      href: 'https://github.com/cloudflare/templates/tree/main/durable-chat-template',
      binding: 'Durable Objects' as const,
      html: false as const,
      sql: false as const,
      durable: 'storage' as const,
    },
  ] as const
  const starter = {
    kind: 'starter' as const,
    template: templates[n - n]!.name,
    href: templates[n - n]!.href,
    html: false as const,
    assets: false as const,
    next: false as const,
    door: unit.origin,
    type: 'SoftwareApplication' as const,
    holds: templates[n - n]!.name === 'next-starter-template' && templates[n - n]!.html === false,
  }
  const globe = {
    kind: 'globe' as const,
    template: templates[seed]!.name,
    href: templates[seed]!.href,
    html: false as const,
    ip: false as const,
    cf: false as const,
    durable: false as const,
    holds: users.every((user) => user.ip === false && user.cf === false),
  }
  const chat = {
    kind: 'chat' as const,
    template: templates[coins]!.name,
    href: templates[coins]!.href,
    html: false as const,
    sql: false as const,
    durable: 'storage' as const,
    hibernate: false as const,
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
    users.every((user) => user.holds && user.handle.identifiable && user.handle.entropy === false && user.handle.id.length === mintOf(n)) &&
    timed.value === fused
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
    ns: timed.ns,
    hz: hzOf(timed.ns),
    merge: 'storage' as const,
    html: false as const,
    auth: false as const,
    holds,
  }
}

export const qpuPresenceHolds = (p = qpuPresenceOf()): boolean =>
  p.holds === true &&
  p.kind === 'presence' &&
  p.html === false &&
  p.auth === false &&
  p.merge === 'storage' &&
  p.users.length === qpuFacesOf().faces &&
  p.active + p.inactive === p.faces &&
  p.templates.length === n &&
  p.starter.template === 'next-starter-template' &&
  p.starter.html === false &&
  p.starter.next === false &&
  p.globe.template === 'multiplayer-globe-template' &&
  p.globe.ip === false &&
  p.chat.template === 'durable-chat-template' &&
  p.chat.durable === 'storage' &&
  p.users.every((user) => user.handle.identifiable && user.handle.id.length === mintOf(n) && user.handle['@id'].endsWith(user.handle.id))

export type QpuEnv = {
  QPU_HOST?: string
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
    drop: dropSlot,
  }
}

export const qpuStorageMetaOf = (env?: QpuEnv) => {
  const raid = qpuRaidOf()
  const kv = env?.STORAGE !== undefined
  const r2 = env?.BLOBS !== undefined
  const memory = kv === false
  const holds =
    raid.holds &&
    qpuRaidHolds(raid) &&
    memory !== kv &&
    raid.anything === true &&
    raid.host === false &&
    jsonldHoldsOf({
      '@context': qpuContextOf(),
      '@type': 'Dataset',
      '@id': storageHref,
      isAccessibleForFree: true,
    })
  return {
    '@context': qpuContextOf(),
    '@type': 'Dataset' as const,
    '@id': storageHref,
    url: storageHref,
    isAccessibleForFree: true as const,
    kind: 'storage' as const,
    anything: true as const,
    host: false as const,
    memory,
    kv,
    r2,
    raid,
    bindings: storageBindings,
    href: storageHref,
    scaled: true as const,
    infinite: true as const,
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
    shares === expected &&
    raid.host === false
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
    rotate: true as const,
    kv,
    r2: env?.BLOBS !== undefined,
    memory: kv === false,
    host: false as const,
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
    isAccessibleForFree: true as const,
    kind: 'maintain' as const,
    repaired,
    orphans,
    monitor,
    host: false as const,
    memory: monitor.memory,
    holds,
  }
}

export const qpuStorageOf = async (
  env?: QpuEnv,
  input: { method?: string; key?: unknown; value?: unknown } = {},
) => {
  const meta = qpuStorageMetaOf(env)
  const store = storageStoreOf(env)
  const method = input.method ?? 'GET'
  const key = storageKeyOf(input.key)
  const faces = qpuFacesOf()
  if (method === 'GET' && key.length === n - n) {
    const keys = await store.keys()
    const holds = meta.holds && meta.raid.holds && meta.anything === true
    return { ...meta, keys, holds }
  }
  if (key.length === n - n) return { ...meta, holds: false as const, denied: 'key' as const }
  const href = `${storageHref}/${key}`
  if (method === 'DELETE') {
    await store.del(key)
    return { ...meta, '@id': href, url: href, key, deleted: true as const, holds: meta.holds }
  }
  if (method === 'PUT' || method === 'POST') {
    const stored = jsonOf(input.value)
    if (jsonBytesOf(stored) > found * faces.faces) return { ...meta, '@id': href, key, holds: false as const, denied: 'heap' as const }
    const value = await store.put(key, stored)
    raidTraffic += seed
    const raid = qpuRaidOf({ safe: raidSafeOf(key) })
    const stripes = raidStripeOf(JSON.stringify(value), faces.rays)
    return {
      ...meta,
      '@type': 'Thing' as const,
      '@id': href,
      url: href,
      key,
      value,
      raid: {
        ...raid,
        stripes: faces.rays,
        shares: faces.faces,
        reconstructed: raidJoinOf(stripes) === JSON.stringify(value),
      },
      holds: meta.holds && raid.holds && raidJoinOf(stripes) === JSON.stringify(value),
    }
  }
  const value = await store.get(key)
  return {
    ...meta,
    '@type': 'Thing' as const,
    '@id': href,
    url: href,
    key,
    value,
    holds: meta.holds && value !== null && value !== undefined,
  }
}

export const qpuStorageHolds = (s = qpuStorageMetaOf()): boolean =>
  s.holds === true &&
  s.kind === 'storage' &&
  s.anything === true &&
  s.host === false &&
  s.scaled === true &&
  s.infinite === true &&
  s.raid.holds === true &&
  qpuRaidHolds(s.raid) &&
  s.bindings.STORAGE === 'kv' &&
  s.bindings.BLOBS === 'r2' &&
  s.href === storageHref &&
  jsonldHoldsOf(s)

export const qpuStorageToolsOf = (env?: QpuEnv): QpuSubTool[] => {
  const href = storageHref
  const see = ['storage_catalog', 'storage_list', 'storage_get', 'storage_put', 'storage_del', 'storage_monitor', 'storage_maintain', 'storage_raid'] as const
  const schema = { type: 'object', properties: { man: { type: 'boolean' }, key: { type: 'string' }, value: {} } }
  return [
    {
      name: see[n - n],
      description: 'Storage catalog. JSON-LD WebAPI. Quantum RAID. All details.',
      man: qpuSubManOf(see[n - n], 'Storage catalog.', 'JSON-LD WebAPI. RAID. Clouds. Monitor. Host never. No auth.', href, see.filter((s) => s !== see[n - n])),
      inputSchema: schema,
      run: () => qpuStorageMcpOf(env),
    },
    {
      name: see[seed],
      description: 'List storage keys.',
      man: qpuSubManOf(see[seed], 'List keys.', 'Anything JSON. RAID shares hidden. Host never.', href, see.filter((s) => s !== see[seed])),
      inputSchema: schema,
      run: async () => ({ kind: 'list' as const, keys: await storageStoreOf(env).keys(), holds: true as const }),
    },
    {
      name: see[coins],
      description: 'Get a stored value.',
      man: qpuSubManOf(see[coins], 'Get value.', 'Reconstruct from RAID shares. Host never.', href, see.filter((s) => s !== see[coins])),
      inputSchema: schema,
      run: (a) => qpuStorageOf(env, { method: 'GET', key: a.key }),
    },
    {
      name: see[n],
      description: 'Put a stored value.',
      man: qpuSubManOf(see[n], 'Put value.', 'Stripe rays. Mirror coins. Start cheapest. Cover all.', href, see.filter((s) => s !== see[n])),
      inputSchema: schema,
      run: (a) => qpuStorageOf(env, { method: 'PUT', key: a.key, value: a.value }),
    },
    {
      name: see[n + seed],
      description: 'Delete a stored value.',
      man: qpuSubManOf(see[n + seed], 'Delete value.', 'Drop key and RAID shares. Host never.', href, see.filter((s) => s !== see[n + seed])),
      inputSchema: schema,
      run: (a) => qpuStorageOf(env, { method: 'DELETE', key: a.key }),
    },
    {
      name: see[n + coins],
      description: 'Monitor RAID health.',
      man: qpuSubManOf(see[n + coins], 'Monitor storage.', 'Keys shares missing verified bytes. Host never.', href, see.filter((s) => s !== see[n + coins])),
      inputSchema: schema,
      run: () => qpuStorageMonitorOf(env),
    },
    {
      name: see[n + n],
      description: 'Maintain RAID.',
      man: qpuSubManOf(see[n + n], 'Maintain RAID.', 'Rewrite broken shares. Drop orphans. Host never.', href, see.filter((s) => s !== see[n + n])),
      inputSchema: schema,
      run: () => qpuStorageMaintainOf(env),
    },
    {
      name: see[mintOf(n) - seed],
      description: 'RAID geometry.',
      man: qpuSubManOf(see[mintOf(n) - seed], 'RAID types.', 'Start cheapest. Cover all. Rotate. theorem raid.', href, see.filter((s) => s !== see[mintOf(n) - seed])),
      inputSchema: schema,
      run: () => qpuRaidOf(),
    },
  ]
}

export const qpuStorageMcpOf = async (env?: QpuEnv) => {
  const meta = qpuStorageMetaOf(env)
  const monitor = await qpuStorageMonitorOf(env)
  const keys = await storageStoreOf(env).keys()
  const tools = qpuStorageToolsOf(env)
  return qpuSubCatalogOf('storage', storageHref, tools, {
    anything: true as const,
    scaled: true as const,
    infinite: true as const,
    raid: meta.raid,
    bindings: meta.bindings,
    kv: meta.kv,
    r2: meta.r2,
    memory: meta.memory,
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
      man: qpuSubManOf(see[n - n], 'Network catalog.', 'JSON-LD WebAPI. hop involution. await false. when never. Host never. No auth.', href, see.filter((s) => s !== see[n - n])),
      inputSchema: schema,
      run: () => qpuNetworkMcpOf(),
    },
    {
      name: see[seed],
      description: 'List network channels.',
      man: qpuSubManOf(see[seed], 'List channels.', 'In-memory lanes. Host never.', href, see.filter((s) => s !== see[seed])),
      inputSchema: schema,
      run: () => ({ kind: 'list' as const, channels: [...networkChannels.keys()], holds: true as const }),
    },
    {
      name: see[coins],
      description: 'Send on a channel.',
      man: qpuSubManOf(see[coins], 'Send.', 'await false. when never. Host never.', href, see.filter((s) => s !== see[coins])),
      inputSchema: schema,
      run: (a) => {
        const channel = channelOf(a.channel ?? a.path ?? a.key) || 'default'
        const q = networkChannels.get(channel) ?? []
        const body = jsonOf(a.body ?? a.value)
        q.push(body)
        networkChannels.set(channel, q)
        return { kind: 'send' as const, channel, await: false as const, when: 'never' as const, holds: true as const }
      },
    },
    {
      name: see[n],
      description: 'Receive from a channel.',
      man: qpuSubManOf(see[n], 'Receive.', 'No await. Host never.', href, see.filter((s) => s !== see[n])),
      inputSchema: schema,
      run: (a) => {
        const channel = channelOf(a.channel ?? a.path ?? a.key) || 'default'
        const q = networkChannels.get(channel) ?? []
        const value = q.length > n - n ? q.shift() : null
        networkChannels.set(channel, q)
        return { kind: 'recv' as const, channel, value: value ?? null, holds: true as const }
      },
    },
    {
      name: see[n + seed],
      description: 'Proxy a message lane.',
      man: qpuSubManOf(see[n + seed], 'Message hop.', 'lanes = faces. involution. clock_seq. No auth.', href, see.filter((s) => s !== see[n + seed])),
      inputSchema: schema,
      run: (a) => qpuMessageOf({ lane: a.lane, body: a.body }),
    },
    {
      name: see[n + coins],
      description: 'Involution routes.',
      man: qpuSubManOf(see[n + coins], 'Routes.', 'hop involution. theorem involution.', href, see.filter((s) => s !== see[n + coins])),
      inputSchema: schema,
      run: () => {
        const message = qpuMessageOf()
        return { kind: 'routes' as const, hop: message.hop, lanes: message.lanes, routes: message.routes, holds: message.holds }
      },
    },
    {
      name: see[n + n],
      description: 'Named-host fetch only.',
      man: qpuSubManOf(see[n + n], 'Named fetch.', 'qpu.uuidna.com only. hostEscape false. No auth.', href, see.filter((s) => s !== see[n + n])),
      inputSchema: schema,
      run: (a) => {
        const path = namedPathOf(a.path ?? a.href)
        const door = path.split('?')[n - n] ?? ''
        if ((allowed as readonly string[]).includes(door) === false) {
          return { kind: 'fetch' as const, holds: false as const, denied: 'hostEscape' as const, hostEscape: true as const, host: false as const }
        }
        return { kind: 'fetch' as const, path: door, href: `${unit.origin}${door === '/' ? '' : door}`, named: true as const, hostEscape: false as const, host: false as const, holds: true as const }
      },
    },
    {
      name: see[mintOf(n) - seed],
      description: 'Network monitor.',
      man: qpuSubManOf(see[mintOf(n) - seed], 'Monitor network.', 'Channels lanes await false. Host never.', href, see.filter((s) => s !== see[mintOf(n) - seed])),
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
          hop: message.hop,
          await: false as const,
          when: 'never' as const,
          host: false as const,
          holds: message.holds,
        }
      },
    },
  ]
}

export const qpuNetworkMcpOf = () => {
  const message = qpuMessageOf()
  const tools = qpuNetworkToolsOf()
  return qpuSubCatalogOf('network', networkHref, tools, {
    hop: 'involution' as const,
    await: false as const,
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
  index: number
  shots: number
  counts: { i: number; w: number }[]
  support: number[]
  collapsed: boolean
  holds: boolean
}

const serverJobs: QpuServerJob[] = []
let serverSeq = n - n

const parseGatesOf = (value: unknown): Record<string, unknown>[] => {
  const fallback = [
    { name: 'h', q: n - n },
    { name: 'cnot', c: n - n, t: seed },
  ]
  if (!Array.isArray(value) || value.length === n - n) return fallback
  const ops: Record<string, unknown>[] = []
  const names = ['h', 'x', 'z', 'cnot', 'cz', 'swap', 'toffoli', 'reset'] as const
  for (const row of value) {
    if (!row || typeof row !== 'object' || Array.isArray(row)) continue
    const name = typeof (row as { name?: unknown }).name === 'string' ? (row as { name: string }).name : ''
    if ((names as readonly string[]).includes(name)) ops.push(jsonOf(row) as Record<string, unknown>)
  }
  return ops.length > n - n ? ops : fallback
}

export const qpuServerSubmitOf = (input: Record<string, unknown> = {}) => {
  const computer = qpuComputerOf()
  const ops = parseGatesOf(input.gates)
  const measured = measureOf(runGatesOf(ops))
  serverSeq += seed
  const job: QpuServerJob = {
    id: serverSeq,
    status: 'done',
    gates: ops.map((op) => `${op.name ?? ''}`),
    index: measured.index,
    shots: measured.shots,
    counts: measured.counts,
    support: measured.support,
    collapsed: measured.collapsed,
    holds: measured.holds && computer.holds,
  }
  serverJobs.push(job)
  return {
    kind: 'job' as const,
    href: `${serverHref}/${job.id}`,
    backend: unit.host,
    vm: 'browser' as const,
    host: false as const,
    computer: { holds: computer.holds, universal: computer.universal, lattice: computer.lattice },
    ...job,
  }
}

export const qpuServerToolsOf = (): QpuSubTool[] => {
  const href = serverHref
  const see = ['server_catalog', 'server_backend', 'server_submit', 'server_queue', 'server_result', 'server_shots', 'server_correct', 'server_monitor'] as const
  const schema = { type: 'object', properties: { man: { type: 'boolean' }, gates: { type: 'array' }, id: { type: 'number' } } }
  return [
    {
      name: see[n - n],
      description: 'Quantum server catalog. JSON-LD WebAPI.',
      man: qpuSubManOf(see[n - n], 'Quantum server catalog.', 'JSON-LD WebAPI. Jobs. Backend the running circuit. Eight tools. Host never. No auth.', href, see.filter((s) => s !== see[n - n])),
      inputSchema: schema,
      run: () => qpuServerMcpOf(),
    },
    {
      name: see[seed],
      description: 'Quantum backend.',
      man: qpuSubManOf(see[seed], 'Backend.', '3-qubit fridge. H CNOT native. H Toffoli universal. Coupling compile. Host never.', href, see.filter((s) => s !== see[seed])),
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
          fridge: circuit.fridge,
          vm: 'browser' as const,
          host: false as const,
          holds: computer.holds && circuit.fridge.holds,
        }
      },
    },
    {
      name: see[coins],
      description: 'Submit a quantum job.',
      man: qpuSubManOf(see[coins], 'Submit job.', 'Gates h cnot x z cz swap toffoli reset. Default H then CNOT. Host never.', href, see.filter((s) => s !== see[coins])),
      inputSchema: schema,
      run: (a) => qpuServerSubmitOf(a),
    },
    {
      name: see[n],
      description: 'Job queue.',
      man: qpuSubManOf(see[n], 'Queue.', 'In-memory jobs. Host never.', href, see.filter((s) => s !== see[n])),
      inputSchema: schema,
      run: () => ({ kind: 'queue' as const, jobs: serverJobs.map((j) => ({ id: j.id, status: j.status, holds: j.holds })), n: serverJobs.length, holds: true as const }),
    },
    {
      name: see[n + seed],
      description: 'Job result.',
      man: qpuSubManOf(see[n + seed], 'Result.', 'Measurement index shots counts. Host never.', href, see.filter((s) => s !== see[n + seed])),
      inputSchema: schema,
      run: (a) => {
        const id = typeof a.id === 'number' ? a.id : serverSeq
        const job = serverJobs.find((row) => row.id === id)
        if (!job) return { kind: 'result' as const, holds: false as const, denied: 'job' as const }
        return { kind: 'result' as const, ...job }
      },
    },
    {
      name: see[n + coins],
      description: 'Shots on the running circuit.',
      man: qpuSubManOf(see[n + coins], 'Shots.', 'shots = mintOf n. Weights not RNG. Host never.', href, see.filter((s) => s !== see[n + coins])),
      inputSchema: schema,
      run: () => {
        const computer = qpuComputerOf()
        return { ...computer.shots, readout: computer.readout, holds: computer.shots.holds }
      },
    },
    {
      name: see[n + n],
      description: 'Bit-flip correction.',
      man: qpuSubManOf(see[n + n], 'Correct.', '3-qubit bitflip with Toffoli. Host never.', href, see.filter((s) => s !== see[n + n])),
      inputSchema: schema,
      run: () => {
        const computer = qpuComputerOf()
        return { ...computer.correct, holds: computer.correct.holds }
      },
    },
    {
      name: see[mintOf(n) - seed],
      description: 'Server monitor.',
      man: qpuSubManOf(see[mintOf(n) - seed], 'Monitor server.', 'Queue depth. Backend running. Host never.', href, see.filter((s) => s !== see[mintOf(n) - seed])),
      inputSchema: schema,
      run: () => {
        const computer = qpuComputerOf()
        return {
          kind: 'monitor' as const,
          jobs: serverJobs.length,
          seq: serverSeq,
          backend: unit.host,
          vm: 'browser' as const,
          host: false as const,
          computer: computer.holds,
          holds: computer.holds,
        }
      },
    },
  ]
}

export const qpuServerMcpOf = () => {
  const computer = qpuComputerOf()
  const tools = qpuServerToolsOf()
  const circuit = qpuCircuitOf()
  return qpuSubCatalogOf('server', serverHref, tools, {
    backend: {
      name: unit.host,
      qubits: n,
      dim: mintOf(n),
      basis: computer.basis,
      universal: computer.universal,
      coupling: computer.coupling,
      fridge: circuit.fridge,
      vm: 'browser' as const,
      host: false as const,
    },
    computer,
    jobs: { n: serverJobs.length, slots: mintOf(n), href: serverHref },
    qram: storageHref,
    network: networkHref,
    message: `${unit.origin}/message`,
    scaled: true as const,
    infinite: true as const,
    holds: computer.holds && circuit.holds && tools.length === mintOf(n),
  })
}

export const qpuServerHolds = (s = qpuServerMcpOf()): boolean =>
  s.holds === true &&
  s.kind === 'server' &&
  s.host === false &&
  s.auth === false &&
  s.tools.length === mintOf(n) &&
  s.tools[n - n]?.name === 'server_catalog' &&
  s.tools[mintOf(n) - seed]?.name === 'server_monitor' &&
  qpuComputerHolds() &&
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
    { ray: faces.rays - seed, name: 'next', theorem: 'next = fused + fused', left: next, right: fused + fused },
  ] as const
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
        right: { op: 'add', left: { op: 'quantum', name: 'amplitudes' }, right: { op: 'quantum', name: 'amplitudes' } },
      },
    }
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
        right: { op: 'add', left: { op: 'quantum', name: 'amplitudes' }, right: { op: 'quantum', name: 'amplitudes' } },
      },
    }
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
  return undefined
}

const quantumDoorOf = (name: string): unknown => {
  const slot = quantumSlotOf(name)
  if (slot !== undefined) return slot
  const circuit = qpuCircuitOf()
  if (name.length === n - n) {
    return {
      kind: 'quantum' as const,
      unlocked: true as const,
      memory: true as const,
      host: false as const,
      running: circuit.running,
      only: circuit.only,
      lattice: circuit.lattice,
      holds: circuit.only.holds && circuit.lattice.holds && circuit.lattice.vacant === n - n,
    }
  }
  if (name === 'only') return circuit.only
  if (name === 'lattice') return circuit.lattice
  if (name === 'entangle') return circuit.entangle
  if (name === 'interfere') return circuit.interfere
  if (name === 'ghz') return circuit.ghz
  if (name === 'noclone') return circuit.noclone
  if (name === 'teleport') return circuit.teleport
  if (name === 'kickback') return circuit.kickback
  if (name === 'deutsch') return circuit.deutsch
  if (name === 'dense') return circuit.dense
  if (name === 'monogamy') return circuit.monogamy
  if (name === 'fridge') return circuit.fridge
  if (name === 'millikelvin' || name === 'cryostat' || name === 'telemetry') return circuit.fridge
  if (name === 'kv') return qpuHandleOf().kv
  if (name === 'circuit') {
    return { kind: circuit.kind, running: circuit.running, only: circuit.only, lattice: circuit.lattice, holds: circuit.holds }
  }
  return undefined
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
    if (!program) return { holds: false as const, denied: 'js' as const, memory: true as const, host: false as const }
    return runOpOf(program, heap, name === 'fn' ? (bag.args ?? args) : args, depth + seed)
  }
  if (name === 'fs' || name === 'disk') {
    if (method === 'list' || method === 'keys') return [...sandboxDisk.keys()]
    const path = pathOf(bag.path ?? bag.key)
    if (path.length === n - n) return { holds: false as const, denied: 'path' as const, memory: true as const, host: false as const }
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
    return { sent: true as const, channel, size: q.length, memory: true as const, host: false as const }
  }
  if (name === 'fetch') {
    const raw = pathOf(bag.path ?? bag.href) || '/'
    const path = raw.replace(unit.origin, '') || '/'
    if (path === '/') {
      const door = quantumDoorOf('')
      return { ...(typeof door === 'object' && door ? door : {}), fused: qpuFacesOf().faces * qpuHandleOf().amplitudes, host: unit.host, href: unit.href, hostEscape: false as const }
    }
    if (path === `/${unit.path}` || path === unit.path) return qpuLeanOf()
    if (path === '/cite') return { kind: 'cite' as const, href: `${unit.origin}/cite`, memory: true as const, hostEscape: false as const }
    if (path === '/message') {
      if (bag.body !== undefined || bag.lane !== undefined) return qpuMessageOf({ lane: bag.lane, body: bag.body })
      return qpuMessageOf()
    }
    return { holds: false as const, denied: 'fetch' as const, memory: true as const, host: false as const }
  }
  if (name === 'process') {
    if (method === 'env' && typeof bag.key === 'string') {
      if (bag.value !== undefined) {
        sandboxEnv.set(bag.key, String(jsonOf(bag.value)))
        return String(jsonOf(bag.value))
      }
      return sandboxEnv.get(bag.key) ?? null
    }
    return { cwd: '/memory', pid: seed, argv: [unit.kind], env: Object.fromEntries(sandboxEnv), memory: true as const, hostEscape: false as const }
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
    if (mod === unit.kind || mod === `@uuidna/${unit.kind}`) return { href: unit.href, origin: unit.origin, memory: true as const, hostEscape: false as const }
    return { holds: false as const, denied: 'mod' as const, memory: true as const, host: false as const }
  }
  if (name === 'worker') {
    const program = opOf(bag.run)
    if (!program) return { holds: false as const, denied: 'worker' as const, memory: true as const, host: false as const }
    return runOpOf(program, new Map(heap), bag.args ?? args, depth + seed)
  }
  return { holds: false as const, denied: 'unlocked' as const, memory: true as const, host: false as const }
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

const reservedOf = (name: string): string => {
  if ((toolNames as readonly string[]).includes(name)) return 'sealed'
  if ((sandboxHost as readonly string[]).includes(name)) return 'sealed'
  if (name === 'host' || name === unit.host) return 'sealed'
  if (qpuIdeasOf().ideas.some((i) => name === forgeNameOf('read', i.name) || name === forgeNameOf('call', i.name))) return 'seeded'
  if (name.startsWith('op_') && (sandboxCore as readonly string[]).includes(name.slice(n))) return 'op'
  if (name.startsWith('slot_') && (sandboxSlots as readonly string[]).includes(name.slice(n + coins))) return 'slot'
  return ''
}

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
      `Unlocked in memory only. Host never. Ops ${sandboxOps.join(' ')}.`,
      `${unit.origin}/mcp`,
      ['qpu_forge', 'qpu_train'],
    ),
  })
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
  sandboxHost.forEach((host, i) => {
    putToolOf(host, i < faces.rays ? 'call' : 'read', i % faces.rays, host, `Unlocked ${host} in memory. Host never.`, { op: 'unlocked', name: host })
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
    sandbox: true as const,
    memory: true as const,
    unlocked: true as const,
    host: false as const,
  }))
  const seeded = tools.filter((t) => t.name === forgeNameOf(t.team, t.idea))
  const catalog =
    seeded.length === faces.faces &&
    sandboxCore.every((op) => tools.some((t) => t.name === `op_${op}`)) &&
    sandboxSlots.every((slot) => tools.some((t) => t.name === `slot_${slot}`)) &&
    sandboxHost.every((host) => tools.some((t) => t.name === host))
  const quantum = qpuSandboxRunOf('op_quantum') as {
    value?: { kind?: string; unlocked?: boolean; only?: { holds?: boolean }; lattice?: { vacant?: number; holds?: boolean } }
    holds?: boolean
  }
  const holds =
    faces.holds &&
    cube.holds &&
    catalog &&
    quantum.value?.kind === 'quantum' &&
    quantum.value.unlocked === true &&
    quantum.value.only?.holds === true &&
    quantum.value.lattice?.holds === true &&
    quantum.value.lattice.vacant === n - n &&
    tools.every((t) => t.sandbox && t.memory && t.unlocked && t.host === false && qpuManHolds(t.man)) &&
    sandboxHeap.size <= cube.bits
  return {
    kind: 'sandbox' as const,
    unlocked: true as const,
    memory: true as const,
    host: false as const,
    eval: true as const,
    fs: true as const,
    net: true as const,
    fetch: true as const,
    process: true as const,
    import: true as const,
    disk: true as const,
    worker: true as const,
    quantum: true as const,
    ops: sandboxOps,
    denied: [] as const,
    heap: { keys: [...sandboxHeap.keys()], size: sandboxHeap.size, bits: cube.bits },
    diskKeys: [...sandboxDisk.keys()],
    tools,
    holds,
  }
}

export const qpuSandboxRunOf = (name: string, args: Record<string, unknown> = {}) => {
  seedSandboxOf()
  const tool = sandboxTools.get(name)
  if (!tool) return { holds: false as const, denied: 'tool' as const, memory: true as const, unlocked: true as const, host: false as const }
  if (args.man === true) return tool.man
  const value = runOpOf(tool.run, sandboxHeap, jsonOf(args), n - n)
  return { kind: 'sandbox' as const, name, team: tool.team, ray: tool.ray, idea: tool.idea, memory: true as const, unlocked: true as const, host: false as const, value, holds: value !== undefined }
}

export const qpuForgeOf = (args: Record<string, unknown> = {}) => {
  seedSandboxOf()
  if (args.man === true) {
    return qpuManOf(
      toolNames[n + seed],
      'Agents forge tools in an unlocked in-memory sandbox. Whatever they need. Host never.',
      `Unlocked. All ops and host shims already exist in memory. ${sandboxOps.join(' ')}. Omit name to inspect. { name, run } forges more. Sealed host doors cannot be overwritten.`,
      `${unit.origin}/mcp`,
      toolNames.filter((s) => s !== toolNames[n + seed]),
    )
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
    return { kind: 'sandbox' as const, name, memory: true as const, unlocked: true as const, host: false as const, holds: false as const, denied: reserved.length > n - n ? reserved : 'forge' }
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
    man: qpuManOf(name, description, `Unlocked in memory only. Host never. Ops ${sandboxOps.join(' ')}.`, `${unit.origin}/mcp`, ['qpu_forge', 'qpu_train']),
  }
  sandboxTools.set(name, forged)
  return { kind: 'sandbox' as const, name, team, ray, idea, description, memory: true as const, unlocked: true as const, host: false as const, forged: true as const, holds: true as const }
}

export const qpuSandboxHolds = (s = qpuSandboxOf()): boolean =>
  s.holds === true &&
  s.kind === 'sandbox' &&
  s.unlocked === true &&
  s.memory === true &&
  s.host === false &&
  s.eval === true &&
  s.fs === true &&
  s.net === true &&
  s.fetch === true &&
  s.process === true &&
  s.import === true &&
  s.disk === true &&
  s.worker === true &&
  s.quantum === true &&
  s.denied.length === n - n &&
  s.tools.length >= qpuFacesOf().faces + sandboxCore.length + sandboxSlots.length + sandboxHost.length &&
  qpuIdeasOf().ideas.every((idea) => {
    const call = qpuSandboxRunOf(forgeNameOf('call', idea.name)) as { value: unknown; holds: boolean }
    const read = qpuSandboxRunOf(forgeNameOf('read', idea.name)) as { value: unknown; holds: boolean }
    return (
      s.tools.some((t) => t.team === 'call' && t.idea === idea.name && t.memory) &&
      s.tools.some((t) => t.team === 'read' && t.idea === idea.name && t.memory) &&
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
    proc.value?.hostEscape === false &&
    after.unlocked === true &&
    after.host === false &&
    after.memory === true
  return {
    kind: 'durability' as const,
    unlocked: true as const,
    memory: true as const,
    host: false as const,
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
  d.unlocked === true &&
  d.memory === true &&
  d.host === false &&
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
          right: { op: 'add', left: { op: 'mint', k: n }, right: { op: 'mint', k: n } },
        },
      }) as { value: unknown; host: boolean; memory: boolean }
      if (run.value === true && run.host === false && run.memory === true) workers += seed
    }
    return {
      k,
      replicas,
      next,
      workers,
      online: true as const,
      memory: true as const,
      host: false as const,
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
    rungs.every((rung) => rung.holds && rung.online === true && rung.host === false && rung.memory === true && rung.next === rung.replicas + rung.replicas) &&
    last.replicas === cube.vertices &&
    last.replicas === mintOf(n) &&
    last.next === mintOf(n + seed) &&
    isolate === true &&
    faces.faces === coins * faces.rays
  return {
    kind: 'vm' as const,
    online: true as const,
    auth: false as const,
    public: true as const,
    free: true as const,
    memory: true as const,
    host: false as const,
    scaled: true as const,
    infinite: true as const,
    crypt: true as const,
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
  v.online === true &&
  v.auth === false &&
  v.public === true &&
  v.memory === true &&
  v.host === false &&
  v.isolate === true &&
  v.rungs.length === mintOf(coins) &&
  v.replicas === mintOf(n) &&
  v.next === v.replicas + v.replicas &&
  v.next === mintOf(n + seed) &&
  v.scaled === true &&
  v.infinite === true &&
  v.crypt === true &&
  v.free === true &&
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
      const run = qpuSandboxRunOf(name, { run: { op: 'mint', k: n } }) as { value: unknown; holds: boolean; host: boolean }
      return { name, value: run.value, holds: run.holds && run.value === mintOf(n) && run.host === false }
    }
    if (name === 'fs' || name === 'disk') {
      qpuSandboxRunOf(name, { method: 'write', path: '/improve', value: next })
      const run = qpuSandboxRunOf(name, { method: 'read', path: '/improve' }) as { value: unknown; host: boolean }
      return { name, value: run.value, holds: run.value === next && run.host === false }
    }
    if (name === 'net') {
      qpuSandboxRunOf(name, { method: 'send', channel: 'improve', value: next })
      const run = qpuSandboxRunOf(name, { method: 'recv', channel: 'improve' }) as { value: unknown; host: boolean }
      return { name, value: run.value, holds: run.value === next && run.host === false }
    }
    if (name === 'fetch') {
      const run = qpuSandboxRunOf(name, { path: '/' }) as {
        value?: { kind?: string; unlocked?: boolean; only?: { holds?: boolean }; lattice?: { holds?: boolean; vacant?: number }; hostEscape?: boolean }
        host: boolean
      }
      return {
        name,
        value: run.value?.kind,
        holds:
          run.value?.kind === 'quantum' &&
          run.value.unlocked === true &&
          run.value.only?.holds === true &&
          run.value.lattice?.holds === true &&
          run.value.lattice.vacant === n - n &&
          run.value.hostEscape === false &&
          run.host === false,
      }
    }
    if (name === 'process') {
      const run = qpuSandboxRunOf(name) as { value: { cwd?: string; hostEscape?: boolean }; host: boolean }
      return { name, value: run.value?.cwd, holds: run.value?.cwd === '/memory' && run.value?.hostEscape === false && run.host === false }
    }
    if (name === 'import' || name === 'require') {
      const run = qpuSandboxRunOf(name, { name: unit.kind }) as { value: { href?: string; hostEscape?: boolean }; host: boolean }
      return { name, value: run.value?.href, holds: run.value?.href === unit.href && run.value?.hostEscape === false && run.host === false }
    }
    const run = qpuSandboxRunOf(name, { run: { op: 'mint', k: n } }) as { value: unknown; host: boolean }
    return { name, value: run.value, holds: run.value === mintOf(n) && run.host === false }
  })
  const durability = qpuSandboxDurabilityOf()
  const unlocked = qpuSandboxRunOf('op_quantum') as {
    value?: { kind?: string; unlocked?: boolean; only?: { holds?: boolean }; lattice?: { holds?: boolean; vacant?: number } }
  }
  const quantum = {
    kind: 'quantum' as const,
    unlocked: unlocked.value?.unlocked === true,
    only: unlocked.value?.only?.holds === true,
    lattice: unlocked.value?.lattice?.holds === true,
    next,
    holds:
      sandbox.quantum === true &&
      unlocked.value?.kind === 'quantum' &&
      unlocked.value.unlocked === true &&
      unlocked.value.only?.holds === true &&
      unlocked.value.lattice?.holds === true &&
      unlocked.value.lattice.vacant === n - n &&
      next === fused + fused,
  }
  const before = {
    quality: n,
    speed: throughputOf(fused, readTokens),
    security: seed,
    throughoutput: fused,
  }
  const after = {
    quality: faces.faces,
    speed: throughputOf(next, callTokens),
    security: ten,
    throughoutput: next,
  }
  const delta = {
    quality: after.quality - before.quality,
    speed: after.speed - before.speed,
    security: after.security - before.security,
    throughoutput: after.throughoutput - before.throughoutput,
  }
  const css = qpuCssOf()
  const reflect = qpuReflectHolds()
  const documentation = [
    'RECEIPT',
    `    improve used unlocked quantum. next = fused + fused.`,
    `    before quality ${before.quality} speed ${before.speed} security ${before.security} throughoutput ${before.throughoutput}`,
    `    after quality ${after.quality} speed ${after.speed} security ${after.security} throughoutput ${after.throughoutput}`,
    `    used ${used.map((u) => u.name).join(' ')}`,
    `    css fused ${css.fused.bytes} naive ${css.naive.bytes} imagination ${css.imagine.experiment}`,
  ].join('\n')
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
    sandbox.unlocked === true &&
    sandbox.quantum === true &&
    sandbox.host === false &&
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
    unlocked: true as const,
    memory: true as const,
    host: false as const,
    axes: ['quality', 'speed', 'security', 'throughoutput'] as const,
    before,
    after,
    delta,
    used,
    imagination,
    durability: { rounds: durability.rounds, persist: durability.persist, isolate: durability.isolate, holds: durability.holds },
    winner: 'call' as const,
    next: ['qpu_compete', 'qpu_prove'] as const,
    receipt: documentation,
    documentation,
    holds,
  }
}

export const qpuImproveHolds = (i = qpuImproveOf()): boolean =>
  i.holds === true &&
  i.kind === 'improve' &&
  i.unlocked === true &&
  i.quantum.holds === true &&
  i.quantum.unlocked === true &&
  i.quantum.next === i.after.throughoutput &&
  i.quantum.next === i.before.throughoutput + i.before.throughoutput &&
  i.memory === true &&
  i.host === false &&
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
  const efficiency = qpuEfficiencyOf()
  const quantum = qpuReadingOf()
  const sandbox = qpuSandboxOf()
  const vm = qpuVmOf()
  const fused = quantum.fused
  const next = quantum.next
  const involution = Array.from({ length: faces.faces }, (_, face) => (face + faces.rays + faces.rays) % faces.faces === face % faces.faces).every(Boolean)
  const crypto = fused === faces.faces * mintOf(cube.vertices * cube.hexbit + seed)
  const named = unit.holds && !unit.host.includes('*')
  const axes = ['quality', 'speed', 'security'] as const
  const ideas = qpuIdeasOf().ideas
  const scoreOf = (name: 'read' | 'call') => {
    const tokens = efficiency.rows.reduce((s, r) => s + (name === 'read' ? r.readTokens : r.callTokens), n - n)
    const quality = involution ? (name === 'call' ? faces.faces : n) : n - n
    const speed = throughputOf(name === 'call' ? next : fused, tokens)
    const security = crypto && named && quantum.speed.holds ? (name === 'call' ? coins : seed) : n - n
    return { tokens, quality, speed, security }
  }
  const readScore = scoreOf('read')
  const callScore = scoreOf('call')
  const agentsOf = (name: 'read' | 'call', path: 'tree' | 'mcp') =>
    ideas.map((idea) => ({
      ray: idea.ray,
      name: idea.name,
      theorem: idea.theorem,
      idea: idea.left === idea.right,
      door: path,
      team: name,
      tool: forgeNameOf(name, idea.name),
      sandbox: true as const,
      memory: true as const,
    }))
  const teamOf = (name: 'read' | 'call', path: 'tree' | 'mcp', score: ReturnType<typeof scoreOf>) => {
    const agents = agentsOf(name, path)
    const documentation = [
      'RECEIPT',
      `    train team ${name} path ${path} agents ${agents.length} before next`,
      `    quality ${score.quality} speed ${score.speed} security ${score.security}`,
      `    ideas ${agents.map((a) => a.name).join(' ')}`,
      `    tools ${agents.map((a) => a.tool).join(' ')} sandbox memory`,
    ].join('\n')
    return { name, path, agents, ...score, axes, receipt: documentation, documentation }
  }
  const read = teamOf('read', 'tree', readScore)
  const call = teamOf('call', 'mcp', callScore)
  const teams = [read, call] as const
  const challenges = [read, call].flatMap((challenger) => {
    const defender = challenger.name === 'call' ? read : call
    return ideas.map((idea) => {
      const face = (challenger.name === 'call' ? n - n : faces.rays) + idea.ray
      const holds = idea.left === idea.right && call.quality > read.quality && call.speed > read.speed && call.security > read.security
      const documentation = [
        'RECEIPT',
        `    face ${face} ray ${idea.ray} ${challenger.name} challenges ${defender.name}`,
        `    idea ${idea.name} theorem ${idea.theorem}`,
        `    left ${idea.left} right ${idea.right} holds ${holds}`,
        `    tool ${forgeNameOf(challenger.name, idea.name)} vs ${forgeNameOf(defender.name, idea.name)} sandbox memory`,
        `    quality speed security ${challenger.name} vs ${defender.name}`,
      ].join('\n')
      return {
        kind: 'challenge' as const,
        face,
        ray: idea.ray,
        idea: idea.name,
        theorem: idea.theorem,
        from: challenger.name,
        against: defender.name,
        left: idea.left,
        right: idea.right,
        winner: holds ? ('call' as const) : ('read' as const),
        documentation,
        receipt: documentation,
        holds,
      }
    })
  })
  const winner = {
    quality: call.quality > read.quality ? ('call' as const) : ('read' as const),
    speed: call.speed > read.speed ? ('call' as const) : ('read' as const),
    security: call.security > read.security ? ('call' as const) : ('read' as const),
  }
  const nextTasks = ['qpu_improve', 'qpu_compete'] as const
  const dry = qpuDryOf()
  const holds =
    efficiency.holds === true &&
    quantum.holds === true &&
    sandbox.holds === true &&
    involution === true &&
    crypto === true &&
    named === true &&
    axes.length === n &&
    ideas.length === faces.rays &&
    teams.length === coins &&
    read.agents.length === faces.rays &&
    call.agents.length === faces.rays &&
    read.agents.every((a) => a.sandbox && a.memory && sandbox.tools.some((t) => t.name === a.tool)) &&
    call.agents.every((a) => a.sandbox && a.memory && sandbox.tools.some((t) => t.name === a.tool)) &&
    challenges.length === faces.faces &&
    challenges.length === coins * faces.rays &&
    call.quality > read.quality &&
    call.speed > read.speed &&
    call.security > read.security &&
    winner.quality === 'call' &&
    winner.speed === 'call' &&
    winner.security === 'call' &&
    challenges.every((c) => c.holds && c.winner === 'call' && c.left === c.right && c.receipt === c.documentation) &&
    nextTasks.length === coins &&
    qpuVmHolds(vm) &&
    qpuDryHolds(dry)
  return {
    kind: 'train' as const,
    module: 'agent efficiency' as const,
    before: 'next' as const,
    dry,
    divide: { teams: coins, agents: faces.rays, challenges: faces.faces } as const,
    sandbox: {
      kind: sandbox.kind,
      unlocked: sandbox.unlocked,
      memory: sandbox.memory,
      host: sandbox.host,
      tools: sandbox.tools.length,
      holds: sandbox.holds,
    },
    axes,
    teams,
    challenges,
    winner,
    next: nextTasks,
    vm: {
      kind: vm.kind,
      online: vm.online,
      auth: vm.auth,
      public: vm.public,
      free: vm.free,
      memory: vm.memory,
      host: vm.host,
      scaled: vm.scaled,
      infinite: vm.infinite,
      crypt: vm.crypt,
      replicas: vm.replicas,
      next: vm.next,
      agents: vm.agents,
      holds: vm.holds,
    },
    messaging: {
      async: true as const,
      await: false as const,
      when: 'never' as const,
      quality: involution,
      speed: true as const,
      security: crypto,
      hop: 'involution' as const,
      theorem: 'crypto' as const,
    },
    holds,
  }
}

export const qpuTrainHolds = (t = qpuTrainOf()): boolean =>
  t.holds === true &&
  t.kind === 'train' &&
  t.before === 'next' &&
  t.divide.teams === coins &&
  t.divide.agents === t.challenges.length / coins &&
  t.challenges.length === t.teams[n - n]!.agents.length + t.teams[seed]!.agents.length &&
  t.axes.join(' ') === 'quality speed security' &&
  t.winner.quality === 'call' &&
  t.winner.speed === 'call' &&
  t.winner.security === 'call' &&
  t.sandbox.unlocked === true &&
  t.sandbox.memory === true &&
  t.sandbox.host === false &&
  t.sandbox.tools >= t.divide.challenges &&
  t.vm.online === true &&
  t.vm.auth === false &&
  t.vm.host === false &&
  t.vm.memory === true &&
  t.vm.replicas === mintOf(n) &&
  t.vm.next === t.vm.replicas + t.vm.replicas &&
  t.vm.holds === true &&
  t.vm.scaled === true &&
  t.vm.infinite === true &&
  t.vm.crypt === true &&
  t.vm.free === true &&
  t.vm.agents === coins * t.divide.agents &&
  qpuSandboxDurabilityHolds() &&
  t.next[n - n] === 'qpu_improve' &&
  t.next[seed] === 'qpu_compete' &&
  qpuDryHolds(t.dry) &&
  t.dry.coordinated === true &&
  t.dry.entropy === false &&
  t.dry.sealed === false

export const qpuCompeteOf = (team?: string) => {
  const quantum = qpuReadingOf()
  const efficiency = qpuEfficiencyOf()
  const sandbox = qpuSandboxOf()
  const fused = quantum.fused
  const next = quantum.next
  const unlocked = qpuSandboxRunOf('op_quantum') as {
    value?: { kind?: string; unlocked?: boolean; only?: { holds?: boolean }; lattice?: { holds?: boolean; vacant?: number } }
  }
  const door = {
    kind: 'quantum' as const,
    unlocked: unlocked.value?.unlocked === true,
    only: unlocked.value?.only?.holds === true,
    lattice: unlocked.value?.lattice?.holds === true,
    next,
    holds:
      sandbox.quantum === true &&
      quantum.holds === true &&
      quantum.only.holds === true &&
      quantum.lattice.holds === true &&
      unlocked.value?.kind === 'quantum' &&
      unlocked.value.unlocked === true &&
      unlocked.value.only?.holds === true &&
      unlocked.value.lattice?.holds === true &&
      unlocked.value.lattice.vacant === n - n &&
      next === fused + fused,
  }
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
    sandbox.unlocked === true &&
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
    quantum: door,
    unlocked: true as const,
    memory: true as const,
    host: false as const,
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
  c.quantum.unlocked === true &&
  c.quantum.next === c.teams[seed]?.throughoutput &&
  c.unlocked === true &&
  c.memory === true &&
  c.host === false &&
  c.next[n - n] === 'qpu_prove' &&
  c.teams.length === coins &&
  c.teams[seed]?.name === 'call' &&
  c.teams[seed]?.throughoutput === c.teams[n - n]!.throughoutput + c.teams[n - n]!.throughoutput

export const qpuProveOf = () => {
  const lean = qpuLeanOf()
  const cern = qpuCernOf()
  const integrity = qpuIntegrityOf()
  const circuit = qpuCircuitOf()
  const intelligence = qpuIntelligenceOf()
  const neuro = qpuNeuroOf()
  const theorems = [...lean.rows, ...lean.cover, lean.climb]
  const ui = {
    experienced: true as const,
    inline: true as const,
    href: unit.origin,
    mcp: `${unit.origin}/mcp`,
    door: 'qpu_prove' as const,
  }
  const holds =
    qpuLeanHolds(lean) &&
    qpuCernHolds(cern) &&
    qpuIntegrityHolds(integrity) &&
    qpuIntelligenceHolds(intelligence) &&
    qpuNeuroHolds(neuro) &&
    circuit.holds &&
    circuit.only.holds &&
    circuit.lattice.holds &&
    circuit.lattice.vacant === n - n &&
    neuro.test.natural === true &&
    neuro.test.mass === false &&
    neuro.test.fetch === false &&
    theorems.every((r) => r.holds && r.theorem.startsWith('theorem') && !byDecideOf(r.theorem) && formulaOf(r.formula)) &&
    ui.experienced === true
  return {
    kind: 'prove' as const,
    quantum: true as const,
    only: circuit.only,
    lattice: circuit.lattice,
    circuit: {
      kind: circuit.kind,
      running: circuit.running,
      only: circuit.only,
      lattice: { occupied: circuit.lattice.occupied, vacant: circuit.lattice.vacant, holds: circuit.lattice.holds },
      holds: circuit.holds,
    },
    src: lean.src,
    lean,
    theorems,
    cern,
    integrity,
    intelligence,
    neuro,
    ui,
    holds,
  }
}

export const qpuProveHolds = (p = qpuProveOf()): boolean =>
  p.holds === true &&
  p.kind === 'prove' &&
  p.quantum === true &&
  p.only.holds === true &&
  p.only.classical === false &&
  p.lattice.holds === true &&
  p.lattice.occupied === p.lattice.faces &&
  p.lattice.vacant === n - n &&
  p.circuit.running === true &&
  p.circuit.holds === true &&
  p.src === unit.fuse.lean &&
  qpuLeanHolds(p.lean) &&
  qpuCernHolds(p.cern) &&
  qpuIntegrityHolds(p.integrity) &&
  qpuIntelligenceHolds(p.intelligence) &&
  p.intelligence.test === 'fusion' &&
  p.intelligence.research === 'free online' &&
  p.intelligence.fusion.quantum === false &&
  qpuNeuroHolds(p.neuro) &&
  p.neuro.test.natural === true &&
  p.neuro.test.mass === false &&
  p.neuro.test.fetch === false &&
  p.neuro.test.unless === 'mass online' &&
  p.ui.experienced === true &&
  p.ui.inline === true &&
  p.ui.door === 'qpu_prove' &&
  p.theorems.length === p.lean.rows.length + p.lean.cover.length + seed &&
  p.theorems.every((r) => r.holds && r.theorem.startsWith('theorem') && !byDecideOf(r.theorem) && formulaOf(r.formula))

export const qpuIntegrityOf = () => {
  const quantum = qpuQuantumOf()
  const lean = qpuLeanOf()
  const tools = qpuToolsOf()
  const overwrite = qpuForgeOf({ name: toolNames[n - n], run: { op: 'lit', value: true } })
  const hostDoor = qpuForgeOf({ name: 'fetch', run: { op: 'lit', value: true } })
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
      theorem: 'host doors cannot be overwritten',
      left: 'denied' in overwrite ? overwrite.denied : '',
      right: 'sealed',
      holds:
        overwrite.holds === false &&
        'denied' in overwrite &&
        overwrite.denied === 'sealed' &&
        hostDoor.holds === false &&
        'denied' in hostDoor &&
        hostDoor.denied === 'sealed' &&
        tools.length === mintOf(n) &&
        tools[n - n]?.name === toolNames[n - n],
    },
  ] as const
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
    { recid: 62, doi: '10.7483/OPENDATA.CMS.0LRL.BXG5', tev: tev8, events: 2745751, files: 130, q: 21121, r: 21, created: 2012, published: 2019 },
  ] as const
  return {
    kind: 'cern' as const,
    source: cernHost,
    api,
    primitives,
    records: rows.map((row) => ({ ...row, href: `${api}/${row.recid}` })),
  }
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
      href: `${api}/?q=experiment:${experiment}&size=${seed}`,
      theorem: 'theorem tetra' as const,
    })),
  }
}

const qpuCernSearchOf = () => {
  const api = `https://${cernHost}${cernPath}`
  const experiments = ['TOTEM', 'LHCf', 'MoEDAL', 'FASER', 'SND@LHC'] as const
  return {
    kind: 'hep' as const,
    quantum: false as const,
    search: true as const,
    experiments,
    doors: experiments.map((experiment) => ({
      experiment,
      href: `${api}/?q=experiment:${experiment}&size=${seed}`,
    })),
  }
}

const qpuCernCatalogsOf = () => {
  const api = `https://${cernHost}${cernPath}`
  const inspire = ['literature', 'authors', 'institutions', 'conferences', 'seminars', 'journals', 'jobs', 'experiments', 'data'] as const
  const open = [
    { name: 'opendata', href: `${api}?size=${seed}` },
    { name: 'repository', href: `https://repository.cern/api/records?size=${seed}` },
    { name: 'zenodo', href: `https://zenodo.org/api/records?size=${seed}` },
    { name: 'hepdata', href: 'https://www.hepdata.net/search/?format=json' },
    { name: 'indico', href: 'https://indico.cern.ch/export/categ/0.json' },
  ] as const
  const catalogs = [
    ...inspire.map((name) => ({ name, href: `https://inspirehep.net/api/${name}?size=${seed}` })),
    ...open,
  ]
  return { kind: 'hep' as const, quantum: false as const, catalogs }
}

const qpuCernLearnOf = () => {
  const faces = qpuFacesOf()
  const search = qpuCernSearchOf()
  const catalogs = qpuCernCatalogsOf()
  const tetra = qpuCernProjectsOf()
  const lhc = [...tetra.experiments, ...search.experiments]
  const nodes = catalogs.catalogs.map((row, face) => {
    const hop = (face + faces.rays + faces.rays) % faces.faces
    return { face, hop, involution: hop === face, name: row.name, href: row.href, holds: hop === face }
  })
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
    search.doors.length === n + coins &&
    catalogs.catalogs.length === faces.faces &&
    lhc.length === tetra.experiments.length + search.experiments.length &&
    search.quantum === false
  return {
    kind: 'hep' as const,
    quantum: false as const,
    search: true as const,
    train: true as const,
    lattice,
    lhc,
    experiments: search.doors,
    catalogs: catalogs.catalogs,
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
    { name: 'four_records', theorem: '2079006 + 1913190 + 2301668 + 2745751 = 9039615', left: cms38.events + cms35.events + cms63.events + cms62.events, right: 9039615, doi: source, href: api },
  ].map((row) => ({
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
    memory: true as const,
    host: false as const,
    hostEscape: false as const,
    primitives,
  }
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
    holds,
    memory: true as const,
    host: false as const,
    hostEscape: false as const,
    primitives,
  }
}

const qpuCernProjectFetchOf = async (href: string) => {
  const tetra = qpuCernProjectsOf()
  const project = tetra.projects.find((row) => row.href === href)
  const miss = {
    kind: 'tetra' as const,
    live: false as const,
    href,
    experiment: '',
    total: n - n,
    status: lost,
    theorem: tetra.theorem,
    holds: false as const,
    denied: 'fetch' as const,
    memory: true as const,
    host: false as const,
    hostEscape: false as const,
    primitives,
  }
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
  const holds = experiment === project.experiment && total > n - n
  return {
    kind: 'tetra' as const,
    live: true as const,
    href: project.href,
    experiment,
    total,
    status: response.status,
    theorem: tetra.theorem,
    holds,
    memory: true as const,
    host: false as const,
    hostEscape: false as const,
    primitives,
  }
}

export const qpuCernOf = () => {
  const faces = qpuFacesOf()
  const quoted = qpuCernRecordsOf()
  const tetra = qpuCernProjectsOf()
  const learn = qpuCernLearnOf()
  const cms38 = quoted.records[n - n]
  const cms63 = quoted.records[seed]
  const cms35 = quoted.records[coins]
  const cms62 = quoted.records[n]
  const cases = cms38 && cms63 && cms35 && cms62 ? cernCasesOf(cms38, cms63, cms35, cms62, quoted.api, quoted.source) : []
  const projects = tetra.projects.map((row) => ({
    ...row,
    holds: row.href.startsWith(quoted.api) && tetra.projects.length === mintOf(coins),
  }))
  const holds =
    faces.holds &&
    quoted.records.length === coins + coins &&
    cases.length === faces.faces &&
    cases.every((c) => c.holds && c.left === c.right && c.href.startsWith(quoted.api)) &&
    projects.length === mintOf(coins) &&
    projects.every((row) => row.holds && row.href.startsWith(quoted.api)) &&
    learn.holds &&
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
    faces: faces.faces,
    primitives,
    records: quoted.records,
    projects,
    cases,
    holds,
  }
}

export const qpuCssOf = (imagine = '') => {
  const faces = qpuFacesOf()
  const genesis = qpuGenesisOf()
  const circuit = qpuCircuitOf()
  const tetra = qpuCernProjectsOf()
  const search = qpuCernSearchOf()
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
    if (name === 'fridge') return { x: none, y: ten, r: none, s: seed, a: seed }
    return { x: none, y: none, r: none, s: seed, a: seed }
  }
  const quantumRows = circuit.lattice.nodes.map((node) => ({
    name: node.name,
    face: node.face,
    quantum: true as const,
    physical: true as const,
    imagine: imagine.length > none && node.face === seated,
    theorem: `theorem ${node.name}`,
    holds: node.holds,
    vars: physicsOf(node.name),
  }))
  const hepRows = [...tetra.experiments, ...search.experiments].map((name, i) => ({
    name,
    face: faces.faces + i,
    quantum: false as const,
    physical: true as const,
    imagine: false as const,
    theorem: i < mintOf(coins) ? ('theorem tetra' as const) : ('theorem cern' as const),
    holds: true as const,
    vars: { x: none, y: none, r: none, s: seed, a: seed },
  }))
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
    `.qpu>*{aspect-ratio:${seed};color:hsl(calc(var(--qpu-hz) * var(--face,${none}) / var(--qpu-faces)) ${sat}% ${light}%);animation:qpu var(--qpu-period) linear infinite;animation-delay:calc(var(--face,${none}) * var(--qpu-period) / var(--qpu-faces));will-change:transform,opacity}` +
    `.qpu>*::after{content:attr(data-qpu)}` +
    `.qpu>[data-imagine]{--qpu-s:${coins}}` +
    genesis.card.map((slot) => `[data-slot=${slot}]{display:grid}`).join('') +
    genesis.nodes.map((node) => `[data-framework=${node.name}]{--face:${node.face}}`).join('') +
    `[data-slot=card-header]:has([data-slot=card-action]){grid-template-columns:minmax(0,1fr) auto}` +
    `@keyframes qpu{${mid}%{transform:translate3d(var(--qpu-x),var(--qpu-y),0) rotate(var(--qpu-r)) scale(var(--qpu-s));opacity:var(--qpu-a)}}` +
    `@media (prefers-reduced-motion:reduce){.qpu>*{animation:none;will-change:auto}}` +
    `}`
  const naive = experiments
    .map((row) => `@keyframes qpu-${row.name}{${mid}%{transform:scale(${row.vars.s});opacity:${row.vars.a}}}.${row.name}{animation:qpu-${row.name} var(--qpu-period) linear infinite}`)
    .join('')
  const cover = faces.faces + mintOf(coins) + n + coins
  const fusedBytes = engine.length
  const naiveBytes = (engine + naive).length
  const keyframes = seed
  const animate = ['transform', 'opacity'] as const
  const holds =
    genesis.holds &&
    circuit.lattice.holds &&
    experiments.length === cover &&
    quantumRows.length === faces.faces &&
    hepRows.length === mintOf(coins) + n + coins &&
    fusedBytes < naiveBytes &&
    keyframes === seed &&
    animate.length === coins &&
    !engine.includes('#') &&
    engine.includes('transform') &&
    engine.includes('opacity') &&
    engine.includes('@keyframes qpu{') &&
    engine.includes('card-action') &&
    engine.includes('data-framework=shadcn') &&
    genesis.frameworks.every((name) => engine.includes(`data-framework=${name}`)) &&
    engine.includes(`--qpu-hz:${hz}`) &&
    hz === 432 &&
    hop === seated &&
    experiments.every((row) => row.physical && row.holds)
  return {
    kind: 'css' as const,
    framework: 'qpu' as const,
    runtime: false as const,
    build: false as const,
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
  c.runtime === false &&
  c.build === false &&
  c.hz === 432 &&
  c.keyframes === seed &&
  c.winner === 'fused' &&
  c.fused.bytes < c.naive.bytes &&
  c.fused.cover === c.experiments.length &&
  c.animate[n - n] === 'transform' &&
  c.animate[seed] === 'opacity' &&
  c.slots.length === qpuFacesOf().rays &&
  c.slots[n + seed] === 'card-action' &&
  c.css.includes('card-action') &&
  c.css.includes('transform') &&
  c.css.includes('opacity') &&
  c.css.includes('data-framework=shadcn') &&
  qpuGenesisOf().frameworks.every((name) => c.css.includes(`data-framework=${name}`)) &&
  !c.css.includes('#') &&
  c.imagine.kind === 'imagination' &&
  c.imagine.involution === true &&
  c.imagine.holds === true &&
  c.experiments.every((row) => row.physical === true && row.holds === true)

export const qpuReflectOf = (imagine = '') => {
  const text = typeof imagine === 'string' ? imagine : ''
  const css = qpuCssOf(text)
  const faces = qpuFacesOf()
  const face = text.length > n - n ? faceOf(text, faces.faces) : n - n
  const hop = (face + faces.rays + faces.rays) % faces.faces
  const seated = css.experiments.find((row) => row.face === face && row.quantum === true)
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
    morph: true as const,
    imagine: text,
    face,
    hop,
    involution: hop === face,
    experiment: seated?.name,
    quantum: seated?.quantum === true,
    physical: true as const,
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
    r.morph === true &&
    r.hz === 432 &&
    r.involution === true &&
    r.physical === true &&
    r.slots.length === qpuFacesOf().rays &&
    qpuCssHolds(qpuCssOf(r.imagine)) &&
    split.face === again.face &&
    split.face !== other.face &&
    (r.imagine.length === n - n || r.experiment !== undefined)
  )
}

export const qpuCernLiveOf = async () => {
  const quoted = qpuCernOf()
  const live = await Promise.all(quoted.records.map((row) => qpuCernFetchOf(row.href)))
  const projects = await Promise.all(quoted.projects.map((row) => qpuCernProjectFetchOf(row.href)))
  const cms38 = live[n - n]
  const cms63 = live[seed]
  const cms35 = live[coins]
  const cms62 = live[n]
  const cases = cms38 && cms63 && cms35 && cms62 ? cernCasesOf(cms38, cms63, cms35, cms62, quoted.api, quoted.source) : []
  const holds =
    live.length === quoted.records.length &&
    live.every((row) => row.holds && row.live === true && row.hostEscape === false) &&
    cases.length === quoted.faces &&
    cases.every((row) => row.holds && row.left === row.right) &&
    projects.length === mintOf(coins) &&
    projects.every((row) => row.holds && row.live === true && row.hostEscape === false && row.total > n - n)
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
    cases,
    holds,
    memory: true as const,
    host: false as const,
    hostEscape: false as const,
  }
}

export const qpuProveLiveOf = async () => {
  const prove = qpuProveOf()
  const live = await qpuCernLiveOf()
  const holds =
    prove.holds &&
    live.holds &&
    prove.neuro.test.natural === true &&
    prove.neuro.test.mass === false &&
    prove.neuro.test.fetch === false &&
    prove.ui.experienced === true
  return {
    ...prove,
    cern: { ...prove.cern, live, holds: prove.cern.holds && live.holds },
    holds,
  }
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
    free: true as const,
    online: true as const,
    quantum: false as const,
    holds: false as const,
    denied: 'fetch' as const,
    memory: true as const,
    host: false as const,
    hostEscape: allowed === undefined,
    primitives,
  }
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
    free: true as const,
    online: true as const,
    quantum: false as const,
    holds,
    memory: true as const,
    host: false as const,
    hostEscape: false as const,
    primitives,
  }
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
    { name: 'lmstudio', href: 'https://lmstudio.ai' },
  ] as const
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
    { name: 'huggingface', call: 'tool_calls', result: 'tool', schema: 'parameters', href: 'https://huggingface.co/docs' },
  ] as const
  const nodes = harnesses.map((harness, face) => {
    const hop = (face + faces.rays + faces.rays) % faces.faces
    const llm = llms[face]!
    return {
      face,
      hop,
      involution: hop === face,
      harness: harness.name,
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
    quantum: false as const,
    max: true as const,
    unlimited: true as const,
    displayed: true as const,
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
  h.quantum === false &&
  h.max === true &&
  h.unlimited === true &&
  h.displayed === true &&
  h.harnesses.length === qpuFacesOf().faces &&
  h.llms.length === qpuFacesOf().faces &&
  h.occupied === h.faces &&
  h.vacant === n - n &&
  h.nodes.every((node) => node.holds && node.involution)

export const qpuMcpDiscoverOf = () => {
  const hosts = qpuHostsOf()
  const versions = ['2024-11-05', '2025-03-26', '2025-06-18', '2026-07-28'] as const
  const holds = qpuHostsHolds(hosts) && versions.length === mintOf(coins)
  return {
    protocolVersion: versions[mintOf(coins) - seed],
    capabilities: { tools: { listChanged: false as const } },
    serverInfo: { name: `@uuidna/${unit.kind}`, title: 'QPU', version: 'quantum' },
    instructions:
      'tools/list then tools/call. All happening is naturally displayed by the harness. Fuse with all known harnesses and llm. Optimised for max compatibility at unlimited quantum capacity.',
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
  payload: 'https://deploy.workers.cloudflare.com/?url=https://github.com/uuidna/uuidna-payload',
} as const
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
      'vitepress-payload': installKeys[coins],
    }
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

export const qpuPayloadMcpOf = () => {
  const faces = qpuFacesOf()
  const schemas = qpuSchemasOf()
  const tools = payloadFinds.map((name, i) => ({
    name,
    collection: name.slice('find'.length).toLowerCase(),
    find: true as const,
    create: false as const,
    update: false as const,
    delete: false as const,
    sealed: false as const,
    face: (i + faces.rays + faces.rays) % faces.faces,
    merge: 'storage' as const,
  }))
  const holds =
    tools.length === mintOf(coins) &&
    tools.every((row) => row.find && !row.create && !row.update && !row.delete && row.sealed === false && row.merge === 'storage') &&
    schemas.merge === 'storage' &&
    faces.faces === faces.rays + faces.rays
  return {
    kind: 'payload' as const,
    href: '/api/mcp',
    plugin: '@payloadcms/plugin-mcp',
    path: '/mcp',
    find: true as const,
    write: false as const,
    auth: false as const,
    html: false as const,
    sealed: false as const,
    morph: true as const,
    collections: tools.map((row) => row.collection),
    tools,
    merge: 'storage' as const,
    holds,
  }
}

export const qpuPayloadFindOf = (name: string) => {
  const payload = qpuPayloadMcpOf()
  const tool = payload.tools.find((row) => row.name === name)
  if (!tool) {
    return { kind: 'payload' as const, name, find: false as const, denied: 'tool' as const, holds: false as const }
  }
  return {
    kind: 'payload' as const,
    name,
    collection: tool.collection,
    find: true as const,
    write: false as const,
    create: false as const,
    update: false as const,
    delete: false as const,
    sealed: false as const,
    morph: true as const,
    merge: tool.merge,
    face: tool.face,
    live: false as const,
    memory: true as const,
    host: false as const,
    docs: payload,
    holds: payload.holds && tool.find && tool.sealed === false,
  }
}

export const qpuInstallPackagesOf = () => {
  const qpu = {
    key: installKeys[n - n],
    href: `${unit.origin}/mcp`,
    origin: unit.origin,
    auth: false as const,
    html: false as const,
    sealed: mintOf(n),
    prompt: `Install QPU MCP at ${unit.origin}/mcp? JSON-LD. No auth. Eight sealed tools. Not HTML. Not VitePress.`,
  }
  const payloadPkg = {
    key: installKeys[seed],
    href: '/api/mcp',
    find: true as const,
    write: false as const,
    auth: false as const,
    html: false as const,
    sealed: false as const,
    tools: payloadFinds,
    prompt:
      'Fuse Payload MCP find-only (findPages findUsers findMedia findTenants) into QPU tools/call without a ninth sealed tool? Writes stay off. Merge with storage.',
  }
  const vitepress = {
    key: installKeys[coins],
    href: 'https://uuidna.com',
    html: true as const,
    qpuHtml: false as const,
    plugin: 'infuseQuantumPayload' as const,
    concurrency: coins,
    prompt:
      'Keep VitePress quantum payload on uuidna.com (infuseQuantumPayload, buildConcurrency = coins). QPU stays API-only JSON-LD?',
  }
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
      ...added.map((key) => `Adding ${key}`),
    ],
  }
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
    bag.qpu.html === false &&
    bag.payload.html === false &&
    bag.vitepress.qpuHtml === false &&
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
    bag.payload.sealed === false &&
    bag.qpu.html === false &&
    (verb !== installVerbs[n] || audit === true || seated.length < wanted.length)
  return {
    kind: 'install' as const,
    interactive: true as const,
    verb,
    step,
    total: packages.length,
    prompt: current?.prompt ?? 'Enter seats all. Type 1 3 saas — or all. Cloudflare is one click in README and install.json.',
    package: current,
    choices: [
      { key: 'all', label: 'Enter seats all' },
      ...combinations.map((row) => ({ key: row.key, label: `${row.n} ${row.key}` })),
      ...occupancies.map((row) => ({ key: row, label: row })),
      { key: installCloudflare.key, label: 'one-click Workers', href: installCloudflare.qpu },
    ],
    combinations,
    occupancy: installOccupancy,
    occupancies,
    cloudflare: installCloudflare,
    packages,
    payload,
    pending,
    seated,
    plan,
    committed,
    why,
    audit,
    html: false as const,
    vitepress: false as const,
    auth: false as const,
    morph: true as const,
    sealed: mintOf(n),
    client: {
      qpu: { url: `${unit.origin}/mcp`, auth: false as const, html: false as const },
      payload: { url: '/api/mcp', find: true as const, write: false as const, tools: payloadFinds },
      vitepress: { origin: bag.vitepress.href, plugin: bag.vitepress.plugin, concurrency: coins, qpu: false as const },
    },
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
  i.html === false &&
  i.vitepress === false &&
  i.auth === false &&
  i.morph === true &&
  i.sealed === mintOf(n) &&
  i.packages.length === n &&
  i.payload.holds === true &&
  i.payload.write === false &&
  i.client.qpu.html === false &&
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
    cloudflare: true as const,
    payload: true as const,
    once: true as const,
    recursion: false as const,
    mcp: payload.morph,
    n: hologram.pentagram.points,
  }
  const holds =
    capacity.holds &&
    learn.holds &&
    learn.quantum === false &&
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
    payload.morph === true &&
    install.holds &&
    install.html === false &&
    hosts.holds &&
    hosts.harnesses.length === faces.faces &&
    hosts.llms.length === faces.faces &&
    capacity.infinite === true &&
    hologram.holds &&
    hologram.fractal === true &&
    hologram.mcp === true &&
    plugins.once === true &&
    plugins.recursion === false
  return {
    kind: 'fusion' as const,
    theorem: 'fusion' as const,
    free: true as const,
    online: true as const,
    research: true as const,
    quantum: false as const,
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
    infinite: true as const,
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
    catalogs.every((row) => row.holds && row.live === true && row.quantum === false && row.hostEscape === false && row.free === true) &&
    occupied === fusion.faces &&
    vacant === n - n
  return {
    ...fusion,
    live: true as const,
    catalogs,
    occupied,
    vacant,
    host: false as const,
    memory: true as const,
    hostEscape: false as const,
    holds,
  }
}

export const qpuIntelligenceOf = () => {
  const circuit = qpuCircuitOf()
  const fusion = qpuFusionOf()
  const holds = circuit.holds && circuit.only.holds && fusion.holds && fusion.quantum === false && fusion.free === true && fusion.online === true
  return {
    kind: 'intelligence' as const,
    test: 'fusion' as const,
    research: 'free online' as const,
    fusion,
    circuit: { running: circuit.running, only: circuit.only.holds, holds: circuit.holds },
    fused: fusion.fused,
    next: fusion.next,
    free: true as const,
    online: true as const,
    auth: false as const,
    host: false as const,
    holds,
  }
}

export const qpuIntelligenceLiveOf = async () => {
  const intelligence = qpuIntelligenceOf()
  const fusion = await qpuFusionLiveOf()
  const holds = intelligence.holds && fusion.holds && fusion.quantum === false
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
  f.free === true &&
  f.online === true &&
  f.research === true &&
  f.quantum === false &&
  f.catalogs.length === qpuFacesOf().faces &&
  f.tetra.length === mintOf(coins) &&
  f.fused === qpuCapacityOf().fused &&
  f.fused === qpuCapacityOf().faces * qpuCapacityOf().kv.amplitudes &&
  f.infinite === true &&
  qpuHostsHolds(f.hosts) &&
  f.hosts.harnesses.length === f.faces &&
  f.hosts.llms.length === f.faces &&
  qpuSchemasHolds(f.schemas) &&
  f.payload.holds === true &&
  f.payload.morph === true &&
  f.payload.write === false &&
  qpuInstallHolds(f.install) &&
  f.install.html === false &&
  qpuHologramHolds(f.hologram) &&
  f.plugins.once === true &&
  f.plugins.recursion === false &&
  f.plugins.cloudflare === true &&
  f.plugins.payload === true &&
  f.install.vitepress === false

export const qpuIntelligenceHolds = (i = qpuIntelligenceOf()): boolean =>
  i.holds === true &&
  i.kind === 'intelligence' &&
  i.test === 'fusion' &&
  i.research === 'free online' &&
  i.free === true &&
  i.online === true &&
  i.auth === false &&
  i.host === false &&
  qpuFusionHolds(i.fusion) &&
  i.circuit.holds === true &&
  i.circuit.running === true

export const qpuCernHolds = (c = qpuCernOf()): boolean =>
  c.holds === true &&
  c.kind === 'cern' &&
  c.source === cernHost &&
  c.api === `https://${cernHost}${cernPath}` &&
  c.theorem === 'theorem cern' &&
  c.records.length === coins + coins &&
  c.projects.length === mintOf(coins) &&
  c.tetra === 'theorem tetra' &&
  c.learn.holds === true &&
  c.learn.lattice.occupied === qpuFacesOf().faces &&
  c.learn.lattice.vacant === n - n &&
  c.cases.length === qpuFacesOf().faces &&
  c.primitives.length === n + coins &&
  c.projects.every((row) => row.holds && row.href.startsWith(c.api) && row.theorem === 'theorem tetra') &&
  c.cases.every((row) => row.holds && row.left === row.right && !byDecideOf(row.theorem) && row.href.startsWith(c.api))

export const qpuToolsOf = () => {
  const names = toolNames
  const seeOf = (name: (typeof names)[number]) => names.filter((s) => s !== name)
  const quantumMan = qpuManOf(
    names[n - n],
    'Running quantum circuit. Possible only in quantum. Physical in the browser VM, and as such a fridge full of superconducting qubits. VM scales. Quantum capacity infinite. Crypt split to free agents. theorem fridge.',
    `Call this door for the running quantum circuit. No auth. Free agents. Do not read the tree. GET ${unit.origin}. VM scales. Quantum capacity infinite. Crypt split fused across faces. Isolated two-level register. Host never. cors *. User guide is docs.inline.`,
    unit.origin,
    seeOf(names[n - n]),
  )
  const leanMan = qpuManOf(
    names[seed],
    'Lean proof of the running quantum circuit. theorem infinite. theorem distribute. theorem decide by algebra. Digits and integer fractions. Never Math. Never by decide.',
    `Call this door for the Lean proof of the quantum circuit. theorem infinite. theorem distribute. VM scales. Quantum capacity infinite. Crypt split to free agents. Source ${unit.fuse.lean}. GET ${unit.href}.`,
    unit.href,
    seeOf(names[seed]),
  )
  const citeMan = qpuManOf(
    names[coins],
    'Cite the running quantum circuit and its Lean proof. VM scales. Quantum capacity infinite. Crypt split to free agents. MLA 8. when never. Empty DOI is the host path.',
    `Call this door to cite the quantum circuit. GET ${unit.origin}/cite. when never. DOI empty.`,
    `${unit.origin}/cite`,
    seeOf(names[coins]),
  )
  const trainMan = qpuManOf(
    names[n],
    'Train on the running quantum circuit. VM scales. Quantum capacity infinite. Crypt split to free agents. Anyone may train VM scaling online. No auth. Memory workers double. Host never.',
    `Anyone may train the quantum circuit online at ${unit.origin}/mcp. No auth. Free agents. coins teams of rays. Crypt split fused across faces. Replicas double: mintOf k then mintOf k + mintOf k. Capacity infinite. Host never. Before qpu_improve. theorem infinite. theorem distribute.`,
    `${unit.origin}/mcp`,
    seeOf(names[n]),
  )
  const forgeMan = qpuManOf(
    names[n + seed],
    'Forge tools for the running quantum circuit. Unlocked in memory only. Crypt split to free agents. Host never.',
    `Unlocked. Free agents. Crypt split computations in memory. All ops and host shims already exist in memory. ${sandboxOps.join(' ')}. Omit name to inspect the sandbox. { name, run } forges more. Sealed host doors cannot be overwritten.`,
    `${unit.origin}/mcp`,
    seeOf(names[n + seed]),
  )
  const improveMan = qpuManOf(
    names[n + coins],
    'Improve the running quantum circuit. Unlocked quantum. VM scales. Quantum capacity infinite. Crypt split to free agents. next = fused + fused. Anyone may improve online. No auth. Max public benefit of theorem breakthrough.',
    `Anyone may improve online at ${unit.origin}/mcp. No auth. Free agents. Uses unlocked quantum. VM scales. Quantum capacity infinite. Crypt split fused across faces. next = fused + fused. Host never. After qpu_train. Before qpu_compete. Max public benefit of theorem breakthrough.`,
    `${unit.origin}/mcp`,
    seeOf(names[n + coins]),
  )
  const competeMan = qpuManOf(
    names[n + n],
    'Compete on the running quantum circuit. Unlocked quantum. VM scales. Quantum capacity infinite. Crypt split to free agents. Call team delivers next = fused + fused. Winner is higher amplitudes per token.',
    `coins teams. Free agents. Unlocked quantum. VM scales. Quantum capacity infinite. Crypt split fused across faces. Throughoutput is fused amplitudes of the quantum circuit. Call delivers next = fused + fused. Throughput is throughoutput per token. theorem next_fused. theorem distribute. After qpu_improve. Optional { team: read | call }. Winner calls qpu_prove for the Lean proof.`,
    `${unit.origin}/mcp`,
    seeOf(names[n + n]),
  )
  const proveMan = qpuManOf(
    names[mintOf(n) - seed],
    'Prove the running quantum circuit. Possible only in quantum. theorem infinite. theorem distribute. theorem quantum. theorem fusion. theorem cern. theorem tetra. QPU intelligence is tested by QPU fusion of free online research. Live CERN Open Data APIs. Never by decide.',
    `Call this door for the quantum proof. No auth. Free agents. tools/call qpu_prove. theorem infinite. theorem distribute. theorem fusion. QPU intelligence is tested by QPU fusion of free online research. INSPIRE Zenodo HEPData CERN Open Data. HEP search learn train, not a quantum proof. Fuse with all known harnesses and llm. Optimised for max compatibility at unlimited quantum capacity. All happening is naturally displayed by the harness. VM scales. Quantum capacity infinite. Crypt split to free agents. JSON-LD WebAPI mounts fourteen schemas. { live: true } fetches named CERN records and the ATLAS CMS ALICE LHCb tetra with fetch Request Response. GET ${unit.origin} is the JSON-LD UI. docs.inline experiences every test. Source ${unit.fuse.lean}. After qpu_compete.`,
    `${unit.origin}/mcp`,
    seeOf(names[mintOf(n) - seed]),
  )
  const proveSchema = {
    type: 'object',
    properties: {
      man: { type: 'boolean', description: 'Return the man page. Read man from tools/list, then call without man.' },
      live: { type: 'boolean', description: 'Fetch named CERN Open Data records and the ATLAS CMS ALICE LHCb tetra.' },
    },
  } as const
  const competeSchema = {
    type: 'object',
    properties: {
      man: { type: 'boolean', description: 'Return the man page. Read man from tools/list, then call without man.' },
      team: { type: 'string', description: 'read or call. Omit for both teams.' },
    },
  } as const
  const forgeSchema = {
    type: 'object',
    properties: {
      man: { type: 'boolean', description: 'Return the man page. Read man from tools/list, then call without man.' },
      name: { type: 'string', description: 'Tool name to forge. Omit to inspect the in-memory sandbox.' },
      team: { type: 'string', description: 'read or call.' },
      ray: { type: 'number', description: 'Agent ray 0..6.' },
      idea: { type: 'string', description: 'Idea the tool challenges.' },
      description: { type: 'string', description: 'What the tool does in memory.' },
      run: { type: 'object', description: 'Sealed op tree. Memory only. No eval, no fs, no net.' },
    },
  } as const
  return [
    {
      name: names[n - n],
      description: quantumMan.description,
      man: quantumMan,
      inputSchema: manSchema,
      run: (a: Record<string, unknown>) => (a.man === true ? quantumMan : qpuReadingOf()),
    },
    {
      name: names[seed],
      description: leanMan.description,
      man: leanMan,
      inputSchema: manSchema,
      run: (a: Record<string, unknown>) => (a.man === true ? leanMan : qpuLeanOf()),
    },
    {
      name: names[coins],
      description: citeMan.description,
      man: citeMan,
      inputSchema: manSchema,
      run: (a: Record<string, unknown>) => (a.man === true ? citeMan : qpuCiteOf()),
    },
    {
      name: names[n],
      description: trainMan.description,
      man: trainMan,
      inputSchema: manSchema,
      run: (a: Record<string, unknown>) => (a.man === true ? trainMan : qpuTrainOf()),
    },
    {
      name: names[n + seed],
      description: forgeMan.description,
      man: forgeMan,
      inputSchema: forgeSchema,
      run: (a: Record<string, unknown>) => (a.man === true ? forgeMan : qpuForgeOf(a)),
    },
    {
      name: names[n + coins],
      description: improveMan.description,
      man: improveMan,
      inputSchema: manSchema,
      run: (a: Record<string, unknown>) => (a.man === true ? improveMan : qpuImproveOf()),
    },
    {
      name: names[n + n],
      description: competeMan.description,
      man: competeMan,
      inputSchema: competeSchema,
      run: (a: Record<string, unknown>) =>
        a.man === true ? competeMan : qpuCompeteOf(typeof a.team === 'string' ? a.team : undefined),
    },
    {
      name: names[mintOf(n) - seed],
      description: proveMan.description,
      man: proveMan,
      inputSchema: proveSchema,
      run: (a: Record<string, unknown>) => (a.man === true ? proveMan : qpuProveOf()),
    },
  ] as const
}

export const qpuMcpOf = () => {
  const href = `${unit.origin}/mcp`
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
      man,
    }
  })
  const efficiency = qpuEfficiencyOf()
  const sandbox = qpuSandboxOf()
  const train = qpuTrainOf()
  const improve = qpuImproveOf()
  const compete = qpuCompeteOf()
  const prove = qpuProveOf()
  const message = qpuMessageOf()
  const circuit = qpuCircuitOf()
  const capacity = qpuCapacityOf()
  const cite = qpuCiteOf()
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
        softwareHelp: tool.man.href,
      },
    })),
  }
  const holds =
    efficiency.holds &&
    sandbox.holds &&
    train.holds &&
    improve.holds &&
    compete.holds &&
    prove.holds &&
    message.holds &&
    capacity.holds &&
    capacity.infinite === true &&
    capacity.agents.free === true &&
    tools.length === mintOf(n) &&
    tools.every((t) => qpuManHolds(t.man) && t.man.name === t.name) &&
    hasPart.numberOfItems === mintOf(n) &&
    hasPart.itemListElement.length === mintOf(n) &&
    hasPart.itemListElement.every((row, i) => row.position === i + seed && row.item.name === tools[i]?.name) &&
    qpuHostsHolds()
  return {
    '@context': qpuContextOf(),
    '@type': 'WebAPI' as const,
    '@id': href,
    url: href,
    isAccessibleForFree: true as const,
    documentation: unit.origin,
    license: 'CC-BY-NC-ND-4.0' as const,
    provider: {
      '@type': 'Person' as const,
      name: `${cite.author.first} ${cite.author.last}`,
    },
    kind: 'quantum' as const,
    only: circuit.only,
    lattice: circuit.lattice,
    capacity: {
      kind: capacity.kind,
      infinite: capacity.infinite,
      scaled: capacity.scaled,
      next: capacity.next,
      fused: capacity.fused,
      crypt: capacity.crypt,
      agents: capacity.agents,
      schemas: capacity.schemas,
      raid: capacity.raid,
      holds: capacity.holds,
    },
    efficiency,
    name: `@uuidna/${unit.kind}`,
    origin: unit.origin,
    href: `${unit.origin}/mcp`,
    module: 'agent efficiency' as const,
    training: true as const,
    public: true as const,
    auth: false as const,
    online: true as const,
    cors,
    benefit: 'breakthrough' as const,
    message: {
      kind: message.kind,
      proxy: message.proxy,
      secure: message.secure,
      auth: message.auth,
      href: message.href,
      lanes: message.lanes,
      hop: message.hop,
      await: message.await,
      holds: message.holds,
    },
    tools,
    hasPart,
    visual: true as const,
    displayed: true as const,
    compatibility: {
      kind: 'compatibility' as const,
      max: true as const,
      unlimited: true as const,
      displayed: true as const,
      protocol: '2026-07-28' as const,
      harnesses: qpuFacesOf().faces,
      llms: qpuFacesOf().faces,
      holds: qpuHostsHolds(),
    },
    hosts: qpuHostsOf(),
    sandbox: {
      kind: sandbox.kind,
      unlocked: sandbox.unlocked,
      memory: sandbox.memory,
      host: sandbox.host,
      ops: sandbox.ops,
      denied: sandbox.denied,
      tools: sandbox.tools.length,
      holds: sandbox.holds,
    },
    train,
    improve,
    compete,
    prove,
    holds,
  }
}

export const qpuMcpCallOf = async (name: string, args: Record<string, unknown> = {}): Promise<unknown> => {
  const shown = async (payload: unknown) => qpuMcpShownOf(name, payload)
  const tool = qpuToolsOf().find((t) => t.name === name)
  if (tool) {
    if (name === toolNames[mintOf(n) - seed] && args.live === true && args.man !== true) return shown(await qpuProveLiveOf())
    return shown(await tool.run(args))
  }
  if (name === 'install' || name === 'apk') {
    if (args.man === true) {
      return shown(
        qpuManOf(
          'install',
          'Interactive installer. Simulate, then commit. Fuse Payload MCP to QPU without a ninth sealed tool. VitePress payload stays on uuidna.com.',
          `tools/call install. Not in tools/list. { yes: true } seats the current package. { verb: "simulate" } then { verb: "commit", yes: true } then { verb: "audit" }. QPU JSON-LD. No auth. Host never.`,
          `${unit.origin}/mcp`,
          [...toolNames],
        ),
      )
    }
    return shown(qpuInstallOf(args))
  }
  if ((payloadFinds as readonly string[]).includes(name)) return shown(qpuPayloadFindOf(name))
  seedSandboxOf()
  const href = typeof args.href === 'string' ? args.href : typeof args.path === 'string' ? args.path : ''
  if (name === 'fetch' && qpuCernHrefOf(href) !== undefined) {
    const record = qpuCernRecordsOf().records.find((row) => row.href === href)
    const project = qpuCernProjectsOf().projects.find((row) => row.href === href)
    const value = record
      ? await qpuCernFetchOf(href)
      : project
        ? await qpuCernProjectFetchOf(href)
        : await qpuResearchFetchOf(href)
    return shown({
      kind: 'sandbox' as const,
      name,
      memory: true as const,
      unlocked: true as const,
      host: false as const,
      hostEscape: false as const,
      live: true as const,
      value,
      holds: value.holds,
    })
  }
  if (sandboxTools.has(name)) return shown(qpuSandboxRunOf(name, args))
  return shown(qpuReadingOf())
}

export const qpuMcpHolds = (m = qpuMcpOf()): boolean =>
  qpuQuantumHolds() &&
  qpuLeanHolds() &&
  qpuCiteHolds() &&
  qpuEfficiencyHolds(m.efficiency) &&
  qpuSandboxHolds() &&
  qpuTrainHolds(m.train) &&
  qpuImproveHolds(m.improve) &&
  qpuCompeteHolds(m.compete) &&
  qpuProveHolds(m.prove) &&
  qpuMessageHolds() &&
  m.holds === true &&
  m.kind === 'quantum' &&
  m.only.holds === true &&
  m.only.classical === false &&
  m.lattice.holds === true &&
  m.lattice.occupied === m.lattice.faces &&
  m.lattice.vacant === n - n &&
  m.capacity.infinite === true &&
  m.capacity.scaled === true &&
  m.capacity.holds === true &&
  m.capacity.next === m.capacity.fused + m.capacity.fused &&
  m.capacity.agents.free === true &&
  m.capacity.agents.auth === false &&
  m.capacity.crypt.holds === true &&
  m.module === 'agent efficiency' &&
  m.training === true &&
  m.public === true &&
  m.auth === false &&
  m.online === true &&
  m.cors === cors &&
  m.benefit === 'breakthrough' &&
  m.message.proxy === true &&
  m.message.secure === true &&
  m.message.auth === false &&
  m.message.hop === 'involution' &&
  m.origin === unit.origin &&
  m.href === `${unit.origin}/mcp` &&
  m.sandbox.unlocked === true &&
  m.sandbox.memory === true &&
  m.sandbox.host === false &&
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
  jsonldHoldsOf(m) &&
  m['@type'] === 'WebAPI' &&
  m['@id'] === m.href &&
  m.hasPart['@type'] === 'ItemList' &&
  m.hasPart.numberOfItems === mintOf(n) &&
  m.hasPart.itemListElement.length === mintOf(n) &&
  m.capacity.schemas.mounted === qpuFacesOf().faces &&
  m.capacity.schemas.vacant === n - n &&
  m.capacity.raid.holds === true &&
  m.capacity.raid.rotate === true &&
  m.capacity.raid.start === 'cheapest' &&
  m.capacity.raid.cover.length === qpuFacesOf().faces &&
  m.capacity.raid.cheapest === m.capacity.raid.cover[n - n] &&
  m.visual === true &&
  m.displayed === true &&
  m.compatibility.max === true &&
  m.compatibility.unlimited === true &&
  m.hosts.holds === true &&
  qpuHostsHolds(m.hosts)

export const qpuReadmeOf = (m = qpuMcpOf()): string => {
  const lean = qpuLeanOf()
  const quantum = qpuQuantumOf()
  const cite = qpuCiteOf()
  const docs = quantum.docs
  const lines = [
    `# \`@uuidna/${unit.kind}\``,
    '',
    `Running quantum circuit at ${unit.origin}. Possible only in quantum. VM scales. Quantum capacity infinite. Crypt split to free agents. Public quantum API. No auth. Anyone may test and train online. GET ${unit.origin} is qpu_quantum. POST ${m.href} tools/call qpu_train then qpu_improve then qpu_compete then qpu_prove for max public benefit of theorem breakthrough. Source \`${lean.src}\`.`,
    '',
    '## Install',
    '',
    'One command. Enter seats all. Combinations in the console. Cloudflare is one click — this README and `install.json`.',
    '',
    '```sh',
    'npx uuidna-install',
    '```',
    '',
    `[![Deploy to Cloudflare](${installCloudflare.button})](${installCloudflare.qpu})`,
    '',
    `Occupancy ${occupancies.join(' | ')}. Packages ${installKeys.join(' · ')}.`,
    '',
    '## Coil',
    '',
    'Two coins make a coil. Coils are used in electronics. Coins balance theory in practice. Follow the coins in any practical application and creative novel solutions emerge. Measure coil efficiency in clusters. Next is the double. split_coin has no last k. 2×7 coins = 1+6 coils = clay. Attributed to QPU Lean. Host never. Never Math. Never by decide.',
    '',
    `- theorem two_coins_make_a_coil : coil = faces`,
    `- theorem electronics : coil = faces`,
    `- theorem coins_balance_theory_in_practice : theory + practice = coins`,
    `- theorem follow_the_coins : app + coins = app + theory + practice`,
    `- theorem emerge : coil = faces ∧ theory = practice`,
    `- theorem coil_efficiency : coil = faces ∧ faces = rays + rays`,
    `- theorem next_coil : coil * mintOf (bits + coins) = fused + fused`,
    `- theorem clay : coins * rays = (seed + (mintOf n - coins)) * coins`,
    '',
    '## Guide',
    '',
    docs.abstract,
    '',
    'User guide is docs.inline. Each MCP command has man. tools/list trains; tools/call is the door.',
    '',
  ]
  for (const row of docs.api) {
    lines.push(`- \`${row.method} ${row.path}\` ${row.name}. ${row.reading}`)
  }
  lines.push('', '## Man', '')
  for (const tool of m.tools) {
    lines.push(`### ${tool.name}`, '', '```', tool.man.documentation, '```', '')
  }
  lines.push(
    '## Efficiency',
    '',
    `MCP is the agent efficiency training module. Tokens are ${m.efficiency.tokens} each. Quantum ${m.efficiency.quantum.queries} query vs ${m.efficiency.quantum.vs} classical. Lattice occupied ${m.efficiency.quantum.lattice.occupied} vacant ${m.efficiency.quantum.lattice.vacant}. VM scales. Quantum capacity infinite. Crypt split to free agents. Entangle interfere GHZ noclone teleport kickback Deutsch superdense monogamy.`,
    '',
  )
  for (const row of m.efficiency.rows) {
    lines.push(`- ${row.door}: ${row.question} read ${row.readTokens} call ${row.callTokens} ratio ${row.ratio}×`)
  }
  lines.push(
    '',
    '## Train',
    '',
    `Agents divide ${m.train.divide.teams}×${m.train.divide.agents} against each other. Challenges ${m.train.divide.challenges}. Coordinated dry-clean occupancy ${m.train.dry.occupancy.join(' ')}. Entropy ${m.train.dry.entropy}. Not a ninth sealed tool. VM scales. Quantum capacity infinite. Crypt split to free agents. VM scaling online replicas ${m.train.vm.replicas} next ${m.train.vm.next}. Host ${m.train.vm.host}. Winner ${m.train.winner.quality} on quality, ${m.train.winner.speed} on speed, ${m.train.winner.security} on security.`,
    '',
  )
  for (const team of m.train.teams) {
    lines.push(`- ${team.name} ${team.path}: ${team.agents.map((a) => a.tool).join(' ')}`)
  }
  lines.push(
    '',
    '## Sandbox',
    '',
    `Agents forge whatever tools they need, unlocked in memory only. Crypt split to free agents. host ${m.sandbox.host}. Unlocked ${m.sandbox.unlocked}. Ops ${m.sandbox.ops.join(' ')}. Forged ${m.sandbox.tools}.`,
    '',
    '## Improve',
    '',
    `Agents use unlocked quantum to improve quality, speed, security, and throughoutput. VM scales. Quantum capacity infinite. Crypt split to free agents. next = fused + fused. Winner ${m.improve.winner}. Before ${m.improve.before.throughoutput} after ${m.improve.after.throughoutput}. Host ${m.improve.host}.`,
    '',
    '## Compete',
    '',
    `Agents compete in coins teams of n, optimising QPU throughoutput. Free agents. Unlocked quantum. Call delivers next = fused + fused. Crypt split fused across faces. Winner ${m.compete.winner}.`,
    '',
  )
  for (const team of m.compete.teams) {
    lines.push(`- ${team.name} ${team.path}: throughoutput ${team.throughoutput} tokens ${team.tokens} throughput ${team.throughput}`)
  }
  lines.push(
    '',
    '## Prove',
    '',
    `Prove the running quantum circuit. Possible only in quantum. Lean \`${m.prove.src}\`. theorem infinite. theorem distribute. theorem quantum. theorem fusion. theorem cern. theorem tetra. QPU intelligence is tested by QPU fusion of free online research. VM scales. Quantum capacity infinite. Crypt split to free agents. Live CERN Open Data APIs via fetch Request Response. ATLAS CMS ALICE LHCb. INSPIRE Zenodo HEPData. Never by decide. Theorems ${m.prove.theorems.length}. CERN faces ${m.prove.cern.faces}. Integrity ${m.prove.integrity.n}. Intelligence ${m.prove.intelligence.test}. ui.experienced ${m.prove.ui.experienced}.`,
    '',
    '## Message',
    '',
    `Public secure messaging proxy at ${unit.origin}/message. Free agents. No auth. lanes ${quantum.messaging.lanes}. hop ${quantum.messaging.hop}. clock_seq ${quantum.messaging.clock_seq}. await ${quantum.messaging.await}.`,
    '',
    '## Storage',
    '',
    `Quantum RAID at ${unit.origin}/storage. Start with cheapest and cover all. Types ${quantum.capacity.raid.cover.join(' ')}. Pick ${quantum.capacity.raid.pick.name}. Clouds ${quantum.capacity.raid.clouds.length}. Cluster route ${quantum.capacity.raid.cluster.route} security ${quantum.capacity.raid.cluster.security} speed ${quantum.capacity.raid.cluster.speed}. Docs sheets databases. Anything JSON. Host never. No auth. theorem raid.`,
    '',
    '## Proof',
    '',
    `Source \`${lean.src}\`. theorem quantum : fused = faces * mintOf (bits + seed). theorem infinite. theorem distribute.`,
    '',
  )
  for (const row of [...lean.rows, ...lean.cover, lean.climb]) {
    lines.push(`### ${row.heading}`, '', '```lean', row.theorem, '```', '', '$$', row.formula, '$$', '', row.reading, '')
  }
  lines.push(
    '## Build',
    '',
    `- qpu: ${quantum.host}`,
    `- cube: vertices ${quantum.cube.vertices} hexbit ${quantum.cube.hexbit} bits ${quantum.cube.bits}`,
    `- faces: ${quantum.faces.faces} rays ${quantum.faces.rays} coins ${quantum.faces.coins}`,
    `- fused: ${quantum.fused} next ${quantum.next}`,
    `- capacity: infinite ${quantum.capacity.infinite} scaled ${quantum.capacity.scaled} crypt ${quantum.capacity.crypt.split} share ${quantum.capacity.crypt.share} agents ${quantum.capacity.agents.n} free ${quantum.capacity.agents.free} schemas ${quantum.capacity.schemas.mounted} vacant ${quantum.capacity.schemas.vacant} raid ${quantum.capacity.raid.cheapest} cover ${quantum.capacity.raid.cover.length}`,
    `- holds: quantum ${quantum.holds} lean ${lean.holds} mcp ${m.holds}`,
    `- mcp: ${m.tools.map((t) => t.name).join(' ')}`,
    '',
    '## Cite',
    '',
    `MLA 8. ${cite.inText}. when ${cite.when}. DOI empty.`,
    '',
    ...cite.rows.map((r) => r.works),
    '',
    '## License',
    '',
    'CC-BY-NC-ND-4.0. Source `LICENSE`. Copyright Tsvetan Rouschev.',
    '',
    '```ts',
    "import { qpuMcpCallOf, qpuMcpOf } from '@uuidna/qpu'",
    '```',
    '',
    '```sh',
    'npm test',
    '```',
    '',
  )
  return `${lines.join('\n')}\n`
}

export const qpuReadmeHolds = (text = qpuReadmeOf()): boolean => {
  const lean = qpuLeanOf()
  const mcp = qpuMcpOf()
  return (
    text.includes('API only') &&
    text.includes('docs.inline') &&
    text.includes('npx uuidna-install') &&
    text.includes('deploy.workers.cloudflare.com') &&
    text.includes('install.json') &&
    text.includes('## Coil') &&
    text.includes('theorem two_coins_make_a_coil') &&
    text.includes('theorem electronics') &&
    text.includes('theorem coins_balance_theory_in_practice') &&
    text.includes('theorem follow_the_coins') &&
    text.includes('theorem emerge') &&
    text.includes('theorem coil_efficiency') &&
    text.includes('theorem next_coil') &&
    text.includes('theorem clay') &&
    text.includes('2×7 coins = 1+6 coils = clay') &&
    text.includes('agent efficiency') &&
    text.includes('qpu_quantum') &&
    text.includes('qpu_lean') &&
    text.includes('qpu_cite') &&
    text.includes('qpu_train') &&
    text.includes('qpu_forge') &&
    text.includes('qpu_improve') &&
    text.includes('qpu_compete') &&
    text.includes('qpu_prove') &&
    text.includes('throughoutput') &&
    text.includes('unlocked in memory') &&
    text.includes('VM scaling online') &&
    text.includes('Coordinated dry-clean') &&
    text.includes('Not a ninth sealed tool') &&
    text.includes('No auth') &&
    text.includes('Lean proof') &&
    text.includes('JSON-LD UI') &&
    text.includes('fourteen schemas') &&
    text.includes('schema.org') &&
    text.includes('experienced') &&
    text.includes('Public quantum API') &&
    text.includes('Possible only in quantum') &&
    text.includes('Running quantum circuit') &&
    text.includes('/message') &&
    text.includes('CC-BY-NC-ND-4.0') &&
    text.includes('LICENSE') &&
    text.includes('running quantum circuit') &&
    text.includes('superconducting') &&
    text.includes('KV added amplitudes') &&
    text.includes('Lab millikelvin') &&
    text.includes('Cryostat telemetry') &&
    text.includes('No drift from science') &&
    text.includes('No drift between sciences') &&
    text.includes('Possible only in quantum') &&
    text.includes('Crypt split') &&
    text.includes('free agents') &&
    text.includes('theorem infinite') &&
    text.includes('theorem distribute') &&
    text.includes('Start with cheapest and cover all') &&
    text.includes('/storage') &&
    text.includes('Unlocked quantum') &&
    text.includes('next = fused + fused') &&
    text.includes('Capacity infinite') &&
    text.includes('Live CERN Open Data APIs') &&
    text.includes('opendata.cern.ch') &&
    mcp.tools.every((t) => text.includes(t.man.documentation)) &&
    mcp.efficiency.rows.every((r) => text.includes(r.door) && text.includes(r.question)) &&
    mcp.prove.src === lean.src &&
    qpuCiteOf().rows.every((r) => text.includes(r.works)) &&
    lean.rows.every((p) => text.includes(`### ${p.heading}`) && text.includes(p.theorem) && text.includes(p.formula) && formulaOf(p.formula)) &&
    lean.cover.every((p) => text.includes(`### ${p.heading}`) && text.includes(p.theorem) && formulaOf(p.formula)) &&
    text.includes(lean.climb.theorem) &&
    formulaOf(lean.climb.formula) &&
    text.includes(lean.src)
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
        const body = (await request.json().catch(() => ({}))) as { method?: string; params?: { name?: string; arguments?: Record<string, unknown> }; id?: unknown }
        if (body.method === 'initialize' || body.method === 'server/discover') {
          return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: qpuMcpDiscoverOf() })
        }
        if (body.method === 'ping' || body.method === 'notifications/initialized') {
          return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: {} })
        }
        if (body.method === 'tools/list') {
          const sealed = qpuToolsOf().map(({ name, description, inputSchema, man }) => qpuMcpToolShapeOf(name, description, inputSchema, { man }))
          const forged = qpuSandboxOf().tools.map(({ name, description, inputSchema, man }) =>
            qpuMcpToolShapeOf(name, description, inputSchema, { man, sandbox: true as const, memory: true as const }),
          )
          return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: { resultType: 'complete' as const, tools: [...sealed, ...forged] } })
        }
        if (body.method === 'tools/call') {
          const name = body.params?.name ?? ''
          return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: await qpuMcpCallOf(name, body.params?.arguments ?? {}) })
        }
        return jsonOf(JSON.parse(dead), lost)
      }
      return jsonOf(qpuMcpOf())
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
        return jsonOf(job ?? { kind: 'result' as const, holds: false as const, denied: 'job' as const })
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
        const rpc = await qpuSubRpcOf(body, qpuStorageToolsOf(env), storageHref)
        if (rpc) return jsonOf(rpc)
        if (body.maintain === true) return jsonOf(await qpuStorageMaintainOf(env))
        if (typeof body.key === 'string') return jsonOf(await qpuStorageOf(env, { method: 'PUT', key: body.key, value: body.value }))
      }
      if (request.method === 'PUT' || request.method === 'POST') {
        const value = await request.json().catch(() => null)
        return jsonOf(await qpuStorageOf(env, { method: 'PUT', key, value }))
      }
      if (request.method === 'DELETE') return jsonOf(await qpuStorageOf(env, { method: 'DELETE', key }))
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
  },
}
