# PENNYLANE Framework

## Supported Examples

- [PennyLane Deutsch-Jozsa](../examples/pennylane-deutsch-jozsa.md)

## Key Use Cases

- [Quantum Key Distribution](../usecases/qkd-quantum-key-distribution.md)
- [Distributed Quantum Computing](../usecases/distributed-quantum-computing.md)
- [Quantum Sensing](../usecases/quantum-sensing-gravity.md)
- [Quantum Teleportation](../usecases/quantum-teleportation.md)

## Integration

Run pennylane circuits via QPU:

```javascript
const result = await mcpTool('framework/compute', {
  framework: 'pennylane',
  circuitJson: '...',
  provider: 'auto'  // Or specify: ibm-quantum, google-cirq, ionq, rigetti
})
```

## Performance

```
Framework:    pennylane
Serialization: ~30-50ms
Execution:     ~2000ms
Total:         ~2030-2050ms
```

## Advanced Features

- Circuit conversion between frameworks
- Benchmark across providers
- Automatic framework detection
- Execution history tracking

## Learn More

- [Framework Integration Guide](/guides/framework-integration.md)
- [Examples at Scale](/guides/examples-at-scale.md)
