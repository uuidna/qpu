import Lean
import Qpu
import Qpu.Claims.Extract
import Qpu.General.Prose
import AuthorClaims

/-! # Catalogue

Lean writes the catalogue of claims. Every theorem the kernel accepted is a product, and every product is claimed:
by the claim context declared beside it when there is one, and otherwise as the author's own statement, by name and
as stated. The catalogue is derived from the environment, so no product can be left without a claim: a theorem that
exists is listed, and a theorem that is listed is claimed.

Run from the repository root: `lake env lean lean/tools/Catalogue.lean`.
The catalogue is written to `.lake/build/CATALOGUE.md`; `lake run index` installs it as `src/quantum/CATALOGUE.md`,
which the site and each release carry, and `lake run check` compares it. -/

open Lean Meta

/-- Where the rendered catalogue is written. -/
def catalogueOut : System.FilePath := ".lake" / "build" / "CATALOGUE.md"

/-- The examples a theorem's inline doc names. -/
def examplesOf (doc : String) : List String :=
  match doc.splitOn "(examples: " with
  | _ :: rest@(_ :: _) =>
    let named := (rest.getLast!.splitOn ")").head!
    if named == "none yet" then [] else named.splitOn ", "
  | _ => []

#eval show MetaM Unit from do
  let env ← getEnv
  let declared ← Qpu.declaredTheorems
  let claims := Qpu.Claims.Extract.claims
  let modules := (env.header.moduleNames.filter fun m => (`Qpu).isPrefixOf m && m != `Qpu).qsort (fun a b => a.toString < b.toString)
  let mut body : Array String := #[]
  let mut products := 0
  let mut byContext := 0
  let mut variants := 0
  for module in modules do
    -- a product is a theorem the author declared: Lean decides, by the place the theorem has in a source
    let names := (declared.filter fun (_, from_) => from_ == module).map (·.1)
    if names.isEmpty then continue
    body := body.push s!"## {module}" |>.push ""
    for name in names do
      let info ← getConstInfo name
      let statement ← ppExpr info.type
      let examples := examplesOf ((← findDocString? env name).getD "")
      let context := claims.find? fun claim => claim.theoremName == name.toString || claim.context.evidence.contains name.toString
      let claim := match context with
        | some c => s!"Claimed under the declared {c.context.kind.toString} claim \"{c.context.title}\"."
        | none => s!"Claimed by {Qpu.author} as the author's own statement, by this name and as stated."
      products := products + 1
      variants := variants + examples.length
      if context.isSome then byContext := byContext + 1
      body := body.push s!"### `{name}`" |>.push ""
      body := body.push (claim ++ (if examples.isEmpty then "" else s!" Variants: {", ".intercalate examples}.")) |>.push ""
      body := body.push "```lean" |>.push (toString statement) |>.push "```" |>.push ""
  -- the other perspective: a name a sentence cites that awaits its theorem. It is listed after the products, so every
  -- name Lean is asked for is exposed whichever side it is seen from.
  let mut open_ : Array (String × String) := #[]
  for (name, info) in env.constants.map₁.toList do
    if let .str (.str .anonymous "Prose") key := name then
      if let .defnInfo defn := info then
        if let .lit (.strVal text) := defn.value then
          let words := text.split (fun c => !(c.isAlphanum || c == '_')) |>.toList.map (·.toString)
          for word in words do
            -- a theorem's name is lower case; `relation_N` and the like are a pattern, not a name
            if (word.startsWith "textbook_" || word.startsWith "relation_") && !word.endsWith "_" && word.all (fun c => c.isLower || c.isDigit || c == '_') && !env.contains (Name.mkSimple word) then
              if !open_.contains (word, key) then open_ := open_.push (word, key)
  let named := (open_.map (·.1)).toList.eraseDups
  let sortedNamed := named.toArray.qsort (· < ·)
  let openLines : List String :=
    [ "## Names cited by sentences", ""
    , s!"{sortedNamed.size} name(s) cited by a sentence of the tree await a theorem. Every other name a sentence cites is a product above.", "" ]
    ++ sortedNamed.toList.flatMap (fun word =>
      let by_ := ((open_.filter (·.1 == word)).map (·.2)).qsort (· < ·)
      [ s!"### `{word}` (awaited)", "", s!"Named by {", ".intercalate (by_.toList.map fun key => s!"`Prose.{key}`")}.", "" ])
  -- the standards: every standard the tree names and every term of the vocabulary standard, each with its witness
  let witnessLine (name : Name) : MetaM (List String) := do
    let statement ← ppExpr (← getConstInfo name).type
    return [ s!"Witness: `{name}`.", "", "```lean", toString statement, "```", "" ]
  let mut standardLines : List String := [ "## Standards", "" ]
  let mut openStandards := 0
  for s in Iso.standards do
    standardLines := standardLines ++ [ s!"### {s.reference}", "" ]
    match s.witness with
    | some name => standardLines := standardLines ++ (← witnessLine name)
    | none =>
      openStandards := openStandards + 1
      standardLines := standardLines ++ [ "Named by the tree.", "" ]
  let mut clauseLines : List String := [ s!"## Terms of {Iso.vocabulary}", "" ]
  for c in Iso.clauses do
    clauseLines := clauseLines ++ [ s!"### {c.number} {c.name}", "" ] ++ (← witnessLine c.witness)
  -- the author's claims: each in the author's words, with the theorems the kernel holds for it
  let mut claimLines : List String := [ "## The author's claims", "", s!"{authorClaims.length} claim(s) of the author, each in the author's words with the theorems the kernel holds for it. Each of those theorems is a product above, with its statement.", "" ]
  for c in authorClaims do
    for name in c.theorems do
      unless declared.any (·.1 == name) do
        throwError "{name} is cited by the claim {c.name} and is not a theorem the author declared"
    claimLines := claimLines ++ [ s!"### `{c.name}`", "", c.claim, "", "Theorems: " ++ ", ".intercalate (c.theorems.map fun n => s!"`{n}`") ++ ".", "" ]
  let head :=
    [ "<!--", "// GENERATED by lake run index from the Lean environment. Do not edit: Lean is the author.", "-->"
    , ""
    , "# Catalogue of claims"
    , ""
    , "| document | value |"
    , "| --- | --- |"
    , "| standard | ISO/IEC/IEEE 15289:2019 |"
    , "| disclosure | ISO 56005:2020 |"
    , s!"| author | {Qpu.author} |"
    , s!"| orcid | https://orcid.org/{Qpu.authorOrcid} |"
    , s!"| licence | CC-BY-NC-ND-4.0 |"
    , s!"| conceptDoi | {Qpu.conceptDoi} |"
    , "| language | en |"
    , s!"| products | {products} |"
    , s!"| standards | {Iso.standards.length} ({Iso.standards.length - openStandards} witnessed) |"
    , s!"| vocabulary | {Iso.vocabulary} ({Iso.clauses.length}/{Iso.clauses.length}) |"
    , ""
    , s!"Author: {Qpu.author} (ORCID {Qpu.authorOrcid}). Licence: {Qpu.licence}. Concept DOI: {Qpu.conceptDoi}."
    , ""
    , s!"Every theorem the Lean kernel accepted is a product of this catalogue, and every product is claimed: {products} products, {byContext} under a declared claim context and {products - byContext} as the author's own statement, with {variants} variants (the examples a theorem names). {sortedNamed.size} name(s) cited by a sentence await a theorem, and the author's {authorClaims.length} claims in the author's own words are listed at the end with their theorems."
    , ""
    , s!"The catalogue covers {Iso.standards.length} standards, {Iso.standards.length - openStandards} with a theorem that states a fact the standard fixes, and each of the {Iso.clauses.length} terms of {Iso.vocabulary}, every one with a theorem."
    , ""
    , "This catalogue records authorship and the date of each release. It is a publication, not a patent application: publishing a statement discloses it, and what is filed as a patent, and when, is for a patent attorney to decide before it is published."
    , "" ]
  IO.FS.createDirAll (".lake" / "build")
  IO.FS.writeFile catalogueOut ("\n".intercalate (head ++ standardLines ++ clauseLines ++ body.toList ++ openLines ++ claimLines))
  IO.println s!"wrote {products} claimed product(s), {byContext} under a declared context, {variants} variant(s), {sortedNamed.size} name(s) awaiting a theorem to {catalogueOut}"
