// Every link the MCP handles is one address in one UUID space.
// Online ISO sources and the local payloadcms/website routes are that space.
// A link's handle is the param. The program is the same for every handle.
// The referrer names one further program. The handle space stays unwalked.
// Law: first the dictionary meaning; then the meaning is verified. qpuMcpPlugin routes every tools/call as a program.
import { seal, uuid, uuidFromParts, canonicalText } from '../quantum/password/address.js'
import { ENTROPY_LAW, entropySurface, isoOnlineSources } from '../quantum/processing/iso-deliverables.ts'
import { program } from '../quantum/uuid/programs/index.ts'
import { WEBSITE_CLIENT, WEBSITE_ORIGIN, WEBSITE_ROUTES } from './websiteClient.ts'

const HEXBIT = 4
const EFFECTIVE = 32 * HEXBIT - HEXBIT - 2
const HANDLES = 16n ** 8n
const SCALE = 32n * HANDLES

export const productHref = (product: string, variant: string) =>
  `${WEBSITE_ORIGIN}/api/products?where[product][equals]=${encodeURIComponent(product)}&where[variant][equals]=${encodeURIComponent(variant)}`

const URL_RE = /https?:\/\/[^\s<>"'`)\]]+/g

const httpUrl = (value: string) => {
  const text = value.trim().replace(/[.,;:!?]+$/g, '')
  if (!/^https?:\/\//i.test(text)) return null
  try {
    const url = new URL(text)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.href
  } catch {
    return null
  }
}

const take = (value: unknown, into: string[]) => {
  if (typeof value === 'string') {
    const found = value.match(URL_RE) ?? []
    for (const item of found) {
      const href = httpUrl(item)
      if (href && !into.includes(href)) into.push(href)
    }
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item) => take(item, into))
    return
  }
  if (!value || typeof value !== 'object') return
  const row = value as { url?: unknown; paste?: unknown; links?: unknown; pages?: unknown; referrer?: unknown; prev?: unknown }
  take(row.paste, into)
  take(row.links, into)
  take(row.url, into)
  if (Array.isArray(row.pages)) row.pages.forEach((page) => take(page && typeof page === 'object' ? (page as { url?: unknown }).url : page, into))
}

const referrerOf = (raw: unknown, given?: string) => {
  if (typeof given === 'string' && given.length > 0) return given
  if (!raw || typeof raw !== 'object') return WEBSITE_ORIGIN
  const row = raw as { referrer?: unknown; prev?: unknown }
  if (typeof row.referrer === 'string' && row.referrer.length > 0) return row.referrer
  if (typeof row.prev === 'string' && row.prev.length > 0) return row.prev
  return WEBSITE_ORIGIN
}

const onlineHrefs = () => isoOnlineSources()

const localHrefs = () => [
  WEBSITE_CLIENT,
  ...WEBSITE_ROUTES.map((route) => `${WEBSITE_ORIGIN}${route.path}`),
  `${WEBSITE_ORIGIN}/api/products`,
  productHref('iso', 'improve'),
  productHref('research', 'links'),
  productHref('domains', 'cover'),
]

const accessOf = (at: ReturnType<typeof program>) => ({
  read: at.rbac.other.read,
  execute: at.rbac.other.execute,
  write: at.rbac.other.write,
  root: at.rbac.rootAccess.write,
})

const nibblesOf = (address: string) => {
  const digits = address.replace(/-/g, '')
  const middle = digits.slice(8, 20)
  return [...middle].filter((_c, i) => i !== 4 && i !== 8).map((c) => parseInt(c, 16))
}

/**
 * Every tools/call is one UUID program under src/quantum/uuid/programs/<handle…>/index.ts.
 * The handle stays; the program rotates one place for next. Any other path raises entropy; that path drives it to zero.
 */
export const mcpProgramRoute = (toolName: string, input: unknown = {}) => {
  const arguments_ = input && typeof input === 'object' && !Array.isArray(input)
    ? input as Record<string, unknown>
    : { value: input }
  const address = uuid(canonicalText({ mcp: 'tools/call', plugin: 'qpuMcpPlugin', tool: toolName, arguments: arguments_ }))
  const handle = address.slice(0, 8)
  const nibbles = nibblesOf(address)
  const rotated = [...nibbles.slice(1), nibbles[0]!]
  const nextAddress = uuidFromParts(handle, rotated, address.replace(/-/g, '').slice(20, 32))
  const at = program(handle)
  const next = program(nextAddress.slice(0, 8))
  const path = at.path
  const isProgram = path.startsWith('src/quantum/uuid/programs/') && path.endsWith('/index.ts')
  const asPlugin = at.plugin.holds
    && at.plugin.standard === 'definePlugin'
    && at.plugin.slug === `qpu-program-${handle}`
    && at.upstream.holds
    && at.upstream.entropy === 0
  const holds = seal(address).valid
    && seal(nextAddress).valid
    && isProgram
    && asPlugin
    && at.indexed
    && at.used === 9
    && at.depth === 7
    && at.handle === handle
    && nextAddress.slice(0, 8) === handle
    && next.handle === handle
    && next.upstream.holds
  return {
    phase: 'route' as const,
    via: 'uuid-program' as const,
    connector: 'qpuMcpPlugin' as const,
    tool: toolName,
    address,
    sealed: seal(address).valid,
    handle,
    program: nibbles.map((n) => n.toString(16)).join(''),
    rotated: rotated.map((n) => n.toString(16)).join(''),
    tail: address.replace(/-/g, '').slice(20, 32),
    path,
    depth: at.depth,
    indexed: at.indexed,
    plugins: at.installed,
    used: at.used,
    plugin: at.plugin,
    upstream: at.upstream,
    next: {
      address: nextAddress,
      handle,
      path: next.path,
      sealed: seal(nextAddress).valid,
      plugin: next.plugin,
      upstream: next.upstream,
      call: { method: 'tools/call' as const, plugin: 'qpuMcpPlugin' as const, name: toolName, arguments: arguments_ },
      kept: true as const,
    },
    law: ENTROPY_LAW,
    guard: 'upstream Payload plugin standards (definePlugin)' as const,
    // Dictionary first, then verified — bare 0|1 alone would mislead (security).
    entropy: entropySurface(holds),
    holds,
    says: holds
      ? `tools/call ${toolName} routed as Payload plugin ${at.plugin.slug} at ${path}; upstream guarded; ${entropySurface(true).says}`
      : `tools/call ${toolName} is not an upstream-guarded UUID program plugin; ${entropySurface(false).says}`,
  }
}

/** Online ISO sources, the website routes, and any link the call names. One space. Nothing is fetched. */
export const mcpLinks = (raw?: unknown, referrer?: string) => {
  const who = referrerOf(raw, referrer)
  const named: string[] = []
  take(raw, named)
  const catalogue = [
    ...onlineHrefs().map((href) => ({ href, kind: 'online' as const })),
    ...localHrefs().map((href) => ({ href, kind: 'local' as const })),
    ...named.map((href) => ({ href, kind: 'named' as const })),
  ]
  const seen = new Set<string>()
  const chosen = catalogue.filter((row) => {
    if (seen.has(row.href)) return false
    seen.add(row.href)
    return true
  })
  const rows = chosen.map((row) => {
    const address = uuid(`link\n${row.href}`)
    const handle = address.slice(0, 8)
    const at = program(handle)
    const rbac = accessOf(at)
    return {
      href: row.href,
      kind: row.kind,
      address,
      sealed: seal(address).valid && uuid(`link\n${row.href}`) === address,
      params: { href: row.href, referrer: who },
      program: { handle, path: at.path, depth: at.depth, indexed: at.indexed, plugins: at.installed, used: at.used, rbac },
    }
  })
  const bound = [...chosen.map((row) => row.href)].sort().join('\n')
  const space = uuid(`links\n${bound}`)
  const ref = uuid(`referrer\n${who}`)
  const next = uuid(`${space}\n${ref}`)
  const scaled = program(next.slice(0, 8))
  const online = rows.filter((row) => row.kind === 'online').length
  const local = rows.filter((row) => row.kind === 'local').length
  const pasted = rows.filter((row) => row.kind === 'named').length
  const website = rows.filter((row) => row.kind === 'local').every((row) => row.href.startsWith(`${WEBSITE_ORIGIN}/api/`) && !row.href.includes('/src/'))
  const agnostic = rows.every((row) => row.program.plugins === 9 && row.program.used === 9 && row.program.depth === 7 && row.program.indexed && row.program.handle === row.address.slice(0, 8) && row.params.href === row.href)
  const manageable = rows.every((row) => row.program.rbac.read && row.program.rbac.execute && row.program.rbac.write === false && row.program.rbac.root)
  const tracked = rows.every((row) => row.sealed && /^[0-9a-f]{8}$/.test(row.program.handle))
  const one = new Set(rows.map((row) => row.address)).size === rows.length && seal(space).valid && space === uuid(`links\n${bound}`)
  const unlocked = scaled.indexed && scaled.used === 9 && next !== space && seal(next).valid
  const holds = one && website && agnostic && manageable && tracked && unlocked && online > 0 && local > 0 && EFFECTIVE === 122 && HANDLES === 4294967296n && SCALE === 137438953472n && rows.every((row) => row.sealed)
  return {
    phase: 'links' as const,
    via: 'uuid' as const,
    basis: 'payloadcms/website' as const,
    src: false as const,
    fetched: false as const,
    written: false as const,
    executed: false as const,
    walked: false as const,
    one,
    space,
    sealed: seal(space).valid,
    referrer: { href: who, address: ref, from: 'referrer' as const },
    params: { referrer: who },
    online,
    local,
    named: pasted,
    count: rows.length,
    rows,
    program: { agnostic, driven: 'params' as const, plugins: 9 as const, depth: 7 as const },
    rbac: { manageable, read: true as const, execute: true as const, write: false as const, root: true as const },
    qubits: { effective: EFFECTIVE, tracked, handles: HANDLES.toString(), scale: SCALE.toString() },
    capacity: { payload: SCALE.toString(), handles: HANDLES.toString(), plugins: 9 as const },
    infinity: { unlocked, walked: false as const, handles: HANDLES.toString(), next },
    holds,
  }
}

const dropProse = (row: Record<string, unknown>) => {
  const next = { ...row }
  delete next.title
  delete next.definition
  delete next.example
  delete next.scope
  if (next.successor && typeof next.successor === 'object') {
    const child = { ...(next.successor as Record<string, unknown>) }
    delete child.title
    delete child.definition
    delete child.scope
    next.successor = child
  }
  return next
}

/** The ISO scopes stay on the sources the links name. The MCP answer keeps the link. */
export const linkedIso = <T extends { says?: string; rows?: Record<string, unknown>[]; audit?: { rows?: Record<string, unknown>[] }; online?: { rows?: Record<string, unknown>[] } }>(iso: T): T => ({
  ...iso,
  says: productHref('iso', 'improve'),
  rows: iso.rows?.map((row) => dropProse(row)),
  audit: iso.audit ? { ...iso.audit, rows: iso.audit.rows?.map((row) => dropProse(row)) } : iso.audit,
  online: iso.online ? { ...iso.online, rows: iso.online.rows?.map((row) => dropProse(row)) } : iso.online,
})
