import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

/** Feedback left on a docs page: the path and whether it helped. Laid out the payloadcms/website way:
 *  src/collections/DocsFeedback.ts, auto-wired by the generator. Create is public (a feedback form); the inputs are
 *  length-bounded. (It carries no uuidField/courtReceipt hook — it is plain feedback, not a receipted ledger.) */
export const DocsFeedback: CollectionConfig = {
  slug: 'docs-feedback',
  admin: { useAsTitle: 'path' },
  access: { read: authenticated, create: anyone, update: authenticated, delete: authenticated },
  // create is anyone (a public docs feedback form), so the anonymous inputs are length-bounded by construction — the
  // maxLength fields below cap what an unauthenticated caller stores (Wave XIII). path a URL path, comment a short note.
  fields: [{ name: 'path', type: 'text', required: true, maxLength: 1024 }, { name: 'helpful', type: 'checkbox' }, { name: 'comment', type: 'textarea', maxLength: 4096 }],
}
