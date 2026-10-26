// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.
// The qpu block: one lexical/layout block of programmable UUID logic, the shape every tools/call result already carries in _meta.payload.
import type { Block } from 'payload'
export const Qpu: Block = {
  slug: 'qpu',
  interfaceName: 'QpuBlock',
  fields: [
    { name: 'uuid', type: 'text', required: true, validate: (v: unknown) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(String(v)) || 'a UUID of 36 characters', custom: { theorem: 'textbook_uuid_is_36' }, admin: { description: 'the block address: a content-addressed RFC 9562 v8 UUID' } },
    { name: 'handle', type: 'text', required: true },
    { name: 'program', type: 'text', required: true, admin: { description: 'the hex program (the version and variant nibbles rotated)' } },
    { name: 'tail', type: 'text', required: true },
    { name: 'tool', type: 'text', required: true, admin: { description: 'the tool whose result this block is' } },
    { name: 'arguments', type: 'json', admin: { description: 'the arguments, so the block recomputes anywhere' } },
    { name: 'prev', type: 'text', validate: (v: unknown) => (v == null || v === '') || /^$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(String(v)) || 'a UUID or empty', custom: { theorem: 'textbook_uuid_is_36' }, admin: { description: 'the referer block' } },
    { name: 'next', type: 'text', validate: (v: unknown) => (v == null || v === '') || /^$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(String(v)) || 'a UUID or empty', custom: { theorem: 'textbook_uuid_is_36' }, admin: { description: 'the program rotated: the next step' } },
    { name: 'stream', type: 'text', admin: { readOnly: true, description: 'the scannable stream of the address: the frames as a CSS gradient, stepped through by the qpu-scan item; computed by the lexical hook from uuid, never typed' }, custom: { theorem: 'textbook_scan_stream' }, hooks: { afterRead: [({ siblingData }) => { const u = String(siblingData?.uuid ?? ''); if (!/^[0-9a-f-]{36}$/.test(u)) return null; const hue = (ch: string) => (ch === '-' ? null : parseInt(ch, 16) * 22.5); return 'linear-gradient(90deg, ' + [...u].map((ch, i) => (hue(ch) === null ? 'hsl(0 0% 0%)' : 'hsl(' + hue(ch) + ' 62% 44%)') + ' ' + ((i / 36) * 100).toFixed(3) + '% ' + (((i + 1) / 36) * 100).toFixed(3) + '%').join(', ') + ')' }] } },
    { name: 'theorem', type: 'text', admin: { description: 'the kernel-accepted theorem that makes this block true; written by the QPU as a client of this MCP, read from the textbook' } },
  ],
}
