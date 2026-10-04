#!/usr/bin/env node
/**
 * ONE CONDUCTOR FOR EVERY GENERATOR. The generators have a strict order — the receipt producers write the
 * *-receipt.json files, the README reads every one of them, the docs read the README — and until now that order
 * lived only in a person's head and in the CI steps. This runs the whole pipeline in that order: the independent
 * receipts in parallel (the stage's wall time is its slowest generator, not their sum), then the README, then the
 * docs. Each generator is its own process — it loads dist/ and takes its own arguments — and streams its output
 * live, so the run is interactive, not a 27-minute silence.
 *
 *   node scripts/generate.mjs            the whole pipeline: receipts (incl. the live walks) → readme → docs
 *   node scripts/generate.mjs --fast     skip the heavy live walks (discover, fuse, the host gate); regenerate from
 *                                        the committed receipts — heat, then readme, then docs
 *   node scripts/generate.mjs --check    verify only: readme and docs compare against the receipts and exit 1 on
 *                                        drift; writes nothing, runs no receipt producer
 *
 * The receipts themselves are MCP-driven where they can be (receipt.mjs sends tools/call { hex } to the host); this
 * conductor only sequences them. The gate receipt may report that the gate does not hold — that is a verdict, not a
 * conductor failure, so the pipeline continues and reports it.
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const fast = process.argv.includes('--fast')
const check = process.argv.includes('--check')

/** One generator as a child process, its output streamed live. `allowFail` keeps a non-zero exit from aborting the run. */
const run = ({ label, args, allowFail = false }) =>
  new Promise((resolve) => {
    const t0 = Date.now()
    console.log(`\n▶ ${label} — node ${args.join(' ')}`)
    spawn('node', args, { cwd: ROOT, stdio: 'inherit' }).on('close', (code) => {
      const ok = code === 0
      console.log(`${ok ? '✓' : allowFail ? '~' : '✗'} ${label} (${((Date.now() - t0) / 1000).toFixed(1)}s, exit ${code})`)
      if (!ok && !allowFail) process.exitCode = 1
      resolve({ label, code, ok })
    })
  })

/** A stage: its generators run at once; the conductor waits for all of them before the next stage. */
const stage = async (name, jobs) => {
  if (!jobs.length) return []
  console.log(`\n${'═'.repeat(64)}\n${name}\n${'═'.repeat(64)}`)
  return Promise.all(jobs.map(run))
}

// Stage 1 — the receipts the README reads. Independent of each other, so parallel. --check writes nothing, so it runs
// no producer; --fast keeps only the cheap in-process ones and skips the live walks.
const receipts = check
  ? []
  : [
      { label: 'heat', args: ['scripts/heat.mjs'] },
      ...(fast
        ? []
        : [
            { label: 'discover', args: ['scripts/discover.mjs'] },
            { label: 'fuse', args: ['scripts/fuse-apis.mjs'] },
            { label: 'payload:cf', args: ['scripts/payload-cloudflare.mjs'] },
            // the gate may not hold (a verdict about the formulas, not a generation error) — let the pipeline carry on
            { label: 'gate receipt', args: ['scripts/receipt.mjs', 'gate', 'push'], allowFail: true },
          ]),
    ]
await stage('receipts', receipts)

// Stage 2 — the README reads every receipt above.
await stage('readme', [{ label: 'readme', args: ['scripts/generate-readme.mjs', ...(check ? ['--check'] : [])] }])

// Stage 3 — the docs read the README.
await stage('docs', [{ label: 'docs', args: ['scripts/generate-docs.mjs', ...(check ? ['--check'] : [])] }])

console.log(`\n${process.exitCode ? '✗ generation finished with drift or failures (see above)' : '✓ every generator done'}`)
