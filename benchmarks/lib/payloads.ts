export type ReuseFactor = 1 | 2 | 5 | 10

export type CorpusWorkloadType =
  | 'statevector_sampling'
  | 'clifford_sampling'
  | 'resource_estimation'

export type CorpusManifest = {
  corpusId: string
  framework: 'cirq' | 'qsim' | 'qualtran'
  workloadType: CorpusWorkloadType
  inputFormat: string
  inputCount: number
  canonicalization: string
  digestAlgorithm: 'sha256'
  workload: Record<string, unknown>
  expectedResult: Record<string, unknown>
  cachePolicy: {
    reuseFactors: ReuseFactor[]
    repetitions: number
    warmups: number
  }
}

export const REUSE_FACTORS: readonly ReuseFactor[] = [1, 2, 5, 10]
export const TIMED_REPETITIONS = 7
export const WARMUP_RUNS = 1

export function expectedHits(inputCount: number, reuseFactor: ReuseFactor): number {
  return inputCount * (reuseFactor - 1)
}

export function expectedMisses(inputCount: number): number {
  return inputCount
}

export function expectedHitRate(inputCount: number, reuseFactor: ReuseFactor): number {
  const requests = inputCount * reuseFactor
  return expectedHits(inputCount, reuseFactor) / requests
}
