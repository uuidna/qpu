import Qpu.General.Mint
import Qpu.General.Lattice

/-! # Qpu.Application.Grover
Grover quantum-search iteration counts and database sizes for *unlimited* qubits:
every size statement is quantified over k; the closed values are kept as kernel-decided
controls. π is carried by the proven Zu Chongzhi rational pi_zu (355/113) written over
the lattice constants — 355 = plane·(faces−seed) − n·n, 113 = plane·hexbit + seed. -/

/-- `a / b` computes the result of dividing `a` by `b`.
The meaning of this notation is type-dependent.
* For most types like `Nat`, `Int`, `Rat`, `Real`, `a / 0` is defined to be `0`.
* For `Nat`, `a / b` rounds downwards.
* For `Int`, `a / b` rounds downwards if `b` is positive or upwards if `b` is negative.
  It is implemented as `Int.ediv`, the unique function satisfying
  `a % b + b * (a / b) = a` and `0 ≤ a % b < natAbs b` for `b ≠ 0`.
  Other rounding conventions are available using the functions
  `Int.fdiv` (floor rounding) and `Int.tdiv` (truncation rounding).
* For `Float`, `a / 0` follows the IEEE 754 semantics for division,
  usually resulting in `inf` or `nan`. 

Conventions for notations in identifiers:

 * The recommended spelling of `/` in identifiers is `div`.-/
def groverIters (k : Nat) : Nat := (plane * (faces - seed) - n * n) * mint k / (coins * coins * (plane * hexbit + seed))
/-- `a ^ b` computes `a` to the power of `b`.
The meaning of this notation is type-dependent. 

Conventions for notations in identifiers:

 * The recommended spelling of `^` in identifiers is `pow`.-/
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
