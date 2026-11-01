// Quantum: the whole domain, one source. All quantum code lives under this folder — nothing quantum is defined anywhere
// else, and anything outside (scripts, the Payload app) reaches it only through here. The domain is two folders: the
// processing (./processing — the verbs that answer a call) over the unit (./processing/unit — the irreducible core and
// its Lean kernel). This index is the single public surface: import the QPU from '@uuidna/qpu', never from a leaf file.

// the unit: the QPU identity, the unscoped account, and the tenant-address resolver (subdomain == origin path)
export * from './processing/unit/index.ts'
// the processing: the handler and the tool caller — how a call is answered
export { handle, handleBatch, callOf, toolCallerOf, chatOf, TOOLBOXES, type Rpc, type Reply } from './processing/index.ts'
// the core primitives the unit is built from: the σ-address and its readings
export { uuidOf, reflectionOf, sealOf, styleOf, neighboursOf, blockOf, verifyOf } from './processing/unit/blocks.ts'
