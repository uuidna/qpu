/-! # Qpu.General.Prose.QuantumProcessingCryptoCross
The prose of `src/quantum/processing/crypto/cross.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumProcessingCryptoCross_needs : String := "witnesses takes a UUID, or { uuid, seed?, full? }: the UUID whose fourteen witnesses are cross-encrypted (textbook_witness_clock_move: 2 · 7 = 14)"
def quantumProcessingCryptoCross_seed : String := "the seed is hex of at least 32 bytes: every key of the ring is derived from it, and it never travels back (the key sizes: textbook_pqc_standards_three)"
def quantumProcessingCryptoCross_says : String := "⟦0⟧ witnesses in a ring, each sealed to the next with ML-KEM-768 and AES-256-GCM and signed with ML-DSA-65 (textbook_pqc_standards_three): ⟦1⟧ link(s) are opened by their successor and verified, and ⟦2⟧ refuse a changed ciphertext, a stranger's key and a changed signed message."
def quantumProcessingCryptoCross_witnesses : String := "a UUID, or { uuid, seed?, full? }: its fourteen witnesses cross-encrypted in a ring (textbook_pqc_standards_three). Each witness's address is sealed to the next witness with ML-KEM-768 (FIPS 203) and AES-256-GCM, the UUID as associated data, and signed by its own ML-DSA-65 key (FIPS 204); every key is derived from the seed (hex, 32 bytes or more; a fresh one without, and then the ring cannot be rebuilt) and the witness's address. The answer checks every link as built and states the cost to fake: the categories the standards state, the AEAD's key and tag, and the address measured from the capacity. No secret key and no shared secret is answered; full: true answers the public keys, ciphertexts and signatures whole, otherwise each by its length and SHA-256."
def quantumProcessingCryptoCross_shows : String := "The fourteen witnesses of one UUID cross-encrypted from a seed: every link is opened by its successor and verified, a changed ciphertext, a stranger's key and a changed message are each refused, and no secret is answered (textbook_pqc_standards_three)."

end Prose
