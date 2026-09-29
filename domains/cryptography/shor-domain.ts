/** Cryptography Domain - Refactored to use QuantumDomain base class */

import { QuantumDomain } from '../../src/core/base-domain.js'
import type { ProblemType, DomainConfig } from '../../src/types/domain.js'

export class CryptographyDomain extends QuantumDomain {
  constructor() {
    const config: DomainConfig = {
      name: 'Cryptography',
      version: '1.0.0',
      algorithms: ['factor', 'optimize'],
      timeout: 30000,
      maxRetries: 3,
    }
    super(config)
  }

  protected selectAlgorithm(input: Record<string, any>): ProblemType {
    if (input.type === 'factorization' || input.n) {
      return 'factor'
    }
    return 'optimize'
  }
}

export const cryptography = new CryptographyDomain()
