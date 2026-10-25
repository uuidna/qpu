---
layout: "doc"
title: "Qiskit"
description: "IBM Quantum framework for quantum circuits"
---
# Qiskit

> `ibm`, `python`, `open-source`

## Overview

Build and execute quantum circuits using Qiskit framework.

## Integration

Run Qiskit circuits via QPU:
```javascript
const result = await mcpTool('framework/compute', {
  framework: 'qiskit',
  circuitJson: '...',
  provider: 'auto'
})
```

## Capabilities

- Full circuit building API
- 20+ quantum gate types
- Automatic circuit optimization
- Multiple provider backend support

## See Also

**Examples:**
- [`qiskit-bell-state`](./qiskit-bell-state/)

**Providers:**
- [`ibm-quantum`](../providers/ibm-quantum/)

---

<style scoped>
.nav-links { display: flex; gap: 1rem; margin-top: 2rem; }
</style>
