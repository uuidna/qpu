import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Annealing
Quantum-annealer topology qubit counts over the unit-cell size m, exact Nat grounded in the lattice constants: the
Chimera count (vertices qubits per cell) and the Pegasus count. The kernel proves the values; there is no holds. -/

def chimera (m : Nat) : Nat := vertices * m ^ 2
def pegasus (m : Nat) : Nat := vertices * n * m * (m - 1)
theorem annealing_all : chimera 16 = 2048 ∧ pegasus 16 = 5760 := ⟨rfl, rfl⟩
