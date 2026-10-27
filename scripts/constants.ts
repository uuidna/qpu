// The client of seal { constants }, a step of every online next: CODATA's table fetched once (NIST, open, no key), handed to the tool, and the
// constants it reads into exact integers, each sealed with its stated uncertainty kept, written to constants.json. Nothing is made truer by it.
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import './teleport.ts'
import { toolCallerOf } from '../src/quantum/mcp.ts'
import { LICENSE } from '../src/quantum/license.ts'
import { fetchWithTimeout } from './mcp.ts'

const ROOT = process.cwd()
const call = toolCallerOf('seal')
const plan = call({ text: 'codata', constants: true }) as { requestList: { url: string; accept: string }[] }
const r = plan.requestList[0]!
const res = await fetchWithTimeout(r.url, r.accept).catch(() => null)
const text = res?.ok ? await res.text() : ''
const out = call({ text: 'codata', constants: { text } }) as { adjustment: string | null; constants: unknown[]; exact: number; measured: number; says: string }
writeFileSync(join(ROOT, 'docs', 'public', 'constants.json'), JSON.stringify({ license: LICENSE.attribution, date: new Date().toISOString(), source: r.url, status: res?.status ?? 0, adjustment: out.adjustment, exact: out.exact, measured: out.measured, constants: out.constants }, null, 1))
console.log(`constants: ${res?.ok ? out.says : `the table was not read (HTTP ${res?.status ?? 0})`}`)
