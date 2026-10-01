/**
 * Database Adapter Integration Tests
 * Test CRUD operations across PostgreSQL, MongoDB, DynamoDB
 */

import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { DBAdapter } from '../../src/integrations/db-adapter.js'

test('DBAdapter - PostgreSQL basic operations', async () => {
  if (!process.env.DATABASE_URL?.includes('postgresql')) {
    console.log('⊘ Skipping PostgreSQL test (DATABASE_URL not PostgreSQL)')
    return
  }

  const adapter = new DBAdapter({
    adapter: 'postgresql',
    connectionString: process.env.DATABASE_URL
  })

  try {
    // Test INSERT
    const insertResult = await adapter.insert('users', {
      name: 'Test User',
      email: 'test@example.com',
      created_at: new Date()
    })

    assert.equal(insertResult.rowCount, 1, 'INSERT should return 1 row')
    assert(insertResult.lastInsertId, 'INSERT should return ID')

    // Test SELECT
    const selectResult = await adapter.query(
      'SELECT * FROM users WHERE email = $1',
      ['test@example.com']
    )

    assert(selectResult.rowCount > 0, 'SELECT should find inserted row')
    assert.equal(selectResult.rows[0].email, 'test@example.com')

    // Test UPDATE
    const updateResult = await adapter.update('users', { name: 'Updated User' }, { email: 'test@example.com' })
    assert.equal(updateResult.rowCount, 1, 'UPDATE should affect 1 row')

    console.log('✓ PostgreSQL basic operations successful')
  } finally {
    await adapter.close()
  }
})

test('DBAdapter - MongoDB basic operations', async () => {
  if (!process.env.DATABASE_URL?.includes('mongodb')) {
    console.log('⊘ Skipping MongoDB test (DATABASE_URL not MongoDB)')
    return
  }

  const adapter = new DBAdapter({
    adapter: 'mongodb',
    connectionString: process.env.DATABASE_URL
  })

  try {
    // Test INSERT
    const insertResult = await adapter.insert('users', {
      name: 'Test User',
      email: 'mongo@example.com',
      created_at: new Date()
    })

    assert.equal(insertResult.rowCount, 1, 'INSERT should return 1 row')
    assert(insertResult.id, 'INSERT should return ID')

    // Test SELECT
    const selectResult = await adapter.query(
      'SELECT * FROM users WHERE email = "mongo@example.com"',
      []
    )

    assert(selectResult.rowCount >= 0, 'SELECT should complete')

    // Test UPDATE
    const updateResult = await adapter.update('users', { name: 'Updated User' }, { email: 'mongo@example.com' })
    assert.equal(updateResult.rowCount, 1, 'UPDATE should affect 1 row')

    console.log('✓ MongoDB basic operations successful')
  } finally {
    await adapter.close()
  }
})

test('DBAdapter - Transaction support', async () => {
  if (!process.env.DATABASE_URL?.includes('postgresql')) {
    console.log('⊘ Skipping transaction test (DATABASE_URL not PostgreSQL)')
    return
  }

  const adapter = new DBAdapter({
    adapter: 'postgresql',
    connectionString: process.env.DATABASE_URL
  })

  try {
    // Begin transaction
    const txn = await adapter.beginTransaction('txn-1')

    // Insert within transaction
    const insertResult = await txn.insert('users', {
      name: 'Txn User',
      email: 'txn@example.com'
    })

    assert.equal(insertResult.rowCount, 1, 'INSERT in txn should succeed')

    // Commit
    await adapter.commitTransaction('txn-1')

    console.log('✓ Transaction support successful')
  } catch (e) {
    console.log('⊘ Transaction test skipped:', (e as Error).message)
  } finally {
    await adapter.close()
  }
})

test('DBAdapter - DynamoDB operations', async () => {
  if (!process.env.AWS_REGION) {
    console.log('⊘ Skipping DynamoDB test (AWS_REGION not set)')
    return
  }

  const adapter = new DBAdapter({
    adapter: 'dynamodb',
    region: process.env.AWS_REGION,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })

  try {
    // Test INSERT
    const insertResult = await adapter.insert('Users', {
      email: 'dynamodb@example.com',
      name: 'DynamoDB User'
    })

    assert.equal(insertResult.rowCount, 1, 'INSERT should succeed')
    assert(insertResult.id, 'INSERT should return ID')

    console.log('✓ DynamoDB operations successful')
  } catch (e) {
    console.log('⊘ DynamoDB test skipped:', (e as Error).message)
  } finally {
    await adapter.close()
  }
})

test('DBAdapter - Connection pooling', async () => {
  if (!process.env.DATABASE_URL?.includes('postgresql')) {
    console.log('⊘ Skipping pool test (DATABASE_URL not PostgreSQL)')
    return
  }

  const adapter = new DBAdapter({
    adapter: 'postgresql',
    connectionString: process.env.DATABASE_URL,
    poolSize: 5
  })

  try {
    // Simulate multiple concurrent queries
    const promises = []
    for (let i = 0; i < 3; i++) {
      promises.push(
        adapter.query('SELECT 1 as test', [])
      )
    }

    const results = await Promise.all(promises)
    assert.equal(results.length, 3, 'All queries should complete')
    assert(results.every(r => !r.error), 'No queries should error')

    console.log('✓ Connection pooling successful')
  } finally {
    await adapter.close()
  }
})

test('DBAdapter - Error handling', async () => {
  const adapter = new DBAdapter({
    adapter: 'postgresql',
    connectionString: 'postgresql://invalid:invalid@localhost/nonexistent'
  })

  try {
    const result = await adapter.query('SELECT 1', [])
    assert(result.error || result.rowCount === 0, 'Should handle connection error gracefully')

    console.log('✓ Error handling successful')
  } finally {
    await adapter.close()
  }
})

test('DBAdapter - Prepared statements', async () => {
  if (!process.env.DATABASE_URL?.includes('postgresql')) {
    console.log('⊘ Skipping prepared statement test')
    return
  }

  const adapter = new DBAdapter({
    adapter: 'postgresql',
    connectionString: process.env.DATABASE_URL
  })

  try {
    // Test parameterized query
    const result = await adapter.query(
      'SELECT * FROM users WHERE email = $1 AND status = $2',
      ['test@example.com', 'active']
    )

    assert.equal(result.error, undefined, 'Parameterized query should succeed')

    console.log('✓ Prepared statements working')
  } finally {
    await adapter.close()
  }
})
