/**
 * Unified Quantum Executor
 * Prefer QPU native (connector / server_submit / hex). Foreign vendor connectors remain
 * as compatibility shims — they do not mint hardware tickets or invent prices.
 */

import { IBMQiskitConnector, QuantumCircuit as QiskitCircuit, Gate as QiskitGate } from './ibm-qiskit.js'
import { IonQConnector } from './ionq-connector.js'
import { AWSBraketConnector } from './aws-braket.js'
import { CircuitCompiler, Circuit, CompilationOptions } from './circuit-compiler.js'
import { nativeJobOf } from '../payload/plugins/native-adapters.js'

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
   * Execute circuit — default path is QPU native (exact amplitudes).
   * Pass provider ibm|ionq|aws only to exercise legacy foreign shims.
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
      // Default / explicit qpu: native adapter (seal-wave safe).
      if (!options.provider || options.provider === 'qpu' || options.provider === 'native') {
        const run = await nativeJobOf({
          vendor: 'server',
          gates: circuit.gates,
          shots,
          seal: true,
          pass: 0,
          mode: 5,
          who: 'other',
        })
        const counts: Record<string, number> = {}
        for (const row of ((run as { result?: { counts?: { i: number; w: number }[] } }).result?.counts ?? [])) {
          counts[String(row.i)] = row.w
        }
        return {
          provider: 'qpu',
          jobId: `qpu-native-${(run as { foreign?: { id?: string | number } }).foreign?.id ?? startTime}`,
          measurements: counts,
          duration: Date.now() - startTime,
          success: (run as { holds?: boolean }).holds === true,
        }
      }

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

    // Poll until completed — no fixed 5s sleep (wait audit: ad-hoc hot)
    const result = await this.pollUntil(
      10_000,
      100,
      () => this.ibmConnector.getJobResult(job.jobId),
      (j) => j?.status === 'completed' || j?.status === 'failed',
    )

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

    const done = await this.pollUntil(
      10_000,
      100,
      async () => this.ionqConnector.getJobStatus(job.id),
      (j) => j?.status === 'completed' || j?.status === 'failed',
    )
    const results = done?.status === 'completed' ? await this.ionqConnector.getResults(job.id) : null

    return {
      provider: 'ionq',
      jobId: job.id,
      measurements: results || {},
      duration: Date.now() - startTime,
      success: done?.status === 'completed'
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

    const result = await this.pollUntil(
      10_000,
      100,
      () => this.braketConnector.getTaskResult(task.taskArn),
      (t) => t?.status === 'COMPLETED' || t?.status === 'FAILED',
    )

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

  /** Short-interval poll until done or deadline — replaces fixed sleeps (heat: fail at rising temp). */
  private async pollUntil<T>(
    deadlineMs: number,
    everyMs: number,
    read: () => Promise<T | null | undefined>,
    done: (v: T) => boolean,
  ): Promise<T | null> {
    const t0 = Date.now()
    while (Date.now() - t0 < deadlineMs) {
      const v = await read()
      if (v != null && done(v)) return v
      await new Promise((r) => setTimeout(r, everyMs))
    }
    return (await read()) ?? null
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
