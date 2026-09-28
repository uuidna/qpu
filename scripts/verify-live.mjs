#!/usr/bin/env node
// verify-live — the strongest check a deploy can have: the host serves, byte for byte, the documents this build makes.
// The unit is deterministic (no clock, no random), so GET /, /quantum/processing/unit and /mcp must equal
// JSON.stringify of the same constructors in dist. Polls while Cloudflare propagates; exits 1 with the first
// differing path if the host never matches. Usage: node scripts/verify-live.mjs https://qpu.uuidna.com
// VERIFY_ATTEMPTS sets the poll count (5 s apart); CI uses 60 to cover Cloudflare's own build after a push.
//
// AND THE ZONE'S CRAWLABLE PAIR, on every host this unit is routed to, by the same rule: robots.txt and
// sitemap.xml must equal the documents this build computes for that host, and every <loc> a sitemap carries
// must answer 200. That last clause is here because it was FOUND BY HAND and would not have been found again:
// 0.1.9 shipped four sitemaps listing /.well-known/mcp.json on hosts that answered 404 for it, a soft 404
// published by the law against soft 404s, and the suite was green throughout — an in-suite test can only ask
// what this unit answers, and a sibling host is answered by Cloudflare's routing, not by this process.
import { qpuLeanOf, qpuMcpOf, qpuQuantumOf, qpuRobotsOf, qpuSeoZoneOf, qpuSitemapOf } from '../dist/quantum/processing/unit/index.js'

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

/**
 * Every host this unit is routed to, asked for the pair it should serve and for every URL that pair claims.
 *
 * A REFUSAL IS NOT A FAULT AND A 404 IS. The distinction this tree keeps relearning: a host that would not
 * answer at all is unreachable and reported as such by the caller, while a host that answers 404 for a URL its
 * own sitemap lists has told us something definite. Only the definite answer is a fault here.
 */
const zoneFaultsOf = async () => {
  const faults = []
  for (const host of qpuSeoZoneOf().hosts) {
    for (const [path, built] of [['/robots.txt', qpuRobotsOf(host.host)], ['/sitemap.xml', qpuSitemapOf(host.host)]]) {
      const res = await fetch(`${host.origin}${path}`).catch((e) => ({ status: 0, text: async () => String(e) }))
      const served = await res.text()
      if (res.status === 0) { faults.push(`${host.origin}${path}: unreachable — ${served.slice(0, 60)}`); continue }
      if (res.status !== 200) { faults.push(`${host.origin}${path}: HTTP ${res.status} — Cloudflare's managed default stands in wherever this answers 404`); continue }
      if (served !== built) faults.push(`${host.origin}${path}: serves ${served.length} bytes, this build computes ${built.length}`)
    }
    for (const loc of [...qpuSitemapOf(host.host).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) {
      const res = await fetch(loc, { redirect: 'manual' }).catch(() => ({ status: 0 }))
      if (res.status === 0) faults.push(`${loc}: listed in ${host.host}'s sitemap and unreachable`)
      else if (res.status !== 200) faults.push(`${loc}: listed in ${host.host}'s sitemap and answers ${res.status} — a soft 404 the crawler drops and a reader believes`)
    }
  }
  return faults
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
    const faults = await zoneFaultsOf()
    for (const line of faults) console.error(`verify-live: ${line}`)
    if (faults.length > 0) {
      console.error(`verify-live: the pages match and the zone's crawlable surface does not — ${faults.length} fault(s)`)
      process.exit(1)
    }
    console.log(`verify-live: ${qpuSeoZoneOf().hosts.length} host(s) serve the pair this build computes, every <loc> answering`)
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
