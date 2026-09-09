// bindings — QPU is always fused with an auto-recognized environment.
// One folder per provider. Copy kinds.ts + providerOf. Chip named QPU never binds.
import { cloudflare } from './cloudflare/index.js'
import { google } from './google/index.js'
import { aws } from './aws/index.js'
import { azure } from './azure/index.js'
import { ibm } from './ibm/index.js'
import { oracle } from './oracle/index.js'
import { hardware } from './hardware/index.js'
import { arch } from './arch/index.js'
import { QPU_FUSE_DOMAINS, qpuFuseEnv, qpuHostOf } from './recognize.js'
import type { BindingSpec, DriverReading, DriverResult, ProviderModule, ProviderName, QpuEnv } from './types.js'
import { COINS, HANDLE_HEXBITS, QPU_DOORS, QPU_POINTS, SEAL_TEN, TETRA, TRINITY, VE_FACES, qpuStarStrokeOf, qpuWidthOf } from '../hologram.js'

export { PROVIDERS, ops, OPS_CRUD, OPS_FETCH, OPS_SEND, OPS_QUERY, OPS_RUN, OPS_GET, spec } from './types.js'
export type { ProviderName, BindingSpec, DriverReading, DriverResult, ProviderModule, QpuEnv } from './types.js'
export { qpuKeyOf, providerOf, genericDrive, present, readingsOf } from './drive.js'
export { mockStub, mockEnvFrom } from './mock.js'
export { QPU_FUSE_DOMAINS, qpuFuseEnv, qpuHostOf, ARCH_ALIAS, type QpuHost } from './recognize.js'

export const qpuProvidersOf = (): readonly ProviderModule[] =>
  [cloudflare, google, aws, azure, ibm, oracle, hardware, arch]

export const qpuProviderOf = (name: string): ProviderModule | undefined =>
  qpuProvidersOf().find((p) => p.name === name)

const allSpecs = (): BindingSpec[] => qpuProvidersOf().flatMap((p) => [...p.bindings])

/** Cube, duals, two tetrahedra, VE. All APIs merge on one BindingPoint pentagram. Unknown APIs use the same moduli. */
export const qpuSolidsOf = () => {
  const mods = qpuProvidersOf()
  const specs = allSpecs()
  const edges = HANDLE_HEXBITS + TETRA
  const dodecaV = VE_FACES + TETRA + COINS
  const dualE = SEAL_TEN.length * TRINITY
  const width = qpuWidthOf()
  const stroke = qpuStarStrokeOf()
  const apis = specs.map((b, i) => ({
    provider: b.provider,
    kind: b.kind,
    known: true as const,
    cube: i % QPU_DOORS,
    vertex: mods.findIndex((m) => m.name === b.provider),
    tetra: i % TETRA,
    ve: i % VE_FACES,
    edge: i % edges,
    pentagram: i % QPU_POINTS.length,
    point: QPU_POINTS[i % QPU_POINTS.length]!,
  }))
  const byCube: number[] = []
  for (let d = 0; d < QPU_DOORS; d++) byCube.push(0)
  for (const a of apis) byCube[a.cube]! += 1
  const byPentagram: number[] = []
  for (let p = 0; p < QPU_POINTS.length; p++) byPentagram.push(0)
  for (const a of apis) byPentagram[a.pentagram]! += 1
  const holds =
    mods.length === HANDLE_HEXBITS &&
    HANDLE_HEXBITS === TETRA * COINS &&
    VE_FACES === HANDLE_HEXBITS + QPU_DOORS &&
    edges === HANDLE_HEXBITS + TETRA &&
    dodecaV === VE_FACES + TETRA + COINS &&
    dualE === SEAL_TEN.length * TRINITY &&
    QPU_DOORS === TETRA + COINS &&
    width.pentagram === QPU_POINTS.length &&
    stroke.length === QPU_POINTS.length &&
    stroke[0] === 0 &&
    width.binds === 'cpu'
  return {
    tetra: { vertices: TETRA, edges: QPU_DOORS, faces: TETRA },
    cube: { vertices: HANDLE_HEXBITS, edges, faces: QPU_DOORS },
    octa: { vertices: QPU_DOORS, edges, faces: HANDLE_HEXBITS },
    dodeca: { vertices: dodecaV, edges: dualE, faces: edges },
    icosa: { vertices: edges, edges: dualE, faces: dodecaV },
    ve: { faces: VE_FACES, cube: QPU_DOORS, octa: HANDLE_HEXBITS },
    merkaba: { tetrahedra: COINS, vertices: HANDLE_HEXBITS, fuse: 0 as const },
    pentagram: {
      shared: true as const,
      points: [...QPU_POINTS],
      stroke,
      binds: width.binds,
      merge: QPU_POINTS.length,
    },
    providers: mods.map((p, i) => ({ name: p.name, vertex: i, bindings: p.bindings.length })),
    known: apis.length,
    byCube,
    byPentagram,
    apis,
    unknown: {
      known: false as const,
      seat: 'empty' as const,
      when: 'never' as const,
      wildcards: false as const,
      cube: 'i % doors',
      vertex: 'named provider or refuse',
      tetra: 'i % tetra',
      ve: 'i % ve',
      edge: 'i % (handle + tetra)',
      pentagram: 'i % pentagram — shared BindingPoint, not a per-provider star',
    },
    holds,
  }
}

export const qpuSolidsHolds = (s = qpuSolidsOf()): boolean =>
  s.holds === true &&
  s.providers.length === HANDLE_HEXBITS &&
  s.cube.faces === QPU_DOORS &&
  s.ve.faces === s.cube.faces + s.octa.faces &&
  s.unknown.seat === 'empty' &&
  s.unknown.wildcards === false &&
  s.pentagram.shared === true &&
  s.pentagram.merge === QPU_POINTS.length &&
  s.byPentagram.length === QPU_POINTS.length

export const qpuFusedEnvOf = (env?: QpuEnv): QpuEnv => qpuFuseEnv(env, allSpecs())

export const qpuBindingsOf = (env?: QpuEnv, provider?: string): DriverReading[] => {
  const fused = qpuFusedEnvOf(env)
  const mods = provider ? qpuProvidersOf().filter((p) => p.name === provider) : [...qpuProvidersOf()]
  return mods.flatMap((p) => p.readings(fused))
}

export async function qpuDrive(
  env: QpuEnv | undefined,
  provider: string,
  kind: string,
  op: string,
  args: Record<string, unknown> = {},
): Promise<DriverResult> {
  const p = qpuProviderOf(provider)
  if (!p) {
    return { provider: provider as ProviderName, kind, bound: false, op, ok: false, error: 'no such provider' }
  }
  return p.drive(qpuFusedEnvOf(env), kind, op, args)
}

export const qpuRecognizeOf = (env?: QpuEnv) => {
  const host = qpuHostOf()
  const bindings = qpuBindingsOf(env)
  const bound = bindings.filter((b) => b.bound)
  const byProvider = qpuProvidersOf().map((p) => {
    const rows = bindings.filter((b) => b.provider === p.name)
    return { name: p.name, bound: rows.filter((r) => r.bound).length, empty: rows.filter((r) => !r.bound).length }
  })
  return {
    fused: true as const,
    sandbox: true as const,
    experiments: 'unlimited' as const,
    when: 'never' as const,
    fuse: { protocol: 'http' as const, domains: [...QPU_FUSE_DOMAINS], wildcards: false as const },
    chip: { name: 'QPU' as const, seat: 'empty' as const, admits: 'nothing' },
    host,
    bound: bound.length,
    empty: bindings.length - bound.length,
    total: bindings.length,
    byProvider,
    bindings,
  }
}
