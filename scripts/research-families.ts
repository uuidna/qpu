#!/usr/bin/env node
/**
 * EVERY FAMILY READS ITS USABLE APIS, THROUGH MCP WAVES. The connector's send route runs one wave at a time: the units
 * of a wave are independent families, each walking the research source through every next position until every usable
 * API its words name is read. The driver sends waves until the last family is covered. Nothing is sent in one call that
 * a server could drop: each wave is one call, and the next wave starts at the position the last one returned.
 *
 *   npm run research:families                      (host QPU_HOST, default http://127.0.0.1:8787)
 *
 * Results go to scripts/research.families.json: per family, the matched, read and answered counts, and its status.
 */
import { writeFileSync } from 'node:fs'
import { request as httpRequest } from 'node:http'
import { request as httpsRequest } from 'node:https'
import { join } from 'node:path'

const HOST = process.env.QPU_HOST
  ? (/^https?:\/\//.test(process.env.QPU_HOST) ? process.env.QPU_HOST : `https://${process.env.QPU_HOST}`)
  : 'http://127.0.0.1:8787'
const out = join(import.meta.dirname, 'research.families.json')
const WIDTH = 16

type Unit = { family: string; matched: number; read: number; answered: number; pages: number; covered: boolean; warning?: string }
type Wave = { wave: number; from: number; width: number; units: Unit[]; covered: number; uuid: string }
type Sent = { families: number; width: number; sent: number; covered: number; next?: number; waves: Wave[] }

/** A POST that waits as long as the server takes: no client deadline cuts a family's walk short. */
const post = (url: string, body: string): Promise<string | null> =>
  new Promise((resolve) => {
    const u = new URL(url)
    const send = u.protocol === 'https:' ? httpsRequest : httpRequest
    const req = send({ hostname: u.hostname, port: u.port || undefined, path: u.pathname, method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', 'content-length': Buffer.byteLength(body) } }, (res) => {
      const chunks: Buffer[] = []
      res.on('data', (c: Buffer) => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      res.on('error', () => resolve(null))
    })
    req.on('error', () => resolve(null))
    req.setTimeout(0)
    req.end(body)
  })

/** One wave, sent as one MCP call to the connector's send route, from one family position. */
const sendWave = async (from: number, width = WIDTH): Promise<Sent | null> => {
  const body = await post(`${HOST.replace(/\/$/, '')}/mcp`, JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'connector', arguments: { send: true, over: 'families', from, width, full: true } } }))
  try {
    const text = (JSON.parse(body ?? 'null') as { result?: { content?: { text?: string }[] } } | null)?.result?.content?.[0]?.text
    return typeof text === 'string' ? (JSON.parse(text) as Sent) : null
  } catch {
    return null
  }
}

const main = async () => {
  const units: Unit[] = []
  let families = 0
  let from = 0
  for (;;) {
    const sent = await sendWave(from)
    if (sent) {
      families = sent.families
      for (const w of sent.waves) units.push(...w.units)
      if (sent.next === undefined) break
      from = sent.next
    } else {
      // a wave that holds a long family outlasts the request: its members are then sent one family per call, so each
      // family's walk still runs to its end, and no unit is dropped
      if (families === 0) throw new Error(`the first wave did not answer`)
      const end = Math.min(from + WIDTH, families)
      for (let i = from; i < end; i++) {
        const one = await sendWave(i, 1)
        if (!one) throw new Error(`the family at ${i} did not answer`)
        for (const w of one.waves) units.push(...w.units)
      }
      if (end >= families) break
      from = end
    }
    console.log(`${units.length}/${families} families walked, ${units.filter((u) => u.covered).length} covered`)
  }
  const covered = units.filter((u) => u.covered).length
  writeFileSync(out, JSON.stringify({ host: HOST, families, covered, rows: units }, null, 1) + '\n')
  console.log(`families: ${families}, covered by a usable API: ${covered}`)
}

await main()
