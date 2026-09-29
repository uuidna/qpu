/** Domain: Quantum Error Correction - Surface codes and stabilizer codes */

import { solver } from '../../src/quantum/unified-solver'
import { corrector } from '../../src/quantum/error-correction'

export interface ErrorCorrectionRequest {
  physicalErrorRate: number
  codeDistance: number
  logicalQubits: number
}

export interface ErrorCorrectionResult {
  logicalErrorRate: number
  overhead: number
  threshold: number
  fidelityImprovement: number
}

export class ErrorCorrectionService {
  async optimizeErrorCorrection(request: ErrorCorrectionRequest): Promise<ErrorCorrectionResult> {
    const logicalErrorRate = corrector.estimateLogicalErrorRate(request.physicalErrorRate, request.codeDistance)

    const codeStats = corrector.getStats()
    const overhead = codeStats.surfaceCode.overhead

    return {
      logicalErrorRate,
      overhead,
      threshold: codeStats.surfaceCode.threshold,
      fidelityImprovement: 1.0 - logicalErrorRate,
    }
  }

  async selectOptimalCode(request: ErrorCorrectionRequest) {
    const result = await this.optimizeErrorCorrection(request)

    return {
      recommendedCode: request.codeDistance <= 7 ? 'Surface Code' : 'Toric Code',
      physicalQubits: request.codeDistance * request.codeDistance,
      logicalQubits: request.logicalQubits,
      ...result,
    }
  }

  async scalability(maxQubits: number): Promise<object> {
    const scalabilities = []
    for (let d = 3; d <= 15; d += 2) {
      const physical = d * d
      if (physical <= maxQubits) {
        const errorRate = corrector.estimateLogicalErrorRate(0.001, d)
        scalabilities.push({
          distance: d,
          physicalQubits: physical,
          logicalQubits: 1,
          logicalErrorRate: errorRate,
        })
      }
    }
    return scalabilities
  }
}

export default ErrorCorrectionService
