import Lean.Json

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
  theorem : String
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
  .obj
    [ ("title", .str context.title)
    , ("subject", .str context.subject)
    , ("problem", .str context.problem)
    , ("solution", .str context.solution)
    , ("technicalEffect", .str context.technicalEffect)
    , ("assertion", .str context.assertion)
    , ("evidence", .arr (context.evidence.map .str))
    , ("dependsOn", .arr (context.dependsOn.map .str))
    , ("kind", .str context.kind.toString)
    , ("hardware", .bool context.hardware)
    ]

/-- The canonical JSON projection of a claim. -/
def Claim.toJson (claim : Claim) : Lean.Json :=
  .obj
    [ ("theorem", .str claim.theorem)
    , ("source", .str claim.source)
    , ("wave", .str claim.wave)
    , ("context", claim.context.toJson)
    ]

end Qpu
