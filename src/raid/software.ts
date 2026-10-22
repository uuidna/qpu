// Software RAID: RAID-1 (mirror) and RAID-5 (XOR parity, one disk's worth of redundancy). Pure functions over bytes.
// Scope, stated plainly: this is the software layout and its recovery. It is not a hardware adapter, not firmware, and it
// does not talk to a disk. A lost disk is a `null` in the array the caller holds.

export type Raid = { level: 1 | 5; disks: number; length: number; chunk: number }
export type Encoded = { layout: Raid; disks: (Uint8Array | null)[] }

const xorInto = (acc: Uint8Array, other: Uint8Array): void => {
  for (let i = 0; i < acc.length; i++) acc[i] = (acc[i] ?? 0) ^ (other[i] ?? 0)
}

/** RAID-1: every disk holds a full copy. Needs at least two disks. */
export const encodeRaid1 = (data: Uint8Array, disks: number): Encoded => {
  if (disks < 2) throw new Error('RAID-1 needs at least two disks')
  const copies = Array.from({ length: disks }, () => data.slice())
  return { layout: { level: 1, disks, length: data.length, chunk: data.length }, disks: copies }
}

/** RAID-5: data split across disks-1 chunks, plus one XOR parity chunk. Needs at least three disks. */
export const encodeRaid5 = (data: Uint8Array, disks: number): Encoded => {
  if (disks < 3) throw new Error('RAID-5 needs at least three disks')
  const dataDisks = disks - 1
  const chunk = Math.max(1, Math.ceil(data.length / dataDisks))
  const out: Uint8Array[] = []
  for (let d = 0; d < dataDisks; d++) {
    const part = new Uint8Array(chunk)
    part.set(data.subarray(d * chunk, Math.min(data.length, (d + 1) * chunk)))
    out.push(part)
  }
  const parity = new Uint8Array(chunk)
  for (const part of out) xorInto(parity, part)
  out.push(parity)
  return { layout: { level: 5, disks, length: data.length, chunk }, disks: out }
}

/** Recover the data. One lost disk is rebuilt; two or more lost disks is refused, never guessed. */
export const decode = (enc: Encoded): Uint8Array => {
  const { layout, disks } = enc
  const lost = disks.map((d, i) => (d === null ? i : -1)).filter((i) => i >= 0)
  if (lost.length > 1 && layout.level === 5) throw new Error(`RAID-5 cannot recover ${lost.length} lost disks`)
  if (layout.level === 1) {
    const copy = disks.find((d): d is Uint8Array => d !== null)
    if (!copy) throw new Error('RAID-1: every copy is lost')
    return copy.slice(0, layout.length)
  }
  // RAID-5: rebuild a lost data chunk from the others (parity included); a lost parity is simply recomputed.
  const dataDisks = layout.disks - 1
  const chunks: Uint8Array[] = []
  for (let d = 0; d < dataDisks; d++) {
    const present = disks[d]
    if (present) { chunks.push(present); continue }
    const rebuilt = new Uint8Array(layout.chunk)
    for (let j = 0; j < layout.disks; j++) if (j !== d) xorInto(rebuilt, disks[j]!)
    chunks.push(rebuilt)
  }
  const data = new Uint8Array(dataDisks * layout.chunk)
  chunks.forEach((c, d) => data.set(c, d * layout.chunk))
  return data.slice(0, layout.length)
}
