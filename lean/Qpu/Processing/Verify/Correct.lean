/-
  Qpu.Verify.Correct — finite error-correction syndrome arithmetic.
  Repetition by exhaustive decision; Steane [[7,1,3]] syndrome decoding on
  the classical parity-check matrix, with failure controls.
-/
namespace Qpu.Verify.Correct

/-- Majority of three bits — the repetition-code decoder. -/
def maj3 (a b c : Bool) : Bool := (a && b) || (a && c) || (b && c)

/-- A clean codeword decodes to itself. -/
theorem repetition_corrects_clean (b : Bool) : maj3 b b b = b := by
  cases b <;> decide
/-- A flip in position 0 is repaired by the two healthy copies. -/
theorem repetition_corrects_flip0 (b : Bool) : maj3 (!b) b b = b := by
  cases b <;> decide
/-- A flip in position 1 is repaired. -/
theorem repetition_corrects_flip1 (b : Bool) : maj3 b (!b) b = b := by
  cases b <;> decide
/-- A flip in position 2 is repaired. -/
theorem repetition_corrects_flip2 (b : Bool) : maj3 b b (!b) = b := by
  cases b <;> decide
/-- Failure control: two flips defeat the repetition code — the majority
    votes for the wrong bit. -/
theorem repetition_fails_on_two_flips (b : Bool) : maj3 (!b) (!b) b = !b := by
  cases b <;> decide

/-- Shor-style nesting: each inner block decoded by `maj3`, blocks by `maj3`,
    still corrects one inner flip (the 9-qubit structure at the decoder level). -/
theorem shor_nine_corrects_one (b : Bool) :
    maj3 (maj3 (!b) b b) (maj3 b b b) (maj3 b b b) = b := by
  cases b <;> decide

/-- Steane [[7,1,3]] parity checks (same matrix for both error types by
    CSS duality). Column i is the binary numeral i+1, MSB on the first row. -/
def steaneH : List (List Bool) :=
  [[false, false, false, true,  true,  true,  true ],
   [false, true,  true,  false, false, true,  true ],
   [true,  false, true,  false, true,  false, true ]]

/-- One parity-check row against an error vector, in Z₂. -/
def checkRow (row err : List Bool) : Bool :=
  (row.zip err).foldl (fun a (r, e) => a ^^ (r && e)) false

/-- Three-bit syndrome of a 7-bit error vector. -/
def syndrome (err : List Bool) : List Bool := steaneH.map (checkRow · err)

/-- Single-bit error at position `i` (7-bit vector). -/
def errAt (i : Nat) : List Bool := (List.range 7).map (· == i)

/-- Binary value of the syndrome, most significant check first. -/
def syndromeVal (s : List Bool) : Nat :=
  (if s.getD 0 false then 4 else 0) +
  (if s.getD 1 false then 2 else 0) +
  (if s.getD 2 false then 1 else 0)

/-- Decode: the syndrome of a single-bit error identifies its position. -/
def recover (err : List Bool) : Nat := syndromeVal (syndrome err) - 1

/-- A flip on qubit 0 is located exactly. -/
theorem steane_recovers_0 : recover (errAt 0) = 0 := by decide
/-- A flip on qubit 1 is located exactly. -/
theorem steane_recovers_1 : recover (errAt 1) = 1 := by decide
/-- A flip on qubit 2 is located exactly. -/
theorem steane_recovers_2 : recover (errAt 2) = 2 := by decide
/-- A flip on qubit 3 is located exactly. -/
theorem steane_recovers_3 : recover (errAt 3) = 3 := by decide
/-- A flip on qubit 4 is located exactly. -/
theorem steane_recovers_4 : recover (errAt 4) = 4 := by decide
/-- A flip on qubit 5 is located exactly. -/
theorem steane_recovers_5 : recover (errAt 5) = 5 := by decide
/-- A flip on qubit 6 is located exactly. -/
theorem steane_recovers_6 : recover (errAt 6) = 6 := by decide

/-- Control: no error gives the zero syndrome (index 7 is out of range, hence
    the all-false vector). -/
theorem steane_no_error_is_silent : syndrome (errAt 7) = [false, false, false] := by decide

/-- Failure control: a two-bit error is miscorrected to a third position —
    this is exactly why Steane has distance 3, not 4. -/
theorem steane_miscorrects_double_error :
    recover ((errAt 0).zipWith (· ^^ ·) (errAt 1)) = 2 := by decide

/-- Distance arithmetic: d = 2t + 1 pins t = 1 for Steane's d = 3. -/
theorem steane_corrects_one : 3 = 2 * 1 + 1 := by decide
/-- Control: distance 3 cannot promise two corrections. -/
theorem steane_cannot_correct_two : 3 < 2 * 2 := by decide

end Qpu.Verify.Correct