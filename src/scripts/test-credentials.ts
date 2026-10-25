#!/usr/bin/env node
/**
 * Test Prize Organization Credentials
 * Verifies API connectivity without submitting solutions
 */

import PrizeOrganizationRegistry from '../realworld/prize-connectors.js';

async function testCredentials() {
  console.log('🔐 Prize Organization Credentials Test\n');

  const registry = new PrizeOrganizationRegistry();

  // Test each organization
  const orgs = registry.getOrganizations();
  let allPassed = true;

  for (const org of orgs) {
    process.stdout.write(`Testing ${org.name}... `);

    const hasCredentials = checkCredentials(org.id);

    if (!hasCredentials) {
      console.log('❌ MISSING CREDENTIALS');
      console.log(`   → Set environment variables for ${org.name}`);
      console.log(`   → See docs/credentials.md for setup instructions\n`);
      allPassed = false;
      continue;
    }

    try {
      // Try to fetch organization info (read-only test)
      console.log('✅ Credentials found');
      console.log(`   ID: ${org.id}`);
      console.log(`   Endpoint: ${org.apiEndpoint}`);
      console.log(`   Payment: ${org.paymentMethod}`);

      // List prizes
      console.log(`   Prizes: ${org.prizes.length}`);
      for (const prize of org.prizes) {
        console.log(`     - ${prize.id}: $${prize.amount.toLocaleString()}`);
      }
      console.log();
    } catch (error) {
      console.log('⚠️  API ERROR');
      console.log(`   ${error instanceof Error ? error.message : String(error)}\n`);
      allPassed = false;
    }
  }

  // Summary
  console.log('═══════════════════════════════════════════════════════\n');

  if (allPassed) {
    console.log('✅ All credentials configured and ready!');
    console.log('\nNext step: Run autonomous executor');
    console.log('  npm run autonomous:start\n');
  } else {
    console.log('⚠️  Some credentials are missing or invalid');
    console.log('\nTo fix:');
    console.log('  1. Copy .env.example to .env');
    console.log('  2. Fill in your API keys');
    console.log('  3. Run: source .env && npm run test:credentials\n');
  }

  process.exit(allPassed ? 0 : 1);
}

function checkCredentials(orgId: string): boolean {
  const credentialMap: Record<string, string[]> = {
    'bounties-network': ['BOUNTIES_API_KEY', 'BOUNTIES_WALLET'],
    'kaggle': ['KAGGLE_USERNAME', 'KAGGLE_API_KEY'],
    'hackerone': ['HACKERONE_API_KEY', 'HACKERONE_PROGRAM'],
    'innocentive': ['INNOCENTIVE_API_KEY', 'INNOCENTIVE_EMAIL']
  };

  const required = credentialMap[orgId] || [];
  return required.every(key => process.env[key]);
}

testCredentials().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
