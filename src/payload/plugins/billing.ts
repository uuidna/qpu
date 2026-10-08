import { qpuLatticeNamesOf, qpuServedLedgerOf } from '../../quantum/processing/unit/index.js'
import type { QpuPlugin } from './surface.js'

/**
 * Usage, both ways, in the lattice's own cost units.
 *
 * Qpu.Hybrid names what a unit of storage costs: kvCost = coins, r2Cost = seed, hybridCost = kvCost + r2Cost
 * (src/quantum/processing/unit/lean/Qpu/Hybrid.lean). The meter is the served ledger: each row is a document the
 * isolate served from memory instead of recomputing, which is the usage the unit already records. Charged is that
 * count times hybridCost (what QPU is charged). Billed is the same usage (what QPU charges). The margin place is
 * open: the repo's margin formulas take two amounts and name no industry rate, so the rate is a lead and is not filled.
 */
export const usageBillOf = () => {
  const lattice = qpuLatticeNamesOf()
  const kvCost = lattice.coins
  const r2Cost = lattice.seed
  const hybridCost = kvCost + r2Cost
  const units = qpuServedLedgerOf().length
  const charged = units * hybridCost
  const billed = charged
  return {
    kind: 'usage-bill' as const,
    meter: 'qpuServedLedgerOf' as const,
    units,
    cost: { kvCost, r2Cost, hybridCost, by: 'Qpu.Hybrid kvCost = coins, r2Cost = seed' },
    charged,
    billed,
    margin: null as null,
    marginPlace: 'accounting.margin / costing.margin / ecommerce.margin / financial.margin',
    prize: { billed: false as const, holds: false as const, lead: true as const },
    holds: hybridCost === lattice.n && charged === units * hybridCost && billed === charged && kvCost === lattice.coins && r2Cost === lattice.seed,
  }
}

export const billingPlugin = (): QpuPlugin => (config) => ({
  ...config,
  collections: [...(config.collections ?? []), {
    slug: 'usage',
    fields: [
      { name: 'units', type: 'number' },
      { name: 'charged', type: 'number' },
      { name: 'billed', type: 'number' },
      { name: 'margin', type: 'number' },
      { name: 'tenant', type: 'text' },
    ],
  }],
  endpoints: [...(config.endpoints ?? []), {
    path: '/qpu/usage',
    method: 'get' as const,
    handler: () => Response.json(usageBillOf()),
  }],
})
