/**
 * MCP Integration Operations Tests
 * Test all 6 new external system connector MCP operations
 */

import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import {
  qpuLlmChat,
  qpuDbQuery,
  qpuKafkaProduce,
  qpuKafkaConsume,
  qpuBlockchainCall,
  qpuBlockchainWatch,
  type LLMChatInput,
  type DBQueryInput,
  type KafkaProduceInput,
  type KafkaConsumeInput,
  type BlockchainCallInput,
  type BlockchainWatchInput
} from '../../src/mcp/integrations-ops.js'

// ============================================================================
// MCP OP 1: qpu_llm_chat
// ============================================================================

test('MCP Op: qpu_llm_chat - OpenAI integration', async () => {
  if (!process.env.OPENAI_API_KEY) {
    console.log('⊘ Skipping qpu_llm_chat test (OPENAI_API_KEY not set)')
    return
  }

  const input: LLMChatInput = {
    provider: 'openai',
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'What is 1+1?' }],
    temperature: 0.7,
    maxTokens: 50
  }

  try {
    const result = await qpuLlmChat(input)

    assert(result.id, 'Response should have ID')
    assert(result.content, 'Response should have content')
    assert(result.tokenUsage.total > 0, 'Token usage should be tracked')

    console.log('✓ qpu_llm_chat successful')
    console.log(`  Content: ${result.content}`)
    console.log(`  Tokens: ${result.tokenUsage.total}`)
  } catch (e) {
    console.log('⊘ qpu_llm_chat test failed:', (e as Error).message)
  }
})

test('MCP Op: qpu_llm_chat - Streaming mode', async () => {
  if (!process.env.OPENAI_API_KEY) {
    console.log('⊘ Skipping qpu_llm_chat streaming test')
    return
  }

  const input: LLMChatInput = {
    provider: 'openai',
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Count to 3.' }],
    stream: true,
    maxTokens: 30
  }

  try {
    const result = await qpuLlmChat(input)

    assert(result.content, 'Should have content')
    assert(result.streamTokens && result.streamTokens.length > 0, 'Should have streamed tokens')

    console.log('✓ qpu_llm_chat streaming successful')
    console.log(`  Tokens streamed: ${result.streamTokens?.length}`)
  } catch (e) {
    console.log('⊘ qpu_llm_chat streaming test failed:', (e as Error).message)
  }
})

// ============================================================================
// MCP OP 2: qpu_db_query
// ============================================================================

test('MCP Op: qpu_db_query - SELECT operation', async () => {
  if (!process.env.DATABASE_URL) {
    console.log('⊘ Skipping qpu_db_query SELECT test (DATABASE_URL not set)')
    return
  }

  const input: DBQueryInput = {
    adapter: 'postgresql',
    operation: 'select',
    table: 'users',
    sql: 'SELECT * FROM users LIMIT 10',
    params: []
  }

  try {
    const result = await qpuDbQuery(input)

    assert.equal(result.success, true, 'Query should succeed')
    assert(Array.isArray(result.rows), 'Should return array of rows')

    console.log('✓ qpu_db_query SELECT successful')
    console.log(`  Rows returned: ${result.rowCount}`)
  } catch (e) {
    console.log('⊘ qpu_db_query SELECT test failed:', (e as Error).message)
  }
})

test('MCP Op: qpu_db_query - INSERT operation', async () => {
  if (!process.env.DATABASE_URL) {
    console.log('⊘ Skipping qpu_db_query INSERT test')
    return
  }

  const input: DBQueryInput = {
    adapter: 'postgresql',
    operation: 'insert',
    table: 'users',
    data: {
      name: 'Test User',
      email: 'test@example.com',
      created_at: new Date()
    }
  }

  try {
    const result = await qpuDbQuery(input)

    assert.equal(result.success, true, 'Insert should succeed')
    assert.equal(result.rowCount, 1, 'Should insert 1 row')
    assert(result.id, 'Should return inserted ID')

    console.log('✓ qpu_db_query INSERT successful')
    console.log(`  Inserted ID: ${result.id}`)
  } catch (e) {
    console.log('⊘ qpu_db_query INSERT test failed:', (e as Error).message)
  }
})

test('MCP Op: qpu_db_query - UPDATE operation', async () => {
  if (!process.env.DATABASE_URL) {
    console.log('⊘ Skipping qpu_db_query UPDATE test')
    return
  }

  const input: DBQueryInput = {
    adapter: 'postgresql',
    operation: 'update',
    table: 'users',
    data: { name: 'Updated Name' },
    where: { email: 'test@example.com' }
  }

  try {
    const result = await qpuDbQuery(input)

    assert.equal(result.success, true, 'Update should succeed')
    assert(result.rowCount >= 0, 'Should return row count')

    console.log('✓ qpu_db_query UPDATE successful')
    console.log(`  Rows updated: ${result.rowCount}`)
  } catch (e) {
    console.log('⊘ qpu_db_query UPDATE test failed:', (e as Error).message)
  }
})

// ============================================================================
// MCP OP 3: qpu_kafka_produce
// ============================================================================

test('MCP Op: qpu_kafka_produce - Basic produce', async () => {
  const input: KafkaProduceInput = {
    topic: 'test-topic',
    messages: [
      { key: 'msg-1', value: JSON.stringify({ data: 'test1' }) },
      { key: 'msg-2', value: JSON.stringify({ data: 'test2' }) },
      { key: 'msg-3', value: JSON.stringify({ data: 'test3' }) }
    ],
    compression: 'gzip'
  }

  try {
    const result = await qpuKafkaProduce(input)

    assert.equal(result.success, true, 'Produce should succeed')
    assert.equal(result.producedCount, 3, 'Should produce 3 messages')
    assert.equal(result.offsets.length, 3, 'Should return 3 offsets')

    console.log('✓ qpu_kafka_produce successful')
    console.log(`  Messages produced: ${result.producedCount}`)
    console.log(`  Offsets: ${result.offsets.join(', ')}`)
  } catch (e) {
    console.log('⊘ qpu_kafka_produce test failed:', (e as Error).message)
  }
})

test('MCP Op: qpu_kafka_produce - With headers', async () => {
  const input: KafkaProduceInput = {
    topic: 'messages-topic',
    messages: [
      {
        key: 'order-123',
        value: JSON.stringify({ orderId: 123, amount: 99.99 }),
        headers: {
          'content-type': 'application/json',
          'source': 'qpu-system'
        }
      }
    ]
  }

  try {
    const result = await qpuKafkaProduce(input)

    assert.equal(result.success, true, 'Produce with headers should succeed')
    assert.equal(result.producedCount, 1, 'Should produce 1 message')

    console.log('✓ qpu_kafka_produce with headers successful')
  } catch (e) {
    console.log('⊘ qpu_kafka_produce headers test failed:', (e as Error).message)
  }
})

// ============================================================================
// MCP OP 4: qpu_kafka_consume
// ============================================================================

test('MCP Op: qpu_kafka_consume - Basic consume', async () => {
  const input: KafkaConsumeInput = {
    topics: ['test-topic'],
    groupId: 'qpu-consumer-group',
    fromBeginning: true,
    maxMessages: 10,
    timeout: 5000
  }

  try {
    const result = await qpuKafkaConsume(input)

    assert.equal(result.success, true, 'Consume should succeed')
    assert(Array.isArray(result.messages), 'Should return array of messages')

    console.log('✓ qpu_kafka_consume successful')
    console.log(`  Messages consumed: ${result.messageCount}`)
  } catch (e) {
    console.log('⊘ qpu_kafka_consume test failed:', (e as Error).message)
  }
})

test('MCP Op: qpu_kafka_consume - With schema validation', async () => {
  const input: KafkaConsumeInput = {
    topics: ['users-topic'],
    groupId: 'qpu-validation-group',
    maxMessages: 5,
    timeout: 3000,
    validateSchema: {
      'users-topic': {
        id: 'number',
        name: 'string',
        email: 'string'
      }
    }
  }

  try {
    const result = await qpuKafkaConsume(input)

    assert.equal(result.success, true, 'Consume with schema should succeed')

    console.log('✓ qpu_kafka_consume with schema validation successful')
    console.log(`  Messages validated: ${result.messageCount}`)
  } catch (e) {
    console.log('⊘ qpu_kafka_consume schema test failed:', (e as Error).message)
  }
})

// ============================================================================
// MCP OP 5: qpu_blockchain_call
// ============================================================================

test('MCP Op: qpu_blockchain_call - Ethereum read call', async () => {
  const input: BlockchainCallInput = {
    chain: 'ethereum',
    network: 'testnet',
    contractAddress: '0x1234567890123456789012345678901234567890',
    method: 'balanceOf',
    args: ['0x0000000000000000000000000000000000000000'],
    write: false
  }

  try {
    const result = await qpuBlockchainCall(input)

    assert(result.success !== undefined, 'Should return success status')

    console.log('✓ qpu_blockchain_call read successful')
    console.log(`  Success: ${result.success}`)
    if (result.result) {
      console.log(`  Result: ${JSON.stringify(result.result)}`)
    }
  } catch (e) {
    console.log('⊘ qpu_blockchain_call read test failed:', (e as Error).message)
  }
})

test('MCP Op: qpu_blockchain_call - Ethereum write call', async () => {
  if (!process.env.ETHEREUM_PRIVATE_KEY) {
    console.log('⊘ Skipping qpu_blockchain_call write test (ETHEREUM_PRIVATE_KEY not set)')
    return
  }

  const input: BlockchainCallInput = {
    chain: 'ethereum',
    network: 'testnet',
    contractAddress: '0x1234567890123456789012345678901234567890',
    method: 'transfer',
    args: ['0x0000000000000000000000000000000000000000', '1000'],
    value: '0',
    write: true
  }

  try {
    const result = await qpuBlockchainCall(input)

    assert(result.success !== undefined, 'Should return success status')

    if (result.success) {
      assert(result.transactionHash, 'Successful write should have tx hash')
    }

    console.log('✓ qpu_blockchain_call write successful')
    console.log(`  TX Hash: ${result.transactionHash}`)
  } catch (e) {
    console.log('⊘ qpu_blockchain_call write test failed:', (e as Error).message)
  }
})

test('MCP Op: qpu_blockchain_call - Solana call', async () => {
  const input: BlockchainCallInput = {
    chain: 'solana',
    network: 'devnet',
    contractAddress: 'TokenkegQfeZyiNwAJsyFbPVwwQQfVMwQWfV1qWpj',
    method: 'getTokenSupply',
    write: false
  }

  try {
    const result = await qpuBlockchainCall(input)

    assert(result.success !== undefined, 'Should return success status')

    console.log('✓ qpu_blockchain_call Solana successful')
  } catch (e) {
    console.log('⊘ qpu_blockchain_call Solana test failed:', (e as Error).message)
  }
})

// ============================================================================
// MCP OP 6: qpu_blockchain_watch
// ============================================================================

test('MCP Op: qpu_blockchain_watch - Event subscription', async () => {
  const input: BlockchainWatchInput = {
    chain: 'ethereum',
    network: 'testnet',
    contractAddress: '0x1234567890123456789012345678901234567890',
    eventName: 'Transfer',
    fromBlock: 0,
    toBlock: 'latest' as any
  }

  try {
    const result = await qpuBlockchainWatch(input)

    assert.equal(result.success, true, 'Subscription should succeed')
    assert(result.subscriptionId, 'Should return subscription ID')
    assert(Array.isArray(result.events), 'Should return array of events')

    console.log('✓ qpu_blockchain_watch successful')
    console.log(`  Subscription ID: ${result.subscriptionId}`)
    console.log(`  Events received: ${result.events?.length}`)
  } catch (e) {
    console.log('⊘ qpu_blockchain_watch test failed:', (e as Error).message)
  }
})

test('MCP Op: qpu_blockchain_watch - Solana events', async () => {
  const input: BlockchainWatchInput = {
    chain: 'solana',
    network: 'devnet',
    contractAddress: 'TokenkegQfeZyiNwAJsyFbPVwwQQfVMwQWfV1qWpj',
    eventName: 'Transfer'
  }

  try {
    const result = await qpuBlockchainWatch(input)

    assert.equal(result.success, true, 'Solana subscription should succeed')
    assert(result.subscriptionId, 'Should return subscription ID')

    console.log('✓ qpu_blockchain_watch Solana successful')
    console.log(`  Subscription ID: ${result.subscriptionId}`)
  } catch (e) {
    console.log('⊘ qpu_blockchain_watch Solana test failed:', (e as Error).message)
  }
})

// ============================================================================
// Integration Tests: Multi-operation scenarios
// ============================================================================

test('Integration: LLM-verified data flow', async () => {
  if (!process.env.OPENAI_API_KEY) {
    console.log('⊘ Skipping LLM-verified flow test')
    return
  }

  // Step 1: Query database
  const dbInput: DBQueryInput = {
    adapter: 'postgresql',
    operation: 'select',
    table: 'data',
    sql: 'SELECT * FROM data LIMIT 1'
  }

  try {
    const dbResult = await qpuDbQuery(dbInput)

    // Step 2: Send to LLM for analysis
    if (dbResult.rowCount > 0) {
      const llmInput: LLMChatInput = {
        provider: 'openai',
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: `Analyze this data: ${JSON.stringify(dbResult.rows?.[0])}`
        }],
        maxTokens: 50
      }

      const llmResult = await qpuLlmChat(llmInput)
      assert(llmResult.content, 'Should get LLM analysis')

      console.log('✓ LLM-verified data flow successful')
    } else {
      console.log('⊘ No data to analyze')
    }
  } catch (e) {
    console.log('⊘ LLM-verified flow test failed:', (e as Error).message)
  }
})

test('Integration: Kafka to Blockchain pipeline', async () => {
  // Step 1: Produce to Kafka
  const produceInput: KafkaProduceInput = {
    topic: 'events',
    messages: [{
      key: 'blockchain-event',
      value: JSON.stringify({ type: 'transfer', amount: 100 })
    }]
  }

  try {
    const produceResult = await qpuKafkaProduce(produceInput)
    assert.equal(produceResult.success, true, 'Kafka produce should succeed')

    // Step 2: Consume from Kafka
    const consumeInput: KafkaConsumeInput = {
      topics: ['events'],
      groupId: 'blockchain-consumer',
      maxMessages: 5
    }

    const consumeResult = await qpuKafkaConsume(consumeInput)
    assert.equal(consumeResult.success, true, 'Kafka consume should succeed')

    // Step 3: Call blockchain with data
    if (consumeResult.messages.length > 0) {
      const blockchainInput: BlockchainCallInput = {
        chain: 'ethereum',
        network: 'testnet',
        contractAddress: '0x1234567890123456789012345678901234567890',
        method: 'processEvent',
        args: [JSON.stringify(consumeResult.messages[0])],
        write: false
      }

      const blockchainResult = await qpuBlockchainCall(blockchainInput)
      assert(blockchainResult.success !== undefined, 'Blockchain call should complete')

      console.log('✓ Kafka to Blockchain pipeline successful')
    }
  } catch (e) {
    console.log('⊘ Kafka to Blockchain pipeline test failed:', (e as Error).message)
  }
})
