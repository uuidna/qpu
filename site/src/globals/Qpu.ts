// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.
// The discovery document as a Payload global: GET /api/globals/qpu answers it from the handler alone, computed on read by the global's own hook; no custom endpoint.
import type { GlobalConfig } from 'payload'
import { discoveryOf } from '@uuidna/qpu/discovery-document'

export const QpuGlobal: GlobalConfig = {
  slug: 'qpu',
  access: { read: () => true },
  fields: [
    { name: 'origin', type: 'text', defaultValue: 'https://qpu.uuidna.com', admin: { description: 'the origin the discovery document names' } },
    { name: 'document', type: 'json', admin: { readOnly: true, description: 'the discovery document: computed on every read, never stored' } },
  ],
  // per tenant: the document names the origin of the host that asked (a tenant's domain), else the origin the global holds; a local host keeps the global's
  hooks: { afterRead: [({ doc, req }) => { const host = req?.headers?.get?.('host') ?? ''; const origin = host && !/^(localhost|127\.0\.0\.1)(:|$)/.test(host) ? 'https://' + host.split(':')[0] : String(doc?.origin ?? 'https://qpu.uuidna.com'); return { ...doc, origin, document: discoveryOf(origin, process.env as Record<string, unknown>) } }] },
}
