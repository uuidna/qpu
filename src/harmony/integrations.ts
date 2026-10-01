/**
 * INTEGRATION HARMONY FORMULAS
 * 4 hybrid formulas combining QPU compute with external systems
 * Phase 16: External Integration Layer
 */

import type { LLMConnector } from '../integrations/llm-connector.js'
import type { DBAdapter } from '../integrations/db-adapter.js'
import type { KafkaProducer, KafkaConsumer } from '../integrations/kafka-client.js'
import type { BlockchainGateway } from '../integrations/blockchain-gateway.js'

// ============================================================================
// FORMULA 1: hybrid_llm_reasoning
// QPU formula → LLM verification → QPU refinement
// ============================================================================

export interface HybridLLMReasoningInput {
  qpuFormula: {
    id: string
    inputs: Record<string, any>
  }
  llmVerification: {
    provider: 'openai' | 'anthropic'
    model: string
    prompt: string
  }
  refinement: {
    enabled: boolean
    maxIterations?: number
  }
}

export interface HybridLLMReasoningOutput {
  qpuResult: any
  llmVerification: string
  verificationScore: number
  refined: boolean
  refinedResult?: any
  iterations: number
}

export async function hybridLLMReasoning(
  input: HybridLLMReasoningInput,
  llmConnector: LLMConnector
): Promise<HybridLLMReasoningOutput> {
  const startTime = Date.now()

  // Step 1: Execute QPU formula
  const qpuResult = await executeQPUFormula(input.qpuFormula)

  // Step 2: LLM verification
  const verificationMessages = [
    {
      role: 'user' as const,
      content: `${input.llmVerification.prompt}\n\nResult to verify: ${JSON.stringify(qpuResult)}`
    }
  ]

  const verificationResponse = await llmConnector.chatCompletion(verificationMessages)
  const verificationScore = calculateVerificationScore(verificationResponse.content)

  // Step 3: Refinement loop if needed
  let refined = false
  let refinedResult = qpuResult
  let iterations = 1

  if (input.refinement.enabled && verificationScore < 0.8) {
    const maxIter = input.refinement.maxIterations || 2
    for (let i = 0; i < maxIter; i++) {
      const refinementMessages = [
        {
          role: 'user' as const,
          content: `Suggest refinement for: ${JSON.stringify(qpuResult)}. Verification feedback: ${verificationResponse.content}`
        }
      ]

      const refinementResponse = await llmConnector.chatCompletion(refinementMessages)
      refinedResult = parseRefinement(refinementResponse.content)
      refined = true
      iterations++

      const newScore = calculateVerificationScore(refinementResponse.content)
      if (newScore > verificationScore) break
    }
  }

  return {
    qpuResult,
    llmVerification: verificationResponse.content,
    verificationScore,
    refined,
    refinedResult,
    iterations
  }
}

// ============================================================================
// FORMULA 2: db_augmented_compute
// Query DB → Formula execution → Store results
// ============================================================================

export interface DBContextualInput {
  qpuFormula: {
    id: string
    inputs: Record<string, any>
  }
  database: {
    adapter: 'postgresql' | 'mongodb' | 'dynamodb'
    queryTable: string
    queryParams?: any[]
    querySQL?: string
    storeTable: string
  }
}

export interface DBContextualOutput {
  contextData: any[]
  formulaInputs: Record<string, any>
  formulaResult: any
  storedRows: number
  executionTime: number
}

export async function dbAugmentedCompute(
  input: DBContextualInput,
  dbAdapter: DBAdapter
): Promise<DBContextualOutput> {
  const startTime = Date.now()

  // Step 1: Query database for context
  const contextResult = await dbAdapter.query(
    input.database.querySQL || `SELECT * FROM ${input.database.queryTable}`,
    input.database.queryParams || []
  )
  const contextData = contextResult.rows

  // Step 2: Augment formula inputs with DB context
  const formulaInputs = {
    ...input.qpuFormula.inputs,
    context: contextData,
    contextSize: contextData.length
  }

  // Step 3: Execute formula
  const formulaResult = await executeQPUFormula({
    id: input.qpuFormula.id,
    inputs: formulaInputs
  })

  // Step 4: Store results back to database
  const storeResult = await dbAdapter.insert(input.database.storeTable, {
    formula_id: input.qpuFormula.id,
    inputs: JSON.stringify(formulaInputs),
    result: JSON.stringify(formulaResult),
    executed_at: new Date().toISOString(),
    execution_time: Date.now() - startTime
  })

  return {
    contextData,
    formulaInputs,
    formulaResult,
    storedRows: storeResult.rowCount,
    executionTime: Date.now() - startTime
  }
}

// ============================================================================
// FORMULA 3: event_driven_formula
// Kafka trigger → Formula execution → Kafka output
// ============================================================================

export interface EventDrivenComputeInput {
  kafka: {
    brokers: string[]
    inputTopic: string
    outputTopic: string
    groupId: string
    consumeTimeout?: number
  }
  qpuFormula: {
    id: string
  }
  batch: {
    maxMessages?: number
    parallelProcessing?: boolean
  }
}

export interface EventDrivenComputeOutput {
  messagesConsumed: number
  messagesProcessed: number
  messagesProduced: number
  errors: number
  executionTime: number
}

export async function eventDrivenFormula(
  input: EventDrivenComputeInput,
  kafkaConsumer: KafkaConsumer,
  kafkaProducer: KafkaProducer
): Promise<EventDrivenComputeOutput> {
  const startTime = Date.now()

  // Step 1: Subscribe and consume
  await kafkaConsumer.subscribe([input.kafka.inputTopic])
  const messages = await kafkaConsumer.consume({
    topics: [input.kafka.inputTopic],
    maxMessages: input.batch.maxMessages || 100,
    timeout: input.kafka.consumeTimeout || 5000
  })

  let processed = 0
  let errors = 0
  const results = []

  // Step 2: Process messages in parallel or sequence
  if (input.batch.parallelProcessing) {
    const promises = messages.map(async msg => {
      try {
        const formulaInput = typeof msg.value === 'string'
          ? JSON.parse(msg.value)
          : msg.value
        const result = await executeQPUFormula({
          id: input.qpuFormula.id,
          inputs: formulaInput
        })
        processed++
        return { key: msg.key, value: result }
      } catch (e) {
        errors++
        return null
      }
    })

    const allResults = await Promise.all(promises)
    results.push(...allResults.filter(r => r !== null))
  } else {
    for (const msg of messages) {
      try {
        const formulaInput = typeof msg.value === 'string'
          ? JSON.parse(msg.value)
          : msg.value
        const result = await executeQPUFormula({
          id: input.qpuFormula.id,
          inputs: formulaInput
        })
        processed++
        results.push({ key: msg.key, value: result })
      } catch (e) {
        errors++
      }
    }
  }

  // Step 3: Produce results
  const produceResults = await kafkaProducer.produce(input.kafka.outputTopic, results as any[])
  await kafkaProducer.flush()

  return {
    messagesConsumed: messages.length,
    messagesProcessed: processed,
    messagesProduced: produceResults.length,
    errors,
    executionTime: Date.now() - startTime
  }
}

// ============================================================================
// FORMULA 4: blockchain_oracle
// Fetch on-chain data → Formula execution → Broadcast result
// ============================================================================

export interface BlockchainOracleInput {
  blockchain: {
    chain: 'ethereum' | 'solana'
    network: 'mainnet' | 'testnet' | 'devnet'
    contractAddress: string
    dataMethod: string
  }
  qpuFormula: {
    id: string
  }
  broadcast: {
    enabled: boolean
    targetChain?: 'ethereum' | 'solana'
    targetContract?: string
    targetMethod?: string
  }
  cache: {
    enabled: boolean
    ttlSeconds?: number
  }
}

export interface BlockchainOracleOutput {
  onChainData: any
  formulaResult: any
  broadcasted: boolean
  broadcastHash?: string
  cacheHit: boolean
  executionTime: number
}

export async function blockchainOracle(
  input: BlockchainOracleInput,
  blockchainGateway: BlockchainGateway
): Promise<BlockchainOracleOutput> {
  const startTime = Date.now()
  const cacheKey = `oracle:${input.blockchain.contractAddress}:${input.blockchain.dataMethod}`

  // Step 1: Try cache first
  let onChainData = null
  let cacheHit = false

  if (input.cache.enabled) {
    // Simulated cache lookup
    const cached = getCachedValue(cacheKey)
    if (cached) {
      onChainData = cached
      cacheHit = true
    }
  }

  // Step 2: Fetch on-chain data if not cached
  if (!onChainData) {
    const callResult = await blockchainGateway.call({
      address: input.blockchain.contractAddress,
      method: input.blockchain.dataMethod
    })
    onChainData = callResult.result
    cacheHit = false

    // Cache the result
    if (input.cache.enabled) {
      setCachedValue(cacheKey, onChainData, (input.cache.ttlSeconds || 300) * 1000)
    }
  }

  // Step 3: Execute formula with on-chain data
  const formulaResult = await executeQPUFormula({
    id: input.qpuFormula.id,
    inputs: {
      chainData: onChainData,
      chain: input.blockchain.chain,
      network: input.blockchain.network
    }
  })

  // Step 4: Broadcast result if enabled
  let broadcasted = false
  let broadcastHash = undefined

  if (input.broadcast.enabled && input.broadcast.targetChain && input.broadcast.targetContract) {
    const txResult = await blockchainGateway.execute({
      address: input.broadcast.targetContract,
      method: input.broadcast.targetMethod || 'updateOracleData',
      args: [formulaResult],
      value: '0'
    })
    broadcasted = txResult.success
    broadcastHash = txResult.transactionHash
  }

  return {
    onChainData,
    formulaResult,
    broadcasted,
    broadcastHash,
    cacheHit,
    executionTime: Date.now() - startTime
  }
}

// ============================================================================
// Helpers
// ============================================================================

async function executeQPUFormula(input: {
  id: string
  inputs: Record<string, any>
}): Promise<any> {
  // Simulated QPU formula execution
  // In real implementation, would call actual QPU compute engine
  return {
    formulaId: input.id,
    inputs: input.inputs,
    result: Math.random() * 100,
    timestamp: Date.now()
  }
}

function calculateVerificationScore(content: string): number {
  // Simple heuristic: count positive indicators
  const positives = (content.match(/correct|valid|verified|correct/gi) || []).length
  const negatives = (content.match(/error|invalid|incorrect/gi) || []).length
  return Math.max(0, Math.min(1, (positives - negatives) / 10))
}

function parseRefinement(content: string): any {
  // Extract structured refinement from LLM response
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
  } catch {
    // Ignore parse errors
  }
  return { refined: true, feedback: content }
}

const valueCache = new Map<string, { value: any; expiresAt: number }>()

function getCachedValue(key: string): any {
  const entry = valueCache.get(key)
  if (entry && Date.now() < entry.expiresAt) {
    return entry.value
  }
  if (entry) {
    valueCache.delete(key)
  }
  return null
}

function setCachedValue(key: string, value: any, ttlMs: number): void {
  valueCache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  })
}
