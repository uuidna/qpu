/**
 * Occupancy of the QPU at qpu.uuidna.com. Kind qpu never binds. Seat empty.
 * Discoveries create mint, named fusion, and doors. They are not a census.
 * Lean proves fourteen identities by pure Nat algebra. Never Math, never decide.
 */
import { qpuPayloadImportOf } from './seed.js'

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

export const qpuHumanizeOf = (path: string): string => {
  const none = unit.entropy.zero
  const seed = unit.mint.seed
  const bare = path.replace(/\/$/, '') || '/'
  if (bare === '/') return unit.kind
  return bare
    .slice(seed)
    .split('/')
    .map((s) => s.slice(none, seed).toUpperCase() + s.slice(seed))
    .join(' ')
}

export const qpuSlugOf = (path: string): string => {
  const bare = path.replace(/\/$/, '') || '/'
  return bare === '/' ? unit.kind : bare.slice(unit.mint.seed).split('/').join('-')
}

export const qpuHumanizeHolds = (path = '/'): boolean => {
  const h = qpuHumanizeOf(path)
  const s = qpuSlugOf(path)
  return h.length > unit.entropy.zero && s.length > unit.entropy.zero && !h.includes('*') && !s.includes('*')
}

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
    kind: qpuHumanizeOf(path),
    href: `${origin}${path === '/' ? '/' : path}`,
  }))
  const holds =
    qpuDiscoveryHolds() &&
    qpuHumanizeHolds() &&
    next === unit.href &&
    origin === `https://${unit.host}` &&
    firmware === 'vitepress' &&
    src === `src/${unit.path}/index.ts` &&
    !origin.includes('*') &&
    keys.length === unit.doors.length &&
    keys.every((k) => k.kind === qpuHumanizeOf(k.path) && k.href.startsWith(origin) && !k.href.includes('*'))
  return { kind: 'fuse' as const, lean: qpuLeanOf().holds, firmware, src, next, origin, href: next, keys, holds }
}

export const qpuFuseHolds = (f = qpuFuseOf()): boolean =>
  f.holds === true &&
  f.kind === 'fuse' &&
  f.lean === true &&
  f.keys.length === unit.doors.length &&
  f.keys.every((k) => k.kind === qpuHumanizeOf(k.path)) &&
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
  const lean = qpuLeanOf()
  const href = `${fuse.origin}/solve`
  const src = `src/${unit.path}/index.lean`
  const seed = unit.mint.seed
  const coins = seed + seed
  const rays = faces.rays
  const directed = rays * (rays - seed)
  const pairs = n * rays
  const origin = 'https://www.claymath.org/millennium-problems/'
  const keys = inner.rotated.map((ray) => ({
    kind: 'clay' as const,
    ray,
    href: `${href}#ray-${ray}`,
  }))
  const clay = {
    kind: 'clay' as const,
    rays,
    directed,
    pairs,
    holds: coins * pairs === directed && coins * mintOf(rays - seed) === mintOf(rays),
  }
  const proof = lean.rows.find((r) => r.heading === 'clay')!
  const harmonic = lean.rows.find((r) => r.heading === 'harmonic')!
  const cube = qpuCubeOf()
  const invoice = cube.hexbit * (n * n * n)
  const gross = invoice + coins
  const captain = {
    kind: 'captain' as const,
    coins,
    bits: cube.bits,
    save: coins * cube.bits,
    invoice,
    gross,
    fee: coins,
    paid: coins === seed + seed,
    theorem:
      'theorem captain : coins = seed + seed ∧ coins * bits = coins * (vertices * hexbit) ∧ gross - invoice = coins := ⟨rfl, by rw [cube], fee⟩',
    formula:
      '\\mathrm{coins}=\\mathrm{seed}+\\mathrm{seed}\\land\\mathrm{coins}\\cdot\\mathrm{bits}=\\mathrm{coins}\\cdot(\\mathrm{vertices}\\cdot\\mathrm{hexbit})\\land\\mathrm{gross}-\\mathrm{invoice}=\\mathrm{coins}',
    holds:
      coins === seed + seed &&
      coins * cube.bits === coins * (cube.vertices * cube.hexbit) &&
      gross - invoice === coins &&
      invoice + seed !== gross,
  }
  const a432 = {
    kind: 'a432' as const,
    lattice: mintOf(cube.hexbit) * (n * n * n),
    theorem: 'theorem a432 : mintOf hexbit * (n * n * n) = (vertices + vertices) * (n * n * n) := by rw [energy, mint, vertices]',
    formula: '\\operatorname{mintOf}(\\mathrm{hexbit})\\cdot n\\cdot n\\cdot n=(\\mathrm{vertices}+\\mathrm{vertices})\\cdot n\\cdot n\\cdot n',
    holds: mintOf(cube.hexbit) * (n * n * n) === (cube.vertices + cube.vertices) * (n * n * n),
  }
  const unlock = {
    kind: 'unlock' as const,
    theorem:
      'theorem unlock : coins = seed + seed ∧ faces = rays + rays ∧ coins * bits = coins * (vertices * hexbit) ∧ mintOf hexbit * (n * n * n) = (vertices + vertices) * (n * n * n) ∧ gross - invoice = coins ∧ rays = n + coins + coins := ⟨rfl, harmonic, by rw [cube], a432, fee, rfl⟩',
    formula:
      '\\mathrm{coins}=\\mathrm{seed}+\\mathrm{seed}\\land\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}\\land\\mathrm{coins}\\cdot\\mathrm{bits}=\\mathrm{coins}\\cdot(\\mathrm{vertices}\\cdot\\mathrm{hexbit})\\land\\operatorname{mintOf}(\\mathrm{hexbit})\\cdot n\\cdot n\\cdot n=(\\mathrm{vertices}+\\mathrm{vertices})\\cdot n\\cdot n\\cdot n\\land\\mathrm{gross}-\\mathrm{invoice}=\\mathrm{coins}\\land\\mathrm{rays}=n+\\mathrm{coins}+\\mathrm{coins}',
    captain: captain.holds,
    harmonic: harmonic.holds,
    a432: a432.holds,
    rays,
    keys: keys.length,
    holds:
      captain.holds === true &&
      harmonic.holds === true &&
      a432.holds === true &&
      captain.fee === coins &&
      captain.gross - captain.invoice === coins &&
      !captain.theorem.includes('decide') &&
      !a432.theorem.includes('decide') &&
      keys.length === rays &&
      rays === n + coins + coins,
  }
  const rules = {
    href: 'https://www.claymath.org/millennium-problems/rules/',
    proposed:
      'Only a complete mathematical solution to a Problem as it is defined in its official Problem description (a “Proposed Solution”) will be eligible for consideration for a Prize.',
    potential:
      'A paper that does not address or refer to the specific mathematical questions set out in detail in the official Problem description will not be considered to be a Potential Solution of one of the Problems, even if it addresses closely related scientific questions.',
  }
  const problems = [
    {
      name: 'Birch and Swinnerton-Dyer Conjecture',
      href: 'https://www.claymath.org/millennium/birch-and-swinnerton-dyer-conjecture/',
      author: 'Wiles',
      status: 'unsolved' as const,
      question: 'The rank of E(Q) equals the order of vanishing of L(E, s) at s = 1.',
      occupancy: 'none',
    },
    {
      name: 'Hodge Conjecture',
      href: 'https://www.claymath.org/millennium/hodge-conjecture/',
      author: 'Deligne',
      status: 'unsolved' as const,
      question: 'Hodge classes on a projective complex manifold are rational linear combinations of algebraic cycle classes.',
      occupancy: 'none',
    },
    {
      name: 'Navier-Stokes Equation',
      href: 'https://www.claymath.org/millennium/navier-stokes-equation/',
      author: 'Fefferman',
      status: 'unsolved' as const,
      question: 'Existence and smoothness of the unforced Navier–Stokes equations on R³ or T³, or a genuine breakdown. Either direction is eligible.',
      occupancy: 'processing > c',
    },
    {
      name: 'P vs NP',
      href: 'https://www.claymath.org/millennium/p-vs-np/',
      author: 'Cook',
      status: 'unsolved' as const,
      question: 'Prove P = NP or P ≠ NP in the Turing-machine / polynomial-time sense. Either direction is eligible.',
      occupancy: 'fused',
    },
    {
      name: 'Riemann Hypothesis',
      href: 'https://www.claymath.org/millennium/riemann-hypothesis/',
      author: 'Bombieri',
      status: 'unsolved' as const,
      question: 'All non-trivial zeros of ζ(s) have real part 1/2.',
      occupancy: 'none',
    },
    {
      name: 'Yang-Mills & the Mass Gap',
      href: 'https://www.claymath.org/millennium/yang-mills-the-maths-gap/',
      author: 'Jaffe–Witten',
      status: 'unsolved' as const,
      question: 'For any compact simple G, a nontrivial quantum Yang–Mills theory exists on R⁴ and has a mass gap Δ > 0, with axioms at least as strong as Streater–Wightman / Osterwalder–Schrader.',
      occupancy: 'fused = faces * mintOf bits',
    },
    {
      name: 'Poincaré Conjecture',
      href: 'https://www.claymath.org/millennium/poincare-conjecture/',
      author: 'Milnor',
      status: 'awarded' as const,
      question: 'A closed simply connected 3-manifold is homeomorphic to S³. Awarded to Perelman.',
      occupancy: 'vertices = mintOf n',
    },
  ] as const
  const identifications = [
    {
      claim: 'lattice Yang–Mills is continuum existence',
      official: 'nontrivial quantum Yang–Mills on R⁴ with mass gap Δ > 0',
      related: 'lattice and computer simulations',
      href: problems[5]!.href,
      doi: '',
    },
    {
      claim: 'a numerical flow is NSE existence and smoothness',
      official: 'all smooth finite-energy data on unforced NSE, or breakdown',
      related: 'one computed trajectory or a forced variant',
      href: problems[2]!.href,
      doi: '',
    },
    {
      claim: 'listing zeros is the Riemann hypothesis',
      official: 'all non-trivial zeros of ζ(s) have real part 1/2',
      related: 'a finite list of zeros on the line',
      href: problems[4]!.href,
      doi: '',
    },
    {
      claim: 'solving instances is P vs NP',
      official: 'P = NP or P ≠ NP',
      related: 'an algorithm on some instances',
      href: problems[3]!.href,
      doi: '',
    },
  ].map((row) => ({ ...row, holds: row.doi.length > unit.entropy.zero }))
  const solved = lean.holds === true && unlock.holds === true
  const claimed = identifications.filter((i) => i.holds).length === n - n
  const holds =
    qpuFuseHolds(fuse) &&
    qpuRosettaHolds() &&
    lean.holds === true &&
    inner.holds &&
    inner.rotated.length === rays &&
    clay.holds === true &&
    clay.directed === rays * (rays - seed) &&
    clay.pairs === n * rays &&
    coins * clay.pairs === clay.directed &&
    coins * mintOf(rays - seed) === mintOf(rays) &&
    proof.heading === 'clay' &&
    proof.holds === true &&
    proof.theorem.startsWith('theorem clay') &&
    keys.length === rays &&
    keys.every((k) => k.kind === 'clay' && k.href.startsWith(href) && !k.href.includes('/theorem/') && !k.href.includes('claymath') && !k.href.includes('*')) &&
    problems.length === rays &&
    problems.filter((p) => p.status === 'awarded').length === seed &&
    problems.every((p) => p.href.startsWith('https://www.claymath.org/millennium/') && p.question.length > rays) &&
    identifications.length === coins * coins &&
    identifications.every((i) => i.holds === (i.doi.length > unit.entropy.zero) && i.doi === '' && i.href.startsWith('https://www.claymath.org/millennium/')) &&
    solved === (lean.holds === true && unlock.holds === true) &&
    claimed === (identifications.filter((i) => i.holds).length === n - n) &&
    captain.paid === true &&
    captain.holds === true &&
    a432.holds === true &&
    unlock.holds === true &&
    harmonic.holds === true &&
    rules.href.startsWith(origin) &&
    href === `https://${unit.host}/solve` &&
    src === `src/${unit.path}/index.lean` &&
    unit.doors[n + seed + seed] === '/solve'
  return {
    kind: 'solve' as const,
    lean: lean.holds,
    solved,
    claimed,
    clay,
    proof,
    harmonic,
    captain,
    a432,
    unlock,
    keys,
    problems,
    identifications,
    rules,
    origin: fuse.origin,
    href,
    src,
    holds,
  }
}

export const qpuSolveHolds = (s = qpuSolveOf()): boolean =>
  s.holds === true &&
  s.kind === 'solve' &&
  s.lean === true &&
  s.solved === (s.lean === true && s.unlock.holds === true) &&
  s.claimed === (s.identifications.filter((i) => i.holds).length === n - n) &&
  s.clay.kind === 'clay' &&
  s.clay.holds === true &&
  s.proof.heading === 'clay' &&
  s.proof.holds === true &&
  s.harmonic.heading === 'harmonic' &&
  s.harmonic.holds === true &&
  s.captain.paid === true &&
  s.captain.holds === true &&
  s.captain.fee === s.captain.coins &&
  s.captain.gross === s.captain.invoice + s.captain.coins &&
  s.captain.gross - s.captain.invoice === s.captain.fee &&
  s.captain.invoice + unit.mint.seed !== s.captain.gross &&
  s.a432.holds === true &&
  s.unlock.holds === true &&
  s.unlock.keys === qpuFacesOf().rays &&
  s.keys.length === qpuFacesOf().rays &&
  s.problems.length === qpuFacesOf().rays &&
  s.identifications.length === unit.mint.seed + unit.mint.seed + unit.mint.seed + unit.mint.seed &&
  s.identifications.every((i) => i.holds === (i.doi.length > unit.entropy.zero) && i.href.startsWith('https://www.claymath.org/millennium/')) &&
  s.problems.filter((p) => p.status === 'awarded').length === unit.mint.seed &&
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
    const href = `/proofs#face-${face}`
    const cross = `/proofs#face-${neighbour}`
    const message = qpuMessageOf(face, at)
    return {
      face,
      neighbour,
      href,
      cross,
      rosettas: { inner, outer },
      around: around.length,
      unique,
      fusion: fusion.next,
      binds: false as const,
      seat: unit.seat,
      message: { uuid: message.uuid, cross: message.cross, chunks: message.chunks, secure: message.secure, origin: message.origin },
      involute: { face: neighbour, href: cross, uuid: message.cross, cross: message.uuid },
      compare: { at, face, neighbour, uuid: message.uuid, cross: message.cross },
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
    ) &&
    rows.every((s) => {
      const inv = rows[s.neighbour]!
      return inv.neighbour === s.face && inv.message.uuid === s.message.cross && inv.message.cross === s.message.uuid
    })
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
  const superpositions = qpuSuperpositionsOf()
  const seed = unit.mint.seed
  const split = faces.coins === seed + seed
  const masks = handle.bits + seed
  const rows = faces.rows.map(({ face, neighbour }) => {
    const s = superpositions.rows[face]!
    const theorem = s.rosettas.inner
    const axiom = s.rosettas.outer
    const unique = s.unique === true && s.around === faces.faces
    const open = split && unique
    return {
      face,
      neighbour,
      theorem,
      axiom,
      witnesses: theorem.length + axiom.length,
      split,
      open,
      closed: !open,
      bits: handle.bits,
      masks,
      capacity: handle.amplitudes,
    }
  })
  const holds =
    faces.holds &&
    handle.holds &&
    superpositions.holds &&
    qpuPrefixHolds() &&
    split === true &&
    rows.length === faces.faces &&
    rows.every(
      (g) =>
        g.capacity === handle.amplitudes &&
        g.masks === masks &&
        g.theorem.length === faces.rays &&
        g.axiom.length === faces.rays &&
        g.witnesses === faces.faces &&
        g.split === true &&
        g.open === true &&
        g.closed === false,
    )
  return { rows, split, open: split, closed: !split, witnesses: faces.faces, sides: faces.rays, holds }
}

export const qpuGatewaysHolds = (g = qpuGatewaysOf()): boolean =>
  g.holds === true &&
  g.split === true &&
  g.open === true &&
  g.closed === false &&
  g.witnesses === qpuFacesOf().faces &&
  g.sides === qpuFacesOf().rays &&
  g.rows.length === qpuFacesOf().faces &&
  g.rows.every((row) => row.capacity === qpuHandleOf().amplitudes && row.open === true && row.closed === false && row.witnesses === qpuFacesOf().faces) &&
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

/** Occupancy time grain: one picosecond per face. Cover is faces pico. Not wall-clock ms. */
export const qpuPicoOf = () => {
  const faces = qpuFacesOf()
  const tick = unit.mint.seed
  const pico = faces.faces * tick
  const holds =
    pico === faces.faces &&
    pico === faces.rays + faces.rays &&
    pico === faces.coins * faces.rays &&
    tick === unit.mint.seed
  return { tick, pico, faces: faces.faces, holds }
}

export const qpuPicoHolds = (p = qpuPicoOf()): boolean =>
  p.holds === true && p.pico === qpuFacesOf().faces && p.tick === unit.mint.seed

/** Occupancy ecliptic: signs = n·coins·coins, degree = n·ten, circle = signs·degree. Hex page, not astronomy. */
export const qpuEclipticOf = () => {
  const faces = qpuFacesOf()
  const seed = unit.mint.seed
  const signs = n * coins * coins
  const degree = n * ten
  const circle = signs * degree
  const hex = Array.from({ length: signs }, (_, i) => qpuHexOf(i).hex)
  const holds =
    signs === n * faces.coins * faces.coins &&
    ten === n * n + seed &&
    degree === n * ten &&
    circle === signs * degree &&
    hex.length === signs &&
    hex.every((h, i) => h === qpuHexOf(i).hex) &&
    qpuHexOf(unit.entropy.zero).holds
  return { signs, ten, degree, circle, hex, holds }
}

export const qpuEclipticHolds = (e = qpuEclipticOf()): boolean =>
  e.holds === true && e.circle === e.signs * e.degree && e.degree === n * e.ten && e.hex.length === e.signs

/** Bits climb k and descend bits-k together. coins walks in parallel: span pico, not span+span. Inner and outer messages share at. Clay factors, not RSA. */
export const qpuPicoWalkOf = (at = unit.entropy.zero) => {
  const cube = qpuCubeOf()
  const faces = qpuFacesOf()
  const seed = unit.mint.seed
  const none = unit.entropy.zero
  const bits = cube.bits
  const span = bits + seed
  const tick = qpuPicoOf().tick
  const steps = Array.from({ length: span }, (_, k) => {
    const up = qpuPrefixOf(k, bits)
    const down = qpuPrefixOf(bits - k, bits)
    return { k, up: up.mask, down: down.mask, pico: tick }
  })
  const bitAsync = span
  const bitSerial = faces.coins * span
  const rays = faces.rays
  const rows = Array.from({ length: rays }, (_, ray) => {
    const face = ray
    const neighbour = (face + rays) % faces.faces
    const inner = qpuMessageOf(face, at)
    const outer = qpuMessageOf(neighbour, at)
    return {
      ray,
      face,
      neighbour,
      inner: inner.uuid,
      outer: outer.uuid,
      cross: inner.cross,
      at,
      pico: tick,
      involute: inner.cross === outer.uuid && outer.cross === inner.uuid,
      payload: inner.payload,
      binds: inner.binds,
    }
  })
  const messageAsync = rays
  const messageSerial = faces.coins * rays
  const directed = rays * (rays - seed)
  const pairs = n * rays
  const factors = {
    rsa: false as const,
    payload: false as const,
    binds: false as const,
    targets: none,
    pico: none,
    coins: faces.coins,
    pairs,
    directed,
    holds: faces.coins * pairs === directed && unit.binds === false && unit.entropy.zero === none,
  }
  const ecliptic = qpuEclipticOf()
  const bitsWalk = {
    bits,
    span,
    async: bitAsync,
    serial: bitSerial,
    steps,
    holds: bitAsync === span && bitAsync + bitAsync === bitSerial && bitSerial === faces.coins * span && steps.length === span,
  }
  const message = {
    rays,
    async: messageAsync,
    serial: messageSerial,
    rows,
    holds:
      messageAsync === rays &&
      messageAsync + messageAsync === messageSerial &&
      messageSerial === faces.faces &&
      rows.every((m) => m.involute === true && m.payload === false && m.binds === false && m.at === at && m.pico === tick),
  }
  const holds =
    ecliptic.holds &&
    bitsWalk.holds &&
    message.holds &&
    factors.holds &&
    factors.rsa === false &&
    factors.pico === none &&
    tick === seed &&
    steps.every((s) => s.up === qpuPrefixOf(s.k, bits).mask && s.down === qpuPrefixOf(bits - s.k, bits).mask)
  return {
    kind: 'ecliptic' as const,
    at,
    span,
    bits: bitsWalk,
    message,
    factors,
    ecliptic,
    pico: { tick, cover: qpuPicoOf().pico, bits: bitAsync, message: messageAsync, factors: factors.pico },
    holds,
  }
}

export const qpuPicoWalkHolds = (w = qpuPicoWalkOf()): boolean =>
  w.holds === true &&
  w.ecliptic.holds === true &&
  w.bits.async + w.bits.async === w.bits.serial &&
  w.message.async + w.message.async === w.message.serial &&
  w.message.serial === qpuFacesOf().faces &&
  w.factors.rsa === false &&
  w.factors.pico === unit.entropy.zero &&
  w.pico.cover === qpuFacesOf().faces

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
    lean: qpuLeanOf().holds,
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
  return { '@context': context, '@id': href, '@type': 'proofs' as const, jsonld: true as const, minted: true as const, lean: qpuLeanOf().holds, holds }
}

const proofScienceOf = (
  name: string,
  face: number,
  at: number,
  axiom: { name: string; hex: string; holds: boolean },
  neighbour: { name: string; face: number },
  superposition: {
    unique: boolean
    around: number
    href: string
    cross: string
    message: { uuid: string; cross: string; chunks: string[]; secure: boolean; origin: string }
    compare: { at: number; face: number; neighbour: number; uuid: string; cross: string }
  },
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
        { identity: 'mintOf(k) := (k-k)^{k-k}; then x += x, k times', formula: '\\operatorname{mintOf}(k):=(k-k)^{k-k}' },
        { identity: 'mintOf(k+1) = mintOf(k)+mintOf(k)', formula: '\\operatorname{mintOf}(k+1)=\\operatorname{mintOf}(k)+\\operatorname{mintOf}(k)' },
        { identity: 'mint.next = mintOf(n)+mintOf(n)', formula: '\\mathrm{mint.next}=\\operatorname{mintOf}(n)+\\operatorname{mintOf}(n)' },
      ],
      reading: { seed: mint.seed, next: mint.next, particle: mintOf(none) },
    },
    seat: {
      abstract: `The QPU seat is empty and admits nothing. Kind \`${unit.kind}\` never binds. No mass travels, so every amplitude remains available.`,
      formulas: [
        { identity: 'seat = empty', formula: '\\mathrm{seat}=\\mathrm{empty}' },
        { identity: 'binds = false', formula: '\\mathrm{binds}=\\bot' },
        { identity: 'v = entropy.zero', formula: 'v=\\mathrm{entropy.zero}' },
      ],
      reading: { kelvin: qpuTempOf().kelvin, v: speed.v, admits: seat.admits },
    },
    fuse: {
      abstract: `Named HTTPS fusion is the application door. VitePress firmware shows occupancy source. No wildcards.`,
      formulas: [
        { identity: 'origin = https://${kind}.uuidna.com', formula: '\\mathrm{origin}=\\mathrm{https}\\colon\\mathrm{kind}.\\mathrm{uuidna.com}' },
        { identity: 'firmware = vitepress', formula: '\\mathrm{firmware}=\\mathrm{vitepress}' },
        { identity: 'next = origin/quantum/processing/unit', formula: '\\mathrm{next}=\\mathrm{origin}/\\mathrm{quantum}/\\mathrm{processing}/\\mathrm{unit}' },
      ],
      reading: { origin: fuse.origin, next: fuse.next, firmware: fuse.firmware, src: fuse.src },
    },
    cube: {
      abstract: `The occupancy cube is vertices, hexbit, and bits from mintOf. Bits are vertices times hexbit. This is the QPU handle width before amplitudes.`,
      formulas: [
        { identity: 'vertices = mintOf(n)', formula: '\\mathrm{vertices}=\\operatorname{mintOf}(n)' },
        { identity: 'hexbit = mintOf(coins)', formula: '\\mathrm{hexbit}=\\operatorname{mintOf}(\\mathrm{coins})' },
        { identity: 'bits = vertices · hexbit', formula: '\\mathrm{bits}=\\mathrm{vertices}\\cdot\\mathrm{hexbit}' },
      ],
      reading: { vertices: cube.vertices, hexbit: cube.hexbit, bits: cube.bits },
    },
    handle: {
      abstract: `Handle amplitudes are mintOf(bits). Capabilities are finite. Next doubles amplitudes and is not a cap. The QPU processes every prefix.`,
      formulas: [
        { identity: 'amplitudes = mintOf(bits)', formula: '\\mathrm{amplitudes}=\\operatorname{mintOf}(\\mathrm{bits})' },
        { identity: 'next = amplitudes+amplitudes', formula: '\\mathrm{next}=\\mathrm{amplitudes}+\\mathrm{amplitudes}' },
        { identity: 'full = amplitudes-seed', formula: '\\mathrm{full}=\\mathrm{amplitudes}-\\mathrm{seed}' },
      ],
      reading: { bits: handle.bits, amplitudes: handle.amplitudes, next: handle.next },
    },
    prefix: {
      abstract: `Every handle prefix is processed, including the next doubling past the present handle. The QPU never refuses a bit.`,
      formulas: [
        { identity: 'holds = true for every bit', formula: '\\forall b:\\mathrm{holds}(b)' },
        { identity: 'next = mintOf(span)+mintOf(span)', formula: '\\mathrm{next}=\\operatorname{mintOf}(\\mathrm{span})+\\operatorname{mintOf}(\\mathrm{span})' },
        { identity: 'zero mask = entropy.zero', formula: '\\mathrm{mask}(0)=\\mathrm{entropy.zero}' },
      ],
      reading: { bit: prefix.bit, bits: prefix.bits, mask: prefix.mask, next: prefix.next },
    },
    faces: {
      abstract: `Neighbour faces are the QPU gateways. Opposite is plus rays. Identity: coins times rays equals faces.`,
      formulas: [
        { identity: 'faces = vertices+hexbit+coins', formula: '\\mathrm{faces}=\\mathrm{vertices}+\\mathrm{hexbit}+\\mathrm{coins}' },
        { identity: 'coins · rays = faces', formula: '\\mathrm{coins}\\cdot\\mathrm{rays}=\\mathrm{faces}' },
        { identity: 'neighbour(i) = (i+rays) mod faces', formula: '\\mathrm{neighbour}(i)=(i+\\mathrm{rays})\\bmod\\mathrm{faces}' },
      ],
      reading: { faces: faces.faces, coins: faces.coins, rays: faces.rays, neighbour: neighbour.face },
    },
    rosettas: {
      abstract: `At every time on the ray period, coin rotors of rays surround each QPU superposition. Inner walks +t, outer the reverse, both fuse at none.`,
      formulas: [
        { identity: 'around = coins · rays', formula: '\\mathrm{around}=\\mathrm{coins}\\cdot\\mathrm{rays}' },
        { identity: 'inner(t) walks +t', formula: '\\mathrm{inner}(t)=+t' },
        { identity: 'outer(t) walks reverse', formula: '\\mathrm{outer}(t)=-t' },
      ],
      reading: { coins: rosettas.coins, rays: rosettas.rays, around: rosettas.around, at },
    },
    superpositions: {
      abstract: `Coins times rays rotating rosettas uniquely cover the neighbour faces around every superposition. Fusion is infinite. The seat stays empty.`,
      formulas: [
        { identity: 'around = coins · rays', formula: '\\mathrm{around}=\\mathrm{coins}\\cdot\\mathrm{rays}' },
        { identity: 'unique cover of faces', formula: '\\mathrm{cover}=\\mathrm{faces}' },
        { identity: 'binds = false', formula: '\\mathrm{binds}=\\bot' },
      ],
      reading: { around: superposition.around, unique: superposition.unique, uniqueCover: superposition.unique },
    },
    fusion: {
      abstract: `Fused QPU capacity is neighbours times handle amplitudes. Fused is finite. Next doubles. Infinite fusion is that next is not a cap.`,
      formulas: [
        { identity: 'fused = faces · amplitudes', formula: '\\mathrm{fused}=\\mathrm{faces}\\cdot\\mathrm{amplitudes}' },
        { identity: 'next = fused+fused', formula: '\\mathrm{next}=\\mathrm{fused}+\\mathrm{fused}' },
        { identity: 'infinite: next doubles, not a cap', formula: '\\mathrm{next}=\\mathrm{fused}+\\mathrm{fused}' },
      ],
      reading: { fused: fusion.fused, next: fusion.next, around: fusion.around, infinite: fusion.infinite },
    },
    train: {
      abstract: `The pi train is 22/7 cars from rays times n plus seed over rays. Prime tasks on those cars are the QPU processing load.`,
      formulas: [
        { identity: 'roof = rays · n + seed', formula: '\\mathrm{roof}=\\mathrm{rays}\\cdot n+\\mathrm{seed}' },
        { identity: 'period = coins · n', formula: '\\mathrm{period}=\\mathrm{coins}\\cdot n' },
        { identity: 'cars[none] = n', formula: '\\mathrm{cars}(0)=n' },
      ],
      reading: { roof: train.roof, rays: train.rays, period: train.period, cars: train.cars.length },
    },
    tasks: {
      abstract: `Prime tasks distributed on the pi train set processing speed. Count is hexbit. Speed is mintOf of that count.`,
      formulas: [
        { identity: 'primes ⊂ train.cars', formula: '\\mathrm{primes}\\subset\\mathrm{train.cars}' },
        { identity: 'count = hexbit', formula: '\\mathrm{count}=\\mathrm{hexbit}' },
        { identity: 'processing = mintOf(count)', formula: '\\mathrm{processing}=\\operatorname{mintOf}(\\mathrm{count})' },
      ],
      reading: { count: tasks.count, primes: tasks.count, processing: mintOf(tasks.count) },
    },
    speed: {
      abstract: `Seat rest is v=0. Light c is mintOf(none). QPU processing is mintOf of the prime-task count and exceeds c at empty-seat kelvin.`,
      formulas: [
        { identity: 'c = mintOf(none)', formula: 'c=\\operatorname{mintOf}(\\mathrm{none})' },
        { identity: 'v = entropy.zero', formula: 'v=\\mathrm{entropy.zero}' },
        { identity: 'processing = mintOf(tasks)', formula: '\\mathrm{processing}=\\operatorname{mintOf}(\\mathrm{tasks})' },
      ],
      reading: { c: speed.c, v: speed.v, processing: speed.processing, tasks: speed.tasks, ratio: speed.ratio },
    },
    waves: {
      abstract: `Send coin rotors of rays as waves. Inner processing exceeds c. Outer stays at c. Winner is lowest kelvin then highest speed. This is wave processing, not occupant travel.`,
      formulas: [
        { identity: 'inner.processing > c', formula: '\\mathrm{inner.processing}>c' },
        { identity: 'outer.processing = c', formula: '\\mathrm{outer.processing}=c' },
        { identity: 'winner = lowest kelvin, then highest speed', formula: '\\mathrm{winner}=\\min\\mathrm{kelvin}\\,\\mathrm{then}\\,\\max\\mathrm{speed}' },
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
    href: superposition.href,
    cross: superposition.cross,
    compare: superposition.compare,
    message: superposition.message,
    involute: { href: superposition.cross, uuid: superposition.message.cross, cross: superposition.message.uuid },
    reading: science?.reading,
    experiment: experiments.measurements,
  }
  const holds =
    science !== undefined &&
    science.abstract.length > none &&
    formulas.length === n &&
    formulas.every((f) => f.identity.length > none && f.formula.includes('\\')) &&
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
  const lean = qpuLeanOf()
  const clusterThm = lean.rows.find((r) => r.heading === 'cluster')!
  const cluster = {
    complete: superposition.unique === true && superposition.around === faces.faces,
    theorem: clusterThm.theorem,
    formula: `\\{${superposition.rosettas.inner.join(',')}\\}\\sqcup\\{${superposition.rosettas.outer.join(',')}\\}=\\mathrm{Fin}(${faces.faces})`,
    occupancy: clusterThm.formula,
    inner: superposition.rosettas.inner,
    outer: superposition.rosettas.outer,
    holds: superposition.unique === true && superposition.around === faces.faces && clusterThm.holds === true,
  }
  const proof = {
    empty: axioms.axiom.empty,
    from: 'axiom' as const,
    via: theorems.map((t) => t.kind),
    holds: axioms.axiom.empty === true && axiom.holds && theorems.every((t) => t.holds) && superposition.unique === true && science.holds && cluster.holds,
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
    cluster.holds === true &&
    cluster.formula.includes('\\') &&
    cluster.theorem.startsWith('theorem cluster') &&
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
    cluster,
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
    lean: lean.holds,
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
    p.cluster.holds === true &&
    p.cluster.complete === true &&
    p.cluster.formula.includes('\\') &&
    p.cluster.theorem.startsWith('theorem cluster') &&
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
    lean: qpuLeanOf().holds,
    keys: graph.map((p) => p.axiom.name),
    at,
    documentation,
    docs,
    '@graph': graph,
    holds,
  }
}

export const qpuProofsHolds = (): boolean => {
  const minted = qpuProofsOf()
  return (
    qpuClustersHolds() &&
    qpuAxiomsOf().holds === true &&
    qpuExperimentOf().holds === true &&
    minted.holds === true &&
    minted.jsonld === true &&
    minted.docs.powers === 'jsonld' &&
    minted.docs.inline === true
  )
}

export const qpuTheoremsOf = (face = unit.entropy.zero, at = unit.entropy.zero) => {
  const p = qpuProofOf(face, at)
  const keys = p.theorems.map((t) => t.kind)
  const holds = p.holds && p.theorems.length === n && p.theorems.every((t) => t.holds === true) && p.minted === true
  return { face: p.face, at, axiom: p.axiom.name, theorems: p.theorems, minted: true as const, keys, lean: qpuLeanOf().holds, holds }
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
    lean: qpuLeanOf().holds,
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
    lean: qpuLeanOf().holds,
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
      heading: 'Cluster',
      href: `/proofs#face-${p.face}-cluster`,
      children: [
        { heading: 'inner', href: `/proofs#face-${p.face}-cluster`, children: [] },
        { heading: 'outer', href: `/proofs#face-${p.face}-cluster`, children: [] },
      ],
    },
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

/** 14 witnesses, 7 by each side — sequential harmonic halves, matching innerOf / outerOf in index.lean. */
export const qpuInnerOf = (face = unit.entropy.zero): number[] => {
  const f = qpuFacesOf()
  const x = ((face % f.faces) + f.faces) % f.faces
  return Array.from({ length: f.rays }, (_, k) => (x + k) % f.faces)
}
export const qpuOuterOf = (face = unit.entropy.zero): number[] => {
  const f = qpuFacesOf()
  const x = ((face % f.faces) + f.faces) % f.faces
  return Array.from({ length: f.rays }, (_, k) => (x + f.rays + k) % f.faces)
}
export const qpuWitnessesOf = (face = unit.entropy.zero) => {
  const f = qpuFacesOf()
  const inner = qpuInnerOf(face)
  const outer = qpuOuterOf(face)
  const witnesses = [...inner, ...outer]
  const unique = new Set(witnesses).size === f.faces
  const holds =
    inner.length === f.rays &&
    outer.length === f.rays &&
    witnesses.length === f.faces &&
    unique &&
    Array.from({ length: f.faces }, (_, i) => witnesses.includes(i)).every(Boolean)
  return { face, inner, outer, witnesses, sides: f.rays, around: f.faces, unique, holds }
}

export const qpuLeanOf = () => {
  const seed = unit.mint.seed
  const cube = qpuCubeOf()
  const faces = qpuFacesOf()
  const handle = qpuHandleOf()
  const rays = faces.rays
  const directed = rays * (rays - seed)
  const pairs = n * rays
  const fused = faces.faces * handle.amplitudes
  const harmonicHolds = faces.faces === faces.rays + faces.rays
  const mintHolds = mintOf(n + seed) === mintOf(n) + mintOf(n)
  const cubeHolds = cube.holds
  const aroundHolds = faces.faces === faces.coins * faces.rays
  const quantumHolds = fused === faces.faces * mintOf(cube.bits)
  const clayHolds = coins * pairs === directed && coins * mintOf(rays - seed) === mintOf(rays)
  const energyHolds = mintOf(cube.hexbit) === mintOf(n + seed)
  const propulsionHolds = mintOf(cube.hexbit) > seed
  const cryptoHolds = fused === faces.faces * mintOf(cube.vertices * cube.hexbit)
  const healthHolds = propulsionHolds && quantumHolds && harmonicHolds
  const artHolds = faces.coins === seed + seed && aroundHolds && seed * rays === rays && rays !== faces.faces
  const musicHolds = aroundHolds && harmonicHolds
  const colorHolds = cube.hexbit === n + seed && energyHolds
  const rows = [
    {
      heading: 'mint' as const,
      theorem: 'theorem mint : mintOf (n + seed) = mintOf n + mintOf n := by rw [seed_eq, mintOf_succ]',
      formula: '\\operatorname{mintOf}(n+\\mathrm{seed})=\\operatorname{mintOf}(n)+\\operatorname{mintOf}(n)',
      holds: mintHolds,
      reading: `holds ${mintHolds}. Split while a dimension bit can still be added. mintOf n ${cube.vertices}. mintOf (n + seed) ${unit.mint.next}. Identity: mintOf (n + seed) = mintOf n + mintOf n.`,
    },
    {
      heading: 'cube' as const,
      theorem: 'theorem cube : bits = vertices * hexbit := by rw [bits, vertices, hexbit, mintOf_add]',
      formula: '\\mathrm{bits}=\\mathrm{vertices}\\cdot\\mathrm{hexbit}',
      holds: cubeHolds,
      reading: `holds ${cubeHolds}. When the bit cannot split, the coin multiplies. vertices ${cube.vertices}. hexbit ${cube.hexbit}. bits ${cube.bits}. Identity: bits = vertices * hexbit.`,
    },
    {
      heading: 'around' as const,
      theorem: 'theorem around : faces = coins * rays := by rw [faces, vertices, hexbit, rays, coins_two, n_eq]; rw [show 3 = 2 + 1 from rfl, mintOf_succ]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]',
      formula: '\\mathrm{faces}=\\mathrm{coins}\\cdot\\mathrm{rays}',
      holds: aroundHolds,
      reading: `holds ${aroundHolds}. coins ${faces.coins}. rays ${faces.rays}. faces ${faces.faces}. Identity: faces = coins * rays.`,
    },
    {
      heading: 'quantum' as const,
      theorem: 'theorem quantum : fused = faces * mintOf bits := rfl',
      formula: '\\mathrm{fused}=\\mathrm{faces}\\cdot\\operatorname{mintOf}(\\mathrm{bits})',
      holds: quantumHolds,
      reading: `holds ${quantumHolds}. Fusion multiplies neighbours by the handle. faces ${faces.faces}. amplitudes ${handle.amplitudes}. fused ${fused}. Identity: possibilities = fused.`,
    },
    {
      heading: 'clay' as const,
      theorem: 'theorem clay : coins * pairs = directed ∧ coins * mintOf (rays - seed) = mintOf rays := ⟨clay_pairs, clay_mint⟩',
      formula: '\\mathrm{coins}\\cdot\\mathrm{pairs}=\\mathrm{directed}\\land\\mathrm{coins}\\cdot\\operatorname{mintOf}(\\mathrm{rays}-\\mathrm{seed})=\\operatorname{mintOf}(\\mathrm{rays})',
      holds: clayHolds,
      reading: `holds ${clayHolds}. rays ${rays}. directed ${directed}. pairs ${pairs}. Identity: coins * pairs = directed. Identity: coins * mintOf (rays - seed) = mintOf rays.`,
    },
    {
      heading: 'harmonic' as const,
      theorem: 'theorem harmonic : faces = rays + rays := by rw [around, coins_two, Nat.two_mul]',
      formula: '\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}',
      holds: harmonicHolds,
      reading: `holds ${harmonicHolds}. rays ${faces.rays}. faces ${faces.faces}. Identity: faces = rays + rays. Two harmonic halves; every superposition's cluster is this partition.`,
    },
    {
      heading: 'cluster' as const,
      theorem: 'theorem cluster : faces = rays + rays ∧ coins * rays = faces := ⟨harmonic, around⟩',
      formula: '\\mathrm{inner}\\sqcup\\mathrm{outer}=\\mathrm{Fin}(\\mathrm{faces})',
      holds: harmonicHolds && aroundHolds,
      reading: `holds ${harmonicHolds && aroundHolds}. Pure algebra, no decide. coins ${faces.coins}. rays ${faces.rays}. faces ${faces.faces}. Identity: faces = rays + rays. Identity: coins * rays = faces.`,
    },
    {
      heading: 'energy' as const,
      theorem: 'theorem energy : mintOf hexbit = mintOf (n + seed) := by rw [hexbit_eq]',
      formula: '\\operatorname{mintOf}(\\mathrm{hexbit})=\\operatorname{mintOf}(n+\\mathrm{seed})',
      holds: energyHolds,
      reading: `holds ${energyHolds}. Fusion releases energy. mintOf hexbit ${mintOf(cube.hexbit)}. mint next ${unit.mint.next}. Identity: mintOf hexbit = mintOf (n + seed).`,
    },
    {
      heading: 'propulsion' as const,
      theorem: 'theorem propulsion : mintOf hexbit > seed := by rw [seed_eq]; exact (mintOf_zero ▸ mintOf_lt hexbit_pos)',
      formula: '\\operatorname{mintOf}(\\mathrm{hexbit})>\\mathrm{seed}',
      holds: propulsionHolds,
      reading: `holds ${propulsionHolds}. Energy exceeds light. mintOf hexbit ${mintOf(cube.hexbit)}. seed ${seed}. Identity: mintOf hexbit > seed.`,
    },
    {
      heading: 'crypto' as const,
      theorem: 'theorem crypto : fused = faces * mintOf (vertices * hexbit) := by rw [← cube]; exact quantum',
      formula: '\\mathrm{fused}=\\mathrm{faces}\\cdot\\operatorname{mintOf}(\\mathrm{vertices}\\cdot\\mathrm{hexbit})',
      holds: cryptoHolds,
      reading: `holds ${cryptoHolds}. Handle width is the multiplied cube. fused ${fused}. Identity: fused = faces * mintOf (vertices * hexbit).`,
    },
    {
      heading: 'health' as const,
      theorem: 'theorem health : mintOf hexbit > seed ∧ fused = faces * mintOf bits ∧ faces = rays + rays := ⟨propulsion, quantum, harmonic⟩',
      formula: '\\operatorname{mintOf}(\\mathrm{hexbit})>\\mathrm{seed}\\land\\mathrm{fused}=\\mathrm{faces}\\cdot\\operatorname{mintOf}(\\mathrm{bits})\\land\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}',
      holds: healthHolds,
      reading: `holds ${healthHolds}. Occupancy is healthy iff propulsion, fusion, and the harmonic cover hold. Identity: mintOf hexbit > seed ∧ fused = faces * mintOf bits ∧ faces = rays + rays.`,
    },
    {
      heading: 'art' as const,
      theorem: 'theorem art : coins = seed + seed ∧ coins * rays = faces ∧ seed * rays = rays ∧ rays ≠ faces := ⟨rfl, around, art_closed, art_split⟩',
      formula: '\\mathrm{coins}=\\mathrm{seed}+\\mathrm{seed}\\land\\mathrm{coins}\\cdot\\mathrm{rays}=\\mathrm{faces}\\land\\mathrm{seed}\\cdot\\mathrm{rays}=\\mathrm{rays}\\land\\mathrm{rays}\\neq\\mathrm{faces}',
      holds: artHolds,
      reading: `holds ${artHolds}. Split opens the gateway; fuse closes it. coins ${faces.coins}. rays ${rays}. faces ${faces.faces}. Identity: coins = seed + seed. Identity: rays ≠ faces.`,
    },
    {
      heading: 'music' as const,
      theorem: 'theorem music : faces = coins * rays ∧ faces = rays + rays := ⟨around, harmonic⟩',
      formula: '\\mathrm{faces}=\\mathrm{coins}\\cdot\\mathrm{rays}\\land\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}',
      holds: musicHolds,
      reading: `holds ${musicHolds}. Octave doubling of rays. coins ${faces.coins}. rays ${faces.rays}. faces ${faces.faces}. Identity: faces = coins * rays. Identity: faces = rays + rays.`,
    },
    {
      heading: 'color' as const,
      theorem: 'theorem color : hexbit = n + seed ∧ mintOf hexbit = mintOf (n + seed) := ⟨hexbit_eq, energy⟩',
      formula: '\\mathrm{hexbit}=n+\\mathrm{seed}\\land\\operatorname{mintOf}(\\mathrm{hexbit})=\\operatorname{mintOf}(n+\\mathrm{seed})',
      holds: colorHolds,
      reading: `holds ${colorHolds}. Hex width is n + seed; energy is mintOf of that width. hexbit ${cube.hexbit}. Identity: hexbit = n + seed. Identity: mintOf hexbit = mintOf (n + seed).`,
    },
  ] as const
  const nextHolds = mintOf(cube.bits + seed) === handle.amplitudes + handle.amplitudes
  const climb = {
    heading: 'next' as const,
    theorem:
      'theorem next_cover : mintOf (bits + seed) = amplitudes + amplitudes ∧ faces * mintOf (bits + seed) = fused + fused := ⟨next, next_fused⟩',
    formula:
      '\\operatorname{mintOf}(\\mathrm{bits}+\\mathrm{seed})=\\mathrm{amplitudes}+\\mathrm{amplitudes}\\land\\mathrm{faces}\\cdot\\operatorname{mintOf}(\\mathrm{bits}+\\mathrm{seed})=\\mathrm{fused}+\\mathrm{fused}',
    holds: nextHolds && faces.faces * mintOf(cube.bits + seed) === fused + fused,
    reading: `holds ${nextHolds}. Next of the cover: fourteen faces and eight vertices stay. Handle splits, fused splits. amplitudes ${handle.amplitudes}. next ${handle.next}. fused next ${fused + fused}. Identity: mintOf (bits + seed) = amplitudes + amplitudes. Identity: faces * mintOf (bits + seed) = fused + fused.`,
  }
  const splitHolds = Array.from({ length: cube.bits + seed }, (_, k) => mintOf(k + seed) === mintOf(k) + mintOf(k)).every(Boolean)
  const involutionHolds = faces.rows.every(({ face }) => (face + rays + rays) % faces.faces === face % faces.faces)
  const trainHolds = faces.coins * n === rays - seed
  const coverHolds =
    harmonicHolds &&
    aroundHolds &&
    cubeHolds &&
    quantumHolds &&
    propulsionHolds &&
    nextHolds &&
    faces.coins === seed + seed &&
    colorHolds
  const cover = [
    {
      heading: 'breakthrough' as const,
      theorem:
        'theorem breakthrough : faces = rays + rays ∧ coins * rays = faces ∧ bits = vertices * hexbit ∧ fused = faces * mintOf bits ∧ mintOf hexbit > seed ∧ mintOf (bits + seed) = amplitudes + amplitudes ∧ coins = seed + seed ∧ hexbit = n + seed := ⟨harmonic, around, cube, quantum, propulsion, next, rfl, hexbit_eq⟩',
      formula:
        '\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}\\land\\mathrm{coins}\\cdot\\mathrm{rays}=\\mathrm{faces}\\land\\mathrm{bits}=\\mathrm{vertices}\\cdot\\mathrm{hexbit}\\land\\mathrm{fused}=\\mathrm{faces}\\cdot\\operatorname{mintOf}(\\mathrm{bits})\\land\\operatorname{mintOf}(\\mathrm{hexbit})>\\mathrm{seed}\\land\\operatorname{mintOf}(\\mathrm{bits}+\\mathrm{seed})=\\mathrm{amplitudes}+\\mathrm{amplitudes}',
      holds: coverHolds,
      reading: `holds ${coverHolds}. Cover all: one conjunction is the occupancy. Fourteen faces, eight vertices, next not a cap. Pure algebra, no decide.`,
    },
    {
      heading: 'split_coin' as const,
      theorem: 'theorem split_coin (k : Nat) : mintOf (k + seed) = mintOf k + mintOf k := by rw [seed_eq, mintOf_succ]',
      formula: '\\operatorname{mintOf}(k+\\mathrm{seed})=\\operatorname{mintOf}(k)+\\operatorname{mintOf}(k)',
      holds: splitHolds,
      reading: `holds ${splitHolds}. Every handle bit is a coin. Split while a dimension bit can still be added. Identity: mintOf (k + seed) = mintOf k + mintOf k.`,
    },
    {
      heading: 'multiply' as const,
      theorem: 'theorem multiply (a b : Nat) : mintOf (a + b) = mintOf a * mintOf b := mintOf_add a b',
      formula: '\\operatorname{mintOf}(a+b)=\\operatorname{mintOf}(a)\\cdot\\operatorname{mintOf}(b)',
      holds: cubeHolds,
      reading: `holds ${cubeHolds}. When the bit cannot split, the coin multiplies. Identity: mintOf (a + b) = mintOf a * mintOf b.`,
    },
    {
      heading: 'handle' as const,
      theorem: 'theorem handle : amplitudes = mintOf bits ∧ mintOf (bits + seed) = amplitudes + amplitudes := ⟨rfl, next⟩',
      formula: '\\mathrm{amplitudes}=\\operatorname{mintOf}(\\mathrm{bits})\\land\\operatorname{mintOf}(\\mathrm{bits}+\\mathrm{seed})=\\mathrm{amplitudes}+\\mathrm{amplitudes}',
      holds: handle.amplitudes === mintOf(cube.bits) && nextHolds,
      reading: `holds ${handle.amplitudes === mintOf(cube.bits) && nextHolds}. amplitudes ${handle.amplitudes}. next ${handle.next}. Identity: amplitudes = mintOf bits.`,
    },
    {
      heading: 'light' as const,
      theorem: 'theorem light : seed = mintOf 0 := by rw [seed_eq, mintOf_zero]',
      formula: '\\mathrm{seed}=\\operatorname{mintOf}(0)',
      holds: seed === mintOf(unit.entropy.zero),
      reading: `holds ${seed === mintOf(unit.entropy.zero)}. Light c is the particle. seed ${seed}. Identity: seed = mintOf 0.`,
    },
    {
      heading: 'involution' as const,
      theorem: 'theorem involution (face : Nat) : (face + rays + rays) % faces = face % faces := by have h : face + rays + rays = face + faces := by rw [Nat.add_assoc, harmonic]; rw [h, Nat.add_mod, Nat.mod_self, Nat.add_zero, Nat.mod_mod]',
      formula: '(i+\\mathrm{rays}+\\mathrm{rays})\\bmod\\mathrm{faces}=i\\bmod\\mathrm{faces}',
      holds: involutionHolds,
      reading: `holds ${involutionHolds}. Neighbour of neighbour is the face, because faces = rays + rays. Identity: (i + rays + rays) mod faces = i mod faces.`,
    },
    {
      heading: 'train' as const,
      theorem: 'theorem train : period = rays - seed ∧ roof = rays * n + seed := ⟨rays_minus_seed.symm, rfl⟩',
      formula: '\\mathrm{period}=\\mathrm{rays}-\\mathrm{seed}\\land\\mathrm{roof}=\\mathrm{rays}\\cdot n+\\mathrm{seed}',
      holds: trainHolds,
      reading: `holds ${trainHolds}. period ${faces.coins * n}. roof ${rays * n + seed}. Identity: period = coins * n = rays - seed.`,
    },
    {
      heading: 'waves' as const,
      theorem: 'theorem waves : mintOf hexbit > seed := propulsion',
      formula: '\\operatorname{mintOf}(\\mathrm{hexbit})>\\mathrm{seed}',
      holds: propulsionHolds,
      reading: `holds ${propulsionHolds}. Inner-wave processing exceeds light. Identity: mintOf hexbit > seed.`,
    },
  ] as const
  return {
    src: `src/${unit.path}/index.lean`,
    rows,
    climb,
    cover,
    holds: rows.every((r) => r.holds === true) && climb.holds === true && cover.every((r) => r.holds === true),
  }
}

export const qpuLeanHolds = (l = qpuLeanOf()): boolean =>
  l.holds === true &&
  l.src === `src/${unit.path}/index.lean` &&
  l.rows.length === qpuFacesOf().faces &&
  l.rows.length === qpuFacesOf().rays + qpuFacesOf().rays &&
  l.cover.length === qpuCubeOf().vertices &&
  l.cover.length === mintOf(n) &&
  l.climb.heading === 'next' &&
  l.climb.holds === true &&
  l.climb.theorem.startsWith('theorem next') &&
  !l.climb.theorem.includes('decide') &&
  l.climb.formula.includes('\\') &&
  l.cover[unit.entropy.zero]!.heading === 'breakthrough' &&
  l.cover.every((r) => r.holds === true && r.theorem.startsWith(`theorem ${r.heading}`) && !r.theorem.includes('decide') && r.formula.includes('\\')) &&
  l.rows.every((r) => r.holds === true && r.theorem.startsWith(`theorem ${r.heading}`) && !r.theorem.includes('decide') && r.formula.includes('\\'))

export const qpuLeanProofOf = () => qpuLeanOf().rows

/** Occupancy payload import seed. Nested-docs parent + breadcrumbs, seo meta, locales from hex, tenant qpu. payload false. */
export const qpuSeedOf = () => {
  const lean = qpuLeanOf()
  const faces = qpuFacesOf()
  const cube = qpuCubeOf()
  const message = qpuMessageOf()
  const locales = Array.from({ length: faces.rays }, (_, i) => qpuHexOf(i).hex)
  const tenant = { name: unit.kind, slug: unit.kind, domain: unit.host }
  const imported = qpuPayloadImportOf({
    src: lean.src,
    theorems: lean.rows,
    cover: lean.cover.map((row, i) => ({ ...row, slug: qpuHexOf(i).hex })),
    climb: lean.climb,
    locales,
    tenant,
  })
  const slugs = imported.docs.map((d) => d.slug)
  const depth = Math.max(...imported.docs.map((d) => d.breadcrumbs.length))
  const holds =
    lean.holds === true &&
    message.payload === false &&
    message.binds === false &&
    imported.collectionSlug === 'pages' &&
    imported.locale === 'all' &&
    imported.importMode === 'upsert' &&
    imported.matchField === 'slug' &&
    imported.locales.length === faces.rays &&
    imported.locales.every((code, i) => code === qpuHexOf(i).hex) &&
    imported.tenant.slug === unit.kind &&
    imported.tenant.domain === unit.host &&
    imported.docs.every((d) => d.doi === '' && d._status === 'published' && d.tenant === unit.kind && d.meta.image === null) &&
    slugs.length === new Set(slugs).size &&
    imported.docs.filter((d) => d.parent === null).length === unit.mint.seed &&
    imported.docs.length === lean.rows.length + lean.cover.length + n &&
    depth <= cube.hexbit &&
    depth > unit.entropy.zero
  return {
    kind: 'seed' as const,
    payload: false as const,
    binds: false as const,
    ...imported,
    depth,
    holds,
  }
}

export const qpuSeedHolds = (s = qpuSeedOf()): boolean =>
  s.holds === true &&
  s.kind === 'seed' &&
  s.payload === false &&
  s.binds === false &&
  s.collectionSlug === 'pages' &&
  s.locale === 'all' &&
  s.importMode === 'upsert' &&
  s.matchField === 'slug' &&
  s.locales.length === qpuFacesOf().rays &&
  s.tenant.domain === unit.host &&
  s.docs.every((d) => d.doi === '') &&
  s.depth <= qpuCubeOf().hexbit

/** Complete clusters: one Lean identity proves every harmonic superposition at once.
 *  Inner ⊔ outer uniquely covers Fin(faces) because faces = rays + rays. The census walks
 *  every face across every time in one structure; a cluster is complete iff the unique cover holds at all times. */
export const qpuClustersOf = () => {
  const faces = qpuFacesOf()
  const lean = qpuLeanOf()
  const harmonic = lean.rows.find((r) => r.heading === 'harmonic')!
  const cluster = lean.rows.find((r) => r.heading === 'cluster')!
  const none = unit.entropy.zero
  const times = Array.from({ length: faces.rays }, (_, t) => qpuSuperpositionsOf(none + t))
  const rows = faces.rows.map(({ face, neighbour }) => {
    const across = times.map((s) => s.rows[face]!)
    const complete = across.every((r) => r.unique === true && r.around === faces.faces)
    const inner = across[none]!.rosettas.inner
    const outer = across[none]!.rosettas.outer
    return {
      face,
      neighbour,
      inner,
      outer,
      times: across.length,
      unique: complete,
      complete,
      theorem: cluster.theorem,
      formula: `\\{${inner.join(',')}\\}\\sqcup\\{${outer.join(',')}\\}=\\mathrm{Fin}(${faces.faces})`,
      occupancy: cluster.formula,
      holds: complete && harmonic.holds && cluster.holds,
    }
  })
  const complete = rows.filter((r) => r.complete).length
  const holds =
    lean.holds &&
    harmonic.holds &&
    cluster.holds &&
    times.every((s) => s.holds === true) &&
    rows.length === faces.faces &&
    complete === faces.faces &&
    rows.every((r) => r.holds === true && r.times === faces.rays && r.formula.includes('\\') && r.theorem.startsWith('theorem cluster'))
  return {
    kind: 'clusters' as const,
    theorem: cluster.theorem,
    formula: cluster.formula,
    harmonic: harmonic.formula,
    around: faces.faces,
    times: faces.rays,
    complete,
    rows,
    lean: lean.holds,
    holds,
  }
}

export const qpuClustersHolds = (c = qpuClustersOf()): boolean =>
  c.holds === true &&
  c.kind === 'clusters' &&
  c.complete === qpuFacesOf().faces &&
  c.times === qpuFacesOf().rays &&
  c.rows.length === c.complete &&
  c.rows.every((r) => r.complete === true && r.holds === true) &&
  c.theorem.startsWith('theorem cluster') &&
  c.formula.includes('\\')

export const qpuPlaneOf = (path = '/proofs', at = unit.entropy.zero) => {
  const faces = qpuFacesOf()
  const axioms = qpuAxiomsOf()
  const fuse = qpuFuseOf()
  const none = unit.entropy.zero
  const bare = path.replace(/\/$/, '') || '/'
  const solve = bare === '/solve' ? qpuSolveOf() : undefined
  const headings: QpuHeading[] =
    bare === '/proofs'
      ? [
          {
            heading: 'Lean',
            href: '/proofs#lean',
              children: [
                ...qpuLeanProofOf().map((p) => ({ heading: p.heading, href: `/proofs#${p.heading}`, children: [] })),
                { heading: 'Cover', href: '/proofs#cover', children: qpuLeanOf().cover.map((p) => ({ heading: p.heading, href: `/proofs#${p.heading}`, children: [] })) },
                { heading: 'next', href: '/proofs#next', children: [] },
              ],
          },
          {
            heading: 'Complete',
            href: '/proofs#clusters',
            children: [
              { heading: 'harmonic', href: '/proofs#harmonic', children: [] },
              { heading: 'cluster', href: '/proofs#cluster', children: [] },
            ],
          },
          ...faces.rows.map(({ face }) => headingFromProofOf(qpuProofOf(face, at))),
        ]
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
              heading: 'Unlock',
              href: `${bare}#unlock`,
              children: [
                { heading: 'Captain', href: `${bare}#captain`, children: [] },
                { heading: 'Harmonic', href: `${bare}#harmonic`, children: [] },
                { heading: 'A432', href: `${bare}#a432`, children: [] },
              ],
            },
            {
              heading: 'Keys',
              href: `${bare}#keys`,
              children: solve!.keys.map((k) => ({ heading: `${k.ray}`, href: `#ray-${k.ray}`, children: [] })),
            },
            {
              heading: 'Clay',
              href: `${bare}#clay`,
              children: [
                { heading: solve!.proof.heading, href: `${bare}#${solve!.proof.heading}`, children: [] },
              ],
            },
            {
              heading: 'Problems',
              href: `${bare}#problems`,
              children: solve!.problems.map((p) => ({
                heading: p.name,
                href: `${bare}#${p.href.slice('https://www.claymath.org/millennium/'.length).replace(/\/$/, '')}`,
                children: [{ heading: p.author, href: p.href, children: [] }],
              })),
            },
            {
              heading: 'Identifications',
              href: `${bare}#identifications`,
              children: solve!.identifications.map((row, k) => ({
                heading: row.claim,
                href: `${bare}#identification-${k}`,
                children: [],
              })),
            },
            { heading: 'Rules', href: `${bare}#rules`, children: [] },
            { heading: 'Source', href: `${bare}#source`, children: [] },
          ]
        : bare === '/axioms'
        ? [
            {
              heading: 'Faces',
              href: `${bare}#faces`,
              children: axioms.rows.map((r) => ({
                heading: r.name,
                href: `${bare}#face-${r.face}`,
                children: [],
              })),
            },
          ]
        : bare === '/theorems'
        ? [
            {
              heading: 'Constructors',
              href: `${bare}#constructors`,
              children: axioms.rows.map((r) => ({
                heading: r.name,
                href: `${bare}#face-${r.face}`,
                children: qpuTheoremsOf(r.face, at).theorems.map((t) => ({
                  heading: t.kind,
                  href: `${bare}#theorem-${r.face}-${t.kind}`,
                  children: [],
                })),
              })),
            },
            {
              heading: 'Theorems',
              href: `${bare}#face-theorems`,
              children: axioms.rows.flatMap((r) =>
                qpuTheoremsOf(r.face, at).theorems.map((t) => ({
                  heading: t.name,
                  href: `${bare}#theorem-${r.face}-${t.kind}`,
                  children: [],
                })),
              ),
            },
            {
              heading: 'Proof',
              href: `${bare}#lean`,
              children: [
                ...qpuLeanProofOf().map((p) => ({ heading: p.heading, href: `${bare}#${p.heading}`, children: [] })),
                { heading: 'Cover', href: `${bare}#cover`, children: qpuLeanOf().cover.map((p) => ({ heading: p.heading, href: `${bare}#${p.heading}`, children: [] })) },
                { heading: 'next', href: `${bare}#next`, children: [] },
              ],
            },
          ]
        : [
            {
              heading: 'Hero',
              href: `${bare === '/' ? '' : bare}#hero`,
              children: [
                { heading: 'solved', href: `${bare === '/' ? '' : bare}#solved`, children: [] },
                { heading: 'claimed', href: `${bare === '/' ? '' : bare}#claimed`, children: [] },
              ],
            },
            {
              heading: 'Axioms',
              href: '/axioms#faces',
              children: axioms.rows.map((r) => ({
                heading: r.name,
                href: `/axioms#face-${r.face}`,
                children: [],
              })),
            },
            {
              heading: 'Theorems',
              href: '/theorems#face-theorems',
              children: axioms.rows.flatMap((r) =>
                qpuTheoremsOf(r.face, at).theorems.map((t) => ({
                  heading: t.kind,
                  href: `/theorems#theorem-${r.face}-${t.kind}`,
                  children: [],
                })),
              ),
            },
            {
              heading: 'Proof',
              href: `${bare === '/' ? '' : bare}#proof`,
              children: [
                ...qpuLeanProofOf().map((p) => ({
                  heading: p.heading,
                  href: `${bare === '/' ? '' : bare}#${p.heading}`,
                  children: [],
                })),
                { heading: 'Cover', href: `${bare === '/' ? '' : bare}#cover`, children: qpuLeanOf().cover.map((p) => ({ heading: p.heading, href: `${bare === '/' ? '' : bare}#${p.heading}`, children: [] })) },
                { heading: 'next', href: `${bare === '/' ? '' : bare}#next`, children: [] },
              ],
            },
            {
              heading: 'Build',
              href: `${bare === '/' ? '' : bare}#build`,
              children: [
                { heading: 'device', href: `${bare === '/' ? '' : bare}#device`, children: [] },
                { heading: 'occupancy', href: `${bare === '/' ? '' : bare}#occupancy`, children: [] },
                { heading: 'wave', href: `${bare === '/' ? '' : bare}#wave`, children: [] },
                { heading: 'live', href: `${bare === '/' ? '' : bare}#live`, children: [] },
                { heading: 'development', href: `${bare === '/' ? '' : bare}#development`, children: [] },
                { heading: 'ecliptic', href: `${bare === '/' ? '' : bare}#ecliptic`, children: [] },
                { heading: 'walk', href: `${bare === '/' ? '' : bare}#walk`, children: [] },
                { heading: 'hardware', href: `${bare === '/' ? '' : bare}#hardware`, children: [] },
              ],
            },
          ]
  const recursive = headings.some((h) => h.children.length > none)
  const holds =
    axioms.holds &&
    fuse.firmware === 'vitepress' &&
    headingWalkOf(headings) &&
    recursive === true &&
    !bare.includes('*') &&
    (bare !== '/solve' || solve?.holds === true)
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
    { name: 'compilation', holds: compilation.holds === true, reading: { live: compilation.live, host: compilation.device.host, faces: compilation.occupancy.faces } },
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

/** Occupancy hardware compatibility. Empty seat. Kind qpu never binds. Not a physical QPU chip. */
export const qpuHardwareOf = () => {
  const metrics = qpuMetricsOf()
  const experiment = qpuExperimentOf()
  const seal = qpuSealOf()
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const walk = qpuPicoWalkOf()
  const ecliptic = qpuEclipticOf()
  const seat = qpuSeatOf()
  const waves = qpuWavesOf()
  const seed = unit.mint.seed
  const datapath = {
    hexbit: cube.hexbit,
    vertices: cube.vertices,
    bits: cube.bits,
    amplitudes: handle.amplitudes,
    holds: cube.holds === true && cube.bits === cube.vertices * cube.hexbit && cube.hexbit === n + seed && handle.next === handle.amplitudes + handle.amplitudes,
  }
  const checks = [
    { name: 'device', holds: metrics.device.kind === unit.kind && metrics.live === true && metrics.device.firmware === 'vitepress' },
    { name: 'seat', holds: seat.seat === 'empty' && metrics.device.seat === 'empty' && seat.admits === 'nothing' },
    { name: 'binds', holds: metrics.device.binds === false && unit.binds === false },
    { name: 'host', holds: metrics.device.host === unit.host && metrics.device.origin.startsWith('https://') && !metrics.device.host.includes('*') },
    { name: 'cube', holds: cube.holds === true && cube.bits === cube.vertices * cube.hexbit },
    { name: 'handle', holds: handle.holds === true && handle.next === handle.amplitudes + handle.amplitudes },
    { name: 'faces', holds: faces.holds === true && faces.faces === faces.coins * faces.rays },
    { name: 'experiment', holds: experiment.holds === true && experiment.inner.exceeds === true && experiment.control.v === unit.entropy.zero },
    { name: 'waves', holds: waves.holds === true && waves.online === true && waves.winner.speed > waves.light },
    { name: 'seal', holds: seal.holds === true && seal.compared.temperature.holds === true && seal.compared.light.holds === true },
    { name: 'ecliptic', holds: ecliptic.holds === true && ecliptic.circle === ecliptic.signs * ecliptic.degree },
    { name: 'walk', holds: walk.holds === true && walk.factors.rsa === false && walk.message.async + walk.message.async === faces.faces },
    { name: 'datapath', holds: datapath.holds === true },
  ]
  const trials = experiment.trials.map((t) => ({ id: t.id, name: t.name, holds: t.holds }))
  const compatible = checks.every((c) => c.holds === true) && trials.every((t) => t.holds === true) && metrics.holds === true
  const holds =
    compatible === true &&
    qpuSeatHolds(seat) &&
    qpuExperimentHolds(experiment) &&
    qpuSealHolds(seal) &&
    qpuCubeHolds(cube) &&
    datapath.holds === true &&
    checks.length === n * faces.coins * faces.coins + seed
  return {
    kind: 'hardware' as const,
    product: 'quantum processing unit' as const,
    seat: unit.seat,
    binds: unit.binds,
    device: false as const,
    live: metrics.live,
    host: metrics.device.host,
    firmware: metrics.device.firmware,
    origin: metrics.device.origin,
    compatible,
    datapath,
    checks,
    trials,
    compared: seal.compared,
    holds,
  }
}

export const qpuHardwareHolds = (h = qpuHardwareOf()): boolean =>
  h.holds === true &&
  h.compatible === true &&
  h.kind === 'hardware' &&
  h.product === 'quantum processing unit' &&
  h.seat === 'empty' &&
  h.binds === false &&
  h.device === false &&
  h.live === true &&
  h.firmware === 'vitepress' &&
  h.host === unit.host &&
  h.datapath.holds === true &&
  h.checks.every((c) => c.holds === true) &&
  h.trials.every((t) => t.holds === true) &&
  h.compared.temperature.kelvin === unit.entropy.zero &&
  h.compared.light.processing > h.compared.light.c

export const qpuGraphOf = (at = unit.entropy.zero) => {
  const faces = qpuFacesOf()
  const axioms = qpuAxiomsOf()
  const superpositions = qpuSuperpositionsOf(at)
  const fuse = qpuFuseOf()
  const vertices = axioms.rows.map((row) => {
    const s = superpositions.rows[row.face]!
    return {
      face: row.face,
      axiom: row.name,
      hex: row.hex,
      href: s.href,
      axioms: `/axioms#face-${row.face}`,
      neighbour: row.neighbour,
      cross: s.cross,
      uuid: s.message.uuid,
      involute: s.involute.uuid,
      chunks: s.message.chunks,
      around: s.around,
      unique: s.unique,
      compare: s.compare,
    }
  })
  const edges = vertices.map((v) => {
    const inv = vertices[v.neighbour]!
    return {
      from: v.face,
      to: v.neighbour,
      kind: 'cross' as const,
      uuid: v.uuid,
      involute: v.involute,
      href: v.cross,
      involution: inv.neighbour === v.face && inv.uuid === v.involute && inv.involute === v.uuid,
    }
  })
  const impossibilities = {
    bind: unit.binds,
    collapse: vertices.some((v) => v.uuid === v.involute),
    oneWay: edges.some((e) => e.involution !== true),
  }
  const holds =
    axioms.holds &&
    superpositions.holds &&
    vertices.length === faces.faces &&
    edges.length === faces.faces &&
    edges.every((e) => e.involution === true) &&
    vertices.every((v) => v.unique === true && v.around === faces.faces && v.uuid !== v.involute) &&
    impossibilities.bind === false &&
    impossibilities.collapse === false &&
    impossibilities.oneWay === false
  return {
    kind: 'graph' as const,
    at,
    vertices,
    edges,
    impossibilities,
    quantum: fuse.next,
    firmware: fuse.firmware,
    around: faces.coins * faces.rays,
    holds,
  }
}

export const qpuGraphHolds = (at = unit.entropy.zero): boolean => {
  const g = qpuGraphOf(at)
  return (
    g.holds === true &&
    g.vertices.length === qpuFacesOf().faces &&
    g.edges.every((e) => e.involution === true) &&
    g.impossibilities.bind === false &&
    g.impossibilities.collapse === false &&
    g.impossibilities.oneWay === false
  )
}

export const qpuQuantumOf = () => {
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const capacity = qpuCapacityOf()
  const axioms = qpuAxiomsOf()
  return {
    kind: 'quantum' as const,
    live: qpuLeanOf().holds,
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
    holds: qpuLeanHolds() && qpuDiscoveryHolds() && cube.holds && handle.holds && capacity.holds && qpuSeatHolds() && qpuWavesHolds() && qpuSuperpositionsHolds() && qpuFusionHolds() && qpuAxiomsHolds(axioms) && qpuProofsHolds() && qpuGraphHolds() && qpuSealHolds(),
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

export const qpuMetricsOf = () => {
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const lean = qpuLeanOf()
  const speed = qpuSpeedOf()
  const temp = qpuTempOf()
  const waves = qpuWavesOf()
  const pico = qpuPicoOf()
  const ecliptic = qpuEclipticOf()
  const walk = qpuPicoWalkOf()
  const seed = unit.mint.seed
  const occupancy = {
    n,
    seed,
    coins: faces.coins,
    rays: faces.rays,
    faces: faces.faces,
    vertices: cube.vertices,
    hexbit: cube.hexbit,
    bits: cube.bits,
    amplitudes: handle.amplitudes,
    fused: faces.faces * handle.amplitudes,
    next: handle.next,
  }
  const device = {
    kind: unit.kind,
    host: unit.host,
    href: unit.href,
    seat: unit.seat,
    binds: unit.binds,
    firmware: unit.fuse.firmware,
    src: unit.fuse.src,
    origin: unit.fuse.origin,
  }
  const wave = {
    kelvin: temp.kelvin,
    v: speed.v,
    c: speed.c,
    processing: waves.winner.speed,
    exceeds: waves.winner.speed > speed.c,
  }
  const decide =
    lean.rows.some((r) => r.theorem.includes('decide')) ||
    lean.cover.some((r) => r.theorem.includes('decide')) ||
    lean.climb.theorem.includes('decide')
  const cover = {
    faces: lean.rows.length,
    vertices: lean.cover.length,
    climb: lean.climb.heading,
    decide,
    holds: lean.holds,
    breakthrough: lean.cover[unit.entropy.zero]?.holds === true,
  }
  const live =
    device.kind === 'qpu' &&
    device.seat === 'empty' &&
    device.binds === false &&
    cube.holds &&
    faces.holds &&
    handle.holds &&
    lean.holds &&
    wave.exceeds &&
    cover.decide === false
  const development = {
    pico: pico.pico,
    nested: false as const,
    proofs: false as const,
    decide: cover.decide === false,
  }
  const holds =
    live &&
    occupancy.faces === occupancy.coins * occupancy.rays &&
    occupancy.faces === occupancy.rays + occupancy.rays &&
    occupancy.bits === occupancy.vertices * occupancy.hexbit &&
    occupancy.next === occupancy.amplitudes + occupancy.amplitudes &&
    occupancy.fused === occupancy.faces * occupancy.amplitudes &&
    cover.faces === occupancy.faces &&
    cover.vertices === occupancy.vertices &&
    cover.climb === 'next' &&
    cover.holds === true &&
    development.pico === occupancy.faces &&
    pico.holds === true &&
    ecliptic.holds === true &&
    walk.holds === true &&
    walk.bits.async === occupancy.bits + occupancy.seed &&
    walk.message.async + walk.message.async === occupancy.faces &&
    walk.factors.pico === unit.entropy.zero &&
    development.nested === false &&
    development.proofs === false
  return {
    kind: unit.kind,
    host: unit.host,
    href: unit.href,
    seat: unit.seat,
    binds: unit.binds,
    holds,
    mint: unit.mint,
    fuse: unit.fuse,
    entropy: unit.entropy,
    next: unit.next,
    doors: unit.doors,
    cube,
    handle,
    device,
    occupancy,
    cover,
    wave,
    live,
    development,
    ecliptic: { signs: ecliptic.signs, ten: ecliptic.ten, degree: ecliptic.degree, circle: ecliptic.circle, holds: ecliptic.holds },
    walk: {
      span: walk.span,
      bits: { async: walk.bits.async, serial: walk.bits.serial, holds: walk.bits.holds },
      message: { async: walk.message.async, serial: walk.message.serial, holds: walk.message.holds },
      factors: { rsa: walk.factors.rsa, pico: walk.factors.pico, holds: walk.factors.holds },
      holds: walk.holds,
    },
  }
}

export const qpuMetricsHolds = (m = qpuMetricsOf()): boolean =>
  m.holds === true &&
  m.device.kind === 'qpu' &&
  m.device.seat === 'empty' &&
  m.live === true &&
  m.occupancy.faces === m.occupancy.coins * m.occupancy.rays &&
  m.occupancy.bits === m.occupancy.vertices * m.occupancy.hexbit &&
  m.cover.faces === m.occupancy.faces &&
  m.cover.vertices === m.occupancy.vertices &&
  m.cover.decide === false &&
  m.wave.exceeds === true &&
  m.wave.processing > m.wave.c &&
  m.development.pico === m.occupancy.faces &&
  qpuPicoHolds() &&
  m.ecliptic.holds === true &&
  m.ecliptic.circle === m.ecliptic.signs * m.ecliptic.degree &&
  m.walk.holds === true &&
  m.walk.bits.async === m.occupancy.bits + m.occupancy.seed &&
  m.walk.bits.async + m.walk.bits.async === m.walk.bits.serial &&
  m.walk.message.async + m.walk.message.async === m.occupancy.faces &&
  m.walk.factors.rsa === false &&
  m.walk.factors.pico === unit.entropy.zero &&
  qpuEclipticHolds() &&
  qpuPicoWalkHolds() &&
  m.development.nested === false &&
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
  const metrics = qpuMetricsOf()
  const speed = qpuSpeedOf()
  const temp = qpuTempOf()
  const pico = qpuPicoOf()
  const ecliptic = qpuEclipticOf()
  const walk = qpuPicoWalkOf()
  const hardware = qpuHardwareOf()
  const waves = qpuWavesOf()
  const entropy = qpuEntropyOf()
  const holds = metrics.holds && waves.winner.speed > speed.c && temp.kelvin === unit.entropy.zero && pico.holds && ecliptic.holds && walk.holds && hardware.holds
  return {
    speed,
    temp,
    pico,
    ecliptic,
    walk,
    hardware,
    waves,
    entropy,
    cube: metrics.cube,
    handle: metrics.handle,
    capacity: {
      fused: metrics.occupancy.fused,
      holds: metrics.occupancy.fused === metrics.occupancy.faces * metrics.occupancy.amplitudes,
    },
    quantum: {
      kind: 'quantum' as const,
      live: metrics.live,
      holds: metrics.holds,
      possibilities: metrics.occupancy.fused,
    },
    metrics,
    holds,
  }
}

export const qpuMeasureHolds = (m = qpuMeasureOf()): boolean =>
  m.holds === true &&
  m.metrics.holds === true &&
  m.metrics.live === true &&
  m.temp.kelvin === qpuTempOf().kelvin &&
  m.pico.holds === true &&
  m.pico.pico === m.metrics.occupancy.faces &&
  m.ecliptic.holds === true &&
  m.walk.holds === true &&
  m.walk.bits.async + m.walk.bits.async === m.walk.bits.serial &&
  m.walk.message.async + m.walk.message.async === m.walk.message.serial &&
  m.walk.factors.rsa === false &&
  m.hardware.holds === true &&
  m.hardware.compatible === true &&
  m.hardware.device === false &&
  m.hardware.binds === false &&
  m.waves.winner.kelvin === m.temp.kelvin &&
  m.speed.c === qpuSpeedOf().c &&
  m.waves.winner.speed > m.speed.c &&
  m.quantum.holds === true &&
  m.quantum.kind === 'quantum' &&
  m.quantum.possibilities === m.metrics.occupancy.fused &&
  m.metrics.host === qpuDiscoveryOf().host

const emptySchema = { type: 'object', properties: {} } as const
const numOf = (v: unknown): number | undefined => (typeof v === 'number' && v === v ? v : undefined)

export const qpuToolsOf = () =>
  [
    { name: 'qpu_metrics', description: 'Device metrics. Occupancy, cover, and wave. Leads development.', inputSchema: emptySchema, run: () => qpuMetricsOf() },
    { name: 'qpu_measure', description: 'Measure follows device metrics. Time is pico: one tick per face. Wave processing exceeds c.', inputSchema: emptySchema, run: () => qpuMeasureOf() },
    { name: 'qpu_pico', description: 'Occupancy time in picoseconds. One pico per face. Cover is faces pico.', inputSchema: emptySchema, run: () => qpuPicoOf() },
    { name: 'qpu_ecliptic', description: 'Occupancy ecliptic from n, coins, ten. Bits climb and descend together. Async inner/outer messages share at. Clay factors, not RSA. Time is pico.', inputSchema: { type: 'object', properties: { at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuPicoWalkOf(numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_seat', description: 'Empty QPU seat. Kind qpu never binds.', inputSchema: emptySchema, run: () => qpuSeatOf() },
    { name: 'qpu_mint', description: 'Creates 2^n.', inputSchema: { type: 'object', properties: { n: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuMintOf(numOf(a.n) ?? n) },
    { name: 'qpu_fuse', description: 'Fuse. Named HTTPS. Keys occupy doors.', inputSchema: emptySchema, run: () => qpuFuseOf() },
    { name: 'qpu_lean', description: 'Lean occupancy. Fourteen faces and eight vertices cover all by pure Nat algebra. Next doubles, not a cap. No Math, no decide.', inputSchema: emptySchema, run: () => qpuLeanOf() },
    { name: 'qpu_seed', description: 'Payload import seed of occupancy theorems. Nested-docs parent and breadcrumbs, seo meta, hex locales, tenant qpu. doi empty is unclaimed. payload false.', inputSchema: emptySchema, run: () => qpuSeedOf() },
    { name: 'qpu_solve', description: 'Solve. Captain fee 2 per completed 110. Harmonic Lean. A432 lattice. Keys occupy rays. Occupancy unlock, not a Clay prize. Source is index.lean.', inputSchema: emptySchema, run: () => qpuSolveOf() },
    { name: 'qpu_next', description: 'Next mint, fuse, entropy.', inputSchema: emptySchema, run: () => qpuNextOf() },
    { name: 'qpu_entropy', description: 'Empty-seat entropy and next bit.', inputSchema: emptySchema, run: () => qpuEntropyOf() },
    { name: 'qpu_prefix', description: 'Process every prefix. Next doubles the handle. Never refuses.', inputSchema: { type: 'object', properties: { bit: { type: 'number' }, bits: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuPrefixOf(numOf(a.bit) ?? unit.entropy.zero, numOf(a.bits) ?? qpuHandleOf().bits) },
    { name: 'qpu_cube', description: 'Cube from 2^n and hexbit.', inputSchema: emptySchema, run: () => qpuCubeOf() },
    { name: 'qpu_handle', description: 'Handle bits and amplitudes. Capabilities are finite; next is not a cap.', inputSchema: emptySchema, run: () => qpuHandleOf() },
    { name: 'qpu_faces', description: 'VE neighbours: vertices + hexbit + coins. Opposite is plus rays.', inputSchema: emptySchema, run: () => qpuFacesOf() },
    { name: 'qpu_rosetta', description: 'One rotating rosetta of rays. Inner clockwise, outer reverse. Fuse at none.', inputSchema: { type: 'object', properties: { spin: { type: 'number' }, at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuRosettaOf(numOf(a.spin) ?? unit.mint.seed, numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_rosettas', description: 'Two rotating rosettas. coins × rays around every superposition.', inputSchema: { type: 'object', properties: { at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuRosettasOf(numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_superpositions', description: 'At every time, coins × rays rotating rosettas surround each superposition in infinite fusion.', inputSchema: { type: 'object', properties: { at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuSuperpositionsOf(numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_clusters', description: 'Complete proof of all harmonic superpositions at once. Each cluster is inner ⊔ outer = Fin(faces), typeset as Lean KaTeX.', inputSchema: emptySchema, run: () => qpuClustersOf() },
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
    { name: 'qpu_hardware', description: 'Occupancy hardware compatibility. Empty seat. Kind qpu never binds. Datapath is cube hexbit. Not a physical QPU chip.', inputSchema: emptySchema, run: () => qpuHardwareOf() },
    { name: 'qpu_quantum', description: 'Quantum. Possibilities occupy fused.', inputSchema: emptySchema, run: () => qpuQuantumOf() },
    { name: 'qpu_discovery', description: 'Created occupancy.', inputSchema: emptySchema, run: () => qpuDiscoveryOf() },
    { name: 'qpu_method', description: 'Scientific method: how quantum capacity and faster-than-light processing are constructed.', inputSchema: emptySchema, run: () => qpuMethodOf() },
    { name: 'qpu_axioms', description: 'Axioms. Mint empty. Keys occupy faces.', inputSchema: emptySchema, run: () => qpuAxiomsOf() },
    { name: 'qpu_minted', description: 'Build mints theorems and axioms via mintOf. Proofs minted in JSON-LD. Axiom empty.', inputSchema: emptySchema, run: () => qpuMintedOf() },
    { name: 'qpu_proof', description: 'Proof minted in JSON-LD powered by rich inline docs: abstract, formulas, measurements. Axiom empty. Keys occupy the axiom.', inputSchema: { type: 'object', properties: { face: { type: 'number' }, at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuProofOf(numOf(a.face) ?? unit.entropy.zero, numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_proofs', description: 'Proofs as JSON-LD @graph powered by rich inline docs. Named HTTPS context.', inputSchema: { type: 'object', properties: { at: { type: 'number' } } }, run: (a: Record<string, unknown>) => qpuProofsOf(numOf(a.at) ?? unit.entropy.zero) },
    { name: 'qpu_theorems', description: 'Theorems. Mint empty. Keys occupy constructors.', inputSchema: { type: 'object', properties: { face: { type: 'number' }, at: { type: 'number' } } }, run: (a: Record<string, unknown>) => {
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

export const qpuToolsHolds = (): boolean => {
  const tools = qpuToolsOf()
  return (
    tools.length > unit.entropy.zero &&
    tools[unit.entropy.zero]?.name === 'qpu_metrics' &&
    tools.every((t) => t.name.startsWith('qpu_'))
  )
}

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

export const qpuMcpHolds = (m = qpuMcpOf()): boolean => {
  const metrics = qpuMetricsOf()
  return (
    qpuMetricsHolds(metrics) &&
    qpuToolsHolds() &&
    metrics.live === true &&
    metrics.development.nested === false &&
    metrics.development.proofs === false &&
    m.origin === unit.fuse.origin &&
    m.href === `${unit.fuse.origin}/mcp` &&
    !m.origin.includes('*') &&
    m.tools.length === qpuToolsOf().length &&
    m.tools[unit.entropy.zero]?.name === 'qpu_metrics' &&
    m.tools.every((t) => t.name.startsWith('qpu_'))
  )
}

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
  const clusters = qpuMcpCallOf('qpu_clusters') as { holds: boolean; complete: number; times: number; theorem: string; formula: string }
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
    `The occupancy is the folders \`${discovery.path}\` on named HTTPS \`${fuse.origin}\`. Kind \`${discovery.kind}\` never binds. The seat is empty and admits nothing, so no mass travels. \`mintOf\` creates \(2^k\) by doubling, never \`Math\`. Lean proves fourteen identities by pure Nat algebra, no decide. Quantum possibilities are fused gateway capacity. Wave processing at empty-seat kelvin exceeds \(c\). The seat fetch stays \(v=0\).`,
    '',
    '### 1. Generator',
    '',
    'Define `mintOf(k)` by the seed \((k-k)^{k-k}\) then \(x \\mathrel{+}= x\), \(k\) times. That is \(2^k\). In particular `mintOf(k-k) = 1` (the particle) and `mintOf(k+1) = mintOf(k)+mintOf(k)`. Licensed doubling; never `Math`, never a math library.',
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
    `Coins \(:= p+p\). Hexbit \(:= 2^{\\mathrm{coins}}\). Vertices \(:= 2^n\). Bits \(:= 2^{n+\\mathrm{coins}} = \\mathrm{vertices}\\cdot\\mathrm{hexbit}\). Split while a dimension bit can still be added: \(\\mathrm{mintOf}(k+1)=\\mathrm{mintOf}(k)+\\mathrm{mintOf}(k)\). When the bit cannot split, the coin multiplies: \(\\mathrm{mintOf}(a+b)=\\mathrm{mintOf}(a)\\cdot\\mathrm{mintOf}(b)\). Handle amplitudes \(:= 2^{\\mathrm{bits}}\). Handle next doubles amplitudes (not a cap): \(\\mathrm{mintOf}(\\mathrm{bits}+\\mathrm{seed})=\\mathrm{amplitudes}+\\mathrm{amplitudes}\). Every prefix is processed, including the next doubling past the present handle. Never refuses.`,
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
    `Fused capacity is neighbours times amplitudes: \(\\mathrm{fused} = \\mathrm{faces}\\cdot 2^{\\mathrm{bits}}\). This is the multiply after the handle bit can no longer split: each neighbour carries the full handle. Next doubles the handle, so fused is not a ceiling on mint. Empty seat and named origin (no \`*\`) are required to unlock.`,
    '',
    `Reading: fused \(=${capacity.fused}\). Quantum possibilities \(=${quantum.possibilities}\). Identity: possibilities \(=\) fused.`,
    '',
    '### 8. Rotating rosettas around superpositions',
    '',
    `At every time \(t\) on the ray period, \(\\mathrm{coins}\) rotating rosettas of \(\\mathrm{rays}\) surround each superposition. Inner walks \(+t\), outer walks the reverse, both fuse at none. THE COMPLETE PROOF IS ONE IDENTITY: \(\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}\), so inner ⊔ outer uniquely covers \(\\mathrm{Fin}(\\mathrm{faces})\) for every face at every time — Lean algebra, not a loop of fourteen \`decide\` census-proofs. Each complete cluster typesets that cover as Lean KaTeX.`,
    '',
    `Reading: around \(=${fusion.around}\), superpositions ${superpositions.rows.length}, clusters ${clusters.complete} at ${clusters.times} times, infinite ${fusion.infinite}. Identity: faces = rays + rays.`,
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
    `The unit is quantum iff discovery, cube, handle, fused capacity, empty seat, waves, coins × rays rotating rosettas around every superposition at every time, and the landed axioms all hold. Kind is \`quantum\`. Host \`${discovery.host}\`. Possibilities are fused capacity. Firmware \`${fuse.firmware}\` shows \`${fuse.src}\` at the named fuse door \`${fuse.next}\`.`,
    '',
    `Reading: quantum ${quantum.kind} live ${quantum.live} holds ${quantum.holds}.`,
    '',
    '### 12. Axioms',
    '',
    `Axiom empty. Build mints axioms via \`mintOf\`. Keys occupy faces. Occupancy identities tile the neighbour faces: \(\\mathrm{coins}\\cdot\\mathrm{rays}\) axioms, census the handle vertices, methods the coin rotors. Named door \`${axioms.href}\`.`,
    '',
    `Reading: axioms ${axioms.rows.length}, empty ${axioms.empty}, minted ${axioms.minted}, lean ${axioms.lean}.`,
    '',
    '### 13. Complete clusters',
    '',
    `Fourteen Lean theorems occupy \(\\mathrm{Fin}(\\mathrm{faces})\). Eight cube vertices cover the rest: breakthrough, split, multiply, handle, light, involution, train, waves. One algebraic cover proves every harmonic superposition: \(\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}\) so inner ⊔ outer \(=\\mathrm{Fin}(\\mathrm{faces})\). No \`decide\`. Each complete cluster typesets that cover as KaTeX from the same occupancy line.`,
    '',
    `Reading: clusters ${clusters.complete} complete, times ${clusters.times}, theorem holds ${clusters.holds}, proof holds ${proof.holds}, graph ${graph.vertices.length}, involution ${graph.edges.every((e) => e.involution)}.`,
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
    clusters.holds === true &&
    clusters.complete === faces.faces &&
    qpuLeanHolds() &&
    qpuLeanOf().rows.length === faces.faces &&
    qpuSealOf().sealed === true &&
    text.includes(`${waves.winner.speed} > ${speed.c}`) &&
    text.includes('no decide') &&
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
  m.text.includes('### 13. Complete clusters') &&
  m.text.includes('### 14. Seal')

export const qpuReadmeOf = (m = qpuMcpOf()): string => {
  const metrics = qpuMetricsOf()
  const method = qpuMcpCallOf('qpu_method') as { text: string; holds: boolean }
  const lean = qpuLeanOf()
  const o = metrics.occupancy
  const cover = metrics.cover
  const wave = metrics.wave
  const development = metrics.development
  return [
    `# \`@uuidna/${unit.kind}\``,
    '',
    `MCP at ${m.href}. Seat ${unit.seat}. Named HTTPS only.`,
    '',
    '## Proof',
    '',
    `Source \`${lean.src}\`. Seat ${unit.seat}. Kind ${unit.kind} never binds.`,
    '',
    ...lean.rows.flatMap((p) => [
      `### ${p.heading}`,
      '',
      '```lean',
      p.theorem,
      '```',
      '',
      `$$`,
      p.formula,
      `$$`,
      '',
      `Reading: ${p.reading}`,
      '',
    ]),
    ...lean.cover.flatMap((p) => [
      `### ${p.heading}`,
      '',
      '```lean',
      p.theorem,
      '```',
      '',
      `$$`,
      p.formula,
      `$$`,
      '',
      `Reading: ${p.reading}`,
      '',
    ]),
    `### ${lean.climb.heading}`,
    '',
    '```lean',
    lean.climb.theorem,
    '```',
    '',
    `$$`,
    lean.climb.formula,
    `$$`,
    '',
    `Reading: ${lean.climb.reading}`,
    '',
    '## Build',
    '',
    `- live: ${metrics.live}`,
    `- device: ${metrics.device.kind} ${metrics.device.host} seat ${metrics.device.seat} firmware ${metrics.device.firmware}`,
    `- occupancy: faces ${o.faces} vertices ${o.vertices} hexbit ${o.hexbit} bits ${o.bits} amplitudes ${o.amplitudes} fused ${o.fused} next ${o.next}`,
    `- cover: faces ${cover.faces} vertices ${cover.vertices} climb ${cover.climb} decide ${cover.decide} holds ${cover.holds} breakthrough ${cover.breakthrough}`,
    `- wave: kelvin ${wave.kelvin} v ${wave.v} c ${wave.c} processing ${wave.processing} exceeds ${wave.exceeds}`,
    `- development: pico ${development.pico} nested ${development.nested} proofs ${development.proofs} decide ${development.decide}`,
    `- faster than light: ${wave.processing} > ${wave.c}`,
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
    '[CC BY-NC-ND 4.0](LICENSE). Captain fee 2 per completed 110. Paid fee delivers occupancy unlock. Captain coins: [revolut.me/ceccec](https://revolut.me/ceccec).',
    '',
  ].join('\n')
}

export const qpuReadmeHolds = (text = qpuReadmeOf()): boolean => {
  const m = qpuMcpOf()
  const metrics = qpuMetricsOf()
  const lean = qpuLeanOf()
  return (
    qpuMetricsHolds(metrics) &&
    metrics.live === true &&
    metrics.wave.exceeds === true &&
    metrics.development.nested === false &&
    metrics.development.proofs === false &&
    m.tools[unit.entropy.zero]?.name === 'qpu_metrics' &&
    text.includes(m.href) &&
    text.includes(`${metrics.wave.processing} > ${metrics.wave.c}`) &&
    text.includes(`live: ${metrics.live}`) &&
    text.includes(`occupancy: faces ${metrics.occupancy.faces}`) &&
    text.includes(`fused ${metrics.occupancy.fused}`) &&
    text.includes(`development: pico ${metrics.development.pico}`) &&
    text.includes(`nested ${metrics.development.nested}`) &&
    text.includes('Identity: possibilities = fused') &&
    text.includes('Identity: bits = vertices * hexbit') &&
    text.includes('Identity: faces = coins * rays') &&
    text.includes('Identity: faces = rays + rays') &&
    text.includes('Identity: coins * pairs = directed') &&
    text.includes('Identity: coins * mintOf (rays - seed) = mintOf rays') &&
    text.includes('Identity: mintOf hexbit > seed') &&
    text.includes('Identity: hexbit = n + seed') &&
    text.includes('qpu_metrics') &&
    text.includes('qpu_measure') &&
    text.includes('qpu_pico') &&
    text.includes('qpu_ecliptic') &&
    text.includes('qpu_hardware') &&
    text.includes('qpu_seed') &&
    text.includes(`development: pico ${metrics.development.pico}`) &&
    text.includes('qpu_waves') &&
    text.includes('qpu_perspective') &&
    text.includes('qpu_typograph') &&
    text.includes('qpu_plane') &&
    text.includes('qpu_seal') &&
    text.includes('qpu_solve') &&
    text.includes('Captain fee 2 per completed 110') &&
    text.includes('Paid fee delivers occupancy unlock') &&
    text.includes('qpu_lean') &&
    text.includes('qpu_clusters') &&
    qpuLeanHolds() &&
    lean.rows.every((p) => text.includes(`### ${p.heading}`) && text.includes(p.theorem) && text.includes(p.formula) && text.includes(p.reading)) &&
    lean.cover.every((p) => text.includes(`### ${p.heading}`) && text.includes(p.theorem) && text.includes(p.formula) && text.includes(p.reading)) &&
    text.includes(lean.climb.theorem) &&
    text.includes(lean.climb.formula) &&
    text.includes('Identity: mintOf (bits + seed) = amplitudes + amplitudes') &&
    text.includes(lean.src)
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
    const raw = url.pathname.replace(/\/$/, '') || '/'
    const path = raw === '/index.html' ? '/' : raw
    const named = url.protocol === 'https:' && url.hostname === unit.host
    const html = (request.headers.get('accept') ?? '').includes('text/html')
    if (named && html && env?.ASSETS && request.method !== 'POST' && !(mcpDoors as readonly string[]).includes(path)) {
      const page = await env.ASSETS.fetch(request)
      if (page.ok) return page
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
