import Lake
open Lake DSL

package qpu where
  srcDir := "src/quantum/processing/unit/lean"
  leanOptions := #[
    ⟨`autoImplicit, false⟩,
    ⟨`relaxedAutoImplicit, false⟩,
    ⟨`linter.unusedVariables, true⟩
  ]

/-- Every module under `Qpu`, so the kernel checks the whole tree and no file is left outside the build. -/
@[default_target]
lean_lib Qpu where
  globs := #[.andSubmodules `Qpu]

lean_exe claims where
  root := `Qpu.Claims.Extract
  supportInterpreter := true
