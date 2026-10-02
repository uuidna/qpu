import { qpuContentUuidOf, qpuUuidReceiptOf } from '../quantum/processing/unit/index.js'

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
export const crossFormulaOf = (f: Omit<CrossFormula, 'uuid' | 'receipt' | 'holds'>, domain = true): CrossFormula => {
  const uuid = qpuContentUuidOf({ src: f.src, dst: f.dst, formula: f.formula })
  const holds = domain && Number.isFinite(f.value)
  return { ...f, uuid, holds, receipt: qpuUuidReceiptOf(`cross ${f.id}`, uuid, { value: f.value, holds }).uuid }
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
      proof: 'Quantum key entropy bounds data compression potential'}, nat(keyLen) && keyLen >= 1)
  }

  static observabilityToML(signalCount: number): CrossFormula {
    return crossFormulaOf({
      id: 'obs→ml-1',
      src: 'obs',
      dst: 'ml',
      formula: 'model_accuracy = 1 - (1 / (1 + signalCount/100))',
      value: 1 - (1 / (1 + signalCount / 100)),
      proof: 'Signal quantity improves prediction accuracy logarithmically'}, nat(signalCount))
  }

  static deploymentToObs(buildTime: number, testTime: number): CrossFormula {
    return crossFormulaOf({
      id: 'deployment→obs-1',
      src: 'deployment',
      dst: 'obs',
      formula: 'health_score = max(0, 1 - buildTime/300) * max(0, 1 - testTime/180)',
      value: Math.max(0, 1 - buildTime / 300) * Math.max(0, 1 - testTime / 180),
      proof: 'Build+test speed indicates system health'}, nat(buildTime, testTime))
  }

  static quantumToEnterprise(proofCount: number): CrossFormula {
    return crossFormulaOf({
      id: 'quantum→enterprise-1',
      src: 'quantum',
      dst: 'enterprise',
      formula: 'risk_score = 1 / (1 + proofCount)',
      value: 1 / (1 + proofCount),
      proof: 'Proven theorems reduce business risk'}, nat(proofCount))
  }

  static medSecureWithQSec(patientCount: number, keyLen: number): CrossFormula {
    return crossFormulaOf({
      id: 'med+qsec-1',
      src: 'med',
      dst: 'qsec',
      formula: 'keyspace = 2^keyLen * patientCount',
      value: Math.pow(2, keyLen) * patientCount,
      proof: 'Each patient needs separate quantum key for HIPAA compliance'}, nat(patientCount, keyLen) && Number.isSafeInteger(Math.pow(2, keyLen) * patientCount))
  }

  static observabilityToUI(anomalies: number, signals: number): CrossFormula {
    return crossFormulaOf({
      id: 'obs→ui-1',
      src: 'obs',
      dst: 'ui',
      formula: 'alert_urgency = anomalies / (signals + 1)',
      value: anomalies / (signals + 1),
      proof: 'Anomaly ratio determines UI alert priority'}, nat(anomalies, signals))
  }

  static compressQSecSignals(signalLen: number, keyLen: number): CrossFormula {
    return crossFormulaOf({
      id: 'qsec+compress-1',
      src: 'qsec',
      dst: 'compress',
      formula: 'compressed_size = signalLen * (1 - keyLen/(keyLen+signalLen))',
      value: signalLen * (1 - keyLen / (keyLen + signalLen)),
      proof: 'Quantum entropy improves compression ratio'}, nat(signalLen, keyLen) && keyLen + signalLen > 0)
  }

  static mlOnObsForPrediction(signalDim: number, anomalyCount: number): CrossFormula {
    return crossFormulaOf({
      id: 'obs+ml-1',
      src: 'obs',
      dst: 'ml',
      formula: 'prediction_confidence = 1 - (anomalyCount/(signalDim*signalDim))',
      value: 1 - (anomalyCount / (signalDim * signalDim)),
      proof: 'Low anomaly ratio enables high-confidence prediction'}, nat(signalDim, anomalyCount) && signalDim > 0 && anomalyCount <= signalDim * signalDim)
  }

  static enterpriseMetricsViaObs(complianceScore: number, latency: number): CrossFormula {
    return crossFormulaOf({
      id: 'enterprise→obs-1',
      src: 'enterprise',
      dst: 'obs',
      formula: 'slo_met = (complianceScore > 0.9) AND (latency < 200)',
      value: complianceScore > 0.9 && latency < 200 ? 1 : 0,
      proof: 'SLO requires both compliance and performance'}, nat(complianceScore, latency) && complianceScore <= 1)
  }

  static testCoverageToQuality(testsPassed: number, totalTests: number): CrossFormula {
    return crossFormulaOf({
      id: 'test→enterprise-1',
      src: 'test',
      dst: 'enterprise',
      formula: 'quality_score = testsPassed / totalTests',
      value: totalTests > 0 ? testsPassed / totalTests : 0,
      proof: 'Test coverage is primary quality metric'}, nat(testsPassed, totalTests) && totalTests > 0 && testsPassed <= totalTests)
  }

  static allBridges(): DomainBridge[] {
    return [
      { from: 'qsec', to: 'compress', formula: 'entropy→ratio', transform: (k: any) => 1 / (1 + Math.log2(k.keyLen || 128)) },
      { from: 'obs', to: 'ml', formula: 'signals→accuracy', transform: (s: any) => 1 - (1 / (1 + (s.count || 0) / 100)) },
      { from: 'deployment', to: 'obs', formula: 'timing→health', transform: (t: any) => Math.max(0, 1 - (t.build ?? 0) / 300) * Math.max(0, 1 - (t.test ?? 0) / 180) },
      { from: 'quantum', to: 'enterprise', formula: 'proofs→risk', transform: (p: any) => 1 / (1 + (p.count || 0)) },
      { from: 'med', to: 'qsec', formula: 'patients→keyspace', transform: (m: any) => Math.pow(2, m.keyLen ?? 128) * (m.count ?? 0) },
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
