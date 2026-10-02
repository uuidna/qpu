import Qpu.Mint
import Qpu.Shor
import Qpu.Lattice
import Qpu.Hybrid
import Qpu.Coil
import Qpu.Physics

/-! # Qpu.Clay
Discovered, not written (scripts/lean-clay.mjs): values the running system exhibits in each wing, each matched to the simplest expression over the formulas, and the values where families of formulas meet. clay_wings is their conjunction. -/

/-- hex digits in a UUID handle section (8) equals vertices. -/
theorem receipts_uuid_handle : vertices = 8 := rfl
/-- hex digits in each UUID program section (4) equals hexbit. -/
theorem receipts_uuid_program_section : hexbit = 4 := rfl
/-- hex digits in the UUID params section (12) equals n * hexbit. -/
theorem receipts_uuid_params : n * hexbit = 12 := rfl
/-- hex digits in a UUID (32) equals bits. -/
theorem receipts_uuid_digits : bits = 32 := rfl
/-- bits in a UUID (128) equals mintOf rays. -/
theorem receipts_uuid_bits : mintOf rays = 128 := rfl
/-- formula nibbles in a hex program (version and variant kept) (10) equals n + rays. -/
theorem receipts_hex_program_nibbles : n + rays = 10 := rfl
/-- tools the /mcp door lists (16) equals mintOf hexbit. -/
theorem agents_mcp_tools : mintOf hexbit = 16 := rfl
/-- values of one hex nibble (16) equals mintOf hexbit. -/
theorem agents_hex_alphabet : mintOf hexbit = 16 := rfl
/-- the modulus Shor factors (91) equals chooseOf faces coins. -/
theorem crypto_shor_modulus : chooseOf faces coins = 91 := rfl
/-- the first factor (7) equals rays. -/
theorem crypto_shor_factor_p : rays = 7 := rfl
/-- the second factor (13) equals faces - seed. -/
theorem crypto_shor_factor_q : faces - seed = 13 := rfl
/-- state dimension of the Shor register (512) equals mintOf (n * n). -/
theorem quantum_shor_dim : mintOf (n * n) = 512 := rfl
/-- qubits of the Shor register (9) equals n * n. -/
theorem quantum_shor_qubits : n * n = 9 := rfl
/-- the stylesheet frequency (432) equals (mintOf hexbit) * (plane - seed). -/
theorem presentation_stylesheet_hz : (mintOf hexbit) * (plane - seed) = 432 := rfl
/-- Payload plugins a combination draws from (11) equals n + vertices. -/
theorem cms_payload_plugins : n + vertices = 11 := rfl
/-- Next.js + Payload configurations on Workers (98304) equals (n + n) * (mintOf faces). -/
theorem cms_payload_combinations : (n + n) * (mintOf faces) = 98304 := rfl
/-- Hybrid, Lattice, Mint, Shor meet at 8. -/
theorem relation_8 : vertices = hybridSpeed ∧ vertices = mintOf n := ⟨rfl, rfl⟩
/-- Coil, Lattice meet at 14. -/
theorem relation_14 : faces = coil := rfl
/-- Mint, Shor meet at 16. -/
theorem relation_16 : mintOf hexbit = powMod coins rays plane ∧ mintOf hexbit = powMod coins hexbit bits := ⟨rfl, rfl⟩
/-- Mint, Shor meet at 21. -/
theorem relation_21 : chooseOf rays coins = powMod rays coins plane ∧ chooseOf rays coins = powMod rays vertices plane := ⟨rfl, rfl⟩
/-- Physics, Shor meet at 25. -/
theorem relation_25 : powMod n hexbit plane = powMod n faces bits ∧ powMod n hexbit plane = powMod n plane plane := ⟨rfl, rfl⟩
/-- Lattice, Mint meet at 28. -/
theorem relation_28 : plane = chooseOf vertices coins := rfl
/-- Lattice, Mint meet at 4294967296. -/
theorem relation_4294967296 : amplitudes = mintOf bits := rfl

/-- Every discovered relation at once: the wings and the formula families they share. -/
theorem clay_wings : vertices = 8 ∧ hexbit = 4 ∧ n * hexbit = 12 ∧ bits = 32 ∧ mintOf rays = 128 ∧ n + rays = 10 ∧ mintOf hexbit = 16 ∧ mintOf hexbit = 16 ∧ chooseOf faces coins = 91 ∧ rays = 7 ∧ faces - seed = 13 ∧ mintOf (n * n) = 512 ∧ n * n = 9 ∧ (mintOf hexbit) * (plane - seed) = 432 ∧ n + vertices = 11 ∧ (n + n) * (mintOf faces) = 98304 ∧ (vertices = hybridSpeed ∧ vertices = mintOf n) ∧ faces = coil ∧ (mintOf hexbit = powMod coins rays plane ∧ mintOf hexbit = powMod coins hexbit bits) ∧ (chooseOf rays coins = powMod rays coins plane ∧ chooseOf rays coins = powMod rays vertices plane) ∧ (powMod n hexbit plane = powMod n faces bits ∧ powMod n hexbit plane = powMod n plane plane) ∧ plane = chooseOf vertices coins ∧ amplitudes = mintOf bits := ⟨receipts_uuid_handle, receipts_uuid_program_section, receipts_uuid_params, receipts_uuid_digits, receipts_uuid_bits, receipts_hex_program_nibbles, agents_mcp_tools, agents_hex_alphabet, crypto_shor_modulus, crypto_shor_factor_p, crypto_shor_factor_q, quantum_shor_dim, quantum_shor_qubits, presentation_stylesheet_hz, cms_payload_plugins, cms_payload_combinations, relation_8, relation_14, relation_16, relation_21, relation_25, relation_28, relation_4294967296⟩
