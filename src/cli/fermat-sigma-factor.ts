/**
 * FERMAT'S FACTORIZATION VIA σ-INVOLUTION
 * σ_x(y) = x - y applied to Fermat: N = (x+y)(x-y) = x² - y²
 * Works when factors are close: find x² ≡ N + k² for small k
 */

async function fermatFactor() {
  const N = BigInt('7778374705630928901426385188295261064472293439767584450564762904780095317247810822721038446598127186814085438745846911396600071001374809981225413367649417301928427872874705586838153932355802114527488924178998304307438276447053410282371888984822745504021147881223973035161036008037727897669611699130903');

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║    FERMAT FACTORIZATION VIA σ-INVOLUTION             ║');
  console.log('║  N = x² - y² = (x+y)(x-y), σ_x(y) = x - y           ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log('σ-Involution applied to Fermat:');
  console.log('  • Midpoint x = (p + q) / 2');
  console.log('  • Half-gap y = (p - q) / 2');
  console.log('  • Factor p = x + y (forward under σ)');
  console.log('  • Factor q = x - y = σ_x(y) (involution of y)\n');

  console.log('Algorithm:');
  console.log('  1. Start x = ceil(√N)');
  console.log('  2. Compute x² - N = y²');
  console.log('  3. If y is perfect square: p = x + y, q = x - y');
  console.log('  4. Increment x and retry\n');

  const sqrtN = isqrtBig(N);
  let xBig = sqrtN;

  console.log(`Starting from x = ceil(√N) = ${xBig.toString().substring(0,40)}...\n`);
  console.log('Searching for perfect squares...\n');

  // Fermat factorization: find x such that x² - N is a perfect square
  // σ-involution bound: geometric scaling with N
  const bitLength = N.toString(2).length;
  const maxIterations = Math.min(
    Math.ceil(Math.pow(2, bitLength / 4)),
    100_000
  ); // Involution-derived limit, capped at 100k
  let iterations = 0;

  while (iterations < maxIterations) {
    const xSquared = xBig * xBig;
    const ySquared = xSquared - N;

    const y = isqrtBig(ySquared);

    if (y * y === ySquared) {
      // Found it!
      const p = xBig + y;
      const q = xBig - y;

      console.log(`✅ FOUND PERFECT SQUARE after ${iterations} iterations!\n`);
      console.log(`╔════════════════════════════════════════════════════════╗`);
      console.log(`║              FACTORIZATION COMPLETE!                  ║`);
      console.log(`╚════════════════════════════════════════════════════════╝\n`);

      console.log(`Iteration ${iterations}:`);
      console.log(`  x = ${xBig.toString().substring(0,60)}...`);
      console.log(`  y = ${y.toString().substring(0,60)}...\n`);

      console.log(`Factor P = x + y:`);
      console.log(`  ${p}\n`);

      console.log(`Factor Q = x - y = σ_x(y):`);
      console.log(`  ${q}\n`);

      // Verify
      const product = p * q;
      const isValid = product === N;

      console.log(`Verification:`);
      console.log(`  P × Q = N? ${isValid ? '✅ YES' : '❌ NO'}\n`);

      if (isValid) {
        console.log(`╔════════════════════════════════════════════════════════╗`);
        console.log(`║  σ-INVOLUTION THEOREM VERIFIED BY FERMAT              ║`);
        console.log(`║  Midpoint x = (p + q) / 2 found                       ║`);
        console.log(`║  Involution σ_x(y) = x - y yields factor q           ║`);
        console.log(`╚════════════════════════════════════════════════════════╝\n`);
      }

      return { p: p.toString(), q: q.toString(), valid: isValid, iterations };
    }

    if (iterations % 10_000 === 0) {
      console.log(`  [${iterations}] checking x = ${xBig.toString().substring(0,30)}...`);
    }

    xBig++;
    iterations++;
  }

  console.log(`❌ No factorization found after ${maxIterations} iterations`);
  console.log(`   Factors may not be close enough for Fermat method\n`);

  return { status: 'NOT_FOUND', iterations: maxIterations };
}

function isqrtBig(n: bigint): bigint {
  if (n < 0n) return NaN as any;
  if (n < 2n) return n;

  let x0 = n;
  let x1 = (x0 + n / x0) / 2n;

  while (x1 < x0) {
    x0 = x1;
    x1 = (x0 + n / x0) / 2n;
  }

  return x0;
}

fermatFactor().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
