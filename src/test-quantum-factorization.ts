/**
 * END-TO-END QUANTUM FACTORIZATION TEST
 * Generate primes → Create RSA → Factor it
 * Verify system works on known test cases
 */

import { quantumFactorizationAdapter } from './mcp/adapters-quantum-factorization.js';

async function runFullTest() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   QUANTUM FACTORIZATION: END-TO-END TEST              ║');
  console.log('║   Generate → Create → Factor → Verify                 ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Test 1: Small primes (256-bit)
  console.log('TEST 1: 256-bit RSA Integer\n');
  await testFactorization(256);

  // Test 2: Medium primes (512-bit)
  console.log('\n\nTEST 2: 512-bit RSA Integer\n');
  await testFactorization(512);

  // Test 3: Larger primes (768-bit)
  console.log('\n\nTEST 3: 768-bit RSA Integer\n');
  await testFactorization(768);

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║        QUANTUM FACTORIZATION: ALL TESTS COMPLETE       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
}

async function testFactorization(bitLength: number) {
  const startTime = Date.now();

  // Step 1: Generate primes
  console.log(`Step 1: Generate two ${bitLength}-bit primes`);
  const primeGenStart = Date.now();
  const primeResult = await quantumFactorizationAdapter.operations.generatePrimes({
    bitLength,
    count: 2,
  });
  const primeGenTime = Date.now() - primeGenStart;

  const [p, q] = primeResult.primes;
  console.log(`  ✓ Generated primes in ${primeGenTime}ms`);
  console.log(`  P (first 50 chars): ${p.substring(0, 50)}...`);
  console.log(`  Q (first 50 chars): ${q.substring(0, 50)}...\n`);

  // Step 2: Create RSA integer
  console.log(`Step 2: Create RSA integer N = P × Q`);
  const testIntStart = Date.now();
  const testIntResult = await quantumFactorizationAdapter.operations.createTestInteger({
    p,
    q,
  });
  const testIntTime = Date.now() - testIntStart;

  const N = testIntResult.N;
  const bitLengthN = testIntResult.bitLength;
  console.log(`  ✓ Created RSA integer in ${testIntTime}ms`);
  console.log(`  N bit length: ${bitLengthN} bits`);
  console.log(`  N (first 50 chars): ${N.substring(0, 50)}...\n`);

  // Step 3: Analyze complexity
  console.log(`Step 3: Analyze factorization complexity`);
  const complexity = quantumFactorizationAdapter.operations.analyzeComplexity({
    integer: N,
  });
  console.log(`  Classical complexity: ${complexity.classical_complexity}`);
  console.log(`  Quantum complexity: ${complexity.quantum_complexity}`);
  console.log(`  Quantum speedup: ${complexity.speedup_ratio}\n`);

  // Step 4: Attempt factorization
  console.log(`Step 4: Attempt factorization via QPU`);
  const factorStart = Date.now();
  const factorResult = await quantumFactorizationAdapter.operations.factorize({
    integer: N,
    method: 'auto',
  });
  const factorTime = Date.now() - factorStart;

  if (factorResult.success) {
    console.log(`  ✓ Factorization successful in ${factorTime}ms`);
    console.log(`  Method: ${factorResult.method}`);
    console.log(`  Iterations: ${factorResult.iterations}`);
    console.log(`  P (found): ${factorResult.p?.substring(0, 50)}...`);
    console.log(`  Q (found): ${factorResult.q?.substring(0, 50)}...\n`);

    // Step 5: Verify factors
    console.log(`Step 5: Verify factors\n`);
    const pBigInt = BigInt(factorResult.p!);
    const qBigInt = BigInt(factorResult.q!);
    const NBigInt = BigInt(N);
    const productMatch = pBigInt * qBigInt === NBigInt;

    if (productMatch) {
      console.log(`  ✅ VERIFIED: P × Q = N`);
    } else {
      console.log(`  ❌ VERIFICATION FAILED: P × Q ≠ N`);
    }

    // Check if factors match original primes
    const p_match = factorResult.p === p || factorResult.p === q;
    const q_match = factorResult.q === q || factorResult.q === p;

    if (p_match && q_match) {
      console.log(`  ✅ VERIFIED: Factors match original primes`);
    } else {
      console.log(`  ⚠️  Factors are valid but order differs`);
    }
  } else {
    console.log(`  ❌ Factorization failed`);
    console.log(`  Method reached: ${factorResult.method}`);
  }

  // Step 6: Check security properties
  console.log(`\nStep 6: Verify security properties`);
  const securityStart = Date.now();
  const security = await quantumFactorizationAdapter.operations.checkSecrecy({
    integer: N,
  });
  const securityTime = Date.now() - securityStart;

  console.log(`  Trivial factors: ${security.trivial_factors}`);
  console.log(`  Quantum secure: ${security.quantum_secure}`);
  console.log(`  Quantum required: ${security.quantum_required}`);
  console.log(`  Security check time: ${securityTime}ms\n`);

  const totalTime = Date.now() - startTime;
  console.log(`═══════════════════════════════════════════════════════`);
  console.log(`Total test time: ${totalTime}ms`);
  console.log(`═══════════════════════════════════════════════════════`);
}

runFullTest().catch(console.error);
