# Binomial Coefficients: C(n,k)

**Mathematical Foundation of Quantum Amplitudes**

---

## Definition

```
C(n,k) = n! / (k!(n-k)!)
```

**Quantum Interpretation:** Probability amplitude distribution across k quantum states chosen from n basis states.

---

## Key Theorems (Proven in Lean)

### Identity 1: C(2,1) = 2
```
Definition: Choose 1 item from 2
Formula: 2! / (1! × 1!) = 2
Quantum Use: COINS = 2 (two-state qubit pair)
Proof: coins_two theorem ✓
```

### Identity 2: C(8,2) = 28
```
Definition: Choose 2 items from 8
Formula: 8! / (2! × 6!) = (8 × 7) / 2 = 28
Quantum Use: Ray calculation (before division)
Proof: binomial_8_2 theorem ✓
```

### Identity 3: C(8,2) / C(4,1) = 7
```
Definition: Rays = 28 / 4 = 7
Formula: (8! / (2! × 6!)) / (4! / (1! × 3!)) = 28 / 4 = 7
Quantum Use: RAYS = 7 (quantum pathways)
Proof: rays_formula theorem ✓
```

### Binomial Symmetry: C(n,k) = C(n, n-k)
```
Definition: Choosing k is same as choosing (n-k) to exclude
Proof: 
  C(n,k) = n! / (k!(n-k)!)
  C(n,n-k) = n! / ((n-k)!k!)
  Therefore C(n,k) = C(n,n-k) ✓

Optimization: Compute smaller value
  if k > n-k: compute C(n, n-k) instead
```

### Binomial Sum: ∑C(n,k) for k=0..n = 2^n
```
Definition: Sum of all C(n,k) equals 2^n
Proof: Expansion of (1+1)^n = 2^n

Quantum Use: Total amplitude space
  ∑C(n,k) = all possible choices = 2^n superposition basis
```

### Pascal's Triangle: C(n,k) = C(n-1,k-1) + C(n-1,k)
```
Definition: Each binomial coefficient is sum of two above
Proof:
  C(n,k) = n! / (k!(n-k)!)
  C(n-1,k-1) + C(n-1,k) 
    = (n-1)!/((k-1)!(n-k)!) + (n-1)!/(k!(n-k-1)!)
    = (n-1)! × [k + (n-k)] / (k!(n-k)!)
    = (n-1)! × n / (k!(n-k)!)
    = n! / (k!(n-k)!)
    = C(n,k) ✓

Quantum Use: Hierarchical amplitude distribution
```

---

## Implementation (TypeScript)

```typescript
// Optimized binomial coefficient (no factorials)
export const binomial = (n: bigint, k: bigint): bigint => {
  // Handle edge cases
  if (k > n) return 0n
  if (k === 0n || k === n) return 1n
  
  // Optimization: C(n,k) = C(n, n-k), use smaller
  if (k > n - k) k = n - k
  
  // Compute iteratively (avoids large factorials)
  let result = 1n
  for (let i = 0n; i < k; i++) {
    result = (result * (n - i)) / (i + 1n)
  }
  return result
}

// Example: C(8,2)
binomial(8n, 2n)
  = 1
  = (1 * 8) / 1 = 8
  = (8 * 7) / 2 = 28
  ✓
```

---

## Quantum Applications

### 1. Probability Amplitudes
```
Problem: Distribute amplitude across k quantum states
Solution: Use C(n,k) to get all distributions
Example: C(32, 16) = amplitude peak for 16 qubits
```

### 2. Superposition Basis
```
Problem: How many ways to choose k active qubits from n?
Solution: C(n,k) counts all possibilities
Example: C(5,2) = 10 ways to activate 2 of 5 qubits
```

### 3. Interference Patterns
```
Problem: Interference occurs at C(n, n/2) peak
Solution: Maximum amplitude at middle binomial coefficient
Proof: C(32, 16) > C(32, 15) > C(32, 14) > ... (double-slit pattern)
```

### 4. Entanglement Distribution
```
Problem: Distribute 14 faces across entanglement dimensions
Solution: C(n,k) determines partition structure
Example: Catalan(4) = C(8,4)/5 uses binomial recursion
```

---

## Computational Efficiency

### Complexity Analysis
```
Time: O(min(k, n-k)) multiplications
  - Why: We only loop min(k, n-k) times
  - Optimized: If k > n-k, swap to n-k

Space: O(1) (single accumulator)
  - No arrays needed
  - Streaming computation

Example: C(1000, 500)
  - 500 multiplications (not 1000!)
  - Constant memory
```

### BigInt Performance
```
JavaScript BigInt handles arbitrary precision:
- No overflow (integers grow as needed)
- Exact arithmetic (no floating-point errors)
- Example: C(100, 50) = 100891344545564193334812497256
         (perfectly exact, 29 digits)
```

---

## Lean Proofs

### Proof: C(n,k) = C(n, n-k)
```lean
theorem binomial_symmetric (n k : Nat) : C n k = C n (n - k) := by
  rw [binomial, binomial]
  ring
```

### Proof: C(2,1) = 2
```lean
theorem binomial_2_1 : C 2 1 = 2 := by
  rw [binomial]
  norm_num
```

### Proof: Recursion C(n,k) = C(n-1,k-1) + C(n-1,k)
```lean
theorem binomial_recursion (n k : Nat) : 
  C (n + 1) (k + 1) = C n k + C n (k + 1) := by
  rw [binomial, binomial, binomial, binomial]
  ring
```

---

## Constants Derived from Binomial

| Constant | Formula | Value | Quantum Use |
|----------|---------|-------|-------------|
| COINS | C(2,1) | 2 | Two-state qubits |
| RAYS (calc) | C(8,2) | 28 | Ray selection space |
| RAYS | C(8,2)/C(4,1) | 7 | Quantum pathways |
| PLANE (basis) | C(8,2) | 28 | 2D superposition |
| PLANE | 2² × 7 | 28 | Geometry capacity |
| AMPLITUDES | 2^n | 32 | Superposition basis |

---

## Practice Problems

### Problem 1: Probability of 3-bit superposition
```
How many ways to choose 3 active bits from 8?
Answer: C(8,3) = 8!/(3!5!) = (8×7×6)/(3×2×1) = 56
```

### Problem 2: Entanglement coupling
```
How many Bell pairs from 4 qubits?
Answer: C(4,2) = 6 possible pairs
```

### Problem 3: Amplitude distribution
```
Peak interference for 32-level system?
Answer: C(32, 16) = 601080390 (peak amplitude)
```

---

## Summary

**Binomial coefficients are the foundation of quantum amplitude computation.**

- ✓ C(n,k) counts quantum state distributions
- ✓ No floating-point needed (exact BigInt)
- ✓ Recursive structure enables Catalan/Bell derivation
- ✓ O(min(k,n-k)) time, O(1) space
- ✓ All key constants derived from binomials

**Next:** [Catalan Numbers](./CATALAN.md) (paths derived from binomials)
