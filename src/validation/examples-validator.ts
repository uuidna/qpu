// Examples Validator: Validate all examples, use cases, and documentation
// Ensures completeness, consistency, and accuracy

import { COMPLETE_USECASES, COMPLETE_EXAMPLES, LEARNING_PATHS } from '../data/examples-complete.js'

interface ValidationResult {
  passed: boolean
  checks: {
    name: string
    passed: boolean
    error?: string
  }[]
  summary: {
    total: number
    passed: number
    failed: number
  }
  timestamp: string
}

export class ExamplesValidator {
  /**
   * Validate all examples
   */
  validateExamples(): ValidationResult {
    const checks: ValidationResult['checks'] = []

    Object.entries(COMPLETE_EXAMPLES).forEach(([id, example]) => {
      checks.push({
        name: `Example: ${id} has title`,
        passed: !!example.title
      })

      checks.push({
        name: `Example: ${id} has description`,
        passed: !!example.description
      })

      checks.push({
        name: `Example: ${id} has valid framework`,
        passed: ['qiskit', 'cirq', 'pennylane', 'pyquil'].includes(example.framework)
      })

      checks.push({
        name: `Example: ${id} has valid provider`,
        passed: ['ibm-quantum', 'google-cirq', 'ionq', 'rigetti', 'aws-braket'].includes(
          example.provider
        )
      })

      checks.push({
        name: `Example: ${id} has tags`,
        passed: Array.isArray(example.tags) && example.tags.length > 0
      })

      checks.push({
        name: `Example: ${id} has related usecases`,
        passed: Array.isArray(example.relatedUsecases) && example.relatedUsecases.length > 0,
        error: example.relatedUsecases.length === 0 ? 'No related use cases' : undefined
      })
    })

    return this.formatResult(checks)
  }

  /**
   * Validate all use cases
   */
  validateUsecases(): ValidationResult {
    const checks: ValidationResult['checks'] = []

    const validDomains = ['entanglement', 'algorithms', 'optimization', 'simulation', 'ml']
    const validDifficulties = ['beginner', 'intermediate', 'advanced']

    Object.entries(COMPLETE_USECASES).forEach(([id, usecase]) => {
      checks.push({
        name: `Usecase: ${id} has title`,
        passed: !!usecase.title
      })

      checks.push({
        name: `Usecase: ${id} has description`,
        passed: !!usecase.description
      })

      checks.push({
        name: `Usecase: ${id} has valid domain`,
        passed: validDomains.includes(usecase.domain)
      })

      checks.push({
        name: `Usecase: ${id} has valid difficulty`,
        passed: validDifficulties.includes(usecase.difficulty)
      })

      checks.push({
        name: `Usecase: ${id} has industry`,
        passed: !!usecase.industry
      })

      checks.push({
        name: `Usecase: ${id} has examples`,
        passed: Array.isArray(usecase.examples) && usecase.examples.length > 0
      })

      checks.push({
        name: `Usecase: ${id} has frameworks`,
        passed: Array.isArray(usecase.frameworks) && usecase.frameworks.length > 0
      })

      checks.push({
        name: `Usecase: ${id} has providers`,
        passed: Array.isArray(usecase.providers) && usecase.providers.length > 0
      })

      checks.push({
        name: `Usecase: ${id} has problem statement`,
        passed: !!usecase.problem
      })

      checks.push({
        name: `Usecase: ${id} has quantum advantage`,
        passed: !!usecase.advantage
      })

      checks.push({
        name: `Usecase: ${id} has learning path`,
        passed: Array.isArray(usecase.learningPath) && usecase.learningPath.length > 0
      })
    })

    return this.formatResult(checks)
  }

  /**
   * Validate learning paths
   */
  validateLearningPaths(): ValidationResult {
    const checks: ValidationResult['checks'] = []

    Object.entries(LEARNING_PATHS).forEach(([id, path]) => {
      checks.push({
        name: `Learning Path: ${id} has title`,
        passed: !!path.title
      })

      checks.push({
        name: `Learning Path: ${id} has description`,
        passed: !!path.description
      })

      checks.push({
        name: `Learning Path: ${id} has steps`,
        passed: Array.isArray(path.steps) && path.steps.length > 0
      })

      checks.push({
        name: `Learning Path: ${id} has duration`,
        passed: !!path.duration
      })
    })

    return this.formatResult(checks)
  }

  /**
   * Validate relationships between components
   */
  validateRelationships(): ValidationResult {
    const checks: ValidationResult['checks'] = []

    // Check that examples referenced in usecases exist
    Object.entries(COMPLETE_USECASES).forEach(([usecaseId, usecase]) => {
      usecase.examples.forEach(exampleId => {
        checks.push({
          name: `Usecase: ${usecaseId} references existing example: ${exampleId}`,
          passed: COMPLETE_EXAMPLES[exampleId as keyof typeof COMPLETE_EXAMPLES] !== undefined,
          error: !COMPLETE_EXAMPLES[exampleId as keyof typeof COMPLETE_EXAMPLES]
            ? 'Example not found'
            : undefined
        })
      })
    })

    // Check that examples reference valid usecases
    Object.entries(COMPLETE_EXAMPLES).forEach(([exampleId, example]) => {
      example.relatedUsecases.forEach(usecaseId => {
        checks.push({
          name: `Example: ${exampleId} references existing usecase: ${usecaseId}`,
          passed: COMPLETE_USECASES[usecaseId as keyof typeof COMPLETE_USECASES] !== undefined,
          error: !COMPLETE_USECASES[usecaseId as keyof typeof COMPLETE_USECASES]
            ? 'Usecase not found'
            : undefined
        })
      })
    })

    // Check framework and provider consistency
    Object.entries(COMPLETE_USECASES).forEach(([usecaseId, usecase]) => {
      usecase.examples.forEach(exampleId => {
        const example = COMPLETE_EXAMPLES[exampleId as keyof typeof COMPLETE_EXAMPLES]
        if (example) {
          checks.push({
            name: `Usecase: ${usecaseId} example ${exampleId} uses declared framework`,
            passed: usecase.frameworks.includes(example.framework),
            error: !usecase.frameworks.includes(example.framework)
              ? `Framework mismatch: ${example.framework} not in [${usecase.frameworks.join(', ')}]`
              : undefined
          })
        }
      })
    })

    return this.formatResult(checks)
  }

  /**
   * Validate completeness (no missing required data)
   */
  validateCompleteness(): ValidationResult {
    const checks: ValidationResult['checks'] = []

    // Check domain distribution
    const domainCounts = Object.values(COMPLETE_USECASES).reduce(
      (acc, uc) => {
        acc[uc.domain] = (acc[uc.domain] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const expectedDomains = ['entanglement', 'algorithms', 'optimization', 'simulation', 'ml']
    expectedDomains.forEach(domain => {
      checks.push({
        name: `Has usecases for domain: ${domain}`,
        passed: (domainCounts[domain] || 0) > 0,
        error: (domainCounts[domain] || 0) === 0 ? 'No usecases for this domain' : undefined
      })
    })

    // Check difficulty distribution
    const difficulties = Object.values(COMPLETE_USECASES).map(uc => uc.difficulty)
    checks.push({
      name: 'Has beginner usecases',
      passed: difficulties.includes('beginner')
    })
    checks.push({
      name: 'Has intermediate usecases',
      passed: difficulties.includes('intermediate')
    })
    checks.push({
      name: 'Has advanced usecases',
      passed: difficulties.includes('advanced')
    })

    // Check minimum usecase count per domain
    Object.entries(domainCounts).forEach(([domain, count]) => {
      checks.push({
        name: `Domain ${domain} has at least 2 usecases`,
        passed: count >= 2,
        error: count < 2 ? `Only ${count} usecase(s)` : undefined
      })
    })

    return this.formatResult(checks)
  }

  /**
   * Run all validations
   */
  validateAll(): Record<string, ValidationResult> {
    return {
      examples: this.validateExamples(),
      usecases: this.validateUsecases(),
      learningPaths: this.validateLearningPaths(),
      relationships: this.validateRelationships(),
      completeness: this.validateCompleteness()
    }
  }

  /**
   * Generate validation report
   */
  generateReport(): string {
    const allResults = this.validateAll()

    let report = '# Examples Validation Report\n\n'
    report += `Generated: ${new Date().toISOString()}\n\n`

    let totalTests = 0
    let totalPassed = 0

    Object.entries(allResults).forEach(([category, result]) => {
      report += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`
      report += `- Total: ${result.summary.total}\n`
      report += `- Passed: ${result.summary.passed}\n`
      report += `- Failed: ${result.summary.failed}\n`

      totalTests += result.summary.total
      totalPassed += result.summary.passed

      if (result.summary.failed > 0) {
        report += '\n### Failed Checks\n\n'
        result.checks
          .filter(c => !c.passed)
          .forEach(c => {
            report += `- ❌ ${c.name}`
            if (c.error) report += ` (${c.error})`
            report += '\n'
          })
      }

      report += '\n'
    })

    report += `## Summary\n\n`
    report += `Total Tests: ${totalTests}\n`
    report += `Passed: ${totalPassed}\n`
    report += `Failed: ${totalTests - totalPassed}\n`
    report += `Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%\n`

    return report
  }

  private formatResult(checks: ValidationResult['checks']): ValidationResult {
    const passed = checks.filter(c => c.passed).length
    const failed = checks.length - passed

    return {
      passed: failed === 0,
      checks,
      summary: {
        total: checks.length,
        passed,
        failed
      },
      timestamp: new Date().toISOString()
    }
  }
}

// Export singleton
export const examplesValidator = new ExamplesValidator()
