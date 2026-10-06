// Cooled out of index.ts by the heat family (scripts/cool.mjs): chooseOf, tenOf, qpuCubeOf, qpuHandleOf, qpuFacesOf, qpuElectronicsOf, qpuBalanceOf, qpuCapacityOf, qpuSpeedOf, qpuLatticeNamesOf.
import {
  coins,
  cors,
  mintOf,
  n,
  onceOf,
  qpuCapacityHolds,
  qpuCoilHolds,
  qpuCoilOf,
  qpuHostsHolds,
  qpuHybridOf,
  qpuNeuroHolds,
  qpuRaidOf,
  qpuSchemasOf,
  seed,
  storageBindings,
  ten,
  theorem,
} from './index.js'

/**
 * Binomial coefficient C(nn, k) by Pascal recursion, mirroring chooseOf in index.lean.
 * @wing lattice
 * @kind builder
 */
export const chooseOf = (nn: number, k: number): number => {
  const none = nn - nn
  if (k < none || k > nn) return none
  if (k === none || k === nn) return none + 1
  let kk = k
  if (kk + kk > nn) kk = nn - kk
  let x = none + 1
  for (let i = none + 1; i <= kk; i++) x = (x * (nn - kk + i)) / i
  return x
}

/**
 * 10^k by repeated multiplication (no Math.pow), used for page sizes and deadlines.
 * @wing lattice
 * @kind builder
 */
export const tenOf = (k: number): number => {
  let x = mintOf(n - n)
  for (let i = n - n; i < k; i++) x *= ten
  return x
}

/**
 * The register geometry: n qubits, vertices = 2^n, hexbit = 2^(n-1), bits = vertices x hexbit.
 * @wing lattice
 * @kind builder
 * @evidence qpuCubeHolds
 */
export const qpuCubeOf = onceOf(() => {
  const vertices = mintOf(n)
  const hexbit = mintOf(coins)
  const bits = mintOf(n + coins)
  const holds = theorem.cube(bits, vertices, hexbit) && hexbit === n + seed
  return { n, vertices, hexbit, bits, holds }
})

/**
 * Amplitude capacity: amplitudes = 2^bits, next = 2 x amplitudes, and the KV reading of both.
 * @wing lattice
 * @kind builder
 * @evidence qpuHandleHolds
 */
export const qpuHandleOf = onceOf(() => {
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
})

/**
 * The lattice of faces: coins, rays = n + 2 coins, faces = coins x rays = rays + rays, with the coil derived from them.
 * @wing lattice
 * @kind builder
 * @evidence qpuFacesHolds
 */
export const qpuFacesOf = onceOf(() => {
  const cube = qpuCubeOf()
  const rays = n + coins + coins
  const faces = cube.vertices + cube.hexbit + coins
  const holds = cube.holds && theorem.around(faces, coins, rays) && theorem.harmonic(faces, rays)
  return { n, coins, rays, faces, holds }
})

/**
 * The 'electronics' reading: the coil (coins x rays) used as staged windings, theory and practice each one seed.
 * @wing lattice
 * @kind builder
 * @evidence qpuElectronicsHolds
 */
export const qpuElectronicsOf = onceOf(() => {
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
})

/**
 * The 'balance' reading: theory and practice equal and summing to coins (theorem follow_the_coins).
 * @wing lattice
 * @kind builder
 * @evidence qpuBalanceHolds
 */
export const qpuBalanceOf = onceOf(() => {
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
})

/**
 * Capacity counts: bits, amplitudes, fused = faces x 2^(bits+1), next, the crypt split and the agent and schema counts.
 * @wing lattice
 * @kind builder
 * @evidence qpuCapacityHolds
 */
export const qpuCapacityOf = onceOf(() => {
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
    holds: theorem.handle(fused, faces.faces, handle.kv.amplitudes) && fused === faces.faces * mintOf(cube.vertices * cube.hexbit + seed),
  }
  const agents = {
    kind: 'agents' as const,
    teams: coins,
    rays: faces.rays,
    n: faces.faces,
    free: cors === '*',
    auth: cors !== '*',
    holds: theorem.around(faces.faces, coins, faces.rays) && theorem.harmonic(faces.faces, faces.rays) && cors === '*',
  }
  const schemas = qpuSchemasOf()
  const raid = qpuRaidOf()
  const holds =
    cube.holds &&
    handle.holds &&
    faces.holds &&
    theorem.cube(cube.bits, cube.vertices, cube.hexbit) &&
    handle.amplitudes === mintOf(cube.bits) &&
    fused === faces.faces * mintOf(cube.bits + seed) &&
    theorem.handle(fused, faces.faces, handle.kv.amplitudes) &&
    theorem.next_fused(next, fused) &&
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
})

/**
 * The doubling rung: next = fused + fused, with the cover of rungs and a benchmark of the step.
 * @wing lattice
 * @kind builder
 * @evidence qpuSpeedHolds
 */
export const qpuSpeedOf = onceOf(() => {
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
    theorem.next_fused(next, capacity.fused) &&
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
})

/**
 * The lattice by name — n, seed, coins, hexbit, vertices, bits, rays, faces, plane — so a module outside this one writes
 * its numbers as this unit does (never a literal: a count is a lattice name, a power is mintOf, a page is tenOf).
 * @wing lattice
 * @kind builder
 */
export const qpuLatticeNamesOf = onceOf(() => {
  const cube = qpuCubeOf()
  const faces = qpuFacesOf()
  return { n, seed, coins, hexbit: cube.hexbit, vertices: cube.vertices, bits: cube.bits, rays: faces.rays, faces: faces.faces, plane: faces.faces * coins }
})
