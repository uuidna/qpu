import Qpu.General.Mint
import Qpu.General.Lattice

/-! # Qpu.Processing.Anyon
Topological-quantum-computation fusion-space dimensions, exact Nat: the dimension for nn Fibonacci (τ) anyons is the
nnth Fibonacci number (seeded from the lattice seed), and the dimension for m Ising-anyon pairs is a power of two on
the doubling mint. Fibonacci step laws and Ising growth are quantified over all counts — unlimited anyons — with the
textbook values kept as kernel-decided controls. -/

def fibAux : Nat → Nat → Nat → Nat | 0, a, _ => a | k + 1, a, b => fibAux k b (a + b)
/-- Implementation of the Fibonacci sequence satisfying
`fib 0 = 0, fib 1 = 1, fib (n + 2) = fib n + fib (n + 1)`.

*Note:* We use a stream iterator for better performance when compared to the naive recursive
implementation.
-/
def fibFusion (nn : Nat) : Nat := fibAux nn (seed - seed) seed
/-- `a ^ b` computes `a` to the power of `b`.
The meaning of this notation is type-dependent. 

Conventions for notations in identifiers:

 * The recommended spelling of `^` in identifiers is `pow`.-/
def isingFusion (m : Nat) : Nat := mint (m - seed)

/-- One Fibonacci step, for every fuel, seed pair. -/
theorem fibAux_step (a b k : Nat) : fibAux (k + 1) a b = fibAux k b (a + b) := rfl

/-- Unfolded at the fusion seed: the next Fibonacci count starts from (seed, seed). -/
theorem fibFusion_seed_step (nn : Nat) : fibFusion (nn + 1) = fibAux nn seed seed := rfl

/-- Every Ising-anyon pair dimension is at least one state, for every m. -/
theorem isingFusion_pos (m : Nat) : 0 < isingFusion m := mintOf_pos _

/-- One more Ising pair doubles the fusion space, for every nonempty m — the
    doubling is exact, from mintOf_succ. -/
theorem isingFusion_succ (m : Nat) (h : 0 < m) : isingFusion (m + 1) = 2 * isingFusion m := by
  rw [isingFusion, isingFusion]
  rw [seed_eq, Nat.add_sub_cancel]
  have e : m = m - 1 + 1 := by omega
  rw [e, mintOf_succ, Nat.add_sub_cancel]
  omega

/-- Ising growth is strict at every nonempty count: a pair genuinely doubles. -/
theorem isingFusion_strict_growth (m : Nat) (h : 0 < m) : isingFusion m < isingFusion (m + 1) := by
  rw [isingFusion_succ m h]
  have hp := isingFusion_pos m
  omega

/-- The textbook spot values, decided by the kernel as controls on the general laws. -/
theorem anyon_all : fibFusion 5 = 5 ∧ fibFusion 10 = 55 ∧ isingFusion 3 = 4 := ⟨rfl, rfl, rfl⟩
