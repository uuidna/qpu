import type { Block } from 'payload'

/** FAMILY — a family's whole combinatoric surface on a page: its 15 formulas (each a nibble a UUID can program) and,
 *  from the cross graph, its domain and its sibling families (its experts). Pick how many formulas to combine at once —
 *  C(15, k) k-subsets, the useful combinatorics of one family. */
export const Family: Block = {
  slug: 'familyBlock',
  interfaceName: 'FamilyBlock',
  admin: { group: 'QPU' },
  fields: [
    { name: 'family', type: 'text', required: true, admin: { description: 'The family whose formulas and domain to render' } },
    { name: 'combine', type: 'number', defaultValue: 1, admin: { description: 'k: render the C(formulas, k) k-subset combinations' } },
    { name: 'showExperts', type: 'checkbox', defaultValue: true, admin: { description: 'Also list the family’s siblings in its cross domain' } },
  ],
}
