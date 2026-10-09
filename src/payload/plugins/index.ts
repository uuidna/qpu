export { adminPlugin, collectionPlugin, corsPlugin, editorPlugin, globalPlugin, seedPlugin, typescriptPlugin } from './surface.js'
export { billingPlugin, usageBillOf } from './billing.js'
export { postQuantumUpgradeOf, upgradePlugin } from './upgrade.js'
export { clayPrizeOf, claySealReadingsOf, openMathScaleOf, type ClaySealReading } from './clay.js'
export { clayVideosOf, videoParseOf, videoParserOf, videoPlugin } from './video.js'
export { domainReadingsOf, domainsPlugin } from './domains.js'
export { connectorAnswerOf, connectorExamOf, connectorUseOf, permaAnswerOf, permaManOf, permaTenantOf, permaculturePlugin, permacultureVisionOf, publicConnectorOf, valueForMoneyOf } from './permaculture.js'
export { raidCompareOf, raidCompareHolds, type RaidClaimRow } from './raid-compare.js'
export {
  VERBOSITY_CAP,
  observeAtVerbosityOf,
  observeOf,
  observabilityPlugin,
  publicObserveOf,
  receiptObservabilityOf,
  type ObserveReading,
  type ReceiptObservability,
  type ReceiptObserveInput,
  type Verbosity,
} from './observability.js'
export {
  compactOf,
  coolFormulasOf,
  onlineModeOf,
  publicWaitsOf,
  redactSecretsOf,
  sealPayloadOf,
  secretsInOf,
  slowChainOf,
  tokenUsageOf,
  tokensPlugin,
  waitsAnswerOf,
  waitsAuditOf,
  type LevelModeCell,
  type TokenTarget,
  type TokenUsageRow,
  type WaitRow,
} from './tokens.js'
export { payloadLeadsOf } from './leads.js'
export { pointOf, pointPlugin, publicPointOf } from './point.js'
export { constraintsOf, constraintsPlugin, publicConstraintsOf } from './constraints.js'
export {
  accessExecuteGateOf,
  accessScreenGateOf,
  connectBillGateOf,
  cryptDigestGateOf,
  discoverCapacityGateOf,
  gateCourtOf,
  gateCourtPlugin,
  gateCourtTrialOf,
  priceRelationGateOf,
  publicGateCourtOf,
  type GateCall,
  type GateCourtCase,
  type GateCourtArgs,
} from './gate-court.js'
export {
  goalOf,
  goalPlugin,
  goalStateOf,
  publicGoalOf,
  type GoalCombo,
  type GoalInput,
  type GoalReading,
} from './goal.js'
export { examOf, examPlugin, publicExamOf, type ExamHop } from './exam.js'
export { publicWaveOf, wavePlugin, waveSweepGridOf } from './wave.js'
export {
  ACCESS_PARAMS,
  CLOUD_PARAMS,
  COMBINATORICS_PARAMS,
  CRYPT_PARAMS,
  ECOMMERCE_FORMULAS,
  ECOMMERCE_PARAMS,
  FUSED_SALE_DOORS,
  NEED_FIELDS,
  UNIX_HANDLES,
  UNIX_MODE_BITS,
  UNIX_MODE_DIGITS,
  UNIX_MODE_LABELS,
  UNIX_UGO,
  ecommerceCatalogPlugin,
  ecommerceSoldTenantsOf,
  formulatedCatalogOf,
  formulatedEnumsOf,
  formulatedModelsOf,
  formulatedProductVariantOf,
  formulatedTenantsOf,
  publicEcommerceOf,
  type EnumImproves,
  type FormulatedEnum,
  type FormulatedModel,
  type FormulatedTenant,
  type McpEnumOption,
} from './ecommerce.js'
export {
  formulatedTenantsOf as mcpFormulatedTenantsOf,
  publicTenantsOf,
  tenantResolveOf,
  tenantServeOf,
  tenantsPlugin,
  type TenantModel,
  type TenantNeed,
  type TenantRecord,
} from './tenants.js'
export {
  modeAccessOf,
  modeBitsOf,
  publicAccessOf,
  accessModePlugin,
  unixModeEnumsOf,
  RWX,
  UGO,
} from './access-mode.js'
export {
  NATIVE_SHAPES,
  NATIVE_VENDORS,
  nativeAdapterEnumOf,
  nativeAdaptersOf,
  nativeAdaptersPlugin,
  nativeAnswerOf,
  nativeGateOf,
  nativeGatesFromOf,
  nativeJobOf,
  nativeQasmOf,
  nativeShotGridOf,
  publicNativeOf,
  type NativeAdapter,
  type NativeGate,
  type NativeShape,
  type NativeVendor,
} from './native-adapters.js'
export {
  catalogPriceRelationOf,
  nativeJobPriceOf,
  priceCourtTrialOf,
  priceRelationOf,
  type PriceCourtTrial,
  type PriceLeg,
  type PriceRelation,
  type PriceRelationInput,
  type PriceTicket,
} from './price-relation.js'
export {
  PUBLIC_DOORS,
  accessSurfaceOf,
  licenseManageOf,
  networkMachineOf,
  pluginAxisLengthOf,
  publicCiteOf,
  publicCssOf,
  publicDoorFetchOf,
  publicMcpOf,
  publicPlugin,
  publicSurfaceOf,
  saleRoyaltyOf,
  variantLeadOf,
} from './public.js'
export {
  CHAT_SEARCH_FRAMEWORKS,
  chatSearchOf,
  chatSearchPlugin,
  distroOf,
  distroPathOf,
  publicChatSearchOf,
  type ChatSearchFramework,
} from './chat-search.js'
export {
  cloudflareAccountOf,
  cloudflareAccountPlugin,
  cloudflareTreeBindingsOf,
  publicCloudflareOf,
} from './cloudflare-account.js'

import { CLOUDFLARE_PLUGINS } from '../../deployment/payload-cloudflare.js'

/** Plugins a combination fuses, read off the axis. Nothing is passed in. Billing, the post-quantum upgrade, and the
 *  surface plugins the generator emits are in every combination; the key names the optional official subset. */
export const fusedPluginsOf = () => ({
  axis: [...CLOUDFLARE_PLUGINS],
  always: ['editor', 'admin', 'collection', 'global', 'cors', 'typescript', 'seed', 'billing', 'upgrade', 'video', 'domains', 'permaculture', 'public', 'wave'] as const,
})
