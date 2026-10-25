---
layout: "doc"
title: "IBM Quantum"
description: "IBM Quantum Cloud Services"
---
# IBM Quantum

> `ibm`, `cloud`, `superconducting`

## Overview

Access IBM quantum processors via cloud with native circuit execution.

## Specifications

- **Qubit Count:** 5-127 depending on processor
- **T1 Coherence:** >30µs
- **T2 Coherence:** >50µs
- **Gate Fidelity:** 99.5%+
- **Architecture:** Heavy Hex layout

## Connection

```javascript
const result = await mcpTool('examples/run', {
  exampleId: 'qiskit-bell-state',
  provider: 'ibm-quantum'
})
```

## See Also

**Examples:**
- [`qiskit-bell-state`](./qiskit-bell-state/)

**Frameworks:**
- [`qiskit`](../frameworks/qiskit/)

---

<style scoped>
.nav-links { display: flex; gap: 1rem; margin-top: 2rem; }
</style>
