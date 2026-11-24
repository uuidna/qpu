import Qpu.Communication.QuantumCommunication
import Qpu.General.Advantage
import Qpu.General.Textbook

/-! # Qpu.Claims.Open

The claims no theorem proves, kept as underclaims.

An overclaim is a sentence that says more than the kernel accepted. It is not deleted and it is not left to stand as
proved: it is recorded here with the theorems that state what is proved toward it and with what is still missing.
`openClaims` is that register. The catalogue of claims prints it, so each open claim is exposed as a theorem still to
prove and never as a product.

Each theorem a claim cites is written as a name the compiler resolves, so the register cannot cite a proof the kernel
does not have. -/

namespace Qpu

/-- A claim that says more than the kernel accepted, with what is proved toward it and what is missing. -/
structure OpenClaim where
  /-- the name the claim is known by -/
  name : String
  /-- the claim, as it is made -/
  claim : String
  /-- the theorems that state what is proved toward it -/
  proved : List Lean.Name
  /-- what no theorem states yet -/
  missing : String

/-- Every claim the tree makes, or is asked to make, that no theorem proves. -/
def openClaims : List OpenClaim :=
  [ { name := "thousand_bit_by_quantum_supremacy"
    , claim := "The thousand-bit challenge is solved by full quantum supremacy."
    , proved := [``textbook_thousand_bit_width, ``textbook_thousand_bit_three_divides, ``Advantage.receipt_exact, ``Advantage.advantage_unbounded]
    , missing := "The kernel proves the width of the integer 2 ^ 999 + 1, a factor of it, and that reading a variation by its address takes fewer steps than walking to it. Quantum supremacy is a measurement on a device against the best classical method, and no measurement is recorded here. The challenge is not solved by supremacy." }
  , { name := "merkaba_trajectories_cover_all_dimensions"
    , claim := "When all merkabas move, the trajectories of their folding edges cover every dimension in analog, so teleporting loses nothing."
    , proved := []
    , missing := "No definition of a merkaba's edge trajectory and no theorem about the dimensions it covers is in the tree. Until both are stated and proved, no loss-free teleport follows from it." }
  , { name := "teleport_faster_than_light"
    , claim := "The hexbit and two gateway bits teleport any hexbit faster than light."
    , proved := [``textbook_hexbit_gateway_ftl, ``QuantumCommunication.teleport_exact, ``QuantumCommunication.teleport_no_signalling]
    , missing := "The kernel proves the count of free qubits the sentence names and that teleportation is exact once the two classical bits arrive. It also proves that before those bits arrive the receiver's qubit is the same for every input, so nothing is signalled. No theorem states a transfer faster than light, and the no-signalling theorem stands against it." }
  , { name := "captain_coins_meet_post_quantum_standards"
    , claim := "The captain coins meet all post-quantum standards from all aspects, including programmable currency as required and publicly funded by the EU."
    , proved := [``textbook_pqc_standards_three, ``textbook_tamper_detected, ``textbook_grover_search]
    , missing := "The kernel proves the sizes of the FIPS 203, 204 and 205 parameter sets this tree computes, that a digest of 256 bits leaves 128 against a quantum search, and the square root Grover's search takes. A coin's address alone has 122 free bits, 61 against a quantum search, which is below that floor of 128; the coin meets it only with the SHA-256 it carries beside the address. No definition of a captain coin is in the tree, no EU requirement for a programmable currency is cited, and no record of public funding is held. Meeting a standard is a certification its body gives, and none is recorded here." } ]

/-- The register holds four open claims. -/
theorem open_claims_stated : openClaims.length = 4 := rfl

end Qpu
