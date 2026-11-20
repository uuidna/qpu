import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Annealing
Quantum-annealer topology qubit counts over the unit-cell size m, exact Nat grounded in the lattice constants: the
Chimera count (vertices qubits per cell) and the Pegasus count. Every law is quantified over m — unlimited cell
sizes — with the textbook values kept as kernel-decided controls. -/

def chimera (m : Nat) : Nat := vertices * m ^ 2
def pegasus (m : Nat) : Nat := vertices * n * m * (m - 1)

/-- One more cell row adds exactly vertices·(2m+1) qubits, for every m. -/
theorem chimera_succ (m : Nat) : chimera (m + 1) = chimera m + vertices * (2 * m + 1) := by
  rw [chimera, chimera]
  rw [show (m + 1) ^ 2 = m ^ 2 + (2 * m + 1) from by
    rw [Nat.pow_two, Nat.pow_two, Nat.add_mul m 1 (m + 1), Nat.mul_add m m 1]; omega]
  rw [Nat.mul_add]

/-- A nonempty topology has qubits, for every cell size m ≥ 1. -/
theorem chimera_pos (m : Nat) (h : 0 < m) : 0 < chimera m :=
  Nat.mul_pos (mintOf_pos n) (Nat.pow_pos h)

/-- Chimera counts never shrink with more cells, for all size pairs. -/
theorem chimera_monotone {m m' : Nat} (h : m ≤ m') : chimera m ≤ chimera m' := by
  rw [chimera, chimera]
  exact Nat.mul_le_mul (Nat.le_refl vertices) (Nat.pow_le_pow_left h 2)

/-- Pegasus counts never shrink with more cells: the m·(m−1) factor is
    monotone cell by cell, for all size pairs. -/
theorem pegasus_monotone {m m' : Nat} (h : m ≤ m') : pegasus m ≤ pegasus m' := by
  rw [pegasus, pegasus]
  rw [Nat.mul_assoc (vertices * n) m, Nat.mul_assoc (vertices * n) m']
  exact Nat.mul_le_mul (Nat.le_refl _) (Nat.mul_le_mul h (Nat.sub_le_sub_right h 1))

/-- Two or more cells always hold Pegasus qubits, uniformly in m. -/
theorem pegasus_pos (m : Nat) (h : 1 < m) : 0 < pegasus m := by
  rw [pegasus]
  have hm : 0 < m := by omega
  have hms : 0 < m - 1 := by omega
  exact Nat.mul_pos (Nat.mul_pos (Nat.mul_pos (mintOf_pos n) (by rw [n_eq]; exact Nat.succ_pos 2 : 0 < n)) hm) hms

/-- The textbook spot values, decided by the kernel as controls on the general laws. -/
theorem annealing_all : chimera 16 = 2048 ∧ pegasus 16 = 5760 := ⟨rfl, rfl⟩
