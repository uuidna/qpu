import Lean.Json
import Qpu.Claims.Claim

import Qpu.Information.Qubit

open Lean

/-! # Qpu.Claims.Extract

The Lake executable that emits the canonical Lean claim manifest. It imports
modules that declare claims inline and serializes their `Claim` values; it
defines no claim content itself.
-/

namespace Qpu.Claims.Extract

/-- Every inline claim, in deterministic source order. Add an entry only after
declaring its `Claim` beside the Lean theorem that proves it. -/
def claims : List Claim :=
  [ Qubit.qubitLayoutClaim ]

/-- The canonical Lean claim manifest. -/
def manifest : Json :=
  .arr (claims.map Claim.toJson)

/-- The manifest output path, relative to the repository root. -/
def outputPath : System.FilePath := ".lake" / "build" / "claims.json"

/-- Write the canonical manifest. -/
def main : IO Unit := do
  IO.FS.createDirAll ".lake/build"
  IO.FS.writeFile outputPath manifest.compress
  IO.println s!"wrote {outputPath} with {claims.length} claims"

end Qpu.Claims.Extract

def main : IO Unit := Qpu.Claims.Extract.main
