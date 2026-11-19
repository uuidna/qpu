import Lake
open Lake DSL

package qpu where
  srcDir := "src/quantum/processing/unit/lean"

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
