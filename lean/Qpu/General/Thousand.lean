import Qpu.Processing.Annealing
import Qpu.Processing.Anyon
import Qpu.Processing.Clifford
import Qpu.Processing.Fusion
import Qpu.Processing.Qft
import Qpu.Processing.Stabilizer
import Qpu.Processing.Surfacecode
import Qpu.Application.Grover
import Qpu.Application.Qaoa
import Qpu.General.Combinatorics
import Qpu.General.Mint
import Qpu.Physics.EnergyGap

/-! # Qpu.General.Thousand

The meaning of a number, and every example of each family below the thousand-bit bound.

A family formula is one of the tree's own definitions that takes a size and gives a count: the QFT gates of `q`
qubits, the Chimera qubits of `m` cells, the Fibonacci fusion space of `n` anyons. Each never shrinks as its size
grows. The *meaning* of a number is every family formula that reaches it, with the size at which it does: `meaning n`
finds it for any `n`, by doubling the size until the formula passes `n` and then halving the interval. The examples of
a formula below the bound `2 ^ 1000` are its values at every size before it first reaches the bound, so their number
is that size, and `examplesBelow` computes it without listing them. Each example `x` reflects at the bound to
`2 ^ 1000 - x`, and the reflection is an involution.

`meaning_sound` is the theorem: whatever `meaning n` answers, that family's formula at that size is `n`. -/

namespace Thousand

/-- A family formula: its family, its name and the function from a size to a count. -/
structure Formula where
  /-- the Clay family the formula belongs to -/
  family : String
  /-- the name of the definition -/
  name : String
  /-- the definition itself -/
  f : Nat → Nat

/-- Every family formula of one size, family by family. Each never shrinks as the size grows, and each is unbounded. -/
def formulas : List Formula :=
  [ ⟨"Annealing", "chimera", chimera⟩, ⟨"Annealing", "pegasus", pegasus⟩
  , ⟨"Anyon", "fibFusion", fibFusion⟩, ⟨"Anyon", "isingFusion", isingFusion⟩
  , ⟨"Clifford", "symplectic", symplectic⟩, ⟨"Clifford", "cliffordOrder", cliffordOrder⟩
  , ⟨"Combinatorics", "factorial", factorial⟩
  , ⟨"Fusion", "fusionStates", fusionStates⟩
  , ⟨"Grover", "groverSize", groverSize⟩, ⟨"Grover", "groverIters", groverIters⟩
  , ⟨"Mint", "mint", mint⟩
  , ⟨"Physics", "levelGap", levelGap⟩, ⟨"Physics", "thermal", thermal⟩
  , ⟨"Qaoa", "qaoaParams", qaoaParams⟩
  , ⟨"Qft", "qftGates", qftGates⟩, ⟨"Qft", "qftSwaps", qftSwaps⟩, ⟨"Qft", "qftDepth", qftDepth⟩, ⟨"Qft", "qftStates", qftStates⟩
  , ⟨"Stabilizer", "stabStates", stabStates⟩, ⟨"Stabilizer", "paulis", paulis⟩
  , ⟨"Surfacecode", "surfacePhysical", surfacePhysical⟩, ⟨"Surfacecode", "surfaceCorrectable", surfaceCorrectable⟩ ]

/-- The thousand-bit bound: the first number that needs more than a thousand bits. -/
def bound : Nat := 2 ^ 1000

/-- Double the size until the formula reaches `n`: the sizes tried are 0, 1, 3, 7, … -/
def probe (f : Nat → Nat) (n : Nat) : Nat → Nat → Nat
  | 0, hi => hi
  | fuel + 1, hi => if f hi ≥ n then hi else probe f n fuel (2 * hi + 1)

/-- The least size in `[lo, hi]` at which the formula reaches `n`, by halving the interval. -/
def bisect (f : Nat → Nat) (n : Nat) : Nat → Nat → Nat → Nat
  | 0, lo, _ => lo
  | fuel + 1, lo, hi =>
    if lo ≥ hi then lo
    else if f ((lo + hi) / 2) ≥ n then bisect f n fuel lo ((lo + hi) / 2) else bisect f n fuel ((lo + hi) / 2 + 1) hi

/-- The least size at which a formula that never shrinks reaches `n`. -/
def least (f : Nat → Nat) (n : Nat) : Nat := bisect f n 1100 0 (probe f n 1100 0)

/-- The meaning of a number: every family formula that reaches it, with the size at which it does. -/
def meaning (n : Nat) : List (String × String × Nat) :=
  formulas.filterMap fun F => if F.f (least F.f n) = n then some (F.family, F.name, least F.f n) else none

/-- How many examples a formula has below the bound: the sizes before it first reaches `2 ^ 1000`. -/
def examplesBelow (F : Formula) : Nat := least F.f bound

/-- The reflection of an example at the bound: σ(x) = 2 ^ 1000 - x. -/
def reflect (x : Nat) : Nat := bound - x

/-- Whatever `meaning n` answers is true: that family's formula, at that size, is `n`. -/
theorem meaning_sound {n : Nat} {family name : String} {k : Nat} (h : (family, name, k) ∈ meaning n) :
    ∃ F, F ∈ formulas ∧ F.family = family ∧ F.name = name ∧ F.f k = n := by
  unfold meaning at h
  rcases List.mem_filterMap.mp h with ⟨F, hF, hk⟩
  refine ⟨F, hF, ?_⟩
  by_cases e : F.f (least F.f n) = n
  · rw [if_pos e] at hk
    injection hk with hk
    injection hk with h1 h2
    injection h2 with h2 h3
    subst h1 h2 h3
    exact ⟨rfl, rfl, e⟩
  · rw [if_neg e] at hk
    cases hk

/-- Reflecting an example twice gives it back: σ is an involution below the bound. -/
theorem reflect_reflect {x : Nat} (h : x ≤ bound) : reflect (reflect x) = x := by
  unfold reflect
  exact Nat.sub_sub_self h

/-- An example and its reflection fill the bound exactly. -/
theorem reflect_add {x : Nat} (h : x ≤ bound) : reflect x + x = bound := by
  unfold reflect
  exact Nat.sub_add_cancel h

end Thousand
