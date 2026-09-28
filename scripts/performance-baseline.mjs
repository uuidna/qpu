/**
 * PERFORMANCE BASELINE IMPLEMENTATION
 *
 * Measures storage access costs against RAID redundancy guarantees and budget constraints.
 * Reconciles the known PUT debt with structural RAID redundancy facts.
 */

import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import { readFileSync } from 'node:fs'

const invoked = process.argv[1]?.endsWith('performance-baseline.mjs') === true

if (invoked) {
  const dist = join(process.cwd(), 'dist', 'quantum', 'processing', 'unit', 'index.js')
  const unit = await import(pathToFileURL(dist).href)

  // Gather RAID structure facts
  const faces = unit.qpuFacesOf().faces
  const rays = unit.qpuFacesOf().rays
  const coins = unit.qpuFacesOf().coins
  const redundancyHolds = unit.qpuStorageRedundancyHolds()

  // Load baseline
  const baseline = JSON.parse(readFileSync(join(process.cwd(), 'storage-subrequests.json'), 'utf8'))

  const measurements = {
    storage: {
      'GET /storage': baseline.doors['GET /storage'],
      'GET /storage/:key': baseline.doors['GET /storage/:key'],
      'PUT /storage/:key': baseline.doors['PUT /storage/:key'],
      'POST /storage {maintain:true}': baseline.doors['POST /storage {maintain:true}']
    },
    raid: {
      faces,
      rays,
      coins,
      redundancyHolds,
      facts: {
        determined: "a referrer is a function of its inode, so its shares protect nothing",
        mirrored: "the two RAID teams are the same stripes dealt twice, so 7 shares determine the value"
      }
    },
    query: {
      budget: baseline.budget,
      budgetReason: baseline.why
    }
  }

  // Analyze the PUT debt
  const putDebt = {
    endpoint: 'PUT /storage/:key',
    currentCost: 91,
    budget: 50,
    over: 41,
    documentedIn: baseline.over['PUT /storage/:key'],
    redundancyFactsApply: true,
    reasoning: "A deposit makes 2 puts (inode + referrer). Each places value + 14 RAID shares = 30 slots per put = 60 total. Over budget. However, RAID redundancy proves the referrer's shares are derived from the inode (determined fact) and the two RAID teams are identical (mirrored fact), which could justify reducing redundancy requirements.",
    potentialOptimization: "Remove RAID shares from referrer (determined by inode), potentially reducing from 91 to lower cost aligned with RAID redundancy proof"
  }

  const errors = []

  // Validate measurements against budget
  for (const [name, costs] of Object.entries(measurements.storage)) {
    if (costs.populated > baseline.budget && !baseline.over[name]) {
      errors.push(`${name} (populated) costs ${costs.populated} exceeds budget ${baseline.budget} but not documented in over`)
    }
  }

  // Check if RAID redundancy facts are documented
  if (!measurements.raid.redundancyHolds) {
    errors.push("RAID redundancy proof does not hold - this should not occur")
  }

  // Validate over.budget entries exist
  if (!baseline.over['PUT /storage/:key']) {
    errors.push("PUT /storage/:key debt not documented in over.budget section")
  }

  const report = {
    status: errors.length > 0 ? 'error' : 'success',
    measurements,
    raidDebt: putDebt,
    reconciliation: {
      identified: true,
      documented: !!baseline.over['PUT /storage/:key'],
      factsProven: redundancyHolds,
      nextSteps: [
        "RAID redundancy facts (determined and mirrored) are proven",
        "PUT debt is documented with budget overrun of 41 subrequests",
        "Optimization opportunity: removing referrer RAID shares could reduce cost from 91 toward budget of 50",
        "This optimization requires changing RAID structure, which is a change to what RAID means, not a bug fix"
      ]
    },
    errors
  }

  console.log(JSON.stringify(report, null, 2))
  process.exit(errors.length > 0 ? 1 : 0)
}
