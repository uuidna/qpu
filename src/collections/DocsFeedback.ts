import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

/** Feedback left on a docs page: the path and whether it helped. Laid out the payloadcms/website way:
 *  src/collections/DocsFeedback.ts, auto-wired by the generator. The MCP court rides along as a hook — every write is
 *  content-addressed and receipted (uuidField + courtReceipt), so the record is tamper-evident: the author's standing. */
export const DocsFeedback: CollectionConfig = {
  slug: 'docs-feedback',
  admin: { useAsTitle: 'path' },
  access: { read: authenticated, create: anyone, update: authenticated, delete: authenticated },
  // create is anyone (a public docs feedback form), so the anonymous inputs are length-bounded — an unauthenticated
  // caller cannot store an unbounded blob (Wave XIII). path a URL path, comment a short note.
  fields: [{ name: 'path', type: 'text', required: true, maxLength: 1024 }, { name: 'helpful', type: 'checkbox' }, { name: 'comment', type: 'textarea', maxLength: 4096 }],
}
