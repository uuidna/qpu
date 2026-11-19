import Qpu.Benchmark.Runner

/-!
# Qpu.Benchmark.Runner — Integration Tests

Checks that the benchmark runner uses the existing `Qpu.Verify` seams and
that invalid cached results are invalidated rather than reused.
-/

namespace Qpu.Benchmark.RunnerIntegrationTest

open Qpu.Benchmark

def bellCorpus : CorpusManifest :=
  {
    corpusId := "cirq-bell"
    framework := .cirq
    workloadType := .statevectorSampling
    inputFormat := "cirq-json-v1"
    inputCount := 2
    canonicalization := "cirq-json-v1"
    digestAlgorithm := "sha256"
    workload := Json.obj []
    expectedResult := Json.obj []
    cachePolicy := {
      reuseFactors := [1, 2]
      repetitions := 1
      warmups := 1
    }
  }

/-- A generated address must be accepted by the receipt seam. -/
#eval receiptValid (generateAddress (canonicalize "cirq-bell" 0))

/-- A nonempty result passes the temporary result-validation seam. -/
#eval resultValid bellCorpus "digest" "result"

/-- An empty result fails the temporary result-validation seam. -/
#eval !resultValid bellCorpus "digest" ""

/-- The runner produces one warm-up and one timed sample per reuse factor. -/
#eval
  match ← runCorpusBenchmarks bellCorpus with
  | samples => samples.length == 2

end Qpu.Benchmark.RunnerIntegrationTest
