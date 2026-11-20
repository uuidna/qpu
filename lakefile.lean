import Lake
open Lake DSL

package qpu where
  srcDir := "src/quantum/processing/unit/lean"
  leanOptions := #[
    ⟨`autoImplicit, false⟩,
    ⟨`relaxedAutoImplicit, false⟩,
    ⟨`linter.unusedVariables, true⟩
  ]

/-- Mathlib names the notions: `Qpu.Meaning` proves each definition of this tree equal to the Mathlib notion it is. -/
require mathlib from git
  "https://github.com/leanprover-community/mathlib4" @ "v4.33.0"

/-- Every module under `Qpu`, so the kernel checks the whole tree and no file is left outside the build. -/
@[default_target]
lean_lib Qpu where
  globs := #[.andSubmodules `Qpu]

lean_exe claims where
  root := `Qpu.Claims.Extract
  supportInterpreter := true
