// Build-time VitePress data loader for the Post-Quantum Payload Studio:
// seeds the studio from Lean-generated SDK contracts, Quantum OS pivot, live NIST PQC baseline and all 7 Payload collections.
import { defineLoader } from 'vitepress'
import type {
  googleDiscoveryDocument,
  googleIntegrations,
  payloadUiManifest,
  sdkCollection,
  sdkSummary,
} from '../../../../src/quantum/uuid/programs/sdk/index.ts'
import type { quantumPivot } from '../../../../src/quantum/uuid/programs/e/7/a/6/d/5/2/2/index.ts'
import type { gqaiAppsScript, gqaiChallengeMatrix } from '../../../../src/quantum/uuid/programs/gqai/index.ts'
import type { ecommerceSeoToolboxes } from '../../../../src/quantum/uuid/programs/seo/index.ts'
import type { clay1000Research } from '../../../../src/quantum/uuid/programs/clay/thousand/index.ts'
import type { rbacAudit } from '../../../../src/quantum/uuid/programs/rbac/index.ts'
import type { dsaRound, kemRound } from '../../../../src/quantum/uuid/programs/4/3/a/3/9/a/e/6/index.ts'

export type StudioSeed = {
  manifest: ReturnType<typeof payloadUiManifest>
  summary: ReturnType<typeof sdkSummary>
  pivot: ReturnType<typeof quantumPivot>
  google: ReturnType<typeof googleIntegrations>
  discovery: ReturnType<typeof googleDiscoveryDocument>
  gqai: ReturnType<typeof gqaiChallengeMatrix>
  appsScript: ReturnType<typeof gqaiAppsScript>
  seoToolboxes: ReturnType<typeof ecommerceSeoToolboxes>
  clay1000: ReturnType<typeof clay1000Research>
  rbac: ReturnType<typeof rbacAudit>
  period: string
  featuredProduct: Record<string, unknown>
  collections: {
    products: ReturnType<typeof sdkCollection<'products'>>
    variants: ReturnType<typeof sdkCollection<'variants'>>
    variantTypes: ReturnType<typeof sdkCollection<'variantTypes'>>
    variantOptions: ReturnType<typeof sdkCollection<'variantOptions'>>
    computations: ReturnType<typeof sdkCollection<'computations'>>
    standards: ReturnType<typeof sdkCollection<'standards'>>
    clauses: ReturnType<typeof sdkCollection<'clauses'>>
  }
  entangledCatalog: {
    id: string
    theorem: string
    module: string
    statement: string
    entanglementCount: number
    entanglements: { targetTheorem: string; targetProduct: string; direction: string; variantId: string; mcpTool: Record<string, unknown> }[]
    mcpTools: Record<string, unknown>[]
  }[]
  initialPqc: {
    kem: ReturnType<typeof kemRound>
    dsa: ReturnType<typeof dsaRound>
  }
}

declare const data: StudioSeed
export { data }

const FEATURED_THEOREMS = [
  'Advantage.advantage_unbounded',
  'Advantage.two_pow_le_space',
  'Advantage.fold_upper_onto_lower',
  'Qpu.Physics.EquivalencePrinciple.cern_alpha_g_rules_out_antigravity',
  'Qpu.Physics.EquivalencePrinciple.nist_codata_G_positive_interval',
  'Qpu.Physics.EquivalencePrinciple.weak_equivalence_mass_cancels',
  'textbook_capacity_conserved',
  'textbook_grover_search',
  'textbook_tamper_detected',
  'textbook_shor_reduction',
  'textbook_uuid_is_36',
  'textbook_payload_operations',
] as const

export default defineLoader({
  async load(): Promise<StudioSeed> {
    const [
      { googleDiscoveryDocument, googleIntegrations, payloadUiManifest, sdkCollection, sdkFindById, sdkSummary },
      { quantumPivot },
      { gqaiAppsScript, gqaiChallengeMatrix },
      { ecommerceSeoToolboxes },
      { clay1000Research },
      { rbacAudit },
      { EXAMPLES },
      { dsaRound, kemRound },
      { THEOREMS },
      { style },
      { LICENSE },
    ] = await Promise.all([
      import('../../../../src/quantum/uuid/programs/sdk/index.ts'),
      import('../../../../src/quantum/uuid/programs/e/7/a/6/d/5/2/2/index.ts'),
      import('../../../../src/quantum/uuid/programs/gqai/index.ts'),
      import('../../../../src/quantum/uuid/programs/seo/index.ts'),
      import('../../../../src/quantum/uuid/programs/clay/thousand/index.ts'),
      import('../../../../src/quantum/uuid/programs/rbac/index.ts'),
      import('../../../../src/quantum/uuid/programs/9/d/4/f/e/4/4/2/index.ts'),
      import('../../../../src/quantum/uuid/programs/4/3/a/3/9/a/e/6/index.ts'),
      import('../../../../src/quantum/uuid/programs/3/f/0/e/7/a/6/f/index.ts'),
      import('../../../../src/quantum/uuid/programs/2/7/1/a/7/6/4/9/index.ts'),
      import('../../../../src/quantum/uuid/programs/a/f/3/d/e/a/5/f/index.ts'),
    ])
    const manifest = payloadUiManifest()
    const summary = sdkSummary()
    const pivot = quantumPivot()
    const google = googleIntegrations()
    const discovery = googleDiscoveryDocument()
    const gqai = gqaiChallengeMatrix()
    const appsScript = gqaiAppsScript()
    const seoToolboxes = ecommerceSeoToolboxes(EXAMPLES)
    const clay1000 = clay1000Research()
    const rbac = rbacAudit()
    const featuredKeys = FEATURED_THEOREMS.filter((k) => THEOREMS.some((t) => t.key === k))
    const entangledCatalog = featuredKeys
      .map((k) => sdkFindById('products', k))
      .filter((d): d is NonNullable<typeof d> => d !== null)
      .map((d) => ({
        id: String(d.id),
        theorem: String(d.theorem),
        module: String(d.module),
        statement: String(d.statement),
        entanglementCount: Number(d.entanglementCount ?? 0),
        entanglements: Array.isArray(d.entanglements) ? d.entanglements as StudioSeed['entangledCatalog'][number]['entanglements'] : [],
        mcpTools: Array.isArray(d.mcpTools) ? d.mcpTools as Record<string, unknown>[] : [],
      }))
    const featuredProduct = entangledCatalog[0] ?? (sdkFindById('products', THEOREMS[0]!.key) as Record<string, unknown>)
    return {
      manifest,
      summary,
      pivot,
      google,
      discovery,
      gqai,
      appsScript,
      seoToolboxes,
      clay1000,
      rbac,
      featuredProduct,
      collections: {
        products: sdkCollection('products', 1, 24),
        variants: sdkCollection('variants', 1, 24),
        variantTypes: sdkCollection('variantTypes', 1, 20),
        variantOptions: sdkCollection('variantOptions', 1, 50),
        computations: sdkCollection('computations', 1, 50),
        standards: sdkCollection('standards', 1, 50),
        clauses: sdkCollection('clauses', 1, 100),
      },
      entangledCatalog,
      period: style(LICENSE.address).vars['--qpu-period']!,
      initialPqc: {
        kem: kemRound({ algorithm: 'X-Wing' }),
        dsa: dsaRound({ algorithm: 'ML-DSA-65' }, 'ISO/IEC 4879:2024 · @uuidna/qpu'),
      },
    }
  },
})
