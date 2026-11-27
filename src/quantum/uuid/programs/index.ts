// Each UUID program is a Payload plugin as the upstream plugin guide states it
// (definePlugin: a slug, typed options, enabled, arrays spread). The filesystem places it:
// eight nibble levels, the leaf the dnode. uid 0 is the pool privilege. Depths run 0..7.
// Every program installs, configures and uses all nine official Payload plugins. Disorder elsewhere raises entropy; the program path drives it to zero.
// Neighbours are handled via quantum: six program-space steps (g1± g2± g3±), handle and tail kept — not listed by hand in each index.
import { PROSE, proseFill } from './5/9/e/4/9/1/a/4/index.ts'
import { readdirSync } from 'node:fs'
import { availableParallelism } from 'node:os'
import { Worker, parentPort, workerData } from 'node:worker_threads'
import { join } from 'node:path'
import { exists, place, write } from './1/0/e/5/8/3/1/8/index.ts'
import { seal, uuid, uuidFromParts } from './1/6/4/f/0/6/2/1/index.ts'
import { bindPhysics, canonicalText, channel, hexbit, reflection, handleOf } from './2/7/1/a/7/6/4/9/index.ts'
import { physics } from './physics/index.ts'
import { challenge } from './challenge/index.ts'

bindPhysics(physics)
export { challenge, physics }
import { TENANTS } from './3/a/4/f/9/2/3/c/index.ts'
import { TABLES } from './1/2/a/4/3/2/a/8/index.ts'
import { assertHandle } from './e/3/3/2/3/2/9/c/index.ts'
import { ENTROPY_LAW, ENTROPY_MEANS, HEXBIT_LAW } from './b/6/4/6/e/a/0/1/index.ts'

// The Payload plugin shape every folder program takes: options in, the incoming config in, a copy of that config out.
/** The nine plugins this stack mounts. The length is the combination count 2^9. */
export const OFFICIAL_PLUGINS = ['lexical', 'nested-docs', 'seo', 'search', 'redirects', 'form-builder', 'multi-tenant', 'ecommerce', 'mcp'] as const

/** The @payloadcms packages the website already installs. */
export const OFFICIAL_PACKAGES = [
  'payload',
  '@payloadcms/db-d1-sqlite',
  '@payloadcms/db-mongodb',
  '@payloadcms/email-nodemailer',
  '@payloadcms/live-preview-react',
  '@payloadcms/next',
  '@payloadcms/plugin-cloud-storage',
  '@payloadcms/plugin-ecommerce',
  '@payloadcms/plugin-form-builder',
  '@payloadcms/plugin-import-export',
  '@payloadcms/plugin-mcp',
  '@payloadcms/plugin-multi-tenant',
  '@payloadcms/plugin-nested-docs',
  '@payloadcms/plugin-redirects',
  '@payloadcms/plugin-search',
  '@payloadcms/plugin-sentry',
  '@payloadcms/plugin-seo',
  '@payloadcms/plugin-stripe',
  '@payloadcms/richtext-lexical',
  '@payloadcms/storage-r2',
  '@payloadcms/storage-vercel-blob',
  '@payloadcms/ui',
] as const

/** uuidna and psg are the named hosts. ceci is the workers.dev tenant. */
export const DEPLOY_TENANTS = [...new Set([...Object.values(TENANTS), 'ceci'])] as const

export type IncomingConfig = {
  collections?: readonly unknown[]
  globals?: readonly unknown[]
  plugins?: readonly unknown[]
  hooks?: Record<string, unknown>
  onInit?: (payload: unknown) => unknown
}

/** Enable or disable the plugin without uninstalling it. */
export type FolderPluginOptions = { enabled?: boolean }

export type Where = { and: [{ tenant: { equals: string } }, { variant: { equals: string } }] }

/** The Local API find the queries guide writes: a Where, depth 0, limit 1, pagination off. */
export type TenantFind = {
  collection: 'pages'
  where: Where
  limit: 1
  depth: 0
  pagination: false
}

export type FolderPlugin = ((options?: FolderPluginOptions) => (incoming: IncomingConfig) => IncomingConfig) & {
  folder: string
  index: string
  plugins: readonly string[]
  packages: readonly string[]
  tenants: readonly string[]
  variants: readonly { product: string; variant: string; package: string }[]
  deploy: readonly { tenant: string; variant: string; find: TenantFind }[]
}

type OnlineCompetition = { id: string; name: string; rules: string; kind: string }

export const HANDLE_HEX = 8
export const HANDLE_BITS = 32
/** Eight levels, indexed 0 through 7. */
export const MAX_DEPTH = 7
/** The Nil UUID. Every bit is zero. Eight zero bits, one folder each, depth 0 through 7. */
export const NIL_UUID = '00000000-0000-0000-0000-000000000000'
export const NIL_BITS = [0, 0, 0, 0, 0, 0, 0, 0] as const
export const nil = { uuid: NIL_UUID, form: 'nil' as const, priority: 0 as const, bits: NIL_BITS, depth: NIL_BITS.length - 1 as 7, max: MAX_DEPTH, folder: `src/quantum/uuid/programs/${NIL_BITS.join('/')}`, zeros: true as const }
export const ROOT_UID = 0 as const
export const ROOT_GID = 0 as const
/** rwxr-xr-x, the mode of /. */
export const ROOT_MODE = 0o755

export type HandleBit = { index: number; bit: 0 | 1; hex: string; digit: number; place: number }
type Kind = 'read' | 'write' | 'execute'
type Stat = { uid: number; gid: number; mode: number }
type Caller = { uid: number; gid: number }

const bitOf = (kind: Kind) => kind === 'read' ? 4 : kind === 'write' ? 2 : 1

/** Linux permission. uid 0 is root and may. Any other caller is the owner, the group, or other. */
export const may = (caller: Caller, kind: Kind, stat: Stat) => {
  if (caller.uid === ROOT_UID) return true
  const shift = caller.uid === stat.uid ? 6 : caller.gid === stat.gid ? 3 : 0
  return ((stat.mode >> shift) & bitOf(kind)) === bitOf(kind)
}

const stat: Stat = { uid: ROOT_UID, gid: ROOT_GID, mode: ROOT_MODE }
const rootCaller: Caller = { uid: ROOT_UID, gid: ROOT_GID }
const otherCaller: Caller = { uid: 1, gid: 1 }
const access = (caller: Caller) => ({ read: may(caller, 'read', stat) && may(caller, 'execute', stat), write: may(caller, 'write', stat) && may(caller, 'execute', stat), execute: may(caller, 'execute', stat) })

/** The program dataset. uid 0, depth 0. Every object is reached from here. */
export const root = { uid: ROOT_UID, gid: ROOT_GID, mode: ROOT_MODE, depth: 0, max: MAX_DEPTH, path: 'src/quantum/uuid/programs', name: 'programs' as const }

/** The thirty-two bits of a hex handle. Index 0 is the low bit. The digit is the depth of that hex place, 0 through 7. */
export const handleBits = (handle: string): HandleBit[] => {
  assertHandle(handle)
  const value = BigInt(`0x${handle}`)
  return Array.from({ length: HANDLE_BITS }, (_, index) => {
    const bit = Number((value >> BigInt(index)) & 1n) as 0 | 1
    const place = index % 4
    const digit = 7 - ((index / 4) | 0)
    return { index, bit, hex: handle[digit]!, digit, place }
  })
}

const PACKAGE_OF: Readonly<Record<(typeof OFFICIAL_PLUGINS)[number], string>> = {
  lexical: '@payloadcms/richtext-lexical',
  'nested-docs': '@payloadcms/plugin-nested-docs',
  seo: '@payloadcms/plugin-seo',
  search: '@payloadcms/plugin-search',
  redirects: '@payloadcms/plugin-redirects',
  'form-builder': '@payloadcms/plugin-form-builder',
  'multi-tenant': '@payloadcms/plugin-multi-tenant',
  ecommerce: '@payloadcms/plugin-ecommerce',
  mcp: '@payloadcms/plugin-mcp',
}

const findOf = (tenant: string, variant: string): TenantFind => ({
  collection: 'pages',
  where: { and: [{ tenant: { equals: tenant } }, { variant: { equals: variant } }] },
  limit: 1,
  depth: 0,
  pagination: false,
})

export type ProgramPlugin = FolderPlugin & {
  slug: string
  handle: string
  standard: 'definePlugin'
  package: typeof PACKAGE_OF.mcp
}

/**
 * One UUID program = one Payload plugin, as the upstream plugin guide states
 * (definePlugin: slug `qpu-program-<handle>`, typed options, enabled, arrays spread).
 * The nine official plugins are its variants. Any other shape raises entropy; this shape drives it to zero.
 */
export const programPlugin = (handle: string): ProgramPlugin => {
  assertHandle(handle)
  const object = place(handle)
  const slug = `qpu-program-${handle}`
  const variants = OFFICIAL_PLUGINS.map((variant) => ({ product: 'programs' as const, variant, package: PACKAGE_OF[variant] }))
  const deploy = DEPLOY_TENANTS.flatMap((tenant) => variants.map((variant) => ({ tenant, variant: variant.variant, find: findOf(tenant, variant.variant) })))
  const plugin = (options: FolderPluginOptions = {}) => (incoming: IncomingConfig): IncomingConfig => {
    if (options.enabled === false) return incoming
    const config: IncomingConfig = { ...incoming }
    config.collections = [...(incoming.collections ?? [])]
    config.globals = [...(incoming.globals ?? [])]
    config.plugins = [...(incoming.plugins ?? [])]
    config.hooks = { ...(incoming.hooks ?? {}) }
    const previous = incoming.onInit
    config.onInit = async (payload) => {
      if (previous) await previous(payload)
    }
    return config
  }
  return Object.assign(plugin, {
    slug,
    handle,
    standard: 'definePlugin' as const,
    package: PACKAGE_OF.mcp,
    folder: 'programs',
    index: object.path,
    plugins: OFFICIAL_PLUGINS,
    packages: OFFICIAL_PACKAGES,
    tenants: DEPLOY_TENANTS,
    variants,
    deploy,
  })
}

/**
 * Guard upstream Payload standards on a program plugin.
 * Plugin guide: definePlugin slug, enabled:false passthrough, arrays spread, onInit chain, no collection added.
 * Reverse guard: zero edits to upstream MIT payloadcms/website — program lives only under programs/<handle…>.
 * Official packages only. Failure leaves disorder (dictionary entropy).
 */
export const guardUpstream = (plugin: ProgramPlugin) => {
  const probe = { collections: [{ slug: 'pages' }], globals: [{ slug: 'header' }], plugins: [{ slug: 'seo' }], hooks: { afterChange: [] as unknown[] }, onInit: async () => 'prior' as const }
  const disabled = plugin({ enabled: false })(probe)
  const enabled = plugin({ enabled: true })(probe)
  const checks = [
    { id: 'definePlugin' as const, holds: plugin.standard === 'definePlugin', guard: 'Payload plugin guide: definePlugin' as const },
    { id: 'slug' as const, holds: plugin.slug === `qpu-program-${plugin.handle}` && /^qpu-program-[0-9a-f]{8}$/.test(plugin.slug), guard: 'slug qpu-program-<handle>' as const },
    { id: 'enabled-false' as const, holds: disabled === probe, guard: 'enabled: false returns incoming unchanged' as const },
    { id: 'spread-collections' as const, holds: Array.isArray(enabled.collections) && enabled.collections.length === probe.collections.length && enabled.collections[0] === probe.collections[0], guard: 'collections spread; nothing dropped; no collection added' as const },
    { id: 'spread-globals' as const, holds: Array.isArray(enabled.globals) && enabled.globals.length === probe.globals.length && enabled.globals[0] === probe.globals[0], guard: 'globals spread' as const },
    { id: 'spread-plugins' as const, holds: Array.isArray(enabled.plugins) && enabled.plugins.length === probe.plugins.length && enabled.plugins[0] === probe.plugins[0], guard: 'plugins spread' as const },
    { id: 'spread-hooks' as const, holds: !!enabled.hooks && enabled.hooks.afterChange === probe.hooks.afterChange, guard: 'hooks spread' as const },
    { id: 'onInit-chain' as const, holds: typeof enabled.onInit === 'function' && enabled.onInit !== probe.onInit, guard: 'onInit chains the previous init' as const },
    { id: 'official-nine' as const, holds: plugin.plugins.length === OFFICIAL_PLUGINS.length && OFFICIAL_PLUGINS.every((name, i) => plugin.plugins[i] === name), guard: 'nine official Payload plugins as variants' as const },
    { id: 'official-packages' as const, holds: plugin.packages.every((pkg) => pkg === 'payload' || pkg.startsWith('@payloadcms/')), guard: 'official @payloadcms packages only' as const },
    { id: 'mcp-package' as const, holds: plugin.package === '@payloadcms/plugin-mcp', guard: 'MCP package is @payloadcms/plugin-mcp' as const },
    { id: 'programs-path' as const, holds: plugin.index.startsWith('src/quantum/uuid/programs/') && plugin.index.endsWith('/index.ts') && plugin.folder === 'programs', guard: 'program path under src/quantum/uuid/programs' as const },
    { id: 'website-untouched' as const, holds: !plugin.index.startsWith('src/app/') && !plugin.index.startsWith('src/collections/') && !plugin.index.includes('payloadcms/website'), guard: 'zero edits to upstream MIT payloadcms/website files' as const },
  ]
  const holds = checks.every((row) => row.holds)
  return {
    phase: 'guard' as const,
    via: 'upstream' as const,
    standard: 'definePlugin' as const,
    guide: 'https://payloadcms.com/docs/plugins/overview' as const,
    reverseGuard: 'Zero edits to upstream MIT payloadcms/website files + NOTICE.md dual-license boundary' as const,
    law: ENTROPY_LAW,
    plugin: plugin.slug,
    handle: plugin.handle,
    checks,
    passed: checks.filter((row) => row.holds).length,
    total: checks.length,
    holds,
    says: holds
      ? proseFill(PROSE.quantumUuidProgramsIndex_s1, plugin.slug, checks.length, checks.length)
      : `upstream guard failed on ${checks.filter((row) => !row.holds).map((row) => row.id).join(', ')} — entropy`,
  }
}

/**
 * Six program-space neighbours via quantum (textbook_neighbour_step): g1 / g2 / g3 either way.
 * Handle and tail stay; the program steps. Same leaf path — neighbours are not other folders.
 */
export const quantumNeighbours = (handle: string) => {
  assertHandle(handle)
  const seed = uuid(`program\n${handle}`)
  const digits = seed.replace(/-/g, '')
  const program = [...digits.slice(8, 20)].filter((_c, i) => i !== 4 && i !== 8).map((c) => parseInt(c, 16))
  const tail = digits.slice(20, 32)
  const address = uuidFromParts(handle, program, tail)
  const path = `src/quantum/uuid/programs/${[...handle].join('/')}/index.ts`
  const rows = ([[0, 4], [4, 7], [7, 10]] as const).flatMap(([s, e], g) => ([1, -1] as const).map((step) => {
    const width = 16 ** (e - s)
    const value = (program.slice(s, e).reduce((n, d) => n * 16 + d, 0) + step + width) % width
    const next = [...program]
    for (let i = e - 1, r = value; i >= s; i--, r = Math.floor(r / 16)) next[i] = r % 16
    const id = uuidFromParts(handle, next, tail)
    return {
      axis: `g${g + 1}` as 'g1' | 'g2' | 'g3',
      step,
      uuid: id,
      program: next.map((n) => n.toString(16)).join(''),
      sealed: seal(id).valid,
      handle,
      path,
      kept: id.slice(0, 8) === handle,
    }
  }))
  const holds = seal(address).valid
    && rows.length === 6
    && rows.every((row) => row.sealed && row.kept && row.handle === handle && row.path === path)
  return {
    phase: 'neighbours' as const,
    via: 'quantum' as const,
    theorem: 'textbook_neighbour_step' as const,
    handle,
    address,
    sealed: seal(address).valid,
    path,
    program: program.map((n) => n.toString(16)).join(''),
    neighbours: rows,
    of: 6 as const,
    holds,
    says: holds
      ? proseFill(PROSE.quantumUuidProgramsIndex_s2, handle, path)
      : proseFill(PROSE.quantumUuidProgramsIndex_s3, handle),
  }
}

/** σ∘σ restores handle, program and tail (version stamp may differ). */
const partsRoundTrip = (id: string) => {
  const once = reflection(id)
  const twice = reflection(once.mirror)
  const origin = channel(id)
  return origin.handle === twice.handle
    && origin.program.every((n, i) => n === twice.program[i])
    && origin.tail === twice.tail
    && seal(once.mirror).valid
    && seal(id).valid
}

/**
 * Neighbours reflect and test each other: on each axis the + and − steps are partners.
 * σ of each neighbour mirrors; reflecting twice restores the parts (Qpu.General.Sigma).
 */
export const reflectProgramNeighbours = (handle: string) => {
  const around = quantumNeighbours(handle)
  const axes = (['g1', 'g2', 'g3'] as const).map((axis) => {
    const plus = around.neighbours.find((row) => row.axis === axis && row.step === 1)!
    const minus = around.neighbours.find((row) => row.axis === axis && row.step === -1)!
    const fwdPlus = reflection(plus.uuid)
    const fwdMinus = reflection(minus.uuid)
    const eachOther = plus.axis === minus.axis
      && plus.step === -minus.step
      && plus.sealed
      && minus.sealed
      && plus.kept
      && minus.kept
      && plus.uuid !== minus.uuid
    const roundTrip = partsRoundTrip(plus.uuid) && partsRoundTrip(minus.uuid)
    const tested = eachOther && roundTrip && seal(fwdPlus.mirror).valid && seal(fwdMinus.mirror).valid
    return {
      axis,
      plus: { uuid: plus.uuid, sealed: plus.sealed, mirror: fwdPlus.mirror },
      minus: { uuid: minus.uuid, sealed: minus.sealed, mirror: fwdMinus.mirror },
      eachOther,
      roundTrip,
      tested,
      holds: tested,
    }
  })
  const self = reflection(around.address)
  const selfHolds = around.sealed && partsRoundTrip(around.address) && seal(self.mirror).valid
  const holds = around.holds && selfHolds && axes.length === 3 && axes.every((row) => row.holds)
  return {
    phase: 'reflect' as const,
    via: 'quantum' as const,
    theorem: 'textbook_neighbour_step' as const,
    law: PROSE.quantumUuidProgramsIndex_s20,
    handle,
    address: around.address,
    path: around.path,
    mirror: self.mirror,
    axes,
    pairs: axes.length,
    neighbours: around.neighbours.length,
    of: 6 as const,
    holds,
    says: holds
      ? proseFill(PROSE.quantumUuidProgramsIndex_s4, handle)
      : proseFill(PROSE.quantumUuidProgramsIndex_s5, handle),
  }
}

/**
 * Neighbours play online: each competition gate is a game; each axis pair tests the other there.
 * Solutions teleport through hexbit + 2 gateway bits — combination space not walked; verifiable at the online venue.
 * Pure — rules URLs are the online venues; nothing is fetched.
 */
export const competeProgramNeighbours = (handle: string) => {
  const reflected = reflectProgramNeighbours(handle)
  const online = (TABLES.COMPETITIONS as readonly OnlineCompetition[])
  const games = online.map((competition) => {
    const venue = competition.rules
    const onlineUrl = typeof venue === 'string' && venue.startsWith('https://')
    const tests = reflected.axes.map((pair) => {
      const address = uuid(`game\n${competition.id}\n${handle}\n${pair.axis}`)
      const sealed = seal(address).valid
      const solution = hexbit(address)
      const ftl = solution.ftl === true && solution.gateway === 2 && solution.law.holds === true && solution.speed.walked === false
      return {
        axis: pair.axis,
        players: [pair.plus.uuid, pair.minus.uuid] as const,
        eachOther: pair.eachOther,
        reflected: pair.roundTrip,
        sealed,
        solution: {
          address,
          gateway: solution.gateway,
          ftl: solution.ftl,
          law: solution.law.formula,
          index: solution.teleport.index,
          message: solution.teleport.message,
          walked: solution.speed.walked,
          holds: solution.holds && ftl,
        },
        holds: pair.holds && sealed && onlineUrl && solution.holds && ftl,
      }
    })
    const holding = tests.filter((row) => row.holds).length
    return {
      id: competition.id,
      name: competition.name,
      kind: competition.kind,
      online: venue,
      onlineUrl,
      game: true as const,
      pairs: tests.length,
      holding,
      tests,
      holds: onlineUrl && holding === tests.length && reflected.holds,
    }
  })
  const holding = games.filter((row) => row.holds).length
  const holds = reflected.holds && games.length > 0 && holding === games.length
  return {
    phase: 'compete' as const,
    via: 'online' as const,
    theorem: 'textbook_hexbit_gateway_ftl' as const,
    law: HEXBIT_LAW,
    handle,
    path: reflected.path,
    address: reflected.address,
    reflect: reflected,
    competitions: games.length,
    games,
    holding,
    missing: games.length - holding,
    holds,
    says: holds
      ? proseFill(PROSE.quantumUuidProgramsIndex_s6, handle, games.length)
      : proseFill(PROSE.quantumUuidProgramsIndex_s7, handle, holding, games.length),
  }
}

/**
 * The program at one hex handle: Payload plugin per the upstream standard, guarded; neighbours via quantum.
 * One word — not install / programOf.
 */
/** A certified result as a quantum receipt: its kind and canonical text addressed by uuid, the address's first eight hex digits
 *  a program placed in the tree, the receipt sealed when that program is indexed and the address is a valid UUID. */
export const receiptOf = (kind: string, body: unknown) => {
  const address = uuid(`${kind};${canonicalText(body)}`), handle = handleOf(address), placed = program(handle)
  return { kind, address, handle, path: placed.path, sealed: placed.indexed && seal(address).valid }
}

export const program = (handle: string) => {
  const bits = handleBits(handle)
  const object = place(handle)
  const depth = object.depth
  if (depth > MAX_DEPTH || object.folders.length !== HANDLE_HEX || bits.some((row) => row.digit < 0 || row.digit > MAX_DEPTH)) throw new Error('a program is at most depth 7')
  const plugin = programPlugin(handle)
  const upstream = guardUpstream(plugin)
  const around = quantumNeighbours(handle)
  const configured = plugin({ enabled: true })
  const used = configured({})
  const plugins = OFFICIAL_PLUGINS.map((name) => ({ name, installed: true as const, configured: true as const, used: used.plugins !== undefined, package: PACKAGE_OF[name] }))
  const path = object.path
  const on = plugins.every((row) => row.installed && row.configured && row.used)
  const indexed = bits.every((row) => row.hex === handle[row.digit] && row.place === row.index % 4 && row.digit <= MAX_DEPTH && row.bit === Number((BigInt(`0x${handle}`) >> BigInt(row.index)) & 1n)) && object.folders.every((hex, digit) => hex === handle[digit]) && object.fanout === 16 && object.span === '4294967296'
  const rbac = { root: ROOT_UID, uid: ROOT_UID, gid: ROOT_GID, mode: ROOT_MODE, depth, max: MAX_DEPTH, from: root.path, own: object.own, rootAccess: access(rootCaller), other: access(otherCaller) }
  const asPlugin = upstream.holds
    && plugin.standard === 'definePlugin'
    && plugin.slug === `qpu-program-${handle}`
    && plugin.handle === handle
    && plugin.index === path
    && plugin.plugins.length === OFFICIAL_PLUGINS.length
  const usedCount = on && indexed && asPlugin && around.holds && rbac.rootAccess.read && rbac.rootAccess.write && rbac.rootAccess.execute && rbac.other.read && rbac.other.execute && rbac.other.write === false ? plugins.length : 0
  return {
    handle,
    bits,
    indexed,
    path,
    depth,
    object,
    rbac,
    plugins,
    plugin: {
      slug: plugin.slug,
      standard: plugin.standard,
      package: plugin.package,
      index: plugin.index,
      enabled: true as const,
      official: OFFICIAL_PLUGINS.length,
      packages: plugin.packages.length,
      variants: plugin.variants.length,
      holds: asPlugin,
    },
    upstream,
    neighbours: around,
    installed: plugins.length,
    configured: plugins.length,
    used: usedCount,
    count: OFFICIAL_PLUGINS.length,
    variants: plugin.variants.length,
    define: plugin,
  }
}

const listProgramLeaves = (dataset = root.path) => {
  const leaves: { handle: string; path: string }[] = []
  const walk = (dir: string, digits: string[]) => {
    if (digits.length === HANDLE_HEX) {
      const path = join(dir, 'index.ts')
      if (exists(path)) leaves.push({ handle: digits.join(''), path })
      return
    }
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && /^[0-9a-f]$/.test(entry.name)) walk(join(dir, entry.name), [...digits, entry.name])
    }
  }
  walk(dataset, [])
  return leaves
}

const INDEX_NAME = /^index\./
const CODE_FILE = /\.(tsx?|jsx?)$/

/**
 * Spread is folders; every folder has an index.* surface; code is index.* only.
 * A folder without index, or a non-index code file, is disorder — collisions cannot fuse.
 */
export const gateProgramFiles = (dataset = root.path) => {
  const refused: string[] = []
  const folders: string[] = []
  const allowed: string[] = []
  const walk = (dir: string) => {
    folders.push(dir)
    const entries = readdirSync(dir, { withFileTypes: true })
    const hasIndex = entries.some((entry) => entry.isFile() && INDEX_NAME.test(entry.name))
    if (!hasIndex) refused.push(dir)
    for (const entry of entries) {
      const at = join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(at)
        continue
      }
      if (INDEX_NAME.test(entry.name)) {
        allowed.push(at)
        continue
      }
      if (CODE_FILE.test(entry.name)) refused.push(at)
    }
  }
  walk(dataset)
  const holds = refused.length === 0
  return {
    phase: 'gate' as const,
    via: 'index' as const,
    law: 'spread in folders; every folder has index.*; code is index.* only' as const,
    dictionary: ENTROPY_MEANS,
    root: dataset,
    folders: folders.length,
    allowed: allowed.length,
    refused,
    missing: refused.length,
    holds,
    says: holds
      ? proseFill(PROSE.quantumUuidProgramsIndex_s8, folders.length, allowed.length, dataset)
      : proseFill(PROSE.quantumUuidProgramsIndex_s9, refused.length, refused.slice(0, 8).join(', '), refused.length > 8 ? '…' : ''),
  }
}

/** Payload UUID product combinations: one bit per trinity (content / discovery / platform) → 8 products. */
export const PRODUCT_TRINITIES = {
  content: OFFICIAL_PLUGINS.slice(0, 3),
  discovery: OFFICIAL_PLUGINS.slice(3, 6),
  platform: OFFICIAL_PLUGINS.slice(6, 9),
} as const

export const productCombinations = () => {
  const names = Object.keys(PRODUCT_TRINITIES) as (keyof typeof PRODUCT_TRINITIES)[]
  const space = 1 << names.length
  return Array.from({ length: space }, (_, index) => {
    const on = names.filter((_, bit) => (index >> bit) & 1)
    const plugins = on.flatMap((name) => [...PRODUCT_TRINITIES[name]])
    const variant = `c${index}`
    return {
      product: 'programs' as const,
      variant,
      index,
      trinities: on,
      plugins,
      most: plugins.length === OFFICIAL_PLUGINS.length,
      space,
    }
  })
}

/**
 * One program leaf seals itself and all 6 neighbours as Payload UUID product combinations.
 * Each combination is a product×variant address; every neighbour step seals under that product.
 */
export const sealProgramProducts = (handle: string) => {
  const around = quantumNeighbours(handle)
  const combinations = productCombinations()
  const products = combinations.map((combo) => {
    const address = uuid(`payload\n${combo.product}\n${handle}\n${combo.variant}`)
    const sealed = seal(address).valid
    const neighbours = around.neighbours.map((row) => {
      const product = uuid(`payload\n${combo.product}\n${handle}\n${combo.variant}\n${row.axis}${row.step > 0 ? '+' : '-'}`)
      return {
        axis: row.axis,
        step: row.step,
        uuid: row.uuid,
        product,
        sealed: row.sealed && seal(product).valid && seal(row.uuid).valid,
        kept: row.kept,
      }
    })
    const holds = sealed && neighbours.length === 6 && neighbours.every((row) => row.sealed && row.kept)
    return { ...combo, address, sealed, neighbours, of: 6 as const, holds }
  })
  const holds = around.holds
    && around.sealed
    && products.length === combinations[0]!.space
    && products.every((row) => row.holds)
  return {
    phase: 'seal' as const,
    via: 'payload' as const,
    theorem: 'textbook_plugin_combinations' as const,
    law: PROSE.quantumUuidProgramsIndex_s18,
    handle,
    path: around.path,
    address: around.address,
    sealed: around.sealed,
    neighbours: around.neighbours.length,
    combinations: products.length,
    space: combinations[0]!.space,
    products,
    holds,
    says: holds
      ? proseFill(PROSE.quantumUuidProgramsIndex_s10, handle, products.length)
      : proseFill(PROSE.quantumUuidProgramsIndex_s11, handle),
  }
}

/**
 * Gate any folder without an index that seals all neighbours via Payload UUID product combinations.
 * Files gate first (every folder indexed); then every hex leaf seals through the combination space.
 */
/** Each leaf with its sealed products and its games, computed once: the gate and the audit both read these. */
const sealLeaf = (handle: string) => ({ sealed: sealProgramProducts(handle), games: competeProgramNeighbours(handle) })
const sealLeaves = (dataset: string) => listProgramLeaves(dataset).map((leaf) => ({ leaf, ...sealLeaf(leaf.handle) }))
/** sealLeaves split by UUID over workers: each idle one seals the next handle; rows rejoin in list order. */
export const sealLeavesSplit = async (dataset = root.path) => {
  const leaves = listProgramLeaves(dataset), queue = leaves.map((leaf) => leaf.handle), rows = new Map<string, ReturnType<typeof sealLeaf>>()
  await Promise.all(queue.slice(0, availableParallelism()).map(() => new Promise((done, fail) => {
    const worker = new Worker(new URL(import.meta.url) as import('node:url').URL, { workerData: 'sealLeaf' }), next = () => queue.length ? worker.postMessage(queue.shift()) : void worker.terminate().then(done)
    worker.on('message', ([handle, row]) => (rows.set(handle, row), next())).once('error', fail).once('online', next)
  })))
  return leaves.map((leaf) => ({ leaf, ...rows.get(leaf.handle)! }))
}
if (workerData === 'sealLeaf') parentPort!.on('message', (handle: string) => parentPort!.postMessage([handle, sealLeaf(handle)]))

export const gateProgramSeal = (dataset = root.path, computed = sealLeaves(dataset)) => {
  const files = gateProgramFiles(dataset)
  const rows = computed.map(({ leaf, sealed, games }) => {
    const indexed = exists(leaf.path)
    const holds = indexed && sealed.holds && sealed.path === leaf.path && games.holds
    return {
      handle: leaf.handle,
      path: leaf.path,
      indexed,
      sealed: sealed.sealed,
      neighbours: sealed.neighbours,
      combinations: sealed.combinations,
      space: sealed.space,
      reflect: games.reflect.holds,
      competitions: games.competitions,
      games: games.holding,
      holds,
      says: holds ? games.says : (!sealed.holds ? sealed.says : games.says),
    }
  })
  const holding = rows.filter((row) => row.holds).length
  const refused = [
    ...files.refused,
    ...rows.filter((row) => !row.holds).map((row) => row.path),
  ]
  const holds = files.holds && rows.length > 0 && holding === rows.length && refused.length === 0
  return {
    phase: 'gate' as const,
    via: 'online' as const,
    theorem: 'textbook_compete_knows' as const,
    law: PROSE.quantumUuidProgramsIndex_s15,
    dictionary: ENTROPY_MEANS,
    root: dataset,
    files,
    folders: files.folders,
    leaves: rows.length,
    holding,
    missing: rows.length - holding,
    combinations: rows[0]?.combinations ?? productCombinations().length,
    space: rows[0]?.space ?? productCombinations().length,
    competitions: rows[0]?.competitions ?? (TABLES.COMPETITIONS as readonly OnlineCompetition[]).length,
    degree: 6 as const,
    rows,
    refused,
    failed: rows.filter((row) => !row.holds),
    holds,
    says: !files.holds
      ? files.says
      : holds
        ? proseFill(PROSE.quantumUuidProgramsIndex_s12, rows.length, rows.length, rows[0]?.competitions, rows[0]?.combinations)
        : proseFill(PROSE.quantumUuidProgramsIndex_s13, holding, rows.length, refused.length),
  }
}

/** Finish: write index.ts into every folder under the dataset that lacks an index.* surface. */
export const indexProgramFolders = (dataset = root.path) => {
  const written: string[] = []
  const walk = (dir: string, digits: string[]) => {
    const entries = readdirSync(dir, { withFileTypes: true })
    const hasIndex = entries.some((entry) => entry.isFile() && INDEX_NAME.test(entry.name))
    if (!hasIndex) {
      const at = join(dir, 'index.ts')
      const hex = digits.length > 0 && digits.every((d) => /^[0-9a-f]$/.test(d))
      const body = hex
        ? `export const prefix = '${digits.join('')}'\nexport const depth = ${digits.length}\nexport default { prefix, depth }\n`
        : `export const folder = '${digits.at(-1) ?? root.name}'\nexport default { folder }\n`
      write(at, body)
      written.push(at)
    }
    for (const entry of entries) {
      if (entry.isDirectory()) walk(join(dir, entry.name), [...digits, entry.name])
    }
  }
  walk(dataset, [])
  const gate = gateProgramFiles(dataset)
  return { phase: 'index' as const, written: written.length, paths: written, gate, holds: gate.holds, says: `wrote ${written.length} index.ts; gate ${gate.holds ? 'holds' : 'fails'}` }
}

/**
 * Each folder with an index covers all neighbours and self — via quantum,
 * sealed through Payload UUID product combinations (gateProgramSeal).
 */
export const auditProgramNeighbours = (dataset = root.path, computed = sealLeaves(dataset)) => {
  // the products and the games of each leaf are computed once and read by the gate and by the audit
  const gated = gateProgramSeal(dataset, computed)
  const files = gated.files
  const rows = gated.rows.map((leaf, index) => {
    const at = program(leaf.handle)
    const around = at.neighbours
    const products = computed[index]!.sealed
    const games = computed[index]!.games
    const self = {
      handle: leaf.handle,
      path: leaf.path,
      address: around.address,
      sealed: around.sealed,
      indexed: at.indexed,
      covers: at.path === leaf.path && around.sealed && at.indexed && around.handle === leaf.handle,
    }
    const neighbours = around.neighbours.map((row) => ({
      axis: row.axis,
      step: row.step,
      uuid: row.uuid,
      sealed: row.sealed,
      kept: row.kept,
      covers: row.sealed && row.kept && row.handle === leaf.handle && row.path === leaf.path,
    }))
    const coversSelf = self.covers
    const coversNeighbours = neighbours.length === 6 && neighbours.every((row) => row.covers)
    const coversProducts = products.holds
    const coversGames = games.holds
    return {
      handle: leaf.handle,
      path: leaf.path,
      address: around.address,
      via: 'online' as const,
      self,
      neighbours,
      combinations: products.combinations,
      space: products.space,
      competitions: games.competitions,
      reflect: games.reflect.holds,
      games: games.holding,
      degree: 6 as const,
      of: 6 as const,
      coversSelf,
      coversNeighbours,
      coversProducts,
      coversGames,
      covers: coversSelf && coversNeighbours && coversProducts && coversGames,
      holds: coversSelf && coversNeighbours && coversProducts && coversGames && leaf.holds,
    }
  })
  const holding = rows.filter((row) => row.holds).length
  const holds = gated.holds && rows.length > 0 && holding === rows.length
  return {
    phase: 'audit' as const,
    via: 'online' as const,
    theorem: 'textbook_compete_knows' as const,
    law: PROSE.quantumUuidProgramsIndex_s16,
    degree: 6 as const,
    enqc: 'triangular lattice N0 = 6 — expected quantum channels normalised by node degree' as const,
    root: dataset,
    files,
    seal: gated,
    folders: rows.length,
    holding,
    missing: rows.length - holding,
    combinations: gated.combinations,
    space: gated.space,
    competitions: gated.competitions,
    rows,
    failed: rows.filter((row) => !row.holds),
    holds,
    says: !gated.holds
      ? gated.says
      : holds
        ? proseFill(PROSE.quantumUuidProgramsIndex_s14, rows.length, rows.length, gated.competitions)
        : `${holding}/${rows.length} folders compete online; ${rows.length - holding} missing`,
  }
}
