import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Qaoa
QAOA circuit resource counts over p layers, exact Nat grounded in the lattice constants: the variational parameter
count (two per layer, from coins), the cost-layer ZZ gates over e edges, and the mixer X gates over q qubits. The kernel
proves the values; there is no holds. -/

def qaoaParams (p : Nat) : Nat := coins * p
def qaoaZz (p e : Nat) : Nat := p * e
def qaoaX (p q : Nat) : Nat := p * q
theorem qaoa_all : qaoaParams 3 = 6 ∧ qaoaZz 2 5 = 10 ∧ qaoaX 3 4 = 12 := ⟨rfl, rfl, rfl⟩
