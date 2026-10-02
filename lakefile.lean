import Lake
open Lake DSL

package qpu where
  srcDir := "src/quantum/processing/unit/lean"

@[default_target]
lean_lib Qpu
