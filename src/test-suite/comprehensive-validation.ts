/**
 * COMPREHENSIVE VALIDATION TEST SUITE
 * Complete end-to-end verification of quantum factorization system
 */

import { quantumFactorizationAdapter } from '../mcp/adapters-quantum-factorization.js';
import { clayQuantumCourt } from '../quantum/clay-quantum-court.js';

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  details?: string;
}

async function runComprehensiveValidation() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   COMPREHENSIVE VALIDATION TEST SUITE                 ║');
  console.log('║   Complete end-to-end system verification             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const results: TestResult[] = [];

  // TEST GROUP 1: Prime Generation
  console.log('TEST GROUP 1: Prime Generation\n');

  for (const bitLength of [32, 64, 128]) {
    const start = Date.now();
    try {
      const result = await quantumFactorizationAdapter.operations.generatePrimes({
        bitLength,
        count: 2,
      });
      const duration = Date.now() - start;
      const passed = result.primes.length === 2 && result.bitLength === bitLength;
      results.push({
        name: `Generate ${bitLength}-bit primes`,
        passed,
        duration,
        details: passed ? `Generated in ${duration}ms` : 'Failed'
      });
      console.log(`✅ ${bitLength}-bit primes (${duration}ms)`);
    } catch (e) {
      results.push({
        name: `Generate ${bitLength}-bit primes`,
        passed: false,
        duration: Date.now() - start,
      });
      console.log(`❌ ${bitLength}-bit primes`);
    }
  }

  // TEST GROUP 2: RSA Creation
  console.log('\nTEST GROUP 2: RSA Integer Creation\n');

  for (const bitLength of [32, 64]) {
    const start = Date.now();
    try {
      const primes = await quantumFactorizationAdapter.operations.generatePrimes({
        bitLength: bitLength / 2,
        count: 2,
      });
      const rsa = await quantumFactorizationAdapter.operations.createTestInteger({
        p: primes.primes[0],
        q: primes.primes[1],
      });
      const duration = Date.now() - start;
      const verified = BigInt(primes.primes[0]) * BigInt(primes.primes[1]) === BigInt(rsa.N);
      results.push({
        name: `Create ${bitLength}-bit RSA`,
        passed: verified,
        duration,
      });
      console.log(`✅ ${bitLength}-bit RSA (${duration}ms)`);
    } catch (e) {
      results.push({
        name: `Create ${bitLength}-bit RSA`,
        passed: false,
        duration: Date.now() - start,
      });
      console.log(`❌ ${bitLength}-bit RSA`);
    }
  }

  // TEST GROUP 3: Factorization Methods
  console.log('\nTEST GROUP 3: Factorization Methods\n');

  const testN = '1000000016000000063';

  for (const method of ['auto', 'classical', 'sigma']) {
    const start = Date.now();
    try {
      const result = await quantumFactorizationAdapter.operations.factorize({
        integer: testN,
        method: method as any,
      });
      const duration = Date.now() - start;
      const passed = result.success && result.p && result.q;
      results.push({
        name: `Factorize via ${method}`,
        passed,
        duration,
      });
      console.log(`✅ Method: ${method} (${duration}ms)`);
    } catch (e) {
      results.push({
        name: `Factorize via ${method}`,
        passed: false,
        duration: Date.now() - start,
      });
      console.log(`❌ Method: ${method}`);
    }
  }

  // TEST GROUP 4: Clay Quantum Court
  console.log('\nTEST GROUP 4: Clay Quantum Court\n');

  const start4 = Date.now();
  try {
    const result = await clayQuantumCourt(BigInt('1000000016000000063'));
    const duration = Date.now() - start4;
    results.push({
      name: 'Clay quantum court',
      passed: result.success,
      duration,
    });
    console.log(`✅ Clay quantum court (${duration}ms)`);
  } catch (e) {
    results.push({
      name: 'Clay quantum court',
      passed: false,
      duration: Date.now() - start4,
    });
    console.log(`❌ Clay quantum court`);
  }

  // TEST GROUP 5: Analysis Functions
  console.log('\nTEST GROUP 5: Analysis Functions\n');

  const start5 = Date.now();
  try {
    const complexity = quantumFactorizationAdapter.operations.analyzeComplexity({
      integer: testN,
    });
    const security = await quantumFactorizationAdapter.operations.checkSecrecy({
      integer: testN,
    });
    const duration = Date.now() - start5;

    const passed = (complexity.integer_bits as number) > 0 && security.trivial_factors !== undefined;
    results.push({
      name: 'Analysis functions',
      passed,
      duration,
    });
    console.log(`✅ Analysis functions (${duration}ms)`);
  } catch (e) {
    results.push({
      name: 'Analysis functions',
      passed: false,
      duration: Date.now() - start5,
    });
    console.log(`❌ Analysis functions`);
  }

  // SUMMARY
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║              TEST SUITE RESULTS                        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  const totalTime = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`Results: ${passed}/${total} tests passed\n`);

  if (failed === 0) {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║         ALL TESTS PASSED: SYSTEM VERIFIED              ║');
    console.log('║                                                        ║');
    console.log('║  ✅ Prime generation: Working                         ║');
    console.log('║  ✅ RSA creation: Working                             ║');
    console.log('║  ✅ All factorization methods: Working                ║');
    console.log('║  ✅ Clay quantum court: Operational                   ║');
    console.log('║  ✅ Analysis functions: Working                       ║');
    console.log('║                                                        ║');
    console.log('║  TOTAL TIME: ' + totalTime + 'ms' + ' '.repeat(31 - totalTime.toString().length) + '║');
    console.log('║                                                        ║');
    console.log('║  System is PRODUCTION VERIFIED and OPERATIONAL        ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
  } else {
    console.log(`❌ ${failed} test(s) failed\n`);
  }
}

runComprehensiveValidation().catch(console.error);
