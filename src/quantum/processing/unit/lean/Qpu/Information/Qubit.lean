import Qpu.Lattice

/-! # Qpu.Information.Qubit
---
component: qubit (ISO/IEC 4879:2024 3.3.3)
---
qpu's qubits as formulas over the hexbit width `w`. Each of the address's digits is a row of qubits: the version
digit is decided and holds none, the variant digit gives two bits to the RFC prefix, every other digit holds `w`. The
device's rows are the digits that hold qubits, in digit order, so the decided version digit is passed over; its couplers are
the row and column neighbours of that grid. Every count the code serves is an evaluation of these. -/

namespace Qubit

/-- the hex digits of one address -/
def digits : Nat := bits
/-- the version digit: decided by the content, so it holds no qubit -/
def versionAt : Nat := 12
/-- the variant digit: its two gateway bits are the RFC prefix -/
def variantAt : Nat := 16
/-- the bits the variant digit gives to the RFC prefix -/
def gateway : Nat := coins

/-- the qubits digit `i` holds at hexbit width `w` -/
def held (i w : Nat) : Nat := if i = versionAt then 0 else if i = variantAt then w - gateway else w

/-- the qubits one address holds at width `w`: the sum of its rows -/
def effective (w : Nat) : Nat := ((List.range digits).map (held · w)).sum

/-- the digits that hold qubits at width `w`, in digit order -/
def holding (w : Nat) : List Nat := (List.range digits).filter fun i => held i w ≠ 0

/-- the rows of the device: the qubits of each digit that holds any, in digit order -/
def rows (w : Nat) : List Nat := (holding w).map (held · w)

/-- the couplers inside the rows: neighbours along a digit's bits -/
def rowCouplers (w : Nat) : Nat := ((rows w).map (· - 1)).sum

/-- the couplers between consecutive rows: neighbours on the same bit -/
def pairsMin : List Nat → Nat
  | a :: b :: t => min a b + pairsMin (b :: t)
  | _ => 0

/-- the couplers between rows -/
def columnCouplers (w : Nat) : Nat := pairsMin (rows w)

/-- the register's couplers -/
def couplers (w : Nat) : Nat := rowCouplers w + columnCouplers w

theorem digits_thirtytwo : digits = 32 := by decide
theorem gateway_two : gateway = 2 := by decide
theorem hexbit_four : hexbit = 4 := by decide
theorem coins_two : coins = 2 := by decide

/-- an address at width `w` holds every digit's `w` save the version digit's `w` and the two gateway bits -/
theorem effective_formula (w : Nat) (h : gateway ≤ w) : effective w = digits * w - w - gateway := by
  rw [gateway_two] at h
  simp only [effective, held, digits_thirtytwo, gateway_two, versionAt, variantAt, List.range_succ, List.range_zero, List.nil_append,
    List.map_append, List.map_cons, List.map_nil, List.sum_append, List.sum_cons, List.sum_nil]
  simp
  omega

/-- with a variant row (w ≥ 3) every digit but the version digit holds qubits -/
theorem holding_formula (w : Nat) (h : gateway + 1 ≤ w) : holding w = (List.range digits).filter (· ≠ versionAt) := by
  unfold holding
  apply List.filter_congr
  intro i _
  rw [gateway_two] at h
  simp only [held, versionAt, variantAt, gateway_two]
  by_cases h12 : i = 12 <;> by_cases h16 : i = 16 <;> simp [h12, h16] <;> omega

/-- the thirty-one digits other than the version digit, in order -/
theorem digits_held : (List.range digits).filter (· ≠ versionAt) =
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] := by
  rw [digits_thirtytwo]; rfl

/-- the couplers at every width with a variant row: thirty full rows and the variant row along their bits, and the columns
between the thirty-one rows, two of them meeting the variant row -/
theorem couplers_formula (w : Nat) (h : gateway + 1 ≤ w) :
    couplers w = (digits - coins) * (w - 1) + (w - gateway - 1) + (digits - coins - coins) * w + coins * (w - gateway) := by
  have hh := holding_formula w h
  have hl := digits_held
  simp only [couplers, rowCouplers, columnCouplers, rows]
  rw [hh, hl, digits_thirtytwo, coins_two, gateway_two]
  rw [gateway_two] at h
  simp only [List.map_cons, List.map_nil, held, versionAt, variantAt, gateway_two]
  simp only [pairsMin, List.sum_cons, List.sum_nil]
  simp only [Nat.reduceEqDiff, ite_true, ite_false, Nat.min_self]
  clear hh hl
  rw [show min w (w - 2) = w - 2 by omega, show min (w - 2) w = w - 2 by omega]
  omega

/-- `k` addresses chained by their handles hold `k` times one address: the register has no width ceiling -/
theorem chains (k w : Nat) : (List.replicate k (effective w)).sum = k * effective w := by
  induction k with
  | zero => simp
  | succ k ih => simp [List.replicate_succ, ih, Nat.succ_mul, Nat.add_comm]

/-- the register holds more than any count `N`: enough coins, each an address at width `hexbit`, exceed it -/
theorem unbounded (N : Nat) : ∃ k, N < k * effective hexbit :=
  ⟨N + 1, by rw [show effective hexbit = 122 by decide]; omega⟩

end Qubit
