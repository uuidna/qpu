import { qpuContentUuidOf, qpuUuidReceiptOf, qpuHexRegisterOf, qpuHexUuidOf } from '../quantum/processing/unit/index.js'

export interface DomainPath {
  hops: string[]
  transform: (input: unknown) => unknown
  formula: string
  value?: number
  /** Content address of the hops and the formula. */
  uuid?: string
  /** Programmable UUID of this path's quantum receipt (payload + referrer). */
  receipt?: string
  /** The hex program that returns this path: handle path.<name>, call then receipt. */
  hex?: string
}

export interface MultihopResult {
  path: string[]
  intermediate: unknown[]
  final: unknown
}

/**
 * Seal a multi-hop path: content UUID of {hops, formula} and a quantum receipt in the path stream.
 * @wing fusion
 * @kind builder
 */
export const domainPathOf = (p: DomainPath): DomainPath => {
  const uuid = qpuContentUuidOf({ hops: p.hops, formula: p.formula })
  return { ...p, uuid, receipt: qpuUuidReceiptOf(`path ${p.hops.join('>')}`, uuid, p.value ?? null).uuid }
}

/**
 * The seven named multi-hop paths across domains, each with its hops, formula and transform.
 * @wing fusion
 * @kind class
 */
export class CrossDomainPaths {
  static qualityToRisk(): DomainPath {
    return domainPathOf({
      hops: ['test', 'deployment', 'quantum', 'enterprise'],
      formula: 'risk = 1 - quality * proof_count',
      transform: (q: any) => 1 - (q.quality || 0) * (q.proofs || 1),
      value: 0.5
    })
  }

  static obsToAction(): DomainPath {
    return domainPathOf({
      hops: ['obs', 'ml', 'ui'],
      formula: 'action_urgency = anomaly_score * (1 - ml_confidence)',
      transform: (o: any) => (o.anomalies || 0) * (1 - (o.mlConf || 0.5)),
      value: 0.25
    })
  }

  static dataFlowCompressML(): DomainPath {
    return domainPathOf({
      hops: ['deployment', 'compress', 'ml'],
      formula: 'ml_efficiency = (1 - compressed_ratio) * model_accuracy',
      transform: (d: any) => (1 - (d.compRatio || 0.5)) * (d.accuracy || 0.8),
      value: 0.4
    })
  }

  static secureDataPathQSec(): DomainPath {
    return domainPathOf({
      hops: ['deployment', 'qsec', 'med'],
      formula: 'hipaa_compliant = deployment_health * key_entropy * patient_count',
      transform: (d: any) => (d.health || 0.9) * Math.log2(d.keyLen || 128) * (d.patients || 100),
      value: 630
    })
  }

  static performanceToMetrics(): DomainPath {
    return domainPathOf({
      hops: ['deployment', 'obs', 'enterprise'],
      formula: 'sla_achievement = (perf_score * compliance) / (1 + latency/1000)',
      transform: (d: any) => ((d.perf || 1) * (d.compliance || 0.95)) / (1 + (d.latency || 0) / 1000),
      value: 0.95
    })
  }

  static quantumSecurityChain(): DomainPath {
    return domainPathOf({
      hops: ['quantum', 'qsec', 'enterprise', 'med'],
      formula: 'total_security = proof_count * key_strength * compliance * patient_coverage',
      transform: (q: any) => (q.proofs || 1) * Math.log2(q.keyLen || 128) * (q.comp || 0.9) * (q.coverage || 0.8),
      value: 8.5
    })
  }

  static anomalyToResponse(): DomainPath {
    return domainPathOf({
      hops: ['obs', 'ml', 'enterprise'],
      formula: 'response_time = detect_latency + predict_latency + decision_latency',
      transform: (o: any) => (o.detect || 10) + (o.predict || 50) + (o.decide || 20),
      value: 80
    })
  }

  static executePath(path: DomainPath, input: any): MultihopResult {
    const intermediate: unknown[] = []
    let current = input

    for (let i = 0; i < path.hops.length - 1; i++) {
      current = path.transform(current)
      intermediate.push(current)
    }

    return {
      path: path.hops,
      intermediate,
      final: current
    }
  }

  static allPaths(): DomainPath[] {
    return [
      this.qualityToRisk(),
      this.obsToAction(),
      this.dataFlowCompressML(),
      this.secureDataPathQSec(),
      this.performanceToMetrics(),
      this.quantumSecurityChain(),
      this.anomalyToResponse()
    ]
  }
}

/**
 * A CrossDomainPaths instance.
 * @wing fusion
 * @kind function
 */
export const crossDomainPaths = new CrossDomainPaths()

// every path is a formula of the hex family `path`
const pathNames = Object.getOwnPropertyNames(CrossDomainPaths).filter((k) => typeof (CrossDomainPaths as unknown as Record<string, unknown>)[k] === 'function')
for (const name of pathNames) qpuHexRegisterOf('path', name, (CrossDomainPaths as unknown as Record<string, () => unknown>)[name]!.bind(CrossDomainPaths))
/** The hex program that returns a named path. @wing fusion @kind function */
export const pathHexOf = (name: string): string => qpuHexUuidOf({ family: 'path', program: [name] })
