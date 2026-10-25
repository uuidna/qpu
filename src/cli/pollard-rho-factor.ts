/**
 * POLLARD'S RHO FACTORIZATION
 * Probabilistic algorithm based on random cycle detection
 * Often finds factors faster than trial division
 */

async function pollardRho() {
  const N = BigInt('7778374705630928901426385188295261064472293439767584450564762904780095317247810822721038446598127186814085438745846911396600071001374809981225413367649417301928427872874705586838153932355802114527488924178998304307438276447053410282371888984822745504021147881223973035161036008037727897669611699130903');

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║         POLLARD\'S RHO FACTORIZATION                 ║');
  console.log('║   Probabilistic algorithm, often fast on semiprimes  ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  function pollardRhoFind(n: bigint, maxIterations: number = 10_000_000): bigint | null {
    if (n === 1n) return null;
    if (n % 2n === 0n) return 2n;

    let x = BigInt(Math.floor(Math.random() * 1000000));
    let y = x;
    let c = BigInt(Math.floor(Math.random() * 1000000));
    let d = 1n;

    const f = (x: bigint) => (x * x + c) % n;

    let iterations = 0;
    while (d === 1n && iterations < maxIterations) {
      x = f(x);
      y = f(f(y));
      d = gcd(absDiff(x, y), n);
      iterations++;

      if (iterations % 100_000 === 0) {
        console.log(`    Iteration ${iterations}: d = ${d === 1n ? '1 (continuing)' : 'potential factor'}`);
      }
    }

    if (d !== n && d !== 1n) {
      return d;
    }
    return null;
  }

  console.log('Algorithm:');
  console.log('  1. Generate random x, y, c');
  console.log('  2. Iterate: x → (x² + c) mod N, y → (y² + c)² mod N');
  console.log('  3. Compute gcd(|x - y|, N)');
  console.log('  4. Repeat until gcd > 1\n');

  console.log('Attempting multiple random seeds...\n');

  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`Attempt ${attempt} with random seed...`);
    const factor = pollardRhoFind(N, 100_000);

    if (factor && factor > 1n && factor < N) {
      const p = factor;
      const q = N / p;

      console.log(`\n✅ FACTOR FOUND on attempt ${attempt}!\n`);
      console.log(`╔════════════════════════════════════════════════════════╗`);
      console.log(`║              FACTORIZATION COMPLETE!                  ║`);
      console.log(`╚════════════════════════════════════════════════════════╝\n`);

      console.log(`Factor P (${p.toString().length} digits):`);
      console.log(`  ${p}\n`);

      console.log(`Factor Q (${q.toString().length} digits):`);
      console.log(`  ${q}\n`);

      // Verify
      const product = p * q;
      const isValid = product === N;

      console.log(`Verification:`);
      console.log(`  P × Q = N? ${isValid ? '✅ YES' : '❌ NO'}\n`);

      if (isValid) {
        console.log(`╔════════════════════════════════════════════════════════╗`);
        console.log(`║        FACTORIZATION VERIFIED & COMPLETE              ║`);
        console.log(`║         Ready for prize submissions                    ║`);
        console.log(`╚════════════════════════════════════════════════════════╝\n`);
      }

      return { p: p.toString(), q: q.toString(), valid: isValid, attempt };
    }
  }

  console.log(`\n❌ Pollard's Rho did not find factors in ${maxAttempts} attempts`);
  console.log(`   This RSA number may require quantum factorization\n`);

  return { status: 'NOT_FOUND', attempts: maxAttempts };
}

function gcd(a: bigint, b: bigint): bigint {
  while (b !== 0n) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function absDiff(a: bigint, b: bigint): bigint {
  return a > b ? a - b : b - a;
}

pollardRho().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
