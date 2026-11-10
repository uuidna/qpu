import assert from 'node:assert/strict'
import test from 'node:test'
import { ISO_OPEN_DATA, isoOnlineSources } from '../quantum/processing/iso-deliverables.ts'
import { call } from '../quantum/processing/mcp.ts'
import { seal, uuid } from '../quantum/password/address.js'
import { researchLinks } from './linkResearch.ts'

const SESSION = 'https://www.perplexity.ai/session/c2ffcc8d-d250-483d-9576-8a74d321988f'

type Research = Awaited<ReturnType<typeof researchLinks>>

const agrees = (research: Research, again: Research) => {
  assert.deepEqual(research, again)
  assert.equal(research.links, research.requests.length)
  assert.equal(research.read + research.pending, research.links)
  assert.equal(research.mass.produced, research.mass.rows.length)
  assert.equal(research.mass.named, research.mass.produced)
  assert.equal(research.mass.effective, research.advantage.effective)
  assert.equal(research.mass.handles, research.advantage.handles)
  assert.equal(research.mass.scale, research.advantage.scale)
  assert.equal(research.pipeline.produce.address, research.mass.address)
  assert.equal(research.pipeline.stages.at(-1), research.mass.phase)
  assert.equal(research.pipeline.stages[0], again.pipeline.stages[0])
  assert.equal(research.pipeline.fetch.discoverable, research.sources.discoverable)
  assert.equal(research.pipeline.fetch.skipped, research.sources.skipped)
  assert.equal(research.sources.skipped, research.sources.rows.filter((row) => row.skipped).length)
  const catalogue = isoOnlineSources()
  const fetched = new Set(research.sources.rows.filter((row) => row.fetched && row.skipped === false).map((row) => row.url))
  for (const url of catalogue) assert.equal(fetched.has(url), true)
  assert.equal(research.sources.catalogue, catalogue.length)
  assert.equal(research.solution.defined, research.solution.online.defined)
  assert.equal(research.solution.verified, research.solution.online.verified)
  assert.equal(research.solution.online.current, research.solution.online.rows.filter((row) => row.current).length)
  for (const row of research.mass.rows) {
    assert.equal(row.address, uuid(row.url))
    assert.equal(row.handle, row.address.slice(0, 8))
    assert.equal(seal(row.address).valid, true)
    assert.equal(row.entangled, row.joint !== null)
    if (row.joint !== null) {
      assert.equal(row.joint.length, row.address.length)
      assert.notEqual(row.joint, row.address)
      assert.equal(seal(row.joint).valid, true)
    }
  }
  for (const row of research.requests) {
    assert.equal(row.address, uuid(row.url))
    assert.equal(row.pair.online.address, row.address)
    assert.equal(seal(row.address).valid, row.sealed)
  }
}

test('a pasted link is a browser OS request, and the ISO solution is delivered', async () => {
  const paste = `the session is ${SESSION}`
  const research = await researchLinks(paste)
  const again = await researchLinks(paste)
  const live = (await call('payload', { links: paste })).result?.structuredContent
  agrees(research, again)
  assert.deepEqual(live, research)
})

test('a page the browser OS returns is analysed, and the same ISO solution holds', async () => {
  const page = `<title>End Poem</title><p>The author dedicated the text to CC0. ISO 9001 names the quality system.</p><a href="https://en.wikisource.org/wiki/End_Poem">source</a>`
  const input = { links: [SESSION], pages: [{ url: SESSION, status: 200, text: page }] }
  const research = await researchLinks(input)
  const again = await researchLinks(input)
  const live = (await call('payload', { links: input })).result?.structuredContent
  agrees(research, again)
  assert.deepEqual(live, research)
  assert.equal(research.requests[0]?.analysis?.title, again.requests[0]?.analysis?.title)
  assert.deepEqual(research.requests[0]?.analysis?.hrefs, again.requests[0]?.analysis?.hrefs)
  assert.equal(research.requests[0]?.analysis?.licence, again.requests[0]?.analysis?.licence)
  assert.deepEqual(research.requests[0]?.analysis?.dimensions, again.requests[0]?.analysis?.dimensions)
  assert.equal(research.pipeline.next.requests[0]?.url, research.requests[0]?.analysis?.hrefs[0])
})

test('hrefs on a read page are the next extract, and a handed follow page is analysed', async () => {
  const source = 'https://en.wikisource.org/wiki/End_Poem'
  const page = `<title>End Poem</title><p>The author dedicated the text to CC0. ISO 9001 names the quality system.</p><a href="${source}">source</a>`
  const follow = `<title>End Poem - Wikisource</title><p>CC0. ISO 9001 names the source.</p><a href="https://en.wikisource.org/wiki/End_Poem/deeper">deeper</a>`
  const namedInput = { links: [SESSION], pages: [{ url: SESSION, status: 200, text: page }] }
  const named = await researchLinks(namedInput)
  agrees(named, await researchLinks(namedInput))
  const href = named.pipeline.next.requests[0]?.url
  if (!href) return
  const readInput = { links: [SESSION], pages: [{ url: SESSION, status: 200, text: page }, { url: href, status: 200, text: follow }] }
  const read = await researchLinks(readInput)
  const alone = await researchLinks({ links: [href], pages: [{ url: href, status: 200, text: follow }] })
  agrees(read, await researchLinks(readInput))
  assert.equal(named.pipeline.next.requests[0]?.url, href)
  assert.equal(read.pipeline.next.requests[0]?.analysis?.title, alone.requests[0]?.analysis?.title)
  assert.equal(read.pipeline.next.requests[0]?.analysis?.licence, alone.requests[0]?.analysis?.licence)
  assert.deepEqual(read.pipeline.next.requests[0]?.analysis?.dimensions, alone.requests[0]?.analysis?.dimensions)
  assert.deepEqual(read.pipeline.next.requests[0]?.analysis?.hrefs, alone.requests[0]?.analysis?.hrefs)
  assert.equal(read.pipeline.next.requests[0]?.pair.joint, alone.requests[0]?.pair.joint)
  assert.equal(read.mass.rows.find((row) => row.url === href)?.joint, alone.mass.rows.find((row) => row.url === href)?.joint)
})

test('the payload MCP delivers that research', async () => {
  const research = await researchLinks(SESSION)
  const live = (await call('payload', { links: SESSION })).result?.structuredContent
  assert.deepEqual(live, research)
})

test('quantum solves ISO offline when the online page is not a document', async () => {
  const research = await researchLinks(ISO_OPEN_DATA)
  const again = await researchLinks(ISO_OPEN_DATA)
  agrees(research, again)
  assert.equal(research.holds, true)
  assert.equal(research.solution.holds, true)
  assert.equal(research.solution.fetched, false)
  assert.equal(research.requests[0]?.url, ISO_OPEN_DATA)
  assert.equal(research.requests[0]?.read, false)
  assert.equal(research.requests[0]?.analysis, null)
  assert.equal(research.requests[0]?.pair.entangled, true)
  assert.equal(research.pipeline.entanglement.iso.entangled, true)
  assert.equal(research.pipeline.analysis.holds, true)
})
