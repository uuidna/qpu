// Processing: how the unit answers a call. Every tool is a pure function that takes typed parameters and compiles the
// circuit they describe; the handler routes a JSON-RPC message to one and returns its block. This is the processing
// layer's one surface — the verbs — over the unit (./unit) it computes on. Pure: nothing here does I/O.

export { handle, handleBatch, call, caller, chat, TOOLBOXES, type Rpc, type Reply } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'
export type { Toolbox } from '../../../../../../../../d/e/7/d/b/7/1/6/index.ts'
