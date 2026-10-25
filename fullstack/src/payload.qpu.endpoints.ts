// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.
// The discovery document as a Payload endpoint: /api/qpu from the handler alone, the same at the Worker and here.
import type { Endpoint } from 'payload'
import { discoveryOf } from '@uuidna/qpu/discovery-document'

export const qpuEndpoints: Endpoint[] = [
  { path: '/qpu', method: 'get', handler: (req) => Response.json(discoveryOf(new URL(req.url ?? 'https://qpu.uuidna.com').origin, process.env as Record<string, unknown>)) },
]
