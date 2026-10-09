import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Magic
Magic-state distillation parameters of the [[15, 1, 3]] Reed–Muller code (15-to-1), as exact Nat over the lattice
constants: the block length, the logical qubits, the code distance, and the cubic suppression factor. The kernel proves
the values from the proven constants; there is no holds. -/

def magicBlock : Nat := faces + seed
def magicLogical : Nat := seed
def magicDistance : Nat := n
def magicCubic : Nat := plane + rays
theorem magic_all : magicBlock = 15 ∧ magicLogical = 1 ∧ magicDistance = 3 ∧ magicCubic = 35 := ⟨rfl, rfl, rfl, rfl⟩
