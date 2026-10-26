// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.
// The docket as a Payload collection over MongoDB (the mongo tool's language): every entry addressed by its content — the id is the
// fold address of what it holds, the sha256 beside it — never overwritten; the four verbs are Payload's REST (/api/entries).
import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { uuidOf } from '@uuidna/qpu/blocks'
import { handle } from '@uuidna/qpu/mcp'

export const Entries: CollectionConfig = {
  slug: 'entries',
  admin: { useAsTitle: 'id', defaultColumns: ['id', 'kind', 'from', 'createdAt'] },
  // the Worker's roles carried in: a reader reads, a writer creates, no one updates (an entry is its content address), an admin deletes
  access: { read: () => true, create: ({ req, data }) => data?.kind === 'call' || !!req.user || req.headers.get('x-qpu-role') === 'writer' || req.headers.get('x-qpu-role') === 'admin', update: () => false, delete: ({ req }) => !!req.user || req.headers.get('x-qpu-role') === 'admin' },
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
    beforeValidate: [async ({ data, operation }) => {
      if (operation !== 'create' || !data) return data
      const text = JSON.stringify({ kind: data.kind, from: data.from, body: data.body ?? null })
      const bytes = new TextEncoder().encode(text)
      const digest = await crypto.subtle.digest('SHA-256', bytes)
      // the API built from the config: an entry of kind call carries a tool and its arguments, and the hook answers it from the handler; the address folds the call, not the reply, so the same call is the same entry (read free, computed once)
      const body = data.body as { tool?: string; arguments?: Record<string, unknown> } | undefined
      const result = data.kind === 'call' && body?.tool ? (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: body.tool, arguments: body.arguments ?? {} } }) as { result?: unknown; error?: unknown }) : undefined
      return { ...data, id: uuidOf(text), sha256: [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join(''), ...(result ? { result } : {}) }
    }],
    // the write is the only paid step: the entry's page is cached by its tag until it changes, so every read after the first costs the provider nothing
    afterChange: [({ doc }) => { revalidateTag('entry-' + doc.id, { expire: 0 }); return doc }],
  },
}
