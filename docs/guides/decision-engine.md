# MCP Decision Engine: Intelligent Provider Selection

**Automatically choose the best quantum provider based on circuit requirements and optimization criteria.**

## Overview

The decision engine intelligently selects quantum providers by analyzing:
- Circuit complexity (qubits, depth, gate count)
- Optimization preferences (fidelity, speed, cost, availability)
- Provider metrics (real performance data)
- Learning from execution results (machine learning)

## Quick Start

### Choose Optimal Provider

```javascript
// Automatically balanced across all metrics
await mcpTool('decide/optimal-provider', {
  qubits: 5,
  complexity: 'medium'
})

// Result: "ibm-quantum" (best balance)
```

### Choose Fastest Provider

```javascript
await mcpTool('decide/fastest', {
  qubits: 3,
  complexity: 'easy'
})

// Result: "google-cirq" (fastest execution)
```

### Choose Most Accurate Provider

```javascript
await mcpTool('decide/most-accurate', {
  qubits: 10,
  complexity: 'hard'
})

// Result: "ionq" (highest fidelity: 98.92%)
```

### Choose Cheapest Provider

```javascript
await mcpTool('decide/cheapest', {
  qubits: 4,
  complexity: 'medium'
})

// Result: "google-cirq" (50% relative cost)
```

## Advanced: Custom Criteria

```javascript
// Optimize for fidelity, require minimum availability
await mcpTool('decide/custom', {
  qubits: 20,
  depth: 100,
  complexity: 'expert',
  optimize: 'fidelity',
  minFidelity: 0.95,
  minAvailability: 0.98,
  maxCost: 1.5
})
```

## Recommendations by Operation Type

### Research (Prioritize Accuracy)

```javascript
await mcpTool('decide/recommend', {
  operationType: 'research',
  qubits: 15,
  complexity: 'expert'
})

// Automatically optimizes for: fidelity > speed
// Requires: fidelity >= 95%
```

### Production (Balanced with Guarantees)

```javascript
await mcpTool('decide/recommend', {
  operationType: 'production',
  qubits: 10,
  complexity: 'hard'
})

// Automatically optimizes for: balanced
// Requires: fidelity >= 90%, availability >= 99%
```

### Exploration (Minimize Cost)

```javascript
await mcpTool('decide/recommend', {
  operationType: 'exploration',
  qubits: 5,
  complexity: 'medium'
})

// Automatically optimizes for: cost
// No strict requirements (all providers eligible)
```

## Provider Ranking

### By Fidelity

```javascript
await mcpTool('decide/rank-providers', {
  metric: 'fidelity'
})

// Result:
// 1. google-cirq: 0.9912
// 2. ionq: 0.9892
// 3. ibm-quantum: 0.9834
// 4. aws-braket: 0.9756
// 5. rigetti: 0.9645
```

### By Speed

```javascript
await mcpTool('decide/rank-providers', {
  metric: 'speed'
})

// Result (ops/sec):
// 1. google-cirq: 0.95
// 2. rigetti: 0.90
// 3. ibm-quantum: 0.80
// 4. aws-braket: 0.70
// 5. ionq: 0.60
```

### By Cost

```javascript
await mcpTool('decide/rank-providers', {
  metric: 'cost'
})

// Result (relative cost):
// 1. google-cirq: 0.50
// 2. rigetti: 0.90
// 3. ibm-quantum: 1.00
// 4. aws-braket: 1.20
// 5. ionq: 1.50
```

## Machine Learning: Learn from Results

The engine improves over time by learning from execution results:

```javascript
// Run circuit on selected provider
const result = await executeCircuit(circuit, provider)

// Tell the engine how it went
await mcpTool('decide/learn-result', {
  provider: 'ibm-quantum',
  success: true,
  fidelity: 0.9834,
  responseTime: 2150
})

// Engine updates internal metrics:
// - Success rate (99.5% → 99.52%)
// - Fidelity (98.34% → 98.35%)
// - Availability (99% → 99.1%)
```

## Decision Criteria

### Optimization Options

| Option | Description | Best For |
|--------|-------------|----------|
| `fidelity` | Maximize measurement accuracy | Precise results, research |
| `speed` | Minimize execution time | Real-time applications |
| `cost` | Minimize financial cost | Budget-conscious ops |
| `availability` | Maximize uptime | Production reliability |
| `balanced` | Weighted combination | Most use cases |

### Constraints

- `maxCost` — Don't exceed cost threshold
- `minFidelity` — Require minimum accuracy
- `minAvailability` — Require minimum uptime
- `requireQubits` — Need specific qubit count
- `maxLatency` — Maximum response time (ms)

## Provider Metrics

| Provider | Fidelity | Speed | Cost | Availability | Qubits | Error |
|----------|----------|-------|------|--------------|--------|-------|
| IBM Quantum | 98.34% | 80% | 1.0x | 99.0% | 127 | 0.1% |
| AWS Braket | 97.56% | 70% | 1.2x | 98.0% | 30 | 0.15% |
| IonQ | 98.92% | 60% | 1.5x | 97.0% | 11 | 0.2% |
| Rigetti | 96.45% | 90% | 0.9x | 96.0% | 30 | 0.3% |
| Google Cirq | 99.12% | 95% | 0.5x | 99.0% | 53 | 0.05% |

## Use Cases

### 1. Automated Provider Selection

```javascript
// Let the engine decide for you
const decision = await mcpTool('decide/custom', {
  qubits: circuit.qubits,
  depth: circuit.depth,
  complexity: circuit.complexity,
  optimize: 'balanced'
})

// Execute on chosen provider
await executeOn(decision.provider, circuit)
```

### 2. Circuit-Aware Selection

```javascript
// Different providers for different circuits
if (circuit.qubits > 50) {
  // Need IBM's 127-qubit processor
  provider = 'ibm-quantum'
} else if (circuit.depth > 500) {
  // Need Google's low error rates
  provider = 'google-cirq'
} else {
  // Let engine decide for small circuits
  const decision = await mcpTool('decide/optimal-provider', {
    qubits: circuit.qubits,
    complexity: circuit.complexity
  })
  provider = decision
}
```

### 3. Cost-Conscious Execution

```javascript
// Find cheapest provider that meets requirements
await mcpTool('decide/custom', {
  qubits: 10,
  complexity: 'medium',
  optimize: 'cost',
  minFidelity: 0.90 // Still need 90% accuracy
})
```

### 4. Production Rollout

```javascript
// Get recommendation for production use
const decision = await mcpTool('decide/recommend', {
  operationType: 'production',
  qubits: circuit.qubits,
  complexity: circuit.complexity,
  budget: 5000 // $5000 budget
})

// Automatically ensures:
// - Fidelity >= 90%
// - Availability >= 99%
// - Within budget
```

## API Reference

### Tools

#### `decide/optimal-provider`
Returns provider with best balanced score.
- Input: `qubits`, `complexity` (required)
- Output: Provider name

#### `decide/fastest`
Returns fastest provider.
- Input: `qubits`, `complexity`
- Output: Provider name

#### `decide/most-accurate`
Returns highest-fidelity provider.
- Input: `qubits`, `complexity`
- Output: Provider name

#### `decide/cheapest`
Returns lowest-cost provider.
- Input: `qubits`, `complexity`
- Output: Provider name

#### `decide/custom`
Returns provider matching custom criteria.
- Input: `qubits`, `complexity`, `optimize`, optional constraints
- Output: Decision with score, reason, alternatives

#### `decide/recommend`
Returns recommendation by operation type.
- Input: `operationType`, `qubits`, `complexity`, optional `budget`
- Output: Decision tailored to operation type

#### `decide/rank-providers`
Returns all providers ranked by metric.
- Input: `metric` (fidelity|speed|cost|availability|...)
- Output: Ranked list

#### `decide/compare-providers`
Returns detailed comparison table.
- Input: (none)
- Output: Comparison of all metrics

#### `decide/learn-result`
Updates metrics with execution result.
- Input: `provider`, `success`, `fidelity`, `responseTime`
- Output: Confirmation

## Advanced: Decision Scoring

The engine uses this scoring formula:

```
score = fidelity * 40 + speed * 25 + (1 - cost/2) * 20 + availability * 15
```

Adjusted by:
- Circuit complexity (expert circuits get higher weight)
- Freshness bonus (recently used providers get +5)
- Success rate multiplier (multiply by historical success rate)

This creates intelligent, adaptive provider selection.

## Next Steps

- [Quantum Testing Guide](/testing/benchmarks.md) — Run tests with chosen provider
- [Quick Reference](/reference/quick-start.md) — Other MCP tools
- [System Architecture](/architecture) — How decision engine fits in

---

**Intelligent provider selection automatically adapts to your needs.**
