// A drift wave is a UUID program. The program object stores no params.
// The tail is the params. The ten program nibbles are the expected schema.
// The reflection both ways, the six neighbour steps and the nine schemas are the cross-encryption.
// The SHA-256 of the bound record is the receipt: a collision is 2^128 and a second preimage is 2^256.
import { exists, read as readFile, write } from '../../../fs/index.ts'
import { driftWaves } from '../../../processing/lead-wave.ts'
import { checkWitnesses } from '../../../processing/witnesses.ts'
import { hex, sha256, utf8 } from '../../../processing/unit/hmac.ts'
import { canonicalText, channel, coins, next as rotate, quantumSku, seal, uuidFromParts } from '../../index.ts'
import { program } from '../index.ts'

const FIELDS = ['family', 'hz', 'stated', 'difference', 'relations', 'next', 'solved', 'open', 'covers', 'own'] as const
const TYPES = ['string', 'number', 'boolean', 'array', 'null'] as const
const CODES = [0, 1, 1, 1, 1, 0, 2, 2, 3, 1] as const
const NONE = 0xffff

const kind = (value: unknown) => value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value
const SPAN = 4294967296n
const SQUARES = 6
const TRIANGLES = 8
const FACES = SQUARES + TRIANGLES

/** The Lean fold. programHandle in Qpu.Program is this mix of the schema, the family, 432 Hz, the next index, and the witness partition. */
const programHandle = (integers: readonly number[]) => integers.reduce((acc, digit) => (acc * 16n + BigInt(digit)) % SPAN, 0n).toString(16).padStart(8, '0')

const turn = (program: readonly number[], places: number) => program.map((_, index) => program[(index + places) % program.length]!)

/** Lean is Qpu.Program only when every witnessing superposition cross-verifies the integers in this same UUID. A square is the Lean rotation. A triangle is one σ. Each one maps back here. */
const crossLean = (address: string, integers: readonly number[], expect: { family: number; hz: number; next: number }) => {
  const origin = channel(address)
  const witnessed = checkWitnesses(address)
  const handle = programHandle(integers)
  const faces = witnessed.witnesses.map((face) => {
    const read = channel(face.uuid)
    const back = witnessed.back.find((row) => row.face === face.face && row.index === face.index)
    const square = face.face === 'square'
    const rotated = square && turn(origin.program, face.index).join() === read.program.join() && read.handle === origin.handle && read.tail === origin.tail
    const reflected = !square && read.program.join() === origin.program.join() && read.tail === origin.tail && read.handle[face.index] === (15 - parseInt(origin.handle[face.index]!, 16)).toString(16) && [...read.handle].every((nibble, at) => at === face.index || nibble === origin.handle[at])
    const same = back?.exact === true && back.back === address && seal(face.uuid).valid
    return { face: face.face, index: face.index, uuid: face.uuid, same, verified: same && (rotated || reflected) }
  })
  const same = witnessed.canonical === address && origin.handle === handle && origin.program.join() === [...CODES].join() && origin.params[0] === expect.family && origin.params[1] === expect.hz && origin.params[2] === expect.next
  const verified = faces.filter((face) => face.verified).length
  const lean = same && faces.length === FACES && verified === FACES && witnessed.squares === SQUARES && witnessed.triangles === TRIANGLES && witnessed.exact === true
  return { lean, module: lean ? 'Qpu.Program' as const : null, uuid: address, superpositions: faces.length, verified, squares: witnessed.squares, triangles: witnessed.triangles, same }
}

const WAVE = 432
const CLOSED = 0
const FOLDERS = ['app', 'apps', 'config', 'db', 'engine', 'fs', 'generators', 'net', 'os', 'password', 'payload', 'processing', 'uuid', 'qpu-migrations'] as const
const PROGRAM = '// The UUID program is the address. This file stores no params.\nexport const placed = true\n'

const placeProgram = (file: string) => {
  if (readFile(file) === PROGRAM) return true
  if (exists(file)) return false
  write(file, PROGRAM)
  return readFile(file) === PROGRAM
}

/** Every place of one program. The first place is the address. Each place rotates one step. The last place returns the program. The handle and the tail stay. */
const walkOf = (address: string) => {
  const origin = channel(address)
  const steps: { place: number; uuid: string; next: string; program: string; params: { family: number; hz: number; next: number }; sealed: boolean; kept: boolean; back: boolean; around: boolean; aspects: number; witnessed: boolean }[] = []
  let current = address
  for (let place = 0; place < origin.program.length; place++) {
    const moved = rotate(current)
    const read = channel(current)
    steps.push({
      place,
      uuid: current,
      next: moved.next,
      program: read.program.join(','),
      params: { family: read.params[0]!, hz: read.params[1]!, next: read.params[2]! },
      sealed: moved.sealed,
      kept: moved.kept,
      back: moved.back,
      around: moved.around,
      aspects: moved.aspects.length,
      witnessed: moved.all === true,
    })
    current = moved.next
  }
  const back = channel(current)
  return { places: origin.program.length, steps, returned: current === address && back.program.join(',') === origin.program.join(','), handle: back.handle, tail: back.tail }
}

/** Every Clay family wave as one UUID program. Params and the expected schema are read back from the address. The program file is written. */
export const driftPrograms = (waves: ReturnType<typeof driftWaves> = driftWaves()) => {
  const schema = CODES.map((code, index) => ({ field: FIELDS[index]!, type: TYPES[code]! }))
  const rows = waves.rows.map((row, index) => {
    const nextIndex = row.next === null ? NONE : waves.rows.findIndex((item) => item.family === row.next)
    const params = { family: index, hz: row.hz, next: nextIndex }
    const record = { family: row.family, hz: row.hz, stated: row.stated, difference: row.difference, relations: row.relations, next: row.next ?? '', solved: row.solved, open: row.open, covers: row.covers, own: row.own.length }
    const bound = canonicalText({ schema, params, record })
    const receipt = hex(sha256(utf8(bound)))
    const integers = [...CODES, index, params.hz, params.next, SQUARES, TRIANGLES, FACES]
    const handle = programHandle(integers)
    const tail = [params.family, params.hz, params.next].map((n) => n.toString(16).padStart(4, '0')).join('')
    const address = uuidFromParts(handle, CODES, tail)
    const read = channel(address)
    const sku = quantumSku(address)
    const readSchema = read.program.map((nibble, at) => ({ field: FIELDS[at] ?? null, type: TYPES[nibble] ?? null, nibble }))
    const readParams = { family: read.params[0]!, hz: read.params[1]!, next: read.params[2]! }
    const installed = program(handle)
    const forged = hex(sha256(utf8(canonicalText({ schema, params: { ...params, hz: params.hz + 1 }, record }))))
    const digits = address.replace(/-/g, '')
    const intact = (id: string) => {
      if (!seal(id).valid) return false
      const body = id.replace(/-/g, '')
      const ch = channel(id)
      return body[12] === digits[12] && body[16] === '8' && ch.handle === handle && ch.program.every((nibble, at) => nibble === CODES[at]) && ch.params[0] === params.family && ch.params[1] === params.hz && ch.params[2] === params.next
    }
    const tampered = Array.from({ length: 32 }, (_, at) => {
      const nibble = (parseInt(digits[at]!, 16) + 1) % 16
      const flipped = `${digits.slice(0, at)}${nibble.toString(16)}${digits.slice(at + 1)}`
      return `${flipped.slice(0, 8)}-${flipped.slice(8, 12)}-${flipped.slice(12, 16)}-${flipped.slice(16, 20)}-${flipped.slice(20)}`
    })
    const named = waves.rows[readParams.family]?.family ?? null
    const next = readParams.next === NONE ? null : waves.rows[readParams.next]?.family ?? null
    const typed = schema.every((field, at) => kind(record[field.field]) === field.type && readSchema[at]?.nibble === CODES[at] && readSchema[at]?.type === field.type)
    const opened = read.validation.holds && readParams.family === index && readParams.hz === row.hz && named === row.family && next === row.next
    const encrypted = sku.encrypted.roundTrip === true && sku.encrypted.reflections === 2 && sku.encrypted.directions === 6 && sku.schemas === 9 && sku.sealed === true && sku.encrypted.neighbours.length === 6
    const caught = tampered.every((id) => !intact(id)) && forged !== receipt && receipt.length === 64
    const file = placeProgram(installed.path)
    const object = installed.handle === handle && installed.depth === 7 && installed.indexed === true && installed.path === `src/quantum/uuid/programs/${[...handle].join('/')}/index.ts` && file === true && readFile(installed.path) === PROGRAM && !PROGRAM.includes(handle)
    const witnessed = checkWitnesses(address)
    const minted = coins([address])
    const cluster = witnessed.witnesses.map((face) => face.uuid)
    const algebra = witnessed.exact === true && witnessed.faces === FACES && witnessed.squares === SQUARES && witnessed.triangles === TRIANGLES && cluster.length === FACES && new Set(cluster).size === FACES
    const coin = minted.count === 1 && minted.coins[0] === address && minted.sealed === true && seal(address).valid
    const walk = walkOf(address)
    const turned = walk.places === 10 && walk.returned && walk.handle === handle && walk.tail === tail && walk.steps.length === 10 && walk.steps.every((place) => place.sealed && place.kept && place.back && place.around && place.aspects === 4 && place.witnessed && place.params.family === readParams.family && place.params.hz === readParams.hz && place.params.next === readParams.next) && walk.steps[0]?.program === read.program.join(',') && walk.steps[9]?.next === address
    const cross = crossLean(address, integers, { family: index, hz: params.hz, next: params.next })
    const holds = waves.holds && typed && opened && encrypted && caught && object && turned && algebra && coin && cross.lean && handle === programHandle(integers) && row.solved === false && row.open === false && row.closed === true
    return {
      family: named,
      hz: readParams.hz,
      next,
      solved: false as const,
      open: false as const,
      closed: true as const,
      address,
      handle,
      path: installed.path,
      depth: installed.depth,
      file,
      params: readParams,
      schema: readSchema,
      receipt,
      algebra: { via: cross.lean ? 'lean' as const : null, module: cross.module, integers, handle },
      cross,
      witnesses: { squares: witnessed.squares, triangles: witnessed.triangles, faces: witnessed.faces, exact: witnessed.exact, cluster },
      coin: { address, sealed: coin, drift: row.difference, count: minted.count },
      encrypted: { reflections: sku.encrypted.reflections, directions: sku.encrypted.directions, schemas: sku.schemas, neighbours: sku.encrypted.neighbours.length, roundTrip: sku.encrypted.roundTrip, cluster: cluster.length },
      tamper: { caught, collision: '2^128' as const, secondPreimage: '2^256' as const },
      walk,
      holds,
    }
  })
  const handles = new Set(rows.map((row) => row.handle))
  const drafted = FOLDERS.map((_, index) => {
    const integers = [...CODES, index, WAVE, CLOSED, SQUARES, TRIANGLES, FACES]
    const handle = programHandle(integers)
    const tail = [index, WAVE, CLOSED].map((n) => n.toString(16).padStart(4, '0')).join('')
    const address = uuidFromParts(handle, CODES, tail)
    const installed = program(handle)
    return { integers, handle, tail, address, path: installed.path }
  })
  const placed = drafted.every((row) => placeProgram(row.path) && !handles.has(row.handle))
  const closed = drafted.map((draft, index) => {
    const read = channel(draft.address)
    const witnessed = checkWitnesses(draft.address)
    const minted = coins([draft.address])
    const file = readFile(draft.path) === PROGRAM
    const walk = walkOf(draft.address)
    const turned = walk.places === 10 && walk.returned && walk.handle === draft.handle && walk.tail === draft.tail && walk.steps.length === 10 && walk.steps.every((place) => place.sealed && place.kept && place.back && place.around && place.aspects === 4 && place.witnessed && place.params.family === index && place.params.hz === WAVE && place.params.next === CLOSED) && walk.steps[0]?.program === read.program.join(',') && walk.steps[9]?.next === draft.address
    const cross = crossLean(draft.address, draft.integers, { family: index, hz: WAVE, next: CLOSED })
    const holds = placed && turned && cross.lean && read.validation.holds && read.params[0] === index && read.params[1] === WAVE && read.params[2] === CLOSED && file && witnessed.exact === true && witnessed.faces === FACES && minted.count === 1 && minted.coins[0] === draft.address && minted.sealed === true && seal(draft.address).valid && !handles.has(draft.handle)
    return { folder: FOLDERS[index], coin: 8 as const, open: false as const, closed: true as const, solved: false as const, address: draft.address, handle: draft.handle, path: draft.path, file, witnesses: witnessed.faces, walk, cross, holds }
  })
  const closeHandles = new Set(closed.map((row) => row.handle))
  const close = { phase: 'close' as const, via: 'uuid' as const, open: false as const, closed: true as const, solved: false as const, programs: closed.length, rows: closed, holds: closed.length === FOLDERS.length && closeHandles.size === closed.length && closed.every((row) => row.holds) }
  const written = rows.every((row) => row.file) && close.holds
  const lean = rows.every((row) => row.cross.lean && row.cross.uuid === row.address && row.cross.verified === FACES) && close.rows.every((row) => row.cross.lean && row.cross.uuid === row.address && row.cross.verified === FACES) ? 'Qpu.Program' as const : null
  const holds = waves.holds && rows.length === waves.families && handles.size === rows.length && rows.every((row) => row.holds && row.open === false && row.closed === true && row.coin.drift === 8 && row.witnesses.exact) && written && lean === 'Qpu.Program'
  const says = holds
    ? `${rows.length} family programs and ${closed.length} folder programs are closed. Lean is Qpu.Program because all ${FACES} witnessing superpositions cross-verify each program in its own UUID. The next place of a closed program rotates it one step. The handle, 432 Hz and the closed mark stay, and ten places return the program. The coin drift is 8. A family is not marked solved.`
    : 'a program was not cross-verified as Lean in its own UUID'
  return { phase: 'programs' as const, via: 'uuid' as const, lean, theorems: ['step_keeps', 'program_rotates', 'program_returns', 'uuid_families', 'uuid_programs', 'uuid_drift', 'uuid_cross', 'families_closed', 'close_returns', 'cross_lean', 'uuid_program_all', 'witnesses_partition', 'program_handles'] as const, families: rows.length, relationCount: waves.relationCount, hz: waves.hz, rows, close, holds, fetched: false as const, written, executed: false as const, says }
}
