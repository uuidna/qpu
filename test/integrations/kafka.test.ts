/**
 * Kafka Integration Tests
 * Test produce/consume roundtrip and schema validation
 */

import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { Kafka } from '../../src/integrations/kafka-client.js'

test('Kafka - Producer initialization', async () => {
  const producer = Kafka.createProducer({
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: 'test-producer',
    compression: 'gzip'
  })

  assert(producer, 'Producer should be created')
  console.log('✓ Producer initialized successfully')

  await producer.close()
})

test('Kafka - Consumer initialization', async () => {
  const consumer = Kafka.createConsumer({
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: 'test-consumer',
    groupId: 'test-group'
  })

  assert(consumer, 'Consumer should be created')
  console.log('✓ Consumer initialized successfully')

  await consumer.close()
})

test('Kafka - Produce messages', async () => {
  const producer = Kafka.createProducer({
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: 'test-producer'
  })

  try {
    const results = await producer.produce('test-topic', [
      { key: 'user-1', value: JSON.stringify({ id: 1, name: 'Alice' }) },
      { key: 'user-2', value: JSON.stringify({ id: 2, name: 'Bob' }) },
      { key: 'user-3', value: JSON.stringify({ id: 3, name: 'Charlie' }) }
    ])

    assert.equal(results.length, 3, 'Should produce 3 messages')
    assert(results[0].offset !== undefined, 'Should have offset')
    assert(results[0].partition !== undefined, 'Should have partition')

    await producer.flush()

    console.log('✓ Producer successful')
    console.log(`  Messages produced: ${results.length}`)
    console.log(`  Offsets: ${results.map(r => r.offset).join(', ')}`)
  } finally {
    await producer.close()
  }
})

test('Kafka - Consume messages', async () => {
  const consumer = Kafka.createConsumer({
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: 'test-consumer',
    groupId: 'test-group'
  })

  try {
    await consumer.subscribe(['test-topic'])

    const messages = await consumer.consume({
      topics: ['test-topic'],
      fromBeginning: true,
      maxMessages: 10,
      timeout: 5000
    })

    assert(Array.isArray(messages), 'Should return array of messages')

    console.log('✓ Consumer successful')
    console.log(`  Messages consumed: ${messages.length}`)

    if (messages.length > 0) {
      console.log(`  First message: ${JSON.stringify(messages[0], null, 2)}`)
    }
  } finally {
    await consumer.close()
  }
})

test('Kafka - Schema validation', async () => {
  const validator = Kafka.createSchemaValidator()

  // Register schema
  const schema = {
    id: 'number',
    name: 'string',
    email: 'string'
  }

  validator.registerSchema('users-topic', schema)

  // Valid message
  const validMessage = { id: 1, name: 'Alice', email: 'alice@example.com' }
  const validResult = validator.validate('users-topic', validMessage)

  assert(validResult.valid, 'Valid message should pass')
  assert.equal(validResult.errors.length, 0, 'Valid message should have no errors')

  // Invalid message
  const invalidMessage = { id: 'not-a-number', name: 'Bob', email: 123 }
  const invalidResult = validator.validate('users-topic', invalidMessage)

  assert(!invalidResult.valid, 'Invalid message should fail')
  assert(invalidResult.errors.length > 0, 'Invalid message should have errors')

  console.log('✓ Schema validation working')
  console.log(`  Valid message errors: ${validResult.errors.length}`)
  console.log(`  Invalid message errors: ${invalidResult.errors.length}`)
})

test('Kafka - Producer and Consumer roundtrip', async () => {
  const producer = Kafka.createProducer({
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: 'roundtrip-producer'
  })

  const consumer = Kafka.createConsumer({
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: 'roundtrip-consumer',
    groupId: 'roundtrip-group'
  })

  try {
    const testTopic = 'roundtrip-test'

    // Produce
    const produceResults = await producer.produce(testTopic, [
      { key: 'msg-1', value: JSON.stringify({ timestamp: Date.now(), data: 'test1' }) },
      { key: 'msg-2', value: JSON.stringify({ timestamp: Date.now(), data: 'test2' }) }
    ])

    await producer.flush()

    // Consume
    await consumer.subscribe([testTopic])
    const consumedMessages = await consumer.consume({
      topics: [testTopic],
      fromBeginning: true,
      maxMessages: 5,
      timeout: 5000
    })

    assert(consumedMessages.length > 0, 'Should consume messages')

    console.log('✓ Roundtrip successful')
    console.log(`  Produced: ${produceResults.length}`)
    console.log(`  Consumed: ${consumedMessages.length}`)
  } finally {
    await producer.close()
    await consumer.close()
  }
})

test('Kafka - Consumer groups and offset management', async () => {
  const consumer = Kafka.createConsumer({
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: 'offset-test',
    groupId: 'offset-group'
  })

  try {
    await consumer.subscribe(['test-topic'])

    // Consume messages
    await consumer.consume({
      topics: ['test-topic'],
      maxMessages: 5,
      timeout: 3000
    })

    // Commit offsets
    await consumer.commitOffsets()

    // Get current offsets
    const offsets = consumer.getOffsets()
    assert(typeof offsets === 'object', 'Should return offsets')

    console.log('✓ Offset management working')
    console.log(`  Current offsets: ${JSON.stringify(offsets)}`)
  } finally {
    await consumer.close()
  }
})

test('Kafka - Seek to beginning', async () => {
  const consumer = Kafka.createConsumer({
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: 'seek-test',
    groupId: 'seek-group'
  })

  try {
    await consumer.subscribe(['test-topic'])

    // Seek to beginning
    await consumer.seekToBeginning(['test-topic'])

    // Get offsets
    const offsets = consumer.getOffsets()

    console.log('✓ Seek to beginning successful')
    console.log(`  Offsets after seek: ${JSON.stringify(offsets)}`)
  } finally {
    await consumer.close()
  }
})

test('Kafka - Event emission', async () => {
  const producer = Kafka.createProducer({
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: 'event-test'
  })

  let producedCalled = false
  let flushedCalled = false

  producer.on('produced', (e: any) => {
    producedCalled = true
  })

  producer.on('flushed', () => {
    flushedCalled = true
  })

  try {
    await producer.produce('test-topic', [
      { key: 'event-test', value: 'test data' }
    ])
    await producer.flush()

    assert(producedCalled, 'produced event should fire')
    assert(flushedCalled, 'flushed event should fire')

    console.log('✓ Event emission working')
  } finally {
    await producer.close()
  }
})
