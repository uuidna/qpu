import type { Block } from 'payload'

/** Code — a syntax-highlighted snippet. The payloadcms/website `code` block. */
export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  admin: { group: 'QPU' },
  fields: [
    { name: 'language', type: 'select', options: ['typescript', 'javascript', 'css', 'json', 'bash', 'lean'] },
    { name: 'code', type: 'code', required: true },
  ],
}
