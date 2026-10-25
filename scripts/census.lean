import Lean
import Qpu
open Lean Meta in
#eval show MetaM Unit from do
  let env ← getEnv
  let mut perMod : Std.HashMap Name Nat := {}
  let mut thms : Array Name := #[]
  for (name, ci) in env.constants.map₁.toList do
    if let .thmInfo _ := ci then
      if let some idx := env.getModuleIdxFor? name then
        let m := env.header.moduleNames[idx.toNat]!
        if (`Qpu).isPrefixOf m then
          perMod := perMod.insert m (perMod.getD m 0 + 1)
          thms := thms.push name
  IO.println s!"theorems in Qpu modules (kernel-accepted): {thms.size}"
  for (m, n) in perMod.toList.toArray.qsort (fun a b => a.1.toString < b.1.toString) do
    IO.println s!"  {m}: {n}"
  let mut axs : Std.HashSet Name := {}
  let mut sorried := 0
  for t in thms do
    let as ← collectAxioms t
    for a in as do
      axs := axs.insert a
      if a == ``sorryAx then sorried := sorried + 1
  IO.println s!"axioms used by any theorem: {axs.toList}"
  IO.println s!"theorems depending on sorryAx: {sorried}"
