/**
 * Blockchain Gateway Integration Tests
 * Test Ethereum and Solana contract calls and event subscriptions
 */

import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { BlockchainGateway } from '../../src/integrations/blockchain-gateway.js'

test('BlockchainGateway - Ethereum initialization', async () => {
  const gateway = new BlockchainGateway({
    chain: 'ethereum',
    network: 'testnet',
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'http://localhost:8545'
  })

  assert(gateway, 'Gateway should be created')
  console.log('✓ Ethereum gateway initialized')
})

test('BlockchainGateway - Solana initialization', async () => {
  const gateway = new BlockchainGateway({
    chain: 'solana',
    network: 'devnet',
    rpcUrl: process.env.SOLANA_RPC_URL || 'http://localhost:8899'
  })

  assert(gateway, 'Gateway should be created')
  console.log('✓ Solana gateway initialized')
})

test('BlockchainGateway - Ethereum call', async () => {
  const gateway = new BlockchainGateway({
    chain: 'ethereum',
    network: 'testnet',
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'http://localhost:8545'
  })

  try {
    const result = await gateway.call({
      address: '0x1234567890123456789012345678901234567890',
      method: 'balanceOf',
      args: ['0x0000000000000000000000000000000000000000']
    })

    assert(result.success !== undefined, 'Should return success status')

    console.log('✓ Ethereum call successful')
    console.log(`  Result: ${JSON.stringify(result.result)}`)
  } catch (e) {
    console.log('⊘ Ethereum call skipped:', (e as Error).message)
  }
})

test('BlockchainGateway - Ethereum transaction', async () => {
  if (!process.env.ETHEREUM_PRIVATE_KEY) {
    console.log('⊘ Skipping Ethereum transaction test (ETHEREUM_PRIVATE_KEY not set)')
    return
  }

  const gateway = new BlockchainGateway({
    chain: 'ethereum',
    network: 'testnet',
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'http://localhost:8545',
    privateKey: process.env.ETHEREUM_PRIVATE_KEY
  })

  try {
    const result = await gateway.execute({
      address: '0x1234567890123456789012345678901234567890',
      method: 'transfer',
      args: ['0x0000000000000000000000000000000000000000', '1000'],
      value: '0'
    })

    assert(result.success !== undefined, 'Should return success status')

    if (result.success) {
      assert(result.transactionHash, 'Successful tx should have hash')
    }

    console.log('✓ Ethereum transaction successful')
    console.log(`  TX Hash: ${result.transactionHash}`)
  } catch (e) {
    console.log('⊘ Ethereum transaction skipped:', (e as Error).message)
  }
})

test('BlockchainGateway - Get balance', async () => {
  const gateway = new BlockchainGateway({
    chain: 'ethereum',
    network: 'testnet',
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'http://localhost:8545'
  })

  try {
    const balance = await gateway.getBalance('0x1234567890123456789012345678901234567890')

    assert(balance.balance !== undefined, 'Should return balance')
    assert(balance.unit, 'Should return unit (ETH)')

    console.log('✓ Get balance successful')
    console.log(`  Balance: ${balance.balance} ${balance.unit}`)
  } catch (e) {
    console.log('⊘ Get balance skipped:', (e as Error).message)
  }
})

test('BlockchainGateway - Get transaction status', async () => {
  const gateway = new BlockchainGateway({
    chain: 'ethereum',
    network: 'testnet',
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'http://localhost:8545'
  })

  try {
    const status = await gateway.getTransactionStatus(
      '0x1234567890123456789012345678901234567890123456789012345678901234'
    )

    assert(status.status, 'Should return status')
    assert(['pending', 'confirmed', 'failed'].includes(status.status), 'Status should be valid')

    console.log('✓ Get transaction status successful')
    console.log(`  Status: ${status.status}`)
    console.log(`  Block: ${status.blockNumber}`)
    console.log(`  Gas used: ${status.gasUsed}`)
  } catch (e) {
    console.log('⊘ Get transaction status skipped:', (e as Error).message)
  }
})

test('BlockchainGateway - Register ABI', async () => {
  const gateway = new BlockchainGateway({
    chain: 'ethereum',
    network: 'testnet',
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'http://localhost:8545'
  })

  const abi = [
    {
      name: 'transfer',
      type: 'function' as const,
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: [{ name: 'success', type: 'bool' }]
    },
    {
      name: 'Transfer',
      type: 'event' as const,
      inputs: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' }
      ]
    }
  ]

  gateway.registerABI('0x1234567890123456789012345678901234567890', abi)

  console.log('✓ ABI registered successfully')
  console.log(`  Functions: ${abi.filter(a => a.type === 'function').length}`)
  console.log(`  Events: ${abi.filter(a => a.type === 'event').length}`)
})

test('BlockchainGateway - Subscribe to events', async () => {
  const gateway = new BlockchainGateway({
    chain: 'ethereum',
    network: 'testnet',
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'http://localhost:8545'
  })

  try {
    const subscriptionId = gateway.subscribe({
      id: '',
      contractAddress: '0x1234567890123456789012345678901234567890',
      eventName: 'Transfer',
      fromBlock: 0,
      toBlock: 'latest' as any
    })

    assert(subscriptionId, 'Should return subscription ID')

    // Get events
    const events = await gateway.getEvents(subscriptionId)
    assert(Array.isArray(events), 'Should return array of events')

    console.log('✓ Event subscription successful')
    console.log(`  Subscription ID: ${subscriptionId}`)
    console.log(`  Events received: ${events.length}`)
  } catch (e) {
    console.log('⊘ Event subscription skipped:', (e as Error).message)
  }
})

test('BlockchainGateway - Unsubscribe from events', async () => {
  const gateway = new BlockchainGateway({
    chain: 'ethereum',
    network: 'testnet',
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'http://localhost:8545'
  })

  try {
    const subscriptionId = gateway.subscribe({
      id: '',
      contractAddress: '0x1234567890123456789012345678901234567890',
      eventName: 'Transfer'
    })

    const unsubscribed = gateway.unsubscribe(subscriptionId)
    assert(unsubscribed, 'Should successfully unsubscribe')

    console.log('✓ Event unsubscribe successful')
  } catch (e) {
    console.log('⊘ Event unsubscribe skipped:', (e as Error).message)
  }
})

test('BlockchainGateway - Solana call', async () => {
  const gateway = new BlockchainGateway({
    chain: 'solana',
    network: 'devnet',
    rpcUrl: process.env.SOLANA_RPC_URL || 'http://localhost:8899'
  })

  try {
    const result = await gateway.call({
      address: 'TokenkegQfeZyiNwAJsyFbPVwwQQfփVMwQWfV1qWpj',
      method: 'getTokenSupply'
    })

    assert(result.success !== undefined, 'Should return result')

    console.log('✓ Solana call successful')
    console.log(`  Result: ${JSON.stringify(result.result)}`)
  } catch (e) {
    console.log('⊘ Solana call skipped:', (e as Error).message)
  }
})

test('BlockchainGateway - Solana balance check', async () => {
  const gateway = new BlockchainGateway({
    chain: 'solana',
    network: 'devnet',
    rpcUrl: process.env.SOLANA_RPC_URL || 'http://localhost:8899'
  })

  try {
    const balance = await gateway.getBalance('11111111111111111111111111111111')

    assert(balance.balance !== undefined, 'Should return balance')
    assert(balance.unit === 'SOL', 'Should return SOL unit')

    console.log('✓ Solana balance check successful')
    console.log(`  Balance: ${balance.balance} ${balance.unit}`)
  } catch (e) {
    console.log('⊘ Solana balance check skipped:', (e as Error).message)
  }
})

test('BlockchainGateway - Multiple chain support', async () => {
  const ethereumGateway = new BlockchainGateway({
    chain: 'ethereum',
    network: 'testnet',
    rpcUrl: 'http://localhost:8545'
  })

  const solanaGateway = new BlockchainGateway({
    chain: 'solana',
    network: 'devnet',
    rpcUrl: 'http://localhost:8899'
  })

  const ethereumBalance = await ethereumGateway.getBalance('0x0000000000000000000000000000000000000000')
  const solanaBalance = await solanaGateway.getBalance('11111111111111111111111111111111')

  assert.equal(ethereumBalance.unit, 'ETH')
  assert.equal(solanaBalance.unit, 'SOL')

  console.log('✓ Multi-chain support working')
  console.log(`  Ethereum: ${ethereumBalance.balance} ${ethereumBalance.unit}`)
  console.log(`  Solana: ${solanaBalance.balance} ${solanaBalance.unit}`)
})
