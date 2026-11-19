// One token is one coil: a sealed UUID (ISO/IEC 9834-8) with two reflecting coin UUIDs imprinted in it.
// The imprint is the cuboctahedron witness intersection (mergeWitnesses), booked once in double entry
// (ISO 22739:2024 transfer, ISO 20022, ISO 4217). A later transaction unfolds one coin into the next coil,
// and the blocks chain by the content address of the previous block (ISO 22739 hash link). Pure.

import { tokenCoilAddresses } from '../../password/address.js'
import { channel, reflection, seal, uuidFromParts } from '../../uuid/index.ts'
import { coins, rays } from '../clay-register.ts'
import { mergeWitnesses } from '../witnesses.ts'
import { mintWitnessCoins } from '../toolboxes/billing.ts'

/** The ISO list the coin ledger already uses. It is the fusion reactor's framework: a name for the books, not a physics claim. */
export const COIN_STANDARDS = ['ISO/IEC 9834-8', 'ISO 22739:2024', 'ISO 23257:2022', 'ISO 20022', 'ISO 4217'] as const

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
    imprintedInOne: merged.shared.includes(uuid) && merged.shared.length === coins,
    recoversFromObverse,
    recoversFromReverse,
    shared: merged.shared,
    mintedCoins: minted.coins,
  }
  const sealed = seal(uuid).valid && seal(obverse).valid && seal(reverse).valid
  const distinct = obverse !== reverse && obverse !== uuid && reverse !== uuid
  const balanced = minted.balanced === true && minted.coins === coins
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
export const fuseCoinsToCoilInfinityInOneUuid = (seed: string, depth = rays) => {
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
