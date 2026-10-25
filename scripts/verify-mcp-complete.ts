// Comprehensive MCP verification: test all resources, tools, and templates via MCP protocol
import { handle } from '../src/quantum/mcp.js'

interface TestResult {
  name: string
  passed: boolean
  error?: string
}

const results: TestResult[] = []

const test = async (name: string, fn: () => void): Promise<void> => {
  try {
    fn()
    results.push({ name, passed: true })
    console.log(`✓ ${name}`)
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e)
    results.push({ name, passed: false, error })
    console.log(`✗ ${name}: ${error}`)
  }
}

const rpc = (method: string, params?: unknown) => handle({ jsonrpc: '2.0', id: 1, method, params })

const verify = async () => {
  console.log('=== Comprehensive MCP Verification ===\n')

  // === ROOT RESOURCES ===
  console.log('ROOT RESOURCES:')

  test('qpu://rsa lists all problems', () => {
    const r = rpc('resources/read', { uri: 'qpu://rsa' })
    if (!('result' in r)) throw new Error('no result')
    const data = JSON.parse((r.result as any).contents[0].text) as { problems: string[]; total: number }
    if (data.problems.length < 4) throw new Error(`expected 4+ problems, got ${data.problems.length}`)
    if (!data.problems.includes('rsa-260')) throw new Error('rsa-260 missing')
    if (!data.problems.includes('rsa-896')) throw new Error('rsa-896 missing')
  })

  test('qpu://classical-methods lists all factorization algorithms', () => {
    const r = rpc('resources/read', { uri: 'qpu://classical-methods' })
    if (!('result' in r)) throw new Error('no result')
    const data = JSON.parse((r.result as any).contents[0].text) as { methods: Record<string, { name: string; complexity: string }> }
    const methodKeys = Object.keys(data.methods)
    if (methodKeys.length < 7) throw new Error(`expected 7+ methods, got ${methodKeys.length}`)
    if (!data.methods.number_field_sieve) throw new Error('NFS not found')
  })

  test('qpu://research-open lists unresolved items', () => {
    const r = rpc('resources/read', { uri: 'qpu://research-open' })
    if (!('result' in r)) throw new Error('no result')
    const data = JSON.parse((r.result as any).contents[0].text) as { items: Record<string, { id: string; status: string; requires: string[] }> }
    if (!data.items.perCoreNormalization) throw new Error('per-core normalization not found')
    if (!data.items.classicalMethodSurvey) throw new Error('classical method survey not found')
  })

  test('qpu://quantumlib lists all packages', () => {
    const r = rpc('resources/read', { uri: 'qpu://quantumlib' })
    if (!('result' in r)) throw new Error('no result')
    const data = JSON.parse((r.result as any).contents[0].text) as { packages: Array<{ name: string }> }
    if (data.packages.length === 0) throw new Error('no packages')
    if (!data.packages.some((p) => p.name === 'Cirq')) throw new Error('Cirq not found')
  })

  test('qpu://hooks returns tool hooks structure', () => {
    const r = rpc('resources/read', { uri: 'qpu://hooks' })
    if (!('result' in r)) throw new Error('no result')
    const data = JSON.parse((r.result as any).contents[0].text) as { kind: string }
    if (data.kind !== 'tool-hooks') throw new Error('wrong kind')
  })

  test('qpu://schema returns families schema', () => {
    const r = rpc('resources/read', { uri: 'qpu://schema' })
    if (!('result' in r)) throw new Error('no result')
    const data = JSON.parse((r.result as any).contents[0].text) as { kind: string }
    if (data.kind !== 'schema') throw new Error('wrong kind')
  })

  test('qpu://readme returns documentation', () => {
    const r = rpc('resources/read', { uri: 'qpu://readme' })
    if (!('result' in r)) throw new Error('no result')
    const text = (r.result as any).contents[0].text
    if (!text.includes('QPU')) throw new Error('readme missing content')
  })

  // === PARAMETRIC RESOURCES: RSA PROBLEMS ===
  console.log('\nPARAMETRIC RESOURCES (RSA PROBLEMS):')

  test('qpu://rsa/rsa-260 returns all methods for problem', () => {
    const r = rpc('resources/read', { uri: 'qpu://rsa/rsa-260' })
    if (!('result' in r)) throw new Error('no result')
    const data = JSON.parse((r.result as any).contents[0].text) as { problem: string; records: Array<{ method: string }> }
    if (data.problem !== 'rsa-260') throw new Error('wrong problem')
    if (data.records.length === 0) throw new Error('no records')
  })

  test('qpu://rsa/rsa-896 returns all methods for problem', () => {
    const r = rpc('resources/read', { uri: 'qpu://rsa/rsa-896' })
    if (!('result' in r)) throw new Error('no result')
    const data = JSON.parse((r.result as any).contents[0].text) as { problem: string; records: Array<{ method: string; year: number }> }
    if (data.problem !== 'rsa-896') throw new Error('wrong problem')
    if (!data.records.some((r) => r.method === 'classical-gnfs')) throw new Error('classical-gnfs not found')
  })

  test('qpu://rsa/rsa-250 returns all methods', () => {
    const r = rpc('resources/read', { uri: 'qpu://rsa/rsa-250' })
    if (!('result' in r)) throw new Error('no result')
    const data = JSON.parse((r.result as any).contents[0].text) as { problem: string }
    if (data.problem !== 'rsa-250') throw new Error('wrong problem')
  })

  test('qpu://rsa/rsa-768 returns all methods', () => {
    const r = rpc('resources/read', { uri: 'qpu://rsa/rsa-768' })
    if (!('result' in r)) throw new Error('no result')
    const data = JSON.parse((r.result as any).contents[0].text) as { problem: string }
    if (data.problem !== 'rsa-768') throw new Error('wrong problem')
  })

  // === PARAMETRIC RESOURCES: RSA METHODS ===
  console.log('\nPARAMETRIC RESOURCES (RSA METHODS):')

  test('qpu://rsa/rsa-260/classical-gnfs returns specific record', () => {
    const r = rpc('resources/read', { uri: 'qpu://rsa/rsa-260/classical-gnfs' })
    if (!('result' in r)) throw new Error('no result')
    const data = JSON.parse((r.result as any).contents[0].text) as { problem: string; method: string; effort: { value: number; unit: string } }
    if (data.problem !== 'rsa-260') throw new Error('wrong problem')
    if (data.method !== 'classical-gnfs') throw new Error('wrong method')
    if (data.effort.value !== 4900) throw new Error('wrong effort value')
  })

  test('qpu://rsa/rsa-896/classical-gnfs returns specific record', () => {
    const r = rpc('resources/read', { uri: 'qpu://rsa/rsa-896/classical-gnfs' })
    if (!('result' in r)) throw new Error('no result')
    const data = JSON.parse((r.result as any).contents[0].text) as { problem: string; method: string; year: number; verification: { status: string } }
    if (data.problem !== 'rsa-896') throw new Error('wrong problem')
    if (data.method !== 'classical-gnfs') throw new Error('wrong method')
    if (data.verification.status !== 'unverified') throw new Error('wrong verification status')
  })

  test('qpu://rsa/rsa-2048/quantum-advantage returns extrapolated record', () => {
    const r = rpc('resources/read', { uri: 'qpu://rsa/rsa-2048/quantum-advantage' })
    if (!('result' in r)) throw new Error('no result')
    const data = JSON.parse((r.result as any).contents[0].text) as { problem: string; method: string; effort: { estimated: boolean } }
    if (data.problem !== 'rsa-2048') throw new Error('wrong problem')
    if (data.effort.estimated !== true) throw new Error('should be estimated')
  })

  // === PARAMETRIC RESOURCES: QUANTUMLIB PACKAGES ===
  console.log('\nPARAMETRIC RESOURCES (QUANTUMLIB PACKAGES):')

  test('qpu://quantumlib/cirq returns package details', () => {
    const r = rpc('resources/read', { uri: 'qpu://quantumlib/cirq' })
    if (!('result' in r)) throw new Error('no result')
    const data = JSON.parse((r.result as any).contents[0].text) as { name: string; language: string }
    if (data.name !== 'Cirq') throw new Error('wrong name')
    if (data.language !== 'Python') throw new Error('wrong language')
  })

  test('qpu://quantumlib/stim returns package details', () => {
    const r = rpc('resources/read', { uri: 'qpu://quantumlib/stim' })
    if (!('result' in r)) throw new Error('no result')
    const data = JSON.parse((r.result as any).contents[0].text) as { name: string; language: string }
    if (data.name !== 'Stim') throw new Error('wrong name')
    if (data.language !== 'C++') throw new Error('wrong language')
  })

  // === RESOURCE LISTING ===
  console.log('\nRESOURCE LISTING:')

  test('resources/list returns all core resources', () => {
    const r = rpc('resources/list')
    if (!('result' in r)) throw new Error('no result')
    const data = r.result as { resources: Array<{ uri: string }>; templates: Array<{ uriTemplate: string }> }
    const uris = data.resources.map((r) => r.uri)
    if (!uris.includes('qpu://rsa')) throw new Error('qpu://rsa missing')
    if (!uris.includes('qpu://classical-methods')) throw new Error('qpu://classical-methods missing')
    if (!uris.includes('qpu://research-open')) throw new Error('qpu://research-open missing')
    if (!uris.includes('qpu://quantumlib')) throw new Error('qpu://quantumlib missing')
    if (uris.length < 6) throw new Error(`expected 6+ resources, got ${uris.length}`)
  })

  test('resources/list returns all templates', () => {
    const r = rpc('resources/list')
    if (!('result' in r)) throw new Error('no result')
    const data = r.result as { templates: Array<{ uriTemplate: string }> }
    const templates = data.templates.map((t) => t.uriTemplate)
    if (!templates.includes('qpu://rsa/{problem}')) throw new Error('rsa problem template missing')
    if (!templates.includes('qpu://rsa/{problem}/{method}')) throw new Error('rsa method template missing')
    if (!templates.includes('qpu://quantumlib/{id}')) throw new Error('quantumlib template missing')
  })

  // === TOOLS ===
  console.log('\nTOOLS:')

  test('tools/list returns all tools', () => {
    const r = rpc('tools/list')
    if (!('result' in r)) throw new Error('no result')
    const data = r.result as { tools: Array<{ name: string }> }
    const toolNames = data.tools.map((t) => t.name)
    if (!toolNames.includes('processor')) throw new Error('processor tool missing')
    if (!toolNames.includes('quantumlib')) throw new Error('quantumlib tool missing')
    if (!toolNames.includes('repositories')) throw new Error('repositories tool missing')
    if (toolNames.length < 11) throw new Error(`expected 11+ tools, got ${toolNames.length}`)
  })

  test('processor tool returns Willow specs', () => {
    const r = rpc('tools/call', { name: 'processor', arguments: { name: 'Willow' } })
    if (!('result' in r)) throw new Error('no result')
    const data = (r.result as any).structuredContent as { qubits: number; statedAverageConnectivity: number }
    if (data.qubits !== 105) throw new Error(`expected 105 qubits, got ${data.qubits}`)
  })

  test('quantumlib tool returns repositories', () => {
    const r = rpc('tools/call', { name: 'quantumlib', arguments: {} })
    if (!('result' in r)) throw new Error('no result')
    const data = (r.result as any).structuredContent as { total: number }
    if (data.total !== 15) throw new Error(`expected 15 repos, got ${data.total}`)
  })

  test('repositories tool returns quantumlib count', () => {
    const r = rpc('tools/call', { name: 'repositories', arguments: {} })
    if (!('result' in r)) throw new Error('no result')
    const data = (r.result as any).structuredContent as { total: number }
    if (data.total !== 15) throw new Error(`expected 15 repos, got ${data.total}`)
  })

  test('leads tool returns coverage counts', () => {
    const r = rpc('tools/call', { name: 'leads', arguments: {} })
    if (!('result' in r)) throw new Error('no result')
    const data = (r.result as any).structuredContent as { total: number; counts: { served: number } }
    if (data.total !== 94) throw new Error(`expected 94 leads, got ${data.total}`)
    if (data.counts.served < 80) throw new Error(`expected 80+ served, got ${data.counts.served}`)
  })

  test('circuit tool accepts operations', () => {
    const r = rpc('tools/call', {
      name: 'circuit',
      arguments: { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }] },
    })
    if (!('result' in r)) throw new Error('no result')
    const data = (r.result as any).structuredContent as { qubits: string[] }
    if (!data.qubits || data.qubits.length === 0) throw new Error('no qubits returned')
  })

  // === SUMMARY ===
  console.log(`\n=== SUMMARY ===`)
  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length
  const total = results.length

  console.log(`\n${passed}/${total} tests passed`)
  if (failed > 0) {
    console.log(`\nFailed tests:`)
    results.filter((r) => !r.passed).forEach((r) => {
      console.log(`  - ${r.name}: ${r.error}`)
    })
  }

  return failed === 0
}

verify().then((ok) => process.exit(ok ? 0 : 1))
