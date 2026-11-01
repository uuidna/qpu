// Processing: how the unit answers a call. Every tool is a pure function that takes typed parameters and compiles the
// circuit they describe; the handler routes a JSON-RPC message to one and returns its block. This is the processing
// layer's one surface — the verbs — over the unit (./unit) it computes on. Pure: nothing here does I/O.

export { handle, handleBatch, callOf, toolCallerOf, chatOf, TOOLBOXES, type Rpc, type Reply } from './mcp.ts'
export type { Toolbox } from './toolbox.ts'
