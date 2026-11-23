import Lean
import Qpu
import Qpu.General.Meaning
import GateBaseline
import Qpu.Claims.Novelty
/-! # Gate — every meaning comes from Mathlib

Built by default, so `lake build` — and with it every commit, push and CI run — fails on any violation of textbook
meaning. The rule, read from the kernel environment and never from prose written here:

* a `Qpu` definition is meaningful only when a `_eq_` theorem of `Qpu.General.Meaning` (or a submodule) proves it equal, for every
  argument, to a library notion (a declaration of Mathlib, Batteries, Std or Init), and both the definition and that
  binding carry the notion's own docstring, verbatim;
* a `Qpu` theorem is meaningful only when its proof applies a Mathlib theorem and it carries that theorem's own
  docstring, verbatim; a proof by decision procedure carries no textbook meaning;
* a composed proof is meaningful when every theorem it uses is a verified library theorem or a meaningful `Qpu`
  theorem, it reaches a Mathlib theorem or a named theorem of Lean core, Batteries or Std (Lean verified beyond Mathlib,
  never the logic and decision machinery), and its prose names every Mathlib and `Qpu` theorem it uses;
* a `@[novelty]` theorem, one with no Mathlib equivalent, is meaningful as its own statement: the kernel accepts it on
  the standard axioms alone, it uses only verified library theorems and meaningful `Qpu` theorems, it is not an
  instance of a Mathlib theorem, and its prose cites its prior-art dossier (`Prior art: <address>`). Every novelty is listed: what qpu can give to Mathlib.

The standing violations are named in `GateBaseline`, which this module writes when `MEANING_RATCHET=1` is set. The
gate fails on any violation not named there and on any named one that no longer stands: no violation can enter, and
every one that is fixed is struck from the list in the same commit. The list only shrinks: against the list as
committed (`MEANING_BASE` names the commit, `HEAD` by default) neither the ratchet nor a hand adds a violation to it. -/

open Lean Elab Command

/-- The module a declaration comes from, by name. -/
def moduleOf (env : Environment) (n : Name) : Name :=
  match env.getModuleIdxFor? n with
  | some i => env.header.modules[i.toNat]!.module
  | none => .anonymous

def isQpu (env : Environment) (n : Name) : Bool := (`Qpu).isPrefixOf (moduleOf env n)

def isLibrary (env : Environment) (n : Name) : Bool :=
  let m := moduleOf env n
  (`Mathlib).isPrefixOf m || (`Batteries).isPrefixOf m || (`Std).isPrefixOf m || (`Init).isPrefixOf m

def isMathlib (env : Environment) (n : Name) : Bool := (`Mathlib).isPrefixOf (moduleOf env n)

/-- The logic and decision machinery of the libraries: it checks a proof, it states no textbook meaning. -/
def isMachinery (n : Name) : Bool :=
  [`Eq, `Iff, `And, `Or, `Not, `Decidable, `Classical, `Lean, `HEq, `True, `False, `Exists, `Subtype].any (·.isPrefixOf n) ||
  [`absurd, `id, `of_decide_eq_true, `of_eq_true, `rfl, `congrArg, `congrFun, `congr, `cast, `trivial, `propext, `funext].contains n

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

/-- The theorem a proof applies: the head of its body under every binder, since a proof with arguments is a λ. -/
def proofHead : Expr → Option Name
  | .lam _ _ body _ => proofHead body
  | e => e.getAppFn.constName?

/-- The library notion a binding's right side names: its head constant, or, for a decision procedure, the
    proposition that `decide` decides. -/
def notionOf (rhs : Expr) : Option Name :=
  if rhs.isAppOfArity ``Decidable.decide 2 then rhs.getAppArgs[0]!.getAppFn.constName? else rhs.getAppFn.constName?

/-- The theorems a proof uses, looking through the compiler's auxiliary proofs (`_proof_`, `match_`, equation lemmas)
    of the tree, so a composed proof is judged by the theorems it really applies. -/
partial def theoremDeps (env : Environment) (roots : List Name) (visited : Std.HashSet Name := {})
    (acc : Array Name := #[]) : Array Name :=
  match roots with
  | [] => acc
  | c :: rest =>
    if visited.contains c then theoremDeps env rest visited acc else
    let visited := visited.insert c
    match env.find? c with
    | some (.thmInfo ti) =>
      if isQpu env c && isGenerated env c then theoremDeps env (ti.value.getUsedConstants.toList ++ rest) visited acc
      else theoremDeps env rest visited (acc.push c)
    | some (.defnInfo di) =>
      if isQpu env c && isGenerated env c then theoremDeps env (di.value.getUsedConstants.toList ++ rest) visited acc
      else theoremDeps env rest visited acc
    | _ => theoremDeps env rest visited acc

run_cmd do
  let env ← getEnv
  let doc (n : Name) : CommandElabM (Option String) := findDocString? env n
  let mut bound : Std.HashMap Name Name := {}
  let mut bindings : Std.HashSet Name := {}
  let mut violations : Array String := #[]
  let mut headed : Std.HashMap Name String := {}
  let mut clean : Std.HashSet Name := {}
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
          match proofHead ti.value with
          | some h =>
            if isMathlib env h then
              if (← doc n) != (← doc h) then
                headed := headed.insert n s!"theorem {n}: prose is not the docstring of {h}"
            else
              headed := headed.insert n s!"theorem {n}: meaning not from Mathlib (proof head {h})"
          | none => headed := headed.insert n s!"theorem {n}: meaning not from Mathlib (no applied theorem)"
          clean := if headed.contains n then clean else clean.insert n
      | _ => pure ()
  for b in bindings.toList do clean := clean.insert b
  -- A COMPOSED PROOF CARRIES MATHLIB MEANING TOO: a theorem the head rule refuses passes when every theorem its proof
  -- uses is a library theorem or a Qpu theorem that is itself clean, it reaches a Mathlib theorem or a named theorem of
  -- Lean core, Batteries or Std that is not machinery, and its prose names every Mathlib and Qpu theorem it uses. A
  -- NOVELTY passes as its own statement: standard axioms only, verified library and clean Qpu theorems only, and not a
  -- Mathlib theorem applied. Evaluated to a fixed point, so a chain passes link by link and a cycle never does.
  let mut novelties : Array Name := #[]
  let mut changed := true
  while changed do
    changed := false
    for (n, _) in headed.toList do
      if clean.contains n then continue
      let some (.thmInfo ti) := env.find? n | continue
      let deps := theoremDeps env ti.value.getUsedConstants.toList
      let named := deps.filter (fun d => isMathlib env d || isQpu env d)
      let prose := (← doc n).getD ""
      let named_ (d : Name) := (prose.splitOn d.toString).length > 1
      let reachesMathlib := deps.any (fun d => isMathlib env d || (isQpu env d && clean.contains d) || (isLibrary env d && !isMachinery d && named_ d))
      let allClean := deps.all (fun d => isLibrary env d || (isQpu env d && clean.contains d))
      if noveltyAttr.hasTag env n then
        let standard := (← collectAxioms n).all ([``propext, ``Classical.choice, ``Quot.sound].contains ·)
        -- an induction or recursion principle is a method of proof, not a statement the novelty would restate
        let method (h : Name) := match h with | .str _ s => (s.splitOn "induction").length > 1 || s.startsWith "rec" | _ => false
        let dossier := (prose.splitOn "Prior art: ").length > 1
        if standard && allClean && dossier && !(proofHead ti.value).any (fun h => isMathlib env h && !method h) then
          clean := clean.insert n
          novelties := novelties.push n
          changed := true
        continue
      if allClean && reachesMathlib && named.all named_ then
        clean := clean.insert n
        changed := true
  for (n, v) in headed.toList do
    if !clean.contains n then violations := violations.push v
  let current := violations.qsort (· < ·)
  -- THE LIST ONLY SHRINKS: a violation the committed list does not name cannot be listed, by the ratchet or by hand;
  -- it is bound to its library notion instead. Where git holds no such commit (an image built without its history)
  -- the comparison with the list below stands alone.
  let ref := (← IO.getEnv "MEANING_BASE").getD "HEAD"
  let committed ← match ← (IO.Process.output { cmd := "git", args := #["show", s!"{ref}:lean/GateBaseline.lean"] }).toBaseIO with
    | .ok o => pure (if o.exitCode == 0 then some o.stdout else none)
    | .error _ => pure none
  let added := match committed with
    | some listed => current.filter (fun (v : String) => (listed.splitOn v.quote).length == 1)
    | none => #[]
  for v in added.toList.take 20 do IO.println s!"  would ENTER the list: {v}"
  unless added.isEmpty do
    throwError s!"Gate: {added.size} violation(s) of textbook meaning the committed list ({ref}) does not name: the list only shrinks, so bind each to its library notion"
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
    IO.FS.writeFile ".lake/build/novelties.json" (Json.arr (novelties.qsort (·.toString < ·.toString) |>.map (toJson ·.toString))).pretty
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
