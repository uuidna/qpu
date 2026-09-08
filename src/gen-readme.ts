#!/usr/bin/env node
// gen-readme — README, MANUAL, and CITATION.cff. Never hand-edit those files.
import { spawnSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  ADDRESS_BITS, HANDLE_BITS, HANDLE_HEXBITS, HEXBIT_BITS, QPU_HOST, QPU_POINTS, SEAL_TEN, VE_FACES,
  qpuGatewaysOf, qpuHandleMaskOf, qpuHologramOf, qpuSeatOf, qpuTwoNOf, qpuWidthOf,
} from './hologram.js'
import { type CompareRow, qpuCompareOf, qpuEdgeBenchOf, qpuSpeedOf } from './metrics.js'
import { qpuViteDoorsOf } from './chrome.js'
import { qpuProofsOf } from './proofs.js'
import { qpuOgSvgOf } from './og.js'
import { ORCID, UUIDNA_DOI, UUIDNA_DOI_URL, UUIDNA_TITLE, CAPTAIN, DATE_RELEASED, yearReleasedOf } from './standing.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

export interface TestReceipt {
  tests: number
  pass: number
  fail: number
  skipped: number
  durationMs: number
}

type Pkg = {
  name: string
  version: string
  description?: string
  license?: string
  author?: { name?: string; email?: string } | string
  engines?: { node?: string }
  keywords?: string[]
  repository?: { url?: string }
}

const pkgOf = (): Pkg =>
  JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as Pkg

/** Product title is the description before ` at https://` or an em dash. */
export function titleOf(pkg: Pkg = pkgOf()): string {
  const d = (pkg.description ?? '').trim()
  const beforeDash = (d.split(/\s+[—–]\s+/)[0] ?? d).trim()
  const at = beforeDash.search(/\s+at\s+https?:\/\//i)
  const title = (at >= 0 ? beforeDash.slice(0, at) : beforeDash).trim()
  if (!title) throw new Error('package.json description must start with the product title')
  return title
}

export function githubOf(pkg: Pkg = pkgOf()): string {
  const raw = pkg.repository?.url
  if (!raw) throw new Error('package.json repository.url is required')
  return raw.replace(/^git\+/, '').replace(/\.git$/, '')
}

export function repoDirOf(github: string): string {
  const dir = github.replace(/\/$/, '').split('/').pop()
  if (!dir) throw new Error('repository.url has no path segment')
  return dir
}

export function scopeOf(name: string): string {
  const m = /^@([^/]+)\//.exec(name)
  if (!m) throw new Error(`${name} must be a scoped package`)
  return m[1]!
}

export function captainNamesOf(name = CAPTAIN): { given: string; family: string } {
  const parts = name.trim().split(/\s+/)
  if (parts.length < 2) throw new Error('CAPTAIN must be given-name family-name')
  return { family: parts[parts.length - 1]!, given: parts.slice(0, -1).join(' ') }
}

export function apaNameOf(name = CAPTAIN): string {
  const { given, family } = captainNamesOf(name)
  const initials = given.split(/\s+/).map((p) => `${p[0]}.`).join(' ')
  return `${family}, ${initials}`
}

const emailOf = (pkg: Pkg): string => {
  if (pkg.author && typeof pkg.author === 'object' && pkg.author.email) return pkg.author.email
  if (typeof pkg.author === 'string') {
    const m = /<([^>]+)>/.exec(pkg.author)
    if (m) return m[1]!
  }
  throw new Error('package.json author.email is required')
}

const licenseOf = (pkg: Pkg): string => {
  if (!pkg.license) throw new Error('package.json license is required')
  return pkg.license
}

const nodeOf = (pkg: Pkg): string => {
  if (!pkg.engines?.node) throw new Error('package.json engines.node is required')
  return pkg.engines.node
}

const nodeLabelOf = (engines: string): string => `Node ${engines.replace(/^>=\s*/, '≥ ')}`

const licenseLabelOf = (spdx: string): string =>
  spdx.replace(/^CC-/, 'CC ').replace(/-(\d)/, ' $1')

export function wranglerNameOf(): string {
  const toml = readFileSync(join(ROOT, 'wrangler.toml'), 'utf8')
  const m = /^name\s*=\s*"([^"]+)"/m.exec(toml)
  if (!m) throw new Error('wrangler.toml name is required')
  return m[1]!
}

const ccUrlOf = (spdx: string): string => {
  if (!spdx.startsWith('CC-')) return `https://spdx.org/licenses/${spdx}.html`
  const path = spdx.replace(/^CC-/, '').replace(/-(\d)/, '/$1').toLowerCase()
  return `https://creativecommons.org/licenses/${path}/`
}

const keywordsYamlOf = (pkg: Pkg): string => {
  const keys = pkg.keywords ?? []
  if (keys.length === 0) throw new Error('package.json keywords are required')
  return keys.map((k) => `  - ${k}`).join('\n')
}

/** APA 7th computer-software reference (author–date). Year is DATE_RELEASED. */
export const apaSoftwareOf = (title: string, version: string, url: string): string =>
  `${apaNameOf()} (${yearReleasedOf()}). ${title} (Version ${version}) [Computer software]. ${url}`

export const apaParentOf = (): string =>
  `${apaNameOf()} (${yearReleasedOf()}). ${UUIDNA_TITLE} [Computer software]. ${UUIDNA_DOI_URL}`

export function parseTestReceipt(out: string): TestReceipt {
  const n = (re: RegExp) => Number((re.exec(out) ?? [])[1] ?? 0)
  const durationRaw = Number((/(?:ℹ|#) duration_ms (\d+(?:\.\d+)?)/.exec(out) ?? [])[1] ?? 0)
  return {
    tests: n(/(?:ℹ|#) tests (\d+)/),
    pass: n(/(?:ℹ|#) pass (\d+)/),
    fail: n(/(?:ℹ|#) fail (\d+)/),
    skipped: n(/(?:ℹ|#) skipped (\d+)/),
    durationMs: durationRaw !== durationRaw ? 0 : durationRaw | 0,
  }
}

export function runTests(): { receipt: TestReceipt; ok: boolean; out: string } {
  const files = readdirSync(join(ROOT, 'dist'), { recursive: true })
    .filter((f): f is string => typeof f === 'string' && f.endsWith('.test.js'))
    .map((f) => join(ROOT, 'dist', f))
  const r = spawnSync(process.execPath, ['--test', '--test-reporter', 'tap', ...files], {
    encoding: 'utf8',
    cwd: ROOT,
  })
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`
  const receipt = parseTestReceipt(out)
  return { receipt, ok: r.status === 0 && receipt.fail === 0 && receipt.pass === receipt.tests, out }
}

const table = (headers: string[], rows: readonly (readonly string[])[]): string => {
  const head = `| ${headers.join(' | ')} |`
  const sep = `| ${headers.map(() => '---').join(' | ')} |`
  return [head, sep, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n')
}

const compareTable = (rows: readonly CompareRow[]): string =>
  table(
    ['Name', 'Formula', 'Value', 'Peer', 'Match'],
    rows.map((r) => [
      r.name,
      `\`${r.formula}\``,
      String(r.value),
      String(r.peer),
      r.value === r.peer ? 'holds' : 'FAIL',
    ]),
  )

const hrefOf = (path: string, kind: 'repo' | 'site'): string => {
  if (path.startsWith('https://') || path.startsWith('http://')) return path
  const p = path.startsWith('/') ? path : `/${path}`
  return kind === 'site' ? p : `https://${QPU_HOST}${p}`
}

const mdHref = (text: string, path: string, kind: 'repo' | 'site'): string =>
  `[${text}](${hrefOf(path, kind)})`

export const markdownHrefsOf = (md: string): string[] => {
  const hrefs: string[] = []
  for (const m of md.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) hrefs.push(m[1]!)
  return hrefs
}

const doorsTable = (kind: 'repo' | 'site'): string =>
  table(
    ['Path', 'Reading'],
    qpuViteDoorsOf().map((it) => [mdHref('`' + it.link + '`', it.link, kind), it.text]),
  )

const unlockOf = (kind: 'repo' | 'site'): string => {
  const gateways = qpuGatewaysOf()
  const maskRungs = [...new Set([0, 1, HEXBIT_BITS, HANDLE_HEXBITS, VE_FACES, HANDLE_BITS])]
  const rungs = qpuSpeedOf()
  return `## Unlock capacity

Fourteen neighbours are capacity gateways. Every handle bit \`0..${HANDLE_BITS}\` is a usable mask. \`qpuHandleMaskOf(bits)\` outside that range refuses. Licensed \`2^n\` via \`qpuTwoNOf\`.

${table(
    ['Bits', 'Mask', 'Value', 'Door'],
    maskRungs.map((b) => [
      String(b),
      `\`qpuHandleMaskOf(${b})\``,
      String(qpuHandleMaskOf(b)),
      mdHref('`/gateways`', '/gateways', kind),
    ]),
  )}

${table(
    ['Face', 'Neighbour', 'Capacity', 'Door'],
    gateways.map((g) => [
      String(g.face),
      String(g.neighbour),
      String(g.capacity),
      mdHref(`\`/face/${g.face}\``, `/face/${g.face}`, kind),
    ]),
  )}

Gateway total ${gateways.length} × ${qpuTwoNOf(HANDLE_BITS)} = ${gateways.length * qpuTwoNOf(HANDLE_BITS)}. Amplitudes ${mdHref('`2^' + String(VE_FACES) + '`', '/metrics', kind)}. Address ${mdHref('`2^' + String(ADDRESS_BITS) + '`', '/speed', kind)}.

${table(
    ['Rung', 'n', '2^n', 'Door'],
    rungs.map((r) => [
      r.name,
      String(r.n),
      String(r.amplitudes),
      mdHref('`/speed`', '/speed', kind),
    ]),
  )}
`
}

const resultLine = (receipt: TestReceipt): string => {
  const duration = receipt.durationMs === 0 ? '' : ` in ${receipt.durationMs} ms`
  return receipt.fail === 0 && receipt.pass === receipt.tests
    ? `${receipt.pass}/${receipt.tests} pass${duration}`
    : `${receipt.pass}/${receipt.tests} pass · ${receipt.fail} fail${duration}`
}

export function citationOf(): string {
  const pkg = pkgOf()
  const github = githubOf(pkg)
  const live = `https://${QPU_HOST}`
  const title = titleOf(pkg)
  const { given, family } = captainNamesOf()
  return `cff-version: 1.2.0
title: "${title}"
message: "If you use this software, please cite it using the metadata from this file."
type: software
authors:
  - family-names: ${family}
    given-names: ${given}
    orcid: "https://orcid.org/${ORCID}"
    email: ${emailOf(pkg)}
    affiliation: ${scopeOf(pkg.name)}
license: ${licenseOf(pkg)}
version: "${pkg.version}"
date-released: "${DATE_RELEASED}"
url: "${live}"
repository-code: "${github}"
repository-artifact: "https://www.npmjs.com/package/${pkg.name}"
abstract: >-
  Cloudflare Worker serving JSON readings of an empty QPU seat, BindingPoint
  width (CPU, GPU, RAM, CACHE, STORAGE), and hologram planes. Not a hardware
  quantum processing unit. Proofs live on uuidna (DOI ${UUIDNA_DOI}).
keywords:
${keywordsYamlOf(pkg)}
references:
  - type: software
    title: "${UUIDNA_TITLE}"
    authors:
      - family-names: ${family}
        given-names: ${given}
        orcid: "https://orcid.org/${ORCID}"
    doi: "${UUIDNA_DOI}"
    url: "${UUIDNA_DOI_URL}"
    year: ${yearReleasedOf()}
`
}

export function readmeOf(
  receipt: TestReceipt,
  compare: readonly CompareRow[] = qpuCompareOf(),
  _bench: readonly unknown[] = [],
  kind: 'repo' | 'site' = 'repo',
): string {
  const pkg = pkgOf()
  const github = githubOf(pkg)
  const repoDir = repoDirOf(github)
  const seat = qpuSeatOf()
  const width = qpuWidthOf()
  const holo = qpuHologramOf()
  const points = QPU_POINTS.join(', ')
  const live = `https://${QPU_HOST}`
  const result = resultLine(receipt)
  const manual = kind === 'site' ? '/manual' : 'MANUAL.md'
  const cite = kind === 'site' ? '/author' : 'CITATION.cff'
  const spdx = licenseOf(pkg)
  const license = kind === 'site' ? ccUrlOf(spdx) : 'LICENSE'
  const licenseLabel = licenseLabelOf(spdx)
  const title = titleOf(pkg)
  const year = yearReleasedOf()
  const family = captainNamesOf().family
  const apa = apaSoftwareOf(title, pkg.version, live)
  const parent = apaParentOf()

  return `# ${title}

Package [\`${pkg.name}\`](${github}) v${pkg.version}. Live worker [${live}](${live}).

JSON readings of one classical machine: an empty QPU seat, BindingPoint width (${points}), and hologram planes (foundation ${holo.foundation}, debit ${holo.debit}, credit ${holo.credit}, pentagram ${holo.pentagram}, fold ${holo.fold}, octet ${holo.octet}, VE ${holo.veFaces}). This package does not attach a quantum device. Proofs live on uuidna (${family}, ${year}; DOI [${UUIDNA_DOI}](${UUIDNA_DOI_URL})).

${CAPTAIN} ([ORCID ${ORCID}](https://orcid.org/${ORCID})). Licence [${licenseLabel}](${license}). Operating procedures: [${kind === 'site' ? 'user manual' : 'MANUAL.md'}](${manual}).

## Install

\`\`\`
npm install ${pkg.name}
\`\`\`

## Use

Base URL \`${live}\`. GET returns JSON.

${table(
    ['Path', 'Reading'],
    [
      ['`/`', 'discovery + machine'],
      ['`/seat`', `\`${seat.name}\` · \`${seat.seat}\``],
      ['`/width`', `${points} · binds \`${width.binds}\``],
      ['`/hologram`', `foundation ${holo.foundation} · debit ${holo.debit} · credit ${holo.credit} · pentagram ${holo.pentagram} · fold ${holo.fold} · octet ${holo.octet} · VE ${holo.veFaces}`],
      ['`/metrics`', 'formula vs peer'],
      ['`/.well-known/qpu.json`', 'discovery'],
    ],
  )}

\`\`\`
curl -sS ${live}/seat
curl -sS ${live}/width
curl -sS ${live}/hologram
\`\`\`

\`\`\`ts
import { handleQpuFetch, qpuMachineOf, qpuCompareOf } from '${pkg.name}'

const machine = qpuMachineOf()
const res = await handleQpuFetch(new Request('${live}/seat'))
const compare = qpuCompareOf()
\`\`\`

\`handleQpuFetch\` is Workers-safe (no \`node:os\`). Compare rows must match.

${compareTable(compare)}

Tests this generation: **${result}**.

## Develop

${nodeLabelOf(nodeOf(pkg))}.

\`\`\`
git clone ${github}
cd ${repoDir}
npm ci
npm test
\`\`\`

\`npm test\` compiles TypeScript and runs \`dist/**/*.test.js\`. \`npm run readme\` rebuilds this file, the [user manual](${manual}), and [CITATION.cff](${cite}).

## Citation

Cite the software in APA 7th (author–date). GitHub Cite this repository reads [${cite}](${cite}).

> ${apa}

Parent software:

> ${parent}

## References

${apa}

${parent}

de Moura, L., & Ullrich, S. (2021). The Lean 4 theorem prover and programming language. In *Automated Deduction – CADE 28*.

## Licence

${licenseLabel} · © ${CAPTAIN}. Full text [${kind === 'site' ? licenseLabel : 'LICENSE'}](${license}).
`
}

export function manualOf(
  receipt: TestReceipt,
  compare: readonly CompareRow[] = qpuCompareOf(),
  kind: 'repo' | 'site' = 'repo',
): string {
  const pkg = pkgOf()
  const github = githubOf(pkg)
  const repoDir = repoDirOf(github)
  const seat = qpuSeatOf()
  const width = qpuWidthOf()
  const holo = qpuHologramOf()
  const points = QPU_POINTS.join(' ')
  const live = `https://${QPU_HOST}`
  const result = resultLine(receipt)
  const paper = kind === 'site' ? '/paper' : 'README.md'
  const cite = kind === 'site' ? '/author' : 'CITATION.cff'
  const spdx = licenseOf(pkg)
  const license = kind === 'site' ? ccUrlOf(spdx) : 'LICENSE'
  const licenseLabel = licenseLabelOf(spdx)
  const nodeReq = nodeOf(pkg).replace(/^>=\s*/, '≥ ')

  return `# User manual — \`${pkg.name}\`

${titleOf(pkg)}. Version **${pkg.version}**. Live **[${live}](${live})**. Paper: [${kind === 'site' ? 'Overview' : 'README.md'}](${paper}).

| Field | Value |
| --- | --- |
| Product | \`${pkg.name}\` |
| Host | \`${QPU_HOST}\` |
| Node | ${nodeReq} |
| Licence | ${licenseLabel} |
| Cite | [${kind === 'site' ? 'Author' : 'CITATION.cff'}](${cite}) |
| Tests | ${result} |

## What you get

Three JSON readings. No hardware QPU.

| Reading | Constructor | HTTP |
| --- | --- | --- |
| Seat | \`qpuSeatOf()\` → \`${seat.name}\` · \`${seat.seat}\` | \`GET /seat\` |
| Width | \`qpuWidthOf()\` → ${points} · binds \`${width.binds}\` | \`GET /width\` |
| Hologram | \`qpuHologramOf()\` → foundation ${holo.foundation} · debit ${holo.debit} · credit ${holo.credit} · pentagram ${holo.pentagram} · fold ${holo.fold} · octet ${holo.octet} · VE ${holo.veFaces} | \`GET /hologram\` |

Metrics: \`GET /metrics\`. Discovery: \`GET /\` and \`GET /.well-known/qpu.json\`. Proofs stay on uuidna ([DOI ${UUIDNA_DOI}](${UUIDNA_DOI_URL})).

## Install

\`\`\`
npm install ${pkg.name}
\`\`\`

From git:

\`\`\`
git clone ${github}
cd ${repoDir}
npm ci
npm test
\`\`\`

## HTTP

Base URL: \`${live}\`. Methods: GET, OPTIONS. Body: \`application/json; charset=utf-8\`.

${table(
    ['Method', 'Path', 'Status', 'Body'],
    [
      ['GET', '`/`', '200', 'discovery + `machine`'],
      ['GET', '`/seat`', '200', `\`${seat.seat}\` seat`],
      ['GET', '`/width`', '200', points],
      ['GET', '`/hologram`', '200', `planes ${holo.foundation} ${holo.debit} ${holo.credit} ${holo.pentagram} ${holo.fold} ${holo.octet} ${holo.veFaces}`],
      ['GET', '`/metrics`', '200', '`compare` + `holds`'],
      ['GET', '`/.well-known/qpu.json`', '200', 'discovery'],
      ['OPTIONS', 'any of the above', '204', 'empty'],
      ['GET', 'other path', '404', '`{ "error": "no such reading" }`'],
    ],
  )}

\`\`\`
curl -sS ${live}/seat
curl -sS ${live}/width
curl -sS ${live}/hologram
curl -sS ${live}/metrics
\`\`\`

## Library

\`\`\`ts
import { handleQpuFetch, qpuMachineOf, qpuCompareOf } from '${pkg.name}'

const machine = qpuMachineOf()
const res = await handleQpuFetch(new Request('${live}/seat'))
const compare = qpuCompareOf()
\`\`\`

| Export | Returns |
| --- | --- |
| \`qpuSeatOf()\` | \`{ name: 'QPU', seat: 'empty', admits: 'nothing' }\` |
| \`qpuWidthOf()\` | \`{ points, pentagram: ${width.pentagram}, binds: '${width.binds}' }\` |
| \`qpuHologramOf()\` | planes, plus \`seal: [${SEAL_TEN.join(', ')}]\` |
| \`qpuFacesOf()\` | ${VE_FACES} face pairs |
| \`qpuMachineOf()\` | \`{ host, seat, width, hologram }\` |
| \`handleQpuFetch(request)\` | \`Response\` |
| \`qpuCompareOf()\` | formula vs peer rows |
| \`qpuCompareHolds()\` | \`true\` when every row matches |

Workers entry: \`worker.js\` exports \`fetch: handleQpuFetch\`. Config: \`wrangler.toml\` \`name = "${wranglerNameOf()}"\`.

## Deploy

\`\`\`
npm run ship
\`\`\`

That is \`tsc\`, \`vitepress build docs\`, then \`npx wrangler deploy\`. Do not fill the QPU seat from the deploy script.

## Errors

| Symptom | Cause | What to do |
| --- | --- | --- |
| 404 | path is not a door | use \`/\` \`/seat\` \`/width\` \`/hologram\` \`/metrics\` |
| 405 | method is not GET or OPTIONS | GET a reading |
| \`holds: false\` | a compare row drifted | fail the build |
| empty seat | expected | do not invent a device |

## Tests

This generation: **${result}**.

${compareTable(compare)}

\`\`\`
npm run readme
\`\`\`

## Citation and licence

APA 7th: see [${cite}](${cite}). Parent: uuidna DOI [${UUIDNA_DOI}](${UUIDNA_DOI_URL}).

Licence ${licenseLabel}. Full text [${kind === 'site' ? licenseLabel : 'LICENSE'}](${license}).
`
}

async function main(): Promise<void> {
  const { receipt, ok, out } = runTests()
  if (receipt.tests === 0) {
    console.error('gen-readme — test receipt is empty')
    console.error(out)
    process.exit(1)
  }
  const compare = qpuCompareOf()
  const bench = await qpuEdgeBenchOf()
  const paperFm = `---\ntitle: ${titleOf()}\noutline: deep\n---\n\n`
  const manualFm = '---\ntitle: User manual\noutline: deep\n---\n\n'
  writeFileSync(join(ROOT, 'CITATION.cff'), citationOf())
  writeFileSync(join(ROOT, 'README.md'), readmeOf(receipt, compare, bench, 'repo'))
  writeFileSync(join(ROOT, 'MANUAL.md'), manualOf(receipt, compare, 'repo'))
  writeFileSync(join(ROOT, 'docs/paper.md'), paperFm + readmeOf(receipt, compare, bench, 'site'))
  writeFileSync(join(ROOT, 'docs/manual.md'), manualFm + manualOf(receipt, compare, 'site'))
  writeFileSync(join(ROOT, 'docs/public/og.svg'), qpuOgSvgOf())
  writeFileSync(join(ROOT, 'test-results.json'), `${JSON.stringify({ receipt, compare, bench, proofs: qpuProofsOf(receipt) }, null, 2)}\n`)
  console.log(`✓ CITATION.cff README.md MANUAL.md docs/paper.md docs/manual.md · tests ${receipt.pass}/${receipt.tests}${receipt.fail ? ` · fail ${receipt.fail}` : ''}`)
  if (!ok) process.exit(1)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) void main()
