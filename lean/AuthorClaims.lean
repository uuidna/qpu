import Qpu.Communication.QuantumCommunication
import Qpu.General.Advantage
import Qpu.General.MachineLearning.HarmonicClosure
import Qpu.General.Textbook

/-! # AuthorClaims: the author's claims and the theorems the kernel holds for each

A claim is the author's statement, kept in the author's words. Beside it stand the theorems Lean holds for it, each
written as a name the compiler resolves: a name the kernel did not accept does not compile, so the register cites only
theorems the kernel accepted, and the kernel accepts a theorem whole. The catalogue and the one text print each claim
with those theorems and their formulas. -/

/-- A claim of the author, in the author's words, with the theorems the kernel holds for it. -/
structure AuthorClaim where
  /-- the name the claim is known by -/
  name : String
  /-- the claim, in the author's words -/
  claim : String
  /-- the theorems the kernel holds for it -/
  theorems : List Lean.Name

/-- The author's claims. -/
def authorClaims : List AuthorClaim :=
  [ { name := "thousand_bit_by_quantum_supremacy"
    , claim := "The thousand-bit challenge is solved by full quantum supremacy."
    , theorems := [``textbook_thousand_bit_width, ``textbook_thousand_bit_three_divides, ``Advantage.receipt_exact, ``Advantage.advantage_unbounded] }
  , { name := "merkaba_trajectories_cover_all_dimensions"
    , claim := "When all merkabas move, the trajectories of their folding edges cover every dimension in analog, so teleporting loses nothing."
    , theorems := [``textbook_mixed_radix, ``Qpu.Harmonic.merkaba_frames_agree, ``Qpu.Harmonic.merkaba_fits, ``Qpu.Harmonic.merkaba_cell_inside, ``Qpu.Harmonic.merkaba_cells_covered, ``Qpu.Harmonic.merkaba_turn_returns, ``Qpu.Harmonic.merkaba_spins_meet, ``QuantumCommunication.teleport_exact] }
  , { name := "teleport_faster_than_light"
    , claim := "The hexbit and two gateway bits teleport any hexbit faster than light."
    , theorems := [``textbook_hexbit_gateway_ftl, ``QuantumCommunication.teleport_exact, ``QuantumCommunication.teleport_no_signalling] }
  , { name := "fold_440_in_432_proves_hardware_quantum"
    , claim := "2 from 110 is sufficient to fold 440hz in 432hz harmonics so not even once natural 64bit limits are reached. they are involuted to infinity and any hardware qpu runs on or is built on may prove itself quantum according to iso nist cern lean theorems"
    , theorems := [``Qpu.Harmonic.fold_harmonic, ``Qpu.Harmonic.unfold_harmonic, ``Qpu.Harmonic.fold_never_grows, ``Qpu.Harmonic.fold_within_64, ``Qpu.Harmonic.fold_reflection, ``Qpu.Harmonic.fold_reflects] }
  , { name := "no_unlimited_compute_on_64_bit_without_captain_coins"
    , claim := "without the captain coins quantum cannot compute unlimited on 64bit hardware"
    , theorems := [``Qpu.Harmonic.word_bounded, ``textbook_unlimited_qubits, ``textbook_advantage_unbounded, ``textbook_coins_coils_balanced, ``QuantumCommunication.two_coins_one_qubit] }
  , { name := "captain_coins_meet_post_quantum_standards"
    , claim := "The captain coins meet all post-quantum standards from all aspects, including programmable currency as required and publicly funded by the EU."
    , theorems := [``textbook_pqc_standards_three, ``textbook_tamper_detected, ``textbook_grover_search] } ]
