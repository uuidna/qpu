// hologram — THE OCTET READ AS QPU: named planes, one sequence, fourteen faces.
//
// Desk wiring. Numbers and addresses. The hardware QPU lane stays empty; this module does not dispatch a device.

/** Trinity — debit width. */
export const TRINITY = 3
/** Captain coins. */
export const COINS = 2
/** Hexbit tile width. */
export const HEXBIT_BITS = 4
/** Vortex base. */
export const BASE = TRINITY ** 2

/** 2^HEXBIT_BITS states — a climb, never Math.pow. */
export const HEXBIT_STATES: number = (() => {
  let s = 1
  for (let i = 0; i < HEXBIT_BITS; i++) s = s * 2
  return s
})()

/** One uuid in hexbit tiles — states × coins. */
export const UUID_HEXBITS = HEXBIT_STATES * COINS
/** Handle width in hexbit tiles. */
export const HANDLE_HEXBITS = UUID_HEXBITS / HEXBIT_BITS
/** VE faces: handle tiles plus hexbit plus coins. */
export const VE_FACES = HANDLE_HEXBITS + HEXBIT_BITS + COINS

/** seal_ten — void · orbit · axis. */
export const SEAL_TEN = [0, 1, 2, 4, 8, 7, 5, 3, 6, 9] as const

/** Digital root in ℤ/9 (1..9; multiples of 9 map to 9). */
export function digitalRoot(n: number): number {
  const r = ((n % 9) + 9) % 9
  return r === 0 ? 9 : r
}

/** Mirror through the void — 1−n mod 9; void root 0 is fixed. */
export function throughVoid(d: number): number {
  return d === 0 ? 0 : digitalRoot(1 - d)
}

/** The worker host. Licensed as its own entry — no wildcard. */
export const QPU_HOST = 'qpu.uuidna.com'

/** Captain-coins deposit — same wallet as uuidna. */
export const DONATE_URL = 'https://revolut.me/ceccec'

/** Captain-coins deposit URL: https://revolut.me/ceccec?note=${encodeURIComponent(referrer)} */
export function donateUrl(referrer: string): string {
  const raw = referrer.trim()
  if (!raw) throw new Error('donateUrl: referrer is empty')
  return `${DONATE_URL}?note=${encodeURIComponent(raw)}`
}

/** BindingPoint pentagram — CPU, GPU, RAM, CACHE, STORAGE. */
export const QPU_POINTS = ['CPU', 'GPU', 'RAM', 'CACHE', 'STORAGE'] as const

export const qpuSeatOf = () => ({
  name: 'QPU' as const,
  seat: 'empty' as const,
  admits: 'nothing',
})

export const qpuWidthOf = () => ({
  points: [...QPU_POINTS],
  pentagram: QPU_POINTS.length,
  binds: 'cpu',
})

export const qpuHologramOf = () => ({
  foundation: 0,
  debit: TRINITY,
  credit: HEXBIT_BITS + COINS,
  pentagram: QPU_POINTS.length,
  fold: BASE - COINS,
  octet: HANDLE_HEXBITS,
  veFaces: VE_FACES,
  seal: [...SEAL_TEN],
})

/** Opposite VE faces are throughVoid of each other — counted, not dispatched. */
export const qpuFacesOf = (): readonly { face: number; opposite: number }[] =>
  Array.from({ length: VE_FACES }, (_, i) => ({ face: i, opposite: throughVoid(i % BASE) }))

export const qpuMachineOf = () => ({
  host: QPU_HOST,
  seat: qpuSeatOf(),
  width: qpuWidthOf(),
  hologram: qpuHologramOf(),
})
