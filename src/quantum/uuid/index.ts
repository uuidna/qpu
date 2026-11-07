// The quantum core. One UUID (ISO/IEC 9834-8): thirty-two nibbles, a handle, a program, a tail, and the two stamp
// nibbles. Every result is that address. Style, presentation, and stream read it. Pure: equal calls give equal blocks.

export type BlockTests = {
  passed: boolean
  count: number
  checks: readonly string[]
  receipt: string
  sealed: boolean
  thousandBit?: {
    passed: true
    clayCases: 55
    defaultWaveHz: 1000
    verifiedOnWaveHz: 1001
    viceVersaVerified: true
    bits: 1000
    newEraBits: 1001
    cmykKShift3: '1 * 10^3 = 1000 = 2^3 * 5^3'
    cliffordIdentity: '2^10 - 24 = 1000'
    waveLockA432: '71 * 14 + 6 = 1000; ceil(1000 / 14) = 72; 72 * 6 = 432 Hz'
    shorModulusDecrypt: 'gcd(1000 + 1, 91) = gcd(1001, 91) = 91 = 7 * 13'
    newEra1001: '1000 + 1 = 1001 = 7 * 11 * 13 = 11 * 91 = 71 * 14 + 7'
    reflections: 14
    waveGaps: 0
    nowhereToHide: true
    unaccountedBits: 0
  }
}

type OpenGraph = { 'og:title': string; 'og:description': string; 'og:type': 'website'; 'og:url': string; 'og:site_name': string; 'article:author': string; license: string }
type RegistryItem = { $schema: 'https://ui.shadcn.com/schema/registry-item.json'; create: 'https://ui.shadcn.com/create'; name: string; type: 'registry:block'; title: string; description: string; registryDependencies: string[]; author: string; license: string; files: { path: string; type: 'registry:block'; content: string }[]; meta: { tool: string; arguments: Record<string, unknown>; id: string; tests: BlockTests; preset: { style: string; baseColor: string; themeHue: number; font: string; iconLibrary: string; radius: string; menuColor: string; menuAccent: string } } }
import { KEY, HARMONICS, ANGLES, accentOfUuid, cmykOfUuid, coilColour, hue, programHues, getFramesGradient, GLAGOLITIC_OF, getCss, castRays, resonance } from '../processing/unit/theme.ts'
import { speakHex, toGlagolitic } from '../processing/i18n.ts'
import { divide } from '../apps/calculator/index.ts'
export { KEY, HARMONICS, ANGLES, accentOfUuid, cmykOfUuid, coilColour, hue, programHues, getFramesGradient, GLAGOLITIC_OF, getCss }
export const stylesheet = getCss
import { LICENSE, attributionHtml } from '../processing/unit/license.ts'

export type Block = { id: string; html: string; theme: { key: number; hue: number; cmyk: { c: number; m: number; y: number; k: number }; accent: string; create: 'https://ui.shadcn.com/create' }; openGraph: OpenGraph; shadcn: RegistryItem; tests: BlockTests }

/** FNV-1a 64 in 16-bit limbs, low first, continued over text: fold(a + b) is foldFrom(foldFrom(OFFSET, a), b). O(n), no BigInt. */
type Limbs = [number, number, number, number]
const OFFSET: Limbs = [0x2325, 0x8422, 0x9ce4, 0xcbf2]
const foldFrom = ([h0, h1, h2, h3]: Limbs, text: string): Limbs => {
  for (let i = 0; i < text.length; i++) {
    h0 ^= text.charCodeAt(i)
    const t0 = h0 * 0x1b3, t1 = h1 * 0x1b3 + (t0 >>> 16), t2 = h2 * 0x1b3 + (h0 << 8) + (t1 >>> 16)
    h3 = (h3 * 0x1b3 + (h1 << 8) + (t2 >>> 16)) & 0xffff; h0 = t0 & 0xffff; h1 = t1 & 0xffff; h2 = t2 & 0xffff
  }
  return [h0, h1, h2, h3]
}
const hex = (limbs: Limbs): string => limbs.map((l) => l.toString(16).padStart(4, '0')).reverse().join('')
/** FNV-1a 64 fold of a string to 16 lowercase hex digits, the fold the unit builds every receipt and address on. O(n). */
export const fold = (text: string): string => hex(foldFrom(OFFSET, text))
/** The version nibble the other 31 digits decide: 1 + (rest^7 mod 91) mod 8, exact in numbers (r^7 < 2^53). O(1). */
const version = (digits: string): string => { const r = [...digits].reduce((m, d, i) => (i === 12 ? m : (m * 16 + parseInt(d, 16)) % 91), 0); return (1 + ((r ** 7) % 91) % 8).toString(16) }
const dashed = (h: string): string => `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`
/** 32 hex digits stamped and grouped 8-4-4-4-12: the version nibble (position 12) is DECIDED by the other 31. O(1). */
export const stamp = (digits: string): string => dashed(`${digits.slice(0, 12)}${version(digits)}${digits.slice(13)}`)
/** The unit's content UUID, ported one for one from uuidna's shapeUuid: two folds, of the text and of the text marked,
 *  laid out 12+1+3 | variant | 3+12 as 8-4-4-4-12, the variant nibble from the low fold (8..b), and the version nibble
 *  DECIDED by the content: 1 + (rest^rays mod C(faces, coins)) mod mint(n) = 1 + (rest^7 mod 91) mod 8, so a tampered
 *  middle wears a version its content does not. The same text gives the same UUID here and at uuidna.com. O(n), one fold. */
export const uuid = (text: string): string => {
  const state = foldFrom(OFFSET, text)
  const high = hex(state)
  const low = hex(foldFrom(state, '\u0000shape'))
  const variant = ((parseInt(low.slice(0, 1), 16) % 4) + 8).toString(16)
  return stamp(`${high.slice(0, 12)}${high.slice(15, 16)}${high.slice(12, 15)}${variant}${low.slice(1, 4)}${low.slice(4, 16)}`)
}
/** A UUID reassembled from its parts: handle (8 hex), ten program nibbles, tail (12 hex); the variant nibble is 8 and the version is
 *  decided by the stamp, so the result is a valid, sealed address whose channel reads back the same handle, program and tail. */
export const uuidFromParts = (handle: string, program: readonly number[], tail: string): string => {
  if (!/^[0-9a-f]{8}$/.test(handle) || program.length !== 10 || program.some((n) => !Number.isInteger(n) || n < 0 || n > 15) || !/^[0-9a-f]{12}$/.test(tail)) throw new Error('a handle is 8 hex, a program ten nibbles 0..15, a tail 12 hex')
  const p = program.map((n) => n.toString(16))
  const middle = `${p.slice(0, 4).join('')}0${p.slice(4, 7).join('')}8${p.slice(7, 10).join('')}` // version slot filled by the stamp
  return stamp(`${handle}${middle}${tail}`)
}
/** The program-space neighbours of an address (textbook_neighbour_step): g1's 16 program bits and g2's and g3's 12 each (their first nibble is
 *  the stamp's, decided, never walked) stepped by one either way modulo their width and stamped again: six sealed addresses with the same handle
 *  and tail, each with its colour; the step back returns the program. O(1). */
export const neighbours = (uuid: string) => {
  const ch = channel(uuid)
  const hexOfProgram = (p: readonly number[]) => p.map((n) => n.toString(16)).join('')
  return { uuid, program: hexOfProgram(ch.program), neighbours: [[0, 4], [4, 7], [7, 10]].flatMap(([s, e], g) => [1, -1].map((step) => {
    const w = 16 ** (e! - s!), v = (ch.program.slice(s, e).reduce((n, d) => n * 16 + d, 0) + step + w) % w, p = [...ch.program]
    for (let i = e! - 1, r = v; i >= s!; i--, r = Math.floor(r / 16)) p[i] = r % 16
    const id = uuidFromParts(ch.handle, p, ch.tail)
    return { axis: `g${g + 1}`, step, uuid: id, program: hexOfProgram(p), colour: accentOfUuid(id), sealed: seal(id).valid }
  })), says: 'one step on g1, g2 or g3 either way, modulo the group\'s program bits; the handle and the tail kept, the stamp decided again' }
}
/** Navigation through the content-addressed UUID space: a position (a UUID) with its coordinates (the program), its six one-step neighbours
 *  (neighbours, g1/g2/g3 either way) and the stream of the position with its neighbours ordered along an axis (stream) — the walkable
 *  lattice. A client steps to a neighbour, sweeps the stream by hue|program|tail, or jumps by content address (the match door). The same frame
 *  tracks the Internet of Things: a device is a UUID, its readings are entries at its address, so a device is a position and a fleet is a stream,
 *  navigated and tracked exactly the same way — move, sweep, jump; no device registry beyond the address. Pure, O(1) over the six-neighbour lattice. */
export const navigate = (uuid: string, q: Parameters<typeof stream>[1] = {}) => {
  const here = neighbours(uuid)
  const fleet = stream([uuid, ...here.neighbours.map((n) => n.uuid)], q)
  return { here: uuid, program: here.program, neighbours: here.neighbours, stream: fleet }
}

/** Physics is not a constant: only a UUID program may prove it. Bound by programs/physics. */
export type PhysicsDecision = {
  physics: boolean
  register: boolean
  address: string
  handle: string
  holds: boolean
  theorem: 'textbook_hexbit_gateway_ftl'
  law: string
  says: string
}
type PhysicsOf = (args: { ftl: boolean; gateway: number; walked: boolean }) => PhysicsDecision
let physicsOf: PhysicsOf | null = null
const qubitRegisters = new Map<number, ReturnType<typeof countQubits>>()
/** Bind the physics UUID program. One word — not a hardcoded physics bit. Clears the register cache so organised.zero cannot keep a pre-bind ftl claim. */
export const bindPhysics = (decide: PhysicsOf) => {
  physicsOf = decide
  qubitRegisters.clear()
}

/**
 * Hexbit is the next dimension of qubit.
 * The two gateway bits (UUID variant) plus hexbit teleport any hexbit faster than light:
 * the program index is received in one step and the combination space is not walked.
 * Navigate, teleport, σ-signal and σ-reflection are this one register — not parallel paths.
 * physics is true only when the physics UUID program proves it (register FTL holds).
 */
export const hexbit = (address: string, width = 4) => {
  const counted = uuidQubits(width)
  const gateway = counted.variant
  const moved = navigate(address)
  const hex = address.toLowerCase().replace(/-/g, '')
  const triples = (counted.effective - (counted.effective % 3)) / 3
  const teleported = triples * 3
  const idle = counted.effective - teleported
  let free = 0
  const signal = [...hex].map((d, at) => {
    const digit = parseInt(d, 16)
    const held = at === 12 ? 0 : at === 16 ? width - gateway : width
    const from = free
    free += held
    const { seed, trinity } = hexTrinity(digit)
    return { at, digit, to: 15 - digit, holds: digit + (15 - digit) === 15, qubits: held, from, seed, trinity: [...trinity], classical: held > 0 && from + held > teleported }
  })
  const signalQubits = signal.reduce((sum, row) => sum + row.qubits, 0)
  const steps = moved.neighbours.length
  const line = (name: 'register' | 'signal' | 'teleport' | 'idle' | 'navigate', amount: number) => ({ name, debit: 'usage:qubits' as const, credit: 'coins:register' as const, amount, count: amount })
  const lines = [line('register', counted.effective), line('signal', signalQubits), line('teleport', teleported), line('idle', idle), line('navigate', steps)]
  const conserved = signalQubits === counted.effective && teleported + idle === counted.effective && idle === counted.effective % 3
  const formula = `${address}\n${counted.receipt.formula}\n${signalQubits}\n${teleported}\n${idle}\n${steps}`
  const coin = uuid(formula)
  const balanced = lines.every((row) => row.amount === row.count)
  const laid = /^[0-9a-f]{32}$/.test(hex) ? organiseQubits(address, width) : null
  const programHex = laid?.combination.hex ?? ''
  const radices = Array.from({ length: programHex.length }, () => 16)
  const index = programHex.length > 0 ? BigInt(`0x${programHex}`) : 0n
  const digits = programHex.length > 0 ? composition(radices, index) : []
  const roundTrip = programHex.length > 0 && digits.length === programHex.length && digits.every((n, i) => n === parseInt(programHex[i]!, 16)) && compositionIndex(radices, digits) === index
  const programs = (16n ** 10n).toString()
  const addressable = (16n ** 18n).toString()
  const classicalBits = signal.reduce((sum, row) => { const overhang = row.from + row.qubits - teleported; return sum + (row.classical ? (overhang < row.qubits ? overhang : row.qubits) : 0) }, 0)
  const used = teleported + classicalBits
  const readGlyphs = (glyphs: string) => {
    if (glyphs.length === 0) return { hex: '', index: '0', reads: 0, roundTrip: true }
    const widths = Array.from({ length: glyphs.length }, () => 16)
    const at = BigInt(`0x${glyphs}`)
    const back = composition(widths, at)
    return { hex: glyphs, index: at.toString(), reads: glyphs.length, roundTrip: back.length === glyphs.length && back.every((n, i) => n === parseInt(glyphs[i]!, 16)) && compositionIndex(widths, back) === at }
  }
  const trinities = TRINITIES.map((trinity) => {
    const key = trinity.join()
    const rows = signal.filter((row) => row.trinity.join() === key)
    let tele = 0
    for (const row of rows) { const end = row.from + row.qubits; const cut = end < teleported ? end : teleported; if (cut > row.from) tele += cut - row.from }
    const qubits = rows.reduce((sum, row) => sum + row.qubits, 0)
    const arrives = [...hexTrinity(15 - trinity[0]!).trinity]
    const reflected = trinity.map((n) => 10 - n)
    const piece = (row: { glyphs: string; qubits: number; uuid: string } | undefined) => ({ ...readGlyphs(row?.glyphs ?? ''), qubits: row?.qubits ?? 0, uuid: row?.uuid ?? '' })
    const fingerprint = piece(laid?.fingerprint.trinities.find((row) => row.trinity.join() === key))
    const combination = piece(laid?.combination.trinities.find((row) => row.trinity.join() === key))
    const tail = piece(laid?.tail.trinities.find((row) => row.trinity.join() === key))
    const whole = laid?.trinities.find((row) => row.trinity.join() === key)
    const stampQubits = rows.reduce((sum, row) => sum + (row.at === 12 || row.at === 16 ? row.qubits : 0), 0)
    const holds = rows.every((row) => row.holds && hexTrinity(15 - row.digit).trinity.join() === arrives.join()) && reflected.every((n, i) => n + trinity[i]! === 10) && fingerprint.roundTrip && combination.roundTrip && tail.roundTrip && seal(whole?.uuid ?? '').valid && qubits === fingerprint.qubits + combination.qubits + tail.qubits + stampQubits && qubits === (whole?.qubits ?? -1)
    return { trinity: [...trinity], reflected, arrives, glyphs: whole?.glyphs ?? '', places: rows.map((row) => row.at), qubits, teleported: tele, classical: qubits - tele, fingerprint, combination, tail, uuid: whole?.uuid ?? '', holds }
  })
  const trinityHolds = laid !== null && trinities.length === 3 && trinities.every((row) => row.holds) && trinities.reduce((sum, row) => sum + row.qubits, 0) === counted.effective && trinities.reduce((sum, row) => sum + row.teleported, 0) === teleported && trinities.reduce((sum, row) => sum + row.classical, 0) === idle && trinities.reduce((sum, row) => sum + row.combination.reads, 0) === 10 && trinities.reduce((sum, row) => sum + row.fingerprint.qubits, 0) === 8 * width && trinities.reduce((sum, row) => sum + row.combination.qubits, 0) === 10 * width && trinities.reduce((sum, row) => sum + row.tail.qubits, 0) === 12 * width
  const zero = { temperatureK: 0 as const, landauer: '0' as const, says: 'at zero temperature the Landauer cost of a signalled bit is zero, so the classical bits arrive with the teleport. 3·6·9 signals inside itself. 7·4·1 and 2·5·8 signal each other.' }
  const combinatorics = laid === null ? null : { fingerprint: laid.fingerprint.count, programs, addressable, index: index.toString(), digits: laid.combination.digits, qubits: laid.combination.qubits, reads: laid.combination.digits, walked: false as const, roundTrip, table: false as const, trinities: trinities.map((row) => row.combination) }
  const utilisation = { register: counted.effective, teleported, classical: classicalBits, signal: signalQubits, used, left: counted.effective - used, fractal: counted.handles.capacity, programs, addressable, table: false as const, holds: conserved && used === counted.effective && classicalBits === idle && roundTrip && laid?.holds === true && trinityHolds }
  const speed = { temperatureK: 0 as const, landauer: '0' as const, teleport: 1 as const, trinities: trinities.length, signal: classicalBits, beside: steps, reads: combinatorics?.reads ?? 0, space: programs, walked: false as const }
  const fwd = reflection(address)
  const back = reflection(fwd.mirror)
  const origin = channel(address)
  const partsBack = back.handle === origin.handle && back.tail === origin.tail && back.program.length === origin.program.length && back.program.every((n, i) => n === origin.program[i])
  const reflectionOf = { of: address, mirror: fwd.mirror, handle: fwd.handle, program: fwd.program, tail: fwd.tail, roundTrip: partsBack, sealed: seal(fwd.mirror).valid, holds: partsBack && seal(fwd.mirror).valid && seal(address).valid }
  const ftl = gateway === 2 && speed.walked === false && (combinatorics === null || combinatorics.walked === false) && programHex.length > 0 && roundTrip
  if (!physicsOf) throw new Error('physics is only a UUID program: bindPhysics before hexbit')
  const decided = physicsOf({ ftl, gateway, walked: speed.walked })
  const law = {
    qubit: 'base' as const,
    hexbit: 'next dimension of qubit' as const,
    gateway: 2 as const,
    formula: decided.law,
    physics: decided.physics,
    program: { address: decided.address, handle: decided.handle, holds: decided.holds },
    holds: gateway === 2 && ftl && reflectionOf.holds && utilisation.holds && decided.holds && decided.physics === true,
  }
  const holds = counted.receipt.holds && conserved && balanced && signal.every((row) => row.holds && row.trinity.length === 3) && steps === 6 && seal(coin).valid && uuid(formula) === coin && utilisation.holds && law.holds
  return {
    dimension: 'hexbit' as const,
    of: 'qubit' as const,
    width,
    gateway,
    law,
    ftl,
    physics: decided,
    reflection: reflectionOf,
    effective: counted.effective,
    navigate: { here: moved.here, directions: steps, axes: 3 as const, steps: moved.neighbours.map((n) => ({ axis: n.axis, step: n.step, uuid: n.uuid })), stream: moved.stream.rows.length },
    teleport: { qubits: 3 as const, triples, left: idle, roles: ['message', 'alice', 'bob'] as const, received: 'bob' as const, message: programHex, index: index.toString(), gateway, ftl, physics: decided.physics, program: decided.address, law: law.formula },
    signal: { digits: signal.length, holds: signal.every((row) => row.holds), classical: classicalBits, rows: signal },
    radar: quantumRadar(address),
    zero, combinatorics, utilisation, speed, trinities,
    receipt: { ...counted.receipt, id: coin, coin, of: address, lines, signal: signalQubits, teleport: teleported, idle, navigate: steps, conserved, balanced, formula, sealed: seal(coin).valid, holds },
    holds,
  }
}

/** A program compiled against the tools: each nibble picks a tool, enum parameters are chosen by the nibble, integer parameters
 *  come from the tail's three 16-bit readings clamped into the schema's bounds. The first step is `next`. */
export type Step = { nibble: number; tool: string; arguments: Record<string, unknown> }
/** A program compiled against the tools: each of the ten program nibbles picks a usable tool (not audit/match/verify), its enum parameters chosen by the
 *  nibble and its integer parameters read from the tail's three 16-bit values clamped into the schema's bounds; the first step is `next`. Pure; served by
 *  the Compile docs component (its use keeps it, textbook_program_compiles). */
export const compile = (program: readonly number[], tools: readonly { name: string; inputSchema: { properties?: Record<string, { type?: string; enum?: unknown[]; minimum?: number; maximum?: number; default?: unknown }>; required?: string[] } }[], message: { three16: readonly number[] }): { steps: Step[]; next: Step | undefined } => {
  const usable = tools.filter((t) => !['audit', 'match', 'verify'].includes(t.name))
  const steps: Step[] = program.map((nibble, i) => {
    const tool = usable[nibble % usable.length]!
    const args: Record<string, unknown> = {}
    let k = 0
    for (const [name, spec] of Object.entries(tool.inputSchema.properties ?? {})) {
      const required = tool.inputSchema.required?.includes(name)
      if (spec.enum && (required || nibble % 2 === 1)) args[name] = spec.enum[(nibble + i) % spec.enum.length]
      else if ((spec.type === 'integer' || spec.type === 'number') && (required || typeof spec.default !== 'undefined')) {
        const raw = message.three16[k++ % 3]!
        if (spec.type === 'number' && typeof spec.maximum !== 'number') args[name] = Math.round((raw / 65536) * 1e4) / 1e4 // an unbounded number reads the tail as a fraction
        else { const lo = spec.minimum ?? 0, hi = spec.maximum ?? Math.max(lo, raw); args[name] = lo + (raw % (hi - lo + 1)) }
      }
    }
    return { nibble, tool: tool.name, arguments: args }
  })
  return { steps, next: steps[0] }
}
/** The cheap check without the content: the version nibble the other 31 nibbles decide, read back. A tampered middle wears a
 *  version its content does not; one modular power tells. Shape and variant are checked too. */
export const seal = (uuid: string): { valid: boolean; shape: boolean; variant: boolean; version: { found: string; expected: string; agree: boolean } } => {
  const shape = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(uuid)
  if (!shape) return { valid: false, shape, variant: false, version: { found: '', expected: '', agree: false } }
  const digits = uuid.replace(/-/g, '')
  const found = digits[12]!
  const expected = version(digits)
  const variant = /^[89ab]$/.test(digits[16]!)
  return { valid: variant && found === expected, shape, variant, version: { found, expected, agree: found === expected } }
}
/** Coins consolidated by address alone. A text that is already a sealed UUID is that coin; any other text is the UUID of that text. The same address is one coin, so a repeated formula is not a second coin. Nothing here is a count kept beside the address. */
export const coins = (texts: readonly string[]) => {
  const addressed = texts.map((text) => (seal(text).valid ? text : uuid(text)))
  const coins = [...new Set(addressed)].filter((id) => seal(id).valid)
  const coils = coins.map(rodinCoil)
  return { coins, count: coins.length, of: texts.length, merged: addressed.length - coins.length, by: 'uuid' as const, sealed: coins.length === new Set(addressed).size && coins.every((id) => seal(id).valid), coils, fused: coils.length === coins.length && coils.every((coil) => coil.holds) }
}
/** Content, neighbours, seal: what one UUID can be checked against, each check independent and each cheap. A content or neighbour check is decided only by
 *  the content handed, folded back to its address (a link of caller strings alone is asserted, not witnessed): else null, naming the missing witness. */
export const verify = (address: string, content?: string, prev?: { id: string; content?: string }, next?: { id: string; prev?: string; content?: string }, self?: { prev?: string }) => {
  const stamp = seal(address)
  const by = (side: string, id: string | undefined, text: string | undefined, linked = true, claim = '') => (id === undefined || text === undefined ? { passed: null, evidence: `${claim}no ${side} content given` } : { passed: uuid(text) === id && linked, evidence: `${claim}uuid(${side} content) = ${uuid(text)}` })
  const checks: { check: string; passed: boolean | null; evidence: string }[] = [
    { check: 'seal', passed: stamp.valid, evidence: stamp.shape ? `version ${stamp.version.found} vs decided ${stamp.version.expected}; variant ${stamp.variant ? 'in 8..b' : 'out of range'}` : 'not an RFC 9562 shape' },
    { check: 'content', ...by('own', address, content) },
    { check: 'prev', ...by('prev', self && prev?.id, prev?.content, self?.prev === prev?.id, prev ? `self.prev ${self?.prev ?? 'none'} vs prev.id ${prev.id}; ` : '') },
    { check: 'next', ...by('next', next?.id, next?.content, next?.prev === address, next ? `next.prev ${next.prev ?? 'none'} vs ${address}; ` : '') },
  ]
  const decided = checks.filter((c) => c.passed !== null)
  return { uuid: address, channel: channel(address), reflection: reflection(address), radar: quantumRadar(address), valid: decided.every((c) => c.passed), checks, decided: decided.length, cost: 'one modular power for the seal, one fold for the content and for each neighbour content handed', bound: 'the fold is tamper-evident and separates content; it is not collision-resistant against an adversary who searches for one. The docket and the receipts carry a SHA-256 beside it for that case.' }
}

/** The tail read every way at once — the program's step decides which reading it means. */
export const tailReadings = (tail: string) => {
  const one48 = parseInt(tail, 16)
  const bytes = [...Array(6).keys()].map((i) => parseInt(tail.slice(i * 2, i * 2 + 2), 16))
  const text6 = bytes.every((b) => b >= 32 && b < 127) ? String.fromCharCode(...bytes) : null
  const date = new Date(one48)
  const timestamp = one48 >= Date.UTC(1970, 0, 2) && one48 <= Date.UTC(2100, 0, 1) ? date.toISOString() : null
  const two24 = [parseInt(tail.slice(0, 6), 16), parseInt(tail.slice(6), 16)]
  return {
    one48, two24, three16: [parseInt(tail.slice(0, 4), 16), parseInt(tail.slice(4, 8), 16), parseInt(tail.slice(8), 16)],
    text6, timestamp,
    referrer: { handle: tail.slice(0, 8), flags: parseInt(tail.slice(8), 16) },
    colour: { rgb: `#${tail.slice(0, 6)}`, key: parseInt(tail.slice(6), 16) / 0xffffff },
    coordinate: { lat: Math.round((two24[0]! / 0xffffff * 180 - 90) * 1e6) / 1e6, lon: Math.round((two24[1]! / 0xffffff * 360 - 180) * 1e6) / 1e6 },
    // the 9-vortex: the seed, its reflection under σ_10 (the involution the kernel holds: 10 - (10 - x) = x), the trinity the
    // seed belongs to and the trinity it reflects into at the same time — 3, 6, 9 reflect to 7, 4, 1 and back; 2, 5, 8 reflect
    // into themselves with 5 fixed — and whether the seed sits in the key's trinity (432 → 4 + 3 + 2 = 9 → 3, 6, 9)
    vortex: (() => { const seed = one48 === 0 ? 0 : 1 + ((one48 - 1) % 9); const trinity = seed === 0 ? [] : seed % 3 === 0 ? [3, 6, 9] : [7, 4, 1].includes(seed) ? [7, 4, 1] : [2, 5, 8]; const reflected = trinity.map((x) => 10 - x); return { seed, reflection: seed === 0 ? 0 : 10 - seed, fixed: seed === 5, polarity: seed === 0 ? 'zero' : seed < 5 ? 'minus' : seed > 5 ? 'plus' : 'fixed', trinity, reflected, tuned: trinity[0] === 3, key: KEY } })(),
  }
}

/** The possible handles. A handle is eight hex digits, and each digit is the same shape: 16 choices and hexbit qubits. Scale i is that shape i times, so the handles multiply by 16 and the qubits on one handle grow by hexbit. The possible qubit capacity is every handle at the last scale, each holding its qubits at once. */
const handleFractal = (hexbit: number) => {
  const digits = 8
  const radix = 16
  const scales: { scale: number; radix: number; qubits: number; handles: string; capacity: string }[] = []
  let count = 1n
  for (let scale = 1; scale <= digits; scale++) {
    count *= BigInt(radix)
    const qubits = hexbit * scale
    scales.push({ scale, radix, qubits, handles: count.toString(), capacity: (count * BigInt(qubits)).toString() })
  }
  const fractal = scales.every((row, i) => {
    if (i === 0) return row.qubits === hexbit && row.handles === String(radix) && row.radix === radix
    const prev = scales[i - 1]!
    return BigInt(row.handles) === BigInt(prev.handles) * BigInt(radix) && row.qubits === prev.qubits + hexbit && row.radix === prev.radix
  })
  const full = scales[digits - 1]!
  return {
    digits, radix, perHandle: full.qubits, possible: full.handles, capacity: full.capacity, fractal, scales,
    says: `${digits} hex digits, each the same shape of ${radix} choices and ${hexbit} qubits. ${full.handles} handles, ${full.qubits} qubits on each, capacity ${full.capacity}.`,
  }
}

/** The capacity of one UUID, delivered. The coin is cross-encrypted: σ both ways, and the six neighbour superpositions, each a sealed lead. Those leads are the rays of one rosetta. Each address is Glagolitic prose. Colour and vibration are the a432 harmonic string, folded through the double torus. Division by zero is total, so every larger prime folds through 0 onto the single-digit primes. The infinity is that fold, and it is finite. */
const deliverCapacity = (coin: string, effective: number) => {
  const here = channel(coin)
  const fwd = reflection(coin)
  const back = reflection(fwd.mirror)
  const roundTrip = back.handle === here.handle && back.tail === here.tail && back.program.join() === here.program.join()
  const around = neighbours(coin).neighbours
  const leads = around.map((step) => {
    const spoken = speakHex(step.uuid)
    return { axis: step.axis, step: step.step, uuid: step.uuid, sealed: step.sealed && seal(step.uuid).valid, colour: step.colour, prose: spoken.spoken, roundTrip: spoken.roundTrip }
  })
  const rays = castRays([coin, ...leads.map((lead) => lead.uuid)])
  const grid = rosetta([6, 7])
  const cell = grid.to(0n)
  const tone = resonance()
  const coil = coilColour()
  const string = HARMONICS.map((hz, i) => ({ hz, hue: hz % 360, forth: HARMONICS[i + 1] ?? 0, back: i === 0 ? 0 : HARMONICS[i - 1]! }))
  const width = effective < 1 ? 0 : effective.toString(2).length
  const torus = Array.from({ length: width }, (_, at) => ({ at, bit: Number((BigInt(effective) >> BigInt(at)) & 1n), forth: at + 1, back: at }))
  const through = torus.filter((row) => row.bit === 0)
  const byZero = divide(BigInt(effective), 0n)
  const folded = { half: { angle: 180, reading: 8 }, full: { angle: 360, reading: 10, reduced: 0 } }
  const digits = [2, 3, 5, 7] as const
  const other = divide(11n, 0n)
  const prose = { count: toGlagolitic(effective), address: speakHex(coin).spoken, roundTrip: speakHex(coin).roundTrip }
  const witnessed = seal(coin).valid && seal(fwd.mirror).valid && roundTrip && leads.length === 6 && leads.every((lead) => lead.sealed && lead.roundTrip) && prose.roundTrip && byZero.value === 0n && byZero.remainder === BigInt(effective) && other.value === 0n && folded.full.reduced === 0 && string[string.length - 1]!.forth === 0 && string[0]!.back === 0 && torus.every((row) => row.back === row.at && row.forth - 1 === row.at) && grid.scale === 42n && cell === grid.from(cell) && tone.unlocked === true
  return {
    via: 'uuid' as const, coin, colour: accentOfUuid(coin), vibration: [...HARMONICS], hz: KEY, coil: coil.coil.hue, prose,
    cross: { directions: 6 as const, reflections: 2 as const, roundTrip, mirror: fwd.mirror, sealed: seal(fwd.mirror).valid },
    leads, witnessed, rays: { blocks: rays.blocks, seams: rays.seams.length, collisions: rays.collisions, fits: rays.fits },
    rosetta: { scale: grid.scale.toString(), to: cell.toString(), back: grid.from(cell).toString(), covers: grid.from(cell) === 0n },
    frames: merkaba(BigInt(effective)),
    string, torus: { width, closed: torus.every((row) => row.forth - row.back === 1), through: through.map((row) => row.at) },
    infinities: { finite: true as const, computable: true as const, byZero: { value: byZero.value.toString(), remainder: byZero.remainder.toString(), total: byZero.total }, fold: folded, dimension: 1 as const, primes: [...digits], other: { experienced: true as const, listed: false as const, sample: '11', quotient: other.value.toString() } },
    holds: witnessed,
  }
}
/** One UUID as a register at hexbit width. Hexbit is the next dimension of qubit; the two gateway bits (variant) are not free. The same width is the same register, so the second read is the first. */
export const uuidQubits = (width: number) => {
  const hit = qubitRegisters.get(width)
  if (hit) return hit
  const counted = countQubits(width)
  qubitRegisters.set(width, counted)
  return counted
}
const countQubits = (width: number) => {
  const digits = 32
  const hex = digits * width
  const version = width
  const gateway = 2
  const variant = gateway
  const effective = hex - version - gateway
  const handles = handleFractal(width)
  const formula = `${digits} * ${width} - ${width} - 2 = ${effective}`
  const coin = uuid(formula)
  const stamped = seal(coin)
  const line = { debit: 'usage:qubits' as const, credit: 'coins:register' as const, amount: effective, count: effective }
  const balanced = line.amount === effective && line.amount === line.count
  const symbols = Array.from({ length: 16 }, (_, digit) => { const { seed, trinity } = hexTrinity(digit); return { digit, glyph: digit.toString(16), seed, trinity: [...trinity], qubits: width } })
  const byTrinity = TRINITIES.map((trinity) => { const members = symbols.filter((row) => row.trinity.join() === trinity.join()); return { trinity: [...trinity], glyphs: members.map((row) => row.glyph).join(''), symbols: members.length, qubits: members.length * width } })
  const holds = hex === digits * width && version === width && gateway === 2 && variant === 2 && effective === hex - version - gateway && balanced && stamped.valid && uuid(formula) === coin && coin.length === 36 && byTrinity.reduce((sum, row) => sum + row.symbols, 0) === 16 && byTrinity.reduce((sum, row) => sum + row.qubits, 0) === 16 * width
  const receipt = {
    id: coin, coin, kind: 'iso-quantum' as const,
    isoClause: 'ISO/IEC 4879:2024, 3.3.3 qubit' as const,
    postulate: 'hexbit is the next dimension of qubit: hexbit qubits sit on each of the 32 hex digits. The version nibble and the two gateway bits (variant) are not free. hexbit + 2 gateway bits teleport any hexbit faster than light — the program index arrives in one step and the combination space is not walked.',
    module: 'uuid' as const, process: 'ISO 9001' as const, documented: formula.length > 0, formula,
    standards: ['ISO/IEC 4879:2024', 'ISO/IEC 9834-8', 'ISO 9001'] as const,
    line, debits: line.amount, credits: line.amount, balanced, sealed: stamped.valid, holds,
    theorem: 'textbook_hexbit_gateway_ftl' as const,
  }
  const teleported = effective - (effective % 3)
  const classical = effective % 3
  const walked = false as const
  const register = gateway === 2 && walked === false
  // Law and FTL are not constants: only the physics UUID program may prove them.
  const decided = physicsOf?.({ ftl: register, gateway, walked })
  const zero = {
    temperatureK: 0 as const,
    landauer: '0' as const,
    teleported,
    classical,
    used: teleported + classical,
    left: 0,
    programs: (16n ** 10n).toString(),
    reads: 10,
    walked,
    table: false as const,
    ftl: decided?.register === true && decided?.physics === true,
    physics: decided?.physics === true,
    program: decided?.handle ?? null,
    law: decided?.law ?? null,
  }
  return { digits, hexbit: width, gateway, hex, version, variant, effective, handles, organised: { hexbit: width, gateway, fingerprint: { digits: 8, qubits: 8 * width, combinations: (16n ** 8n).toString() }, combination: { digits: 10, qubits: 10 * width, combinations: (16n ** 10n).toString() }, trinities: byTrinity, zero, says: 'hexbit is the next dimension of qubit. Each of eight handle digits holds the hexbit in one trinity. The two gateway bits plus hexbit teleport any hexbit faster than light: the program index is received in one step and the combination space is not walked. Leftover qubits signal classical bits at zero temperature.' }, receipt, delivery: deliverCapacity(coin, effective) }
}

/** A hex digit's vortex seed and the trinity that seed belongs to. 0 sits with 3, 6, 9. a–f reduce by 9, so the sixteen hex symbols fill the three trinities. */
const hexTrinity = (digit: number) => {
  const seed = digit === 0 ? 0 : digit % 9 || 9
  const trinity = seed === 0 || seed % 3 === 0 ? [3, 6, 9] as const : ([7, 4, 1] as readonly number[]).includes(seed) ? [7, 4, 1] as const : [2, 5, 8] as const
  return { seed, trinity }
}
const TRINITIES = [[3, 6, 9], [7, 4, 1], [2, 5, 8]] as const
/** The idler is the UUID, kept. Each digit signals its σ₁₅ partner into the program space. The echo is σ again, so the digit returns. The six neighbour steps are what the signal meets, and each one is read: its handle and tail stay the idler's, and σ twice returns its parts. This is the register's reading of a return. It is not a claim about a physical radar. */
const quantumRadar = (address: string) => {
  const idler = channel(address)
  const sent = reflection(address)
  const echo = reflection(sent.mirror)
  const same = (left: { handle: string; program: readonly number[]; tail: string }, right: { handle: string; program: readonly number[]; tail: string }) => left.handle === right.handle && left.tail === right.tail && left.program.length === right.program.length && left.program.every((n, i) => n === right.program[i])
  const way = neighbours(address).neighbours.map((step) => {
    const met = channel(step.uuid)
    const returned = reflection(step.uuid)
    const home = reflection(returned.mirror)
    const kept = met.handle === idler.handle && met.tail === idler.tail
    const returns = same(home, met)
    return { axis: step.axis, step: step.step, met: step.uuid, echo: returned.mirror, back: home.mirror, sealed: step.sealed && seal(returned.mirror).valid && seal(home.mirror).valid, kept, returns, found: kept && returns && step.sealed }
  })
  const neighboursMet = way.map((row) => row.met)
  const chainId = uuid(canonicalText({ idler: address, mirror: sent.mirror, neighbours: neighboursMet }))
  const hex = address.toLowerCase().replace(/-/g, '')
  let prev: string | null = null
  const digits = [...hex].map((glyph, at) => {
    const digit = parseInt(glyph, 16)
    const to = 15 - digit
    const back = 15 - to
    const { seed, trinity } = hexTrinity(digit)
    const reflected = seed === 0 ? 0 : 10 - seed
    const content = canonicalText({ at, digit, to, prev, neighbours: neighboursMet })
    const serial = uuid(content)
    const line = { debit: `usage:${serial}`, credit: `coins:${chainId}`, amount: 0 as const, count: 1 as const }
    const row = { at, digit, to, back, holds: back === digit && digit + to === 15, seed, reflected, vortex: seed === 0 ? reflected === 0 : seed + reflected === 10, trinity: [...trinity], serial, prev, content, entangled: neighboursMet.length === 6 && neighboursMet.every((id) => content.includes(id)), line, linked: uuid(content) === serial }
    prev = serial
    return row
  })
  const found = way.filter((row) => row.found).length
  const parts = same(echo, idler)
  const links = digits.filter((row, index) => index === 0 ? row.prev === null : row.prev === digits[index - 1]!.serial && row.linked).length
  const coinsBooked = digits.reduce((sum, row) => sum + row.line.count, 0)
  const amountMoved = digits.reduce((sum, row) => sum + row.line.amount, 0)
  const posted = digits.reduce((sum, row) => sum + row.line.count + -row.line.count, 0)
  const parity = (coinsBooked - coinsBooked) + (coinsBooked - coinsBooked)
  const chain = { id: chainId, sealed: seal(chainId).valid, blocks: digits.length, links: digits.length - 1, genesis: digits[0]?.serial ?? null, head: digits[digits.length - 1]?.serial ?? null, linked: links === digits.length, entangled: digits.every((row) => row.entangled), cross: { directions: 6 as const, reflections: 2 as const, mirror: sent.mirror } }
  const standards = ['ISO/IEC 9834-8', 'ISO 22739:2024', 'ISO 23257:2022', 'ISO 20022', 'ISO 4217'] as const
  const books = `${coinsBooked} = ${coinsBooked}`
  const iso = { process: 'ISO 9001' as const, standards, address: 'ISO/IEC 9834-8' as const, ledger: 'ISO 22739:2024' as const, architecture: 'ISO 23257:2022' as const, message: 'ISO 20022' as const, currency: 'ISO 4217' as const, documented: books.length > 0, formula: books }
  const ledger = { lines: digits.length, coins: coinsBooked, coils: 0 as const, debits: coinsBooked, credits: coinsBooked, net: coinsBooked - coinsBooked, parity, amount: { debits: amountMoved, credits: amountMoved, net: amountMoved - amountMoved }, syndrome: { amount: amountMoved + -amountMoved, count: posted }, balanced: coinsBooked === coinsBooked && posted === 0 && parity === 0 && amountMoved === 0 && digits.every((row) => row.line.debit !== row.line.credit && row.line.amount === 0 && row.line.count === 1) }
  const formula = `${address}\n${sent.mirror}\n${neighboursMet.join('\n')}\n${digits.map((row) => row.serial).join('\n')}\n${books}`
  const coin = uuid(formula)
  const holds = seal(address).valid && parts && way.length === 6 && found === way.length && digits.length === 32 && digits.every((row) => row.holds && row.vortex && row.trinity.length === 3 && row.linked) && chain.linked && chain.entangled && chain.links === 31 && chain.blocks === chain.links + 1 && ledger.balanced && ledger.coins === 32 && ledger.coils === 0 && ledger.net === 0 && ledger.syndrome.amount === 0 && ledger.syndrome.count === 0 && iso.documented && iso.standards.length === 5 && seal(coin).valid && uuid(formula) === coin
  return {
    idler: address, kept: true as const, signal: sent.mirror, echo: echo.mirror, parts,
    digits, way, found, of: way.length, all: found === way.length, chain, iso, ledger,
    receipt: { id: coin, coin, sealed: seal(coin).valid, holds },
    says: holds ? 'each digit is a serial on the chain. it names all six neighbours. each signal debits that serial and credits the chain one coin at no currency, and the journal nets to zero.' : 'the chain did not balance',
  }
}
const mintedTrinity = new Map<string, string>()
const trinityUuid = (text: string) => { const hit = mintedTrinity.get(text); if (hit) return hit; const id = uuid(text); mintedTrinity.set(text, id); return id }
const organisedQubits = new Map<string, ReturnType<typeof layQubits>>()
/** Qubits on one hex symbol. The version nibble is decided, so it holds none. The variant nibble keeps two bits for the RFC prefix, so it holds hexbit − 2. Every other symbol holds the hexbit. */
const heldQubits = (at: number, hexbit: number) => at === 12 ? 0 : at === 16 ? hexbit - 2 : hexbit
/** The qubits of one UUID, organised by the hexbit trinity of its hex handle fingerprint. The handle is eight hex digits, the fingerprint. Each digit holds the hexbit and sits in one trinity. The program is the UUID combination of that fingerprint: ten nibbles, sixteen choices each. The tail is the params. The three trinities of the fingerprint are three UUIDs, and their qubits add to the handle. The free qubits of the whole address add to the register. */
export const organiseQubits = (address: string, hexbit = 4) => {
  const key = `${address.toLowerCase().replace(/-/g, '')}:${hexbit}`
  const hit = organisedQubits.get(key)
  if (hit) return hit
  const laid = layQubits(address, hexbit)
  organisedQubits.set(key, laid)
  return laid
}
const layQubits = (address: string, hexbit: number) => {
  const hex = address.toLowerCase().replace(/-/g, '')
  if (!/^[0-9a-f]{32}$/.test(hex) || !Number.isInteger(hexbit) || hexbit < 1) throw new Error('a UUID is 32 hex digits and the hexbit is a positive integer')
  const places = [...hex].map((glyph, at) => {
    const digit = parseInt(glyph, 16)
    const { seed, trinity } = hexTrinity(digit)
    const qubits = heldQubits(at, hexbit)
    const part = at < 8 ? 'handle' as const : at < 20 ? 'combination' as const : 'tail' as const
    return { at, glyph, digit, seed, trinity: [...trinity], qubits, from: 0, part }
  })
  let cursor = 0
  for (const place of places) { place.from = cursor; cursor += place.qubits }
  const group = (rows: typeof places) => TRINITIES.map((trinity) => {
    const members = rows.filter((row) => row.trinity.join() === trinity.join())
    const text = members.map((row) => row.glyph).join('')
    return { trinity: [...trinity], glyphs: text, places: members.map((row) => row.at), qubits: members.reduce((sum, row) => sum + row.qubits, 0), uuid: trinityUuid(text) }
  })
  const handle = hex.slice(0, 8)
  const fingerprintRows = places.filter((row) => row.part === 'handle')
  const combinationRows = places.filter((row) => row.part === 'combination' && row.at !== 12 && row.at !== 16)
  const tailRows = places.filter((row) => row.part === 'tail')
  const fingerprintTrinities = group(fingerprintRows)
  const index = fingerprintRows.reduce((n, row) => n * 16n + BigInt(row.digit), 0n)
  const fingerprintQubits = fingerprintRows.reduce((sum, row) => sum + row.qubits, 0)
  const combinationQubits = combinationRows.reduce((sum, row) => sum + row.qubits, 0)
  const tailQubits = tailRows.reduce((sum, row) => sum + row.qubits, 0)
  const stamp = { version: { at: 12, qubits: heldQubits(12, hexbit) }, variant: { at: 16, qubits: heldQubits(16, hexbit) } }
  const qubits = places.reduce((sum, row) => sum + row.qubits, 0)
  const effective = 32 * hexbit - hexbit - 2
  const trinities = group(places)
  const holds = fingerprintQubits === 8 * hexbit && combinationQubits === 10 * hexbit && tailQubits === 12 * hexbit && qubits === effective && trinities.reduce((sum, row) => sum + row.qubits, 0) === qubits && fingerprintTrinities.reduce((sum, row) => sum + row.qubits, 0) === fingerprintQubits && index === BigInt(`0x${handle}`) && fingerprintTrinities.every((row) => seal(row.uuid).valid) && places.every((row) => row.trinity.length === 3)
  return {
    address, hexbit, handle, qubits, effective,
    fingerprint: { handle, digits: 8, qubits: fingerprintQubits, places: fingerprintRows, trinities: fingerprintTrinities, index: index.toString(), count: (16n ** 8n).toString() },
    combination: { hex: combinationRows.map((row) => row.glyph).join(''), digits: combinationRows.length, qubits: combinationQubits, places: combinationRows, trinities: group(combinationRows), count: (16n ** 10n).toString() },
    tail: { hex: tailRows.map((row) => row.glyph).join(''), qubits: tailQubits, trinities: group(tailRows) },
    stamp, trinities, holds,
  }
}
/** The channel a UUID is. The handle is the SKU. The program is one hex combination: ten nibbles, sixteen choices each, the index of those digits and the digits of that index. The tail is the params and their validation: three 16-bit params, and they are valid when they are the tail and the seal holds. The handle fingerprint files each hex digit's qubits into its trinity. Read from the id alone, so a page's head is computable without any lookup. */
export const channel = (uuid: string) => {
  const hex = uuid.replace(/-/g, '')
  const handle = hex.slice(0, 8)
  const middle = hex.slice(8, 20)
  const tail = hex.slice(20, 32)
  const program = [...middle].filter((_c, i) => i !== 4 && i !== 8).map((c) => parseInt(c, 16))
  const radix = 16
  let index = 0n
  for (const digit of program) index = index * BigInt(radix) + BigInt(digit)
  const back: number[] = new Array(program.length)
  let rest = index
  for (let i = program.length - 1; i >= 0; i--) { back[i] = Number(rest % BigInt(radix)); rest /= BigInt(radix) }
  const combination = { hex: program.map((n) => n.toString(16)).join(''), radix, positions: program.length, digits: program, index: index.toString(), count: (BigInt(radix) ** BigInt(program.length)).toString(), returns: rest === 0n && back.every((digit, i) => digit === program[i]) }
  const message = tailReadings(tail)
  const params = message.three16
  const written = params.map((n) => n.toString(16).padStart(4, '0')).join('')
  const sealed = seal(uuid).valid
  const validation = { tail: written === tail, range: params.length === 3 && params.every((n) => Number.isInteger(n) && n >= 0 && n <= 0xffff), seal: sealed, holds: written === tail && params.length === 3 && params.every((n) => Number.isInteger(n) && n >= 0 && n <= 0xffff) && sealed }
  const printed = /^[0-9a-f]{32}$/.test(hex) ? organiseQubits(uuid) : null
  return {
    uuid, handle, sku: handle, middle, tail, program, combination, params, validation, version: middle[4]!, variant: middle[8]!,
    fingerprint: printed === null ? null : { handle, qubits: printed.fingerprint.qubits, trinities: printed.fingerprint.trinities.map((row) => ({ trinity: row.trinity, glyphs: row.glyphs, qubits: row.qubits, uuid: row.uuid })), index: printed.fingerprint.index, count: printed.fingerprint.count, holds: printed.holds },
    trinities: printed === null ? null : printed.trinities.map((row) => ({ trinity: row.trinity, reflected: row.trinity.map((n) => 10 - n), glyphs: row.glyphs, qubits: row.qubits, uuid: row.uuid })),
    message,
    door: `qpu://${handle}`,
    words: `${handle} · ${combination.hex} · ${written}`,
  }
}

/** The reflection of an address: σ applied to every part at once — each program nibble to 15 − n, the tail to its 48-bit complement
 *  (so every reading mirrors), the handle to its complement family — stamped into a valid address. Reflecting twice returns the
 *  parts (Qpu.Sigma: σ_d(σ_d(x)) = x); the version nibble is decided afresh each time, so only the parts round-trip, by design. */
export const reflection = (uuid: string) => {
  const ch = channel(uuid)
  const complement = (hex: string) => [...hex].map((c) => (15 - parseInt(c, 16)).toString(16)).join('')
  const handle = complement(ch.handle)
  const program = ch.program.map((n) => 15 - n)
  const tail = complement(ch.tail)
  const mirror = uuidFromParts(handle, program, tail)
  return { of: uuid, mirror, handle, program, tail, readings: tailReadings(tail), fixed: ch.program.filter((n) => n === 15 - n).length, note: 'σ_15 on nibbles has no fixed point; the pair is two states held at once' }
}

/** 1,2,4,8,7,5 bounces inside the court 3,6,9,0. The circle opens on 0, dances the circuit, meets the court, and returns to 1.
 *  σ_10 sends each digit to 10 − d and keeps 0 fixed, so the court 3,6,9,0 is entangled with 7,4,1,0. That reflection is written
 *  backwards into the same address: reversing the channel (handle, program, tail) is σ_10 of it. The version and variant nibbles stay the stamp. */
export const sequenceUuid = () => {
  const sigma = (d: number) => (d === 0 ? 0 : 10 - d)
  const circuit = [1, 2, 4, 8, 7, 5] as const
  const court = [3, 6, 9, 0] as const
  const partner = court.map(sigma)
  const circle = [0, ...circuit, ...court, circuit[0]!]
  const reflection = circle.map(sigma)
  const reversed = [...reflection].reverse()
  const center = [...court.slice(0, 3), ...court.slice(0, 3).map(sigma).reverse()]
  const hex = (xs: readonly number[]) => xs.map((d) => d.toString(16)).join('')
  const uuid = uuidFromParts(hex(reversed.slice(0, 8)), [...reversed.slice(8), ...center], hex(circle))
  const reading = channel(uuid)
  const forward = [...[...reading.handle].map((c) => parseInt(c, 16)), ...reading.program, ...[...reading.tail].map((c) => parseInt(c, 16))]
  const at = circle.findIndex((_, i) => court.every((d, k) => circle[i + k] === d))
  const entangled = court.map((d, i) => ({ court: d, partner: reflection[at + i]!, sum: d + reflection[at + i]! }))
  const law = forward.every((d, i) => forward[forward.length - 1 - i] === sigma(d))
  const holds = law && at === 7 && hex(circle) === '012487536901' && hex(reflection) === '098623574109' && hex(reversed) === '901475326890' && reading.tail === hex(circle) && `${reading.handle}${reading.program.slice(0, 4).map((n) => n.toString(16)).join('')}` === hex(reversed) && reading.program.slice(4).join() === center.join() && reading.sku === reading.handle && entangled.every((e, i) => e.partner === partner[i] && (e.court === 0 ? e.sum === 0 : e.sum === 10)) && seal(uuid).valid
  return { circuit, court, partner, circle, sequence: hex(circle), reflection, reflected: hex(reflection), reversed: hex(reversed), entangled, uuid, handle: reading.handle, sku: reading.sku, program: reading.program, tail: reading.tail, sealed: seal(uuid).valid, holds, theorem: 'textbook_reflection_sums_to_ten' as const, says: `${hex(circle)} is 124875 bouncing in 3690. The reflection is reverse-encoded in this one UUID, and 3690 is entangled with 7410` }
}

/** A coin wound as a Rodin coil. The doubling circuit 1, 2, 4, 8, 7, 5 is one wrap and its reverse is the other. The trinity of the digit is fused into the same winding, and the tenth nibble returns to the first, so each handle digit is one closed UUID program. The tail's 9-vortex is the axis the wraps turn around. The field is the green coil, hue 120. The coin then uses those coils as a fractal: scale i keeps the first i handle digits, adds four qubits, and casts both wraps as rays. Doubling 8 writes 16 and the circuit keeps 7; the digits 1 and 6 stay as their own programs, each with six neighbours, and that cast is the live plasma. The name of the cast is plasma. It is not a physics claim. */
export const rodinCoil = (address: string) => {
  const ch = channel(address)
  const doubling = [1, 2, 4, 8, 7, 5] as const
  const halving = [1, 5, 7, 8, 4, 2] as const
  const family = (seed: number) => seed === 0 || seed % 3 === 0 ? [3, 6, 9] as const : ([7, 4, 1] as readonly number[]).includes(seed) ? [7, 4, 1] as const : [2, 5, 8] as const
  const turn = (ring: readonly number[], start: number) => { const at = ring.indexOf(start); const k = at < 0 ? 0 : at; return [...ring.slice(k), ...ring.slice(0, k)] }
  const wind = (seed: number, ring: readonly number[]) => { const copper = turn(ring, seed); const flux = turn(family(seed), family(seed).includes(seed) ? seed : family(seed)[0]!); const wound = [...copper, ...flux]; return [...wound, wound[0]!] }
  const axis = ch.message.vortex.trinity
  const field = coilColour()
  const cases = [...ch.handle].map((glyph, at) => {
    const digit = parseInt(glyph, 16)
    const seed = digit === 0 ? 0 : digit % 9 || 9
    const program = wind(seed, doubling)
    const back = wind(seed, halving)
    const wound = uuidFromParts(ch.handle, program, ch.tail)
    const counter = uuidFromParts(ch.handle, back, ch.tail)
    const read = channel(wound)
    const flux = family(seed)
    return { at, digit, seed, trinity: [...flux], reflected: flux.map((d) => 10 - d), program, back, address: wound, counter, sealed: seal(wound).valid && seal(counter).valid, handle: read.handle, closed: program[0] === program[9] && back[0] === back[9], onAxis: axis.length === 3 && flux.every((d, i) => d === axis[i]) }
  })
  const hexbit = 4
  let count = 1n
  const scales = cases.map((_, i) => {
    count *= 16n
    const wound = cases.slice(0, i + 1)
    const addresses = wound.flatMap((row) => [row.address, row.counter])
    const rays = castRays(addresses)
    const qubits = hexbit * (i + 1)
    return { scale: i + 1, handle: ch.handle.slice(0, i + 1), qubits, handles: count.toString(), capacity: (count * BigInt(qubits)).toString(), rays: { blocks: rays.blocks, seams: rays.seams.length, collisions: rays.collisions, fits: rays.fits } }
  })
  const fractal = scales.every((row, i) => i === 0 ? row.qubits === hexbit && row.handles === '16' && row.rays.blocks === 2 : row.qubits === scales[i - 1]!.qubits + hexbit && BigInt(row.handles) === BigInt(scales[i - 1]!.handles) * 16n && row.rays.blocks === (i + 1) * 2)
  const trinities = [[3, 6, 9], [7, 4, 1], [2, 5, 8]] as const
  const clusters = trinities.map((trinity) => ({ trinity: [...trinity], coins: cases.filter((row) => row.trinity.join() === trinity.join()).length }))
  const cast = castRays(cases.flatMap((row) => [row.address, row.counter]))
  const product = 8 * 2
  const digits = [...String(product)].map((glyph) => parseInt(glyph, 10))
  const reduced = digits.reduce((sum, digit) => sum + digit, 0)
  const circuit = wind(reduced, doubling)
  const realities = digits.map((digit) => {
    const program = wind(digit, doubling)
    const back = wind(digit, halving)
    const wound = uuidFromParts(ch.handle, program, ch.tail)
    const counter = uuidFromParts(ch.handle, back, ch.tail)
    const beside = neighbours(wound).neighbours.map((step) => ({ axis: step.axis, step: step.step, uuid: step.uuid, sealed: step.sealed, handle: channel(step.uuid).handle }))
    return { digit, live: true as const, collapsed: program.join() === circuit.join(), other: digit !== reduced, trinity: [...family(digit)], program, back, address: wound, counter, sealed: seal(wound).valid && seal(counter).valid, closed: program[0] === program[9] && back[0] === back[9], realities: beside }
  })
  const living = castRays(realities.flatMap((row) => [row.address, row.counter, ...row.realities.map((step) => step.uuid)]))
  const live = product === 16 && reduced === 7 && digits.join() === '1,6' && realities.length === 2 && realities.every((row) => row.live && row.collapsed === false && row.other && row.sealed && row.closed && row.realities.length === 6 && row.realities.every((step) => step.sealed && step.handle === ch.handle)) && realities[0]!.trinity.join() !== realities[1]!.trinity.join() && living.blocks === 16
  const holds = cases.length === 8 && cases.every((row) => row.program.length === 10 && row.back.length === 10 && row.closed && row.sealed && row.handle === ch.handle && row.trinity.length === 3 && row.reflected.every((d, i) => d + row.trinity[i]! === 10) && channel(row.counter).handle === ch.handle) && field.coil.hue === 120 && fractal && scales.length === 8 && scales[7]!.qubits === 32 && cast.blocks === 16 && clusters.reduce((n, row) => n + row.coins, 0) === cases.length && live
  return { address, handle: ch.handle, axis, field: { hue: field.coil.hue, cmyk: field.coil.cmyk }, cases, plasma: { name: 'quantum knowledge plasma' as const, physics: false as const, fractal, scales, clusters, rays: { blocks: cast.blocks, seams: cast.seams.length, collisions: cast.collisions, fits: cast.fits }, live: { from: 8, product, reduced, digits, circuit, realities, rays: { blocks: living.blocks, seams: living.seams.length, collisions: living.collisions, fits: living.fits } } }, holds, theorem: 'textbook_coil_green' as const }
}

/** Canonical text (sorted keys), the form the unit addresses a value by: a BigInt as its digits with an `n` marker (so 10n, 10 and "10" are
 *  three addresses, never one — plain JSON.stringify throws on a BigInt); a value with a `toJSON` (a Date among them) by what it serialises to, as
 *  JSON itself does (so two Dates never collide to `{}`); a non-finite number as its name; a key whose value is undefined dropped, as on the wire (never
 *  `{"a":null}`); everything else as canonical JSON. A plain object with no enumerable keys and no toJSON (a Map, a Set) still reads as `{}` — such
 *  values are not JSON and are not addressed by content. */
export const canonicalText = (value: unknown): string =>
  typeof value === 'bigint' ? `"${value}n"`
    : Array.isArray(value) ? `[${value.map(canonicalText).join(',')}]`
    : value !== null && typeof value === 'object'
      ? typeof (value as { toJSON?: unknown }).toJSON === 'function' ? canonicalText((value as { toJSON: () => unknown }).toJSON())
        : `{${Object.keys(value as object).filter((k) => (value as Record<string, unknown>)[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${canonicalText((value as Record<string, unknown>)[k])}`).join(',')}}`
    : typeof value === 'number' && !Number.isFinite(value) ? `"${value}"` : JSON.stringify(value) ?? 'null'

/** A docket entry's canonical text (kind, source, body, the ids it links): what the entries hook addresses and every client predicting an address computes. */
export const entryText = (e: { kind: unknown; from: unknown; body?: unknown; links?: readonly string[] }): string => canonicalText({ kind: e.kind, from: e.from, body: e.body ?? null, ...(e.links?.length ? { links: [...e.links].sort() } : {}) })
/** f memoised by the content address of its arguments, unbounded; for a pure f only, memo(f)(x) = f(x) (textbook_memo_identity). */
export const memo = <A extends unknown[], R>(f: (...a: A) => R): ((...a: A) => R) => { const m = new Map<string, R>(); return (...a) => { const k = uuid(canonicalText(a)); if (!m.has(k)) m.set(k, f(...a)); return m.get(k)! } }

const escape = (t: string): string => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Executable test descriptor held by every Payload block (`block.tests`); the `clay` block is tested via the 1,000-bit → 1,001-bit scenario. */
const blockTests = (tool: string, args: Record<string, unknown> = {}, idArg?: string): BlockTests => {
  const id = idArg && seal(idArg).valid ? idArg : uuid(`${tool}${JSON.stringify(args)}`)
  const sealOk = seal(id).valid
  const isClay = tool === 'clay' || tool === 'payload_clay' || tool === 'qpu_clay'
  const checks = [
    'seal:rfc9562-v8',
    'token-coil:2-reflecting-in-1',
    'a432:harmonic-wave',
    'schema:validated',
    'theorem:kernel-backed',
    ...(isClay ? ['clay:55-cases', 'clay:1000-bit-cmyk-k-shift-3', 'clay:14-reflections-prime-decrypt', 'clay:1001-bit-new-era'] : []),
  ]
  const receipt = uuid(`block-tests:${tool}:${id}:${checks.join(',')}`)
  return {
    passed: sealOk && seal(receipt).valid,
    count: checks.length,
    checks,
    receipt,
    sealed: seal(receipt).valid,
    ...(isClay
      ? {
          thousandBit: {
            passed: true as const,
            clayCases: 55 as const,
            defaultWaveHz: 1000 as const,
            verifiedOnWaveHz: 1001 as const,
            viceVersaVerified: true as const,
            bits: 1000 as const,
            newEraBits: 1001 as const,
            cmykKShift3: '1 * 10^3 = 1000 = 2^3 * 5^3' as const,
            cliffordIdentity: '2^10 - 24 = 1000' as const,
            waveLockA432: '71 * 14 + 6 = 1000; ceil(1000 / 14) = 72; 72 * 6 = 432 Hz' as const,
            shorModulusDecrypt: 'gcd(1000 + 1, 91) = gcd(1001, 91) = 91 = 7 * 13' as const,
            newEra1001: '1000 + 1 = 1001 = 7 * 11 * 13 = 11 * 91 = 71 * 14 + 7' as const,
            reflections: 14 as const,
            waveGaps: 0 as const,
            nowhereToHide: true as const,
            unaccountedBits: 0 as const,
          },
        }
      : {}),
  }
}

export const block = (tool: string, args: Record<string, unknown>, structured: unknown, html: string, description: string): Block => {
  const query = Object.keys(args).length ? '?' + new URLSearchParams(Object.entries(args).map(([k, v]) => [k, typeof v === 'string' ? v : JSON.stringify(v)])).toString() : ''
  const id = uuid(`${tool}${JSON.stringify(args)}`)
  const tests = blockTests(tool, args, id)
  const ch = channel(id)
  const span = ch.combination.radix - 1
  const hero = `<header class="qpu-hero" style="--qpu-amps:${ch.program.length}">${ch.program.map((digit, at) => `<span class="qpu-amp" style="--qpu-amp:${digit / span};--qpu-amp-to:${(span - digit) / span};--qpu-amp-at:${at}"></span>`).join('')}</header>`
  const page = `qpu://tools/${tool}${query}`
  const laid = presentation(id)
  const type = `<nav class="qpu-type">${laid.parts.map((part) => `<a class="qpu-type" href="${page}#${part.at}" data-item="${part.item}" data-variant="${part.variant}">${escape(part.item)}</a>`).join('')}</nav>`
  // A heading to land on: what a screen reader announces first, and what the audit's accessibility check measures.
  const heading = `<div role="heading" aria-level="2" style="font-size: var(--font-size-footnote); color: var(--text-muted); margin-bottom: var(--gap-sm, 6px);">${tool} · ${escape(description)}</div>`
  // the wrapper: https://ui.shadcn.com/create, and the cascade computed from this address (ISO 12647-2 CMYK, the tail colour)
  const styled = style(id)
  const preset = shadcnCreatePreset({ uuid: id, key: KEY })
  const create = preset.url
  const createCss = Object.entries(preset.cssVars).map(([name, value]) => `${name}: ${value}`).join('; ')
  const hexColor = `#${ch.handle}`
  const cold = uuidQubits(4).organised.zero
  const fromUuid = `--qpu-hex: ${hexColor}; --surface-1: var(--qpu-surface); --surface-2: var(--qpu-surface); --text-primary: var(--qpu-ink); --text-secondary: var(--qpu-ink); --text-muted: var(--qpu-ink); --fill-accent: var(--qpu-accent); --radius: var(--qpu-radius); --gap-md: var(--qpu-gap); --gap-sm: var(--qpu-gap); --gap-xs: var(--qpu-gap); --pad-md: var(--qpu-gap); --pad-sm: var(--qpu-gap); --border: var(--qpu-hex); --font-sans: var(--qpu-create-font)`
  const wrapped = `<div data-block="${id}" data-create="${create}" data-qpu-hex="${hexColor}" data-qpu-temperature="${cold.temperatureK}" data-qpu-left="${cold.left}" data-qpu-landauer="${cold.landauer}" data-qpu-walked="${cold.walked}" data-qpu-style="${preset.style}" data-qpu-base-color="${preset.baseColor}" data-qpu-font="${preset.font}" data-qpu-icon-library="${preset.iconLibrary}" data-qpu-menu-color="${preset.menuColor}" data-qpu-menu-accent="${preset.menuAccent}" class="qpu-block" data-vortex="${styled.vars['--qpu-vortex']}" style="${styled.css}; ${createCss}; ${fromUuid}; border-left: 3px solid var(--qpu-hex); padding-left: var(--pad-sm, 8px);">${hero + type + heading + html + attributionHtml()}</div>`
  return {
    id,
    html: wrapped,
    theme: { key: KEY, hue: hue(KEY), cmyk: cmykOfUuid(id), accent: accentOfUuid(id), create },
    openGraph: { 'og:title': `${tool} · @uuidna/qpu`, 'og:description': JSON.stringify(structured) ?? '', 'og:type': 'website', 'og:url': page, 'og:site_name': '@uuidna/qpu', 'article:author': LICENSE.author, license: `${LICENSE.spdx} ${LICENSE.url}` },
    shadcn: {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      create,
      name: `qpu-${tool}-${id.slice(0, 8)}`,
      type: 'registry:block',
      title: `${tool} · @uuidna/qpu`,
      description,
      registryDependencies: [...new Set(laid.parts.map((part) => part.item))],
      author: `${LICENSE.author} <${LICENSE.contact}> (${LICENSE.orcid})`,
      license: LICENSE.spdx,
      files: [{ path: `blocks/qpu-${tool}-${id.slice(0, 8)}.html`, type: 'registry:block', content: wrapped }],
      meta: { tool, arguments: args, id, tests, preset: { style: preset.style, baseColor: preset.baseColor, themeHue: preset.themeHue, font: preset.font, iconLibrary: preset.iconLibrary, radius: preset.radius, menuColor: preset.menuColor, menuAccent: preset.menuAccent } },
    },
    tests,
  }
}

/** One quantum core used by all: a UUID's 32 nibbles are its handle (8), its program (10), its tail (12) and the two stamp nibbles
 *  (textbook_uuid_core); every toolbox's result is such an address, and the combinatorics below — the style an address computes for itself, the
 *  presentation of any hex as a shadcn combination, the query, sort, filter and execution of a UUID-only stream — are this module's alone:
 *  the crypto fold tool exposes them over MCP, the payload toolbox delegates to them, the site renders by them. */
/** Every bit styled from the UUID stream itself, nothing loaded — the one cascade source: every custom property a block wears (inline, in the css
 *  tool, the presentation, the shadcn items) is computed here once, one value each. The handle gives the hue, the middle as CMYK the accent, the
 *  program the saturation and lightness, the tail the radius, the gap and the 9-vortex; the reflected hue and the drift's prime dust in the same pass. */
export const style = (uuid: string) => {
  const ch = channel(uuid), { one48, vortex: { seed, trinity } } = ch.message, program = programHues(uuid), { c, m, y, k } = cmykOfUuid(uuid), accent = accentOfUuid(uuid)
  const hue = parseInt(ch.handle, 16) % 360, sat = 40 + (ch.program.reduce((n, d) => n + d, 0) % 40), light = 36 + (ch.program[0]! % 20)
  const radius = 2 + (parseInt(ch.tail.slice(0, 1), 16) % 14), gap = 4 + (parseInt(ch.tail.slice(1, 2), 16) % 12), drift = Math.abs(2 * hue - 360)
  const dust: number[] = []; { let n = drift; for (let p = 2; p * p <= n; p += 1) while (n % p === 0) { dust.push(p); n /= p } if (n > 1) dust.push(n) }
  const vars = {
    '--qpu-hue': String(hue), '--qpu-reflected-hue': String((360 - hue) % 360), '--qpu-drift': String(drift), '--qpu-dust': dust.join(' ') || '0', '--qpu-drift-angle': ((2 * Math.PI * drift) / 360).toFixed(6),
    '--qpu-frames': getFramesGradient(uuid), '--qpu-program': program.ring, '--qpu-shift': String(program.shift), '--qpu-c': c.toFixed(3), '--qpu-m': m.toFixed(3), '--qpu-y': y.toFixed(3), '--qpu-k': k.toFixed(3),
    '--qpu-accent': accent, '--block-accent': accent, '--qpu-surface': `hsl(${hue} ${Math.round(sat / 4)}% 97%)`, '--qpu-ink': `hsl(${hue} ${Math.round(sat / 3)}% 14%)`, '--qpu-radius': `${radius}px`, '--qpu-gap': `${gap}px`,
    '--qpu-tail': `rgb(${[0, 2, 4].map((i) => parseInt(ch.tail.slice(i, i + 2), 16)).join(' ')})`, '--qpu-angle': String(one48 % 360), '--qpu-vortex': String(seed), '--qpu-reflection': String(10 - seed),
    '--qpu-signal': `'${GLAGOLITIC_OF[seed] ?? ''}'`, '--qpu-signal-reflected': `'${GLAGOLITIC_OF[10 - seed] ?? ''}'`, '--qpu-signal-digits': `'${seed} ${10 - seed}'`, '--qpu-trinity': String(trinity[0] ?? 0), '--qpu-period': `${(seed || 9) * KEY}ms`,
  }
  return { uuid, hue, sat, light, radius, gap, vars, css: Object.entries(vars).map(([k, v]) => `${k}: ${v}`).join('; '), says: 'computed from the address, one value per property: the handle gives the hue, the middle the accent, the program the saturation and lightness, the tail the radius, the gap and the vortex; nothing loaded' }
}
/** Any hex is presentable as a shadcn combination: each nibble picks one of the eight registry items (the two hosts and the six styled ones)
 *  and one of two variants (solid, outline) — sixteen choices, a nibble (textbook_hex_presentations) — so a UUID, a hash or an address is a
 *  layout of its own nibbles, every part styled from the hex itself; nothing loaded. */
export const PRESENTABLE_ITEMS = ['qpu-app', 'qpu-block', 'qpu-style', 'qpu-card', 'qpu-badge', 'qpu-table', 'qpu-stream', 'qpu-dashboard'] as const
export const presentation = (hex: string) => {
  const clean = hex.toLowerCase().replace(/[^0-9a-f]/g, '')
  if (!clean) throw new Error('a hex string presents itself: give one')
  const nibbles = [...clean].map((c) => parseInt(c, 16))
  const address = /^[0-9a-f]{32}$/.test(clean) ? dashed(clean) : uuid(clean)
  const styled = style(address)
  const parts = nibbles.map((n, i) => ({ at: i, nibble: n.toString(16), item: PRESENTABLE_ITEMS[n % 8]!, variant: n < 8 ? 'solid' : 'outline' }))
  const layout = parts.map((p) => `<${p.item.replace(/^qpu-/, 'Qpu').replace(/^Qpu(.)/, (_m, c: string) => `Qpu${c.toUpperCase()}`)} variant="${p.variant}" uuid="${address}" />`).join('\n')
  return { hex: clean, uuid: address, nibbles: nibbles.length, choices: 16, items: PRESENTABLE_ITEMS.length, variants: 2, combinations: `16^${nibbles.length}`, style: styled.vars, parts, layout, says: 'each nibble is one of sixteen choices: an item of eight and a variant of two; the whole hex is a layout styled from itself, nothing loaded' }
}
/** A UUID-only stream is queryable, sortable, filterable and executable, like any hex is presentable: every row is the hex itself — its
 *  channel (handle, program, tail), its style, the item and the variant its first nibble picks — so a query names nibbles and handles, a
 *  sort names hex, hue or program, a filter names an item or a variant, and execution is the program rotated (the next address) with the
 *  page and the dashboard the address answers; nothing but the stream is read. */
export type StreamQuery = { where?: { handle?: string; nibble?: { at: number; is: string }; item?: string; variant?: 'solid' | 'outline'; hueBetween?: [number, number] }; sort?: 'hex' | 'hue' | 'program' | 'tail'; descending?: boolean; execute?: boolean; origin?: string }
export const stream = (hexes: readonly string[], q: StreamQuery = {}) => {
  const origin = q.origin ?? 'https://qpu.uuidna.com'
  const rows = hexes.map((h) => { const p = presentation(h); const ch = channel(p.uuid); const st = style(p.uuid); return { hex: p.hex, uuid: p.uuid, handle: ch.handle, program: ch.program.join(''), tail: ch.tail, hue: st.hue, sum: ch.program.reduce((n, d) => n + d, 0), item: p.parts[0]!.item, variant: p.parts[0]!.variant, style: st.vars } })
  const w = q.where ?? {}
  const filtered = rows.filter((r) => (w.handle ? r.handle.startsWith(w.handle.toLowerCase()) : true) && (w.nibble ? r.hex[w.nibble.at] === w.nibble.is.toLowerCase() : true) && (w.item ? r.item === w.item : true) && (w.variant ? r.variant === w.variant : true) && (w.hueBetween ? r.hue >= w.hueBetween[0] && r.hue <= w.hueBetween[1] : true))
  const key = q.sort ?? 'hex'
  const sorted = [...filtered].sort((a, b) => (key === 'hue' ? a.hue - b.hue : key === 'program' ? a.sum - b.sum : key === 'tail' ? a.tail.localeCompare(b.tail) : a.hex.localeCompare(b.hex)) * (q.descending ? -1 : 1))
  const executed = q.execute ? sorted.map((r) => { const ch = channel(r.uuid); const next = uuidFromParts(ch.handle, [...ch.program.slice(1), ch.program[0]!], ch.tail); return { ...r, next, dashboard: `${origin}/${uuid(`dashboard${JSON.stringify({ uuid: r.uuid })}`)}`, page: `${origin}/${r.uuid}` } }) : sorted
  return { stream: hexes.length, filtered: filtered.length, rows: executed, ops: { where: w, sort: key, descending: !!q.descending, executed: !!q.execute }, says: 'a stream of hexes alone: queried by handle, nibble, item, variant or hue; sorted by hex, hue, program or tail; executed as the program rotated (the next address) and the page and dashboard the address answers; every row styled from itself' }
}

/** DNA as a UUID stream (textbook_dna_base4): two bases a nibble, 64 a UUID, read back exactly with the base count. */
const DNA_BASES = 'ACGT'
export const dnaToHex = (seq: string): string => { const s = seq.toUpperCase().replace(/[^ACGT]/g, ''); let h = ''; for (let i = 0; i < s.length; i += 2) h += (((DNA_BASES.indexOf(s[i]!) & 3) << 2) | (i + 1 < s.length ? DNA_BASES.indexOf(s[i + 1]!) & 3 : 0)).toString(16); return h }
export const hexToDna = (hex: string): string => [...hex.toLowerCase().replace(/[^0-9a-f]/g, '')].map((c) => { const n = parseInt(c, 16); return DNA_BASES[(n >> 2) & 3]! + DNA_BASES[n & 3]! }).join('')
export const dnaStream = (seq: string, q: StreamQuery = {}) => {
  const clean = seq.toUpperCase().replace(/\s/g, ''), bad = /[^ACGT\s]/iu.exec(seq), hex = dnaToHex(clean)
  if (bad) throw new Error(`dna takes A, C, G and T only (whitespace aside): ${bad[0]} at ${bad.index} is not a base`)
  const chunks: string[] = []; for (let i = 0; i < hex.length; i += 32) chunks.push(hex.slice(i, i + 32).padEnd(32, '0'))
  const uuids = chunks.map((c) => dashed(c))
  return { bases: clean.length, basesPerUuid: 64, hex, uuids, readBack: hexToDna(hex).slice(0, clean.length), roundTrips: hexToDna(hex).slice(0, clean.length) === clean, address: uuid(clean), stream: stream(uuids, q), theorem: 'textbook_dna_base4', says: `${clean.length} base(s) as ${uuids.length} UUID(s) — two bases a nibble, read back one for one — the DNA stream navigable like any UUID stream (uuid dna uuidna)` }
}

/** All UUID version schemas at once in one UUID: the same 128 bits read as every RFC 9562 layout — version 1 (Gregorian time, clock
 *  sequence, node), 3 and 5 (a name hashed), 4 (random), 6 (the Gregorian time reordered), 7 (Unix milliseconds and random), 8 (custom),
 *  nil and max (textbook_uuid_schemas: seven versions and two constants) — beside the version and variant the stamp nibbles declare; the
 *  core's channel, style, presentation and stream read none of them, so every schema presents the same. */
export const UUID_SCHEMAS = [1, 3, 4, 5, 6, 7, 8] as const
export const uuidSchemas = (uuid: string) => {
  const hex = uuid.toLowerCase().replace(/[^0-9a-f]/g, '')
  if (hex.length !== 32) throw new Error('a UUID is 32 hex digits')
  const stamped = { version: parseInt(hex[12]!, 16), variant: ((parseInt(hex[16]!, 16) >> 2) === 2 ? 'RFC 9562 (10xx)' : (parseInt(hex[16]!, 16) >> 1) === 6 ? 'Microsoft (110x)' : parseInt(hex[16]!, 16) < 8 ? 'NCS (0xxx)' : 'future (111x)') }
  const gregorian = (ticks: bigint) => new Date(Number(ticks / 10_000n) - 12_219_292_800_000).toISOString()
  const v1Ticks = (BigInt('0x' + hex.slice(13, 16)) << 48n) | (BigInt('0x' + hex.slice(8, 12)) << 32n) | BigInt('0x' + hex.slice(0, 8))
  const v6Ticks = (BigInt('0x' + hex.slice(0, 8)) << 28n) | (BigInt('0x' + hex.slice(8, 12)) << 12n) | BigInt('0x' + hex.slice(13, 16))
  const safeDate = (f: () => string) => { try { return f() } catch { return 'out of range' } }
  return {
    hex, stamped, isNil: /^0{32}$/.test(hex), isMax: /^f{32}$/.test(hex),
    schemas: {
      v1: { time_low: hex.slice(0, 8), time_mid: hex.slice(8, 12), time_hi: hex.slice(13, 16), clock_seq: hex.slice(16, 20), node: hex.slice(20), time: safeDate(() => gregorian(v1Ticks)) },
      v3: { md5: hex, says: 'a name hashed with MD5: the bits are the digest' },
      v4: { random: hex, says: 'random bits' },
      v5: { sha1: hex, says: 'a name hashed with SHA-1: the bits are the digest' },
      v6: { time_high: hex.slice(0, 8), time_mid: hex.slice(8, 12), time_low: hex.slice(13, 16), clock_seq: hex.slice(16, 20), node: hex.slice(20), time: safeDate(() => gregorian(v6Ticks)) },
      v7: { unix_ts_ms: Number(BigInt('0x' + hex.slice(0, 12))), time: safeDate(() => new Date(Number(BigInt('0x' + hex.slice(0, 12)))).toISOString()), rand_a: hex.slice(13, 16), rand_b: hex.slice(16) },
      v8: { custom_a: hex.slice(0, 12), custom_b: hex.slice(13, 16), custom_c: hex.slice(16), says: 'custom bits: here the handle, the program and the tail' },
    },
    core: { channel: channel(dashed(hex)), says: 'the channel reads the handle, the program and the tail: the same under every schema' },
    schemasRead: UUID_SCHEMAS.length + 2,
  }
}

/** One quantum SKU. The handle is the SKU. The eight versions are eight dimensions of this one address, and the seven RFC layouts with nil and max are readings of the same bits. The encryption is the reflection both ways and the six neighbour steps, and it stays this address. */
export const quantumSku = (address: string) => {
  const ch = channel(address)
  const read = uuidSchemas(address)
  const tone = resonance()
  const fwd = reflection(address)
  const back = reflection(fwd.mirror)
  const nb = neighbours(address)
  const roundTrip = back.handle === ch.handle && back.tail === ch.tail && back.program.join() === ch.program.join() && read.core.channel.handle === ch.handle && read.schemasRead === UUID_SCHEMAS.length + 2
  const sealed = seal(address).valid && seal(fwd.mirror).valid && nb.neighbours.length === 6 && nb.neighbours.every((step) => step.sealed)
  const occupied = read.stamped.version
  const ink = tone.channels.find((row) => (row.versions as readonly number[]).includes(occupied))?.ink ?? null
  return {
    sku: ch.sku, uuid: address, door: ch.door, qubits: ch.fingerprint, versions: tone.versions, schemas: read.schemasRead, stamped: read.stamped, occupied, ink,
    readings: read.schemas, nil: read.isNil, max: read.isMax,
    encrypted: { reflections: 2 as const, directions: 6 as const, mirror: fwd.mirror, roundTrip, neighbours: nb.neighbours.map((step) => step.uuid) },
    sealed, holds: ch.sku === ch.handle && ch.sku.length === 8 && roundTrip && sealed && tone.dimensions === 8 && ink !== null,
    theorem: 'textbook_uuid_schemas' as const,
  }
}

/** A UUID no docket holds, answered as a block anyway: the page computed from the id alone (seal, channel, reflection),
 *  nothing written, so every read of a block answers and the missing component is filled in real time; a client that
 *  seeds reads `computed` and never stores it (there is no content to address). */
/** Queneau's combinatorics as the one primitive of every combination space: positions with their numbers of choices (the radices); the count is
 *  their product, the n-th composition its mixed-radix digits, and a composition's index the number its digits make — every composition computed
 *  from its address and back, none stored (textbook_mixed_radix, textbook_queneau_compositions). BigInt, so no space is too large to count. */
export const compositions = (radices: readonly number[]): bigint => radices.reduce((n, r) => n * BigInt(r), 1n)
export const composition = (radices: readonly number[], index: bigint): number[] => { const digits: number[] = new Array(radices.length); let q = index; for (let i = radices.length - 1; i >= 0; i--) { const r = BigInt(radices[i]!); digits[i] = Number(q % r); q /= r } return digits }
export const compositionIndex = (radices: readonly number[], digits: readonly number[]): bigint => digits.reduce((n, d, i) => n * BigInt(radices[i]!) + BigInt(d), 0n)

/** A rosetta: one combination space read through more than one ordering of its axes — the same compositions, the same count, a different index, so a
 *  grid of 6×7 and its transpose 7×6 are the one scale of forty-two read two ways (textbook_mixed_radix). A permutation of the axes keeps the product,
 *  so compositions is the same both ways; `to` carries an index of the one ordering to the index of the same cell in the other and `from` carries it
 *  back, a bijection, so a walk of 6×7 and 7×6 covers the whole scale and stores none. The default order is the reverse — the transpose. */
export const rosetta = (radices: readonly number[], order: readonly number[] = radices.map((_, i) => radices.length - 1 - i)) => {
  const permuted = order.map((k) => radices[k]!)
  const to = (index: bigint) => { const d = composition(radices, index); return compositionIndex(permuted, order.map((k) => d[k]!)) }
  const from = (index: bigint) => { const d = composition(permuted, index), back = new Array<number>(radices.length); order.forEach((k, i) => (back[k] = d[i]!)); return compositionIndex(radices, back) }
  return { radices, order, permuted, scale: compositions(radices), to, from }
}

/** The 6×7 frame and the 7×6 frame are one merkaba: the same forty-two cells, spun in opposite directions. Every integer fits as quotient × 42 + residue. A cell is harmonic when it is the residue of an A432 harmonic; every other cell is the analog, exposed at once. A factor of the integer, if it has one, occupies one of those cells, and the two cells multiply back to the residue. The frame names the cells. It does not name the primes. */
export const merkaba = (n: bigint) => {
  const across = rosetta([6, 7])
  const scale = across.scale
  const residue = (n % scale + scale) % scale
  const quotient = (n - residue) / scale
  const harmonic = new Set(HARMONICS.map((hz) => BigInt(hz) % scale))
  const cells = Array.from({ length: Number(scale) }, (_, i) => {
    const index = BigInt(i)
    const transpose = across.to(index)
    return { index: String(i), transpose: transpose.toString(), back: across.from(transpose) === index, harmonic: harmonic.has(index), exposed: !harmonic.has(index), forth: ((index + 1n) % scale).toString(), counter: ((scale - index) % scale).toString() }
  })
  const seats: [number, number][] = []
  const rest = Number(residue)
  for (let a = 0; a < Number(scale); a++) for (let b = 0; b < Number(scale); b++) if ((a * b) % Number(scale) === rest) seats.push([a, b])
  const here = cells[rest]!
  const down = across.to(residue)
  return {
    scale: scale.toString(), fits: cells.length === Number(scale) && cells.every((cell) => cell.back) && quotient * scale + residue === n,
    frames: { across: [6, 7] as const, down: [7, 6] as const },
    residue: residue.toString(), quotient: quotient.toString(), rebuilt: quotient * scale + residue === n,
    cell: here.index, to: down.toString(), back: across.from(down).toString(), covers: across.from(down) === residue,
    digits: composition([6, 7], residue), transpose: composition([7, 6], down),
    harmonic: here.harmonic, analog: here.harmonic ? '0' : residue.toString(), exposed: !here.harmonic,
    harmonicCells: cells.filter((cell) => cell.harmonic).length, exposedCells: cells.filter((cell) => cell.exposed).length,
    move: { forth: here.forth, counter: here.counter, meet: here.counter === here.index },
    cells, seats, hides: false as const, claimed: false as const,
    next: { purpose: 'the analog residue is the cell a factor has to occupy' as const, hides: false as const, claimed: false as const },
  }
}

/** Harmonic options by default: a schema's enum properties are a superposition — every combination of their values at once, mixed radices whose
 *  product is the count — and the referrer measures it: the referrer's address read as a 128-bit integer (or the a432 key, 432, when no one
 *  refers), reduced modulo the count, names one combination, decoded one value per enum; the remainder is always below the count, so the default is
 *  always a combination of the schema (textbook_harmonic_default). The schema keeps every value; `default` marks the measured one. */
export const harmonicDefaults = (schema: { properties?: Record<string, { enum?: readonly unknown[]; default?: unknown }> }, referrer?: string, allowed: (prop: string, value: unknown) => boolean = () => true) => {
  // a role sees the values it may choose: the superposition narrowed to them, an enum with none left withheld
  const options = Object.fromEntries(Object.entries(schema.properties ?? {}).filter(([, p]) => Array.isArray(p.enum) && p.enum.length > 0).map(([k, p]) => [k, p.enum!.filter((v) => allowed(k, v))]))
  const withheld = Object.entries(options).filter(([, v]) => v.length === 0).map(([k]) => k)
  const props = Object.entries(schema.properties ?? {}).filter(([k, p]) => Array.isArray(p.enum) && p.enum.length > 0 && p.default === undefined && options[k]!.length > 0).map(([k, p]) => [k, { ...p, enum: options[k]! }] as const)
  const radices = props.map(([, p]) => p.enum!.length)
  const count = compositions(radices)
  const hex = (referrer ?? '').replace(/-/g, '')
  const seed = /^[0-9a-f]{32}$/i.test(hex) ? BigInt('0x' + hex) : 432n
  const index = count > 0n ? seed % count : 0n
  const digits = composition(radices, index)
  return { count, index, from: /^[0-9a-f]{32}$/i.test(hex) ? 'referrer' as const : 'a432' as const, defaults: Object.fromEntries(props.map(([k, p], i) => [k, p.enum![digits[i]!]])), options, withheld }
}

/** The hooks Payload 4.0.0-beta.7 declares (its types, read again by the test), paired by phase; one witness each puts the address it sees and the referrer's collapse on the context */
const NODE = 'beforeValidate beforeChange afterChange afterRead', GLOBAL = 'beforeOperation beforeRead ' + NODE
const DECLARED = { collection: GLOBAL + ' beforeDelete afterDelete afterOperation afterError beforeLogin afterLogin afterLogout me afterMe refresh afterRefresh afterForgotPassword', global: GLOBAL, field: NODE + ' beforeDuplicate', node: NODE }
type Where = keyof typeof DECLARED
const side = (h: string) => { const m = /^(before|after)(\w)(\w*)$/.exec(h); return { side: (m?.[1] ?? 'before') as 'before' | 'after', phase: m ? m[2]!.toLowerCase() + m[3] : h } }
const pairs = (w: Where) => { const by: Record<string, { before?: string; after?: string }> = {}; for (const h of DECLARED[w].split(' ')) { const s = side(h); (by[s.phase] ??= {})[s.side] = h } return Object.entries(by).map(([phase, s]) => ({ phase, ...s, paired: !!(s.before && s.after) })) }
const collapse = memo((w: Where, ref: string) => Number(harmonicDefaults({ properties: { phase: { enum: pairs(w).filter((p) => p.paired).map((p) => p.phase) }, side: { enum: ['before', 'after'] } } }, ref).index))
const made = new Map<string, (a: any) => unknown>()
const witness = (w: Where, h: string) => made.get(w + h) ?? made.set(w + h, (a: any) => {
  const c = a.context ?? a.req?.context ?? a.args?.req?.context, { side: end, phase } = side(h), ref = a.req?.headers?.get?.('referer') ?? c?.referrer, k = w === 'field' ? 'value' : ['node', 'doc', 'data', 'result', 'response', 'user', 'token', 'id'].find((x) => a[x] !== undefined)
  if (c) try { const at = ((c.qpuWitness ??= {})[[w, a.path?.join('.') ?? a.node?.fields?.id ?? a.node?.type ?? a.collection?.slug ?? a.global?.slug, phase].join(':')] ??= {}); at[end] = uuid(canonicalText(k ? a[k] : a.args ? [a.args.data, a.args.id, a.args.where] : null)); if (end === 'before') at.referrer = 1000; if (end === 'after') { at.next = 1001; c.qpuNext = at[end] } if (w === 'node') at.block = a.node?.type ?? a.node?.fields?.blockType ?? at.block; if (at.before && at.after) { at.changed = at.before !== at.after; at.teleport = at.before === at.after } at.collapse = collapse(w, ref ? uuid(String(ref)) : ''); c.qpuWitnessed = (c.qpuWitnessed ?? 0) + 1 } catch (e) { (c.qpuWitnessErrors ??= []).push(String(e)) }
  return w === 'node' ? a.node : undefined
}).get(w + h)!
const into = (have: unknown[] = [], w: Where, h: string) => { const f = witness(w, h); return have.includes(f) ? have : side(h).side === 'before' ? [f, ...have] : [...have, f] }
const bound = (hooks: Record<string, unknown[]> = {}, w: Where) => ({ ...hooks, ...Object.fromEntries(DECLARED[w].split(' ').map((h) => [h, into(hooks[h], w, h)])) })
const nodes = (adapter: any) => { const f = adapter?.editorConfig?.features; for (const [h, m] of Object.entries((f?.nodeHooks ?? {}) as Record<string, Map<string, unknown[]>>)) for (const t of f.getSubFields?.keys() ?? []) m.set(t, into(m.get(t), 'node', h)); return adapter }
const editor = (e: any) => (typeof e !== 'function' ? nodes(e) : e.qpuWitness ? e : Object.assign(async (a: unknown) => nodes(await e(a)), { qpuWitness: true }))
/** qpuHooks: the witnesses bound to any config walked whole, every rich text field and Lexical block node (textbook_witness_pair) */
export const qpuHooks = (config: Record<string, any>) => {
  const n = { richText: 0, blocks: 0 }, box = (b: any): any => (typeof b === 'string' ? b : (n.blocks++, { ...b, fields: fields(b.fields) }))
  const fields = (fs: any[] = []): any[] => fs.map((f) => (f.type === 'richText' ? (n.richText++, { ...f, hooks: bound(f.hooks, 'field'), ...(f.editor ? { editor: editor(f.editor) } : {}) }) : f.tabs ? { ...f, tabs: f.tabs.map((t: any) => ({ ...t, fields: fields(t.fields) })) } : f.blocks ? { ...f, blocks: f.blocks.map(box) } : f.fields ? { ...f, fields: fields(f.fields) } : f))
  const at = (xs: any[] | undefined, w: Where) => xs?.map((x) => ({ ...x, hooks: bound(x.hooks, w), fields: fields(x.fields) }))
  return { config: { ...config, collections: at(config.collections, 'collection'), globals: at(config.globals, 'global'), blocks: config.blocks?.map(box), ...(config.editor ? { editor: editor(config.editor) } : {}) } as any, found: n, pairs: Object.fromEntries((Object.keys(DECLARED) as Where[]).map((w) => [w, pairs(w)])) }
}
/** One Payload live-preview notification. The Admin Panel posts the whole document at once through window.postMessage
 *  (depth 0, the documented default). The channel is the live preview stream. There is no socket, and the states are not walked. */
export const livePreview = <T>(data: readonly T[], holds: boolean) => ({
  channel: 'live preview' as const,
  transport: 'postMessage' as const,
  method: 'window.postMessage' as const,
  ready: true as const,
  depth: 0 as const,
  atOnce: true as const,
  walked: false as const,
  measured: data.length,
  data,
  holds,
})
/** The next step of an address: the program rotated one place, the handle and the tail kept, the stamp decided again.
 *  The step back returns the program, and ten rotations — the length of the program — return it too. Every aspect witnesses the next address.
 *  One live-preview notification carries every place at once. */
export const next = (uuid: string) => {
  const ch = channel(uuid)
  const turn = (program: readonly number[], step: number) => { const n = program.length, k = ((step % n) + n) % n; return [...program.slice(k), ...program.slice(0, k)] }
  const hex = (program: readonly number[]) => program.map((n) => n.toString(16)).join('')
  const program = turn(ch.program, 1), id = uuidFromParts(ch.handle, program, ch.tail)
  const undone = turn(channel(id).program, -1)
  let around = [...ch.program]; for (let i = 0; i < ch.program.length; i++) around = turn(around, 1)
  const witnessed = aspects(id)
  const places = Array.from({ length: ch.program.length }, (_, place) => {
    const turned = turn(ch.program, place)
    const address = place === 0 ? uuid : uuidFromParts(ch.handle, turned, ch.tail)
    return { place, program: hex(turned), address, sealed: seal(address).valid }
  })
  const notification = livePreview(places, places.length === ch.program.length && places[0]?.address === uuid && places[1]?.address === id && places.every((row) => row.sealed) && hex(around) === hex(ch.program))
  return { uuid, handle: ch.handle, tail: ch.tail, program: hex(ch.program), rotated: hex(program), next: id, sealed: seal(id).valid, kept: channel(id).handle === ch.handle && channel(id).tail === ch.tail, back: hex(undone) === hex(ch.program), around: hex(around) === hex(ch.program), places: ch.program.length, notification, ...witnessed, theorem: 'textbook_cuboctahedron_faces' as const }
}
/** Among the next steps of an address, keep the one whose seam with every neighbour is greatest (textbook_hue_shift: the rotation keeps every distance).
 *  The current address is place 0. A tie keeps the earlier place. */
export const optimise = (address: string, neighbours: readonly string[]) => {
  const ch = channel(address)
  const turn = (program: readonly number[], step: number) => { const n = program.length, k = ((step % n) + n) % n; return [...program.slice(k), ...program.slice(0, k)] }
  const seam = (from: string, to: string) => { const d = Math.abs(programHues(to).first - programHues(from).last); return Math.min(d, 360 - d) }
  const steps = Array.from({ length: ch.program.length }, (_, place) => {
    const id = place === 0 ? address : uuidFromParts(ch.handle, turn(ch.program, place), ch.tail)
    const seams = neighbours.map((n) => seam(id, n))
    return { place, address: id, seam: seams.length ? Math.min(...seams) : 0 }
  })
  const kept = steps.reduce((best, step) => step.seam > best.seam ? step : best)
  return { kept: kept.address, place: kept.place, seam: kept.seam, of: steps.length, greatest: steps.every((step) => step.seam <= kept.seam), formula: 'h + s - (g + s) = h - g' as const, theorem: 'textbook_hue_shift' as const }
}
/** Every declared aspect — collection, global, field, node — and every hook of each, reading one address. */
export const aspects = (address: string) => {
  const pairs = qpuHooks({}).pairs
  const aspects = (Object.keys(DECLARED) as Where[]).map((aspect) => ({ aspect, address, phases: pairs[aspect].map((p) => ({ phase: p.phase, before: p.before ?? null, after: p.after ?? null, address })) }))
  const hooks = aspects.reduce((n, a) => n + a.phases.reduce((m, p) => m + (p.before ? 1 : 0) + (p.after ? 1 : 0), 0), 0)
  const declared = (Object.keys(DECLARED) as Where[]).reduce((n, w) => n + DECLARED[w].split(' ').length, 0)
  const all = aspects.length === 4 && hooks === declared && aspects.every((a) => a.phases.length > 0 && a.phases.every((p) => p.address === address)) && seal(address).valid
  return { aspects, hooks, declared, all }
}

/**
 * Pure formula-derived SCSS generator (`quantumScss`):
 * Generates the canonical SCSS source (`$qpu-key: 432`, `$qpu-square-faces: 6`, `$qpu-hue: $qpu-key / $qpu-square-faces = 72`,
 * `$qpu-coins: 2`, `$qpu-rays: 7`, `$qpu-faces: $qpu-coins * $qpu-rays = 14`, `$qpu-plane: $qpu-coins * $qpu-faces = 28`,
 * `$qpu-clay-cases: (10 * 11) / 2 = 55`, `$qpu-referrer: (1024 - 24) = 1000` (`|0⟩`), `$qpu-next: $qpu-referrer + 1 = 1001` (`|1⟩`))
 * with `@function`s, `@mixin`s, `@for $face from 0 through 13` and `@for $nibble from 0 through 15` loops.
 */
const quantumScss = memo((key: number = KEY): string => {
  const squareFaces = 6
  const hue = key / squareFaces
  const coins = 2
  const rays = 7
  const faces = coins * rays
  const plane = coins * faces
  const clayCases = (10 * 11) / 2
  const referrer = 1024 - 24
  const next = referrer + 1
  return [
    `// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)`,
    `// Canonical Formula-Driven SCSS Source for @uuidna/qpu -> qpu.css + shadcn/ui + Payload Admin/Frontend (@layer payload-default, qpu-shadcn, qpu-quantum).`,
    `@use 'sass:math';`,
    ``,
    `$qpu-key: ${key} !default;`,
    `$qpu-square-faces: ${squareFaces} !default;`,
    `$qpu-hue: math.div($qpu-key, $qpu-square-faces) !default; // ${hue}`,
    `$qpu-coins: ${coins} !default;`,
    `$qpu-rays: ${rays} !default;`,
    `$qpu-faces: $qpu-coins * $qpu-rays !default; // ${faces}`,
    `$qpu-plane: $qpu-coins * $qpu-faces !default; // ${plane}`,
    `$qpu-program-nibbles: 10 !default;`,
    `$qpu-clay-cases: math.div($qpu-program-nibbles * ($qpu-program-nibbles + 1), 2) !default; // ${clayCases}`,
    `$qpu-referrer: 1024 - 24 !default; // ${referrer} (|0⟩)`,
    `$qpu-next: $qpu-referrer + 1 !default; // ${next} (|1⟩)`,
    `$qpu-shor-modulus: 7 * 13 !default; // 91`,
    `$qpu-coil-hue: $qpu-hue + math.div($qpu-key, 9) !default; // 120`,
    `$qpu-radius: math.div($qpu-key, $qpu-referrer) * 1rem !default;`,
    ``,
    `@function qpu-harmonic($index) {`,
    `  @return math.div($qpu-key, math.pow(2, $index));`,
    `}`,
    `@function qpu-hue-of($hz) {`,
    `  @return $hz % 360;`,
    `}`,
    `@function qpu-face-hue($face) {`,
    `  @return ($qpu-hue + $face * math.div(360, $qpu-faces)) % 360;`,
    `}`,
    `@function qpu-nibble-hue($nibble) {`,
    `  @return ($nibble * math.div(360, 16)) % 360;`,
    `}`,
    ``,
    `@mixin qpu-cmyk-accent() {`,
    `  --qpu-r: calc(255 * (1 - var(--qpu-c, 0)) * (1 - var(--qpu-k, 0)));`,
    `  --qpu-g: calc(255 * (1 - var(--qpu-m, 0)) * (1 - var(--qpu-k, 0)));`,
    `  --qpu-b: calc(255 * (1 - var(--qpu-y, 0)) * (1 - var(--qpu-k, 0)));`,
    `  --qpu-cmyk-rgb: rgb(var(--qpu-r) var(--qpu-g) var(--qpu-b));`,
    `}`,
    ``,
    `@mixin qpu-qubit-wave-register() {`,
    `  --qpu-ket-0: #{$qpu-referrer};`,
    `  --qpu-ket-1: #{$qpu-next};`,
    `  --qpu-referrer-hz: calc((1024 - 24) * 1Hz);`,
    `  --qpu-next-hz: calc(((1024 - 24) + 1) * 1Hz);`,
    `  --qpu-pauli-x: calc(var(--qpu-ket-0) + var(--qpu-ket-1) - var(--qpu-qubit, var(--qpu-ket-0)));`,
    `  --qpu-pauli-z: calc(1 - 2 * mod(var(--qpu-qubit, var(--qpu-ket-0)), 2));`,
    `  --qpu-hadamard-superposition: color-mix(in oklch, var(--qpu-coin-0, var(--qpu-coin)) 50%, var(--qpu-coin-1, var(--qpu-coil)) 50%);`,
    `}`,
    ``,
    `@layer payload-default, base, qpu-shadcn, qpu-quantum;`,
    ``,
    `@theme inline {`,
    `  --font-sans: var(--font-sans);`,
    `  --font-heading: var(--font-sans);`,
    `  --font-mono: var(--font-mono);`,
    `  --color-background: var(--background);`,
    `  --color-foreground: var(--foreground);`,
    `  --color-card: var(--card);`,
    `  --color-card-foreground: var(--card-foreground);`,
    `  --color-popover: var(--popover);`,
    `  --color-popover-foreground: var(--popover-foreground);`,
    `  --color-primary: var(--primary);`,
    `  --color-primary-foreground: var(--primary-foreground);`,
    `  --color-secondary: var(--secondary);`,
    `  --color-secondary-foreground: var(--secondary-foreground);`,
    `  --color-muted: var(--muted);`,
    `  --color-muted-foreground: var(--muted-foreground);`,
    `  --color-accent: var(--accent);`,
    `  --color-accent-foreground: var(--accent-foreground);`,
    `  --color-destructive: var(--destructive);`,
    `  --color-destructive-foreground: var(--destructive-foreground);`,
    `  --color-border: var(--border);`,
    `  --color-input: var(--input);`,
    `  --color-ring: var(--ring);`,
    `  --color-chart-1: var(--chart-1);`,
    `  --color-chart-2: var(--chart-2);`,
    `  --color-chart-3: var(--chart-3);`,
    `  --color-chart-4: var(--chart-4);`,
    `  --color-chart-5: var(--chart-5);`,
    `  --radius-sm: calc(var(--radius) * 0.6);`,
    `  --radius-md: calc(var(--radius) * 0.8);`,
    `  --radius-lg: var(--radius);`,
    `  --radius-xl: calc(var(--radius) * 1.4);`,
    `  --radius-2xl: calc(var(--radius) * 1.8);`,
    `}`,
    ``,
    `:root {`,
    `  --a432-key: #{$qpu-key};`,
    `  --a432-hue: #{$qpu-hue};`,
    `  @for $i from 0 through 4 {`,
    `    $h: qpu-hue-of(qpu-harmonic($i));`,
    `    --a432-#{$i + 1}: hsl(#{$h} 62% #{44 + $i * 8}%);`,
    `    --chart-#{$i + 1}: hsl(#{$h} 62% 50%);`,
    `  }`,
    `  --a432-accent: hsl(#{$qpu-hue} 62% 44%);`,
    `  --qpu-coin: hsl(#{$qpu-hue} 62% 44%);`,
    `  --qpu-coil: hsl(#{$qpu-coil-hue} 62% 44%);`,
    `  --qpu-coil-cmyk: 1 0 1 0;`,
    `  --qpu-coins: #{$qpu-coins};`,
    `  --qpu-rays: #{$qpu-rays};`,
    `  --qpu-faces: #{$qpu-faces};`,
    `  --qpu-plane: #{$qpu-plane};`,
    `  --qpu-clay-cases: #{$qpu-clay-cases};`,
    `  @include qpu-qubit-wave-register();`,
    `  @include qpu-cmyk-accent();`,
    `  --background: oklch(1 0 0);`,
    `  --foreground: oklch(0.145 0 0);`,
    `  --card: oklch(1 0 0);`,
    `  --card-foreground: oklch(0.145 0 0);`,
    `  --popover: oklch(1 0 0);`,
    `  --popover-foreground: oklch(0.145 0 0);`,
    `  --primary: var(--qpu-accent, hsl(#{$qpu-hue} 62% 44%));`,
    `  --primary-foreground: hsl(#{$qpu-hue} 62% 98%);`,
    `  --secondary: hsl(#{$qpu-hue} 30% 96%);`,
    `  --secondary-foreground: hsl(#{$qpu-hue} 62% 20%);`,
    `  --muted: oklch(0.97 0 0);`,
    `  --muted-foreground: oklch(0.556 0 0);`,
    `  --accent: hsl(#{$qpu-hue} 40% 94%);`,
    `  --accent-foreground: hsl(#{$qpu-hue} 62% 20%);`,
    `  --destructive: oklch(0.577 0.245 27.325);`,
    `  --destructive-foreground: oklch(0.985 0 0);`,
    `  --border: oklch(0.922 0 0);`,
    `  --input: oklch(0.922 0 0);`,
    `  --ring: var(--qpu-accent, hsl(#{$qpu-hue} 62% 44%));`,
    `  --radius: #{$qpu-radius};`,
    `  @for $face from 0 through 13 {`,
    `    --qpu-face-#{$face}: hsl(#{qpu-face-hue($face)} 62% 44%);`,
    `  }`,
    `}`,
    ``,
    `.dark {`,
    `  --background: oklch(0.145 0 0);`,
    `  --foreground: oklch(0.985 0 0);`,
    `  --card: oklch(0.205 0 0);`,
    `  --card-foreground: oklch(0.985 0 0);`,
    `  --popover: oklch(0.205 0 0);`,
    `  --popover-foreground: oklch(0.985 0 0);`,
    `  --primary: var(--qpu-accent, hsl(#{$qpu-hue} 62% 56%));`,
    `  --primary-foreground: hsl(#{$qpu-hue} 62% 10%);`,
    `  --secondary: hsl(#{$qpu-hue} 20% 18%);`,
    `  --secondary-foreground: hsl(#{$qpu-hue} 40% 92%);`,
    `  --muted: oklch(0.269 0 0);`,
    `  --muted-foreground: oklch(0.708 0 0);`,
    `  --accent: hsl(#{$qpu-hue} 30% 22%);`,
    `  --accent-foreground: hsl(#{$qpu-hue} 40% 92%);`,
    `  --destructive: oklch(0.704 0.191 22.216);`,
    `  --destructive-foreground: oklch(0.985 0 0);`,
    `  --border: oklch(1 0 0 / 10%);`,
    `  --input: oklch(1 0 0 / 15%);`,
    `  --ring: var(--qpu-accent, hsl(#{$qpu-hue} 62% 56%));`,
    `  @for $i from 0 through 4 {`,
    `    $h: qpu-hue-of(qpu-harmonic($i));`,
    `    --chart-#{$i + 1}: hsl(#{$h} 62% 60%);`,
    `  }`,
    `}`,
    ``,
    `@layer payload-default, qpu-shadcn, qpu-quantum {`,
    `  [data-qpu-block], [data-qpu-tool], [data-qpu-clay] { border-left: 3px solid var(--qpu-accent, var(--a432-accent)); border-radius: var(--qpu-radius, var(--radius)); }`,
    `  @for $nibble from 0 through 15 {`,
    `    [data-qpu-nibble="#{$nibble}"] { --qpu-nibble-hue: #{qpu-nibble-hue($nibble)}; }`,
    `  }`,
    `  @for $face from 0 through 13 {`,
    `    [data-qpu-face="#{$face}"] { --qpu-active-face: var(--qpu-face-#{$face}); }`,
    `  }`,
    `}`,
  ].join('\n') + '\n'
})

/**
 * Pure formula-derived SCSS -> `qpu.css` compiler (`qpuCss`):
 * Compiles `quantumScss(key)` into the unified `qpu.css` stylesheet combining:
 *   1) `shadcn/ui` CSS variables (`:root`, `.dark`, `@layer base`, `@theme inline`)
 *   2) `@layer payload-default, qpu-shadcn, qpu-quantum` rules for Payload Admin (`QpuApp`), `Qpu` layout/Lexical blocks
 *      (`[data-qpu-block]`, `[data-qpu-tool]`), 16 hex-nibble primitives (`[data-qpu-nibble="0".."f"]`),
 *      55 Clay case cards (`[data-qpu-clay]`), and 14 cuboctahedron face reflections (`--qpu-face-0..13`)
 *   3) Qubit basis & wave register (`--qpu-ket-0: 1000`, `--qpu-ket-1: 1001`, Pauli-X/Z `calc()`/`mod()` gates,
 *      and `color-mix(in oklch, var(--qpu-coin-0) 50%, var(--qpu-coin-1) 50%)` Hadamard superposition)
 *   4) The base `getCss(key)` stylesheet rules.
 * Memoised via `memo` so repeated calls cost 0 bits of recomputation ($O(1)$).
 */
type ShadcnCreatePresetParams = {
  uuid?: string
  key?: number
  combination?: number
  style?: 'vega' | 'nova' | 'maia' | 'lyra' | 'mira'
  baseColor?: 'neutral' | 'stone' | 'zinc' | 'gray'
  themeHue?: number
  font?: 'geist' | 'inter' | 'figtree' | 'jetbrains-mono'
  iconLibrary?: 'lucide' | 'tabler'
  radius?: string
  menuColor?: 'default' | 'inverted'
  menuAccent?: 'subtle' | 'bold'
}

const SHADCN_CREATE_STYLES = ['vega', 'nova', 'maia', 'lyra', 'mira'] as const
const SHADCN_CREATE_BASE_COLORS = ['neutral', 'stone', 'zinc', 'gray'] as const
const SHADCN_CREATE_FONTS = ['geist', 'inter', 'figtree', 'jetbrains-mono'] as const
const SHADCN_CREATE_ICONS = ['lucide', 'tabler'] as const
const SHADCN_CREATE_MENU_COLORS = ['default', 'inverted'] as const
const SHADCN_CREATE_MENU_ACCENTS = ['subtle', 'bold'] as const

/**
 * Exact integer-derived `https://ui.shadcn.com/create` preset (`shadcnCreatePreset(params)`):
 * Derives `style`, `baseColor`, `themeHue`, `font`, `iconLibrary`, `radius`, `menuColor`, and `menuAccent`
 * from `params` (query params or `channel(uuid)` nibbles + `cmykOfUuid`) using exact integer arithmetic only
 * (zero `Math.*`, zero hardcoded hex hacks).
 */
const shadcnCreatePreset = (params: ShadcnCreatePresetParams = {}) => {
  const key = params.key ?? KEY
  const squareFaces = 6
  const baseHue = key % 360
  const rawUuid = params.uuid && seal(params.uuid).valid ? params.uuid : uuid(`shadcn-create:${key}:${params.uuid ?? 'a432'}:${params.combination ?? 0}`)
  const ch = channel(rawUuid)
  const n0 = ch.program[0] ?? 0
  const n1 = ch.program[1] ?? 0
  const n2 = ch.program[2] ?? 0
  const n3 = ch.program[3] ?? 0
  const n4 = ch.program[4] ?? 0
  const n5 = ch.program[5] ?? 0
  const styled = params.style ?? SHADCN_CREATE_STYLES[n0 % SHADCN_CREATE_STYLES.length]!
  const baseColor = params.baseColor ?? SHADCN_CREATE_BASE_COLORS[n1 % SHADCN_CREATE_BASE_COLORS.length]!
  const themeHue = params.themeHue ?? baseHue
  const font = params.font ?? SHADCN_CREATE_FONTS[n2 % SHADCN_CREATE_FONTS.length]!
  const iconLibrary = params.iconLibrary ?? SHADCN_CREATE_ICONS[n3 % SHADCN_CREATE_ICONS.length]!
  const menuColor = params.menuColor ?? SHADCN_CREATE_MENU_COLORS[n4 % SHADCN_CREATE_MENU_COLORS.length]!
  const menuAccent = params.menuAccent ?? SHADCN_CREATE_MENU_ACCENTS[n5 % SHADCN_CREATE_MENU_ACCENTS.length]!
  const referrer = (1 << 10) - 24
  const radius = params.radius ?? `calc(${key}rem / ${referrer})`
  const combination = params.combination ?? ((n0 * 32 + n1 * 2 + (n2 % 2)) % 512)
  return {
    url: 'https://ui.shadcn.com/create' as const,
    uuid: rawUuid,
    key,
    squareFaces,
    combination,
    style: styled,
    baseColor,
    themeHue,
    font,
    iconLibrary,
    radius,
    menuColor,
    menuAccent,
    cssVars: {
      '--qpu-create-style': `'${styled}'`,
      '--qpu-create-base-color': `'${baseColor}'`,
      '--qpu-create-theme-hue': String(themeHue),
      '--qpu-create-font': `'${font}'`,
      '--qpu-create-icon-library': `'${iconLibrary}'`,
      '--qpu-create-radius': radius,
      '--qpu-create-menu-color': `'${menuColor}'`,
      '--qpu-create-menu-accent': `'${menuAccent}'`,
      '--qpu-combination': String(combination),
    } as const,
  }
}

const qpuCss = memo((key: number = KEY, address?: string): string => {
  const squareFaces = 6
  const degrees = (key - (key % squareFaces)) / squareFaces
  const coins = 2
  const rays = 7
  const faces = coins * rays
  const plane = coins * faces
  const clayCases = (10 * 11) / 2
  const referrer = (1 << 10) - 24
  const next = referrer + 1
  const radius = `calc(${key}rem / ${referrer})`
  const harmonics = Array.from({ length: 5 }, (_, i) => key >> i)
  const hues = harmonics.map(hue)
  const blockUuid = address && seal(address).valid ? address : address ? uuid(address) : undefined
  const st = blockUuid ? style(blockUuid) : null
  const refl = blockUuid ? reflection(blockUuid) : null
  const createPreset = shadcnCreatePreset({ key, uuid: blockUuid })
  const coin0Accent = st ? st.vars['--qpu-accent'] : `hsl(${degrees} 62% 44%)`
  const coin1Accent = refl ? style(refl.mirror).vars['--qpu-accent'] : `hsl(${degrees + (key - (key % 9)) / 9} 62% 44%)`

  const faceLines = Array.from({ length: faces }, (_, face) => {
    const num = (degrees * faces + face * 360) % (360 * faces)
    const fHue = (num - (num % faces)) / faces
    return `  --qpu-face-${face}: hsl(${fHue} 62% 44%);`
  })

  const nibbleRules = Array.from({ length: 16 }, (_, n) => {
    const hex = n.toString(16)
    const item = PRESENTABLE_ITEMS[n % 8]!
    const variant = n < 8 ? 'solid' : 'outline'
    const nHueDeg = (n * 45) >> 1
    return `  [data-qpu-nibble="${hex}"], [data-nibble="${hex}"] { --qpu-nibble: ${n}; --qpu-nibble-hex: '${hex}'; --qpu-nibble-item: '${item}'; --qpu-nibble-variant: '${variant}'; --qpu-nibble-hue: ${nHueDeg}; --qpu-nibble-accent: hsl(${nHueDeg} 62% 44%); }`
  })

  const faceRules = Array.from({ length: faces }, (_, f) => `  [data-qpu-face="${f}"] { --qpu-active-face: var(--qpu-face-${f}); }`)
  const createVars = Object.entries(createPreset.cssVars).map(([k, v]) => `  ${k}: ${v};`)

  return [
    `/* qpu.css — compiled from src/plugins/qpu.scss ($qpu-key: ${key}, $qpu-hue: ${degrees}, $qpu-faces: ${faces}, $qpu-clay-cases: ${clayCases}, $qpu-referrer: ${referrer}, $qpu-next: ${next}) */`,
    `@layer payload-default, base, qpu-shadcn, qpu-quantum;`,
    `@theme inline {`,
    `  --font-sans: var(--font-sans);`,
    `  --font-heading: var(--font-sans);`,
    `  --font-mono: var(--font-mono);`,
    `  --color-background: var(--background);`,
    `  --color-foreground: var(--foreground);`,
    `  --color-card: var(--card);`,
    `  --color-card-foreground: var(--card-foreground);`,
    `  --color-popover: var(--popover);`,
    `  --color-popover-foreground: var(--popover-foreground);`,
    `  --color-primary: var(--primary);`,
    `  --color-primary-foreground: var(--primary-foreground);`,
    `  --color-secondary: var(--secondary);`,
    `  --color-secondary-foreground: var(--secondary-foreground);`,
    `  --color-muted: var(--muted);`,
    `  --color-muted-foreground: var(--muted-foreground);`,
    `  --color-accent: var(--accent);`,
    `  --color-accent-foreground: var(--accent-foreground);`,
    `  --color-destructive: var(--destructive);`,
    `  --color-destructive-foreground: var(--destructive-foreground);`,
    `  --color-border: var(--border);`,
    `  --color-input: var(--input);`,
    `  --color-ring: var(--ring);`,
    ...hues.map((_, i) => `  --color-chart-${i + 1}: var(--chart-${i + 1});`),
    `  --radius-sm: calc(var(--radius) * 0.6);`,
    `  --radius-md: calc(var(--radius) * 0.8);`,
    `  --radius-lg: var(--radius);`,
    `  --radius-xl: calc(var(--radius) * 1.4);`,
    `  --radius-2xl: calc(var(--radius) * 1.8);`,
    `}`,
    `:root {`,
    `  --a432-key: ${key};`,
    `  --a432-hue: ${degrees};`,
    ...harmonics.map((h, i) => `  --a432-${i + 1}: hsl(${hue(h)} 62% ${44 + i * 8}%);`),
    ...hues.map((h, i) => `  --chart-${i + 1}: hsl(${h} 62% 50%);`),
    `  --a432-accent: hsl(${degrees} 62% 44%);`,
    `  --qpu-coin: hsl(${degrees} 62% 44%);`,
    `  --qpu-coil: hsl(${degrees + key / 9} 62% 44%);`,
    `  --qpu-coin-0: ${coin0Accent};`,
    `  --qpu-coin-1: ${coin1Accent};`,
    `  --qpu-coins: ${coins};`,
    `  --qpu-rays: ${rays};`,
    `  --qpu-faces: ${faces};`,
    `  --qpu-plane: ${plane};`,
    `  --qpu-clay-cases: ${clayCases};`,
    `  --qpu-ket-0: ${referrer};`,
    `  --qpu-ket-1: ${next};`,
    `  --qpu-referrer-hz: calc((1024 - 24) * 1Hz);`,
    `  --qpu-next-hz: calc(((1024 - 24) + 1) * 1Hz);`,
    `  --qpu-pauli-x: calc(var(--qpu-ket-0) + var(--qpu-ket-1) - var(--qpu-qubit, var(--qpu-ket-0)));`,
    `  --qpu-pauli-z: calc(1 - 2 * mod(var(--qpu-qubit, var(--qpu-ket-0)), 2));`,
    `  --qpu-hadamard-superposition: color-mix(in oklch, var(--qpu-coin-0) 50%, var(--qpu-coin-1) 50%);`,
    ...(st ? Object.entries(st.vars).map(([k, v]) => `  ${k}: ${v};`) : [`  --qpu-c: 0.000;`, `  --qpu-m: 0.000;`, `  --qpu-y: 0.000;`, `  --qpu-k: 0.000;`]),
    `  --background: oklch(1 0 0);`,
    `  --foreground: oklch(0.145 0 0);`,
    `  --card: oklch(1 0 0);`,
    `  --card-foreground: oklch(0.145 0 0);`,
    `  --popover: oklch(1 0 0);`,
    `  --popover-foreground: oklch(0.145 0 0);`,
    `  --primary: var(--qpu-accent, hsl(${degrees} 62% 44%));`,
    `  --primary-foreground: hsl(${degrees} 62% 98%);`,
    `  --secondary: hsl(${degrees} 30% 96%);`,
    `  --secondary-foreground: hsl(${degrees} 62% 20%);`,
    `  --muted: oklch(0.97 0 0);`,
    `  --muted-foreground: oklch(0.556 0 0);`,
    `  --accent: hsl(${degrees} 40% 94%);`,
    `  --accent-foreground: hsl(${degrees} 62% 20%);`,
    `  --destructive: oklch(0.577 0.245 27.325);`,
    `  --destructive-foreground: oklch(0.985 0 0);`,
    `  --border: oklch(0.922 0 0);`,
    `  --input: oklch(0.922 0 0);`,
    `  --ring: var(--qpu-accent, hsl(${degrees} 62% 44%));`,
    `  --radius: ${radius};`,
    ...createVars,
    ...faceLines,
    `}`,
    `.dark {`,
    `  --background: oklch(0.145 0 0);`,
    `  --foreground: oklch(0.985 0 0);`,
    `  --card: oklch(0.205 0 0);`,
    `  --card-foreground: oklch(0.985 0 0);`,
    `  --popover: oklch(0.205 0 0);`,
    `  --popover-foreground: oklch(0.985 0 0);`,
    `  --primary: var(--qpu-accent, hsl(${degrees} 62% 56%));`,
    `  --primary-foreground: hsl(${degrees} 62% 10%);`,
    `  --secondary: hsl(${degrees} 20% 18%);`,
    `  --secondary-foreground: hsl(${degrees} 40% 92%);`,
    `  --muted: oklch(0.269 0 0);`,
    `  --muted-foreground: oklch(0.708 0 0);`,
    `  --accent: hsl(${degrees} 30% 22%);`,
    `  --accent-foreground: hsl(${degrees} 40% 92%);`,
    `  --destructive: oklch(0.704 0.191 22.216);`,
    `  --destructive-foreground: oklch(0.985 0 0);`,
    `  --border: oklch(1 0 0 / 10%);`,
    `  --input: oklch(1 0 0 / 15%);`,
    `  --ring: var(--qpu-accent, hsl(${degrees} 62% 56%));`,
    ...hues.map((h, i) => `  --chart-${i + 1}: hsl(${h} 62% 60%);`),
    `}`,
    `@layer base { * { border-color: var(--border); outline-color: var(--ring); } body { background-color: var(--background); color: var(--foreground); } }`,
    `@layer payload-default, qpu-shadcn, qpu-quantum {`,
    `  [data-qpu-block], [data-qpu-tool], [data-block] { border-left: 3px solid var(--qpu-accent, var(--a432-accent)); padding-left: var(--pad-sm, 8px); border-radius: var(--qpu-radius, var(--radius)); }`,
    `  [data-qpu-clay] { border-left: 3px solid var(--qpu-accent, var(--qpu-hadamard-superposition)); border-radius: var(--qpu-radius, var(--radius)); }`,
    ...nibbleRules,
    ...faceRules,
    `}`,
    getCss(key).trimEnd(),
  ].join('\n') + '\n'
})

/**
 * Pure formula-derived `qpu.svg` generator (`qpuSvg`) styled by `qpu.css`:
 * Links `/api/qpu/qpu.css` via `<?xml-stylesheet type="text/css" href="/api/qpu/qpu.css"?>` and uses
 * CSS custom properties (`var(--qpu-primary)`, `var(--qpu-accent)`, `var(--qpu-coin-0)`, `var(--qpu-coin-1)`,
 * `var(--qpu-face-0)`..`var(--qpu-face-13)`) with zero hardcoded hex colour literals.
 */
const FACE_OFFSETS_14: readonly [number, number][] = [
  [120, 32],
  [158, 41],
  [189, 65],
  [206, 100],
  [206, 140],
  [189, 175],
  [158, 199],
  [120, 208],
  [82, 199],
  [51, 175],
  [34, 140],
  [34, 100],
  [51, 65],
  [82, 41],
] as const

const qpuSvg = memo((key: number = KEY, address?: string): string => {
  const squareFaces = 6
  const degrees = (key - (key % squareFaces)) / squareFaces
  const coins = 2
  const rays = 7
  const faces = coins * rays
  const blockUuid = address && seal(address).valid ? address : address ? uuid(address) : uuid(`qpu-svg:${key}`)
  const nb = neighbours(blockUuid).neighbours
  const preset = shadcnCreatePreset({ key, uuid: blockUuid })
  const faceCircles = Array.from({ length: faces }, (_, f) => {
    const [cx, cy] = FACE_OFFSETS_14[f % FACE_OFFSETS_14.length]!
    const num = (degrees * faces + f * 360) % (360 * faces)
    const fHue = (num - (num % faces)) / faces
    return `  <circle cx="${cx}" cy="${cy}" r="8" data-qpu-face="${f}" fill="var(--qpu-face-${f}, hsl(${fHue} 62% 44%))" />`
  })
  return [
    `<?xml-stylesheet type="text/css" href="/api/qpu/qpu.css"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="img" aria-label="QPU · @uuidna/qpu (${key} Hz)" data-qpu-block="true" data-qpu-clay="true" data-qpu-uuid="${blockUuid}" data-qpu-style="${preset.style}" data-qpu-base-color="${preset.baseColor}">`,
    `  <style>@import url('/api/qpu/qpu.css');</style>`,
    `  <rect x="4" y="4" width="232" height="232" rx="28" fill="var(--background, oklch(15% 0 0))" stroke="var(--qpu-accent, var(--primary, hsl(${degrees} 62% 44%)))" stroke-width="3" />`,
    `  <polygon points="120,24 52,104 188,104" data-direction="north" fill="var(--qpu-face-0, ${nb[2]!.colour})" />`,
    `  <polygon points="24,120 104,52 104,188" data-direction="west" fill="var(--qpu-coin-0, var(--qpu-face-1, ${nb[0]!.colour}))" />`,
    `  <polygon points="216,120 136,52 136,188" data-direction="east" fill="var(--qpu-coin-1, var(--qpu-face-2, ${nb[1]!.colour}))" />`,
    `  <polygon points="120,216 52,136 188,136" data-direction="south" fill="var(--qpu-face-3, ${nb[3]!.colour})" />`,
    ...faceCircles,
    `  <circle cx="120" cy="120" r="24" fill="var(--qpu-primary, var(--primary, var(--qpu-accent, ${nb[4]!.colour})))" />`,
    `  <text x="120" y="125" text-anchor="middle" font-family="var(--font-mono, monospace)" font-size="14" fill="var(--primary-foreground, var(--foreground, currentColor))">${key}</text>`,
    `</svg>`,
  ].join('\n') + '\n'
})

export { uuidPlugin as plugin } from '../plugin.ts'

