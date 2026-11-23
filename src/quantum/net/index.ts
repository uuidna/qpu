// Network adapters. Bindings are names. Values never travel.

import { BINDING_NAMES, BINDINGS } from './bindings/index.ts'
import { cloudflareAdapters } from './cloudflare.ts'

export { BINDING_NAMES, BINDINGS, cloudflareAdapters }

const net = { bindings: BINDINGS, names: BINDING_NAMES }
export default net
