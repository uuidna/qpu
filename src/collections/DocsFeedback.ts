import type { CollectionConfig } from 'payload'
import { courtReceipt, uuidField } from '../hooks/index.js'

/** Feedback left on a docs page: the path and whether it helped. Laid out the payloadcms/website way:
 *  src/collections/DocsFeedback.ts, auto-wired by the generator. The MCP court rides along as a hook — every write is
 *  content-addressed and receipted (uuidField + courtReceipt), so the record is tamper-evident: the author's standing. */
export const DocsFeedback: CollectionConfig = {
  slug: 'docs-feedback',
  admin: { useAsTitle: 'path' },
  hooks: { beforeChange: [courtReceipt()] },
  fields: [{ name: 'path', type: 'text', required: true }, { name: 'helpful', type: 'checkbox' }, { name: 'comment', type: 'textarea' }, uuidField],
}
