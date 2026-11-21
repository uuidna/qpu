import Qpu.Information.Qubit

/-! # Qpu.Processing.QuantumProcessor
---
component: quantum processor (ISO/IEC 4879:2024 3.4.8)
---
The processor's coupling graph at hexbit width: its sites are the qubits of `Qubit.rows hexbit`, a row per digit that holds qubits
and a column per qubit, and two sites are coupled when they are neighbours along a row or on the same bit of consecutive rows.
The graph is connected and every site has two to four couplers; its coupler count is `Qubit.couplers_formula` at that width. -/

namespace QuantumProcessor
open Qubit

/-- the qubits of row `r` at width `w` -/
def width (w r : Nat) : Nat := (rows w).getD r 0

/-- the sites at width `w`: (row, bit) for every qubit -/
def sites (w : Nat) : List (Nat × Nat) :=
  (List.range (rows w).length).flatMap fun r => (List.range (width w r)).map fun c => (r, c)

/-- two sites are coupled when they are neighbours along a row or on the same bit of consecutive rows -/
def coupled (a b : Nat × Nat) : Bool :=
  (a.1 == b.1 && (a.2 + 1 == b.2 || b.2 + 1 == a.2)) || (a.2 == b.2 && (a.1 + 1 == b.1 || b.1 + 1 == a.1))

/-- the sites coupled to `x` -/
def degree (w : Nat) (x : Nat × Nat) : Nat := ((sites w).filter (coupled x)).length

/-- one step of reach: every site already reached, or coupled to one -/
def step (w : Nat) (s : List (Nat × Nat)) : List (Nat × Nat) :=
  (sites w).filter fun x => s.contains x || s.any (coupled x)

/-- the sites reached from (0, 0) in `k` steps -/
def reach (w : Nat) : Nat → List (Nat × Nat)
  | 0 => [(0, 0)]
  | k + 1 => step w (reach w k)

/-- the register's grid has `effective hexbit` sites -/
theorem sites_count : (sites hexbit).length = effective hexbit := by decide +kernel

/-- every site of the register's grid is reached from (0, 0): the coupling graph is connected -/
theorem connected : ∀ x ∈ sites hexbit, x ∈ reach hexbit ((rows hexbit).length + 4) := by
  have h : (sites hexbit).all (fun x => (reach hexbit ((rows hexbit).length + 4)).contains x) = true := by
    decide +kernel
  simpa [List.all_eq_true] using h

/-- every site has at least two and at most four couplers -/
theorem degree_bounds : ∀ x ∈ sites hexbit, 2 ≤ degree hexbit x ∧ degree hexbit x ≤ 4 := by
  have h : (sites hexbit).all (fun x => decide (2 ≤ degree hexbit x) && decide (degree hexbit x ≤ 4)) = true := by
    decide +kernel
  simpa [List.all_eq_true] using h

end QuantumProcessor
