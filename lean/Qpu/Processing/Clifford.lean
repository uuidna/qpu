import Qpu.General.Mint
import Qpu.General.Lattice

/-! # Qpu.Processing.Clifford
Clifford-group and symplectic-group orders for gate synthesis and randomized benchmarking, exact Nat on the doubling
mint: the order of the symplectic group Sp(2n, 2) — 2^(n^2) times the product of 4^j − 1 for j up to n — and the
n-qubit Clifford group order. Step and positivity laws are quantified over all n, j — unlimited qubit counts — with
the textbook values kept as kernel-decided controls. -/

def sympProd : Nat → Nat | 0 => 1 | j + 1 => (mint (2 * (j + 1)) - 1) * sympProd j
def symplectic (nn : Nat) : Nat := mint (nn * nn) * sympProd nn
def cliffordOrder (nn : Nat) : Nat := mint (2 * nn) * symplectic nn

/-- One symplectic factor, for every j. -/
theorem sympProd_step (j : Nat) : sympProd (j + 1) = (mint (2 * (j + 1)) - 1) * sympProd j := rfl

/-- Each symplectic factor 4^j − 1 is at least 2 − 1, for every j. -/
theorem sympFactor_ge_two (j : Nat) : 2 ≤ mint (2 * (j + 1)) := by
  have h : mint 1 < mint (2 * (j + 1)) := mintOf_lt (by omega)
  rw [show mint 1 = 2 from rfl] at h
  exact Nat.le_of_lt h

/-- The symplectic product never vanishes, for every j. -/
theorem sympProd_pos (j : Nat) : 0 < sympProd j := by
  induction j with
  | zero => exact Nat.succ_pos 0
  | succ j ih =>
    rw [sympProd_step]
    exact Nat.mul_pos (by have h := sympFactor_ge_two j; omega) ih

/-- Sp(2n, 2) is a nonempty group, for every n. -/
theorem symplectic_pos (n : Nat) : 0 < symplectic n :=
  Nat.mul_pos (mintOf_pos _) (sympProd_pos n)

/-- The n-qubit Clifford group is nonempty, for every n. -/
theorem cliffordOrder_pos (n : Nat) : 0 < cliffordOrder n :=
  Nat.mul_pos (mintOf_pos _) (symplectic_pos n)

/-- The symplectic product never shrinks across a factor, for every j. -/
theorem sympProd_grows (j : Nat) : sympProd j ≤ sympProd (j + 1) := by
  rw [sympProd_step]
  exact Nat.le_mul_of_pos_left _ (by have h := sympFactor_ge_two j; omega)

/-- The textbook spot values, decided by the kernel as controls on the general laws. -/
theorem clifford_all : symplectic 1 = 6 ∧ symplectic 2 = 720 ∧ symplectic 3 = 1451520 ∧ cliffordOrder 2 = 11520 := ⟨rfl, rfl, rfl, rfl⟩
