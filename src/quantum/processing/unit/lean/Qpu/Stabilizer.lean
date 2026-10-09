import Qpu.Mint

/-! # Qpu.Stabilizer
Stabilizer-formalism counts for Clifford-circuit simulation, exact Nat built on the doubling mintOf: the number of
n-qubit stabilizer states (2^n times the product of 2^i+1 for i up to n), the order of the n-qubit Pauli group with
phases, and the order of a stabilizer subgroup. The kernel proves the values; there is no holds. -/

def stabProd : Nat → Nat | 0 => 1 | k + 1 => (mintOf (k + 1) + 1) * stabProd k
def stabStates (nn : Nat) : Nat := mintOf nn * stabProd nn
def paulis (nn : Nat) : Nat := mintOf (2 * nn + 2)
def stabSubgroup (nn : Nat) : Nat := mintOf nn
theorem stabilizer_all : stabStates 1 = 6 ∧ stabStates 2 = 60 ∧ stabStates 3 = 1080 ∧ paulis 1 = 16 := ⟨rfl, rfl, rfl, rfl⟩
