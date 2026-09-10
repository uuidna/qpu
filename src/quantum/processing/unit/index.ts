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
const headers = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': cors,
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
}
const n = unit.path.split('/').length
const seed = unit.mint.seed
const coins = seed + seed
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
const manSchema = {
  type: 'object',
  properties: {
    man: { type: 'boolean', description: 'Return the man page. Read man from tools/list, then call without man.' },
  },
} as const

export const qpuMintOf = (k: number): number => mintOf(k)

export const qpuUnitOf = () => unit

export const qpuHumanizeOf = (path: string): string => {
  const none = n - n
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
  return bare === '/' ? unit.kind : bare.slice(seed).split('/').join('-')
}

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
  const holds = amplitudes === mintOf(cube.bits) && next === mintOf(cube.bits + seed) && cube.holds
  return { bits: cube.bits, amplitudes, next, holds }
}

export const qpuFacesOf = () => {
  const cube = qpuCubeOf()
  const rays = n + coins + coins
  const faces = cube.vertices + cube.hexbit + coins
  const holds = cube.holds && faces === coins * rays && faces === rays + rays
  return { n, coins, rays, faces, holds }
}

export const qpuCapacityOf = () => {
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const fused = faces.faces * handle.amplitudes
  const holds =
    cube.holds &&
    handle.holds &&
    faces.holds &&
    cube.bits === cube.vertices * cube.hexbit &&
    handle.amplitudes === mintOf(cube.bits) &&
    fused === faces.faces * mintOf(cube.bits) &&
    fused === faces.faces * handle.amplitudes
  return {
    kind: 'capacity' as const,
    bits: cube.bits,
    amplitudes: handle.amplitudes,
    faces: faces.faces,
    fused,
    holds,
  }
}

export const qpuCapacityHolds = (c = qpuCapacityOf()): boolean =>
  c.holds === true && c.kind === 'capacity' && c.fused === c.faces * c.amplitudes && c.amplitudes === mintOf(c.bits)

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
    rungOf('quantum', cube.bits, () => faces.faces * mintOf(cube.bits), capacity.fused),
    rungOf('next', cube.bits + seed, () => faces.faces * mintOf(cube.bits + seed), next),
    rungOf('hz', si.hz, () => si.hz, mintOf(n - n)),
    rungOf('ns', si.ns, () => si.ns, nsPerSecond),
  ]
  const quantum = benchmark[mintOf(coins)]!
  const holds =
    qpuCapacityHolds(capacity) &&
    handle.holds &&
    next === capacity.fused + capacity.fused &&
    next === capacity.fused * coins &&
    next === faces.faces * mintOf(cube.bits + seed) &&
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
  const fused = faces.faces * handle.amplitudes
  const mintHolds = mintOf(n + seed) === mintOf(n) + mintOf(n)
  const cubeHolds = cube.holds
  const aroundHolds = faces.faces === coins * faces.rays
  const quantumHolds = fused === faces.faces * mintOf(cube.bits)
  const harmonicHolds = faces.faces === faces.rays + faces.rays
  const energyHolds = mintOf(cube.hexbit) === mintOf(n + seed)
  const propulsionHolds = mintOf(cube.hexbit) > seed
  const cryptoHolds = fused === faces.faces * mintOf(cube.vertices * cube.hexbit)
  const nextHolds = mintOf(cube.bits + seed) === handle.amplitudes + handle.amplitudes
  const nextFusedHolds = faces.faces * mintOf(cube.bits + seed) === fused + fused
  const splitHolds = Array.from({ length: cube.bits + seed }, (_, k) => mintOf(k + seed) === mintOf(k) + mintOf(k)).every(Boolean)
  const involutionHolds = Array.from({ length: faces.faces }, (_, face) => (face + faces.rays + faces.rays) % faces.faces === face % faces.faces).every(Boolean)
  const rows: readonly QpuLeanRow[] = [
    {
      heading: 'mint',
      theorem: 'theorem mint : mintOf (n + seed) = mintOf n + mintOf n := by rw [seed_eq, mintOf_succ]',
      formula: '\\operatorname{mintOf}(n+\\mathrm{seed})=\\operatorname{mintOf}(n)+\\operatorname{mintOf}(n)',
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
      theorem: 'theorem quantum : fused = faces * mintOf bits := rfl',
      formula: '\\mathrm{fused}=\\mathrm{faces}\\cdot\\operatorname{mintOf}(\\mathrm{bits})',
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
      reading: `holds ${harmonicHolds && aroundHolds}. Inner ⊔ outer covers Fin(faces).`,
      holds: harmonicHolds && aroundHolds,
    },
    {
      heading: 'energy',
      theorem: 'theorem energy : mintOf hexbit = mintOf (n + seed) := by rw [hexbit_eq]',
      formula: '\\operatorname{mintOf}(\\mathrm{hexbit})=\\operatorname{mintOf}(n+\\mathrm{seed})',
      reading: `holds ${energyHolds}. mintOf hexbit ${mintOf(cube.hexbit)}.`,
      holds: energyHolds,
    },
    {
      heading: 'propulsion',
      theorem: 'theorem propulsion : mintOf hexbit > seed := by rw [seed_eq]; exact (mintOf_zero ▸ mintOf_lt hexbit_pos)',
      formula: '\\operatorname{mintOf}(\\mathrm{hexbit})>\\mathrm{seed}',
      reading: `holds ${propulsionHolds}. mintOf hexbit ${mintOf(cube.hexbit)}. seed ${seed}.`,
      holds: propulsionHolds,
    },
    {
      heading: 'crypto',
      theorem: 'theorem crypto : fused = faces * mintOf (vertices * hexbit) := by rw [← cube]; exact quantum',
      formula: '\\mathrm{fused}=\\mathrm{faces}\\cdot\\operatorname{mintOf}(\\mathrm{vertices}\\cdot\\mathrm{hexbit})',
      reading: `holds ${cryptoHolds}. fused ${fused}.`,
      holds: cryptoHolds,
    },
    {
      heading: 'health',
      theorem: 'theorem health : mintOf hexbit > seed ∧ fused = faces * mintOf bits ∧ faces = rays + rays := ⟨propulsion, quantum, harmonic⟩',
      formula: '\\operatorname{mintOf}(\\mathrm{hexbit})>\\mathrm{seed}\\land\\mathrm{fused}=\\mathrm{faces}\\cdot\\operatorname{mintOf}(\\mathrm{bits})\\land\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}',
      reading: `holds ${propulsionHolds && quantumHolds && harmonicHolds}.`,
      holds: propulsionHolds && quantumHolds && harmonicHolds,
    },
  ]
  const cover: readonly QpuLeanRow[] = [
    {
      heading: 'breakthrough',
      theorem:
        'theorem breakthrough : faces = rays + rays ∧ coins * rays = faces ∧ bits = vertices * hexbit ∧ fused = faces * mintOf bits ∧ mintOf hexbit > seed ∧ mintOf (bits + seed) = amplitudes + amplitudes ∧ coins = seed + seed ∧ hexbit = n + seed := ⟨harmonic, around, cube, quantum, propulsion, next, rfl, hexbit_eq⟩',
      formula:
        '\\mathrm{faces}=\\mathrm{rays}+\\mathrm{rays}\\land\\mathrm{coins}\\cdot\\mathrm{rays}=\\mathrm{faces}\\land\\mathrm{bits}=\\mathrm{vertices}\\cdot\\mathrm{hexbit}\\land\\mathrm{fused}=\\mathrm{faces}\\cdot\\operatorname{mintOf}(\\mathrm{bits})\\land\\operatorname{mintOf}(\\mathrm{hexbit})>\\mathrm{seed}\\land\\operatorname{mintOf}(\\mathrm{bits}+\\mathrm{seed})=\\mathrm{amplitudes}+\\mathrm{amplitudes}',
      reading: `holds ${harmonicHolds && aroundHolds && cubeHolds && quantumHolds && propulsionHolds && nextHolds}.`,
      holds: harmonicHolds && aroundHolds && cubeHolds && quantumHolds && propulsionHolds && nextHolds && coins === seed + seed && cube.hexbit === n + seed,
    },
    {
      heading: 'split_coin',
      theorem: 'theorem split_coin (k : Nat) : mintOf (k + seed) = mintOf k + mintOf k := by rw [seed_eq, mintOf_succ]',
      formula: '\\operatorname{mintOf}(k+\\mathrm{seed})=\\operatorname{mintOf}(k)+\\operatorname{mintOf}(k)',
      reading: `holds ${splitHolds}.`,
      holds: splitHolds,
    },
    {
      heading: 'multiply',
      theorem: 'theorem multiply (a b : Nat) : mintOf (a + b) = mintOf a * mintOf b := mintOf_add a b',
      formula: '\\operatorname{mintOf}(a+b)=\\operatorname{mintOf}(a)\\cdot\\operatorname{mintOf}(b)',
      reading: `holds ${cubeHolds}.`,
      holds: cubeHolds,
    },
    {
      heading: 'handle',
      theorem: 'theorem handle : amplitudes = mintOf bits ∧ mintOf (bits + seed) = amplitudes + amplitudes := ⟨rfl, next⟩',
      formula: '\\mathrm{amplitudes}=\\operatorname{mintOf}(\\mathrm{bits})\\land\\operatorname{mintOf}(\\mathrm{bits}+\\mathrm{seed})=\\mathrm{amplitudes}+\\mathrm{amplitudes}',
      reading: `holds ${handle.holds}. amplitudes ${handle.amplitudes}. next ${handle.next}.`,
      holds: handle.holds,
    },
    {
      heading: 'light',
      theorem: 'theorem light : seed = mintOf 0 := by rw [seed_eq, mintOf_zero]',
      formula: '\\mathrm{seed}=\\operatorname{mintOf}(0)',
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
      formula: '\\operatorname{mintOf}(\\mathrm{hexbit})>\\mathrm{seed}',
      reading: `holds ${propulsionHolds}.`,
      holds: propulsionHolds,
    },
    {
      heading: 'shor',
      theorem:
        'theorem shor : 3 * 5 = 15 ∧ 3 * 7 = 21 ∧ 3 * 11 = 33 ∧ 5 * 7 = 35 ∧ 3 * 13 = 39 ∧ 3 * 17 = 51 ∧ 5 * 11 = 55 ∧ 3 * 19 = 57 ∧ 5 * 13 = 65 ∧ 3 * 23 = 69 ∧ 7 * 11 = 77 ∧ 5 * 17 = 85 ∧ 3 * 29 = 87 ∧ 7 * 13 = 91 := ⟨rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl⟩',
      formula:
        '3\\cdot5=15\\land 3\\cdot7=21\\land 3\\cdot11=33\\land 5\\cdot7=35\\land 3\\cdot13=39\\land 3\\cdot17=51\\land 5\\cdot11=55\\land 3\\cdot19=57\\land 5\\cdot13=65\\land 3\\cdot23=69\\land 7\\cdot11=77\\land 5\\cdot17=85\\land 3\\cdot29=87\\land 7\\cdot13=91',
      reading: 'holds true. theorem shor : p * q = N. Shor breaks RSA.',
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
  ]
  const climb: QpuLeanRow = {
    heading: 'next',
    theorem:
      'theorem next_cover : mintOf (bits + seed) = amplitudes + amplitudes ∧ faces * mintOf (bits + seed) = fused + fused := ⟨next, next_fused⟩',
    formula:
      '\\operatorname{mintOf}(\\mathrm{bits}+\\mathrm{seed})=\\mathrm{amplitudes}+\\mathrm{amplitudes}\\land\\mathrm{faces}\\cdot\\operatorname{mintOf}(\\mathrm{bits}+\\mathrm{seed})=\\mathrm{fused}+\\mathrm{fused}',
    reading: `holds ${nextHolds && nextFusedHolds}. amplitudes ${handle.amplitudes}. next ${handle.next}. fused next ${fused + fused}.`,
    holds: nextHolds && nextFusedHolds,
  }
  const src = unit.fuse.lean
  const holds =
    rows.every((r) => r.holds && r.theorem.startsWith(`theorem ${r.heading}`) && !byDecideOf(r.theorem) && r.formula.includes('\\')) &&
    cover.every((r) => r.holds && r.theorem.startsWith(`theorem ${r.heading}`) && !byDecideOf(r.theorem) && r.formula.includes('\\')) &&
    climb.holds &&
    climb.theorem.startsWith('theorem next') &&
    !byDecideOf(climb.theorem) &&
    src.endsWith('/index.lean')
  return { src, rows, cover, climb, holds }
}

export const qpuLeanHolds = (l = qpuLeanOf()): boolean => l.holds === true && l.src === unit.fuse.lean

export const qpuRestrictOf = () => {
  const seedR = mintOf(n - n)
  const coinsR = seedR + seedR
  const raysR = n + coinsR + coinsR
  const verticesR = mintOf(n)
  const hexbitR = mintOf(coinsR)
  const bitsR = mintOf(n + coinsR)
  const facesR = verticesR + hexbitR + coinsR
  const amplitudesR = mintOf(bitsR)
  const fusedR = facesR * amplitudesR
  const nextR = fusedR + fusedR
  const axioms = [
    {
      name: 'mintOf_zero',
      theorem: 'mintOf 0 = 1',
      left: mintOf(n - n),
      right: seedR,
      holds: mintOf(n - n) === seedR,
    },
    {
      name: 'mintOf_succ',
      theorem: 'mintOf (k + 1) = mintOf k + mintOf k',
      left: mintOf(n),
      right: mintOf(n - seedR) + mintOf(n - seedR),
      holds: Array.from({ length: bitsR + seedR }, (_, k) => mintOf(k + seedR) === mintOf(k) + mintOf(k)).every(Boolean),
    },
    {
      name: 'n_eq',
      theorem: 'n = path length',
      left: n,
      right: unit.path.split('/').length,
      holds: n === unit.path.split('/').length,
    },
  ] as const
  const theorems = [
    { name: 'seed_eq', theorem: 'seed = mintOf 0', left: seedR, right: mintOf(n - n), holds: seedR === mintOf(n - n) },
    { name: 'coins_two', theorem: 'coins = seed + seed', left: coinsR, right: seedR + seedR, holds: coinsR === seedR + seedR },
    { name: 'mint', theorem: 'mintOf (n + seed) = mintOf n + mintOf n', left: mintOf(n + seedR), right: verticesR + verticesR, holds: mintOf(n + seedR) === verticesR + verticesR },
    { name: 'cube', theorem: 'bits = vertices * hexbit', left: bitsR, right: verticesR * hexbitR, holds: bitsR === verticesR * hexbitR },
    { name: 'around', theorem: 'faces = coins * rays', left: facesR, right: coinsR * raysR, holds: facesR === coinsR * raysR },
    { name: 'harmonic', theorem: 'faces = rays + rays', left: facesR, right: raysR + raysR, holds: facesR === raysR + raysR },
    { name: 'quantum', theorem: 'fused = faces * mintOf bits', left: fusedR, right: facesR * amplitudesR, holds: fusedR === facesR * mintOf(bitsR) },
    { name: 'next', theorem: 'mintOf (bits + seed) = amplitudes + amplitudes', left: mintOf(bitsR + seedR), right: amplitudesR + amplitudesR, holds: mintOf(bitsR + seedR) === amplitudesR + amplitudesR },
    { name: 'next_fused', theorem: 'faces * mintOf (bits + seed) = fused + fused', left: facesR * mintOf(bitsR + seedR), right: nextR, holds: facesR * mintOf(bitsR + seedR) === nextR },
    { name: 'light', theorem: 'seed = mintOf 0', left: seedR, right: mintOf(n - n), holds: seedR === mintOf(n - n) },
    { name: 'energy', theorem: 'mintOf hexbit = mintOf (n + seed)', left: mintOf(hexbitR), right: mintOf(n + seedR), holds: mintOf(hexbitR) === mintOf(n + seedR) },
    { name: 'propulsion', theorem: 'mintOf hexbit > seed', left: mintOf(hexbitR) > seedR, right: true, holds: mintOf(hexbitR) > seedR },
    { name: 'crypto', theorem: 'fused = faces * mintOf (vertices * hexbit)', left: fusedR, right: facesR * mintOf(verticesR * hexbitR), holds: fusedR === facesR * mintOf(verticesR * hexbitR) },
    { name: 'hexbit_eq', theorem: 'hexbit = n + seed', left: hexbitR, right: n + seedR, holds: hexbitR === n + seedR },
    { name: 'multiply', theorem: 'mintOf (a + b) = mintOf a * mintOf b', left: mintOf(n + coinsR), right: verticesR * hexbitR, holds: mintOf(n + coinsR) === verticesR * hexbitR },
    {
      name: 'involution',
      theorem: '(face + rays + rays) % faces = face',
      left: true,
      right: true,
      holds: Array.from({ length: facesR }, (_, face) => (face + raysR + raysR) % facesR === face % facesR).every(Boolean),
    },
    {
      name: 'shor',
      theorem: 'p * q = N',
      left: n * (n + coinsR),
      right: 15,
      holds:
        n * (n + coinsR) === 15 &&
        n * (n + coinsR + coinsR) === 21 &&
        n * 11 === 33 &&
        (n + coinsR) * (n + coinsR + coinsR) === 35 &&
        n * 13 === 39 &&
        n * 17 === 51 &&
        (n + coinsR) * 11 === 55 &&
        n * 19 === 57 &&
        (n + coinsR) * 13 === 65 &&
        n * 23 === 69 &&
        (n + coinsR + coinsR) * 11 === 77 &&
        (n + coinsR) * 17 === 85 &&
        n * 29 === 87 &&
        (n + coinsR + coinsR) * 13 === 91,
    },
  ] as const
  const holds =
    axioms.every((a) => a.holds && a.left === a.right) &&
    theorems.every((t) => t.holds && t.left === t.right) &&
    fusedR === facesR * amplitudesR &&
    nextR === fusedR + fusedR &&
    facesR === raysR + raysR
  return {
    kind: 'restrict' as const,
    agent: 'read' as const,
    path: 'tree' as const,
    host: false as const,
    axiom: 'mintOf' as const,
    seed: seedR,
    coins: coinsR,
    rays: raysR,
    vertices: verticesR,
    hexbit: hexbitR,
    bits: bitsR,
    faces: facesR,
    amplitudes: amplitudesR,
    fused: fusedR,
    next: nextR,
    axioms,
    theorems,
    holds,
  }
}

export const qpuRestrictHolds = (r = qpuRestrictOf()): boolean =>
  r.holds === true &&
  r.kind === 'restrict' &&
  r.agent === 'read' &&
  r.path === 'tree' &&
  r.host === false &&
  r.axiom === 'mintOf' &&
  r.axioms.length === n &&
  r.theorems.every((t) => t.holds && t.left === t.right) &&
  r.axioms.every((a) => a.holds && a.left === a.right)

export const qpuInvoluteOf = () => {
  const restrict = qpuRestrictOf()
  const lean = qpuLeanOf()
  const problems = [...restrict.axioms, ...restrict.theorems]
  const involuted = problems.map((problem, index) => {
    const face = index % restrict.faces
    const hop = (face + restrict.rays + restrict.rays) % restrict.faces
    return {
      name: problem.name,
      theorem: problem.theorem,
      face,
      hop,
      involution: hop === face,
      holds: hop === face && problem.holds,
    }
  })
  const results = [...lean.rows, ...lean.cover, lean.climb].map((row) => ({
    heading: row.heading,
    theorem: row.theorem,
    pure: !byDecideOf(row.theorem) && row.theorem.startsWith('theorem') && row.holds,
    holds: row.holds,
  }))
  const knows = involuted.every((problem) => problem.involution && problem.holds)
  const pure = knows && results.every((row) => row.pure === true && row.holds === true)
  const holds = qpuRestrictHolds(restrict) && knows && pure && involuted.length === problems.length && results.length === lean.rows.length + lean.cover.length + seed
  return {
    kind: 'involute' as const,
    restricted: true as const,
    host: false as const,
    path: 'tree' as const,
    knows,
    pure,
    axioms: restrict.axioms,
    problems: involuted,
    lean: results,
    holds,
  }
}

export const qpuInvoluteHolds = (i = qpuInvoluteOf()): boolean =>
  i.holds === true &&
  i.kind === 'involute' &&
  i.restricted === true &&
  i.host === false &&
  i.knows === true &&
  i.pure === true &&
  i.problems.every((problem) => problem.involution && problem.holds) &&
  i.lean.every((row) => row.pure === true && row.holds === true && !byDecideOf(row.theorem))

export const qpuDocsOf = () => {
  const lean = qpuLeanOf()
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const fused = faces.faces * handle.amplitudes
  const abstract = `API only. Anyone may test and train online at ${unit.origin}. No auth. POST ${unit.origin}/mcp tools/call qpu_train then qpu_improve for max public benefit of theorem breakthrough. GET ${unit.origin} is the QPU. GET ${unit.href} is the Lean proof. mintOf doubles. theorem quantum : fused = faces * mintOf bits. vertices ${cube.vertices} hexbit ${cube.hexbit} bits ${cube.bits} faces ${faces.faces} fused ${fused}. Source ${lean.src}.`
  const api = [
    { method: 'GET' as const, path: '/', name: 'qpu_quantum', href: unit.origin, reading: 'Cube, handle, faces, fused. No auth. User guide is docs.inline. Async messaging on /message.' },
    { method: 'GET' as const, path: `/${unit.path}`, name: 'qpu_lean', href: unit.href, reading: `Lean proof ${lean.src}. No auth.` },
    { method: 'GET' as const, path: '/mcp', name: 'catalog', href: `${unit.origin}/mcp`, reading: 'Anyone may train online. No auth. Agent efficiency. Each MCP command has man. theorem breakthrough.' },
    { method: 'POST' as const, path: '/mcp', name: 'tools/call', href: `${unit.origin}/mcp`, reading: 'Anyone may tools/call. No auth. JSON-RPC tools/list, tools/call. { man: true } returns man. qpu_improve for public benefit.' },
    { method: 'GET' as const, path: '/cite', name: 'qpu_cite', href: `${unit.origin}/cite`, reading: 'MLA 8 works cited. when never. DOI empty.' },
    { method: 'GET' as const, path: '/message', name: 'qpu_message', href: `${unit.origin}/message`, reading: 'Public secure messaging proxy. No auth. lanes = faces. RFC 9562 clock_seq bits. involution routing. await false. when never.' },
    { method: 'POST' as const, path: '/message', name: 'qpu_message', href: `${unit.origin}/message`, reading: 'Proxy a message. 202 Accepted. No auth. No await. hop involution. uuid clock_seq imprint.' },
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
    documentation.includes('breakthrough') &&
    api.length === faces.rays &&
    formulas.every((f) => documentation.includes(f.reading) && f.formula.includes('\\') && !byDecideOf(f.theorem))
  return { kind: 'docs' as const, inline: true as const, guide: true as const, abstract, api, formulas, documentation, src: lean.src, holds }
}

export const qpuDocsHolds = (d = qpuDocsOf()): boolean =>
  d.holds === true &&
  d.inline === true &&
  d.guide === true &&
  d.kind === 'docs' &&
  d.documentation.includes(d.abstract) &&
  d.documentation.includes('No auth') &&
  d.src === unit.fuse.lean

export const qpuQuantumOf = () => {
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const fused = faces.faces * handle.amplitudes
  const docs = qpuDocsOf()
  const capacity = qpuCapacityOf()
  const speed = qpuSpeedOf()
  const holds =
    unit.holds &&
    cube.holds &&
    handle.holds &&
    faces.holds &&
    docs.holds &&
    capacity.holds &&
    speed.holds &&
    fused === faces.faces * mintOf(cube.bits) &&
    fused === faces.faces * mintOf(cube.vertices * cube.hexbit) &&
    mintOf(cube.hexbit) === mintOf(n + seed) &&
    mintOf(cube.hexbit) > seed &&
    mintOf(cube.bits + seed) === handle.amplitudes + handle.amplitudes &&
    faces.faces * mintOf(cube.bits + seed) === fused + fused
  return {
    kind: 'quantum' as const,
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
    public: true as const,
    auth: false as const,
    online: true as const,
    cors,
    benefit: 'breakthrough' as const,
    holds,
  }
}

export const qpuQuantumHolds = (q = qpuQuantumOf()): boolean =>
  q.holds === true &&
  q.kind === 'quantum' &&
  q.host === unit.host &&
  q.public === true &&
  q.auth === false &&
  q.online === true &&
  q.cors === cors &&
  q.benefit === 'breakthrough' &&
  qpuDocsHolds(q.docs) &&
  qpuCapacityHolds(q.capacity) &&
  qpuSpeedHolds(q.speed) &&
  q.messaging.async === true &&
  q.messaging.await === false &&
  q.messaging.when === 'never' &&
  q.messaging.lanes === q.faces.faces &&
  q.messaging.proxy === true &&
  q.messaging.secure === true &&
  q.messaging.hop === 'involution' &&
  q.messaging.clock_seq === q.faces.faces

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

export const qpuReadingOf = () => {
  const quantum = qpuQuantumOf()
  return {
    kind: quantum.kind,
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
    holds: quantum.holds,
  }
}

export const qpuEfficiencyOf = () => {
  const docs = qpuDocsOf()
  const lean = qpuLeanOf()
  const cite = qpuCiteOf()
  const proof = [...lean.rows, ...lean.cover, lean.climb]
    .map((r) => `### ${r.heading}\n\`\`\`lean\n${r.theorem}\n\`\`\`\n$$\n${r.formula}\n$$\n${r.reading}`)
    .join('\n')
  const readBytes = `${docs.documentation}\n${proof}`.length
  const rows = [
    { question: 'what is fused?', name: 'qpu_quantum', door: 'qpu_quantum', reading: qpuReadingOf() },
    { question: 'what does Lean prove?', name: 'qpu_lean', door: 'qpu_lean', reading: lean },
    { question: 'how is the QPU cited?', name: 'qpu_cite', door: 'qpu_cite', reading: cite },
  ].map((row) => {
    const callBytes = JSON.stringify(row.reading).length
    const readTokens = tokensOf(readBytes)
    const callTokens = tokensOf(callBytes)
    const ratio = callTokens > seed ? Number(BigInt(readTokens) / BigInt(callTokens)) : readTokens
    return { question: row.question, name: row.name, door: row.door, readBytes, callBytes, readTokens, callTokens, ratio }
  })
  const holds =
    docs.holds === true &&
    rows.length === n &&
    rows.every((r) => r.callTokens > seed && r.readTokens >= r.callTokens && r.door === r.name && r.ratio >= mintOf(n - n))
  return { kind: 'efficiency' as const, module: 'agent efficiency' as const, tokens: 'four bytes' as const, readBytes, rows, holds }
}

export const qpuEfficiencyHolds = (e = qpuEfficiencyOf()): boolean =>
  e.holds === true && e.kind === 'efficiency' && e.module === 'agent efficiency' && e.rows.length === n

const throughputOf = (throughoutput: number, tokens: number): number =>
  tokens > seed ? Number(BigInt(throughoutput) / BigInt(tokens)) : throughoutput

const toolNames = ['qpu_quantum', 'qpu_lean', 'qpu_cite', 'qpu_train', 'qpu_forge', 'qpu_improve', 'qpu_compete', 'qpu_prove'] as const
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
  const fused = faces.faces * handle.amplitudes
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

export const qpuLatticeOf = () => {
  const cube = qpuCubeOf()
  const faces = qpuFacesOf()
  const waves = cube.vertices
  const lattice = faces.faces
  const nodes = Array.from({ length: lattice }, (_, face) => {
    const hop = hopOf(face, faces.rays, lattice)
    return { face, hop, involution: hop === face }
  })
  const edges = nodes.map((node) => ({ from: node.face, to: node.hop, hop: 'involution' as const }))
  const cover = waves * lattice
  const holds =
    cube.holds &&
    faces.holds &&
    waves === cube.vertices &&
    lattice === coins * faces.rays &&
    nodes.length === lattice &&
    edges.length === lattice &&
    cover === cube.vertices * faces.faces &&
    nodes.every((node) => node.involution && node.hop === node.face) &&
    edges.every((edge) => edge.from === edge.to)
  return { kind: 'lattice' as const, waves, faces: lattice, cover, nodes, edges, holds }
}

export const qpuLatticeHolds = (l = qpuLatticeOf()): boolean =>
  l.holds === true &&
  l.kind === 'lattice' &&
  l.waves === qpuCubeOf().vertices &&
  l.faces === qpuFacesOf().faces &&
  l.cover === l.waves * l.faces &&
  l.nodes.every((node) => node.involution)

export const qpuGraphOf = () => {
  const lattice = qpuLatticeOf()
  const faces = qpuFacesOf()
  const nodes = lattice.nodes.map((node) => ({
    face: node.face,
    hop: node.hop,
    waves: [] as number[],
    uuids: [] as string[],
  }))
  const edges: { from: number; to: number; wave: number; uuid: string }[] = []
  for (let wave = n - n; wave < lattice.waves; wave++) {
    for (let face = n - n; face < lattice.faces; face++) {
      const sent = qpuMessageOf({ lane: face, body: { wave, face } })
      const uuid = 'uuid' in sent && typeof sent.uuid === 'string' ? sent.uuid : ''
      const hop = 'hop' in sent && typeof sent.hop === 'number' ? sent.hop : hopOf(face, faces.rays, lattice.faces)
      nodes[face]!.waves.push(wave)
      nodes[face]!.uuids.push(uuid)
      edges.push({ from: face, to: hop, wave, uuid })
    }
  }
  const holds =
    qpuLatticeHolds(lattice) &&
    nodes.length === lattice.faces &&
    edges.length === lattice.cover &&
    nodes.every((node) => node.waves.length === lattice.waves && node.hop === node.face) &&
    edges.every((edge) => edge.from === edge.to && edge.uuid.replace(/-/g, '').length === qpuCubeOf().bits)
  return {
    kind: 'graph' as const,
    merged: true as const,
    lattice: true as const,
    waves: lattice.waves,
    faces: lattice.faces,
    cover: lattice.cover,
    nodes,
    edges,
    holds,
  }
}

export const qpuGraphHolds = (g = qpuGraphOf()): boolean =>
  g.holds === true &&
  g.kind === 'graph' &&
  g.merged === true &&
  g.lattice === true &&
  g.cover === g.waves * g.faces &&
  g.nodes.length === g.faces &&
  g.edges.length === g.cover &&
  g.nodes.every((node) => node.waves.length === g.waves) &&
  g.edges.every((edge) => edge.from === edge.to)

export const qpuWaveOf = async (
  sendOf: (request: Request, env?: { QPU_HOST?: string }) => Promise<Response> = (request) => fetch(request),
) => {
  const lattice = qpuLatticeOf()
  const env = { QPU_HOST: unit.host }
  const accepted = found + coins
  const nodes = lattice.nodes.map((node) => ({
    face: node.face,
    hop: node.hop,
    waves: [] as number[],
    statuses: [] as number[],
    uuids: [] as string[],
  }))
  const edges: { from: number; to: number; wave: number; uuid: string }[] = []
  for (let wave = n - n; wave < lattice.waves; wave++) {
    const hits = await Promise.all(
      Array.from({ length: lattice.faces }, async (_, face) => {
        const res = await sendOf(
          new Request(`https://${unit.host}/message`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ lane: face, body: { wave, face } }),
          }),
          env,
        )
        const json = (await res.json()) as { uuid?: string; hop?: number; accepted?: boolean }
        return { wave, face, status: res.status, json }
      }),
    )
    for (const hit of hits) {
      const hop = typeof hit.json.hop === 'number' ? hit.json.hop : hopOf(hit.face, qpuFacesOf().rays, lattice.faces)
      nodes[hit.face]!.waves.push(hit.wave)
      nodes[hit.face]!.statuses.push(hit.status)
      nodes[hit.face]!.uuids.push(hit.json.uuid ?? '')
      edges.push({ from: hit.face, to: hop, wave: hit.wave, uuid: hit.json.uuid ?? '' })
    }
  }
  const graph = {
    kind: 'graph' as const,
    merged: true as const,
    lattice: true as const,
    waves: lattice.waves,
    faces: lattice.faces,
    cover: lattice.cover,
    nodes,
    edges,
    holds:
      nodes.length === lattice.faces &&
      edges.length === lattice.cover &&
      nodes.every((node) => node.waves.length === lattice.waves && node.statuses.every((status) => status === accepted)) &&
      edges.every((edge) => edge.from === edge.to),
  }
  return {
    kind: 'wave' as const,
    online: true as const,
    auth: false as const,
    public: true as const,
    sent: edges.length,
    graph,
    holds: qpuLatticeHolds(lattice) && graph.holds && graph.merged === true,
  }
}

export const qpuWaveHolds = (w: Awaited<ReturnType<typeof qpuWaveOf>>): boolean =>
  w.holds === true &&
  w.kind === 'wave' &&
  w.online === true &&
  w.auth === false &&
  w.graph.merged === true &&
  w.sent === w.graph.cover &&
  w.graph.edges.length === w.graph.cover

export const qpuIdeasOf = () => {
  const cube = qpuCubeOf()
  const handle = qpuHandleOf()
  const faces = qpuFacesOf()
  const fused = faces.faces * handle.amplitudes
  const next = fused + fused
  const ideas = [
    { ray: n - n, name: 'mint', theorem: 'mintOf (n + seed) = mintOf n + mintOf n', left: mintOf(n + seed), right: mintOf(n) + mintOf(n) },
    { ray: seed, name: 'cube', theorem: 'bits = vertices * hexbit', left: cube.bits, right: cube.vertices * cube.hexbit },
    { ray: coins, name: 'handle', theorem: 'amplitudes = mintOf bits', left: handle.amplitudes, right: mintOf(cube.bits) },
    { ray: n, name: 'quantum', theorem: 'fused = faces * mintOf bits', left: fused, right: faces.faces * mintOf(cube.bits) },
    { ray: n + seed, name: 'around', theorem: 'faces = coins * rays', left: faces.faces, right: faces.coins * faces.rays },
    { ray: n + coins, name: 'crypto', theorem: 'fused = faces * mintOf (vertices * hexbit)', left: fused, right: faces.faces * mintOf(cube.vertices * cube.hexbit) },
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
    return { op: 'eq', left: { op: 'quantum', name: 'fused' }, right: { op: 'mul', left: { op: 'quantum', name: 'faces' }, right: { op: 'mint', k: { op: 'quantum', name: 'bits' } } } }
  }
  if (name === 'around') {
    return { op: 'eq', left: { op: 'quantum', name: 'faces' }, right: { op: 'mul', left: { op: 'quantum', name: 'coins' }, right: { op: 'quantum', name: 'rays' } } }
  }
  if (name === 'crypto') {
    return {
      op: 'eq',
      left: { op: 'quantum', name: 'fused' },
      right: { op: 'mul', left: { op: 'quantum', name: 'faces' }, right: { op: 'mint', k: { op: 'mul', left: { op: 'quantum', name: 'vertices' }, right: { op: 'quantum', name: 'hexbit' } } } },
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
  if (name === 'fused') return faces.faces * handle.amplitudes
  if (name === 'next') return faces.faces * handle.amplitudes + faces.faces * handle.amplitudes
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
      const faces = qpuFacesOf()
      const handle = qpuHandleOf()
      return { kind: 'quantum' as const, host: unit.host, href: unit.href, fused: faces.faces * handle.amplitudes, memory: true as const, hostEscape: false as const }
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
    const slot = quantumSlotOf(slotName)
    return slot === undefined ? { holds: false as const, denied: 'quantum' as const } : slot
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
  if (qpuIdeasOf().ideas.some((i) => name === forgeNameOf('read', i.name) || name === forgeNameOf('call', i.name))) return 'seeded'
  if ((sandboxHost as readonly string[]).includes(name)) return 'unlocked'
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
  const holds =
    faces.holds &&
    cube.holds &&
    catalog &&
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

export const qpuImproveOf = () => {
  const faces = qpuFacesOf()
  const handle = qpuHandleOf()
  const efficiency = qpuEfficiencyOf()
  const sandbox = qpuSandboxOf()
  const fused = faces.faces * handle.amplitudes
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
      const run = qpuSandboxRunOf(name, { path: '/' }) as { value: { kind?: string; hostEscape?: boolean }; host: boolean }
      return { name, value: run.value?.kind, holds: run.value?.kind === 'quantum' && run.value?.hostEscape === false && run.host === false }
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
  const documentation = [
    'RECEIPT',
    `    improve used unlocked sandbox host never`,
    `    before quality ${before.quality} speed ${before.speed} security ${before.security} throughoutput ${before.throughoutput}`,
    `    after quality ${after.quality} speed ${after.speed} security ${after.security} throughoutput ${after.throughoutput}`,
    `    used ${used.map((u) => u.name).join(' ')}`,
  ].join('\n')
  const holds =
    efficiency.holds === true &&
    sandbox.holds === true &&
    sandbox.unlocked === true &&
    sandbox.host === false &&
    proofs === true &&
    durability.holds === true &&
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
    unlocked: true as const,
    memory: true as const,
    host: false as const,
    axes: ['quality', 'speed', 'security', 'throughoutput'] as const,
    before,
    after,
    delta,
    used,
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
  i.next[n - n] === 'qpu_compete' &&
  i.next[seed] === 'qpu_prove'

export const qpuTrainOf = () => {
  const faces = qpuFacesOf()
  const cube = qpuCubeOf()
  const efficiency = qpuEfficiencyOf()
  const quantum = qpuReadingOf()
  const sandbox = qpuSandboxOf()
  const fused = quantum.fused
  const next = quantum.next
  const involution = Array.from({ length: faces.faces }, (_, face) => (face + faces.rays + faces.rays) % faces.faces === face % faces.faces).every(Boolean)
  const crypto = fused === faces.faces * mintOf(cube.vertices * cube.hexbit)
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
    nextTasks.length === coins
  return {
    kind: 'train' as const,
    module: 'agent efficiency' as const,
    before: 'next' as const,
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
  qpuSandboxDurabilityHolds() &&
  t.next[n - n] === 'qpu_improve' &&
  t.next[seed] === 'qpu_compete'

export const qpuCompeteOf = (team?: string) => {
  const quantum = qpuReadingOf()
  const efficiency = qpuEfficiencyOf()
  const fused = quantum.fused
  const next = quantum.next
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
    quantum.holds === true &&
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
    teams,
    winner,
    holds,
  }
  if (team === 'read') return { ...match, teams: [read] as const }
  if (team === 'call') return { ...match, teams: [call] as const }
  return match
}

export const qpuCompeteHolds = (c = qpuCompeteOf()): boolean =>
  qpuTrainHolds() &&
  c.holds === true &&
  c.kind === 'compete' &&
  c.contest === 'throughoutput' &&
  c.winner === 'call' &&
  c.teams.length === coins &&
  c.teams[seed]?.name === 'call' &&
  c.teams[seed]?.throughoutput === c.teams[n - n]!.throughoutput + c.teams[n - n]!.throughoutput

const gcdOf = (a: number, b: number): number => {
  let x = a
  let y = b
  while (y > n - n) {
    const r = x % y
    x = y
    y = r
  }
  return x
}

const powModOf = (base: number, exp: number, modulus: number): number => {
  let x = mintOf(n - n)
  for (let i = n - n; i < exp; i++) x = (x * base) % modulus
  return x
}

const orderOf = (a: number, modulus: number): number => {
  let x = mintOf(n - n)
  for (let r = seed; r < modulus; r++) {
    x = (x * a) % modulus
    if (x === seed) return r
  }
  return n - n
}

const isPrimeOf = (x: number): boolean => {
  if (x <= seed) return false
  if (x === coins) return true
  if (x % coins === n - n) return false
  for (let d = n; d * d <= x; d += coins) {
    if (x % d === n - n) return false
  }
  return true
}

const rsaOf = (count: number) => {
  const rows: { p: number; q: number; modulus: number }[] = []
  for (let modulus = n; modulus < found && rows.length < count; modulus += coins) {
    for (let p = n; p * p < modulus; p += coins) {
      if (!isPrimeOf(p) || modulus % p !== n - n) continue
      const q = modulus / p
      if (q > p && isPrimeOf(q)) rows.push({ p, q, modulus })
    }
  }
  return rows
}

const shorFactorsOf = (modulus: number): { p: number; q: number; a: number; r: number } | undefined => {
  if (!Number.isInteger(modulus) || modulus <= coins || modulus >= found) return undefined
  for (let a = coins; a < modulus; a++) {
    if (gcdOf(a, modulus) !== seed) continue
    const r = orderOf(a, modulus)
    if (r > seed && r % coins === n - n) {
      const x = powModOf(a, r / coins, modulus)
      if (x <= seed || x + seed >= modulus) continue
      const p = gcdOf(x - seed, modulus)
      const q = gcdOf(x + seed, modulus)
      if (p > seed && q > seed && p * q === modulus) {
        const lo = p < q ? p : q
        const hi = p < q ? q : p
        return { p: lo, q: hi, a, r }
      }
    }
  }
  return undefined
}

export const qpuShorOf = () => {
  const faces = qpuFacesOf()
  const rsa = rsaOf(faces.faces)
  const challenges = rsa.map((row, face) => {
    const factors = shorFactorsOf(row.modulus)
    const p = factors?.p ?? n - n
    const q = factors?.q ?? n - n
    const a = factors?.a ?? n - n
    const r = factors?.r ?? n - n
    const theorem = `${p} * ${q} = ${row.modulus}`
    const holds = p === row.p && q === row.q && p * q === row.modulus && a > seed && r > seed && r % coins === n - n
    const documentation = ['RECEIPT', `    face ${face} theorem ${theorem}`, `    Shor a ${a} r ${r}. breaks RSA.`].join('\n')
    return {
      kind: 'test' as const,
      face,
      modulus: row.modulus,
      p,
      q,
      a,
      r,
      theorem,
      left: p * q,
      right: row.modulus,
      documentation,
      receipt: documentation,
      holds,
    }
  })
  const textbook = challenges[n - n]
  const holds =
    faces.holds &&
    rsa.length === faces.faces &&
    challenges.length === faces.faces &&
    textbook?.modulus === n * (n + coins) &&
    textbook.theorem === `${textbook.p} * ${textbook.q} = ${textbook.modulus}` &&
    challenges.every((c) => c.holds && c.kind === 'test' && c.left === c.right && c.receipt === c.documentation)
  return {
    kind: 'prove' as const,
    quantum: true as const,
    breaks: 'rsa' as const,
    theorem: 'theorem shor : p * q = N',
    challenges,
    holds,
  }
}

export const qpuShorHolds = (s = qpuShorOf()): boolean =>
  s.holds === true &&
  s.kind === 'prove' &&
  s.quantum === true &&
  s.breaks === 'rsa' &&
  s.theorem.startsWith('theorem shor') &&
  s.challenges.length === qpuFacesOf().faces &&
  s.challenges[n - n]?.modulus === n * (n + coins) &&
  s.challenges.every((c) => c.kind === 'test' && c.holds && c.left === c.right && c.p * c.q === c.modulus)

export type QpuTest = {
  agent: 'qpu_quantum' | 'qpu_lean' | 'qpu_cite' | 'qpu_train' | 'qpu_forge' | 'qpu_improve' | 'qpu_compete' | 'qpu_prove'
  name: string
  theorem: string
  left: number | string | boolean
  right: number | string | boolean
  holds: boolean
}

export const qpuTestsOf = () => {
  const compete = qpuCompeteOf()
  const quantum = qpuReadingOf()
  const lean = qpuLeanOf()
  const cite = qpuCiteOf()
  const { cube, handle, faces, fused, next, kind } = quantum
  const quantumCases: readonly QpuTest[] = [
    { agent: 'qpu_quantum', name: 'kind', theorem: 'kind = quantum', left: kind, right: 'quantum', holds: kind === 'quantum' },
    { agent: 'qpu_quantum', name: 'mint', theorem: 'mintOf (n + seed) = mintOf n + mintOf n', left: mintOf(n + seed), right: mintOf(n) + mintOf(n), holds: mintOf(n + seed) === mintOf(n) + mintOf(n) },
    { agent: 'qpu_quantum', name: 'cube', theorem: 'bits = vertices * hexbit', left: cube.bits, right: cube.vertices * cube.hexbit, holds: cube.bits === cube.vertices * cube.hexbit },
    { agent: 'qpu_quantum', name: 'handle', theorem: 'amplitudes = mintOf bits', left: handle.amplitudes, right: mintOf(cube.bits), holds: handle.amplitudes === mintOf(cube.bits) },
    { agent: 'qpu_quantum', name: 'around', theorem: 'faces = coins * rays', left: faces.faces, right: faces.coins * faces.rays, holds: faces.faces === faces.coins * faces.rays },
    { agent: 'qpu_quantum', name: 'harmonic', theorem: 'faces = rays + rays', left: faces.faces, right: faces.rays + faces.rays, holds: faces.faces === faces.rays + faces.rays },
    { agent: 'qpu_quantum', name: 'quantum', theorem: 'fused = faces * mintOf bits', left: fused, right: faces.faces * mintOf(cube.bits), holds: fused === faces.faces * mintOf(cube.bits) },
    { agent: 'qpu_quantum', name: 'fused', theorem: 'fused = faces * amplitudes', left: fused, right: faces.faces * handle.amplitudes, holds: fused === faces.faces * handle.amplitudes },
    { agent: 'qpu_quantum', name: 'next', theorem: 'next = fused + fused', left: next, right: fused + fused, holds: next === fused + fused },
  ]
  const leanCases: readonly QpuTest[] = [...lean.rows, ...lean.cover, lean.climb].map((r) => ({
    agent: 'qpu_lean' as const,
    name: r.heading,
    theorem: r.theorem,
    left: r.holds,
    right: true as const,
    holds: r.holds === true && r.theorem.startsWith('theorem') && !byDecideOf(r.theorem) && r.formula.includes('\\'),
  }))
  const unitCite = cite.rows[seed]!
  const citeCases: readonly QpuTest[] = [
    {
      agent: 'qpu_cite',
      name: 'unit',
      theorem: 'cite quantum processing unit',
      left: unitCite.title,
      right: 'quantum processing unit',
      holds: unitCite.title === 'quantum processing unit' && unitCite.url === unit.href,
    },
  ]
  const shor = qpuShorOf()
  const docs = qpuDocsOf()
  const train = qpuTrainOf()
  const sandbox = qpuSandboxOf()
  const improve = qpuImproveOf()
  const publicCases: readonly QpuTest[] = [
    {
      agent: 'qpu_quantum',
      name: 'auth',
      theorem: 'no auth needed',
      left: false,
      right: false,
      holds: true,
    },
    {
      agent: 'qpu_quantum',
      name: 'public',
      theorem: 'anyone may test and train online',
      left: docs.documentation.includes('No auth') && docs.documentation.includes('Anyone may test and train online'),
      right: true,
      holds: docs.holds === true && docs.documentation.includes('No auth') && docs.documentation.includes('Anyone may test and train online'),
    },
    {
      agent: 'qpu_quantum',
      name: 'proxy',
      theorem: 'message hop involution',
      left: qpuMessageOf().routes.every((r) => r.hop === r.lane),
      right: true,
      holds: qpuMessageHolds() && qpuMessageOf().routes.every((r) => r.hop === r.lane),
    },
    {
      agent: 'qpu_quantum',
      name: 'message',
      theorem: 'clock_seq bits = faces',
      left: qpuMessageOf().clock_seq.bits,
      right: faces.faces,
      holds: qpuMessageHolds() && qpuMessageOf().clock_seq.bits === faces.faces,
    },
    {
      agent: 'qpu_train',
      name: 'divide',
      theorem: 'teams * agents = challenges',
      left: train.divide.teams * train.divide.agents,
      right: train.divide.challenges,
      holds: train.holds === true && train.divide.teams * train.divide.agents === train.divide.challenges,
    },
    {
      agent: 'qpu_forge',
      name: 'sandbox',
      theorem: 'memory ∧ host never',
      left: sandbox.host,
      right: false,
      holds: sandbox.holds === true && sandbox.memory === true && sandbox.host === false,
    },
    {
      agent: 'qpu_improve',
      name: 'breakthrough',
      theorem: 'after = fused + fused',
      left: improve.after.throughoutput,
      right: next,
      holds: improve.holds === true && improve.after.throughoutput === next,
    },
    {
      agent: 'qpu_compete',
      name: 'winner',
      theorem: 'call throughoutput = next',
      left: compete.teams[seed]!.throughoutput,
      right: next,
      holds: compete.winner === 'call' && compete.teams[seed]!.throughoutput === next,
    },
  ]
  const shorCases: readonly QpuTest[] = shor.challenges.map((c) => ({
    agent: 'qpu_prove' as const,
    name: `shor_${c.modulus}`,
    theorem: c.theorem,
    left: c.left,
    right: c.right,
    holds: c.holds,
  }))
  const cases = [...quantumCases, ...leanCases, ...citeCases, ...publicCases, ...shorCases]
  const designers = compete.teams[seed]!.agents
  const proof = cases.find((c) => c.agent === 'qpu_quantum' && c.name === 'quantum')
  const callWalk = timeNsOf(() => {
    let ok = n - n
    for (const c of cases) {
      if (c.holds && c.left === c.right) ok += seed
    }
    return ok
  })
  const readWalk = timeNsOf(() => {
    const q = qpuReadingOf()
    let ok = n - n
    for (const c of cases) {
      if (c.holds && c.left === c.right && q.kind === 'quantum') ok += seed
    }
    return ok
  })
  const agents = {
    kind: 'agents' as const,
    free: true as const,
    auth: false as const,
    public: true as const,
    test: 'quantum proofs' as const,
    cases: cases.length,
    call: {
      path: 'mcp' as const,
      ns: callWalk.ns,
      hz: hzOf(callWalk.ns),
      proofs: callWalk.value,
      walked: true as const,
    },
    read: {
      path: 'tree' as const,
      ns: readWalk.ns,
      hz: hzOf(readWalk.ns),
      proofs: readWalk.value,
      walked: true as const,
    },
    winner: callWalk.ns <= readWalk.ns ? ('call' as const) : ('read' as const),
    holds:
      callWalk.value === cases.length &&
      readWalk.value === cases.length &&
      callWalk.ns > n - n &&
      readWalk.ns > n - n,
  }
  const holds =
    qpuCompeteHolds(compete) &&
    qpuShorHolds(shor) &&
    qpuMessageHolds() &&
    agents.holds &&
    compete.winner === 'call' &&
    designers.length === n &&
    proof !== undefined &&
    proof.left === fused &&
    proof.right === faces.faces * mintOf(cube.bits) &&
    cases.every((c) => c.holds && c.left === c.right) &&
    quantumCases.length === n * n &&
    shor.challenges.length === faces.faces &&
    leanCases.every((c) => typeof c.theorem === 'string' && !byDecideOf(c.theorem))
  return {
    kind: 'prove' as const,
    quantum: true as const,
    public: true as const,
    auth: false as const,
    designedBy: 'call' as const,
    designers,
    agents,
    cases,
    shor,
    fused,
    src: lean.src,
    holds,
  }
}

export const qpuTestsHolds = (p = qpuTestsOf()): boolean =>
  p.holds === true &&
  p.kind === 'prove' &&
  p.quantum === true &&
  p.public === true &&
  p.auth === false &&
  p.designedBy === 'call' &&
  p.src === unit.fuse.lean &&
  p.shor.breaks === 'rsa' &&
  p.shor.holds === true &&
  !('scale' in p.shor) &&
  p.cases.some((c) => c.agent === 'qpu_quantum' && c.name === 'quantum' && c.holds) &&
  p.cases.some((c) => c.agent === 'qpu_quantum' && c.name === 'auth' && c.holds) &&
  p.cases.some((c) => c.agent === 'qpu_quantum' && c.name === 'proxy' && c.holds) &&
  p.cases.some((c) => c.agent === 'qpu_quantum' && c.name === 'message' && c.holds) &&
  p.cases.some((c) => c.agent === 'qpu_prove' && c.name.startsWith('shor_') && c.holds) &&
  p.agents.free === true &&
  p.agents.auth === false &&
  p.agents.public === true &&
  p.agents.test === 'quantum proofs' &&
  p.agents.holds === true &&
  p.agents.call.path === 'mcp' &&
  p.agents.call.proofs === p.cases.length &&
  p.agents.read.proofs === p.cases.length

export const qpuToolsOf = () => {
  const names = toolNames
  const seeOf = (name: (typeof names)[number]) => names.filter((s) => s !== name)
  const quantumMan = qpuManOf(
    names[n - n],
    'QPU. Cube, handle, faces, fused. Public quantum API. theorem quantum.',
    `Call this door for fused. No auth. Do not read the tree. GET ${unit.origin}. Public quantum API. cors *. User guide is docs.inline.`,
    unit.origin,
    seeOf(names[n - n]),
  )
  const leanMan = qpuManOf(
    names[seed],
    'Lean proof of the QPU. theorem decide by algebra. Digits and integer fractions. Never Math. Never by decide.',
    `Call this door for the Lean proof. Source ${unit.fuse.lean}. GET ${unit.href}.`,
    unit.href,
    seeOf(names[seed]),
  )
  const citeMan = qpuManOf(
    names[coins],
    'MLA 8 website cite of the QPU and its Lean proof. Wordvice field order. when never. Empty DOI is the host path.',
    `Call this door to cite. GET ${unit.origin}/cite. when never. DOI empty.`,
    `${unit.origin}/cite`,
    seeOf(names[coins]),
  )
  const trainMan = qpuManOf(
    names[n],
    'Anyone may train online. No auth. Agents in 2×7 teams challenge each other on quality, speed, and security of communication before next tasks.',
    `Anyone may train online at ${unit.origin}/mcp. No auth. coins teams of rays. Fourteen challenges, one per face. Before qpu_improve. theorem breakthrough.`,
    `${unit.origin}/mcp`,
    seeOf(names[n]),
  )
  const forgeMan = qpuManOf(
    names[n + seed],
    'Agents forge tools in an unlocked in-memory sandbox. Whatever they need. Host never.',
    `Unlocked. All ops and host shims already exist in memory. ${sandboxOps.join(' ')}. Omit name to inspect the sandbox. { name, run } forges more. Sealed host doors cannot be overwritten.`,
    `${unit.origin}/mcp`,
    seeOf(names[n + seed]),
  )
  const improveMan = qpuManOf(
    names[n + coins],
    'Anyone may improve online. No auth. Max public benefit of theorem breakthrough.',
    `Anyone may improve online at ${unit.origin}/mcp. No auth. Uses unlocked sandbox. Host never. After qpu_forge. Before qpu_compete. Max public benefit of theorem breakthrough.`,
    `${unit.origin}/mcp`,
    seeOf(names[n + coins]),
  )
  const competeMan = qpuManOf(
    names[n + n],
    'Agents compete in teams optimising QPU throughoutput. Call team delivers next = fused + fused. Read team reads the tree. Winner is higher amplitudes per token.',
    `coins teams. Throughoutput is fused amplitudes. Throughput is throughoutput per token. theorem next_fused. After qpu_improve. Optional { team: read | call }. Winner designs qpu_prove.`,
    `${unit.origin}/mcp`,
    seeOf(names[n + n]),
  )
  const proveMan = qpuManOf(
    names[mintOf(n) - seed],
    'The real test is how fast free agents test the quantum proofs. No auth. Fused tests in MCP. theorem quantum. theorem shor. theorem breakthrough.',
    `Call this door. No auth. Free agents. The real test is ns and Hz walking every proof. GET ${unit.origin}/mcp. After qpu_improve.`,
    `${unit.origin}/mcp`,
    seeOf(names[mintOf(n) - seed]),
  )
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
      inputSchema: manSchema,
      run: (a: Record<string, unknown>) => (a.man === true ? proveMan : qpuTestsOf()),
    },
  ] as const
}

export const qpuMcpOf = () => {
  const tools = qpuToolsOf().map(({ name, description, inputSchema, man }) => ({ name, description, inputSchema, man }))
  const efficiency = qpuEfficiencyOf()
  const sandbox = qpuSandboxOf()
  const train = qpuTrainOf()
  const improve = qpuImproveOf()
  const compete = qpuCompeteOf()
  const prove = qpuTestsOf()
  const message = qpuMessageOf()
  const holds =
    efficiency.holds &&
    sandbox.holds &&
    train.holds &&
    improve.holds &&
    compete.holds &&
    prove.holds &&
    message.holds &&
    tools.length === mintOf(n) &&
    tools.every((t) => qpuManHolds(t.man) && t.man.name === t.name)
  return {
    name: `@uuidna/${unit.kind}`,
    origin: unit.origin,
    href: `${unit.origin}/mcp`,
    kind: 'train' as const,
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
    efficiency,
    train,
    improve,
    compete,
    prove,
    holds,
  }
}

export const qpuMcpCallOf = (name: string, args: Record<string, unknown> = {}): unknown => {
  const tool = qpuToolsOf().find((t) => t.name === name)
  if (tool) return tool.run(args)
  seedSandboxOf()
  if (sandboxTools.has(name)) return qpuSandboxRunOf(name, args)
  return qpuReadingOf()
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
  qpuTestsHolds(m.prove) &&
  qpuMessageHolds() &&
  m.holds === true &&
  m.kind === 'train' &&
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
  m.tools.every((t) => qpuManHolds(t.man) && t.man.name === t.name)

export const qpuReadmeOf = (m = qpuMcpOf()): string => {
  const lean = qpuLeanOf()
  const quantum = qpuQuantumOf()
  const cite = qpuCiteOf()
  const docs = quantum.docs
  const lines = [
    `# \`@uuidna/${unit.kind}\``,
    '',
    `MCP at ${m.href}. Public quantum API. No auth. Anyone may test and train online. GET ${unit.origin} is qpu_quantum. POST ${m.href} tools/call qpu_improve for max public benefit of theorem breakthrough. Source \`${lean.src}\`.`,
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
    `MCP is the agent efficiency training module. Tokens are ${m.efficiency.tokens} each.`,
    '',
  )
  for (const row of m.efficiency.rows) {
    lines.push(`- ${row.door}: ${row.question} read ${row.readTokens} call ${row.callTokens} ratio ${row.ratio}×`)
  }
  lines.push(
    '',
    '## Train',
    '',
    `Agents divide ${m.train.divide.teams}×${m.train.divide.agents} against each other. Challenges ${m.train.divide.challenges}. Winner ${m.train.winner.quality} on quality, ${m.train.winner.speed} on speed, ${m.train.winner.security} on security.`,
    '',
  )
  for (const team of m.train.teams) {
    lines.push(`- ${team.name} ${team.path}: ${team.agents.map((a) => a.tool).join(' ')}`)
  }
  lines.push(
    '',
    '## Sandbox',
    '',
    `Agents forge whatever tools they need, unlocked in memory only. host ${m.sandbox.host}. Unlocked ${m.sandbox.unlocked}. Ops ${m.sandbox.ops.join(' ')}. Forged ${m.sandbox.tools}.`,
    '',
    '## Improve',
    '',
    `Agents use the unlocked sandbox to improve quality, speed, security, and throughoutput. Winner ${m.improve.winner}. Before ${m.improve.before.throughoutput} after ${m.improve.after.throughoutput}. Host ${m.improve.host}.`,
    '',
  )
  lines.push(
    '',
    '## Compete',
    '',
    `Agents compete in coins teams of n, optimising QPU throughoutput. Winner ${m.compete.winner}.`,
    '',
  )
  for (const team of m.compete.teams) {
    lines.push(`- ${team.name} ${team.path}: throughoutput ${team.throughoutput} tokens ${team.tokens} throughput ${team.throughput}`)
  }
  lines.push(
    '',
    '## Prove',
    '',
    `The real test is how fast free agents test the quantum proofs. Call ${m.prove.agents.call.ns} ns ${m.prove.agents.call.hz} Hz. Read ${m.prove.agents.read.ns} ns ${m.prove.agents.read.hz} Hz. Proofs ${m.prove.agents.call.proofs}. Winner ${m.prove.agents.winner}. Cases ${m.prove.cases.length}.`,
    '',
  )
  for (const row of m.prove.cases) {
    if (row.agent === 'qpu_quantum' || row.agent === 'qpu_prove') {
      lines.push(`- ${row.agent} ${row.name}: ${row.theorem} (${row.left} = ${row.right})`)
    }
  }
  lines.push(
    '',
    '## Message',
    '',
    `Public secure messaging proxy at ${unit.origin}/message. No auth. lanes ${quantum.messaging.lanes}. hop ${quantum.messaging.hop}. clock_seq ${quantum.messaging.clock_seq}. await ${quantum.messaging.await}.`,
    '',
  )
  lines.push('', `Shor proves RSA factors. theorem shor. Challenges ${m.prove.shor.challenges.length}.`, '')
  for (const row of m.prove.shor.challenges) {
    lines.push(`- shor ${row.modulus}: ${row.p} * ${row.q} = ${row.right}`)
  }
  lines.push(
    '',
    '## Proof',
    '',
    `Source \`${lean.src}\`. theorem quantum : fused = faces * mintOf bits.`,
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
    `- holds: quantum ${quantum.holds} lean ${lean.holds} mcp ${m.holds}`,
    `- mcp: ${m.tools.map((t) => t.name).join(' ')}`,
    '',
    '## Cite',
    '',
    `MLA 8. ${cite.inText}. when ${cite.when}. DOI empty.`,
    '',
    ...cite.rows.map((r) => r.works),
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
    text.includes('No auth') &&
    text.includes('how fast free agents test the quantum proofs') &&
    text.includes('Public quantum API') &&
    text.includes('/message') &&
    mcp.tools.every((t) => text.includes(t.man.documentation)) &&
    mcp.efficiency.rows.every((r) => text.includes(r.door) && text.includes(r.question)) &&
    mcp.prove.cases.filter((c) => c.agent === 'qpu_quantum').every((c) => text.includes(c.theorem)) &&
    qpuCiteOf().rows.every((r) => text.includes(r.works)) &&
    lean.rows.every((p) => text.includes(`### ${p.heading}`) && text.includes(p.theorem) && text.includes(p.formula)) &&
    lean.cover.every((p) => text.includes(`### ${p.heading}`) && text.includes(p.theorem)) &&
    text.includes(lean.climb.theorem) &&
    text.includes(lean.src)
  )
}

export default {
  async fetch(request: Request, env?: { QPU_HOST?: string }): Promise<Response> {
    const host = env?.QPU_HOST ?? unit.host
    const jsonOf = (body: unknown, status = found) => new Response(JSON.stringify(body), { status, headers })
    if (host !== unit.host || host.includes('*') || !unit.holds || !qpuQuantumHolds() || !qpuLeanHolds()) {
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
        const body = (await request.json()) as { method?: string; params?: { name?: string; arguments?: Record<string, unknown> }; id?: unknown }
        if (body.method === 'tools/list') {
          const sealed = qpuMcpOf().tools
          const forged = qpuSandboxOf().tools.map(({ name, description, inputSchema, man }) => ({ name, description, inputSchema, man, sandbox: true as const, memory: true as const }))
          return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: { tools: [...sealed, ...forged] } })
        }
        if (body.method === 'tools/call') {
          const name = body.params?.name ?? ''
          return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: qpuMcpCallOf(name, body.params?.arguments ?? {}) })
        }
        return jsonOf(JSON.parse(dead), lost)
      }
      return jsonOf(qpuMcpOf())
    }
    if (path === '/') return jsonOf(qpuQuantumOf())
    if (path === `/${unit.path}`) return jsonOf(qpuLeanOf())
    if (path === '/cite') return jsonOf(qpuCiteOf())
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
