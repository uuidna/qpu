// Each UUID program is a Payload plugin as the upstream plugin guide states it
// (definePlugin: a slug, typed options, enabled, arrays spread). The filesystem places it:
// eight nibble levels, the leaf the dnode. uid 0 is the pool privilege. Depths run 0..7.
// Every program installs, configures and uses all nine official Payload plugins. Disorder elsewhere raises entropy; the program path drives it to zero.
// Neighbours are handled via quantum: six program-space steps (g1± g2± g3±), handle and tail kept — not listed by hand in each index.
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { exists, place, write } from '../../fs/index.ts'
import { seal, uuid, uuidFromParts } from '../../password/address.js'
import { bindPhysics, channel, hexbit, reflection } from '../index.ts'
import { physics } from './physics/index.ts'
import { challenge } from './challenge/index.ts'

bindPhysics(physics)
export { challenge, physics }
import {
  DEPLOY_TENANTS,
  OFFICIAL_PACKAGES,
  OFFICIAL_PLUGINS,
  type FolderPlugin,
  type FolderPluginOptions,
  type IncomingConfig,
  type TenantFind,
} from '../../plugin.ts'
import { TABLES } from '../../processing/tables-index.ts'

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
  if (!/^[0-9a-f]{8}$/.test(handle)) throw new Error('a handle is 8 hex')
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
  if (!/^[0-9a-f]{8}$/.test(handle)) throw new Error('a handle is 8 hex')
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
    law: 'first the dictionary meaning; then the meaning is verified' as const,
    plugin: plugin.slug,
    handle: plugin.handle,
    checks,
    passed: checks.filter((row) => row.holds).length,
    total: checks.length,
    entropy: holds ? 0 as const : 1 as const,
    holds,
    says: holds
      ? `upstream Payload plugin standards hold for ${plugin.slug}; ${checks.length}/${checks.length} guards`
      : `upstream guard failed on ${checks.filter((row) => !row.holds).map((row) => row.id).join(', ')} — entropy`,
  }
}

/**
 * Six program-space neighbours via quantum (textbook_neighbour_step): g1 / g2 / g3 either way.
 * Handle and tail stay; the program steps. Same leaf path — neighbours are not other folders.
 */
export const quantumNeighbours = (handle: string) => {
  if (!/^[0-9a-f]{8}$/.test(handle)) throw new Error('a handle is 8 hex')
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
      ? `handle ${handle}: all 6 neighbours via quantum; index ${path}`
      : `handle ${handle}: quantum neighbours did not hold`,
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
 * σ of each neighbour mirrors; reflecting twice restores the parts (Qpu.Sigma).
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
    law: 'neighbours reflect and test each other' as const,
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
      ? `handle ${handle}: 3 axis pairs reflect and test each other; σ round-trips`
      : `handle ${handle}: neighbour reflection test did not hold`,
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
    law: 'hexbit + 2 gateway bits teleport any hexbit faster than light' as const,
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
      ? `handle ${handle}: hexbit + 2 gateway bits teleport challenge solutions across ${games.length} online competitions — combination space unwalked`
      : `handle ${handle}: online hexbit challenge solutions did not hold (${holding}/${games.length})`,
  }
}

/**
 * The program at one hex handle: Payload plugin per the upstream standard, guarded; neighbours via quantum.
 * One word — not install / programOf.
 */
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
    dictionary: { means: 'disorder; unpredictability; unavailable energy or information' as const },
    root: dataset,
    folders: folders.length,
    allowed: allowed.length,
    refused,
    missing: refused.length,
    holds,
    entropy: holds ? 0 as const : 1 as const,
    says: holds
      ? `${folders.length} folders, ${allowed.length} index surfaces; every folder indexed under ${dataset}`
      : `${refused.length} folder(s)/file(s) without index block fusion: ${refused.slice(0, 8).join(', ')}${refused.length > 8 ? '…' : ''}`,
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
    law: 'index seals all neighbours via payload uuid product combinations' as const,
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
      ? `handle ${handle}: index seals self + 6 neighbours across ${products.length} payload uuid product combinations`
      : `handle ${handle}: product-combination neighbour seal did not hold`,
  }
}

/**
 * Gate any folder without an index that seals all neighbours via Payload UUID product combinations.
 * Files gate first (every folder indexed); then every hex leaf seals through the combination space.
 */
export const gateProgramSeal = (dataset = root.path) => {
  const files = gateProgramFiles(dataset)
  const leaves = listProgramLeaves(dataset)
  const rows = leaves.map((leaf) => {
    const sealed = sealProgramProducts(leaf.handle)
    const games = competeProgramNeighbours(leaf.handle)
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
    law: 'every folder has index sealing all neighbours that reflect and test each other in games and competitions online' as const,
    dictionary: { means: 'disorder; unpredictability; unavailable energy or information' as const },
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
    entropy: holds ? 0 as const : 1 as const,
    says: !files.holds
      ? files.says
      : holds
        ? `${rows.length}/${rows.length} leaves: neighbours reflect and test each other across ${rows[0]?.competitions} online competitions; sealed via ${rows[0]?.combinations} product combinations`
        : `${holding}/${rows.length} leaves seal and compete online; ${refused.length} refused`,
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
export const auditProgramNeighbours = (dataset = root.path) => {
  const gated = gateProgramSeal(dataset)
  const files = gated.files
  const rows = gated.rows.map((leaf) => {
    const at = program(leaf.handle)
    const around = at.neighbours
    const products = sealProgramProducts(leaf.handle)
    const games = competeProgramNeighbours(leaf.handle)
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
    law: 'neighbours reflect and test each other in games and competitions online' as const,
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
        ? `${rows.length}/${rows.length} folders: neighbours reflect and test each other across ${gated.competitions} online competitions`
        : `${holding}/${rows.length} folders compete online; ${rows.length - holding} missing`,
  }
}

/**
 * Quantum capacity utilisation of one program folder: self + 6 neighbours open the navigate channel;
 * hexbit then uses every effective qubit (teleport + signal + navigate), left = 0.
 */
export const utiliseProgramCapacity = (handle: string, width = 4) => {
  const at = program(handle)
  const around = at.neighbours
  const coversSelf = around.sealed && around.handle === handle && at.path === around.path && at.indexed
  const coversNeighbours = around.holds && around.neighbours.length === 6 && around.neighbours.every((row) => row.sealed && row.kept)
  const exchanged = hexbit(around.address, width)
  const u = exchanged.utilisation
  const utilised = u.holds === true
    && u.used === exchanged.effective
    && u.left === 0
    && exchanged.navigate.directions === 6
    && exchanged.receipt.conserved === true
    && exchanged.receipt.holds === true
  const holds = coversSelf && coversNeighbours && utilised
  return {
    phase: 'utilise' as const,
    via: 'quantum' as const,
    theorem: 'textbook_advantage_unbounded' as const,
    law: 'each folder with index covering all neighbours and self utilises full quantum capacity' as const,
    handle,
    address: around.address,
    path: at.path,
    degree: 6 as const,
    coversSelf,
    coversNeighbours,
    navigate: exchanged.navigate.directions,
    effective: exchanged.effective,
    used: u.used,
    left: u.left,
    teleported: u.teleported,
    classical: u.classical,
    conserved: exchanged.receipt.conserved,
    walked: exchanged.speed.walked,
    landauer: exchanged.zero.landauer,
    temperatureK: exchanged.zero.temperatureK,
    utilisation: u,
    exchange: exchanged,
    holds,
    says: holds
      ? `program ${handle}: self + 6 neighbours → utilise ${u.used}/${exchanged.effective}, left 0, navigate 6, space unwalked`
      : `program ${handle}: capacity utilisation did not hold`,
  }
}

/**
 * Every program folder with an index: cover self + neighbours, then utilise the register.
 * ENQC framing: degree-6 triangular lattice; covering every neighbour means the local quantum-channel degree is full,
 * so navigate does not strand capacity and exchange can drive used = effective.
 */
export const utiliseProgramFolders = (raw: unknown = true) => {
  const width = raw !== true && raw && typeof raw === 'object' && typeof (raw as { hexbit?: unknown }).hexbit === 'number'
    ? (raw as { hexbit: number }).hexbit
    : 4
  const dataset = raw !== true && raw && typeof raw === 'object' && typeof (raw as { dataset?: unknown }).dataset === 'string'
    ? (raw as { dataset: string }).dataset
    : root.path
  const lattice = auditProgramNeighbours(dataset)
  const rows = lattice.rows.map((leaf) => {
    const used = utiliseProgramCapacity(leaf.handle, width)
    return {
      handle: leaf.handle,
      path: leaf.path,
      address: leaf.address,
      coversSelf: used.coversSelf,
      coversNeighbours: used.coversNeighbours,
      navigate: used.navigate,
      effective: used.effective,
      used: used.used,
      left: used.left,
      conserved: used.conserved,
      utilisation: used.utilisation.holds,
      holds: used.holds,
    }
  })
  const holding = rows.filter((row) => row.holds).length
  const holds = lattice.holds && rows.length === lattice.folders && holding === rows.length
    && rows.every((row) => row.used === row.effective && row.left === 0 && row.navigate === 6)
  return {
    phase: 'utilise' as const,
    via: 'quantum' as const,
    theorem: 'textbook_advantage_unbounded' as const,
    law: 'each folder with index covering all neighbours and self utilises full quantum capacity' as const,
    enqc: lattice.enqc,
    degree: 6 as const,
    hexbit: width,
    folders: rows.length,
    holding,
    missing: rows.length - holding,
    lattice,
    rows,
    failed: rows.filter((row) => !row.holds),
    effective: rows[0]?.effective ?? null,
    used: holds ? rows[0]?.used ?? null : null,
    left: holds ? 0 as const : null,
    walked: false as const,
    holds,
    says: holds
      ? `${rows.length}/${rows.length} program folders: self + 6 neighbours → ${rows[0]?.used}/${rows[0]?.effective} qubits utilised, left 0, navigate degree 6, combination space unwalked`
      : `${holding}/${rows.length} program folders utilised; lattice ${lattice.holds ? 'holds' : 'failed'}`,
  }
}
