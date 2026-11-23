import Lean
import Mathlib
import Qpu

/-! # Gaps

Lean finds the gaps of Mathlib this tree exposes, by its own library search (`exact?`). Each theorem the author
declared with at least one variable is split into its conjuncts, and each conjunct, with the theorem's hypotheses in
context, is put to `Lean.Meta.LibrarySearch.librarySearch` over all of Mathlib, imported whole. A conjunct is

* `library`: closed outright by a library theorem, no `Qpu` constant in the proof (the names are given);
* `decided`: the search left it, a procedure of the library (`omega`, `grind`, `positivity`, `gcongr`, `nlinarith`) closed it (named);
* `open`: the search and the decision procedures ended without closing it, a candidate gap of the library: no imported library theorem proves it
  in one step followed by `solve_by_elim`, which is the search's bound, not a proof that none exists;
* `undecided`: the search spent its budget, decided neither way;
* `own`: it speaks of this tree's own notions (named), which no library knows, so it is not searched: it becomes a
  question for the library once each notion is bound to one in `Qpu.General.Meaning`.

Closed instances (no variable) are not statements to give a library and are not searched.

`lake run gaps` runs it as shards in parallel and merges their rows into `.lake/build/gaps-index.ts`.

A verdict depends on its statement and on nothing else but the Mathlib searched, the budget and the procedures, which
the index's second line names. A rerun under the same three keeps each committed row whose statements are unchanged and
searches only the theorems that are new or changed, and it tries the procedures in the order of the conjuncts each
decided in the committed index, the most first. -/

open Lean Meta

def gapsOut : System.FilePath := ".lake" / "build" / "gaps-index.ts"

/-- The heartbeats one conjunct's search may spend before it is `undecided`. -/
def budget : Nat := 200000

/-- The procedures of the library a conjunct the search leaves is put to. -/
def procedures : List String := ["omega", "grind", "positivity", "gcongr", "nlinarith"]

def procedureSyntax : String → MetaM (TSyntax `tactic)
  | "omega" => `(tactic| omega)
  | "grind" => `(tactic| grind)
  | "positivity" => `(tactic| positivity)
  | "gcongr" => `(tactic| gcongr)
  | _ => `(tactic| nlinarith)

/-- The committed index, the run before this one. -/
def committed : System.FilePath := "src" / "quantum" / "processing" / "gaps-index.ts"

/-- The index's second line: the Mathlib revision the manifest pins, the budget and the procedures. -/
def searchedUnder : IO String := do
  let rev := match Json.parse (← IO.FS.readFile "lake-manifest.json") with
    | .ok j => match j.getObjValAs? (Array Json) "packages" with
      | .ok ps => (ps.toList.findSome? fun (p : Json) => match p.getObjValAs? String "name", p.getObjValAs? String "rev" with
          | .ok "mathlib", .ok r => some r
          | _, _ => none).getD ""
      | _ => ""
    | _ => ""
  return s!"// searched under: Mathlib {rev}, budget {budget}, procedures {", ".intercalate (procedures.mergeSort fun a b => decide (a ≤ b))}"

/-- The committed rows by theorem, when the committed index was searched under `under`, and the conjuncts each
    procedure decided there. -/
def committedRows (under : String) : IO (Std.HashMap String Json × Std.HashMap String Nat) := do
  if !(← committed.pathExists) then return ({}, {})
  let lines := (← IO.FS.readFile committed).splitOn "\n"
  let same := lines[1]? == some under
  let mut rows : Std.HashMap String Json := {}
  let mut decided : Std.HashMap String Nat := {}
  for line in lines do
    let row := if line.endsWith "}," then (line.dropEnd 1).toString else line
    if let .ok j := Json.parse row then
      if let .ok parts := j.getObjValAs? (Array Json) "parts" then
        for p in parts do
          if let .ok d := p.getObjValAs? String "decided" then decided := decided.insert d (decided.getD d 0 + 1)
      if same then if let .ok key := j.getObjValAs? String "key" then rows := rows.insert key j
  return (rows, decided)

def moduleOf (env : Environment) (n : Name) : Name :=
  match env.getModuleIdxFor? n with
  | some i => env.header.modules[i.toNat]!.module
  | none => .anonymous

/-- The logic every proof term is built of, never a library theorem a gap could be closed by. -/
def isMachineryName (n : Name) : Bool :=
  [`Eq, `Iff, `And, `Or, `Not, `Decidable, `Classical, `HEq, `True, `False, `Exists].any (·.isPrefixOf n)

/-- The conjuncts of a statement: a statement of `∧` is in the library exactly when each conjunct is. -/
partial def conjuncts (e : Expr) : List Expr :=
  match e.and? with
  | some (a, b) => conjuncts a ++ conjuncts b
  | none => [e]

/-- One conjunct put to the library search: the library theorem that closes it with no `Qpu` constant, and whether
    the search stayed within its budget. A candidate whose proof would use a `Qpu` constant is refused the moment it
    is applied, so the search stops at the first library proof, as `exact?` does. -/
def search (goalType : Expr) : MetaM (List Name × Bool) :=
  withTheReader Core.Context (fun c => { c with maxHeartbeats := budget * 1000 }) <| withCurrHeartbeats do
  let env ← getEnv
  let ours (e : Expr) := e.getUsedConstants.any fun c => (`Qpu).isPrefixOf (moduleOf env c)
  let g ← mkFreshExprMVar goalType
  let start ← IO.getNumHeartbeats
  let tactic := fun gs => do
    if ours (← instantiateMVars g) then throwError "a Qpu constant"
    LibrarySearch.solveByElim [] (maxDepth := 6) (exfalso := false) gs
  let res ← tryCatchRuntimeEx
    (some <$> LibrarySearch.librarySearch g.mvarId! tactic (allowFailure := fun _ => pure false))
    (fun _ => pure none)
  let spent := (← IO.getNumHeartbeats) - start
  let decided := res.isSome && spent < budget * 1000 * 9 / 10
  if let some none := res then
    let pf ← instantiateMVars g
    if !ours pf then
      let theorems := pf.getUsedConstants.toList.filter fun c =>
        !isMachineryName c && (match env.find? c with | some (.thmInfo _) => true | _ => false)
      return (theorems.take 3, true)
  return ([], decided)

/-- The library's decision procedures, tried on a conjunct the search leaves open: one that closes it decides it, so
    it is no gap. Each runs on the same budget as the search. -/
def decideBy (order : List String) (goalType : Expr) : MetaM (Option String) := do
  for name in order do
    let tactic ← procedureSyntax name
    let closed ← withTheReader Core.Context (fun c => { c with maxHeartbeats := budget * 1000 }) <| withCurrHeartbeats do
      let saved ← saveState
      let g ← mkFreshExprMVar goalType
      let closed ← tryCatchRuntimeEx (do let (rest, _) ← Elab.runTactic g.mvarId! tactic; pure rest.isEmpty) (fun _ => pure false)
      saved.restore
      pure closed
    if closed then return some name
  return none

/-- The index from the rows of `m` shards, in the order the theorems are declared. -/
def writeIndex (rows : Array String) : IO Unit := do
  IO.FS.writeFile gapsOut <|
    "// GENERATED by `lake run gaps`: Lean's library search over every declared theorem with a variable (lean/tools/Gaps.lean).\n" ++
    (← searchedUnder) ++ "\n" ++
    "export const GAPS = [\n" ++ "\n".intercalate (rows.toList.map (s!"  {·},")) ++ "\n] as const\n"

set_option maxHeartbeats 0 in
#eval show MetaM Unit from do
  if let some m := (← IO.getEnv "GAPS_MERGE").bind (·.toNat?) then
    let declared := (← Qpu.declaredTheorems).map (·.1.toString)
    let mut byKey : Std.HashMap String String := {}
    for k in List.range m do
      for line in (← IO.FS.readFile (".lake" / "build" / s!"gaps-{k}-of-{m}.jsonl")).splitOn "\n" do
        if let .ok j := Json.parse line then
          if let .ok key := j.getObjValAs? String "key" then byKey := byKey.insert key line
    writeIndex (declared.filterMap byKey.get?)
    IO.println s!"{byKey.size} theorem(s) merged from {m} shard(s) into {gapsOut}"
    return
  let declared ← Qpu.declaredTheorems
  let (kept, decidedBefore) ← committedRows (← searchedUnder)
  let order := procedures.mergeSort fun a b => decidedBefore.getD a 0 ≥ decidedBefore.getD b 0
  let mut reused := 0
  let mut rows : Array String := #[]
  let mut library := 0
  let mut opened := 0
  let mut undecided := 0
  let mut owned := 0
  -- `GAPS_SHARD=k/m` searches every m-th theorem from the k-th, so m processes share the work; each appends its rows
  -- as they are decided, so a stopped run keeps what it found
  let (k, m) := match ((← IO.getEnv "GAPS_SHARD").getD "0/1").splitOn "/" with
    | [a, b] => (a.toNat!, max 1 b.toNat!) | _ => (0, 1)
  let shardOut : System.FilePath := ".lake" / "build" / s!"gaps-{k}-of-{m}.jsonl"
  let searched := (declared.toList.zipIdx.filter fun (_, i) => i % m == k).map (·.1)
  for (name, module) in searched do
    let info ← getConstInfo name
    if !info.type.isForall || name.toString.endsWith "_reflected" then continue
    let statements ← forallTelescope info.type fun _ body =>
      (conjuncts body).mapM fun c => return toString (← ppExpr c) |>.replace "\n" " "
    let before := (kept.get? name.toString).bind fun j => match j.getObjValAs? (Array Json) "parts" with
      | .ok ps => if ps.toList.map (fun p => (p.getObjValAs? String "statement").toOption.getD "") == statements then some ps else none
      | _ => none
    if before.isSome then reused := reused + 1
    let parts ← if let some ps := before then pure ps else forallTelescope info.type fun _ body => do
      (conjuncts body).toArray.mapM fun c => do
        let statement := toString (← ppExpr c) |>.replace "\n" " "
        -- the tree's own notions the conjunct speaks of: a library knows none of them, so such a conjunct is a fact of
        -- this tree's own notion, never searched; only a conjunct in the library's own terms is put to the search
        let env ← getEnv
        let own := (← instantiateMVars c).getUsedConstants.filter fun d => (`Qpu).isPrefixOf (moduleOf env d)
        if !own.isEmpty then return Json.mkObj [("statement", .str statement), ("own", .arr (own.map (.str ·.toString)))]
        let (names, decided) ← search c
        if !names.isEmpty then return Json.mkObj [("statement", .str statement), ("library", .arr (names.toArray.map (.str ·.toString)))]
        if let some procedure ← decideBy order c then return Json.mkObj [("statement", .str statement), ("decided", .str procedure)]
        return Json.mkObj [("statement", .str statement), (if decided then "open" else "undecided", .bool true)]
    for p in parts do
      if (p.getObjVal? "library").isOk || (p.getObjVal? "decided").isOk then library := library + 1
      else if (p.getObjVal? "open").isOk then opened := opened + 1
      else if (p.getObjVal? "undecided").isOk then undecided := undecided + 1
      else owned := owned + 1
    let row := (Json.mkObj [("key", .str name.toString), ("module", .str module.toString), ("parts", .arr parts)]).compress
    IO.FS.withFile shardOut .append (·.putStrLn row)
    rows := rows.push row
  if m == 1 then writeIndex rows
  IO.println s!"{rows.size} theorem(s): {library} conjunct(s) in the library or decided by it, {opened} open (gaps of the library), {undecided} undecided, {owned} of the tree's own notions; {reused} theorem(s) kept from the committed index, the rest searched"
