import Qpu.General.Mint
import Qpu.General.Lattice

/-! # Qpu.Application.Grover
Grover quantum-search iteration counts and database sizes for *unlimited* qubits:
every size statement is quantified over k; the closed values are kept as kernel-decided
controls. π is carried by the proven Zu Chongzhi rational pi_zu (355/113) written over
the lattice constants — 355 = plane·(faces−seed) − n·n, 113 = plane·hexbit + seed. -/

def groverIters (k : Nat) : Nat := (plane * (faces - seed) - n * n) * mint k / (coins * coins * (plane * hexbit + seed))
def groverSize (k : Nat) : Nat := mint (2 * k)

/-- Unlimited growth: the database for k+1 qubit pairs is exactly four times the
    k-pair one, for every k — no bound is hidden in a spot value. -/
theorem groverSize_growth (k : Nat) : groverSize (k + 1) = 4 * groverSize k := by
  rw [groverSize, groverSize, show 2 * (k + 1) = 2 * k + 2 from by omega, mintOf_add]
  rw [show mint 2 = 4 from rfl, Nat.mul_comm]

/-- For every k the database is nonempty: there is always something to search. -/
theorem groverSize_pos (k : Nat) : 0 < groverSize k := mintOf_pos (2 * k)

/-- Growth is strict at every size: adding a qubit pair strictly enlarges the database. -/
theorem groverSize_strict_growth (k : Nat) : groverSize k < groverSize (k + 1) :=
  mintOf_lt (by omega : 2 * k < 2 * (k + 1))

/-- The textbook spot values, decided by the kernel as controls on the growth theorems. -/
theorem grover_all : groverIters 2 = 3 ∧ groverIters 5 = 25 ∧ groverSize 5 = 1024 := ⟨rfl, rfl, rfl⟩
