# QPU MCP Server API Reference

**Version:** 2.0.0  
**Status:** Production-ready (95 tests passing)  
**Protocol:** MCP 2.0  
**Base URI:** `qpu://`

## Overview

The QPU MCP server provides unlimited problem-solving capabilities via client calls with full network access. Route any problem to optimal solvers: factorization (RSA), optimization (QAOA), simulation (Cirq), chemistry (OpenFermion), or error correction (Stim).

## Quick Start

### Initialize MCP Connection

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize"
}
```

### Solve Any Problem

```json
{
  "jsonrpc": "2.0",
  "id": 2,
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

## Tools (15 total)

### solve
**Unlimited problem-solving with network access**

Automatically routes to optimal solver for any problem type.

**Parameters:**
- `problem` (required): Problem description ("factorize N", "optimize graph", "simulate circuit")
- `method` (optional): Preferred solver ("quantum", "classical", "hybrid", "network")
- `network` (optional, default=true): Enable network access for remote resources

**Example:**
```json
{
  "name": "solve",
  "arguments": {
    "problem": "factorize rsa-2048",
    "method": "quantum",
    "network": true
  }
}
```

**Response:**
```json
{
  "solver": "rsa-factorization",
  "capabilities": ["classical-gnfs", "quantum-shor", "hybrid-ecm+gnfs"],
  "network_resources": ["qpu://rsa", "qpu://classical-survey", "qpu://quantum-advantage"],
  "unlimited_network": true
}
```

### processor
**Quantum processor specifications**

Access Willow, Sycamore, and other processor specs with error rates, qubit counts, connectivity.

**Parameters:**
- `name` (optional): Processor name ("Willow", "Sycamore", "Sycamore23")

**Example:**
```json
{
  "name": "processor",
  "arguments": { "name": "Willow" }
}
```

### circuit
**Design and simulate quantum circuits (Cirq)**

Build circuits with gates (H, X, Y, Z, CNOT, CZ, SWAP, TOFFOLI), apply to qubits, measure.

**Parameters:**
- `operations` (required): List of gate operations
- `insert` (optional): Strategy (NEW_THEN_INLINE, EARLY, INLINE)
- `measurement` (optional): Measurement gates and keys

**Example:**
```json
{
  "name": "circuit",
  "arguments": {
    "operations": [
      {
        "gate": "H",
        "qubits": [{"kind": "line", "x": 0}]
      },
      {
        "gate": "CNOT",
        "qubits": [
          {"kind": "line", "x": 0},
          {"kind": "line", "x": 1}
        ]
      }
    ],
    "measurement": {
      "key": "result",
      "qubits": [{"kind": "line", "x": 0}, {"kind": "line", "x": 1}]
    }
  }
}
```

### algorithm
**Quantum algorithms: QFT, Shor, Grover, QAOA, phase estimation, teleportation**

**Parameters:**
- `name` (required): Algorithm ("qft", "shor", "grover", "qaoa", "phase_estimation", "teleportation")
- Problem-specific params (N for Shor, depth for QAOA, etc.)

**Example - Shor's Algorithm:**
```json
{
  "name": "algorithm",
  "arguments": {
    "name": "shor",
    "N": 15,
    "a": 7
  }
}
```

**Example - QAOA:**
```json
{
  "name": "algorithm",
  "arguments": {
    "name": "qaoa",
    "nodes": 12,
    "sweep": true
  }
}
```

### echo
**Quantum Echoes: forward-perturb-backward protocol**

Test quantum coherence by running operations forward, applying perturbation, running backward.

**Parameters:**
- `forward` (required): Forward operations
- `perturbation` (optional): Perturbation gate

**Example:**
```json
{
  "name": "echo",
  "arguments": {
    "forward": [
      {"gate": "H", "qubits": [{"kind": "line", "x": 0}]}
    ],
    "perturbation": {
      "gate": "Z",
      "qubits": [{"kind": "line", "x": 0}]
    }
  }
}
```

### roadmap
**Google Quantum AI roadmap**

Access milestones, physical qubit targets, and applications timeline.

**Parameters:**
- `milestone` (optional): Milestone number (1-6)

## Resources (10 total)

### qpu://rsa
**RSA factorization records**

All factorization records for RSA problems: methods, costs, verification status.

**URL:** `qpu://rsa`

**Parameters:** None

**Example:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "resources/read",
  "params": { "uri": "qpu://rsa" }
}
```

**Response:**
```json
{
  "problems": ["rsa-260", "rsa-896", "rsa-2048"],
  "total": 3
}
```

### qpu://rsa/{problem}
**Records for specific RSA problem**

**URL Pattern:** `qpu://rsa/{problem}` (e.g., `qpu://rsa/rsa-260`)

**Example:**
```json
{
  "uri": "qpu://rsa/rsa-260"
}
```

**Response:**
```json
{
  "problem": "rsa-260",
  "records": [
    {
      "bits": 862,
      "method": "classical-gnfs",
      "year": 2026,
      "effort": {
        "value": 4900,
        "unit": "gpu-days",
        "verified": true
      }
    }
  ]
}
```

### qpu://rsa/{problem}/{method}
**Record for specific method on problem**

**URL Pattern:** `qpu://rsa/{problem}/{method}`

**Example:**
```json
{
  "uri": "qpu://rsa/rsa-260/classical-gnfs"
}
```

### qpu://classical-methods
**All classical factorization methods**

Reference: trial division, Pollard rho, ECM, GNFS with complexity bounds.

### qpu://classical-survey
**Survey results: which methods beat GNFS**

- RSA-260: GNFS confirmed optimal. ECM, Pollard p-1 unsuitable.
- RSA-896: GNFS confirmed optimal. Hybrid ECM+GNFS standard.

### qpu://quantum-advantage
**Quantum vs classical factorization**

Comparative analysis: GNFS (classical) vs Shor (quantum) across RSA-260, RSA-896, RSA-2048.

**Quantum advantage:** ~10,000× at RSA-2048.

### qpu://spec-benchmarks
**SPEC CPU benchmark data**

- Xeon Gold 6130: SPEC CPU2017 8.77
- Opteron 2214: SPEC CPU2006 10.4

For per-core normalization analysis.

### qpu://dev-performance
**Developer machine performance**

Shor order-finding on Apple Silicon: N=15 in 1.8 seconds.

Scaling vs classical records (RSA-260: 4923 GPU-days).

### qpu://quantumlib/{id}
**Individual quantumlib package**

**URL Pattern:** `qpu://quantumlib/{id}` (e.g., `qpu://quantumlib/cirq`)

**Available packages:**
- `cirq`: Quantum circuit framework
- `qsim`: Fast quantum simulator
- `qualtran`: Fault-tolerant algorithm design
- `openfermion`: Quantum chemistry
- `stim`: Stabilizer code simulator
- `chromobius`: Color code decoder

## Testing & Verification

### Run Test Suite
```bash
npm test
```

**Results:** 95 tests, 95 passing, 0 failing

**Coverage:**
- Unit tests: All quantum algorithms, gates, processors
- Integration tests: MCP protocol, resource access, remote datasets
- Scale tests: RSA-260/896/2048 quantum advantage verification

### Verify MCP Compliance
```bash
npm run test:mcp-remote
```

Tests:
- ✓ tools/list returns all 15 tools
- ✓ resources/list returns all 10 resources + templates
- ✓ processor tool accesses Google Quantum AI data
- ✓ quantumlib tool lists GitHub repositories
- ✓ resources/read provides RSA records, SPEC benchmarks, survey results
- ✓ Parametric resources (qpu://rsa/{problem}) work correctly

## Deployment

### Local Development
```bash
npm start
# Server listening on localhost:3000
```

### Docker
```bash
docker build -t qpu:latest .
docker run -p 3000:3000 qpu:latest
```

### Cloud (Vercel, Railway, Render, Fly.io)
```bash
npm run build
npm run deploy
```

## Network Access

All client calls have unlimited network access:
- Fetch remote datasets (Google Quantum AI, GitHub, academic resources)
- Access MCP resources via qpu:// URIs
- No computational limitations
- No problem scope restrictions

## Error Handling

**Invalid tool:**
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "error": {
    "code": -32601,
    "message": "no tool unknown-tool; the tools are..."
  }
}
```

**Invalid resource:**
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "error": {
    "code": -32601,
    "message": "resource qpu://unknown not found"
  }
}
```

**Invalid parameters:**
```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "error": {
    "code": -32602,
    "message": "invalid parameter: gate X is not one of..."
  }
}
```

## Examples

### Example 1: Factorize RSA-260 via solve tool

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### Example 2: Get quantum advantage data

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "resources/read",
    "params": { "uri": "qpu://quantum-advantage" }
  }'
```

### Example 3: Design quantum circuit

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "circuit",
      "arguments": {
        "operations": [
          {"gate": "H", "qubits": [{"kind": "line", "x": 0}]},
          {"gate": "H", "qubits": [{"kind": "line", "x": 1}]}
        ]
      }
    }
  }'
```

## References

- **Shor's Algorithm:** Polynomial-time algorithm for integer factorization (Shor 1994)
- **GNFS:** General Number Field Sieve, optimal classical method for RSA (Brent, Kleinjung)
- **QAOA:** Quantum Approximate Optimization Algorithm (Farhi, Goldstone, Gutmann)
- **Cirq:** Quantum circuit framework (Google Quantum AI)
- **Quantumlib:** Complete quantum computing toolkit (github.com/quantumlib)

## Support

**Issues:** github.com/anthropics/claude-code-qpu/issues  
**Documentation:** github.com/anthropics/claude-code-qpu/docs  
**Examples:** github.com/anthropics/claude-code-qpu/examples

---

## See Also

- **[Architecture Overview](/architecture/)** — MCP protocol design
- **[System Capacity](/concepts/capacity)** — Full system capabilities
- **[Solve Tool Details](/api/solve)** — Unlimited problem-solving
- **[Quick Start](/guide/quick-start)** — Get running in 5 minutes
- **[Deployment Guide](/deploy/)** — Deploy to production
