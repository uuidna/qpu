// Alpine Linux packages on the browser OS. A name is a request for the published index.
// The client device fetches the index, then the apk, and runs that binary in the browser.
// Nothing is fetched here and nothing is executed here.

import { canonicalText, uuid, uuidQubits } from '../../uuid/index.ts'

const ORIGIN = 'https://dl-cdn.alpinelinux.org/alpine'
const ARCHES = ['x86_64', 'aarch64', 'armv7', 'armhf', 'ppc64le', 'riscv64', 's390x', 'loongarch64'] as const
const REPOS = ['main', 'community', 'testing'] as const
type Repo = (typeof REPOS)[number]
type Arch = (typeof ARCHES)[number]

const nameOk = (name: string) => /^[a-z0-9][a-z0-9+_.-]{0,127}$/.test(name)
const versionOk = (version: string) => /^[A-Za-z0-9._+-]{1,128}$/.test(version)
const branchOk = (branch: string) => branch === 'latest-stable' || branch === 'edge' || /^v\d+\.\d+$/.test(branch)

const register = () => {
  const counted = uuidQubits(4)
  return { unlimited: true as const, ceiling: null, effective: counted.effective, handles: counted.handles.possible, scale: counted.handles.capacity }
}

const indexUrl = (branch: string, repo: Repo, arch: Arch) => `${ORIGIN}/${branch}/${repo}/${arch}/APKINDEX.tar.gz`
const apkUrl = (branch: string, repo: Repo, arch: Arch, file: string) => `${ORIGIN}/${branch}/${repo}/${arch}/${file}`

const parseIndex = (text: string) => {
  const rows: { name: string; version: string }[] = []
  for (const block of text.split(/\n\n+/)) {
    const fields: Record<string, string> = {}
    for (const line of block.split(/\n/)) {
      const match = /^([A-Za-z]):(.*)$/.exec(line)
      if (match) fields[match[1]!] = match[2]!
    }
    if (fields.P && fields.V && nameOk(fields.P) && versionOk(fields.V)) rows.push({ name: fields.P, version: fields.V })
  }
  return rows
}

export type PackageAsk = { package?: unknown; packages?: unknown; branch?: unknown; repo?: unknown; arch?: unknown; index?: unknown; indexes?: unknown }

/** One or more Alpine packages. Without the index text, the answer is the index request. With it, the answer is the apk address. The client device fetches and runs it. */
export const portPackages = (asked: PackageAsk) => {
  const names = asked.packages !== undefined ? asked.packages : asked.package !== undefined ? [asked.package] : []
  if (!Array.isArray(names) || names.length === 0 || names.some((name) => typeof name !== 'string' || !nameOk(name))) throw new Error('alpine package is a name such as busybox, or { packages: [names] }')
  const branch = typeof asked.branch === 'string' ? asked.branch : 'latest-stable'
  if (!branchOk(branch)) throw new Error('alpine branch is latest-stable, edge, or v<major>.<minor>')
  const arch = (typeof asked.arch === 'string' ? asked.arch : 'x86_64') as Arch
  if (!(ARCHES as readonly string[]).includes(arch)) throw new Error(`alpine arch is one of ${ARCHES.join(', ')}`)
  const repo = typeof asked.repo === 'string' ? asked.repo as Repo : null
  if (repo && !(REPOS as readonly string[]).includes(repo)) throw new Error('alpine repo is main, community, or testing')
  const repos: Repo[] = repo ? [repo] : ['main', 'community']
  const indexes = asked.indexes && typeof asked.indexes === 'object' ? asked.indexes as Record<string, unknown> : null
  const single = typeof asked.index === 'string' ? asked.index : null
  const textOf = (one: Repo) => {
    if (indexes && typeof indexes[one] === 'string') return indexes[one] as string
    if (single && (repo === one || (!repo && one === 'main'))) return single
    return null
  }
  const handed = repos.some((one) => textOf(one) !== null)
  const requests = repos.map((one) => ({ id: one, method: 'GET' as const, url: indexUrl(branch, one, arch), fetched: false as const }))
  const packages = names.map((name) => {
    const found = repos.map((one) => ({ repo: one, row: textOf(one) ? parseIndex(textOf(one)!).find((row) => row.name === name) ?? null : null })).find((item) => item.row)
    const file = found?.row ? `${found.row.name}-${found.row.version}.apk` : null
    const binary = file && found ? { method: 'GET' as const, url: apkUrl(branch, found.repo, arch, file), file, version: found.row!.version, repo: found.repo, fetched: false as const } : null
    return { name: name as string, address: uuid(canonicalText({ package: name, branch, arch, repo: found?.repo ?? repos[0] })), binary, found: binary !== null }
  })
  const advantage = register()
  return {
    phase: 'os' as const,
    name: 'qpu browser quantum os' as const,
    upstream: 'https://alpinelinux.org' as const,
    device: 'client' as const,
    browser: true as const,
    branch,
    arch,
    fetched: false as const,
    executedHere: false as const,
    runsHere: false as const,
    advantage,
    packages,
    requests: handed ? [] : requests,
    says: handed
      ? `${packages.filter((row) => row.found).length} of ${packages.length} package(s) name an apk. The client device fetches that binary and runs it in the browser. Nothing is fetched here and nothing is executed here.`
      : `${packages.length} package(s) asked. The client device fetches the Alpine index, then the apk, and runs that binary in the browser. Nothing is fetched here and nothing is executed here.`,
  }
}
