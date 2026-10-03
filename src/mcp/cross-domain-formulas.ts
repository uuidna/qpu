import { qpuContentUuidOf, qpuUuidReceiptOf, qpuHexRegisterOf, qpuHexUuidOf } from '../quantum/processing/unit/index.js'
import { chooseOf, mintOf, qpuHexParamMaxOf, qpuLatticeNamesOf, tenOf } from '../quantum/processing/unit/index.js'
// the lattice names and the three formulas every number here is written in
const L = { ...qpuLatticeNamesOf(), mintOf, chooseOf, tenOf }

export interface CrossFormula {
  id: string
  src: string
  dst: string
  formula: string
  value: number
  proof: string
  /** Content address of src, dst and formula: the same bridge has the same uuid wherever it is declared. */
  uuid: string
  /** Programmable UUID of this evaluation's quantum receipt (payload + referrer). */
  receipt: string
  /** The inputs lie in the formula's domain and the value is finite (and a safe integer where it counts). */
  holds: boolean
  /** The hex program (RFC 9562 v8) that runs this formula: handle, call/holds/receipt, inputs as params. */
  hex?: string
  /** Whether the hex carries the exact inputs (naturals that fit the params section). */
  hexExact: boolean
}

export interface DomainBridge {
  from: string
  to: string
  transform: (input: unknown) => unknown
  formula: string
}

/**
 * Seal a cross formula: content UUID of {src, dst, formula}, holds (inputs in domain, value finite) and a quantum receipt in the cross stream.
 * @wing fusion
 * @kind builder
 */
export const crossFormulaOf = (f: Omit<CrossFormula, 'uuid' | 'receipt' | 'holds' | 'hex' | 'hexExact'>, domain = true, call?: { name: string; params: number[] }): CrossFormula => {
  const uuid = qpuContentUuidOf({ src: f.src, dst: f.dst, formula: f.formula })
  const holds = domain && Number.isFinite(f.value)
  // the formula's hex program: its handle, call then holds then receipt, its inputs as params when they are naturals that fit
  const exact = call !== undefined && call.params.length <= 3 && call.params.every((x) => Number.isSafeInteger(x) && x >= 0 && x < qpuHexParamMaxOf(call.params.length))
  let hex: string | undefined
  try {
    hex = call ? qpuHexUuidOf({ family: call.name.split('.')[0]!, program: [call.name.split('.')[1]!], params: exact ? call.params : [] }) : undefined
  } catch {
    hex = undefined
  }
  return { ...f, uuid, holds, hex, hexExact: Boolean(hex) && exact, receipt: qpuUuidReceiptOf(`cross ${f.id}`, uuid, { value: f.value, holds }).uuid }
}
const nat = (...xs: number[]): boolean => xs.every((x) => Number.isFinite(x) && x >= 0)

/**
 * The ten named cross-domain bridges (each a CrossFormula) and allBridges(), their transforms over plain inputs.
 * @wing fusion
 * @kind class
 */
export class CrossDomainFormulas {
  static bb84ToCompress(keyLen: number): CrossFormula {
    return crossFormulaOf({
      id: 'qsec→compress-1',
      src: 'qsec',
      dst: 'compress',
      formula: 'compression_ratio = 1 / (1 + log2(keyLen))',
      value: 1 / (1 + Math.log2(keyLen)),
      proof: 'Quantum key entropy bounds data compression potential'}, nat(keyLen) && keyLen >= 1, { name: 'cross.bb84ToCompress', params: [keyLen] })
  }

  static observabilityToML(signalCount: number): CrossFormula {
    return crossFormulaOf({
      id: 'obs→ml-1',
      src: 'obs',
      dst: 'ml',
      formula: 'model_accuracy = 1 - (1 / (1 + signalCount/100))',
      value: 1 - (1 / (1 + signalCount / L.tenOf(L.coins))),
      proof: 'Signal quantity improves prediction accuracy logarithmically'}, nat(signalCount), { name: 'cross.observabilityToML', params: [signalCount] })
  }

  static deploymentToObs(buildTime: number, testTime: number): CrossFormula {
    return crossFormulaOf({
      id: 'deployment→obs-1',
      src: 'deployment',
      dst: 'obs',
      formula: 'health_score = max(0, 1 - buildTime/300) * max(0, 1 - testTime/180)',
      value: Math.max(0, 1 - buildTime / (L.n * L.tenOf(L.coins))) * Math.max(0, 1 - testTime / 180),
      proof: 'Build+test speed indicates system health'}, nat(buildTime, testTime), { name: 'cross.deploymentToObs', params: [buildTime, testTime] })
  }

  static quantumToEnterprise(proofCount: number): CrossFormula {
    return crossFormulaOf({
      id: 'quantum→enterprise-1',
      src: 'quantum',
      dst: 'enterprise',
      formula: 'risk_score = 1 / (1 + proofCount)',
      value: 1 / (1 + proofCount),
      proof: 'Proven theorems reduce business risk'}, nat(proofCount), { name: 'cross.quantumToEnterprise', params: [proofCount] })
  }

  static medSecureWithQSec(patientCount: number, keyLen: number): CrossFormula {
    return crossFormulaOf({
      id: 'med+qsec-1',
      src: 'med',
      dst: 'qsec',
      formula: 'keyspace = 2^keyLen * patientCount',
      value: Math.pow(2, keyLen) * patientCount,
      proof: 'Each patient needs separate quantum key for HIPAA compliance'}, nat(patientCount, keyLen) && Number.isSafeInteger(Math.pow(2, keyLen) * patientCount), { name: 'cross.medSecureWithQSec', params: [patientCount, keyLen] })
  }

  static observabilityToUI(anomalies: number, signals: number): CrossFormula {
    return crossFormulaOf({
      id: 'obs→ui-1',
      src: 'obs',
      dst: 'ui',
      formula: 'alert_urgency = anomalies / (signals + 1)',
      value: anomalies / (signals + 1),
      proof: 'Anomaly ratio determines UI alert priority'}, nat(anomalies, signals), { name: 'cross.observabilityToUI', params: [anomalies, signals] })
  }

  static compressQSecSignals(signalLen: number, keyLen: number): CrossFormula {
    return crossFormulaOf({
      id: 'qsec+compress-1',
      src: 'qsec',
      dst: 'compress',
      formula: 'compressed_size = signalLen * (1 - keyLen/(keyLen+signalLen))',
      value: signalLen * (1 - keyLen / (keyLen + signalLen)),
      proof: 'Quantum entropy improves compression ratio'}, nat(signalLen, keyLen) && keyLen + signalLen > 0, { name: 'cross.compressQSecSignals', params: [signalLen, keyLen] })
  }

  static mlOnObsForPrediction(signalDim: number, anomalyCount: number): CrossFormula {
    return crossFormulaOf({
      id: 'obs+ml-1',
      src: 'obs',
      dst: 'ml',
      formula: 'prediction_confidence = 1 - (anomalyCount/(signalDim*signalDim))',
      value: 1 - (anomalyCount / (signalDim * signalDim)),
      proof: 'Low anomaly ratio enables high-confidence prediction'}, nat(signalDim, anomalyCount) && signalDim > 0 && anomalyCount <= signalDim * signalDim, { name: 'cross.mlOnObsForPrediction', params: [signalDim, anomalyCount] })
  }

  static enterpriseMetricsViaObs(complianceScore: number, latency: number): CrossFormula {
    return crossFormulaOf({
      id: 'enterprise→obs-1',
      src: 'enterprise',
      dst: 'obs',
      formula: 'slo_met = (complianceScore > 0.9) AND (latency < 200)',
      value: complianceScore > 0.9 && latency < L.coins * L.tenOf(L.coins) ? 1 : 0,
      proof: 'SLO requires both compliance and performance'}, nat(complianceScore, latency) && complianceScore <= 1, { name: 'cross.enterpriseMetricsViaObs', params: [complianceScore, latency] })
  }

  static testCoverageToQuality(testsPassed: number, totalTests: number): CrossFormula {
    return crossFormulaOf({
      id: 'test→enterprise-1',
      src: 'test',
      dst: 'enterprise',
      formula: 'quality_score = testsPassed / totalTests',
      value: totalTests > 0 ? testsPassed / totalTests : 0,
      proof: 'Test coverage is primary quality metric'}, nat(testsPassed, totalTests) && totalTests > 0 && testsPassed <= totalTests, { name: 'cross.testCoverageToQuality', params: [testsPassed, totalTests] })
  }

  static allBridges(): DomainBridge[] {
    return [
      { from: 'qsec', to: 'compress', formula: 'entropy→ratio', transform: (k: any) => 1 / (1 + Math.log2(k.keyLen || L.mintOf(L.rays))) },
      { from: 'obs', to: 'ml', formula: 'signals→accuracy', transform: (s: any) => 1 - (1 / (1 + (s.count || 0) / L.tenOf(L.coins))) },
      { from: 'deployment', to: 'obs', formula: 'timing→health', transform: (t: any) => Math.max(0, 1 - (t.build ?? 0) / (L.n * L.tenOf(L.coins))) * Math.max(0, 1 - (t.test ?? 0) / 180) },
      { from: 'quantum', to: 'enterprise', formula: 'proofs→risk', transform: (p: any) => 1 / (1 + (p.count || 0)) },
      { from: 'med', to: 'qsec', formula: 'patients→keyspace', transform: (m: any) => Math.pow(2, m.keyLen ?? L.mintOf(L.rays)) * (m.count ?? 0) },
      { from: 'obs', to: 'ui', formula: 'anomalies→urgency', transform: (o: any) => (o.anomalies ?? 0) / ((o.signals ?? 0) + 1) }
    ]
  }
}

/**
 * A CrossDomainFormulas instance.
 * @wing fusion
 * @kind function
 */
export const crossDomainFormulas = new CrossDomainFormulas()

// every bridge is a formula of the hex family `cross`, indexed by name
for (const name of Object.getOwnPropertyNames(CrossDomainFormulas)) {
  const fn = (CrossDomainFormulas as unknown as Record<string, unknown>)[name]
  if (typeof fn === 'function' && name !== 'allBridges') qpuHexRegisterOf('cross', name, (fn as (...x: unknown[]) => unknown).bind(CrossDomainFormulas))
}
