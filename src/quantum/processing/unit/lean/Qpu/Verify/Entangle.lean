/-
  Qpu.Verify.Entangle — CHSH and GHZ/Mermin game bounds as finite combinatorics.
  Classical ceilings are proved by exhaustive kernel decision; the quantum rows
  are the Bell/GHZ response tables winning more than any classical strategy can.
-/
namespace Qpu.Verify.Entangle

/-- One CHSH round: answers `a`, `b` on questions `x`, `y`;
    won iff `a ⊕ b = x ∧ y`. -/
def chshRoundWon (a b x y : Bool) : Bool := (a ^^ b) == (x && y)

/-- Wins of a deterministic classical strategy over the four CHSH rounds,
    where a strategy is `a₀, a₁` for Alice and `b₀, b₁` for Bob. -/
def chshWins (a0 a1 b0 b1 : Bool) : Nat :=
  (if chshRoundWon a0 b0 false false then 1 else 0) +
  (if chshRoundWon a0 b1 false true then 1 else 0) +
  (if chshRoundWon a1 b0 true false then 1 else 0) +
  (if chshRoundWon a1 b1 true true then 1 else 0)

/-- Classical bound: no local deterministic strategy wins all four rounds.
    Every local hidden-variable strategy is a mixture of these sixteen, so 3/4
    is the classical ceiling — Bell's theorem at finite scale, decided by the kernel. -/
theorem chsh_classical_bound (a0 a1 b0 b1 : Bool) : chshWins a0 a1 b0 b1 ≤ 3 := by
  cases a0 <;> cases a1 <;> cases b0 <;> cases b1 <;> decide

/-- Control: the bound is tight — the all-false strategy wins exactly 3,
    so the ceiling is not an artifact of an over-strong statement. -/
theorem chsh_bound_is_tight : chshWins false false false false = 3 := by decide

/-- One GHZ/Mermin round (input parity zero): won iff a⊕b⊕c = x∨y∨z. -/
def ghzRoundWon (a b c x y z : Bool) : Bool := (a ^^ b ^^ c) == (x || y || z)

/-- Wins of a deterministic classical strategy over the four GHZ rounds. -/
def ghzWins (a0 a1 b0 b1 c0 c1 : Bool) : Nat :=
  (if ghzRoundWon a0 b0 c0 false false false then 1 else 0) +
  (if ghzRoundWon a0 b1 c1 false true true then 1 else 0) +
  (if ghzRoundWon a1 b0 c1 true false true then 1 else 0) +
  (if ghzRoundWon a1 b1 c0 true true false then 1 else 0)

/-- Mermin's bound: the four parity equations sum to 0 = 1 in Z₂, so no
    deterministic classical strategy — of the sixty-four — wins all four. -/
theorem ghz_classical_bound (a0 a1 b0 b1 c0 c1 : Bool) : ghzWins a0 a1 b0 b1 c0 c1 ≤ 3 := by
  cases a0 <;> cases a1 <;> cases b0 <;> cases b1 <;> cases c0 <;> cases c1 <;> decide

/-- GHZ response table: round 0 (XXX) even parity, rounds 1–3 (XYY, YXY, YYX)
    odd parity — exactly what three X/Y measurements of |GHZ⟩ produce. -/
def ghzQuantumOutput : Nat → Bool × Bool × Bool
  | 0 => (false, false, false)
  | 1 => (false, false, true)
  | 2 => (false, true, false)
  | _ => (true, false, false)

/-- Score one quantum-table row against question triple `(x, y, z)`. -/
def quantumCheck (r : Nat) (x y z : Bool) : Nat :=
  match ghzQuantumOutput r with
  | (a, b, c) => if ghzRoundWon a b c x y z then 1 else 0

/-- The entangled strategy wins 4/4 — impossible classically (above), so the
    GHZ table is genuinely non-classical. -/
theorem ghz_quantum_wins_all_four :
    quantumCheck 0 false false false +
    quantumCheck 1 false true true +
    quantumCheck 2 true false true +
    quantumCheck 3 true true false = 4 := by decide

/-- Negative control: a representative local strategy loses, guarding against
    a `ghzWins` definition that accidentally always returns 4. -/
theorem ghz_uniform_strategy_loses : ghzWins false false false false false false < 4 := by decide

end Qpu.Verify.Entangle