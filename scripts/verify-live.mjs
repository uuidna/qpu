#!/usr/bin/env node
// verify-live — the strongest check a deploy can have: the host serves, byte for byte, the documents this build makes.
// The unit is deterministic (no clock, no random), so GET /, /quantum/processing/unit and /mcp must equal
// JSON.stringify of the same constructors in dist. Polls while Cloudflare propagates; exits 1 with the first
// differing path if the host never matches. Usage: node scripts/verify-live.mjs https://qpu.uuidna.com
// VERIFY_ATTEMPTS sets the poll count (5 s apart); CI uses 60 to cover Cloudflare's own build after a push.
import { qpuLeanOf, qpuMcpOf, qpuQuantumOf } from '../dist/quantum/processing/unit/index.js'

const origin = (process.argv[2] ?? 'https://qpu.uuidna.com').replace(/\/$/, '')
const pages = [
  ['/', () => qpuQuantumOf()],
  ['/quantum/processing/unit', () => qpuLeanOf()],
  ['/mcp', () => qpuMcpOf()],
]
const attempts = Number(process.env.VERIFY_ATTEMPTS ?? 24) || 24
const waitMs = 5000

const firstDifference = (a, b, path = '$') => {
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) return `${path}: ${JSON.stringify(a)?.slice(0, 60)} vs ${JSON.stringify(b)?.slice(0, 60)}`
  if (a && typeof a === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!(k in a)) return `${path}.${k}: absent in built`
      if (!(k in b)) return `${path}.${k}: absent in served`
      const d = firstDifference(a[k], b[k], `${path}.${k}`)
      if (d) return d
    }
    return undefined
  }
  return a === b ? undefined : `${path}: ${JSON.stringify(a)?.slice(0, 60)} vs ${JSON.stringify(b)?.slice(0, 60)}`
}

let last = ''
for (let attempt = 1; attempt <= attempts; attempt++) {
  const results = []
  for (const [path, build] of pages) {
    const built = JSON.stringify(build())
    const res = await fetch(`${origin}${path}`, { headers: { accept: 'application/ld+json' } }).catch((e) => ({ status: 0, text: async () => String(e) }))
    const served = await res.text()
    results.push({ path, status: res.status, equal: served === built, served, built })
  }
  if (results.every((r) => r.equal)) {
    for (const r of results) console.log(`verify-live: ${origin}${r.path} equals the built document (${r.built.length} bytes)`)
    process.exit(0)
  }
  const bad = results.find((r) => !r.equal)
  let why = `HTTP ${bad.status}`
  try {
    why = firstDifference(JSON.parse(bad.built), JSON.parse(bad.served)) ?? 'bytes differ'
  } catch {
    why = `not JSON: ${bad.served.slice(0, 80)}`
  }
  last = `${origin}${bad.path}: ${why}`
  console.log(`verify-live: attempt ${attempt}/${attempts} — ${last}`)
  await new Promise((r) => setTimeout(r, waitMs))
}
console.error(`verify-live: the host never served this build. Last: ${last}`)
process.exit(1)
