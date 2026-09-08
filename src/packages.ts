// packages — the supply-chain stamp. Zero runtime deps. Dev pins come from qpuConfigOf.
// Workers-safe: no node:fs. The stamp is the constructor; Node tests compare it to package.json.
import { QPU_CONFIG_PINS, QPU_DEV_PACKAGES, QPU_NODE } from './config.js'

export { QPU_DEV_PACKAGES }

export type QpuPkg = {
  name: string
  version: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  engines?: { node?: string }
}

export const qpuPkgOf = (pkg: QpuPkg): QpuPkg => pkg

/** Replica stamp. Dev pins and the node engine come from qpuConfigOf. */
export const qpuPkgStampOf = (
  name: string,
  version: string,
  dependencies: Record<string, string> = {},
): QpuPkg => ({
  name,
  version,
  dependencies,
  devDependencies: { ...QPU_CONFIG_PINS },
  engines: { node: QPU_NODE },
})

/** Exact pins this replica ships. package.json must match. */
export const QPU_PKG_STAMP: QpuPkg = qpuPkgStampOf('@uuidna/qpu', '0.3.1')

const rangeOf = (spec: string): boolean => /[\^~><*xX ]/.test(spec) || spec.startsWith('github:') || spec.startsWith('git+')

export const qpuPackagesOf = (pkg: QpuPkg = QPU_PKG_STAMP, runtimeAllow: readonly string[] = []) => {
  const runtime = Object.keys(pkg.dependencies ?? {})
  const dev = pkg.devDependencies ?? {}
  const names = Object.keys(dev)
  const unknown = names.filter((n) => !(QPU_DEV_PACKAGES as readonly string[]).includes(n))
  const missing = QPU_DEV_PACKAGES.filter((n) => !names.includes(n))
  const floating = names.filter((n) => rangeOf(dev[n] ?? ''))
  const exact = names.every((n) => !rangeOf(dev[n] ?? ''))
  const runtimeOk =
    runtime.length === runtimeAllow.length &&
    runtimeAllow.every((n) => runtime.includes(n))
  const holds =
    runtimeOk &&
    unknown.length === 0 &&
    missing.length === 0 &&
    exact &&
    names.length === QPU_DEV_PACKAGES.length &&
    (pkg.engines?.node?.startsWith('>=') ?? false)
  return {
    runtime: runtime.length,
    runtimeNames: runtime,
    dev: names.length,
    allow: [...QPU_DEV_PACKAGES],
    pins: { ...dev },
    unknown,
    missing,
    floating,
    exact,
    engine: pkg.engines?.node ?? '',
    holds,
  }
}

export const qpuPackagesHolds = (pkg: QpuPkg = QPU_PKG_STAMP, runtimeAllow: readonly string[] = []): boolean =>
  qpuPackagesOf(pkg, runtimeAllow).holds
