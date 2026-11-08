// Game seeds. The collision framework is collisions.ts, verified through CERN, NIST and these seeds.
// Each seed is a website pages document: draft, default hero, one content block.

import { coins, seal } from '../uuid/index.ts'
import { findArgs, pageData, writeArgs } from '../payload/index.ts'
import { accountBytes } from '../processing/toolboxes/billing.ts'
import { asset, loadable } from './unreal/index.ts'

const LINES = [
  { name: 'chess', says: 'the chess players are the players of every other game' },
  { name: 'tarro', says: 'the original tarot is 56 suit cards and 22 trumps' },
  { name: 'unreal', says: 'a game seed is a glTF 2.0 asset Unreal loads when it requires none of the six extensions' },
] as const

const coinOf = (text: string) => { const booked = coins([text]); const address = booked.coins[0] ?? null; return { address, sealed: !!address && seal(address).valid && booked.sealed } }

const measure = (texts: readonly string[]) => {
  const booked = accountBytes(texts)
  const held = coins(texts)
  const line = booked.line
  const holds = booked.holds && held.sealed && line.count === booked.bytes && line.amount === 0 && line.debit === 'usage:bytes' && line.credit === 'coins:author'
  return { coins: held.count, bytes: booked.bytes, bits: booked.bits, address: booked.uuid, sealed: booked.sealed && held.sealed, line, holds, theorem: booked.theorem }
}

const seedOf = (name: string, says: string) => {
  const { page } = pageData(name, says)
  const create = writeArgs(page)
  const block = page.layout[0]
  const read = loadable(asset(name))
  const website = page._status === 'draft' && page.hero.type === 'default' && page.layout.length === 1 && block?.blockType === 'content' && block.contentFields.layout === 'oneColumn' && page.meta.title === page.title && page.breadcrumbs[0]?.url === `/${page.slug}`
  return { name, says, theorem: name, coin: coinOf(says), impact: measure([JSON.stringify(create.data)]), page, find: findArgs(page.slug), create, website, collection: 'pages' as const, schema: 'pages' as const, slot: 'content' as const, phase: 'seed' as const, unreal: { version: read.version, loadable: read.loadable, theorem: read.theorem }, iso: 'ISO/IEC 12113:2022' as const }
}

const seeds = () => LINES.map((line) => seedOf(line.name, line.says))

const play = (move: string) => LINES.map((line) => seedOf(line.name, `${line.says}\n${move}`))

const impact = (move?: string) => {
  const standing = seeds()
  const rows = move === undefined ? standing : play(move)
  const booked = measure(rows.map((seed) => JSON.stringify(seed.create.data)))
  const prior = measure(standing.map((seed) => JSON.stringify(seed.create.data)))
  const sum = rows.reduce((n, seed) => n + seed.impact.bytes, 0)
  const delta = booked.bytes - prior.bytes
  return { ...booked, pages: rows.length, sum, delta, holds: booked.holds && prior.holds && sum === booked.bytes && rows.every((seed) => seed.impact.holds && seed.coin.sealed && seed.website) && (move === undefined ? delta === 0 : delta > 0) }
}

const capabilities = () => {
  const games = seeds()
  const booked = impact()
  return { experimental: { games: { framework: 'collisions' as const, doors: ['cern', 'nist', 'games'] as const, impact: { coins: booked.coins, bytes: booked.bytes, bits: booked.bits, address: booked.address, sealed: booked.sealed, line: booked.line, delta: booked.delta, holds: booked.holds, theorem: booked.theorem }, seeds: games.map((seed) => ({ name: seed.name, address: seed.coin.address, sealed: seed.coin.sealed, bytes: seed.impact.bytes, loadable: seed.unreal.loadable, iso: seed.iso, website: seed.website, collection: seed.collection, slug: seed.page.slug, url: seed.page.breadcrumbs[0]?.url ?? null })), play: 'a move reseals every seed' as const } } }
}

const engine = { seeds, play, impact, capabilities }

export { seeds, play, impact, capabilities }
export { enginePlugin as plugin } from '../plugin.ts'
export default engine
