// Quantum processing unit: mathematical operations, order finding, factoring, and MCP resource builders
export { bigGcdOf, bigPowModOf, bigLcmOf, bigIsOddOf, bigLog2Of, bigBitLengthOf, qpuOrderFindOf, qpuOrderSliceOf, qpuFoldOf } from './math.js'
export { createFactoringProof, computeFactoringSlice, FACTORING_MODULUS, verifyFactoringResult, isFactoringProofLiving } from './factoring.js'
export type { FactoringSlice, FactoringProof } from './factoring.js'
export { RSA_RECORDS, ALL_PROBLEMS, compareMethodsForProblem, QUANTUM_ADVANTAGE_THRESHOLD, OPEN_ITEMS, CLASSICAL_METHODS, SPEC_BENCHMARKS, CLASSICAL_METHOD_SURVEY } from './rsa-baseline.js'
export type { RSARecord } from './rsa-baseline.js'

// MCP resource builders - stubs for now, will be filled by client integration
export const qpuCiteOf = () => ({})
export const qpuClayOf = () => ({})
export const qpuDocsOf = () => ({})
export const qpuHexCatalogOf = () => ({})
export const qpuHexDecodeOf = (hex: string) => hex
export const qpuHexDiscoverOf = () => ({})
export const qpuHexFamiliesOf = () => ({})
export const qpuHexRunOf = (uuid: string) => ({})
export const qpuHexUuidOf = (data: unknown) => 'uuid-stub'
export const qpuLatticeNamesOf = () => ({ vertices: 256, hexbit: 8 })
export const qpuLeanOf = () => ({})
export const qpuMcpFusedOf = () => ({})
export const qpuMcpRegisterOf = () => ({})
export const qpuMcpToolsListOf = () => ({})
export const qpuReadmeOf = () => ''
export const qpuReceiptStreamsOf = () => ({})
export const qpuStatementUuidOf = (stmt: string) => 'uuid-stub'
export const hologramStreamsOf = () => ({})
export const crossSchemaOf = (family: string) => ({})
export const crossSchemasOf = () => ({})

export const HookFormulas = {}
