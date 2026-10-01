/**
 * Quantum MCP Server
 * Executable proof system: agents call formulas directly
 * Uses centralized operations registry (DRY)
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js'

import {
  ResponseFormatter,
  WaveExecutor,
  AnalysisExecutor,
  ToolRegistry,
  InputValidator,
  handleOperationError
} from './mcp-common-operations.js'
import { QuantumHardwareValidator, QuantumConvergenceValidator } from './quantum-hardware-validator.js'

const server = new Server({
  name: 'quantum-mcp-server',
  version: '1.0.0'
})

// ============================================================================
// LIST TOOLS: Use centralized registry
// ============================================================================

server.setRequestHandler(ListToolsRequestSchema, () => ({
  tools: ToolRegistry.getAllTools()
}))

// ============================================================================
// TOOL HANDLER: Route to appropriate implementation
// ============================================================================

async function handleToolCall(name: string, input: Record<string, unknown>): Promise<string> {
  try {
    switch (name) {
      case 'quantum-prove-formula':
        return await handleFormulaProof(
          input.formula_name as string,
          input.show_proof as boolean
        )

      case 'quantum-wave-execute':
        return await handleWaveExecution(
          input.domain as string,
          input.max_steps as number
        )

      case 'quantum-convergence-analyze':
        return await handleConvergenceAnalysis(
          input.domain as string,
          input.iterations as number
        )

      case 'quantum-discover-relationships':
        return await handleRelationshipDiscovery(
          input.show_proof_chain as boolean
        )

      case 'quantum-verify-all-proofs':
        return await handleProofVerification(
          input.format as string
        )

      case 'quantum-hardware-validate':
        return await handleHardwareValidation(
          input.formula_name as string,
          input.expected_value as number,
          input.qubits as number
        )

      case 'quantum-hardware-convergence':
        return await handleHardwareConvergence(
          input.formula_name as string,
          input.expected_value as number,
          input.iterations as number
        )

      case 'quantum-circuit-proof':
        return await handleCircuitProof(
          input.formula_name as string,
          input.show_qasm as boolean
        )

      default:
        return `Unknown tool: ${name}`
    }
  } catch (err) {
    const error = handleOperationError(err)
    return error.content
  }
}

// ============================================================================
// FORMULA OPERATIONS: Using centralized formatters
// ============================================================================

async function handleFormulaProof(formulaName: string, showProof: boolean): Promise<string> {
  const validated = InputValidator.validateFormulaName(formulaName)
  const response = ResponseFormatter.formatFormulaProof(validated, showProof)
  return response.content
}

async function handleWaveExecution(domain: string | undefined, maxSteps: number | undefined): Promise<string> {
  const validDomain = InputValidator.validateDomain(domain)
  const validSteps = InputValidator.validateMaxSteps(maxSteps)
  const wave = await WaveExecutor.execute(validDomain, validSteps)
  const response = ResponseFormatter.formatWaveResult(wave)
  return response.content
}

async function handleConvergenceAnalysis(domain: string | undefined, iterations: number | undefined): Promise<string> {
  const validDomain = InputValidator.validateDomain(domain)
  const validIterations = InputValidator.validateIterations(iterations)
  const analysis = await AnalysisExecutor.analyzeConvergence(validDomain, validIterations)
  const response = ResponseFormatter.formatConvergenceResult(analysis)
  return response.content
}

async function handleRelationshipDiscovery(_showProofChain: boolean): Promise<string> {
  const relationships = AnalysisExecutor.discoverRelationships()
  const response = ResponseFormatter.formatDiscoveredRelationships(relationships)
  return response.content
}

async function handleProofVerification(format: string | undefined): Promise<string> {
  const validFormat = InputValidator.validateFormat(format)
  // Format parameter not actually used in formatProofVerification
  void validFormat
  const response = ResponseFormatter.formatProofVerification()
  return response.content
}

// ============================================================================
// QUANTUM HARDWARE OPERATIONS
// ============================================================================

async function handleHardwareValidation(
  formulaName: string,
  expectedValue: number,
  qubits: number = 7
): Promise<string> {
  try {
    const result = await QuantumHardwareValidator.validateFormula(formulaName, expectedValue, qubits)
    const response = ResponseFormatter.formatHardwareValidation(result)
    return response.content
  } catch (e) {
    return `Error validating quantum hardware: ${e instanceof Error ? e.message : String(e)}`
  }
}

async function handleHardwareConvergence(
  formulaName: string,
  expectedValue: number,
  iterations: number = 5
): Promise<string> {
  try {
    const result = await QuantumConvergenceValidator.validateConvergence(formulaName, expectedValue, iterations)
    const response = ResponseFormatter.formatHardwareConvergence(result)
    return response.content
  } catch (e) {
    return `Error testing convergence: ${e instanceof Error ? e.message : String(e)}`
  }
}

async function handleCircuitProof(formulaName: string, showQasm: boolean = false): Promise<string> {
  try {
    const result = await QuantumHardwareValidator.validateFormula(formulaName, 0)
    const response = ResponseFormatter.formatCircuitProof(result, showQasm)
    return response.content
  } catch (e) {
    return `Error generating circuit proof: ${e instanceof Error ? e.message : String(e)}`
  }
}

// ============================================================================
// TOOL CALL HANDLER
// ============================================================================

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const result = await handleToolCall(request.params.name, request.params.arguments as Record<string, unknown>)
  return {
    content: [
      {
        type: 'text',
        text: result
      }
    ]
  }
})

// ============================================================================
// SERVER STARTUP
// ============================================================================

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch(console.error)
