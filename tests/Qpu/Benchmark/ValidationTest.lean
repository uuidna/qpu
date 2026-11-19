import Qpu.Benchmark.Validation

/-!
# Qpu.Benchmark.Validation — Corpus-Specific Validation Tests

Checks Bell, GHZ, qsim histogram, and Qualtran resource-count validation.
-/

namespace Qpu.Benchmark.ValidationTest

open Qpu.Benchmark

/-- Bell histogram with valid support. -/
def validBellHistogram : MeasurementHistogram :=
  Std.HashMap.empty
  |>.insert "00" 500
  |>.insert "11" 500

/-- Bell histogram with invalid support. -/
def invalidBellHistogram : MeasurementHistogram :=
  Std.HashMap.empty
  |>.insert "00" 250
  |>.insert "01" 250
  |>.insert "11" 500

/-- Eight-qubit GHZ histogram with valid support. -/
def validGhzHistogram : MeasurementHistogram :=
  Std.HashMap.empty
  |>.insert "00000000" 500
  |>.insert "11111111" 500

/-- Eight-qubit GHZ histogram with invalid support. -/
def invalidGhzHistogram : MeasurementHistogram :=
  Std.HashMap.empty
  |>.insert "00000000" 250
  |>.insert "00000001" 250
  |>.insert "11111111" 500

/-- Matching qsim reference and actual histograms. -/
def matchingStatevectorHistogram : MeasurementHistogram :=
  Std.HashMap.empty
  |>.insert "00" 500
  |>.insert "11" 500

/-- Mismatching qsim actual histogram. -/
def mismatchingStatevectorHistogram : MeasurementHistogram :=
  Std.HashMap.empty
  |>.insert "00" 400
  |>.insert "11" 600

/-- Matching Qualtran resource counts. -/
def matchingResourceCounts : ResourceCounts :=
  {
    tCount := 0
    cliffordCount := 0
    rotations := 0
    qubitCount := 16
  }

/-- Mismatching Qualtran resource counts. -/
def mismatchingResourceCounts : ResourceCounts :=
  {
    tCount := 1
    cliffordCount := 0
    rotations := 0
    qubitCount := 16
  }

/-- Valid Bell histogram passes. -/
#eval bellHistogramValid validBellHistogram

/-- Invalid Bell histogram fails. -/
#eval !bellHistogramValid invalidBellHistogram

/-- Valid GHZ histogram passes. -/
#eval ghzHistogramValid 8 validGhzHistogram

/-- Invalid GHZ histogram fails. -/
#eval !ghzHistogramValid 8 invalidGhzHistogram

/-- Matching qsim histograms pass. -/
#eval statevectorHistogramValid
  matchingStatevectorHistogram
  matchingStatevectorHistogram

/-- Mismatching qsim histograms fail. -/
#eval !statevectorHistogramValid
  matchingStatevectorHistogram
  mismatchingStatevectorHistogram

/-- Matching Qualtran resource counts pass. -/
#eval resourceCountsValid matchingResourceCounts matchingResourceCounts

/-- Mismatching Qualtran resource counts fail. -/
#eval !resourceCountsValid matchingResourceCounts mismatchingResourceCounts

end Qpu.Benchmark.ValidationTest
