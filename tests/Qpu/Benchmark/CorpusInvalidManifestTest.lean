import Qpu.Benchmark.Corpus

/-!
# Qpu.Benchmark.Corpus — Invalid Manifest Regression Tests

Ensures that malformed or policy-violating corpus manifests are rejected
before benchmark execution or cache insertion.
-/

namespace Qpu.Benchmark.CorpusInvalidManifestTest

open Qpu.Benchmark

def validManifest : String :=
  "{"
  ++ "\"corpusId\":\"cirq-bell\",""
  ++ "\"framework\":\"cirq\",""
  ++ "\"workloadType\":\"statevector_sampling\",""
  ++ "\"inputFormat\":\"cirq-json-v1\",""
  ++ "\"inputCount\":1000,"
  ++ "\"canonicalization\":\"cirq-json-v1\",""
  ++ "\"digestAlgorithm\":\"sha256\",""
  ++ "\"workload\":{\"qubits\":2},"
  ++ "\"expectedResult\":{\"type\":\"measurement_histogram\"},"
  ++ "\"cachePolicy\":{"
  ++   "\"reuseFactors\":[1,2,5,10],"
  ++   "\"repetitions\":7,"
  ++   "\"warmups\":1"
  ++ "}"
  ++ "}"

def malformedJson : String := "{"

def emptyInput : String := ""

def missingCorpusId : String :=
  validManifest.replace "\"corpusId\":\"cirq-bell\"," ""

def missingFramework : String :=
  validManifest.replace "\"framework\":\"cirq\"," ""

def missingWorkloadType : String :=
  validManifest.replace
    "\"workloadType\":\"statevector_sampling\","
    ""

def missingInputCount : String :=
  validManifest.replace "\"inputCount\":1000," ""

def missingCanonicalization : String :=
  validManifest.replace
    "\"canonicalization\":\"cirq-json-v1\","
    ""

def missingDigestAlgorithm : String :=
  validManifest.replace
    "\"digestAlgorithm\":\"sha256\","
    ""

def missingWorkload : String :=
  validManifest.replace
    "\"workload\":{\"qubits\":2},"
    ""

def missingExpectedResult : String :=
  validManifest.replace
    "\"expectedResult\":{\"type\":\"measurement_histogram\"},"
    ""

def missingCachePolicy : String :=
  validManifest.replace
    "\"cachePolicy\":{\"reuseFactors\":[1,2,5,10],\"repetitions\":7,\"warmups\":1}"
    ""

def unknownFramework : String :=
  validManifest.replace "\"framework\":\"cirq\"" "\"framework\":\"unknown\""

def unknownWorkloadType : String :=
  validManifest.replace
    "\"workloadType\":\"statevector_sampling\""
    "\"workloadType\":\"unknown\""

def unsupportedDigest : String :=
  validManifest.replace
    "\"digestAlgorithm\":\"sha256\""
    "\"digestAlgorithm\":\"fnv1a\""

def zeroInputCount : String :=
  validManifest.replace "\"inputCount\":1000" "\"inputCount\":0"

def negativeInputCount : String :=
  validManifest.replace "\"inputCount\":1000" "\"inputCount\":-1"

def emptyWorkload : String :=
  validManifest.replace
    "\"workload\":{\"qubits\":2}"
    "\"workload\":{}"

def emptyExpectedResult : String :=
  validManifest.replace
    "\"expectedResult\":{\"type\":\"measurement_histogram\"}"
    "\"expectedResult\":{}"

def missingReuseFactors : String :=
  validManifest.replace
    "\"reuseFactors\":[1,2,5,10],"
    ""

def incompleteReuseFactors : String :=
  validManifest.replace
    "\"reuseFactors\":[1,2,5,10]"
    "\"reuseFactors\":[1,2,5]"

def extraReuseFactor : String :=
  validManifest.replace
    "\"reuseFactors\":[1,2,5,10]"
    "\"reuseFactors\":[1,2,5,10,20]"

def wrongRepetitions : String :=
  validManifest.replace "\"repetitions\":7" "\"repetitions\":3"

def zeroWarmups : String :=
  validManifest.replace "\"warmups\":1" "\"warmups\":0"

def invalidManifests : List (String × String) := [
  ("malformed JSON", malformedJson),
  ("empty input", emptyInput),
  ("missing corpus ID", missingCorpusId),
  ("missing framework", missingFramework),
  ("missing workload type", missingWorkloadType),
  ("missing input count", missingInputCount),
  ("missing canonicalization", missingCanonicalization),
  ("missing digest algorithm", missingDigestAlgorithm),
  ("missing workload", missingWorkload),
  ("missing expected result", missingExpectedResult),
  ("missing cache policy", missingCachePolicy),
  ("unknown framework", unknownFramework),
  ("unknown workload type", unknownWorkloadType),
  ("unsupported digest", unsupportedDigest),
  ("zero input count", zeroInputCount),
  ("negative input count", negativeInputCount),
  ("empty workload", emptyWorkload),
  ("empty expected result", emptyExpectedResult),
  ("missing reuse factors", missingReuseFactors),
  ("incomplete reuse factors", incompleteReuseFactors),
  ("extra reuse factor", extraReuseFactor),
  ("wrong repetitions", wrongRepetitions),
  ("zero warmups", zeroWarmups)
]

def invalidManifestsRejected : Bool :=
  invalidManifests.all (fun (_, manifest) =>
    (parseCorpusManifestJson manifest).isNone)

def validManifestAccepted : Bool :=
  (parseCorpusManifestJson validManifest).isSome

def main : IO UInt32 := do
  let checks : List (String × Bool) := [
    ("valid manifest accepted", validManifestAccepted),
    ("all invalid manifests rejected", invalidManifestsRejected)
  ]

  let failures := checks.filter (fun (_, passed) => !passed)

  for (name, passed) in checks do
    if passed then
      IO.println s!"PASS {name}"
    else
      IO.println s!"FAIL {name}"

  for (name, manifest) in invalidManifests do
    let rejected := (parseCorpusManifestJson manifest).isNone

    if rejected then
      IO.println s!"PASS rejected {name}"
    else
      IO.println s!"FAIL accepted invalid manifest: {name}"

  if failures.isEmpty then
    return 0
  else
    return 1

end Qpu.Benchmark.CorpusInvalidManifestTest
