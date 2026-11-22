/-! # Qpu.General.Prose.QuantumProcessingAlgorithms
The prose of `src/quantum/processing/algorithms.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumProcessingAlgorithms_s1 : String := "Bob matches the message on X, Y and Z after the two corrections. Before those bits each expectation on Bob is 0. The false assumption is sent to next, and next is true."
def quantumProcessingAlgorithms_s2 : String := "the teleport readout did not prove the channel silent"
def quantumProcessingAlgorithms_s3 : String := "⟦0⟧ is a non-negative integer: a decimal string of any length, or a JSON number"
def quantumProcessingAlgorithms_s4 : String := "a minus sign: the magnitude is the integer, the sign a polarity"
def quantumProcessingAlgorithms_s5 : String := "create takes two primes (p, q) or a bit size to generate them"
def quantumProcessingAlgorithms_s6 : String := "the two primes must differ (a semiprime of distinct primes)"
def quantumProcessingAlgorithms_s7 : String := "the trapdoor takes two odd primes: with 2 the centre (p + q)/2 is not an integer"
def quantumProcessingAlgorithms_s8 : String := "a must be a unit mod N (2 ≤ a < N, gcd(a, N) = 1); otherwise gcd is a factor and no order is needed"
def quantumProcessingAlgorithms_via9 : String := "baby-step giant-step over the UUID-addressed RAID table"
def quantumProcessingAlgorithms_s10 : String := "the order exceeds m² ≈ ⟦0⟧ (the budget): bounded, never guessed — order-finding at this scale is computed by a physical quantum backend"
def quantumProcessingAlgorithms_s11 : String := "a is a unit mod N, 2 ≤ a < N with gcd(a, N) = 1: otherwise gcd(a, N) is itself a factor, no order needed"
def quantumProcessingAlgorithms_s12 : String := "r is the order of a mod N (a^r ≡ 1): a^⟦0⟧ mod N ≠ 1, so the measured period is wrong"
def quantumProcessingAlgorithms_s13 : String := "the order is odd: this a yields no factor; another a is tried (the circuit is rerun, textbook_refuse_is_refuse)"
def quantumProcessingAlgorithms_s14 : String := "a^(r/2) ≡ −1 mod N: this a yields only the trivial factor; another a is tried"
def quantumProcessingAlgorithms_why15 : String := "gcd(a^(r/2) ± 1, N) splits N: a ⟦0⟧-bit factoring finished from its order, the product checked"

end Prose
