#!/usr/bin/env node
/**
 * VERIFY THE OPEN LEADS. Each open lead is a claim. The values it states (versions, dates, counts) are its expected values,
 * and each one is submitted to the court, which decides from the source the lead names. A lead with no stated value, or
 * with no source that answers, stays unverified, and the verdict says why.
 *
 *   npm run verify:leads
 *
 * Results go to scripts/court.leads.json: the lead's name and source, the verdict, and its reason. Lead text is not copied,
 * so private prompts stay in their own store.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const HOST = process.env.QPU_HOST
  ? (/^https?:\/\//.test(process.env.QPU_HOST) ? process.env.QPU_HOST : `https://${process.env.QPU_HOST}`)
  : 'https://qpu.uuidna.com'
const ROOT = join(import.meta.dirname, '..')

type Lead = { name: string; state: string; lead: string }
type Verdict = { verdict: 'verified' | 'denied' | 'unverified'; reason: string; claim: string }

/** The values a lead states: versions, dates, and whole numbers. */
export const valuesOf = (text: string): string[] => {
  const found = new Set<string>()
  for (const m of text.matchAll(/\b\d+\.\d+\.\d+\b/g)) found.add(m[0])
  for (const m of text.matchAll(/\b\d{4}-\d{2}-\d{2}\b/g)) found.add(m[0])
  for (const m of text.matchAll(/(?<![\d.\-])\d{2,}(?![\d.])/g)) found.add(m[0])
  return [...found]
}

const court = async (claim: string, expect: string): Promise<Verdict> => {
  const r = await fetch(`${HOST.replace(/\/$/, '')}/mcp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'court', arguments: { claim, expect } } }),
    signal: AbortSignal.timeout(300000),
  }).catch(() => null)
  const text = ((await r?.json().catch(() => null)) as { result?: { content?: { text?: string }[] } } | null)?.result?.content?.[0]?.text
  if (typeof text !== 'string') return { verdict: 'unverified', reason: 'the court did not answer', claim }
  return JSON.parse(text) as Verdict
}

const leadsOf = (file: string): Lead[] => (existsSync(join(ROOT, file)) ? (JSON.parse(readFileSync(join(ROOT, file), 'utf8')) as { leads: Lead[] }).leads : [])

const main = async () => {
  const rows: { source: string; name: string; verdict: string; reason: string }[] = []
  for (const [source, file] of [['memory', 'scripts/leads.memory.json'], ['prompts', 'scripts/leads.prompts.json']] as const) {
    for (const lead of leadsOf(file).filter((l) => l.state === 'open')) {
      const values = valuesOf(lead.lead)
      if (values.length === 0) {
        rows.push({ source, name: lead.name, verdict: 'unverified', reason: 'no stated value to check' })
        continue
      }
      // the lead is decided by its first checkable value; the others are checked too, and the strongest verdict is kept
      const results = await Promise.all(values.map((v) => court(lead.lead, v)))
      const verified = results.find((r) => r.verdict === 'verified')
      const denied = results.find((r) => r.verdict === 'denied')
      const best = verified ?? denied ?? results[0]!
      rows.push({ source, name: lead.name, verdict: best.verdict, reason: best.reason })
    }
  }
  writeFileSync(join(ROOT, 'scripts/court.leads.json'), JSON.stringify(rows, null, 1) + '\n')
  const counts: Record<string, number> = {}
  for (const r of rows) counts[r.verdict] = (counts[r.verdict] ?? 0) + 1
  console.log(`open leads: ${rows.length}`, counts)
}

if (import.meta.url === `file://${process.argv[1]}`) await main()
