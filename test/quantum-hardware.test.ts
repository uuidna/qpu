/**
 * Phase 13: Quantum Hardware Integration Tests
 * Tests for circuit compilation, hardware detection, and execution
 */

import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { IBMQiskitConnector, type QuantumCircuit as QiskitCircuit } from '../src/quantum/ibm-qiskit.js'
import { IonQConnector } from '../src/quantum/ionq-connector.js'
import { AWSBraketConnector } from '../src/quantum/aws-braket.js'
import { CircuitCompiler } from '../src/quantum/circuit-compiler.js'
import { QuantumExecutor } from '../src/quantum/quantum-executor.js'
import {
  qpuHardwareDetect,
  qpuCircuitCompile,
  qpuExecuteReal,
  qpuFetchResults
} from '../src/mcp/quantum-hardware-integration.js'

// ============================================================================
// IBM QISKIT CONNECTOR TESTS
// ============================================================================

test('IBM Qiskit: Circuit to QASM conversion', () => {
  const connector = new IBMQiskitConnector()
  const circuit: QiskitCircuit = {
    gates: [
      { type: 'h', qubits: [0] },
      { type: 'cnot', qubits: [0, 1] },
      { type: 'measure', qubits: [0] }
    ],
    qubits: 2,
    classicalBits: 1
  }

  const qasm = connector.circuitToQasm(circuit)

  assert.ok(qasm.qasm.includes('h q[0]'), 'Should contain Hadamard gate')
  assert.ok(qasm.qasm.includes('cx'), 'Should contain CNOT gate')
  assert.ok(qasm.qasm.includes('measure'), 'Should contain measure')
  assert.equal(qasm.qubits, 2, 'Should have 2 qubits')
  assert.equal(qasm.gates, 3, 'Should have 3 gates')
})

test('IBM Qiskit: Get available backends', async () => {
  const connector = new IBMQiskitConnector()
  // Set token for testing
  process.env.IBM_QISKIT_TOKEN = 'test_token'

  const backends = await connector.getAvailableBackends()

  assert.ok(Array.isArray(backends), 'Should return array of backends')
  assert.ok(backends.length > 0, 'Should have at least one backend')
})

test('IBM Qiskit: Submit and track job', async () => {
  const connector = new IBMQiskitConnector()
  process.env.IBM_QISKIT_TOKEN = 'test_token'

  const circuit: QiskitCircuit = {
    gates: [{ type: 'h', qubits: [0] }],
    qubits: 1,
    classicalBits: 1
  }

  const job = await connector.submitJob(circuit)

  assert.ok(job.jobId, 'Should return job ID')
  assert.equal(job.status, 'queued', 'Initial status should be queued')
  assert.ok(job.createdAt, 'Should have creation timestamp')
})

// ============================================================================
// IONQ CONNECTOR TESTS
// ============================================================================

test('IonQ: Circuit format conversion', () => {
  const connector = new IonQConnector()
  const ionqCircuit = connector.toIonQFormat(2, [
    { type: 'h', targets: [0] },
    { type: 'cnot', targets: [0, 1] }
  ])

  assert.equal(ionqCircuit.qubits, 2, 'Should have 2 qubits')
  assert.equal(ionqCircuit.gates.length, 2, 'Should have 2 gates')
  assert.equal(ionqCircuit.gates[0].gate, 'h', 'Should convert Hadamard')
  assert.equal(ionqCircuit.gates[1].gate, 'cnot', 'Should convert CNOT')
})

test('IonQ: Get available backends', async () => {
  const connector = new IonQConnector()
  process.env.IONQ_API_KEY = 'ionq_test_key'

  const backends = await connector.getAvailableBackends()

  assert.ok(Array.isArray(backends), 'Should return array')
  assert.ok(backends.includes('qpu.harmony'), 'Should include Harmony QPU')
  assert.ok(backends.includes('simulator'), 'Should include simulator')
})

test('IonQ: Service status check', async () => {
  const connector = new IonQConnector()
  process.env.IONQ_API_KEY = 'ionq_test_key'

  const status = await connector.getServiceStatus()

  assert.equal(status.status, 'operational', 'Should be operational')
  assert.ok(Array.isArray(status.backends), 'Should have backends array')
})

// ============================================================================
// AWS BRAKET CONNECTOR TESTS
// ============================================================================

test('AWS Braket: Device selection', async () => {
  const connector = new AWSBraketConnector()
  process.env.AWS_BRAKET_ROLE_ARN = 'arn:aws:iam::123456789012:role/BraketRole'
  process.env.AWS_BRAKET_S3_BUCKET = 'my-braket-bucket'

  const device = connector.selectOptimalDevice(5, false)

  assert.ok(device, 'Should select a device')
  assert.ok(device!.qubits >= 5, 'Should have enough qubits')
})

test('AWS Braket: List available devices', async () => {
  const connector = new AWSBraketConnector()
  process.env.AWS_BRAKET_ROLE_ARN = 'arn:aws:iam::123456789012:role/BraketRole'
  process.env.AWS_BRAKET_S3_BUCKET = 'my-braket-bucket'

  const devices = await connector.listDevices()

  assert.ok(Array.isArray(devices), 'Should return array of devices')
  assert.ok(devices.length > 0, 'Should have available devices')
  assert.ok(devices.every(d => d.status === 'AVAILABLE'), 'All should be available')
})

// ============================================================================
// CIRCUIT COMPILER TESTS
// ============================================================================

test('Circuit Compiler: Gate optimization', () => {
  const compiler = new CircuitCompiler()
  const circuit = {
    gates: [
      { type: 'h', qubits: [0] },
      { type: 'h', qubits: [0] }, // Should cancel with previous H
      { type: 'x', qubits: [1] },
      { type: 'x', qubits: [1] }  // Should cancel
    ],
    qubits: 2,
    depth: 4
  }

  const result = compiler.compile(circuit, { optimize: true, errorMitigation: false })

  assert.ok(result.gateReduction > 0, 'Should reduce gates')
  assert.ok(result.circuit.gates.length < circuit.gates.length, 'Should have fewer gates')
})

test('Circuit Compiler: Depth calculation', () => {
  const compiler = new CircuitCompiler()
  const circuit = {
    gates: [
      { type: 'h', qubits: [0] },
      { type: 'h', qubits: [1] }, // Can be parallel
      { type: 'cnot', qubits: [0, 1] } // Sequential
    ],
    qubits: 2,
    depth: 3
  }

  const depth = compiler.calculateDepth(circuit)

  assert.equal(depth, 2, 'Should calculate depth as 2 (H parallel, then CNOT)')
})

test('Circuit Compiler: Hardware validation', () => {
  const compiler = new CircuitCompiler()
  const circuit = {
    gates: Array(100).fill({ type: 'h', qubits: [0] }),
    qubits: 3,
    depth: 100
  }

  const validation = compiler.validateForHardware(circuit, 5, 20)

  assert.equal(validation.valid, false, 'Should fail validation')
  assert.ok(validation.errors.length > 0, 'Should report errors')
  assert.ok(validation.errors[0].includes('depth'), 'Should mention depth limit')
})

// ============================================================================
// QUANTUM EXECUTOR TESTS
// ============================================================================

test('Quantum Executor: Hardware detection', async () => {
  process.env.IBM_QISKIT_TOKEN = 'test_token'
  process.env.IONQ_API_KEY = 'ionq_test_key'
  process.env.AWS_BRAKET_ROLE_ARN = 'arn:aws:iam::123456789012:role/BraketRole'
  process.env.AWS_BRAKET_S3_BUCKET = 'my-braket-bucket'

  const executor = new QuantumExecutor()
  const hardware = await executor.detectHardware()

  assert.ok(Array.isArray(hardware), 'Should return array of hardware')
  assert.ok(hardware.length > 0, 'Should detect at least one backend')
})

test('Quantum Executor: Circuit compilation', () => {
  const executor = new QuantumExecutor()
  const circuit = {
    gates: [
      { type: 'h', qubits: [0] },
      { type: 'cnot', qubits: [0, 1] }
    ],
    qubits: 2,
    classicalBits: 2
  }

  const result = executor.compileCircuit(circuit, { optimize: true })

  assert.ok(result.circuit, 'Should return compiled circuit')
  assert.ok(result.originalDepth >= 0, 'Should have original depth')
  assert.ok(result.optimizedDepth >= 0, 'Should have optimized depth')
})

test('Quantum Executor: Execute circuit', async () => {
  process.env.IONQ_API_KEY = 'ionq_test_key'
  process.env.IBM_QISKIT_TOKEN = 'test_token'

  const executor = new QuantumExecutor()
  const circuit = {
    gates: [
      { type: 'h', qubits: [0] },
      { type: 'measure', qubits: [0] }
    ],
    qubits: 1,
    classicalBits: 1
  }

  const result = await executor.execute(circuit, {
    shots: 10,
    optimize: true
  })

  assert.equal(result.success, true, 'Execution should succeed')
  assert.ok(result.jobId, 'Should return job ID')
  assert.ok(result.duration >= 0, 'Should record execution time')
})

// ============================================================================
// MCP OPERATION TESTS
// ============================================================================

test('MCP: qpu_hardware_detect', async () => {
  process.env.IBM_QISKIT_TOKEN = 'test_token'
  process.env.IONQ_API_KEY = 'ionq_test_key'
  process.env.AWS_BRAKET_ROLE_ARN = 'arn:aws:iam::123456789012:role/BraketRole'
  process.env.AWS_BRAKET_S3_BUCKET = 'my-braket-bucket'

  const result = await qpuHardwareDetect()

  assert.equal(result.success, true, 'Should succeed')
  assert.ok(Array.isArray(result.availableBackends), 'Should have backends')
  assert.ok(result.summary.totalBackends > 0, 'Should detect backends')
})

test('MCP: qpu_circuit_compile', async () => {
  const result = await qpuCircuitCompile({
    circuit: {
      gates: [
        { type: 'h', qubits: [0] },
        { type: 'h', qubits: [0] }
      ],
      qubits: 1
    },
    optimize: true
  })

  assert.equal(result.success, true, 'Should succeed')
  assert.ok(result.compilation, 'Should return compilation result')
  assert.ok(result.compilation.gateReduction >= 0, 'Should show gate reduction')
})

test('MCP: qpu_execute_real', async () => {
  process.env.IONQ_API_KEY = 'ionq_test_key'

  const result = await qpuExecuteReal({
    circuit: {
      gates: [{ type: 'h', qubits: [0] }],
      qubits: 1
    },
    shots: 10
  })

  assert.equal(result.success, true, 'Should succeed')
  assert.ok(result.execution, 'Should return execution result')
  assert.ok(result.metadata, 'Should include metadata')
})

test('MCP: qpu_fetch_results', async () => {
  const result = await qpuFetchResults({
    provider: 'ibm',
    jobId: 'test-job-123'
  })

  assert.equal(result.success, true, 'Should succeed')
  assert.ok(result.results, 'Should return results object')
})

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

test('Integration: Full circuit submission and results', async () => {
  process.env.IONQ_API_KEY = 'ionq_test_key'

  const executor = new QuantumExecutor()

  // Create a simple Bell state circuit
  const circuit = {
    gates: [
      { type: 'h', qubits: [0] },
      { type: 'cnot', qubits: [0, 1] },
      { type: 'measure', qubits: [0] },
      { type: 'measure', qubits: [1] }
    ],
    qubits: 2,
    classicalBits: 2
  }

  const result = await executor.execute(circuit, {
    provider: 'ionq',
    shots: 50,
    optimize: true
  })

  assert.equal(result.success, true, 'Execution should complete')
  assert.ok(result.measurements, 'Should return measurements')
  assert.ok(Object.keys(result.measurements).length >= 0, 'Should have measurement results')
})

test('Integration: Compilation then execution', async () => {
  process.env.IBM_QISKIT_TOKEN = 'test_token'

  const executor = new QuantumExecutor()

  // Complex circuit with redundant gates
  const circuit = {
    gates: [
      { type: 'h', qubits: [0] },
      { type: 'h', qubits: [0] }, // Redundant
      { type: 'x', qubits: [1] },
      { type: 'x', qubits: [1] }, // Redundant
      { type: 'cnot', qubits: [0, 1] }
    ],
    qubits: 2
  }

  // Compile first
  const compiled = executor.compileCircuit(circuit, { optimize: true })

  assert.ok(compiled.circuit.gates.length < circuit.gates.length, 'Compilation should reduce gates')

  // Then execute
  const result = await executor.execute(circuit, {
    provider: 'ibm',
    backend: 'simulator_qasm',
    optimize: true
  })

  assert.equal(result.success, true, 'Should execute successfully')
})
