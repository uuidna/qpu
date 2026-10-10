import type { Block } from 'payload'

/** HEX PROGRAM — a programmable combination embedded in a page: a family, its program (one or more formulas composed),
 *  and the params. That triple IS the query — it mints a hex-program UUID run at /{uuid}, with the .svg animation and
 *  the quantum receipt. The useful combinatoric: a page composes any point of the family × formula × params space. */
export const HexProgram: Block = {
  slug: 'hexProgram',
  interfaceName: 'HexProgramBlock',
  admin: { group: 'QPU' },
  fields: [
    { name: 'family', type: 'text', required: true, admin: { description: 'The hex family, e.g. gpu, crypto_rsa, merkaba' } },
    { name: 'program', type: 'array', required: true, fields: [{ name: 'formula', type: 'text', required: true }], admin: { description: 'The formulas composed, in order' } },
    { name: 'params', type: 'array', fields: [{ name: 'value', type: 'number', required: true }] },
    { name: 'show', type: 'select', defaultValue: 'value', options: ['value', 'animation', 'receipt'], admin: { description: 'Render the run value, the rays-and-streams .svg, or the quantum receipt' } },
  ],
}
