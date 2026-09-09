// cloudflare — fused Worker bindings + drivers at src/bindings/cloudflare.
import type { ProviderModule } from '../types.js'
import { CLOUDFLARE_BINDINGS } from './kinds.js'
import { cloudflareDrive, cloudflareReadingsOf } from './drivers.js'

export { CLOUDFLARE_BINDINGS, cloudflareBindingOf } from './kinds.js'
export { cloudflareDrive, cloudflareReadingsOf, qpuKeyOf } from './drivers.js'
export { mockCloudflareEnv } from './mock.js'
export type { QpuEnv } from '../env.js'

export const cloudflare: ProviderModule = {
  name: 'cloudflare',
  seat: 'bound',
  bindings: CLOUDFLARE_BINDINGS,
  readings: cloudflareReadingsOf,
  drive: cloudflareDrive,
}
