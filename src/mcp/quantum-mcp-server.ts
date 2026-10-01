import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { ResponseFormatter, WaveExecutor, AnalysisExecutor, ToolRegistry, InputValidator, handleOperationError } from './mcp-common-operations.js'
import { QuantumHardwareValidator, QuantumConvergenceValidator } from './quantum-hardware-validator.js'

const server = new Server({ name: 'quantum-mcp-server', version: '1.0.0' })

server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: ToolRegistry.getAllTools() }))

async function handleToolCall(n: string, i: Record<string, unknown>): Promise<string> {
  try {
    switch (n) {
      case 'quantum-prove-formula': return await handleFormulaProof(i.formula_name as string, i.show_proof as boolean)
      case 'quantum-wave-execute': return await handleWaveExecution(i.domain as string, i.max_steps as number)
      case 'quantum-convergence-analyze': return await handleConvergenceAnalysis(i.domain as string, i.iterations as number)
      case 'quantum-discover-relationships': return await handleRelationshipDiscovery()
      case 'quantum-verify-all-proofs': return await handleProofVerification()
      case 'quantum-hardware-validate': return await handleHardwareValidation(i.formula_name as string, i.expected_value as number, i.qubits as number)
      case 'quantum-hardware-convergence': return await handleHardwareConvergence(i.formula_name as string, i.expected_value as number, i.iterations as number)
      case 'quantum-circuit-proof': return await handleCircuitProof(i.formula_name as string, i.show_qasm as boolean)
      default: return `Unknown tool: ${n}`
    }
  } catch (e) {
    const err = handleOperationError(e)
    return err.content
  }
}

async function handleFormulaProof(n: string, s: boolean): Promise<string> {
  const v = InputValidator.validateFormulaName(n)
  return ResponseFormatter.formatFormulaProof(v, s).content
}

async function handleWaveExecution(d: string | undefined, m: number | undefined): Promise<string> {
  const wd = InputValidator.validateDomain(d)
  const ws = InputValidator.validateMaxSteps(m)
  const w = await WaveExecutor.execute(wd, ws)
  return ResponseFormatter.formatWaveResult(w).content
}

async function handleConvergenceAnalysis(d: string | undefined, i: number | undefined): Promise<string> {
  const vd = InputValidator.validateDomain(d)
  const vi = InputValidator.validateIterations(i)
  const a = await AnalysisExecutor.analyzeConvergence(vd, vi)
  return ResponseFormatter.formatConvergenceResult(a).content
}

async function handleRelationshipDiscovery(): Promise<string> {
  const r = AnalysisExecutor.discoverRelationships()
  return ResponseFormatter.formatDiscoveredRelationships(r).content
}

async function handleProofVerification(): Promise<string> {
  return ResponseFormatter.formatProofVerification().content
}

async function handleHardwareValidation(fn: string, ev: number, q: number = 7): Promise<string> {
  try {
    const res = await QuantumHardwareValidator.validateFormula(fn, ev, q)
    return ResponseFormatter.formatHardwareValidation(res).content
  } catch (e) {
    return `Error validating hardware: ${e instanceof Error ? e.message : String(e)}`
  }
}

async function handleHardwareConvergence(fn: string, ev: number, it: number = 5): Promise<string> {
  try {
    const res = await QuantumConvergenceValidator.validateConvergence(fn, ev, it)
    return ResponseFormatter.formatHardwareConvergence(res).content
  } catch (e) {
    return `Error testing convergence: ${e instanceof Error ? e.message : String(e)}`
  }
}

async function handleCircuitProof(fn: string, qa: boolean = false): Promise<string> {
  try {
    const res = await QuantumHardwareValidator.validateFormula(fn, 0)
    return ResponseFormatter.formatCircuitProof(res, qa).content
  } catch (e) {
    return `Error generating circuit: ${e instanceof Error ? e.message : String(e)}`
  }
}

server.setRequestHandler(CallToolRequestSchema, async (req) => ({
  content: [{ type: 'text', text: await handleToolCall(req.params.name, req.params.arguments as Record<string, unknown>) }]
}))

async function main() {
  await server.connect(new StdioServerTransport())
}

main().catch(console.error)
