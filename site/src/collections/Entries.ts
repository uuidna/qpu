// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.
// The docket as a Payload collection over MongoDB (the mongo tool's language): every entry addressed by its content — the id is the
// fold address of what it holds, the sha256 beside it — never overwritten; the four verbs are Payload's REST (/api/entries).
import type { CollectionConfig } from 'payload'
import { uuidOf } from '@uuidna/qpu/blocks'
import { handle } from '@uuidna/qpu/mcp'

type TenantUser = { roles?: string[]; tenants?: { tenant?: { id?: string } | string; roles?: string[] }[] } | null | undefined
const isSuperAdmin = (user: unknown): boolean => ((user as TenantUser)?.roles ?? []).includes('admin')
const tenantIdOf = (t: unknown): string | null => (typeof t === 'string' ? t : (t as { id?: string } | undefined)?.id ?? null)
const tenantsWithRole = (user: unknown, roles: readonly string[]): string[] => ((user as TenantUser)?.tenants ?? []).filter((row) => (row.roles ?? []).some((r) => roles.includes(r))).map((row) => tenantIdOf(row.tenant)).filter((id): id is string => !!id)
const memberOf = (user: unknown, tenant: string | null, roles: readonly string[]): boolean => !!tenant && tenantsWithRole(user, roles).includes(tenant)
export const Entries: CollectionConfig = {
  slug: 'entries',
  admin: { useAsTitle: 'id', defaultColumns: ['id', 'kind', 'from', 'createdAt'] },
  // access by tenant roles and the Worker's roles: a reader reads; a call is created by anyone; an entry of other kinds by a super admin, a tenant-admin or editor of its tenant, or the writer token; no one updates (an entry is its content address); a super admin, a tenant-admin of its tenant or the admin token deletes
  access: {
    read: () => true,
    create: ({ req, data }) => data?.kind === 'call' || isSuperAdmin(req.user) || memberOf(req.user, tenantIdOf(data?.tenant), ['tenant-admin', 'editor']) || req.headers.get('x-qpu-role') === 'writer' || req.headers.get('x-qpu-role') === 'admin',
    update: () => false,
    delete: ({ req }) => isSuperAdmin(req.user) || req.headers.get('x-qpu-role') === 'admin' || { tenant: { in: tenantsWithRole(req.user, ['tenant-admin']) } },
  },
  fields: [
    { name: 'id', type: 'text', required: true, validate: (v: unknown) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(String(v)) || 'a UUID of 36 characters', admin: { readOnly: true, description: 'the content address: computed from kind, from and body' } },
    { name: 'kind', type: 'text', required: true, index: true, validate: (v: unknown) => /^[a-z][a-z-]*$/.test(String(v)) || 'lower-case letters and dashes' },
    { name: 'from', type: 'text', required: true, index: true },
    { name: 'body', type: 'json' },
    { name: 'sha256', type: 'text', validate: (v: unknown) => v == null || /^[0-9a-f]{64}$/.test(String(v)) || '64 hex digits', admin: { readOnly: true } },
    { name: 'result', type: 'json', admin: { readOnly: true, description: 'kind call: the reply of the tool, computed by the hook from body { tool, arguments }; the API of every tool is this collection' } },
    { name: 'links', type: 'array', fields: [{ name: 'entry', type: 'text' }] },
  ],
  hooks: {
    // every 404 from a block answered, nothing written: a well-formed UUID the collection does not hold is healed from the Worker by address (QPU_ORIGIN, accept json),
    // which answers the entry its docket holds or the UUID's own page computed from the id alone; unreachable, the same page is computed here by the handler
    afterError: [async ({ error, req }) => {
      const id = String((req as { routeParams?: { id?: unknown } } | undefined)?.routeParams?.id ?? (req?.url ?? '').split('?')[0]!.split('/').pop() ?? '')
      if ((error as { status?: number }).status !== 404 || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)) return
      try { const res = await fetch((process.env.QPU_ORIGIN ?? 'https://qpu.uuidna.com') + '/' + id, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(10000) }); if (res.ok) { const entry = await res.json() as { id?: string; kind?: string; from?: string; body?: unknown; links?: string[]; computed?: boolean }; if (entry && entry.kind && entry.from && !entry.computed) { try { await req.payload.create({ collection: 'entries' as never, data: { kind: entry.kind, from: entry.from, body: entry.body, links: entry.links ?? [] } as never, overrideAccess: true, context: { disableRevalidate: true } }) } catch { /* seeded already, or refused: the answer stands */ } } return { response: entry, status: 200 } } } catch { /* the Worker unreached: computed here */ }
      const v = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'verify', arguments: { uuid: id } } }) as { result?: { structuredContent?: unknown } }).result?.structuredContent
      return { response: { id, kind: 'uuid', from: 'computed', computed: true, body: v ?? null, says: 'no entry at this address: the page of the UUID from the id alone, nothing written (no content address to seed at)' }, status: 200 }
    }],
    beforeValidate: [async ({ data, operation }) => {
      if (operation !== 'create' || !data) return data
      const text = JSON.stringify({ kind: data.kind, from: data.from, body: data.body ?? null })
      const bytes = new TextEncoder().encode(text)
      const digest = await crypto.subtle.digest('SHA-256', bytes)
      // the API built from the config: an entry of kind call carries a tool and its arguments, and the hook answers it from the handler; the address folds the call, not the reply, so the same call is the same entry (read free, computed once)
      const body = data.body as { tool?: string; arguments?: Record<string, unknown> } | undefined
      // the reply's result stands as the entry's result (content, structuredContent, _meta with the widget); a refusal stands as { error }
      const reply = data.kind === 'call' && body?.tool ? (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: body.tool, arguments: body.arguments ?? {} } }) as { result?: unknown; error?: { message: string } }) : undefined
      const result = reply ? (reply.result ?? { error: reply.error }) : undefined
      return { ...data, id: uuidOf(text), sha256: [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join(''), ...(result ? { result } : {}) }
    }],
    // no revalidation hook: an entry is its content address and never updates, so nothing cached under it ever changes (measured: a revalidateTag during the render that creates a call is refused by Next)
  },
}
