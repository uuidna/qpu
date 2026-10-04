#!/usr/bin/env node
// A funding LEAD for each novelty (family): a real candidate funder from the Crossref Funder Registry (open,
// authoritative), matched by the family's cross-domain (dst). These are CANDIDATES to approach, matched by field —
// leads, NOT secured awards or guarantees. One registry query per distinct domain (fast, cached), then every family
// inherits its domain's funder lead. Writes funding-receipt.json (the receipt pattern, like heat-receipt.json).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = '/Users/ceci/github/uuidna/qpu-verify'
const FAM = join(ROOT, 'src/families')
const UA = 'qpu.uuidna.com (+https://qpu.uuidna.com)'

// family -> dst (its cross target / field)
const families = readdirSync(FAM, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort()
const dstOf = (name) => { try { return /dst: '([a-z]+)'/.exec(readFileSync(join(FAM, name, 'index.ts'), 'utf8'))?.[1] ?? null } catch { return null } }
const famDst = Object.fromEntries(families.map((n) => [n, dstOf(n)]))
const domains = [...new Set(Object.values(famDst).filter(Boolean))].sort()

const funderOf = async (q) => {
  try {
    const r = await fetch(`https://api.crossref.org/funders?query=${encodeURIComponent(q)}&rows=1`, { signal: AbortSignal.timeout(8000), headers: { accept: 'application/json', 'user-agent': UA } })
    if (!r.ok) return null
    const f = (await r.json())?.message?.items?.[0]
    return f ? { funder: f.name, uri: f.uri, location: f.location ?? '' } : null
  } catch { return null }
}

const byDomain = {}
for (const d of domains) { byDomain[d] = await funderOf(d); process.stderr.write(`${d}: ${byDomain[d]?.funder ?? '(no match)'}\n`) }

const leads = families.map((n) => ({ family: n, domain: famDst[n], ...(byDomain[famDst[n]] ?? { funder: null, uri: null, location: '' }) }))
const matched = leads.filter((l) => l.funder).length
const receipt = {
  kind: 'funding-receipt',
  when: new Date().toISOString().slice(0, 10),
  source: 'Crossref Funder Registry (https://www.crossref.org/services/funder-registry/)',
  note: 'Candidate funders matched to each novelty by its field (the family dst). LEADS to approach, matched by name/field — NOT secured awards, grants, or endorsements.',
  families: families.length,
  domains: domains.length,
  matched,
  byDomain,
  leads,
}
writeFileSync(join(ROOT, 'funding-receipt.json'), JSON.stringify(receipt, null, 1) + '\n')
console.log(JSON.stringify({ families: families.length, domains: domains.length, matched }))
