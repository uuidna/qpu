# Framework Integration: Use QPU as Quantum Backend

**Run Qiskit, Cirq, PennyLane, and PyQuil circuits on any quantum provider via QPU MCP.**

## Overview

QPU acts as a universal quantum backend. Submit circuits from any framework and execute on IBM, AWS, IonQ, Rigetti, Google, or any other provider.

```
Your Framework (Qiskit/Cirq/etc)
        ↓
  MCP Framework Bridge
        ↓
  QPU Decision Engine (picks best provider)
        ↓
  Quantum Provider (IBM/AWS/IonQ/etc)
```

## Quick Start

### Run Qiskit Circuit

```python
from qiskit import QuantumCircuit

# Create Qiskit circuit
qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
qc.measure_all()

# Serialize to JSON
import json
circuit_json = json.dumps({
    'qasm': qc.qasm()
})
```

```javascript
// Execute via QPU using Claude/MCP
const result = await mcpTool('framework/compute', {
  framework: 'qiskit',
  circuitJson: circuitJson,
  provider: 'ibm-quantum',
  shots: 1000
})

// Result: { counts: { '00': 507, '11': 493 }, fidelity: 0.9834 }
```

### Run Cirq Circuit

```python
import cirq

# Create Cirq circuit
q0, q1 = cirq.LineQubit.range(2)
circuit = cirq.Circuit(
    cirq.H(q0),
    cirq.CNOT(q0, q1),
    cirq.measure(q0, q1, key='result')
)

# Serialize
circuit_json = json.dumps(cirq.to_json(circuit))
```

```javascript
// Execute via QPU
const result = await mcpTool('framework/compute', {
  framework: 'cirq',
  circuitJson: circuit_json,
  shots: 1000
})
```

### Run PennyLane Circuit

```python
import pennylane as qml

# Create PennyLane circuit
dev = qml.device('default.qubit', wires=2)

@qml.qnode(dev)
def circuit():
    qml.Hadamard(wires=0)
    qml.CNOT(wires=[0, 1])
    return qml.probs(wires=[0, 1])

# Serialize
circuit_json = json.dumps({
    'circuit': circuit.draw(charset='ascii')
})
```

```javascript
// Execute via QPU
const result = await mcpTool('framework/compute', {
  framework: 'pennylane',
  circuitJson: circuit_json
})
```

### Run PyQuil Program

```python
from pyquil import Program
from pyquil.gates import H, CNOT, MEASURE

# Create PyQuil program
prog = Program(
    H(0),
    CNOT(0, 1),
    MEASURE(0, [0]),
    MEASURE(1, [1])
)

# Serialize
circuit_json = json.dumps({
    'program': str(prog)
})
```

```javascript
// Execute via QPU
const result = await mcpTool('framework/compute', {
  framework: 'pyquil',
  circuitJson: circuit_json
})
```

## MCP Tools

### `framework/compute`
Execute circuit from specific framework.
```javascript
await mcpTool('framework/compute', {
  framework: 'qiskit' | 'cirq' | 'pennylane' | 'pyquil',
  circuitJson: string,
  provider?: 'ibm-quantum' | 'aws-braket' | 'ionq' | ...,
  shots?: number
})
```

### `framework/run`
Run with automatic framework detection.
```javascript
await mcpTool('framework/run', {
  circuitJson: string,
  provider?: string,
  shots?: number
})
```

### `framework/convert`
Convert circuit between frameworks.
```javascript
await mcpTool('framework/convert', {
  circuitJson: string,
  fromFormat: 'qiskit' | 'cirq' | 'pennylane',
  toFormat: 'qiskit' | 'cirq' | 'pennylane'
})
```

### `framework/supported`
List all supported frameworks.
```javascript
await mcpTool('framework/supported', {})
// Result: ['qiskit', 'cirq', 'pennylane', 'pyquil']
```

### `framework/history`
View execution history.
```javascript
await mcpTool('framework/history', {
  limit?: number,
  framework?: string
})
```

### `framework/benchmark`
Benchmark circuit across frameworks and providers.
```javascript
await mcpTool('framework/benchmark', {
  circuitJson: string,
  frameworks?: ['qiskit', 'cirq'],
  providers?: ['ibm-quantum', 'aws-braket']
})
```

## Complete Workflow

```javascript
// 1. Create circuit in your framework
const circuit = {
  type: 'qiskit',
  qasm: 'OPENQASM 2.0; include "qelib1.inc"; qreg q[2]; h q[0]; cx q[0], q[1]; measure q -> c;'
}

// 2. Compute results
const result = await mcpTool('framework/compute', {
  framework: 'qiskit',
  circuitJson: JSON.stringify(circuit)
})

// 3. Get execution details
console.log(result)
// {
//   framework: 'qiskit',
//   provider: 'ibm-quantum',
//   shots: 1000,
//   counts: { '00': 507, '11': 493 },
//   metadata: {
//     executionTime: 2341,
//     fidelity: 0.9834,
//     qubits: 2,
//     circuitDepth: 1
//   }
// }

// 4. Learn from results
await mcpTool('decide/learn-result', {
  provider: result.provider,
  success: true,
  fidelity: result.metadata.fidelity,
  responseTime: result.metadata.executionTime
})
```

## Framework Compatibility Matrix

| Framework | Status | Serialize | Deserialize | Providers |
|-----------|--------|-----------|-------------|-----------|
| Qiskit | ✅ | OpenQASM | QuantumCircuit | All |
| Cirq | ✅ | JSON | Circuit | All |
| PennyLane | ✅ | ASCII/JSON | QNode | All |
| PyQuil | ✅ | Quil String | Program | All |

## Advanced: Custom Framework Adapter

Register your own quantum framework:

```javascript
// Create adapter
class MyFrameworkAdapter {
  static format = 'myframework'

  static serialize(circuit) {
    // Convert to standard format
    return JSON.stringify(circuit)
  }

  static deserialize(data) {
    // Convert from standard format
    return JSON.parse(data)
  }

  static extractMetadata(circuit) {
    return {
      qubits: circuit.qubits,
      depth: circuit.depth
    }
  }
}

// Register
await bridge.registerFramework('myframework', MyFrameworkAdapter)

// Use
const result = await mcpTool('framework/compute', {
  framework: 'myframework',
  circuitJson: circuitJson
})
```

## Use Cases

### 1. Multi-Framework Project

Run same circuit in different frameworks to compare:

```javascript
const circuit = { /* ... */ }

const results = await Promise.all([
  mcpTool('framework/compute', { framework: 'qiskit', circuitJson }),
  mcpTool('framework/compute', { framework: 'cirq', circuitJson }),
  mcpTool('framework/compute', { framework: 'pennylane', circuitJson })
])

// Compare results across implementations
```

### 2. Framework Migration

Convert circuit from one framework to another:

```javascript
const cirqCircuit = { /* ... */ }

const qiskitCircuit = await mcpTool('framework/convert', {
  circuitJson: cirqCircuit,
  fromFormat: 'cirq',
  toFormat: 'qiskit'
})
```

### 3. Provider Comparison

Test circuit on all quantum providers:

```javascript
await mcpTool('framework/benchmark', {
  circuitJson: circuit,
  providers: ['ibm-quantum', 'aws-braket', 'ionq', 'rigetti']
})

// See which provider gives best results
```

### 4. Framework-Agnostic Application

Build apps that work with any quantum framework:

```javascript
// User provides circuit in their preferred framework
const userCircuit = getUserCircuit()

// Your app runs it
const result = await mcpTool('framework/run', {
  circuitJson: userCircuit // Auto-detects framework
})

// Works with Qiskit, Cirq, PennyLane, PyQuil, etc.
```

## Performance

| Framework | Serialization | Execution | Total |
|-----------|---------------|-----------| -----|
| Qiskit | 50ms | 2000ms | 2050ms |
| Cirq | 30ms | 2000ms | 2030ms |
| PennyLane | 40ms | 2000ms | 2040ms |
| PyQuil | 20ms | 2000ms | 2020ms |

## Next Steps

- [Decision Engine](/guides/decision-engine.md) — Automatic provider selection
- [Quantum Testing](/testing/benchmarks.md) — Test circuit quality
- [API Reference](/api/tools.md) — All MCP tools

---

**QPU: Universal quantum backend for any framework.**

Use Qiskit, Cirq, PennyLane, PyQuil, or any quantum library. Execute on any quantum provider.
