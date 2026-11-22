import Qpu.General.Mint
import Qpu.General.Lattice

/-! # Qpu.Processing.Stabilizer
Stabilizer-formalism counts for Clifford-circuit simulation, exact Nat built on the doubling mint: the number of
n-qubit stabilizer states (2^n times the product of 2^i+1 for i up to n), the order of the n-qubit Pauli group with
phases, and the order of a stabilizer subgroup. Step, positivity and growth laws are quantified over all n —
unlimited qubits — with the textbook values kept as kernel-decided controls. -/

def stabProd : Nat → Nat | 0 => 1 | k + 1 => (mint (k + 1) + 1) * stabProd k
def stabStates (nn : Nat) : Nat := mint nn * stabProd nn
def paulis (nn : Nat) : Nat := mint (2 * nn + 2)
def stabSubgroup (nn : Nat) : Nat := mint nn

/-- One stabilizer factor, for every k. -/
theorem stabProd_step (k : Nat) : stabProd (k + 1) = (mint (k + 1) + 1) * stabProd k := rfl

/-- The stabilizer product never vanishes, for every k. -/
theorem stabProd_pos (k : Nat) : 0 < stabProd k := by
  induction k with
  | zero => exact Nat.succ_pos 0
  | succ k ih =>
    rw [stabProd_step]
    exact Nat.mul_pos (Nat.succ_pos _) ih

/-- The stabilizer product never shrinks across a factor, for every k. -/
theorem stabProd_grows (k : Nat) : stabProd k ≤ stabProd (k + 1) := by
  rw [stabProd_step]
  exact Nat.le_mul_of_pos_left _ (Nat.succ_pos _)

/-- n qubits always have stabilizer states, for every n. -/
theorem stabStates_pos (nn : Nat) : 0 < stabStates nn :=
  Nat.mul_pos (mintOf_pos nn) (stabProd_pos nn)

/-- One more qubit quadruples the phased Pauli group, for every nn. -/
theorem paulis_growth (nn : Nat) : paulis (nn + 1) = 4 * paulis nn := by
  rw [paulis, paulis, show 2 * (nn + 1) + 2 = (2 * nn + 2) + 2 from by omega, mintOf_add]
  rw [show mint 2 = 4 from rfl, Nat.mul_comm]

/-- The phased Pauli group is nonempty, for every nn. -/
theorem paulis_pos (nn : Nat) : 0 < paulis nn := mintOf_pos _

/-- One more qubit doubles the stabilizer subgroup, for every nn. -/
theorem stabSubgroup_doubles (nn : Nat) : stabSubgroup (nn + 1) = 2 * stabSubgroup nn := by
  rw [stabSubgroup, stabSubgroup, mintOf_succ]
  omega

/-- The textbook spot values, decided by the kernel as controls on the general laws. -/
theorem stabilizer_all : stabStates 1 = 6 ∧ stabStates 2 = 60 ∧ stabStates 3 = 1080 ∧ paulis 1 = 16 := ⟨rfl, rfl, rfl, rfl⟩
