// boot — binary images, compilers, kernel patches. One table. No hand lists beside it.
// Alpine's eight official ISAs. Each netboot image is kernel + initramfs + modloop (trinity).
// Harvest fans out with Promise.all. Digests are never invented. Hardware QPU lane stays empty.
import { HANDLE_HEXBITS, TRINITY, qpuSeatOf } from './hologram.js'

const href = (s: string): string => new URL(s).href

/** Alpine CDN — hostname via URL, not a string prefix. */
export const QPU_BOOT_MIRROR = href('https://dl-cdn.alpinelinux.org/alpine/latest-stable/releases/')

/** Kernel + initramfs + modloop. Length is trinity. */
export const QPU_BOOT_PARTS = ['vmlinuz-lts', 'initramfs-lts', 'modloop-lts'] as const

/**
 * ONE row per official Alpine ISA. Images, compiler triples, and kernel ARCH
 * are read off this table. Adding an arch is adding a row — never a second list.
 */
export const QPU_BOOT_ARCHES = Object.freeze([
  { alpine: 'x86_64', triple: 'x86_64-alpine-linux-musl', kernel: 'x86_64', bits: 64 },
  { alpine: 'x86', triple: 'i586-alpine-linux-musl', kernel: 'i386', bits: 32 },
  { alpine: 'aarch64', triple: 'aarch64-alpine-linux-musl', kernel: 'arm64', bits: 64 },
  { alpine: 'armhf', triple: 'armv6-alpine-linux-musleabihf', kernel: 'arm', bits: 32 },
  { alpine: 'armv7', triple: 'armv7-alpine-linux-musleabihf', kernel: 'arm', bits: 32 },
  { alpine: 'ppc64le', triple: 'powerpc64le-alpine-linux-musl', kernel: 'powerpc', bits: 64 },
  { alpine: 's390x', triple: 's390x-alpine-linux-musl', kernel: 's390', bits: 64 },
  { alpine: 'riscv64', triple: 'riscv64-alpine-linux-musl', kernel: 'riscv', bits: 64 },
] as const)

export type QpuBootArch = (typeof QPU_BOOT_ARCHES)[number]
export type QpuBootAlpine = QpuBootArch['alpine']

export const qpuBootArchOf = (alpine: string): QpuBootArch | undefined =>
  QPU_BOOT_ARCHES.find((a) => a.alpine === alpine)

export const qpuBootTarballOf = (alpine: string, version: string): string =>
  `alpine-netboot-${version}-${alpine}.tar.gz`

export const qpuBootUrlOf = (alpine: string, version: string): string =>
  href(`${QPU_BOOT_MIRROR}${alpine}/${qpuBootTarballOf(alpine, version)}`)

export const qpuBootPartUrlOf = (alpine: string, part: (typeof QPU_BOOT_PARTS)[number]): string =>
  href(`${QPU_BOOT_MIRROR}${alpine}/${part}`)

/** Every binary boot image the eight ISAs publish. 8 × 3 = 24. */
export const qpuImagesOf = (version = 'latest') =>
  QPU_BOOT_ARCHES.flatMap((a) => {
    const tarball = qpuBootTarballOf(a.alpine, version)
    const url = qpuBootUrlOf(a.alpine, version)
    return QPU_BOOT_PARTS.map((part) => ({
      alpine: a.alpine,
      bits: a.bits,
      kernel: a.kernel,
      part,
      tarball,
      url,
      file: `boot/${part}`,
      bootable: true as const,
    }))
  })

/** gcc/clang/make for each official ISA. Shader targets compile; they do not boot a kernel. */
export const qpuCompilersOf = () =>
  QPU_BOOT_ARCHES.map((a) => ({
    alpine: a.alpine,
    triple: a.triple,
    kernel: a.kernel,
    bits: a.bits,
    gcc: `${a.triple}-gcc`,
    clang: `clang --target=${a.triple}`,
    make: `make ARCH=${a.kernel}`,
    libc: 'musl',
    headers: 'linux-headers',
    bootable: true as const,
  }))

/** Kernel.org LINUX_VERSION_CODE — decimal 10³ places. Uuidna versions pack in hexbits via qpuVersionIntegerOf. */
export const qpuKernelCodeOf = (major: number, minor: number, patch: number): number => {
  if (major !== (major | 0) || minor !== (minor | 0) || patch !== (patch | 0))
    throw new Error('qpuKernelCodeOf: version is not whole')
  if (major < 0 || minor < 0 || patch < 0 || minor >= 1000 || patch >= 1000)
    throw new Error('qpuKernelCodeOf: version outside the lossless encoding')
  return major * 1_000_000 + minor * 1000 + patch
}

export const qpuKernelSplitOf = (code: number): { major: number; minor: number; patch: number } => ({
  major: (code / 1_000_000) | 0,
  minor: ((code / 1000) | 0) % 1000,
  patch: code % 1000,
})

const badPath = (p: string): boolean =>
  p.includes('..') || p.startsWith('/') || /^(proc|sys|dev)(\/|$)/.test(p) || p.includes('\0')

export interface QpuPatchFile {
  from: string
  to: string
  plus: number
  minus: number
  hunks: number
}

/** Parse a unified diff. Binary git patches and path escape are refused. */
export const qpuPatchParseOf = (diff: string): { ok: boolean; files: QpuPatchFile[]; error?: string } => {
  const text = diff.replace(/\r\n/g, '\n')
  if (/^GIT binary patch/m.test(text) || /^Binary files /m.test(text))
    return { ok: false, files: [], error: 'binary patch refused' }
  if (!/^--- /m.test(text) || !/^\+\+\+ /m.test(text))
    return { ok: false, files: [], error: 'not a unified diff' }
  const files: QpuPatchFile[] = []
  const blocks = text.split(/^--- /m).slice(1)
  for (const block of blocks) {
    const lines = block.split('\n')
    const fromRaw = (lines[0] ?? '').replace(/^\s*/, '').split('\t')[0]!.trim()
    const plusLine = lines.find((l) => l.startsWith('+++ '))
    const toRaw = (plusLine ?? '').slice(4).split('\t')[0]!.trim()
    const strip = (p: string) => p.replace(/^[ab]\//, '')
    const from = strip(fromRaw)
    const to = strip(toRaw || fromRaw)
    if (badPath(from) || badPath(to))
      return { ok: false, files: [], error: 'path refused' }
    let plus = 0
    let minus = 0
    let hunks = 0
    for (const l of lines) {
      if (l.startsWith('@@ ')) hunks++
      else if (l.startsWith('+') && !l.startsWith('+++')) plus++
      else if (l.startsWith('-') && !l.startsWith('---')) minus++
    }
    files.push({ from, to, plus, minus, hunks })
  }
  if (files.length === 0) return { ok: false, files: [], error: 'no files' }
  return { ok: true, files }
}

/** Apply one-file unified diff to source text. Source the user is maintaining — not a live kernel. */
export const qpuPatchTextOf = (source: string, diff: string): { ok: boolean; text?: string; error?: string } => {
  const parsed = qpuPatchParseOf(diff)
  if (!parsed.ok) return { ok: false, error: parsed.error }
  if (parsed.files.length !== 1) return { ok: false, error: 'one file' }
  const src = source.replace(/\r\n/g, '\n').split('\n')
  if (src.length && src[src.length - 1] === '') src.pop()
  const body = diff.replace(/\r\n/g, '\n')
  const hunkRe = /@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/g
  const hunks: { oldStart: number; lines: string[] }[] = []
  let m: RegExpExecArray | null
  const marks = [...body.matchAll(hunkRe)]
  if (marks.length === 0) return { ok: false, error: 'no hunks' }
  for (let i = 0; i < marks.length; i++) {
    const cur = marks[i]!
    const start = cur.index! + cur[0].length
    const next = marks[i + 1]?.index ?? body.length
    const chunk = body.slice(start, next).split('\n')
    while (chunk.length && chunk[0] === '') chunk.shift()
    while (chunk.length && (chunk[chunk.length - 1] === '' || chunk[chunk.length - 1]!.startsWith('--- ') || chunk[chunk.length - 1]!.startsWith('diff ')))
      chunk.pop()
    hunks.push({ oldStart: Number(cur[1]), lines: chunk.filter((l) => l.startsWith(' ') || l.startsWith('+') || l.startsWith('-')) })
  }
  const out: string[] = []
  let cursor = 1
  for (const h of hunks) {
    while (cursor < h.oldStart) {
      out.push(src[cursor - 1] ?? '')
      cursor++
    }
    for (const l of h.lines) {
      const mark = l[0]
      const rest = l.slice(1)
      if (mark === ' ') {
        if ((src[cursor - 1] ?? '') !== rest) return { ok: false, error: `context mismatch at ${cursor}` }
        out.push(rest)
        cursor++
      } else if (mark === '-') {
        if ((src[cursor - 1] ?? '') !== rest) return { ok: false, error: `delete mismatch at ${cursor}` }
        cursor++
      } else if (mark === '+') out.push(rest)
    }
  }
  while (cursor <= src.length) {
    out.push(src[cursor - 1] ?? '')
    cursor++
  }
  return { ok: true, text: out.join('\n') + (source.endsWith('\n') ? '\n' : '') }
}

/** Recipe against a named kernel version pair. Does not patch a running kernel. */
export const qpuKernelPatchOf = (args: {
  alpine?: string
  from: { major: number; minor: number; patch: number }
  to: { major: number; minor: number; patch: number }
  diff: string
}) => {
  const arch = args.alpine ? qpuBootArchOf(args.alpine) : undefined
  if (args.alpine && !arch) return { ok: false as const, error: 'unknown arch' }
  const parsed = qpuPatchParseOf(args.diff)
  if (!parsed.ok) return { ok: false as const, error: parsed.error }
  const a = qpuKernelCodeOf(args.from.major, args.from.minor, args.from.patch)
  const b = qpuKernelCodeOf(args.to.major, args.to.minor, args.to.patch)
  const round = qpuKernelSplitOf(a)
  const lossless =
    round.major === args.from.major && round.minor === args.from.minor && round.patch === args.from.patch
  return {
    ok: true as const,
    alpine: arch?.alpine,
    kernel: arch?.kernel,
    from: a,
    to: b,
    forward: b > a,
    lossless,
    files: parsed.files,
    live: false as const,
    chip: qpuSeatOf(),
  }
}

export const qpuImageCheckOf = (expected: string, computed: string): { ok: boolean } => {
  const a = expected.trim().toLowerCase()
  const b = computed.trim().toLowerCase()
  return { ok: a.length === 64 && /^[0-9a-f]+$/.test(a) && a === b }
}

const parseNetboot = (yaml: string, alpine: string) => {
  const blocks = yaml.split(/\n-\s+/)
  const netboot = blocks.find((b) => /flavor:\s*alpine-netboot/.test(b))
  if (!netboot) return undefined
  const version = netboot.match(/version:\s*([\w.]+)/)?.[1]
  const sha = netboot.match(/sha256:\s*([0-9a-f]{64})/i)?.[1]
  if (!version || !sha) return undefined
  return { alpine, version, sha256: sha.toLowerCase(), url: qpuBootUrlOf(alpine, version) }
}

/**
 * Fan-out over the eight ISAs. A digest is never invented.
 * Not allowed: global fetch. Harvest is a lead until a fused QPU fetch is passed.
 */
export async function qpuBootHarvestOf(fetchImpl?: typeof fetch): Promise<{
  requested: number
  ported: number
  pins: { alpine: string; version: string; sha256: string; url: string }[]
  holds: boolean
  live: boolean
  fused: boolean
}> {
  if (!fetchImpl) {
    return {
      requested: QPU_BOOT_ARCHES.length,
      ported: 0,
      pins: [],
      holds: false,
      live: false,
      fused: false,
    }
  }
  const go = fetchImpl
  const pins = (await Promise.all(QPU_BOOT_ARCHES.map(async (a) => {
    try {
      const url = href(`${QPU_BOOT_MIRROR}${a.alpine}/latest-releases.yaml`)
      const yaml = await (await go(url)).text()
      return parseNetboot(yaml, a.alpine)
    } catch {
      return undefined
    }
  }))).filter((p): p is { alpine: string; version: string; sha256: string; url: string } => p != null)
  pins.sort((x, y) => (x.alpine < y.alpine ? -1 : 1))
  return {
    requested: QPU_BOOT_ARCHES.length,
    ported: pins.length,
    pins,
    holds: pins.length === QPU_BOOT_ARCHES.length,
    live: false,
    fused: true,
  }
}

export const qpuBootHolds = (): boolean => {
  const images = qpuImagesOf()
  const compilers = qpuCompilersOf()
  const names = new Set(QPU_BOOT_ARCHES.map((a) => a.alpine))
  const sample = qpuKernelSplitOf(qpuKernelCodeOf(6, 12, 8))
  return (
    QPU_BOOT_ARCHES.length === HANDLE_HEXBITS &&
    QPU_BOOT_PARTS.length === TRINITY &&
    images.length === HANDLE_HEXBITS * TRINITY &&
    compilers.length === HANDLE_HEXBITS &&
    names.size === HANDLE_HEXBITS &&
    sample.major === 6 && sample.minor === 12 && sample.patch === 8 &&
    images.every((i) => new URL(i.url).protocol === 'https:') &&
    qpuSeatOf().seat === 'empty'
  )
}

export const qpuBootOf = () => {
  const images = qpuImagesOf()
  const compilers = qpuCompilersOf()
  return {
    chip: qpuSeatOf(),
    alpine: QPU_BOOT_ARCHES.length,
    parts: QPU_BOOT_PARTS.length,
    images: images.length,
    compilerCount: compilers.length,
    arches: QPU_BOOT_ARCHES.map((a) => a.alpine),
    matrix: QPU_BOOT_ARCHES.map((a) => ({
      alpine: a.alpine,
      triple: a.triple,
      kernel: a.kernel,
      bits: a.bits,
      tarball: qpuBootTarballOf(a.alpine, 'latest'),
      url: qpuBootUrlOf(a.alpine, 'latest'),
      parts: [...QPU_BOOT_PARTS],
    })),
    compilers,
    harvest: 'qpu_boot_harvest',
    holds: qpuBootHolds(),
  }
}
