// The scannable stream: a block's address spread over time as a multidimensional animation — one frame per character of the UUID
// (36 frames of 108 ms, the third harmonic's period: 36 × 108 = 3888 = 432 × 9, the vortex period, textbook_scan_stream), each digit a hue
// (sixteen hues, 22.5° apart), a glyph (the Glagolitic numeral of the digit) and an angle (its place in the stream), the four dashes
// black frames — so a single frame links nothing and only a stream of frames, sampled by a device, reads the address back (scanOf).
// The same stream is the device's randomness: the phase at which an interaction lands is one of 3888 milliseconds (eleven bits a sample,
// textbook_phase_bits), folded with the device's own crypto nonce into a seed the seal tool takes (entropyOf). Used in the Open Graph
// image of every block (an animated SVG: a scraper shows one frame, a stream reads the link) and in the shadcn items (the CSS of the stream).
import { uuidOf, sealOf } from './blocks.js'
import { SCAN, framesOf, KEY, coilColourOf } from './theme.js'
import { usageOrderOf } from './toolboxes/billing.js'

/** Usage rated by the chain's combinatorics: a stream of n samples is a chain of n − 1 links; every full period (36 frames, 35 links) is one call;
 *  the first period is the coin (verification is algebra, free), every further period a coil (the fusion: the device keeps streaming under the
 *  licence), the address space 16^32 = 2^128 (textbook_chain_bits); the colour of the rate is the coin's or the coil's. */
export const rateOf = (samples: number, currency = 'eur') => {
  const calls = Math.ceil(samples / SCAN.frames), free = Math.min(1, calls), coils = calls - free
  const colour = coilColourOf()
  return { samples, links: Math.max(samples - 1, 0), linksPerPeriod: SCAN.frames - 1, calls, free, coils, bits: 32 * 4, chains: '16^32 = 2^128', fused: coils > 0, colour: coils > 0 ? colour.coil : colour.coin, order: usageOrderOf(calls, currency, undefined, { free, coils }), theorems: ['textbook_scan_links', 'textbook_chain_bits', 'textbook_free_or_coil'], says: `${samples} sample(s): ${Math.max(samples - 1, 0)} link(s), ${calls} call(s): ${free} coin, ${coils} coil(s)${coils > 0 ? ' (fused: green)' : ''}` }
}

export type EntropySample = { phase: number; t: number; nonce?: number; x?: number; y?: number }
export type ScanSample = { t: number; hue: number | null }

/** The animated SVG of the stream: a frame per character, discrete, repeating; 1200 × 630 for Open Graph. One frame shows one character and nothing else. */
export const scanSvgOf = (uuid: string, width = 1200, height = 630): string => {
  const frames = framesOf(uuid)
  const dur = `${(SCAN.periodMs / 1000).toFixed(3)}s`
  const fills = frames.map((f) => (f.hue === null ? 'hsl(0 0% 0%)' : `hsl(${f.hue} 62% 44%)`)).join(';')
  const keyTimes = frames.map((_, i) => (i / frames.length).toFixed(4)).join(';')
  const glyphs = frames.map((f, i) => `<text x="50%" y="56%" text-anchor="middle" font-family="serif" font-size="${Math.round(height * 0.5)}" fill="hsl(0 0% 100%)" opacity="0"><animate attributeName="opacity" values="0;1;0" keyTimes="0;${(i / frames.length).toFixed(4)};${((i + 1) / frames.length).toFixed(4)}" calcMode="discrete" dur="${dur}" repeatCount="indefinite"/>${f.glyph}</text>`).join('')
  const ray = `<g transform-origin="50% 50%"><rect x="50%" y="2%" width="2" height="12%" fill="hsl(0 0% 100%)" opacity="0.8"/><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${dur}" repeatCount="indefinite"/></g>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${frames[0]!.hue === null ? 'hsl(0 0% 0%)' : `hsl(${frames[0]!.hue} 62% 44%)`}"><animate attributeName="fill" values="${fills}" keyTimes="${keyTimes}" calcMode="discrete" dur="${dur}" repeatCount="indefinite"/></rect>${ray}${glyphs}</svg>`
}

/** The stream read back: samples (time, hue) from a device, placed by their time within the period, the nearest hue a digit, a black sample a dash.
 *  Fewer than 36 distinct frames link nothing (impossibleFromOne); 36 frames read the address, whose seal decides the link. */
export const scanOf = (samples: readonly ScanSample[]) => {
  const slots = new Map<number, (string | null)[]>()
  for (const s of samples) { const i = Math.floor(((s.t % SCAN.periodMs) + SCAN.periodMs) % SCAN.periodMs / SCAN.frameMs); const d = s.hue === null ? '-' : (Math.round(((s.hue % 360) + 360) % 360 / SCAN.hueStep) % 16).toString(16); slots.set(i, [...(slots.get(i) ?? []), d]) }
  const chars = [...Array(SCAN.frames).keys()].map((i) => { const votes = slots.get(i) ?? []; if (!votes.length) return null; const by = new Map<string | null, number>(); for (const v of votes) by.set(v, (by.get(v) ?? 0) + 1); return [...by.entries()].sort((a, b) => b[1] - a[1])[0]![0] })
  const read = chars.filter((c) => c !== null).length
  const text = chars.map((c) => c ?? '?').join('')
  const complete = read === SCAN.frames
  const dashesInPlace = [8, 13, 18, 23].every((i) => chars[i] === '-')
  const uuid = complete && dashesInPlace ? text : null
  const seal = uuid ? sealOf(uuid) : null
  const linked = !!(seal && seal.valid)
  const checks = [
    { check: 'frames', passed: complete, evidence: `${read} of ${SCAN.frames} frames sampled` },
    { check: 'dashes', passed: complete ? dashesInPlace : null, evidence: complete ? (dashesInPlace ? 'the four dashes in place' : 'the dashes out of place: not a UUID') : 'undecided until every frame is read' },
    { check: 'seal', passed: uuid ? (seal?.valid ?? false) : null, evidence: uuid ? (seal?.valid ? 'the seal holds' : 'the seal fails') : 'no address read' },
  ]
  return { samples: samples.length, framesRead: read, of: SCAN.frames, text, uuid: uuid ?? text, read: uuid, rate: rateOf(samples.length), linked, valid: linked, decided: checks.filter((c) => c.passed !== null).length, checks, cost: 'one pass over the samples (a vote per frame), one modular power for the seal', seal, impossibleFromOne: read < SCAN.frames, says: uuid ? (seal?.valid ? 'the stream read the address and its seal holds: linked' : 'the stream read 36 characters but the seal fails: not an address') : `${read} of ${SCAN.frames} frames read: a stream links only when every frame was sampled` }
}

/** The device's randomness: the phase of the animation at each interaction (eleven bits a sample within the 3888 ms period) and the device's own
 *  nonce (crypto.getRandomValues, 32 bits) folded by the content hash into a seed; nothing here is random by itself, the device's stream is. */
export const entropyOf = (samples: readonly EntropySample[]) => {
  const phaseBits = Math.floor(Math.log2(SCAN.periodMs))
  const bits = samples.reduce((n, s) => n + phaseBits + (typeof s.nonce === 'number' ? 32 : 0), 0)
  const seed = uuidOf(JSON.stringify(samples.map((s) => [Math.floor(((s.phase % SCAN.periodMs) + SCAN.periodMs) % SCAN.periodMs), Math.floor(s.t), s.nonce ?? 0, s.x ?? 0, s.y ?? 0])))
  const phase = samples.length ? Math.floor(((samples[samples.length - 1]!.phase % SCAN.periodMs) + SCAN.periodMs) % SCAN.periodMs) : 0
  return { samples: samples.length, periodMs: SCAN.periodMs, phaseBits, bits, seed, phase, rate: rateOf(samples.length), angle: Math.round((phase / SCAN.periodMs) * 360), frame: Math.floor(phase / SCAN.frameMs), key: KEY, theorem: 'textbook_phase_bits', says: `${samples.length} interaction(s) with the stream: ${bits} bits (${phaseBits} a phase, 32 a nonce), folded to the seed ${seed}; the last phase ${phase} ms is the frame ${Math.floor(phase / SCAN.frameMs)} and the angle ${Math.round((phase / SCAN.periodMs) * 360)}°` }
}
