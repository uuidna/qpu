import Lean

/-! # Qpu.Claims.Novelty

A theorem with no Mathlib equivalent says so itself. `@[novelty]` marks a qpu theorem whose statement Mathlib does
not hold: its meaning is its own statement, accepted by the kernel on the standard axioms alone and cross-verified at
the levels its docstring names (the NIST and CERN scenarios among them), never an instance of a Mathlib theorem
renamed. The meaning gate lists every novelty, the theorems qpu can give to Mathlib. -/

open Lean

/-- Marks a theorem as a novelty: no Mathlib equivalent, its own statement its meaning. -/
initialize noveltyAttr : TagAttribute ← registerTagAttribute `novelty "a theorem with no Mathlib equivalent, a candidate for Mathlib"
