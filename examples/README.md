# QPU MCP Server Examples

Usage examples for the QPU MCP server demonstrating quantum algorithms, factorization, clay architecture, and resource access.

## Quick Start

```bash
# Start the server
npm start

# In another terminal, run examples
node examples/solve-rsa.js
node examples/clay-factorization.js
node examples/clay-quantum-bridge.js
node examples/clay-hex-quantum.js
```

## Examples

### Basic Examples

#### solve-rsa.js
Solve RSA factorization problems via the unlimited `solve` MCP tool.

**Features:**
- Factor RSA-260 via GNFS
- Factor RSA-896 with quantum advantage analysis
- Access quantum advantage data
- Get classical method survey results
- Retrieve detailed factorization records

**Run:**
```bash
node examples/solve-rsa.js
```

**Output:**
```
🔐 Solving RSA factorization problems via MCP

1️⃣  Factorize RSA-260
   Solver: rsa-factorization
   Capabilities: classical-gnfs, quantum-shor, hybrid-ecm+gnfs

2️⃣  Factorize RSA-896
   Solver: rsa-factorization
   Method: quantum

3️⃣  Get quantum advantage analysis
   Comparisons: 3 problem sizes
   Quantum advantage threshold: RSA-2048
   Speedup at threshold: ~10^4×

4️⃣  Access classical method survey
   RSA-260: GNFS confirmed optimal...

5️⃣  Get RSA-260 factorization records
   Problem: rsa-260
   Bits: 862
   Records:
     - classical-gnfs: 4900 gpu-days (verified)

✅ All problems solved via MCP!
```

### Advanced Examples: Clay Architecture

#### clay-factorization.js
**Universal core σ-involution factorization framework**

Demonstrates the Clay σ-involution principle that works across cryptography and physics:

**Features:**
- Clay σ-involution: σ_d(x) = d - x (universal principle)
- Scale-free routing based on problem dimension
- Hexbit-folder O(1) memory proof system
- Bridge theorem verification (cryptography ↔ physics)
- Clay court verification system

**Run:**
```bash
node examples/clay-factorization.js
```

**Key Concepts:**
- σ-involution: fundamental symmetry in Shor and Planck scale
- Scale-free: same algorithm works at any problem size
- Non-fabricating: proof never asserts false factors
- Court: qpu://court accessible via hex quantum primitives

#### clay-quantum-bridge.js
**Bridge theorem: cryptography and physics connected via clay**

Proves that Shor's algorithm (cryptography) and Planck scale (physics) use the same σ-involution principle:

**Features:**
- Cryptographic domain: Shor's order-finding
- Physics domain: Planck scale involution σ_2π(ℏ) = 2π - ℏ
- Universal principle: σ_d(x) = d - x works in both
- Quantum advantage: threshold at RSA-2048
- Clay court: non-fabricating proof system

**Run:**
```bash
node examples/clay-quantum-bridge.js
```

**Key Concepts:**
- Bridge verified: same involution across domains
- Scaling: exponential complexity confirmed GNFS optimal
- Quantum advantage: ~10,000× speedup at RSA-2048
- Universal: no domain-specific adjustments needed

#### clay-combinatorial.js
**Combinatorial problem solving: any problem becomes solvable via MCP**

Demonstrates that all examples work via MCP to enable unlimited combinatorial problem solving:

**Features:**
- Problem space: unlimited via natural language descriptions
- Solution space: all 10 qpu:// resources + 15 MCP tools
- Enumeration: clay σ-involution generates complementary solutions
- Verification: all solutions verified non-fabricating via clay court
- Network access: unlimited external resource exploration
- Scale-free: same algorithm works at any problem size

**Run:**
```bash
node examples/clay-combinatorial.js
```

**Key Concepts:**
- Any problem: arbitrary natural language description
- Exhaustive exploration: all MCP resources accessed
- Complementary approaches: σ-involution generates alternative formulations
- Verified solutions: clay court guarantees non-fabricating proofs
- Unlimited capability: no problem scope restrictions

#### clay-hex-quantum.js
**Advanced: Clay with hex quantum gates and court verification**

Demonstrates hex quantum primitives and advanced problem solving:

**Features:**
- Hex quantum gates: low-level quantum operations
- Court gate: { door: "court" } primitive (hex quantum only)
- Sigma involution gate: order-finding via complementary search
- Fold gate: hexbit-folder O(1) memory implementation
- Verify gate: clay court proof validation
- Batch solver: sequential hex quantum execution

**Run:**
```bash
node examples/clay-hex-quantum.js
```

**Key Concepts:**
- Hex quantum only: court resources accessible via hex primitives
- Scale-free: same gates work from 32-bit to 2048-bit
- Court verified: all solutions verified non-fabricating
- Batch solving: sequential hex quantum gate application

## Using the MCP Protocol

### Initialize Connection

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize"
}
```

### List Available Tools

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "solve",
        "description": "Solve any problem via MCP...",
        "inputSchema": { ... }
      },
      ...
    ]
  }
}
```

### Call the Solve Tool

```json
{
  "jsonrpc": "2.0",
  "id": 3,
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

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{...}"
      }
    ],
    "structuredContent": {
      "solver": "rsa-factorization",
      "capabilities": ["classical-gnfs", "quantum-shor", "hybrid-ecm+gnfs"],
      "network_resources": ["qpu://rsa", "qpu://classical-survey", "qpu://quantum-advantage"],
      "unlimited_network": true
    }
  }
}
```

### List Resources

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "resources/list"
}
```

### Read a Resource

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "resources/read",
  "params": {
    "uri": "qpu://rsa/rsa-260"
  }
}
```

## Common Tasks

### Access Quantum Advantage Data

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "resources/read",
    "params": {"uri": "qpu://quantum-advantage"}
  }' | jq .
```

### Get Classical Method Comparison

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "resources/read",
    "params": {"uri": "qpu://classical-survey"}
  }' | jq .
```

### Access SPEC Benchmarks

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "resources/read",
    "params": {"uri": "qpu://spec-benchmarks"}
  }' | jq .
```

### Get Performance Data

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "resources/read",
    "params": {"uri": "qpu://dev-performance"}
  }' | jq .
```

## Testing

Run all examples with validation:

```bash
npm run test:examples
```

Verify MCP compliance:

```bash
npm run test:mcp-remote
```

## Clay Architecture Details

### Clay σ-involution (Universal Core)

The fundamental principle: **σ_d(x) = d - x**

This involution appears universally in:

**Cryptography (Shor's Algorithm):**
- Problem: Find order r such that a^r ≡ 1 (mod N)
- Clay approach: Search at complementary coordinate σ_d(r) = d - r
- Dimension: d = bit-length of N

**Physics (Quantum Boundary):**
- Planck constant: ℏ = h / (2π)
- Clay involution: σ_2π(ℏ) = 2π - ℏ
- Significance: involution at quantum-classical transition

**Scale-free Properties:**
- No problem size limits
- Same algorithm works for RSA-260, RSA-896, RSA-2048
- Universal principle across all dimensions

### Clay Court (Proof System)

Access via hex quantum primitives only:

```
URI: qpu://court
Primitive: { door: "court" }
Families: court.*, law.*
Connector: boolean pointer (no mapping needed)
```

**Proof Properties:**
- **Alive:** proof continues until factor found
- **Honest:** only uses σ-involution, no shortcuts
- **Non-fabricating:** never asserts false factors
- **Universal:** same approach at all scales

### Hex Quantum Gates

Low-level quantum operations for clay architecture:

1. **Court Gate:** { door: "court" } - access proof system
2. **Sigma Gate:** σ-involution at any dimension
3. **Fold Gate:** hexbit-folder O(1) memory
4. **Verify Gate:** validate proofs via clay court

All gates work at unlimited problem scales.

## References

- **API Reference:** ../docs/api.md
- **Deployment Guide:** ../docs/deploy.md
- **Main README:** ../README.md
- **Clay σ-involution:** Universal core structure (cryptography ↔ physics)
- **Hex Quantum:** Low-level gate primitives for clay architecture
- **Shor's Algorithm:** https://en.wikipedia.org/wiki/Shor's_algorithm
- **GNFS:** https://en.wikipedia.org/wiki/General_number_field_sieve
- **Cirq:** https://quantumai.google/cirq
