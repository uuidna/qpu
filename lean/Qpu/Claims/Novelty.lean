import Lean

/-! # Qpu.Claims.Novelty

A theorem with no Mathlib equivalent says so itself. `@[novelty]` marks a qpu theorem whose statement Mathlib does
not hold: its meaning is its own statement, accepted by the kernel on the standard axioms alone and cross-verified at
the levels its docstring names (the NIST and CERN scenarios among them), never an instance of a Mathlib theorem
renamed. A novelty is claimed only after deep prior-art research, and its docstring cites the dossier as
`Prior art: <address>`: the shape searches (Loogle, LeanSearch, the library sources, private declarations included),
the derivability attempts (`exact?`, `apply?`, short automation, the general or asymptotic library form it might
instantiate), the literature and the other provers, each with its result. A restatement, a corollary of three lines
or fewer, an instance of a general library theorem, or missing API (known, not public) is not a novelty. The meaning
gate lists every novelty, the theorems qpu can give to Mathlib. -/

open Lean

/-- Marks a theorem as a novelty: no Mathlib equivalent, its own statement its meaning. -/
initialize noveltyAttr : TagAttribute ← registerTagAttribute `novelty "a theorem with no Mathlib equivalent, a candidate for Mathlib"
