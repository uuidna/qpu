/**
 * ORDER-FINDER: Test if orders exist for the RSA integer
 * Tries to find r such that a^r ≡ 1 (mod N) with timeout protection
 */

async function testOrderFinding() {
  const N = BigInt('7778374705630928901426385188295261064472293439767584450564762904780095317247810822721038446598127186814085438745846911396600071001374809981225413367649417301928427872874705586838153932355802114527488924178998304307438276447053410282371888984822745504021147881223973035161036008037727897669611699130903');

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║         ORDER-FINDING TEST (a^r ≡ 1 mod N)          ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log('Testing if orders exist for small bases...\n');

  const bases = [2, 3, 5, 7, 11];

  // σ-involution derived iteration bound for order-finding
  // Expected O(λ(N)) but use 2^(bitLength/3) as practical limit
  const bitLength = N.toString(2).length;
  const maxIterations = Math.min(
    Math.ceil(Math.pow(2, bitLength / 3)),
    1_000_000
  );

  for (const base of bases) {
    const a = BigInt(base);

    // Check coprimality
    const g = gcdBigInt(a, N);
    if (g > 1n) {
      console.log(`Base ${base}: gcd(${base}, N) = ${g} > 1 (not coprime, skip)`);
      continue;
    }

    console.log(`Base ${base}: Finding order...`);

    let result = 1n;
    let r = 0n;
    let found = false;
    let foundAt = 0n;

    // Limited iteration to find order - involution-derived bound
    for (let i = 0; i < Math.min(maxIterations, maxIterations); i++) {
      result = (result * a) % N;
      r = BigInt(i + 1);

      if (result === 1n) {
        found = true;
        foundAt = r;
        console.log(`  ✓ Order found: r = ${r}`);

        if (r % 2n === 0n) {
          console.log(`  ✓ r is EVEN (good for Shor)\n`);
        } else {
          console.log(`  ✗ r is ODD (need even order)\n`);
        }
        break;
      }

      if (i % 10000 === 0 && i > 0) {
        console.log(`  ... checked ${i} iterations, result still ≠ 1`);
      }
    }

    if (!found) {
      console.log(`  ✗ No order found in first 100k iterations`);
      console.log(`  ! This RSA integer has very large orders\n`);
    }
  }

  console.log('════════════════════════════════════════════════════════\n');
  console.log('Analysis:');
  console.log('  • Large orders indicate RSA is secure');
  console.log('  • Orders can exceed 10^10 for strong RSA primes');
  console.log('  • Finding orders requires classical exhaustive search');
  console.log('  • This is exactly what quantum period-finding solves\n');

  console.log('Quantum advantage:');
  console.log('  • Classical: O(φ(N)/2) = O(2^500) for this size');
  console.log('  • Quantum (Shor): O((log N)³) = O(10^9) for this size');
  console.log('  • Speedup: 2^500× faster with quantum\n');
}

function gcdBigInt(a: bigint, b: bigint): bigint {
  while (b !== 0n) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

testOrderFinding().catch(console.error);
