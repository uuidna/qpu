/-! # Qpu.General.Prose.QuantumProcessingCryptoPqc
The prose of `src/quantum/uuid/programs/4/3/a/3/9/a/e/6/index.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumProcessingCryptoPqc_seed : String := "A seed is ⟦0⟧ bytes as ⟦1⟧ hex digits: keep it, it is the secret key."
def quantumProcessingCryptoPqc_algorithm : String := "algorithm is one of ⟦0⟧, not ⟦1⟧."
def quantumProcessingCryptoPqc_op : String := "pqc takes op, one of ⟦0⟧."
def quantumProcessingCryptoPqc_description : String := "Post-quantum cryptography computed: { op: kem-keygen | kem-decapsulate, seed } and { op: kem-encapsulate, publicKey } for X-Wing (ML-KEM-768 with X25519) or, with algorithm, ML-KEM-512, ML-KEM-768 or ML-KEM-1024; { op: dsa-keygen | dsa-sign, seed, message } and { op: dsa-verify, publicKey, message, signature } for ML-DSA-65 or, with algorithm, ML-DSA-44, ML-DSA-87, SLH-DSA-SHA2-128s, 128f, 192s or 256s, or the classical Ed25519 and ECDSA-P256; the seed is the secret and never leaves the caller unless it sends it."

end Prose
