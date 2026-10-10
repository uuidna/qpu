import type { Block } from 'payload'

/** CROSS DOMAIN — the cross-relationship graph on a page: one domain and all the families that cross to it (hardware →
 *  its 12), or the whole graph. The neuron view — each family a node, its domain siblings its synapses — derived
 *  token-free from the sealed bridges. The useful combinatoric: the family × domain network, queryable. */
export const CrossDomain: Block = {
  slug: 'crossDomain',
  interfaceName: 'CrossDomainBlock',
  admin: { group: 'QPU' },
  fields: [
    { name: 'domain', type: 'text', admin: { description: 'A domain (e.g. hardware) for its families; empty for the whole graph' } },
    { name: 'pairs', type: 'checkbox', defaultValue: false, admin: { description: 'Also count the C(n, 2) binding pairs that compose within the domain' } },
  ],
}
