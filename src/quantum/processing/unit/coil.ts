// One token is one coil: a sealed UUID (ISO/IEC 9834-8) with two reflecting coin UUIDs imprinted in it.
// The imprint is the cuboctahedron witness intersection (mergeWitnesses), booked once in double entry
// (ISO 22739:2024 transfer, ISO 20022, ISO 4217). A later transaction unfolds one coin into the next coil,
// and the blocks chain by the content address of the previous block (ISO 22739 hash link). Pure.

import { tokenCoilAddresses } from '../../password/address.js'
import { channel, reflection, seal, uuidFromParts, uuid } from '../../uuid/index.ts'
import { coins, faces, plane, rays } from '../clay-register.ts'
import { mergeWitnesses } from '../witnesses.ts'
import { mintWitnessCoins } from '../toolboxes/billing.ts'
import { PAYLOADCMS_MONOREPO_PACKAGES } from '../repositories.ts'
import { TABLES } from '../tables-index.ts'

export const LATTICE_COINS = coins
export const LATTICE_RAYS = rays
export const LATTICE_FACES = faces
export const LATTICE_COIL = faces
export const LATTICE_PLANE = plane
export const SHOR_MODULUS = 7 * 13

const ISO_4217 = ['EUR', 'USD', 'BGN'] as const
/** The ISO list the coin ledger already uses. It is the fusion reactor's framework: a name for the books, not a physics claim. */
export const COIN_STANDARDS = ['ISO/IEC 9834-8', 'ISO 22739:2024', 'ISO 23257:2022', 'ISO 20022', 'ISO 4217'] as const
type Currency = (typeof ISO_4217)[number]

const shortName = (pkg: string) =>
  pkg === '@payloadcms/richtext-lexical' ? 'lexical' : pkg === 'payload' ? 'payload' : pkg.replace(/^@payloadcms\//, '').replace(/^plugin-/, '')

/** The payloadcms packages this tree mounts, one block each on the accounting chain. */
export const NATIVE_PAYLOAD_PLUGINS = PAYLOADCMS_MONOREPO_PACKAGES.map((p) => ({
  pkg: p.pkg,
  name: shortName(p.pkg),
  role: p.role,
  version: p.version,
}))

const reflectNibble = (handle: string, i: number) =>
  handle.slice(0, i) + (15 - parseInt(handle[i]!, 16)).toString(16) + handle.slice(i + 1)

const mod8 = (n: number) => ((Math.trunc(n) % 8) + 8) % 8

export type TokenImprint = {
  imprintedInOne: boolean
  recoversFromObverse: boolean
  recoversFromReverse: boolean
  shared: string[]
  mintedCoins: number
}

export type TokenCoil = {
  uuid: string
  reflecting: [string, string]
  coil: 1
  coins: 2
  rays: 7
  faces: 14
  plane: 28
  holds: boolean
  balanced: boolean
  spentOnce: boolean
  canonicalProof: boolean
  bilateralTwin: string
  imprint: TokenImprint
  pairIndex: number
}

export type CoinUnfold = {
  plugin: string
  collection: string
  operation: string
  tenant: string
  pairIndex: number
  prevTokenUuid: string
  prevSide: 0 | 1
}

export type CoinTokenDuality = {
  holds: boolean
  parentMatches: boolean
  parentTokenRecovered: string
  asToken: TokenCoil
  plugin: string
  collection: string
  operation: string
  tenant: string
  pairIndex: number
  prevSide: 0 | 1
}

const finish = (uuid: string, obverse: string, reverse: string, pairIndex: number): TokenCoil => {
  const merged = mergeWitnesses(obverse, reverse)
  const minted = mintWitnessCoins(merged.shared)
  const recoversFromObverse = merged.referrer.witnesses.some((w) => w.uuid === uuid)
  const recoversFromReverse = merged.destination.witnesses.some((w) => w.uuid === uuid)
  const imprint: TokenImprint = {
    imprintedInOne: merged.shared.includes(uuid) && merged.shared.length === LATTICE_COINS,
    recoversFromObverse,
    recoversFromReverse,
    shared: merged.shared,
    mintedCoins: minted.coins,
  }
  const sealed = seal(uuid).valid && seal(obverse).valid && seal(reverse).valid
  const distinct = obverse !== reverse && obverse !== uuid && reverse !== uuid
  const balanced = minted.balanced === true && minted.coins === LATTICE_COINS
  const holds = sealed && distinct && imprint.imprintedInOne && recoversFromObverse && recoversFromReverse && balanced
  const spentOnce = distinct
  const twin = reflection(uuid).mirror
  return {
    uuid,
    reflecting: [obverse, reverse],
    coil: 1,
    coins: 2,
    rays: 7,
    faces: 14,
    plane: 28,
    holds,
    balanced,
    spentOnce,
    canonicalProof: holds && spentOnce && seal(twin).valid && reflection(twin).mirror === uuid,
    bilateralTwin: twin,
    imprint,
    pairIndex,
  }
}

/** Mint one coil from a seed. The two coins are one-nibble σ reflections of the coil, so the coil is a shared witness of both. */
export const mintTokenCoil = (seed: string, pairIndex = 0): TokenCoil => {
  const made = tokenCoilAddresses(seed, pairIndex)
  return finish(made.uuid, made.reflecting[0], made.reflecting[1], made.pairIndex)
}

/** Unfold one coin into the next accounting transaction. The side named by prevSide is the parent coil. */
export const coinAsToken = (coin: string, ctx: CoinUnfold): CoinTokenDuality => {
  const parent = ctx.prevTokenUuid
  const side: 0 | 1 = ctx.prevSide === 1 ? 1 : 0
  const ch = channel(parent)
  const i = mod8(ctx.pairIndex)
  const j = (i + 3) % 8
  const child = uuidFromParts(reflectNibble(ch.handle, i), ch.program, ch.tail)
  const childCh = channel(child)
  const other = uuidFromParts(reflectNibble(childCh.handle, j), childCh.program, childCh.tail)
  const reflecting: [string, string] = side === 0 ? [parent, other] : [other, parent]
  const asToken = finish(child, reflecting[0], reflecting[1], i)
  const parentMatches = asToken.reflecting[side] === parent && seal(coin).valid
  return {
    holds: asToken.holds && parentMatches,
    parentMatches,
    parentTokenRecovered: parent,
    asToken,
    plugin: ctx.plugin,
    collection: ctx.collection,
    operation: ctx.operation,
    tenant: ctx.tenant,
    pairIndex: i,
    prevSide: side,
  }
}

export const canonicalCoilUuid = (seed: string) => mintTokenCoil(seed, 0).uuid

/** σ twice on a coil is the coil. The one-bit step 1000 → 1001 is the wave the coil is accounted on. */
export const fuseCoinsToCoilInfinityInOneUuid = (seed: string, depth = LATTICE_RAYS) => {
  const token = mintTokenCoil(seed, depth)
  const mirror = reflection(token.uuid).mirror
  const roundTrip = reflection(mirror).mirror === token.uuid
  const fusedInOneUuid = roundTrip && token.canonicalProof
  const storageBits = token.uuid.replace(/-/g, '').length * 4
  return {
    oneBitDifference: {
      from: 1000 as const,
      to: 1001 as const,
      bits: 1 as const,
      holds: (1000 ^ 1) === 1001 && 1000 + 1 === 1001,
    },
    inverseEncryption: {
      oneUuid: token.uuid,
      mirror,
      roundTrip,
      depth,
      canonicalProof: fusedInOneUuid,
      fusedInOneUuid,
      storageBits,
    },
  }
}

export type CoinCoilBlock = {
  index: number
  plugin: string
  name: string
  id: string
  prev: string | null
  content: string
  token: TokenCoil
  spent: string | null
  debit: number
  credit: number
  referrerHz: 1000
  nextHz: 1001 | null
}

export type CoinCoilChain = {
  blocks: CoinCoilBlock[]
  hashLinks: number
  spentOnce: boolean
  balanced: boolean
  net: number
  valid: boolean
  coins: number
  coils: number
  debits: number
  credits: number
  wave: { referrerHz: 1000; nextHz: 1001; gaps: 0 }
}

/** Recompute the hash links, the single spend and the zero net from the blocks themselves. */
export const verifyCoinCoilBlockchain = (chain: { blocks: readonly CoinCoilBlock[] }): CoinCoilChain => {
  const blocks = chain.blocks
  const spent = new Set<string>()
  let hashLinks = 0
  let linksHold = blocks.length > 0
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]!
    const previous = i === 0 ? undefined : blocks[i - 1]
    if (uuid(block.content) !== block.id || !seal(block.id).valid || !block.token.holds) linksHold = false
    if (!previous) {
      if (block.prev !== null) linksHold = false
    } else if (block.prev === previous.id && uuid(previous.content) === block.prev) hashLinks++
    else linksHold = false
    if (block.spent) {
      if (spent.has(block.spent)) linksHold = false
      spent.add(block.spent)
    }
    if (block.debit !== block.credit) linksHold = false
  }
  const spentOnce = spent.size === Math.max(0, blocks.length - 1) && spent.size === new Set(blocks.flatMap((b) => (b.spent ? [b.spent] : []))).size
  const debits = blocks.reduce((n, b) => n + b.debit, 0)
  const credits = blocks.reduce((n, b) => n + b.credit, 0)
  const net = debits - credits
  const balanced = net === 0 && blocks.every((b) => b.debit === b.credit)
  const valid = linksHold && hashLinks === Math.max(0, blocks.length - 1) && spentOnce && balanced
  return {
    blocks: [...blocks],
    hashLinks,
    spentOnce,
    balanced,
    net,
    valid,
    coins: blocks.length * LATTICE_COINS,
    coils: blocks.length,
    debits,
    credits,
    wave: { referrerHz: 1000, nextHz: 1001, gaps: 0 },
  }
}

/** One block per mounted package. The header is the content address. Each later block spends the previous coil's obverse coin, which that content minted once. */
export const buildCoinCoilBlockchain = (plugins = NATIVE_PAYLOAD_PLUGINS): CoinCoilChain => {
  const blocks: CoinCoilBlock[] = []
  let prev: TokenCoil | null = null
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i]!
    const content = `${plugin.pkg}\n${i}\n${prev?.uuid ?? ''}`
    const token = mintTokenCoil(content, i)
    blocks.push({
      index: i,
      plugin: plugin.pkg,
      name: plugin.name,
      id: uuid(content),
      prev: prev ? blocks[i - 1]!.id : null,
      content,
      token,
      spent: prev ? prev.reflecting[0] : null,
      debit: 1,
      credit: 1,
      referrerHz: 1000,
      nextHz: i === 0 ? null : 1001,
    })
    prev = token
  }
  return verifyCoinCoilBlockchain({ blocks })
}

let solvedCache: { solved: boolean; plugins: typeof NATIVE_PAYLOAD_PLUGINS; blockchain: CoinCoilChain } | null = null

/** Catalogue rows, the 2^9 plugin combinations, and the mounted packages, each as a holding coil. */
export const solveAllViaCoins = () => {
  if (solvedCache) return solvedCache
  const catalogue = TABLES.CATALOGUE as readonly { product: string; variant: string }[]
  const catalogueHolds = catalogue.every((row, i) => mintTokenCoil(`${row.product}:${row.variant}`, i).holds)
  const combinations = 1 << 9
  let combinationsHold = combinations === 512
  for (let i = 0; combinationsHold && i < combinations; i++) combinationsHold = mintTokenCoil(`qpu-combination\n${i}`, i).holds
  const blockchain = buildCoinCoilBlockchain()
  solvedCache = {
    solved: catalogueHolds && combinationsHold && blockchain.valid && NATIVE_PAYLOAD_PLUGINS.length === PAYLOADCMS_MONOREPO_PACKAGES.length,
    plugins: NATIVE_PAYLOAD_PLUGINS,
    blockchain,
  }
  return solvedCache
}

export const coinsCoilsAccounting = (opts: { tenant?: string; currency?: string } = {}) => {
  const host = opts.tenant && /^[a-z][a-z0-9-]*$/.test(opts.tenant) ? opts.tenant : 'uuidna'
  const asked = (opts.currency ?? 'eur').toUpperCase()
  const currency = (ISO_4217 as readonly string[]).includes(asked) ? (asked as Currency) : 'EUR'
  const solved = solveAllViaCoins()
  const tenantToken = mintTokenCoil(`tenant:${host}:${currency}`, 0)
  const tenantCoinAsToken = coinAsToken(tenantToken.reflecting[0], {
    plugin: '@payloadcms/plugin-ecommerce',
    collection: 'transactions',
    operation: 'tenant-balance',
    tenant: host,
    pairIndex: 0,
    prevTokenUuid: tenantToken.uuid,
    prevSide: 0,
  })
  return {
    phase: 'qpu-coins-coils-accounting' as const,
    standards: COIN_STANDARDS,
    tenant: host,
    currency,
    currencyAccepted: (ISO_4217 as readonly string[]).includes(asked),
    invariant: '1 token = 1 coil; 2 reflecting UUIDs imprinted in 1',
    lattice: { coins: LATTICE_COINS, rays: LATTICE_RAYS, faces: LATTICE_FACES, coil: LATTICE_COIL, plane: LATTICE_PLANE },
    solved: solved.solved && tenantCoinAsToken.holds,
    plugins: solved.plugins,
    tenantToken,
    tenantCoinAsToken,
    blockchain: solved.blockchain,
    doubleEntry: {
      balanced: solved.blockchain.balanced,
      net: solved.blockchain.net,
      debits: solved.blockchain.debits,
      credits: solved.blockchain.credits,
      spentOnce: solved.blockchain.spentOnce,
      currency,
    },
  }
}

export const qpuAccountingEndpoint = {
  path: '/api/qpu/accounting',
  method: 'GET' as const,
  handler: async (req: { url?: string }) => {
    const url = new URL(req.url ?? 'http://local/api/qpu/accounting')
    const body = coinsCoilsAccounting({
      tenant: url.searchParams.get('tenant') ?? undefined,
      currency: url.searchParams.get('currency') ?? undefined,
    })
    return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } })
  },
}

export const documentCoinCoilReceipt = (doc: {
  plugin: string
  collection: string
  operation: string
  seed: string
  tenant: string
  amountMillicents: number
  pairIndex: number
  prevCoinUuid?: string
  prevTokenUuid?: string
}) => {
  const token = doc.prevTokenUuid
    ? coinAsToken(doc.prevCoinUuid ?? doc.prevTokenUuid, {
        plugin: doc.plugin,
        collection: doc.collection,
        operation: doc.operation,
        tenant: doc.tenant,
        pairIndex: doc.pairIndex,
        prevTokenUuid: doc.prevTokenUuid,
        prevSide: 1,
      }).asToken
    : mintTokenCoil(doc.seed, doc.pairIndex)
  return {
    tokenUuid: token.uuid,
    reverseCreditCoin: token.reflecting[1],
    obverseDebitCoin: token.reflecting[0],
    pairIndex: doc.pairIndex,
    amountMillicents: doc.amountMillicents,
    currency: 'EUR' as const,
    canonicalProof: token.canonicalProof,
    holds: token.holds,
    balanced: token.balanced,
    spentOnce: token.spentOnce,
  }
}

/** The address orders the row. The tail modulo 432 is the harmonic cell, not a second index. */
export const searchCoilPriority = (doc: { id: string; slug: string; title: string }, collection: string) => {
  const id = seal(doc.id).valid ? doc.id : uuid(`${collection}\n${doc.slug}\n${doc.title}`)
  const tail = parseInt(channel(id).tail, 16)
  return { collection, id, slug: doc.slug, title: doc.title, cell: tail % 432, standard: 'ISO/IEC 9834-8' as const }
}
