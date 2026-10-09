import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Anyon
Topological-quantum-computation fusion-space dimensions, exact Nat: the dimension for n Fibonacci (τ) anyons is the nth
Fibonacci number (seeded from the lattice seed), and the dimension for m Ising-anyon pairs is a power of two on the
doubling mintOf. The kernel proves the values; there is no holds. -/

def fibAux : Nat → Nat → Nat → Nat | 0, a, _ => a | k + 1, a, b => fibAux k b (a + b)
def fibFusion (nn : Nat) : Nat := fibAux nn (seed - seed) seed
def isingFusion (m : Nat) : Nat := mintOf (m - seed)
theorem anyon_all : fibFusion 5 = 5 ∧ fibFusion 10 = 55 ∧ isingFusion 3 = 4 := ⟨rfl, rfl, rfl⟩
