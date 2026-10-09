/**
 * Cloudflare account exploration through QPU — connector { cloudflare: true }.
 *
 * Automates wrangler whoami + KV/R2/D1/pages lists + tree wrangler.jsonc RAID bindings.
 * Secret *names* only (never values). Token-sealed. No tools/list door.
 *
 *   tools/call connector { cloudflare: true }
 *   tools/call connector { cf: true, live: true }
 *   GET /api/qpu/cloudflare
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { qpuFacesOf } from '../../quantum/processing/unit/index.js'
import type { QpuPlugin } from './surface.js'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '../../..')

const stripAnsi = (s: string) => s.replace(/\u001b\[[0-9;]*m/g, '')

const runWrangler = (args: string[]): { ok: boolean; stdout: string; stderr: string; ms: number } => {
  const t0 = Date.now()
  try {
    const stdout = execFileSync('npx', ['wrangler', ...args], {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 60_000,
      maxBuffer: 8 * 1024 * 1024,
      env: { ...process.env, CI: '1', WRANGLER_SEND_METRICS: 'false' },
    })
    return { ok: true, stdout: stripAnsi(stdout), stderr: '', ms: Date.now() - t0 }
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string; message?: string }
    return {
      ok: false,
      stdout: stripAnsi(err.stdout ?? ''),
      stderr: stripAnsi(err.stderr ?? err.message ?? String(e)),
      ms: Date.now() - t0,
    }
  }
}

const parseJsonArray = (text: string): unknown[] => {
  const start = text.indexOf('[')
  const end = text.lastIndexOf(']')
  if (start < 0 || end < start) return []
  try {
    const v = JSON.parse(text.slice(start, end + 1))
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

const parseWhoami = (text: string) => {
  const email = /associated with the email\s+(\S+)/i.exec(text)?.[1] ?? null
  const accountId = /Account ID\s*│\s*([a-f0-9]{32})/i.exec(text)?.[1]
    ?? /│\s*([a-f0-9]{32})\s*│/.exec(text)?.[1]
    ?? null
  const accountName = /│\s*([^\│]+@\S+)\s*│\s*[a-f0-9]{32}/.exec(text)?.[1]?.trim() ?? email
  const scopes = [...text.matchAll(/^- ([a-z0-9_:-]+)(?: \(([^)]+)\))?$/gim)].map((m) => ({
    scope: m[1],
    access: m[2] ?? null,
  }))
  const missing = [...text.matchAll(/^\s*- ([a-z0-9_:-]+)\s*$/gim)]
    .map((m) => m[1]!)
    .filter((s) => /k2\.|agent-memory|challenge-widgets/i.test(s))
  return {
    email,
    accountName,
    accountId,
    scopes: scopes.slice(0, qpuFacesOf().faces * 4),
    missingScopes: missing,
    auth: email && accountId ? ('oauth' as const) : ('unknown' as const),
  }
}

const parseR2Names = (text: string): string[] =>
  [...text.matchAll(/name:\s+(\S+)/g)].map((m) => m[1]!).filter(Boolean)

const parseD1Table = (text: string): { uuid: string; name: string; file_size?: number }[] => {
  const rows: { uuid: string; name: string; file_size?: number }[] = []
  for (const line of text.split('\n')) {
    const m = /│\s*([0-9a-f-]{36})\s*│\s*(\S+)\s*│/.exec(line)
    if (m) rows.push({ uuid: m[1]!, name: m[2]! })
  }
  return rows
}

const parsePages = (text: string): { name: string; domains: string }[] => {
  const rows: { name: string; domains: string }[] = []
  for (const line of text.split('\n')) {
    const m = /│\s*([a-z0-9-]+)\s*│\s*([^│]+?)\s*│/.exec(line)
    if (m && m[1] !== 'Project' && !/^-/.test(m[1]!)) rows.push({ name: m[1]!, domains: m[2]!.trim() })
  }
  return rows
}

/** Tree RAID / Worker bindings from committed wrangler.jsonc — no live API. */
export const cloudflareTreeBindingsOf = () => {
  const path = join(ROOT, 'wrangler.jsonc')
  if (!existsSync(path)) {
    return { kind: 'tree-bindings' as const, path: null, worker: null, main: null, kv: [], r2: [], d1: [], routes: [], vars: [], raid: { storage: 'STORAGE→KV' as const, blobs: 'BLOBS→R2' as const, media: 'MEDIA→R2' as const, note: 'qpu-raid: MongoDB-semantics DocStore on KV+R2' as const }, holds: false as const, note: 'wrangler.jsonc absent' as const }
  }
  // strip // comments for JSONC
  const raw = readFileSync(path, 'utf8').replace(/^\s*\/\/.*$/gm, '')
  const w = JSON.parse(raw) as {
    name?: string
    main?: string
    kv_namespaces?: { binding: string; id: string; preview_id?: string }[]
    r2_buckets?: { binding: string; bucket_name: string }[]
    d1_databases?: { binding: string; database_name: string; database_id: string }[]
    routes?: { pattern: string; zone_name?: string; custom_domain?: boolean }[]
    vars?: Record<string, string>
  }
  return {
    kind: 'tree-bindings' as const,
    path: 'wrangler.jsonc',
    worker: w.name ?? null,
    main: w.main ?? null,
    kv: (w.kv_namespaces ?? []).map((k) => ({ binding: k.binding, id: k.id })),
    r2: (w.r2_buckets ?? []).map((b) => ({ binding: b.binding, bucket: b.bucket_name })),
    d1: (w.d1_databases ?? []).map((d) => ({ binding: d.binding, name: d.database_name, id: d.database_id })),
    routes: w.routes ?? [],
    vars: Object.keys(w.vars ?? {}),
    raid: {
      storage: 'STORAGE→KV' as const,
      blobs: 'BLOBS→R2' as const,
      media: 'MEDIA→R2' as const,
      note: 'qpu-raid: MongoDB-semantics DocStore on KV+R2' as const,
    },
    holds: Boolean(w.name && (w.kv_namespaces?.length || w.r2_buckets?.length)),
  }
}

/**
 * Live account inventory via wrangler (OAuth already on the machine). Secrets: names only.
 */
export const cloudflareAccountOf = async (args: Record<string, unknown> = {}) => {
  const { sealPayloadOf, tokenUsageOf, secretsInOf } = await import('./tokens.js')
  const live = args.live !== false && args.tree !== true
  const tree = cloudflareTreeBindingsOf()
  let whoami: ReturnType<typeof parseWhoami> | null = null
  let kv: { id: string; title: string }[] = []
  let r2: string[] = []
  let d1: { uuid: string; name: string }[] = []
  let pages: { name: string; domains: string }[] = []
  let secretNames: string[] = []
  let ms = { whoami: 0, kv: 0, r2: 0, d1: 0, pages: 0, secrets: 0 }
  let errors: string[] = []

  if (live) {
    const w = runWrangler(['whoami'])
    ms.whoami = w.ms
    if (w.ok || w.stdout.includes('logged in')) whoami = parseWhoami(w.stdout + '\n' + w.stderr)
    else errors.push(`whoami: ${w.stderr.slice(0, 200)}`)

    const kvRun = runWrangler(['kv', 'namespace', 'list'])
    ms.kv = kvRun.ms
    kv = parseJsonArray(kvRun.stdout).map((x) => {
      const o = x as { id?: string; title?: string }
      return { id: o.id ?? '', title: o.title ?? '' }
    }).filter((x) => x.id)

    const r2Run = runWrangler(['r2', 'bucket', 'list'])
    ms.r2 = r2Run.ms
    r2 = parseR2Names(r2Run.stdout)

    const d1Run = runWrangler(['d1', 'list'])
    ms.d1 = d1Run.ms
    d1 = parseD1Table(d1Run.stdout)

    const pagesRun = runWrangler(['pages', 'project', 'list'])
    ms.pages = pagesRun.ms
    pages = parsePages(pagesRun.stdout)

    const secRun = runWrangler(['secret', 'list'])
    ms.secrets = secRun.ms
    secretNames = parseJsonArray(secRun.stdout)
      .map((x) => (x as { name?: string }).name)
      .filter((n): n is string => typeof n === 'string')
  }

  let raid: unknown = null
  try {
    const { raidCompareOf } = await import('./raid-compare.js')
    raid = raidCompareOf()
  } catch {
    raid = { holds: false, note: 'raid-compare unavailable' }
  }

  const qpuWorker = {
    name: tree.worker,
    storageKvId: tree.kv.find((k) => k.binding === 'STORAGE')?.id ?? null,
    blobsBucket: tree.r2.find((b) => b.binding === 'BLOBS')?.bucket ?? null,
    mediaBucket: tree.r2.find((b) => b.binding === 'MEDIA')?.bucket ?? null,
    storageInAccount: kv.some((k) => k.id === tree.kv.find((t) => t.binding === 'STORAGE')?.id),
    secretNames, // names only — values never fetched
  }

  const counts = {
    kv: kv.length,
    r2: r2.length,
    d1: d1.length,
    pages: pages.length,
    treeKv: tree.kv.length,
    treeR2: tree.r2.length,
  }

  const holds =
    tree.holds === true &&
    (!live || (whoami?.accountId != null && whoami.email != null && kv.length > 0))

  const body = {
    kind: 'cloudflare-account' as const,
    call: 'tools/call connector { cloudflare: true }' as const,
    endpoint: '/api/qpu/cloudflare' as const,
    live,
    whoami,
    tree,
    inventory: live
      ? {
          kv: kv.map((k) => ({ id: k.id, title: k.title })),
          r2: r2.map((name) => ({ name })),
          d1: d1.map((d) => ({ uuid: d.uuid, name: d.name })),
          pages,
          counts,
        }
      : { counts: { treeKv: tree.kv.length, treeR2: tree.r2.length }, note: 'tree-only; pass live:true for wrangler inventory' },
    qpu: qpuWorker,
    raid: {
      kind: (raid as { kind?: string })?.kind ?? null,
      holds: (raid as { holds?: boolean })?.holds === true,
      note: 'RAID vs direct — measured Qpu.Hybrid; see connector { raid: true }' as const,
    },
    ms,
    errors: errors.slice(0, qpuFacesOf().faces),
    goal: 'OPEN' as const,
    holds,
    note: 'wrangler OAuth exploration · secret names only · API tokens never echoed · token-sealed' as const,
  }

  const sealed = sealPayloadOf(body)
  const usage = tokenUsageOf(
    { who: 'cloudflare-account', door: 'connector', tool: 'cloudflare', panel: 'cloudflare', family: 'cloud' },
    sealed,
  )
  const leak = secretsInOf(JSON.stringify(sealed))
  return sealPayloadOf({
    ...sealed,
    usage: [usage],
    tokenSeal: { sealed: usage.sealed === true && !leak, note: 'redact+compact; no CF API token material' as const },
  })
}

export const publicCloudflareOf = async (request?: Request): Promise<Response> => {
  const url = request ? new URL(request.url) : null
  const tree = url?.searchParams.get('tree') === '1' || url?.searchParams.get('tree') === 'true'
  const live = !(tree || url?.searchParams.get('live') === 'false')
  const body = await cloudflareAccountOf({ live, ...(tree ? { tree: true } : {}) })
  return Response.json(body, {
    headers: { 'cache-control': 'private, no-store' },
  })
}

export const cloudflareAccountPlugin = (): QpuPlugin => (config) => ({
  ...config,
  endpoints: [
    ...(config.endpoints ?? []),
    {
      path: '/qpu/cloudflare',
      method: 'get' as const,
      handler: async (req: Request) => publicCloudflareOf(req),
    },
    {
      path: '/qpu/cloudflare',
      method: 'post' as const,
      handler: async (req: Request) => {
        const args = ((await req.json().catch(() => ({}))) as Record<string, unknown>) ?? {}
        return Response.json(await cloudflareAccountOf(args), {
          headers: { 'cache-control': 'private, no-store' },
        })
      },
    },
  ],
})
