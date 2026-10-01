/**
 * Unified Quantum Executor
 * Routes circuits to best available hardware provider
 * Supports IBM Qiskit, IonQ, AWS Braket
 */

import { IBMQiskitConnector, QuantumCircuit as QiskitCircuit, Gate as QiskitGate } from './ibm-qiskit.js'
import { IonQConnector } from './ionq-connector.js'
import { AWSBraketConnector } from './aws-braket.js'
import { CircuitCompiler, Circuit, CompilationOptions } from './circuit-compiler.js'

export interface QuantumCircuit {
  gates: Array<{ type: string; qubits: number[]; params?: number[] }>
  qubits: number
  classicalBits?: number
}

export interface ExecutionResult {
  provider: string
  jobId: string
  measurements: Record<string, number>
  duration: number
  success: boolean
  error?: string
}

export interface HardwareInfo {
  provider: string
  backend: string
  available: boolean
  qubits: number
  depth: number
}

export class QuantumExecutor {
  private ibmConnector: IBMQiskitConnector
  private ionqConnector: IonQConnector
  private braketConnector: AWSBraketConnector
  private compiler: CircuitCompiler

  constructor() {
    this.ibmConnector = new IBMQiskitConnector()
    this.ionqConnector = new IonQConnector()
    this.braketConnector = new AWSBraketConnector()
    this.compiler = new CircuitCompiler()
  }

  /**
   * Detect available quantum hardware
   */
  async detectHardware(): Promise<HardwareInfo[]> {
    const hardware: HardwareInfo[] = []

    try {
      const ibmBackends = await this.ibmConnector.getAvailableBackends()
      for (const backend of ibmBackends) {
        hardware.push({
          provider: 'ibm',
          backend,
          available: true,
          qubits: backend.includes('20') ? 20 : 5,
          depth: 100
        })
      }
    } catch (e) {
      console.warn('IBM Qiskit unavailable:', e)
    }

    try {
      const ionqBackends = await this.ionqConnector.getAvailableBackends()
      for (const backend of ionqBackends) {
        hardware.push({
          provider: 'ionq',
          backend,
          available: true,
          qubits: 11,
          depth: 256
        })
      }
    } catch (e) {
      console.warn('IonQ unavailable:', e)
    }

    try {
      const braketDevices = await this.braketConnector.listDevices()
      for (const device of braketDevices) {
        hardware.push({
          provider: 'aws',
          backend: device.name,
          available: device.status === 'AVAILABLE',
          qubits: device.qubits,
          depth: 500
        })
      }
    } catch (e) {
      console.warn('AWS Braket unavailable:', e)
    }

    return hardware
  }

  /**
   * Compile circuit for hardware
   */
  compileCircuit(circuit: QuantumCircuit, options?: CompilationOptions) {
    const compilable: Circuit = {
      gates: circuit.gates,
      qubits: circuit.qubits,
      depth: this.estimateDepth(circuit.gates)
    }

    return this.compiler.compile(compilable, options)
  }

  /**
   * Execute circuit on best available hardware
   */
  async execute(
    circuit: QuantumCircuit,
    options: {
      provider?: string
      backend?: string
      shots?: number
      optimize?: boolean
    } = {}
  ): Promise<ExecutionResult> {
    const startTime = Date.now()
    const shots = options.shots || 100

    try {
      // Compile circuit
      const compiled = this.compileCircuit(circuit, {
        optimize: options.optimize !== false,
        errorMitigation: true
      })

      const compiledCircuit = compiled.circuit

      // Select provider
      if (options.provider === 'ibm') {
        return await this.executeIBM(compiledCircuit, options.backend, shots, startTime)
      } else if (options.provider === 'ionq') {
        return await this.executeIonQ(compiledCircuit, options.backend, shots, startTime)
      } else if (options.provider === 'aws') {
        return await this.executeAWS(compiledCircuit, options.backend, shots, startTime)
      }

      // Auto-select best provider
      return await this.executeBest(compiledCircuit, shots, startTime)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      return {
        provider: 'unknown',
        jobId: '',
        measurements: {},
        duration: Date.now() - startTime,
        success: false,
        error: errorMsg
      }
    }
  }

  /**
   * Execute on IBM Qiskit
   */
  private async executeIBM(
    circuit: Circuit,
    backend: string = 'simulator_qasm',
    shots: number,
    startTime: number
  ): Promise<ExecutionResult> {
    const qiskitCircuit: QiskitCircuit = {
      gates: circuit.gates.map(g => ({
        type: g.type,
        qubits: g.qubits,
        params: g.params
      })) as QiskitGate[],
      qubits: circuit.qubits,
      classicalBits: circuit.qubits
    }

    const job = await this.ibmConnector.submitJob(qiskitCircuit, backend, shots)

    // Poll for results (simplified for demo)
    await new Promise(resolve => setTimeout(resolve, 5000))
    const result = await this.ibmConnector.getJobResult(job.jobId)

    return {
      provider: 'ibm',
      jobId: job.jobId,
      measurements: result?.resultCounts || {},
      duration: Date.now() - startTime,
      success: result?.status === 'completed'
    }
  }

  /**
   * Execute on IonQ
   */
  private async executeIonQ(
    circuit: Circuit,
    backend: string = 'qpu.harmony',
    shots: number,
    startTime: number
  ): Promise<ExecutionResult> {
    const ionqCircuit = this.ionqConnector.toIonQFormat(
      circuit.qubits,
      circuit.gates.map(g => ({
        type: g.type,
        targets: g.qubits,
        angle: g.params?.[0]
      }))
    )

    const job = await this.ionqConnector.submitCircuit(ionqCircuit, backend, shots)

    // Poll for results
    await new Promise(resolve => setTimeout(resolve, 4000))
    const results = await this.ionqConnector.getResults(job.id)

    return {
      provider: 'ionq',
      jobId: job.id,
      measurements: results || {},
      duration: Date.now() - startTime,
      success: job.status === 'completed'
    }
  }

  /**
   * Execute on AWS Braket
   */
  private async executeAWS(
    circuit: Circuit,
    backend?: string,
    shots: number = 100,
    startTime: number = Date.now()
  ): Promise<ExecutionResult> {
    const braketCircuit = {
      instructions: circuit.gates.map(g => ({
        gate: g.type,
        targets: g.qubits,
        angle: g.params?.[0]
      })),
      qubitCount: circuit.qubits,
      resultTypes: ['sample']
    }

    const task = await this.braketConnector.runCircuit(braketCircuit, backend, shots)

    // Poll for results
    await new Promise(resolve => setTimeout(resolve, 4500))
    const result = await this.braketConnector.getTaskResult(task.taskArn)

    const measurements: Record<string, number> = {}
    if (result?.result?.measurements) {
      for (const measurement of result.result.measurements) {
        const bitstring = measurement.join('')
        measurements[bitstring] = (measurements[bitstring] || 0) + 1
      }
    }

    return {
      provider: 'aws',
      jobId: task.taskArn,
      measurements,
      duration: Date.now() - startTime,
      success: result?.status === 'COMPLETED'
    }
  }

  /**
   * Automatically select best provider based on circuit
   */
  private async executeBest(
    circuit: Circuit,
    shots: number,
    startTime: number
  ): Promise<ExecutionResult> {
    const hardware = await this.detectHardware()

    // Prefer IonQ for small circuits (good for NISQ era)
    if (circuit.qubits <= 11) {
      const ionq = hardware.find(h => h.provider === 'ionq')
      if (ionq?.available) {
        return this.executeIonQ(circuit, ionq.backend, shots, startTime)
      }
    }

    // Prefer simulator for testing
    const simulator = hardware.find(h => h.backend.includes('simulator'))
    if (simulator?.available) {
      return this.executeIBM(circuit, simulator.backend, shots, startTime)
    }

    // Fallback to first available
    if (hardware.length > 0 && hardware[0].available) {
      if (hardware[0].provider === 'ibm') {
        return this.executeIBM(circuit, hardware[0].backend, shots, startTime)
      } else if (hardware[0].provider === 'ionq') {
        return this.executeIonQ(circuit, hardware[0].backend, shots, startTime)
      }
    }

    throw new Error('No quantum hardware available')
  }

  private estimateDepth(gates: Array<{ type: string; qubits: number[] }>): number {
    // Simple depth estimation: count layers
    const layers: Set<number>[] = []

    for (const gate of gates) {
      let placed = false
      for (const layer of layers) {
        const hasConflict = gate.qubits.some(q => layer.has(q))
        if (!hasConflict) {
          gate.qubits.forEach(q => layer.add(q))
          placed = true
          break
        }
      }
      if (!placed) {
        layers.push(new Set(gate.qubits))
      }
    }

    return layers.length
  }
}
