// Quantum Processing Unit. Quantum information processing (ISO/IEC 4879:2024, 3.4.1). A quantum simulator (3.4.22) simulates
// quantum circuits (3.4.5) and quantum systems (3.2.6). The Clay register is integer arithmetic. ISO/IEC 4879:2024 names the
// device a quantum processor (3.4.8). The core is ./uuid: one UUID (ISO/IEC 9834-8). The unit
// (./processing/unit) is built on it. Pages are stored with Payload's local API (./payload).

import fs from './fs/index.ts'
import net from './net/index.ts'
import os from './os/index.ts'
import calculator from './apps/index.ts'
import engine from './engine/index.ts'

// the core: the UUID address and everything that reads it
export { uuid, reflection, seal, style, neighbours, block, verify, coins, quantumSku, organiseQubits } from './uuid/index.ts'
// pages, through Payload's local API: find, create, update
export { findPage, openPages, pageData, savePage, saveSeed, writeArgs, findArgs, recordAgrees, seedsSynced, syncSeeds, linkSeedParents, seedWaves, mcpPages } from './payload/index.ts'
// Quantum OS, imported from its source
export { os }
// the filesystem, through the adapter the part names
export { fs }
export { net }
// the calculator, including division by zero
export { calculator }
export { seeds, play, impact, capabilities } from './engine/index.ts'
export { engine }
// the unit: the unscoped account and the tenant-address resolver, over the core
export * from './processing/unit/index.ts'
// the processing: the handler and the tool caller — how a call is answered
export { handle, handleBatch, call, caller, chat, TOOLBOXES, type Rpc, type Reply } from './processing/index.ts'
export { plugins } from './plugin.ts'
