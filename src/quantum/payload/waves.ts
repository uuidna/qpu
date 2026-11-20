// Payload seeds, one ISO wave and then the next. A quantum wave is a clause of ISO/IEC 4879:2024.
// Each wave discovers its own pages and improves the following wave. CI and CD are pages of the last wave.
// A program is the ZFS object of its handle: eight nibble levels, depth 7.
import { WORKFLOWS } from '../processing/config-index.ts'
import { PROSE, proseFill } from '../processing/prose-index.ts'
import { place } from '../fs/index.ts'
import { leadResearch } from '../processing/discovery.ts'
import { pageSeed } from '../processing/page-seed.ts'
import { ISO_DIMENSIONS } from '../processing/standards.ts'
import { QUANTUM_TERMS } from '../processing/quantum-vocabulary.ts'
import { utf8 } from '../processing/unit/hmac.ts'
import { HARMONICS, KEY } from '../processing/unit/theme.ts'
import { DEPLOY_STAGES, type DeployStage } from './deploy.ts'

export { DEPLOY_STAGES }

export const STANDARD_HZ = 440

/** The workflows the repository door names, from Lean. */
const CI_WORKFLOWS = WORKFLOWS

const CHECKOUT = 'actions/checkout@fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09 # v5'
const PNPM = PROSE.quantumPayloadWaves_s1
const NODE = PROSE.quantumPayloadWaves_s2

export const a432Drift = (stated: number) => {
  const computes = KEY
  const sure = stated !== computes
  const because = proseFill(PROSE.quantumPayloadWaves_s3, stated, computes, computes)
  return { stated, computes, sure, novel: sure, because, harmonics: [...HARMONICS], voice: 'author' as const, tree: false as const }
}

export const driftResearch = (drifts: readonly { stated: number; source: string }[]) => drifts.map((row) => ({
  id: `a432-${row.source.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${row.stated}`,
  method: 'GET' as const,
  url: `https://api.openalex.org/works?search=${encodeURIComponent(`${row.stated} Hz`)}&filter=has_doi:true&per-page=25`,
  accept: 'application/json' as const,
}))

const sectionOf = (clause: string) => clause.split('.').slice(0, 2).join('.')

/** The program is the object the filesystem adapter places. Eight levels, fanout 16, every handle. */
const programWays = (text: string) => {
  const bytes = utf8(text).length
  const handle = (BigInt(bytes) & 0xffffffffn).toString(16).padStart(8, '0')
  const object = place(handle)
  return { handle, bytes, path: object.path, depth: object.depth, steps: object.count, chosen: object.pkg, fanout: object.fanout, span: object.span }
}

export const waveDiscovery = (examples: readonly string[] = []) => ({
  fetched: false as const,
  manual: false as const,
  terms: QUANTUM_TERMS.length,
  workflows: CI_WORKFLOWS.length,
  dimensions: ISO_DIMENSIONS.length,
  examples: examples.length,
  requestList: [
    ...leadResearch().map((row) => ({ id: row.id, method: row.method, url: row.url, accept: row.name === 'cern-opendata' ? 'application/json' as const : row.name === 'nist-codata' ? 'text/plain' as const : 'text/html' as const })),
    ...driftResearch([{ stated: STANDARD_HZ, source: 'ISO 16' }]),
    { id: 'github-workflows', method: 'GET' as const, url: 'https://api.github.com/repos/uuidna/qpu/actions/workflows', accept: 'application/json' as const },
  ],
})

const publish = (page: ReturnType<typeof pageSeed>) => ({ ...page, _status: 'published' as const })

export const seedWaves = (examples: readonly string[] = []) => {
  const drift = a432Drift(STANDARD_HZ)
  const discovery = waveDiscovery(examples)
  const sections = [...new Set(QUANTUM_TERMS.map((term) => sectionOf(term.clause)))]
  const names = ['home', 'standards', ...sections, 'cicd']
  const improves = (name: string) => names[(names.indexOf(name) + 1) % names.length]!
  const requests = discovery.requestList
  const homeText = PROSE.quantumPayloadWaves_s4
  const homeProgram = programWays(homeText)
  const home = {
    name: 'home',
    standard: 'ISO/IEC 4879:2024' as const,
    improves: improves('home'),
    discovered: 1,
    compute: homeProgram,
    pages: [
      publish(pageSeed('home', `${homeText}\nThe program ${homeProgram.handle} is at ${homeProgram.path}.`)),
      pageSeed('nil uuid', PROSE.quantumPayloadWaves_s5),
    ],
  }
  const standards = {
    name: 'standards',
    standard: 'ISO' as const,
    improves: improves('standards'),
    discovered: ISO_DIMENSIONS.length,
    compute: programWays(ISO_DIMENSIONS.join('\n')),
    pages: [
      ...ISO_DIMENSIONS.map((dimension) => pageSeed(dimension, dimension === 'ISO 16'
        ? proseFill(PROSE.quantumPayloadWaves_s6, drift.because, drift.harmonics.join(', '), improves('standards'))
        : proseFill(PROSE.quantumPayloadWaves_s7, dimension, improves('standards')))),
      pageSeed('A432 drift', proseFill(PROSE.quantumPayloadWaves_s8, drift.because, drift.harmonics.join(', '))),
      pageSeed('A432 research', `Nothing is fetched here.\n${requests.map((row) => `${row.method} ${row.url}`).join('\n')}\nExamples: ${examples.length ? examples.join(', ') : 'the standards above'}.`),
    ],
  }
  const quantum = sections.map((section) => {
    const terms = QUANTUM_TERMS.filter((term) => sectionOf(term.clause) === section)
    const text = terms.map((term) => `${term.clause} ${term.name}`).join('\n')
    const compute = programWays(text)
    return {
      name: section,
      standard: 'ISO/IEC 4879:2024' as const,
      improves: improves(section),
      discovered: terms.length,
      compute,
      pages: [
        ...terms.map((term) => pageSeed(`${term.clause} ${term.name}`, proseFill(PROSE.quantumPayloadWaves_s9, term.standard, term.clause, term.name, improves(section), compute.handle))),
        pageSeed(`program ${section}`, proseFill(PROSE.quantumPayloadWaves_s10, compute.handle, compute.path, compute.chosen, compute.steps, 256 * 8)),
      ],
    }
  })
  const cicdText = [...CI_WORKFLOWS, ...DEPLOY_STAGES.map((stage) => stage.run)].join('\n')
  const cicdProgram = programWays(cicdText)
  const cicd = {
    name: 'cicd',
    standard: 'ISO/IEC/IEEE 12207:2017' as const,
    improves: improves('cicd'),
    discovered: CI_WORKFLOWS.length + DEPLOY_STAGES.length,
    compute: cicdProgram,
    pages: [
      ...CI_WORKFLOWS.map((name) => pageSeed(`ci ${name}`, proseFill(PROSE.quantumPayloadWaves_s11, name, improves('cicd')))),
      ...DEPLOY_STAGES.map((stage) => pageSeed(`deploy ${stage.id}`, proseFill(PROSE.quantumPayloadWaves_s12, stage.says, stage.run, cicdProgram.handle, cicdProgram.path))),
    ],
  }
  return [home, standards, ...quantum, cicd]
}

/** The GitHub workflow, as the Payload stages name it. The pins stay. The seed is one session. */
export const deployWorkflow = (waves = seedWaves()) => `# Deploy Worker qpu from main, or when started by hand. Payload names the stages. The runner decides nothing.
# Waves, one session: games, ${waves.map((wave) => wave.name).join(', ')}. Each wave improves the next, and cicd improves home.
# Secrets, by name only: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, PAYLOAD_SECRET, and for the first admin QPU_ADMIN_EMAIL, QPU_ADMIN_PASSWORD.
name: deploy
on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      modules:
        description: Lean modules to seed and check, comma separated. Empty seeds the whole catalogue.
        type: string
        default: ''
permissions:
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    # a newer deploy carries everything an older one would write, and the seed and the migration skip what already agrees:
    # the newer one takes over instead of waiting
    concurrency:
      group: deploy
      cancel-in-progress: true
    env:
      CLOUDFLARE_API_TOKEN: \${{ secrets.CLOUDFLARE_API_TOKEN }}
      CLOUDFLARE_ACCOUNT_ID: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      PAYLOAD_SECRET: \${{ secrets.PAYLOAD_SECRET }}
      QPU_ADMIN_EMAIL: \${{ secrets.QPU_ADMIN_EMAIL }}
      QPU_ADMIN_PASSWORD: \${{ secrets.QPU_ADMIN_PASSWORD }}
      # a deploy started by hand may seed and check only the modules it names; a push seeds the whole catalogue
      SEED_MODULES: \${{ inputs.modules }}
    steps:
      - uses: ${CHECKOUT}
      - uses: ${PNPM}
        with:
          version: 10.34.9
      - uses: ${NODE}
        with:
          node-version: 26
          cache: pnpm
      - run: pnpm install --frozen-lockfile
${DEPLOY_STAGES.map((stage) => yamlStep(stage)).join('\n')}
`

const yamlStep = (stage: DeployStage) => stage.block
  ? `      - name: ${stage.says}\n        run: |\n${stage.run.split('\n').map((line) => `          ${line}`).join('\n')}`
  : `      - name: ${stage.says}\n        run: ${stage.run}`
