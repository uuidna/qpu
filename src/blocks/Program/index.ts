import { blockFields } from '../../fields/blockFields'

/** One hex program, minted and run when the page is served. */
export const Program = blockFields('Program', 'QPU', [
  {
    type: 'row',
    fields: [
      { name: 'family', type: 'text', required: true },
      { name: 'program', type: 'text', required: true, admin: { description: 'formulas joined by +' } },
      { name: 'params', type: 'text', admin: { description: 'up to three naturals, comma-separated' } },
    ],
  },
])
