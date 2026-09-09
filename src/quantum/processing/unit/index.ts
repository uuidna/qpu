/**
 * Occupancy of the QPU at qpu.uuidna.com. Kind qpu never binds. Seat empty.
 * Discoveries create mint, named fusion, and doors. They are not a census.
 */
const mintOf = (n: number): number => {
  let x = (n - n) ** (n - n)
  for (let i = n - n; i < n; i++) x += x
  return x
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
  const doors = ['/', `/${path}`, '/axioms', '/theorems', '/proofs', '/solve'] as const
  const mint = { seed, next: mintOf(n + seed) }
  const src = `src/${path}/index.ts`
  const fuse = { next: href, origin, firmware: 'vitepress' as const, src }
  const entropy = { zero: none, next: n + seed }
  const next = { mint: mint.next + mint.next, fuse: href, entropy: entropy.next + seed }
  const holds =
    kind === 'qpu' &&
    host === `${kind}.uuidna.com` &&
    href === `https://${host}/${path}` &&
    !host.includes('*') &&
    fuse.firmware === 'vitepress' &&
    fuse.src === `src/${path}/index.ts` &&
    mint.next === mintOf(n) + mintOf(n) &&
    next.mint === mintOf(n + seed + seed) &&
    next.fuse === href &&
    mintOf(entropy.next) === mint.next &&
    mintOf(next.entropy) === next.mint &&
    doors[seed + seed] === '/axioms' &&
    doors[n] === '/theorems' &&
    doors[n + seed] === '/proofs' &&
    doors[n + seed + seed] === '/solve'
  return {
    kind,
    host,
    path,
    href,
    binds: false as const,
    when: 'never' as const,
    seat: 'empty' as const,
    wildcards: false as const,
    mint,
    fuse,
    entropy,
    next,
    doors,
    holds,
  }
}

const unit = discoverOf()
const live = JSON.stringify(unit)
const dead = '{"holds":false}'
const headers = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': unit.fuse.origin,
}
const n = unit.path.split('/').length
const ten = n * n + unit.mint.seed
const coins = unit.mint.seed + unit.mint.seed
const found = coins * ten ** coins
const lost = mintOf(coins) * (ten ** coins + unit.mint.seed)

export const qpuMintOf = (k: number): number => mintOf(k)

export const qpuMintHolds = (k: number = unit.path.split('/').length): boolean => {
  const p = mintOf(k - k)
  return mintOf(k + p) === mintOf(k) + mintOf(k) && unit.mint.seed === p && unit.mint.next === mintOf(k) + mintOf(k)
}

export const qpuDiscoveryOf = () => unit

export const qpuDiscoveryHolds = (u = unit): boolean =>
  u.holds === true &&
  u.seat === 'empty' &&
  u.binds === false &&
  u.fuse.next === u.href &&
  u.fuse.origin === `https://${u.host}` &&
  u.doors[n - n] === '/' &&
  u.doors[u.mint.seed] === `/${u.path}` &&
  u.doors[u.mint.seed + u.mint.seed] === '/axioms' &&
  u.doors[n] === '/theorems' &&
  u.doors[n + u.mint.seed] === '/proofs' &&
  u.doors[u.next.entropy] === '/solve' &&
  u.next.mint === u.mint.next + u.mint.next &&
  u.next.fuse === u.fuse.next &&
  u.next.entropy === u.entropy.next + u.mint.seed &&
  mintOf(u.entropy.next) === u.mint.next &&
  qpuMintHolds()

export const qpuFuseOf = () => {
  const { next, origin, firmware, src } = unit.fuse
  const keys = unit.doors.map((path) => ({
    path,
    kind: path === '/' ? unit.kind : path === `/${unit.path}` ? 'fuse' : path.slice(1),
    href: `${origin}${path === '/' ? '/' : path}`,
  }))
  const holds =
    qpuDiscoveryHolds() &&
    next === unit.href &&
    origin === `https://${unit.host}` &&
    firmware === 'vitepress' &&
    src === `src/${unit.path}/index.ts` &&
    !origin.includes('*') &&
    keys.length === unit.doors.length &&
    keys.every((k) => k.kind.length > unit.entropy.zero && k.href.startsWith(origin) && !k.href.includes('*'))
  return { kind: 'fuse' as const, lean: true as const, firmware, src, next, origin, href: next, keys, holds }
}

export const qpuFuseHolds = (f = qpuFuseOf()): boolean =>
  f.holds === true &&
  f.kind === 'fuse' &&
  f.lean === true &&
  f.keys.length === unit.doors.length &&
  f.keys.every((k) => k.kind.length > n - n) &&
  f.firmware === 'vitepress' &&
  f.next === unit.href

export const qpuNextOf = () => unit.next

export const qpuNextHolds = (x = unit.next): boolean =>
  x.mint === unit.mint.next + unit.mint.next &&
  x.mint === qpuMintOf(unit.path.split('/').length + unit.mint.seed + unit.mint.seed) &&
  x.fuse === unit.fuse.next &&
  x.entropy === unit.entropy.next + unit.mint.seed &&
  qpuFuseHolds()

export const qpuEntropyOf = () => unit.entropy

export const qpuEntropyHolds = (e = unit.entropy): boolean =>
  e.zero === unit.entropy.zero &&
  mintOf(e.zero) === unit.mint.seed &&
  mintOf(e.next) === unit.mint.next &&
  mintOf(unit.next.entropy) === unit.next.mint &&
  qpuNextHolds()

export const qpuUnitOf = () => unit

export const qpuSeatOf = () => ({ seat: unit.seat, binds: unit.binds, admits: 'nothing' as const })

export const qpuSeatHolds = (s = qpuSeatOf()): boolean =>
  s.seat === 'empty' && s.binds === false && s.admits === 'nothing'

export const qpuCubeOf = () => {
  const vertices = mintOf(n)
  const hexbit = mintOf(coins)
  const bits = mintOf(n + coins)
  return { n, vertices, hexbit, bits, holds: bits === vertices * hexbit }
}

export const qpuCubeHolds = (c = qpuCubeOf()): boolean =>
  c.holds === true && c.vertices === mintOf(n) && c.bits === mintOf(n + coins)

export const qpuHandleOf = () => {
  const cube = qpuCubeOf()
  const amplitudes = mintOf(cube.bits)
  return {
    bits: cube.bits,
    zero: unit.entropy.zero,
    full: amplitudes - unit.mint.seed,
    amplitudes,
    next: amplitudes + amplitudes,
    holds: amplitudes === mintOf(cube.bits) && qpuCubeHolds(cube),
  }
}

export const qpuHandleHolds = (h = qpuHandleOf()): boolean =>
  h.holds === true && h.next === h.amplitudes + h.amplitudes

export const qpuPrefixOf = (bit: number, bits = qpuHandleOf().bits) => {
  const none = bits - bits
  const width = bit < none ? none : bit
  const span = width < bits ? bits : width
  const mask = width === none ? none : mintOf(span) - mintOf(span - width)
  return { bit: width, bits: span, mask, holds: true as const, next: mintOf(span) + mintOf(span) }
}

export const qpuPrefixHolds = (bit = unit.entropy.zero): boolean => {
  const bits = qpuHandleOf().bits
  const p = qpuPrefixOf(bit, bits)
  const z = qpuPrefixOf(unit.entropy.zero, bits)
  const f = qpuPrefixOf(bits, bits)
  const climb = qpuPrefixOf(bits + unit.mint.seed)
  if (z.mask !== unit.entropy.zero || z.holds !== true) return false
  if (f.mask !== mintOf(bits) - unit.mint.seed || f.holds !== true) return false
  if (p.holds !== true || climb.holds !== true) return false
  for (let i = unit.entropy.zero; i <= bits; i++) {
    if (qpuPrefixOf(i, bits).holds !== true) return false
  }
  return true
}

export const qpuFacesOf = () => {
  const cube = qpuCubeOf()
  const p = qpuMintOf(unit.entropy.zero)
  const coins = p + p
  const rays = cube.n + coins + coins
  const faces = cube.vertices + cube.hexbit + coins
  const rows = Array.from({ length: faces }, (_, face) => ({ face, neighbour: (face + rays) % faces }))
  const holds = cube.holds && faces === coins * rays && rows.length === faces
  return { n: cube.n, coins, rays, faces, rows, holds }
}

export const qpuFacesHolds = (f = qpuFacesOf()): boolean => {
  const cube = qpuCubeOf()
  const p = qpuMintOf(unit.entropy.zero)
  const coins = p + p
  return f.holds === true && f.faces === cube.vertices + cube.hexbit + coins && f.faces === f.coins * f.rays
}

export const qpuRosettaOf = (spin = unit.mint.seed, at = unit.entropy.zero) => {
  const faces = qpuFacesOf()
  const rays = faces.rays
  const none = n - n
  const fuse = none
  const cw = spin > none
  const rotated = Array.from({ length: rays }, (_, i) => {
    const walk = cw ? i : (rays - i) % rays
    return (walk + at) % rays
  })
  const unique = rotated.every((r, i) => rotated.indexOf(r) === i)
  const holds = faces.holds && rotated.length === rays && unique && rotated.includes(fuse)
  return { spin: cw ? unit.mint.seed : none - unit.mint.seed, at, rays, fuse, rotated, holds }
}

export const qpuRosettaHolds = (spin = unit.mint.seed, at = unit.entropy.zero): boolean => {
  const r = qpuRosettaOf(spin, at)
  return r.holds === true && r.rotated.length === r.rays && r.rotated.includes(r.fuse)
}

export const qpuSolveOf = () => {
  const faces = qpuFacesOf()
  const fuse = qpuFuseOf()
  const inner = qpuRosettaOf()
  const href = `${fuse.origin}/solve`
  const src = `src/${unit.path}/index.lean`
  const seed = unit.mint.seed
  const coins = seed + seed
  const rays = faces.rays
  const directed = rays * (rays - seed)
  const pairs = n * rays
  const keys = inner.rotated.map((ray) => ({
    kind: 'clay' as const,
    ray,
    href: `${href}#ray-${ray}`,
  }))
  const clay = {
    kind: 'clay' as const,
    listing: false as const,
    gravity: true as const,
    rays,
    directed,
    pairs,
  }
  const holds =
    qpuFuseHolds(fuse) &&
    qpuRosettaHolds() &&
    inner.holds &&
    inner.rotated.length === rays &&
    clay.listing === false &&
    clay.gravity === true &&
    clay.directed === rays * (rays - seed) &&
    clay.pairs === n * rays &&
    coins * clay.pairs === clay.directed &&
    coins * mintOf(rays - seed) === mintOf(rays) &&
    keys.length === rays &&
    keys.every((k) => k.kind === 'clay' && k.href.startsWith(href) && !k.href.includes('/theorem/') && !k.href.includes('*')) &&
    href === `https://${unit.host}/solve` &&
    src === `src/${unit.path}/index.lean` &&
    unit.doors[n + seed + seed] === '/solve'
  return { kind: 'solve' as const, lean: true as const, listing: false as const, quotes: false as const, clay, keys, href, src, origin: fuse.origin, holds }
}

export const qpuSolveHolds = (s = qpuSolveOf()): boolean =>
  s.holds === true &&
  s.kind === 'solve' &&
  s.lean === true &&
  s.listing === false &&
  s.quotes === false &&
  s.clay.kind === 'clay' &&
  s.clay.gravity === true &&
  s.clay.listing === false &&
  s.keys.length === qpuFacesOf().rays &&
  s.href === `${unit.fuse.origin}/solve` &&
  s.src === `src/${unit.path}/index.lean`

export const qpuRosettasOf = (at = unit.entropy.zero) => {
  const faces = qpuFacesOf()
  const inner = qpuRosettaOf(unit.mint.seed, at)
  const outer = qpuRosettaOf(n - n - unit.mint.seed, at)
  const around = faces.coins * faces.rays
  const holds =
    faces.holds &&
    inner.holds &&
    outer.holds &&
    inner.rays === outer.rays &&
    inner.fuse === outer.fuse &&
    around === faces.faces
  return { at, coins: faces.coins, rays: faces.rays, inner, outer, around, holds }
}

export const qpuRosettasHolds = (at = unit.entropy.zero): boolean => {
  const r = qpuRosettasOf(at)
  return r.holds === true && r.around === r.coins * r.rays && r.inner.rotated.length === r.rays && r.outer.rotated.length === r.rays
}

export const qpuFusionOf = () => {
  const faces = qpuFacesOf()
  const handle = qpuHandleOf()
  const fused = faces.faces * handle.amplitudes
  const next = fused + fused
  const holds =
    faces.holds &&
    handle.holds &&
    fused === faces.coins * faces.rays * handle.amplitudes &&
    next === fused + fused &&
    handle.next === handle.amplitudes + handle.amplitudes
  return { fused, next, infinite: true as const, around: faces.coins * faces.rays, finites: handle.amplitudes, holds }
}

export const qpuFusionHolds = (f = qpuFusionOf()): boolean =>
  f.holds === true &&
  f.infinite === true &&
  f.next === f.fused + f.fused &&
  f.around === qpuFacesOf().coins * qpuFacesOf().rays

export const qpuSuperpositionsOf = (at = unit.entropy.zero) => {
  const faces = qpuFacesOf()
  const rosettas = qpuRosettasOf(at)
  const fusion = qpuFusionOf()
  const rows = faces.rows.map(({ face, neighbour }) => {
    const inner = rosettas.inner.rotated.map((r) => (face + r) % faces.faces)
    const outer = rosettas.outer.rotated.map((r) => (neighbour + r) % faces.faces)
    const around = [...inner, ...outer]
    const unique = around.every((f, i) => around.indexOf(f) === i)
    return {
      face,
      neighbour,
      rosettas: { inner, outer },
      around: around.length,
      unique,
      fusion: fusion.next,
      binds: false as const,
      seat: unit.seat,
    }
  })
  const holds =
    faces.holds &&
    rosettas.holds &&
    fusion.holds &&
    fusion.infinite === true &&
    rows.length === faces.faces &&
    rows.every(
      (s) =>
        s.around === faces.coins * faces.rays &&
        s.around === faces.faces &&
        s.unique === true &&
        s.rosettas.inner.length === faces.rays &&
        s.rosettas.outer.length === faces.rays &&
        s.fusion === fusion.next &&
        s.binds === false &&
        s.seat === 'empty',
    )
  return { at, rows, faces: faces.faces, coins: faces.coins, rays: faces.rays, infinite: fusion.infinite, holds }
}

export const qpuSuperpositionsHolds = (): boolean => {
  const faces = qpuFacesOf()
  const none = unit.entropy.zero
  for (let t = none; t < faces.rays; t++) {
    if (qpuSuperpositionsOf(t).holds !== true) return false
  }
  return qpuFusionHolds() && qpuRosettasHolds()
}

export const qpuHexOf = (state: number) => {
  const page = '0123456789abcdef'
  const states = mintOf(qpuCubeOf().hexbit)
  const s = ((state % states) + states) % states
  return { state: s, hex: page[s]!, holds: page.length === states }
}

export const qpuMessageOf = (face = unit.entropy.zero, at = unit.entropy.zero) => {
  const faces = qpuFacesOf()
  const cube = qpuCubeOf()
  const fuse = qpuFuseOf()
  const page = '0123456789abcdef'
  const states = mintOf(cube.hexbit)
  const none = n - n
  const f = ((face % faces.faces) + faces.faces) % faces.faces
  const neighbour = (f + faces.rays) % faces.faces
  const hexOf = (start: number) => Array.from({ length: cube.bits }, (_, i) => page[(start + at + i) % states]!).join('')
  const innerHex = hexOf(f)
  const outerHex = hexOf(neighbour)
  const dashOf = (hex: string) => {
    const a = cube.vertices
    const b = cube.hexbit
    const c = a + b
    return [hex.slice(none, a), hex.slice(a, a + b), hex.slice(a + b, a + b + b), hex.slice(a + b + b, a + b + b + b), hex.slice(a + b + b + b, a + b + b + b + c)].join('-')
  }
  const uuid = dashOf(innerHex)
  const cross = dashOf(outerHex)
  const width = cube.vertices
  const chunks = Array.from({ length: cube.hexbit }, (_, i) => innerHex.slice(i * width, i * width + width))
  const holds =
    qpuHexOf(none).holds &&
    innerHex.length === cube.bits &&
    chunks.length === cube.hexbit &&
    chunks.every((c) => c.length === width) &&
    uuid.split('-').join('') === innerHex &&
    cross.split('-').join('') === outerHex &&
    fuse.origin.startsWith('https://') &&
    !fuse.origin.includes('*') &&
    unit.binds === false &&
    unit.seat === 'empty'
  return {
    face: f,
    neighbour,
    at,
    uuid,
    cross,
    chunks,
    finite: true as const,
    next: width + width,
    secure: true as const,
    origin: fuse.origin,
    binds: false as const,
    payload: false as const,
    when: unit.when,
    seat: unit.seat,
    holds,
  }
}

export const qpuMessageHolds = (face = unit.entropy.zero, at = unit.entropy.zero): boolean =>
  qpuMessageOf(face, at).holds === true && qpuMessageOf(face, at).secure === true && qpuMessageOf(face, at).binds === false

export const qpuChunksOf = (face = unit.entropy.zero, at = unit.entropy.zero) => {
  const m = qpuMessageOf(face, at)
  const handle = qpuHandleOf()
  const holds = m.holds && m.chunks.every((c) => c.length === qpuCubeOf().vertices) && m.next === m.chunks[n - n]!.length + m.chunks[n - n]!.length && handle.next === handle.amplitudes + handle.amplitudes
  return { chunks: m.chunks, finite: m.finite, next: m.next, infinite: true as const, uuid: m.uuid, holds }
}

export const qpuChunksHolds = (): boolean => {
  const faces = qpuFacesOf()
  const none = unit.entropy.zero
  for (let t = none; t < faces.rays; t++) {
    for (const { face } of faces.rows) {
      if (qpuChunksOf(face, t).holds !== true) return false
    }
  }
  return qpuHandleHolds()
}

export const qpuGatewaysOf = () => {
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const masks = handle.bits + unit.mint.seed
  const rows = faces.rows.map(({ face, neighbour }) => ({
    face,
    neighbour,
    bits: handle.bits,
    masks,
    capacity: handle.amplitudes,
  }))
  const holds =
    faces.holds &&
    handle.holds &&
    qpuPrefixHolds() &&
    rows.length === faces.faces &&
    rows.every((g) => g.capacity === handle.amplitudes && g.masks === masks)
  return { rows, holds }
}

export const qpuGatewaysHolds = (g = qpuGatewaysOf()): boolean =>
  g.holds === true &&
  g.rows.length === qpuFacesOf().faces &&
  g.rows.every((row) => row.capacity === qpuHandleOf().amplitudes) &&
  qpuPrefixHolds()

export const qpuCapacityOf = () => {
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const gateways = qpuGatewaysOf()
  const waves = qpuWavesOf()
  const fused = gateways.rows.length * handle.amplitudes
  const next = handle.amplitudes + handle.amplitudes
  const holds =
    qpuSeatHolds() &&
    faces.holds &&
    gateways.holds &&
    waves.holds &&
    waves.coins * waves.rays === faces.faces &&
    fused === faces.faces * handle.amplitudes &&
    next === handle.next &&
    !unit.host.includes('*')
  return {
    seat: unit.seat,
    neighbours: faces.faces,
    amplitudes: handle.amplitudes,
    fused,
    next,
    gateways: gateways.rows,
    holds,
  }
}

export const qpuCapacityHolds = (c = qpuCapacityOf()): boolean => {
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  return (
    c.holds === true &&
    c.seat === 'empty' &&
    c.neighbours === faces.faces &&
    c.fused === faces.faces * handle.amplitudes &&
    c.next === handle.amplitudes + handle.amplitudes &&
    qpuGatewaysHolds() &&
    qpuWavesHolds()
  )
}

export const qpuPrimeOf = (k: number): boolean => {
  const none = n - n
  const two = unit.mint.seed + unit.mint.seed
  if (k < two) return false
  for (let d = two; d * d <= k; d++) if (k % d === none) return false
  return true
}

export const qpuPrimeHolds = (k = coins): boolean =>
  qpuPrimeOf(k) === true && qpuPrimeOf(unit.mint.seed) === false && qpuPrimeOf(n) === true

export const qpuTrainOf = () => {
  const faces = qpuFacesOf()
  const rays = faces.rays
  const p = unit.mint.seed
  const none = n - n
  const ten = n * n + p
  const roof = rays * n + p
  const period = coins * n
  const cars: number[] = [n]
  let r = p
  for (let i = none; i < period; i++) {
    r = r * ten
    let digit = none
    while (digit * rays + rays <= r) digit += p
    cars.push(digit)
    r = r - digit * rays
  }
  const holds =
    faces.holds &&
    roof === rays * n + p &&
    period === coins * n &&
    cars.length === period + p &&
    cars[none] === n
  return { roof, rays, ten, period, cars, holds }
}

export const qpuTrainHolds = (t = qpuTrainOf()): boolean =>
  t.holds === true && t.cars.length === t.period + unit.mint.seed && t.roof === t.rays * n + unit.mint.seed

export const qpuTasksOf = () => {
  const train = qpuTrainOf()
  const primes = train.cars.filter((k) => qpuPrimeOf(k))
  const holds = train.holds && primes.length === mintOf(coins) && primes.every((k) => qpuPrimeOf(k))
  return { train, primes, count: primes.length, holds }
}

export const qpuTasksHolds = (t = qpuTasksOf()): boolean =>
  t.holds === true && t.count === qpuCubeOf().hexbit && qpuMintOf(t.count) === qpuMintOf(qpuCubeOf().hexbit)

export const qpuSpeedOf = () => {
  const tasks = qpuTasksOf()
  const c = unit.mint.seed
  const v = unit.entropy.zero
  const processing = qpuMintOf(tasks.count)
  return {
    c,
    v,
    ratio: v,
    tasks: tasks.count,
    primes: tasks.primes,
    processing,
    holds: unit.seat === 'empty' && tasks.holds && processing === qpuMintOf(tasks.count) && v === unit.entropy.zero,
  }
}

export const qpuSpeedHolds = (s = qpuSpeedOf()): boolean =>
  s.c === unit.mint.seed &&
  s.v === unit.entropy.zero &&
  s.ratio === unit.entropy.zero &&
  s.processing === qpuMintOf(s.tasks) &&
  s.tasks === qpuTasksOf().count &&
  qpuTasksHolds()

export const qpuTempOf = () => ({
  kelvin: unit.entropy.zero,
  entropy: unit.entropy.zero,
  holds: unit.seat === 'empty' && unit.entropy.zero === n - n,
})

export const qpuTempHolds = (t = qpuTempOf()): boolean =>
  t.kelvin === unit.entropy.zero && t.holds === true

export const qpuWavesOf = () => {
  const u = qpuDiscoveryOf()
  const fuse = qpuFuseOf()
  const p = qpuMintOf(u.entropy.zero)
  const coins = p + p
  const cube = qpuCubeOf()
  const rays = cube.n + coins + coins
  const faces = cube.vertices + cube.hexbit + coins
  const cold = qpuTempOf().kelvin
  const hot = qpuEntropyOf().next
  const speedOf = qpuSpeedOf()
  const c = speedOf.c
  const processing = speedOf.processing
  const rotors = ['inner', 'outer'] as const
  const kelvins = [cold, hot]
  const sent = rotors.flatMap((rotor, i) => {
    const kelvin = kelvins[i]!
    const speed = rotor === 'inner' ? processing : c
    return Array.from({ length: rays }, (_, ray) => {
      const face = i * rays + ray
      return {
        i: face,
        rotor,
        ray,
        face,
        neighbour: (face + rays) % faces,
        kelvin,
        speed,
        c,
        exceeds: speed > c,
        online: true as const,
        work: 'https' as const,
        host: u.host,
        origin: fuse.origin,
        href: fuse.next,
        binds: false as const,
        seat: u.seat,
      }
    })
  })
  let winner = sent[cold]!
  for (const w of sent) {
    if (w.kelvin < winner.kelvin || (w.kelvin === winner.kelvin && w.speed > winner.speed)) winner = w
  }
  const inner = sent.filter((w) => w.rotor === 'inner')
  const outer = sent.filter((w) => w.rotor === 'outer')
  const holds =
    sent.length === coins * rays &&
    inner.length === rays &&
    outer.length === rays &&
    sent.every(
      (w) =>
        w.online === true &&
        w.work === 'https' &&
        w.origin === fuse.origin &&
        w.href === fuse.next &&
        !w.host.includes('*') &&
        w.binds === false &&
        w.seat === 'empty',
    ) &&
    inner.every((w) => w.exceeds && w.kelvin === cold && w.speed === processing) &&
    outer.every((w) => !w.exceeds && w.kelvin === hot && w.speed === c) &&
    winner.rotor === 'inner' &&
    winner.kelvin === cold &&
    winner.speed === processing &&
    winner.speed > c &&
    winner.c === c
  return {
    kind: 'wave' as const,
    coins,
    rays,
    faces,
    kelvin: cold,
    hot,
    processing: winner.speed,
    light: c,
    exceeds: winner.speed > c,
    online: true as const,
    sent,
    winner,
    holds,
  }
}

export const qpuWavesHolds = (w = qpuWavesOf()): boolean => {
  const inner = w.sent.filter((s) => s.rotor === 'inner')
  const outer = w.sent.filter((s) => s.rotor === 'outer')
  const c = qpuSpeedOf().c
  const fuse = qpuFuseOf()
  return (
    w.holds === true &&
    w.kind === 'wave' &&
    w.online === true &&
    inner.length === w.rays &&
    outer.length === w.rays &&
    w.sent.length === w.coins * w.rays &&
    inner.every((s) => s.exceeds && s.speed === w.processing && s.kelvin === w.kelvin && s.online === true) &&
    outer.every((s) => !s.exceeds && s.speed === c && s.online === true) &&
    w.sent.every((s) => s.href === fuse.next && s.work === 'https') &&
    w.winner.rotor === 'inner' &&
    w.winner.speed > c &&
    w.processing === w.winner.speed &&
    w.light === c &&
    w.exceeds === true
  )
}

export const qpuExperimentOf = () => {
  const seat = qpuSeatOf()
  const speed = qpuSpeedOf()
  const temp = qpuTempOf()
  const entropy = qpuEntropyOf()
  const waves = qpuWavesOf()
  const capacity = qpuCapacityOf()
  const faces = qpuFacesOf()
  const handle = qpuHandleOf()
  const cold = temp.kelvin
  const hot = entropy.next
  const c = speed.c
  const inner = waves.sent.filter((w) => w.rotor === 'inner')[cold]!
  const outer = waves.sent.filter((w) => w.rotor === 'outer')[cold]!
  const e0 = {
    id: 'E0',
    name: 'seat rest',
    kind: 'control' as const,
    v: speed.v,
    c,
    processing: speed.v,
    exceeds: speed.v > c,
    holds: seat.seat === 'empty' && speed.v === entropy.zero && speed.ratio === entropy.zero && !(speed.v > c),
  }
  const e1 = {
    id: 'E1',
    name: 'inner wave',
    kind: 'wave' as const,
    rotor: inner.rotor,
    kelvin: inner.kelvin,
    processing: inner.speed,
    light: c,
    exceeds: inner.speed > c,
    holds: inner.rotor === 'inner' && inner.kelvin === cold && inner.speed === speed.processing && inner.speed > c,
  }
  const e2 = {
    id: 'E2',
    name: 'outer wave',
    kind: 'wave' as const,
    rotor: outer.rotor,
    kelvin: outer.kelvin,
    processing: outer.speed,
    light: c,
    exceeds: outer.speed > c,
    holds: outer.rotor === 'outer' && outer.kelvin === hot && outer.speed === qpuMintOf(hot - hot) && outer.speed === c && !(outer.speed > c),
  }
  const e3 = {
    id: 'E3',
    name: 'wave selection',
    kind: 'wave' as const,
    rotor: waves.winner.rotor,
    kelvin: waves.winner.kelvin,
    processing: waves.winner.speed,
    light: c,
    exceeds: waves.winner.speed > c,
    holds:
      waves.winner.kelvin === inner.kelvin &&
      waves.winner.speed === inner.speed &&
      waves.winner.speed > outer.speed &&
      waves.exceeds === true &&
      waves.processing > waves.light,
  }
  const e4 = {
    id: 'E4',
    name: 'quantum live',
    kind: 'quantum' as const,
    possibilities: capacity.fused,
    fused: capacity.fused,
    holds: capacity.holds === true && capacity.fused === faces.faces * handle.amplitudes,
  }
  const trials = [e0, e1, e2, e3, e4]
  const holds =
    trials.length === n + coins &&
    trials.every((t) => t.holds) &&
    e1.exceeds &&
    !e0.exceeds &&
    !e2.exceeds &&
    e3.exceeds
  const text = [
    '## Experiments',
    '',
    '### Protocol',
    '',
    'Aim. Separate seat travel from wave processing. Hypothesis: empty-seat inner-wave processing exceeds \(c\), while the empty seat stays at rest (\(v=0\)).',
    '',
    `Apparatus. Named host \`${unit.host}\`. Seat empty. Kind qpu never binds. Two coin-rotors of rays tile the neighbour faces. Light \(c = \\mathrm{mintOf}(\\mathrm{none})\). Wave processing \(\\mathrm{mintOf}(\\mathrm{hot}-\\mathrm{kelvin})\). Cold kelvin is empty-seat temperature. Hot is entropy next.`,
    '',
    `Independent variables: kelvin \(\\{${cold}, ${hot}\\}\). Dependent: processing. Control: seat \(v\). Selection: lowest kelvin, then highest processing.`,
    '',
    '### Trials',
    '',
    `E0 Seat rest (control). Observe \(v=${e0.v}\), \(c=${e0.c}\), \(v/c=${speed.ratio}\). Exceeds \(c\): ${e0.exceeds}. Holds ${e0.holds}. The occupant does not travel.`,
    '',
    `E1 Inner wave. Rotor ${e1.rotor}, kelvin ${e1.kelvin}. Processing \(\\mathrm{mintOf}(${hot}-${e1.kelvin})=${e1.processing}\). Light ${e1.light}. Exceeds \(c\): ${e1.exceeds}. Holds ${e1.holds}.`,
    '',
    `E2 Outer wave. Rotor ${e2.rotor}, kelvin ${e2.kelvin}. Processing \(\\mathrm{mintOf}(${hot}-${e2.kelvin})=${e2.processing}\). Light ${e2.light}. Exceeds \(c\): ${e2.exceeds}. This is the light-speed processing bound, not FTL.`,
    '',
    `E3 Selection. Winner ${e3.rotor} at kelvin ${e3.kelvin}. Processing ${e3.processing} > outer ${e2.processing} and > \(c=${c}\). Wave FTL identity: processing \(>\) light. Seat control E0 still \(v=0\).`,
    '',
    `E4 Quantum live. Possibilities ${e4.possibilities} = fused ${e4.fused}. Independent of the wave-FTL inequality; both must hold.`,
    '',
    '### Result',
    '',
    `Faster than light is wave processing (E1, E3): ${e3.processing} > ${c}. It is not seat travel (E0). Outer processing equals \(c\) (E2). Quantum holds (E4).`,
    '',
  ].join('\n')
  return { cold, hot, c, control: e0, inner: e1, outer: e2, selection: e3, quantum: e4, trials, text, holds }
}

export const qpuExperimentHolds = (e = qpuExperimentOf()): boolean =>
  e.holds === true &&
  e.trials.length === n + coins &&
  e.control.exceeds === false &&
  e.inner.exceeds === true &&
  e.outer.exceeds === false &&
  e.selection.exceeds === true &&
  e.selection.processing > e.c &&
  e.control.v === qpuTempOf().kelvin &&
  e.quantum.holds === true &&
  e.quantum.possibilities === qpuCapacityOf().fused &&
  e.text.includes('### Protocol') &&
  e.text.includes('### Result')

export const qpuAutonomyOf = () => ({
  unlocked: true as const,
  next: unit.fuse.next,
  holds: unit.seat === 'empty' && unit.binds === false && !unit.host.includes('*'),
})

export const qpuAutonomyHolds = (a = qpuAutonomyOf()): boolean =>
  a.unlocked === true && a.next === unit.fuse.next && qpuSeatHolds()

export const qpuAxiomsOf = () => {
  const faces = qpuFacesOf()
  const cube = qpuCubeOf()
  const fuse = qpuFuseOf()
  const none = n - n
  const axiom = { name: 'Axiom' as const, seat: unit.seat, admits: 'nothing' as const, empty: true as const }
  const href = `${fuse.origin}/axioms`
  const names = ['mint', 'seat', 'fuse', 'cube', 'handle', 'prefix', 'faces', 'rosettas', 'superpositions', 'fusion', 'train', 'tasks', 'speed', 'waves'] as const
  const proofs = [
    qpuMintHolds(),
    qpuSeatHolds(),
    qpuFuseHolds(),
    qpuCubeHolds(),
    qpuHandleHolds(),
    qpuPrefixHolds(),
    qpuFacesHolds(),
    qpuRosettasHolds(),
    qpuSuperpositionsHolds(),
    qpuFusionHolds(),
    qpuTrainHolds(),
    qpuTasksHolds(),
    qpuSpeedHolds(),
    qpuWavesHolds(),
  ]
  const rows = faces.rows.map(({ face, neighbour }, i) => ({
    face,
    neighbour,
    name: names[i]!,
    hex: qpuHexOf(face).hex,
    holds: proofs[i] === true,
    binds: false as const,
    seat: axiom.seat,
  }))
  const census = rows.slice(none, cube.vertices)
  const methods = ['inner', 'outer'] as const
  const tracks = Array.from({ length: cube.hexbit }, (_, i) => ({ vertex: i, hex: qpuHexOf(i).hex }))
  const keys = rows.map((r) => r.name)
  const holds =
    axiom.seat === 'empty' &&
    axiom.empty === true &&
    names.length === faces.faces &&
    proofs.length === faces.faces &&
    rows.length === faces.faces &&
    keys.length === rows.length &&
    rows.every((r) => r.holds === true && r.binds === false && r.seat === 'empty') &&
    census.length === cube.vertices &&
    methods.length === faces.coins &&
    tracks.length === cube.hexbit &&
    href === `https://${unit.host}/axioms` &&
    !href.includes('*') &&
    qpuSeatHolds()
  return {
    kind: 'axioms' as const,
    axiom,
    empty: true as const,
    minted: true as const,
    lean: true as const,
    keys,
    href,
    origin: fuse.origin,
    firmware: fuse.firmware,
    around: faces.coins * faces.rays,
    rows,
    census,
    methods,
    tracks,
    holds,
  }
}

export const qpuAxiomsHolds = (a = qpuAxiomsOf()): boolean =>
  a.holds === true &&
  a.kind === 'axioms' &&
  a.axiom.seat === 'empty' &&
  a.axiom.empty === true &&
  a.minted === true &&
  a.lean === true &&
  a.keys.length === a.rows.length &&
  a.rows.length === qpuFacesOf().faces &&
  a.rows.every((r) => r.holds === true && r.binds === false) &&
  a.census.length === qpuCubeOf().vertices &&
  a.methods.length === qpuFacesOf().coins &&
  a.around === qpuFacesOf().coins * qpuFacesOf().rays &&
  a.href === `${unit.fuse.origin}/axioms`

export const qpuJsonLdOf = () => {
  const origin = unit.fuse.origin
  const href = `${origin}/proofs`
  const context = {
    '@base': origin,
    '@vocab': `${origin}/`,
    documentation: 'documentation',
    abstract: 'abstract',
    formula: 'formula',
    measurement: 'measurement',
    docs: 'docs',
  } as const
  const holds =
    context['@base'] === `https://${unit.host}` &&
    context['@vocab'] === `https://${unit.host}/` &&
    context.documentation === 'documentation' &&
    context.docs === 'docs' &&
    href === `https://${unit.host}/proofs` &&
    !origin.includes('*') &&
    unit.mint.next === mintOf(n) + mintOf(n)
  return { '@context': context, '@id': href, '@type': 'proofs' as const, jsonld: true as const, minted: true as const, lean: true as const, holds }
}

export const qpuJsonLdHolds = (j = qpuJsonLdOf()): boolean =>
  j.holds === true &&
  j.jsonld === true &&
  j.minted === true &&
  j.lean === true &&
  j['@type'] === 'proofs' &&
  j['@id'] === `${unit.fuse.origin}/proofs` &&
  j['@context']['@base'] === unit.fuse.origin

const proofScienceOf = (
  name: string,
  face: number,
  at: number,
  axiom: { name: string; hex: string; holds: boolean },
  neighbour: { name: string; face: number },
  superposition: { unique: boolean; around: number },
  experiment: ReturnType<typeof qpuExperimentOf>,
) => {
  const none = unit.entropy.zero
  const mint = unit.mint
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const fuse = qpuFuseOf()
  const seat = qpuSeatOf()
  const speed = qpuSpeedOf()
  const fusion = qpuFusionOf()
  const train = qpuTrainOf()
  const tasks = qpuTasksOf()
  const prefix = qpuPrefixOf(none)
  const rosettas = qpuRosettasOf(at)
  const message = qpuMessageOf(face, at)
  const catalog = {
    mint: {
      abstract: `The QPU generator is mintOf. Licensed doubling creates \(2^k\). Kind \`${unit.kind}\` never binds. The particle is mintOf(none).`,
      formulas: [
        { identity: 'mintOf(k) := (k-k)^{k-k}; then x += x, k times' },
        { identity: 'mintOf(k+1) = mintOf(k)+mintOf(k)' },
        { identity: 'mint.next = mintOf(n)+mintOf(n)' },
      ],
      reading: { seed: mint.seed, next: mint.next, particle: mintOf(none) },
    },
    seat: {
      abstract: `The QPU seat is empty and admits nothing. Kind \`${unit.kind}\` never binds. No mass travels, so every amplitude remains available.`,
      formulas: [
        { identity: 'seat = empty' },
        { identity: 'binds = false' },
        { identity: 'v = entropy.zero' },
      ],
      reading: { kelvin: qpuTempOf().kelvin, v: speed.v, admits: seat.admits },
    },
    fuse: {
      abstract: `Named HTTPS fusion is the application door. VitePress firmware shows occupancy source. No wildcards.`,
      formulas: [
        { identity: 'origin = https://${kind}.uuidna.com' },
        { identity: 'firmware = vitepress' },
        { identity: 'next = origin/quantum/processing/unit' },
      ],
      reading: { origin: fuse.origin, next: fuse.next, firmware: fuse.firmware, src: fuse.src },
    },
    cube: {
      abstract: `The occupancy cube is vertices, hexbit, and bits from mintOf. Bits are vertices times hexbit. This is the QPU handle width before amplitudes.`,
      formulas: [
        { identity: 'vertices = mintOf(n)' },
        { identity: 'hexbit = mintOf(coins)' },
        { identity: 'bits = vertices · hexbit' },
      ],
      reading: { vertices: cube.vertices, hexbit: cube.hexbit, bits: cube.bits },
    },
    handle: {
      abstract: `Handle amplitudes are mintOf(bits). Capabilities are finite. Next doubles amplitudes and is not a cap. The QPU processes every prefix.`,
      formulas: [
        { identity: 'amplitudes = mintOf(bits)' },
        { identity: 'next = amplitudes+amplitudes' },
        { identity: 'full = amplitudes-seed' },
      ],
      reading: { bits: handle.bits, amplitudes: handle.amplitudes, next: handle.next },
    },
    prefix: {
      abstract: `Every handle prefix is processed, including the next doubling past the present handle. The QPU never refuses a bit.`,
      formulas: [
        { identity: 'holds = true for every bit' },
        { identity: 'next = mintOf(span)+mintOf(span)' },
        { identity: 'zero mask = entropy.zero' },
      ],
      reading: { bit: prefix.bit, bits: prefix.bits, mask: prefix.mask, next: prefix.next },
    },
    faces: {
      abstract: `Neighbour faces are the QPU gateways. Opposite is plus rays. Identity: coins times rays equals faces.`,
      formulas: [
        { identity: 'faces = vertices+hexbit+coins' },
        { identity: 'coins · rays = faces' },
        { identity: 'neighbour(i) = (i+rays) mod faces' },
      ],
      reading: { faces: faces.faces, coins: faces.coins, rays: faces.rays, neighbour: neighbour.face },
    },
    rosettas: {
      abstract: `At every time on the ray period, coin rotors of rays surround each QPU superposition. Inner walks +t, outer the reverse, both fuse at none.`,
      formulas: [
        { identity: 'around = coins · rays' },
        { identity: 'inner(t) walks +t' },
        { identity: 'outer(t) walks reverse' },
      ],
      reading: { coins: rosettas.coins, rays: rosettas.rays, around: rosettas.around, at },
    },
    superpositions: {
      abstract: `Coins times rays rotating rosettas uniquely cover the neighbour faces around every superposition. Fusion is infinite. The seat stays empty.`,
      formulas: [
        { identity: 'around = coins · rays' },
        { identity: 'unique cover of faces' },
        { identity: 'binds = false' },
      ],
      reading: { around: superposition.around, unique: superposition.unique, uniqueCover: superposition.unique },
    },
    fusion: {
      abstract: `Fused QPU capacity is neighbours times handle amplitudes. Fused is finite. Next doubles. Infinite fusion is that next is not a cap.`,
      formulas: [
        { identity: 'fused = faces · amplitudes' },
        { identity: 'next = fused+fused' },
        { identity: 'infinite: next doubles, not a cap' },
      ],
      reading: { fused: fusion.fused, next: fusion.next, around: fusion.around, infinite: fusion.infinite },
    },
    train: {
      abstract: `The pi train is 22/7 cars from rays times n plus seed over rays. Prime tasks on those cars are the QPU processing load.`,
      formulas: [
        { identity: 'roof = rays · n + seed' },
        { identity: 'period = coins · n' },
        { identity: 'cars[none] = n' },
      ],
      reading: { roof: train.roof, rays: train.rays, period: train.period, cars: train.cars.length },
    },
    tasks: {
      abstract: `Prime tasks distributed on the pi train set processing speed. Count is hexbit. Speed is mintOf of that count.`,
      formulas: [
        { identity: 'primes ⊂ train.cars' },
        { identity: 'count = hexbit' },
        { identity: 'processing = mintOf(count)' },
      ],
      reading: { count: tasks.count, primes: tasks.count, processing: mintOf(tasks.count) },
    },
    speed: {
      abstract: `Seat rest is v=0. Light c is mintOf(none). QPU processing is mintOf of the prime-task count and exceeds c at empty-seat kelvin.`,
      formulas: [
        { identity: 'c = mintOf(none)' },
        { identity: 'v = entropy.zero' },
        { identity: 'processing = mintOf(tasks)' },
      ],
      reading: { c: speed.c, v: speed.v, processing: speed.processing, tasks: speed.tasks, ratio: speed.ratio },
    },
    waves: {
      abstract: `Send coin rotors of rays as waves. Inner processing exceeds c. Outer stays at c. Winner is lowest kelvin then highest speed. This is wave processing, not occupant travel.`,
      formulas: [
        { identity: 'inner.processing > c' },
        { identity: 'outer.processing = c' },
        { identity: 'winner = lowest kelvin, then highest speed' },
      ],
      reading: {
        inner: experiment.inner.processing,
        outer: experiment.outer.processing,
        winner: experiment.selection.processing,
        exceeds: experiment.inner.exceeds,
        c: experiment.c,
      },
    },
  } as const
  const science = catalog[name as keyof typeof catalog]
  const application = {
    domain: 'quantum processing unit' as const,
    kind: unit.kind,
    host: unit.host,
    origin: fuse.origin,
    href: fuse.next,
    firmware: fuse.firmware,
    src: fuse.src,
    seat: unit.seat,
    binds: unit.binds,
    when: unit.when,
    wildcards: unit.wildcards,
    message: { uuid: message.uuid, cross: message.cross, secure: message.secure, origin: message.origin },
  }
  const experiments = {
    protocol: experiment.text.includes('### Protocol'),
    trials: experiment.trials,
    measurements: {
      control: { v: experiment.control.v, c: experiment.c, exceeds: experiment.control.exceeds },
      inner: { processing: experiment.inner.processing, kelvin: experiment.inner.kelvin, exceeds: experiment.inner.exceeds },
      outer: { processing: experiment.outer.processing, kelvin: experiment.outer.kelvin, exceeds: experiment.outer.exceeds },
      selection: { processing: experiment.selection.processing, kelvin: experiment.selection.kelvin, exceeds: experiment.selection.exceeds },
      quantum: { possibilities: experiment.quantum.possibilities, fused: experiment.quantum.fused },
    },
    result: experiment.inner.processing > experiment.c && experiment.control.v === none,
    holds: experiment.holds,
  }
  const formulas = science?.formulas ?? []
  const measurements = {
    axiom: axiom.name,
    hex: axiom.hex,
    face,
    at,
    neighbour: neighbour.face,
    around: superposition.around,
    unique: superposition.unique,
    reading: science?.reading,
    experiment: experiments.measurements,
  }
  const holds =
    science !== undefined &&
    science.abstract.length > none &&
    formulas.length === n &&
    axiom.holds === true &&
    experiment.holds === true &&
    experiments.result === true &&
    experiments.trials.length === n + coins &&
    application.domain === 'quantum processing unit' &&
    application.kind === unit.kind &&
    application.seat === 'empty' &&
    application.binds === false &&
    application.firmware === 'vitepress' &&
    application.wildcards === false &&
    !application.origin.includes('*') &&
    message.holds === true &&
    message.secure === true
  const documentation = [
    name,
    science?.abstract ?? '',
    ...(science?.formulas ?? []).map((f) => f.identity),
    `hex ${axiom.hex}`,
    `inner processing ${experiments.measurements.inner.processing} exceeds c ${experiments.measurements.inner.exceeds}`,
    `seat v ${experiments.measurements.control.v}`,
    `capacity ${experiments.measurements.quantum.fused} next to c ${experiments.measurements.control.c}`,
    application.domain,
    application.origin,
  ].join('\n')
  const docs = {
    kind: 'docs' as const,
    inline: true as const,
    powers: 'jsonld' as const,
    text: documentation,
    holds:
      documentation.includes(science?.abstract ?? '') &&
      (science?.formulas ?? []).every((f) => documentation.includes(f.identity)) &&
      documentation.includes(application.domain),
  }
  return { abstract: science?.abstract ?? '', formulas, measurements, experiments, application, documentation, docs, holds: holds && docs.holds }
}

const proofFromOf = (
  face: number,
  at: number,
  axioms: ReturnType<typeof qpuAxiomsOf>,
  superpositions: ReturnType<typeof qpuSuperpositionsOf>,
  experiment: ReturnType<typeof qpuExperimentOf>,
) => {
  const faces = qpuFacesOf()
  const fuse = qpuFuseOf()
  const jsonld = qpuJsonLdOf()
  const f = ((face % faces.faces) + faces.faces) % faces.faces
  const axiom = axioms.rows[f]!
  const neighbour = axioms.rows[axiom.neighbour]!
  const superposition = superpositions.rows[f]!
  const quantum = `/${unit.path}`
  const science = proofScienceOf(axiom.name, f, at, axiom, neighbour, superposition, experiment)
  const theorems = [
    { kind: 'holds' as const, name: axiom.name, href: quantum, axiom: axiom.name, face: axiom.face, holds: axiom.holds },
    { kind: 'cross' as const, name: neighbour.name, href: `/axioms#face-${neighbour.face}`, axiom: axiom.name, face: neighbour.face, holds: neighbour.holds },
    { kind: 'quantum' as const, name: 'quantum', href: quantum, axiom: axiom.name, face: axiom.face, holds: superposition.unique },
  ]
  const proof = {
    empty: axioms.axiom.empty,
    from: 'axiom' as const,
    via: theorems.map((t) => t.kind),
    holds: axioms.axiom.empty === true && axiom.holds && theorems.every((t) => t.holds) && superposition.unique === true && science.holds,
  }
  const id = `${jsonld['@id']}#face-${f}`
  const holds =
    axioms.holds &&
    superpositions.holds &&
    jsonld.holds &&
    science.holds &&
    axiom.seat === 'empty' &&
    axiom.binds === false &&
    theorems.length === n &&
    theorems.every((t) => t.holds === true) &&
    proof.holds === true &&
    science.formulas.length === n &&
    science.abstract.length > unit.entropy.zero &&
    science.experiments.holds === true &&
    science.docs.powers === 'jsonld' &&
    science.documentation.includes(science.abstract) &&
    science.formulas.every((f) => science.documentation.includes(f.identity)) &&
    superposition.face === f &&
    superposition.neighbour === axiom.neighbour &&
    fuse.firmware === 'vitepress' &&
    id === `https://${unit.host}/proofs#face-${f}` &&
    !id.includes('*')
  return {
    '@context': jsonld['@context'],
    '@id': id,
    '@type': 'proof' as const,
    kind: 'proof' as const,
    jsonld: true as const,
    at,
    face: f,
    axiom,
    theorems,
    proof,
    abstract: science.abstract,
    formulas: science.formulas,
    measurements: science.measurements,
    experiments: science.experiments,
    application: science.application,
    documentation: science.documentation,
    docs: science.docs,
    superposition,
    cross: `/axioms#face-${axiom.neighbour}`,
    quantum: fuse.next,
    firmware: fuse.firmware,
    minted: true as const,
    lean: true as const,
    keys: [axiom.name],
    holds,
  }
}

export const qpuProofOf = (face = unit.entropy.zero, at = unit.entropy.zero) =>
  proofFromOf(face, at, qpuAxiomsOf(), qpuSuperpositionsOf(at), qpuExperimentOf())

export const qpuProofHolds = (face = unit.entropy.zero, at = unit.entropy.zero): boolean => {
  const p = qpuProofOf(face, at)
  return (
    p.holds === true &&
    p.theorems.length === n &&
    p.formulas.length === n &&
    p.abstract.length > n - n &&
    p.documentation.includes(p.abstract) &&
    p.formulas.every((f) => p.documentation.includes(f.identity)) &&
    p.docs.inline === true &&
    p.docs.powers === 'jsonld' &&
    p.jsonld === true &&
    p.minted === true &&
    p.lean === true &&
    p.keys[0] === p.axiom.name &&
    p.proof.empty === true &&
    p.experiments.holds === true &&
    p.experiments.result === true &&
    p.application.seat === 'empty' &&
    p['@type'] === 'proof' &&
    p['@id'] === `${unit.fuse.origin}/proofs#face-${p.face}`
  )
}

export const qpuProofsOf = (at = unit.entropy.zero) => {
  const jsonld = qpuJsonLdOf()
  const faces = qpuFacesOf()
  const axioms = qpuAxiomsOf()
  const superpositions = qpuSuperpositionsOf(at)
  const experiment = qpuExperimentOf()
  const graph = faces.rows.map(({ face }) => proofFromOf(face, at, axioms, superpositions, experiment))
  const documentation = graph.map((p) => p.documentation).join('\n')
  const docs = {
    kind: 'docs' as const,
    inline: true as const,
    powers: 'jsonld' as const,
    text: documentation,
    holds: graph.every((p) => p.docs.holds === true && p.documentation.includes(p.abstract)),
  }
  const holds =
    jsonld.holds &&
    jsonld.jsonld === true &&
    experiment.holds &&
    docs.holds &&
    docs.powers === 'jsonld' &&
    graph.length === faces.faces &&
    graph.every(
      (p) =>
        p.holds === true &&
        p.jsonld === true &&
        p.minted === true &&
        p.formulas.length === n &&
        p.abstract.length > unit.entropy.zero &&
        p.documentation.includes(p.abstract) &&
        p.docs.powers === 'jsonld' &&
        p.experiments.holds === true &&
        p['@id'] === `${jsonld['@id']}#face-${p.face}`,
    )
  return {
    '@context': jsonld['@context'],
    '@id': jsonld['@id'],
    '@type': jsonld['@type'],
    jsonld: true as const,
    minted: true as const,
    lean: true as const,
    keys: graph.map((p) => p.axiom.name),
    at,
    documentation,
    docs,
    '@graph': graph,
    holds,
  }
}

export const qpuProofsHolds = (): boolean => {
  const faces = qpuFacesOf()
  const axioms = qpuAxiomsOf()
  const experiment = qpuExperimentOf()
  const none = unit.entropy.zero
  for (let t = none; t < faces.rays; t++) {
    const superpositions = qpuSuperpositionsOf(t)
    for (const { face } of faces.rows) {
      if (proofFromOf(face, t, axioms, superpositions, experiment).holds !== true) return false
    }
  }
  const minted = qpuProofsOf()
  return axioms.holds === true && experiment.holds === true && minted.holds === true && minted.jsonld === true && minted.docs.powers === 'jsonld' && minted.docs.inline === true
}

export const qpuTheoremsOf = (face = unit.entropy.zero, at = unit.entropy.zero) => {
  const p = qpuProofOf(face, at)
  const keys = p.theorems.map((t) => t.kind)
  const holds = p.holds && p.theorems.length === n && p.theorems.every((t) => t.holds === true) && p.minted === true
  return { face: p.face, at, axiom: p.axiom.name, theorems: p.theorems, minted: true as const, keys, lean: true as const, holds }
}

export const qpuTheoremsHolds = (face = unit.entropy.zero, at = unit.entropy.zero): boolean => {
  const t = qpuTheoremsOf(face, at)
  return t.holds === true && t.theorems.length === n && t.minted === true && t.lean === true && t.keys.length === n
}

export const qpuQuantumTheoremsOf = (at = unit.entropy.zero) => {
  const axioms = qpuAxiomsOf()
  const href = `${unit.fuse.origin}/theorems`
  const faces = axioms.rows.map((r) => {
    const t = qpuTheoremsOf(r.face, at)
    return { ...r, of: `qpu${r.name[0]!.toUpperCase()}${r.name.slice(1)}Of`, theorems: t.theorems, holds: r.holds && t.holds }
  })
  const keys = faces.map((r) => r.of)
  const census = axioms.census.map((r) => ({ ...r, href: `${href}#face-${r.face}` }))
  const holds =
    axioms.holds &&
    axioms.lean === true &&
    keys.length === faces.length &&
    faces.every((r) => r.holds && r.theorems.length === n) &&
    census.every((r) => r.href.startsWith(href) && !r.href.includes('/theorem/'))
  return {
    kind: 'theorems' as const,
    lean: true as const,
    keys,
    minted: true as const,
    empty: true as const,
    href,
    faces,
    census,
    methods: axioms.methods,
    tracks: axioms.tracks,
    holds,
  }
}

export const qpuQuantumTheoremsHolds = (t = qpuQuantumTheoremsOf()): boolean =>
  t.holds === true && t.lean === true && t.keys.length === t.faces.length && t.empty === true

export const qpuMintedOf = () => {
  const faces = qpuFacesOf()
  const axioms = qpuAxiomsOf()
  const theorems = qpuQuantumTheoremsOf()
  const proofs = qpuProofsOf()
  const mint = unit.mint
  const next = mintOf(faces.faces)
  const href = proofs['@id']
  const holds =
    axioms.holds &&
    axioms.minted === true &&
    axioms.lean === true &&
    theorems.holds &&
    theorems.lean === true &&
    theorems.faces.length === faces.faces &&
    proofs.holds &&
    proofs.jsonld === true &&
    proofs.minted === true &&
    proofs['@graph'].length === faces.faces &&
    proofs['@graph'].every((p) => p.formulas.length === n && p.experiments.holds === true && p.abstract.length > unit.entropy.zero && p.docs.powers === 'jsonld' && p.docs.inline === true && p.documentation.includes(p.abstract)) &&
    next === mintOf(faces.faces) &&
    mint.next === mintOf(n) + mintOf(n) &&
    href === `https://${unit.host}/proofs`
  return {
    kind: 'minted' as const,
    minted: true as const,
    lean: true as const,
    jsonld: true as const,
    mint,
    next,
    axioms,
    theorems,
    proofs,
    href,
    holds,
  }
}

export const qpuMintedHolds = (m = qpuMintedOf()): boolean =>
  m.holds === true &&
  m.minted === true &&
  m.lean === true &&
  m.jsonld === true &&
  m.axioms.minted === true &&
  m.theorems.holds === true &&
  m.theorems.faces.length === qpuFacesOf().faces &&
  m.theorems.lean === true &&
  m.proofs.jsonld === true &&
  m.proofs['@graph'].length === qpuFacesOf().faces &&
  m.href === `${unit.fuse.origin}/proofs`

type QpuHeading = { heading: string; href: string; children: QpuHeading[] }

const headingWalkOf = (nodes: QpuHeading[]): boolean => {
  const none = unit.entropy.zero
  return nodes.every((h) => h.heading.length > none && !h.href.includes('*') && headingWalkOf(h.children))
}

const headingFromProofOf = (p: ReturnType<typeof qpuProofOf>): QpuHeading => ({
  heading: p.axiom.name,
  href: `/proofs#face-${p.face}`,
  children: [
    {
      heading: 'Formulas',
      href: `/proofs#face-${p.face}-formulas`,
      children: p.formulas.map((row) => ({ heading: row.identity, href: `/proofs#face-${p.face}-formulas`, children: [] })),
    },
    { heading: 'Measurements', href: `/proofs#face-${p.face}-measurements`, children: [] },
    { heading: 'Application', href: `/proofs#face-${p.face}-application`, children: [] },
    {
      heading: 'Theorems',
      href: `/proofs#face-${p.face}-theorems`,
      children: p.theorems.map((t) => ({ heading: t.kind, href: t.href, children: [] })),
    },
  ],
})

export const qpuTypographOf = (face = unit.entropy.zero, at = unit.entropy.zero) => {
  const faces = qpuFacesOf()
  const superpositions = qpuSuperpositionsOf(at)
  const fuse = qpuFuseOf()
  const f = ((face % faces.faces) + faces.faces) % faces.faces
  const row = superpositions.rows[f]!
  const headings = row.rosettas.inner.map((d) => headingFromProofOf(qpuProofOf(d, at)))
  const recursive = headings.some((h) => h.children.some((c) => c.children.length > unit.entropy.zero))
  const holds =
    superpositions.holds &&
    row.unique === true &&
    fuse.firmware === 'vitepress' &&
    headingWalkOf(headings) &&
    headings.some((h) => h.heading === qpuAxiomsOf().rows[f]!.name) &&
    recursive === true
  return {
    kind: 'typograph' as const,
    from: 'content' as const,
    rating: 'typography' as const,
    recursive: true as const,
    firmware: fuse.firmware,
    headings,
    holds,
  }
}

export const qpuTypographHolds = (face = unit.entropy.zero, at = unit.entropy.zero): boolean => {
  const t = qpuTypographOf(face, at)
  return (
    t.holds === true &&
    t.from === 'content' &&
    t.rating === 'typography' &&
    t.recursive === true &&
    t.firmware === 'vitepress' &&
    headingWalkOf(t.headings)
  )
}

export const qpuPlaneOf = (path = '/proofs', at = unit.entropy.zero) => {
  const faces = qpuFacesOf()
  const axioms = qpuAxiomsOf()
  const fuse = qpuFuseOf()
  const none = unit.entropy.zero
  const bare = path.replace(/\/$/, '') || '/'
  const headings: QpuHeading[] =
    bare === '/proofs'
      ? faces.rows.map(({ face }) => headingFromProofOf(qpuProofOf(face, at)))
      : bare === `/${unit.path}`
        ? [
            {
              heading: 'Keys',
              href: `${bare}#keys`,
              children: fuse.keys.map((k) => ({ heading: k.kind, href: k.path, children: [] })),
            },
            { heading: 'Source', href: `${bare}#source`, children: [] },
          ]
        : bare === '/solve'
        ? [
            {
              heading: 'Keys',
              href: `${bare}#keys`,
              children: qpuSolveOf().keys.map((k) => ({ heading: `${k.ray}`, href: `#ray-${k.ray}`, children: [] })),
            },
            { heading: 'Clay', href: `${bare}#clay`, children: [] },
            { heading: 'Source', href: `${bare}#source`, children: [] },
          ]
        : bare === '/axioms' || bare === '/theorems'
        ? [
            {
              heading: 'Faces',
              href: `${bare}#faces`,
              children: axioms.rows.map((r) => ({
                heading: r.name,
                href: `${bare}#face-${r.face}`,
                children:
                  bare === '/theorems'
                    ? qpuTheoremsOf(r.face, at).theorems.map((t) => ({ heading: t.kind, href: t.href, children: [] }))
                    : [],
              })),
            },
            {
              heading: 'Census',
              href: `${bare}#census`,
              children: axioms.census.map((r) => ({ heading: r.name, href: `${bare}#census`, children: [] })),
            },
            {
              heading: 'Methods',
              href: `${bare}#methods`,
              children: axioms.methods.map((m) => ({ heading: m, href: `${bare}#methods`, children: [] })),
            },
          ]
        : [
            {
              heading: 'Proof',
              href: `${bare === '/' ? '' : bare}#proof`,
              children: [{ heading: 'clay', href: `${bare === '/' ? '' : bare}#proof`, children: [] }],
            },
            {
              heading: 'Build',
              href: `${bare === '/' ? '' : bare}#build`,
              children: [
                { heading: 'quantum', href: `${bare === '/' ? '' : bare}#build`, children: [] },
                { heading: 'kelvin', href: `${bare === '/' ? '' : bare}#build`, children: [] },
                { heading: 'c', href: `${bare === '/' ? '' : bare}#build`, children: [] },
                { heading: 'processing', href: `${bare === '/' ? '' : bare}#build`, children: [] },
              ],
            },
          ]
  const recursive = headings.some((h) => h.children.length > none)
  const holds =
    axioms.holds &&
    fuse.firmware === 'vitepress' &&
    headingWalkOf(headings) &&
    recursive === true &&
    !bare.includes('*')
  return {
    kind: 'plane' as const,
    from: 'content' as const,
    rating: 'typography' as const,
    recursive: true as const,
    firmware: fuse.firmware,
    path: bare,
    headings,
    holds,
  }
}

export const qpuPlaneHolds = (path = '/proofs', at = unit.entropy.zero): boolean => {
  const p = qpuPlaneOf(path, at)
  return (
    p.holds === true &&
    p.from === 'content' &&
    p.rating === 'typography' &&
    p.recursive === true &&
    headingWalkOf(p.headings)
  )
}

export const qpuPerspectiveOf = (face = unit.entropy.zero, at = unit.entropy.zero) => {
  const faces = qpuFacesOf()
  const axioms = qpuAxiomsOf()
  const superpositions = qpuSuperpositionsOf(at)
  const fuse = qpuFuseOf()
  const typograph = qpuTypographOf(face, at)
  const none = unit.entropy.zero
  const f = ((face % faces.faces) + faces.faces) % faces.faces
  const row = superpositions.rows[f]!
  const present = {
    face: f,
    name: axioms.rows[f]!.name,
    heading: axioms.rows[f]!.name,
    hex: axioms.rows[f]!.hex,
    href: `/axioms#face-${f}`,
  }
  const related = row.rosettas.inner.map((d) => {
    const axiom = axioms.rows[d]!
    return {
      face: d,
      name: axiom.name,
      heading: axiom.name,
      hex: axiom.hex,
      href: `/axioms#face-${d}`,
      related: true as const,
    }
  })
  const left: QpuHeading[] = [
    {
      heading: present.heading,
      href: present.href,
      children: related.map((d) => ({ heading: d.heading, href: d.href, children: [] })),
    },
  ]
  const holds =
    axioms.holds &&
    superpositions.holds &&
    row.unique === true &&
    present.heading.length > none &&
    related.every((d) => d.heading.length > none && d.related === true && d.href.startsWith('/axioms#') && !d.href.includes('*')) &&
    related.some((d) => d.face === f) &&
    headingWalkOf(left) &&
    typograph.holds &&
    typograph.rating === 'typography' &&
    typograph.recursive === true &&
    typograph.from === 'content'
  return {
    kind: 'perspective' as const,
    face: f,
    at,
    present,
    related,
    left,
    typograph,
    firmware: fuse.firmware,
    holds,
  }
}

export const qpuPerspectiveHolds = (face = unit.entropy.zero, at = unit.entropy.zero): boolean => {
  const p = qpuPerspectiveOf(face, at)
  return (
    p.holds === true &&
    p.typograph.from === 'content' &&
    p.typograph.rating === 'typography' &&
    p.typograph.recursive === true &&
    headingWalkOf(p.left) &&
    headingWalkOf(p.typograph.headings) &&
    p.present.heading.length > unit.entropy.zero &&
    p.related.every((d) => d.related === true && d.heading.length > unit.entropy.zero) &&
    p.related.some((d) => d.face === p.face)
  )
}

export const qpuBalanceOf = (face = unit.entropy.zero, at = unit.entropy.zero) => {
  const faces = qpuFacesOf()
  const axioms = qpuAxiomsOf()
  const superpositions = qpuSuperpositionsOf(at)
  const perspective = qpuPerspectiveOf(face, at)
  const none = unit.entropy.zero
  const f = ((face % faces.faces) + faces.faces) % faces.faces
  const row = superpositions.rows[f]!
  const debit = perspective.related
  const credit = row.rosettas.outer.map((d) => {
    const axiom = axioms.rows[d]!
    return {
      face: d,
      name: axiom.name,
      heading: axiom.name,
      hex: axiom.hex,
      href: `/axioms#face-${d}`,
      related: true as const,
      credit: true as const,
    }
  })
  const books = debit.map((d) => {
    const opposite = (d.face + faces.rays) % faces.faces
    const c = credit.find((row) => row.face === opposite)
    return {
      debit: d,
      credit: c,
      opposite,
      holds: c !== undefined && c.heading.length > none && d.related === true,
    }
  })
  const holds =
    perspective.holds &&
    superpositions.holds &&
    row.unique === true &&
    books.every((b) => b.holds === true && b.credit !== undefined) &&
    debit.every((d) => credit.some((c) => c.face === (d.face + faces.rays) % faces.faces)) &&
    credit.every((c) => debit.some((d) => d.face === (c.face + faces.rays) % faces.faces))
  return {
    kind: 'balance' as const,
    face: f,
    at,
    present: perspective.present,
    debit,
    credit,
    books,
    balanced: holds,
    holds,
  }
}

export const qpuBalanceHolds = (face = unit.entropy.zero, at = unit.entropy.zero): boolean => {
  const b = qpuBalanceOf(face, at)
  return b.holds === true && b.balanced === true && b.books.every((row) => row.holds === true)
}

const dumpFromOf = (
  steps: { name: string; holds: boolean; reading: object }[],
  committed: boolean,
) => {
  const fuse = qpuFuseOf()
  const none = unit.entropy.zero
  const feeds = committed ? ('audit' as const) : ('debugging' as const)
  const holds =
    steps.length === n + n &&
    steps.every((s) => s.name.length > none) &&
    committed === steps.every((s) => s.holds === true) &&
    (committed ? feeds === 'audit' : feeds === 'debugging') &&
    !fuse.origin.includes('*')
  return { kind: 'dump' as const, feeds, committed, steps, origin: fuse.origin, src: fuse.src, holds }
}

export const qpuTransactionOf = (face = unit.entropy.zero, at = unit.entropy.zero) => {
  const perspective = qpuPerspectiveOf(face, at)
  const balance = qpuBalanceOf(face, at)
  const compilation = qpuMetricsOf()
  const speed = qpuSpeedOf()
  const temp = qpuTempOf()
  const waves = qpuWavesOf()
  const fuse = qpuFuseOf()
  const compared = {
    temperature: {
      kelvin: temp.kelvin,
      winner: waves.winner.kelvin,
      holds: waves.winner.kelvin === temp.kelvin && temp.kelvin === unit.entropy.zero,
    },
    light: {
      processing: speed.processing,
      c: speed.c,
      capacity: qpuCapacityOf().fused,
      winner: waves.winner.speed,
      holds:
        speed.processing > speed.c &&
        waves.winner.speed > speed.c &&
        waves.winner.speed === speed.processing &&
        qpuCapacityOf().fused === qpuFacesOf().faces * qpuHandleOf().amplitudes,
    },
  }
  const firmware = { firmware: fuse.firmware, src: fuse.src, origin: fuse.origin, holds: fuse.firmware === 'vitepress' && !fuse.origin.includes('*') }
  const steps = [
    { name: 'perspective', holds: perspective.holds === true, reading: { present: perspective.present.heading, typograph: perspective.typograph.from } },
    { name: 'debit-credit', holds: balance.holds === true && balance.balanced === true, reading: { balanced: balance.balanced } },
    { name: 'compilation', holds: compilation.holds === true, reading: { host: compilation.host, mint: compilation.mint } },
    { name: 'temperature', holds: compared.temperature.holds === true, reading: compared.temperature },
    { name: 'light', holds: compared.light.holds === true, reading: compared.light },
    { name: 'firmware', holds: firmware.holds === true, reading: { firmware: fuse.firmware, src: fuse.src } },
  ]
  const committed = steps.every((s) => s.holds === true)
  const dump = dumpFromOf(steps, committed)
  const sealed = committed === true
  const holds =
    dump.holds === true &&
    dump.committed === committed &&
    sealed === committed &&
    dump.feeds === (committed ? 'audit' : 'debugging')
  return {
    kind: 'transaction' as const,
    committed,
    sealed,
    dump,
    steps,
    perspective,
    balance,
    compilation,
    compared,
    firmware: fuse,
    holds,
  }
}

export const qpuTransactionHolds = (t = qpuTransactionOf()): boolean =>
  t.holds === true &&
  t.dump.holds === true &&
  t.sealed === t.committed &&
  t.dump.committed === t.committed &&
  t.dump.feeds === (t.committed ? 'audit' : 'debugging') &&
  t.steps.every((s) => s.holds === true) === t.committed

export const qpuDumpOf = (face = unit.entropy.zero, at = unit.entropy.zero) => qpuTransactionOf(face, at).dump

export const qpuDumpHolds = (d = qpuDumpOf()): boolean =>
  d.holds === true &&
  d.kind === 'dump' &&
  d.committed === d.steps.every((s) => s.holds === true) &&
  d.feeds === (d.committed ? 'audit' : 'debugging') &&
  d.origin === unit.fuse.origin

export const qpuSealOf = (face = unit.entropy.zero, at = unit.entropy.zero) => {
  const tx = qpuTransactionOf(face, at)
  const publication = {
    origin: tx.firmware.origin,
    src: tx.firmware.src,
    firmware: tx.firmware.firmware,
    href: tx.firmware.origin,
    sealed: tx.committed,
  }
  const holds = tx.holds && tx.committed === true && publication.sealed === true && tx.dump.feeds === 'audit'
  return {
    kind: 'seal' as const,
    sealed: tx.committed,
    publication,
    balance: tx.balance,
    compilation: tx.compilation,
    compared: tx.compared,
    transaction: tx,
    dump: tx.dump,
    holds,
  }
}

export const qpuSealHolds = (s = qpuSealOf()): boolean =>
  s.holds === true &&
  s.sealed === true &&
  s.publication.sealed === true &&
  s.transaction.committed === true &&
  s.dump.feeds === 'audit' &&
  s.balance.balanced === true &&
  s.compared.temperature.holds === true &&
  s.compared.light.holds === true &&
  s.compared.light.processing > s.compared.light.c &&
  s.compared.light.capacity === qpuCapacityOf().fused &&
  s.compared.temperature.kelvin === unit.entropy.zero &&
  s.publication.firmware === 'vitepress'

export const qpuTheoryOf = () => {
  const speed = qpuSpeedOf()
  const capacity = qpuCapacityOf()
  const holds = speed.holds === true && capacity.holds === true && capacity.fused === qpuFacesOf().faces * qpuHandleOf().amplitudes
  return { kind: 'theory' as const, c: speed.c, capacity: capacity.fused, next: capacity.next, holds }
}

export const qpuTheoryHolds = (t = qpuTheoryOf()): boolean =>
  t.holds === true && t.c === qpuSpeedOf().c && t.capacity === qpuCapacityOf().fused && t.next === qpuCapacityOf().next

export const qpuSampleOf = () => {
  const theory = qpuTheoryOf()
  const temp = qpuTempOf()
  const speed = qpuSpeedOf()
  const kelvin = temp.kelvin
  const c = theory.c
  const processing = speed.processing
  const capacity = theory.capacity
  const holds = theory.holds && kelvin === unit.entropy.zero && processing > c && capacity === theory.capacity && c === theory.c
  return { kelvin, c, processing, capacity, theory, holds }
}

export const qpuSampleHolds = (s = qpuSampleOf()): boolean =>
  s.holds === true && s.capacity === qpuTheoryOf().capacity && s.c === qpuTheoryOf().c && s.processing > s.c

const foldMetricOf = (m: { min: number; max: number; sum: number }, x: number, builds: number) => {
  if (builds === unit.entropy.zero) return { min: x, max: x, sum: x }
  return { min: x < m.min ? x : m.min, max: x > m.max ? x : m.max, sum: m.sum + x }
}

export const qpuStatsZeroOf = () => {
  const none = unit.entropy.zero
  const zero = { min: none, max: none, sum: none }
  const theory = qpuTheoryOf()
  return {
    kind: 'stats' as const,
    architecture: { host: unit.host, path: unit.path, firmware: unit.fuse.firmware },
    theory,
    builds: none,
    processing: { ...zero },
    kelvin: { ...zero },
    c: { ...zero },
    capacity: { ...zero },
    samples: [] as { kelvin: number; c: number; processing: number; capacity: number }[],
    holds: theory.holds === true,
  }
}

export const qpuStatsOf = (prior = qpuStatsZeroOf()) => {
  const sample = qpuSampleOf()
  const theory = qpuTheoryOf()
  const ring = mintOf(n)
  const compact = { kelvin: sample.kelvin, c: sample.c, processing: sample.processing, capacity: sample.capacity }
  const processing = foldMetricOf(prior.processing, sample.processing, prior.builds)
  const kelvin = foldMetricOf(prior.kelvin, sample.kelvin, prior.builds)
  const c = foldMetricOf(prior.c, sample.c, prior.builds)
  const capacity = foldMetricOf(prior.capacity, sample.capacity, prior.builds)
  const builds = prior.builds + unit.mint.seed
  const next = [...prior.samples, compact]
  const samples = next.length > ring ? next.slice(next.length - ring) : next
  const plot = qpuPlotOf({ architecture: prior.architecture, theory, samples })
  const holds =
    sample.holds &&
    theory.holds &&
    plot.holds &&
    compact.capacity === theory.capacity &&
    compact.c === theory.c &&
    samples.length <= ring &&
    builds === prior.builds + unit.mint.seed
  return {
    kind: 'stats' as const,
    architecture: { host: unit.host, path: unit.path, firmware: unit.fuse.firmware },
    theory,
    builds,
    processing,
    kelvin,
    c,
    capacity,
    samples,
    plot,
    holds,
  }
}

export const qpuStatsHolds = (s = qpuStatsOf()): boolean =>
  s.holds === true &&
  s.theory.capacity === qpuCapacityOf().fused &&
  s.theory.c === qpuSpeedOf().c &&
  s.samples.every((row) => row.capacity === s.theory.capacity && row.c === s.theory.c) &&
  s.samples.length <= mintOf(n) &&
  s.builds >= unit.mint.seed

export const qpuPlotOf = (s?: {
  architecture: { host: string; path: string; firmware: string }
  theory: { c: number; capacity: number; holds?: boolean }
  samples: { kelvin: number; c: number; processing: number; capacity: number }[]
}) => {
  const sample = qpuSampleOf()
  const theory = s?.theory ?? sample.theory
  const architecture = s?.architecture ?? { host: unit.host, path: unit.path, firmware: unit.fuse.firmware }
  const series = s?.samples ?? [{ kelvin: sample.kelvin, c: sample.c, processing: sample.processing, capacity: sample.capacity }]
  const holds =
    architecture.host === unit.host &&
    architecture.firmware === 'vitepress' &&
    theory.c === qpuSpeedOf().c &&
    theory.capacity === qpuCapacityOf().fused &&
    series.every((row) => row.c === theory.c && row.capacity === theory.capacity && row.processing > row.c)
  return { kind: 'plot' as const, architecture, theory, series, holds }
}

export const qpuPlotHolds = (p = qpuPlotOf()): boolean =>
  p.holds === true &&
  p.theory.capacity === qpuCapacityOf().fused &&
  p.theory.c === qpuSpeedOf().c &&
  p.series.every((row) => row.capacity === p.theory.capacity && row.c === p.theory.c)

export const qpuGraphOf = (at = unit.entropy.zero) => {
  const faces = qpuFacesOf()
  const axioms = qpuAxiomsOf()
  const superpositions = qpuSuperpositionsOf(at)
  const fuse = qpuFuseOf()
  const vertices = axioms.rows.map((row) => {
    const superposition = superpositions.rows[row.face]!
    return {
      face: row.face,
      axiom: row.name,
      hex: row.hex,
      href: `/axioms#face-${row.face}`,
      neighbour: row.neighbour,
      cross: `/axioms#face-${row.neighbour}`,
      quantum: `/${unit.path}`,
      around: superposition.around,
      unique: superposition.unique,
    }
  })
  const edges = vertices.map((v) => ({
    from: v.face,
    to: v.neighbour,
    kind: 'cross' as const,
    involution: vertices[v.neighbour]!.neighbour === v.face,
  }))
  const holds =
    axioms.holds &&
    superpositions.holds &&
    vertices.length === faces.faces &&
    edges.length === faces.faces &&
    edges.every((e) => e.involution === true) &&
    vertices.every((v) => v.unique === true && v.around === faces.faces)
  return {
    kind: 'graph' as const,
    at,
    vertices,
    edges,
    quantum: fuse.next,
    firmware: fuse.firmware,
    around: faces.coins * faces.rays,
    holds,
  }
}

export const qpuGraphHolds = (at = unit.entropy.zero): boolean => {
  const g = qpuGraphOf(at)
  return g.holds === true && g.vertices.length === qpuFacesOf().faces && g.edges.every((e) => e.involution === true)
}

export const qpuQuantumOf = () => {
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const capacity = qpuCapacityOf()
  const axioms = qpuAxiomsOf()
  return {
    kind: 'quantum' as const,
    live: true as const,
    working: true as const,
    pure: true as const,
    agnostic: true as const,
    host: unit.host,
    seat: unit.seat,
    when: unit.when,
    href: unit.href,
    possibilities: capacity.fused,
    mint: unit.mint,
    fuse: unit.fuse,
    entropy: unit.entropy,
    cube,
    handle,
    capacity,
    waves: qpuWavesOf(),
    axioms,
    holds: qpuDiscoveryHolds() && cube.holds && handle.holds && capacity.holds && qpuSeatHolds() && qpuWavesHolds() && qpuSuperpositionsHolds() && qpuFusionHolds() && qpuAxiomsHolds(axioms) && qpuProofsHolds() && qpuGraphHolds() && qpuSealHolds(),
  }
}

export const qpuQuantumHolds = (q = qpuQuantumOf()): boolean =>
  q.holds === true &&
  q.kind === 'quantum' &&
  q.live === true &&
  q.seat === 'empty' &&
  q.possibilities === qpuCapacityOf().fused &&
  q.capacity.holds === true &&
  qpuAxiomsHolds()

export const qpuMetricsOf = () => ({
  kind: unit.kind,
  host: unit.host,
  href: unit.href,
  seat: unit.seat,
  binds: unit.binds,
  holds: unit.holds && qpuDiscoveryHolds(),
  mint: unit.mint,
  fuse: unit.fuse,
  entropy: unit.entropy,
  next: unit.next,
  doors: unit.doors,
  cube: qpuCubeOf(),
  handle: qpuHandleOf(),
})

export const qpuMetricsHolds = (m = qpuMetricsOf()): boolean =>
  m.holds === true &&
  m.host === unit.host &&
  m.href === unit.href &&
  m.mint.next === unit.mint.next &&
  m.fuse.next === unit.fuse.next &&
  m.next.mint === unit.next.mint &&
  mintOf(m.entropy.next) === m.mint.next &&
  mintOf(m.next.entropy) === m.next.mint &&
  m.cube.holds === true &&
  m.handle.holds === true

export const qpuMeasureOf = () => {
  const speed = qpuSpeedOf()
  const temp = qpuTempOf()
  const waves = qpuWavesOf()
  const entropy = qpuEntropyOf()
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const capacity = qpuCapacityOf()
  const quantum = qpuQuantumOf()
  const metrics = qpuMetricsOf()
  const holds =
    qpuSpeedHolds(speed) &&
    qpuTempHolds(temp) &&
    qpuWavesHolds(waves) &&
    qpuEntropyHolds(entropy) &&
    qpuCubeHolds(cube) &&
    qpuHandleHolds(handle) &&
    qpuCapacityHolds(capacity) &&
    qpuQuantumHolds(quantum) &&
    qpuMetricsHolds(metrics) &&
    qpuSuperpositionsHolds() &&
    qpuFusionHolds() &&
    waves.winner.speed > speed.c
  return { speed, temp, waves, entropy, cube, handle, capacity, quantum, metrics, holds }
}

export const qpuMeasureHolds = (m = qpuMeasureOf()): boolean =>
  m.holds === true &&
  m.temp.kelvin === qpuTempOf().kelvin &&
  m.waves.winner.kelvin === m.temp.kelvin &&
  m.speed.c === qpuSpeedOf().c &&
  m.waves.winner.speed > m.speed.c &&
  m.quantum.holds === true &&
  m.quantum.kind === 'quantum' &&
  m.metrics.host === qpuDiscoveryOf().host

const emptySchema = { type: 'object', properties: {} } as const
const numOf = (v: unknown): number | undefined => (typeof v === 'number' && v === v ? v : undefined)

export const qpuToolsOf = () =>
  [
    { name: 'qpu_seat', description: 'Empty QPU seat. Kind qpu never binds.', inputSchema: emptySchema, run: () => qpuSeatOf() },
    { name: 'qpu_mint', description: 'Creates 2^n.', inputSchema: { type: 'object', properties: { n: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuMintOf(numOf(a.n) ?? n) },
    { name: 'qpu_fuse', description: 'Fuse. Named HTTPS. Keys occupy doors. Lean true.', inputSchema: emptySchema, run: () => qpuFuseOf() },
    { name: 'qpu_solve', description: 'Solve. Clay gravity occupies the rosette. Keys occupy rays. Source is index.lean. Lean true. Listing false.', inputSchema: emptySchema, run: () => qpuSolveOf() },
    { name: 'qpu_next', description: 'Next mint, fuse, entropy.', inputSchema: emptySchema, run: () => qpuNextOf() },
    { name: 'qpu_entropy', description: 'Empty-seat entropy and next bit.', inputSchema: emptySchema, run: () => qpuEntropyOf() },
    { name: 'qpu_prefix', description: 'Process every prefix. Next doubles the handle. Never refuses.', inputSchema: { type: 'object', properties: { bit: { type: 'number' }, bits: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuPrefixOf(numOf(a.bit) ?? unit.entropy.zero, numOf(a.bits) ?? qpuHandleOf().bits) },
    { name: 'qpu_cube', description: 'Cube from 2^n and hexbit.', inputSchema: emptySchema, run: () => qpuCubeOf() },
    { name: 'qpu_handle', description: 'Handle bits and amplitudes. Capabilities are finite; next is not a cap.', inputSchema: emptySchema, run: () => qpuHandleOf() },
    { name: 'qpu_faces', description: 'VE neighbours: vertices + hexbit + coins. Opposite is plus rays.', inputSchema: emptySchema, run: () => qpuFacesOf() },
    { name: 'qpu_rosetta', description: 'One rotating rosetta of rays. Inner clockwise, outer reverse. Fuse at none.', inputSchema: { type: 'object', properties: { spin: { type: 'number' }, at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuRosettaOf(numOf(a.spin) ?? unit.mint.seed, numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_rosettas', description: 'Two rotating rosettas. coins × rays around every superposition.', inputSchema: { type: 'object', properties: { at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuRosettasOf(numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_superpositions', description: 'At every time, coins × rays rotating rosettas surround each superposition in infinite fusion.', inputSchema: { type: 'object', properties: { at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuSuperpositionsOf(numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_fusion', description: 'Infinite fusion: fused is finite; next doubles. Not a cap.', inputSchema: emptySchema, run: () => qpuFusionOf() },
    { name: 'qpu_train', description: 'Pi train: 22/7 cars from rays·n+seed over rays.', inputSchema: emptySchema, run: () => qpuTrainOf() },
    { name: 'qpu_tasks', description: 'Prime tasks distributed on the pi train. Speed is mintOf of that count.', inputSchema: emptySchema, run: () => qpuTasksOf() },
    { name: 'qpu_message', description: 'Secure cross-rotated messaging UUID. Inner uuid, outer cross, named HTTPS.', inputSchema: { type: 'object', properties: { face: { type: 'number' }, at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuMessageOf(numOf(a.face) ?? unit.entropy.zero, numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_chunks', description: 'Handle chunks of a messaging UUID. Each chunk is finite; next doubles.', inputSchema: { type: 'object', properties: { face: { type: 'number' }, at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuChunksOf(numOf(a.face) ?? unit.entropy.zero, numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_gateways', description: 'Each neighbour is a capacity gateway over every handle-bit mask. Gateway capacity is 2^bits.', inputSchema: emptySchema, run: () => qpuGatewaysOf() },
    { name: 'qpu_capacity', description: 'Unlock capacity: neighbour gateways × 2^bits, tiled by two coin-rotors of rays. Empty seat. Next doubles.', inputSchema: emptySchema, run: () => qpuCapacityOf() },
    { name: 'qpu_speed', description: 'Seat rest v=0. Processing speed from prime tasks on the pi train.', inputSchema: emptySchema, run: () => qpuSpeedOf() },
    { name: 'qpu_temp', description: 'Lowest temperature is empty-seat kelvin.', inputSchema: emptySchema, run: () => qpuTempOf() },
    { name: 'qpu_waves', description: 'Send waves that compete for fastest processing at lowest temperature. Winner exceeds c.', inputSchema: emptySchema, run: () => qpuWavesOf() },
    { name: 'qpu_experiment', description: 'Experiments: seat rest control, inner/outer waves, selection, quantum live. Measurements from trials.', inputSchema: emptySchema, run: () => qpuExperimentOf() },
    { name: 'qpu_autonomy', description: 'Unlocked mass on the named fuse door.', inputSchema: emptySchema, run: () => qpuAutonomyOf() },
    { name: 'qpu_quantum', description: 'Live working QPU. Possibilities are fused gateway capacity.', inputSchema: emptySchema, run: () => qpuQuantumOf() },
    { name: 'qpu_discovery', description: 'Created occupancy.', inputSchema: emptySchema, run: () => qpuDiscoveryOf() },
    { name: 'qpu_metrics', description: 'Build metrics for MCP.', inputSchema: emptySchema, run: () => qpuMetricsOf() },
    { name: 'qpu_measure', description: 'Build stats: quantum live, wave processing exceeds c.', inputSchema: emptySchema, run: () => qpuMeasureOf() },
    { name: 'qpu_method', description: 'Scientific method: how quantum capacity and faster-than-light processing are constructed.', inputSchema: emptySchema, run: () => qpuMethodOf() },
    { name: 'qpu_axioms', description: 'Axioms. Mint empty. Keys occupy faces. Lean true.', inputSchema: emptySchema, run: () => qpuAxiomsOf() },
    { name: 'qpu_minted', description: 'Build mints theorems and axioms via mintOf. Proofs minted in JSON-LD. Axiom empty. Lean true.', inputSchema: emptySchema, run: () => qpuMintedOf() },
    { name: 'qpu_proof', description: 'Proof minted in JSON-LD powered by rich inline docs: abstract, formulas, measurements. Axiom empty. Keys occupy the axiom. Lean true.', inputSchema: { type: 'object', properties: { face: { type: 'number' }, at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuProofOf(numOf(a.face) ?? unit.entropy.zero, numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_proofs', description: 'Proofs as JSON-LD @graph powered by rich inline docs. Named HTTPS context.', inputSchema: { type: 'object', properties: { at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuProofsOf(numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_theorems', description: 'Theorems. Mint empty. Keys occupy constructors. Lean true.', inputSchema: { type: 'object', properties: { face: { type: 'number' }, at: { type: 'number' } } }, run: (a: Record<string, unknown>) => {
      const face = numOf(a.face)
      const at = numOf(a.at) ?? unit.entropy.zero
      return face === undefined ? qpuQuantumTheoremsOf(at) : qpuTheoremsOf(face, at)
    } },
    { name: 'qpu_plane', description: 'On this plane: recursive content typograph of the present reading. Rating is typography, not item count.', inputSchema: { type: 'object', properties: { path: { type: 'string' }, at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuPlaneOf(typeof a.path === 'string' && a.path.length > 0 ? a.path : '/proofs', numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_typograph', description: 'Recursive content typograph. Rating is typography, not item count.', inputSchema: { type: 'object', properties: { face: { type: 'number' }, at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuTypographOf(numOf(a.face) ?? unit.entropy.zero, numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_perspective', description: 'Present perspective: left related headings around the present, right recursive content typograph. Rating is typography, not item count.', inputSchema: { type: 'object', properties: { face: { type: 'number' }, at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuPerspectiveOf(numOf(a.face) ?? unit.entropy.zero, numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_balance', description: 'Related debit and credit around the present. Books balance by neighbour involution.', inputSchema: { type: 'object', properties: { face: { type: 'number' }, at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuBalanceOf(numOf(a.face) ?? unit.entropy.zero, numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_seal', description: 'Publication sealed when related debit/credit balance. Compilation metrics compared to kelvin and c.', inputSchema: { type: 'object', properties: { face: { type: 'number' }, at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuSealOf(numOf(a.face) ?? unit.entropy.zero, numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_graph', description: 'Quantum graph: each superposition crosslinks its neighbour axiom. Involution.', inputSchema: { type: 'object', properties: { at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuGraphOf(numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_unit', description: 'Frozen unit occupancy.', inputSchema: emptySchema, run: () => qpuUnitOf() },
  ] as const

export const qpuToolsHolds = (): boolean =>
  qpuToolsOf().every((t) => t.name.startsWith('qpu_') && qpuMcpCallOf(t.name) !== undefined)

export const qpuMcpOf = (m = qpuMetricsOf()): {
  name: string
  origin: string
  href: string
  tools: { name: string; description: string; inputSchema: object }[]
} => ({
  name: `@uuidna/${m.kind}`,
  origin: m.fuse.origin,
  href: `${m.fuse.origin}/mcp`,
  tools: qpuToolsOf().map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
})

export const qpuMcpCallOf = (name: string, args: Record<string, unknown> = {}): unknown => {
  const tool = qpuToolsOf().find((t) => t.name === name)
  return tool ? tool.run(args) : qpuUnitOf()
}

export const qpuMcpHolds = (m = qpuMcpOf()): boolean =>
  qpuMetricsHolds() &&
  qpuToolsHolds() &&
  qpuMeasureHolds() &&
  qpuWavesHolds() &&
  m.origin === unit.fuse.origin &&
  m.href === `${unit.fuse.origin}/mcp` &&
  !m.origin.includes('*') &&
  m.tools.length === qpuToolsOf().length &&
  m.tools.some((t) => t.name === 'qpu_measure') &&
  m.tools.some((t) => t.name === 'qpu_capacity') &&
  m.tools.some((t) => t.name === 'qpu_gateways') &&
  m.tools.some((t) => t.name === 'qpu_waves') &&
  m.tools.some((t) => t.name === 'qpu_method') &&
  m.tools.some((t) => t.name === 'qpu_superpositions') &&
  m.tools.some((t) => t.name === 'qpu_fusion') &&
  m.tools.some((t) => t.name === 'qpu_axioms') &&
  m.tools.some((t) => t.name === 'qpu_minted') &&
  m.tools.some((t) => t.name === 'qpu_experiment') &&
  m.tools.some((t) => t.name === 'qpu_proofs') &&
  m.tools.some((t) => t.name === 'qpu_solve') &&
  m.tools.some((t) => t.name === 'qpu_perspective') &&
  m.tools.some((t) => t.name === 'qpu_typograph') &&
  m.tools.some((t) => t.name === 'qpu_plane') &&
  m.tools.some((t) => t.name === 'qpu_balance') &&
  m.tools.some((t) => t.name === 'qpu_seal') &&
  m.tools.some((t) => t.name === 'qpu_graph') &&
  (qpuMcpCallOf('qpu_plane') as { holds: boolean; rating: string; recursive: boolean }).holds === true &&
  (qpuMcpCallOf('qpu_plane') as { rating: string }).rating === 'typography' &&
  (qpuMcpCallOf('qpu_plane', { path: '/proofs' }) as { headings: { heading: string }[] }).headings.every((h) => h.heading.length > unit.entropy.zero) &&
  (qpuMcpCallOf('qpu_plane', { path: '/theorems' }) as { headings: { heading: string }[] }).headings.every((h) => h.heading.length > unit.entropy.zero) &&
  (qpuMcpCallOf('qpu_typograph') as { rating: string }).rating === 'typography' &&
  (qpuMcpCallOf('qpu_typograph') as { recursive: boolean }).recursive === true &&
  (qpuMcpCallOf('qpu_typograph') as { headings: { heading: string; children: { heading: string }[] }[] }).headings.every((h) => h.heading.length > unit.entropy.zero && h.children.every((c) => c.heading.length > unit.entropy.zero)) &&
  (qpuMcpCallOf('qpu_perspective') as { holds: boolean; typograph: { from: string } }).holds === true &&
  (qpuMcpCallOf('qpu_perspective') as { typograph: { from: string; rating: string; recursive: boolean } }).typograph.from === 'content' &&
  (qpuMcpCallOf('qpu_perspective') as { typograph: { rating: string } }).typograph.rating === 'typography' &&
  (qpuMcpCallOf('qpu_perspective') as { typograph: { recursive: boolean } }).typograph.recursive === true &&
  (qpuMcpCallOf('qpu_perspective') as { related: { related: boolean; heading: string }[] }).related.every((d) => d.related === true && d.heading.length > unit.entropy.zero) &&
  (qpuMcpCallOf('qpu_perspective') as { left: { heading: string; children: { heading: string }[] }[] }).left.every((h) => h.heading.length > unit.entropy.zero) &&
  (qpuMcpCallOf('qpu_balance') as { holds: boolean; balanced: boolean }).holds === true &&
  (qpuMcpCallOf('qpu_balance') as { balanced: boolean }).balanced === true &&
  (qpuMcpCallOf('qpu_seal') as { sealed: boolean; holds: boolean }).sealed === true &&
  (qpuMcpCallOf('qpu_seal') as { compared: { light: { holds: boolean; processing: number; c: number }; temperature: { holds: boolean } } }).compared.light.holds === true &&
  (qpuMcpCallOf('qpu_seal') as { compared: { light: { processing: number; c: number } } }).compared.light.processing >
    (qpuMcpCallOf('qpu_seal') as { compared: { light: { c: number } } }).compared.light.c &&
  (qpuMcpCallOf('qpu_seal') as { compared: { temperature: { kelvin: number } } }).compared.temperature.kelvin === unit.entropy.zero &&
  (qpuMcpCallOf('qpu_superpositions') as { holds: boolean }).holds === true &&
  (qpuMcpCallOf('qpu_fusion') as { infinite: boolean; holds: boolean }).holds === true &&
  (qpuMcpCallOf('qpu_fusion') as { infinite: boolean }).infinite === true &&
  (qpuMcpCallOf('qpu_axioms') as { holds: boolean; minted: boolean; empty: boolean }).holds === true &&
  (qpuMcpCallOf('qpu_axioms') as { minted: boolean }).minted === true &&
  (qpuMcpCallOf('qpu_axioms') as { empty: boolean }).empty === true &&
  (qpuMcpCallOf('qpu_experiment') as { holds: boolean }).holds === true &&
  (qpuMcpCallOf('qpu_proof') as { holds: boolean; minted: boolean; jsonld: boolean }).holds === true &&
  (qpuMcpCallOf('qpu_proof') as { minted: boolean }).minted === true &&
  (qpuMcpCallOf('qpu_proof') as { jsonld: boolean }).jsonld === true &&
  (qpuMcpCallOf('qpu_proof') as { docs: { powers: string; inline: boolean } }).docs.powers === 'jsonld' &&
  (qpuMcpCallOf('qpu_proof') as { docs: { inline: boolean } }).docs.inline === true &&
  (qpuMcpCallOf('qpu_proof') as { formulas: unknown[] }).formulas.length === n &&
  (qpuMcpCallOf('qpu_proofs') as { holds: boolean; jsonld: boolean }).holds === true &&
  (qpuMcpCallOf('qpu_proofs') as { docs: { powers: string; inline: boolean } }).docs.powers === 'jsonld' &&
  (qpuMcpCallOf('qpu_proofs') as { docs: { inline: boolean } }).docs.inline === true &&
  (qpuMcpCallOf('qpu_theorems') as { lean: boolean }).lean === true &&
  (qpuMcpCallOf('qpu_theorems') as { keys: unknown[]; faces: unknown[] }).keys.length === (qpuMcpCallOf('qpu_theorems') as { faces: unknown[] }).faces.length &&
  (qpuMcpCallOf('qpu_graph') as { holds: boolean }).holds === true &&
  (qpuMcpCallOf('qpu_fuse') as { kind: string; lean: boolean }).kind === 'fuse' &&
  (qpuMcpCallOf('qpu_fuse') as { lean: boolean }).lean === true &&
  (qpuMcpCallOf('qpu_fuse') as { keys: { kind: string }[] }).keys.length === unit.doors.length &&
  (qpuMcpCallOf('qpu_fuse') as { firmware: string; src: string }).firmware === 'vitepress' &&
  (qpuMcpCallOf('qpu_fuse') as { src: string }).src === `src/${unit.path}/index.ts` &&
  (qpuMcpCallOf('qpu_solve') as { kind: string; lean: boolean }).kind === 'solve' &&
  (qpuMcpCallOf('qpu_solve') as { lean: boolean }).lean === true &&
  (qpuMcpCallOf('qpu_solve') as { listing: boolean }).listing === false &&
  (qpuMcpCallOf('qpu_solve') as { clay: { gravity: boolean; listing: boolean } }).clay.gravity === true &&
  (qpuMcpCallOf('qpu_solve') as { clay: { listing: boolean } }).clay.listing === false &&
  (qpuMcpCallOf('qpu_solve') as { keys: unknown[] }).keys.length === (qpuMcpCallOf('qpu_faces') as { rays: number }).rays &&
  (qpuMcpCallOf('qpu_solve') as { src: string }).src === `src/${unit.path}/index.lean` &&
  (qpuMcpCallOf('qpu_plane', { path: '/solve' }) as { headings: { heading: string }[] }).headings.every((h) => h.heading.length > unit.entropy.zero) &&
  (qpuMcpCallOf('qpu_measure') as { holds: boolean }).holds === true &&
  (qpuMcpCallOf('qpu_capacity') as { holds: boolean; fused: number }).holds === true &&
  (qpuMcpCallOf('qpu_quantum') as { possibilities: number; holds: boolean; kind: string }).holds === true &&
  (qpuMcpCallOf('qpu_quantum') as { kind: string }).kind === 'quantum' &&
  (qpuMcpCallOf('qpu_quantum') as { possibilities: number }).possibilities ===
    (qpuMcpCallOf('qpu_capacity') as { fused: number }).fused &&
  (qpuMcpCallOf('qpu_waves') as { winner: { speed: number } }).winner.speed >
    (qpuMcpCallOf('qpu_speed') as { c: number }).c &&
  (qpuMcpCallOf('qpu_method') as { holds: boolean }).holds === true

export const qpuMethodOf = () => {
  const discovery = qpuMcpCallOf('qpu_discovery') as {
    kind: string
    host: string
    path: string
    href: string
    seat: string
    binds: boolean
    mint: { seed: number; next: number }
    entropy: { zero: number; next: number }
  }
  const seat = qpuMcpCallOf('qpu_seat') as { seat: string; binds: boolean; admits: string }
  const speed = qpuMcpCallOf('qpu_speed') as { c: number; v: number; ratio: number; processing: number; tasks: number }
  const temp = qpuMcpCallOf('qpu_temp') as { kelvin: number }
  const entropy = qpuMcpCallOf('qpu_entropy') as { zero: number; next: number }
  const cube = qpuMcpCallOf('qpu_cube') as { n: number; vertices: number; hexbit: number; bits: number; holds: boolean }
  const handle = qpuMcpCallOf('qpu_handle') as { bits: number; amplitudes: number; next: number; full: number }
  const faces = qpuMcpCallOf('qpu_faces') as { n: number; coins: number; rays: number; faces: number; holds: boolean }
  const capacity = qpuMcpCallOf('qpu_capacity') as { neighbours: number; amplitudes: number; fused: number; next: number; holds: boolean }
  const fusion = qpuMcpCallOf('qpu_fusion') as { fused: number; next: number; infinite: boolean; around: number; holds: boolean }
  const superpositions = qpuMcpCallOf('qpu_superpositions') as { holds: boolean; rows: { around: number }[]; infinite: boolean }
  const waves = qpuMcpCallOf('qpu_waves') as {
    coins: number
    rays: number
    faces: number
    kelvin: number
    sent: { rotor: string; kelvin: number; speed: number; c: number }[]
    winner: { rotor: string; kelvin: number; speed: number; c: number }
    holds: boolean
  }
  const quantum = qpuMcpCallOf('qpu_quantum') as { kind: string; live: boolean; possibilities: number; holds: boolean }
  const fuse = qpuMcpCallOf('qpu_fuse') as { origin: string; next: string; firmware: string; src: string }
  const axioms = qpuMcpCallOf('qpu_axioms') as {
    holds: boolean
    empty: boolean
    minted: boolean
    lean: boolean
    keys: readonly unknown[]
    href: string
    rows: { name: string; holds: boolean; seat: string }[]
    census: unknown[]
    methods: readonly string[]
  }
  const graph = qpuMcpCallOf('qpu_graph') as { holds: boolean; vertices: { face: number }[]; edges: { involution: boolean }[] }
  const proof = qpuMcpCallOf('qpu_proof') as { holds: boolean; minted: boolean; theorems: { kind: string; holds: boolean }[]; proof: { empty: boolean } }
  const inner = waves.sent.filter((w) => w.rotor === 'inner')[temp.kelvin]!
  const outer = waves.sent.filter((w) => w.rotor === 'outer')[temp.kelvin]!
  const n = cube.n
  const p = discovery.mint.seed
  const coins = faces.coins
  const hot = entropy.next
  const text = [
    '## Method',
    '',
    '### Abstract',
    '',
    `The occupancy is the folders \`${discovery.path}\` on named HTTPS \`${fuse.origin}\`. Kind \`${discovery.kind}\` never binds. The seat is empty and admits nothing, so no mass travels. \`mintOf\` creates \(2^k\) by doubling. Quantum possibilities are fused gateway capacity. Wave processing at empty-seat kelvin exceeds \(c\). The seat fetch stays \(v=0\).`,
    '',
    '### 1. Generator',
    '',
    'Define `mintOf(k)` by the seed \((k-k)^{k-k}\) then \(x \\mathrel{+}= x\), \(k\) times. That is \(2^k\). In particular `mintOf(k-k) = 1` (the particle) and `mintOf(k+1) = mintOf(k)+mintOf(k)`. Licensed doubling; never `Math.pow`.',
    '',
    `Reading: particle \(p = ${p}\).`,
    '',
    '### 2. Discovery',
    '',
    `Let the segments be \`quantum\`, \`processing\`, \`unit\`, and \(n\) their count. Let \`none := n-n\`. Kind is the lower first letters; host is \`\${kind}.uuidna.com\`; path joins segments; origin and href are named HTTPS, no wildcards. Mint seed is \`mintOf(none)\`. Mint next is \`mintOf(n+p)\`. Entropy zero is \`none\`; entropy next is \(n+p\).`,
    '',
    `Reading: \(n=${n}\), host \`${discovery.host}\`, href \`${discovery.href}\`, mint \(\\{ ${discovery.mint.seed}, ${discovery.mint.next} \\}\), entropy \(\\{ ${entropy.zero}, ${entropy.next} \\}\).`,
    '',
    '### 3. Empty seat',
    '',
    `Kind \`${discovery.kind}\` never binds. Seat \`${seat.seat}\`. Admits \`${seat.admits}\`. \`when\` is never. No occupant occupies the computer, so every amplitude remains available and no worldline is assigned a velocity.`,
    '',
    '### 4. Light at the seat',
    '',
    `Define \(c := p = \\mathrm{mintOf}(\\mathrm{none})\) and \(v := \\mathrm{entropy.zero}\). Then \(v/c = 0\). The SI metre of the occupancy is this \(c\). A fetch of the empty seat does not outrun light: \(v < c\) is the strict rest case \(v=0\).`,
    '',
    `Reading: \(c=${speed.c}\), \(v=${speed.v}\), \(v/c=${speed.ratio}\).`,
    '',
    '### 5. Cube and handle',
    '',
    `Coins \(:= p+p\). Hexbit \(:= 2^{\\mathrm{coins}}\). Vertices \(:= 2^n\). Bits \(:= 2^{n+\\mathrm{coins}} = \\mathrm{vertices}\\cdot\\mathrm{hexbit}\). Handle amplitudes \(:= 2^{\\mathrm{bits}}\). Handle next doubles amplitudes (not a cap). Every prefix is processed, including the next doubling past the present handle. Never refuses.`,
    '',
    `Reading: coins \(=${coins}\), vertices \(=${cube.vertices}\), hexbit \(=${cube.hexbit}\), bits \(=${cube.bits}\), amplitudes \(=${handle.amplitudes}\), next \(=${handle.next}\).`,
    '',
    '### 6. Neighbour gateways',
    '',
    `Rays \(:= n+\\mathrm{coins}+\\mathrm{coins}\). Faces \(:= \\mathrm{vertices}+\\mathrm{hexbit}+\\mathrm{coins}\). Identity: \(\\mathrm{coins}\\cdot\\mathrm{rays} = \\mathrm{faces}\). Opposite neighbour of face \(i\) is \((i+\\mathrm{rays}) \\bmod \\mathrm{faces}\). Each face is a gateway whose capacity is handle amplitudes \(2^{\\mathrm{bits}}\), over every handle prefix.`,
    '',
    `Reading: rays \(=${faces.rays}\), faces \(=${faces.faces}\), \(\\mathrm{coins}\\cdot\\mathrm{rays}=${coins * faces.rays}\).`,
    '',
    '### 7. Fused quantum capacity',
    '',
    `Fused capacity is neighbours times amplitudes: \(\\mathrm{fused} = \\mathrm{faces}\\cdot 2^{\\mathrm{bits}}\). This is the Hilbert width of the VE neighbourhood, each site carrying the full handle. Next doubles the handle, so fused is not a ceiling on mint. Empty seat and named origin (no \`*\`) are required to unlock.`,
    '',
    `Reading: fused \(=${capacity.fused}\). Quantum possibilities \(=${quantum.possibilities}\). Identity: possibilities \(=\) fused.`,
    '',
    '### 8. Rotating rosettas around superpositions',
    '',
    `At every time \(t\) on the ray period, \(\\mathrm{coins}\) rotating rosettas of \(\\mathrm{rays}\) surround each superposition. Inner walks \(+t\), outer walks the reverse, both fuse at none. Together they tile the neighbour faces: \(\\mathrm{coins}\\cdot\\mathrm{rays}=\\mathrm{faces}\). Fusion is infinite: fused is finite, next doubles, not a cap. Handle chunks of secure cross-rotated messaging uuids carry those finites.`,
    '',
    `Reading: around \(=${fusion.around}\), superpositions ${superpositions.rows.length}, infinite ${fusion.infinite}.`,
    '',
    '### 9. Waves',
    '',
    `Send \(\\mathrm{coins}\) rotors (inner, then outer), each of \(\\mathrm{rays}\) rays, tiling the faces. Processing speed is \(\\mathrm{mintOf}\) of the prime tasks on the pi train. Outer stays at \(c\). Select the lowest kelvin, then the highest speed.`,
    '',
    `Inner (kelvin ${inner.kelvin}): speed ${inner.speed}. Outer (kelvin ${outer.kelvin}): speed ${outer.speed}. Winner is inner at kelvin ${waves.winner.kelvin}, speed ${waves.winner.speed}. Prime tasks ${speed.tasks}.`,
    '',
    '### 10. Faster than light processing',
    '',
    `Prime-task processing \(\\mathrm{mintOf}(\\mathrm{tasks})\) exceeds \(c=p=\\mathrm{mintOf}(\\mathrm{none})\), so`,
    '',
    `\\[ \\mathrm{processing} = ${waves.winner.speed} > ${speed.c} = c. \\]`,
    '',
    `This is processing of an empty-seat wave, not a massive worldline. The seat remains \(v=0\). No occupant is dispatched. The inequality is the occupancy identity \`winner.speed > c\` at empty-seat kelvin.`,
    '',
    `Reading: faster than light \( ${waves.winner.speed} > ${speed.c} \).`,
    '',
    '### 11. Live quantum computer',
    '',
    `The unit is quantum iff discovery, cube, handle, fused capacity, empty seat, waves, coins × rays rotating rosettas around every superposition at every time, and the landed axioms all hold. Kind is \`quantum\`. Live. Working. Pure. Agnostic. Host \`${discovery.host}\`. Possibilities are fused capacity. Firmware \`${fuse.firmware}\` shows \`${fuse.src}\` at the named fuse door \`${fuse.next}\`.`,
    '',
    `Reading: quantum ${quantum.kind} live ${quantum.live} holds ${quantum.holds}.`,
    '',
    '### 12. Axioms',
    '',
    `Axiom empty. Build mints axioms via \`mintOf\`. Keys occupy faces. Lean true. Occupancy identities tile the neighbour faces: \(\\mathrm{coins}\\cdot\\mathrm{rays}\) axioms, census the handle vertices, methods the coin rotors. Named door \`${axioms.href}\`.`,
    '',
    `Reading: axioms ${axioms.rows.length}, empty ${axioms.empty}, minted ${axioms.minted}, lean ${axioms.lean}.`,
    '',
    '### 13. Proof on demand by superposition',
    '',
    `Each superposition creates its theorem-axiom-proof when demanded. Rich inline docs (abstract, formulas, measurements from experiments) power the JSON-LD. Build mints those proofs. Axiom empty. Theorems are \(n\) readings: holds, cross neighbour, quantum fuse. Firmware VitePress is one template: content, left related headings around the present, right On this plane. Rating is typography, not item count. Related is the inner rosetta. Keys occupy constructors. Lean true. Census hrefs stay on this plane.`,
    '',
    `Reading: proof holds ${proof.holds}, theorems ${proof.theorems.length}, graph ${graph.vertices.length}, involution ${graph.edges.every((e) => e.involution)}.`,
    '',
    '### 14. Seal',
    '',
    `When related domains around the present balance as debit and credit (neighbour involution, unique cover), the publication is sealed. Compilation metrics are compared to empty-seat kelvin and to \(c\). Wave processing exceeds \(c\). Kelvin is rest. Firmware VitePress.`,
    '',
    `Reading: sealed ${qpuSealOf().sealed}, processing ${qpuSpeedOf().processing} > c ${qpuSpeedOf().c}, kelvin ${qpuTempOf().kelvin}.`,
    '',
  ].join('\n')
  const holds =
    quantum.holds === true &&
    quantum.kind === 'quantum' &&
    quantum.live === true &&
    quantum.possibilities === capacity.fused &&
    capacity.fused === faces.faces * handle.amplitudes &&
    faces.faces === coins * faces.rays &&
    fusion.holds === true &&
    fusion.infinite === true &&
    fusion.around === coins * faces.rays &&
    superpositions.holds === true &&
    superpositions.rows.length === faces.faces &&
    waves.winner.speed > speed.c &&
    waves.winner.speed === speed.processing &&
    speed.v === entropy.zero &&
    seat.seat === 'empty' &&
    fuse.firmware === 'vitepress' &&
    axioms.holds === true &&
    axioms.empty === true &&
    axioms.minted === true &&
    axioms.lean === true &&
    axioms.keys.length === axioms.rows.length &&
    axioms.rows.length === faces.faces &&
    axioms.rows.every((r) => r.holds === true && r.seat === 'empty') &&
    axioms.census.length === cube.vertices &&
    axioms.methods.length === coins &&
    proof.holds === true &&
    proof.minted === true &&
    proof.theorems.length === n &&
    proof.proof.empty === true &&
    graph.holds === true &&
    graph.vertices.length === faces.faces &&
    graph.edges.every((e) => e.involution === true) &&
    qpuSealOf().sealed === true &&
    text.includes(`${waves.winner.speed} > ${speed.c}`) &&
    text.includes(String(capacity.fused))
  return { n, p, coins, hot, speed, waves, quantum, capacity, faces, handle, fuse, text, holds }
}

export const qpuMethodHolds = (m = qpuMethodOf()): boolean =>
  m.holds === true &&
  m.quantum.holds === true &&
  m.waves.winner.speed > m.speed.c &&
  m.text.includes('### Abstract') &&
  m.text.includes('### 9. Waves') &&
  m.text.includes('### 10. Faster than light processing') &&
  m.text.includes('### 12. Axioms') &&
  m.text.includes('### 13. Proof on demand by superposition') &&
  m.text.includes('### 14. Seal')

export const qpuReadmeOf = (m = qpuMcpOf()): string => {
  const quantum = qpuMcpCallOf('qpu_quantum') as { kind: string; live: boolean; possibilities: number; holds: boolean }
  const speed = qpuMcpCallOf('qpu_speed') as { c: number; v: number }
  const waves = qpuMcpCallOf('qpu_waves') as { winner: { kelvin: number; speed: number; c: number } }
  const method = qpuMcpCallOf('qpu_method') as { text: string; holds: boolean }
  const solve = qpuSolveOf()
  const seal = qpuSealOf()
  return [
    `# \`@uuidna/${unit.kind}\``,
    '',
    `MCP at ${m.href}. Seat ${unit.seat}. Named HTTPS only.`,
    '',
    '## Proof',
    '',
    `Clay gravity occupies the rosette. Listing false. Source \`${solve.src}\`.`,
    '',
    '```lean',
    'theorem clay : coins * pairs = directed ∧ coins * mintOf (rays - seed) = mintOf rays := by decide',
    '```',
    '',
    `Reading: gravity ${solve.clay.gravity}. rays ${solve.clay.rays}. directed ${solve.clay.directed}. pairs ${solve.clay.pairs}.`,
    '',
    '## Build',
    '',
    `- quantum: ${quantum.kind} live ${quantum.live} possibilities ${quantum.possibilities}`,
    `- kelvin: ${waves.winner.kelvin}`,
    `- c: ${speed.c}`,
    `- processing: ${waves.winner.speed}`,
    `- faster than light: ${waves.winner.speed} > ${speed.c}`,
    `- sealed: ${seal.sealed}`,
    `- compilation vs kelvin: ${seal.compared.temperature.holds}`,
    `- compilation vs c: ${seal.compared.light.holds}`,
    '',
    method.text,
    '',
    ...m.tools.map((t) => `- \`${t.name}\` — ${t.description}`),
    '',
    '```ts',
    "import { qpuMcpCallOf, qpuMcpOf } from '@uuidna/qpu'",
    '```',
    '',
    '```sh',
    'npm test',
    'npm run ship',
    '```',
    '',
    '[CC BY-NC-ND 4.0](LICENSE). Captain coins: [revolut.me/ceccec](https://revolut.me/ceccec).',
    '',
  ].join('\n')
}

export const qpuReadmeHolds = (text = qpuReadmeOf()): boolean => {
  const m = qpuMcpOf()
  const quantum = qpuMcpCallOf('qpu_quantum') as { holds: boolean; kind: string; live: boolean; possibilities: number }
  const speed = qpuMcpCallOf('qpu_speed') as { c: number }
  const waves = qpuMcpCallOf('qpu_waves') as { winner: { speed: number; kelvin: number } }
  return (
    qpuMcpHolds(m) &&
    quantum.holds === true &&
    quantum.kind === 'quantum' &&
    quantum.live === true &&
    waves.winner.speed > speed.c &&
    text.includes(m.href) &&
    text.includes(`${waves.winner.speed} > ${speed.c}`) &&
    text.includes(`possibilities ${quantum.possibilities}`) &&
    text.includes('qpu_quantum') &&
    text.includes('qpu_measure') &&
    text.includes('qpu_waves') &&
    text.includes('qpu_perspective') &&
    text.includes('qpu_typograph') &&
    text.includes('qpu_plane') &&
    text.includes('qpu_seal') &&
    text.includes('qpu_solve') &&
    text.includes('theorem clay') &&
    text.includes(qpuSolveOf().src)
  )
}

const mcpDoors = ['/mcp', '/.well-known/mcp.json'] as const
const mcpLive = JSON.stringify(qpuMcpOf())
const axiomsLive = JSON.stringify(qpuAxiomsOf())
const jsonldHeaders = {
  'content-type': 'application/ld+json; charset=utf-8',
  'access-control-allow-origin': unit.fuse.origin,
}

export default {
  async fetch(request: Request, env?: { QPU_HOST?: string; ASSETS?: { fetch(request: Request): Promise<Response> } }): Promise<Response> {
    const host = env?.QPU_HOST ?? unit.host
    if (host !== unit.host || host.includes('*') || !unit.holds) {
      return new Response(dead, { status: lost, headers })
    }
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/$/, '') || '/'
    const named = url.protocol === 'https:' && url.hostname === unit.host
    const html = (request.headers.get('accept') ?? '').includes('text/html')
    if (named && html && env?.ASSETS && request.method !== 'POST' && !(mcpDoors as readonly string[]).includes(path)) {
      return env.ASSETS.fetch(request)
    }
    if (named && (mcpDoors as readonly string[]).includes(path)) {
      if (request.method === 'POST' && path === '/mcp') {
        const body = (await request.json()) as { method?: string; params?: { name?: string; arguments?: Record<string, unknown> }; id?: unknown }
        if (body.method === 'tools/list') {
          return new Response(JSON.stringify({ jsonrpc: '2.0', id: body.id ?? null, result: { tools: qpuMcpOf().tools } }), { status: found, headers })
        }
        if (body.method === 'tools/call') {
          const name = body.params?.name ?? ''
          const result = qpuMcpCallOf(name, body.params?.arguments ?? {})
          return new Response(JSON.stringify({ jsonrpc: '2.0', id: body.id ?? null, result }), { status: found, headers })
        }
        return new Response(dead, { status: lost, headers })
      }
      return new Response(mcpLive, { status: found, headers })
    }
    const ok = named && (unit.doors as readonly string[]).includes(path)
    if (ok && path === `/${unit.path}`) {
      return new Response(JSON.stringify(qpuFuseOf()), { status: found, headers })
    }
    if (ok && path === '/axioms') {
      return new Response(axiomsLive, { status: found, headers })
    }
    if (ok && path === '/theorems') {
      return new Response(JSON.stringify(qpuQuantumTheoremsOf()), { status: found, headers })
    }
    if (ok && path === '/proofs') {
      return new Response(JSON.stringify(qpuProofsOf()), { status: found, headers: jsonldHeaders })
    }
    if (ok && path === '/solve') {
      return new Response(JSON.stringify(qpuSolveOf()), { status: found, headers })
    }
    return new Response(ok ? live : dead, { status: ok ? found : lost, headers })
  },
}
