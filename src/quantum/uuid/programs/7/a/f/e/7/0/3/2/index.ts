// Tenant crypto config assembled for Payload MCP (qpuMcpPlugin). Thin module: no toolbox, no mcp — safe for processor/crypto doors.
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { TABLES } from '../../../../../../../../1/2/a/4/3/2/a/8/index.ts'
import { TENANTS } from '../../../../../../../../3/a/4/f/9/2/3/c/index.ts'
import { ALL_PROCESSORS, DEVICES, QUANTUM_HARDWARE_STACK } from '../../../../../../../../f/7/e/3/6/2/f/6/index.ts'
import { ISO_DIMENSIONS, ISO_OPEN_DEFINITIONS } from '../../../../../../../../0/b/7/1/f/2/4/6/index.ts'
import { AXIOMS } from '../../../../../../../../9/d/1/0/1/4/3/9/index.ts'
import { uuidQubits } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'
import { type CryptoConfig, type CryptoProcessorName, type CryptoProcessorRow, type CryptoUuidRegister } from '../../../../../../../../e/1/9/1/6/4/9/c/index.ts'

/** Serialisable processor inventory for tenant crypto (ISO/IEC 4879): names and sizes only — site geometry stays in processor.ts. */
const processorInventory = (): readonly CryptoProcessorRow[] =>
  (Object.keys(ALL_PROCESSORS) as CryptoProcessorName[]).map((name) => {
    const p = ALL_PROCESSORS[name]
    return {
      name,
      qubits: p.qubits,
      couplers: p.couplers.length,
      ...('technology' in p ? { technology: String(p.technology) } : {}),
      ...('layout' in p ? { layout: String(p.layout) } : {}),
      ...('statedQubits' in p ? { statedQubits: Number(p.statedQubits) } : {}),
      ...('statedCouplers' in p ? { statedCouplers: Number(p.statedCouplers) } : {}),
      ...('statedAverageConnectivity' in p ? { statedAverageConnectivity: Number(p.statedAverageConnectivity) } : {}),
    }
  })

/** Crypto config for every tool under a tenant: Payload TABLES + ISO quantum-computer inventory + tenant domains. Served through `payload { cryptoConfig: true }` / tenants.settings.arguments (qpuMcpPlugin). */
export const cryptoConfig = (via: CryptoConfig['via'] = 'qpuMcpPlugin'): CryptoConfig & { phase: 'crypto-config'; plugin: 'qpuMcpPlugin'; webcryptoFlag: string; fetched: false; written: false; says: string } => {
  const attestApis = TABLES.ATTEST_APIS as CryptoConfig['attestApis']
  const postQuantum = TABLES.POST_QUANTUM as CryptoConfig['postQuantum']
  const hosts = Object.keys(TENANTS)
  const codataUrl = String(attestApis.find((a) => a.id === 'nist-codata')?.url ?? '')
  const allowed = Object.keys(ALL_PROCESSORS) as CryptoProcessorName[]
  const vocabulary = ISO_OPEN_DEFINITIONS.find((row) => row.reference === 'ISO/IEC 4879:2024')
  if (!vocabulary) throw new Error(PROSE.quantumProcessingCryptoConfig_s1)
  const hexbitAxiom = AXIOMS.find((row) => row.name === 'hexbit')
  if (!hexbitAxiom || !Number.isInteger(hexbitAxiom.value) || hexbitAxiom.value < 1) throw new Error(PROSE.quantumProcessingCryptoConfig_s2)
  const counted = uuidQubits(hexbitAxiom.value)
  const register: CryptoUuidRegister = {
    standard: 'ISO/IEC 4879:2024',
    uuid: 'ISO/IEC 9834-8',
    quality: 'ISO 9001',
    hexbit: counted.hexbit,
    digits: 32,
    effective: counted.effective,
    versionReserved: counted.version,
    variantReserved: 2,
    formula: counted.receipt.formula,
    handles: { possible: counted.handles.possible, capacity: counted.handles.capacity, fractal: counted.handles.fractal },
    delivery: { leads: 6, holds: counted.delivery.holds === true && counted.receipt.holds === true },
    clauses: [
      { clause: '3.3.3', name: 'qubit', kind: 'logical-qubit' },
      { clause: '3.3.7', name: 'logical qubit', kind: 'logical-qubit' },
      { clause: '3.2.8', name: 'quantum superposition', kind: 'superposition' },
      { clause: 'ISO/IEC 9834-8', name: 'UUID', kind: 'uuid' },
    ],
    doors: { fold: 'qubits', via: 'qpuMcpPlugin' },
  }
  if (!register.delivery.holds) throw new Error(proseFill(PROSE.quantumProcessingCryptoConfig_s3, register.effective, register.formula))
  const quantumComputer: CryptoConfig['iso']['quantumComputer'] = {
    standard: 'ISO/IEC 4879:2024',
    vocabulary: {
      reference: vocabulary.reference,
      id: vocabulary.id,
      title: vocabulary.title.en,
      scope: vocabulary.scope.en,
    },
    companions: ISO_DIMENSIONS.filter((d) => d === 'ISO/IEC 4879:2024' || d.startsWith('ISO 80000') || d.startsWith('ISO/IEC 9834') || d === 'ISO 9001'),
    processors: {
      default: 'Willow',
      allowed,
      inventory: processorInventory(),
      // a processor a circuit can be checked against is readable; one that is not, only a writer chooses
      roles: Object.fromEntries(allowed.map((name) => [name, name in DEVICES ? 'reader' : 'writer'])) as Record<CryptoProcessorName, 'reader' | 'writer'>,
    },
    devices: Object.keys(DEVICES) as CryptoProcessorName[],
    schemas: { qubit: TABLES.QUBIT_SCHEMA, channel: TABLES.CHANNEL_SCHEMA },
    hardware: {
      modality: QUANTUM_HARDWARE_STACK.modality,
      noiseModels: QUANTUM_HARDWARE_STACK.calibrationAndBenchmarking.noiseModels,
      krausChannels: QUANTUM_HARDWARE_STACK.calibrationAndBenchmarking.krausChannels,
      twoQubitGates: QUANTUM_HARDWARE_STACK.physics.twoQubitGates,
    },
    register,
  }
  return {
    phase: 'crypto-config' as const,
    plugin: 'qpuMcpPlugin' as const,
    via,
    attestApis,
    postQuantum,
    hosts,
    codataUrl,
    iso: { dimensions: ISO_DIMENSIONS, quantumComputer },
    webcryptoFlag: postQuantum.workers.flag,
    fetched: false as const,
    written: false as const,
    says: proseFill(PROSE.quantumProcessingCryptoConfig_says4, via ?? 'qpuMcpPlugin', hosts.length, attestApis.length, postQuantum.workers.flag, allowed.length, quantumComputer.processors.default, register.hexbit, register.effective),
  }
}
