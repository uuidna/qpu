/**
 * QPU Orchestration MCP - Autonomous Input Router
 *
 * Understands arbitrary input and routes to appropriate quantum MCPs
 * Makes the system truly autonomous - paste anything, it figures out what to do
 */

import { getAllProofs, getProofByID, getProofsSummary } from '../quantum/quantum-solver.js'
import { solveQuantumProblem, estimateResources, findProblems, optimizeProblemSolving } from './quantum-optimizer-mcp.js'
import { generateQuantumProofDashboard, generateAllQuantumProofs } from './quantum-proofs-mcp.js'

// ============================================================================
// INTENT DETECTION
// ============================================================================

export type Intent =
  | 'list_problems'
  | 'show_summary'
  | 'solve_problem'
  | 'estimate_resources'
  | 'find_solvable'
  | 'optimize_algorithm'
  | 'show_dashboard'
  | 'describe_problem'
  | 'explain_algorithm'
  | 'unknown'

export interface ParsedInput {
  intent: Intent
  problemId?: string
  algorithm?: string
  maxQubits?: number
  rawInput: string
  confidence: number
}

/**
 * Parse arbitrary input and detect intent
 */
export function parseInput(input: string): ParsedInput {
  const lower = input.toLowerCase().trim()

  // Extract problem IDs from common patterns
  const problemIdMatch = lower.match(
    /(?:rsa-?\d+|maxcut|tsp|3-?sat|clique|portfolio|lih|ising|lithium)/i
  )
  let problemId = problemIdMatch
    ? problemIdMatch[0].toLowerCase()
    : undefined

  // Normalize problem IDs to match actual database format
  if (problemId) {
    // Ensure RSA problems have hyphens: rsa260 -> rsa-260
    problemId = problemId.replace(/^rsa(\d+)$/, 'rsa-$1')
  }

  // Algorithm detection
  const algorithmMatch = lower.match(
    /shor|qaoa|vqe|grover|phase estimation|teleportation|adiabatic/i
  )
  const algorithm = algorithmMatch ? algorithmMatch[0].toLowerCase() : undefined

  // Qubit detection
  const qubitMatch = lower.match(/(\d+)\s*qubits?/)
  const maxQubits = qubitMatch ? parseInt(qubitMatch[1]) : undefined

  // Intent detection patterns
  if (/^(list|show|all|enumerate|what are|get all)/.test(lower)) {
    return {
      intent: 'list_problems',
      rawInput: input,
      confidence: 0.95
    }
  }

  if (/summary|stats|statistics|overview|how many/.test(lower)) {
    return {
      intent: 'show_summary',
      rawInput: input,
      confidence: 0.9
    }
  }

  if (/solve|break|factor|crack|compute|find solution/.test(lower)) {
    if (problemId) {
      return {
        intent: 'solve_problem',
        problemId,
        rawInput: input,
        confidence: 0.9
      }
    }
    return {
      intent: 'unknown',
      rawInput: input,
      confidence: 0.3
    }
  }

  if (/resources?|qubits?|gates?|time|estimate|requirements?|how.*needed/.test(lower)) {
    if (problemId) {
      return {
        intent: 'estimate_resources',
        problemId,
        rawInput: input,
        confidence: 0.9
      }
    }
    return {
      intent: 'unknown',
      rawInput: input,
      confidence: 0.3
    }
  }

  if (/find|solvable|which.*can|what.*possible|feasible/.test(lower)) {
    if (maxQubits) {
      return {
        intent: 'find_solvable',
        maxQubits,
        rawInput: input,
        confidence: 0.85
      }
    }
    return {
      intent: 'unknown',
      rawInput: input,
      confidence: 0.2
    }
  }

  if (/optimize|best|improve|which.*better|prefer/.test(lower)) {
    if (problemId || algorithm) {
      return {
        intent: 'optimize_algorithm',
        problemId,
        algorithm,
        rawInput: input,
        confidence: 0.8
      }
    }
    return {
      intent: 'unknown',
      rawInput: input,
      confidence: 0.2
    }
  }

  if (/dashboard|view|visualize|display|show.*all/.test(lower)) {
    return {
      intent: 'show_dashboard',
      rawInput: input,
      confidence: 0.85
    }
  }

  if (/describe|what is|tell.*about|explain.*problem|details/.test(lower) && problemId) {
    return {
      intent: 'describe_problem',
      problemId,
      rawInput: input,
      confidence: 0.85
    }
  }

  if (/explain|how.*work|algorithm|understand/.test(lower) && algorithm) {
    return {
      intent: 'explain_algorithm',
      algorithm,
      rawInput: input,
      confidence: 0.8
    }
  }

  return {
    intent: 'unknown',
    rawInput: input,
    confidence: 0.1
  }
}

// ============================================================================
// ACTION EXECUTION
// ============================================================================

export interface ActionResult {
  intent: Intent
  success: boolean
  data?: any
  error?: string
  summary: string
}

/**
 * Execute action based on parsed intent
 */
export function executeAction(parsed: ParsedInput): ActionResult {
  try {
    switch (parsed.intent) {
      case 'list_problems': {
        const proofs = getAllProofs()
        return {
          intent: 'list_problems',
          success: true,
          data: proofs.map(p => ({
            id: p.id,
            name: p.name,
            status: p.status,
            speedup: p.complexity.speedup
          })),
          summary: `Found ${proofs.length} quantum problems`
        }
      }

      case 'show_summary': {
        const summary = getProofsSummary()
        return {
          intent: 'show_summary',
          success: true,
          data: summary,
          summary: `✅ Solved: ${summary.solved}, 🔄 Solving: ${summary.solving}, 🔓 Open: ${summary.open}`
        }
      }

      case 'solve_problem': {
        if (!parsed.problemId) {
          return {
            intent: 'solve_problem',
            success: false,
            error: 'Problem ID required',
            summary: 'Could not identify which problem to solve'
          }
        }
        const solution = solveQuantumProblem(parsed.problemId)
        return {
          intent: 'solve_problem',
          success: true,
          data: solution,
          summary: `✅ ${solution.problemName}: ${solution.speedup} speedup, Status: ${solution.status}`
        }
      }

      case 'estimate_resources': {
        if (!parsed.problemId) {
          return {
            intent: 'estimate_resources',
            success: false,
            error: 'Problem ID required',
            summary: 'Could not identify which problem'
          }
        }
        const resources = estimateResources(parsed.problemId)
        return {
          intent: 'estimate_resources',
          success: true,
          data: resources,
          summary: `${parsed.problemId}: ${resources.qubitsNeeded} qubits, ${resources.gateDepth} gates, ${resources.estimatedTime}`
        }
      }

      case 'find_solvable': {
        if (parsed.maxQubits === undefined) {
          return {
            intent: 'find_solvable',
            success: false,
            error: 'Qubit count required',
            summary: 'Could not parse qubit count'
          }
        }
        const problems = findProblems(parsed.maxQubits)
        return {
          intent: 'find_solvable',
          success: true,
          data: problems,
          summary: `Found ${problems.length} problems solvable with ${parsed.maxQubits} qubits`
        }
      }

      case 'optimize_algorithm': {
        if (!parsed.problemId && !parsed.algorithm) {
          return {
            intent: 'optimize_algorithm',
            success: false,
            error: 'Problem or algorithm required',
            summary: 'Could not determine what to optimize'
          }
        }
        const problem = parsed.problemId || parsed.algorithm || ''
        const optimized = optimizeProblemSolving(problem)
        if ('error' in optimized) {
          return {
            intent: 'optimize_algorithm',
            success: false,
            error: optimized.error,
            summary: 'No matching problems found'
          }
        }
        return {
          intent: 'optimize_algorithm',
          success: true,
          data: optimized,
          summary: `✅ Best algorithm: ${optimized.algorithm}, ${optimized.complexity.speedup} speedup`
        }
      }

      case 'show_dashboard': {
        const dashboard = generateQuantumProofDashboard()
        const allProofs = generateAllQuantumProofs()
        return {
          intent: 'show_dashboard',
          success: true,
          data: {
            summary: dashboard.summary,
            proofs: allProofs
          },
          summary: `Dashboard: ${dashboard.summary.total} problems, ${dashboard.summary.solved} solved`
        }
      }

      case 'describe_problem': {
        if (!parsed.problemId) {
          return {
            intent: 'describe_problem',
            success: false,
            error: 'Problem ID required',
            summary: 'Could not identify problem'
          }
        }
        const proof = getProofByID(parsed.problemId)
        if (!proof) {
          return {
            intent: 'describe_problem',
            success: false,
            error: `Problem ${parsed.problemId} not found`,
            summary: 'Problem not found in database'
          }
        }
        return {
          intent: 'describe_problem',
          success: true,
          data: proof,
          summary: `${proof.name}: ${proof.algorithm}, ${proof.complexity.speedup} speedup, ${proof.resources.qubits} qubits`
        }
      }

      case 'explain_algorithm': {
        const allProofs = getAllProofs()
        const problems = allProofs.filter(p =>
          p.algorithm.toLowerCase().includes((parsed.algorithm || '').toLowerCase())
        )
        return {
          intent: 'explain_algorithm',
          success: true,
          data: {
            algorithm: parsed.algorithm,
            problems: problems.map(p => ({
              name: p.name,
              speedup: p.complexity.speedup,
              complexity: p.complexity
            }))
          },
          summary: `${parsed.algorithm}: Used for ${problems.length} problems`
        }
      }

      case 'unknown': {
        return {
          intent: 'unknown',
          success: false,
          error: 'Could not understand request',
          summary: `Sorry, I didn't understand: "${parsed.rawInput}". Try: "list", "solve RSA-260", "estimate qubits for TSP", etc.`
        }
      }

      default:
        return {
          intent: 'unknown',
          success: false,
          error: 'Unknown intent',
          summary: 'An unexpected error occurred'
        }
    }
  } catch (error) {
    return {
      intent: parsed.intent,
      success: false,
      error: String(error),
      summary: `Error executing ${parsed.intent}`
    }
  }
}

// ============================================================================
// ORCHESTRATION API
// ============================================================================

/**
 * Main orchestration function - parse input and execute
 * This is the entry point for autonomous operation
 */
export function process(userInput: string): ActionResult {
  const parsed = parseInput(userInput)

  // If confidence is too low, return helpful guidance
  if (parsed.confidence < 0.3 && parsed.intent === 'unknown') {
    return {
      intent: 'unknown',
      success: false,
      error: 'Low confidence parse',
      summary: `Not sure what you meant by: "${userInput}"\n\nTry asking:\n  • List all problems\n  • Solve RSA-260\n  • How many qubits for TSP-500?\n  • Find solvable problems with 100 qubits\n  • Explain QAOA algorithm`
    }
  }

  return executeAction(parsed)
}

// ============================================================================
// MCP TOOL DEFINITIONS
// ============================================================================

export const orchestrationMCPTools = [
  {
    name: 'understand_input',
    description: 'Parse arbitrary user input and detect intent',
    inputSchema: {
      type: 'object',
      properties: {
        input: {
          type: 'string',
          description: 'Any user input about quantum problems'
        }
      },
      required: ['input']
    }
  },
  {
    name: 'execute_action',
    description: 'Execute action based on detected intent',
    inputSchema: {
      type: 'object',
      properties: {
        intent: {
          type: 'string',
          description: 'Detected intent type'
        },
        problemId: {
          type: 'string',
          description: 'Optional problem ID'
        },
        maxQubits: {
          type: 'number',
          description: 'Optional qubit limit'
        }
      },
      required: ['intent']
    }
  },
  {
    name: 'process_input',
    description: 'End-to-end: parse input and return action result',
    inputSchema: {
      type: 'object',
      properties: {
        input: {
          type: 'string',
          description: 'Any user input'
        }
      },
      required: ['input']
    }
  }
]

export default {
  parseInput,
  executeAction,
  process,
  orchestrationMCPTools
}
