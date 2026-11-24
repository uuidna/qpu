import Lean

/-! # Qpu.Claims.Declared

What the author wrote, decided by Lean and by nothing else.

A theorem the author declared has a place in a source file; a lemma the compiler writes beside a definition or a
proof has none. `Qpu.declaredTheorems` is every theorem of the tree with a place in a source, and
`Qpu.compilerLemmas` counts the rest. Every index, catalogue and page reads the theorems from here, so no list of
name patterns stands between the Lean sources and what is published. -/

open Lean

namespace Qpu

/-- Whether a name is a theorem of this tree, and the module it is in. -/
def treeTheorem? (env : Environment) (name : Name) (info : ConstantInfo) : Option Name :=
  match info with
  | .thmInfo _ =>
    match env.getModuleIdxFor? name with
    | some idx =>
      let module := env.header.modules[idx.toNat]!.module
      if (`Qpu).isPrefixOf module then some module else none
    | none => none
  | _ => none

/-- Every theorem of the tree the author declared, with its module, in the order of the names: a theorem is declared
when Lean holds a place in a source file for it. -/
def declaredTheorems : CoreM (Array (Name × Name)) := do
  let env ← getEnv
  let mut found : Array (Name × Name) := #[]
  for (name, info) in env.constants.map₁.toList do
    if let some module := treeTheorem? env name info then
      if (← findDeclarationRanges? name).isSome then found := found.push (name, module)
  return found.qsort (fun a b => a.1.toString < b.1.toString)

/-- How many theorems of the tree the kernel holds, and how many of them the compiler wrote. -/
def theoremCounts : CoreM (Nat × Nat) := do
  let env ← getEnv
  let mut all := 0
  let mut written := 0
  for (name, info) in env.constants.map₁.toList do
    if (treeTheorem? env name info).isSome then
      all := all + 1
      if (← findDeclarationRanges? name).isNone then written := written + 1
  return (all, written)

end Qpu
