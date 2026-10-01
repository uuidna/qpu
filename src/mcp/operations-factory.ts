/**
 * Operations Factory - DRY Pattern
 * Consolidates repetitive operation registration code
 * Eliminates duplication in MCP operations metadata
 */

export interface OperationDefinition {
  key: string
  domain: string
  operation: string
  handler: (input?: Record<string, unknown>) => Promise<unknown>
  description: string
}

export class OperationsFactory {
  /**
   * Create a standard operation handler that imports and calls a function
   * Eliminates repetitive async import boilerplate
   */
  static createHandler(modulePath: string, functionName: string): (input?: Record<string, unknown>) => Promise<unknown> {
    return async (input?: Record<string, unknown>) => {
      const module = await import(modulePath)
      const fn = module[functionName]
      if (!fn) throw new Error(`Function ${functionName} not found in ${modulePath}`)
      return fn(input)
    }
  }

  /**
   * Create handler with typed input extraction
   */
  static createHandlerWithInput<T extends Record<string, unknown>>(
    modulePath: string,
    functionName: string,
    inputExtractor: (input?: Record<string, unknown>) => T
  ): (input?: Record<string, unknown>) => Promise<unknown> {
    return async (input?: Record<string, unknown>) => {
      const module = await import(modulePath)
      const fn = module[functionName]
      if (!fn) throw new Error(`Function ${functionName} not found in ${modulePath}`)
      const extractedInput = inputExtractor(input)
      return fn(extractedInput)
    }
  }

  /**
   * Create a cost analysis operation group
   * Consolidates all cost operations with single pattern
   */
  static costOperations(): OperationDefinition[] {
    return [
      {
        key: 'cost-analyze-all-modes',
        domain: 'cost',
        operation: 'analyze-all-modes',
        handler: this.createHandler('./cost-optimization-operations.js', 'costAnalyzeAllModes'),
        description: 'Analyze costs for all 4 deployment modes'
      },
      {
        key: 'cost-per-formula',
        domain: 'cost',
        operation: 'per-formula',
        handler: this.createHandlerWithInput('./cost-optimization-operations.js', 'costPerFormulaExecution', input => ({
          mode: (input?.mode as string) || 'docker'
        })),
        description: 'Get cost per formula execution by mode'
      },
      {
        key: 'cost-recommend-mode',
        domain: 'cost',
        operation: 'recommend-mode',
        handler: this.createHandlerWithInput('./cost-optimization-operations.js', 'costRecommendMode', input => ({
          traffic: (input?.traffic as string) || 'medium'
        })),
        description: 'Recommend cheapest deployment mode for traffic'
      },
      {
        key: 'cost-global-savings',
        domain: 'cost',
        operation: 'global-savings',
        handler: this.createHandler('./cost-optimization-operations.js', 'costGlobalSavings'),
        description: 'Calculate global savings across all modes'
      },
      {
        key: 'cost-optimization-recommendations',
        domain: 'cost',
        operation: 'recommendations',
        handler: this.createHandler('./cost-optimization-operations.js', 'costOptimizationRecommendations'),
        description: 'Get cost optimization recommendations'
      },
      {
        key: 'cost-forecast',
        domain: 'cost',
        operation: 'forecast',
        handler: this.createHandlerWithInput(
          './cost-optimization-operations.js',
          'costForecast',
          input => ({
            queriesPerDay: (input?.queriesPerDay as number) || 1000000,
            storageGB: (input?.storageGB as number) || 100,
            computeHours: (input?.computeHours as number) || 720,
            networkTB: (input?.networkTB as number) || 1
          })
        ),
        description: 'Forecast monthly cost based on traffic'
      },
      {
        key: 'cost-report',
        domain: 'cost',
        operation: 'report',
        handler: this.createHandler('./cost-optimization-operations.js', 'costReport'),
        description: 'Generate comprehensive cost optimization report'
      }
    ]
  }

  /**
   * Create formula network operations group
   * Consolidates formula network ops with single pattern
   */
  static formulaNetworkOperations(): OperationDefinition[] {
    return [
      {
        key: 'formula-network-init',
        domain: 'formula-network',
        operation: 'init',
        handler: this.createHandler('./formula-network-operations.js', 'formulaNetworkInit'),
        description: 'Initialize all 65 formulas in network'
      },
      {
        key: 'formula-network-execute',
        domain: 'formula-network',
        operation: 'execute',
        handler: this.createHandlerWithInput(
          './formula-network-operations.js',
          'formulaNetworkExecute',
          input => ((input as Record<string, number>) || {})
        ),
        description: 'Execute entire formula network'
      },
      {
        key: 'formula-network-topology',
        domain: 'formula-network',
        operation: 'topology',
        handler: this.createHandler('./formula-network-operations.js', 'formulaNetworkTopology'),
        description: 'Get formula network topology and connections'
      },
      {
        key: 'formula-dependency-chain',
        domain: 'formula-network',
        operation: 'dependency-chain',
        handler: this.createHandlerWithInput('./formula-network-operations.js', 'formulaDependencyChain', input => ({
          nodeId: (input?.nodeId as string) || 'q-bb84'
        })),
        description: 'Get dependency chain for a formula node'
      },
      {
        key: 'formula-propagate-from',
        domain: 'formula-network',
        operation: 'propagate-from',
        handler: this.createHandlerWithInput('./formula-network-operations.js', 'formulaPropagateFrom', input => ({
          nodeId: (input?.nodeId as string) || 'q-bb84',
          value: (input?.value as number) || 256
        })),
        description: 'Propagate value through formula network from node'
      },
      {
        key: 'formula-cross-domain-effects',
        domain: 'formula-network',
        operation: 'cross-domain-effects',
        handler: this.createHandlerWithInput('./formula-network-operations.js', 'formulaCrossDomainEffects', input => ({
          domain: (input?.domain as string) || 'qsec'
        })),
        description: 'Show cross-domain effects of formulas in domain'
      },
      {
        key: 'formula-network-health',
        domain: 'formula-network',
        operation: 'health',
        handler: this.createHandler('./formula-network-operations.js', 'formulaNetworkHealth'),
        description: 'Validate formula network health'
      },
      {
        key: 'formula-network-optimize',
        domain: 'formula-network',
        operation: 'optimize',
        handler: this.createHandler('./formula-network-operations.js', 'formulaNetworkOptimize'),
        description: 'Get network optimization suggestions'
      }
    ]
  }

  /**
   * Convert operation definitions to MCP operations metadata format
   */
  static toMetadata(ops: OperationDefinition[]): Array<{
    key: string
    domain: string
    operation: string
    handler: (input?: Record<string, unknown>) => Promise<unknown>
    description: string
  }> {
    return ops.map(op => ({
      key: op.key,
      domain: op.domain,
      operation: op.operation,
      handler: op.handler,
      description: op.description
    }))
  }
}

export const operationsFactory = new OperationsFactory()
