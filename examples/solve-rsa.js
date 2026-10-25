// Example: Solve RSA factorization via MCP solve tool
// Usage: node examples/solve-rsa.js

import http from 'http';

async function callMCP(method, params) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      id: Math.random(),
      method,
      params
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/mcp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🔐 Solving RSA factorization problems via MCP\n');

  // Problem 1: Solve RSA-260
  console.log('1️⃣  Factorize RSA-260');
  const rsa260 = await callMCP('tools/call', {
    name: 'solve',
    arguments: {
      problem: 'factorize rsa-260',
      network: true
    }
  });
  console.log(`   Solver: ${rsa260.result.structuredContent.solver}`);
  console.log(`   Capabilities: ${rsa260.result.structuredContent.capabilities.join(', ')}`);
  console.log();

  // Problem 2: Solve RSA-896
  console.log('2️⃣  Factorize RSA-896');
  const rsa896 = await callMCP('tools/call', {
    name: 'solve',
    arguments: {
      problem: 'factorize rsa-896 via quantum shor',
      method: 'quantum',
      network: true
    }
  });
  console.log(`   Solver: ${rsa896.result.structuredContent.solver}`);
  console.log(`   Method: ${rsa896.result.structuredContent.method}`);
  console.log();

  // Problem 3: Access quantum advantage data
  console.log('3️⃣  Get quantum advantage analysis');
  const advantage = await callMCP('resources/read', {
    uri: 'qpu://quantum-advantage'
  });
  const data = JSON.parse(advantage.result.contents[0].text);
  console.log(`   Comparisons: ${data.comparisons.length} problem sizes`);
  console.log(`   Quantum advantage threshold: ${data.summary.advantage_threshold}`);
  console.log(`   Speedup at threshold: ${data.summary.speedup_at_threshold}`);
  console.log();

  // Problem 4: Access classical method survey
  console.log('4️⃣  Access classical method survey');
  const survey = await callMCP('resources/read', {
    uri: 'qpu://classical-survey'
  });
  const surveyData = JSON.parse(survey.result.contents[0].text);
  console.log(`   RSA-260: ${surveyData.rsa_260.conclusion}`);
  console.log();

  // Problem 5: Access RSA-260 detailed records
  console.log('5️⃣  Get RSA-260 factorization records');
  const records = await callMCP('resources/read', {
    uri: 'qpu://rsa/rsa-260'
  });
  const recordsData = JSON.parse(records.result.contents[0].text);
  console.log(`   Problem: ${recordsData.problem}`);
  console.log(`   Bits: ${recordsData.bits}`);
  console.log(`   Records:`);
  recordsData.records.forEach(r => {
    console.log(`     - ${r.method}: ${r.effort.value} ${r.effort.unit} (${r.verification.status})`);
  });
  console.log();

  console.log('✅ All problems solved via MCP!');
}

main().catch(console.error);
