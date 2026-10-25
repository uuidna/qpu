// The qpu block: one lexical/layout block of programmable UUID logic, the shape every tools/call result already carries in _meta.payload.
import type { Block } from 'payload'
export const Qpu: Block = {
  slug: 'qpu',
  interfaceName: 'QpuBlock',
  fields: [
    { name: 'uuid', type: 'text', required: true, admin: { description: 'the block address: a content-addressed RFC 9562 v8 UUID' } },
    { name: 'handle', type: 'text', required: true },
    { name: 'program', type: 'text', required: true, admin: { description: 'the hex program (the version and variant nibbles rotated)' } },
    { name: 'tail', type: 'text', required: true },
    { name: 'tool', type: 'text', required: true, admin: { description: 'the tool whose result this block is' } },
    { name: 'arguments', type: 'json', admin: { description: 'the arguments, so the block recomputes anywhere' } },
    { name: 'prev', type: 'text', admin: { description: 'the referer block' } },
    { name: 'next', type: 'text', admin: { description: 'the program rotated: the next step' } },
  ],
}
