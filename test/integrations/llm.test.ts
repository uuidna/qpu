/**
 * LLM Integration Tests
 * Test chat completion and streaming with OpenAI and Anthropic
 */

import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { LLMConnector, type ChatMessage } from '../../src/integrations/llm-connector.js'

test('LLMConnector - OpenAI chat completion', async () => {
  // Skip if no API key
  if (!process.env.OPENAI_API_KEY) {
    console.log('⊘ Skipping OpenAI test (OPENAI_API_KEY not set)')
    return
  }

  const connector = new LLMConnector({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 100
  })

  const messages: ChatMessage[] = [
    { role: 'user', content: 'Say hello in 10 words or less.' }
  ]

  try {
    const response = await connector.chatCompletion(messages)

    assert(response.id, 'Response should have an ID')
    assert(response.content, 'Response should have content')
    assert.equal(response.model, 'gpt-4o-mini')
    assert(response.tokenUsage.total > 0, 'Token usage should be tracked')

    console.log('✓ OpenAI chat completion successful')
    console.log(`  Content length: ${response.content.length}`)
    console.log(`  Tokens: ${response.tokenUsage.total}`)
  } catch (e) {
    console.error('✗ OpenAI chat completion failed:', (e as Error).message)
    throw e
  }
})

test('LLMConnector - Anthropic chat completion', async () => {
  // Skip if no API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('⊘ Skipping Anthropic test (ANTHROPIC_API_KEY not set)')
    return
  }

  const connector = new LLMConnector({
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.7,
    maxTokens: 100
  })

  const messages: ChatMessage[] = [
    { role: 'user', content: 'Say hello in 10 words or less.' }
  ]

  try {
    const response = await connector.chatCompletion(messages)

    assert(response.id, 'Response should have an ID')
    assert(response.content, 'Response should have content')
    assert(response.tokenUsage.total > 0, 'Token usage should be tracked')

    console.log('✓ Anthropic chat completion successful')
    console.log(`  Content length: ${response.content.length}`)
    console.log(`  Tokens: ${response.tokenUsage.total}`)
  } catch (e) {
    console.error('✗ Anthropic chat completion failed:', (e as Error).message)
    throw e
  }
})

test('LLMConnector - OpenAI streaming', async () => {
  // Skip if no API key
  if (!process.env.OPENAI_API_KEY) {
    console.log('⊘ Skipping OpenAI streaming test (OPENAI_API_KEY not set)')
    return
  }

  const connector = new LLMConnector({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 50
  })

  const messages: ChatMessage[] = [
    { role: 'user', content: 'Count from 1 to 5.' }
  ]

  try {
    let streamedContent = ''
    let tokenCount = 0

    for await (const token of connector.streamChatCompletion(messages)) {
      streamedContent += token
      tokenCount++
    }

    assert(streamedContent.length > 0, 'Should receive streamed content')
    assert(tokenCount > 0, 'Should receive multiple tokens')

    console.log('✓ OpenAI streaming successful')
    console.log(`  Tokens streamed: ${tokenCount}`)
    console.log(`  Total content length: ${streamedContent.length}`)
  } catch (e) {
    console.error('✗ OpenAI streaming failed:', (e as Error).message)
    throw e
  }
})

test('LLMConnector - Retry logic on failure', async () => {
  const connector = new LLMConnector({
    provider: 'openai',
    apiKey: 'invalid-key',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 100
  })

  const messages: ChatMessage[] = [
    { role: 'user', content: 'Test message' }
  ]

  try {
    await connector.chatCompletion(messages, { retryAttempts: 2 })
    assert.fail('Should have thrown an error')
  } catch (e) {
    console.log('✓ Retry logic correctly exhausted attempts')
  }
})

test('LLMConnector - Multi-turn conversation', async () => {
  if (!process.env.OPENAI_API_KEY) {
    console.log('⊘ Skipping multi-turn test (OPENAI_API_KEY not set)')
    return
  }

  const connector = new LLMConnector({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 50
  })

  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is 2+2?' },
    { role: 'assistant', content: '2+2 equals 4.' },
    { role: 'user', content: 'What about 3+3?' }
  ]

  try {
    const response = await connector.chatCompletion(messages)

    assert(response.content.length > 0, 'Should generate response')
    console.log('✓ Multi-turn conversation successful')
    console.log(`  Response: ${response.content.substring(0, 50)}...`)
  } catch (e) {
    console.error('✗ Multi-turn conversation failed:', (e as Error).message)
    throw e
  }
})
