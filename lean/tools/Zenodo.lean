import Lean
import Qpu
import Qpu.General.Prose.LeanToolsZenodo

/-! # Zenodo

Lean writes `.zenodo.json`, the metadata Zenodo reads from the tagged tree when it archives a GitHub release, so what
is deposited is what the build computes. What is achieved is counted here: the theorems the kernel holds and the axioms
they rest on, from the environment; the tools and their toolboxes, from the catalogue `scripts/site.ts` writes; the
conjuncts the library search closed and left open, from the gaps index. The identities and the funding open to the work
are the licence table's, the package's and the tenants': the author and the ORCID, the licence, the version, the
author's earlier record, the hosts, the donation address, the market a paid call is priced by, and the commercial
licence. Zenodo's grants field holds funder awards only, and none is named, so the funding is stated in the notes.

Run from the repository root: `lake env lean lean/tools/Zenodo.lean`.
The metadata is written to `.lake/build/zenodo.json`; `lake run index` installs it as `.zenodo.json` and
`lake run check` compares it. -/

open Lean Config

/-- The JSON a file of the tree holds between two markers, or the whole file when there are none. -/
def jsonIn (path : System.FilePath) (start stop : String := "") : IO Json := do
  let text ← IO.FS.readFile path
  let body := if start.isEmpty then text else ((((text.splitOn start)[1]?).getD "").splitOn stop)[0]!
  IO.ofExcept (Json.parse body)

/-- A sentence of the prose with its slots filled. -/
def fillSlots (sentence : String) (values : List String) : String :=
  values.zipIdx.foldl (fun s (v, i) => s.replace s!"⟦{i}⟧" v) sentence

def jsonField (j : Json) (path : List String) : Json := path.foldl (fun j k => (j.getObjVal? k).toOption.getD .null) j

def jsonText (j : Json) : String := match j with | .str s => s | j => j.compress

#eval show MetaM Unit from do
  let tables ← jsonIn ("src" / "quantum" / "processing" / "tables-index.ts") "export const TABLES = " " as const"
  let pkg ← jsonIn ("src" / "quantum" / "package.json")
  let catalogue ← jsonIn ("docs" / "public" / "mcp.json")
  let license := jsonField tables ["LICENSE"]
  -- what is achieved: the theorems and their axioms, the tools and their toolboxes, the library search
  let declared ← Qpu.declaredTheorems
  let mut axiomFree := 0
  for (name, _) in declared do
    if (← collectAxioms name).isEmpty then axiomFree := axiomFree + 1
  let tools := (jsonField catalogue ["tools"]).getArr?.toOption.getD #[]
  let toolboxes := (tools.filterMap fun t => match jsonField t ["_meta", "toolbox"] with | .str b => some b | _ => none).toList.eraseDups
  let parts := ((← IO.FS.readFile ("src" / "quantum" / "processing" / "gaps-index.ts")).splitOn "\n").filterMap fun line =>
    (Json.parse ((line.trimAscii.toString.dropEnd 1).toString)).toOption.bind fun j => (j.getObjValAs? (Array Json) "parts").toOption
  let conjuncts := parts.flatMap Array.toList
  let closed := conjuncts.filter fun p => (p.getObjVal? "library").isOk || (p.getObjVal? "decided").isOk
  let opened := conjuncts.filter fun p => (p.getObjVal? "open").isOk
  let undecided := conjuncts.filter fun p => (p.getObjVal? "undecided").isOk
  let searched := conjuncts.filter fun p => !(p.getObjVal? "own").isOk
  let hosts := tenants.map (·.1)
  -- the funding open to the work: a donation, a paid call priced by the cheapest real call, a commercial licence
  let calls := ((jsonField tables ["QUANTUM_MARKET"]).getArr?.toOption.getD #[]).filterMap fun d =>
    match jsonField d ["taskFeeUsd"], jsonField d ["perShotUsd"] with
    | .num a, .num b => some (a.toFloat + b.toFloat)
    | _, _ => none
  let price := calls.foldl min (calls[0]?.getD 0)
  let version := jsonText (jsonField pkg ["version"])
  let author := jsonText (jsonField license ["author"])
  let words := author.splitOn " "
  let orcid := jsonText (jsonField license ["orcid"])
  let earlier := ((jsonField tables ["PRECEDENCE"]).getArr?.toOption.getD #[]).toList.filter fun r =>
    !(jsonText (jsonField r ["title"])).startsWith (jsonText (jsonField license ["work"]))
  let homepage := s!"https://{hosts.headD ""}"
  let zenodo := Json.mkObj
    [ ("title", .str s!"{jsonText (jsonField license ["work"])}: {jsonText (jsonField pkg ["description"])}")
    , ("upload_type", "software"), ("access_right", "open"), ("version", .str version)
    , ("license", .str (jsonText (jsonField license ["spdx"])).toLower)
    , ("creators", Json.arr #[Json.mkObj [("name", .str s!"{words.getLast!}, {" ".intercalate words.dropLast}"), ("orcid", .str (orcid.splitOn "/").getLast!)]])
    , ("description", .str ("<p>" ++ fillSlots Prose.leanToolsZenodo_achieved
        [toString declared.size, toString axiomFree, toString tools.size, toString toolboxes.length, ", ".intercalate hosts,
         toString searched.length, toString closed.length, toString opened.length, toString undecided.length] ++ "</p>"))
    , ("keywords", Json.arr (toolboxes.map Json.str).toArray)
    , ("related_identifiers", Json.arr ((homepage :: hosts.tail.map (s!"https://{·}")).map (fun h => Json.mkObj [("identifier", .str h), ("relation", "isDocumentedBy"), ("resource_type", "publication-softwaredocumentation")]) ++
        earlier.map (fun r => Json.mkObj [("identifier", .str s!"https://doi.org/{jsonText (jsonField r ["doi"])}"), ("relation", "references"), ("resource_type", "publication")])).toArray)
    , ("notes", .str (fillSlots Prose.leanToolsZenodo_funding [jsonText (jsonField license ["donation"]), toString price, ((jsonText (jsonField license ["contact"])).splitOn " ").headD ""] ++ " " ++ fillSlots Prose.leanToolsZenodo_generated [version])) ]
  IO.FS.writeFile (".lake" / "build" / "zenodo.json") (zenodo.pretty ++ "\n")
  IO.println s!"zenodo.json: {declared.size} theorems, {tools.size} tools, version {version}"
