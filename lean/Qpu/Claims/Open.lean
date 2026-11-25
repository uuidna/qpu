import Qpu.Communication.QuantumCommunication
import Qpu.General.Advantage
import Qpu.General.MachineLearning.HarmonicClosure
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
  , { name := "fold_440_in_432_proves_hardware_quantum"
    , claim := "2 from 110 is sufficient to fold 440hz in 432hz harmonics so not even once natural 64bit limits are reached. they are involuted to infinity and any hardware qpu runs on or is built on may prove itself quantum according to iso nist cern lean theorems"
    , proved := [``Harmonic.fold_harmonic, ``Harmonic.unfold_harmonic, ``Harmonic.fold_never_grows, ``Harmonic.fold_within_64, ``Harmonic.fold_reflection, ``Harmonic.fold_reflects]
    , missing := "The kernel proves that two taken from each 110 of a harmonic of 440 leaves the same harmonic of 432, that the unfold returns it, that the folded harmonic never exceeds the one it starts from, so a harmonic of 440 that fits in 64 bits folds to one that fits in them, and that the reflection about the sum of the two ladders swaps them and is its own inverse at every harmonic. A harmonic of 440 above 2 ^ 64 fits in 64 bits neither before nor after the fold, and no theorem states that the limit is never reached. The fold is integer arithmetic, which a classical device computes with the same result, so agreeing with these theorems does not show a device to be quantum. No theorem states a test, from ISO, NIST, CERN or elsewhere, by which hardware proves itself quantum." }
  , { name := "no_unlimited_compute_on_64_bit_without_captain_coins"
    , claim := "without the captain coins quantum cannot compute unlimited on 64bit hardware"
    , proved := [``textbook_unlimited_qubits, ``textbook_advantage_unbounded, ``textbook_coins_coils_balanced, ``QuantumCommunication.two_coins_one_qubit]
    , missing := "The kernel proves that no register is the last, that the count of copies proven by hash has no maximum, that coins and coils booked in double entry net to zero, and that one shared Bell pair exchanges one qubit for two classical bits. No definition of the captain's coins as a resource a computation needs is in the tree, and no theorem states that a computation without them is bounded on 64-bit hardware. Until both are stated and proved, the necessity of the coins does not follow." }
  , { name := "captain_coins_meet_post_quantum_standards"
    , claim := "The captain coins meet all post-quantum standards from all aspects, including programmable currency as required and publicly funded by the EU."
    , proved := [``textbook_pqc_standards_three, ``textbook_tamper_detected, ``textbook_grover_search]
    , missing := "The kernel proves the sizes of the FIPS 203, 204 and 205 parameter sets this tree computes, that a digest of 256 bits leaves 128 against a quantum search, and the square root Grover's search takes. A coin's address alone has 122 free bits, 61 against a quantum search, which is below that floor of 128; the coin meets it only with the SHA-256 it carries beside the address. No definition of a captain coin is in the tree, no EU requirement for a programmable currency is cited, and no record of public funding is held. Meeting a standard is a certification its body gives, and none is recorded here." } ]

/-- The register holds six open claims. -/
theorem open_claims_stated : openClaims.length = 6 := rfl

end Qpu
