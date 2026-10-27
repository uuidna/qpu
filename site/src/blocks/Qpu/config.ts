// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.
// The qpu block: one lexical/layout block of programmable UUID logic, the shape every tools/call result already carries in _meta.payload.
import type { Block } from 'payload'
import { uuidOf } from '@uuidna/qpu/blocks'
import { qpuFieldsOf } from '@uuidna/qpu/payload'
import { callOf } from '@uuidna/qpu/mcp'
export const Qpu: Block = {
  slug: 'qpu',
  interfaceName: 'QpuBlock',
  fields: [
    // the caller sends the tool and its arguments; the address and all read from it are computed here
    { name: 'uuid', type: 'text', validate: (v: unknown) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(String(v)) || 'a UUID of 36 characters', custom: { theorem: 'textbook_uuid_is_36' }, hooks: { beforeValidate: [({ siblingData: s }) => (s?.tool ? Object.assign(s, qpuFieldsOf(uuidOf(JSON.stringify({ tool: s.tool, arguments: s.arguments ?? {} })), s.tool, s.arguments ?? {}, s.theorem ?? null)).uuid : s?.uuid)] }, admin: { readOnly: true, description: 'the block address: a content-addressed RFC 9562 v8 UUID' } },
    { name: 'handle', type: 'text', admin: { readOnly: true } },
    { name: 'program', type: 'text', admin: { readOnly: true, description: 'the hex program (the version and variant nibbles rotated)' } },
    { name: 'tail', type: 'text', admin: { readOnly: true } },
    { name: 'tool', type: 'text', required: true, admin: { description: 'the tool whose result this block is' } },
    { name: 'arguments', type: 'json', admin: { description: 'the arguments, so the block recomputes anywhere' } },
    { name: 'prev', type: 'text', validate: (v: unknown) => (v == null || v === '') || /^$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(String(v)) || 'a UUID or empty', custom: { theorem: 'textbook_uuid_is_36' }, admin: { description: 'the referer block' } },
    { name: 'next', type: 'text', validate: (v: unknown) => (v == null || v === '') || /^$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(String(v)) || 'a UUID or empty', custom: { theorem: 'textbook_uuid_is_36' }, admin: { description: 'the program rotated: the next step' } },
    { name: 'stream', type: 'text', admin: { readOnly: true, description: 'the scannable stream of the address: the frames as a CSS gradient, stepped through by the qpu-scan item; computed by the lexical hook from uuid, never typed' }, custom: { theorem: 'textbook_scan_stream' }, hooks: { afterRead: [({ siblingData }) => { const u = String(siblingData?.uuid ?? ''); if (!/^[0-9a-f-]{36}$/.test(u)) return null; const hue = (ch: string) => (ch === '-' ? null : parseInt(ch, 16) * 22.5); return 'linear-gradient(90deg, ' + [...u].map((ch, i) => (hue(ch) === null ? 'hsl(0 0% 0%)' : 'hsl(' + hue(ch) + ' 62% 44%)') + ' ' + ((i / 36) * 100).toFixed(3) + '% ' + (((i + 1) / 36) * 100).toFixed(3) + '%').join(', ') + ')' }] } },
    { name: 'theorem', type: 'text', hooks: { beforeValidate: [({ value, siblingData: s }) => { const r = (callOf('verify', value ? { theorem: value } : { call: { tool: s?.tool, arguments: s?.arguments ?? {} } }) as { result?: { structuredContent?: { theorem?: string | null; accepted?: boolean } } }).result?.structuredContent; if (value && !r?.accepted) throw new Error('the kernel accepts no theorem ' + value); return value || (r?.accepted ? r.theorem : value) }] }, admin: { description: 'the kernel-accepted theorem that makes this block true; written by the QPU as a client of this MCP, read from the textbook' } },
    { name: 'license', type: 'text', admin: { readOnly: true, description: 'the licence the block is served under (SPDX), kept with the content as every result carries it' } },
  ],
}
