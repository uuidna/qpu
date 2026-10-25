---
layout: "doc"
title: "Qiskit Bell State"
description: "Two-qubit entanglement"
---
# Qiskit Bell State

**Difficulty:** beginner

> `qiskit`, `entanglement`, `ibm`

## Overview

Bell state entanglement demonstration on IBM Quantum.

## Quick Start

```javascript
const result = await mcpTool('examples/run', {
  exampleId: 'qiskit-bell-state',
  provider: 'ibm-quantum'
})
```

## Validate Native Computation
```javascript
const proof = await mcpTool('examples/native-proof', {
  exampleId: 'qiskit-bell-state'
})
```

## Metrics

- **Qubits:** 2
- **Depth:** 2
- **Expected Fidelity:** >98%
- **T2 Coherence:** 25µs

## See Also

**Use Cases:**
- [`qkd-quantum-key-distribution`](../usecases/qkd-quantum-key-distribution/)

## Executable Toolset

This example is fully executable via MCP:

```bash
# Prepare Bell state
qpu examples run qiskit-bell-state

# Validate native computation
qpu examples native-proof qiskit-bell-state

```

---

<style scoped>
.nav-links { display: flex; gap: 1rem; margin-top: 2rem; }
</style>
