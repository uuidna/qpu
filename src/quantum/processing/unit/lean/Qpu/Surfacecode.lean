import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Surfacecode
Rotated surface-code parameters over the code distance d, exact Nat grounded in the lattice constants: the physical
qubit count, the number of correctable errors, and the logical qubits per patch. The kernel proves the values; there is
no holds. -/

def surfacePhysical (d : Nat) : Nat := coins * d ^ 2 - coins * d + seed
def surfaceCorrectable (d : Nat) : Nat := (d - seed) / coins
def surfaceLogical : Nat := coins
theorem surfacecode_all : surfacePhysical 3 = 13 ∧ surfaceCorrectable 5 = 2 ∧ surfaceLogical = 2 := ⟨rfl, rfl, rfl⟩
