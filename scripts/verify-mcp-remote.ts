// Verify MCP functionality against remote datasets: quantumai.google and github.com/quantumlib
import { handle } from '../src/quantum/mcp.js'

const test = async (name: string, fn: () => void): Promise<boolean> => {
  try {
    fn()
    console.log(`✓ ${name}`)
    return true
  } catch (e) {
    console.log(`✗ ${name}: ${e instanceof Error ? e.message : String(e)}`)
    return false
  }
}

const rpc = (method: string, params?: unknown) => handle({ jsonrpc: '2.0', id: 1, method, params })

const verify = async () => {
  let passed = 0
  let failed = 0

  // Test tools/list
  if (await test('tools/list returns all MCP tools', () => {
    const r = rpc('tools/list')
    if (!('result' in r)) throw new Error('no result')
    const tools = (r.result as { tools: { name: string }[] }).tools
    if (tools.length < 11) throw new Error(`expected 11+ tools, got ${tools.length}`)
    if (!tools.map((t) => t.name).includes('quantumlib')) throw new Error('quantumlib tool missing')
  }))
    passed++
  else failed++

  // Test resources/list
  if (await test('resources/list returns MCP resources', () => {
    const r = rpc('resources/list')
    if (!('result' in r)) throw new Error('no result')
    const result = r.result as { resources: { uri: string }[]; templates: { uriTemplate: string }[] }
    if (!result.resources.some((r) => r.uri === 'qpu://rsa')) throw new Error('rsa resource missing')
    if (!result.resources.some((r) => r.uri === 'qpu://classical-methods')) throw new Error('classical-methods resource missing')
    if (!result.resources.some((r) => r.uri === 'qpu://research-open')) throw new Error('research-open resource missing')
    if (!result.resources.some((r) => r.uri === 'qpu://quantumlib')) throw new Error('quantumlib resource missing')
    if (!result.templates.some((t) => t.uriTemplate === 'qpu://rsa/{problem}')) throw new Error('rsa problem template missing')
    if (!result.templates.some((t) => t.uriTemplate === 'qpu://rsa/{problem}/{method}')) throw new Error('rsa method template missing')
    if (!result.templates.some((t) => t.uriTemplate === 'qpu://quantumlib/{id}')) throw new Error('quantumlib template missing')
  }))
    passed++
  else failed++

  // Test processor tool (remote: Google Quantum AI)
  if (await test('processor tool returns Willow specs from quantumai.google', () => {
    const r = rpc('tools/call', { name: 'processor', arguments: { name: 'Willow' } })
    if (!('result' in r)) throw new Error('no result')
    const data = (r.result as { structuredContent: { qubits: number; statedAverageConnectivity: number } }).structuredContent
    if (data.qubits !== 105) throw new Error(`expected 105 qubits, got ${data.qubits}`)
    if (Math.abs(data.statedAverageConnectivity - 3.47) > 0.01) throw new Error(`expected 3.47 connectivity, got ${data.statedAverageConnectivity}`)
  }))
    passed++
  else failed++

  // Test quantumlib tool (remote: github.com/quantumlib)
  if (await test('quantumlib tool lists repositories from github.com/quantumlib', () => {
    const r = rpc('tools/call', { name: 'quantumlib', arguments: {} })
    if (!('result' in r)) throw new Error('no result')
    const data = (r.result as { structuredContent: { total: number; filtered: number } }).structuredContent
    if (data.total !== 15) throw new Error(`expected 15 quantumlib repos, got ${data.total}`)
    if (data.filtered <= 0) throw new Error(`no repositories filtered`)
  }))
    passed++
  else failed++

  // Test quantumlib filtering
  if (await test('quantumlib tool filters Cirq by name', () => {
    const r = rpc('tools/call', { name: 'quantumlib', arguments: { repository: 'Cirq' } })
    if (!('result' in r)) throw new Error('no result')
    const data = (r.result as { structuredContent: { repositories: { name: string }[] } }).structuredContent
    if (!data.repositories.some((r) => r.name === 'Cirq')) throw new Error('Cirq not found')
  }))
    passed++
  else failed++

  // Test repositories tool
  if (await test('repositories tool lists quantumlib packages', () => {
    const r = rpc('tools/call', { name: 'repositories', arguments: {} })
    if (!('result' in r)) throw new Error('no result')
    const data = (r.result as { structuredContent: { total: number } }).structuredContent
    if (data.total !== 15) throw new Error(`expected 15 repos, got ${data.total}`)
  }))
    passed++
  else failed++

  // Test resources/read for RSA records
  if (await test('resources/read returns RSA factorization records', () => {
    const r = rpc('resources/read', { uri: 'qpu://rsa/rsa-260' })
    if (!('result' in r)) throw new Error('no result')
    const result = r.result as { contents: { text: string }[] }
    const data = JSON.parse(result.contents[0]!.text) as { problem: string; records: Array<{ bits: number; method: string; year: number }> }
    if (data.problem !== 'rsa-260') throw new Error('problem should be rsa-260')
    if (!data.records || data.records.length === 0) throw new Error('no records returned')
    if (!data.records.some((r) => r.method === 'classical-gnfs')) throw new Error('classical-gnfs method not found')
  }))
    passed++
  else failed++

  // Test resources/read for classical methods
  if (await test('resources/read returns classical factorization methods', () => {
    const r = rpc('resources/read', { uri: 'qpu://classical-methods' })
    if (!('result' in r)) throw new Error('no result')
    const result = r.result as { contents: { text: string }[] }
    const data = JSON.parse(result.contents[0]!.text) as { methods: Record<string, { name: string; complexity: string }> }
    if (!data.methods) throw new Error('no methods returned')
    if (!data.methods.number_field_sieve) throw new Error('NFS not found in methods')
    if (data.methods.number_field_sieve.name !== 'Number Field Sieve') throw new Error('NFS name incorrect')
  }))
    passed++
  else failed++

  // Test resources/read for classical method survey
  if (await test('resources/read returns classical method survey', () => {
    const r = rpc('resources/read', { uri: 'qpu://classical-survey' })
    if (!('result' in r)) throw new Error('no result')
    const result = r.result as { contents: { text: string }[] }
    const data = JSON.parse(result.contents[0]!.text) as { survey: Record<string, { methods_tested: { method: string }[] }> }
    if (!data.survey) throw new Error('no survey returned')
    if (!data.survey['rsa-260']) throw new Error('rsa-260 survey missing')
    if (data.survey['rsa-260'].methods_tested.length === 0) throw new Error('no methods tested for rsa-260')
    const hasGNFS = data.survey['rsa-260'].methods_tested.some((m) => m.method.includes('GNFS'))
    if (!hasGNFS) throw new Error('GNFS not found in methods tested')
  }))
    passed++
  else failed++

  // Test resources/read for SPEC benchmarks
  if (await test('resources/read returns SPEC CPU benchmarks', () => {
    const r = rpc('resources/read', { uri: 'qpu://spec-benchmarks' })
    if (!('result' in r)) throw new Error('no result')
    const result = r.result as { contents: { text: string }[] }
    const data = JSON.parse(result.contents[0]!.text) as {
      xeon_gold_6130: { processor: string; spec_cpu2017_speed_int_base: number }
      opteron_2214: { processor: string; spec_cpu2006_int_base: number }
    }
    if (!data.xeon_gold_6130) throw new Error('xeon gold 6130 missing')
    if (data.xeon_gold_6130.spec_cpu2017_speed_int_base !== 8.77) throw new Error('wrong xeon spec value')
    if (!data.opteron_2214) throw new Error('opteron 2214 missing')
    if (data.opteron_2214.spec_cpu2006_int_base !== 10.4) throw new Error('wrong opteron spec value')
  }))
    passed++
  else failed++

  // Test resources/read for open research items
  if (await test('resources/read returns open research items', () => {
    const r = rpc('resources/read', { uri: 'qpu://research-open' })
    if (!('result' in r)) throw new Error('no result')
    const result = r.result as { contents: { text: string }[] }
    const data = JSON.parse(result.contents[0]!.text) as { items: Record<string, { id: string; status: string }> }
    if (!data.items) throw new Error('no items returned')
    if (!data.items.perCoreNormalization) throw new Error('per-core normalization item missing')
    if (data.items.perCoreNormalization.status !== 'open') throw new Error('status not open (should be updated to reflect research)')
  }))
    passed++
  else failed++

  // Test resources/read for quantumlib
  if (await test('resources/read returns quantumlib packages', () => {
    const r = rpc('resources/read', { uri: 'qpu://quantumlib' })
    if (!('result' in r)) throw new Error('no result')
    const result = r.result as { contents: { text: string }[] }
    const data = JSON.parse(result.contents[0]!.text) as { packages: { name: string }[] }
    if (data.packages.length === 0) throw new Error(`no packages returned`)
    if (!data.packages.some((p) => p.name === 'Cirq')) throw new Error(`Cirq not found`)
  }))
    passed++
  else failed++

  // Test parametric resource
  if (await test('resources/read/{id} returns individual quantumlib package', () => {
    const r = rpc('resources/read', { uri: 'qpu://quantumlib/cirq' })
    if (!('result' in r)) throw new Error('no result')
    const result = r.result as { contents: { text: string }[] }
    const data = JSON.parse(result.contents[0]!.text) as { name: string; repo: string }
    if (data.name !== 'Cirq') throw new Error(`expected Cirq, got ${data.name}`)
    if (!data.repo.includes('quantumlib')) throw new Error(`repo should reference quantumlib`)
  }))
    passed++
  else failed++

  // Test leads tool
  if (await test('leads tool reports 94 leads with quantumlib coverage', () => {
    const r = rpc('tools/call', { name: 'leads', arguments: {} })
    if (!('result' in r)) throw new Error('no result')
    const data = (r.result as { structuredContent: { total: number; counts: { served: number } } }).structuredContent
    if (data.total !== 94) throw new Error(`expected 94 leads, got ${data.total}`)
    if (data.counts.served < 80) throw new Error(`expected 80+ served leads, got ${data.counts.served}`)
  }))
    passed++
  else failed++

  // Test circuit tool with Willow device (hardware constraint validation)
  if (await test('circuit tool validates against Willow device constraints', () => {
    const r = rpc('tools/call', {
      name: 'circuit',
      arguments: {
        operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }],
      },
    })
    if (!('result' in r)) throw new Error('no result')
    const data = (r.result as { structuredContent: { qubits: string[] } }).structuredContent
    if (!data.qubits || data.qubits.length === 0) throw new Error('circuit should return qubits')
  }))
    passed++
  else failed++

  console.log(`\n${passed}/${passed + failed} verification tests passed`)
  return failed === 0
}

verify().then((ok) => process.exit(ok ? 0 : 1))
