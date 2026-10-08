export { adminPlugin, collectionPlugin, corsPlugin, editorPlugin, globalPlugin, seedPlugin, typescriptPlugin } from './surface.js'
export { billingPlugin, usageBillOf } from './billing.js'
export { postQuantumUpgradeOf, upgradePlugin } from './upgrade.js'
export { clayPrizeOf, openMathScaleOf } from './clay.js'
export { clayVideosOf, videoParseOf, videoParserOf, videoPlugin } from './video.js'
export { domainReadingsOf, domainsPlugin } from './domains.js'
export { connectorExamOf, permaAnswerOf, permaManOf, permaTenantOf, permaculturePlugin, permacultureVisionOf, publicConnectorOf, valueForMoneyOf } from './permaculture.js'
export { payloadLeadsOf } from './leads.js'
export { licenseManageOf, networkMachineOf, pluginAxisLengthOf, publicSurfaceOf, unpagedLayoutBlocksOf, variantLeadOf } from './public.js'

import { CLOUDFLARE_PLUGINS } from '../../deployment/payload-cloudflare.js'

/** Plugins a combination fuses, read off the axis. Nothing is passed in. Billing, the post-quantum upgrade, and the
 *  surface plugins the generator emits are in every combination; the key names the optional official subset. */
export const fusedPluginsOf = () => ({
  axis: [...CLOUDFLARE_PLUGINS],
  always: ['editor', 'admin', 'collection', 'global', 'cors', 'typescript', 'seed', 'billing', 'upgrade', 'video', 'domains', 'permaculture'] as const,
})
