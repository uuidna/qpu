import Lean

import Qpu.Benchmark.Corpus
import Qpu.Verify.Correct
import Qpu.Verify.Cost
import Qpu.Verify.Entangle
import Qpu.Verify.Gate
import Qpu.Verify.Hexbit
import Qpu.Verify.Stabilizer

namespace Qpu.Benchmark

/-- A measurement histogram keyed by bitstring. -/
abbrev MeasurementHistogram := Std.HashMap String Nat

/-- Resource counts for a Qualtran Bloq. -/
structure ResourceCounts where
  tCount : Nat
  cliffordCount : Nat
  rotations : Nat
  qubitCount : Nat
  deriving Repr, BEq

/-- Validate that a bitstring has the expected length and binary alphabet. -/
def bitstringValid
  (expectedLength : Nat)
  (bitstring : String) : Bool :=
  bitstring.length == expectedLength &&
  bitstring.all (fun character => character == '0' || character == '1')

/-- Validate a Bell-state measurement histogram. -/
def bellHistogramValid
  (histogram : MeasurementHistogram) : Bool :=
  let zeroZero := histogram.find? "00" |>.getD 0
  let oneOne := histogram.find? "11" |>.getD 0
  let total := zeroZero + oneOne

  total > 0 &&
  zeroZero * 2 >= total &&
  oneOne * 2 >= total

/-- Validate an n-qubit GHZ measurement histogram. -/
def ghzHistogramValid
  (qubits : Nat)
  (histogram : MeasurementHistogram) : Bool :=
  let allZero := String.mk (List.replicate qubits '0')
  let allOne := String.mk (List.replicate qubits '1')

  let zeroCount := histogram.find? allZero |>.getD 0
  let oneCount := histogram.find? allOne |>.getD 0
  let total := zeroCount + oneCount

  total > 0 &&
  zeroCount * 2 >= total &&
  oneCount * 2 >= total

/-- Validate a qsim measurement histogram against a reference histogram. -/
def statevectorHistogramValid
  (reference : MeasurementHistogram)
  (actual : MeasurementHistogram) : Bool :=
  reference.toList.all (fun (outcome, expectedCount) =>
    actual.find? outcome |>.getD 0 == expectedCount)

/-- Validate Qualtran resource counts using exact integer comparison. -/
def resourceCountsValid
  (expected : ResourceCounts)
  (actual : ResourceCounts) : Bool :=
  actual.tCount == expected.tCount &&
  actual.cliffordCount == expected.cliffordCount &&
  actual.rotations == expected.rotations &&
  actual.qubitCount == expected.qubitCount

/-- Parse a measurement histogram from JSON. -/
def parseMeasurementHistogram (value : Json) : MeasurementHistogram :=
  match value with
  | Json.obj entries =>
    entries.foldl
      (fun histogram (key, count) =>
        match count with
        | Json.num number =>
          match number.toNat? with
          | some count => histogram.insert key count
          | none => histogram
        | _ => histogram)
      (Std.HashMap.empty)
  | _ => Std.HashMap.empty

/-- Parse resource counts from JSON. -/
def parseResourceCounts (value : Json) : Option ResourceCounts :=
  match value with
  | Json.obj entries =>
    some {
      tCount := jsonNat entries "t_count"
      cliffordCount := jsonNat entries "clifford_count"
      rotations := jsonNat entries "rotations"
      qubitCount := jsonNat entries "qubit_count"
    }
  | _ => none
where
  jsonNat (entries : List (String × Json)) (key : String) : Nat :=
    match entries.lookup key with
    | some (Json.num number) => number.toNat? |>.getD 0
    | _ => 0

/-- Dispatch corpus-specific validation through the existing Verify modules. -/
def validateCorpusResult
  (corpus : CorpusManifest)
  (_inputDigest : String)
  (result : Json) : Bool :=
  match corpus.workloadType with
  | .statevectorSampling =>
    match corpus.corpusId with
    | "cirq-bell" =>
      bellHistogramValid (parseMeasurementHistogram result)
    | "cirq-ghz-8" =>
      ghzHistogramValid 8 (parseMeasurementHistogram result)
    | "qsim-statevector-16q" =>
      statevectorHistogramValid
        (parseMeasurementHistogram corpus.expectedResult)
        (parseMeasurementHistogram result)
    | _ => false

  | .cliffordSampling =>
    match corpus.corpusId with
    | "cirq-clifford-ghz-100" =>
      ghzHistogramValid 100 (parseMeasurementHistogram result)
    | _ => false

  | .resourceEstimation =>
    match corpus.corpusId with
    | "qualtran-addition-8q" =>
      match parseResourceCounts corpus.expectedResult,
            parseResourceCounts result with
      | some expected, some actual => resourceCountsValid expected actual
      | _, _ => false
    | "qualtran-qrom-lookup-small" =>
      match parseResourceCounts corpus.expectedResult,
            parseResourceCounts result with
      | some expected, some actual => resourceCountsValid expected actual
      | _, _ => false
    | _ => false

end Qpu.Benchmark
