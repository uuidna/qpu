import { blockFields } from '../../fields/blockFields'

/** Each tenant as an app on the lattice: its domain, the pages and docs scoped to it, and the engine every app shares.
 *  `live` because it reads the document store when served, so it is its own page, not the home page. */
export const Apps = blockFields(
  'Apps',
  'QPU',
  'Every tenant is an app on the lattice: each reached at its own domain with its pages and docs scoped to it, while the content-addressed engine — the receipts and the fuse registry — is one, shared across every app.',
  [],
  { live: true },
)
