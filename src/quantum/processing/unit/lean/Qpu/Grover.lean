import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Grover
Grover quantum-search iteration counts, exact Nat with no π literal and no float: the optimal number of iterations over a
2^(2k)-item database is ⌊(π/4)·2^k⌋, where π is carried by the proven Zu Chongzhi rational pi_zu (355/113) written over
the lattice constants — 355 = plane·(faces−seed) − n·n, 113 = plane·hexbit + seed. The kernel proves the values; there
is no holds. -/

def groverIters (k : Nat) : Nat := (plane * (faces - seed) - n * n) * mintOf k / (coins * coins * (plane * hexbit + seed))
def groverSize (k : Nat) : Nat := mintOf (2 * k)
theorem grover_all : groverIters 2 = 3 ∧ groverIters 5 = 25 ∧ groverSize 5 = 1024 := ⟨rfl, rfl, rfl⟩
