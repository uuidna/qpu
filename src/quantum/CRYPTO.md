# Thousand-bit integer

The integer \(2^{999}+1\) and the 1000-bit trapdoor. The check is `crypto1000Bit` in [`crypto/index.ts`](processing/crypto/index.ts). The factoring is `listFactors` in [`algorithms.ts`](processing/algorithms.ts). The detailed specification is [`README.md`](README.md). The standards are [`STANDARDS.md`](STANDARDS.md). The Clay relation that names the degree is [`CLAY.md`](CLAY.md).

\(2^{999}+1\) has 1000 bits: \(2^{999} \le 2^{999}+1 \le 2^{1000}\). Three divides it: \((2^{999}+1) \bmod 3 = 0\). The integer itself is not written by `speakThousand`. That call speaks the width 1000 in Glagolitic and reads it back as 1000.

`listFactors` splits \(2^{k}+1\) into cyclotomic pieces \(\Phi_d(2)\). For \(2^{999}+1\) the degrees \(d\) are the divisors of 1998 that do not divide 999. The product of those pieces is the integer. Each piece is then tried by the primes up to \(2^{20}\). A composite piece that trial leaves is sent to the σ-reflection, then to Lenstra's curves. A piece those doors do not split stays in `left` and is named. The product of the factors and the leftover is checked against the integer.

`algorithm { name: 'shor', N }` on this integer returns that list. The bit length is 1000. The integer is not prime. `left` is empty, `complete` is true, and `verified` is true. The factors multiply back to \(2^{999}+1\). Three is one of them, and there are at least twenty. Order-finding is not required once nothing composite remains. `relation_36` is \(\varphi(74) = 36\), the cyclotomic degree that check names. The Shor, QAOA, QFT, and Grover families of the Clay register all hold.

A general integer has no cyclotomic split. Trial runs below \(2^{16}\), then Miller–Rabin, then the σ-reflection. `textbook_rsa_beyond_bound` is the comparison \(2^{4} < 21 < 2^{5}\) and \(5 < 2048\). It is a five-bit comparison. An unknown semiprime is not given factors. `createImpossible` mints \(N = p \cdot q\) together with the witness \(a = (p+q)/2\). `decodeImpossible` splits \(N\) in one reflection when that witness is given. A wrong witness decodes nothing.

`N1000` is the reflection integer. Bit 999 is set, and so are bits 877, 613, and 251, with the low value 123456789 added. It has 1000 bits. `reflect1000Bit` cuts its hex into 14 faces, seven pairs. Each pair is rebuilt by \(N = u \cdot v\) and \(d = u + v\). The call returns 14 reflections, the rebuild exact.

`crypto1000Bit` runs once and keeps the result. It holds when all of these hold together:

- The reflection of `N1000` is exact: 1000 bits, 14 faces, 7 rays, 14 reflections.
- `createImpossible({ bits: 1000, seed: 1n })` mints a 1000-bit integer and `decodeImpossible` opens it in one search. The witness shifted by 2, and the witness 0, are refused.
- A DNA sequence of 64 bases round-trips through hex. The trapdoor seeded from that sequence decodes by its witness and refuses a wrong one.
- `speakThousand(1000)` round-trips.
- The arithmetic identities hold: \(10^{3} = 2^{3} \cdot 5^{3} = 1000\), \(2^{10} - 24 = 1000\), \(71 \cdot 14 + 6 = 1000\), and \(7 \cdot 11 \cdot 13 = 1001\).
- The factoring of \(2^{999}+1\) multiplies back, `relation_36` is 36, and every Clay relation holds.

The phase is `qpu-crypto-1000-bit`. The address is the UUID of that record, and the seal holds. The lattice on the record is 2 coins, 7 rays, 14 faces, and plane 28.
