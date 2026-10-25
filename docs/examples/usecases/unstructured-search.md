---
title: "Unstructured Database Search (Grover)"
description: "Search unsorted databases 100× faster than classical algorithms"
tags: ["search", "algorithm", "amplitude-amplification", "speedup"]
difficulty: "advanced"
timeEstimate: "3-4 hours"
industry: "Database Systems"
examples: ["pyquil-grover"]
frameworks: ["pyquil", "qiskit"]
providers: ["rigetti", "ibm-quantum"]
---
# Unstructured Database Search (Grover)

## Overview

**Industry:** Database Systems | **Difficulty:** advanced | **Time:** 3-4 hours

Search unsorted databases 100× faster than classical algorithms

## The Problem

Search N items: classical O(N), quantum O(√N)

## Quantum Advantage

Amplitude amplification: mark solutions, interfere to amplify probability.

## Expected Outcome

Find marked element with >80% probability in √N iterations

## Examples

- [`pyquil-grover`](/examples/examples/pyquil-grover/)

## Frameworks

- [`pyquil`](/examples/frameworks/pyquil/)
- [`qiskit`](/examples/frameworks/qiskit/)

## Providers

- [`rigetti`](/examples/providers/rigetti/)
- [`ibm-quantum`](/examples/providers/ibm-quantum/)

## Resources Required

- 3-4 qubit device
- Controlled-Z gates
- High fidelity

## Toolset

This use case is fully executable via MCP toolset:

```bash
# Mark solution state in oracle
qpu examples run pyquil-grover --shots 1000

# Measure amplitude amplification factor
qpu examples native-proof pyquil-grover

# Analyze speedup as problem scales
qpu examples run pyquil-grover --analysis-scale

```

## Quick Start

### 1. Prepare

```javascript
const example = await mcpTool('examples/get', {
  exampleId: 'pyquil-grover'
})
```

### 2. Run

```javascript
const result = await mcpTool('examples/run', {
  exampleId: 'pyquil-grover',
  provider: 'rigetti'
})
```

### 3. Validate

```javascript
const proof = await mcpTool('examples/native-proof', {
  exampleId: 'pyquil-grover'
})
```

## Success Criteria

- [ ] Example runs without error
- [ ] Fidelity > 90%
- [ ] Native computation proven
- [ ] Results match expected behavior

## Related Use Cases

- See [Domain: search](/examples/domains/search/)
- See [Industry: Database Systems](/examples/industries/database systems/)

## Learn More

- [Examples at Scale](/guides/examples-at-scale.md)
- [Framework Guide](/guides/framework-integration.md)
- [Native Validation](/guides/native-validation.md)
