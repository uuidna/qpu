import Lean
import Qpu
import Qpu.General.Meaning
import GateBaseline
/-! # Gate — every meaning comes from Mathlib

Built by default, so `lake build` — and with it every commit, push and CI run — fails on any violation of textbook
meaning. The rule, read from the kernel environment and never from prose written here:

* a `Qpu` definition is meaningful only when a `_eq_` theorem of `Qpu.General.Meaning` (or a submodule) proves it equal, for every
  argument, to a library notion (a declaration of Mathlib, Batteries, Std or Init), and both the definition and that
  binding carry the notion's own docstring, verbatim;
* a `Qpu` theorem is meaningful only when its proof applies a Mathlib theorem and it carries that theorem's own
  docstring, verbatim; a proof by decision procedure carries no textbook meaning.

The standing violations are named in `GateBaseline`, which this module writes when `MEANING_RATCHET=1` is set. The
gate fails on any violation not named there and on any named one that no longer stands: no violation can enter, and
every one that is fixed is struck from the list in the same commit. -/

open Lean Elab Command

/-- The module a declaration comes from, by name. -/
def moduleOf (env : Environment) (n : Name) : Name :=
  match env.getModuleIdxFor? n with
  | some i => env.header.moduleNames[i.toNat]!
  | none => .anonymous

def isQpu (env : Environment) (n : Name) : Bool := (`Qpu).isPrefixOf (moduleOf env n)

def isLibrary (env : Environment) (n : Name) : Bool :=
  let m := moduleOf env n
  (`Mathlib).isPrefixOf m || (`Batteries).isPrefixOf m || (`Std).isPrefixOf m || (`Init).isPrefixOf m

def isMathlib (env : Environment) (n : Name) : Bool := (`Mathlib).isPrefixOf (moduleOf env n)

/-- Compiler- and elaborator-generated names are not authored declarations: equation lemmas, structure and
    inductive machinery, projections, auxiliary proofs. -/
def isGenerated (env : Environment) (n : Name) : Bool :=
  let last := match n with | .str _ s => s | _ => ""
  n.isInternal || n.isImplementationDetail || isAuxRecursor env n || isNoConfusion env n || env.isProjectionFn n ||
  last.startsWith "eq_" || last.startsWith "_" || last == "ctorIdx" || last == "injEq" || last == "inj" ||
  last == "sizeOf_spec" || last == "noConfusionType" || last.endsWith "_reflected" ||
  ["_proof_", "_simp_", "match_", "_sunfold", "_unfold", "proof_", "_cstage", "_spec", "_rarg", "_lambda_",
    "_closed_", "_boxed"].any (n.toString.contains ·)

/-- A binding characterises a definition for every argument: its left side is the definition applied to variables. -/
def allVars (e : Expr) : Bool := e.getAppArgs.all (·.isBVar)

/-- The library notion a binding's right side names: its head constant, or, for a decision procedure, the
    proposition that `decide` decides. -/
def notionOf (rhs : Expr) : Option Name :=
  if rhs.isAppOfArity ``Decidable.decide 2 then rhs.getAppArgs[0]!.getAppFn.constName? else rhs.getAppFn.constName?

run_cmd do
  let env ← getEnv
  let doc (n : Name) : CommandElabM (Option String) := findDocString? env n
  let mut bound : Std.HashMap Name Name := {}
  let mut bindings : Std.HashSet Name := {}
  let mut violations : Array String := #[]
  for (n, ci) in env.constants.toList do
    if (`Qpu.General.Meaning).isPrefixOf (moduleOf env n) && !isGenerated env n && (n.toString.splitOn "_eq_").length > 1 then
      if let .thmInfo ti := ci then
        if let some (_, lhs, rhs) := ti.type.getForallBody.eq? then
          if let (some d, some m) := (lhs.getAppFn.constName?, notionOf rhs) then
            if isQpu env d && isLibrary env m && allVars lhs then
              bound := bound.insert d m
              bindings := bindings.insert n
              if (← doc n) != (← doc m) then
                violations := violations.push s!"binding {n}: prose is not the docstring of {m}"
  for (n, ci) in env.constants.toList do
    if isQpu env n && !isGenerated env n then
      match ci with
      | .defnInfo _ | .inductInfo _ =>
        match bound.get? n with
        | none => violations := violations.push s!"definition {n}: no Mathlib meaning (no _eq_ binding in Qpu.General.Meaning)"
        | some m =>
          if (← doc n) != (← doc m) then
            violations := violations.push s!"definition {n}: prose is not the docstring of {m}"
      | .thmInfo ti =>
        if !bindings.contains n then
          match ti.value.getAppFn.constName? with
          | some h =>
            if isMathlib env h then
              if (← doc n) != (← doc h) then
                violations := violations.push s!"theorem {n}: prose is not the docstring of {h}"
            else
              violations := violations.push s!"theorem {n}: meaning not from Mathlib (proof head {h})"
          | none => violations := violations.push s!"theorem {n}: meaning not from Mathlib (no applied theorem)"
      | _ => pure ()
  let current := violations.qsort (· < ·)
  if (← IO.getEnv "MEANING_RATCHET").isSome then
    -- the binding data for the mechanical prose placement: each bound definition and binding, with its notion's docstring
    let mut out : Array Json := #[]
    for (d, m) in bound.toList do
      out := out.push (Json.mkObj [("decl", toJson d.toString), ("module", toJson (moduleOf env d).toString), ("doc", toJson ((← doc m).getD ""))])
    for b in bindings.toList do
      if let some (.thmInfo ti) := env.find? b then
        if let some (_, _, rhs) := ti.type.getForallBody.eq? then
          if let some m := notionOf rhs then
            out := out.push (Json.mkObj [("decl", toJson b.toString), ("module", toJson (moduleOf env b).toString), ("doc", toJson ((← doc m).getD ""))])
    IO.FS.writeFile ".lake/build/meaning-bindings.json" (Json.arr out).pretty
    let body := ",\n".intercalate (current.toList.map (fun v => "  " ++ v.quote))
    IO.FS.writeFile "lean/GateBaseline.lean" <|
      "/-! # GateBaseline\nGENERATED by `MEANING_RATCHET=1 lake env lean lean/Gate.lean` — never edited by hand. " ++
      "Every standing violation of\ntextbook meaning, named. The gate fails on any violation not listed here, " ++
      "and on any listed one that no longer\nstands, so this list only shrinks. -/\n\n" ++
      s!"def meaningBaseline : Array String := #[\n{body}\n]\n"
    IO.println s!"GateBaseline written: {current.size} standing violation(s) named"
  else
    let base : Std.HashSet String := meaningBaseline.foldl (·.insert ·) {}
    let now : Std.HashSet String := current.foldl (·.insert ·) {}
    let entered := current.filter (!base.contains ·)
    let struck := meaningBaseline.filter (!now.contains ·)
    for v in entered.toList.take 20 do IO.println s!"  NEW violation: {v}"
    for v in struck.toList.take 20 do IO.println s!"  no longer stands (strike it from GateBaseline): {v}"
    unless entered.isEmpty && struck.isEmpty do
      throwError s!"Gate: {entered.size} new violation(s) of textbook meaning, {struck.size} fixed but still listed"
