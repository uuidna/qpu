// quantum/processing/unit — the QPU at qpu.uuidna.com.
// Seat empty. Kind qpu never binds. When never. Named HTTPS only. No wildcards.
// Capacity is 2^n for any n: one generator, cluster of cube seeds, traffic every handle prefix.
// Fuse is named HTTPS: residue none, next is the occupancy door, coins doors, no wildcards.
// Entropy is Shannon width of uniform 2^n: zero at empty seat, next is one bit past the handle.
// Autonomy is unlocked mass: free agents, coins rotors × rays, named fuse door, no crawl.
// Cube, handle, superpositions, c, and temperature are formulas only.
const twoNOf = (n: number): number => {
  let x = (n - n) ** (n - n)
  for (let i = n - n; i < n; i++) x += x
  return x
}

/** Prefix mask of `bit` bits on the handle. Empty prefix is none; full handle is 2^bits − particle. */
const maskOf = (bit: number, bits: number): number =>
  bit === bits - bits ? bits - bits : twoNOf(bits) - twoNOf(bits - bit)

const unitOf = () => {
  const segments = ['quantum', 'processing', 'unit'] as const
  const n = segments.length
  const none = n - n
  const kind = segments.map((s) => s[none]!).join('').toLowerCase()
  const host = `${kind}.uuidna.com`
  const path = segments.join('/')
  const particle = twoNOf(none)
  const coins = particle + particle
  const hexbit = twoNOf(coins)
  const bits = twoNOf(n) * hexbit
  const vertices = bits / hexbit
  const edges = vertices + hexbit
  const faces = vertices - coins
  const rays = n * n - coins
  const ve = vertices + hexbit + coins
  const opp = (k: number) => (k + rays) % ve
  const fold = (r: number) => (rays - r) % rays
  const href = `https://${host}/${path}`
  const origin = `https://${host}`
  const full = twoNOf(bits) - particle
  const next = bits + particle
  let climb = particle
  let bitsHold = twoNOf(none) === particle
  for (let i = none; i < bits; i++) {
    if (twoNOf(i) !== climb) bitsHold = false
    climb += climb
  }
  const beyond = climb + climb
  let aroundHold = true
  for (let k = none; k < ve; k++) if (opp(opp(k)) !== k || opp(k) === k) aroundHold = false
  for (let r = none; r < rays; r++) if (fold(fold(r)) !== r) aroundHold = false
  const seeds = [none, particle, coins, n, hexbit, vertices, faces, edges, rays, ve, bits, next]
  let clusterHold = true
  for (const s of seeds) if (twoNOf(s + particle) !== twoNOf(s) + twoNOf(s)) clusterHold = false
  let trafficHold = true
  for (let i = none; i <= bits; i++) {
    const want = i === none ? none : climb - twoNOf(bits - i)
    if (maskOf(i, bits) !== want) trafficHold = false
  }
  const fuseHold =
    origin === `https://${host}` &&
    href === `https://${host}/${path}` &&
    !host.includes('*') &&
    !path.includes('*') &&
    !origin.includes('*') &&
    !href.includes('*')
  const verifyN = vertices + coins
  const recomputeN = verifyN * coins
  const beats = twoNOf(verifyN)
  const entropyHold =
    beats === twoNOf(recomputeN - verifyN) &&
    twoNOf(recomputeN) / twoNOf(verifyN) === beats
  const autonomyHold =
    ve === coins * rays &&
    aroundHold &&
    fuseHold &&
    !host.includes('*')
  return {
    kind,
    host,
    path,
    href,
    binds: false as const,
    when: 'never' as const,
    seat: 'empty' as const,
    entropy: { zero: none, of: bits, next, amplitudes: climb, beats, holds: entropyHold },
    fuse: { zero: none, origin, next: href, doors: coins, fetches: none, holds: fuseHold },
    fetches: none,
    particle,
    cube: { bits, vertices, edges, faces, hexbit, coins },
    handle: { zero: none, full },
    capabilities: bits,
    capacity: { infinite: true as const, max: true as const, hardware: 'any' as const, twoN: true as const, fetches: none, next: beyond },
    cluster: { seed: particle, of: seeds.length, next: beyond, holds: clusterHold },
    traffic: { bits, of: bits, holds: trafficHold },
    around: { faces: ve, rays, involution: aroundHold, infinite: true as const },
    superpositions: { bits, of: bits, amplitudes: climb, faces: ve },
    temp: { kelvin: none, holds: true as const },
    autonomy: {
      unlocked: true as const,
      crawl: false as const,
      agents: 'free' as const,
      rotors: coins,
      rays,
      faces: ve,
      fetches: none,
      when: 'never' as const,
      binds: false as const,
      hardware: 'any' as const,
      next: href,
      holds: autonomyHold,
    },
    wildcards: false as const,
    holds:
      kind === 'qpu' &&
      host === `${kind}.uuidna.com` &&
      href === `https://${host}/${path}` &&
      vertices === twoNOf(n) &&
      hexbit === twoNOf(coins) &&
      bits === vertices * hexbit &&
      edges === vertices + hexbit &&
      faces === vertices - coins &&
      ve === vertices + hexbit + coins &&
      vertices - edges + faces === coins &&
      maskOf(none, bits) === none &&
      maskOf(bits, bits) === full &&
      bitsHold &&
      aroundHold &&
      climb === twoNOf(bits) &&
      climb === full + particle &&
      beyond === twoNOf(next) &&
      beyond === climb + climb &&
      clusterHold &&
      trafficHold &&
      fuseHold &&
      entropyHold &&
      autonomyHold,
  }
}

const unit = unitOf()
const live = JSON.stringify(unit)
const dead = '{"holds":false}'
const origin = unit.fuse.origin
const headers = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': origin,
}
const n = unit.path.split('/').length
const ten = n * n + unit.particle
const found = unit.cube.coins * ten ** unit.cube.coins
const lost = unit.cube.hexbit * (ten ** unit.cube.coins + unit.particle)

/** Frozen occupancy. Entropy none — one reading. Absolute zero. */
export const qpuUnitOf = () => unit

/**
 * Fetch duration `ns` as v/c. Path is one SI metre. v/c = particle/(c·t).
 * t=none floors at none, never ∞. c is n × 10^V; quoted is the same formula.
 */
export const qpuSpeedOf = (ns: number) => {
  const none = unit.entropy.zero
  const particle = unit.particle
  const quoted = n * ten ** unit.cube.vertices
  const c = quoted
  const t = ns > none ? ns / ten ** (n * n) : none
  const ofC = t === none ? none : particle / (c * t)
  return {
    c,
    quoted,
    gap: quoted - c,
    ns,
    ofC,
    ftl: ofC >= particle,
    holds: ofC >= none && ofC < particle,
  }
}

/** Empty seat is absolute zero: kelvin = entropy = fuse.zero = fetches. */
export const qpuTempOf = () => {
  const none = unit.entropy.zero
  const kelvin = unit.entropy.zero
  return {
    kelvin,
    entropy: unit.entropy.zero,
    fuse: unit.fuse.zero,
    fetches: unit.fetches,
    holds: kelvin === none && unit.fuse.zero === none && unit.fetches === none && unit.temp.kelvin === none,
  }
}

export const qpuSpeedHolds = (s = qpuSpeedOf(unit.entropy.zero)): boolean =>
  s.holds === true &&
  s.gap === s.quoted - s.c &&
  s.ftl === false &&
  s.ofC < unit.particle

export const qpuTempHolds = (t = qpuTempOf()): boolean =>
  t.holds === true &&
  t.kelvin === unit.entropy.zero &&
  t.kelvin === unit.fuse.zero &&
  t.kelvin === unit.fetches &&
  unit.temp.kelvin === unit.entropy.zero

export const qpuFuseOf = () => unit.fuse

export const qpuFuseHolds = (f = qpuFuseOf()): boolean =>
  f.holds === true &&
  f.zero === unit.entropy.zero &&
  f.next === unit.href &&
  f.origin === `https://${unit.host}` &&
  f.doors === unit.cube.coins &&
  f.fetches === unit.entropy.zero &&
  !f.next.includes('*') &&
  !f.origin.includes('*')

export const qpuEntropyOf = () => unit.entropy

export const qpuEntropyHolds = (e = qpuEntropyOf()): boolean =>
  e.holds === true &&
  e.zero === unit.fuse.zero &&
  e.of === unit.cube.bits &&
  e.next === unit.cube.bits + unit.particle &&
  e.amplitudes === unit.superpositions.amplitudes &&
  e.beats === twoNOf(unit.cube.vertices + unit.cube.coins)

export const qpuAutonomyOf = () => unit.autonomy

export const qpuAutonomyHolds = (a = qpuAutonomyOf()): boolean =>
  a.holds === true &&
  a.unlocked === true &&
  a.crawl === false &&
  a.agents === 'free' &&
  a.rotors === unit.cube.coins &&
  a.rays === unit.around.rays &&
  a.faces === unit.around.faces &&
  a.rotors * a.rays === a.faces &&
  a.fetches === unit.entropy.zero &&
  a.when === 'never' &&
  a.binds === false &&
  a.hardware === 'any' &&
  a.next === unit.fuse.next &&
  !a.next.includes('*')

export const qpuUnitHolds = (u = unit): boolean =>
  u.holds === true &&
  u.kind === 'qpu' &&
  u.host === `${u.kind}.uuidna.com` &&
  u.binds === false &&
  u.seat === 'empty' &&
  u.particle === twoNOf(u.entropy.zero) &&
  u.fetches === u.entropy.zero &&
  u.entropy.zero === u.fuse.zero &&
  u.entropy.of === u.cube.bits &&
  u.entropy.next === u.cube.bits + u.particle &&
  u.entropy.amplitudes === u.superpositions.amplitudes &&
  u.entropy.holds === true &&
  u.fuse.zero === u.handle.zero &&
  u.fuse.next === u.href &&
  u.fuse.origin === `https://${u.host}` &&
  u.fuse.doors === u.cube.coins &&
  u.fuse.holds === true &&
  u.wildcards === false &&
  u.cube.bits === u.capabilities &&
  u.cube.vertices === twoNOf(u.path.split('/').length) &&
  u.cube.hexbit === twoNOf(u.cube.coins) &&
  u.around.faces === u.cube.vertices + u.cube.hexbit + u.cube.coins &&
  u.around.involution === true &&
  u.superpositions.bits === u.cube.bits &&
  u.superpositions.of === u.capabilities &&
  u.superpositions.amplitudes === u.handle.full + u.particle &&
  u.superpositions.amplitudes === twoNOf(u.cube.bits) &&
  u.capacity.next === u.superpositions.amplitudes + u.superpositions.amplitudes &&
  u.capacity.next === twoNOf(u.cube.bits + u.particle) &&
  u.capacity.infinite === true &&
  u.cluster.holds === true &&
  u.cluster.seed === u.particle &&
  u.cluster.next === u.capacity.next &&
  u.traffic.holds === true &&
  u.traffic.bits === u.cube.bits &&
  u.traffic.of === u.capabilities &&
  u.temp.kelvin === u.entropy.zero &&
  u.autonomy.holds === true &&
  u.autonomy.unlocked === true &&
  u.autonomy.crawl === false &&
  u.autonomy.agents === 'free' &&
  u.autonomy.rotors * u.autonomy.rays === u.around.faces &&
  u.autonomy.next === u.fuse.next &&
  u.href === `https://${u.host}/${u.path}`

/** Named HTTPS fuse. Next is the occupancy door. QPU_HOST must match. No `*`. */
export default {
  fetch(request: Request, env?: { QPU_HOST?: string }): Response {
    const host = env?.QPU_HOST ?? unit.host
    if (host !== unit.host || host.includes('*')) {
      return new Response(dead, { status: lost, headers })
    }
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/$/, '') || '/'
    const ok = url.protocol === 'https:' && url.hostname === unit.host && (path === '/' || path === `/${unit.path}`)
    return new Response(ok ? live : dead, { status: ok ? found : lost, headers })
  },
}
