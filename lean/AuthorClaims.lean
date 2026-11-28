import Qpu.Communication.QuantumCommunication
import Qpu.General.Advantage
import Qpu.General.Iso
import Qpu.General.MachineLearning.HarmonicClosure
import Qpu.General.Textbook
import Qpu.Processing.Verify.Uuid

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
    , theorems := [``textbook_pqc_standards_three, ``textbook_tamper_detected, ``textbook_grover_search] }
  , { name := "fold_128_bit_into_122_qubit_uuid"
    , claim := "Every 128-bit UUID (ISO/IEC 9834-8) folds into a 122-qubit quantum register (32 hexbits of 4 qubits less 4 version and 2 variant qubits), partitioning into 16 program qubits (65536 slots) and 106 message qubits with bijective band decoding and valid version/variant seals, formally verified in Lean 4 and disclosed under the author's legal rights (ISO/IEC/IEEE 15289:2019, ISO 56005:2020, ISO 27729:2012, ISO/IEC 5962:2021 CC-BY-NC-ND-4.0)."
    , theorems :=
        [ ``Qpu.Verify.Uuid.free_is_122
        , ``Qpu.Verify.Uuid.bands_cover_the_free_bits
        , ``Qpu.Verify.Uuid.program_capacity
        , ``Qpu.Verify.Uuid.decode_encode_exact
        , ``Qpu.Verify.Uuid.encode_lt_free_space
        , ``Qpu.Verify.Uuid.encode_injective
        , ``Qpu.Verify.Uuid.fold_128_to_122_fiber
        , ``Qpu.Verify.Uuid.card_128_eq_card_122_mul_fixed
        , ``Qpu.Verify.Uuid.card_free_eq_bands
        , ``Qpu.Verify.Uuid.card_nibbles_eq_128_bits
        , ``Qpu.Verify.Uuid.version_nibble_valid
        , ``Qpu.Verify.Uuid.variant_nibble_valid
        , ``Iso.isni_orcid_space_and_check
        , ``Iso.ip_disclosure_complete
        , ``Iso.spdx_expression_valid ] } ]
