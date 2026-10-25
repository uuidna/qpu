// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.
// The docket as a Payload collection over MongoDB (the mongo tool's language): every entry addressed by its content — the id is the
// fold address of what it holds, the sha256 beside it — never overwritten; the four verbs are Payload's REST (/api/entries).
import type { CollectionConfig } from 'payload'
import { uuidOf } from '@uuidna/qpu/blocks'

export const Entries: CollectionConfig = {
  slug: 'entries',
  admin: { useAsTitle: 'id', defaultColumns: ['id', 'kind', 'from', 'createdAt'] },
  access: { read: () => true },
  fields: [
    { name: 'id', type: 'text', required: true, admin: { readOnly: true, description: 'the content address: computed from kind, from and body' } },
    { name: 'kind', type: 'text', required: true, index: true },
    { name: 'from', type: 'text', required: true, index: true },
    { name: 'body', type: 'json' },
    { name: 'sha256', type: 'text', admin: { readOnly: true } },
    { name: 'links', type: 'array', fields: [{ name: 'entry', type: 'text' }] },
  ],
  hooks: {
    beforeValidate: [async ({ data, operation }) => {
      if (operation !== 'create' || !data) return data
      const text = JSON.stringify({ kind: data.kind, from: data.from, body: data.body ?? null })
      const bytes = new TextEncoder().encode(text)
      const digest = await crypto.subtle.digest('SHA-256', bytes)
      return { ...data, id: uuidOf(text), sha256: [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('') }
    }],
  },
}
