import Lean.Data.Json

/-! # Qpu.Claims.Claim

The Lean-only model for every claimable assertion. A claim is declared beside
the theorem that proves it; this module defines only the shared type and its
canonical JSON projection.
-/

/-- Every kind of claimable assertion Lean may certify. -/
inductive Qpu.ClaimKind where
  | patent
  | product
  | standard
  | security
  | performance
  | legal
  | research
  | operational

/-- The complete claimable context declared beside a Lean theorem. -/
structure Qpu.ClaimContext where
  title : String
  subject : String
  problem : String
  solution : String
  technicalEffect : String
  assertion : String
  evidence : List String
  dependsOn : List String
  kind : Qpu.ClaimKind
  hardware : Bool

/-- A Lean theorem and its claim context. -/
structure Qpu.Claim where
  theoremName : String
  source : String
  wave : String
  context : Qpu.ClaimContext

namespace Qpu

/-- The canonical name of a claim kind. -/
def ClaimKind.toString : ClaimKind → String
  | .patent => "patent"
  | .product => "product"
  | .standard => "standard"
  | .security => "security"
  | .performance => "performance"
  | .legal => "legal"
  | .research => "research"
  | .operational => "operational"

/-- The canonical JSON projection of a claim context. -/
def ClaimContext.toJson (context : ClaimContext) : Lean.Json :=
  Lean.Json.mkObj
    [ ("title", .str context.title)
    , ("subject", .str context.subject)
    , ("problem", .str context.problem)
    , ("solution", .str context.solution)
    , ("technicalEffect", .str context.technicalEffect)
    , ("assertion", .str context.assertion)
    , ("evidence", .arr (context.evidence.map Lean.Json.str).toArray)
    , ("dependsOn", .arr (context.dependsOn.map Lean.Json.str).toArray)
    , ("kind", .str context.kind.toString)
    , ("hardware", .bool context.hardware)
    ]

/-- The canonical JSON projection of a claim. -/
def Claim.toJson (claim : Claim) : Lean.Json :=
  Lean.Json.mkObj
    [ ("theorem", .str claim.theoremName)
    , ("source", .str claim.source)
    , ("wave", .str claim.wave)
    , ("context", claim.context.toJson)
    ]

/-- The author whose work every theorem of this tree is. -/
def author : String := "Tsvetan Rouschev"

/-- The author's ORCID iD. -/
def authorOrcid : String := "0009-0000-7312-9778"

/-- The concept DOI every release of the tree is a version of (ISO 26324). -/
def conceptDoi : String := "10.5281/zenodo.22700098"

/-- The licence the tree is published under. -/
def licence : String := "CC BY-NC-ND 4.0"

end Qpu
