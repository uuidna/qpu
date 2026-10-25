// Combinatorial Documentation Generator (JavaScript)
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ADAPTERS = [
  { name: 'git', category: 'cicd', ops: ['clone', 'commit', 'push', 'pull'] },
  { name: 'github', category: 'cicd', ops: ['release', 'issue', 'pr', 'action'] },
  { name: 'zenodo', category: 'cicd', ops: ['deposit', 'publish', 'list', 'metadata'] },
  { name: 'npm', category: 'cicd', ops: ['publish', 'list', 'info', 'install'] },
  { name: 'deploy', category: 'cloud', ops: ['vercel', 'railway', 'flyio', 'status'] },
  { name: 'ibm-qiskit', category: 'quantum', ops: ['submit', 'results', 'cancel', 'backends'] },
  { name: 'aws-braket', category: 'quantum', ops: ['task', 'result', 'device', 'devices'] },
  { name: 'ionq', category: 'quantum', ops: ['job', 'get-job', 'list-jobs', 'properties'] },
]

const BENCHMARKS = [
  { id: 'bell-state', name: 'Bell State', diff: 'easy', qubits: 2 },
  { id: 'ghz-3qubit', name: 'GHZ State', diff: 'easy', qubits: 3 },
  { id: 'deutsch-jozsa', name: 'Deutsch-Jozsa', diff: 'medium', qubits: 2 },
  { id: 'grover-search', name: 'Grover Search', diff: 'medium', qubits: 2 },
  { id: 'qft-3qubit', name: 'QFT', diff: 'medium', qubits: 3 },
  { id: 'qaoa-maxcut', name: 'QAOA Max-Cut', diff: 'hard', qubits: 3 },
  { id: 'shor-15', name: 'Shor 15', diff: 'expert', qubits: 4 },
  { id: 'vqe-h2', name: 'VQE H2', diff: 'expert', qubits: 2 },
]

const PROVIDERS = [
  { name: 'IBM Quantum', error: '~0.1%', qubits: '5-433' },
  { name: 'AWS Braket', error: '~0.15%', qubits: '3-30' },
  { name: 'IonQ', error: '~0.2%', qubits: '11-29' },
  { name: 'Rigetti', error: '~0.3%', qubits: '30+' },
]

function ensureDirs() {
  const dirs = ['docs/guide', 'docs/api', 'docs/testing', 'docs/reference']
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  })
}

function genQuickStart() {
  return `# Quick Start

## Register API

\`\`\`javascript
await mcpTool('endpoint/register', {
  name: 'github',
  method: 'POST',
  url: 'https://api.github.com/repos/user/repo/releases',
  auth: { type: 'bearer', token: process.env.GITHUB_TOKEN }
})

await mcpTool('adapter/create', { name: 'github' })

await mcpTool('adapter/register-operation', {
  adapterName: 'github',
  operationName: 'create-release',
  endpointName: 'github'
})
\`\`\`

## Run Benchmark

\`\`\`javascript
await mcpTool('quantum/run-benchmark', {
  benchmarkId: 'bell-state',
  provider: 'ibm-quantum'
})
\`\`\`

## Test All Providers

\`\`\`javascript
await mcpTool('quantum/run-interop-test', {
  benchmarks: ['bell-state'],
  providers: ['ibm-quantum', 'aws-braket', 'ionq']
})
\`\`\`
`
}

function genBenchmarks() {
  const byDiff = {}
  BENCHMARKS.forEach(b => {
    if (!byDiff[b.diff]) byDiff[b.diff] = []
    byDiff[b.diff].push(b)
  })

  let doc = `# Quantum Benchmarks\n\n`
  Object.entries(byDiff).forEach(([diff, benchmarks]) => {
    doc += `## ${diff.charAt(0).toUpperCase() + diff.slice(1)}\n\n`
    benchmarks.forEach(b => {
      doc += `- **${b.name}** (\`${b.id}\`, ${b.qubits} qubits)\n`
    })
    doc += '\n'
  })
  return doc
}

function genTools() {
  return `# MCP Tools

## Dynamic Adapters

### endpoint/register
Register an API endpoint

### adapter/create
Create a new adapter

### adapter/register-operation
Wire operation to endpoint

### adapter/execute
Execute operation

## Quantum Testing

### quantum/list-benchmarks
List available benchmarks

### quantum/run-benchmark
Run circuit on provider

### quantum/run-interop-test
Test across providers

### quantum/compare-providers
Compare provider metrics

### quantum/certify-compatibility
Certify circuit compatibility

### quantum/generate-report
Generate test report

## Registry

### registry/list-endpoints
List registered endpoints

### registry/list-adapters
List created adapters

### registry/describe-adapter
Describe adapter details

### registry/execution-history
View execution history
`
}

function genAdapters() {
  const byCat = {}
  ADAPTERS.forEach(a => {
    if (!byCat[a.category]) byCat[a.category] = []
    byCat[a.category].push(a)
  })

  let doc = `# Available Adapters\n\n`
  Object.entries(byCat).forEach(([cat, adapters]) => {
    doc += `## ${cat.toUpperCase()}\n\n`
    adapters.forEach(a => {
      doc += `- **${a.name}**: ${a.ops.join(', ')}\n`
    })
    doc += '\n'
  })
  return doc
}

function genProviders() {
  let doc = `# Quantum Providers\n\n| Provider | Error | Qubits |\n|----------|-------|--------|\n`
  PROVIDERS.forEach(p => {
    doc += `| ${p.name} | ${p.error} | ${p.qubits} |\n`
  })
  return doc
}

function generate() {
  console.log('📖 Generating documentation...\n')

  ensureDirs()

  const files = [
    ['docs/guide/quick-start.md', genQuickStart()],
    ['docs/reference/benchmarks.md', genBenchmarks()],
    ['docs/reference/providers.md', genProviders()],
    ['docs/reference/adapters.md', genAdapters()],
    ['docs/api/tools.md', genTools()],
  ]

  files.forEach(([file, content]) => {
    fs.writeFileSync(file, content)
    console.log(`✓ ${file}`)
  })

  console.log(`\n✅ Generated ${files.length} files`)
}

generate()

export { ADAPTERS, BENCHMARKS, PROVIDERS }
