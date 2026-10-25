# Cirq GHZ State

**Framework:** CIRQ
**Provider:** google-cirq
**Qubits:** 3
**Difficulty:** beginner

## Description

The Cirq GHZ State example demonstrates multi-qubit-entanglement on quantum hardware.

## Related Use Cases

- [Quantum Key Distribution](../usecases/qkd-quantum-key-distribution.md) (entanglement)
- [Distributed Quantum Computing](../usecases/distributed-quantum-computing.md) (entanglement)
- [Quantum Sensing](../usecases/quantum-sensing-gravity.md) (entanglement)
- [Quantum Teleportation](../usecases/quantum-teleportation.md) (entanglement)
- [Function Property Detection](../usecases/function-property-detection.md) (algorithms)
- [Unstructured Search](../usecases/unstructured-search.md) (algorithms)
- [Prime Factorization](../usecases/prime-factorization.md) (algorithms)
- [Phase Estimation](../usecases/phase-estimation.md) (algorithms)
- [Portfolio Optimization](../usecases/portfolio-optimization.md) (optimization)
- [Logistics Routing](../usecases/logistics-routing.md) (optimization)
- [Materials Design](../usecases/materials-design.md) (optimization)
- [Molecular Dynamics](../usecases/molecular-dynamics.md) (simulation)
- [Condensed Matter Physics](../usecases/condensed-matter.md) (simulation)
- [Quantum Classification](../usecases/quantum-classification.md) (ml)
- [Dimensionality Reduction](../usecases/quantum-dimensionality-reduction.md) (ml)
- [Generative Models](../usecases/generative-models.md) (ml)

## Quick Run

```javascript
const result = await mcpTool('examples/run', {
  exampleId: 'cirq-ghz-state',
  provider: 'google-cirq',
  shots: 1000
})
```

## Native Computation Proof

```javascript
const proof = await mcpTool('examples/native-proof', {
  exampleId: 'cirq-ghz-state'
})
```

## Framework Integration

Run with cirq:

```javascript
const result = await mcpTool('framework/compute', {
  framework: 'cirq',
  circuitJson: '...',
  provider: 'google-cirq'
})
```

## See Also

- [Examples Overview](/guides/examples-at-scale.md)
- [Framework Guide](/guides/framework-integration.md)
- [Decision Engine](/guides/decision-engine.md)
