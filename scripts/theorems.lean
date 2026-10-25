-- Every kernel-accepted theorem of the Qpu modules with its statement, as JSON lines: what the tree deposits with the unit.
import Lean
import Qpu
open Lean Meta in
#eval show MetaM Unit from do
  let env ← getEnv
  let mut rows : Array (Name × Name) := #[]
  for (name, ci) in env.constants.map₁.toList do
    if let .thmInfo _ := ci then
      if let some idx := env.getModuleIdxFor? name then
        let m := env.header.moduleNames[idx.toNat]!
        if (`Qpu).isPrefixOf m then rows := rows.push (name, m)
  let sorted := rows.qsort (fun a b => a.1.toString < b.1.toString)
  for (name, m) in sorted do
    let ci ← getConstInfo name
    let ty ← ppExpr ci.type
    let axs ← collectAxioms name
    let esc := fun (s : String) => s.replace "\\" "\\\\" |>.replace "\"" "\\\"" |>.replace "\n" " "
    IO.println s!"\{\"key\":\"{name}\",\"module\":\"{m}\",\"statement\":\"{esc (toString ty)}\",\"axioms\":[{",".intercalate (axs.toList.map (fun a => s!"\"{a}\""))}]}"
