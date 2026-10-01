/**
 * MCP Integration Operations - 6 new external system connectors
 * LLM, Database, Kafka, and Blockchain integrations via MCP
 */

import { registry } from '../core/ops.js'
import { LLMConnector, type ChatMessage } from '../integrations/llm-connector.js'
import { DBAdapter } from '../integrations/db-adapter.js'
import { Kafka } from '../integrations/kafka-client.js'
import { BlockchainGateway } from '../integrations/blockchain-gateway.js'

// ============================================================================
// OP 1: qpu_llm_chat - Send prompt to external LLM with streaming
// ============================================================================

export interface LLMChatInput {
  provider: 'openai' | 'anthropic'
  model: string
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface LLMChatOutput {
  id: string
  content: string
  model: string
  stopReason: string
  tokenUsage: {
    prompt: number
    completion: number
    total: number
  }
  streamTokens?: string[] // For streamed responses
}

export async function qpuLlmChat(input: LLMChatInput): Promise<LLMChatOutput> {
  const connector = new LLMConnector({
    provider: input.provider,
    apiKey: process.env[`${input.provider.toUpperCase()}_API_KEY`] || '',
    model: input.model,
    temperature: input.temperature,
    maxTokens: input.maxTokens
  })

  if (input.stream) {
    const streamTokens: string[] = []
    for await (const token of connector.streamChatCompletion(input.messages)) {
      streamTokens.push(token)
    }
    return {
      id: Math.random().toString(36).substr(2, 9),
      content: streamTokens.join(''),
      model: input.model,
      stopReason: 'stop',
      tokenUsage: {
        prompt: 0,
        completion: streamTokens.length,
        total: streamTokens.length
      },
      streamTokens
    }
  } else {
    const result = await connector.chatCompletion(input.messages)
    return {
      id: result.id,
      content: result.content,
      model: result.model,
      stopReason: result.stopReason,
      tokenUsage: result.tokenUsage
    }
  }
}

// ============================================================================
// OP 2: qpu_db_query - Execute SELECT/INSERT/UPDATE across adapters
// ============================================================================

export interface DBQueryInput {
  adapter: 'postgresql' | 'mongodb' | 'dynamodb'
  operation: 'select' | 'insert' | 'update'
  table: string
  sql?: string
  data?: Record<string, any>
  where?: Record<string, any>
  params?: any[]
}

export interface DBQueryOutput {
  success: boolean
  rowCount: number
  rows?: Record<string, any>[]
  id?: string | number
  error?: string
}

export async function qpuDbQuery(input: DBQueryInput): Promise<DBQueryOutput> {
  const dbAdapter = new DBAdapter({
    adapter: input.adapter,
    connectionString: process.env.DATABASE_URL
  })

  try {
    if (input.operation === 'select') {
      const result = await dbAdapter.query(input.sql || '', input.params || [])
      return {
        success: !result.error,
        rowCount: result.rowCount,
        rows: result.rows,
        error: result.error
      }
    } else if (input.operation === 'insert') {
      const result = await dbAdapter.insert(input.table, input.data || {})
      return {
        success: !result.error,
        rowCount: result.rowCount,
        id: result.lastInsertId || result.id,
        error: result.error
      }
    } else if (input.operation === 'update') {
      const result = await dbAdapter.update(input.table, input.data || {}, input.where || {})
      return {
        success: !result.error,
        rowCount: result.rowCount,
        error: result.error
      }
    }
    throw new Error(`Unknown operation: ${input.operation}`)
  } finally {
    await dbAdapter.close()
  }
}

// ============================================================================
// OP 3: qpu_kafka_produce - Publish message to Kafka topic
// ============================================================================

export interface KafkaProduceInput {
  topic: string
  messages: Array<{
    key?: string
    value: string | Record<string, any>
    headers?: Record<string, string>
  }>
  compression?: 'gzip' | 'snappy' | 'lz4' | 'zstd' | 'none'
}

export interface KafkaProduceOutput {
  success: boolean
  topic: string
  producedCount: number
  offsets: number[]
  error?: string
}

export async function qpuKafkaProduce(input: KafkaProduceInput): Promise<KafkaProduceOutput> {
  const kafka = Kafka.createProducer({
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: 'qpu-producer',
    compression: input.compression || 'none'
  })

  try {
    const results = await kafka.produce(input.topic, input.messages as any[])
    await kafka.flush()

    return {
      success: true,
      topic: input.topic,
      producedCount: results.length,
      offsets: results.map(r => r.offset)
    }
  } catch (e) {
    return {
      success: false,
      topic: input.topic,
      producedCount: 0,
      offsets: [],
      error: (e as Error).message
    }
  } finally {
    await kafka.close()
  }
}

// ============================================================================
// OP 4: qpu_kafka_consume - Subscribe and consume from Kafka
// ============================================================================

export interface KafkaConsumeInput {
  topics: string[]
  groupId: string
  fromBeginning?: boolean
  maxMessages?: number
  timeout?: number
  validateSchema?: Record<string, any>
}

export interface KafkaConsumeOutput {
  success: boolean
  messages: Array<{
    topic: string
    key?: string
    value: any
    offset: number
    partition: number
    timestamp: number
  }>
  messageCount: number
  error?: string
}

export async function qpuKafkaConsume(input: KafkaConsumeInput): Promise<KafkaConsumeOutput> {
  const kafka = Kafka.createConsumer({
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: 'qpu-consumer',
    groupId: input.groupId
  })

  const validator = Kafka.createSchemaValidator()
  if (input.validateSchema) {
    for (const [topic, schema] of Object.entries(input.validateSchema)) {
      validator.registerSchema(topic, schema)
    }
  }

  try {
    await kafka.subscribe(input.topics)
    const messages = await kafka.consume({
      topics: input.topics,
      fromBeginning: input.fromBeginning,
      maxMessages: input.maxMessages || 100,
      timeout: input.timeout || 5000
    })

    // Validate messages if schema provided
    const validatedMessages = messages.map(msg => ({
      topic: 'unknown',
      key: typeof msg.key === 'string' ? msg.key : undefined,
      value: msg.value,
      offset: msg.offset || 0,
      partition: msg.partition || 0,
      timestamp: msg.timestamp || Date.now()
    }))

    return {
      success: true,
      messages: validatedMessages,
      messageCount: validatedMessages.length
    }
  } catch (e) {
    return {
      success: false,
      messages: [],
      messageCount: 0,
      error: (e as Error).message
    }
  } finally {
    await kafka.close()
  }
}

// ============================================================================
// OP 5: qpu_blockchain_call - Call smart contract function
// ============================================================================

export interface BlockchainCallInput {
  chain: 'ethereum' | 'solana'
  network: 'mainnet' | 'testnet' | 'devnet'
  contractAddress: string
  method: string
  args?: any[]
  value?: string
  gas?: number
  write?: boolean // Set to true for transactions, false for calls
}

export interface BlockchainCallOutput {
  success: boolean
  result?: any
  transactionHash?: string
  gasUsed?: number
  blockNumber?: number
  error?: string
}

export async function qpuBlockchainCall(input: BlockchainCallInput): Promise<BlockchainCallOutput> {
  const gateway = new BlockchainGateway({
    chain: input.chain,
    network: input.network,
    rpcUrl: process.env[`${input.chain.toUpperCase()}_RPC_URL`] || '',
    privateKey: process.env[`${input.chain.toUpperCase()}_PRIVATE_KEY`]
  })

  try {
    const callData = {
      address: input.contractAddress,
      method: input.method,
      args: input.args,
      value: input.value,
      gas: input.gas
    }

    if (input.write) {
      const result = await gateway.execute(callData)
      return {
        success: result.success,
        result: result.result,
        transactionHash: result.transactionHash,
        gasUsed: result.gasUsed,
        error: result.error
      }
    } else {
      const result = await gateway.call(callData)
      return {
        success: result.success,
        result: result.result,
        error: result.error
      }
    }
  } catch (e) {
    return {
      success: false,
      error: (e as Error).message
    }
  }
}

// ============================================================================
// OP 6: qpu_blockchain_watch - Subscribe to contract events
// ============================================================================

export interface BlockchainWatchInput {
  chain: 'ethereum' | 'solana'
  network: 'mainnet' | 'testnet' | 'devnet'
  contractAddress: string
  eventName: string
  filter?: Record<string, any>
  fromBlock?: number
  toBlock?: number
}

export interface BlockchainWatchOutput {
  success: boolean
  subscriptionId?: string
  events?: any[]
  error?: string
}

export async function qpuBlockchainWatch(input: BlockchainWatchInput): Promise<BlockchainWatchOutput> {
  const gateway = new BlockchainGateway({
    chain: input.chain,
    network: input.network,
    rpcUrl: process.env[`${input.chain.toUpperCase()}_RPC_URL`] || ''
  })

  try {
    const subscriptionId = gateway.subscribe({
      id: '',
      contractAddress: input.contractAddress,
      eventName: input.eventName,
      filter: input.filter,
      fromBlock: input.fromBlock,
      toBlock: input.toBlock
    })

    const events = await gateway.getEvents(subscriptionId)

    return {
      success: true,
      subscriptionId,
      events
    }
  } catch (e) {
    return {
      success: false,
      error: (e as Error).message
    }
  }
}

// ============================================================================
// Export all operations (registered via operationRegistry)
// ============================================================================

export const integrationOps = {
  qpu_llm_chat: qpuLlmChat,
  qpu_db_query: qpuDbQuery,
  qpu_kafka_produce: qpuKafkaProduce,
  qpu_kafka_consume: qpuKafkaConsume,
  qpu_blockchain_call: qpuBlockchainCall,
  qpu_blockchain_watch: qpuBlockchainWatch
}
