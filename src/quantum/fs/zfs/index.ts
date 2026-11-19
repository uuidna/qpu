// ZFS object set. The object number is the handle: eight nibble levels, fanout 16, span 16^8.
// A birth is the whole UUID: eight groups of four hex, fanout 65536, 128 bits. The dnode bonus
// is the ten program nibbles and the three tail words. A rotation keeps the object and the bonus tail.

const INDIRECT_SHIFT = 4
const FANOUT = 1 << INDIRECT_SHIFT
const LEVELS = 8
const BITS = LEVELS * INDIRECT_SHIFT
export const SPAN = 16n ** BigInt(LEVELS)
const DATASET = 'src/quantum/uuid/programs'

const objectOf = (handle: string) => {
  if (!/^[0-9a-f]{8}$/.test(handle)) throw new Error('a handle is 8 hex')
  const folders = [...handle]
  const levels = folders.map((hex, at) => ({ level: LEVELS - 1 - at, hex, index: Number.parseInt(hex, 16), shift: (LEVELS - 1 - at) * INDIRECT_SHIFT }))
  const own = `${DATASET}/${folders.join('/')}`
  return {
    pkg: 'zfs' as const,
    dataset: DATASET,
    object: BigInt(`0x${handle}`).toString(),
    handle,
    levels,
    count: LEVELS,
    fanout: FANOUT,
    bits: BITS,
    span: SPAN.toString(),
    depth: LEVELS - 1 as 7,
    folders,
    own,
    path: `${own}/index.ts`,
    dnode: { level: 0 as const, bonus: { program: null, tail: null } },
  }
}

/** One UUID is one birth. The object stays the handle. The bonus is the program and the three tail words. The checksum is the UUID, eight groups of four hex. */
const birthOf = (id: string) => {
  const hex = id.toLowerCase().replace(/-/g, '')
  if (!/^[0-9a-f]{32}$/.test(hex)) throw new Error('a birth is one uuid')
  const handle = hex.slice(0, 8)
  const middle = hex.slice(8, 20)
  const tail = hex.slice(20, 32)
  const program = [...middle].filter((_c, i) => i !== 4 && i !== 8).map((c) => Number.parseInt(c, 16))
  const words = [0, 4, 8].map((at) => Number.parseInt(tail.slice(at, at + 4), 16))
  const groups = [0, 4, 8, 12, 16, 20, 24, 28].map((at) => hex.slice(at, at + 4))
  const object = objectOf(handle)
  return {
    ...object,
    checksum: `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`,
    dnode: { level: 0 as const, bonus: { program, tail: words } },
    birth: { folders: groups, path: groups.join('/'), fanout: 65536 as const, bits: 128 as const, levels: 8 as const, depth: 7 as const },
  }
}

const NIL = '00000000-0000-0000-0000-000000000000'

/** The pool improves when object 0 is the nil handle and its birth is the nil UUID. */
export const improve = () => {
  const object = objectOf('00000000')
  const born = birthOf(NIL)
  const placed = object.path === `${DATASET}/0/0/0/0/0/0/0/0/index.ts` && object.span === SPAN.toString() && object.count === LEVELS && object.depth === 7 && object.fanout === FANOUT && object.bits === BITS
  const zero = born.path === object.path && born.checksum === NIL && born.dnode.bonus.program.length === 10 && born.dnode.bonus.program.every((n) => n === 0) && born.dnode.bonus.tail.length === 3 && born.dnode.bonus.tail.every((n) => n === 0) && born.birth.bits === 128 && born.birth.fanout === 65536 && born.birth.folders.length === 8 && born.birth.folders.every((group) => group === '0000') && born.birth.depth === 7
  return { pkg: 'zfs' as const, placed, zero, holds: placed && zero, span: object.span, fanout: object.fanout, birthFanout: born.birth.fanout, bits: born.birth.bits, depth: object.depth }
}

const zfs = { pkg: 'zfs' as const, dataset: DATASET, fanout: FANOUT, levels: LEVELS, bits: BITS, span: SPAN.toString(), object: objectOf, birth: birthOf, improve }
export default zfs
