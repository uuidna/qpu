// recognize — QPU is always fused with whatever the environment already is.
// Workers env, process.env, process.arch, navigator — auto-matched to canonical envKeys.
// The hardware chip named QPU is never injected.
import type { BindingSpec, QpuEnv } from './types.js'

const rec = (v: unknown): Record<string, unknown> | undefined =>
  v !== null && typeof v === 'object' ? (v as Record<string, unknown>) : undefined

const norm = (s: string): string => s.toUpperCase().replace(/-/g, '_')

/** Node process.arch → Alpine / QPU arch kind. */
export const ARCH_ALIAS: Readonly<Record<string, string>> = Object.freeze({
  x64: 'x86_64',
  ia32: 'x86',
  x86: 'x86',
  x86_64: 'x86_64',
  arm64: 'aarch64',
  aarch64: 'aarch64',
  arm: 'armv7',
  armv7: 'armv7',
  armhf: 'armhf',
  ppc64: 'ppc64le',
  ppc64le: 'ppc64le',
  s390x: 's390x',
  riscv64: 'riscv64',
  loong64: 'loongarch64',
  loongarch64: 'loongarch64',
  mips64el: 'mips64',
  mips64: 'mips64',
  wasm32: 'wasm32',
  wasm64: 'wasm64',
})

export interface QpuHost {
  arch?: string
  kind?: string
  platform?: string
  cores?: number
  webgpu: boolean
}

/** Licensed hosts this sandbox may fuse over HTTP. Named domains, no wildcard. */
export const QPU_FUSE_DOMAINS = ['qpu.uuidna.com', 'uuidna.com', 'license.uuidna.com'] as const

export function qpuHostOf(): QpuHost {
  const g = globalThis as unknown as {
    process?: { arch?: string; platform?: string }
    navigator?: { hardwareConcurrency?: number; gpu?: unknown }
  }
  const arch = g.process?.arch
  const kind = arch ? ARCH_ALIAS[arch] ?? ARCH_ALIAS[arch.toLowerCase()] : undefined
  const cores = g.navigator?.hardwareConcurrency
  return {
    arch,
    kind,
    platform: g.process?.platform,
    cores: typeof cores === 'number' && cores > 0 ? cores : undefined,
    webgpu: g.navigator?.gpu != null,
  }
}

const aliasOf = (raw: QpuEnv, spec: BindingSpec): unknown => {
  if (raw[spec.envKey] !== undefined && raw[spec.envKey] !== null && raw[spec.envKey] !== '')
    return raw[spec.envKey]
  const want = norm(spec.envKey)
  const kind = norm(spec.kind)
  const prefixed = `${norm(spec.provider)}_${kind}`
  for (const k of Object.keys(raw)) {
    const u = norm(k)
    if (u === want || u === kind || u === prefixed) {
      const v = raw[k]
      if (v !== undefined && v !== null && v !== '') return v
    }
  }
  return undefined
}

const harvestProcessEnv = (raw: QpuEnv): void => {
  const g = globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }
  const pe = g.process?.env
  if (!pe) return
  for (const k of Object.keys(pe)) {
    const v = pe[k]
    if (v && raw[k] === undefined) raw[k] = v
  }
}

/** Fuse Worker env + host + aliases. Always. Never a QPU chip. */
export function qpuFuseEnv(env: QpuEnv | undefined, bindings: readonly BindingSpec[]): QpuEnv {
  const raw: QpuEnv = { ...(env ?? {}) }
  harvestProcessEnv(raw)
  const fused: QpuEnv = { ...raw }
  const host = qpuHostOf()
  if (host.kind) {
    const key = `ARCH_${host.kind.toUpperCase()}`
    if (fused[key] == null) fused[key] = { arch: host.kind, source: 'host' }
  }
  if (host.cores != null && fused.CPU == null)
    fused.CPU = { cores: host.cores, source: 'host' }
  if (host.webgpu && fused.ARCH_WEBGPU == null)
    fused.ARCH_WEBGPU = { api: 'webgpu', source: 'host' }
  for (const b of bindings) {
    if (b.kind === 'qpu') continue
    if (fused[b.envKey] !== undefined && fused[b.envKey] !== null && fused[b.envKey] !== '') continue
    const found = aliasOf(raw, b)
    if (found !== undefined) fused[b.envKey] = found
  }
  delete fused.QPU
  return fused
}
