# Solve Tool

Unlimited problem-solving via MCP with network capabilities.

## Overview

The `solve` tool enables solving any problem through the QPU system:

- **Problem Description**: Natural language problem statement
- **Network Access**: Unlimited network for fetching data
- **Routing**: Automatically routes to optimal solver (classical, quantum, combinatorial)
- **Unlimited Capability**: No computational limits

## Parameters

```typescript
{
  // Natural language problem description
  problem: string
  
  // Optional: specify solution method
  method?: "classical" | "quantum" | "hybrid" | "combinatorial"
  
  // Optional: enable network access (default: true)
  network?: boolean
}
```

## Response

```typescript
{
  solver: string           // Which solver was used
  method: string          // Solution method
  capabilities: string[]  // What this problem enables
  unlimited_network: boolean
  result?: any           // Solution if available
}
```

## Examples

### Example 1: RSA Factorization

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "solve",
    "arguments": {
      "problem": "factorize rsa-260",
      "network": true
    }
  }
}
```

**Response**: Solver routes to classical GNFS or quantum Shor depending on scale.

### Example 2: Quantum Simulation

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "solve",
    "arguments": {
      "problem": "simulate quantum gates for molecular hydrogen",
      "method": "quantum"
    }
  }
}
```

### Example 3: Combinatorial Problem

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "solve",
    "arguments": {
      "problem": "optimize delivery routes for 50 cities with time windows",
      "method": "combinatorial"
    }
  }
}
```

## Interactive Widget

Try the solve tool directly:

<solve-widget />

## Routing Algorithm

The solve tool automatically selects the best approach:

| Problem Type | Method | Scale |
|--------------|--------|-------|
| Integer factorization | Classical GNFS | <300 bits |
| Integer factorization | Quantum Shor | >2048 bits |
| Quantum simulation | Cirq + Simulator | <20 qubits |
| Optimization | QAOA | Small/medium |
| Combinatorial | Exhaustive + MCP | Any size |

## Network Capabilities

With `network: true`:
- ✅ Access to 10 MCP resources (qpu://*)
- ✅ Unlimited external API calls
- ✅ Fetch datasets and examples
- ✅ Stream results asynchronously
- ✅ No computational limits

## Verification

Solutions are verified through:
- **Algebraic**: Mathematical proof
- **Cryptographic**: Factorization verification
- **Theorem-based**: Proof of correctness
- **Court-verified**: Non-fabricating proofs via clay

## Clay Architecture

Uses clay σ-involution for scale-free solutions:
- Universal principle: σ_d(x) = d - x
- Works at any problem dimension
- Hexbit-folder O(1) memory proofs
- Non-fabricating court verification

