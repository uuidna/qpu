#!/usr/bin/env node
/**
 * THE COURT, FROM THE COMMAND LINE. The rule lives in src/payload/plugins/claim.ts; this script only reads the connector
 * and records each verdict. A claim is verified or unverified, and an unverified claim says what the source found.
 *
 *   npm run court -- --claim "<claim text>" --expect <value> [--family <name>]
 *   npm run court -- --source <source> --field <field> --expect <value> [--family <name>]
 *
 * Each verdict is appended to scripts/court.verdicts.json. The host is QPU_HOST, a host name or an origin.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { claimVerdictOf, type Reply, type Source, type Verdict } from '../src/payload/plugins/claim.ts'

const HOST = process.env.QPU_HOST
  ? (/^https?:\/\//.test(process.env.QPU_HOST) ? process.env.QPU_HOST : `https://${process.env.QPU_HOST}`)
  : 'https://qpu.uuidna.com'
const verdictsFile = join(import.meta.dirname, 'court.verdicts.json')

const argOf = (name: string): string | undefined => {
  const i = process.argv.indexOf(name)
  return i > 0 ? process.argv[i + 1] : undefined
}

/** One call to the connector over MCP, returning its parsed reply. */
const connector = async (args: Record<string, unknown>): Promise<Reply> => {
  const r = await fetch(`${HOST.replace(/\/$/, '')}/mcp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'connector', arguments: args } }),
    signal: AbortSignal.timeout(180000),
  }).catch(() => null)
  const text = ((await r?.json().catch(() => null)) as { result?: { content?: { text?: string }[] } } | null)?.result?.content?.[0]?.text
  if (typeof text !== 'string') return null
  try { return JSON.parse(text) as Record<string, unknown> } catch { return null }
}

/** Every source the connector serves, read from the connector itself. */
const sourcesOf = async (): Promise<Source[]> => {
  const all = await connector({ source: 'all', full: true })
  return Array.isArray(all?.sources) ? (all!.sources as Source[]) : []
}

/** A single field of a single source: verified when it holds the expected value, otherwise unverified, with what it holds. */
const fieldVerdictOf = (claim: string, reply: Reply, field: string, expect: string): Verdict => {
  const at = new Date().toISOString()
  if (!reply || reply.reading === undefined) return { at, claim, verdict: 'unverified', reason: 'the source gave no reading', next: 'retry, or name a source that serves this claim' }
  const reading = reply.reading as Record<string, unknown>
  const scope = field in reply ? reply : field in reading ? reading : null
  if (!scope) return { at, claim, verdict: 'unverified', reason: `the reply has no field "${field}"`, next: `name a field the reply carries: ${[...Object.keys(reply), ...Object.keys(reading)].slice(0, 14).join(', ')}` }
  const got = String(scope[field])
  return got === expect
    ? { at, claim, verdict: 'verified', reason: `${field} is ${got}, as claimed` }
    : { at, claim, verdict: 'unverified', reason: `${field} is ${got}, the claim says ${expect}`, next: 'correct the claim or name the source that holds the value' }
}

const main = async () => {
  const family = argOf('--family')
  const claimText = argOf('--claim')
  const source = argOf('--source')
  const field = argOf('--field')
  const expect = argOf('--expect')
  let verdict: Verdict
  if (claimText !== undefined) {
    verdict = await claimVerdictOf(family ? `${claimText} (family ${family})` : claimText, expect ?? '', sourcesOf, (s, args) => connector({ source: s, ...args, ...(family ? { family } : {}) }))
  } else if (source && field && expect !== undefined) {
    const claim = `${source}.${field} = ${expect}${family ? ` (family ${family})` : ''}`
    verdict = fieldVerdictOf(claim, await connector({ source, ...(family ? { family } : {}) }), field, expect)
  } else {
    console.error('usage: npm run court -- --claim "<text>" --expect <value>  |  --source <s> --field <f> --expect <value>')
    process.exit(2)
  }
  const log: Verdict[] = existsSync(verdictsFile) ? JSON.parse(readFileSync(verdictsFile, 'utf8')) : []
  log.push(verdict)
  writeFileSync(verdictsFile, JSON.stringify(log, null, 1) + '\n')
  console.log(JSON.stringify(verdict, null, 1))
}

await main()
