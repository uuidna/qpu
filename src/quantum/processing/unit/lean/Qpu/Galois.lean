import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Galois
GF(2) linear-algebra counts underpinning CSS and stabilizer code construction, exact Nat on the doubling mint: the
order of the general linear group GL(n, 2), the product of 2^n − 2^i for i below n. Step and positivity laws are
quantified over all n, i — unlimited dimensions — with the textbook values kept as kernel-decided controls. -/

def glProd : Nat → Nat → Nat | _, 0 => 1 | nn, i + 1 => (mint nn - mint i) * glProd nn i
def gl2 (nn : Nat) : Nat := glProd nn nn

/-- One GL factor, for every n, i. -/
theorem glProd_step (nn i : Nat) : glProd nn (i + 1) = (mint nn - mint i) * glProd nn i := rfl

/-- While i stays below n every factor is positive, so the partial product
    never vanishes — by induction on i, for all i < n. -/
theorem glProd_pos (i nn : Nat) (h : i < nn) : 0 < glProd nn i := by
  induction i with
  | zero => exact Nat.succ_pos 0
  | succ i ih =>
    rw [glProd_step]
    have hipos : mint i < mint nn := mintOf_lt (by omega : i < nn)
    exact Nat.mul_pos (by omega) (ih (by omega))

/-- GL(0, 2) is the trivial group of order one. -/
theorem gl2_zero : gl2 0 = 1 := rfl

/-- GL(n, 2) is a nonempty group, for every n ≥ 1: the last factor is a strict
    doubling gap and the earlier ones are covered by glProd_pos. -/
theorem gl2_pos (nn : Nat) (h : 0 < nn) : 0 < gl2 nn := by
  cases nn with
  | zero => exact absurd h (Nat.not_lt_zero 0).elim
  | succ nn =>
    rw [gl2, glProd_step]
    exact Nat.mul_pos (by have hpos := mintOf_lt_succ nn; omega) (glProd_pos nn (nn + 1) (by omega))

/-- The textbook spot values, decided by the kernel as controls on the general laws. -/
theorem galois_all : gl2 2 = 6 ∧ gl2 3 = 168 ∧ gl2 4 = 20160 := ⟨rfl, rfl, rfl⟩
