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
  hooks: { afterRead: [({ doc }) => ({ ...doc, document: discoveryOf(String(doc?.origin ?? 'https://qpu.uuidna.com'), process.env as Record<string, unknown>) })] },
}
