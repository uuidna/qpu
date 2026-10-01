# Phase 16: External Integrations for UUIDNA QPU v0.9.0

**Release Date:** October 2, 2026  
**Status:** Complete  
**Architecture:** 4 integration layers + 6 MCP operations + 4 hybrid formulas

## Overview

Phase 16 introduces external system integrations for UUIDNA QPU, enabling seamless connectivity with LLMs, databases, message queues, and blockchains. This phase completes the platform's external integration layer, supporting hybrid compute scenarios where QPU formulas combine with external services.

## Architecture

### 1. Integration Adapters (4 modules)

#### `src/integrations/llm-connector.ts`
External LLM integration with streaming and retry logic.

**Capabilities:**
- OpenAI GPT (gpt-4, gpt-4o-mini, etc.)
- Anthropic Claude (claude-3-sonnet, claude-3.5-sonnet, etc.)
- Streaming token delivery
- Exponential backoff retry (3 attempts, up to 10s)
- Connection timeouts (configurable, default 30s)

**Config:**
```typescript
const connector = new LLMConnector({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2048
})
```

**Usage:**
```typescript
// Non-streaming
const response = await connector.chatCompletion([
  { role: 'user', content: 'What is 2+2?' }
])

// Streaming
for await (const token of connector.streamChatCompletion(messages)) {
  process.stdout.write(token)
}
```

---

#### `src/integrations/db-adapter.ts`
Multi-database support with transaction and pooling.

**Supported Adapters:**
- PostgreSQL (prepared statements, transactions)
- MongoDB (document operations)
- DynamoDB (AWS NoSQL)

**Features:**
- Connection pooling (configurable size)
- Prepared statement protection against SQL injection
- Transaction support (begin/commit/rollback)
- Unified interface across adapters

**Config:**
```typescript
const db = new DBAdapter({
  adapter: 'postgresql',
  connectionString: process.env.DATABASE_URL,
  poolSize: 10
})
```

**Usage:**
```typescript
// Query
const result = await db.query('SELECT * FROM users WHERE email = $1', ['test@example.com'])

// Insert
const inserted = await db.insert('users', { name: 'Alice', email: 'alice@example.com' })

// Update
const updated = await db.update('users', { status: 'active' }, { id: 123 })

// Transaction
const txn = await db.beginTransaction('txn-1')
await txn.insert('logs', { message: 'test' })
await db.commitTransaction('txn-1')
```

---

#### `src/integrations/kafka-client.ts`
Kafka producer and consumer with schema validation.

**Features:**
- Producer with compression (gzip, snappy, lz4, zstd)
- Consumer groups and offset management
- Schema validation with type checking
- Seek to beginning for replay

**Config:**
```typescript
const producer = Kafka.createProducer({
  brokers: process.env.KAFKA_BROKERS.split(','),
  clientId: 'qpu-producer',
  compression: 'gzip'
})

const consumer = Kafka.createConsumer({
  brokers: process.env.KAFKA_BROKERS.split(','),
  groupId: 'qpu-group'
})
```

**Usage:**
```typescript
// Produce
await producer.produce('events-topic', [
  { key: 'event-1', value: JSON.stringify({ type: 'purchase' }) }
])

// Consume
const messages = await consumer.consume({
  topics: ['events-topic'],
  fromBeginning: true,
  maxMessages: 100
})

// Validate
const validator = Kafka.createSchemaValidator()
validator.registerSchema('events-topic', { id: 'number', type: 'string' })
const { valid, errors } = validator.validate('events-topic', message)
```

---

#### `src/integrations/blockchain-gateway.ts`
Ethereum and Solana smart contract integration.

**Chains:**
- Ethereum (mainnet, testnet)
- Solana (mainnet, devnet, testnet)

**Features:**
- Contract calls (read-only)
- Transaction execution (write)
- Event subscriptions
- Balance checking
- Transaction status tracking
- ABI registration and caching

**Config:**
```typescript
const gateway = new BlockchainGateway({
  chain: 'ethereum',
  network: 'testnet',
  rpcUrl: process.env.ETHEREUM_RPC_URL,
  privateKey: process.env.ETHEREUM_PRIVATE_KEY
})
```

**Usage:**
```typescript
// Read call
const result = await gateway.call({
  address: '0x...',
  method: 'balanceOf',
  args: ['0x...']
})

// Write transaction
const tx = await gateway.execute({
  address: '0x...',
  method: 'transfer',
  args: ['0x...', '1000'],
  value: '0'
})

// Events
const subId = gateway.subscribe({
  contractAddress: '0x...',
  eventName: 'Transfer'
})
const events = await gateway.getEvents(subId)

// Balance
const balance = await gateway.getBalance('0x...')
```

---

### 2. MCP Operations (6 new ops)

All operations are registered under domain `integrations`.

#### `qpu_llm_chat`
Send prompt to external LLM with streaming support.

**Input:**
```typescript
{
  provider: 'openai' | 'anthropic',
  model: string,
  messages: ChatMessage[],
  temperature?: number,
  maxTokens?: number,
  stream?: boolean
}
```

**Output:**
```typescript
{
  id: string,
  content: string,
  model: string,
  stopReason: string,
  tokenUsage: { prompt, completion, total },
  streamTokens?: string[]
}
```

**CLI:**
```bash
npm run mcp -- qpu_llm_chat --provider openai --model gpt-4o-mini --message "Explain quantum computing"
```

---

#### `qpu_db_query`
Execute SELECT/INSERT/UPDATE across adapters.

**Input:**
```typescript
{
  adapter: 'postgresql' | 'mongodb' | 'dynamodb',
  operation: 'select' | 'insert' | 'update',
  table: string,
  sql?: string,
  data?: Record<string, any>,
  where?: Record<string, any>,
  params?: any[]
}
```

**Output:**
```typescript
{
  success: boolean,
  rowCount: number,
  rows?: Record<string, any>[],
  id?: string | number,
  error?: string
}
```

**CLI:**
```bash
npm run mcp -- qpu_db_query --adapter postgresql --operation select --table users --sql "SELECT * FROM users LIMIT 10"
```

---

#### `qpu_kafka_produce`
Publish message to Kafka topic with schema validation.

**Input:**
```typescript
{
  topic: string,
  messages: Array<{
    key?: string,
    value: string | Record<string, any>,
    headers?: Record<string, string>
  }>,
  compression?: 'gzip' | 'snappy' | 'lz4' | 'zstd' | 'none'
}
```

**Output:**
```typescript
{
  success: boolean,
  topic: string,
  producedCount: number,
  offsets: number[],
  error?: string
}
```

---

#### `qpu_kafka_consume`
Subscribe and consume messages from Kafka topic.

**Input:**
```typescript
{
  topics: string[],
  groupId: string,
  fromBeginning?: boolean,
  maxMessages?: number,
  timeout?: number,
  validateSchema?: Record<string, any>
}
```

**Output:**
```typescript
{
  success: boolean,
  messages: Array<{
    topic: string,
    key?: string,
    value: any,
    offset: number,
    partition: number,
    timestamp: number
  }>,
  messageCount: number,
  error?: string
}
```

---

#### `qpu_blockchain_call`
Call smart contract function on Ethereum/Solana.

**Input:**
```typescript
{
  chain: 'ethereum' | 'solana',
  network: 'mainnet' | 'testnet' | 'devnet',
  contractAddress: string,
  method: string,
  args?: any[],
  value?: string,
  gas?: number,
  write?: boolean
}
```

**Output:**
```typescript
{
  success: boolean,
  result?: any,
  transactionHash?: string,
  gasUsed?: number,
  blockNumber?: number,
  error?: string
}
```

---

#### `qpu_blockchain_watch`
Subscribe to contract events on Ethereum/Solana.

**Input:**
```typescript
{
  chain: 'ethereum' | 'solana',
  network: 'mainnet' | 'testnet' | 'devnet',
  contractAddress: string,
  eventName: string,
  filter?: Record<string, any>,
  fromBlock?: number,
  toBlock?: number
}
```

**Output:**
```typescript
{
  success: boolean,
  subscriptionId?: string,
  events?: any[],
  error?: string
}
```

---

### 3. Harmony Formulas (4 hybrid formulas)

Located in `src/harmony/integrations.ts`

#### Formula 1: `hybrid_llm_reasoning`
QPU formula → LLM verification → QPU refinement

**Flow:**
1. Execute QPU formula with inputs
2. Send result to external LLM for verification
3. Score verification confidence (0-1)
4. If score < 0.8, iteratively refine via LLM feedback
5. Return refined result with metrics

**Use Cases:**
- Validate quantitative results with qualitative reasoning
- Error correction via LLM feedback
- Multi-perspective analysis

**Example:**
```typescript
const output = await hybridLLMReasoning(
  {
    qpuFormula: { id: 'price-prediction', inputs: { market_data } },
    llmVerification: {
      provider: 'openai',
      model: 'gpt-4',
      prompt: 'Does this price prediction make sense given current market conditions?'
    },
    refinement: { enabled: true, maxIterations: 3 }
  },
  llmConnector
)
```

---

#### Formula 2: `db_augmented_compute`
Query DB → Formula execution → Store results

**Flow:**
1. Query database for contextual data
2. Augment formula inputs with DB context
3. Execute QPU formula with enriched inputs
4. Store results back to database with metadata

**Use Cases:**
- Historical context-aware computations
- Audit trail for all formula executions
- Reproducible results from archived data
- Feature engineering from databases

**Example:**
```typescript
const output = await dbAugmentedCompute(
  {
    qpuFormula: { id: 'inventory-forecast', inputs: {} },
    database: {
      adapter: 'postgresql',
      queryTable: 'sales_history',
      querySQL: 'SELECT * FROM sales_history WHERE date > NOW() - INTERVAL 1 YEAR',
      storeTable: 'formula_results'
    }
  },
  dbAdapter
)
```

---

#### Formula 3: `event_driven_formula`
Kafka trigger → Formula execution → Kafka output

**Flow:**
1. Subscribe to Kafka input topic
2. Consume batch of messages
3. Execute QPU formula for each message (parallel or serial)
4. Produce results to output topic

**Use Cases:**
- Real-time event processing pipelines
- Stream processing with QPU compute
- Event enrichment and transformation
- Scalable distributed processing

**Example:**
```typescript
const output = await eventDrivenFormula(
  {
    kafka: {
      brokers: ['localhost:9092'],
      inputTopic: 'sensor-data',
      outputTopic: 'processed-data',
      groupId: 'qpu-processor'
    },
    qpuFormula: { id: 'anomaly-detection' },
    batch: { maxMessages: 100, parallelProcessing: true }
  },
  kafkaConsumer,
  kafkaProducer
)
```

---

#### Formula 4: `blockchain_oracle`
Fetch on-chain data → Formula execution → Broadcast result

**Flow:**
1. Call blockchain contract to fetch on-chain data (with caching)
2. Execute QPU formula with blockchain data as input
3. Optionally broadcast result back to blockchain
4. Return result with cache hit metadata

**Use Cases:**
- On-chain data analysis
- Cross-chain data aggregation
- DeFi protocol integration
- Real-time oracle updates
- Smart contract automation

**Example:**
```typescript
const output = await blockchainOracle(
  {
    blockchain: {
      chain: 'ethereum',
      network: 'mainnet',
      contractAddress: '0xUniswapV3',
      dataMethod: 'getPoolPrices'
    },
    qpuFormula: { id: 'arb-detector' },
    broadcast: {
      enabled: true,
      targetChain: 'ethereum',
      targetContract: '0xOracleContract',
      targetMethod: 'updateArbData'
    },
    cache: { enabled: true, ttlSeconds: 300 }
  },
  blockchainGateway
)
```

---

## Environment Variables

### Required (by adapter)

**LLM:**
```bash
OPENAI_API_KEY=sk-...          # For OpenAI
ANTHROPIC_API_KEY=sk-ant-...   # For Anthropic
```

**Database:**
```bash
DATABASE_URL=postgresql://user:pass@localhost/db  # PostgreSQL
DATABASE_URL=mongodb://user:pass@localhost/db     # MongoDB
AWS_REGION=us-east-1                              # DynamoDB
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

**Kafka:**
```bash
KAFKA_BROKERS=broker1:9092,broker2:9092
```

**Blockchain:**
```bash
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/...
ETHEREUM_PRIVATE_KEY=0x...
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PRIVATE_KEY=...
```

---

## Testing

### Run all integration tests:
```bash
npm test
```

### Run specific integration tests:
```bash
# LLM tests
npm test -- test/integrations/llm.test.ts

# Database tests
npm test -- test/integrations/db-adapter.test.ts

# Kafka tests
npm test -- test/integrations/kafka.test.ts

# Blockchain tests
npm test -- test/integrations/blockchain.test.ts

# MCP operations tests
npm test -- test/integrations/mcp-operations.test.ts
```

### Test Coverage

- **LLM Connector:** 5 tests
  - OpenAI chat completion
  - Anthropic chat completion
  - Streaming (OpenAI)
  - Retry logic
  - Multi-turn conversations

- **Database Adapter:** 7 tests
  - PostgreSQL CRUD
  - MongoDB CRUD
  - DynamoDB operations
  - Transaction support
  - Connection pooling
  - Error handling
  - Prepared statements

- **Kafka Client:** 7 tests
  - Producer initialization
  - Consumer initialization
  - Message production
  - Message consumption
  - Schema validation
  - Roundtrip testing
  - Offset management
  - Event emission

- **Blockchain Gateway:** 10 tests
  - Ethereum initialization
  - Solana initialization
  - Read calls
  - Write transactions
  - Balance checking
  - Transaction status
  - ABI registration
  - Event subscriptions
  - Unsubscribe
  - Multi-chain support

- **MCP Operations:** 14 tests
  - All 6 operations individually
  - Integration scenarios (LLM + DB, Kafka + Blockchain)

---

## Performance Characteristics

### LLM Connector
- **Streaming:** Real-time token delivery (<50ms latency)
- **Batch:** 1-2 second round-trip
- **Retry:** 3 attempts, exponential backoff (1s → 2s → 4s max 10s)

### Database Adapter
- **Query:** <10ms (cached), <100ms (new)
- **Insert:** <5ms (single)
- **Transaction:** <50ms (commit overhead)
- **Connection Pool:** 10-worker default

### Kafka
- **Producer:** <10ms per message (batched)
- **Consumer:** Poll every 100ms
- **Compression:** 40-60% size reduction (gzip)

### Blockchain
- **Call:** 1-3 seconds (RPC latency)
- **Transaction:** 15-120 seconds (blockchain confirmation)
- **Event Fetch:** 500ms-5s depending on block range
- **Cache:** Default 300s TTL

---

## Security Considerations

1. **LLM APIs:** API keys stored in env vars, never logged
2. **Database:** Prepared statements prevent SQL injection
3. **Kafka:** mTLS support via broker config
4. **Blockchain:** Private keys stored in env, not hardcoded
5. **Error Handling:** Sensitive data redacted from logs

---

## Integration Examples

### Example 1: LLM-Verified Analytics
```typescript
const dbData = await qpuDbQuery({
  adapter: 'postgresql',
  operation: 'select',
  table: 'metrics'
})

const analysis = await qpuLlmChat({
  provider: 'openai',
  model: 'gpt-4',
  messages: [{
    role: 'user',
    content: `Analyze these metrics: ${JSON.stringify(dbData.rows)}`
  }]
})
```

### Example 2: Event-Driven Blockchain Updates
```typescript
const messages = await qpuKafkaConsume({
  topics: ['orders'],
  groupId: 'blockchain-writer'
})

for (const msg of messages) {
  await qpuBlockchainCall({
    chain: 'ethereum',
    network: 'mainnet',
    contractAddress: SETTLEMENT_CONTRACT,
    method: 'settleOrder',
    args: [msg.value],
    write: true
  })
}
```

### Example 3: Cross-Chain Oracle
```typescript
const ethData = await qpuBlockchainCall({
  chain: 'ethereum',
  network: 'mainnet',
  contractAddress: UNISWAP_V3,
  method: 'getPoolData'
})

const solanaPrices = await qpuBlockchainCall({
  chain: 'solana',
  network: 'mainnet-beta',
  contractAddress: SERUM_DEX,
  method: 'getPrices'
})

await qpuKafkaProduce({
  topic: 'cross-chain-data',
  messages: [{
    value: { ethereum: ethData, solana: solanaPrices }
  }]
})
```

---

## Registry Metrics

**Phase 16 Additions:**
- 4 integration adapters
- 6 MCP operations
- 4 hybrid formulas
- 43 integration tests (4 suites + combined scenarios)
- Full multi-chain support

**Total System Scope:**
- 60+ MCP operations (including Phase 16)
- 88+ formulas across 13 domains
- 4 deployment modes (browser, standalone, docker, k8s)
- 3 database adapters
- 2 blockchain chains
- Message queue integration
- External LLM integration

---

## Deployment

### Docker with External Services

```yaml
version: '3.8'
services:
  qpu:
    image: uuidna/qpu:v0.9.0
    environment:
      DATABASE_URL: postgresql://postgres:pass@postgres:5432/qpu
      KAFKA_BROKERS: kafka:9092
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      ETHEREUM_RPC_URL: https://eth-mainnet.g.alchemy.com/v2/...
    depends_on:
      - postgres
      - kafka

  postgres:
    image: postgres:15

  kafka:
    image: confluentinc/cp-kafka:7.0
```

### Kubernetes Secrets

```bash
kubectl create secret generic qpu-integrations \
  --from-literal=OPENAI_API_KEY=$OPENAI_API_KEY \
  --from-literal=ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  --from-literal=ETHEREUM_PRIVATE_KEY=$ETHEREUM_PRIVATE_KEY \
  -n quantum
```

---

## Roadmap (Phase 17+)

- [ ] GraphQL Federation for external APIs
- [ ] Real-time streaming compute over Kafka
- [ ] Advanced contract interaction (multi-call, delegatecall)
- [ ] Cross-chain atomic transactions
- [ ] Vector DB integration for RAG
- [ ] S3/R2 cloud storage adapters
- [ ] Redis caching layer

---

## Version

- **Version:** 0.9.0
- **Phase:** 16
- **Released:** October 2, 2026
- **License:** CC-BY-NC-ND-4.0
