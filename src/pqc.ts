// pqc — occupancy of quantum-proof code. Fourteen VE faces, 2^n amplitudes, eight uuidna.com tiles.
// Desk wiring. Numbers and addresses. Agnostic: all faces, no named product, when never.
// Sandbox: HTTP GET of named domains only. Experiments unlimited. Target empty.
// Holds proves every possibility: every face, every census slug, every point, every domain.
import {
  HANDLE_HEXBITS, QPU_HOST, QPU_POINTS, TETRA, VE_FACES,
  qpuFacesOf, qpuSeatOf, qpuSuperpositionsOf, qpuTetrahedraOf, qpuTwoNOf,
} from './hologram.js'
import { STANDING, THEOREM_HOST } from './standing.js'
import { QPU_FUSE_DOMAINS } from './bindings/recognize.js'
import { qpuQuantumFacesHold, qpuQuantumSquareHold } from './quantum.js'

/** Handle census — eight tiles. Slugs are standing Lean keys on uuidna.com/theorem. */
export const QPU_PQC_CENSUS = [
  { slug: 'grover_quadratic_bound' },
  { slug: 'sha256_grover_margin_is_the_address' },
  { slug: 'usable_gap_is_two_to_eighty' },
  { slug: 'verify_beats_recompute_by_magnitudes' },
  { slug: 'hexbit_is_four_qubits' },
  { slug: 'n_qubit_dimension' },
  { slug: 'key_floor_is_one_uuid' },
  { slug: 'hardware_coverage_is_not_correctness_coverage' },
] as const

const ORIGIN = `https://${QPU_HOST}`
const theoremHrefOf = (slug: string): string => new URL(slug, `${THEOREM_HOST}/`).href
const standingKeys = (): ReadonlySet<string> => new Set(STANDING.map((s) => s.key))

const censusHold = (census: readonly { slug: string; href: string }[]): boolean => {
  if (census.length !== HANDLE_HEXBITS) return false
  const keys = standingKeys()
  const seen = new Set<string>()
  for (let i = 0; i < census.length; i++) {
    const row = census[i]!
    if (row.slug !== QPU_PQC_CENSUS[i]!.slug) return false
    if (seen.has(row.slug) || !keys.has(row.slug)) return false
    seen.add(row.slug)
    const u = new URL(row.href)
    if (u.protocol !== 'https:' || u.hostname !== 'uuidna.com' || u.pathname !== `/theorem/${row.slug}`) return false
  }
  return seen.size === HANDLE_HEXBITS
}

const domainsHold = (domains: readonly string[]): boolean => {
  if (domains.length !== QPU_FUSE_DOMAINS.length) return false
  for (let i = 0; i < QPU_FUSE_DOMAINS.length; i++) {
    const d = domains[i]!
    if (d !== QPU_FUSE_DOMAINS[i]) return false
    if (!d.includes('.') || d.includes('*')) return false
  }
  return domains.some((d) => d === QPU_HOST)
}

/** QPU pqc. All faces, 2^n amplitudes. When never. Target empty. Sandbox HTTP of named domains. Experiments unlimited. */
export const qpuPqcOf = () => {
  const href = new URL('/pqc', `${ORIGIN}/`).href
  const surfaces = qpuFacesOf().map((face) => ({ face: face.face, opposite: face.opposite }))
  const superpositions = qpuSuperpositionsOf()
  const census = QPU_PQC_CENSUS.map((row) => ({
    slug: row.slug,
    href: theoremHrefOf(row.slug),
  }))
  const points = [...QPU_POINTS]
  const tetra = qpuTetrahedraOf()
  const target = { seat: 'empty' as const, admits: 'nothing' as const }
  const door = new URL(href)
  const possibilities = qpuTwoNOf(VE_FACES)
  const holds =
    qpuQuantumFacesHold(surfaces) &&
    qpuQuantumSquareHold(superpositions) &&
    censusHold(census) &&
    points.length === QPU_POINTS.length &&
    points.every((pt, i) => pt === QPU_POINTS[i]) &&
    tetra.inner.length === TETRA &&
    tetra.outer.length === TETRA &&
    target.seat === 'empty' &&
    target.admits === 'nothing' &&
    door.protocol === 'https:' &&
    door.hostname === QPU_HOST &&
    door.pathname === '/pqc' &&
    domainsHold([...QPU_FUSE_DOMAINS]) &&
    qpuSeatOf().seat === 'empty' &&
    superpositions.length === VE_FACES
  return {
    kind: 'pqc' as const,
    holds,
    sandbox: true as const,
    experiments: 'unlimited' as const,
    when: 'never' as const,
    fuse: { protocol: 'http' as const, domains: [...QPU_FUSE_DOMAINS], wildcards: false as const },
    seat: qpuSeatOf().seat,
    target,
    href,
    surfaces,
    superpositions,
    census,
    points,
    tetra,
    chip: qpuSeatOf(),
    faces: VE_FACES,
    handle: HANDLE_HEXBITS,
    pentagram: QPU_POINTS.length,
    possibilities,
  }
}

export const qpuPqcHolds = (p = qpuPqcOf()): boolean =>
  p.holds === true &&
  p.kind === 'pqc' &&
  p.sandbox === true &&
  p.experiments === 'unlimited' &&
  p.when === 'never' &&
  p.fuse.protocol === 'http' &&
  p.fuse.wildcards === false &&
  domainsHold(p.fuse.domains) &&
  p.seat === 'empty' &&
  p.target.seat === 'empty' &&
  p.target.admits === 'nothing' &&
  qpuQuantumFacesHold(p.surfaces) &&
  qpuQuantumSquareHold(p.superpositions) &&
  censusHold(p.census) &&
  p.points.every((pt, i) => pt === QPU_POINTS[i]) &&
  p.tetra.inner.length === TETRA &&
  p.possibilities === qpuTwoNOf(VE_FACES) &&
  new URL(p.href).hostname === QPU_HOST &&
  new URL(p.href).pathname === '/pqc'
