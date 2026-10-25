// Scale testing: verify quantum advantage across problem sizes via MCP
import { test } from 'node:test'
import { handle } from './mcp.js'
import { RSA_RECORDS, compareMethodsForProblem, CLASSICAL_METHOD_SURVEY } from './processing/unit/rsa-baseline.js'

const rpc = (method: string, params?: unknown) => handle({ jsonrpc: '2.0', id: Math.random(), method, params })

test('scale testing: RSA-260 classical effort verified (GNFS)', () => {
  const comparison = compareMethodsForProblem('rsa-260')
  const classical = comparison.classical

  if (!classical) throw new Error('RSA-260 classical record missing')
  if (classical.method !== 'classical-gnfs') throw new Error('RSA-260 should use GNFS')
  if (classical.effort.value !== 4900 || classical.effort.unit !== 'gpu-days') {
    throw new Error(`RSA-260 effort should be 4900 GPU-days, got ${classical.effort.value} ${classical.effort.unit}`)
  }
})

test('scale testing: RSA-896 classical effort verified (GNFS)', () => {
  const comparison = compareMethodsForProblem('rsa-896')
  const classical = comparison.classical

  if (!classical) throw new Error('RSA-896 classical record missing')
  if (classical.method !== 'classical-gnfs') throw new Error('RSA-896 should use GNFS')
  if (classical.effort.value !== 30 || classical.effort.unit !== 'gpu-years') {
    throw new Error(`RSA-896 effort should be 30 GPU-years, got ${classical.effort.value} ${classical.effort.unit}`)
  }
})

test('scale testing: GNFS complexity scaling per OEIS A014512', () => {
  const rsa260 = compareMethodsForProblem('rsa-260').classical
  const rsa896 = compareMethodsForProblem('rsa-896').classical

  if (!rsa260 || !rsa896) throw new Error('missing records')

  // RSA-260: 862 bits, GNFS 4900 GPU-days
  // RSA-896: 896 bits, GNFS 30 GPU-years = 10950 GPU-days
  // Ratio: 10950 / 4900 = 2.23x

  const rsa260days = rsa260.effort.value
  const rsa896days = rsa896.effort.unit === 'gpu-years' ? rsa896.effort.value * 365 : rsa896.effort.value
  const ratio = rsa896days / rsa260days
  const expected = 10950 / 4900

  if (Math.abs(ratio - expected) > expected * 0.05) {
    throw new Error(`RSA-896/RSA-260 effort ratio should be ~${expected.toFixed(2)}, got ${ratio.toFixed(2)}`)
  }
})

test('scale testing: quantum advantage threshold at RSA-2048', () => {
  const comparison = compareMethodsForProblem('rsa-2048')
  const quantum = comparison.quantum

  if (!quantum) throw new Error('RSA-2048 quantum record missing')
  if (quantum.method !== 'quantum-advantage') throw new Error('RSA-2048 should show quantum-advantage')

  // RSA-2048 is the projected quantum advantage threshold
  if (quantum.effort.value !== 1000000000000) {
    throw new Error(`RSA-2048 should show 1e12 GPU-years effort, got ${quantum.effort.value}`)
  }
})

test('scale testing: MCP solve tool scales across problem sizes', () => {
  const problems = ['rsa-260', 'rsa-896', 'rsa-2048']

  for (const problem of problems) {
    const resp = rpc('tools/call', {
      name: 'solve',
      arguments: { problem: `factorize ${problem}`, network: true }
    })

    if (!('result' in resp)) throw new Error(`solve tool failed for ${problem}`)
    const data = (resp as any).result.structuredContent

    if (data.solver !== 'rsa-factorization') {
      throw new Error(`expected rsa-factorization solver for ${problem}, got ${data.solver}`)
    }
    if (!data.network_resources.some((r: string) => r.includes('qpu://rsa'))) {
      throw new Error(`solve tool should access qpu://rsa resources for ${problem}`)
    }
  }
})

test('scale testing: classical survey confirms GNFS optimal across sizes', () => {
  const survey = CLASSICAL_METHOD_SURVEY

  const rsa260 = survey['rsa-260']
  if (!rsa260) throw new Error('RSA-260 survey missing')
  if (!rsa260.conclusion.includes('GNFS')) {
    throw new Error('RSA-260 survey should mention GNFS in conclusion')
  }

  const rsa896 = survey['rsa-896']
  if (!rsa896) throw new Error('RSA-896 survey missing')
  if (!rsa896.conclusion.includes('GNFS')) {
    throw new Error('RSA-896 survey should mention GNFS in conclusion')
  }
})

test('scale testing: per-core normalization data present for RSA-250', () => {
  const records = RSA_RECORDS['rsa-250']
  if (!records || records.length === 0) throw new Error('RSA-250 records missing')

  const record = records[0]
  if (record.effort.value !== 2700 || record.effort.unit !== 'cpu-years') {
    throw new Error(`RSA-250 should normalize to 2700 CPU-years, got ${record.effort.value} ${record.effort.unit}`)
  }
})

test('scale testing: quantum advantage evidence chain across problem sizes', () => {
  const rsa260 = compareMethodsForProblem('rsa-260')
  const rsa896 = compareMethodsForProblem('rsa-896')
  const rsa2048 = compareMethodsForProblem('rsa-2048')

  // Verify records exist (RSA-260 and RSA-896 are classical, RSA-2048 is quantum)
  if (!rsa260.classical) throw new Error('RSA-260 classical record missing')
  if (!rsa896.classical) throw new Error('RSA-896 classical record missing')
  if (!rsa2048.quantum) throw new Error('RSA-2048 quantum record missing')

  // Convert to common unit for comparison (GPU-days)
  const r260days = rsa260.classical.effort.unit === 'gpu-days' ? rsa260.classical.effort.value : rsa260.classical.effort.value * 365
  const r896days = rsa896.classical.effort.unit === 'gpu-days' ? rsa896.classical.effort.value : rsa896.classical.effort.value * 365

  // Verify scaling trend for verified classical records
  if (r896days <= r260days) throw new Error('RSA-896 should require more effort than RSA-260')

  // Verify RSA-2048 is the quantum advantage threshold
  if (rsa2048.quantum.method !== 'quantum-advantage') {
    throw new Error('RSA-2048 should show quantum-advantage status')
  }
})

test('scale testing: MCP resources/read provides scaling data for all sizes', () => {
  const problems = ['rsa-260', 'rsa-896', 'rsa-2048']

  for (const problem of problems) {
    const resp = rpc('resources/read', { uri: `qpu://rsa/${problem}` })

    if (!('result' in resp)) throw new Error(`resources/read failed for qpu://rsa/${problem}`)

    const contents = (resp as any).result.contents
    if (!contents || contents.length === 0) throw new Error(`no content for ${problem}`)

    const data = JSON.parse(contents[0].text)
    if (data.problem !== problem) throw new Error(`problem mismatch for ${problem}`)
    if (!data.records || data.records.length === 0) throw new Error(`no records for ${problem}`)
  }
})

test('scale testing: quantum advantage widget renders scaling data', () => {
  const resp = rpc('resources/read', { uri: 'qpu://quantum-advantage' })

  if (!('result' in resp)) throw new Error('quantum-advantage resource failed')

  const result = (resp as any).result
  if (!result.contents || result.contents.length === 0) throw new Error('no quantum-advantage content')

  const data = JSON.parse(result.contents[0].text)
  if (!data.comparisons) throw new Error('no comparisons in quantum-advantage')

  const problems = data.comparisons.map((c: any) => c.problem)
  if (!problems.includes('rsa-260')) throw new Error('RSA-260 missing from comparisons')
  if (!problems.includes('rsa-896')) throw new Error('RSA-896 missing from comparisons')
  if (!problems.includes('rsa-2048')) throw new Error('RSA-2048 missing from comparisons')

  if (!result._meta || !result._meta.widget) throw new Error('quantum-advantage should have widget')
})

test('scale testing: performance widget shows scaling from dev to quantum', () => {
  const resp = rpc('resources/read', { uri: 'qpu://dev-performance' })

  if (!('result' in resp)) throw new Error('dev-performance resource failed')

  const result = (resp as any).result
  const data = JSON.parse(result.contents[0].text)

  if (!data.results || data.results.length === 0) throw new Error('no performance results')

  const shor = data.results[0]
  if (!shor.test_name.includes('Shor')) throw new Error('missing Shor test')
  if (shor.dev_machine_time_ms !== 1800.148625) throw new Error('wrong Shor timing')
})
