# Reference

Technical reference for QPU components, processors, and quantum algorithms.

## Quantum Framework Integration

### Framework Guides
- [Framework Comparison](./framework-comparison.md) — QPU vs TensorFlow Quantum, Cirq, Qiskit
- [Quantum Library Integration](./quantumlib-integration.md) — Using QPU with existing quantum ecosystems

## Quantum Components

### Processors
- [Processor Specs](./processor.md) — Willow, Sycamore, and reference processors

### Quantum Computing
- [Cirq Integration](./cirq.md) — Circuit building and simulation
- [Algorithms](./algorithms.md) — Quantum algorithms library
- [Error Correction](./echo.md) — Quantum Echo and error correction

## MCP Tools

### Tool Specifications
- [MCP Reference](./mcp.md) — JSON-RPC tool specifications
- [Playground](./playground.md) — Interactive testing environment

## Examples

See real implementations in [examples/](https://github.com/anthropics/claude-code-qpu/tree/main/examples):
- `solve-rsa.js` — RSA factorization via MCP
- `clay-factorization.js` — σ-involution framework
- `clay-quantum-bridge.js` — Cryptography-physics bridge
- `clay-hex-quantum.js` — Hex quantum gates
- `clay-combinatorial.js` — Unlimited problem solving

---

## Full Documentation

- **[Quick Start](/guide/quick-start)** — 5-minute setup
- **[Concepts](/concepts/)** — System capacity and clay architecture
- **[API Reference](/api/)** — MCP tools and resources
- **[Architecture](/architecture/)** — Protocol design and implementation
- **[Deployment](/deploy/)** — Production deployment guides

---

## Framework Guide

**Integrating QPU with existing frameworks?**
- Start with [Framework Comparison](/reference/framework-comparison)
- Then read [quantumlib Integration](/reference/quantumlib-integration)
- See examples for your use case

