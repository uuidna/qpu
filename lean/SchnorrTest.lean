import Schnorr

/-!
# Schnorr Protocol — Concrete Evaluation Tests

Instantiates the protocol with p = 7, g = 3 and checks that the
computable functions produce the expected values.
-/

def g7 : G 7 := ⟨3, by omega⟩

-- Group operations
#eval (mul 7 g7 ⟨5, by omega⟩).val    -- 1  (3·5 = 15, 15%7 = 1)
#eval (mul 7 ⟨2, by omega⟩ ⟨4, by omega⟩).val  -- 1  (2·4 = 8, 8%7 = 1)
#eval (pow 7 g7 2).val                 -- 2  (3² = 9, 9%7 = 2)
#eval (pow 7 g7 6).val                 -- 1  (3⁶ = 729, 729%7 = 1, Fermat)

-- Inverse (computable via Nat.gcdA)
#eval (inv 7 g7).val                   -- 5  (3·5 = 15, 15%7 = 1)
#eval (inv 7 ⟨2, by omega⟩).val        -- 4  (2·4 = 8, 8%7 = 1)

-- Modular inverse (computable via Nat.gcdA)
#eval modInv 3 7                        -- 5  (3·5 = 15, 15%7 = 1)
#eval modInv 2 7                        -- 4  (2·4 = 8, 8%7 = 1)
#eval modInv 5 7                        -- 3  (5·3 = 15, 15%7 = 1)

-- Protocol: commit, respond, verify
#eval (commit 7 g7 1).val               -- 3  (g¹ = 3)
#eval (commit 7 g7 2).val               -- 2  (g² = 2)
#eval respond 7 1 2 3                    -- 1  ((1 + 2·3) % 6 = 7 % 6 = 1)
#eval respond 7 0 2 3                    -- 0  ((0 + 2·3) % 6 = 6 % 6 = 0)
#eval verify 7 ⟨3, by omega⟩ ⟨2, by omega⟩ 3 1  -- true (g¹·(inv 2)³ = 3·1 = 3 = commit)
#eval verify 7 ⟨1, by omega⟩ ⟨2, by omega⟩ 3 0  -- true (g⁰·(inv 2)³ = 1·1 = 1 = commit)

-- Extractor (computable via modInv)
-- h = g² = 2, r = 0, x = 2
-- c1 = 2, c2 = 1: (c1-c2) = 1, coprime to 6 ✓
-- z1 = respond 0 2 2 = 4, z2 = respond 0 2 1 = 2
#eval extract 7 2 1 4 2 (by decide)     -- 2  ((4-2)·modInv(1,6)) % 6 = 2·1 % 6 = 2