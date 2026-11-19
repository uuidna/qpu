// The one clock of the tree, a UUID program: a pure module takes its time as `now` (ms since the epoch) and only this program reads the
// process clock; no other file calls Date.now() or new Date(), and the entropy audit counts a clock anywhere else.
// clock(), stamp() and seconds() read the host's NTP-synchronised wall clock, a quartz counter, for UTC instants; JavaScript time has no
// leap second, so stamp() never writes 23:59:60. tick() reads the monotonic clock (W3C High Resolution Time) for durations only: never
// adjusted, but frozen between I/O on Cloudflare Workers.
/** Milliseconds since the epoch: the `now` given, else the process clock. */
export const clock = (now?: number): number => (typeof now === 'number' && Number.isFinite(now) ? now : Date.now())
/** Milliseconds on the monotonic clock: durations only, never an instant. */
export const tick = (): number => performance.now()
/** The ISO 8601 instant of clock(now). */
export const stamp = (now?: number): string => new Date(clock(now)).toISOString()
/** Seconds since the epoch, whole: the `now` given in seconds or milliseconds (a value past the year 2286 in seconds is read as milliseconds), else the process clock. */
export const seconds = (now?: number): number => (typeof now === 'number' && Number.isFinite(now) ? (now > 1e11 ? Math.floor(now / 1000) : Math.floor(now)) : Math.floor(Date.now() / 1000))
