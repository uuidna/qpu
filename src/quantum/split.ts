// A UUID split into time and space: versions 1 and 6 carry a 60-bit timestamp (100-nanosecond intervals since 1582-10-15), version 7 a 48-bit
// Unix millisecond one, every other version none. The time bits read as an integer and as a date, the space bits as everything else, the
// version and variant counted apart, and the timeless UUID — the same UUID with its time zeroed, version and variant kept — so the place a
// UUID names is read apart from the moment it was made. Pure.
const GREGORIAN_TO_UNIX_100NS = 0x01b21dd213814000n
export const splitOf = (uuid: string) => {
  const hex = uuid.toLowerCase().replace(/-/g, '')
  if (!/^[0-9a-f]{32}$/.test(hex)) throw new Error('split takes a UUID of 32 hex digits')
  const version = parseInt(hex[12]!, 16)
  const variantBits = 2
  let time: bigint | null = null, timeBits = 0, zeroed = hex
  const zero = (h: string, ranges: [number, number][]) => { let out = h; for (const [a, b] of ranges) out = out.slice(0, a) + '0'.repeat(b - a) + out.slice(b); return out }
  if (version === 7) { timeBits = 48; time = BigInt('0x' + hex.slice(0, 12)); zeroed = zero(hex, [[0, 12]]) }
  else if (version === 1) { timeBits = 60; time = (BigInt('0x' + hex.slice(13, 16)) << 48n) | (BigInt('0x' + hex.slice(8, 12)) << 32n) | BigInt('0x' + hex.slice(0, 8)); zeroed = zero(hex, [[0, 12], [13, 16]]) }
  else if (version === 6) { timeBits = 60; time = (BigInt('0x' + hex.slice(0, 12)) << 12n) | BigInt('0x' + hex.slice(13, 16)); zeroed = zero(hex, [[0, 12], [13, 16]]) }
  const ms = time === null ? null : version === 7 ? time : (time - GREGORIAN_TO_UNIX_100NS) / 10000n
  const iso = ms === null || ms < -8640000000000000n || ms > 8640000000000000n ? null : new Date(Number(ms)).toISOString()
  const dash = (h: string) => `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
  const spaceBits = 128 - timeBits - 4 - variantBits
  return { uuid: dash(hex), version, timeBits, versionBits: 4, variantBits, spaceBits, time: time === null ? null : time.toString(), iso, timeless: dash(zeroed), timed: timeBits > 0, says: timeBits ? `version ${version}: ${timeBits} bits of time (${iso}), ${spaceBits} of space, 4 of version and ${variantBits} of variant make 128; the timeless UUID is the place without the moment` : `version ${version} carries no time: all ${spaceBits} bits are space, the UUID is already timeless`, theorem: 'textbook_uuid_time_space' }
}
