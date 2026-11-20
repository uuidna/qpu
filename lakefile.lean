import Lake
open Lake DSL

package qpu where
  srcDir := "src/quantum/processing/unit/lean"
  leanOptions := #[
    ⟨`linter.all, true⟩,
    ⟨`autoImplicit, false⟩,
    ⟨`relaxedAutoImplicit, false⟩,
    ⟨`linter.unusedVariables, true⟩,
    ⟨`linter.unusedTactic, true⟩
  ]

@[default_target]
lean_lib Qpu where
  roots := #[
    `Qpu.Verify.Correct,
    `Qpu.Verify.Cost,
    `Qpu.Verify.Entangle,
    `Qpu.Verify.Gate,
    `Qpu.Verify.Hexbit,
    `Qpu.Verify.Receipt,
    `Qpu.Verify.Stabilizer,
    `Qpu.Verify.Uuid
  ]
  leanOptions := #[
    ⟨`linter.all, true⟩,
    ⟨`autoImplicit, false⟩,
    ⟨`relaxedAutoImplicit, false⟩,
    ⟨`linter.unusedVariables, true⟩,
    ⟨`linter.unusedTactic, true⟩
  ]
