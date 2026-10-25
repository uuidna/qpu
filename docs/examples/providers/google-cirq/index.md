# Google Cirq Provider

## Capabilities

- Qubits: See hardware specs
- Gate fidelity: ~99%+
- Coherence times: Provider-specific
- Native gates: Provider-specific

## Examples on This Provider

```javascript
// Find examples compatible with this provider
const examples = await mcpTool('examples/list', {})
  .filter(ex => ex.provider === 'google-cirq')
```

## Getting Started

```javascript
// Run any example on this provider
const result = await mcpTool('examples/run', {
  exampleId: 'example-id',
  provider: 'google-cirq'
})
```

## Performance Characteristics

See [Examples at Scale](/guides/examples-at-scale.md) for benchmarks.

## Integration

All examples work via MCP:

```javascript
await mcpTool('examples/compare', {
  exampleId: 'qiskit-bell-state',
  providers: ['google-cirq']
})
```
